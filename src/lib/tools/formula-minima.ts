import { fail, type Outcome, type ResultRow } from './types';
import { ELEMENTS, molarMass, type Element } from './chimica';
import { fmt, grouped, parseNumber, q, safely, type Q, type Tagged } from './grandezze';

/**
 * Percent composition and empirical formula. From a formula: the percentage by mass of each element. Backwards, from
 * the percentages (or the grams) of each element: the moles, the ratios to the smallest, the multiplier that clears
 * the decimals near ,5 or ,33, the empirical formula, and the molecular formula when the molar mass is given.
 */

// ---------------------------------------------------------------------------------------------------------------
// Numbers.

export interface Dec {
	tex: string;
	text: string;
	exact: boolean;
}

const group = (s: string, sep: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : s);

/** A rational with `digits` decimals: exact when it ends there (trailing zeros dropped), else rounded half up. */
export function dec(x: Q, digits: number, keepZeros = false): Dec {
	const neg = x.sign() < 0;
	const { n, d } = x.abs();
	const scale = 10n ** BigInt(digits);
	const exact = (n * scale) % d === 0n;
	const r = (2n * n * scale + d) / (2n * d);
	const int = (r / scale).toString();
	let frac = (r % scale).toString().padStart(digits, '0');
	if (exact && !keepZeros) frac = frac.replace(/0+$/, '');
	const sign = neg && r !== 0n ? '-' : '';
	return { tex: `${sign}${group(int, '\\,')}${frac ? `{,}${frac}` : ''}`, text: `${sign}${group(int, ' ')}${frac ? `,${frac}` : ''}`, exact };
}
const approx = (x: Dec) => (x.exact ? '=' : '\\approx');

/** An atomic mass as the tables print it: "12{,}01", "[98]". */
const massTex = (e: Element) => (e.radioactive ? `[${e.mass.n}]` : dec(e.mass, 2, true).tex);
/** A molar mass, exact in hundredths: "74{,}10". */
const mm = (x: Q) => dec(x, 2, true);

const PCT = '\\,\\%';
const G = '\\ \\text{g}';
const GMOL = '\\ \\text{g/mol}';
const MOL = '\\ \\text{mol}';

// ---------------------------------------------------------------------------------------------------------------
// Percent composition.

export function composizione(input: string): Outcome {
	return safely(() => {
		const r = molarMass(input);
		if (typeof r === 'string') return fail(r);
		const { formula: f, M } = r;
		if (f.atoms.length < 2) return fail('La formula ha un solo elemento, che è il 100 % della massa. Scrivi un composto, per esempio Ca(OH)2.');
		const steps: Tagged[] = [];
		const sum = f.atoms.map(([e, n]) => (n === 1 ? massTex(e) : `${n} \\cdot ${massTex(e)}`)).join(' + ');
		steps.push({ say: `Calcola la massa molare di $${f.tex}$.`, math: [`M = ${sum}`, `= \\hl{${mm(M).tex}${GMOL}}`], then: 'Le masse atomiche sono quelle della tavola periodica, con due decimali.' });
		const parts = f.atoms.map(([e, n]) => {
			const m = e.mass.mul(q(n));
			const p = dec(m.div(M).mul(q(100)), 2, true);
			return { e, n, m, p };
		});
		steps.push({
			say: 'Dividi la massa di ogni elemento per la massa molare.',
			table: {
				head: ['Elemento', 'Massa nella formula', 'Percentuale in massa'],
				rows: parts.map(({ e, n, m, p }) => [`$\\mathrm{${e.symbol}}$`, `$${n === 1 ? '' : `${n} \\cdot ${massTex(e)} = `}${mm(m).tex}$`, `$\\dfrac{${mm(m).tex}}{${mm(M).tex}} \\cdot 100 ${approx(p)} \\hl{${p.tex}${PCT}}$`])
			},
			then: 'Il quoziente moltiplicato per 100 è la percentuale in massa.'
		});
		const total = parts.reduce((acc, x) => acc.add(parseNumber(x.p.text)!), q(0));
		const t = dec(total, 2, true);
		steps.push({
			say: 'Controlla che la somma delle percentuali faccia 100.',
			math: [`${parts.map((x) => x.p.tex).join(' + ')} = ${t.tex}`],
			then: total.cmp(q(100)) === 0 ? undefined : 'La somma si scosta di poco da 100 per gli arrotondamenti.'
		});
		const rows: ResultRow[] = parts.map(({ e, p }) => ({ label: `Percentuale di ${e.name.toLowerCase()} (${e.symbol})`, value: `$${p.exact ? '' : '\\approx '}${p.tex}${PCT}$` }));
		rows.push({ label: `Massa molare di ${f.text}`, value: `$${mm(M).tex}${GMOL}$` });
		return { ok: true, rows, copy: parts.map(({ e, p }) => `${e.symbol} ${p.text} %`).join('; '), steps };
	});
}

// ---------------------------------------------------------------------------------------------------------------
// Empirical and molecular formula.

export interface MinimaState {
	/** "C 40; H 6,71; O 53,29" */
	e: string;
	/** "%" or "g". */
	u: string;
	/** The molar mass, optional. */
	M: string;
}

const EXAMPLE = 'C 40; H 6,71; O 53,29';
/** How far from a whole number a ratio can be and still count as that number. */
const TOLERANCE = q(1, 10);
const MAX_MULTIPLIER = 6;

/** "C 40; H 6,71; O 53,29" → the symbols and their values; an error sentence otherwise. */
export function parseElements(input: string): { el: Element; x: Q }[] | string {
	const s = input.trim();
	if (!s) return `Scrivi ogni elemento con il suo valore, per esempio ${EXAMPLE}.`;
	if (s.length > 200) return 'Il testo è troppo lungo: scrivi al massimo otto elementi.';
	const re = /([A-Za-z]{1,3})\s*[:=]?\s*(\d+(?:[.,]\d+)?)\s*(?:%|g)?[\s;,]*/y;
	const out: { el: Element; x: Q }[] = [];
	let i = 0;
	while (i < s.length) {
		re.lastIndex = i;
		const m = re.exec(s);
		if (!m) return `Scrivi ogni elemento seguito dal suo valore, separati da punto e virgola: ${EXAMPLE}.`;
		i = re.lastIndex;
		const el = ELEMENTS.find((e) => e.symbol === m[1]);
		if (!el) {
			const other = ELEMENTS.find((e) => e.symbol.toLowerCase() === m[1].toLowerCase());
			return other ? `Scrivi ${other.symbol} con la maiuscola giusta: la prima lettera maiuscola, la seconda minuscola.` : `Non esiste un elemento con simbolo ${m[1]}: controlla la tavola periodica.`;
		}
		if (out.some((x) => x.el === el)) return `${el.symbol} compare due volte: scrivi ogni elemento una volta sola.`;
		const x = parseNumber(m[2]);
		if (!x || x.sign() <= 0) return `Il valore di ${el.symbol} deve essere maggiore di zero.`;
		out.push({ el, x });
	}
	if (out.length < 2) return `Servono almeno due elementi, per esempio ${EXAMPLE}.`;
	if (out.length > 8) return 'Scrivi al massimo otto elementi.';
	return out;
}

/** The distance of a rational from the nearest whole number, and that number. */
function nearest(x: Q): { n: bigint; off: Q } {
	const n = (2n * x.n + x.d) / (2n * x.d);
	return { n, off: x.sub(q(n)).abs() };
}

/** Why a multiplier clears the decimals, in words. */
const WHY: Record<number, string> = {
	2: 'Un rapporto finisce con circa ,5: moltiplicando per 2 diventa intero.',
	3: 'Un rapporto finisce con circa ,33 o ,67: moltiplicando per 3 diventa intero.',
	4: 'Un rapporto finisce con circa ,25 o ,75: moltiplicando per 4 diventa intero.',
	5: 'I decimali sono vicini a multipli di 0,2: moltiplicando per 5 diventano interi.',
	6: 'Un rapporto finisce con circa ,17 o ,83: moltiplicando per 6 diventa intero.'
};

export function formulaMinima(state: MinimaState): Outcome {
	return safely(() => {
		const data = parseElements(state.e ?? '');
		if (typeof data === 'string') return fail(data);
		const grams = state.u === 'g';
		const steps: Tagged[] = [];
		if (!grams) {
			const total = data.reduce((acc, d) => acc.add(d.x), q(0));
			if (total.sub(q(100)).abs().cmp(q(1)) > 0)
				return fail(`Le percentuali sommano ${fmt(total).text} %: devono fare circa 100 %. Se manca un elemento, aggiungilo con la sua percentuale.`);
			steps.push({
				say: 'Considera 100 g di composto.',
				table: { head: ['Elemento', 'Percentuale', 'Massa in 100 g'], rows: data.map(({ el, x }) => [`$\\mathrm{${el.symbol}}$`, `$${fmt(x).tex}${PCT}$`, `$${fmt(x).tex}${G}$`]) },
				then: 'Così la percentuale di ogni elemento è la sua massa in grammi.',
				part: 'Le moli'
			});
		}
		// Moles of each element, exact; shown with three decimals.
		const moles = data.map(({ el, x }) => ({ el, x, n: x.div(el.mass) }));
		steps.push({
			say: 'Dividi la massa di ogni elemento per la sua massa atomica.',
			table: {
				head: ['Elemento', 'Massa', 'Massa atomica', 'Moli'],
				rows: moles.map(({ el, x, n }) => {
					const d = dec(n, 3, true);
					return [`$\\mathrm{${el.symbol}}$`, `$${fmt(x).tex}${G}$`, `$${massTex(el)}${GMOL}$`, `$\\dfrac{${fmt(x).tex}}{${massTex(el)}} ${approx(d)} \\hl{${d.tex}${MOL}}$`];
				})
			},
			part: 'Le moli'
		});
		const least = moles.reduce((a, b) => (b.n.cmp(a.n) < 0 ? b : a));
		const ratios = moles.map((m) => ({ ...m, r: m.n.div(least.n) }));
		const lt = dec(least.n, 3, true).tex;
		steps.push({
			say: 'Dividi tutte le moli per la più piccola.',
			table: {
				head: ['Elemento', 'Moli', 'Rapporto'],
				rows: ratios.map(({ el, n, r }) => {
					const d = dec(r, 2);
					const isLeast = el === least.el;
					return [`$\\mathrm{${el.symbol}}$`, `$${dec(n, 3, true).tex}$`, `$\\dfrac{${dec(n, 3, true).tex}}{${lt}} ${isLeast ? '=' : approx(d)} \\hl{${isLeast ? '1' : d.tex}}$`];
				})
			},
			then: `La più piccola è quella di ${least.el.name.toLowerCase()}.`,
			part: 'Il rapporto tra gli atomi'
		});
		let k = 0;
		for (let m = 1; m <= MAX_MULTIPLIER && !k; m++) if (ratios.every(({ r }) => nearest(r.mul(q(m))).off.cmp(TOLERANCE) <= 0)) k = m;
		if (!k) return fail(`Anche moltiplicando per 2, 3, 4, 5 o 6 i rapporti non diventano vicini a numeri interi: controlla i dati.`);
		const counts = ratios.map(({ el, r }) => ({ el, r, kr: r.mul(q(k)), n: Number(nearest(r.mul(q(k))).n) }));
		steps.push({
			say: k === 1 ? 'Arrotonda ogni rapporto all’intero più vicino.' : `Moltiplica tutti i rapporti per $${k}$ e arrotonda.`,
			table: {
				head: k === 1 ? ['Elemento', 'Rapporto', 'Atomi'] : ['Elemento', 'Rapporto', `Per $${k}$`, 'Atomi'],
				rows: counts.map(({ el, r, kr, n }) => {
					const rd = dec(r, 2).tex;
					const row = [`$\\mathrm{${el.symbol}}$`, `$${rd}$`];
					if (k > 1) row.push(`$${rd} \\cdot ${k} ${approx(dec(kr, 2))} ${dec(kr, 2).tex}$`);
					row.push(`$\\hl{${n}}$`);
					return row;
				})
			},
			then: k === 1 ? 'I rapporti sono già vicini a numeri interi.' : WHY[k]
		});
		const minimalText = counts.map(({ el, n }) => `${el.symbol}${n === 1 ? '' : n}`).join('');
		const minimal = molarMass(minimalText);
		if (typeof minimal === 'string') return fail(minimal);
		const mf = minimal.formula;
		steps.push({ say: 'Scrivi la formula minima con questi numeri come indici.', math: [`\\hl{${mf.tex}}`] });

		const rows: ResultRow[] = [{ label: 'Formula minima', value: `$${mf.tex}$` }];
		let copy = mf.text;
		const Mtext = (state.M ?? '').trim();
		if (Mtext) {
			const Mgiven = parseNumber(Mtext);
			if (!Mgiven || Mgiven.sign() <= 0) return fail('Scrivi la massa molare in g/mol, per esempio 180, oppure lascia il campo vuoto.');
			const Mmin = minimal.M;
			const sum = mf.atoms.map(([e, n]) => (n === 1 ? massTex(e) : `${n} \\cdot ${massTex(e)}`)).join(' + ');
			steps.push({ say: 'Calcola la massa della formula minima.', math: [`M_{\\text{min}} = ${sum}`, `= \\hl{${mm(Mmin).tex}${GMOL}}`], part: 'La formula molecolare' });
			const ratio = Mgiven.div(Mmin);
			const rd = dec(ratio, 2);
			const near = nearest(ratio);
			const fits = near.n >= 1n && near.off.cmp(TOLERANCE) <= 0;
			steps.push({
				say: 'Dividi la massa molare per la massa della formula minima.',
				math: [`\\dfrac{${fmt(Mgiven).tex}${GMOL}}{${mm(Mmin).tex}${GMOL}} ${approx(rd)} \\hl{${rd.tex}}`],
				then: fits ? `Il risultato è circa $${near.n}$: la molecola contiene $${near.n}$ volte la formula minima.` : 'Il risultato non è vicino a un numero intero: controlla la massa molare.'
			});
			if (fits) {
				const times = Number(near.n);
				const molecular = molarMass(counts.map(({ el, n }) => `${el.symbol}${n * times === 1 ? '' : n * times}`).join(''));
				if (typeof molecular === 'string') return fail(molecular);
				const inner = mf.tex.replace(/^\\mathrm\{|\}$/g, '');
				if (times === 1) steps[steps.length - 1].then = 'Il risultato è circa $1$: la formula molecolare è uguale alla formula minima.';
				else steps.push({ say: `Moltiplica tutti gli indici per $${times}$.`, math: [`\\mathrm{(${inner})_{${times}}} = \\hl{${molecular.formula.tex}}`] });
				rows.push({ label: 'Formula molecolare', value: `$${molecular.formula.tex}$` });
				rows.push({ label: 'Massa della formula minima', value: `$${mm(Mmin).tex}${GMOL}$` });
				copy = molecular.formula.text;
			} else {
				rows.push({ label: 'Massa della formula minima', value: `$${mm(Mmin).tex}${GMOL}$` });
			}
		}
		return { ok: true, rows, copy, steps: grouped(steps) };
	});
}

/** The two modes of the page, for the component. */
export type ComposizioneMode = 'minima' | 'comp';
