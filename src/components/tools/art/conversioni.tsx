import type { ReactNode } from 'react';
import { Accent, Art, Dashed, Dot, Fill, Ink, Label } from './primitives';

/** Short ticks along an arc centred at (cx, cy), from radius r1 to r2, at the given angles in degrees (0 = right). */
function ArcTicks({ cx, cy, r1, r2, angles, muted }: { cx: number; cy: number; r1: number; r2: number; angles: number[]; muted?: boolean }) {
	const d = angles
		.map((a) => {
			const c = Math.cos((a * Math.PI) / 180);
			const s = Math.sin((a * Math.PI) / 180);
			return `M${(cx + r1 * c).toFixed(1)},${(cy - r1 * s).toFixed(1)} L${(cx + r2 * c).toFixed(1)},${(cy - r2 * s).toFixed(1)}`;
		})
		.join(' ');
	return <path d={d} className={muted ? 'stroke-fg-muted' : undefined} strokeWidth={muted ? 1 : undefined} vectorEffect="non-scaling-stroke" />;
}

/** The drawings of the conversioni tools, by slug. */
export const CONVERSIONI_ART: Record<string, ReactNode> = {
	equivalenze: (
		<Art>
			{/* The staircase of the units: each step down is a factor of ten. */}
			<Fill d="M10,70 V22 H24 V30 H38 V38 H52 V46 H66 V54 H80 V62 H94 V70 Z" />
			<Accent d="M26,18 C34,2 54,8 59,40" />
			<Accent d="M54.5,35.5 L59,41 L61.5,34" />
			<Label x={16} y={13} plain size={10}>
				km
			</Label>
			<Label x={59} y={54} plain size={10}>
				m
			</Label>
		</Art>
	),
	'convertitore-temperatura': (
		<Art>
			{/* A thermometer with a scale on each side. */}
			<Fill d="M54,59.3 V14 A6,6 0 0 1 66,14 V59.3 A9,9 0 1 1 54,59.3 Z" />
			<circle cx={60} cy={66} r={5} stroke="none" className="fill-accent" />
			<Accent d="M60,62 V30" />
			<Ink d="M44,18 H50 M46,26 H50 M44,34 H50 M46,42 H50 M44,50 H50" className="stroke-fg-muted" strokeWidth={1} />
			<Ink d="M70,20 H76 M70,27 H74 M70,34 H76 M70,41 H74 M70,48 H76" className="stroke-fg-muted" strokeWidth={1} />
			<Label x={32} y={34} plain>
				°C
			</Label>
			<Label x={88} y={34} plain>
				°F
			</Label>
		</Art>
	),
	'convertitore-velocita': (
		<Art>
			{/* A speedometer with the needle, and an inner scale for the other unit. */}
			<Fill d="M16,62 A44,44 0 0 1 104,62 Z" />
			<ArcTicks cx={60} cy={62} r1={44} r2={37} angles={[180, 150, 120, 90, 60, 30, 0]} />
			<Dashed d="M28,62 A32,32 0 0 1 92,62" />
			<ArcTicks cx={60} cy={62} r1={32} r2={28} angles={[180, 135, 90, 45, 0]} muted />
			<Accent d="M60,62 L82,36" />
			<Dot x={60} y={62} />
			<Label x={60} y={72} plain size={10}>
				km/h
			</Label>
		</Art>
	),
	'convertitore-energia': (
		<Art>
			{/* A battery with its charge. */}
			<Fill d="M20,22 H92 V58 H20 Z" />
			<Ink d="M92,32 H99 V48 H92" />
			<g className="fill-accent/40" stroke="none">
				<rect x={25} y={27} width={14} height={26} rx={1} />
				<rect x={42} y={27} width={14} height={26} rx={1} />
				<rect x={59} y={27} width={14} height={26} rx={1} />
			</g>
			<Dashed d="M76,27 H90 V53 H76 Z" />
		</Art>
	),
	'convertitore-potenza': (
		<Art>
			{/* A light bulb that shines. */}
			<Fill d="M52,50 A18,18 0 1 1 68,50 V58 H52 Z" />
			<Ink d="M52,58 H68 M53,62 H67 M56,66 H64" />
			<Ink d="M54,46 L57,34 L60,40 L63,34 L66,46" className="stroke-fg-muted" strokeWidth={1} />
			<Accent d="M60,4 V9 M34,14 L38,18 M86,14 L82,18 M26,34 H32 M94,34 H88 M34,54 L38,50 M86,54 L82,50" />
		</Art>
	),
	'convertitore-kw-cv': (
		<Art>
			{/* A horseshoe: the horsepower of the cavallo vapore. */}
			<Fill d="M32,12 V38 A28,28 0 0 0 88,38 V12 H76 V38 A16,16 0 0 1 44,38 V12 Z" />
			<Dot x={38} y={20} accent />
			<Dot x={38.6} y={42} accent />
			<Dot x={49} y={57.5} accent />
			<Dot x={71} y={57.5} accent />
			<Dot x={81.4} y={42} accent />
			<Dot x={82} y={20} accent />
		</Art>
	),
	'convertitore-pressione': (
		<Art>
			{/* Torricelli's tube: the air holds up a column of mercury. */}
			<Fill d="M18,62 H102 V70 H18 Z" />
			<Ink d="M14,56 V70 H106 V56" />
			<Ink d="M52,66 V14 A6,6 0 0 1 64,14 V66" />
			<path d="M52,28 H64 V62 H52 Z" stroke="none" className="fill-accent/25" />
			<Ink d="M30,42 V56 M27,52 L30,56 L33,52 M96,42 V56 M93,52 L96,56 L99,52" className="stroke-fg-muted" strokeWidth={1} />
			<Dashed d="M64,28 H80" />
			<Accent d="M76,28 V62 M73,28 H79 M73,62 H79" />
			<Label x={84} y={40} accent>
				h
			</Label>
		</Art>
	),
	'pollici-centimetri': (
		<Art>
			{/* A ruler with inches on one edge and centimetres on the other. */}
			<Fill d="M8,28 H112 V54 H8 Z" />
			<Ink d="M12,28 V38 M52,28 V38 M92,28 V38 M32,28 V33 M72,28 V33" />
			<Ink
				d="M12,54 V47 M27.7,54 V47 M43.5,54 V47 M59.2,54 V47 M75,54 V47 M90.7,54 V47 M106.5,54 V47 M19.9,54 V50 M35.6,54 V50 M51.4,54 V50 M67.1,54 V50 M82.9,54 V50 M98.6,54 V50"
				className="stroke-fg-muted"
				strokeWidth={1}
			/>
			<Accent d="M12,20 H52 M12,16 V24 M52,16 V24" />
			<Label x={32} y={10} plain accent>
				in
			</Label>
			<Label x={20} y={65} plain>
				cm
			</Label>
		</Art>
	)
};
