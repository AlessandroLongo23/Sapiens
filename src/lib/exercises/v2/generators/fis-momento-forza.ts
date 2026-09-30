/**
 * Il momento di una forza e di una coppia di forze. Spec: specs/exercises/fis-momento-forza.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/22-fis-momento-forza.md): the moment of a force
 * perpendicular to a rod, M = F b (the arm in metres or in centimetres); the force or the arm from the moment; the
 * moment of an oblique force, M = F d sin α; the total moment of two forces with its sign (counterclockwise
 * positive) and its sense of rotation; the moment of a couple, M = F b with b the distance between the two lines of
 * action. Answers rounded to two significant figures, as the data; a value too close to a rounding boundary is never
 * used. Distractors from the lesson's warnings: the arm left in centimetres, the product upside down, the angle
 * forgotten or taken with the cosine, the moments added without their signs, the radius taken for the arm of the
 * couple. The scene `asta-forze` draws the rod, the pivot, the forces and the distances of the text; what is asked is
 * a "?".
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import {
	type Built,
	type Format,
	type R,
	type Unit,
	commonCheck,
	dec,
	fmt,
	generateWith,
	n,
	num,
	pickStep,
	pv,
	q,
	qty,
	r3,
	RESAMPLE,
	sceneText,
	shown,
	t,
	toChoice,
	vq,
} from '../fis-corpo-rigido';
import { decimals } from '../fisica-forze';

export const ID = 'fis-momento-forza';

const S2: Format = { kind: 'sig', s: 2 };
const INT: Format = { kind: 'int' };
const DEG = Math.PI / 180;

/** A force of the exercises: 10 N to 95 N in steps of 5. */
const force = (rng: Rng) => q(5 * rng.int(2, 19));
/** A distance: 0,10 m to 0,95 m in steps of 0,05. */
const dist = (rng: Rng) => pickStep(rng, 2, 19, q(5, 100));
const cmOf = (m: R) => m.mul(n(100));
/** "= x" when the value is written exactly, "= 15{,}75 \approx 16" when it is rounded (or "\approx 16" when its decimals do not end). */
function result(exact: R, u: Unit, f: Format) {
	const w = shown(exact, f);
	if (w.equals(exact)) return `= ${vq(exact, u, f)}`;
	return decimals(exact) <= 6 ? `= ${qty(dec(exact), u)} \\approx ${vq(w, u, f)}` : `\\approx ${vq(w, u, f)}`;
}
/** A decimal written with all its digits (no rounding): 15{,}75. */
const full = (r: R) => fmt(r, { kind: 'int' });

type SForce = { x: number; angolo: number; nome: string; sub?: string; valore: string; lunghezza?: number; arco?: string };
type SQuota = { da: number; a: number; testo: string; livello?: number; lato?: 'sopra' | 'sotto' };
function rodScene(alt: string, d: { lunghezza: number; perno: number; forze: SForce[]; quote: SQuota[] }): SceneRef {
	return { type: 'asta-forze', data: { lunghezza: d.lunghezza, appoggi: [{ x: d.perno, tipo: 'perno' }], forze: d.forze, quote: d.quote, punti: [{ x: d.perno, nome: 'O' }] }, alt };
}
const sayDist = (b: R, cm: boolean) => (cm ? `${full(cmOf(b))} centimetri` : `${fmt(b, S2).replace('{,}', ',')} metri`);

// ---------------------------------------------------------------------------
// Level 1: M = F b, the force perpendicular to the rod

function level1(rng: Rng): Built {
	const F = force(rng);
	const b = dist(rng);
	const cm = rng.next() < 0.4;
	const M = F.mul(b);
	const up = rng.next() < 0.5;
	const bText = cm ? pv(cmOf(b), 'cm', INT) : pv(b, 'm', S2);
	const steps = [
		...(cm ? [`${t('Il braccio in metri: ')} b = ${vq(cmOf(b), 'cm', INT)} = ${vq(b, 'm', S2)}`] : []),
		t("La forza è perpendicolare all'asta: il braccio è la distanza dal perno."),
		`M = F \\cdot b = ${vq(F, 'N', INT)} \\cdot ${vq(b, 'm', S2)} ${result(M, 'Nm', S2)}`,
	];
	const L = r3(num(b) * 1.3);
	return {
		kind: 'value',
		prompt: 'Calcola il momento.',
		problem: textBlock(`Un'asta può ruotare intorno a un perno $O$. Una forza di ${pv(F, 'N', INT)}, perpendicolare all'asta, è applicata a ${bText} da $O$. Quanto vale il momento della forza rispetto a $O$?`),
		solution: `M ${result(M, 'Nm', S2)}`,
		steps,
		truth: M,
		unit: 'Nm',
		format: S2,
		// the arm left in centimetres; the product upside down; a comma moved
		mistakes: cm ? [F.mul(cmOf(b)), F.div(b), M.mul(n(10))] : [F.div(b), M.mul(n(10)), M.div(n(10))],
		params: { case: cm ? 'cm' : 'm' },
		scene: rodScene(`Un'asta che ruota intorno al perno O, all'estremità sinistra; a ${sayDist(b, cm)} da O una forza di ${full(F)} newton perpendicolare all'asta, verso ${up ? "l'alto" : 'il basso'}`, {
			lunghezza: L,
			perno: 0,
			forze: [{ x: num(b), angolo: up ? 90 : -90, nome: 'F', valore: `${full(F)} N` }],
			quote: [{ da: 0, a: num(b), testo: cm ? `${full(cmOf(b))} cm` : sceneText(b, 'm', S2), lato: up ? 'sotto' : 'sopra' }],
		}),
	};
}

// ---------------------------------------------------------------------------
// Level 2: the force or the arm from the moment

function level2(rng: Rng): Built {
	const F0 = force(rng);
	const b = dist(rng);
	const M = shown(F0.mul(b), S2);
	const up = rng.next() < 0.5;
	const L = r3(num(b) * 1.3);
	if (rng.next() < 0.5) {
		const cm = rng.next() < 0.4;
		const F = M.div(b);
		const bText = cm ? pv(cmOf(b), 'cm', INT) : pv(b, 'm', S2);
		return {
			kind: 'value',
			prompt: 'Trova la forza.',
			problem: textBlock(`Una forza perpendicolare a un'asta è applicata a ${bText} dal perno $O$ intorno a cui l'asta può ruotare, e il suo momento rispetto a $O$ vale ${pv(M, 'Nm', S2)}. Quanto vale la forza?`),
			solution: `F ${result(F, 'N', S2)}`,
			steps: [
				...(cm ? [`${t('Il braccio in metri: ')} b = ${vq(cmOf(b), 'cm', INT)} = ${vq(b, 'm', S2)}`] : []),
				`M = F \\cdot b \\quad\\Rightarrow\\quad F = \\frac{M}{b}`,
				`F = \\frac{${vq(M, 'Nm', S2)}}{${vq(b, 'm', S2)}} ${result(F, 'N', S2)}`,
			],
			truth: F,
			unit: 'N',
			format: S2,
			// the arm left in centimetres; the product; the quotient upside down
			mistakes: cm ? [M.div(cmOf(b)), M.mul(b), F.mul(n(10))] : [M.mul(b), F.mul(n(10)), F.div(n(10))],
			params: { case: 'forza', unitaBraccio: cm ? 'cm' : 'm' },
			scene: rodScene(`Un'asta che ruota intorno al perno O; a ${sayDist(b, cm)} da O una forza perpendicolare all'asta, verso ${up ? "l'alto" : 'il basso'}, di intensità da trovare`, {
				lunghezza: L,
				perno: 0,
				forze: [{ x: num(b), angolo: up ? 90 : -90, nome: 'F', valore: '?' }],
				quote: [{ da: 0, a: num(b), testo: cm ? `${full(cmOf(b))} cm` : sceneText(b, 'm', S2), lato: up ? 'sotto' : 'sopra' }],
			}),
		};
	}
	const bb = M.div(F0);
	return {
		kind: 'value',
		prompt: 'Trova il braccio.',
		problem: textBlock(`Una forza di ${pv(F0, 'N', INT)}, perpendicolare a un'asta, ha un momento di ${pv(M, 'Nm', S2)} rispetto al perno $O$ intorno a cui l'asta può ruotare. A che distanza da $O$ è applicata?`),
		solution: `b ${result(bb, 'm', S2)}`,
		steps: [`M = F \\cdot b \\quad\\Rightarrow\\quad b = \\frac{M}{F}`, `b = \\frac{${vq(M, 'Nm', S2)}}{${vq(F0, 'N', INT)}} ${result(bb, 'm', S2)}`],
		truth: bb,
		unit: 'm',
		format: S2,
		// the quotient upside down; a comma moved either way
		mistakes: [F0.div(M), bb.mul(n(10)), bb.div(n(10))],
		params: { case: 'braccio' },
		scene: rodScene(`Un'asta che ruota intorno al perno O; una forza di ${full(F0)} newton perpendicolare all'asta, verso ${up ? "l'alto" : 'il basso'}, applicata a una distanza da O da trovare`, {
			lunghezza: L,
			perno: 0,
			forze: [{ x: num(b), angolo: up ? 90 : -90, nome: 'F', valore: `${full(F0)} N` }],
			quote: [{ da: 0, a: num(b), testo: '?', lato: up ? 'sotto' : 'sopra' }],
		}),
	};
}

// ---------------------------------------------------------------------------
// Level 3: an oblique force, M = F d sin α

const ANGLES = [...Array.from({ length: 13 }, (_, i) => 15 + 5 * i), ...Array.from({ length: 13 }, (_, i) => 105 + 5 * i)];

/** x rounded to 2 significant figures as a rational, or a resample when x is within 1% of a step of a boundary. */
function round2(x: number): R {
	const e = Math.floor(Math.log10(x));
	const scaled = x / 10 ** (e - 1);
	const frac = scaled - Math.floor(scaled);
	if (Math.abs(frac - 0.5) < 0.02) throw RESAMPLE();
	const k = Math.round(scaled);
	return e - 1 >= 0 ? q(k * 10 ** (e - 1)) : q(k, 10 ** (1 - e));
}
/** A float as an exact rational with 8 decimals, for params.truth (the checker recomputes it with SymPy). */
const approx = (x: number) => q(Math.round(x * 1e8), 1e8);
const dec4 = (x: number) => x.toFixed(4).replace('.', '{,}');

function level3(rng: Rng): Built {
	const F = force(rng);
	const d = dist(rng);
	const a = rng.pick(ANGLES);
	const up = rng.next() < 0.5;
	const s = Math.sin(a * DEG);
	const Mx = num(F) * num(d) * s;
	const bx = num(d) * s;
	const M = round2(Mx);
	const truth = approx(Mx);
	if (!shown(truth, S2).equals(M)) throw RESAMPLE();
	const L = r3(num(d) * 1.25);
	return {
		kind: 'value',
		prompt: 'Calcola il momento.',
		problem: textBlock(`Un'asta può ruotare intorno a un perno $O$. A ${pv(d, 'm', S2)} da $O$ è applicata una forza di ${pv(F, 'N', INT)}, che forma un angolo di $${a}^\\circ$ con l'asta. Quanto vale il momento della forza rispetto a $O$?`),
		solution: `M \\approx ${vq(M, 'Nm', S2)}`,
		steps: [
			`${t("Il braccio è la distanza di O dalla retta d'azione: ")} b = d \\sin\\alpha`,
			`b = ${vq(d, 'm', S2)} \\cdot \\sin ${a}^\\circ = ${dec4(bx)}\\ldots\\,\\text{m}`,
			`M = F \\cdot b = ${vq(F, 'N', INT)} \\cdot ${dec4(bx)}\\ldots\\,\\text{m} \\approx ${vq(M, 'Nm', S2)}`,
		],
		truth,
		unit: 'Nm',
		format: S2,
		// the angle forgotten (F d); the cosine; the calculator in radians
		mistakes: [F.mul(d), approx(num(F) * num(d) * Math.abs(Math.cos(a * DEG))), approx(num(F) * num(d) * Math.abs(Math.sin(a)))],
		params: { case: a < 90 ? 'acuto' : 'ottuso', angolo: a },
		scene: rodScene(`Un'asta che ruota intorno al perno O, all'estremità sinistra; a ${sayDist(d, false)} da O una forza di ${full(F)} newton che forma un angolo di ${a} gradi con l'asta, verso ${up ? "l'alto" : 'il basso'}`, {
			lunghezza: L,
			perno: 0,
			forze: [{ x: num(d), angolo: up ? a : -a, nome: 'F', valore: `${full(F)} N`, arco: `${a}°` }],
			quote: [{ da: 0, a: num(d), testo: sceneText(d, 'm', S2), lato: up ? 'sotto' : 'sopra' }],
		}),
	};
}

// ---------------------------------------------------------------------------
// Level 4: the total moment of two forces, with its sign

const ARMS = Array.from({ length: 8 }, (_, i) => q(2 + i, 10)); // 0,20 m to 0,90 m
const verso = (up: boolean) => (up ? "verso l'alto" : 'verso il basso');
const sense = (M: R) => (M.sign() > 0 ? 'antiorario' : 'orario');
const momentOpt = (M: R) => ({ latex: `${vq(M.abs(), 'Nm', INT)}\\ \\text{${sense(M)}}`, values: [M.toString()] });

function level4(rng: Rng): Built {
	const centre = rng.next() < 0.6;
	const F1 = force(rng), F2 = force(rng);
	const b1 = rng.pick(ARMS);
	let b2 = rng.pick(ARMS);
	if (!centre) while (b2.equals(b1)) b2 = rng.pick(ARMS);
	const up1 = rng.next() < 0.5;
	// At one end both forces are on the same side: opposite senses, or the signs would not matter.
	const up2 = centre ? rng.next() < 0.5 : !up1;
	const m1 = F1.mul(b1), m2 = F2.mul(b2);
	if (!m1.isInteger() || !m2.isInteger()) throw RESAMPLE();
	// F1 on the right of O; F2 on the left (centre) or also on the right (end).
	const s1 = up1 ? 1 : -1;
	const s2 = centre ? (up2 ? -1 : 1) : up2 ? 1 : -1;
	const M1 = m1.mul(n(s1)), M2 = m2.mul(n(s2));
	const M = M1.add(M2);
	if (M.abs().compare(n(2)) < 0 || m1.equals(m2)) throw RESAMPLE();
	const sum = m1.add(m2);
	const big = m1.compare(m2) > 0 ? M1 : M2;
	const diff = m1.sub(m2).abs().mul(n(M.sign()));
	const signed = (x: R) => `${x.sign() > 0 ? '+' : '-'}${vq(x.abs(), 'Nm', INT)}`;
	const rot = (s: number, i: number) => `${t('La forza ')} F_${i} ${t(` fa ruotare in senso ${s > 0 ? 'antiorario' : 'orario'}: `)}`;
	// The drawing: the rod 2 m long in metres from its left end, O at 1,0 m (centre) or at 0 (end).
	const Lr = centre ? 2 : r3(num(b1.compare(b2) > 0 ? b1 : b2) + 0.2);
	const O = centre ? 1 : 0;
	const x2 = r3(centre ? O - num(b2) : num(b2));
	return {
		kind: 'choice',
		prompt: 'Trova il momento totale.',
		problem: textBlock(
			centre
				? `Un'asta può ruotare intorno a un perno $O$ nel suo centro. A destra di $O$, a ${pv(b1, 'm', S2)}, agisce la forza $F_1 = ${vq(F1, 'N', INT)}$ ${verso(up1)}; a sinistra di $O$, a ${pv(b2, 'm', S2)}, la forza $F_2 = ${vq(F2, 'N', INT)}$ ${verso(up2)}. Le forze sono perpendicolari all'asta. Quanto vale il momento totale rispetto a $O$, e in che verso fa ruotare l'asta?`
				: `Un'asta può ruotare intorno a un perno $O$ a un'estremità. A ${pv(b1, 'm', S2)} da $O$ agisce la forza $F_1 = ${vq(F1, 'N', INT)}$ ${verso(up1)}; a ${pv(b2, 'm', S2)} da $O$, la forza $F_2 = ${vq(F2, 'N', INT)}$ ${verso(up2)}. Le forze sono perpendicolari all'asta. Quanto vale il momento totale rispetto a $O$, e in che verso fa ruotare l'asta?`,
		),
		solution: `M = ${signed(M)}\\ ${t(sense(M))}`,
		steps: [
			`${rot(s1, 1)} M_1 = ${s1 > 0 ? '+' : '-'}${vq(F1, 'N', INT)} \\cdot ${vq(b1, 'm', S2)} = ${signed(M1)}`,
			`${rot(s2, 2)} M_2 = ${s2 > 0 ? '+' : '-'}${vq(F2, 'N', INT)} \\cdot ${vq(b2, 'm', S2)} = ${signed(M2)}`,
			`M = M_1 + M_2 = ${signed(M)}`,
			t(`Il momento totale è ${M.sign() > 0 ? 'positivo' : 'negativo'}: l'asta ruota in senso ${sense(M)}.`),
		],
		right: momentOpt(M),
		// the sense the other way; the moments added without their signs, in the sense of the larger or the other
		// (when both turn the same way, the moments subtracted as if they were opposed)
		others: M1.sign() === M2.sign() ? [momentOpt(M.neg()), momentOpt(diff), momentOpt(diff.neg())] : [momentOpt(M.neg()), momentOpt(big.sign() > 0 ? sum : sum.neg()), momentOpt(big.sign() > 0 ? sum.neg() : sum)],
		params: { case: centre ? 'centro' : 'estremo' },
		scene: rodScene(
			`Un'asta con il perno O ${centre ? 'nel centro' : "all'estremità sinistra"}; F1 di ${full(F1)} newton ${verso(up1)} ${centre ? 'a destra di O' : 'da O'} a ${sayDist(b1, false)}, F2 di ${full(F2)} newton ${verso(up2)} ${centre ? 'a sinistra di O' : 'da O'} a ${sayDist(b2, false)}`,
			{
				lunghezza: Lr,
				perno: O,
				forze: [
					{ x: r3(O + num(b1)), angolo: up1 ? 90 : -90, nome: 'F', sub: '1', valore: `${full(F1)} N` },
					{ x: x2, angolo: up2 ? 90 : -90, nome: 'F', sub: '2', valore: `${full(F2)} N` },
				],
				quote: centre
					? [
							{ da: O, a: r3(O + num(b1)), testo: sceneText(b1, 'm', S2), lato: up1 ? 'sotto' : 'sopra' },
							{ da: x2, a: O, testo: sceneText(b2, 'm', S2), lato: up2 ? 'sotto' : 'sopra' },
						]
					: [
							{ da: 0, a: num(b1), testo: sceneText(b1, 'm', S2), lato: 'sopra', livello: b1.compare(b2) > 0 ? 1 : 0 },
							{ da: 0, a: num(b2), testo: sceneText(b2, 'm', S2), lato: 'sotto', livello: b2.compare(b1) > 0 ? 1 : 0 },
						],
			},
		),
	};
}

// ---------------------------------------------------------------------------
// Level 5: the couple

function level5(rng: Rng): Built {
	const r = rng.next();
	const F = q(rng.int(10, 40));
	const d = q(rng.int(28, 45), 100);
	const up = rng.next() < 0.5; // the force on the right goes up: counterclockwise
	const scene = (alt: string, fv: string, quota: SQuota) =>
		rodScene(alt, {
			lunghezza: num(d),
			perno: r3(num(d) / 2),
			forze: [
				{ x: num(d), angolo: up ? 90 : -90, nome: 'F', sub: '1', valore: fv },
				{ x: 0, angolo: up ? -90 : 90, nome: 'F', sub: '2', valore: fv },
			],
			quote: [quota],
		});
	const couple = `due forze uguali e opposte, una ${verso(up)} a destra e una ${verso(!up)} a sinistra`;
	if (r < 0.4) {
		const M = F.mul(d);
		return {
			kind: 'value',
			prompt: 'Calcola il momento della coppia.',
			problem: textBlock(`Per girare un volante di diametro ${pv(d, 'm', S2)} un'automobilista applica ai due lati opposti due forze tangenti di ${pv(F, 'N', INT)} ciascuna, una verso l'alto e una verso il basso. Quanto vale il momento della coppia?`),
			solution: `M ${result(M, 'Nm', S2)}`,
			steps: [`${t("Il braccio della coppia è la distanza tra le rette d'azione, il diametro: ")} b = ${vq(d, 'm', S2)}`, `M = F \\cdot b = ${vq(F, 'N', INT)} \\cdot ${vq(d, 'm', S2)} ${result(M, 'Nm', S2)}`],
			truth: M,
			unit: 'Nm',
			format: S2,
			// the radius for the arm; both forces counted twice; the quotient
			mistakes: [M.div(n(2)), M.mul(n(2)), F.div(d)],
			params: { case: 'diametro' },
			scene: scene(`Il volante disegnato come il suo diametro, lungo ${sayDist(d, false)}, con ${couple}, di ${full(F)} newton ciascuna`, `${full(F)} N`, { da: 0, a: num(d), testo: sceneText(d, 'm', S2), lato: 'sopra', livello: 0 }),
		};
	}
	if (r < 0.7) {
		const R2 = q(rng.int(14, 24), 100);
		const M = F.mul(R2).mul(n(2));
		return {
			kind: 'value',
			prompt: 'Calcola il momento della coppia.',
			problem: textBlock(`Una chiave a croce ha i bracci lunghi ${pv(R2, 'm', S2)} dal centro. Per svitare un bullone si spinge un'estremità verso l'alto e quella opposta verso il basso, con due forze di ${pv(F, 'N', INT)} perpendicolari ai bracci. Quanto vale il momento della coppia?`),
			solution: `M ${result(M, 'Nm', S2)}`,
			steps: [
				t("Le due forze sono una coppia, e il braccio è la distanza tra le rette d'azione:"),
				`b = 2 \\cdot ${vq(R2, 'm', S2)} = ${vq(R2.mul(n(2)), 'm', S2)}`,
				`M = F \\cdot b = ${vq(F, 'N', INT)} \\cdot ${vq(R2.mul(n(2)), 'm', S2)} ${result(M, 'Nm', S2)}`,
			],
			truth: M,
			unit: 'Nm',
			format: S2,
			// the half length taken for the arm; twice the couple; the quotient
			mistakes: [F.mul(R2), M.mul(n(2)), F.div(R2)],
			params: { case: 'raggio' },
			scene: rodScene(`La chiave a croce disegnata come un'asta con il centro O, con i bracci lunghi ${sayDist(R2, false)}; alle estremità ${couple}, di ${full(F)} newton ciascuna`, {
				lunghezza: r3(num(R2) * 2),
				perno: num(R2),
				forze: [
					{ x: r3(num(R2) * 2), angolo: up ? 90 : -90, nome: 'F', sub: '1', valore: `${full(F)} N` },
					{ x: 0, angolo: up ? -90 : 90, nome: 'F', sub: '2', valore: `${full(F)} N` },
				],
				quote: [{ da: num(R2), a: r3(num(R2) * 2), testo: sceneText(R2, 'm', S2), lato: up ? 'sotto' : 'sopra' }],
			}),
		};
	}
	const M = shown(F.mul(d), S2);
	const Fx = M.div(d);
	return {
		kind: 'value',
		prompt: 'Trova le forze della coppia.',
		problem: textBlock(`Una coppia di forze ha il braccio di ${pv(d, 'm', S2)} e il momento di ${pv(M, 'Nm', S2)}. Quanto vale l'intensità di ciascuna delle due forze?`),
		solution: `F ${result(Fx, 'N', S2)}`,
		steps: [`M = F \\cdot b \\quad\\Rightarrow\\quad F = \\frac{M}{b}`, `F = \\frac{${vq(M, 'Nm', S2)}}{${vq(d, 'm', S2)}} ${result(Fx, 'N', S2)}`],
		truth: Fx,
		unit: 'N',
		format: S2,
		// the moment shared between the two forces; the product; twice the answer
		mistakes: [Fx.div(n(2)), M.mul(d), Fx.mul(n(2))],
		params: { case: 'forza' },
		scene: scene(`Una coppia di forze su un'asta: ${couple}, di intensità da trovare, alla distanza di ${sayDist(d, false)}`, '?', { da: 0, a: num(d), testo: sceneText(d, 'm', S2), lato: 'sopra', livello: 0 }),
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	if (sample.level !== 4 && sample.answer.kind !== 'number') v.push('la risposta deve essere un valore');
	if (sample.level === 4 && (sample.answer.kind !== 'choice' || sample.answer.options.length !== 4)) v.push('servono quattro opzioni');
	if (!sample.scene) v.push('manca la scena');
	return v;
}

export const fisMomentoForza: Generator = {
	id: ID,
	title: 'Il momento di una forza e di una coppia di forze',
	levels: {
		1: { label: 'Il momento con il braccio', constraints: ['forza perpendicolare all’asta, braccio in metri o in centimetri (40%)', 'risultato a due cifre significative'] },
		2: { label: 'Dal momento alla forza o al braccio', constraints: ['la forza (50%) o il braccio (50%) dal momento'] },
		3: { label: 'Il momento di una forza obliqua', constraints: ['M = F d sin α, α da 15° a 165°, mai 90°'] },
		4: { label: 'Il momento totale con il segno', constraints: ['due forze perpendicolari, perno nel centro (60%) o a un’estremità (40%)', 'risposta con il verso di rotazione'] },
		5: { label: 'Il momento di una coppia', constraints: ['il volante (diametro), la chiave a croce (metà braccio), la forza dal momento'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice,
};

export default fisMomentoForza;
