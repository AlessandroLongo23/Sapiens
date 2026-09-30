'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { HandStage, type Pose } from './engine/handlab';
import { alternatives, autoSpec, DEFAULTS, gripKey, jitter, seeded, specFor, VARIANTS, type GripResult, type GripSpec, type GripType } from './engine/grip';
import { SHAPES, type Side } from './engine/grasp';

const LABELS: Record<string, string> = {
	Beaker: 'Becher da 100 mL',
	AcidBeaker: 'Becher da 50 mL',
	ConicalFlask: 'Beuta',
	GlassRod: 'Bacchetta di vetro',
	Thermometer: 'Termometro',
	Spatula: 'Spatola',
	Pipette: 'Pipetta',
	Lighter: 'Accendino',
	CuOJar: 'Barattolo',
	Funnel: 'Imbuto',
	BunsenCollar: 'Ghiera del Bunsen'
};

const TYPES: { id: GripType; label: string }[] = [
	{ id: 'precision', label: 'Di precisione (polpastrelli)' },
	{ id: 'power', label: 'A mano piena' },
	{ id: 'tripod', label: 'A penna (treppiede)' }
];

type Field = { key: keyof GripSpec; label: string; min: number; max: number; step: number; unit: string; scale?: number; only?: GripType[] };

/** The few numbers of a grip (grip.ts), with the ranges that make sense for them. */
function fields(name: string, type: GripType): Field[] {
	const s = SHAPES[name];
	const tri = type === 'tripod';
	return [
		{ key: 'height', label: tri ? 'Altezza della presa' : 'Altezza del palmo', min: s?.y0 ?? 0, max: s?.y1 ?? 0.2, step: 0.001, unit: 'mm', scale: 1000 },
		{ key: 'gap', label: 'Profondità: distanza del palmo', min: 0, max: 0.06, step: 0.001, unit: 'mm', scale: 1000, only: ['precision', 'power'] },
		{ key: 'slide', label: 'Mano avanti o indietro', min: -0.06, max: 0.04, step: 0.001, unit: 'mm', scale: 1000, only: ['precision', 'power'] },
		{ key: 'tilt', label: tri ? 'Inclinazione della penna' : 'Inclinazione delle dita', min: tri ? 10 : -60, max: tri ? 80 : 60, step: 1, unit: '°' },
		{ key: 'roll', label: 'Rotazione del palmo', min: -60, max: 60, step: 1, unit: '°', only: ['precision', 'power'] },
		{ key: 'wrap', label: 'Dove arrivano le dita', min: 0, max: 200, step: 1, unit: '°', only: ['precision', 'power'] },
		{ key: 'thumbWrap', label: 'Dove arriva il pollice', min: 0, max: 200, step: 1, unit: '°', only: ['precision', 'power'] },
		{ key: 'thumbDrop', label: "Pollice sotto l'indice", min: -0.03, max: 0.03, step: 0.001, unit: 'mm', scale: 1000, only: ['precision', 'power'] },
		{ key: 'fan', label: 'Ventaglio delle dita', min: -15, max: 25, step: 1, unit: '°', only: ['precision', 'power'] },
		{ key: 'fingers', label: 'Dita che toccano', min: 1, max: 4, step: 1, unit: '', only: ['precision', 'power'] },
		{ key: 'tuck', label: 'Chiusura delle altre dita', min: 0, max: 1, step: 0.05, unit: '' }
	].filter((f) => !f.only || f.only.includes(type)) as Field[];
}

/** The hands playground: pick an object, move a few sliders, see the grip and what goes through the glass, save it. */
export function HandLab() {
	const host = useRef<HTMLDivElement>(null);
	const stage = useRef<HandStage | null>(null);
	const [names, setNames] = useState<string[]>([]);
	const [pose, setPose] = useState<Pose>(() => ({ name: 'Beaker', variant: '', side: 'R', spec: specFor('Beaker')!, phi: 0, up: 1, closure: 1 }));
	const [result, setResult] = useState<GripResult | null>(null);
	const [inside, setInside] = useState(0);
	const [saved, setSaved] = useState('');
	/** grips.json as the server has it now. */
	const [table, setTable] = useState<Record<string, GripSpec>>({});
	/** The saved grip the sliders started from, or null for values not saved yet. */
	const [loaded, setLoaded] = useState<string | null>(null);
	/** A variation being previewed (not saved): the grip as the game might take it once. */
	const [trial, setTrial] = useState<{ spec: GripSpec; dphi: number } | null>(null);

	const sync = useCallback(async (res?: Response) => {
		const r = res ?? (await fetch('/api/dev/grips'));
		if (!r.ok) {
			setSaved('Il server di sviluppo non risponde: niente è stato salvato.');
			return null;
		}
		const t = (await r.json()) as Record<string, GripSpec>;
		setTable(t);
		return t;
	}, []);
	// the table as saved, and the beaker's first grip marked as the one the sliders start from
	useEffect(() => {
		let alive = true;
		fetch('/api/dev/grips')
			.then((r) => (r.ok ? (r.json() as Promise<Record<string, GripSpec>>) : null))
			.then((t) => {
				if (!alive || !t) return;
				setTable(t);
				setLoaded(alternatives(t, 'Beaker')[0]?.key ?? null);
			})
			.catch(() => {});
		return () => {
			alive = false;
		};
	}, []);

	useEffect(() => {
		const el = host.current;
		if (!el) return;
		const s = new HandStage(el);
		stage.current = s;
		s.onResult = setResult;
		let alive = true;
		s.load().then((n) => {
			if (!alive) return;
			setNames(n);
			s.start();
		});
		const t = setInterval(() => setInside(s.inside), 300);
		// for scripts that drive the playground
		(window as unknown as { __hands: unknown }).__hands = { stage: s, setPose, specFor, autoSpec, DEFAULTS, jitter, seeded, result: () => s.last };
		return () => {
			alive = false;
			clearInterval(t);
			s.dispose();
		};
	}, []);

	useEffect(() => {
		if (names.length) stage.current?.set(trial ? { ...pose, spec: trial.spec, phi: pose.phi + trial.dphi } : pose);
	}, [pose, names, trial]);

	const alts = alternatives(table, pose.name, pose.variant);
	const label = LABELS[pose.name] ?? pose.name;
	const altOf = (key: string | null) => alts.find((a) => a.key === key)?.alt ?? 0;
	const dirty = !!loaded && JSON.stringify(table[loaded]) !== JSON.stringify(pose.spec);

	/** Opens an object for a purpose on its first saved grip, or on the values it would get. */
	const open = (name: string, variant: string, t = table) => {
		const first = alternatives(t, name, variant)[0];
		setTrial(null);
		setLoaded(first?.key ?? null);
		setPose((p) => ({ ...p, name, variant, spec: first ? { ...first.spec } : specFor(name, variant)!, phi: name === p.name ? p.phi : 0 }));
	};
	const load = (key: string) => {
		setTrial(null);
		setLoaded(key);
		setPose((p) => ({ ...p, spec: { ...table[key] } }));
	};
	const setSpec = (patch: Partial<GripSpec>) => {
		setTrial(null);
		setPose((p) => ({ ...p, spec: { ...p.spec, ...patch } }));
	};
	const pick = (name: string) => open(name, '');
	const pickVariant = (variant: string) => open(pose.name, variant);
	const auto = () => {
		setTrial(null);
		setPose((p) => ({ ...p, spec: autoSpec(p.name) ?? { type: p.spec.type, height: SHAPES[p.name].grip, ...DEFAULTS[p.spec.type] } }));
	};
	const post = (name: string, spec: GripSpec | null) => fetch('/api/dev/grips', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name, spec }) });

	/** Writes over the loaded grip. */
	const update = async () => {
		if (!loaded) return;
		const t = await sync(await post(loaded, pose.spec));
		if (t) setSaved(`Aggiornata la presa ${altOf(loaded)} di ${label}.`);
	};
	/** Saves the sliders as one more way of taking the object. */
	const saveNew = async () => {
		const alt = alts.length ? Math.max(...alts.map((a) => a.alt)) + 1 : 1;
		const key = gripKey(pose.name, pose.variant, alt);
		const t = await sync(await post(key, pose.spec));
		if (!t) return;
		setLoaded(key);
		setSaved(`Salvata la presa ${alt} di ${label}.`);
	};
	/** Deletes the loaded grip and numbers the ones after it down, so they stay 1, 2, 3. */
	const remove = async () => {
		if (!loaded) return;
		const n = altOf(loaded);
		if (!window.confirm(`Eliminare la presa ${n} di ${label}?`)) return;
		let res = await post(loaded, null);
		for (const a of alts.filter((x) => x.alt > n)) {
			await post(gripKey(pose.name, pose.variant, a.alt - 1), a.spec);
			res = await post(a.key, null);
		}
		const t = await sync(res);
		if (!t) return;
		setSaved(`Eliminata la presa ${n} di ${label}.`);
		open(pose.name, pose.variant, t);
	};
	const vary = () => setTrial(jitter(pose.spec, seeded(Math.floor(Math.random() * 1e9))));
	const mm = (x: number) => (Number.isNaN(x) ? '·' : `${(x * 1000).toFixed(1)}`);

	return (
		<div className="fixed inset-0 grid grid-cols-[1fr_360px] bg-[#dfe5ea] text-ink-900">
			<div ref={host} className="relative min-w-0">
				<div className="absolute left-3 top-3 flex gap-1.5">
					{(
						[
							['front', 'Davanti'],
							['side', 'Di lato'],
							['top', "Dall'alto"],
							['eye', 'Dagli occhi']
						] as const
					).map(([v, l]) => (
						<button key={v} onClick={() => stage.current?.view(v)} className="rounded-lg bg-white/85 px-2.5 py-1 text-xs font-medium shadow-sm hover:bg-white">
							{l}
						</button>
					))}
				</div>
				<div className="pointer-events-none absolute bottom-3 left-3 rounded-lg bg-white/85 px-3 py-2 font-mono text-xs shadow-sm">
					<div className={inside ? 'font-semibold text-crimson-700' : 'text-emerald-700'}>vertici dentro l&apos;oggetto: {inside}</div>
					{result && (
						<div className="mt-1 text-ink-600">
							distanza dal bersaglio (mm) · indice {mm(result.miss[0])} · medio {mm(result.miss[1])} · anulare {mm(result.miss[2])} · mignolo {mm(result.miss[3])} · pollice {mm(result.miss[4])}
						</div>
					)}
				</div>
			</div>
			<aside className="overflow-y-auto border-l border-ink-100 bg-white p-4 text-sm">
				<h1 className="font-display text-lg font-semibold">Mani del laboratorio</h1>
				<p className="mt-1 text-xs leading-relaxed text-ink-500">
					Il tipo di presa e pochi numeri; le dita le calcola il risolutore (grip.ts). I punti rossi sono i vertici del guanto dentro l&apos;oggetto. Salva scrive la tabella che usa il gioco.
				</p>
				<label className="mt-4 block text-xs font-semibold text-ink-600">Oggetto</label>
				<select value={pose.name} onChange={(e) => pick(e.target.value)} className="mt-1 w-full rounded-lg border border-ink-200 px-2 py-1.5">
					{names.map((n) => (
						<option key={n} value={n}>
							{LABELS[n] ?? n}
						</option>
					))}
				</select>
				{VARIANTS[pose.name] && (
					<>
						<label className="mt-3 block text-xs font-semibold text-ink-600">Uso</label>
						<select value={pose.variant} onChange={(e) => pickVariant(e.target.value)} className="mt-1 w-full rounded-lg border border-ink-200 px-2 py-1.5">
							<option value="">principale</option>
							{VARIANTS[pose.name].map((v) => (
								<option key={v.id} value={v.id}>
									{v.label}
								</option>
							))}
						</select>
					</>
				)}
				<div className="mt-3 rounded-xl border border-ink-100 p-2.5">
					<div className="flex items-baseline justify-between">
						<span className="text-xs font-semibold text-ink-600">Prese salvate</span>
						<span className="text-[11px] text-ink-400">il gioco ne sceglie una a ogni presa</span>
					</div>
					{alts.length ? (
						<div className="mt-2 flex flex-wrap gap-1.5">
							{alts.map((a) => (
								<button
									key={a.key}
									onClick={() => load(a.key)}
									title={a.key}
									className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${loaded === a.key ? 'bg-ink-900 text-white' : 'bg-ink-50 text-ink-700 hover:bg-ink-100'}`}
								>
									Presa {a.alt}
									{loaded === a.key && dirty ? ' · modificata' : ''}
								</button>
							))}
						</div>
					) : (
						<p className="mt-1.5 text-xs leading-relaxed text-ink-500">Nessuna presa salvata per questo uso: gli slider partono dai valori automatici.</p>
					)}
					<div className="mt-2.5 grid grid-cols-3 gap-1.5">
						<button onClick={update} disabled={!loaded || !dirty} className="rounded-lg bg-ink-50 px-2 py-1.5 text-xs font-semibold disabled:opacity-40">
							Aggiorna
						</button>
						<button onClick={saveNew} className="rounded-lg bg-crimson-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-crimson-700">
							{alts.length ? 'Salva come nuova' : 'Salva'}
						</button>
						<button onClick={remove} disabled={!loaded} className="rounded-lg bg-ink-50 px-2 py-1.5 text-xs font-semibold text-crimson-700 disabled:opacity-40">
							Elimina
						</button>
					</div>
				</div>
				<div className="mt-3 flex gap-2">
					{(['R', 'L'] as Side[]).map((s) => (
						<button key={s} onClick={() => setPose((p) => ({ ...p, side: s }))} className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold ${pose.side === s ? 'bg-ink-900 text-white' : 'bg-ink-50'}`}>
							Mano {s === 'R' ? 'destra' : 'sinistra'}
						</button>
					))}
				</div>
				<label className="mt-3 block text-xs font-semibold text-ink-600">Tipo di presa</label>
				<select
					value={pose.spec.type}
					onChange={(e) => {
						const type = e.target.value as GripType;
						setPose((p) => ({ ...p, spec: { type, height: p.spec.height, ...DEFAULTS[type] } }));
					}}
					className="mt-1 w-full rounded-lg border border-ink-200 px-2 py-1.5"
				>
					{TYPES.map((t) => (
						<option key={t.id} value={t.id}>
							{t.label}
						</option>
					))}
				</select>
				<div className="mt-3 space-y-2.5">
					{fields(pose.name, pose.spec.type).map((f) => (
						<Slider key={f.key} f={f} value={pose.spec[f.key] as number} onChange={(v) => setSpec({ [f.key]: v })} />
					))}
				</div>
				<div className="mt-4 space-y-2.5 border-t border-ink-100 pt-3">
					<Slider
						f={{ key: 'height', label: pose.spec.type === 'tripod' ? 'Giro attorno alla bacchetta' : "Giro attorno all'oggetto", min: 0, max: 360, step: 1, unit: '°' }}
						value={(pose.phi * 180) / Math.PI}
						onChange={(v) => setPose((p) => ({ ...p, phi: (v * Math.PI) / 180 }))}
					/>
					<Slider f={{ key: 'tuck', label: 'Chiusura della mano', min: 0, max: 1, step: 0.01, unit: '' }} value={pose.closure} onChange={(v) => setPose((p) => ({ ...p, closure: v }))} />
					{pose.spec.type !== 'tripod' && (
						<button onClick={() => setPose((p) => ({ ...p, up: p.up === 1 ? -1 : 1 }))} className="w-full rounded-lg bg-ink-50 px-2 py-1.5 text-xs font-medium">
							Pollice {pose.up === 1 ? 'in alto' : 'in basso'}: inverti
						</button>
					)}
				</div>
				<div className="mt-4 flex gap-2">
					<button onClick={auto} className="flex-1 rounded-lg bg-ink-50 px-3 py-2 text-xs font-semibold">
						Valori automatici
					</button>
					<button onClick={trial ? () => setTrial(null) : vary} className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold ${trial ? 'bg-amber-100 text-amber-900' : 'bg-ink-50'}`}>
						{trial ? 'Torna alla presa' : 'Prova una variazione'}
					</button>
				</div>
				{trial && (
					<p className="mt-1.5 text-[11px] leading-relaxed text-amber-800">
						Una presa come il gioco potrebbe farla: altezza {signed((trial.spec.height - pose.spec.height) * 1000)} mm, giro {signed((trial.dphi * 180) / Math.PI)}°, inclinazione{' '}
						{signed(trial.spec.tilt - pose.spec.tilt)}°. Non si salva; clicca di nuovo per un&apos;altra.
					</p>
				)}
				{saved && <p className="mt-2 text-xs text-ink-500">{saved}</p>}
				<pre className="mt-3 overflow-x-auto rounded-lg bg-ink-50 p-2 text-[10px] leading-snug text-ink-600">{JSON.stringify(pose.spec, null, 1)}</pre>
			</aside>
		</div>
	);
}

/** A difference with its sign and a decimal comma: «+3,5». */
function signed(x: number) {
	return x.toLocaleString('it-IT', { minimumFractionDigits: 1, maximumFractionDigits: 1, signDisplay: 'always' });
}

function Slider({ f, value, onChange }: { f: Field; value: number; onChange: (v: number) => void }) {
	const shown = f.scale ? (value * f.scale).toFixed(f.scale >= 1000 ? 0 : 1) : Number.isInteger(f.step) ? value.toFixed(0) : value.toFixed(2);
	return (
		<label className="block">
			<div className="flex justify-between text-xs">
				<span className="text-ink-700">{f.label}</span>
				<span className="font-mono text-ink-500">
					{shown}
					{f.unit}
				</span>
			</div>
			<input type="range" min={f.min} max={f.max} step={f.step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-crimson-600" />
		</label>
	);
}
