/**
 * Le trasformazioni di Galileo e la composizione delle velocità. Spec: specs/exercises/fis-trasformazioni-galileo.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/73-fis-trasformazioni-galileo.md), each one step harder:
 * a position from one frame to the other, x = x' + V t or x' = x − V t; the velocity of a vehicle seen from another on
 * the same road, v' = v − V with the signs; the time to catch up or to meet, from the relative velocity; two
 * perpendicular velocities (the rain seen from a car), modulus or angle; a sum by components (a motorboat on a
 * ferry's radar); a ball thrown straight up on a train, how far it travels for the platform. Levels 1 and 2 have
 * exact whole answers, the others two significant figures (angles to the degree). Distractors from the lesson's
 * warnings: the sign in front of V t, moduli added whatever the directions, the relative velocity taken as a sum.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { type Built, type SceneVec, G, RAD, checkBasic, choiceOf, cut, cutQ, dec2, decTex, degOpt, generateWith, lab, pick2, pickExact, pqU, qu, r2, rel, res, roundDeg, scene, t } from '../fis-riferimenti';

export const ID = 'fis-trasformazioni-galileo';

const whole = (rng: Rng, lo: number, hi: number) => {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return k;
	}
};
const m = (k: number, unit: string) => pqU(String(k), unit);
const q = (k: number, unit: string) => qu(String(k), unit);

// ---------------------------------------------------------------------------
// Level 1: positions

function level1(rng: Rng): Built {
	const toPlatform = rng.next() < 0.5;
	for (;;) {
		const V = whole(rng, 11, 35), T = rng.int(2, 9);
		const tt = `${T}.0`;
		const head = `Un treno passa lungo una banchina a ${m(V, 'm/s')}; le origini dei due sistemi di riferimento coincidono nell'istante zero.`;
		if (toPlatform) {
			const xp = whole(rng, 11, 99);
			const x = xp + V * T;
			if (x % 10 === 0 || xp === V * T) continue;
			return {
				prompt: 'Trova la posizione rispetto alla banchina.',
				problem: textBlock(`${head} Un passeggero è seduto a ${m(xp, 'm')} dall'origine del treno, verso la testa. A quale distanza dall'origine della banchina si trova dopo ${pqU(tt, 's')}?`),
				solution: `x = ${q(x, 'm')}`,
				steps: [t('Si conosce la coordinata nel treno e si cerca quella sulla banchina: si aggiunge il tratto percorso dal treno.'), `x = x' + V\\,t = ${q(xp, 'm')} + ${q(V, 'm/s')} \\cdot ${qu(tt, 's')} = ${q(x, 'm')}`],
				// the sign swapped; the train's displacement alone; the coordinate left as it is
				answer: pickExact(rng, x, 'm', [Math.abs(xp - V * T), V * T, xp], 0),
				params: { case: 'banchina', V: String(V), t: tt, xp: String(xp) },
			};
		}
		const x = whole(rng, 151, 399);
		const xp = x - V * T;
		if (xp < 5 || xp % 10 === 0 || xp === V * T) continue;
		return {
			prompt: 'Trova la posizione rispetto al treno.',
			problem: textBlock(`${head} Un semaforo si trova a ${m(x, 'm')} dall'origine della banchina, davanti al treno. A quale distanza dall'origine del treno si trova dopo ${pqU(tt, 's')}?`),
			solution: `x' = ${q(xp, 'm')}`,
			steps: [t('Si conosce la coordinata sulla banchina e si cerca quella nel treno: si toglie il tratto percorso dal treno.'), `x' = x - V\\,t = ${q(x, 'm')} - ${q(V, 'm/s')} \\cdot ${qu(tt, 's')} = ${q(xp, 'm')}`],
			// the sign swapped; the train's displacement alone; the coordinate left as it is
			answer: pickExact(rng, xp, 'm', [x + V * T, V * T, x], 0),
			params: { case: 'treno', V: String(V), t: tt, x: String(x) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the velocity of a vehicle seen from another

function level2(rng: Rng): Built {
	const same = rng.next() < 0.5;
	for (;;) {
		const v = whole(rng, 21, 39), V = whole(rng, 11, 37);
		if (V > v - 2) continue;
		const ans = same ? v - V : v + V;
		if (ans % 10 === 0 || ans === V || ans === v) continue;
		return {
			prompt: "Trova la velocità dell'auto rispetto al furgone.",
			problem: textBlock(`Su una strada rettilinea un'auto viaggia a ${m(v, 'm/s')} e un furgone a ${m(V, 'm/s')}, ${same ? 'nello stesso verso' : 'in versi opposti'}. Quanto vale, in modulo, la velocità dell'auto rispetto al furgone?`),
			solution: `v' = ${q(ans, 'm/s')}`,
			steps: [
				t("Il sistema S' è il furgone: la velocità dell'auto vista dal furgone è v' = v - V, con i segni."),
				same
					? `v' = ${q(v, 'm/s')} - ${q(V, 'm/s')} = ${q(ans, 'm/s')}`
					: `v' = ${q(v, 'm/s')} - (-${q(V, 'm/s')}) = ${q(ans, 'm/s')}`,
				t(same ? 'Le due velocità hanno lo stesso segno: i moduli si sottraggono.' : 'Le due velocità hanno segni opposti: i moduli si sommano.'),
			],
			// the other operation; each velocity alone
			answer: pickExact(rng, ans, 'm/s', [same ? v + V : v - V, v, V], 0),
			params: { case: same ? 'stesso verso' : 'versi opposti', v: String(v), V: String(V) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: catching up, meeting

function level3(rng: Rng): Built {
	const same = rng.next() < 0.5;
	for (;;) {
		const v = whole(rng, 21, 39), V = whole(rng, 11, 36), d = dec2(rng, 11, 99);
		if (V > v - 3) continue;
		const D = Number(d);
		const vr = same ? v - V : v + V;
		const x = D / vr;
		const ans = r2(x);
		if (ans === null || x < 1) continue;
		const text = same
			? `Su una strada rettilinea un'auto viaggia a ${m(v, 'm/s')} e un furgone a ${m(V, 'm/s')}, nello stesso verso; l'auto è ${pqU(d, 'm')} dietro il furgone. Dopo quanto tempo lo raggiunge?`
			: `Su una strada rettilinea un'auto viaggia a ${m(v, 'm/s')} e un furgone a ${m(V, 'm/s')}, in versi opposti, uno verso l'altro; sono distanti ${pqU(d, 'm')}. Dopo quanto tempo si incontrano?`;
		return {
			prompt: 'Trova il tempo.',
			problem: textBlock(text),
			solution: `t ${rel(x, ans)} ${qu(ans, 's')}`,
			steps: [
				t("Nel sistema del furgone il furgone è fermo e l'auto si avvicina con la velocità relativa:"),
				same ? `v' = ${q(v, 'm/s')} - ${q(V, 'm/s')} = ${q(vr, 'm/s')}` : `v' = ${q(v, 'm/s')} + ${q(V, 'm/s')} = ${q(vr, 'm/s')}`,
				`t = \\dfrac{d}{v'} = \\dfrac{${qu(d, 'm')}}{${q(vr, 'm/s')}} = ${res(x, ans, 's')}`,
			],
			// the other operation; the car's speed alone; the van's speed alone
			answer: pick2(rng, ans, 's', x, [D / (same ? v + V : v - V), D / v, D / V]),
			params: { case: same ? 'raggiunge' : 'incontro', v: String(v), V: String(V), d },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: perpendicular velocities, the rain seen from a car

function rain(alt: string, v: string, V: string, solved: boolean): SceneRef {
	const a = Number(v), b = Number(V);
	const u = Math.round((3 / Math.max(a, b)) * 10000) / 10000;
	const gap = Math.max(a, b) * 0.3;
	const vettori: SceneVec[] = [{ da: [0, 0], a: [0, -a], nome: 'v', colore: 'velocita', etichetta: `${lab(v)} m/s` }];
	if (solved) vettori.push({ da: [0, -a], a: [-b, -a], nome: 'V', meno: true, colore: 'velocita' }, { da: [0, 0], a: [-b, -a], nome: 'v′', colore: 'risultante' });
	else vettori.push({ da: [gap, 0], a: [gap + b, 0], nome: 'V', colore: 'velocita', etichetta: `${lab(V)} m/s` });
	return scene(alt, { u, vettori });
}

function level4(rng: Rng): Built {
	const askAngle = rng.next() < 0.5;
	for (;;) {
		const v = dec2(rng, 4.0, 9.9), V = dec2(rng, 5.0, 30);
		const a = Number(v), b = Number(V);
		const vp = Math.hypot(a, b);
		const beta = Math.atan(b / a) * RAD;
		const head = `Non c'è vento e la pioggia cade in verticale a ${pqU(v, 'm/s')}. Un'auto viaggia su una strada orizzontale a ${pqU(V, 'm/s')}.`;
		const alt = `La velocità della pioggia rispetto alla strada, verticale verso il basso, di ${lab(v)} metri al secondo, e la velocità dell'auto, orizzontale verso destra, di ${lab(V)} metri al secondo.`;
		const sc = rain(alt, v, V, false);
		const sol = rain(`Il triangolo delle velocità: la velocità della pioggia verso il basso, il vettore meno V verso sinistra dalla sua punta, e la loro somma, la velocità della pioggia rispetto all'auto.`, v, V, true);
		const first = t("La velocità della pioggia rispetto all'auto è v' = v - V: alla velocità verticale si somma -V, orizzontale. I due vettori sono perpendicolari.");
		if (askAngle) {
			const ans = roundDeg(beta);
			if (ans === null || beta < 20 || beta > 85) continue;
			const n = Number(ans);
			const others = [roundDeg(90 - beta), roundDeg(Math.asin(Math.min(a, b) / Math.max(a, b)) * RAD)].filter((x): x is string => x !== null).map(degOpt);
			return {
				prompt: "Trova l'inclinazione della pioggia.",
				problem: textBlock(`${head} Di quale angolo, rispetto alla verticale, chi è in auto vede inclinata la pioggia?`),
				solution: `\\beta ${rel(beta, ans)} ${ans}^\\circ`,
				steps: [first, `\\tan\\beta = \\dfrac{V}{v} = \\dfrac{${qu(V, 'm/s')}}{${qu(v, 'm/s')}} = ${cut(b / a)} \\quad\\Rightarrow\\quad \\beta = ${cut(beta)}^\\circ \\approx ${ans}^\\circ`],
				// the angle with the horizontal; the sine for the tangent
				answer: choiceOf(rng, degOpt(ans), others, [n - 4, n + 4, n - 8, n - 12].filter((x) => x > 0 && x < 90).map((x) => degOpt(String(x)))),
				params: { case: 'angolo', v, V },
				scene: sc,
				solutionScene: sol,
			};
		}
		const ans = r2(vp);
		if (ans === null) continue;
		return {
			prompt: "Trova la velocità della pioggia rispetto all'auto.",
			problem: textBlock(`${head} Con quale velocità chi è in auto vede cadere la pioggia?`),
			solution: `v' ${rel(vp, ans)} ${qu(ans, 'm/s')}`,
			steps: [first, `v' = \\sqrt{v^2 + V^2} = \\sqrt{${decTex(v)}^2 + ${decTex(V)}^2}\\,\\text{m/s} = ${res(vp, ans, 'm/s')}`],
			// the moduli added; the moduli subtracted; the car's speed
			answer: pick2(rng, ans, 'm/s', vp, [a + b, Math.abs(a - b), b]),
			params: { case: 'velocità', v, V },
			scene: sc,
			solutionScene: sol,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: by components

function level5(rng: Rng): Built {
	for (;;) {
		const V = dec2(rng, 2.0, 9.9), ax = dec2(rng, 1.1, 9.9), vy = dec2(rng, 1.1, 9.9);
		const vxp = rng.next() < 0.5 ? `-${ax}` : ax;
		const b = Number(V), px = Number(vxp), py = Number(vy);
		const vx = px + b;
		if (Math.abs(vx) < 0.45) continue;
		const x = Math.hypot(vx, py);
		const ans = r2(x);
		if (ans === null) continue;
		const u = Math.round((3 / Math.max(b, Math.abs(vx), py, Math.abs(px))) * 10000) / 10000;
		const given: SceneVec[] = [
			{ da: [0, 0], a: [b, 0], nome: 'V', colore: 'velocita' },
			{ da: [b, 0], a: [vx, py], nome: 'v′', colore: 'velocita' },
		];
		const alt = `La velocità del traghetto, orizzontale verso destra, e dalla sua punta la velocità del motoscafo vista dal radar, di componenti ${lab(vxp).replace('-', 'meno ')} e ${lab(vy)} metri al secondo.`;
		const vxTex = cut(vx);
		return {
			prompt: 'Trova la velocità rispetto al mare.',
			problem: textBlock(`Il radar di un traghetto, che naviga verso est a ${pqU(V, 'm/s')}, vede un motoscafo muoversi con velocità di componenti $v'_x = ${qu(vxp, 'm/s')}$ e $v'_y = ${qu(vy, 'm/s')}$ (asse x verso est, asse y verso nord). Quanto vale la velocità del motoscafo rispetto al mare?`),
			solution: `v ${rel(x, ans)} ${qu(ans, 'm/s')}`,
			steps: [
				t("Il radar misura la velocità rispetto al traghetto, che è il sistema S'. Si sommano le componenti:"),
				`v_x = v'_x + V_x = ${qu(vxp, 'm/s')} + ${qu(V, 'm/s')} = ${vxTex}\\,\\text{m/s} \\qquad v_y = v'_y = ${qu(vy, 'm/s')}`,
				`v = \\sqrt{v_x^2 + v_y^2} = \\sqrt{(${vxTex})^2 + ${decTex(vy)}^2}\\,\\text{m/s} = ${res(x, ans, 'm/s')}`,
			],
			// the ferry forgotten; the sign of V swapped; the components added; the moduli added
			answer: pick2(rng, ans, 'm/s', x, [Math.hypot(px, py), Math.hypot(px - b, py), Math.abs(vx) + py, Math.hypot(px, py) + b]),
			params: { V, vxp, vyp: vy },
			scene: scene(alt, { u, vettori: given }),
			solutionScene: scene(`${alt} La loro somma è la velocità del motoscafo rispetto al mare.`, { u, vettori: [...given, { da: [0, 0], a: [vx, py], nome: 'v', colore: 'risultante' }] }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: a ball thrown straight up on a train

function level6(rng: Rng): Built {
	for (;;) {
		const V = dec2(rng, 5.0, 30), v0 = dec2(rng, 2.0, 9.9);
		const b = Number(V), a = Number(v0);
		const T = (2 * a) / G;
		const x = b * T;
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: 'Trova lo spostamento rispetto alla banchina.',
			problem: textBlock(`Su un treno che viaggia a ${pqU(V, 'm/s')} una ragazza lancia una palla verso l'alto, in verticale rispetto al treno, a ${pqU(v0, 'm/s')}, e la riprende alla stessa altezza. Di quanto avanza la palla rispetto alla banchina durante il volo?`),
			solution: `\\Delta x ${rel(x, ans)} ${qu(ans, 'm')}`,
			steps: [
				t('Rispetto al treno è un lancio verticale: il tempo di volo è lo stesso per i due osservatori.'),
				`t = \\dfrac{2\\,v'_0}{g} = \\dfrac{2 \\cdot ${qu(v0, 'm/s')}}{9{,}8\\,\\text{m/s}^2} = ${cutQ(T, 's')}`,
				t('Rispetto alla banchina la palla conserva la velocità orizzontale del treno:'),
				`\\Delta x = V\\,t = ${qu(V, 'm/s')} \\cdot ${cutQ(T, 's')} = ${res(x, ans, 'm')}`,
			],
			// only the way up; the launch speed for the train's; the maximum height; V times v0
			answer: pick2(rng, ans, 'm', x, [x / 2, (2 * a * a) / G, (a * a) / (2 * G), b * a]),
			params: { V, v0 },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkBasic(sample);
	if ((sample.level === 4 || sample.level === 5) && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisTrasformazioniGalileo: Generator = {
	id: ID,
	title: 'Le trasformazioni di Galileo e la composizione delle velocità',
	levels: {
		1: { label: "Da un sistema all'altro: la posizione", constraints: ['dal treno alla banchina o dalla banchina al treno, metà ciascuno', 'risultati interi, esatti'] },
		2: { label: 'La velocità di un veicolo vista da un altro', constraints: ['stesso verso o versi opposti, metà ciascuno', 'risultati interi, esatti'] },
		3: { label: 'Raggiungersi e incontrarsi', constraints: ['stesso verso o versi opposti, metà ciascuno', 'tempo di almeno 1 s'] },
		4: { label: "La pioggia vista dall'auto", constraints: ['velocità perpendicolari', "modulo o angolo con la verticale, metà ciascuno"] },
		5: { label: 'Velocità per componenti', constraints: ["una componente di v' può essere negativa", 'somma per componenti, poi il modulo'] },
		6: { label: 'La palla lanciata sul treno', constraints: ['lancio verticale rispetto al treno', 'spostamento rispetto alla banchina'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisTrasformazioniGalileo;
