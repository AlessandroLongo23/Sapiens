import type { ReactNode } from 'react';
import { Accent, Art, Axes, Dashed, Dot, Fill, Ink, Label, RightAngle } from './primitives';

/** The drawings of the geometry tools, by slug. */
export const GEOMETRIA_ART: Record<string, ReactNode> = {
	'area-perimetro-quadrato': (
		<Art>
			<Fill d="M36,10 H84 V58 H36 Z" />
			<Dashed d="M36,58 L84,10" />
			<Label x={60} y={70}>
				l
			</Label>
		</Art>
	),
	'area-perimetro-rettangolo': (
		<Art>
			<Fill d="M22,16 H98 V58 H22 Z" />
			<Label x={60} y={69}>
				b
			</Label>
			<Label x={106} y={37}>
				h
			</Label>
		</Art>
	),
	'area-perimetro-triangolo': (
		<Art>
			<Fill d="M20,62 H100 L70,12 Z" />
			<Dashed d="M70,12 V62" />
			<RightAngle x={70} y={62} u={[-1, 0]} v={[0, -1]} />
			<Label x={60} y={72}>
				b
			</Label>
			<Label x={77} y={40}>
				h
			</Label>
		</Art>
	),
	'area-perimetro-trapezio': (
		<Art>
			<Fill d="M16,60 H104 L80,16 H38 Z" />
			<Dashed d="M38,16 V60" />
			<Label x={60} y={70}>
				B
			</Label>
			<Label x={59} y={9}>
				b
			</Label>
			<Label x={45} y={40}>
				h
			</Label>
		</Art>
	),
	'area-perimetro-rombo': (
		<Art>
			<Fill d="M60,6 L96,38 L60,70 L24,38 Z" />
			<Dashed d="M24,38 H96 M60,6 V70" />
			<Label x={80} y={32}>
				D
			</Label>
			<Label x={66} y={56}>
				d
			</Label>
		</Art>
	),
	'area-perimetro-parallelogramma': (
		<Art>
			<Fill d="M14,60 H84 L106,16 H36 Z" />
			<Dashed d="M36,16 V60" />
			<RightAngle x={36} y={60} u={[1, 0]} v={[0, -1]} />
			<Label x={49} y={70}>
				b
			</Label>
			<Label x={43} y={38}>
				h
			</Label>
		</Art>
	),
	'area-circonferenza-cerchio': (
		<Art>
			<circle cx={60} cy={40} r={30} className="fill-accent/10" vectorEffect="non-scaling-stroke" />
			<Accent d="M60,40 L86,25" />
			<Dot x={60} y={40} />
			<Label x={70} y={26} accent>
				r
			</Label>
		</Art>
	),
	'teorema-di-pitagora': (
		<Art>
			{/* The right triangle with a square on each side, as in the textbook figure. */}
			<Ink d="M46,46 V30 H30 V46 Z" className="fill-accent/5" />
			<Ink d="M46,46 H70 V70 H46 Z" className="fill-accent/5" />
			<Ink d="M46,30 L70,46 L86,22 L62,6 Z" className="fill-accent/10" />
			<Fill d="M46,46 H70 L46,30 Z" className="fill-accent/25" />
			<RightAngle x={46} y={46} u={[1, 0]} v={[0, -1]} k={5} />
			<Accent d="M46,30 L70,46" />
		</Art>
	),
	'area-perimetro-poligoni-regolari': (
		<Art>
			<Fill d="M60,8 L88,24 L88,56 L60,72 L32,56 L32,24 Z" />
			<Dot x={60} y={40} />
			<Accent d="M60,40 H88" />
			<Label x={74} y={34} accent>
				a
			</Label>
			<Label x={98} y={40}>
				l
			</Label>
		</Art>
	),
	'superficie-volume-cubo': (
		<Art>
			<Fill d="M34,26 L48,14 H90 V56 L76,68 H34 Z" />
			<Ink d="M34,26 H76 V68 M76,26 L90,14" />
			<Dashed d="M34,68 L48,56 H90 M48,56 V14" />
			<Label x={55} y={75}>
				l
			</Label>
		</Art>
	),
	'superficie-volume-parallelepipedo': (
		<Art>
			<Fill d="M18,30 L32,18 H104 V52 L90,64 H18 Z" />
			<Ink d="M18,30 H90 V64 M90,30 L104,18" />
			<Dashed d="M18,64 L32,52 H104 M32,52 V18" />
			<Label x={54} y={72}>
				a
			</Label>
			<Label x={104} y={62}>
				b
			</Label>
			<Label x={11} y={47}>
				c
			</Label>
		</Art>
	),
	'superficie-volume-prisma': (
		<Art>
			<Fill d="M30,64 L56,72 L90,58 V14 L56,28 L30,20 Z" />
			<Ink d="M30,20 L64,6 L90,14 M56,28 V72" />
			<Dashed d="M30,64 L64,50 L90,58 M64,50 V6" />
			<Ink d="M30,20 V64" />
			<Label x={100} y={36}>
				h
			</Label>
		</Art>
	),
	'superficie-volume-piramide': (
		<Art>
			<Fill d="M20,56 L44,68 L100,58 L60,8 Z" />
			<Ink d="M44,68 L60,8" />
			<Dashed d="M20,56 L76,46 L100,58 M76,46 L60,8" />
			<Dashed d="M60,8 V57" />
			<Label x={66} y={40}>
				h
			</Label>
		</Art>
	),
	'superficie-volume-cilindro': (
		<Art>
			<Fill d="M36,16 V62 A24,7 0 0 0 84,62 V16 A24,7 0 0 0 36,16 Z" />
			<ellipse cx={60} cy={16} rx={24} ry={7} vectorEffect="non-scaling-stroke" />
			<Ink d="M36,16 V62 A24,7 0 0 0 84,62 V16" />
			<Dashed d="M36,62 A24,7 0 0 1 84,62" />
			<Accent d="M60,62 H84" />
			<Label x={72} y={55} accent>
				r
			</Label>
			<Label x={93} y={40}>
				h
			</Label>
		</Art>
	),
	'superficie-volume-cono': (
		<Art>
			<Fill d="M34,60 L60,8 L86,60 A26,8 0 0 1 34,60 Z" />
			<Ink d="M34,60 L60,8 L86,60 A26,8 0 0 1 34,60" />
			<Dashed d="M34,60 A26,8 0 0 1 86,60 M60,8 V60" />
			<Accent d="M60,60 H86" />
			<Label x={73} y={54} accent>
				r
			</Label>
			<Label x={54} y={36}>
				h
			</Label>
		</Art>
	),
	'superficie-volume-sfera': (
		<Art>
			<circle cx={60} cy={40} r={30} className="fill-accent/10" vectorEffect="non-scaling-stroke" />
			<Ink d="M30,40 A30,9 0 0 0 90,40" />
			<Dashed d="M30,40 A30,9 0 0 1 90,40" />
			<Accent d="M60,40 L81,19" />
			<Dot x={60} y={40} />
			<Label x={66} y={25} accent>
				r
			</Label>
		</Art>
	),
	'distanza-tra-due-punti': (
		<Art>
			<Axes ox={16} oy={66} />
			<Dashed d="M34,54 H92 V16" />
			<Accent d="M34,54 L92,16" />
			<Dot x={34} y={54} />
			<Dot x={92} y={16} />
			<Label x={28} y={46}>
				A
			</Label>
			<Label x={100} y={12}>
				B
			</Label>
		</Art>
	),
	'punto-medio-segmento': (
		<Art>
			<Axes ox={16} oy={66} />
			<Ink d="M30,54 L96,14" />
			<Dot x={30} y={54} />
			<Dot x={96} y={14} />
			<Dot x={63} y={34} accent />
			<Label x={63} y={24} accent>
				M
			</Label>
		</Art>
	),
	'retta-passante-per-due-punti': (
		<Art>
			<Axes ox={28} oy={60} />
			<Accent d="M10,74 L112,8" />
			<Dot x={44} y={52} />
			<Dot x={80} y={29} />
		</Art>
	),
	'parabola-vertice-fuoco-direttrice': (
		<Art>
			<Axes ox={20} oy={70} />
			<Accent d="M34,6 Q64,94 94,6" />
			<Dashed d="M8,60 H114" />
			<Dashed d="M64,6 V70" />
			<Dot x={64} y={50} />
			<Dot x={64} y={40} accent />
			<Label x={73} y={52}>
				V
			</Label>
			<Label x={73} y={38} accent>
				F
			</Label>
		</Art>
	)
};
