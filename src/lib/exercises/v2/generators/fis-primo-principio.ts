/**
 * Il primo principio della dinamica e i sistemi inerziali. Spec: specs/exercises/fis-primo-principio.md
 *
 * Four levels from the lesson (docs/lezioni/fisica/riscritte/50-fis-primo-principio.md), each one step harder, all on
 * the same idea: a body at constant velocity has zero total force, so the forces balance. Vertical motion (the air on
 * a parachute, a rope lifting a load: the force equals the weight); a crate dragged on the floor (the friction equals
 * the pull, and gives μd); a suitcase pulled along a slanted handle (only the horizontal component balances the
 * friction); two perpendicular ropes (the friction balances their resultant). g = 9,8 N/kg, data with two significant
 * figures, answers with two significant figures, never too close to a rounding boundary. Distractors from the
 * lesson's warnings: the mass for the weight, "zero because the velocity is constant", the whole force for its
 * component, sine for cosine, moduli added as numbers.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, decTex, pq, qOpt, qty, t } from '../vettori';
import { coeff, cosD, generateWith, numOpt, sinD, two, weight } from '../fisica-equilibrio';
import { type Built, around, blockScene, checkNumeric, f3, nOpts, pointScene, r2 } from '../fis-dinamica';

export const ID = 'fis-primo-principio';

const N = (s: string) => qty(s, 'N');
const P_STEP = (m: string, P: string) => `P = m \\cdot g = ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${N(P)}`;
const ZERO = t('La velocità è costante: per il primo principio la forza totale è nulla.');

// ---------------------------------------------------------------------------
// Level 1: constant velocity, vertically

const LOADS = [
	{ name: 'Un secchio', e: 'o' },
	{ name: 'Una cassetta', e: 'a' },
	{ name: 'Un sacco di sabbia', e: 'o' },
];

function level1(rng: Rng): Built {
	const para = rng.next() < 0.5;
	for (;;) {
		const m = two(rng, true);
		const P = weight(m), Pn = Number(P);
		const ans = r2(Pn);
		if (ans === null) continue;
		const load = rng.pick(LOADS);
		const problem = para
			? `Un pacco di ${pq(m, 'kg')} scende con il paracadute a velocità costante. Quanto vale la forza dell'aria sul pacco e sul paracadute, di massa trascurabile?`
			: `${load.name} di ${pq(m, 'kg')} viene sollevat${load.e} con una fune a velocità costante. Quanto vale la tensione della fune?`;
		const sym = para ? 'R' : 'T';
		return {
			prompt: para ? "Trova la forza dell'aria." : 'Trova la tensione della fune.',
			problem: textBlock(problem),
			solution: `${sym} \\approx ${N(ans)}`,
			steps: [ZERO, para ? t("La forza dell'aria, verso l'alto, bilancia il peso:") : t("La tensione, verso l'alto, bilancia il peso:"), `${sym} = P = m \\cdot g = ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${N(P)} \\approx ${N(ans)}`],
			// the mass for the weight; zero because the velocity is constant
			answer: choiceOf(rng, qOpt(ans, 'N'), [qOpt(m, 'N'), qOpt('0', 'N')], nOpts(around(Pn))),
			params: { case: para ? 'paracadute' : 'fune', m },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: friction at constant velocity

function level2(rng: Rng): Built {
	const askMu = rng.next() < 0.5;
	for (;;) {
		const m = two(rng, true);
		const P = weight(m), Pn = Number(P);
		const head = `Una cassetta di ${pq(m, 'kg')} è trascinata sul pavimento con una fune orizzontale, a velocità costante;`;
		if (askMu) {
			const F = two(rng, rng.next() < 0.5);
			const ratio = Number(F) / Pn;
			if (ratio < 0.1 || ratio > 0.8) continue;
			const ans = r2(ratio);
			if (ans === null) continue;
			return {
				prompt: 'Trova il coefficiente di attrito.',
				problem: textBlock(`${head} la tensione della fune è di ${pq(F, 'N')}. Quanto vale il coefficiente di attrito dinamico?`),
				solution: `\\mu_d \\approx ${decTex(ans)}`,
				steps: [
					ZERO,
					t("L'attrito dinamico bilancia la tensione: ") + ` F_d = ${N(F)}`,
					`${t('La forza premente è il peso: ')} ${P_STEP(m, P)}`,
					`\\mu_d = \\dfrac{F_d}{F_\\perp} = \\dfrac{${N(F)}}{${N(P)}} = ${f3(ratio)}\\ldots \\approx ${decTex(ans)}`,
				],
				// the mass for the weight; the ratio upside down
				answer: choiceOf(rng, numOpt(ans), [r2(Number(F) / Number(m)), r2(Pn / Number(F))].filter((x): x is string => x !== null).map(numOpt), around(ratio).filter((x): x is string => x !== null).map(numOpt)),
				params: { case: 'coefficiente', m, F },
				scene: blockScene(`Una cassetta tirata verso destra da una fune orizzontale, con una forza di ${F.replace('.', ',')} newton.`, [{ nome: 'T', modulo: Number(F), angolo: 0 }]),
			};
		}
		const mu = coeff(rng, 10, 60);
		const F = Number(mu) * Pn;
		const ans = r2(F);
		if (ans === null || F < 1) continue;
		return {
			prompt: 'Trova la tensione della fune.',
			problem: textBlock(`${head} il coefficiente di attrito dinamico è $\\mu_d = ${decTex(mu)}$. Quanto vale la tensione della fune?`),
			solution: `T \\approx ${N(ans)}`,
			steps: [ZERO, t("La tensione bilancia l'attrito dinamico, con la forza premente uguale al peso:"), P_STEP(m, P), `T = F_d = \\mu_d \\cdot P = ${decTex(mu)} \\cdot ${N(P)} = ${f3(F)}\\ldots\\,\\text{N} \\approx ${N(ans)}`],
			// the mass for the weight; the whole weight
			answer: choiceOf(rng, qOpt(ans, 'N'), nOpts([r2(Number(mu) * Number(m)), r2(Pn)]), nOpts(around(F))),
			params: { case: 'forza', m, mu },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the slanted handle

function level3(rng: Rng): Built {
	const askFriction = rng.next() < 0.5;
	for (;;) {
		const a = rng.int(25, 60);
		const X = two(rng, false);
		const Xn = Number(X);
		if (askFriction) {
			const exact = Xn * cosD(a);
			const ans = r2(exact);
			if (ans === null) continue;
			return {
				prompt: 'Trova la forza che frena la valigia.',
				problem: textBlock(`Una valigia su rotelle è tirata a velocità costante con una forza di ${pq(X, 'N')}, lungo la maniglia inclinata di $${a}^\\circ$ sull'orizzontale. Quanto vale la forza che frena la valigia, parallela al pavimento?`),
				solution: `F_x \\approx ${N(ans)}`,
				steps: [ZERO, t('In orizzontale la forza che frena bilancia la componente orizzontale della forza della maniglia:'), `F_x = F \\cos\\alpha = ${N(X)} \\cdot \\cos ${a}^\\circ = ${f3(exact)}\\ldots\\,\\text{N} \\approx ${N(ans)}`],
				// the whole force; sine for cosine; divided by the cosine
				answer: choiceOf(rng, qOpt(ans, 'N'), nOpts([r2(Xn), r2(Xn * sinD(a)), r2(Xn / cosD(a))]), nOpts(around(exact))),
				params: { case: 'frenante', F: X, angle: a },
				scene: blockScene(`Una valigia tirata da una forza di ${X} newton inclinata di ${a} gradi sull'orizzontale.`, [{ nome: 'F', modulo: Xn, angolo: a }]),
			};
		}
		const exact = Xn / cosD(a);
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: 'Trova la forza sulla maniglia.',
			problem: textBlock(`Una valigia su rotelle è tirata a velocità costante lungo la maniglia inclinata di $${a}^\\circ$ sull'orizzontale; la forza che frena la valigia, parallela al pavimento, è di ${pq(X, 'N')}. Con quale forza è tirata la maniglia?`),
			solution: `F \\approx ${N(ans)}`,
			steps: [ZERO, t('La componente orizzontale della forza della maniglia bilancia la forza che frena:'), `F \\cos\\alpha = ${N(X)} \\quad\\Rightarrow\\quad F = \\dfrac{${N(X)}}{\\cos ${a}^\\circ} = ${f3(exact)}\\ldots\\,\\text{N} \\approx ${N(ans)}`],
			// multiplied by the cosine; divided by the sine; the same force
			answer: choiceOf(rng, qOpt(ans, 'N'), nOpts([r2(Xn * cosD(a)), r2(Xn / sinD(a)), r2(Xn)]), nOpts(around(exact))),
			params: { case: 'maniglia', Fx: X, angle: a },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: two perpendicular ropes

function level4(rng: Rng): Built {
	for (;;) {
		const F1 = two(rng, false), F2 = two(rng, false);
		const a = Number(F1), b = Number(F2);
		if (a === b || Math.min(a, b) < 0.4 * Math.max(a, b)) continue;
		const exact = Math.hypot(a, b);
		const ans = r2(exact);
		if (ans === null) continue;
		return {
			prompt: "Trova l'attrito.",
			problem: textBlock(`Due ragazzi tirano una cassa sul pavimento con due funi orizzontali perpendicolari tra loro, con forze di ${pq(F1, 'N')} e ${pq(F2, 'N')}. La cassa striscia a velocità costante. Quanto vale l'attrito?`),
			solution: `F_d \\approx ${N(ans)}`,
			steps: [
				t('Le due funi hanno una risultante di modulo'),
				`R = \\sqrt{${F1}^2 + ${F2}^2}\\,\\text{N} = ${f3(exact)}\\ldots\\,\\text{N}`,
				`${t("La velocità è costante: l'attrito è opposto alla risultante, con lo stesso modulo:")} F_d \\approx ${N(ans)}`,
			],
			// the moduli added as numbers; subtracted; the larger force only
			answer: choiceOf(rng, qOpt(ans, 'N'), nOpts([r2(a + b), r2(Math.abs(a - b)), r2(Math.max(a, b))]), nOpts(around(exact))),
			params: { case: 'funi', F1, F2 },
			scene: pointScene(`La cassa vista dall'alto: una fune la tira verso destra con ${F1} newton, l'altra verso l'alto nel disegno con ${F2} newton.`, [
				{ nome: 'F', sub: '1', modulo: a, angolo: 0 },
				{ nome: 'F', sub: '2', modulo: b, angolo: 90 },
			]),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4 };

function check(sample: Sample): string[] {
	const v = checkNumeric(sample);
	const needsScene = sample.level === 4 || sample.params.case === 'coefficiente' || sample.params.case === 'frenante';
	if (needsScene && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisPrimoPrincipio: Generator = {
	id: ID,
	title: 'Il primo principio della dinamica e i sistemi inerziali',
	levels: {
		1: { label: 'Velocità costante in verticale', constraints: ['un pacco con il paracadute o un carico sollevato con una fune', 'la forza è uguale al peso'] },
		2: { label: "L'attrito a velocità costante", constraints: ['trascinamento orizzontale', 'dalla forza al coefficiente, o dal coefficiente alla forza'] },
		3: { label: 'La maniglia inclinata', constraints: ['inclinazione da 25° a 60°', 'solo la componente orizzontale bilancia la forza che frena'] },
		4: { label: 'Due funi perpendicolari', constraints: ["l'attrito bilancia la risultante delle due funi", 'la forza più piccola almeno il 40% della più grande'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisPrimoPrincipio;
