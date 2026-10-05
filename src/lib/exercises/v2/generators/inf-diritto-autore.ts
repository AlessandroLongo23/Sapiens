/**
 * Diritto d'autore e licenze. Spec: specs/exercises/inf-diritto-autore.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/44-inf-diritto-autore.md), all multiple choice of
 * texts (v2/inf-sic.ts): 1. true and false on what copyright protects; 2. quotation, plagiarism, a use that needs
 * permission, public domain; 3. what a Creative Commons licence allows, worked out from the elements of its code;
 * 4. the licence that matches the choices of an author; 5. software licences; 6. what to do in a piece of school
 * work, with the four parts of an attribution.
 *
 * The questions stay on what the lesson says: no article numbers, no borderline legal cases.
 */
import type { Rng } from '../types';
import { choose, makeGenerator, shuffle, textOption, type Built } from '../inf-programmi';
import { NAMES, asked, cap, situationLevel, sortLevel, statementLevel, type Situation, type Statement } from '../inf-sic';

export const ID = 'inf-diritto-autore';

// ---------------------------------------------------------------------------
// Level 1: true and false

const TRUE: Statement[] = [
	{ id: 't1', text: "Il diritto d'autore nasce da solo, nel momento in cui l'opera viene creata", why: "Il diritto nasce da solo, nel momento in cui l'opera viene creata: non serve registrarla." },
	{ id: 't2', text: 'Una foto che hai scattato tu è protetta anche senza il simbolo ©', why: 'Non serve scrivere accanto il simbolo ©: la foto che hai scattato è già protetta, e l\'autore sei tu.' },
	{ id: 't3', text: "Il diritto d'autore protegge la forma di un'opera, non l'idea", why: "È protetta la forma, non l'idea: il testo di un romanzo è del suo autore, l'idea da cui parte è di tutti." },
	{ id: 't4', text: "Se accanto a un'opera in rete non c'è nessuna indicazione, tutti i diritti sono riservati", why: "Senza indicazioni vale la regola generale: tutti i diritti sono riservati all'autore." },
	{ id: 't5', text: "I diritti morali restano sempre all'autore", why: "I diritti morali, come essere riconosciuto autore, non si possono cedere: restano sempre all'autore." },
	{ id: 't6', text: 'I diritti di utilizzazione economica si possono cedere ad altri', why: 'I diritti economici si possono vendere o concedere ad altri.' },
	{ id: 't7', text: "Anche un programma per computer è protetto dal diritto d'autore", why: "Il diritto d'autore protegge testi, canzoni, fotografie, disegni, film, e anche i programmi per computer." },
	{ id: 't8', text: "Un'opera nel pubblico dominio si può copiare e rielaborare senza chiedere niente", why: "Quando i diritti economici scadono, l'opera entra nel pubblico dominio: chiunque può copiarla e rielaborarla, citando l'autore." },
	{ id: 't9', text: 'La registrazione recente di una musica nel pubblico dominio ha diritti suoi', why: "La partitura è di tutti, ma la registrazione fatta di recente da un'orchestra ha diritti suoi." },
	{ id: 't10', text: "Chiunque può scrivere un romanzo partendo da un'idea già usata da un altro autore", why: "L'idea è di tutti: è protetto il testo preciso, con quelle frasi e quei personaggi." },
	{ id: 't11', text: "Anche di un'opera nel pubblico dominio si cita l'autore", why: "Un'opera nel pubblico dominio si usa liberamente, citando sempre l'autore: i diritti morali non scadono." },
	{ id: 't12', text: 'Comprando un libro acquisti una copia da usare, non il diritto di farne altre', why: 'Comprando un libro o un brano acquisti una copia da usare, non il diritto di farne altre e distribuirle.' }
];
const FALSE: Statement[] = [
	{ id: 'f1', text: "Per essere protetta, un'opera deve essere registrata", why: "Il diritto d'autore nasce da solo, nel momento in cui l'opera viene creata: non serve registrarla." },
	{ id: 'f2', text: "Senza il simbolo ©, un'opera si può usare liberamente", why: "Il simbolo © non serve: senza indicazioni tutti i diritti sono riservati all'autore." },
	{ id: 'f3', text: 'Tutto quello che si trova in rete è libero', why: 'Quello che si trova in rete non è per questo libero: senza indicazioni tutti i diritti sono riservati.' },
	{ id: 'f4', text: "Il diritto d'autore protegge le idee", why: "È protetta la forma, non l'idea: l'idea di un romanzo è di tutti." },
	{ id: 'f5', text: 'I diritti morali si possono vendere', why: "I diritti morali non si possono cedere: restano sempre all'autore. Si possono cedere quelli economici." },
	{ id: 'f6', text: 'Chi compra un brano musicale può pubblicarlo in rete', why: 'Comprando un brano acquisti una copia da ascoltare, non il diritto di pubblicarla.' },
	{ id: 'f7', text: "Citare la fonte basta per pubblicare l'opera di un altro", why: 'Citare evita di spacciare per tuo il lavoro di un altro, ma non sostituisce il permesso di pubblicarlo.' },
	{ id: 'f8', text: "Se non ci guadagni, puoi mettere in rete l'opera di un altro", why: "Mettere in rete l'opera di un altro è un uso riservato all'autore anche quando è gratuito." },
	{ id: 'f9', text: "La traduzione recente di un classico è nel pubblico dominio come l'originale", why: "L'originale è nel pubblico dominio, ma una traduzione recente ha diritti suoi." },
	{ id: 'f10', text: "I disegni e le foto di uno studente non sono protetti dal diritto d'autore", why: "Il disegno che hai fatto ieri e la foto che hai scattato in gita sono già protetti, e l'autore sei tu." },
	{ id: 'f11', text: 'I diritti di utilizzazione economica non scadono mai', why: "I diritti economici durano tutta la vita dell'autore e un certo numero di anni dopo la sua morte, poi l'opera entra nel pubblico dominio. A non scadere sono i diritti morali." },
	{ id: 'f12', text: "Di un'opera nel pubblico dominio puoi dichiararti autore", why: "Presentare come proprio il lavoro di un altro è plagio, anche quando l'opera è nel pubblico dominio." }
];

// ---------------------------------------------------------------------------
// Level 2: quotation, plagiarism, permission, public domain

const USES = {
	citazione: 'Una citazione corretta',
	plagio: 'Un plagio',
	permesso: "Un uso che richiede il permesso dell'autore",
	dominio: "Un uso libero: l'opera è nel pubblico dominio"
} as const;
type Use = keyof typeof USES;

const USE_TEXTS: [Use, (N: string) => string][] = [
	['citazione', (N) => `In una ricerca ${N} riporta tra virgolette due versi di una poesia di un poeta di oggi, con il nome del poeta e della raccolta, per commentarli.`],
	['citazione', (N) => `Per discutere un romanzo uscito quest'anno, ${N} ne riporta tre righe tra virgolette, indicando autore e titolo.`],
	['citazione', (N) => `In una relazione ${N} riporta tra virgolette una frase di un saggio recente, con autore e fonte, e la commenta.`],
	['plagio', (N) => `${N} copia nella sua ricerca tre paragrafi di un'enciclopedia in rete, che permette di riusare i suoi testi, senza dire da dove vengono.`],
	['plagio', (N) => `${N} consegna come proprio un tema scritto da un cugino.`],
	['plagio', (N) => `${N} presenta come sua una poesia scritta da un autore dell'Ottocento.`],
	['permesso', (N) => `${N} pubblica sul suo blog un capitolo intero di un romanzo uscito quest'anno, indicando autore e titolo.`],
	['permesso', (N) => `${N} mette in rete un video con una canzone di oggi come sottofondo, e scrive nei crediti titolo e cantante.`],
	['permesso', (N) => `${N} carica sul sito della classe la foto di un fotografo, trovata su un blog privo di ogni indicazione, e scrive il nome del blog.`],
	['dominio', (N) => `${N} pubblica sul suo blog il testo di un canto della Divina Commedia, indicando che è di Dante.`],
	['dominio', (N) => `${N} stampa per la classe una poesia di un autore morto nel Settecento, con il nome dell'autore.`],
	['dominio', (N) => `${N} ricopia in un volantino lo spartito di un'aria di Verdi, indicando l'autore.`]
];
const USE_WHY: Record<Use, string> = {
	citazione: "Riportare una parte di un'opera per commentarla, indicando autore e fonte e senza sostituire l'originale, è una citazione: la legge la lascia libera.",
	plagio: "Presentare come proprio il lavoro di un altro è plagio. Riguarda il riconoscimento dell'autore, ed è scorretto anche quando l'opera è nel pubblico dominio o ha una licenza che ne permette l'uso.",
	permesso: "Pubblicare l'opera di un altro è un uso riservato all'autore: citare la fonte non sostituisce il permesso, e un'opera intera non è una citazione.",
	dominio: "I diritti economici sono scaduti da tempo: l'opera è nel pubblico dominio e si può copiare e pubblicare senza chiedere niente, citando sempre l'autore."
};

// ---------------------------------------------------------------------------
// Creative Commons: the six licences, from their elements

interface Licence {
	code: string;
	nc: boolean;
	sa: boolean;
	nd: boolean;
}
const licence = (nc: boolean, mod: 'libera' | 'sa' | 'nd'): Licence => ({ code: ['BY', ...(nc ? ['NC'] : []), ...(mod === 'sa' ? ['SA'] : mod === 'nd' ? ['ND'] : [])].join('-'), nc, sa: mod === 'sa', nd: mod === 'nd' });
const LICENCES: Licence[] = [false, true].flatMap((nc) => (['libera', 'sa', 'nd'] as const).map((mod) => licence(nc, mod)));

/** Works, all feminine, so that "usarla", "modificarla" hold for each. */
const WORKS = ['una foto', "un'illustrazione", 'una canzone', 'una poesia', 'una mappa', 'una vignetta'];
/** The same works, as made by the person of the exercise. */
const OWN_WORKS = ['una sua foto', 'una sua illustrazione', 'una sua canzone', 'una sua poesia', 'una sua mappa', 'una sua vignetta'];

// ---------------------------------------------------------------------------
// Level 3: what a licence allows

/** A use: whether it changes the work, whether it earns money. */
const WANTS: { modify: boolean; commercial: boolean; text: string }[] = [
	{ modify: false, commercial: false, text: "pubblicarla così com'è sul sito della classe" },
	{ modify: false, commercial: false, text: "condividerla così com'è con i compagni" },
	{ modify: true, commercial: false, text: 'modificarla e pubblicare la sua versione sul sito della classe' },
	{ modify: true, commercial: false, text: 'modificarla e condividere la sua versione con i compagni' },
	{ modify: false, commercial: true, text: "venderne delle copie così com'è" },
	{ modify: false, commercial: true, text: "metterla così com'è su magliette da vendere" },
	{ modify: true, commercial: true, text: 'modificarla e vendere la sua versione' },
	{ modify: true, commercial: true, text: 'modificarla e mettere la sua versione su magliette da vendere' }
];
const VERDICTS = {
	si: "Sì, indicando l'autore",
	siSA: "Sì, indicando l'autore e dando alla sua versione la stessa licenza",
	noND: 'No: la licenza non permette di modificarla',
	noNC: 'No: la licenza non permette usi commerciali'
} as const;
type Verdict = keyof typeof VERDICTS;

/** The verdict on a use under a licence, from the elements of its code; null when there are two reasons to say no, which would make two options right. */
function verdictOf(l: Licence, want: { modify: boolean; commercial: boolean }): Verdict | null {
	const stopNC = l.nc && want.commercial;
	const stopND = l.nd && want.modify;
	if (stopNC && stopND) return null;
	return stopNC ? 'noNC' : stopND ? 'noND' : l.sa && want.modify ? 'siSA' : 'si';
}
const CASES = LICENCES.flatMap((l) => WANTS.map((want) => ({ l, want, verdict: verdictOf(l, want) })));

function level3(rng: Rng): Built {
	// the verdict first, so that the four come out as often as each other
	const verdict = rng.pick(Object.keys(VERDICTS) as Verdict[]);
	const { l, want } = rng.pick(CASES.filter((c) => c.verdict === verdict));
	const N = rng.pick(NAMES);
	const work = rng.pick(WORKS);
	const answer = choose(
		rng,
		textOption(VERDICTS[verdict], verdict),
		(Object.keys(VERDICTS) as Verdict[]).filter((v) => v !== verdict).map((v) => textOption(VERDICTS[v], v))
	);
	const elements = `La sigla CC ${l.code} si legge un elemento alla volta: BY chiede di indicare l'autore${l.nc ? ', NC esclude gli usi commerciali' : ''}${l.sa ? ', SA chiede che una versione modificata abbia la stessa licenza' : ''}${l.nd ? ', ND vieta di modificare' : ''}.`;
	const why: Record<Verdict, string> = {
		noNC: 'Vendere è un uso commerciale, e NC lo esclude.',
		noND: "ND permette di condividere l'opera solo com'è: non si può modificare.",
		siSA: `Nella sigla ${l.nc && !want.commercial ? 'NC non riguarda questo uso, che non porta guadagni, e ' : ''}niente vieta di modificare; SA chiede però che la versione modificata abbia la stessa licenza, CC ${l.code}.`,
		si: `${l.nc ? 'Questo uso non porta guadagni, quindi NC non lo tocca. ' : ''}${want.modify ? 'Nella sigla non ci sono né ND né SA: la versione modificata è permessa, indicando l\'autore.' : `${l.sa || l.nd ? `${l.sa ? 'SA' : 'ND'} riguarda le modifiche, e qui l'opera resta com'è. ` : ''}Basta indicare l'autore.`}`
	};
	return asked('Leggi la sigla di una licenza Creative Commons.', `${N} trova ${work} con licenza CC ${l.code} e vuole ${want.text}. Può farlo?`, answer, [elements, why[verdict]], { case: verdict, licence: l.code, modify: want.modify, commercial: want.commercial, name: N, work });
}

// ---------------------------------------------------------------------------
// Level 4: the licence for the choices of an author

function level4(rng: Rng): Built {
	const l = rng.pick(LICENCES);
	const N = rng.pick(NAMES);
	const work = rng.pick(OWN_WORKS);
	const commercial = l.nc ? 'gli usi commerciali non sono permessi' : 'gli usi commerciali sono permessi';
	const changes = l.nd ? "l'opera non si può modificare" : l.sa ? "l'opera si può modificare, ma la versione modificata deve avere la stessa licenza" : "l'opera si può modificare senza altre condizioni";
	const o = (x: Licence) => textOption(`CC ${x.code}`, x.code);
	const answer = choose(
		rng,
		o(l),
		shuffle(
			rng,
			LICENCES.filter((x) => x !== l)
		).map(o)
	);
	return asked(
		'Scegli la licenza Creative Commons che corrisponde.',
		`${N} pubblica ${work} e decide così: chi la usa deve indicare l'autore; ${commercial}; ${changes}. Quale licenza Creative Commons corrisponde a queste scelte?`,
		answer,
		[`La sigla si compone un elemento alla volta. BY, indicare l'autore, c'è in tutte le licenze. ${l.nc ? 'Gli usi commerciali sono esclusi: si aggiunge NC.' : 'Gli usi commerciali sono permessi: NC non compare.'}`, `${l.nd ? 'Le modifiche sono vietate: si aggiunge ND.' : l.sa ? 'Le versioni modificate devono avere la stessa licenza: si aggiunge SA.' : 'Le modifiche sono libere: non compaiono né SA né ND.'} La licenza è CC ${l.code}.`],
		{ case: l.code, commercial: !l.nc, changes: l.nd ? 'no' : l.sa ? 'stessa licenza' : 'libere', name: N, work, options: answer.options.map((x) => x.values[0]).sort() }
	);
}

// ---------------------------------------------------------------------------
// Level 5: software licences

const KINDS = {
	proprietario: 'Software proprietario a pagamento',
	freeware: 'Freeware',
	copyleft: 'Software libero con copyleft',
	permissivo: 'Software libero con licenza permissiva'
} as const;
type Kind = keyof typeof KINDS;

const PROGRAMS = ['un editor di testo', 'un programma di disegno', 'un lettore di musica', 'un gioco di scacchi', 'un programma per montare i video', 'un browser', 'una calcolatrice scientifica', 'un programma di posta'];
const KIND_TEXTS: [Kind, (P: string) => string][] = [
	['proprietario', (P) => `${cap(P)} si usa solo dopo averlo comprato; il codice sorgente non è pubblico e non si può modificare.`],
	['proprietario', (P) => `Per usare ${P} si paga una licenza che concede soltanto l'uso: niente copie per altri, niente modifiche.`],
	['proprietario', (P) => `${cap(P)} è in vendita, e la licenza vieta di copiarlo per altri e di modificarlo; il codice sorgente resta segreto.`],
	['freeware', (P) => `${cap(P)} si scarica e si usa gratis, ma il codice sorgente non è pubblico e non si può modificare.`],
	['freeware', (P) => `${cap(P)} non costa niente, però resta sotto il controllo di chi lo produce: non puoi studiarlo né modificarlo.`],
	['freeware', (P) => `${cap(P)} è gratuito; la licenza concede soltanto l'uso, e il codice sorgente resta segreto.`],
	['copyleft', (P) => `Il codice sorgente di ${P} è pubblico; chiunque può modificarlo, ma chi distribuisce una versione modificata deve usare la stessa licenza.`],
	['copyleft', (P) => `${cap(P)} si può usare, studiare, modificare e ridistribuire; le versioni modificate devono restare libere, con la stessa licenza.`],
	['copyleft', (P) => `Chiunque può modificare ${P}, a patto di distribuire la propria versione con la stessa licenza dell'originale.`],
	['permissivo', (P) => `Il codice sorgente di ${P} è pubblico; chiunque può modificarlo e riusarlo anche dentro un programma proprietario, conservando il nome degli autori.`],
	['permissivo', (P) => `${cap(P)} si può usare, studiare e modificare; la licenza chiede solo di conservare il nome degli autori.`],
	['permissivo', (P) => `Chiunque può riusare il codice di ${P}, anche in un programma proprietario: basta conservare il nome degli autori.`]
];
const KIND_WHY: Record<Kind, string[]> = {
	proprietario: ["La licenza concede soltanto l'uso, senza codice sorgente, copie o modifiche: è software proprietario.", 'Qui si paga per usarlo: è software proprietario a pagamento.'],
	freeware: ["La licenza concede soltanto l'uso, senza codice sorgente né modifiche: è software proprietario.", 'Un programma proprietario distribuito gratis si chiama freeware. Gratis non vuol dire libero.'],
	copyleft: ['Si può usare, studiare, modificare e ridistribuire: sono le quattro libertà del software libero.', 'La clausola che obbliga a distribuire le versioni modificate con la stessa licenza si chiama copyleft.'],
	permissivo: ['Si può usare, studiare, modificare e ridistribuire: sono le quattro libertà del software libero.', 'Una licenza che chiede solo di conservare il nome degli autori, e permette il riuso anche in un programma proprietario, è permissiva.']
};

/** What can be done with a program, by licence: true, false, or null where the lesson does not say. */
const ACTIONS: [id: string, text: string, proprietario: boolean | null, freeware: boolean | null, libero: boolean | null][] = [
	['uso', 'Usarlo, alle condizioni della sua licenza', true, true, true],
	['gratis', 'Usarlo senza pagare', false, true, null],
	['sorgente', 'Leggere il suo codice sorgente', false, false, true],
	['modifica', 'Modificarlo', false, false, true],
	['copie', 'Darne copie ad altri', false, null, true],
	['versioni', 'Distribuire una tua versione modificata', false, false, true],
	['tuo', 'Presentarlo come scritto da te', false, false, false]
];
const SOFTWARE: [id: 'proprietario' | 'freeware' | 'libero', text: string, column: 2 | 3 | 4][] = [
	['proprietario', 'un programma proprietario a pagamento', 2],
	['freeware', 'un freeware', 3],
	['libero', 'un software libero', 4]
];

function level5(rng: Rng): Built {
	if (rng.next() < 0.65) {
		const index = rng.int(0, KIND_TEXTS.length - 1);
		const [kind, text] = KIND_TEXTS[index];
		const program = rng.pick(PROGRAMS);
		const answer = choose(
			rng,
			textOption(KINDS[kind], kind),
			(Object.keys(KINDS) as Kind[]).filter((k) => k !== kind).map((k) => textOption(KINDS[k], k))
		);
		return asked('Riconosci il tipo di licenza di un programma.', `${text(program)} Di che tipo di software si tratta?`, answer, KIND_WHY[kind], { case: kind, text: index, program });
	}
	const o = (a: (typeof ACTIONS)[number]) => textOption(a[1], a[0]);
	// what the table allows to ask: one thing you can do among three you cannot, or the other way round
	const [id, name, column] = rng.pick(SOFTWARE);
	const can = id !== 'libero';
	const rights = ACTIONS.filter((a) => a[column] === can);
	const wrongs = ACTIONS.filter((a) => a[column] === !can);
	const right = rng.pick(rights);
	const others = shuffle(rng, wrongs).slice(0, 3);
	const why =
		id === 'libero'
			? 'Il software libero garantisce quattro libertà: usarlo, studiarlo e modificarlo, distribuirne copie, distribuire le proprie versioni modificate. Nessuna licenza permette di presentare come proprio il lavoro di altri.'
			: id === 'freeware'
				? "Un freeware è un programma proprietario distribuito gratis: lo usi senza pagare, ma non puoi leggerne il codice sorgente né modificarlo."
				: "Nel software proprietario a pagamento la licenza concede soltanto l'uso, a chi ha pagato: niente codice sorgente, niente modifiche, niente copie per altri.";
	return asked('Ragiona su che cosa permette una licenza del software.', `Con ${name}, quale di queste cose ${can ? 'puoi' : 'non puoi'} fare?`, choose(rng, o(right), others.map(o)), [why, id === 'libero' ? 'Libero riguarda che cosa puoi fare con il programma, non quanto costa.' : id === 'freeware' ? 'Gratis non vuol dire libero: il programma resta sotto il controllo di chi lo produce.' : 'Quando installi un programma non compri il programma: accetti una licenza, che dice che cosa puoi farne.'], { case: can ? 'puoi' : 'non puoi', software: id, actions: [right[0], ...others.map((a) => a[0]).sort()] });
}

// ---------------------------------------------------------------------------
// Level 6: what to do in a piece of school work

const SITUATIONS: Situation[] = [
	{
		id: 'blog',
		text: (N) => `${N} trova su un blog l'immagine perfetta per la presentazione che andrà sul sito della scuola; accanto non c'è nessuna indicazione.`,
		right: "Scrivere all'autore per chiedere il permesso, oppure cercarne un'altra con una licenza",
		wrong: ["Usarla: se non c'è scritto niente è libera", 'Usarla citando il blog: citare la fonte basta', 'Usarla, perché la scuola non ci guadagna', 'Usarla dopo averla ritagliata, così non è più la stessa opera'],
		why: ["Senza indicazioni tutti i diritti sono riservati all'autore.", "Citare la fonte o non guadagnarci non sostituisce il permesso: si scrive all'autore, e se non risponde se ne cerca un'altra."]
	},
	{
		id: 'canzone',
		text: (N) => `Per il video di un progetto che verrà pubblicato in rete, ${N} vuole usare come sottofondo una canzone famosa, comprata regolarmente.`,
		right: 'Cercare un brano con una licenza che permette quell\'uso, e scriverne i crediti',
		wrong: ["Usare la canzone: l'ha comprata, quindi può farne ciò che vuole", 'Usare la canzone, scrivendo titolo e cantante nei crediti', 'Usare la canzone, perché il video non porta guadagni', 'Usare la canzone, tenendo basso il volume'],
		why: ['Comprando il brano si acquista una copia da ascoltare, non il diritto di pubblicarlo dentro un\'altra opera.', 'Serve un brano con una licenza che lo permetta, per esempio CC BY, con titolo, autore, fonte e licenza nei crediti.']
	},
	{
		id: 'film',
		text: (N) => `Un compagno propone a ${N} un sito da cui scaricare gratis un film appena uscito, senza il permesso di chi l'ha fatto.`,
		right: "Lasciar perdere: viola il diritto d'autore, e quei siti sono una strada dei malware",
		wrong: ['Scaricarlo, perché è solo per uso personale', 'Scaricarlo, perché non ci guadagna nessuno', 'Scaricarlo e condividerlo solo con la classe', 'Scaricarlo, perché quello che sta in rete è libero'],
		why: ["Scaricare da fonti che non hanno il permesso degli autori viola il diritto d'autore, anche se lo fai per te e senza guadagnarci.", 'In più, i siti di questo tipo sono una delle strade principali dei malware.']
	},
	{
		id: 'enciclopedia',
		text: (N) => `Per una ricerca ${N} vuole usare tre paragrafi di un'enciclopedia in rete, che permette di riusare i suoi testi.`,
		right: 'Metterli tra virgolette con la fonte, oppure riscrivere i concetti con parole proprie',
		wrong: ['Copiarli senza dire niente: la licenza lo permette', 'Copiarli cambiando qualche parola qua e là', 'Copiarli e mettere il proprio nome in fondo alla ricerca', "Copiarli, perché a scuola il diritto d'autore non vale"],
		why: ['Copiare senza dirlo è plagio, anche se la licenza permette di riusare i testi: il plagio riguarda il riconoscimento dell\'autore.', 'Le parole degli altri vanno tra virgolette con la fonte, il resto si scrive con le proprie.']
	},
	{
		id: 'filtro',
		text: (N) => `${N} deve trovare delle immagini per una presentazione.`,
		ask: 'Da dove conviene cominciare?',
		right: 'Da una ricerca con il filtro sulla licenza, o da un archivio di opere libere',
		wrong: ['Dalle prime immagini che escono, controllando la licenza solo alla fine', 'Da qualunque sito: le immagini piccole sono libere', 'Dai social, dove le immagini sono di tutti', "Da qualunque sito, togliendo poi la firma dell'autore"],
		why: ['Conviene partire da ciò che si può usare: una ricerca con il filtro sulla licenza, o un archivio di opere libere.', 'Così non si deve rinunciare dopo a un\'immagine già scelta.']
	},
	{
		id: 'archivio',
		text: (N) => `In un archivio di immagini ${N} ne trova una adatta. Sa che su quel sito molte immagini hanno licenza CC BY.`,
		right: 'Leggere la licenza di quel file preciso, sulla pagina da cui lo scarica',
		wrong: ['Darla per buona: sullo stesso sito tutte le opere hanno la stessa licenza', 'Usarla senza controllare e senza crediti', 'Chiedere a un compagno che licenza ha di solito quel sito', 'Usarla, perché le licenze valgono solo per chi vende'],
		why: ['Sullo stesso sito possono convivere opere con licenze diverse.', 'Si legge la licenza di quel file preciso, sulla pagina da cui lo si scarica.']
	},
	{
		id: 'dipinto',
		text: (N) => `${N} mette in una slide un dipinto di un pittore morto da secoli, che è nel pubblico dominio.`,
		ask: "Deve indicare l'autore?",
		right: 'Sì: titolo, autore e fonte si indicano anche per le opere nel pubblico dominio',
		wrong: ["No: nel pubblico dominio l'autore non conta più", 'No, e può anche firmarlo con il proprio nome', 'Solo se la presentazione viene venduta', 'No, basta scrivere "immagine presa dalla rete"'],
		why: ["Un'opera nel pubblico dominio si usa senza chiedere niente, citando sempre l'autore.", "Chi legge deve poter risalire all'originale: titolo, autore e fonte si indicano comunque."]
	},
	{
		id: 'propria',
		text: (N) => `${N} ha scattato una foto e vuole che gli altri possano usarla, indicando chi l'ha fatta.`,
		ask: 'Che cosa può fare?',
		right: 'Scegliere per la foto una licenza, per esempio CC BY, che dice agli altri che cosa possono farne',
		wrong: ['Niente: solo i fotografi di professione hanno diritti sulle foto', 'Registrarla, perché senza registrazione non è protetta', 'Aggiungere il simbolo ©, senza il quale la foto non è protetta', 'Niente: una foto messa in rete è già di tutti'],
		why: ['Sulle foto che scatti hai gli stessi diritti di ogni autore, senza registrazione e senza simboli.', 'Con una licenza dici agli altri che cosa possono farne: CC BY permette di usarla indicando l\'autore.']
	},
	{
		id: 'fotomontaggio',
		text: (N) => `Per un lavoro di scuola ${N} vuole fare un fotomontaggio con un'immagine che ha licenza CC BY-NC-ND.`,
		right: "Rinunciare al fotomontaggio: ND permette di usare l'immagine solo com'è",
		wrong: ['Farlo, perché la scuola non ci guadagna', "Farlo, indicando l'autore", 'Farlo, dando al fotomontaggio la stessa licenza', 'Farlo, perché le licenze riguardano solo chi vende'],
		why: ["Nella sigla c'è ND, non opere derivate: l'immagine si può condividere solo com'è.", "La si può usare intera, indicando l'autore, perché la scuola non ne ricava un guadagno; per il fotomontaggio serve un'altra immagine."]
	}
];

/** The four parts of an attribution, for the works with a Creative Commons licence. */
const TITLES = ['Tramonto sul lago', 'Mercato del sabato', 'Neve in città', 'Il vecchio faro', 'Girasoli', 'Ponte di legno'];
const AUTHORS = ['Anna Rossi', 'Paolo Bianchi', 'Irene Conti', 'Marco Gallo', 'Lucia Ferri', 'Dario Marino'];
const SOURCES = ['foto.esempio.it', 'immagini.esempio.it', 'archivio.esempio.it', 'galleria.esempio.it'];

function credits(rng: Rng): Built {
	const title = rng.pick(TITLES);
	const author = rng.pick(AUTHORS);
	const source = rng.pick(SOURCES);
	const code = rng.pick(LICENCES).code;
	const N = rng.pick(NAMES);
	const part = { title: `"${title}"`, author: `di ${author}`, source: `da ${source}`, licence: `licenza CC ${code}` };
	const line = (missing: string) => {
		const head = [missing === 'title' ? 'Foto' : part.title, ...(missing === 'author' ? [] : [part.author])].join(' ');
		return [head, ...(missing === 'source' ? [] : [part.source]), ...(missing === 'licence' ? [] : [part.licence])].join(', ');
	};
	const answer = choose(
		rng,
		textOption(line(''), 'completa'),
		shuffle(rng, ['licence', 'author', 'source', 'title']).map((m) => textOption(line(m), `senza:${m}`))
	);
	return asked('Scrivi i crediti di un\'opera.', `${N} usa in una slide una foto con licenza Creative Commons. Quale di queste attribuzioni è completa?`, answer, ["L'attribuzione di un'opera con licenza Creative Commons ha quattro parti: titolo, autore, fonte e licenza.", 'In ognuna delle altre tre manca una delle quattro parti.'], { case: 'crediti', title, author, source, licence: `CC ${code}`, name: N });
}

const level6 = (rng: Rng): Built => (rng.next() < 0.25 ? credits(rng) : situationLevel(rng, 'Scegli il comportamento giusto.', SITUATIONS));

export default makeGenerator(ID, "Diritto d'autore e licenze", {
	1: { label: "Che cosa protegge il diritto d'autore", constraints: ['one true statement among three false ones, or one false among three true, half each'], build: (rng) => statementLevel(rng, 'Distingui il vero dal falso.', "sul diritto d'autore", TRUE, FALSE) },
	2: { label: 'Citazione, plagio o permesso', constraints: ['a situation with a name; options: quotation, plagiarism, a use that needs permission, public domain', 'the four answers about a quarter each'], build: (rng) => sortLevel(rng, "Riconosci l'uso che viene fatto di un'opera.", 'Di che cosa si tratta?', USES, USE_TEXTS, USE_WHY) },
	3: { label: 'Leggere una sigla Creative Commons', constraints: ['a licence and a use drawn first; the verdict follows from the elements NC, ND, SA of the code', 'never two reasons to say no at once'], build: level3 },
	4: { label: 'Scegliere la licenza', constraints: ['the choices of an author on commercial use and on changes; the right option is the code built from them', 'options: four of the six licences'], build: level4 },
	5: { label: 'Le licenze del software', constraints: ['a description of a program and its kind of licence; or what can, or cannot, be done with a proprietary program, a freeware, a free program'], build: level5 },
	6: { label: 'In una ricerca o in una presentazione', constraints: ['a situation with a name, the right thing to do and three of its wrong ones; or the complete attribution among three that miss a part'], build: level6 }
});
