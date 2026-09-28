'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Caption, clamp, Controls, DASH, Drawing, Figure, FONT_MATH, frame, Readout, Tex, texNum, v } from './kit';
import { EndDot, Grip, HLine, Line, n, PT, Text, Tick, xc } from './retta';

/**
 * Lesson 53, "Il grafico del sistema": two inequalities x ? a, one per row, and the strip where both rows have their
 * line. The student drags the two endpoints, taps a dot to make it full or empty, and picks the sign of each row;
 * the common part becomes an interval, a single point or nothing. Drawn like `sistema-disequazioni-intervallo-limitato`
 * (rows over the axis, dashed verticals, orange strip), but to scale, since the endpoints move.
 */

type Op = '<' | '≤' | '>' | '≥';
const OPS: { op: Op; tex: string; name: string }[] = [
	{ op: '<', tex: '<', name: 'minore' },
	{ op: '≤', tex: '\\le', name: 'minore o uguale' },
	{ op: '>', tex: '>', name: 'maggiore' },
	{ op: '≥', tex: '\\ge', name: 'maggiore o uguale' }
];
const right = (op: Op) => op === '>' || op === '≥';
const incl = (op: Op) => op === '≤' || op === '≥';
const withIncl = (op: Op, full: boolean): Op => (right(op) ? (full ? '≥' : '>') : full ? '≤' : '<');
const texOp = (op: Op) => OPS.find((o) => o.op === op)!.tex;

const LO = -2, HI = 8;
const U = 0.45;
const X = (t: number) => 0.5 + (t - LO) * U;
const END = X(HI) + 0.55; // where the lines towards +∞ stop
const AXIS_END = END + 0.3;
const ROWS = [1.3, 0.65];
const TOP = 1.6;
const f = frame(-1.75, AXIS_END + 0.4, -0.6, TOP + 0.1);
const LINE = xc('blue', 50);
const GAP = 2.6 / 28.4528; // shorten=2.6pt, in cm
const R = 2.2; // dot radius in pt

type Row = { a: number; op: Op };
type Bound = { x: number; closed: boolean };

/** The two rows' common part: its two ends (±∞ as infinities), or null when it is empty. */
function common(rows: Row[]) {
	let lo: Bound = { x: -Infinity, closed: false };
	let hi: Bound = { x: Infinity, closed: false };
	for (const { a, op } of rows) {
		const b = { x: a, closed: incl(op) };
		if (right(op)) lo = a > lo.x ? b : a === lo.x ? { x: a, closed: lo.closed && b.closed } : lo;
		else hi = a < hi.x ? b : a === hi.x ? { x: a, closed: hi.closed && b.closed } : hi;
	}
	if (lo.x > hi.x || (lo.x === hi.x && !(lo.closed && hi.closed))) return null;
	return { lo, hi };
}

function texSet(s: ReturnType<typeof common>) {
	if (!s) return 'S = \\emptyset';
	const { lo, hi } = s;
	if (lo.x === hi.x) return `S = \\{${texNum(lo.x)}\\}`;
	const l = lo.x === -Infinity ? '\\mathopen{]}-\\infty' : `${lo.closed ? '[' : '\\mathopen{]}'}${texNum(lo.x)}`;
	const h = hi.x === Infinity ? '+\\infty\\mathclose{[}' : `${texNum(hi.x)}${hi.closed ? ']' : '\\mathclose{[}'}`;
	return `S = \\, ${l}, ${h}`;
}

export default function SistemaDisequazioni({ alt }: { alt?: string }) {
	const [rows, setRows] = useState<Row[]>([
		{ a: 2, op: '>' },
		{ a: 5, op: '<' }
	]);
	const set = (i: number, r: Partial<Row>) => setRows((rs) => rs.map((x, j) => (j === i ? { ...x, ...r } : x)));
	const s = common(rows);

	let what: string;
	if (!s) what = 'Non c’è nessuna striscia con le linee di tutte e due le righe: il sistema è impossibile.';
	else if (s.lo.x === s.hi.x) what = `Le due linee si toccano solo in ${n(s.lo.x)}, dove il pallino è pieno in tutte e due le righe: la soluzione è quel numero soltanto.`;
	else {
		const where = s.lo.x === -Infinity ? `a sinistra di ${n(s.hi.x)}` : s.hi.x === Infinity ? `a destra di ${n(s.lo.x)}` : `tra ${n(s.lo.x)} e ${n(s.hi.x)}`;
		what = `Le linee di tutte e due le righe ci sono ${where}: la soluzione è un intervallo.`;
	}

	const ends = [...new Set(rows.map((r) => r.a))];
	const strip = s && s.lo.x !== s.hi.x && { x0: s.lo.x === -Infinity ? 0 : X(s.lo.x), x1: s.hi.x === Infinity ? END : X(s.hi.x) };

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{strip && <rect x={f.px(v(strip.x0, TOP)).x} y={f.px(v(0, TOP)).y} width={(strip.x1 - strip.x0) * (f.W / (f.x1 - f.x0))} height={(TOP + 0.1) * (f.H / (f.y1 - f.y0))} fill={xc('orange', 20)} />}
				{s && s.lo.x === s.hi.x && <Line f={f} from={v(X(s.lo.x), -0.1)} to={v(X(s.lo.x), TOP)} color={xc('orange', 45)} width={3 * PT} />}
				{ends.map((a) => (
					<g key={a}>
						<Line f={f} from={v(X(a), -0.1)} to={v(X(a), TOP)} color={xc('gray', 70)} dash={DASH} />
						<Tick f={f} x={X(a)} />
						<Text f={f} at={v(X(a), -0.16)} baseline="top">
							{n(a)}
						</Text>
					</g>
				))}
				<HLine f={f} x0={0} x1={AXIS_END} arrow />
				<Text f={f} at={v(AXIS_END + 0.08, 0)} anchor="start" italic>
					x
				</Text>
				{rows.map(({ a, op }, i) => {
					const y = ROWS[i];
					const full = incl(op);
					const x0 = right(op) ? X(a) + (full ? 0 : GAP) : 0;
					const x1 = right(op) ? END : X(a) - (full ? 0 : GAP);
					return (
						<g key={i}>
							<Text f={f} at={v(-0.12, y)} anchor="end" size={13.5}>
								<tspan fontFamily={FONT_MATH} fontStyle="italic">
									x
								</tspan>
								{` ${op} ${n(a)}`}
							</Text>
							<Line f={f} from={v(x0, y)} to={v(x1, y)} color={LINE} width={1.8 * PT} />
							<Grip
								f={f}
								at={v(X(a), y)}
								onMove={(p) => set(i, { a: clamp(Math.round((p.x - 0.5) / U) + LO, LO, HI) })}
								onTap={() => set(i, { op: withIncl(op, !full) })}
								label={`Estremo della ${i ? 'seconda' : 'prima'} disequazione, ${n(a)}, pallino ${full ? 'pieno' : 'vuoto'}`}
								hint="trascinalo o usa le frecce; Invio lo rende pieno o vuoto"
								step={U}
							>
								<EndDot f={f} at={v(X(a), y)} filled={full} r={R} />
							</Grip>
						</g>
					);
				})}
			</Drawing>
			<Readout>
				<Tex>{`\\begin{cases} x ${texOp(rows[0].op)} ${texNum(rows[0].a)} \\\\ x ${texOp(rows[1].op)} ${texNum(rows[1].a)} \\end{cases}`}</Tex>
				<span className="self-center">
					<Tex>{texSet(s)}</Tex>
				</span>
			</Readout>
			<Caption>Trascina i pallini per spostare gli estremi e toccali per renderli pieni o vuoti; il verso si sceglie qui sotto. {what}</Caption>
			<Controls>
				{rows.map((r, i) => (
					<div key={i} className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label={`Verso della ${i ? 'seconda' : 'prima'} disequazione`}>
						<span className="w-full text-center text-sm font-medium text-fg-muted sm:w-auto">{i ? 'Seconda riga' : 'Prima riga'}</span>
						{OPS.map((o) => (
							<Button key={o.op} variant={r.op === o.op ? 'primary' : 'secondary'} size="sm" aria-pressed={r.op === o.op} aria-label={`x ${o.name} di ${n(r.a)}`} onClick={() => set(i, { op: o.op })} className="min-w-12">
								<Tex>{`x ${o.tex} ${texNum(r.a)}`}</Tex>
							</Button>
						))}
					</div>
				))}
			</Controls>
		</Figure>
	);
}
