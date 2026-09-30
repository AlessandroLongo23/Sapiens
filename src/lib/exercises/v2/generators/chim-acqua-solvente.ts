/**
 * L'acqua come solvente. Spec: specs/exercises/chim-acqua-solvente.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/46-chim-acqua-solvente.md), each one step harder: how a
 * substance behaves in water (ions, whole molecules, not at all); the ions a salt gives in water; the moles of ions
 * from the moles of a salt; the mass that dissolves in a given mass of water, or what stays on the bottom; the mass
 * that crystallises when a saturated solution cools; the hardness of a water in French degrees, with its class.
 * Solubilities from the lesson's table (g per 100 g of water); 1 °f = 10 mg of calcium carbonate per litre; soft
 * below 15 °f, medium from 15 to 30, hard above 30. Distractors from the lesson's warnings: atoms instead of ions, the
 * index read as a molecule (Cl₂), coefficients or charges forgotten, the solubility not scaled to the water, the
 * solution's mass for the water's, the milligrams not taken per litre.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, ambiguous, checkCommon, choose, generateWith, pq, rOpt, rq, say, shuffle, sig, sigOpts, t, texOpt, textBlock, textOpt } from '../chim-acqua';

export const ID = 'chim-acqua-solvente';

// ---------------------------------------------------------------------------
// Level 1: in water

export const BEHAVIOUR = {
	ioni: 'si scioglie e si separa in ioni idratati',
	molecole: 'si scioglie e le molecole restano intere',
	no: 'non si scioglie',
	atomi: 'si scioglie e si separa in atomi',
} as const;
export type Behaviour = keyof typeof BEHAVIOUR;

export const SUBSTANCES: { nome: string; f?: string; b: Exclude<Behaviour, 'atomi'>; why: string }[] = [
	{ nome: 'il cloruro di sodio', f: 'NaCl', b: 'ioni', why: 'È un composto ionico solubile: le molecole d\'acqua staccano gli ioni e li circondano.' },
	{ nome: 'il cloruro di potassio', f: 'KCl', b: 'ioni', why: 'È un composto ionico solubile: le molecole d\'acqua staccano gli ioni e li circondano.' },
	{ nome: 'il nitrato di potassio', f: 'KNO_3', b: 'ioni', why: 'È un composto ionico solubile: in acqua dà ioni potassio e ioni nitrato idratati.' },
	{ nome: 'il cloruro di calcio', f: 'CaCl_2', b: 'ioni', why: 'È un composto ionico solubile: in acqua dà ioni calcio e ioni cloruro idratati.' },
	{ nome: 'il solfato di magnesio', f: 'MgSO_4', b: 'ioni', why: 'È un composto ionico solubile: in acqua dà ioni magnesio e ioni solfato idratati.' },
	{ nome: 'il saccarosio (lo zucchero)', f: 'C_{12}H_{22}O_{11}', b: 'molecole', why: 'È fatto di molecole polari con gruppi O-H, che formano legami a idrogeno con l\'acqua e passano in soluzione intere.' },
	{ nome: 'il glucosio', f: 'C_6H_{12}O_6', b: 'molecole', why: 'È fatto di molecole polari con gruppi O-H, che formano legami a idrogeno con l\'acqua e passano in soluzione intere.' },
	{ nome: "l'etanolo", f: 'C_2H_5OH', b: 'molecole', why: "È fatto di molecole polari con un gruppo O-H: si mescola con l'acqua, e le molecole restano intere." },
	{ nome: 'il carbonato di calcio (il calcare)', f: 'CaCO_3', b: 'no', why: "È un composto ionico, ma i suoi ioni si attraggono tanto che l'acqua non riesce a separarli." },
	{ nome: "il cloruro d'argento", f: 'AgCl', b: 'no', why: "È un composto ionico che l'acqua non riesce a sciogliere: ionico non vuol dire solubile." },
	{ nome: "l'olio d'oliva", b: 'no', why: "È fatto di molecole apolari: l'acqua non le attira, e restano in uno strato a parte." },
	{ nome: 'la benzina', b: 'no', why: "È fatta di molecole apolari: l'acqua non le attira, e restano in uno strato a parte." },
	{ nome: 'la cera di una candela', b: 'no', why: "È fatta di molecole apolari: l'acqua non le attira, e la cera non si scioglie." },
];

function level1(rng: Rng): Built {
	const want = rng.pick(['ioni', 'molecole', 'no'] as const);
	const pool = SUBSTANCES.filter((s) => s.b === want);
	const k = rng.int(0, pool.length - 1);
	const s = pool[k];
	const name = s.f ? `${s.nome}, $\\mathrm{${s.f}}$,` : s.nome;
	const keys = Object.keys(BEHAVIOUR) as Behaviour[];
	return {
		prompt: "Scegli che cosa succede nell'acqua.",
		problem: textBlock(`Che cosa succede se si mette ${name} in acqua e si mescola?`),
		solution: t(BEHAVIOUR[s.b]),
		steps: [say(s.why)],
		answer: choose(rng, textOpt(BEHAVIOUR[s.b], s.b), shuffle(rng, keys.filter((x) => x !== s.b)).map((x) => textOpt(BEHAVIOUR[x], x))),
		params: { case: want, sostanza: s.nome },
	};
}

// ---------------------------------------------------------------------------
// Salts: cation, anion, how many of each

export type Salt = { nome: string; f: string; cat: string; a: number; x: number; an: string; b: number; y: number };
export const SALTS: Salt[] = [
	{ nome: 'cloruro di calcio', f: 'CaCl_2', cat: 'Ca', a: 2, x: 1, an: 'Cl', b: 1, y: 2 },
	{ nome: 'cloruro di magnesio', f: 'MgCl_2', cat: 'Mg', a: 2, x: 1, an: 'Cl', b: 1, y: 2 },
	{ nome: 'cloruro di alluminio', f: 'AlCl_3', cat: 'Al', a: 3, x: 1, an: 'Cl', b: 1, y: 3 },
	{ nome: 'solfato di sodio', f: 'Na_2SO_4', cat: 'Na', a: 1, x: 2, an: 'SO_4', b: 2, y: 1 },
	{ nome: 'solfato di potassio', f: 'K_2SO_4', cat: 'K', a: 1, x: 2, an: 'SO_4', b: 2, y: 1 },
	{ nome: 'solfato di magnesio', f: 'MgSO_4', cat: 'Mg', a: 2, x: 1, an: 'SO_4', b: 2, y: 1 },
	{ nome: 'nitrato di calcio', f: 'Ca(NO_3)_2', cat: 'Ca', a: 2, x: 1, an: 'NO_3', b: 1, y: 2 },
	{ nome: 'nitrato di magnesio', f: 'Mg(NO_3)_2', cat: 'Mg', a: 2, x: 1, an: 'NO_3', b: 1, y: 2 },
	{ nome: 'carbonato di sodio', f: 'Na_2CO_3', cat: 'Na', a: 1, x: 2, an: 'CO_3', b: 2, y: 1 },
	{ nome: 'carbonato di potassio', f: 'K_2CO_3', cat: 'K', a: 1, x: 2, an: 'CO_3', b: 2, y: 1 },
	{ nome: 'solfato di alluminio', f: 'Al_2(SO_4)_3', cat: 'Al', a: 3, x: 2, an: 'SO_4', b: 2, y: 3 },
	{ nome: 'fosfato di sodio', f: 'Na_3PO_4', cat: 'Na', a: 1, x: 3, an: 'PO_4', b: 3, y: 1 },
	{ nome: 'fosfato di potassio', f: 'K_3PO_4', cat: 'K', a: 1, x: 3, an: 'PO_4', b: 3, y: 1 },
	{ nome: 'nitrato di potassio', f: 'KNO_3', cat: 'K', a: 1, x: 1, an: 'NO_3', b: 1, y: 1 },
];

const charge = (n: number, sign: '+' | '-') => (n === 1 ? sign : `${n}${sign}`);
/** An ion: \mathrm{Ca^{2+}}; `sub` writes an index first (the mistake Cl₂²⁻). */
const ion = (sym: string, n: number, sign: '+' | '-' | '', sub = 1) => {
	const poly = sym.includes('_');
	const body = sub > 1 ? (poly ? `(${sym})_${sub}` : `${sym}_${sub}`) : sym;
	return sign ? `\\mathrm{${body}^{${charge(n, sign)}}}` : `\\mathrm{${body}}`;
};
const coef = (k: number) => (k > 1 ? `${k}\\,` : '');
const side = (x: number, c: string, y: number, an: string) => `${coef(x)}${c}(aq) + ${coef(y)}${an}(aq)`;

/** The right ions and the mistakes, as the right side of the equation. */
export function ionsOf(s: Salt) {
	const right = side(s.x, ion(s.cat, s.a, '+'), s.y, ion(s.an, s.b, '-'));
	const wrong: { tex: string; key: string }[] = [];
	if (s.x > 1 || s.y > 1)
		wrong.push({ tex: `${ion(s.cat, s.a * s.x, '+', s.x)}(aq) + ${ion(s.an, s.b * s.y, '-', s.y)}(aq)`, key: 'indice' }, { tex: side(1, ion(s.cat, s.a, '+'), 1, ion(s.an, s.b, '-')), key: 'coefficienti' });
	if (s.a > 1 || s.b > 1) wrong.push({ tex: side(s.x, ion(s.cat, 1, '+'), s.y, ion(s.an, 1, '-')), key: 'cariche' });
	if (s.x !== s.y) wrong.push({ tex: side(s.y, ion(s.cat, s.a, '+'), s.x, ion(s.an, s.b, '-')), key: 'scambiati' });
	wrong.push({ tex: side(s.x, ion(s.cat, s.a, '-'), s.y, ion(s.an, s.b, '+')), key: 'segni' });
	wrong.push({ tex: side(s.x, ion(s.cat, 0, ''), s.y, ion(s.an, 0, '')), key: 'atomi' });
	return { right, wrong };
}

// ---------------------------------------------------------------------------
// Level 2: the ions of a salt

function level2(rng: Rng): Built {
	const s = rng.pick(SALTS);
	const { right, wrong } = ionsOf(s);
	return {
		prompt: 'Scegli gli ioni che si formano.',
		problem: textBlock(`Il ${s.nome}, $\\mathrm{${s.f}}$, si scioglie in acqua. Quali ioni si formano?`),
		solution: `\\mathrm{${s.f}}(s) \\longrightarrow ${right}`,
		steps: [
			say(`Ogni unità formula di $\\mathrm{${s.f}}$ contiene ${s.x === 1 ? 'uno ione' : `${s.x} ioni`} $${ion(s.cat, s.a, '+')}$ e ${s.y === 1 ? 'uno ione' : `${s.y} ioni`} $${ion(s.an, s.b, '-')}$${s.an.includes('_') ? ', che resta intero' : ''}: in acqua si separano, ognuno con la sua carica.`),
			`\\mathrm{${s.f}}(s) \\longrightarrow ${right}`,
		],
		answer: choose(rng, texOpt(right, 'giusta'), wrong.map((w) => texOpt(w.tex, w.key))),
		params: { case: s.x > 1 || s.y > 1 ? 'con coefficienti' : 'uno a uno', sale: s.nome },
	};
}

// ---------------------------------------------------------------------------
// Level 3: moles of ions

function level3(rng: Rng): Built {
	for (;;) {
		const s = rng.pick(SALTS.filter((z) => z.x + z.y > 2));
		const k = rng.int(11, 99);
		if (k % 10 === 0) continue;
		const n = (k / 100).toFixed(2);
		const ask = rng.pick(['catione', 'anione', 'tutti'] as const);
		const mult = ask === 'catione' ? s.x : ask === 'anione' ? s.y : s.x + s.y;
		const exact = (k * mult) / 100;
		const ans = sig(exact, 2);
		if (!ans) continue;
		const what = ask === 'catione' ? `ioni $${ion(s.cat, s.a, '+')}$` : ask === 'anione' ? `ioni $${ion(s.an, s.b, '-')}$` : 'ioni in tutto';
		const other = ask === 'catione' ? s.a : ask === 'anione' ? s.b : 1;
		const mistakes = [k / 100, ask === 'tutti' ? (k * Math.max(s.x, s.y)) / 100 : (k * (s.x + s.y)) / 100, (k * other) / 100, (k * (mult + 1)) / 100];
		return {
			prompt: 'Trova le moli di ioni.',
			problem: textBlock(`Si sciolgono in acqua ${pq(n, 'mol')} di ${s.nome}, $\\mathrm{${s.f}}$. Quante moli di ${what} si formano?`),
			solution: `n \\approx ${rq(ans, 'mol')}`,
			steps: [
				`\\mathrm{${s.f}}(s) \\longrightarrow ${side(s.x, ion(s.cat, s.a, '+'), s.y, ion(s.an, s.b, '-'))}`,
				say(`Ogni mole di sale dà ${ask === 'tutti' ? `${s.x + s.y} moli di ioni` : `${mult} ${mult === 1 ? 'mole' : 'moli'} di quegli ioni`}: $${n.replace('.', '{,}')} \\cdot ${mult} = ${ans.tex}$, cioè $${rq(ans, 'mol')}$.`),
			],
			answer: choose(rng, rOpt(ans, 'mol'), [...sigOpts(mistakes, 2, 'mol'), ...sigOpts([exact * 2, exact / 2], 2, 'mol')]),
			params: { case: ask, sale: s.nome, n },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: solubility

export const SOL: Record<string, Record<number, string>> = {
	'cloruro di sodio': { 0: '35.7', 20: '35.9', 40: '36.4', 60: '37.1', 80: '38.0', 100: '39.2' },
	'cloruro di potassio': { 0: '28.0', 20: '34.2', 40: '40.1', 60: '45.8', 80: '51.3', 100: '56.3' },
	'nitrato di potassio': { 0: '13.3', 20: '31.6', 40: '63.9', 60: '110', 80: '169', 100: '246' },
	saccarosio: { 0: '179', 20: '204', 40: '238', 60: '287', 80: '362', 100: '487' },
};
const TEMPS = [0, 20, 40, 60, 80, 100];
const g3 = (rng: Rng) => {
	for (;;) {
		const k = rng.int(101, 499);
		if (k % 10) return String(k);
	}
};
const solText = (name: string, T: number) => `La solubilità del ${name} a ${pq(String(T), 'C')} è di ${pq(SOL[name][T], 'g')} in ${pq('100', 'g')} d'acqua.`;

function level4(rng: Rng): Built {
	const bottom = rng.next() < 0.5;
	for (;;) {
		const name = rng.pick(Object.keys(SOL));
		const T = rng.pick(TEMPS);
		const s = Number(SOL[name][T]);
		const mw = g3(rng);
		const max = (s * Number(mw)) / 100;
		if (!bottom) {
			const ans = sig(max, 3);
			if (!ans || ambiguous(ans)) continue;
			return {
				prompt: 'Trova la massa che si scioglie.',
				problem: textBlock(`${solText(name, T)} Quanti grammi di ${name} si sciolgono al massimo in ${pq(mw, 'g')} d'acqua a ${pq(String(T), 'C')}?`),
				solution: `m \\approx ${rq(ans, 'g')}`,
				steps: [say('La solubilità è riferita a $100\\,\\text{g}$ d\'acqua: si fa la proporzione con la massa d\'acqua del problema.'), `m = ${SOL[name][T].replace('.', '{,}')}\\,\\text{g} \\cdot \\dfrac{${mw}\\,\\text{g}}{100\\,\\text{g}} = ${max.toFixed(3).replace('.', '{,}')}\\ldots\\,\\text{g} \\approx ${rq(ans, 'g')}`],
				// the solubility as it is; the proportion upside down; 100 g of solution for 100 g of water
				answer: choose(rng, rOpt(ans, 'g'), [...sigOpts([s, (s * 100) / Number(mw), (s * Number(mw)) / (100 + s)], 3, 'g'), ...sigOpts([max * 1.2, max * 0.8], 3, 'g')]),
				params: { case: 'massima', sostanza: name, T, mw },
			};
		}
		const add = Math.ceil(max * 1.3 + rng.int(3, 40));
		if (add % 10 === 0) continue;
		const exact = add - max;
		const ans = sig(exact, 3);
		if (!ans || ambiguous(ans) || exact < 1) continue;
		return {
			prompt: 'Trova la massa che resta sul fondo.',
			problem: textBlock(`${solText(name, T)} In ${pq(mw, 'g')} d'acqua a ${pq(String(T), 'C')} si mettono ${pq(String(add), 'g')} di ${name} e si mescola a lungo. Quanti grammi restano sul fondo?`),
			solution: `m_{fondo} \\approx ${rq(ans, 'g')}`,
			steps: [
				`m_{sciolta} = ${SOL[name][T].replace('.', '{,}')}\\,\\text{g} \\cdot \\dfrac{${mw}\\,\\text{g}}{100\\,\\text{g}} = ${max.toFixed(3).replace('.', '{,}')}\\ldots\\,\\text{g}`,
				`m_{fondo} = ${add}\\,\\text{g} - ${max.toFixed(3).replace('.', '{,}')}\\ldots\\,\\text{g} \\approx ${rq(ans, 'g')}`,
			],
			// the solubility subtracted as it is; the mass dissolved for the one left; the proportion upside down
			answer: choose(rng, rOpt(ans, 'g'), [...sigOpts([add - s, max, add - (s * 100) / Number(mw)], 3, 'g'), ...sigOpts([exact * 1.2, exact * 0.8, exact * 1.5], 3, 'g')]),
			params: { case: 'fondo', sostanza: name, T, mw, add },
		};
	}
}

function level5(rng: Rng): Built {
	for (;;) {
		const name = rng.pick(['cloruro di potassio', 'nitrato di potassio', 'saccarosio']);
		const hot = rng.pick([40, 60, 80, 100]);
		const cold = rng.pick(TEMPS.filter((x) => x < hot));
		const s1 = Number(SOL[name][hot]), s2 = Number(SOL[name][cold]);
		const mw = g3(rng);
		const exact = ((s1 - s2) * Number(mw)) / 100;
		const ans = sig(exact, 3);
		if (!ans || ambiguous(ans)) continue;
		return {
			prompt: 'Trova la massa che cristallizza.',
			problem: textBlock(
				`In ${pq(mw, 'g')} d'acqua a ${pq(String(hot), 'C')} si scioglie tutto il ${name} possibile, poi la soluzione si raffredda a ${pq(String(cold), 'C')}. Quanti grammi di ${name} cristallizzano? Solubilità in ${pq('100', 'g')} d'acqua: ${pq(SOL[name][hot], 'g')} a ${pq(String(hot), 'C')}, ${pq(SOL[name][cold], 'g')} a ${pq(String(cold), 'C')}.`,
			),
			solution: `m \\approx ${rq(ans, 'g')}`,
			steps: [
				say('Cristallizza la differenza tra la massa sciolta a caldo e quella che resta sciolta a freddo, tutte e due nella massa d\'acqua del problema.'),
				`m = (${SOL[name][hot].replace('.', '{,}')} - ${SOL[name][cold].replace('.', '{,}')})\\,\\text{g} \\cdot \\dfrac{${mw}\\,\\text{g}}{100\\,\\text{g}} = ${exact.toFixed(3).replace('.', '{,}')}\\ldots\\,\\text{g} \\approx ${rq(ans, 'g')}`,
			],
			// the difference not scaled; all the hot mass; the cold mass
			answer: choose(rng, rOpt(ans, 'g'), [...sigOpts([s1 - s2, (s1 * Number(mw)) / 100, (s2 * Number(mw)) / 100], 3, 'g'), ...sigOpts([exact * 1.2, exact * 0.8], 3, 'g')]),
			params: { case: name, hot, cold, mw },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: hardness

const cls = (f: number) => (f < 15 ? 'dolce' : f <= 30 ? 'media' : 'dura');
const VOLS = [
	{ tex: '250\\,\\text{mL}', words: '250 mL', L: 0.25 },
	{ tex: '500\\,\\text{mL}', words: '500 mL', L: 0.5 },
	{ tex: '1{,}5\\,\\text{L}', words: '1,5 L', L: 1.5 },
	{ tex: '2{,}0\\,\\text{L}', words: '2,0 L', L: 2 },
];
const fOpt = (f: number, c: string) => {
	const r = sig(f, 2);
	if (!r) return null;
	return textOpt(`$${r.tex}\\,^\\circ\\text{f}$, ${c}`, `${r.value} ${c}`);
};

function level6(rng: Rng): Built {
	for (;;) {
		const f = rng.int(5, 45);
		if (f % 10 === 0 || Math.abs(f - 15) <= 1 || Math.abs(f - 30) <= 1) continue;
		const V = rng.pick(VOLS);
		const mg = f * 10 * V.L;
		const mgS = Number.isInteger(mg) ? String(mg) : mg.toFixed(1);
		const c = cls(f);
		const wrongClass = c === 'media' ? (f < 22.5 ? 'dolce' : 'dura') : 'media';
		const noLitre = mg / 10, perHundred = f / 10;
		return {
			prompt: 'Trova la durezza.',
			problem: textBlock(`L'analisi di un campione di $${V.tex}$ d'acqua dice che contiene l'equivalente di ${pq(mgS, 'mg')} di carbonato di calcio. Quanti gradi francesi è la sua durezza, e com'è l'acqua? Un grado francese sono $10\\,\\text{mg}$ di carbonato di calcio per litro.`),
			solution: `${sig(f, 2)!.tex}\\,^\\circ\\text{f}, \\text{ ${c}}`,
			steps: [
				`${t('Per litro: ')} \\dfrac{${mgS.replace('.', '{,}')}\\,\\text{mg}}{${String(V.L).replace('.', '{,}')}\\,\\text{L}} = ${f * 10}\\,\\text{mg/L}`,
				`\\dfrac{${f * 10}\\,\\text{mg/L}}{10\\,\\text{mg/L}} = ${f}\\,^\\circ\\text{f}`,
				say(`Sotto i $15\\,^\\circ\\text{f}$ l'acqua è dolce, tra $15$ e $30\\,^\\circ\\text{f}$ media, sopra i $30\\,^\\circ\\text{f}$ dura: questa è ${c}.`),
			],
			// the milligrams not taken per litre; divided by 100; the right number with the wrong class
			answer: choose(rng, fOpt(f, c)!, [fOpt(noLitre, cls(noLitre)), fOpt(perHundred, cls(perHundred)), fOpt(f, wrongClass), fOpt(f * 1.5, cls(f * 1.5)), fOpt(f / 2, cls(f / 2))]),
			params: { case: c, V: V.words, mg: mgS },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimAcquaSolvente: Generator = {
	id: ID,
	title: "L'acqua come solvente",
	levels: {
		1: { label: "Che cosa succede nell'acqua", constraints: ['composti ionici, sostanze polari, sostanze che non si sciolgono'] },
		2: { label: 'Gli ioni di un sale', constraints: ['la dissociazione, con coefficienti, cariche e ioni poliatomici'] },
		3: { label: 'Le moli di ioni', constraints: ['moli di un catione, di un anione o di tutti gli ioni'] },
		4: { label: 'Quanto se ne scioglie', constraints: ["la massa massima in una massa d'acqua, o quella che resta sul fondo"] },
		5: { label: 'La cristallizzazione', constraints: ['una soluzione satura che si raffredda'] },
		6: { label: "La durezza dell'acqua", constraints: ['gradi francesi e classe'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimAcquaSolvente;
