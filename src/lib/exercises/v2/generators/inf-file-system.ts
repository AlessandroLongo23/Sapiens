/**
 * Il file system: file, cartelle e percorsi. Spec: specs/exercises/inf-file-system.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/22-inf-file-system.md): the type of a file from its
 * extension; the absolute path of a file in a generated tree; the absolute path from a relative one, first going
 * down only, then with `..`; the path after a copy, a move or a renaming; the size of a folder and how many files
 * fit in a given space. Paths are written with the slash from the root `/` or with the backslash from `C:\`, half
 * each. Levels 1 to 5 are multiple choice (the answers are names and paths), level 6 has a number answer.
 */
import type { ChoiceOption, Rng, Sample } from '../types';
import { choose, frac, makeGenerator, numTex, numberAnswer, opt, pathOpt, pw, shuffle, textBlock, tt, withUnit, wrapText, type Built } from '../inf-so';

export const ID = 'inf-file-system';

/** The widest path that fits an answer button on a phone. */
export const MAX_PATH = 28;

// ---------------------------------------------------------------------------
// Names and paths

// Short names, so that every path of the options fits the button: users of 3 letters, folders of 4, files of 8.
const USERS = ['ada', 'leo', 'eva', 'ugo', 'ivo', 'lia'];
const FOLDERS = ['temi', 'foto', 'note', 'arte', 'rock', 'jazz', 'gite', 'mare', 'voti', 'film', 'cori', 'casa'];
const FILES = ['tema.odt', 'gita.jpg', 'voti.ods', 'note.txt', 'logo.png', 'coro.mp3', 'film.mp4', 'rime.odt', 'menu.pdf', 'nomi.txt', 'luna.jpg', 'inno.mp3'];
const TOPS = ['scuola', 'giochi', 'musica', 'lavoro'];

type Style = 'slash' | 'backslash';
const rootOf = (s: Style) => (s === 'slash' ? '/' : 'C:\\');
const sep = (s: Style) => (s === 'slash' ? '/' : '\\');
/** The absolute path of the segments under the root, and a relative path. */
const abs = (s: Style, segs: string[]) => rootOf(s) + segs.join(sep(s));
const rel = (s: Style, segs: string[]) => segs.join(sep(s));
const inline = (path: string) => `$${tt(path)}$`;
const pickStyle = (rng: Rng): Style => (rng.next() < 0.5 ? 'slash' : 'backslash');
/**
 * Two folders the exercise lives under, as long as each other in the two notations: /home/ada and /home/leo with the
 * slash, C:\scuola and C:\giochi with the backslash.
 */
function bases(rng: Rng, s: Style): [string[], string[]] {
	if (s === 'slash') {
		const [u, v] = shuffle(rng, USERS);
		return [
			['home', u],
			['home', v],
		];
	}
	const [t1, t2] = shuffle(rng, TOPS);
	return [[t1], [t2]];
}

/** The right path and the wrong ones that fit the button, as a choice. */
function pathChoice(rng: Rng, right: string, wrong: string[]) {
	if (right.length > MAX_PATH) throw new Error('path too long');
	return choose(
		rng,
		pathOpt(right),
		wrong.filter((w) => w.length <= MAX_PATH && w.length > 0).map(pathOpt),
	);
}

const pathCheck = (sample: Sample): string[] => {
	if (sample.answer.kind !== 'choice') return ['la risposta deve essere una scelta'];
	return sample.answer.options.some((o) => o.values[0].length > MAX_PATH) ? [`percorso più lungo di ${MAX_PATH} caratteri`] : [];
};

// ---------------------------------------------------------------------------
// Level 1: names and extensions

export const TYPES: Record<string, { label: string; exts: string[] }> = {
	testo: { label: 'Un documento di testo', exts: ['txt', 'odt', 'docx', 'pdf'] },
	foglio: { label: 'Un foglio di calcolo', exts: ['ods', 'xlsx'] },
	presentazione: { label: 'Una presentazione', exts: ['odp', 'pptx'] },
	immagine: { label: "Un'immagine", exts: ['jpg', 'png', 'gif'] },
	audio: { label: 'Un file audio', exts: ['mp3', 'wav'] },
	video: { label: 'Un video', exts: ['mp4', 'avi'] },
	web: { label: 'Una pagina web', exts: ['html'] },
	archivio: { label: 'Un archivio compresso', exts: ['zip'] },
	programma: { label: 'Un programma eseguibile', exts: ['exe'] },
};
/** Base names, with the type each one suggests (the trap: the type is read from the extension). */
const BASES: [string, string | null][] = [
	['musica', 'audio'],
	['foto', 'immagine'],
	['video', 'video'],
	['tema', 'testo'],
	['relazione', 'testo'],
	['appunti', 'testo'],
	['gita', 'immagine'],
	['voti', 'foglio'],
	['progetto', null],
	['canzone', 'audio'],
	['film', 'video'],
	['disegno', 'immagine'],
	['tabella', 'foglio'],
	['sito', 'web'],
	['slide', 'presentazione'],
	['dati', null],
];
const MIDDLES = ['v2', 'finale', '2026', 'mare', 'copia'];

function level1(rng: Rng): Built {
	const [base, hint] = rng.pick(BASES);
	const type = rng.pick(Object.keys(TYPES));
	const ext = rng.pick(TYPES[type].exts);
	const askExt = rng.next() < 0.25;
	const middle = askExt || rng.next() < 0.3 ? rng.pick(MIDDLES) : '';
	const name = `${base}${middle ? `.${middle}` : ''}.${ext}`;
	if (askExt) {
		const o = (s: string): ChoiceOption => ({ latex: tt(s), values: [s] });
		return {
			prompt: "Trova l'estensione del file.",
			problem: textBlock(`Qual è l'estensione del file ${inline(name)}?`),
			solution: tt(`.${ext}`),
			steps: [textBlock(`L'estensione è quello che viene dopo l'ultimo punto del nome: ${inline(`.${ext}`)}.`)],
			answer: choose(rng, o(`.${ext}`), shuffle(rng, [`.${middle}.${ext}`, `.${middle}`, base, `${base}.${middle}`]).map(o)),
			params: { case: 'estensione', name },
		};
	}
	const others = shuffle(
		rng,
		Object.keys(TYPES).filter((k) => k !== type && k !== hint),
	);
	const o = (k: string) => opt(TYPES[k].label, k);
	return {
		prompt: 'Riconosci il tipo di file dal nome.',
		problem: textBlock(`Che tipo di file è ${inline(name)}?`),
		solution: wrapText(TYPES[type].label),
		steps: [textBlock(`Il tipo si legge dall'estensione, cioè da quello che viene dopo l'ultimo punto: ${inline(`.${ext}`)}.`), textBlock(`${TYPES[type].label} ha estensione ${inline(`.${ext}`)}: il resto del nome non conta.`)],
		answer: choose(rng, o(type), [...(hint && hint !== type ? [hint] : []), ...others].map(o)),
		params: { case: 'tipo', name },
	};
}

// ---------------------------------------------------------------------------
// Level 2: from the tree to the absolute path

function level2(rng: Rng): Built {
	const s = pickStyle(rng);
	const [base] = bases(rng, s);
	const [A, B, C] = shuffle(rng, FOLDERS);
	const [f1, f2, f3] = shuffle(rng, FILES);
	const deep = rng.next() < 0.5;
	const d = base.length;
	const lines: [number, string][] = [[0, rootOf(s)], ...base.map((x, i): [number, string] => [i + 1, x]), [d + 1, A]];
	const targets: string[][] = [
		[...base, A, f2],
		[...base, B, f3],
	];
	if (deep) {
		lines.push([d + 2, C], [d + 3, f1]);
		targets.push([...base, A, C, f1]);
	}
	lines.push([d + 2, f2], [d + 1, B], [d + 2, f3]);
	const T = rng.pick(targets);
	const file = T[T.length - 1];
	const swapped = T.map((x) => (x === A ? B : x === B ? A : x));
	const wrong = shuffle(rng, [rel(s, T), abs(s, T.slice(1)), abs(s, [...base, file]), abs(s, swapped), T.length === d + 3 ? abs(s, [...base, A, f1]) : abs(s, [...base, A, C, file]), abs(s, [file]), abs(s, T.slice(0, -1))]);
	const tree = `\\begin{array}{l} ${lines.map(([depth, name]) => `${'\\quad '.repeat(depth)}${tt(name)}`).join(' \\\\ ')} \\end{array}`;
	return {
		prompt: "Scrivi il percorso assoluto leggendo l'albero.",
		problem: textBlock(`Nell'albero ogni nome sta dentro la cartella che lo precede con un rientro in meno. Qual è il percorso assoluto del file ${inline(file)}?`, 46, [tree]),
		solution: tt(abs(s, T)),
		steps: [textBlock(`Si parte dalla radice ${inline(rootOf(s))} e si scende fino al file: ${T.map(inline).join(', ')}.`), textBlock(`I nomi si separano con la barra${s === 'slash' ? '' : ' rovesciata'}: ${inline(abs(s, T))}.`)],
		answer: pathChoice(rng, abs(s, T), wrong),
		params: { case: s, deep },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: from a relative path to the absolute one

function level3(rng: Rng): Built {
	const s = pickStyle(rng);
	const [base] = bases(rng, s);
	const [A, C] = shuffle(rng, FOLDERS);
	const file = rng.pick(FILES);
	// the current folder is a prefix of the target; the relative path has one or two folders and the file
	const T = rng.next() < 0.5 ? [...base, A, C, file] : [...base, A, file];
	const cut = rng.int(base.length, T.length - 2);
	const cur = T.slice(0, cut);
	const r = T.slice(cut);
	const wrong = shuffle(rng, [abs(s, r), abs(s, [...cur.slice(0, -1), ...r]), abs(s, [...cur, ...r.slice(1)]), rel(s, [...cur, ...r]), abs(s, [...cur, ...r.slice(0, -1)]), abs(s, [cur[0], ...r])]);
	return {
		prompt: 'Trasforma il percorso relativo in assoluto.',
		problem: textBlock(`La cartella corrente è ${inline(abs(s, cur))}. Qual è il percorso assoluto di ${inline(rel(s, r))}?`),
		solution: tt(abs(s, T)),
		steps: [textBlock(`Si parte dal percorso della cartella corrente, ${inline(abs(s, cur))}.`), textBlock(`Si aggiungono in fondo, uno alla volta, i nomi del percorso relativo: ${r.map(inline).join(', ')}.`), textBlock(`Il percorso assoluto è ${inline(abs(s, T))}.`)],
		answer: pathChoice(rng, abs(s, T), wrong),
		params: { case: s, cur, rel: r },
	};
}

function level4(rng: Rng): Built {
	const s = pickStyle(rng);
	const [base, other] = bases(rng, s);
	const [A, B, C] = shuffle(rng, FOLDERS);
	const file = rng.pick(FILES);
	const shapes: [string[], string[]][] = [
		[[...base, A], [...base, B, file]], // one level up, then down
		[[...base, A, C], [...base, A, file]], // one level up
		[[...base, A], [...base, file]], // one level up
		[[...base, A, C], [...base, B, file]], // two levels up
	];
	// two levels up into the folder of another user: with the backslash the wrong paths would not fit the button
	if (s === 'slash') shapes.push([[...base, A], [...other, B, file]]);
	const [cur, T] = rng.pick(shapes);
	let p = 0;
	while (cur[p] === T[p]) p++;
	const ups = cur.length - p;
	const rest = T.slice(p);
	const r = [...Array(ups).fill('..'), ...rest];
	const wrong = [
		abs(s, [...cur, ...rest]),
		...shuffle(rng, [abs(s, [...cur.slice(0, p + 1), ...rest]), ...(p >= 1 ? [abs(s, [...cur.slice(0, p - 1), ...rest])] : []), abs(s, rest), abs(s, [...cur, ...r]), abs(s, T.slice(0, -1)), abs(s, [...cur.slice(0, p), file]), rel(s, T)]),
	];
	const removed = cur.slice(p).reverse();
	return {
		prompt: 'Trasforma il percorso relativo in assoluto.',
		problem: textBlock(`La cartella corrente è ${inline(abs(s, cur))}. Qual è il percorso assoluto di ${inline(rel(s, r))}?`),
		solution: tt(abs(s, T)),
		steps: [
			textBlock(`Si parte da ${inline(abs(s, cur))}.`),
			textBlock(`${ups === 1 ? 'Il pezzo' : `Ognuno dei ${ups} pezzi`} ${inline('..')} toglie l'ultima cartella: ${ups === 1 ? `si toglie ${inline(removed[0])}` : `si tolgono ${removed.map(inline).join(' e ')}`}, e resta ${inline(abs(s, cur.slice(0, p)))}.`),
			textBlock(`${rest.length === 1 ? 'Poi si aggiunge' : 'Poi si aggiungono'} ${rest.map(inline).join(', ')}: il percorso assoluto è ${inline(abs(s, T))}.`),
		],
		answer: pathChoice(rng, abs(s, T), wrong),
		params: { case: `${ups} livelli`, style: s, cur, rel: r },
	};
}

// ---------------------------------------------------------------------------
// Level 5: copy, move, rename

function level5(rng: Rng): Built {
	const s = pickStyle(rng);
	const [base] = bases(rng, s);
	const [A, B] = shuffle(rng, FOLDERS);
	const [f, other] = shuffle(rng, FILES);
	const g = `${other.split('.')[0]}.${f.split('.')[1]}`; // the new name keeps the extension
	const at = (folder: string[], name: string) => abs(s, [...base, ...folder, name]);
	const src = at([A], f);
	const dst = abs(s, [...base, B]);
	const kind = rng.pick(['sposta', 'rinomina', 'copia', 'originale', 'sposta e rinomina'] as const);
	let story: string;
	let right: string;
	let wrong: string[];
	let why: string[];
	if (kind === 'sposta' || kind === 'copia') {
		story = kind === 'sposta' ? `Il file ${inline(src)} viene spostato nella cartella ${inline(dst)}. Qual è ora il suo percorso assoluto?` : `Il file ${inline(src)} viene copiato nella cartella ${inline(dst)}. Qual è il percorso assoluto della copia?`;
		right = at([B], f);
		wrong = [src, ...shuffle(rng, [dst, at([A, B], f), at([], f), at([B, A], f)])];
		why = [kind === 'sposta' ? 'Spostando un file cambia la cartella e il nome resta lo stesso.' : 'La copia nasce nella cartella di arrivo, con lo stesso nome.', `Al percorso della cartella di arrivo si aggiunge il nome del file: ${inline(right)}.`];
	} else if (kind === 'originale') {
		story = `Il file ${inline(src)} viene copiato nella cartella ${inline(dst)}. Dopo la copia, qual è il percorso assoluto dell'originale?`;
		right = src;
		wrong = [at([B], f), ...shuffle(rng, [dst, at([A, B], f), at([], f), abs(s, [...base, A])])];
		why = ["Copiare non sposta: l'originale resta nella sua cartella, con il suo nome.", `Il suo percorso è ancora ${inline(src)}.`];
	} else if (kind === 'rinomina') {
		story = `Il file ${inline(src)} viene rinominato ${inline(g)}. Qual è ora il suo percorso assoluto?`;
		right = at([A], g);
		wrong = [src, ...shuffle(rng, [at([], g), abs(s, [g]), at([B], g), abs(s, [...base, A])])];
		why = ["Rinominando un file cambia solo l'ultima parte del percorso: la cartella resta la stessa.", `Il percorso diventa ${inline(right)}.`];
	} else {
		story = `Il file ${inline(src)} viene spostato nella cartella ${inline(dst)} e poi rinominato ${inline(g)}. Qual è ora il suo percorso assoluto?`;
		right = at([B], g);
		wrong = shuffle(rng, [at([A], g), at([B], f), src, at([], g)]);
		why = [`Dopo lo spostamento il file è ${inline(at([B], f))}.`, `La rinomina cambia solo il nome: il percorso diventa ${inline(right)}.`];
	}
	return {
		prompt: "Trova il percorso del file dopo l'operazione.",
		problem: textBlock(story),
		solution: tt(right),
		steps: why.map((w) => textBlock(w)),
		answer: pathChoice(rng, right, wrong),
		params: { case: kind, style: s },
	};
}

// ---------------------------------------------------------------------------
// Level 6: sizes

const THINGS = ['foto', 'documenti', 'brani'];
const COUNTS = [20, 25, 40, 50, 80, 120, 150, 200, 250, 400];
const KB = [50, 80, 120, 150, 200, 250, 300, 400, 500, 750];
const MB = [3, 4, 6, 7, 8, 12, 15, 25, 35, 45, 60, 70];

function level6(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const count = rng.pick(COUNTS);
		const size = rng.pick(KB);
		const total = count * size;
		const value = frac(total, 1000);
		const { answer, params } = numberAnswer(value, [String(total), frac(total, 100), frac(total, 10000), frac(total, 10), frac(2 * total, 1000), frac(total, 2000)], 'MB');
		return {
			prompt: 'Calcola la dimensione della cartella.',
			problem: textBlock(`Una cartella contiene $${count}$ ${rng.pick(THINGS)} da ${pw(size, 'kB')} ciascuno. Sapendo che $1\\,\\text{MB} = 1000\\,\\text{kB}$, quanti megabyte occupa la cartella?`),
			solution: withUnit(value, 'MB'),
			steps: [textBlock('La dimensione della cartella è la somma delle dimensioni dei file.'), `${count} \\cdot ${size} = ${withUnit(total, 'kB')}`, textBlock('Per passare ai megabyte si divide per $1000$.'), `${numTex(String(total))} : 1000 = ${withUnit(value, 'MB')}`],
			answer,
			params: { ...params, case: 'totale', count, size },
		};
	}
	const size = rng.pick(MB);
	const fit = rng.int(3, 60);
	const free = fit * size + rng.int(1, size - 1);
	const { answer, params } = numberAnswer(fit, [fit + 1, ...shuffle(rng, [fit - 1, free - size, fit + 2, free * size, 2 * fit])], '');
	return {
		prompt: 'Calcola quanti file stanno nello spazio libero.',
		problem: textBlock(`Su una chiavetta restano ${pw(free, 'MB')} liberi. Quanti video da ${pw(size, 'MB')} ciascuno ci stanno per intero?`),
		solution: numTex(String(fit)),
		steps: [textBlock(`Si divide lo spazio libero per la dimensione di un video: $${free} : ${size}$ dà $${fit}$ con resto $${free - fit * size}$.`), textBlock(`Un video non si può salvare a pezzi: si arrotonda per difetto, ce ne stanno $${fit}$.`)],
		answer,
		params: { ...params, case: 'quanti', free, size },
	};
}

export default makeGenerator(ID, 'Il file system: file, cartelle e percorsi', {
	1: { label: 'Nomi ed estensioni', constraints: ["il tipo di file dall'estensione (circa 3 su 4), o l'estensione di un nome con due punti"], make: level1 },
	2: { label: "Dall'albero al percorso", constraints: [`un albero da 6 a 9 righe, il percorso assoluto di un file, con la barra o con la barra rovesciata; percorsi fino a ${MAX_PATH} caratteri`], make: level2, check: pathCheck },
	3: { label: 'Da relativo ad assoluto', constraints: ['cartella corrente e percorso relativo che scende soltanto, di due o tre nomi'], make: level3, check: pathCheck },
	4: { label: 'Risalire con i due punti', constraints: ['percorso relativo con uno o due .. seguiti da uno, due o tre nomi; due .. in circa un caso su tre'], make: level4, check: pathCheck },
	5: { label: 'Copiare, spostare, rinominare', constraints: ["spostamento, rinomina, copia, originale dopo la copia, spostamento e rinomina: circa 1 su 5 ciascuno"], make: level5, check: pathCheck },
	6: {
		label: 'La dimensione dei file',
		constraints: ['la dimensione di una cartella in megabyte, con il fattore 1000 nel testo, o quanti file interi stanno in uno spazio (divisione con resto): circa metà ciascuno'],
		make: level6,
		check: (s) => (s.params.case === 'quanti' && (s.params.free as number) % (s.params.size as number) === 0 ? ['la divisione deve avere un resto'] : []),
	},
});
