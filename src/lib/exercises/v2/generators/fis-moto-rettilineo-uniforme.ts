/**
 * Il moto rettilineo uniforme e il grafico spazio-tempo. Spec: specs/exercises/fis-moto-rettilineo-uniforme.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/40-fis-moto-rettilineo-uniforme.md), each one step
 * harder: the position from the law s = s0 + v t; the instant a body reaches a position; the velocity or a later
 * position read from a space-time graph (the `grafico-dati` scene); the displacement as the area under a
 * velocity-time graph; two bodies that meet or one that catches up with the other. Distractors from the lesson's
 * warnings: s0 forgotten, the sign of v lost, s/t read on the graph ignoring s0, the displacement from time zero,
 * the sum of the speeds in a chase and their difference in a meeting.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { graphScene } from '../grafici';
import { dr, ds, moverFor, opt, opts, qt, roadScene, sig, stepInt } from '../cinematica';

export const ID = 'fis-moto-rettilineo-uniforme';

const S = (x: number) => String(x);
const neg = (s: string) => (s.startsWith('-') ? `(${s.replace('.', '{,}')})` : s.replace('.', '{,}'));
/** A speed with two significant figures: 1,5 to 9,5 in halves, or 11 to 25. */
const speed = (rng: Rng) => (rng.next() < 0.6 ? rng.int(1, 9) + 0.5 : rng.int(11, 25));
/** An exact decimal string for a JS number built from halves and integers. */
const X = (x: number) => ds(dr(x.toFixed(2)));
/** A value that may be rounded: exact if short, otherwise two significant figures. */
const loose = (x: number) => {
	try {
		const e = ds(dr(x.toFixed(2)));
		if (Math.abs(Number(e) - x) < 1e-9) return e;
	} catch {
		/* not short */
	}
	return sig(x, 2);
};

// ---------------------------------------------------------------------------
// Level 1: the position from the law

function level1(rng: Rng): Built {
	const negative = rng.next() < 0.5;
	for (;;) {
		const s0 = stepInt(rng, -50, 200, 5);
		const v = (negative ? -1 : 1) * speed(rng);
		const tt = rng.int(2, 40);
		const s = s0 + v * tt;
		if (Math.abs(s) > 600 || s === 0) continue;
		const body = moverFor(rng, v);
		return {
			prompt: 'Trova la posizione.',
			problem: textBlock(`${body} si muove di moto rettilineo uniforme con velocità $v = ${qt(X(v), 'm/s')}$; all'istante $t = 0$ si trova in $s_0 = ${qt(S(s0), 'm')}$. Dove si trova all'istante $t = ${qt(S(tt), 's')}$?`),
			solution: `s = ${qt(X(s), 'm')}`,
			steps: [t('La legge oraria del moto rettilineo uniforme:'), `s = s_0 + v\\,t = ${qt(S(s0), 'm')} + ${neg(X(v))}\\,\\text{m/s} \\cdot ${qt(S(tt), 's')} = ${qt(S(s0), 'm')} ${v < 0 ? '-' : '+'} ${qt(X(Math.abs(v * tt)), 'm')} = ${qt(X(s), 'm')}`],
			// s0 forgotten; the sign of v lost; s0 and v t subtracted the other way
			answer: choiceOf(rng, opt(X(s), 'm'), opts([X(v * tt), X(s0 - v * tt), X(v * tt - s0)], 'm'), opts([X(s + 10), X(s - 10), X(s + 20)], 'm')),
			params: { case: negative ? 'negativa' : 'positiva', s0, v: X(v), t: tt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the instant a body reaches a position

function level2(rng: Rng): Built {
	const negative = rng.next() < 0.5;
	for (;;) {
		const s0 = stepInt(rng, -50, 200, 5);
		const v = (negative ? -1 : 1) * speed(rng);
		const tt = rng.int(3, 60);
		const s = s0 + v * tt;
		if (Math.abs(s) > 600 || s === 0 || !Number.isInteger(s)) continue;
		const body = moverFor(rng, v);
		return {
			prompt: "Trova l'istante.",
			problem: textBlock(`${body} si muove di moto rettilineo uniforme con velocità $v = ${qt(X(v), 'm/s')}$; all'istante $t = 0$ si trova in $s_0 = ${qt(S(s0), 'm')}$. In quale istante passa per la posizione $s = ${qt(S(s), 'm')}$?`),
			solution: `t = ${qt(S(tt), 's')}`,
			steps: [t('Dalla legge oraria si ricava il tempo:'), `t = \\dfrac{s - s_0}{v} = \\dfrac{${S(s)} - ${neg(S(s0))}}{${X(v).replace('.', '{,}')}}\\,\\text{s} = \\dfrac{${qt(S(s - s0), 'm')}}{${qt(X(v), 'm/s')}} = ${qt(S(tt), 's')}`],
			// s0 forgotten; s0 added; the ratio upside down
			answer: choiceOf(rng, opt(S(tt), 's'), opts([loose(s / v), loose((s + s0) / v), loose(v / (s - s0))].filter((x) => x !== null && Number(x) > 0), 's'), opts([S(tt + 5), S(tt - 5), S(tt + 10)].filter((x) => Number(x) > 0), 's')),
			params: { case: negative ? 'negativa' : 'positiva', s0, v: X(v), s },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: reading a space-time graph

function level3(rng: Rng): Built {
	const askV = rng.next() < 0.5;
	for (;;) {
		const pt = rng.pick([1, 2]); // seconds per cell
		const ps = rng.pick([10, 20]); // metres per cell
		const cellsT = 10, cellsS = 8;
		const k0 = rng.int(0, 6); // s0 in cells
		const kt = rng.int(3, 10); // the second point, in cells of t
		const ks = rng.int(0, cellsS);
		if (ks === k0) continue;
		const s0 = k0 * ps, t1 = kt * pt, s1 = ks * ps;
		const v = (s1 - s0) / t1;
		const vs = loose(v);
		if (vs === null || X(v) !== vs) continue; // an exact velocity
		if (Math.abs(v) < 1 || Math.abs(v) > 25) continue;
		const b = moverFor(rng, v);
		const scene = graphScene({ nome: 't', unita: 's', passo: pt, celle: cellsT, etichette: pt === 1 ? 2 : 1 }, { nome: 's', unita: 'm', passo: ps, celle: cellsS, etichette: 2 }, { punti: [[0, s0], [t1, s1]], linea: { tipo: 'retta', m: v, q: s0 } }, `Grafico spazio-tempo: una retta che passa per i punti a 0 secondi e ${s0} metri e a ${t1} secondi e ${s1} metri.`);
		const lead = `Il grafico spazio-tempo di ${b.toLowerCase()} in moto rettilineo uniforme è la retta della figura.`;
		if (askV) {
			return {
				prompt: 'Trova la velocità.',
				problem: textBlock(`${lead} Quanto vale la sua velocità?`),
				solution: `v = ${qt(vs, 'm/s')}`,
				steps: [t('Due punti della retta sugli incroci della griglia:'), `(0\\,\\text{s};\\ ${qt(S(s0), 'm')}) \\qquad (${qt(S(t1), 's')};\\ ${qt(S(s1), 'm')})`, `v = \\dfrac{\\Delta s}{\\Delta t} = \\dfrac{${S(s1)} - ${S(s0)}}{${S(t1)} - 0}\\,\\text{m/s} = ${qt(vs, 'm/s')}`],
				// s/t of one point, ignoring s0; the sign lost; the ratio upside down
				answer: choiceOf(rng, opt(vs, 'm/s'), opts([s1 ? loose(s1 / t1) : null, X(-v), loose(t1 / (s1 - s0))], 'm/s'), opts([loose(v * 2), loose(v / 2), loose(v + (v > 0 ? 5 : -5))], 'm/s')),
				params: { case: 'velocita', s0, t1, s1 },
				scene,
			};
		}
		const tq = rng.pick([15, 20, 25, 30, 40, 50, 60].filter((x) => x > cellsT * pt)); // after the end of the graph
		const sq = s0 + v * tq;
		if (!Number.isInteger(sq) || sq === 0) continue;
		return {
			prompt: 'Trova la posizione.',
			problem: textBlock(`${lead} Se il moto continua allo stesso modo, dove si trova all'istante $t = ${qt(S(tq), 's')}$?`),
			solution: `s = ${qt(S(sq), 'm')}`,
			steps: [t("Dal grafico: la retta taglia l'asse s in s0, e la pendenza è la velocità."), `s_0 = ${qt(S(s0), 'm')} \\qquad v = \\dfrac{${S(s1)} - ${S(s0)}}{${S(t1)}}\\,\\text{m/s} = ${qt(vs, 'm/s')}`, `s = s_0 + v\\,t = ${S(s0)} + ${neg(vs)} \\cdot ${S(tq)}\\,\\text{m} = ${qt(S(sq), 'm')}`],
			// s0 forgotten; the velocity read as s/t of the point; the sign of v lost
			answer: choiceOf(rng, opt(S(sq), 'm'), opts([X(v * tq), s1 ? loose((s1 / t1) * tq) : null, X(s0 - v * tq)], 'm'), opts([S(sq + 20), S(sq - 20), S(sq + 40)], 'm')),
			params: { case: 'posizione', s0, t1, s1, tq },
			scene,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the displacement as an area

function level4(rng: Rng): Built {
	for (;;) {
		const pt = rng.pick([1, 2]);
		const pv = rng.pick([1, 2, 5]);
		const cellsV = rng.int(5, 8);
		const kv = rng.int(2, cellsV);
		const v = kv * pv;
		const t1 = rng.int(0, 5) * pt, t2 = t1 + rng.int(2, 5) * pt;
		if (t2 > 10 * pt) continue;
		const d = v * (t2 - t1);
		if (v > 25) continue;
		const b = moverFor(rng, v);
		const scene = graphScene({ nome: 't', unita: 's', passo: pt, celle: 10, etichette: pt === 1 ? 2 : 1 }, { nome: 'v', unita: 'm/s', passo: pv, celle: cellsV, etichette: 1 }, { linea: { tipo: 'retta', m: 0, q: v } }, `Grafico velocità-tempo: una retta orizzontale all'altezza di ${v} metri al secondo.`);
		return {
			prompt: 'Trova lo spostamento.',
			problem: textBlock(`Il grafico velocità-tempo di ${b.toLowerCase()} in moto rettilineo uniforme è quello della figura. Di quanto si sposta tra $t = ${qt(S(t1), 's')}$ e $t = ${qt(S(t2), 's')}$?`),
			solution: `\\Delta s = ${qt(S(d), 'm')}`,
			steps: [t(`Dal grafico la velocità è ${v} m/s. Lo spostamento è l'area del rettangolo sotto la retta:`), `\\Delta s = v\\,\\Delta t = ${qt(S(v), 'm/s')} \\cdot (${S(t2)} - ${S(t1)})\\,\\text{s} = ${qt(S(d), 'm')}`],
			// from time zero; up to the first instant; the velocity over the interval
			answer: choiceOf(rng, opt(S(d), 'm'), opts([S(v * t2), t1 ? S(v * t1) : null, loose(v / (t2 - t1)), S(v * (t1 + t2))], 'm'), opts([S(d + v), S(d - v), S(d + 2 * v)].filter((x) => Number(x) > 0), 'm')),
			params: { t1, t2, v, pt, pv },
			scene,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: meeting and catching up

function level5(rng: Rng): Built {
	const meet = rng.next() < 0.5;
	const askT = rng.next() < 0.5;
	for (;;) {
		const tt = rng.int(5, 60);
		// two cyclists (up to 12 m/s), or a car and a truck
		const vA = meet ? rng.int(3, 12) : rng.int(18, 36);
		const vB = meet ? rng.int(2, 12) : rng.int(12, vA - 2);
		const D = meet ? (vA + vB) * tt : (vA - vB) * tt;
		if (D < 50 || D > 2000) continue;
		const x = vA * tt;
		const unit = askT ? 's' : 'm';
		const ans = askT ? S(tt) : S(x);
		const problem = meet
			? `Due ciclisti partono nello stesso istante dalle due estremità di una strada dritta lunga $${qt(S(D), 'm')}$ e si vengono incontro: $A$ va a $${qt(S(vA), 'm/s')}$, $B$ a $${qt(S(vB), 'm/s')}$. ${askT ? 'Dopo quanto tempo si incontrano?' : 'A che distanza dal punto di partenza di $A$ si incontrano?'}`
			: `Un'auto che va a $${qt(S(vA), 'm/s')}$ insegue su una strada dritta un camion che va nello stesso verso a $${qt(S(vB), 'm/s')}$; all'istante zero il camion è $${qt(S(D), 'm')}$ più avanti. ${askT ? "Dopo quanto tempo l'auto raggiunge il camion?" : "Quanta strada percorre l'auto prima di raggiungere il camion?"}`;
		const laws = meet ? `s_A = ${S(vA)}\\,t \\qquad s_B = ${S(D)} - ${S(vB)}\\,t` : `s_A = ${S(vA)}\\,t \\qquad s_B = ${S(D)} + ${S(vB)}\\,t`;
		const eq = meet ? `${S(vA)}\\,t = ${S(D)} - ${S(vB)}\\,t \\;\\Rightarrow\\; ${S(vA + vB)}\\,t = ${S(D)}` : `${S(vA)}\\,t = ${S(D)} + ${S(vB)}\\,t \\;\\Rightarrow\\; ${S(vA - vB)}\\,t = ${S(D)}`;
		const wrongRel = meet ? (vA !== vB ? loose(D / Math.abs(vA - vB)) : null) : loose(D / (vA + vB));
		const mistakes = askT ? [wrongRel, loose(D / vA), loose(D / vB)] : meet ? [S(vB * tt), X(D / 2), S(D)] : [S(vB * tt), S(D), S(D + vA * tt)];
		const alt = meet ? `Una strada dritta lunga ${D} metri: A parte da un'estremità verso destra, B dall'altra verso sinistra.` : `Una strada dritta: l'auto A parte dall'origine, il camion B è ${D} metri più avanti, e vanno tutti e due verso destra.`;
		return {
			prompt: askT ? "Trova l'istante dell'incontro." : "Trova la posizione dell'incontro.",
			problem: textBlock(problem),
			solution: askT ? `t = ${qt(ans, 's')}` : `s = ${qt(ans, 'm')}`,
			steps: [
				t(`Origine nel punto di partenza di ${meet ? 'A' : "dell'auto"}, verso positivo ${meet ? 'da A verso B' : 'quello del moto'}; spazi in metri, tempi in secondi:`),
				laws,
				`s_A = s_B \\;\\Rightarrow\\; ${eq} \\;\\Rightarrow\\; t = ${qt(S(tt), 's')}`,
				...(askT ? [] : [`s_A = ${S(vA)} \\cdot ${S(tt)}\\,\\text{m} = ${qt(S(x), 'm')}`]),
			],
			// time: the other relative speed, one speed only; place: the other body's way, half the distance
			answer: choiceOf(rng, opt(ans, unit), opts(mistakes.filter((m) => m !== null && Number(m) > 0), unit), opts(askT ? [S(tt + 5), S(tt - 5), S(tt + 10)] : [S(x + 50), S(x - 50), S(x + 100)], unit).filter((o) => Number(o.values[0]) > 0)),
			params: { case: meet ? 'incontro' : 'inseguimento', ask: askT ? 'tempo' : 'posizione', D, vA, vB },
			scene: roadScene(alt, {
				punti: [
					{ s: 0, nome: 'A' },
					{ s: D, nome: 'B' },
				],
				velocita: [
					{ s: 0, verso: 1, nome: 'v', sub: 'A' },
					{ s: D, verso: meet ? -1 : 1, nome: 'v', sub: 'B' },
				],
			}),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level >= 3 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisMotoRettilineoUniforme: Generator = {
	id: ID,
	title: 'Il moto rettilineo uniforme e il grafico spazio-tempo',
	levels: {
		1: { label: 'La legge oraria', constraints: ['velocità positiva o negativa, metà ciascuna', 'posizione iniziale diversa da zero'] },
		2: { label: "L'istante di arrivo", constraints: ['tempo intero da 3 a 60 s', 'velocità positiva o negativa, metà ciascuna'] },
		3: { label: 'Il grafico spazio-tempo', constraints: ['retta sulla griglia, due punti sugli incroci', 'la velocità o una posizione dopo, metà ciascuna'] },
		4: { label: "L'area sotto il grafico velocità-tempo", constraints: ['velocità costante positiva', 'intervallo che non parte sempre da zero'] },
		5: { label: "L'incontro", constraints: ["incontro o inseguimento, metà ciascuno", "l'istante o la posizione"] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisMotoRettilineoUniforme;
