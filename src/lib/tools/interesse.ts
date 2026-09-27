import { fail, type Outcome, type ResultRow, type Step } from './types';
import { parseDecimal } from './numbers';

/**
 * Simple and compound interest, as in the books: I = C · r · t / 100 and M = C + I for simple interest,
 * M = C · (1 + i)ᵗ with i = r / 100 for compound interest, the interest of each year added to the capital. The time
 * is in years and months (a month is a twelfth of a year). With months, compound interest uses the same formula with a
 * fractional exponent (the "convenzione esponenziale" of the books). From the formula the tool also finds the capital
 * or the rate. Exact arithmetic on big-integer fractions where the result is rational; euro amounts rounded to the
 * cent, and the rounding said.
 */

export type Regime = 'semplice' | 'composto';
export type Unknown = 'montante' | 'capitale' | 'tasso';

export interface InteresseInput {
	regime: Regime;
	cerca: Unknown;
	/** Capital, montante and rate as typed. */
	c: string;
	m: string;
	r: string;
	anni: string;
	mesi: string;
}

/* ---------------------------------------------------------------- exact fractions */

function gcd(a: bigint, b: bigint): bigint {
	if (a < 0n) a = -a;
	while (b) [a, b] = [b, a % b];
	return a;
}

/** A fraction of big integers, reduced, denominator positive. */
class Q {
	readonly n: bigint;
	readonly d: bigint;
	constructor(n: bigint, d = 1n) {
		if (d < 0n) [n, d] = [-n, -d];
		const g = gcd(n, d) || 1n;
		this.n = n / g;
		this.d = d / g;
	}
	static int(k: number) {
		return new Q(BigInt(k));
	}
	add(o: Q) {
		return new Q(this.n * o.d + o.n * this.d, this.d * o.d);
	}
	sub(o: Q) {
		return new Q(this.n * o.d - o.n * this.d, this.d * o.d);
	}
	mul(o: Q) {
		return new Q(this.n * o.n, this.d * o.d);
	}
	div(o: Q) {
		return new Q(this.n * o.d, this.d * o.n);
	}
	pow(k: number) {
		return new Q(this.n ** BigInt(k), this.d ** BigInt(k));
	}
	isInt() {
		return this.d === 1n;
	}
	sign() {
		return this.n === 0n ? 0 : this.n > 0n ? 1 : -1;
	}
	toNumber() {
		return Number(this.n) / Number(this.d);
	}
}

/** A float as a fraction, to 12 decimals: for the results of a fractional power or a root, always shown as rounded. */
const fromFloat = (x: number) => new Q(BigInt(Math.round(x * 1e12)), 10n ** 12n);

/* ---------------------------------------------------------------- numbers */

const group = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);

/** x ≥ 0 rounded half up to `digits` decimals; `pad` keeps the trailing zeros (euro cents). */
function dec(x: Q, digits: number, pad = false): { tex: string; text: string; exact: boolean } {
	const neg = x.n < 0n;
	const n = neg ? -x.n : x.n;
	const scale = 10n ** BigInt(digits);
	const exact = (n * scale) % x.d === 0n;
	const scaled = (n * scale * 2n + x.d) / (2n * x.d);
	const int = (scaled / scale).toString();
	let frac = (scaled % scale).toString().padStart(digits, '0');
	if (!pad) frac = frac.replace(/0+$/, '');
	const sign = neg && scaled !== 0n ? '-' : '';
	return { tex: `${sign}${group(int, '\\,')}${frac ? `{,}${frac}` : ''}`, text: `${sign}${group(int, ' ')}${frac ? `,${frac}` : ''}`, exact };
}

/** An amount in euro: two decimals when it has cents, none when it is whole. */
function euro(x: Q): { tex: string; text: string; exact: boolean } {
	const d = dec(x, 2, !x.isInt());
	return { tex: `${d.tex}\\ \\text{€}`, text: `${d.text} €`, exact: d.exact };
}
/** An amount in a formula, without the unit: "1060{,}90". */
const money = (x: Q) => dec(x, 2, !x.isInt()).tex;
const eq = (exact: boolean) => (exact ? '=' : '\\approx');

/** A number in a formula, up to six decimals. */
const num = (x: Q, digits = 6) => dec(x, digits);

/** The time as a fraction of years, and how it reads: "2{,}5", or "\frac{4}{3}" when the decimal does not end. */
function timeTex(t: Q): string {
	const d = dec(t, 4);
	if (d.exact) return d.tex;
	return `\\frac{${t.n}}{${t.d}}`;
}

/* ---------------------------------------------------------------- reading */

const MAX_MONEY = 1e9;
const MAX_YEARS = 100;
/** Years shown in full in the table of compound interest; beyond, the first and last ones. */
const MAX_TABLE = 15;

function readMoney(s: string, what: string): Q | string {
	const r = parseDecimal(s);
	if (!r) return `Scrivi ${what} in euro, per esempio 1000 oppure 1500,50.`;
	if (r.sign() <= 0) return `${what[0].toUpperCase()}${what.slice(1)} deve essere maggiore di zero.`;
	if (r.num / r.den > MAX_MONEY) return `${what[0].toUpperCase()}${what.slice(1)} può arrivare a un miliardo di euro.`;
	if (100 % r.den !== 0) return `Scrivi ${what} con al massimo due decimali, cioè fino ai centesimi.`;
	return new Q(BigInt(r.num), BigInt(r.den));
}

function readRate(s: string): Q | string {
	const r = parseDecimal(s.replace(/%\s*$/, ''));
	if (!r) return 'Scrivi il tasso annuo in percentuale, per esempio 3 oppure 2,5.';
	if (r.sign() <= 0) return 'Il tasso deve essere maggiore di zero, per esempio 3.';
	if (r.num / r.den > 100) return 'Il tasso annuo può arrivare al 100%.';
	return new Q(BigInt(r.num), BigInt(r.den));
}

function readTime(anni: string, mesi: string): { t: Q; years: number; months: number } | string {
	const a = anni.trim() ? parseDecimal(anni) : parseDecimal('0');
	const m = mesi.trim() ? parseDecimal(mesi) : parseDecimal('0');
	if (!a || !a.isInteger() || a.num < 0) return 'Scrivi gli anni con un numero intero, per esempio 5.';
	if (!m || !m.isInteger() || m.num < 0 || m.num > 11) return 'Scrivi i mesi con un numero intero da 0 a 11, per esempio 6.';
	if (a.num > MAX_YEARS) return `La durata può arrivare a ${MAX_YEARS} anni.`;
	if (a.num === 0 && m.num === 0) return 'La durata deve essere maggiore di zero: scrivi gli anni, i mesi o tutti e due.';
	return { t: new Q(BigInt(a.num * 12 + m.num), 12n), years: a.num, months: m.num };
}

/* ---------------------------------------------------------------- steps */

function timeStep(years: number, months: number, t: Q): Step {
	const sum = years ? `${years} + \\frac{${months}}{12}` : `\\frac{${months}}{12}`;
	const reduced = new Q(BigInt(months), 12n);
	const middle = years && reduced.d !== 12n && !dec(t, 4).exact ? ` = ${years ? `${years} + ` : ''}\\frac{${reduced.n}}{${reduced.d}}` : '';
	return {
		say: 'Scrivi la durata in anni: un mese è un dodicesimo di anno.',
		math: [sum === timeTex(t) ? `t = \\hl{${sum}}` : `t = ${sum}${middle} = \\hl{${timeTex(t)}}`]
	};
}

const HUNDRED = Q.int(100);
const ONE = Q.int(1);

export function interesse(input: InteresseInput): Outcome {
	const { regime, cerca } = input;
	if (regime !== 'semplice' && regime !== 'composto') return fail('Scegli il tipo di interesse: semplice o composto.');
	if (cerca !== 'montante' && cerca !== 'capitale' && cerca !== 'tasso') return fail('Scegli che cosa vuoi calcolare.');
	const time = readTime(input.anni, input.mesi);
	if (typeof time === 'string') return fail(time);
	const { t, years, months } = time;

	const C = cerca === 'capitale' ? null : readMoney(input.c, 'il capitale');
	if (typeof C === 'string') return fail(C);
	const M = cerca === 'montante' ? null : readMoney(input.m, 'il montante');
	if (typeof M === 'string') return fail(M);
	const r = cerca === 'tasso' ? null : readRate(input.r);
	if (typeof r === 'string') return fail(r);
	if (C && M && M.sub(C).sign() <= 0) return fail('Il montante deve essere maggiore del capitale: è il capitale più gli interessi.');

	const steps: Step[] = months ? [timeStep(years, months, t)] : [];
	const tt = timeTex(t);
	const intT = months === 0;

	return regime === 'semplice' ? simple(cerca, C, M, r, t, tt, steps) : compound(cerca, C, M, r, t, tt, years, intT, steps);
}

function roundedNote(...xs: { exact: boolean }[]): string | undefined {
	return xs.some((x) => !x.exact) ? 'Il risultato è arrotondato al centesimo di euro.' : undefined;
}

function simple(cerca: Unknown, C: Q | null, M: Q | null, r: Q | null, t: Q, tt: string, steps: Step[]): Outcome {
	const rows: ResultRow[] = [];
	let copy: string;
	if (cerca === 'montante') {
		const I = C!.mul(r!).mul(t).div(HUNDRED);
		const Mv = C!.add(I);
		const [ie, me] = [euro(I), euro(Mv)];
		steps.push({
			say: "Calcola l'interesse: capitale per tasso per tempo, diviso $100$.",
			math: ['I = \\frac{C \\cdot r \\cdot t}{100}', `= \\frac{${money(C!)} \\cdot ${num(r!).tex} \\cdot ${tt}}{100}`, `${eq(ie.exact)} \\hl{${ie.tex}}`],
			then: roundedNote(ie)
		});
		steps.push({ say: "Aggiungi l'interesse al capitale: ottieni il montante.", math: ['M = C + I', `${eq(ie.exact)} ${money(C!)} + ${money(I)}`, `${eq(me.exact)} \\hl{${me.tex}}`] });
		rows.push({ label: 'Montante', value: `$${me.exact ? '' : '\\approx '}${me.tex}$` }, { label: 'Interesse', value: `$${ie.exact ? '' : '\\approx '}${ie.tex}$` });
		copy = me.text;
	} else if (cerca === 'capitale') {
		const k = r!.mul(t).div(HUNDRED);
		const factor = ONE.add(k);
		const Cv = M!.div(factor);
		const I = M!.sub(Cv);
		const [fe, ce, ie] = [num(factor, 8), euro(Cv), euro(I)];
		steps.push({
			say: 'Ricava il capitale dalla formula del montante.',
			math: ['M = C \\cdot \\left(1 + \\frac{r \\cdot t}{100}\\right)', 'C = \\frac{M}{1 + \\frac{r \\cdot t}{100}}']
		});
		steps.push({ say: 'Calcola il numero al denominatore.', math: [`1 + \\frac{${num(r!).tex} \\cdot ${tt}}{100} ${eq(fe.exact)} \\hl{${fe.tex}}`] });
		steps.push({
			say: 'Dividi il montante per questo numero.',
			math: [`C = \\frac{${money(M!)}}{${fe.tex}}`, `${eq(ce.exact)} \\hl{${ce.tex}}`],
			then: roundedNote(ce)
		});
		steps.push({ say: "Togli il capitale dal montante: è l'interesse.", math: [`I = ${money(M!)} - ${money(Cv)} ${eq(ie.exact && ce.exact)} \\hl{${ie.tex}}`] });
		rows.push({ label: 'Capitale iniziale', value: `$${ce.exact ? '' : '\\approx '}${ce.tex}$` }, { label: 'Interesse', value: `$${ie.exact ? '' : '\\approx '}${ie.tex}$` });
		copy = ce.text;
	} else {
		const I = M!.sub(C!);
		const rv = I.mul(HUNDRED).div(C!.mul(t));
		const [ie, re] = [euro(I), num(rv, 4)];
		steps.push({ say: "Calcola l'interesse: montante meno capitale.", math: [`I = ${money(M!)} - ${money(C!)} = \\hl{${ie.tex}}`] });
		steps.push({
			say: "Ricava il tasso dalla formula dell'interesse.",
			math: ['I = \\frac{C \\cdot r \\cdot t}{100}', 'r = \\frac{100 \\cdot I}{C \\cdot t}', `= \\frac{100 \\cdot ${money(I)}}{${money(C!)} \\cdot ${tt}}`, `${eq(re.exact)} \\hl{${re.tex}\\%}`],
			then: re.exact ? undefined : 'Il tasso è arrotondato a quattro decimali.'
		});
		rows.push({ label: 'Tasso di interesse annuo', value: `$${re.exact ? '' : '\\approx '}${re.tex}\\%$` }, { label: 'Interesse', value: `$${ie.tex}$` });
		copy = `${re.text} %`;
	}
	return { ok: true, rows, copy, steps };
}

/** The table of compound interest, year by year: capital at the start, interest of the year, montante at the end. */
function yearTable(C: Q, i: Q, years: number): string[][] {
	const row = (k: number) => {
		const start = C.mul(ONE.add(i).pow(k - 1));
		const interest = start.mul(i);
		const end = start.add(interest);
		const cell = (x: Q) => `$${euro(x).tex}$`;
		return [`$${k}$`, cell(start), cell(interest), k === years ? cell(end).replace(/\$(.*)\$/, '$\\hl{$1}$') : cell(end)];
	};
	const ks = years > MAX_TABLE ? [...Array.from({ length: 10 }, (_, j) => j + 1), -1, years - 2, years - 1, years] : Array.from({ length: years }, (_, j) => j + 1);
	return ks.map((k) => (k === -1 ? ['$\\vdots$', '$\\vdots$', '$\\vdots$', '$\\vdots$'] : row(k)));
}

function compound(cerca: Unknown, C: Q | null, M: Q | null, r: Q | null, t: Q, tt: string, years: number, intT: boolean, steps: Step[]): Outcome {
	const rows: ResultRow[] = [];
	let copy: string;
	const power = (base: string) => `${base}^{${tt}}`;
	if (cerca !== 'tasso') {
		const i = r!.div(HUNDRED);
		const g = ONE.add(i);
		const gTex = num(g, 8).tex;
		steps.push({ say: 'Scrivi il tasso come numero decimale: dividi per $100$.', math: [`i = \\frac{${num(r!).tex}}{100} = \\hl{${num(i, 8).tex}}`] });
		// (1 + i)^t, exact when t is a whole number of years.
		const growth = intT ? g.pow(years) : fromFloat(Math.pow(g.toNumber(), t.toNumber()));
		if (cerca === 'montante') {
			const Mv = C!.mul(growth);
			const I = Mv.sub(C!);
			const [me, ie] = [euro(Mv), euro(I)];
			const exact = me.exact && intT;
			if (years > 0)
				steps.push({
					say: `Ogni anno moltiplica il capitale per $1 + i$, cioè per $${gTex}$.`,
					table: { head: ['Anno', 'Capitale a inizio anno', "Interesse dell'anno", 'Montante a fine anno'], rows: yearTable(C!, i, years) },
					then: `L'interesse di ogni anno si aggiunge al capitale e l'anno dopo produce altro interesse.${euro(C!.mul(g.pow(years))).exact ? '' : ' Nella tabella i valori sono arrotondati al centesimo, i calcoli no.'}${intT ? '' : ' La tabella arriva agli anni interi: i mesi sono nel calcolo con la formula.'}`
				});
			steps.push({
				say: 'Oppure usa subito la formula del montante.',
				math: ['M = C \\cdot (1 + i)^{t}', `= ${money(C!)} \\cdot ${power(gTex)}`, `${eq(exact)} \\hl{${me.tex}}`],
				then: exact ? undefined : intT ? 'Il risultato è arrotondato al centesimo di euro.' : 'Con i mesi l’esponente non è intero: il risultato è arrotondato al centesimo di euro.'
			});
			steps.push({ say: "Togli il capitale: resta l'interesse.", math: ['I = M - C', `${eq(exact)} ${money(Mv)} - ${money(C!)}`, `${eq(exact)} \\hl{${ie.tex}}`] });
			rows.push({ label: 'Montante', value: `$${exact ? '' : '\\approx '}${me.tex}$` }, { label: 'Interesse', value: `$${exact ? '' : '\\approx '}${ie.tex}$` });
			copy = me.text;
		} else {
			const Cv = M!.div(growth);
			const I = M!.sub(Cv);
			const [ce, ie] = [euro(Cv), euro(I)];
			const exact = ce.exact && intT;
			steps.push({
				say: 'Ricava il capitale dalla formula del montante.',
				math: ['M = C \\cdot (1 + i)^{t}', 'C = \\frac{M}{(1 + i)^{t}}', `= \\frac{${money(M!)}}{${power(gTex)}}`, `${eq(exact)} \\hl{${ce.tex}}`],
				then: exact ? undefined : 'Il risultato è arrotondato al centesimo di euro.'
			});
			steps.push({ say: "Togli il capitale dal montante: è l'interesse.", math: [`I = ${money(M!)} - ${money(Cv)} ${eq(exact)} \\hl{${ie.tex}}`] });
			rows.push({ label: 'Capitale iniziale', value: `$${exact ? '' : '\\approx '}${ce.tex}$` }, { label: 'Interesse', value: `$${exact ? '' : '\\approx '}${ie.tex}$` });
			copy = ce.text;
		}
	} else {
		const ratio = M!.div(C!);
		const re0 = num(ratio, 8);
		const gv = Math.pow(ratio.toNumber(), 1 / t.toNumber());
		const g = fromFloat(gv);
		// Exact only when the ratio is a perfect power of a short decimal: checked by raising the rounded root back.
		const g6 = new Q(BigInt(Math.round(gv * 1e6)), 1000000n);
		const exact = intT && g6.pow(years).sub(ratio).sign() === 0;
		const root = exact ? g6 : g;
		const rv = root.sub(ONE).mul(HUNDRED);
		const [ge, re, ie] = [num(root, 6), num(rv, 4), euro(M!.sub(C!))];
		steps.push({
			say: 'Dividi il montante per il capitale.',
			math: ['M = C \\cdot (1 + i)^{t}', '(1 + i)^{t} = \\frac{M}{C}', `= \\frac{${money(M!)}}{${money(C!)}}`, `${eq(re0.exact)} \\hl{${re0.tex}}`]
		});
		steps.push({
			say: intT && years === 2 ? 'Fai la radice quadrata: trovi $1 + i$.' : intT && years > 2 ? `Fai la radice di indice $${years}$: trovi $1 + i$.` : intT ? 'Con un anno solo, questo numero è già $1 + i$.' : 'Eleva alla $1/t$: trovi $1 + i$.',
			math: [intT ? (years > 1 ? `1 + i = ${years === 2 ? `\\sqrt{${re0.tex}}` : `\\sqrt[${years}]{${re0.tex}}`} ${eq(exact)} \\hl{${ge.tex}}` : `1 + i = \\hl{${ge.tex}}`) : `1 + i = (${re0.tex})^{\\frac{1}{${tt}}} \\approx \\hl{${ge.tex}}`]
		});
		steps.push({
			say: 'Togli $1$ e moltiplica per $100$: è il tasso in percentuale.',
			math: [`r = (${ge.tex} - 1) \\cdot 100`, `${eq(exact && re.exact)} \\hl{${re.tex}\\%}`],
			then: exact && re.exact ? undefined : 'Il tasso è arrotondato a quattro decimali.'
		});
		steps.push({ say: "Togli il capitale dal montante: è l'interesse.", math: [`I = ${money(M!)} - ${money(C!)} = \\hl{${ie.tex}}`] });
		rows.push({ label: 'Tasso di interesse annuo', value: `$${exact && re.exact ? '' : '\\approx '}${re.tex}\\%$` }, { label: 'Interesse', value: `$${ie.tex}$` });
		copy = `${re.text} %`;
	}
	return { ok: true, rows, copy, steps };
}
