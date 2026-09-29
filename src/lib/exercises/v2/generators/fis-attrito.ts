/**
 * Le forze di attrito. Spec: specs/exercises/fis-attrito.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/19-fis-attrito.md), each one step harder: the kinetic
 * friction on a level floor; a coefficient from a measured force; how much the friction is when a body is pushed
 * (static and equal to the push, or kinetic because it slides); a pressing force that is not the weight (a hand
 * pushing down, a rope pulling up); a book held against a wall. F⊥ = m g on a level floor, F_s <= μs F⊥, F_d = μd F⊥,
 * g = 9,8 N/kg. Data with two significant figures, answers rounded to two (never a tie), multiple choice with the
 * unit in the option and the lesson's mistakes: static friction always at its maximum, the pressing force taken for
 * the weight, the mass taken for the weight, the coefficient upside down.
 */
import type { Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { q } from '../rational';
import { type Built, type R, choiceFor, commonCheck, dec, generateWith, isTie, n, roundSig, sig, t, withUnit } from '../fisica-forze';

export const ID = 'fis-attrito';

const G = q(98, 10);
const S2 = { kind: 'sig', s: 2 } as const;
const u = (r: R, unit: string) => withUnit(sig(r, 2), unit);
const pu = (r: R, unit: string) => `$${u(r, unit)}$`;
const mu = (r: R) => sig(r, 2);
const kg = (rng: Rng) => (rng.next() < 0.5 ? q(rng.int(10, 99), 10) : n(rng.int(10, 99)));
const coeff = (rng: Rng, lo = 10, hi = 80) => q(rng.int(lo, hi), 100);
const between = (x: R, lo: number, hi: number) => x.compare(n(lo)) >= 0 && x.compare(n(hi)) <= 0;
const weight = (m: R) => `F_\\perp = m \\cdot g = ${u(m, 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${withUnit(dec(m.mul(G)), 'N')}`;

/** The bodies of the problems, with the ending of their adjectives (ferm-a, ferm-o) and their pronoun. */
const BODIES = [
	{ name: 'Una cassa', where: 'su un pavimento orizzontale', e: 'a', lo: 'la' },
	{ name: 'Uno scatolone', where: 'su un pavimento orizzontale', e: 'o', lo: 'lo' },
	{ name: 'Un mobile', where: 'su un pavimento orizzontale', e: 'o', lo: 'lo' },
	{ name: 'Una slitta', where: 'su una strada innevata orizzontale', e: 'a', lo: 'la' },
	{ name: 'Un blocco di legno', where: 'su un tavolo orizzontale', e: 'o', lo: 'lo' },
];

// ---------------------------------------------------------------------------
// Level 1: kinetic friction on a level floor

function level1(rng: Rng): Built {
	for (;;) {
		const m = kg(rng);
		const md = coeff(rng);
		const exact = md.mul(m).mul(G);
		if (!between(exact, 1, 99) || isTie(exact, 2)) continue;
		const Fd = roundSig(exact, 2);
		const b = rng.pick(BODIES);
		return {
			prompt: "Calcola la forza d'attrito.",
			problem: textBlock(`${b.name} di ${pu(m, 'kg')} striscia ${b.where}; il coefficiente di attrito dinamico è $\\mu_d = ${mu(md)}$. Quanto vale la forza di attrito?`),
			solution: `F_d = ${u(Fd, 'N')}`,
			steps: [
				`${t('Piano orizzontale: la forza premente è il peso, ')} ${weight(m)}`,
				`F_d = \\mu_d \\cdot F_\\perp = ${mu(md)} \\cdot ${withUnit(dec(m.mul(G)), 'N')} = ${withUnit(dec(exact), 'N')}${exact.equals(Fd) ? '' : ` \\approx ${u(Fd, 'N')}`}`,
			],
			answer: Fd,
			unit: 'N',
			format: S2,
			// the mass taken for the weight; the weight itself; the weight divided by the coefficient
			mistakes: [md.mul(m), m.mul(G), m.mul(G).div(md)],
			params: { case: 'dinamico', m: m.toString(), mud: md.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: a coefficient from a measured force

function level2(rng: Rng): Built {
	for (;;) {
		const m = kg(rng);
		const c = coeff(rng);
		const F = roundSig(c.mul(m).mul(G), 2);
		if (!between(F, 1, 99)) continue;
		const Fn = m.mul(G);
		const exact = F.div(Fn);
		if (isTie(exact, 2)) continue;
		const ans = roundSig(exact, 2);
		const b = rng.pick(BODIES);
		const kinetic = rng.next() < 0.5;
		const problem = kinetic
			? `Per trascinare a velocità costante ${b.name.toLowerCase()} di ${pu(m, 'kg')} ${b.where} serve una forza orizzontale di ${pu(F, 'N')}. Quanto vale il coefficiente di attrito dinamico?`
			: `${b.name} di ${pu(m, 'kg')} è ferm${b.e} ${b.where}. La forza orizzontale più piccola che ${b.lo} mette in moto è di ${pu(F, 'N')}. Quanto vale il coefficiente di attrito statico?`;
		const sym = kinetic ? '\\mu_d' : '\\mu_s';
		return {
			prompt: 'Trova il coefficiente di attrito.',
			problem: textBlock(problem),
			solution: `${sym} = ${sig(ans, 2)}`,
			steps: [
				kinetic ? t("A velocità costante la forza è uguale all'attrito dinamico") : t("La forza che mette in moto il corpo è l'attrito statico massimo"),
				weight(m),
				`${sym} = \\dfrac{${u(F, 'N')}}{${withUnit(dec(Fn), 'N')}} ${exact.equals(ans) ? '=' : '\\approx'} ${sig(ans, 2)}`,
			],
			answer: ans,
			unit: '',
			format: S2,
			// the mass taken for the weight; the ratio upside down; ten times the answer
			mistakes: [F.div(m), Fn.div(F), ans.mul(n(10))],
			params: { case: kinetic ? 'dinamico' : 'statico', m: m.toString(), F: F.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: how much is the friction?

function level3(rng: Rng): Built {
	for (;;) {
		const m = kg(rng);
		const ms = coeff(rng, 20, 80);
		const md = q(rng.int(10, ms.num * (100 / ms.den) - 5), 100);
		const Fn = m.mul(G);
		const smax = ms.mul(Fn);
		const fd = md.mul(Fn);
		const still = rng.next() < 0.5;
		// a push clearly under the maximum (at most 90%), or clearly over it (at least 110%)
		const F = roundSig(smax.mul(q(still ? rng.int(30, 90) : rng.int(110, 160), 100)), 2);
		if (!between(F, 1, 99) || (still ? F.compare(smax.mul(q(9, 10))) > 0 : F.compare(smax.mul(q(11, 10))) < 0) || isTie(fd, 2)) continue;
		const ans = still ? F : roundSig(fd, 2);
		const b = rng.pick(BODIES);
		return {
			prompt: "Calcola la forza d'attrito.",
			problem: textBlock(
				`${b.name} di ${pu(m, 'kg')} è ferm${b.e} ${b.where}, con $\\mu_s = ${mu(ms)}$ e $\\mu_d = ${mu(md)}$. ${b.lo === 'la' ? 'La' : 'Lo'} si spinge orizzontalmente con una forza di ${pu(F, 'N')}. Quanto vale la forza di attrito?`,
			),
			solution: `${still ? 'F_s' : 'F_d'} = ${u(ans, 'N')}`,
			steps: [
				weight(m),
				`${t('Attrito statico massimo: ')} \\mu_s \\cdot F_\\perp = ${mu(ms)} \\cdot ${withUnit(dec(Fn), 'N')} = ${withUnit(dec(smax), 'N')}`,
				still
					? `${t('La spinta di ')} ${u(F, 'N')} ${t(" è minore: il corpo resta fermo, e l'attrito statico è uguale alla spinta, ")} ${u(F, 'N')}`
					: `${t('La spinta di ')} ${u(F, 'N')} ${t(" è maggiore: il corpo striscia, e l'attrito è dinamico, ")} F_d = ${mu(md)} \\cdot ${withUnit(dec(Fn), 'N')} \\approx ${u(fd, 'N')}`,
			],
			answer: ans,
			unit: 'N',
			format: S2,
			// static friction always at its maximum; the other kind of friction; the push itself
			mistakes: still ? [smax, fd, Fn] : [smax, F, F.sub(fd)],
			params: { case: still ? 'fermo' : 'striscia', m: m.toString(), mus: ms.toString(), mud: md.toString(), F: F.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: a pressing force that is not the weight

function level4(rng: Rng): Built {
	for (;;) {
		const m = kg(rng);
		const ms = coeff(rng);
		const P = m.mul(G);
		const down = rng.next() < 0.5;
		const Fv = roundSig(P.mul(q(rng.int(15, 80), 100)), 2);
		const Fn = down ? P.add(Fv) : P.sub(Fv);
		const exact = ms.mul(Fn);
		if (!between(exact, 1, 99) || isTie(exact, 2) || !between(Fv, 1, 99)) continue;
		const ans = roundSig(exact, 2);
		const b = rng.pick(BODIES.filter((x) => x.name !== 'Una slitta'));
		const push = down
			? `Una mano ${b.lo} preme anche verso il basso con una forza di ${pu(Fv, 'N')}.`
			: `Una corda ${b.lo} tira verso l'alto con una forza di ${pu(Fv, 'N')}, più piccola del suo peso.`;
		return {
			prompt: "Calcola l'attrito statico massimo.",
			problem: textBlock(`${b.name} di ${pu(m, 'kg')} è appoggiat${b.e} ${b.where}, con $\\mu_s = ${mu(ms)}$. ${push} Quanto vale l'attrito statico massimo?`),
			solution: `F_{s,\\max} = ${u(ans, 'N')}`,
			steps: [
				`P = m \\cdot g = ${u(m, 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${withUnit(dec(P), 'N')}`,
				down
					? `${t('La mano spinge verso il basso: ')} F_\\perp = ${withUnit(dec(P), 'N')} + ${u(Fv, 'N')} = ${withUnit(dec(Fn), 'N')}`
					: `${t("La corda tira verso l'alto: ")} F_\\perp = ${withUnit(dec(P), 'N')} - ${u(Fv, 'N')} = ${withUnit(dec(Fn), 'N')}`,
				`F_{s,\\max} = \\mu_s \\cdot F_\\perp = ${mu(ms)} \\cdot ${withUnit(dec(Fn), 'N')} ${exact.equals(ans) ? '=' : '\\approx'} ${u(ans, 'N')}`,
			],
			answer: ans,
			unit: 'N',
			format: S2,
			// the weight taken for the pressing force; the vertical force with the wrong sign; the vertical force alone
			mistakes: [ms.mul(P), ms.mul(down ? P.sub(Fv) : P.add(Fv)), ms.mul(Fv)],
			params: { case: down ? 'mano' : 'corda', m: m.toString(), mus: ms.toString(), Fv: Fv.toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: a book held against a wall

function level5(rng: Rng): Built {
	for (;;) {
		const ms = coeff(rng, 20, 80);
		if (rng.next() < 0.5) {
			const F = rng.next() < 0.5 ? q(rng.int(10, 99), 10) : n(rng.int(10, 99));
			const exact = ms.mul(F).div(G);
			if (exact.compare(q(1, 10)) < 0 || exact.compare(n(9)) > 0 || isTie(exact, 2)) continue;
			const ans = roundSig(exact, 2);
			return {
				prompt: 'Trova la massa.',
				problem: textBlock(`Un libro è premuto contro una parete verticale da una mano che lo spinge orizzontalmente con una forza di ${pu(F, 'N')}; tra libro e parete $\\mu_s = ${mu(ms)}$. Qual è la massa più grande che il libro può avere senza scivolare?`),
				solution: `m = ${u(ans, 'kg')}`,
				steps: [
					`${t('La forza premente è la spinta contro la parete: ')} F_\\perp = ${u(F, 'N')}`,
					`F_{s,\\max} = ${mu(ms)} \\cdot ${u(F, 'N')} = ${withUnit(dec(ms.mul(F)), 'N')}${t(": l'attrito tiene fermo un peso fino a questo valore")}`,
					`m = \\dfrac{P}{g} = \\dfrac{${withUnit(dec(ms.mul(F)), 'N')}}{9{,}8\\,\\text{N/kg}} ${exact.equals(ans) ? '=' : '\\approx'} ${u(ans, 'kg')}`,
				],
				answer: ans,
				unit: 'kg',
				format: S2,
				// the maximum friction in newton taken for the mass; the push divided by g; the friction times g
				mistakes: [ms.mul(F), F.div(G), ms.mul(F).mul(G)],
				params: { case: 'massa', F: F.toString(), mus: ms.toString() },
			};
		}
		const m = q(rng.int(10, 99), 100);
		const P = m.mul(G);
		const exact = P.div(ms);
		if (!between(exact, 1, 99) || isTie(exact, 2)) continue;
		const ans = roundSig(exact, 2);
		return {
			prompt: 'Trova la forza.',
			problem: textBlock(`Un libro di ${pu(m, 'kg')} è premuto contro una parete verticale da una mano che lo spinge orizzontalmente; tra libro e parete $\\mu_s = ${mu(ms)}$. Con quale forza minima bisogna spingerlo perché non scivoli?`),
			solution: `F = ${u(ans, 'N')}`,
			steps: [
				`${t("L'attrito statico, verticale, deve reggere il peso: ")} P = ${u(m, 'kg')} \\cdot 9{,}8\\,\\text{N/kg} = ${withUnit(dec(P), 'N')}`,
				`${t('La forza premente è la spinta: ')} \\mu_s \\cdot F \\geq P \\quad\\Rightarrow\\quad F \\geq \\dfrac{${withUnit(dec(P), 'N')}}{${mu(ms)}} ${exact.equals(ans) ? '=' : '\\approx'} ${u(ans, 'N')}`,
			],
			answer: ans,
			unit: 'N',
			format: S2,
			// the friction computed with the weight; the weight alone; the mass over the coefficient
			mistakes: [ms.mul(P), P, m.div(ms)],
			params: { case: 'spinta', m: m.toString(), mus: ms.toString() },
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	const ans = sample.answer.kind === 'number' ? sample.answer.value : '';
	if (((sample.params.mistakes as string[]) ?? []).filter((m) => m !== ans).length < 2) v.push('meno di due errori tipici');
	return v;
}

export const fisAttrito: Generator = {
	id: ID,
	title: 'Le forze di attrito',
	levels: {
		1: { label: "L'attrito dinamico", constraints: ['piano orizzontale, forza premente uguale al peso', 'attrito da 1 a 99 N'] },
		2: { label: 'Il coefficiente di attrito', constraints: ['dalla forza a velocità costante (dinamico) o dalla forza che mette in moto (statico)'] },
		3: { label: "Quanto vale l'attrito", constraints: ['spinta sotto il 90% o sopra il 110% dell\'attrito statico massimo, metà ciascuno'] },
		4: { label: 'La forza premente non è il peso', constraints: ['una mano che preme verso il basso o una corda che tira verso l\'alto'] },
		5: { label: 'Un libro contro la parete', constraints: ['la massa più grande o la spinta minima', 'la forza premente è la spinta'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice: (sample, rng) => choiceFor(sample, rng, ID),
};

export default fisAttrito;
