/**
 * Punto materiale, traiettoria e sistema di riferimento. Spec: specs/exercises/fis-punto-materiale.md
 *
 * Four levels from the lesson (docs/lezioni/fisica/riscritte/38-fis-punto-materiale.md), each one step harder: the
 * displacement between two positions with their signs; an interval of time between two clock times across the hour;
 * the displacement or the distance travelled on a trip there and partly back; the displacement or the distance from a
 * table of times and positions. Positions are whole metres, so every answer is exact. Distractors from the lesson's
 * warnings: the subtraction the wrong way round, positions added, the way back subtracted from the distance, minutes
 * counted as hundredths of an hour.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { MOVERS, opt, opts, qt, roadScene, say, stepInt, tableTS } from '../cinematica';

export const ID = 'fis-punto-materiale';

const S = (x: number) => String(x);
const mOpts = (xs: number[]) => opts(xs.map(S), 'm');
const fallbackM = (x: number) => mOpts([x + 10, x - 10, x + 20, x - 20]);
/** a − b in LaTeX, with b in brackets when negative. */
const sub = (a: number, b: number) => `${S(a)} - ${b < 0 ? `(${S(b)})` : S(b)}`;
const lbl = (x: number) => `${S(x).replace('-', '−')} m`;

// ---------------------------------------------------------------------------
// Level 1: the displacement between two positions

function level1(rng: Rng): Built {
	const negative = rng.next() < 0.5;
	for (;;) {
		const s1 = stepInt(rng, -90, 150, 5);
		const s2 = stepInt(rng, -90, 150, 5);
		if (s1 === s2 || (negative ? s2 > s1 : s2 < s1)) continue;
		if (s1 > 0 && s2 > 0 && rng.next() < 0.6) continue; // most exercises have a negative position
		if (s1 + s2 === 0) continue;
		const d = s2 - s1;
		const body = rng.pick(MOVERS);
		const alt = `Una strada dritta con la retta orientata s. Le posizioni s1, ${say(S(s1))} metri, e s2, ${say(S(s2))} metri.`;
		const pts = [
			{ s: s1, etichetta: `s₁ = ${lbl(s1)}` },
			{ s: s2, etichetta: `s₂ = ${lbl(s2)}` },
		];
		return {
			prompt: 'Trova lo spostamento.',
			problem: textBlock(`${body} si muove su una strada dritta e passa dalla posizione $s_1 = ${qt(S(s1), 'm')}$ alla posizione $s_2 = ${qt(S(s2), 'm')}$. Quanto vale il suo spostamento?`),
			solution: `\\Delta s = ${qt(S(d), 'm')}`,
			steps: [
				t('Lo spostamento è la posizione finale meno quella iniziale:'),
				`\\Delta s = s_2 - s_1 = ${qt(S(s2), 'm')} - ${s1 < 0 ? `(${qt(S(s1), 'm')})` : qt(S(s1), 'm')} = ${qt(S(d), 'm')}`,
				t(d < 0 ? 'Il segno meno dice che si è spostato nel verso negativo della retta.' : 'Il segno più dice che si è spostato nel verso positivo della retta.'),
			],
			// the subtraction the wrong way round; the positions added; the distances from the origin subtracted; the sum with a minus
			answer: choiceOf(rng, opt(S(d), 'm'), mOpts([s1 - s2, s1 + s2, Math.abs(s2) - Math.abs(s1), -(s1 + s2)]), fallbackM(d)),
			params: { case: negative ? 'negativo' : 'positivo', s1, s2 },
			scene: roadScene(alt, { punti: pts }),
			solutionScene: roadScene(`${alt} Lo spostamento, ${say(S(d))} metri, va da s1 a s2.`, { punti: pts, spostamento: { da: s1, a: s2 } }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: an interval between two clock times

const TRIPS = [
	(a: string, b: string) => `Un autobus parte alle ${a} e arriva al capolinea alle ${b}. Quanto dura il viaggio?`,
	(a: string, b: string) => `Un treno parte alle ${a} e arriva alla stazione successiva alle ${b}. Quanto dura il viaggio?`,
	(a: string, b: string) => `Una gara di corsa comincia alle ${a} e l'ultimo atleta arriva alle ${b}. Quanto dura la gara?`,
];
const clock = (h: number, m: number) => `${h}:${String(m).padStart(2, '0')}`;

function level2(rng: Rng): Built {
	for (;;) {
		const h1 = rng.int(7, 20);
		const m1 = rng.int(31, 59);
		const D = rng.int(12, 95);
		const tot = m1 + D;
		if (tot < 60) continue; // always across the hour
		const h2 = h1 + Math.floor(tot / 60), m2 = tot % 60;
		const naive = 100 * (h2 - h1) + m2 - m1;
		const a = clock(h1, m1), b = clock(h2, m2);
		const which = rng.int(0, TRIPS.length - 1);
		const toHour = 60 - m1;
		return {
			prompt: "Trova l'intervallo di tempo.",
			problem: textBlock(TRIPS[which](a, b)),
			solution: `\\Delta t = ${qt(S(D), 'min')}`,
			steps: [
				t(`Dalle ${a} alle ${clock(h1 + 1, 0)} passano ${toHour} minuti.`),
				h2 - h1 > 1 ? t(`Dalle ${clock(h1 + 1, 0)} alle ${clock(h2, 0)} passano ${60 * (h2 - h1 - 1)} minuti, e poi altri ${m2} fino alle ${b}.`) : t(`Dalle ${clock(h1 + 1, 0)} alle ${b} passano ${m2} minuti.`),
				`\\Delta t = ${[toHour, ...(h2 - h1 > 1 ? [60 * (h2 - h1 - 1)] : []), m2].join(' + ')} = ${qt(S(D), 'min')}`,
				t("Un'ora ha 60 minuti: le ore non si sottraggono come numeri decimali."),
			],
			// minutes as hundredths of an hour; only the minutes subtracted; an hour too many or too few
			answer: choiceOf(rng, opt(S(D), 'min'), opts([naive, Math.abs(m1 - m2), D + 60, D - 60].filter((x) => x > 0 && x !== D).map(S), 'min'), opts([D + 10, D - 10, D + 20].filter((x) => x > 0).map(S), 'min')),
			params: { h1, m1, h2, m2, trip: which },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: there and partly back

function level3(rng: Rng): Built {
	const askD = rng.next() < 0.5;
	for (;;) {
		const s0 = stepInt(rng, -60, 100, 5, true);
		const dir = rng.next() < 0.7 ? 1 : -1;
		const L1 = stepInt(rng, 30, 200, 5);
		const L2 = stepInt(rng, 10, L1 + 60, 5);
		if (L2 === L1) continue;
		const s1 = s0 + dir * L1, s2 = s1 - dir * L2;
		if (Math.abs(s1) > 300 || Math.abs(s2) > 300) continue;
		const d = L1 + L2, ds = s2 - s0;
		if (s2 === 0 || s0 + s1 + s2 === 0) continue;
		const body = rng.pick(MOVERS);
		const alt = `Una strada dritta con la retta orientata s: si parte da ${say(S(s0))} metri, si arriva fino a ${say(S(s1))} metri e si torna indietro fino a ${say(S(s2))} metri.`;
		const pts = [
			{ s: s0, nome: 'partenza', etichetta: lbl(s0) },
			{ s: s1, etichetta: lbl(s1) },
			{ s: s2, nome: 'arrivo', etichetta: lbl(s2) },
		];
		const legs = [
			{ da: s0, a: s1 },
			{ da: s1, a: s2 },
		];
		return {
			prompt: askD ? 'Trova la distanza percorsa.' : 'Trova lo spostamento.',
			problem: textBlock(`${body} parte da $s = ${qt(S(s0), 'm')}$, arriva fino a $s = ${qt(S(s1), 'm')}$ e poi torna indietro fino a $s = ${qt(S(s2), 'm')}$, sempre sulla stessa strada dritta. Quanto vale ${askD ? 'la distanza percorsa' : 'lo spostamento'}?`),
			solution: askD ? `d = ${qt(S(d), 'm')}` : `\\Delta s = ${qt(S(ds), 'm')}`,
			steps: askD
				? [
						t('La distanza percorsa somma le lunghezze dei due tratti, tutte positive:'),
						`${t('andata ')} |${S(s1)} - ${s0 < 0 ? `(${S(s0)})` : S(s0)}|\\,\\text{m} = ${qt(S(L1), 'm')} \\qquad ${t('ritorno ')} |${S(s2)} - ${s1 < 0 ? `(${S(s1)})` : S(s1)}|\\,\\text{m} = ${qt(S(L2), 'm')}`,
						`d = ${qt(S(L1), 'm')} + ${qt(S(L2), 'm')} = ${qt(S(d), 'm')}`,
					]
				: [
						t("Lo spostamento dipende solo dalla partenza e dall'arrivo:"),
						`\\Delta s = ${qt(S(s2), 'm')} - ${s0 < 0 ? `(${qt(S(s0), 'm')})` : qt(S(s0), 'm')} = ${qt(S(ds), 'm')}`,
					],
			// distance: the displacement, the way back subtracted, only the way out, the final position;
			// displacement: the distance with the sign of the way out, only the way out, the final position, the wrong order
			answer: askD
				? choiceOf(rng, opt(S(d), 'm'), mOpts([Math.abs(ds), L1, Math.abs(s2), L1 + Math.abs(s1)].filter((x) => x > 0)), fallbackM(d))
				: choiceOf(rng, opt(S(ds), 'm'), mOpts([dir * d, dir * L1, s2, s0 - s2]), fallbackM(ds)),
			params: { case: askD ? 'distanza' : 'spostamento', s0, s1, s2 },
			scene: roadScene(alt, { punti: pts, tratti: legs }),
			solutionScene: roadScene(`${alt} Lo spostamento, ${say(S(ds))} metri, va dalla partenza all'arrivo.`, { punti: pts, tratti: legs, spostamento: { da: s0, a: s2 } }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: a table of times and positions

function level4(rng: Rng): Built {
	const askD = rng.next() < 0.5;
	for (;;) {
		const step = rng.pick([2, 5]);
		const turn = rng.int(2, 3); // steps forward before turning
		const stop = rng.next() < 0.5;
		const incs: number[] = [];
		for (let i = 0; i < 5; i++) {
			if (i < turn) incs.push(rng.int(2, 12));
			else if (stop && i === turn) incs.push(0);
			else incs.push(-rng.int(2, 14));
		}
		const flip = rng.next() < 0.3 ? -1 : 1; // sometimes the first way is the negative one
		const s0 = rng.int(-10, 20);
		const s = [s0];
		for (const d of incs) s.push(s[s.length - 1] + flip * d);
		if (s.some((x) => Math.abs(x) > 60)) continue;
		const ts = s.map((_, i) => i * step);
		const dist = incs.reduce((a, b) => a + Math.abs(b), 0);
		const body = "Un'automobilina telecomandata";
		const lead = `${body} si muove su un corridoio dritto. Un sensore misura la sua posizione ogni $${step}\\,\\text{s}$, e tra una misura e la successiva l'automobilina non cambia verso.`;
		const tab = tableTS(ts.map(S), s.map(S));
		if (askD) {
			const total = s[5] - s[0];
			const out = incs.slice(0, turn).reduce((a, b) => a + b, 0);
			return {
				prompt: 'Trova la distanza percorsa.',
				problem: textBlock(`${lead} Quanto vale la distanza percorsa in tutti i $${5 * step}\\,\\text{s}$?`, 46, [tab]),
				solution: `d = ${qt(S(dist), 'm')}`,
				steps: [
					t('Si sommano le lunghezze di tutti i tratti tra una misura e la successiva, sempre positive:'),
					`d = ${incs.map((x) => S(Math.abs(x))).join(' + ')} = ${qt(S(dist), 'm')}`,
					`${t('Lo spostamento invece è ')} ${sub(s[5], s[0])} = ${qt(S(total), 'm')}`,
				],
				// the displacement; the last position; only the way out; the way back subtracted
				answer: choiceOf(rng, opt(S(dist), 'm'), mOpts([Math.abs(total), Math.abs(s[5]), out, Math.abs(out - (dist - out))].filter((x) => x > 0 && x !== dist)), mOpts([dist + 4, dist - 4, dist + 8, dist - 8].filter((x) => x > 0))),
				params: { case: 'distanza', step, s },
			};
		}
		// an interval that straddles the turn
		const i = rng.int(0, turn - 1), j = rng.int(stop ? turn + 2 : turn + 1, 5);
		const d = s[j] - s[i];
		const between = incs.slice(i, j).reduce((a, b) => a + Math.abs(b), 0);
		if (d === 0) continue;
		return {
			prompt: 'Trova lo spostamento.',
			problem: textBlock(`${lead} Quanto vale lo spostamento tra $t = ${ts[i]}\\,\\text{s}$ e $t = ${ts[j]}\\,\\text{s}$?`, 46, [tab]),
			solution: `\\Delta s = ${qt(S(d), 'm')}`,
			steps: [
				`${t('Dalla tabella: ')} t = ${ts[i]}\\,\\text{s} \\Rightarrow s = ${qt(S(s[i]), 'm')} \\qquad t = ${ts[j]}\\,\\text{s} \\Rightarrow s = ${qt(S(s[j]), 'm')}`,
				`\\Delta s = ${qt(S(s[j]), 'm')} - ${s[i] < 0 ? `(${qt(S(s[i]), 'm')})` : qt(S(s[i]), 'm')} = ${qt(S(d), 'm')}`,
			],
			// the final position; the wrong order; the distance travelled in between
			answer: choiceOf(rng, opt(S(d), 'm'), mOpts([s[j], -d, between, Math.sign(d) * between].filter((x) => x !== d)), fallbackM(d)),
			params: { case: 'spostamento', step, s, i, j },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if ((sample.level === 1 || sample.level === 3) && !sample.scene) v.push('manca la scena');
	if (sample.scene && 'spostamento' in sample.scene.data) v.push('la scena del problema disegna lo spostamento');
	return v;
}

export const fisPuntoMateriale: Generator = {
	id: ID,
	title: 'Punto materiale, traiettoria e sistema di riferimento',
	levels: {
		1: { label: 'Lo spostamento', constraints: ['posizioni intere, multiple di 5, da −90 a 150 m', 'spostamento positivo o negativo, metà ciascuno'] },
		2: { label: "L'intervallo di tempo", constraints: ["due orari a cavallo dell'ora", 'durata da 12 a 95 minuti'] },
		3: { label: 'Andata e ritorno', constraints: ['un tratto avanti e uno indietro', 'distanza percorsa o spostamento, metà ciascuno'] },
		4: { label: 'La tabella della legge oraria', constraints: ['sei posizioni, un cambio di verso', 'distanza percorsa o spostamento, metà ciascuno'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisPuntoMateriale;
