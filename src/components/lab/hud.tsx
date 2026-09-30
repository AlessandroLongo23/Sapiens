import { ArrowDownToLine, Ban, Check, Droplets, Flame, FoldVertical, Glasses, HandGrab, Hourglass, Pipette, RotateCw, Shovel, Thermometer, Waves, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import type { Action } from './engine/free';
import type { FirstPerson } from './engine/fps';

/*
 * The game's few pieces of screen, shared by the lab's routes: the prompt in the corner with each action's input and
 * icon, the key caps, the settings in the pause menu.
 */

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
	confirm: Check
};

/** In the bottom right corner, as in a game: the name of what the crosshair is on, then each action with its input and an icon. */
export function Prompt({ target, actions }: { target: string | null; actions: Action[] }) {
	return (
		<div className="pointer-events-none absolute bottom-6 right-6 z-20 flex flex-col items-end gap-1.5 whitespace-nowrap">
			{target && <div className="mb-0.5 font-display text-[15px] font-medium text-white/95 [text-shadow:0_1px_3px_rgba(20,16,30,0.85)]">{target}</div>}
			{actions.length > 0 && (
				<div className="flex flex-col items-end gap-1.5">
					{actions.map((a) => {
						const Icon = a.blocked ? Ban : VERBS[a.verb];
						return (
							<div
								key={a.input + a.verb}
								className={`flex items-center gap-1.5 rounded-full py-1 pl-1 pr-3 text-[12.5px] font-medium backdrop-blur-sm ${a.blocked ? 'bg-[#5a1f26]/60 text-[#ffd9dc]' : 'bg-[#141821]/55 text-white/95'}`}
							>
								<Input input={a.input} />
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

/** A mouse with its left or right button lit, or its wheel, or a key cap. */
export function Input({ input }: { input: Action['input'] }) {
	if (input === 'F')
		return <kbd className="grid size-[22px] place-items-center rounded-md border border-white/50 bg-white/10 font-sans text-[11px] font-bold text-white">F</kbd>;
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

export type LabSettings = { headMotion: boolean; rawMouse: boolean; sensitivity: number };

const SETTINGS_KEY = 'sapiens-lab-settings';
const DEFAULTS: LabSettings = { headMotion: true, rawMouse: true, sensitivity: 1 };

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
}

/** In the pause menu: how the head moves and how the mouse turns it. */
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
