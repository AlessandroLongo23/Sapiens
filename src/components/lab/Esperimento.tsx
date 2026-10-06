'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Flame, Thermometer, FlaskRound } from 'lucide-react';
import { LabScene, type Kit } from './engine/scene';
import { LOOK } from './engine/look';
import { SHAPES } from './engine/grasp';
import { Notebook } from './engine/notebook';
import { Esperimento as Work, type EsperimentoSnapshot, type Readout } from './engine/esperimento';
import { Saggi } from './engine/saggi';
import { Titolazione } from './engine/titolazione';
import { Quaderno } from './quaderno/Quaderno';
import { applySettings, Controls, EnterHint, loadSettings, Prompt, Settings, Tip, type LabSettings } from './hud';

const MODEL = '/lab/esperimento.glb';

const noSub = () => () => {};
const noSnap = () => null;

/**
 * The chemistry lab as a game: the whole copper sulfate experiment at the bench, with the hands. On screen there is
 * the scene, a dot for a crosshair, the prompt in the corner, a line of subtitles and, when it changes, what to do
 * now; the steps, the instruments and the pages to fill in are in the notebook, which B brings up. Esc pauses.
 */
/**
 * The experiments the lab can play. Each is a class over the free lab that gives the page the same snapshot; one whose
 * pieces are not in the rooms' own files names its kit in the catalog (lib/lab/catalog.ts).
 */
const EXPERIMENTS: Record<string, { uses: string; wheel: string }> = {
	'solfato-di-rame': { uses: 'usa quello che tiene su ciò che guardi; libera, gira il rubinetto, indossa gli occhiali', wheel: 'la ghiera, la fiamma, la propipetta' },
	'saggi-alla-fiamma': { uses: 'usa quello che tiene su ciò che guardi; libera, gira il rubinetto, indossa gli occhiali', wheel: 'la ghiera, la fiamma, la risposta sul cartellino' },
	titolazione: { uses: 'usa quello che tiene su ciò che guardi; libera, agita la beuta, dà una goccia, legge la buretta', wheel: 'il rubinetto della buretta, la propipetta' }
};

type AnyWork = Work | Saggi | Titolazione;

/**
 * `model`: the scene to play in; the whole lab (/laboratorio/aula) or the single bench (the default). `experiment`:
 * which one (the copper sulfate crystals if not given), with its `kit` if it has one.
 */
export function Esperimento({
	model = MODEL,
	quality = 'auto',
	exitHref = '/laboratorio',
	subtitle,
	experiment = 'solfato-di-rame',
	kit
}: { model?: string; quality?: 'auto' | 'alta' | 'leggera'; exitHref?: string; subtitle?: string; experiment?: string; kit?: Kit } = {}) {
	const host = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<LabScene | null>(null);
	const [work, setWork] = useState<AnyWork | null>(null);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState('');
	const [started, setStarted] = useState(false);
	const [locked, setLocked] = useState(false);
	const [run, setRun] = useState(0);
	const [tip, setTip] = useState(true);
	const [reading, setReading] = useState(false);
	const [book, setBook] = useState<Notebook | null>(null);
	const [hand, setHand] = useState('cursive');
	const snap = useSyncExternalStore<EsperimentoSnapshot | null>(work?.subscribe ?? noSub, work?.getSnapshot ?? noSnap, noSnap);

	useEffect(() => {
		const el = host.current;
		if (!el) return;
		let alive = true;
		let scene: LabScene;
		try {
			scene = new LabScene(el, 'banco');
			scene.setQuality(quality);
		} catch {
			queueMicrotask(() => setError('Questo browser non supporta WebGL: il laboratorio in 3D non può partire.'));
			return;
		}
		sceneRef.current = scene;
		applySettings(scene.player, loadSettings());
		// a controller's button enters by itself (fps.ts), once the lab is loaded
		scene.player.canEnter = false;
		scene.onLock = (on) => {
			setLocked(on);
			if (on) setStarted(true);
		};
		const family = getComputedStyle(document.documentElement).getPropertyValue('--font-caveat').trim() || 'cursive';
		Promise.all([scene.load(model, (f) => alive && setProgress(f * 0.95), kit), document.fonts.load(`40px ${family}`), document.fonts.load(`bold 40px ${family}`)])
			.then(() => {
				if (!alive) return;
				const nb = new Notebook();
				// brought up by the student (B), or by the work at the end: the mouse is a cursor while it is up
				nb.onToggle = (open) => {
					setReading(open);
					if (open) setTip(false);
					scene.player.suspend(open);
				};
				setBook(nb);
				setHand(family);
				// the unknown samples of the flame tests: different at each run, or the ones of `?seme=` (for the tests)
				const seed = Number(new URLSearchParams(window.location.search).get('seme')) || Math.floor(Math.random() * 1e9) + 1;
				const w: AnyWork = experiment === 'saggi-alla-fiamma' ? new Saggi(scene, nb, family, seed) : experiment === 'titolazione' ? new Titolazione(scene, nb, seed) : new Work(scene, nb);
				scene.start();
				if (process.env.NODE_ENV !== 'production') (window as unknown as { __lab: unknown }).__lab = { scene, work: w, free: w.free, notebook: nb, LOOK, SHAPES };
				scene.player.canEnter = true;
				setProgress(1);
				setWork(w);
			})
			.catch((err: Error) => alive && setError(`Il laboratorio non si è caricato: ${err.message}`));
		return () => {
			alive = false;
			scene.dispose();
			sceneRef.current = null;
			setWork(null);
			setBook(null);
		};
	}, [run, model, quality, experiment, kit]);

	useEffect(() => {
		if (!started) return;
		const t = setTimeout(() => setTip(false), 16000);
		return () => clearTimeout(t);
	}, [started]);

	const enter = () => {
		setStarted(true);
		sceneRef.current?.player.lock();
	};

	const restart = () => {
		setProgress(0);
		setStarted(false);
		setTip(true);
		setReading(false);
		setRun((r) => r + 1);
	};

	const paused = started && !locked;
	const done = !!snap?.done;

	const playing = started && locked && !!snap;

	return (
		<div className="fixed inset-0 overflow-hidden bg-[#2a2638] select-none">
			<div ref={host} className="absolute inset-0" aria-label="Laboratorio in 3D" />
			{snap?.goggles && <div className="pointer-events-none absolute inset-0 z-10 rounded-[56px] shadow-[inset_0_0_70px_18px_rgba(120,170,210,0.22)]" />}

			{playing && !reading && (
				<div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
					<div className={`size-[5px] rounded-full bg-white/90 shadow-[0_0_4px_rgba(0,0,0,0.5)] transition-transform ${snap.actions.length ? 'scale-150' : ''}`} />
				</div>
			)}
			{playing && !reading && (snap.target || snap.actions.length > 0) && <Prompt target={snap.target} actions={snap.actions} />}
			{playing && !reading && (
				<div className="pointer-events-none absolute left-7 top-6 z-20 flex max-w-[380px] flex-col gap-4">
					<Objective key={snap.objective} step={snap.step} total={snap.total} title={snap.stepTitle} text={snap.objective} done={snap.done} />
					{snap.readouts.length > 0 && <Readouts items={snap.readouts} />}
				</div>
			)}
			{playing && snap.lens && <Lens {...snap.lens} />}

			{playing && !reading && snap.message && (
				<div key={snap.message.text} className={`pointer-events-none absolute left-1/2 z-20 max-w-[640px] -translate-x-1/2 text-center ${reading ? 'top-[3%]' : 'bottom-[9%]'}`}>
					<span
						className={`inline-block rounded-md px-3 py-1.5 text-[15px] leading-relaxed [text-shadow:0_1px_2px_rgba(0,0,0,0.6)] ${snap.message.kind === 'warn' ? 'bg-[#5a1f26]/70 text-[#ffe3e5]' : 'bg-[#1d1a28]/55 text-[#fbf3e4]'} ${reading ? 'relative z-40' : ''}`}
					>
						{snap.message.text}
					</span>
				</div>
			)}

			{playing && tip && (
				<Tip />
			)}

			{playing && reading && book && <Quaderno book={book} font={hand} message={snap.message?.text} onClose={book.close} />}

			{paused && <Pause legend={EXPERIMENTS[experiment] ?? EXPERIMENTS['solfato-di-rame']} exitHref={exitHref} apply={(st) => sceneRef.current && applySettings(sceneRef.current.player, st)} onResume={() => sceneRef.current?.player.lock()} onRestart={restart} done={done} />}
			{!started && <Title subtitle={subtitle ?? 'cristalli di solfato di rame'} progress={progress} ready={!!work} error={error} onStart={enter} />}
		</div>
	);
}

/** What to do now, top left, when it changes: then it fades, and the notebook keeps it. */
function Objective({ step, total, title, text, done }: { step: number; total: number; title: string; text: string; done: boolean }) {
	const [shown, setShown] = useState(true);
	useEffect(() => {
		const t = setTimeout(() => setShown(false), 9000);
		return () => clearTimeout(t);
	}, []);
	return (
		<div className={`transition-opacity duration-1000 ${shown ? 'opacity-100' : 'opacity-0'}`}>
			<div className="text-[11px] font-semibold tracking-[0.22em] text-[#fff1dc]/90 uppercase [text-shadow:0_1px_3px_rgba(20,16,30,0.95),0_0_12px_rgba(20,16,30,0.6)]">{done ? 'Esperimento concluso' : `Passo ${step + 1} di ${total} · ${title}`}</div>
			<div className="mt-1 font-display text-[19px] leading-snug text-white [text-shadow:0_1px_4px_rgba(20,16,30,0.95),0_0_14px_rgba(20,16,30,0.55)]">{done ? 'I risultati sono nel quaderno.' : text}</div>
		</div>
	);
}

const READ_ICON: Record<string, typeof Flame> = { Termometro: Thermometer, Fiamma: Flame };

/** The instruments the student is watching, under the objective, quiet. */
function Readouts({ items }: { items: Readout[] }) {
	return (
		<div className="flex flex-col gap-1">
			{items.map((r) => {
				const Icon = READ_ICON[r.label] ?? FlaskRound;
				return (
					<div
						key={r.label}
						className={`flex w-fit items-center gap-2 rounded-full py-1 pl-2 pr-3 text-[12.5px] font-medium backdrop-blur-sm ${r.tone === 'warn' ? 'bg-[#5a1f26]/65 text-[#ffd9dc]' : r.tone === 'hot' ? 'bg-[#4a2a1a]/60 text-[#ffd9b8]' : 'bg-[#141821]/55 text-white/95'}`}
					>
						<Icon className="size-4 opacity-90" strokeWidth={2.2} />
						<span className="opacity-70">{r.label}</span>
						<span className="font-mono">{r.value}</span>
					</div>
				);
			})}
		</div>
	);
}

/** A lens on the pipette's neck while it fills: the meniscus against the mark, ±10 mm. */
function Lens({ vol, offsetMm, ok }: { vol: number; offsetMm: number; ok: boolean }) {
	const range = 10;
	const y = Math.max(-range, Math.min(range, offsetMm));
	// the column's top, in percent from the lens' top
	const top = 50 - (y / range) * 50;
	return (
		<div className="pointer-events-none absolute right-[12%] top-1/2 z-20 flex -translate-y-1/2 flex-col items-center gap-2">
			<div className="relative size-40 overflow-hidden rounded-full bg-[radial-gradient(circle_at_40%_35%,#f4f8fa_0%,#dfe8ec_60%,#b9c7cf_100%)] shadow-[0_6px_24px_rgba(10,10,20,0.45),inset_0_0_0_3px_rgba(255,255,255,0.7)]">
				<div className="absolute left-1/2 top-0 h-full w-9 -translate-x-1/2 border-x-2 border-[#8fa4b0]/70 bg-white/35" />
				<div className="absolute bottom-0 left-1/2 w-9 -translate-x-1/2 bg-[#bcd8ea]/80 transition-[height] duration-100" style={{ height: `${offsetMm < -range ? 0 : 100 - top}%` }}>
					<div className="absolute -top-1.5 left-0 h-3 w-full rounded-b-full border-b-[3px] border-[#3d6d8f]/80" />
				</div>
				<div className="absolute left-5 right-5 top-1/2 h-[2px] bg-[#1f3f8a]" />
				<div className="absolute right-6 top-1/2 -translate-y-5 font-mono text-[11px] font-bold text-[#1f3f8a]">25 mL</div>
			</div>
			<div className={`rounded-full px-3 py-1 font-mono text-[13px] font-semibold backdrop-blur-sm ${ok ? 'bg-[#1f6b4a]/75 text-white' : 'bg-[#141821]/60 text-white/90'}`}>{vol.toFixed(2).replace('.', ',')} mL</div>
		</div>
	);
}

function Title({ subtitle, progress, ready, error, onStart }: { subtitle: string; progress: number; ready: boolean; error: string; onStart: () => void }) {
	return (
		<button
			onClick={ready ? onStart : undefined}
			className={`absolute inset-0 z-40 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#9fc6d8_0%,#6f8fb4_38%,#3f4a73_75%,#2a2638_100%)] text-center ${ready ? 'cursor-pointer' : 'cursor-wait'}`}
		>
			<div className="font-hand text-3xl text-[#fff1dc]/85">esperimento</div>
			<h1 className="font-display text-6xl font-semibold tracking-tight text-[#fff6e8] [text-shadow:0_2px_24px_rgba(30,40,70,0.35)] sm:text-7xl">Laboratorio</h1>
			<div className="mt-3 text-sm tracking-[0.25em] text-[#fff1dc]/75 uppercase">{subtitle}</div>
			<div className="mt-12 h-6">
				{error ? (
					<p className="max-w-md text-sm text-[#ffe0e0]">{error}</p>
				) : ready ? (
					<EnterHint />
				) : (
					<div className="h-[3px] w-56 overflow-hidden rounded-full bg-white/20">
						<div className="h-full rounded-full bg-[#fff1dc]/85 transition-[width] duration-300" style={{ width: `${Math.round(progress * 100)}%` }} />
					</div>
				)}
			</div>
			<div className="absolute bottom-6 text-xs text-[#fff1dc]/55">Un prototipo di Sapiens · da computer, con mouse e tastiera o con un controller</div>
		</button>
	);
}

function Pause({ legend, exitHref, apply, onResume, onRestart, done }: { legend: { uses: string; wheel: string }; exitHref: string; apply: (s: LabSettings) => void; onResume: () => void; onRestart: () => void; done: boolean }) {
	const item = 'block w-full rounded-lg px-4 py-2 text-left font-display text-2xl text-[#fff6e8]/90 transition hover:bg-white/10 hover:text-white';
	return (
		<div className="absolute inset-0 z-30 flex items-center bg-[linear-gradient(90deg,rgba(28,24,40,0.82)_0%,rgba(28,24,40,0.55)_45%,rgba(28,24,40,0.15)_100%)] px-[8vw]">
			<div className="w-[360px]">
				<div className="mb-6 text-xs tracking-[0.3em] text-[#fff1dc]/60 uppercase">{done ? 'Esperimento concluso' : 'Pausa'}</div>
				<nav className="space-y-1">
					<button className={item} onClick={onResume}>
						Riprendi
					</button>
					<button className={item} onClick={onRestart}>
						Ricomincia
					</button>
					<Link href={exitHref} className={item}>
						Esci dal laboratorio
					</Link>
				</nav>
				<Settings apply={apply} />
				<Controls uses={legend.uses} wheel={legend.wheel} />
			</div>
		</div>
	);
}
