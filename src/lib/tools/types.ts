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
 * How a result and its steps are written, following the guidelines for students with DSA (dyslexia, dyscalculia) and
 * attention disorders: vault/Prodotti/Studenti/Calcolatori e convertitori.md, "Leggibilità". Text fields are Italian
 * prose with short inline `$…$` formulas; calculations go in `math`, one line each, never inline in a sentence.
 */

/** One line of the answer: what it is, in words, and its value. "Minimo comune multiplo" → "$36$". */
export interface ResultRow {
	label: string;
	/** The value, a formula or prose with formulas, with its unit: "$25\pi \text{ cm}^2 \approx 78{,}5398 \text{ cm}^2$". */
	value: string;
}

/**
 * One step of the working: a single transformation. `say` tells what to do in one short imperative sentence; `math`
 * holds the calculation, one line per item, each set on its own line and never broken; `table` holds a list of values
 * (never a comma-separated run); `then` states what the step concludes. In `math`, `\hl{…}` marks what changes in
 * this step (tinted and underlined, so colour is never the only signal).
 */
export interface Step {
	say: string;
	math?: string[];
	table?: { head?: string[]; rows: string[][] };
	then?: string;
	/** The part of the working this step starts (more than five steps are grouped): "Il discriminante". */
	group?: string;
}

/** What a tool returns. */
export type Outcome =
	| {
			ok: true;
			/** The answer, one row per value, with a label in words. */
			rows: ResultRow[];
			/** The answer as plain text, for the copy button: "36", "12,5 %". */
			copy: string;
			steps: Step[];
	  }
	| { ok: false; error: string };

export const fail = (error: string): Outcome => ({ ok: false, error });
