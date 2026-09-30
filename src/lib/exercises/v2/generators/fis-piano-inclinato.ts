/**
 * Il moto lungo un piano inclinato. Spec: specs/exercises/fis-piano-inclinato.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/54-fis-piano-inclinato.md), each one step harder: the
 * acceleration on a smooth incline, a = g sin α; the time to the foot or the speed there, from rest, t = √(2l/a) and
 * v = √(2al); the acceleration of a body sliding down with kinetic friction, g (sin α − μd cos α); a body launched up a
 * smooth incline, the distance v0²/(2 g sin α) or the time v0/(g sin α) until it stops; the same with friction,
 * v0²/(2 g (sin α + μd cos α)). g = 9,8 m/s², data with two significant figures, angles in whole degrees; answers with
 * two significant figures, never too close to a rounding boundary. Distractors from the lesson's warnings: the cosine
 * for the sine, the whole weight as the pressing force, the minus sign of friction on the way up, the height for the
 * length, the missing 2.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, decTex, t } from '../vettori';
import { type Built, checkCommon, generateWith, lab, r2 } from '../fisica-equilibrio';
import { BODIES, G, coeffOf, cosD, cut4, datum, fallU, optU, optsU, pu, qu, r2p, sinD, tanD } from '../fis-forze-movimento';

export const ID = 'fis-piano-inclinato';

function plane(alt: string, angle: number, length?: string): SceneRef {
	const data: Record<string, unknown> = { angolo: angle, testoAngolo: `${angle}°` };
	if (length) data.lunghezza = `${lab(length)} m`;
	return { type: 'piano-inclinato', data, alt };
}

const A_STEP = (a: number, x: number) => `a = g\\sin\\alpha = 9{,}8\\,\\text{m/s}^2 \\cdot \\sin ${a}^\\circ = ${cut4(x)}\\,\\text{m/s}^2`;

// ---------------------------------------------------------------------------
// Level 1: the acceleration on a smooth incline

function level1(rng: Rng): Built {
	for (;;) {
		const a = rng.int(10, 60);
		const exact = G * sinD(a);
		const ans = r2(exact);
		if (ans === null) continue;
		const b = rng.pick(BODIES);
		return {
			prompt: "Trova l'accelerazione.",
			problem: textBlock(`${b.name} scivola lungo un piano inclinato liscio di $${a}^\\circ$. Quanto vale la sua accelerazione?`),
			solution: `a \\approx ${qu(ans, 'm/s2')}`,
			steps: [t("Lungo il piano agisce solo la componente del peso P sin alfa; la massa si semplifica:"), `${A_STEP(a, exact)} \\approx ${qu(ans, 'm/s2')}`],
			// the cosine for the sine; g itself (free fall); the tangent
			answer: choiceOf(rng, optU(ans, 'm/s2'), optsU([r2p(G * cosD(a)), '9.8', r2p(G * tanD(a))], 'm/s2'), fallU(exact, 'm/s2')),
			params: { angle: a },
			scene: plane(`${b.name} su un piano inclinato liscio di ${a} gradi.`, a),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: time to the foot, or speed there

function level2(rng: Rng): Built {
	const askTime = rng.next() < 0.5;
	for (;;) {
		const a = rng.int(10, 60);
		const l = datum(rng, 'small');
		const L = Number(l);
		const acc = G * sinD(a);
		const time = Math.sqrt((2 * L) / acc), speed = Math.sqrt(2 * acc * L);
		const exact = askTime ? time : speed;
		const ans = r2(exact);
		if (ans === null) continue;
		const b = rng.pick(BODIES);
		const q = askTime ? 'Quanto tempo impiega ad arrivare in fondo?' : 'Con quale velocità arriva in fondo?';
		return {
			prompt: askTime ? 'Trova il tempo di discesa.' : 'Trova la velocità in fondo.',
			problem: textBlock(`${b.name} parte da ferm${b.e} dalla cima di un piano inclinato liscio, lungo ${pu(l, 'm')} e inclinato di $${a}^\\circ$. ${q}`),
			solution: askTime ? `t \\approx ${qu(ans, 's')}` : `v \\approx ${qu(ans, 'm/s')}`,
			steps: askTime
				? [A_STEP(a, acc), `${t('Moto uniformemente accelerato da fermo lungo il piano: ')} l = \\tfrac{1}{2}a\\,t^2`, `t = \\sqrt{\\dfrac{2\\,l}{a}} = \\sqrt{\\dfrac{2 \\cdot ${qu(l, 'm')}}{${cut4(acc)}\\,\\text{m/s}^2}} = ${cut4(time)}\\,\\text{s} \\approx ${qu(ans, 's')}`]
				: [A_STEP(a, acc), t('Moto uniformemente accelerato da fermo lungo il piano:'), `v = \\sqrt{2\\,a\\,l} = \\sqrt{2 \\cdot ${cut4(acc)}\\,\\text{m/s}^2 \\cdot ${qu(l, 'm')}} = ${cut4(speed)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`],
			// time: the missing 2, no square root, g for a; speed: the missing 2, g for a (the length taken for the height), a·l
			answer: askTime
				? choiceOf(rng, optU(ans, 's'), optsU([r2p(Math.sqrt(L / acc)), r2p((2 * L) / acc), r2p(Math.sqrt((2 * L) / G))], 's'), fallU(exact, 's'))
				: choiceOf(rng, optU(ans, 'm/s'), optsU([r2p(Math.sqrt(acc * L)), r2p(Math.sqrt(2 * G * L)), r2p(acc * L)], 'm/s'), fallU(exact, 'm/s')),
			params: { case: askTime ? 'tempo' : 'velocita', angle: a, l },
			scene: plane(`${b.name} in cima a un piano inclinato liscio di ${a} gradi, lungo ${lab(l)} metri.`, a, l),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: sliding down with kinetic friction

function level3(rng: Rng): Built {
	for (;;) {
		const a = rng.int(15, 60);
		const mu = coeffOf(rng, 10, 80);
		const m = Number(mu);
		if (tanD(a) < 1.15 * m) continue;
		const exact = G * (sinD(a) - m * cosD(a));
		const ans = r2(exact);
		if (ans === null || exact < 0.5) continue;
		const b = rng.pick(BODIES);
		return {
			prompt: "Trova l'accelerazione.",
			problem: textBlock(`${b.name} scende lungo un piano inclinato di $${a}^\\circ$, con $\\mu_d = ${decTex(mu)}$. Quanto vale la sua accelerazione?`),
			solution: `a \\approx ${qu(ans, 'm/s2')}`,
			steps: [
				t("La forza premente è m g cos alfa; l'attrito dinamico, verso l'alto, si sottrae alla componente del peso:"),
				`a = g\\,(\\sin ${a}^\\circ - ${decTex(mu)} \\cdot \\cos ${a}^\\circ) = ${cut4(exact)}\\,\\text{m/s}^2 \\approx ${qu(ans, 'm/s2')}`,
			],
			// the friction added; the whole weight as the pressing force; the friction forgotten
			answer: choiceOf(rng, optU(ans, 'm/s2'), optsU([r2p(G * (sinD(a) + m * cosD(a))), r2p(G * (sinD(a) - m)), r2p(G * sinD(a))], 'm/s2'), fallU(exact, 'm/s2')),
			params: { angle: a, mud: mu },
			scene: plane(`${b.name} su un piano inclinato di ${a} gradi.`, a),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: launched up a smooth incline

function level4(rng: Rng): Built {
	const askDist = rng.next() < 0.5;
	for (;;) {
		const a = rng.int(10, 50);
		const v0 = datum(rng, 'small');
		const V = Number(v0);
		const dec = G * sinD(a);
		const dist = (V * V) / (2 * dec), time = V / dec;
		const exact = askDist ? dist : time;
		const ans = r2(exact);
		if (ans === null || exact < 0.1) continue;
		const b = rng.pick(BODIES);
		const q = askDist ? 'Quanto spazio percorre lungo il piano prima di fermarsi?' : 'Dopo quanto tempo si ferma?';
		return {
			prompt: askDist ? 'Trova lo spazio di arresto.' : 'Trova il tempo di arresto.',
			problem: textBlock(`${b.name} viene lanciat${b.e} a ${pu(v0, 'm/s')} su per un piano inclinato liscio di $${a}^\\circ$. ${q}`),
			solution: askDist ? `d \\approx ${qu(ans, 'm')}` : `t \\approx ${qu(ans, 's')}`,
			steps: [
				t("In salita l'accelerazione è rivolta verso il basso, con modulo:"),
				A_STEP(a, dec).replace('a = ', '|a| = '),
				askDist
					? `d = \\dfrac{v_0^2}{2\\,g\\sin\\alpha} = \\dfrac{(${qu(v0, 'm/s')})^2}{2 \\cdot ${cut4(dec)}\\,\\text{m/s}^2} = ${cut4(dist)}\\,\\text{m} \\approx ${qu(ans, 'm')}`
					: `t = \\dfrac{v_0}{g\\sin\\alpha} = \\dfrac{${qu(v0, 'm/s')}}{${cut4(dec)}\\,\\text{m/s}^2} = ${cut4(time)}\\,\\text{s} \\approx ${qu(ans, 's')}`,
			],
			// distance: the missing 2, the vertical launch (g for g sin α), the cosine; time: g for g sin α, the cosine, up and back
			answer: askDist
				? choiceOf(rng, optU(ans, 'm'), optsU([r2p((V * V) / dec), r2p((V * V) / (2 * G)), r2p((V * V) / (2 * G * cosD(a)))], 'm'), fallU(exact, 'm'))
				: choiceOf(rng, optU(ans, 's'), optsU([r2p(V / G), r2p(V / (G * cosD(a))), r2p((2 * V) / dec)], 's'), fallU(exact, 's')),
			params: { case: askDist ? 'spazio' : 'tempo', angle: a, v0 },
			scene: plane(`${b.name} lanciat${b.e} su per un piano inclinato liscio di ${a} gradi.`, a),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: launched up an incline with friction

function level5(rng: Rng): Built {
	for (;;) {
		const a = rng.int(10, 45);
		const mu = coeffOf(rng, 10, 60);
		const m = Number(mu);
		const v0 = datum(rng, 'small');
		const V = Number(v0);
		const dec = G * (sinD(a) + m * cosD(a));
		const exact = (V * V) / (2 * dec);
		const ans = r2(exact);
		if (ans === null || exact < 0.1) continue;
		const b = rng.pick(BODIES);
		const down = G * (sinD(a) - m * cosD(a));
		return {
			prompt: 'Trova lo spazio di arresto.',
			problem: textBlock(`${b.name} viene lanciat${b.e} a ${pu(v0, 'm/s')} su per un piano inclinato di $${a}^\\circ$, con $\\mu_d = ${decTex(mu)}$. Quanto spazio percorre lungo il piano prima di fermarsi?`),
			solution: `d \\approx ${qu(ans, 'm')}`,
			steps: [
				t("In salita l'attrito è rivolto verso il basso, come la componente del peso: si sommano."),
				`|a| = g\\,(\\sin ${a}^\\circ + ${decTex(mu)} \\cdot \\cos ${a}^\\circ) = ${cut4(dec)}\\,\\text{m/s}^2`,
				`d = \\dfrac{v_0^2}{2\\,|a|} = \\dfrac{(${qu(v0, 'm/s')})^2}{2 \\cdot ${cut4(dec)}\\,\\text{m/s}^2} = ${cut4(exact)}\\,\\text{m} \\approx ${qu(ans, 'm')}`,
			],
			// friction subtracted as on the way down; friction forgotten; the whole weight as the pressing force
			answer: choiceOf(rng, optU(ans, 'm'), optsU([down > 0.05 ? r2p((V * V) / (2 * down)) : null, r2p((V * V) / (2 * G * sinD(a))), r2p((V * V) / (2 * G * (sinD(a) + m)))], 'm'), fallU(exact, 'm')),
			params: { angle: a, mud: mu, v0 },
			scene: plane(`${b.name} lanciat${b.e} su per un piano inclinato di ${a} gradi.`, a),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (!sample.scene) v.push('manca la scena');
	return v;
}

export const fisPianoInclinato: Generator = {
	id: ID,
	title: 'Il moto lungo un piano inclinato',
	levels: {
		1: { label: "L'accelerazione senza attrito", constraints: ['piano liscio, inclinazione da 10° a 60°'] },
		2: { label: 'Tempo e velocità in fondo', constraints: ['piano liscio, partenza da fermo', 'tempo o velocità, metà ciascuno'] },
		3: { label: "L'accelerazione con l'attrito", constraints: ['in discesa', 'tan α almeno 1,15 volte μd'] },
		4: { label: 'Il lancio in salita', constraints: ['piano liscio', 'spazio o tempo di arresto, metà ciascuno'] },
		5: { label: "In salita con l'attrito", constraints: ['spazio di arresto', "l'attrito si somma alla componente del peso"] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisPianoInclinato;
