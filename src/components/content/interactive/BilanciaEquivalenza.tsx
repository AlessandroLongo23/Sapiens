'use client';

import { useRef, useState, type ReactNode } from 'react';
import { Minus, Plus, Divide, Undo2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, add, rot, clamp, K, useFrameLoop, useReducedMotion, TINT, THICK, THIN, FONT, FONT_MATH, type V } from './kit';

/**
 * The principles of equivalence on a two-pan balance (lesson 16). Each pan holds boxes x and weights of 1; every box
 * weighs the solution, which the student does not see. A move on both pans keeps the balance level and the equation
 * equivalent; a move on one pan only tips the beam, since the equation has changed and the solution with it.
 *
 * The beam is a damped pendulum: the heavier pan pulls it down to the angle where the torque of the difference
 * balances the beam's own weight hanging under the pivot (tan θ proportional to the difference), and it stops against
 * the frame at ±MAX. The pans hang level, as on a kitchen balance. Weights never go negative, which is why the
 * equations have only positive terms and a positive integer solution.
 */

type Pan = { x: number; n: number };
type State = { L: Pan; R: Pan };
type Side = 'L' | 'both' | 'R';

const EQUATIONS: { label: string; start: State; sol: number }[] = [
	{ label: '3x + 5 = 11', start: { L: { x: 3, n: 5 }, R: { x: 0, n: 11 } }, sol: 2 },
	{ label: '2x + 3 = 11', start: { L: { x: 2, n: 3 }, R: { x: 0, n: 11 } }, sol: 4 },
	{ label: '5x = 2x + 12', start: { L: { x: 5, n: 0 }, R: { x: 2, n: 12 } }, sol: 4 }
];
const MAX_X = 6;
const MAX_N = 12;

const f = frame(-4.3, 4.3, -0.75, 4.4);
const PIVOT = v(0, 1.5);
const ARM = 2.75;
const PAN = 1.3; // half width
const POST = 0.35;
const MAX = (12 * Math.PI) / 180;
const BOX = 0.5, BOX_GAP = 0.08;
const UNIT = 0.34, UNIT_GAP = 0.06;

/** The angle the beam settles at for a difference d of weight (left minus right), before the stops. */
const rest = (d: number) => clamp(Math.atan(0.08 * d), -MAX, MAX);

const term = (p: Pan) => {
	const parts = [];
	if (p.x) parts.push(p.x === 1 ? 'x' : `${p.x}x`);
	if (p.n) parts.push(String(p.n));
	return parts.length ? parts.join(' + ') : '0';
};

/** Rows of items on a pan, boxes at the bottom and weights above, each row centred. */
function pile(p: Pan) {
	const items: { kind: 'x' | '1'; at: V }[] = [];
	let y = 0.03;
	const rows = (count: number, size: number, gap: number, kind: 'x' | '1') => {
		const per = Math.floor((2 * PAN - 0.2 + gap) / (size + gap));
		for (let i = 0; i < count; i += per) {
			const k = Math.min(per, count - i);
			const w = k * size + (k - 1) * gap;
			for (let j = 0; j < k; j++) items.push({ kind, at: v(-w / 2 + j * (size + gap), y) });
			y += size + gap;
		}
	};
	rows(p.x, BOX, BOX_GAP, 'x');
	rows(p.n, UNIT, UNIT_GAP, '1');
	return items;
}

export default function BilanciaEquivalenza({ alt }: { alt?: string }) {
	const [which, setWhich] = useState(0);
	const eq = EQUATIONS[which];
	const [history, setHistory] = useState<State[]>([eq.start]);
	const [side, setSide] = useState<Side>('both');
	const [last, setLast] = useState<Side | null>(null);
	const s = history[history.length - 1];
	const weight = (p: Pan) => p.x * eq.sol + p.n;
	const diff = weight(s.L) - weight(s.R);

	// The beam: angle and angular speed, stepped as a damped pendulum towards its resting angle.
	const reduced = useReducedMotion();
	const body = useRef({ theta: 0, omega: 0 });
	const [theta, setTheta] = useState(0);
	const target = rest(diff);
	// Runs until the beam lies still at its resting angle; with reduced motion it is drawn there at once.
	const moving = !reduced && theta !== target;
	useFrameLoop(moving, (dt) => {
		const b = body.current;
		const w0 = 2 * Math.PI * 0.9, zeta = 0.22;
		const n = 4;
		for (let i = 0; i < n; i++) {
			const h = dt / n;
			b.omega += (w0 * w0 * (target - b.theta) - 2 * zeta * w0 * b.omega) * h;
			b.theta += b.omega * h;
			if (Math.abs(b.theta) > MAX) {
				b.theta = Math.sign(b.theta) * MAX;
				if (b.omega * b.theta > 0) b.omega *= -0.3;
			}
		}
		setTheta(b.theta);
		if (Math.abs(b.theta - target) < 1e-4 && Math.abs(b.omega) < 1e-3) {
			b.theta = target;
			b.omega = 0;
			setTheta(target);
		}
	});
	const angle = reduced ? target : theta;

	const pans = (sd: Side): ('L' | 'R')[] => (sd === 'both' ? ['L', 'R'] : [sd]);
	const targets = pans(side);
	const apply = (change: (p: Pan) => Pan) => {
		const next = { ...s };
		for (const k of targets) next[k] = change(s[k]);
		setHistory((h) => [...h, next]);
		setLast(side);
	};
	const can = (ok: (p: Pan) => boolean) => targets.every((k) => ok(s[k]));
	const divisors = [2, 3, 4, 5, 6].filter((k) => targets.every((t) => s[t].x % k === 0 && s[t].n % k === 0) && targets.some((t) => s[t].x || s[t].n));

	const choose = (i: number) => {
		setWhich(i);
		setHistory([EQUATIONS[i].start]);
		setLast(null);
	};

	// What the equation is now, compared with the one we started from.
	const sameX = s.L.x === s.R.x;
	const identity = sameX && s.L.n === s.R.n;
	const impossible = sameX && !identity;
	const solved = diff === 0 && ((s.L.x === 1 && s.L.n === 0 && s.R.x === 0) || (s.R.x === 1 && s.R.n === 0 && s.L.x === 0));
	const tilt = diff > 0 ? 'a sinistra' : 'a destra';
	let caption: ReactNode;
	if (history.length === 1) caption = 'Scegli su quale piatto agire e fai una mossa. Ogni scatola x pesa quanto la soluzione, e la bilancia resta in equilibrio solo se fai la stessa mossa su tutti e due i piatti.';
	else if (identity) caption = 'I due piatti sono uguali: la bilancia sta in equilibrio qualunque sia il peso della scatola. L\'equazione è un\'identità e non dice più quanto vale x.';
	else if (impossible) caption = `Con lo stesso numero di scatole sui due piatti la bilancia pende ${tilt} qualunque sia il peso di x: l'equazione è impossibile.`;
	else if (solved) caption = <>È rimasta una x sola, e la bilancia è in equilibrio: <Tex>{`x = ${eq.sol}`}</Tex>, cioè <Tex>{`S = \\{${eq.sol}\\}`}</Tex>.</>;
	else if (diff !== 0) caption = `La bilancia pende ${tilt}: una mossa su un piatto solo cambia l'equazione, e ${eq.sol} non è più la sua soluzione. Annulla, oppure fai la stessa mossa sull'altro piatto.`;
	else if (last === 'both') caption = 'Stessa mossa sui due piatti: la bilancia resta in equilibrio e l\'equazione nuova è equivalente a quella di prima.';
	else caption = 'La bilancia è tornata in equilibrio: l\'equazione è di nuovo equivalente a quella di partenza.';

	// The beam, its ends and the pans on them.
	const end = (k: 'L' | 'R') => add(PIVOT, rot(v(k === 'L' ? -ARM : ARM, 0), angle));
	const beam = (dx: number, dy: number) => add(PIVOT, rot(v(dx, dy), angle));
	const needle = add(PIVOT, rot(v(0, 1.05), angle));

	const drawPan = (k: 'L' | 'R') => {
		const e = end(k);
		const base = add(e, v(0, POST));
		const at = (p: V) => add(base, p);
		return (
			<g key={k}>
				<line x1={f.px(e).x} y1={f.px(e).y} x2={f.px(base).x} y2={f.px(base).y} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([at(v(-PAN, 0.12)), at(v(-PAN + 0.1, 0)), at(v(PAN - 0.1, 0)), at(v(PAN, 0.12))])} fill="none" stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				{pile(s[k]).map((it, i) => {
					const size = it.kind === 'x' ? BOX : UNIT;
					const p0 = at(it.at);
					const q = f.px(add(p0, v(0, size)));
					const c = f.px(add(p0, v(size / 2, size / 2)));
					return (
						<g key={i}>
							<rect x={q.x} y={q.y} width={size * K} height={size * K} fill={it.kind === 'x' ? TINT.blue : TINT.orange} stroke="#000" strokeWidth={THIN} />
							<text x={c.x} y={c.y} dy="0.35em" textAnchor="middle" fontSize={it.kind === 'x' ? 15 : 11} fontStyle={it.kind === 'x' ? 'italic' : 'normal'} fontFamily={it.kind === 'x' ? FONT_MATH : FONT} fill="#000">
								{it.kind}
							</text>
						</g>
					);
				})}
			</g>
		);
	};

	const scaleArc = [-MAX, -MAX / 2, 0, MAX / 2, MAX].map((a) => [add(PIVOT, rot(v(0, 1.15), a)), add(PIVOT, rot(v(0, a === 0 ? 1.35 : 1.27), a))]);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* Stand: foot, post and the scale the needle reads. */}
				<polygon points={f.pts(v(-1, 0), v(1, 0), v(0.14, 0.25), v(-0.14, 0.25))} fill={TINT.gray} stroke="#000" strokeWidth={THIN} />
				<line x1={f.px(v(0, 0.25)).x} y1={f.px(v(0, 0.25)).y} x2={f.px(PIVOT).x} y2={f.px(PIVOT).y} stroke="#000" strokeWidth={THICK * 1.6} />
				{scaleArc.map(([a, b], i) => (
					<line key={i} x1={f.px(a).x} y1={f.px(a).y} x2={f.px(b).x} y2={f.px(b).y} stroke="#000" strokeWidth={THIN} />
				))}
				<line x1={f.px(PIVOT).x} y1={f.px(PIVOT).y} x2={f.px(needle).x} y2={f.px(needle).y} stroke="#000" strokeWidth={THIN} />
				<polygon points={f.pts(beam(-ARM, -0.06), beam(ARM, -0.06), beam(ARM, 0.06), beam(-ARM, 0.06))} fill="#000" />
				<circle cx={f.px(PIVOT).x} cy={f.px(PIVOT).y} r={3.2} fill="#fff" stroke="#000" strokeWidth={THIN} />
				{drawPan('L')}
				{drawPan('R')}
				<Label f={f} at={v(-ARM, -0.1)} dir={v(0, -1)} upright size={13}>primo membro</Label>
				<Label f={f} at={v(ARM, -0.1)} dir={v(0, -1)} upright size={13}>secondo membro</Label>
			</Drawing>

			<Readout>
				<span className="text-base">
					<Tex>{`${term(s.L)} = ${term(s.R)}`}</Tex>
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<ToggleGroup
					label="Equazione"
					value={String(which)}
					onChange={(x) => choose(Number(x))}
					options={EQUATIONS.map((e, i) => ({ value: String(i), label: e.label }))}
				/>
				<ToggleGroup
					label="Dove fare la mossa"
					value={side}
					onChange={setSide}
					options={[
						{ value: 'L', label: 'Piatto sinistro' },
						{ value: 'both', label: 'Tutti e due' },
						{ value: 'R', label: 'Piatto destro' }
					]}
				/>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={!can((p) => p.x > 0)} onClick={() => apply((p) => ({ ...p, x: p.x - 1 }))}>
						<Minus className="size-4" aria-hidden="true" />
						Togli una x
					</Button>
					<Button variant="secondary" size="sm" disabled={!can((p) => p.x < MAX_X)} onClick={() => apply((p) => ({ ...p, x: p.x + 1 }))}>
						<Plus className="size-4" aria-hidden="true" />
						Aggiungi una x
					</Button>
					<Button variant="secondary" size="sm" disabled={!can((p) => p.n > 0)} onClick={() => apply((p) => ({ ...p, n: p.n - 1 }))}>
						<Minus className="size-4" aria-hidden="true" />
						Togli 1
					</Button>
					<Button variant="secondary" size="sm" disabled={!can((p) => p.n < MAX_N)} onClick={() => apply((p) => ({ ...p, n: p.n + 1 }))}>
						<Plus className="size-4" aria-hidden="true" />
						Aggiungi 1
					</Button>
				</ButtonRow>
				<ButtonRow>
					{divisors.length === 0 ? (
						<Button variant="secondary" size="sm" disabled>
							<Divide className="size-4" aria-hidden="true" />
							Dividi in parti uguali
						</Button>
					) : (
						divisors.map((k) => (
							<Button key={k} variant="secondary" size="sm" onClick={() => apply((p) => ({ x: p.x / k, n: p.n / k }))}>
								<Divide className="size-4" aria-hidden="true" />
								Dividi per {k}
							</Button>
						))
					)}
					<Button variant="secondary" size="sm" disabled={history.length === 1} onClick={() => { setHistory((h) => h.slice(0, -1)); setLast(null); }}>
						<Undo2 className="size-4" aria-hidden="true" />
						Annulla
					</Button>
					<Button variant="secondary" size="sm" disabled={history.length === 1} onClick={() => choose(which)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
