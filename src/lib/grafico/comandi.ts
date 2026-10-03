import { canMeet, intersections, tangents, type Build, type Geo } from './geometria';

/**
 * The words of the plotter (vault/Idee/Elenco dei comandi e completamento nel plotter.md): one list for what a
 * formula can name. A function with a notation of its own (sin, the absolute value), a formula with holes to fill
 * (a function in pieces, an integral), an object of geometry made from others (a line through two points). The
 * list gives the proposals while a formula is typed, what a word becomes, and the guide of each word.
 *
 * A word enters the list when the school programme has it and what it gives is drawn on the plane, or read on it as
 * a number. The names are Italian, and the arguments are separated by a semicolon, since the comma is the decimal one.
 */

export type CommandGroup = 'funzione' | 'lettera' | 'scrittura' | 'oggetto';

export interface Command {
	/** The word typed in a formula. */
	word: string;
	/** Other words for the same thing: "sen" for the sine, "tg" for the tangent. */
	also?: string[];
	title: string;
	group: CommandGroup;
	/** How it is written, one line for each way: "retta(punto; punto)". */
	uses: string[];
	about: string;
	/** What choosing it writes, in MathLive's notation: #? is a hole. */
	insert: string;
	/** What the word alone becomes when the formula goes on after it: "sin" followed by x is \sin x. */
	bare?: string;
	/** The tool of the bar that makes the same object with clicks: its film shows the object being made. */
	tool?: string;
}

const fn = (word: string, title: string, about: string, more: Partial<Command> = {}): Command => ({ word, title, group: 'funzione', uses: [`${word}(x)`], about, insert: `\\${word}\\left(#?\\right)`, bare: `\\${word}`, ...more });
const named = (word: string, title: string, uses: string, about: string, holes = 2): Command => ({ word, title, group: 'funzione', uses: [uses], about, insert: `\\operatorname{${word}}\\left(${Array(holes).fill('#?').join(';')}\\right)` });
const greek = (word: string, sign: string): Command => ({ word, title: `Lettera ${sign}`, group: 'lettera', uses: [sign], about: 'Una lettera greca: un parametro con il suo cursore.', insert: `\\${word}`, bare: `\\${word}` });
const object = (word: string, title: string, tool: string, uses: string[], about: string, holes = 2, also?: string[]): Command => ({ word, title, group: 'oggetto', uses, about, insert: `\\operatorname{${word}}\\left(${Array(holes).fill('#?').join(';')}\\right)`, tool, ...(also ? { also } : {}) });

export const COMMANDS: Command[] = [
	// ---- functions with a notation of their own
	fn('sin', 'Seno', 'Il seno di un angolo.', { also: ['sen'] }),
	fn('cos', 'Coseno', 'Il coseno di un angolo.'),
	fn('tan', 'Tangente (funzione)', 'La tangente di un angolo: seno diviso coseno.', { also: ['tg'], uses: ['tg(x)'] }),
	fn('cot', 'Cotangente', 'Coseno diviso seno.', { also: ['cotg', 'ctg'], uses: ['cotg(x)'] }),
	fn('sec', 'Secante', 'Uno diviso il coseno.'),
	fn('csc', 'Cosecante', 'Uno diviso il seno.'),
	fn('arcsin', 'Arcoseno', 'L’angolo che ha quel seno, tra −90° e 90°.', { also: ['arcsen'] }),
	fn('arccos', 'Arcocoseno', 'L’angolo che ha quel coseno, tra 0° e 180°.'),
	fn('arctan', 'Arcotangente', 'L’angolo che ha quella tangente, tra −90° e 90°.', { also: ['arctg'] }),
	fn('sinh', 'Seno iperbolico', 'Metà di eˣ − e⁻ˣ.'),
	fn('cosh', 'Coseno iperbolico', 'Metà di eˣ + e⁻ˣ: la curva di una catena appesa.'),
	fn('tanh', 'Tangente iperbolica', 'Seno iperbolico diviso coseno iperbolico.'),
	fn('ln', 'Logaritmo naturale', 'Il logaritmo in base e.'),
	fn('log', 'Logaritmo in base 10', 'Senza la base scritta, il logaritmo è in base dieci.'),
	{ word: 'logbase', title: 'Logaritmo in base a', group: 'funzione', uses: ['logₐ(x)'], about: 'La base va in basso, dopo log.', insert: '\\log_{#?}\\left(#?\\right)' },
	fn('exp', 'Esponenziale', 'e elevato a x.', { also: ['esponenziale'] }),
	{ word: 'radice', also: ['sqrt'], title: 'Radice quadrata', group: 'funzione', uses: ['√x'], about: 'Per una radice cubica o di un altro indice c’è il tasto della tastiera di Sapiens.', insert: '\\sqrt{#?}' },
	{ word: 'abs', also: ['assoluto', 'modulo'], title: 'Valore assoluto', group: 'funzione', uses: ['|x|'], about: 'La distanza di un numero da zero.', insert: '\\left|#?\\right|' },
	{ word: 'intera', also: ['floor'], title: 'Parte intera', group: 'funzione', uses: ['⌊x⌋'], about: 'Il più grande intero che non supera x: la funzione a gradini.', insert: '\\lfloor #?\\rfloor' },
	named('arrotonda', 'Arrotonda', 'arrotonda(x)', 'L’intero più vicino: 2,5 diventa 3.', 1),
	{ word: 'max', also: ['massimo'], title: 'Massimo', group: 'funzione', uses: ['max(a; b)'], about: 'Il più grande tra due o più numeri.', insert: '\\max\\left(#?;#?\\right)' },
	{ word: 'min', also: ['minimo'], title: 'Minimo', group: 'funzione', uses: ['min(a; b)'], about: 'Il più piccolo tra due o più numeri.', insert: '\\min\\left(#?;#?\\right)' },
	named('resto', 'Resto della divisione', 'resto(a; b)', 'Quello che avanza dividendo a per b: resto(7; 3) è 1.'),
	named('mcd', 'Massimo comune divisore', 'mcd(a; b)', 'Tra due o più numeri interi.'),
	named('mcm', 'Minimo comune multiplo', 'mcm(a; b)', 'Tra due o più numeri interi.'),
	named('binomiale', 'Coefficiente binomiale', 'binomiale(n; k)', 'In quanti modi si scelgono k oggetti tra n.'),
	{ word: 'fattoriale', title: 'Fattoriale', group: 'funzione', uses: ['n!'], about: 'Il prodotto degli interi da 1 a n.', insert: '#?!' },

	// ---- letters and numbers with a name
	{ word: 'pi', also: ['pigreco'], title: 'Pi greco', group: 'lettera', uses: ['π'], about: 'Il rapporto tra una circonferenza e il suo diametro: 3,14159…', insert: '\\pi', bare: '\\pi' },
	greek('theta', 'θ'),
	greek('alpha', 'α'),
	greek('beta', 'β'),
	greek('gamma', 'γ'),
	greek('delta', 'δ'),
	greek('lambda', 'λ'),
	greek('mu', 'μ'),
	greek('rho', 'ρ'),
	greek('sigma', 'σ'),
	greek('tau', 'τ'),
	greek('phi', 'φ'),
	greek('omega', 'ω'),
	{ word: 'infinito', also: ['inf'], title: 'Infinito', group: 'lettera', uses: ['∞'], about: 'Si scrive sopra una somma o un prodotto che non finisce.', insert: '\\infty', bare: '\\infty' },

	// ---- formulas with holes to fill
	{ word: 'tratti', title: 'Funzione a tratti', group: 'scrittura', uses: ['{ valore, condizione'], about: 'Un valore e la sua condizione per riga. Invio aggiunge una riga.', insert: '\\begin{cases}#? & #?\\\\ #? & #?\\end{cases}' },
	{ word: 'sistema', title: 'Sistema di disequazioni', group: 'scrittura', uses: ['{ disequazione'], about: 'Una disequazione per riga: si colora dove valgono tutte.', insert: '\\begin{cases}#?\\\\ #?\\end{cases}' },
	{ word: 'somma', also: ['sommatoria', 'sum'], title: 'Somma', group: 'scrittura', uses: ['Σ da n = 1 a N'], about: 'L’indice parte dal numero sotto e arriva a quello sopra.', insert: '\\sum_{n=1}^{#?}#?' },
	{ word: 'prodotto', also: ['produttoria', 'prod'], title: 'Prodotto', group: 'scrittura', uses: ['Π da n = 1 a N'], about: 'Come la somma, con i fattori.', insert: '\\prod_{n=1}^{#?}#?' },
	{ word: 'integrale', also: ['int'], title: 'Integrale', group: 'scrittura', uses: ['∫ da a a b'], about: 'Con i due estremi: con la x sopra è una funzione integrale.', insert: '\\int_{0}^{#?}#?\\,dx' },
	{ word: 'derivata', title: 'Derivata', group: 'scrittura', uses: ['d/dx ( … )'], about: 'Di una formula. Per una funzione con un nome basta l’apice: f′(x).', insert: '\\frac{d}{dx}\\left(#?\\right)' },
	{ word: 'successione', title: 'Successione per ricorrenza', group: 'scrittura', uses: ['aₙ₊₁ = …'], about: 'Ogni termine dal precedente. Il valore da cui parte va in un’altra riga: a₀ = 1.', insert: 'a_{n+1}=#?' },

	// ---- objects of geometry, made from the points and the lines of the other rows
	object('retta', 'Retta per due punti', 'line', ['retta(A; B)'], 'La retta che passa per due punti. La riga ne mostra l’equazione.'),
	object('segmento', 'Segmento', 'segment', ['segmento(A; B)'], 'Tra due punti. La riga ne dà la lunghezza.'),
	object('semiretta', 'Semiretta', 'ray', ['semiretta(A; B)'], 'Parte dal primo punto e passa per il secondo.'),
	object('vettore', 'Vettore', 'vector', ['vettore(A; B)'], 'Dal primo punto al secondo: componenti e modulo.'),
	object('parallela', 'Retta parallela', 'parallel', ['parallela(r; A)'], 'La parallela a una retta che passa per un punto.'),
	object('perpendicolare', 'Retta perpendicolare', 'perpendicular', ['perpendicolare(r; A)'], 'La perpendicolare a una retta che passa per un punto.'),
	object('asse', 'Asse del segmento', 'bisector', ['asse(A; B)'], 'La perpendicolare per il punto medio di due punti.'),
	object('bisettrice', 'Bisettrice', 'anglebisector', ['bisettrice(A; B; C)', 'bisettrice(r; s)'], 'Dell’angolo di tre punti, con il vertice per secondo. Di due rette le bisettrici sono due.', 3),
	object('tangente', 'Rette tangenti', 'tangent', ['tangente(γ; A)', 'tangente(f; A)'], 'A una circonferenza, una conica o il grafico di una funzione, per un punto. Da un punto esterno sono due.'),
	object('circonferenza', 'Circonferenza', 'circle', ['circonferenza(C; A)', 'circonferenza(C; 3)', 'circonferenza(A; B; C)'], 'Dal centro e un punto, dal centro e il raggio, oppure per tre punti.', 2, ['cerchio']),
	object('compasso', 'Compasso', 'compass', ['compasso(A; B; C)'], 'La circonferenza di centro C con il raggio lungo quanto AB.', 3),
	object('puntomedio', 'Punto medio', 'midpoint', ['puntomedio(A; B)'], 'Il punto a metà tra due punti.', 2, ['medio']),
	object('intersezione', 'Intersezione', 'meet', ['intersezione(r; s)'], 'Tutti i punti in comune tra due rette, circonferenze o coniche.'),
	object('baricentro', 'Baricentro', 'centre', ['baricentro(A; B; C)'], 'Dove si incontrano le mediane di un triangolo.', 3),
	object('circocentro', 'Circocentro', 'centre', ['circocentro(A; B; C)'], 'Dove si incontrano gli assi dei lati: il centro della circonferenza circoscritta.', 3),
	object('incentro', 'Incentro', 'centre', ['incentro(A; B; C)'], 'Dove si incontrano le bisettrici: il centro della circonferenza inscritta.', 3),
	object('ortocentro', 'Ortocentro', 'centre', ['ortocentro(A; B; C)'], 'Dove si incontrano le altezze di un triangolo.', 3),
	object('poligono', 'Poligono', 'polygon', ['poligono(A; B; C; …)'], 'Per i suoi vertici, in ordine. La riga ne dà l’area e il perimetro.', 3, ['triangolo']),
	object('distanza', 'Distanza', 'distance', ['distanza(A; B)', 'distanza(A; r)'], 'Tra due punti, tra un punto e una retta, o tra due rette parallele.'),
	object('angolo', 'Angolo', 'angle', ['angolo(A; B; C)', 'angolo(r; s)'], 'Di tre punti, con il vertice per secondo, oppure tra due rette.', 3),
	object('pendenza', 'Pendenza', 'slope', ['pendenza(r)'], 'Di quanto sale una retta quando la x cresce di uno.', 1)
];

const wordsOf = (c: Command) => [c.word, ...(c.also ?? [])];
const BY_WORD = new Map(COMMANDS.flatMap((c) => wordsOf(c).map((w) => [w, c] as const)));
/** The command a word names, in full. */
export const commandOf = (word: string): Command | undefined => BY_WORD.get(word);

/** The commands with a word that begins with these letters. */
const beginning = (letters: string) => COMMANDS.filter((c) => wordsOf(c).some((w) => w.startsWith(letters)));

/** The fewest letters that bring up proposals: a single letter is a parameter. */
const MIN_LETTERS = 2;

export interface Tracked {
	/** The letters at the end of the run that are the beginning of a word. */
	word: string;
	/** The commands they may become, the nearest first. */
	found: Command[];
	/** The command the letters are the whole word of. */
	exact?: Command;
}

/**
 * The word being typed at the end of a run of letters. The letters before it are parameters ("ksin" is k times the
 * sine): the word is the longest end of the run that begins a command's word. Shorter than two letters, nothing.
 */
export function track(run: string, limit = 6): Tracked | null {
	const letters = run.toLowerCase() === run ? run : '';
	for (let start = 0; start <= letters.length - MIN_LETTERS; start++) {
		const word = letters.slice(start);
		const byWord = beginning(word);
		// only the whole run is looked for in the titles: "ass" finds the absolute value ("valore assoluto")
		const byTitle = start === 0 && word.length >= 3 ? COMMANDS.filter((c) => !byWord.includes(c) && c.title.toLowerCase().split(/[^a-zà-ù]+/).some((t) => t.startsWith(word))) : [];
		if (!byWord.length && !byTitle.length) continue;
		const exact = BY_WORD.get(word);
		// the word itself first, then the shortest words
		const found = [...byWord].sort((a, b) => Number(b === exact) - Number(a === exact) || a.word.length - b.word.length);
		return { word, found: [...found, ...byTitle].slice(0, limit), exact };
	}
	return null;
}

/** Letters at the end of what is written that give way to a formula. */
export interface Settled {
	/** How many letters before the cursor are replaced. */
	letters: number;
	/** What is written in their place, in MathLive's notation. */
	insert: string;
	/** Whether the key that asked for it has done its work: an opening bracket after "retta" is already in what is written. */
	swallow?: boolean;
}

const isBare = (c: Command | undefined): c is Command & { bare: string } => !!c?.bare;

/**
 * What the letters before the cursor become by themselves, once a letter has been typed. A whole word that begins
 * no other becomes its formula at once ("sen", "tratti"). A function's name that the next letter does not continue
 * is that function, and the letter stays after it ("sinx" is sin x, since no word begins with "sinx").
 */
export function settleTyped(run: string): Settled | null {
	const now = track(run);
	if (now?.exact && beginning(now.word).length === 1) return { letters: now.word.length, insert: now.exact.bare ?? now.exact.insert };
	if (run.length < 3) return null;
	const before = track(run.slice(0, -1));
	const last = run[run.length - 1];
	if (isBare(before?.exact) && !beginning(before.word + last).length) return { letters: before.word.length + 1, insert: `${before.exact.bare} ${last}` };
	return null;
}

/**
 * What the letters before the cursor become when a key that is not a letter follows them: a bracket, a sign, a
 * space, or the cursor leaving the field ('leave'). A function's name is that function, and the key then does its
 * work. A word that writes its own brackets takes the place of an opening bracket, or of a space.
 */
export function settleKey(run: string, key: string): Settled | null {
	const now = track(run);
	const exact = now?.exact;
	if (!exact) return null;
	const letters = now.word.length;
	if (key === ' ') return { letters, insert: exact.insert, swallow: true };
	if (exact.bare) return { letters, insert: exact.bare };
	if (key === '(' && exact.insert.includes('\\left(')) return { letters, insert: exact.insert, swallow: true };
	return null;
}

// ---------------------------------------------------------------- objects of geometry, written

/** The kinds of name a new object can take: see `freshName` in components/grafico/geometry.ts. */
type NameKind = 'point' | 'line' | 'circle' | 'angle';

/** An argument of a written command: a row of the plotter by its name, or a number. */
export type CommandArg = { id: number; name: string } | { value: number };

/** A row a written command adds: the build, and the kind of name it takes. */
export interface Made {
	build: Build;
	name?: NameKind;
	/** The letter it usually has: M for a midpoint, G for a centroid. */
	wish?: string;
	/** Whether the name is written beside the object on the plane. */
	label?: boolean;
}

export interface WrittenCommand {
	/** The name given to what is made: "r" in r = retta(A; B). */
	name?: string;
	command: Command;
	/** The arguments as written, in LaTeX. */
	args: string[];
}

const NAME = String.raw`[A-Za-z](?:_(?:\d|\{\d+\}))?|\\[a-z]+(?:_(?:\d|\{\d+\}))?`;
const WRITTEN = new RegExp(String.raw`^(?:(${NAME})=)?(?:\\operatorname\{([a-z]+)\}|\\mathrm\{([a-z]+)\}|([a-z]{4,}))\\left\((.*)\\right\)$`);

/** One name for a row however it is written: A_{1} and A_1, with no spaces. */
export const tidyName = (latex: string) =>
	latex
		.replace(/\\[,;! ]|\s/g, '')
		.replace(/_\{(\d)\}/g, '_$1')
		// MathLive gives a name written by the proposals back as \operatorname{\mathrm{retta}}
		.replace(/\\operatorname\{\\mathrm\{([a-z]+)\}\}/g, '\\operatorname{$1}');

const LABELLED = new RegExp(String.raw`^(${NAME})(?::|\colon)(.+)$`);

/**
 * A formula with a name before a colon, "r: y = 2x + 1", as GeoGebra writes it: the name is the object's, for the
 * plane and for a command (parallela(r; A)). Only before an equation or an inequality: a : b alone is a division.
 * `formula` is what the plotter reads. Where the rest is y = … with no other y, it is the function of that name,
 * r(x) = 2x + 1, which the other formulas can use; anywhere else it is the rest as it stands, and the name is a label.
 */
export function readLabel(latex: string): { name: string; formula: string; function: boolean } | null {
	const m = LABELLED.exec(latex.replace(/\\[,;! ]|\s/g, ''));
	if (!m || !/=|<|>|\\le|\\ge|\\ne/.test(m[2])) return null;
	const name = tidyName(m[1]);
	const explicit = /^y=(.+)$/.exec(m[2]);
	// x, y, t and e are the plotter's own letters: they cannot be a function's name
	const usable = /^[a-zA-Z]$/.test(name) && !'xyte'.includes(name);
	if (explicit && usable && !/y/.test(explicit[1].replace(/\\[a-zA-Z]+/g, ''))) return { name, formula: `${name}\\left(x\\right)=${explicit[1]}`, function: true };
	return { name, formula: m[2], function: false };
}

/** A row that is a command of geometry, "r = retta(A; B)", taken apart. Null for any other formula. */
export function readWritten(latex: string): WrittenCommand | null {
	const m = WRITTEN.exec(tidyName(latex));
	if (!m) return null;
	const command = BY_WORD.get(m[2] ?? m[3] ?? m[4]);
	if (command?.group !== 'oggetto') return null;
	// the semicolons outside any bracket separate the arguments
	const args: string[] = [];
	let depth = 0;
	let from = 0;
	const inside = m[5];
	for (let i = 0; i <= inside.length; i++) {
		const ch = inside[i];
		if (ch === '{' || ch === '(') depth++;
		else if (ch === '}' || ch === ')') depth--;
		else if (i === inside.length || (ch === ';' && depth === 0)) {
			args.push(inside.slice(from, i));
			from = i + 1;
		}
	}
	return { name: m[1], command, args };
}

const CENTRES = ['baricentro', 'circocentro', 'incentro', 'ortocentro'];
const CENTRE_LETTERS = ['G', 'O', 'I', 'H'];
const MAX_VERTICES = 12;

/**
 * The rows a written command makes, or the sentence that says what it needs. `get` gives a row as an object of
 * geometry: the kinds of the arguments choose among the ways of a command (a circle from its centre and a point,
 * from its centre and its radius, through three points).
 */
export function makeWritten(word: string, args: CommandArg[], get: (id: number) => Geo | undefined): Made[] | string {
	const command = BY_WORD.get(word);
	if (!command) return 'Questo comando non c’è.';
	const kind = (a: CommandArg) => {
		if ('value' in a) return 'number';
		const geo = get(a.id);
		return geo?.kind === 'point' ? 'point' : geo?.kind === 'line' ? 'line' : geo?.kind === 'conic' || geo?.kind === 'curve' ? 'curve' : 'other';
	};
	const kinds = args.map(kind).join(' ');
	const ids = args.map((a) => ('id' in a ? a.id : -1));
	const [a, b, c] = ids;
	const needs = `Scrivi ${command.uses.join(' oppure ')}.`;
	const points = (n: number) => kinds === Array(n).fill('point').join(' ');
	if (new Set(ids.filter((id) => id >= 0)).size !== ids.filter((id) => id >= 0).length) return 'Servono oggetti diversi tra loro.';

	switch (command.word) {
		case 'retta':
		case 'semiretta':
			return points(2) ? [{ build: { type: command.word === 'retta' ? 'line' : 'ray', of: [a, b] }, name: 'line', label: true }] : needs;
		case 'segmento':
		case 'vettore':
			return points(2) ? [{ build: { type: command.word === 'segmento' ? 'segment' : 'vector', of: [a, b] } }] : needs;
		case 'asse':
			return points(2) ? [{ build: { type: 'bisector', of: [a, b] }, name: 'line', label: true }] : needs;
		case 'puntomedio':
			return points(2) ? [{ build: { type: 'midpoint', of: [a, b] }, name: 'point', wish: 'M', label: true }] : needs;
		case 'parallela':
		case 'perpendicolare': {
			const type = command.word === 'parallela' ? 'parallel' : 'perpendicular';
			if (kinds === 'line point') return [{ build: { type, of: [a, b] }, name: 'line', label: true }];
			if (kinds === 'point line') return [{ build: { type, of: [b, a] }, name: 'line', label: true }];
			return needs;
		}
		case 'bisettrice':
			if (points(3)) return [{ build: { type: 'anglebisector', of: [a, b, c] }, name: 'line', label: true }];
			if (kinds === 'line line') return [0, 1].map((index) => ({ build: { type: 'anglebisector', of: [a, b], index }, name: 'line', label: true }));
			return needs;
		case 'angolo':
			if (points(3)) return [{ build: { type: 'angle', of: [a, b, c] }, name: 'angle' }];
			if (kinds === 'line line') return [{ build: { type: 'angle', of: [a, b] }, name: 'angle' }];
			return needs;
		case 'tangente': {
			const [point, curve] = kinds === 'curve point' ? [b, a] : kinds === 'point curve' ? [a, b] : [-1, -1];
			if (point < 0) return needs;
			const count = tangents(get(point) as { x: number; y: number }, get(curve)!).length;
			if (!count) return 'Da questo punto non partono tangenti: è dentro la curva.';
			return Array.from({ length: count }, (_, index) => ({ build: { type: 'tangent', of: [point, curve], index }, name: 'line', label: true }));
		}
		case 'circonferenza':
			if (points(2)) return [{ build: { type: 'circle', of: [a, b] }, name: 'circle', label: true }];
			if (points(3)) return [{ build: { type: 'circle3', of: [a, b, c] }, name: 'circle', label: true }];
			if (kinds === 'point number') {
				const radius = (args[1] as { value: number }).value;
				return radius > 0 ? [{ build: { type: 'circler', of: [a], at: Number(radius.toPrecision(10)) }, name: 'circle', label: true }] : 'Il raggio è un numero maggiore di zero.';
			}
			return needs;
		case 'compasso':
			return points(3) ? [{ build: { type: 'compass', of: [a, b, c] }, name: 'circle', label: true }] : needs;
		case 'baricentro':
		case 'circocentro':
		case 'incentro':
		case 'ortocentro': {
			const index = CENTRES.indexOf(command.word);
			return points(3) ? [{ build: { type: 'centre', of: [a, b, c], index }, name: 'point', wish: CENTRE_LETTERS[index], label: true }] : needs;
		}
		case 'poligono':
			if (args.length > MAX_VERTICES) return `Un poligono ha al più ${MAX_VERTICES} vertici.`;
			return args.length >= 3 && points(args.length) ? [{ build: { type: 'polygon', of: ids } }] : needs;
		case 'distanza':
			return args.length === 2 && args.map(kind).every((k) => k === 'point' || k === 'line') ? [{ build: { type: 'distance', of: [a, b] } }] : needs;
		case 'pendenza':
			return kinds === 'line' ? [{ build: { type: 'slope', of: [a] } }] : needs;
		case 'intersezione': {
			if (args.length !== 2 || ids.some((id) => id < 0)) return needs;
			const [g, h] = [get(a)!, get(b)!];
			if (!canMeet(g, h)) return 'Per ora le intersezioni si trovano tra rette, circonferenze e coniche.';
			const common = intersections(g, h);
			if (!common.length) return 'I due oggetti non si incontrano.';
			// a tangent gives the same point twice
			return common.flatMap((at, index): Made[] => (index && Math.hypot(at.x - common[0].x, at.y - common[0].y) < 1e-9 ? [] : [{ build: { type: 'meet', of: [a, b], index }, name: 'point', label: true }]));
		}
	}
	return needs;
}
