import type { ReactNode } from 'react';
import { Accent, Art, Axes, Dashed, Dot, Ink, Label } from './primitives';

/** The drawings of the circle equation, sector, annulus and polygon from coordinates. */
export const CERCHIO_PIANO_ART: Record<string, ReactNode> = {
	'equazione-circonferenza': (
		<Art>
			{/* The circle found from its equation, on the Cartesian plane, with its centre. */}
			<Axes ox={22} oy={62} />
			<path d="M42,34 A26,26 0 1,0 94,34 A26,26 0 1,0 42,34 Z" stroke="none" className="fill-accent/10" />
			<Accent d="M42,34 A26,26 0 1,0 94,34 A26,26 0 1,0 42,34 Z" />
			<Dashed d="M68,34 H94" />
			<Dot x={68} y={34} />
			<Label x={66} y={25}>
				C
			</Label>
		</Art>
	),
	'area-settore-circolare': (
		<Art>
			{/* A slice of the circle: the two radii, the arc it finds, the angle at the centre. */}
			<Ink d="M60,70 L93.4,30.2 A52,52 0 0,0 26.6,30.2 Z" className="fill-accent/10" />
			<Accent d="M93.4,30.2 A52,52 0 0,0 26.6,30.2" />
			<Ink d="M69,59.3 A14,14 0 0,0 51,59.3" className="stroke-fg-muted" strokeWidth={1} />
			<Dot x={60} y={70} />
			<Label x={60} y={49}>
				α
			</Label>
			<Label x={60} y={11} accent>
				ℓ
			</Label>
		</Art>
	),
	'area-corona-circolare': (
		<Art>
			{/* Two circles around one centre: the ring between them is what the tool measures. */}
			<Ink d="M28,40 A32,32 0 1,0 92,40 A32,32 0 1,0 28,40 Z M46,40 A14,14 0 1,0 74,40 A14,14 0 1,0 46,40 Z" fillRule="evenodd" className="fill-accent/25" />
			<Dashed d="M60,40 H92" />
			<Dashed d="M60,40 L50.1,30.1" />
			<Dot x={60} y={40} />
			<Label x={84} y={34}>
				R
			</Label>
			<Label x={52} y={42}>
				r
			</Label>
		</Art>
	),
	'area-poligono-coordinate': (
		<Art>
			{/* An irregular polygon on the plane, known only by its vertices: its area is what the tool finds. */}
			<Axes ox={14} oy={74} />
			<Ink d="M28,50 L64,58 L98,34 L80,8 L40,18 Z" className="fill-accent/25" />
			<Dot x={28} y={50} />
			<Dot x={64} y={58} />
			<Dot x={98} y={34} />
			<Dot x={80} y={8} />
			<Dot x={40} y={18} />
			<Label x={21} y={42}>
				A
			</Label>
			<Label x={64} y={67}>
				B
			</Label>
		</Art>
	)
};
