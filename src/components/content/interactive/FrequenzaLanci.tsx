'use client';

import { useState, type ReactNode } from 'react';
import { Coins, Dices, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, Label, frame, v, useFrameLoop, useReducedMotion, num, THICK, THIN, DASH, type V } from './kit';

/**
 * The frequentist definition (lesson 94): the student tosses a coin (or rolls a die and watches an event) 1, 10, 100
 * or 1000 times at a go, and the graph draws the relative frequency after each toss, with the classical probability
 * as a dashed line. Every series is new: the outcomes come from crypto.getRandomValues. Starting again keeps the
 * last series in grey, to show that each one wanders differently and they all close in on the line.
 *
 * Drawn like the TikZ graph of the lesson: the horizontal axis is 5 cm for the whole range of tosses, the vertical
 * one 3 cm for a frequency of 1, the curve blue!70!black. The range grows with the tosses (10, 20, 50, 100…).
 */

const MAX_N = 10000;
const W = 5, H = 3;
const f = frame(-0.95, 6.35, -0.6, 4.0);
const CURVE = '#0000b3'; // blue!70!black
const AXIS = '#4d4d4d'; // black!70
const LINE = '#808080'; // black!50
const OLD = '#b3b3b3';
const RANGES = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000];

type Event = { key: string; label: string; faces: number[]; p: string; value: number; what: string };
const COIN: Event = { key: 'testa', label: 'Testa', faces: [1], p: '\\tfrac{1}{2}', value: 1 / 2, what: 'teste' };
const DIE: Event[] = [
	{ key: 'pari', label: 'Numero pari', faces: [2, 4, 6], p: '\\tfrac{1}{2}', value: 1 / 2, what: 'numeri pari' },
	{ key: 'tre', label: 'Multiplo di 3', faces: [3, 6], p: '\\tfrac{1}{3}', value: 1 / 3, what: 'multipli di 3' },
	{ key: 'cinque', label: 'Esce 5', faces: [5], p: '\\tfrac{1}{6}', value: 1 / 6, what: 'volte il 5' }
];

/** A fair coin (0 or 1) or die (1 to 6), from the browser's cryptographic generator, without modulo bias. */
function draw(sides: 2 | 6) {
	const b = new Uint8Array(1);
	for (;;) {
		crypto.getRandomValues(b);
		if (sides === 2) return b[0] & 1;
		if (b[0] < 252) return (b[0] % 6) + 1;
	}
}

/** A series of tosses: how many successes after each one (cum[i] after i tosses), and the longest run of them. */
type Series = { cum: Int32Array; n: number; run: number; best: number; last: number | null };
const empty = (): Series => ({ cum: new Int32Array(MAX_N + 1), n: 0, run: 0, best: 0, last: null });

function toss(s: Series, count: number, sides: 2 | 6, faces: number[]): Series {
	let { n, run, best, last } = s;
	const cum = s.cum.slice();
	const end = Math.min(MAX_N, n + count);
	for (; n < end; n++) {
		last = draw(sides);
		const hit = faces.includes(last) ? 1 : 0;
		cum[n + 1] = cum[n] + hit;
		run = hit ? run + 1 : 0;
		best = Math.max(best, run);
	}
	return { cum, n, run, best, last };
}

/** The curve of a series, up to `upto` tosses, on an axis that ends at `range`. At most about 800 points. */
function curve(s: Series, upto: number, range: number) {
	const end = Math.min(s.n, upto);
	const step = Math.max(1, Math.floor(end / 800));
	const ps: V[] = [];
	for (let i = 1; i <= end; i += step) ps.push(v((W * i) / range, (H * s.cum[i]) / i));
	if (end > 0 && ps.length && (end - 1) % step) ps.push(v((W * end) / range, (H * s.cum[end]) / end));
	return ps;
}

/** 1000 → "1000", 10000 → "10 000", as the lesson writes them. */
const big = (n: number) => (n >= 10000 ? String(n).replace(/(\d)(?=(\d{3})+$)/g, '$1\u2009') : String(n));

export default function FrequenzaLanci({ alt }: { alt?: string }) {
	const [kind, setKind] = useState<'moneta' | 'dado'>('moneta');
	const [eventKey, setEventKey] = useState('pari');
	const event = kind === 'moneta' ? COIN : DIE.find((e) => e.key === eventKey)!;
	const sides = kind === 'moneta' ? 2 : 6;
	/** The series, and the tosses asked for and not yet drawn: a batch is played out over about a second. */
	const [state, setState] = useState(() => ({ series: empty(), left: 0, rate: 0 }));
	const { series } = state;
	const [old, setOld] = useState<Series[]>([]);
	const reduced = useReducedMotion();

	useFrameLoop(state.left > 0, (dt) =>
		setState((st) => {
			const k = Math.min(st.left, Math.max(1, Math.round(st.rate * dt)));
			return { ...st, series: toss(st.series, k, sides, event.faces), left: st.left - k };
		})
	);

	const throwMany = (count: number) =>
		setState((st) => {
			const k = Math.min(count, MAX_N - st.series.n - st.left);
			if (k <= 0) return st;
			if (reduced || k < 10) return { ...st, series: toss(st.series, k, sides, event.faces) };
			return { ...st, left: st.left + k, rate: Math.max(st.left ? st.rate : 0, k / 1.2) };
		});
	const restart = (keep: boolean) => {
		setOld((o) => (keep && series.n ? [series, ...o].slice(0, 3) : []));
		setState({ series: empty(), left: 0, rate: 0 });
	};

	const n = series.n;
	const hits = series.cum[n];
	const range = RANGES.find((r) => r >= n) ?? MAX_N;
	const fr = n ? hits / n : 0;
	const busy = state.left > 0;
	const lastText = series.last === null ? '' : sides === 2 ? (series.last ? 'testa' : 'croce') : String(series.last);

	let caption: ReactNode;
	if (n === 0)
		caption = kind === 'moneta' ? 'Lancia la moneta: dopo ogni lancio il grafico segna la frequenza relativa di testa, cioè la frazione di teste uscite fino a quel momento.' : <>Lancia il dado: dopo ogni lancio il grafico segna la frequenza relativa dell&apos;evento scelto.</>;
	else if (n < 100) caption = <>{sides === 2 ? `È uscita ${lastText}` : `È uscito il ${lastText}`}. Con pochi lanci la frequenza relativa salta molto: il prossimo lancio può spostarla fino a <Tex>{`\\tfrac{1}{${n + 1}}`}</Tex>.</>;
	else if (old.length === 0 && n >= 1000) caption = <>Dopo {big(n)} lanci la frequenza relativa oscilla poco intorno a <Tex>{event.p}</Tex>, la probabilità classica. Ricomincia: la serie nuova sarà diversa, ma si stringerà intorno alla stessa retta.</>;
	else caption = <>La frequenza relativa si avvicina alla retta tratteggiata, la probabilità classica <Tex>{`p = ${event.p}`}</Tex>, ma non a ogni passo: ci sono tratti in cui se ne allontana.</>;

	const yTicks: [number, string][] = [[event.value, event.value === 0.5 ? '0,5' : event.value === 1 / 3 ? '1/3' : '1/6'], [1, '1']];

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(0, event.value * H), v(W, event.value * H)])} stroke={LINE} strokeWidth={THIN} strokeDasharray={DASH} />
				{old.map((s, i) => (
					<polyline key={i} points={f.pts(...curve(s, range, range))} fill="none" stroke={OLD} strokeWidth={THIN} strokeLinejoin="round" />
				))}
				{n > 0 && <polyline points={f.pts(...curve(series, n, range))} fill="none" stroke={CURVE} strokeWidth={THICK} strokeLinejoin="round" />}

				<path d={f.path([v(0, 0), v(5.4, 0)])} stroke={AXIS} strokeWidth={THIN} />
				<polygon points={f.pts(v(5.45, 0), v(5.3, 0.06), v(5.3, -0.06))} fill={AXIS} />
				<path d={f.path([v(0, 0), v(0, 3.4)])} stroke={AXIS} strokeWidth={THIN} />
				<polygon points={f.pts(v(0, 3.45), v(0.06, 3.3), v(-0.06, 3.3))} fill={AXIS} />
				<Label f={f} at={v(5.45, 0)} dir={v(1, 0)} upright size={13}>lanci</Label>
				<Label f={f} at={v(0, 3.45)} dir={v(0, 1)}>
					f<tspan fontSize={10} dy="0.25em">r</tspan>
				</Label>
				{yTicks.map(([y, t]) => (
					<g key={t}>
						<path d={f.path([v(-0.08, y * H), v(0.08, y * H)])} stroke={AXIS} strokeWidth={THIN} />
						<Label f={f} at={v(-0.08, y * H)} dir={v(-1, 0)} upright size={13}>{t}</Label>
					</g>
				))}
				{[range / 2, range].map((x) => (
					<g key={x}>
						<path d={f.path([v((W * x) / range, -0.08), v((W * x) / range, 0.08)])} stroke={AXIS} strokeWidth={THIN} />
						<Label f={f} at={v((W * x) / range, -0.08)} dir={v(0, -1)} upright size={13}>{big(x)}</Label>
					</g>
				))}
				<Label f={f} at={v(0, 0)} dir={v(-0.7, -0.7)} upright size={13}>0</Label>
			</Drawing>

			<Readout>
				<span>lanci <Tex>{`N = ${n}`}</Tex></span>
				<span>{event.what} <Tex>{`f_a = ${hits}`}</Tex></span>
				{n > 0 && (
					<span>
						<Tex>{`f_r = \\tfrac{${hits}}{${n}} ${Number.isInteger(fr * 1000) ? '=' : '\\approx'} ${num(fr, 3).replace(',', '{,}')}`}</Tex>
					</span>
				)}
				{n > 0 && <span>{kind === 'moneta' ? 'teste di fila' : 'successi di fila'}, al massimo: {series.best}</span>}
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<ToggleGroup
					label="Esperimento"
					value={kind}
					onChange={(k) => { setKind(k); restart(false); }}
					options={[{ value: 'moneta', label: 'Moneta', icon: Coins }, { value: 'dado', label: 'Dado', icon: Dices }]}
				/>
				{kind === 'dado' && (
					<ToggleGroup
						label="Evento"
						value={eventKey}
						onChange={(k) => { setEventKey(k); restart(false); }}
						options={DIE.map((e) => ({ value: e.key, label: e.label }))}
					/>
				)}
				<ButtonRow>
					{[1, 10, 100, 1000].map((k) => (
						<Button key={k} variant="secondary" size="sm" disabled={n + state.left >= MAX_N} onClick={() => throwMany(k)}>
							{kind === 'moneta' ? <Coins className="size-4" aria-hidden="true" /> : <Dices className="size-4" aria-hidden="true" />}
							{k === 1 ? 'Lancia 1 volta' : `${k} lanci`}
						</Button>
					))}
					<Button variant="secondary" size="sm" disabled={n === 0 && !busy} onClick={() => restart(true)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
