import type { ReactNode } from 'react';
import { Accent, Art, Dashed, Fill, Ink } from './primitives';

/** A small atom: a circle with the pale accent fill, in ink. */
const Atom = ({ x, y, r }: { x: number; y: number; r: number }) => <circle cx={x} cy={y} r={r} className="fill-accent/10" vectorEffect="non-scaling-stroke" />;

/** The drawings of pH, empirical formula and limiting reagent. */
export const STECHIOMETRIA_ART: Record<string, ReactNode> = {
	'calcolo-ph': (
		<Art>
			{/* A drop on a strip of indicator paper, and the mark where it falls on the scale. */}
			<Fill d="M34.5,12 C34.5,12 26.5,22 26.5,27 A8,8 0 0 0 42.5,27 C42.5,22 34.5,12 34.5,12 Z" />
			<Ink d="M10,44 H110 V56 H10 Z" />
			<Ink d="M17,44 V56 M24,44 V56 M31,44 V56 M38,44 V56 M46,44 V56 M53,44 V56 M60,44 V56 M67,44 V56 M74,44 V56 M81,44 V56 M89,44 V56 M96,44 V56 M103,44 V56" className="stroke-fg-muted" strokeWidth={1} />
			<Accent d="M34.5,40 V60 M34.5,62 L30.5,70 H38.5 Z" />
		</Art>
	),
	'calcolo-formula-minima': (
		<Art>
			{/* The mass split among the elements, and the same small group of atoms repeated: the empirical formula is one group. */}
			<Fill d="M14,14 H106 V22 H14 Z" />
			<Ink d="M62,14 V22 M80,14 V22" className="stroke-fg-muted" strokeWidth={1} />
			{[28, 60, 92].map((x) => (
				<g key={x}>
					<Atom x={x} y={52} r={6} />
					<Atom x={x - 10} y={52} r={3.5} />
					<Atom x={x + 10} y={52} r={3.5} />
				</g>
			))}
			<Accent d="M17,41 H39 A3,3 0 0 1 42,44 V60 A3,3 0 0 1 39,63 H17 A3,3 0 0 1 14,60 V44 A3,3 0 0 1 17,41 Z" />
		</Art>
	),
	'reagente-limitante': (
		<Art>
			{/* Two particles of one reagent for each of the other: the lower row runs out first, two particles above are left over. */}
			{[18, 34, 50, 66].map((x) => (
				<Atom key={x} x={x} y={24} r={5} />
			))}
			{[84, 100].map((x) => (
				<circle key={x} cx={x} cy={24} r={5} className="stroke-fg-muted" strokeWidth={1.2} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
			))}
			<Dashed d="M19.5,29 L25,48 M32.5,29 L27,48 M51.5,29 L57,48 M64.5,29 L59,48" />
			<g className="fill-accent/15 stroke-accent" strokeWidth={2}>
				<circle cx={26} cy={55} r={7} vectorEffect="non-scaling-stroke" />
				<circle cx={58} cy={55} r={7} vectorEffect="non-scaling-stroke" />
			</g>
		</Art>
	)
};
