/**
 * L'equilibrio di un punto materiale e le reazioni vincolari. Spec: specs/exercises/fis-equilibrio-punto.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/20-fis-equilibrio-punto.md), each one step harder: the
 * reaction of a level support with a hand pressing down or a thread pulling up; the equilibrant of two perpendicular
 * forces, or of three along two directions; a body hanging from two threads at the same angle (from the horizontal or
 * from the vertical); a body held by an inclined thread and a horizontal one; two threads at different angles; the
 * smallest angle a clothesline can make without breaking. g = 9,8 N/kg, masses and forces with two significant
 * figures, angles in whole degrees; answers rounded to two significant figures (angles to the degree), never too close
 * to a rounding boundary. Multiple choice with the unit in the option; distractors from the lesson's mistakes: the
 * reaction taken for the weight, the tensions sharing the weight in halves, sine and cosine swapped, the moduli added.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, decTex, pq, qOpt, qty, t } from '../vettori';
import { type Built, checkCommon, cosD, degOpt, generateWith, lab, opts, r2, roundDeg, sinD, tanD, two, weight } from '../fisica-equilibrio';

export const ID = 'fis-equilibrio-punto';

const N = (s: string) => qty(s, 'N');
const nOpts = (xs: (string | null)[]) => opts(xs, (s) => qOpt(s, 'N'));
/** A float for a step, cut (not rounded) after three decimals, as the lessons write 70{,}093… before the rounding. */
const f3 = (x: number) => {
	const r = Math.round(x * 1000);
	return decTex(String((Math.abs(x * 1000 - r) < 1e-6 ? r : Math.trunc(x * 1000)) / 1000));
};

/** A scene of threads (fili-corpo): each thread's direction in degrees from the x axis, its support and its angle mark. */
function fili(alt: string, threads: { angolo: number; supporto?: 'soffitto' | 'parete'; rif?: 'orizzontale' | 'verticale'; testo?: string }[], forze?: { nome: string; sub?: string; modulo: number; angolo: number }[], scala?: number): SceneRef {
	const data: Record<string, unknown> = { fili: threads };
	if (forze) {
		data.forze = forze.map((F) => ({ ...F, modulo: Math.round(F.modulo * 1000) / 1000 }));
		data.scala = scala;
	}
	return { type: 'fili-corpo', data, alt };
}

/** Arrow scale for a solution scene: the longest force about 1,6 cm. */
const scaleFor = (...xs: number[]) => Math.round((1.6 / Math.max(...xs)) * 10000) / 10000;

// ---------------------------------------------------------------------------
// Level 1: the reaction of a level support

const BODIES = [
	{ name: 'Un libro', where: 'un tavolo orizzontale', e: 'o', lo: 'lo' },
	{ name: 'Una cassa', where: 'un pavimento orizzontale', e: 'a', lo: 'la' },
	{ name: 'Uno scatolone', where: 'un pavimento orizzontale', e: 'o', lo: 'lo' },
	{ name: 'Una valigia', where: 'un pavimento orizzontale', e: 'a', lo: 'la' },
];

function level1(rng: Rng): Built {
	const down = rng.next() < 0.5;
	let m: string, P: string, Pn: number, F: string, Fn: number, exact: number, ans: string | null;
	// the case first, then the numbers until they fit, so the two cases stay half and half
	do {
		m = two(rng, true);
		P = weight(m);
		Pn = Number(P);
		F = two(rng, rng.next() < 0.5);
		Fn = Number(F);
		exact = down ? Pn + Fn : Pn - Fn;
		ans = Fn < 0.15 * Pn || Fn > 0.8 * Pn || exact < 1 ? null : r2(exact);
	} while (ans === null);
	const b = rng.pick(BODIES);
	const push = down ? `Una mano ${b.lo} preme verso il basso con una forza di ${pq(F, 'N')}.` : `Un filo verticale ${b.lo} tira verso l'alto con una forza di ${pq(F, 'N')}, più piccola del suo peso.`;
	return {
		prompt: 'Trova la reazione vincolare.',
		problem: textBlock(`${b.name} di ${pq(m, 'kg')} è appoggiat${b.e} su ${b.where}. ${push} Quanto vale la reazione vincolare del piano?`),
		solution: `F_v \\approx ${N(ans)}`,
		steps: [
			`P = m \\cdot g = ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${N(P)}`,
			down
				? `${t('La reazione bilancia il peso e la spinta della mano: ')} F_v = ${N(P)} + ${N(F)} = ${f3(exact)}\\,\\text{N}`
				: `${t('Il filo regge una parte del peso: ')} F_v = ${N(P)} - ${N(F)} = ${f3(exact)}\\,\\text{N}`,
			`F_v \\approx ${N(ans)} ${t(' (due cifre significative, come i dati)')}`,
		],
		// the reaction taken for the weight; the other force with the wrong sign; the other force alone
		answer: choiceOf(rng, qOpt(ans, 'N'), nOpts([r2(Pn), r2(down ? Pn - Fn : Pn + Fn), r2(Fn)]), nOpts([r2(exact * 1.2), r2(exact * 0.8), r2(exact * 1.4)])),
		params: { case: down ? 'mano' : 'filo', m, F },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the equilibrant force

function level2(rng: Rng): Built {
	const three = rng.next() < 0.5;
	let F1 = two(rng, false), F2 = two(rng, false);
	const F3 = three ? two(rng, false) : '';
	if (three && Number(F1) <= Number(F2)) [F1, F2] = [F2, F1];
	if (F1 === F2) throw new Error('resample');
	const x = three ? Number(F1) - Number(F2) : Number(F1);
	const y = three ? Number(F3) : Number(F2);
	if (x < 0.25 * y || y < 0.25 * x) throw new Error('resample');
	const R = Math.hypot(x, y);
	const ans = r2(R);
	if (ans === null) throw new Error('resample');
	const forces = three
		? [
				{ nome: 'F', sub: '1', modulo: Number(F1), angolo: 0 },
				{ nome: 'F', sub: '2', modulo: Number(F2), angolo: 180 },
				{ nome: 'F', sub: '3', modulo: Number(F3), angolo: 90 },
			]
		: [
				{ nome: 'F', sub: '1', modulo: Number(F1), angolo: 0 },
				{ nome: 'F', sub: '2', modulo: Number(F2), angolo: 90 },
			];
	const k = scaleFor(...forces.map((F) => F.modulo), R);
	const eqAngle = Math.round(((Math.atan2(-y, -x) / Math.PI) * 180 + 360) % 360);
	const alt = three
		? `Un punto con tre forze: F1 di ${lab(F1)} newton verso est, F2 di ${lab(F2)} newton verso ovest, F3 di ${lab(F3)} newton verso nord.`
		: `Un punto con due forze: F1 di ${lab(F1)} newton verso est e F2 di ${lab(F2)} newton verso nord.`;
	const mistakes = three ? [r2(Number(F1) + Number(F2) + Number(F3)), r2(Math.hypot(Number(F1) + Number(F2), y)), r2(x + y)] : [r2(x + y), r2(Math.abs(x - y)), r2((x + y) / 2)];
	return {
		prompt: 'Trova la forza equilibrante.',
		problem: textBlock(
			three
				? `Su un punto materiale agiscono tre forze: ${pq(F1, 'N')} verso est, ${pq(F2, 'N')} verso ovest e ${pq(F3, 'N')} verso nord. Quanto vale il modulo della forza equilibrante?`
				: `Su un punto materiale agiscono una forza di ${pq(F1, 'N')} verso est e una forza di ${pq(F2, 'N')} verso nord. Quanto vale il modulo della forza equilibrante?`,
		),
		solution: `F_e \\approx ${N(ans)}`,
		steps: [
			...(three ? [`${t('Lungo la direzione est-ovest: ')} ${N(F1)} - ${N(F2)} = ${f3(x)}\\,\\text{N} ${t(' verso est')}`] : []),
			`${t('La risultante: ')} R = \\sqrt{${f3(x)}^2 + ${f3(y)}^2}\\,\\text{N} = ${f3(R)}\\ldots\\,\\text{N}`,
			`${t('La forza equilibrante è opposta alla risultante, con lo stesso modulo: ')} F_e \\approx ${N(ans)}`,
		],
		answer: choiceOf(rng, qOpt(ans, 'N'), nOpts(mistakes), nOpts([r2(R * 1.2), r2(R * 0.8), r2(R * 1.4)])),
		params: { case: three ? 'tre' : 'due', F1, F2, F3 },
		scene: { type: 'punto-forze', data: { forze: forces, scala: k }, alt },
		solutionScene: { type: 'punto-forze', data: { forze: [...forces, { nome: 'F', sub: 'e', modulo: Math.round(R * 1000) / 1000, angolo: eqAngle, colore: 'risultante' }], scala: k }, alt: `${alt} La forza equilibrante Fe, di ${lab(ans)} newton, è opposta alla risultante.` },
	};
}

// ---------------------------------------------------------------------------
// Level 3: two threads at the same angle

const HUNG = [
	{ name: 'Un lampadario', e: 'o' },
	{ name: 'Un quadro', e: 'o' },
	{ name: "Un'insegna", e: 'a' },
	{ name: 'Una lampada', e: 'a' },
];

function level3(rng: Rng): Built {
	const m = two(rng, true);
	const P = weight(m), Pn = Number(P);
	const vertical = rng.next() < 0.5;
	const given = rng.int(15, 75);
	const elev = vertical ? 90 - given : given; // the angle with the horizontal
	const T = Pn / (2 * sinD(elev));
	const ans = r2(T);
	if (ans === null || T < 1) throw new Error('resample');
	const b = rng.pick(HUNG);
	const ref = vertical ? 'la verticale' : "l'orizzontale";
	const fn = vertical ? '\\cos' : '\\sin';
	// sine and cosine swapped: the formula of the other reference
	const swapped = vertical ? Pn / (2 * sinD(given)) : Pn / (2 * cosD(given));
	const rif = vertical ? ('verticale' as const) : ('orizzontale' as const);
	const alt = `Un corpo appeso a due fili che salgono al soffitto da parti opposte, ciascuno a ${given} gradi dal${vertical ? 'la verticale' : "l'orizzontale"}.`;
	return {
		prompt: 'Trova la tensione.',
		problem: textBlock(`${b.name} di ${pq(m, 'kg')} è appes${b.e} a due fili, che formano ciascuno un angolo di $${given}^\\circ$ con ${ref}. Quanto vale la tensione di ciascun filo?`),
		solution: `T \\approx ${N(ans)}`,
		steps: [
			`P = m \\cdot g = ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${N(P)}`,
			vertical
				? t(`Le componenti verticali delle due tensioni reggono il peso; con l'angolo dalla verticale si usa il coseno.`)
				: t(`Le componenti verticali delle due tensioni reggono il peso; con l'angolo dall'orizzontale si usa il seno.`),
			`2\\,T ${fn} ${given}^\\circ = P \\quad\\Rightarrow\\quad T = \\dfrac{${N(P)}}{2 ${fn} ${given}^\\circ} = ${f3(T)}\\ldots\\,\\text{N} \\approx ${N(ans)}`,
		],
		// the weight shared in halves; sine and cosine swapped; the 2 forgotten
		answer: choiceOf(rng, qOpt(ans, 'N'), nOpts([r2(Pn / 2), r2(swapped), r2(2 * T)]), nOpts([r2(T * 1.2), r2(T * 0.8), r2(T * 1.4)])),
		params: { case: vertical ? 'verticale' : 'orizzontale', m, angle: given },
		scene: fili(alt, [
			{ angolo: 180 - elev, rif, testo: `${given}°` },
			{ angolo: elev, rif, testo: `${given}°` },
		]),
		solutionScene: fili(
			`${alt} Le tensioni T1 e T2 valgono ${lab(ans)} newton ciascuna, il peso ${lab(P)} newton.`,
			[{ angolo: 180 - elev }, { angolo: elev }],
			[
				{ nome: 'T', sub: '1', modulo: T, angolo: 180 - elev },
				{ nome: 'T', sub: '2', modulo: T, angolo: elev },
				{ nome: 'P', modulo: Pn, angolo: 270 },
			],
			scaleFor(T, Pn),
		),
	};
}

// ---------------------------------------------------------------------------
// Level 4: an inclined thread and a horizontal one

function level4(rng: Rng): Built {
	const m = two(rng, true);
	const P = weight(m), Pn = Number(P);
	const vertical = rng.next() < 0.5;
	const beta = rng.int(15, 70); // the inclined thread's angle with the vertical
	const given = vertical ? beta : 90 - beta;
	const askT = rng.next() < 0.5;
	const T = Pn / cosD(beta), F = Pn * tanD(beta);
	const exact = askT ? T : F;
	const ans = r2(exact);
	if (ans === null || exact < 1 || r2(T) === null || r2(F) === null) throw new Error('resample');
	const ref = vertical ? 'la verticale' : "l'orizzontale";
	// sine and cosine swapped (the angle taken from the other line); the other force; the weight
	const mistakes = askT ? [r2(Pn / sinD(beta)), r2(Pn * cosD(beta)), r2(Pn)] : [r2(Pn / tanD(beta)), r2(Pn * sinD(beta)), r2(T)];
	const alt = `Una lampada tenuta da un filo che sale verso destra fino al soffitto, a ${given} gradi dal${vertical ? 'la verticale' : "l'orizzontale"}, e da un filo orizzontale legato alla parete a sinistra.`;
	const cosLine = vertical ? `\\cos ${given}^\\circ` : `\\sin ${given}^\\circ`;
	const sinLine = vertical ? `\\sin ${given}^\\circ` : `\\cos ${given}^\\circ`;
	return {
		prompt: 'Trova la tensione.',
		problem: textBlock(
			`Una lampada di ${pq(m, 'kg')} è appesa al soffitto con un filo che forma un angolo di $${given}^\\circ$ con ${ref}; un secondo filo, orizzontale e legato alla parete, la tiene scostata. Quanto vale la tensione del filo ${askT ? 'inclinato' : 'orizzontale'}?`,
		),
		solution: `${askT ? 'T' : 'F'} \\approx ${N(ans)}`,
		steps: [
			`P = m \\cdot g = ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${N(P)}`,
			vertical ? t("L'angolo è dato con la verticale: la componente verticale di T va con il coseno.") : t("L'angolo è dato con l'orizzontale: la componente verticale di T va con il seno."),
			`y:\\ T ${cosLine} = P \\quad\\Rightarrow\\quad T = \\dfrac{${N(P)}}{${cosLine}} = ${f3(T)}\\ldots\\,\\text{N}`,
			...(askT ? [] : [`x:\\ F = T ${sinLine} = ${f3(F)}\\ldots\\,\\text{N}`]),
			`${askT ? 'T' : 'F'} \\approx ${N(ans)}`,
		],
		answer: choiceOf(rng, qOpt(ans, 'N'), nOpts(mistakes), nOpts([r2(exact * 1.2), r2(exact * 0.8), r2(exact * 1.4)])),
		params: { case: askT ? 'inclinato' : 'orizzontale', ref: vertical ? 'verticale' : 'orizzontale', m, angle: given },
		scene: fili(alt, [
			{ angolo: 180, supporto: 'parete' },
			{ angolo: 90 - beta, rif: vertical ? 'verticale' : 'orizzontale', testo: `${given}°` },
		]),
		solutionScene: fili(
			`${alt} La tensione del filo inclinato vale ${lab(r2(T)!)} newton, quella del filo orizzontale ${lab(r2(F)!)} newton, il peso ${lab(P)} newton.`,
			[{ angolo: 180, supporto: 'parete' }, { angolo: 90 - beta }],
			[
				{ nome: 'T', modulo: T, angolo: 90 - beta },
				{ nome: 'F', modulo: F, angolo: 180 },
				{ nome: 'P', modulo: Pn, angolo: 270 },
			],
			scaleFor(T, F, Pn),
		),
	};
}

// ---------------------------------------------------------------------------
// Level 5: two threads at different angles

function level5(rng: Rng): Built {
	const m = two(rng, true);
	const P = weight(m), Pn = Number(P);
	const a1 = rng.int(20, 75), a2 = rng.int(20, 75);
	if (Math.abs(a1 - a2) < 10) throw new Error('resample');
	const s = sinD(a1 + a2);
	const T1 = (Pn * cosD(a2)) / s, T2 = (Pn * cosD(a1)) / s;
	const left = rng.next() < 0.5;
	const exact = left ? T1 : T2;
	const ans = r2(exact);
	if (ans === null || exact < 1 || r2(T1) === null || r2(T2) === null) throw new Error('resample');
	const own = left ? a1 : a2;
	const alt = `Un lampadario appeso a due fili che salgono al soffitto: quello di sinistra a ${a1} gradi dall'orizzontale, quello di destra a ${a2} gradi.`;
	return {
		prompt: 'Trova la tensione.',
		problem: textBlock(
			`Un lampadario di ${pq(m, 'kg')} è appeso a due fili: quello di sinistra forma un angolo di $${a1}^\\circ$ con l'orizzontale, quello di destra un angolo di $${a2}^\\circ$. Quanto vale la tensione del filo di ${left ? 'sinistra' : 'destra'}?`,
		),
		solution: `T_${left ? 1 : 2} \\approx ${N(ans)}`,
		steps: [
			`P = m \\cdot g = ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${N(P)}`,
			t("Angoli dall'orizzontale: le componenti orizzontali vanno con il coseno, quelle verticali con il seno."),
			`x:\\ -T_1 \\cos ${a1}^\\circ + T_2 \\cos ${a2}^\\circ = 0 \\qquad y:\\ T_1 \\sin ${a1}^\\circ + T_2 \\sin ${a2}^\\circ = P`,
			`T_2 = T_1 \\dfrac{\\cos ${a1}^\\circ}{\\cos ${a2}^\\circ} = ${f3(cosD(a1) / cosD(a2))}\\,T_1`,
			`T_1 \\left(${f3(sinD(a1))} + ${f3(cosD(a1) / cosD(a2))} \\cdot ${f3(sinD(a2))}\\right) = ${N(P)} \\quad\\Rightarrow\\quad T_1 = ${f3(T1)}\\ldots\\,\\text{N}`,
			`T_2 = ${f3(T2)}\\ldots\\,\\text{N}`,
			`T_${left ? 1 : 2} \\approx ${N(ans)}`,
		],
		// the other thread's tension; each thread as if the two were symmetric; the weight shared in halves
		answer: choiceOf(rng, qOpt(ans, 'N'), nOpts([r2(left ? T2 : T1), r2(Pn / (2 * sinD(own))), r2(Pn / 2)]), nOpts([r2(exact * 1.2), r2(exact * 0.8), r2(exact * 1.4)])),
		params: { case: left ? 'sinistra' : 'destra', m, a1, a2 },
		scene: fili(alt, [
			{ angolo: 180 - a1, rif: 'orizzontale', testo: `${a1}°` },
			{ angolo: a2, rif: 'orizzontale', testo: `${a2}°` },
		]),
		solutionScene: fili(
			`${alt} Le tensioni valgono ${lab(r2(T1)!)} newton a sinistra e ${lab(r2(T2)!)} newton a destra, il peso ${lab(P)} newton.`,
			[{ angolo: 180 - a1 }, { angolo: a2 }],
			[
				{ nome: 'T', sub: '1', modulo: T1, angolo: 180 - a1 },
				{ nome: 'T', sub: '2', modulo: T2, angolo: a2 },
				{ nome: 'P', modulo: Pn, angolo: 270 },
			],
			scaleFor(T1, T2, Pn),
		),
	};
}

// ---------------------------------------------------------------------------
// Level 6: the smallest angle of a clothesline

const LOADS = ['una borsa', 'un secchio', 'un asciugamano bagnato', 'un cappotto'];

function level6(rng: Rng): Built {
	const m = two(rng, true);
	const P = weight(m), Pn = Number(P);
	const Tmax = two(rng, false);
	const Tn = Number(Tmax);
	const ratio = Pn / (2 * Tn);
	if (ratio < sinD(4) || ratio > sinD(40)) throw new Error('resample');
	const deg = (Math.asin(ratio) * 180) / Math.PI;
	const ans = roundDeg(deg);
	if (ans === null) throw new Error('resample');
	const forgot = Pn / Tn <= 1 ? roundDeg((Math.asin(Pn / Tn) * 180) / Math.PI) : null;
	const cosine = roundDeg((Math.acos(ratio) * 180) / Math.PI);
	const tangent = roundDeg((Math.atan(Pn / Tn) * 180) / Math.PI);
	const a = Number(ans);
	const load = rng.pick(LOADS);
	return {
		prompt: "Trova l'angolo.",
		problem: textBlock(`Un filo per stendere regge al massimo una tensione di ${pq(Tmax, 'N')}. Al centro si appende ${load} di ${pq(m, 'kg')}. Qual è l'angolo più piccolo che i due tratti del filo possono formare con l'orizzontale?`),
		solution: `\\alpha \\approx ${ans}^\\circ`,
		steps: [
			`P = m \\cdot g = ${qty(m, 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${N(P)}`,
			`${t('Due tratti con lo stesso angolo: ')} T = \\dfrac{P}{2 \\sin\\alpha} \\quad\\Rightarrow\\quad \\sin\\alpha = \\dfrac{P}{2\\,T}`,
			`\\sin\\alpha = \\dfrac{${N(P)}}{2 \\cdot ${N(Tmax)}} = ${f3(ratio)}\\ldots \\quad\\Rightarrow\\quad \\alpha = ${f3(deg)}\\ldots^\\circ \\approx ${ans}^\\circ`,
			t("Con un angolo più piccolo la tensione supera il massimo e il filo si rompe."),
		],
		// the 2 forgotten; the angle with the vertical (cosine); the tangent in place of the sine
		answer: choiceOf(rng, degOpt(ans), opts([forgot, cosine, tangent], degOpt), [a + 2, a - 2, a + 4, a + 5].filter((x) => x > 0).map((x) => degOpt(String(x)))),
		params: { case: 'angolo', m, T: Tmax },
		scene: fili(`Un filo per stendere teso tra due pareti, con ${load} appeso al centro; i due tratti formano un angolo alfa con l'orizzontale.`, [
			{ angolo: 165, supporto: 'parete', rif: 'orizzontale', testo: 'α' },
			{ angolo: 15, supporto: 'parete', rif: 'orizzontale', testo: 'α' },
		]),
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level >= 2 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisEquilibrioPunto: Generator = {
	id: ID,
	title: "L'equilibrio di un punto materiale e le reazioni vincolari",
	levels: {
		1: { label: "La reazione del piano d'appoggio", constraints: ['una mano che preme o un filo che tira, tra il 15% e l\'80% del peso', 'risultato con due cifre significative'] },
		2: { label: 'La forza equilibrante', constraints: ['due forze perpendicolari, o tre forze lungo due direzioni'] },
		3: { label: 'Due fili con lo stesso angolo', constraints: ["angolo da 15° a 75° con l'orizzontale o con la verticale"] },
		4: { label: 'Un filo orizzontale e uno inclinato', constraints: ['filo inclinato tra 15° e 70° dalla verticale', 'tensione del filo inclinato o di quello orizzontale'] },
		5: { label: 'Due fili con angoli diversi', constraints: ["angoli da 20° a 75° con l'orizzontale, diversi di almeno 10°"] },
		6: { label: 'Quanto si può tendere un filo', constraints: ['angolo più piccolo tra 4° e 40°, arrotondato al grado'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEquilibrioPunto;
