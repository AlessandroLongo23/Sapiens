import type { ReactNode } from 'react';
import { Accent, Art, Axes, Dashed, Dot, Fill, Ink, Label } from './primitives';

// The hyperbola y = 12/x of the harmonic mean, on the grid X = 16 + 13x, Y = 70 - 9y, from x = 1,7 to x = 7,2.
const HYPERBOLA = 'M38.1,6.5 L41.3,14.6 L44.6,20.9 L47.9,25.9 L51.1,30 L54.4,33.4 L57.6,36.3 L60.9,38.7 L64.1,40.8 L67.3,42.7 L70.6,44.3 L73.8,45.7 L77.1,47 L80.4,48.2 L83.6,49.2 L86.9,50.2 L90.1,51.1 L93.4,51.8 L96.6,52.6 L99.9,53.3 L103.1,53.9 L106.4,54.5 L109.6,55';

// The data of the scatter plot, rising a little from left to right (y grows downwards in SVG) around their line.
const SCATTER: [number, number][] = [
	[24, 58],
	[36, 50],
	[46, 52],
	[58, 40],
	[70, 38],
	[80, 28],
	[94, 24],
	[104, 14]
];

// Tally marks of three modalities (5, 3 and 7), and the bar of each frequency: the longest is the mode.
const TALLY = [
	{ y: 18, n: 5, bar: 30 },
	{ y: 40, n: 3, bar: 18 },
	{ y: 62, n: 7, bar: 42 }
];
const tally = (y: number, n: number) => {
	let d = '';
	for (let i = 0; i < n; i++) {
		const x = 12 + (i % 5) * 5 + Math.floor(i / 5) * 30;
		if (i % 5 === 4) d += ` M${x - 22},${y + 5} L${x + 2},${y - 5}`;
		else d += ` M${x},${y - 5} V${y + 5}`;
	}
	return d.trim();
};

export const DATI_ART: Record<string, ReactNode> = {
	'media-geometrica': (
		<Art>
			{/* Euclid's construction: over a + b the half circle, and the height at the join is √(ab). */}
			<Ink d="M14,66 A46,46 0 0 1 106,66" />
			<Ink d="M14,66 H106" />
			<Dashed d="M14,66 L44,22.9 L106,66" />
			<Accent d="M44,66 V22.9" />
			<Dot x={44} y={66} />
			<Label x={29} y={75}>
				a
			</Label>
			<Label x={75} y={75}>
				b
			</Label>
		</Art>
	),
	'media-armonica': (
		<Art>
			{/* The hyperbola of the reciprocals: the mean of the heights of two points falls back on x at H. */}
			<Axes ox={16} oy={70} />
			<Ink d={HYPERBOLA} />
			<Dot x={42} y={16} />
			<Dot x={94} y={52} />
			<Dashed d="M16,34 H55" />
			<Accent d="M55,34 V70" />
		</Art>
	),
	'media-quadratica': (
		<Art>
			{/* Three squares of the values, and the square of the mean of their areas. */}
			<Fill d="M12,66 V56 H22 V66 Z" />
			<Fill d="M28,66 V48 H46 V66 Z" />
			<Fill d="M52,66 V40 H78 V66 Z" />
			<Ink d="M8,66 H112" />
			<Fill d="M88,66 V46.9 H107.1 V66 Z" className="fill-accent/25 stroke-accent" strokeWidth={2} />
		</Art>
	),
	'tabella-delle-frequenze': (
		<Art>
			{/* Tally marks for each modality, then the bar of its frequency; the longest is the mode. */}
			{TALLY.map((r) => (
				<Ink key={r.y} d={tally(r.y, r.n)} />
			))}
			<Ink d="M58,8 V72" />
			{TALLY.map((r) =>
				r.n === 7 ? <Fill key={r.y} d={`M64,${r.y - 5} H${64 + r.bar} V${r.y + 5} H64 Z`} className="fill-accent/25 stroke-accent" strokeWidth={2} /> : <Fill key={r.y} d={`M64,${r.y - 5} H${64 + r.bar} V${r.y + 5} H64 Z`} />
			)}
		</Art>
	),
	'quartili-box-plot': (
		<Art>
			{/* A box plot: whiskers to the extremes, the box between the quartiles, the median in the accent. */}
			<Ink d="M10,68 H110" />
			<Ink d="M14,40 H36 M76,40 H106 M14,32 V48 M106,32 V48" />
			<Fill d="M36,24 H76 V56 H36 Z" />
			<Accent d="M50,24 V56" />
		</Art>
	),
	'retta-di-regressione': (
		<Art>
			{/* A cloud of points in a frame, and the line that passes closest to all of them. */}
			<Ink d="M12,6 V70 H114" />
			<Accent d="M18,62.4 L110,13.6" />
			{SCATTER.map(([x, y]) => (
				<Dot key={x} x={x} y={y} />
			))}
		</Art>
	)
};
