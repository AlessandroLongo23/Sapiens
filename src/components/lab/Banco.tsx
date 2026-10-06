'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { LabScene } from './engine/scene';
import { LOOK } from './engine/look';
import { SHAPES } from './engine/grasp';
import { Notebook } from './engine/notebook';
import { Quaderno } from './quaderno/Quaderno';
import { Banco as BancoWork, type BancoSnapshot } from './engine/banco';
import { applySettings, Controls, EnterHint, loadSettings, Prompt, Settings, Tip, type LabSettings } from './hud';

const MODEL = '/lab/banco.glb';

const noSub = () => () => {};
const noSnap = () => null;

/**
 * The vertical slice of the lab as a game: nothing on screen but the scene, a dot for a crosshair, the name of what
 * it points at and a line of subtitles. What to do is in the notebook, which B brings up; Esc
 * pauses.
 */
export function Banco() {
	const host = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<LabScene | null>(null);
	const [work, setWork] = useState<BancoWork | null>(null);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState('');
	const [started, setStarted] = useState(false);
	const [locked, setLocked] = useState(false);
	const [run, setRun] = useState(0);
	const [tip, setTip] = useState(true);
	const [book, setBook] = useState<{ nb: Notebook; family: string } | null>(null);
	const snap = useSyncExternalStore<BancoSnapshot | null>(work?.subscribe ?? noSub, work?.getSnapshot ?? noSnap, noSnap);

	useEffect(() => {
		const el = host.current;
		if (!el) return;
		let alive = true;
		let scene: LabScene;
		try {
			scene = new LabScene(el, 'banco');
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
		Promise.all([scene.load(MODEL, (f) => alive && setProgress(f * 0.95)), document.fonts.load(`40px ${family}`), document.fonts.load(`bold 40px ${family}`)])
			.then(() => {
				if (!alive) return;
				const nb = new Notebook();
				// brought up by the student (B): the mouse is a cursor while it is up
				nb.onToggle = (open) => {
					if (open) setTip(false);
					setBook(open ? { nb, family } : null);
					scene.player.suspend(open);
				};
				const w = new BancoWork(scene, nb);
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
		};
	}, [run]);

	useEffect(() => {
		if (!started) return;
		const t = setTimeout(() => setTip(false), 14000);
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
		setRun((r) => r + 1);
	};

	const paused = started && !locked;

	return (
		<div className="fixed inset-0 overflow-hidden bg-[#2a2638] select-none">
			<div ref={host} className="absolute inset-0" aria-label="Laboratorio in 3D" />
			{started && locked && book && <Quaderno book={book.nb} font={book.family} onClose={book.nb.close} />}

			{started && locked && (
				<div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
					<div className={`size-[5px] rounded-full bg-white/90 shadow-[0_0_4px_rgba(0,0,0,0.5)] transition-transform ${snap?.actions.length ? 'scale-150' : ''}`} />
				</div>
			)}
			{started && locked && snap && (snap.target || snap.actions.length > 0) && <Prompt target={snap.target} actions={snap.actions} />}

			{started && locked && snap?.message && (
				<div key={snap.message.text} className="pointer-events-none absolute bottom-[9%] left-1/2 z-20 max-w-[640px] -translate-x-1/2 text-center">
					<span className="inline-block rounded-md bg-[#1d1a28]/55 px-3 py-1.5 text-[15px] leading-relaxed text-[#fbf3e4] [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">{snap.message.text}</span>
				</div>
			)}

			{started && locked && tip && (
				<Tip />
			)}

			{paused && <Pause apply={(st) => sceneRef.current && applySettings(sceneRef.current.player, st)} onResume={() => sceneRef.current?.player.lock()} onRestart={restart} done={!!snap?.done} />}
			{!started && <Title progress={progress} ready={!!work} error={error} onStart={enter} />}
		</div>
	);
}

function Title({ progress, ready, error, onStart }: { progress: number; ready: boolean; error: string; onStart: () => void }) {
	return (
		<button
			onClick={ready ? onStart : undefined}
			className={`absolute inset-0 z-40 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,#f1b48f_0%,#b886a6_38%,#4d4a73_75%,#2a2638_100%)] text-center ${ready ? 'cursor-pointer' : 'cursor-wait'}`}
		>
			<div className="font-hand text-3xl text-[#fff1dc]/85">il banco di</div>
			<h1 className="font-display text-6xl font-semibold tracking-tight text-[#fff6e8] [text-shadow:0_2px_24px_rgba(60,30,60,0.35)] sm:text-7xl">Laboratorio</h1>
			<div className="mt-3 text-sm tracking-[0.25em] text-[#fff1dc]/75 uppercase">il solfato di rame</div>
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

function Pause({ apply, onResume, onRestart, done }: { apply: (s: LabSettings) => void; onResume: () => void; onRestart: () => void; done: boolean }) {
	const item = 'block w-full rounded-lg px-4 py-2 text-left font-display text-2xl text-[#fff6e8]/90 transition hover:bg-white/10 hover:text-white';
	return (
		<div className="absolute inset-0 z-30 flex items-center bg-[linear-gradient(90deg,rgba(28,24,40,0.82)_0%,rgba(28,24,40,0.55)_45%,rgba(28,24,40,0.15)_100%)] px-[8vw]">
			<div className="w-[340px]">
				<div className="mb-6 text-xs tracking-[0.3em] text-[#fff1dc]/60 uppercase">{done ? 'Lavoro finito' : 'Pausa'}</div>
				<nav className="space-y-1">
					<button className={item} onClick={onResume}>
						Riprendi
					</button>
					<button className={item} onClick={onRestart}>
						Ricomincia
					</button>
					<Link href="/" className={item}>
						Esci dal laboratorio
					</Link>
				</nav>
				<Settings apply={apply} />
				<Controls uses="usa quello che tiene: mescola, versa nell'altra mano" />
			</div>
		</div>
	);
}
