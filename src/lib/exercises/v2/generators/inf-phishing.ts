/**
 * Phishing e truffe in rete. Spec: specs/exercises/inf-phishing.md
 *
 * Five levels from the lesson (docs/lezioni/informatica/riscritte/42-inf-phishing.md), all multiple choice of texts
 * (v2/inf-sic.ts): 1. the signals in a message, and what proves nothing; 2. the domain of an address, the part that
 * says whose the site is, built backwards from its labels; 3. which address belongs to the real site; 4. what to
 * do, in front of a message and after a mistake; 5. true and false statements.
 *
 * Every domain is invented: `esempio.it` and names under `.example`. The exercises are about recognising a trap.
 */
import type { Rng } from '../types';
import { choose, makeGenerator, shuffle, textOption, type Built } from '../inf-programmi';
import { asked, oneAmong, situationLevel, statementLevel, type Piece, type Situation, type Statement } from '../inf-sic';

export const ID = 'inf-phishing';

// ---------------------------------------------------------------------------
// Level 1: the signals

const SIGNALS: Piece[] = [
	['g1', "L'indirizzo del mittente ha un dominio diverso da quello del servizio"],
	['g2', 'Il tono è urgente: "hai 24 ore, poi l\'account sarà chiuso"'],
	['g3', 'Il saluto è generico: "Gentile cliente"'],
	['g4', 'Chiede di scrivere la password in risposta al messaggio'],
	['g5', 'Chiede un codice appena arrivato sul telefono'],
	['g6', 'Ha un pulsante che porta a un indirizzo diverso da quello del servizio'],
	['g7', 'Promette un premio a chi inserisce subito i dati della carta'],
	['g8', "Minaccia una multa se non si paga entro un'ora"],
	['g9', 'Chiede di pagare soltanto con ricariche o buoni regalo'],
	['g10', 'Invita a installare un programma allegato per "sbloccare" l\'account']
];
/** Details that say nothing either way: the look of a message proves nothing. */
const NEUTRAL: Piece[] = [
	['n1', 'È scritto in italiano corretto'],
	['n2', 'Ha il logo e i colori del servizio'],
	['n3', 'Arriva in un giorno feriale'],
	['n4', 'È lungo una decina di righe'],
	['n5', 'Riporta la data di oggi'],
	['n6', 'Nomina un servizio che usi davvero'],
	['n7', 'Si chiude con i saluti e una firma'],
	['n8', "Ha un'immagine in alto"]
];

function level1(rng: Rng): Built {
	const prompt = 'Riconosci i segnali del phishing.';
	const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
	if (rng.next() < 0.5) {
		const { right, others, answer } = oneAmong(rng, SIGNALS, NEUTRAL);
		return asked(prompt, 'Quale di questi particolari di un messaggio è un segnale di phishing?', answer, ["Contano l'indirizzo del mittente, la destinazione del link, la fretta e che cosa ti viene chiesto.", "L'aspetto non prova nulla, né in un senso né nell'altro: copiare la forma di un messaggio vero non costa niente."], { case: 'segnale', ids: [right[0], ...others.map((p) => p[0])] });
	}
	const { right, others, answer } = oneAmong(rng, NEUTRAL, SIGNALS);
	return asked(prompt, "Quale di questi particolari, da solo, non dice niente sull'onestà di un messaggio?", answer, [`Un messaggio che ${lower(right[1])} può essere vero oppure falso: l'aspetto non prova nulla.`, 'Gli altri tre sono segnali di phishing: un mittente o un link che non corrispondono, la fretta, una richiesta di dati, codici o denaro.'], { case: 'neutro', ids: [right[0], ...others.map((p) => p[0])] });
}

// ---------------------------------------------------------------------------
// Addresses: the real sites, the domains of the traps

/** The real sites: the label, the registered domain, what the site is. */
const REAL: [string, string, string][] = [
	['esempio', 'esempio.it', 'un servizio'],
	['banca', 'banca.example', 'una banca'],
	['corriere', 'corriere.example', 'un corriere'],
	['registro', 'registro.example', 'un registro elettronico'],
	['giochi', 'giochi.example', 'una piattaforma di giochi'],
	['posta', 'posta.example', 'un servizio di posta'],
	['negozio', 'negozio.example', 'un negozio in rete'],
	['scuola', 'scuola.example', 'una scuola']
];
/** Domains registered by somebody else. */
const TRAPS = ['accesso.example', 'verifica.example', 'premi-vip.example', 'sicurezza.example', 'conferma.example', 'avvisi.example'];
const SUBS = ['www', 'accedi', 'app', 'clienti', 'aiuto', 'area'];
const PATHS = ['accedi', 'conferma', 'premio', 'pacco', 'profilo', 'avviso'];
/** The label with letters swapped for others that look like them. */
const LOOKALIKE: Record<string, string> = { esempio: 'esernpio', banca: 'bannca', corriere: 'coriere', registro: 'registr0', giochi: 'giocchi', posta: 'p0sta', negozio: 'negozi0', scuola: 'scuo1a' };

const url = (host: string, path: string) => `https://${host}/${path}`;
/**
 * An address as it is shown: with a zero-width space after every dot and slash, so that a long one can go on two
 * lines on a phone instead of being cut. The `values` of the options and `params` keep the address as it is.
 */
const shown = (address: string) => address.replace(/([./]+)(?=.)/g, '$1\u200b');
const addressOption = (address: string) => textOption(shown(address), address);
/** The registered domain of a host: its last two labels. */
const registered = (host: string) => host.split('.').slice(-2).join('.');

// ---------------------------------------------------------------------------
// Level 2: the domain that counts

function level2(rng: Rng): Built {
	const [, real] = rng.pick(REAL);
	const path = rng.pick(PATHS);
	const bait = rng.next() < 0.55;
	const host = bait ? `${real}.${rng.pick(TRAPS)}` : `${rng.pick(SUBS)}.${real}`;
	const labels = host.split('.');
	const right = registered(host);
	const others = [labels.slice(0, 2).join('.'), host, `${labels[0]}.${labels[labels.length - 1]}`, labels.slice(1, 3).join('.'), `${labels[0]}.${path}`].filter((x) => x !== right);
	const answer = choose(
		rng,
		textOption(right),
		others.map((x) => textOption(x))
	);
	const steps = ['Il nome di dominio sta tra :// e la prima barra, e si legge da destra: le ultime due parti dicono a chi appartiene il sito.', bait ? `Qui prima della barra c'è ${right}. Quello che sta più a sinistra, ${real}, lo ha scritto il proprietario di ${right}, che può metterci anche il nome di qualcun altro.` : `Qui prima della barra c'è ${right}; ${labels[0]} è una parte aggiunta dal proprietario del dominio.`];
	return asked("Leggi l'indirizzo di un link.", `Un link porta a ${shown(url(host, path))} e vuoi sapere di chi è il sito. Quali sono le due parti dell'indirizzo che lo dicono?`, answer, steps, { case: bait ? 'esca' : 'semplice', host, path });
}

// ---------------------------------------------------------------------------
// Level 3: whose address it is

function level3(rng: Rng): Built {
	const [label, real, what] = rng.pick(REAL);
	const paths = shuffle(rng, PATHS);
	const traps = shuffle(rng, TRAPS);
	const subs = shuffle(rng, SUBS);
	const tld = real.split('.')[1];
	const genuine = [url(`${subs[0]}.${real}`, paths[0]), url(real, paths[1]), url(`${subs[1]}.${real}`, paths[2]), url(`${subs[2]}.${real}`, paths[3])];
	const fakes: [string, string, string][] = [
		['esca', url(`${real}.${traps[0]}`, paths[0]), `prima della barra c'è ${traps[0]}: ${real} è solo una parte aggiunta a sinistra`],
		['trattino', url(`${label}-${tld === 'it' ? 'it' : 'online'}.example`, paths[1]), `il dominio è ${label}-${tld === 'it' ? 'it' : 'online'}.example, un altro nome registrato`],
		['lettere', url(`www.${LOOKALIKE[label]}.${tld}`, paths[2]), `guardando bene le lettere, il dominio è ${LOOKALIKE[label]}.${tld}`],
		['percorso', url(traps[1], real), `il dominio è ${traps[1]}: ${real} compare dopo la barra, dove chiunque può scrivere ciò che vuole`]
	];
	const prompt = 'Controlla a chi appartiene un indirizzo.';
	const rule = 'Conta il nome di dominio, cioè le ultime due parti prima della prima barra.';
	if (rng.next() < 0.6) {
		const right = rng.pick(genuine);
		const wrong = shuffle(rng, fakes).slice(0, 3);
		const answer = choose(
			rng,
			addressOption(right),
			wrong.map((f) => addressOption(f[1]))
		);
		return asked(prompt, `Il sito vero di ${what} è ${real}. Quale di questi indirizzi gli appartiene?`, answer, [rule, `Solo in ${shown(right)} prima della barra c'è ${real}. Per esempio, in ${shown(wrong[0][1])} ${wrong[0][2]}.`], { case: 'vero', real, kinds: wrong.map((f) => f[0]).sort(), options: answer.options.map((o) => o.values[0]).sort() });
	}
	const fake = rng.pick(fakes);
	const answer = choose(
		rng,
		addressOption(fake[1]),
		shuffle(rng, genuine)
			.slice(0, 3)
			.map(addressOption)
	);
	return asked(prompt, `Il sito vero di ${what} è ${real}. Quale di questi indirizzi non gli appartiene?`, answer, [rule, `In ${shown(fake[1])} ${fake[2]}. Negli altri tre prima della barra c'è ${real}.`], { case: 'falso', real, kinds: [fake[0]], options: answer.options.map((o) => o.values[0]).sort() });
}

// ---------------------------------------------------------------------------
// Level 4: what to do

const SITUATIONS: Situation[] = [
	{
		id: 'pacco',
		text: (N) => `${N} riceve un SMS: "Il tuo pacco è in giacenza, conferma l'indirizzo entro oggi", con un link.`,
		right: "Aprire l'app o il sito del corriere scrivendo l'indirizzo, senza usare il link",
		wrong: ['Aprire il link, perché aspetta davvero un pacco', 'Aprire il link solo per vedere se la pagina sembra vera', "Rispondere all'SMS chiedendo chi lo manda", 'Aprire il link e confermare soltanto il nome'],
		why: ["Il link di un messaggio non si usa: si apre l'app o si scrive l'indirizzo del sito.", 'Se l\'avviso è vero, lo ritrovi lì; se è falso, non hai toccato niente.']
	},
	{
		id: 'telefonata',
		text: (N) => `${N} riceve una telefonata: un operatore dice di chiamare dalla banca e chiede di "confermare" il codice appena arrivato per SMS.`,
		right: 'Riattaccare e chiamare il numero ufficiale della banca',
		wrong: ["Dettare il codice, perché l'operatore conosce già il suo nome", 'Dettare solo le prime tre cifre del codice', "Farsi dare dall'operatore un numero a cui richiamarlo, e usarlo", 'Restare in linea e seguire le istruzioni'],
		why: ['Chi gestisce il servizio non ha bisogno dei tuoi codici: chi li chiede non è il servizio.', "Si riattacca e si verifica con un altro canale: il numero stampato sulla carta, non quello dato da chi chiama."]
	},
	{
		id: 'chat',
		text: (N) => `Dal profilo di un compagno arriva a ${N} un messaggio: "Ti è arrivato un mio codice per sbaglio, me lo giri? È urgente".`,
		right: 'Non girare il codice e sentire il compagno a voce',
		wrong: ['Girare il codice: è un amico e ha fretta', 'Girare il codice e chiedere spiegazioni dopo', 'Rispondere in chat chiedendo se è davvero lui', 'Girare il codice solo se lo chiede una seconda volta'],
		why: ['Quel codice è del tuo account: chi lo riceve entra al posto tuo.', 'Il profilo del compagno è probabilmente in mano ad altri, che risponderebbero anche in chat: lo si sente a voce.']
	},
	{
		id: 'annuncio',
		text: (N) => `${N} trova in un annuncio un telefono a un prezzo molto più basso degli altri; il venditore accetta solo ricariche o buoni regalo.`,
		right: 'Lasciar perdere: quei pagamenti non si possono annullare',
		wrong: ["Pagare subito, prima che l'offerta finisca", 'Pagare metà prima e metà alla consegna', 'Pagare con un buono regalo, che è più sicuro della carta', 'Chiedere uno sconto ulteriore e poi pagare'],
		why: ['Un prezzo molto più basso degli altri e un pagamento solo con ricariche o buoni regalo sono i segni di una truffa.', 'Quei pagamenti non si possono annullare: si lascia perdere.']
	},
	{
		id: 'monete',
		text: (N) => `Un video promette a ${N} monete gratis per un gioco: basta accedere con il proprio account da una pagina indicata nel video.`,
		right: 'Non accedere: niente di gratis passa dalla tua password',
		wrong: ['Accedere, e cambiare la password subito dopo', "Accedere con l'account di un amico, per provare", 'Accedere, perché il video ha molte visualizzazioni', 'Accedere solo se la pagina ha il lucchetto'],
		why: ['Niente di gratis passa dalla tua password: la pagina serve a raccogliere le credenziali.', 'Il lucchetto e le visualizzazioni non dicono chi c\'è dall\'altra parte.']
	},
	{
		id: 'qr',
		text: (N) => `Su un volantino attaccato alla fermata, ${N} inquadra un codice QR che promette uno sconto.`,
		right: "Leggere l'indirizzo che compare prima di aprirlo",
		wrong: ['Aprirlo subito: un codice QR non può portare a una pagina falsa', 'Aprirlo e inserire i dati richiesti per avere lo sconto', 'Aprirlo, perché il volantino è stampato bene', 'Aprirlo, e controllare soltanto che ci sia il lucchetto'],
		why: ['Un codice QR è un link di cui non vedi la destinazione.', "Prima di aprirlo si legge l'indirizzo che compare, guardando il nome di dominio."]
	},
	{
		id: 'chiusura',
		text: (N) => `${N} riceve una mail: "Il tuo account sarà chiuso entro 24 ore: clicca qui per confermare i tuoi dati".`,
		right: "Non usare il link: aprire l'app o scrivere l'indirizzo del sito, e controllare lì",
		wrong: ['Fare clic subito, perché il tempo sta per scadere', 'Fare clic e inserire la password, ma da un altro dispositivo', 'Rispondere alla mail con i dati richiesti', 'Fare clic, perché la mail ha il logo del servizio'],
		why: ['La fretta serve a non lasciarti il tempo di controllare, e il logo non prova nulla.', "Non si usa il link: si apre l'app o si scrive l'indirizzo del sito. Se l'avviso è vero, lo ritrovi lì."]
	},
	{
		id: 'gestore',
		text: (N) => `Su una pagina che sembra quella solita della posta, il gestore di password di ${N} non propone le credenziali.`,
		right: "Guardare l'indirizzo della pagina prima di scrivere qualunque cosa",
		wrong: ['Scrivere la password a mano: il gestore avrà un problema', 'Disattivare il gestore, che non funziona', 'Copiare la password dal gestore e incollarla nella pagina', 'Scrivere la password a mano, perché la pagina è identica a quella solita'],
		why: ['Il gestore propone le credenziali solo sul dominio per cui le ha salvate.', "Se su una pagina che sembra quella solita non propone niente, il dominio è un altro: si guarda l'indirizzo."]
	},
	{
		id: 'fretta',
		text: (N) => `Un messaggio avvisa ${N} che deve pagare entro dieci minuti per non perdere il profilo.`,
		right: 'Prendersi il tempo di verificare con un altro canale',
		wrong: ['Pagare subito e verificare dopo', 'Pagare la metà, per prendere tempo', 'Scrivere al mittente chiedendo una proroga', 'Pagare, perché dieci minuti non bastano per controllare'],
		why: ['La fretta è lo strumento della truffa.', 'Nessuna scadenza vera scade mentre controlli: ci si prende il tempo di verificare con un altro canale.']
	},
	{
		id: 'caduto',
		text: (N) => `${N} si accorge di avere scritto la password della posta su una pagina falsa.`,
		ask: 'Qual è la prima cosa da fare?',
		right: 'Cambiare subito la password entrando dal sito vero, anche dove usava la stessa',
		wrong: ['Aspettare qualche giorno per vedere se succede qualcosa', 'Tornare sulla pagina falsa e scrivere una password sbagliata', 'Cancellare il messaggio e non pensarci più', 'Cambiare la password usando il link del messaggio'],
		why: ['Conta quanto in fretta reagisci: la password si cambia subito, entrando dal sito vero, e ovunque usavi la stessa.', 'Poi si attivano i due fattori e si chiudono le sessioni aperte su altri dispositivi.']
	},
	{
		id: 'carta',
		text: (N) => `${N} ha inserito i dati della carta dei genitori su un sito che si è rivelato falso.`,
		right: 'Avvisare i genitori e far bloccare la carta chiamando la banca',
		wrong: ['Non dire niente e controllare ogni tanto il saldo', 'Scrivere al sito falso chiedendo di cancellare i dati', 'Aspettare di vedere un addebito prima di parlarne', 'Cancellare la cronologia del browser'],
		why: ['Se hai dato i dati di una carta, avvisi subito i tuoi genitori.', 'La carta si fa bloccare chiamando la banca, prima che venga usata.']
	},
	{
		id: 'segnalare',
		text: (N) => `${N} ha riconosciuto un messaggio di phishing nella posta e non ha fatto clic.`,
		ask: 'Che cosa conviene fare del messaggio?',
		right: 'Segnalarlo come phishing nel programma di posta e poi cancellarlo',
		wrong: ['Rispondere al mittente dicendo che è stato scoperto', 'Inoltrarlo a tutti i contatti', "Fare clic sul link per vedere com'è fatta la pagina falsa", 'Tenerlo tra i messaggi importanti'],
		why: ['Il messaggio si segnala come phishing nel programma di posta, poi si cancella.', 'La segnalazione serve ai filtri che proteggono anche gli altri.']
	},
	{
		id: 'vergogna',
		text: (N) => `${N} ha perso dei soldi in una truffa in rete, se ne vergogna e pensa di non dire niente.`,
		right: 'Conservare i messaggi e parlarne con un adulto: la truffa si può denunciare',
		wrong: ['Tacere: ormai non si può fare più niente', 'Cancellare tutti i messaggi per dimenticare', 'Scrivere al truffatore chiedendo indietro i soldi', 'Pagare un servizio trovato in rete che promette di recuperare i soldi'],
		why: ['Può succedere a chiunque: si conservano i messaggi e se ne parla con un adulto.', 'Una truffa si può denunciare alla Polizia Postale; tacere per vergogna aiuta solo chi ti ha ingannato.']
	}
];

// ---------------------------------------------------------------------------
// Level 5: true and false

const TRUE: Statement[] = [
	{ id: 't1', text: 'Il nome mostrato come mittente lo sceglie chi scrive il messaggio', why: "Il nome mostrato lo sceglie chi scrive; è l'indirizzo a dire da dove arriva davvero il messaggio." },
	{ id: 't2', text: 'Su un pulsante può esserci scritto qualunque cosa, qualunque sia la pagina a cui porta', why: 'Il testo di un link e la sua destinazione sono due cose distinte: su un pulsante può esserci scritto qualunque cosa.' },
	{ id: 't3', text: "Anche una pagina falsa può avere il lucchetto accanto all'indirizzo", why: "Il lucchetto dice che i dati viaggiano cifrati, non chi c'è dall'altra parte: anche una pagina falsa può averlo." },
	{ id: 't4', text: 'Nel phishing cascano anche gli adulti e le persone esperte', why: 'Il phishing fa leva su reazioni che abbiamo tutti: non è questione di intelligenza, ma di attenzione in quel momento.' },
	{ id: 't5', text: 'Il phishing inganna la persona, non la macchina', why: 'Il phishing è ingegneria sociale: ottiene qualcosa ingannando la persona, non la macchina.' },
	{ id: 't6', text: 'Di un indirizzo contano le ultime due parti prima della prima barra', why: 'Il nome di dominio si legge da destra: le ultime due parti prima della barra dicono a chi appartiene il sito.' },
	{ id: 't7', text: 'Un messaggio che riporta il tuo nome e la tua classe può essere falso lo stesso', why: 'Un messaggio costruito per una persona precisa è più credibile, ma quelle informazioni spesso vengono da ciò che la persona ha pubblicato.' },
	{ id: 't8', text: 'Nessun servizio chiede per messaggio password o codici', why: 'Chi gestisce il servizio non ha bisogno di password e codici: chi li chiede non è il servizio.' },
	{ id: 't9', text: 'Un gestore di password propone le credenziali solo sul dominio per cui le ha salvate', why: 'Il gestore propone le credenziali solo sul dominio per cui le ha salvate: su una pagina falsa non propone niente.' },
	{ id: 't10', text: 'Il phishing può arrivare per posta, per SMS, in chat o con una telefonata', why: 'Il canale cambia, lo schema resta: qualcuno che si finge un altro, una ragione per fare in fretta, una richiesta.' },
	{ id: 't11', text: "Il lucchetto dice che i dati viaggiano cifrati, non chi c'è dall'altra parte", why: "Il lucchetto e https dicono che i dati viaggiano cifrati tra te e quel sito, non chi c'è dall'altra parte." },
	{ id: 't12', text: 'Per vedere dove porta un link, al computer basta fermare il puntatore sopra senza fare clic', why: "Al computer si ferma il puntatore sopra il link senza fare clic; sul telefono si tiene premuto finché compare l'indirizzo." }
];
const FALSE: Statement[] = [
	{ id: 'f1', text: 'Un messaggio scritto in italiano corretto è di sicuro vero', why: 'Oggi molti messaggi falsi sono scritti in un italiano corretto: un messaggio scritto bene non è per questo vero.' },
	{ id: 'f2', text: "Se accanto all'indirizzo c'è il lucchetto, il sito è onesto", why: "Il lucchetto non dice chi c'è dall'altra parte: anche una pagina falsa può averlo." },
	{ id: 'f3', text: 'Nel phishing cascano solo le persone poco attente o poco intelligenti', why: 'Ci cascano anche gli adulti e le persone esperte: può succedere a chiunque.' },
	{ id: 'f4', text: 'Un messaggio con il logo giusto arriva di sicuro dal servizio', why: "Copiare l'aspetto di un messaggio vero non costa niente: il logo non prova nulla." },
	{ id: 'f5', text: 'In un nome di dominio, la parte più a sinistra dice a chi appartiene il sito', why: 'A dirlo sono le ultime due parti, a destra; quello che sta a sinistra lo sceglie liberamente il proprietario del dominio.' },
	{ id: 'f6', text: 'Un messaggio che arriva dal profilo di un amico è di sicuro scritto da lui', why: "Il profilo di un amico può essere in mano ad altri: si verifica con un altro canale, sentendolo a voce." },
	{ id: 'f7', text: 'La banca può chiederti per telefono il codice appena arrivato sul tuo cellulare', why: 'Nessun servizio chiede password, codici o dati della carta: chi li chiede non è il servizio.' },
	{ id: 'f8', text: 'Il testo di un link e la sua destinazione coincidono sempre', why: 'Il testo di un link e la sua destinazione sono due cose distinte.' },
	{ id: 'f9', text: 'Il phishing arriva solo per posta elettronica', why: 'Il phishing arriva anche per SMS, in chat, con una telefonata o con un codice QR.' },
	{ id: 'f10', text: "L'indirizzo https://esempio.it.accesso.example/ appartiene al sito esempio.it", why: "Prima della barra c'è accesso.example: è quello il dominio, ed esempio.it è solo una parte aggiunta a sinistra." },
	{ id: 'f11', text: 'Se un avviso mette fretta, conviene agire subito e controllare dopo', why: 'La fretta è lo strumento della truffa: nessuna scadenza vera scade mentre controlli.' },
	{ id: 'f12', text: 'Dopo essere caduti in una truffa conviene non dirlo a nessuno', why: 'Tacere per vergogna aiuta solo chi ti ha ingannato: se ne parla con un adulto, e la truffa si può denunciare.' }
];

export default makeGenerator(ID, 'Phishing e truffe in rete', {
	1: { label: 'I segnali in un messaggio', constraints: ['one signal among three details that prove nothing, or one such detail among three signals, half each'], build: level1 },
	2: { label: 'Il dominio che conta', constraints: ['an address built from a real site, a trap domain or a subdomain, and a path', 'the right option is the last two labels before the first slash'], build: level2 },
	3: { label: 'Di chi è questo indirizzo', constraints: ['the real site is given; one address of its domain among three that are not, or the other way round', 'the wrong ones: the name on the left of another domain, a hyphen, letters that look alike, the name after the slash'], build: level3 },
	4: { label: 'Che cosa fare', constraints: ['a situation with a name, the right thing to do and three of its wrong ones'], build: (rng) => situationLevel(rng, 'Scegli il comportamento giusto.', SITUATIONS) },
	5: { label: 'Vero o falso sul phishing', constraints: ['one true statement among three false ones, or one false among three true, half each'], build: (rng) => statementLevel(rng, 'Distingui il vero dal falso.', 'sul phishing', TRUE, FALSE) }
});
