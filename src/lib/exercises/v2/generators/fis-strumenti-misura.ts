/**
 * Gli strumenti di misura. Spec: specs/exercises/fis-strumenti-misura.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/04-fis-strumenti-misura.md), all multiple choice: the
 * sensitivity of a digital display or of a scale, and the range; how to write a measure with its uncertainty and
 * which instrument fits a measurement; reading a ruler or a graduated cylinder drawn in a scene; reading a caliper
 * with a decimal vernier; reading it with a twentieths vernier. The scenes (`righello`, `cilindro-graduato`,
 * `calibro`, src/components/content/exercises/scenes/) draw the data the student reads, never the answer.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { q } from '../rational';
import { BANNED, choose, dec, decimals, pw, unitTex, withUnit, type R } from '../fis-grandezze';

export const ID = 'fis-strumenti-misura';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
	scene?: SceneRef;
}

/** A measure with its uncertainty, both with `digits` decimals: (12{,}3 \pm 0{,}1)\,\text{cm}. */
const pm = (x: R, s: R, u: string, digits = Math.max(decimals(x), decimals(s))) => `(${dec(x, digits)} \\pm ${dec(s, digits)})\\,${unitTex(u)}`;
const pmOpt = (x: R, s: R, u: string, digits?: number): ChoiceOption => ({ latex: pm(x, s, u, digits), values: [`${x.toString()}|${s.toString()}`] });

// ---------------------------------------------------------------------------
// Level 1: sensitivity and range

const DISPLAYS: { what: string; unit: string; lo: number; hi: number }[] = [
	{ what: 'Una bilancia elettronica', unit: 'g', lo: 5, hi: 900 },
	{ what: 'Un cronometro digitale', unit: 's', lo: 2, hi: 90 },
	{ what: 'Un termometro digitale', unit: '°C', lo: 15, hi: 40 },
];
const SCALES: { what: string; unit: string; steps: number[]; lo: number }[] = [
	{ what: 'In un cilindro graduato', unit: 'mL', steps: [1, 2, 5], lo: 0 },
	{ what: 'Sulla scala di un termometro', unit: '°C', steps: [1, 2], lo: 0 },
	{ what: 'Sulla scala di una bilancia pesapersone', unit: 'kg', steps: [1, 2], lo: 40 },
];
const deg = (x: string, u: string) => (u === '°C' ? `$${x}\\,^\\circ\\text{C}$` : pw(x, u));
const degTex = (x: string, u: string) => (u === '°C' ? `${x}\\,^\\circ\\text{C}` : withUnit(x, u));

function level1(rng: Rng): Built {
	const kind = rng.pick(['display', 'scala', 'portata'] as const);
	if (kind === 'display') {
		const D = rng.pick(DISPLAYS);
		const k = D.unit === 's' ? 2 : D.unit === '°C' ? 1 : rng.int(1, 2);
		let x: R;
		do x = q(rng.int(D.lo * 10 ** k, D.hi * 10 ** k), 10 ** k);
		while (decimals(x) < k);
		const s = q(1, 10 ** k);
		const last = q(x.num % 10, 10 ** k);
		const o = (r: R) => ({ latex: degTex(dec(r), D.unit), values: [r.toString()] });
		const cands = [q(1), q(1, 10 ** (k + 1)), q(1, 10 ** (k - 1)), last, q(10)].filter((r) => !r.equals(s));
		return {
			prompt: 'Trova la sensibilità.',
			problem: textBlock(`${D.what} mostra ${deg(dec(x), D.unit)}. Qual è la sua sensibilità?`),
			solution: degTex(dec(s), D.unit),
			steps: [textBlock(`In uno strumento digitale la sensibilità è un'unità dell'ultima cifra: l'ultima cifra di ${deg(dec(x), D.unit)} è quella dei ${k === 1 ? 'decimi' : 'centesimi'}, quindi ${deg(dec(s), D.unit)}.`)],
			choice: choose(rng, o(s), cands.map(o)),
			params: { case: kind, unit: D.unit },
		};
	}
	const S = rng.pick(SCALES);
	const step = rng.pick(S.steps);
	const n = rng.pick([5, 10]);
	const gap = step * n; // between two numbered ticks
	if (kind === 'scala') {
		const a = S.lo + gap * rng.int(1, 6);
		const b = a + gap;
		const o = (r: R) => ({ latex: degTex(dec(r), S.unit), values: [r.toString()] });
		// one tick counted as one unit; the number of intervals; the gap between the numbers; the ticks counted instead of the intervals; twice and half
		const wrong = [q(1), q(n), q(gap), q(gap, n + 1), q(2 * step), q(step, 2)].filter((r) => !r.equals(q(step)) && decimals(r) <= 2);
		return {
			prompt: 'Trova la sensibilità.',
			problem: textBlock(`${S.what} tra la tacca numerata ${deg(String(a), S.unit)} e quella numerata ${deg(String(b), S.unit)} ci sono $${n}$ intervalli. Qual è la sensibilità dello strumento?`),
			solution: degTex(String(step), S.unit),
			steps: [`\\dfrac{${degTex(String(b), S.unit)} - ${degTex(String(a), S.unit)}}{${n}} = \\dfrac{${degTex(String(gap), S.unit)}}{${n}} = ${degTex(String(step), S.unit)}`],
			choice: choose(rng, o(q(step)), wrong.map(o)),
			params: { case: kind, unit: S.unit },
		};
	}
	// range and sensitivity of a graduated cylinder
	// realistic cylinders: range, numbers every `lab` mL, `ints` intervals between two numbers
	const [P, lab, ints] = rng.pick([
		[10, 1, 5],
		[25, 5, 10],
		[50, 10, 10],
		[100, 10, 10],
		[100, 10, 5],
		[250, 50, 25],
		[250, 10, 5],
		[500, 50, 10],
		[1000, 100, 10],
	] as const);
	const sens = q(lab, ints);
	const both = (p: number, s: R): ChoiceOption => ({ latex: `\\begin{gathered} \\text{portata } ${withUnit(String(p), 'mL')} \\\\ \\text{sensibilità } ${withUnit(dec(s), 'mL')} \\end{gathered}`, values: [`${p}|${s.toString()}`] });
	const wrong: ChoiceOption[] = [both(P, q(lab)), both(P, q(1)), both(lab, sens), both(P - lab, sens), both(P, q(ints)), both(P, sens.mul(q(2)))];
	return {
		prompt: 'Trova portata e sensibilità.',
		problem: textBlock(`Un cilindro graduato ha la tacca più alta con il numero ${pw(String(P), 'mL')}; le tacche sono numerate ogni ${pw(String(lab), 'mL')} e tra due numeri vicini ci sono $${ints}$ intervalli. Quanto valgono la portata e la sensibilità?`),
		solution: both(P, sens).latex,
		steps: [textBlock(`La portata è il valore più alto della scala, ${pw(String(P), 'mL')}.`), `\\text{sensibilità } = \\dfrac{${withUnit(String(lab), 'mL')}}{${ints}} = ${withUnit(dec(sens), 'mL')}`],
		choice: choose(rng, both(P, sens), wrong),
		params: { case: kind },
	};
}

// ---------------------------------------------------------------------------
// Level 2: writing a measure; the right instrument

const READERS: { what: string; unit: string; sens: R }[] = [
	{ what: 'un righello', unit: 'cm', sens: q(1, 10) },
	{ what: 'un calibro con il nonio decimale', unit: 'mm', sens: q(1, 10) },
	{ what: 'un calibro con il nonio ventesimale', unit: 'mm', sens: q(1, 20) },
	{ what: 'un micrometro', unit: 'mm', sens: q(1, 100) },
	{ what: 'una bilancia elettronica', unit: 'g', sens: q(1, 10) },
	{ what: 'un cilindro graduato', unit: 'mL', sens: q(2) },
];

export const INSTRUMENTS: { name: string; range: [number, string]; sens: [R, string] }[] = [
	{ name: 'righello', range: [30, 'cm'], sens: [q(1), 'mm'] },
	{ name: 'metro a nastro', range: [5, 'm'], sens: [q(1), 'mm'] },
	{ name: 'rotella metrica', range: [20, 'm'], sens: [q(1), 'cm'] },
	{ name: 'calibro ventesimale', range: [15, 'cm'], sens: [q(1, 20), 'mm'] },
	{ name: 'micrometro', range: [25, 'mm'], sens: [q(1, 100), 'mm'] },
];
const MM: Record<string, number> = { mm: 1, cm: 10, m: 1000 };
/** What must be measured, how long it is about (mm) and to what precision (mm), and the instrument meant. */
function tasks(rng: Rng): { text: string; size: number; prec: R; target: string }[] {
	const wire = rng.pick([q(5, 10), q(8, 10), q(12, 10), q(15, 10)]);
	const coin = rng.int(18, 28);
	const tube = rng.int(12, 60);
	const pencil = rng.int(12, 19);
	const book = rng.int(20, 29);
	const desk = rng.pick([q(12, 10), q(15, 10), q(18, 10), q(24, 10)]);
	const room = rng.int(6, 12);
	const field = rng.pick([9, 18, 12, 15]);
	return [
		{ text: `il diametro di un filo di rame, circa ${pw(dec(wire), 'mm')}, al centesimo di millimetro`, size: Number(wire.num) / wire.den, prec: q(1, 100), target: 'micrometro' },
		{ text: `il diametro di una moneta, circa ${pw(String(coin), 'mm')}, al ventesimo di millimetro`, size: coin, prec: q(1, 20), target: 'calibro ventesimale' },
		{ text: `il diametro di un tubo, circa ${pw(String(tube), 'mm')}, al decimo di millimetro`, size: tube, prec: q(1, 10), target: 'calibro ventesimale' },
		{ text: `la lunghezza di una matita, circa ${pw(String(pencil), 'cm')}, al millimetro`, size: pencil * 10, prec: q(1), target: 'righello' },
		{ text: `il lato di un libro, circa ${pw(String(book), 'cm')}, al millimetro`, size: book * 10, prec: q(1), target: 'righello' },
		{ text: `la lunghezza di un banco, circa ${pw(dec(desk), 'm')}, al millimetro`, size: (Number(desk.num) / desk.den) * 1000, prec: q(1), target: 'metro a nastro' },
		{ text: `la lunghezza di un'aula, circa ${pw(String(room), 'm')}, al centimetro`, size: room * 1000, prec: q(10), target: 'rotella metrica' },
		{ text: `il lato di un campo da gioco, circa ${pw(String(field), 'm')}, al centimetro`, size: field * 1000, prec: q(10), target: 'rotella metrica' },
	];
}
const fitsTask = (I: (typeof INSTRUMENTS)[number], size: number, prec: R) => I.range[0] * MM[I.range[1]] >= size && I.sens[0].mul(q(MM[I.sens[1]])).compare(prec) <= 0;

function level2(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const R0 = rng.pick(READERS);
		const k = decimals(R0.sens);
		// a reading on the instrument's own grid, with no trailing zero beyond the sensitivity's decimals
		let x: R;
		do {
			const units = rng.int(R0.unit === 'mL' ? 5 : 10, R0.unit === 'mL' ? 125 : R0.unit === 'g' ? 5000 : 900);
			x = R0.sens.mul(q(units));
		} while (x.compare(q(1)) < 0);
		const right = pmOpt(x, R0.sens, R0.unit, k);
		const others: ChoiceOption[] = [
			{ latex: pm(x, q(1), R0.unit, k), values: [`${x}|1`] },
			...(k > 0 ? [{ latex: `(${dec(x.sub(q(x.num % x.den, x.den)))} \\pm ${dec(R0.sens, k)})\\,${unitTex(R0.unit)}`, values: [`${x.sub(q(x.num % x.den, x.den))}|${R0.sens}`] }] : []),
			{ latex: pm(x, R0.sens.div(q(10)), R0.unit, k + 1), values: [`${x}|${R0.sens.div(q(10))}`] },
			{ latex: pm(x, R0.sens.mul(q(10)), R0.unit), values: [`${x}|${R0.sens.mul(q(10))}`] },
		].filter((o) => o.latex !== right.latex && !(o.values[0] === `${x}|1` && R0.sens.equals(q(1))));
		return {
			prompt: 'Scrivi la misura.',
			problem: textBlock(`Con ${R0.what} leggi ${pw(dec(x, k), R0.unit)}. Come si scrive la misura con la sua incertezza?`),
			solution: right.latex,
			steps: [textBlock(`L'incertezza di una lettura singola è la sensibilità dello strumento, ${pw(dec(R0.sens), R0.unit)}, e si scrive con gli stessi decimali della misura.`)],
			choice: choose(rng, right, shuffle(rng, others)),
			params: { case: 'scrittura', unit: R0.unit },
		};
	}
	for (;;) {
		const T = rng.pick(tasks(rng));
		const target = INSTRUMENTS.find((I) => I.name === T.target)!;
		if (!fitsTask(target, T.size, T.prec)) throw new Error(`${ID}: task does not fit its instrument`);
		const others = shuffle(
			rng,
			INSTRUMENTS.filter((I) => I !== target && !fitsTask(I, T.size, T.prec)),
		);
		if (others.length < 3) continue;
		const o = (I: (typeof INSTRUMENTS)[number]): ChoiceOption => ({
			latex: `\\begin{gathered} \\text{${I.name}} \\\\ ${withUnit(String(I.range[0]), I.range[1])},\\ ${withUnit(dec(I.sens[0]), I.sens[1])} \\end{gathered}`,
			values: [I.name],
		});
		return {
			prompt: 'Scegli lo strumento.',
			problem: textBlock(`Devi misurare ${T.text}. Quale strumento usi? Accanto a ogni strumento ci sono la sua portata e la sua sensibilità.`),
			solution: o(target).latex,
			steps: [textBlock(`Serve una portata più grande della misura e una sensibilità non più grande della precisione chiesta: solo il ${target.name} ha tutte e due.`)],
			choice: choose(rng, o(target), others.map(o)),
			params: { case: 'strumento', target: target.name },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: a ruler or a graduated cylinder

function level3(rng: Rng): Built {
	const kind = rng.pick(['righello', 'righello-spostato', 'cilindro'] as const);
	if (kind !== 'cilindro') {
		const start = kind === 'righello' ? 0 : 10 * rng.int(1, 3);
		const len = rng.int(15, 42);
		const end = start + len;
		const L = q(len, 10);
		const s = kind === 'righello' ? q(1, 10) : q(2, 10);
		const others: ChoiceOption[] = [
			...(kind === 'righello-spostato' ? [pmOpt(q(end, 10), s, 'cm', 1), pmOpt(L, q(1, 10), 'cm', 1)] : []),
			pmOpt(q(len + 1, 10), s, 'cm', 1),
			pmOpt(q(len - 1, 10), s, 'cm', 1),
			pmOpt(q(len + 10, 10), s, 'cm', 1),
			pmOpt(q(len, 100), s.div(q(10)), 'cm', 2),
		];
		const at = (mm: number) => `${dec(q(mm, 10), 1)}\\,\\text{cm}`;
		return {
			prompt: 'Leggi il righello.',
			problem: textBlock(`Un oggetto è appoggiato su un righello graduato in millimetri, come nella figura. Quanto è lungo?`),
			solution: pm(L, s, 'cm', 1),
			steps:
				kind === 'righello'
					? [textBlock(`L'oggetto parte dallo zero e finisce sulla tacca dei $${at(end)}$: la sensibilità del righello è $1\\,\\text{mm}$, cioè $0{,}1\\,\\text{cm}$.`)]
					: [
							`${at(end)} - ${at(start)} = ${at(len)}`,
							textBlock('Le letture sono due, ognuna con incertezza $0{,}1\\,\\text{cm}$: in una differenza le incertezze si sommano.'),
						],
			choice: choose(rng, pmOpt(L, s, 'cm', 1), others),
			params: { case: kind },
			scene: {
				type: 'righello',
				data: { inizio: start, fine: end },
				alt: `Un righello graduato in millimetri, con i centimetri numerati; sopra c'è un oggetto che va dalla tacca ${start ? `dei ${start / 10} centimetri` : 'dello zero'} a quella dei ${String(end / 10).replace('.', ',')} centimetri.`,
			},
		};
	}
	const div = rng.pick([1, 2, 5]);
	const every = div === 5 ? 50 : 10;
	const lo = every * rng.int(1, 5);
	const span = 20 * div;
	const hi = lo + span;
	const level = lo + div * rng.int(3, 17);
	const V = q(level);
	// the reading taken as if each tick were 1 mL: the numbered tick below plus the ticks counted
	const below = Math.floor(level / every) * every;
	const ticksUp = (level - below) / div;
	const others: ChoiceOption[] = [
		pmOpt(q(level + div), q(div), 'mL'),
		pmOpt(q(level - div), q(div), 'mL'),
		...(div !== 1 ? [pmOpt(q(below + ticksUp), q(div), 'mL'), pmOpt(V, q(1), 'mL')] : []),
		pmOpt(q(level + 2 * div), q(div), 'mL'),
	].filter((o) => !o.values[0].startsWith(`${level}|${div}`));
	return {
		prompt: 'Leggi il cilindro graduato.',
		problem: textBlock('Nella figura c\'è un tratto di un cilindro graduato pieno d\'acqua. Quanto vale il volume dell\'acqua?'),
		solution: pm(V, q(div), 'mL'),
		steps: [
			textBlock(`Tra due tacche numerate, a ${pw(String(every), 'mL')} di distanza, ci sono $${every / div}$ intervalli: la sensibilità è ${pw(String(div), 'mL')}.`),
			textBlock(`Il fondo del menisco è sulla tacca dei ${pw(String(level), 'mL')}.`),
		],
		choice: choose(rng, pmOpt(V, q(div), 'mL'), others),
		params: { case: kind, div },
		scene: {
			type: 'cilindro-graduato',
			data: { livello: level, divisione: div, ogni: every, da: lo, a: hi },
			alt: `Un tratto di cilindro graduato da ${lo} a ${hi} millilitri, con una tacca ogni ${div} millilitri e i numeri ogni ${every} millilitri; il fondo del menisco dell'acqua è su una tacca, ${(level - below) / div} tacche sopra il numero ${below}.`,
		},
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: the caliper

function caliper(rng: Rng, n: 10 | 20): Built {
	const I = rng.int(3, 60);
	const k = rng.int(1, n - 1);
	const reading = q(I * n + k, n);
	const s = q(1, n);
	const digits = n === 10 ? 1 : 2;
	const o = (r: R) => pmOpt(r, s, 'mm', digits);
	const cands = [
		q(I + k), // the main-scale tick where the division meets
		q(I + 1).add(q(k, n)), // the next millimetre
		q(I).add(q(n - k, n)), // counted from the other end
		...(n === 20 ? [q(I).add(q(k, 10))] : [q(I).add(q(k, 100))]), // the wrong sensitivity
		q(I - 1).add(q(k, n)),
	].filter((r) => r.sign() > 0 && decimals(r) <= digits);
	const name = n === 10 ? 'decimale' : 'ventesimale';
	const sTex = n === 10 ? '0{,}1' : '0{,}05';
	return {
		prompt: 'Leggi il calibro.',
		problem: textBlock(`Nella figura ci sono la scala principale di un calibro, in millimetri con i centimetri numerati, e il nonio ${name}; la tacca del nonio che coincide con una tacca della scala principale è segnata con un triangolino. Quanto vale la misura?`),
		solution: pm(reading, s, 'mm', digits),
		steps: [
			textBlock(`Lo zero del nonio cade tra $${I}$ e $${I + 1}\\,\\text{mm}$: i millimetri interi sono $${I}$.`),
			textBlock(`Coincide la divisione $${k}$ del nonio, e la sensibilità del nonio ${name} è $${sTex}\\,\\text{mm}$:`),
			`${I}\\,\\text{mm} + ${k} \\cdot ${sTex}\\,\\text{mm} = ${withUnit(dec(reading), 'mm')}`,
		],
		choice: choose(rng, o(reading), cands.map(o)),
		params: { case: name, k },
		scene: {
			type: 'calibro',
			data: { lettura: Number(reading.num) / reading.den, nonio: n },
			alt: `La scala principale di un calibro e il nonio ${name}: lo zero del nonio è tra ${I} e ${I + 1} millimetri e la divisione ${k} del nonio, segnata, coincide con una tacca della scala principale.`,
		},
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: (rng) => caliper(rng, 10), 5: (rng) => caliper(rng, 20) };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		let b: Built;
		try {
			b = make(rng);
		} catch (e) {
			if (/only \d distinct options/.test(String(e))) continue;
			throw e;
		}
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.choice, params: b.params, ...(b.scene ? { scene: b.scene } : {}) };
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	if (sample.answer.kind !== 'choice') return ['la risposta deve essere una scelta'];
	const ch = sample.answer;
	if (ch.options.length !== 4) v.push('servono quattro opzioni');
	if (new Set(ch.options.map((o) => o.values.join('|'))).size !== ch.options.length) v.push('opzioni ripetute');
	if (new Set(ch.options.map((o) => o.latex)).size !== ch.options.length) v.push('opzioni scritte uguali');
	if (sample.level >= 3 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisStrumentiMisura: Generator = {
	id: ID,
	title: 'Gli strumenti di misura',
	levels: {
		1: { label: 'Portata e sensibilità', constraints: ['sensibilità di un display o di una scala, portata e sensibilità di un cilindro graduato'] },
		2: { label: 'Scrivere e scegliere', constraints: ["una lettura scritta con l'incertezza (metà), lo strumento adatto a una misura (metà)"] },
		3: { label: 'Righello e cilindro', constraints: ['righello dallo zero, righello spostato, cilindro graduato con sensibilità 1, 2 o 5 mL, con la scena'] },
		4: { label: 'Calibro decimale', constraints: ['lettura da 3 a 61 mm, divisione del nonio da 1 a 9, con la scena'] },
		5: { label: 'Calibro ventesimale', constraints: ['lettura da 3 a 61 mm, divisione del nonio da 1 a 19, con la scena'] },
	},
	generate,
	check,
};

export default fisStrumentiMisura;
