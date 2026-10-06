/**
 * Forze conservative ed energia potenziale. Spec: specs/exercises/fis-forze-conservative-energia.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/78-fis-forze-conservative-energia.md), each one step
 * harder: the work of friction along the two edges of a table, −Fd (a + b), against the diagonal; the work on the way
 * back (a conservative force gives −W, friction on a round trip −2W); the work from the potential energies,
 * W = U_A − U_B, and the final potential energy from the work; the work of a spring between two stretches,
 * ½ k (x_A² − x_B²); the kinetic energy read on a graph of U with the line of E, K = E − U; the force from the slope
 * of the graph, F_x = −ΔU/Δx. Distractors from the lesson's warnings: the sign of W = −ΔU, friction treated as a
 * conservative force, the graph read as U instead of E − U, the slope without the minus sign.
 */
import type { ChoiceOption, Generator, Rng, Sample } from '../types';
import { textBlock } from '../insiemi';
import { choiceOf, pq, qOpt, qty, t } from '../vettori';
import { type Built, checkCommon, generateWith, r2 } from '../fisica-equilibrio';
import { J, choose, cut, data2, fallback, int3, r2s, uOpts } from '../fis-energia';
import { dec, spezzata, valueAt, type GraphAxis } from '../fis-quantita-moto';

export const ID = 'fis-forze-conservative-energia';

const zero = (unit: string): ChoiceOption => ({ latex: `0\\,\\text{${unit}}`, values: ['0'] });
const neg = (s: string) => (s.startsWith('-') ? s.slice(1) : `-${s}`);

// ---------------------------------------------------------------------------
// Level 1: friction along two paths

/** Tables whose diagonal is a round number: the two sides and the diagonal, in metres. */
const TABLES: [string, string, string][] = [
	['0.6', '0.8', '1.0'],
	['0.9', '1.2', '1.5'],
	['1.2', '1.6', '2.0'],
	['1.5', '2.0', '2.5'],
	['0.5', '1.2', '1.3'],
	['0.8', '1.5', '1.7'],
	['1.8', '2.4', '3.0'],
	['2.1', '2.8', '3.5'],
];

function level1(rng: Rng): Built {
	for (;;) {
		const [s1, s2, diag] = rng.pick(TABLES);
		const [a, b] = rng.int(0, 1) ? [s1, s2] : [s2, s1];
		const F = data2(rng, 1.1, 25);
		const Fn = Number(F), an = Number(a), bn = Number(b), dn = Number(diag);
		const exact = -Fn * (an + bn);
		const ans = r2(exact);
		if (ans === null || Math.abs(exact) < 1) continue;
		const [thing, pushed] = rng.pick([
			['Un libro', 'spinto'],
			['Una scatola', 'spinta'],
			['Un astuccio', 'spinto'],
		]);
		return {
			prompt: "Trova il lavoro dell'attrito.",
			problem: textBlock(`${thing} viene ${pushed} sul piano di un tavolo rettangolare di ${pq(a, 'm')} per ${pq(b, 'm')}, da un angolo all'angolo opposto, seguendo i due bordi. L'attrito ha modulo ${pq(F, 'N')}. Quanto lavoro compie l'attrito?`),
			solution: `W_{attrito} \\approx ${J(ans)}`,
			steps: [
				`${t('Il cammino è lungo ')} l = ${qty(a, 'm')} + ${qty(b, 'm')} = ${qty(dec(an + bn, 2) ?? '', 'm')}`,
				`W_{attrito} = -F_d \\cdot l = -${qty(F, 'N')} \\cdot ${qty(dec(an + bn, 2) ?? '', 'm')} = ${J(cut(exact))} \\approx ${J(ans)}`,
				t("Conta tutta la strada percorsa, non la diagonale: l'attrito non è conservativo."),
			],
			// the diagonal (as for a conservative force); the sign; one edge only
			answer: choose(rng, qOpt(ans, 'J'), uOpts(r2s([-Fn * dn, -exact, -Fn * Math.max(an, bn)]), 'J'), fallback(exact, 'J')),
			params: { a, b, F, diag },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 2: the way back

function level2(rng: Rng): Built {
	for (;;) {
		const W = data2(rng, 1.1, 49);
		const twice = r2(2 * Number(W));
		if (twice === null) continue;
		if (rng.int(0, 1)) {
			const sign = rng.int(0, 1) ? '' : '-';
			const given = sign + W;
			const ans = neg(given);
			return {
				prompt: 'Trova il lavoro al ritorno.',
				problem: textBlock(`Su un corpo agisce una forza conservativa, che compie un lavoro di ${pq(given, 'J')} quando il corpo va da $A$ a $B$ lungo un cammino. Quanto lavoro compie quando il corpo torna da $B$ ad $A$ lungo un altro cammino?`),
				solution: `W_{B \\to A} = ${J(ans)}`,
				steps: [
					t('Per una forza conservativa il lavoro su un cammino chiuso è zero:') + ' W_{A \\to B} + W_{B \\to A} = 0',
					`W_{B \\to A} = -W_{A \\to B} = ${J(ans)}`,
					t('Il cammino del ritorno non conta: contano solo i due estremi.'),
				],
				// the same work; zero; twice
				answer: choiceOf(rng, qOpt(ans, 'J'), [qOpt(given, 'J'), zero('J'), qOpt(neg(sign + twice), 'J')]),
				params: { kind: 'conservativa', W: given },
			};
		}
		const given = `-${W}`;
		const ans = `-${twice}`;
		return {
			prompt: "Trova il lavoro dell'attrito in tutto.",
			problem: textBlock(`Una cassa viene trascinata sul pavimento da $A$ a $B$, e l'attrito compie un lavoro di ${pq(given, 'J')}. Poi la cassa viene riportata in $A$ lungo lo stesso cammino. Quanto lavoro ha compiuto l'attrito in tutto?`),
			solution: `W_{attrito} = ${J(ans)}`,
			steps: [
				t("L'attrito è opposto al moto anche al ritorno: compie di nuovo ") + J(given),
				`W_{attrito} = ${J(given)} + (${J(given)}) = ${J(ans)}`,
				t("L'attrito non è conservativo: sul cammino chiuso il suo lavoro non è zero."),
			],
			// zero, as for a conservative force; one way only; the sign
			answer: choiceOf(rng, qOpt(ans, 'J'), [zero('J'), qOpt(given, 'J'), qOpt(twice, 'J')]),
			params: { kind: 'attrito', W: given },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: work and potential energy

function level3(rng: Rng): Built {
	for (;;) {
		const UA = rng.int(11, 99), UB = rng.int(11, 99);
		const W = UA - UB;
		if (Math.abs(W) < 11 || W % 10 === 0 || UA % 10 === 0 || UB % 10 === 0 || UA + UB > 99 || (UA + UB) % 10 === 0) continue;
		const [what, body] = rng.pick([
			['elastica', 'di una molla'],
			['gravitazionale', 'di un sasso'],
			['gravitazionale', 'di un vaso'],
			['elastica', 'di un elastico'],
		]);
		const force = what === 'elastica' ? 'la forza elastica' : 'il peso';
		if (rng.int(0, 1)) {
			return {
				prompt: 'Trova il lavoro della forza.',
				problem: textBlock(`L'energia potenziale ${what} ${body} passa da ${pq(String(UA), 'J')} a ${pq(String(UB), 'J')}. Quanto lavoro ha compiuto ${force}?`),
				solution: `W = ${J(String(W))}`,
				steps: [
					'W = -\\Delta U = U_A - U_B',
					`W = ${J(String(UA))} - ${J(String(UB))} = ${J(String(W))}`,
					t(W > 0 ? "L'energia potenziale è diminuita: il lavoro è positivo." : "L'energia potenziale è aumentata: il lavoro è negativo."),
				],
				// the sign; the sum; the sum with a minus
				answer: choiceOf(rng, qOpt(String(W), 'J'), [qOpt(String(-W), 'J'), qOpt(String(UA + UB), 'J'), qOpt(String(-(UA + UB)), 'J')]),
				params: { kind: 'lavoro', UA, UB },
			};
		}
		// the final potential energy from the work: U_B = U_A - W
		const wrong = UA + W;
		if (wrong < 11 || wrong > 99 || wrong % 10 === 0) continue;
		return {
			prompt: "Trova l'energia potenziale finale.",
			problem: textBlock(`L'energia potenziale ${what} ${body} vale ${pq(String(UA), 'J')}. Poi ${force} compie un lavoro di ${pq(String(W), 'J')}. Quanto vale ora l'energia potenziale?`),
			solution: `U_B = ${J(String(UB))}`,
			steps: ['W = U_A - U_B \\quad\\Rightarrow\\quad U_B = U_A - W', `U_B = ${J(String(UA))} - ${W < 0 ? `(${J(String(W))})` : J(String(W))} = ${J(String(UB))}`, t(W > 0 ? "Un lavoro positivo fa diminuire l'energia potenziale." : "Un lavoro negativo fa aumentare l'energia potenziale.")],
			// the work added instead of subtracted; the work alone; unchanged
			answer: choiceOf(rng, qOpt(String(UB), 'J'), [qOpt(String(wrong), 'J'), qOpt(String(Math.abs(W)), 'J'), qOpt(String(UA), 'J')]),
			params: { kind: 'finale', UA, W },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: the work of a spring

function level4(rng: Rng): Built {
	for (;;) {
		const k = int3(rng, 101, 999);
		const xA = data2(rng, 1.1, 25), xB = data2(rng, 1.1, 25);
		const a = Number(xA) / 100, b = Number(xB) / 100, kn = Number(k);
		if (Math.abs(a - b) < 0.02) continue;
		const UA = 0.5 * kn * a * a, UB = 0.5 * kn * b * b;
		const exact = UA - UB;
		const ans = r2(exact);
		if (ans === null || Math.abs(exact) < 0.1) continue;
		const verb = b > a ? 'tirata' : 'lasciata tornare';
		return {
			prompt: 'Trova il lavoro della forza elastica.',
			problem: textBlock(`Una molla con costante elastica ${pq(k, 'N/m')} è allungata di ${pq(xA, 'cm')}. Viene ${verb} fino a un allungamento di ${pq(xB, 'cm')}. Quanto lavoro compie la forza elastica?`),
			solution: `W_{el} \\approx ${J(ans)}`,
			steps: [
				`U_A = \\tfrac{1}{2} k x_A^2 = \\tfrac{1}{2} \\cdot ${qty(k, 'N/m')} \\cdot (${qty(cut(a), 'm')})^2 = ${J(cut(UA))}`,
				`U_B = \\tfrac{1}{2} k x_B^2 = \\tfrac{1}{2} \\cdot ${qty(k, 'N/m')} \\cdot (${qty(cut(b), 'm')})^2 = ${J(cut(UB))}`,
				`W_{el} = U_A - U_B = ${J(cut(exact))} \\approx ${J(ans)}`,
			],
			// the sign; the half forgotten; the difference squared instead of the difference of the squares
			answer: choose(rng, qOpt(ans, 'J'), uOpts(r2s([-exact, 2 * exact, Math.sign(exact) * 0.5 * kn * (a - b) ** 2]), 'J'), fallback(exact, 'J')),
			params: { k, xA, xB },
		};
	}
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: the graph of the potential energy

const AX: GraphAxis = { nome: 'x', unita: 'm', passo: 1, celle: 8, etichette: 1 };
const AY: GraphAxis = { nome: 'U', unita: 'J', passo: 5, celle: 10, etichette: 2 };

/** A graph with a well and a hill: four corners at whole metres, energies multiples of 5 J. */
function graph(rng: Rng): [number, number][] {
	const x1 = rng.int(1, 3), x2 = x1 + rng.int(2, 3);
	const U0 = 5 * rng.int(6, 9), U1 = 5 * rng.int(1, 3), U2 = 5 * rng.int(4, 7);
	const U3 = rng.int(0, 1) ? U2 : 5 * rng.int(1, 3);
	return [
		[0, U0],
		[x1, U1],
		[x2, U2],
		[8, U3],
	];
}
const describe = (p: [number, number][]) => `Il grafico dell'energia potenziale U in joule in funzione della posizione x in metri: una spezzata per i punti ${p.map(([x, u]) => `(${x}; ${u})`).join(', ')}`;

function level5(rng: Rng): Built {
	for (;;) {
		const pts = graph(rng);
		const xq = rng.int(1, 7);
		const U = valueAt(pts, xq);
		if (!Number.isInteger(U / 5)) continue;
		const E = 5 * rng.int(4, 10);
		const K = E - U;
		if (K < 15 || K % 10 === 0 || K === U) continue;
		const alt = `${describe(pts)}. Una retta orizzontale tratteggiata segna l'energia meccanica E, ${E} joule.`;
		const sc = { x: AX, y: AY, punti: pts, livello: { valore: E, nome: 'E' } };
		const near = [K + 10, K - 10, K + 20].filter((x) => x > 0).map((x) => qOpt(String(x), 'J'));
		return {
			prompt: "Trova l'energia cinetica.",
			problem: textBlock(`Un corpo si muove lungo l'asse $x$ sotto l'azione di una forza conservativa. Il grafico mostra la sua energia potenziale; la retta tratteggiata è la sua energia meccanica, $E = ${qty(String(E), 'J')}$. Quanta energia cinetica ha il corpo in $x = ${xq}\\,\\text{m}$?`),
			solution: `K = ${J(String(K))}`,
			steps: [`${t('Dal grafico, in ')} x = ${qty(String(xq), 'm')}${t(': ')} U = ${J(String(U))}`, `K = E - U = ${J(String(E))} - ${J(String(U))} = ${J(String(K))}`, t("L'energia cinetica è la distanza verticale tra il grafico e la retta.")],
			// the potential energy; the mechanical energy; their sum
			answer: choiceOf(rng, qOpt(String(K), 'J'), [qOpt(String(U), 'J'), qOpt(String(E), 'J'), qOpt(String(E + U), 'J')], near),
			params: { punti: pts, E, x: xq },
			scene: spezzata(alt, sc),
			solutionScene: spezzata(`${alt} Il punto del grafico in x uguale a ${xq} metri è segnato.`, { ...sc, segna: [[xq, U]] }),
		};
	}
}

function level6(rng: Rng): Built {
	for (;;) {
		const pts = graph(rng);
		const i = rng.int(0, 2);
		const [xa, Ua] = pts[i], [xb, Ub] = pts[i + 1];
		const dU = Ub - Ua, dx = xb - xa;
		const F = -dU / dx;
		const ans = dec(F, 1);
		if (ans === null || F === 0 || Number.isInteger(F / 10)) continue;
		const mk = (x: number) => {
			const s = dec(x, 2);
			return s === null || x === 0 ? null : qOpt(s, 'N');
		};
		const mistakes = [mk(-F), mk(-dU), mk(dU), mk(-Ub / xb)].filter((o): o is ChoiceOption => o !== null);
		const extra = [mk(2 * F), mk(F / 2), mk(-2 * F)].filter((o): o is ChoiceOption => o !== null);
		return {
			prompt: 'Trova la forza.',
			problem: textBlock(`Un corpo si muove lungo l'asse $x$ sotto l'azione di una forza conservativa, con l'energia potenziale del grafico. Quanto vale la forza $F_x$ che agisce sul corpo tra $x = ${xa}\\,\\text{m}$ e $x = ${xb}\\,\\text{m}$?`),
			solution: `F_x = ${qty(ans, 'N')}`,
			steps: [
				`${t('Dal grafico: ')} \\Delta U = ${J(String(Ub))} - ${J(String(Ua))} = ${J(String(dU))}, \\quad \\Delta x = ${qty(String(dx), 'm')}`,
				`F_x = -\\dfrac{\\Delta U}{\\Delta x} = -\\dfrac{${J(String(dU))}}{${qty(String(dx), 'm')}} = ${qty(ans, 'N')}`,
				t(F > 0 ? 'Il grafico scende: la forza è diretta verso destra.' : 'Il grafico sale: la forza è diretta verso sinistra.'),
			],
			// the minus sign forgotten; the variation of U not divided, with either sign; U over x at the end of the stretch
			answer: choiceOf(rng, qOpt(ans, 'N'), mistakes, extra),
			params: { punti: pts, xa, xb },
			scene: spezzata(`${describe(pts)}.`, { x: AX, y: AY, punti: pts }),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample);
	if ((sample.level === 5 || sample.level === 6) && !sample.scene) v.push('manca la scena');
	if (sample.level === 5 && !sample.solutionScene) v.push('manca la scena della soluzione');
	return v;
}

export const fisForzeConservativeEnergia: Generator = {
	id: ID,
	title: 'Forze conservative ed energia potenziale',
	levels: {
		1: { label: "L'attrito lungo due cammini", constraints: ['tavolo con la diagonale esatta', 'lavoro negativo, tra 1 e 99 J'] },
		2: { label: 'Il lavoro al ritorno', constraints: ['metà forza conservativa, metà attrito su andata e ritorno'] },
		3: { label: "Dal lavoro all'energia potenziale", constraints: ['energie intere tra 11 e 99 J', 'differenza di almeno 11 J, non multipla di 10'] },
		4: { label: 'Il lavoro di una molla', constraints: ['allungamenti in centimetri, diversi di almeno 2 cm', 'lavoro tra 0,1 e 99 J'] },
		5: { label: "L'energia cinetica dal grafico", constraints: ['grafico a tratti con energie multiple di 5 J', 'K di almeno 15 J, non multipla di 10'] },
		6: { label: 'La forza dal grafico', constraints: ['un tratto non orizzontale', 'forza con al più un decimale, non multipla di 10'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisForzeConservativeEnergia;
