/**
 * Corpi collegati e tensione dei fili. Spec: specs/exercises/fis-corpi-collegati.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/55-fis-corpi-collegati.md), each one step harder: two
 * carts on a smooth floor pulled by a force, the acceleration F/(m1 + m2), then the tension m2 F/(m1 + m2); a cart on a
 * smooth table pulled by a hanging mass over a pulley, the acceleration m2 g/(m1 + m2), then the tension
 * m1 m2 g/(m1 + m2); the same with kinetic friction on the table, (m2 − μd m1) g/(m1 + m2); Atwood's machine, the
 * acceleration (m2 − m1) g/(m1 + m2) or the tension 2 m1 m2 g/(m1 + m2). g = 9,8 m/s², masses with two significant
 * figures, answers with two, never too close to a rounding boundary. Distractors from the lesson's warnings: the
 * tension taken for the pulling force or for the hanging weight, the force divided by one mass only.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, decTex, t } from '../vettori';
import { type Built, checkCommon, generateWith, lab, r2 } from '../fisica-equilibrio';
import { G, coeffOf, cut4, datum, fallU, optU, optsU, pu, qu, r2p } from '../fis-forze-movimento';

export const ID = 'fis-corpi-collegati';

type Kind = 'traino' | 'tavolo' | 'atwood';
function scene(kind: Kind, m1: string, m2: string, alt: string, extra: Record<string, unknown> = {}): SceneRef {
	return { type: 'corpi-collegati', data: { tipo: kind, m1: `${lab(m1)} kg`, m2: `${lab(m2)} kg`, ...extra }, alt };
}

/** Two different masses of two significant figures, 1,1 to 9,9 kg. */
function masses(rng: Rng): [string, string] {
	for (;;) {
		const a = datum(rng, 'small'), b = datum(rng, 'small');
		if (a !== b) return [a, b];
	}
}

const kg = (s: string) => qu(s, 'kg');

// ---------------------------------------------------------------------------
// Levels 1 and 2: two carts pulled on a smooth floor

function towed(rng: Rng, askT: boolean): Built {
	for (;;) {
		const [m1, m2] = masses(rng);
		const F = datum(rng, 'big');
		const M1 = Number(m1), M2 = Number(m2), f = Number(F);
		const a = f / (M1 + M2);
		const T = M2 * a;
		const exact = askT ? T : a;
		const ans = r2(exact);
		if (ans === null || exact < 0.1) continue;
		const text = `Due carrelli, di ${pu(m1, 'kg')} e ${pu(m2, 'kg')}, sono collegati da un filo su un piano orizzontale liscio. Il carrello di ${pu(m1, 'kg')} è tirato da una forza orizzontale di ${pu(F, 'N')}. ${askT ? 'Quanto vale la tensione del filo?' : "Quanto vale l'accelerazione dei carrelli?"}`;
		const aStep = `a = \\dfrac{F}{m_1 + m_2} = \\dfrac{${qu(F, 'N')}}{${kg(m1)} + ${kg(m2)}} = ${cut4(a)}\\,\\text{m/s}^2`;
		return {
			prompt: askT ? 'Trova la tensione del filo.' : "Trova l'accelerazione.",
			problem: textBlock(text),
			solution: askT ? `T \\approx ${qu(ans, 'N')}` : `a \\approx ${qu(ans, 'm/s2')}`,
			steps: askT
				? [t('La forza accelera tutti e due i carrelli:'), aStep, t('Il filo tira il carrello di dietro, e solo quello:'), `T = m_2\\,a = ${kg(m2)} \\cdot ${cut4(a)}\\,\\text{m/s}^2 = ${cut4(T)}\\,\\text{N} \\approx ${qu(ans, 'N')}`]
				: [t('La forza accelera tutti e due i carrelli, cioè la massa totale:'), `${aStep} \\approx ${qu(ans, 'm/s2')}`],
			// a: F on the pulled cart only, F on the other cart, the weights for the masses; T: the pulling force, the pulled cart's share, half
			answer: askT
				? choiceOf(rng, optU(ans, 'N'), optsU([F, r2p(M1 * a), r2p(f / 2)], 'N'), fallU(exact, 'N'))
				: choiceOf(rng, optU(ans, 'm/s2'), optsU([r2p(f / M1), r2p(f / M2), r2p(f / ((M1 + M2) * G))], 'm/s2'), fallU(exact, 'm/s2')),
			params: { m1, m2, F },
			scene: scene('traino', m1, m2, `Due carrelli di ${lab(m1)} e ${lab(m2)} chilogrammi collegati da un filo; quello di ${lab(m1)} chilogrammi è tirato da una forza di ${F} newton.`, { F: `${F} N` }),
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 3, 4 and 5: the cart on the table and the hanging mass

const TABLE = (m1: string, m2: string, rough: string | null) =>
	`${rough ? 'Un blocco' : 'Un carrello'} di ${pu(m1, 'kg')} sta su un tavolo orizzontale${rough ? '' : ' liscio'} ed è collegato da un filo, attraverso una carrucola sul bordo del tavolo, a un pesetto di ${pu(m2, 'kg')} che pende nel vuoto.`;

function table(rng: Rng, askT: boolean, rough: boolean): Built {
	for (;;) {
		const [m1, m2] = masses(rng);
		const M1 = Number(m1), M2 = Number(m2);
		const mu = rough ? coeffOf(rng, 10, 60) : null;
		const k = mu ? Number(mu) : 0;
		if (rough && M2 < 1.2 * k * M1) continue;
		const a = ((M2 - k * M1) * G) / (M1 + M2);
		const T = M2 * (G - a);
		const exact = askT ? T : a;
		const ans = r2(exact);
		if (ans === null || exact < (rough ? 0.2 : 0.1)) continue;
		const intro = TABLE(m1, m2, mu);
		const q = rough ? `Tra blocco e tavolo $\\mu_d = ${decTex(mu!)}$, e il blocco scivola. Quanto vale l'accelerazione?` : askT ? 'Quanto vale la tensione del filo?' : "Quanto vale l'accelerazione del carrello?";
		const alt = `${rough ? 'Un blocco' : 'Un carrello'} di ${lab(m1)} chilogrammi su un tavolo, collegato attraverso una carrucola a un pesetto di ${lab(m2)} chilogrammi.`;
		const steps = rough
			? [
					t("Blocco: T meno l'attrito uguale m1 a. Pesetto: m2 g meno T uguale m2 a. Sommando:"),
					`a = \\dfrac{m_2 - \\mu_d\\,m_1}{m_1 + m_2}\\,g = \\dfrac{${kg(m2)} - ${decTex(mu!)} \\cdot ${kg(m1)}}{${kg(m1)} + ${kg(m2)}} \\cdot 9{,}8\\,\\text{m/s}^2 = ${cut4(a)}\\,\\text{m/s}^2 \\approx ${qu(ans, 'm/s2')}`,
				]
			: askT
				? [
						`a = \\dfrac{m_2}{m_1 + m_2}\\,g = ${cut4(a)}\\,\\text{m/s}^2`,
						t('Il filo è la sola forza che accelera il carrello:'),
						`T = m_1\\,a = ${kg(m1)} \\cdot ${cut4(a)}\\,\\text{m/s}^2 = ${cut4(T)}\\,\\text{N} \\approx ${qu(ans, 'N')}`,
					]
				: [
						t('Il peso del pesetto accelera tutte e due le masse:'),
						`a = \\dfrac{m_2}{m_1 + m_2}\\,g = \\dfrac{${kg(m2)}}{${kg(m1)} + ${kg(m2)}} \\cdot 9{,}8\\,\\text{m/s}^2 = ${cut4(a)}\\,\\text{m/s}^2 \\approx ${qu(ans, 'm/s2')}`,
					];
		const answer = rough
			? // friction added; the pesetto's mass left out; friction forgotten
				choiceOf(rng, optU(ans, 'm/s2'), optsU([r2p(((M2 + k * M1) * G) / (M1 + M2)), r2p(((M2 - k * M1) * G) / M1), r2p((M2 * G) / (M1 + M2))], 'm/s2'), fallU(exact, 'm/s2'))
			: askT
				? // the hanging weight; the cart's weight; the pesetto's share m2 a
					choiceOf(rng, optU(ans, 'N'), optsU([r2p(M2 * G), r2p(M1 * G), r2p(M2 * a)], 'N'), fallU(exact, 'N'))
				: // free fall; the pesetto's mass left out (T = m2 g); the masses swapped
					choiceOf(rng, optU(ans, 'm/s2'), optsU(['9.8', r2p((M2 * G) / M1), r2p((M1 * G) / (M1 + M2))], 'm/s2'), fallU(exact, 'm/s2'));
		return {
			prompt: askT ? 'Trova la tensione del filo.' : "Trova l'accelerazione.",
			problem: textBlock(`${intro} ${q}`),
			solution: askT ? `T \\approx ${qu(ans, 'N')}` : `a \\approx ${qu(ans, 'm/s2')}`,
			steps,
			answer,
			params: { m1, m2, mud: mu },
			scene: scene('tavolo', m1, m2, alt),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: Atwood's machine

function atwood(rng: Rng): Built {
	const askT = rng.next() < 0.5;
	for (;;) {
		const [x, y] = masses(rng);
		const [m1, m2] = Number(x) < Number(y) ? [x, y] : [y, x];
		const M1 = Number(m1), M2 = Number(m2);
		const a = ((M2 - M1) * G) / (M1 + M2);
		const T = (2 * M1 * M2 * G) / (M1 + M2);
		const exact = askT ? T : a;
		const ans = r2(exact);
		if (ans === null || exact < 0.1) continue;
		return {
			prompt: askT ? 'Trova la tensione del filo.' : "Trova l'accelerazione.",
			problem: textBlock(`Una macchina di Atwood porta due masse di ${pu(m1, 'kg')} e ${pu(m2, 'kg')}, lasciate libere da ferme. ${askT ? 'Quanto vale la tensione del filo?' : "Quanto vale l'accelerazione delle masse?"}`),
			solution: askT ? `T \\approx ${qu(ans, 'N')}` : `a \\approx ${qu(ans, 'm/s2')}`,
			steps: askT
				? [t('Massa che scende: m2 g meno T uguale m2 a. Massa che sale: T meno m1 g uguale m1 a. Da qui:'), `T = \\dfrac{2\\,m_1 m_2}{m_1 + m_2}\\,g = \\dfrac{2 \\cdot ${decTex(m1)} \\cdot ${decTex(m2)}}{${decTex(m1)} + ${decTex(m2)}} \\cdot 9{,}8\\,\\text{N} = ${cut4(T)}\\,\\text{N} \\approx ${qu(ans, 'N')}`]
				: [t('La differenza dei pesi accelera tutte e due le masse:'), `a = \\dfrac{m_2 - m_1}{m_1 + m_2}\\,g = \\dfrac{${kg(m2)} - ${kg(m1)}}{${kg(m1)} + ${kg(m2)}} \\cdot 9{,}8\\,\\text{m/s}^2 = ${cut4(a)}\\,\\text{m/s}^2 \\approx ${qu(ans, 'm/s2')}`],
			// T: the lighter weight, the heavier weight, the mean of the weights; a: over one mass only, over the other, g
			answer: askT
				? choiceOf(rng, optU(ans, 'N'), optsU([r2p(M1 * G), r2p(M2 * G), r2p(((M1 + M2) * G) / 2)], 'N'), fallU(exact, 'N'))
				: choiceOf(rng, optU(ans, 'm/s2'), optsU([r2p(((M2 - M1) * G) / M2), r2p(((M2 - M1) * G) / M1), '9.8'], 'm/s2'), fallU(exact, 'm/s2')),
			params: { case: askT ? 'tensione' : 'accelerazione', m1, m2 },
			scene: scene('atwood', m1, m2, `Una carrucola appesa al soffitto che porta due masse, di ${lab(m1)} e ${lab(m2)} chilogrammi.`),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: (rng) => towed(rng, false),
	2: (rng) => towed(rng, true),
	3: (rng) => table(rng, false, false),
	4: (rng) => table(rng, true, false),
	5: (rng) => table(rng, false, true),
	6: atwood,
};

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (!sample.scene) v.push('manca la scena');
	return v;
}

export const fisCorpiCollegati: Generator = {
	id: ID,
	title: 'Corpi collegati e tensione dei fili',
	levels: {
		1: { label: "L'accelerazione di due carrelli", constraints: ['piano liscio', 'la forza tira il primo carrello'] },
		2: { label: 'La tensione tra i carrelli', constraints: ['piano liscio', 'la tensione tira il secondo carrello'] },
		3: { label: 'Il pesetto e la carrucola', constraints: ['tavolo liscio', "l'accelerazione"] },
		4: { label: 'La tensione del filo appeso', constraints: ['tavolo liscio', 'la tensione, più piccola del peso del pesetto'] },
		5: { label: "Con l'attrito sul tavolo", constraints: ['il pesetto pesa almeno 1,2 volte μd m1 g', "l'accelerazione"] },
		6: { label: 'La macchina di Atwood', constraints: ["accelerazione o tensione, metà ciascuna"] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisCorpiCollegati;
