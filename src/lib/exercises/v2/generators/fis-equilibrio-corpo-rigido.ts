/**
 * L'equilibrio di un corpo rigido. Spec: specs/exercises/fis-equilibrio-corpo-rigido.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/23-fis-equilibrio-corpo-rigido.md): a light rod on a
 * fulcrum with two weights (the missing distance or weight, from the equal moments); the fulcrum's reaction, the sum
 * of the weights once the missing one is found; a heavy homogeneous rod resting off its centre (its own weight in its
 * middle); the reactions of a light beam on two supports with a load; the same with the beam's own weight. Numbers
 * are built backwards so every answer is exact (weights in whole newtons, distances with two significant figures).
 * Distractors from the lesson's warnings: the ratio upside down, the beam's weight forgotten, the arm of the rod's
 * weight measured from its end, the two reactions swapped. The scene `asta-forze` draws the rod, the supports, the
 * forces and the distances of the text; an unknown force is a "?" drawn as long as the others, an unknown distance a
 * "?" not drawn to scale.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { type Built, type Format, type R, commonCheck, dec, figs, generateWith, n, num, pickStep, pv, q, qty, r3, sceneText, shown, t, toChoice, vq } from '../fis-corpo-rigido';

export const ID = 'fis-equilibrio-corpo-rigido';

const S2: Format = { kind: 'sig', s: 2 };
const INT: Format = { kind: 'int' };
const N = (r: R) => vq(r, 'N', INT);
const Mt = (r: R) => vq(r, 'm', S2);
/** A derived distance written with all its figures (1,75 m), or like a datum when it has two (1,5 m). */
const Mx = (r: R) => (twoFig(r) ? Mt(r) : qty(dec(r), 'm'));
const sN = (r: R) => sceneText(r, 'N', INT);
const sM = (r: R) => sceneText(r, 'm', S2);
/** A distance of the exercises, exactly two significant figures (0,20 m, 1,5 m). */
const twoFig = (r: R) => shown(r, S2).equals(r) && r.mul(n(100)).isInteger();

type SForce = { x: number; angolo: number; nome: string; sub?: string; valore: string; lunghezza?: number };
type SQuota = { da: number; a: number; testo: string; livello?: number; lato?: 'sopra' | 'sotto' };
function scene(alt: string, d: { lunghezza: number; appoggi: { x: number; tipo: 'fulcro' }[]; forze: SForce[]; quote: SQuota[]; punti?: { x: number; nome: string; dx?: number }[] }): SceneRef {
	return { type: 'asta-forze', data: { ...d, punti: d.punti ?? [] }, alt };
}
/** Arrow lengths to scale (the longest 1,4 cm, none under 0,4 cm), or all 1,2 cm when one of the forces is unknown. */
function lengths(values: (R | null)[]) {
	if (values.some((v) => v === null)) return values.map(() => 1.2);
	const max = Math.max(...values.map((v) => num(v!)));
	return values.map((v) => r3(Math.max(0.4, (1.4 * num(v!)) / max)));
}
const saysM = (r: R) => `${sM(r).replace(' m', '')} metri`;

// ---------------------------------------------------------------------------
// Levels 1 and 2: a light rod on a fulcrum

const weight = (rng: Rng) => q(10 * rng.int(2, 30));
const arm = (rng: Rng) => pickStep(rng, 2, 20, q(1, 10));

function seesaw(rng: Rng) {
	for (;;) {
		const P1 = weight(rng), P2 = weight(rng), b1 = arm(rng);
		if (P1.equals(P2)) continue;
		const b2 = P1.mul(b1).div(P2);
		if (!twoFig(b2) || b2.compare(q(1, 10)) < 0 || b2.compare(q(25, 10)) > 0 || b2.equals(b1)) continue;
		return { P1, P2, b1, b2 };
	}
}

function seesawScene(alt: string, s: { P1: R; P2: R | null; b1: R; b2: R | null }, label2: string) {
	// The unknown distance is not drawn to scale: the right weight hangs as far as the left one.
	const b2 = s.b2 ?? s.b1;
	const x0 = 0.15, xf = x0 + num(s.b1);
	const [l1, l2] = lengths([s.P1, s.P2]);
	return scene(alt, {
		lunghezza: r3(num(s.b1) + num(b2) + 0.3),
		appoggi: [{ x: r3(xf), tipo: 'fulcro' }],
		forze: [
			{ x: x0, angolo: -90, nome: 'P', sub: '1', valore: sN(s.P1), lunghezza: l1 },
			{ x: r3(xf + num(b2)), angolo: -90, nome: 'P', sub: '2', valore: s.P2 ? sN(s.P2) : '?', lunghezza: l2 },
		],
		quote: [
			{ da: x0, a: r3(xf), testo: sM(s.b1), lato: 'sopra' },
			{ da: r3(xf), a: r3(xf + num(b2)), testo: label2, lato: 'sopra' },
		],
	});
}

const intro = "Un'asta di peso trascurabile è appoggiata su un fulcro.";

function level1(rng: Rng): Built {
	const { P1, P2, b1, b2 } = seesaw(rng);
	if (rng.next() < 0.55) {
		return {
			kind: 'value',
			prompt: 'Trova la distanza.',
			problem: textBlock(`${intro} A sinistra del fulcro, a ${pv(b1, 'm', S2)}, è appeso un peso di ${pv(P1, 'N', INT)}; a destra è appeso un peso di ${pv(P2, 'N', INT)}. A che distanza dal fulcro va appeso il peso di destra perché l'asta stia in equilibrio in orizzontale?`),
			solution: `b_2 = ${Mt(b2)}`,
			steps: [
				t("Polo nel fulcro: il peso di sinistra fa ruotare in senso antiorario, quello di destra in senso orario."),
				`P_1 \\cdot b_1 - P_2 \\cdot b_2 = 0 \\quad\\Rightarrow\\quad b_2 = \\frac{P_1 \\cdot b_1}{P_2}`,
				`b_2 = \\frac{${N(P1)} \\cdot ${Mt(b1)}}{${N(P2)}} = ${Mt(b2)}`,
			],
			truth: b2,
			unit: 'm',
			format: S2,
			// the ratio upside down; the same distance; the product without the division
			mistakes: [P2.mul(b1).div(P1), b1, b1.add(b2)],
			params: { case: 'distanza' },
			scene: seesawScene(`Un'asta su un fulcro: a sinistra, a ${saysM(b1)}, un peso di ${P1} newton; a destra un peso di ${P2} newton, a una distanza da trovare`, { P1, P2, b1, b2: null }, '?'),
		};
	}
	return {
		kind: 'value',
		prompt: 'Trova il peso.',
		problem: textBlock(`${intro} A sinistra del fulcro, a ${pv(b1, 'm', S2)}, è appeso un peso di ${pv(P1, 'N', INT)}. Quale peso bisogna appendere a destra, a ${pv(b2, 'm', S2)} dal fulcro, perché l'asta stia in equilibrio in orizzontale?`),
		solution: `P_2 = ${N(P2)}`,
		steps: [
			t('Polo nel fulcro: i momenti dei due pesi devono essere uguali e opposti.'),
			`P_1 \\cdot b_1 = P_2 \\cdot b_2 \\quad\\Rightarrow\\quad P_2 = \\frac{P_1 \\cdot b_1}{b_2}`,
			`P_2 = \\frac{${N(P1)} \\cdot ${Mt(b1)}}{${Mt(b2)}} = ${N(P2)}`,
		],
		truth: P2,
		unit: 'N',
		format: INT,
		// the ratio upside down; the same weight; the two weights' sum
		mistakes: [P1.mul(b2).div(b1), P1, P1.add(P2)],
		params: { case: 'peso' },
		scene: seesawScene(`Un'asta su un fulcro: a sinistra, a ${saysM(b1)}, un peso di ${P1} newton; a destra, a ${saysM(b2)}, un peso da trovare`, { P1, P2: null, b1, b2 }, sM(b2)),
	};
}

function level2(rng: Rng): Built {
	const { P1, P2, b1, b2 } = seesaw(rng);
	const R = P1.add(P2);
	return {
		kind: 'value',
		prompt: 'Trova la reazione del fulcro.',
		problem: textBlock(`${intro} A sinistra del fulcro, a ${pv(b1, 'm', S2)}, è appeso un peso di ${pv(P1, 'N', INT)}; a destra, a ${pv(b2, 'm', S2)} dal fulcro, è appeso il peso che tiene l'asta in equilibrio in orizzontale. Con quale forza il fulcro sostiene l'asta?`),
		solution: `F_v = ${N(R)}`,
		steps: [
			t('Il peso di destra, dai momenti rispetto al fulcro:'),
			`P_2 = \\frac{P_1 \\cdot b_1}{b_2} = \\frac{${N(P1)} \\cdot ${Mt(b1)}}{${Mt(b2)}} = ${N(P2)}`,
			t('La risultante è zero: la reazione verso l’alto regge i due pesi.'.replace('’', "'")),
			`F_v = P_1 + P_2 = ${N(P1)} + ${N(P2)} = ${N(R)}`,
		],
		truth: R,
		unit: 'N',
		format: INT,
		// one weight only; the missing weight only; the missing weight found upside down, added
		mistakes: [P1, P2, P1.add(P1.mul(b2).div(b1)), P1.sub(P2).abs()],
		params: { case: 'reazione' },
		scene: seesawScene(`Un'asta su un fulcro: a sinistra, a ${saysM(b1)}, un peso di ${P1} newton; a destra, a ${saysM(b2)}, il peso che la tiene in equilibrio`, { P1, P2: null, b1, b2 }, sM(b2)),
	};
}

// ---------------------------------------------------------------------------
// Level 3: a heavy rod resting off its centre

function level3(rng: Rng): Built {
	for (;;) {
		const L = pickStep(rng, 2, 8, q(1, 2)); // 1,0 m to 4,0 m
		const a = pickStep(rng, 2, 19, q(1, 10));
		const half = L.div(n(2));
		if (a.compare(half.sub(q(1, 10))) > 0) continue;
		const P = q(10 * rng.int(2, 20));
		const F = P.mul(half.sub(a)).div(a);
		if (!F.isInteger() || figs(F) > 2 || F.compare(n(10)) < 0 || F.compare(n(600)) > 0) continue;
		const [lF, lP] = lengths([F, P]);
		const sc = (fv: string, pv_: string, unknown: boolean) =>
			scene(`Un'asta omogenea lunga ${saysM(L)} su un fulcro a ${saysM(a)} dall'estremità sinistra; il peso dell'asta ${pv_} nel suo centro e un peso ${fv} appeso all'estremità sinistra`, {
				lunghezza: num(L),
				appoggi: [{ x: num(a), tipo: 'fulcro' }],
				forze: [
					{ x: 0, angolo: -90, nome: 'F', valore: fv, lunghezza: unknown ? 1.2 : lF },
					{ x: num(half), angolo: -90, nome: 'P', valore: pv_, lunghezza: unknown ? 1.2 : lP },
				],
				quote: [
					{ da: 0, a: num(a), testo: sM(a), lato: 'sopra', livello: 0 },
					{ da: 0, a: num(L), testo: sM(L), lato: 'sopra', livello: 1 },
				],
			});
		const arm = half.sub(a);
		const common = [
			t(`Il peso dell'asta è nel suo centro, a `) + `${Mx(half)} - ${Mt(a)} = ${Mx(arm)}` + t(' a destra del fulcro.'),
			t('Polo nel fulcro: il peso appeso fa ruotare in senso antiorario, il peso dell’asta in senso orario.'.replace('’', "'")),
		];
		if (rng.next() < 0.65) {
			return {
				kind: 'value',
				prompt: 'Trova il peso da appendere.',
				problem: textBlock(`Un'asta omogenea lunga ${pv(L, 'm', S2)}, che pesa ${pv(P, 'N', INT)}, è appoggiata su un fulcro a ${pv(a, 'm', S2)} dall'estremità sinistra. Quale peso bisogna appendere all'estremità sinistra perché l'asta stia in equilibrio in orizzontale?`),
				solution: `F = ${N(F)}`,
				steps: [...common, `F \\cdot ${Mt(a)} - ${N(P)} \\cdot ${Mx(arm)} = 0 \\quad\\Rightarrow\\quad F = ${N(F)}`],
				truth: F,
				unit: 'N',
				format: INT,
				// the arm of the rod's weight measured from its end; the rod's weight itself; the ratio upside down
				mistakes: [P.mul(half).div(a), P, P.mul(a).div(arm), P.mul(L.sub(a)).div(a)],
				params: { case: 'appeso' },
				scene: sc('?', sN(P), true),
			};
		}
		return {
			kind: 'value',
			prompt: "Trova il peso dell'asta.",
			problem: textBlock(`Un'asta omogenea lunga ${pv(L, 'm', S2)} è appoggiata su un fulcro a ${pv(a, 'm', S2)} dall'estremità sinistra, e sta in equilibrio in orizzontale con un peso di ${pv(F, 'N', INT)} appeso all'estremità sinistra. Quanto pesa l'asta?`),
			solution: `P = ${N(P)}`,
			steps: [...common, `${N(F)} \\cdot ${Mt(a)} - P \\cdot ${Mx(arm)} = 0 \\quad\\Rightarrow\\quad P = ${N(P)}`],
			truth: P,
			unit: 'N',
			format: INT,
			// the arm from the end; the weight hung; the ratio upside down
			mistakes: [F.mul(a).div(half), F, F.mul(arm).div(a)],
			params: { case: 'asta' },
			scene: sc(sN(F), '?', true),
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: a beam on two supports

function beam(rng: Rng, heavy: boolean): Built {
	for (;;) {
		const L = pickStep(rng, 4, 12, q(1, 2)); // 2,0 m to 6,0 m
		const a = pickStep(rng, 1, 2 * num(L) - 1, q(1, 2));
		if (a.equals(L.div(n(2)))) continue;
		const F = q(100 * rng.int(2, 12));
		const P = heavy ? q(100 * rng.int(2, 10)) : n(0);
		const RB = F.mul(a).div(L).add(P.div(n(2)));
		const RA = F.add(P).sub(RB);
		if (!RA.isInteger() || !RB.isInteger() || figs(RA) > 2 || figs(RB) > 2) continue;
		const askA = rng.next() < 0.5;
		const ans = askA ? RA : RB;
		const other = askA ? RB : RA;
		const [lF, lP] = lengths(heavy ? [F, P] : [F, F]);
		const forces: SForce[] = [{ x: num(a), angolo: -90, nome: 'F', valore: sN(F), lunghezza: lF }];
		if (heavy) forces.push({ x: num(L) / 2, angolo: -90, nome: 'P', valore: sN(P), lunghezza: lP });
		const pole = askA ? 'B' : 'A';
		const armF = askA ? L.sub(a) : a;
		const steps = [
			...(heavy ? [t(`Il peso della trave è nel suo centro, a `) + Mx(L.div(n(2))) + t(' da ciascun appoggio.')] : []),
			t(`Polo in ${pole}, per cui passa la reazione che non si chiede: il braccio della reazione in ${askA ? 'A' : 'B'} è la lunghezza della trave.`),
			`F_${askA ? 'A' : 'B'} \\cdot ${Mt(L)} = ${N(F)} \\cdot ${Mx(armF)}${heavy ? ` + ${N(P)} \\cdot ${Mx(L.div(n(2)))}` : ''}`,
			`F_${askA ? 'A' : 'B'} = ${N(ans)}`,
		];
		const noWeight = F.mul(armF).div(L);
		return {
			kind: 'value',
			prompt: 'Trova la reazione.',
			problem: textBlock(
				`${heavy ? `Una trave omogenea lunga ${pv(L, 'm', S2)}, che pesa ${pv(P, 'N', INT)},` : `Una trave di peso trascurabile, lunga ${pv(L, 'm', S2)},`} è appoggiata alle estremità $A$ e $B$. Sulla trave, a ${pv(a, 'm', S2)} da $A$, c'è un carico di ${pv(F, 'N', INT)}. Quanto vale la reazione dell'appoggio in $${askA ? 'A' : 'B'}$?`,
			),
			solution: `F_${askA ? 'A' : 'B'} = ${N(ans)}`,
			steps,
			truth: ans,
			unit: 'N',
			format: INT,
			// the two reactions swapped; half the loads; (heavy) the beam's weight forgotten, or all of it on one support
			mistakes: heavy ? [other, noWeight, F.add(P).div(n(2)), noWeight.add(P)] : [other, F.div(n(2)), F],
			params: { case: `${heavy ? 'pesante' : 'leggera'}-${askA ? 'A' : 'B'}` },
			scene: scene(`Una trave ${heavy ? 'omogenea' : 'di peso trascurabile'} lunga ${saysM(L)} su due appoggi alle estremità A e B; a ${saysM(a)} da A un carico di ${F} newton${heavy ? `, e il peso della trave, ${P} newton, nel suo centro` : ''}`, {
				lunghezza: num(L),
				appoggi: [
					{ x: 0, tipo: 'fulcro' },
					{ x: num(L), tipo: 'fulcro' },
				],
				forze: forces,
				quote: [
					{ da: 0, a: num(a), testo: sM(a), lato: 'sopra', livello: 0 },
					{ da: 0, a: num(L), testo: sM(L), lato: 'sopra', livello: 1 },
				],
				punti: [
					{ x: 0, nome: 'A', dx: -0.6 },
					{ x: num(L), nome: 'B', dx: 0.6 },
				],
			}),
		};
	}
}

const level4 = (rng: Rng) => beam(rng, false);
const level5 = (rng: Rng) => beam(rng, true);

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	if (sample.answer.kind !== 'number') v.push('la risposta deve essere un valore');
	if (!sample.scene) v.push('manca la scena');
	return v;
}

export const fisEquilibrioCorpoRigido: Generator = {
	id: ID,
	title: "L'equilibrio di un corpo rigido",
	levels: {
		1: { label: "L'asta sul fulcro", constraints: ['asta di peso trascurabile, due pesi', 'la distanza (55%) o il peso (45%) che manca'] },
		2: { label: 'La reazione del fulcro', constraints: ['prima il peso che manca, poi la somma dei pesi'] },
		3: { label: "L'asta con il suo peso", constraints: ['asta omogenea appoggiata fuori dal centro', 'il peso da appendere (65%) o il peso dell’asta (35%)'] },
		4: { label: 'La trave su due appoggi', constraints: ['trave di peso trascurabile con un carico', 'la reazione in A o in B'] },
		5: { label: 'La trave con il suo peso', constraints: ['trave omogenea con un carico', 'la reazione in A o in B'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice,
};

export default fisEquilibrioCorpoRigido;
