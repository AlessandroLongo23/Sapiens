/**
 * Proporzionalità diretta e inversa (lesson slug funzioni-lineari). Spec: specs/exercises/funzioni-lineari.md
 *
 * Seven levels in the order of the lesson: the kind of link from a formula or a situation; a missing
 * value in a table whose kind is given; the formula of a direct or inverse table; the kind of a table
 * among five (with the table where only the first two pairs work); m and q of a linear function from
 * a table; one-line problems with direct or inverse proportionality; problems in two stages and with
 * the square. Every exercise starts from the answer (the constant, the kind, m and q) and builds the
 * table or the story from it; the numbers are exact rationals and every decimal is finite.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { decimalLatex, shuffle, toDecimal } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'funzioni-lineari';

// ---------------------------------------------------------------------------
// Numbers

/** A finite decimal with at most `max` decimals, with the comma: "7{,}5", "12", "-0{,}25". Null otherwise. */
function dec(r: Rational, max = 3): string | null {
	const d = toDecimal(r, max, 0);
	return d ? decimalLatex(d) : null;
}

/** Like dec, but the number must be writable. */
function num(r: Rational): string {
	const s = dec(r, 4);
	if (s === null) throw new Error(`${ID}: ${r.toString()} is not a finite decimal`);
	return s;
}

/** Euros: an integer, or two decimals (7{,}20). */
function eur(r: Rational): string {
	if (r.isInteger()) return String(r.num);
	const cents = r.mul(q(100));
	if (!cents.isInteger()) throw new Error(`${ID}: ${r.toString()} euro is not in cents`);
	const c = cents.num;
	return `${Math.floor(c / 100)}{,}${String(c % 100).padStart(2, '0')}`;
}

/** A number inside prose: bare when it has no comma or sign, else $…$. */
const inProse = (latex: string) => (/[{\\-]/.test(latex) ? `$${latex}$` : latex);

const t = (s: string) => `\\text{${s}}`;

/** k·x as LaTeX: "x", "-x", "3x", "1{,}5x", "\dfrac{2}{3}x". */
function coefX(k: Rational, v = 'x'): string {
	if (k.isOne()) return v;
	if (k.equals(q(-1))) return `-${v}`;
	const d = dec(k, 2);
	if (d !== null) return `${d}${v}`;
	return `${k.sign() < 0 ? '-' : ''}\\dfrac{${Math.abs(k.num)}}{${k.den}}${v}`;
}

/** m x + q, ordered by decreasing powers. */
function linLatex(m: Rational, c: Rational): string {
	const head = m.isZero() ? '' : coefX(m);
	if (c.isZero()) return head || '0';
	const cs = num(c.abs());
	if (!head) return num(c);
	return `${head} ${c.sign() < 0 ? '-' : '+'} ${cs}`;
}

const sympyRat = (r: Rational) => (r.isInteger() ? String(r.num) : `(${r.num}/${r.den})`);

// ---------------------------------------------------------------------------
// Kinds of link

export type Kind = 'diretta' | 'inversa' | 'quadratica' | 'lineare' | 'nessuno';
const KINDS: Kind[] = ['diretta', 'inversa', 'quadratica', 'lineare', 'nessuno'];

export const KIND_OPTIONS: Record<Kind, ChoiceOption> = {
	diretta: { latex: t('proporzionalità diretta'), values: ['diretta'] },
	inversa: { latex: t('proporzionalità inversa'), values: ['inversa'] },
	quadratica: { latex: t('proporzionalità quadratica'), values: ['quadratica'] },
	lineare: { latex: t('lineare, non proporzionale'), values: ['lineare'] },
	nessuno: { latex: t('nessuno dei quattro tipi'), values: ['nessuno'] },
};

function kindChoice(kinds: Kind[], correct: Kind): ChoiceAnswer {
	const ordered = KINDS.filter((k) => kinds.includes(k));
	return { kind: 'choice', options: ordered.map((k) => ({ ...KIND_OPTIONS[k], values: [...KIND_OPTIONS[k].values] })), correct: ordered.indexOf(correct) };
}

/** The test of the lesson, in its order: ratio, product, ratio with the square, increments. */
export function classify(xs: Rational[], ys: Rational[]): Kind {
	const same = (f: (i: number) => Rational) => xs.every((_, i) => f(i).equals(f(0)));
	if (same((i) => ys[i].div(xs[i])) && !ys[0].isZero()) return 'diretta';
	if (same((i) => xs[i].mul(ys[i])) && !ys[0].isZero()) return 'inversa';
	if (same((i) => ys[i].div(xs[i].mul(xs[i]))) && !ys[0].isZero()) return 'quadratica';
	if (xs.length >= 3 && xs.slice(2).every((_, j) => ys[j + 2].sub(ys[j + 1]).div(xs[j + 2].sub(xs[j + 1])).equals(ys[1].sub(ys[0]).div(xs[1].sub(xs[0]))))) return 'lineare';
	return 'nessuno';
}

// ---------------------------------------------------------------------------
// Tables

type Cell = Rational | null;

function tableLatex(xs: Cell[], ys: Cell[]): string {
	const cell = (c: Cell) => (c === null ? '?' : num(c));
	return `\\begin{array}{c|${'c'.repeat(xs.length)}} x & ${xs.map(cell).join(' & ')} \\\\ \\hline y & ${ys.map(cell).join(' & ')} \\end{array}`;
}

const tableParams = (xs: Cell[], ys: Cell[]) => ({ xs: xs.map((c) => (c === null ? '?' : c.toString())), ys: ys.map((c) => (c === null ? '?' : c.toString())) });

/** Constants of a direct proportionality: integers and the decimals of the lesson. */
const K_DIRECT: Rational[] = [2, 3, 4, 5, 6, 7, 8, 9].map((n) => q(n)).concat([5, 15, 25, 35, 4, 6, 8, 12, 24, 32].map((n) => q(n, 10)), [q(25, 100), q(75, 100), q(125, 100)]);
/** Constants of an inverse proportionality: numbers with many divisors. */
const K_INVERSE = [12, 18, 20, 24, 30, 36, 40, 42, 48, 60, 72, 80, 84, 90, 96, 100, 120, 144, 180, 240];

/** n distinct integers in [lo, hi], increasing. */
function increasing(rng: Rng, n: number, lo: number, hi: number): number[] {
	return shuffle(
		rng,
		Array.from({ length: hi - lo + 1 }, (_, i) => lo + i),
	)
		.slice(0, n)
		.sort((a, b) => a - b);
}

/** x values for y = k/x: y a decimal with at most one decimal, not too small. */
function inverseXs(rng: Rng, k: number, n: number): number[] | null {
	const good = Array.from({ length: 40 }, (_, i) => i + 1).filter((x) => x !== k && dec(q(k, x), 1) !== null && k / x >= 0.5 && x !== Math.sqrt(k));
	if (good.length < n) return null;
	return shuffle(rng, good)
		.slice(0, n)
		.sort((a, b) => a - b);
}

// ---------------------------------------------------------------------------
// Number choices

function numberOption(r: Rational, money = false): ChoiceOption | null {
	if (r.sign() <= 0) return null;
	const s = money ? (r.mul(q(100)).isInteger() ? eur(r) : null) : dec(r, 2);
	return s === null ? null : { latex: s, values: [r.toString()] };
}

/** The answer, then the mistakes that give a positive, writable number, then neighbours. */
function numberChoice(rng: Rng, answer: Rational, mistakes: Rational[], money = false): ChoiceAnswer {
	const correct = numberOption(answer, money);
	if (!correct) throw new Error(`${ID}: answer ${answer.toString()} not writable`);
	const opts: ChoiceOption[] = [correct];
	const add = (r: Rational) => {
		const o = numberOption(r, money);
		if (o && opts.length < 4 && !opts.some((p) => p.values[0] === o.values[0])) opts.push(o);
	};
	mistakes.forEach(add);
	const step = answer.isInteger() ? q(1) : answer.mul(q(2)).isInteger() ? q(1, 2) : q(1, 10);
	for (let d = 1; opts.length < 4 && d < 60; d++) {
		add(answer.add(step.mul(q(d))));
		add(answer.sub(step.mul(q(d))));
	}
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

// ---------------------------------------------------------------------------
// Level 1: the kind from a formula or from a situation

const FORMULA_PROMPT = 'Stabilisci che legame c\'è tra x e y.';
const STORY_PROMPT = 'Stabilisci che legame c\'è tra le due grandezze.';

interface Built {
	prompt: string;
	problem: string;
	steps: string[];
	solution: string;
	params: Record<string, unknown>;
}

const KIND_SENTENCE: Record<Exclude<Kind, 'nessuno'>, string> = {
	diretta: 'È una proporzionalità diretta.',
	inversa: 'È una proporzionalità inversa.',
	quadratica: 'È una proporzionalità quadratica.',
	lineare: 'È una funzione lineare, e le due grandezze non sono proporzionali.',
};

const pickK = (rng: Rng) => rng.pick(K_DIRECT);

function formulaLevel1(rng: Rng, kind: Exclude<Kind, 'nessuno'>): Built {
	const steps: string[] = [];
	let formula = '';
	let form = '';
	if (kind === 'diretta') {
		form = rng.pick(['kx', 'kx', 'x/n', 'y/x']);
		if (form === 'x/n') {
			const n = rng.int(2, 9);
			formula = `y = \\dfrac{x}{${n}}`;
			steps.push(`\\dfrac{x}{${n}} = \\dfrac{1}{${n}}x${t(': la formula è del tipo ')} y = kx ${t(' con ')} k = \\dfrac{1}{${n}}`);
			steps.push(`${t('La ')} x ${t(' sta al numeratore: se ')} x ${t(' raddoppia, anche ')} y ${t(' raddoppia.')}`);
		} else if (form === 'y/x') {
			const k = pickK(rng);
			formula = `\\dfrac{y}{x} = ${num(k)}`;
			steps.push(`${t('Il rapporto tra ')} y ${t(' e ')} x ${t(' è costante; moltiplicando per ')} x ${t(' i due membri: ')} y = ${coefX(k)}`);
			steps.push(`${t('Se ')} x ${t(' raddoppia, anche ')} y ${t(' raddoppia.')}`);
		} else {
			const k = pickK(rng);
			formula = `y = ${coefX(k)}`;
			steps.push(`${t('La formula è del tipo ')} y = kx ${t(' con ')} k = ${num(k)}${t(': il rapporto ')} \\dfrac{y}{x} ${t(' vale sempre ')} ${num(k)}`);
			steps.push(`${t('Se ')} x ${t(' raddoppia, anche ')} y ${t(' raddoppia.')}`);
		}
	} else if (kind === 'inversa') {
		form = rng.pick(['k/x', 'k/x', 'xy']);
		const k = rng.int(2, 60);
		if (form === 'xy') {
			formula = `x \\cdot y = ${k}`;
			steps.push(`${t('Il prodotto di ')} x ${t(' e ')} y ${t(' è costante; dividendo per ')} x ${t(' i due membri: ')} y = \\dfrac{${k}}{x}`);
		} else {
			formula = `y = \\dfrac{${k}}{x}`;
			steps.push(`${t('La formula è del tipo ')} y = \\dfrac{k}{x} ${t(' con ')} k = ${k}${t(': il prodotto ')} x \\cdot y ${t(' vale sempre ')} ${k}`);
		}
		steps.push(`${t('Se ')} x ${t(' raddoppia, ')} y ${t(' si dimezza.')}`);
	} else if (kind === 'quadratica') {
		form = rng.pick(['kx2', 'kx2', 'y/x2']);
		const k = rng.pick([1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => q(n)).concat([q(1, 2), q(3, 2), q(5, 2), q(1, 4)]));
		if (form === 'y/x2') {
			formula = `\\dfrac{y}{x^2} = ${num(k)}`;
			steps.push(`${t('Il rapporto tra ')} y ${t(' e il quadrato di ')} x ${t(' è costante: ')} y = ${coefX(k, 'x^2')}`);
		} else {
			formula = `y = ${coefX(k, 'x^2')}`;
			steps.push(`${t('La formula è del tipo ')} y = kx^2 ${t(' con ')} k = ${num(k)}${t(': il rapporto ')} \\dfrac{y}{x^2} ${t(' vale sempre ')} ${num(k)}`);
		}
		steps.push(`${t('Se ')} x ${t(' raddoppia, ')} y ${t(' diventa quattro volte più grande, perché ')} 2^2 = 4`);
	} else {
		form = rng.pick(['up', 'up', 'down']);
		const m = form === 'up' ? rng.pick([1, 2, 3, 4, 5].map((n) => q(n)).concat([q(1, 2), q(3, 2), q(6, 5)])) : q(-rng.int(1, 4));
		const c = form === 'up' ? q(rng.int(1, 9) * (rng.next() < 0.8 ? 1 : -1)) : q(rng.int(12, 30));
		formula = `y = ${linLatex(m, c)}`;
		const y1 = m.add(c), y2 = m.mul(q(2)).add(c);
		steps.push(`${t('La formula è del tipo ')} y = mx + q ${t(' con ')} q = ${num(c)}${t(', diverso da zero.')}`);
		if (form === 'up') {
			steps.push(`${t('Con ')} x = 1 ${t(' si ha ')} y = ${num(y1)}${t(', con ')} x = 2 ${t(' si ha ')} y = ${num(y2)}${t(': ')} x ${t(' raddoppia ma ')} y ${t(' non raddoppia.')}`);
		} else {
			steps.push(`${t('Con ')} x = 1 ${t(' si ha ')} y = ${num(y1)}${t(', con ')} x = 2 ${t(' si ha ')} y = ${num(y2)}${t(': ')} y ${t(' diminuisce, ma non si dimezza. Il prodotto ')} x \\cdot y ${t(' vale prima ')} ${num(y1)} ${t(' e poi ')} ${num(y2.mul(q(2)))}`);
		}
	}
	steps.push(t(KIND_SENTENCE[kind]));
	return { prompt: FORMULA_PROMPT, problem: formula, steps, solution: t(KIND_SENTENCE[kind]), params: { mode: 'formula', form, formula } };
}

interface Story1 {
	id: string;
	kind: Exclude<Kind, 'nessuno'>;
	build(rng: Rng): { data: Record<string, string>; prose: string; steps: string[] };
}

const FIGURES = [
	{ name: 'quadrato', art: 'un quadrato', sides: 4 },
	{ name: 'triangolo', art: 'un triangolo equilatero', sides: 3 },
	{ name: 'esagono', art: 'un esagono regolare', sides: 6 },
];

const STORIES_1: Story1[] = [
	{
		id: 'mele',
		kind: 'diretta',
		build(rng) {
			const p = q(rng.int(9, 39), 10);
			const P = eur(p);
			return {
				data: { p: p.toString() },
				prose: `Le mele costano ${inProse(P)} euro al chilo. Che legame c'è tra il peso delle mele che compri e il prezzo che paghi?`,
				steps: [
					t('Se il peso raddoppia, anche il prezzo raddoppia.'),
					`${t('Il rapporto tra prezzo e peso è sempre ')} ${P}${t(', il prezzo di un chilo: ')} y = ${coefX(p)}`,
				],
			};
		},
	},
	{
		id: 'auto',
		kind: 'diretta',
		build(rng) {
			const v = rng.int(5, 13) * 10;
			return {
				data: { v: String(v) },
				prose: `Un'auto viaggia sempre a ${v} km/h. Che legame c'è tra le ore di viaggio e i chilometri percorsi?`,
				steps: [t('Se le ore raddoppiano, anche i chilometri percorsi raddoppiano.'), `${t('Il rapporto tra chilometri e ore è sempre ')} ${v}${t(', la velocità: ')} y = ${v}x`],
			};
		},
	},
	{
		id: 'stampante',
		kind: 'diretta',
		build(rng) {
			const n = rng.int(8, 40);
			return {
				data: { n: String(n) },
				prose: `Una stampante stampa ${n} pagine al minuto. Che legame c'è tra i minuti di lavoro e le pagine stampate?`,
				steps: [t('Se i minuti raddoppiano, anche le pagine raddoppiano.'), `${t('Il rapporto tra pagine e minuti è sempre ')} ${n}${t(': ')} y = ${n}x`],
			};
		},
	},
	{
		id: 'perimetro',
		kind: 'diretta',
		build(rng) {
			const f = rng.pick(FIGURES);
			return {
				data: { figura: f.name },
				prose: `Che legame c'è tra il lato di ${f.art} e il suo perimetro?`,
				steps: [t('Se il lato raddoppia, anche il perimetro raddoppia.'), `${t(`Il perimetro è ${f.sides} volte il lato: `)} y = ${f.sides}x`],
			};
		},
	},
	{
		id: 'viaggio',
		kind: 'inversa',
		build(rng) {
			const d = rng.int(3, 30) * 20;
			return {
				data: { d: String(d) },
				prose: `Un viaggio è lungo ${d} km. Che legame c'è tra la velocità media e il tempo del viaggio?`,
				steps: [t('Se la velocità raddoppia, il tempo si dimezza.'), `${t('Il prodotto di velocità e tempo è sempre ')} ${d}${t(', la lunghezza del viaggio: ')} y = \\dfrac{${d}}{x}`],
			};
		},
	},
	{
		id: 'operai',
		kind: 'inversa',
		build(rng) {
			const n = rng.int(2, 12), g = rng.int(3, 30);
			return {
				data: { n: String(n), g: String(g) },
				prose: `Per costruire un muro ${n} operai impiegano ${g} giorni. Che legame c'è tra il numero di operai e i giorni che servono, se tutti lavorano allo stesso ritmo?`,
				steps: [
					t('Con il doppio degli operai servono metà dei giorni.'),
					`${t('Il prodotto di operai e giorni è sempre ')} ${n} \\cdot ${g} = ${n * g}${t(', il lavoro misurato in giorni di lavoro di un operaio: ')} y = \\dfrac{${n * g}}{x}`,
				],
			};
		},
	},
	{
		id: 'rettangolo',
		kind: 'inversa',
		build(rng) {
			const A = rng.pick([12, 16, 18, 20, 24, 30, 36, 40, 48, 50, 60, 64, 72, 80, 90, 96, 100, 120]);
			return {
				data: { A: String(A) },
				prose: `Un rettangolo ha l'area di ${A} centimetri quadrati. Che legame c'è tra la base e l'altezza?`,
				steps: [t("Se la base raddoppia, l'altezza si dimezza, perché l'area non cambia."), `${t('Il prodotto di base e altezza è sempre ')} ${A}${t(': ')} y = \\dfrac{${A}}{x}`],
			};
		},
	},
	{
		id: 'regalo',
		kind: 'inversa',
		build(rng) {
			const S = rng.int(4, 40) * 10;
			return {
				data: { S: String(S) },
				prose: `${S} euro vengono divisi in parti uguali tra alcuni amici. Che legame c'è tra il numero di amici e la quota di ciascuno?`,
				steps: [t('Se gli amici raddoppiano, la quota di ciascuno si dimezza.'), `${t('Il prodotto di amici e quota è sempre ')} ${S}${t(': ')} y = \\dfrac{${S}}{x}`],
			};
		},
	},
	{
		id: 'area-quadrato',
		kind: 'quadratica',
		build(rng) {
			const what = rng.pick(['quadrato', 'cerchio']);
			return {
				data: { figura: what },
				prose: what === 'quadrato' ? "Che legame c'è tra il lato di un quadrato e la sua area?" : "Che legame c'è tra il raggio di un cerchio e la sua area?",
				steps:
					what === 'quadrato'
						? [t("Se il lato raddoppia, l'area diventa quattro volte più grande."), `${t("L'area è il quadrato del lato: ")} y = x^2`]
						: [t("Se il raggio raddoppia, l'area diventa quattro volte più grande."), `${t("L'area è il quadrato del raggio per pi greco: ")} y = \\pi x^2`],
			};
		},
	},
	{
		id: 'stoffa',
		kind: 'quadratica',
		build(rng) {
			const p = q(rng.int(4, 30), 2);
			const P = eur(p);
			return {
				data: { p: p.toString() },
				prose: `Una stoffa costa ${inProse(P)} euro al metro quadrato. Che legame c'è tra il lato di una tovaglia quadrata e il suo prezzo?`,
				steps: [t('Se il lato raddoppia, la superficie e il prezzo diventano quattro volte più grandi.'), `${t('Il prezzo è ')} ${P} ${t(' per il quadrato del lato: ')} y = ${coefX(p, 'x^2')}`],
			};
		},
	},
	{
		id: 'pizza',
		kind: 'quadratica',
		build(rng) {
			const d = rng.pick([26, 28, 30, 32, 34, 36]);
			return {
				data: { d: String(d) },
				prose: `Una pizzeria fa pagare le pizze in proporzione alla superficie; la più piccola ha ${d} cm di diametro. Che legame c'è tra il diametro della pizza e il prezzo?`,
				steps: [t('La superficie è proporzionale al quadrato del diametro: se il diametro raddoppia, il prezzo diventa quattro volte più grande.'), t('Il rapporto tra il prezzo e il quadrato del diametro è costante.')],
			};
		},
	},
	{
		id: 'taxi',
		kind: 'lineare',
		build(rng) {
			const F = q(rng.int(2, 6)), m = q(rng.int(8, 25), 10);
			return {
				data: { F: F.toString(), m: m.toString() },
				prose: `Un taxi chiede ${F.num} euro alla partenza e ${inProse(eur(m))} euro per ogni chilometro. Che legame c'è tra i chilometri percorsi e il prezzo della corsa?`,
				steps: [
					`${t('Con 1 km si pagano ')} ${eur(F.add(m))} ${t(' euro, con 2 km ')} ${eur(F.add(m.mul(q(2))))} ${t(' euro: il prezzo non raddoppia, perché la partenza si paga una volta sola.')}`,
					`${t('Ogni chilometro in più costa sempre ')} ${eur(m)} ${t(' euro in più: ')} y = ${linLatex(m, F)}`,
				],
			};
		},
	},
	{
		id: 'candela',
		kind: 'lineare',
		build(rng) {
			for (;;) {
				const a = rng.int(1, 4), h = rng.int(12, 30);
				if (h <= 3 * a + 2) continue;
				return {
					data: { h: String(h), a: String(a) },
					prose: `Una candela è alta ${h} cm e si accorcia di ${a} cm ogni ora. Che legame c'è tra le ore passate e l'altezza della candela?`,
					steps: [
						`${t('Dopo 1 ora è alta ')} ${h - a} ${t(' cm, dopo 2 ore ')} ${h - 2 * a} ${t(' cm: le ore raddoppiano, ma l\'altezza non si dimezza. Il prodotto non è costante.')}`,
						`${t(`L'altezza cala sempre di ${a} cm ogni ora: `)} y = ${linLatex(q(-a), q(h))}`,
					],
				};
			}
		},
	},
	{
		id: 'palestra',
		kind: 'lineare',
		build(rng) {
			const F = rng.int(2, 8) * 10, m = rng.int(15, 45);
			return {
				data: { F: String(F), m: String(m) },
				prose: `Una palestra chiede ${F} euro di iscrizione e ${m} euro al mese. Che legame c'è tra i mesi di abbonamento e la spesa totale?`,
				steps: [
					`${t('Per 1 mese si spendono ')} ${F + m} ${t(' euro, per 2 mesi ')} ${F + 2 * m} ${t(" euro: la spesa non raddoppia, perché l'iscrizione si paga una volta sola.")}`,
					`${t(`Ogni mese in più costa sempre ${m} euro in più: `)} y = ${m}x + ${F}`,
				],
			};
		},
	},
	{
		id: 'vasca',
		kind: 'lineare',
		build(rng) {
			const L = rng.int(2, 20) * 10, r = rng.int(5, 30);
			return {
				data: { L: String(L), r: String(r) },
				prose: `Una vasca contiene già ${L} litri d'acqua e un rubinetto ne aggiunge ${r} al minuto. Che legame c'è tra i minuti passati e i litri nella vasca?`,
				steps: [
					`${t('Dopo 1 minuto ci sono ')} ${L + r} ${t(' litri, dopo 2 minuti ')} ${L + 2 * r}${t(': i litri non raddoppiano, perché i primi ')} ${L} ${t(' c\'erano già.')}`,
					`${t(`Ogni minuto in più aggiunge sempre ${r} litri: `)} y = ${r}x + ${L}`,
				],
			};
		},
	},
];

function storyLevel1(rng: Rng, kind: Exclude<Kind, 'nessuno'>): Built {
	const story = rng.pick(STORIES_1.filter((s) => s.kind === kind));
	const b = story.build(rng);
	return {
		prompt: STORY_PROMPT,
		problem: textBlock(b.prose),
		steps: [...b.steps, t(KIND_SENTENCE[kind])],
		solution: t(KIND_SENTENCE[kind]),
		params: { mode: 'situazione', story: story.id, ...b.data },
	};
}

function level1(rng: Rng): { built: Built; answer: ChoiceAnswer; kind: Kind } {
	const kind = rng.pick(['diretta', 'inversa', 'quadratica', 'lineare'] as const);
	const built = rng.next() < 0.5 ? formulaLevel1(rng, kind) : storyLevel1(rng, kind);
	return { built, answer: kindChoice(['diretta', 'inversa', 'quadratica', 'lineare'], kind), kind };
}

// ---------------------------------------------------------------------------
// Level 2: a missing value in a table whose kind is given

interface PropTable {
	kind: 'diretta' | 'inversa';
	k: Rational;
	xs: Rational[];
	ys: Rational[];
}

function propTable(rng: Rng, kind: 'diretta' | 'inversa', n: number): PropTable | null {
	if (kind === 'diretta') {
		const k = rng.pick(K_DIRECT);
		const xs = increasing(rng, n, 1, 20).map((x) => q(x));
		return { kind, k, xs, ys: xs.map((x) => k.mul(x)) };
	}
	const k = rng.pick(K_INVERSE);
	const xs = inverseXs(rng, k, n);
	if (!xs) return null;
	return { kind, k: q(k), xs: xs.map((x) => q(x)), ys: xs.map((x) => q(k, x)) };
}

function level2(rng: Rng): { built: Built; answer: Rational; mistakes: Rational[]; kind: Kind } {
	for (;;) {
		const kind = rng.pick(['diretta', 'inversa'] as const);
		const n = rng.int(3, 4);
		const tb = propTable(rng, kind, n);
		if (!tb) continue;
		const col = rng.int(1, n - 1);
		const row: 'x' | 'y' = rng.next() < 0.3 ? 'x' : 'y';
		const answer = row === 'y' ? tb.ys[col] : tb.xs[col];
		const shown = [...tb.xs, ...tb.ys].filter((_, i) => i !== (row === 'x' ? col : n + col));
		if (shown.some((v) => v.equals(answer))) continue;
		if (tb.ys.some((y) => y.num > 999)) continue;
		const xs: Cell[] = tb.xs.map((x, i) => (row === 'x' && i === col ? null : x));
		const ys: Cell[] = tb.ys.map((y, i) => (row === 'y' && i === col ? null : y));
		const x1 = tb.xs[0], y1 = tb.ys[0], k = tb.k;
		const direct = kind === 'diretta';
		const word = direct ? 'direttamente' : 'inversamente';
		const steps: string[] = [];
		if (direct) steps.push(`${t('Nella proporzionalità diretta il rapporto è costante. Dalla prima coppia: ')} k = \\dfrac{${num(y1)}}{${num(x1)}} = ${num(k)}`);
		else steps.push(`${t('Nella proporzionalità inversa il prodotto è costante. Dalla prima coppia: ')} k = ${num(x1)} \\cdot ${num(y1)} = ${num(k)}`);
		let mistakes: Rational[];
		if (row === 'y') {
			const X = tb.xs[col];
			if (direct) {
				steps.push(`${t('Per ')} x = ${num(X)}${t(': ')} y = ${num(k)} \\cdot ${num(X)} = ${num(answer)}`);
				// inverse law; same difference; the constant itself; the ratio turned upside down
				mistakes = [y1.mul(x1).div(X), y1.add(X.sub(x1)), k, X.div(k)];
			} else {
				steps.push(`${t('Per ')} x = ${num(X)}${t(': ')} y = \\dfrac{${num(k)}}{${num(X)}} = ${num(answer)}`);
				// direct law (the proportion of the warning); same difference; the product; k times x
				mistakes = [y1.mul(X).div(x1), y1.sub(X.sub(x1)), k, k.mul(X)];
			}
		} else {
			const Y = tb.ys[col];
			if (direct) {
				steps.push(`${t('Per ')} y = ${num(Y)}${t(': ')} x = \\dfrac{${num(Y)}}{${num(k)}} = ${num(answer)}`);
				mistakes = [Y.mul(k), x1.mul(y1).div(Y), x1.add(Y.sub(y1)), k];
			} else {
				steps.push(`${t('Per ')} y = ${num(Y)}${t(': ')} x = \\dfrac{${num(k)}}{${num(Y)}} = ${num(answer)}`);
				mistakes = [x1.mul(Y).div(y1), k.mul(Y), x1.sub(Y.sub(y1)), k];
			}
		}
		steps.push(direct ? `${t('Controllo: ')} \\dfrac{y}{x} ${t(' vale ')} ${num(k)} ${t(' anche nella colonna completata.')}` : `${t('Controllo: ')} x \\cdot y ${t(' vale ')} ${num(k)} ${t(' anche nella colonna completata.')}`);
		return {
			built: {
				prompt: 'Trova il valore al posto del punto interrogativo.',
				problem: textBlock(`Nella tabella $x$ e $y$ sono ${word} proporzionali.`, 46, [tableLatex(xs, ys)]),
				steps,
				solution: `${row} = ${num(answer)}`,
				params: { kind, ...tableParams(xs, ys), missing: { row, col } },
			},
			answer,
			mistakes,
			kind,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the formula of a direct or inverse table

const directLatex = (k: Rational) => `y = ${coefX(k)}`;
const inverseLatex = (k: Rational) => `y = \\dfrac{${num(k)}}{x}`;
const formulaOption = (latex: string, sympy: string): ChoiceOption => ({ latex, values: [sympy] });
const directOpt = (k: Rational) => formulaOption(directLatex(k), `${sympyRat(k)}*x`);
const inverseOpt = (k: Rational) => (dec(k, 2) === null ? null : formulaOption(inverseLatex(k), `${sympyRat(k)}/x`));
const linOpt = (m: Rational, c: Rational) => formulaOption(`y = ${linLatex(m, c)}`, `${sympyRat(m)}*x ${c.sign() < 0 ? '-' : '+'} ${sympyRat(c.abs())}`);

function level3(rng: Rng): { built: Built; answer: ChoiceOption; distractors: (ChoiceOption | null)[]; kind: Kind } {
	for (;;) {
		const kind = rng.pick(['diretta', 'inversa'] as const);
		const tb = propTable(rng, kind, 4);
		if (!tb || tb.ys.some((y) => y.num > 999)) continue;
		const { xs, ys, k } = tb;
		const steps: string[] = [];
		let answer: ChoiceOption;
		let distractors: (ChoiceOption | null)[];
		const r1 = ys[0].div(xs[0]), r2 = ys[1].div(xs[1]);
		if (kind === 'diretta') {
			steps.push(`${t('Calcola il rapporto ')} \\dfrac{y}{x} ${t(' per ogni coppia: ')} ${xs.map((x, i) => `\\dfrac{${num(ys[i])}}{${num(x)}}`).join(' = ')} = ${num(k)}`);
			steps.push(`${t('Il rapporto è sempre lo stesso: è una proporzionalità diretta con ')} k = ${num(k)}${t('.')}`);
			answer = directOpt(k);
			const d = ys[0].sub(xs[0]);
			// the product of the first pair read as an inverse; the ratio x/y; the same difference
			distractors = [inverseOpt(xs[0].mul(ys[0])), directOpt(q(1).div(k)), d.isZero() ? null : linOpt(q(1), d), directOpt(k.add(q(1)))];
		} else {
			steps.push(`${t('I rapporti ')} \\dfrac{${num(ys[0])}}{${num(xs[0])}} ${t(' e ')} \\dfrac{${num(ys[1])}}{${num(xs[1])}} ${t(' sono diversi: non è una proporzionalità diretta.')}`);
			steps.push(`${t('Calcola il prodotto ')} x \\cdot y ${t(' per ogni coppia: ')} ${xs.map((x, i) => `${num(x)} \\cdot ${num(ys[i])}`).join(' = ')} = ${num(k)}`);
			steps.push(`${t('Il prodotto è sempre lo stesso: è una proporzionalità inversa con ')} k = ${num(k)}${t('.')}`);
			answer = inverseOpt(k)!;
			// the ratio of the first pair (only one pair checked); k times x; x over k
			distractors = [r1.equals(r2) ? null : directOpt(r1), directOpt(k), formulaOption(`y = \\dfrac{x}{${num(k)}}`, `x/${sympyRat(k)}`), directOpt(r2)];
		}
		if (steps.some((s) => s.length > 400)) continue;
		return {
			built: {
				prompt: 'Riconosci se la proporzionalità è diretta o inversa e scrivi la formula.',
				problem: `\\begin{gathered} ${tableLatex(xs, ys)} \\end{gathered}`,
				steps,
				solution: answer.latex,
				params: { kind, ...tableParams(xs, ys), k: k.toString() },
			},
			answer,
			distractors,
			kind,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the kind of a table, among five

interface Table4 {
	kind: Kind;
	xs: Rational[];
	ys: Rational[];
	trap: Kind | null;
}

function table4(rng: Rng, kind: Kind): Table4 | null {
	const n = rng.int(3, 4) + (rng.next() < 0.3 ? 1 : 0);
	if (kind === 'diretta' || kind === 'inversa') {
		const tb = propTable(rng, kind, n);
		return tb && { kind, xs: tb.xs, ys: tb.ys, trap: null };
	}
	if (kind === 'quadratica') {
		const k = rng.pick([1, 2, 3, 4, 5].map((v) => q(v)).concat([q(1, 2)]));
		const xs = increasing(rng, n, 1, k.isInteger() && k.num > 2 ? 6 : 9).map((x) => q(x));
		return { kind, xs, ys: xs.map((x) => k.mul(x).mul(x)), trap: null };
	}
	if (kind === 'lineare') {
		const m = q(rng.pick([-3, -2, -1, 1, 2, 3, 4, 5, 6]));
		const c = q(rng.pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
		const x0 = rng.int(1, 5);
		const xs = Array.from({ length: n }, (_, i) => q(x0 + i));
		return { kind, xs, ys: xs.map((x) => m.mul(x).add(c)), trap: null };
	}
	// nessuno: half a curve of none of the kinds, half a table where only the first two pairs work
	if (rng.next() < 0.5) {
		const shape = rng.pick(['x2+c', 'x2+x', 'doppio', 'x3']);
		const c = rng.pick([-3, -2, -1, 1, 2, 3, 4, 5]);
		const x0 = rng.int(1, 3);
		const xs = Array.from({ length: n }, (_, i) => x0 + i);
		const f = (x: number) => (shape === 'x2+c' ? x * x + c : shape === 'x2+x' ? x * x + x : shape === 'doppio' ? 3 * 2 ** x : x ** 3);
		return { kind, xs: xs.map((x) => q(x)), ys: xs.map((x) => q(f(x))), trap: null };
	}
	const trap = rng.pick(['diretta', 'inversa', 'quadratica'] as const);
	const base = trap === 'quadratica' ? table4(rng, 'quadratica') : propTable(rng, trap, n);
	if (!base) return null;
	const ys = [...base.ys];
	// The last pair breaks the rule: a nearby value, kept nice.
	const L = ys.length - 1;
	const last = ys[L];
	const bump = last.isInteger() ? q(rng.pick([1, 2, 3, 4, 5]) * rng.pick([1, -1])) : q(rng.pick([1, 2, 3]) * rng.pick([1, -1]), 2);
	ys[L] = last.add(bump);
	if (ys[L].sign() <= 0) return null;
	return { kind, xs: base.xs, ys, trap };
}

const TABLE_TEST: Record<Exclude<Kind, 'nessuno'>, string> = {
	diretta: '\\dfrac{y}{x}',
	inversa: 'x \\cdot y',
	quadratica: '\\dfrac{y}{x^2}',
	lineare: '',
};

function testValues(kind: 'diretta' | 'inversa' | 'quadratica', xs: Rational[], ys: Rational[]): Rational[] {
	return xs.map((x, i) => (kind === 'diretta' ? ys[i].div(x) : kind === 'inversa' ? x.mul(ys[i]) : ys[i].div(x.mul(x))));
}

/** A value for the steps: a decimal when short, a fraction otherwise. */
const shown = (r: Rational) => dec(r, 4) ?? `${r.sign() < 0 ? '-' : ''}\\dfrac{${Math.abs(r.num)}}{${r.den}}`;
const listOf = (rs: Rational[]) => rs.map(shown).join(',\\ ');

function level4(rng: Rng): { built: Built; answer: ChoiceAnswer; kind: Kind; trap: Kind | null } {
	for (;;) {
		const kind = rng.pick(KINDS);
		const tb = table4(rng, kind);
		if (!tb || classify(tb.xs, tb.ys) !== kind) continue;
		if (tb.ys.some((y) => dec(y, 2) === null || Math.abs(y.num / y.den) > 999)) continue;
		const { xs, ys } = tb;
		const steps: string[] = [];
		const tests = ['diretta', 'inversa', 'quadratica'] as const;
		for (const test of tests) {
			const vals = testValues(test, xs, ys);
			if (kind === test) {
				steps.push(`${t('Calcola ')} ${TABLE_TEST[test]} ${t(' per ogni coppia: ')} ${listOf(vals)}${t('. È sempre lo stesso numero.')}`);
				break;
			}
			const same2 = vals[0].equals(vals[1]);
			steps.push(
				same2
					? `${TABLE_TEST[test]}${t(': ')} ${listOf(vals)}${t('. Le prime due coppie danno lo stesso numero, le altre no: non basta.')}`
					: `${TABLE_TEST[test]}${t(': ')} ${listOf(vals)}${t('. Non è costante.')}`,
			);
		}
		if (kind === 'lineare' || kind === 'nessuno') {
			const incs = xs.slice(1).map((x, i) => ys[i + 1].sub(ys[i]).div(x.sub(xs[i])));
			steps.push(
				kind === 'lineare'
					? `${t('Aumenti di ')} y ${t(' quando ')} x ${t(' aumenta di 1: ')} ${listOf(incs)}${t('. Sono tutti uguali, quindi ')} m = ${shown(incs[0])}${t('.')}`
					: `${t('Aumenti di ')} y ${t(' divisi per gli aumenti di ')} x ${t(': ')} ${listOf(incs)}${t('. Non sono tutti uguali.')}`,
			);
		}
		const final: Record<Kind, string> = {
			diretta: 'È una proporzionalità diretta.',
			inversa: 'È una proporzionalità inversa.',
			quadratica: 'È una proporzionalità quadratica.',
			lineare: 'È una funzione lineare, non una proporzionalità.',
			nessuno: 'Nessun controllo dà un numero costante: la tabella non è di nessuno dei quattro tipi.',
		};
		steps.push(t(final[kind]));
		// Options: the right kind and three others, always keeping the one a student would pick by mistake.
		const lure: Kind | null = tb.trap ?? (kind === 'lineare' ? (ys[ys.length - 1].compare(ys[0]) > 0 ? 'diretta' : 'inversa') : kind === 'quadratica' ? 'diretta' : null);
		const others = shuffle(
			rng,
			KINDS.filter((k) => k !== kind && k !== lure),
		);
		const kinds: Kind[] = [kind, ...(lure ? [lure] : []), ...others].slice(0, 4);
		return {
			built: {
				prompt: 'Stabilisci che tipo di legame c\'è tra x e y.',
				problem: `\\begin{gathered} ${tableLatex(xs, ys)} \\end{gathered}`,
				steps,
				solution: t(final[kind]),
				params: { kind, ...tableParams(xs, ys), trap: tb.trap ?? '' },
			},
			answer: kindChoice(kinds, kind),
			kind,
			trap: tb.trap,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: m and q of a linear function from a table

function level5(rng: Rng): { built: Built; answer: ChoiceOption; distractors: (ChoiceOption | null)[]; kind: string } {
	for (;;) {
		const m = q(rng.pick([-4, -3, -2, -1, 1, 2, 3, 3, 4, 4, 5, 6]));
		const c = q(rng.pick([-9, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
		const equi = rng.next() < 1 / 3;
		const x0 = rng.int(1, 3), step = rng.pick([1, 1, 2]);
		const xsN = equi ? Array.from({ length: 4 }, (_, i) => x0 + i * step) : increasing(rng, 4, 1, 10);
		const xs = xsN.map((x) => q(x));
		const gaps = xsN.slice(1).map((x, i) => x - xsN[i]);
		const isEqui = gaps.every((g) => g === gaps[0]);
		if (isEqui !== equi) continue;
		const ys = xs.map((x) => m.mul(x).add(c));
		if (ys.some((y) => Math.abs(y.num) > 60) || ys.some((y) => y.isZero())) continue;
		const steps: string[] = [];
		if (gaps.every((g) => g === 1)) {
			steps.push(`${t('I valori di ')} x ${t(' aumentano di 1 alla volta: gli aumenti di ')} y ${t(' sono ')} ${ys.slice(1).map((y, i) => num(y.sub(ys[i]))).join(',\\ ')}${t(', tutti uguali. Quindi ')} m = ${num(m)}${t('.')}`);
		} else {
			steps.push(`${t('Dividi ogni aumento di ')} y ${t(' per il corrispondente aumento di ')} x${t(':')}`);
			for (let i = 1; i < 4; i++) steps.push(`\\dfrac{${num(ys[i])} ${ys[i - 1].sign() < 0 ? '+' : '-'} ${num(ys[i - 1].abs())}}{${num(xs[i])} - ${num(xs[i - 1])}} = \\dfrac{${num(ys[i].sub(ys[i - 1]))}}{${gaps[i - 1]}} = ${num(m)}`);
			steps.push(`${t('Il rapporto è sempre lo stesso: ')} m = ${num(m)}${t('.')}`);
		}
		const mx1 = m.mul(xs[0]);
		steps.push(`${t('Dalla prima coppia: ')} q = y - mx = ${num(ys[0])} - ${m.sign() < 0 || mx1.sign() < 0 ? `(${num(mx1)})` : num(mx1)} = ${num(c)}`);
		steps.push(`${t('La funzione è ')} y = ${linLatex(m, c)}${t('. Controllo sull\'ultima coppia: ')} ${m.sign() < 0 ? `(${num(m)})` : num(m)} \\cdot ${num(xs[3])} ${c.sign() < 0 ? '-' : '+'} ${num(c.abs())} = ${num(ys[3])}`);
		const answer = linOpt(m, c);
		// the first increment of y, not divided by the increment of x; q with the wrong sign; the first y read as q;
		// the ratio y/x of the first pair (a direct proportionality); m and q swapped
		const d1 = ys[1].sub(ys[0]);
		const distractors = [
			gaps[0] !== 1 ? linOpt(d1, ys[0].sub(d1.mul(xs[0]))) : null,
			linOpt(m, c.neg()),
			ys[0].equals(c) ? null : linOpt(m, ys[0]),
			dec(ys[0].div(xs[0]), 2) !== null ? directOpt(ys[0].div(xs[0])) : null,
			m.equals(c) ? null : linOpt(c, m),
			linOpt(m.neg(), c),
		];
		return {
			built: {
				prompt: 'La tabella è di una funzione lineare y = mx + q. Trova m e q.',
				problem: `\\begin{gathered} ${tableLatex(xs, ys)} \\end{gathered}`,
				steps,
				solution: answer.latex,
				params: { ...tableParams(xs, ys), m: m.toString(), q: c.toString(), equidistant: isEqui },
			},
			answer,
			distractors,
			kind: isEqui ? 'equidistanti' : 'passi diversi',
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: one-line problems, direct or inverse

const ITEMS = [
	{ one: 'quaderno', many: 'quaderni', lo: 80, hi: 350 },
	{ one: 'penna', many: 'penne', lo: 50, hi: 250 },
	{ one: 'biglietto del bus', many: 'biglietti del bus', lo: 120, hi: 250 },
	{ one: 'gelato', many: 'gelati', lo: 150, hi: 350 },
];

interface Problem {
	story: string;
	dir: 'diretta' | 'inversa' | 'quadratica' | 'due tempi';
	data: Record<string, string>;
	prose: string;
	steps: string[];
	answer: Rational;
	money: boolean;
	given: Rational[];
	mistakes: Rational[];
	solution: string;
}

/** Hours in words: "3 ore", "2 ore e mezza", "1 ora". */
function hoursProse(h: Rational): string {
	const whole = Math.floor(h.num / h.den);
	const half = !h.isInteger();
	return `${whole} or${whole === 1 ? 'a' : 'e'}${half ? ' e mezza' : ''}`;
}

const P6: ((rng: Rng) => Problem | null)[] = [
	// quaderni: direct, price of n2 items
	(rng) => {
		const it = rng.pick(ITEMS);
		const u = q(rng.int(it.lo / 10, it.hi / 10), 10);
		const n1 = rng.int(2, 12), n2 = rng.int(2, 20);
		if (n1 === n2) return null;
		const c1 = u.mul(q(n1)), ans = u.mul(q(n2));
		return {
			story: 'quaderni',
			dir: 'diretta',
			data: { item: it.many, n1: String(n1), n2: String(n2), c1: c1.toString() },
			prose: `${n1} ${it.many} costano ${inProse(eur(c1))} euro. Quanto costano ${n2} ${it.many}, in euro?`,
			steps: [
				t('Il doppio degli oggetti costa il doppio: la proporzionalità è diretta.'),
				`${t(`La costante è il prezzo di un ${it.one}: `)} k = \\dfrac{${eur(c1)}}{${n1}} = ${eur(u)}`,
				`y = ${eur(u)} \\cdot ${n2} = ${eur(ans)}`,
			],
			answer: ans,
			money: true,
			given: [q(n1), q(n2), c1],
			// inverse law; the price of one; the same difference
			mistakes: [c1.mul(q(n1)).div(q(n2)), u, c1.add(q(n2 - n1)), c1.mul(q(n2))],
			solution: `${t(`${n2} ${it.many} costano `)} ${eur(ans)} ${t(' euro')}`,
		};
	},
	// rubinetto: direct, litres in t2 minutes
	(rng) => {
		const r = q(rng.int(4, 30), rng.pick([1, 2]));
		const t1 = rng.int(2, 12), t2 = rng.int(2, 25);
		if (t1 === t2) return null;
		const L1 = r.mul(q(t1)), ans = r.mul(q(t2));
		if (!L1.isInteger()) return null;
		return {
			story: 'rubinetto',
			dir: 'diretta',
			data: { t1: String(t1), t2: String(t2), L1: L1.toString() },
			prose: `Un rubinetto versa ${num(L1)} litri d'acqua in ${t1} minuti. Quanti litri versa in ${t2} minuti?`,
			steps: [
				t('In un tempo doppio versa il doppio dei litri: la proporzionalità è diretta.'),
				`${t('La costante è il numero di litri in un minuto: ')} k = \\dfrac{${num(L1)}}{${t1}} = ${num(r)}`,
				`y = ${num(r)} \\cdot ${t2} = ${num(ans)}`,
			],
			answer: ans,
			money: false,
			given: [q(t1), q(t2), L1],
			mistakes: [L1.mul(q(t1)).div(q(t2)), r, L1.add(q(t2 - t1)), L1.mul(q(t2))],
			solution: `${num(ans)} ${t(' litri')}`,
		};
	},
	// paga: direct, earnings for h2 hours
	(rng) => {
		const u = q(rng.int(14, 30) * 5, 10);
		const h1 = rng.int(2, 10), h2 = rng.int(2, 30);
		if (h1 === h2) return null;
		const E1 = u.mul(q(h1)), ans = u.mul(q(h2));
		return {
			story: 'paga',
			dir: 'diretta',
			data: { h1: String(h1), h2: String(h2), E1: E1.toString() },
			prose: `Per ${h1} ore di lavoro in un bar si guadagnano ${inProse(eur(E1))} euro. Quanto si guadagna in ${h2} ore, in euro?`,
			steps: [
				t('Il doppio delle ore dà il doppio della paga: la proporzionalità è diretta.'),
				`${t('La costante è la paga di un\'ora: ')} k = \\dfrac{${eur(E1)}}{${h1}} = ${eur(u)}`,
				`y = ${eur(u)} \\cdot ${h2} = ${eur(ans)}`,
			],
			answer: ans,
			money: true,
			given: [q(h1), q(h2), E1],
			mistakes: [E1.mul(q(h1)).div(q(h2)), u, E1.add(q(h2 - h1)), E1.mul(q(h2))],
			solution: `${eur(ans)} ${t(' euro')}`,
		};
	},
	// velocita: inverse, the time at v2 or the speed for a time t2
	(rng): Problem | null => {
		const v1 = rng.int(4, 13) * 10, t1 = q(rng.int(2, 8), rng.pick([1, 1, 2]));
		if (!t1.mul(q(2)).isInteger() || t1.compare(q(1)) <= 0) return null;
		const k = t1.mul(q(v1));
		if (!k.isInteger()) return null;
		if (rng.next() < 0.5) {
			const v2 = rng.int(4, 13) * 10;
			const ans = k.div(q(v2));
			if (v2 === v1 || !ans.mul(q(2)).isInteger()) return null;
			return {
				story: 'velocita-tempo',
				dir: 'inversa',
				data: { v1: String(v1), t1: t1.toString(), v2: String(v2) },
				prose: `A ${v1} km/h un viaggio dura ${hoursProse(t1)}. Quante ore dura lo stesso viaggio a ${v2} km/h?`,
				steps: [
					t('Al doppio della velocità si impiega metà del tempo: la proporzionalità è inversa.'),
					`${t('La costante è il prodotto, cioè la lunghezza del viaggio: ')} k = ${v1} \\cdot ${num(t1)} = ${num(k)}`,
					`t = \\dfrac{${num(k)}}{${v2}} = ${num(ans)}`,
				],
				answer: ans,
				money: false,
				given: [q(v1), t1, q(v2)],
				// direct proportion; the length of the trip; the time unchanged minus/plus the speeds' ratio
				// the direct law of the warning; the length of the trip; the new speed divided by the old time
				mistakes: [t1.mul(q(v2)).div(q(v1)), k, q(v2).div(t1)],
				solution: `${num(ans)} ${t(' ore')}`,
			};
		}
		const t2 = q(rng.int(2, 12), 2);
		const ans = k.div(t2);
		if (t2.equals(t1) || !ans.isInteger() || ans.num > 200 || ans.num < 20) return null;
		const mistakes = [q(v1).mul(t2).div(t1), k];
		// 2 ore e mezza read as 2,30
		if (!t2.isInteger()) mistakes.unshift(k.div(q(Math.floor(t2.num / t2.den) * 10 + 3, 10)));
		return {
			story: 'velocita-ore',
			dir: 'inversa',
			data: { v1: String(v1), t1: t1.toString(), t2: t2.toString() },
			prose: `A ${v1} km/h un viaggio dura ${hoursProse(t1)}. A che velocità, in km/h, bisogna andare per metterci ${hoursProse(t2)}?`,
			steps: [
				t('Più veloce vai, meno tempo ci metti: la proporzionalità è inversa.'),
				`${t('La costante è la lunghezza del viaggio: ')} k = ${v1} \\cdot ${num(t1)} = ${num(k)}`,
				...(t2.isInteger() ? [] : [`${t(`${hoursProse(t2)} sono `)} ${num(t2)} ${t(' ore, non ')} ${Math.floor(t2.num / t2.den)}{,}30${t('.')}`]),
				`v = \\dfrac{${num(k)}}{${num(t2)}} = ${num(ans)}`,
			],
			answer: ans,
			money: false,
			given: [q(v1), t1, t2],
			mistakes,
			solution: `${num(ans)} ${t(' km/h')}`,
		};
	},
	// operai: inverse, days for n2 workers
	(rng) => {
		const n1 = rng.int(2, 12), g1 = rng.int(3, 30), n2 = rng.int(2, 15);
		const k = n1 * g1;
		const ans = q(k, n2);
		if (n1 === n2 || dec(ans, 1) === null || ans.equals(q(g1))) return null;
		return {
			story: 'operai',
			dir: 'inversa',
			data: { n1: String(n1), g1: String(g1), n2: String(n2) },
			prose: `${n1} operai finiscono un lavoro in ${g1} giorni. Quanti giorni servono a ${n2} operai, se lavorano allo stesso ritmo?`,
			steps: [
				t('Con il doppio degli operai il lavoro dura la metà dei giorni: la proporzionalità è inversa.'),
				`${t('La costante è il prodotto: ')} k = ${n1} \\cdot ${g1} = ${k}${t(', i giorni di lavoro di un operaio.')}`,
				`\\dfrac{${k}}{${n2}} = ${num(ans)}`,
			],
			answer: ans,
			money: false,
			given: [q(n1), q(g1), q(n2)],
			// the direct proportion of the warning; the product; the same difference
			mistakes: [q(g1 * n2, n1), q(k), q(g1 - (n2 - n1)), q(g1 + (n2 - n1))],
			solution: `${num(ans)} ${t(' giorni')}`,
		};
	},
	// rubinetti: inverse, minutes with r2 taps
	(rng) => {
		const r1 = rng.int(2, 6), m1 = rng.int(3, 18) * 5, r2 = rng.int(2, 8);
		const k = r1 * m1;
		const ans = q(k, r2);
		if (r1 === r2 || dec(ans, 1) === null) return null;
		return {
			story: 'rubinetti',
			dir: 'inversa',
			data: { r1: String(r1), m1: String(m1), r2: String(r2) },
			prose: `Con ${r1} rubinetti uguali aperti una vasca si riempie in ${m1} minuti. In quanti minuti si riempie con ${r2} rubinetti?`,
			steps: [
				t('Con il doppio dei rubinetti serve metà del tempo: la proporzionalità è inversa.'),
				`${t('La costante è il prodotto: ')} k = ${r1} \\cdot ${m1} = ${k}${t(', i minuti che servirebbero a un rubinetto solo.')}`,
				`\\dfrac{${k}}{${r2}} = ${num(ans)}`,
			],
			answer: ans,
			money: false,
			given: [q(r1), q(m1), q(r2)],
			mistakes: [q(m1 * r2, r1), q(k), q(m1 - (r2 - r1)), q(m1 + (r2 - r1))],
			solution: `${num(ans)} ${t(' minuti')}`,
		};
	},
	// scatole: inverse, boxes of another size
	(rng) => {
		const c1 = rng.pick([6, 8, 10, 12, 15, 20, 24, 25, 30]), s1 = rng.int(3, 30);
		const c2 = rng.pick([4, 5, 6, 8, 10, 12, 15, 16, 20, 24, 25, 30, 40]);
		const k = c1 * s1;
		if (c1 === c2 || k % c2 !== 0) return null;
		const ans = q(k / c2);
		return {
			story: 'scatole',
			dir: 'inversa',
			data: { s1: String(s1), c1: String(c1), c2: String(c2) },
			prose: `Per spedire dei libri servono ${s1} scatole da ${c1} libri ciascuna. Quante scatole servono con scatole da ${c2} libri?`,
			steps: [
				t('Con scatole grandi il doppio servono metà delle scatole: la proporzionalità è inversa.'),
				`${t('La costante è il prodotto, cioè il numero dei libri: ')} k = ${s1} \\cdot ${c1} = ${k}`,
				`\\dfrac{${k}}{${c2}} = ${num(ans)}`,
			],
			answer: ans,
			money: false,
			given: [q(s1), q(c1), q(c2)],
			mistakes: [q(s1 * c2, c1), q(k), q(s1 - (c2 - c1)), q(s1 + (c2 - c1))],
			solution: `${num(ans)} ${t(' scatole')}`,
		};
	},
];

// ---------------------------------------------------------------------------
// Level 7: two stages, or proportional to the square

const P7: ((rng: Rng) => Problem | null)[] = [
	// cantiere: workers leave or arrive part-way
	(rng) => {
		const N = rng.int(6, 16), G = rng.int(8, 30), d = rng.int(2, G - 3);
		const leave = rng.next() < 0.6;
		const r = leave ? rng.int(2, Math.floor(N / 2)) : rng.int(2, 8);
		const N2 = leave ? N - r : N + r;
		const W = N * (G - d);
		const rest = q(W, N2);
		if (!rest.mul(q(2)).isInteger() || rest.equals(q(G - d))) return null;
		const ask = rng.pick(['totale', 'restanti'] as const);
		const ans = ask === 'totale' ? rest.add(q(d)) : rest;
		const verb = leave ? `${r} operai vengono spostati su un altro cantiere` : `arrivano altri ${r} operai`;
		if (r === 1) return null;
		return {
			story: 'cantiere',
			dir: 'due tempi',
			data: { N: String(N), G: String(G), d: String(d), r: String(r), leave: leave ? '1' : '0', ask },
			prose: `${N} operai devono finire un lavoro in ${G} giorni. Dopo ${d} giorni ${verb}. ${ask === 'totale' ? 'Quanti giorni dura in tutto il lavoro?' : 'Quanti giorni servono ancora per finire il lavoro?'}`,
			steps: [
				`${t('Il lavoro intero vale ')} ${N} \\cdot ${G} = ${N * G} ${t(' giorni di lavoro di un operaio.')}`,
				`${t(`Nei primi ${d} giorni ne sono stati fatti `)} ${N} \\cdot ${d} = ${N * d}${t(', ne restano ')} ${W}${t('.')}`,
				`${t('Ora gli operai sono ')} ${N} ${leave ? '-' : '+'} ${r} = ${N2}${t(': ')} \\dfrac{${W}}{${N2}} = ${num(rest)}`,
				...(ask === 'totale' ? [`${t('In tutto: ')} ${d} + ${num(rest)} = ${num(ans)}`] : []),
			],
			answer: ans,
			money: false,
			given: [q(N), q(G), q(d), q(r)],
			// the inverse law on the whole work; the other question; the direct law on the days left; the plan unchanged
			mistakes: [q(N * G, N2), ask === 'totale' ? rest : rest.add(q(d)), q((G - d) * N2, N).add(ask === 'totale' ? q(d) : q(0)), q(N * G, N2).add(q(d)), q(G)],
			solution: `${num(ans)} ${t(' giorni')}`,
		};
	},
	// pizza: price proportional to the square of the diameter
	(rng) => {
		const d1 = rng.pick([20, 24, 26, 28, 30, 32, 36, 40]);
		const ratio = rng.pick([q(3, 2), q(2), q(5, 4), q(1, 2), q(3, 4), q(4, 3), q(6, 5)]);
		const d2 = ratio.mul(q(d1));
		if (!d2.isInteger() || d2.num < 12 || d2.num > 60) return null;
		const p1 = q(rng.int(8, 30) * 50, 100);
		const ans = p1.mul(ratio).mul(ratio);
		if (!ans.mul(q(100)).isInteger()) return null;
		return {
			story: 'pizza',
			dir: 'quadratica',
			data: { d1: String(d1), d2: d2.toString(), p1: p1.toString() },
			prose: `Una pizzeria fa pagare le pizze in proporzione alla superficie. Una pizza di ${d1} cm di diametro costa ${inProse(eur(p1))} euro. Quanto costa, in euro, una pizza di ${d2.num} cm?`,
			steps: [
				t('La superficie è proporzionale al quadrato del diametro: la proporzionalità è quadratica.'),
				`${t('Il diametro viene moltiplicato per ')} \\dfrac{${d2.num}}{${d1}} = ${shown(ratio)}${t(', quindi il prezzo per ')} ${ratio.isInteger() || dec(ratio, 2) !== null ? `${shown(ratio)}^2` : `\\left(\\dfrac{${ratio.num}}{${ratio.den}}\\right)^2`} = ${shown(ratio.mul(ratio))}`,
				`${eur(p1)} \\cdot ${shown(ratio.mul(ratio))} = ${eur(ans)}`,
			],
			answer: ans,
			money: true,
			given: [q(d1), d2, p1],
			// the diameter treated as directly proportional (the lesson's 12 instead of 18); the square read as double; the ratio cubed
			mistakes: [p1.mul(ratio), p1.mul(ratio).mul(q(2)), p1.mul(ratio).mul(ratio).mul(ratio), p1.add(d2.sub(q(d1)))],
			solution: `${eur(ans)} ${t(' euro')}`,
		};
	},
	// vernice: paint for a square floor
	(rng) => {
		const l1 = rng.int(2, 6), l2 = rng.int(2, 10);
		const v1 = q(rng.int(2, 12), rng.pick([1, 2]));
		if (l1 === l2) return null;
		const ratio = q(l2, l1);
		const ans = v1.mul(ratio).mul(ratio);
		if (dec(ans, 1) === null || ans.num / ans.den > 200) return null;
		return {
			story: 'vernice',
			dir: 'quadratica',
			data: { l1: String(l1), l2: String(l2), v1: v1.toString() },
			prose: `Per verniciare un pavimento quadrato con il lato di ${l1} m servono ${inProse(num(v1))} litri di vernice. Quanti litri servono per un pavimento quadrato con il lato di ${l2} m?`,
			steps: [
				t('La vernice è proporzionale alla superficie, cioè al quadrato del lato: la proporzionalità è quadratica.'),
				`${t('La costante è la vernice per un metro quadrato: ')} k = \\dfrac{${num(v1)}}{${l1}^2} = ${shown(v1.div(q(l1 * l1)))}`,
				`${shown(v1.div(q(l1 * l1)))} \\cdot ${l2}^2 = ${num(ans)}`,
			],
			answer: ans,
			money: false,
			given: [q(l1), q(l2), v1],
			mistakes: [v1.mul(ratio), v1.mul(ratio).mul(q(2)), v1.mul(q(l2 * l2)), v1.add(q(l2 - l1))],
			solution: `${num(ans)} ${t(' litri')}`,
		};
	},
];

function problemLevel(rng: Rng, level: 6 | 7): { p: Problem; built: Built } {
	// The story is drawn once and only its numbers are drawn again, so the shares stay as in the spec:
	// level 6 half direct and half inverse, level 7 half workers and half squares.
	const builder = level === 6 ? (rng.next() < 0.5 ? rng.pick(P6.slice(0, 3)) : rng.pick(P6.slice(3))) : rng.next() < 0.5 ? P7[0] : rng.pick(P7.slice(1));
	for (let i = 0; i < 5000; i++) {
		const p = builder(rng);
		if (!p || p.answer.sign() <= 0 || p.given.some((g) => g.equals(p.answer))) continue;
		if (!numberOption(p.answer, p.money)) continue;
		const built: Built = {
			prompt: 'Risolvi il problema.',
			problem: textBlock(p.prose),
			steps: p.steps,
			solution: p.solution,
			params: { story: p.story, dir: p.dir, ...p.data },
		};
		return { p, built };
	}
	throw new Error(`${ID}: no problem for level ${level}`);
}

// ---------------------------------------------------------------------------
// Assembly

function formulaChoice(rng: Rng, answer: ChoiceOption, distractors: (ChoiceOption | null)[]): ChoiceAnswer {
	const opts: ChoiceOption[] = [answer];
	for (const d of distractors) {
		if (d && opts.length < 4 && !opts.some((o) => o.latex === d.latex || o.values[0] === d.values[0])) opts.push(d);
	}
	if (opts.length < 4) throw new Error(`${ID}: only ${opts.length} formula options`);
	const order = shuffle(
		rng,
		opts.map((_, i) => i),
	);
	return { kind: 'choice', options: order.map((i) => opts[i]), correct: order.indexOf(0) };
}

function sample(level: number, seed: number, b: Built, answer: Sample['answer'], choice?: ChoiceAnswer): Sample {
	return { generatorId: ID, level, seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer, choice, params: b.params };
}

function generate(rng: Rng, level: number): Sample {
	const seed = rng.seed;
	switch (level) {
		case 1: {
			const r = level1(rng);
			return sample(1, seed, { ...r.built, params: { ...r.built.params, case: r.kind } }, r.answer);
		}
		case 2: {
			const r = level2(rng);
			const s = sample(2, seed, { ...r.built, params: { ...r.built.params, case: r.kind } }, { kind: 'number', value: r.answer.toString() });
			s.params.mistakes = r.mistakes.map((m) => m.toString());
			return s;
		}
		case 3: {
			const r = level3(rng);
			const s = sample(3, seed, { ...r.built, params: { ...r.built.params, case: r.kind } }, { kind: 'expression', value: r.answer.values[0], latex: r.answer.latex });
			s.choice = formulaChoice(rng, r.answer, r.distractors);
			return s;
		}
		case 4: {
			const r = level4(rng);
			return sample(4, seed, { ...r.built, params: { ...r.built.params, case: r.trap ? 'trappola' : r.kind } }, r.answer);
		}
		case 5: {
			const r = level5(rng);
			const s = sample(5, seed, { ...r.built, params: { ...r.built.params, case: r.kind } }, { kind: 'expression', value: r.answer.values[0], latex: r.answer.latex });
			s.choice = formulaChoice(rng, r.answer, r.distractors);
			return s;
		}
		case 6:
		case 7: {
			const { p, built } = problemLevel(rng, level);
			const s = sample(level, seed, { ...built, params: { ...built.params, case: level === 6 ? p.dir : p.story } }, { kind: 'number', value: p.answer.toString() });
			s.params.money = p.money;
			s.params.mistakes = p.mistakes.map((m) => m.toString());
			return s;
		}
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function toChoice(s: Sample, rng: Rng): ChoiceAnswer {
	if (s.answer.kind === 'choice') return s.answer;
	if (s.choice) return s.choice;
	if (s.answer.kind === 'number') {
		const mistakes = ((s.params.mistakes as string[]) ?? []).map((m) => Rational.parse(m));
		return numberChoice(rng, Rational.parse(s.answer.value), mistakes, Boolean(s.params.money));
	}
	throw new Error(`${ID}: no choice for level ${s.level}`);
}

// ---------------------------------------------------------------------------
// Checks

function check(s: Sample): string[] {
	const v: string[] = [];
	const p = s.params as Record<string, unknown>;
	const rat = (x: unknown) => Rational.parse(String(x));
	const cells = (xs: unknown) => (xs as string[]).map((c) => (c === '?' ? null : rat(c)));
	if (!s.steps.length) v.push('passaggi mancanti');
	if (/—|piuttosto che/.test(s.problem + s.steps.join(' '))) v.push('parole vietate');
	if ([2, 3, 4, 5].includes(s.level)) {
		const xs = cells(p.xs), ys = cells(p.ys);
		if (xs.some((x) => x !== null && x.sign() <= 0)) v.push('x non positivo');
		if (s.level >= 3) {
			const kind = classify(xs as Rational[], ys as Rational[]);
			const want = s.level === 5 ? 'lineare' : String(p.kind);
			if (kind !== want) v.push(`tabella di tipo ${kind}, attesa ${want}`);
		}
		if (s.level === 2) {
			const known = xs.map((x, i) => [x, ys[i]] as const).filter(([x, y]) => x && y);
			const k = p.kind === 'diretta' ? known[0][1]!.div(known[0][0]!) : known[0][1]!.mul(known[0][0]!);
			const ok = known.every(([x, y]) => (p.kind === 'diretta' ? y!.div(x!) : y!.mul(x!)).equals(k));
			if (!ok) v.push('coppie note incoerenti');
			const m = p.missing as { row: string; col: number };
			const other = m.row === 'y' ? xs[m.col]! : ys[m.col]!;
			const truth = p.kind === 'diretta' ? (m.row === 'y' ? k.mul(other) : other.div(k)) : k.div(other);
			if (s.answer.kind !== 'number' || !rat(s.answer.value).equals(truth)) v.push('valore mancante sbagliato');
		}
	}
	if (s.level === 1 || s.level === 4) {
		const want = s.level === 1 ? p.case : p.kind;
		if (s.answer.kind !== 'choice' || s.answer.options[s.answer.correct].values[0] !== want) v.push('opzione giusta sbagliata');
	}
	const ch = s.answer.kind === 'choice' ? s.answer : s.choice;
	if (ch) {
		if (ch.options.length !== 4) v.push('non quattro opzioni');
		if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
		if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni con lo stesso testo');
	}
	return v;
}

export const funzioniLineari: Generator = {
	id: ID,
	title: 'Proporzionalità diretta e inversa',
	levels: {
		1: { label: 'Il tipo di legame da una formula o da una situazione', constraints: ['diretta, inversa, quadratica o lineare, un quarto ciascuna', 'metà formule, metà situazioni a parole'] },
		2: { label: 'Il valore mancante in una tabella', constraints: ['il tipo è dato: diretta o inversa', 'un solo valore mancante, in y o in x; risultato decimale finito'] },
		3: { label: 'La formula da una tabella', constraints: ['diretta o inversa, da riconoscere', 'k intero o decimale'] },
		4: { label: 'Il tipo da una tabella, tra cinque', constraints: ['diretta, inversa, quadratica, lineare, nessuno, un quinto ciascuno', 'metà dei "nessuno" con le prime due coppie che tornano'] },
		5: { label: 'La funzione lineare da una tabella', constraints: ['m e q interi non nulli', 'due su tre con i valori di x non equidistanti'] },
		6: { label: 'Problemi di proporzionalità diretta e inversa', constraints: ['metà diretta, metà inversa', 'risposta positiva con al massimo due decimali'] },
		7: { label: 'Problemi in due tempi e con il quadrato', constraints: ['metà operai che cambiano a metà lavoro, metà proporzionalità quadratica'] },
	},
	generate,
	check,
	toChoice,
};

export default funzioniLineari;
