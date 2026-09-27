import type { ReactNode } from 'react';
import { Accent, Art, Axes, Dashed, Dot, Fill, Ink, Label } from './primitives';

/** The drawings of the logarithm and of exponential and logarithmic equations. */
export const LOGARITMI_ART: Record<string, ReactNode> = {
	'calcolo-logaritmo': (
		<Art>
			{/* The logarithm counts the jumps: from 1 to a, multiplying by the base each time. The jumps are what the tool finds. */}
			<Ink d="M6,52 H112 M108,49 L112,52 L108,55" />
			<Dot x={14} y={52} />
			<Dot x={26} y={52} />
			<Dot x={50} y={52} />
			<Dot x={98} y={52} />
			<Accent d="M14,48 Q20,38 26,48 M26,48 Q38,26 50,48 M50,48 Q74,6 98,48" />
			<Label x={98} y={64}>
				a
			</Label>
		</Art>
	),
	'equazioni-esponenziali': (
		<Art>
			{/* The curve y = a^x meets the height b once: the x under that point is the solution. */}
			<Axes ox={24} oy={66} />
			<Ink d="M8,64 L14,63.4 L20,62.6 L26,61.6 L32,60.3 L38,58.7 L44,56.5 L50,53.7 L56,50 L62,45.3 L68,39.1 L74,31.1 L80,20.7 L86,7.3" />
			<Dashed d="M24,24 H78.3 V66" />
			<Label x={16} y={24}>
				b
			</Label>
			<Dot x={78.3} y={66} accent />
			<Label x={78.3} y={74} accent>
				x
			</Label>
		</Art>
	),
	'equazioni-logaritmiche': (
		<Art>
			{/* The logarithm lives right of its asymptote (the conditions of existence, shaded): a solution there is kept, one outside is crossed out. */}
			<Fill d="M34,6 H112 V74 H34 Z" stroke="none" />
			<Dashed d="M34,4 V76" />
			<Ink d="M6,58 H112 M108,55 L112,58 L108,61" />
			<Ink d="M41,74.8 L42,72.7 L44,69.1 L46,66.2 L49,62.6 L54,58 L60,53.8 L68,49.5 L78,45.4 L90,41.5 L104,38 L110,36.6" />
			<path d="M17,55 L23,61 M23,55 L17,61" className="stroke-fg-muted" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
			<Dot x={54} y={58} accent />
			<Label x={60} y={68} accent>
				x
			</Label>
		</Art>
	)
};
