import type { ReactNode } from 'react';
import { NUMERI_ART } from './numeri';
import { ALGEBRA_ART } from './algebra';
import { STATISTICA_ART } from './statistica';
import { TRIGONOMETRIA_ART } from './trigonometria';
import { CONVERSIONI_ART } from './conversioni';
import { FISICA_ART } from './fisica';
import { CHIMICA_ART } from './chimica';
import { INFORMATICA_ART } from './informatica';
import { SCUOLA_ART } from './scuola';
import { GEOMETRIA_ART } from './geometria';

/** The drawing on each tool's card in the index, by slug (see primitives.tsx for how they are drawn). */
export const TOOL_ART: Record<string, ReactNode> = {
	...GEOMETRIA_ART,
	...NUMERI_ART,
	...ALGEBRA_ART,
	...STATISTICA_ART,
	...TRIGONOMETRIA_ART,
	...CONVERSIONI_ART,
	...FISICA_ART,
	...CHIMICA_ART,
	...INFORMATICA_ART,
	...SCUOLA_ART
};
