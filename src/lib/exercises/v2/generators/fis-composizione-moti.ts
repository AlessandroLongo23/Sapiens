/**
 * La composizione dei moti. Spec: specs/exercises/fis-composizione-moti.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/46-fis-composizione-moti.md), each one step harder: two
 * velocities along the same line (a boat with or against the current, a sailor walking on a ferry's deck); the time
 * to cover a distance with or against the current; two perpendicular velocities (the boat heading straight across),
 * the resultant's modulus or its angle; the crossing time or the drift downstream across a river of given width; the
 * bow turned upstream to land right opposite, its angle or the crossing time. Data with two significant figures,
 * answers with two (angles to the degree). Distractors from the lesson's warnings: the moduli added whatever the
 * directions, the width divided by the resultant speed, the tangent for the sine, the current forgotten.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { type Built, checkCommon, choiceOf, cut, cutQ, dec2, decTex, degOpt, generateWith, lab, near, opts, pq, qOpt, qty, r2, rel, res, roundDeg, t, unitOpts } from '../fis-moti-piano';

export const ID = 'fis-composizione-moti';

const MS = unitOpts('m/s');
const S = unitOpts('s');
const M = unitOpts('m');
const RAD = 180 / Math.PI;
const one = (x: number) => x.toFixed(1);

function river(alt: string, d: { vb: string; vc: string; alfa: number; testoAlfa?: string; larghezza?: string; risultante?: boolean }): SceneRef {
	const data: Record<string, unknown> = { vb: Number(d.vb), vc: Number(d.vc), alfa: Math.round(d.alfa * 1000) / 1000, testoVb: `${lab(d.vb)} m/s`, testoVc: `${lab(d.vc)} m/s` };
	if (d.testoAlfa) data.testoAlfa = d.testoAlfa;
	if (d.larghezza) data.larghezza = d.larghezza;
	if (d.risultante) data.risultante = true;
	return { type: 'fiume-barca', data, alt };
}

// ---------------------------------------------------------------------------
// Level 1: velocities along the same line

function level1(rng: Rng): Built {
	const same = rng.next() < 0.5;
	const ferry = rng.next() < 0.5;
	for (;;) {
		// one decimal each, results between 1,0 and 9,9 m/s: exact, two significant figures
		const v1 = ferry ? dec2(rng, 1.1, 2.0) : dec2(rng, 2.0, 8.0);
		const v2 = ferry ? dec2(rng, 3.0, 8.5) : dec2(rng, 1.1, 3.0);
		if (!v1.includes('.') || !v2.includes('.')) continue;
		const a = Number(v1), b = Number(v2);
		const exact = same ? a + b : Math.abs(a - b);
		if (exact < 1 - 1e-9 || exact > 9.9 + 1e-9 || (!ferry && b > a)) continue;
		const ans = one(exact);
		const other = r2(same ? Math.abs(a - b) : a + b);
		const problem = ferry
			? `Un marinaio cammina a ${pq(v1, 'm/s')} sul ponte di un traghetto, che avanza a ${pq(v2, 'm/s')}. Il marinaio cammina ${same ? 'verso la prua, nel verso del moto del traghetto' : 'verso la poppa, nel verso opposto al moto del traghetto'}. Quanto vale la sua velocità rispetto alla riva?`
			: `Una barca a motore va a ${pq(v1, 'm/s')} rispetto all'acqua su un fiume la cui corrente va a ${pq(v2, 'm/s')}. La barca va ${same ? 'verso valle, nel verso della corrente' : 'verso monte, contro la corrente'}. Quanto vale la sua velocità rispetto alla riva?`;
		return {
			prompt: 'Trova la velocità rispetto alla riva.',
			problem: textBlock(problem),
			solution: `v = ${qty(ans, 'm/s')}`,
			steps: [
				same ? t('Le due velocità hanno la stessa direzione e lo stesso verso: i moduli si sommano.') : t('Le due velocità hanno la stessa direzione e versi opposti: i moduli si sottraggono.'),
				same ? `v = ${qty(v1, 'm/s')} + ${qty(v2, 'm/s')} = ${qty(ans, 'm/s')}` : `v = ${qty(a > b ? v1 : v2, 'm/s')} - ${qty(a > b ? v2 : v1, 'm/s')} = ${qty(ans, 'm/s')}`,
				...(!same && ferry ? [t('Il marinaio va nel verso del traghetto, ma più piano.')] : []),
			],
			// the other sign; each velocity alone
			answer: choiceOf(rng, qOpt(ans, 'm/s'), MS([other, one(a), one(b)]), near(exact, 'm/s')),
			params: { case: same ? 'stesso verso' : 'versi opposti', context: ferry ? 'traghetto' : 'barca', v1, v2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the time with or against the current

function level2(rng: Rng): Built {
	const down = rng.next() < 0.5;
	for (;;) {
		const vb = dec2(rng, 2.0, 6.0), vc = dec2(rng, 0.5, 2.0), d = dec2(rng, 11, 99);
		const B = Number(vb), C = Number(vc), D = Number(d);
		if (C > B - 0.8) continue;
		const v = down ? B + C : B - C;
		const exact = D / v;
		const ans = r2(exact);
		if (ans === null || exact < 2) continue;
		return {
			prompt: 'Trova il tempo.',
			problem: textBlock(`Una canoa va a ${pq(vb, 'm/s')} rispetto all'acqua, su un fiume la cui corrente va a ${pq(vc, 'm/s')}. Quanto tempo impiega a percorrere ${pq(d, 'm')} lungo il fiume ${down ? 'verso valle' : 'verso monte'}?`),
			solution: `t ${rel(exact, ans)} ${qty(ans, 's')}`,
			steps: [
				down ? `v = v_b + v_c = ${qty(vb, 'm/s')} + ${qty(vc, 'm/s')} = ${cutQ(v, 'm/s')}` : `v = v_b - v_c = ${qty(vb, 'm/s')} - ${qty(vc, 'm/s')} = ${cutQ(v, 'm/s')}`,
				`t = \\dfrac{d}{v} = \\dfrac{${qty(d, 'm')}}{${cutQ(v, 'm/s')}} = ${res(exact, ans, 's')}`,
			],
			// the current forgotten; the other sign; the current alone
			answer: choiceOf(rng, qOpt(ans, 's'), S([r2(D / B), r2(D / (down ? B - C : B + C)), r2(D / C)]), near(exact, 's')),
			params: { case: down ? 'valle' : 'monte', vb, vc, d },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: perpendicular velocities

function level3(rng: Rng): Built {
	const askAngle = rng.next() < 0.5;
	for (;;) {
		const vb = dec2(rng, 1.1, 6.0), vc = dec2(rng, 0.5, 4.0);
		const B = Number(vb), C = Number(vc);
		const v = Math.hypot(B, C);
		const beta = Math.atan(C / B) * RAD;
		const alt = `Un fiume visto dall'alto, con la corrente verso destra; la barca parte dalla riva in basso con la prua perpendicolare alla riva, a ${lab(vb)} metri al secondo, e la corrente va a ${lab(vc)} metri al secondo.`;
		const scene = river(alt, { vb, vc, alfa: 0 });
		const solutionScene = river(`${alt} La velocità rispetto alla riva è la somma delle due.`, { vb, vc, alfa: 0, risultante: true });
		if (askAngle) {
			const ans = roundDeg(beta);
			if (ans === null || beta < 8 || beta > 82) continue;
			const n = Number(ans);
			return {
				prompt: "Trova l'angolo della traiettoria.",
				problem: textBlock(`Una barca va a ${pq(vb, 'm/s')} rispetto all'acqua, con la prua perpendicolare alla riva, su un fiume la cui corrente va a ${pq(vc, 'm/s')}. Quale angolo forma la sua traiettoria con la perpendicolare alla riva?`),
				solution: `\\beta ${rel(beta, ans)} ${ans}^\\circ`,
				steps: [
					t('Nel triangolo delle velocità la corrente è il cateto opposto a beta, la barca quello adiacente:'),
					`\\tan\\beta = \\dfrac{v_c}{v_b} = \\dfrac{${qty(vc, 'm/s')}}{${qty(vb, 'm/s')}} \\quad\\Rightarrow\\quad \\beta = ${cut(beta)}^\\circ \\approx ${ans}^\\circ`,
				],
				// the complement (the angle with the bank); the sine for the tangent (when it exists)
				answer: choiceOf(rng, degOpt(ans), opts([roundDeg(90 - beta), C < B ? roundDeg(Math.asin(C / B) * RAD) : roundDeg(Math.asin(B / C) * RAD)], degOpt), [n + 4, n - 4, n + 8, n - 8].filter((x) => x > 0 && x < 90).map((x) => degOpt(String(x)))),
				params: { case: 'angolo', vb, vc },
				scene,
				solutionScene,
			};
		}
		const ans = r2(v);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità rispetto alla riva.',
			problem: textBlock(`Una barca va a ${pq(vb, 'm/s')} rispetto all'acqua, con la prua perpendicolare alla riva, su un fiume la cui corrente va a ${pq(vc, 'm/s')}. Quanto vale la sua velocità rispetto alla riva?`),
			solution: `v ${rel(v, ans)} ${qty(ans, 'm/s')}`,
			steps: [
				t('Le due velocità sono perpendicolari: il modulo della somma si trova con il teorema di Pitagora.'),
				`v = \\sqrt{v_b^2 + v_c^2} = \\sqrt{${decTex(vb)}^2 + ${decTex(vc)}^2}\\,\\text{m/s} = ${res(v, ans, 'm/s')}`,
			],
			// the moduli added; the difference of the squares; the boat's own speed
			answer: choiceOf(rng, qOpt(ans, 'm/s'), MS([r2(B + C), B > C ? r2(Math.sqrt(B * B - C * C)) : r2(Math.sqrt(C * C - B * B)), r2(B)]), near(v, 'm/s')),
			params: { case: 'velocità', vb, vc },
			scene,
			solutionScene,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: crossing the river

function level4(rng: Rng): Built {
	const askTime = rng.next() < 0.5;
	for (;;) {
		const vb = dec2(rng, 1.1, 6.0), vc = dec2(rng, 0.5, 3.0), d = dec2(rng, 11, 99);
		const B = Number(vb), C = Number(vc), D = Number(d);
		const T = D / B, x = (C * D) / B, v = Math.hypot(B, C);
		const exact = askTime ? T : x;
		const ans = r2(exact);
		if (ans === null || exact < 1) continue;
		const alt = `Un fiume largo ${lab(d)} metri, con la corrente verso destra a ${lab(vc)} metri al secondo; la barca parte con la prua perpendicolare alla riva, a ${lab(vb)} metri al secondo rispetto all'acqua.`;
		return {
			prompt: askTime ? 'Trova il tempo di attraversamento.' : 'Trova lo spostamento a valle.',
			problem: textBlock(
				`Un fiume è largo ${pq(d, 'm')} e la corrente va a ${pq(vc, 'm/s')}. Una barca che va a ${pq(vb, 'm/s')} rispetto all'acqua parte con la prua perpendicolare alla riva. ${askTime ? "Quanto tempo impiega ad arrivare sull'altra riva?" : 'Di quanti metri la corrente la sposta a valle?'}`,
			),
			solution: askTime ? `t ${rel(T, ans)} ${qty(ans, 's')}` : `x ${rel(x, ans)} ${qty(ans, 'm')}`,
			steps: askTime
				? [t('Il tempo dipende solo dalla velocità della barca, perpendicolare alla riva:'), `t = \\dfrac{d}{v_b} = \\dfrac{${qty(d, 'm')}}{${qty(vb, 'm/s')}} = ${res(T, ans, 's')}`]
				: [`t = \\dfrac{d}{v_b} = \\dfrac{${qty(d, 'm')}}{${qty(vb, 'm/s')}} = ${cutQ(T, 's')}`, t('Nello stesso tempo la corrente porta la barca a valle:'), `x = v_c\\,t = ${qty(vc, 'm/s')} \\cdot ${cutQ(T, 's')} = ${res(x, ans, 'm')}`],
			// time: the width over the resultant, over the current, over the sum; drift: the ratio upside down, the path along the diagonal, the width
			answer: askTime
				? choiceOf(rng, qOpt(ans, 's'), S([r2(D / v), r2(D / C), r2(D / (B + C))]), near(T, 's'))
				: choiceOf(rng, qOpt(ans, 'm'), M([r2((B * D) / C), r2((v * D) / B), r2((C * D) / v)]), near(x, 'm')),
			params: { case: askTime ? 'tempo' : 'valle', vb, vc, d },
			scene: river(alt, { vb, vc, alfa: 0, larghezza: `${lab(d)} m` }),
			solutionScene: river(`${alt} La barca va dritta lungo la diagonale.`, { vb, vc, alfa: 0, larghezza: `${lab(d)} m`, risultante: true }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the bow turned upstream

function level5(rng: Rng): Built {
	const askAngle = rng.next() < 0.5;
	for (;;) {
		const vb = dec2(rng, 1.1, 6.0), vc = dec2(rng, 0.5, 5.0), d = dec2(rng, 11, 99);
		const B = Number(vb), C = Number(vc), D = Number(d);
		const ratio = C / B;
		if (ratio < 0.15 || ratio > 0.9) continue;
		const alpha = Math.asin(ratio) * RAD;
		const v = Math.sqrt(B * B - C * C);
		const T = D / v;
		const alt = `Un fiume largo ${lab(d)} metri, con la corrente verso destra a ${lab(vc)} metri al secondo; la barca, a ${lab(vb)} metri al secondo rispetto all'acqua, punta controcorrente di un angolo alfa (il disegno non è in scala).`;
		const scene = river(alt, { vb, vc, alfa: 30, testoAlfa: 'α', larghezza: `${lab(d)} m` });
		const text = `Un fiume è largo ${pq(d, 'm')} e la corrente va a ${pq(vc, 'm/s')}. Una barca va a ${pq(vb, 'm/s')} rispetto all'acqua e vuole arrivare nel punto proprio di fronte alla partenza.`;
		if (askAngle) {
			const ans = roundDeg(alpha);
			if (ans === null) continue;
			const n = Number(ans);
			return {
				prompt: "Trova l'angolo della prua.",
				problem: textBlock(`${text} Di quale angolo deve inclinare la prua controcorrente, rispetto alla perpendicolare alla riva?`),
				solution: `\\alpha ${rel(alpha, ans)} ${ans}^\\circ`,
				steps: [
					t('La componente controcorrente della velocità della barca deve annullare la corrente:'),
					`\\sin\\alpha = \\dfrac{v_c}{v_b} = \\dfrac{${qty(vc, 'm/s')}}{${qty(vb, 'm/s')}} \\quad\\Rightarrow\\quad \\alpha = ${cut(alpha)}^\\circ \\approx ${ans}^\\circ`,
				],
				// the tangent for the sine; the cosine (the angle with the bank)
				answer: choiceOf(rng, degOpt(ans), opts([roundDeg(Math.atan(ratio) * RAD), roundDeg(Math.acos(ratio) * RAD)], degOpt), [n + 4, n - 4, n + 8, n - 8].filter((x) => x > 0 && x < 90).map((x) => degOpt(String(x)))),
				params: { case: 'angolo', vb, vc, d },
				scene,
				solutionScene: river(`Un fiume largo ${lab(d)} metri; la barca punta controcorrente di ${ans} gradi e va dritta verso la riva opposta.`, { vb, vc, alfa: alpha, testoAlfa: `${ans}°`, larghezza: `${lab(d)} m`, risultante: true }),
			};
		}
		const ans = r2(T);
		if (ans === null) continue;
		return {
			prompt: 'Trova il tempo di attraversamento.',
			problem: textBlock(`${text} Quanto tempo impiega ad attraversare il fiume?`),
			solution: `t ${rel(T, ans)} ${qty(ans, 's')}`,
			steps: [
				t('Con la prua controcorrente la velocità rispetto alla riva è perpendicolare alla riva:'),
				`v = \\sqrt{v_b^2 - v_c^2} = \\sqrt{${decTex(vb)}^2 - ${decTex(vc)}^2}\\,\\text{m/s} = ${cutQ(v, 'm/s')}`,
				`t = \\dfrac{d}{v} = \\dfrac{${qty(d, 'm')}}{${cutQ(v, 'm/s')}} = ${res(T, ans, 's')}`,
			],
			// the boat's own speed (the bow straight across); the sum of the squares; the difference of the speeds
			answer: choiceOf(rng, qOpt(ans, 's'), S([r2(D / B), r2(D / Math.hypot(B, C)), r2(D / (B - C))]), near(T, 's')),
			params: { case: 'tempo', vb, vc, d },
			scene,
			solutionScene: river(`Un fiume largo ${lab(d)} metri; la barca punta controcorrente e va dritta verso la riva opposta.`, { vb, vc, alfa: alpha, larghezza: `${lab(d)} m`, risultante: true }),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if (sample.level >= 3 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisComposizioneMoti: Generator = {
	id: ID,
	title: 'La composizione dei moti',
	levels: {
		1: { label: 'Velocità nella stessa direzione', constraints: ['stesso verso o versi opposti, metà ciascuno', 'risultato da 1,0 a 9,9 m/s'] },
		2: { label: 'Con la corrente e contro', constraints: ['verso valle o verso monte, metà ciascuno', 'la corrente più lenta della canoa di almeno 0,8 m/s'] },
		3: { label: 'Velocità perpendicolari', constraints: ['prua perpendicolare alla riva', 'modulo della velocità o angolo della traiettoria'] },
		4: { label: 'Attraversare il fiume', constraints: ['prua perpendicolare alla riva', 'tempo di attraversamento o spostamento a valle'] },
		5: { label: 'La prua controcorrente', constraints: ['la corrente tra il 15% e il 90% della velocità della barca', 'angolo della prua o tempo di attraversamento'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisComposizioneMoti;
