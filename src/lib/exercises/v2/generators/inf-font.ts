/**
 * Caratteri tipografici e font. Spec: specs/exercises/inf-font.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/86-inf-font.md), all multiple choice: character,
 * glyph, font and family told apart in a situation; the bytes of a bitmap font and what enlarging does to it; the
 * three groups of families, with the width of a row in a monospaced font; size and line height read from a CSS
 * rule; which font of a `font-family` list the browser uses on a device. The CSS is shown as a fragment under the
 * question, and read again by the Python check.
 */
import { choose, makeCodeGenerator, shuffle, textOption, type CodeBuilt } from '../inf-codice';
import type { ChoiceAnswer, ChoiceOption, Rng } from '../types';

export const ID = 'inf-font';

const it = (x: number) => String(Math.round(x * 1000) / 1000).replace('.', ',');
const value = (x: number) => String(Math.round(x * 1000) / 1000);
const amount = (x: number, unit: string): ChoiceOption => textOption(`${it(x)} ${unit}`, value(x));
const rightLabel = (answer: ChoiceAnswer) => answer.options[answer.correct].text ?? '';
const amounts = (rng: Rng, right: number, wrong: number[], unit: string) =>
	choose(
		rng,
		amount(right, unit),
		wrong.filter((x) => x > 0 && value(x) !== value(right)).map((x) => amount(x, unit))
	);

// ---------------------------------------------------------------------------
// Level 1: character, glyph, font, family

const TERMS = { carattere: 'un carattere', glifo: 'un glifo', font: 'un font', famiglia: 'una famiglia di caratteri', corpo: 'il corpo' } as const;
type Term = keyof typeof TERMS;

const WHY: Record<Term, string> = {
	carattere: 'Un carattere è un segno della scrittura in astratto: è quello che ha un codice, uguale in ogni font.',
	glifo: 'Un glifo è un disegno di un carattere: lo stesso carattere ha un glifo diverso in ogni font.',
	font: 'Un font è il file con i glifi di un insieme di caratteri, nello stesso stile, e le misure per metterli in fila.',
	famiglia: 'Una famiglia di caratteri è l’insieme delle varianti dello stesso disegno: normale, grassetto, corsivo.',
	corpo: 'Il corpo è la dimensione del carattere: l’altezza dello spazio riservato a una riga di lettere.'
};

const LETTERS = 'ABCDEFGHKLMNPRSTUVZ'.split('');
/** The situations, each about one term; `§` is where the letter of the exercise goes. */
const SITUATIONS: [Term, string][] = [
	['carattere', 'In un messaggio la lettera § viaggia come un numero, lo stesso su ogni telefono. Che cosa indica quel numero?'],
	['carattere', 'Copi la lettera § da una pagina e la incolli in una chat: l’aspetto cambia, ma la lettera resta quella. Che cosa è passato da una parte all’altra?'],
	['carattere', 'La § maiuscola ha un codice, uguale in qualunque font la si scriva. Che cosa ha quel codice?'],
	['glifo', 'La § con i trattini alle estremità e la § tutta dritta hanno lo stesso codice. Che cosa sono, l’una rispetto all’altra, due disegni diversi della stessa lettera?'],
	['glifo', 'In un font a contorni la lettera § è descritta da una serie di punti uniti da tratti e curve. Che cosa descrivono quei punti?'],
	['glifo', 'In un font bitmap la lettera § è una griglia di pixel accesi o spenti. Che cos’è quella griglia?'],
	['font', 'Per mostrare la lettera § il programma cerca il suo disegno in un file che ha i disegni di tutte le lettere, nello stesso stile. Che cos’è quel file?'],
	['font', 'Un file contiene il disegno della § e di tutti gli altri caratteri in grassetto, con la larghezza di ciascuno. Che cos’è?'],
	['famiglia', 'La § normale, la § in grassetto e la § in corsivo hanno lo stesso disegno di base, e nel menu di un programma stanno sotto un solo nome. Che cosa indica quel nome?'],
	['famiglia', 'Scegli un nome nel menu dei caratteri, e poi decidi se la § la vuoi normale, in grassetto o in corsivo. Che cosa hai scelto con quel nome?'],
	['corpo', 'Porti la lettera § da 12 a 24 punti senza cambiare font. Che cosa hai cambiato?']
];

function level1(rng: Rng): CodeBuilt {
	const s = rng.int(0, SITUATIONS.length - 1);
	const letter = rng.pick(LETTERS);
	const [term, text] = SITUATIONS[s];
	const option = (t: Term) => textOption(TERMS[t], t);
	const answer = choose(
		rng,
		option(term),
		shuffle(
			rng,
			(Object.keys(TERMS) as Term[]).filter((t) => t !== term)
		).map(option)
	);
	return {
		prompt: 'Riconosci di che cosa si parla.',
		problem: text.replace(/§/g, letter),
		solution: rightLabel(answer),
		steps: [WHY[term], term === 'carattere' || term === 'glifo' ? 'Il carattere è la lettera in astratto, con il suo codice; il glifo è uno dei suoi disegni.' : WHY.glifo],
		answer,
		params: { case: term, situation: s, letter }
	};
}

// ---------------------------------------------------------------------------
// Level 2: bitmap fonts

const GLYPHS: [number, number][] = [
	[8, 8],
	[8, 16],
	[12, 24],
	[16, 16],
	[16, 24],
	[16, 32],
	[24, 24],
	[24, 48],
	[32, 32],
	[32, 64]
];
const COUNTS = [26, 52, 62, 95, 96, 100, 128, 200, 256];

function level2(rng: Rng): CodeBuilt {
	const [w, h] = rng.pick(GLYPHS);
	const roll = rng.next();
	const bits = w * h;
	if (roll < 0.2) {
		const answer = amounts(rng, bits / 8, [bits, (w + h) / 8, bits * 8, w, bits / 4, h], 'B');
		return {
			prompt: 'Conta i pixel, che qui sono bit, e passa ai byte.',
			problem: `In un font bitmap ogni glifo è una griglia di ${w} × ${h} pixel, a 1 bit per pixel. Quanti byte occupa un glifo?`,
			solution: rightLabel(answer),
			steps: [`I pixel sono ${w} · ${h} = ${bits}, e a 1 bit per pixel sono ${bits} bit.`, `Otto bit fanno un byte: ${bits} : 8 = ${bits / 8} B.`],
			answer,
			params: { case: 'glifo', w, h }
		};
	}
	if (roll < 0.7) {
		const n = rng.pick(COUNTS);
		const right = (n * bits) / 8;
		const answer = amounts(rng, right, [n * bits, bits / 8, right * 8 * 8, (n * (w + h)) / 8, n * w, right / 2, n * h], 'B');
		return {
			prompt: 'Prima un glifo, poi tutti.',
			problem: `Un font bitmap ha ${n} glifi, ciascuno una griglia di ${w} × ${h} pixel a 1 bit per pixel. Quanti byte occupano i glifi?`,
			solution: rightLabel(answer),
			steps: [`Un glifo ha ${w} · ${h} = ${bits} pixel, cioè ${bits} bit: ${bits} : 8 = ${bits / 8} B.`, `I glifi sono ${n}: ${n} · ${bits / 8} = ${it(right)} B.`],
			answer,
			params: { case: 'font', w, h, n }
		};
	}
	const k = rng.pick([2, 3, 4, 5, 6, 8]);
	const answer = amounts(rng, k * k, [k, 2 * k, k * h, h, k * k * 2, w * k], 'pixel');
	return {
		prompt: 'Pensa a che cosa diventa un solo pixel del disegno.',
		problem: `Un font bitmap ha i glifi disegnati su una griglia di ${w} × ${h} pixel. Una lettera viene mostrata alta ${h * k} pixel, e il font non ha un disegno per quella dimensione. Quanti pixel dello schermo occupa ogni pixel del disegno?`,
		solution: rightLabel(answer),
		steps: [`La lettera è alta ${h * k} : ${h} = ${k} volte il suo disegno.`, `Un font bitmap può solo ripetere i pixel: ogni pixel del disegno diventa un quadrato di ${k} × ${k}, cioè ${k * k} pixel dello schermo.`, 'Per questo ingrandendo si vedono gli scalini: un font a contorni ricalcolerebbe i pixel dal contorno.'],
		answer,
		params: { case: 'ingrandito', w, h, k }
	};
}

// ---------------------------------------------------------------------------
// Level 3: the three groups, and a row in a monospaced font

const ROWS = ['print(somma)', 'x = x + 1', 'for i in range(10):', 'if voto >= 6:', 'cout << media;', 'int n = 0;', 'while i < n:', 'totale = a + b', 'return 0;', 'nome = input()', 'i = i + 2', 'cin >> voto;'];
const GROUPS = { serif: 'serif', sans: 'sans-serif', mono: 'monospace' } as const;
type Group = keyof typeof GROUPS;
const LOOKS: [Group, string][] = [
	['serif', 'Le lettere di un font hanno piccoli tratti alle estremità delle aste.'],
	['serif', 'Un font ha le grazie, e ogni lettera ha la sua larghezza.'],
	['sans', 'Le lettere di un font hanno le estremità nette, senza trattini, e ogni lettera ha la sua larghezza.'],
	['sans', 'Un font non ha le grazie, e la i è più stretta della M.'],
	['mono', 'In un font la i e la M occupano la stessa larghezza.'],
	['mono', 'Con un font le colonne di un programma restano allineate, perché ogni carattere è largo quanto gli altri.']
];
const FIXED_TEXTS = ['il listato di un programma', 'una tabella di numeri messi in colonna con gli spazi', 'l’elenco dei file di una cartella, con le dimensioni in colonna', 'un disegno fatto di caratteri, riga sotto riga'];
const OTHER_TEXTS = ['il titolo di una locandina', 'un racconto di dieci pagine', 'il menu di una pizzeria', 'una lettera ai genitori', 'la didascalia di una fotografia', 'l’articolo di un giornalino', 'un invito a una festa'];

function level3(rng: Rng): CodeBuilt {
	const roll = rng.next();
	if (roll < 0.5) {
		const row = rng.pick(ROWS);
		const c = rng.pick([6, 7, 8, 9, 10, 12]);
		const n = row.length;
		const spaces = row.split(' ').length - 1;
		const answer = amounts(rng, n * c, [(n - spaces) * c, n + c, (n - 1) * c, n, (n + 1) * c, row.replace(/[^a-z]/gi, '').length * c], 'pixel');
		return {
			prompt: 'Conta tutti i caratteri della riga.',
			problem: `In un font a spaziatura fissa ogni carattere è largo ${c} pixel. Quanto è larga la riga qui sotto?`,
			listing: `${row}\n`,
			solution: rightLabel(answer),
			steps: [`La riga ha ${n} caratteri: contano anche ${spaces === 0 ? 'le parentesi e i segni' : spaces === 1 ? 'lo spazio e i segni' : `i ${spaces} spazi e i segni`}.`, `A spaziatura fissa ogni carattere occupa la stessa larghezza: ${n} · ${c} = ${n * c} pixel.`],
			answer,
			params: { case: 'larghezza', row, c }
		};
	}
	if (roll < 0.75) {
		const k = rng.int(0, LOOKS.length - 1);
		const [group, text] = LOOKS[k];
		const option = (g: string) => textOption(g);
		const answer = choose(rng, option(GROUPS[group]), [...shuffle(rng, Object.values(GROUPS).filter((g) => g !== GROUPS[group])), ...shuffle(rng, ['bold', 'italic', 'font-size'])].map(option));
		return {
			prompt: 'Guarda le estremità delle lettere e la loro larghezza.',
			problem: `${text} Con quale nome generico lo chiedi in una pagina web?`,
			solution: rightLabel(answer),
			steps: ['I font con le grazie si chiedono con serif, quelli senza grazie con sans-serif, quelli a spaziatura fissa con monospace.', 'Gli altri nomi non sono gruppi di font: riguardano il peso, il corsivo o il corpo.'],
			answer,
			params: { case: 'gruppo', look: k, group: GROUPS[group], wrong: answer.options.filter((_, i) => i !== answer.correct).map((o) => o.values[0]) }
		};
	}
	const right = rng.pick(FIXED_TEXTS);
	const others = shuffle(rng, OTHER_TEXTS).slice(0, 3);
	const answer = choose(rng, textOption(right), others.map((t) => textOption(t)));
	return {
		prompt: 'Cerca il testo in cui i caratteri devono restare in colonna.',
		problem: 'Per quale di questi testi serve un font a spaziatura fissa?',
		solution: rightLabel(answer),
		steps: ['Un font a spaziatura fissa dà a ogni carattere la stessa larghezza: serve dove i caratteri di una riga devono stare sotto quelli della riga prima.', 'Un testo da leggere di fila sta meglio in un font proporzionale, dove ogni lettera ha la sua larghezza.'],
		answer,
		params: { case: 'uso', right, others }
	};
}

// ---------------------------------------------------------------------------
// Level 4: size and line height

const SIZES = [10, 12, 14, 15, 16, 18, 20, 24, 28, 30, 32, 36, 40];
const HEIGHTS = ['1.2', '1.25', '1.4', '1.5', '1.6', '1.75', '2'];

function level4(rng: Rng): CodeBuilt {
	for (;;) {
		const size = rng.pick(SIZES);
		const lh = rng.pick(HEIGHTS);
		const gap = Math.round(size * Number(lh) * 1000) / 1000;
		if (!Number.isInteger(gap)) continue;
		const tag = rng.pick(['p', 'li', 'h2']);
		const listing = `${tag} {\n    font-size: ${size}px;\n    line-height: ${lh};\n}\n`;
		const rule = `Il corpo è ${size} pixel e l'interlinea ${lh.replace('.', ',')} volte il corpo: le linee di base distano ${size} · ${lh.replace('.', ',')} = ${gap} pixel.`;
		const roll = rng.next();
		if (roll < 0.35) {
			const answer = amounts(rng, gap, [size, size + Number(lh), gap - size, gap * 2, size / Number(lh), gap + size], 'pixel');
			return { prompt: 'Moltiplica il corpo per l’interlinea.', problem: 'Con la regola qui sotto, quanto distano le linee di base di due righe consecutive?', listing, solution: rightLabel(answer), steps: [rule, 'La distanza comprende le lettere: non è lo spazio vuoto tra una riga e l’altra.'], answer, params: { case: 'distanza', size, lh, tag } };
		}
		if (roll < 0.75) {
			const n = rng.int(2, 8);
			const answer = amounts(rng, n * gap, [n * size, gap, n * (gap - size), (n - 1) * gap, n * size + Number(lh), (n + 1) * gap], 'pixel');
			return {
				prompt: 'Trova l’altezza di una riga, poi moltiplica per le righe.',
				problem: `Con la regola qui sotto, quanto è alto un testo che occupa ${n} righe?`,
				listing,
				solution: rightLabel(answer),
				steps: [rule, `Ogni riga occupa ${gap} pixel in altezza: ${n} · ${gap} = ${n * gap} pixel.`],
				answer,
				params: { case: 'altezza', size, lh, tag, n }
			};
		}
		if (gap === size * 2) continue; // the extra room would be the size itself, and one wrong option the right one
		const answer = amounts(rng, gap - size, [gap, size, Number(lh), (gap - size) * 2, size / 2, gap + size], 'pixel');
		return {
			prompt: 'Togli il corpo dalla distanza tra le linee di base.',
			problem: 'Con la regola qui sotto, di quanti pixel la distanza tra due linee di base supera il corpo del carattere?',
			listing,
			solution: rightLabel(answer),
			steps: [rule, `Di questi, ${size} sono del carattere: lo spazio in più è ${gap} - ${size} = ${gap - size} pixel.`],
			answer,
			params: { case: 'spazio', size, lh, tag }
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: which font of the list the browser uses

/** Fonts by group, so that a list asks for fonts of one kind and ends with their generic name, as a real one does. */
const FONTS = {
	serif: ['Georgia', 'Times New Roman', 'Palatino', 'Garamond', 'Cambria'],
	'sans-serif': ['Verdana', 'Arial', 'Helvetica', 'Tahoma', 'Calibri'],
	monospace: ['Courier New', 'Consolas', 'Menlo', 'Monaco', 'Lucida Console']
} as const;
const GENERIC = { serif: 'il font con le grazie scelto dal dispositivo', 'sans-serif': 'il font senza grazie scelto dal dispositivo', monospace: 'il font a spaziatura fissa scelto dal dispositivo' } as const;
const NONE = 'nessuno: il testo non viene mostrato';
const written = (name: string) => (name.includes(' ') ? `"${name}"` : name);

function level5(rng: Rng): CodeBuilt {
	const kind = rng.next() < 0.25 ? 'primo' : rng.next() < 0.6 ? 'seguente' : 'generico';
	const generic = rng.pick(Object.keys(GENERIC) as (keyof typeof GENERIC)[]);
	const list = shuffle(rng, FONTS[generic]).slice(0, 3);
	// fonts the list does not name: the other two of its group and those of the other groups
	const rest = shuffle(
		rng,
		Object.values(FONTS)
			.flat()
			.filter((name) => !list.includes(name as never))
	);
	// what is installed: the font the browser ends up with, and others that are not before it in the list
	const at = kind === 'primo' ? 0 : kind === 'seguente' ? rng.int(1, 2) : 3;
	const installed = shuffle(rng, [...(at < 3 ? [list[at]] : []), ...list.slice(at + 1).filter(() => rng.next() < 0.5), ...rest.slice(0, at === 3 ? 2 : 1)]);
	const tag = rng.pick(['h1', 'p', 'body']);
	const listing = `${tag} {\n    font-family: ${[...list.map(written), generic].join(',\n        ')};\n}\n`;
	const right = at < 3 ? list[at] : GENERIC[generic];
	const answer = choose(
		rng,
		textOption(right),
		[list[0], NONE, ...shuffle(rng, [...list.slice(1), GENERIC[generic], ...installed.filter((name) => !list.includes(name))])].filter((label) => label !== right).map((label) => textOption(label))
	);
	return {
		prompt: 'Scorri l’elenco nell’ordine in cui è scritto.',
		problem: `Su un dispositivo sono installati questi font: ${installed.join(', ')}. Quale font usa il browser per l'elemento ${tag}, con la regola qui sotto?`,
		listing,
		solution: rightLabel(answer),
		steps: [
			'Il browser prova i nomi di font-family nell’ordine in cui sono scritti e usa il primo che trova installato.',
			at < 3 ? `${at === 0 ? `${list[0]} è il primo dell'elenco ed è installato` : `${list.slice(0, at).join(' e ')} non ${at === 1 ? 'è installato' : 'sono installati'}, ${list[at]} sì`}: il browser usa ${list[at]}.` : `Nessuno dei tre font dell'elenco è installato: il browser arriva al nome generico ${generic}, che c'è sempre.`,
			'Un font che manca viene saltato senza errori: il testo compare comunque.'
		],
		answer,
		params: { case: kind, list, generic, installed, tag }
	};
}

const worded = (sample: { params: Record<string, unknown> }) => (sample.params.program ? ['a level of fragments has no program'] : []);

export default makeCodeGenerator(ID, 'Caratteri tipografici e font', {
	1: { label: 'Carattere, glifo o font', constraints: ['a situation about one of the terms of the lesson', 'four of the five terms as options'], build: level1, check: worded },
	2: { label: 'Un font bitmap', constraints: ['glyphs at 1 bit per pixel', 'bytes of a glyph or of the font, or the square a pixel becomes'], build: level2, check: worded },
	3: { label: 'Le famiglie di caratteri', constraints: ['the width of a row in a monospaced font', 'the generic name of a group', 'the text that needs a monospaced font'], build: level3, check: worded },
	4: { label: 'Corpo e interlinea', constraints: ['a CSS rule with font-size and line-height', 'a whole number of pixels'], build: level4, check: worded },
	5: { label: 'Quale font usa il browser', constraints: ['a font-family list of three names and a generic one', 'the fonts installed on the device'], build: level5, check: worded }
});
