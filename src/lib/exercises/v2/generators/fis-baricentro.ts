/**
 * Il baricentro e la stabilità dell'equilibrio. Spec: specs/exercises/fis-baricentro.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/25-fis-baricentro.md): the centre of mass of two bodies
 * at the ends of a light rod; of three bodies on a rod, x_G = Σ m x / Σ m; the kind of equilibrium (stable, unstable,
 * indifferent) of a body of the lesson; the angle past which a homogeneous block tips over, tan θ = w / h; how far a
 * plank can stick out over an edge, with a weight on it. Numbers are built backwards so the answers are exact
 * (distances with two significant figures), except the angle, rounded to the degree and never near a half.
 * Distractors from the lesson's warnings: the centre of mass near the lighter body, the positions averaged without
 * the masses, the tangent upside down, the plank's own weight or the weight on it forgotten. The scene `asta-forze`
 * draws the rod with its bodies, or the plank on the edge.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { type Built, type Format, type R, commonCheck, dec, figs, generateWith, joinList, n, num, pickStep, pv, q, qty, r3, RESAMPLE, sceneText, shown, t, toChoice, vq, wordOpt } from '../fis-corpo-rigido';

export const ID = 'fis-baricentro';

const S2: Format = { kind: 'sig', s: 2 };
const INT: Format = { kind: 'int' };
const twoFig = (r: R) => shown(r, S2).equals(r) && figs(r) <= 2 && r.mul(n(100)).isInteger();
const KG = (r: R) => vq(r, 'kg', S2);
const Mt = (r: R) => vq(r, 'm', S2);
const mass = (rng: Rng) => q(rng.int(2, 19), 2); // 1,0 kg to 9,5 kg

// ---------------------------------------------------------------------------
// Level 1: two bodies at the ends of a light rod

function level1(rng: Rng): Built {
	for (;;) {
		const m1 = mass(rng), m2 = mass(rng);
		const L = pickStep(rng, 2, 20, q(1, 10));
		if (m1.equals(m2)) continue;
		const x = m2.mul(L).div(m1.add(m2));
		if (!twoFig(x)) continue;
		return {
			kind: 'value',
			prompt: 'Trova il baricentro.',
			problem: textBlock(`Due corpi di massa ${pv(m1, 'kg', S2)} e ${pv(m2, 'kg', S2)} sono fissati alle estremità di un'asta di massa trascurabile lunga ${pv(L, 'm', S2)}. A che distanza dal corpo di ${pv(m1, 'kg', S2)} si trova il baricentro?`),
			solution: `x_G = ${Mt(x)}`,
			steps: [
				t(`Con l'ascissa che parte dal corpo di `) + KG(m1) + t(', i baricentri dei due corpi sono in 0 e in ') + Mt(L),
				`x_G = \\frac{m_1 \\cdot 0 + m_2 \\cdot L}{m_1 + m_2} = \\frac{${KG(m2)} \\cdot ${Mt(L)}}{${KG(m1)} + ${KG(m2)}} = ${Mt(x)}`,
				t('Il baricentro è più vicino al corpo più pesante, quello di ') + KG(m1.compare(m2) > 0 ? m1 : m2),
			],
			truth: x,
			unit: 'm',
			format: S2,
			// near the lighter body; the middle; the ratio of the masses without the sum
			mistakes: [L.sub(x), L.div(n(2)), m2.mul(L).div(m1)],
			params: { case: m1.compare(m2) > 0 ? 'dal-pesante' : 'dal-leggero' },
			scene: {
				type: 'asta-forze',
				data: {
					lunghezza: num(L),
					appoggi: [],
					forze: [],
					masse: [
						{ x: 0, valore: sceneText(m1, 'kg', S2) },
						{ x: num(L), valore: sceneText(m2, 'kg', S2) },
					],
					quote: [{ da: 0, a: num(L), testo: sceneText(L, 'm', S2), lato: 'sotto' }],
					punti: [],
				},
				alt: `Un'asta lunga ${sceneText(L, 'm', S2).replace(' m', ' metri')} con un corpo di ${sceneText(m1, 'kg', S2).replace(' kg', ' chilogrammi')} all'estremità sinistra e uno di ${sceneText(m2, 'kg', S2).replace(' kg', ' chilogrammi')} a quella destra`,
			},
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: three bodies on a rod

function level2(rng: Rng): Built {
	for (;;) {
		const xs = [0, 1, 2].map(() => q(10 * rng.int(0, 10)));
		if (new Set(xs.map(String)).size < 3) continue;
		xs.sort((a, b) => a.compare(b));
		const ms = [0, 1, 2].map(() => mass(rng));
		const M = ms.reduce((s, m) => s.add(m), n(0));
		const xG = ms.reduce((s, m, i) => s.add(m.mul(xs[i])), n(0)).div(M);
		if (!xG.isInteger() || figs(xG) > 2 || xG.sign() === 0) continue;
		const mean = xs.reduce((s, x) => s.add(x), n(0)).div(n(3));
		if (mean.equals(xG)) continue;
		const parts = xs.map((x, i) => `${pv(ms[i], 'kg', S2)} a ${pv(x, 'cm', INT)}`);
		const sum = ms.map((m, i) => `${KG(m)} \\cdot ${qty(dec(xs[i]), 'cm')}`).join(' + ');
		return {
			kind: 'value',
			prompt: 'Trova il baricentro.',
			problem: textBlock(`Su un'asta di massa trascurabile lunga $100\\,\\text{cm}$ sono fissati tre corpi, a distanze diverse dall'estremità sinistra: ${joinList(parts)}. A che distanza dall'estremità sinistra si trova il baricentro?`),
			solution: `x_G = ${vq(xG, 'cm', INT)}`,
			steps: [`x_G = \\frac{m_1 x_1 + m_2 x_2 + m_3 x_3}{m_1 + m_2 + m_3}`, `x_G = \\frac{${sum}}{${qty(dec(M), 'kg')}}`, `x_G = ${vq(xG, 'cm', INT)}`],
			truth: xG,
			unit: 'cm',
			format: INT,
			// the positions averaged without the masses; the heaviest body's position; the middle of the rod
			mistakes: [mean, xs[ms.indexOf(ms.reduce((a, b) => (b.compare(a) > 0 ? b : a)))], n(50)],
			params: { case: 'tre' },
			scene: {
				type: 'asta-forze',
				data: {
					lunghezza: 1,
					appoggi: [],
					forze: [],
					masse: xs.map((x, i) => ({ x: num(x) / 100, valore: sceneText(ms[i], 'kg', S2) })),
					quote: xs.filter((x) => x.sign() > 0).map((x, i) => ({ da: 0, a: num(x) / 100, testo: `${dec(x)} cm`, lato: 'sotto' as const, livello: i })),
					punti: [],
				},
				alt: `Un'asta lunga 100 centimetri con tre corpi: ${xs.map((x, i) => `${sceneText(ms[i], 'kg', S2).replace(' kg', ' chilogrammi')} a ${dec(x)} centimetri dall'estremità sinistra`).join(', ')}`,
			},
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: stable, unstable or indifferent

type Eq = 'stabile' | 'instabile' | 'indifferente';
export const BODIES: { eq: Eq; text: string }[] = [
	{ eq: 'stabile', text: 'Una lampada è appesa al soffitto con un filo, e il suo baricentro sta sotto il punto in cui è appesa.' },
	{ eq: 'stabile', text: "Un righello è appeso a un chiodo per un foro vicino a un'estremità." },
	{ eq: 'stabile', text: 'Una pallina è ferma sul fondo di una scodella.' },
	{ eq: 'stabile', text: 'Un cono è appoggiato su un tavolo sulla sua base.' },
	{ eq: 'stabile', text: 'Un pendolo è fermo nella sua posizione più bassa.' },
	{ eq: 'instabile', text: 'Una matita è in equilibrio sulla punta.' },
	{ eq: 'instabile', text: 'Una pallina è ferma in cima a una cupola liscia.' },
	{ eq: 'instabile', text: 'Un cono è in equilibrio sulla punta.' },
	{ eq: 'instabile', text: "Un'asta sta ferma in verticale, fissata a un perno sotto il suo baricentro." },
	{ eq: 'instabile', text: 'Un righello è tenuto in equilibrio in verticale sulla punta di un dito.' },
	{ eq: 'indifferente', text: 'Una ruota di bicicletta gira libera sul suo asse, che passa per il baricentro.' },
	{ eq: 'indifferente', text: 'Una pallina è ferma su un tavolo orizzontale.' },
	{ eq: 'indifferente', text: 'Un cono è appoggiato sul fianco su un tavolo orizzontale.' },
	{ eq: 'indifferente', text: 'Un righello è appeso a un chiodo per un foro nel suo centro.' },
	{ eq: 'indifferente', text: 'Un cilindro è appoggiato sul fianco su un pavimento orizzontale.' },
];
const EQS: Eq[] = ['stabile', 'instabile', 'indifferente'];
const WHY: Record<Eq, string> = {
	stabile: 'spostato di poco, torna da solo nella posizione di prima: il suo baricentro sale.',
	instabile: 'spostato di poco, se ne allontana sempre di più: il suo baricentro scende.',
	indifferente: 'spostato di poco, resta in equilibrio nella nuova posizione: il suo baricentro resta alla stessa altezza.',
};

function level3(rng: Rng): Built {
	const b = rng.pick(BODIES);
	return {
		kind: 'choice',
		prompt: "Riconosci l'equilibrio.",
		problem: textBlock(`${b.text} In che tipo di equilibrio si trova?`),
		solution: t(`equilibrio ${b.eq}`),
		steps: [t(`Il corpo, ${WHY[b.eq]}`), t(`L'equilibrio è ${b.eq}.`)],
		right: wordOpt(b.eq, b.eq),
		others: EQS.filter((e) => e !== b.eq).map((e) => wordOpt(e, e)),
		params: { case: b.eq, corpo: BODIES.indexOf(b) },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the angle past which a block tips over

const DEG = 180 / Math.PI;
/** Whole degrees, or a resample when the angle is within 0,05° of a half. */
function degOf(x: number): R {
	if (Math.abs(x - Math.floor(x) - 0.5) < 0.05) throw RESAMPLE();
	return q(Math.round(x));
}

function level4(rng: Rng): Built {
	const w = q(5 * rng.int(2, 12)), h = q(5 * rng.int(4, 24));
	if (w.div(h).compare(q(1, 5)) < 0 || w.compare(h) >= 0) throw RESAMPLE();
	const x = Math.atan(num(w) / num(h)) * DEG;
	const theta = degOf(x);
	const plane = rng.next() < 0.4;
	const deg = (r: R) => vq(r, 'deg', INT);
	return {
		kind: 'value',
		prompt: "Trova l'angolo.",
		problem: textBlock(
			plane
				? `Un blocco omogeneo largo ${pv(w, 'cm', INT)} e alto ${pv(h, 'cm', INT)} è appoggiato su un piano inclinato abbastanza ruvido perché non scivoli, con la larghezza lungo il piano. Qual è l'inclinazione più grande del piano per cui il blocco non si ribalta?`
				: `Una scatola omogenea larga ${pv(w, 'cm', INT)} e alta ${pv(h, 'cm', INT)} viene inclinata, appoggiata su uno spigolo della base. Oltre quale angolo di inclinazione, se la si lascia andare, la scatola si ribalta?`,
		),
		solution: `\\theta \\approx ${deg(theta)}`,
		steps: [
			t(plane ? 'Il blocco si ribalta quando la verticale del baricentro passa per lo spigolo più in basso della base.' : 'La scatola si ribalta quando la verticale del baricentro supera lo spigolo su cui è appoggiata.'),
			t("In quel momento la diagonale dallo spigolo al baricentro è verticale, e l'inclinazione è l'angolo tra la diagonale e il fianco:"),
			`\\tan\\theta = \\frac{${qty(dec(w.div(n(2))), 'cm')}}{${qty(dec(h.div(n(2))), 'cm')}} = \\frac{${dec(w)}}{${dec(h)}} \\quad\\Rightarrow\\quad \\theta = \\tan^{-1} \\frac{${dec(w)}}{${dec(h)}} \\approx ${deg(theta)}`,
		],
		truth: theta,
		unit: 'deg',
		format: INT,
		// the tangent upside down; half the width over the whole height; the whole width over half the height
		mistakes: [90 - x, Math.atan(num(w) / (2 * num(h))) * DEG, Math.atan((2 * num(w)) / num(h)) * DEG].map((y) => q(Math.round(y))),
		params: { case: plane ? 'piano' : 'spigolo' },
	};
}

// ---------------------------------------------------------------------------
// Level 5: a plank over an edge

function level5(rng: Rng): Built {
	const walk = rng.next() < 0.4;
	for (;;) {
		const L = pickStep(rng, 10, 40, q(1, 10)); // 1,0 m to 4,0 m
		const P = q(10 * rng.int(3, 30));
		const W = q(10 * rng.int(1, 20));
		if (!walk) {
			const s = P.mul(L).div(n(2).mul(P.add(W)));
			if (!twoFig(s)) continue;
			return {
				kind: 'value',
				prompt: 'Trova la sporgenza.',
				problem: textBlock(`Un'asse omogenea lunga ${pv(L, 'm', S2)}, che pesa ${pv(P, 'N', INT)}, è appoggiata su un tavolo e sporge oltre il bordo. Sull'estremità che sporge c'è un vaso che pesa ${pv(W, 'N', INT)}. Di quanto può sporgere al massimo l'asse senza ribaltarsi?`),
				solution: `s = ${Mt(s)}`,
				steps: [
					t("Al limite l'asse sta per ruotare intorno al bordo: il momento del vaso è uguale a quello del peso dell'asse, applicato nel suo centro."),
					`W \\cdot s = P \\cdot \\left(\\frac{L}{2} - s\\right) \\quad\\Rightarrow\\quad s = \\frac{P \\cdot L}{2\\,(P + W)}`,
					`s = \\frac{${vq(P, 'N', INT)} \\cdot ${Mt(L)}}{2 \\cdot (${vq(P, 'N', INT)} + ${vq(W, 'N', INT)})} = ${Mt(s)}`,
				],
				truth: s,
				unit: 'm',
				format: S2,
				// the vase forgotten (half the plank); the weights swapped; without the 2
				mistakes: [L.div(n(2)), W.mul(L).div(n(2).mul(P.add(W))), P.mul(L).div(P.add(W))],
				params: { case: 'vaso' },
			};
		}
		const s = pickStep(rng, 1, 30, q(1, 10));
		const arm = L.div(n(2)).sub(s);
		if (arm.sign() <= 0) continue;
		const x = P.mul(arm).div(W);
		if (!twoFig(x) || x.compare(s) >= 0 || x.compare(q(1, 10)) < 0) continue;
		return {
			kind: 'value',
			prompt: 'Trova la distanza.',
			problem: textBlock(`Un'asse omogenea lunga ${pv(L, 'm', S2)}, che pesa ${pv(P, 'N', INT)}, sporge di ${pv(s, 'm', S2)} oltre il bordo di un tetto piano. Un gatto che pesa ${pv(W, 'N', INT)} cammina sull'asse verso l'estremità che sporge. Fino a che distanza oltre il bordo può arrivare prima che l'asse si ribalti?`),
			solution: `x = ${Mt(x)}`,
			steps: [
				t("Il baricentro dell'asse è nel suo centro, a ") + `\\frac{${Mt(L)}}{2} - ${Mt(s)} = ${qty(dec(arm), 'm')}` + t(' dal bordo, dalla parte del tetto.'),
				t("Al limite il momento del gatto rispetto al bordo è uguale a quello del peso dell'asse:"),
				`W \\cdot x = P \\cdot ${qty(dec(arm), 'm')} \\quad\\Rightarrow\\quad x = \\frac{${vq(P, 'N', INT)} \\cdot ${qty(dec(arm), 'm')}}{${vq(W, 'N', INT)}} = ${Mt(x)}`,
			],
			truth: x,
			unit: 'm',
			format: S2,
			// the ratio upside down; the arm of the plank's weight measured from its end; the weights forgotten
			mistakes: [W.mul(arm).div(P), P.mul(L.div(n(2))).div(W), arm],
			params: { case: 'gatto' },
			scene: {
				type: 'asta-forze',
				data: {
					lunghezza: num(L),
					appoggi: [{ x: r3(num(L) - num(s)), tipo: 'tavolo' }],
					forze: [{ x: r3(num(L) / 2), angolo: -90, nome: 'P', valore: sceneText(P, 'N', INT), lunghezza: 1.2 }],
					quote: [
						{ da: r3(num(L) - num(s)), a: num(L), testo: sceneText(s, 'm', S2), lato: 'sopra', livello: 0 },
						{ da: 0, a: num(L), testo: sceneText(L, 'm', S2), lato: 'sopra', livello: 1 },
					],
					punti: [],
				},
				alt: `Un'asse lunga ${sceneText(L, 'm', S2).replace(' m', ' metri')} appoggiata su un tetto piano, che sporge di ${sceneText(s, 'm', S2).replace(' m', ' metri')} oltre il bordo; il suo peso, ${P} newton, nel centro`,
			},
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	if ((sample.level === 3) !== (sample.answer.kind === 'choice')) v.push('tipo di risposta sbagliato per il livello');
	if (sample.answer.kind === 'choice' && sample.answer.options.length !== 3) v.push('servono tre opzioni');
	if (sample.level <= 2 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisBaricentro: Generator = {
	id: ID,
	title: "Il baricentro e la stabilità dell'equilibrio",
	levels: {
		1: { label: 'Il baricentro di due corpi', constraints: ['due masse alle estremità di un’asta leggera', 'distanza esatta con due cifre'] },
		2: { label: 'Il baricentro di tre corpi', constraints: ['tre masse su un’asta di 100 cm', 'x_G intero'] },
		3: { label: 'Stabile, instabile o indifferente', constraints: ['un corpo della lezione, tre opzioni'] },
		4: { label: "L'angolo di ribaltamento", constraints: ['tan θ = w / h, θ al grado', 'scatola su uno spigolo (60%) o blocco sul piano inclinato (40%)'] },
		5: { label: 'Quanto può sporgere', constraints: ['asse con un peso all’estremità (60%) o un gatto che cammina (40%)'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice,
};

export default fisBaricentro;
