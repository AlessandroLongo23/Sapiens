/**
 * La forza elastica e la legge di Hooke. Spec: specs/exercises/fis-forza-elastica.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/18-fis-forza-elastica.md), each one step harder: the
 * force from k and the stretch in metres; the stretch from the force; a stretch in centimetres to convert (either
 * way); length and stretch (k from two lengths read on a ruler drawn in a scene, or the new length); k from a table of
 * measures; the stretch under a hanging mass. F = k Δl, g = 9,8 N/kg. Data with two significant figures, answers
 * rounded to two (k is exact, an integer), multiple choice with the unit in the option and the lesson's mistakes:
 * centimetres not converted, the length taken for the stretch, the mass taken for the force, the formula upside down.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { q } from '../rational';
import { type Built, type R, choiceFor, commonCheck, dec, fixed, generateWith, isTie, n, roundSig, sig, t, withUnit } from '../fisica-forze';

export const ID = 'fis-forza-elastica';

const G = q(98, 10);
const S2 = { kind: 'sig', s: 2 } as const;
const INT = { kind: 'int' } as const;
const u = (r: R, unit: string) => withUnit(sig(r, 2), unit);
const pu = (r: R, unit: string) => `$${u(r, unit)}$`;
const K = (k: number) => withUnit(String(k), 'N/m');
const pK = (k: number) => `$${K(k)}$`;

/** The elastic constants of the exercises, N/m. */
export const KS = [10, 20, 25, 40, 50, 80, 100, 120, 150, 200, 250, 300, 400, 500];

/** A stretch with two significant figures, in cm: 1,0 to 9,9 or 10 to 50. */
const stretchCm = (rng: Rng) => (rng.next() < 0.5 ? q(rng.int(10, 99), 10) : n(rng.int(10, 50)));
const cm2m = (x: R) => x.div(n(100));
const HOOKE = t('Legge di Hooke: ');

// ---------------------------------------------------------------------------
// Level 1: the force from k and the stretch in metres

function level1(rng: Rng): Built {
	for (;;) {
		const k = rng.pick(KS);
		const dl = cm2m(stretchCm(rng));
		const exact = dl.mul(n(k));
		if (exact.compare(q(1, 10)) < 0 || isTie(exact, 2)) continue;
		const F = roundSig(exact, 2);
		return {
			prompt: 'Calcola la forza.',
			problem: textBlock(`Una molla ha la costante elastica di ${pK(k)}. Quale forza serve per allungarla di ${pu(dl, 'm')}?`),
			solution: `F = ${u(F, 'N')}`,
			steps: [`${HOOKE} F = k \\cdot \\Delta l`, `F = ${K(k)} \\cdot ${u(dl, 'm')} = ${withUnit(dec(exact), 'N')}${exact.equals(F) ? '' : ` \\approx ${u(F, 'N')}`}`],
			answer: F,
			unit: 'N',
			format: S2,
			// k divided by the stretch; the stretch divided by k; the stretch taken in centimetres
			mistakes: [n(k).div(dl), dl.div(n(k)), exact.mul(n(100))],
			params: { case: 'forza', k, dl: dl.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the stretch from the force

function level2(rng: Rng): Built {
	for (;;) {
		const k = rng.pick(KS);
		const F = rng.next() < 0.6 ? q(rng.int(10, 99), 10) : n(rng.int(10, 99));
		const exact = F.div(n(k));
		if (exact.compare(q(1, 100)) < 0 || exact.compare(n(1)) >= 0 || isTie(exact, 2)) continue;
		const dl = roundSig(exact, 2);
		return {
			prompt: "Calcola l'allungamento.",
			problem: textBlock(`Una molla con la costante elastica di ${pK(k)} viene tirata con una forza di ${pu(F, 'N')}. Di quanto si allunga?`),
			solution: `\\Delta l = ${u(dl, 'm')}`,
			steps: [`${HOOKE} F = k \\cdot \\Delta l \\quad\\Rightarrow\\quad \\Delta l = \\dfrac{F}{k}`, `\\Delta l = \\dfrac{${u(F, 'N')}}{${K(k)}} ${exact.equals(dl) ? '=' : '\\approx'} ${u(dl, 'm')}`],
			answer: dl,
			unit: 'm',
			format: S2,
			// the product; k over F; the stretch in centimetres written as metres
			mistakes: [F.mul(n(k)), n(k).div(F), dl.mul(n(100))],
			params: { case: 'allungamento', k, F: F.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: centimetres and metres

function level3(rng: Rng): Built {
	for (;;) {
		const k = rng.pick(KS);
		if (rng.next() < 0.5) {
			const dlCm = stretchCm(rng);
			const exact = cm2m(dlCm).mul(n(k));
			if (exact.compare(q(1, 10)) < 0 || isTie(exact, 2)) continue;
			const F = roundSig(exact, 2);
			return {
				prompt: 'Calcola la forza.',
				problem: textBlock(`Una molla ha la costante elastica di ${pK(k)}. Quale forza serve per allungarla di ${pu(dlCm, 'cm')}?`),
				solution: `F = ${u(F, 'N')}`,
				steps: [
					`${t("La costante è in newton al metro: l'allungamento va in metri, ")} ${u(dlCm, 'cm')} = ${u(cm2m(dlCm), 'm')}`,
					`F = k \\cdot \\Delta l = ${K(k)} \\cdot ${u(cm2m(dlCm), 'm')} ${exact.equals(F) ? '=' : '\\approx'} ${u(F, 'N')}`,
				],
				answer: F,
				unit: 'N',
				format: S2,
				// centimetres not converted; converted with 10; k over the stretch
				mistakes: [dlCm.mul(n(k)), dlCm.mul(n(k)).div(n(10)), n(k).div(cm2m(dlCm))],
				params: { case: 'forza-cm', k, dl: dlCm.toString() },
			};
		}
		const F = q(rng.int(10, 99), 10);
		const exactM = F.div(n(k));
		const exact = exactM.mul(n(100));
		if (exact.compare(n(1)) < 0 || exact.compare(n(99)) > 0 || isTie(exact, 2)) continue;
		const dl = roundSig(exact, 2);
		return {
			prompt: "Calcola l'allungamento.",
			problem: textBlock(`Una molla con la costante elastica di ${pK(k)} viene tirata con una forza di ${pu(F, 'N')}. Di quanti centimetri si allunga?`),
			solution: `\\Delta l = ${u(dl, 'cm')}`,
			steps: [
				`\\Delta l = \\dfrac{F}{k} = \\dfrac{${u(F, 'N')}}{${K(k)}} = ${withUnit(dec(roundSig(exactM, 3)), 'm')}${exactM.equals(roundSig(exactM, 3)) ? '' : '\\ldots'}`,
				`${t('In centimetri si moltiplica per 100: ')} \\Delta l ${exact.equals(dl) ? '=' : '\\approx'} ${u(dl, 'cm')}`,
			],
			answer: dl,
			unit: 'cm',
			format: S2,
			// the metres written as centimetres; divided by 100 the wrong way; the product
			mistakes: [exactM, exactM.div(n(100)), F.mul(n(k))],
			params: { case: 'allungamento-cm', k, F: F.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: length and stretch

function level4(rng: Rng): Built {
	for (;;) {
		const k = rng.pick(KS);
		const l0 = rng.int(5, 20);
		const dl = rng.int(2, 15);
		const l = l0 + dl;
		if (l > 27) continue;
		const F = n(k).mul(q(dl, 100));
		if (F.compare(q(1, 10)) < 0 || F.compare(n(99)) > 0 || !roundSig(F, 2).equals(F)) continue;
		if (rng.next() < 0.55) {
			const righello = Math.ceil((l + 3) / 5) * 5;
			return {
				prompt: 'Trova la costante elastica.',
				problem: textBlock(
					`La figura mostra una molla a riposo, lunga $${withUnit(String(l0), 'cm')}$, e la stessa molla con un corpo appeso che la tira con una forza di ${pu(F, 'N')}: ora è lunga $${withUnit(String(l), 'cm')}$. Quanto vale la costante elastica?`,
				),
				solution: `k = ${K(k)}`,
				steps: [
					`\\Delta l = l - l_0 = ${l}\\,\\text{cm} - ${l0}\\,\\text{cm} = ${dl}\\,\\text{cm} = ${withUnit(fixed(q(dl, 100), 2), 'm')}`,
					`k = \\dfrac{F}{\\Delta l} = \\dfrac{${u(F, 'N')}}{${withUnit(fixed(q(dl, 100), 2), 'm')}} = ${K(k)}`,
				],
				answer: n(k),
				unit: 'N/m',
				format: INT,
				// the length taken for the stretch; the stretch in centimetres; the length at rest
				mistakes: [F.div(q(l, 100)), F.div(n(dl)), F.div(q(l0, 100))],
				params: { case: 'costante', l0, l, F: F.toString() },
				scene: { type: 'molla-righello', data: { l0, l, righello }, alt: `Un righello in centimetri e accanto la stessa molla due volte, appesa allo zero: a sinistra a riposo, lunga ${l0} centimetri; a destra con un corpo appeso, lunga ${l} centimetri` },
			};
		}
		return {
			prompt: 'Trova la lunghezza.',
			problem: textBlock(`Una molla lunga $${withUnit(String(l0), 'cm')}$ a riposo ha la costante elastica di ${pK(k)}. Quanto diventa lunga se la si tira con una forza di ${pu(F, 'N')}?`),
			solution: `l = ${withUnit(String(l), 'cm')}`,
			steps: [
				`\\Delta l = \\dfrac{F}{k} = \\dfrac{${u(F, 'N')}}{${K(k)}} = ${withUnit(fixed(q(dl, 100), 2), 'm')} = ${dl}\\,\\text{cm}`,
				`l = l_0 + \\Delta l = ${l0}\\,\\text{cm} + ${dl}\\,\\text{cm} = ${l}\\,\\text{cm}`,
			],
			answer: n(l),
			unit: 'cm',
			format: INT,
			// the stretch taken for the length; the length at rest minus the stretch; the stretch counted twice
			mistakes: [n(dl), n(Math.abs(l0 - dl)), n(l0 + 2 * dl)],
			params: { case: 'lunghezza', l0, k, F: F.toString() },
			solutionScene: { type: 'molla-righello', data: { l0, l, righello: Math.ceil((l + 3) / 5) * 5 }, alt: `La molla a riposo, lunga ${l0} centimetri, e tirata, lunga ${l} centimetri` },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: k from a table of measures

const BASES = [q(10, 10), q(15, 10), q(20, 10), q(25, 10), q(30, 10), q(40, 10), q(50, 10)];

function level5(rng: Rng): Built {
	for (;;) {
		const k = rng.pick(KS);
		const b = rng.pick(BASES);
		const dls = [1, 2, 3, 4].map((i) => b.mul(n(i)));
		const Fs = dls.map((d) => cm2m(d).mul(n(k)));
		// forces with one decimal: two would make the table wider than a phone
		if (Fs.some((F) => F.compare(q(1, 10)) < 0 || F.compare(n(99)) > 0 || !F.mul(n(10)).isInteger())) continue;
		const dF = 1;
		const dD = 1;
		const row = (name: string, unit: string, xs: R[], d: number) => `${name}\\,(\\text{${unit}}) & ${xs.map((x) => fixed(x, d)).join(' & ')}`;
		const table = `\\begin{array}{c|c|c|c|c} ${row('F', 'N', Fs, dF)} \\\\ \\hline ${row('\\Delta l', 'cm', dls, dD)} \\end{array}`;
		return {
			prompt: 'Trova la costante elastica.',
			problem: textBlock('Appendendo a una molla forze diverse si sono misurati questi allungamenti. Quanto vale la costante elastica?', 46, [table]),
			solution: `k = ${K(k)}`,
			steps: [
				t('Il rapporto tra forza e allungamento è lo stesso per tutte le coppie: la molla segue la legge di Hooke'),
				`k = \\dfrac{F}{\\Delta l} = \\dfrac{${withUnit(fixed(Fs[0], dF), 'N')}}{${withUnit(dec(cm2m(dls[0])), 'm')}} = ${K(k)}`,
			],
			answer: n(k),
			unit: 'N/m',
			format: INT,
			// k in newton per centimetre; the ratio upside down (cm per N); the last force alone
			mistakes: [q(k, 100), n(100).div(n(k)), Fs[3], n(2 * k)],
			params: { case: 'tabella', F: Fs.map(String), dl: dls.map(String) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: a mass hanging from the spring

function level6(rng: Rng): Built {
	for (;;) {
		const k = rng.pick(KS);
		const grams = rng.next() < 0.5;
		const m = grams ? q(10 * rng.int(5, 50), 1000) : q(rng.int(10, 99), 100);
		const P = m.mul(G);
		const exact = P.div(n(k)).mul(n(100));
		if (exact.compare(n(1)) < 0 || exact.compare(n(60)) > 0 || isTie(exact, 2)) continue;
		const dl = roundSig(exact, 2);
		const mText = grams ? `$${withUnit(String(m.mul(n(1000)).num), 'g')}$` : pu(m, 'kg');
		return {
			prompt: "Calcola l'allungamento.",
			problem: textBlock(`A una molla verticale con la costante elastica di ${pK(k)} si appende un corpo di ${mText}. Di quanti centimetri si allunga la molla?`),
			solution: `\\Delta l = ${u(dl, 'cm')}`,
			steps: [
				`${t('La forza che allunga la molla è il peso: ')} P = m \\cdot g = ${withUnit(dec(m), 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${withUnit(dec(P), 'N')}`,
				`\\Delta l = \\dfrac{P}{k} = \\dfrac{${withUnit(dec(P), 'N')}}{${K(k)}} ${exact.equals(dl) ? '=' : '\\approx'} ${u(dl, 'cm')}`,
			],
			answer: dl,
			unit: 'cm',
			format: S2,
			// the mass taken for the force; the metres written as centimetres; the weight times k
			mistakes: [m.div(n(k)).mul(n(100)), exact.div(n(100)), P.mul(n(k))],
			params: { case: grams ? 'grammi' : 'kg', k, m: m.toString() },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	const ans = sample.answer.kind === 'number' ? sample.answer.value : '';
	if (((sample.params.mistakes as string[]) ?? []).filter((m) => m !== ans).length < 2) v.push('meno di due errori tipici');
	return v;
}

export const fisForzaElastica: Generator = {
	id: ID,
	title: 'La forza elastica e la legge di Hooke',
	levels: {
		1: { label: 'La forza dalla legge di Hooke', constraints: ['k in N/m, allungamento in metri con due cifre significative'] },
		2: { label: "L'allungamento dalla forza", constraints: ['allungamento in metri, da 0,010 a 0,99 m'] },
		3: { label: 'Centimetri e metri', constraints: ["l'allungamento dato o chiesto in centimetri, metà ciascuno"] },
		4: { label: 'Lunghezza e allungamento', constraints: ['k da due lunghezze lette sul righello (55%), o la lunghezza finale (45%)', 'lunghezze intere in centimetri'] },
		5: { label: 'La costante da una tabella', constraints: ['quattro misure proporzionali, allungamenti in centimetri', 'k intero'] },
		6: { label: 'Una massa appesa', constraints: ['massa in grammi o in chilogrammi, metà ciascuno', 'allungamento in centimetri, da 1 a 60'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice: (sample, rng) => choiceFor(sample, rng, ID),
};

export default fisForzaElastica;
