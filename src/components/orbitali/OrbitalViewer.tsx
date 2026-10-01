'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Minus, Pause, Play, Plus } from 'lucide-react';
import { FILLING_ORDER, diagonalConfiguration, electronsBySublevel, isException, unpaired } from '@/lib/orbitali/configurazione';
import { ELEMENTI, configParts, elementBySymbol } from '@/lib/tools/tavola-periodica';
import { N_MAX, SUBLEVELS, angularNodes, clampOrbital, nodeSurfaces, orbitalName, orientationOrder, radialNodes, type Orbital, type OrbitalKind, type SectionPlane } from '@/lib/orbitali/idrogeno';
import { useToolState } from '@/components/tools/ToolSheet';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { FillingOrder } from './FillingOrder';
import { CLOUD_POINTS, OrbitalCloud } from './OrbitalCloud';
import { OrbitalGrid } from './OrbitalGrid';
import { OrbitalSection, SECTION_POINTS } from './OrbitalSection';

/**
 * The orbitals of the hydrogen atom, to look at and turn over (vault/Prodotti/Studenti/Orbitali atomici interattivi.md): the
 * cloud in three dimensions or a section of it, the orbital of the school books or the state in motion, the nodes,
 * and one scale for all the levels to compare them.
 */

type Figure = '3d' | 'sezione';

/** n, l, m, kind, wedge out, nodes shown, shared scale, figure, plane of the section, element in the table of sublevels, filling order shown. */
const DEFAULTS = { n: '2', l: '1', m: '0', tipo: 'reale', spicchio: '', nodi: '', scala: '', vista: '3d', piano: 'xz', el: '', ordine: '' };

const BOHR_PM = 52.918;
/** Lengths a scale bar may have, in picometres. */
const BAR_LENGTHS = [20, 50, 100, 200, 500, 1000, 2000, 5000];

const PLANES: { value: SectionPlane; label: string }[] = [
	{ value: 'xz', label: 'xz' },
	{ value: 'yz', label: 'yz' },
	{ value: 'xy', label: 'xy' }
];

type ViewerState = typeof DEFAULTS;

/** The viewer on a page of its own: the choice is written in the address, so it can be shared. */
export function OrbitalViewer() {
	const [state, set] = useToolState(DEFAULTS);
	return <Viewer state={state} set={set} />;
}

/** The viewer inside a lesson: the choice stays in the figure, and the lesson's address is left alone. */
export default function OrbitalExplorer() {
	const [state, setState] = useState(DEFAULTS);
	return <Viewer state={state} set={(patch) => setState((s) => ({ ...s, ...patch }))} />;
}

function Viewer({ state, set }: { state: ViewerState; set: (patch: Partial<ViewerState>) => void }) {
	const [playing, setPlaying] = useState(true);
	const [pixelsPerBohr, setPixelsPerBohr] = useState(0);

	const kind: OrbitalKind = state.tipo === 'complesso' ? 'complesso' : 'reale';
	const orbital = useMemo(() => clampOrbital({ n: Number(state.n) || 1, l: Number(state.l) || 0, m: Number(state.m) || 0, kind }), [state.n, state.l, state.m, kind]);
	const figure: Figure = state.vista === 'sezione' ? 'sezione' : '3d';
	const plane: SectionPlane = PLANES.some((p) => p.value === state.piano) ? (state.piano as SectionPlane) : 'xz';
	const cut = state.spicchio === '1';
	const nodes = state.nodi === '1';
	const sameScale = state.scala === 'uguale';
	const name = orbitalName(orbital);
	const surfaces = useMemo(() => nodeSurfaces(orbital), [orbital]);
	// The element whose electrons fill the table of sublevels, if one is chosen.
	const element = (state.el && elementBySymbol(state.el)) || null;
	const electrons = useMemo(() => (element ? electronsBySublevel(element) : null), [element]);
	const showOrder = state.ordine === '1';
	const stepElement = (by: number) => set({ el: ELEMENTI[(element ? element.z - 1 : by > 0 ? -1 : ELEMENTI.length) + by]?.symbol ?? '' });
	// The points move in the cloud, and in the section across the axis.
	const flows = kind === 'complesso' && orbital.m !== 0 && (figure === '3d' || plane === 'xy');

	// Who asks for less motion starts with the points still.
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect -- one read of the system setting after the first render
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
	}, []);

	const pick = (patch: Partial<Orbital>) => {
		const next = clampOrbital({ ...orbital, ...patch });
		set({ n: String(next.n), l: String(next.l), m: String(next.m), tipo: next.kind });
	};

	// In the same order as the boxes of the table of sublevels.
	const mOptions = orientationOrder(orbital.l, kind).map((m) => {
		const direction = orbitalName({ ...orbital, m }).direction;
		return { value: String(m), label: kind === 'reale' && direction ? direction : m > 0 ? `+${m}` : String(m).replace('-', '−') };
	});

	const full = `${name.level}${name.direction ? ` ${name.direction}` : ''}`;
	const label = figure === '3d' ? `Orbitale ${full} dell’atomo di idrogeno, come nuvola di punti.` : `Orbitale ${full} dell’atomo di idrogeno: i punti della nuvola nel piano ${plane}.`;
	const props = { orbital, nodes, sameScale, playing, onScale: setPixelsPerBohr, label };

	// The longest bar that stays under 150 pixels.
	const bar = BAR_LENGTHS.filter((pm) => (pm / BOHR_PM) * pixelsPerBohr <= 150).pop() ?? BAR_LENGTHS[0];
	const barWidth = (bar / BOHR_PM) * pixelsPerBohr;

	const nodeParts = [
		surfaces.spheres.length > 0 && (surfaces.spheres.length === 1 ? '1 sfera' : `${surfaces.spheres.length} sfere`),
		surfaces.cones.length > 0 && coneWords(surfaces.cones),
		surfaces.planes.length > 0 && (surfaces.planes.length === 1 ? '1 piano per l’asse' : `${surfaces.planes.length} piani per l’asse`),
		kind === 'complesso' && orbital.m !== 0 && 'l’asse verticale'
	].filter(Boolean);

	return (
		<div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
			<div className="flex min-w-0 flex-col gap-5">
				<div className="relative overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper">
					<div className="grid-paper pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
					{figure === '3d' ? <OrbitalCloud {...props} cut={cut} /> : <OrbitalSection {...props} plane={plane} />}
					<p className="pointer-events-none absolute top-3 left-4 font-display text-2xl font-semibold text-fg-strong">
						{name.level}
						{name.direction && <sub className="ml-0.5 text-base">{name.direction}</sub>}
					</p>
					<p className="pointer-events-none absolute top-4 right-4 font-mono text-xs text-fg-subtle">
						n = {orbital.n}, l = {orbital.l}, m = {String(orbital.m).replace('-', '−')}
					</p>
					{pixelsPerBohr > 0 && barWidth >= 12 && (
						<p className="pointer-events-none absolute right-4 bottom-3 flex flex-col items-end gap-1 font-mono text-xs text-fg-muted">
							{bar >= 1000 ? `${bar / 1000} nm` : `${bar} pm`}
							<span className="block h-1.5 border-x border-b border-fg-muted" style={{ width: barWidth }} aria-hidden="true" />
						</p>
					)}
					{flows && (
						<button
							type="button"
							onClick={() => setPlaying(!playing)}
							aria-label={playing ? 'Ferma il moto' : 'Avvia il moto'}
							className="absolute bottom-3 left-3 flex size-10 items-center justify-center rounded-xl border border-edge-strong bg-surface text-fg shadow-paper hover:bg-surface-2 focus-ring"
						>
							{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
						</button>
					)}
				</div>
				<div className="rounded-2xl border border-edge bg-surface p-4 shadow-paper">
					<div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
						<p className="label-mono m-0 text-fg-subtle">Tabella dei sottolivelli</p>
						<div className="flex items-center gap-1.5">
							<button type="button" onClick={() => stepElement(-1)} disabled={!element} aria-label="Elemento precedente" className="flex size-9 items-center justify-center rounded-lg border border-edge text-fg-muted hover:bg-surface-3 hover:text-fg disabled:opacity-40 focus-ring">
								<Minus className="size-4" aria-hidden="true" />
							</button>
							<select
								aria-label="Elemento di cui mostrare la configurazione elettronica"
								value={element?.symbol ?? ''}
								onChange={(e) => set({ el: e.target.value })}
								className="h-9 max-w-[13rem] rounded-lg border border-edge bg-surface px-2 py-0 text-sm leading-none text-fg shadow-paper outline-none focus:border-accent focus:ring-3 focus:ring-accent/20"
							>
								<option value="">Nessun elemento</option>
								{ELEMENTI.map((el) => (
									<option key={el.z} value={el.symbol}>
										{el.z} {el.symbol} {el.name}
									</option>
								))}
							</select>
							<button type="button" onClick={() => stepElement(1)} disabled={element?.z === ELEMENTI.length} aria-label="Elemento successivo" className="flex size-9 items-center justify-center rounded-lg border border-edge text-fg-muted hover:bg-surface-3 hover:text-fg disabled:opacity-40 focus-ring">
								<Plus className="size-4" aria-hidden="true" />
							</button>
						</div>
						<Check checked={showOrder} onChange={(on) => set({ ordine: on ? '1' : '' })}>
							Ordine di riempimento
						</Check>
					</div>
					<div className="flex flex-wrap items-start gap-x-8 gap-y-4">
						<div className="max-w-full overflow-x-auto pb-1">
							<OrbitalGrid orbital={orbital} onPick={pick} electrons={electrons} />
						</div>
						{showOrder && <FillingOrder occupied={electrons ? new Set(electrons.keys()) : null} />}
					</div>
					{element ? (
						<p className="mt-3 text-sm text-fg-muted" aria-live="polite">
							<span className="font-medium text-fg-strong">
								{element.name}, Z = {element.z}:
							</span>{' '}
							<ConfigText config={element.config} />
							{element.configPredicted && ' (prevista)'}. {unpairedText(unpaired(element))}
							{isException(element) && (
								<>
									{' '}
									È un’eccezione alla regola della diagonale, che darebbe <ConfigText config={expected(element.z, electrons!)} />.
								</>
							)}{' '}
							Le frecce sono gli elettroni: in ogni sottolivello occupano prima una casella ciascuno, poi si appaiano.
						</p>
					) : (
						<p className="mt-3 text-sm text-fg-muted">
							Ogni casella è un orbitale, come nello schema della configurazione elettronica: una per s, tre per p, cinque per d, sette per f. Un clic mostra l’orbitale. Scegli un elemento per vedere dove stanno i suoi elettroni.
						</p>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-4 rounded-2xl border border-edge bg-surface p-4 shadow-paper">
				<div className="grid grid-cols-2 gap-3">
					<Control label="Figura">
						<ToggleGroup
							options={[
								{ value: '3d', label: 'Nuvola' },
								{ value: 'sezione', label: 'Sezione' }
							]}
							value={figure}
							onChange={(vista: Figure) => set({ vista })}
							label="Figura"
							compact
						/>
					</Control>
					<Control label="Orbitale">
						<ToggleGroup
							options={[
								{ value: 'reale', label: 'Dei libri' },
								{ value: 'complesso', label: 'In moto' }
							]}
							value={kind}
							onChange={(tipo: OrbitalKind) => pick({ kind: tipo })}
							label="Orbitale"
							compact
						/>
					</Control>
				</div>
				{figure === 'sezione' && (
					<Control label="Piano della sezione">
						<ToggleGroup options={PLANES} value={plane} onChange={(piano: SectionPlane) => set({ piano })} label="Piano della sezione" compact />
					</Control>
				)}
				<Control label="Livello di energia, n">
					<ToggleGroup options={Array.from({ length: N_MAX }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))} value={String(orbital.n)} onChange={(n) => pick({ n: Number(n) })} label="Livello di energia, n" compact />
				</Control>
				<Control label="Forma, l">
					<ToggleGroup options={Array.from({ length: orbital.n }, (_, l) => ({ value: String(l), label: SUBLEVELS[l] }))} value={String(orbital.l)} onChange={(l) => pick({ l: Number(l) })} label="Forma, l" compact />
				</Control>
				<Control label="Orientazione, m">
					<div className="max-w-full overflow-x-auto">
						<ToggleGroup options={mOptions} value={String(orbital.m)} onChange={(m) => pick({ m: Number(m) })} label="Orientazione, m" compact />
					</div>
				</Control>

				<div className="flex flex-col gap-2 border-t border-edge-soft pt-3">
					<Check checked={nodes} onChange={(on) => set({ nodi: on ? '1' : '' })}>
						Mostra i nodi
					</Check>
					{figure === '3d' && (
						<Check checked={cut} onChange={(on) => set({ spicchio: on ? '1' : '' })}>
							Seziona la nuvola per vedere dentro
						</Check>
					)}
					<Check checked={sameScale} onChange={(on) => set({ scala: on ? 'uguale' : '' })}>
						Stessa scala per tutti i livelli
					</Check>
				</div>

				<dl className="grid grid-cols-2 gap-3 border-t border-edge-soft pt-3 text-sm">
					<div>
						<dt className="label-mono text-fg-subtle">Nodi radiali</dt>
						<dd className="font-display text-2xl font-semibold text-fg-strong">{radialNodes(orbital)}</dd>
					</div>
					<div>
						<dt className="label-mono text-fg-subtle">Nodi angolari</dt>
						<dd className="font-display text-2xl font-semibold text-fg-strong">{angularNodes(orbital)}</dd>
					</div>
					<p className="col-span-2 text-fg-muted">{nodeParts.length ? `Dove la funzione d’onda è zero: ${nodeParts.join(', ')}.` : 'Nessun nodo: è lo stato con meno energia.'}</p>
				</dl>

				{kind === 'reale' ? (
					<p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fg-muted">
						<span className="flex items-center gap-1.5">
							<span className="size-3 rounded-full bg-[rgb(204,33,64)] dark:bg-[rgb(250,107,128)]" aria-hidden="true" />
							funzione d’onda positiva
						</span>
						<span className="flex items-center gap-1.5">
							<span className="size-3 rounded-full bg-[rgb(41,92,189)] dark:bg-[rgb(115,168,255)]" aria-hidden="true" />
							negativa
						</span>
					</p>
				) : (
					<p className="text-sm text-fg-muted">
						{orbital.m === 0
							? 'Con m = 0 i puntini stanno fermi: la probabilità non gira attorno all’asse.'
							: figure === 'sezione' && plane !== 'xy'
								? 'In questo piano i puntini stanno fermi: il moto attraversa il piano. Guardalo nel piano xy o nella nuvola.'
								: `I puntini girano attorno all’asse z, più svelti vicino all’asse, in senso ${orbital.m > 0 ? 'antiorario' : 'orario'} visti dall’alto. La loro velocità è il flusso della probabilità: dice quanto momento angolare ha l’elettrone attorno all’asse.`}
					</p>
				)}
				{kind === 'complesso' && surfaces.spheres.length + surfaces.cones.length > 0 && <p className="text-sm text-fg-muted">I due colori servono solo a distinguere un guscio o un lobo da quello vicino.</p>}
				{sameScale && <p className="text-sm text-fg-muted">Con la stessa scala lo spazio e il tempo sono uguali per tutti i livelli: un orbitale con n più grande occupa più spazio e i suoi puntini girano più piano.</p>}
				<p className="text-sm leading-relaxed text-fg-muted">
					Ogni puntino è una posizione in cui l’elettrone potrebbe trovarsi: dove i puntini sono fitti è più probabile trovarlo. I {(figure === '3d' ? CLOUD_POINTS : SECTION_POINTS).toLocaleString('it-IT')} puntini descrivono un solo
					elettrone, nell’atomo di idrogeno.
				</p>
			</div>
		</div>
	);
}

/** A configuration with the electrons raised: [Ar] 4s² 3d⁶. */
function ConfigText({ config }: { config: string }) {
	return (
		<span className="font-mono text-fg">
			{configParts(config).map((part, i) => (
				<span key={i}>
					{i > 0 && ' '}
					{part.text}
					{part.electrons && <sup>{part.electrons}</sup>}
				</span>
			))}
		</span>
	);
}

const unpairedText = (count: number): string => (count === 0 ? 'Nessun elettrone spaiato.' : count === 1 ? 'Un elettrone spaiato.' : `${count} elettroni spaiati.`);

/** What the rule of the diagonal would give where the real configuration differs from it: "4s2 3d4" for chromium. */
function expected(z: number, real: Map<string, number>): string {
	const rule = diagonalConfiguration(z);
	return FILLING_ORDER.filter((s) => (rule.get(s.name) ?? 0) !== (real.get(s.name) ?? 0) && rule.has(s.name))
		.map((s) => `${s.name}${rule.get(s.name)}`)
		.join(' ');
}

/** "1 cono", "il piano orizzontale e 2 coni": the cone at 90° is a plane. */
function coneWords(cones: number[]): string {
	const flat = cones.some((theta) => Math.abs(theta - Math.PI / 2) < 1e-6);
	const others = cones.length - (flat ? 1 : 0);
	const coneText = others === 1 ? '1 cono' : `${others} coni`;
	if (flat) return others ? `il piano orizzontale e ${coneText}` : 'il piano orizzontale';
	return coneText;
}

function Control({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex min-w-0 flex-col gap-1.5">
			<span className="label-mono text-fg-subtle">{label}</span>
			{children}
		</div>
	);
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (on: boolean) => void; children: ReactNode }) {
	return (
		<label className="flex items-center gap-2.5 text-sm text-fg">
			<input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[var(--accent)]" />
			{children}
		</label>
	);
}
