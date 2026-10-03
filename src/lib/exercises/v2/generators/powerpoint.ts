/**
 * Progettare una presentazione. Spec: specs/exercises/powerpoint.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/31-powerpoint.md): which sentence states the purpose;
 * how many slides fit the time; which title holds two ideas; which part a slide belongs to (opening, body, closing,
 * or none); the minutes of each part; the order of an outline.
 */
import type { Rng } from '../types';
import { type Built, NAMES, choose, frac, low, makeGenerator, numTex, opt, shuffle, wrongs } from '../inf-documenti';

export const ID = 'powerpoint';

// ---------------------------------------------------------------------------
// Level 1: the purpose in one sentence

/** "about what", the bare topic, two sentences that state a purpose. */
const TOPICS: [string, string, [string, string]][] = [
	['sulla raccolta differenziata', 'La raccolta differenziata', ['In classe possiamo dimezzare i rifiuti con tre gesti', 'Separare bene la carta fa risparmiare la scuola']],
	['sui vulcani italiani', 'I vulcani italiani', ['I vulcani italiani sono sorvegliati giorno e notte', 'Chi vive vicino a un vulcano deve conoscere il piano di emergenza']],
	['sul sonno', 'Il sonno', ['Dormire abbastanza aiuta a ricordare ciò che si studia', 'Il telefono a letto fa dormire peggio']],
	['sulle api', 'Le api', ['Senza le api avremmo meno frutta', 'Un prato fiorito a scuola aiuterebbe le api']],
	["sull'acqua del rubinetto", "L'acqua del rubinetto", ["L'acqua del rubinetto costa meno di quella in bottiglia", 'Con una borraccia si butta via meno plastica']],
	['sulla biblioteca della scuola', 'La biblioteca della scuola', ['La biblioteca dovrebbe restare aperta il pomeriggio', 'In biblioteca si possono prendere in prestito anche i fumetti']],
	['sulla bicicletta', 'La bicicletta', ['Venire a scuola in bici è più veloce di quanto si pensi', 'Alla scuola serve una rastrelliera per le bici']],
	['sulle password', 'Le password', ['Una password lunga protegge più di una corta', 'Usare la stessa password ovunque è un rischio']],
	['sugli acquedotti romani', 'Gli acquedotti romani', ["Gli acquedotti romani portavano l'acqua sfruttando la pendenza", 'Alcuni acquedotti romani funzionano ancora oggi']],
	['sul torneo di pallavolo', 'Il torneo di pallavolo', ['Il torneo di pallavolo ha bisogno di dieci volontari', 'Per giocare al torneo bisogna iscriversi entro venerdì']],
];
const ABOUT_ME = ['Voglio prendere un bel voto', 'Devo parlare per dieci minuti', 'Voglio mostrare quanto ho studiato'];
const LISTS = ['Tutto quello che so', 'Tutte le notizie trovate', 'Un elenco di dati'];
const AUDIENCES = ['ai compagni di classe', 'alla professoressa', 'ai genitori, nella giornata di scuola aperta', 'agli alunni delle medie in visita'];

function level1(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const [about, topic, purposes] = rng.pick(TOPICS);
	const purpose = rng.pick(purposes);
	return {
		prompt: 'Scegli la frase che dice lo scopo.',
		problem: `${N} prepara una presentazione ${about}, da fare ${rng.pick(AUDIENCES)}. Quale di queste frasi ne dice lo scopo, cioè quello che il pubblico deve ricordare alla fine?`,
		steps: ['Lo scopo è una frase con un soggetto e un verbo, che dice che cosa il pubblico deve sapere o fare alla fine.', "Le altre opzioni sono l'argomento senza una direzione, un elenco di tutto quello che si è trovato e una frase che parla di chi presenta, non di chi ascolta."],
		choice: choose(rng, opt(purpose, 'scopo'), [opt(topic, 'argomento'), opt(`${rng.pick(LISTS)} ${about}`, 'elenco'), opt(rng.pick(ABOUT_ME), 'chi-presenta')]),
		params: { case: 'scopo' },
	};
}

// ---------------------------------------------------------------------------
// Level 2: how many slides

/** Minutes per slide, in half minutes, and how the story says it. */
const PACES: [number, string][] = [
	[2, 'un minuto'],
	[3, 'un minuto e mezzo'],
	[4, '$2$ minuti'],
	[6, '$3$ minuti'],
];

function level2(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const [pace, paceText] = rng.pick(PACES);
	let n = rng.int(4, 12);
	// The time left over, in half minutes: less than a slide, and such that the total is a whole number of minutes.
	let rest = 0;
	if (rng.next() < 0.6 && pace > 2) rest = pace === 3 ? (n % 2 ? 1 : 2) : pace === 4 ? 2 : rng.pick([2, 4]);
	// A minute and a half per slide with nothing left over: an even number of slides, so the time is in whole minutes.
	if (pace === 3 && rest === 0 && n % 2) n -= 1;
	const speak = (n * pace + rest) / 2;
	const Q = rng.pick([0, 2, 3, 5]);
	const T = speak + Q;
	const used = numTex(frac(n * pace, 2));
	const oneMore = numTex(frac((n + 1) * pace, 2));
	return {
		prompt: 'Calcola il numero di slide.',
		problem: `${N} ha $${T}$ minuti per la sua presentazione${Q ? `, di cui $${Q}$ vanno lasciati alle domande` : ', e non sono previste domande'}. Dedica ${paceText} a ogni slide. Quante slide prepara al massimo?`,
		steps: [
			Q ? `Per parlare restano $${T} - ${Q} = ${speak}$ minuti.` : `Per parlare ci sono tutti i $${T}$ minuti.`,
			rest ? `Con $${n}$ slide servono $${used}$ minuti; con $${n + 1}$ ne servirebbero $${oneMore}$, più dei $${speak}$ disponibili.` : `Con $${n}$ slide servono proprio $${used}$ minuti.`,
			`Prepara $${n}$ slide${rest ? ': il risultato della divisione si arrotonda per difetto' : ''}.`,
		],
		number: { value: String(n), wrong: wrongs(String(n), [...(Q ? [Math.floor((T * 2) / pace)] : []), ...(rest ? [n + 1] : []), speak, n - 1, n + 1, T, n + 2]) },
		params: { case: rest ? 'resto' : 'esatta' },
	};
}

// ---------------------------------------------------------------------------
// Level 3: one idea per slide

/** "about what" and five titles with one idea each. */
const TITLES: [string, string[]][] = [
	['sui vulcani', ['Come nasce un vulcano', 'Che cosa esce dal cratere', 'I vulcani attivi in Italia', 'Come si sorveglia un vulcano', 'Che cosa fare in caso di allarme']],
	['sulle api', ['Come vive un alveare', 'Che cosa mangiano le api', 'Perché le api diminuiscono', 'Come nasce il miele', 'Che cosa possiamo fare noi']],
	['sul sonno', ['Quante ore dormiamo', 'Che cosa succede mentre dormiamo', 'Perché il telefono disturba il sonno', 'Come dormire meglio', 'I sogni']],
	["sull'acqua", ['Da dove arriva la nostra acqua', 'Quanto costa un litro dal rubinetto', 'Quanta plastica usiamo', "I controlli sull'acqua potabile", 'La prova delle borracce']],
	['sulla biblioteca', ['Quanti libri ha la biblioteca', 'Chi la usa oggi', 'Gli orari di apertura', 'Che cosa chiedono gli studenti', 'La nostra proposta']],
	['sulla bicicletta', ['Quanti vengono a scuola in bici', 'I percorsi più sicuri', 'Dove lasciare la bici', 'Quanto tempo si risparmia', 'Che cosa chiediamo al Comune']],
];

function level3(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const [about, titles] = rng.pick(TITLES);
	const [a, b, ...singles] = shuffle(rng, titles);
	const double = `${a} e ${low(b)}`;
	return {
		prompt: 'Trova la slide da dividere.',
		problem: `Nella scaletta di ${N} per la presentazione ${about} ci sono questi quattro titoli. Quale contiene più di un'idea e va diviso in due slide?`,
		steps: [`"${double}" annuncia due idee.`, `Diventa due slide, ognuna con il suo titolo: "${a}" e "${b}".`],
		choice: choose(
			rng,
			{ ...opt(double), values: [a, b] },
			singles.map((s) => opt(s)),
		),
		params: { case: 'due-idee' },
	};
}

// ---------------------------------------------------------------------------
// Level 4: opening, body, closing, or none

const PARTS = {
	apertura: "Nell'apertura",
	sviluppo: 'Nello sviluppo',
	chiusura: 'Nella chiusura',
	tolta: 'In nessuna: va tolta',
} as const;
type Part = keyof typeof PARTS;

const SLIDES: Record<Part, string[]> = {
	apertura: ['porta il titolo della presentazione e il nome di chi parla', 'dice di che cosa si parlerà e perché riguarda chi ascolta', 'pone la domanda a cui la presentazione risponderà'],
	sviluppo: ['spiega il secondo dei tre punti del discorso', 'mostra il grafico con i dati raccolti, che è uno dei punti del discorso', 'racconta come è stata fatta la prova, che è il primo punto del discorso'],
	chiusura: ['ripete in una frase quello che il pubblico deve ricordare', 'elenca le fonti e invita a fare domande', 'dice che cosa si chiede al pubblico di fare da domani'],
	tolta: ['mostra le foto delle vacanze di chi presenta, che con lo scopo non hanno a che fare', 'racconta una curiosità che non serve allo scopo della presentazione', 'ripete per intero una slide già mostrata, senza aggiungere niente'],
};

const PART_WHY: Record<Part, string> = {
	apertura: "L'apertura dice chi parla, di che cosa e perché a chi ascolta dovrebbe interessare.",
	sviluppo: 'Lo sviluppo è il corpo del discorso: i punti, ognuno con le sue slide.',
	chiusura: 'La chiusura ripete lo scopo, lascia spazio alle domande e riporta le fonti.',
	tolta: 'Ogni slide che non serve allo scopo si toglie, in qualunque parte si trovi.',
};

function level4(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const [about] = rng.pick(TOPICS);
	const part = rng.pick(Object.keys(PARTS) as Part[]);
	return {
		prompt: 'Scegli la parte della presentazione.',
		problem: `${N} prepara una presentazione ${about}. Una slide ${rng.pick(SLIDES[part])}. In quale parte della presentazione sta?`,
		steps: [PART_WHY[part]],
		choice: choose(
			rng,
			opt(PARTS[part], part),
			(Object.keys(PARTS) as Part[]).filter((k) => k !== part).map((k) => opt(PARTS[k], k)),
		),
		params: { case: part },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the minutes of each part

function level5(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const a = rng.int(1, 3);
	const c = rng.int(1, 2);
	const k = rng.int(2, 5);
	const m = rng.int(2, 6);
	const T = a + c + k * m;
	const whole = (x: number) => (Number.isInteger(x) ? [x] : []);
	if (rng.next() < 0.5) {
		return {
			prompt: 'Calcola i minuti di ogni punto.',
			problem: `${N} ha $${T}$ minuti per la sua presentazione: ne dedica $${a}$ all'apertura e $${c}$ alla chiusura. Lo sviluppo ha $${k}$ punti, tutti della stessa durata. Quanti minuti dura ogni punto?`,
			steps: [`Per lo sviluppo restano $${T} - ${a} - ${c} = ${k * m}$ minuti.`, `Divisi tra $${k}$ punti: $${k * m} : ${k} = ${m}$ minuti per punto.`],
			number: { value: String(m), wrong: wrongs(String(m), [...whole(T / k), ...whole((T - a) / k), k * m, m + 1, m - 1, k, m + 2]) },
			params: { case: 'punto' },
		};
	}
	return {
		prompt: 'Calcola la durata della presentazione.',
		problem: `Nella presentazione di ${N} l'apertura dura $${a}$ ${a === 1 ? 'minuto' : 'minuti'} e la chiusura $${c}$. Lo sviluppo ha $${k}$ punti di $${m}$ minuti ciascuno. Quanti minuti dura la presentazione?`,
		steps: [`Lo sviluppo dura $${k} \\cdot ${m} = ${k * m}$ minuti.`, `Con apertura e chiusura: $${a} + ${k * m} + ${c} = ${T}$ minuti.`],
		number: { value: String(T), wrong: wrongs(String(T), [k * m, a + c + m, a + c + k + m, a + k * m, T + 1, T - 1]) },
		params: { case: 'totale' },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the order of an outline

/** Four titles in the order of the outline: the title slide, the problem, what answers it, what to do. */
const OUTLINES: string[][] = [
	['Meno plastica in 1B', 'Quante bottigliette buttavamo a ottobre', 'Che cosa è cambiato con le borracce', 'Che cosa chiediamo alla scuola'],
	['Una biblioteca aperta anche di pomeriggio', 'Oggi la biblioteca chiude alle 13', 'Che cosa cambierebbe con due ore in più', 'La nostra richiesta al preside'],
	['A scuola in bicicletta', 'Oggi solo tre di noi vengono in bici', 'Che cosa cambierebbe con una rastrelliera', 'Che cosa chiediamo al Comune'],
	['Un prato per le api', 'Perché le api stanno diminuendo', 'Come un prato fiorito le aiuta', 'Dove seminarlo nel cortile della scuola'],
	['Dormire per ricordare', 'Quanto dormiamo oggi', "Che cosa cambia con un'ora in più", 'Tre abitudini da provare stasera'],
	['Password a prova di ladro', 'Come si indovina una password corta', 'Perché una password lunga resiste', 'Come cambiare la tua password oggi'],
	['I vulcani, sorvegliati speciali', 'Perché un vulcano è pericoloso', 'Come lo si tiene sotto controllo', 'Che cosa fare se scatta un allarme'],
	['Il torneo di pallavolo di maggio', 'Come funzionava il torneo fino a oggi', "Che cosa cambia quest'anno", 'Come iscriversi entro venerdì'],
];
const LETTERS = ['A', 'B', 'C', 'D'];

function level6(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const titles = rng.pick(OUTLINES);
	// shown[i] is the place in the outline of the title that gets letter i
	const shown = shuffle(rng, [0, 1, 2, 3]);
	const letterOf = (place: number) => LETTERS[shown.indexOf(place)];
	const order = (places: number[]) => places.map(letterOf).join(', ');
	const right = order([0, 1, 2, 3]);
	const others = shuffle(rng, [
		[3, 1, 2, 0],
		[0, 2, 1, 3],
		[1, 2, 3, 0],
		[1, 0, 2, 3],
		[0, 1, 3, 2],
		[3, 2, 1, 0],
	]).map((p) => opt(order(p)));
	return {
		prompt: 'Metti in ordine la scaletta.',
		problem: `${N} ha scritto i titoli di quattro slide, alla rinfusa. ${shown.map((place, i) => `${LETTERS[i]}: "${titles[place]}".`).join(' ')} In quale ordine vanno nella scaletta, dall'apertura alla chiusura?`,
		steps: [
			`"${titles[0]}" è il titolo della presentazione: apre (${letterOf(0)}).`,
			`Lo sviluppo va dal problema a ciò che lo risolve: prima "${titles[1]}" (${letterOf(1)}), poi "${titles[2]}" (${letterOf(2)}).`,
			`"${titles[3]}" dice che cosa fare: chiude (${letterOf(3)}). L'ordine è ${right}.`,
		],
		choice: choose(rng, opt(right), others),
		params: { case: 'ordine' },
	};
}

export const powerpoint = makeGenerator(
	ID,
	'Progettare una presentazione',
	{
		1: { label: 'Lo scopo in una frase', constraints: ["quattro frasi: lo scopo, l'argomento, un elenco, una frase su chi presenta"] },
		2: { label: 'Quante slide', constraints: ['da 4 a 12 slide; 1, 1,5, 2 o 3 minuti a slide; 0, 2, 3 o 5 minuti per le domande', 'tempo in minuti interi; con il resto si arrotonda per difetto'] },
		3: { label: "Un'idea per slide", constraints: ['quattro titoli della stessa scaletta, uno fatto di due idee unite da "e"'] },
		4: { label: 'Apertura, sviluppo, chiusura', constraints: ['una slide: apertura, sviluppo, chiusura, oppure da togliere, circa 1 su 4 ciascuna'] },
		5: { label: 'Il tempo di ogni parte', constraints: ['apertura da 1 a 3 minuti, chiusura 1 o 2, da 2 a 5 punti da 2 a 6 minuti', 'i minuti di un punto, oppure la durata totale, metà ciascuno'] },
		6: { label: "L'ordine della scaletta", constraints: ['quattro titoli alla rinfusa: titolo, problema, risposta, che cosa fare'] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 },
);

export default powerpoint;
