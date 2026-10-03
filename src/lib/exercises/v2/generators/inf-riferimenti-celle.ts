/**
 * Riferimenti relativi e assoluti. Spec: specs/exercises/inf-riferimenti-celle.md
 *
 * Six levels in the order of the lesson (docs/lezioni/informatica/riscritte/24-inf-riferimenti-celle.md): a formula
 * copied down its column; copied to another column; with an absolute reference; with mixed references; the value a
 * copied formula shows; which formula to write so that the copy works. The formula after a copy comes from
 * copyFormula() of inf-foglio.ts; the distractors are the same copy done with a wrong rule.
 */
import type { ChoiceAnswer, Generator, Rng, Sample } from '../types';
import { Rational, q } from '../rational';
import {
	type Ref,
	type Sheet,
	type ShiftRule,
	BANNED,
	COPY,
	addr,
	choiceViolations,
	choose,
	code,
	codeOpt,
	colName,
	copyFormula,
	decimalsOf,
	isTerminating,
	numTex,
	numberChoice,
	numberOf,
	parseFormula,
	parseNum,
	problemTex,
	refStr,
	refsOf,
	shuffle,
	step,
	tableTex,
} from '../inf-foglio';

export const ID = 'inf-riferimenti-celle';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	value?: Rational;
	choice?: ChoiceAnswer;
	mistakes?: (Rational | null)[];
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Wrong ways of copying, for the distractors

const dollars = (r: Ref): number => Number(r.absCol) + Number(r.absRow);
/** Everything moves, the dollars too. */
const ALL: ShiftRule = (r, dc, dr) => ({ ...r, col: r.col + dc, row: r.row + dr });
/** A reference with one dollar is read with the dollar on the other part. */
const SWAPPED: ShiftRule = (r, dc, dr) => (dollars(r) === 1 ? { ...r, col: r.absRow ? r.col : r.col + dc, row: r.absCol ? r.row : r.row + dr } : COPY(r, dc, dr));
/** A reference with any dollar does not move at all. */
const ANY_DOLLAR_FIXED: ShiftRule = (r, dc, dr) => (dollars(r) ? r : COPY(r, dc, dr));
/** The fixed parts move and the relative ones stay. */
const INVERSE: ShiftRule = (r, dc, dr) => ({ ...r, col: r.absCol ? r.col + dc : r.col, row: r.absRow ? r.row + dr : r.row });

const plural = (n: number, one: string, many: string) => `$${n}$ ${n === 1 ? one : many}`;

function moveText(dc: number, dr: number): string {
	const parts: string[] = [];
	if (dc) parts.push(`${plural(Math.abs(dc), 'colonna', 'colonne')} a ${dc > 0 ? 'destra' : 'sinistra'}`);
	if (dr) parts.push(`${plural(Math.abs(dr), 'riga', 'righe')} in ${dr > 0 ? 'basso' : 'alto'}`);
	return parts.join(' e di ');
}

function refText(r: Ref, dc: number, dr: number): string {
	const after = COPY(r, dc, dr);
	const a = code(refStr(r));
	const b = code(refStr(after));
	if (dollars(r) === 2) return `${a} è assoluto e resta ${b}`;
	if (dollars(r) === 0) return `${a} è relativo e diventa ${b}`;
	if (r.absCol) return `in ${a} è bloccata solo la colonna: ${dr ? 'diventa' : 'resta'} ${b}`;
	return `in ${a} è bloccata solo la riga: ${dc ? 'diventa' : 'resta'} ${b}`;
}

// ---------------------------------------------------------------------------
// Levels 1-4: the formula after a copy

const SHAPES = ['a+b', 'a-b', 'a*b', 'a/b', 'a*b+c', 'a+b+c', '(a+b)*c', 'a-b*c', 'a*2', 'a/b*100', '(a+b)/2', 'a*b-c'];

type Kind = 'rel' | 'abs' | 'col' | 'row';
const styled = (col: number, row: number, k: Kind): Ref => ({ col, row, absCol: k === 'abs' || k === 'col', absRow: k === 'abs' || k === 'row' });

function copyLevel(rng: Rng, level: 1 | 2 | 3 | 4): Built {
	for (;;) {
		const sc = rng.int(2, 5);
		const sr = rng.int(2, 6);
		const shape = rng.pick(SHAPES);
		const n = (shape.match(/[abc]/g) ?? []).length;
		// where the references point: often the cells on the left in the same row, as in a real table
		const sameRow = rng.next() < (level === 1 ? 0.7 : 0.4);
		const cells: [number, number][] = [];
		while (cells.length < n) {
			const c: [number, number] = sameRow ? [rng.int(0, sc - 1), sr] : [rng.int(0, 5), rng.int(1, 8)];
			if ((c[0] === sc && c[1] === sr) || cells.some((x) => x[0] === c[0] && x[1] === c[1])) {
				if (sameRow && sc < n) break;
				continue;
			}
			cells.push(c);
		}
		if (cells.length < n) continue;
		let kinds: Kind[];
		if (level <= 2) kinds = cells.map(() => 'rel');
		else if (level === 3) {
			kinds = cells.map(() => 'rel' as Kind);
			if (n < 2) continue;
			kinds[rng.int(0, n - 1)] = 'abs';
			// the absolute cell is usually away from the table
			const i = kinds.indexOf('abs');
			cells[i] = [rng.int(0, 7), rng.int(1, 8)];
			if (cells.some((x, j) => j !== i && x[0] === cells[i][0] && x[1] === cells[i][1]) || (cells[i][0] === sc && cells[i][1] === sr)) continue;
		} else {
			kinds = cells.map(() => rng.pick(['rel', 'col', 'row', 'abs', 'col', 'row'] as Kind[]));
			if (!kinds.some((k) => k === 'col' || k === 'row')) continue;
		}
		const refs = cells.map(([c, r], i) => styled(c, r, kinds[i]));
		const formula = `=${shape.replace(/[abc]/g, (ch) => refStr(refs['abc'.indexOf(ch)]))}`;
		let dc = 0;
		let dr = 0;
		if (level === 1) dr = rng.next() < 0.85 ? rng.int(1, 5) : -rng.int(1, 2);
		else if (level === 2) {
			dc = rng.pick([1, 2, 3, 1, 2, -1, -2]);
			dr = rng.next() < 0.5 ? 0 : rng.pick([1, 2, 3, -1]);
		} else if (level === 3) {
			const how = rng.int(0, 2);
			dr = how === 1 ? 0 : rng.pick([1, 2, 3, 4, -1]);
			dc = how === 0 ? 0 : rng.pick([1, 2, 3, -1]);
		} else {
			dc = rng.pick([1, 2, 3, -1]);
			dr = rng.pick([1, 2, 3, 4, -1]);
		}
		const tc = sc + dc;
		const tr = sr + dr;
		if (tc < 0 || tr < 1 || tc > 8) continue;
		const right = copyFormula(formula, dc, dr);
		if (!right || right === formula) continue;
		const source = addr(sc, sr);
		const target = addr(tc, tr);
		// the copy must not point at the cell it lands in
		if (refsOf(parseFormula(right)).some((r) => r.col === tc && r.row === tr)) continue;
		const cp = (rule: ShiftRule, c = dc, r = dr) => copyFormula(formula, c, r, rule);
		const firstOnly = (() => {
			const moved = COPY(refs[0], dc, dr);
			return n > 1 && moved.col >= 0 && moved.row >= 1 ? formula.replace(refStr(refs[0]), refStr(moved)) : null;
		})();
		let wrong: (string | null)[];
		if (level === 1) wrong = [formula, cp(COPY, dr, 0), firstOnly, cp(COPY, 0, dr + 1), cp(COPY, 0, dr - 1 || dr + 2)];
		else if (level === 2) wrong = [dr ? cp(COPY, 0, dr) : cp(COPY, 0, dc), dr ? cp(COPY, dc, 0) : cp(COPY, dc, dc), formula, dr !== dc ? cp(COPY, dr, dc) : null, cp(COPY, dc + 1, dr), firstOnly];
		else if (level === 3) wrong = [cp(ALL), formula, cp(INVERSE), right.replace(/\$/g, ''), cp(ALL)?.replace(/\$/g, '') ?? null, firstOnly];
		else wrong = [cp(SWAPPED), cp(ANY_DOLLAR_FIXED), cp(ALL), formula, right.replace(/\$/g, ''), cp(INVERSE)];
		let choice: ChoiceAnswer;
		try {
			choice = choose(rng, codeOpt(right), shuffleKeepFirst(rng, wrong, 2).map((w) => (w && w !== right ? codeOpt(w) : null)));
		} catch {
			continue;
		}
		const drag = (dc === 0 || dr === 0) && rng.next() < 0.4;
		const how = drag ? `La trascini fino alla cella ${code(target)}.` : `La copi e la incolli nella cella ${code(target)}.`;
		const uniq = refs.filter((r, i) => refs.findIndex((x) => refStr(x) === refStr(r)) === i);
		return {
			prompt: 'Trova la formula dopo la copia.',
			problem: problemTex([`La cella ${code(source)} contiene la formula ${code(formula)}. ${how} Che formula compare in ${code(target)}?`]),
			solution: codeOpt(right).latex,
			steps: [
				step(`Da ${code(source)} a ${code(target)} la formula si sposta di ${moveText(dc, dr)}.`),
				step(level <= 2 ? `I riferimenti sono tutti relativi e si spostano allo stesso modo: ${uniq.map((r) => `${code(refStr(r))} diventa ${code(refStr(COPY(r, dc, dr)))}`).join(', ')}.` : `Si sposta solo quello che non ha il dollaro davanti: ${uniq.map((r) => refText(r, dc, dr)).join('; ')}.`),
				step(`In ${code(target)} compare ${code(right)}.`),
			],
			choice,
			params: { source, formula, target },
		};
	}
}

/** The first `keep` distractors stay in front (the typical mistakes), the others are shuffled. */
function shuffleKeepFirst<T>(rng: Rng, xs: T[], keep: number): T[] {
	return [...xs.slice(0, keep), ...shuffle(rng, xs.slice(keep))];
}

// ---------------------------------------------------------------------------
// Level 5: the value a copied formula shows

interface Story {
	data: string;
	fixed: string;
	op: '*' | '/';
	factors: string[];
}

const STORIES: Story[] = [
	{ data: 'i prezzi in euro di alcuni oggetti', fixed: 'il cambio da euro a dollari', op: '*', factors: ['1,1', '1,2', '1,05'] },
	{ data: 'i prezzi senza IVA di alcuni oggetti', fixed: "il numero per cui moltiplicare per aggiungere l'IVA", op: '*', factors: ['1,22', '1,1', '1,04'] },
	{ data: 'alcune distanze in miglia', fixed: 'quanti chilometri è lungo un miglio', op: '*', factors: ['1,6'] },
	{ data: 'alcune masse in chilogrammi', fixed: 'il peso in newton di un chilogrammo', op: '*', factors: ['9,8', '10'] },
	{ data: 'alcune durate in minuti', fixed: 'il numero di secondi di un minuto', op: '*', factors: ['60'] },
	{ data: 'i pezzi venduti in alcuni giorni', fixed: 'il prezzo in euro di un pezzo', op: '*', factors: ['2,5', '4', '1,5', '12'] },
	{ data: 'i punti presi da alcuni studenti', fixed: 'il punteggio massimo della verifica', op: '/', factors: ['20', '40', '50'] },
	{ data: 'alcune somme in dollari', fixed: 'il cambio, cioè quanti dollari vale un euro', op: '/', factors: ['1,25'] },
];

function level5(rng: Rng): Built {
	for (;;) {
		const st = rng.pick(STORIES);
		const n = rng.int(3, 5);
		const fc = rng.int(2, 3);
		const fr = rng.int(1, 2);
		const sheet: Sheet = {};
		for (let r = 1; r <= n; r++) sheet[`A${r}`] = String(rng.int(2, 40));
		if (new Set(Object.values(sheet)).size < n) continue;
		const factor = rng.pick(st.factors);
		const fixedAddr = addr(fc, fr);
		sheet[fixedAddr] = factor;
		const u = rng.next();
		const style: Kind = st.op === '/' ? (u < 0.65 ? 'abs' : 'row') : u < 0.4 ? 'abs' : u < 0.6 ? 'row' : u < 0.85 ? 'rel' : 'col';
		const formula = `=A1${st.op}${refStr(styled(fc, fr, style))}`;
		sheet.B1 = formula;
		const k = rng.int(2, n);
		const asked = `B${k}`;
		const copied = copyFormula(formula, 0, k - 1)!;
		const v = numberOf(copied, sheet);
		if (!v || !isTerminating(v) || decimalsOf(v) > 2) continue;
		const f = parseNum(factor);
		const a = (r: number) => parseNum(sheet[`A${r}`]);
		const good = (x: Rational) => (st.op === '*' ? x.mul(f) : x.div(f));
		const stays = style === 'abs' || style === 'row';
		const moved = addr(fc, style === 'abs' || style === 'row' ? fr : fr + k - 1);
		const fixedTxt = stays ? `${refText(styled(fc, fr, style), 0, k - 1)}` : `${code(refStr(styled(fc, fr, style)))} non ha la riga bloccata e diventa ${code(refStr(COPY(styled(fc, fr, style), 0, k - 1)))}`;
		return {
			prompt: 'Trova il valore dopo la copia.',
			problem: problemTex([
				`Nella colonna ${code('A')} ci sono ${st.data}, e nella cella ${code(fixedAddr)} c'è ${st.fixed}.`,
				tableTex(sheet, fc + 1, n),
				`La formula di ${code('B1')} viene copiata nelle celle da ${code('B2')} a ${code(`B${n}`)}. Che valore mostra ${code(asked)}?`,
			]),
			solution: numTex(v),
			steps: [
				step(`Da ${code('B1')} a ${code(asked)} la formula scende di ${plural(k - 1, 'riga', 'righe')}: ${code('A1')} è relativo e diventa ${code(`A${k}`)}; ${fixedTxt}.`),
				step(`In ${code(asked)} c'è ${code(copied)}.`),
				step(
					stays
						? `$${numTex(a(k))} ${st.op === '*' ? '\\cdot' : ':'} ${numTex(f)} = ${numTex(v)}$`
						: `La cella ${code(moved)} è vuota e in un calcolo vale $0$: $${numTex(a(k))} \\cdot 0 = 0$. Per questo il riferimento a ${code(fixedAddr)} andava bloccato con il dollaro.`,
				),
			],
			value: v,
			mistakes: stays ? [q(0), good(a(1)), a(k), good(a(k === n ? k - 1 : k + 1)), f] : [good(a(k)), good(a(1)), a(k), f],
			params: { sheet, asked, last: `B${n}`, case: stays ? 'bloccato' : 'non bloccato' },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 6: which formula to write

const THINGS = ['dei prezzi', 'delle misure', 'dei punteggi', 'delle quantità', 'delle distanze', 'dei tempi'];
const FIXED = ['un coefficiente', "un'aliquota", 'un tasso di cambio', 'un fattore di conversione'];
const VERB = { '*': 'moltiplicare', '/': 'dividere' } as const;

function level6(rng: Rng): Built {
	const u = rng.next();
	const kind = u < 0.4 ? 'colonna' : u < 0.7 ? 'riga' : 'tabellina';
	const op = kind === 'tabellina' ? rng.pick(['*', '*', '+'] as const) : rng.pick(['*', '*', '/'] as const);
	const f = (a: Ref, b: Ref) => `=${refStr(a)}${op}${refStr(b)}`;
	let problem: string, right: string, wrong: string[], why: string[], params: Record<string, unknown>;
	if (kind === 'colonna') {
		const dc = rng.int(0, 3);
		const r1 = rng.int(1, 4);
		const r2 = r1 + rng.int(2, 6);
		const fc = dc + rng.int(2, 4);
		const fr = rng.int(1, 3);
		const [d, x] = [addr(dc, r1), addr(fc, fr)];
		const first = addr(dc + 1, r1);
		const last = addr(dc + 1, r2);
		const full = rng.next() < 0.7;
		right = f(styled(dc, r1, 'rel'), styled(fc, fr, full ? 'abs' : 'row'));
		wrong = [f(styled(dc, r1, 'rel'), styled(fc, fr, 'rel')), ...shuffle(rng, [f(styled(dc, r1, 'abs'), styled(fc, fr, 'abs')), f(styled(dc, r1, 'abs'), styled(fc, fr, 'rel')), f(styled(dc, r1, 'rel'), styled(fc, fr, 'col')), f(styled(dc, r1, 'row'), styled(fc, fr, 'abs'))])];
		problem = `Nelle celle da ${code(d)} a ${code(addr(dc, r2))} ci sono ${rng.pick(THINGS)}, e nella cella ${code(x)} c'è ${rng.pick(FIXED)}. In ${code(first)} vuoi una formula da copiare fino a ${code(last)}: ogni cella deve ${VERB[op as '*' | '/']} il valore della sua riga per ${code(x)}. Quale formula scrivi in ${code(first)}?`;
		why = [
			`Copiando verso il basso cambiano i numeri di riga. Il riferimento a ${code(d)} deve seguire la riga: resta relativo.`,
			`Il riferimento a ${code(x)} deve restare fermo: serve il dollaro davanti al numero di riga${full ? ' (con il dollaro anche davanti alla lettera è assoluto, e va bene per ogni copia)' : ''}.`,
		];
		params = { case: kind, data: `${d}:${addr(dc, r2)}`, fixed: x, first, last, op };
	} else if (kind === 'riga') {
		const dr = rng.int(1, 4);
		const c1 = rng.int(1, 3);
		const c2 = c1 + rng.int(2, 5);
		const fc = rng.int(0, c1 - 1);
		const fr = dr + rng.int(2, 4);
		const [d, x] = [addr(c1, dr), addr(fc, fr)];
		const first = addr(c1, dr + 1);
		const last = addr(c2, dr + 1);
		const full = rng.next() < 0.7;
		right = f(styled(c1, dr, 'rel'), styled(fc, fr, full ? 'abs' : 'col'));
		wrong = [f(styled(c1, dr, 'rel'), styled(fc, fr, 'rel')), ...shuffle(rng, [f(styled(c1, dr, 'abs'), styled(fc, fr, 'abs')), f(styled(c1, dr, 'abs'), styled(fc, fr, 'rel')), f(styled(c1, dr, 'rel'), styled(fc, fr, 'row')), f(styled(c1, dr, 'col'), styled(fc, fr, 'abs'))])];
		problem = `Nelle celle da ${code(d)} a ${code(addr(c2, dr))} ci sono ${rng.pick(THINGS)}, e nella cella ${code(x)} c'è ${rng.pick(FIXED)}. In ${code(first)} vuoi una formula da copiare fino a ${code(last)}: ogni cella deve ${VERB[op as '*' | '/']} il valore della sua colonna per ${code(x)}. Quale formula scrivi in ${code(first)}?`;
		why = [
			`Copiando verso destra cambiano le lettere di colonna. Il riferimento a ${code(d)} deve seguire la colonna: resta relativo.`,
			`Il riferimento a ${code(x)} deve restare fermo: serve il dollaro davanti alla lettera${full ? ' (con il dollaro anche davanti al numero è assoluto, e va bene per ogni copia)' : ''}.`,
		];
		params = { case: kind, data: `${d}:${addr(c2, dr)}`, fixed: x, first, last, op };
	} else {
		const hc = rng.int(0, 2);
		const hr = rng.int(1, 3);
		const c2 = hc + rng.int(2, 5);
		const r2 = hr + rng.int(2, 6);
		const first = addr(hc + 1, hr + 1);
		const last = addr(c2, r2);
		const a = (k: Kind) => styled(hc, hr + 1, k);
		const b = (k: Kind) => styled(hc + 1, hr, k);
		right = f(a('col'), b('row'));
		wrong = [f(a('row'), b('col')), ...shuffle(rng, [f(a('abs'), b('abs')), f(a('rel'), b('rel')), f(a('col'), b('col')), f(a('row'), b('row')), f(a('col'), b('rel')), f(a('rel'), b('row'))])];
		problem = `Nelle celle da ${code(addr(hc, hr + 1))} a ${code(addr(hc, r2))} ci sono dei numeri, e altri numeri nelle celle da ${code(addr(hc + 1, hr))} a ${code(addr(c2, hr))}. In ${code(first)} vuoi una formula da copiare in tutte le celle da ${code(first)} a ${code(last)}: ogni cella deve ${op === '*' ? 'moltiplicare' : 'sommare'} il numero della sua riga che sta nella colonna ${code(colName(hc))} ${op === '*' ? 'per il' : 'e il'} numero della sua colonna che sta nella riga $${hr}$. Quale formula scrivi in ${code(first)}?`;
		why = [
			`Il primo numero sta sempre nella colonna ${code(colName(hc))}, in una riga che cambia: dollaro davanti alla lettera, ${code(refStr(a('col')))}.`,
			`Il secondo sta sempre nella riga $${hr}$, in una colonna che cambia: dollaro davanti al numero, ${code(refStr(b('row')))}.`,
		];
		params = { case: kind, rows: `${addr(hc, hr + 1)}:${addr(hc, r2)}`, cols: `${addr(hc + 1, hr)}:${addr(c2, hr)}`, first, last, op };
	}
	return {
		prompt: 'Scegli la formula da scrivere.',
		problem: problemTex([problem]),
		solution: codeOpt(right).latex,
		steps: [...why.map(step), step(`La formula è ${code(right)}.`)],
		choice: choose(rng, codeOpt(right), wrong.map(codeOpt)),
		params,
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: (rng) => copyLevel(rng, 1),
	2: (rng) => copyLevel(rng, 2),
	3: (rng) => copyLevel(rng, 3),
	4: (rng) => copyLevel(rng, 4),
	5: level5,
	6: level6,
};

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 200; attempt++) {
		const b = make(rng);
		const params = { ...b.params } as Record<string, unknown>;
		if (b.value) {
			let ch: ChoiceAnswer;
			try {
				ch = numberChoice(rng, b.value, b.mistakes ?? []);
			} catch {
				continue;
			}
			if (ch.options.some((o) => o.values[0].startsWith('-'))) continue;
			params.options = ch.options.map((o) => o.values[0]);
			params.correct = ch.correct;
		}
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: b.prompt,
			problem: b.problem,
			solution: b.solution,
			steps: b.steps,
			answer: b.value ? { kind: 'number', value: b.value.toString() } : b.choice!,
			params,
		};
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function toChoice(sample: Sample): ChoiceAnswer {
	if (sample.answer.kind === 'choice') return sample.answer;
	const options = sample.params.options as string[];
	return { kind: 'choice', options: options.map((v) => ({ latex: numTex(Rational.parse(v)), values: [v] })), correct: sample.params.correct as number };
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test(sample.problem + sample.steps.join(' ') + sample.solution)) v.push('parole vietate');
	v.push(...choiceViolations(toChoice(sample)));
	const p = sample.params;
	if (sample.level <= 4 && sample.answer.kind === 'choice') {
		const s = refsOf(parseFormula(`=${p.source}`))[0];
		const t = refsOf(parseFormula(`=${p.target}`))[0];
		const [dc, dr] = [t.col - s.col, t.row - s.row];
		const refs = refsOf(parseFormula(p.formula as string));
		if (sample.answer.options[sample.answer.correct].values[0] !== copyFormula(p.formula as string, dc, dr)) v.push('la formula indicata non è quella copiata');
		if (sample.level === 1 && (dc !== 0 || dr === 0)) v.push('livello 1: la copia resta nella colonna');
		if (sample.level === 2 && dc === 0) v.push('livello 2: la copia cambia colonna');
		if (sample.level <= 2 && refs.some((r) => dollars(r))) v.push('livelli 1 e 2: solo riferimenti relativi');
		if (sample.level === 3 && !(refs.some((r) => dollars(r) === 2) && refs.some((r) => dollars(r) === 0) && !refs.some((r) => dollars(r) === 1))) v.push('livello 3: un riferimento assoluto e almeno uno relativo');
		if (sample.level === 4 && !(refs.some((r) => dollars(r) === 1) && dc !== 0 && dr !== 0)) v.push('livello 4: un riferimento misto e una copia in diagonale');
	}
	if (sample.level === 5) {
		const sheet = p.sheet as Sheet;
		const k = Number((p.asked as string).slice(1));
		const val = numberOf(copyFormula(sheet.B1, 0, k - 1)!, sheet);
		if (!val || sample.answer.kind !== 'number' || sample.answer.value !== val.toString()) v.push('la risposta non è il valore della formula copiata');
		else if (decimalsOf(val) > 2) v.push('più di due decimali');
	}
	return v;
}

export const infRiferimentiCelle: Generator = {
	id: ID,
	title: 'Riferimenti relativi e assoluti',
	levels: {
		1: { label: 'Copiare lungo la colonna', constraints: ['riferimenti relativi; la formula sale o scende nella sua colonna'] },
		2: { label: "Copiare in un'altra colonna", constraints: ['riferimenti relativi; la copia cambia colonna, e in metà dei casi anche riga'] },
		3: { label: 'Riferimenti assoluti', constraints: ['un riferimento con due dollari e almeno uno relativo, nessuno misto'] },
		4: { label: 'Riferimenti misti', constraints: ['almeno un riferimento con un solo dollaro; la copia cambia riga e colonna'] },
		5: { label: 'Il valore dopo la copia', constraints: ['una colonna di numeri per un fattore in una cella; il riferimento al fattore è bloccato oppure no (allora il valore è 0)'] },
		6: { label: 'Quale formula scrivere', constraints: ['copia lungo una colonna, lungo una riga o in una tabella a doppia entrata: una sola delle quattro formule funziona in tutte le celle'] },
	},
	generate,
	check,
	toChoice,
};

export default infRiferimentiCelle;
