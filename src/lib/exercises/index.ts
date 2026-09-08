import type { Exercise } from './abstract';

type Generators = Record<string, new (...args: number[]) => Exercise>;

/**
 * Exercise generators by lesson slug. Each module is loaded only when its
 * lesson is opened, so the maths library never ships with the rest.
 */
export const generatorModules: Record<string, () => Promise<Generators>> = {
	'insiemi-operazioni': () => import('./insiemi-operazioni') as unknown as Promise<Generators>,
	'numeri-naturali-operazioni': () => import('./numeri-naturali-operazioni') as unknown as Promise<Generators>,
	'numeri-naturali-mcm-mcd': () => import('./numeri-naturali-mcm-mcd') as unknown as Promise<Generators>,
	'numeri-naturali-potenze': () => import('./numeri-naturali-potenze') as unknown as Promise<Generators>,
	'numeri-razionali-confronto-frazioni': () => import('./numeri-razionali-confronto-frazioni') as unknown as Promise<Generators>,
	'numeri-razionali-espressioni': () => import('./numeri-razionali-espressioni') as unknown as Promise<Generators>,
	'numeri-razionali-potenze': () => import('./numeri-razionali-potenze') as unknown as Promise<Generators>,
	'numeri-razionali-potenze-esponente-negativo': () => import('./numeri-razionali-potenze-esponente-negativo') as unknown as Promise<Generators>,
	'numeri-razionali-conversione': () => import('./numeri-razionali-conversione') as unknown as Promise<Generators>,
	'monomi-grado': () => import('./monomi-grado') as unknown as Promise<Generators>,
	'monomi-mcm-mcd': () => import('./monomi-mcm-mcd') as unknown as Promise<Generators>,
	'monomi-operazioni': () => import('./monomi-operazioni') as unknown as Promise<Generators>,
	'monomi-espressioni': () => import('./monomi-espressioni') as unknown as Promise<Generators>,
	'equazioni-primo-grado': () => import('./equazioni-primo-grado') as unknown as Promise<Generators>,
	'equazioni-secondo-grado': () => import('./equazioni-secondo-grado') as unknown as Promise<Generators>
};
