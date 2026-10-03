/**
 * The plane of a lesson, as its author writes it: a ```grafico block in the lesson's markdown, with the formulas
 * already there, the sliders of their parameters and the window. The student moves the sliders and reads; nothing
 * is typed. vault/Contenuti/Piano cartesiano nelle lezioni.md
 *
 *   ```grafico
 *   % nome: parabola-coefficienti
 *   % alt: La parabola y = ax² + bx + c con i cursori dei tre coefficienti
 *   curva: y=ax^2+bx+c
 *   curva: y=x^2 | tratteggiata | grigio
 *   cursore: a = 1 da -3 a 3 passo 0,5
 *   finestra: x da -6 a 6, y da -4 a 8
 *   valore: \Delta = b^2-4ac
 *   domanda: Porta $a$ sotto zero: cosa fa la parabola?
 *   ```
 *
 * One line, one thing: `curva` (a formula as the plotter reads it, then its look after " | "), `scelta` (one of the
 * formulas a segmented control chooses among, "label :: formula", then its colour after " | "), `cursore`, `finestra`, `forma` (width:height of
 * the drawing, when the two axes have different scales), `valore` (a name, "=", and an expression of the parameters,
 * written beside the plane as the sliders move), `assi` (their names), `sposta` (the student may move the window),
 * `domanda` (what to try, under the plane).
 *
 * A block that follows a TikZ figure takes it as its cover: the lesson shows the figure, and a button puts the
 * plane in its place (content/markdown.ts).
 */

import { readNumber } from './assi';
import { PALETTE, type LineDash, type LineWidth } from './documento';
import { definitions, readEntry, type Json } from './formula';

export interface BlockCurve {
	latex: string;
	color: string;
	width: LineWidth;
	dash: LineDash;
	/** Writes the function's letter beside its curve. */
	label: boolean;
	/** For a curve in t or in θ: where the letter runs. */
	t0?: number;
	t1?: number;
}

export interface BlockSlider {
	name: string;
	value: number;
	min: number;
	max: number;
	step: number;
	/** With a button that moves it back and forth. */
	play: boolean;
}

export interface PlotBlock {
	name: string;
	alt: string;
	/** The rows of the plane, in order. One of them may be the choice: its formula is the option chosen. */
	rows: (BlockCurve & { options?: { label: string; latex: string; /** Its own colour, when the options differ in meaning: blue where positive, red where negative. */ color?: string }[] })[];
	sliders: BlockSlider[];
	window: { x0: number; x1: number; y0: number; y1: number };
	/** Width over height of the drawing. Absent, the two axes have the same scale. */
	shape?: number;
	values: { label: string; latex: string }[];
	axes?: [string, string];
	/** The student may drag and zoom the window. */
	free: boolean;
	question?: string;
}

/** A block with every formula already parsed, as the page carries it: the browser needs no LaTeX parser. */
export interface ReadPlotBlock extends Omit<PlotBlock, 'rows' | 'values'> {
	rows: (Omit<PlotBlock['rows'][number], 'options'> & { json: Json; options?: { label: string; latex: string; color?: string; json: Json }[] })[];
	values: { label: string; json: Json }[];
}

const GRAY = '#808080';
const COLORS: Record<string, string> = { blu: PALETTE[0], rosso: PALETTE[1], verde: PALETTE[2], arancione: PALETTE[3], viola: PALETTE[4], 'verde acqua': PALETTE[5], magenta: PALETTE[6], nero: PALETTE[7], grigio: GRAY };
const NUMBER = String.raw`-?[\d.,]*(?:π|pi)?(?:/\d+)?`;
const RANGE = new RegExp(String.raw`^da\s+(${NUMBER})\s+a\s+(${NUMBER})$`);

/** The block's text as a plane, or what is wrong with it, line by line. */
export function parsePlotBlock(block: string): { plot: PlotBlock | null; errors: string[] } {
	const errors: string[] = [];
	const plot: PlotBlock = { name: '', alt: '', rows: [], sliders: [], window: { x0: -10, x1: 10, y0: -7, y1: 7 }, values: [], free: false };
	let choice: PlotBlock['rows'][number] | null = null;
	const nextColor = () => PALETTE[plot.rows.filter((r) => r.color !== GRAY).length % PALETTE.length];

	for (const raw of block.replace(/\r\n?/g, '\n').split('\n')) {
		const line = raw.trim();
		if (!line) continue;
		const meta = /^%\s*(nome|alt):\s*(.*)$/.exec(line);
		if (meta) {
			if (meta[1] === 'nome') plot.name = meta[2].trim();
			else plot.alt = meta[2].trim();
			continue;
		}
		if (line.startsWith('%')) continue;
		const m = /^([a-z]+):\s*(.*)$/.exec(line);
		if (!m) {
			errors.push(`riga non letta: ${line.slice(0, 60)}`);
			continue;
		}
		const [, key, rest] = m;
		const bad = () => errors.push(`${key} non letto: ${rest.slice(0, 60)}`);

		if (key === 'curva') {
			const [latex, ...looks] = rest.split(' | ').map((p) => p.trim());
			const row: BlockCurve = { latex, color: '', width: 'normal', dash: 'solid', label: false };
			for (const look of looks) {
				const range = RANGE.exec(look.replace(/^t\s+/, ''));
				if (look === 'tratteggiata') row.dash = 'dashed';
				else if (look === 'a punti') row.dash = 'dotted';
				else if (look === 'sottile') row.width = 'thin';
				else if (look === 'spessa') row.width = 'thick';
				else if (look === 'nome') row.label = true;
				else if (look in COLORS) row.color = COLORS[look];
				else if (look.startsWith('t ') && range) [row.t0, row.t1] = [readNumber(range[1]), readNumber(range[2])];
				else errors.push(`aspetto di una curva non letto: ${look}`);
			}
			if (!latex) bad();
			row.color ||= nextColor();
			plot.rows.push(row);
		} else if (key === 'scelta') {
			const [formula, colour] = rest.split(' | ').map((p) => p.trim());
			const cut = formula.indexOf(' :: ');
			const option: NonNullable<PlotBlock['rows'][number]['options']>[number] = cut < 0 ? { label: formula, latex: formula } : { label: formula.slice(0, cut).trim(), latex: formula.slice(cut + 4).trim() };
			if (colour !== undefined && !(colour in COLORS)) errors.push(`colore di una scelta non letto: ${colour}`);
			else if (colour !== undefined) option.color = COLORS[colour];
			if (!option.latex) bad();
			if (!choice) {
				choice = { latex: option.latex, color: nextColor(), width: 'normal', dash: 'solid', label: false, options: [] };
				plot.rows.push(choice);
			}
			choice.options!.push(option);
		} else if (key === 'cursore') {
			const s = new RegExp(String.raw`^(\\?[A-Za-z]+(?:_\w)?)\s*=\s*(${NUMBER})\s+da\s+(${NUMBER})\s+a\s+(${NUMBER})(?:\s+passo\s+(${NUMBER}))?(\s+anima)?$`).exec(rest);
			const [value, min, max, step] = s ? [s[2], s[3], s[4], s[5] ?? '0,1'].map(readNumber) : [];
			if (!s || ![value, min, max, step].every(Number.isFinite) || !(max > min) || !(step > 0) || value < min || value > max) bad();
			else plot.sliders.push({ name: s[1].replace(/^\\/, ''), value, min, max, step, play: !!s[6] });
		} else if (key === 'finestra') {
			const w = new RegExp(String.raw`^x\s+da\s+(${NUMBER})\s+a\s+(${NUMBER}),\s*y\s+da\s+(${NUMBER})\s+a\s+(${NUMBER})$`).exec(rest);
			const [x0, x1, y0, y1] = w ? w.slice(1, 5).map(readNumber) : [];
			if (!w || ![x0, x1, y0, y1].every(Number.isFinite) || !(x1 > x0) || !(y1 > y0)) bad();
			else plot.window = { x0, x1, y0, y1 };
		} else if (key === 'forma') {
			const f = /^(\d+(?:[.,]\d+)?)\s*:\s*(\d+(?:[.,]\d+)?)$/.exec(rest);
			const shape = f ? readNumber(f[1]) / readNumber(f[2]) : NaN;
			if (!(shape >= 0.5 && shape <= 4)) bad();
			else plot.shape = shape;
		} else if (key === 'valore') {
			const cut = rest.indexOf('=');
			if (cut < 1 || !rest.slice(cut + 1).trim()) bad();
			else plot.values.push({ label: rest.slice(0, cut).trim(), latex: rest.slice(cut + 1).trim() });
		} else if (key === 'assi') {
			const names = rest.split(',').map((n) => n.trim());
			if (names.length !== 2 || names.some((n) => !n || n.length > 8)) bad();
			else plot.axes = [names[0], names[1]];
		} else if (key === 'sposta') plot.free = /^s[iì]$/.test(rest);
		else if (key === 'domanda') plot.question = rest;
		else errors.push(`riga sconosciuta: ${key}`);
	}

	if (!plot.name) errors.push('manca "% nome:"');
	if (!plot.alt) errors.push('manca "% alt:"');
	if (!plot.rows.length) errors.push('nessuna curva');
	if (choice && choice.options!.length < 2) errors.push('una scelta ha almeno due formule');
	return { plot: errors.length ? null : plot, errors };
}

/**
 * The block with its formulas parsed, and what the plotter cannot draw of it: a formula it does not read, a letter
 * with no slider, a value that is not a number. `parse` is the Compute Engine's reader of LaTeX, given from outside
 * so that this file does not carry it into the browser.
 */
export function readPlotBlock(plot: PlotBlock, parse: (latex: string) => Json, clean: (latex: string) => string): { read: ReadPlotBlock; errors: string[] } {
	const errors: string[] = [];
	const json = (latex: string) => parse(clean(latex));
	const read: ReadPlotBlock = {
		...plot,
		rows: plot.rows.map((row) => ({ ...row, json: json(row.latex), options: row.options?.map((o) => ({ ...o, json: json(o.latex) })) })),
		values: plot.values.map((v) => ({ label: v.label, json: json(v.latex) }))
	};
	const known = new Set(plot.sliders.map((s) => s.name));
	// every option of a choice must stand with the other rows
	const variants = read.rows.find((r) => r.options)?.options?.length ?? 1;
	for (let k = 0; k < variants; k++) {
		const rows = read.rows.map((r) => (r.options ? { latex: r.options[k].latex, json: r.options[k].json } : { latex: r.latex, json: r.json }));
		const defs = definitions(rows.map((r) => r.json));
		for (const row of rows) {
			const entry = readEntry(row.json, defs);
			if (entry.kind === 'error') errors.push(`${row.latex}: ${entry.message}`);
			else if (entry.kind === 'empty') errors.push(`${row.latex}: formula vuota`);
			else for (const p of entry.params) if (!known.has(p)) errors.push(`${row.latex}: manca il cursore di ${p}`);
		}
		if (k > 0) continue;
		const scope = Object.fromEntries(plot.sliders.map((s) => [s.name, s.value]));
		plot.values.forEach((value, i) => {
			const entry = readEntry(read.values[i].json, defs);
			if (entry.kind !== 'function' && entry.kind !== 'point') errors.push(`valore ${value.label}: ${entry.kind === 'error' ? entry.message : 'serve un numero o una coppia di coordinate'}`);
			else {
				for (const p of entry.params) if (!known.has(p)) errors.push(`valore ${value.label}: manca il cursore di ${p}`);
				if (entry.kind === 'function' && entry.f({ ...scope, x: 0 }) !== entry.f({ ...scope, x: 1.37 }) && Number.isFinite(entry.f({ ...scope, x: 0 }))) errors.push(`valore ${value.label}: dipende da x`);
			}
		});
	}
	return { read, errors };
}
