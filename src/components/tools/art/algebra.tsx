import type { ReactNode } from 'react';
import { Accent, Art, Axes, Dashed, Dot, Fill, Ink, Label } from './primitives';

/** A short muted stroke that stands for one term of a polynomial in the written-out division. */
const Term = ({ x, y, w = 10, muted }: { x: number; y: number; w?: number; muted?: boolean }) => (
	<path d={`M${x},${y} h${w}`} className={muted ? 'stroke-fg-muted' : undefined} strokeWidth={2.4} vectorEffect="non-scaling-stroke" />
);

/** A small open circle, for an end point that is not included (a strict inequality). */
const Open = ({ x, y }: { x: number; y: number }) => <circle cx={x} cy={y} r={3} className="fill-surface stroke-accent" strokeWidth={2} vectorEffect="non-scaling-stroke" />;

/** The drawings of the algebra tools, by slug. */
export const ALGEBRA_ART: Record<string, ReactNode> = {
	'equazioni-primo-grado': (
		<Art>
			{/* A balance in equilibrium: the unknown block and a unit on one pan, four units on the other. */}
			<Ink d="M8,46 H112" />
			<Fill d="M60,46 L48,66 H72 Z" />
			<Ink d="M38,66 H82" />
			<Fill d="M12,18 H40 V46 H12 Z" className="stroke-accent" strokeWidth={2} />
			<Label x={26} y={32} accent>
				x
			</Label>
			<Ink d="M44,34 H56 V46 H44 Z" />
			<Ink d="M66,34 H78 V46 H66 Z M80,34 H92 V46 H80 Z M94,34 H106 V46 H94 Z M73,22 H85 V34 H73 Z" />
		</Art>
	),
	'equazioni-secondo-grado': (
		<Art>
			<Axes ox={20} oy={52} />
			<Ink d="M36,8 Q66,96 96,8" />
			<Dot x={44} y={52} accent />
			<Dot x={88} y={52} accent />
			<Label x={42} y={62} accent>
				x<tspan fontSize={10} dy={3}>1</tspan>
			</Label>
			<Label x={92} y={62} accent>
				x<tspan fontSize={10} dy={3}>2</tspan>
			</Label>
		</Art>
	),
	'sistemi-lineari-2x2': (
		<Art>
			<Axes ox={16} oy={66} />
			<Ink d="M24,72 L108,12" />
			<Ink d="M26,14 L108,64" />
			<Dashed d="M72,38 V66 M72,38 H16" />
			<Dot x={72} y={38} accent />
			<Label x={72} y={27} accent>
				P
			</Label>
		</Art>
	),
	'sistemi-lineari-3x3': (
		<Art>
			{/* A 3 × 3 determinant with the first two columns copied beside it, as in Sarrus's rule. */}
			<Ink d="M14,10 V70 M74,10 V70" />
			{[24, 44, 64].map((x) => [20, 40, 60].map((y) => <Dot key={`${x}-${y}`} x={x} y={y} />))}
			{[88, 108].map((x) => [20, 40, 60].map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r={2.4} stroke="none" className="fill-fg-muted/60" />))}
			<Accent d="M24,20 L64,60" />
			<Dashed d="M44,20 L88,60 M64,20 L108,60" />
		</Art>
	),
	'disequazioni-primo-grado': (
		<Art>
			{/* The solutions on the number line: the half-line after the point, the point itself left out. */}
			<Fill d="M44,32 H110 V50 H44 Z" stroke="none" />
			<Dashed d="M44,32 V50" />
			<Ink d="M8,50 H112 M108,47 L112,50 L108,53" />
			<Accent d="M44,50 H106" />
			<Open x={44} y={50} />
			<Label x={44} y={62}>
				a
			</Label>
			<Label x={104} y={62}>
				x
			</Label>
		</Art>
	),
	'disequazioni-secondo-grado': (
		<Art>
			{/* The sign of the parabola: negative between the roots, where the solutions of < 0 lie. */}
			<Fill d="M40,40 Q60,80 80,40 Z" stroke="none" />
			<Ink d="M8,40 H112 M108,37 L112,40 L108,43" />
			<Ink d="M24,4 Q60,112 96,4" />
			<Accent d="M40,40 H80" />
			<Open x={40} y={40} />
			<Open x={80} y={40} />
			<Label x={18} y={30} plain size={14}>
				+
			</Label>
			<Label x={102} y={30} plain size={14}>
				+
			</Label>
			<Label x={60} y={30} plain size={14}>
				−
			</Label>
		</Art>
	),
	'prodotti-notevoli': (
		<Art>
			{/* The square of a + b cut into a², two rectangles ab and b². */}
			<Fill d="M32,16 H68 V52 H32 Z" />
			<Ink d="M68,16 H92 V52 H68 Z M32,52 H68 V76 H32 Z" className="fill-accent/25" />
			<Fill d="M68,52 H92 V76 H68 Z" />
			<Accent d="M68,16 V76 M32,52 H92" />
			<Label x={50} y={8}>
				a
			</Label>
			<Label x={80} y={8}>
				b
			</Label>
			<Label x={24} y={34}>
				a
			</Label>
			<Label x={24} y={64}>
				b
			</Label>
		</Art>
	),
	'divisione-polinomi': (
		<Art>
			{/* The division in column: dividend, divisor, the steps under the dividend and the quotient under the divisor. */}
			<Term x={12} y={14} />
			<Term x={28} y={14} />
			<Term x={44} y={14} />
			<Term x={60} y={14} />
			<Term x={12} y={26} muted />
			<Term x={28} y={26} muted />
			<Ink d="M10,32 H56" className="stroke-fg-muted" strokeWidth={1} />
			<Term x={28} y={42} />
			<Term x={44} y={42} />
			<Term x={28} y={54} muted />
			<Term x={44} y={54} muted />
			<Ink d="M26,60 H72" className="stroke-fg-muted" strokeWidth={1} />
			<Term x={60} y={70} />
			<Ink d="M78,6 V74 M78,22 H114" />
			<Term x={86} y={14} />
			<Term x={100} y={14} />
			<Accent d="M86,34 h10 M100,34 h10" strokeWidth={2.4} />
		</Art>
	),
	'regola-di-ruffini': (
		<Art>
			{/* Ruffini's scheme: the coefficients on top, a on the left, the quotient and the rest below the line. */}
			<Ink d="M26,6 V72 M10,48 H112 M90,48 V72" />
			<Label x={16} y={36}>
				a
			</Label>
			{[38, 56, 74, 100].map((x) => (
				<Dot key={`t${x}`} x={x} y={16} />
			))}
			{[56, 74, 100].map((x) => (
				<Dot key={`m${x}`} x={x} y={36} />
			))}
			{[38, 56, 74].map((x) => (
				<Dot key={`b${x}`} x={x} y={60} />
			))}
			<Dashed d="M40,57 L54,39 M58,57 L72,39 M76,57 L98,39" />
			<Dot x={100} y={60} accent />
			<Label x={105} y={62} accent anchor="start">
				R
			</Label>
		</Art>
	),
	'scomposizione-polinomi': (
		<Art>
			{/* Algebra tiles: a square x², three strips x and two units laid out as a rectangle, whose sides are the factors. */}
			<Fill d="M30,14 H70 V54 H30 Z" />
			<Ink d="M70,14 H80 V54 H70 Z M80,14 H90 V54 H80 Z M30,54 H70 V64 H30 Z" className="fill-accent/5" />
			<Ink d="M70,54 H80 V64 H70 Z M80,54 H90 V64 H80 Z" />
			<Accent d="M30,14 V64 H90" />
			<Label x={60} y={74} accent>
				x + 2
			</Label>
			<Label x={26} y={39} accent anchor="end">
				x + 1
			</Label>
		</Art>
	)
};
