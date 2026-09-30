/**
 * L'accelerazione. Spec: specs/exercises/fis-accelerazione.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/41-fis-accelerazione.md), each one step harder: the mean
 * acceleration from two speeds; the same with speeds in km/h; a braking, with a negative acceleration; the final
 * velocity or the time from the acceleration (Δv = a Δt); the sign of the acceleration of a body moving the negative
 * way. Distractors from the lesson's warnings: the final velocity for the change, km/h not converted or converted the
 * wrong way, the sign lost, the minus in front of a bracket lost, the ratio upside down.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { dr, ds, moverFor, opt, opts, qt, sig, thenRound } from '../cinematica';

export const ID = 'fis-accelerazione';

const S = (x: number) => String(x);
const A = 'm/s2';
/** Two significant figures, exact: 1,1 to 6,9 without a zero after the comma (a car brakes at about 7 m/s² at most). */
const acc = (rng: Rng) => {
	for (;;) {
		const k = rng.int(11, 69);
		if (k % 10) return k / 10;
	}
};
/** A body for speed v and acceleration a: a train does not accelerate or brake faster than 1,5 m/s². */
const who = (rng: Rng, v: number, a: number) => {
	const b = moverFor(rng, v);
	return b === 'Un treno' && Math.abs(a) > 1.5 ? "Un'auto" : b;
};
const X = (x: number) => ds(dr(x.toFixed(3)));
const aOpts = (xs: (string | null)[]) => opts(xs, A);
const spread = (x: number) => aOpts([sig(x * 2, 2), sig(x / 2, 2), sig(x * 1.5, 2)]);
const par = (s: string) => (s.startsWith('-') ? `(${s.replace('.', '{,}')})` : s.replace('.', '{,}'));

// ---------------------------------------------------------------------------
// Level 1: the mean acceleration

function level1(rng: Rng): Built {
	for (;;) {
		const a = acc(rng);
		const dt = rng.int(2, 12);
		const dv = a * dt;
		if (Math.abs(dv - Math.round(dv)) > 1e-9) continue;
		const v1 = rng.int(1, 20), v2 = v1 + Math.round(dv);
		if (v2 > 40) continue;
		const body = who(rng, v2, a);
		return {
			prompt: "Trova l'accelerazione media.",
			problem: textBlock(`${body} passa da $${qt(S(v1), 'm/s')}$ a $${qt(S(v2), 'm/s')}$ in $${qt(S(dt), 's')}$. Qual è la sua accelerazione media?`),
			solution: `a_m = ${qt(X(a), A)}`,
			steps: [t("La variazione di velocità divisa l'intervallo di tempo:"), `a_m = \\dfrac{v_2 - v_1}{\\Delta t} = \\dfrac{${qt(S(v2), 'm/s')} - ${qt(S(v1), 'm/s')}}{${qt(S(dt), 's')}} = \\dfrac{${qt(S(v2 - v1), 'm/s')}}{${qt(S(dt), 's')}} = ${qt(X(a), A)}`],
			// the final velocity for the change; the ratio upside down; the two velocities added
			answer: choiceOf(rng, opt(X(a), A), aOpts([sig(v2 / dt, 2), sig(dt / (v2 - v1), 2), sig((v1 + v2) / dt, 2)]), spread(a)),
			params: { v1, v2, dt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: speeds in km/h

const VEH = [
	{ who: "Un'auto", still: 'ferma' },
	{ who: 'Una moto', still: 'ferma' },
	{ who: 'Un treno', still: 'fermo' },
];

function level2(rng: Rng): Built {
	for (;;) {
		const v1ms = rng.pick([0, 0, 5, 10, 15, 20]);
		const dvms = 5 * rng.int(1, 6);
		const dt = rng.int(2, 15);
		const a = dvms / dt;
		const ans = sig(a, 2);
		if (ans === null || a > 7 || v1ms + dvms > 40) continue;
		const v1 = v1ms * 3.6, v2 = (v1ms + dvms) * 3.6;
		const w = rng.pick(a > 1.5 ? VEH.slice(0, 2) : VEH);
		const start = v1ms === 0 ? `${w.who} parte da ${w.still} e raggiunge $${qt(S(v2), 'km/h')}$ in $${qt(S(dt), 's')}$.` : `${w.who} passa da $${qt(S(v1), 'km/h')}$ a $${qt(S(v2), 'km/h')}$ in $${qt(S(dt), 's')}$.`;
		return {
			prompt: "Trova l'accelerazione media.",
			problem: textBlock(`${start} Qual è la sua accelerazione media?`),
			solution: `a_m ${Math.abs(Number(ans) - a) < 1e-9 ? '=' : '\\approx'} ${qt(ans, A)}`,
			steps: [
				t('Le velocità vanno prima in m/s, dividendo per 3,6:'),
				`${qt(S(v1), 'km/h')} = ${qt(S(v1ms), 'm/s')} \\qquad ${qt(S(v2), 'km/h')} = ${qt(S(v1ms + dvms), 'm/s')}`,
				`a_m = \\dfrac{${qt(S(dvms), 'm/s')}}{${qt(S(dt), 's')}} ${thenRound(a, ans, A)}`,
			],
			// km/h not converted; 3,6 the wrong way; the final velocity for the change (or the ratio upside down)
			answer: choiceOf(rng, opt(ans, A), aOpts([sig((v2 - v1) / dt, 2), sig(((v2 - v1) * 3.6) / dt, 2), v1ms ? sig((v1ms + dvms) / dt, 2) : sig(dt / dvms, 2)]), spread(a)),
			params: { v1, v2, dt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: braking

function level3(rng: Rng): Built {
	for (;;) {
		const a = -acc(rng);
		const dt = rng.int(2, 10);
		const dv = a * dt;
		if (Math.abs(dv - Math.round(dv)) > 1e-9) continue;
		const stop = rng.next() < 0.5;
		const v2 = stop ? 0 : rng.int(2, 20);
		const v1 = v2 - Math.round(dv);
		if (v1 > 40) continue;
		const body = who(rng, v1, a);
		const text = stop ? `${body} che va a $${qt(S(v1), 'm/s')}$ frena e si ferma in $${qt(S(dt), 's')}$.` : `${body} che va a $${qt(S(v1), 'm/s')}$ frena e in $${qt(S(dt), 's')}$ scende a $${qt(S(v2), 'm/s')}$.`;
		return {
			prompt: "Trova l'accelerazione media.",
			problem: textBlock(`${text} Qual è la sua accelerazione media?`),
			solution: `a_m = ${qt(X(a), A)}`,
			steps: [`a_m = \\dfrac{v_2 - v_1}{\\Delta t} = \\dfrac{${qt(S(v2), 'm/s')} - ${qt(S(v1), 'm/s')}}{${qt(S(dt), 's')}} = ${qt(X(a), A)}`, t('Il segno meno dice che la velocità cala: il corpo frena.')],
			// the sign lost; the initial velocity over the time (when it does not stop); the ratio upside down
			answer: choiceOf(rng, opt(X(a), A), aOpts([X(-a), stop ? sig(-dt / v1, 2) : sig(-v1 / dt, 2), sig(-(v1 + v2) / dt, 2)]), aOpts([sig(a * 2, 2), sig(a / 2, 2), sig(-a * 2, 2)])),
			params: { case: stop ? 'si ferma' : 'rallenta', v1, v2, dt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the final velocity or the time

function level4(rng: Rng): Built {
	const askV = rng.next() < 0.5;
	for (;;) {
		const k = rng.int(2, 48);
		if (k % 10 === 0) continue;
		const brake = rng.next() < 0.3;
		const a = (brake ? -k : k) / 10;
		const dt = rng.int(2, 30);
		const dv = a * dt;
		if (Math.abs(dv - Math.round(dv)) > 1e-9) continue;
		const v1 = rng.int(2, 30);
		const v2 = v1 + Math.round(dv);
		if (v2 < 0 || v2 > 40 || v2 === v1) continue;
		const body = who(rng, Math.max(v1, v2), a);
		const verb = a < 0 ? 'frena' : 'accelera';
		if (askV) {
			return {
				prompt: 'Trova la velocità finale.',
				problem: textBlock(`${body} va a $${qt(S(v1), 'm/s')}$ e ${verb} per $${qt(S(dt), 's')}$ con un'accelerazione media di $${qt(X(a), A)}$. A che velocità arriva?`),
				solution: `v_2 = ${qt(S(v2), 'm/s')}`,
				steps: [t('La variazione di velocità è accelerazione per tempo:'), `\\Delta v = a_m\\,\\Delta t = ${par(X(a))}\\,\\text{m/s}^2 \\cdot ${qt(S(dt), 's')} = ${qt(S(v2 - v1), 'm/s')}`, `v_2 = v_1 + \\Delta v = ${qt(S(v1), 'm/s')} ${v2 < v1 ? '-' : '+'} ${qt(S(Math.abs(v2 - v1)), 'm/s')} = ${qt(S(v2), 'm/s')}`],
				// v1 forgotten; the sign of a lost; a over the time
				answer: choiceOf(rng, opt(S(v2), 'm/s'), opts([S(v2 - v1), S(v1 - (v2 - v1)), sig(v1 + a / dt, 2)].filter((x) => x !== null && Number(x) >= 0), 'm/s'), opts([S(v2 + 5), S(v2 + 10), S(v2 - 5)].filter((x) => Number(x) >= 0), 'm/s')),
				params: { case: 'velocita', v1, a: X(a), dt },
			};
		}
		const v2text = v2 === 0 ? 'fermarsi' : `arrivare a $${qt(S(v2), 'm/s')}$`;
		return {
			prompt: 'Trova il tempo.',
			problem: textBlock(`${body} va a $${qt(S(v1), 'm/s')}$ e ${verb} con un'accelerazione media di $${qt(X(a), A)}$. Quanto tempo impiega per ${v2text}?`),
			solution: `\\Delta t = ${qt(S(dt), 's')}`,
			steps: [`\\Delta t = \\dfrac{\\Delta v}{a_m} = \\dfrac{${qt(S(v2), 'm/s')} - ${qt(S(v1), 'm/s')}}{${par(X(a))}\\,\\text{m/s}^2} = \\dfrac{${qt(S(v2 - v1), 'm/s')}}{${qt(X(a), A)}} = ${qt(S(dt), 's')}`],
			// v1 forgotten; the two velocities added; the ratio upside down
			answer: choiceOf(rng, opt(S(dt), 's'), opts([v2 ? sig(Math.abs(v2 / a), 2) : sig(Math.abs(v1 * a), 2), sig(Math.abs((v1 + v2) / a), 2), sig(Math.abs(a / (v2 - v1)), 2)].filter((x) => x !== null && x !== S(dt)), 's'), opts([S(dt + 5), S(dt + 10), S(dt * 2)], 's')),
			params: { case: 'tempo', v1, v2, a: X(a) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: moving the negative way

function level5(rng: Rng): Built {
	const brakes = rng.next() < 0.5;
	for (;;) {
		const m = acc(rng);
		const a = brakes ? m : -m; // braking the negative way: a > 0
		const dt = rng.int(2, 10);
		const dv = a * dt;
		if (Math.abs(dv - Math.round(dv)) > 1e-9) continue;
		const v1 = -rng.int(2, 30);
		const v2 = v1 + Math.round(dv);
		if (v2 >= 0 || v2 < -40) continue;
		const t1 = rng.int(1, 5), t2 = t1 + dt;
		const body = who(rng, Math.min(v1, v2), a);
		return {
			prompt: "Trova l'accelerazione media.",
			problem: textBlock(`${body} si muove nel verso negativo di una strada dritta. All'istante $t_1 = ${qt(S(t1), 's')}$ la sua velocità è $v_1 = ${qt(S(v1), 'm/s')}$, all'istante $t_2 = ${qt(S(t2), 's')}$ è $v_2 = ${qt(S(v2), 'm/s')}$. Qual è la sua accelerazione media?`),
			solution: `a_m = ${qt(X(a), A)}`,
			steps: [
				`a_m = \\dfrac{v_2 - v_1}{t_2 - t_1} = \\dfrac{${S(v2)} - (${S(v1)})}{${S(t2)} - ${S(t1)}}\\,\\dfrac{\\text{m/s}}{\\text{s}} = \\dfrac{${qt(S(v2 - v1), 'm/s')}}{${qt(S(dt), 's')}} = ${qt(X(a), A)}`,
				t(brakes ? 'Velocità negativa e accelerazione positiva: il corpo frena.' : 'Velocità e accelerazione negative: il corpo va sempre più veloce.'),
			],
			// the sign swapped; the minus in front of the bracket lost; the ratio upside down
			answer: choiceOf(rng, opt(X(a), A), aOpts([X(-a), sig((v2 + v1) / dt, 2), sig(dt / (v2 - v1), 2)]), aOpts([sig(a * 2, 2), sig(a / 2, 2), sig(-a * 2, 2)])),
			params: { case: brakes ? 'frena' : 'accelera', v1, v2, t1, t2 },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const fisAccelerazione: Generator = {
	id: ID,
	title: "L'accelerazione",
	levels: {
		1: { label: "L'accelerazione media", constraints: ['velocità in m/s che crescono', 'accelerazione con due cifre significative'] },
		2: { label: "Con i chilometri all'ora", constraints: ['velocità in km/h, tempo in secondi', 'risultato con due cifre significative'] },
		3: { label: 'La frenata', constraints: ['accelerazione negativa', 'il corpo si ferma o rallenta, metà ciascuno'] },
		4: { label: 'Velocità finale e tempo', constraints: ['Δv = a Δt', 'la velocità o il tempo, metà ciascuno'] },
		5: { label: "Il segno dell'accelerazione", constraints: ['velocità negative', 'il corpo frena o accelera, metà ciascuno'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisAccelerazione;
