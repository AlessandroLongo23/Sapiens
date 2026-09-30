/**
 * Soluzioni acide e basiche: una prima idea del pH. Spec: specs/exercises/chim-acqua-acidi-basi.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/47-chim-acqua-acidi-basi.md), each one step harder: what a
 * test says about a solution (litmus, zinc, marble, indicators, conductivity: acid, basic, neutral, or it cannot
 * tell); what a substance gives in water, with Arrhenius's reason; the most acid or basic solution among four pH
 * values, or the only acid, basic or neutral one; how many times more H⁺ ions between two pH values an integer apart;
 * the pH of a strong acid or base diluted ten or a hundred times; the colour of an indicator at a pH. Distractors from
 * the lesson's warnings: colourless phenolphthalein read as neutral, the ethanol's OH read as a base, the pH scale
 * read backwards, the difference of pH for the factor, dilution crossing 7.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkCommon, choose, generateWith, say, shuffle, t, textBlock, textOpt } from '../chim-acqua';

export const ID = 'chim-acqua-acidi-basi';

const phTex = (x: number, d = 1) => x.toFixed(d).replace('.', '{,}');
const phOpt = (x: number, d = 1) => textOpt(`pH $${phTex(x, d)}$`, x.toFixed(d));

// ---------------------------------------------------------------------------
// Level 1: what a test says

export const VERDICTS = { acida: 'è acida', basica: 'è basica', neutra: 'è neutra', boh: 'non si può dire con questa sola prova' } as const;
export type Verdict = keyof typeof VERDICTS;
export const TESTS: { s: string; v: Verdict; why: string }[] = [
	{ s: 'fa diventare rossa una cartina al tornasole blu', v: 'acida', why: 'Il tornasole diventa rosso negli acidi.' },
	{ s: 'fa diventare blu una cartina al tornasole rossa', v: 'basica', why: 'Il tornasole diventa blu nelle basi.' },
	{ s: 'a contatto con un pezzetto di zinco sviluppa bollicine di idrogeno', v: 'acida', why: 'Gli acidi reagiscono con molti metalli e sviluppano idrogeno.' },
	{ s: "versata su un pezzo di marmo fa effervescenza e sviluppa anidride carbonica", v: 'acida', why: 'Gli acidi reagiscono con il carbonato di calcio e sviluppano anidride carbonica.' },
	{ s: 'con qualche goccia di fenolftaleina diventa rosa acceso', v: 'basica', why: 'La fenolftaleina diventa rosa solo nelle soluzioni basiche.' },
	{ s: 'con qualche goccia di fenolftaleina resta incolore', v: 'boh', why: 'La fenolftaleina resta incolore fino a pH $8$ circa: la soluzione può essere acida, neutra o appena basica.' },
	{ s: "con l'indicatore universale diventa verde", v: 'neutra', why: "L'indicatore universale è verde a pH $7$." },
	{ s: "con l'indicatore universale diventa viola", v: 'basica', why: "L'indicatore universale è viola da pH $11$ a $14$." },
	{ s: "con l'indicatore universale diventa rossa", v: 'acida', why: "L'indicatore universale è rosso da pH $0$ a $2$." },
	{ s: 'conduce la corrente elettrica', v: 'boh', why: 'Conducono la corrente le soluzioni di acidi, di basi e di sali: la prova non distingue.' },
];

function level1(rng: Rng): Built {
	const k = rng.int(0, TESTS.length - 1);
	const x = TESTS[k];
	const keys = Object.keys(VERDICTS) as Verdict[];
	return {
		prompt: 'Scegli che cosa dice la prova.',
		problem: textBlock(`Una soluzione sconosciuta ${x.s}. Che cosa si può dire della soluzione?`),
		solution: t(VERDICTS[x.v]),
		steps: [say(x.why)],
		answer: choose(rng, textOpt(VERDICTS[x.v], x.v), shuffle(rng, keys.filter((v) => v !== x.v)).map((v) => textOpt(VERDICTS[v], v))),
		params: { case: x.v, test: k },
	};
}

// ---------------------------------------------------------------------------
// Level 2: Arrhenius

export const REASONS = {
	acido: 'acida: libera ioni $\\mathrm{H^+}$',
	base: 'basica: libera ioni $\\mathrm{OH^-}$',
	neutro: 'neutra: non libera né $\\mathrm{H^+}$ né $\\mathrm{OH^-}$',
	sbagliata: 'basica: libera ioni $\\mathrm{H^+}$',
} as const;
type Reason = keyof typeof REASONS;
export const WHAT: { nome: string; f: string; r: Exclude<Reason, 'sbagliata'>; why: string }[] = [
	{ nome: "l'acido cloridrico", f: 'HCl', r: 'acido', why: '$\\mathrm{HCl} \\longrightarrow \\mathrm{H^+} + \\mathrm{Cl^-}$: libera ioni idrogeno.' },
	{ nome: "l'acido nitrico", f: 'HNO_3', r: 'acido', why: '$\\mathrm{HNO_3} \\longrightarrow \\mathrm{H^+} + \\mathrm{NO_3^-}$: libera ioni idrogeno.' },
	{ nome: "l'acido solforico", f: 'H_2SO_4', r: 'acido', why: "In acqua l'acido solforico libera ioni idrogeno e ioni solfato." },
	{ nome: "l'acido acetico", f: 'CH_3COOH', r: 'acido', why: "In acqua l'acido acetico libera ioni idrogeno: è l'acido dell'aceto." },
	{ nome: "l'idrossido di sodio", f: 'NaOH', r: 'base', why: '$\\mathrm{NaOH} \\longrightarrow \\mathrm{Na^+} + \\mathrm{OH^-}$: libera ioni idrossido.' },
	{ nome: "l'idrossido di potassio", f: 'KOH', r: 'base', why: '$\\mathrm{KOH} \\longrightarrow \\mathrm{K^+} + \\mathrm{OH^-}$: libera ioni idrossido.' },
	{ nome: "l'idrossido di calcio", f: 'Ca(OH)_2', r: 'base', why: "In acqua l'idrossido di calcio libera ioni calcio e ioni idrossido." },
	{ nome: "l'ammoniaca", f: 'NH_3', r: 'base', why: "L'ammoniaca reagisce con l'acqua e produce ioni idrossido: $\\mathrm{NH_3} + \\mathrm{H_2O} \\longrightarrow \\mathrm{NH_4^+} + \\mathrm{OH^-}$." },
	{ nome: 'il cloruro di sodio', f: 'NaCl', r: 'neutro', why: 'Il sale libera ioni sodio e cloruro, né $\\mathrm{H^+}$ né $\\mathrm{OH^-}$.' },
	{ nome: 'il nitrato di potassio', f: 'KNO_3', r: 'neutro', why: 'Il sale libera ioni potassio e nitrato, né $\\mathrm{H^+}$ né $\\mathrm{OH^-}$.' },
	{ nome: 'il glucosio', f: 'C_6H_{12}O_6', r: 'neutro', why: 'Il glucosio si scioglie in molecole intere: non libera ioni.' },
	{ nome: "l'etanolo", f: 'C_2H_5OH', r: 'neutro', why: "L'etanolo ha un gruppo O-H, ma si scioglie in molecole intere e non libera ioni $\\mathrm{OH^-}$." },
];

function level2(rng: Rng): Built {
	const want = rng.pick(['acido', 'base', 'neutro'] as const);
	const pool = WHAT.filter((w) => w.r === want);
	const k = rng.int(0, pool.length - 1);
	const w = pool[k];
	const keys = Object.keys(REASONS) as Reason[];
	return {
		prompt: 'Scegli com\'è la soluzione, e perché.',
		problem: textBlock(`Si scioglie in acqua ${w.nome}, $\\mathrm{${w.f}}$. Com'è la soluzione, secondo Arrhenius?`),
		solution: t(REASONS[w.r]),
		steps: [say(w.why)],
		answer: choose(rng, textOpt(REASONS[w.r], w.r), shuffle(rng, keys.filter((x) => x !== w.r)).map((x) => textOpt(REASONS[x], x))),
		params: { case: want, sostanza: w.nome },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the pH scale

const ASKS = {
	'piu-acida': 'Quale di queste soluzioni è la più acida?',
	'piu-basica': 'Quale di queste soluzioni è la più basica?',
	'unica-acida': 'Una sola di queste soluzioni è acida. Quale?',
	'unica-basica': 'Una sola di queste soluzioni è basica. Quale?',
} as const;
type Ask = keyof typeof ASKS;

function level3(rng: Rng): Built {
	const ask = rng.pick(Object.keys(ASKS) as Ask[]);
	for (;;) {
		const draw = (lo: number, hi: number) => rng.int(lo * 10, hi * 10) / 10;
		let xs: number[];
		if (ask === 'unica-acida') xs = [draw(0.5, 6.5), draw(7.5, 13.5), draw(7.5, 13.5), rng.next() < 0.3 ? 7 : draw(7.5, 13.5)];
		else if (ask === 'unica-basica') xs = [draw(7.5, 13.5), draw(0.5, 6.5), draw(0.5, 6.5), rng.next() < 0.3 ? 7 : draw(0.5, 6.5)];
		else xs = [0, 1, 2, 3].map(() => draw(0.5, 13.5));
		if (new Set(xs.map((x) => x.toFixed(1))).size !== 4) continue;
		const sorted = [...xs].sort((a, b) => a - b);
		if (ask === 'piu-acida' || ask === 'piu-basica') {
			if (sorted[1] - sorted[0] < 0.3 || sorted[3] - sorted[2] < 0.3) continue;
			if ((ask === 'piu-acida' && sorted[0] >= 7) || (ask === 'piu-basica' && sorted[3] <= 7)) continue;
		}
		const right = ask === 'piu-acida' ? sorted[0] : ask === 'piu-basica' ? sorted[3] : xs[0];
		const others = xs.filter((x) => x !== right);
		const why =
			ask === 'piu-acida'
				? `Più il pH è piccolo, più la soluzione è acida: il pH più piccolo è $${phTex(right)}$.`
				: ask === 'piu-basica'
					? `Più il pH è grande, più la soluzione è basica: il pH più grande è $${phTex(right)}$.`
					: ask === 'unica-acida'
						? `Una soluzione è acida se il pH è minore di $7$: solo $${phTex(right)}$ lo è.`
						: `Una soluzione è basica se il pH è maggiore di $7$: solo $${phTex(right)}$ lo è.`;
		return {
			prompt: 'Scegli la soluzione.',
			problem: textBlock(`${ASKS[ask]} Tutte sono a $25\\,^\\circ\\text{C}$.`),
			solution: `\\text{pH } ${phTex(right)}`,
			steps: [say(why)],
			answer: choose(rng, phOpt(right), others.map((x) => phOpt(x))),
			params: { case: ask, ph: xs.map((x) => x.toFixed(1)) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: how many times

const times = (n: number) => (n >= 10000 ? String(n).replace(/(\d)(?=(\d{3})+$)/g, '$1\\,') : String(n).replace('.', '{,}'));
const timesOpt = (n: number) => textOpt(`$${times(n)}$ volte`, String(n));

function level4(rng: Rng): Built {
	const acid = rng.next() < 0.5;
	for (;;) {
		const delta = rng.int(1, 4);
		const half = rng.next() < 0.5;
		const p1 = rng.int(acid ? 1 : 7, acid ? 6 - delta : 13 - delta) + (half ? 0.5 : 0);
		const p2 = p1 + delta;
		if (p1 < 0.5 || p2 > 13.5 || (acid && p2 > 6.5) || (!acid && p1 < 7.5)) continue;
		const d = half ? 1 : 0;
		const right = 10 ** delta;
		const ratio = Math.round((p2 / p1) * 10) / 10;
		const mistakes = [delta, 10 * delta, 10 ** (delta + 1), ratio, 2 ** delta].filter((x) => x !== 1);
		const askMore = acid; // in the acid pair: how many times more H⁺ in the lower pH; in the basic pair: how many times fewer in the higher
		return {
			prompt: 'Trova il fattore.',
			problem: textBlock(
				askMore
					? `Quante volte più ioni $\\mathrm{H^+}$ ci sono in una soluzione a pH $${phTex(p1, d)}$ che in una a pH $${phTex(p2, d)}$?`
					: `Quante volte meno ioni $\\mathrm{H^+}$ ci sono in una soluzione a pH $${phTex(p2, d)}$ che in una a pH $${phTex(p1, d)}$?`,
			),
			solution: `${times(right)} \\text{ volte}`,
			steps: delta === 1 ? [say('La differenza di pH è di una unità, e ogni unità vale un fattore $10$.')] : [say(`La differenza di pH è di $${delta}$ unità, e ogni unità vale un fattore $10$.`), `${Array(delta).fill('10').join(' \\cdot ')} = ${times(right)}`],
			answer: choose(rng, timesOpt(right), mistakes.map(timesOpt)),
			params: { case: askMore ? 'più' : 'meno', p1: phTex(p1, d), p2: phTex(p2, d) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: dilution

const VOLUMES: { v1: string; v2: string; k: number; words: string }[] = [
	{ v1: '10\\,\\text{mL}', v2: '100\\,\\text{mL}', k: 1, words: 'dieci' },
	{ v1: '25\\,\\text{mL}', v2: '250\\,\\text{mL}', k: 1, words: 'dieci' },
	{ v1: '50\\,\\text{mL}', v2: '500\\,\\text{mL}', k: 1, words: 'dieci' },
	{ v1: '100\\,\\text{mL}', v2: '1{,}0\\,\\text{L}', k: 1, words: 'dieci' },
	{ v1: '10\\,\\text{mL}', v2: '1{,}0\\,\\text{L}', k: 2, words: 'cento' },
	{ v1: '5\\,\\text{mL}', v2: '500\\,\\text{mL}', k: 2, words: 'cento' },
	{ v1: '20\\,\\text{mL}', v2: '2{,}0\\,\\text{L}', k: 2, words: 'cento' },
];

function level5(rng: Rng): Built {
	const base = rng.next() < 0.5;
	for (;;) {
		const V = rng.pick(VOLUMES);
		const p = base ? rng.int(10, 13) : rng.int(1, 4);
		const right = base ? p - V.k : p + V.k;
		if ((!base && right > 6) || (base && right < 8)) continue;
		const what = base ? "di idrossido di sodio, una base forte" : "di acido cloridrico, un acido forte";
		const cands = [base ? p + V.k : p - V.k, p, 7, base ? p - 2 * V.k : p + 2 * V.k, base ? p + 1 : p - 1].filter((x) => x >= 0 && x <= 14 && x !== right);
		return {
			prompt: 'Trova il pH dopo la diluizione.',
			problem: textBlock(`Si prendono $${V.v1}$ di una soluzione ${what}, a pH $${p}$, e si aggiunge acqua fino a $${V.v2}$. Quanto vale il pH della nuova soluzione?`),
			solution: `\\text{pH } ${right}`,
			steps: [
				say(`Il volume diventa ${V.words} volte più grande: la soluzione è diluita ${V.words} volte, cioè di ${V.k === 1 ? 'un fattore $10$' : 'un fattore $10 \\cdot 10$'}.`),
				say(base ? `Per una base forte il pH scende di un'unità per ogni fattore $10$: da $${p}$ a $${right}$, sempre sopra $7$.` : `Per un acido forte il pH sale di un'unità per ogni fattore $10$: da $${p}$ a $${right}$, sempre sotto $7$.`),
			],
			answer: choose(rng, phOpt(right, 0), cands.map((x) => phOpt(x, 0))),
			params: { case: base ? 'base' : 'acido', p, k: V.k },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: indicators

export const UNIVERSAL = ['rosso', 'rosso', 'rosso', 'arancione', 'arancione', 'giallo', 'giallo', 'verde', 'blu', 'blu', 'blu', 'viola', 'viola', 'viola', 'viola'];

function level6(rng: Rng): Built {
	const ind = rng.pick(['tornasole', 'fenolftaleina', 'universale'] as const);
	let ph: number, right: string, palette: string[], why: string, d = 1;
	if (ind === 'tornasole') {
		const acid = rng.next() < 0.5;
		ph = acid ? rng.int(5, 35) / 10 : rng.int(95, 135) / 10;
		right = acid ? 'rosso' : 'blu';
		palette = ['rosso', 'blu', 'verde', 'incolore', 'giallo'];
		why = acid ? 'Il tornasole è rosso sotto pH $4{,}5$ circa.' : 'Il tornasole è blu sopra pH $8{,}3$ circa.';
	} else if (ind === 'fenolftaleina') {
		const low = rng.next() < 0.5;
		ph = low ? rng.int(5, 75) / 10 : rng.int(105, 135) / 10;
		right = low ? 'incolore' : 'rosa acceso';
		palette = ['incolore', 'rosa acceso', 'rosso', 'blu', 'verde'];
		why = low ? 'La fenolftaleina resta incolore fino a pH $8{,}2$ circa, anche nelle soluzioni acide.' : 'La fenolftaleina è rosa acceso sopra pH $10$ circa.';
	} else {
		ph = rng.int(0, 14);
		d = 0;
		right = UNIVERSAL[ph];
		const near = [UNIVERSAL[Math.max(0, ph - 2)], UNIVERSAL[Math.min(14, ph + 2)], UNIVERSAL[14 - ph], UNIVERSAL[Math.max(0, ph - 4)], UNIVERSAL[Math.min(14, ph + 4)]];
		palette = [...near, 'incolore', 'verde', 'giallo'];
		why = "Per l'indicatore universale più comune: rosso da $0$ a $2$, arancione a $3$ e $4$, giallo a $5$ e $6$, verde a $7$, blu da $8$ a $10$, viola da $11$ a $14$.";
	}
	const name = ind === 'tornasole' ? 'tornasole' : ind === 'fenolftaleina' ? 'fenolftaleina' : 'indicatore universale';
	return {
		prompt: "Scegli il colore dell'indicatore.",
		problem: textBlock(`Si aggiunge qualche goccia di ${name} a una soluzione a pH $${phTex(ph, d)}$. Di che colore è la soluzione?`),
		solution: t(right),
		steps: [say(why)],
		answer: choose(rng, textOpt(right), shuffle(rng, palette.filter((c) => c !== right)).map((c) => textOpt(c))),
		params: { case: ind, ph: ph.toFixed(d) },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimAcquaAcidiBasi: Generator = {
	id: ID,
	title: 'Soluzioni acide e basiche: una prima idea del pH',
	levels: {
		1: { label: 'Che cosa dice la prova', constraints: ['tornasole, metalli, marmo, indicatori, conducibilità'] },
		2: { label: 'Acidi e basi secondo Arrhenius', constraints: ['acido, base o sostanza neutra, con il perché'] },
		3: { label: 'La scala del pH', constraints: ['la più acida, la più basica, la sola acida o basica'] },
		4: { label: 'Dieci volte per unità', constraints: ['differenza di pH intera, da 1 a 4'] },
		5: { label: 'La diluizione', constraints: ['acido o base forte diluiti 10 o 100 volte, senza passare il 7'] },
		6: { label: 'Gli indicatori', constraints: ['tornasole, fenolftaleina, indicatore universale'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimAcquaAcidiBasi;
