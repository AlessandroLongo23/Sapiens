/**
 * Password e autenticazione. Spec: specs/exercises/password-sicure.md
 *
 * Six levels from the lesson (docs/lezioni/informatica/riscritte/41-password-sicure.md), all multiple choice of
 * texts (v2/inf-sic.ts): 1. the three factors, and what is not a proof at all; 2. how many passwords there are,
 * k^n, built backwards from the characters and the length; 3. what more characters do to that number; 4. the time
 * to try them all, with powers of ten; 5. which defence stops which danger, and which pair of proofs is two
 * factors; 6. the habits.
 *
 * Powers are written in `$…$`. The exercises are about defence: the counts say why a long password holds.
 */
import type { ChoiceOption, Rng } from '../types';
import { choose, makeGenerator, shuffle, textOption, type Built } from '../inf-programmi';
import { asked, situationLevel, sortLevel, type Situation } from '../inf-sic';

export const ID = 'password-sicure';

// ---------------------------------------------------------------------------
// Level 1: the factors

const FACTORS = {
	sai: 'Qualcosa che sai',
	hai: 'Qualcosa che hai',
	sei: 'Qualcosa che sei',
	nessuno: 'Nessuno: serve a dire chi sei, non a dimostrarlo'
} as const;
type Factor = keyof typeof FACTORS;

const PROOFS: [Factor, string][] = [
	['sai', 'una password'],
	['sai', 'un PIN di sei cifre'],
	['sai', 'la risposta a una domanda segreta'],
	['sai', "una frase d'accesso di cinque parole"],
	['hai', "un codice generato da un'app sul suo telefono"],
	['hai', 'una chiavetta di sicurezza da collegare'],
	['hai', 'una notifica da approvare sul suo telefono'],
	['hai', 'un codice arrivato con un messaggio sul suo telefono'],
	['sei', "l'impronta del dito"],
	['sei', 'il riconoscimento del volto'],
	['sei', 'il riconoscimento della voce'],
	['sei', "la scansione dell'iride"],
	['nessuno', 'il nome utente'],
	['nessuno', "l'indirizzo di posta scritto sul profilo"],
	['nessuno', 'il soprannome scelto per il profilo'],
	['nessuno', 'il nome e il cognome']
];
const SERVICES = ['nel registro elettronico', 'nella posta', 'nel profilo di un videogioco', 'in un social', "nell'app della biblioteca", 'nella piattaforma della scuola'];
const FACTOR_WHY: Record<Factor, string> = {
	sai: 'È un segreto che si tiene a mente: è qualcosa che sai. Il suo punto debole è che può essere indovinato o carpito con un inganno.',
	hai: 'È un oggetto, o qualcosa che arriva su un oggetto tuo: è qualcosa che hai. Il suo punto debole è che può essere perso o rubato.',
	sei: 'È una caratteristica del corpo: è qualcosa che sei. Il suo punto debole è che non si può cambiare, se qualcuno riesce a copiarla.',
	nessuno: "Non è un segreto: lo conoscono anche gli altri. Serve all'identificazione, cioè a dichiarare chi sei; l'autenticazione chiede una prova che solo tu dovresti avere."
};

function level1(rng: Rng): Built {
	const service = rng.pick(SERVICES);
	const texts = PROOFS.map(([kind, proof]) => [kind, (N: string) => `Quando ${N} entra ${service}, il servizio chiede ${proof}.`] as const);
	const built = sortLevel(rng, 'Riconosci il fattore di autenticazione.', 'Che fattore di autenticazione è?', FACTORS, texts, FACTOR_WHY);
	return { ...built, params: { ...built.params, service } };
}

// ---------------------------------------------------------------------------
// The count: k characters to choose from, n positions

interface Alphabet {
	id: string;
	k: number;
	/** "tra …" */
	among: string;
	/** "8 …", as an option of the comparison. */
	short: (n: number) => string;
	/** How k is found. */
	count: string;
	/** A k a student gets by counting the characters wrong. */
	wrongK: number;
}
const symbols = (s: number): Alphabet => ({
	id: `mMcs${s}`,
	k: 62 + s,
	among: `lettere minuscole, maiuscole, cifre e ${s} simboli`,
	short: (n) => `${n} caratteri tra minuscole, maiuscole, cifre e ${s} simboli`,
	count: `$26 + 26 + 10 + ${s} = ${62 + s}$`,
	wrongK: 62
});
const ALPHABETS: Alphabet[] = [
	{ id: 'c', k: 10, among: 'le cifre', short: (n) => `${n} cifre`, count: 'le cifre sono $10$, da $0$ a $9$', wrongK: 9 },
	{ id: 'm', k: 26, among: 'le lettere minuscole', short: (n) => `${n} lettere minuscole`, count: 'le lettere minuscole sono $26$', wrongK: 52 },
	{ id: 'mM', k: 52, among: 'lettere minuscole e maiuscole', short: (n) => `${n} lettere tra minuscole e maiuscole`, count: '$26 + 26 = 52$', wrongK: 26 },
	{ id: 'mc', k: 36, among: 'lettere minuscole e cifre', short: (n) => `${n} caratteri tra minuscole e cifre`, count: '$26 + 10 = 36$', wrongK: 260 },
	{ id: 'mMc', k: 62, among: 'lettere minuscole, maiuscole e cifre', short: (n) => `${n} caratteri tra minuscole, maiuscole e cifre`, count: '$26 + 26 + 10 = 62$', wrongK: 52 },
	...[8, 18, 28, 38].map(symbols)
];
const REMINDER = 'Le lettere minuscole sono 26, come le maiuscole; le cifre sono 10.';

const pow = (b: number, e: number): ChoiceOption => textOption(`$${b}^{${e}}$`, `pow:${b}:${e}`);
const mul = (a: number, b: number): ChoiceOption => textOption(`$${a} \\cdot ${b}$`, `mul:${a}:${b}`);

// ---------------------------------------------------------------------------
// Level 2: how many passwords

function level2(rng: Rng): Built {
	const prompt = 'Conta le combinazioni possibili.';
	if (rng.next() < 0.25) {
		const words = rng.pick([1000, 2000, 3000, 4000, 5000, 8000]);
		const p = rng.int(3, 8);
		const answer = choose(rng, pow(words, p), [pow(p, words), mul(words, p), pow(26, p)]);
		return asked(prompt, `Una frase d'accesso è fatta di ${p} parole scelte a caso da un elenco di ${words} parole. Quante sono le frasi possibili?`, answer, [`Il conto è quello delle password, con le parole al posto dei caratteri: ogni posizione si può riempire in $${words}$ modi, e le posizioni sono $${p}$.`, `Le frasi possibili sono $${words}$ moltiplicato per se stesso $${p}$ volte, cioè $${words}^{${p}}$.`], { case: 'frase', k: words, n: p });
	}
	const a = rng.pick(ALPHABETS);
	const n = a.id === 'c' ? rng.int(4, 9) : rng.int(4, 16);
	const answer = choose(rng, pow(a.k, n), [pow(n, a.k), mul(a.k, n), pow(a.wrongK, n)]);
	const problem = a.id === 'c' ? `Un codice è fatto di ${n} cifre scelte a caso. Quanti sono i codici possibili?` : `Una password è fatta di ${n} caratteri scelti a caso tra ${a.among}. ${REMINDER} Quante sono le password possibili?`;
	return asked(prompt, problem, answer, [`I caratteri tra cui scegliere in ogni posizione sono $k = ${a.k}$: ${a.count}. Le posizioni sono $n = ${n}$.`, `Le combinazioni sono $k^n$: la varietà dei caratteri è la base, la lunghezza è l'esponente. Qui $${a.k}^{${n}}$.`], { case: 'password', alphabet: a.id, k: a.k, n });
}

// ---------------------------------------------------------------------------
// Level 3: more characters

/** Alphabets one inside the other: a password over a later one, of the same length, has more combinations. */
const NESTED = ['c', 'm', 'mM', 'mMc'].map((id) => ALPHABETS.find((a) => a.id === id)!);

function level3(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const a = rng.pick(ALPHABETS);
		const n = rng.int(6, 12);
		const m = rng.int(2, 4);
		const answer = choose(rng, pow(a.k, m), [mul(a.k, m), pow(a.k, n + m), pow(m, a.k)]);
		const what = a.id === 'c' ? `Un codice di ${n} cifre scelte a caso` : `Una password di ${n} caratteri scelti a caso tra ${a.among}`;
		return asked('Ragiona su che cosa cambia allungando una password.', `${what} viene ${a.id === 'c' ? `allungato di ${m} cifre` : `allungata di ${m} caratteri`}. Per quanto si moltiplica il numero delle combinazioni possibili?`, answer, [`Ogni carattere in più moltiplica le combinazioni per $k = ${a.k}$.`, `Con ${m} caratteri in più si moltiplica per $${a.k}$ per ${m} volte, cioè per $${a.k}^{${m}}$. Infatti $${a.k}^{${n + m}} = ${a.k}^{${n}} \\cdot ${a.k}^{${m}}$.`], { case: 'fattore', alphabet: a.id, k: a.k, n, m });
	}
	const more = rng.next() < 0.5;
	const i = rng.int(0, NESTED.length - 2);
	const pair = [NESTED[i], NESTED[rng.int(i + 1, NESTED.length - 1)]];
	const n1 = rng.int(6, 12);
	const lengths = [n1, n1 + rng.int(2, 4)];
	const grid = [0, 1].flatMap((x) => [0, 1].map((y) => ({ a: pair[x], n: lengths[y] })));
	const right = more ? grid[3] : grid[0];
	const o = (g: { a: Alphabet; n: number }) => textOption(g.a.short(g.n), `${g.a.k}:${g.n}`);
	const answer = choose(
		rng,
		o(right),
		grid.filter((g) => g !== right).map(o)
	);
	return asked(
		'Confronta le password.',
		`Quale di queste password, scelte a caso, ha ${more ? 'più' : 'meno'} combinazioni possibili?`,
		answer,
		["Le combinazioni sono $k^n$: crescono sia con il numero $k$ dei caratteri tra cui scegliere, sia con la lunghezza $n$.", `Tra le quattro, ${right.a.short(right.n)} ha insieme la base ${more ? 'più grande' : 'più piccola'}, $${right.a.k}$, e l'esponente ${more ? 'più grande' : 'più piccolo'}, $${right.n}$: sono $${right.a.k}^{${right.n}}$ combinazioni.`],
		{ case: more ? 'più' : 'meno', alphabets: pair.map((a) => a.id), lengths }
	);
}

// ---------------------------------------------------------------------------
// Level 4: the time to try them all

const CODES = ['un codice numerico', 'il codice di un lucchetto', 'il codice di una cassetta di sicurezza'];

function level4(rng: Rng): Built {
	const prompt = 'Calcola il tempo che serve per provare tutte le combinazioni.';
	const pow10 = (e: number, unit: string) => textOption(`$10^{${e}}$ ${unit}`, `pow10:${e}`);
	if (rng.next() < 0.55) {
		const n = rng.int(6, 15);
		const r = rng.int(2, n - 2);
		const code = rng.pick(CODES);
		const answer = choose(rng, pow10(n - r, 'secondi'), [pow10(n + r, 'secondi'), pow10(n * r, 'secondi'), textOption(`$${n - r}$ secondi`, `num:${n - r}`)]);
		return asked(prompt, `${code.charAt(0).toUpperCase()}${code.slice(1)} ha ${n} cifre scelte a caso, quindi ci sono $10^{${n}}$ combinazioni. Un programma ne prova $10^{${r}}$ al secondo. Quanti secondi servono, al massimo, per provarle tutte?`, answer, ['Il tempo si ottiene dividendo le combinazioni per quelle provate in un secondo.', `$10^{${n}} : 10^{${r}} = 10^{${n} - ${r}} = 10^{${n - r}}$ secondi: nella divisione tra potenze con la stessa base gli esponenti si sottraggono.`], { case: 'tempo', n, r, code });
	}
	const r = rng.int(2, 9);
	const t = rng.int(1, 8);
	const digits = (x: number) => textOption(`${x} cifre`, `num:${x}`);
	const answer = choose(rng, digits(r + t), [digits(r * t), digits(Math.abs(t - r)), digits(t), digits(r), digits(r + t + 1), digits(r + t - 1), digits(r + t + 2)].filter((o) => o.values[0] !== 'num:0' && o.values[0] !== 'num:1'));
	return asked(prompt, `Un programma prova $10^{${r}}$ combinazioni al secondo e, nel caso peggiore, impiega $10^{${t}}$ secondi per provare tutti i codici numerici di una certa lunghezza. Quante cifre ha il codice?`, answer, [`Le combinazioni provate sono quelle di un secondo per il numero dei secondi: $10^{${r}} \\cdot 10^{${t}} = 10^{${r + t}}$.`, `I codici di $n$ cifre sono $10^n$: il codice ha ${r + t} cifre.`], { case: 'cifre', r, t });
}

// ---------------------------------------------------------------------------
// Level 5: what stops what

const DEFENCES = {
	imprevedibile: 'Una password che non si può prevedere',
	lunga: 'Una password lunga',
	diversa: 'Una password diversa per ogni account',
	fattore: "L'attenzione e un secondo fattore"
} as const;
type Defence = keyof typeof DEFENCES;

const DANGERS: [Defence, (N: string) => string][] = [
	['imprevedibile', (N) => `Qualcuno tenta di entrare nell'account di ${N} con le password più comuni e con il nome della sua squadra seguito dall'anno di nascita.`],
	['imprevedibile', (N) => `Un compagno cerca di indovinare la password di ${N} partendo da quello che sa: il nome del cane, la data del compleanno.`],
	['imprevedibile', (N) => `Chi vuole entrare nell'account di ${N} tenta per prime le parole più usate e le sostituzioni che fanno tutti, come lo zero al posto della o.`],
	['lunga', (N) => `Un programma prova tutte le combinazioni possibili, una dopo l'altra, per trovare la password di ${N}.`],
	['lunga', (N) => `Contro l'account di ${N} viene tentato un attacco a forza bruta.`],
	['lunga', (N) => `Un programma prova ogni sequenza di caratteri, in ordine, finché non trova la password di ${N}.`],
	['diversa', (N) => `Un sito di giochi su cui ${N} ha un account subisce un furto di dati, e le credenziali rubate vengono usate per entrare nella posta e nei social.`],
	['diversa', (N) => `Le credenziali di ${N}, sottratte con un furto di dati a un negozio in rete, vengono usate per entrare in altri servizi.`],
	['diversa', (N) => `Dopo un furto di dati a un forum, qualcuno usa nome utente e password di ${N} per entrare in altri siti.`],
	['fattore', (N) => `${N} scrive la sua password su una pagina falsa, identica a quella vera.`],
	['fattore', (N) => `Un malware sul computer di ${N} legge la password mentre viene digitata.`],
	['fattore', (N) => `Con un messaggio ingannevole, qualcuno convince ${N} a consegnare la password.`]
];
const DEFENCE_WHY: Record<Defence, string> = {
	imprevedibile: 'Chi attacca parte dalle password più comuni e da ciò che sa della persona. Lo ferma una password che non si può prevedere, cioè scelta a caso.',
	lunga: "È l'attacco a forza bruta, che prova tutte le combinazioni. Lo ferma una password lunga: ogni carattere in più moltiplica le combinazioni.",
	diversa: 'Le credenziali rubate a un sito vengono provate sugli altri. Lo ferma una password diversa per ogni account: quella rubata apre un solo servizio.',
	fattore: "Qui la password viene consegnata o letta, e non conta quanto è robusta. Servono l'attenzione e un secondo fattore: a chi ha la password manca il tuo telefono."
};

/** Proofs for the pairs: what kind each is. */
const PAIR_PROOFS: [string, Factor, string][] = [
	['password', 'sai', 'password'],
	['pin', 'sai', 'PIN'],
	['domanda', 'sai', 'domanda segreta'],
	['app', 'hai', "codice generato dall'app sul telefono"],
	['chiavetta', 'hai', 'chiavetta di sicurezza'],
	['notifica', 'hai', 'notifica da approvare sul telefono'],
	['impronta', 'sei', 'impronta del dito'],
	['volto', 'sei', 'riconoscimento del volto'],
	['utente', 'nessuno', 'nome utente']
];
type Proof = (typeof PAIR_PROOFS)[number];
const pairOption = (a: Proof, b: Proof) => textOption(`${a[2].charAt(0).toUpperCase()}${a[2].slice(1)} e ${b[2]}`, `${a[0]}+${b[0]}`);

function level5(rng: Rng): Built {
	if (rng.next() < 0.55) return sortLevel(rng, "Scegli la difesa adatta al pericolo.", 'Quale difesa è pensata proprio per questo pericolo?', DEFENCES, DANGERS, DEFENCE_WHY);
	const real = PAIR_PROOFS.filter((p) => p[1] !== 'nessuno');
	const pairs = real.flatMap((a, i) => real.slice(i + 1).map((b) => [a, b] as const));
	const right = rng.pick(pairs.filter(([a, b]) => a[1] !== b[1]));
	const user = PAIR_PROOFS[PAIR_PROOFS.length - 1];
	const wrong = shuffle(rng, [...pairs.filter(([a, b]) => a[1] === b[1]), [user, PAIR_PROOFS[0]] as const, [user, PAIR_PROOFS[1]] as const]).slice(0, 3);
	const answer = choose(
		rng,
		pairOption(...right),
		wrong.map((w) => pairOption(...w))
	);
	const kind = (f: Factor) => FACTORS[f].toLowerCase();
	return asked(
		'Riconosci una vera autenticazione a due fattori.',
		'Quale di queste coppie di prove è una vera autenticazione a due fattori?',
		answer,
		[`I due fattori devono essere di tipo diverso. Nella coppia giusta ci sono ${kind(right[0][1])} e ${kind(right[1][1])}.`, 'Due prove dello stesso tipo hanno lo stesso punto debole: chi riesce a carpire la prima può carpire la seconda nello stesso modo. Il nome utente non è una prova, perché non è un segreto.'],
		{ case: 'due fattori', pairs: answer.options.map((o) => o.values[0]).sort() }
	);
}

// ---------------------------------------------------------------------------
// Level 6: the habits

const HABITS: Situation[] = [
	{
		id: 'codice',
		text: (N) => `${N} riceve sul telefono un codice di accesso, e subito dopo un messaggio di qualcuno che si presenta come l'assistenza del servizio e chiede di comunicarlo "per una verifica".`,
		right: 'Non comunicarlo: nessun servizio chiede quel codice in chat o al telefono',
		wrong: ["Comunicarlo, perché lo chiede l'assistenza", 'Comunicarne solo le prime cifre, per sicurezza', 'Comunicarlo e poi cambiare la password', "Chiedere prima il nome dell'operatore e poi comunicarlo"],
		why: ['Il codice che ricevi sul telefono serve a te, sul sito su cui stai entrando in quel momento.', "Nessun servizio te lo chiede al telefono o in chat: chi lo chiede, anche se si presenta come l'assistenza, sta cercando di entrare nel tuo account."]
	},
	{
		id: 'laboratorio',
		text: (N) => `${N} ha controllato la posta da un computer del laboratorio della scuola e ha finito.`,
		right: "Uscire dall'account e non far salvare la password al browser",
		wrong: ['Chiudere la finestra del browser: basta quello', 'Far salvare la password al browser, per fare prima la prossima volta', 'Spegnere lo schermo e lasciare la sessione aperta', 'Lasciare tutto aperto, perché il computer è della scuola'],
		why: ["Sui computer della scuola o di altri si esce dall'account quando si ha finito.", 'Se il browser salva la password, chi si siede dopo di te la trova pronta.']
	},
	{
		id: 'amico',
		text: (N) => `Un amico chiede a ${N} la password del suo profilo di gioco, "solo per una partita".`,
		right: 'Non darla: una password non si condivide, nemmeno con un amico',
		wrong: ['Darla, chiedendogli di non dirla a nessuno', 'Darla, e cambiarla tra un mese', 'Dargli quella della posta, che usa meno', 'Darla scritta su un foglio, e non in chat'],
		why: ['Le password non si condividono, nemmeno con un amico.', 'Non puoi sapere dove la scriverà né a chi la dirà, e le amicizie possono finire mentre la password resta.']
	},
	{
		id: 'furto',
		text: (N) => `Un sito di videogiochi avvisa ${N} che il suo archivio degli utenti è stato rubato. ${N} usava la stessa password per quel sito, per la posta e per un social.`,
		ask: 'Quale password conviene cambiare per prima?',
		right: 'Quella della posta, perché da lì si reimpostano tutte le altre',
		wrong: ['Quella del sito di giochi, e le altre si possono lasciare', 'Quella del social, perché è il più visibile', 'Nessuna: basta aspettare un altro avviso', 'Tutte insieme, scegliendo di nuovo una sola password per i tre account'],
		why: ['Per prima si cambia la password della posta: il link "password dimenticata" degli altri servizi arriva lì.', 'Poi si cambiano le altre, scegliendone tre diverse tra loro, e si attiva sulla posta il secondo fattore.']
	},
	{
		id: 'recupero',
		text: (N) => `Un servizio chiede a ${N} di scegliere una domanda di recupero: "Come si chiama il tuo cane?". Il nome del cane si legge sul suo profilo.`,
		right: 'Dare una risposta che non c\'entra e conservarla nel gestore di password',
		wrong: ['Rispondere con il vero nome del cane, così è facile da ricordare', 'Rispondere con il vero nome scritto al contrario', "Rispondere con il vero nome seguito dall'anno di nascita", 'Usare come risposta la password stessa'],
		why: ['Le domande di recupero si trattano come password.', "Una risposta che si legge sul profilo non protegge niente: si dà una risposta che non c'entra, e si conserva nel gestore."]
	},
	{
		id: 'scadenza',
		text: (N) => `${N} ha una password lunga, scelta a caso e usata per un solo account. Non ci sono avvisi di furti di dati né accessi che non riconosce.`,
		ask: 'Deve cambiarla?',
		right: "No: una password si cambia quando c'è un motivo",
		wrong: ['Sì, ogni mese, aggiungendo un numero in fondo', 'Sì, ogni settimana, alternando due password', 'Sì, e conviene mettere la stessa della posta', 'Sì, sostituendola con una più corta da ricordare'],
		why: ["Una password si cambia quando c'è un motivo: un furto di dati, una pagina sospetta, un accesso che non riconosci.", 'Cambiarla a scadenze fisse senza motivo porta a scegliere varianti prevedibili della precedente.']
	},
	{
		id: 'tante',
		text: (N) => `${N} ha decine di account e non riesce a ricordare una password lunga e diversa per ciascuno.`,
		right: 'Usare un gestore di password, protetto da una password principale lunga',
		wrong: ['Usare la stessa password per tutti gli account', "Usare la stessa password, cambiando solo l'ultima cifra", 'Scriverle tutte in una nota non protetta sul telefono', 'Scegliere password corte, più facili da ricordare'],
		why: ['Ricordare a memoria decine di password lunghe e diverse non è realistico: per questo esiste il gestore di password.', 'Le genera a caso, le conserva cifrate e le inserisce al posto tuo, protetto da una sola password principale.']
	},
	{
		id: 'primo',
		text: (N) => `${N} vuole attivare l'autenticazione a due fattori, cominciando da un solo account.`,
		ask: 'Da quale conviene partire?',
		right: 'Dalla posta: il link "password dimenticata" degli altri servizi arriva lì',
		wrong: ['Dal profilo di un gioco che non usa più', 'Dal sito che ha la password più lunga', 'Da nessuno: con una buona password i due fattori non servono', "Dall'account creato per ultimo"],
		why: ['La posta si protegge per prima, con la password più lunga e i due fattori.', 'Chi entra nella tua posta può reimpostare le password di quasi tutti gli altri servizi.']
	},
	{
		id: 'scelta',
		text: (N) => `${N} deve scegliere la password della posta.`,
		ask: 'Quale scelta è la più robusta?',
		right: 'Una frase di cinque parole comuni scelte a caso',
		wrong: ["Il proprio nome seguito dall'anno di nascita", 'Una parola comune con la a sostituita da @ e un punto esclamativo in fondo', 'Il verso di una canzone famosa', 'La parola "password" con l\'iniziale maiuscola e un 1 in fondo'],
		why: ['Il conto delle combinazioni vale solo per le password scelte a caso: una password prevedibile non costringe nessuno a provarle tutte.', 'Il nome con l\'anno, le sostituzioni che fanno tutti e il verso di una canzone sono prevedibili; cinque parole a caso no.']
	},
	{
		id: 'blocco',
		text: (N) => `${N} tiene il telefono senza nessun codice di sblocco, "tanto le app hanno le loro password".`,
		right: 'Bloccare lo schermo con un codice: il telefono tiene aperte le sessioni delle app',
		wrong: ['Niente: le app sono già protette dalle loro password', 'Niente: basta stare attenti a non perderlo', 'Disattivare i due fattori, così il telefono non serve più per entrare', 'Niente: il telefono non è un fattore di autenticazione'],
		why: ['Il telefono è il tuo secondo fattore e tiene aperte le sessioni di tutte le app.', 'Senza un codice di sblocco, chi lo prende in mano ha già tutto aperto.']
	},
	{
		id: 'rispedita',
		text: (N) => `${N} ha dimenticato la password di un sito, e il sito gliela rispedisce per posta così com'era.`,
		ask: 'Che cosa se ne deduce?',
		right: 'Il sito conserva le password in chiaro, e non è un buon segno',
		wrong: ['Il sito è molto sicuro, perché non perde le password', "Il sito ha ricostruito la password a partire dalla sua impronta", 'È normale: tutti i siti seri conservano le password così', 'Il sito ha indovinato la password provando le combinazioni'],
		why: ["Un sito ben fatto non tiene in archivio le password, ma un'impronta dalla quale non si riesce a tornare indietro.", 'Per questo un servizio serio te ne fa scegliere una nuova e non ti rispedisce quella vecchia: non la conosce.']
	}
];

export default makeGenerator(ID, 'Password e autenticazione', {
	1: { label: 'I fattori di autenticazione', constraints: ['a proof asked to enter a service; options: the three factors and "none, it only says who you are"', 'the four answers about a quarter each'], build: level1 },
	2: { label: 'Quante password possibili', constraints: ['k characters and n positions drawn first; the right option is k^n, written as a power', 'wrong options: n^k, k·n, a k counted wrong'], build: level2 },
	3: { label: 'Più lunga o più varia', constraints: ['m more characters multiply by k^m; or four passwords on a grid of two alphabets and two lengths, one of which has both the largest k and the largest n'], build: level3 },
	4: { label: 'Il tempo per provarle tutte', constraints: ['10^n combinations at 10^r a second take 10^(n-r) seconds; or the number of digits from the rate and the time', 'only powers of ten'], build: level4 },
	5: { label: 'La difesa giusta', constraints: ['a danger and the defence of the table of the lesson; or four pairs of proofs, one of which is of two different kinds'], build: level5 },
	6: { label: 'Le abitudini che contano', constraints: ['a situation with a name, the right thing to do and three of its wrong ones'], build: (rng) => situationLevel(rng, 'Scegli il comportamento giusto.', HABITS) }
});
