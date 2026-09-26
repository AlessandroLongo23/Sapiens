/**
 * Punti notevoli del triangolo. Spec: specs/exercises/geometria-punti-notevoli.md
 *
 * Seven levels, from the "Per il generatore" section of the lesson's note: recognising the point from
 * its construction or property, the 2 : 1 ratio of the centroid on a median, where orthocentre and
 * circumcentre fall given two angles, the right triangle (circumcentre on the hypotenuse, median, centroid),
 * the angle between two angle bisectors, the angle between two altitudes, the two radii of the equilateral
 * triangle. No figures: every exercise stands on its text. Levels 1 and 3 answer with a choice; the others
 * with an exact number (a length in cm or an angle in degrees) and a multiple-choice variant whose
 * distractors are the mistakes the lesson warns about.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import { buildChoice, shuffle } from '../razionali';
import { textBlock } from '../insiemi';

export const ID = 'geometria-punti-notevoli';

const R = (s: string) => Rational.parse(s);
const t = (s: string) => `\\text{${s}}`;

// ---------------------------------------------------------------------------
// Numbers

/** Decimal places of a rational with a finite expansion, or null if periodic. */
function decimals(r: Rational): number | null {
	let d = r.den;
	let e2 = 0;
	let e5 = 0;
	for (; d % 2 === 0; e2++) d /= 2;
	for (; d % 5 === 0; e5++) d /= 5;
	return d === 1 ? Math.max(e2, e5) : null;
}

/** 12, 3{,}5, \frac{10}{3}: a positive number as the lesson writes it. */
function numTex(r: Rational): string {
	if (r.isInteger()) return String(r.num);
	const k = decimals(r);
	if (k === null) return `\\frac{${r.num}}{${r.den}}`;
	const s = String(Math.round((r.num * 10 ** k) / r.den)).padStart(k + 1, '0');
	return `${s.slice(0, s.length - k)}{,}${s.slice(s.length - k)}`;
}

const cm = (r: Rational) => `${numTex(r)}\\text{ cm}`;
const deg = (n: number) => `${n}^\\circ`;
const hat = (v: string) => `\\hat{${v}}`;
const wide = (a: string, b: string, c: string) => `\\widehat{${a}${b}${c}}`;

// ---------------------------------------------------------------------------
// Level 1: recognising the point

type Pt = 'G' | 'H' | 'O' | 'I';
const PT_NAME: Record<Pt, string> = { G: 'baricentro', H: 'ortocentro', O: 'circocentro', I: 'incentro' };
const PT_ARTICLE: Record<Pt, string> = { G: 'il baricentro', H: "l'ortocentro", O: 'il circocentro', I: "l'incentro" };
const POINTS: Pt[] = ['G', 'H', 'O', 'I'];

const TRIANGLES: [string, string, string][] = [
	['A', 'B', 'C'],
	['D', 'E', 'F'],
	['R', 'S', 'T'],
	['K', 'L', 'M'],
];

/** Descriptions of a point P, from the construction or from a property; a, b, c are the vertices, c the special one. */
const DESCRIPTIONS: { pt: Pt; key: string; text: (a: string, b: string, c: string) => string }[] = [
	{ pt: 'G', key: 'mediane', text: (a, b, c) => `Nel triangolo $${a}${b}${c}$ il punto $P$ è quello in cui si incontrano le tre mediane.` },
	{ pt: 'G', key: 'punti-medi', text: (a, b, c) => `Nel triangolo $${a}${b}${c}$ si unisce ogni vertice al punto medio del lato opposto: i tre segmenti si incontrano nel punto $P$.` },
	{ pt: 'G', key: 'doppia', text: (a, b, c) => `Il punto $P$ divide ognuna delle tre mediane del triangolo $${a}${b}${c}$ in due parti, una doppia dell'altra.` },
	{ pt: 'G', key: 'equilibrio', text: (a, b, c) => `Un triangolo di cartone $${a}${b}${c}$ sta in equilibrio sulla punta di una matita messa nel punto $P$.` },
	{ pt: 'H', key: 'altezze', text: (a, b, c) => `Nel triangolo $${a}${b}${c}$ il punto $P$ è quello in cui si incontrano le tre altezze, o le rette che le contengono.` },
	{ pt: 'H', key: 'perpendicolari-vertici', text: (a, b, c) => `Da ogni vertice del triangolo $${a}${b}${c}$ si conduce la perpendicolare alla retta del lato opposto: le tre rette si incontrano nel punto $P$.` },
	{ pt: 'H', key: 'vertice-retto', text: (a, b, c) => `Il triangolo $${a}${b}${c}$ è rettangolo in $${c}$, e il punto notevole $P$ coincide con il vertice $${c}$ dell'angolo retto.` },
	{ pt: 'H', key: 'ottuso', text: (a, b, c) => `Il triangolo $${a}${b}${c}$ è ottusangolo in $${c}$, e il punto notevole $P$ è fuori dal triangolo, dalla parte del vertice $${c}$.` },
	{ pt: 'O', key: 'assi', text: (a, b, c) => `Nel triangolo $${a}${b}${c}$ il punto $P$ è quello in cui si incontrano gli assi dei tre lati.` },
	{ pt: 'O', key: 'perpendicolari-punti-medi', text: (a, b, c) => `Si conducono le perpendicolari ai lati del triangolo $${a}${b}${c}$ nei loro punti medi: le tre rette si incontrano nel punto $P$.` },
	{ pt: 'O', key: 'vertici', text: (a, b, c) => `Il punto $P$ ha la stessa distanza dai tre vertici del triangolo $${a}${b}${c}$.` },
	{ pt: 'O', key: 'circoscritta', text: (a, b, c) => `Il punto $P$ è il centro della circonferenza che passa per i tre vertici del triangolo $${a}${b}${c}$.` },
	{ pt: 'O', key: 'ipotenusa', text: (a, b, c) => `Il triangolo $${a}${b}${c}$ è rettangolo in $${c}$, e il punto notevole $P$ è il punto medio dell'ipotenusa $${a}${b}$.` },
	{ pt: 'O', key: 'case', text: (a, b, c) => `Tre case sono nei punti $${a}$, $${b}$, $${c}$. Il pozzo $P$ ha la stessa distanza dalle tre case.` },
	{ pt: 'I', key: 'bisettrici', text: (a, b, c) => `Nel triangolo $${a}${b}${c}$ il punto $P$ è quello in cui si incontrano le bisettrici dei tre angoli.` },
	{ pt: 'I', key: 'lati', text: (a, b, c) => `Il punto $P$, interno al triangolo $${a}${b}${c}$, ha la stessa distanza dai tre lati.` },
	{ pt: 'I', key: 'inscritta', text: (a, b, c) => `Il punto $P$ è il centro della circonferenza che sta dentro il triangolo $${a}${b}${c}$ e tocca i tre lati.` },
	{ pt: 'I', key: 'strade', text: (a, b, c) => `Tre strade dritte formano il triangolo $${a}${b}${c}$. La fontana $P$, dentro il triangolo, ha la stessa distanza dalle tre strade.` },
	{ pt: 'I', key: 'meta-angoli', text: (a, b, c) => `Si divide a metà ognuno dei tre angoli del triangolo $${a}${b}${c}$: le tre semirette si incontrano nel punto $P$.` },
];

/** Properties as answer options: one or two lines, each true of one point only. */
const PROPERTIES: { pt: Pt; key: string; lines: string[] }[] = [
	{ pt: 'G', key: 'mediane', lines: ['è il punto di incontro', 'delle mediane'] },
	{ pt: 'G', key: 'doppia', lines: ['divide ogni mediana in due', "parti, una doppia dell'altra"] },
	{ pt: 'G', key: 'equilibrio', lines: ['è il punto di equilibrio', 'del triangolo'] },
	{ pt: 'H', key: 'altezze', lines: ['è il punto di incontro', 'delle altezze'] },
	{ pt: 'H', key: 'vertice-retto', lines: ['nel triangolo rettangolo è', "il vertice dell'angolo retto"] },
	{ pt: 'H', key: 'ottuso', lines: ["nell'ottusangolo è esterno,", "dalla parte dell'angolo ottuso"] },
	{ pt: 'O', key: 'assi', lines: ['è il punto di incontro', 'degli assi dei lati'] },
	{ pt: 'O', key: 'vertici', lines: ['ha la stessa distanza', 'dai tre vertici'] },
	{ pt: 'O', key: 'circoscritta', lines: ['è il centro della', 'circonferenza circoscritta'] },
	{ pt: 'O', key: 'ipotenusa', lines: ['nel triangolo rettangolo è il', "punto medio dell'ipotenusa"] },
	{ pt: 'I', key: 'bisettrici', lines: ['è il punto di incontro', 'delle bisettrici'] },
	{ pt: 'I', key: 'lati', lines: ['ha la stessa distanza', 'dai tre lati'] },
	{ pt: 'I', key: 'inscritta', lines: ['è il centro della', 'circonferenza inscritta'] },
];

const linesTex = (ls: string[]) => (ls.length === 1 ? t(ls[0]) : `\\begin{gathered} ${ls.map(t).join(' \\\\ ')} \\end{gathered}`);
const pointOption = (p: Pt): ChoiceOption => ({ latex: `${t(`${PT_NAME[p]} `)}${p}`, values: [p] });

function why(p: Pt): string {
	return {
		G: "il baricentro è il punto di incontro delle mediane, che divide ognuna in due parti, una doppia dell'altra",
		H: "l'ortocentro è il punto di incontro delle altezze (o delle loro rette)",
		O: "il circocentro è il punto di incontro degli assi dei lati, equidistante dai vertici e centro della circonferenza circoscritta",
		I: "l'incentro è il punto di incontro delle bisettrici, equidistante dai lati e centro della circonferenza inscritta",
	}[p];
}

interface Built {
	case: string;
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: { kind: 'number'; value: Rational; wrong: Rational[]; unit: 'cm' | 'deg' } | { kind: 'choice'; choice: ChoiceAnswer };
	params: Record<string, unknown>;
}

function level1(rng: Rng): Built {
	const [a, b, c] = rng.pick(TRIANGLES);
	if (rng.next() < 0.6) {
		const d = rng.pick(DESCRIPTIONS);
		const choice = buildChoice(rng, pointOption(d.pt), POINTS.filter((p) => p !== d.pt).map(pointOption));
		return {
			case: 'dalla proprietà al punto',
			prompt: 'Quale punto notevole è P?',
			problem: textBlock(d.text(a, b, c)),
			solution: `P ${t(` è ${PT_ARTICLE[d.pt]} `)}${d.pt}`,
			steps: [t(`La descrizione è quella del ${PT_NAME[d.pt]}: ${why(d.pt)}`)],
			answer: { kind: 'choice', choice },
			params: { point: d.pt, description: d.key, triangle: `${a}${b}${c}` },
		};
	}
	const p = rng.pick(POINTS);
	const right = rng.pick(PROPERTIES.filter((x) => x.pt === p));
	const wrong = POINTS.filter((x) => x !== p).map((x) => rng.pick(PROPERTIES.filter((y) => y.pt === x)));
	const opt = (x: (typeof PROPERTIES)[number]): ChoiceOption => ({ latex: linesTex(x.lines), values: [`${x.pt}:${x.key}`] });
	const choice = buildChoice(rng, opt(right), wrong.map(opt));
	return {
		case: 'dal punto alla proprietà',
		prompt: 'Scegli la proprietà giusta.',
		problem: textBlock(`Quale di queste proprietà ha ${PT_ARTICLE[p]} $${p}$ di un triangolo?`),
		solution: t(right.lines.join(' ')),
		steps: [t(`Per definizione ${why(p)}`), t('Le altre proprietà sono di altri punti notevoli')],
		answer: { kind: 'choice', choice },
		params: { point: p, property: right.key, others: wrong.map((w) => `${w.pt}:${w.key}`) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the centroid on a median

const MEDIANS: [string, string][] = [
	['A', 'M'],
	['B', 'N'],
	['C', 'L'],
];

/** A length of 1 to 15 cm, in steps of 0.5 cm, one time in four with the half. */
function unitLength(rng: Rng, max = 15): Rational {
	return rng.next() < 0.25 ? q(2 * rng.int(1, max - 1) + 1, 2) : q(rng.int(1, max));
}

function level2(rng: Rng): Built {
	const [v, m] = rng.pick(MEDIANS);
	const g = unitLength(rng, 12); // GM
	const len = { med: g.mul(q(3)), vg: g.mul(q(2)), gm: g };
	const name = { med: `${v}${m}`, vg: `${v}G`, gm: `G${m}` };
	const [given, ask] = rng.pick([
		['med', 'gm'],
		['med', 'vg'],
		['gm', 'vg'],
		['gm', 'med'],
		['vg', 'gm'],
		['vg', 'med'],
	] as const);
	const x = len[given];
	const value = len[ask];
	// The lesson's warnings: the ratio the wrong way round, G as the midpoint of the median.
	const W: Record<string, Rational[]> = {
		'med>gm': [x.mul(q(2, 3)), x.mul(q(1, 2)), x.mul(q(2))],
		'med>vg': [x.mul(q(1, 3)), x.mul(q(1, 2)), x.mul(q(2))],
		'gm>vg': [x.mul(q(1, 2)), x.mul(q(3)), x],
		'gm>med': [x.mul(q(2)), x.mul(q(3, 2)), x.mul(q(4))],
		'vg>gm': [x.mul(q(2)), x, x.mul(q(3, 2))],
		'vg>med': [x.mul(q(3)), x.mul(q(2)), x.mul(q(1, 2))],
	};
	const text: Record<string, string> = {
		med: `la mediana $${name.med}$ è lunga $${numTex(x)}$ cm`,
		gm: `il segmento $${name.gm}$ è lungo $${numTex(x)}$ cm`,
		vg: `il segmento $${name.vg}$ è lungo $${numTex(x)}$ cm`,
	};
	const question = ask === 'med' ? `Quanto è lunga la mediana $${name.med}$?` : `Quanto è lungo $${name[ask]}$?`;
	const steps = [t("Il baricentro divide la mediana in due parti, una doppia dell'altra: ") + `${name.gm}${t(' è un terzo della mediana e ')}${name.vg}${t(' i due terzi')}`];
	if (given === 'med') steps.push(`${name.gm} = ${numTex(x)} : 3 = ${cm(g)}`);
	if (given === 'vg') steps.push(`${name.gm} = ${numTex(x)} : 2 = ${cm(g)}`);
	if (ask === 'vg' || (ask === 'med' && given === 'gm')) steps.push(`${name.vg} = 2 \\cdot ${numTex(g)} = ${cm(len.vg)}`);
	if (ask === 'med') steps.push(`${name.med} = ${numTex(len.vg)} + ${numTex(g)} = ${cm(value)}`);
	return {
		case: `${given}>${ask}`,
		prompt: 'Risolvi il problema.',
		problem: textBlock(`Nel triangolo $ABC$ il punto $G$ è il baricentro e ${text[given]}. ${question}`),
		solution: `${name[ask]} = ${cm(value)}`,
		steps,
		answer: { kind: 'number', value, wrong: W[`${given}>${ask}`], unit: 'cm' },
		params: { vertex: v, midpoint: m, given, ask, x: x.toString() },
	};
}

// ---------------------------------------------------------------------------
// Level 3: where orthocentre and circumcentre fall

const LOC = ['interno', 'esterno', 'vertice', 'punto medio'] as const;
type Loc = (typeof LOC)[number];

/** Three angles, multiples of 5, of the given kind, in random order over A, B, C. */
function triangleAngles(rng: Rng, kind: 'acutangolo' | 'rettangolo' | 'ottusangolo'): number[] {
	for (;;) {
		let big: number;
		if (kind === 'rettangolo') big = 90;
		else if (kind === 'ottusangolo') big = 5 * rng.int(19, 30);
		else big = 5 * rng.int(13, 17);
		const rest = 180 - big;
		const x = 5 * rng.int(3, rest / 5 - 3);
		const y = rest - x;
		if (y < 15 || x >= big || y >= big) continue;
		if (kind === 'acutangolo' && (x >= 90 || y >= 90)) continue;
		return shuffle(rng, [big, x, y]);
	}
}

function level3(rng: Rng): Built {
	const kind = rng.pick(['acutangolo', 'rettangolo', 'ottusangolo'] as const);
	const u = rng.next();
	const p: Pt = u < 0.4 ? 'H' : u < 0.8 ? 'O' : rng.pick(['G', 'I'] as const);
	const angles = triangleAngles(rng, kind);
	const V = ['A', 'B', 'C'];
	const bigAt = angles.indexOf(Math.max(...angles));
	const X = V[bigAt];
	const side = V.filter((_, i) => i !== bigAt).join('');
	const hidden = rng.int(0, 2);
	const shown = [0, 1, 2].filter((i) => i !== hidden);
	let loc: Loc = 'interno';
	if (p === 'H' || p === 'O') {
		if (kind === 'ottusangolo') loc = 'esterno';
		if (kind === 'rettangolo') loc = p === 'H' ? 'vertice' : 'punto medio';
	}
	const label: Record<Loc, string> = {
		interno: t('interno al triangolo'),
		esterno: t('esterno al triangolo'),
		vertice: `${t('nel vertice ')}${X}`,
		'punto medio': `${t('nel punto medio di ')}${side}`,
	};
	const opt = (l: Loc): ChoiceOption => ({ latex: label[l], values: [l] });
	const choice = buildChoice(
		rng,
		opt(loc),
		LOC.filter((l) => l !== loc).map(opt),
	);
	const [i, j] = shown;
	const third = 180 - angles[i] - angles[j];
	const where: Record<Pt, Record<string, string>> = {
		H: { acutangolo: "nel triangolo acutangolo l'ortocentro è interno", rettangolo: "nel triangolo rettangolo l'ortocentro è il vertice dell'angolo retto", ottusangolo: "nel triangolo ottusangolo l'ortocentro è esterno, dalla parte del vertice dell'angolo ottuso" },
		O: { acutangolo: 'nel triangolo acutangolo il circocentro è interno', rettangolo: "nel triangolo rettangolo il circocentro è il punto medio dell'ipotenusa", ottusangolo: "nel triangolo ottusangolo il circocentro è esterno, oltre il lato opposto all'angolo ottuso" },
		G: { acutangolo: 'il baricentro è sempre interno', rettangolo: 'il baricentro è sempre interno', ottusangolo: 'il baricentro è sempre interno' },
		I: { acutangolo: "l'incentro è sempre interno", rettangolo: "l'incentro è sempre interno", ottusangolo: "l'incentro è sempre interno" },
	};
	const typeStep =
		kind === 'acutangolo'
			? t('Tutti e tre gli angoli sono acuti: il triangolo è acutangolo')
			: kind === 'rettangolo'
				? `${hat(X)} = 90^\\circ${t(': il triangolo è rettangolo in ')}${X}${t(", con ipotenusa ")}${side}`
				: `${hat(X)} = ${deg(angles[bigAt])}${t(': il triangolo è ottusangolo in ')}${X}`;
	return {
		case: kind,
		prompt: 'Scegli dove si trova il punto.',
		problem: textBlock(
			`Nel triangolo $ABC$ gli angoli $${hat(V[i])}$ e $${hat(V[j])}$ misurano $${deg(angles[i])}$ e $${deg(angles[j])}$. Dove si trova ${PT_ARTICLE[p]} $${p}$?`,
		),
		solution: `${p}\\ ${label[loc]}`,
		steps: [`${hat(V[hidden])} = 180^\\circ - ${deg(angles[i])} - ${deg(angles[j])} = ${deg(third)}`, typeStep, t(`Nella tabella della lezione: ${where[p][kind]}`)],
		answer: { kind: 'choice', choice },
		params: { point: p, kind, angles: angles.map(String), shown, location: loc },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the right triangle

function level4(rng: Rng): Built {
	const ask = rng.pick(['raggio', 'mediana', 'baricentro', 'ipotenusa'] as const);
	// The right angle at any vertex: C is its letter here, A and B the ends of the hypotenuse.
	const C = rng.pick(['A', 'B', 'C']);
	const [A, B] = ['A', 'B', 'C'].filter((v) => v !== C);
	const intro = `Il triangolo $ABC$ è rettangolo in $${C}$`;
	if (ask === 'ipotenusa') {
		const c = unitLength(rng, 12); // CG
		const go = c.mul(q(1, 2));
		const med = c.add(go);
		const value = med.mul(q(2));
		return {
			case: ask,
			prompt: 'Risolvi il problema.',
			problem: textBlock(`${intro} e il suo baricentro $G$ dista $${numTex(c)}$ cm dal vertice $${C}$. Quanto è lunga l'ipotenusa $${A}${B}$?`),
			solution: `${A}${B} = ${cm(value)}`,
			steps: [
				t("Il baricentro sta sulla mediana relativa all'ipotenusa, che va da ") + `${C}${t(' al punto medio ')}O${t(' di ')}${A}${B}`,
				t('La parte verso il vertice è il doppio dell\'altra: ') + `GO = ${numTex(c)} : 2 = ${cm(go)}${t(', quindi ')}${C}O = ${numTex(c)} + ${numTex(go)} = ${cm(med)}`,
				t("Il punto medio dell'ipotenusa è il circocentro: ") + `${C}O${t(' è un raggio e ')}${A}${B}${t(' è un diametro')}`,
				`${A}${B} = 2 \\cdot ${numTex(med)} = ${cm(value)}`,
			],
			answer: { kind: 'number', value, wrong: [med, c.mul(q(6)), c.mul(q(4)), c.mul(q(2))], unit: 'cm' },
			params: { ask, right: C, x: c.toString() },
		};
	}
	const h = ask === 'baricentro' ? q(rng.next() < 0.65 ? 3 * rng.int(2, 12) : rng.int(4, 36)) : unitLength(rng, 40); // the hypotenuse
	const half = h.mul(q(1, 2));
	const question = {
		raggio: 'Quanto misura il raggio della circonferenza circoscritta?',
		mediana: "Quanto è lunga la mediana relativa all'ipotenusa?",
		baricentro: `A che distanza dal vertice $${C}$ si trova il baricentro $G$?`,
	}[ask];
	const value = ask === 'baricentro' ? h.mul(q(1, 3)) : half;
	const steps = [t('Il circocentro è il punto medio ') + `O${t(" dell'ipotenusa, e il raggio è metà dell'ipotenusa: ")}O${A} = ${numTex(h)} : 2 = ${cm(half)}`];
	if (ask !== 'raggio') steps.push(t("La mediana relativa all'ipotenusa va da ") + `${C}${t(' a ')}O${t(': è un raggio, quindi ')}${C}O = ${cm(half)}`);
	if (ask === 'baricentro') steps.push(t('Il baricentro sta sulla mediana, ai due terzi dal vertice: ') + `${C}G = \\frac{2}{3} \\cdot ${numTex(half)} = ${cm(value)}`);
	const wrong = {
		raggio: [h, h.mul(q(1, 3)), h.mul(q(2, 3)), h.mul(q(1, 4))],
		mediana: [h, h.mul(q(1, 3)), h.mul(q(2, 3)), h.mul(q(1, 4))],
		baricentro: [h.mul(q(1, 6)), h.mul(q(1, 4)), h.mul(q(2, 3)), half],
	}[ask];
	return {
		case: ask,
		prompt: 'Risolvi il problema.',
		problem: textBlock(`${intro} e l'ipotenusa $${A}${B}$ è lunga $${numTex(h)}$ cm. ${question}`),
		solution: `${ask === 'raggio' ? 'R' : ask === 'mediana' ? `${C}O` : `${C}G`} = ${cm(value)}`,
		steps,
		answer: { kind: 'number', value, wrong, unit: 'cm' },
		params: { ask, right: C, x: h.toString() },
	};
}

// ---------------------------------------------------------------------------
// Levels 5 and 6: angles between bisectors and between altitudes

/** Vertex order: the asked angle is at the point between V[1] and V[2]; V[0] is the opposite vertex. */
function angleSetup(rng: Rng, step: number, lo: number, hi: number, acute: boolean) {
	for (;;) {
		const x = step * rng.int(Math.ceil(lo / step), Math.floor(hi / step));
		const y = step * rng.int(Math.ceil(lo / step), Math.floor(hi / step));
		const z = 180 - x - y;
		if (z < lo || z > hi) continue;
		if (acute && (x >= 90 || y >= 90 || z >= 90)) continue;
		if (x === 60 && y === 60) continue;
		const V = shuffle(rng, ['A', 'B', 'C']);
		const ang: Record<string, number> = { [V[0]]: z, [V[1]]: x, [V[2]]: y };
		return { V, ang };
	}
}

function level56(rng: Rng, level: 5 | 6): Built {
	const bis = level === 5;
	const { V, ang } = bis ? angleSetup(rng, 2, 20, 130, false) : angleSetup(rng, 5, 35, 85, true);
	const [Z, X, Y] = V;
	const direct = rng.next() < 0.5;
	// Given angles: the two at the ends of the asked angle, or the opposite one and one of them.
	const given = direct ? [X, Y].sort() : [Z, rng.pick([X, Y])].sort();
	const P = bis ? 'I' : 'H';
	const sorted = (a: string, b: string) => [a, b].sort().join('');
	const [e1, e2] = sorted(X, Y).split('');
	const asked = wide(e1, P, e2);
	const z = ang[Z];
	const value = bis ? 90 + z / 2 : 180 - z;
	const steps: string[] = [];
	if (!direct) {
		const other = given.find((v) => v !== Z) as string;
		const missing = other === X ? Y : X;
		steps.push(`${hat(missing)} = 180^\\circ - ${deg(ang[Z])} - ${deg(ang[other])} = ${deg(ang[missing])}`);
	}
	const x = ang[e1];
	const y = ang[e2];
	if (bis) {
		steps.push(t('Le bisettrici dividono a metà gli angoli: ') + `${wide('I', e1, e2)} = ${deg(x)} : 2 = ${deg(x / 2)}${t(', ')}${wide('I', e2, e1)} = ${deg(y)} : 2 = ${deg(y / 2)}`);
		steps.push(`${t('Nel triangolo ')}${e1}I${e2}${t(': ')}${asked} = 180^\\circ - ${deg(x / 2)} - ${deg(y / 2)} = ${deg(value)}`);
	} else {
		steps.push(
			t("L'altezza da ") + `${e1}${t(' forma un triangolo rettangolo con il lato ')}${e1}${e2}${t(': ')}${wide('H', e1, e2)} = 90^\\circ - ${deg(y)} = ${deg(90 - y)}`,
		);
		steps.push(t("Allo stesso modo con l'altezza da ") + `${e2}${t(': ')}${wide('H', e2, e1)} = 90^\\circ - ${deg(x)} = ${deg(90 - x)}`);
		steps.push(`${t('Nel triangolo ')}${e1}H${e2}${t(': ')}${asked} = 180^\\circ - ${deg(90 - y)} - ${deg(90 - x)} = ${deg(value)}`);
	}
	// Mistakes: the angles not halved (bisectors), the other point's formula, the opposite angle itself.
	const wrong = bis ? [z, 180 - z, 90 - z / 2, 90 + z] : [z, 90 + z / 2, 90 - z / 2, 90 + z];
	const lead = bis ? `Le bisettrici degli angoli $${hat(e1)}$ e $${hat(e2)}$` : `Le altezze che partono dai vertici $${e1}$ e $${e2}$`;
	const where = bis ? "si incontrano nell'incentro $I$" : "si incontrano nell'ortocentro $H$";
	const kind = bis ? '' : ' acutangolo';
	const data = given.map((v) => `$${hat(v)} = ${deg(ang[v])}$`).join(' e ');
	return {
		case: direct ? 'angoli agli estremi' : 'angolo opposto',
		prompt: 'Risolvi il problema.',
		problem: textBlock(
			`Nel triangolo${kind} $ABC$ gli angoli misurano ${data}. ${lead} ${where}. Quanto misura $${asked}$?`,
		),
		solution: `${asked} = ${deg(value)}`,
		steps,
		answer: { kind: 'number', value: q(value), wrong: wrong.filter((w) => Number.isInteger(w)).map((w) => q(w)), unit: 'deg' },
		params: { point: P, angles: { A: ang.A, B: ang.B, C: ang.C }, given, asked: `${e1}${e2}` },
	};
}

// ---------------------------------------------------------------------------
// Level 7: the equilateral triangle

function level7(rng: Rng): Built {
	const r = unitLength(rng, 15);
	const len = { h: r.mul(q(3)), r, R: r.mul(q(2)) };
	const words = { h: "l'altezza", r: 'il raggio della circonferenza inscritta', R: 'il raggio della circonferenza circoscritta' };
	const [given, ask] = rng.pick([
		['h', 'r'],
		['h', 'R'],
		['r', 'R'],
		['r', 'h'],
		['R', 'r'],
		['R', 'h'],
	] as const);
	const x = len[given];
	const value = len[ask];
	// Wrong models of how the centre splits the height (h : r : R): the ratio reversed, the centre as the
	// midpoint, R taken for the height, r taken for half of R the wrong way.
	const models: [number, number, number][] = [
		[3, 2, 1],
		[2, 1, 1],
		[3, 1, 3],
		[2, 1, 2],
	];
	const idx = { h: 0, r: 1, R: 2 };
	const wrong = models.map((mdl) => x.mul(q(mdl[idx[ask]], mdl[idx[given]])));
	const lengthWord = given === 'h' ? 'è lunga' : 'è lungo';
	const question = ask === 'h' ? "Quanto è lunga l'altezza del triangolo?" : `Quanto misura ${words[ask]}?`;
	const steps = [t("Il centro divide l'altezza in due parti, una doppia dell'altra: ") + `r${t(' è un terzo di ')}h${t(' e ')}R${t(' i due terzi')}`];
	if (given === 'h') steps.push(`r = ${numTex(x)} : 3 = ${cm(r)}`);
	if (given === 'R') steps.push(`r = ${numTex(x)} : 2 = ${cm(r)}`);
	if (ask === 'R') steps.push(`R = 2 \\cdot ${numTex(r)} = ${cm(value)}`);
	if (ask === 'h') steps.push(`h = 3 \\cdot ${numTex(r)} = ${cm(value)}`);
	const cap = words[given].charAt(0).toUpperCase() + words[given].slice(1);
	return {
		case: `${given}>${ask}`,
		prompt: 'Risolvi il problema.',
		problem: textBlock(`${cap} di un triangolo equilatero ${lengthWord} $${numTex(x)}$ cm. ${question}`),
		solution: `${ask} = ${cm(value)}`,
		steps,
		answer: { kind: 'number', value, wrong, unit: 'cm' },
		params: { given, ask, x: x.toString() },
	};
}

// ---------------------------------------------------------------------------

function build(rng: Rng, level: number): Built {
	switch (level) {
		case 1:
			return level1(rng);
		case 2:
			return level2(rng);
		case 3:
			return level3(rng);
		case 4:
			return level4(rng);
		case 5:
			return level56(rng, 5);
		case 6:
			return level56(rng, 6);
		case 7:
			return level7(rng);
		default:
			throw new Error(`${ID}: unknown level ${level}`);
	}
}

function numberOption(r: Rational, unit: string): ChoiceOption {
	return { latex: unit === 'deg' ? deg(r.num) : cm(r), values: [r.toString()] };
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	const lvl = sample.level;
	if (!sample.steps.length) v.push('nessun passaggio');
	if (lvl === 1 || lvl === 3) {
		const a = sample.answer;
		if (a.kind !== 'choice') return ['risposta non a scelta'];
		if (a.options.length !== 4) v.push('servono 4 opzioni');
		if (lvl === 1 && p.description && a.options[a.correct].values[0] !== p.point) v.push('opzione giusta sbagliata');
		if (lvl === 1 && p.property && a.options[a.correct].values[0] !== `${p.point}:${p.property}`) v.push('opzione giusta sbagliata');
		if (lvl === 3 && a.options[a.correct].values[0] !== p.location) v.push('opzione giusta sbagliata');
		if (lvl === 3) {
			const ang = (p.angles as string[]).map(Number);
			if (ang.reduce((s, x) => s + x, 0) !== 180) v.push('angoli che non sommano 180');
			if (ang.some((x) => x < 15 || x % 5)) v.push('angolo fuori dai limiti');
		}
		return v;
	}
	if (sample.answer.kind !== 'number') return ['risposta non numerica'];
	const value = R(sample.answer.value);
	if (value.sign() <= 0) v.push('risposta non positiva');
	if (lvl === 2 || lvl === 4 || lvl === 7) {
		const x = R(p.x as string);
		if (decimals(x) === null || (decimals(x) ?? 0) > 1) v.push('dato non decimale a una cifra');
		if (x.compare(q(45)) > 0) v.push('dato troppo grande');
		if (lvl !== 4 && (decimals(value) ?? 9) > 2) v.push('risposta non decimale');
		if (lvl === 4 && value.den > 3 && decimals(value) === null) v.push('risposta con denominatore grande');
	}
	if (lvl === 5 || lvl === 6) {
		const ang = p.angles as Record<string, number>;
		const vals = [ang.A, ang.B, ang.C];
		if (vals.reduce((s, x) => s + x, 0) !== 180) v.push('angoli che non sommano 180');
		if (lvl === 6 && vals.some((x) => x >= 90)) v.push('triangolo non acutangolo');
		if (lvl === 5 && vals.some((x) => x % 2)) v.push('angolo dispari');
		const opp = 'ABC'.split('').find((c) => !(p.asked as string).includes(c)) as string;
		const want = lvl === 5 ? 90 + ang[opp] / 2 : 180 - ang[opp];
		if (!value.equals(q(want))) v.push(`risposta ${value} invece di ${want}`);
	}
	return v;
}

function toChoice(sample: Sample, rng: Rng): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const value = R((sample.answer as { value: string }).value);
	const unit = sample.params.unit as string;
	const wrong = ((sample.params.wrong as string[]) ?? []).map(R);
	const step = unit === 'deg' ? q(10) : value.isInteger() ? q(1) : q(1, 2);
	const fallback = (i: number) => {
		const k = Math.floor(i / 2) + 1;
		const w = value.add(step.mul(q(i % 2 ? -k : k)));
		if (w.sign() <= 0 || (unit === 'deg' && w.num >= 180)) return null;
		return numberOption(w, unit);
	};
	return buildChoice(
		rng,
		numberOption(value, unit),
		wrong.filter((w) => !w.equals(value) && w.sign() > 0 && (unit !== 'deg' || w.num < 180) && (decimals(value) === null || decimals(w) !== null)).map((w) => numberOption(w, unit)),
		fallback,
	);
}

export const geometriaPuntiNotevoli: Generator = {
	id: ID,
	title: 'Punti notevoli del triangolo',
	levels: {
		1: { label: 'Riconoscere il punto notevole', constraints: ['6 su 10 dalla descrizione al punto, 4 su 10 dal punto alla proprietà', 'quattro opzioni, una per punto notevole'] },
		2: { label: 'Baricentro e mediana', constraints: ['dato uno tra mediana, AG e GM, trovare un altro', 'GM da 1 a 12 cm, a volte con mezzo centimetro'] },
		3: { label: 'Dove cadono ortocentro e circocentro', constraints: ['due angoli dati, multipli di 5', 'un terzo acutangoli, un terzo rettangoli, un terzo ottusangoli'] },
		4: { label: 'Il triangolo rettangolo', constraints: ["data l'ipotenusa: raggio della circoscritta, mediana, distanza CG; oppure data CG, l'ipotenusa"] },
		5: { label: 'Angolo tra due bisettrici', constraints: ['angoli pari tra 20 e 130 gradi', "metà con i due angoli agli estremi, metà con l'angolo opposto"] },
		6: { label: 'Angolo tra due altezze', constraints: ['triangolo acutangolo, angoli multipli di 5 tra 35 e 85 gradi'] },
		7: { label: 'I raggi del triangolo equilatero', constraints: ['dato uno tra altezza, r, R, trovare un altro', 'r da 1 a 10 cm, a volte con mezzo centimetro'] },
	},
	generate(rng: Rng, level: number): Sample {
		for (let attempt = 0; attempt < 1000; attempt++) {
			const b = build(rng, level);
			const answer = b.answer;
			const sample: Sample = {
				generatorId: ID,
				level,
				seed: rng.seed,
				prompt: b.prompt,
				problem: b.problem,
				solution: b.solution,
				steps: b.steps,
				answer: answer.kind === 'choice' ? answer.choice : { kind: 'number', value: answer.value.toString() },
				params: { case: b.case, ...b.params },
			};
			if (answer.kind === 'number') {
				sample.params.unit = answer.unit;
				sample.params.wrong = answer.wrong.filter((w) => !w.equals(answer.value)).map((w) => w.toString());
			}
			if (check(sample).length > 0) continue;
			try {
				toChoice(sample, rng);
			} catch {
				continue;
			}
			return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default geometriaPuntiNotevoli;
