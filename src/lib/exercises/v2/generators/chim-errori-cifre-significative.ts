/**
 * Errori di misura e cifre significative (chemistry, first year). Spec: specs/exercises/chim-errori-cifre-significative.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/13-chim-errori-cifre-significative.md), each one step
 * harder: counting the significant figures of a laboratory measure; rounding to a number of significant figures;
 * the mean and the uncertainty of a series of measures, (x̄ ± Δx); sums and differences (the volume delivered by a
 * burette, a mass weighed by difference, a sum with the decimals of the least precise datum); products and quotients
 * (a density, the moles of a sample, a mass from the density) with the figures of the datum with fewest; the
 * percentage uncertainty and the uncertainty of a density propagated from those of mass and volume.
 *
 * Here the writing is the answer: 0,250 and 0,25 are different options, so `values` is the writing without LaTeX
 * ("0,250 mol", "18,7 ± 0,2 mL"). Arithmetic on exact rationals; the first figure dropped is never a 5 followed only
 * by zeros.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { type Built, type R, U, checkCommon, choose, datum, dec, decimals, generateWith, pow10, pu, q, roundAt, sigPos, t, truncAt, wu, writeSig } from '../chim-misure';

export const ID = 'chim-errori-cifre-significative';

/** The writing without LaTeX, for `values`. */
const plain = (tex: string) => tex.replace(/\{,\}/g, ',').replace(/\\,/g, ' ').replace(/ \\cdot 10\^\{?(-?\d+)\}?/, 'e$1').replace(/ \\cdot 10$/, 'e1');

/** An option that is a written quantity. */
const wOpt = (tex: string, u: string): ChoiceOption => ({ latex: wu(tex, u), values: [`${plain(tex)} ${u}`] });

/** x rounded to n figures and written; null at an exact half. */
function sigW(x: R, n: number): string | null {
	const r = roundAt(x, sigPos(x) - n + 1);
	return r.half ? null : writeSig(r.v, n).tex;
}

/** x rounded at the position 10^p and written with max(0, -p) decimals; null at half. */
function atPos(x: R, p: number): string | null {
	const r = roundAt(x, p);
	return r.half ? null : dec(r.v, Math.max(0, -p));
}

/** True when what is dropped rounding x at 10^p is within 1/100 of a unit from half (a near tie in built data). */
function nearHalf(x: R, p: number): boolean {
	const y = x.div(pow10(p));
	const f = y.sub(q(Math.floor(y.num / y.den)));
	return f.sub(q(1, 2)).abs().compare(q(1, 100)) < 0;
}

const UNITS1 = ['g', 'mL', 'mol', 'g/mL', 'L'];

/** Draws again inside the same case until `f` succeeds, so a case that is often refused keeps its share. */
function retry<T>(f: () => T): T {
	for (let i = 0; i < 1000; i++) {
		try {
			return f();
		} catch {
			// draw again
		}
	}
	throw new Error('retry');
}

// ---------------------------------------------------------------------------
// Level 1: counting

function level1(rng: Rng): Built {
	const kind = rng.pick(['nessuno', 'iniziali', 'mezzo', 'finali', 'scientifica'] as const);
	const u = rng.pick(UNITS1);
	let digits: string; // the significant digits
	let tex: string;
	let all: number; // every digit written, leading zeros included
	let noTrail: number; // the trailing zeros not counted
	let noMid: number; // the zeros in the middle not counted
	const d = () => String(rng.int(1, 9));
	if (kind === 'nessuno') {
		const n = rng.int(2, 4);
		digits = Array.from({ length: n }, d).join('');
		const k = rng.int(1, n - 1); // integer digits
		tex = `${digits.slice(0, k)}{,}${digits.slice(k)}`;
		all = n;
		noTrail = n;
		noMid = n;
	} else if (kind === 'iniziali') {
		const n = rng.int(2, 3);
		digits = Array.from({ length: n }, d).join('');
		const z = rng.int(1, 3); // zeros after the comma
		tex = `0{,}${'0'.repeat(z)}${digits}`;
		all = 1 + z + n;
		noTrail = n;
		noMid = n;
	} else if (kind === 'mezzo') {
		digits = `${d()}0${rng.next() < 0.5 ? '0' : ''}${d()}`;
		const k = rng.int(1, digits.length - 1);
		tex = `${digits.slice(0, k)}{,}${digits.slice(k)}`;
		all = digits.length;
		noTrail = digits.length;
		noMid = 2;
	} else if (kind === 'finali') {
		const n = rng.int(1, 3);
		const z = rng.int(1, 2);
		const lead = Array.from({ length: n }, d).join('');
		digits = lead + '0'.repeat(z);
		if (rng.next() < 0.3) {
			tex = `0{,}0${digits}`;
			all = 2 + digits.length;
		} else {
			const k = rng.int(1, n);
			tex = `${digits.slice(0, k)}{,}${digits.slice(k)}`;
			all = digits.length;
		}
		noTrail = n;
		noMid = digits.length;
	} else {
		const n = rng.int(2, 4);
		digits = d() + Array.from({ length: n - 1 }, () => String(rng.int(0, 9))).join('');
		const e = rng.pick([-6, -5, -4, -3, 3, 4, 5, 23]);
		tex = `${digits[0]}{,}${digits.slice(1)} \\cdot 10^{${e}}`;
		all = n + String(Math.abs(e)).length;
		noTrail = digits.replace(/0+$/, '').length;
		noMid = n;
	}
	const n = digits.length;
	const o = (k: number): ChoiceOption => ({ latex: `${k}`, values: [String(k)] });
	const wrong = [all, noTrail, noMid, n + 1, n - 1, n + 2].filter((k) => k >= 1 && k !== n);
	const why: Record<typeof kind, string> = {
		nessuno: 'Le cifre diverse da zero sono tutte significative.',
		iniziali: 'Gli zeri iniziali non sono significativi: servono solo a mettere la virgola al suo posto.',
		mezzo: 'Gli zeri tra due cifre diverse da zero sono significativi.',
		finali: 'Gli zeri finali dopo la virgola sono significativi: sono stati misurati.',
		scientifica: 'In notazione scientifica si contano le cifre del primo fattore.',
	};
	return {
		prompt: 'Conta le cifre significative.',
		problem: textBlock(`Quante cifre significative ha la misura ${pu(tex, u)}?`),
		solution: `${n}`,
		steps: [textBlock(why[kind]), textBlock(`Le cifre significative sono $${n}$: ${digits.split('').join(', ')}.`)],
		answer: choose(rng, o(n), wrong.map(o)),
		params: { case: kind, number: plain(tex) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: rounding

function level2(rng: Rng): Built {
	const kind = rng.pick(['decimale', 'decimale', 'zeri', 'scientifica', 'riporto'] as const);
	return retry(() => rounding(rng, kind));
}

function rounding(rng: Rng, kind: 'decimale' | 'zeri' | 'scientifica' | 'riporto'): Built {
	const u = rng.pick(['g', 'mL', 'mol', 'g/mL', 'J']);
	const n = rng.int(2, 3);
	let x: R;
	if (kind === 'decimale') {
		const k = rng.int(10001, 99999);
		if (k % 10 === 0) throw new Error('zero');
		x = q(k, 10 ** rng.int(2, 5)); // five figures, 0,1 to 999
	} else if (kind === 'zeri') {
		// the kept figures end in 9 and the first dropped is 5 or more: the carry leaves a zero (0,24972 → 0,250)
		const keep = rng.int(10 ** (n - 1), 10 ** n - 1);
		if (keep % 10 !== 9 || (keep + 1) % 10 ** (n - 1) === 0) throw new Error('shape');
		const rest = rng.int(50, 99) * 10 + rng.int(1, 9);
		x = q(keep * 1000 + rest, 10 ** rng.int(n + 1, n + 5));
	} else if (kind === 'scientifica') {
		const L = rng.int(5, 7); // a whole number with 5 to 7 figures, not ending in zero
		const k = rng.int(10 ** (L - 1) + 1, 10 ** L - 1);
		if (k % 10 === 0) throw new Error('zero');
		x = q(k);
	} else {
		// 9,97 → 10 with two figures, 0,0998 → 0,100 with three
		const nines = 10 ** n - 1;
		x = q(nines * 10 + rng.int(5, 9), 10 ** rng.int(n, n + 3));
	}
	const p = sigPos(x) - n + 1;
	if (nearHalf(x, p)) throw new Error('half');
	const right = sigW(x, n);
	if (!right) throw new Error('tie');
	// truncated; one figure more; one less; for a whole number, the zeros written out
	const trunc = writeSig(truncAt(x, p), n).tex;
	const wrong = [trunc, sigW(x, n + 1), sigW(x, n - 1)].filter((s): s is string => !!s && s !== right);
	const extra: string[] = [];
	if (right.includes('\\cdot') && kind === 'scientifica') extra.push(dec(roundAt(x, p).v));
	if (/\{,\}\d*0$/.test(right)) extra.push(right.replace(/0+$/, '').replace(/\{,\}$/, ''));
	if (kind === 'riporto') extra.push(dec(roundAt(x, p).v));
	const opts = [...extra, ...wrong].filter((s) => s !== right);
	const words = n === 2 ? 'due' : 'tre';
	return {
		prompt: 'Arrotonda.',
		problem: textBlock(`Arrotonda la misura ${pu(dec(x), u)} a ${words} cifre significative.`),
		solution: wu(right, u),
		steps: [
			textBlock(`Si tengono ${words} cifre e si guarda la prima cifra tolta: da $5$ in su l'ultima cifra che resta aumenta di uno.`),
			`${wu(dec(x), u)} \\approx ${wu(right, u)}`,
			...(right.includes('\\cdot') ? [t("Scritto con gli zeri, il numero non direbbe quante cifre sono significative: si usa la notazione scientifica.")] : /\{,\}\d*0$/.test(right) ? [t("Lo zero finale è significativo, e va scritto.")] : []),
		],
		answer: choose(rng, wOpt(right, u), opts.map((s) => wOpt(s, u))),
		params: { case: kind, x: x.toString(), n },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the mean and the uncertainty

interface Series {
	u: string;
	d: number; // decimals of the readings
	sens: R;
	what: string;
}
const SERIES: Series[] = [
	{ u: 'mL', d: 1, sens: q(1, 10), what: 'titolazioni della stessa soluzione, con una buretta che ha la sensibilità di $0{,}1\\,\\text{mL}$, richiedono' },
	{ u: 'g', d: 2, sens: q(1, 100), what: 'pesate dello stesso campione, con una bilancia che ha la sensibilità di $0{,}01\\,\\text{g}$, danno' },
];

/** The result (x̄ ± Δx) as the lesson writes it, or null when a rounding falls at half or Δx carries. */
function result(mean: R, delta: R): { m: string; D: string } | null {
	const p = sigPos(delta);
	const rd = roundAt(delta, p);
	if (rd.half || rd.v.compare(pow10(p + 1)) >= 0 || nearHalf(delta, p) || nearHalf(mean, p)) return null;
	const rm = roundAt(mean, p);
	if (rm.half) return null;
	const dd = Math.max(0, -p);
	return { m: dec(rm.v, dd), D: dec(rd.v, dd) };
}

const resTex = (m: string, D: string, u: string) => `(${m} \\pm ${D})\\,${U(u)}`;
const resOpt = (m: string, D: string, u: string): ChoiceOption => ({ latex: resTex(m, D, u), values: [`${plain(m)} ± ${plain(D)} ${u}`] });

function level3(rng: Rng): Built {
	const S = rng.pick(SERIES);
	const small = rng.next() < 0.3; // the readings closer than the sensitivity: the uncertainty is the sensitivity
	const count = rng.int(4, 5);
	const scale = 10 ** S.d;
	const center = S.d === 1 ? rng.int(100, 450) : rng.int(1000, 6000);
	const spread = rng.int(3, 8);
	// closer than the sensitivity: two neighbouring readings, half a unit of semidispersion
	const xs = Array.from({ length: count }, () => center + (small ? rng.int(0, 1) : rng.int(-spread, spread)));
	if (small && new Set(xs).size < 2) throw new Error('all equal');
	const lo = Math.min(...xs), hi = Math.max(...xs);
	const mean = q(xs.reduce((a, b) => a + b, 0), count * scale);
	const semi = q(hi - lo, 2 * scale);
	const delta = semi.compare(S.sens) > 0 ? semi : S.sens;
	if (!small && semi.compare(S.sens) <= 0) throw new Error('shape');
	const r = result(mean, delta);
	if (!r) throw new Error('tie');
	const right = resOpt(r.m, r.D, S.u);
	const wrong: ChoiceOption[] = [];
	// the range for the uncertainty; the mean with the calculator's figures; the sensitivity or the half range
	const range = result(mean, q(hi - lo, scale));
	if (range) wrong.push(resOpt(range.m, range.D, S.u));
	const md = decimals(mean);
	if (md <= 4) wrong.push(resOpt(dec(mean, Math.max(md, S.d + 1)), r.D, S.u));
	if (small) wrong.push(resOpt(dec(mean, S.d + 1), dec(semi, S.d + 1), S.u));
	else wrong.push(resOpt(r.m, dec(S.sens, S.d), S.u));
	const alt = result(mean, delta.mul(q(2)));
	if (alt) wrong.push(resOpt(alt.m, alt.D, S.u));
	const list = xs.map((x) => dec(q(x, scale), S.d));
	const sum = xs.reduce((a, b) => a + b, 0);
	return {
		prompt: 'Scrivi il risultato.',
		problem: textBlock(`${count === 4 ? 'Quattro' : 'Cinque'} ${S.what} ${list.map((x) => `$${x}$`).join(', ')} $\\text{${S.u}}$. Come si scrive il risultato?`),
		solution: right.latex,
		steps: [
			`\\bar x = \\dfrac{${dec(q(sum, scale), S.d)}}{${count}}\\,${U(S.u)} = ${wu(dec(mean), S.u)}`,
			`\\dfrac{x_{max} - x_{min}}{2} = \\dfrac{${dec(q(hi, scale), S.d)} - ${dec(q(lo, scale), S.d)}}{2}\\,${U(S.u)} = ${wu(dec(semi), S.u)}`,
			t(small ? 'La semidispersione è più piccola della sensibilità: l\'incertezza è la sensibilità.' : "L'incertezza è la semidispersione, arrotondata a una cifra significativa."),
			t('Il valore medio si arrotonda alla posizione dell\'incertezza.'),
		],
		answer: choose(rng, right, wrong),
		params: { case: small ? 'sensibilita' : 'semidispersione', xs: list.map(plain) },
	};
}

// ---------------------------------------------------------------------------
// Level 4: sums and differences

function level4(rng: Rng): Built {
	const kind = rng.pick(['buretta', 'pesata', 'somma'] as const);
	return retry(() => sums(rng, kind));
}

function sums(rng: Rng, kind: 'buretta' | 'pesata' | 'somma'): Built {
	if (kind === 'buretta') {
		const vi = rng.int(0, 30), vf = rng.int(100, 480); // tenths of a mL
		const V = q(vf - vi, 10);
		const m = dec(V, 1);
		const right = resOpt(m, '0{,}2', 'mL');
		const wrong = [resOpt(m, '0{,}1', 'mL'), resOpt(dec(q(vf + vi, 10), 1), '0{,}2', 'mL'), resOpt(dec(q(vf, 10), 1), '0{,}1', 'mL'), resOpt(m, '0{,}3', 'mL')];
		return {
			prompt: 'Trova il volume erogato e la sua incertezza.',
			problem: textBlock(`In una titolazione la buretta, che ha la sensibilità di $0{,}1\\,\\text{mL}$, segna ${pu(dec(q(vi, 10), 1), 'mL')} all'inizio e ${pu(dec(q(vf, 10), 1), 'mL')} alla fine. Quanto titolante è uscito?`),
			solution: right.latex,
			steps: [`V = ${dec(q(vf, 10), 1)} - ${dec(q(vi, 10), 1)} = ${wu(m, 'mL')}`, `\\Delta V = 0{,}1 + 0{,}1 = ${wu('0{,}2', 'mL')}`, t('In una differenza le incertezze si sommano.')],
			answer: choose(rng, right, wrong),
			params: { case: kind, vi, vf },
		};
	}
	if (kind === 'pesata') {
		const m1 = rng.int(2500, 8000), dm = rng.int(150, 4000); // hundredths of a gram
		const m2 = m1 + dm;
		const mm = dec(q(dm, 100), 2);
		const right = resOpt(mm, '0{,}02', 'g');
		const wrong = [resOpt(mm, '0{,}01', 'g'), resOpt(dec(q(m2, 100), 2), '0{,}01', 'g'), resOpt(dec(q(m1 + m2, 100), 2), '0{,}02', 'g'), resOpt(mm, '0{,}03', 'g')];
		return {
			prompt: 'Trova la massa del campione e la sua incertezza.',
			problem: textBlock(`Con una bilancia che ha la sensibilità di $0{,}01\\,\\text{g}$ si pesa un becher vuoto, ${pu(dec(q(m1, 100), 2), 'g')}, e poi il becher con un campione, ${pu(dec(q(m2, 100), 2), 'g')}. Quanto vale la massa del campione?`),
			solution: right.latex,
			steps: [`m = ${dec(q(m2, 100), 2)} - ${dec(q(m1, 100), 2)} = ${wu(mm, 'g')}`, `\\Delta m = 0{,}01 + 0{,}01 = ${wu('0{,}02', 'g')}`, t('In una differenza le incertezze si sommano.')],
			answer: choose(rng, right, wrong),
			params: { case: kind, m1, m2 },
		};
	}
	// a sum with different decimals: the result to the decimals of the least precise datum
	const a = q(rng.int(2000, 9000), 100); // two decimals
	const b = q(rng.int(11, 99), 10); // one decimal
	const s = a.add(b);
	if (nearHalf(s, -1)) throw new Error('half');
	const right = atPos(s, -1)!;
	const trunc = dec(truncAt(s, -1), 1);
	const nSig = Math.min(sigOfDec(dec(a, 2)), sigOfDec(dec(b, 1)));
	const bySig = (() => {
		const r = roundAt(s, sigPos(s) - nSig + 1);
		return r.half ? null : writeSig(r.v, nSig).tex;
	})();
	const wrong = [dec(s, 2), trunc, bySig].filter((x): x is string => !!x && x !== right).map((x) => wOpt(x, 'g'));
	const rv = roundAt(s, -1).v;
	const fill = [dec(rv.add(q(1, 10)), 1), dec(rv.sub(q(1, 10)), 1)].filter((x) => x !== right).map((x) => wOpt(x, 'g'));
	return {
		prompt: 'Calcola la massa totale.',
		problem: textBlock(`In un becher che pesa ${pu(dec(a, 2), 'g')} si aggiungono ${pu(dec(b, 1), 'g')} di sale, pesati con una bilancia meno sensibile. Quanto pesa il becher con il sale?`),
		solution: wu(right, 'g'),
		steps: [`${dec(a, 2)} + ${dec(b, 1)} = ${wu(dec(s, 2), 'g')} \\approx ${wu(right, 'g')}`, t('In una somma il risultato si arrotonda ai decimali del dato che ne ha meno: qui i decimi.')],
		answer: choose(rng, wOpt(right, 'g'), [...wrong, ...fill]),
		params: { case: kind, a: a.toString(), b: b.toString() },
	};
}

const sigOfDec = (s: string) => s.replace('{,}', '').replace(/^0+/, '').length;

// ---------------------------------------------------------------------------
// Level 5: products and quotients

/** Molar masses from the table of the lesson "La mole e la massa molare" (two decimals). */
const MOLAR = [
	{ f: '\\mathrm{H_2O}', nome: "d'acqua", M: q(1802, 100) },
	{ f: '\\mathrm{NaCl}', nome: 'di cloruro di sodio', M: q(5844, 100) },
	{ f: '\\mathrm{CO_2}', nome: 'di anidride carbonica', M: q(4401, 100) },
	{ f: '\\mathrm{NH_3}', nome: 'di ammoniaca', M: q(1704, 100) },
	{ f: '\\mathrm{CH_4}', nome: 'di metano', M: q(1605, 100) },
];

/** A datum with `n` significant figures and `d` decimals, first figure not zero, no trailing zero if integer. */
function datumSig(rng: Rng, n: number, d: number): R {
	for (;;) {
		const k = rng.int(10 ** (n - 1), 10 ** n - 1);
		if (d === 0 && k % 10 === 0) continue;
		return datum(k, d);
	}
}

function level5(rng: Rng): Built {
	const kind = rng.pick(['densita', 'moli', 'massa'] as const);
	return retry(() => products(rng, kind));
}

function products(rng: Rng, kind: 'densita' | 'moli' | 'massa'): Built {
	let x: R, n: number, u: string, problem: string, first: string;
	if (kind === 'densita') {
		const m = datumSig(rng, 4, 2); // 10,00-99,99 g
		const Vd = rng.next() < 0.5 ? 1 : 0;
		const V = Vd ? datumSig(rng, 3, 1) : datumSig(rng, 2, 0); // 10,0-99,9 or 11-99 mL
		x = m.div(V);
		n = Vd ? 3 : 2;
		u = 'g/mL';
		problem = `Un liquido ha la massa di ${pu(dec(m, 2), 'g')} e il volume di ${pu(dec(V, Vd), 'mL')}. Quanto vale la sua densità?`;
		first = `d = \\dfrac{${dec(m, 2)}}{${dec(V, Vd)}}\\,\\text{g/mL}`;
	} else if (kind === 'moli') {
		const s = rng.pick(MOLAR);
		const md = rng.int(1, 2);
		const m = datumSig(rng, 3, md); // 10,0-99,9 or 1,00-9,99 g
		x = m.div(s.M);
		n = 3;
		u = 'mol';
		problem = `Un campione ${s.nome}, $${s.f}$, ha la massa di ${pu(dec(m, md), 'g')}. Quante moli contiene? La massa molare è ${pu(dec(s.M, 2), 'g/mol')}.`;
		first = `n = \\dfrac{m}{M} = \\dfrac{${dec(m, md)}}{${dec(s.M, 2)}}\\,\\text{mol}`;
	} else {
		const d = rng.pick([q(789, 1000), q(126, 100), q(184, 100), q(136, 10)]);
		const Vd = rng.int(0, 1);
		const V = datumSig(rng, 2, Vd); // 11-99 or 1,0-9,9 mL
		x = d.mul(V);
		n = 2;
		u = 'g';
		problem = `Un liquido ha la densità di ${pu(dec(d), 'g/mL')}. Quanto pesano ${pu(dec(V, Vd), 'mL')}?`;
		first = `m = d \\cdot V = ${dec(d)} \\cdot ${dec(V, Vd)}\\,\\text{g}`;
	}
	const p = sigPos(x) - n + 1;
	if (nearHalf(x, p)) throw new Error('half');
	const right = sigW(x, n);
	if (!right) throw new Error('tie');
	// the calculator's figures; one figure more; one less; the zero dropped
	const calc = sigW(x, n + 2);
	const trunc = writeSig(truncAt(x, p), n).tex;
	const wrong = [calc, sigW(x, n + 1), trunc, n > 2 ? sigW(x, n - 1) : null].filter((s): s is string => !!s && s !== right);
	if (/\{,\}\d*0$/.test(right)) wrong.unshift(right.replace(/0+$/, '').replace(/\{,\}$/, ''));
	const words = n === 2 ? 'due' : n === 3 ? 'tre' : 'quattro';
	return {
		prompt: 'Calcola e arrotonda.',
		problem: textBlock(problem),
		solution: wu(right, u),
		steps: [`${first} = ${calc ?? dec(x)}\\ldots \\approx ${wu(right, u)}`, t(`In un prodotto o in un quoziente il risultato ha le cifre significative del dato che ne ha meno: ${words}.`)],
		answer: choose(rng, wOpt(right, u), shuffle(rng, wrong).map((s) => wOpt(s, u))),
		params: { case: kind, x: x.toString(), n },
	};
}

// ---------------------------------------------------------------------------
// Level 6: relative uncertainty and propagation

function level6(rng: Rng): Built {
	const kind = rng.next() < 0.5 ? 'percentuale' : 'densita';
	return retry(() => relative(rng, kind));
}

function relative(rng: Rng, kind: 'percentuale' | 'densita'): Built {
	if (kind === 'percentuale') {
		// a single reading and the sensitivity of the instrument
		const tools = [
			{ nome: 'con un cilindro graduato', D: q(1), d: 0, u: 'mL', lo: 11, hi: 99 },
			{ nome: 'con una buretta', D: q(1, 10), d: 1, u: 'mL', lo: 51, hi: 499 },
			{ nome: 'con una bilancia tecnica', D: q(1, 100), d: 2, u: 'g', lo: 51, hi: 999 },
			{ nome: 'con un termometro', D: q(1), d: 0, u: '°C', lo: 11, hi: 99 },
		];
		const T = rng.pick(tools);
		const k = rng.int(T.lo, T.hi);
		if (k % 10 === 0) throw new Error('zero');
		const x = datum(k, T.d);
		const eps = T.D.div(x).mul(q(100));
		const p = sigPos(eps) - 1;
		if (nearHalf(eps, p)) throw new Error('half');
		const right = sigW(eps, 2);
		if (!right || /0$/.test(right.replace(/\{,\}/, ''))) throw new Error('zero');
		const pOpt = (s: string): ChoiceOption => ({ latex: `${s}\\%`, values: [`${plain(s)} %`] });
		const wrong = [sigW(x.div(T.D), 2), sigW(T.D.div(x), 2), sigW(eps.mul(q(10)), 2), sigW(eps.div(q(10)), 2)].filter((s): s is string => !!s && s !== right);
		return {
			prompt: "Trova l'incertezza percentuale.",
			problem: textBlock(`Una misura fatta ${T.nome}, che ha la sensibilità di ${pu(dec(T.D), T.u)}, dà ${pu(dec(x, T.d), T.u)}. Quanto vale la sua incertezza percentuale?`),
			solution: `${right}\\%`,
			steps: [`\\varepsilon = \\dfrac{\\Delta x}{x} = \\dfrac{${dec(T.D)}}{${dec(x, T.d)}} = ${sigW(eps.div(q(100)), 4) ?? ''}\\ldots`, `\\varepsilon \\cdot 100\\% \\approx ${right}\\%`],
			answer: choose(rng, pOpt(right), wrong.map(pOpt)),
			params: { case: kind, x: x.toString(), D: T.D.toString() },
		};
	}
	// a density from (m ± Δm) and (V ± ΔV): the relative uncertainties add
	const m = datumSig(rng, 4, 2); // 10,00-99,99 g
	const pipette = rng.next() < 0.5;
	const V = pipette ? q(rng.pick([10, 20, 25, 50])) : datumSig(rng, 2, 0);
	const Dm = q(2, 100);
	const DV = pipette ? q(rng.pick([2, 3, 5]), 100) : q(1, 2);
	const d = m.div(V);
	if (d.compare(q(1, 2)) < 0 || d.compare(q(3)) > 0) throw new Error('density');
	const eps = Dm.div(m).add(DV.div(V));
	const Dd = d.mul(eps);
	const r = result(d, Dd);
	if (!r) throw new Error('tie');
	const right = resOpt(r.m, r.D, 'g/mL');
	const wrong: ChoiceOption[] = [];
	const abs = result(d, Dm.add(DV)); // the absolute uncertainties added
	if (abs) wrong.push(resOpt(abs.m, abs.D, 'g/mL'));
	const noD = result(d, eps); // ε not multiplied by d
	if (noD) wrong.push(resOpt(noD.m, noD.D, 'g/mL'));
	const onlyV = result(d, d.mul(DV.div(V).mul(q(2))));
	if (onlyV) wrong.push(resOpt(onlyV.m, onlyV.D, 'g/mL'));
	const pD = sigPos(Dd);
	const more = dec(roundAt(d, pD - 1).v, Math.max(0, 1 - pD));
	wrong.push(resOpt(more, r.D, 'g/mL'));
	const Vd = pipette ? 2 : 0;
	const Vtex = dec(V, Vd);
	return {
		prompt: 'Trova la densità e la sua incertezza.',
		problem: textBlock(`Un liquido ha la massa $m = (${dec(m, 2)} \\pm 0{,}02)\\,\\text{g}$ e il volume $V = (${Vtex} \\pm ${dec(DV)})\\,\\text{mL}$, misurato con ${pipette ? 'una pipetta tarata' : 'un cilindro graduato'}. Quanto vale la sua densità?`),
		solution: right.latex,
		steps: [
			`d = \\dfrac{${dec(m, 2)}}{${Vtex}}\\,\\text{g/mL} = ${decimals(d) <= 5 ? dec(d) : `${(d.num / d.den).toFixed(5).replace('.', '{,}')}\\ldots`}\\,\\text{g/mL}`,
			`\\varepsilon_d = \\dfrac{0{,}02}{${dec(m, 2)}} + \\dfrac{${dec(DV)}}{${Vtex}} \\approx ${(Number(eps.num) / Number(eps.den)).toFixed(4).replace('.', '{,}')}`,
			`\\Delta d = \\varepsilon_d \\cdot d \\approx ${(Number(Dd.num) / Number(Dd.den)).toFixed(4).replace('.', '{,}')}\\,\\text{g/mL}`,
			t("In un quoziente si sommano le incertezze relative; poi l'incertezza va a una cifra, e il valore alla stessa posizione."),
		],
		answer: choose(rng, right, wrong),
		params: { case: kind, m: m.toString(), V: V.toString(), DV: DV.toString() },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimErroriCifreSignificative: Generator = {
	id: ID,
	title: 'Errori di misura e cifre significative',
	levels: {
		1: { label: 'Contare le cifre', constraints: ['zeri iniziali, in mezzo, finali, notazione scientifica'] },
		2: { label: 'Arrotondare', constraints: ['a due o tre cifre significative', 'zeri finali e notazione scientifica quando servono'] },
		3: { label: 'Valore medio e incertezza', constraints: ['quattro o cinque misure', 'semidispersione o sensibilità'] },
		4: { label: 'Somme e differenze', constraints: ['buretta e pesata per differenza: le incertezze si sommano', 'somma con i decimali del dato meno preciso'] },
		5: { label: 'Prodotti e quozienti', constraints: ['densità, moli, massa', 'le cifre del dato che ne ha meno'] },
		6: { label: "L'incertezza relativa", constraints: ['incertezza percentuale di una lettura', 'densità con le incertezze relative sommate'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimErroriCifreSignificative;
