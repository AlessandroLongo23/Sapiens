/**
 * Dati, frequenze e grafici (lesson slug statistica-dati). Spec: specs/exercises/statistica-dati.md
 *
 * Seven levels in the order of the lesson: population, sample, unit and character of a survey; the
 * kind of a character; absolute, relative and percentage frequency counted from a list of data;
 * cumulative frequencies read from a table ("al massimo", "meno di", "almeno"); data grouped in
 * classes a ⊢ b with values on the boundaries; the angle of a sector of a pie chart; from the angles
 * of a pie chart back to the frequencies. Every exercise starts from the frequencies (or the
 * percentages) and builds the list, the table or the angles from them, so every count is an integer
 * and every percentage and angle is exact. No figures: the charts are given through their numbers.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { Rational, gcd, q } from '../rational';
import { decimalLatex, toDecimal } from '../razionali';
import { assembleChoice, shuffle, textBlock } from '../insiemi';

export const ID = 'statistica-dati';

const t = (s: string) => `\\text{${s}}`;

/** Italian article before a number: "gli 80", "gli 800", "i 200". */
const art = (n: number) => (/^(8|11)/.test(String(n)) ? 'gli' : 'i');

/** A finite decimal with the comma: 0{,}45. */
function dec(r: Rational): string {
	const d = toDecimal(r, 6, 0);
	if (!d) throw new Error(`${ID}: ${r.toString()} is not a finite decimal`);
	return decimalLatex(d);
}

/** A random composition of `total` into `k` parts, each at least `min`. */
function compose(rng: Rng, total: number, k: number, min: number): number[] {
	const parts = Array.from({ length: k }, () => min);
	for (let left = total - k * min; left > 0; left--) parts[rng.int(0, k - 1)]++;
	return parts;
}

/** Prose lines of about 46 characters, as textBlock writes them. */
function prose(s: string): string[] {
	const block = textBlock(s);
	const m = /^\\begin\{array\}\{l\} ([\s\S]*) \\end\{array\}$/.exec(block);
	return m ? m[1].split(' \\\\ ') : [block];
}

const stack = (xs: string[]) => `\\begin{array}{l} ${xs.join(' \\\\ ')} \\end{array}`;

/** A two-column table with a header, a rule, the rows and an optional total. */
function table(head: [string, string], rows: [string, string][], total?: string): string {
	const body = rows.map(([a, b]) => `${a} & ${b}`).join(' \\\\ ');
	const tot = total === undefined ? '' : ` \\\\ \\hline ${t('Totale')} & ${total}`;
	return `\\begin{array}{l|c} ${head[0]} & ${head[1]} \\\\ \\hline ${body}${tot} \\end{array}`;
}

// ---------------------------------------------------------------------------
// Answers as numbers: a count, a relative frequency, a percentage, an angle in degrees.

type Unit = 'count' | 'rel' | 'pct' | 'deg';

function unitLatex(u: Unit, r: Rational): string {
	if (u === 'rel') return dec(r);
	const s = r.isInteger() ? String(r.num) : dec(r);
	return u === 'pct' ? `${s}\\%` : u === 'deg' ? `${s}^\\circ` : s;
}

const inRange = (u: Unit, r: Rational) =>
	r.sign() > 0 &&
	(u === 'count' ? r.isInteger() : u === 'rel' ? r.compare(q(1)) < 0 && toDecimal(r, 3, 0) !== null : u === 'pct' ? r.compare(q(100)) < 0 && r.isInteger() : r.compare(q(360)) < 0 && r.isInteger());

/** The correct value, the mistakes that make sense, then neighbours step by step. */
function numberChoice(rng: Rng, u: Unit, value: Rational, mistakes: Rational[], step: Rational): ChoiceAnswer {
	const opt = (r: Rational): ChoiceOption => ({ latex: unitLatex(u, r), values: [r.toString()] });
	const cands = mistakes.filter((r) => inRange(u, r));
	for (let d = 1; d < 30; d++) cands.push(value.add(step.mul(q(d))), value.sub(step.mul(q(d))));
	const ch = assembleChoice(rng, opt(value), cands.filter((r) => inRange(u, r)).map(opt));
	if (!ch) throw new Error(`${ID}: not enough distractors`);
	return ch;
}

// ---------------------------------------------------------------------------
// Level 1: population, sample, statistical unit, character

interface Survey {
	key: string;
	text: (P: number, n: number) => string;
	pop: (P: number) => string;
	camp: (n: number) => string;
	unit: string;
	car: string;
}

export const SURVEYS: Survey[] = [
	{
		key: 'scuola',
		text: (P, n) => `Una scuola ha ${P} studenti e vuole sapere come arrivano a scuola. Invece di chiederlo a tutti, estrae a sorte ${n} studenti e lo chiede a loro.`,
		pop: (P) => `${art(P)} ${P} studenti della scuola`,
		camp: (n) => `${art(n)} ${n} studenti estratti`,
		unit: 'ogni studente della scuola',
		car: 'il mezzo di trasporto',
	},
	{
		key: 'famiglie',
		text: (P, n) => `Un comune ha ${P} famiglie e vuole sapere quante automobili ha ciascuna. Ne sceglie ${n} a caso e le intervista.`,
		pop: (P) => `le ${P} famiglie del comune`,
		camp: (n) => `le ${n} famiglie intervistate`,
		unit: 'ogni famiglia del comune',
		car: 'il numero di automobili',
	},
	{
		key: 'lampadine',
		text: (P, n) => `Una fabbrica ha prodotto ${P} lampadine in un giorno e vuole sapere quanto durano. Ne prende ${n} a caso e le prova.`,
		pop: (P) => `le ${P} lampadine prodotte`,
		camp: (n) => `le ${n} lampadine provate`,
		unit: 'ogni lampadina prodotta',
		car: 'la durata della lampadina',
	},
	{
		key: 'palestra',
		text: (P, n) => `Una palestra ha ${P} iscritti e vuole sapere quante volte alla settimana si allenano. Lo chiede a ${n} iscritti scelti a caso.`,
		pop: (P) => `${art(P)} ${P} iscritti della palestra`,
		camp: (n) => `${art(n)} ${n} iscritti scelti`,
		unit: 'ogni iscritto della palestra',
		car: 'gli allenamenti a settimana',
	},
	{
		key: 'biblioteca',
		text: (P, n) => `Una biblioteca ha ${P} libri e vuole sapere quante volte è stato prestato ciascuno. Controlla ${n} libri scelti a caso.`,
		pop: (P) => `${art(P)} ${P} libri della biblioteca`,
		camp: (n) => `${art(n)} ${n} libri controllati`,
		unit: 'ogni libro della biblioteca',
		car: 'il numero di prestiti',
	},
	{
		key: 'automobili',
		text: (P, n) => `Un concessionario ha venduto ${P} automobili in un anno e vuole sapere di che colore erano. Controlla ${n} automobili scelte a caso tra quelle vendute.`,
		pop: (P) => `le ${P} automobili vendute`,
		camp: (n) => `le ${n} automobili scelte`,
		unit: 'ogni automobile venduta',
		car: "il colore dell'automobile",
	},
	{
		key: 'lavoratori',
		text: (P, n) => `In una città lavorano ${P} persone, e il comune vuole sapere quanto tempo impiegano per arrivare al lavoro. Ne intervista ${n} estratte a sorte.`,
		pop: (P) => `le ${P} persone che lavorano`,
		camp: (n) => `le ${n} persone intervistate`,
		unit: 'ogni persona che lavora',
		car: 'il tempo di viaggio',
	},
	{
		key: 'frutteto',
		text: (P, n) => `Un frutteto ha ${P} alberi di mele. Per sapere quante mele dà un albero, si contano le mele di ${n} alberi scelti a caso.`,
		pop: (P) => `${art(P)} ${P} alberi del frutteto`,
		camp: (n) => `${art(n)} ${n} alberi scelti`,
		unit: 'ogni albero del frutteto',
		car: 'il numero di mele',
	},
	{
		key: 'cinema',
		text: (P, n) => `Un cinema ha avuto ${P} spettatori in un mese e vuole sapere che giudizio danno ai film. Consegna un questionario a ${n} spettatori scelti a caso.`,
		pop: (P) => `${art(P)} ${P} spettatori del mese`,
		camp: (n) => `${art(n)} ${n} spettatori scelti`,
		unit: 'ogni spettatore del mese',
		car: 'il giudizio sui film',
	},
	{
		key: 'azienda',
		text: (P, n) => `Un'azienda ha ${P} dipendenti e vuole conoscere il loro titolo di studio. Lo chiede a ${n} dipendenti estratti a sorte.`,
		pop: (P) => `${art(P)} ${P} dipendenti`,
		camp: (n) => `${art(n)} ${n} dipendenti estratti`,
		unit: 'ogni dipendente',
		car: 'il titolo di studio',
	},
	{
		key: 'ospedale',
		text: (P, n) => `In un anno in un ospedale sono nati ${P} bambini. Per studiarne il peso alla nascita si guardano le schede di ${n} bambini scelti a caso.`,
		pop: (P) => `${art(P)} ${P} bambini nati`,
		camp: (n) => `${art(n)} ${n} bambini scelti`,
		unit: 'ogni bambino nato',
		car: 'il peso alla nascita',
	},
	{
		key: 'supermercato',
		text: (P, n) => `Un supermercato ha emesso ${P} scontrini in una settimana e vuole sapere quanto spende un cliente. Ne esamina ${n} presi a caso.`,
		pop: (P) => `${art(P)} ${P} scontrini`,
		camp: (n) => `${art(n)} ${n} scontrini esaminati`,
		unit: 'ogni scontrino',
		car: "l'importo dello scontrino",
	},
];

export const ROLES = ['popolazione', 'campione', 'unita', 'carattere'] as const;
type Role = (typeof ROLES)[number];
const ROLE_QUESTION: Record<Role, string> = {
	popolazione: "Qual è la popolazione dell'indagine?",
	campione: "Qual è il campione dell'indagine?",
	unita: "Qual è l'unità statistica dell'indagine?",
	carattere: "Qual è il carattere osservato nell'indagine?",
};
const POPS = [600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000];
const SAMPLES = [40, 50, 60, 80, 100, 120, 150, 200, 250, 300];

function level1(rng: Rng): Sample {
	const s = rng.pick(SURVEYS);
	const P = rng.pick(POPS);
	const n = rng.pick(SAMPLES.filter((x) => x * 5 <= P));
	const role = rng.pick(ROLES);
	const phrase: Record<Role, string> = { popolazione: s.pop(P), campione: s.camp(n), unita: s.unit, carattere: s.car };
	const order = shuffle(rng, [...ROLES]);
	const options = order.map((r) => ({ latex: t(phrase[r]), values: [r] }));
	const steps = [
		`${t(`La popolazione è formata da tutti gli elementi su cui si vuole sapere qualcosa: ${phrase.popolazione}.`)}`,
		`${t(`Il campione è la parte della popolazione che si osserva davvero: ${phrase.campione}.`)}`,
		`${t(`L'unità statistica è ogni singolo elemento della popolazione: ${phrase.unita}.`)}`,
		`${t(`Il carattere è ciò che si osserva su ogni unità: ${phrase.carattere}.`)}`,
	];
	return {
		generatorId: ID,
		level: 1,
		seed: rng.seed,
		prompt: ROLE_QUESTION[role],
		problem: textBlock(s.text(P, n)),
		solution: t(phrase[role]),
		steps,
		answer: { kind: 'choice', options, correct: order.indexOf(role) },
		params: { case: role, survey: s.key, P: String(P), n: String(n) },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the kind of a character

export const KINDS = ['qualitativo', 'ordinato', 'discreto', 'continuo'] as const;
type Kind = (typeof KINDS)[number];
export const KIND_LABEL: Record<Kind, string> = {
	qualitativo: 'qualitativo senza ordine',
	ordinato: 'qualitativo con un ordine',
	discreto: 'quantitativo discreto',
	continuo: 'quantitativo continuo',
};

const S = 'ogni studente di una classe';
const F = 'ogni famiglia di un comune';
const A = 'ogni automobile venduta in un anno';
const G = 'ogni giorno di un mese';
const C = 'ogni calciatore di un campionato';
const H = 'ogni paziente di un pronto soccorso';
const L = 'ogni libro di una biblioteca';
const T = 'ogni smartphone venduto da un negozio';
const R = 'ogni abitante di una provincia';
const V = 'ogni cliente di un albergo';

/** [population, character, kind, a number that is not a quantity]. */
export const CHARACTERS: [string, string, Kind, boolean?][] = [
	[S, 'il colore degli occhi', 'qualitativo'],
	[S, 'lo sport preferito', 'qualitativo'],
	[S, 'il mezzo con cui arriva a scuola', 'qualitativo'],
	[S, 'la materia preferita', 'qualitativo'],
	[S, 'il numero di maglia nella squadra di calcio', 'qualitativo', true],
	[S, 'il gruppo sanguigno', 'qualitativo'],
	[S, 'la lingua straniera che studia', 'qualitativo'],
	[S, 'il numero di cellulare', 'qualitativo', true],
	[S, 'il CAP di casa', 'qualitativo', true],
	[F, 'il tipo di riscaldamento della casa', 'qualitativo'],
	[F, 'la compagnia che fornisce la luce', 'qualitativo'],
	[A, 'il colore', 'qualitativo'],
	[A, 'la marca', 'qualitativo'],
	[A, 'il tipo di carburante', 'qualitativo'],
	[A, 'la targa', 'qualitativo', true],
	[G, 'il tempo atmosferico (sole, nuvole, pioggia)', 'qualitativo'],
	[C, 'il ruolo in campo', 'qualitativo'],
	[C, 'il numero di maglia', 'qualitativo', true],
	[C, 'la squadra', 'qualitativo'],
	[C, 'il piede preferito', 'qualitativo'],
	[C, 'la nazionalità', 'qualitativo'],
	[H, 'il gruppo sanguigno', 'qualitativo'],
	[H, 'il reparto in cui viene ricoverato', 'qualitativo'],
	[L, 'il genere (romanzo, saggio, poesia)', 'qualitativo'],
	[L, 'la lingua', 'qualitativo'],
	[L, 'il codice ISBN', 'qualitativo', true],
	[T, 'la marca', 'qualitativo'],
	[T, 'il sistema operativo', 'qualitativo'],
	[R, 'il CAP', 'qualitativo', true],
	[R, 'lo stato civile', 'qualitativo'],
	[R, 'il prefisso telefonico', 'qualitativo', true],
	[V, 'la nazionalità', 'qualitativo'],
	[V, 'il numero della camera', 'qualitativo', true],

	[S, "il giudizio nell'ultima verifica (insufficiente, sufficiente, buono, ottimo)", 'ordinato'],
	[S, "il livello di inglese (base, intermedio, avanzato)", 'ordinato'],
	[S, 'la taglia della maglietta (S, M, L, XL)', 'ordinato'],
	[S, 'quanto gli piace leggere (poco, abbastanza, molto)', 'ordinato'],
	[F, 'il titolo di studio più alto in famiglia (licenza media, diploma, laurea)', 'ordinato'],
	[F, 'la classe energetica della casa (A, B, C, D, E)', 'ordinato'],
	[G, "il livello di allerta meteo (verde, giallo, arancione, rosso)", 'ordinato'],
	[H, 'il livello di dolore (lieve, moderato, forte)', 'ordinato'],
	[H, 'la gravità (lieve, media, grave)', 'ordinato'],
	[T, 'la fascia di prezzo (bassa, media, alta)', 'ordinato'],
	[T, 'il giudizio dei clienti (scarso, buono, ottimo)', 'ordinato'],
	[R, 'il titolo di studio (licenza media, diploma, laurea)', 'ordinato'],
	[V, 'il giudizio sul soggiorno (scarso, sufficiente, buono, ottimo)', 'ordinato'],

	[S, 'il numero di fratelli', 'discreto'],
	[S, 'il numero di libri letti in un anno', 'discreto'],
	[S, 'il numero di assenze nel primo quadrimestre', 'discreto'],
	[S, 'il numero di animali in casa', 'discreto'],
	[S, 'il numero di messaggi inviati ieri', 'discreto'],
	[F, 'il numero di componenti', 'discreto'],
	[F, 'il numero di automobili', 'discreto'],
	[F, 'il numero di stanze della casa', 'discreto'],
	[F, 'il numero di televisori', 'discreto'],
	[A, 'il numero di porte', 'discreto'],
	[A, 'il numero di posti', 'discreto'],
	[G, 'il numero di clienti di un negozio', 'discreto'],
	[G, 'il numero di incidenti in città', 'discreto'],
	[G, 'il numero di chiamate a un centralino', 'discreto'],
	[G, 'il numero di treni in ritardo', 'discreto'],
	[C, 'il numero di gol segnati', 'discreto'],
	[C, 'il numero di partite giocate', 'discreto'],
	[C, 'il numero di cartellini gialli', 'discreto'],
	[H, 'il numero di esami fatti', 'discreto'],
	[H, 'il numero di visite nell\'ultimo anno', 'discreto'],
	[L, 'il numero di pagine', 'discreto'],
	[L, 'il numero di prestiti in un anno', 'discreto'],
	[L, 'il numero di capitoli', 'discreto'],
	[T, 'il numero di fotocamere', 'discreto'],
	[T, 'il numero di app installate', 'discreto'],
	[R, 'il numero di figli', 'discreto'],
	[R, 'il numero di viaggi fatti in un anno', 'discreto'],
	[V, 'il numero di notti', 'discreto'],
	[V, 'il numero di persone in camera', 'discreto'],

	[S, "l'altezza", 'continuo'],
	[S, 'il peso', 'continuo'],
	[S, 'il tempo sui 100 metri', 'continuo'],
	[S, 'il tempo per arrivare a scuola', 'continuo'],
	[S, 'la lunghezza del piede', 'continuo'],
	[F, 'la superficie della casa', 'continuo'],
	[F, "l'acqua consumata in un anno", 'continuo'],
	[F, 'la distanza della casa dal centro', 'continuo'],
	[A, 'la lunghezza', 'continuo'],
	[A, 'la velocità massima', 'continuo'],
	[A, 'il consumo di carburante', 'continuo'],
	[G, 'la temperatura massima', 'continuo'],
	[G, 'la pioggia caduta', 'continuo'],
	[G, 'la velocità massima del vento', 'continuo'],
	[C, "l'altezza", 'continuo'],
	[C, 'il peso', 'continuo'],
	[C, 'la distanza percorsa in una partita', 'continuo'],
	[H, 'la temperatura corporea', 'continuo'],
	[H, 'il tempo di attesa', 'continuo'],
	[H, 'la pressione del sangue', 'continuo'],
	[L, 'il peso', 'continuo'],
	[L, 'lo spessore', 'continuo'],
	[T, 'il peso', 'continuo'],
	[T, 'la durata della batteria', 'continuo'],
	[T, 'la diagonale dello schermo', 'continuo'],
	[R, "l'altezza", 'continuo'],
	[R, 'il tempo passato al telefono in un giorno', 'continuo'],
	[V, 'la distanza percorsa per arrivare', 'continuo'],
];

const KIND_REASON: Record<Kind, string> = {
	qualitativo: 'le modalità sono parole, senza un ordine naturale',
	ordinato: 'le modalità sono parole che stanno in un ordine naturale',
	discreto: 'si conta, e assume solo valori isolati',
	continuo: 'si misura, e può assumere qualunque valore in un intervallo',
};

function level2(rng: Rng): Sample {
	const kind = rng.pick(KINDS);
	const [pop, car, , code] = rng.pick(CHARACTERS.filter((c) => c[2] === kind));
	const options = KINDS.map((k) => ({ latex: t(KIND_LABEL[k]), values: [k] }));
	const steps = code
		? [
				t('Il carattere si scrive con cifre, ma i conti con quei numeri non significano niente: non misura e non conta.'),
				t(`Quindi è ${KIND_LABEL[kind]}: ${KIND_REASON[kind]}.`),
			]
		: [t(`Il carattere è ${car}: ${KIND_REASON[kind]}.`), t(`Quindi è ${KIND_LABEL[kind]}.`)];
	return {
		generatorId: ID,
		level: 2,
		seed: rng.seed,
		prompt: 'Che tipo di carattere è?',
		problem: textBlock(`Su ${pop} si osserva ${car}.`),
		solution: t(KIND_LABEL[kind]),
		steps,
		answer: { kind: 'choice', options, correct: KINDS.indexOf(kind) },
		params: { case: kind, population: pop, character: car, code: code ? '1' : '0' },
	};
}

// ---------------------------------------------------------------------------
// Level 3: frequencies from a list of data

interface ListData {
	key: string;
	intro: (N: number) => string;
	/** Numeric modalities (a contiguous range) or words. */
	mods: (number | string)[];
	numeric: boolean;
}

export const LISTS: ListData[] = [
	{ key: 'fratelli', intro: (N) => `A ${N} studenti si chiede quanti fratelli o sorelle hanno. Le risposte sono`, mods: [0, 1, 2, 3, 4], numeric: true },
	{ key: 'gol', intro: (N) => `Una squadra ha giocato ${N} partite. I gol segnati in ogni partita sono`, mods: [0, 1, 2, 3, 4], numeric: true },
	{ key: 'libri', intro: (N) => `A ${N} studenti si chiede quanti libri hanno letto in estate. Le risposte sono`, mods: [0, 1, 2, 3, 4], numeric: true },
	{ key: 'voti', intro: (N) => `I voti di ${N} studenti in una verifica sono`, mods: [4, 5, 6, 7, 8], numeric: true },
	{ key: 'animali', intro: (N) => `A ${N} famiglie si chiede quanti animali hanno in casa. Le risposte sono`, mods: [0, 1, 2, 3], numeric: true },
	{ key: 'sport', intro: (N) => `A ${N} studenti si chiede lo sport preferito. Le risposte sono`, mods: ['calcio', 'nuoto', 'basket', 'tennis', 'pallavolo'], numeric: false },
	{ key: 'mezzo', intro: (N) => `A ${N} studenti si chiede come arrivano a scuola. Le risposte sono`, mods: ['autobus', 'auto', 'bici', 'treno', 'scooter'], numeric: false },
	{ key: 'gelato', intro: (N) => `A ${N} clienti di una gelateria si chiede il gusto preferito. Le risposte sono`, mods: ['cioccolato', 'fragola', 'limone', 'pistacchio', 'nocciola'], numeric: false },
];

const modProse = (m: number | string) => (typeof m === 'number' ? `$${m}$` : m);

export const FREQ_CASES = ['assoluta', 'relativa', 'percentuale'] as const;
type FreqCase = (typeof FREQ_CASES)[number];

function level3(rng: Rng): Sample {
	const d = rng.pick(LISTS);
	const N = rng.pick([20, 25]);
	const k = rng.int(3, Math.min(5, d.mods.length));
	const mods = d.numeric ? d.mods.slice(0, k) : shuffle(rng, d.mods).slice(0, k);
	const freqs = compose(rng, N, k, 2);
	const data = shuffle(
		rng,
		mods.flatMap((m, i) => Array.from({ length: freqs[i] }, () => m)),
	);
	const ai = rng.int(0, k - 1);
	const m = mods[ai], f = freqs[ai];
	const c: FreqCase = rng.pick(FREQ_CASES);
	const what = c === 'assoluta' ? 'la frequenza assoluta' : c === 'relativa' ? 'la frequenza relativa' : 'la frequenza percentuale';
	const text = `${d.intro(N)}: ${data.map(modProse).join(', ')}. Qual è ${what} della modalità ${modProse(m)}?`;
	const fr = q(f, N);
	const value = c === 'assoluta' ? q(f) : c === 'relativa' ? fr : fr.mul(q(100));
	const unit: Unit = c === 'assoluta' ? 'count' : c === 'relativa' ? 'rel' : 'pct';
	const steps = [
		`${t(`Conta le volte in cui compare ${typeof m === 'number' ? '' : m}`)}${typeof m === 'number' ? ` ${m}` : ''}\\text{: } f_a = ${f}`,
		`${t('Controllo, la somma delle frequenze assolute: ')} ${freqs.join(' + ')} = ${N}`,
	];
	if (c !== 'assoluta') steps.push(`${t('Dividi per il numero dei dati: ')} f_r = \\dfrac{${f}}{${N}} = ${dec(fr)}`);
	if (c === 'percentuale') steps.push(`${t('Moltiplica per ')} 100\\text{: } ${dec(fr)} \\cdot 100 = ${unitLatex('pct', value)}`);
	// Mistakes: no division by N, division by 100, the percentage for the relative frequency, a datum miscounted.
	const mistakes =
		c === 'assoluta'
			? [q(f + 1), q(f - 1), q(f + 2)]
			: c === 'relativa'
				? [q(f, 100), q(f + 1, N), q(f - 1, N)]
				: [q(f), q(f + 1, N).mul(q(100)), q(f - 1, N).mul(q(100))];
	return {
		generatorId: ID,
		level: 3,
		seed: rng.seed,
		prompt: 'Conta i dati e calcola la frequenza richiesta.',
		problem: textBlock(text),
		solution: `${c === 'assoluta' ? 'f_a = ' : c === 'relativa' ? 'f_r = ' : ''}${unitLatex(unit, value)}`,
		steps,
		answer: { kind: 'number', value: value.toString() },
		params: {
			case: c,
			dataset: d.key,
			data: data.map(String),
			modality: String(m),
			unit,
			mistakes: mistakes.map((r) => r.toString()),
			step: (c === 'assoluta' ? q(1) : c === 'relativa' ? q(1, N) : q(100, N)).toString(),
		},
	};
}

// ---------------------------------------------------------------------------
// Level 4: cumulative frequencies

interface CumData {
	key: string;
	head: string;
	intro: (N: number) => string;
	mods: number[];
	howMany: string;
	pct: string;
	verbPl: string;
	verbSg: string;
	obj: (k: number) => string;
}

export const CUMS: CumData[] = [
	{
		key: 'fratelli',
		head: 'Fratelli',
		intro: (N) => `La tabella riporta quanti fratelli o sorelle hanno ${N} studenti.`,
		mods: [0, 1, 2, 3, 4],
		howMany: 'Quanti studenti',
		pct: 'Che percentuale degli studenti',
		verbPl: 'hanno',
		verbSg: 'ha',
		obj: (k) => `$${k}$ ${k === 1 ? 'fratello o sorella' : 'fratelli o sorelle'}`,
	},
	{
		key: 'voti',
		head: 'Voto',
		intro: (N) => `La tabella riporta i voti di ${N} studenti in una verifica.`,
		mods: [4, 5, 6, 7, 8, 9],
		howMany: 'Quanti studenti',
		pct: 'Che percentuale degli studenti',
		verbPl: 'hanno preso',
		verbSg: 'ha preso',
		obj: (k) => `$${k}$`,
	},
	{
		key: 'gol',
		head: 'Gol',
		intro: (N) => `La tabella riporta i gol segnati da una squadra in ognuna delle ${N} partite di un campionato.`,
		mods: [0, 1, 2, 3, 4, 5],
		howMany: 'In quante partite la squadra',
		pct: 'In che percentuale delle partite la squadra',
		verbPl: 'ha segnato',
		verbSg: 'ha segnato',
		obj: (k) => `$${k}$ gol`,
	},
	{
		key: 'libri',
		head: 'Libri',
		intro: (N) => `La tabella riporta quanti libri hanno letto in estate ${N} studenti.`,
		mods: [0, 1, 2, 3, 4],
		howMany: 'Quanti studenti',
		pct: 'Che percentuale degli studenti',
		verbPl: 'hanno letto',
		verbSg: 'ha letto',
		obj: (k) => `$${k}$ ${k === 1 ? 'libro' : 'libri'}`,
	},
	{
		key: 'figli',
		head: 'Figli',
		intro: (N) => `La tabella riporta il numero di figli di ${N} famiglie.`,
		mods: [0, 1, 2, 3, 4],
		howMany: 'Quante famiglie',
		pct: 'Che percentuale delle famiglie',
		verbPl: 'hanno',
		verbSg: 'ha',
		obj: (k) => `$${k}$ ${k === 1 ? 'figlio' : 'figli'}`,
	},
];

export const CUM_CASES = ['al massimo', 'meno di', 'almeno'] as const;
type CumCase = (typeof CUM_CASES)[number];

function level4(rng: Rng): Sample {
	const d = rng.pick(CUMS);
	const N = rng.pick([20, 25, 40, 50]);
	const c: CumCase = rng.pick(CUM_CASES);
	const asPct = N !== 40 && rng.int(1, 3) === 1;
	const mods = d.mods;
	const lo = mods[0], hi = mods[mods.length - 1];
	const freqs = compose(rng, N, mods.length, 1);
	// "al massimo k" and "meno di k" add at least two modalities, "almeno k" too; none is the whole total.
	const k = c === 'al massimo' ? rng.int(lo + 1, hi - 1) : c === 'meno di' ? rng.int(lo + 2, hi) : rng.int(lo + 1, hi - 1);
	const f = (m: number) => (m < lo || m > hi ? 0 : freqs[m - lo]);
	const cum = (m: number) => mods.filter((x) => x <= m).reduce((s, x) => s + f(x), 0);
	const count = c === 'al massimo' ? cum(k) : c === 'meno di' ? cum(k - 1) : N - cum(k - 1);
	const inSet = mods.filter((x) => (c === 'al massimo' ? x <= k : c === 'meno di' ? x < k : x >= k));
	const tab = table([t(d.head), 'f_a'], mods.map((m, i) => [String(m), String(freqs[i])]), String(N));
	const question = `${asPct ? d.pct : d.howMany} ${asPct ? d.verbSg : d.verbPl} ${c} ${d.obj(k)}?`;
	const problem = stack([...prose(d.intro(N)), tab, ...prose(question)]);
	const rel = c === 'al massimo' ? `${t('Al massimo ')} ${k}` : c === 'meno di' ? `${t('Meno di ')} ${k}` : `${t('Almeno ')} ${k}`;
	const steps = [`${rel} ${t(' vuol dire ')} ${inSet.join(',\\ ')}\\text{: somma le loro frequenze}`];
	const sumTex = `${inSet.map(f).join(' + ')} = ${count}`;
	if (c === 'al massimo') steps.push(`${t('È la frequenza cumulata di ')} ${k}\\text{: } ${sumTex}`);
	else if (c === 'meno di') steps.push(`${t('È la frequenza cumulata di ')} ${k - 1}\\text{: } ${sumTex}`);
	else steps.push(`${t('Si sommano le frequenze da ')} ${k} ${t(' in su: ')} ${sumTex}`, `${t('Con la cumulata: ')} ${N} - ${cum(k - 1)} = ${count}`);
	const unit: Unit = asPct ? 'pct' : 'count';
	const toU = (n: number) => (asPct ? q(n * 100, N) : q(n));
	const value = toU(count);
	if (asPct) steps.push(`\\dfrac{${count}}{${N}} \\cdot 100 = ${unitLatex('pct', value)}`);
	// Mistakes: the boundary counted or left out, the modality k alone, the complement, the count for the percentage.
	const wrong =
		c === 'al massimo' ? [cum(k - 1), f(k), N - cum(k), cum(k + 1)] : c === 'meno di' ? [cum(k), f(k - 1), N - cum(k - 1), cum(k - 2)] : [N - cum(k), f(k), cum(k - 1), N - cum(k - 2)];
	const mistakes = wrong.map(toU);
	if (asPct) mistakes.splice(1, 0, q(count));
	return {
		generatorId: ID,
		level: 4,
		seed: rng.seed,
		prompt: 'Rispondi usando le frequenze della tabella.',
		problem,
		solution: unitLatex(unit, value),
		steps,
		answer: { kind: 'number', value: value.toString() },
		params: {
			case: c,
			dataset: d.key,
			k: String(k),
			unit,
			mistakes: mistakes.map((r) => r.toString()),
			step: toU(1).toString(),
		},
	};
}

// ---------------------------------------------------------------------------
// Level 5: data grouped in classes

interface ClassData {
	key: string;
	intro: (N: number) => string;
	lows: number[];
	width: number;
}

export const CLASSES: ClassData[] = [
	{ key: 'altezze', intro: (N) => `Le altezze in centimetri di ${N} studenti sono`, lows: [140, 150], width: 10 },
	{ key: 'pesi', intro: (N) => `I pesi in chilogrammi di ${N} ragazzi sono`, lows: [40, 45, 50], width: 10 },
	{ key: 'tempi', intro: (N) => `I minuti che ${N} studenti impiegano per arrivare a scuola sono`, lows: [5, 10], width: 10 },
	{ key: 'punteggi', intro: (N) => `I punteggi di ${N} studenti in un test sono`, lows: [20, 30], width: 15 },
	{ key: 'battiti', intro: (N) => `I battiti del cuore al minuto di ${N} persone a riposo sono`, lows: [55, 60], width: 10 },
];

const vdash = (a: number, b: number) => `${a} \\vdash ${b}`;

function level5(rng: Rng): Sample {
	const d = rng.pick(CLASSES);
	const N = rng.pick([20, 25]);
	const lo = rng.pick(d.lows), w = d.width;
	const counts = compose(rng, N, 4, 3);
	const ai = rng.int(0, 2);
	const a = lo + ai * w, b = a + w;
	// Each class gets its values; the asked class holds a value equal to a, the next one a value equal to b.
	const byClass: number[][] = counts.map((n, i) => {
		const from = lo + i * w;
		const vals = Array.from({ length: n }, () => from + rng.int(0, w - 1));
		if (i === ai) vals[0] = from;
		if (i === ai + 1) vals[0] = from;
		if (i !== ai && i !== ai + 1 && rng.int(0, 1) === 1) vals[0] = from;
		return vals;
	});
	const data = shuffle(rng, byClass.flat());
	const inClass = byClass[ai];
	const c = counts[ai];
	const onA = data.filter((v) => v === a).length, onB = data.filter((v) => v === b).length;
	const asPct = rng.int(1, 5) <= 2;
	const edges = [0, 1, 2, 3].map((i) => vdash(lo + i * w, lo + (i + 1) * w));
	const what = asPct ? 'la frequenza percentuale' : 'la frequenza assoluta';
	const text = `${d.intro(N)}: ${data.map((v) => `$${v}$`).join(', ')}. Le classi sono ${edges.map((e) => `$${e}$`).join(', ')}. Qual è ${what} della classe $${vdash(a, b)}$?`;
	const sorted = [...inClass].sort((x, y) => x - y);
	const steps = [
		`${t('La classe ')} ${vdash(a, b)} ${t(' contiene i valori da ')} ${a} ${t(' compreso a ')} ${b} ${t(' escluso.')}`,
		`${t('I valori nella classe sono ')} ${sorted.join(',\\ ')}\\text{: } f_a = ${c}`,
		`${t('Il valore ')} ${a} ${t(' è compreso: sta in questa classe.')}`,
		`${t('Il valore ')} ${b} ${t(` compare ${onB === 1 ? 'una volta' : `${onB} volte`} e va nella classe `)} ${vdash(b, b + w)}`,
	];
	const unit: Unit = asPct ? 'pct' : 'count';
	const toU = (n: number) => (asPct ? q(n * 100, N) : q(n));
	const value = toU(c);
	if (asPct) steps.push(`\\dfrac{${c}}{${N}} \\cdot 100 = ${unitLatex('pct', value)}`);
	// Mistakes: the class read as (a, b], as [a, b], as (a, b); the count for the percentage.
	const mistakes = [c - onA + onB, c + onB, c - onA].map(toU);
	if (asPct) mistakes.splice(1, 0, q(c));
	return {
		generatorId: ID,
		level: 5,
		seed: rng.seed,
		prompt: 'Conta i dati che cadono nella classe.',
		problem: textBlock(text),
		solution: unitLatex(unit, value),
		steps,
		answer: { kind: 'number', value: value.toString() },
		params: {
			case: asPct ? 'percentuale' : 'assoluta',
			dataset: d.key,
			data: data.map(String),
			lo: String(lo),
			width: String(w),
			classIndex: String(ai),
			unit,
			mistakes: mistakes.map((r) => r.toString()),
			step: toU(1).toString(),
		},
	};
}

// ---------------------------------------------------------------------------
// Levels 6 and 7: pie charts

interface PieData {
	key: string;
	head: string;
	of: (N: number) => string;
	ofPct: string;
	howMany: string;
	mods: [string, string][];
}

export const PIES: PieData[] = [
	{
		key: 'sport',
		head: 'Sport',
		of: (N) => `lo sport preferito di ${N} studenti`,
		ofPct: 'lo sport preferito degli studenti di una scuola',
		howMany: 'Quanti studenti',
		mods: [['calcio', 'del calcio'], ['pallavolo', 'della pallavolo'], ['basket', 'del basket'], ['nuoto', 'del nuoto'], ['tennis', 'del tennis']],
	},
	{
		key: 'mezzo',
		head: 'Mezzo',
		of: (N) => `il mezzo con cui ${N} studenti arrivano a scuola`,
		ofPct: 'il mezzo con cui arrivano a scuola gli studenti di un liceo',
		howMany: 'Quanti studenti',
		mods: [['autobus', "dell'autobus"], ['auto', "dell'auto"], ['bici', 'della bici'], ['treno', 'del treno'], ['scooter', 'dello scooter']],
	},
	{
		key: 'gelato',
		head: 'Gusto',
		of: (N) => `il gusto di gelato preferito da ${N} clienti`,
		ofPct: 'il gusto di gelato preferito dai clienti di una gelateria',
		howMany: 'Quanti clienti',
		mods: [['cioccolato', 'del cioccolato'], ['fragola', 'della fragola'], ['limone', 'del limone'], ['pistacchio', 'del pistacchio'], ['nocciola', 'della nocciola']],
	},
	{
		key: 'musica',
		head: 'Genere',
		of: (N) => `il genere musicale preferito da ${N} ragazzi`,
		ofPct: 'il genere musicale preferito dai ragazzi di una città',
		howMany: 'Quanti ragazzi',
		mods: [['pop', 'del pop'], ['rock', 'del rock'], ['rap', 'del rap'], ['jazz', 'del jazz'], ['classica', 'della classica']],
	},
	{
		key: 'animali',
		head: 'Animale',
		of: (N) => `l'animale di casa di ${N} famiglie`,
		ofPct: "l'animale di casa delle famiglie di un paese",
		howMany: 'Quante famiglie',
		mods: [['cane', 'del cane'], ['gatto', 'del gatto'], ['pesci', 'dei pesci'], ['coniglio', 'del coniglio'], ['criceto', 'del criceto']],
	},
];

/** Percentages, multiples of 5 and at least 5, adding up to 100. */
const percentages = (rng: Rng, k: number) => compose(rng, 20, k, 1).map((x) => x * 5);

function level6(rng: Rng): Sample {
	for (;;) {
		const d = rng.pick(PIES);
		const k = rng.int(3, 5);
		const chosen = shuffle(rng, d.mods).slice(0, k);
		const asPct = rng.int(0, 1) === 1;
		const N = asPct ? 100 : rng.pick([20, 24, 30, 36, 40, 45, 60, 72, 90, 120]);
		const freqs = asPct ? percentages(rng, k) : compose(rng, N, k, 1);
		const ai = rng.int(0, k - 1);
		const f = freqs[ai];
		const angle = q(360 * f, N);
		const pct = q(100 * f, N);
		if (!angle.isInteger() || angle.equals(q(f)) || angle.equals(pct)) continue;
		const [name, prep] = chosen[ai];
		const intro = asPct ? `La tabella riporta ${d.ofPct}, in percentuale.` : `La tabella riporta ${d.of(N)}.`;
		const tab = asPct
			? table([t(d.head), t('Percentuale')], chosen.map(([m], i) => [t(m), `${freqs[i]}\\%`]), '100\\%')
			: table([t(d.head), 'f_a'], chosen.map(([m], i) => [t(m), String(freqs[i])]), String(N));
		const problem = stack([...prose(intro), tab, ...prose(`Nell'aerogramma, quanto misura l'angolo del settore ${prep}?`)]);
		const steps = asPct
			? [`${t(`La percentuale ${prep} è `)} ${f}\\% ${t(', cioè ')} f_r = ${dec(q(f, 100))}`, `\\alpha = ${dec(q(f, 100))} \\cdot 360^\\circ = ${angle.num}^\\circ`]
			: [
					`${t('Il cerchio intero sono tutti i dati: ogni dato vale ')} \\dfrac{360^\\circ}{${N}} = ${unitLatex('deg', q(360, N))}`,
					`\\alpha = ${f} \\cdot ${unitLatex('deg', q(360, N))} = ${angle.num}^\\circ`,
				];
		// Mistakes: the percentage (or the frequency) as the angle, a half circle for a full one, equal sectors.
		const mistakes = asPct ? [q(f), angle.div(q(2)), q(360, k)] : [q(f), pct, angle.div(q(2)), q(360, k)];
		return {
			generatorId: ID,
			level: 6,
			seed: rng.seed,
			prompt: "Calcola l'angolo del settore.",
			problem,
			solution: `\\alpha = ${angle.num}^\\circ`,
			steps,
			answer: { kind: 'number', value: angle.toString() },
			params: {
				case: asPct ? 'percentuali' : 'assolute',
				dataset: d.key,
				modality: name,
				unit: 'deg',
				mistakes: mistakes.map((r) => r.toString()),
				step: (asPct ? q(18) : q(360, N)).toString(),
			},
		};
	}
}

function level7(rng: Rng): Sample {
	for (;;) {
		const d = rng.pick(PIES);
		const k = rng.int(3, 5);
		const chosen = shuffle(rng, d.mods).slice(0, k);
		const asPct = rng.int(0, 1) === 1;
		let N: number, freqs: number[];
		if (asPct) {
			N = rng.pick([20, 40, 60, 80, 120, 200]);
			const ps = percentages(rng, k);
			if (ps.some((p) => (p * N) % 100 !== 0)) continue;
			freqs = ps.map((p) => (p * N) / 100);
		} else {
			N = rng.pick([20, 24, 30, 36, 40, 45, 60, 72, 90, 120, 200, 300]);
			const g = N / gcd(N, 360);
			freqs = compose(rng, N / g, k, 1).map((m) => m * g);
		}
		const angles = freqs.map((f) => (360 * f) / N);
		const ai = rng.int(0, k - 1);
		const f = freqs[ai], angle = angles[ai];
		const pct = q(100 * f, N);
		const value = asPct ? pct : q(f);
		if (!Number.isInteger(angle) || value.equals(q(angle))) continue;
		const [name, prep] = chosen[ai];
		const intro = `Un aerogramma rappresenta ${d.of(N)}. Gli angoli dei settori sono nella tabella.`;
		const tab = table([t(d.head), t('Angolo')], chosen.map(([m], i) => [t(m), `${angles[i]}^\\circ`]));
		const question = asPct ? `Quale percentuale corrisponde al settore ${prep}?` : `${d.howMany} ci sono nel settore ${prep}?`;
		const problem = stack([...prose(intro), tab, ...prose(question)]);
		const steps = [`${t('La parte del cerchio è ')} \\dfrac{${angle}}{360}`];
		if (asPct) steps.push(`\\dfrac{${angle}}{360} \\cdot 100 = ${unitLatex('pct', pct)}`);
		else steps.push(`${t('Moltiplica per il numero dei dati: ')} \\dfrac{${angle}}{360} \\cdot ${N} = ${f}`);
		steps.push(`${t('Controllo: ')} ${angles.join(' + ')} = 360`);
		// Mistakes: the angle read as the answer; the percentage for the count or the count for the percentage; angle · N / 100; equal sectors.
		const mistakes = asPct ? [q(angle), q(f), q(100, k)] : [q(angle), pct, q(angle * N, 100), q(N, k)];
		const unit: Unit = asPct ? 'pct' : 'count';
		return {
			generatorId: ID,
			level: 7,
			seed: rng.seed,
			prompt: 'Dagli angoli ricava la frequenza.',
			problem,
			solution: unitLatex(unit, value),
			steps,
			answer: { kind: 'number', value: value.toString() },
			params: {
				case: asPct ? 'percentuale' : 'assoluta',
				dataset: d.key,
				N: String(N),
				modality: name,
				unit,
				mistakes: mistakes.map((r) => r.toString()),
				step: (asPct ? q(5) : q(N / gcd(N, 360))).toString(),
			},
		};
	}
}

// ---------------------------------------------------------------------------
// Checks

const BUILD: Record<number, (rng: Rng) => Sample> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7 };

function check(s: Sample): string[] {
	const v: string[] = [];
	const p = s.params as Record<string, unknown>;
	if (!s.steps.length) v.push('nessun passaggio');
	if (/—|piuttosto che/.test(s.problem + s.prompt)) v.push('parole vietate nel testo');
	if (s.level <= 2) {
		const a = s.answer;
		if (a.kind !== 'choice' || a.options.length !== 4) return [...v, 'servono quattro opzioni'];
		if (a.options[a.correct].values[0] !== p.case) v.push('opzione giusta sbagliata');
		if (new Set(a.options.map((o) => o.latex)).size !== 4) v.push('opzioni ripetute');
		return v;
	}
	if (s.answer.kind !== 'number') return [...v, 'risposta non numerica'];
	const value = Rational.parse(s.answer.value);
	if (!inRange(p.unit as Unit, value)) v.push(`risposta fuori intervallo: ${s.answer.value}`);
	if (s.level === 3) {
		const data = p.data as string[];
		const f = data.filter((x) => x === p.modality).length;
		const N = data.length;
		const truth = p.case === 'assoluta' ? q(f) : p.case === 'relativa' ? q(f, N) : q(100 * f, N);
		if (!truth.equals(value)) v.push('frequenza sbagliata');
		if (![20, 25].includes(N)) v.push('N non previsto');
	}
	if (s.level === 5) {
		const data = (p.data as string[]).map(Number);
		const lo = Number(p.lo), w = Number(p.width), i = Number(p.classIndex);
		const a = lo + i * w, b = a + w;
		const c = data.filter((x) => x >= a && x < b).length;
		const truth = p.case === 'percentuale' ? q(100 * c, data.length) : q(c);
		if (!truth.equals(value)) v.push('frequenza della classe sbagliata');
		if (!data.includes(a) || !data.includes(b)) v.push('manca un dato sul confine');
		if (data.some((x) => x < lo || x >= lo + 4 * w)) v.push('dato fuori dalle classi');
	}
	return v;
}

function toChoice(s: Sample, rng: Rng): ChoiceAnswer {
	if (s.answer.kind === 'choice') return s.answer;
	if (s.answer.kind !== 'number') throw new Error(`${ID}: unexpected answer`);
	const p = s.params as Record<string, unknown>;
	return numberChoice(rng, p.unit as Unit, Rational.parse(s.answer.value), (p.mistakes as string[]).map((x) => Rational.parse(x)), Rational.parse(p.step as string));
}

export const statisticaDati: Generator = {
	id: ID,
	title: 'Dati, frequenze e grafici',
	levels: {
		1: { label: 'Popolazione, campione, unità e carattere', constraints: ["dodici indagini; si chiede uno dei quattro ruoli, le opzioni sono i quattro ruoli dell'indagine"] },
		2: { label: 'Tipo di carattere', constraints: ['qualitativo senza ordine, con un ordine, quantitativo discreto o continuo, un quarto ciascuno', 'tra i qualitativi anche numeri che non sono quantità (CAP, numero di maglia)'] },
		3: { label: 'Frequenze da un elenco', constraints: ['N = 20 o 25, da 3 a 5 modalità, ogni frequenza almeno 2', 'frequenza assoluta, relativa o percentuale, un terzo ciascuna'] },
		4: { label: 'Frequenze cumulate', constraints: ['tabella di un carattere quantitativo discreto, N = 20, 25, 40 o 50', '"al massimo", "meno di", "almeno", un terzo ciascuno; a volte in percentuale'] },
		5: { label: 'Dati in classi', constraints: ['N = 20 o 25 valori interi, quattro classi a ⊢ b della stessa ampiezza', 'un dato uguale a a e uno uguale a b', 'frequenza assoluta (3 su 5) o percentuale (2 su 5)'] },
		6: { label: "Angoli dell'aerogramma", constraints: ['da 3 a 5 modalità; frequenze assolute con N divisore di 360, o percentuali multiple di 5', 'angolo intero, diverso dalla frequenza e dalla percentuale'] },
		7: { label: "Dall'aerogramma alle frequenze", constraints: ['angoli interi che sommano a 360; si chiede la frequenza assoluta o la percentuale di un settore'] },
	},
	generate(rng: Rng, level: number): Sample {
		const build = BUILD[level];
		if (!build) throw new Error(`${ID}: unknown level ${level}`);
		for (let attempt = 0; attempt < 1000; attempt++) {
			const sample = build(rng);
			if (check(sample).length === 0) return sample;
		}
		throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
	},
	check,
	toChoice,
};

export default statisticaDati;
