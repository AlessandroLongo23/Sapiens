/**
 * La teoria atomica di Dalton. Spec: specs/exercises/chim-teoria-atomica-dalton.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/26-chim-teoria-atomica-dalton.md), each one step
 * harder: which statement is a postulate of the theory; which of the three laws some data show; what is left of a
 * postulate today; how many molecules a reaction makes, counting the atoms that are conserved; how many times an atom
 * is heavier than an atom of hydrogen, from the masses in a compound and its formula. Distractors from the lesson's
 * warnings: the modern ideas taken for Dalton's, Proust confused with Dalton, the molecules counted instead of the
 * atoms, the rule of greatest simplicity (the ratio of the masses taken for the ratio of the atoms).
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type Built, MASS, NAME, checkCommon, choose, dc, generateWith, intOpt, nearTie, pf, shuffle, sig, t, textBlock, textOpt } from '../chim-trasformazioni';

export const ID = 'chim-teoria-atomica-dalton';

// ---------------------------------------------------------------------------
// Level 1: the postulates

const POSTULATES: string[][] = [
	['La materia è fatta di atomi indivisibili.', 'Gli atomi non si possono dividere.'],
	['Gli atomi di uno stesso elemento sono tutti uguali.', 'Elementi diversi hanno atomi di massa diversa.'],
	['Nelle reazioni gli atomi non si creano e non si distruggono.', 'Una reazione chimica riorganizza gli atomi.'],
	['Nei composti gli atomi sono in rapporti di numeri interi.', 'In un composto gli atomi si uniscono in rapporti fissi.'],
];
const NOT_POSTULATES = [
	'Gli atomi di un elemento possono avere masse diverse.',
	'In una reazione un elemento diventa un altro elemento.',
	"L'atomo è fatto di particelle più piccole.",
	'Nei composti gli atomi si uniscono in qualunque rapporto.',
	'In una reazione una parte degli atomi si distrugge.',
	'Gli atomi di tutti gli elementi hanno la stessa massa.',
	'Un composto può cambiare composizione da un campione all’altro.',
];

function level1(rng: Rng): Built {
	const k = rng.int(0, POSTULATES.length - 1);
	const right = rng.pick(POSTULATES[k]);
	const wrong = shuffle(rng, NOT_POSTULATES).slice(0, 3);
	const why = [
		'Per Dalton gli atomi sono particelle indivisibili: è il primo postulato.',
		'Per Dalton gli atomi di un elemento sono tutti uguali, e diversi da quelli degli altri elementi: è il secondo postulato.',
		'Per Dalton gli atomi si conservano e nelle reazioni cambiano solo i legami: è il terzo postulato.',
		'Per Dalton i composti hanno atomi in rapporti fissi di numeri interi: è il quarto postulato.',
	];
	return {
		prompt: 'Scegli il postulato.',
		problem: textBlock("Quale di queste affermazioni è un postulato della teoria atomica di Dalton?"),
		solution: t(right),
		steps: [t(why[k]), t('Le altre non sono postulati di Dalton: alcune sono idee arrivate dopo di lui, altre sono false.')],
		answer: choose(rng, textOpt(right, `si:${k}`), wrong.map((w) => textOpt(w, `no:${NOT_POSTULATES.indexOf(w)}`))),
		params: { case: `postulato ${k + 1}`, statement: right },
	};
}

// ---------------------------------------------------------------------------
// Level 2: which law

const LAWS = ['La legge di Lavoisier', 'La legge di Proust', 'La legge delle proporzioni multiple', 'Nessuna delle tre leggi'] as const;
const g = (x: number, d = 2) => `$${dc(x.toFixed(d))}\\,\\text{g}$`;

/** Reactions for Lavoisier: reactants and the product, with the masses per unit of reaction (from lesson 01). */
const REACTIONS = [
	{ a: 'ferro', b: 'zolfo', p: 'solfuro di ferro', ma: MASS.Fe, mb: MASS.S },
	{ a: 'magnesio', b: 'ossigeno', p: 'ossido di magnesio', ma: 2 * MASS.Mg, mb: 2 * MASS.O },
	{ a: 'idrogeno', b: 'ossigeno', p: 'acqua', ma: 4 * MASS.H, mb: 2 * MASS.O },
	{ a: 'sodio', b: 'cloro', p: 'cloruro di sodio', ma: 2 * MASS.Na, mb: 2 * MASS.Cl },
	{ a: 'carbonio', b: 'ossigeno', p: 'anidride carbonica', ma: MASS.C, mb: 2 * MASS.O },
];
/** Compounds for Proust: the element and its fraction of the mass. */
const FIXED = [
	{ c: 'acqua', el: 'idrogeno', w: (2 * MASS.H) / (2 * MASS.H + MASS.O) },
	{ c: 'cloruro di sodio', el: 'sodio', w: MASS.Na / (MASS.Na + MASS.Cl) },
	{ c: 'anidride carbonica', el: 'carbonio', w: MASS.C / (MASS.C + 2 * MASS.O) },
	{ c: 'carbonato di calcio', el: 'calcio', w: MASS.Ca / (MASS.Ca + MASS.C + 3 * MASS.O) },
	{ c: 'ossido di magnesio', el: 'magnesio', w: MASS.Mg / (MASS.Mg + MASS.O) },
];
/** Pairs for the multiple proportions: grams of Y per gram of X in the two compounds. */
const MULTI = [
	{ x: 'carbonio', y: 'ossigeno', k: [MASS.O / MASS.C, (2 * MASS.O) / MASS.C] },
	{ x: 'zolfo', y: 'ossigeno', k: [(2 * MASS.O) / MASS.S, (3 * MASS.O) / MASS.S] },
	{ x: 'azoto', y: 'ossigeno', k: [MASS.O / MASS.N, (2 * MASS.O) / MASS.N] },
	{ x: 'idrogeno', y: 'ossigeno', k: [MASS.O / (2 * MASS.H), MASS.O / MASS.H] },
	{ x: 'ferro', y: 'ossigeno', k: [MASS.O / MASS.Fe, (3 * MASS.O) / (2 * MASS.Fe)] },
];

function level2(rng: Rng): Built {
	const law = rng.int(0, 2);
	let text: string;
	let why: string;
	let params: Record<string, unknown>;
	if (law === 0) {
		const r = rng.pick(REACTIONS);
		const k = rng.int(5, 40) / 100;
		const a = Math.round(r.ma * k * 100) / 100, b = Math.round(r.mb * k * 100) / 100;
		text = `In un recipiente chiuso si fanno reagire ${g(a)} di ${r.a} e ${g(b)} di ${r.b}, che reagiscono del tutto e formano ${r.p}. Alla fine nel recipiente ci sono ${g(a + b)} di ${r.p}. Quale legge mostrano questi dati?`;
		why = 'La massa dei prodotti è uguale alla somma delle masse dei reagenti: la massa si conserva, è la legge di Lavoisier.';
		params = { case: 'Lavoisier', a, b };
	} else if (law === 1) {
		const c = rng.pick(FIXED);
		const m1 = rng.int(200, 900) / 100;
		let m2 = rng.int(1000, 5000) / 100;
		if (rng.next() < 0.5) m2 = rng.int(100, 190) / 100;
		const e1 = Math.round(m1 * c.w * 100) / 100, e2 = Math.round(m2 * c.w * 100) / 100;
		text = `Un campione di ${g(m1)} di ${c.c} contiene ${g(e1)} di ${c.el}; un altro campione, di ${g(m2)}, preparato in un altro modo, ne contiene ${g(e2)}. Quale legge mostrano questi dati?`;
		why = `In tutti e due i campioni il ${c.el} è la stessa frazione della massa, $${dc((c.w * 100).toFixed(1))}\\%$: un composto ha composizione fissa, è la legge di Proust.`;
		params = { case: 'Proust', m1, e1, m2, e2 };
	} else {
		const p = rng.pick(MULTI);
		const m = rng.int(100, 500) / 100;
		const y1 = Number(sig(m * p.k[0], 3)), y2 = Number(sig(m * p.k[1], 3));
		const gs = (x: number) => `$${dc(sig(x, 3))}\\,\\text{g}$`;
		text = `Due composti diversi sono fatti di ${p.x} e ${p.y}. Nel primo ${g(m)} di ${p.x} sono uniti a ${gs(y1)} di ${p.y}, nel secondo a ${gs(y2)}. Quale legge mostrano questi dati?`;
		why = `Per la stessa massa di ${p.x}, le masse di ${p.y} stanno in un rapporto di numeri interi piccoli, $${dc((y2 / y1).toFixed(2))}$: è la legge delle proporzioni multiple.`;
		params = { case: 'proporzioni multiple', m, y1, y2 };
	}
	return {
		prompt: 'Scegli la legge.',
		problem: textBlock(text),
		solution: t(LAWS[law]),
		steps: [t(why)],
		answer: choose(rng, textOpt(LAWS[law]), LAWS.filter((_, i) => i !== law).map((l) => textOpt(l))),
		params,
	};
}

// ---------------------------------------------------------------------------
// Level 3: what is left today

const VERDICTS = ['Vero ancora oggi', "Falso: l'atomo ha particelle più piccole", 'Falso: esistono gli isotopi', 'Vero nelle reazioni chimiche, non in quelle nucleari'] as const;
const STATEMENTS: string[][] = [
	['In una reazione chimica gli atomi si separano e si legano in modo diverso.', 'La materia è fatta di atomi.', 'Gli atomi di elementi diversi hanno proprietà chimiche diverse.', "In ogni molecola d'acqua ci sono due atomi di idrogeno e uno di ossigeno."],
	['Gli atomi sono indivisibili.', "L'atomo è una sfera piena, senza parti.", 'Gli atomi non si possono dividere in parti più piccole.'],
	['Tutti gli atomi di uno stesso elemento hanno la stessa massa.', 'Due atomi di cloro hanno sempre la stessa massa.', 'Due atomi di carbonio hanno sempre la stessa massa.'],
	['Gli atomi non si creano e non si distruggono.', 'Un atomo di un elemento non può trasformarsi in un atomo di un altro elemento.'],
];
const VERDICT_WHY = [
	'È una delle idee di Dalton che valgono ancora.',
	'Oggi si sa che l’atomo è fatto di elettroni, protoni e neutroni; nelle reazioni chimiche però non si spezza.',
	'Oggi si sa che esistono gli isotopi: atomi dello stesso elemento con masse diverse.',
	'Nelle reazioni chimiche è vero; nelle reazioni nucleari un elemento si può trasformare in un altro.',
];

function level3(rng: Rng): Built {
	const k = rng.int(0, 3);
	const s = rng.pick(STATEMENTS[k]);
	return {
		prompt: 'Giudica il postulato.',
		problem: textBlock(`Secondo Dalton, ${s.charAt(0).toLowerCase()}${s.slice(1)} Che cosa ne sappiamo oggi?`),
		solution: t(VERDICTS[k]),
		steps: [t(VERDICT_WHY[k])],
		answer: choose(rng, textOpt(VERDICTS[k], String(k)), VERDICTS.map((v, i) => textOpt(v, String(i))).filter((_, i) => i !== k)),
		params: { case: String(k), statement: s },
	};
}

// ---------------------------------------------------------------------------
// Level 4: counting the atoms of a reaction

/** Reactants (formula, number per unit), the product asked and how many per unit; `el` is the element counted. */
const COUNTS = [
	{ r: [['N2', 1], ['H2', 3]], p: 'NH3', n: 2, el: 'N' },
	{ r: [['H2', 2], ['O2', 1]], p: 'H2O', n: 2, el: 'O' },
	{ r: [['CO', 2], ['O2', 1]], p: 'CO2', n: 2, el: 'C' },
	{ r: [['H2', 1], ['Cl2', 1]], p: 'HCl', n: 2, el: 'H' },
	{ r: [['C', 1], ['O2', 1]], p: 'CO2', n: 1, el: 'C' },
	{ r: [['SO2', 2], ['O2', 1]], p: 'SO3', n: 2, el: 'S' },
	{ r: [['Na', 2], ['Cl2', 1]], p: 'NaCl', n: 2, el: 'Na' },
	{ r: [['Fe', 4], ['O2', 3]], p: 'Fe2O3', n: 2, el: 'Fe' },
	{ r: [['CH4', 1], ['O2', 2]], p: 'H2O', n: 2, el: 'H', other: 'CO2' },
] as { r: [string, number][]; p: string; n: number; el: string; other?: string }[];
const ATOMIC = new Set(['C', 'Na', 'Fe']);
const ionicP = new Set(['NaCl', 'Fe2O3']);
const inF = (f: string, el: string) => {
	const m = new RegExp(`${el}(\\d*)(?![a-z])`).exec(f);
	return m ? (m[1] ? Number(m[1]) : 1) : 0;
};

function level4(rng: Rng): Built {
	for (;;) {
		const c = rng.pick(COUNTS);
		const k = rng.int(2, 9);
		const amounts = c.r.map(([f, n]) => [f, n * k] as [string, number]);
		const n = c.n * k;
		const part = (f: string, a: number) => `$${a}$ ${ATOMIC.has(f) ? 'atomi' : ionicP.has(f) ? 'unità formula' : 'molecole'} di ${pf(f)}`;
		const what = ionicP.has(c.p) ? 'unità formula' : 'molecole';
		const [src] = amounts.filter(([f]) => inF(f, c.el) > 0);
		const atoms = src[1] * inF(src[0], c.el);
		const products = c.other ? `${pf(c.other)} e ${pf(c.p)}` : `solo ${pf(c.p)}`;
		const total = amounts.reduce((s, [, a]) => s + a, 0);
		const per = inF(src[0], c.el), inP = inF(c.p, c.el);
		const mistakes = [src[1], total, atoms, amounts[1][1], 2 * n];
		const unit = ionicP.has(c.p) ? "un'unità formula" : 'una molecola';
		return {
			prompt: 'Conta le particelle.',
			problem: textBlock(`In un recipiente ci sono ${part(amounts[0][0], amounts[0][1])} e ${part(amounts[1][0], amounts[1][1])}, che reagiscono tutti e formano ${products}. Quante ${what} di ${pf(c.p)} si formano?`),
			solution: `${n}`,
			steps: [
				t(`Gli atomi non si creano e non si distruggono. Gli atomi di ${NAME[c.el]} sono ${per === 1 ? atoms : `${src[1]} per ${per}, cioè ${atoms}`}, prima e dopo la reazione.`),
				t(`Ogni ${unit.replace(/^una? /, '').replace("un'", '')} di ${pf(c.p)} ne contiene ${inP}: se ne formano ${inP === 1 ? atoms : `${atoms} diviso ${inP}, cioè ${n}`}.`),
			],
			// the molecules of the reactant; all the molecules; the atoms; the other reactant; twice
			answer: choose(rng, intOpt(n), mistakes.filter((x) => x > 0 && x !== n).map(intOpt), [n + 1, n - 1, n + 2].filter((x) => x > 0).map(intOpt)),
			params: { case: c.p, reactants: amounts.map(([f, a]) => `${a} ${f}`) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: relative masses

const HYDRIDES = [
	{ f: 'H2O', el: 'O', h: 2, nome: "l'acqua" },
	{ f: 'NH3', el: 'N', h: 3, nome: "l'ammoniaca" },
	{ f: 'CH4', el: 'C', h: 4, nome: 'il metano' },
	{ f: 'H2S', el: 'S', h: 2, nome: "l'acido solfidrico" },
	{ f: 'HCl', el: 'Cl', h: 1, nome: "l'acido cloridrico" },
	{ f: 'PH3', el: 'P', h: 3, nome: 'la fosfina' },
];
const r3 = (x: number) => (nearTie(x, 3, 1e-7) ? null : sig(x, 3));
const numOpt = (s: string): ChoiceOption => ({ latex: dc(s), values: [s] });

function level5(rng: Rng): Built {
	for (;;) {
		const c = rng.pick(HYDRIDES);
		const mh = (rng.int(100, 299) / 100).toFixed(2);
		const my = r3((Number(mh) * MASS[c.el]) / (c.h * MASS.H));
		if (!my || my.replace('.', '').replace(/^0+/, '').length !== 3) continue;
		const ratio = Number(my) / Number(mh);
		const exact = ratio * c.h;
		const ans = r3(exact);
		if (!ans || ans.replace('.', '').replace(/^0+/, '').length !== 3) continue;
		const mis = [ratio, ratio / c.h, ratio * (c.h + 1), exact * 2, exact / 2].map(r3).filter((x): x is string => x !== null && Number(x) !== Number(ans));
		return {
			prompt: 'Trova la massa relativa.',
			problem: textBlock(
				`In un campione di ${c.nome.replace(/^(il |la |l')/, '')}, ${pf(c.f)}, ci sono ${g(Number(mh))} di idrogeno e $${dc(my)}\\,\\text{g}$ di ${NAME[c.el]}. Quante volte un atomo di ${NAME[c.el]} è più pesante di un atomo di idrogeno?`,
			),
			solution: dc(ans),
			steps: [
				t(`Il rapporto tra le masse è ${dc(ratio.toFixed(3))}. Nella molecola ci sono un atomo di ${NAME[c.el]} e ${c.h} di idrogeno:`.replace(' e 1 di idrogeno', ' e uno di idrogeno')),
				`\\dfrac{m_{\\mathrm{${c.el}}}}{${c.h === 1 ? '' : c.h + '\\,'}m_{\\mathrm{H}}} = ${dc(ratio.toFixed(3))} \\quad\\Rightarrow\\quad \\dfrac{m_{\\mathrm{${c.el}}}}{m_{\\mathrm{H}}} = ${c.h === 1 ? '' : c.h + ' \\cdot '}${dc(ratio.toFixed(3))} \\approx ${dc(ans)}`,
			],
			// Dalton's greatest simplicity; divided by the hydrogen atoms; one atom too many; twice and half
			answer: choose(rng, numOpt(ans), mis.map(numOpt)),
			params: { case: c.f, mh, my },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimTeoriaAtomicaDalton: Generator = {
	id: ID,
	title: 'La teoria atomica di Dalton',
	levels: {
		1: { label: 'I postulati', constraints: ['un postulato e tre affermazioni che Dalton non fa'] },
		2: { label: 'Quale legge', constraints: ['dati generati per Lavoisier, Proust, proporzioni multiple'] },
		3: { label: 'Che cosa resta oggi', constraints: ['quattro giudizi fissi'] },
		4: { label: 'Contare gli atomi', constraints: ['reazioni con un prodotto da contare'] },
		5: { label: 'Le masse relative', constraints: ['composti con l’idrogeno, formula nota'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimTeoriaAtomicaDalton;
