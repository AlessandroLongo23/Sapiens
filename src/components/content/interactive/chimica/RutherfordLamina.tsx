'use client';

import { useRef, useState } from 'react';
import { Crosshair, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Label, frame, v, num, useFrameLoop, useReducedMotion, TINT, THIN, DASH, type V } from '../kit';

/**
 * Lesson 41 (I modelli atomici di Thomson e di Rutherford): alpha particles fired from the left at three atoms of a gold
 * foil, one above the other, with the model of the atom chosen by the student.
 *
 * Thomson: the positive charge is spread over the whole atom, the forces are weak, and every particle goes through
 * straight (the real deflection, a fraction of a degree, would not show).
 *
 * Rutherford: each particle is pushed by the nucleus nearest to its line, with the Coulomb orbit written in closed form.
 * With the nucleus at the origin, a particle coming from the left at height b > 0, polar angle φ from the x axis and
 * d the distance of closest approach in a head-on shot (d = 2kqQ / (m v²)), 1/r = sin φ / b - (d / 2b²)(1 + cos φ): it
 * comes in at φ = π and leaves along φ = θ, where tan(θ/2) = d / (2b), Rutherford's own relation. Below the nucleus
 * (b < 0) the path is mirrored. Along the path the speed is v₀ √(1 - d/r), from the conservation of energy, so the
 * particle slows down as it climbs towards the nucleus. The nuclei and d are drawn far bigger than in the real foil,
 * where a nucleus is ten thousand times smaller than its atom and a bounce is one in thousands: the caption says so.
 */

type Model = 'thomson' | 'rutherford';

const f = frame(-5, 5, -3.3, 3.3);
const ATOMS = [2, 0, -2]; // the nuclei's heights
const R_ATOM = 1;
const D = 0.04; // head-on closest approach, cm
const SPEED = 4.2; // cm per second, far from the nuclei
const X_START = -5.6;
const FAR = 6.5; // the paths start and end this far from their nucleus, outside the drawing

interface Shot {
	pts: V[];
	/** Time (s) at each point, from the start of this shot. */
	ts: number[];
	start: number;
	/** Deflection in degrees, 0 to 180. */
	theta: number;
}

/** The path of a particle at height y, as points and times, and its deflection. */
function path(y: number, model: Model): Omit<Shot, 'start'> {
	if (model === 'thomson') {
		const pts = [v(X_START, y), v(-X_START, y)];
		return { pts, ts: [0, (2 * -X_START) / SPEED], theta: 0 };
	}
	// the nucleus nearest to the line, and the height relative to it
	const yc = ATOMS.reduce((a, c) => (Math.abs(y - c) < Math.abs(y - a) ? c : a), ATOMS[0]);
	const b0 = y - yc;
	const sgn = b0 < 0 ? -1 : 1;
	const b = Math.max(Math.abs(b0), 1e-4);
	const c = D / (2 * b * b);
	const theta = 2 * Math.atan(D / (2 * b)); // radians, 0 to π
	const local: V[] = [];
	const N = 500;
	for (let i = 1; i < N; i++) {
		const s = (1 - Math.cos((Math.PI * i) / N)) / 2; // denser at the two ends
		const phi = Math.PI - s * (Math.PI - theta);
		const u = Math.sin(phi) / b - c * (1 + Math.cos(phi));
		if (u <= 0) continue;
		const r = 1 / u;
		if (r > FAR) continue;
		local.push(v(r * Math.cos(phi), r * Math.sin(phi)));
	}
	// the straight parts: in along y = b from far left, out along the direction θ
	const last = local[local.length - 1] ?? v(0, b);
	const all = [...local, v(last.x + 8 * Math.cos(theta), last.y + 8 * Math.sin(theta))];
	const pts = all.map((p) => v(p.x, yc + sgn * p.y));
	const ts = [0];
	for (let i = 1; i < pts.length; i++) {
		const a = pts[i - 1], q = pts[i];
		const mid = v((a.x + q.x) / 2, (a.y + q.y) / 2);
		const r = Math.hypot(mid.x, mid.y - yc);
		const speed = SPEED * Math.sqrt(Math.max(0.02, 1 - D / r));
		ts.push(ts[i - 1] + Math.hypot(q.x - a.x, q.y - a.y) / speed);
	}
	return { pts, ts, theta: (theta * 180) / Math.PI };
}

/** Where a shot is at time t since it started: the points passed, and the head. */
function travelled(s: Shot, t: number): { pts: V[]; done: boolean } {
	const { pts, ts } = s;
	if (t <= 0) return { pts: [pts[0]], done: false };
	if (t >= ts[ts.length - 1]) return { pts, done: true };
	let i = 1;
	while (ts[i] < t) i++;
	const k = (t - ts[i - 1]) / (ts[i] - ts[i - 1]);
	const head = v(pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k, pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k);
	return { pts: [...pts.slice(0, i), head], done: false };
}

/** Is the point inside the drawing (with a margin)? A shot is over for the eye once it has left it. */
const inside = (p: V) => p.x > f.x0 - 0.3 && p.x < f.x1 + 0.3 && p.y > f.y0 - 0.3 && p.y < f.y1 + 0.3;

/** The time at which a shot leaves the drawing for good. */
function exitTime(s: Omit<Shot, 'start'>) {
	for (let i = s.pts.length - 1; i > 0; i--) if (inside(s.pts[i - 1])) return s.ts[i];
	return s.ts[s.ts.length - 1];
}

const kind = (theta: number) => (theta < 10 ? 0 : theta <= 90 ? 1 : 2);

// Electrons of an atom, in the same places for both models (fractions of the atom's radius).
const ELECTRONS: V[] = [v(-0.55, 0.5), v(0.35, 0.72), v(0.78, -0.12), v(-0.2, -0.78), v(-0.8, -0.2), v(0.45, -0.55)];

function Atom({ yc, model }: { yc: number; model: Model }) {
	const c = f.px(v(0, yc));
	const r = R_ATOM * (f.W / (f.x1 - f.x0));
	return (
		<g>
			{model === 'thomson' ? (
				<>
					<circle cx={c.x} cy={c.y} r={r} fill={TINT.red} stroke="#000" strokeWidth={THIN} />
					{[v(-0.4, 0.15), v(0.3, 0.35), v(0.1, -0.35), v(-0.45, -0.5), v(0.6, 0.1), v(-0.1, 0.65)].map((p, i) => (
						<Label key={i} f={f} at={v(p.x, yc + p.y)} upright size={12} color="#a00">
							+
						</Label>
					))}
				</>
			) : (
				<>
					<circle cx={c.x} cy={c.y} r={r} fill="none" stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} opacity={0.5} />
					<circle cx={c.x} cy={c.y} r={2} fill="#c00" />
				</>
			)}
			{ELECTRONS.map((p, i) => {
				const q = f.px(v(p.x, yc + p.y));
				return <circle key={i} cx={q.x} cy={q.y} r={2.4} fill={TINT.blue20} stroke="#000" strokeWidth={0.5} />;
			})}
		</g>
	);
}

export default function RutherfordLamina({ alt }: { alt?: string }) {
	const [model, setModel] = useState<Model>('rutherford');
	const [shots, setShots] = useState<Shot[]>([]);
	const [clock, setClock] = useState(0);
	const [aim, setAim] = useState(0.05);
	const [lastSingle, setLastSingle] = useState<number | null>(null);
	const reduced = useReducedMotion();
	const seed = useRef(1);

	const end = shots.reduce((m, s) => Math.max(m, s.start + exitTime(s)), 0);
	const running = clock < end;
	useFrameLoop(running, (dt) => setClock((c) => c + dt));

	const random = () => {
		// a small deterministic generator, so two students who press the same buttons see the same shots
		seed.current = (seed.current * 16807) % 2147483647;
		return (seed.current - 1) / 2147483646;
	};
	const fire = (ys: number[], gap: number) => {
		const t0 = reduced ? clock : Math.max(clock, 0);
		const add = ys.map((y, i) => {
			const p = path(y, model);
			return { ...p, start: reduced ? t0 - 100 : t0 + i * gap };
		});
		setShots((s) => [...s, ...add]);
	};
	const beam = () => {
		setLastSingle(null);
		fire(Array.from({ length: 50 }, () => -2.95 + 5.9 * random()), 0.07);
	};
	const single = () => {
		const p = path(aim, model);
		setLastSingle(p.theta);
		fire([aim], 0);
	};
	const clear = () => {
		setShots([]);
		setClock(0);
		setLastSingle(null);
		seed.current = 1;
	};
	const choose = (m: Model) => {
		setModel(m);
		clear();
	};

	const t = clock;
	const views = shots.map((s) => {
		const tr = travelled(s, reduced ? Infinity : t - s.start);
		return { s, pts: tr.pts, done: tr.done || reduced || t - s.start >= exitTime(s) };
	});
	const finished = views.filter((x) => x.done);
	const counts = [0, 0, 0];
	finished.forEach((x) => counts[kind(x.s.theta)]++);

	let caption: string;
	if (shots.length === 0)
		caption =
			model === 'thomson'
				? 'Modello di Thomson: la carica positiva è sparsa in tutto l’atomo. Spara le particelle alfa e guarda come attraversano la lamina.'
				: 'Modello di Rutherford: la carica positiva e quasi tutta la massa sono in un nucleo piccolissimo. Spara le particelle alfa, o mirane una vicino al nucleo centrale.';
	else if (model === 'thomson') caption = 'Con il modello di Thomson le forze sulle particelle alfa sono deboli: passano tutte quasi dritte. Nell’esperimento vero, però, alcune tornavano indietro.';
	else if (lastSingle !== null) caption = `La particella passa a ${num(aim, 2)} raggi dell\u2019atomo dal nucleo e viene deviata di ${num(lastSingle, 0)}°: più passa vicino al nucleo, più è respinta. I nuclei e le deviazioni sono molto esagerati rispetto alla lamina vera.`;
	else caption = 'Quasi tutte le particelle passano dritte nello spazio vuoto dell’atomo; quelle che sfiorano un nucleo sono deviate, e poche tornano indietro. Nella lamina vera il nucleo è diecimila volte più piccolo dell’atomo, e le deviazioni grandi sono molto più rare.';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{ATOMS.map((yc) => (
					<Atom key={yc} yc={yc} model={model} />
				))}
				{views.map(({ pts, done }, i) => (
					<g key={i} opacity={done ? 0.35 : 1}>
						<path d={f.path(pts)} fill="none" stroke="#000099" strokeWidth={THIN} />
						{!done && <circle cx={f.px(pts[pts.length - 1]).x} cy={f.px(pts[pts.length - 1]).y} r={2.6} fill="#e67300" />}
					</g>
				))}
				<Label f={f} at={v(-4.9, 3.05)} dir={v(1, 0)} upright size={12}>
					particelle alfa
				</Label>
				<Label f={f} at={v(4.9, 3.05)} dir={v(-1, 0)} upright size={12}>
					{model === 'thomson' ? 'atomi di Thomson' : 'nuclei non in scala'}
				</Label>
			</Drawing>

			<Readout>
				<span>
					Passate dritte: <strong className="tabular-nums">{counts[0]}</strong>
				</span>
				<span>
					Deviate più di 10°: <strong className="tabular-nums">{counts[1]}</strong>
				</span>
				<span>
					Tornate indietro: <strong className="tabular-nums">{counts[2]}</strong>
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup
						label="Modello dell'atomo"
						options={[
							{ value: 'thomson', label: 'Thomson' },
							{ value: 'rutherford', label: 'Rutherford' }
						]}
						value={model}
						onChange={choose}
					/>
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" onClick={beam}>
						<Sparkles className="size-4" aria-hidden="true" />
						Spara 50 particelle
					</Button>
					<Button variant="secondary" size="sm" onClick={clear} disabled={shots.length === 0}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
				{model === 'rutherford' && (
					<>
						<Slider label="Distanza dal nucleo (raggi dell'atomo)" value={aim} min={0} max={0.8} step={0.01} onChange={setAim} />
						<ButtonRow>
							<Button variant="secondary" size="sm" onClick={single}>
								<Crosshair className="size-4" aria-hidden="true" />
								Spara una particella mirata
							</Button>
						</ButtonRow>
					</>
				)}
			</Controls>
		</Figure>
	);
}
