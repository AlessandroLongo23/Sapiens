import type { ReactNode } from 'react';
import { Accent, Art, Axes, Dashed, Dot, Fill, Ink, Label, RightAngle } from './primitives';

/** A small arc that marks an angle, paler than the sides. */
const AngleArc = ({ d }: { d: string }) => <path d={d} className="stroke-fg-muted" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />;

// The ticks of the protractor, every 10°, with a longer one every 30°.
const TICKS = Array.from({ length: 19 }, (_, i) => {
	const a = (i * 10 * Math.PI) / 180;
	const inner = i % 3 === 0 ? 38 : 42;
	const p = (r: number) => `${(60 + r * Math.cos(a)).toFixed(1)},${(66 - r * Math.sin(a)).toFixed(1)}`;
	return `M${p(inner)} L${p(48)}`;
}).join(' ');

/** The drawings of the trigonometria tools, by slug. */
export const TRIGONOMETRIA_ART: Record<string, ReactNode> = {
	'gradi-radianti': (
		<Art>
			{/* The radian: the angle whose arc is as long as the radius. */}
			<circle cx={60} cy={42} r={28} vectorEffect="non-scaling-stroke" />
			<Fill d="M60,42 L88,42 A28,28 0 0 0 75.1,18.4 Z" />
			<Accent d="M88,42 A28,28 0 0 0 75.1,18.4" />
			<Dot x={60} y={42} />
			<Label x={74} y={50}>
				r
			</Label>
			<Label x={93} y={25} accent>
				r
			</Label>
		</Art>
	),
	'seno-coseno-tangente': (
		<Art>
			{/* The unit circle: the point of the angle, and its height, the sine. */}
			<Axes ox={44} oy={44} />
			<circle cx={44} cy={44} r={30} vectorEffect="non-scaling-stroke" />
			<Fill d="M44,44 L67,24.7 V44 Z" />
			<Dashed d="M67,24.7 H44" />
			<Accent d="M67,44 V24.7" />
			<AngleArc d="M52,44 A8,8 0 0 0 50.1,38.9" />
			<Dot x={67} y={24.7} accent />
			<Label x={57.5} y={39.5}>
				α
			</Label>
			<Label x={76} y={18}>
				P
			</Label>
		</Art>
	),
	'risoluzione-triangolo-rettangolo': (
		<Art>
			{/* A right triangle: from the hypotenuse and an angle, the leg opposite it. */}
			<Fill d="M24,62 H100 L24,14 Z" />
			<RightAngle x={24} y={62} u={[1, 0]} v={[0, -1]} />
			<Accent d="M24,62 V14" />
			<AngleArc d="M86,62 A14,14 0 0 1 88.2,54.5" />
			<Label x={15} y={38} accent>
				b
			</Label>
			<Label x={68} y={30}>
				a
			</Label>
			<Label x={77} y={56}>
				β
			</Label>
		</Art>
	),
	'risoluzione-triangolo-qualsiasi': (
		<Art>
			{/* A scalene triangle: from two sides and the angle between them, the third side. */}
			<Fill d="M18,62 H102 L74,12 Z" />
			<Accent d="M102,62 L74,12" />
			<AngleArc d="M32,62 A14,14 0 0 0 28.4,52.7" />
			<Label x={39} y={56}>
				α
			</Label>
			<Label x={97} y={33} accent>
				a
			</Label>
			<Label x={40} y={33}>
				b
			</Label>
			<Label x={60} y={72}>
				c
			</Label>
		</Art>
	),
	'gradi-primi-secondi': (
		<Art>
			{/* A protractor with its ticks, and the angle read on it. */}
			<Fill d="M12,66 A48,48 0 0 1 108,66 Z" />
			<Ink d={TICKS} className="stroke-fg-muted" strokeWidth={1} />
			<Accent d="M60,66 L99.3,38.5" />
			<Dot x={60} y={66} />
		</Art>
	)
};
