import { fail, type Outcome, type ResultRow } from './types';
import { parseFormula, type Element, type Formula } from './chimica';
import { dec } from './formula-minima';
import { fmt, grouped, parseNumber, q, rel, safely, unit, vu, type Q, type Tagged } from './grandezze';

/**
 * The limiting reagent of a balanced reaction: the student writes the reaction with its coefficients and the grams or
 * moles of each reagent; the tool checks the balance (it does not balance), turns the data into moles, divides by the
 * coefficients, and gives the products and what is left of the reagents in excess. Exact arithmetic throughout,
 * values rounded only when shown.
 */

export interface Species {
	coef: number;
	formula: Formula;
	/** Molar mass in g/mol, exact in hundredths. */
	M: Q;
	/** "2\\mathrm{H_{2}}" */
	tex: string;
}

export interface Reaction {
	reagents: Species[];
	products: Species[];
}

export const REACTION_EXAMPLE = '2H2 + O2 -> 2H2O';
const MAX_SPECIES = 4;
const MAX_COEF = 99;

/** One side of the reaction: "2H2 + O2". */
function readSide(side: string, where: string): Species[] | string {
	const terms = side.split('+').map((t) => t.trim());
	if (terms.some((t) => !t)) return `Manca una sostanza ${where}: tra due segni + scrivi una formula, per esempio ${REACTION_EXAMPLE}.`;
	const out: Species[] = [];
	for (const term of terms) {
		// Physical states are allowed and ignored: H2O(l), NaCl(aq).
		const t = term.replace(/\s*\((s|l|g|aq)\)$/i, '');
		if (/^\d+\s*\/\s*\d+/.test(t) || /^\d+[.,]\d/.test(t)) return `Usa coefficienti interi: moltiplica tutta la reazione per togliere le frazioni, come in ${REACTION_EXAMPLE}.`;
		const m = /^(\d+)?\s*(.*)$/.exec(t)!;
		const coef = m[1] ? Number(m[1]) : 1;
		if (coef === 0 || coef > MAX_COEF) return `Il coefficiente di ${m[2] || term} deve essere tra 1 e ${MAX_COEF}.`;
		const f = parseFormula(m[2]);
		if (typeof f === 'string') return `In ${term}: ${f.charAt(0).toLowerCase()}${f.slice(1)}`;
		const M = f.atoms.reduce((acc, [e, n]) => acc.add(e.mass.mul(q(n))), q(0));
		out.push({ coef, formula: f, M, tex: `${coef === 1 ? '' : coef}${f.tex}` });
	}
	return out;
}

/** Reads "2H2 + O2 -> 2H2O" (also →, =, =>); an error sentence when it is not a reaction. */
export function parseReaction(input: string): Reaction | string {
	const s = input.trim();
	if (!s) return `Scrivi la reazione bilanciata, per esempio ${REACTION_EXAMPLE}.`;
	if (s.length > 120) return 'La reazione è troppo lunga: al massimo 120 caratteri.';
	const sides = s.split(/-+>|→|⟶|=>|=/);
	if (sides.length !== 2) return `Separa reagenti e prodotti con una freccia, una sola: ${REACTION_EXAMPLE}.`;
	const reagents = readSide(sides[0], 'tra i reagenti');
	if (typeof reagents === 'string') return reagents;
	const products = readSide(sides[1], 'tra i prodotti');
	if (typeof products === 'string') return products;
	if (reagents.length < 2) return 'Servono almeno due reagenti: con uno solo non c’è un reagente limitante.';
	if (reagents.length > MAX_SPECIES || products.length > MAX_SPECIES) return `Scrivi al massimo ${MAX_SPECIES} reagenti e ${MAX_SPECIES} prodotti.`;
	return { reagents, products };
}

/** The atoms of each element on one side, coefficients included. */
function atomsOf(side: Species[]): Map<Element, number> {
	const out = new Map<Element, number>();
	for (const s of side) for (const [e, n] of s.formula.atoms) out.set(e, (out.get(e) ?? 0) + n * s.coef);
	return out;
}

/** An error sentence when the reaction is not balanced, else the table of the atoms on each side. */
export function checkBalance(r: Reaction): { rows: [Element, number, number][] } | string {
	const left = atomsOf(r.reagents);
	const right = atomsOf(r.products);
	const elements = [...left.keys(), ...[...right.keys()].filter((e) => !left.has(e))];
	const rows = elements.map((e): [Element, number, number] => [e, left.get(e) ?? 0, right.get(e) ?? 0]);
	const wrong = rows.filter(([, a, b]) => a !== b);
	if (!wrong.length) return { rows };
	const said = wrong.slice(0, 3).map(([e, a, b], i) => `${i ? 'quelli' : 'gli atomi'} di ${e.symbol} sono ${a} a sinistra e ${b} a destra`);
	return `La reazione non è bilanciata: ${said.join('; ')}. Scrivi i coefficienti giusti, per esempio ${REACTION_EXAMPLE}: questo strumento non bilancia le reazioni.`;
}

/** The reagents of a reaction as plain text, for the labels of the inputs; null while the reaction does not parse. */
export function reagentsOf(input: string): string[] | null {
	const r = parseReaction(input);
	return typeof r === 'string' ? null : r.reagents.map((s) => s.formula.text);
}

// ---------------------------------------------------------------------------------------------------------------
// The calculation.

export const AMOUNT_KEYS = ['a', 'b', 'c', 'd'] as const;
export const AMOUNT_UNITS = [
	{ id: 'g', label: 'g' },
	{ id: 'kg', label: 'kg' },
	{ id: 'mol', label: 'mol' }
];

const G = unit('g', 'g', '\\text{g}');
const KG = unit('kg', 'kg', '\\text{kg}');
const MOL = unit('mol', 'mol', '\\text{mol}');
/** A molar mass with its two decimals, as in the tables: 32,00 g/mol. */
const massVu = (M: Q) => `${dec(M, 2, true).tex}\\ \\text{g/mol}`;
/** Grams with two decimals, as the molar masses: 33,0075 g is shown as 33,01 g. Tiny amounts in scientific notation. */
const gram = (x: Q) => (x.abs().cmp(q(1, 10)) >= 0 ? dec(x, 2) : fmt(x));
const gv = (x: Q) => `${gram(x).tex}\\ \\text{g}`;
const gRel = (x: Q) => (gram(x).exact ? '=' : '\\approx');
const gApprox = (x: Q) => (gram(x).exact ? '' : '\\approx ');
const approxSign = (x: Q) => (fmt(x).exact ? '' : '\\approx ');
/** n(\\mathrm{H_2O}) */
const nOf = (s: Species) => `n(${s.formula.tex})`;
const mOf = (s: Species) => `m(${s.formula.tex})`;
/** "\\dfrac{2}{1}" as a plain factor: 2, or the fraction when it does not simplify to an integer. */
function ratioTex(a: number, b: number): string {
	if (a === b) return '';
	if (b === 1) return `${a} \\cdot `;
	return `\\dfrac{${a}}{${b}} \\cdot `;
}

export function reagenteLimitante(state: Record<string, string>): Outcome {
	return safely(() => {
		const r = parseReaction(state.r ?? '');
		if (typeof r === 'string') return fail(r);
		const balance = checkBalance(r);
		if (typeof balance === 'string') return fail(balance);

		// The data, in moles.
		const data = r.reagents.map((s, i) => {
			const key = AMOUNT_KEYS[i];
			const raw = parseNumber(state[key] ?? '');
			const u = state[`u${key}`] === 'mol' ? 'mol' : state[`u${key}`] === 'kg' ? 'kg' : 'g';
			return { s, raw, u };
		});
		for (const d of data) {
			if (!d.raw) return fail(`Scrivi la quantità di ${d.s.formula.text}, in grammi o in moli, per esempio 10.`);
			if (d.raw.sign() <= 0) return fail(`La quantità di ${d.s.formula.text} deve essere maggiore di zero.`);
		}
		const reag = data.map(({ s, raw, u }) => {
			const x = raw!;
			const grams = u === 'kg' ? x.mul(q(1000)) : x;
			const n = u === 'mol' ? x : grams.div(s.M);
			return { s, x, u, grams, n, per: n.div(q(s.coef)) };
		});

		const steps: Tagged[] = [];
		const arrow = `${r.reagents.map((s) => s.tex).join(' + ')} \\longrightarrow ${r.products.map((s) => s.tex).join(' + ')}`;
		steps.push({
			say: 'Controlla che la reazione sia bilanciata.',
			math: [arrow],
			table: { head: ['Elemento', 'A sinistra', 'A destra'], rows: balance.rows.map(([e, a, b]) => [`$\\mathrm{${e.symbol}}$`, `$${a}$`, `$${b}$`]) },
			then: 'Ogni elemento ha gli stessi atomi dai due lati: la reazione è bilanciata.',
			part: 'La reazione'
		});
		const all = [...r.reagents, ...r.products];
		steps.push({
			say: 'Calcola la massa molare di ogni sostanza.',
			table: { head: ['Sostanza', 'Massa molare'], rows: all.map((s) => [`$${s.formula.tex}$`, `$${massVu(s.M)}$`]) },
			then: 'Le masse atomiche sono quelle della tavola periodica, con due decimali.',
			part: 'La reazione'
		});
		steps.push({
			say: 'Trasforma le quantità dei reagenti in moli.',
			table: {
				head: ['Reagente', 'Dato', 'Moli'],
				rows: reag.map(({ s, x, u, grams, n }) => {
					if (u === 'mol') return [`$${s.formula.tex}$`, `$${vu(x, MOL)}$`, `$\\hl{${vu(n, MOL)}}$`];
					const given = u === 'kg' ? `${vu(x, KG)} = ${vu(grams, G)}` : vu(x, G);
					return [`$${s.formula.tex}$`, `$${given}$`, `$\\dfrac{${vu(grams, G)}}{${massVu(s.M)}} ${rel(n)} \\hl{${vu(n, MOL)}}$`];
				})
			},
			then: reag.some((x) => x.u !== 'mol') ? 'Dividi i grammi per la massa molare.' : undefined,
			part: 'Il reagente limitante'
		});
		const least = reag.reduce((a, b) => (b.per.cmp(a.per) < 0 ? b : a)).per;
		const limiting = reag.filter((x) => x.per.cmp(least) === 0);
		const excess = reag.filter((x) => x.per.cmp(least) !== 0);
		const lim = limiting[0];
		const names = (xs: typeof reag) => xs.map((x) => `$${x.s.formula.tex}$`).join(' e ');
		steps.push({
			say: 'Dividi le moli di ogni reagente per il suo coefficiente.',
			table: {
				head: ['Reagente', 'Moli', 'Coefficiente', 'Moli diviso coefficiente'],
				rows: reag.map(({ s, n, per }) => {
					const cell = s.coef === 1 ? fmt(per).tex : `\\dfrac{${fmt(n).tex}}{${s.coef}} ${rel(per)} ${fmt(per).tex}`;
					return [`$${s.formula.tex}$`, `$${approxSign(n)}${fmt(n).tex}$`, `$${s.coef}$`, `$${per.cmp(least) === 0 ? `\\hl{${cell}}` : cell}$`];
				})
			},
			then: !excess.length
				? 'I valori sono uguali: i reagenti sono in proporzione esatta e nessuno avanza.'
				: limiting.length > 1
					? `Il valore più piccolo è quello di ${names(limiting)}: finiscono insieme, e sono i reagenti limitanti.`
					: `Il valore più piccolo è quello di ${names(limiting)}: è il reagente limitante.`,
			part: 'Il reagente limitante'
		});

		// Products from the limiting reagent.
		const prods = r.products.map((s) => {
			const n = lim.n.mul(q(s.coef)).div(q(lim.s.coef));
			return { s, n, m: n.mul(s.M) };
		});
		const limN = vu(lim.n, MOL);
		steps.push({
			say: 'Calcola le moli di ogni prodotto con i coefficienti.',
			math: prods.map(({ s, n }) => `${nOf(s)} = ${ratioTex(s.coef, lim.s.coef)}${nOf(lim.s)} ${fmt(lim.n).exact ? '=' : '\\approx'} ${ratioTex(s.coef, lim.s.coef)}${limN} ${rel(n)} \\hl{${vu(n, MOL)}}`),
			then: `Usa le moli di $${lim.s.formula.tex}$, il reagente limitante.`,
			part: 'I prodotti'
		});
		steps.push({
			say: 'Moltiplica le moli di ogni prodotto per la sua massa molare.',
			math: prods.map(({ s, n, m }) => `${mOf(s)} ${fmt(n).exact ? '=' : '\\approx'} ${vu(n, MOL)} \\cdot ${massVu(s.M)} ${gRel(m)} \\hl{${gv(m)}}`),
			part: 'I prodotti'
		});

		// What is left of the reagents in excess.
		const left = excess.map((x) => {
			const used = lim.n.mul(q(x.s.coef)).div(q(lim.s.coef));
			const rest = x.n.sub(used);
			return { ...x, used, rest, restG: rest.mul(x.s.M) };
		});
		if (left.length) {
			steps.push({
				say: 'Calcola le moli consumate di ogni reagente in eccesso.',
				math: left.map(({ s, used }) => `${nOf(s)}_{\\text{consumate}} ${fmt(lim.n).exact ? '=' : '\\approx'} ${ratioTex(s.coef, lim.s.coef)}${limN} ${rel(used)} \\hl{${vu(used, MOL)}}`),
				part: 'L’eccesso'
			});
			const lines: string[] = [];
			for (const { s, u, n, grams, used, rest, restG } of left) {
				if (u === 'mol') {
					// Given in moles: subtract the moles, then to grams.
					lines.push(`${nOf(s)}_{\\text{avanza}} ${fmt(used).exact ? '=' : '\\approx'} ${vu(n, MOL)} - ${vu(used, MOL)} ${rel(rest)} ${vu(rest, MOL)}`);
					lines.push(`${mOf(s)}_{\\text{avanza}} ${fmt(rest).exact ? '=' : '\\approx'} ${vu(rest, MOL)} \\cdot ${massVu(s.M)} ${gRel(restG)} \\hl{${gv(restG)}}`);
				} else {
					// Given in grams: the grams consumed, then subtract the grams, so the numbers stay exact.
					const usedG = used.mul(s.M);
					lines.push(`${mOf(s)}_{\\text{consumata}} ${fmt(used).exact ? '=' : '\\approx'} ${vu(used, MOL)} \\cdot ${massVu(s.M)} ${gRel(usedG)} ${gv(usedG)}`);
					lines.push(`${mOf(s)}_{\\text{avanza}} ${gram(usedG).exact ? '=' : '\\approx'} ${vu(grams, G)} - ${gv(usedG)} ${gRel(restG)} \\hl{${gv(restG)}}`);
				}
			}
			steps.push({ say: 'Togli quello che si consuma da quello che c’era.', math: lines, part: 'L’eccesso' });
		}

		const rows: ResultRow[] = [
			{
				label: limiting.length > 1 && excess.length ? 'Reagenti limitanti' : 'Reagente limitante',
				value: excess.length ? limiting.map((x) => `$${x.s.formula.tex}$`).join(' e ') : 'nessuno: i reagenti finiscono insieme'
			}
		];
		for (const { s, n, m } of prods) rows.push({ label: `${s.formula.text} che si forma`, value: `$${gApprox(m)}${gv(m)}$ ($${approxSign(n)}${vu(n, MOL)}$)` });
		for (const { s, rest, restG } of left) rows.push({ label: `${s.formula.text} in eccesso che avanza`, value: `$${gApprox(restG)}${gv(restG)}$ ($${approxSign(rest)}${vu(rest, MOL)}$)` });
		const copy = excess.length ? `Reagente limitante: ${limiting.map((x) => x.s.formula.text).join(' e ')}` : 'Nessun reagente limitante';
		return { ok: true, rows, copy, steps: grouped(steps) };
	});
}
