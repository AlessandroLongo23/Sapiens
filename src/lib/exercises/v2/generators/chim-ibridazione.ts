/**
 * L'ibridazione degli orbitali. Spec: specs/exercises/chim-ibridazione.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/71-chim-ibridazione.md), each one step harder: the facts
 * about the three kinds of hybrid orbitals; the hybridisation from the number of atoms bound and of lone pairs; the
 * central atom of a molecule with single bonds only (lone pairs to be found); a central atom with double or triple
 * bonds; the carbons of a chain, one by one; which orbitals overlap in a given bond. Central atoms are of the second
 * period (B, C, N, O), as the lesson's rule asks.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { type BuiltG, checkG, choose, generateG, shuffled, textBlock, textOpt, texOpt, toChoiceG } from '../chim3-g';

export const ID = 'chim-ibridazione';

type Hyb = 'sp' | 'sp2' | 'sp3';
const HYBS: Hyb[] = ['sp', 'sp2', 'sp3'];
const TEX: Record<string, string> = { sp: 'sp', sp2: 'sp^2', sp3: 'sp^3', sp3d: 'sp^3d', p: 'p', '1s': '1s' };
const N_HYB: Record<Hyb, number> = { sp: 2, sp2: 3, sp3: 4 };
const ANGLE: Record<Hyb, string> = { sp: '180^\\circ', sp2: '120^\\circ', sp3: '109{,}5^\\circ' };
const MIXED: Record<Hyb, string> = { sp: 'Un $s$ e un $p$', sp2: 'Un $s$ e due $p$', sp3: 'Un $s$ e tre $p$' };
const SHAPE: Record<Hyb, string> = { sp: 'Su una retta, in versi opposti', sp2: 'In un piano, verso i vertici di un triangolo', sp3: 'Verso i vertici di un tetraedro' };
const bySteric = (n: number): Hyb => (n === 2 ? 'sp' : n === 3 ? 'sp2' : 'sp3');

const numOpt = (k: number) => texOpt(String(k), String(k));
const hybOpt = (h: string) => texOpt(TEX[h], h);
/** The four hybridisations offered when the answer is one of them. */
const hybChoice = (rng: Rng, right: Hyb) => choose(rng, hybOpt(right), shuffled(rng, ['sp', 'sp2', 'sp3', 'sp3d'].filter((h) => h !== right)).map(hybOpt));

// ---------------------------------------------------------------------------
// Level 1: the three kinds of hybrid orbitals

export const KINDS = ['quanti', 'angolo', 'rimasti', 'mescolati', 'disposizione', 'pi'] as const;

function level1(rng: Rng): BuiltG {
	const h = rng.pick(HYBS);
	const kind = rng.pick(KINDS);
	const n = N_HYB[h];
	const name = `$${TEX[h]}$`;
	let problem: string, right: ChoiceOption, others: ChoiceOption[], why: string;
	if (kind === 'quanti') {
		problem = `Quanti orbitali ibridi ha un atomo ibridato ${name}?`;
		right = numOpt(n);
		others = [1, 2, 3, 4].filter((k) => k !== n).map(numOpt);
		why = `Gli ibridi ${name} nascono da ${MIXED[h].toLowerCase()}: gli orbitali mescolati sono $${n}$, e gli ibridi sono altrettanti.`;
	} else if (kind === 'angolo') {
		problem = `Che angolo formano tra loro gli orbitali ibridi ${name}?`;
		right = texOpt(ANGLE[h], h);
		others = [...HYBS.filter((x) => x !== h).map((x) => texOpt(ANGLE[x], x)), texOpt('90^\\circ', '90')];
		why = `I $${n}$ ibridi ${name} si dispongono il più lontano possibile: ${SHAPE[h].toLowerCase()}, a $${ANGLE[h]}$.`;
	} else if (kind === 'rimasti' || kind === 'pi') {
		problem = kind === 'rimasti' ? `Quanti orbitali $p$ non ibridati restano a un atomo ibridato ${name}?` : `Quanti legami $\\pi$ può formare un atomo di carbonio ibridato ${name}?`;
		right = numOpt(4 - n);
		others = [0, 1, 2, 3].filter((k) => k !== 4 - n).map(numOpt);
		why =
			`Nel mescolamento entrano ${n - 1 === 1 ? 'un solo orbitale $p$' : n - 1 === 2 ? 'due orbitali $p$' : 'tutti e tre gli orbitali $p$'}: ne ${4 - n === 1 ? 'resta $1$' : `restano $${4 - n}$`}.` +
			(kind === 'pi' ? ` I legami $\\pi$ si fanno con gli orbitali $p$ non ibridati, uno per orbitale.` : '');
	} else if (kind === 'mescolati') {
		problem = `Quali orbitali si mescolano per dare gli ibridi ${name}?`;
		right = textOpt(MIXED[h], h);
		others = [...HYBS.filter((x) => x !== h).map((x) => textOpt(MIXED[x], x)), textOpt('Due $s$ e due $p$', 'altro')];
		why = `Il nome dice da che cosa sono fatti: ${MIXED[h].toLowerCase()}.`;
	} else {
		problem = `Come sono disposti gli orbitali ibridi ${name}?`;
		right = textOpt(SHAPE[h], h);
		others = [...HYBS.filter((x) => x !== h).map((x) => textOpt(SHAPE[x], x)), textOpt('Verso i vertici di un quadrato', 'altro')];
		why = `Gli ibridi ${name} sono $${n}$ e si dispongono il più lontano possibile l'uno dall'altro: ${SHAPE[h].toLowerCase()}.`;
	}
	return { prompt: 'Scegli la risposta giusta.', problem: textBlock(problem), solution: right.latex, steps: [textBlock(why)], answer: choose(rng, right, others), params: { case: kind, h } };
}

// ---------------------------------------------------------------------------
// Level 2: from the domains to the hybridisation

export const DOMAINS: [number, number][] = [[4, 0], [3, 1], [2, 2], [1, 3], [3, 0], [2, 1], [1, 2], [2, 0], [1, 1]];
const atomsText = (a: number) => (a === 1 ? 'a $1$ atomo' : `a $${a}$ atomi`);
const pairsText = (l: number) => (l === 0 ? 'non ha coppie solitarie' : l === 1 ? 'ha $1$ coppia solitaria' : `ha $${l}$ coppie solitarie`);

function level2(rng: Rng): BuiltG {
	const [a, l] = rng.pick(DOMAINS);
	const h = bySteric(a + l);
	return {
		prompt: "Trova l'ibridazione.",
		problem: textBlock(`Un atomo è legato ${atomsText(a)} e ${pairsText(l)}. Qual è la sua ibridazione?`),
		solution: TEX[h],
		steps: [textBlock(`I domini sono gli atomi legati più le coppie solitarie: $${a} + ${l} = ${a + l}$.`), textBlock(`Con $${a + l}$ domini servono $${a + l}$ orbitali ibridi: l'ibridazione è $${TEX[h]}$.`)],
		answer: hybChoice(rng, h),
		params: { case: l === 0 ? 'senza coppie' : 'con coppie', a, l },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: the central atom of a molecule

interface Centre {
	tex: string;
	/** "del carbonio", "di ciascun carbonio" */
	chi: string;
	/** "Il carbonio", "Ogni carbonio" */
	sogg: string;
	atoms: number;
	lone: number;
	ione?: boolean;
	/** The bonds, when some are multiple: "con due legami doppi". */
	bonds?: string;
}
export const SINGLE: Centre[] = [
	{ tex: 'CH_4', chi: 'del carbonio', sogg: 'Il carbonio', atoms: 4, lone: 0 },
	{ tex: 'CCl_4', chi: 'del carbonio', sogg: 'Il carbonio', atoms: 4, lone: 0 },
	{ tex: 'CF_4', chi: 'del carbonio', sogg: 'Il carbonio', atoms: 4, lone: 0 },
	{ tex: 'CH_3Cl', chi: 'del carbonio', sogg: 'Il carbonio', atoms: 4, lone: 0 },
	{ tex: 'NH_3', chi: "dell'azoto", sogg: "L'azoto", atoms: 3, lone: 1 },
	{ tex: 'NF_3', chi: "dell'azoto", sogg: "L'azoto", atoms: 3, lone: 1 },
	{ tex: 'NH_4^+', chi: "dell'azoto", sogg: "L'azoto", atoms: 4, lone: 0, ione: true },
	{ tex: 'NH_2^-', chi: "dell'azoto", sogg: "L'azoto", atoms: 2, lone: 2, ione: true },
	{ tex: 'H_2O', chi: "dell'ossigeno", sogg: "L'ossigeno", atoms: 2, lone: 2 },
	{ tex: 'OF_2', chi: "dell'ossigeno", sogg: "L'ossigeno", atoms: 2, lone: 2 },
	{ tex: 'H_3O^+', chi: "dell'ossigeno", sogg: "L'ossigeno", atoms: 3, lone: 1, ione: true },
	{ tex: 'BF_3', chi: 'del boro', sogg: 'Il boro', atoms: 3, lone: 0 },
	{ tex: 'BCl_3', chi: 'del boro', sogg: 'Il boro', atoms: 3, lone: 0 },
	{ tex: 'BF_4^-', chi: 'del boro', sogg: 'Il boro', atoms: 4, lone: 0, ione: true },
];
export const MULTIPLE: Centre[] = [
	{ tex: 'CO_2', chi: 'del carbonio', sogg: 'Il carbonio', atoms: 2, lone: 0, bonds: 'con due legami doppi' },
	{ tex: 'CS_2', chi: 'del carbonio', sogg: 'Il carbonio', atoms: 2, lone: 0, bonds: 'con due legami doppi' },
	{ tex: 'HCN', chi: 'del carbonio', sogg: 'Il carbonio', atoms: 2, lone: 0, bonds: 'con un legame singolo e uno triplo' },
	{ tex: 'CH_2O', chi: 'del carbonio', sogg: 'Il carbonio', atoms: 3, lone: 0, bonds: 'con due legami singoli e uno doppio' },
	{ tex: 'COCl_2', chi: 'del carbonio', sogg: 'Il carbonio', atoms: 3, lone: 0, bonds: 'con due legami singoli e uno doppio' },
	{ tex: 'CH_2{=}CH_2', chi: 'di ciascun carbonio', sogg: 'Ogni carbonio', atoms: 3, lone: 0, bonds: 'con due legami singoli e uno doppio' },
	{ tex: 'HC{\\equiv}CH', chi: 'di ciascun carbonio', sogg: 'Ogni carbonio', atoms: 2, lone: 0, bonds: 'con un legame singolo e uno triplo' },
	{ tex: 'CO_3^{2-}', chi: 'del carbonio', sogg: 'Il carbonio', atoms: 3, lone: 0, ione: true, bonds: 'con due legami singoli e uno doppio' },
	{ tex: 'NO_3^-', chi: "dell'azoto", sogg: "L'azoto", atoms: 3, lone: 0, ione: true, bonds: 'e uno dei legami è doppio' },
	{ tex: 'NO_2^-', chi: "dell'azoto", sogg: "L'azoto", atoms: 2, lone: 1, ione: true, bonds: 'con un legame singolo e uno doppio' },
	{ tex: 'HN{=}NH', chi: 'di ciascun azoto', sogg: 'Ogni azoto', atoms: 2, lone: 1, bonds: 'con un legame singolo e uno doppio' },
];

function centre(rng: Rng, c: Centre, kase: string): BuiltG {
	const h = bySteric(c.atoms + c.lone);
	const steps = [
		textBlock(`${c.sogg} è legato ${atomsText(c.atoms)}${c.bonds ? ` ${c.bonds}` : ''}, e ${pairsText(c.lone)}.`),
		textBlock(`${c.bonds ? 'Un legame doppio o triplo conta come un solo dominio. ' : ''}I domini sono $${c.atoms} + ${c.lone} = ${c.atoms + c.lone}$: l'ibridazione è $${TEX[h]}$.`),
	];
	return {
		prompt: "Trova l'ibridazione.",
		problem: textBlock(`Qual è l'ibridazione ${c.chi} ${c.ione ? 'nello ione' : 'nella molecola'} $\\mathrm{${c.tex}}$?`),
		solution: TEX[h],
		steps,
		answer: hybChoice(rng, h),
		params: { case: kase, tex: c.tex },
	};
}

const level3 = (rng: Rng) => {
	const c = rng.pick(SINGLE);
	return centre(rng, c, c.lone ? 'con coppie' : 'senza coppie');
};
const level4 = (rng: Rng) => centre(rng, rng.pick(MULTIPLE), 'multipli');

// ---------------------------------------------------------------------------
// Level 5: the carbons of a chain

export const CHAINS: { tex: string; hyb: Hyb[] }[] = [
	{ tex: 'CH_3{-}CH{=}CH_2', hyb: ['sp3', 'sp2', 'sp2'] },
	{ tex: 'CH_3{-}C{\\equiv}CH', hyb: ['sp3', 'sp', 'sp'] },
	{ tex: 'CH_3{-}CH{=}O', hyb: ['sp3', 'sp2'] },
	{ tex: 'CH_3{-}C{\\equiv}N', hyb: ['sp3', 'sp'] },
	{ tex: 'CH_2{=}CH{-}C{\\equiv}N', hyb: ['sp2', 'sp2', 'sp'] },
	{ tex: 'CH_2{=}CH{-}CH_2{-}CH_3', hyb: ['sp2', 'sp2', 'sp3', 'sp3'] },
	{ tex: 'CH_2{=}C{=}CH_2', hyb: ['sp2', 'sp', 'sp2'] },
	{ tex: 'HC{\\equiv}C{-}CH{=}CH_2', hyb: ['sp', 'sp', 'sp2', 'sp2'] },
	{ tex: 'HC{\\equiv}C{-}CH_2{-}CH_3', hyb: ['sp', 'sp', 'sp3', 'sp3'] },
	{ tex: 'CH_3{-}CH{=}CH{-}CH_3', hyb: ['sp3', 'sp2', 'sp2', 'sp3'] },
	{ tex: 'CH_3{-}C{\\equiv}C{-}CH_3', hyb: ['sp3', 'sp', 'sp', 'sp3'] },
];
const listOpt = (hs: string[]) => texOpt(hs.map((h) => TEX[h]).join(',\\ '), hs.join(','));
const ORD = ['primo', 'secondo', 'terzo', 'quarto'];
const DOMAIN_WORDS: Record<Hyb, string> = { sp3: 'quattro domini', sp2: 'tre domini', sp: 'due domini' };

function level5(rng: Rng): BuiltG {
	const c = rng.pick(CHAINS);
	const up: Record<Hyb, Hyb> = { sp: 'sp2', sp2: 'sp3', sp3: 'sp3' };
	const down: Record<Hyb, Hyb> = { sp: 'sp', sp2: 'sp', sp3: 'sp2' };
	const most = HYBS.map((h) => ({ h, k: c.hyb.filter((x) => x === h).length })).sort((a, b) => b.k - a.k)[0].h;
	const others = [
		listOpt(c.hyb.map(() => most)), // one hybridisation for the whole molecule
		listOpt([...c.hyb].reverse()),
		listOpt(c.hyb.map((h) => up[h])), // a multiple bond counted as two or three domains
		listOpt(c.hyb.map((h) => down[h])),
		listOpt(c.hyb.map(() => 'sp3')),
		listOpt(c.hyb.map((h) => (h === 'sp' ? 'sp2' : h === 'sp2' ? 'sp' : 'sp3'))),
	];
	return {
		prompt: "Trova l'ibridazione di ogni carbonio.",
		problem: textBlock(`Qual è l'ibridazione degli atomi di carbonio della molecola $\\mathrm{${c.tex}}$, da sinistra a destra?`),
		solution: listOpt(c.hyb).latex,
		steps: [
			textBlock("L'ibridazione si assegna a un atomo alla volta, contando i suoi domini: un legame doppio o triplo conta come uno."),
			textBlock(`${c.hyb.map((h, i) => `Il ${ORD[i]} carbonio ha ${DOMAIN_WORDS[h]}: $${TEX[h]}$`).join('. ')}.`),
		],
		answer: choose(rng, listOpt(c.hyb), others),
		params: { case: `${c.hyb.length} carboni`, tex: c.tex },
	};
}

// ---------------------------------------------------------------------------
// Level 6: which orbitals overlap

export const OVERLAPS: { q: string; a: [string, string]; why: string }[] = [
	{ q: 'in un legame $\\mathrm{C{-}H}$ del metano, $\\mathrm{CH_4}$', a: ['sp3', '1s'], why: "Il carbonio del metano è $sp^3$: ogni ibrido si sovrappone all'orbitale $1s$ di un idrogeno." },
	{ q: "in un legame $\\mathrm{N{-}H}$ dell'ammoniaca, $\\mathrm{NH_3}$", a: ['sp3', '1s'], why: "L'azoto ha quattro domini ed è $sp^3$: tre ibridi si sovrappongono agli orbitali $1s$ degli idrogeni, il quarto ospita la coppia solitaria." },
	{ q: "in un legame $\\mathrm{O{-}H}$ dell'acqua, $\\mathrm{H_2O}$", a: ['sp3', '1s'], why: "L'ossigeno ha quattro domini ed è $sp^3$: due ibridi si sovrappongono agli orbitali $1s$ degli idrogeni, gli altri due ospitano le coppie solitarie." },
	{ q: "in un legame $\\mathrm{C{-}H}$ dell'etene, $\\mathrm{CH_2{=}CH_2}$", a: ['sp2', '1s'], why: "Ogni carbonio dell'etene ha tre domini ed è $sp^2$: un ibrido si sovrappone all'orbitale $1s$ dell'idrogeno." },
	{ q: "in un legame $\\mathrm{C{-}H}$ dell'etino, $\\mathrm{HC{\\equiv}CH}$", a: ['sp', '1s'], why: "Ogni carbonio dell'etino ha due domini ed è $sp$: un ibrido si sovrappone all'orbitale $1s$ dell'idrogeno." },
	{ q: "nel legame $\\sigma$ tra i due carboni dell'etano, $\\mathrm{CH_3{-}CH_3}$", a: ['sp3', 'sp3'], why: "Ogni carbonio dell'etano ha quattro domini ed è $sp^3$: il legame $\\sigma$ è tra due ibridi $sp^3$." },
	{ q: "nel legame $\\sigma$ tra i due carboni dell'etene, $\\mathrm{CH_2{=}CH_2}$", a: ['sp2', 'sp2'], why: "Ogni carbonio dell'etene è $sp^2$: il legame $\\sigma$ del doppio legame è tra due ibridi $sp^2$." },
	{ q: "nel legame $\\sigma$ tra i due carboni dell'etino, $\\mathrm{HC{\\equiv}CH}$", a: ['sp', 'sp'], why: "Ogni carbonio dell'etino è $sp$: il legame $\\sigma$ del triplo legame è tra due ibridi $sp$." },
	{ q: "nel legame $\\pi$ dell'etene, $\\mathrm{CH_2{=}CH_2}$", a: ['p', 'p'], why: 'I legami $\\pi$ si fanno con gli orbitali $p$ non ibridati: uno per carbonio, paralleli, sovrapposti di fianco.' },
	{ q: "in uno dei legami $\\pi$ dell'etino, $\\mathrm{HC{\\equiv}CH}$", a: ['p', 'p'], why: 'I legami $\\pi$ si fanno con gli orbitali $p$ non ibridati: ogni carbonio $sp$ ne ha due.' },
	{ q: 'nel legame tra il primo e il secondo carbonio del propene, $\\mathrm{CH_3{-}CH{=}CH_2}$', a: ['sp3', 'sp2'], why: 'Il primo carbonio ha quattro domini ed è $sp^3$, il secondo ne ha tre ed è $sp^2$: il legame $\\sigma$ è tra un ibrido $sp^3$ e un ibrido $sp^2$.' },
	{ q: 'nel legame tra il primo e il secondo carbonio del propino, $\\mathrm{CH_3{-}C{\\equiv}CH}$', a: ['sp3', 'sp'], why: 'Il primo carbonio ha quattro domini ed è $sp^3$, il secondo ne ha due ed è $sp$: il legame $\\sigma$ è tra un ibrido $sp^3$ e un ibrido $sp$.' },
];
const pairOpt = (x: string, y: string) => texOpt(`${TEX[x]}\\text{ e }${TEX[y]}`, `${x}-${y}`);

function level6(rng: Rng): BuiltG {
	const k = rng.int(0, OVERLAPS.length - 1);
	const o = OVERLAPS[k];
	const [x, y] = o.a;
	let others: ChoiceOption[];
	if (y === '1s') others = [...HYBS.filter((h) => h !== x).map((h) => pairOpt(h, '1s')), pairOpt('p', '1s')];
	else if (x === 'p') others = shuffled(rng, HYBS).map((h) => pairOpt(h, h));
	else if (x === y) others = [...HYBS.filter((h) => h !== x).map((h) => pairOpt(h, h)), pairOpt('p', 'p')];
	else others = [pairOpt(x, x), pairOpt(y, y), pairOpt(x, 'p'), pairOpt('p', 'p')];
	return {
		prompt: 'Scegli gli orbitali.',
		problem: textBlock(`Quali orbitali si sovrappongono ${o.q}?`),
		solution: pairOpt(x, y).latex,
		steps: [textBlock(o.why)],
		answer: choose(rng, pairOpt(x, y), others),
		params: { case: x === 'p' ? 'pi' : y === '1s' ? 'con H' : 'tra carboni', k },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => BuiltG> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkG(sample);
}

export const chimIbridazione: Generator = {
	id: ID,
	title: "L'ibridazione degli orbitali",
	levels: {
		1: { label: 'I tre tipi di orbitali ibridi', constraints: ['quanti, che angolo, quali orbitali, quanti p rimasti'] },
		2: { label: "Dai domini all'ibridazione", constraints: ['atomi legati più coppie solitarie, da 2 a 4'] },
		3: { label: "L'atomo centrale con legami singoli", constraints: ['B, C, N, O come atomo centrale', 'le coppie solitarie vanno trovate'] },
		4: { label: "L'atomo centrale con legami multipli", constraints: ['un doppio o un triplo conta come un dominio'] },
		5: { label: 'I carboni di una catena', constraints: ['da due a quattro carboni, da sinistra a destra'] },
		6: { label: 'Quali orbitali formano il legame', constraints: ['ibridi per i σ, orbitali p per i π'] },
	},
	generate: generateG(ID, LEVELS, check),
	check,
	toChoice: toChoiceG,
};

export default chimIbridazione;
