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
import { DATI_ART } from './dati';
import { ESAMI_ART } from './esami';
import { EQUAZIONI_ART } from './equazioni';
import { DIVISORI_INTERESSE_ART, RETI_ART } from './numeri-informatica';
import { STECHIOMETRIA_ART } from './stechiometria';
import { LOGARITMI_ART } from './logaritmi';
import { CERCHIO_PIANO_ART } from './cerchio-piano';
import { CIRCUITI_GAS_ART } from './circuiti-gas';
import { FORZE_CALORE_ART } from './forze-calore';
import { TORTA_ART } from './torta';

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
	...SCUOLA_ART,
	...DATI_ART,
	...ESAMI_ART,
	...EQUAZIONI_ART,
	...DIVISORI_INTERESSE_ART,
	...RETI_ART,
	...STECHIOMETRIA_ART,
	...LOGARITMI_ART,
	...CERCHIO_PIANO_ART,
	...CIRCUITI_GAS_ART,
	...FORZE_CALORE_ART,
	...TORTA_ART
};
