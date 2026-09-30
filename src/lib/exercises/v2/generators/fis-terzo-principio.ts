/**
 * Il terzo principio della dinamica. Spec: specs/exercises/fis-terzo-principio.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/52-fis-terzo-principio.md), each one step harder: which
 * force pairs with a given one (the options are sentences: a book on a table, walking, a rocket, a hanging lamp, a
 * hammer, a swimmer); two bodies push each other with the same force and accelerate differently (a = F / m); from the
 * acceleration of one to that of the other (a_B = a_A m_A / m_B); the acceleration a falling body gives the Earth (in
 * scientific notation); a model rocket pushed by its gases, against its weight. g = 9,8 m/s², data with two significant
 * figures, answers with two significant figures, never too close to a rounding boundary. Distractors from the lesson's
 * warnings: the weight and the table's reaction taken for a pair, the same acceleration for both bodies, the ratio of
 * the masses upside down, the weight forgotten.
 */
import type { Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { pq, qty, t } from '../vettori';
import { generateWith, mulDec, two } from '../fisica-equilibrio';
import { type Built, acc, accOpt, aOpts, around, checkBasic, choiceOf, f3, pacc, r2, sci2, sciOpt, sciOpts, wordOpt } from '../fis-dinamica';

export const ID = 'fis-terzo-principio';

const N = (s: string) => qty(s, 'N');
const KG = (s: string) => qty(s, 'kg');

// ---------------------------------------------------------------------------
// Level 1: the pairs

const PAIRS = [
	{
		key: 'libro-peso',
		situation: 'Un libro è fermo su un tavolo.',
		action: 'il peso del libro, cioè la Terra che attira il libro',
		right: 'il libro attira la Terra',
		wrong: ['il tavolo spinge il libro', 'il libro preme sul tavolo', 'la Terra attira il tavolo'],
		why: 'Il peso è la Terra che attira il libro: la sua reazione è il libro che attira la Terra, con una forza uguale e opposta. La reazione del tavolo agisce anche lei sul libro, e non è la coppia del peso.',
	},
	{
		key: 'libro-tavolo',
		situation: 'Un libro è fermo su un tavolo.',
		action: "la forza con cui il tavolo spinge il libro verso l'alto",
		right: 'il libro preme sul tavolo',
		wrong: ['la Terra attira il libro', 'il libro attira la Terra', 'il pavimento spinge il tavolo'],
		why: 'Il tavolo spinge il libro, e il libro spinge il tavolo verso il basso: è la forza premente. Il peso agisce sul libro come la reazione del tavolo, e non forma una coppia con lei.',
	},
	{
		key: 'camminare',
		situation: 'Una ragazza cammina.',
		action: "la forza con cui il piede spinge il suolo all'indietro",
		right: 'il suolo spinge il piede in avanti',
		wrong: ['il suolo spinge il piede in su', 'la Terra attira la ragazza', 'il piede spinge il suolo in giù'],
		why: "Il piede spinge il suolo all'indietro, e il suolo spinge il piede in avanti: è questa forza che fa camminare.",
	},
	{
		key: 'razzo',
		situation: 'Un razzo decolla.',
		action: 'la forza con cui il razzo spinge i gas di scarico verso il basso',
		right: 'i gas spingono il razzo in su',
		wrong: ['la Terra attira il razzo', "l'aria spinge il razzo in su", 'i gas spingono il razzo in giù'],
		why: "Il razzo spinge i gas verso il basso, e i gas spingono il razzo verso l'alto: non serve l'aria, e infatti il razzo funziona anche nel vuoto.",
	},
	{
		key: 'lampada',
		situation: 'Una lampada è appesa al soffitto con un filo.',
		action: 'il peso della lampada',
		right: 'la lampada attira la Terra',
		wrong: ['il filo tira la lampada in su', 'la lampada tira il filo in giù', 'il soffitto tira il filo in su'],
		why: "Il peso è la Terra che attira la lampada: la sua reazione è la lampada che attira la Terra. La tensione del filo agisce anche lei sulla lampada, e la bilancia perché la lampada è ferma.",
	},
	{
		key: 'martello',
		situation: 'Un martello colpisce un chiodo.',
		action: 'la forza del martello sul chiodo',
		right: 'il chiodo spinge il martello',
		wrong: ['il legno spinge il chiodo', 'la mano spinge il martello', 'la Terra attira il martello'],
		why: 'Il martello spinge il chiodo, e il chiodo spinge il martello con una forza uguale e opposta: per questo il martello rimbalza e si ferma.',
	},
	{
		key: 'nuotatore',
		situation: 'Un nuotatore avanza a rana.',
		action: "la forza con cui le mani spingono l'acqua all'indietro",
		right: "l'acqua spinge le mani in avanti",
		wrong: ["l'acqua spinge le mani indietro", 'la Terra attira il nuotatore', "l'acqua spinge il nuotatore in su"],
		why: "Le mani spingono l'acqua all'indietro, e l'acqua spinge le mani, e con loro il nuotatore, in avanti.",
	},
];

function level1(rng: Rng): Built {
	const p = rng.pick(PAIRS);
	const opts = shuffle(rng, [p.right, ...p.wrong]);
	return {
		prompt: 'Trova la reazione.',
		problem: textBlock(`${p.situation} Quale forza forma una coppia di azione e reazione con ${p.action}?`),
		solution: `\\text{${p.right}}`,
		steps: [textBlock("Azione e reazione sono due forze tra gli stessi due corpi: ciascuno dei due agisce sull'altro."), textBlock(p.why)],
		answer: { kind: 'choice', options: opts.map((x) => wordOpt(x, x)), correct: opts.indexOf(p.right) },
		params: { case: p.key },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the same force, two accelerations

function masses(rng: Rng): [string, string] {
	for (;;) {
		const a = two(rng, false), b = two(rng, false);
		if (Number(a) >= 40 && Number(b) >= 40 && Math.abs(Number(a) - Number(b)) >= 10) return [a, b];
	}
}

function level2(rng: Rng): Built {
	const boats = rng.next() < 0.5;
	for (;;) {
		const [mA, mB] = masses(rng);
		const F = two(rng, false);
		const askA = rng.next() < 0.5;
		const mX = askA ? mA : mB, mY = askA ? mB : mA;
		const exact = Number(F) / Number(mX);
		const ans = r2(exact);
		if (ans === null) continue;
		const problem = boats
			? `Due canoe, di ${pq(mA, 'kg')} e ${pq(mB, 'kg')} con chi le guida, sono ferme sull'acqua. Chi sta nella prima tira una fune legata alla seconda, e la fune tira ciascuna canoa verso l'altra con una forza di ${pq(F, 'N')}. Quanto vale l'accelerazione della canoa di ${pq(mX, 'kg')}?`
			: `Due pattinatori, di ${pq(mA, 'kg')} e ${pq(mB, 'kg')}, sono fermi sul ghiaccio e si spingono con una forza di ${pq(F, 'N')}. Quanto vale l'accelerazione del pattinatore di ${pq(mX, 'kg')}?`;
		return {
			prompt: "Trova l'accelerazione.",
			problem: textBlock(problem),
			solution: `a \\approx ${acc(ans)}`,
			steps: [t('Per il terzo principio le due forze hanno lo stesso modulo,') + ` F = ${N(F)}`, `a = \\dfrac{F}{m} = \\dfrac{${N(F)}}{${KG(mX)}} = ${f3(exact)}\\ldots\\,\\text{m/s}^2 \\approx ${acc(ans)}`],
			// the other body's mass; the two masses together; the product of force and masses ratio
			answer: choiceOf(rng, accOpt(ans), aOpts([r2(Number(F) / Number(mY)), r2(Number(F) / (Number(mA) + Number(mB)))]), aOpts(around(exact))),
			params: { case: boats ? 'canoe' : 'pattinatori', mA, mB, F, asked: mX },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: from one acceleration to the other

function level3(rng: Rng): Built {
	for (;;) {
		const [mA, mB] = masses(rng);
		const aA = two(rng, true);
		const exact = (Number(aA) * Number(mA)) / Number(mB);
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: "Trova l'altra accelerazione.",
			problem: textBlock(`Due pattinatori, di ${pq(mA, 'kg')} e ${pq(mB, 'kg')}, sono fermi sul ghiaccio e si spingono. Il pattinatore di ${pq(mA, 'kg')} ha un'accelerazione di ${pacc(aA)}. Quanto vale l'accelerazione dell'altro?`),
			solution: `a_B \\approx ${acc(ans)}`,
			steps: [
				`${t('La forza sul primo: ')} F = m_A\\,a_A = ${KG(mA)} \\cdot ${acc(aA)} = ${f3(Number(mA) * Number(aA))}\\,\\text{N}`,
				t("Per il terzo principio la stessa forza agisce sull'altro:"),
				`a_B = \\dfrac{F}{m_B} = \\dfrac{${f3(Number(mA) * Number(aA))}\\,\\text{N}}{${KG(mB)}} = ${f3(exact)}\\ldots\\,\\text{m/s}^2 \\approx ${acc(ans)}`,
			],
			// the same acceleration; the ratio of the masses upside down
			answer: choiceOf(rng, accOpt(ans), aOpts([r2(Number(aA)), r2((Number(aA) * Number(mB)) / Number(mA))]), aOpts(around(exact))),
			params: { case: 'accelerazioni', mA, mB, aA },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the Earth's acceleration

const M_EARTH = 5.97e24;
const FALLING = [
	{ name: 'Un sasso', lower: 'il sasso' },
	{ name: 'Un vaso', lower: 'il vaso' },
	{ name: 'Uno zaino', lower: 'lo zaino' },
];

function level4(rng: Rng): Built {
	for (;;) {
		const m = two(rng, true);
		const P = mulDec(m, '9.8');
		const exact = Number(P) / M_EARTH;
		const s = sci2(exact);
		const right = sciOpt(exact, 'm/s^2');
		if (!s || !right) continue;
		const body = rng.pick(FALLING);
		return {
			prompt: "Trova l'accelerazione della Terra.",
			problem: textBlock(`${body.name} di ${pq(m, 'kg')} cade dall'alto. Quanto vale l'accelerazione che ${body.lower} dà alla Terra? La massa della Terra è $5{,}97 \\cdot 10^{24}\\,\\text{kg}$.`),
			solution: `a_T \\approx ${s.tex}\\,\\text{m/s}^2`,
			steps: [
				`${t('La Terra attira il corpo con il peso: ')} P = m\\,g = ${KG(m)} \\cdot 9{,}8\\,\\text{m/s}^2 = ${N(P)}`,
				t('Per il terzo principio il corpo attira la Terra con la stessa forza:'),
				`a_T = \\dfrac{${N(P)}}{5{,}97 \\cdot 10^{24}\\,\\text{kg}} \\approx ${s.tex}\\,\\text{m/s}^2`,
			],
			// the same acceleration as the body; the mass for the force (g forgotten); an exponent off by one
			answer: choiceOf(rng, right, [accOpt('9.8'), ...sciOpts([Number(m) / M_EARTH, exact * 10], 'm/s^2')], sciOpts([exact / 10, exact * 1.2, exact * 0.8], 'm/s^2')),
			params: { case: 'terra', m },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the model rocket

function level5(rng: Rng): Built {
	for (;;) {
		const k = rng.int(11, 99);
		if (k % 10 === 0) continue;
		const m = (k / 100).toFixed(2);
		const P = mulDec(m, '9.8'), Pn = Number(P);
		const F = two(rng, rng.next() < 0.5);
		if (Number(F) < 1.3 * Pn || Number(F) > 4 * Pn) continue;
		const exact = (Number(F) - Pn) / Number(m);
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: "Trova l'accelerazione del razzo.",
			problem: textBlock(`Un razzo modello di ${pq(m, 'kg')} parte verticalmente; i gas di scarico lo spingono verso l'alto con una forza di ${pq(F, 'N')}. Quanto vale la sua accelerazione alla partenza?`),
			solution: `a \\approx ${acc(ans)}`,
			steps: [
				`P = m\\,g = ${KG(m)} \\cdot 9{,}8\\,\\text{m/s}^2 = ${N(P)}`,
				`${t("La forza totale, verso l'alto: ")} F_{tot} = ${N(F)} - ${N(P)} = ${f3(Number(F) - Pn)}\\,\\text{N}`,
				`a = \\dfrac{F_{tot}}{m} = ${f3(exact)}\\ldots\\,\\text{m/s}^2 \\approx ${acc(ans)}`,
			],
			// the weight forgotten; the weight added; the mass for the weight
			answer: choiceOf(rng, accOpt(ans), aOpts([r2(Number(F) / Number(m)), r2((Number(F) + Pn) / Number(m)), r2((Number(F) - Number(m)) / Number(m))]), aOpts(around(exact))),
			params: { case: 'razzo', m, F },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkBasic(sample);
}

export const fisTerzoPrincipio: Generator = {
	id: ID,
	title: 'Il terzo principio della dinamica',
	levels: {
		1: { label: 'Azione e reazione', constraints: ['sette situazioni', 'le opzioni sono forze descritte a parole'] },
		2: { label: 'Stessa forza, accelerazioni diverse', constraints: ['masse da 40 a 99 kg, diverse di almeno 10 kg'] },
		3: { label: "Dall'accelerazione di uno a quella dell'altro", constraints: ['a_B = a_A m_A / m_B'] },
		4: { label: "L'accelerazione della Terra", constraints: ['risultato in notazione scientifica'] },
		5: { label: 'Il razzo', constraints: ['la spinta tra 1,3 e 4 volte il peso'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisTerzoPrincipio;

