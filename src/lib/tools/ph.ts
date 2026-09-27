import { fail, type Outcome, type ResultRow, type Step } from './types';
import { fmt, parseNumber, q, safely, type Q } from './grandezze';

/**
 * pH and pOH at 25 °C, where the ionic product of water is K_w = 10^-14: from the concentration of H⁺ or OH⁻, from
 * the pH or the pOH, or from the molarity of a strong acid or base. Logarithms are rounded to two decimals, as in the
 * books; concentrations are written in scientific notation with three significant digits when rounded.
 */

export type PhMode = 'H' | 'OH' | 'pH' | 'pOH' | 'acido' | 'base';
export const PH_MODES: PhMode[] = ['H', 'OH', 'pH', 'pOH', 'acido', 'base'];

const KW = q(1, 10n ** 14n);
const NEUTRAL = q(1, 10n ** 7n);
const FOURTEEN = q(14);

// ---------------------------------------------------------------------------------------------------------------
// Numbers.

const pow10n = (k: number) => 10n ** BigInt(k);
const pow10 = (k: number): Q => (k >= 0 ? q(pow10n(k)) : q(1n, pow10n(-k)));

/** floor(log10 x) for a positive rational. */
export function exponentOf(x: Q): number {
	const { n, d } = x;
	const e = n.toString().length - d.toString().length;
	const ge = e >= 0 ? n >= d * pow10n(e) : n * pow10n(-e) >= d;
	return ge ? e : e - 1;
}

/** The greatest integer not above a rational. */
function floorQ(x: Q): number {
	const f = x.n / x.d;
	return Number(x.n < 0n && f * x.d !== x.n ? f - 1n : f);
}

/** A number in scientific notation, for the formulas and for the copy button. */
export interface Sci {
	tex: string;
	text: string;
	exact: boolean;
}

/** Mantissa digits as "2{,}5" and "2,5". */
function mantissa(digits: string, keepZeros: boolean): [string, string] {
	const frac = keepZeros ? digits.slice(1) : digits.slice(1).replace(/0+$/, '');
	return [`${digits[0]}${frac ? `{,}${frac}` : ''}`, `${digits[0]}${frac ? `,${frac}` : ''}`];
}

function sciOf(digits: string, e: number, exact: boolean): Sci {
	const [mt, mx] = mantissa(digits, !exact);
	if (e === 0) return { tex: mt, text: mx, exact };
	return { tex: `${mt} \\cdot 10^{${e}}`, text: `${mx} · 10^${e}`, exact };
}

/**
 * A positive rational in scientific notation: exact when its mantissa has at most `maxSig` significant digits, else
 * rounded to three. Between 1 and 10 there is no power of ten: 2,5.
 */
export function sci(x: Q, maxSig = 4): Sci {
	let e = exponentOf(x);
	const m = x.div(pow10(e));
	const scaledExact = m.mul(pow10(maxSig - 1));
	if (scaledExact.d === 1n) return sciOf(scaledExact.n.toString(), e, true);
	let r = (2n * m.n * 100n + m.d) / (2n * m.d);
	if (r === 1000n) {
		r = 100n;
		e += 1;
	}
	return sciOf(r.toString(), e, false);
}

/** 10^p for a rational p: exact when p is an integer, else the mantissa rounded to three significant digits. */
function tenTo(p: Q): { e: number; frac: Q; value: Sci } {
	const e = floorQ(p);
	const frac = p.sub(q(e));
	if (frac.isZero()) return { e, frac, value: sciOf('1', e, true) };
	let r = Math.round(10 ** (2 + frac.toNumber()));
	let ee = e;
	if (r >= 1000) {
		r = 100;
		ee += 1;
	}
	return { e, frac, value: sciOf(String(r), ee, false) };
}

/** A pH or a pOH: exact (typed, or the log of a power of ten) or rounded to two decimals. */
interface PValue {
	q: Q;
	exact: boolean;
}

/** "2{,}60" for a rounded value (always two decimals), "3" or "3{,}7" for an exact one. */
function pTex(p: PValue): string {
	if (p.exact) return fmt(p.q).tex;
	const cents = p.q.mul(q(100));
	const c = cents.n < 0n ? -cents.n : cents.n;
	const s = c.toString().padStart(3, '0');
	return `${cents.n < 0n ? '-' : ''}${s.slice(0, -2)}{,}${s.slice(-2)}`;
}
const pText = (p: PValue) => pTex(p).replace('{,}', ',');
const eqS = (s: Sci) => (s.exact ? '=' : '\\approx');
/** Two decimals of a number, as a LaTeX decimal: 0.398 → "0{,}40". */
const twoDecimals = (cents: number) => {
	const s = String(Math.abs(cents)).padStart(3, '0');
	return `${cents < 0 ? '-' : ''}${s.slice(0, -2)}{,}${s.slice(-2)}`;
};

// ---------------------------------------------------------------------------------------------------------------
// The two ions.

interface Ion {
	/** "[\\mathrm{H^+}]" */
	c: string;
	/** "\\mathrm{pH}" */
	p: string;
	/** "\\mathrm{H^+}" */
	ion: string;
	/** For the labels: "H⁺". */
	text: string;
	/** "pH" for the copy and the labels. */
	pText: string;
}
const H: Ion = { c: '[\\mathrm{H^+}]', p: '\\mathrm{pH}', ion: '\\mathrm{H^+}', text: 'H⁺', pText: 'pH' };
const OH: Ion = { c: '[\\mathrm{OH^-}]', p: '\\mathrm{pOH}', ion: '\\mathrm{OH^-}', text: 'OH⁻', pText: 'pOH' };
const MOLL = '\\ \\text{mol/L}';

/** The logarithm step: p = -log x, split into the mantissa and the power of ten. */
function logStep(ion: Ion, x: Q): { step: Step; p: PValue } {
	const e = exponentOf(x);
	const m = x.div(pow10(e));
	const shown = sci(x, 6);
	const first = `${ion.p} = -\\log(${shown.tex})`;
	if (m.isOne()) {
		const p: PValue = { q: q(-e), exact: true };
		const lines = e === 0 ? [first, `= \\hl{0}`] : [first, `= -(${e})`, `= \\hl{${-e}}`];
		return { step: { say: `Calcola il ${ion.pText} con la definizione.`, math: [`${ion.p} = -\\log ${ion.c}`, ...lines] }, p };
	}
	const logCents = Math.round(Math.log10(Number(m.n) / Number(m.d)) * 100);
	const p: PValue = { q: q(-(e * 100 + logCents), 100), exact: false };
	const mTex = sci(m, 6).tex;
	const lines =
		e === 0
			? [`${ion.p} = -\\log ${mTex}`, `\\approx \\hl{${pTex(p)}}`]
			: [first, `= -(\\log ${mTex} + \\log 10^{${e}})`, `\\approx -(${twoDecimals(logCents)} ${e < 0 ? '-' : '+'} ${Math.abs(e)})`, `\\approx \\hl{${pTex(p)}}`];
	return { step: { say: `Calcola il ${ion.pText} con la definizione.`, math: [`${ion.p} = -\\log ${ion.c}`, ...lines] }, p };
}

/** pH + pOH = 14: the other p from one. */
function otherPStep(from: Ion, to: Ion, p: PValue): { step: Step; p: PValue } {
	const other: PValue = { q: FOURTEEN.sub(p.q), exact: p.exact };
	const minus = p.q.sign() < 0 ? `(${pTex(p)})` : pTex(p);
	return {
		step: {
			say: `Ricava il ${to.pText} dal ${from.pText}.`,
			math: [`\\mathrm{pH} + \\mathrm{pOH} = 14`, `${to.p} = 14 - ${minus}`, `= \\hl{${pTex(other)}}`],
			then: 'Vale a 25 °C, dove il prodotto ionico dell’acqua è $K_w = 10^{-14}$.'
		},
		p: other
	};
}

/** [B] = K_w / [A]. */
function kwStep(from: Ion, to: Ion, x: Q): { step: Step; c: Sci; q: Q } {
	const y = KW.div(x);
	const c = sci(y);
	return {
		step: {
			say: `Calcola la concentrazione di $${to.ion}$ con $K_w$.`,
			math: [`${to.c} = \\dfrac{K_w}{${from.c}}`, `= \\dfrac{10^{-14}}{${sci(x, 6).tex}}`, `${eqS(c)} \\hl{${c.tex}}${MOLL}`]
		},
		c,
		q: y
	};
}

/** [A] = 10^-p. */
function powStep(ion: Ion, p: PValue): { step: Step; c: Sci } {
	const t = tenTo(p.q.neg());
	const minus = pTex({ q: p.q.neg(), exact: p.exact });
	const lines = [`${ion.c} = 10^{-${ion.p}}`, `= 10^{${minus}}`];
	if (!t.frac.isZero() && t.e !== 0) lines.push(`= 10^{${fmt(t.frac).tex}} \\cdot 10^{${t.e}}`);
	lines.push(`${eqS(t.value)} \\hl{${t.value.tex}}${MOLL}`);
	return { step: { say: `Calcola la concentrazione di $${ion.ion}$.`, math: lines }, c: t.value };
}

// ---------------------------------------------------------------------------------------------------------------
// The tool.

export interface PhState {
	modo: string;
	x: string;
	k: string;
}

const EXAMPLES: Record<PhMode, string> = { H: '2,5e-3', OH: '1e-4', pH: '3,7', pOH: '4,2', acido: '0,01', base: '0,005' };

export function ph(state: PhState): Outcome {
	return safely(() => {
		const mode: PhMode = (PH_MODES as string[]).includes(state.modo) ? (state.modo as PhMode) : 'H';
		const raw = parseNumber(state.x ?? '');
		const steps: Step[] = [];
		let pH: PValue, pOH: PValue, cH: Sci, cOH: Sci;
		/** Which side of 7: -1 acid, 0 neutral, 1 basic, compared exactly. */
		let side: -1 | 0 | 1;

		if (mode === 'pH' || mode === 'pOH') {
			if (!raw) return fail(`Scrivi il ${mode}, per esempio ${EXAMPLES[mode]}.`);
			if (raw.cmp(q(-1)) < 0 || raw.cmp(FOURTEEN.add(q(1))) > 0) return fail(`Il ${mode} di una soluzione in acqua sta tra -1 e 15: scrivi per esempio ${EXAMPLES[mode]}.`);
			if (raw.mul(q(10000)).d !== 1n) return fail(`Scrivi il ${mode} con al massimo quattro decimali, per esempio ${EXAMPLES[mode]}.`);
			const [a, b] = mode === 'pH' ? [H, OH] : [OH, H];
			const given: PValue = { q: raw, exact: true };
			const o = otherPStep(a, b, given);
			const ca = powStep(a, given);
			const cb = powStep(b, o.p);
			steps.push(o.step, ca.step, cb.step);
			[pH, pOH] = mode === 'pH' ? [given, o.p] : [o.p, given];
			[cH, cOH] = mode === 'pH' ? [ca.c, cb.c] : [cb.c, ca.c];
			side = pH.q.cmp(q(7)) === 0 ? 0 : pH.q.cmp(q(7)) < 0 ? -1 : 1;
		} else {
			const strong = mode === 'acido' || mode === 'base';
			const what = strong ? `la molarità dell’${mode === 'acido' ? 'acido' : 'base'}` : `la concentrazione di ${mode === 'H' ? 'H⁺' : 'OH⁻'} in mol/L`;
			if (!raw) return fail(`Scrivi ${what}, per esempio ${EXAMPLES[mode]}.`);
			if (raw.sign() <= 0) return fail(`La concentrazione deve essere maggiore di zero: scrivi per esempio ${EXAMPLES[mode]}.`);
			const a = mode === 'H' || mode === 'acido' ? H : OH;
			const b = a === H ? OH : H;
			let x = raw;
			if (strong) {
				const k = state.k === '2' ? 2 : 1;
				x = raw.mul(q(k));
				const c = sci(x);
				const given = sci(raw, 6);
				const lines = k === 1 ? [`${a.c} = C`, `= \\hl{${given.tex}}${MOLL}`] : [`${a.c} = 2 \\cdot C`, `= 2 \\cdot ${given.tex}${MOLL}`, `${eqS(c)} \\hl{${c.tex}}${MOLL}`];
				const thenOne = mode === 'acido' ? 'Ogni molecola di acido libera uno ione $\\mathrm{H^+}$.' : 'Ogni unità di base libera uno ione $\\mathrm{OH^-}$.';
				const thenTwo = mode === 'acido' ? 'Ogni molecola di acido libera due ioni $\\mathrm{H^+}$.' : 'Ogni unità di base libera due ioni $\\mathrm{OH^-}$, come $\\mathrm{Ca(OH)_2}$.';
				steps.push({ say: `${mode === 'acido' ? 'L’acido forte' : 'La base forte'} si dissocia del tutto: scrivi $${a.c}$.`, math: lines, then: k === 1 ? thenOne : thenTwo });
				if (x.cmp(q(1, 1_000_000)) < 0)
					return fail(`La soluzione è così diluita che conta anche la ionizzazione dell’acqua, e il pH resta vicino a 7. Questo strumento calcola da ${mode === 'acido' ? 'acidi' : 'basi'} di almeno 0,000001 mol/L (10^-6).`);
			}
			if (x.cmp(q(15)) > 0) return fail(`Una concentrazione di ${a.text} oltre 15 mol/L non esiste in acqua: scrivi per esempio ${EXAMPLES[mode]}.`);
			if (x.cmp(q(1n, 10n ** 15n)) < 0) return fail(`La concentrazione è troppo piccola: sotto 10^-15 mol/L il pH supererebbe 15. Scrivi per esempio ${EXAMPLES[mode]}.`);
			const l = logStep(a, x);
			const o = otherPStep(a, b, l.p);
			const k = kwStep(a, b, x);
			steps.push(l.step, o.step, k.step);
			const given = sci(x, 6);
			[pH, pOH] = a === H ? [l.p, o.p] : [o.p, l.p];
			[cH, cOH] = a === H ? [given, k.c] : [k.c, given];
			const cHq = a === H ? x : k.q;
			side = cHq.cmp(NEUTRAL) === 0 ? 0 : cHq.cmp(NEUTRAL) > 0 ? -1 : 1;
		}

		// Acid, basic or neutral, from the exact values: a pH of 7,00 after rounding can still lean to one side.
		const shownSeven = pH.q.cmp(q(7)) === 0;
		const nature = side === 0 ? 'neutra' : shownSeven ? (side < 0 ? 'quasi neutra, appena acida' : 'quasi neutra, appena basica') : side < 0 ? 'acida' : 'basica';
		const cmp = side === 0 ? '=' : side < 0 ? '<' : '>';
		steps.push({
			say: 'Confronta il pH con 7.',
			math: [`${pTex(pH)} ${shownSeven && side !== 0 ? '\\approx' : cmp} 7`],
			then:
				side === 0
					? 'Il pH è 7: la soluzione è neutra.'
					: shownSeven
						? `Il pH arrotondato è 7, ma $[\\mathrm{H^+}]$ è ${side < 0 ? 'maggiore' : 'minore'} di $10^{-7}$: la soluzione è ${nature}.`
						: `Il pH è ${side < 0 ? 'minore' : 'maggiore'} di 7: la soluzione è ${nature}.`
		});
		if (pH.q.sign() < 0) steps[steps.length - 1].then += ' Un pH negativo capita nelle soluzioni molto concentrate.';

		const pRow = (p: PValue, label: string): ResultRow => ({ label, value: `$${p.exact ? '' : '\\approx '}${pTex(p)}$` });
		const cRow = (c: Sci, ion: Ion): ResultRow => ({ label: `Concentrazione di ${ion.text}`, value: `$${c.exact ? '' : '\\approx '}${c.tex}${MOLL}$` });
		const natureRow: ResultRow = { label: 'La soluzione è', value: nature };
		let rows: ResultRow[];
		let copy: string;
		if (mode === 'pH') {
			rows = [cRow(cH, H), cRow(cOH, OH), pRow(pOH, 'pOH'), natureRow];
			copy = `[H⁺] ${cH.exact ? '=' : '≈'} ${cH.text} mol/L`;
		} else if (mode === 'pOH') {
			rows = [pRow(pH, 'pH'), cRow(cOH, OH), cRow(cH, H), natureRow];
			copy = `pH ${pH.exact ? '=' : '≈'} ${pText(pH)}`;
		} else {
			rows = [pRow(pH, 'pH'), pRow(pOH, 'pOH'), cRow(cH, H), cRow(cOH, OH), natureRow];
			copy = `pH ${pH.exact ? '=' : '≈'} ${pText(pH)}`;
		}
		return { ok: true, rows, copy, steps };
	});
}
