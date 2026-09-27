import type { ReactNode } from 'react';
import { Accent, Art, Dot, Fill, Ink, Label } from './primitives';

/** A thin grey line of a table or a scale, lighter than the ink of the figure. */
const Rule = ({ d }: { d: string }) => <path d={d} className="stroke-fg-muted" strokeWidth={1} vectorEffect="non-scaling-stroke" />;

/** The ticks around the two's complement wheel: sixteen short radial marks outside a circle of radius 26. */
const WHEEL_TICKS = Array.from({ length: 16 }, (_, i) => {
	const a = (i * Math.PI) / 8;
	const s = Math.sin(a);
	const c = Math.cos(a);
	return `M${(60 + 26 * s).toFixed(2)},${(40 - 26 * c).toFixed(2)} L${(60 + 30 * s).toFixed(2)},${(40 - 30 * c).toFixed(2)}`;
}).join(' ');

/** The truth table of p ∧ q: the values of p and q, then the result column. */
const TRUTH_ROWS = [
	['V', 'V', 'V'],
	['V', 'F', 'F'],
	['F', 'V', 'F'],
	['F', 'F', 'F']
];

/** The drawings of the informatica tools, by slug. */
export const INFORMATICA_ART: Record<string, ReactNode> = {
	'convertitore-binario': (
		<Art>
			{/* Four bits under their weights: the lit ones add up to the number. */}
			<Fill d="M24,30 H42 V52 H24 Z M60,30 H78 V52 H60 Z M78,30 H96 V52 H78 Z" />
			<Ink d="M24,30 H96 V52 H24 Z M42,30 V52 M60,30 V52 M78,30 V52" />
			{['8', '4', '2', '1'].map((w, i) => (
				<Label key={w} x={33 + 18 * i} y={21} plain size={10}>
					{w}
				</Label>
			))}
			{['1', '0', '1', '1'].map((b, i) => (
				<Label key={i} x={33 + 18 * i} y={41.5} plain accent={b === '1'}>
					{b}
				</Label>
			))}
			<Label x={60} y={66} plain size={10}>
				base 2
			</Label>
		</Art>
	),
	'tabelle-di-verita': (
		<Art>
			<Fill d="M16,6 H106 V20 H16 Z" />
			<Ink d="M16,6 H106 V74 H16 Z M16,20 H106" />
			<Rule d="M42,6 V74 M68,6 V74 M16,33.5 H106 M16,47 H106 M16,60.5 H106" />
			<Label x={29} y={13}>
				p
			</Label>
			<Label x={55} y={13}>
				q
			</Label>
			<Label x={87} y={13}>
				p ∧ q
			</Label>
			{TRUTH_ROWS.map((row, r) =>
				row.map((v, c) => (
					<Label key={`${r}${c}`} x={[29, 55, 87][c]} y={27.25 + 13.5 * r} plain accent={c === 2} size={11}>
						{v}
					</Label>
				))
			)}
		</Art>
	),
	'complemento-a-due': (
		<Art>
			{/* The wheel of the integers on a fixed number of bits: past the largest positive, the negatives. */}
			<circle cx={60} cy={40} r={26} className="fill-accent/10" vectorEffect="non-scaling-stroke" />
			<path d={WHEEL_TICKS} className="stroke-fg-muted" strokeWidth={1} vectorEffect="non-scaling-stroke" />
			<Accent d="M60,66 A26,26 0 0 1 60,14" />
			<Dot x={60} y={14} />
			<Label x={60} y={24} plain>
				0
			</Label>
			<Label x={74} y={41} plain>
				+
			</Label>
			<Label x={46} y={41} plain accent>
				−
			</Label>
		</Art>
	),
	'convertitore-ascii': (
		<Art>
			{/* A key of the keyboard and the code of its character. */}
			<Fill d="M18,20 Q18,16 22,16 H50 Q54,16 54,20 V58 Q54,62 50,62 H22 Q18,62 18,58 Z" />
			<Ink d="M23,20 Q23,19 24,19 H48 Q49,19 49,20 V51 Q49,53 47,53 H25 Q23,53 23,51 Z" />
			<Label x={36} y={36} plain size={14}>
				B
			</Label>
			<Ink d="M62,39 H80 M76,35 L80,39 L76,43" />
			<Label x={97} y={39.5} plain accent size={14}>
				66
			</Label>
		</Art>
	)
};
