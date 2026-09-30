/**
 * Curve di riscaldamento e di raffreddamento. Spec: specs/exercises/chim-curve-riscaldamento.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/20-chim-curve-riscaldamento.md). Levels 1-5 read a
 * temperature-time curve drawn with the `curva-temperatura-tempo` scene: the melting or boiling point on a heating
 * curve; what is in the container at a given minute; pure substance or mixture; which substance of a table; the
 * freezing point or the end of freezing on a cooling curve with supercooling. Level 6 computes how long a plateau
 * lasts, from the mass or from the latent heats.
 */
import type { ChoiceOption, Rng, SceneRef } from '../types';
import { type Built, cap, choose, dec, deg, degOpt, makeGenerator, opt, shuffle, textBlock } from '../chim-materia2';

export const ID = 'chim-curve-riscaldamento';

type Pt = [number, number];
const scene = (punti: Pt[], alt: string, passoTemp: number, passoTempo = 2, temperature: number[] = []): SceneRef => ({
	type: 'curva-temperatura-tempo',
	data: { punti, passoTempo, passoTemp, ...(temperature.length ? { temperature } : {}) },
	alt,
});
const said = (T: number) => (T < 0 ? `meno ${-T}` : String(T));

/** A heating curve of a pure substance through both plateaus, times in whole minutes, temperatures multiples of 20. */
function heating(rng: Rng): { pts: Pt[]; tf: number; te: number; T0: number; T5: number } {
	const tf = rng.int(-2, 6) * 20;
	const te = tf + rng.int(3, 6) * 20;
	const T0 = tf - rng.int(1, 2) * 20;
	const T5 = te + rng.int(1, 2) * 20;
	const a = rng.int(2, 4), b = a + rng.int(2, 5), c = b + rng.int(3, 6), d = c + rng.int(4, 8), e = d + rng.int(2, 3);
	return { pts: [[0, T0], [a, tf], [b, tf], [c, te], [d, te], [e, T5]], tf, te, T0, T5 };
}
const heatingAlt = (h: ReturnType<typeof heating>) => {
	const [, [a], [b], [c], [d], [e]] = h.pts;
	return `Curva di riscaldamento: la temperatura sale da ${said(h.T0)} a ${said(h.tf)} gradi in ${a} minuti, resta ferma fino al minuto ${b}, sale fino a ${said(h.te)} gradi al minuto ${c}, resta ferma fino al minuto ${d} e sale fino a ${said(h.T5)} gradi al minuto ${e}.`;
};

// ---------------------------------------------------------------------------
// Level 1: the plateaus

function level1(rng: Rng): Built {
	const h = heating(rng);
	const which = rng.pick(['fusione', 'ebollizione'] as const);
	const right = which === 'fusione' ? h.tf : h.te;
	return {
		prompt: 'Leggi la curva di riscaldamento.',
		problem: textBlock(`Il grafico è la curva di riscaldamento di una sostanza pura, scaldata da solida fino a quando è tutta vapore. Qual è la sua temperatura di ${which}?`),
		solution: `${right}\\,^\\circ\\text{C}`,
		steps: [textBlock(`La curva ha due soste termiche: la prima, a ${deg(h.tf)}, è la fusione; la seconda, a ${deg(h.te)}, è l'ebollizione.`)],
		choice: choose(rng, degOpt(right), [which === 'fusione' ? h.te : h.tf, h.T0, h.T5].map(degOpt)),
		params: { case: which },
		scene: scene(h.pts, heatingAlt(h), 20),
	};
}

// ---------------------------------------------------------------------------
// Level 2: what is in the container

export const CONTENTS = ['Solo solido', 'Solido e liquido', 'Solo liquido', 'Liquido e vapore', 'Solo vapore'] as const;

function level2(rng: Rng): Built {
	for (;;) {
		const h = heating(rng);
		const k = rng.int(0, 4); // the stretch
		const t0 = h.pts[k][0], t1 = h.pts[k + 1][0];
		if (t1 - t0 < 2) continue;
		const m = rng.int(t0 + 1, t1 - 1);
		const right = CONTENTS[k];
		const near = [CONTENTS[k - 1], CONTENTS[k + 1]].filter(Boolean) as string[];
		const others = [...near, ...shuffle(rng, CONTENTS.filter((c) => c !== right && !near.includes(c)))];
		const what = ['il solido si scalda', 'il solido fonde', 'il liquido si scalda', 'il liquido bolle', 'il vapore si scalda'][k];
		return {
			prompt: 'Leggi la curva di riscaldamento.',
			problem: textBlock(`Il grafico è la curva di riscaldamento di una sostanza pura. Che cosa c'è nel recipiente al minuto ${m}?`),
			solution: opt(right).latex,
			steps: [textBlock(`Il minuto ${m} è nel tratto tra il minuto ${t0} e il minuto ${t1}, ${k % 2 ? `una sosta a ${deg(h.pts[k][1])}` : 'un tratto in salita'}: ${what}.`)],
			choice: choose(rng, opt(right), others.map((x) => opt(x))),
			params: { case: `tratto${k}`, minute: m },
			scene: scene(h.pts, heatingAlt(h), 20),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: pure substance or mixture

export const VERDICT = {
	fusione: ['È una sostanza pura: fonde a temperatura costante', 'È un miscuglio: fonde in un intervallo di temperature', 'È una sostanza pura: fonde in un intervallo di temperature', 'È un miscuglio: fonde a temperatura costante'],
	ebollizione: ['È una sostanza pura: bolle a temperatura costante', 'È un miscuglio: bolle in un intervallo di temperature', 'È una sostanza pura: bolle in un intervallo di temperature', 'È un miscuglio: bolle a temperatura costante'],
} as const;

function level3(rng: Rng): Built {
	const which = rng.pick(['fusione', 'ebollizione'] as const);
	const pure = rng.int(0, 1) === 1;
	let pts: Pt[] = [];
	let T0 = 0, T1 = 0, T3 = 0, rise = 0, a = 0, b = 0, c = 0;
	// A mixture's interval rises at most half as fast as the stretches before and after it, so it reads as slow.
	for (;;) {
		T1 = rng.int(3, 12) * 10; // start of the change
		rise = pure ? 0 : rng.int(1, 2) * 10;
		T0 = T1 - rng.int(3, 4) * 10;
		T3 = T1 + rise + rng.int(3, 4) * 10;
		a = rng.int(2, 5);
		b = a + rng.int(4, 8);
		c = b + rng.int(2, 5);
		pts = [[0, T0], [a, T1], [b, T1 + rise], [c, T3]];
		const slope = (i: number) => (pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0]);
		if (2 * slope(1) <= Math.min(slope(0), slope(2))) break;
	}
	const V = VERDICT[which];
	const right = pure ? V[0] : V[1];
	const state = which === 'fusione' ? 'un solido che viene scaldato finché fonde e il liquido si scalda' : 'un liquido che viene scaldato finché bolle';
	return {
		prompt: 'Leggi la curva di riscaldamento.',
		problem: textBlock(`Il grafico mostra la temperatura di ${state}. Che cosa si può dire del materiale?`),
		solution: opt(right).latex,
		steps: [textBlock(pure ? `Tra il minuto ${a} e il minuto ${b} la temperatura resta ferma a ${deg(T1)}: c'è una sosta termica, quindi è una sostanza pura.` : `Tra il minuto ${a} e il minuto ${b} la temperatura sale piano da ${deg(T1)} a ${deg(T1 + rise)}, senza una sosta: il materiale cambia stato in un intervallo di temperature, quindi è un miscuglio.`)],
		choice: choose(rng, opt(right), V.filter((x) => x !== right).map((x) => opt(x))),
		params: { case: pure ? 'pura' : 'miscuglio', change: which },
		scene: scene(pts, `Temperatura nel tempo: da ${said(T0)} a ${said(T1)} gradi in ${a} minuti, poi ${pure ? `ferma a ${said(T1)} gradi fino al minuto ${b}` : `sale piano fino a ${said(T1 + rise)} gradi al minuto ${b}`}, poi sale fino a ${said(T3)} gradi al minuto ${c}.`, 10),
	};
}

// ---------------------------------------------------------------------------
// Level 4: which substance

/** Melting and boiling points at 1 atm, °C (lesson 19's table and four more liquids, given in the text). */
export const SUBSTANCES: Record<string, [number, number]> = {
	acqua: [0, 100],
	etanolo: [-114, 78],
	acetone: [-95, 56],
	naftalene: [80, 218],
	mercurio: [-39, 357],
	'acido acetico': [17, 118],
	cicloesano: [7, 81],
	metanolo: [-98, 65],
	'glicole etilenico': [-13, 197],
};

function level4(rng: Rng): Built {
	for (;;) {
		const four = shuffle(rng, Object.keys(SUBSTANCES)).slice(0, 4);
		const x = four[0];
		const [tf, te] = SUBSTANCES[x];
		// No other candidate with both points within 5 °C of the right ones.
		if (four.slice(1).some((y) => Math.abs(SUBSTANCES[y][0] - tf) < 5 && Math.abs(SUBSTANCES[y][1] - te) < 5)) continue;
		const span = te - tf;
		const passo = [10, 20, 50, 100].find((p) => (span + 60) / p <= 9) ?? 100;
		const T0 = Math.floor((tf - 15) / passo) * passo;
		const T5 = Math.ceil((te + 15) / passo) * passo;
		const a = rng.int(2, 4), b = a + rng.int(2, 4), c = b + rng.int(3, 6), d = c + rng.int(4, 7), e = d + rng.int(2, 3);
		const pts: Pt[] = [[0, T0], [a, tf], [b, tf], [c, te], [d, te], [e, T5]];
		const listed = shuffle(rng, four);
		const table = listed.map((y) => `${y} ${deg(SUBSTANCES[y][0])} e ${deg(SUBSTANCES[y][1])}`).join('; ');
		return {
			prompt: 'Riconosci la sostanza dalla curva.',
			problem: textBlock(`Il grafico è la curva di riscaldamento di una sostanza pura, alla pressione normale. Temperature di fusione e di ebollizione di quattro sostanze: ${table}. Quale sostanza è?`),
			solution: opt(cap(x)).latex,
			steps: [textBlock(`Le soste termiche sono a ${deg(tf)}, la fusione, e a ${deg(te)}, l'ebollizione: sono le temperature ${/^[aeiou]/.test(x) ? `dell'${x}` : `del ${x}`}.`)],
			choice: choose(rng, opt(cap(x), x), four.slice(1).map((y) => opt(cap(y), y))),
			params: { case: 'sostanza', substance: x },
			scene: scene(pts, `Curva di riscaldamento con due soste termiche, a ${said(tf)} gradi e a ${said(te)} gradi.`, passo, 2, [tf, te]),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: a cooling curve with supercooling

function level5(rng: Rng): Built {
	const tf = rng.int(3, 12) * 10;
	const T0 = tf + rng.int(3, 5) * 10;
	const dip = rng.int(4, 8);
	const T4 = tf - rng.int(3, 4) * 10;
	const a = rng.int(3, 6), b = a + 1, c = b + rng.int(4, 8), d = c + rng.int(3, 6);
	const pts: Pt[] = [[0, T0], [a, tf - dip], [b, tf], [c, tf], [d, T4]];
	const alt = `Curva di raffreddamento: la temperatura scende da ${said(T0)} gradi fino a ${said(tf - dip)} gradi al minuto ${a}, risale a ${said(tf)} gradi al minuto ${b}, resta ferma fino al minuto ${c} e poi scende fino a ${said(T4)} gradi al minuto ${d}.`;
	if (rng.int(0, 1) === 0) {
		return {
			prompt: 'Leggi la curva di raffreddamento.',
			problem: textBlock('Il grafico è la curva di raffreddamento di un liquido puro, che alla fine è tutto solido. Qual è la sua temperatura di solidificazione?'),
			solution: `${tf}\\,^\\circ\\text{C}`,
			steps: [textBlock(`La temperatura di solidificazione è quella della sosta, ${deg(tf)}. Il punto più basso prima della sosta, ${deg(tf - dip)}, è la sopraffusione: il liquido è sceso sotto la temperatura di solidificazione prima che si formasse il primo cristallo.`)],
			choice: choose(rng, degOpt(tf), [tf - dip, T0, T4].map(degOpt)),
			params: { case: 'temperatura' },
			scene: scene(pts, alt, 10),
		};
	}
	const min = (m: number): ChoiceOption => ({ latex: `${m}\\,\\text{min}`, values: [String(m)] });
	return {
		prompt: 'Leggi la curva di raffreddamento.',
		problem: textBlock('Il grafico è la curva di raffreddamento di un liquido puro, con la sopraffusione. Dopo quanti minuti dall’inizio la sostanza è tutta solida?'),
		solution: `${c}\\,\\text{min}`,
		steps: [textBlock(`La solidificazione è la sosta a ${deg(tf)}, che comincia al minuto ${b} e finisce al minuto ${c}: da lì la temperatura scende di nuovo, perché c'è solo solido che si raffredda.`)],
		choice: choose(rng, min(c), [b, a, d].map(min)),
		params: { case: 'tempo' },
		scene: scene(pts, alt, 10),
	};
}

// ---------------------------------------------------------------------------
// Level 6: how long a plateau lasts

/** x with two significant figures, for LaTeX and as a value; null when x is too close to a rounding boundary. */
function sig2(x: number): { tex: string; value: string } | null {
	if (!(x > 0.1 && x < 99.5)) return null;
	const d = x >= 10 ? 0 : x >= 1 ? 1 : 2;
	const s = x * 10 ** d;
	if (Math.abs(s - Math.floor(s) - 0.5) < 1e-6) return null;
	const n = Math.round(s);
	if (n >= 100) return null; // 9,96 would round to 10,0: three figures
	// 20 min would have an ambiguous zero: the lessons avoid it.
	if (d === 0 && n % 10 === 0) return null;
	return { tex: dec(n, d), value: String(n / 10 ** d) };
}

const LATENT: Record<string, { solid: string; liquid: string; Lf: number; Lv: number }> = {
	acqua: { solid: 'ghiaccio', liquid: "d'acqua", Lf: 334, Lv: 2260 },
	etanolo: { solid: 'etanolo solido', liquid: 'di etanolo', Lf: 108, Lv: 855 },
};

function level6(rng: Rng): Built {
	const minOpt = (r: { tex: string; value: string }): ChoiceOption => ({ latex: `${r.tex}\\,\\text{min}`, values: [r.value] });
	if (rng.int(0, 1) === 0) {
		// The same change for a different mass.
		for (;;) {
			const m1 = rng.pick([100, 150, 200, 250, 300, 400, 500]);
			const m2 = rng.pick([100, 150, 200, 250, 300, 400, 500, 600, 750, 800, 1000]);
			const t1 = rng.int(20, 99); // tenths of a minute
			if (m1 === m2) continue;
			const exact = (t1 / 10) * (m2 / m1);
			const right = sig2(exact);
			if (!right) continue;
			const wrong = [(t1 / 10) * (m1 / m2), t1 / 10, (t1 / 10) * (Math.abs(m2 - m1) / m1), exact * 2, exact / 2, exact * 3, exact / 3].map(sig2).filter((w): w is { tex: string; value: string } => !!w && w.value !== right.value);
			if (new Set(wrong.map((w) => w.value)).size < 3) continue;
			const [what, done] = rng.pick([
				['di ghiaccio a $0\\,^\\circ\\text{C}$ fondono', 'la fusione'],
				["d'acqua a $100\\,^\\circ\\text{C}$ bollono via, diventando tutti vapore,", "l'ebollizione"],
			] as const);
			return {
				prompt: 'Calcola la durata della sosta.',
				problem: textBlock(`Con un fornello, $${m1}\\,\\text{g}$ ${what} in $${dec(t1, 1)}\\,\\text{min}$. Con lo stesso fornello, quanto dura ${done} di $${m2}\\,\\text{g}$?`),
				solution: `${right.tex}\\,\\text{min}`,
				steps: [`${dec(t1, 1)}\\,\\text{min} \\cdot \\dfrac{${m2}\\,\\text{g}}{${m1}\\,\\text{g}} = ${right.tex}\\,\\text{min}`, textBlock('Con lo stesso fornello, la durata della sosta è proporzionale alla massa.')],
				choice: choose(rng, minOpt(right), wrong.map(minOpt)),
				params: { case: 'massa' },
			};
		}
	}
	// From melting to boiling (or back) for the same mass: proportional to the latent heat.
	for (;;) {
		const s = rng.pick(Object.keys(LATENT));
		const L = LATENT[s];
		const forward = rng.int(0, 1) === 0;
		const t1 = forward ? rng.int(10, 40) : rng.int(40, 99); // tenths
		const k = forward ? L.Lv / L.Lf : L.Lf / L.Lv;
		const right = sig2((t1 / 10) * k);
		if (!right) continue;
		const wrong = [(t1 / 10) / k, t1 / 10, (t1 / 10) * Math.abs(k - 1), (t1 / 10) * k * 2, (t1 / 10) * k / 2, (t1 / 10) * k * 3].map(sig2).filter((w): w is { tex: string; value: string } => !!w && w.value !== right.value);
		if (new Set(wrong.map((w) => w.value)).size < 3) continue;
		const first = forward ? `la fusione di una certa massa di ${L.solid}` : `l'ebollizione di una certa massa ${L.liquid}`;
		const second = forward ? `l'ebollizione della stessa massa ${L.liquid}` : `la fusione della stessa massa di ${L.solid}`;
		return {
			prompt: 'Calcola la durata della sosta.',
			problem: textBlock(`Con un fornello, ${first} dura $${dec(t1, 1)}\\,\\text{min}$. Con lo stesso fornello, quanto dura ${second}? Calore latente di fusione $${L.Lf}\\,\\text{kJ/kg}$, di vaporizzazione $${L.Lv}\\,\\text{kJ/kg}$.`),
			solution: `${right.tex}\\,\\text{min}`,
			steps: [`${dec(t1, 1)}\\,\\text{min} \\cdot \\dfrac{${forward ? L.Lv : L.Lf}\\,\\text{kJ/kg}}{${forward ? L.Lf : L.Lv}\\,\\text{kJ/kg}} = ${right.tex}\\,\\text{min}`, textBlock('A parità di massa e di fornello, la durata della sosta è proporzionale al calore latente.')],
			choice: choose(rng, minOpt(right), wrong.map(minOpt)),
			params: { case: 'calore-latente', substance: s },
		};
	}
}

// ---------------------------------------------------------------------------

export default makeGenerator(
	ID,
	'Curve di riscaldamento e di raffreddamento',
	{
		1: { label: 'Le soste termiche', constraints: ['curva con due soste, temperature multiple di 20; fusione o ebollizione'] },
		2: { label: 'Che cosa c’è nel recipiente', constraints: ['un minuto dentro uno dei cinque tratti'] },
		3: { label: 'Sostanza pura o miscuglio', constraints: ['una sosta o un intervallo di 10 o 20 gradi, per la fusione o per l’ebollizione'] },
		4: { label: 'Riconoscere la sostanza', constraints: ['quattro sostanze, una sola con tutte e due le temperature'] },
		5: { label: 'La curva di raffreddamento', constraints: ['con la sopraffusione; la temperatura della sosta o il minuto in cui finisce'] },
		6: { label: 'La durata della sosta', constraints: ['proporzionale alla massa o al calore latente, due cifre significative'] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 },
);
