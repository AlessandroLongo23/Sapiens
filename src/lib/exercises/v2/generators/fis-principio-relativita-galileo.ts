/**
 * Il principio di relatività galileiana. Spec: specs/exercises/fis-principio-relativita-galileo.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/74-fis-principio-relativita-galileo.md), each one step
 * harder: the acceleration of a car measured from a train at constant velocity (the same as from the road); the total
 * force on a cart pushed on a train, for an observer on the ground (the same as for the passenger); the same
 * experiment repeated on a train, its result relative to the train's bench or to the ground; which quantity is
 * invariant and which is relative; the stone dropped from a ship's mast seen from the shore (how far it travels, how
 * fast it lands); the kinetic energy gained by a cart pushed on a train, for the ground. Two significant figures,
 * except level 3 (exact sums). Distractors from the lesson's warnings: the train's velocity put where it does not
 * belong, the two frames mixed, "everything is relative".
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock, shuffle } from '../insiemi';
import { type Built, G, checkBasic, cutQ, dec2, decTex, exactDec, generateWith, pick2, pickExact, pickWords, pqU, qu, r2, rel, res, t } from '../fis-riferimenti';

export const ID = 'fis-principio-relativita-galileo';

const whole = (rng: Rng, lo: number, hi: number) => {
	for (;;) {
		const k = rng.int(lo, hi);
		if (k % 10) return k;
	}
};

// ---------------------------------------------------------------------------
// Level 1: the same acceleration

function level1(rng: Rng): Built {
	for (;;) {
		const v1 = whole(rng, 11, 25), dv = rng.int(2, 12), dt = dec2(rng, 2.0, 9.9);
		const v2 = v1 + dv;
		if (v2 % 10 === 0) continue;
		const V = whole(rng, 5, v1 - 2);
		const T = Number(dt);
		const x = dv / T;
		const ans = r2(x);
		if (ans === null) continue;
		const s = (k: number) => qu(String(k), 'm/s');
		return {
			prompt: "Trova l'accelerazione misurata dal treno.",
			problem: textBlock(`Vista dalla strada, un'auto passa da ${pqU(String(v1), 'm/s')} a ${pqU(String(v2), 'm/s')} in ${pqU(dt, 's')}. Quale accelerazione dell'auto misura un passeggero di un treno che viaggia nello stesso verso a ${pqU(String(V), 'm/s')} costanti?`),
			solution: `a' ${rel(x, ans)} ${qu(ans, 'm/s^2')}`,
			steps: [
				t("Viste dal treno le velocità dell'auto sono v' = v - V:"),
				`v'_1 = ${s(v1)} - ${s(V)} = ${s(v1 - V)} \\qquad v'_2 = ${s(v2)} - ${s(V)} = ${s(v2 - V)}`,
				`a' = \\dfrac{v'_2 - v'_1}{\\Delta t} = \\dfrac{${s(dv)}}{${qu(dt, 's')}} = ${res(x, ans, 'm/s^2')}`,
				t("È la stessa accelerazione che si misura dalla strada: il treno è un sistema inerziale."),
			],
			// the train's velocity taken off once; the final velocity alone; the train's velocity added
			answer: pick2(rng, ans, 'm/s^2', x, [(v2 - V) / T, v2 / T, (dv + V) / T, (v1 - V) / T]),
			params: { v1: String(v1), v2: String(v2), dt, V: String(V) },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the same force

function level2(rng: Rng): Built {
	for (;;) {
		const V = dec2(rng, 11, 35), m = dec2(rng, 0.11, 0.99), vp = dec2(rng, 1.1, 5.0), dt = dec2(rng, 0.5, 3.0);
		const b = Number(V), M = Number(m), u = Number(vp), T = Number(dt);
		const x = (M * u) / T;
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: 'Trova la forza totale vista da terra.',
			problem: textBlock(`Su un treno che viaggia a ${pqU(V, 'm/s')} costanti un carrello di ${pqU(m, 'kg')}, fermo su un banco senza attrito, viene spinto e in ${pqU(dt, 's')} raggiunge ${pqU(vp, 'm/s')} rispetto al treno. Quanto vale la forza totale sul carrello per chi guarda da terra?`),
			solution: `F_{tot} ${rel(x, ans)} ${qu(ans, 'N')}`,
			steps: [
				t("L'accelerazione è la stessa nei due sistemi inerziali, e si calcola con le velocità rispetto al treno:"),
				`a = a' = \\dfrac{\\Delta v'}{\\Delta t} = \\dfrac{${qu(vp, 'm/s')}}{${qu(dt, 's')}} = ${cutQ(u / T, 'm/s^2')}`,
				`F_{tot} = m\\,a = ${qu(m, 'kg')} \\cdot ${cutQ(u / T, 'm/s^2')} = ${res(x, ans, 'N')}`,
				t('Massa e accelerazione sono le stesse per i due osservatori, e quindi anche la forza totale.'),
			],
			// the train's velocity added to the final one; the train's velocity alone; the product with the time; m v'
			answer: pick2(rng, ans, 'N', x, [(M * (b + u)) / T, (M * b) / T, M * u * T, M * u]),
			params: { V, m, vp, dt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the same experiment gives the same result

function level3(rng: Rng): Built {
	const bench = rng.next() < 0.5;
	for (;;) {
		const u = dec2(rng, 1.1, 4.9), V = dec2(rng, 5.1, 9.9);
		const a = Number(u), b = Number(V);
		const sum = Math.round((a + b) * 10) / 10;
		if (!bench && Number.isInteger(sum) && sum % 10 === 0) continue;
		const ans = bench ? a : sum;
		const head = `In un laboratorio a terra una molla lancia un carrello, che parte a ${pqU(u, 'm/s')} rispetto al banco. Lo stesso esperimento viene rifatto, identico, su un treno che viaggia a ${pqU(V, 'm/s')} costanti su un rettilineo, con il carrello lanciato nel verso di marcia.`;
		const tex = (x: number) => qu(exactDec(x, 1), 'm/s');
		return {
			prompt: bench ? 'Trova la velocità rispetto al banco del treno.' : 'Trova la velocità rispetto al suolo.',
			problem: textBlock(`${head} Con quale velocità parte il carrello rispetto ${bench ? 'al banco del treno' : 'al suolo'}?`),
			solution: `${bench ? "v'" : 'v'} = ${tex(ans)}`,
			steps: bench
				? [t('Il treno a velocità costante è un sistema inerziale: lo stesso esperimento dà lo stesso risultato che a terra.'), `v' = ${qu(u, 'm/s')}`, t('La velocità del treno non entra nel risultato.')]
				: [t('Rispetto al banco del treno il carrello parte come a terra, perché il treno è un sistema inerziale:'), `v' = ${qu(u, 'm/s')}`, t('Rispetto al suolo si aggiunge la velocità del treno:'), `v = v' + V = ${qu(u, 'm/s')} + ${qu(V, 'm/s')} = ${tex(sum)}`],
			// the velocities added or not; the train's alone; the difference
			answer: pickExact(rng, ans, 'm/s', bench ? [sum, Math.round((b - a) * 10) / 10, b] : [a, b, Math.round((b - a) * 10) / 10], 1),
			params: { case: bench ? 'banco' : 'suolo', u, V },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: invariant or relative

const INV: [string, string][] = [
	['accelerazione', "l'accelerazione"],
	['forza', 'la forza totale'],
	['massa', 'la massa'],
	['durata', 'la durata del moto'],
];
const REL: [string, string][] = [
	['velocita', 'la velocità finale'],
	['spostamento', 'lo spostamento'],
	['energia', "l'energia cinetica finale"],
	['posizione', 'la posizione finale'],
];
const BODIES = ['un carrello che accelera sul pavimento del treno', 'una valigia che scivola sul pavimento del treno e si ferma', "un'auto che accelera su una strada accanto ai binari"];
const KMH = ['72', '108', '126', '144', '162', '198', '216', '252'];

function level4(rng: Rng): Built {
	const askInv = rng.next() < 0.5;
	const [one, three] = askInv ? [INV, REL] : [REL, INV];
	const right = rng.pick(one);
	const others = shuffle(rng, three).slice(0, 3);
	return {
		prompt: askInv ? 'Quale grandezza è invariante?' : 'Quale grandezza è relativa?',
		problem: textBlock(
			`Un osservatore sulla banchina e uno su un treno che viaggia a ${pqU(rng.pick(KMH), 'km/h')} costanti su un rettilineo studiano ${rng.pick(BODIES)}. ${askInv ? 'Quale di queste grandezze ha lo stesso valore per tutti e due?' : 'Quale di queste grandezze ha valori diversi per i due osservatori?'}`,
		),
		solution: t(right[1]),
		steps: [
			t('I due sistemi sono inerziali. Sono invarianti gli intervalli di tempo, le lunghezze, la massa, la accelerazione e la forza; sono relative la posizione, lo spostamento, la velocità e la energia cinetica.'.replace('la accelerazione', "l'accelerazione").replace('la energia', "l'energia")),
			t(askInv ? 'Tra le quattro, la sola grandezza invariante è questa:' : 'Tra le quattro, la sola grandezza relativa è questa:'),
			t(right[1]),
		],
		answer: pickWords(rng, right[0], [right, ...others]),
		params: { case: askInv ? 'invariante' : 'relativa' },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the stone dropped from the mast, seen from the shore

function level5(rng: Rng): Built {
	const askX = rng.next() < 0.5;
	for (;;) {
		const V = dec2(rng, 2.0, 9.9), h = dec2(rng, 5.0, 30);
		const b = Number(V), H = Number(h);
		const T = Math.sqrt((2 * H) / G);
		const vy = Math.sqrt(2 * G * H);
		const head = `Una nave viaggia a ${pqU(V, 'm/s')} costanti. Dalla cima dell'albero, alta ${pqU(h, 'm')} sul ponte, viene lasciato cadere un sasso.`;
		if (askX) {
			const x = b * T;
			const ans = r2(x);
			if (ans === null) continue;
			return {
				prompt: 'Trova lo spostamento rispetto alla riva.',
				problem: textBlock(`${head} Di quanto avanza il sasso rispetto alla riva durante la caduta?`),
				solution: `\\Delta x ${rel(x, ans)} ${qu(ans, 'm')}`,
				steps: [
					t('Il tempo di caduta è lo stesso per la nave e per la riva:'),
					`t = \\sqrt{\\dfrac{2\\,h}{g}} = \\sqrt{\\dfrac{2 \\cdot ${qu(h, 'm')}}{9{,}8\\,\\text{m/s}^2}} = ${cutQ(T, 's')}`,
					t('Per la riva il sasso parte con la velocità orizzontale della nave e la conserva:'),
					`\\Delta x = V\\,t = ${qu(V, 'm/s')} \\cdot ${cutQ(T, 's')} = ${res(x, ans, 'm')}`,
					t("Anche l'albero avanza dello stesso tratto: il sasso cade ai suoi piedi."),
				],
				// the root forgotten; the 2 forgotten; the time read as metres; V h / g
				answer: pick2(rng, ans, 'm', x, [(b * 2 * H) / G, b * Math.sqrt(H / G), T, (b * H) / G]),
				params: { case: 'spostamento', V, h },
			};
		}
		const x = Math.hypot(b, vy);
		const ans = r2(x);
		if (ans === null) continue;
		return {
			prompt: 'Trova la velocità di arrivo vista dalla riva.',
			problem: textBlock(`${head} Con quale velocità tocca il ponte, per chi guarda dalla riva?`),
			solution: `v ${rel(x, ans)} ${qu(ans, 'm/s')}`,
			steps: [
				t('Per la nave il sasso cade in verticale, e arriva con'),
				`v' = \\sqrt{2\\,g\\,h} = \\sqrt{2 \\cdot 9{,}8\\,\\text{m/s}^2 \\cdot ${qu(h, 'm')}} = ${cutQ(vy, 'm/s')}`,
				t('Per la riva a questa velocità verticale si somma quella orizzontale della nave, perpendicolare:'),
				`v = \\sqrt{V^2 + v'^2} = \\sqrt{V^2 + 2\\,g\\,h} = \\sqrt{${decTex(V)}^2 + 2 \\cdot 9{,}8 \\cdot ${decTex(h)}}\\,\\text{m/s} = ${res(x, ans, 'm/s')}`,
			],
			// the ship's frame; the moduli added; the ship's speed; the 2 forgotten
			answer: pick2(rng, ans, 'm/s', x, [vy, b + vy, b, Math.hypot(b, Math.sqrt(G * H))]),
			params: { case: 'velocità', V, h },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the kinetic energy in the two frames

function level6(rng: Rng): Built {
	for (;;) {
		const V = dec2(rng, 11, 30), m = dec2(rng, 0.11, 0.99), vp = dec2(rng, 1.1, 5.0);
		const b = Number(V), M = Number(m), u = Number(vp);
		const x = (M * ((b + u) ** 2 - b * b)) / 2;
		const ans = r2(x);
		if (ans === null) continue;
		const vf = exactDec(b + u, 1);
		return {
			prompt: "Trova la variazione di energia cinetica vista da terra.",
			problem: textBlock(`Su un treno che viaggia a ${pqU(V, 'm/s')} costanti un carrello di ${pqU(m, 'kg')}, fermo rispetto al treno, viene spinto nel verso di marcia fino a raggiungere ${pqU(vp, 'm/s')} rispetto al treno. Di quanto aumenta la sua energia cinetica per chi guarda da terra?`),
			solution: `\\Delta K ${rel(x, ans)} ${qu(ans, 'J')}`,
			steps: [
				t('Per chi guarda da terra le velocità del carrello sono quelle rispetto al treno più la velocità del treno:'),
				`v_1 = ${qu(V, 'm/s')} \\qquad v_2 = ${qu(vp, 'm/s')} + ${qu(V, 'm/s')} = ${qu(vf, 'm/s')}`,
				`\\Delta K = \\dfrac{1}{2}\\,m\\,(v_2^2 - v_1^2) = \\dfrac{1}{2} \\cdot ${qu(m, 'kg')} \\cdot (${decTex(vf)}^2 - ${decTex(V)}^2)\\,\\text{m}^2/\\text{s}^2 = ${res(x, ans, 'J')}`,
				t("Per il passeggero la variazione è più piccola: l'energia cinetica è una grandezza relativa."),
			],
			// the passenger's value; the final kinetic energy; the train's kinetic energy
			answer: pick2(rng, ans, 'J', x, [(M * u * u) / 2, (M * (b + u) ** 2) / 2, (M * b * b) / 2]),
			params: { V, m, vp },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

const check = (sample: Sample): string[] => checkBasic(sample);

export const fisPrincipioRelativitaGalileo: Generator = {
	id: ID,
	title: 'Il principio di relatività galileiana',
	levels: {
		1: { label: 'La stessa accelerazione', constraints: ['auto vista dalla strada e da un treno a velocità costante', 'il treno va nello stesso verso, più piano'] },
		2: { label: 'La stessa forza', constraints: ['carrello spinto su un treno', 'forza totale per chi guarda da terra'] },
		3: { label: 'Lo stesso esperimento sul treno', constraints: ['velocità rispetto al banco del treno o rispetto al suolo, metà ciascuno', 'risultati esatti, con un decimale'] },
		4: { label: 'Invariante o relativa', constraints: ['una grandezza invariante tra tre relative, o il contrario: metà ciascuno'] },
		5: { label: "Il sasso dall'albero visto dalla riva", constraints: ['spostamento orizzontale o velocità di arrivo, metà ciascuno', 'albero da 5,0 a 30 m'] },
		6: { label: "L'energia cinetica vista da terra", constraints: ['carrello spinto nel verso di marcia', 'risultato sotto 100 J'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisPrincipioRelativitaGalileo;
