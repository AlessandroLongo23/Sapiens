/**
 * I passaggi di stato e il calore latente. Spec: specs/exercises/fis-passaggi-stato.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/70-fis-passaggi-stato.md), each one step harder: the heat
 * of a change of state, Q = L m, for water that melts, freezes, boils away or condenses; the mass from the heat; two
 * stages (melting and warming, or warming and boiling); three stages (ice below zero to water above); the latent heat
 * or the mass read on a temperature-heat graph; a cube of ice melting in water. Water's data as in the lesson:
 * c = 4186 J/(kg·°C), ice 2,1·10³, L_f = 3,34·10⁵ J/kg, L_v = 2,26·10⁶ J/kg, written in each text. Masses with two
 * significant figures, results rounded to two and never too close to a rounding boundary. Distractors from the
 * lesson's warnings: L_f and L_v swapped, a stage forgotten, the water's specific heat for the ice, grams not converted.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { type Built, C_ICE, C_WATER, LF, LV, answerOf, checkCommon, dec, generateWith, mass2, pq, q, sig, t, tex, textBlock } from '../fis-calore';

export const ID = 'fis-passaggi-stato';

const LF_T = `3{,}34 \\cdot 10^{5}`;
const LV_T = `2{,}26 \\cdot 10^{6}`;
const LF_TEXT = `Il calore latente di fusione del ghiaccio è $${LF_T}\\,\\text{J/kg}$.`;
const LV_TEXT = `Il calore latente di vaporizzazione dell'acqua è $${LV_T}\\,\\text{J/kg}$.`;
const CW_TEXT = `Il calore specifico dell'acqua è $4186\\,\\text{J/(kg}\\cdot{}^\\circ\\text{C)}$.`;
const CI_TEXT = `quello del ghiaccio $2{,}1 \\cdot 10^{3}\\,\\text{J/(kg}\\cdot{}^\\circ\\text{C)}$`;
/** An unrounded intermediate value for the steps: five figures, never in exponent form. */
const raw = (x: number) => tex(x >= 1e4 ? String(Math.round(x)) : x.toPrecision(5));
const deg = (x: number) => pq(String(x), 'C');

// ---------------------------------------------------------------------------
// Level 1: Q = L m

type Kind = 'fusione' | 'solidificazione' | 'vaporizzazione' | 'condensazione';
const KINDS: Kind[] = ['fusione', 'solidificazione', 'vaporizzazione', 'condensazione'];
const STORY: Record<Kind, (m: string) => string> = {
	fusione: (m) => `Quanto calore serve per fondere ${pq(tex(m), 'kg')} di ghiaccio che si trova già a $0\\,^\\circ\\text{C}$? ${LF_TEXT}`,
	solidificazione: (m) => `${pq(tex(m), 'kg')} d'acqua a $0\\,^\\circ\\text{C}$ diventano ghiaccio nel congelatore. Quanto calore cedono? ${LF_TEXT}`,
	vaporizzazione: (m) => `Quanto calore serve per trasformare in vapore ${pq(tex(m), 'kg')} d'acqua che bolle a $100\\,^\\circ\\text{C}$? ${LV_TEXT}`,
	condensazione: (m) => `${pq(tex(m), 'kg')} di vapore a $100\\,^\\circ\\text{C}$ condensano in acqua alla stessa temperatura. Quanto calore cedono? ${LV_TEXT}`,
};

function level1(rng: Rng): Built {
	const kind = rng.pick(KINDS);
	for (;;) {
		const m = mass2(rng);
		const fus = kind === 'fusione' || kind === 'solidificazione';
		const L = fus ? LF : LV;
		const exact = L * Number(m);
		const ans = sig(exact, 2);
		if (!ans) continue;
		return {
			prompt: kind === 'fusione' || kind === 'vaporizzazione' ? 'Trova il calore necessario.' : 'Trova il calore ceduto.',
			problem: textBlock(STORY[kind](m)),
			solution: `Q \\approx ${q(ans.tex, 'J')}`,
			steps: [
				kind === 'solidificazione' || kind === 'condensazione' ? t('Nel passaggio inverso si cede lo stesso calore latente:') : t('Il passaggio avviene alla temperatura costante del cambiamento di stato:'),
				`Q = ${fus ? 'L_f' : 'L_v'}\\,m = ${fus ? LF_T : LV_T}\\,\\text{J/kg} \\cdot ${tex(m)}\\,\\text{kg} = ${raw(exact)}\\,\\text{J} \\approx ${q(ans.tex, 'J')}`,
			],
			// the other latent heat; the mass in grams; L divided by m
			answer: answerOf(rng, ans, exact, [(fus ? LV : LF) * Number(m), exact * 1000, L / Number(m)], 2, 'J'),
			params: { case: kind, m },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the mass from the heat

function level2(rng: Rng): Built {
	const melt = rng.next() < 0.5;
	for (;;) {
		const L = melt ? LF : LV;
		const e = melt ? rng.int(3, 5) : rng.int(4, 6);
		const n = rng.int(11, 99);
		if (n % 10 === 0) continue;
		const Q = (n / 10) * 10 ** e;
		const Qt = `${tex(dec(n, 1))} \\cdot 10^{${e}}`;
		const exact = (Q / L) * 1000; // g
		const ans = sig(exact, 2);
		if (!ans || exact < 10 || exact >= 1000) continue;
		return {
			prompt: 'Trova la massa.',
			problem: textBlock(
				melt
					? `A un blocco di ghiaccio a $0\\,^\\circ\\text{C}$ si forniscono $${Qt}\\,\\text{J}$. Quanti grammi di ghiaccio fondono? ${LF_TEXT}`
					: `All'acqua che bolle in una pentola, a $100\\,^\\circ\\text{C}$, si forniscono $${Qt}\\,\\text{J}$. Quanti grammi d'acqua diventano vapore? ${LV_TEXT}`,
			),
			solution: `m \\approx ${q(ans.tex, 'g')}`,
			steps: [
				`Q = ${melt ? 'L_f' : 'L_v'}\\,m \\quad\\Rightarrow\\quad m = \\dfrac{Q}{${melt ? 'L_f' : 'L_v'}} = \\dfrac{${Qt}\\,\\text{J}}{${melt ? LF_T : LV_T}\\,\\text{J/kg}} = ${raw(exact / 1000)}\\,\\text{kg}`,
				`m = ${raw(exact)}\\,\\text{g} \\approx ${q(ans.tex, 'g')}`,
			],
			// the other latent heat; kilograms read as grams; Q times L (scaled)
			answer: answerOf(rng, ans, exact, [(Q / (melt ? LV : LF)) * 1000, exact / 1000, exact * 10], 2, 'g'),
			params: { case: melt ? 'fusione' : 'vaporizzazione', Q: `${dec(n, 1)}e${e}` },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: two stages

function level3(rng: Rng): Built {
	const melt = rng.next() < 0.5;
	for (;;) {
		const m = mass2(rng);
		const M = Number(m);
		if (melt) {
			const tf = rng.int(5, 60);
			const q1 = LF * M, q2 = C_WATER * M * tf;
			const exact = q1 + q2;
			const ans = sig(exact, 2);
			if (!ans) continue;
			return {
				prompt: 'Trova il calore necessario.',
				problem: textBlock(`Quanto calore serve per trasformare ${pq(tex(m), 'kg')} di ghiaccio a $0\\,^\\circ\\text{C}$ in acqua a ${deg(tf)}? ${LF_TEXT} ${CW_TEXT}`),
				solution: `Q \\approx ${q(ans.tex, 'J')}`,
				steps: [
					`${t('Il ghiaccio fonde: ')} Q_1 = L_f\\,m = ${LF_T} \\cdot ${tex(m)}\\,\\text{J} = ${raw(q1)}\\,\\text{J}`,
					`${t("L'acqua si scalda: ")} Q_2 = c\\,m\\,\\Delta t = 4186 \\cdot ${tex(m)} \\cdot ${tf}\\,\\text{J} = ${raw(q2)}\\,\\text{J}`,
					`Q = Q_1 + Q_2 = ${raw(exact)}\\,\\text{J} \\approx ${q(ans.tex, 'J')}`,
				],
				// the melting only; the warming only; L_v in place of L_f
				answer: answerOf(rng, ans, exact, [q1, q2, LV * M + q2], 2, 'J'),
				params: { case: 'fusione', m, tf },
			};
		}
		const ti = rng.int(10, 90);
		const q1 = C_WATER * M * (100 - ti), q2 = LV * M;
		const exact = q1 + q2;
		const ans = sig(exact, 2);
		if (!ans) continue;
		return {
			prompt: 'Trova il calore necessario.',
			problem: textBlock(`Quanto calore serve per trasformare in vapore ${pq(tex(m), 'kg')} d'acqua a ${deg(ti)}? ${CW_TEXT} ${LV_TEXT}`),
			solution: `Q \\approx ${q(ans.tex, 'J')}`,
			steps: [
				`${t("L'acqua si scalda fino a 100 gradi: ")} Q_1 = c\\,m\\,\\Delta t = 4186 \\cdot ${tex(m)} \\cdot (100 - ${ti})\\,\\text{J} = ${raw(q1)}\\,\\text{J}`,
				`${t("L'acqua bolle: ")} Q_2 = L_v\\,m = ${LV_T} \\cdot ${tex(m)}\\,\\text{J} = ${raw(q2)}\\,\\text{J}`,
				`Q = Q_1 + Q_2 = ${raw(exact)}\\,\\text{J} \\approx ${q(ans.tex, 'J')}`,
			],
			// the boiling only; the warming only; the warming from 0 °C (Δt = t)
			answer: answerOf(rng, ans, exact, [q2, q1, C_WATER * M * ti + q2], 2, 'J'),
			params: { case: 'ebollizione', m, ti },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: three stages

function level4(rng: Rng): Built {
	for (;;) {
		const m = mass2(rng);
		const M = Number(m);
		const t0 = rng.int(5, 30), tf = rng.int(5, 60);
		const q1 = C_ICE * M * t0, q2 = LF * M, q3 = C_WATER * M * tf;
		const exact = q1 + q2 + q3;
		const ans = sig(exact, 2);
		if (!ans) continue;
		return {
			prompt: 'Trova il calore necessario.',
			problem: textBlock(
				`Quanto calore serve per trasformare ${pq(tex(m), 'kg')} di ghiaccio a ${deg(-t0)} in acqua a ${deg(tf)}? Il calore specifico dell'acqua è $4186\\,\\text{J/(kg}\\cdot{}^\\circ\\text{C)}$, ${CI_TEXT}. ${LF_TEXT}`,
			),
			solution: `Q \\approx ${q(ans.tex, 'J')}`,
			steps: [
				`${t('Il ghiaccio si scalda fino a 0 gradi: ')} Q_1 = 2{,}1 \\cdot 10^{3} \\cdot ${tex(m)} \\cdot ${t0}\\,\\text{J} = ${raw(q1)}\\,\\text{J}`,
				`${t('Il ghiaccio fonde: ')} Q_2 = L_f\\,m = ${raw(q2)}\\,\\text{J}`,
				`${t("L'acqua si scalda: ")} Q_3 = 4186 \\cdot ${tex(m)} \\cdot ${tf}\\,\\text{J} = ${raw(q3)}\\,\\text{J}`,
				`Q = Q_1 + Q_2 + Q_3 = ${raw(exact)}\\,\\text{J} \\approx ${q(ans.tex, 'J')}`,
			],
			// the ice's warming forgotten; water's c for the ice; the melting forgotten
			answer: answerOf(rng, ans, exact, [q2 + q3, C_WATER * M * t0 + q2 + q3, q1 + q3], 2, 'J'),
			params: { case: 'tre tappe', m, t0, tf },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the graph

/** The temperature-heat graph: corners in kJ and °C, the labels written at them. */
function curve(alt: string, pts: [number, number][]): SceneRef {
	return { type: 'curva-riscaldamento', data: { punti: pts.map(([x, y]) => [Math.round(x * 100) / 100, y]) }, alt };
}
const kj = (x: number) => String(Math.round(x * 10) / 10).replace('.', ',');

function level5(rng: Rng): Built {
	const askL = rng.next() < 0.5;
	for (;;) {
		if (askL) {
			const m = mass2(rng);
			const M = Number(m);
			const tf = rng.int(6, 35) * 10; // 60-350 °C
			const q1 = rng.int(5, 60), dq = rng.int(11, 99); // kJ
			if (dq % 10 === 0) continue;
			const q3 = q1 + dq + rng.int(5, 30);
			const exact = (dq * 1000) / M;
			const ans = sig(exact, 2);
			if (!ans) continue;
			return {
				prompt: 'Trova il calore latente.',
				problem: textBlock(`Un campione di ${pq(tex(m), 'kg')} di una sostanza solida, a $20\\,^\\circ\\text{C}$, viene scaldato fino a fonderlo tutto. Il grafico mostra la sua temperatura in funzione del calore fornito. Quanto vale il calore latente di fusione della sostanza?`),
				solution: `L_f \\approx ${q(ans.tex, 'Jkg')}`,
				steps: [
					t(`La fusione è il tratto orizzontale, a ${tf} gradi: va da ${q1} a ${q1 + dq} kJ.`),
					`L_f\\,m = ${q1 + dq}\\,\\text{kJ} - ${q1}\\,\\text{kJ} = ${dq}\\,\\text{kJ} = ${dq * 1000}\\,\\text{J}`,
					`L_f = \\dfrac{${dq * 1000}\\,\\text{J}}{${tex(m)}\\,\\text{kg}} = ${raw(exact)}\\,\\text{J/kg} \\approx ${q(ans.tex, 'Jkg')}`,
				],
				// the end of the plateau read in place of its length; ΔQ times m; kJ not converted
				answer: answerOf(rng, ans, exact, [((q1 + dq) * 1000) / M, dq * 1000 * M, dq / M], 2, 'Jkg'),
				params: { case: 'calore latente', m, tf, q1, dq },
				scene: curve(`Grafico della temperatura in funzione del calore fornito: da 20 gradi a ${tf} gradi con ${q1} kilojoule, un tratto orizzontale a ${tf} gradi fino a ${q1 + dq} kilojoule, poi di nuovo in salita fino a ${q3} kilojoule.`, [
					[0, 20],
					[q1, tf],
					[q1 + dq, tf],
					[q3, tf + 40],
				]),
			};
		}
		// ice from t0 below zero, melting, water up to 40 °C: the mass from the plateau
		const k = rng.int(11, 99);
		if (k % 10 === 0) continue;
		const M = k / 100; // kg, used to build the graph
		const t0 = rng.int(1, 4) * 10;
		const q1 = (C_ICE * M * t0) / 1000, dq = (LF * M) / 1000;
		const q3 = q1 + dq + (C_WATER * M * 40) / 1000;
		const a = Math.round(q1 * 10) / 10, b = Math.round((q1 + dq) * 10) / 10;
		const exact = ((b - a) * 1e6) / LF; // g, from the labels as read
		const ans = sig(exact, 2);
		if (!ans) continue;
		return {
			prompt: 'Trova la massa.',
			problem: textBlock(`Il grafico mostra la temperatura di un blocco di ghiaccio in funzione del calore fornito, finché non diventa acqua a $40\\,^\\circ\\text{C}$. Qual è la massa del blocco, in grammi? ${LF_TEXT}`),
			solution: `m \\approx ${q(ans.tex, 'g')}`,
			steps: [
				t(`La fusione è il tratto orizzontale a 0 gradi: va da ${kj(a)} a ${kj(b)} kJ.`),
				`L_f\\,m = ${tex(kj(b).replace(',', '.'))}\\,\\text{kJ} - ${tex(kj(a).replace(',', '.'))}\\,\\text{kJ} = ${tex(String(Math.round((b - a) * 10) / 10))}\\,\\text{kJ}`,
				`m = \\dfrac{${Math.round((b - a) * 1000)}\\,\\text{J}}{${LF_T}\\,\\text{J/kg}} = ${raw(exact / 1000)}\\,\\text{kg} \\approx ${q(ans.tex, 'g')}`,
			],
			// the end of the plateau in place of its length; L_v; the start of the plateau
			answer: answerOf(rng, ans, exact, [(b * 1e6) / LF, ((b - a) * 1e6) / LV, (a * 1e6) / LF], 2, 'g'),
			params: { case: 'massa', t0, a: kj(a), b: kj(b), q3: Math.round(q3 * 10) / 10 },
			scene: curve(`Grafico della temperatura del ghiaccio in funzione del calore fornito: da meno ${t0} gradi a 0 gradi con ${kj(a)} kilojoule, un tratto orizzontale a 0 gradi fino a ${kj(b)} kilojoule, poi in salita fino a 40 gradi.`, [
				[0, -t0],
				[a, 0],
				[b, 0],
				[Math.round(q3 * 10) / 10, 40],
			]),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: ice in water

function level6(rng: Rng): Built {
	for (;;) {
		const mi = rng.int(11, 99); // g
		if (mi % 10 === 0) continue;
		const mw = rng.int(15, 40) * 10; // g
		const tw = rng.int(15, 40);
		const give = C_WATER * (mw / 1000) * tw, need = LF * (mi / 1000);
		if (give < 1.1 * need) continue;
		const exact = (give - need) / (C_WATER * ((mw + mi) / 1000));
		const ans = sig(exact, 2);
		if (!ans || exact < 1) continue;
		return {
			prompt: 'Trova la temperatura finale.',
			problem: textBlock(`Un cubetto di ghiaccio di ${pq(String(mi), 'g')}, a $0\\,^\\circ\\text{C}$, viene messo in un bicchiere con ${pq(String(mw), 'g')} d'acqua a ${deg(tw)}. Il ghiaccio fonde tutto. Trascurando il bicchiere e l'aria, a quale temperatura arriva l'acqua? ${LF_TEXT} ${CW_TEXT}`),
			solution: `t_e \\approx ${q(ans.tex, 'C')}`,
			steps: [
				t("Il calore ceduto dall'acqua fonde il ghiaccio e scalda l'acqua di fusione da 0 gradi a te:"),
				`4186 \\cdot ${tex(dec(mw, 3))} \\cdot (${tw} - t_e) = ${LF_T} \\cdot ${tex(dec(mi, 3))} + 4186 \\cdot ${tex(dec(mi, 3))} \\cdot t_e`,
				`t_e = \\dfrac{${raw(give)} - ${raw(need)}}{${raw(C_WATER * ((mw + mi) / 1000))}}\\,^\\circ\\text{C} = ${raw(exact)}\\,^\\circ\\text{C} \\approx ${q(ans.tex, 'C')}`,
			],
			// the latent heat forgotten; the melted water not warmed; the latent heat with the wrong sign
			answer: answerOf(rng, ans, exact, [(mw * tw) / (mw + mi), tw - need / (C_WATER * (mw / 1000)), (give + need) / (C_WATER * ((mw + mi) / 1000))], 2, 'C', [exact + 2, exact * 1.5, exact * 0.5, exact + 5]),
			params: { case: 'ghiaccio in acqua', mi, mw, tw },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level === 5 && !sample.scene) v.push('manca il grafico');
	return v;
}

export const fisPassaggiStato: Generator = {
	id: ID,
	title: 'I passaggi di stato e il calore latente',
	levels: {
		1: { label: 'Il calore latente', constraints: ['fusione, solidificazione, vaporizzazione o condensazione'] },
		2: { label: 'La massa dal calore', constraints: ['ghiaccio che fonde o acqua che bolle', 'risultato in grammi'] },
		3: { label: 'Due tappe', constraints: ['fusione e riscaldamento, o riscaldamento ed ebollizione'] },
		4: { label: 'Tre tappe', constraints: ['ghiaccio sotto zero fino ad acqua sopra zero'] },
		5: { label: 'Il grafico temperatura-calore', constraints: ['calore latente o massa dal pianerottolo'] },
		6: { label: "Ghiaccio nell'acqua", constraints: ['il ghiaccio fonde tutto', 'temperatura finale almeno 1 °C'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisPassaggiStato;
