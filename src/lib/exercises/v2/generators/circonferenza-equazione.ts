/**
 * Equazione della circonferenza. Spec: specs/exercises/circonferenza-equazione.md
 *
 * Seven levels in the order of lesson 114: centre and radius read from (x - α)² + (y - β)² = r², a point inside,
 * on or outside the circle, from centre and radius to the general form, centre and radius from the general form,
 * circle, single point or no point, coefficients to divide first, the equation from conditions (centre and a
 * point, the ends of a diameter, three points).
 *
 * Built backwards: centre and radius are chosen first and the equation is written from them. Distractors are the
 * mistakes of the ad-warning boxes of the lesson: the signs of the centre, r for r², the radius as the root of c,
 * a, b and c read without dividing.
 */
import type { ChoiceOption, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { Surd } from '../surd';
import { shuffle } from '../insiemi';
import { type Built, type Level, circleCentre, circleGeneral, circleOption, lattice, makeGenerator, nonZero, numOption, par, pointOption, pt, root, sum, surdAnswer, t, textOption, until } from '../circonferenza-parabola';

export const ID = 'circonferenza-equazione';

const centreRadius = (al: number, be: number, r: Surd): ChoiceOption => ({ latex: `${pt('C', al, be)},\\ r = ${r.toLatex()}`, values: [`${al}`, `${be}`, r.toString()] });
const int = (n: number): Surd => Surd.of(n, 0, 1, 1);
/** √n, or null when n is not positive. */
const rootOrNull = (n: Rational): Surd | null => (n.sign() > 0 ? Surd.of(0, 1, n.num * n.den, n.den) : null);
const R2_LATTICE = [5, 10, 13, 17, 25];

/** A centre with integer coordinates, not the origin. */
function centre(rng: Rng, m = 6): [number, number] {
	for (;;) {
		const al = rng.int(-m, m);
		const be = rng.int(-m, m);
		if (al !== 0 || be !== 0) return [al, be];
	}
}

// ---------------------------------------------------------------------------
// Level 1: centre and radius from (x - α)² + (y - β)² = r²

function level1(rng: Rng): Built {
	const [al, be] = centre(rng);
	const square = rng.next() < 0.7;
	const r2 = square ? rng.int(2, 7) ** 2 : rng.pick([2, 3, 5, 6, 7, 10, 13]);
	const r = root(r2);
	const eq = circleCentre(al, be, r2);
	const read = (v: string, k: number) => (k === 0 ? `${v}^2 = (${v} - 0)^2` : k < 0 ? `${v} + ${-k} = ${v} - (${k})` : `${v} - ${k}`);
	return {
		prompt: 'Trova il centro e il raggio della circonferenza.',
		problem: eq,
		solution: `${pt('C', al, be)},\\ r = ${r.toLatex()}`,
		steps: [
			`${t("L'equazione ha la forma ")} (x - \\alpha)^2 + (y - \\beta)^2 = r^2`,
			`${read('x', al)}${t(', quindi ')} \\alpha = ${al}${t('; ')} ${read('y', be)}${t(', quindi ')} \\beta = ${be}`,
			`r^2 = ${r2}${t(', quindi ')} r = ${square ? r.toLatex() : `\\sqrt{${r2}}`}`,
		],
		correct: centreRadius(al, be, r),
		distractors: [centreRadius(-al, -be, r), centreRadius(al, be, int(r2)), centreRadius(-al, -be, int(r2)), centreRadius(be, al, r), centreRadius(al, -be, r), centreRadius(-al, be, r)],
		params: { case: square ? 'intero' : 'radice', centre: [`${al}`, `${be}`], r2: `${r2}` },
	};
}

// ---------------------------------------------------------------------------
// Level 2: a point inside, on or outside

const POSITIONS = ['interno', 'sulla circonferenza', 'esterno'] as const;

function level2(rng: Rng): Built | null {
	const [al, be] = centre(rng, 4);
	const r2 = rng.pick(R2_LATTICE);
	const pos = rng.pick(POSITIONS);
	const grid: [number, number][] = [];
	for (let u = -6; u <= 6; u++) for (let v = -6; v <= 6; v++) if (u !== 0 || v !== 0) grid.push([u, v]);
	const [dx, dy] = rng.pick(pos === 'sulla circonferenza' ? lattice(r2) : grid.filter(([u, v]) => (pos === 'interno' ? u * u + v * v < r2 : u * u + v * v > r2)));
	const [x0, y0] = [al + dx, be + dy];
	const d2 = dx * dx + dy * dy;
	const sign = d2 < r2 ? '<' : d2 > r2 ? '>' : '=';
	const sub = (v: number, k: number) => (k === 0 ? `${par(v)}^2` : `(${v} ${k > 0 ? '-' : '+'} ${Math.abs(k)})^2`);
	return {
		prompt: 'Il punto P è interno alla circonferenza, sta sulla circonferenza o è esterno?',
		problem: `${circleCentre(al, be, r2)} \\quad ${pt('P', x0, y0)}`,
		solution: t(pos),
		steps: [
			`${t('Sostituisci le coordinate di ')} P ${t(' nel primo membro: ')} ${sub(x0, al)} + ${sub(y0, be)} = ${dx * dx} + ${dy * dy} = ${d2}`,
			`${d2} ${sign} ${r2}${t(`: il punto ${pos === 'sulla circonferenza' ? 'sta sulla circonferenza' : `è ${pos}`}.`)}`,
		],
		correct: textOption(pos),
		distractors: POSITIONS.filter((p) => p !== pos).map(textOption),
		n: 3,
		params: { case: pos, centre: [`${al}`, `${be}`], r2: `${r2}`, P: [`${x0}`, `${y0}`] },
	};
}

// ---------------------------------------------------------------------------
// Level 3: from centre and radius to the general form

function level3(rng: Rng): Built {
	const [al, be] = centre(rng, 5);
	const r = rng.int(1, 6);
	const c = al * al + be * be - r * r;
	return {
		prompt: "Scrivi in forma generale l'equazione della circonferenza di centro C e raggio r.",
		problem: `${pt('C', al, be)} \\quad r = ${r}`,
		solution: circleGeneral(-2 * al, -2 * be, c),
		steps: [
			`${circleCentre(al, be, r * r)}`,
			`${t('Sviluppa i quadrati: ')} ${sum([[1, 'x^2'], [-2 * al, 'x'], [al * al, ''], [1, 'y^2'], [-2 * be, 'y'], [be * be, '']])} = ${r * r}`,
			`${t('Porta tutto a primo membro: ')} ${circleGeneral(-2 * al, -2 * be, c)}`,
		],
		correct: circleOption(-2 * al, -2 * be, c),
		distractors: [circleOption(2 * al, 2 * be, c), circleOption(-2 * al, -2 * be, -r * r), circleOption(-2 * al, -2 * be, al * al + be * be - r), circleOption(-al, -be, c), circleOption(-2 * al, -2 * be, al * al + be * be + r * r), circleOption(-2 * al, -2 * be, c + 1)],
		params: { centre: [`${al}`, `${be}`], r: `${r}` },
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 6: centre and radius from the general form (at level 6 after dividing by k)

function radiusSteps(al: Rational, be: Rational, c: Rational, r: Rational): string[] {
	return [
		`\\alpha = -\\frac{a}{2} = ${al.toLatex()}, \\quad \\beta = -\\frac{b}{2} = ${be.toLatex()}`,
		`r = \\sqrt{\\alpha^2 + \\beta^2 - c} = \\sqrt{${al.mul(al).toLatex()} + ${be.mul(be).toLatex()} ${c.sign() < 0 ? '+' : '-'} ${c.abs().toLatex()}} = \\sqrt{${r.mul(r).toLatex()}} = ${r.toLatex()}`,
	];
}

function fromGeneral(rng: Rng, al: Rational, be: Rational, r: Rational, k: number, intro: string[]): Built | null {
	const c = al.mul(al).add(be.mul(be)).sub(r.mul(r));
	if (c.isZero()) return null;
	const [a, b] = [al.mul(q(-2)), be.mul(q(-2))];
	const K = q(k);
	const eq = `${sum([[K, 'x^2'], [K, 'y^2'], [a.mul(K), 'x'], [b.mul(K), 'y'], [c.mul(K), '']])} = 0`;
	const ask = rng.next() < 0.6 ? 'raggio' : 'centro';
	const params = { case: ask, k: `${k}`, centre: [al.toString(), be.toString()], r: r.toString() };
	const coeffs = `a = ${a.toLatex()},\\ b = ${b.toLatex()},\\ c = ${c.toLatex()}`;
	// what comes out reading a, b and c without dividing
	const [A, B, C] = [a.mul(K), b.mul(K), c.mul(K)];
	const [alW, beW] = [A.div(q(-2)), B.div(q(-2))];
	if (ask === 'raggio') {
		const wrong = (n: Rational): ChoiceOption | null => {
			const s = rootOrNull(n);
			return s ? numOption(s) : null;
		};
		return {
			prompt: 'Calcola il raggio della circonferenza.',
			problem: eq,
			solution: `r = ${r.toLatex()}`,
			steps: [...intro, coeffs, ...radiusSteps(al, be, c, r)],
			correct: numOption(r),
			distractors: [
				k > 1 ? wrong(alW.mul(alW).add(beW.mul(beW)).sub(C)) : null,
				wrong(c.neg()),
				wrong(c),
				numOption(r.mul(r)),
				wrong(al.mul(al).add(be.mul(be)).add(c)),
				wrong(a.mul(a).add(b.mul(b)).sub(c)),
				numOption(r.add(q(1))),
				numOption(r.mul(q(2))),
			],
			open: surdAnswer(Surd.rational(r)),
			params,
		};
	}
	return {
		prompt: 'Trova il centro della circonferenza.',
		problem: eq,
		solution: pt('C', al, be),
		steps: [...intro, coeffs, `\\alpha = -\\frac{a}{2} = ${al.toLatex()}, \\quad \\beta = -\\frac{b}{2} = ${be.toLatex()}`, `${t('Il centro è ')} ${pt('C', al, be)}`],
		correct: pointOption(al, be),
		distractors: [k > 1 ? pointOption(alW, beW) : null, pointOption(al.neg(), be.neg()), pointOption(a.neg(), b.neg()), pointOption(a, b), pointOption(be, al), pointOption(al, be.neg()), pointOption(al.neg(), be)],
		params,
	};
}

function level4(rng: Rng): Built | null {
	const [al, be] = centre(rng, 6);
	return fromGeneral(rng, q(al), q(be), q(rng.int(1, 7)), 1, [`${t("L'equazione è in forma generale ")} x^2 + y^2 + ax + by + c = 0`]);
}

function level6(rng: Rng): Built | null {
	const k = rng.pick([2, 2, 3, 4]);
	// at least one coordinate of the centre is a half
	const al = q(rng.int(-7, 7), 2);
	const be = q(rng.int(-7, 7), 2);
	if (al.isInteger() && be.isInteger()) return null;
	if (al.isZero() && be.isZero()) return null;
	const r = q(rng.int(1, 8), 2);
	const c = al.mul(al).add(be.mul(be)).sub(r.mul(r));
	if (!c.mul(q(k)).isInteger() || Math.abs(c.mul(q(k)).num) > 40) return null;
	return fromGeneral(rng, al, be, r, k, [`${t('I coefficienti di ')} x^2 ${t(' e ')} y^2 ${t(` valgono ${k}: dividi tutta l'equazione per ${k}.`)}`]);
}

// ---------------------------------------------------------------------------
// Level 5: circle, single point or no point

function level5(rng: Rng): Built | null {
	const u = rng.next();
	const kind = u < 0.4 ? 'circonferenza' : u < 0.7 ? 'punto' : 'nessuno';
	return until(() => level5of(rng, kind));
}

function level5of(rng: Rng, kind: 'circonferenza' | 'punto' | 'nessuno'): Built | null {
	const [al, be] = centre(rng, 5);
	const s = al * al + be * be;
	const v = kind === 'circonferenza' ? rng.int(1, 6) ** 2 : kind === 'punto' ? 0 : -rng.int(1, 9);
	const c = s - v;
	if (c === 0) return null;
	const circ = (r: Surd | null): ChoiceOption | null => (r ? { latex: `${t('una circonferenza, ')} r = ${r.toLatex()}`, values: ['circonferenza', r.toString()] } : null);
	const point = (x: number, y: number): ChoiceOption => ({ latex: `${t('il solo punto ')} ${pt('', x, y)}`, values: ['punto', `${x}`, `${y}`] });
	const none: ChoiceOption = { latex: t('nessun punto'), values: ['nessuno'] };
	const correct = kind === 'circonferenza' ? circ(root(v))! : kind === 'punto' ? point(al, be) : none;
	const wrongRadius = [circ(rootOrNull(q(Math.abs(c)))), circ(rootOrNull(q(Math.abs(v)))), circ(rootOrNull(q(s + c))), circ(root(s))];
	const distractors = kind === 'circonferenza' ? [point(al, be), none, ...wrongRadius, circ(int(v))] : kind === 'punto' ? [none, ...wrongRadius, point(-al, -be)] : [point(al, be), ...wrongRadius, point(-al, -be)];
	const what = kind === 'circonferenza' ? `${t('positivo: è una circonferenza di raggio ')} r = \\sqrt{${v}} = ${root(v).toLatex()}` : kind === 'punto' ? `${t("zero: l'equazione è vera solo nel punto ")} ${pt('', al, be)}` : t('negativo: nessun punto rende vera l\'equazione.');
	return {
		prompt: "Che cosa rappresenta l'equazione?",
		problem: circleGeneral(-2 * al, -2 * be, c),
		solution: correct.latex,
		steps: [
			`\\alpha = -\\frac{a}{2} = ${al}, \\quad \\beta = -\\frac{b}{2} = ${be}`,
			`\\alpha^2 + \\beta^2 - c = ${al * al} + ${be * be} ${c < 0 ? '+' : '-'} ${Math.abs(c)} = ${v}`,
			`${t('Il valore è ')} ${what}`,
		],
		correct,
		distractors,
		params: { case: kind, centre: [`${al}`, `${be}`], c: `${c}` },
	};
}

// ---------------------------------------------------------------------------
// Level 7: the equation from conditions

function level7(rng: Rng): Built | null {
	const u = rng.next();
	return until(() => level7of(rng, u));
}

function level7of(rng: Rng, u: number): Built | null {
	if (u < 0.35) {
		const [al, be] = centre(rng, 4);
		const dx = nonZero(rng, -5, 5);
		const dy = nonZero(rng, -5, 5);
		const r2 = dx * dx + dy * dy;
		const [xa, ya] = [al + dx, be + dy];
		const s = al * al + be * be;
		return {
			prompt: "Scrivi in forma generale l'equazione della circonferenza di centro C che passa per A.",
			problem: `${pt('C', al, be)} \\quad ${pt('A', xa, ya)}`,
			solution: circleGeneral(-2 * al, -2 * be, s - r2),
			steps: [
				`${t('Il quadrato del raggio è ')} \\overline{CA}^2${t(': ')} r^2 = ${par(dx)}^2 + ${par(dy)}^2 = ${r2}`,
				circleCentre(al, be, r2),
				`${t('In forma generale: ')} ${circleGeneral(-2 * al, -2 * be, s - r2)}`,
			],
			correct: circleOption(-2 * al, -2 * be, s - r2),
			distractors: [circleOption(2 * al, 2 * be, s - r2), circleOption(-2 * xa, -2 * ya, xa * xa + ya * ya - r2), circleOption(-2 * al, -2 * be, -r2), circleOption(-2 * al, -2 * be, s + r2), circleOption(-2 * al, -2 * be, s - (Math.abs(dx) + Math.abs(dy)) ** 2), circleOption(-al, -be, s - r2)],
			params: { case: 'centro e punto', C: [`${al}`, `${be}`], A: [`${xa}`, `${ya}`] },
		};
	}
	if (u < 0.7) {
		const [al, be] = centre(rng, 4);
		const dx = nonZero(rng, -4, 4);
		const dy = nonZero(rng, -4, 4);
		const r2 = dx * dx + dy * dy;
		const [xa, ya, xb, yb] = [al - dx, be - dy, al + dx, be + dy];
		const s = al * al + be * be;
		return {
			prompt: "Scrivi in forma generale l'equazione della circonferenza che ha per diametro il segmento AB.",
			problem: `${pt('A', xa, ya)} \\quad ${pt('B', xb, yb)}`,
			solution: circleGeneral(-2 * al, -2 * be, s - r2),
			steps: [
				`${t('Il centro è il punto medio di ')} AB${t(': ')} C\\left(\\frac{${xa} + ${par(xb)}}{2}, \\frac{${ya} + ${par(yb)}}{2}\\right) = ${pt('C', al, be)}`,
				`r^2 = \\overline{CA}^2 = ${par(-dx)}^2 + ${par(-dy)}^2 = ${r2}`,
				circleCentre(al, be, r2),
				`${t('In forma generale: ')} ${circleGeneral(-2 * al, -2 * be, s - r2)}`,
			],
			correct: circleOption(-2 * al, -2 * be, s - r2),
			distractors: [circleOption(-2 * al, -2 * be, s - 4 * r2), circleOption(2 * al, 2 * be, s - r2), circleOption(-2 * xa, -2 * ya, xa * xa + ya * ya - 4 * r2), circleOption(-2 * al, -2 * be, -r2), circleOption(-2 * al, -2 * be, s + r2), circleOption(-al, -be, s - r2)],
			params: { case: 'diametro', A: [`${xa}`, `${ya}`], B: [`${xb}`, `${yb}`] },
		};
	}
	const [al, be] = centre(rng, 3);
	const r2 = rng.pick(R2_LATTICE);
	const pts = shuffle(rng, lattice(r2)).slice(0, 3).map(([dx, dy]) => [al + dx, be + dy]);
	const [a, b, c] = [-2 * al, -2 * be, al * al + be * be - r2];
	if (c === 0) return null;
	const names = ['A', 'B', 'D'];
	const row = ([x, y]: number[]) => `${sum([[x, 'a'], [y, 'b'], [1, 'c']])} = ${-(x * x + y * y)}`;
	return {
		prompt: "Scrivi in forma generale l'equazione della circonferenza che passa per i tre punti.",
		problem: pts.map(([x, y], i) => pt(names[i], x, y)).join(' \\quad '),
		solution: circleGeneral(a, b, c),
		steps: [
			`${t('Sostituisci le coordinate di ogni punto in ')} x^2 + y^2 + ax + by + c = 0${t(':')}`,
			`\\begin{cases} ${pts.map(row).join(' \\\\ ')} \\end{cases}`,
			`${t('Risolvi il sistema: ')} a = ${a},\\ b = ${b},\\ c = ${c}`,
			`${t('La circonferenza è ')} ${circleGeneral(a, b, c)}`,
		],
		correct: circleOption(a, b, c),
		distractors: [circleOption(-a, -b, c), circleOption(a, b, -c), circleOption(b, a, c), circleOption(a, -b, c), circleOption(-a, b, c), circleOption(a, b, c + 1)],
		params: { case: 'tre punti', points: pts.map(([x, y]) => [`${x}`, `${y}`]) },
	};
}

// ---------------------------------------------------------------------------

const num = (v: unknown) => Rational.parse(String(v));

function nearOrigin(s: Sample): string[] {
	const coords = [s.params.centre, s.params.C, s.params.A, s.params.B, s.params.P, ...((s.params.points as string[][] | undefined) ?? [])].filter(Boolean).flat() as string[];
	return coords.some((v) => num(v).abs().compare(q(12)) > 0) ? ['coordinata oltre 12'] : [];
}

const levels: Record<number, Level> = {
	1: { label: 'Centro e raggio dall\'equazione', constraints: ['centro a coordinate intere tra -6 e 6, non l\'origine', 'r intero da 2 a 7 (70%) oppure r² non quadrato (30%)'], build: level1, check: nearOrigin },
	2: { label: 'Punto interno, esterno o sulla circonferenza', constraints: ['r² tra 5, 10, 13, 17, 25', 'i tre casi con la stessa frequenza'], build: level2, check: nearOrigin },
	3: { label: 'Dal centro e dal raggio alla forma generale', constraints: ['centro intero tra -5 e 5, r intero da 1 a 6'], build: level3, check: nearOrigin },
	4: { label: 'Centro e raggio dalla forma generale', constraints: ['a e b pari, c non nullo, raggio intero da 1 a 7', 'si chiede il raggio (60%) o il centro (40%)'], build: level4, check: nearOrigin },
	5: { label: 'Circonferenza, punto o nessun punto', constraints: ['a e b pari, c non nullo', 'circonferenza (40%), un solo punto (30%), nessun punto (30%)'], build: level5, check: nearOrigin },
	6: { label: 'Coefficienti da dividere', constraints: ['x² e y² con lo stesso coefficiente 2, 3 o 4', 'centro con almeno una coordinata frazionaria, raggio razionale'], build: level6, check: nearOrigin },
	7: { label: 'Equazione da condizioni', constraints: ['centro e un punto (35%), estremi di un diametro (35%), tre punti (30%)', 'coordinate intere'], build: level7, check: nearOrigin },
};

export const circonferenzaEquazione = makeGenerator(ID, 'Equazione della circonferenza', levels);
export default circonferenzaEquazione;
