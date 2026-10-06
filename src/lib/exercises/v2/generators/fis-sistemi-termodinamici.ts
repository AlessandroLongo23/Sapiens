/**
 * Sistemi termodinamici e principio zero. Spec: specs/exercises/fis-sistemi-termodinamici.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/107-fis-sistemi-termodinamici.md), questions of
 * reasoning on generated cases more than of calculation: what a system exchanges with its surroundings (open, closed,
 * isolated); the temperature of a state read off the pressure-volume plane, T = pV / (nR) (scene `piano-pv`, of group
 * 41); what happens to two gases on the two sides of a wall, according to whether the wall can move and whether it
 * conducts heat (mechanical and thermal equilibrium); the zeroth law, with a thermometer or a third body; where a
 * free conducting piston stops between two gases, V_1 / V_2 = n_1 / n_2. Multiple choice; the wrong options are the
 * lesson's mistakes: closed taken for isolated, a wall that cannot move moved, equal temperature taken for equal
 * pressure.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, R_GAS, approx, checkCommon, fx, generateWith, labelOptions, noZero, options, pu, round, t, tex, textBlock, wu } from '../fis-cinetica';

export const ID = 'fis-sistemi-termodinamici';

const R_NOTE = '($R = 8{,}31\\,\\text{J/(mol}\\cdot\\text{K)}$)';
const must = (x: number, s: number) => {
	const v = round(x, s);
	if (!v) throw new Error('rounding refused');
	return tex(v);
};

// ---------------------------------------------------------------------------
// Level 1: what the system exchanges

const EXCHANGE = { aperto: 'materia ed energia', chiuso: 'solo energia', isolato: 'né materia né energia' } as const;
const ONLY_MATTER = 'solo materia';
type Kind = keyof typeof EXCHANGE;

const SYSTEMS: { what: string; kind: Kind; why: string }[] = [
	{ what: "l'acqua che bolle in una pentola senza coperchio", kind: 'aperto', why: 'Riceve calore dal fornello e perde vapore.' },
	{ what: 'una tazza di tè fumante', kind: 'aperto', why: "Cede calore all'aria e perde vapore." },
	{ what: 'una persona che corre', kind: 'aperto', why: 'Respira e suda, e scambia calore con l’aria.' },
	{ what: 'la legna che brucia in un camino', kind: 'aperto', why: 'Prende aria, manda via fumo e cede calore.' },
	{ what: "il motore acceso di un'auto", kind: 'aperto', why: 'Prende aria e benzina, scarica i gas e cede calore e lavoro.' },
	{ what: 'una pozzanghera al sole', kind: 'aperto', why: "Riceve calore dal sole e perde l'acqua che evapora." },
	{ what: "l'aria in un palloncino annodato lasciato al sole", kind: 'chiuso', why: 'Il gas non esce, ma riceve calore e gonfiandosi compie lavoro.' },
	{ what: 'una lattina sigillata lasciata al sole', kind: 'chiuso', why: 'La bibita non esce, ma si scalda.' },
	{ what: 'il gas in un cilindro chiuso da un pistone a tenuta', kind: 'chiuso', why: 'Il gas non esce, ma scambia calore e lavoro.' },
	{ what: "l'acqua in una bottiglia tappata messa in frigorifero", kind: 'chiuso', why: "L'acqua non esce, ma cede calore." },
	{ what: 'una borsa del ghiaccio sigillata appoggiata su un ginocchio', kind: 'chiuso', why: 'Niente esce, ma la borsa assorbe calore.' },
	{ what: "l'acqua in una pentola a pressione chiusa, sul fuoco, prima che la valvola fischi", kind: 'chiuso', why: 'Il vapore non esce, ma la pentola riceve calore.' },
	{ what: 'il tè in un thermos perfetto, ben chiuso', kind: 'isolato', why: 'Il tappo trattiene la materia e le pareti non lasciano passare il calore.' },
	{ what: "l'acqua in un calorimetro ideale, chiuso", kind: 'isolato', why: 'Niente entra e niente esce, nemmeno il calore.' },
	{ what: 'un gas in un recipiente rigido, sigillato, con le pareti adiabatiche', kind: 'isolato', why: 'Non passa materia, non passa calore e nessuna parete si sposta.' },
	{ what: 'il ghiaccio e la bibita in un contenitore termico perfetto, chiuso', kind: 'isolato', why: "Si scambiano calore tra loro, ma con l'esterno niente." },
];

function level1(rng: Rng): Built {
	const s = rng.pick(SYSTEMS);
	const right = EXCHANGE[s.kind];
	const wrong = [...Object.values(EXCHANGE).filter((x) => x !== right), ONLY_MATTER];
	return {
		prompt: 'Scegli che cosa scambia il sistema.',
		problem: textBlock(`Considera come sistema ${s.what}. Che cosa scambia con l'ambiente?`),
		solution: t(`Scambia ${right}: è un sistema ${s.kind}.`),
		steps: [t(s.why), t(`Un sistema che scambia ${right} è un sistema ${s.kind}.`)],
		answer: labelOptions(rng, [right, ...wrong]),
		params: { case: s.kind, sistema: s.what },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the temperature of a state read off the plane

function level2(rng: Rng): Built {
	for (;;) {
		const V = rng.int(2, 8); // litres
		const p = 50 * rng.int(2, 8); // kilopascal
		const n = noZero(rng, 101, 499) / 1000;
		const T = (p * V) / (n * R_GAS);
		if (T < 150 || T > 900) continue;
		const nTex = fx(n, 3);
		return {
			prompt: 'Trova la temperatura dello stato A.',
			problem: textBlock(`Il punto A della figura è lo stato di ${pu(nTex, 'mol')} di gas perfetto. Qual è la temperatura del gas? ${R_NOTE}`),
			solution: `T \\approx ${wu(must(T, 3), 'K')}`,
			steps: [
				t('Dal grafico:') + ` \\; V = ${wu(String(V), 'L')} = ${V} \\cdot 10^{-3}\\,\\text{m}^3, \\quad p = ${wu(String(p), 'kPa')} = ${p} \\cdot 10^{3}\\,\\text{Pa}`,
				`T = \\dfrac{p\\,V}{n\\,R} = \\dfrac{${p} \\cdot 10^{3} \\cdot ${V} \\cdot 10^{-3}}{${nTex} \\cdot 8{,}31}\\,\\text{K} ${approx(T, 'K', 3)}`,
			],
			// R forgotten; 273 taken away from the kelvin; the moles on the wrong side
			answer: options(rng, T, [(p * V) / n, T - 273, (p * V * n) / R_GAS], 'K', 3),
			params: { case: 'stato', V, p, n: String(n) },
			scene: {
				type: 'piano-pv',
				data: { V: { unita: 'L', passo: 1, celle: 9, etichette: 1 }, p: { unita: 'kPa', passo: 50, celle: 9, etichette: 2 }, stati: [{ nome: 'A', V, p }], tratti: [] },
				alt: `Il piano pressione-volume con il punto A a ${V} litri e ${p} kilopascal`,
			},
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: two gases and a wall

const HAPPENS = ['Niente: sono in equilibrio', 'Si sposta solo la parete', 'Passa solo calore', 'La parete si sposta e passa calore'] as const;
const WALLS = [
	{ name: 'mobile e conduttrice', moves: true, conducts: true },
	{ name: 'fissa e conduttrice', moves: false, conducts: true },
	{ name: 'mobile e isolante', moves: true, conducts: false },
	{ name: 'fissa e isolante', moves: false, conducts: false },
] as const;

function level3(rng: Rng): Built {
	// the answer first, so that the four come out equally often; then one of the walls and data that give it
	const target = rng.int(0, 3);
	const ways = WALLS.flatMap((w) => [true, false].flatMap((sp) => [true, false].map((st) => ({ w, sp, st })))).filter(({ w, sp, st }) => (w.moves && !sp ? 1 : 0) + (w.conducts && !st ? 2 : 0) === [0, 1, 2, 3][target]);
	const { w: wall, sp: samePressure, st: sameTemperature } = rng.pick(ways);
	const p1 = noZero(rng, 81, 299);
	const p2 = samePressure ? p1 : noZero(rng, 81, 299);
	const T1 = noZero(rng, 251, 449);
	const T2 = sameTemperature ? T1 : noZero(rng, 251, 449);
	if ((!samePressure && Math.abs(p1 - p2) < 20) || (!sameTemperature && Math.abs(T1 - T2) < 20)) throw new Error('too close');
	const moves = wall.moves && p1 !== p2, heat = wall.conducts && T1 !== T2;
	const right = HAPPENS[moves && heat ? 3 : moves ? 1 : heat ? 2 : 0];
	const mech = p1 === p2 ? 'Le pressioni sono uguali: sulla parete le forze si equilibrano.' : wall.moves ? `Le pressioni sono diverse e la parete è mobile: si sposta verso il gas a pressione più bassa, a ${p1 < p2 ? 'sinistra' : 'destra'}.` : 'Le pressioni sono diverse, ma la parete è fissa: non si sposta.';
	const therm = T1 === T2 ? 'Le temperature sono uguali: c’è equilibrio termico.' : wall.conducts ? `Le temperature sono diverse e la parete conduce: il calore passa dal gas più caldo, a ${T1 > T2 ? 'sinistra' : 'destra'}, all'altro.` : 'Le temperature sono diverse, ma la parete è isolante: il calore non passa.';
	return {
		prompt: 'Scegli che cosa succede.',
		problem: textBlock(`Due gas sono separati da una parete ${wall.name}. A sinistra la pressione è ${pu(String(p1), 'kPa')} e la temperatura ${pu(String(T1), 'K')}; a destra ${pu(String(p2), 'kPa')} e ${pu(String(T2), 'K')}. Che cosa succede?`),
		solution: t(right),
		steps: [t(mech), t(therm)],
		answer: labelOptions(rng, [right, ...HAPPENS.filter((x) => x !== right)]),
		params: { case: right, parete: wall.name, p1, p2, T1, T2 },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the zeroth law

const HEAT = ['Non passa calore', 'Passa calore da A a B', 'Passa calore da B ad A', 'Passa calore, ma non si sa in che verso'] as const;

function level4(rng: Rng): Built {
	const r = rng.next();
	const ask = 'Poi A e B vengono messi a contatto. Che cosa succede?';
	if (r < 0.2) {
		const both = rng.next() < 0.5;
		const right = both ? HEAT[0] : HEAT[3];
		return {
			prompt: 'Scegli che cosa succede.',
			problem: textBlock(both ? `Il corpo A è in equilibrio termico con un terzo corpo C, e anche il corpo B lo è. ${ask}` : `Il corpo A è in equilibrio termico con un terzo corpo C; il corpo B, messo a contatto con C, non lo è. ${ask}`),
			solution: t(right),
			steps: both
				? [t('Per il principio zero, due corpi in equilibrio termico con un terzo lo sono anche tra loro.'), t('A e B hanno la stessa temperatura: non si scambiano calore.')]
				: [t('A ha la temperatura di C, B no: A e B hanno temperature diverse e si scambiano calore.'), t('Non si sa però quale dei due è più caldo.')],
			answer: labelOptions(rng, [right, ...HEAT.filter((x) => x !== right)]),
			params: { case: both ? 'terzo corpo, equilibrio' : 'terzo corpo, verso ignoto' },
		};
	}
	const equal = r < 0.45;
	const a = rng.int(150, 450) / 10;
	let b = a;
	if (!equal) {
		b = rng.int(150, 450) / 10;
		if (Math.abs(a - b) < 0.5) throw new Error('too close');
	}
	const right = equal ? HEAT[0] : a > b ? HEAT[1] : HEAT[2];
	return {
		prompt: 'Scegli che cosa succede.',
		problem: textBlock(`Un termometro segna ${pu(fx(a, 1), 'C')} a contatto con il corpo A e ${pu(fx(b, 1), 'C')} a contatto con il corpo B. ${ask}`),
		solution: t(right),
		steps: equal
			? [t('Il termometro è in equilibrio termico con A e con B alla stessa temperatura.'), t('Per il principio zero A e B sono in equilibrio termico tra loro: non si scambiano calore.')]
			: [t('Il termometro dice che A e B hanno temperature diverse: non sono in equilibrio termico.'), t(`Il calore passa dal corpo più caldo, ${a > b ? 'A' : 'B'}, a quello più freddo.`)],
		answer: labelOptions(rng, [right, ...HEAT.filter((x) => x !== right)]),
		params: { case: equal ? 'termometro, uguali' : a > b ? 'termometro, A più caldo' : 'termometro, B più caldo', a: String(a), b: String(b) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: where the piston stops

function level5(rng: Rng): Built {
	for (;;) {
		const L = noZero(rng, 41, 99);
		const n1 = noZero(rng, 11, 99) / 100, n2 = noZero(rng, 11, 99) / 100;
		if (Math.abs(n1 - n2) < 0.1) continue;
		const l1 = (L * n1) / (n1 + n2);
		const a = fx(n1, 2), b = fx(n2, 2);
		return {
			prompt: 'Trova dove si ferma il pistone.',
			problem: textBlock(`Un cilindro orizzontale lungo ${pu(String(L), 'cm')}, chiuso alle estremità, è diviso da un pistone che scorre senza attrito e conduce il calore. A sinistra ci sono ${pu(a, 'mol')} di gas, a destra ${pu(b, 'mol')}. Quanto è lunga la parte di sinistra all'equilibrio?`),
			solution: `l_1 \\approx ${wu(must(l1, 2), 'cm')}`,
			steps: [
				t("All'equilibrio le due pressioni sono uguali (il pistone è fermo) e le due temperature anche (il pistone conduce)."),
				`\\dfrac{V_1}{V_2} = \\dfrac{n_1}{n_2} \\quad\\Rightarrow\\quad l_1 = \\dfrac{n_1}{n_1 + n_2} \\cdot L`,
				`l_1 = \\dfrac{${a}}{${a} + ${b}} \\cdot ${wu(String(L), 'cm')} ${approx(l1, 'cm', 2)}`,
			],
			// the other part; half the cylinder; the ratio of the moles times the length
			answer: options(rng, l1, [L - l1, L / 2, n1 < n2 ? (L * n1) / n2 : (L * n2) / n1], 'cm', 2),
			params: { case: n1 < n2 ? 'meno gas a sinistra' : 'più gas a sinistra', L, n1: String(n1), n2: String(n2) },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	if (sample.level === 2 || sample.level === 5) return checkCommon(sample);
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	const v: string[] = [];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.values[0])).size !== 4) v.push('servono quattro opzioni diverse');
	if (!sample.steps.length) v.push('nessun passaggio');
	return v;
}

export const fisSistemiTermodinamici: Generator = {
	id: ID,
	title: 'Sistemi termodinamici e principio zero',
	levels: {
		1: { label: 'Aperto, chiuso o isolato', constraints: ['che cosa scambia il sistema con l’ambiente'] },
		2: { label: 'Lo stato nel piano pressione-volume', constraints: ['T = pV / (nR)', 'pressione e volume letti dal grafico'] },
		3: { label: 'Due gas e una parete', constraints: ['equilibrio meccanico ed equilibrio termico', 'parete mobile o fissa, conduttrice o isolante'] },
		4: { label: 'Il principio zero', constraints: ['un termometro o un terzo corpo', 'passa calore o no, e in che verso'] },
		5: { label: 'Dove si ferma il pistone', constraints: ['stessa pressione e stessa temperatura', 'i volumi stanno come le moli'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisSistemiTermodinamici;
