/**
 * Gli stati di aggregazione. Spec: specs/exercises/chim-stati-aggregazione.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/14-chim-stati-aggregazione.md), each one step harder:
 * the properties of the three states for a named sample; the state of a substance at a temperature in °C, from its
 * melting and boiling points; the same with the temperature in kelvin; which of four substances in a table is solid,
 * liquid or gaseous at a temperature; the volume of ice or of steam from a mass of water and a density. Distractors
 * from the lesson's warnings: one threshold only, negative numbers compared by their digits, kelvin not converted,
 * the density multiplied.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { choose, pq, sample, sig, t, table, textBlock, textOpt } from '../chim-materia';

export const ID = 'chim-stati-aggregazione';

type State = 'solido' | 'liquido' | 'aeriforme';
const STATES: State[] = ['solido', 'liquido', 'aeriforme'];

/** Melting and boiling points at 1 atm, °C, rounded to the degree (the lesson's table and a few more). */
export const SUBSTANCES: { nome: string; tf: number; teb: number }[] = [
	{ nome: 'azoto', tf: -210, teb: -196 },
	{ nome: 'ossigeno', tf: -218, teb: -183 },
	{ nome: 'metano', tf: -182, teb: -162 },
	{ nome: 'etanolo', tf: -114, teb: 78 },
	{ nome: 'acetone', tf: -95, teb: 56 },
	{ nome: 'ammoniaca', tf: -78, teb: -33 },
	{ nome: 'mercurio', tf: -39, teb: 357 },
	{ nome: 'bromo', tf: -7, teb: 59 },
	{ nome: 'acqua', tf: 0, teb: 100 },
	{ nome: 'iodio', tf: 114, teb: 184 },
	{ nome: 'piombo', tf: 327, teb: 1749 },
	{ nome: 'cloruro di sodio', tf: 801, teb: 1465 },
	{ nome: 'rame', tf: 1085, teb: 2562 },
	{ nome: 'ferro', tf: 1538, teb: 2862 },
];
const stateAt = (s: { tf: number; teb: number }, x: number): State => (x < s.tf ? 'solido' : x < s.teb ? 'liquido' : 'aeriforme');
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const art = (nome: string) => (nome === 'iodio' ? 'lo ' : /^[aeiou]/.test(nome) ? "l'" : 'il ');
const deg = (x: number) => `$${x}\\,^\\circ\\text{C}$`;

const STATE_OPTS = () => [...STATES.map((s) => textOpt(cap(s), s)), textOpt('Solido e liquido insieme', 'solido e liquido')];

// ---------------------------------------------------------------------------
// Level 1: the properties of the three states

/** Samples of matter in each state, as the question names them. */
const SAMPLES: Record<State, string[]> = {
	solido: ['un cubetto di ghiaccio', 'una moneta di rame', 'un chiodo di ferro', 'un cristallo di sale', 'un sasso'],
	liquido: ["l'acqua di un bicchiere", "l'olio di una bottiglia", "l'alcol di un flacone", 'il mercurio di un termometro', 'il latte di una tazza'],
	aeriforme: ["l'aria di un pallone", "l'elio di un palloncino", "l'ossigeno di una bombola", "l'aria di una siringa tappata"],
};
/** Each property and the states that have it. */
export const PROPERTIES: { text: string; states: State[] }[] = [
	{ text: 'Ha forma propria', states: ['solido'] },
	{ text: 'Ha volume proprio', states: ['solido', 'liquido'] },
	{ text: 'Prende la forma del recipiente', states: ['liquido', 'aeriforme'] },
	{ text: 'Occupa tutto il recipiente', states: ['aeriforme'] },
	{ text: 'Si comprime facilmente', states: ['aeriforme'] },
	{ text: 'È quasi incomprimibile', states: ['solido', 'liquido'] },
	{ text: 'Ha una superficie libera orizzontale', states: ['liquido'] },
	{ text: 'È rigido', states: ['solido'] },
	{ text: 'Scorre, è un fluido', states: ['liquido', 'aeriforme'] },
];

function level1(rng: Rng): Built {
	const state = rng.pick(STATES);
	const what = rng.pick(SAMPLES[state]);
	const negative = rng.next() < 0.4;
	const has = PROPERTIES.filter((p) => p.states.includes(state));
	const hasNot = PROPERTIES.filter((p) => !p.states.includes(state));
	const [right, pool] = negative ? [rng.pick(hasNot), has] : [rng.pick(has), hasNot];
	const others = sample(rng, pool, 3);
	return {
		prompt: negative ? 'Trova la proprietà che manca.' : 'Trova la proprietà giusta.',
		problem: textBlock(`${cap(what)} è ${state === 'aeriforme' ? 'un aeriforme' : `un ${state}`}. Quale di queste proprietà ${negative ? 'NON ha' : 'ha'}?`),
		solution: t(right.text),
		steps: [
			textBlock(
				state === 'solido'
					? 'Un solido ha forma propria e volume proprio, è rigido e quasi incomprimibile.'
					: state === 'liquido'
						? 'Un liquido ha volume proprio ma prende la forma del recipiente, ha una superficie libera orizzontale, scorre ed è quasi incomprimibile.'
						: 'Un aeriforme non ha né forma né volume propri: occupa tutto il recipiente, scorre e si comprime facilmente.',
			),
		],
		answer: choose(rng, textOpt(right.text), others.map((p) => textOpt(p.text))),
		params: { case: state, sample: what, negative },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: the state at a temperature, in °C or in kelvin

/** A temperature (°C) at least 5 degrees inside the range of the state, and not below -268 °C. */
function tempIn(rng: Rng, s: { tf: number; teb: number }, state: State): number | null {
	const lo = state === 'solido' ? Math.max(-268, s.tf - 80) : state === 'liquido' ? s.tf + 5 : s.teb + 5;
	const hi = state === 'solido' ? s.tf - 5 : state === 'liquido' ? s.teb - 5 : s.teb + 120;
	if (hi < lo) return null;
	return rng.int(lo, hi);
}

function stateSteps(s: { nome: string; tf: number; teb: number }, x: number, state: State): string[] {
	const rel = state === 'solido' ? `più bassa della temperatura di fusione, ${deg(s.tf)}` : state === 'liquido' ? `tra la temperatura di fusione, ${deg(s.tf)}, e quella di ebollizione, ${deg(s.teb)}` : `più alta della temperatura di ebollizione, ${deg(s.teb)}`;
	return [textBlock(`La temperatura ${deg(x)} è ${rel}: ${art(s.nome)}${s.nome} è allo stato ${state}.`)];
}

function level2(rng: Rng): Built {
	const state = rng.pick(STATES);
	const s = rng.pick(SUBSTANCES.filter((x) => x.teb - x.tf >= 10));
	const x = tempIn(rng, s, state);
	if (x === null) throw new Error('retry');
	return {
		prompt: 'Trova lo stato di aggregazione.',
		problem: textBlock(`Alla pressione atmosferica ${art(s.nome)}${s.nome} fonde a ${deg(s.tf)} e bolle a ${deg(s.teb)}. In che stato si trova a ${deg(x)}?`),
		solution: t(cap(state)),
		steps: stateSteps(s, x, state),
		answer: choose(rng, textOpt(cap(state), state), STATE_OPTS()),
		params: { case: state, nome: s.nome, tf: s.tf, teb: s.teb, t: x },
	};
}

function level3(rng: Rng): Built {
	const state = rng.pick(STATES);
	const s = rng.pick(SUBSTANCES.filter((x) => x.teb - x.tf >= 10 && x.tf < 1000));
	const x = tempIn(rng, s, state);
	if (x === null) throw new Error('retry');
	const T = x + 273;
	// The mistake of the lesson: the kelvin compared with the °C of the table.
	const misread = stateAt(s, T);
	return {
		prompt: 'Trova lo stato di aggregazione.',
		problem: textBlock(`Alla pressione atmosferica ${art(s.nome)}${s.nome} fonde a ${deg(s.tf)} e bolle a ${deg(s.teb)}. In che stato si trova alla temperatura di $${T}\\,\\text{K}$?`),
		solution: t(cap(state)),
		steps: [`T = ${T}\\,\\text{K} \\quad\\Rightarrow\\quad t = T - 273 = ${T} - 273 = ${x}\\,^\\circ\\text{C}`, ...stateSteps(s, x, state)],
		answer: choose(rng, textOpt(cap(state), state), [textOpt(cap(misread), misread), ...STATE_OPTS()]),
		params: { case: misread === state ? 'stesso' : 'trappola', state, nome: s.nome, tf: s.tf, teb: s.teb, T },
	};
}

// ---------------------------------------------------------------------------
// Level 4: which of four substances

function level4(rng: Rng): Built {
	const state = rng.pick(STATES);
	const x = rng.int(-40, 60) * 5; // -200 to 300 °C
	const clear = SUBSTANCES.filter((s) => Math.abs(x - s.tf) >= 3 && Math.abs(x - s.teb) >= 3);
	const yes = clear.filter((s) => stateAt(s, x) === state);
	const no = clear.filter((s) => stateAt(s, x) !== state);
	if (!yes.length || no.length < 3) throw new Error('retry');
	const right = rng.pick(yes);
	const others = sample(rng, no, 3);
	const four = sample(rng, [right, ...others], 4);
	const rows = four.map((s) => [t(s.nome), String(s.tf), String(s.teb)]);
	return {
		prompt: 'Trova la sostanza.',
		problem: textBlock(`La tabella dà le temperature di fusione e di ebollizione di quattro sostanze alla pressione atmosferica. Quale è allo stato ${state} a ${deg(x)}?`, 46, [
			table('lrr', [t('sostanza'), `t_f\\ (^\\circ\\text{C})`, `t_{eb}\\ (^\\circ\\text{C})`], rows),
		]),
		solution: t(cap(right.nome)),
		steps: four.map((s) => textBlock(`${cap(s.nome)}: a ${deg(x)} è allo stato ${stateAt(s, x)}.`)),
		answer: choose(
			rng,
			textOpt(cap(right.nome), right.nome),
			others.map((s) => textOpt(cap(s.nome), s.nome)),
		),
		params: { case: state, t: x, sostanze: four.map((s) => ({ nome: s.nome, tf: s.tf, teb: s.teb })) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the volume in another state

/** x cut (not rounded) to d decimals, for a value followed by dots: 13,166… */
const cut = (x: number, d: number) => (Math.floor(x * 10 ** d + 1e-9) / 10 ** d).toFixed(d).replace('.', '{,}');
const D_ICE = 0.917; // g/mL
const D_STEAM = 0.6; // g/L at 100 °C and 1 atm

function level5(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const m = rng.int(120, 900);
		const exact = m / D_ICE;
		const ans = sig(exact, 3);
		if (!ans) throw new Error('retry');
		return {
			prompt: 'Trova il volume del ghiaccio.',
			problem: textBlock(`Una bottiglia contiene ${pq(String(m), 'g')} d'acqua. La densità del ghiaccio è ${pq('0.917', 'gmL')}. Che volume occupa l'acqua quando è tutta ghiacciata?`),
			solution: `${ans.tex}\\,\\text{mL}`,
			steps: [t('La massa non cambia con lo stato:'), `V = \\dfrac{m}{d} = \\dfrac{${m}\\,\\text{g}}{0{,}917\\,\\text{g/mL}} = ${cut(exact, 2)}\\ldots\\,\\text{mL} \\approx ${ans.tex}\\,\\text{mL}`],
			// the density multiplied; the volume unchanged (as liquid water); only the increase
			answer: choose(rng, withUnit(ans, 'mL'), [...unitOpts([m * D_ICE, m, exact - m], 3, 'mL'), ...unitOpts([exact * 1.1, exact * 0.9], 3, 'mL')]),
			params: { case: 'ghiaccio', m },
		};
	}
	const k = rng.int(11, 99);
	if (k % 10 === 0) throw new Error('retry');
	const m = k / 10; // 1.1 to 9.9 g
	const exact = m / D_STEAM;
	const ans = sig(exact, 2);
	if (!ans) throw new Error('retry');
	const mS = m.toFixed(1);
	return {
		prompt: 'Trova il volume del vapore.',
		problem: textBlock(`Si fanno bollire ${pq(mS, 'g')} d'acqua. A ${deg(100)} e alla pressione atmosferica la densità del vapore acqueo è ${pq('0.60', 'gL')}. Che volume occupa il vapore?`),
		solution: `${ans.tex}\\,\\text{L}`,
		steps: [t('La massa non cambia con lo stato:'), `V = \\dfrac{m}{d} = \\dfrac{${mS.replace('.', '{,}')}\\,\\text{g}}{0{,}60\\,\\text{g/L}} = ${cut(exact, 3)}\\ldots\\,\\text{L} \\approx ${ans.tex}\\,\\text{L}`],
		// the same number in mL (g/L read as g/mL); the density multiplied; the volume of the liquid water, m in mL
		answer: choose(rng, withUnit(ans, 'L'), [withUnit(ans, 'mL'), ...unitOpts([m * D_STEAM], 2, 'L'), ...unitOpts([m], 2, 'mL'), ...unitOpts([exact * 10, exact / 10], 2, 'L')]),
		params: { case: 'vapore', m: mS },
	};
}

/** An option of a rounded quantity whose value carries the unit ("2.7 L"), so the same number in mL is another option. */
function withUnit(r: { tex: string; value: string }, u: 'mL' | 'L') {
	return { latex: `${r.tex}\\,\\text{${u}}`, values: [`${r.value} ${u}`] };
}
function unitOpts(xs: number[], n: number, u: 'mL' | 'L') {
	return xs.map((x) => sig(x, n)).filter((r): r is { tex: string; value: string } => r !== null).map((r) => withUnit(r, u));
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	// checkCommon, less its test on numeric values: the options here are words, or quantities with the unit in the value.
	return checkCommon(sample).filter((x) => x !== 'due opzioni con lo stesso numero').concat(new Set(sample.answer.kind === 'choice' ? sample.answer.options.map((o) => o.values.join('|')) : []).size === 4 ? [] : ['due opzioni con lo stesso valore']);
}

export const chimStatiAggregazione: Generator = {
	id: ID,
	title: 'Gli stati di aggregazione',
	levels: {
		1: { label: 'Le proprietà dei tre stati', constraints: ['un campione di materia, la proprietà che ha o che non ha'] },
		2: { label: 'Lo stato a una temperatura', constraints: ['temperatura di fusione e di ebollizione date', 'almeno 5 gradi da tutte e due'] },
		3: { label: 'La temperatura in kelvin', constraints: ['la temperatura in kelvin, le altre in gradi Celsius'] },
		4: { label: 'Quale sostanza', constraints: ['quattro sostanze in tabella, una sola nello stato chiesto'] },
		5: { label: 'Il volume cambia con lo stato', constraints: ['ghiaccio o vapore da una massa d’acqua e una densità'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimStatiAggregazione;
