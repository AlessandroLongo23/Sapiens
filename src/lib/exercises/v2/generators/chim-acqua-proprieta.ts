/**
 * Le proprietà fisiche dell'acqua. Spec: specs/exercises/chim-acqua-proprieta.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/45-chim-acqua-proprieta.md), each one step harder: the
 * property of water behind an everyday phenomenon; the volume of the ice from a mass or a volume of water; the part
 * of a block of ice under or above the surface, in fresh or sea water; the heat that warms a mass of water; the
 * warming of another substance given the same heat as the same mass of water. Data from the lesson: ice 0,917 g/mL,
 * water 1,00 g/mL, sea water 1,03 g/mL, specific heats in J/(g·°C) (water 4,186). Distractors from the lesson's
 * warnings: the volume multiplied by the density, the increase for the volume, the ratio of the densities upside
 * down, J read as kJ, the final temperature for the difference, the ratio of the specific heats upside down.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, ambiguous, checkCommon, choose, generateWith, pq, rOpt, rq, say, shuffle, sig, sigOpts, t, textBlock, textOpt } from '../chim-acqua';

export const ID = 'chim-acqua-proprieta';

// ---------------------------------------------------------------------------
// Level 1: the property behind a phenomenon

export const PROPS = {
	densita: "il ghiaccio è meno denso dell'acqua liquida",
	quattro: "l'acqua liquida è più densa a $4\\,^\\circ\\text{C}$",
	calore: "l'acqua ha un calore specifico alto",
	tensione: "l'acqua ha una tensione superficiale alta",
	capillarita: "l'acqua sale nei tubi sottili (capillarità)",
	evaporazione: "per evaporare l'acqua assorbe molto calore",
} as const;
export type Prop = keyof typeof PROPS;

export const STORIES: { s: string; p: Prop }[] = [
	{ s: "Un cubetto di ghiaccio galleggia in un bicchiere d'acqua.", p: 'densita' },
	{ s: "Una bottiglia di vetro piena d'acqua, dimenticata nel congelatore, si rompe.", p: 'densita' },
	{ s: "L'acqua che gela nelle crepe delle rocce le spacca.", p: 'densita' },
	{ s: 'Di un iceberg si vede solo circa un decimo.', p: 'densita' },
	{ s: "D'inverno un lago gela in superficie, e sul fondo i pesci restano vivi.", p: 'quattro' },
	{ s: "In un lago ghiacciato l'acqua più fredda resta in alto, sotto il ghiaccio, e quella del fondo è la meno fredda.", p: 'quattro' },
	{ s: "D'estate la sabbia della spiaggia scotta, mentre l'acqua del mare resta fresca.", p: 'calore' },
	{ s: "Le città sul mare hanno inverni più miti di quelle nell'entroterra.", p: 'calore' },
	{ s: 'Nei termosifoni si fa scorrere acqua calda, che trasporta molto calore.', p: 'calore' },
	{ s: "Una borsa dell'acqua calda resta tiepida per ore.", p: 'calore' },
	{ s: 'Un insetto leggero cammina sulla superficie di uno stagno.', p: 'tensione' },
	{ s: "Una graffetta d'acciaio appoggiata con delicatezza resta a galla sull'acqua.", p: 'tensione' },
	{ s: "Una goccia d'acqua che cade prende la forma di una sfera.", p: 'tensione' },
	{ s: "Un tovagliolo di carta con un angolo nell'acqua si bagna fino in cima.", p: 'capillarita' },
	{ s: 'Una zolletta di zucchero appoggiata sul caffè si inzuppa dal basso verso l\'alto.', p: 'capillarita' },
	{ s: "In un tubicino di vetro sottile l'acqua sale sopra il livello della bacinella.", p: 'capillarita' },
	{ s: 'Sudare aiuta il corpo a raffreddarsi.', p: 'evaporazione' },
	{ s: "Uscendo bagnati dal mare in una giornata di vento si sente freddo.", p: 'evaporazione' },
];
const WHY: Record<Prop, string> = {
	densita: "Il ghiaccio, con la sua rete aperta di legami a idrogeno, ha una densità di $0{,}917\\,\\text{g/mL}$: occupa più volume dell'acqua e galleggia.",
	quattro: "L'acqua liquida è più densa a $4\\,^\\circ\\text{C}$: quella più fredda resta in superficie e ghiaccia, il fondo resta a $4\\,^\\circ\\text{C}$.",
	calore: "Il calore specifico dell'acqua è alto: con la stessa energia si scalda e si raffredda poco.",
	tensione: 'Le molecole della superficie sono tirate verso l\'interno: la superficie si comporta come una pellicola tesa.',
	capillarita: "L'adesione dell'acqua ai materiali e ai pori sottili vince la coesione, e l'acqua sale.",
	evaporazione: "Per evaporare ogni molecola deve rompere i suoi legami a idrogeno: l'acqua che evapora porta via molto calore.",
};

function level1(rng: Rng): Built {
	const k = rng.int(0, STORIES.length - 1);
	const { s, p } = STORIES[k];
	const others = shuffle(
		rng,
		(Object.keys(PROPS) as Prop[]).filter((x) => x !== p),
	);
	return {
		prompt: 'Scegli la proprietà che spiega il fenomeno.',
		problem: textBlock(`${s} Quale proprietà dell'acqua lo spiega?`),
		solution: t(PROPS[p]),
		steps: [say(WHY[p])],
		answer: choose(rng, textOpt(PROPS[p], p), others.map((x) => textOpt(PROPS[x], x))),
		params: { case: p, story: k },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the volume of the ice

function three(rng: Rng, lo = 101, hi = 999): string {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return String(k);
	}
}

function level2(rng: Rng): Built {
	const fromMass = rng.next() < 0.5;
	const x = three(rng);
	const exact = Number(x) / 0.917;
	const ans = sig(exact, 3);
	if (ambiguous(ans) || !ans) throw new Error('retry');
	const problem = fromMass
		? `Una massa di ${pq(x, 'g')} d'acqua ghiaccia. Che volume occupa il ghiaccio? La densità del ghiaccio è ${pq('0.917', 'gmL')}.`
		: `In un contenitore ci sono ${pq(x, 'mL')} d'acqua, con densità ${pq('1.00', 'gmL')}. L'acqua ghiaccia: che volume occupa il ghiaccio, con densità ${pq('0.917', 'gmL')}?`;
	return {
		prompt: 'Trova il volume del ghiaccio.',
		problem: textBlock(problem),
		solution: `V \\approx ${rq(ans, 'mL')}`,
		steps: [
			say(fromMass ? 'La massa non cambia quando l\'acqua ghiaccia.' : `La massa dell'acqua è $m = d\\,V = 1{,}00\\,\\text{g/mL} \\cdot ${x}\\,\\text{mL} = ${x}\\,\\text{g}$, e non cambia quando l'acqua ghiaccia.`),
			`V = \\dfrac{m}{d} = \\dfrac{${x}\\,\\text{g}}{0{,}917\\,\\text{g/mL}} = ${exact.toFixed(2).replace('.', '{,}')}\\ldots\\,\\text{mL} \\approx ${rq(ans, 'mL')}`,
		],
		// the volume multiplied by the density; no change; the increase only
		answer: choose(rng, rOpt(ans, 'mL'), [...sigOpts([Number(x) * 0.917, Number(x), exact - Number(x)], 3, 'mL'), ...sigOpts([exact * 1.2, exact * 0.8], 3, 'mL')]),
		params: { case: fromMass ? 'massa' : 'volume', x },
	};
}

// ---------------------------------------------------------------------------
// Level 3: under and above the surface

function level3(rng: Rng): Built {
	const sea = rng.next() < 0.5;
	const under = rng.next() < 0.5;
	const V = three(rng, 101, 999);
	const d = sea ? 1.03 : 1.0;
	const dS = sea ? '1.03' : '1.00';
	const inside = (Number(V) * 0.917) / d;
	const exact = under ? inside : Number(V) - inside;
	const n = under ? 3 : 2; // the part above is a difference: two figures
	const ans = sig(exact, n);
	if (!ans || ambiguous(ans)) throw new Error('retry');
	const where = sea ? "nell'acqua di mare" : "nell'acqua dolce";
	const other = under ? Number(V) - inside : inside;
	const mistakes = [other, (Number(V) * d) / 0.917, sea ? (under ? Number(V) * 0.917 : Number(V) * 0.083) : under ? Number(V) * 0.917 * 1.03 : Number(V) - (Number(V) * 0.917) / 1.03];
	return {
		prompt: under ? 'Trova il volume immerso.' : 'Trova il volume che emerge.',
		problem: textBlock(
			`Un blocco di ghiaccio di ${pq(V, 'cm3')} galleggia ${where}. Quanti centimetri cubi del blocco stanno ${under ? 'sotto' : 'sopra'} la superficie? Densità del ghiaccio ${pq('0.917', 'gcm3')}, ${sea ? "dell'acqua di mare" : "dell'acqua dolce"} ${pq(dS, 'gcm3')}.`,
		),
		solution: `V_{${under ? 'imm' : 'em'}} \\approx ${rq(ans, 'cm3')}`,
		steps: [
			say(`La parte immersa è il rapporto tra la densità del ghiaccio e quella del liquido: $0{,}917/${dS.replace('.', '{,}')}$.`),
			`V_{imm} = ${V}\\,\\text{cm}^3 \\cdot \\dfrac{0{,}917}{${dS.replace('.', '{,}')}} = ${inside.toFixed(2).replace('.', '{,}')}\\ldots\\,\\text{cm}^3`,
			...(under ? [] : [`V_{em} = ${V}\\,\\text{cm}^3 - ${inside.toFixed(2).replace('.', '{,}')}\\,\\text{cm}^3 = ${exact.toFixed(2).replace('.', '{,}')}\\ldots\\,\\text{cm}^3 \\approx ${rq(ans, 'cm3')}`]),
		],
		// the other part; the ratio upside down; fresh water for sea water (or the other way round)
		answer: choose(rng, rOpt(ans, 'cm3'), [...sigOpts(mistakes, n, 'cm3'), ...sigOpts([exact * 1.2, exact * 0.8, exact * 1.5], n, 'cm3')]),
		params: { case: `${sea ? 'mare' : 'dolce'} ${under ? 'sotto' : 'sopra'}`, V },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the heat

function level4(rng: Rng): Built {
	for (;;) {
		const m = three(rng, 101, 999);
		const t1 = rng.int(8, 30);
		const t2 = t1 + rng.int(10, 60);
		if (t2 > 95) continue;
		const d1 = (x: number) => `${x}{,}0`;
		const exact = (4.186 * Number(m) * (t2 - t1)) / 1000; // kJ
		const ans = sig(exact, 3);
		if (!ans || ambiguous(ans)) continue;
		return {
			prompt: 'Trova il calore.',
			problem: textBlock(`Quanti kilojoule servono per scaldare ${pq(m, 'g')} d'acqua da $${d1(t1)}\\,^\\circ\\text{C}$ a $${d1(t2)}\\,^\\circ\\text{C}$? Il calore specifico dell'acqua è ${pq('4.186', 'cJ')}.`),
			solution: `Q \\approx ${rq(ans, 'kJ')}`,
			steps: [
				`Q = c\\,m\\,\\Delta t = 4{,}186\\,\\text{J/(g}\\cdot{}^\\circ\\text{C)} \\cdot ${m}\\,\\text{g} \\cdot (${d1(t2)} - ${d1(t1)})\\,^\\circ\\text{C} = ${(exact * 1000).toFixed(1).replace('.', '{,}')}\\,\\text{J}`,
				say(`In kilojoule si divide per $1000$: $Q \\approx ${rq(ans, 'kJ')}$.`),
			],
			// the joules read as kilojoules; the specific heat forgotten; the final temperature for the difference
			answer: choose(rng, rOpt(ans, 'kJ'), [...sigOpts([exact * 1000, (Number(m) * (t2 - t1)) / 1000, (4.186 * Number(m) * t2) / 1000], 3, 'kJ'), ...sigOpts([exact * 1.2, exact * 0.8], 3, 'kJ')]),
			params: { case: 'calore', m, t1, t2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the same heat to the same mass

export const OTHERS: { nome: string; c: string }[] = [
	{ nome: 'etanolo', c: '2.44' },
	{ nome: "olio d'oliva", c: '1.97' },
	{ nome: 'alluminio', c: '0.897' },
	{ nome: 'vetro', c: '0.84' },
	{ nome: 'ferro', c: '0.449' },
	{ nome: 'rame', c: '0.385' },
];

function level5(rng: Rng): Built {
	const ofWater = rng.next() < 0.5; // given the other substance's warming, find the water's
	for (;;) {
		const x = rng.pick(OTHERS);
		const cx = Number(x.c);
		const given = ofWater ? rng.int(100, 999) / 10 : rng.int(100, 199) / 10; // one decimal, three figures
		const gs = given.toFixed(1);
		const exact = ofWater ? (given * cx) / 4.186 : (given * 4.186) / cx;
		const n = x.c === '0.84' ? 2 : 3;
		const ans = sig(exact, n);
		if (!ans || ambiguous(ans) || exact < 0.5 || exact > 400) continue;
		const inverse = ofWater ? (given * 4.186) / cx : (given * cx) / 4.186;
		return {
			prompt: "Trova l'aumento di temperatura.",
			problem: textBlock(
				ofWater
					? `Si danno lo stesso calore a masse uguali d'acqua e di ${x.nome}. Il campione di ${x.nome} si scalda di ${pq(gs, 'C')}. Di quanto si scalda l'acqua? Calori specifici: acqua ${pq('4.186', 'cJ')}, ${x.nome} ${pq(x.c, 'cJ')}.`
					: `Si danno lo stesso calore a masse uguali d'acqua e di ${x.nome}. L'acqua si scalda di ${pq(gs, 'C')}. Di quanto si scalda il campione di ${x.nome}? Calori specifici: acqua ${pq('4.186', 'cJ')}, ${x.nome} ${pq(x.c, 'cJ')}.`,
			),
			solution: `\\Delta t_{${ofWater ? 'acqua' : 'x'}} \\approx ${rq(ans, 'C')}`,
			steps: [
				say('Con lo stesso calore e la stessa massa, $c\\,\\Delta t$ è lo stesso per le due sostanze: gli aumenti di temperatura stanno nel rapporto inverso dei calori specifici.'),
				ofWater
					? `\\Delta t_{acqua} = ${gs.replace('.', '{,}')}\\,^\\circ\\text{C} \\cdot \\dfrac{${x.c.replace('.', '{,}')}}{4{,}186} = ${exact.toFixed(3).replace('.', '{,}')}\\ldots\\,^\\circ\\text{C} \\approx ${rq(ans, 'C')}`
					: `\\Delta t_{x} = ${gs.replace('.', '{,}')}\\,^\\circ\\text{C} \\cdot \\dfrac{4{,}186}{${x.c.replace('.', '{,}')}} = ${exact.toFixed(3).replace('.', '{,}')}\\ldots\\,^\\circ\\text{C} \\approx ${rq(ans, 'C')}`,
			],
			// the ratio upside down; the same warming; the water's specific heat multiplied only
			answer: choose(rng, rOpt(ans, 'C'), [...sigOpts([inverse, given, given * 4.186], n, 'C'), ...sigOpts([exact * 1.2, exact * 0.8, exact * 1.5], n, 'C')]),
			params: { case: ofWater ? 'acqua' : 'altra sostanza', sostanza: x.nome, c: x.c, given: gs },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimAcquaProprieta: Generator = {
	id: ID,
	title: "Le proprietà fisiche dell'acqua",
	levels: {
		1: { label: 'La proprietà giusta', constraints: ['un fenomeno quotidiano, sei proprietà'] },
		2: { label: 'Il volume del ghiaccio', constraints: ["da una massa o da un volume d'acqua", 'tre cifre significative'] },
		3: { label: 'Il ghiaccio che galleggia', constraints: ['acqua dolce o di mare, parte immersa o emersa'] },
		4: { label: "Scaldare l'acqua", constraints: ['Q = c m Δt, in kJ'] },
		5: { label: 'Lo stesso calore', constraints: ['masse uguali, aumenti nel rapporto inverso dei calori specifici'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimAcquaProprieta;
