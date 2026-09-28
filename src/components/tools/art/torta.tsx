import type { ReactNode } from 'react';
import { Accent, Art, Fill, Ink } from './primitives';

// A pie of four slices around (40, 40) with radius 28, angles clockwise from 12 o'clock: 0°–100°, 100°–210°,
// 210°–290°, 290°–360°. The first slice is pulled out by 5 along its middle (50°), to (43,8, 36,8).
const PIE = ['M40,40 L67.6,44.9 A28,28 0 0,1 26,64.2 Z', 'M40,40 L26,64.2 A28,28 0 0,1 13.7,30.4 Z', 'M40,40 L13.7,30.4 A28,28 0 0,1 40,12 Z'];
const LEGEND = [18, 32, 46, 60];

export const TORTA_ART: Record<string, ReactNode> = {
	'grafico-a-torta': (
		<Art>
			{/* The pie, one slice pulled out with its angle at the centre, and the legend beside it. */}
			{PIE.map((d) => (
				<Fill key={d} d={d} />
			))}
			<Fill d="M43.8,36.8 L43.8,8.8 A28,28 0 0,1 71.4,41.7 Z" className="fill-accent/25 stroke-accent" strokeWidth={2} />
			<Accent d="M43.8,27.8 A9,9 0 0,1 52.7,38.4" />
			{LEGEND.map((y) => (
				<Fill key={y} d={`M84,${y - 4} h8 v8 h-8 Z`} />
			))}
			<Ink d={LEGEND.map((y) => `M97,${y} H110`).join(' ')} />
		</Art>
	)
};
