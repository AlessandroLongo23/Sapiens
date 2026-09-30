/**
 * Le lenti sottili. Spec: specs/exercises/fis-lenti.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/36-fis-lenti.md): the dioptric power from the focal length
 * and back; the real image of a converging lens (q from p and f); the magnification and the height of the image; the
 * virtual image of an object inside the focal length; the image of a diverging lens; the focal length from the two
 * distances. Signs as in the lesson and in "Gli specchi sferici": p and q positive when real, q negative for a virtual
 * image, f positive for a converging lens and negative for a diverging one; G = −q/p. The numbers are built backwards
 * so that q and f are whole centimetres. Distractors are the lesson's mistakes: f in centimetres in the dioptres, the
 * sign of the diverging lens forgotten, 1/q not inverted, the distances subtracted, G without the minus.
 * The scene `lente-oggetto` draws the lens, its foci and the object; rays and image go in the solution scene.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { BANNED, choiceOf, decTex, roundSig, t } from '../vettori';

export const ID = 'fis-lenti';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
	scene?: SceneRef;
	solutionScene?: SceneRef;
}

/** A number written the Italian way, without useless zeros: -12.5 → "-12{,}5". */
const dec = (x: number) => decTex(String(Number(x.toFixed(4))));
const cm = (x: number) => `${dec(x)}\\,\\text{cm}`;
const cmOpt = (x: number): ChoiceOption => ({ latex: cm(x), values: [String(Number(x.toFixed(4)))] });
const qs = (x: number | null): ChoiceOption[] => (x === null || !Number.isFinite(x) ? [] : [cmOpt(x)]);

function sceneRef(alt: string, d: { lente: 'convergente' | 'divergente'; p: number; f?: number; q?: number; G?: number; raggi?: boolean }): SceneRef {
	return { type: 'lente-oggetto', data: d, alt };
}
const altOf = (kind: string, p: number, f: number | null) => `Una lente ${kind} sull'asse ottico${f === null ? '' : ` con i due fuochi a ${Math.abs(f)} centimetri`} e un oggetto a ${p} centimetri dalla lente.`;

// ---------------------------------------------------------------------------
// Level 1: the dioptric power

const FOCALS = [5, 10, 12.5, 20, 25, 40, 50, 125, 200, 250]; // cm: powers 20, 10, 8,0, 5,0, 4,0, 2,5, 2,0, 0,80, 0,50, 0,40 D

/** A power in dioptres with two significant figures (20 D, 8,0 D, 0,50 D), with its sign. */
function dOpt(x: number): ChoiceOption[] {
	const s = roundSig(x, 2);
	return s === null ? [] : [{ latex: `${decTex(s)}\\,\\text{D}`, values: [s] }];
}

function level1(rng: Rng): Built {
	const fAbs = rng.pick(FOCALS);
	const conv = rng.next() < 0.6;
	const f = conv ? fAbs : -fAbs;
	const P = 100 / f;
	const kind = conv ? 'convergente' : 'divergente';
	if (rng.next() < 0.5) {
		const right = dOpt(P)[0];
		const answer = choiceOf(rng, right, [...dOpt(1 / f), ...dOpt(-P), ...dOpt(f / 100)], [...dOpt(P * 2), ...dOpt(P / 2)]);
		return {
			prompt: 'Trova il potere diottrico.',
			problem: textBlock(`Una lente ${kind} ha la distanza focale di $${cm(fAbs)}$. Quanto vale il suo potere diottrico?`),
			solution: `P = ${right.latex}`,
			steps: [t(`La distanza focale va in metri, con il segno: f = ${conv ? '' : '-'}${String(fAbs / 100).replace('.', ',')} m.`), `P = \\frac{1}{f} = \\frac{1}{${dec(f / 100)}\\,\\text{m}} = ${right.latex}`, t(conv ? 'Lente convergente: potere positivo.' : 'Lente divergente: potere negativo.')],
			answer,
			params: { case: 'potere', f },
		};
	}
	// From the power to the focal length, in centimetres.
	const Ps = roundSig(P, 2)!;
	const answer = choiceOf(rng, cmOpt(f), [cmOpt(-f), cmOpt(f / 100), cmOpt(100 * P)].filter((o) => o.values[0] !== String(f)), [cmOpt(2 * f), cmOpt(f / 2)]);
	return {
		prompt: 'Trova la distanza focale.',
		problem: textBlock(`Una lente ha il potere di $${decTex(Ps)}\\,\\text{D}$. Quanto vale la sua distanza focale, in centimetri?`),
		solution: `f = ${cm(f)}`,
		steps: [`f = \\frac{1}{P} = \\frac{1}{${decTex(Ps)}\\,\\text{D}} = ${dec(f / 100)}\\,\\text{m} = ${cm(f)}`, t(conv ? 'Il potere è positivo: la lente è convergente.' : 'Il segno meno dice che la lente è divergente.')],
		answer,
		params: { case: 'focale', P: Ps },
	};
}

// ---------------------------------------------------------------------------
// Levels 2 and 3: the real image of a converging lens

function realCase(rng: Rng): { f: number; p: number; q: number } {
	for (;;) {
		const f = rng.int(5, 30);
		const divs: number[] = [];
		for (let d = 1; d <= f * f; d++) if ((f * f) % d === 0 && f + d <= 100 && f + (f * f) / d <= 100 && d * d !== f * f) divs.push(d);
		if (!divs.length) continue;
		const d = rng.pick(divs);
		return { f, p: f + d, q: f + (f * f) / d };
	}
}

function level2(rng: Rng): Built {
	const { f, p, q } = realCase(rng);
	const inv = 1 / f - 1 / p;
	const mistakes = [...qs(Math.round(((p * f) / (p + f)) * 10) / 10), ...qs(p - f), ...qs(Number(roundSig(inv, 2)))];
	const answer = choiceOf(rng, cmOpt(q), mistakes.filter((o) => o.values[0] !== String(q)), [cmOpt(q + f), cmOpt(2 * q)]);
	const where = p > 2 * f ? 'oltre il doppio della distanza focale' : p === 2 * f ? 'a 2f' : 'tra F e 2F';
	return {
		prompt: "Trova la distanza dell'immagine.",
		problem: textBlock(`Un oggetto sta a $${cm(p)}$ da una lente convergente con distanza focale $${cm(f)}$. A che distanza dalla lente si forma l'immagine?`),
		solution: `q = ${cm(q)}`,
		steps: [t("Dall'equazione delle lenti:"), `\\frac{1}{q} = \\frac{1}{f} - \\frac{1}{p} = \\frac{1}{${f}} - \\frac{1}{${p}} = \\frac{${p - f}}{${p * f}}`, `q = \\frac{${p * f}}{${p - f}} = ${cm(q)}`, t(`q è positiva: l'immagine è reale, dall'altra parte della lente (l'oggetto sta ${where}).`)],
		answer,
		params: { case: p > 2 * f ? 'oltre 2F' : 'tra F e 2F', f, p },
		scene: sceneRef(altOf('convergente', p, f), { lente: 'convergente', p, f }),
		solutionScene: sceneRef(`${altOf('convergente', p, f)} I raggi notevoli si incontrano a ${q} centimetri dietro la lente, dove si forma l'immagine reale e capovolta.`, { lente: 'convergente', p, f, q, G: -q / p, raggi: true }),
	};
}

const G_SET = [0.2, 0.25, 0.4, 0.5, 2, 2.5, 3, 4, 5];

function level3(rng: Rng): Built {
	for (;;) {
		const g = rng.pick(G_SET); // |G|, image real so G = -g
		const f = rng.int(4, 30);
		const p = (f * (g + 1)) / g, q = f * (g + 1);
		if (!Number.isInteger(p) || !Number.isInteger(q) || p > 100 || q > 100) continue;
		const G = -g;
		const Gs = roundSig(G, 2)!;
		const askH = rng.next() < 0.5;
		if (!askH) {
			const gOpt = (x: number): ChoiceOption[] => {
				const s = roundSig(x, 2);
				return s === null ? [] : [{ latex: `G = ${decTex(s)}`, values: [s] }];
			};
			const answer = choiceOf(rng, gOpt(G)[0], [...gOpt(g), ...gOpt(-1 / g), ...gOpt(1 / g)], [...gOpt(G * 2), ...gOpt(G / 2)]);
			return {
				prompt: "Trova l'ingrandimento.",
				problem: textBlock(`Una lente convergente con distanza focale $${cm(f)}$ forma l'immagine di un oggetto posto a $${cm(p)}$ dalla lente. Quanto vale l'ingrandimento $G$?`),
				solution: `G = ${decTex(Gs)}`,
				steps: [`\\frac{1}{q} = \\frac{1}{${f}} - \\frac{1}{${p}} \\quad\\Rightarrow\\quad q = ${cm(q)}`, `G = -\\frac{q}{p} = -\\frac{${q}}{${p}} = ${decTex(Gs)}`, t(`G è negativo: l'immagine è capovolta, e ${g > 1 ? 'più grande' : 'più piccola'} dell'oggetto.`)],
				answer,
				params: { case: 'ingrandimento', f, p },
				scene: sceneRef(altOf('convergente', p, f), { lente: 'convergente', p, f }),
				solutionScene: sceneRef(`${altOf('convergente', p, f)} L'immagine si forma a ${q} centimetri ed è capovolta.`, { lente: 'convergente', p, f, q, G, raggi: true }),
			};
		}
		const h = rng.pick([1.5, 2, 2.5, 3, 4, 5, 6, 8]);
		const hp = G * h;
		if (roundSig(hp, 2) === null) continue;
		const hOpt = (x: number): ChoiceOption[] => {
			const s = roundSig(x, 2);
			return s === null ? [] : [{ latex: `${decTex(s)}\\,\\text{cm}`, values: [s] }];
		};
		const answer = choiceOf(rng, hOpt(hp)[0], [...hOpt(-hp), ...hOpt(h / G), ...hOpt(-h / g)], [...hOpt(hp * 2), ...hOpt(hp + 1)]);
		const hS = roundSig(h, 2)!;
		return {
			prompt: "Trova l'altezza dell'immagine.",
			problem: textBlock(`Un oggetto alto $${decTex(hS)}\\,\\text{cm}$ sta a $${cm(p)}$ da una lente convergente con distanza focale $${cm(f)}$. Quanto è alta l'immagine? Scrivi il segno meno se è capovolta.`),
			solution: `h' = ${hOpt(hp)[0].latex}`,
			steps: [`q = \\frac{${p} \\cdot ${f}}{${p} - ${f}} = ${cm(q)}`, `G = -\\frac{q}{p} = -\\frac{${q}}{${p}} = ${decTex(Gs)}`, `h' = G \\cdot h = ${decTex(Gs)} \\cdot ${decTex(hS)}\\,\\text{cm} = ${hOpt(hp)[0].latex}`, t("Il segno meno dice che l'immagine è capovolta.")],
			answer,
			params: { case: 'altezza', f, p, h },
			scene: sceneRef(altOf('convergente', p, f), { lente: 'convergente', p, f }),
			solutionScene: sceneRef(`${altOf('convergente', p, f)} L'immagine si forma a ${q} centimetri ed è capovolta.`, { lente: 'convergente', p, f, q, G, raggi: true }),
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: virtual images

function level4(rng: Rng): Built {
	for (;;) {
		const f = rng.int(6, 30);
		const d = rng.int(1, f - 1);
		const p = f - d;
		if ((p * f) % d !== 0 || (p * f) / d > 100 || p < 2) continue;
		const q = -(p * f) / d;
		const mistakes = [cmOpt(-q), ...qs(Math.round(((p * f) / (p + f)) * 10) / 10), cmOpt(f - p), cmOpt(p - f)];
		const answer = choiceOf(rng, cmOpt(q), mistakes.filter((o) => o.values[0] !== String(q)), [cmOpt(q - f), cmOpt(2 * q)]);
		const G = -q / p;
		return {
			prompt: "Trova la distanza dell'immagine.",
			problem: textBlock(`Un oggetto sta a $${cm(p)}$ da una lente convergente con distanza focale $${cm(f)}$. Quanto vale $q$? Scrivi il segno meno se l'immagine è virtuale.`),
			solution: `q = ${cm(q)}`,
			steps: [`\\frac{1}{q} = \\frac{1}{${f}} - \\frac{1}{${p}} = \\frac{${p} - ${f}}{${p * f}} = -\\frac{${d}}{${p * f}}`, `q = ${cm(q)}`, t(`q è negativa: l'oggetto sta dentro la distanza focale, e l'immagine è virtuale, dalla parte dell'oggetto, diritta e ${G > 1 ? 'più grande' : 'più piccola'}.`)],
			answer,
			params: { case: 'virtuale', f, p },
			scene: sceneRef(altOf('convergente', p, f), { lente: 'convergente', p, f }),
			solutionScene: sceneRef(`${altOf('convergente', p, f)} I prolungamenti dei raggi si incontrano a ${-q} centimetri dalla lente, dalla parte dell'oggetto: l'immagine è virtuale e diritta.`, { lente: 'convergente', p, f, q, G, raggi: true }),
		};
	}
}

function level5(rng: Rng): Built {
	for (;;) {
		const F = rng.int(5, 30);
		const p = rng.int(3, 100);
		if ((p * F) % (p + F) !== 0) continue;
		const q = -(p * F) / (p + F);
		const f = -F;
		const forgot = p === F ? null : (p * F) / (p - F); // the sign of f forgotten
		const mistakes = [...qs(forgot === null ? null : Math.round(forgot * 10) / 10), cmOpt(-q), cmOpt(-(p + F)), cmOpt(p - F)];
		const answer = choiceOf(rng, cmOpt(q), mistakes.filter((o) => o.values[0] !== String(q)), [cmOpt(q - F), cmOpt(2 * q)]);
		return {
			prompt: "Trova la distanza dell'immagine.",
			problem: textBlock(`Un oggetto sta a $${cm(p)}$ da una lente divergente con la distanza focale di $${cm(F)}$. Quanto vale $q$? Scrivi il segno meno se l'immagine è virtuale.`),
			solution: `q = ${cm(q)}`,
			steps: [t(`La lente è divergente: f = -${F} cm.`), `\\frac{1}{q} = \\frac{1}{f} - \\frac{1}{p} = -\\frac{1}{${F}} - \\frac{1}{${p}} = -\\frac{${p + F}}{${p * F}}`, `q = ${cm(q)}`, t("L'immagine è virtuale, diritta e più piccola, come sempre con una lente divergente.")],
			answer,
			params: { case: 'divergente', f, p },
			scene: sceneRef(altOf('divergente', p, f), { lente: 'divergente', p, f }),
			solutionScene: sceneRef(`${altOf('divergente', p, f)} L'immagine virtuale si forma a ${-q} centimetri dalla lente, dalla parte dell'oggetto.`, { lente: 'divergente', p, f, q, G: -q / p, raggi: true }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the focal length from the two distances

function level6(rng: Rng): Built {
	// The case first, then numbers for it: resampling the case too would favour the one with more solutions.
	const kind = rng.pick(['reale', 'virtuale convergente', 'virtuale divergente'] as const);
	for (;;) {
		const p = rng.int(4, 80);
		let q: number;
		if (kind === 'reale') q = rng.int(4, 100);
		else if (kind === 'virtuale convergente') q = -rng.int(p + 1, 100);
		else q = -rng.int(2, p - 1);
		if (p + q === 0 || (p * q) % (p + q) !== 0) continue;
		const f = (p * q) / (p + q);
		if (Math.abs(f) < 3 || Math.abs(f) > 60) continue;
		const mistakes = [cmOpt(-f), cmOpt(p + q), ...qs(p === q ? null : Math.round(((p * q) / (p - q)) * 10) / 10)];
		const answer = choiceOf(rng, cmOpt(f), mistakes.filter((o) => o.values[0] !== String(f)), [cmOpt(f + 5), cmOpt(2 * f)]);
		const where = q > 0 ? `si forma un'immagine reale a $${cm(q)}$ dalla lente, dall'altra parte` : `si vede un'immagine virtuale a $${cm(-q)}$ dalla lente, dalla parte dell'oggetto`;
		const lens = f > 0 ? 'convergente' : 'divergente';
		return {
			prompt: 'Trova la distanza focale.',
			problem: textBlock(`Un oggetto sta a $${cm(p)}$ da una lente, e ${where}. Quanto vale la distanza focale della lente, con il suo segno?`),
			solution: `f = ${cm(f)}`,
			steps: [t(q > 0 ? "L'immagine è reale: q è positiva." : "L'immagine è virtuale: q è negativa."), `\\frac{1}{f} = \\frac{1}{p} + \\frac{1}{q} = \\frac{1}{${p}} ${q > 0 ? '+' : '-'} \\frac{1}{${Math.abs(q)}} = \\frac{${p + q}}{${p * q}}`, `f = ${cm(f)}`, t(`f è ${f > 0 ? 'positiva: la lente è convergente' : 'negativa: la lente è divergente'}.`)],
			answer,
			params: { case: kind, p, q },
			scene: sceneRef(`Una lente sull'asse ottico, un oggetto a ${p} centimetri e la sua immagine ${q > 0 ? 'reale' : 'virtuale'} a ${Math.abs(q)} centimetri.`, { lente: lens, p, q, G: -q / p }),
			solutionScene: sceneRef(`Una lente ${lens} con i fuochi a ${Math.abs(f)} centimetri, l'oggetto a ${p} centimetri e l'immagine a ${Math.abs(q)} centimetri, con i raggi notevoli.`, { lente: lens, p, f, q, G: -q / p, raggi: true }),
		};
	}
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
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params, ...(b.scene ? { scene: b.scene } : {}), ...(b.solutionScene ? { solutionScene: b.solutionScene } : {}) };
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
	if (sample.level > 1 && (!sample.scene || !sample.solutionScene)) v.push('manca la scena');
	return v;
}

export const fisLenti: Generator = {
	id: ID,
	title: 'Le lenti sottili',
	levels: {
		1: { label: 'Il potere diottrico', constraints: ['P = 1/f con f in metri', 'lenti convergenti e divergenti'] },
		2: { label: "L'immagine reale", constraints: ['lente convergente, oggetto oltre il fuoco', 'q in centimetri interi'] },
		3: { label: "L'ingrandimento", constraints: ['G = -q/p', "o l'altezza dell'immagine con il segno"] },
		4: { label: "L'immagine virtuale", constraints: ['oggetto dentro la distanza focale', 'q negativa'] },
		5: { label: 'La lente divergente', constraints: ['f negativa', 'immagine virtuale'] },
		6: { label: 'Dalle distanze alla distanza focale', constraints: ['immagine reale o virtuale', 'f con il segno'] },
	},
	generate,
	check,
};

export default fisLenti;
