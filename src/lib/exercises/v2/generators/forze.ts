/**
 * Le forze e il dinamometro. Spec: specs/exercises/forze.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/16-forze.md): reading a spring balance drawn in a scene;
 * its capacity and sensitivity; the resultant of two forces on the same line; of two perpendicular forces (or the
 * missing one); of three or four forces along two perpendicular directions. Answers in newton, exact (the data are
 * exact: a scale, whole newtons, Pythagorean triples), multiple choice with the unit in the option and the lesson's
 * mistakes as distractors: one division off, the moduli added as numbers, the difference taken for the sum.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { q } from '../rational';
import { type Built, type R, choiceFor, commonCheck, dec, generateWith, n, t, withUnit } from '../fisica-forze';

export const ID = 'forze';

const N = (r: R) => withUnit(dec(r), 'N');
const pN = (r: R) => `$${N(r)}$`;
const EXACT = { kind: 'exact' } as const;
const INT = { kind: 'int' } as const;

// ---------------------------------------------------------------------------
// Level 1: reading a spring balance

/** The balances of the exercises: capacity, divisions, a number every `ogni` divisions. Scale 3 cm long. */
export const BALANCES = [
	{ portata: 1, divisioni: 20, ogni: 4 },
	{ portata: 2, divisioni: 20, ogni: 5 },
	{ portata: 5, divisioni: 25, ogni: 5 },
	{ portata: 10, divisioni: 20, ogni: 4 },
	{ portata: 20, divisioni: 20, ogni: 5 },
	{ portata: 50, divisioni: 25, ogni: 5 },
] as const;

type Balance = (typeof BALANCES)[number];

function balanceAlt(b: Balance, reading: string) {
	const step = q(b.portata * b.ogni, b.divisioni);
	return `Un dinamometro appeso con la scala da 0 a ${b.portata} newton, divisa in ${b.divisioni} parti uguali, con un numero ogni ${b.ogni} divisioni (ogni ${dec(step).replace('{,}', ',')} newton)${reading}`;
}

function level1(rng: Rng): Built {
	const b = rng.pick(BALANCES);
	const sens = q(b.portata, b.divisioni);
	let i: number;
	do i = rng.int(1, b.divisioni - 1);
	while (i % b.ogni === 0);
	const F = sens.mul(n(i));
	const labelStep = sens.mul(n(b.ogni));
	const below = Math.floor(i / b.ogni);
	const extra = i - below * b.ogni;
	const labelBelow = labelStep.mul(n(below));
	const where = `: l'indice è ${extra} ${extra === 1 ? 'tacca' : 'tacche'} sotto il numero ${dec(labelBelow).replace('{,}', ',')}, e al gancio è appeso un sacchetto`;
	const scene: SceneRef = { type: 'dinamometro', data: { portata: b.portata, divisioni: b.divisioni, ogni: b.ogni, forza: Number(F.num / F.den), oggetto: true }, alt: balanceAlt(b, where) };
	// the other width a division is often taken for
	const wrongDiv = sens.equals(q(1, 10)) ? n(1) : q(1, 10);
	return {
		prompt: 'Leggi il dinamometro.',
		problem: textBlock('Quanto segna il dinamometro della figura?'),
		solution: `F = ${N(F)}`,
		steps: [
			`${t('Tra due numeri ci sono ')} ${b.ogni} ${t(' divisioni: una divisione vale ')} ${dec(labelStep)} : ${b.ogni} = ${N(sens)}`,
			`${t("L'indice è ")} ${extra} ${t(extra === 1 ? ' tacca sotto il numero ' : ' tacche sotto il numero ')} ${dec(labelBelow)}`,
			`F = ${dec(labelBelow)} + ${extra} \\cdot ${dec(sens)} = ${N(F)}`,
		],
		answer: F,
		unit: 'N',
		format: EXACT,
		// one division off, each way; a division taken for 0,1 N (or 1 N); the number nearest the index
		mistakes: [F.add(sens), F.sub(sens), labelBelow.add(wrongDiv.mul(n(extra))), labelStep.mul(n(Math.round(i / b.ogni)))],
		params: { case: 'lettura', ...b, i },
		scene,
	};
}

// ---------------------------------------------------------------------------
// Level 2: capacity and sensitivity

const CAPACITIES = [1, 2, 5, 10, 20, 50, 100];
const DIVISIONS = [10, 20, 25, 40, 50, 100];

function level2(rng: Rng): Built {
	const r = rng.next();
	if (r < 1 / 3) {
		const b = rng.pick(BALANCES);
		const sens = q(b.portata, b.divisioni);
		const labelStep = sens.mul(n(b.ogni));
		return {
			prompt: 'Trova la sensibilità.',
			problem: textBlock('Qual è la sensibilità del dinamometro della figura?'),
			solution: `${t('sensibilità')} = ${N(sens)}`,
			steps: [
				`${t('Tra due numeri vicini ci sono ')} ${b.ogni} ${t(' divisioni, e i numeri vanno di ')} ${N(labelStep)} ${t(' in ')} ${N(labelStep)}`,
				`${t('Una divisione vale ')} ${dec(labelStep)} : ${b.ogni} = ${N(sens)}`,
			],
			answer: sens,
			unit: 'N',
			format: EXACT,
			// the step between two numbers; the capacity; one over the number of divisions
			mistakes: [labelStep, n(b.portata), q(1, b.divisioni), sens.mul(n(10))],
			params: { case: 'figura', ...b },
			scene: { type: 'dinamometro', data: { portata: b.portata, divisioni: b.divisioni, ogni: b.ogni, forza: 0, oggetto: false }, alt: balanceAlt(b, ', senza niente appeso') },
		};
	}
	for (;;) {
		const P = rng.pick(CAPACITIES);
		const d = rng.pick(DIVISIONS);
		const s = q(P, d);
		if (s.compare(q(1, 100)) < 0 || !s.mul(n(100)).isInteger()) continue;
		if (r < 2 / 3) {
			return {
				prompt: 'Trova la sensibilità.',
				problem: textBlock(`Un dinamometro ha la scala da $0$ a ${pN(n(P))}, divisa in $${d}$ parti uguali. Qual è la sua sensibilità?`),
				solution: `${t('sensibilità')} = ${N(s)}`,
				steps: [`${t('La sensibilità è il valore di una divisione: portata diviso numero di divisioni')}`, `${P} : ${d} = ${N(s)}`],
				answer: s,
				unit: 'N',
				format: EXACT,
				// the ratio upside down; the product; ten times the answer
				mistakes: [q(d, P), n(P * d), s.mul(n(10)), s.div(n(10))],
				params: { case: 'sensibilita', portata: P, divisioni: d },
			};
		}
		return {
			prompt: 'Trova la portata.',
			problem: textBlock(`Un dinamometro ha la sensibilità di ${pN(s)} e la scala divisa in $${d}$ parti uguali. Qual è la sua portata?`),
			solution: `${t('portata')} = ${N(n(P))}`,
			steps: [`${t('Le ')} ${d} ${t(' divisioni valgono ')} ${N(s)} ${t(' ciascuna')}`, `${d} \\cdot ${dec(s)} = ${N(n(P))}`],
			answer: n(P),
			unit: 'N',
			format: EXACT,
			// the sensitivity divided by the divisions; the divisions over the sensitivity; the number of divisions
			mistakes: [s.div(n(d)), n(d).div(s), n(d), n(P * 10)],
			params: { case: 'portata', sensibilita: s.toString(), divisioni: d },
		};
	}
}

// ---------------------------------------------------------------------------
// Scenes of forces: punto-forze, the arrows to scale with the longest 2 cm long (a block would hide the short ones)

type F = { nome: string; sub?: string; modulo: number; angolo: number; colore?: 'risultante' };
const DIR: Record<number, string> = { 0: 'est', 90: 'nord', 180: 'ovest', 270: 'sud' };

function forceScene(forces: F[], alt: string, extra: F[] = []): SceneRef {
	const max = Math.max(...forces.map((f) => f.modulo), ...extra.map((f) => f.modulo));
	return { type: 'punto-forze', data: { forze: [...forces, ...extra], scala: Math.round((2 / max) * 10000) / 10000 }, alt };
}

const forceText = (f: F) => `$F_${f.sub} = ${N(n(f.modulo))}$ verso ${DIR[f.angolo]}`;
const joinList = (xs: string[]) => (xs.length === 2 ? `${xs[0]} e ${xs[1]}` : `${xs.slice(0, -1).join(', ')} e ${xs.at(-1)}`);
const altForces = (fs: F[]) => joinList(fs.map((f) => `F${f.sub} di ${f.modulo} newton verso ${DIR[f.angolo]}`));

// ---------------------------------------------------------------------------
// Level 3: two forces on the same line

function level3(rng: Rng): Built {
	let F1: number, F2: number;
	do {
		F1 = 5 * rng.int(1, 30);
		F2 = 5 * rng.int(1, 30);
	} while (F1 === F2 || Math.min(F1, F2) < 0.15 * Math.max(F1, F2));
	const same = rng.next() < 0.5;
	const a1 = rng.pick([0, 180]);
	const a2 = same ? a1 : (a1 + 180) % 360;
	const fs: F[] = [
		{ nome: 'F', sub: '1', modulo: F1, angolo: a1 },
		{ nome: 'F', sub: '2', modulo: F2, angolo: a2 },
	];
	const R = same ? F1 + F2 : Math.abs(F1 - F2);
	const Rdir = same ? a1 : F1 > F2 ? a1 : a2;
	const problem = textBlock(`Su un corpo agiscono due forze lungo la stessa retta: ${forceText(fs[0])} e ${forceText(fs[1])}. Quanto vale il modulo della risultante?`);
	const steps = same
		? [t('Le forze hanno la stessa direzione e lo stesso verso: i moduli si sommano'), `R = ${F1} + ${F2} = ${N(n(R))}`, `${t('verso ')} ${t(DIR[Rdir])}`]
		: [
				t('Le forze hanno versi opposti: si sottrae il modulo minore dal maggiore'),
				`R = ${Math.max(F1, F2)} - ${Math.min(F1, F2)} = ${N(n(R))}`,
				`${t('verso ')} ${t(DIR[Rdir])}${t(', quello della forza più grande')}`,
			];
	const R_: F = { nome: 'R', modulo: R, angolo: Rdir, colore: 'risultante' };
	return {
		prompt: 'Trova la risultante.',
		problem,
		solution: `R = ${N(n(R))}`,
		steps,
		answer: n(R),
		unit: 'N',
		format: INT,
		// the other operation; the larger force; the mean
		mistakes: [n(same ? Math.abs(F1 - F2) : F1 + F2), n(Math.max(F1, F2)), q(F1 + F2, 2)],
		params: { case: same ? 'stesso-verso' : 'versi-opposti', F1, F2, a1, a2 },
		// two arrows on the same line and in the same verso would hide each other: a scene only for opposite versi
		...(same
			? {}
			: {
					scene: forceScene(fs, `Due forze applicate allo stesso corpo lungo la stessa retta, in versi opposti: ${altForces(fs)}, disegnate in scala`),
					solutionScene: forceScene(fs, `Le due forze e la loro risultante R di ${R} newton verso ${DIR[Rdir]}`, [R_]),
				}),
	};
}

// ---------------------------------------------------------------------------
// Level 4: two perpendicular forces

const TRIPLES: [number, number, number][] = [
	[3, 4, 5],
	[5, 12, 13],
	[8, 15, 17],
	[7, 24, 25],
	[20, 21, 29],
	[12, 35, 37],
	[9, 40, 41],
];

function pickTriple(rng: Rng, maxC: number): [number, number, number] {
	for (;;) {
		const [a, b, c] = rng.pick(TRIPLES);
		const k = rng.int(1, Math.max(1, Math.floor(maxC / c)));
		if (c * k > maxC || a * k < 5) continue;
		return rng.next() < 0.5 ? [a * k, b * k, c * k] : [b * k, a * k, c * k];
	}
}

function level4(rng: Rng): Built {
	const [F1, F2, R] = pickTriple(rng, 150);
	const ax = rng.pick([0, 180]);
	const ay = rng.pick([90, 270]);
	const fs: F[] = [
		{ nome: 'F', sub: '1', modulo: F1, angolo: ax },
		{ nome: 'F', sub: '2', modulo: F2, angolo: ay },
	];
	const Rang = (Math.atan2(ay === 90 ? F2 : -F2, ax === 0 ? F1 : -F1) * 180) / Math.PI;
	const R_: F = { nome: 'R', modulo: R, angolo: Math.round(Rang * 100) / 100, colore: 'risultante' };
	if (rng.next() < 0.7) {
		return {
			prompt: 'Trova la risultante.',
			problem: textBlock(`Su un corpo agiscono due forze perpendicolari: ${forceText(fs[0])} e ${forceText(fs[1])}. Quanto vale il modulo della risultante?`),
			solution: `R = ${N(n(R))}`,
			steps: [
				t('Le forze sono perpendicolari: la risultante è la diagonale del rettangolo che hanno per lati'),
				`R = \\sqrt{F_1^2 + F_2^2} = \\sqrt{${F1}^2 + ${F2}^2}\\,\\text{N}`,
				`R = \\sqrt{${F1 * F1} + ${F2 * F2}}\\,\\text{N} = \\sqrt{${R * R}}\\,\\text{N} = ${N(n(R))}`,
			],
			answer: n(R),
			unit: 'N',
			format: INT,
			// the moduli added as numbers; their difference; the larger force
			mistakes: [n(F1 + F2), n(Math.abs(F1 - F2)), n(Math.max(F1, F2))],
			params: { case: 'risultante', F1, F2, ax, ay },
			scene: forceScene(fs, `Due forze perpendicolari applicate allo stesso corpo: ${altForces(fs)}, disegnate in scala`),
			solutionScene: forceScene(fs, `Le due forze e la loro risultante R di ${R} newton, la diagonale del rettangolo che hanno per lati`, [R_]),
		};
	}
	return {
		prompt: 'Trova la forza.',
		problem: textBlock(`Due forze perpendicolari applicate allo stesso corpo hanno una risultante di ${pN(n(R))}. Una delle due forze vale ${pN(n(F1))}. Quanto vale l'altra?`),
		solution: `F_2 = ${N(n(F2))}`,
		steps: [
			`R^2 = F_1^2 + F_2^2 \\quad\\Rightarrow\\quad F_2 = \\sqrt{R^2 - F_1^2}`,
			`F_2 = \\sqrt{${R}^2 - ${F1}^2}\\,\\text{N} = \\sqrt{${R * R - F1 * F1}}\\,\\text{N} = ${N(n(F2))}`,
		],
		answer: n(F2),
		unit: 'N',
		format: INT,
		// the difference of the moduli; the sum; the resultant itself
		mistakes: [n(R - F1), n(R + F1), n(R)],
		params: { case: 'forza-mancante', R, F1 },
		solutionScene: forceScene(fs, `Le due forze perpendicolari, di ${F1} e ${F2} newton, e la loro risultante R di ${R} newton`, [R_]),
	};
}

// ---------------------------------------------------------------------------
// Level 5: three or four forces along two perpendicular directions

function level5(rng: Rng): Built {
	for (;;) {
		const [Rx, Ry, R] = pickTriple(rng, 100);
		const four = rng.next() < 0.4;
		const ex = rng.pick([0, 180]);
		const ny = rng.pick([90, 270]);
		const F2 = 5 * rng.int(1, 12);
		const F1 = Rx + F2;
		const F4 = four ? 5 * rng.int(1, 10) : 0;
		const F3 = Ry + F4;
		// every arrow at least 0,3 cm long when the longest is 2 cm
		if (F1 > 150 || F3 > 150 || Math.min(F2, F3, ...(four ? [F4] : [])) < 0.15 * Math.max(F1, F3)) continue;
		const fs: F[] = [
			{ nome: 'F', sub: '1', modulo: F1, angolo: ex },
			{ nome: 'F', sub: '2', modulo: F2, angolo: (ex + 180) % 360 },
			{ nome: 'F', sub: '3', modulo: F3, angolo: ny },
		];
		if (four) fs.push({ nome: 'F', sub: '4', modulo: F4, angolo: (ny + 180) % 360 });
		const all = fs.reduce((s, f) => s + f.modulo, 0);
		const Rang = (Math.atan2(ny === 90 ? Ry : -Ry, ex === 0 ? Rx : -Rx) * 180) / Math.PI;
		const R_: F = { nome: 'R', modulo: R, angolo: Math.round(Rang * 100) / 100, colore: 'risultante' };
		const yStep = four
			? `${t('Lungo ')} ${t(`${DIR[ny]}-${DIR[(ny + 180) % 360]}`)}\\text{: } ${F3} - ${F4} = ${N(n(Ry))} ${t(' verso ')} ${t(DIR[ny])}`
			: `${t('Lungo ')} ${t(`${DIR[ny]}-${DIR[(ny + 180) % 360]}`)}\\text{: } ${t('solo ')} F_3 = ${N(n(Ry))} ${t(' verso ')} ${t(DIR[ny])}`;
		const hyp = Math.sqrt((F1 + F2) ** 2 + Ry ** 2);
		return {
			prompt: 'Trova la risultante.',
			problem: textBlock(`Su un corpo agiscono ${four ? 'quattro' : 'tre'} forze: ${joinList(fs.map(forceText))}. Quanto vale il modulo della risultante?`),
			solution: `R = ${N(n(R))}`,
			steps: [
				`${t('Lungo ')} ${t(`${DIR[ex]}-${DIR[(ex + 180) % 360]}`)}\\text{: } ${F1} - ${F2} = ${N(n(Rx))} ${t(' verso ')} ${t(DIR[ex])}`,
				yStep,
				`${t('Le due somme sono perpendicolari: ')} R = \\sqrt{${Rx}^2 + ${Ry}^2}\\,\\text{N} = \\sqrt{${R * R}}\\,\\text{N} = ${N(n(R))}`,
			],
			answer: n(R),
			unit: 'N',
			format: INT,
			// all the moduli added; the two partial sums added; opposite forces added (when that still gives an integer)
			mistakes: [n(all), n(Rx + Ry), ...(Number.isInteger(hyp) ? [n(hyp)] : []), n(Math.abs(Rx - Ry))],
			params: { case: four ? 'quattro' : 'tre', forze: fs.map((f) => [f.modulo, f.angolo]) },
			scene: forceScene(fs, `${four ? 'Quattro' : 'Tre'} forze applicate allo stesso corpo: ${altForces(fs)}, disegnate in scala`),
			solutionScene: forceScene(fs, `Le forze e la loro risultante R di ${R} newton`, [R_]),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	const ans = sample.answer.kind === 'number' ? sample.answer.value : '';
	if (((sample.params.mistakes as string[]) ?? []).filter((m) => m !== ans).length < 2) v.push('meno di due errori tipici');
	if (sample.scene && JSON.stringify(sample.scene).includes('"risultante"')) v.push('la scena del problema mostra la risultante');
	return v;
}

export const forze: Generator = {
	id: ID,
	title: 'Le forze e il dinamometro',
	levels: {
		1: { label: 'Leggere il dinamometro', constraints: ['un dinamometro disegnato, sei scale diverse', "l'indice su una tacca senza numero"] },
		2: { label: 'Portata e sensibilità', constraints: ['la sensibilità dalla figura (un terzo), dalla portata e dalle divisioni (un terzo), la portata (un terzo)'] },
		3: { label: 'Forze sulla stessa retta', constraints: ['due forze, stesso verso o versi opposti, metà ciascuno', 'moduli multipli di 5 N, fino a 150 N'] },
		4: { label: 'Forze perpendicolari', constraints: ['terne pitagoriche', 'la risultante (70%) o la forza che manca (30%)'] },
		5: { label: 'Più forze su due direzioni', constraints: ['tre o quattro forze lungo due direzioni perpendicolari', 'risultante intera'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice: (sample, rng) => choiceFor(sample, rng, ID),
};

export default forze;
