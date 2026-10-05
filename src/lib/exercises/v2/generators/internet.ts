/**
 * Internet, la rete delle reti. Spec: specs/exercises/internet.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/33-internet.md), all multiple choice of text, made
 * of interchangeable pieces: local and wide networks; the words of a network of networks; where a fault is, from
 * what still works (the Wi-Fi is not Internet); the count of the packets of a file, built backwards; what a
 * protocol settles; true and false statements.
 */
import { NAMES, cap, choose, makeGenerator, num, oneAmong, rightLabel, shuffle, statementLevel, textOption, type Built, type Item, type Statement } from '../inf-web1';
import type { Rng } from '../types';

export const ID = 'internet';

// ---------------------------------------------------------------------------
// Level 1: local networks and wide networks

const LOCAL: Item[] = [
	['l1', 'la rete che collega i dispositivi di una casa allo stesso router'],
	['l2', 'la rete dei computer del laboratorio di una scuola'],
	['l3', 'la rete che unisce le casse e i computer di un solo negozio'],
	['l4', 'la rete dei computer e delle stampanti di un ufficio'],
	['l5', 'la rete Wi-Fi a cui si collegano i tablet di una classe'],
	['l6', 'la rete dei computer di una biblioteca di quartiere'],
	['l7', 'la rete Wi-Fi di un appartamento, con telefono, console e televisore'],
	['l8', 'la rete dei computer di uno studio medico']
];
const WIDE: Item[] = [
	['g1', 'la rete di una compagnia telefonica che copre tutta Italia'],
	['g2', 'la rete che collega le sedi di una banca in venti città'],
	['g3', 'la rete di un fornitore di accesso che serve una regione intera'],
	['g4', 'la rete che unisce le università di uno Stato'],
	['g5', 'la rete che collega due continenti con cavi sul fondo del mare'],
	['g6', 'la rete mobile di un operatore, che copre un Paese intero'],
	['g7', 'la rete che collega gli uffici postali di tutte le province'],
	['g8', 'la rete che unisce i magazzini di una catena di negozi in più regioni']
];

function level1(rng: Rng): Built {
	const local = rng.next() < 0.5;
	const { right, answer, ids } = local ? oneAmong(rng, LOCAL, WIDE) : oneAmong(rng, WIDE, LOCAL);
	return {
		prompt: 'Guarda quanto è estesa ogni rete.',
		problem: local ? 'Quale di queste è una rete locale (LAN)?' : 'Quale di queste è una rete geografica (WAN)?',
		solution: rightLabel(answer),
		steps: [
			'Una rete locale copre una casa, un ufficio o una scuola. Una rete geografica copre una regione, uno Stato o più Stati, e collega reti lontane.',
			local ? `${cap(right[1])} sta tutta nello stesso edificio: è una rete locale. Le altre tre si estendono su un territorio grande.` : `${cap(right[1])} si estende su un territorio grande: è una rete geografica. Le altre tre stanno ciascuna in un solo edificio.`
		],
		answer,
		params: { case: local ? 'locale' : 'geografica', ids }
	};
}

// ---------------------------------------------------------------------------
// Level 2: the words of a network of networks

const TERMS = {
	router: 'Il router',
	fornitore: 'Il fornitore di accesso',
	locale: 'La rete locale',
	geografica: 'La rete geografica',
	wifi: 'Il Wi-Fi',
	internet: 'Internet'
} as const;
type Term = keyof typeof TERMS;

const WHY: Record<Term, string> = {
	router: "Il router è il dispositivo che appartiene a più reti e passa i dati dall'una all'altra: in casa sta tra la rete locale e quella del fornitore.",
	fornitore: "Il fornitore di accesso è l'azienda a cui paghi l'abbonamento: la sua rete collega la tua al resto di Internet.",
	locale: 'La rete locale è quella di una casa, di un ufficio o di una scuola, e appartiene a chi la usa.',
	geografica: 'Una rete geografica copre una regione, uno Stato o più Stati: è il tipo di rete delle compagnie telefoniche.',
	wifi: 'Il Wi-Fi è solo il collegamento senza fili tra il dispositivo e il router della rete locale: non è Internet.',
	internet: 'Internet è la rete che si ottiene collegando le reti di tutto il mondo, senza un proprietario e senza un centro.'
};

const DESCRIPTIONS: [Term, string][] = [
	['router', "È un dispositivo che appartiene a più reti nello stesso momento e passa i dati dall'una all'altra."],
	['router', "È la scatola che in casa sta tra la rete locale e la rete dell'azienda a cui si paga l'abbonamento."],
	['router', "Legge l'indirizzo del destinatario di ogni pacchetto che riceve e lo passa verso la rete giusta."],
	['fornitore', "È l'azienda a cui si paga l'abbonamento perché la sua rete colleghi quella di casa al resto del mondo."],
	['fornitore', 'In inglese si chiama provider: la sua rete sta tra quella di casa tua e le altre reti.'],
	['fornitore', "È il proprietario della rete a cui il router di casa è collegato verso l'esterno."],
	['locale', 'Copre una casa, un ufficio o una scuola, e appartiene a chi la usa.'],
	['locale', "È l'insieme dei dispositivi di una casa collegati alla stessa scatola."],
	['locale', "Grazie a lei dal telefono mandi una foto alla stampante di casa, anche se l'abbonamento è scaduto."],
	['geografica', 'Copre una regione, uno Stato o più Stati, e collega tra loro reti lontane.'],
	['geografica', 'È il tipo di rete delle compagnie telefoniche, estesa su un territorio grande.'],
	['geografica', 'È una rete sola, con un solo proprietario, estesa quanto uno Stato intero.'],
	['wifi', 'È il collegamento senza fili, a onde radio, tra il tuo dispositivo e il router.'],
	['wifi', 'Usa le onde radio nel raggio di una casa o di una scuola, al posto del cavo.'],
	['wifi', 'Il telefono può mostrarlo al massimo anche quando le pagine non si aprono.'],
	['internet', 'Si ottiene collegando tra loro le reti di tutto il mondo.'],
	['internet', 'Non ha un proprietario, e non ha un centro da cui qualcuno la comanda.'],
	['internet', 'Funziona perché tutte le reti che ne fanno parte hanno accettato le stesse regole.']
];

function level2(rng: Rng): Built {
	const d = rng.int(0, DESCRIPTIONS.length - 1);
	const [term, text] = DESCRIPTIONS[d];
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
		problem: `${text} Di che cosa si parla?`,
		solution: rightLabel(answer),
		steps: [WHY[term]],
		answer,
		params: { case: term, description: d, options: answer.options.map((o) => o.values[0]) }
	};
}

// ---------------------------------------------------------------------------
// Level 3: where the fault is

const DEVICES = ['il telefono', 'il tablet', 'il portatile', 'la console'];
/** What is sent inside the house, to which device, and that device as the place of a fault. */
const TARGETS: [string, string][] = [
	['una foto alla stampante', 'Nella stampante'],
	['un video al televisore', 'Nel televisore'],
	['una canzone alla cassa senza fili', 'Nella cassa senza fili']
];
type Fault = 'uscita' | 'wifi' | 'router';

function level3(rng: Rng): Built {
	const fault = rng.pick(['uscita', 'wifi', 'router'] as const);
	const N = rng.pick(NAMES);
	const device = rng.pick(DEVICES);
	const t = rng.int(0, TARGETS.length - 1);
	const [sent, inTarget] = TARGETS[t];
	const story: Record<Fault, string> = {
		uscita: `A casa di ${N} ${device} mostra il Wi-Fi al massimo e riesce a mandare ${sent}, ma le pagine web non si aprono da nessun dispositivo.`,
		wifi: `A casa di ${N} ${device} non riesce a mandare ${sent} e non apre le pagine web. Dagli altri dispositivi di casa funzionano tutte e due le cose.`,
		router: `A casa di ${N} nessun dispositivo riesce a mandare ${sent}, e nessuno apre le pagine web.`
	};
	const steps: Record<Fault, string[]> = {
		uscita: [
			`${cap(device)} riesce a mandare ${sent}: il collegamento con il router e la rete locale funzionano.`,
			"Le pagine non si aprono da nessun dispositivo: manca l'uscita verso le altre reti, cioè il collegamento tra il router e il fornitore di accesso.",
			'Il Wi-Fi al massimo dice solo che il dispositivo raggiunge il router: il Wi-Fi non è Internet.'
		],
		wifi: ["Dagli altri dispositivi funziona tutto: il router, la rete locale e l'uscita verso il fornitore sono a posto.", `Solo ${device} è tagliato fuori, anche dalla rete locale: il guasto è nel suo collegamento con il router.`],
		router: ["Non funziona nemmeno lo scambio dentro casa, che non ha bisogno del fornitore di accesso: non manca solo l'uscita verso le altre reti.", 'Tutti i dispositivi di casa passano dal router, per parlarsi e per uscire: il guasto è lì.']
	};
	const options: Record<Fault | 'periferica', string> = {
		uscita: 'Nel collegamento tra il router e il fornitore di accesso',
		wifi: `Nel collegamento tra ${device} e il router`,
		router: 'Nel router di casa',
		periferica: inTarget
	};
	const answer = choose(
		rng,
		textOption(options[fault], fault),
		(['uscita', 'wifi', 'router', 'periferica'] as const).filter((f) => f !== fault).map((f) => textOption(options[f], f))
	);
	return {
		prompt: 'Ragiona su che cosa funziona ancora.',
		problem: `${story[fault]} Dov'è più probabile che sia il guasto?`,
		solution: rightLabel(answer),
		steps: steps[fault],
		answer,
		params: { case: fault, name: N, device, target: t }
	};
}

// ---------------------------------------------------------------------------
// Level 4: the packets of a file

const SIZES = [300, 600, 900, 1200, 1500, 1800, 2400, 3000, 4500, 6000, 7500, 9000, 12000]; // kB
const PACKETS = [500, 1000, 1250, 1500, 2000, 2500]; // B
const FILES: [string, string, string][] = [
	['Una foto', 'della foto', 'divisa'],
	['Un video', 'del video', 'diviso'],
	['Una canzone', 'della canzone', 'divisa'],
	['Un documento', 'del documento', 'diviso'],
	['Un gioco', 'del gioco', 'diviso']
];

/** 900 kB, 1,5 MB, 12 MB. */
const sizeText = (kB: number) => (kB < 1000 ? `${kB} kB` : `${String(kB / 1000).replace('.', ',')} MB`);
const bytes = (n: number) => textOption(`${num(n)} B`, String(n));
const count = (n: number) => textOption(`${num(n)} pacchetti`, String(n));

function level4(rng: Rng): Built {
	const kind = rng.pick(['pacchetti', 'pacchetti', 'dimensione', 'perso'] as const);
	const f = rng.int(0, FILES.length - 1);
	const [file, ofFile, divided] = FILES[f];
	const kB = rng.pick(SIZES);
	const packet = rng.pick(PACKETS);
	const size = kB * 1000;
	const n = size / packet;
	const params = { case: kind, file: f, size, packet, count: n };
	const prompt = 'Fai il conto dei pacchetti.';
	if (kind === 'pacchetti') {
		const answer = choose(rng, count(n), [n * 10, n / 10, n * 2, n / 2, n + 1].filter(Number.isInteger).map(count));
		return {
			prompt,
			problem: `${file} occupa ${sizeText(kB)}, cioè ${num(size)} B. Ogni pacchetto porta ${packet} B ${ofFile}. Quanti pacchetti servono?`,
			solution: rightLabel(answer),
			steps: ['Si divide la dimensione del file per quello che sta in un pacchetto, con tutte e due le misure in byte.', `${num(size)} : ${packet} = ${num(n)} pacchetti.`],
			answer,
			params
		};
	}
	if (kind === 'dimensione') {
		const answer = choose(rng, bytes(size), [size * 10, size / 10, n + packet, n * 1000, size / 2].map(bytes));
		return {
			prompt,
			problem: `${file} viaggia ${divided} in ${num(n)} pacchetti, e ogni pacchetto porta ${packet} B ${ofFile}. Quanti byte occupa in tutto?`,
			solution: rightLabel(answer),
			steps: ['Ogni pacchetto porta lo stesso numero di byte: si moltiplica il numero dei pacchetti per i byte di un pacchetto.', `${num(n)} · ${packet} = ${num(size)} B, cioè ${sizeText(kB)}.`],
			answer,
			params
		};
	}
	const lost = rng.int(2, n - 2);
	const answer = choose(rng, bytes(packet), [size, size - packet, lost * packet].map(bytes));
	return {
		prompt,
		problem: `${file} di ${sizeText(kB)}, cioè ${num(size)} B, viaggia in pacchetti che portano ${packet} B ciascuno. Il pacchetto numero ${lost} va perso. Quanti byte deve rimandare il mittente?`,
		solution: rightLabel(answer),
		steps: ['Ogni pacchetto ha il suo numero: chi riceve si accorge di quale manca e chiede di rimandare solo quello.', `Il mittente rimanda un pacchetto solo, cioè ${packet} B, e non gli altri ${num(n - 1)}.`],
		answer,
		params: { ...params, lost }
	};
}

// ---------------------------------------------------------------------------
// Level 5: what a protocol settles

const SETTLED: Item[] = [
	['d1', 'in che ordine stanno le informazioni dentro un pacchetto'],
	['d2', 'che cosa fa chi riceve quando manca un pacchetto'],
	['d3', "come si scrive l'indirizzo del destinatario"],
	['d4', 'chi dei due dispositivi parla per primo'],
	['d5', 'come si numerano i pacchetti per rimetterli in ordine'],
	['d6', 'come si chiede di rimandare un pacchetto perso'],
	['d7', 'come si capisce che un messaggio è finito'],
	['d8', 'quanti dati può portare al massimo un pacchetto']
];
const NOT_SETTLED: Item[] = [
	['n1', 'di che marca è il router'],
	['n2', 'di che colore è il cavo'],
	['n3', 'quale sistema operativo ha il telefono'],
	['n4', "quanto costa l'abbonamento del fornitore di accesso"],
	['n5', 'quanto è grande lo schermo del dispositivo'],
	['n6', 'chi è il proprietario della rete'],
	['n7', 'in quale stanza della casa sta il router'],
	['n8', 'di che materiale è la scatola del computer']
];

function level5(rng: Rng): Built {
	const settled = rng.next() < 0.5;
	const { right, answer, ids } = settled ? oneAmong(rng, SETTLED, NOT_SETTLED) : oneAmong(rng, NOT_SETTLED, SETTLED);
	return {
		prompt: 'Un protocollo è un insieme di regole per comunicare.',
		problem: settled ? 'Quale di queste cose è stabilita da un protocollo?' : 'Quale di queste cose non è stabilita da un protocollo?',
		solution: rightLabel(answer),
		steps: [
			'Un protocollo stabilisce come sono fatti i messaggi, chi parla per primo e che cosa fare quando qualcosa va storto.',
			settled
				? `${cap(right[1])} è una regola di comunicazione: la decide il protocollo. Le altre tre cose non cambiano il modo in cui i dispositivi si parlano.`
				: `${cap(right[1])} non cambia il modo in cui i dispositivi si parlano: il protocollo non se ne occupa. Le altre tre sono regole di comunicazione.`
		],
		answer,
		params: { case: settled ? 'stabilita' : 'non stabilita', ids }
	};
}

// ---------------------------------------------------------------------------
// Level 6: true and false statements

const TRUE: Statement[] = [
	{ id: 't1', text: 'Internet non ha un proprietario unico', why: 'Ogni rete ha il suo proprietario, ma Internet nel suo insieme non è di nessuno.' },
	{ id: 't2', text: 'Due pacchetti della stessa foto possono fare strade diverse', why: 'Ogni pacchetto viaggia per conto suo: due pacchetti della stessa foto possono fare strade diverse.' },
	{ id: 't3', text: 'Se un pacchetto si perde, si rimanda solo quello', why: 'Chi riceve si accorge del pacchetto che manca dal suo numero, e chiede di rimandare solo quello.' },
	{ id: 't4', text: 'I pacchetti possono arrivare in un ordine diverso da quello di partenza', why: 'I pacchetti possono arrivare in disordine: chi li riceve li rimette in fila con i loro numeri.' },
	{ id: 't5', text: 'Il web è uno dei servizi che usano Internet', why: 'Internet trasporta i pacchetti; il web è uno dei servizi che ci funzionano sopra, come la posta e le videochiamate.' },
	{ id: 't6', text: 'Una videochiamata usa Internet anche se non usa il web', why: 'Una videochiamata è un servizio di Internet diverso dal web, che è quello delle pagine aperte con il browser.' },
	{ id: 't7', text: 'Dispositivi di marche diverse comunicano se seguono gli stessi protocolli', why: 'Per scambiarsi dati due dispositivi non devono essere uguali: devono seguire le stesse regole.' },
	{ id: 't8', text: "Ogni pacchetto porta l'indirizzo del destinatario e quello del mittente", why: "Ogni pacchetto porta un pezzo dei dati, l'indirizzo del destinatario, quello del mittente e il suo numero." },
	{ id: 't9', text: "Se un collegamento si guasta, i pacchetti possono passare da un'altra strada", why: "I router sono collegati in più modi: se un collegamento si guasta, i pacchetti passano da un'altra strada." },
	{ id: 't10', text: 'Lo stesso cavo trasporta insieme i pacchetti di molte persone', why: 'I pacchetti di una persona si alternano a quelli delle altre: nessuno tiene il cavo occupato per sé.' },
	{ id: 't11', text: 'I protocolli di Internet sono pubblici', why: 'I protocolli di Internet sono pubblici: chiunque può costruire un dispositivo o scrivere un programma che li rispetta.' },
	{ id: 't12', text: 'Il Wi-Fi può funzionare anche quando il collegamento a Internet è interrotto', why: 'Il Wi-Fi collega il dispositivo al router: funziona anche quando manca il collegamento tra il router e il fornitore.' }
];
const FALSE: Statement[] = [
	{ id: 'f1', text: 'Internet e il web sono la stessa cosa', why: 'Il web è solo uno dei servizi di Internet, quello delle pagine che apri con il browser.' },
	{ id: 'f2', text: 'Il Wi-Fi e Internet sono la stessa cosa', why: 'Il Wi-Fi è il collegamento senza fili tra il dispositivo e il router: non è Internet.' },
	{ id: 'f3', text: 'Una foto attraversa Internet tutta intera, in un solo blocco', why: 'Una foto viene divisa in pacchetti, che viaggiano ognuno per conto suo.' },
	{ id: 'f4', text: 'Tutti i pacchetti di una foto fanno per forza la stessa strada', why: 'Due pacchetti della stessa foto possono fare strade diverse.' },
	{ id: 'f5', text: 'Se si perde un pacchetto bisogna rispedire tutta la foto', why: 'Se un pacchetto si perde si rimanda solo quello, non tutta la foto.' },
	{ id: 'f6', text: 'Internet appartiene a una sola grande azienda', why: 'Ogni rete ha il suo proprietario, ma Internet nel suo insieme non è di nessuno.' },
	{ id: 'f7', text: 'Due dispositivi comunicano solo se sono della stessa marca', why: 'Dispositivi di marche diverse comunicano, purché seguano gli stessi protocolli.' },
	{ id: 'f8', text: 'Internet ha un computer centrale da cui passano tutti i dati', why: 'Internet non ha un centro: i pacchetti passano di router in router, per strade diverse.' },
	{ id: 'f9', text: 'Quando mandi un messaggio vocale stai usando il web', why: 'Un messaggio vocale usa Internet, ma non il web, che è il servizio delle pagine.' },
	{ id: 'f10', text: 'Mentre scarichi un video, il cavo è occupato solo dai tuoi pacchetti', why: 'Sullo stesso cavo i tuoi pacchetti si alternano a quelli delle altre persone.' },
	{ id: 'f11', text: 'I pacchetti arrivano sempre nello stesso ordine in cui sono partiti', why: 'I pacchetti possono arrivare in disordine: li rimette in fila chi li riceve.' },
	{ id: 'f12', text: 'Basta un collegamento guasto per interrompere ogni comunicazione', why: "Se un collegamento si guasta, i pacchetti passano da un'altra strada." }
];

export default makeGenerator(ID, 'Internet, la rete delle reti', {
	1: { label: 'Reti locali e reti geografiche', constraints: ['una rete locale tra tre geografiche, o il contrario, circa metà ciascuno'], build: level1 },
	2: { label: 'Le parole delle reti', constraints: ['una descrizione: router, fornitore di accesso, rete locale, rete geografica, Wi-Fi o Internet'], build: level2 },
	3: { label: 'Il Wi-Fi non è Internet', constraints: ['il guasto dedotto da che cosa funziona ancora: uscita, Wi-Fi di un dispositivo, router, un terzo ciascuno'], build: level3 },
	4: { label: 'Quanti pacchetti', constraints: ['dimensione = pacchetti · byte per pacchetto, numeri interi; si chiede il numero dei pacchetti (metà), la dimensione o i byte da rimandare'], build: level4 },
	5: { label: 'Che cosa decide un protocollo', constraints: ['una regola di comunicazione tra tre cose che non lo sono, o il contrario'], build: level5 },
	6: { label: 'Vero o falso su Internet', constraints: ["l'affermazione vera tra tre false, o la falsa tra tre vere"], build: (rng) => statementLevel(rng, TRUE, FALSE, 'su Internet', 'Ripensa a come viaggiano i dati.') }
});
