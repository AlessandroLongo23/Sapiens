/**
 * Temperatura e calore (chemistry, first year). Spec: specs/exercises/chim-temperatura-calore.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/12-chim-temperatura-calore.md), each one step harder:
 * Celsius and kelvin (T = t + 273); differences of temperature, the same number in the two scales; the heat to warm a
 * body, Q = c m Δt with c in J/(g·°C) and m in grams; the final temperature from the heat received or given; the
 * heat a dissolution or a reaction exchanges with the water of a calorimeter, and whether it is exothermic or
 * endothermic; the temperature of two masses of water mixed. Distractors from the lesson's warnings: 273 subtracted
 * for added or put on a difference, the sign of a negative temperature lost, the final temperature for Δt, Δt the wrong
 * way round (exothermic for endothermic), the plain average of the temperatures.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Built, type R, type Written, around, answerOf, checkCommon, choose, datum, dec, decimals, generateWith, pu, q, sigSafe, t, wu } from '../chim-misure';

export const ID = 'chim-temperatura-calore';

/** Specific heats of the lesson's table, J/(g·°C). */
const SUBST = [
	{ nome: "d'acqua", c: q(4186, 1000) },
	{ nome: 'di etanolo', c: q(244, 100) },
	{ nome: "di olio d'oliva", c: q(197, 100) },
	{ nome: 'di alluminio', c: q(897, 1000) },
	{ nome: 'di ferro', c: q(449, 1000) },
	{ nome: 'di rame', c: q(385, 1000) },
];
const CU = 'J/(g·°C)';

function must(x: R, n: number): Written {
	const w = sigSafe(x, n);
	if (!w) throw new Error('tie');
	return w;
}

/** An integer temperature option. */
const intOpt = (x: number, u: string): ChoiceOption => ({ latex: wu(String(x), u), values: [String(x)] });

/** A mass in grams with three significant figures: 10,0-99,9 or 101-999 (no trailing zero). */
function mass3(rng: Rng): R {
	for (;;) {
		if (rng.next() < 0.5) {
			const k = rng.int(100, 999);
			if (k % 10) return datum(k, 1);
		} else {
			const k = rng.int(101, 999);
			if (k % 10) return q(k);
		}
	}
}

/** The significant figures of a positive decimal as written with d decimals. */
const sigOf = (r: R, d: number) => dec(r, d).replace('{,}', '').replace(/\\,/g, '').replace(/^0+/, '').length;

/** Heat for the options: in kJ from 1000 J up, otherwise in J. */
function heatUnit(Q: R): { u: string; k: R } {
	return Q.compare(q(1000)) >= 0 ? { u: 'kJ', k: q(1, 1000) } : { u: 'J', k: q(1) };
}

// ---------------------------------------------------------------------------
// Level 1: Celsius and kelvin

function level1(rng: Rng): Built {
	const toK = rng.next() < 0.5;
	const neg = rng.next() < 0.4;
	const tc = neg ? -rng.int(5, 260) : rng.int(5, 400);
	const T = tc + 273;
	if (toK) {
		// 273 subtracted; the sign of a negative temperature lost; 273 forgotten
		const wrong = [tc - 273, Math.abs(tc) + 273, tc, 273 - tc].filter((x) => x > 0 && x !== T);
		return {
			prompt: 'Converti in kelvin.',
			problem: textBlock(`Esprimi in kelvin la temperatura ${pu(String(tc), '°C')}.`),
			solution: wu(String(T), 'K'),
			steps: [`T = t + 273 = ${tc < 0 ? `-${-tc}` : tc} + 273 = ${wu(String(T), 'K')}`],
			answer: choose(rng, intOpt(T, 'K'), wrong.map((x) => intOpt(x, 'K'))),
			params: { case: neg ? 'negativa' : 'positiva', dir: 'K', t: tc },
		};
	}
	// T → t: 273 added; the sign lost; unchanged
	const wrong = [T + 273, 273 - T, T, -(T + 273)].filter((x) => x !== tc);
	return {
		prompt: 'Converti in gradi Celsius.',
		problem: textBlock(`Esprimi in gradi Celsius la temperatura ${pu(String(T), 'K')}.`),
		solution: wu(String(tc), '°C'),
		steps: [`t = T - 273 = ${T} - 273 = ${wu(String(tc), '°C')}`],
		answer: choose(rng, intOpt(tc, '°C'), wrong.map((x) => intOpt(x, '°C'))),
		params: { case: neg ? 'negativa' : 'positiva', dir: 'C', T },
	};
}

// ---------------------------------------------------------------------------
// Level 2: differences of temperature

function level2(rng: Rng): Built {
	const mixed = rng.next() < 0.5;
	const up = rng.next() < 0.5;
	const a = rng.int(-30, 90);
	const b = a + (up ? 1 : -1) * rng.int(5, 80);
	if (b < -50 || b > 150) throw new Error('range');
	const diff = Math.abs(b - a);
	const verb = up ? 'aumenta' : 'diminuisce';
	const how = up ? 'si scalda' : 'si raffredda';
	const fmt = (x: number) => (x < 0 ? `-${-x}` : String(x));
	/** The subtrahend in brackets only when negative. */
	const sub = (x: number) => (x < 0 ? `(${fmt(x)}\\,^\\circ\\text{C})` : `${x}\\,^\\circ\\text{C}`);
	if (!mixed) {
		const wrong = [diff + 273, Math.abs(b) + 273, diff + 546, Math.abs(Math.abs(b) - Math.abs(a))].filter((x) => x > 0 && x !== diff);
		return {
			prompt: 'Trova la variazione di temperatura.',
			problem: textBlock(`Un campione ${how} da ${pu(fmt(a), '°C')} a ${pu(fmt(b), '°C')}. Di quanti kelvin ${verb} la sua temperatura?`),
			solution: wu(String(diff), 'K'),
			steps: [`\\Delta t = ${fmt(b)}\\,^\\circ\\text{C} - ${sub(a)} = ${fmt(b - a)}\\,^\\circ\\text{C}`, t('Un kelvin è ampio quanto un grado Celsius: la differenza ha lo stesso numero nelle due scale.'), `\\Delta T = ${wu(fmt(b - a), 'K')}`],
			answer: choose(rng, intOpt(diff, 'K'), wrong.map((x) => intOpt(x, 'K'))),
			params: { case: 'celsius', from: a, to: b },
		};
	}
	// the start in kelvin, the end in Celsius; the answer in degrees Celsius
	const Ta = a + 273;
	const wrong = [Math.abs(b - Ta), diff + 273, Math.abs(b + 273 + Ta), Math.abs(b) + Ta].filter((x) => x > 0 && x !== diff);
	return {
		prompt: 'Trova la variazione di temperatura.',
		problem: textBlock(`Un campione ${how} da ${pu(String(Ta), 'K')} a ${pu(fmt(b), '°C')}. Di quanti gradi Celsius ${verb} la sua temperatura?`),
		solution: wu(String(diff), '°C'),
		steps: [`${wu(String(Ta), 'K')} = (${Ta} - 273)\\,^\\circ\\text{C} = ${wu(fmt(a), '°C')}`, `\\Delta t = ${fmt(b)}\\,^\\circ\\text{C} - ${sub(a)} = ${wu(fmt(b - a), '°C')}`, t('Prima si portano le due temperature nella stessa scala, poi si sottrae.')],
		answer: choose(rng, intOpt(diff, '°C'), wrong.map((x) => intOpt(x, '°C'))),
		params: { case: 'misto', from: Ta, to: b },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the heat

function level3(rng: Rng): Built {
	const s = rng.pick(SUBST);
	const m = mass3(rng);
	const ti = datum(rng.int(100, 300), 1);
	const tf = ti.add(datum(rng.int(100, 700), 1));
	const dt = tf.sub(ti);
	const Q = s.c.mul(m).mul(dt);
	const { u, k } = heatUnit(Q);
	const ans = must(Q.mul(k), 3);
	const md = decimals(m) ? 1 : 0;
	return {
		prompt: 'Trova il calore.',
		problem: textBlock(`Quanto calore serve per scaldare ${pu(dec(m, md), 'g')} ${s.nome} da ${pu(dec(ti, 1), '°C')} a ${pu(dec(tf, 1), '°C')}? Il calore specifico è ${pu(dec(s.c), CU)}.`),
		solution: `Q \\approx ${wu(ans.tex, u)}`,
		steps: [
			`\\Delta t = ${dec(tf, 1)} - ${dec(ti, 1)} = ${wu(dec(dt, 1), '°C')}`,
			`Q = c \\cdot m \\cdot \\Delta t = ${dec(s.c)} \\cdot ${dec(m, md)} \\cdot ${dec(dt, 1)}\\,\\text{J} = ${dec(Q)}\\,\\text{J} \\approx ${wu(ans.tex, u)}`,
			t('Tre cifre significative, quelle dei dati che ne hanno meno.'),
		],
		// the final temperature for Δt; the initial one; the mass read in kilograms (a thousand times smaller)
		answer: answerOf(rng, ans, u, [s.c.mul(m).mul(tf).mul(k), s.c.mul(m).mul(ti).mul(k), Q.mul(k).div(q(1000))], around(Q.mul(k))),
		params: { case: s.nome, c: s.c.toString(), m: m.toString(), ti: ti.toString(), tf: tf.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the final temperature

/** A temperature to the tenth, as an option. */
const tenthOpt = (x: R): ChoiceOption => {
	const r = q(Math.round((x.num * 10) / x.den), 10);
	return { latex: wu(dec(r, 1), '°C'), values: [r.toString()] };
};

function level4(rng: Rng): Built {
	const heat = rng.next() < 0.5;
	const s = rng.pick(SUBST);
	const m = mass3(rng);
	const ti = datum(rng.int(heat ? 100 : 500, heat ? 400 : 900), 1);
	// Q in kJ with three figures, from a target Δt of 10 to 60 °C
	const Qw = must(s.c.mul(m).mul(datum(rng.int(100, 600), 1)).div(q(1000)), 3);
	const Qk = Qw.v;
	if (Qk.compare(q(1, 10)) < 0 || Qk.compare(q(1000)) >= 0) throw new Error('Q');
	const dt = Qk.mul(q(1000)).div(s.c.mul(m));
	if (dt.compare(q(10)) < 0 || dt.compare(q(999, 10)) > 0) throw new Error('dt');
	const tf = heat ? ti.add(dt) : ti.sub(dt);
	if (tf.compare(q(1)) < 0) throw new Error('cold');
	// Δt has three figures and the tenths: the final temperature to the tenth, away from a tie
	const x10 = tf.mul(q(10));
	const frac = x10.sub(q(Math.floor(x10.num / x10.den)));
	if (frac.sub(q(1, 2)).abs().compare(q(1, 100)) < 0) throw new Error('tie');
	const right = tenthOpt(tf);
	const wrongs = [dt, heat ? ti.sub(dt) : ti.add(dt)].filter((x) => x.sign() > 0).map(tenthOpt);
	const near = [1, -1, 2, -2, 5, -5].map((d) => tenthOpt(tf.add(q(d)))).filter((o) => Number(o.values[0].split('/')[0]) > 0);
	const md = decimals(m) ? 1 : 0;
	return {
		prompt: 'Trova la temperatura finale.',
		problem: textBlock(`Un campione ${s.nome} di ${pu(dec(m, md), 'g')}, a ${pu(dec(ti, 1), '°C')}, ${heat ? 'riceve' : 'cede'} ${pu(Qw.tex, 'kJ')} di calore. A quale temperatura arriva? Il calore specifico è ${pu(dec(s.c), CU)}.`),
		solution: `t_f \\approx ${right.latex}`,
		steps: [
			`\\Delta t = \\dfrac{Q}{c \\cdot m} = \\dfrac{${dec(Qk.mul(q(1000)))}\\,\\text{J}}{${dec(s.c)} \\cdot ${dec(m, md)}\\,\\text{J/}^\\circ\\text{C}} \\approx ${wu(dec(q(Math.round((dt.num * 10) / dt.den), 10), 1), '°C')}`,
			`t_f = ${dec(ti, 1)} ${heat ? '+' : '-'} ${dec(q(Math.round((dt.num * 10) / dt.den), 10), 1)} \\approx ${right.latex}`,
			t(heat ? 'Il campione riceve calore: la temperatura sale.' : 'Il campione cede calore: la temperatura scende.'),
		],
		answer: choose(rng, right, [...wrongs, ...near]),
		params: { case: heat ? 'riceve' : 'cede', c: s.c.toString(), m: m.toString(), ti: ti.toString(), Q: Qk.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the calorimeter

const PROCESSES = [
	{ testo: "si scioglie del nitrato d'ammonio", eso: false },
	{ testo: 'si scioglie del cloruro di potassio', eso: false },
	{ testo: "si scioglie dell'idrossido di sodio", eso: true },
	{ testo: 'si scioglie del cloruro di calcio', eso: true },
	{ testo: 'avviene una reazione', eso: true },
	{ testo: 'avviene una reazione', eso: false },
];

function level5(rng: Rng): Built {
	const p = rng.pick(PROCESSES);
	const m = q(rng.pick([50, 100, 150, 200]));
	const ti = datum(rng.int(180, 250), 1);
	const change = datum(rng.int(20, 150), 1); // 2,0 to 15,0 °C
	const tf = p.eso ? ti.add(change) : ti.sub(change);
	const n = Math.min(sigOf(m, 1), sigOf(change, 1));
	const c = q(4186, 1000);
	const Qw = c.mul(m).mul(change); // J, magnitude
	const { u, k } = heatUnit(Qw);
	const mag = must(Qw.mul(k), n);
	const opt = (eso: boolean, w: Written | null): ChoiceOption | null =>
		w && { latex: `\\text{${eso ? 'esotermica, cede' : 'endotermica, assorbe'} }${wu(w.tex, u)}`, values: [`${eso ? '-' : ''}${w.v.toString()}`] };
	const right = opt(p.eso, mag)!;
	const wrongT = sigSafe(c.mul(m).mul(tf).mul(k), n); // the final temperature for Δt
	const others = [opt(!p.eso, mag), opt(p.eso, wrongT), opt(!p.eso, wrongT), ...around(Qw.mul(k)).map((x) => opt(!p.eso, sigSafe(x, n)))].filter((o): o is ChoiceOption => o !== null);
	const mT = String(m.num);
	return {
		prompt: 'Trova il calore e il tipo di trasformazione.',
		problem: textBlock(`In un calorimetro con ${pu(mT + '{,}0', 'g')} d'acqua a ${pu(dec(ti, 1), '°C')} ${p.testo}, e la temperatura ${p.eso ? 'sale' : 'scende'} a ${pu(dec(tf, 1), '°C')}. Quanto calore scambia la trasformazione, e di che tipo è? Si trascura il calorimetro.`),
		solution: right.latex,
		steps: [
			`Q_{acqua} = c \\cdot m \\cdot \\Delta t = 4{,}186 \\cdot ${mT}{,}0 \\cdot (${dec(tf, 1)} - ${dec(ti, 1)})\\,\\text{J} = ${p.eso ? '' : '-'}${dec(Qw)}\\,\\text{J}`,
			t(p.eso ? "L'acqua si scalda e assorbe calore: la trasformazione glielo ha ceduto, ed è esotermica." : "L'acqua si raffredda e cede calore: la trasformazione lo ha assorbito, ed è endotermica."),
			t(`${n === 2 ? 'Due' : 'Tre'} cifre significative, come la variazione di temperatura.`),
		],
		answer: choose(rng, right, others),
		params: { case: p.eso ? 'esotermica' : 'endotermica', m: m.toString(), ti: ti.toString(), tf: tf.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 6: two masses of water

function level6(rng: Rng): Built {
	const m1 = 10 * rng.int(5, 50), m2 = 10 * rng.int(5, 50); // grams, 50 to 500
	if (m1 === m2) throw new Error('equal');
	const t1 = rng.int(40, 95), t2 = rng.int(5, 30);
	if ((m1 * t1 + m2 * t2) % (m1 + m2)) throw new Error('not whole');
	const te = (m1 * t1 + m2 * t2) / (m1 + m2);
	if (te - t2 < 3 || t1 - te < 3) throw new Error('edge');
	const avg = (t1 + t2) / 2;
	const swapped = (m2 * t1 + m1 * t2) / (m1 + m2);
	const wrong = [avg, swapped].filter((x) => Number.isInteger(x) && x !== te);
	const near = [te + 3, te - 3, te + 6, te - 6].filter((x) => x > t2 && x < t1);
	return {
		prompt: 'Trova la temperatura di equilibrio.',
		problem: textBlock(`In un becher isolato si mescolano ${pu(String(m1), 'g')} d'acqua a ${pu(String(t1), '°C')} e ${pu(String(m2), 'g')} d'acqua a ${pu(String(t2), '°C')}. A quale temperatura arriva l'acqua?`),
		solution: `t_e = ${wu(String(te), '°C')}`,
		steps: [
			t("Il calore ceduto dall'acqua calda è assorbito dalla fredda, e il calore specifico si semplifica:"),
			`t_e = \\dfrac{m_1\\,t_1 + m_2\\,t_2}{m_1 + m_2} = \\dfrac{${m1} \\cdot ${t1} + ${m2} \\cdot ${t2}}{${m1} + ${m2}}\\,^\\circ\\text{C} = ${wu(String(te), '°C')}`,
		],
		answer: choose(rng, intOpt(te, '°C'), [...wrong, ...near].map((x) => intOpt(x, '°C'))),
		params: { case: 'acqua', m1, t1, m2, t2 },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimTemperaturaCalore: Generator = {
	id: ID,
	title: 'Temperatura e calore',
	levels: {
		1: { label: 'Celsius e kelvin', constraints: ['T = t + 273', 'il 40% con temperature Celsius negative'] },
		2: { label: 'Differenze di temperatura', constraints: ['la stessa differenza in kelvin e in gradi Celsius', 'metà con le due scale mescolate'] },
		3: { label: 'Il calore', constraints: ['Q = c m Δt con c in J/(g·°C)', 'tre cifre significative'] },
		4: { label: 'La temperatura finale', constraints: ['il calore ricevuto o ceduto', 'risultato al decimo di grado'] },
		5: { label: 'Il calorimetro', constraints: ['il calore scambiato con l\'acqua', 'esotermica o endotermica'] },
		6: { label: "L'equilibrio termico", constraints: ["due masse d'acqua", 'temperatura di equilibrio intera'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimTemperaturaCalore;
