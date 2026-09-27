import type { ReactNode } from 'react';
import { Accent, Art, Dashed, Dot, Fill, Ink, Label } from './primitives';

/** A thin grid line, paler than the ink: the cells of a square, the parts of a whole. */
const Thin = ({ d }: { d: string }) => <path d={d} className="stroke-fg-muted" strokeWidth={1} vectorEffect="non-scaling-stroke" />;

/** The lines of an n × m grid of cells of side k, from (x, y). */
function gridLines(x: number, y: number, cols: number, rows: number, k: number) {
	let d = '';
	for (let i = 1; i < cols; i++) d += `M${x + i * k},${y} V${y + rows * k} `;
	for (let j = 1; j < rows; j++) d += `M${x},${y + j * k} H${x + cols * k} `;
	return d.trim();
}

/** The sieve of Eratosthenes on 1…24, six to a row: the primes stay, the others are struck out. */
const PRIMES = new Set([2, 3, 5, 7, 11, 13, 17, 19, 23]);
function Sieve() {
	const k = 14;
	const x0 = 18;
	const y0 = 12;
	const cells: ReactNode[] = [];
	for (let n = 1; n <= 24; n++) {
		const x = x0 + ((n - 1) % 6) * k;
		const y = y0 + Math.floor((n - 1) / 6) * k;
		if (n === 23) cells.push(<Accent key={n} d={`M${x + 1.5},${y + 1.5} h${k - 3} v${k - 3} h${-(k - 3)} Z`} className="fill-accent/25" />);
		else if (PRIMES.has(n)) cells.push(<Fill key={n} d={`M${x},${y} h${k} v${k} h${-k} Z`} className="stroke-none" />);
		else if (n > 1) cells.push(<Thin key={n} d={`M${x + 3},${y + k - 3} L${x + k - 3},${y + 3}`} />);
	}
	return (
		<>
			{cells}
			<Ink d={`M${x0},${y0} h${6 * k} v${4 * k} h${-6 * k} Z`} />
			<Thin d={gridLines(x0, y0, 6, 4, k)} />
		</>
	);
}

/** The drawings of the numeri tools, by slug. */
export const NUMERI_ART: Record<string, ReactNode> = {
	'calcolo-percentuale': (
		<Art>
			{/* The hundred square, with a part of it coloured. */}
			<Fill d="M25,5 H39 V75 H25 Z" className="fill-accent/30" />
			<Thin d={gridLines(25, 5, 10, 10, 7)} />
			<Ink d="M25,5 H95 V75 H25 Z" />
			<Accent d="M25,5 H39 V75 H25 Z" />
		</Art>
	),
	'calcolo-mcm': (
		<Art>
			{/* Two rows of multiples that meet at the first common one. */}
			<Ink d="M14,26 H110 M14,54 H110" className="stroke-fg-muted" />
			<Dashed d="M104,26 V54" />
			<Dot x={14} y={26} />
			<Dot x={44} y={26} />
			<Dot x={74} y={26} />
			<Dot x={14} y={54} />
			<Dot x={59} y={54} />
			<Accent d="M104,26 m-4.5,0 a4.5,4.5 0 1 0 9,0 a4.5,4.5 0 1 0 -9,0 M104,54 m-4.5,0 a4.5,4.5 0 1 0 9,0 a4.5,4.5 0 1 0 -9,0" className="fill-accent/25" />
			<Label x={14} y={15}>
				a
			</Label>
			<Label x={14} y={67}>
				b
			</Label>
		</Art>
	),
	'calcolo-mcd': (
		<Art>
			{/* A rectangle a × b tiled by the largest square that fits both sides. */}
			<Fill d="M24,16 H96 V64 H24 Z" />
			<Thin d="M48,16 V64 M72,16 V64 M24,40 H96" />
			<Accent d="M24,16 H48 V40 H24 Z" className="fill-accent/25" />
			<Label x={60} y={73}>
				a
			</Label>
			<Label x={105} y={40}>
				b
			</Label>
		</Art>
	),
	'scomposizione-in-fattori-primi': (
		<Art>
			{/* The factor tree: each number splits in two until only primes are left. */}
			<Ink d="M57,16 L43,34 M63,16 L77,34 M77,42 L67,56 M83,42 L93,56" className="stroke-fg-muted" />
			<circle cx={60} cy={12} r={5} vectorEffect="non-scaling-stroke" />
			<circle cx={80} cy={38} r={5} vectorEffect="non-scaling-stroke" />
			<Accent d="M35,38 a5,5 0 1 0 10,0 a5,5 0 1 0 -10,0 M59,60 a5,5 0 1 0 10,0 a5,5 0 1 0 -10,0 M91,60 a5,5 0 1 0 10,0 a5,5 0 1 0 -10,0" className="fill-accent/25" />
			<Label x={40} y={52} accent>
				p
			</Label>
			<Label x={64} y={74} accent>
				q
			</Label>
			<Label x={96} y={74} accent>
				r
			</Label>
		</Art>
	),
	'calcolatrice-frazioni': (
		<Art>
			{/* A pie cut in six equal slices, five of them taken. */}
			<Fill d="M60,40 L60,10 A30,30 0 1 1 34.02,25 Z" className="fill-accent/25" />
			<circle cx={60} cy={40} r={30} vectorEffect="non-scaling-stroke" />
			<Thin d="M60,40 L60,10 M60,40 L85.98,25 M60,40 L85.98,55 M60,40 L60,70 M60,40 L34.02,55 M60,40 L34.02,25" />
			<Accent d="M60,10 A30,30 0 1 1 34.02,25" />
		</Art>
	),
	'calcolo-espressioni': (
		<Art>
			{/* Braces, brackets and parentheses nested: the innermost pair goes first. */}
			<Ink d="M20,10 Q13,10 13,17 V33 Q13,40 7,40 Q13,40 13,47 V63 Q13,70 20,70 M100,10 Q107,10 107,17 V33 Q107,40 113,40 Q107,40 107,47 V63 Q107,70 100,70" />
			<Ink d="M32,16 H25 V64 H32 M88,16 H95 V64 H88" />
			<Fill d="M45,22 Q35,40 45,58 H75 Q85,40 75,22 Z" className="stroke-none" />
			<Accent d="M45,22 Q35,40 45,58 M75,22 Q85,40 75,58" />
			<Label x={52} y={40}>
				a
			</Label>
			<Dot x={60} y={41} />
			<Label x={68} y={40}>
				b
			</Label>
		</Art>
	),
	'calcolo-potenze': (
		<Art>
			{/* A side, the square on it, the cube on it: the same base multiplied again and again. */}
			<Ink d="M6,66 H30" />
			<Thin d="M14,63 V69 M22,63 V69" />
			<Fill d="M38,42 H62 V66 H38 Z" />
			<Thin d={gridLines(38, 42, 3, 3, 8)} />
			<Ink d="M38,42 H62 V66 H38 Z" />
			<Fill d="M72,40 L86,26 H112 V52 L98,66 H72 Z" className="fill-accent/25 stroke-none" />
			<Thin d="M80.7,40 V66 M89.3,40 V66 M72,48.7 H98 M72,57.3 H98 M80.7,40 L94.7,26 M89.3,40 L103.3,26 M76.7,35.3 H102.7 M81.3,30.7 H107.3 M98,48.7 L112,34.7 M98,57.3 L112,43.3 M102.7,35.3 V61.3 M107.3,30.7 V56.7" />
			<Accent d="M72,40 L86,26 H112 V52 L98,66 H72 Z M72,40 H98 V66 M98,40 L112,26" />
			<Label x={18} y={54}>
				a
			</Label>
		</Art>
	),
	'calcolo-radice-quadrata': (
		<Art>
			{/* A square of known area under the root sign: the root is its side. */}
			<Ink d="M8,46 L16,41 L27,70 L41,8 H112" />
			<Fill d="M56,18 H96 V58 H56 Z" />
			<Thin d={gridLines(56, 18, 4, 4, 10)} />
			<Ink d="M56,18 H96 V58 H56 Z" />
			<Accent d="M56,58 H96" />
			<Label x={76} y={69} accent>
				l
			</Label>
		</Art>
	),
	'calcolo-proporzioni': (
		<Art>
			{/* Two similar triangles: the sides of one are in proportion to the other's. */}
			<Fill d="M12,66 H100 V12 Z" />
			<Fill d="M12,66 H56 V39 Z" className="fill-accent/15" />
			<Ink d="M56,66 V39" />
			<Accent d="M100,66 V12" />
			<Label x={108} y={40} accent>
				x
			</Label>
		</Art>
	),
	'numeri-primi': (
		<Art>
			<Sieve />
		</Art>
	),
	'notazione-scientifica': (
		<Art>
			{/* The decimal point hopping along the digits: the number of hops is the exponent. */}
			<Ink d="M12,44 H108 V62 H12 Z" />
			<Thin d="M28,44 V62 M44,44 V62 M60,44 V62 M76,44 V62 M92,44 V62" />
			<Dashed d="M28,40 Q36,22 44,40 M44,40 Q52,22 60,40 M60,40 Q68,22 76,40" />
			<Accent d="M76,40 Q84,22 92,40 M88,37 L92,40 L93,35" />
			<Dot x={28} y={66} />
			<Dot x={92} y={66} accent />
			<Label x={60} y={16}>
				n
			</Label>
		</Art>
	),
	arrotondamento: (
		<Art>
			{/* A number on the line between two round values, taken to the nearer. */}
			<Ink d="M8,54 H112" />
			<Ink d="M20,44 V64 M100,44 V64" />
			<Thin d="M28,49 V59 M36,49 V59 M44,49 V59 M52,49 V59 M68,49 V59 M76,49 V59 M84,49 V59 M92,49 V59" />
			<Dashed d="M60,40 V68" />
			<Dot x={40} y={54} />
			<Accent d="M40,44 Q31,18 21,38 M18,34 L21,38 L25,34" />
			<Label x={40} y={71}>
				x
			</Label>
		</Art>
	),
	'frazione-generatrice': (
		<Art>
			{/* The digits after the point, the period repeating without end, and the fraction they come from. */}
			<Ink d="M8,12 H22 V30 H8 Z M28,12 H70 V30 H28 Z M42,12 V30 M56,12 V30" />
			<Dot x={25} y={29} />
			<Fill d="M42,12 H70 V30 H42 Z" className="stroke-none" />
			<Dashed d="M70,12 H98 V30 H70 M84,12 V30" />
			<Label x={106} y={22} plain>
				…
			</Label>
			<Accent d="M44,6 H54" />
			<Ink d="M60,36 V46 M56,42 L60,46 L64,42" className="stroke-fg-muted" />
			<Label x={60} y={54}>
				m
			</Label>
			<Ink d="M52,61 H68" />
			<Label x={60} y={69}>
				n
			</Label>
		</Art>
	),
	'numeri-romani': (
		<Art>
			{/* A stone tablet with a numeral: the smaller symbol before the larger is subtracted. */}
			<Fill d="M22,70 V26 Q22,10 60,10 Q98,10 98,26 V70 Z" />
			<text x={60} y={44} textAnchor="middle" dominantBaseline="middle" fontSize={26} stroke="none" className="fill-fg" style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '1px' }}>
				X<tspan className="fill-accent">IV</tspan>
			</text>
		</Art>
	)
};
