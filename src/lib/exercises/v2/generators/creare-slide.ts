/**
 * Slide efficaci: testo, immagini e grafici. Spec: specs/exercises/creare-slide.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/32-creare-slide.md): which rule a described slide
 * breaks (lines, size, contrast); which of four described slides keeps all three; what to put under the title to
 * show one idea; the pixels an image needs on a screen; whether a job is done on the slide master, on one slide,
 * with an animation or with a transition; whether an image may be used, from where it comes.
 */
import type { Rng } from '../types';
import { type Built, NAMES, choose, makeGenerator, opt, shuffle, wrongs } from '../inf-documenti';

export const ID = 'creare-slide';

// ---------------------------------------------------------------------------
// Levels 1 and 2: lines, size, contrast

const MAX_LINES = 6;
const MIN_POINTS = 24;
const LIGHT = ['bianco', 'giallo chiaro', 'celeste', 'grigio chiaro'];
const DARK = ['nero', 'blu scuro', 'verde scuro', 'grigio scuro'];
const RULES = '$6$ righe di testo al massimo, almeno $24$ punti, testo e sfondo uno chiaro e uno scuro';

type Flaw = 'righe' | 'punti' | 'contrasto' | 'nessuna';
interface Slide {
	lines: number;
	points: number;
	text: string;
	back: string;
}

/** A slide with exactly the given flaw, or with none. */
function slide(rng: Rng, flaw: Flaw): Slide {
	const lines = flaw === 'righe' ? rng.int(MAX_LINES + 1, 12) : rng.int(2, MAX_LINES);
	const points = flaw === 'punti' ? rng.pick([12, 14, 16, 18, 20]) : rng.pick([24, 28, 32, 36]);
	const lightText = rng.next() < 0.5;
	const [a, b] = shuffle(rng, lightText ? LIGHT : DARK);
	const text = a;
	const back = flaw === 'contrasto' ? b : rng.pick(lightText ? DARK : LIGHT);
	return { lines, points, text, back };
}

const FLAWS: Record<Flaw, string> = {
	righe: 'Troppe righe di testo',
	punti: 'Caratteri troppo piccoli',
	contrasto: 'Contrasto insufficiente',
	nessuna: 'Nessuna: le rispetta tutte',
};

const shade = (c: string) => (LIGHT.includes(c) ? 'chiaro' : 'scuro');

function level1(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const flaw = rng.pick(Object.keys(FLAWS) as Flaw[]);
	const s = slide(rng, flaw);
	const same = shade(s.text) === shade(s.back);
	return {
		prompt: 'Trova la regola che la slide non rispetta.',
		problem: `Una slide di ${N} ha il titolo e $${s.lines}$ righe di testo di $${s.points}$ punti, ${s.text} su sfondo ${s.back}. Le regole: ${RULES}. Quale regola non rispetta?`,
		steps: [
			`Le righe sono $${s.lines}$: ${s.lines > MAX_LINES ? `più di $${MAX_LINES}$, troppe` : `non più di $${MAX_LINES}$, vanno bene`}.`,
			`I caratteri sono di $${s.points}$ punti: ${s.points < MIN_POINTS ? `meno di $${MIN_POINTS}$, troppo piccoli` : `almeno $${MIN_POINTS}$, vanno bene`}.`,
			same ? `Il testo ${s.text} e lo sfondo ${s.back} sono tutti e due ${shade(s.text) === 'chiaro' ? 'chiari' : 'scuri'}: il contrasto non è sufficiente.` : `Il testo è ${shade(s.text)} e lo sfondo ${shade(s.back)}: il contrasto va bene.`,
		],
		choice: choose(
			rng,
			opt(FLAWS[flaw], flaw),
			(Object.keys(FLAWS) as Flaw[]).filter((k) => k !== flaw).map((k) => opt(FLAWS[k], k)),
		),
		params: { case: flaw },
	};
}

function level2(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const label = (s: Slide) => opt(`${s.lines} righe, ${s.points} punti, ${s.text} su ${s.back}`, `${s.lines}|${s.points}|${s.text}|${s.back}`);
	const good = slide(rng, 'nessuna');
	const bad = (['righe', 'punti', 'contrasto'] as Flaw[]).map((f) => slide(rng, f));
	return {
		prompt: 'Scegli la slide che rispetta le regole.',
		problem: `${N} confronta quattro slide. Quale rispetta tutte e tre le regole: ${RULES}?`,
		steps: [
			`Una ha $${bad[0].lines}$ righe, più di $${MAX_LINES}$; una ha caratteri di $${bad[1].points}$ punti, meno di $${MIN_POINTS}$; una ha testo ${bad[2].text} su sfondo ${bad[2].back}, tutti e due ${shade(bad[2].text) === 'chiaro' ? 'chiari' : 'scuri'}.`,
			`Resta quella con $${good.lines}$ righe di $${good.points}$ punti, ${good.text} su ${good.back}: rispetta tutte e tre le regole.`,
		],
		choice: choose(rng, label(good), bad.map(label)),
		params: { case: 'una-sola' },
	};
}

// ---------------------------------------------------------------------------
// Level 3: what shows the idea

/** The idea of the slide; what shows it; the whole table; a chart with everything. */
const IDEAS: [string, string, string, string][] = [
	['In un mese le bottigliette buttate sono dimezzate', 'Un grafico con due barre: ottobre e novembre', 'La tabella con i conteggi di ogni giorno', 'Un grafico con una linea per ogni alunno'],
	['La biblioteca è più frequentata il mercoledì', 'Un grafico a barre dei giorni, con il mercoledì colorato', "La tabella dei prestiti di tutto l'anno", 'Un grafico con una linea per ogni classe'],
	['Metà della classe viene a scuola a piedi', 'Un grafico a torta con la fetta di chi viene a piedi colorata', 'La tabella con il percorso di ogni alunno', 'Un grafico con una barra per ogni via del quartiere'],
	["Il cratere dell'Etna è a più di tremila metri", 'Una foto grande del cratere, con la quota scritta sopra', "La tabella con le altezze di tutti i vulcani d'Europa", 'Un grafico con una barra per ogni eruzione del secolo'],
	['Il torneo si gioca sabato in palestra', 'Una foto grande della palestra, con il giorno scritto sopra', 'La tabella con i punteggi degli ultimi cinque anni', 'Un grafico con una barra per ogni giocatore'],
	['Dalla prima alla terza le ore di sonno calano', 'Un grafico con tre barre: prima, seconda, terza', 'La tabella con le ore di sonno di ogni alunno', "Un grafico con una linea per ogni giorno dell'anno"],
	['La mensa butta un terzo del pane', 'Una foto grande del pane avanzato in un giorno', 'La tabella con il menu di tutte le settimane', 'Un grafico con una barra per ogni piatto del menu'],
	['Una password corta si indovina in fretta', 'Un grafico con due barre: password corta e password lunga', 'La tabella con tutte le password più usate', "Un grafico con una linea per ogni lettera dell'alfabeto"],
];
const DECORATIONS = ['La foto di un tramonto sul mare', 'Il disegno di un gufo con gli occhiali', 'Il disegno di un razzo che decolla', 'Il disegno di una stretta di mano', 'Il disegno di una lampadina accesa', 'La foto di un cielo stellato', 'Una cornice di fiori colorati', 'Il disegno di un omino che pensa'];

function level3(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const [idea, shows, table, everything] = rng.pick(IDEAS);
	return {
		prompt: "Scegli che cosa mostra l'idea della slide.",
		problem: `Il titolo di una slide di ${N} è "${idea}". Che cosa conviene mettere sotto il titolo?`,
		steps: ["Sulla slide va quello che mostra l'idea del titolo, e niente altro.", "La tabella completa è il lavoro che c'è dietro; il grafico con tutti i dati nasconde l'idea in mezzo agli altri; l'immagine decorativa non la mostra affatto."],
		choice: choose(rng, opt(shows, 'idea'), [opt(table, 'tabella'), opt(everything, 'tutto'), opt(rng.pick(DECORATIONS), 'decorazione')]),
		params: { case: 'idea' },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the pixels of an image

const SCREENS: [number, number][] = [
	[1280, 720],
	[1920, 1080],
	[2560, 1440],
	[3840, 2160],
];
const SHARES: [string, number, number][] = [
	['tutta la', 1, 1],
	['metà della', 1, 2],
	['un terzo della', 1, 3],
	['un quarto della', 1, 4],
	['due terzi della', 2, 3],
	['tre quarti della', 3, 4],
];
const PICTURES = ['Una foto', 'Una mappa', "Un'illustrazione", 'Una vignetta'];

function level4(rng: Rng): Built {
	const N = rng.pick(NAMES);
	for (;;) {
		const [W, H] = rng.pick(SCREENS);
		const [share, p, q] = rng.pick(SHARES);
		const width = rng.next() < 0.5;
		const side = width ? W : H;
		const other = width ? H : W;
		if ((side * p) % q) continue;
		const value = (side * p) / q;
		const dim = width ? 'larghezza' : 'altezza';
		const whole = (x: number) => (Number.isInteger(x) ? [x] : []);
		return {
			prompt: "Calcola i pixel che servono all'immagine.",
			problem: `Lo schermo su cui ${N} proietta ha $${W}$ pixel in larghezza e $${H}$ in altezza. ${rng.pick(PICTURES)} deve occupare ${share} ${dim} della slide. Quanti pixel di ${dim} deve avere almeno, per non essere ingrandita?`,
			steps: [
				`In ${dim} lo schermo ha $${side}$ pixel.`,
				q === 1 ? `L'immagine la occupa tutta: servono $${side}$ pixel.` : `L'immagine ne occupa ${share.replace(/ della$/, '')}: $${side} \\cdot \\dfrac{${p}}{${q}} = ${value}$ pixel.`,
				`Con meno di $${value}$ pixel di ${dim} il programma la ingrandisce, e si vede sgranata.`,
			],
			number: { value: String(value), wrong: wrongs(String(value), [...whole((other * p) / q), ...(q === 1 ? [] : [side, (side * (q - p)) / q]), 2 * value, ...whole(value / 2), other]) },
			params: { case: dim },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: master, single slide, animation, transition

const TOOLS = {
	schema: 'Sullo schema delle diapositive',
	slide: 'Sulla singola slide',
	animazione: "Su un'animazione",
	transizione: 'Su una transizione',
} as const;
type Tool = keyof typeof TOOLS;

const JOBS: Record<Tool, string[]> = {
	schema: ['mettere il logo della scuola nello stesso angolo di tutte le slide', 'cambiare il carattere dei titoli in tutta la presentazione', 'dare lo stesso sfondo a tutte le slide', 'spostare un poco più in alto il titolo in tutte le slide'],
	slide: ['sostituire la foto della quarta slide', 'correggere un numero sbagliato nella terza slide', "aggiungere una riga di testo all'ultima slide"],
	animazione: ["far comparire i punti dell'elenco uno alla volta mentre li spiega", 'far apparire una freccia sul grafico solo quando ne parla', 'mostrare la risposta sotto la domanda solo dopo un clic'],
	transizione: ["scegliere l'effetto con cui si passa da una slide alla successiva", 'far dissolvere ogni slide in quella che viene dopo', "togliere l'effetto a scacchi che compare a ogni cambio di slide"],
};
const ABOUT = ['sui vulcani', 'sulle api', 'sul sonno', "sull'acqua", 'sulla biblioteca', 'sulla bicicletta', 'sulle password', 'sul torneo di pallavolo'];

const TOOL_WHY: Record<Tool, string> = {
	schema: 'Riguarda tutte le slide: si cambia una volta nello schema delle diapositive, e la modifica arriva a tutte.',
	slide: 'Riguarda il contenuto di una slide sola: si cambia in quella slide.',
	animazione: "È un effetto su un elemento dentro una slide: è un'animazione.",
	transizione: "È l'effetto del passaggio da una slide alla successiva: è una transizione.",
};

function level5(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const tool = rng.pick(Object.keys(TOOLS) as Tool[]);
	return {
		prompt: 'Scegli su che cosa si lavora.',
		problem: `${N} prepara una presentazione ${rng.pick(ABOUT)} e vuole ${rng.pick(JOBS[tool])}. Su che cosa lavora?`,
		steps: [TOOL_WHY[tool]],
		choice: choose(
			rng,
			opt(TOOLS[tool], tool),
			(Object.keys(TOOLS) as Tool[]).filter((k) => k !== tool).map((k) => opt(TOOLS[k], k)),
		),
		params: { case: tool },
	};
}

// ---------------------------------------------------------------------------
// Level 6: sources and licences

const USES = {
	propria: 'Sì, senza chiedere: è opera sua',
	licenza: 'Sì, citando autore e licenza',
	permesso: "Solo con il permesso dell'autore",
	rete: 'Sì: è in rete, quindi è di tutti',
} as const;
type Use = Exclude<keyof typeof USES, 'rete'>;

const ORIGINS: Record<Use, string[]> = {
	propria: ['che ha realizzato da sé', 'che ha creato da sé per questo lavoro'],
	licenza: ['presa da un sito che la pubblica con licenza CC BY', 'trovata in un archivio in rete, con licenza Creative Commons CC BY'],
	permesso: ['presa da un sito con la scritta tutti i diritti riservati', 'trovata con un motore di ricerca, su una pagina che non indica alcuna licenza', 'copiata dal sito di un giornale, che non ne permette il riuso'],
};
const IMAGES = ['la foto di un vulcano', 'la mappa di una città', "la foto di un'ape su un fiore", "l'immagine del ciclo dell'acqua", 'la fotografia di un ghiacciaio', "l'illustrazione di una cellula", 'la foto di una squadra di pallavolo', 'la vignetta di un robot'];

const USE_WHY: Record<Use, string> = {
	propria: "L'autore dell'immagine è chi presenta: decide da sé come usarla.",
	licenza: "La licenza CC BY permette a chiunque di usare l'opera, a patto di indicarne l'autore: si usa, scrivendo autore e licenza.",
	permesso: "Senza una licenza che lo permetta decide l'autore: serve il suo permesso, oppure si cerca un'altra immagine.",
};

function level6(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const use = rng.pick(Object.keys(ORIGINS) as Use[]);
	return {
		prompt: "Decidi se l'immagine si può usare.",
		problem: `Per la sua presentazione ${N} vuole usare ${rng.pick(IMAGES)}, ${rng.pick(ORIGINS[use])}. Può usarla?`,
		steps: [USE_WHY[use], "Che un'immagine si trovi in rete e si possa scaricare non vuol dire che si possa usare."],
		choice: choose(
			rng,
			opt(USES[use], use),
			(Object.keys(USES) as (keyof typeof USES)[]).filter((k) => k !== use).map((k) => opt(USES[k], k)),
		),
		params: { case: use },
	};
}

export const creareSlide = makeGenerator(
	ID,
	'Slide efficaci: testo, immagini e grafici',
	{
		1: { label: 'La regola non rispettata', constraints: ['una slide con righe, punti e colori: troppe righe, caratteri piccoli, poco contrasto o nessun difetto, circa 1 su 4 ciascuno', 'al più un difetto per slide'] },
		2: { label: 'La slide che rispetta le regole', constraints: ['quattro slide: una senza difetti, le altre con un solo difetto ciascuna, di tre tipi diversi'] },
		3: { label: "L'immagine o il grafico giusto", constraints: ["il titolo della slide; opzioni: ciò che mostra l'idea, la tabella completa, il grafico con tutto, un'immagine decorativa"] },
		4: { label: "I pixel di un'immagine", constraints: ['schermi da 1280 x 720 a 3840 x 2160; tutta, metà, un terzo, un quarto, due terzi, tre quarti', 'larghezza o altezza, risultato intero'] },
		5: { label: 'Schema, slide, animazione, transizione', constraints: ['un lavoro: schema delle diapositive, singola slide, animazione, transizione, circa 1 su 4 ciascuno'] },
		6: { label: 'Le fonti delle immagini', constraints: ["l'origine di un'immagine: propria, con licenza CC BY, senza licenza o con diritti riservati, circa 1 su 3 ciascuna", 'la quarta opzione, "è in rete, quindi è di tutti", non è mai giusta'] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 },
);

export default creareSlide;
