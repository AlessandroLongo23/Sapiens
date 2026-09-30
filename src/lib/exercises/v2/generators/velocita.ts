/**
 * La velocità media e istantanea. Spec: specs/exercises/velocita.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/39-velocita.md), each one step harder: the mean velocity
 * from two positions and two instants, with its sign; km/h to m/s and back; a distance or a time from a speed in km/h
 * and minutes; the mean velocity and the mean speed of a trip there and partly back; the mean velocity of a trip in
 * two stretches. Distractors from the lesson's warnings: position over instant, the sign lost, 3,6 the wrong way,
 * minutes read as hundredths of an hour, the mean speed for the mean velocity, the average of the two speeds.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { dr, ds, fixed, moverFor, opt, opts, qt, roadScene, say, sig, stepInt, thenRound } from '../cinematica';

export const ID = 'velocita';

const S = (x: number) => String(x);
const sub = (a: number, b: number) => `${S(a)} - ${b < 0 ? `(${S(b)})` : S(b)}`;
const lbl = (x: number) => `${S(x).replace('-', '−')} m`;

// ---------------------------------------------------------------------------
// Level 1: the mean velocity from two positions and two instants

function level1(rng: Rng): Built {
	const negative = rng.next() < 0.5;
	for (;;) {
		// two significant figures: 1,5 to 9,5 in halves, or 11 to 15
		const mag = rng.next() < 0.7 ? rng.int(1, 9) + 0.5 : rng.int(11, 15);
		const v = dr(negative ? -mag : mag);
		const dt = rng.int(2, 20);
		const dsR = v.mul(dr(dt));
		if (!dsR.isInteger()) continue;
		const d = Number(ds(dsR));
		const t1 = rng.int(1, 15), t2 = t1 + dt;
		const s1 = rng.int(-40, 120);
		const s2 = s1 + d;
		if (s1 === 0 || s2 === 0 || Math.abs(s2) > 300) continue;
		const vs = ds(v);
		const body = moverFor(rng, mag);
		const alt = `Una strada dritta con la retta orientata s: all'istante t1, ${t1} secondi, il corpo è in ${say(S(s1))} metri; all'istante t2, ${t2} secondi, è in ${say(S(s2))} metri.`;
		return {
			prompt: 'Trova la velocità media.',
			problem: textBlock(`${body} su una strada dritta passa dalla posizione $s_1 = ${qt(S(s1), 'm')}$ all'istante $t_1 = ${qt(S(t1), 's')}$ e dalla posizione $s_2 = ${qt(S(s2), 'm')}$ all'istante $t_2 = ${qt(S(t2), 's')}$. Qual è la sua velocità media?`),
			solution: `v_m = ${qt(vs, 'm/s')}`,
			steps: [
				t("Lo spostamento diviso l'intervallo di tempo:"),
				`v_m = \\dfrac{s_2 - s_1}{t_2 - t_1} = \\dfrac{${sub(s2, s1)}}{${S(t2)} - ${S(t1)}}\\,\\dfrac{\\text{m}}{\\text{s}} = \\dfrac{${qt(S(d), 'm')}}{${qt(S(dt), 's')}} = ${qt(vs, 'm/s')}`,
				t(negative ? 'Il segno meno dice che il corpo va nel verso negativo della retta.' : 'Il segno più dice che il corpo va nel verso positivo della retta.'),
			],
			// the sign lost; the final position over the final instant; the displacement over the final instant; the ratio upside down
			answer: choiceOf(rng, opt(vs, 'm/s'), opts([ds(v.neg()), sig(s2 / t2, 2), sig(d / t2, 2), sig(dt / d, 2)], 'm/s'), opts([sig(Number(vs) * 1.5, 2), sig(Number(vs) * 0.5, 2), sig(Number(vs) * 2, 2)], 'm/s')),
			params: { case: negative ? 'negativa' : 'positiva', s1, s2, t1, t2 },
			scene: roadScene(alt, {
				punti: [
					{ s: s1, etichetta: `t₁ = ${t1} s` },
					{ s: s2, etichetta: `t₂ = ${t2} s` },
				],
			}),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: km/h and m/s

function level2(rng: Rng): Built {
	const toMs = rng.next() < 0.5;
	for (;;) {
		if (toMs) {
			// a multiple of 9 km/h (half metres per second), or a whole number of metres per second
			const kmhS = rng.next() < 0.5 ? S(9 * rng.int(2, 15)) : ds(dr(rng.int(5, 40)).mul(dr('3.6')));
			const kmh = Number(kmhS);
			const ms = ds(dr(kmhS).div(dr('3.6')));
			return {
				prompt: 'Converti la velocità.',
				problem: textBlock(`Converti in metri al secondo la velocità di $${qt(kmhS, 'km/h')}$.`),
				solution: `${qt(kmhS, 'km/h')} = ${qt(ms, 'm/s')}`,
				steps: [t('Da km/h a m/s si divide per 3,6, perché 1 m/s = 3,6 km/h:'), `\\dfrac{${kmhS.replace('.', '{,}')}}{3{,}6}\\,\\text{m/s} = ${qt(ms, 'm/s')}`, t('Controllo: il numero in m/s è più piccolo di quello in km/h.')],
				// 3,6 the wrong way; divided by 60; the comma in the wrong place
				answer: choiceOf(rng, opt(ms, 'm/s'), opts([ds(dr(kmhS).mul(dr('3.6'))), sig(kmh / 60, 2), ds(dr(kmhS).div(dr(36)))], 'm/s'), opts([ds(dr(ms).add(dr(5))), ds(dr(ms).add(dr(-5)))], 'm/s')),
				params: { case: 'kmh-ms', kmh: kmhS },
			};
		}
		const ms = rng.int(5, 45);
		if (ms % 10 === 0) continue;
		const kmh = ds(dr(ms).mul(dr('3.6')));
		return {
			prompt: 'Converti la velocità.',
			problem: textBlock(`Converti in chilometri all'ora la velocità di $${qt(S(ms), 'm/s')}$.`),
			solution: `${qt(S(ms), 'm/s')} = ${qt(kmh, 'km/h')}`,
			steps: [t('Da m/s a km/h si moltiplica per 3,6:'), `${S(ms)} \\cdot 3{,}6\\,\\text{km/h} = ${qt(kmh, 'km/h')}`, t('Controllo: il numero in km/h è più grande di quello in m/s.')],
			// 3,6 the wrong way; times 36; times 60
			answer: choiceOf(rng, opt(kmh, 'km/h'), opts([sig(ms / 3.6, 2), S(ms * 36), S(ms * 60)], 'km/h'), opts([ds(dr(kmh).add(dr(10))), ds(dr(kmh).add(dr(-10)))], 'km/h')),
			params: { case: 'ms-kmh', ms },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: a distance or a time, with km/h and minutes

const MINUTES = [6, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 48, 50];
const VEHICLES = [
	{ who: "Un'auto", road: "un'autostrada dritta" },
	{ who: 'Un treno', road: 'un binario dritto' },
	{ who: 'Un pullman', road: 'una strada dritta' },
];

function level3(rng: Rng): Built {
	const askD = rng.next() < 0.5;
	for (;;) {
		const M = rng.pick(MINUTES);
		const v = stepInt(rng, 30, 130, 5);
		const dR = dr(v).mul(dr(M)).div(dr(60));
		let d: string;
		try {
			d = ds(dR);
		} catch {
			continue;
		}
		if (d.includes('.') && d.split('.')[1].length > 1) continue;
		if (Number(d) < 1) continue;
		const who = rng.pick(VEHICLES);
		const lead = `${who.who} viaggia a velocità costante di $${qt(S(v), 'km/h')}$ su ${who.road}.`;
		if (askD) {
			return {
				prompt: 'Trova la distanza percorsa.',
				problem: textBlock(`${lead} Quanta strada percorre in $${qt(S(M), 'min')}$?`),
				solution: `\\Delta s = ${qt(d, 'km')}`,
				steps: [t('Il tempo va in ore, come nella velocità:'), `${qt(S(M), 'min')} = \\dfrac{${M}}{60}\\,\\text{h}`, `\\Delta s = v \\cdot \\Delta t = ${qt(S(v), 'km/h')} \\cdot \\dfrac{${M}}{60}\\,\\text{h} = ${qt(d, 'km')}`],
				// minutes not converted; minutes as hundredths of an hour; the ratio upside down
				answer: choiceOf(rng, opt(d, 'km'), opts([S(v * M), fixed((v * M) / 100, 1), sig((v * 60) / M, 3)], 'km'), opts([fixed(Number(d) * 2, 1), fixed(Number(d) / 2, 1)], 'km')),
				params: { case: 'distanza', v, M },
			};
		}
		return {
			prompt: 'Trova il tempo.',
			problem: textBlock(`${lead} Quanto tempo impiega a percorrere $${qt(d, 'km')}$?`),
			solution: `\\Delta t = ${qt(S(M), 'min')}`,
			steps: [`\\Delta t = \\dfrac{\\Delta s}{v} = \\dfrac{${qt(d, 'km')}}{${qt(S(v), 'km/h')}} = ${qt(ds(dR.div(dr(v))), 'h')}`, t('In minuti si moltiplica per 60:'), `${ds(dR.div(dr(v))).replace('.', '{,}')} \\cdot 60\\,\\text{min} = ${qt(S(M), 'min')}`],
			// hours read as hundredths; the ratio upside down; the hours written as minutes
			answer: choiceOf(rng, opt(S(M), 'min'), opts([fixed((100 * Number(d)) / v, 1), sig((60 * v) / Number(d), 2), ds(dR.div(dr(v)))], 'min'), opts([S(M + 5), S(M - 5), S(M + 10)], 'min')),
			params: { case: 'tempo', v, d },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: mean velocity and mean speed on a trip there and partly back

function level4(rng: Rng): Built {
	const askScalar = rng.next() < 0.5;
	for (;;) {
		const s0 = stepInt(rng, 0, 60, 10, true);
		const L1 = stepInt(rng, 40, 300, 10);
		const L2 = stepInt(rng, 20, L1 + 100, 10);
		if (L2 === L1) continue;
		const dir = rng.next() < 0.8 ? 1 : -1;
		const s1 = s0 + dir * L1, s2 = s1 - dir * L2;
		const dt = rng.int(10, 90);
		const dist = L1 + L2, disp = s2 - s0;
		const vs = sig(dist / dt, 2), vm = sig(disp / dt, 2);
		if (vs === null || vm === null) continue;
		if (dist / dt > 25) continue;
		const ans = askScalar ? vs : vm;
		const body = moverFor(rng, dist / dt);
		const alt = `Una strada dritta con la retta orientata s: si parte da ${say(S(s0))} metri, si arriva fino a ${say(S(s1))} metri e si torna indietro fino a ${say(S(s2))} metri.`;
		return {
			prompt: askScalar ? 'Trova la velocità scalare media.' : 'Trova la velocità media.',
			problem: textBlock(`${body} parte da $s = ${qt(S(s0), 'm')}$, arriva fino a $s = ${qt(S(s1), 'm')}$ e torna indietro fino a $s = ${qt(S(s2), 'm')}$, in tutto in $${qt(S(dt), 's')}$. Quanto vale la sua ${askScalar ? 'velocità scalare media' : 'velocità media'}?`),
			solution: `${askScalar ? 'v_s' : 'v_m'} ${Math.abs(Number(ans) - (askScalar ? dist : disp) / dt) < 1e-9 ? '=' : '\\approx'} ${qt(ans, 'm/s')}`,
			steps: askScalar
				? [t('La distanza percorsa somma i due tratti:'), `d = ${qt(S(L1), 'm')} + ${qt(S(L2), 'm')} = ${qt(S(dist), 'm')}`, `v_s = \\dfrac{d}{\\Delta t} = \\dfrac{${qt(S(dist), 'm')}}{${qt(S(dt), 's')}} ${thenRound(dist / dt, ans, 'm/s')}`]
				: [t("Lo spostamento dipende solo dalla partenza e dall'arrivo:"), `\\Delta s = ${qt(S(s2), 'm')} - ${s0 < 0 ? `(${qt(S(s0), 'm')})` : qt(S(s0), 'm')} = ${qt(S(disp), 'm')}`, `v_m = \\dfrac{\\Delta s}{\\Delta t} = \\dfrac{${qt(S(disp), 'm')}}{${qt(S(dt), 's')}} ${thenRound(disp / dt, ans, 'm/s')}`],
			// mean velocity: the mean speed, the sign lost, only the way out; mean speed: the mean velocity, only the way out, the final position over the time
			answer: askScalar
				? choiceOf(rng, opt(ans, 'm/s'), opts([sig(Math.abs(disp) / dt, 2), sig(L1 / dt, 2), sig(Math.abs(s2) / dt, 2)], 'm/s'), opts([sig((dist * 1.5) / dt, 2), sig((dist * 0.6) / dt, 2)], 'm/s'))
				: choiceOf(rng, opt(ans, 'm/s'), opts([sig((dir * dist) / dt, 2), sig(-disp / dt, 2), sig((dir * L1) / dt, 2)], 'm/s'), opts([sig((disp * 1.5) / dt, 2), sig((disp * 0.6) / dt, 2)], 'm/s')),
			params: { case: askScalar ? 'scalare' : 'vettoriale', s0, s1, s2, dt },
			scene: roadScene(alt, {
				punti: [
					{ s: s0, nome: 'partenza', etichetta: lbl(s0) },
					{ s: s1, etichetta: lbl(s1) },
					{ s: s2, nome: 'arrivo', etichetta: lbl(s2) },
				],
				tratti: [
					{ da: s0, a: s1 },
					{ da: s1, a: s2 },
				],
			}),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: two stretches

const HOURS = ['0.25', '0.5', '0.75', '1', '1.25', '1.5', '2', '2.5', '3'];
const MINS = [10, 15, 20, 30, 40, 45, 60, 90];

function level5(rng: Rng): Built {
	const byTime = rng.next() < 0.5;
	for (;;) {
		const v1 = stepInt(rng, 30, 130, 10), v2 = stepInt(rng, 30, 130, 10);
		if (v1 === v2) continue;
		let t1: string, t2: string, d1: number, d2: number;
		if (byTime) {
			const m1 = rng.pick(MINS), m2 = rng.pick(MINS);
			if (m1 === m2) continue;
			t1 = String(m1);
			t2 = String(m2);
			const d1R = dr(v1).mul(dr(m1)).div(dr(60)), d2R = dr(v2).mul(dr(m2)).div(dr(60));
			if (!d1R.isInteger() || !d2R.isInteger()) continue;
			d1 = Number(ds(d1R));
			d2 = Number(ds(d2R));
			const V = ((d1 + d2) * 60) / (m1 + m2);
			const ans = fixed(V, 0);
			if (ans === null) continue;
			const mean = fixed((v1 + v2) / 2, 0);
			const who = rng.pick(VEHICLES);
			return {
				prompt: 'Trova la velocità media.',
				problem: textBlock(`${who.who} viaggia per $${qt(t1, 'min')}$ a $${qt(S(v1), 'km/h')}$ e poi per $${qt(t2, 'min')}$ a $${qt(S(v2), 'km/h')}$, sempre nello stesso verso. Qual è la sua velocità media su tutto il viaggio?`),
				solution: `v_m ${Number.isInteger(V) ? '=' : '\\approx'} ${qt(ans, 'km/h')}`,
				steps: [
					t('La strada di ogni tratto è la velocità per il tempo, con il tempo in ore:'),
					`${S(v1)} \\cdot \\dfrac{${m1}}{60}\\,\\text{km} = ${qt(S(d1), 'km')} \\qquad ${S(v2)} \\cdot \\dfrac{${m2}}{60}\\,\\text{km} = ${qt(S(d2), 'km')}`,
					`v_m = \\dfrac{${S(d1)} + ${S(d2)}}{\\tfrac{${m1 + m2}}{60}}\\,\\text{km/h} ${Number.isInteger(V) ? '=' : '\\approx'} ${qt(ans, 'km/h')}`,
					t('La media delle due velocità è giusta solo se i tratti durano lo stesso tempo.'),
				],
				// the average of the two speeds; the average weighted by the distances; the harmonic mean
				answer: choiceOf(rng, opt(ans, 'km/h'), opts([mean, fixed((v1 * d1 + v2 * d2) / (d1 + d2), 0), fixed((2 * v1 * v2) / (v1 + v2), 0)], 'km/h'), opts([S(Number(ans) + 3), S(Number(ans) - 3), S(Number(ans) + 6)], 'km/h')),
				params: { case: 'tempi', v1, v2, m1, m2 },
			};
		}
		t1 = rng.pick(HOURS);
		t2 = rng.pick(HOURS);
		if (t1 === t2) continue;
		const d1R = dr(v1).mul(dr(t1)), d2R = dr(v2).mul(dr(t2));
		if (!d1R.isInteger() || !d2R.isInteger()) continue;
		d1 = Number(ds(d1R));
		d2 = Number(ds(d2R));
		const T = Number(t1) + Number(t2);
		const V = (d1 + d2) / T;
		const ans = fixed(V, 0);
		if (ans === null) continue;
		const who = rng.pick(VEHICLES);
		return {
			prompt: 'Trova la velocità media.',
			problem: textBlock(`${who.who} percorre $${qt(S(d1), 'km')}$ a $${qt(S(v1), 'km/h')}$ e poi altri $${qt(S(d2), 'km')}$ a $${qt(S(v2), 'km/h')}$, sempre nello stesso verso. Qual è la sua velocità media su tutto il viaggio?`),
			solution: `v_m ${Number.isInteger(V) ? '=' : '\\approx'} ${qt(ans, 'km/h')}`,
			steps: [
				t('Il tempo di ogni tratto è la strada divisa la velocità:'),
				`\\Delta t_1 = \\dfrac{${qt(S(d1), 'km')}}{${qt(S(v1), 'km/h')}} = ${qt(t1, 'h')} \\qquad \\Delta t_2 = \\dfrac{${qt(S(d2), 'km')}}{${qt(S(v2), 'km/h')}} = ${qt(t2, 'h')}`,
				`v_m = \\dfrac{${S(d1)} + ${S(d2)}}{${t1.replace('.', '{,}')} + ${t2.replace('.', '{,}')}}\\,\\text{km/h} = \\dfrac{${qt(S(d1 + d2), 'km')}}{${qt(ds(dr(t1).add(dr(t2))), 'h')}} ${Number.isInteger(V) ? '=' : '\\approx'} ${qt(ans, 'km/h')}`,
				t('Non si fa la media delle due velocità: il tratto più lungo nel tempo pesa di più.'),
			],
			// the average of the two speeds; the average weighted by the distances; the harmonic mean
			answer: choiceOf(rng, opt(ans, 'km/h'), opts([fixed((v1 + v2) / 2, 0), fixed((v1 * d1 + v2 * d2) / (d1 + d2), 0), fixed((2 * v1 * v2) / (v1 + v2), 0)], 'km/h'), opts([S(Number(ans) + 3), S(Number(ans) - 3), S(Number(ans) + 6)], 'km/h')),
			params: { case: 'distanze', v1, v2, d1, d2 },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if ((sample.level === 1 || sample.level === 4) && !sample.scene) v.push('manca la scena');
	if (sample.scene && 'spostamento' in sample.scene.data) v.push('la scena del problema disegna lo spostamento');
	return v;
}

export const velocita: Generator = {
	id: ID,
	title: 'La velocità media e istantanea',
	levels: {
		1: { label: 'La velocità media', constraints: ['due posizioni e due istanti', 'velocità positiva o negativa, metà ciascuna'] },
		2: { label: "Chilometri all'ora e metri al secondo", constraints: ['da km/h a m/s o da m/s a km/h, metà ciascuno'] },
		3: { label: 'Distanza e tempo', constraints: ['velocità in km/h, tempi in minuti', 'la distanza o il tempo, metà ciascuno'] },
		4: { label: 'Velocità media e velocità scalare media', constraints: ['andata e ritorno parziale', 'una delle due, metà ciascuna'] },
		5: { label: 'Un viaggio in due tratti', constraints: ['due distanze o due durate, metà ciascuno', 'risposta al km/h'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default velocita;
