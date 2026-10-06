/**
 * Radioattività e decadimenti. Spec: specs/exercises/chim-radioattivita.md
 *
 * Six levels in the order of the lesson (docs/lezioni/chimica/riscritte/54-chim-radioattivita.md), each one step
 * harder: the daughter of an α decay; of a β⁻ decay; of a β⁺ decay or an electron capture; the particle emitted, given
 * parent and daughter; the decay to expect from an isotope that lies above or below the stable ones of its element;
 * how many α or β⁻ decays lead from one nuclide of a natural family to a later one.
 *
 * Every nuclide is real and decays the way the exercise says: decay modes from NUBASE2020 (Kondev et al., Chinese
 * Physics C 45, 030001, 2021), pure modes only (at least 99,9%), except the classic β⁺ emitters, which also capture
 * electrons. Distractors from the lesson's warnings: Z lowered in a β⁻ decay, A changed in a β decay, only A or only
 * Z changed in an α decay, α and β⁻ counts mixed up.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, type Decay, ALPHA, ELECTRON, POSITRON, SHIFT, checkSample, choose, generateWith, intOpt, isoName, nuc, nucOpt, redraw, some, texOpt, textBlock } from '../chim3-c';

export const ID = 'chim-radioattivita';

type Nuclide = [Z: number, A: number];

/** α emitters (Z, A). */
export const ALPHA_EMITTERS: Nuclide[] = [
	[60, 144], [62, 146], [62, 147], [64, 148], [83, 211], [84, 208], [84, 210], [84, 218], [86, 219], [86, 220], [86, 222], [87, 221], [88, 223], [88, 224], [88, 226], [89, 225],
	[90, 228], [90, 229], [90, 230], [90, 232], [91, 231], [92, 234], [92, 235], [92, 236], [92, 238], [93, 237], [94, 238], [94, 239], [94, 240], [94, 242], [95, 241], [95, 243], [96, 245], [96, 246], [96, 247],
];
/** β⁻ emitters. */
export const BETA_MINUS_EMITTERS: Nuclide[] = [
	[1, 3], [6, 14], [7, 16], [9, 20], [10, 23], [11, 24], [12, 27], [14, 31], [15, 32], [15, 33], [16, 35], [18, 41], [19, 42], [20, 45], [26, 59], [27, 60], [28, 63], [36, 85], [38, 89], [38, 90], [39, 90],
	[40, 95], [42, 99], [43, 99], [44, 106], [47, 111], [50, 121], [53, 131], [54, 133], [55, 137], [56, 140], [57, 140], [58, 144], [61, 147], [63, 154], [65, 160], [73, 182], [74, 187], [76, 191], [79, 198],
	[80, 203], [81, 208], [82, 210], [82, 212], [82, 214], [83, 210], [88, 228], [89, 228], [90, 231], [90, 234], [91, 234], [92, 239], [93, 239],
];
/** β⁺ emitters (light nuclei with too many protons, where positron emission prevails). */
export const BETA_PLUS_EMITTERS: Nuclide[] = [
	[6, 10], [6, 11], [7, 13], [8, 14], [8, 15], [9, 17], [9, 18], [10, 19], [11, 21], [11, 22], [12, 23], [13, 25], [14, 27], [15, 30], [16, 31], [17, 33], [18, 35], [19, 38], [20, 39], [21, 43], [25, 52], [31, 68], [37, 82],
];
/** Nuclides that decay by electron capture only. */
export const CAPTURE_NUCLIDES: Nuclide[] = [
	[4, 7], [18, 37], [20, 41], [22, 44], [23, 49], [24, 51], [25, 53], [25, 54], [26, 55], [27, 57], [31, 67], [32, 68], [32, 71], [33, 73], [34, 72], [34, 75], [36, 81], [37, 83], [38, 82], [38, 85], [46, 103], [48, 109], [49, 111],
	[53, 125], [55, 131], [56, 133],
];
/** Excited nuclei that emit a γ ray and stay the same nuclide. */
export const GAMMA_EMITTERS: Nuclide[] = [[43, 99], [56, 137]];

const daughter = ([Z, A]: Nuclide, d: Decay): Nuclide => [Z + SHIFT[d].dZ, A + SHIFT[d].dA];
const nucOptOf = ([Z, A]: Nuclide) => (Z >= 1 && Z <= 96 && A >= 1 ? nucOpt(Z, A) : null);
/** "Completa: X → Y + ?" as one formula line. */
const arrow = (left: string, right: string) => `${left} \\longrightarrow ${right}`;

// ---------------------------------------------------------------------------
// Level 1: α

function level1(rng: Rng): Built {
	const p = rng.pick(ALPHA_EMITTERS);
	const [Z, A] = p;
	const d = daughter(p, 'alfa');
	return {
		prompt: 'Trova il nucleo figlio.',
		problem: textBlock(`Un nucleo di ${isoName(Z, A)}, $${nuc(Z, A)}$, emette una particella $\\alpha$. Qual è il nucleo figlio?`),
		solution: arrow(nuc(Z, A), `${nuc(d[0], d[1])} + ${ALPHA}`),
		steps: [
			textBlock(`La particella $\\alpha$ è un nucleo di elio, $${ALPHA}$: porta via $4$ nucleoni, di cui $2$ protoni.`),
			`A = ${A} - 4 = ${d[1]} \\qquad Z = ${Z} - 2 = ${d[0]}`,
			textBlock(`L'elemento con $Z = ${d[0]}$ è ${nameOf(d[0])}.`),
		],
		// only A lowered; A by 2 and Z by 4 (swapped); Z raised by 2; A by 4 and Z by 1; a β⁻ instead
		answer: choose(rng, nucOpt(d[0], d[1]), some([nucOptOf([Z, A - 4]), nucOptOf([Z - 4, A - 2]), nucOptOf([Z + 2, A - 4]), nucOptOf([Z - 2, A]), nucOptOf([Z - 1, A - 4]), nucOptOf([Z + 1, A])])),
		params: { case: 'alfa', Z, A },
	};
}

/** "il radon", "lo xeno", "l'azoto": the article that an element's name takes. */
function nameOf(Z: number): string {
	const n = isoName(Z, 0).replace(/-0$/, '');
	if (/^[aeiou]/.test(n) && !/^io/.test(n)) return `l'${n}`;
	if (/^(z|x|io|s[^aeiou]|gn|ps)/.test(n)) return `lo ${n}`;
	return `il ${n}`;
}

// ---------------------------------------------------------------------------
// Level 2: β⁻

function level2(rng: Rng): Built {
	const p = rng.pick(BETA_MINUS_EMITTERS);
	const [Z, A] = p;
	const d = daughter(p, 'beta-');
	return {
		prompt: 'Trova il nucleo figlio.',
		problem: textBlock(`Un nucleo di ${isoName(Z, A)}, $${nuc(Z, A)}$, decade $\\beta^-$. Qual è il nucleo figlio?`),
		solution: arrow(nuc(Z, A), `${nuc(d[0], d[1])} + ${ELECTRON}`),
		steps: [
			textBlock(`Nel decadimento $\\beta^-$ un neutrone diventa un protone, e il nucleo emette un elettrone, $${ELECTRON}$.`),
			textBlock(`Il numero di massa non cambia, $A = ${A}$; il numero atomico aumenta di $1$: $Z = ${Z} + 1 = ${d[0]}$, cioè ${nameOf(d[0])}.`),
		],
		// Z lowered (the commonest mistake); A lowered by 1; both lowered; A lowered and Z raised; an α instead
		answer: choose(rng, nucOpt(d[0], d[1]), some([nucOptOf([Z - 1, A]), nucOptOf([Z, A - 1]), nucOptOf([Z + 1, A - 1]), nucOptOf([Z - 1, A - 1]), nucOptOf([Z + 1, A + 1]), nucOptOf([Z - 2, A - 4])])),
		params: { case: 'beta-', Z, A },
	};
}

// ---------------------------------------------------------------------------
// Level 3: β⁺ and electron capture

function level3(rng: Rng): Built {
	const capture = rng.next() < 0.5;
	const p = rng.pick(capture ? CAPTURE_NUCLIDES : BETA_PLUS_EMITTERS);
	const [Z, A] = p;
	const d = daughter(p, 'beta+');
	return {
		prompt: 'Trova il nucleo figlio.',
		problem: textBlock(`Un nucleo di ${isoName(Z, A)}, $${nuc(Z, A)}$, ${capture ? 'decade per cattura elettronica' : 'decade $\\beta^+$'}. Qual è il nucleo figlio?`),
		solution: capture ? arrow(`${nuc(Z, A)} + ${ELECTRON}`, nuc(d[0], d[1])) : arrow(nuc(Z, A), `${nuc(d[0], d[1])} + ${POSITRON}`),
		steps: [
			textBlock(capture ? `Nella cattura elettronica il nucleo cattura un elettrone, $${ELECTRON}$, e un protone diventa un neutrone.` : `Nel decadimento $\\beta^+$ un protone diventa un neutrone, e il nucleo emette un positrone, $${POSITRON}$.`),
			textBlock(`Il numero di massa non cambia, $A = ${A}$; il numero atomico diminuisce di $1$: $Z = ${Z} - 1 = ${d[0]}$, cioè ${nameOf(d[0])}.`),
		],
		// Z raised, as in a β⁻; A raised by 1 (the electron counted as a nucleon); A lowered by 1; both lowered
		answer: choose(rng, nucOpt(d[0], d[1]), some([nucOptOf([Z + 1, A]), nucOptOf([Z - 1, A + 1]), nucOptOf([Z, A - 1]), nucOptOf([Z - 1, A - 1]), nucOptOf([Z, A + 1]), nucOptOf([Z + 1, A + 1])])),
		params: { case: capture ? 'cattura' : 'beta+', Z, A },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the particle emitted

const PARTICLE_OPTIONS = {
	alfa: texOpt(`${ALPHA}\\ (\\alpha)`, 'alfa'),
	'beta-': texOpt(`${ELECTRON}\\ (\\beta^-)`, 'beta-'),
	'beta+': texOpt(`${POSITRON}\\ (\\beta^+)`, 'beta+'),
	gamma: texOpt('\\gamma', 'gamma'),
} as const;
type Emitted = keyof typeof PARTICLE_OPTIONS;

function level4(rng: Rng): Built {
	const r = rng.next();
	const kind: Emitted = r < 0.3 ? 'alfa' : r < 0.6 ? 'beta-' : r < 0.9 ? 'beta+' : 'gamma';
	const p = rng.pick(kind === 'alfa' ? ALPHA_EMITTERS : kind === 'beta-' ? BETA_MINUS_EMITTERS : kind === 'beta+' ? BETA_PLUS_EMITTERS : GAMMA_EMITTERS);
	const [Z, A] = p;
	const d = daughter(p, kind);
	const left = nuc(Z, A, kind === 'gamma');
	const why: Record<Emitted, string> = {
		alfa: `In alto mancano $${A} - ${d[1]} = 4$, in basso $${Z} - ${d[0]} = 2$: la particella è $${ALPHA}$, un nucleo di elio.`,
		'beta-': `In alto non manca niente, $${A} - ${d[1]} = 0$; in basso $${Z} - ${d[0]} = -1$: la particella è $${ELECTRON}$, un elettrone.`,
		'beta+': `In alto non manca niente, $${A} - ${d[1]} = 0$; in basso $${Z} - ${d[0]} = +1$: la particella è $${POSITRON}$, un positrone.`,
		gamma: `Non cambiano né $A$ né $Z$: il nucleo ha perso solo energia, emettendo un raggio $\\gamma$.`,
	};
	return {
		prompt: 'Riconosci la particella emessa.',
		problem: textBlock('Quale particella completa questa equazione nucleare?', 46, [`${arrow(left, nuc(d[0], d[1]))} + \\ ?`]),
		solution: arrow(left, `${nuc(d[0], d[1])} + ${kind === 'alfa' ? ALPHA : kind === 'beta-' ? ELECTRON : kind === 'beta+' ? POSITRON : '\\gamma'}`),
		steps: [textBlock('La somma dei numeri in alto e quella dei numeri in basso sono uguali ai due lati della freccia.'), textBlock(why[kind])],
		answer: choose(rng, PARTICLE_OPTIONS[kind], (Object.keys(PARTICLE_OPTIONS) as Emitted[]).filter((k) => k !== kind).map((k) => PARTICLE_OPTIONS[k])),
		params: { case: kind, Z, A },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the decay to expect

/** Mass numbers of the stable isotopes of some elements (NUBASE2020), by Z. */
export const STABLE: Record<number, number[]> = {
	6: [12, 13], 7: [14, 15], 8: [16, 17, 18], 9: [19], 10: [20, 21, 22], 11: [23], 12: [24, 25, 26], 13: [27], 14: [28, 29, 30], 15: [31], 16: [32, 33, 34, 36], 17: [35, 37], 18: [36, 38, 40],
	21: [45], 22: [46, 47, 48, 49, 50], 24: [50, 52, 53, 54], 25: [55], 26: [54, 56, 57, 58], 27: [59], 28: [58, 60, 61, 62, 64], 29: [63, 65], 30: [64, 66, 67, 68, 70], 31: [69, 71], 33: [75], 35: [79, 81],
	36: [78, 80, 82, 83, 84, 86], 38: [84, 86, 87, 88],
};
/** Radioactive isotopes one or two mass units outside the stable ones: [Z, A, above the stable ones?]. */
export const OUTSIDE: [number, number, boolean][] = [
	[6, 10, false], [6, 11, false], [6, 14, true], [6, 15, true], [7, 13, false], [7, 16, true], [7, 17, true], [8, 14, false], [8, 15, false], [8, 19, true], [8, 20, true], [9, 17, false], [9, 18, false], [9, 20, true], [9, 21, true],
	[10, 18, false], [10, 19, false], [10, 23, true], [10, 24, true], [11, 21, false], [11, 22, false], [11, 24, true], [11, 25, true], [12, 22, false], [12, 23, false], [12, 27, true], [12, 28, true],
	[13, 25, false], [13, 26, false], [13, 28, true], [13, 29, true], [14, 26, false], [14, 27, false], [14, 31, true], [14, 32, true], [15, 29, false], [15, 30, false], [15, 32, true], [15, 33, true],
	[16, 30, false], [16, 31, false], [16, 37, true], [16, 38, true], [17, 33, false], [17, 34, false], [17, 38, true], [17, 39, true], [18, 35, false], [18, 41, true], [18, 42, true],
	[21, 43, false], [21, 44, false], [21, 46, true], [21, 47, true], [22, 44, false], [22, 45, false], [22, 51, true], [22, 52, true], [24, 48, false], [24, 49, false], [24, 55, true], [24, 56, true],
	[25, 53, false], [25, 54, false], [25, 56, true], [25, 57, true], [26, 52, false], [26, 53, false], [26, 59, true], [26, 60, true], [27, 57, false], [27, 58, false], [27, 60, true], [27, 61, true],
	[28, 56, false], [28, 57, false], [28, 65, true], [28, 66, true], [29, 61, false], [29, 62, false], [29, 66, true], [29, 67, true], [30, 62, false], [30, 63, false], [30, 71, true], [30, 72, true],
	[31, 67, false], [31, 68, false], [31, 72, true], [31, 73, true], [33, 73, false], [33, 76, true], [33, 77, true], [35, 77, false], [35, 78, false], [35, 82, true], [35, 83, true],
	[36, 76, false], [36, 77, false], [36, 87, true], [36, 88, true], [38, 82, false], [38, 83, false], [38, 89, true], [38, 90, true],
];

const EXPECT_OPTIONS = {
	'beta-': texOpt('\\beta^-', 'beta-'),
	'beta+': texOpt('\\begin{gathered} \\beta^+ \\text{ o cattura} \\\\ \\text{elettronica} \\end{gathered}', 'beta+'),
	alfa: texOpt('\\alpha', 'alfa'),
	gamma: texOpt('\\gamma', 'gamma'),
} as const;

function level5(rng: Rng): Built {
	const above = rng.next() < 0.5;
	const [Z, A] = rng.pick(OUTSIDE.filter((o) => o[2] === above));
	const stable = STABLE[Z];
	const list = stable.length === 1 ? `$${stable[0]}$` : `${stable.slice(0, -1).map((a) => `$${a}$`).join(', ')} e $${stable.at(-1)}$`;
	const N = A - Z;
	const nStable = stable.map((a) => a - Z);
	const range = nStable.length === 1 ? `$${nStable[0]}$` : `da $${nStable[0]}$ a $${nStable.at(-1)}$`;
	const right = above ? 'beta-' : 'beta+';
	return {
		prompt: 'Prevedi il decadimento.',
		problem: textBlock(`Gli isotopi stabili dell'elemento con $Z = ${Z}$ hanno numero di massa ${list}. Quale decadimento ti aspetti dal nucleo $${nuc(Z, A)}$?`),
		solution: EXPECT_OPTIONS[right].latex,
		steps: [
			textBlock(`Il nucleo $${nuc(Z, A)}$ ha $${A} - ${Z} = ${N}$ neutroni; gli isotopi stabili ne hanno ${range}.`),
			textBlock(
				above
					? 'Ha troppi neutroni, sta sopra la fascia di stabilità: trasforma un neutrone in un protone con un decadimento $\\beta^-$.'
					: 'Ha troppo pochi neutroni, sta sotto la fascia di stabilità: trasforma un protone in un neutrone con un decadimento $\\beta^+$ o con una cattura elettronica.',
			),
		],
		answer: choose(rng, EXPECT_OPTIONS[right], (Object.keys(EXPECT_OPTIONS) as (keyof typeof EXPECT_OPTIONS)[]).filter((k) => k !== right).map((k) => EXPECT_OPTIONS[k])),
		params: { case: above ? 'troppi neutroni' : 'pochi neutroni', Z, A },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the natural families

/** The three natural families: the head and the decays of the main branch, a for α and b for β⁻. */
export const FAMILIES: { head: Nuclide; path: string }[] = [
	{ head: [92, 238], path: 'abbaaaaabbabba' },
	{ head: [92, 235], path: 'ababaaaabab' },
	{ head: [90, 232], path: 'abbaaaabba' },
];

function level6(rng: Rng): Built {
	const fam = rng.pick(FAMILIES);
	const chain: Nuclide[] = [fam.head];
	for (const c of fam.path) chain.push(daughter(chain[chain.length - 1], c === 'a' ? 'alfa' : 'beta-'));
	const i = rng.int(0, chain.length - 4);
	const j = rng.int(i + 3, chain.length - 1);
	const [Zi, Ai] = chain[i], [Zf, Af] = chain[j];
	const nA = (Ai - Af) / 4;
	const nB = Zf - (Zi - 2 * nA);
	if (nA < 2 || nB < 1) redraw();
	const askAlpha = rng.next() < 0.5;
	const right = askAlpha ? nA : nB;
	// α: the mass numbers divided by 2, the atomic numbers divided by 2, the two counts swapped;
	// β⁻: the plain difference of the atomic numbers, the α count, twice the α count
	const wrong = askAlpha ? [(Ai - Af) / 2, Math.abs(Zi - Zf) / 2, nB, Ai - Af, nA + 1, nA - 1, nA + 2] : [Math.abs(Zi - Zf), nA, 2 * nA, nB + nA, nB + 1, nB - 1, nB + 2];
	return {
		prompt: `Conta i decadimenti ${askAlpha ? 'alfa' : 'beta meno'}.`,
		problem: textBlock(
			`In una famiglia radioattiva un nucleo $${nuc(Zi, Ai)}$ diventa $${nuc(Zf, Af)}$ con una serie di decadimenti $\\alpha$ e $\\beta^-$. Quanti sono i decadimenti ${askAlpha ? '$\\alpha$' : '$\\beta^-$'}?`,
		),
		solution: String(right),
		steps: [
			textBlock(`Solo i decadimenti $\\alpha$ cambiano il numero di massa, di $4$ ogni volta: sono $(${Ai} - ${Af}) : 4 = ${nA}$.`),
			...(askAlpha ? [] : [textBlock(`I $${nA}$ decadimenti $\\alpha$ portano $Z$ a $${Zi} - ${2 * nA} = ${Zi - 2 * nA}$. Ogni $\\beta^-$ lo aumenta di $1$: ne servono $${Zf} - ${Zi - 2 * nA} = ${nB}$.`)]),
		],
		answer: choose(rng, intOpt(right), wrong.filter((x) => Number.isInteger(x) && x >= 0).map(intOpt)),
		params: { case: askAlpha ? 'alfa' : 'beta-', Zi, Ai, Zf, Af },
		open: String(right),
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkSample(sample);
}

export const chimRadioattivita: Generator = {
	id: ID,
	title: 'Radioattività e decadimenti',
	levels: {
		1: { label: 'Il decadimento alfa', constraints: ['un emettitore α vero; il nucleo figlio ha A − 4 e Z − 2'] },
		2: { label: 'Il decadimento beta meno', constraints: ['un emettitore β⁻ vero; il nucleo figlio ha lo stesso A e Z + 1'] },
		3: { label: 'Beta più e cattura elettronica', constraints: ['metà β⁺, metà cattura elettronica; il nucleo figlio ha lo stesso A e Z − 1'] },
		4: { label: 'La particella emessa', constraints: ['α, β⁻, β⁺ o γ da nucleo padre e nucleo figlio'] },
		5: { label: 'Prevedere il decadimento', constraints: ['un isotopo a una o due unità di massa dagli isotopi stabili: β⁻ sopra, β⁺ o cattura sotto'] },
		6: { label: 'Le famiglie radioattive', constraints: ['un tratto di una famiglia naturale con almeno due α e un β⁻; si conta un tipo di decadimento'] },
	},
	generate: generateWith(ID, LEVELS, check),
	// a level answered with a number keeps its four options in the sample
	toChoice: (sample) => {
		if (sample.answer.kind === 'choice') return sample.answer;
		if (!sample.choice) throw new Error(`${ID}: the sample has no multiple-choice form`);
		return sample.choice;
	},
	check,
};

export default chimRadioattivita;
