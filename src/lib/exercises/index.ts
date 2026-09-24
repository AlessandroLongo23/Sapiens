import type { Exercise } from './abstract';

type Generators = Record<string, new (...args: number[]) => Exercise>;

/**
 * Exercise generators by lesson slug. Each module is loaded only when its
 * lesson is opened, so the maths library never ships with the rest.
 */
export const generatorModules: Record<string, () => Promise<Generators>> = {
	'prime-definizioni': () => import('./prime-definizioni-v2') as unknown as Promise<Generators>,
	'insiemi-rappresentazione': () => import('./insiemi-rappresentazione-v2') as unknown as Promise<Generators>,
	'sottoinsiemi-ugualianza': () => import('./sottoinsiemi-ugualianza-v2') as unknown as Promise<Generators>,
	'insiemi-unione': () => import('./insiemi-unione-v2') as unknown as Promise<Generators>,
	'insiemi-operazioni': () => import('./insiemi-operazioni-v2') as unknown as Promise<Generators>,
	'numeri-naturali-operazioni': () => import('./numeri-naturali-operazioni-v2') as unknown as Promise<Generators>,
	'numeri-naturali-mcm-mcd': () => import('./numeri-naturali-mcm-mcd-v2') as unknown as Promise<Generators>,
	'numeri-naturali-potenze': () => import('./numeri-naturali-potenze-v2') as unknown as Promise<Generators>,
	'numeri-razionali-confronto-frazioni': () => import('./numeri-razionali-confronto-frazioni-v2') as unknown as Promise<Generators>,
	'numeri-razionali-potenze': () => import('./numeri-razionali-potenze-v2') as unknown as Promise<Generators>,
	'numeri-razionali-conversione': () => import('./numeri-razionali-conversione-v2') as unknown as Promise<Generators>,
	'monomi-grado': () => import('./monomi-grado-v2') as unknown as Promise<Generators>,
	'monomi-operazioni': () => import('./monomi-operazioni-v2') as unknown as Promise<Generators>,
	'monomi-mcm-mcd': () => import('./monomi-mcm-mcd-v2') as unknown as Promise<Generators>,
	'monomi-espressioni': () => import('./monomi-espressioni-v2') as unknown as Promise<Generators>,
	'equazioni-primo-grado': () => import('./equazioni-primo-grado-v2') as unknown as Promise<Generators>,
	'equazioni-secondo-grado': () => import('./equazioni-secondo-grado-v2') as unknown as Promise<Generators>,
	'funzioni-iniettive-suriettive-biettive': () => import('./funzioni-iniettive-suriettive-biettive-v2') as unknown as Promise<Generators>
};
