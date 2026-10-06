/**
 * Dal sistema tolemaico al sistema copernicano. Spec: specs/exercises/fis-sistemi-cosmologici.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/92-fis-sistemi-cosmologici.md), in its order, each one
 * step harder. The lesson is historical, so the levels are its three worked reasonings on generated cases: on
 * Ptolemy's epicycle the planet goes backwards at the point nearest to the Earth when its speed on the epicycle
 * beats the speed of the epicycle's centre on the deferent (first with the two speeds given, then from radii and
 * periods, as a ratio); in Copernicus's system the distance of an inner planet from the Sun is the sine of its
 * greatest elongation; the period of a planet comes from its synodic period, 1/T = 1/T_T − 1/S for an outer planet
 * and 1/T = 1/T_T + 1/S for an inner one. Distractors from the lesson's warnings: the speeds added, the ratio upside
 * down, cosine for sine, the signs of the two formulas swapped, the synodic period taken for the period.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, t } from '../vettori';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { ANNO_GIORNI, around, fmt, mant2, opt, opts, pu, qu, res, show, whole } from '../fis-keplero-newton';

export const ID = 'fis-sistemi-cosmologici';
const DEG = Math.PI / 180;
/** Only the options written without a power of ten, where the answer is. */
const plain = (xs: ChoiceOption[]) => xs.filter((o) => !o.values[0].includes('e'));

// ---------------------------------------------------------------------------
// Level 1: forwards or backwards at the nearest point, from the two speeds

function level1(rng: Rng): Built {
	const back = rng.next() < 0.5;
	for (;;) {
		const a = Number(whole(rng, 11, 49)), b = Number(whole(rng, 11, 49));
		const vd = back ? Math.min(a, b) : Math.max(a, b);
		const ve = back ? Math.max(a, b) : Math.min(a, b);
		const diff = Math.abs(vd - ve), sum = vd + ve;
		if (diff < 2 || diff % 10 === 0 || sum % 10 === 0 || diff === ve || diff === vd) continue;
		const word = (bk: boolean) => (bk ? 'indietro' : 'in avanti');
		const o = (x: number, bk: boolean) => ({ latex: `${qu(String(x), 'km/s')}\\ \\text{${word(bk)}}`, values: [String(bk ? -x : x)] });
		return {
			prompt: "Trova la velocità del pianeta nel punto dell'epiciclo più vicino alla Terra.",
			problem: textBlock(
				`In un modello tolemaico il centro dell'epiciclo avanza sul deferente a ${pu(String(vd), 'km/s')}, e il pianeta percorre l'epiciclo a ${pu(String(ve), 'km/s')}, nello stesso verso di rotazione. Visto dalla Terra, come si muove il pianeta nel punto dell'epiciclo più vicino alla Terra?`,
			),
			solution: `${qu(String(diff), 'km/s')}\\ \\text{${word(back)}}`,
			steps: [
				t("Nel punto più vicino alla Terra la velocità sull'epiciclo è opposta a quella del centro sul deferente:"),
				t('le due velocità si sottraggono.'),
				`v_d - v_e = ${qu(String(vd), 'km/s')} - ${qu(String(ve), 'km/s')} = ${qu(String(vd - ve), 'km/s')}`,
				t(back ? "Il risultato è negativo: vince l'epiciclo, il pianeta torna indietro (moto retrogrado)." : 'Il risultato è positivo: vince il deferente, il pianeta avanza, più lento del centro.'),
			],
			// the right speed with the wrong verse; the speeds added (the far point of the epicycle), both verses
			answer: choiceOf(rng, o(diff, back), [o(diff, !back), o(sum, false), o(sum, true)]),
			params: { case: back ? 'indietro' : 'avanti', vd: String(vd), ve: String(ve) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the ratio of the two speeds from radii and periods

function level2(rng: Rng): Built {
	for (;;) {
		const k = rng.int(21, 89);
		const r = (k / 100).toFixed(2); // the epicycle's radius over the deferent's
		const Td = mant2(rng), Te = mant2(rng); // years
		if (k % 10 === 0 || Td === Te) continue;
		const ratio = Number(r) * (Number(Td) / Number(Te));
		if (ratio < 0.2 || ratio > 9 || Math.abs(ratio - 1) < 0.08) continue;
		const ans = fmt(ratio, 2);
		if (!ans) continue;
		const back = ratio > 1;
		return {
			prompt: 'Trova il rapporto tra le due velocità.',
			problem: textBlock(
				`In un modello tolemaico il raggio dell'epiciclo di un pianeta è ${pu(r, '')} volte il raggio del deferente. Il centro dell'epiciclo fa un giro del deferente in ${pu(Td, 'anni')}, il pianeta fa un giro dell'epiciclo in ${pu(Te, 'anni')}. Quanto vale il rapporto $v_e/v_d$ tra la velocità sull'epiciclo e quella sul deferente?`,
			),
			solution: `\\dfrac{v_e}{v_d} \\approx ${ans.tex}`,
			steps: [
				t('Su un cerchio la velocità è la circonferenza divisa per il periodo:'),
				`v_d = \\dfrac{2\\pi R}{T_d} \\qquad v_e = \\dfrac{2\\pi r}{T_e}`,
				`\\dfrac{v_e}{v_d} = \\dfrac{r}{R} \\cdot \\dfrac{T_d}{T_e} = ${qu(r, '')} \\cdot \\dfrac{${qu(Td, '')}}{${qu(Te, '')}} = ${show(ratio)} \\approx ${ans.tex}`,
				t(back ? 'È più di 1: nel punto più vicino alla Terra il pianeta torna indietro.' : 'È meno di 1: nel punto più vicino alla Terra il pianeta rallenta, ma non torna indietro.'),
			],
			// the ratio upside down; the periods upside down; the periods forgotten... as far as they differ
			answer: choiceOf(rng, opt(ratio, 2, '')!, opts([1 / ratio, Number(r) * (Number(Te) / Number(Td)), Number(Td) / Number(Te) / Number(r)], 2, ''), around(ratio, 2, '')),
			params: { case: back ? 'indietro' : 'avanti', r, Td, Te },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the distance of an inner planet from its greatest elongation

function level3(rng: Rng): Built {
	for (;;) {
		const th = rng.int(12, 58);
		const d = Math.sin(th * DEG);
		const ans = fmt(d, 2);
		if (!ans) continue;
		const alt = `Il Sole, la Terra e un pianeta interno sulla sua orbita circolare. La linea di vista dalla Terra al pianeta è tangente all'orbita del pianeta: il triangolo Sole, pianeta, Terra ha l'angolo retto nel pianeta, e l'angolo nella Terra è di ${th} gradi. La distanza tra la Terra e il Sole è 1 unità astronomica.`;
		return {
			prompt: 'Trova la distanza del pianeta dal Sole.',
			problem: textBlock(`Un pianeta interno non si vede mai a più di $${th}^\\circ$ dal Sole: è la sua elongazione massima. La sua orbita è circolare. Quanto dista dal Sole?`),
			solution: `r \\approx ${res(ans, 'UA')}`,
			steps: [
				t("All'elongazione massima la linea di vista è tangente all'orbita: il triangolo"),
				t("Sole-pianeta-Terra ha l'angolo retto nel pianeta, e l'ipotenusa è 1 UA."),
				t("La distanza dal Sole è il cateto opposto all'angolo:"),
				`r = 1\\,\\text{UA} \\cdot \\sin ${th}^\\circ = ${show(d)}\\,\\text{UA} \\approx ${res(ans, 'UA')}`,
			],
			// cosine for sine; tangent; the sine at the denominator
			answer: choiceOf(rng, opt(d, 2, 'UA')!, opts([Math.cos(th * DEG), Math.tan(th * DEG), 1 / d], 2, 'UA'), around(d, 2, 'UA')),
			params: { angolo: th },
			scene: { type: 'elongazione-pianeta', data: { angolo: th, testo: `${th}°` }, alt },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: the period from the synodic period

function period(rng: Rng, inner: boolean): Built {
	for (;;) {
		const S = inner ? whole(rng, 101, 899) : whole(rng, 601, 999);
		const s = Number(S);
		const inv = inner ? 1 / ANNO_GIORNI + 1 / s : 1 / ANNO_GIORNI - 1 / s;
		const T = 1 / inv;
		const ans = fmt(T, 3);
		if (!ans || ans.value.includes('e')) continue;
		const wrong = 1 / (inner ? 1 / ANNO_GIORNI - 1 / s : 1 / ANNO_GIORNI + 1 / s);
		const sign = inner ? '+' : '-';
		return {
			prompt: 'Trova il periodo di rivoluzione del pianeta.',
			problem: textBlock(
				inner
					? `Un pianeta interno torna nella stessa posizione rispetto al Sole e alla Terra ogni ${pu(S, 'd')}: è il suo periodo sinodico. Il periodo della Terra è ${pu('365.25', 'd')}. Quanto dura il giro del pianeta attorno al Sole?`
					: `Un pianeta esterno torna in opposizione ogni ${pu(S, 'd')}: è il suo periodo sinodico. Il periodo della Terra è ${pu('365.25', 'd')}. Quanto dura il giro del pianeta attorno al Sole?`,
			),
			solution: `T \\approx ${res(ans, 'd')}`,
			steps: [
				t(inner ? 'Il pianeta è interno e più veloce: in un periodo sinodico fa un giro in più della Terra.' : 'Il pianeta è esterno e più lento: in un periodo sinodico la Terra fa un giro in più.'),
				inner ? `\\dfrac{S}{T} - \\dfrac{S}{T_T} = 1 \\quad\\Rightarrow\\quad \\dfrac{1}{T} = \\dfrac{1}{T_T} + \\dfrac{1}{S}` : `\\dfrac{S}{T_T} - \\dfrac{S}{T} = 1 \\quad\\Rightarrow\\quad \\dfrac{1}{T} = \\dfrac{1}{T_T} - \\dfrac{1}{S}`,
				`\\dfrac{1}{T} = \\dfrac{1}{${qu('365.25', 'd')}} ${sign} \\dfrac{1}{${qu(S, 'd')}} = ${show(inv)}\\,\\text{d}^{-1}`,
				`T = ${show(T, 5)}\\,\\text{d} \\approx ${res(ans, 'd')}`,
			],
			// the formula of the other kind of planet; the two periods subtracted; their mean
			answer: choiceOf(rng, opt(T, 3, 'd')!, plain(opts([wrong, Math.abs(s - ANNO_GIORNI), (s + ANNO_GIORNI) / 2], 3, 'd')), plain(around(T, 3, 'd'))),
			params: { case: inner ? 'interno' : 'esterno', S },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: (rng) => period(rng, false), 5: (rng) => period(rng, true) };

const check = (sample: Sample): string[] => checkCommon(sample);

export const fisSistemiCosmologici: Generator = {
	id: ID,
	title: 'Dal sistema tolemaico al sistema copernicano',
	levels: {
		1: { label: "Avanti o indietro sull'epiciclo", constraints: ['le due velocità date', 'nel punto più vicino alla Terra si sottraggono'] },
		2: { label: 'Le velocità da raggi e periodi', constraints: ['v_e/v_d = (r/R)(T_d/T_e)', 'rapporto lontano da 1'] },
		3: { label: "La distanza dall'elongazione", constraints: ['r = sin θ in UA', 'θ tra 12° e 58°'] },
		4: { label: 'Il periodo di un pianeta esterno', constraints: ['1/T = 1/T_T − 1/S', 'S tra 601 e 999 giorni'] },
		5: { label: 'Il periodo di un pianeta interno', constraints: ['1/T = 1/T_T + 1/S', 'S tra 101 e 899 giorni'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisSistemiCosmologici;
