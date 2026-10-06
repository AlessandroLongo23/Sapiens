/**
 * La portata e l'equazione di continuità. Spec: specs/exercises/fis-portata-continuita.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/98-fis-portata-continuita.md), each one step harder: the
 * flow rate from a volume and a time; from the section and the speed, with cm² to convert; the continuity equation
 * with the sections; with the diameters, whose ratio is squared; the flow rate of a round pipe in litres per minute;
 * a pipe that splits into equal branches. Data with two significant figures, answers with two, in L/s, L/min or m/s.
 * Distractors from the lesson's warnings: the ratio upside down, the diameters not squared, the diameter taken for
 * the radius, the minutes forgotten, cm² put in as they are.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, checkCommon, cut, d2, generateWith, lab, pick4, pq, qu, rs, t, textBlock, tubo } from '../fis-fluidi-moto';

export const ID = 'fis-portata-continuita';

// ---------------------------------------------------------------------------
// Level 1: q = ΔV / Δt

const VESSELS = [
	['Un rubinetto riempie una tanica da', 'Qual è la portata del rubinetto?'],
	['Una pompa riempie un bidone da', 'Qual è la portata della pompa?'],
	['Una fontana riempie un secchio da', 'Qual è la portata della fontana?'],
] as const;

function level1(rng: Rng): Built {
	for (;;) {
		const [start, ask] = rng.pick(VESSELS);
		const V = d2(rng, 11, 99);
		const dt = d2(rng, 11, 99);
		const exact = Number(V) / Number(dt);
		const ans = rs(exact);
		if (ans === null) continue;
		return {
			prompt: 'Calcola la portata.',
			problem: textBlock(`${start} ${pq(V, 'L')} in ${pq(dt, 's')}. ${ask}`),
			solution: `q \\approx ${qu(ans, 'L/s')}`,
			steps: [`q = \\dfrac{\\Delta V}{\\Delta t} = \\dfrac{${qu(V, 'L')}}{${qu(dt, 's')}} = ${cut(exact)}\\,\\text{L/s} \\approx ${qu(ans, 'L/s')}`],
			// the ratio upside down; as if the time were in minutes; the product
			answer: pick4(rng, ans, 'L/s', [Number(dt) / Number(V), exact * 60, exact / 60]),
			params: { V, dt },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: q = S · v, with the section in cm²

function level2(rng: Rng): Built {
	for (;;) {
		const S = d2(rng, 1.1, 25);
		const v = d2(rng, 0.5, 6);
		const exact = (Number(S) * Number(v)) / 10;
		const ans = rs(exact);
		if (ans === null) continue;
		return {
			prompt: 'Calcola la portata.',
			problem: textBlock(`In un tubo di sezione ${pq(S, 'cm2')} l'acqua scorre alla velocità di ${pq(v, 'm/s')}. Qual è la portata, in litri al secondo?`),
			solution: `q \\approx ${qu(ans, 'L/s')}`,
			steps: [
				`S = ${qu(S, 'cm2')} = ${decimal(Number(S))} \\cdot 10^{-4}\\,\\text{m}^2`,
				`q = S \\cdot v = ${decimal(Number(S))} \\cdot 10^{-4}\\,\\text{m}^2 \\cdot ${qu(v, 'm/s')} = ${cut(Number(S) * Number(v))} \\cdot 10^{-4}\\,\\text{m}^3/\\text{s}`,
				`1\\,\\text{m}^3/\\text{s} = 10^{3}\\,\\text{L/s} \\quad\\Rightarrow\\quad q \\approx ${qu(ans, 'L/s')}`,
			],
			// cm² put in as they are; cm² taken for 10⁻² m²; the section divided by the speed
			answer: pick4(rng, ans, 'L/s', [exact * 10, exact * 100, Number(S) / Number(v) / 10]),
			params: { S, v },
		};
	}
}

const decimal = (x: number) => String(x).replace('.', '{,}');

// ---------------------------------------------------------------------------
// Level 3: S1 v1 = S2 v2

function level3(rng: Rng): Built {
	const narrows = rng.next() < 0.7;
	for (;;) {
		const big = d2(rng, 3, 30);
		const small = d2(rng, 1.1, 12);
		const ratio = Number(big) / Number(small);
		if (ratio < 1.5 || ratio > 8) continue;
		const [S1, S2] = narrows ? [big, small] : [small, big];
		const v1 = d2(rng, narrows ? 0.3 : 1.5, narrows ? 3 : 9);
		const exact = (Number(v1) * Number(S1)) / Number(S2);
		const ans = rs(exact);
		if (ans === null) continue;
		const then = narrows ? 'si stringe fino a' : 'si allarga fino a';
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(`In un tubo di sezione ${pq(S1, 'cm2')} l'acqua scorre a ${pq(v1, 'm/s')}. Più avanti il tubo ${then} una sezione di ${pq(S2, 'cm2')}. Con che velocità scorre l'acqua nel secondo tratto?`),
			solution: `v_2 \\approx ${qu(ans, 'm/s')}`,
			steps: [
				t('La portata è la stessa nei due tratti: ') + 'S_1 \\cdot v_1 = S_2 \\cdot v_2',
				`v_2 = v_1 \\cdot \\dfrac{S_1}{S_2} = ${qu(v1, 'm/s')} \\cdot \\dfrac{${qu(S1, 'cm2')}}{${qu(S2, 'cm2')}} = ${cut(exact)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`,
			],
			// the ratio upside down; the ratio squared; its square root
			answer: pick4(rng, ans, 'm/s', [(Number(v1) * Number(S2)) / Number(S1), Number(v1) * (Number(S1) / Number(S2)) ** 2, Number(v1) * Math.sqrt(Number(S1) / Number(S2))]),
			params: { case: narrows ? 'stringe' : 'allarga', S1, S2, v1 },
			scene: tubo(`Un tubo orizzontale con un primo tratto di sezione ${S1.replace('.', ',')} cm² e un secondo tratto di sezione ${S2.replace('.', ',')} cm²`, {
				rapporto: Math.sqrt(Number(S2) / Number(S1)),
				etichette: { uno: lab('S_1', S1, 'cm²'), due: lab('S_2', S2, 'cm²'), v1: lab('v_1', v1, 'm/s'), v2: 'v_2 = ?' },
			}),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the diameters, squared

function level4(rng: Rng): Built {
	const mm = rng.next() < 0.5;
	for (;;) {
		const D1 = d2(rng, mm ? 12 : 1.5, mm ? 60 : 9);
		const D2 = d2(rng, mm ? 3 : 1.1, mm ? 40 : 6);
		const ratio = Number(D1) / Number(D2);
		if (ratio < 1.3 || ratio > 4) continue;
		const v1 = d2(rng, 0.3, 3);
		const exact = Number(v1) * ratio * ratio;
		const ans = rs(exact);
		if (ans === null) continue;
		const u = mm ? 'mm' : 'cm';
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(`In un tubo di diametro ${pq(D1, u)} l'acqua scorre a ${pq(v1, 'm/s')}. Il tubo termina con un ugello di diametro ${pq(D2, u)}. Con che velocità esce l'acqua dall'ugello?`),
			solution: `v_2 \\approx ${qu(ans, 'm/s')}`,
			steps: [
				t("L'area di un cerchio dipende dal quadrato del diametro: ") + '\\dfrac{S_1}{S_2} = \\left(\\dfrac{D_1}{D_2}\\right)^2',
				`v_2 = v_1 \\cdot \\left(\\dfrac{D_1}{D_2}\\right)^2 = ${qu(v1, 'm/s')} \\cdot \\left(\\dfrac{${qu(D1, u)}}{${qu(D2, u)}}\\right)^2 = ${cut(exact)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`,
			],
			// the diameters not squared; the ratio upside down, squared or not
			answer: pick4(rng, ans, 'm/s', [Number(v1) * ratio, Number(v1) / ratio / ratio, Number(v1) / ratio]),
			params: { case: u, D1, D2, v1 },
			scene: tubo(`Un tubo orizzontale di diametro ${D1.replace('.', ',')} ${u} che termina con un ugello di diametro ${D2.replace('.', ',')} ${u}`, {
				rapporto: 1 / ratio,
				etichette: { uno: lab('D_1', D1, u), due: lab('D_2', D2, u), v1: lab('v_1', v1, 'm/s'), v2: 'v_2 = ?' },
			}),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: the flow rate of a round pipe, in litres per minute

function level5(rng: Rng): Built {
	for (;;) {
		const D = d2(rng, 1.1, 5);
		const v = d2(rng, 0.2, 2.5);
		const r = Number(D) / 2; // cm
		const area = Math.PI * r * r; // cm²
		const perSecond = (area * Number(v)) / 10; // L/s
		const exact = perSecond * 60;
		const ans = rs(exact);
		if (ans === null) continue;
		return {
			prompt: 'Calcola la portata.',
			problem: textBlock(`In un tubo di diametro interno ${pq(D, 'cm')} l'acqua scorre a ${pq(v, 'm/s')}. Quanti litri al minuto porta il tubo?`),
			solution: `q \\approx ${qu(ans, 'L/min')}`,
			steps: [
				`r = \\dfrac{D}{2} = ${decimal(r)}\\,\\text{cm} = ${decimal(r)} \\cdot 10^{-2}\\,\\text{m}`,
				`S = \\pi\\,r^2 = \\pi \\cdot (${decimal(r)} \\cdot 10^{-2}\\,\\text{m})^2 = ${cut(area)} \\cdot 10^{-4}\\,\\text{m}^2`,
				`q = S \\cdot v = ${cut(area)} \\cdot 10^{-4}\\,\\text{m}^2 \\cdot ${qu(v, 'm/s')} = ${cut(perSecond)}\\,\\text{L/s}`,
				`q = ${cut(perSecond)}\\,\\text{L/s} \\cdot 60\\,\\text{s/min} \\approx ${qu(ans, 'L/min')}`,
			],
			// the diameter taken for the radius; the minutes forgotten; π forgotten
			answer: pick4(rng, ans, 'L/min', [exact * 4, perSecond, exact / Math.PI]),
			params: { D, v },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: a pipe that splits into equal branches

function level6(rng: Rng): Built {
	for (;;) {
		const n = rng.pick([2, 3, 4, 6]);
		const D = d2(rng, 2, 9);
		const D2 = d2(rng, 1.1, 5);
		const ratio = Number(D) / Number(D2);
		if (ratio < 1.2 || ratio > 3.5) continue;
		const v = d2(rng, 0.5, 4);
		const exact = (Number(v) * ratio * ratio) / n;
		const ans = rs(exact);
		if (ans === null || Math.abs(ratio * ratio - n) < 0.15 * n) continue;
		return {
			prompt: 'Trova la velocità.',
			problem: textBlock(`Un tubo di diametro ${pq(D, 'cm')} porta acqua alla velocità di ${pq(v, 'm/s')} e si divide in $${n}$ tubi uguali, ciascuno di diametro ${pq(D2, 'cm')}. Con che velocità scorre l'acqua in ciascuno dei tubi più piccoli?`),
			solution: `v_2 \\approx ${qu(ans, 'm/s')}`,
			steps: [
				t(`La portata del tubo grande si divide tra i ${n} rami: `) + `S \\cdot v = ${n} \\cdot S_2 \\cdot v_2`,
				`v_2 = \\dfrac{v}{${n}} \\cdot \\left(\\dfrac{D}{D_2}\\right)^2 = \\dfrac{${qu(v, 'm/s')}}{${n}} \\cdot \\left(\\dfrac{${qu(D, 'cm')}}{${qu(D2, 'cm')}}\\right)^2 = ${cut(exact)}\\,\\text{m/s} \\approx ${qu(ans, 'm/s')}`,
			],
			// the branches forgotten; the diameters not squared; the speed only divided
			answer: pick4(rng, ans, 'm/s', [Number(v) * ratio * ratio, (Number(v) * ratio) / n, Number(v) / n]),
			params: { n, D, D2, v },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if ([3, 4].includes(sample.level) && sample.scene?.type !== 'tubo-sezioni') v.push('manca la scena');
	return v;
}

export const fisPortataContinuita: Generator = {
	id: ID,
	title: "La portata e l'equazione di continuità",
	levels: {
		1: { label: 'La portata da volume e tempo', constraints: ['volume in litri e tempo in secondi, due cifre', 'risposta in L/s'] },
		2: { label: 'La portata da sezione e velocità', constraints: ['sezione in cm², velocità in m/s', 'risposta in L/s'] },
		3: { label: 'Il tubo che cambia sezione', constraints: ['S1·v1 = S2·v2', 'si stringe (70%) o si allarga (30%)', 'rapporto delle sezioni tra 1,5 e 8'] },
		4: { label: 'Il tubo con i diametri', constraints: ['v2 = v1·(D1/D2)²', 'diametri in cm o in mm (metà)', 'rapporto dei diametri tra 1,3 e 4'] },
		5: { label: 'I litri al minuto di un tubo', constraints: ['q = π r² v dal diametro in cm', 'risposta in L/min'] },
		6: { label: 'Il tubo che si divide', constraints: ['2, 3, 4 o 6 rami uguali', 'v2 = v·(D/D2)²/n'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisPortataContinuita;
