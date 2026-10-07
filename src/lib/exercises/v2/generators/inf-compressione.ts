/**
 * La compressione dei dati, con e senza perdita. Spec: specs/exercises/inf-compressione.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/84-inf-compressione.md), all multiple choice of
 * texts: 1. which compression a situation shows; 2. RLE by hand, encoding and decoding a row of pixels; 3. the bytes
 * of the code (two per run) and whether it is worth it; 4. the compression ratio, built backwards; 5. codes of
 * different lengths, counting the bits and reading a sequence; 6. statements about compressing twice and about loss.
 */
import type { Rng } from '../types';
import { choose, makeGenerator, shuffle, textOption, type Built } from '../inf-programmi';
import { asked, sortLevel, statementLevel, type Statement } from '../inf-sic';

export const ID = 'inf-compressione';

// ---------------------------------------------------------------------------
// Level 1: which compression

const KINDS = {
	senza: 'Una compressione senza perdita',
	con: 'Una compressione con perdita',
	decompressione: 'Una decompressione',
	nessuna: 'Nessuna compressione'
} as const;
type Kind = keyof typeof KINDS;

const SCENES: [Kind, (N: string) => string][] = [
	['senza', (N) => `${N} mette la tesina e i suoi dati in un archivio: l'archivio occupa meno, e quando verrà aperto i file saranno identici, bit per bit.`],
	['senza', (N) => `${N} salva una schermata in un formato che la rimpicciolisce e conserva il colore esatto di ogni pixel.`],
	['senza', (N) => `Il programma di ${N} riscrive una riga di pixel come 6B4N4R2B, da cui la riga si può ricostruire esattamente.`],
	['senza', (N) => `${N} sostituisce in un testo ogni pezzo ripetuto con un numero e conserva il dizionario, così da poter riavere il testo esatto.`],
	['con', (N) => `${N} esporta una foto scegliendo "qualità 60": il file è dieci volte più piccolo e alcuni dettagli fini non ci sono più.`],
	['con', (N) => `${N} salva una canzone in un formato che elimina i suoni coperti da altri più forti.`],
	['con', (N) => `${N} carica un video: il sito lo riduce a un ventesimo, e guardando da vicino si notano dei blocchi quadrati.`],
	['con', (N) => `${N} registra un messaggio vocale: l'app ne tiene solo la parte che l'orecchio percepisce meglio.`],
	['decompressione', (N) => `${N} apre un archivio ricevuto per posta e ne tira fuori i file, pronti da usare.`],
	['decompressione', (N) => `Il lettore musicale di ${N} legge un brano compresso e ne ricava i campioni da mandare alle cuffie.`],
	['decompressione', (N) => `Il programma di ${N} legge 3N10B3N e scrive tre N, dieci B e tre N.`],
	['decompressione', (N) => `Il telefono di ${N} apre una foto compressa e ricalcola i colori dei pixel da mostrare.`],
	['nessuna', (N) => `${N} salva un'immagine scrivendo nel file, uno dopo l'altro, i tre byte di ogni pixel.`],
	['nessuna', (N) => `${N} registra un suono e il programma scrive nel file tutti i campioni, così come sono stati misurati.`],
	['nessuna', (N) => `${N} rinomina il file gita.bmp in gita.zip, senza fare altro.`],
	['nessuna', (N) => `${N} copia una cartella su una chiavetta: i file arrivano con gli stessi byte, nello stesso numero.`]
];
const KIND_WHY: Record<Kind, string> = {
	senza: 'I dati occupano meno e si possono riavere esatti: è una compressione senza perdita, che toglie solo la ridondanza.',
	con: 'Una parte dei dati viene buttata via per sempre, scelta tra ciò che occhio e orecchio notano meno: è una compressione con perdita.',
	decompressione: 'Dai dati compressi si ricavano quelli da usare: è una decompressione, il procedimento inverso della compressione.',
	nessuna: 'I dati sono scritti così come sono, con tutti i loro byte: non c\'è nessuna compressione. Cambiare nome a un file o copiarlo non lo comprime.'
};

// ---------------------------------------------------------------------------
// Rows of pixels and their runs

const LETTERS = ['B', 'N', 'R', 'V'] as const;
type Run = [number, string];

/** `count` runs of the given lengths' range, no two neighbours of the same letter. */
function runs(rng: Rng, count: number, min: number, max: number): Run[] {
	const out: Run[] = [];
	for (let i = 0; i < count; i++) {
		const letter = rng.pick(LETTERS.filter((l) => l !== out[i - 1]?.[1]));
		out.push([rng.int(min, max), letter]);
	}
	return out;
}
const rowOf = (rs: Run[]) => rs.map(([n, l]) => l.repeat(n)).join('');
const codeOf = (rs: Run[]) => rs.map(([n, l]) => `${n}${l}`).join('');

// ---------------------------------------------------------------------------
// Level 2: RLE by hand

function level2(rng: Rng): Built {
	// runs of at most 9, so that a code is pairs of one digit and one letter; at least one run is longer than 1
	let rs: Run[];
	do rs = runs(rng, rng.int(3, 5), 1, 6);
	while (rowOf(rs).length > 18 || rs.every(([n]) => n === 1) || new Set(rs.map(([n]) => n)).size < 2);
	const row = rowOf(rs), code = codeOf(rs);
	if (rng.next() < 0.5) {
		const totals = LETTERS.filter((l) => row.includes(l)).map((l) => `${[...row].filter((c) => c === l).length}${l}`).join('');
		const wrong = [
			rs.map(([n, l]) => `${l}${n}`).join(''), // the letter before the count
			codeOf(rs.slice(0, -1)), // the last run forgotten
			totals, // the pixels of each colour counted all together
			codeOf(rs.map(([n, l], i) => [i === 0 ? n + 1 : n, l] as Run)),
			codeOf(rs.map(([n, l]) => [n + 1, l] as Run))
		];
		const answer = choose(rng, textOption(code), wrong.map((w) => textOption(w)));
		return asked('Codifica la riga con RLE.', `Una riga di pixel è scritta con le lettere dei colori: ${row}. Qual è la sua codifica RLE, con il numero prima della lettera?`, answer, [`Si contano i pixel uguali di fila, una sequenza alla volta: ${rs.map(([n, l]) => `${n} ${l}`).join(', ')}.`, `Per ogni sequenza si scrive il numero e poi la lettera: ${code}. L'ultima sequenza va scritta come le altre.`], { case: 'codifica', row, code });
	}
	const wrong = [
		rowOf(rs.map(([, l], i) => [rs[(i + 1) % rs.length][0], l] as Run)), // each count given to the wrong letter
		rowOf(rs.slice(0, -1)),
		rs.map(([, l]) => l).join(''), // the letters only
		rowOf(rs.map(([n, l]) => [n + 1, l] as Run)),
		rowOf(rs.map(([n, l], i) => [i === rs.length - 1 ? n + 1 : n, l] as Run))
	];
	const answer = choose(rng, textOption(row), wrong.map((w) => textOption(w)));
	return asked('Decodifica una riga scritta con RLE.', `La codifica RLE di una riga di pixel è ${code}, con il numero prima della lettera. Qual è la riga?`, answer, [`Si legge una coppia alla volta: ${rs.map(([n, l]) => `${n} volte ${l}`).join(', ')}.`, `La riga ha ${rs.map(([n]) => n).join(' + ')} = ${row.length} pixel: ${row}.`], { case: 'decodifica', row, code });
}

// ---------------------------------------------------------------------------
// Level 3: the bytes of the code

function level3(rng: Rng): Built {
	const count = rng.int(2, 9);
	let rs: Run[];
	do rs = runs(rng, count, 1, count > 6 ? 3 : 7);
	while (rowOf(rs).length < 8 || rowOf(rs).length > 20 || rowOf(rs).length === 2 * count);
	const row = rowOf(rs), n = row.length, bytes = 2 * count;
	const MODEL = 'Ogni pixel della riga occupa un byte; nella codifica RLE ogni sequenza occupa due byte, uno per il numero e uno per il colore.';
	if (rng.next() < 0.5) {
		const b = (x: number) => textOption(`${x} byte`, `${x}`);
		const answer = choose(rng, b(bytes), [b(count), b(n), b(2 * n), b(count + 2), b(bytes + 2), b(bytes - 1)].filter((o) => o.values[0] !== '0'));
		return asked('Calcola i byte della codifica RLE.', `Una riga di pixel è ${row}. ${MODEL} Quanti byte occupa la codifica RLE della riga?`, answer, [`Le sequenze di pixel uguali sono ${count}: ${rs.map(([k, l]) => `${k} ${l}`).join(', ')}.`, `Ogni sequenza occupa due byte: $${count} \\cdot 2 = ${bytes}$ byte. La riga, con i suoi ${n} pixel, ne occupa ${n}.`], { case: 'byte', row, runs: count, bytes });
	}
	const better = bytes < n;
	const o = (id: string, text: string) => textOption(text, id);
	const options = {
		si: o('si', `Sì: la codifica occupa ${bytes} byte, la riga ${n}`),
		no: o('no', `No: la codifica occupa ${bytes} byte, la riga ${n}`),
		siHalf: o('si-meta', `Sì: la codifica occupa ${count} byte, la riga ${n}`),
		noDouble: o('no-doppio', `No: la codifica occupa ${2 * n} byte, la riga ${n}`),
		always: o('sempre', 'Sì: una compressione senza perdita accorcia sempre i dati'),
		same: o('uguale', `È indifferente: occupano tutte e due ${n} byte`)
	};
	const answer = choose(rng, better ? options.si : options.no, better ? [options.no, options.noDouble, options.same] : [options.si, options.always, options.siHalf]);
	return asked('Decidi se RLE conviene.', `Una riga di pixel è ${row}. ${MODEL} Conviene codificare questa riga con RLE?`, answer, [`Le sequenze sono ${count}, quindi la codifica occupa $${count} \\cdot 2 = ${bytes}$ byte. La riga ha ${n} pixel e occupa ${n} byte.`, better ? `$${bytes} < ${n}$: la codifica è più corta, e conviene.` : `$${bytes} > ${n}$: la codifica è più lunga della riga. Con sequenze così corte RLE allunga i dati.`], { case: better ? 'conviene' : 'non conviene', row, runs: count, bytes });
}

// ---------------------------------------------------------------------------
// Level 4: the compression ratio

const THINGS = ['Una foto non compressa', 'Un brano non compresso', 'Un video non compresso', 'Una schermata non compressa', 'Una registrazione non compressa', 'Un disegno non compresso'];
const UNITS = ['kB', 'MB', 'GB'];

function level4(rng: Rng): Built {
	const thing = rng.pick(THINGS), unit = rng.pick(UNITS);
	const prompt = 'Calcola con il rapporto di compressione.';
	const size = (x: number) => textOption(`$${x}$ ${unit}`, `${x}`);
	const ratio = (x: number) => textOption(`$${x} : 1$`, `${x}`);
	const which = rng.next();
	if (which < 0.4) {
		const r = rng.pick([2, 3, 4, 5, 6, 8, 12, 15, 20, 25]);
		let c: number;
		do c = rng.int(2, 30);
		while (c === r || c * r - c === r || c * r === r * r);
		const original = r * c;
		const answer = choose(rng, ratio(r), [ratio(c), ratio(original - c), ratio(original * c), ratio(r + 1), ratio(r * 2)]);
		return asked(prompt, `${thing} occupa $${original}$ ${unit}; dopo la compressione occupa $${c}$ ${unit}. Qual è il rapporto di compressione?`, answer, ['Il rapporto di compressione è la dimensione originale divisa per la dimensione compressa.', `$${original} : ${c} = ${r}$, cioè $${r} : 1$: ${r} byte dell'originale per ogni byte del file compresso.`], { case: 'rapporto', original, compressed: c, ratio: r, unit });
	}
	if (which < 0.75) {
		const r = rng.pick([2, 4, 5, 8, 10, 12, 20, 25]);
		let c: number;
		do c = rng.int(2, 40);
		while (c === r || r * c - r === c);
		const original = r * c;
		const answer = choose(rng, size(c), [size(original * r), size(original - r), size(r), size(c * 2), size(c + r)]);
		return asked(prompt, `Un file non compresso occupa $${original}$ ${unit} e viene compresso con rapporto $${r} : 1$. Quanto occupa il file compresso?`, answer, ['La dimensione compressa è la dimensione originale divisa per il rapporto.', `$${original} : ${r} = ${c}$ ${unit}.`], { case: 'compressa', original, compressed: c, ratio: r, unit });
	}
	const [r, pct] = rng.pick([[2, 50], [4, 25], [5, 20], [10, 10], [20, 5], [25, 4], [50, 2]] as const);
	const saved = rng.next() < 0.5;
	const right = saved ? 100 - pct : pct;
	// l'1%, l'8%, l'11%, l'80%: the article follows the sound of the number
	const p = (x: number) => textOption(`${x === 1 || x === 8 || x === 11 || (x >= 80 && x < 90) ? "L'" : 'Il '}$${x}\\%$`, `${x}`);
	const answer = choose(rng, p(right), [p(r), p(saved ? pct : 100 - pct), p(100 - r), p(r * 2), p(1), p(75), p(90)].filter((o) => o.values[0] !== `${right}`));
	return asked(prompt, saved ? `Un file viene compresso con rapporto $${r} : 1$. Quale percentuale dello spazio si risparmia?` : `Un file viene compresso con rapporto $${r} : 1$. Quale percentuale della dimensione originale occupa il file compresso?`, answer, [`Con rapporto $${r} : 1$ il file compresso è $1 : ${r}$ dell'originale, cioè il $${pct}\\%$.`, saved ? `Lo spazio risparmiato è il resto: $100\\% - ${pct}\\% = ${100 - pct}\\%$.` : `Il rapporto non è una percentuale: $${r} : 1$ non vuol dire il $${r}\\%$.`], { case: saved ? 'risparmio' : 'percentuale', ratio: r });
}

// ---------------------------------------------------------------------------
// Level 5: codes of different lengths

const CODES = ['0', '10', '110', '111'];

function level5(rng: Rng): Built {
	const letters = shuffle(rng, LETTERS);
	const table = letters.map((l, i) => `${l} = ${CODES[i]}`).join(', ');
	if (rng.next() < 0.55) {
		// counts that go down, so that the shortest code goes to the most frequent colour
		let counts: number[];
		do counts = [rng.int(6, 14), rng.int(3, 6), rng.int(1, 4), rng.int(1, 3)].sort((a, b) => b - a);
		while (counts[0] === counts[1]);
		const n = counts.reduce((s, x) => s + x, 0);
		const bits = counts.reduce((s, x, i) => s + x * CODES[i].length, 0);
		const b = (x: number) => textOption(`${x} bit`, `${x}`);
		const answer = choose(rng, b(bits), [b(2 * n), b(n), b(3 * n), b(bits + counts[3]), b(bits - counts[0]), b(bits + 1)]);
		return asked('Conta i bit con i codici di lunghezza diversa.', `Una riga di ${n} pixel ha ${counts.map((c, i) => `${c} pixel ${letters[i]}`).join(', ')}. I colori sono scritti con i codici ${table}. Quanti bit occupa la riga?`, answer, [`Ogni colore conta per il numero dei suoi pixel moltiplicato per la lunghezza del suo codice: $${counts.map((c, i) => `${c} \\cdot ${CODES[i].length}`).join(' + ')} = ${bits}$ bit.`, `Con un codice fisso di 2 bit per pixel sarebbero stati $${n} \\cdot 2 = ${2 * n}$ bit.`], { case: 'bit', letters, counts, bits });
	}
	let seq: number[];
	do seq = Array.from({ length: rng.int(3, 5) }, () => rng.int(0, 3));
	while (new Set(seq).size < 2 || seq.every((i) => i === 0 || i === 3));
	const bits = seq.map((i) => CODES[i]).join('');
	const say = (xs: number[]) => xs.map((i) => letters[i]).join(', ');
	// read with a fixed length of two bits, as a student who forgets the codes are of different lengths would
	const pairs = bits.match(/.{1,2}/g)!.map((p) => ['00', '01', '10', '11'].indexOf(p.padEnd(2, '0')));
	const wrong = [say(pairs), say([...seq].reverse()), say(seq.slice(0, -1)), say(seq.map((i) => (i + 1) % 4)), say(seq.map((i) => (i + 2) % 4)), say([...seq, 0])];
	const answer = choose(rng, textOption(say(seq)), wrong.map((w) => textOption(w)));
	return asked('Leggi una sequenza di bit scritta con codici di lunghezza diversa.', `I colori sono scritti con i codici ${table}. Quali pixel corrispondono ai bit ${bits}?`, answer, [`Nessun codice è l'inizio di un altro, quindi i bit si dividono in un modo solo: ${seq.map((i) => CODES[i]).join(', ')}.`, `Sono i pixel ${say(seq)}.`], { case: 'leggi', letters, bits, pixels: seq.map((i) => letters[i]) });
}

// ---------------------------------------------------------------------------
// Level 6: statements

const TRUE: Statement[] = [
	{ id: 't-originale', text: "Conviene conservare l'originale e comprimere con perdita una volta sola, alla fine", why: "È vero: ogni salvataggio con perdita butta via qualcosa, e dall'originale si può sempre ripartire." },
	{ id: 't-zip-foto', text: 'Mettere delle foto JPEG in un archivio ZIP non le rimpicciolisce di molto', why: 'È vero: le foto sono già compresse, e non resta ridondanza da togliere.' },
	{ id: 't-due-volte', text: 'Comprimere due volte senza perdita può allungare i dati', why: 'È vero: la prima passata ha tolto la ridondanza, e la seconda non ne trova più. Con RLE, 6B4N diventa 161B141N.' },
	{ id: 't-testo', text: 'Un programma si comprime solo senza perdita', why: 'È vero: un carattere diverso cambia il programma. La perdita si accetta solo per ciò che si guarda o si ascolta.' },
	{ id: 't-salvataggi', text: 'Una foto salvata più volte con perdita peggiora a ogni salvataggio', why: 'È vero: a ogni salvataggio la compressione riparte e butta via ancora qualcosa.' },
	{ id: 't-non-tutto', text: 'Nessuna compressione senza perdita riesce ad accorciare ogni file', why: 'È vero: se ogni file diventasse più corto, due file diversi finirebbero nello stesso file compresso.' },
	{ id: 't-qualita', text: 'Con la perdita, quanto comprimere lo decide chi salva, scegliendo la qualità', why: 'È vero: più bassa è la qualità, più dati vengono buttati via e più piccolo è il file.' },
	{ id: 't-rapporto-minore', text: 'Un rapporto di compressione minore di 1 vuol dire che i dati si sono allungati', why: 'È vero: il rapporto è originale diviso compresso, ed è minore di 1 quando il compresso è più grande.' }
];
const FALSE: Statement[] = [
	{ id: 'f-torna', text: "Decomprimendo un file compresso con perdita si riottiene l'originale", why: 'I dati buttati via da una compressione con perdita non si recuperano.' },
	{ id: 'f-wav', text: 'Convertire un MP3 in un formato senza perdita gli restituisce la qualità originale', why: 'La conversione produce un file più grande con la qualità di prima.' },
	{ id: 'f-sempre', text: 'RLE accorcia qualunque riga di pixel', why: 'Con sequenze di un pixel solo RLE raddoppia i dati.' },
	{ id: 'f-zip', text: 'Comprimere dieci volte lo stesso archivio lo rende ogni volta più piccolo', why: 'Dopo la prima passata non resta ridondanza da togliere.' },
	{ id: 'f-testo', text: 'Per un testo va bene una compressione con perdita, se la perdita è piccola', why: 'Una lettera cambiata cambia il testo.' },
	{ id: 'f-percento', text: 'Un rapporto di compressione 4 : 1 vuol dire che resta il 4% dei dati', why: 'Con 4 : 1 resta un quarto, cioè il 25%.' },
	{ id: 'f-senza-qualita', text: 'Una compressione senza perdita abbassa un poco la qualità di una foto', why: 'Senza perdita ogni pixel torna identico.' },
	{ id: 'f-casuale', text: 'Una compressione con perdita butta via dei dati scelti a caso', why: 'Butta via per primo quello che occhio e orecchio percepiscono meno.' },
	{ id: 'f-frequente', text: 'Con i codici di lunghezza diversa il valore più frequente riceve il codice più lungo', why: 'Il valore più frequente riceve il codice più corto.' }
];

export default makeGenerator(ID, 'La compressione dei dati, con e senza perdita', {
	1: { label: 'Che compressione è', constraints: ['a scene with a name; options: without loss, with loss, a decompression, no compression', 'the four answers about a quarter each'], build: (rng) => sortLevel(rng, 'Riconosci che cosa succede ai dati.', 'Che cosa è avvenuto?', KINDS, SCENES, KIND_WHY) },
	2: { label: 'RLE a mano', constraints: ['a row of 3 to 5 runs of 1 to 6 pixels, at most 18 pixels, counts not all equal', 'half: the code of the row; half: the row of the code', 'wrong options: letter before the count, last run forgotten, colours counted all together, counts shifted'], build: level2 },
	3: { label: 'Quanti byte, e conviene?', constraints: ['a row of 2 to 9 runs, 8 to 20 pixels, never exactly two pixels per run', 'one byte per pixel, two bytes per run', 'half: the bytes of the code; half: whether the code is shorter than the row'], build: level3 },
	4: { label: 'Il rapporto di compressione', constraints: ['built backwards from the ratio and the compressed size, whole numbers', 'the ratio from the two sizes; the compressed size from the ratio; the percentage left or saved'], build: level4 },
	5: { label: 'Codici di lunghezza diversa', constraints: ['the codes 0, 10, 110, 111 given to the four colours in a drawn order', 'the bits of a row from the counts of its colours; or the pixels of a sequence of bits'], build: level5 },
	6: { label: 'Comprimere due volte', constraints: ['one true statement among three false ones, or one false among three true'], build: (rng) => statementLevel(rng, 'Ragiona su che cosa fa una compressione.', 'sulla compressione', TRUE, FALSE) }
});
