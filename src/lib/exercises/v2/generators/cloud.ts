/**
 * Il cloud: archiviare, condividere e lavorare insieme. Spec: specs/exercises/cloud.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/39-cloud.md), all multiple choice: what the cloud
 * is (true and false); how much space files take, counted; what synchronisation does in a situation; the lowest
 * permission that is enough for someone; invitation or link, and who can open the file, counted; working together
 * (the remedy for a situation, true and false).
 */
import { choose, makeGenerator, shuffle, textOption, type Built } from '../inf-programmi';
import { NAMES, num, statementLevel, take, the, to, type Statement } from '../inf-web2';
import type { Rng } from '../types';

export const ID = 'cloud';

// ---------------------------------------------------------------------------
// Level 1: what the cloud is

const CLOUD_TRUE: Statement[] = [
	{ id: 't1', text: 'I file del cloud stanno su computer veri, i server', why: 'Di nuvole non ce ne sono: i file del cloud stanno su computer remoti, i server.' },
	{ id: 't2', text: 'Un data center è un edificio che ospita migliaia di server', why: 'Un data center è un edificio costruito apposta, con migliaia di server, alimentazione di riserva e raffreddamento.' },
	{ id: 't3', text: 'Nel cloud ogni file è registrato in più copie su macchine diverse', why: 'Ogni file è registrato in più copie su macchine diverse, così il guasto di un disco non lo fa perdere.' },
	{ id: 't4', text: 'Quando chiede un file al cloud, il tuo telefono fa da client', why: 'Il telefono chiede il file e il server lo manda: il telefono fa da client.' },
	{ id: 't5', text: 'Le risorse del cloud si raggiungono attraverso Internet', why: "Il cloud è l'uso, attraverso Internet, di risorse che appartengono a computer remoti." },
	{ id: 't6', text: 'Con il cloud usi spazio e programmi senza possedere le macchine', why: 'Le risorse del cloud sono offerte come un servizio: le usi senza possedere le macchine.' },
	{ id: 't7', text: 'I server di un data center restano accesi giorno e notte', why: 'I server di un data center restano accesi giorno e notte, per questo i file si raggiungono in qualunque momento.' },
	{ id: 't8', text: 'Nel cloud usi le risorse quando ti servono e nella quantità che ti serve', why: 'Le risorse del cloud si usano quando servono e nella quantità che serve.' }
];
const CLOUD_FALSE: Statement[] = [
	{ id: 'f1', text: 'I file del cloud non stanno su nessun computer', why: 'I file del cloud stanno su computer veri: i server di un data center.' },
	{ id: 'f2', text: "Un data center è un'app da installare sul telefono", why: 'Un data center è un edificio che ospita migliaia di server.' },
	{ id: 'f3', text: 'Per usare il cloud devi comprare un server', why: 'Chi usa il cloud non compra né cura niente: usa le macchine di un fornitore.' },
	{ id: 'f4', text: 'Nel cloud ogni file sta in una sola copia, su un solo disco', why: 'Nel cloud ogni file è registrato in più copie su macchine diverse.' },
	{ id: 'f5', text: 'Quando chiede un file al cloud, il tuo telefono fa da server', why: 'Il telefono che chiede un file fa da client; il server è il computer che lo manda.' },
	{ id: 'f6', text: 'Il cloud si raggiunge anche senza nessuna rete', why: 'Le risorse del cloud stanno su computer remoti e si raggiungono attraverso Internet.' },
	{ id: 'f7', text: 'Nel cloud il guasto di un disco fa perdere i file che conteneva', why: 'I file sono in più copie su macchine diverse: il guasto di un disco non li fa perdere.' },
	{ id: 'f8', text: 'Il cloud offre solo spazio per i file, non programmi né capacità di calcolo', why: 'Il cloud offre spazio per i file, programmi e capacità di calcolo.' }
];

// ---------------------------------------------------------------------------
// Level 2: how much space

/** What is kept, and the sizes in MB it may have. */
const KEPT: [string, number[]][] = [
	['foto', [2, 4, 5, 8]],
	['canzoni', [4, 5, 8]],
	['documenti', [1, 2]]
];
const decimal = (x: number) => String(Number(x.toFixed(3))).replace('.', ',');
const RULE = 'Usa 1 GB = 1000 MB.';

function level2(rng: Rng): Built {
	const kind = rng.pick(['quante', 'occupano', 'restano'] as const);
	const prompt = 'Fai i conti con lo spazio nel cloud.';
	if (kind === 'quante') {
		const space = rng.pick([2, 5, 10, 15, 20, 50]);
		const [what, sizes] = rng.pick(KEPT);
		const size = rng.pick(sizes);
		const right = (space * 1000) / size;
		const o = (n: number) => textOption(`${num(n)} ${what}`, String(n));
		const wrong = [(space * 100) / size, space * size, (space * 10000) / size, space * 1000].filter((n) => Number.isInteger(n) && n !== right);
		return {
			prompt,
			problem: `Un servizio di archiviazione offre ${space} GB di spazio. ${what === 'documenti' ? 'Quanti' : 'Quante'} ${what} da ${size} MB ci stanno? ${RULE}`,
			solution: `${num(right)} ${what}`,
			steps: [`Si passa ai megabyte: ${space} GB sono ${space} · 1000 = ${num(space * 1000)} MB.`, `Si divide lo spazio per la dimensione di un file: ${num(space * 1000)} : ${size} = ${num(right)} ${what}.`],
			answer: choose(rng, o(right), wrong.map(o)),
			params: { case: kind, space, what, size }
		};
	}
	const N = rng.pick(NAMES);
	if (kind === 'occupano') {
		const size = rng.pick([100, 200, 250, 400, 500]);
		// 250 MB only with an even number of videos: the gigabytes keep one decimal digit at most
		const n = rng.pick(size === 250 ? [4, 8, 10, 12, 20] : [4, 5, 8, 10, 12, 20, 25]);
		const total = n * size;
		const o = (gb: number) => textOption(`${decimal(gb)} GB`, String(Number(gb.toFixed(3))));
		return {
			prompt,
			problem: `${N} tiene nel cloud ${n} video da ${size} MB ciascuno. Quanti GB occupano in tutto? ${RULE}`,
			solution: `${decimal(total / 1000)} GB`,
			steps: [`I video occupano ${n} · ${size} = ${num(total)} MB.`, `Per passare ai gigabyte si divide per 1000: ${num(total)} : 1000 = ${decimal(total / 1000)} GB.`],
			answer: choose(rng, o(total / 1000), [o(total), ...shuffle(rng, [o(total / 100), o(total / 10000), o(total / 10)])]),
			params: { case: kind, name: N, videos: n, size }
		};
	}
	let space: number, n: number, size: number, photo: number;
	do {
		space = rng.pick([5, 10, 15]);
		n = rng.int(2, 10);
		size = rng.pick([200, 250, 400, 500]);
		photo = rng.pick([2, 4, 5]);
	} while (n * size >= space * 1000 || (space * 1000 - n * size) % photo !== 0);
	const rest = space * 1000 - n * size;
	const right = rest / photo;
	const o = (k: number) => textOption(`${num(k)} foto`, String(k));
	const wrong = [(space * 1000) / photo, rest, (n * size) / photo, (space * 1000 - size) / photo, (space * 1000 + n * size) / photo].filter((k) => Number.isInteger(k) && k !== right);
	return {
		prompt,
		problem: `Lo spazio di ${N} nel cloud è di ${space} GB. Ci sono già ${n} video da ${size} MB ciascuno. Quante foto da ${photo} MB ci stanno ancora? ${RULE}`,
		solution: `${num(right)} foto`,
		steps: [
			`Lo spazio è di ${space} · 1000 = ${num(space * 1000)} MB, e i video ne occupano ${n} · ${size} = ${num(n * size)}.`,
			`Restano ${num(space * 1000)} − ${num(n * size)} = ${num(rest)} MB, dove stanno ${num(rest)} : ${photo} = ${num(right)} foto.`
		],
		answer: choose(rng, o(right), wrong.map(o)),
		params: { case: kind, name: N, space, videos: n, size, photo }
	};
}

// ---------------------------------------------------------------------------
// Level 3: synchronisation

const THINGS = ['foto della gita', 'presentazione di storia', 'relazione di scienze', 'registrazione del concerto', 'tabella dei voti', 'mappa del percorso'];

/** A situation (N is a name, x the thing), its question, the right outcome and the wrong ones. */
const SYNCS: Record<string, { text: (N: string, x: string) => string; ok: string; wrong: string[]; why: string }> = {
	cancella: {
		text: (N, x) => `${N} ha una ${x} sul telefono, sincronizzata con il cloud, e la cancella dal telefono per fare spazio. Che cosa succede alla ${x}?`,
		ok: 'Sparisce anche dal cloud e dagli altri dispositivi',
		wrong: ['Resta nel cloud, che ne tiene una copia di sicurezza', 'Sparisce dal telefono ma resta sugli altri dispositivi', 'Resta dappertutto: la sincronizzazione annulla la cancellazione', 'Resta nel cloud ma sparisce dagli altri dispositivi'],
		why: 'La sincronizzazione tiene uguali le copie: una cancellazione è una modifica come le altre, e viene trasmessa al server e agli altri dispositivi. Di solito il file resta per un po\' nel cestino del servizio.'
	},
	locale: {
		text: (N, x) => `${N} ha una ${x} sul telefono, sincronizzata con il cloud, e usa la funzione dell'app che libera memoria togliendo solo la copia locale. Che cosa succede alla ${x}?`,
		ok: 'Sparisce solo dal telefono e resta nel cloud',
		wrong: ['Sparisce anche dal cloud e dagli altri dispositivi', 'Viene cancellata per sempre da tutti i dispositivi', 'Resta sul telefono e sparisce dal cloud', 'Resta sul telefono: la memoria non si libera'],
		why: "La funzione dell'app toglie solo la copia che sta sul telefono: quella sul server resta, e con lei quelle degli altri dispositivi. È il modo giusto di liberare memoria."
	},
	offline: {
		text: (N, x) => `${N} modifica una ${x} in treno, senza connessione. Che cosa succede alla modifica?`,
		ok: 'Resta sul dispositivo e viene caricata quando torna la rete',
		wrong: ['Va persa: senza connessione il file non si può modificare', 'Arriva subito al server, anche senza rete', 'Resta per sempre solo su quel dispositivo', 'Viene annullata appena la rete torna'],
		why: 'Una modifica fatta senza connessione resta sul dispositivo, e viene caricata sul server appena la rete torna.'
	},
	conflitto: {
		text: (N, x) => `${N} modifica una ${x} sul computer senza connessione, e nel frattempo la cambia anche dal telefono. Quando la rete torna, che cosa fa di solito il servizio?`,
		ok: 'Conserva le due versioni come due file distinti',
		wrong: ["Tiene la versione più recente e cancella l'altra", 'Cancella tutte e due le versioni', 'Unisce da solo le due versioni in un file unico', 'Tiene la versione del computer, che conta più del telefono'],
		why: 'Il servizio non sa quale delle due versioni vuoi: di solito le conserva entrambe come due file distinti, e lascia a te la scelta.'
	},
	nuova: {
		text: (N, x) => `${N} salva una ${x} sul telefono, con la sincronizzazione attiva e la rete che funziona. Che cosa succede alla ${x}?`,
		ok: "Viene copiata sul server e da lì sugli altri dispositivi dell'account",
		wrong: ['Resta solo sul telefono finché non la spedisci tu', 'Viene spostata sul server e tolta dal telefono', 'Arriva agli altri dispositivi senza passare dal server', 'Arriva a tutti i contatti della rubrica'],
		why: 'La sincronizzazione trasmette ogni modifica al server, e da lì a tutti i dispositivi collegati allo stesso account, senza che tu faccia niente.'
	}
};

function level3(rng: Rng): Built {
	const kind = rng.pick(Object.keys(SYNCS));
	const s = SYNCS[kind];
	const N = rng.pick(NAMES);
	const thing = rng.int(0, THINGS.length - 1);
	const wrong = take(rng, [0, 1, 2, 3], 3);
	return {
		prompt: 'Prevedi che cosa fa la sincronizzazione.',
		problem: s.text(N, THINGS[thing]),
		solution: s.ok,
		steps: [s.why, 'Sincronizzare vuol dire tenere uguali la copia sul dispositivo e quella sul server: non è fare una copia di sicurezza.'],
		answer: choose(
			rng,
			textOption(s.ok, `${kind}:ok`),
			wrong.map((i) => textOption(s.wrong[i], `${kind}:w${i + 1}`))
		),
		params: { case: kind, name: N, thing, wrong }
	};
}

// ---------------------------------------------------------------------------
// Level 4: the permission

const FILES = ['il documento del progetto', 'il foglio dei turni', 'il testo della ricerca', 'il file della presentazione'];
const ACCESS = ['nessuno', 'lettura', 'commento', 'modifica'] as const;
const ACCESS_LABEL = ['Nessun accesso', 'Lettura', 'Commento', 'Modifica'];
const CAN = ['Niente: non può nemmeno aprirlo', "Aprirlo e leggerlo, e nient'altro", 'Leggerlo e lasciare commenti a margine, senza cambiare il contenuto', 'Leggerlo e cambiarne il contenuto'];
/** What someone must do with the file, by the permission it takes (1 lettura, 2 commento, 3 modifica). */
const NEEDS: [string, number, string][] = [
	['r1', 1, 'leggerlo'],
	['r2', 1, 'consultarlo quando serve'],
	['r3', 1, 'vedere a che punto è il lavoro'],
	['c1', 2, 'segnare a margine che cosa correggere, senza toccare il contenuto'],
	['c2', 2, 'lasciare un parere a margine'],
	['c3', 2, 'fare domande a margine'],
	['m1', 3, 'scriverne una parte'],
	['m2', 3, 'correggere direttamente gli errori'],
	['m3', 3, 'aggiungere i dati nuovi']
];
const ACCESS_WHY = [
	'Chi non lavora al file e non ha motivo di vederlo non riceve nessun accesso.',
	'Per aprire il file e leggerlo basta il permesso di lettura.',
	'Per lasciare commenti a margine senza toccare il contenuto serve il permesso di commento, che comprende la lettura.',
	'Per cambiare il contenuto serve il permesso di modifica.'
];

function level4(rng: Rng): Built {
	const [N, P] = take(rng, NAMES, 2);
	const file = rng.int(0, FILES.length - 1);
	const options = (right: number, labels: string[]) =>
		choose(
			rng,
			textOption(labels[right], ACCESS[right]),
			[0, 1, 2, 3].filter((i) => i !== right).map((i) => textOption(labels[i], ACCESS[i]))
		);
	if (rng.next() < 0.3) {
		const level = rng.int(1, 3);
		return {
			prompt: 'Leggi un permesso di condivisione.',
			problem: `${P} ha ricevuto da ${N} ${FILES[file]} con il permesso di ${ACCESS[level]}. Che cosa può fare con il file?`,
			solution: CAN[level],
			steps: ['La lettura permette di aprire il file e leggerlo; il commento anche di lasciare commenti a margine, senza toccare il contenuto; la modifica di cambiare il contenuto.', `Con il permesso di ${ACCESS[level]}: ${CAN[level].charAt(0).toLowerCase() + CAN[level].slice(1)}.`],
			answer: options(level, CAN),
			params: { case: 'cosa', names: [N, P], file, permission: ACCESS[level] }
		};
	}
	const prompt = 'Scegli il permesso di condivisione.';
	const ask = `Quale accesso conviene dare ${to(P)}, il più basso che basta?`;
	const r = rng.next();
	if (r < 0.12)
		return {
			prompt,
			problem: `${N} sta per condividere ${FILES[file]} con il suo gruppo. ${P} non lavora al file e non ha motivo di vederlo. ${ask}`,
			solution: ACCESS_LABEL[0],
			steps: [ACCESS_WHY[0], 'La regola è dare a ciascuno il permesso più basso che gli basta: a chi non serve niente, niente.'],
			answer: options(0, ACCESS_LABEL),
			params: { case: 'basta', names: [N, P], file, needs: [] }
		};
	const first = rng.pick(NEEDS);
	const second = r < 0.55 ? rng.pick(NEEDS.filter((n) => n[1] !== first[1])) : null;
	const needs = second ? [first, second].sort((a, b) => a[1] - b[1]) : [first];
	const level = Math.max(...needs.map((n) => n[1]));
	return {
		prompt,
		problem: `${N} condivide ${FILES[file]} con ${P}, che deve ${needs.length === 1 ? 'solo ' : ''}${needs.map((n) => n[2]).join(' e ')}. ${ask}`,
		solution: ACCESS_LABEL[level],
		steps: [ACCESS_WHY[level], `La regola è dare a ciascuno il permesso più basso che gli basta: ${level === 3 ? 'qui serve il più alto, perché il contenuto va cambiato' : 'chi non deve cambiare il contenuto non ha motivo di poterlo cancellare'}.`],
		answer: options(level, ACCESS_LABEL),
		params: { case: 'basta', names: [N, P], file, needs: needs.map((n) => n[0]) }
	};
}

// ---------------------------------------------------------------------------
// Level 5: invitation or link

const SHARED = ['la relazione di gruppo', 'le foto della gita', 'la presentazione di storia', 'il video del saggio'];
const persons = (n: number) => textOption(n === 1 ? '1 persona' : `${n} persone`, String(n));

/** What is shared and with whom: the way (invito, link), the permission, the text. */
const SHARES: [string, string, string][] = [
	['invito', 'modifica', 'un elenco con i nomi e i numeri di telefono della classe, che solo i due rappresentanti devono tenere aggiornato'],
	['invito', 'lettura', 'la tabella con i voti del suo gruppo, che solo i tre compagni devono poter guardare'],
	['invito', 'modifica', 'la relazione di laboratorio, a cui devono scrivere solo i suoi due compagni di gruppo'],
	['invito', 'commento', 'la bozza della tesina, su cui solo la professoressa deve segnare a margine le correzioni'],
	['invito', 'lettura', 'le foto della sua festa di compleanno, da far vedere solo ai cugini'],
	['link', 'lettura', 'il volantino della festa della scuola, che deve poter leggere chiunque, anche chi non conosce'],
	['link', 'lettura', 'il regolamento del torneo, da far leggere a tutte le squadre e a chiunque voglia iscriversi'],
	['link', 'lettura', 'il programma del concerto, da far girare tra tutti: può aprirlo chiunque, e nessuno deve cambiarlo'],
	['link', 'commento', 'la bozza del giornalino, su cui chiunque nella scuola può lasciare un commento, senza toccare il testo']
];
const WAYS: Record<string, string> = { invito: 'Con un invito a persone precise', link: 'Con un link aperto a chiunque' };
const share = (way: string, permission: string) => textOption(`${WAYS[way]}, in ${permission}`, `${way}:${permission}`);

function level5(rng: Rng): Built {
	const prompt = 'Scegli tra invito e link.';
	const N = rng.pick(NAMES);
	if (rng.next() < 0.55) {
		const link = rng.next() < 0.5;
		const k = rng.int(3, 9);
		let j = rng.int(2, 12);
		if (j === k) j += 1;
		const file = rng.int(0, SHARED.length - 1);
		const right = link ? k + j : k;
		return {
			prompt,
			problem: link
				? `${N} condivide ${SHARED[file]} con un link aperto a chiunque lo abbia, e lo manda a ${k} compagni. Uno di loro inoltra il link ad altre ${j} persone. Quante persone, oltre ${to(N)}, possono aprire il file?`
				: `${N} condivide ${SHARED[file]} con un invito agli indirizzi di ${k} compagni. Uno di loro inoltra il messaggio di invito ad altre ${j} persone. Quante persone, oltre ${to(N)}, possono aprire il file?`,
			solution: `${right} persone`,
			steps: link
				? [`Un link aperto a chiunque apre il file a chi lo possiede: ${the(k)} ${k} compagni e le ${j} persone a cui è stato inoltrato, ${k} + ${j} = ${right}.`, 'Per questo un link aperto non è privato: si copia e si inoltra.']
				: [`Con un invito il file si apre solo alle persone indicate con il loro indirizzo, dopo che sono entrate con il proprio account: ${the(k)} ${k} compagni.`, `Le altre ${j} persone hanno ricevuto il messaggio, ma non sono tra gli invitati: il file per loro resta chiuso.`],
			answer: choose(rng, persons(right), link ? [persons(k), ...shuffle(rng, [persons(j), persons(k + j + 1), persons(k + j - 1)])] : [persons(k + j), ...shuffle(rng, [persons(j), persons(k + j + 1), persons(k - 1)])]),
			params: { case: link ? 'apre con il link' : "apre con l'invito", name: N, file, sent: k, forwarded: j }
		};
	}
	const s = rng.int(0, SHARES.length - 1);
	const [way, permission, text] = SHARES[s];
	const otherWay = way === 'invito' ? 'link' : 'invito';
	const otherPermissions = shuffle(
		rng,
		['lettura', 'commento', 'modifica'].filter((p) => p !== permission)
	);
	return {
		prompt,
		problem: `${N} deve condividere ${text}. Come conviene condividere il file?`,
		solution: `${WAYS[way]}, in ${permission}`,
		steps: [
			way === 'invito' ? 'Il file riguarda persone precise: si usa un invito ai loro indirizzi, così lo aprono solo loro. Un link aperto si può inoltrare a chiunque.' : 'Il file è per chiunque, anche per persone di cui non hai l\'indirizzo, e non contiene dati personali: basta un link.',
			`Il permesso è il più basso che basta: ${permission === 'modifica' ? 'qui il contenuto va cambiato, quindi modifica' : permission === 'commento' ? 'qui si devono lasciare commenti senza toccare il testo, quindi commento' : 'qui basta leggere, quindi lettura'}.`
		],
		answer: choose(rng, share(way, permission), [share(otherWay, permission), share(way, otherPermissions[0]), share(otherWay, otherPermissions[1])]),
		params: { case: 'modo', name: N, share: s, others: otherPermissions }
	};
}

// ---------------------------------------------------------------------------
// Level 6: working together

const DOCS = ['relazione di scienze', 'presentazione di storia', 'ricerca di geografia', 'tesina'];
const REMEDIES = {
	cronologia: 'Aprire la cronologia delle versioni',
	cestino: 'Guardare nel cestino del servizio',
	commento: 'Lasciare un commento accanto al testo',
	copia: 'Tenere una seconda copia fuori dal cloud',
	togliere: 'Togliere la condivisione'
} as const;
type Remedy = keyof typeof REMEDIES;
/** Situations: N is a name, d a document (feminine). */
const TROUBLES: [Remedy, (N: string, d: string) => string][] = [
	['cronologia', (N, d) => `${N} si accorge che ieri sera qualcuno ha cancellato per sbaglio una sezione della ${d} condivisa, e da allora il file è stato salvato molte volte.`],
	['cronologia', (N, d) => `${N} vuole rivedere com'era due giorni fa un paragrafo della ${d} condivisa, che nel frattempo è stato riscritto.`],
	['cestino', (N, d) => `${N} ha cancellato per errore dal suo spazio nel cloud tutto il file della ${d}, dieci minuti fa.`],
	['cestino', (N, d) => `${N} ha tolto dal telefono, con la sincronizzazione attiva, il file della ${d}, che così è sparito anche dal cloud.`],
	['commento', (N, d) => `${N} non è d'accordo con una frase scritta da un compagno nella ${d} condivisa, e vuole discuterne senza cambiarla di nascosto.`],
	['commento', (N, d) => `${N} ha un dubbio su un dato della ${d} condivisa e vuole chiederlo al gruppo, lasciando il testo com'è.`],
	['copia', (N, d) => `${N} ha il file della ${d} solo nel cloud, e teme di perderlo se un giorno dimentica la password dell'account.`],
	['copia', (N, d) => `${N} ha il file della ${d} solo nel cloud, e teme di perderlo se il servizio che usa dovesse chiudere.`],
	['togliere', (N, d) => `Il lavoro è finito e consegnato, ma il file della ${d}, con i dati dei compagni, è ancora aperto a chiunque abbia il link: ${N} vuole che torni privato.`],
	['togliere', (N, d) => `${N} aveva condiviso con un link il file della ${d}, e ora quel link gira in chat che non conosce. Il lavoro è finito da tempo.`]
];
const REMEDY_WHY: Record<Remedy, string> = {
	cronologia: 'La cronologia delle versioni conserva gli stati precedenti del file, con la data e il nome di chi ha fatto ogni modifica: si riapre la versione vecchia e si copia la parte che serve.',
	cestino: 'Un file cancellato resta per qualche tempo nel cestino del servizio, da cui si può recuperare. La cronologia delle versioni serve per ciò che è cambiato dentro un file.',
	commento: 'In un lavoro a più mani i commenti servono a discutere di una frase al posto di cambiarla senza avvisare.',
	copia: 'Un account si può perdere, per una password dimenticata o un servizio che chiude: per i file che contano si tiene una seconda copia fuori dal cloud, su un disco esterno o una chiavetta.',
	togliere: 'Un link aperto si copia e si inoltra: quando il lavoro è finito si toglie la condivisione, e il file torna privato.'
};

const WORK_TRUE: Statement[] = [
	{ id: 't1', text: 'In un file condiviso in modifica più persone possono scrivere nello stesso momento', why: 'In un file condiviso in modifica più persone scrivono nello stesso momento, e ognuna vede le modifiche delle altre.' },
	{ id: 't2', text: 'La cronologia delle versioni dice chi ha fatto ogni modifica e quando', why: 'La cronologia delle versioni elenca gli stati precedenti del file, con la data e il nome di chi ha fatto ogni modifica.' },
	{ id: 't3', text: 'Da una versione vecchia si può copiare solo la parte che serve', why: 'Una versione vecchia si può riaprire e copiarne solo una parte, senza perdere le modifiche fatte dopo.' },
	{ id: 't4', text: 'Con un file condiviso il documento è uno solo e tutti scrivono lì', why: 'Con un file condiviso in modifica il documento è uno solo: non circolano copie diverse.' },
	{ id: 't5', text: 'Senza connessione si usano solo i file già scaricati', why: 'Senza connessione si usano solo i file già scaricati sul dispositivo: è un limite del cloud.' },
	{ id: 't6', text: 'Chi entra nel tuo account entra in tutti i tuoi file', why: "Tutto quello che hai nel cloud è protetto dall'accesso al tuo account: chi entra lì entra in tutti i tuoi file." },
	{ id: 't7', text: "Un'applicazione web si usa dal browser, senza installarla", why: "Un'applicazione web è un programma che si usa dal browser, senza installarlo." },
	{ id: 't8', text: "Quando un'applicazione web viene aggiornata, tutti hanno subito la versione nuova", why: "Un'applicazione web sta sul server: quando viene aggiornata, tutti hanno subito la versione nuova." },
	{ id: 't9', text: 'Se il telefono si rompe, i file che stanno nel cloud restano', why: 'I file del cloud stanno sui server: se il telefono si rompe o viene perso, restano.' },
	{ id: 't10', text: 'Ripristinare per intero una versione vecchia fa sparire le modifiche fatte dopo', why: 'Ripristinando per intero una versione vecchia, le modifiche fatte dopo spariscono dal documento: conviene copiare solo la parte che serve.' }
];
const WORK_FALSE: Statement[] = [
	{ id: 'f1', text: 'In un file condiviso può scrivere una sola persona alla volta', why: 'In un file condiviso in modifica più persone possono scrivere nello stesso momento.' },
	{ id: 'f2', text: 'In un documento condiviso bisogna ricordarsi di salvare con un comando', why: 'In un documento condiviso il salvataggio è continuo: non c\'è un comando da ricordare.' },
	{ id: 'f3', text: 'Con gli allegati tutti lavorano sempre sulla stessa copia del file', why: 'Con gli allegati ognuno modifica la sua copia, e circolano versioni diverse dello stesso file.' },
	{ id: 'f4', text: "La cronologia delle versioni conserva solo l'ultima versione", why: 'La cronologia delle versioni conserva gli stati precedenti del file, non solo l\'ultimo.' },
	{ id: 'f5', text: 'Tutti i file del cloud si aprono anche senza connessione', why: 'Senza connessione si aprono solo i file già scaricati sul dispositivo.' },
	{ id: 'f6', text: "Un'applicazione web va installata su ogni dispositivo", why: "Un'applicazione web non si installa: si usa dal browser." },
	{ id: 'f7', text: 'Se il telefono si rompe, i file del cloud vanno persi', why: 'I file del cloud stanno sui server: se il telefono si rompe, restano.' },
	{ id: 'f8', text: 'Un file tenuto solo nel cloud è al sicuro in qualunque caso', why: 'Un account si può perdere: una copia in un posto solo non è al sicuro, e per i file che contano se ne tiene una seconda fuori dal cloud.' },
	{ id: 'f9', text: 'Per aprire un documento nel cloud serve un computer potente', why: 'Il lavoro pesante lo fa il server: lo stesso documento si apre anche da un computer vecchio o dal telefono.' },
	{ id: 'f10', text: 'Nel cloud i tuoi dati stanno su computer tuoi, alle tue condizioni', why: "Nel cloud i dati stanno sui computer di un'azienda, che detta le condizioni." }
];

function level6(rng: Rng): Built {
	const prompt = 'Ragiona sul lavoro di gruppo nel cloud.';
	if (rng.next() < 0.5) return statementLevel(rng, WORK_TRUE, WORK_FALSE, 'sul lavoro nel cloud', prompt);
	const t = rng.int(0, TROUBLES.length - 1);
	const [remedy, text] = TROUBLES[t];
	const N = rng.pick(NAMES);
	const doc = rng.int(0, DOCS.length - 1);
	const others = take(
		rng,
		(Object.keys(REMEDIES) as Remedy[]).filter((x) => x !== remedy),
		3
	);
	const o = (x: Remedy) => textOption(REMEDIES[x], x);
	return {
		prompt,
		problem: `${text(N, DOCS[doc])} Che cosa conviene fare?`,
		solution: REMEDIES[remedy],
		steps: [REMEDY_WHY[remedy], 'Ogni strumento risponde a un problema diverso: la cronologia a ciò che è cambiato dentro un file, il cestino a un file cancellato, i commenti alle discussioni, la seconda copia alla perdita dell\'account, togliere la condivisione a un file rimasto aperto.'],
		answer: choose(rng, o(remedy), others.map(o)),
		params: { case: 'rimedio', trouble: t, name: N, doc, others }
	};
}

export default makeGenerator(ID, 'Il cloud: archiviare, condividere e lavorare insieme', {
	1: { label: "Che cos'è il cloud", constraints: ["l'affermazione vera tra tre false, o la falsa tra tre vere, circa metà ciascuno, su server, data center, copie e risorse"], build: (rng) => statementLevel(rng, CLOUD_TRUE, CLOUD_FALSE, 'sul cloud', "Ragiona su che cos'è il cloud.") },
	2: { label: 'Quanto spazio serve', constraints: ['un conto con 1 GB = 1000 MB: quanti file stanno in uno spazio, quanti GB occupano dei video, quante foto stanno nello spazio rimasto; un terzo ciascuno, risultati interi (i GB con al più una cifra decimale)'], build: level2 },
	3: { label: 'Che cosa fa la sincronizzazione', constraints: ['una situazione tra cinque (cancellare, liberare memoria, modificare senza rete, due modifiche in conflitto, un file nuovo) e che cosa succede; un quinto ciascuna'], build: level3 },
	4: { label: 'Scegliere il permesso', constraints: ['quello che una persona deve fare con un file (uno o due bisogni, o nessuno) e il permesso più basso che basta (circa 7 su 10); che cosa permette un permesso'], build: level4 },
	5: { label: 'Invito o link', constraints: ["quante persone possono aprire un file condiviso con un invito o con un link, dopo un inoltro (circa 55 su 100); il modo e il permesso con cui condividere un file"], build: level5 },
	6: { label: 'Lavorare insieme nel cloud', constraints: ['lo strumento per una situazione (cronologia, cestino, commenti, seconda copia, togliere la condivisione), circa metà; vero o falso sul lavoro nel cloud, circa metà'], build: level6 }
});
