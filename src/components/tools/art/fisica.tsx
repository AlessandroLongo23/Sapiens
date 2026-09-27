import type { ReactNode } from 'react';
import { Accent, Art, Axes, Dashed, Dot, Fill, Ink, Label } from './primitives';

/** An arrow tip at (x, y) pointing right. */
const tipRight = (x: number, y: number) => `M${x - 5},${y - 4} L${x},${y} L${x - 5},${y + 4}`;

/** The drawings of the fisica tools, by slug. */
export const FISICA_ART: Record<string, ReactNode> = {
	'moto-rettilineo-uniforme': (
		<Art>
			{/* A cart on the road, with equal steps marked below and where it will be next. */}
			<Ink d="M8,62 H112" />
			<Ink d="M30,62 V67 M62,62 V67 M94,62 V67" className="stroke-fg-muted" strokeWidth={1} />
			<Fill d="M16,42 H44 V55 H16 Z" />
			<circle cx={22} cy={58} r={4} vectorEffect="non-scaling-stroke" />
			<circle cx={38} cy={58} r={4} vectorEffect="non-scaling-stroke" />
			<Dashed d="M80,42 H108 V55 H80 Z" />
			<Accent d={`M34,32 H70 ${tipRight(70, 32)}`} />
			<Label x={52} y={22} accent>
				v
			</Label>
		</Art>
	),
	'moto-uniformemente-accelerato': (
		<Art>
			{/* The velocity-time graph: a slanted line, and the space as the area under it. */}
			<Axes ox={16} oy={66} />
			<Fill d="M16,66 V52 L96,16 V66 Z" stroke="none" />
			<Dashed d="M96,16 V66" />
			<Accent d="M16,52 L96,16" />
			<Label x={26} y={8}>
				v
			</Label>
			<Label x={108} y={74}>
				t
			</Label>
		</Art>
	),
	'calcolo-densita': (
		<Art>
			{/* A cube packed with particles: mass in a volume. */}
			<Fill d="M34,26 L48,14 H90 V56 L76,68 H34 Z" />
			<Ink d="M34,26 H76 V68 M76,26 L90,14" />
			<Dot x={44} y={37} accent />
			<Dot x={55} y={37} accent />
			<Dot x={66} y={37} accent />
			<Dot x={44} y={47} accent />
			<Dot x={55} y={47} accent />
			<Dot x={66} y={47} accent />
			<Dot x={44} y={57} accent />
			<Dot x={55} y={57} accent />
			<Dot x={66} y={57} accent />
			<Label x={100} y={40}>
				V
			</Label>
		</Art>
	),
	'calcolo-energia-cinetica': (
		<Art>
			{/* A ball rolling fast, with the streaks of its speed. */}
			<Ink d="M8,64 H112" />
			<Dashed d="M26,44 H50 M20,52 H48 M26,60 H50" />
			<circle cx={66} cy={52} r={12} className="fill-accent/10" vectorEffect="non-scaling-stroke" />
			<Label x={66} y={52}>
				m
			</Label>
			<Accent d={`M60,26 H100 ${tipRight(100, 26)}`} />
			<Label x={80} y={16} accent>
				v
			</Label>
		</Art>
	),
	'calcolo-energia-potenziale': (
		<Art>
			{/* A ball on top of a pillar, at a height above the ground. */}
			<Ink d="M8,68 H112" />
			<Ink d="M32,30 H52 V68 M32,30 V68" />
			<circle cx={42} cy={22} r={8} className="fill-accent/10" vectorEffect="non-scaling-stroke" />
			<Dashed d="M50,22 H80" />
			<Accent d="M76,22 V68 M72,22 H80" />
			<Label x={86} y={45} accent>
				h
			</Label>
			<Label x={42} y={22} size={10}>
				m
			</Label>
		</Art>
	),
	'legge-di-ohm': (
		<Art>
			{/* A circuit: a battery, a resistor and the current that flows. */}
			<Ink d="M46,20 H20 V58 H56 M64,58 H100 V20 H74" />
			<Fill d="M46,15 H74 V25 H46 Z" />
			<Ink d="M56,50 V66 M64,54 V62" />
			<Accent d="M28,48 V30 M24,35 L28,30 L32,35" />
			<Label x={60} y={7}>
				R
			</Label>
			<Label x={60} y={74}>
				V
			</Label>
			<Label x={38} y={40} accent>
				I
			</Label>
		</Art>
	)
};
