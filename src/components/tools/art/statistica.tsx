import type { ReactNode } from 'react';
import { Accent, Art, Dashed, Fill, Ink, Label } from './primitives';

/** A data point drawn a little larger than a Dot, so that a stack of them reads as a column of values. */
const Datum = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={3.2} stroke="none" className="fill-current" />;

/** A lotto ball: a small circle, filled with the accent when it is one of the chosen. */
const Ball = ({ x, y, chosen }: { x: number; y: number; chosen?: boolean }) => (
	<circle cx={x} cy={y} r={7} className={chosen ? 'fill-accent/25 stroke-accent' : 'fill-accent/5'} strokeWidth={chosen ? 2 : 1.6} vectorEffect="non-scaling-stroke" />
);

// The data of the mean: stacked dots on a line, balanced on the mean (the values average to 59).
const DATA: [number, number][] = [
	[24, 1],
	[40, 2],
	[56, 1],
	[72, 3],
	[96, 1]
];

// The tree of the orderings of three objects: 3 choices, then 2, then 1.
const LEVEL1 = [16, 40, 64];
const LEVEL2 = [10, 22, 34, 46, 58, 70];

// The binomial distribution with n = 5, p = 0,4, scaled so that the tallest bar is 46 high.
const BARS = [0.078, 0.259, 0.346, 0.23, 0.077, 0.01].map((p) => Math.max(2, Math.round((p / 0.346) * 46)));

/** The drawings of the statistica tools, by slug. */
export const STATISTICA_ART: Record<string, ReactNode> = {
	'media-mediana-moda': (
		<Art>
			{/* The values as dots on a line, which balances on the mean. */}
			<Ink d="M12,52 H108" />
			{DATA.flatMap(([x, n]) => Array.from({ length: n }, (_, i) => <Datum key={`${x}-${i}`} x={x} y={46 - i * 8} />))}
			<Fill d="M59,52 L52,63 H66 Z" className="fill-accent/25 stroke-accent" strokeWidth={2} />
			<Label x={59} y={72} accent>
				x̄
			</Label>
		</Art>
	),
	'calcolo-varianza-deviazione-standard': (
		<Art>
			{/* The bell of the values around the mean, and the spread of one σ. */}
			<Fill d="M10,64 C34,64 44,14 60,14 C76,14 86,64 110,64 Z" />
			<Ink d="M8,64 H112" />
			<Dashed d="M60,14 V64" />
			<Dashed d="M40,38 V64 M80,38 V64" />
			<Accent d="M60,54 H80 M76,51 L80,54 L76,57" />
			<Label x={70} y={45} accent>
				σ
			</Label>
		</Art>
	),
	'calcolo-fattoriale': (
		<Art>
			{/* The tree of the orderings of three objects: 3 · 2 · 1 leaves, one path picked out. */}
			<Ink d={LEVEL1.map((y) => `M16,40 L46,${y}`).join(' ')} />
			<Ink d={LEVEL2.map((y, i) => `M46,${LEVEL1[Math.floor(i / 2)]} L76,${y} L104,${y}`).join(' ')} />
			<Accent d="M16,40 L46,16 L76,10 L104,10" />
			{[[16, 40], ...LEVEL1.map((y) => [46, y]), ...LEVEL2.flatMap((y) => [[76, y], [104, y]])].map(([x, y]) => (
				<circle key={`${x}-${y}`} cx={x} cy={y} r={2.2} stroke="none" className={y === 10 && x > 16 ? 'fill-accent' : 'fill-current'} />
			))}
		</Art>
	),
	'calcolo-combinatorio': (
		<Art>
			{/* A draw of lotto balls: three chosen out of the fifteen, the order does not count. */}
			{[18, 40, 62].flatMap((y, r) => [24, 42, 60, 78, 96].map((x, c) => <Ball key={`${x}-${y}`} x={x} y={y} chosen={(r === 0 && c === 1) || (r === 1 && c === 3) || (r === 2 && c === 2)} />))}
		</Art>
	),
	'distribuzione-binomiale': (
		<Art>
			{/* The bars of P(X = k) for k = 0…5, with the one asked for in the accent. */}
			{BARS.map((h, k) => {
				const x = 17 + k * 15;
				const d = `M${x},64 V${64 - h} H${x + 11} V64`;
				return k === 2 ? <Fill key={k} d={d} className="fill-accent/30 stroke-accent" strokeWidth={2} /> : <Fill key={k} d={d} />;
			})}
			<Ink d="M10,64 H110" />
			<Label x={52.5} y={73} accent>
				k
			</Label>
		</Art>
	)
};
