import type { ToolCategory, ToolMeta } from './types';

/** Public path of the tools section. */
export const TOOLS_ROOT = '/strumenti';

/**
 * Every tool, in the order the index shows them within a category. The page of a tool is `/strumenti/<slug>`, its
 * inputs are a client component in src/components/tools/registry.tsx, its article `src/content/strumenti/<slug>.md`.
 */
export const TOOLS: ToolMeta[] = [
	{
		slug: 'calcolo-percentuale',
		title: 'Calcolo percentuale',
		lead: 'La percentuale di un numero, che percentuale è una parte, la variazione percentuale, sconti e aumenti. Con i passaggi.',
		description: 'Calcola la percentuale di un numero, che percentuale è una parte del totale, la variazione percentuale, sconti e aumenti, con tutti i passaggi.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-razionali/numeri-razionali-proporzioni'],
		related: ['calcolo-mcm', 'calcolo-mcd']
	},
	{
		slug: 'calcolo-mcm',
		title: 'Calcolo del mcm',
		lead: 'Il minimo comune multiplo di due o più numeri, con la scomposizione in fattori primi.',
		description: 'Calcola il minimo comune multiplo (mcm) di due o più numeri, con la scomposizione in fattori primi e tutti i passaggi spiegati.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-mcm-mcd'],
		related: ['calcolo-mcd', 'calcolo-percentuale']
	},
	{
		slug: 'calcolo-mcd',
		title: 'Calcolo del MCD',
		lead: 'Il massimo comune divisore di due o più numeri, con la scomposizione in fattori primi.',
		description: 'Calcola il massimo comune divisore (MCD) di due o più numeri, con la scomposizione in fattori primi e tutti i passaggi spiegati.',
		category: 'numeri',
		lessons: ['high_school/math/numeri-naturali/numeri-naturali-mcm-mcd'],
		related: ['calcolo-mcm', 'calcolo-percentuale']
	}
];

export const toolBySlug = (slug: string): ToolMeta | undefined => TOOLS.find((t) => t.slug === slug);

export const toolsByCategory = (): [ToolCategory, ToolMeta[]][] => {
	const groups = new Map<ToolCategory, ToolMeta[]>();
	for (const t of TOOLS) groups.set(t.category, [...(groups.get(t.category) ?? []), t]);
	return [...groups];
};
