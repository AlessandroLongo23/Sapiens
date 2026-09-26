import { plainTitle } from '@/lib/seo/slug';

/**
 * Text handling shared by the search index (built on the server) and the
 * ranking (run in the browser on every keystroke): the same folding and
 * stemming on both sides, so a word in a lesson and a word typed by a student
 * meet in the same form.
 */

const SETS: Record<string, string> = { ℕ: ' naturali ', ℤ: ' interi ', ℚ: ' razionali ', ℝ: ' reali ', ℂ: ' complessi ' };

/** Lowercase, accents folded, LaTeX resolved to words, everything else a space. */
export function fold(text: string): string {
	return plainTitle(text)
		.replace(/[ℕℤℚℝℂ]/g, (c) => SETS[c])
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.trim();
}

/**
 * Words that carry no subject: articles, prepositions and the way students
 * phrase a question ("non ho capito come si calcola…"). What is left of
 * "non ho capito le equazioni di secondo grado" is "equazioni secondo grado".
 */
const STOP = new Set(
	`il lo la i gli le l un uno una un di d a ad da in con su per tra fra e ed o od ma che chi cosa cos come si se non ne ci vi mi ti me te
	del dello della dei degli delle dell al allo alla ai agli alle all dal dallo dalla dai dagli dalle dall nel nello nella nei negli nelle nell
	sul sullo sulla sui sugli sulle sull col coi è e sono ho hai ha abbiamo hanno era questo questa questi queste quello quella quale quali
	quando dove perche qual quanto quanti molto poco piu meno anche ancora gia solo proprio tutto tutti
	capito capisco capire capiamo spiega spiegami spiegare spiegazione aiuto aiutami help serve servono devo posso voglio vorrei sapere
	calcola calcolare calcolo calcolano fare faccio fa fanno si trova trovare trovo risolvere risolve risolvo studiare ripassare ripasso
	cerco cercare lezione lezioni argomento teoria esempio esempi funziona funzionano significa vuol dire`.split(/\s+/)
);

/**
 * A light Italian stemmer: the gender and number endings go, so "equazione"
 * and "equazioni", "polinomio" and "polinomi" become one word. Short words
 * are left alone ("mcm", "retta" would lose too much).
 */
export function stem(word: string): string {
	if (word.length < 5 || /^\d+$/.test(word)) return word;
	let w = word.replace(/(?:ioni|ione)$/, 'ion').replace(/[aeiou]$/, '');
	if (w.length >= 5 && /i$/.test(w)) w = w.slice(0, -1);
	return w;
}

/** The meaningful words of a text, stemmed, in order. */
export function terms(text: string): string[] {
	return fold(text)
		.split(' ')
		.filter((w) => w && !STOP.has(w))
		.map(stem);
}

/**
 * Abbreviations and school shorthand, written out. A query word listed here
 * matches either itself or the whole expansion (every word of it).
 */
const SYNONYMS: Record<string, string> = {
	mcm: 'minimo comune multiplo',
	mcd: 'massimo comune divisore',
	eq: 'equazioni',
	equaz: 'equazioni',
	diseq: 'disequazioni',
	sist: 'sistemi',
	pol: 'polinomi',
	scomp: 'scomposizione',
	fraz: 'frazioni'
};

/** One word of the query: itself, or its written-out alternatives (each a list of stems that must all appear). */
export interface QueryTerm {
	word: string;
	alternatives: string[][];
}

export function queryTerms(query: string): QueryTerm[] {
	const words = fold(query)
		.split(' ')
		.filter((w) => w && !STOP.has(w));
	return words.map((word) => {
		const alternatives = [[stem(word)]];
		const expansion = SYNONYMS[word];
		if (expansion && expansion !== word) alternatives.push(terms(expansion));
		return { word, alternatives };
	});
}

/** Damerau-Levenshtein distance, stopping early once it exceeds `max`. */
export function distance(a: string, b: string, max: number): number {
	if (Math.abs(a.length - b.length) > max) return max + 1;
	const rows: number[][] = [];
	for (let i = 0; i <= a.length; i++) rows.push([i]);
	for (let j = 1; j <= b.length; j++) rows[0][j] = j;
	for (let i = 1; i <= a.length; i++) {
		let best = Infinity;
		for (let j = 1; j <= b.length; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			let d = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost);
			if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d = Math.min(d, rows[i - 2][j - 2] + 1);
			rows[i][j] = d;
			if (d < best) best = d;
		}
		if (best > max) return max + 1;
	}
	return rows[a.length][b.length];
}
