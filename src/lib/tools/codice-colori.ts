import { fail, type Outcome, type Step } from './types';
import { Q, fmt, parseNumber, q, safely, type Unit } from './grandezze';
import { KOHM, MOHM, OHM, RES_UNITS } from './resistenze';

/**
 * The colour code of resistors (IEC 60062), with 4 or 5 bands: two or three digits, a multiplier, a tolerance. From
 * the colours to the value with its tolerance, and from a value to the colours. Every colour is named in words
 * wherever it is shown, never by its colour alone.
 *
 * The tolerances are those of the tables in the Italian school books: brown 1 %, red 2 %, green 0,5 %, blue 0,25 %,
 * violet 0,1 %, grey 0,05 %, gold 5 %, silver 10 %.
 */

export interface BandColor {
	id: string;
	/** The name, lower case: "arancione". */
	name: string;
	/** The colour of the swatch. */
	hex: string;
	/** As a digit, when it can be one. */
	digit?: number;
	/** As a multiplier, the power of ten. */
	exp?: number;
	/** As a tolerance, in percent, as written: "0,5". */
	tol?: string;
}

export const COLORS: BandColor[] = [
	{ id: 'nero', name: 'nero', hex: '#1a1a1a', digit: 0, exp: 0 },
	{
		id: 'marrone',
		name: 'marrone',
		hex: '#7b4a26',
		digit: 1,
		exp: 1,
		tol: '1'
	},
	{ id: 'rosso', name: 'rosso', hex: '#d32f2f', digit: 2, exp: 2, tol: '2' },
	{ id: 'arancione', name: 'arancione', hex: '#f57c00', digit: 3, exp: 3 },
	{ id: 'giallo', name: 'giallo', hex: '#fbc02d', digit: 4, exp: 4 },
	{ id: 'verde', name: 'verde', hex: '#2e7d32', digit: 5, exp: 5, tol: '0,5' },
	{ id: 'blu', name: 'blu', hex: '#1565c0', digit: 6, exp: 6, tol: '0,25' },
	{ id: 'viola', name: 'viola', hex: '#7b1fa2', digit: 7, exp: 7, tol: '0,1' },
	{
		id: 'grigio',
		name: 'grigio',
		hex: '#8a8a8a',
		digit: 8,
		exp: 8,
		tol: '0,05'
	},
	{ id: 'bianco', name: 'bianco', hex: '#f5f5f5', digit: 9, exp: 9 },
	{ id: 'oro', name: 'oro', hex: '#c9a227', exp: -1, tol: '5' },
	{ id: 'argento', name: 'argento', hex: '#b8bcc2', exp: -2, tol: '10' }
];

export const colorById = (id: string) => COLORS.find((c) => c.id === id);

export type BandRole = 'digit' | 'mult' | 'tol';

/** What each band means, left to right: 4 bands are two digits, 5 bands three. */
export function bandRoles(n: 4 | 5): BandRole[] {
	return n === 4 ? ['digit', 'digit', 'mult', 'tol'] : ['digit', 'digit', 'digit', 'mult', 'tol'];
}

/** The colours a band can have. */
export function colorsFor(role: BandRole, first = false): BandColor[] {
	if (role === 'digit') return COLORS.filter((c) => c.digit !== undefined && !(first && c.digit === 0));
	if (role === 'mult') return COLORS.filter((c) => c.exp !== undefined);
	return COLORS.filter((c) => c.tol !== undefined);
}

const ORD = ['1ª', '2ª', '3ª', '4ª', '5ª'];
const DIGIT_NAMES = ['prima cifra', 'seconda cifra', 'terza cifra'];
/** "1ª banda: prima cifra". */
export function bandLabel(n: 4 | 5, i: number): string {
	const role = bandRoles(n)[i];
	const what = role === 'digit' ? DIGIT_NAMES[i] : role === 'mult' ? 'moltiplicatore' : 'tolleranza';
	return `${ORD[i]} banda: ${what}`;
}

export const DEFAULT_BANDS: Record<4 | 5, string[]> = {
	4: ['giallo', 'viola', 'rosso', 'oro'],
	5: ['marrone', 'nero', 'nero', 'marrone', 'marrone']
};

export const TOLERANCES = COLORS.filter((c) => c.tol).map((c) => c.tol!);

const groupInt = (s: string) => (s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\\,') : s);
/** A resistance in ohm, whole numbers in full. */
const ohmNum = (x: Q) => (x.d === 1n ? groupInt(x.n.toString()) : fmt(x).tex);
const ohmNumText = (x: Q) => (x.d === 1n ? groupInt(x.n.toString()).replace(/\\,/g, ' ') : fmt(x).text);

/** The unit a value reads best in. */
function nice(ohm: Q): Unit {
	if (ohm.cmp(q(1_000_000)) >= 0) return MOHM;
	if (ohm.cmp(q(1000)) >= 0) return KOHM;
	return OHM;
}
const inNice = (ohm: Q) => {
	const u = nice(ohm);
	const x = ohm.div(u.factor);
	return {
		tex: `${ohmNum(x)}\\ ${u.tex}`,
		text: `${ohmNumText(x)} ${u.label}`
	};
};
const powTex = (e: number) => (e === 1 ? '10' : `10^{${e}}`);
const tolQ = (tol: string) => parseNumber(tol)!;
const pct = (tol: string) => `${tol.replace(',', '{,}')}\\%`;

export const nBands = (s: string | undefined): 4 | 5 => (s === '5' ? 5 : 4);

// ---------------------------------------------------------------------------------------------------------------
// From the colours to the value.

export function coloriValore(n: 4 | 5, bands: string[]): Outcome {
	return safely(() => {
		const roles = bandRoles(n);
		if (bands.length !== roles.length) return fail(`Scegli il colore di tutte le ${n} bande.`);
		const cs = bands.map(colorById);
		for (let i = 0; i < roles.length; i++) {
			const c = cs[i];
			if (!c) return fail(`Scegli il colore della ${ORD[i]} banda.`);
			if (roles[i] === 'digit' && c.digit === undefined) return fail(`La ${ORD[i]} banda è una cifra: oro e argento non vanno bene. Scegli un altro colore.`);
			if (roles[i] === 'mult' && c.exp === undefined) return fail(`La ${ORD[i]} banda è il moltiplicatore: scegli un altro colore.`);
			if (roles[i] === 'tol' && c.tol === undefined) return fail(`L’ultima banda è la tolleranza: di solito è oro o argento. Scegli un altro colore.`);
		}
		if (cs[0]!.digit === 0) return fail('La prima banda non è mai nera: forse stai leggendo la resistenza al contrario. Gira la resistenza e metti a destra la banda oro o argento.');
		const digitsCs = cs.slice(0, n - 2) as BandColor[];
		const mult = cs[n - 2]!;
		const tol = cs[n - 1]!;
		const digits = digitsCs.map((c) => c.digit!).join('');
		const value = q(Number(digits)).mul(Q.pow10(mult.exp!));
		const tolFrac = tolQ(tol.tol!).div(q(100));
		const delta = value.mul(tolFrac);
		const min = value.sub(delta);
		const max = value.add(delta);
		const shown = inNice(value);
		const unitOhm = nice(value) !== OHM;

		const table: Step['table'] = {
			head: ['Banda', 'Colore', 'Significato', 'Valore'],
			rows: cs.map((c, i) => {
				const role = roles[i];
				const meaning = role === 'digit' ? DIGIT_NAMES[i] : role === 'mult' ? 'moltiplicatore' : 'tolleranza';
				const v =
					role === 'digit' ? `$${c!.digit}$` : role === 'mult' ? `$\\cdot ${mult.exp! < 0 ? fmt(Q.pow10(mult.exp!)).tex : powTex(mult.exp!).replace('10^{0}', '1')}$` : `$\\pm ${pct(c!.tol!)}$`;
				return [ORD[i], c!.name, meaning, v];
			})
		};
		const multTex = mult.exp === 0 ? '1' : mult.exp! < 0 ? fmt(Q.pow10(mult.exp!)).tex : powTex(mult.exp!);
		// R = 47 · 10² Ω, = 4700 Ω, = 4,7 kΩ: the last line highlighted.
		const tail = [...(mult.exp !== 0 ? [`${ohmNum(value)}\\ \\Omega`] : []), ...(unitOhm ? [shown.tex] : [])];
		const valueLines = tail.length
			? [`R = ${digits} \\cdot ${multTex}\\ \\Omega`, ...tail.map((t, i) => `= ${i === tail.length - 1 ? `\\hl{${t}}` : t}`)]
			: [`R = ${digits} \\cdot 1\\ \\Omega = \\hl{${ohmNum(value)}\\ \\Omega}`];
		const steps: Step[] = [
			{
				say: 'Leggi le bande da sinistra, con la tolleranza a destra.',
				table,
				then: 'La banda della tolleranza è un po’ staccata dalle altre.'
			},
			{
				say: `Scrivi le cifre e moltiplicale per $${multTex}$.`,
				math: valueLines
			},
			{
				say: 'Trasforma la tolleranza in ohm: è una percentuale del valore.',
				math: [`${ohmNum(value)}\\ \\Omega \\cdot \\dfrac{${tol.tol!.replace(',', '{,}')}}{100} = ${ohmNum(delta)}\\ \\Omega`]
			},
			{
				say: 'Togli e aggiungi la tolleranza al valore.',
				math: [
					`R_{min} = ${ohmNum(value)}\\ \\Omega - ${ohmNum(delta)}\\ \\Omega = ${ohmNum(min)}\\ \\Omega`,
					`R_{max} = ${ohmNum(value)}\\ \\Omega + ${ohmNum(delta)}\\ \\Omega = ${ohmNum(max)}\\ \\Omega`
				],
				then: 'Il valore vero della resistenza è compreso tra questi due.'
			}
		];
		return {
			ok: true,
			rows: [
				{ label: 'Resistenza', value: `$${shown.tex} \\pm ${pct(tol.tol!)}$` },
				{ label: 'Valore minimo', value: `$${inNice(min).tex}$` },
				{ label: 'Valore massimo', value: `$${inNice(max).tex}$` }
			],
			copy: `${shown.text} ±${tol.tol}%`,
			steps
		};
	});
}

// ---------------------------------------------------------------------------------------------------------------
// From the value to the colours.

/** floor(log10(x)) for a positive rational. */
function exponent(x: Q): number {
	const e = x.n.toString().length - x.d.toString().length;
	return x.cmp(Q.pow10(e)) >= 0 ? e : e - 1;
}

export interface ValueBands {
	ohm: Q;
	digits: string;
	exp: number;
	colors: BandColor[];
}

/** The bands of a value, or an error sentence. */
export function valueBands(n: 4 | 5, value: string, unitId: string, tol: string): ValueBands | string {
	const raw = parseNumber(value);
	const nd = n - 2;
	if (!raw) return 'Scrivi il valore della resistenza, per esempio 4,7 con kΩ.';
	if (raw.sign() <= 0) return 'La resistenza deve essere maggiore di zero: scrivi per esempio 4,7 con kΩ.';
	const u = RES_UNITS.find((x) => x.id === unitId) ?? OHM;
	const ohm = raw.mul(u.factor);
	const e = exponent(ohm);
	const k = e - (nd - 1);
	const m = ohm.div(Q.pow10(k));
	if (m.d !== 1n) {
		const ex = n === 4 ? '4,7 kΩ o 220 Ω' : '4,75 kΩ o 221 Ω';
		return `Con ${n} bande il valore ha al massimo ${nd === 2 ? 'due' : 'tre'} cifre significative, come ${ex}.${n === 4 ? ' Prova con 5 bande.' : ''}`;
	}
	if (k < -2) return 'Il valore è troppo piccolo per il codice colori: il moltiplicatore più piccolo è argento, 0,01.';
	if (k > 9) return 'Il valore è troppo grande per il codice colori: il moltiplicatore più grande è bianco, un miliardo.';
	const digits = m.n.toString();
	const t = COLORS.find((c) => c.tol === tol);
	if (!t) return 'Scegli la tolleranza.';
	const colors = [...digits].map((d) => COLORS.find((c) => c.digit === Number(d))!);
	colors.push(
		COLORS.find((c) => c.exp === k)!,
		t
	);
	return { ohm, digits, exp: k, colors };
}

export function valoreColori(n: 4 | 5, value: string, unitId: string, tol: string): Outcome {
	return safely(() => {
		const vb = valueBands(n, value, unitId, tol);
		if (typeof vb === 'string') return fail(vb);
		const u = RES_UNITS.find((x) => x.id === unitId) ?? OHM;
		const raw = parseNumber(value)!;
		const { ohm, digits, exp, colors } = vb;
		const steps: Step[] = [];
		if (u !== OHM)
			steps.push({
				say: 'Scrivi il valore in ohm.',
				math: [`${fmt(raw).tex}\\ ${u.tex} = ${ohmNum(ohm)}\\ \\Omega`]
			});
		const multTex = exp === 0 ? '1' : exp < 0 ? fmt(Q.pow10(exp)).tex : powTex(exp);
		steps.push({
			say: `Scrivi il valore come ${n - 2 === 2 ? 'due' : 'tre'} cifre per una potenza di 10.`,
			math: [`${ohmNum(ohm)}\\ \\Omega = \\hl{${digits}} \\cdot \\hl{${multTex}}\\ \\Omega`],
			then:
				exp > 0
					? `L’esponente $${exp}$ è il numero di zeri dopo le cifre.`
					: exp === 0
						? 'Il moltiplicatore è 1: nessuno zero dopo le cifre.'
						: 'Il valore ha la virgola: il moltiplicatore è oro (0,1) o argento (0,01).'
		});
		const roles = bandRoles(n);
		steps.push({
			say: 'Trova il colore di ogni banda nella tabella del codice.',
			table: {
				head: ['Banda', 'Significato', 'Valore', 'Colore'],
				rows: colors.map((c, i) => {
					const role = roles[i];
					const meaning = role === 'digit' ? DIGIT_NAMES[i] : role === 'mult' ? 'moltiplicatore' : 'tolleranza';
					const v = role === 'digit' ? `$${c.digit}$` : role === 'mult' ? `$\\cdot ${multTex}$` : `$\\pm ${pct(c.tol!)}$`;
					return [ORD[i], meaning, v, c.name];
				})
			},
			then: 'La banda della tolleranza va a destra, un po’ staccata dalle altre.'
		});
		const names = colors.map((c) => c.name).join(', ');
		return {
			ok: true,
			rows: [
				{ label: 'Colori delle bande, da sinistra', value: names },
				{ label: 'Resistenza', value: `$${inNice(ohm).tex} \\pm ${pct(tol)}$` }
			],
			copy: names,
			steps
		};
	});
}
