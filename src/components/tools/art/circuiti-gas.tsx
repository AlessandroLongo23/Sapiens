import type { ReactNode } from 'react';
import { Accent, Art, Dashed, Dot, Fill, Ink } from './primitives';

/** A resistor as in the Italian books (IEC): a small rectangle centred at (x, y). */
const res = (x: number, y: number, w = 18, h = 8) => `M${x - w / 2},${y - h / 2} H${x + w / 2} V${y + h / 2} H${x - w / 2} Z`;

/** The drawings of resistors, colour code and gas laws. */
export const CIRCUITI_GAS_ART: Record<string, ReactNode> = {
	'resistenze-in-serie-e-parallelo': (
		<Art>
			{/* Two resistors in parallel between two rails, and the single one that replaces them. */}
			<Ink d="M6,40 H14 M14,24 V56 M54,24 V56 M54,40 H62" />
			<Ink d="M14,24 H25 M43,24 H54 M14,56 H25 M43,56 H54" />
			<Fill d={res(34, 24)} />
			<Fill d={res(34, 56)} />
			<Dashed d="M68,40 H80 M76,36 L80,40 L76,44" />
			<Ink d="M86,40 H93 M111,40 H116" />
			<Accent d={res(102, 40)} className="fill-accent/10" />
		</Art>
	),
	'codice-colori-resistenze': (
		<Art>
			{/* A resistor with its bands: the value is read from the first bands, the tolerance apart on the right. */}
			<Ink d="M8,46 H28 M92,46 H112" />
			<Fill d="M34,34 H86 Q92,34 92,40 V52 Q92,58 86,58 H34 Q28,58 28,52 V40 Q28,34 34,34 Z" />
			<Ink d="M40,35 V57 M49,35 V57 M58,35 V57 M80,35 V57" strokeWidth={4} strokeLinecap="butt" />
			<Accent d="M37,24 V19 H61 V24" />
		</Art>
	),
	'leggi-dei-gas': (
		<Art>
			{/* A gas in a cylinder under a piston: its volume changes with pressure and temperature. */}
			<Ink d="M34,12 V68 H78 V12" />
			<Fill d="M35,30 H77 V36 H35 Z" />
			<Ink d="M56,30 V8" />
			<Dot x={44} y={46} />
			<Dot x={60} y={42} />
			<Dot x={70} y={52} />
			<Dot x={50} y={60} />
			<Dot x={64} y={62} />
			<Dot x={42} y={58} />
			<Dashed d="M80,36 H90 M80,68 H90" />
			<Accent d="M86,39 V65 M83,43 L86,39 L89,43 M83,61 L86,65 L89,61" />
		</Art>
	)
};
