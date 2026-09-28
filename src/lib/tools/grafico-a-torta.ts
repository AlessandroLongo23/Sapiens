import { Rational } from '@/lib/exercises/v2/rational';
import { escapeHtml } from '@/lib/utils/escape';
import { fail, type Outcome, type Step } from './types';
import { decimal, parseDecimal } from './numbers';

/**
 * The pie chart (aerogramma) of some items with their values, as the lesson "Dati, frequenze e grafici"
 * (statistica-dati) builds it: the relative frequency $f_r$ of each item, its percentage and its angle at the centre
 * $\alpha = f_r \cdot 360^\circ$, with the check that the percentages make 100 and the angles 360°. The chart itself is
 * an SVG string (`pieSvg`), the same markup on the page (coloured with the site's tokens) and in the downloaded file
 * (fixed colours on white), so what the student sees is what goes in the report.
 */

export const MAX_ITEMS = 12;
const MAX_NAME = 40;
const MAX_TITLE = 80;
/** Relative frequencies to three decimals, percentages and angles to one, as in the lesson and the frequency table. */
const FR_DIGITS = 3;
const PCT_DIGITS = 1;
const DEG_DIGITS = 1;
/** Under this percentage a slice is too thin for its name: it gets only its number, which the legend explains. */
const SMALL_PCT = 3;

/** One slice as the chart draws it. */
export interface PieSlice {
	/** Its number in the legend, from 1. */
	n: number;
	name: string;
	/** The share of the circle, from 0 to 1. */
	frac: number;
	/** The rounded percentage as text, without the sign: "36", "8,2". */
	pct: string;
	/** Under 3 %: the chart writes only its number, the legend its name. */
	small: boolean;
}

export interface PieModel {
	slices: PieSlice[];
	/** The sum of the values, as text: "25". */
	total: string;
}

interface Item {
	name: string;
	value: Rational;
}

const clean = (s: string) => s.replace(/\s+/g, ' ').trim();
/** A name in a note, without the characters that would open a formula. */
const quoted = (s: string) => `"${s.replace(/[$\\]/g, '')}"`;
const numberText = (s: string) => s.replace(/[−–]/g, '-').replace(/\s*%$/, '').trim();

/**
 * A line of the table as [name, value]: split at the first tab (a table copied from a spreadsheet or from the frequency
 * table, where the second column is the value), else at the last semicolon or colon, else before a final number
 * ("Autobus 9"). A line with no separator is a name without a value.
 */
export function splitLine(line: string): [string, string] {
	if (line.includes('\t')) {
		const cells = line.split('\t');
		return [clean(cells[0]), clean(cells[1] ?? '')];
	}
	for (const sep of [';', ':']) {
		const i = line.lastIndexOf(sep);
		if (i >= 0) return [clean(line.slice(0, i)), clean(line.slice(i + 1))];
	}
	const m = /^(.*?)[\s,]+([-−–]?\d[\d.,]*\s*%?)$/.exec(line.trim());
	if (m) return [clean(m[1]), clean(m[2])];
	return [clean(line), ''];
}

interface Read {
	items: Item[];
	notes: string[];
}

function readTable(input: string): Read | string {
	// A line with only separators is an empty row of the editor.
	const lines = input.split(/\r?\n/).filter((l) => l.replace(/[\t;:]/g, '').trim());
	if (!lines.length) return 'Scrivi almeno una voce con il suo valore, per esempio Autobus; 9.';
	const items: Item[] = [];
	const notes: string[] = [];
	for (const [i, line] of lines.entries()) {
		const [name, raw] = splitLine(line);
		const value = raw ? parseDecimal(numberText(raw)) : null;
		// A heading copied with the table ("Modalità", "Frequenza assoluta"): its value is a word.
		if (i === 0 && lines.length > 1 && !value && /\p{L}/u.test(raw)) {
			notes.push(`La prima riga, ${quoted(name)}, è l'intestazione della tabella: non è una voce.`);
			continue;
		}
		if (/^tot(ale|al)?\.?$/i.test(name)) {
			notes.push(`La riga ${quoted(name)} è la somma delle altre: non è una voce.`);
			continue;
		}
		if (!name) return `Alla riga ${i + 1} manca il nome della voce: scrivilo prima del valore, per esempio Autobus; 9.`;
		if (/[$\\]/.test(name)) return `Il nome "${name}" contiene $ o \\: scrivilo con lettere e numeri.`;
		if (name.length > MAX_NAME) return `Il nome "${name.slice(0, 30)}…" è troppo lungo: al massimo ${MAX_NAME} caratteri.`;
		if (!raw) return `Manca il valore di "${name}": scrivilo dopo il nome, per esempio ${name}; 9.`;
		if (!value) return `Il valore di "${name}" non è un numero: scrivi per esempio 9 oppure 7,5.`;
		if (value.sign() < 0) return `I valori di un grafico a torta non possono essere negativi: "${name}" vale ${raw}.`;
		items.push({ name, value });
	}
	if (items.length > MAX_ITEMS) return `Le voci sono ${items.length}: al massimo ${MAX_ITEMS}. Con più spicchi il grafico non si legge: riunisci le più piccole in una voce "Altro".`;
	if (!items.length) return 'Scrivi almeno una voce con il suo valore, per esempio Autobus; 9.';
	return { items, notes };
}

const num = (r: Rational) => decimal(r, 6);
const eq = (d: { exact: boolean }) => (d.exact ? '=' : '\\approx');
const approxCell = (d: { exact: boolean; tex: string }, unit = '') => `$${d.exact ? '' : '\\approx '}${d.tex}${unit}$`;
const andList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} e ${xs[xs.length - 1]}`);
/** A fraction of two values in a formula. */
const fracTex = (a: Rational, b: Rational) => `\\dfrac{${num(a).tex}}{${num(b).tex}}`;
const DEG = '^\\circ';

function compute(data: string, sorted: boolean): { outcome: Outcome; chart: PieModel | null } {
	const read = readTable(data);
	if (typeof read === 'string') return { outcome: fail(read), chart: null };
	const zeros = read.items.filter((it) => it.value.isZero());
	let items = read.items.filter((it) => !it.value.isZero());
	if (!items.length)
		return {
			outcome: fail('Tutti i valori sono zero: serve almeno una voce con un valore maggiore di zero.'),
			chart: null
		};
	if (sorted)
		items = items
			.map((it, i) => ({ it, i }))
			.sort((a, b) => b.it.value.compare(a.it.value) || a.i - b.i)
			.map((x) => x.it);

	const total = items.reduce((a, it) => a.add(it.value), Rational.of(0));
	const rows = items.map((it) => {
		const f = it.value.div(total);
		return {
			...it,
			f,
			fr: decimal(f, FR_DIGITS),
			pct: decimal(f.mul(Rational.of(100)), PCT_DIGITS),
			deg: decimal(f.mul(Rational.of(360)), DEG_DIGITS),
			small: f.mul(Rational.of(100)).compare(Rational.of(SMALL_PCT)) < 0
		};
	});
	const totalTex = num(total).tex;

	const steps: Step[] = [];
	const intro = [
		...read.notes,
		...(zeros.length ? [`${andList(zeros.map((z) => `"${z.name}"`))} ${zeros.length > 1 ? 'valgono' : 'vale'} $0$: nel grafico non ${zeros.length > 1 ? 'hanno' : 'ha'} uno spicchio.`] : []),
		...(sorted ? ['Le voci sono in ordine dalla più grande.'] : [])
	];
	steps.push({
		group: 'Il totale',
		say: 'Somma i valori di tutte le voci.',
		math: [`${items.map((it) => num(it.value).tex).join(' + ')} = \\hl{${totalTex}}`],
		then: intro.length ? intro.join(' ') : undefined
	});
	steps.push({
		group: 'Le percentuali',
		say: `Dividi ogni valore per il totale, $${totalTex}$.`,
		table: {
			head: ['Voce', '$f_r$'],
			rows: rows.map((r) => [r.name, `$${fracTex(r.value, total)} ${eq(r.fr)} ${r.fr.tex}$`])
		},
		then: 'Sono le frequenze relative: la loro somma è $1$.'
	});
	steps.push({
		say: 'Moltiplica ogni frequenza relativa per $100$.',
		table: {
			head: ['Voce', 'Percentuale'],
			// From the exact fraction when the relative frequency was rounded, so the percentage is right.
			rows: rows.map((r) => [r.name, r.fr.exact ? `$${r.fr.tex} \\cdot 100 ${eq(r.pct)} \\hl{${r.pct.tex}\\%}$` : `$${fracTex(r.value, total)} \\cdot 100 ${eq(r.pct)} \\hl{${r.pct.tex}\\%}$`])
		}
	});
	steps.push({
		group: 'Gli angoli al centro',
		say: `Moltiplica ogni frequenza relativa per $360${DEG}$.`,
		table: {
			head: ['Voce', 'Angolo'],
			rows: rows.map((r) => [
				r.name,
				r.fr.exact ? `$${r.fr.tex} \\cdot 360${DEG} ${eq(r.deg)} \\hl{${r.deg.tex}${DEG}}$` : `$${fracTex(r.value, total)} \\cdot 360${DEG} ${eq(r.deg)} \\hl{${r.deg.tex}${DEG}}$`
			])
		},
		then: items.length === 1 ? 'Una voce sola occupa tutto il cerchio.' : 'Con il goniometro, disegna gli spicchi uno dopo l’altro a partire dalle ore 12.'
	});

	steps.push({
		group: 'La tabella completa',
		say: 'Riunisci tutto in una tabella.',
		table: {
			head: ['Voce', 'Valore', '$f_r$', 'Percentuale', 'Angolo'],
			rows: [...rows.map((r) => [r.name, `$${num(r.value).tex}$`, approxCell(r.fr), approxCell(r.pct, '\\%'), approxCell(r.deg, DEG)]), ['Totale', `$${totalTex}$`, '$1$', '$100\\%$', `$360${DEG}$`]]
		},
		then: rows.some((r) => r.small) ? `Gli spicchi sotto il $${SMALL_PCT}\\%$ sono troppo stretti per il nome: nel grafico hanno solo il numero, e il nome è nella legenda.` : undefined
	});

	const sumOf = (ds: { text: string }[]) => ds.reduce((a, d) => a.add(parseDecimal(d.text) as Rational), Rational.of(0));
	const pctSum = sumOf(rows.map((r) => r.pct));
	const degSum = sumOf(rows.map((r) => r.deg));
	const pctOk = pctSum.equals(Rational.of(100));
	const degOk = degSum.equals(Rational.of(360));
	const rounded = rows.some((r) => !r.pct.exact || !r.deg.exact);
	steps.push({
		group: 'Il controllo',
		say: 'Somma le percentuali e gli angoli.',
		math: [`${rows.map((r) => `${r.pct.tex}\\%`).join(' + ')} = \\hl{${num(pctSum).tex}\\%}`, `${rows.map((r) => r.deg.tex + DEG).join(' + ')} = \\hl{${num(degSum).tex}${DEG}}`],
		then:
			pctOk && degOk
				? `Le percentuali fanno $100\\%$ e gli angoli $360${DEG}$: ${rounded ? 'anche con gli arrotondamenti a un decimale, ' : ''}il cerchio è completo.`
				: `Percentuali e angoli sono arrotondati a un decimale: per questo ${[
						...(pctOk ? [] : [`le percentuali sommano a $${num(pctSum).tex}\\%$ invece di $100\\%$`]),
						...(degOk ? [] : [`${pctOk ? 'gli angoli sommano' : 'gli angoli'} a $${num(degSum).tex}${DEG}$ invece di $360${DEG}$`])
					].join(' e ')}. Non è un errore.`
	});

	const top = rows.reduce((a, r) => (r.value.compare(a) > 0 ? r.value : a), Rational.of(0));
	const biggest = rows.filter((r) => r.value.equals(top));
	const resultRows = [
		{ label: 'Totale', value: `$${totalTex}$` },
		{
			label: biggest.length > 1 ? 'Spicchi più grandi' : 'Spicchio più grande',
			value: `${andList(biggest.map((b) => b.name))}, $${biggest[0].pct.exact ? '' : '\\approx '}${biggest[0].pct.tex}\\%$${biggest.length > 1 ? ' ciascuno' : ''}`
		},
		...(zeros.length
			? [
					{
						label: zeros.length > 1 ? 'Voci senza spicchio' : 'Voce senza spicchio',
						value: `${andList(zeros.map((z) => z.name))} (valore $0$)`
					}
				]
			: [])
	];
	const tsv = [
		['Voce', 'Valore', 'Frequenza relativa', 'Percentuale', 'Angolo'],
		...rows.map((r) => [r.name, num(r.value).text, r.fr.text, `${r.pct.text} %`, `${r.deg.text}°`]),
		['Totale', num(total).text, '1', '100 %', '360°']
	];
	return {
		outcome: {
			ok: true,
			rows: resultRows,
			copy: tsv.map((r) => r.join('\t')).join('\n'),
			steps
		},
		chart: {
			total: num(total).text,
			slices: rows.map((r, i) => ({
				n: i + 1,
				name: r.name,
				frac: r.f.num / r.f.den,
				pct: r.pct.text === '0' ? '< 0,1' : r.pct.text,
				small: r.small
			}))
		}
	};
}

/** The table and the chart of `data`, one item per line ("Autobus; 9"); with `sorted`, from the largest slice. */
export function graficoATorta(data: string, sorted = false): { outcome: Outcome; chart: PieModel | null } {
	try {
		return compute(data, sorted);
	} catch {
		// Rational throws when a result leaves the safe integers: too many digits.
		return {
			outcome: fail('I numeri sono troppo grandi o hanno troppi decimali: prova con meno cifre, per esempio 7,5 invece di 7,4999.'),
			chart: null
		};
	}
}

// ─── The chart ──────────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * The Okabe-Ito palette (Okabe e Ito, "Color Universal Design", 2008), which people with the common forms of colour
 * blindness can tell apart, with grey in place of its black; ordered so that neighbouring slices contrast. From the
 * ninth slice on the colours come back with white stripes. Colour is never the only sign: every slice is named or
 * numbered.
 */
export const PALETTE = ['#0072B2', '#E69F00', '#009E73', '#CC79A7', '#56B4E9', '#D55E00', '#F0E442', '#999999'];

/** The colours of the text and lines: the site's tokens on the page, fixed ones on the white of a downloaded file. */
export interface Ink {
	text: string;
	muted: string;
	line: string;
	/** The gaps between the slices. */
	gap: string;
	/** A background, or null for none. */
	paper: string | null;
	font: string;
}

export const PAGE_INK: Ink = {
	text: 'var(--fg-strong)',
	muted: 'var(--fg-muted)',
	line: 'var(--fg-subtle)',
	gap: 'var(--surface)',
	paper: null,
	font: 'inherit'
};
export const PRINT_INK: Ink = {
	text: '#1d2230',
	muted: '#4d5462',
	line: '#858b96',
	gap: '#ffffff',
	paper: '#ffffff',
	font: "'Helvetica Neue', Helvetica, Arial, sans-serif"
};

export const CHART_W = 500;
const R = 96;
const HOLE = 0.56;
const LABEL_GAP = 26;
const BIG_H = 36;
const SMALL_H = 22;
const LEGEND_ROW = 24;
/** An average character width, as a share of the font size, to cut names that would not fit. */
const CHAR_W = 0.56;

const f1 = (n: number) => Math.round(n * 10) / 10;
const clip = (s: string, max: number) =>
	[...s].length > max
		? `${[...s]
				.slice(0, max - 1)
				.join('')
				.trimEnd()}…`
		: s;
const fill = (c: string) => `style="fill:${c}"`;

/** The title in lines of at most `max` characters, two lines at most. */
function wrap(title: string, max: number): string[] {
	const lines: string[] = [];
	let line = '';
	for (const word of title.split(/\s+/).filter(Boolean)) {
		if (line && line.length + 1 + word.length > max) {
			lines.push(line);
			line = word;
		} else line = line ? `${line} ${word}` : word;
	}
	if (line) lines.push(line);
	if (lines.length <= 2) return lines.map((l) => clip(l, max));
	return [lines[0], clip(lines.slice(1).join(' '), max)];
}

/** The path of a slice from angle a to angle b (radians, clockwise from 12 o'clock); a ring slice with `hole`. */
function slicePath(cx: number, cy: number, a: number, b: number, hole: number): string {
	const p = (r: number, t: number) => `${f1(cx + r * Math.sin(t))},${f1(cy - r * Math.cos(t))}`;
	const large = b - a > Math.PI ? 1 : 0;
	if (b - a >= 2 * Math.PI - 1e-9) {
		// The whole circle: two half arcs (one arc cannot end where it starts).
		const ring = (r: number, sweep: number) => `M${p(r, 0)} A${r},${r} 0 1 ${sweep} ${p(r, Math.PI)} A${r},${r} 0 1 ${sweep} ${p(r, 0)} Z`;
		return hole ? `${ring(R, 1)} ${ring(hole, 0)}` : ring(R, 1);
	}
	if (!hole) return `M${cx},${cy} L${p(R, a)} A${R},${R} 0 ${large} 1 ${p(R, b)} Z`;
	return `M${p(R, a)} A${R},${R} 0 ${large} 1 ${p(R, b)} L${p(hole, b)} A${hole},${hole} 0 ${large} 0 ${p(hole, a)} Z`;
}

interface Placed {
	s: PieSlice;
	mid: number;
	right: boolean;
	h: number;
	y: number;
}

/**
 * Spreads the labels of one side so they do not overlap: in order from the top, each at least half its height plus
 * half the previous one below it, then pushed back up from the bottom when the last one leaves the box.
 */
function spread(labels: Placed[], top: number, bottom: number) {
	labels.sort((a, b) => a.y - b.y);
	for (let i = 0; i < labels.length; i++) {
		const min = i ? labels[i - 1].y + (labels[i - 1].h + labels[i].h) / 2 : top + labels[i].h / 2;
		labels[i].y = Math.max(labels[i].y, min);
	}
	for (let i = labels.length - 1; i >= 0; i--) {
		const max = i < labels.length - 1 ? labels[i + 1].y - (labels[i + 1].h + labels[i].h) / 2 : bottom - labels[i].h / 2;
		labels[i].y = Math.min(labels[i].y, max);
	}
}

/**
 * The chart as SVG markup: the title, the pie (or the ring, with the total in the hole), a label beside each slice
 * (its name and percentage, or only its number when under 3 %) with a line to it, and the legend with every slice.
 * Names are escaped: they come from the student.
 */
export function pieSvg(model: PieModel, opts: { title?: string; donut?: boolean; ink?: Ink } = {}): { svg: string; width: number; height: number } {
	const ink = opts.ink ?? PAGE_INK;
	const W = CHART_W;
	const cx = W / 2;
	const hole = opts.donut ? R * HOLE : 0;
	const title = clean(opts.title ?? '').slice(0, MAX_TITLE);
	const titleLines = title ? wrap(title, Math.floor((W - 32) / (18 * CHAR_W))) : [];
	const parts: string[] = [];

	let y = 16;
	for (const line of titleLines) {
		y += 22;
		parts.push(`<text x="${cx}" y="${y}" text-anchor="middle" font-size="18" font-weight="600" ${fill(ink.text)}>${escapeHtml(line)}</text>`);
	}
	if (titleLines.length) y += 8;

	// The labels, then the height the pie needs so that they fit on each side.
	let angle = 0;
	const labels: Placed[] = model.slices.map((s) => {
		const a = angle;
		angle += s.frac * 2 * Math.PI;
		const mid = (a + angle) / 2;
		return {
			s,
			mid,
			right: Math.sin(mid) >= -1e-9,
			h: s.small ? SMALL_H : BIG_H,
			y: 0
		};
	});
	const need = (right: boolean) => labels.filter((l) => l.right === right).reduce((a, l) => a + l.h, 0);
	const box = Math.max(2 * R + 48, need(true) + 8, need(false) + 8);
	const cy = y + box / 2;
	for (const l of labels) l.y = cy - (R + 16) * Math.cos(l.mid);
	spread(
		labels.filter((l) => l.right),
		y,
		y + box
	);
	spread(
		labels.filter((l) => !l.right),
		y,
		y + box
	);

	// Slices from 12 o'clock, clockwise; the ninth colour on striped.
	const defs: string[] = [];
	angle = 0;
	for (const [i, s] of model.slices.entries()) {
		const a = angle;
		angle += s.frac * 2 * Math.PI;
		const color = PALETTE[i % PALETTE.length];
		let paint = color;
		if (i >= PALETTE.length) {
			const id = `torta-righe-${i}`;
			defs.push(
				`<pattern id="${id}" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)"><rect width="8" height="8" fill="${color}"/><rect width="3.5" height="8" fill="#ffffff" fill-opacity="0.6"/></pattern>`
			);
			paint = `url(#${id})`;
		}
		parts.push(`<path d="${slicePath(cx, cy, a, angle, hole)}" fill="${paint}" fill-rule="evenodd" stroke-width="2" stroke-linejoin="round" style="stroke:${ink.gap}"/>`);
	}
	if (hole) {
		parts.push(`<text x="${cx}" y="${f1(cy - 4)}" text-anchor="middle" font-size="12" ${fill(ink.muted)}>Totale</text>`);
		parts.push(`<text x="${cx}" y="${f1(cy + 16)}" text-anchor="middle" font-size="18" font-weight="600" ${fill(ink.text)}>${escapeHtml(clip(model.total, 9))}</text>`);
	}

	// The labels, with a line from the edge of the slice.
	const room = Math.floor((W / 2 - R - LABEL_GAP - 6) / (14 * CHAR_W));
	for (const l of labels) {
		const side = l.right ? 1 : -1;
		const edge = [cx + (R + 2) * Math.sin(l.mid), cy - (R + 2) * Math.cos(l.mid)];
		const out = [cx + (R + 10) * Math.sin(l.mid), cy - (R + 10) * Math.cos(l.mid)];
		const tx = cx + side * (R + LABEL_GAP);
		const end = tx - side * 4;
		const anchor = l.right ? 'start' : 'end';
		// A name and its percentage on two lines, the line reaching the name; a number alone in a small circle.
		const ly = l.s.small ? l.y : l.y - 8;
		parts.push(`<polyline points="${f1(edge[0])},${f1(edge[1])} ${f1(out[0])},${f1(out[1])} ${f1(end)},${f1(ly)}" fill="none" stroke-width="1" style="stroke:${ink.line}"/>`);
		if (l.s.small) {
			const bx = tx + side * 9;
			parts.push(`<circle cx="${f1(bx)}" cy="${f1(l.y)}" r="9" fill="none" stroke-width="1" style="stroke:${ink.line}"/>`);
			parts.push(`<text x="${f1(bx)}" y="${f1(l.y + 4)}" text-anchor="middle" font-size="11" ${fill(ink.text)}>${l.s.n}</text>`);
		} else {
			parts.push(`<text x="${f1(tx)}" y="${f1(l.y - 3)}" text-anchor="${anchor}" font-size="14" font-weight="600" ${fill(ink.text)}>${escapeHtml(clip(l.s.name, room))}</text>`);
			parts.push(`<text x="${f1(tx)}" y="${f1(l.y + 13)}" text-anchor="${anchor}" font-size="13" ${fill(ink.muted)}>${escapeHtml(l.s.pct)}&#160;%</text>`);
		}
	}

	// The legend: every slice, numbered, with its full name (cut only past the width) and percentage.
	y += box + 14;
	const lx = cx - 180;
	for (const [i, s] of model.slices.entries()) {
		const ry = y + i * LEGEND_ROW;
		const paint = i >= PALETTE.length ? `url(#torta-righe-${i})` : PALETTE[i % PALETTE.length];
		parts.push(`<rect x="${lx}" y="${ry}" width="14" height="14" rx="2" fill="${paint}"/>`);
		parts.push(`<text x="${lx + 34}" y="${ry + 12}" text-anchor="end" font-size="13" ${fill(ink.muted)}>${s.n}</text>`);
		parts.push(`<text x="${lx + 44}" y="${ry + 12}" font-size="14" ${fill(ink.text)}>${escapeHtml(clip(s.name, 32))}</text>`);
		parts.push(`<text x="${lx + 360}" y="${ry + 12}" text-anchor="end" font-size="14" ${fill(ink.text)}>${escapeHtml(s.pct)}&#160;%</text>`);
	}
	const height = Math.ceil(y + model.slices.length * LEGEND_ROW + 6);

	const label = `${title ? `${title}. ` : ''}Grafico a ${opts.donut ? 'ciambella' : 'torta'}: ${model.slices.map((s) => `${s.name} ${s.pct} %`).join('; ')}.`;
	const svg = [
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${height}" width="${W}" height="${height}" role="img" style="font-family:${ink.font}">`,
		`<title>${escapeHtml(label)}</title>`,
		defs.length ? `<defs>${defs.join('')}</defs>` : '',
		ink.paper ? `<rect width="${W}" height="${height}" fill="${ink.paper}"/>` : '',
		...parts,
		'</svg>'
	].join('');
	return { svg, width: W, height };
}
