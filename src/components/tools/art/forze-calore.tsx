import type { ReactNode } from 'react';
import { Accent, Art, Axes, Dashed, Fill, Ink, Label } from './primitives';

/** The drawings of thermal equilibrium, the inclined plane, Coulomb's law and the newton converter. */
export const FORZE_CALORE_ART: Record<string, ReactNode> = {
	'temperatura-di-equilibrio': (
		<Art>
			{/* Two temperatures over time, one falling and one rising, that meet at the equilibrium. */}
			<Axes ox={14} oy={70} />
			<Ink d="M18,14 C38,30 58,37 104,39" />
			<Ink d="M18,64 C38,49 58,43 104,41" />
			<Accent d="M62,40 H110" />
			<Label x={24} y={8}>
				T
			</Label>
			<Label x={108} y={76}>
				t
			</Label>
		</Art>
	),
	'piano-inclinato': (
		<Art>
			{/* A block on an inclined plane, and the way it slides down along it. */}
			<Fill d="M12,68 H108 L12,20 Z" />
			<Ink d="M41.5,34.8 L54.1,41 L60.4,28.5 L47.8,22.3 Z" />
			<Ink d="M92,68 A16,16 0 0 1 93.7,60.8" className="stroke-fg-muted" strokeWidth={1} />
			<Label x={83} y={63} size={10}>
				α
			</Label>
			<Accent d="M60.7,38.8 L85.7,51.3 M82.4,46.3 L85.7,51.3 L79.7,51.7" />
		</Art>
	),
	'legge-di-coulomb': (
		<Art>
			{/* A positive and a negative charge that attract each other, at a distance r. */}
			<circle cx={28} cy={34} r={11} className="fill-accent/10" vectorEffect="non-scaling-stroke" />
			<circle cx={92} cy={34} r={11} className="fill-accent/10" vectorEffect="non-scaling-stroke" />
			<Ink d="M23,34 H33 M28,29 V39 M87,34 H97" />
			<Accent d="M44,34 H56 M51,30 L56,34 L51,38 M76,34 H64 M69,30 L64,34 L69,38" />
			<Dashed d="M28,54 H92" />
			<Ink d="M28,50 V58 M92,50 V58" className="stroke-fg-muted" strokeWidth={1} />
			<Label x={60} y={66}>
				r
			</Label>
		</Art>
	),
	'convertitore-newton-kg': (
		<Art>
			{/* A spring scale holding a weight: the force it reads. */}
			<circle cx={60} cy={5} r={3} vectorEffect="non-scaling-stroke" />
			<Ink d="M60,8 V10" />
			<Fill d="M52,10 H68 V42 H52 Z" />
			<Ink d="M55,16 H59 M55,22 H61 M55,28 H59 M55,34 H61" className="stroke-fg-muted" strokeWidth={1} />
			<Ink d="M60,42 V50" />
			<Fill d="M50,50 H70 L74,72 H46 Z" />
			<Label x={60} y={62} plain size={9}>
				kg
			</Label>
			<Accent d="M86,52 V74 M82,69 L86,74 L90,69" />
		</Art>
	)
};
