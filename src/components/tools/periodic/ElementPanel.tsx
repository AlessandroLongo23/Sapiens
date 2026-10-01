import type { CSSProperties, ReactNode } from 'react';
import { X } from 'lucide-react';
import photos from '@/lib/tools/elementi-foto.json';
import { BLOCKS, NEVER_SOLID, SUBLIMES, TRENDS, ZERO_CELSIUS, celsius, configParts, familyName, num, stateAt, stateName, withUnit, type ChemElement } from '@/lib/tools/tavola-periodica';

/** A photo of the element from Wikimedia Commons (scripts/tavola-periodica/foto.mjs), with what its licence asks: author, licence, source. */
interface Photo {
	src: string;
	width: number;
	height: number;
	author: string;
	licence: string;
	licenceUrl: string | null;
	page: string;
}
const PHOTOS = photos as Record<string, Photo>;

/** A configuration with the electrons of each sublevel raised: [Ar] 4s² 3d⁶. */
export function Config({ el }: { el: ChemElement }) {
	return (
		<span className="font-mono">
			{configParts(el.config).map((part, i) => (
				<span key={i}>
					{i > 0 && ' '}
					{part.text}
					{part.electrons && <sup>{part.electrons}</sup>}
				</span>
			))}
		</span>
	);
}

/** A mass with what it is: "55,85 u", or the mass number of the longest-lived isotope. */
export const massText = (el: ChemElement): string => (el.mass.startsWith('[') ? el.mass : `${el.mass} u`);

const MISSING = (
	<abbr title="non disponibile" className="text-fg-subtle no-underline">
		n.d.
	</abbr>
);

/** A temperature in both scales: "1538 °C (1811 K)". */
const temperature = (kelvin: number | null): ReactNode => (kelvin === null ? MISSING : `${celsius(kelvin)} °C (${num(kelvin)} K)`);

/** Gases in g/L, as the books give them; the rest in g/cm³. */
function density(el: ChemElement): ReactNode {
	if (el.density === null) return MISSING;
	return el.state === 'g' ? `${num(Number((el.density * 1000).toPrecision(4)))} g/L` : `${num(el.density)} g/cm³`;
}

function Row({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="grid grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-3 border-b border-edge-soft py-1.5 last:border-b-0">
			<dt className="text-fg-muted">{label}</dt>
			<dd className="text-fg-strong">{children}</dd>
		</div>
	);
}

/**
 * Everything about one element: where it sits, its numbers, its isotopes. `fill` is the colour its cell has in the
 * table at the moment, so the card and the cell read as the same thing.
 */
export function ElementPanel({ el, fill, onClose }: { el: ChemElement; fill?: string; onClose?: () => void }) {
	const room = stateAt(el, 25 + ZERO_CELSIUS);
	const block = BLOCKS.find((b) => b.id === el.block)!;
	const photo = PHOTOS[el.symbol];
	return (
		<section aria-label={`Scheda: ${el.name}`} className="rounded-2xl border border-edge bg-surface p-4 shadow-paper">
			<header className="flex items-start gap-3">
				<div className="ptable-cell flex size-16 shrink-0 flex-col items-center justify-center rounded-xl border border-edge-strong leading-none" style={fill ? ({ '--pt-fill': fill } as CSSProperties) : undefined}>
					<span className="font-mono text-[0.65rem]">{el.z}</span>
					<span className="font-display text-2xl font-semibold">{el.symbol}</span>
				</div>
				<div className="min-w-0 flex-1">
					<h2 className="font-display text-2xl font-semibold leading-tight text-fg-strong">{el.name}</h2>
					<p className="text-sm text-fg-muted">{familyName(el.family)}</p>
				</div>
				{onClose && (
					<button type="button" onClick={onClose} aria-label="Chiudi la scheda" className="-mr-1 -mt-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-fg-muted hover:bg-surface-3 hover:text-fg focus-ring">
						<X className="size-4" aria-hidden="true" />
					</button>
				)}
			</header>

			{photo && (
				<figure className="mt-3">
					{/* The height is kept while the photo loads, and when the card passes to another element. */}
					<div className="flex h-44 items-center justify-center overflow-hidden rounded-xl border border-edge-soft bg-surface-2">
						{/* eslint-disable-next-line @next/next/no-img-element -- already sized and compressed by the script */}
						<img key={photo.src} src={photo.src} width={photo.width} height={photo.height} alt={`${el.name}: un campione dell’elemento`} loading="lazy" decoding="async" className="size-full object-contain" />
					</div>
					<figcaption className="mt-1 text-[0.6875rem] leading-snug text-fg-subtle">
						Foto:{' '}
						<a href={photo.page} target="_blank" rel="noopener nofollow" className="underline decoration-edge-strong underline-offset-2 hover:text-fg">
							{photo.author}
						</a>
						,{' '}
						{photo.licenceUrl ? (
							<a href={photo.licenceUrl} target="_blank" rel="noopener nofollow license" className="underline decoration-edge-strong underline-offset-2 hover:text-fg">
								{photo.licence}
							</a>
						) : (
							photo.licence
						)}
						, da Wikimedia Commons.
					</figcaption>
				</figure>
			)}

			<dl className="mt-3 text-sm">
				<Row label="Numero atomico">{el.z}</Row>
				<Row label={el.mass.startsWith('[') ? 'Numero di massa dell’isotopo più stabile' : 'Massa atomica'}>{massText(el)}</Row>
				<Row label="Posizione">
					{el.group ? `gruppo ${el.group}, ` : ''}periodo {el.period}, {block.name.toLowerCase()}
				</Row>
				<Row label="Configurazione elettronica">
					<Config el={el} />
					{el.configPredicted && <span className="text-fg-subtle"> (prevista)</span>}
				</Row>
				<Row label="Numeri di ossidazione">
					{el.oxidation.length ? el.oxidation.join(', ') : MISSING}
					{el.oxidationPredicted && <span className="text-fg-subtle"> (previsti)</span>}
				</Row>
				{TRENDS.map((trend) => {
					const value = trend.value(el);
					return (
						<Row key={trend.id} label={trend.name}>
							{value === null ? MISSING : withUnit(trend, value)}
						</Row>
					);
				})}
				<Row label="Stato a 25 °C">
					{room === '?' ? stateName(el.state) : stateName(room)}
					{(room === '?' || el.stateExpected) && <span className="text-fg-subtle"> (previsto)</span>}
				</Row>
				<Row label="Punto di fusione">
					{temperature(el.melting)}
					{(NEVER_SOLID.has(el.symbol) || SUBLIMES.has(el.symbol)) && <span className="text-fg-subtle"> (sotto pressione)</span>}
				</Row>
				<Row label={SUBLIMES.has(el.symbol) ? 'Punto di sublimazione' : 'Punto di ebollizione'}>{temperature(el.boiling)}</Row>
				<Row label="Densità">{density(el)}</Row>
			</dl>

			<h3 className="label-mono mt-4 mb-2 text-fg-subtle">Isotopi in natura</h3>
			{el.isotopes.length ? (
				<ul className="flex flex-col gap-1.5 text-sm">
					{el.isotopes.map(([a, share]) => (
						<li key={a} className="grid grid-cols-[3.5rem_minmax(0,1fr)_4.75rem] items-center gap-2">
							<span className="text-fg-strong">
								<sup>{a}</sup>
								{el.symbol}
							</span>
							<span className="h-2 overflow-hidden rounded-full bg-surface-3" aria-hidden="true">
								<span className="block h-full rounded-full bg-fg-subtle" style={{ width: `${Math.max(share, 1)}%` }} />
							</span>
							<span className="text-right font-mono text-xs text-fg-muted tabular-nums">{num(share)} %</span>
						</li>
					))}
				</ul>
			) : (
				<p className="text-sm text-fg-muted">Nessun isotopo ha un’abbondanza naturale definita: tutti gli isotopi dell’elemento sono radioattivi.</p>
			)}
		</section>
	);
}
