import { factorize } from '@/lib/exercises/v2/naturali';
import { gcd } from '@/lib/exercises/v2/rational';
import { fail, type Outcome, type Step } from './types';
import { intTex, intText } from './numbers';
import { expand, frazioneGeneratrice, parsePeriodic, periodicTex, type Periodic } from './frazione-generatrice';

/**
 * One number in its three forms: a fraction, a decimal (limited or periodic) and a percentage. From a fraction:
 * reduce it, divide the numerator by the denominator, multiply by 100. From a decimal: the generating fraction
 * (src/lib/tools/frazione-generatrice.ts, with the rule of the books), and the comma two places to the right. From a
 * percentage: over 100, reduced, and the comma two places to the left. Exact throughout: a periodic percentage such
 * as 33,(3) % is kept periodic.
 */

export type Form = 'frazione' | 'decimale' | 'percentuale';

const MAX = 1e9;
/** Longest period written out; a longer one is shown rounded. */
const MAX_PERIOD = 24;

/** A reduced fraction with its sign apart: num ≥ 0, den > 0. */
interface Frac {
	neg: boolean;
	num: number;
	den: number;
}

const fracTex = (f: Frac) => `${f.neg && f.num ? '-' : ''}${f.den === 1 ? intTex(f.num) : `\\frac{${intTex(f.num)}}{${intTex(f.den)}}`}`;
const fracText = (f: Frac) => `${f.neg && f.num ? '-' : ''}${intText(f.num)}${f.den === 1 ? '' : `/${intText(f.den)}`}`;

/** a/b as a decimal, with the bar over the period, or rounded when the period is too long. */
function decimalOf(neg: boolean, a: number, b: number): { tex: string; text: string; exact: boolean; periodic: boolean } {
	const e = expand(a, b);
	const sign = neg && a ? '-' : '';
	if (e.period.length > MAX_PERIOD || e.ante.length > MAX_PERIOD) {
		// Rounded to ten decimals by long division.
		let r = a % b;
		let digits = '';
		for (let i = 0; i < 11; i++) {
			r *= 10;
			digits += String(Math.floor(r / b));
			r %= b;
		}
		const up = Number(digits[10]) >= 5;
		let ten = BigInt(Math.floor(a / b)) * 10n ** 10n + BigInt(digits.slice(0, 10)) + (up ? 1n : 0n);
		const int = ten / 10n ** 10n;
		ten %= 10n ** 10n;
		const frac = ten.toString().padStart(10, '0');
		return { tex: `${sign}${intTex(Number(int))}{,}${frac}`, text: `${sign}${intText(Number(int))},${frac}`, exact: false, periodic: true };
	}
	const x: Periodic = { ...e, neg: !!sign, int: e.int };
	const text = `${sign}${intText(Number(e.int))}${e.ante || e.period ? ',' : ''}${e.ante}${e.period ? `(${e.period})` : ''}`;
	return { tex: periodicTex(x), text, exact: true, periodic: !!e.period };
}

/** The value of a decimal as written (limited or periodic), as a reduced fraction. */
function fractionOf(x: Periodic): Frac {
	let num: number;
	let den: number;
	if (x.period) {
		num = Number(x.int + x.ante + x.period) - Number(x.int + x.ante);
		den = Number('9'.repeat(x.period.length) + '0'.repeat(x.ante.length));
	} else {
		num = Number(x.int + x.ante);
		den = 10 ** x.ante.length;
	}
	const g = gcd(num, den) || 1;
	return { neg: x.neg && num > 0, num: num / g, den: den / g };
}

/** "3/8", "-6/8", "5" → the fraction as typed, or an error. */
function readFraction(input: string): { neg: boolean; num: number; den: number } | string {
	const s = input.trim().replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/:/g, '/');
	if (!s) return 'Scrivi una frazione con la barra, per esempio 3/8.';
	const m = /^([-+]?)(\d+)(?:\/([-+]?)(\d+))?$/.exec(s);
	if (!m) {
		if (/[.,]/.test(s)) return 'Numeratore e denominatore devono essere interi, per esempio 3/8. Per un numero con la virgola scegli «Da decimale».';
		return 'Scrivi una frazione con la barra, per esempio 3/8.';
	}
	const num = Number(m[2]);
	const den = m[4] === undefined ? 1 : Number(m[4]);
	if (num > MAX || den > MAX) return 'Numeratore e denominatore possono arrivare a un miliardo.';
	if (den === 0) return 'Il denominatore non può essere zero: una divisione per zero non ha senso.';
	return { neg: (m[1] === '-') !== (m[3] === '-') && num > 0, num, den };
}

/** Why the decimal is limited or periodic: the prime factors of the reduced denominator. */
function kindSentence(den: number): string {
	if (den === 1) return 'La frazione è un numero intero.';
	const ps = factorize(den).map(([p]) => p);
	const others = ps.filter((p) => p !== 2 && p !== 5);
	const list = (xs: number[]) => (xs.length === 1 ? `il fattore $${xs[0]}$` : `i fattori ${xs.slice(0, -1).map((p) => `$${p}$`).join(', ')} e $${xs[xs.length - 1]}$`);
	if (!others.length) return `Il denominatore ha solo ${list(ps)}: il decimale è limitato.`;
	if (others.length === ps.length) return 'Il denominatore non ha i fattori $2$ e $5$: il decimale è periodico semplice.';
	return `Il denominatore ha ${list(ps.filter((p) => p === 2 || p === 5))}, ma anche ${list(others)}: il decimale è periodico misto.`;
}

/** The percentage of a fraction: a/b · 100, as a decimal. */
function percentOf(f: Frac) {
	return decimalOf(f.neg, f.num * 100, f.den);
}

const pctTex = (d: { tex: string }) => `${d.tex}\\%`;

export function frazioneDecimalePercentuale(input: string, from: Form): Outcome {
	let f: Frac;
	const steps: Step[] = [];
	let startTex: string;

	if (from === 'frazione') {
		const r = readFraction(input);
		if (typeof r === 'string') return fail(r);
		const g = gcd(r.num, r.den) || 1;
		f = { neg: r.neg, num: r.num / g, den: r.den / g };
		const typed: Frac = { neg: r.neg, num: r.num, den: r.den };
		startTex = fracTex(typed);
		if (g > 1 && r.num > 0) {
			const sign = r.neg ? '-' : '';
			steps.push({
				say: 'Riduci la frazione ai minimi termini.',
				math: [`${startTex} = ${sign}\\frac{${intTex(r.num)} : ${intTex(g)}}{${intTex(r.den)} : ${intTex(g)}}`, `= \\hl{${fracTex(f)}}`],
				then: `Il MCD di numeratore e denominatore è $${intTex(g)}$.`
			});
		}
		const sign = f.neg && f.num ? '-' : '';
		const d = decimalOf(f.neg, f.num, f.den);
		const p = percentOf(f);
		if (f.den === 1) {
			steps.push({ say: 'Il denominatore è $1$: la frazione è un numero intero.', math: [`${startTex} = \\hl{${fracTex(f)}}`] });
			steps.push({ say: 'Per la percentuale, moltiplica per $100$.', math: [`${fracTex(f)} \\cdot 100 = ${sign}${intTex(f.num * 100)}`, `= \\hl{${pctTex(p)}}`] });
		} else {
			steps.push({
				say: 'Per il decimale, dividi il numeratore per il denominatore.',
				math: [`${sign}${intTex(f.num)} : ${intTex(f.den)} ${d.exact ? '=' : '\\approx'} \\hl{${d.tex}}`],
				then: f.num ? `${kindSentence(f.den)}${d.exact ? '' : ` Il periodo è lungo: il numero è arrotondato a $10$ decimali.`}` : undefined
			});
			steps.push({
				say: 'Per la percentuale, moltiplica per $100$.',
				math: [`${fracTex(f)} \\cdot 100 = ${sign}\\frac{${intTex(f.num * 100)}}{${intTex(f.den)}}`, `${p.exact ? '=' : '\\approx'} \\hl{${pctTex(p)}}`],
				then: 'Il simbolo $\\%$ vuol dire «diviso $100$»: moltiplicare per $100$ e scrivere $\\%$ non cambia il numero.'
			});
		}
	} else {
		const raw = input.trim().replace(/\s*%\s*$/, '');
		if (from === 'decimale' && /%\s*$/.test(input)) return fail('Hai scritto una percentuale: scegli «Da percentuale», oppure togli il simbolo %.');
		const x = parsePeriodic(raw);
		if (typeof x === 'string') return fail(from === 'percentuale' ? 'Scrivi una percentuale, per esempio 12,5 oppure 33,(3) con il periodo tra parentesi.' : x);
		f = fractionOf(x);
		const xTex = periodicTex(x);

		if (from === 'decimale') {
			startTex = xTex;
			// The steps of the generating fraction, as the tool of that name gives them.
			const gen = frazioneGeneratrice(raw);
			if (gen.ok) steps.push(...gen.steps.filter((s) => !/^Controlla/.test(s.say)).map((s, i) => (i === 0 ? { ...s, group: 'La frazione' } : s)));
			const p = percentOf(f);
			steps.push({
				group: 'La percentuale',
				say: 'Per la percentuale, moltiplica per $100$: la virgola va due posti a destra.',
				math: [`${xTex} \\cdot 100 ${p.exact ? '=' : '\\approx'} ${p.tex}`, `${xTex} ${p.exact ? '=' : '\\approx'} \\hl{${pctTex(p)}}`]
			});
		} else {
			startTex = `${xTex}\\%`;
			// The percentage as a fraction over 100.
			const p = fractionOf(x);
			const over = { neg: p.neg, num: p.num, den: p.den * 100 };
			const g = gcd(over.num, over.den) || 1;
			f = { neg: over.neg, num: over.num / g, den: over.den / g };
			if (x.period) {
				steps.push({
					group: 'La frazione',
					say: 'Trova la frazione generatrice del numero, senza il simbolo $\\%$.',
					math: [`${xTex} = \\hl{${fracTex(p)}}`],
					then: 'La regola è quella della frazione generatrice: i passaggi sono nella pagina di quello strumento.'
				});
				steps.push({
					say: 'Dividi per $100$: il simbolo $\\%$ vuol dire «diviso $100$».',
					math: [`${startTex} = ${fracTex(p)} : 100`, ...(g > 1 ? [`= ${fracTex(over)}`, `= \\hl{${fracTex(f)}}`] : [`= \\hl{${fracTex(over)}}`])]
				});
			} else {
				const k = x.ante.length;
				const sign = x.neg ? '-' : '';
				const all = { num: Number(x.int + x.ante), den: 100 * 10 ** k };
				const g2 = gcd(all.num, all.den) || 1;
				const lines = [`${startTex} = ${sign}\\frac{${xTex.replace(/^-/, '')}}{100}`];
				if (k) lines.push(`= ${sign}\\frac{${intTex(all.num)}}{${intTex(all.den)}}`);
				if (!all.num) lines.splice(0, lines.length, `${startTex} = \\hl{0}`);
				else if (g2 > 1) lines.push(`= ${sign}\\frac{${intTex(all.num)} : ${intTex(g2)}}{${intTex(all.den)} : ${intTex(g2)}}`, `= \\hl{${fracTex(f)}}`);
				else lines[lines.length - 1] = lines[lines.length - 1].replace(/= (.*)$/, '= \\hl{$1}');
				steps.push({
					group: 'La frazione',
					say: 'Scrivi la percentuale come frazione con denominatore $100$, poi riducila.',
					math: lines,
					then: k ? `Per togliere la virgola moltiplica sopra e sotto per $${intTex(10 ** k)}$.` : undefined
				});
			}
			const d = decimalOf(f.neg, f.num, f.den);
			steps.push({
				group: 'Il decimale',
				say: 'Per il decimale, dividi per $100$: la virgola va due posti a sinistra.',
				math: [`${xTex} : 100 ${d.exact ? '=' : '\\approx'} \\hl{${d.tex}}`]
			});
		}
	}

	const d = decimalOf(f.neg, f.num, f.den);
	const p = percentOf(f);
	// Groups only when there are more than five steps.
	if (steps.length <= 5) for (const s of steps) delete s.group;
	else if (!steps[0].group) steps[0].group = 'La frazione';

	return {
		ok: true,
		rows: [
			{ label: 'Frazione ridotta ai minimi termini', value: `$${fracTex(f)}$` },
			{ label: d.periodic ? 'Numero decimale periodico' : 'Numero decimale', value: `$${d.exact ? '' : '\\approx '}${d.tex}$` },
			{ label: 'Percentuale', value: `$${p.exact ? '' : '\\approx '}${pctTex(p)}$` }
		],
		copy: `${fracText(f)} = ${d.text} = ${p.text} %`,
		steps: steps.length ? steps : [{ say: `Il numero è $${startTex}$.` }]
	};
}
