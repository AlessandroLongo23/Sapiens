/**
 * La relazione di laboratorio. Spec: specs/exercises/fis-relazione-laboratorio.md
 *
 * Five multiple-choice levels from the lesson (docs/lezioni/fisica/riscritte/09-fis-relazione-laboratorio.md): the
 * part of a report a sentence belongs to; the data table written by the rules (quantity and unit in the header, only
 * numbers in the cells, the decimals of the instrument); a result compared with the expected value; which of two
 * measured data to improve (the larger contribution to the relative uncertainty, 3 ε_l for a cube); a systematic error
 * read from a result far from the expected value.
 *
 * Every option is text (`\text{…}`, on several lines in a `gathered` when long) or, at level 2, a two-column table;
 * `values` holds the label the checker reads. Intervals and contributions are exact Rationals.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { Rational, q } from '../rational';
import { BANNED, choose, dec, decimals, t } from '../fis-grandezze';

export const ID = 'fis-relazione-laboratorio';

type R = Rational;

/** k units of 10^-d as a Rational, and its writing with d decimals. */
const Q = (k: number, d: number): R => q(k, 10 ** d);
const nt = (k: number, d: number): string => dec(Q(k, d), d);

const WORD: Record<number, string> = { 3: 'tre', 4: 'quattro', 5: 'cinque', 6: 'sei', 8: 'otto', 10: 'dieci' };
const CELSIUS = '\\,{}^\\circ\\text{C}';
const cel = (x: string) => `$${x}${CELSIUS}$`;

/** A label as an option: one `\text{}` line, or several in a `gathered` when longer than `width` characters. */
export function wrap(label: string, width = 30): string {
	if (label.length <= width) return t(label);
	const words = label.split(' ');
	const out: string[] = [];
	let cur = '';
	for (const w of words) {
		if (cur && cur.length + 1 + w.length > width) {
			out.push(cur);
			cur = w;
		} else cur = cur ? `${cur} ${w}` : w;
	}
	if (cur) out.push(cur);
	return `\\begin{gathered} ${out.map(t).join(' \\\\ ')} \\end{gathered}`;
}
const opt = (label: string, value: string): ChoiceOption => ({ latex: wrap(label), values: [value] });

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Level 1: the parts of the report

export const PARTS = [
	{ key: 'scopo', name: 'Scopo', why: 'La frase dice che cosa vuole misurare o verificare l\'esperimento: è lo scopo.' },
	{ key: 'teoria', name: 'Cenni teorici', why: 'La frase dà una grandezza e la sua formula scritta con le lettere, senza i numeri delle misure: sono i cenni teorici.' },
	{ key: 'strumenti', name: 'Materiali e strumenti', why: 'La frase descrive uno strumento con la sua portata o la sua sensibilità: va nei materiali e strumenti.' },
	{ key: 'procedimento', name: 'Procedimento', why: 'La frase racconta al passato che cosa ha fatto il gruppo: è il procedimento.' },
	{ key: 'dati', name: 'Dati', why: 'La frase riporta le misure come sono state lette, o dice dove sono in tabella: sono i dati.' },
	{ key: 'elaborazione', name: 'Elaborazione dei dati', why: 'La frase fa un conto con i numeri delle misure: è l\'elaborazione dei dati.' },
	{ key: 'conclusioni', name: 'Conclusioni', why: 'La frase confronta il risultato con il valore atteso o dice le cause degli errori e come ridurli: va nelle conclusioni.' },
] as const;
type PartKey = (typeof PARTS)[number]['key'];

/** A measured quantity of the data sentences: symbol, unit, decimals, range in units of the last decimal. */
interface Qty {
	sym: string;
	unit: string;
	d: number;
	lo: number;
	hi: number;
	noun: string; // "masse"
	art: string; // "le"
	fem: boolean;
	inUnit: string; // "in grammi"
}
const QTYS: Qty[] = [
	{ sym: 't', unit: 's', d: 2, lo: 40, hi: 1500, noun: 'tempi', art: 'i', fem: false, inUnit: 'in secondi' },
	{ sym: 'm', unit: 'g', d: 1, lo: 200, hi: 1500, noun: 'masse', art: 'le', fem: true, inUnit: 'in grammi' },
	{ sym: 'l', unit: 'cm', d: 1, lo: 100, hi: 300, noun: 'lunghezze', art: 'le', fem: true, inUnit: 'in centimetri' },
	{ sym: 'T', unit: '°C', d: 1, lo: 150, hi: 600, noun: 'temperature', art: 'le', fem: true, inUnit: 'in gradi Celsius' },
	{ sym: 'V', unit: 'mL', d: 0, lo: 20, hi: 90, noun: 'volumi', art: 'i', fem: false, inUnit: 'in millilitri' },
];
/** "$t = 12{,}53$ s", "$T = 23{,}4\,{}^\circ\text{C}$". */
const qtyValue = (Qy: Qty, sym: string, k: number) => (Qy.unit === '°C' ? `$${sym} = ${nt(k, Qy.d)}${CELSIUS}$` : `$${sym} = ${nt(k, Qy.d)}$ ${Qy.unit}`);
const qtyHeader = (Qy: Qty) => (Qy.unit === '°C' ? `$${Qy.sym}\\ ({}^\\circ\\text{C})$` : `$${Qy.sym}\\ (\\text{${Qy.unit}})$`);

export const METALS = [
	{ name: 'alluminio', of: "dell'alluminio", rho: 270, d: 2 },
	{ name: 'ferro', of: 'del ferro', rho: 787, d: 2 },
	{ name: 'rame', of: 'del rame', rho: 896, d: 2 },
	{ name: 'piombo', of: 'del piombo', rho: 113, d: 1 },
];

/** A density (x ± Δ) with one decimal, Δ from 0,1 to 0,3, compatible or not with the metal by at least 0,1. */
function densityResult(rng: Rng, rho: R, compatible: boolean): [number, number] {
	for (;;) {
		const D = rng.int(1, 3);
		const x = Math.round(Number(rho.num) / rho.den * 10) + rng.int(-8, 8);
		const dist = Q(x, 1).sub(rho).abs();
		const ok = compatible ? dist.compare(Q(D - 1, 1)) <= 0 : dist.compare(Q(D + 1, 1)) >= 0;
		if (ok && x > 0) return [x, D];
	}
}

const SENTENCES: Record<PartKey, ((r: Rng) => string)[]> = {
	scopo: [
		(r) => `Misurare la densità di un ${r.pick(['cilindretto', 'cubetto'])} metallico e riconoscere di che metallo è fatto.`,
		(r) => `Verificare che il periodo del pendolo ${r.pick(['non dipende dalla massa appesa', "non dipende dall'ampiezza delle oscillazioni", 'dipende dalla lunghezza del filo'])}.`,
		(r) => `Misurare il tempo di caduta di una pallina lasciata cadere da un'altezza di $${nt(r.int(8, 25) * 10, 2)}$ m.`,
		(r) => `Verificare che l'allungamento della molla è direttamente proporzionale alla ${r.pick(['massa appesa', 'forza applicata'])}.`,
		(r) => {
			const T1 = r.int(10, 25);
			const T2 = r.int(50, 80);
			return `Misurare la temperatura di equilibrio di due masse d'acqua, una a ${cel(String(T1))} e una a ${cel(String(T2))}, versate nello stesso recipiente.`;
		},
		(r) => `Misurare la velocità media di un carrello su un tratto di $${nt(r.int(10, 40) * 10, 2)}$ m.`,
	],
	teoria: [
		(r) => `La densità è il rapporto tra massa e volume, $\\rho = m / V$${r.pick(['', ', e si misura in $\\text{g/cm}^3$'])}.`,
		(r) => {
			const N = r.pick([5, 10, 20]);
			return `Il periodo si ricava dal tempo di $${N}$ oscillazioni, $T = t / ${N}$.`;
		},
		() => 'La velocità media è il rapporto tra la distanza percorsa e il tempo impiegato, $v = s / t$.',
		() => "L'allungamento della molla è la differenza tra la sua lunghezza con la massa appesa e quella a riposo, $\\Delta l = l - l_0$.",
		() => "Il volume del cilindretto è l'aumento del livello dell'acqua nel cilindro graduato quando lo si immerge, $V = V_2 - V_1$.",
		() => 'Il valore medio di $n$ misure è la loro somma divisa per $n$, $\\bar{x} = \\dfrac{x_1 + x_2 + \\dots + x_n}{n}$.',
		() => 'Il volume di un cubetto di spigolo $l$ è $V = l^3$, quindi la sua densità è $\\rho = m / l^3$.',
	],
	strumenti: [
		(r) => {
			const [P, S] = r.pick([
				[200, '0{,}01'],
				[500, '0{,}1'],
				[1000, '0{,}1'],
				[2000, '1'],
			] as const);
			return `Bilancia elettronica, portata $${P}$ g, sensibilità $${S}$ g.`;
		},
		(r) => `${r.pick(['Cronometro digitale', 'Cronometro del telefono', 'Cronometro da polso'])}, sensibilità $0{,}01$ s.`,
		(r) => {
			const [V, S] = r.pick([
				[25, '0{,}5'],
				[50, '1'],
				[100, '1'],
				[250, '2'],
				[500, '5'],
			] as const);
			return `Cilindro graduato da $${V}$ mL, sensibilità $${S}$ mL.`;
		},
		(r) => (r.next() < 0.5 ? `Righello da $${r.pick([20, 30, 50])}$ cm, sensibilità $0{,}1$ cm.` : `Metro a nastro da $${r.pick([2, 3, 5])}$ m, sensibilità $1$ mm.`),
		(r) => {
			const lo = r.pick([10, 20]);
			const hi = r.pick([110, 150]);
			return `Termometro digitale, portata da $-${lo}$ a ${cel(String(hi))}, sensibilità ${cel('0{,}1')}.`;
		},
	],
	procedimento: [
		(r) => `Abbiamo riempito il cilindro graduato fino a $${r.pick([30, 40, 50, 60, 70])}$ mL e vi abbiamo calato il cilindretto.`,
		(r) => `Abbiamo misurato ${WORD[r.pick([3, 4, 5, 6])]} volte il tempo di $${r.pick([5, 10, 20])}$ oscillazioni.`,
		(r) => `Abbiamo lasciato cadere la pallina da un'altezza di $${nt(r.int(8, 25) * 10, 2)}$ m e fermato il cronometro quando ha toccato il pavimento.`,
		(r) => {
			const a = r.pick([20, 50, 100]);
			return `Abbiamo appeso alla molla masse di $${a}$, $${2 * a}$ e $${3 * a}$ g e ogni volta ne abbiamo misurato la lunghezza con il righello.`;
		},
		(r) => {
			const m1 = r.pick([100, 150, 200, 250]);
			const m2 = r.pick([100, 150, 200, 300]);
			return `Abbiamo versato $${m1}$ g di acqua a ${cel(String(r.int(10, 25)))} e $${m2}$ g di acqua a ${cel(String(r.int(50, 80)))} nello stesso recipiente, abbiamo mescolato e letto il termometro.`;
		},
		(r) => `Abbiamo segnato sul pavimento due traguardi a $${nt(r.int(10, 40) * 10, 2)}$ m l'uno dall'altro e cronometrato il carrello tra i due.`,
		(r) => `Abbiamo pesato il cilindretto ${WORD[r.pick([3, 4, 5])]} volte, togliendolo dal piatto e rimettendolo.`,
	],
	dati: [
		(r) => {
			const Qy = r.pick(QTYS);
			return `Misura $${r.int(1, 6)}$: ${qtyValue(Qy, Qy.sym, r.int(Qy.lo, Qy.hi))}.`;
		},
		(r) => {
			const Qy = r.pick(QTYS);
			const n = r.pick([3, 4, 5, 6, 8, 10]);
			return `Nella tabella $${r.int(1, 4)}$ sono ${Qy.fem ? 'riportate' : 'riportati'} ${Qy.art} ${WORD[n]} ${Qy.noun} ${Qy.fem ? 'misurate' : 'misurati'}, ${Qy.inUnit}.`;
		},
		(r) => {
			const k = r.int(1, 6);
			if (r.next() < 0.5) return `Riga $${k}$ della tabella: $m = ${nt(r.int(200, 1500), 1)}$ g, $V = ${r.int(10, 60)}$ mL.`;
			return `Riga $${k}$ della tabella: $m = ${r.pick([20, 50, 100, 150, 200])}$ g, $l = ${nt(r.int(100, 300), 1)}$ cm.`;
		},
		(r) => {
			const Qy = r.pick(QTYS);
			return `Nella colonna ${qtyHeader(Qy)} della tabella $${r.int(1, 4)}$ ci sono ${Qy.art} ${Qy.noun} delle ${WORD[r.pick([3, 4, 5, 6])]} misure.`;
		},
	],
	elaborazione: [
		(r) => {
			const Qy = r.pick(QTYS.slice(0, 4));
			const n = r.pick([3, 4, 5, 6, 8, 10]);
			const M = r.int(Qy.lo, Qy.hi);
			const u = Qy.unit === '°C' ? CELSIUS : '';
			const tail = Qy.unit === '°C' ? '' : ` ${Qy.unit}`;
			return `$\\bar{${Qy.sym}} = \\dfrac{${nt(M * n, Qy.d)}}{${n}} = ${nt(M, Qy.d)}${u}$${tail}.`;
		},
		(r) => {
			const [what, sym, a, b] = r.pick([
				['della densità', '\\rho', 'della massa', 'del volume'],
				['della velocità', 'v', 'della distanza', 'del tempo'],
			] as const);
			const x = r.int(1, 9);
			const y = r.int(1, 9) * 10;
			return `L'incertezza relativa ${what} è la somma di quelle ${a} e ${b}: $\\varepsilon_{${sym}} = ${nt(x, 3)} + ${nt(y, 3)} = ${nt(x + y, 3)}$.`;
		},
		(r) => {
			if (r.next() < 0.5) {
				const rho = r.int(150, 1200);
				const V = r.int(10, 40);
				return `$\\rho = \\dfrac{${nt(rho * V, 2)}}{${V}} = ${nt(rho, 2)}\\ \\text{g/cm}^3$.`;
			}
			const v = r.int(20, 90);
			const tt = r.int(15, 99);
			return `$v = \\dfrac{${nt(v * tt, 1)}}{${nt(tt, 1)}} = ${v}$ cm/s.`;
		},
		(r) => {
			const [noun, d, lo, hi, unit] = r.pick([
				['dei tempi', 2, 50, 1500, 's'],
				['delle masse', 1, 200, 1500, 'g'],
				['delle lunghezze', 1, 100, 300, 'cm'],
			] as const);
			const b = r.int(lo, hi);
			const h = r.int(1, 20);
			return `La semidispersione ${noun} è $\\dfrac{${nt(b + 2 * h, d)} - ${nt(b, d)}}{2} = ${nt(h, d)}$ ${unit}.`;
		},
		(r) => {
			const l0 = r.int(80, 150);
			const dl = r.int(10, 120);
			return `$\\Delta l = ${nt(l0 + dl, 1)} - ${nt(l0, 1)} = ${nt(dl, 1)}$ cm.`;
		},
	],
	conclusioni: [
		(r) => {
			const M = r.pick(METALS);
			const [x, D] = densityResult(r, Q(M.rho, M.d), true);
			return `La densità misurata, $(${nt(x, 1)} \\pm ${nt(D, 1)})\\ \\text{g/cm}^3$, è compatibile con quella ${M.of}.`;
		},
		(r) => {
			const M = r.pick(METALS);
			const [x, D] = densityResult(r, Q(M.rho, M.d), false);
			return `La densità misurata, $(${nt(x, 1)} \\pm ${nt(D, 1)})\\ \\text{g/cm}^3$, non è compatibile con quella ${M.of}: il cilindretto non è di ${M.name}.`;
		},
		(r) =>
			`Per ridurre l'incertezza servirebbe ${r.pick([
				'un cilindro graduato con una scala più fitta',
				'misurare il tempo di $20$ oscillazioni invece che di $10$',
				'un cronometro comandato da una fotocellula',
				'una bilancia che misuri i centesimi di grammo',
				'un tratto più lungo per il carrello',
			])}.`,
		(r) =>
			r.pick([
				`${r.pick(['Il periodo', 'Il tempo di caduta', 'Il tempo di percorrenza'])} misurato è più grande di quello atteso: può dipendere dal tempo di reazione nel fermare il cronometro, che allunga tutti i tempi.`,
				'La temperatura di equilibrio misurata è più bassa di quella prevista: può dipendere dal calore ceduto al recipiente e all\'aria.',
				'La densità misurata è più grande di quella attesa: può dipendere dal cilindretto pesato ancora bagnato.',
			]),
		(r) => {
			const [big, small] = r.pick([
				['del volume', 'della massa'],
				['del tempo', 'della distanza'],
			] as const);
			const x = r.int(3, 9);
			const y = r.int(1, 5);
			return `L'incertezza relativa ${big}, $${x}\\%$, è molto più grande di quella ${small}, $${nt(y, 1)}\\%$: conviene migliorare la misura ${big}.`;
		},
	],
};

function level1(rng: Rng): Built {
	const p = rng.int(0, PARTS.length - 1);
	const part = PARTS[p];
	const tpl = rng.int(0, SENTENCES[part.key].length - 1);
	const sentence = SENTENCES[part.key][tpl](rng);
	const others = shuffle(
		rng,
		PARTS.filter((x) => x.key !== part.key),
	);
	return {
		prompt: 'Scegli la parte della relazione.',
		problem: textBlock(`“${sentence}” In quale parte della relazione va questa frase?`),
		solution: t(part.name),
		steps: [textBlock(part.why)],
		choice: choose(
			rng,
			opt(part.name, part.key),
			others.map((x) => opt(x.name, x.key)),
		),
		params: { case: part.key, template: tpl, sentence },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the data table

interface Instr {
	what: string; // "il tempo di caduta di una pallina"
	instr: string; // "un cronometro"
	sym: string;
	unit: string; // s, cm, g, °C
	d: number;
	lo: number;
	hi: number;
}
const INSTRS: Instr[] = [
	{ what: 'il tempo di caduta di una pallina', instr: 'un cronometro', sym: 't', unit: 's', d: 2, lo: 40, hi: 90 },
	{ what: 'il periodo di un pendolo', instr: 'un cronometro', sym: 'T', unit: 's', d: 2, lo: 100, hi: 220 },
	{ what: 'il tempo che un carrello impiega a percorrere un tratto', instr: 'un cronometro', sym: 't', unit: 's', d: 2, lo: 200, hi: 600 },
	{ what: 'la lunghezza di una molla con una massa appesa', instr: 'un righello', sym: 'l', unit: 'cm', d: 1, lo: 100, hi: 300 },
	{ what: 'la massa di un cilindretto metallico', instr: 'una bilancia', sym: 'm', unit: 'g', d: 1, lo: 200, hi: 1500 },
	{ what: 'la massa di una pallina', instr: 'una bilancia', sym: 'm', unit: 'g', d: 2, lo: 500, hi: 4000 },
	{ what: "la temperatura di equilibrio di due masse d'acqua", instr: 'un termometro', sym: 'T', unit: '°C', d: 1, lo: 200, hi: 600 },
];

export const DEFECTS = ['senza-unita', 'unita-nelle-caselle', 'zero-mancante', 'cifre-in-piu'] as const;
type Defect = (typeof DEFECTS)[number] | 'giusta';

const unitTex = (u: string) => (u === '°C' ? '{}^\\circ\\text{C}' : `\\text{${u}}`);
const cellUnit = (u: string) => (u === '°C' ? CELSIUS : `\\ \\text{${u}}`);
/** In prose, the unit inside the formula so that a line never breaks between them: "$0{,}62\,\text{s}$". */
const inProse = (x: string, u: string) => (u === '°C' ? cel(x) : `$${x}\\,\\text{${u}}$`);

function table(I: Instr, vals: number[], defect: Defect, zeroAt: number, extraAt: number, extraDigit: number): string {
	const head = defect === 'senza-unita' || defect === 'unita-nelle-caselle' ? I.sym : `${I.sym}\\ (${unitTex(I.unit)})`;
	const rows = vals.map((v, i) => {
		let s = nt(v, I.d);
		if (defect === 'zero-mancante' && i === zeroAt) s = dec(Q(v, I.d));
		if (defect === 'cifre-in-piu' && i === extraAt) s = nt(v * 10 + extraDigit, I.d + 1);
		if (defect === 'unita-nelle-caselle') s += cellUnit(I.unit);
		return `${i + 1} & ${s}`;
	});
	return `\\begin{array}{c|c} \\text{n.} & ${head} \\\\ \\hline ${rows.join(' \\\\ ')} \\end{array}`;
}

function level2(rng: Rng): Built {
	const iIdx = rng.int(0, INSTRS.length - 1);
	const I = INSTRS[iIdx];
	// three different measures close together, exactly one ending in zero (and not in two zeros)
	let vals: number[];
	for (;;) {
		const b = rng.int(I.lo, I.hi);
		vals = [b, b + rng.int(-6, 6), b + rng.int(-6, 6)];
		const zeros = vals.filter((v) => v % 10 === 0).length;
		if (new Set(vals).size === 3 && zeros === 1 && !vals.some((v) => I.d >= 2 && v % 100 === 0)) break;
	}
	const zeroAt = vals.findIndex((v) => v % 10 === 0);
	const extraAt = rng.pick([0, 1, 2].filter((i) => i !== zeroAt));
	const extraDigit = rng.int(1, 9);
	const missing = rng.pick(DEFECTS);
	const bad = DEFECTS.filter((x) => x !== missing);
	const mk = (x: Defect): ChoiceOption => ({ latex: table(I, vals, x, zeroAt, extraAt, extraDigit), values: [x] });
	const S = nt(1, I.d);
	const u = I.unit;
	const why: Record<(typeof DEFECTS)[number], string> = {
		'senza-unita': "nell'intestazione c'è la grandezza ma manca l'unità di misura",
		'unita-nelle-caselle': "l'unità è scritta in ogni casella e non nell'intestazione",
		'zero-mancante': `la misura $${nt(vals[zeroAt], I.d)}$ è scritta senza lo zero finale, come se fosse meno precisa`,
		'cifre-in-piu': `la misura $${nt(vals[extraAt] * 10 + extraDigit, I.d + 1)}$ ha una cifra in più di quelle che lo strumento dà`,
	};
	const list = vals.map((v) => inProse(nt(v, I.d), u));
	return {
		prompt: 'Scegli la tabella scritta bene.',
		problem: textBlock(`Un gruppo ha misurato tre volte ${I.what} con ${I.instr} che ha la sensibilità di ${inProse(S, u)}: ha letto ${list[0]}, ${list[1]} e ${list[2]}. Quale tabella è scritta bene?`),
		solution: mk('giusta').latex,
		steps: [
			textBlock(`La tabella giusta ha la grandezza e l'unità nell'intestazione, solo numeri nelle caselle e ogni misura con i decimali della sensibilità, ${inProse(S, u)}.`),
			...bad.map((x) => textBlock(`Una tabella è sbagliata perché ${why[x]}.`)),
		],
		choice: choose(
			rng,
			mk('giusta'),
			bad.map(mk),
		),
		params: { case: missing, instrument: iIdx, values: vals.map((v) => Q(v, I.d).toString()), decimals: I.d, zeroAt, extraAt, extraDigit },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 5: a result and the expected value

interface Ctx {
	key: string;
	/** "la densità del cilindretto" and the sentence that gives the expected value. */
	measured: string;
	expected: (E: string) => string;
	E: number; // in units of 10^-Ed
	Ed: number;
	unit: string; // g/cm3, m/s2, °C, m/s, s
	/** Uncertainty exponents allowed: Δ = digit · 10^k. */
	ks: number[];
	/** Level 5: a cause that can shift the measures, without the direction. */
	causes: string[];
}

const DENSITY_CAUSES = ['La bilancia non è stata azzerata prima delle pesate.', "Il livello dell'acqua nel cilindro graduato è stato letto con l'occhio non all'altezza della superficie."];
export const CTXS: Ctx[] = [
	...METALS.map((M) => ({
		key: M.name,
		measured: 'la densità del cilindretto',
		expected: (E: string) => `Il cilindretto è di ${M.name}, che ha la densità di $${E}\\ \\text{g/cm}^3$.`,
		E: M.rho,
		Ed: M.d,
		unit: 'g/cm3',
		ks: [-1, -2],
		causes: DENSITY_CAUSES,
	})),
	{
		key: 'acqua',
		measured: "la densità dell'acqua distillata",
		expected: (E) => `La densità dell'acqua è $${E}\\ \\text{g/cm}^3$.`,
		E: 100,
		Ed: 2,
		unit: 'g/cm3',
		ks: [-1, -2],
		causes: DENSITY_CAUSES,
	},
	{
		key: 'gravita',
		measured: "l'accelerazione di gravità con un pendolo",
		expected: (E) => `Il valore atteso è $${E}\\ \\text{m/s}^2$.`,
		E: 98,
		Ed: 1,
		unit: 'm/s2',
		ks: [-1, -2],
		causes: ['Il cronometro è stato fatto partire e fermato a mano.', 'La lunghezza del filo è stata misurata con un metro a nastro vecchio, mai confrontato con un altro.'],
	},
	{
		key: 'ebollizione',
		measured: "la temperatura dell'acqua che bolle, in un laboratorio al livello del mare",
		expected: (E) => `Il valore atteso è ${cel(E)}.`,
		E: 1000,
		Ed: 1,
		unit: '°C',
		ks: [-1, 0],
		causes: ['Il termometro non era mai stato controllato con un altro termometro.', "La colonnina del termometro è stata letta con l'occhio non alla sua altezza."],
	},
	{
		key: 'suono',
		measured: "la velocità del suono nell'aria a $20\\,{}^\\circ\\text{C}$",
		expected: (E) => `Il valore atteso è $${E}\\,\\text{m/s}$.`,
		E: 343,
		Ed: 0,
		unit: 'm/s',
		ks: [0, 1],
		causes: ["Il tempo dell'eco è stato misurato con un cronometro azionato a mano.", 'La distanza dalla parete è stata misurata con un metro a nastro vecchio, mai confrontato con un altro.'],
	},
];
/** Level 5 also has the period of a pendulum given by the theory (T = 2π √(L/g), g = 9,8). */
export const PENDULUMS: [number, number][] = [
	[25, 100],
	[50, 142],
	[75, 174],
	[100, 201],
];
const PENDULUM_CAUSES = ['Il cronometro è stato fatto partire e fermato a mano.', 'La lunghezza del filo è stata misurata con un metro a nastro vecchio, mai confrontato con un altro.'];

function pendulumCtx(L: number, T: number): Ctx {
	return {
		key: `pendolo-${L}`,
		measured: `il periodo di un pendolo lungo $${L}\\,\\text{cm}$`,
		expected: (E) => `La teoria lo dà di $${E}\\,\\text{s}$.`,
		E: T,
		Ed: 2,
		unit: 's',
		ks: [-2, -1],
		causes: PENDULUM_CAUSES,
	};
}

/** A result (x ± Δ) as the lesson writes it. */
function resultTex(x: R, D: R, digits: number, unit: string): string {
	const u = unit === 'g/cm3' ? '\\ \\text{g/cm}^3' : unit === 'm/s2' ? '\\ \\text{m/s}^2' : unit === '°C' ? CELSIUS : `\\,\\text{${unit}}`;
	return `(${dec(x, digits)} \\pm ${dec(D, digits)})${u}`;
}
/** A value with its unit, for the steps. */
function valueTex(x: R, digits: number, unit: string): string {
	const u = unit === 'g/cm3' ? '\\ \\text{g/cm}^3' : unit === 'm/s2' ? '\\ \\text{m/s}^2' : unit === '°C' ? CELSIUS : `\\,\\text{${unit}}`;
	return `${dec(x, digits)}${u}`;
}

interface Measure {
	x: R;
	D: R;
	u: R; // one unit of the last digit
	digits: number;
	E: R;
}

/**
 * A result for the context. `where`: 'dentro' (E inside the interval by at least u, and x ≠ E), 'fuori' (outside by at
 * least u, at most 3Δ from x), 'sopra'/'sotto' (x above or below E by 3Δ to 8Δ). Δ ≤ 20% of x.
 */
function makeMeasure(rng: Rng, C: Ctx, where: 'dentro' | 'fuori' | 'sopra' | 'sotto'): Measure {
	const E = Q(C.E, C.Ed);
	for (;;) {
		const k = rng.pick(C.ks);
		const digits = Math.max(0, -k);
		const u = k >= 0 ? q(10 ** k) : Q(1, -k);
		const D = u.mul(q(rng.int(1, 9)));
		// E in units of u, rounded
		const Eu = Math.round((E.num / E.den) / (u.num / u.den));
		const n = D.div(u).num; // Δ in units
		let off: number;
		if (where === 'dentro') off = rng.int(-(n - 1), n - 1);
		else if (where === 'fuori') off = rng.pick([-1, 1]) * rng.int(n + 1, 3 * n);
		else off = (where === 'sopra' ? 1 : -1) * rng.int(3 * n, 8 * n);
		const x = u.mul(q(Eu + off));
		if (x.sign() <= 0) continue;
		const dist = x.sub(E).abs();
		const ok =
			where === 'dentro'
				? dist.compare(D.sub(u)) <= 0 && !x.equals(E)
				: where === 'fuori'
					? dist.compare(D.add(u)) >= 0
					: dist.compare(D.mul(q(3))) >= 0 && (where === 'sopra' ? x.compare(E) > 0 : x.compare(E) < 0) && dist.div(E).compare(q(1, 4)) <= 0;
		if (!ok || D.div(x).compare(q(1, 5)) > 0) continue;
		return { x, D, u, digits, E };
	}
}

function intervalSteps(M: Measure, C: Ctx): string[] {
	const lo = M.x.sub(M.D);
	const hi = M.x.add(M.D);
	const inside = M.E.compare(lo) >= 0 && M.E.compare(hi) <= 0;
	return [
		`\\text{L'intervallo della misura va da } ${valueTex(lo, M.digits, C.unit)} \\text{ a } ${valueTex(hi, M.digits, C.unit)}\\text{.}`,
		textBlock(`Il valore atteso, $${valueTex(M.E, C.Ed, C.unit)}$, sta ${inside ? 'dentro' : 'fuori da'} questo intervallo.`),
	];
}

export const VERDICTS3 = [
	['compatibile', "Compatibile: il valore atteso sta nell'intervallo della misura"],
	['non-compatibile', "Non compatibile: il valore atteso è fuori dall'intervallo"],
	['diversa-sbagliata', 'Sbagliata: è diversa dal valore atteso'],
	['rifare', 'Da rifare finché non dà il valore atteso'],
] as const;

function level3(rng: Rng): Built {
	const c = rng.int(0, CTXS.length - 1);
	const C = CTXS[c];
	const compatible = rng.next() < 0.5;
	const M = makeMeasure(rng, C, compatible ? 'dentro' : 'fuori');
	const right = compatible ? 0 : 1;
	const res = resultTex(M.x, M.D, M.digits, C.unit);
	return {
		prompt: 'Confronta la misura con il valore atteso.',
		problem: textBlock(`Il gruppo ha misurato ${C.measured}: $${res}$. ${C.expected(dec(M.E, C.Ed))} Che cosa si conclude sulla misura?`),
		solution: wrap(VERDICTS3[right][1]),
		steps: [
			...intervalSteps(M, C),
			textBlock(
				compatible
					? "La misura è compatibile con il valore atteso: che sia un po' diversa non vuol dire che sia sbagliata, e non va rifatta."
					: "La misura non è compatibile con il valore atteso: nelle conclusioni se ne cerca la causa, senza ripetere le misure finché non tornano.",
			),
		],
		choice: choose(
			rng,
			opt(VERDICTS3[right][1], VERDICTS3[right][0]),
			VERDICTS3.filter((_, i) => i !== right).map(([k, l]) => opt(l, k)),
		),
		params: { case: compatible ? 'compatibile' : 'non-compatibile', context: C.key, x: M.x.toString(), D: M.D.toString(), E: M.E.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 4: which measure to improve

interface Datum {
	name: string; // "La massa"
	key: string;
	sym: string;
	unit: string;
	lo: number; // range of the value, in the unit
	hi: number;
	deltas: [number, number][]; // Δ as [units, decimals]: [1, 1] is 0,1
}
interface Formula {
	key: string;
	intro: string;
	formula: string;
	a: Datum;
	b: Datum;
	/** The exponent of b in the formula (3 for the cube's edge). */
	pow: number;
}
const MASS: Datum = { name: 'La massa', key: 'massa', sym: 'm', unit: 'g', lo: 5, hi: 300, deltas: [[1, 1], [2, 1], [5, 1], [1, 0], [1, 2]] };
export const FORMULAS: Formula[] = [
	{ key: 'densita', intro: 'Per misurare la densità di un cilindretto un gruppo', formula: '\\rho = m / V', pow: 1, a: MASS, b: { name: 'Il volume', key: 'volume', sym: 'V', unit: 'mL', lo: 5, hi: 100, deltas: [[1, 0], [2, 0], [5, 1], [2, 1]] } },
	{
		key: 'velocita',
		intro: 'Per misurare la velocità media di un carrello un gruppo',
		formula: 'v = s / t',
		pow: 1,
		a: { name: 'La distanza', key: 'distanza', sym: 's', unit: 'm', lo: 1, hi: 5, deltas: [[1, 2], [2, 2], [5, 3], [1, 3], [5, 2]] },
		b: { name: 'Il tempo', key: 'tempo', sym: 't', unit: 's', lo: 1, hi: 10, deltas: [[1, 2], [2, 2], [5, 2], [1, 1], [2, 1], [3, 1]] },
	},
	{
		key: 'area',
		intro: "Per misurare l'area di un rettangolo di lati $a$ e $b$ un gruppo",
		formula: 'A = a \\cdot b',
		pow: 1,
		a: { name: 'Il lato a', key: 'lato-a', sym: 'a', unit: 'cm', lo: 2, hi: 120, deltas: [[1, 1], [2, 1], [5, 1], [5, 2], [1, 0]] },
		b: { name: 'Il lato b', key: 'lato-b', sym: 'b', unit: 'cm', lo: 2, hi: 120, deltas: [[1, 1], [2, 1], [5, 1], [5, 2], [1, 0]] },
	},
	{
		key: 'cubetto',
		intro: 'Per misurare la densità di un cubetto un gruppo',
		formula: '\\rho = m / l^3',
		pow: 3,
		a: MASS,
		b: { name: 'Lo spigolo', key: 'spigolo', sym: 'l', unit: 'cm', lo: 1, hi: 6, deltas: [[1, 1], [5, 2], [1, 2], [2, 2], [2, 1]] },
	},
];

/** A measured value for the datum: (x ± Δ) with x at the decimal of Δ. */
function drawDatum(rng: Rng, Dt: Datum): { x: R; D: R; d: number } {
	const [du, d] = rng.pick(Dt.deltas);
	const x = Q(rng.int(Dt.lo * 10 ** d, Dt.hi * 10 ** d), d);
	return { x, D: Q(du, d), d };
}
/** The datum with the given Δ whose relative uncertainty is `eps`, if its value is written at the decimal of Δ and in range. */
function datumWithEps(rng: Rng, Dt: Datum, eps: R, not: R): { x: R; D: R; d: number } | null {
	const found = shuffle(rng, Dt.deltas)
		.map(([du, d]) => ({ D: Q(du, d), d }))
		.map(({ D, d }) => ({ x: D.div(eps), D, d }))
		.filter(({ x, d }) => x.mul(q(10 ** d)).isInteger() && !x.equals(not) && x.compare(q(Dt.lo)) >= 0 && x.compare(q(Dt.hi)) <= 0);
	return found[0] ?? null;
}

export const EXTRA4 = [
	['stesso', 'Tutte e due allo stesso modo'],
	['nessuna', "Nessuna: l'incertezza del risultato non dipende dai dati"],
] as const;

const dataTex = (Dt: Datum, v: { x: R; D: R; d: number }) => `$${Dt.sym} = (${dec(v.x, v.d)} \\pm ${dec(v.D, v.d)})\\,\\text{${Dt.unit}}$`;
/** A relative uncertainty as a percentage with two significant digits, for the steps. */
function pct(r: R): string {
	const p = (r.num / r.den) * 100;
	return Number(p.toPrecision(2)).toString().replace('.', '{,}');
}

function level4(rng: Rng): Built {
	const f = rng.int(0, FORMULAS.length - 1);
	const F = FORMULAS[f];
	const u = rng.next();
	const want: 'uguali' | 'primo' | 'secondo' | 'trappola' =
		F.pow === 3 ? (u < 0.5 ? 'trappola' : u < 0.7 ? 'uguali' : u < 0.85 ? 'primo' : 'secondo') : u < 0.2 ? 'uguali' : u < 0.6 ? 'primo' : 'secondo';
	let A: { x: R; D: R; d: number };
	let B: { x: R; D: R; d: number };
	let ca: R;
	let cb: R;
	for (;;) {
		A = drawDatum(rng, F.a);
		const ea = A.D.div(A.x);
		if (want === 'uguali') {
			const got = datumWithEps(rng, F.b, ea.div(q(F.pow)), A.x);
			if (!got) continue;
			B = got;
		} else B = drawDatum(rng, F.b);
		ca = A.D.div(A.x);
		const eb = B.D.div(B.x);
		cb = eb.mul(q(F.pow));
		if (ca.add(cb).compare(q(1, 5)) > 0) continue;
		const r = ca.compare(cb) >= 0 ? ca.div(cb) : cb.div(ca);
		const ok =
			want === 'uguali'
				? ca.equals(cb)
				: want === 'primo'
					? ca.compare(cb) > 0 && r.compare(q(3)) >= 0
					: want === 'secondo'
						? cb.compare(ca) > 0 && r.compare(q(3)) >= 0 && !(F.pow === 3 && eb.compare(ca) < 0)
						: eb.compare(ca) < 0 && r.compare(q(2)) >= 0 && cb.compare(ca) > 0;
		if (ok) break;
	}
	const answer = want === 'uguali' ? 'stesso' : want === 'primo' ? F.a.key : F.b.key;
	const cbName = F.pow === 3 ? `3\\,\\varepsilon_${F.b.sym}` : `\\varepsilon_${F.b.sym}`;
	const steps = [
		textBlock(`Nel risultato si sommano le incertezze relative dei dati${F.pow === 3 ? `; $${F.b.sym}$ è al cubo, quindi la sua incertezza relativa conta tre volte` : ''}.`),
		`\\varepsilon_${F.a.sym} = \\dfrac{${dec(A.D, A.d)}}{${dec(A.x, A.d)}} \\approx ${pct(ca)}\\% \\qquad ${cbName} = ${F.pow === 3 ? '3 \\cdot ' : ''}\\dfrac{${dec(B.D, B.d)}}{${dec(B.x, B.d)}} \\approx ${pct(cb)}\\%`,
		textBlock(
			want === 'uguali'
				? 'I due contributi sono uguali: migliorare una sola misura toglie solo metà del problema, conviene migliorarle tutte e due allo stesso modo.'
				: want === 'trappola'
					? `Da sola $\\varepsilon_${F.b.sym}$ è più piccola di $\\varepsilon_${F.a.sym}$, ma con il $3$ dell'esponente il contributo dello spigolo è il più grande: conviene migliorare lo spigolo.`
					: `Il contributo più grande è quello ${want === 'primo' ? `di $${F.a.sym}$` : `di $${F.b.sym}$`}: conviene migliorare quella misura.`,
		),
	];
	const names: Record<string, string> = { [F.a.key]: F.a.name, [F.b.key]: F.b.name, stesso: EXTRA4[0][1], nessuna: EXTRA4[1][1] };
	const optOf = (k: string) => ({ latex: optLatex(names[k]), values: [k] });
	return {
		prompt: 'Scegli la misura da migliorare.',
		problem: textBlock(`${F.intro} usa $${F.formula}$ e trova ${dataTex(F.a, A)} e ${dataTex(F.b, B)}. Quale misura conviene migliorare per ridurre l'incertezza del risultato?`),
		solution: optLatex(names[answer]),
		steps,
		choice: choose(
			rng,
			optOf(answer),
			[F.a.key, F.b.key, 'stesso', 'nessuna'].filter((k) => k !== answer).map(optOf),
		),
		params: { case: want, formula: F.key, a: [A.x.toString(), A.D.toString()], b: [B.x.toString(), B.D.toString()], ca: ca.toString(), cb: cb.toString() },
	};
}
/** "Il lato a" with the letter as a formula. */
const optLatex = (label: string) => {
	const m = /^Il lato ([ab])$/.exec(label);
	return m ? `\\text{Il lato } ${m[1]}` : wrap(label);
};

// ---------------------------------------------------------------------------
// Level 5: a systematic error

export const VERDICTS5 = [
	['compatibile', 'Compatibile: nessun segno di errore sistematico'],
	['eccesso', 'Non compatibile: probabile errore sistematico che aumenta le misure'],
	['difetto', 'Non compatibile: probabile errore sistematico che diminuisce le misure'],
	['casuali', 'Non compatibile: colpa degli errori casuali, basta ripetere le misure'],
] as const;

function level5(rng: Rng): Built {
	const all = [...CTXS, ...PENDULUMS.map(([L, T]) => pendulumCtx(L, T))];
	const c = rng.int(0, all.length - 1);
	const C = all[c];
	const kind = rng.pick(['compatibile', 'eccesso', 'difetto'] as const);
	const M = makeMeasure(rng, C, kind === 'compatibile' ? 'dentro' : kind === 'eccesso' ? 'sopra' : 'sotto');
	const right = VERDICTS5.findIndex(([k]) => k === kind);
	const cause = rng.pick(C.causes);
	const n = rng.pick([5, 6, 8, 10]);
	const res = resultTex(M.x, M.D, M.digits, C.unit);
	return {
		prompt: 'Cerca la conclusione giusta.',
		problem: textBlock(`Il gruppo ha misurato ${WORD[n]} volte ${C.measured} e ha scritto il risultato $${res}$. ${C.expected(dec(M.E, C.Ed))} ${cause} Quale conclusione segue dai dati?`),
		solution: wrap(VERDICTS5[right][1]),
		steps: [
			...intervalSteps(M, C),
			textBlock(
				kind === 'compatibile'
					? 'La misura è compatibile: i dati non mostrano un errore sistematico.'
					: `Il risultato è ${kind === 'eccesso' ? 'più grande' : 'più piccolo'} del valore atteso di più di tre volte l'incertezza: le misure sono spostate tutte ${kind === 'eccesso' ? "verso l'alto" : 'verso il basso'}, il segno di un errore sistematico. Gli errori casuali allargano l'intervallo ma non lo spostano, e ripetere le misure non basta.`,
			),
		],
		choice: choose(
			rng,
			opt(VERDICTS5[right][1], kind),
			VERDICTS5.filter((_, i) => i !== right).map(([k, l]) => opt(l, k)),
		),
		params: { case: kind, context: C.key, x: M.x.toString(), D: M.D.toString(), E: M.E.toString() },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		const b = make(rng);
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: b.prompt,
			problem: b.problem,
			solution: b.solution,
			steps: b.steps,
			answer: b.choice,
			params: b.params,
		};
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

const R_ = (s: unknown) => Rational.parse(String(s));
/** 10^k for an integer k. */
const isPow10 = (r: R) => (r.den === 1 && /^10*$/.test(String(r.num))) || (r.num === 1 && /^10*$/.test(String(r.den)));

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	if (sample.answer.kind !== 'choice') return ['la risposta deve essere una scelta'];
	const ch = sample.answer;
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni scritte uguali');
	if (!(ch.correct >= 0 && ch.correct < ch.options.length)) return [...v, 'opzione giusta fuori dai limiti'];
	const right = ch.options[ch.correct].values[0];
	const p = sample.params;
	if (sample.level === 1 && right !== p.case) v.push('la parte giusta non è quella della frase');
	if (sample.level === 2) {
		if (right !== 'giusta') v.push('la tabella giusta non è segnata');
		if (ch.options.some((o) => o.values[0] === p.case)) v.push('il difetto escluso compare');
		const vals = (p.values as string[]).map(R_);
		const d = p.decimals as number;
		if (!vals.some((x) => x.mul(q(10 ** (d - 1))).isInteger())) v.push('nessuna misura con lo zero finale');
	}
	if (sample.level === 3 || sample.level === 5) {
		const x = R_(p.x);
		const D = R_(p.D);
		const E = R_(p.E);
		const dist = x.sub(E).abs();
		// Δ = digit · u with u a power of ten: its decimal digits, without the comma, are one digit and zeros
		const dd = decimals(D);
		const s = Number.isFinite(dd) ? String(D.mul(q(10 ** dd)).num) : '';
		const u = s ? D.div(q(Number(s[0]))) : q(1);
		if (!/^[1-9]0*$/.test(s) || !isPow10(u)) v.push('incertezza non di una cifra');
		if (D.div(x).compare(q(1, 5)) > 0) v.push('incertezza oltre il 20%');
		const inside = dist.compare(D.sub(u)) <= 0;
		const outside = dist.compare(D.add(u)) >= 0;
		if (!inside && !outside) v.push('valore atteso sul bordo');
		if (sample.level === 3) {
			if (right !== (inside ? 'compatibile' : 'non-compatibile')) v.push('conclusione sbagliata');
			if (inside && x.equals(E)) v.push('misura uguale al valore atteso');
		} else {
			const far = dist.compare(D.mul(q(3))) >= 0;
			const want = inside ? 'compatibile' : far ? (x.compare(E) > 0 ? 'eccesso' : 'difetto') : null;
			if (want === null) v.push('non compatibile ma non oltre tre volte');
			if (right !== want) v.push('conclusione sbagliata');
		}
	}
	if (sample.level === 4) {
		const ca = R_(p.ca);
		const cb = R_(p.cb);
		const r = ca.compare(cb) >= 0 ? ca.div(cb) : cb.div(ca);
		if (!ca.equals(cb) && r.compare(q(p.case === 'trappola' ? 2 : 3)) < 0) v.push('contributi quasi uguali');
		if (ca.add(cb).compare(q(1, 5)) > 0) v.push('incertezza oltre il 20%');
		const F = FORMULAS.find((x) => x.key === p.formula)!;
		const want = ca.equals(cb) ? 'stesso' : ca.compare(cb) > 0 ? F.a.key : F.b.key;
		if (right !== want) v.push('misura da migliorare sbagliata');
	}
	return v;
}

export const fisRelazioneLaboratorio: Generator = {
	id: ID,
	title: 'La relazione di laboratorio',
	levels: {
		1: { label: 'Le parti della relazione', constraints: ['una frase di una relazione e la sua parte, tra sette, circa un settimo ciascuna'] },
		2: { label: 'La tabella dei dati', constraints: ['tre misure, una con lo zero finale; la tabella giusta e tre con un difetto ciascuna'] },
		3: { label: 'Confronto con il valore atteso', constraints: ["compatibile o no, metà ciascuna; il valore atteso dentro o fuori dall'intervallo di almeno un'unità sull'ultima cifra"] },
		4: { label: 'Quale misura migliorare', constraints: ['contributi in rapporto almeno 3 o uguali; nel cubetto la trappola del 3 (rapporto almeno 2)'] },
		5: { label: "Cercare l'errore sistematico", constraints: ["compatibile, spostato in su o in giù di almeno tre volte l'incertezza, un terzo ciascuno"] },
	},
	generate,
	check,
};

export default fisRelazioneLaboratorio;
