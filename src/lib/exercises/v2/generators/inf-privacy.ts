/**
 * Privacy e dati personali. Spec: specs/exercises/inf-privacy.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/43-inf-privacy.md), all multiple choice of texts
 * (v2/inf-sic.ts): 1. what a personal datum is, and the special categories; 2. who the data subject is and who the
 * controller; 3. the rules of who treats the data; 4. the rights; 5. the permissions an app needs for what it
 * does; 6. true and false statements.
 *
 * The questions stay on what the lesson says: no article numbers, no borderline legal cases.
 */
import type { Rng } from '../types';
import { choose, makeGenerator, shuffle, textOption, type Built } from '../inf-programmi';
import { NAMES, asked, oneAmong, sortLevel, statementLevel, type Piece, type Statement } from '../inf-sic';

export const ID = 'inf-privacy';

// ---------------------------------------------------------------------------
// Level 1: personal data

const PERSONAL: Piece[] = [
	['p1', 'Il tuo numero di telefono'],
	['p2', "L'indirizzo di casa di un compagno"],
	['p3', 'Una foto del tuo viso'],
	['p4', 'I tuoi voti nel registro elettronico'],
	['p5', 'La posizione del tuo telefono'],
	['p6', 'Il soprannome legato al tuo account di gioco'],
	['p7', 'La targa del motorino di tuo fratello'],
	['p8', "L'elenco dei libri che hai preso in prestito"],
	['p9', 'La registrazione della tua voce'],
	['p10', 'Il tuo indirizzo di posta'],
	['p11', 'Il tuo nome e cognome'],
	['p12', 'La data di nascita di una compagna']
];
/** Personal data that could be read as biometric: left out where the special categories are asked. */
const NEAR_SPECIAL = ['p3', 'p9'];
const NOT_PERSONAL: Piece[] = [
	['n1', 'La media dei voti di tutta la scuola'],
	['n2', 'La temperatura di oggi in città'],
	['n3', 'Il numero di studenti iscritti alla tua scuola'],
	['n4', "L'orario di apertura della biblioteca"],
	['n5', 'Il numero di abitanti del tuo comune'],
	['n6', "Il prezzo di un biglietto dell'autobus"],
	['n7', 'La classifica dei libri più prestati dalla biblioteca'],
	['n8', 'Il numero di visitatori di un museo in un anno']
];
const SPECIAL: Piece[] = [
	['s1', "Il certificato medico per l'esonero da educazione fisica"],
	['s2', 'La religione che una persona professa'],
	['s3', 'Le opinioni politiche di una persona'],
	['s4', "L'impronta del dito usata per riconoscere una persona"],
	['s5', "L'elenco delle allergie di un compagno"],
	['s6', "L'origine etnica di una persona"],
	['s7', "L'orientamento sessuale di una persona"],
	['s8', 'La diagnosi scritta nella cartella clinica di un paziente']
];

function level1(rng: Rng): Built {
	const prompt = 'Riconosci i dati personali.';
	const r = rng.next();
	if (r < 0.35) {
		const { right, others, answer } = oneAmong(rng, PERSONAL, NOT_PERSONAL);
		return asked(prompt, 'Quale di queste informazioni è un dato personale?', answer, ['Un dato personale è qualunque informazione che riguarda una persona identificata o identificabile, anche quando non contiene il nome.', 'Le altre tre informazioni non riguardano nessuno in particolare.'], { case: 'personale', ids: [right[0], ...others.map((p) => p[0])] });
	}
	if (r < 0.65) {
		const { right, others, answer } = oneAmong(rng, NOT_PERSONAL, PERSONAL);
		return asked(prompt, 'Quale di queste informazioni non è un dato personale?', answer, ["Non sono dati personali le informazioni che non riguardano nessuno in particolare, come un totale o una media su tante persone.", "Le altre tre riguardano una persona identificata o identificabile: sono dati personali, anche dove non c'è il nome."], { case: 'non personale', ids: [right[0], ...others.map((p) => p[0])] });
	}
	const { right, others, answer } = oneAmong(
		rng,
		SPECIAL,
		PERSONAL.filter((p) => !NEAR_SPECIAL.includes(p[0]))
	);
	return asked(prompt, 'Quale di questi dati personali appartiene alle categorie particolari, protette con più severità?', answer, ["Le categorie particolari sono i dati che rivelano la salute, le convinzioni religiose, le opinioni politiche, l'origine etnica, l'orientamento sessuale, e i dati biometrici usati per riconoscere una persona.", 'Sono protetti con più severità perché, se diffusi, possono esporre una persona a discriminazioni. Gli altri tre sono dati personali comuni.'], { case: 'particolare', ids: [right[0], ...others.map((p) => p[0])] });
}

// ---------------------------------------------------------------------------
// Level 2: the data subject and the controller

/** Who treats the data, as an option, and what happens. */
const TREATMENTS: [string, string, (N: string) => string][] = [
	['scuola', 'La scuola', (N) => `La scuola conserva nel registro elettronico i voti di ${N}.`],
	['app', "L'azienda che produce l'app", (N) => `L'azienda che produce un'app di messaggi raccoglie il numero di telefono di ${N}.`],
	['biblioteca', 'La biblioteca', (N) => `La biblioteca comunale registra i libri che ${N} prende in prestito.`],
	['palestra', 'La palestra', (N) => `Una palestra tiene in archivio il certificato medico di ${N}.`],
	['negozio', 'Il negozio in rete', (N) => `Un negozio in rete usa l'indirizzo di ${N} per spedire un pacco.`],
	['gioco', 'La società che gestisce il videogioco', (N) => `La società che gestisce un videogioco conserva l'indirizzo di posta di ${N}.`],
	['social', "L'azienda del social", (N) => `L'azienda di un social registra quali video guarda ${N}, e per quanto tempo.`],
	['medico', 'Lo studio medico', (N) => `Uno studio medico conserva la scheda con le visite di ${N}.`]
];
const OUTSIDERS: [string, (N: string) => string][] = [
	['x1', (N) => `Chi ha costruito il telefono di ${N}`],
	['x2', (N) => `I compagni di classe di ${N}`],
	['x3', () => 'Il fornitore della connessione a Internet'],
	['x4', () => "L'Unione europea"]
];
const GARANTE = 'Il Garante per la protezione dei dati personali';

function level2(rng: Rng): Built {
	const N = rng.pick(NAMES);
	const [id, controller, text] = rng.pick(TREATMENTS);
	const outsider = rng.pick(OUTSIDERS);
	const subject = rng.next() < 0.5;
	const options = { interessato: textOption(N, 'interessato'), titolare: textOption(controller, 'titolare'), garante: textOption(GARANTE, 'garante'), fuori: textOption(outsider[1](N), outsider[0]) };
	const answer = choose(rng, subject ? options.interessato : options.titolare, [subject ? options.titolare : options.interessato, options.garante, options.fuori]);
	const lower = controller.charAt(0).toLowerCase() + controller.slice(1);
	return asked(
		'Riconosci chi è chi nel trattamento dei dati.',
		`${text(N)} ${subject ? "Chi è l'interessato?" : 'Chi è il titolare del trattamento?'}`,
		answer,
		subject ? [`L'interessato è la persona a cui i dati si riferiscono: qui i dati sono di ${N}.`, `Chi decide perché e come usarli, cioè ${lower}, è il titolare del trattamento. Il Garante fa rispettare le regole.`] : [`Il titolare del trattamento è chi decide perché e come i dati vengono usati: qui ${lower}.`, `${N} è l'interessato, cioè la persona a cui i dati si riferiscono. Il Garante fa rispettare le regole.`],
		{ case: subject ? 'interessato' : 'titolare', treatment: id, name: N, outsider: outsider[0] }
	);
}

// ---------------------------------------------------------------------------
// Level 3: the rules

const RULES = { finalita: 'Finalità', minimizzazione: 'Minimizzazione', conservazione: 'Conservazione limitata', trasparenza: 'Trasparenza', sicurezza: 'Sicurezza' } as const;
type Rule = keyof typeof RULES;

const RULE_TEXTS: [Rule, (N: string) => string][] = [
	['finalita', (N) => `Una palestra ha il numero di ${N} per avvisare dei cambi di orario, e lo passa a un negozio di articoli sportivi.`],
	['finalita', (N) => `La scuola ha l'indirizzo della famiglia di ${N} per le comunicazioni, e lo nega a un'agenzia di viaggi che lo chiede per altri scopi.`],
	['finalita', (N) => `Un servizio ha raccolto l'indirizzo di posta di ${N} per farlo accedere, e poi lo riusa per uno scopo diverso da quello dichiarato.`],
	['minimizzazione', (N) => `Un'app che fa da torcia chiede a ${N} l'accesso alla rubrica.`],
	['minimizzazione', (N) => `Per iscriversi a un torneo di scacchi, a ${N} viene chiesto anche il gruppo sanguigno.`],
	['minimizzazione', (N) => `Il modulo per la tessera della biblioteca chiede a ${N} soltanto i dati che servono per il prestito.`],
	['conservazione', (N) => `${N} ha chiuso il suo account da tre anni, ma il servizio tiene ancora in archivio tutti i suoi dati, senza motivo.`],
	['conservazione', (N) => `Finito il corso, un centro sportivo elimina dai suoi archivi i dati di ${N}, che non gli servono più.`],
	['conservazione', (N) => `Un sito tiene per sempre i dati di chi ha chiuso l'account, compresi quelli di ${N}.`],
	['trasparenza', (N) => `Quando ${N} si iscrive, il servizio non dice da nessuna parte chi tratterà i suoi dati né perché.`],
	['trasparenza', (N) => `Prima dell'iscrizione, ${N} trova un'informativa che spiega chi tratta i dati e per quale scopo.`],
	['trasparenza', (N) => `Un'app raccoglie la posizione di ${N} senza averlo mai scritto nell'informativa.`],
	['sicurezza', (N) => `Un sito conserva in chiaro, senza protezione, le password di ${N} e degli altri utenti.`],
	['sicurezza', (N) => `Un servizio lascia l'elenco con i dati di ${N} raggiungibile da chiunque in rete.`],
	['sicurezza', (N) => `Una segreteria tiene i documenti di ${N} sotto chiave, e li può consultare solo chi è autorizzato.`]
];
const RULE_WHY: Record<Rule, string> = {
	finalita: 'I dati si raccolgono per uno scopo dichiarato e non si riusano per un altro: è la regola della finalità.',
	minimizzazione: 'Si raccolgono solo i dati che servono allo scopo: è la regola della minimizzazione.',
	conservazione: 'I dati non si tengono per sempre: quando non servono più si eliminano. È la conservazione limitata.',
	trasparenza: "L'interessato deve sapere chi tratta i dati e perché, ed è l'informativa a dirlo: è la regola della trasparenza.",
	sicurezza: 'I dati vanno protetti da accessi e perdite: è la regola della sicurezza.'
};

// ---------------------------------------------------------------------------
// Level 4: the rights

const RIGHTS = { accesso: 'Il diritto di accesso', rettifica: 'Il diritto di rettifica', cancellazione: 'Il diritto alla cancellazione', opposizione: 'Il diritto di opposizione', portabilita: 'Il diritto alla portabilità' } as const;
type Right = keyof typeof RIGHTS;

const RIGHT_TEXTS: [Right, (N: string) => string][] = [
	['accesso', (N) => `${N} vuole sapere quali dati un social conserva sul suo conto, e averne una copia.`],
	['accesso', (N) => `${N} chiede a un negozio in rete se sta trattando i suoi dati, e quali sono.`],
	['accesso', (N) => `${N} chiede a un'app di vedere tutto quello che ha registrato sul suo conto.`],
	['rettifica', (N) => `Nel profilo di ${N} la data di nascita è sbagliata, e ${N} chiede di correggerla.`],
	['rettifica', (N) => `Un registro riporta un indirizzo di ${N} che non è quello giusto, e la famiglia lo fa correggere.`],
	['rettifica', (N) => `Un servizio ha scritto male il cognome di ${N}, che chiede di sistemarlo.`],
	['cancellazione', (N) => `${N} ritira il consenso e chiede a un'app di eliminare i suoi dati.`],
	['cancellazione', (N) => `${N} chiude un account e chiede che i suoi dati, che non servono più, vengano eliminati.`],
	['cancellazione', (N) => `${N} chiede a un sito di togliere dai suoi archivi le foto che aveva caricato.`],
	['opposizione', (N) => `${N} chiede a un negozio di smettere di usare il suo indirizzo per la pubblicità.`],
	['opposizione', (N) => `${N} non vuole più che un servizio usi i suoi dati per proporre offerte, e chiede di fermare quel trattamento.`],
	['opposizione', (N) => `${N} chiede a un sito di non usare più il suo numero per i messaggi promozionali.`],
	['portabilita', (N) => `${N} cambia servizio di musica e chiede al vecchio le sue playlist in un formato da portare al nuovo.`],
	['portabilita', (N) => `${N} vuole trasferire i suoi dati da un'app a un'altra, e li chiede in un formato adatto.`],
	['portabilita', (N) => `${N} chiede a un servizio di posta i suoi dati in un formato che un altro servizio possa leggere.`]
];
const RIGHT_WHY: Record<Right, string> = {
	accesso: 'Sapere se qualcuno tratta i tuoi dati, quali sono, e averne una copia: è il diritto di accesso.',
	rettifica: 'Far correggere i dati sbagliati: è il diritto di rettifica.',
	cancellazione: 'Far cancellare i dati, nei casi previsti, per esempio quando ritiri il consenso o non servono più: è il diritto alla cancellazione.',
	opposizione: "Far smettere un trattamento, per esempio l'invio di pubblicità: è il diritto di opposizione.",
	portabilita: 'Ricevere i tuoi dati in un formato che puoi portare a un altro servizio: è il diritto alla portabilità.'
};

// ---------------------------------------------------------------------------
// Level 5: the permissions of an app

const PERMISSIONS = { fotocamera: 'La fotocamera', galleria: 'La galleria delle foto', rubrica: 'La rubrica', posizione: 'La posizione precisa', microfono: 'Il microfono', calendario: 'Il calendario', sms: 'I messaggi SMS' } as const;
type Permission = keyof typeof PERMISSIONS;

/** An app, what it does, the permissions it needs for that, and those it clearly does not. The doubtful ones are in neither list. */
const APPS: { id: string; app: string; does: string; needs: Permission[]; not: Permission[] }[] = [
	{ id: 'filtri', app: "un'app per mettere i filtri alle foto", does: 'scattare e modificare le foto', needs: ['fotocamera', 'galleria'], not: ['rubrica', 'posizione', 'microfono', 'calendario', 'sms'] },
	{ id: 'mappe', app: "un'app di mappe che guida a piedi fino a un indirizzo", does: 'sapere dove ti trovi per guidarti', needs: ['posizione'], not: ['rubrica', 'galleria', 'calendario', 'sms'] },
	{ id: 'vocale', app: "un'app per registrare note vocali", does: 'registrare la voce', needs: ['microfono'], not: ['rubrica', 'posizione', 'fotocamera', 'galleria', 'calendario', 'sms'] },
	{ id: 'qr', app: "un'app che legge i codici QR", does: 'inquadrare un codice', needs: ['fotocamera'], not: ['rubrica', 'posizione', 'microfono', 'calendario', 'sms'] },
	{ id: 'meteo', app: "un'app del meteo che mostra le previsioni del posto in cui ci si trova", does: 'sapere in quale posto sei', needs: ['posizione'], not: ['rubrica', 'microfono', 'fotocamera', 'galleria', 'calendario', 'sms'] },
	{ id: 'canzoni', app: "un'app che riconosce le canzoni che si sentono intorno", does: 'ascoltare la musica intorno a te', needs: ['microfono'], not: ['rubrica', 'posizione', 'fotocamera', 'galleria', 'calendario', 'sms'] },
	{ id: 'scanner', app: "un'app che fotografa i fogli di carta e li trasforma in PDF", does: 'fotografare un foglio', needs: ['fotocamera'], not: ['rubrica', 'posizione', 'microfono', 'calendario', 'sms'] },
	{ id: 'contatti', app: "un'app che fa una copia di riserva dei numeri salvati sul telefono", does: 'leggere i numeri salvati', needs: ['rubrica'], not: ['posizione', 'microfono', 'fotocamera', 'galleria', 'calendario'] }
];

function level5(rng: Rng): Built {
	const a = rng.pick(APPS);
	const N = rng.pick(NAMES);
	const right = rng.pick(a.needs);
	const others = shuffle(rng, a.not).slice(0, 3);
	const o = (p: Permission) => textOption(PERMISSIONS[p], p);
	const answer = choose(rng, o(right), others.map(o));
	const lower = (p: Permission) => PERMISSIONS[p].charAt(0).toLowerCase() + PERMISSIONS[p].slice(1);
	return asked(
		"Confronta i permessi con quello che l'app deve fare.",
		`${N} installa ${a.app}. L'app chiede diversi permessi: quale di questi è giustificato da quello che deve fare?`,
		answer,
		[`Si confronta ogni permesso con quello che l'app deve fare: per ${a.does} serve ${lower(right)}.`, `Gli altri tre, ${others.map(lower).join(', ')}, non servono a questo: sono dati raccolti per altri scopi, e si possono negare.`],
		{ case: a.id, name: N, permissions: [right, ...[...others].sort()] }
	);
}

// ---------------------------------------------------------------------------
// Level 6: true and false

const TRUE: Statement[] = [
	{ id: 't1', text: "Un'informazione può essere un dato personale anche se non contiene il nome", why: "Conta che la persona sia identificabile: un'informazione è un dato personale anche senza il nome, se combinandola con altre si arriva alla persona." },
	{ id: 't2', text: 'Il consenso al trattamento si può ritirare in ogni momento', why: 'Il consenso deve essere libero, informato e riferito a uno scopo preciso, e si può ritirare in ogni momento.' },
	{ id: 't3', text: 'Il consenso non è il solo motivo che permette di trattare un dato', why: 'Il consenso è il motivo più noto, ma non è l\'unico: un negozio in rete tratta il tuo indirizzo perché altrimenti non potrebbe spedirti il pacco.' },
	{ id: 't4', text: 'La scuola tratta i tuoi voti senza chiederti il consenso, perché è il suo compito', why: 'La scuola tratta i tuoi voti perché è il suo compito: in questo caso il consenso non viene chiesto.' },
	{ id: 't5', text: 'Il diritto alla cancellazione non raggiunge chi ha già salvato una copia del contenuto', why: 'La cancellazione riguarda il titolare, che toglie il contenuto dai suoi archivi: non raggiunge chi nel frattempo ne ha salvato una copia.' },
	{ id: 't6', text: 'I cookie tecnici servono al funzionamento del sito', why: 'I cookie tecnici ricordano, per esempio, che sei entrato nel tuo account o che cosa hai messo nel carrello.' },
	{ id: 't7', text: 'I cookie di profilazione si possono rifiutare', why: 'Il banner della prima visita serve a chiederti il consenso per i cookie di profilazione, e puoi rifiutarli.' },
	{ id: 't8', text: 'Per pubblicare il ritratto di una persona serve il suo consenso', why: "L'immagine di una persona è un suo dato personale: per pubblicarne il ritratto serve il suo consenso." },
	{ id: 't9', text: "Il GDPR vale anche per le aziende di altri paesi che offrono servizi a chi vive nell'Unione europea", why: "Il regolamento vale in tutti i paesi dell'Unione e anche per le aziende che hanno sede altrove ma offrono i loro servizi a chi vive qui." },
	{ id: 't10', text: 'Se il titolare non risponde a una tua richiesta, puoi presentare un reclamo al Garante', why: 'Il titolare deve rispondere; se non lo fa, o se la risposta non ti convince, puoi presentare un reclamo al Garante.' },
	{ id: 't11', text: 'Tre o quattro dettagli innocui, messi insieme, possono identificare una persona', why: 'Tre o quattro dettagli innocui, messi in fila, identificano qualcuno con la stessa precisione di un cognome.' },
	{ id: 't12', text: 'Anche soltanto conservare un dato personale è un trattamento', why: 'Il trattamento è qualunque operazione fatta su un dato personale: raccoglierlo, conservarlo, consultarlo, comunicarlo, cancellarlo.' }
];
const FALSE: Statement[] = [
	{ id: 'f1', text: "Se in un'informazione non c'è il tuo nome, non è un dato personale", why: 'Un\'informazione è un dato personale anche senza il nome, se combinandola con altre si arriva alla persona.' },
	{ id: 'f2', text: 'La privacy riguarda solo chi ha qualcosa da nascondere', why: 'La privacy è la possibilità di decidere chi sa che cosa di te, e la legge la tratta come un diritto di tutti.' },
	{ id: 'f3', text: 'Una storia che "scade" dopo un giorno sparisce di sicuro da ogni dispositivo', why: 'Una cosa pubblicata, anche in una storia che "scade", può avere copie che nessuno riesce più a contare.' },
	{ id: 'f4', text: 'Chi scatta una foto di gruppo può pubblicarla anche se una delle persone ritratte non vuole', why: "Avere scattato la foto non dà il diritto di decidere dell'immagine degli altri: serve il loro consenso." },
	{ id: 'f5', text: 'Il regolamento europeo vieta di usare i dati personali', why: 'Il regolamento non vieta di usare i dati personali: stabilisce a quali condizioni si può.' },
	{ id: 'f6', text: 'Senza il tuo consenso nessuno può mai trattare un tuo dato', why: 'Il consenso non è l\'unico motivo previsto dalla legge: la scuola tratta i tuoi voti perché è il suo compito.' },
	{ id: 'f7', text: 'Il diritto alla cancellazione fa sparire anche le schermate fatte dagli altri', why: 'La cancellazione riguarda gli archivi del titolare: non raggiunge chi ha fatto una schermata o ha girato il contenuto ad altri.' },
	{ id: 'f8', text: 'Il titolare del trattamento è la persona a cui i dati si riferiscono', why: "La persona a cui i dati si riferiscono è l'interessato; il titolare è chi decide perché e come vengono usati." },
	{ id: 'f9', text: "Tutti i cookie servono a seguirti da un sito all'altro", why: "A seguirti da un sito all'altro sono i cookie di profilazione; quelli tecnici servono al funzionamento del sito." },
	{ id: 'f10', text: 'Una volta dato, il consenso non si può più ritirare', why: 'Il consenso si può ritirare in ogni momento.' },
	{ id: 'f11', text: 'La media dei voti di tutta la scuola è un dato personale', why: 'La media dei voti di tutta la scuola non riguarda nessuno in particolare: non è un dato personale.' },
	{ id: 'f12', text: "Un'app può raccogliere tutti i dati che vuole, anche quelli che non servono a ciò che fa", why: 'Per la regola della minimizzazione si raccolgono solo i dati che servono allo scopo.' }
];

export default makeGenerator(ID, 'Privacy e dati personali', {
	1: { label: 'È un dato personale?', constraints: ['one personal datum among three that are not, the other way round, or one of the special categories among three ordinary personal data'], build: level1 },
	2: { label: 'Interessato e titolare', constraints: ['a treatment with a name; asked: the data subject or the controller; options: the person, who treats the data, the Garante, somebody outside'], build: level2 },
	3: { label: 'Le regole di chi tratta i dati', constraints: ['a situation with a name; options: four of the five rules', 'the five rules about a fifth each'], build: (rng) => sortLevel(rng, 'Riconosci la regola sul trattamento dei dati.', 'Di quale regola sul trattamento dei dati si parla?', RULES, RULE_TEXTS, RULE_WHY) },
	4: { label: 'I tuoi diritti', constraints: ['a request with a name; options: four of the five rights', 'the five rights about a fifth each'], build: (rng) => sortLevel(rng, 'Riconosci il diritto che viene esercitato.', 'Quale diritto sta esercitando?', RIGHTS, RIGHT_TEXTS, RIGHT_WHY) },
	5: { label: "I permessi di un'app", constraints: ['an app and what it does; one permission it needs among three it does not', 'doubtful permissions are never shown'], build: level5 },
	6: { label: 'Vero o falso sulla privacy', constraints: ['one true statement among three false ones, or one false among three true, half each'], build: (rng) => statementLevel(rng, 'Distingui il vero dal falso.', 'sulla privacy', TRUE, FALSE) }
});
