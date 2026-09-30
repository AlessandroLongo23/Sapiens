/**
 * L'occhio e gli strumenti ottici. Spec: specs/exercises/fis-strumenti-ottici.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/37-fis-strumenti-ottici.md): the magnification of a
 * telescope (f_ob/f_oc, and its length) and of a microscope (the product); the lenses for myopia (P = −1/d_R); the
 * lenses for hyperopia (P = 1/0,25 m − 1/d_P); the camera (the lens–sensor distance, or how far the lens moves from
 * the focus at infinity); the magnifying glass with the image at 25 cm (where the object goes, or the magnification);
 * the power of the eye in the lesson's model (lens 1,7 cm from the retina) looking at an object at distance d. Signs
 * as in "Le lenti sottili". Results with two significant figures. Distractors: the ratio upside down, the far point in
 * centimetres, the sign of the lens, the image put in the focus, 1/q not inverted.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { BANNED, choiceOf, decTex, roundSig, t } from '../vettori';

export const ID = 'fis-strumenti-ottici';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
	solutionScene?: SceneRef;
}

/** A quantity with n significant figures, as an option: "−0{,}50\,\text{D}". */
function qOpt(x: number, unit: string, n = 2): ChoiceOption[] {
	const s = roundSig(x, n);
	return s === null ? [] : [{ latex: `${decTex(s)}${unit ? `\\,\\text{${unit}}` : ''}`, values: [s] }];
}
const plain = (x: number) => decTex(String(Number(x.toFixed(4))));
/** A length in metres with at least two significant figures: 1 → "1{,}0", 2.5 → "2{,}5", 1.25 → "1{,}25". */
const metres = (x: number) => (Number.isInteger(x) ? decTex(x.toFixed(1)) : plain(x));

// ---------------------------------------------------------------------------
// Level 1: telescope and microscope

function level1(rng: Rng): Built {
	const kind = rng.pick(['cannocchiale', 'lunghezza', 'microscopio'] as const);
	if (kind === 'microscopio') {
		const gob = rng.pick([4, 10, 20, 40, 60, 100]);
		const goc = rng.pick([5, 8, 10, 12, 15, 20]);
		const G = gob * goc;
		const opt = (x: number): ChoiceOption => ({ latex: `${plain(x)}\\ \\text{volte}`, values: [String(x)] });
		const answer = choiceOf(rng, opt(G), [opt(gob + goc), ...(gob % goc === 0 && gob !== goc ? [opt(gob / goc)] : []), opt(G * 10)], [opt(G * 2), opt(G / 2)]);
		return {
			prompt: "Trova l'ingrandimento.",
			problem: textBlock(`Un microscopio ha un obiettivo che ingrandisce $${gob}$ volte e un oculare che ingrandisce $${goc}$ volte. Quante volte ingrandisce il microscopio?`),
			solution: `G = ${G}`,
			steps: [t("L'oculare ingrandisce l'immagine già ingrandita dall'obiettivo: gli ingrandimenti si moltiplicano."), `G = ${gob} \\cdot ${goc} = ${G}`],
			answer,
			params: { case: kind, gob, goc },
		};
	}
	let fob: number, foc: number, G: number;
	do {
		fob = rng.int(8, 30) * 5; // 40 to 150 cm
		foc = rng.pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]);
		G = fob / foc;
	} while (!Number.isInteger(G) || G < 10 || G > 200);
	const fobT = plain(fob), focT = plain(foc);
	const problem = textBlock(`Un cannocchiale astronomico ha l'obiettivo con distanza focale $${fobT}\\,\\text{cm}$ e l'oculare con distanza focale $${focT}\\,\\text{cm}$. ${kind === 'cannocchiale' ? 'Quanto vale il suo ingrandimento?' : 'Quanto distano le due lenti?'}`);
	if (kind === 'cannocchiale') {
		const opt = (x: number, n = 3): ChoiceOption[] => {
			const s = Number.isInteger(x) ? String(x) : roundSig(x, n);
			return s === null ? [] : [{ latex: `G = ${decTex(s)}`, values: [s] }];
		};
		const answer = choiceOf(rng, opt(G)[0], [...opt(foc / fob, 2), ...opt(fob * foc), ...opt(fob - foc)], [...opt(G * 2), ...opt(G + 10)]);
		return {
			prompt: "Trova l'ingrandimento.",
			problem,
			solution: `G = ${G}`,
			steps: [t("L'ingrandimento è la focale dell'obiettivo divisa per quella dell'oculare:"), `G = \\frac{f_{ob}}{f_{oc}} = \\frac{${fobT}}{${focT}} = ${G}`],
			answer,
			params: { case: kind, fob, foc },
		};
	}
	const L = fob + foc;
	const cmO = (x: number): ChoiceOption => ({ latex: `${plain(x)}\\,\\text{cm}`, values: [String(x)] });
	const answer = choiceOf(rng, cmO(L), [cmO(fob - foc), cmO(fob), cmO(2 * fob)], [cmO(L + 10)]);
	return {
		prompt: 'Trova la distanza tra le lenti.',
		problem,
		solution: `L = ${plain(L)}\\,\\text{cm}`,
		steps: [t("Le due lenti hanno un fuoco in comune, quindi distano la somma delle distanze focali:"), `L = f_{ob} + f_{oc} = ${fobT} + ${focT} = ${plain(L)}\\,\\text{cm}`],
		answer,
		params: { case: kind, fob, foc },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: glasses

const FAR = [0.2, 0.25, 0.4, 0.5, 1.25, 2, 2.5, 4, 5]; // metres: powers −5,0 ... −0,20 D
const NEAR = [40, 50, 100, 125, 200, 250]; // cm: 1,5 2,0 3,0 3,2 3,5 3,6 D

function level2(rng: Rng): Built {
	const d = rng.pick(FAR);
	const inCm = d < 1 && rng.next() < 0.5;
	const P = -1 / d;
	const given = inCm ? `${plain(d * 100)}\\,\\text{cm}` : `${metres(d)}\\,\\text{m}`;
	const answer = choiceOf(rng, qOpt(P, 'D')[0], [...qOpt(-P, 'D'), ...qOpt(-1 / (d * 100), 'D'), ...qOpt(-d, 'D')], [...qOpt(2 * P, 'D'), ...qOpt(P / 2, 'D')]);
	return {
		prompt: 'Trova il potere delle lenti.',
		problem: textBlock(`Un ragazzo miope vede nitido senza occhiali solo fino a $${given}$. Che potere devono avere le lenti che correggono la sua miopia? Trascura la distanza tra le lenti e l'occhio.`),
		solution: `P = ${qOpt(P, 'D')[0].latex}`,
		steps: [t(`Il punto remoto è a ${metres(d).replace('{,}', ',')} m. Serve una lente divergente con f uguale a meno questa distanza.`), `P = -\\frac{1}{d_R} = -\\frac{1}{${metres(d)}\\,\\text{m}} = ${qOpt(P, 'D')[0].latex}`],
		answer,
		params: { case: inCm ? 'centimetri' : 'metri', d },
	};
}

function level3(rng: Rng): Built {
	const dp = rng.pick(NEAR);
	const P = 4 - 100 / dp;
	const answer = choiceOf(rng, qOpt(P, 'D')[0], [...qOpt(-100 / dp, 'D'), ...qOpt(100 / dp, 'D'), ...qOpt(4 + 100 / dp, 'D')], [...qOpt(-P, 'D'), ...qOpt(P + 1, 'D')]);
	return {
		prompt: 'Trova il potere delle lenti.',
		problem: textBlock(`Una ragazza ipermetrope ha il punto prossimo a $${dp < 100 ? `${dp}\\,\\text{cm}` : `${metres(dp / 100)}\\,\\text{m}`}$. Che potere devono avere le lenti per leggere un libro a $25\\,\\text{cm}$? Trascura la distanza tra le lenti e l'occhio.`),
		solution: `P = ${qOpt(P, 'D')[0].latex}`,
		steps: [t(`La lente deve formare, di un oggetto a 25 cm, un'immagine virtuale nel punto prossimo: p = 0,25 m, q = -${metres(dp / 100).replace('{,}', ',')} m.`), `P = \\frac{1}{p} + \\frac{1}{q} = \\frac{1}{0{,}25} - \\frac{1}{${metres(dp / 100)}} = ${qOpt(P, 'D')[0].latex}`, t('Il potere è positivo: lenti convergenti.')],
		answer,
		params: { case: 'ipermetropia', dp },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the camera

function level4(rng: Rng): Built {
	const f = rng.pick([35, 50, 85, 100]);
	const p = rng.pick([1, 1.5, 2, 2.5, 3, 4, 5]); // m
	const pm = p * 1000;
	const q = (pm * f) / (pm - f);
	const shift = q - f;
	const askShift = rng.next() < 0.5;
	const pT = metres(p);
	const qs = roundSig(q, 2), ss = roundSig(shift, 2);
	if (qs === null || ss === null) throw new Error('resample');
	const steps = [t(`Con le distanze in millimetri, p = ${p * 1000} mm:`), `\\frac{1}{q} = \\frac{1}{${f}} - \\frac{1}{${pm}} \\qquad q = ${decTex(q.toFixed(2))}\\ldots\\,\\text{mm}`];
	if (!askShift) {
		const answer = choiceOf(rng, qOpt(q, 'mm')[0], [...qOpt(f, 'mm'), ...qOpt((pm * f) / (pm + f), 'mm'), ...qOpt(shift, 'mm')], [...qOpt(q * 1.2, 'mm')]);
		return {
			prompt: "Trova la distanza tra l'obiettivo e il sensore.",
			problem: textBlock(`L'obiettivo di una macchina fotografica ha la distanza focale di $${f}\\,\\text{mm}$. A che distanza dal sensore deve stare per fotografare una persona a $${pT}\\,\\text{m}$?`),
			solution: `q \\approx ${decTex(qs)}\\,\\text{mm}`,
			steps: [...steps, t(`Con due cifre significative, come i dati: ${qs.replace('.', ',')} mm.`)],
			answer,
			params: { case: 'distanza', f, p },
		};
	}
	const answer = choiceOf(rng, qOpt(shift, 'mm')[0], [...qOpt(q, 'mm'), ...qOpt(f / p, 'mm'), ...qOpt(shift * 10, 'mm')], [...qOpt(shift * 2, 'mm'), ...qOpt(shift / 2, 'mm')]);
	return {
		prompt: "Trova di quanto si sposta l'obiettivo.",
		problem: textBlock(`L'obiettivo di una macchina fotografica ha la distanza focale di $${f}\\,\\text{mm}$ ed è a fuoco sugli oggetti lontanissimi. Di quanto deve allontanarsi dal sensore per mettere a fuoco una persona a $${pT}\\,\\text{m}$?`),
		solution: `q - f \\approx ${decTex(ss)}\\,\\text{mm}`,
		steps: [t(`A fuoco all'infinito l'obiettivo sta a ${f} mm dal sensore, la sua distanza focale.`), ...steps, `q - f = ${decTex(shift.toFixed(3))}\\ldots\\,\\text{mm} \\approx ${decTex(ss)}\\,\\text{mm}`],
		answer,
		params: { case: 'spostamento', f, p },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the magnifying glass

const MAG = [
	{ f: 2.5, P: 40 },
	{ f: 5, P: 20 },
	{ f: 10, P: 10 },
	{ f: 12.5, P: 8 },
	{ f: 25, P: 4 },
];

function level5(rng: Rng): Built {
	const m = rng.pick(MAG);
	const byPower = rng.next() < 0.4;
	const f = m.f;
	const p = (25 * f) / (25 + f);
	const G = 25 / p;
	const askP = rng.next() < 0.5;
	const lens = byPower ? `una lente d'ingrandimento da $${m.P}\\,\\text{D}$` : `una lente d'ingrandimento con distanza focale $${plain(f)}\\,\\text{cm}$`;
	const first = byPower ? [t(`La distanza focale è f = 1/P = 1/${m.P} m = ${plain(f).replace('{,}', ',')} cm.`)] : [];
	const steps = [...first, t("L'immagine è virtuale a 25 cm: q = -25 cm."), `\\frac{1}{p} = \\frac{1}{f} - \\frac{1}{q} = \\frac{1}{${plain(f)}} + \\frac{1}{25} \\qquad p = ${decTex(p.toFixed(3))}\\ldots\\,\\text{cm}`];
	const sc: SceneRef = { type: 'lente-oggetto', data: { lente: 'convergente', p: Number(p.toFixed(3)), f, q: -25, G, raggi: true }, alt: `Una lente d'ingrandimento con i fuochi a ${String(f).replace('.', ',')} centimetri; l'oggetto sta tra il fuoco e la lente, e i prolungamenti dei raggi formano l'immagine virtuale, diritta e più grande, a 25 centimetri.` };
	if (askP) {
		const answer = choiceOf(rng, qOpt(p, 'cm')[0], [...qOpt(f, 'cm'), ...qOpt((25 * f) / (25 - f), 'cm'), ...qOpt(25 - f, 'cm')], [...qOpt(p * 1.3, 'cm'), ...qOpt(p * 0.7, 'cm')]);
		return {
			prompt: "Trova dove va messo l'oggetto.",
			problem: textBlock(`Con ${lens} vuoi vedere l'immagine di un francobollo a $25\\,\\text{cm}$ dalla lente, dalla parte del francobollo. A che distanza dalla lente lo metti?`),
			solution: `p \\approx ${qOpt(p, 'cm')[0].latex}`,
			steps: [...steps, t("Con due cifre significative. L'oggetto sta poco più vicino del fuoco.")],
			answer,
			params: { case: byPower ? 'distanza, potere' : 'distanza', f },
			solutionScene: sc,
		};
	}
	const opt = (x: number): ChoiceOption[] => {
		const s = roundSig(x, 2);
		return s === null ? [] : [{ latex: `G = ${decTex(s)}`, values: [s] }];
	};
	const answer = choiceOf(rng, opt(G)[0], [...opt(-G), ...opt(p / 25), ...opt(f / 25 + 1)], [...opt(G + 2), ...opt(G * 2)]);
	return {
		prompt: "Trova l'ingrandimento.",
		problem: textBlock(`Con ${lens} guardi un francobollo, messo in modo che l'immagine si formi a $25\\,\\text{cm}$ dalla lente, dalla parte del francobollo. Quanto vale l'ingrandimento $G$?`),
		solution: `G = ${opt(G)[0].latex.replace('G = ', '')}`,
		steps: [...steps, `G = -\\frac{q}{p} = \\frac{25}{${decTex(p.toFixed(3))}} = ${decTex(String(Number(G.toFixed(3))))}`, t("G è positivo: l'immagine è diritta.")],
		answer,
		params: { case: byPower ? 'ingrandimento, potere' : 'ingrandimento', f },
		solutionScene: sc,
	};
}

// ---------------------------------------------------------------------------
// Level 6: the power of the eye

function level6(rng: Rng): Built {
	const d = rng.pick([0.2, 0.25, 0.4, 0.5, 0.8, 1, 2]);
	const dT = d < 1 ? `${plain(d * 100)}\\,\\text{cm}` : `${metres(d)}\\,\\text{m}`;
	const P = 1 / d + 1 / 0.017;
	const answer = choiceOf(rng, qOpt(P, 'D')[0], [...qOpt(1 / 0.017, 'D'), ...qOpt(1 / 0.017 - 1 / d, 'D'), ...qOpt(1 / (d + 0.017), 'D'), ...qOpt(1 / (d * 100) + 1 / 1.7, 'D')], [...qOpt(P + 5, 'D')]);
	if (roundSig(P, 2) === roundSig(1 / 0.017, 2)) throw new Error('resample');
	return {
		prompt: "Trova il potere dell'occhio.",
		problem: textBlock(`Nel modello semplificato della lezione la lente dell'occhio sta a $1{,}7\\,\\text{cm}$ dalla retina. Quanto vale il potere dell'occhio mentre guarda nitido un oggetto a $${dT}$?`),
		solution: `P \\approx ${qOpt(P, 'D')[0].latex}`,
		steps: [t(`Le distanze in metri: p = ${metres(d).replace('{,}', ',')} m, q = 0,017 m.`), `P = \\frac{1}{p} + \\frac{1}{q} = \\frac{1}{${metres(d)}} + \\frac{1}{0{,}017} = ${decTex((1 / d).toFixed(2))} + ${decTex((1 / 0.017).toFixed(2))} = ${decTex(P.toFixed(2))}\\ldots\\,\\text{D}`, t('Con due cifre significative, come 1,7 cm.')],
		answer,
		params: { case: 'occhio', d },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 1000; attempt++) {
		let b: Built;
		try {
			b = make(rng);
		} catch {
			continue;
		}
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params, ...(b.solutionScene ? { solutionScene: b.solutionScene } : {}) };
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	if (new Set(a.options.map((o) => Number(o.values[0]))).size !== 4) v.push('due opzioni con lo stesso numero');
	return v;
}

export const fisStrumentiOttici: Generator = {
	id: ID,
	title: "L'occhio e gli strumenti ottici",
	levels: {
		1: { label: 'Cannocchiale e microscopio', constraints: ['G = f_ob/f_oc, lunghezza f_ob + f_oc', 'microscopio: prodotto degli ingrandimenti'] },
		2: { label: 'Le lenti per la miopia', constraints: ['P = -1/d_R, con d_R in metri'] },
		3: { label: "Le lenti per l'ipermetropia", constraints: ['P = 1/0,25 m - 1/d_P'] },
		4: { label: 'La macchina fotografica', constraints: ['distanza obiettivo-sensore', 'o spostamento dalla messa a fuoco all’infinito'] },
		5: { label: "La lente d'ingrandimento", constraints: ['immagine virtuale a 25 cm', "distanza dell'oggetto o ingrandimento"] },
		6: { label: "Il potere dell'occhio", constraints: ['lente a 1,7 cm dalla retina', 'P = 1/p + 1/q'] },
	},
	generate,
	check,
};

export default fisStrumentiOttici;
