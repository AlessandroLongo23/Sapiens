import { ArrowDownToLine, Ban, BookOpen, Check, Droplets, Flame, FoldVertical, Glasses, HandGrab, Hourglass, Pipette, RotateCw, Shovel, Thermometer, Waves, type LucideIcon } from 'lucide-react';
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import type { Action } from './engine/free';
import type { FirstPerson } from './engine/fps';
import { getDevice, onDevice, PAD_NAMES, serverDevice, type Device } from './engine/pad';

/*
 * The game's few pieces of screen, shared by the lab's routes: the prompt in the corner with each action's input and
 * icon, the key caps, the controls' legend and the settings in the pause menu. What names an input shows the device
 * in use: the keyboard and mouse, or a controller's buttons (engine/pad.ts).
 */

/** The device last used: 'keys', or the kind of controller. */
export const useDevice = () => useSyncExternalStore(onDevice, getDevice, serverDevice);

const VERBS: Record<Action['verb'], LucideIcon> = {
	grab: HandGrab,
	place: ArrowDownToLine,
	pour: Droplets,
	stir: Waves,
	light: Flame,
	turn: RotateCw,
	wear: Glasses,
	scoop: Shovel,
	insert: Thermometer,
	fold: FoldVertical,
	wait: Hourglass,
	draw: Pipette,
	confirm: Check,
	read: BookOpen
};

/**
 * In the bottom right corner, as in a game: the name of what the crosshair is on, then each action with its input and
 * an icon. An action that two inputs do alike (Q and E, when either hand can) is one line with both.
 */
export function Prompt({ target, actions }: { target: string | null; actions: Action[] }) {
	const device = useDevice();
	const lines: { inputs: Action['input'][]; action: Action }[] = [];
	for (const a of actions) {
		const same = lines.find((l) => l.action.verb === a.verb && l.action.text === a.text && !l.action.blocked === !a.blocked);
		if (same) same.inputs.push(a.input);
		else lines.push({ inputs: [a.input], action: a });
	}
	return (
		<div className="pointer-events-none absolute bottom-6 right-6 z-20 flex flex-col items-end gap-1.5 whitespace-nowrap">
			{target && <div className="mb-0.5 font-display text-[15px] font-medium text-white/95 [text-shadow:0_1px_3px_rgba(20,16,30,0.85)]">{target}</div>}
			{actions.length > 0 && (
				<div className="flex flex-col items-end gap-1.5">
					{lines.map(({ inputs, action: a }) => {
						const Icon = a.blocked ? Ban : VERBS[a.verb];
						return (
							<div
								key={inputs.join('') + a.verb}
								className={`flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-[12.5px] font-medium backdrop-blur-sm ${a.blocked ? 'bg-[#5a1f26]/60 text-[#ffd9dc]' : 'bg-[#141821]/55 text-white/95'}`}
							>
								{inputs.map((input) => (
									<Input key={input} input={input} device={device} />
								))}
								<Icon className="size-4 opacity-90" strokeWidth={2.2} />
								<span>{a.text}</span>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}

const FACE = 'grid size-[22px] place-items-center rounded-full border border-white/50 bg-white/10';

/** A controller's button: a face button's symbol or letter in a circle, the d-pad, or a trigger's name on a cap. */
export function PadButton({ name }: { name: string }) {
	const svg = (label: string, shape: ReactNode) => (
		<span className={FACE} aria-label={label}>
			<svg viewBox="0 0 12 12" className="size-3" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
				{shape}
			</svg>
		</span>
	);
	if (name === 'square') return svg('quadrato', <rect x="2" y="2" width="8" height="8" stroke="#f0a6d8" />);
	if (name === 'cross') return svg('croce', <path d="M2.5 2.5 L9.5 9.5 M9.5 2.5 L2.5 9.5" stroke="#9db8ff" />);
	if (name === 'circle') return svg('cerchio', <circle cx="6" cy="6" r="4" stroke="#ff9a9a" />);
	if (name === 'triangle') return svg('triangolo', <path d="M6 1.8 L10.4 9.6 L1.6 9.6 Z" stroke="#8fe0c0" />);
	if (name === 'dpad' || name === 'dpad-x')
		return (
			<svg viewBox="0 0 22 22" className="size-[22px]" aria-label={name === 'dpad' ? 'croce direzionale, su e giù' : 'croce direzionale, sinistra e destra'}>
				<path d="M8 1.5 h6 v6.5 h6.5 v6 h-6.5 v6.5 h-6 v-6.5 h-6.5 v-6 h6.5 Z" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.2" strokeLinejoin="round" />
				<path d={name === 'dpad' ? 'M11 3.2 L13.4 6.4 H8.6 Z M11 18.8 L13.4 15.6 H8.6 Z' : 'M3.2 11 L6.4 8.6 V13.4 Z M18.8 11 L15.6 8.6 V13.4 Z'} fill="#ffffff" />
			</svg>
		);
	if (name.length === 1) return <kbd className={`${FACE} font-sans text-[11px] font-bold text-white`}>{name}</kbd>;
	return <kbd className="grid h-[22px] min-w-[28px] place-items-center rounded-md border border-white/50 bg-white/10 px-1 font-sans text-[10.5px] font-bold text-white">{name}</kbd>;
}

/** A mouse with its left or right button lit, or its wheel, or the key cap of Q, E or R; on a controller, its button. */
export function Input({ input, device = 'keys' }: { input: Action['input']; device?: Device }) {
	if (device !== 'keys') return <PadButton name={PAD_NAMES[device][input]} />;
	if (input === 'Q' || input === 'E' || input === 'KeyR')
		return <kbd className="grid size-[22px] place-items-center rounded-md border border-white/50 bg-white/10 font-sans text-[11px] font-bold text-white">{input === 'KeyR' ? 'R' : input}</kbd>;
	const stroke = 'rgba(255,255,255,0.75)';
	if (input === 'W')
		return (
			<svg viewBox="0 0 16 22" className="h-[22px] w-4" aria-label="rotella del mouse">
				<rect x="1" y="1" width="14" height="20" rx="7" fill="none" stroke={stroke} strokeWidth="1.4" />
				<line x1="1.5" y1="9" x2="14.5" y2="9" stroke={stroke} strokeWidth="1.2" />
				<rect x="6.3" y="3.2" width="3.4" height="7" rx="1.7" fill="#ffffff" />
			</svg>
		);
	const left = input === 'L';
	return (
		<svg viewBox="0 0 16 22" className="h-[22px] w-4" aria-label={left ? 'clic sinistro' : 'clic destro'}>
			<rect x="1" y="1" width="14" height="20" rx="7" fill="none" stroke={stroke} strokeWidth="1.4" />
			<line x1="8" y1="1.5" x2="8" y2="9" stroke={stroke} strokeWidth="1.2" />
			<line x1="1.5" y1="9" x2="14.5" y2="9" stroke={stroke} strokeWidth="1.2" />
			<path d={left ? 'M8 1.8 A6.3 6.3 0 0 0 1.7 8.2 L1.7 8.3 L8 8.3 Z' : 'M8 1.8 A6.3 6.3 0 0 1 14.3 8.2 L14.3 8.3 L8 8.3 Z'} fill="#ffffff" />
		</svg>
	);
}

export function Key({ children }: { children: string }) {
	return <kbd className="mx-0.5 inline-grid min-w-[22px] place-items-center rounded border border-white/40 px-1 font-sans text-[11px] font-semibold text-white/90">{children}</kbd>;
}

/** The first seconds' line at the bottom: the few inputs to start with. */
export function Tip() {
	const device = useDevice();
	const dot = <span className="mx-2 text-white/40">·</span>;
	const cls = 'pointer-events-none absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 text-[13px] tracking-wide whitespace-nowrap text-white/75 [text-shadow:0_1px_3px_rgba(0,0,0,0.7)]';
	if (device === 'keys')
		return (
			<div className={cls}>
				<Key>Q</Key>
				<Key>E</Key> usa la mano sinistra e la destra {dot} <Key>B</Key> quaderno {dot} <Key>W</Key>
				<Key>A</Key>
				<Key>S</Key>
				<Key>D</Key> muoviti {dot} <Key>Esc</Key> pausa
			</div>
		);
	const n = PAD_NAMES[device];
	return (
		<div className={cls}>
			<PadButton name={n.L} />
			<PadButton name={n.R} /> prendi e posa {dot} <PadButton name={n.Q} />
			<PadButton name={n.E} /> usa le mani {dot} <PadButton name={device === 'playstation' ? 'OPTIONS' : 'MENU'} /> pausa
		</div>
	);
}

/** On the title: how to get in, with the device in use. */
export function EnterHint() {
	const device = useDevice();
	if (device === 'keys') return <span className="animate-pulse text-[15px] tracking-wide text-[#fff6e8]/90">Clicca per entrare</span>;
	return (
		<span className="inline-flex animate-pulse items-center gap-2 text-[15px] tracking-wide text-[#fff6e8]/90">
			Premi <PadButton name={device === 'playstation' ? 'cross' : 'A'} /> per entrare
		</span>
	);
}

/**
 * The pause menu's legend of the controls, for the device in use. `uses` says what the use keys do in this lab,
 * `wheel` what the wheel sets besides turning what is about to be put down.
 */
export function Controls({ uses, wheel }: { uses: string; wheel?: string }) {
	const device = useDevice();
	const dt = 'font-semibold text-[#fff1dc]/90';
	const turn = "ruota l'oggetto che stai per posare";
	const rows: [string, string][] =
		device === 'keys'
			? [
					['W A S D', 'muoviti · Shift corri · C abbassati'],
					['Mouse', 'guarda intorno · Z avvicina lo sguardo'],
					['Clic sinistro', 'la mano sinistra prende o appoggia'],
					['Clic destro', 'la mano destra prende o appoggia'],
					['Q · E', `la mano sinistra · la destra ${uses}`],
					wheel ? ['Rotella', `regola: ${wheel} · con R, ${turn}`] : ['Rotella · R', turn],
					['B', 'il quaderno: strumenti, passi, pagine da compilare e appunti. Per scriverci servono le mani libere'],
					['Controller', 'premi un suo tasto per usarlo: PlayStation o Xbox']
				]
			: (() => {
					const ps = device === 'playstation';
					const n = PAD_NAMES[device];
					return [
						['Levetta sinistra', `muoviti · premuta (L3) corri · ${ps ? 'cerchio' : 'B'} abbassati`],
						['Levetta destra', `guarda intorno · ${ps ? 'triangolo' : 'Y'} avvicina lo sguardo`],
						[n.L, 'la mano sinistra prende o appoggia'],
						[n.R, 'la mano destra prende o appoggia'],
						[`${n.Q} · ${n.E}`, `la mano sinistra · la destra ${uses}`],
						['Croce direzionale', `${wheel ? `su e giù regola: ${wheel} · ` : ''}sinistra e destra, o ${ps ? 'quadrato' : 'X'}, ${turn}`],
						[ps ? 'Share' : 'View', `il quaderno · ${n.Q} e ${n.E} sfogliano, la croce passa da un campo all'altro e cambia i valori`],
						[ps ? 'Options' : 'Menu', `pausa · per riprendere, ancora ${ps ? 'Options o croce' : 'Menu o A'}`]
					] as [string, string][];
				})();
	return (
		<dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[13px] text-[#fff1dc]/75">
			{rows.map(([k, v]) => (
				<div key={k} className="contents">
					<dt className={dt}>{k}</dt>
					<dd>{v}</dd>
				</div>
			))}
		</dl>
	);
}

export type LabSettings = { headMotion: boolean; rawMouse: boolean; sensitivity: number; padSensitivity: number };

const SETTINGS_KEY = 'sapiens-lab-settings';
const DEFAULTS: LabSettings = { headMotion: true, rawMouse: true, sensitivity: 1, padSensitivity: 1 };

/** The settings as this browser last saved them (a convenience: without storage, the defaults). */
export function loadSettings(): LabSettings {
	try {
		const raw = localStorage.getItem(SETTINGS_KEY);
		return raw ? { ...DEFAULTS, ...(JSON.parse(raw) as Partial<LabSettings>) } : { ...DEFAULTS };
	} catch {
		return { ...DEFAULTS };
	}
}

export function applySettings(player: FirstPerson, s: LabSettings) {
	player.headMotion = s.headMotion;
	player.rawMouse = s.rawMouse;
	player.sensitivity = s.sensitivity;
	player.padSensitivity = s.padSensitivity;
}

/** In the pause menu: how the head moves and how the mouse and the sticks turn it. */
export function Settings({ apply }: { apply: (s: LabSettings) => void }) {
	const [s, setS] = useState(loadSettings);
	const change = (patch: Partial<LabSettings>) => {
		const next = { ...s, ...patch };
		setS(next);
		apply(next);
		try {
			localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
		} catch {
			// kept for this visit only
		}
	};
	const row = 'flex items-center justify-between gap-4 text-[13px] text-[#fff1dc]/80';
	return (
		<div className="mt-8 space-y-2.5">
			<div className="text-xs tracking-[0.3em] text-[#fff1dc]/60 uppercase">Impostazioni</div>
			<Toggle label="Movimento della testa" hint="passi, respiro, inclinazione" on={s.headMotion} set={(v) => change({ headMotion: v })} />
			<Toggle label="Mouse senza accelerazione" on={s.rawMouse} set={(v) => change({ rawMouse: v })} />
			<label className={row}>
				<span>Sensibilità del mouse</span>
				<span className="flex items-center gap-2">
					<input type="range" min={0.3} max={3} step={0.05} value={s.sensitivity} onChange={(e) => change({ sensitivity: Number(e.target.value) })} className="w-28 accent-[#fff1dc]" />
					<span className="w-10 text-right tabular-nums">{s.sensitivity.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}×</span>
				</span>
			</label>
			<label className={row}>
				<span>Sensibilità delle levette</span>
				<span className="flex items-center gap-2">
					<input type="range" min={0.3} max={3} step={0.05} value={s.padSensitivity} onChange={(e) => change({ padSensitivity: Number(e.target.value) })} className="w-28 accent-[#fff1dc]" />
					<span className="w-10 text-right tabular-nums">{s.padSensitivity.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}×</span>
				</span>
			</label>
		</div>
	);
}

function Toggle({ label, hint, on, set }: { label: string; hint?: string; on: boolean; set: (v: boolean) => void }) {
	return (
		<button type="button" role="switch" aria-checked={on} onClick={() => set(!on)} className="flex w-full items-center justify-between gap-4 text-left text-[13px] text-[#fff1dc]/80">
			<span>
				{label} {hint && <span className="text-[#fff1dc]/45">· {hint}</span>}
			</span>
			<span className={`relative h-5 w-9 shrink-0 rounded-full transition ${on ? 'bg-[#fff1dc]/80' : 'bg-white/15'}`}>
				<span className={`absolute top-0.5 h-4 w-4 rounded-full bg-[#2a2438] transition-all ${on ? 'left-[18px]' : 'left-0.5'}`} />
			</span>
		</button>
	);
}
