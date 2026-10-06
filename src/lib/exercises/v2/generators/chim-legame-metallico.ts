/**
 * Il legame metallico. Spec: specs/exercises/chim-legame-metallico.md
 *
 * Six levels in the order of the lesson (docs/lezioni/chimica/riscritte/66-chim-legame-metallico.md), each one step
 * harder: the electron-sea model; how many electrons an atom shares, from its group (a whole number, open answer);
 * the electrons of the sea in a mass of metal; which of two metals melts higher, and why; the properties the model
 * explains, and metal against ionic crystal; alloys, with the carats of gold.
 */
import type { Generator, Rng } from '../types';
import { N_A, type BuiltF, art, cap, checkF, choose, elF, generateF, hund, shuffle, sig3, texOpt, textBlock, textOpt, toChoiceF, valenceF } from '../chim3-f';

export const ID = 'chim-legame-metallico';

type Fact = { q: string; a: string; wrong: string[]; why: string };

const fact = (rng: Rng, facts: Fact[], kind: string): BuiltF => {
	const k = rng.int(0, facts.length - 1);
	const f = facts[k];
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(f.q),
		solution: textOpt(f.a).latex,
		steps: [textBlock(f.why)],
		answer: choose(rng, textOpt(f.a), shuffle(rng, f.wrong).map((x) => textOpt(x))),
		params: { case: kind, k },
	};
};

// ---------------------------------------------------------------------------
// Level 1: the model

export const MODEL: Fact[] = [
	{ q: 'Nel modello del mare di elettroni, da che cosa è formato un metallo?', a: 'Cationi ed elettroni liberi', wrong: ['Cationi e anioni alternati', 'Molecole di metallo', 'Atomi neutri fermi'], why: 'Ogni atomo cede i suoi elettroni di valenza e diventa un catione; gli elettroni ceduti si muovono liberi tra i cationi del reticolo.' },
	{ q: 'Che cos\'è il legame metallico?', a: 'Attrazione tra cationi ed elettroni liberi', wrong: ['Attrazione tra cationi e anioni', 'Una coppia di elettroni condivisa', 'Attrazione tra molecole'], why: 'È l\'attrazione tra i cationi del reticolo e il mare di elettroni delocalizzati che li circonda.' },
	{ q: 'Che cosa vuol dire che un elettrone è delocalizzato?', a: 'Non appartiene a un atomo preciso', wrong: ['È uscito dal metallo', 'È fermo tra due atomi', 'Appartiene a un solo catione'], why: 'Un elettrone delocalizzato si muove in tutto il metallo: non appartiene a un atomo né a una coppia di atomi.' },
	{ q: 'Quali elettroni formano il mare di elettroni?', a: 'Gli elettroni di valenza', wrong: ['Tutti gli elettroni', 'Gli elettroni più interni', 'Elettroni presi da altri atomi'], why: 'Ogni atomo mette in comune solo i suoi elettroni di valenza, quelli che trattiene meno.' },
	{ q: 'Il legame metallico è direzionale?', a: 'No: agisce in tutte le direzioni', wrong: ['Sì: unisce coppie di atomi', 'Sì: va verso il polo positivo', 'Solo nei metalli puri'], why: 'Ogni catione è attratto dal mare di elettroni che ha intorno da tutte le parti, non da un vicino preciso.' },
	{ q: 'Un pezzo di sodio metallico contiene ioni negativi di sodio?', a: 'No: solo cationi ed elettroni', wrong: ['Sì: alternati ai cationi', 'Sì: al posto degli elettroni', 'No: solo atomi neutri'], why: 'Nel modello ci sono cationi, ma non anioni: la carica negativa è quella degli elettroni liberi.' },
	{ q: 'Perché tra gli atomi di un pezzo di sodio non c\'è un legame ionico?', a: 'Gli atomi sono tutti uguali', wrong: ['Il sodio non forma ioni', 'Il sodio ha troppi elettroni', 'Il sodio è un gas'], why: 'Nessun atomo ha motivo di strappare un elettrone a un altro identico, e mancherebbe l\'anione.' },
	{ q: 'Perché un pezzo di metallo è neutro?', a: 'Elettroni liberi e cariche dei cationi si compensano', wrong: ['I cationi non hanno carica', 'Gli elettroni non hanno carica', 'Contiene anioni'], why: 'Gli elettroni del mare sono tanti quante le cariche positive dei cationi.' },
	{ q: 'Qual è la formula del rame metallico?', a: 'Il simbolo Cu', wrong: ['La formula di una molecola', 'Il simbolo con la carica', 'Non ha formula'], why: 'Un metallo non è fatto di molecole: la sua formula è il simbolo dell\'elemento.' },
	{ q: 'Che cosa hanno in comune gli atomi dei metalli?', a: 'Pochi elettroni di valenza, trattenuti poco', wrong: ['Molti elettroni di valenza', 'Alta elettronegatività', 'L\'ottetto completo'], why: 'I metalli hanno pochi elettroni di valenza, bassa energia di ionizzazione e bassa elettronegatività.' },
];

const level1 = (rng: Rng) => fact(rng, MODEL, 'modello');

// ---------------------------------------------------------------------------
// Level 2: electrons shared by one atom

export const METALS_2 = ['Li', 'Na', 'K', 'Rb', 'Cs', 'Be', 'Mg', 'Ca', 'Sr', 'Ba', 'Al'];

function level2(rng: Rng): BuiltF {
	const e = elF(rng.pick(METALS_2));
	const v = valenceF(e);
	return {
		prompt: 'Conta gli elettroni messi in comune.',
		problem: textBlock(`${cap(art(e.nome))} è un metallo del gruppo $${e.group}$. Nel modello del mare di elettroni, quanti elettroni mette in comune ogni suo atomo?`),
		solution: String(v),
		steps: [textBlock(`Ogni atomo mette in comune i suoi elettroni di valenza. ${cap(art(e.nome))} è nel gruppo $${e.group}$ e ne ha $${v}$${e.group > 12 ? `: nei gruppi da 13 in poi sono il numero del gruppo meno dieci` : ''}.`)],
		// the group taken for the electrons; those missing to eight; one more, one less
		numbers: [v, e.group, 8 - v, v + 1, v - 1, 8],
		params: { case: `gruppo-${e.group}`, sym: e.sym },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the electrons of the sea in a mass

export const METALS_3 = ['Li', 'Na', 'K', 'Mg', 'Ca', 'Al'];
export const MOLES_3 = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5];

function level3(rng: Rng): BuiltF {
	const e = elF(rng.pick(METALS_3));
	const v = valenceF(e);
	const M = e.mass / 100;
	const n = rng.pick(MOLES_3);
	const mass = sig3(n * M);
	const m = Number(mass.value);
	if (sig3(m / M).value !== sig3(n).value) throw new Error('retry');
	const right = sig3(n * N_A * v);
	const opt = (x: number) => {
		const s = sig3(x);
		return texOpt(s.tex, s.value);
	};
	// the atoms, not the electrons; the mass not divided by the molar mass; the molar mass over the mass; one or two electrons more per atom
	const others = [...(v > 1 ? [opt(n * N_A)] : []), opt(m * N_A * v), opt((M / m) * N_A * v), opt(n * N_A * (v + 1)), opt(n * N_A * (v + 2))];
	return {
		prompt: 'Conta gli elettroni del mare.',
		problem: textBlock(
			`Quanti elettroni delocalizzati ci sono in $${mass.tex}\\,\\text{g}$ di ${e.nome}, metallo del gruppo $${e.group}$? La massa atomica è $${hund(e.mass)}$; usa $N_A = 6{,}02 \\cdot 10^{23}\\,\\text{mol}^{-1}$.`,
		),
		solution: right.tex,
		steps: [
			`n = \\dfrac{${mass.tex}\\,\\text{g}}{${hund(e.mass)}\\,\\text{g/mol}} = ${sig3(n).tex}\\,\\text{mol}`,
			textBlock(`Gli atomi sono $${sig3(n).tex} \\cdot 6{,}02 \\cdot 10^{23} = ${sig3(n * N_A).tex}$. Ogni atomo mette in comune ${v === 1 ? 'un elettrone' : `$${v}$ elettroni`}.`),
			v === 1 ? textBlock(`Gli elettroni delocalizzati sono tanti quanti gli atomi: $${right.tex}$.`) : `${v} \\cdot ${sig3(n * N_A).tex} = ${right.tex}`,
		],
		answer: choose(rng, texOpt(right.tex, right.value), others),
		params: { case: `elettroni-${v}`, sym: e.sym, moles: sig3(n).value },
	};
}

// ---------------------------------------------------------------------------
// Level 4: which of two metals melts higher

/** Same period, the second shares more electrons: [fewer, more]. Melting points in °C from elementi.json. */
export const BY_ELECTRONS: [string, string][] = [['Na', 'Mg'], ['K', 'Ca'], ['Rb', 'Sr'], ['Cs', 'Ba'], ['Li', 'Be'], ['Na', 'Al']];
/** Group 1, the first has the smaller cation: [smaller, larger]. */
export const BY_SIZE: [string, string][] = [['Li', 'Na'], ['Na', 'K'], ['K', 'Rb'], ['Rb', 'Cs'], ['Li', 'K'], ['Na', 'Rb'], ['Li', 'Rb'], ['Na', 'Cs'], ['K', 'Cs'], ['Li', 'Cs']];
/** Melting points in °C, rounded to the unit, from src/lib/tools/elementi.json. */
export const MELTING: Record<string, number> = { Li: 181, Na: 98, K: 63, Rb: 39, Cs: 28, Be: 1287, Mg: 650, Ca: 842, Sr: 777, Ba: 727, Al: 660 };

function level4(rng: Rng): BuiltF {
	const byElectrons = rng.next() < 0.5;
	const [low, high] = byElectrons ? rng.pick(BY_ELECTRONS) : (([s, l]) => [l, s])(rng.pick(BY_SIZE));
	const H = elF(high), L = elF(low);
	const [first, second] = rng.next() < 0.5 ? [H, L] : [L, H];
	const reason = byElectrons ? 'più elettroni in comune' : 'catione più piccolo';
	const opt = (e: typeof H, why: string, value: string) => textOpt(`${cap(art(e.nome))}: ${why}`, value);
	const others = byElectrons
		? [opt(L, 'catione più grande', 'L-grande'), opt(L, 'più elettroni in comune', 'L-elettroni'), opt(H, 'meno elettroni in comune', 'H-meno')]
		: [opt(L, 'catione più grande', 'L-grande'), opt(H, 'catione più grande', 'H-grande'), opt(L, 'catione più piccolo', 'L-piccolo')];
	const steps = byElectrons
		? [
				textBlock(`${cap(art(H.nome))} è nel gruppo $${H.group}$ e mette in comune $${valenceF(H)}$ elettroni per atomo; ${art(L.nome)}, nel gruppo $1$, uno solo.`),
				textBlock(`Più elettroni nel mare e cationi con carica più alta: l'attrazione è più intensa. I punti di fusione sono $${MELTING[high]}\\,^\\circ\\text{C}$ e $${MELTING[low]}\\,^\\circ\\text{C}$.`),
			]
		: [
				textBlock(`I due metalli sono nel gruppo $1$ e mettono in comune un elettrone per atomo. ${cap(art(H.nome))} sta più in alto nel gruppo e ha il catione più piccolo.`),
				textBlock(`Un catione più piccolo tiene gli elettroni più vicini e li attrae di più. I punti di fusione sono $${MELTING[high]}\\,^\\circ\\text{C}$ e $${MELTING[low]}\\,^\\circ\\text{C}$.`),
			];
	return {
		prompt: 'Confronta i due metalli.',
		problem: textBlock(`Quale metallo ha il punto di fusione più alto, ${art(first.nome)} o ${art(second.nome)}, e perché?`),
		solution: opt(H, reason, 'giusta').latex,
		steps,
		answer: choose(rng, opt(H, reason, byElectrons ? 'H-elettroni' : 'H-piccolo'), others),
		params: { case: byElectrons ? 'elettroni' : 'dimensioni', high, low },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the properties

export const PROPERTIES: Fact[] = [
	{ q: 'Perché un metallo conduce la corrente anche da solido?', a: 'Ha elettroni liberi di muoversi', wrong: ['Ha ioni liberi di muoversi', 'I cationi scorrono nel filo', 'Contiene molecole cariche'], why: 'Gli elettroni del mare sono liberi già nel solido, e con una pila si spostano verso il polo positivo.' },
	{ q: 'In un filo di rame percorso da corrente, quali particelle si spostano lungo il filo?', a: 'Gli elettroni', wrong: ['I cationi', 'Gli anioni', 'Gli atomi di rame'], why: 'I cationi restano al loro posto nel reticolo: la carica la trasportano gli elettroni.' },
	{ q: 'Che cosa succede alla resistenza elettrica di un metallo quando lo scaldi?', a: 'Aumenta', wrong: ['Diminuisce', 'Resta uguale', 'Si annulla'], why: 'I cationi vibrano di più attorno al loro posto e ostacolano il passaggio degli elettroni.' },
	{ q: 'Verso quale polo di una pila si spostano gli elettroni di un metallo?', a: 'Verso il polo positivo', wrong: ['Verso il polo negativo', 'Verso tutti e due', 'Non si spostano'], why: 'Gli elettroni sono negativi: al moto disordinato si aggiunge uno spostamento d\'insieme verso il polo positivo.' },
	{ q: 'Perché i metalli conducono bene il calore?', a: 'Gli elettroni liberi portano l\'energia', wrong: ['I cationi cambiano posto', 'Hanno legami deboli', 'Sono lucenti'], why: 'Gli elettroni liberi, leggeri e veloci, portano in fretta l\'energia cinetica da una zona all\'altra.' },
	{ q: 'Perché i metalli sono lucenti?', a: 'Gli elettroni liberi riemettono la luce', wrong: ['I cationi emettono luce', 'Sono trasparenti', 'Non assorbono mai luce'], why: 'Gli elettroni del mare assorbono luce di quasi tutti i colori e la riemettono subito.' },
	{ q: 'Che cosa vuol dire che un metallo è malleabile?', a: 'Si può ridurre in lamine', wrong: ['Si può tirare in fili', 'Fonde a bassa temperatura', 'Conduce la corrente'], why: 'Malleabile: si riduce in lamine sottili. Duttile: si tira in fili.' },
	{ q: 'Che cosa vuol dire che un metallo è duttile?', a: 'Si può tirare in fili', wrong: ['Si può ridurre in lamine', 'Si spacca sotto un colpo', 'Conduce il calore'], why: 'Duttile: si tira in fili. Malleabile: si riduce in lamine sottili.' },
	{ q: 'Perché un metallo colpito si deforma senza rompersi?', a: 'Gli strati scorrono nel mare di elettroni', wrong: ['Il legame metallico è debole', 'Gli strati si respingono', 'I cationi diventano neutri'], why: 'Dopo lo scorrimento ogni catione è ancora immerso negli elettroni: il legame non ha direzione e non si spezza.' },
	{ q: 'Un metallo è malleabile perché il legame metallico è debole?', a: 'No: perché non ha direzione', wrong: ['Sì: si rompe subito', 'Sì: gli atomi sono lontani', 'No: perché è ionico'], why: 'Il ferro si lavora a martellate e fonde a 1538 gradi: il legame è forte, ma si riforma uguale dopo lo scorrimento.' },
	{ q: 'Un solido conduce la corrente da solido e martellato si appiattisce. Che cos\'è?', a: 'Un metallo', wrong: ['Un composto ionico', 'Un solido fatto di molecole', 'Un sale fuso'], why: 'Cariche libere già nel solido e strati che scorrono senza rompere il legame: è un metallo.' },
	{ q: 'Un solido non conduce da solido, conduce fuso e martellato si sbriciola. Che cos\'è?', a: 'Un composto ionico', wrong: ['Un metallo', 'Una lega', 'Un metallo fuso'], why: 'Le cariche sono bloccate nel solido e lo scorrimento degli strati mette di fronte cariche uguali: è un composto ionico.' },
	{ q: 'Perché un cristallo ionico colpito si spacca e un metallo no?', a: 'Nel cristallo cariche uguali finiscono di fronte', wrong: ['Il metallo ha legami più deboli', 'Il cristallo ha elettroni liberi', 'Il metallo è fatto di molecole'], why: 'Nel cristallo ionico lo scorrimento porta ioni dello stesso segno uno di fronte all\'altro; nel metallo i cationi restano immersi negli elettroni.' },
	{ q: 'Quale di questi metalli è liquido a temperatura ambiente?', a: 'Il mercurio', wrong: ['Il tungsteno', 'Il sodio', "L'alluminio"], why: 'Il mercurio fonde a 39 gradi sotto zero. È un metallo di transizione: il modello del mare di elettroni non prevede il suo punto di fusione.' },
];

const level5 = (rng: Rng) => fact(rng, PROPERTIES, 'proprieta');

// ---------------------------------------------------------------------------
// Level 6: alloys

export const ALLOYS: Fact[] = [
	{ q: 'Che cos\'è una lega?', a: 'Un miscuglio omogeneo solido di un metallo', wrong: ['Un composto di due metalli', 'Un metallo puro', 'Un miscuglio eterogeneo'], why: 'Una lega è una soluzione solida in cui il componente principale è un metallo: non è un composto.' },
	{ q: 'Di che cosa è fatto l\'acciaio?', a: 'Ferro e carbonio', wrong: ['Rame e zinco', 'Rame e stagno', 'Ferro e rame'], why: 'L\'acciaio è ferro con una piccola quantità di carbonio, di solito meno del 2% in massa.' },
	{ q: 'Di che cosa è fatto l\'ottone?', a: 'Rame e zinco', wrong: ['Rame e stagno', 'Ferro e carbonio', 'Ferro e zinco'], why: 'L\'ottone è una lega di rame e zinco; rame e stagno danno il bronzo.' },
	{ q: 'Di che cosa è fatto il bronzo?', a: 'Rame e stagno', wrong: ['Rame e zinco', 'Ferro e carbonio', 'Ferro e stagno'], why: 'Il bronzo è una lega di rame e stagno; rame e zinco danno l\'ottone.' },
	{ q: 'Che tipo di lega è l\'acciaio?', a: 'Interstiziale', wrong: ['Di sostituzione', 'Ionica', 'Un composto'], why: 'Gli atomi di carbonio, molto più piccoli, occupano gli spazi vuoti tra gli atomi di ferro.' },
	{ q: 'Che tipo di lega è l\'ottone?', a: 'Di sostituzione', wrong: ['Interstiziale', 'Ionica', 'Un composto'], why: 'Atomi di zinco, di dimensioni simili, prendono il posto di atomi di rame nel reticolo.' },
	{ q: 'In una lega interstiziale, dove stanno gli atomi aggiunti?', a: 'Negli spazi vuoti del reticolo', wrong: ['Al posto di atomi del metallo', 'Solo sulla superficie', 'In molecole separate'], why: 'Atomi molto più piccoli di quelli del metallo occupano gli interstizi, gli spazi vuoti tra gli atomi.' },
	{ q: 'Perché una lega è di solito più dura del metallo puro?', a: 'Gli strati scorrono con più difficoltà', wrong: ['Ha più elettroni liberi', 'I legami diventano ionici', 'Ha atomi più pesanti'], why: 'Gli atomi estranei rendono il reticolo irregolare e ostacolano lo scorrimento degli strati.' },
	{ q: 'Una lega ha una formula chimica?', a: 'No: la composizione può variare', wrong: ['Sì: come ogni composto', 'Sì: il simbolo del metallo', 'Solo se è interstiziale'], why: 'Una lega è un miscuglio: la sua composizione si indica con le percentuali in massa.' },
];

export const CARATS = [9, 12, 14, 18, 21, 22];

function level6(rng: Rng): BuiltF {
	if (rng.next() < 0.5) return fact(rng, ALLOYS, 'lega');
	const c = rng.pick(CARATS);
	// masses in hundredths of a gram that give a gold mass with two decimals: multiples of 0,24 g
	const mass = 24 * rng.int(8, 50);
	const gold = (mass * c) / 24;
	const g2 = (k: number) => (k / 100).toFixed(2).replace('.', '{,}');
	const opt = (k: number) => texOpt(`${g2(k)}\\,\\text{g}`, (k / 100).toFixed(2));
	// the other metals instead of gold; carats over 100; the inverse ratio; carats over 18
	const others = [mass - gold, Math.round((mass * c) / 100), Math.round((mass * 24) / c), Math.round((mass * c) / 18)].filter((k) => k > 0).map(opt);
	return {
		prompt: 'Calcola la massa di oro.',
		problem: textBlock(`Un gioiello di oro a $${c}$ carati ha una massa di $${g2(mass)}\\,\\text{g}$. Quanti grammi di oro puro contiene?`),
		solution: `${g2(gold)}\\,\\text{g}`,
		steps: [textBlock(`I carati sono le parti in massa di oro su $24$.`), `${g2(mass)}\\,\\text{g} \\cdot \\dfrac{${c}}{24} = ${g2(gold)}\\,\\text{g}`],
		answer: choose(rng, opt(gold), others),
		params: { case: 'carati', carats: c, mass: (mass / 100).toFixed(2) },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => BuiltF> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

export const chimLegameMetallico: Generator = {
	id: ID,
	title: 'Il legame metallico',
	levels: {
		1: { label: 'Il modello del mare di elettroni', constraints: ['domande della lezione'] },
		2: { label: 'Elettroni messi in comune da un atomo', constraints: ['metalli dei gruppi 1, 2 e 13; risposta numerica'] },
		3: { label: 'Gli elettroni del mare in una massa', constraints: ['massa a tre cifre, N_A = 6,02 · 10²³'] },
		4: { label: 'Quale metallo fonde più in alto', constraints: ['stesso periodo o stesso gruppo; la regola è confermata dai punti di fusione'] },
		5: { label: 'Le proprietà dei metalli', constraints: ['domande della lezione'] },
		6: { label: 'Le leghe', constraints: ['domande della lezione oppure carati: massa di oro con due decimali'] },
	},
	generate: generateF(ID, LEVELS),
	check: checkF,
	toChoice: toChoiceF,
};

export default chimLegameMetallico;
