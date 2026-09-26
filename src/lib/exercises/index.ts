import type { Generator } from './v2/types';

/**
 * Exercise generators by id. Each module is loaded only when its lesson's
 * exercises are asked for, so the generators never ship with the rest.
 */
export const generators: Record<string, () => Promise<Generator>> = {
	'prime-definizioni': () => import('./v2/generators/prime-definizioni').then((m) => m.default),
	'insiemi-rappresentazione': () => import('./v2/generators/insiemi-rappresentazione').then((m) => m.default),
	'sottoinsiemi-ugualianza': () => import('./v2/generators/sottoinsiemi-ugualianza').then((m) => m.default),
	'insiemi-unione': () => import('./v2/generators/insiemi-unione').then((m) => m.default),
	'insiemi-operazioni': () => import('./v2/generators/insiemi-operazioni').then((m) => m.default),
	'numeri-naturali-operazioni': () => import('./v2/generators/numeri-naturali-operazioni').then((m) => m.default),
	'numeri-naturali-mcm-mcd': () => import('./v2/generators/numeri-naturali-mcm-mcd').then((m) => m.default),
	'numeri-naturali-potenze': () => import('./v2/generators/numeri-naturali-potenze').then((m) => m.default),
	'numeri-razionali-confronto-frazioni': () => import('./v2/generators/numeri-razionali-confronto-frazioni').then((m) => m.default),
	'numeri-razionali-potenze': () => import('./v2/generators/numeri-razionali-potenze').then((m) => m.default),
	'numeri-razionali-conversione': () => import('./v2/generators/numeri-razionali-conversione').then((m) => m.default),
	'monomi-grado': () => import('./v2/generators/monomi-grado').then((m) => m.default),
	'monomi-operazioni': () => import('./v2/generators/monomi-operazioni').then((m) => m.default),
	'monomi-mcm-mcd': () => import('./v2/generators/monomi-mcm-mcd').then((m) => m.default),
	'monomi-espressioni': () => import('./v2/generators/monomi-espressioni').then((m) => m.default),
	'equazioni-primo-grado': () => import('./v2/generators/equazioni-primo-grado').then((m) => m.default),
	'equazioni-secondo-grado': () => import('./v2/generators/equazioni-secondo-grado').then((m) => m.default),
	'funzioni-iniettive-suriettive-biettive': () => import('./v2/generators/funzioni-iniettive-suriettive-biettive').then((m) => m.default),
	'numeri-naturali-divisibilita': () => import('./v2/generators/numeri-naturali-divisibilita').then((m) => m.default),
	'numeri-interi-valore-assoluto': () => import('./v2/generators/numeri-interi-valore-assoluto').then((m) => m.default),
	'numeri-interi-operazioni': () => import('./v2/generators/numeri-interi-operazioni').then((m) => m.default),
	'numeri-interi-potenze': () => import('./v2/generators/numeri-interi-potenze').then((m) => m.default),
	'numeri-razionali-frazioni': () => import('./v2/generators/numeri-razionali-frazioni').then((m) => m.default),
	'numeri-razionali-operazioni': () => import('./v2/generators/numeri-razionali-operazioni').then((m) => m.default),
	'numeri-razionali-espressioni': () => import('./v2/generators/numeri-razionali-espressioni').then((m) => m.default),
	'numeri-razionali-proporzioni': () => import('./v2/generators/numeri-razionali-proporzioni').then((m) => m.default),
	'monomi': () => import('./v2/generators/monomi').then((m) => m.default),
	'polinomi': () => import('./v2/generators/polinomi').then((m) => m.default),
	'polinomi-operazioni': () => import('./v2/generators/polinomi-operazioni').then((m) => m.default),
	'polinomi-prodotti-notevoli': () => import('./v2/generators/polinomi-prodotti-notevoli').then((m) => m.default),
	'polinomi-espressioni': () => import('./v2/generators/polinomi-espressioni').then((m) => m.default),
	'polinomi-divisione': () => import('./v2/generators/polinomi-divisione').then((m) => m.default),
	'polinomi-ruffini': () => import('./v2/generators/polinomi-ruffini').then((m) => m.default),
	'scomposizione-raccoglimento': () => import('./v2/generators/scomposizione-raccoglimento').then((m) => m.default),
	'scomposizione-prodotti-notevoli': () => import('./v2/generators/scomposizione-prodotti-notevoli').then((m) => m.default),
	'scomposizione-trinomio': () => import('./v2/generators/scomposizione-trinomio').then((m) => m.default),
	'scomposizione-ruffini': () => import('./v2/generators/scomposizione-ruffini').then((m) => m.default),
	'polinomi-mcd-mcm': () => import('./v2/generators/polinomi-mcd-mcm').then((m) => m.default),
	// Chemistry: pools pregenerated in Python (chimica/pool.ts).
	'mole-massa-molare': () => import('./chimica/mole-massa-molare').then((m) => m.default),
	'geometria-molecolare-vsepr': () => import('./chimica/geometria-molecolare-vsepr').then((m) => m.default),
	'alcani-nomenclatura': () => import('./chimica/alcani-nomenclatura').then((m) => m.default),
	'isomeria': () => import('./chimica/isomeria').then((m) => m.default),
	'gruppi-funzionali': () => import('./chimica/gruppi-funzionali').then((m) => m.default),
	'amminoacidi-legame-peptidico': () => import('./chimica/amminoacidi-legame-peptidico').then((m) => m.default)
};
