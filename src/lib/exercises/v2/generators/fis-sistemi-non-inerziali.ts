/**
 * Sistemi di riferimento inerziali e non inerziali. Spec: specs/exercises/fis-sistemi-non-inerziali.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/72-fis-sistemi-non-inerziali.md), each one step harder:
 * telling an inertial frame from a non inertial one on a described vehicle; a free ball on the smooth floor of a
 * braking bus, its displacement or its velocity relative to the bus (a' = A, the bus's own speed is not needed); the
 * time it takes to reach the front wall (the formula turned round); a pendulum hanging in an accelerating vehicle,
 * tan θ = A/g, the angle or the acceleration; a ball dropped in an accelerating lift, which falls with g + A or
 * g − A relative to it. g = 9,8 m/s², data with two significant figures, answers with two (angles to the degree).
 * Distractors from the lesson's warnings: "it moves, so it is not inertial", the bus's speed used where it does not
 * count, the half forgotten, sine for tangent, the sign of A swapped.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Built, G, RAD, checkBasic, choiceOf, cut, cutQ, dec2, degOpt, generateWith, pick2, pickWords, pqU, qu, r2, rel, res, roundDeg, t } from '../fis-riferimenti';

export const ID = 'fis-sistemi-non-inerziali';

// ---------------------------------------------------------------------------
// Level 1: inertial or not

type Kind = 'si' | 'modulo' | 'direzione';
const WORDS: [string, string][] = [
	['si', 'sì, la velocità è costante'],
	['modulo', 'no, cambia il modulo'],
	['direzione', 'no, cambia la direzione'],
	['moto', 'no, perché si muove'],
];
const KMH_FAST = ['72', '108', '126', '144', '162', '198', '216', '252', '288'];
const KMH_CURVE = ['36', '54', '72'];
type Case = { kind: Kind; make: (rng: Rng) => string; of: string };
const CASES: Case[] = [
	{ kind: 'si', of: 'del treno', make: (rng) => `Un treno viaggia a ${pqU(rng.pick(KMH_FAST), 'km/h')} costanti su un binario rettilineo.` },
	{ kind: 'si', of: "dell'ascensore", make: (rng) => `Un ascensore sale a ${pqU(dec2(rng, 1.1, 2.5), 'm/s')} costanti.` },
	{ kind: 'si', of: 'della nave', make: (rng) => `Una nave avanza in linea retta a ${pqU(dec2(rng, 4.0, 9.9), 'm/s')} costanti.` },
	{ kind: 'modulo', of: "dell'autobus", make: (rng) => `Un autobus frena su una strada rettilinea con un'accelerazione di modulo ${pqU(dec2(rng, 1.1, 4.5), 'm/s^2')}.` },
	{ kind: 'modulo', of: "dell'aereo", make: (rng) => `Un aereo accelera su una pista rettilinea con ${pqU(dec2(rng, 1.5, 3.5), 'm/s^2')}.` },
	{ kind: 'modulo', of: "dell'ascensore", make: (rng) => `Un ascensore parte verso l'alto con un'accelerazione di ${pqU(dec2(rng, 0.5, 1.5), 'm/s^2')}.` },
	{ kind: 'direzione', of: "dell'auto", make: (rng) => `Un'auto percorre una curva a ${pqU(rng.pick(KMH_CURVE), 'km/h')} costanti.` },
	{ kind: 'direzione', of: 'della giostra', make: (rng) => `Una giostra gira a velocità angolare costante e fa un giro ogni ${pqU(dec2(rng, 4.0, 9.9), 's')}.` },
	{ kind: 'direzione', of: 'del treno', make: (rng) => `Un treno percorre una curva a ${pqU(dec2(rng, 11, 35), 'm/s')} costanti.` },
];
const WHY: Record<Kind, string> = {
	si: 'Qui la traiettoria è rettilinea e il modulo della velocità è costante: il sistema è inerziale, anche se si muove.',
	modulo: "Qui il modulo della velocità cambia: il sistema ha un'accelerazione e non è inerziale.",
	direzione: "Qui la direzione della velocità cambia, anche se il modulo è costante: il sistema ha un'accelerazione centripeta e non è inerziale.",
};

function level1(rng: Rng): Built {
	const kind = rng.pick<Kind>(['si', 'modulo', 'direzione']);
	const c = rng.pick(CASES.filter((x) => x.kind === kind));
	return {
		prompt: 'Il sistema di riferimento è inerziale?',
		problem: textBlock(`${c.make(rng)} Il sistema di riferimento ${c.of} è inerziale?`),
		solution: t(kind === 'si' ? 'Sì, è inerziale.' : 'No, non è inerziale.'),
		steps: [t('Un sistema è inerziale se rispetto al suolo è fermo o si muove di moto rettilineo uniforme: velocità costante in modulo e in direzione.'), t(WHY[kind])],
		answer: pickWords(rng, kind, WORDS),
		params: { case: kind },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: the free ball on the braking bus

const bus = (v0: string, A: string) => `Un autobus viaggia a ${pqU(v0, 'm/s')} e comincia a frenare con un'accelerazione di modulo ${pqU(A, 'm/s^2')}.`;
const FREE = t("Rispetto all'autobus il pallone, che è libero, parte da fermo e accelera in avanti con la stessa accelerazione, in modulo, dell'autobus:");

function level2(rng: Rng): Built {
	const askV = rng.next() < 0.5;
	for (;;) {
		const v0 = dec2(rng, 11, 25), A = dec2(rng, 1.1, 4.5), tt = dec2(rng, 1.1, 3.0);
		const V0 = Number(v0), a = Number(A), T = Number(tt);
		if (a * T > V0 - 1) continue;
		const head = `${bus(v0, A)} Un pallone è fermo sul pavimento liscio.`;
		if (askV) {
			const x = a * T;
			const ans = r2(x);
			if (ans === null) continue;
			return {
				prompt: "Trova la velocità rispetto all'autobus.",
				problem: textBlock(`${head} Quale velocità ha il pallone rispetto all'autobus dopo ${pqU(tt, 's')}?`),
				solution: `v' ${rel(x, ans)} ${qu(ans, 'm/s')}`,
				steps: [FREE, `a' = A = ${qu(A, 'm/s^2')}`, `v' = A\\,t = ${qu(A, 'm/s^2')} \\cdot ${qu(tt, 's')} = ${res(x, ans, 'm/s')}`, t("La velocità dell'autobus non serve: conta solo la frenata.")],
				// the bus's velocity; the initial velocity; the half that belongs to the displacement
				answer: pick2(rng, ans, 'm/s', x, [V0 - a * T, V0, x / 2]),
				params: { case: 'velocità', v0, A, t: tt },
			};
		}
		const x = (a * T * T) / 2;
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: "Trova lo spostamento rispetto all'autobus.",
			problem: textBlock(`${head} Di quanto avanza il pallone rispetto all'autobus in ${pqU(tt, 's')}?`),
			solution: `\\Delta s\\,' ${rel(x, ans)} ${qu(ans, 'm')}`,
			steps: [FREE, `a' = A = ${qu(A, 'm/s^2')}`, `\\Delta s\\,' = \\dfrac{1}{2}\\,A\\,t^2 = \\dfrac{1}{2} \\cdot ${qu(A, 'm/s^2')} \\cdot (${qu(tt, 's')})^2 = ${res(x, ans, 'm')}`, t("La velocità dell'autobus non serve: conta solo la frenata.")],
			// the half forgotten; the ball's displacement on the road; the bus's displacement on the road
			answer: pick2(rng, ans, 'm', x, [a * T * T, V0 * T, V0 * T - x]),
			params: { case: 'spostamento', v0, A, t: tt },
		};
	}
}

function level3(rng: Rng): Built {
	for (;;) {
		const v0 = dec2(rng, 11, 25), A = dec2(rng, 1.1, 4.5), d = dec2(rng, 2.0, 9.9);
		const V0 = Number(v0), a = Number(A), D = Number(d);
		const x = Math.sqrt((2 * D) / a);
		const ans = r2(x);
		if (ans === null || a * x > V0 - 1) continue;
		return {
			prompt: 'Trova il tempo.',
			problem: textBlock(`${bus(v0, A)} Un pallone è fermo sul pavimento liscio, a ${pqU(d, 'm')} dalla parete davanti. Dopo quanto tempo il pallone tocca la parete?`),
			solution: `t ${rel(x, ans)} ${qu(ans, 's')}`,
			steps: [FREE, `\\Delta s\\,' = \\dfrac{1}{2}\\,A\\,t^2 \\quad\\Rightarrow\\quad t = \\sqrt{\\dfrac{2\\,\\Delta s\\,'}{A}}`, `t = \\sqrt{\\dfrac{2 \\cdot ${qu(d, 'm')}}{${qu(A, 'm/s^2')}}} = ${res(x, ans, 's')}`],
			// the 2 forgotten; the root forgotten; the distance over the bus's speed; d / A
			answer: pick2(rng, ans, 's', x, [Math.sqrt(D / a), (2 * D) / a, D / V0, D / a]),
			params: { v0, A, d },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the pendulum in an accelerating vehicle

function level4(rng: Rng): Built {
	if (rng.next() < 0.5) {
		for (;;) {
			const A = dec2(rng, 1.1, 6.0);
			const a = Number(A);
			const th = Math.atan(a / G) * RAD;
			const ans = roundDeg(th);
			if (ans === null || th < 5) continue;
			const n = Number(ans);
			const others = [roundDeg(90 - th), roundDeg(Math.asin(a / G) * RAD)].filter((x): x is string => x !== null).map(degOpt);
			return {
				prompt: "Trova l'angolo del filo.",
				problem: textBlock(`Un ciondolo è appeso con un filo al soffitto di un tram, che accelera su un rettilineo con ${pqU(A, 'm/s^2')}. Quando il ciondolo è fermo rispetto al tram, quale angolo forma il filo con la verticale?`),
				solution: `\\theta ${rel(th, ans)} ${ans}^\\circ`,
				steps: [
					t("Visto dal suolo il ciondolo accelera con il tram. La tensione ha una componente verticale che bilancia il peso e una orizzontale che dà l'accelerazione:"),
					`T\\cos\\theta = m\\,g \\qquad T\\sin\\theta = m\\,A`,
					`\\tan\\theta = \\dfrac{A}{g} = \\dfrac{${qu(A, 'm/s^2')}}{9{,}8\\,\\text{m/s}^2} = ${cut(a / G)} \\quad\\Rightarrow\\quad \\theta = ${cut(th)}^\\circ \\approx ${ans}^\\circ`,
				],
				// the angle with the horizontal; the sine for the tangent
				answer: choiceOf(rng, degOpt(ans), others, [n + 4, n - 3, n + 8, n + 12].filter((x) => x > 0 && x < 90).map((x) => degOpt(String(x)))),
				params: { case: 'angolo', A },
			};
		}
	}
	for (;;) {
		const deg = rng.int(4, 35);
		const th = deg / RAD;
		const x = G * Math.tan(th);
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: "Trova l'accelerazione.",
			problem: textBlock(`Su un treno che accelera su un rettilineo un ciondolo appeso al soffitto resta fermo rispetto al treno, con il filo inclinato di $${deg}^\\circ$ rispetto alla verticale. Quanto vale l'accelerazione del treno?`),
			solution: `A ${rel(x, ans)} ${qu(ans, 'm/s^2')}`,
			steps: [t("Per un pendolo fermo rispetto a un veicolo che accelera in orizzontale, la tangente dell'angolo con la verticale è il rapporto tra A e g:"), `\\tan\\theta = \\dfrac{A}{g} \\quad\\Rightarrow\\quad A = g\\tan\\theta`, `A = 9{,}8\\,\\text{m/s}^2 \\cdot \\tan ${deg}^\\circ = ${res(x, ans, 'm/s^2')}`],
			// g over the tangent; the cosine; the sine
			answer: pick2(rng, ans, 'm/s^2', x, [G / Math.tan(th), G * Math.cos(th), G * Math.sin(th)]),
			params: { case: 'accelerazione', theta: deg },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: a ball dropped in an accelerating lift

function level5(rng: Rng): Built {
	const up = rng.next() < 0.5;
	for (;;) {
		const A = dec2(rng, 1.1, 4.5), h = dec2(rng, 1.1, 2.5);
		const a = Number(A), H = Number(h);
		const rel0 = up ? G + a : G - a;
		const x = Math.sqrt((2 * H) / rel0);
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: 'Trova il tempo di caduta.',
			problem: textBlock(`In un ascensore che accelera verso ${up ? "l'alto" : 'il basso'} con ${pqU(A, 'm/s^2')}, una pallina viene lasciata cadere da ${pqU(h, 'm')} dal pavimento. Dopo quanto tempo tocca il pavimento?`),
			solution: `t ${rel(x, ans)} ${qu(ans, 's')}`,
			steps: [
				t(up ? "Vista dal palazzo la pallina cade con g, e il pavimento le va incontro con A: rispetto all'ascensore cade con g + A." : "Vista dal palazzo la pallina cade con g, e il pavimento le scappa con A: rispetto all'ascensore cade con g - A."),
				`g ${up ? '+' : '-'} A = 9{,}8\\,\\text{m/s}^2 ${up ? '+' : '-'} ${qu(A, 'm/s^2')} = ${cutQ(rel0, 'm/s^2')}`,
				`t = \\sqrt{\\dfrac{2\\,h}{g ${up ? '+' : '-'} A}} = \\sqrt{\\dfrac{2 \\cdot ${qu(h, 'm')}}{${cutQ(rel0, 'm/s^2')}}} = ${res(x, ans, 's')}`,
			],
			// the sign of A swapped; the lift at rest; A alone; the 2 forgotten
			answer: pick2(rng, ans, 's', x, [Math.sqrt((2 * H) / (up ? G - a : G + a)), Math.sqrt((2 * H) / G), Math.sqrt((2 * H) / a), Math.sqrt(H / rel0)]),
			params: { case: up ? 'alto' : 'basso', A, h },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

const check = (sample: Sample): string[] => checkBasic(sample);

export const fisSistemiNonInerziali: Generator = {
	id: ID,
	title: 'Sistemi di riferimento inerziali e non inerziali',
	levels: {
		1: { label: 'Inerziale o no', constraints: ['un veicolo descritto con il suo moto', 'inerziale, non inerziale per il modulo o per la direzione: un terzo ciascuno'] },
		2: { label: "Il pallone visto dall'autobus", constraints: ["spostamento o velocità rispetto all'autobus, metà ciascuno", "l'autobus non si ferma prima"] },
		3: { label: 'Il tempo per arrivare alla parete', constraints: ['distanza da 2,0 a 9,9 m', "l'autobus non si ferma prima"] },
		4: { label: 'Il pendolo nel veicolo che accelera', constraints: ["l'angolo o l'accelerazione, metà ciascuno", 'angoli da 4 a 35 gradi'] },
		5: { label: 'La caduta in ascensore', constraints: ["accelerazione verso l'alto o verso il basso, metà ciascuno", 'altezza da 1,1 a 2,5 m'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisSistemiNonInerziali;
