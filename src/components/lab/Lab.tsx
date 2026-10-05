'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { AlertTriangle, Check, ChevronLeft, FlaskConical, Glasses, Hand, Home, RotateCcw, X } from 'lucide-react';
import { LabScene, type Hover } from './engine/scene';
import { Experiment, type Snapshot } from './engine/experiment';
import { FreeLab, type FreeSnapshot } from './engine/free';

const MODEL = '/lab/laboratorio.glb';

const noSub = () => () => {};
const noSnap = () => null;

type Mode = 'guidato' | 'libero';

/** The chemistry lab: a Blender scene brought to life with three.js, and a guided experiment on top. */
export function Lab() {
	const host = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<LabScene | null>(null);
	const [exp, setExp] = useState<Experiment | null>(null);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState('');
	const [started, setStarted] = useState(false);
	const [label, setLabel] = useState<string | null>(null);
	const [run, setRun] = useState(0);
	const [locked, setLocked] = useState(false);
	const [mode, setMode] = useState<Mode>('guidato');
	const [free, setFree] = useState<FreeLab | null>(null);
	const snap = useSyncExternalStore(exp?.subscribe ?? noSub, exp?.getSnapshot ?? noSnap, noSnap);
	const freeSnap = useSyncExternalStore(free?.subscribe ?? noSub, free?.getSnapshot ?? noSnap, noSnap);

	useEffect(() => {
		const el = host.current;
		if (!el) return;
		let alive = true;
		let scene: LabScene;
		try {
			scene = new LabScene(el);
		} catch {
			queueMicrotask(() => setError('Questo browser non supporta WebGL: il laboratorio in 3D non può partire.'));
			return;
		}
		sceneRef.current = scene;
		scene.onHover = (h: Hover) => setLabel(h?.label ?? null);
		scene.onLock = setLocked;
		scene
			.load(MODEL, (f) => alive && setProgress(f))
			.then(() => {
				if (!alive) return;
				const e = mode === 'guidato' ? new Experiment(scene) : null;
				const f = mode === 'libero' ? new FreeLab(scene) : null;
				scene.start();
				// for scripts that drive the lab in development
				if (process.env.NODE_ENV !== 'production') (window as unknown as { __lab: unknown }).__lab = { scene, exp: e, free: f };
				setProgress(1);
				setExp(e);
				setFree(f);
			})
			.catch((err: Error) => alive && setError(`Il laboratorio non si è caricato: ${err.message}`));
		return () => {
			alive = false;
			scene.dispose();
			sceneRef.current = null;
			setExp(null);
			setFree(null);
		};
	}, [run, mode]);

	const enter = () => {
		setStarted(true);
		sceneRef.current?.player.lock();
	};

	const switchMode = (m: Mode) => {
		if (m === mode) return;
		setProgress(0);
		setMode(m);
	};

	const restart = () => {
		setProgress(0);
		setRun((r) => r + 1);
	};

	return (
		<div className="fixed inset-0 overflow-hidden bg-[#dfe3e6] text-ink-900 select-none">
			<div ref={host} className="absolute inset-0" aria-label="Banco del laboratorio in 3D" />
			{snap?.goggles && <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_90px_24px_rgba(40,110,180,0.28)] rounded-[48px]" />}

			{started && locked && (
				<div className="pointer-events-none absolute left-1/2 top-1/2 z-30 -translate-x-1/2 -translate-y-1/2">
					<div className={`size-2 rounded-full ring-2 transition ${label ? 'scale-125 bg-crimson-500 ring-white' : 'bg-white/90 ring-ink-900/40'}`} />
					{label && <div className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink-900/85 px-2.5 py-1 text-xs font-medium text-white shadow-lg">{label}</div>}
				</div>
			)}
			{started && !snap?.report && <Keys locked={locked} mode={mode} />}

			<header className="absolute left-0 right-0 top-0 z-20 flex items-start justify-between gap-3 p-3 sm:p-4">
				<div className="flex items-center gap-2 rounded-2xl bg-white/85 py-1.5 pl-1.5 pr-4 shadow-sm backdrop-blur">
					<Link href="/" className="grid size-8 place-items-center rounded-xl text-ink-600 hover:bg-ink-50" aria-label="Torna a Sapiens">
						<ChevronLeft className="size-5" />
					</Link>
					<div className="leading-tight">
						<div className="font-display text-base font-semibold">Laboratorio di chimica</div>
						<div className="text-xs text-ink-500">Cristalli di solfato di rame</div>
					</div>
				</div>
				{(exp || free) && started && (
					<div className="flex gap-2">
						<div className="flex rounded-xl bg-white/85 p-1 shadow-sm backdrop-blur" role="group" aria-label="Modalità">
							{(['guidato', 'libero'] as Mode[]).map((m) => (
								<button key={m} onClick={() => switchMode(m)} className={`rounded-lg px-3 py-1 text-sm font-medium capitalize ${mode === m ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-50'}`}>
									{m === 'guidato' ? 'Esperimento guidato' : 'Laboratorio libero'}
								</button>
							))}
						</div>
						<IconButton onClick={() => sceneRef.current?.respawn()} label="Torna al banco">
							<Home className="size-4" />
						</IconButton>
						<IconButton onClick={restart} label="Ricomincia">
							<RotateCcw className="size-4" />
						</IconButton>
					</div>
				)}
			</header>

			{snap && started && !snap.report && <StepPanel snap={snap} exp={exp!} />}
			{snap?.message && started && !snap.report && <Toast kind={snap.message.kind} text={snap.message.text} />}
			{snap?.report && started && <ReportCard snap={snap} onRestart={restart} />}
			{freeSnap && started && <FreePanel snap={freeSnap} />}
			{freeSnap?.message && started && <Toast kind={freeSnap.message.kind} text={freeSnap.message.text} />}

			{!started && <Intro progress={progress} ready={!!(exp || free)} error={error} onStart={enter} />}
		</div>
	);
}

/** A key cap. */
function K({ children }: { children: ReactNode }) {
	return <kbd className="rounded-md bg-white px-1.5 py-0.5 font-mono text-[11px] font-semibold text-ink-800 shadow-[0_1px_0_#c9c9c9]">{children}</kbd>;
}

/** The keys, bottom left; when the mouse is free, a reminder that a click on the scene takes it back. */
function Keys({ locked, mode }: { locked: boolean; mode: Mode }) {
	return (
		<>
			{!locked && (
				<div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 translate-y-6 rounded-2xl bg-ink-900/75 px-5 py-3 text-sm font-medium text-white shadow-lg backdrop-blur">
					Clicca sulla scena per muoverti
				</div>
			)}
			<div className="pointer-events-none absolute bottom-4 left-4 z-20 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-2xl bg-white/80 px-3.5 py-2.5 text-xs text-ink-600 shadow-sm backdrop-blur">
				<span>
					<K>W</K> <K>A</K> <K>S</K> <K>D</K> cammina
				</span>
				<span>
					<K>Shift</K> corri
				</span>
				<span>
					<K>C</K> abbassati
				</span>
				<span>
					<K>Z</K> zoom
				</span>
				{mode === 'guidato' ? (
					<span>
						<K>clic</K> usa
					</span>
				) : (
					<>
						<span>
							<K>clic sinistro</K> mano sinistra
						</span>
						<span>
							<K>clic destro</K> mano destra
						</span>
						<span>
							<K>Q</K> <K>E</K> usa le mani
						</span>
					</>
				)}
				<span>
					<K>Esc</K> {locked ? 'libera il mouse' : 'mouse libero'}
				</span>
			</div>
		</>
	);
}

/** The free lab's panel: what each hand holds, and what can be done next. */
function FreePanel({ snap }: { snap: FreeSnapshot }) {
	const slot = (side: string, what: string | null) => (
		<div className={`rounded-2xl px-3.5 py-3 ${what ? 'bg-sky-50' : 'bg-paper-100'}`}>
			<div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-500">
				<Hand className={`size-3.5 ${side === 'sinistra' ? '-scale-x-100' : ''}`} /> Mano {side}
			</div>
			<div className={`mt-1 text-sm font-medium ${what ? 'text-ink-900' : 'text-ink-400'}`}>{what ?? 'libera'}</div>
		</div>
	);
	return (
		<aside className="absolute right-4 top-20 z-20 w-[340px] rounded-3xl bg-white/92 p-5 shadow-2xl backdrop-blur">
			<div className="text-xs font-semibold uppercase tracking-wide text-crimson-600">Laboratorio libero</div>
			<h2 className="mt-1 font-display text-xl font-semibold">Le tue mani</h2>
			<div className="mt-3 grid grid-cols-2 gap-2">
				{slot('sinistra', snap.left)}
				{slot('destra', snap.right)}
			</div>
			<p className="mt-3 text-[13px] leading-relaxed text-ink-600">{snap.hint}</p>
		</aside>
	);
}

function IconButton({ onClick, label, children }: { onClick: () => void; label: string; children: ReactNode }) {
	return (
		<button onClick={onClick} className="flex items-center gap-1.5 rounded-xl bg-white/85 px-3 py-2 text-sm font-medium text-ink-700 shadow-sm backdrop-blur hover:bg-white" title={label}>
			{children}
			<span className="hidden sm:inline">{label}</span>
		</button>
	);
}

function Equation() {
	return (
		<div className="rounded-xl bg-paper-100 px-3 py-2 text-center font-mono text-[13px] text-ink-800">
			CuO<sub>(s)</sub> + H<sub>2</sub>SO<sub>4</sub>
			<sub>(aq)</sub> → CuSO<sub>4</sub>
			<sub>(aq)</sub> + H<sub>2</sub>O<sub>(l)</sub>
		</div>
	);
}

function Intro({ progress, ready, error, onStart }: { progress: number; ready: boolean; error: string; onStart: () => void }) {
	return (
		<div className="absolute inset-0 z-40 grid place-items-center overflow-y-auto bg-ink-950/35 p-4 backdrop-blur-[3px]">
			<div className="w-full max-w-xl rounded-3xl bg-paper-50 p-6 shadow-2xl sm:p-8">
				<div className="mb-4 flex items-center gap-3">
					<div className="grid size-11 place-items-center rounded-2xl bg-crimson-50 text-crimson-600">
						<FlaskConical className="size-6" />
					</div>
					<div>
						<div className="text-xs font-semibold uppercase tracking-wide text-crimson-600">Esperimento guidato</div>
						<h1 className="font-display text-2xl font-semibold leading-tight">Cristalli di solfato di rame</h1>
					</div>
				</div>
				<p className="mb-4 text-[15px] leading-relaxed text-ink-700">
					Prepari un sale da un ossido e da un acido, poi lo fai cristallizzare. Sciogli l&apos;ossido di rame(II), nero, in acido solforico caldo; filtri l&apos;ossido in eccesso, concentri la
					soluzione azzurra e la lasci riposare finché compaiono i cristalli.
				</p>
				<Equation />
				<div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
					<div>
						<div className="mb-1.5 font-semibold text-ink-800">Reagenti</div>
						<ul className="space-y-1 text-ink-600">
							<li>Acido solforico H₂SO₄ 1 mol/L, 25 mL</li>
							<li>Ossido di rame(II) CuO in polvere</li>
						</ul>
						<div className="mb-1.5 mt-3 font-semibold text-ink-800">Sicurezza</div>
						<ul className="space-y-1 text-ink-600">
							<li>Occhiali sempre indossati</li>
							<li>L&apos;acido non deve bollire</li>
							<li>Il gas si apre solo per accendere subito</li>
						</ul>
					</div>
					<div>
						<div className="mb-1.5 font-semibold text-ink-800">Strumenti</div>
						<ul className="space-y-1 text-ink-600">
							<li>Pipetta tarata con propipetta</li>
							<li>Becher, beuta, imbuto e carta da filtro</li>
							<li>Becco Bunsen, treppiede e reticella</li>
							<li>Termometro, spatola, bacchetta di vetro</li>
							<li>Capsula di porcellana</li>
						</ul>
					</div>
				</div>
				<p className="mt-5 rounded-xl border border-ink-100 px-3 py-2.5 text-[13px] leading-relaxed text-ink-600">
					Ti muovi come in un videogioco: <b>WASD</b> per camminare, il mouse per guardarti intorno. Punta il mirino su un oggetto con il contorno rosso e fai clic, o premi <b>E</b>. Con <b>Esc</b>{' '}
					liberi il mouse per usare il pannello.
				</p>
				{error ? (
					<p className="mt-5 rounded-xl bg-crimson-50 px-3 py-2.5 text-sm text-crimson-800">{error}</p>
				) : (
					<button
						onClick={onStart}
						disabled={!ready}
						className="mt-5 w-full rounded-2xl bg-crimson-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-crimson-700 disabled:cursor-wait disabled:bg-ink-300"
					>
						{ready ? 'Entra in laboratorio' : `Preparo il banco… ${Math.round(progress * 100)}%`}
					</button>
				)}
			</div>
		</div>
	);
}

function StepPanel({ snap, exp }: { snap: Snapshot; exp: Experiment }) {
	const total = snap.steps.length - 1;
	return (
		<aside className="absolute right-4 top-20 z-20 max-h-[calc(100vh-6rem)] w-[370px] overflow-y-auto rounded-3xl bg-white/92 shadow-2xl backdrop-blur">
			<div className="p-4 sm:p-5">
				<div className="mb-2 flex items-center justify-between">
					<div className="text-xs font-semibold uppercase tracking-wide text-crimson-600">
						Passo {Math.min(snap.step + 1, total)} di {total}
					</div>
					<div className="flex items-center gap-2">
						{snap.goggles && (
							<span className="flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700">
								<Glasses className="size-3.5" /> occhiali
							</span>
						)}
					</div>
				</div>
				<div className="mb-3 flex gap-1">
					{snap.steps.slice(0, total).map((s, i) => (
						<div key={s.id} title={s.title} className={`h-1.5 flex-1 rounded-full ${i < snap.step ? 'bg-crimson-500' : i === snap.step ? 'bg-crimson-300' : 'bg-ink-100'}`} />
					))}
				</div>
				<h2 className="font-display text-xl font-semibold leading-snug">{snap.title}</h2>
				<>
					{snap.why && <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">{snap.why}</p>}
					{snap.equation && (
						<div className="mt-3">
							<Equation />
						</div>
					)}
					<ol className="mt-4 space-y-2">
						{snap.tasks.map((t, i) => (
							<li key={i} className={`flex gap-2.5 text-sm leading-snug ${t.state === 'todo' ? 'text-ink-400' : t.state === 'done' ? 'text-ink-500' : 'font-medium text-ink-900'}`}>
								<span
									className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full text-[11px] ${t.state === 'done' ? 'bg-emerald-500 text-white' : t.state === 'now' ? 'bg-crimson-600 text-white' : 'bg-ink-100 text-ink-500'}`}
								>
									{t.state === 'done' ? <Check className="size-3.5" /> : i + 1}
								</span>
								<span className={t.state === 'done' ? 'line-through decoration-ink-300' : ''}>{t.text}</span>
							</li>
						))}
					</ol>
				</>
				<Controls snap={snap} exp={exp} />
				{snap.readouts.length > 0 && (
					<dl className="mt-4 grid grid-cols-2 gap-2">
						{snap.readouts.map((r) => (
							<div key={r.label} className={`rounded-xl px-3 py-2 ${r.tone === 'warn' ? 'bg-crimson-50' : r.tone === 'hot' ? 'bg-orange-50' : r.tone === 'ok' ? 'bg-emerald-50' : 'bg-paper-100'}`}>
								<dt className="text-[11px] text-ink-500">{r.label}</dt>
								<dd
									className={`font-mono text-sm font-semibold ${r.tone === 'warn' ? 'text-crimson-700' : r.tone === 'hot' ? 'text-orange-700' : r.tone === 'ok' ? 'text-emerald-700' : 'text-ink-800'}`}
								>
									{r.value}
								</dd>
							</div>
						))}
					</dl>
				)}
				{snap.busy && <div className="mt-3 text-xs text-ink-400">…</div>}
			</div>
		</aside>
	);
}

function Controls({ snap, exp }: { snap: Snapshot; exp: Experiment }) {
	if (!snap.controls.length) return null;
	return (
		<div className="mt-4 space-y-3 rounded-2xl border border-ink-100 bg-paper-50 p-3">
			{snap.controls.includes('draw') && snap.draw && <DrawControl snap={snap} exp={exp} />}
			{snap.controls.includes('air') && <Slider label="Aria · ghiera" left="chiusa" right="aperta" value={snap.air} min={0} max={1} onChange={(v) => exp.setAir(v)} />}
			{snap.controls.includes('gas') && <Slider label="Gas · fiamma" left="bassa" right="alta" value={snap.gas} min={0.15} max={1} onChange={(v) => exp.setGas(v)} />}
			{snap.controls.includes('rest') && (
				<button onClick={() => exp.rest()} className="w-full rounded-xl bg-crimson-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-crimson-700">
					Lascia riposare due giorni
				</button>
			)}
		</div>
	);
}

function Slider({ label, left, right, value, min, max, onChange }: { label: string; left: string; right: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
	return (
		<label className="block">
			<div className="mb-1 flex justify-between text-xs font-medium text-ink-700">
				<span>{label}</span>
				<span className="font-mono text-ink-500">{Math.round(((value - min) / (max - min)) * 100)}%</span>
			</div>
			<input type="range" min={min} max={max} step={0.01} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-crimson-600" />
			<div className="flex justify-between text-[11px] text-ink-400">
				<span>{left}</span>
				<span>{right}</span>
			</div>
		</label>
	);
}

function HoldButton({ onHold, children, tone }: { onHold: (on: boolean) => void; children: ReactNode; tone: 'main' | 'soft' }) {
	return (
		<button
			onPointerDown={(e) => {
				(e.target as HTMLElement).setPointerCapture(e.pointerId);
				onHold(true);
			}}
			onPointerUp={() => onHold(false)}
			onPointerCancel={() => onHold(false)}
			onContextMenu={(e) => e.preventDefault()}
			className={`flex-1 touch-none rounded-xl px-3 py-2.5 text-sm font-semibold active:scale-[0.98] ${tone === 'main' ? 'bg-ink-800 text-white active:bg-ink-950' : 'bg-white text-ink-700 ring-1 ring-ink-200 active:bg-ink-50'}`}
		>
			{children}
		</button>
	);
}

/** A magnifier of the pipette's neck: the meniscus against the calibration mark, ±10 mm. */
function DrawControl({ snap, exp }: { snap: Snapshot; exp: Experiment }) {
	const d = snap.draw!;
	const range = 10;
	const y = Math.max(-range, Math.min(range, d.offsetMm));
	const pct = 50 - (y / range) * 50;
	return (
		<div className="flex gap-3">
			<div className="relative h-36 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-r from-sky-50 via-white to-sky-50 ring-1 ring-ink-200" aria-label="Lente sulla tacca">
				<div className="absolute left-1/2 top-0 h-full w-5 -translate-x-1/2 border-x border-ink-300/80 bg-white/60" />
				<div className="absolute bottom-0 left-1/2 w-5 -translate-x-1/2 bg-sky-200/80 transition-[height] duration-75" style={{ height: `${d.offsetMm < -range ? 0 : 100 - pct}%` }}>
					<div className="absolute -top-1 left-0 h-2 w-full rounded-b-full border-b-2 border-sky-700/70" />
				</div>
				<div className="absolute left-1 right-1 top-1/2 h-[2px] bg-blue-800" />
				<div className="absolute right-0.5 top-1/2 -translate-y-4 text-[9px] font-bold text-blue-800">25</div>
			</div>
			<div className="flex min-w-0 flex-1 flex-col gap-2">
				<div className="text-xs text-ink-600">
					Volume aspirato <span className="font-mono font-semibold text-ink-900">{d.vol.toFixed(2).replace('.', ',')} mL</span>
				</div>
				<div className="flex gap-2">
					<HoldButton tone="main" onHold={(on) => exp.setDraw(on ? 1 : 0)}>
						▲ Aspira
					</HoldButton>
					<HoldButton tone="soft" onHold={(on) => exp.setDraw(on ? -1 : 0)}>
						▼ Rilascia
					</HoldButton>
				</div>
				<button onClick={() => exp.confirmDraw()} className={`rounded-xl px-3 py-2 text-sm font-semibold ${d.ok ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-ink-100 text-ink-500'}`}>
					{d.ok ? 'Il menisco tocca la tacca: conferma' : 'Conferma'}
				</button>
			</div>
		</div>
	);
}

function Toast({ kind, text }: { kind: 'info' | 'warn' | 'ok'; text: string }) {
	const Icon = kind === 'warn' ? AlertTriangle : kind === 'ok' ? Check : FlaskConical;
	return (
		<div className="pointer-events-none absolute left-[calc(50%-190px)] top-20 z-30 w-[520px] -translate-x-1/2">
			<div
				key={text}
				className={`flex items-start gap-2.5 rounded-2xl px-4 py-3 text-sm leading-snug shadow-lg backdrop-blur ${kind === 'warn' ? 'bg-crimson-600/95 text-white' : kind === 'ok' ? 'bg-emerald-600/95 text-white' : 'bg-ink-900/88 text-white'}`}
			>
				<Icon className="mt-0.5 size-4 shrink-0" />
				<span>{text}</span>
			</div>
		</div>
	);
}

function ReportCard({ snap, onRestart }: { snap: Snapshot; onRestart: () => void }) {
	const r = snap.report!;
	const f = (x: number, d = 2) =>
		x.toLocaleString('it-IT', {
			minimumFractionDigits: d,
			maximumFractionDigits: d
		});
	return (
		<div className="absolute right-4 top-20 z-30 max-h-[calc(100vh-6rem)] w-[400px] overflow-y-auto rounded-3xl bg-paper-50/95 p-6 shadow-2xl backdrop-blur">
			<div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Esperimento concluso</div>
			<h2 className="mt-1 font-display text-2xl font-semibold">I tuoi cristalli</h2>
			<p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
				Cristalli azzurri di solfato di rame pentaidrato, CuSO₄·5H₂O: ogni unità di sale lega cinque molecole d&apos;acqua, che danno il colore.
			</p>
			<div className="mt-4">
				<Equation />
			</div>
			<dl className="mt-4 divide-y divide-ink-100 rounded-2xl bg-white text-sm">
				<Row k="Acido solforico" v={`${f(r.acid * 1000, 0)} mmol`} />
				<Row k="Ossido di rame aggiunto" v={`${f(r.cuoAdded, 1)} g`} />
				<Row k="Ossido in eccesso, nel filtro" v={`${f(r.cuoExcess, 2)} g`} />
				<Row k="Resa teorica di CuSO₄·5H₂O" v={`${f(r.theoretical)} g`} />
				<Row k="Cristalli ottenuti" v={`≈ ${f(r.obtained)} g · ${f(r.yieldPct, 0)}%`} strong />
			</dl>
			<p className="mt-3 text-[12px] leading-relaxed text-ink-500">
				La resa teorica viene dall&apos;acido, il reagente limitante: 25 mmol di H₂SO₄ danno al massimo 25 mmol di sale, cioè 25 mmol × 249,7 g/mol. Una parte resta sciolta nella soluzione madre, e un
				po&apos; si perde sulle pareti e nel filtro.
			</p>
			{r.notes.length > 0 && (
				<ul className="mt-4 space-y-1.5">
					{r.notes.map((n) => (
						<li key={n.text} className="flex gap-2 text-sm">
							{n.good ? <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" /> : <X className="mt-0.5 size-4 shrink-0 text-crimson-600" />}
							<span className="text-ink-700">{n.text}</span>
						</li>
					))}
				</ul>
			)}
			<button onClick={onRestart} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-crimson-600 px-5 py-3 font-semibold text-white hover:bg-crimson-700">
				<RotateCcw className="size-4" /> Rifai l&apos;esperimento
			</button>
		</div>
	);
}

function Row({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
	return (
		<div className="flex items-baseline justify-between gap-3 px-3.5 py-2.5">
			<dt className="text-ink-600">{k}</dt>
			<dd className={`text-right font-mono ${strong ? 'font-semibold text-emerald-700' : 'text-ink-800'}`}>{v}</dd>
		</div>
	);
}
