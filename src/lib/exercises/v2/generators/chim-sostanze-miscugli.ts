/**
 * Sostanze pure, miscugli omogenei ed eterogenei. Spec: specs/exercises/chim-sostanze-miscugli.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/16-chim-sostanze-miscugli.md), each one step harder:
 * which of four materials is a pure substance (or a mixture); which is a homogeneous (or heterogeneous) mixture, with a
 * pure substance among the distractors; which of four boxes of particles shows a pure substance, a homogeneous or a
 * heterogeneous mixture (scene `particelle-riquadri`); which of four samples can be pure, from how it melts; how many
 * phases, or how many components, a system has. Distractors from the lesson's warnings: clear taken for pure, uniform
 * to the eye taken for homogeneous, phases counted as components, pieces of one solid counted as many phases.
 */
import type { Generator, Rng, Sample, SceneRef } from '../types';
import { type Built, checkCommon, generateWith } from '../fisica-equilibrio';
import { choose, sample, shuffle, t, table, textBlock, textOpt } from '../chim-materia';

export const ID = 'chim-sostanze-miscugli';

type Kind = 'pura' | 'omogeneo' | 'eterogeneo';

/** Materials of the lesson and a few more, with their class and what they are made of. */
export const MATERIALS: { nome: string; kind: Kind; why: string }[] = [
	{ nome: 'acqua distillata', kind: 'pura', why: 'solo molecole di acqua' },
	{ nome: 'ossigeno', kind: 'pura', why: 'un solo tipo di particelle' },
	{ nome: 'rame', kind: 'pura', why: 'solo atomi di rame' },
	{ nome: 'ferro', kind: 'pura', why: 'solo atomi di ferro' },
	{ nome: 'alluminio', kind: 'pura', why: 'solo atomi di alluminio' },
	{ nome: 'cloruro di sodio', kind: 'pura', why: 'un solo composto' },
	{ nome: 'saccarosio', kind: 'pura', why: 'un solo composto, lo zucchero da cucina' },
	{ nome: 'anidride carbonica', kind: 'pura', why: 'un solo composto' },
	{ nome: 'elio', kind: 'pura', why: 'solo atomi di elio' },
	{ nome: 'mercurio', kind: 'pura', why: 'solo atomi di mercurio' },
	{ nome: 'etanolo puro', kind: 'pura', why: 'solo molecole di etanolo' },
	{ nome: 'acqua di mare filtrata', kind: 'omogeneo', why: 'acqua con sali disciolti' },
	{ nome: 'acqua zuccherata', kind: 'omogeneo', why: 'acqua con zucchero disciolto' },
	{ nome: 'aria filtrata', kind: 'omogeneo', why: 'azoto, ossigeno e altri gas mescolati' },
	{ nome: 'ottone', kind: 'omogeneo', why: 'una lega di rame e zinco' },
	{ nome: 'bronzo', kind: 'omogeneo', why: 'una lega di rame e stagno' },
	{ nome: 'aceto', kind: 'omogeneo', why: 'acqua con acido acetico disciolto' },
	{ nome: 'acqua minerale naturale', kind: 'omogeneo', why: 'acqua con sali disciolti' },
	{ nome: 'benzina', kind: 'omogeneo', why: 'molti idrocarburi liquidi mescolati' },
	{ nome: 'tè filtrato', kind: 'omogeneo', why: 'acqua con molte sostanze disciolte' },
	{ nome: 'acqua e olio', kind: 'eterogeneo', why: 'due strati che si vedono a occhio' },
	{ nome: 'acqua e sabbia', kind: 'eterogeneo', why: 'i granelli di sabbia si vedono a occhio' },
	{ nome: 'granito', kind: 'eterogeneo', why: 'granelli di minerali diversi visibili a occhio' },
	{ nome: 'terriccio', kind: 'eterogeneo', why: 'particelle diverse visibili a occhio' },
	{ nome: "succo d'arancia con la polpa", kind: 'eterogeneo', why: 'i pezzetti di polpa si vedono a occhio' },
	{ nome: 'fumo', kind: 'eterogeneo', why: 'particelle solide sospese in un gas' },
	{ nome: 'nebbia', kind: 'eterogeneo', why: 'goccioline di liquido sospese in un gas' },
	{ nome: 'maionese', kind: 'eterogeneo', why: 'goccioline di olio disperse, visibili al microscopio' },
	{ nome: 'panna montata', kind: 'eterogeneo', why: 'bollicine di gas in un liquido' },
	{ nome: 'latte', kind: 'eterogeneo', why: 'goccioline di grasso visibili al microscopio' },
	{ nome: 'acqua fangosa', kind: 'eterogeneo', why: 'particelle di terra sospese' },
];
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const of = (k: Kind) => MATERIALS.filter((m) => m.kind === k);
const mOpt = (m: { nome: string }) => textOpt(cap(m.nome), m.nome);
const why = (m: { nome: string; kind: Kind; why: string }) =>
	`${cap(m.nome)}: ${m.kind === 'pura' ? 'sostanza pura' : m.kind === 'omogeneo' ? 'miscuglio omogeneo' : 'miscuglio eterogeneo'}, ${m.why}.`;

// ---------------------------------------------------------------------------
// Level 1: pure substance or mixture

function level1(rng: Rng): Built {
	const askPure = rng.next() < 0.6;
	const mixtures = [...of('omogeneo'), ...of('eterogeneo')];
	const right = askPure ? rng.pick(of('pura')) : rng.pick(mixtures);
	const others = askPure ? sample(rng, mixtures, 3) : sample(rng, of('pura'), 3);
	return {
		prompt: askPure ? 'Trova la sostanza pura.' : 'Trova il miscuglio.',
		problem: textBlock(`Quale di questi materiali è ${askPure ? 'una sostanza pura' : 'un miscuglio'}?`),
		solution: t(cap(right.nome)),
		steps: [right, ...others].map((m) => textBlock(why(m))),
		answer: choose(rng, mOpt(right), others.map(mOpt)),
		params: { case: askPure ? 'pura' : 'miscuglio', right: right.nome },
	};
}

// ---------------------------------------------------------------------------
// Level 2: homogeneous or heterogeneous

function level2(rng: Rng): Built {
	const kind: Kind = rng.next() < 0.5 ? 'omogeneo' : 'eterogeneo';
	const other: Kind = kind === 'omogeneo' ? 'eterogeneo' : 'omogeneo';
	const right = rng.pick(of(kind));
	const others = [...sample(rng, of(other), 2), rng.pick(of('pura'))];
	return {
		prompt: `Trova il miscuglio ${kind}.`,
		problem: textBlock(`Quale di questi materiali è un miscuglio ${kind}?`),
		solution: t(cap(right.nome)),
		steps: [right, ...others].map((m) => textBlock(why(m))),
		answer: choose(rng, mOpt(right), others.map(mOpt)),
		params: { case: kind, right: right.nome },
	};
}

// ---------------------------------------------------------------------------
// Level 3: four boxes of particles

const SIDE = 2.2;
const R = 0.13;
type P = [number, number, number];
type Box = { kind: Kind; how: string; ps: P[] };
const r2 = (x: number) => Math.round(x * 100) / 100;

/** A gas: 9 to 12 particles spread over the box, at least 0,45 cm apart. */
function gasPoints(rng: Rng): [number, number][] {
	const n = rng.int(9, 12);
	const out: [number, number][] = [];
	for (let i = 0; out.length < n && i < 3000; i++) {
		const p: [number, number] = [r2(0.2 + rng.next() * (SIDE - 0.4)), r2(0.2 + rng.next() * (SIDE - 0.4))];
		if (out.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) >= 0.45)) out.push(p);
	}
	return out;
}
/** A liquid: particles in contact, a little disordered, in the lower part of the box, a few missing. */
function liquidPoints(rng: Rng, rows = 5): [number, number][] {
	const out: [number, number][] = [];
	for (let j = 0; j < rows; j++) {
		for (let i = 0; i < 7; i++) {
			const x = 0.18 + i * 0.3 + (j % 2 ? 0.15 : 0) + (rng.next() - 0.5) * 0.04;
			const y = 0.16 + j * 0.27 + (rng.next() - 0.5) * 0.04;
			if (x > SIDE - 0.15 || rng.next() < 0.1) continue;
			out.push([r2(x), r2(y)]);
		}
	}
	return out;
}
/** A solid: a square lattice at the bottom of the box. */
function solidPoints(): [number, number][] {
	const out: [number, number][] = [];
	for (let j = 0; j < 5; j++) for (let i = 0; i < 7; i++) out.push([r2(0.2 + i * 0.3), r2(0.16 + j * 0.3)]);
	return out;
}

/** The share of particles whose nearest neighbour is of another kind. */
function mixing(ps: P[]): number {
	let other = 0;
	for (const p of ps) {
		let best = Infinity, k = -1;
		for (const q of ps) {
			if (q === p) continue;
			const d = Math.hypot(q[0] - p[0], q[1] - p[1]);
			if (d < best) {
				best = d;
				k = q[2];
			}
		}
		if (k !== p[2]) other++;
	}
	return other / ps.length;
}

function makeBox(rng: Rng, kind: Kind): Box {
	const [k1, k2] = shuffle(rng, [0, 1, 2]);
	if (kind === 'pura') {
		const how = rng.pick(['gas', 'liquido', 'solido']);
		const pts = how === 'gas' ? gasPoints(rng) : how === 'liquido' ? liquidPoints(rng) : solidPoints();
		return { kind, how, ps: pts.map(([x, y]) => [x, y, k1]) };
	}
	if (kind === 'omogeneo') {
		const how = rng.pick(['gas', 'liquido', 'solido']);
		for (;;) {
			const pts = how === 'gas' ? gasPoints(rng) : how === 'liquido' ? liquidPoints(rng) : solidPoints();
			const share = 0.3 + rng.next() * 0.15;
			const ps: P[] = pts.map(([x, y]) => [x, y, rng.next() < share ? k2 : k1]);
			const n2 = ps.filter((p) => p[2] === k2).length;
			if (n2 >= 3 && ps.length - n2 >= 3 && mixing(ps) >= 0.55) return { kind, how, ps };
		}
	}
	for (;;) {
		const b = heterogeneous(rng, k1, k2);
		if (mixing(b.ps) <= 0.08) return b;
	}
}

function heterogeneous(rng: Rng, k1: number, k2: number): Box {
	const kind: Kind = 'eterogeneo';
	const how = rng.pick(['strati', 'granello']);
	if (how === 'strati') {
		// Two liquids that do not mix: the lower rows of one kind, the upper rows of the other.
		const pts = liquidPoints(rng, 6);
		const cut = 0.16 + rng.int(2, 3) * 0.27 - 0.13;
		return { kind, how, ps: pts.map(([x, y]) => [x, y, y < cut ? k1 : k2]) };
	}
	// A grain of a solid (a small lattice) resting on the bottom of a liquid.
	const x0 = r2(0.2 + rng.next() * 0.9);
	const grain: P[] = [];
	for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) grain.push([r2(x0 + i * 0.27), r2(0.15 + j * 0.27), k2]);
	const liquid = liquidPoints(rng).filter(([x, y]) => grain.every((g) => Math.hypot(g[0] - x, g[1] - y) >= 2 * R + 0.02));
	return { kind, how, ps: [...liquid.map(([x, y]) => [x, y, k1] as P), ...grain] };
}

const KIND_TEXT: Record<Kind, string> = { pura: 'una sostanza pura', omogeneo: 'un miscuglio omogeneo', eterogeneo: 'un miscuglio eterogeneo' };
const HOW_TEXT: Record<string, string> = { gas: 'sparse', liquido: 'a contatto sul fondo', solido: 'in file ordinate sul fondo', strati: 'a contatto sul fondo', granello: 'a contatto sul fondo' };

function level3(rng: Rng): Built {
	const kind: Kind = rng.pick(['pura', 'omogeneo', 'eterogeneo'] as Kind[]);
	const rest = (['pura', 'omogeneo', 'eterogeneo'] as Kind[]).filter((k) => k !== kind);
	const kinds = shuffle(rng, [kind, rest[0], rest[1], rng.pick(rest)]);
	const boxes = kinds.map((k) => makeBox(rng, k));
	const iRight = kinds.indexOf(kind);
	const colours = (b: Box) => new Set(b.ps.map((p) => p[2])).size;
	const alt =
		'Quattro riquadri di particelle, A, B, C e D. ' +
		boxes.map((b, i) => `${'ABCD'[i]}: particelle di ${colours(b) === 1 ? 'un solo colore' : 'due colori'}, ${HOW_TEXT[b.how]}${b.how === 'strati' ? ', un colore sotto e uno sopra' : b.how === 'granello' ? ', con un gruppetto ordinato di un altro colore' : ''}.`).join(' ');
	const scene: SceneRef = { type: 'particelle-riquadri', data: { lato: SIDE, riquadri: boxes.map((b) => b.ps) }, alt };
	const letter = (i: number) => textOpt(`Riquadro ${'ABCD'[i]}`, 'ABCD'[i]);
	const reason: Record<Kind, string> = {
		pura: 'particelle tutte di un tipo: sostanza pura',
		omogeneo: 'due tipi di particelle mescolati uniformemente: miscuglio omogeneo',
		eterogeneo: 'due tipi di particelle in zone separate: miscuglio eterogeneo',
	};
	return {
		prompt: 'Trova il riquadro.',
		problem: textBlock(`Ogni colore è un tipo di particelle. Quale riquadro mostra ${KIND_TEXT[kind]}?`),
		solution: t(`Riquadro ${'ABCD'[iRight]}`),
		steps: boxes.map((b, i) => t(`${'ABCD'[i]}: ${reason[b.kind]}.`)),
		answer: choose(rng, letter(iRight), [0, 1, 2, 3].filter((i) => i !== iRight).map(letter)),
		params: { case: kind },
		scene,
	};
}

// ---------------------------------------------------------------------------
// Level 4: how the samples melt

function level4(rng: Rng): Built {
	const askPure = rng.next() < 0.6;
	const iRight = rng.int(0, 3);
	const rows = [0, 1, 2, 3].map((i) => {
		const start = rng.int(20, 300);
		const constant = (i === iRight) === askPure;
		return { start, end: constant ? start : start + rng.int(3, 15) };
	});
	const letter = (i: number) => textOpt(`Campione ${'ABCD'[i]}`, 'ABCD'[i]);
	return {
		prompt: askPure ? 'Trova la sostanza pura.' : 'Trova il miscuglio.',
		problem: textBlock(
			`Quattro polveri bianche vengono scaldate lentamente. La tabella dice a che temperatura comincia e a che temperatura finisce la fusione di ciascuna. Quale ${askPure ? 'può essere una sostanza pura' : 'è di sicuro un miscuglio'}?`,
			46,
			[table('lcc', [t('campione'), t('inizio'), t('fine')], rows.map((r, i) => [t('ABCD'[i]), `${r.start}\\,^\\circ\\text{C}`, `${r.end}\\,^\\circ\\text{C}`]))],
		),
		solution: t(`Campione ${'ABCD'[iRight]}`),
		steps: [
			t('Una sostanza pura fonde a temperatura costante; un miscuglio fonde in un intervallo di temperature.'),
			...rows.map((r, i) => t(`${'ABCD'[i]}: ${r.start === r.end ? `fonde tutta a ${r.start} °C` : `fonde tra ${r.start} e ${r.end} °C`}.`)),
		],
		answer: choose(rng, letter(iRight), [0, 1, 2, 3].filter((i) => i !== iRight).map(letter)),
		params: { case: askPure ? 'pura' : 'miscuglio' },
	};
}

// ---------------------------------------------------------------------------
// Level 5: phases and components

/** What can be added to a glass of water: its words, whether it is a new phase, the substance it adds (if any). */
export const ADDITIONS: { text: string; phase: boolean; substance: string | null; oil?: boolean }[] = [
	{ text: 'due cubetti di ghiaccio', phase: true, substance: null },
	{ text: "uno strato d'olio", phase: true, substance: 'olio', oil: true },
	{ text: 'un cucchiaino di sale, che si scioglie tutto', phase: false, substance: 'cloruro di sodio' },
	{ text: 'un cucchiaino di zucchero, che si scioglie tutto', phase: false, substance: 'saccarosio' },
	{ text: "un po' di alcol, che si mescola con l'acqua", phase: false, substance: 'etanolo' },
	{ text: "un po' di limatura di ferro sul fondo", phase: true, substance: 'ferro' },
	{ text: 'tre monetine di rame', phase: true, substance: 'rame' },
	{ text: 'qualche goccia di mercurio sul fondo', phase: true, substance: 'mercurio' },
];

function level5(rng: Rng): Built {
	const askPhases = rng.next() < 0.6;
	const pool = askPhases ? ADDITIONS : ADDITIONS.filter((a) => !a.oil);
	const adds = sample(rng, pool, rng.int(2, 4));
	const phases = 1 + adds.filter((a) => a.phase).length;
	const components = 1 + adds.filter((a) => a.substance).length;
	const items = 1 + adds.length;
	const right = askPhases ? phases : components;
	const word = (n: number) => (askPhases ? (n === 1 ? '1 fase' : `${n} fasi`) : n === 1 ? '1 componente' : `${n} componenti`);
	const opt = (n: number) => (n >= 1 ? textOpt(word(n), String(n)) : null);
	const list = adds.map((a) => a.text);
	const listText = list.length === 1 ? list[0] : `${list.slice(0, -1).join(', ')} e ${list[list.length - 1]}`;
	return {
		prompt: askPhases ? 'Conta le fasi.' : 'Conta i componenti.',
		problem: textBlock(`In un bicchiere d'acqua si mettono ${listText}. ${askPhases ? 'Quante fasi ha il sistema?' : 'Quante sostanze diverse, cioè quanti componenti, contiene?'}`),
		solution: t(word(right)),
		steps: [
			t(askPhases ? "Ogni parte separata da una superficie netta è una fase; quello che è sciolto sta nella fase dell'acqua." : 'Si contano le sostanze diverse; il ghiaccio è acqua, non un componente in più.'),
			t(`L'acqua, ${askPhases ? 'con quello che vi è sciolto, è una fase' : 'la prima sostanza'}.`),
			...adds.map((a) => t(`${cap(a.text.split(',')[0])}: ${askPhases ? (a.phase ? 'una fase in più' : 'nessuna fase in più') : a.substance ? `un componente in più, ${a.substance}` : 'nessun componente in più'}.`)),
		],
		// phases counted as components (and back); the things listed counted; one more, one fewer
		answer: choose(rng, opt(right)!, [opt(askPhases ? components : phases), opt(items), opt(right + 1), opt(right - 1), opt(right + 2)]),
		params: { case: askPhases ? 'fasi' : 'componenti', adds: adds.map((a) => a.text) },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = checkCommon(sample).filter((x) => x !== 'due opzioni con lo stesso numero');
	if (sample.answer.kind === 'choice' && new Set(sample.answer.options.map((o) => o.values.join('|'))).size !== 4) v.push('due opzioni con lo stesso valore');
	return v;
}

export const chimSostanzeMiscugli: Generator = {
	id: ID,
	title: 'Sostanze pure, miscugli omogenei ed eterogenei',
	levels: {
		1: { label: 'Sostanza pura o miscuglio', constraints: ['quattro materiali, uno solo della classe chiesta'] },
		2: { label: 'Omogeneo o eterogeneo', constraints: ['una sostanza pura tra i distrattori'] },
		3: { label: 'Le particelle', constraints: ['quattro riquadri disegnati, uno solo del tipo chiesto'] },
		4: { label: 'La prova della fusione', constraints: ['quattro campioni, fusione a temperatura costante o in un intervallo'] },
		5: { label: 'Fasi e componenti', constraints: ["un bicchiere d'acqua e da due a quattro aggiunte"] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimSostanzeMiscugli;
