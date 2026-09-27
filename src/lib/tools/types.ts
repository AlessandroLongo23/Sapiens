/**
 * The free calculators and converters (vault/Prodotti/Studenti/Calcolatori e convertitori.md). Each tool is a pure
 * function from its inputs to an Outcome, run on the server for the example the page opens with and in the browser
 * as the student types; a client component draws its inputs, and a markdown article under it explains the method.
 */

export type ToolCategory = 'numeri' | 'algebra' | 'geometria' | 'statistica' | 'trigonometria' | 'conversioni' | 'informatica' | 'scuola';

export const CATEGORY_NAMES: Record<ToolCategory, string> = {
	numeri: 'Numeri e aritmetica',
	algebra: 'Algebra ed equazioni',
	geometria: 'Geometria',
	statistica: 'Statistica',
	trigonometria: 'Trigonometria',
	conversioni: 'Conversioni di unità',
	informatica: 'Informatica',
	scuola: 'Vita scolastica'
};

export interface ToolMeta {
	/** Last segment of the address, with the words people search: `calcolo-mcm`. */
	slug: string;
	/** The page title and h1: "Calcolo del mcm". */
	title: string;
	/** One line under the title. */
	lead: string;
	/** Meta description, under 160 characters. */
	description: string;
	category: ToolCategory;
	/** Lessons on the same topic, by database path (`high_school/math/...`): the "Impara" and "Esercitati" links. */
	lessons?: string[];
	/** Other tools to link at the bottom, by slug. */
	related?: string[];
}

/**
 * What a tool returns. Text fields are Italian prose with inline `$…$` formulas (and `$$…$$` for a formula on its
 * own line), typeset by `mathText`.
 */
export type Outcome =
	| {
			ok: true;
			/** The answer, set large: prose with formulas, usually one formula. */
			result: string;
			/** The answer as plain text, for the copy button: "36", "12,5 %". */
			copy: string;
			/** How to get there, one step per item. */
			steps: string[];
	  }
	| { ok: false; error: string };

export const fail = (error: string): Outcome => ({ ok: false, error });
