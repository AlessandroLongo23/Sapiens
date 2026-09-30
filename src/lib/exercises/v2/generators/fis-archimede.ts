/**
 * La spinta di Archimede e il galleggiamento. Spec: specs/exercises/fis-archimede.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/30-fis-archimede.md): the buoyancy on a body all under
 * a liquid, S_A = d_fl V g; the apparent weight P − S_A; the volume or the density of a body from the readings of two
 * spring balances (a scene); the part under the surface of a floating block, V_imm / V = d_corpo / d_liquido; the
 * density of the block or of the liquid from the waterline (a scene); the largest load of a raft or of a hot-air
 * balloon. g = 9,8 N/kg, densities of the lesson's tables. Data with two significant figures (the densities as the
 * tables give them), answers rounded to two, never a tie; multiple choice with the unit in the option and the
 * lesson's mistakes: the body's density for the liquid's, the volume not converted, the ratio upside down, the part
 * above the surface, the body's own mass forgotten.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { Rational, q } from '../rational';
import { type Built, type Format, type R, commonCheck, dec, fixed, generateWith, isTie, n, roundSig, sig, t } from '../fisica-forze';
import { optionsWithUnit, wu } from './fis-pressione-atmosferica';

export const ID = 'fis-archimede';

const G = q(98, 10);
const S2 = { kind: 'sig', s: 2 } as const;
const pw = (num: string, u: string) => `$${wu(num, u)}$`;
const D = (d: R) => pw(dec(d), 'kg/m^3');

/** Liquids of the lesson's table, kg/m³. */
export const LIQUIDS = {
	acqua: { d: n(1000), name: 'acqua', in: 'in acqua' },
	mare: { d: n(1030), name: 'acqua di mare', in: 'in acqua di mare' },
	olio: { d: n(920), name: "olio d'oliva", in: "nell'olio d'oliva" },
	alcol: { d: n(790), name: 'alcol etilico', in: "nell'alcol etilico" },
	glicerina: { d: n(1260), name: 'glicerina', in: 'nella glicerina' },
} as const;
type Liquid = keyof typeof LIQUIDS;
const inLiquid = (l: Liquid) => `${LIQUIDS[l].in} (densità ${D(LIQUIDS[l].d)})`;

/** Materials of lesson 03's table that sink in all of the liquids above. */
const METALS = {
	ferro: { d: n(7870), name: 'ferro' },
	alluminio: { d: n(2700), name: 'alluminio' },
	rame: { d: n(8960), name: 'rame' },
	piombo: { d: n(11300), name: 'piombo' },
} as const;
type Metal = keyof typeof METALS;

const ok = (x: R) => !isTie(x, 2);

// ---------------------------------------------------------------------------
// Level 1: the buoyancy on a body all under the liquid

function level1(rng: Rng): Built {
	for (;;) {
		const metal = rng.pick(Object.keys(METALS) as Metal[]);
		const liq = rng.pick(['acqua', 'mare', 'olio', 'alcol', 'glicerina'] as Liquid[]);
		const inDm = rng.next() < 0.5;
		// dm³: 0,10 to 9,9; cm³: 10 to 99 times ten (100 to 990)
		const raw = inDm ? (rng.next() < 0.5 ? q(rng.int(10, 99), 100) : q(rng.int(10, 99), 10)) : n(10 * rng.int(10, 99));
		const V = inDm ? raw.div(n(1000)) : raw.div(n(1000000));
		const dl = LIQUIDS[liq].d;
		const exact = dl.mul(V).mul(G);
		if (!ok(exact)) continue;
		const S = roundSig(exact, 2);
		const u = inDm ? 'dm^3' : 'cm^3';
		const rawTex = inDm ? sig(raw, 2) : dec(raw);
		return {
			prompt: 'Calcola la spinta di Archimede.',
			problem: textBlock(
				`Un blocco di ${METALS[metal].name} (densità ${D(METALS[metal].d)}) ha il volume di ${pw(rawTex, u)} ed è tutto immerso ${inLiquid(liq)}. Quanto vale la spinta di Archimede sul blocco?`,
			),
			solution: `S_A = ${wu(sig(S, 2), 'N')}`,
			steps: [
				`V = ${wu(rawTex, u)} = ${wu(sig(V, 2), 'm^3')}`,
				`S_A = d_{fl} \\cdot V \\cdot g = ${dec(dl)}\\,\\text{kg/m}^3 \\cdot ${sig(V, 2)}\\,\\text{m}^3 \\cdot 9{,}8\\,\\text{N/kg} = ${wu(dec(exact), 'N')}${S.equals(exact) ? '' : ` \\approx ${wu(sig(S, 2), 'N')}`}`,
			],
			answer: S,
			unit: 'N',
			format: S2,
			// the body's density; the volume badly converted (dm³ taken for m³, cm³ taken for dm³); g forgotten
			mistakes: [METALS[metal].d.mul(V).mul(G), exact.mul(n(inDm ? 1000 : 1000000)).div(n(inDm ? 1 : 1000)), exact.div(G)],
			params: { case: inDm ? 'dm3' : 'cm3', metal, liquido: liq, V: V.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the apparent weight

const THINGS = ['Un sasso', 'Un blocco di metallo', 'Una chiave inglese', 'Un pesetto'];

function level2(rng: Rng): Built {
	for (;;) {
		const liq = rng.pick(['acqua', 'mare', 'olio', 'alcol'] as Liquid[]);
		const P = q(rng.int(20, 99), 10); // 2,0 to 9,9 N
		const Vc = n(10 * rng.int(5, 50)); // 50 to 500 cm³
		const V = Vc.div(n(1000000));
		const dc = P.div(G.mul(V));
		if (dc.compare(n(1500)) < 0 || dc.compare(n(12000)) > 0) continue;
		const dl = LIQUIDS[liq].d;
		const SA = dl.mul(V).mul(G);
		const exact = P.sub(SA);
		if (exact.compare(n(1)) < 0 || !ok(exact)) continue;
		const Pa = roundSig(exact, 2);
		const who = rng.pick(THINGS);
		return {
			prompt: 'Trova la lettura del dinamometro.',
			problem: textBlock(`${who} pesa ${pw(fixed(P, 1), 'N')} in aria e ha il volume di ${pw(dec(Vc), 'cm^3')}. Quanto segna il dinamometro a cui è appeso quando è tutto immerso ${inLiquid(liq)}?`),
			solution: `P_{app} = ${wu(sig(Pa, 2), 'N')}`,
			steps: [
				`S_A = ${dec(dl)}\\,\\text{kg/m}^3 \\cdot ${sig(V, 2)}\\,\\text{m}^3 \\cdot 9{,}8\\,\\text{N/kg} = ${wu(dec(SA), 'N')}`,
				`P_{app} = P - S_A = ${fixed(P, 1)}\\,\\text{N} - ${dec(SA)}\\,\\text{N} = ${wu(dec(exact), 'N')}${Pa.equals(exact) ? '' : ` \\approx ${wu(sig(Pa, 2), 'N')}`}`,
			],
			answer: Pa,
			unit: 'N',
			format: S2,
			// the buoyancy added; the buoyancy alone; the weight unchanged
			mistakes: [P.add(SA), SA, P],
			params: { case: liq, P: P.toString(), V: V.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: two spring balances, in air and in the liquid (scene)

const BALANCES = [
	{ portata: 5, divisioni: 25, ogni: 5 },
	{ portata: 10, divisioni: 25, ogni: 5 },
];

function level3(rng: Rng): Built {
	const density = rng.next() < 0.5; // chosen once, so the rejections below do not tilt the shares
	for (;;) {
		const b = rng.pick(BALANCES);
		const liq = rng.pick(['acqua', 'olio', 'alcol'] as Liquid[]);
		const sens = q(b.portata, b.divisioni);
		const P = sens.mul(n(rng.int(1, b.divisioni - 1)));
		const P2 = sens.mul(n(rng.int(1, b.divisioni - 1)));
		const dP = P.sub(P2);
		if (P.compare(n(1)) < 0 || dP.compare(n(1)) < 0) continue;
		const dl = LIQUIDS[liq].d;
		const exact = density ? dl.mul(P).div(dP) : dP.div(dl.mul(G)).mul(n(1000000));
		if (density && (exact.compare(n(1500)) < 0 || exact.compare(n(12000)) > 0)) continue;
		if (!ok(exact)) continue;
		const ans = roundSig(exact, 2);
		const read = (x: R) => fixed(x, 1);
		const scene = {
			type: 'dinamometri-archimede',
			data: { ...b, aria: P.num / P.den, liquido: P2.num / P2.den },
			alt: `Due dinamometri uguali con la scala da 0 a ${b.portata} newton, divisa in ${b.divisioni} parti, con lo stesso corpo appeso: il primo in aria segna ${read(P).replace('{,}', ',')} newton, il secondo con il corpo tutto immerso in un liquido segna ${read(P2).replace('{,}', ',')} newton`,
		};
		const common = [
			`S_A = P - P_{app} = ${read(P)}\\,\\text{N} - ${read(P2)}\\,\\text{N} = ${wu(read(dP), 'N')}`,
		];
		if (density)
			return {
				prompt: 'Trova la densità del corpo.',
				problem: textBlock(
					`Un corpo appeso ai dinamometri della figura segna ${pw(read(P), 'N')} in aria e ${pw(read(P2), 'N')} quando è tutto immerso ${inLiquid(liq)}. Qual è la densità del corpo?`,
				),
				solution: `d = ${wu(sig(ans, 2), 'kg/m^3')}`,
				steps: [...common, `d_{corpo} = d_{fl} \\cdot \\dfrac{P}{P - P_{app}} = ${dec(dl)}\\,\\text{kg/m}^3 \\cdot \\dfrac{${read(P)}}{${read(dP)}} \\approx ${wu(sig(ans, 2), 'kg/m^3')}`],
				answer: ans,
				unit: 'kg/m^3',
				format: S2,
				// the ratio upside down; the reading in the liquid for the weight; P over the reading in the liquid
				mistakes: [dl.mul(dP).div(P), dl.mul(P2).div(dP), dl.mul(P).div(P2)],
				params: { case: 'densita', liquido: liq, P: P.toString(), P2: P2.toString(), ...b },
				scene,
			};
		return {
			prompt: 'Trova il volume del corpo.',
			problem: textBlock(`Un corpo appeso ai dinamometri della figura segna ${pw(read(P), 'N')} in aria e ${pw(read(P2), 'N')} quando è tutto immerso ${inLiquid(liq)}. Qual è il volume del corpo?`),
			solution: `V = ${wu(sig(ans, 2), 'cm^3')}`,
			steps: [
				...common,
				`V = \\dfrac{S_A}{d_{fl} \\cdot g} = \\dfrac{${read(dP)}\\,\\text{N}}{${dec(dl)}\\,\\text{kg/m}^3 \\cdot 9{,}8\\,\\text{N/kg}} \\approx ${wu(sig(exact.div(n(1000000)), 3), 'm^3')} \\approx ${wu(sig(ans, 2), 'cm^3')}`,
			],
			answer: ans,
			unit: 'cm^3',
			format: S2,
			// the weight in air for the buoyancy; the reading in the liquid for it; g forgotten
			mistakes: [P.div(dl.mul(G)).mul(n(1000000)), P2.div(dl.mul(G)).mul(n(1000000)), dP.div(dl).mul(n(1000000))],
			params: { case: 'volume', liquido: liq, P: P.toString(), P2: P2.toString(), ...b },
			scene,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the part under the surface of a floating block

function floaters(rng: Rng): { name: string; d: R } {
	return rng.next() < 0.2 ? { name: 'ghiaccio', d: n(917) } : { name: 'legno', d: n(10 * rng.int(30, 90)) };
}

function level4(rng: Rng): Built {
	for (;;) {
		const body = floaters(rng);
		const liq = rng.pick(['acqua', 'mare', 'olio', 'glicerina'] as Liquid[]);
		const dl = LIQUIDS[liq].d;
		if (body.d.compare(dl.mul(q(95, 100))) > 0) continue;
		const height = rng.next() < 0.5;
		const whole = height ? n(rng.int(10, 60)) : q(rng.int(10, 99), 10); // cm, or dm³
		const exact = whole.mul(body.d).div(dl);
		if (!ok(exact)) continue;
		const ans = roundSig(exact, 2);
		const u = height ? 'cm' : 'dm^3';
		const wTex = height ? dec(whole) : fixed(whole, 1);
		const what = height
			? `Un blocco di ${body.name} (densità ${D(body.d)}) alto ${pw(wTex, 'cm')} galleggia ${inLiquid(liq)} con le facce orizzontali. Quanti centimetri della sua altezza sono sotto la superficie?`
			: `Un blocco di ${body.name} (densità ${D(body.d)}) ha il volume di ${pw(wTex, 'dm^3')} e galleggia ${inLiquid(liq)}. Qual è il volume della parte immersa?`;
		const sym = height ? 'h' : 'V';
		return {
			prompt: height ? "Trova l'altezza immersa." : 'Trova il volume immerso.',
			problem: textBlock(what),
			solution: `${sym}_{imm} = ${wu(sig(ans, 2), u)}`,
			steps: [
				`\\dfrac{${sym}_{imm}}{${sym}} = \\dfrac{d_{corpo}}{d_{liquido}} = \\dfrac{${dec(body.d)}}{${dec(dl)}}`,
				`${sym}_{imm} = \\dfrac{${dec(body.d)}}{${dec(dl)}} \\cdot ${wu(wTex, u)} \\approx ${wu(sig(ans, 2), u)}`,
			],
			answer: ans,
			unit: u,
			format: S2,
			// the ratio upside down; the part above the surface; the water's density for another liquid (or the whole)
			mistakes: [whole.mul(dl).div(body.d), whole.sub(exact), liq === 'acqua' ? whole : whole.mul(body.d).div(n(1000))],
			params: { case: height ? 'altezza' : 'volume', corpo: body.name, d: body.d.toString(), liquido: liq, whole: whole.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: a density from the waterline (scene)

function level5(rng: Rng): Built {
	const ofBody = rng.next() < 0.5; // chosen once, as in level 3
	for (;;) {
		const h = n(rng.int(10, 30));
		const hi = rng.next() < 0.5 ? q(rng.int(20, 99), 10) : n(rng.int(10, 29));
		if (hi.compare(h.mul(q(95, 100))) >= 0 || hi.compare(h.mul(q(15, 100))) <= 0) continue;
		const hiTex = sig(hi, 2);
		const scene = {
			type: 'galleggiante-quote',
			data: { altezza: h.num / h.den, immersa: hi.num / hi.den, testoAltezza: `${dec(h)} cm`, testoImmersa: `${hiTex.replace('{,}', ',')} cm` },
			alt: `Un blocco alto ${dec(h)} centimetri che galleggia con le facce orizzontali in un liquido: la parte sotto la superficie è alta ${hiTex.replace('{,}', ',')} centimetri`,
		};
		if (ofBody) {
			const liq = rng.pick(['acqua', 'mare', 'olio', 'glicerina'] as Liquid[]);
			const dl = LIQUIDS[liq].d;
			const exact = dl.mul(hi).div(h);
			if (!ok(exact)) continue;
			const ans = roundSig(exact, 2);
			return {
				prompt: 'Trova la densità del blocco.',
				problem: textBlock(`Il blocco della figura galleggia ${inLiquid(liq)}. Qual è la densità del blocco?`),
				solution: `d_{corpo} = ${wu(sig(ans, 2), 'kg/m^3')}`,
				steps: [
					`\\dfrac{h_{imm}}{h} = \\dfrac{d_{corpo}}{d_{liquido}} \\quad\\Rightarrow\\quad d_{corpo} = d_{liquido} \\cdot \\dfrac{h_{imm}}{h}`,
					`d_{corpo} = ${dec(dl)}\\,\\text{kg/m}^3 \\cdot \\dfrac{${hiTex}}{${dec(h)}} \\approx ${wu(sig(ans, 2), 'kg/m^3')}`,
				],
				answer: ans,
				unit: 'kg/m^3',
				format: S2,
				// the ratio upside down; the part above the surface; the liquid's density
				mistakes: [dl.mul(h).div(hi), dl.mul(h.sub(hi)).div(h), dl],
				params: { case: 'corpo', liquido: liq, h: h.toString(), hi: hi.toString() },
				scene,
			};
		}
		const dc = n(10 * rng.int(30, 90));
		const exact = dc.mul(h).div(hi);
		if (exact.compare(n(700)) < 0 || exact.compare(n(1600)) > 0 || !ok(exact)) continue;
		const ans = roundSig(exact, 2);
		return {
			prompt: 'Trova la densità del liquido.',
			problem: textBlock(`Il blocco della figura, di legno con la densità di ${D(dc)}, galleggia in un liquido sconosciuto. Qual è la densità del liquido?`),
			solution: `d_{liquido} = ${wu(sig(ans, 2), 'kg/m^3')}`,
			steps: [
				`\\dfrac{h_{imm}}{h} = \\dfrac{d_{corpo}}{d_{liquido}} \\quad\\Rightarrow\\quad d_{liquido} = d_{corpo} \\cdot \\dfrac{h}{h_{imm}}`,
				`d_{liquido} = ${dec(dc)}\\,\\text{kg/m}^3 \\cdot \\dfrac{${dec(h)}}{${hiTex}} \\approx ${wu(sig(ans, 2), 'kg/m^3')}`,
			],
			answer: ans,
			unit: 'kg/m^3',
			format: S2,
			// the ratio upside down; the part above the surface; the block's density
			mistakes: [dc.mul(hi).div(h), dc.mul(h).div(h.sub(hi)), dc],
			params: { case: 'liquido', d: dc.toString(), h: h.toString(), hi: hi.toString() },
			scene,
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: the largest load

const AIR = q(12, 10);

function level6(rng: Rng): Built {
	for (;;) {
		if (rng.next() < 0.5) {
			const liq = rng.pick(['acqua', 'mare'] as Liquid[]);
			const dl = LIQUIDS[liq].d;
			const small = rng.next() < 0.5;
			const V = small ? q(rng.int(50, 99), 100) : q(rng.int(10, 30), 10); // m³
			const Vtex = small ? fixed(V, 2) : fixed(V, 1);
			const m = n(10 * rng.int(8, 40)); // 80 to 400 kg
			const lift = dl.mul(V);
			const exact = lift.sub(m);
			if (m.compare(lift.mul(q(6, 10))) > 0 || exact.compare(n(10)) < 0 || !ok(exact)) continue;
			const ans = roundSig(exact, 2);
			return {
				prompt: 'Calcola il carico massimo.',
				problem: textBlock(
					`Una zattera ha il volume di ${pw(Vtex, 'm^3')} e la massa di ${pw(dec(m), 'kg')}. Quale massa può portare al massimo senza andare sotto, ${inLiquid(liq)}?`,
				),
				solution: `m_{carico} = ${wu(sig(ans, 2), 'kg')}`,
				steps: [
					`${t('Tutta sotto, sposta ')} ${dec(dl)}\\,\\text{kg/m}^3 \\cdot ${Vtex}\\,\\text{m}^3 = ${wu(dec(lift), 'kg')} ${t(' di liquido')}`,
					`m_{carico} = ${dec(lift)}\\,\\text{kg} - ${dec(m)}\\,\\text{kg} = ${wu(dec(exact), 'kg')}${ans.equals(exact) ? '' : ` \\approx ${wu(sig(ans, 2), 'kg')}`}`,
				],
				answer: ans,
				unit: 'kg',
				format: S2,
				// the raft's own mass forgotten; its mass added; the load as a weight in newton
				mistakes: [lift, lift.add(m), exact.mul(G)],
				params: { case: 'zattera', liquido: liq, V: V.toString(), m: m.toString() },
			};
		}
		const V = n(100 * rng.int(15, 30));
		const din = q(rng.int(90, 99), 100);
		const m = n(10 * rng.int(20, 40));
		const free = AIR.sub(din).mul(V);
		const exact = free.sub(m);
		if (exact.compare(n(50)) < 0 || !ok(exact)) continue;
		const ans = roundSig(exact, 2);
		return {
			prompt: 'Calcola il carico massimo.',
			problem: textBlock(
				`Una mongolfiera ha il volume di ${pw(dec(V), 'm^3')}; l'involucro, la cesta e il bruciatore hanno la massa di ${pw(dec(m), 'kg')}. L'aria fuori ha la densità di ${pw(fixed(AIR, 2), 'kg/m^3')}, l'aria calda dentro di ${D(din)}. Quale massa di passeggeri può sollevare al massimo?`,
			),
			solution: `m_{carico} = ${wu(sig(ans, 2), 'kg')}`,
			steps: [
				`(${fixed(AIR, 2)} - ${fixed(din, 2)})\\,\\text{kg/m}^3 \\cdot ${dec(V)}\\,\\text{m}^3 = ${wu(dec(free), 'kg')}`,
				`m_{carico} = ${dec(free)}\\,\\text{kg} - ${dec(m)}\\,\\text{kg} = ${wu(dec(exact), 'kg')}${ans.equals(exact) ? '' : ` \\approx ${wu(sig(ans, 2), 'kg')}`}`,
			],
			answer: ans,
			unit: 'kg',
			format: S2,
			// the hot air forgotten; the balloon's own mass forgotten; the load as a weight in newton
			mistakes: [AIR.mul(V).sub(m), free, exact.mul(G)],
			params: { case: 'mongolfiera', V: V.toString(), dentro: din.toString(), m: m.toString() },
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

export const fisArchimede: Generator = {
	id: ID,
	title: 'La spinta di Archimede e il galleggiamento',
	levels: {
		1: { label: 'La spinta su un corpo immerso', constraints: ['S_A = d_fl · V · g', 'volume in dm³ o in cm³'] },
		2: { label: 'Il peso apparente', constraints: ['P_app = P − S_A', 'il corpo affonda'] },
		3: { label: 'Dalle letture dei due dinamometri', constraints: ['letture su una scala disegnata', 'volume o densità del corpo'] },
		4: { label: 'La parte immersa di un corpo che galleggia', constraints: ['V_imm / V = d_corpo / d_liquido', 'altezza o volume'] },
		5: { label: 'La densità dalla linea di galleggiamento', constraints: ['altezze lette sulla figura', 'densità del corpo o del liquido'] },
		6: { label: 'Il carico massimo', constraints: ['zattera o mongolfiera', 'la massa propria si toglie'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice: (sample, rng) => {
		if (sample.answer.kind !== 'number') throw new Error(`${ID}: no choice for ${sample.answer.kind}`);
		const mistakes = ((sample.params.mistakes ?? []) as string[]).map((s) => Rational.parse(s));
		return optionsWithUnit(rng, Rational.parse(sample.answer.value), mistakes, sample.params.unit as string, sample.params.format as Format);
	},
};

export default fisArchimede;
