/**
 * Prime definizioni sugli insiemi. Spec: specs/exercises/prime-definizioni.md
 *
 * Six levels in the order of the lesson: well-defined collections, ∈ and ∉ with a listed set,
 * membership in ℕ, ℤ, ℚ (0 is natural), the empty set (and why {0} is not empty), cardinality,
 * finite and infinite sets. All but the cardinality are born as multiple choice with four options.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, NumberAnswer, Rng, Sample } from '../types';
import { gcd } from '../rational';
import {
	type El,
	type Stmt,
	assembleChoice,
	evalStmt,
	has,
	norm,
	numberChoice,
	pickDistinct,
	range,
	setTex,
	shuffle,
	stmtOption,
	stmtTex,
	textBlock,
	tokEl,
	tokTex,
} from '../insiemi';

export const ID = 'prime-definizioni';
const PROMPT = 'Scegli la risposta corretta.';

// ---------------------------------------------------------------------------
// Level 1: collections that are sets and collections that are not

interface Coll {
	id: string;
	text: string;
	why: string;
}

// ---------------------------------------------------------------------------
// Verbal options that fit the phone

/**
 * Prose with inline math between dollars as one LaTeX line: `i numeri naturali $x$ tali che $x + 1 = 1$`
 * becomes `\text{i numeri naturali } x \text{ tali che } x + 1 = 1`. A ` | ` in the prose is where the
 * option breaks (see optionTex); on one line it is a space.
 */
function lineTex(prose: string): string {
	return prose
		.replace(/ \| /g, ' ')
		.split(/(\$[^$]*\$)/)
		.filter(Boolean)
		.map((part) => (part.startsWith('$') ? part.slice(1, -1) : `\\text{${part}}`))
		.join(' ');
}

/**
 * An answer option from prose. An answer button leaves 252 px at 16 px: the descriptions wider than that
 * carry a ` | ` where they break, and go on two lines of a gathered (`\text{I ragazzi simpatici}` over
 * `\text{della tua classe}`); the others stay on one line.
 */
function optionTex(prose: string): string {
	const parts = prose.split(' | ');
	return parts.length === 1 ? lineTex(prose) : `\\begin{gathered} ${parts.map(lineTex).join(' \\\\ ')} \\end{gathered}`;
}

/** The collection as a sentence, without the break. */
const plain = (text: string) => text.replace(' | ', ' ');

/** Well defined: for any object the answer "does it belong?" is yes or no, for everybody. A ` | ` marks the break of a long option. */
export const WELL_DEFINED: Coll[] = [
	{
		id: 'giorni',
		text: 'I giorni della settimana',
		why: 'lunedì ne fa parte, gennaio no',
	},
	{
		id: 'vocali',
		text: "Le vocali dell'alfabeto italiano",
		why: 'sono a, e, i, o, u',
	},
	{
		id: 'mesi30',
		text: "I mesi dell'anno | che hanno 30 giorni",
		why: 'sono aprile, giugno, settembre e novembre',
	},
	{
		id: 'nat10',
		text: 'I numeri naturali minori di 10',
		why: 'sono 0, 1, 2, ..., 9',
	},
	{
		id: 'div24',
		text: 'I divisori di 24',
		why: 'per ogni numero si controlla se divide 24',
	},
	{
		id: 'mult5',
		text: 'I multipli di 5 minori di 100',
		why: 'per ogni numero si controlla se è multiplo di 5',
	},
	{
		id: 'pari',
		text: 'I numeri pari | compresi tra 7 e 21',
		why: 'sono 8, 10, ..., 20',
	},
	{
		id: 'marzo',
		text: 'Gli studenti della tua classe | nati a marzo',
		why: 'per ogni studente la risposta è sì o no',
	},
	{
		id: 'primi',
		text: 'I numeri primi minori di 30',
		why: 'per ogni numero si controlla se è primo',
	},
	{
		id: 'stagioni',
		text: "Le stagioni dell'anno",
		why: 'sono quattro, e sono sempre quelle',
	},
	{
		id: 'bandiera',
		text: 'I colori della bandiera italiana',
		why: 'sono verde, bianco e rosso',
	},
	{
		id: 'dispari',
		text: 'I numeri dispari minori di 20',
		why: 'sono 1, 3, 5, ..., 19',
	},
];

/** Not well defined: membership is a personal judgement or has no threshold. */
export const NOT_DEFINED: Coll[] = [
	{
		id: 'simpatici',
		text: 'I ragazzi simpatici | della tua classe',
		why: 'essere simpatici è un giudizio personale',
	},
	{
		id: 'grandi',
		text: 'I numeri grandi',
		why: 'nessuno ha stabilito da quale numero in poi un numero è grande',
	},
	{
		id: 'film',
		text: "I film più belli dell'anno",
		why: 'la bellezza di un film è un giudizio personale',
	},
	{
		id: 'citta',
		text: "Le città più belle d'Italia",
		why: 'la bellezza di una città è un giudizio personale',
	},
	{
		id: 'libri',
		text: 'I libri interessanti | della biblioteca',
		why: 'un libro interessante per te può non esserlo per un altro',
	},
	{
		id: 'canzoni',
		text: 'Le canzoni famose',
		why: 'non c’è un criterio per dire quando una canzone è famosa',
	},
	{
		id: 'vicini',
		text: 'I numeri vicini a 100',
		why: 'nessuno ha stabilito quanto deve essere vicino un numero',
	},
	{
		id: 'bravi',
		text: 'Gli studenti bravi in matematica',
		why: 'essere bravi è un giudizio, non un criterio oggettivo',
	},
	{
		id: 'alti',
		text: 'Le persone alte della tua scuola',
		why: 'non c’è una soglia oltre la quale una persona è alta',
	},
	{
		id: 'piccoli',
		text: 'I numeri piccoli',
		why: 'nessuno ha stabilito fino a quale numero un numero è piccolo',
	},
	{
		id: 'facili',
		text: 'Le materie facili',
		why: 'una materia facile per te può essere difficile per un altro',
	},
];

const collById = (id: string) => [...WELL_DEFINED, ...NOT_DEFINED].find((c) => c.id === id);
const collOption = (c: Coll): ChoiceOption => ({
	latex: optionTex(c.text),
	values: [c.id],
});

// ---------------------------------------------------------------------------
// Level 4: sets that may be empty

/** An empty-or-not candidate. Values: ["lt", k], ["eq", a, b], ["btw", n, m], ["lit0"], ["litE"], ["mesi", d]. */
type Cand = string[];

function candElements(c: Cand): El[] {
	const N = range(0, 60);
	switch (c[0]) {
		case 'lt':
			return N.filter((x) => x < Number(c[1]));
		case 'eq':
			return N.filter((x) => x + Number(c[1]) === Number(c[2]));
		case 'btw':
			return N.filter((x) => x > Number(c[1]) && x < Number(c[2]));
		case 'lit0':
			return [0];
		case 'litE':
			return ['vuoto']; // one element, the empty set
		case 'mesi':
			return (
				{
					'30': ['aprile', 'giugno', 'settembre', 'novembre'],
					'31': ['gennaio', 'marzo', 'maggio', 'luglio', 'agosto', 'ottobre', 'dicembre'],
					'32': [],
				}[c[1]] ?? []
			);
		default:
			throw new Error(`${ID}: unknown candidate ${c[0]}`);
	}
}

/** The candidate as prose; `x + a = b` and "maggiori di n e minori di m" are too wide for one line. */
function candProse(c: Cand): string {
	switch (c[0]) {
		case 'lt':
			return `i numeri naturali minori di $${c[1]}$`;
		case 'eq':
			return `i numeri naturali $x$ | tali che $x + ${c[1]} = ${c[2]}$`;
		case 'btw':
			return `i numeri naturali | maggiori di $${c[1]}$ e minori di $${c[2]}$`;
		case 'lit0':
			return '$\\{0\\}$';
		case 'litE':
			return '$\\{\\emptyset\\}$';
		case 'mesi':
			return `i mesi dell'anno con $${c[1]}$ giorni`;
		default:
			throw new Error(`${ID}: unknown candidate ${c[0]}`);
	}
}

function candWhy(c: Cand): string {
	const els = candElements(c);
	switch (c[0]) {
		case 'lt':
			return c[1] === '0' ? `\\text{nessun naturale è minore di } 0\\text{: il più piccolo è } 0` : `\\text{contiene } ${setTex(els)}`;
		case 'eq': {
			const x = Number(c[2]) - Number(c[1]);
			return x < 0 ? `x = ${x} \\text{ non è un numero naturale}` : `x = ${x}\\text{, quindi è } ${setTex(els)}`;
		}
		case 'btw':
			return els.length === 0 ? `\\text{tra } ${c[1]} \\text{ e } ${c[2]} \\text{ non c'è nessun naturale}` : `\\text{contiene } ${setTex(els)}`;
		case 'lit0':
			return `\\{0\\} \\text{ ha un elemento, il numero } 0`;
		case 'litE':
			return `\\{\\emptyset\\} \\text{ ha un elemento, l'insieme vuoto}`;
		case 'mesi':
			return els.length === 0 ? `\\text{nessun mese ha } 32 \\text{ giorni}` : `\\text{ce ne sono } ${els.length}`;
		default:
			return '';
	}
}

// ---------------------------------------------------------------------------
// Level 6: finite and infinite

/** Values: [kind, param?]. */
type Fin = string[];

function finFinite(f: Fin): boolean {
	return ['milione', 'div', 'vuoto', 'min', 'alfabeto', 'multmin', 'parola'].includes(f[0]);
}

/** The set as prose; the four descriptions wider than an answer button carry their break. */
function finProse(f: Fin): string {
	switch (f[0]) {
		case 'pari':
			return 'i numeri naturali pari';
		case 'dispari':
			return 'i numeri naturali dispari';
		case 'mult':
			return `i multipli di $${f[1]}$ in $\\mathbb{N}$`;
		case 'neg':
			return 'i numeri interi negativi';
		case 'magg':
			return `i numeri naturali | maggiori di $${f[1]}$`;
		case 'razio':
			return 'i numeri razionali | compresi tra $0$ e $1$';
		case 'milione':
			return 'i numeri naturali | minori di un milione';
		case 'div':
			return `i divisori di $${f[1]}$`;
		case 'vuoto':
			return '$\\emptyset$';
		case 'min':
			return `i numeri naturali minori di $${f[1]}$`;
		case 'alfabeto':
			return "le lettere dell'alfabeto italiano";
		case 'multmin':
			return `i multipli di $${f[1]}$ minori di $${f[2]}$`;
		case 'parola':
			return `le lettere della parola | “${f[1]}”`;
		default:
			throw new Error(`${ID}: unknown kind ${f[0]}`);
	}
}

function finWhy(f: Fin): string {
	switch (f[0]) {
		case 'pari':
		case 'dispari':
		case 'mult':
		case 'magg':
			return '\\text{dopo ogni elemento ce n’è un altro più grande}';
		case 'neg':
			return '\\text{prima di ogni elemento ce n’è un altro più piccolo}';
		case 'razio':
			return '\\text{tra due frazioni ce n’è sempre un’altra}';
		case 'milione':
			return '\\text{sono 1.000.000, tanti ma finiti}';
		case 'vuoto':
			return '|\\emptyset| = 0';
		case 'alfabeto':
			return '\\text{sono } 21 \\text{ lettere}';
		default:
			return '\\text{si possono contare e si finisce}';
	}
}

const FIN_WORDS = ['scuola', 'quaderno', 'matita', 'lavagna', 'cartella'];

function finCandidates(rng: Rng, finite: boolean): Fin[] {
	if (finite) {
		return shuffle(rng, [
			['milione'],
			['div', String(rng.pick([12, 18, 20, 24, 30, 36, 60]))],
			['vuoto'],
			['min', String(rng.int(5, 50))],
			['alfabeto'],
			['multmin', String(rng.int(2, 9)), String(rng.pick([50, 100, 1000]))],
			['parola', rng.pick(FIN_WORDS)],
		]);
	}
	return shuffle(rng, [['pari'], ['dispari'], ['mult', String(rng.int(2, 9))], ['neg'], ['magg', String(rng.pick([10, 100, 1000]))], ['razio']]);
}

// ---------------------------------------------------------------------------
// Level 5: cardinality

export const WORDS = [
	'matematica',
	'cocco',
	'sasso',
	'casa',
	'banana',
	'ananas',
	'mamma',
	'carrozza',
	'zucchero',
	'pizza',
	'cassetta',
	'rossetto',
	'tetto',
	'gatto',
	'bottiglia',
	'sorella',
	'fratello',
	'telefono',
	'geometria',
	'insieme',
	'parallelo',
	'collana',
	'pallone',
	'montagna',
	'coccodrillo',
	'caramella',
	'ombrello',
	'pomodoro',
	'elettrico',
	'tavolo',
	'anatra',
	'cannella',
	'mattone',
	'arancia',
	'babbo',
];

const letters = (w: string): El[] => norm(w.split(''));

// ---------------------------------------------------------------------------
// Construction

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer | NumberAnswer;
	params: Record<string, unknown>;
}

function statementLevel(rng: Rng, level: 2 | 3): Built | null {
	const ask: 'vera' | 'falsa' = rng.int(0, 1) ? 'vera' : 'falsa';
	const want = ask === 'vera';
	const sets: Record<string, El[]> = {};
	let pool: Stmt[];
	if (level === 2) {
		const useLetters = rng.next() < 0.3;
		const universe: El[] = useLetters ? 'abcdefghilmnoprstuvz'.split('') : range(0, 15);
		const A = norm(pickDistinct(rng, universe, rng.int(4, 6)));
		sets.A = A;
		const outside = universe.filter((x) => !has(A, x));
		// Elements outside A that look like they belong: next to an element of A, or 0.
		const near = outside.filter((x) => typeof x === 'string' || x === 0 || A.some((a) => typeof a === 'number' && Math.abs(a - (x as number)) === 1));
		const outs = shuffle(rng, near.length >= 4 ? near : outside).slice(0, 4);
		pool = [...A, ...outs].flatMap((e): Stmt[] => [
			{ op: 'in', l: tokEl(e), r: 'A' },
			{ op: 'notin', l: tokEl(e), r: 'A' },
		]);
	} else {
		const els = () => {
			const t = rng.int(0, 4);
			if (t === 0) return '0';
			if (t === 1) return String(rng.int(1, 20));
			if (t === 2) return String(-rng.int(1, 20));
			// a reduced fraction that is not an integer
			const d = rng.int(2, 5);
			const p = rng.pick(range(1, 2 * d + 1).filter((k) => gcd(k, d) === 1));
			return `${rng.int(0, 2) ? '' : '-'}${p}/${d}`;
		};
		pool = [];
		for (let i = 0; i < 30; i++)
			pool.push({
				op: rng.int(0, 2) ? 'in' : 'notin',
				l: `e:${els()}`,
				r: rng.pick(['N', 'N', 'Z', 'Q']),
			});
	}
	const right = pool.filter((s) => evalStmt(s, sets) === want);
	const wrong = pool.filter((s) => evalStmt(s, sets) !== want);
	if (right.length === 0 || wrong.length < 3) return null;
	const correct = rng.pick(right);
	// One statement per element, so no two options talk about the same number.
	const usedEls = new Set([correct.l]);
	const distractors: Stmt[] = [];
	for (const s of shuffle(rng, wrong)) {
		if (usedEls.has(s.l)) continue;
		usedEls.add(s.l);
		distractors.push(s);
	}
	const choice = assembleChoice(rng, stmtOption(correct), distractors.map(stmtOption));
	if (!choice) return null;
	const stmts = choice.options.map((o) => ({ op: o.values[0], l: o.values[1], r: o.values[2] }) as Stmt);
	const why = (s: Stmt): string => {
		const t = evalStmt(s, sets);
		const e = s.l.slice(2);
		const reason =
			level === 2 ? `${tokTex(s.l)} \\text{ ${evalStmt({ op: 'in', l: s.l, r: 'A' }, sets) ? 'è' : 'non è'} un elemento di } A` : numberReason(e, s.r as 'N' | 'Z' | 'Q');
		return `${stmtTex(s)}\\text{ è ${t ? 'vera' : 'falsa'}: } ${reason}`;
	};
	const problem =
		level === 2 ? `\\begin{array}{l} A = ${setTex(sets.A)} \\\\ \\text{Quale affermazione è ${ask}?} \\end{array}` : textBlock(`Quale di queste affermazioni è ${ask}?`);
	return {
		prompt: PROMPT,
		problem,
		solution: `${stmtTex(stmts[choice.correct])}`,
		steps: stmts.map(why),
		answer: choice,
		params: {
			ask,
			sets: Object.fromEntries(Object.entries(sets).map(([k, v]) => [k, v.map(String)])),
			statements: stmts,
		},
	};
}

function numberReason(e: string, set: 'N' | 'Z' | 'Q'): string {
	const frac = e.includes('/');
	const n = frac ? NaN : Number(e);
	const tex = frac ? (e.startsWith('-') ? `-\\frac{${e.slice(1).split('/')[0]}}{${e.split('/')[1]}}` : `\\frac{${e.split('/')[0]}}{${e.split('/')[1]}}`) : e;
	if (set === 'Q') return frac ? `${tex} \\text{ è una frazione}` : `${tex} = \\frac{${n}}{1} \\text{ è una frazione}`;
	if (frac) return `${tex} \\text{ non è un numero intero}`;
	if (set === 'Z') return `${tex} \\text{ è un numero intero}`;
	if (n === 0) return '\\text{lo } 0 \\text{ è un numero naturale}';
	return n > 0 ? `${tex} \\text{ è un numero naturale}` : `\\text{i numeri naturali non sono negativi}`;
}

function build(rng: Rng, level: number): Built | null {
	switch (level) {
		case 1: {
			const ask: 'è' | 'non è' = rng.int(0, 1) ? 'è' : 'non è';
			const [goodPool, badPool] = ask === 'è' ? [WELL_DEFINED, NOT_DEFINED] : [NOT_DEFINED, WELL_DEFINED];
			const correct = rng.pick(goodPool);
			const others = pickDistinct(rng, badPool, 3);
			const choice = assembleChoice(rng, collOption(correct), others.map(collOption))!;
			const opts = choice.options.map((o) => collById(o.values[0])!);
			const steps = opts.map((c) => {
				const ok = WELL_DEFINED.includes(c);
				return `\\text{“${plain(c.text)}” ${ok ? 'è' : 'non è'} un insieme: ${c.why}}`;
			});
			steps.unshift(`\\text{Un insieme è una collezione ben definita: per ogni oggetto si decide senza discutere se ne fa parte}`);
			return {
				prompt: PROMPT,
				problem: textBlock(`Quale di queste collezioni ${ask} un insieme?`),
				solution: `\\text{${plain(correct.text)}}`,
				steps,
				answer: choice,
				params: { ask, options: opts.map((c) => c.id) },
			};
		}
		case 2:
		case 3:
			return statementLevel(rng, level);
		case 4: {
			const empties: Cand[] = [
				['lt', '0'],
				['mesi', '32'],
				['btw', String(rng.int(0, 9)), ''],
				['eq', '', ''],
			];
			let correct = rng.pick(empties);
			if (correct[0] === 'btw') correct = ['btw', correct[1], String(Number(correct[1]) + 1)];
			if (correct[0] === 'eq') {
				const b = rng.int(1, 8);
				correct = ['eq', String(rng.int(b + 1, 9)), String(b)];
			}
			const n = rng.int(0, 9);
			const a = rng.int(1, 9);
			const b = rng.int(1, 9);
			const traps: Cand[] = shuffle(rng, [
				['lit0'],
				['litE'],
				['lt', '1'],
				['eq', String(a), String(a)],
				['btw', String(n), String(n + 2)],
				['eq', String(Math.min(a, b)), String(Math.max(a, b) + 1)],
				['lt', String(rng.int(2, 6))],
				['mesi', rng.pick(['30', '31'])],
			]);
			const choice = assembleChoice(
				rng,
				{ latex: optionTex(candProse(correct)), values: correct },
				traps.map((t) => ({ latex: optionTex(candProse(t)), values: t })),
			);
			if (!choice) return null;
			const cands = choice.options.map((o) => o.values);
			return {
				prompt: PROMPT,
				problem: textBlock('Quale di questi insiemi è vuoto?'),
				solution: lineTex(candProse(correct)),
				steps: cands.map((c) => `${lineTex(candProse(c))}\\text{: } ${candWhy(c)}`),
				answer: choice,
				params: { candidates: cands },
			};
		}
		case 5: {
			const u = rng.next();
			let prose: string,
				value: number,
				mistakes: number[],
				steps: string[],
				extra: string[] = [],
				variant: string;
			const params: Record<string, unknown> = {};
			if (u < 0.4) {
				const w = rng.pick(WORDS);
				const ls = letters(w);
				value = ls.length;
				variant = 'parola';
				params.word = w;
				prose = `Sia $A$ l'insieme delle lettere della parola “${w}”.`;
				mistakes = [w.length, value - 1, value + 1];
				steps = [`\\text{Le lettere ripetute si contano una volta sola: } A = ${setTex(firstAppearance(w), true)}`, `|A| = ${value}`];
			} else if (u < 0.6) {
				const k = rng.int(3, 5);
				const base = pickDistinct(rng, range(0, 12), k);
				const reps = pickDistinct(rng, base, rng.int(1, 2));
				const list = shuffle(rng, [...base, ...reps]);
				value = k;
				variant = 'ripetuti';
				params.list = list.map(String);
				prose = '';
				extra = [`A = ${setTex(list, true)}`];
				mistakes = [list.length, k - 1, k + 1];
				steps = [`\\text{Gli elementi ripetuti contano una volta: } A = ${setTex(list)}`, `|A| = ${value}`];
			} else if (u < 0.9) {
				const kind = rng.pick(['lt', 'le', 'pari']);
				const n = rng.int(5, 15);
				variant = kind;
				params.n = String(n);
				const els = range(0, n).filter((x) => (kind === 'le' ? x <= n : x < n) && (kind !== 'pari' || x % 2 === 0));
				value = els.length;
				const desc =
					kind === 'lt' ? `dei numeri naturali minori di $${n}$` : kind === 'le' ? `dei numeri naturali minori o uguali a $${n}$` : `dei numeri naturali pari minori di $${n}$`;
				prose = `Sia $A$ l'insieme ${desc}.`;
				mistakes = [value - 1, value + 1];
				steps = [`\\text{Lo } 0 \\text{ è un numero naturale${kind === 'pari' ? ' ed è pari' : ''}: } A = ${setTex(els)}`, `|A| = ${value}`];
			} else {
				const which = rng.pick(['vuoto', 'zero', 'insvuoto']);
				variant = which;
				const tex = which === 'vuoto' ? '\\emptyset' : which === 'zero' ? '\\{0\\}' : '\\{\\emptyset\\}';
				value = which === 'vuoto' ? 0 : 1;
				prose = '';
				extra = [`A = ${tex}`];
				mistakes = which === 'vuoto' ? [1] : [0];
				steps = [
					which === 'vuoto'
						? '\\text{L’insieme vuoto non ha elementi}'
						: which === 'zero'
							? '\\text{L’unico elemento è il numero } 0'
							: '\\text{L’unico elemento è l’insieme vuoto}',
					`|A| = ${value}`,
				];
			}
			params.variant = variant;
			return {
				prompt: "Calcola la cardinalità dell'insieme.",
				problem: textBlock(prose, 40, extra),
				solution: `|A| = ${value}`,
				steps,
				answer: { kind: 'number', value: String(value) },
				params: { ...params, mistakes: mistakes.map(String) },
			};
		}
		case 6: {
			const ask: 'infinito' | 'finito' = rng.int(0, 1) ? 'infinito' : 'finito';
			const correct = finCandidates(rng, ask === 'finito')[0];
			const others = finCandidates(rng, ask !== 'finito');
			const opt = (f: Fin): ChoiceOption => ({ latex: optionTex(finProse(f)), values: f });
			const choice = assembleChoice(rng, opt(correct), others.map(opt))!;
			const fs = choice.options.map((o) => o.values);
			return {
				prompt: PROMPT,
				problem: textBlock(`Quale di questi insiemi è ${ask}?`),
				solution: lineTex(finProse(correct)),
				steps: fs.map((f) => `${lineTex(finProse(f))}\\text{: ${finFinite(f) ? 'finito' : 'infinito'}, } ${finWhy(f)}`),
				answer: choice,
				params: { ask, options: fs },
			};
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function firstAppearance(w: string): El[] {
	const out: El[] = [];
	for (const c of w) if (!out.includes(c)) out.push(c);
	return out;
}

// ---------------------------------------------------------------------------
// Check and choice

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params as Record<string, unknown>;
	const a = sample.answer;
	const exactlyOne = (ch: ChoiceAnswer, truth: (o: ChoiceOption) => boolean) => {
		if (ch.options.length !== 4) v.push('servono 4 opzioni');
		const t = ch.options.map(truth);
		if (t.filter(Boolean).length !== 1 || !t[ch.correct]) v.push('non c’è esattamente una opzione corretta');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni ripetute');
	};
	switch (sample.level) {
		case 1: {
			if (a.kind !== 'choice') return ['risposta non a scelta'];
			const good = p.ask === 'è';
			exactlyOne(a, (o) => WELL_DEFINED.some((c) => c.id === o.values[0]) === good);
			break;
		}
		case 2:
		case 3: {
			if (a.kind !== 'choice') return ['risposta non a scelta'];
			const sets = Object.fromEntries(Object.entries((p.sets ?? {}) as Record<string, string[]>).map(([k, xs]) => [k, xs.map((x) => (/^-?\d+$/.test(x) ? Number(x) : x))]));
			const want = p.ask === 'vera';
			exactlyOne(a, (o) => evalStmt({ op: o.values[0], l: o.values[1], r: o.values[2] } as Stmt, sets) === want);
			if (sample.level === 2 && (sets.A?.length ?? 0) < 4) v.push('A ha meno di 4 elementi');
			if (new Set(a.options.map((o) => o.values[1])).size !== 4) v.push('due affermazioni sullo stesso elemento');
			break;
		}
		case 4:
			if (a.kind !== 'choice') return ['risposta non a scelta'];
			exactlyOne(a, (o) => candElements(o.values).length === 0);
			break;
		case 5: {
			if (a.kind !== 'number') return ['risposta non numerica'];
			const n = Number(a.value);
			let truth: number;
			if (p.variant === 'parola') truth = letters(String(p.word)).length;
			else if (p.variant === 'ripetuti') truth = new Set(p.list as string[]).size;
			else if (p.variant === 'lt') truth = Number(p.n);
			else if (p.variant === 'le') truth = Number(p.n) + 1;
			else if (p.variant === 'pari') truth = Math.ceil(Number(p.n) / 2);
			else truth = p.variant === 'vuoto' ? 0 : 1;
			if (n !== truth) v.push(`cardinalità ${n} diversa da ${truth}`);
			break;
		}
		case 6:
			if (a.kind !== 'choice') return ['risposta non a scelta'];
			exactlyOne(a, (o) => finFinite(o.values) === (p.ask === 'finito'));
			break;
		default:
			v.push(`livello sconosciuto ${sample.level}`);
	}
	if (sample.steps.length === 0) v.push('nessun passaggio');
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	if (sample.answer.kind !== 'number') throw new Error(`${ID}: no choice for ${sample.answer.kind}`);
	const mistakes = ((sample.params.mistakes ?? []) as string[]).map(Number);
	return numberChoice(rng, Number(sample.answer.value), mistakes);
}

export const primeDefinizioni: Generator = {
	id: ID,
	title: 'Prime definizioni sugli insiemi',
	levels: {
		1: {
			label: 'Insieme o no',
			constraints: ['quattro collezioni, una sola ben definita (o una sola non ben definita)'],
		},
		2: {
			label: 'Appartenenza: ∈ e ∉',
			constraints: ['A elencato con 4-6 elementi', 'quattro affermazioni su elementi diversi, una sola vera (o una sola falsa)'],
		},
		3: {
			label: 'Appartenenza a ℕ, ℤ, ℚ',
			constraints: ['elementi: 0, interi positivi e negativi, frazioni non intere', 'una sola affermazione vera (o falsa)'],
		},
		4: {
			label: "L'insieme vuoto",
			constraints: ['un solo insieme vuoto tra quattro', 'distrattori: {0}, {∅}, naturali minori di 1, x + a = a'],
		},
		5: {
			label: 'Cardinalità',
			constraints: ['lettere di una parola, elenchi con ripetizioni, naturali minori di n (0 compreso), ∅ e {0}'],
		},
		6: {
			label: 'Finito o infinito',
			constraints: ['un solo insieme infinito (o finito) tra quattro'],
		},
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const b = build(rng, level);
			if (!b) continue;
			const sample: Sample = { generatorId: ID, level, seed: rng.seed, ...b };
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default primeDefinizioni;
