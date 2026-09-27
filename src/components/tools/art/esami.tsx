import type { ReactNode } from 'react';
import { Accent, Art, Dot, Fill, Ink, Label } from './primitives';

/** The calendar of the absences drawing: 8 columns, 4 rows of 10-unit days, from (13, 17). Days missed so far. */
const MISSED = [2, 9, 13, 20, 22];
const day = (i: number) => {
	const x = 13 + 12 * (i % 8);
	const y = 17 + 12 * Math.floor(i / 8);
	return `M${x},${y} h10 v10 h-10 Z`;
};

/**
 * A laurel leaf for the degree drawing: a lens 9 long, set on the wreath at angle `deg` (degrees, measured on a circle
 * of radius 24 around (60, 40)), pointing up the branch and leaning outward. `side` is 1 on the left, -1 on the right.
 */
function leaf(deg: number, side: 1 | -1) {
	const a = (deg * Math.PI) / 180;
	const x = 60 + 24 * Math.cos(a);
	const y = 40 + 24 * Math.sin(a);
	// Along the branch towards the top of the wreath, turned 30 degrees outward.
	const t = a + side * (Math.PI / 2 - 0.5);
	const ex = x + 9 * Math.cos(t);
	const ey = y + 9 * Math.sin(t);
	const nx = -Math.sin(t) * 2.4;
	const ny = Math.cos(t) * 2.4;
	const mx = (x + ex) / 2;
	const my = (y + ey) / 2;
	const f = (n: number) => n.toFixed(2);
	return `M${f(x)},${f(y)} Q${f(mx + nx)},${f(my + ny)} ${f(ex)},${f(ey)} Q${f(mx - nx)},${f(my - ny)} ${f(x)},${f(y)} Z`;
}
const arc = (from: number, to: number) => {
	const p = (d: number) => `${(60 + 24 * Math.cos((d * Math.PI) / 180)).toFixed(2)},${(40 + 24 * Math.sin((d * Math.PI) / 180)).toFixed(2)}`;
	return `M${p(from)} A24,24 0 0 ${to > from ? 1 : 0} ${p(to)}`;
};

/** The blocks on the beam of the weighted mean: position and side (the credits). The pivot is their weighted mean. */
const BLOCKS = [
	{ x: 28, s: 8 },
	{ x: 60, s: 14 },
	{ x: 94, s: 10 }
];
const PIVOT = BLOCKS.reduce((a, b) => a + b.x * b.s, 0) / BLOCKS.reduce((a, b) => a + b.s, 0);

export const ESAMI_ART: Record<string, ReactNode> = {
	'calcolo-assenze-scuola': (
		<Art>
			{/* A school calendar: the days missed pale, the last quarter of the year, the most you can miss, in red. */}
			<Ink d="M30,11 V19 M90,11 V19" />
			{Array.from({ length: 32 }, (_, i) => (MISSED.includes(i) ? <Fill key={i} d={day(i)} /> : <Ink key={i} d={day(i)} className="stroke-fg-muted" strokeWidth={1} />))}
			<Accent d="M11,51 H109 V65 H11 Z" />
		</Art>
	),
	'calcolo-voto-esame-terza-media': (
		<Art>
			{/* The exam sheet: four marks, one per test, and the final mark circled in red. */}
			<Fill d="M32,6 H88 V74 H32 Z" />
			<Ink d="M40,17 H64 M40,29 H68 M40,41 H62 M40,53 H66" className="stroke-fg-muted" strokeWidth={1} />
			<Dot x={78} y={17} />
			<Dot x={78} y={29} />
			<Dot x={78} y={41} />
			<Dot x={78} y={53} />
			<Label x={75} y={64.5} plain size={10}>
				8
			</Label>
			<Accent d="M66,64 a9,7 0 1,0 18,0 a9,7 0 1,0 -18,0" />
		</Art>
	),
	'calcolo-voto-laurea': (
		<Art>
			{/* A laurel wreath, open at the top, with the mark out of 110 inside. */}
			<Ink d={arc(95, 225)} />
			<Ink d={arc(85, -45)} />
			{[110, 140, 170, 200].map((d) => (
				<Fill key={`l${d}`} d={leaf(d, 1)} />
			))}
			{[70, 40, 10, -20].map((d) => (
				<Fill key={`r${d}`} d={leaf(d, -1)} />
			))}
			<Label x={60} y={41} plain accent size={13}>
				110
			</Label>
		</Art>
	),
	'calcolo-media-ponderata-universitaria': (
		<Art>
			{/* Exams as blocks on a beam: the bigger the block, the more credits. The beam balances on the weighted mean. */}
			{BLOCKS.map((b) => (
				<Fill key={b.x} d={`M${b.x - b.s / 2},48 V${48 - b.s} H${b.x + b.s / 2} V48 Z`} />
			))}
			<Ink d="M12,48 H108" />
			<Accent d={`M${PIVOT.toFixed(2)},49 L${(PIVOT + 8).toFixed(2)},62 H${(PIVOT - 8).toFixed(2)} Z`} />
			<Ink d="M36,62 H84" className="stroke-fg-muted" strokeWidth={1} />
		</Art>
	)
};
