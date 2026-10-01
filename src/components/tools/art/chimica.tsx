import type { ReactNode } from 'react';
import { Accent, Art, Dot, Fill, Ink, Label } from './primitives';

/** A beaker from (x1, top) to (x2, bottom), filled with liquid up to `level`. */
function Beaker({ x1, x2, top, bottom, level }: { x1: number; x2: number; top: number; bottom: number; level: number }) {
	return (
		<>
			<Fill d={`M${x1},${level} H${x2} V${bottom} H${x1} Z`} stroke="none" />
			<Ink d={`M${x1 - 3},${top - 2} L${x1},${top} V${bottom} H${x2} V${top} L${x2 + 3},${top - 2}`} />
			<Ink d={`M${x1},${level} H${x2}`} className="stroke-fg-muted" strokeWidth={1} />
		</>
	);
}

/** The drawings of the chimica tools, by slug. */
export const CHIMICA_ART: Record<string, ReactNode> = {
	'orbitali-atomici': (
		<Art>
			{/* A p orbital: two lobes on an axis, the nucleus between them, and the node that separates them. */}
			<Ink d="M60,8 V72" className="stroke-fg-muted" strokeWidth={1} />
			<Fill d="M60,40 C44,30 40,12 60,10 C80,12 76,30 60,40 Z" />
			<Ink d="M60,40 C44,30 40,12 60,10 C80,12 76,30 60,40 Z" />
			<Accent d="M60,40 C44,50 40,68 60,70 C80,68 76,50 60,40 Z" className="fill-accent/15" />
			<Ink d="M30,40 H90" className="stroke-fg-muted" strokeWidth={1} strokeDasharray="3 3" />
			<Dot x={60} y={40} />
		</Art>
	),
	'tavola-periodica': (
		<Art>
			{/* The outline of the table, with the two series under it, and one element picked out. */}
			<Fill d="M9.6,10 H15.2 V16 H20.8 V28 H76.8 V16 H104.8 V10 H110.4 V52 H9.6 Z" />
			<Ink d="M9.6,10 H15.2 V16 H20.8 V28 H76.8 V16 H104.8 V10 H110.4 V52 H9.6 Z" />
			<Fill d="M20.8,58 H104.8 V70 H20.8 Z" />
			<Ink d="M20.8,58 H104.8 V70 H20.8 Z" />
			<Accent d="M48.8,28 H54.4 V34 H48.8 Z" className="fill-accent/25" />
		</Art>
	),
	'calcolo-massa-molare': (
		<Art>
			{/* A water molecule: the atoms and their bonds. */}
			<Ink d="M48.9,40.7 L38.7,48.7 M71.1,40.7 L81.3,48.7" />
			<circle cx={60} cy={32} r={14} className="fill-accent/15" vectorEffect="non-scaling-stroke" />
			<circle cx={31.6} cy={54.3} r={9} className="fill-accent/10" vectorEffect="non-scaling-stroke" />
			<circle cx={88.4} cy={54.3} r={9} className="fill-accent/10" vectorEffect="non-scaling-stroke" />
			<Label x={60} y={33} plain>
				O
			</Label>
			<Label x={31.6} y={55} plain>
				H
			</Label>
			<Label x={88.4} y={55} plain>
				H
			</Label>
		</Art>
	),
	'calcolo-moli': (
		<Art>
			{/* A heap of particles on the pan of a scale. */}
			<Ink d="M26,58 H94 M36,58 L32,70 H88 L84,58" />
			<g className="fill-accent/10">
				{[
					[40, 52],
					[50, 52],
					[60, 52],
					[70, 52],
					[80, 52],
					[45, 43.3],
					[55, 43.3],
					[65, 43.3],
					[75, 43.3],
					[50, 34.6],
					[60, 34.6],
					[70, 34.6],
					[55, 25.9],
					[65, 25.9],
					[60, 17.2]
				].map(([x, y]) => (
					<circle key={`${x},${y}`} cx={x} cy={y} r={5} vectorEffect="non-scaling-stroke" />
				))}
			</g>
			<Label x={86} y={24} accent>
				n
			</Label>
		</Art>
	),
	'calcolo-molarita': (
		<Art>
			{/* A volumetric flask filled up to the mark, with the solute in it. */}
			<Fill d="M55,20 V32.6 A20,20 0 1 0 65,32.6 V20 Z" stroke="none" />
			<Ink d="M55,8 V32.6 A20,20 0 1 0 65,32.6 V8" />
			<Accent d="M51,20 H69" />
			<Dot x={50} y={50} />
			<Dot x={63} y={45} />
			<Dot x={57} y={60} />
			<Dot x={70} y={56} />
			<Dot x={46} y={62} />
			<Label x={90} y={50}>
				V
			</Label>
		</Art>
	),
	'calcolo-diluizione': (
		<Art>
			{/* The same solute in a small beaker, then spread in a larger one. */}
			<Beaker x1={12} x2={40} top={36} bottom={68} level={46} />
			<Dot x={19} y={53} />
			<Dot x={27} y={51} />
			<Dot x={34} y={55} />
			<Dot x={21} y={62} />
			<Dot x={30} y={61} />
			<Accent d="M48,50 H70 M65,46 L70,50 L65,54" />
			<Beaker x1={78} x2={110} top={12} bottom={68} level={22} />
			<Dot x={86} y={30} />
			<Dot x={101} y={36} />
			<Dot x={90} y={47} />
			<Dot x={103} y={56} />
			<Dot x={85} y={62} />
		</Art>
	)
};
