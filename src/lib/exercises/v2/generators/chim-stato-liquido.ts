/**
 * Lo stato liquido e la tensione di vapore. Spec: specs/exercises/chim-stato-liquido.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/74-chim-stato-liquido.md), each one step harder: the facts
 * on viscosity, surface tension and capillarity; the facts on evaporation, vapour pressure and boiling; the most
 * volatile of three or four liquids from their vapour pressures; the boiling temperature of water read from the
 * lesson's table, both ways; the same with the pressure in atmospheres (1 atm = 760 mmHg); whether a liquid boils or
 * only evaporates at a given external pressure. Every number of levels 4-6 is one of the lesson's tables.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, type Fact, cap, checkSample, choose, decTex, factLevel, generateWith, redraw, shuffled, texOpt, textBlock, textOpt } from '../chim3-h';

export const ID = 'chim-stato-liquido';

// ---------------------------------------------------------------------------
// Level 1: viscosity, surface tension, capillarity

export const FACTS_1: Fact[] = [
	{ q: "Che cos'è la viscosità di un liquido?", a: 'La resistenza che oppone allo scorrimento', wrong: ["La massa che c'è in un certo volume", 'La pressione del suo vapore', "L'energia per allargare la sua superficie"], why: "La viscosità è la resistenza che un liquido oppone allo scorrimento. La massa in un certo volume è la densità, che è un'altra grandezza." },
	{ q: 'Come cambia la viscosità di un liquido quando lo scaldi?', a: 'Diminuisce', wrong: ['Aumenta', 'Resta uguale', 'Dipende dalla quantità di liquido'], why: 'Scaldando, le particelle si muovono di più e vincono più facilmente le attrazioni: la viscosità diminuisce. Il miele tiepido cola più in fretta di quello freddo.' },
	{ q: 'Da quale di queste cose dipende la viscosità di un liquido?', a: 'Dalle forze intermolecolari', wrong: ['Dalla quantità di liquido', 'Dalla forma del recipiente', 'Dal volume del recipiente'], why: 'La viscosità dipende dalle forze intermolecolari, dalla forma delle molecole e dalla temperatura: più le forze sono intense, più il liquido è viscoso.' },
	{ q: "L'olio è più viscoso dell'acqua. È anche più denso?", a: "No: galleggia sull'acqua", wrong: ['Sì: viscoso vuol dire denso', 'Sì: scorre più lentamente', "Ha la stessa densità dell'acqua"], why: "Viscoso non vuol dire denso. L'olio è più viscoso dell'acqua ma è meno denso, tanto che ci galleggia sopra." },
	{ q: "Il mercurio è tredici volte più denso dell'acqua. Com'è la sua viscosità, rispetto a quella dell'acqua?", a: 'Di poco superiore', wrong: ['Tredici volte maggiore', 'Mille volte maggiore', 'Tredici volte minore'], why: "La viscosità non segue la densità: a $20\\,^\\circ\\text{C}$ il mercurio ha viscosità $1{,}55\\,\\text{mPa} \\cdot \\text{s}$, l'acqua $1{,}00\\,\\text{mPa} \\cdot \\text{s}$." },
	{ q: "Perché il glicerolo è più di mille volte più viscoso dell'acqua?", a: 'Forma molti legami a idrogeno', wrong: ["È mille volte più denso dell'acqua", 'Ha forze intermolecolari deboli', 'Ha molecole più leggere'], why: 'Il glicerolo ha tre gruppi $\\mathrm{OH}$ per molecola e forma molti legami a idrogeno: forze intermolecolari intense, viscosità alta.' },
	{ q: 'Perché gli oli, che hanno molecole lunghe, scorrono con difficoltà?', a: 'Le molecole si intrecciano tra loro', wrong: ['Le molecole sono molto dense', 'Le molecole formano legami metallici', 'Le molecole evaporano in fretta'], why: 'Le molecole lunghe si intrecciano tra loro e scorrono con più difficoltà di quelle piccole e compatte.' },
	{ q: 'Due sferette uguali cadono in due liquidi diversi. In quale scende più lentamente?', a: 'Nel liquido più viscoso', wrong: ['Nel liquido meno viscoso', 'Nel liquido più volatile', 'Scendono insieme'], why: 'Nel liquido più viscoso la sferetta scende più lentamente: è un modo per confrontare due viscosità.' },
	{ q: 'Quale di questi liquidi è il più viscoso a temperatura ambiente?', a: 'Il glicerolo', wrong: ["L'acqua", "L'acetone", "L'etere dietilico"], why: "A $20\\,^\\circ\\text{C}$ il glicerolo ha una viscosità di circa $1400\\,\\text{mPa} \\cdot \\text{s}$, l'acqua $1{,}00$, l'acetone $0{,}32$, l'etere dietilico $0{,}23$." },
	{ q: 'Perché la superficie di un liquido si comporta come una pellicola tesa?', a: "Le particelle della superficie sono tirate verso l'interno", wrong: ['Le particelle della superficie si respingono', 'Le particelle della superficie sono ferme', 'Le particelle della superficie sono più pesanti'], why: "Una particella della superficie ha vicine solo di lato e sotto, ed è tirata verso l'interno: la superficie tende a diventare più piccola possibile." },
	{ q: 'Che cosa misura la tensione superficiale?', a: "L'energia per allargare la superficie", wrong: ['La resistenza allo scorrimento', 'La pressione del vapore', "La massa che c'è in un certo volume"], why: "La tensione superficiale misura l'energia che serve per allargare la superficie del liquido di un metro quadrato." },
	{ q: 'Se le forze intermolecolari di un liquido sono più intense, come è la sua tensione superficiale?', a: 'Più alta', wrong: ['Più bassa', 'Uguale', 'Nulla'], why: 'Per portare una particella in superficie bisogna staccarla da una parte delle sue vicine: più le forze sono intense, più energia serve, e più alta è la tensione superficiale.' },
	{ q: 'Quale di questi liquidi ha la tensione superficiale più alta?', a: 'Il mercurio', wrong: ["L'acqua", "L'etanolo", "L'etere dietilico"], why: "A $20\\,^\\circ\\text{C}$: mercurio $485\\,\\text{mN/m}$, acqua $73$, etanolo $22$, etere dietilico $17$. Nel mercurio gli atomi sono uniti dal legame metallico." },
	{ q: "Tra l'acqua e l'etanolo, quale ha la tensione superficiale più alta?", a: "L'acqua", wrong: ["L'etanolo", 'Sono uguali', 'Dipende dalla quantità di liquido'], why: "L'acqua forma fino a quattro legami a idrogeno per molecola, l'etanolo uno: a $20\\,^\\circ\\text{C}$ l'acqua ha $73\\,\\text{mN/m}$, l'etanolo $22\\,\\text{mN/m}$." },
	{ q: 'Perché le gocce di mercurio restano quasi sferiche anche su un tavolo?', a: 'Il mercurio ha una tensione superficiale molto alta', wrong: ['Il mercurio è molto viscoso', "Il mercurio bagna il tavolo", 'Il mercurio è molto volatile'], why: 'Gli atomi del mercurio sono uniti dal legame metallico, molto più forte di qualunque forza intermolecolare: la tensione superficiale è molto alta e la goccia resta raccolta.' },
	{ q: 'Che forma prenderebbe una goccia di liquido se non ci fosse il peso a schiacciarla?', a: 'Una sfera', wrong: ['Un disco piatto', 'Un cubo', 'Una pellicola sottile'], why: 'La sfera è la forma che, a parità di volume, ha la superficie più piccola.' },
	{ q: 'Come cambia la tensione superficiale di un liquido quando la temperatura sale?', a: 'Diminuisce', wrong: ['Aumenta', 'Resta uguale', 'Dipende dalla forma del recipiente'], why: 'Come la viscosità, la tensione superficiale diminuisce quando la temperatura sale.' },
	{ q: "Che cos'è la coesione?", a: "L'attrazione tra le particelle del liquido", wrong: ["L'attrazione tra il liquido e il solido", 'La resistenza allo scorrimento', 'La pressione del vapore'], why: "La coesione è l'attrazione tra le particelle del liquido; l'adesione è quella tra le particelle del liquido e quelle del solido." },
	{ q: "Che cos'è l'adesione?", a: "L'attrazione tra il liquido e il solido", wrong: ["L'attrazione tra le particelle del liquido", 'La resistenza allo scorrimento', "L'energia per allargare la superficie"], why: "L'adesione è l'attrazione tra le particelle del liquido e quelle del solido; la coesione è quella tra le particelle del liquido." },
	{ q: 'Quando un liquido bagna un solido?', a: "Quando l'adesione supera la coesione", wrong: ["Quando la coesione supera l'adesione", 'Quando il liquido è molto denso', 'Quando il liquido è molto viscoso'], why: "Se l'adesione supera la coesione il liquido si allarga sul solido: lo bagna. Se vince la coesione resta raccolto in gocce." },
	{ q: "Perché l'acqua si allarga sul vetro pulito?", a: 'Forma legami a idrogeno con il vetro', wrong: ['Il vetro è fatto di molecole apolari', "La coesione supera l'adesione", "L'acqua è poco densa"], why: "Il vetro ha in superficie atomi di ossigeno con cui l'acqua forma legami a idrogeno: l'adesione supera la coesione." },
	{ q: "Perché l'acqua resta raccolta in gocce sulla cera?", a: "La coesione vince sull'adesione", wrong: ["L'adesione vince sulla coesione", 'La cera forma legami a idrogeno', "L'acqua è troppo viscosa"], why: "La cera è fatta di molecole apolari: l'adesione è debole, vince la coesione e l'acqua resta in gocce." },
	{ q: "Che menisco forma l'acqua in un tubo di vetro sottile?", a: 'Concavo', wrong: ['Convesso', 'Piatto', 'Nessun menisco'], why: "L'acqua sale lungo le pareti di vetro, che la attirano, e forma un menisco concavo." },
	{ q: 'Che menisco forma il mercurio in un tubo di vetro sottile?', a: 'Convesso', wrong: ['Concavo', 'Piatto', 'Nessun menisco'], why: 'Nel mercurio la coesione supera di molto l\'adesione al vetro: il mercurio scende e forma un menisco convesso.' },
	{ q: 'In quale tubo di vetro la capillarità è più marcata?', a: 'Nel tubo più sottile', wrong: ['Nel tubo più largo', 'Nel tubo più lungo', 'È uguale in tutti i tubi'], why: 'La capillarità è tanto più marcata quanto più il tubo è sottile.' },
];

// ---------------------------------------------------------------------------
// Level 2: evaporation, vapour pressure, boiling

export const FACTS_2: Fact[] = [
	{ q: 'Quali molecole riescono a sfuggire dalla superficie di un liquido?', a: 'Quelle con più energia cinetica', wrong: ['Quelle con meno energia cinetica', 'Tutte, con la stessa facilità', 'Quelle sul fondo del recipiente'], why: "Per sfuggire una molecola deve avere abbastanza energia da vincere le attrazioni delle vicine: ci riescono solo quelle più veloci." },
	{ q: "Perché l'evaporazione raffredda il liquido?", a: 'Se ne vanno le molecole più veloci', wrong: ['Se ne vanno le molecole più lente', 'Le molecole rimaste si fermano', "Il vapore porta nel liquido aria fredda"], why: "Se ne vanno le molecole più veloci, e l'energia media di quelle che restano diminuisce. Per questo il sudore rinfresca." },
	{ q: "Che cos'è un liquido volatile?", a: 'Un liquido che evapora facilmente', wrong: ['Un liquido molto viscoso', 'Un liquido poco denso', 'Un liquido che non evapora'], why: 'Un liquido che evapora facilmente si dice volatile: ha forze intermolecolari deboli e una tensione di vapore alta.' },
	{ q: "Da quale parte del liquido avviene l'evaporazione?", a: 'Solo dalla superficie', wrong: ['Da tutto il liquido', 'Solo dal fondo', "Solo dall'interno delle bolle"], why: "L'evaporazione avviene solo dalla superficie; nell'ebollizione il vapore si forma anche dentro il liquido." },
	{ q: "A quale temperatura avviene l'evaporazione?", a: 'A qualunque temperatura', wrong: ['Solo alla temperatura di ebollizione', 'Solo sopra la temperatura ambiente', 'Solo in un recipiente chiuso'], why: "L'evaporazione avviene a qualunque temperatura: a ogni temperatura alcune molecole hanno l'energia per sfuggire." },
	{ q: "Perché l'evaporazione è più rapida a temperatura più alta?", a: "Più molecole hanno l'energia per sfuggire", wrong: ['Le forze intermolecolari diventano più intense', 'Il liquido diventa più viscoso', 'Le molecole diventano più leggere'], why: "A temperatura più alta le molecole con energia sufficiente per sfuggire sono molte di più." },
	{ q: 'Perché liquidi diversi, alla stessa temperatura, evaporano con velocità diverse?', a: 'Hanno forze intermolecolari diverse', wrong: ['Hanno densità diverse', 'Hanno colori diversi', 'Occupano volumi diversi'], why: "Dove le forze intermolecolari sono deboli l'energia per sfuggire è piccola, e la superano molte molecole." },
	{ q: "Che cos'è la tensione di vapore di un liquido?", a: 'La pressione del vapore in equilibrio con il liquido', wrong: ["La pressione dell'aria sopra il liquido", 'La forza che tiene tesa la superficie', 'La temperatura a cui il liquido bolle'], why: 'La tensione di vapore è la pressione che il vapore esercita quando è in equilibrio con il suo liquido, a una certa temperatura.' },
	{ q: 'In un recipiente chiuso un liquido è in equilibrio con il suo vapore. Che cosa fanno evaporazione e condensazione?', a: 'Continuano tutte e due, alla pari', wrong: ['Si fermano tutte e due', "Continua solo l'evaporazione", 'Continua solo la condensazione'], why: "È un equilibrio dinamico: il numero di molecole che rientrano nel liquido uguaglia il numero di quelle che escono, e la quantità di vapore non cambia più." },
	{ q: 'In un recipiente chiuso, quando liquido e vapore sono in equilibrio, come cambia la quantità di vapore?', a: 'Non cambia più', wrong: ['Continua ad aumentare', 'Diminuisce fino a zero', 'Raddoppia ogni minuto'], why: "All'equilibrio evaporazione e condensazione continuano alla pari, e la quantità di vapore non cambia più." },
	{ q: 'Da che cosa dipende la tensione di vapore?', a: 'Dal liquido e dalla temperatura', wrong: ['Dalla quantità di liquido', 'Dal volume del recipiente', 'Dalla forma del recipiente'], why: "La tensione di vapore dipende da due sole cose: quale liquido è e a che temperatura si trova. Non dipende dalla quantità di liquido né dal recipiente." },
	{ q: "Un cucchiaio d'acqua e un litro d'acqua sono chiusi in due recipienti alla stessa temperatura. In quale la tensione di vapore è più alta?", a: 'È uguale nei due recipienti', wrong: ['Dove c\'è un litro', "Dove c'è un cucchiaio", 'Dipende dalla forma del recipiente'], why: "Più liquido non dà più tensione di vapore: a $20\\,^\\circ\\text{C}$ l'acqua ha sopra di sé vapore a $17{,}5\\,\\text{mmHg}$, che sia un cucchiaio o un litro." },
	{ q: 'Lo stesso liquido, alla stessa temperatura, è chiuso in un recipiente piccolo e in uno grande, e in tutti e due resta del liquido. In quale la tensione di vapore è più alta?', a: 'È uguale nei due recipienti', wrong: ['Nel recipiente piccolo', 'Nel recipiente grande', "Dove c'è più liquido"], why: "La tensione di vapore non dipende dalla forma o dal volume del recipiente, purché all'equilibrio resti ancora del liquido." },
	{ q: 'Come cambia la tensione di vapore di un liquido quando lo scaldi?', a: 'Aumenta, sempre più in fretta', wrong: ['Aumenta in modo proporzionale', 'Diminuisce', 'Resta uguale'], why: "Scaldando, le molecole con energia sufficiente per sfuggire aumentano e la tensione di vapore sale. Non sale in modo proporzionale: cresce sempre più in fretta." },
	{ q: "A parità di temperatura, com'è la tensione di vapore di un liquido con forze intermolecolari deboli?", a: 'Alta', wrong: ['Bassa', 'Nulla', 'Uguale a quella di ogni altro liquido'], why: 'Un liquido con forze intermolecolari deboli manda nel vapore molte molecole e ha una tensione di vapore alta: è volatile.' },
	{ q: 'Quando bolle un liquido?', a: 'Quando la tensione di vapore uguaglia la pressione esterna', wrong: ['Quando comincia a evaporare', 'Quando la tensione di vapore si annulla', 'Sempre a 100 °C'], why: 'Un liquido bolle quando la sua tensione di vapore uguaglia la pressione esterna: solo allora una bolla di vapore regge la pressione che la schiaccia da fuori.' },
	{ q: "Che cos'è la temperatura di ebollizione normale di un liquido?", a: 'Quella misurata a 1 atm', wrong: ['Quella misurata nel vuoto', 'Quella misurata in alta montagna', "Quella a cui comincia l'evaporazione"], why: 'La temperatura di ebollizione dipende dalla pressione esterna. Quella delle tabelle, misurata a $1\\,\\text{atm}$, è la temperatura di ebollizione normale.' },
	{ q: 'Da che cosa dipende la temperatura a cui bolle un dato liquido?', a: 'Dalla pressione esterna', wrong: ['Dalla quantità di liquido', 'Dalla forma del recipiente', 'Da niente: è sempre la stessa'], why: 'Il liquido bolle quando la tensione di vapore uguaglia la pressione esterna: se la pressione esterna cambia, cambia la temperatura di ebollizione.' },
	{ q: "In alta montagna la pressione atmosferica è più bassa. A che temperatura bolle l'acqua, rispetto a $100\\,^\\circ\\text{C}$?", a: 'A una temperatura più bassa', wrong: ['A una temperatura più alta', 'Alla stessa temperatura', 'Non può bollire'], why: "Con una pressione esterna più bassa la tensione di vapore la raggiunge prima: l'acqua bolle sotto i $100\\,^\\circ\\text{C}$." },
	{ q: "Nella pentola a pressione, a che temperatura bolle l'acqua, rispetto a $100\\,^\\circ\\text{C}$?", a: 'A una temperatura più alta', wrong: ['A una temperatura più bassa', 'Alla stessa temperatura', 'Non può bollire'], why: "Il vapore trattenuto dal coperchio fa salire la pressione, e l'acqua bolle sopra i $100\\,^\\circ\\text{C}$." },
	{ q: "Perché nella pentola a pressione l'acqua bolle a una temperatura più alta?", a: 'Il vapore trattenuto fa salire la pressione', wrong: ['Il coperchio abbassa la pressione', "L'acqua diventa più viscosa", "C'è più acqua che in una pentola normale"], why: "Il vapore trattenuto dal coperchio fa salire la pressione: la tensione di vapore dell'acqua la raggiunge solo a una temperatura più alta." },
	{ q: 'Di che cosa sono fatte le bolle di un liquido che bolle?', a: 'Del vapore di quel liquido', wrong: ['Di aria', 'Di idrogeno e ossigeno', 'Di vuoto'], why: 'Le bolle dell\'ebollizione non sono aria: sono fatte del vapore di quel liquido.' },
	{ q: "Che cosa sono le bollicine che compaiono sulle pareti di una pentola d'acqua molto prima dell'ebollizione?", a: "Aria che era sciolta nell'acqua", wrong: ["Vapore d'acqua", 'Idrogeno e ossigeno', 'Acqua che bolle in anticipo'], why: "Sono aria che era sciolta nell'acqua e che, scaldando, esce dalla soluzione. Le bolle dell'ebollizione sono invece vapore." },
	{ q: 'Che cosa fa un liquido finché la sua tensione di vapore è minore della pressione esterna?', a: 'Evapora solo dalla superficie', wrong: ['Bolle lentamente', 'Non evapora affatto', 'Bolle solo sul fondo'], why: 'Finché la tensione di vapore è minore della pressione esterna ogni bolla verrebbe subito schiacciata: il liquido evapora solo dalla superficie.' },
	{ q: 'Un liquido molto volatile, alla stessa pressione esterna, bolle a una temperatura alta o bassa?', a: 'Bassa', wrong: ['Alta', 'Sempre a 100 °C', 'Non bolle mai'], why: 'Un liquido volatile ha una tensione di vapore già alta a temperatura ambiente, e gli serve poco riscaldamento per arrivare alla pressione esterna.' },
];

// ---------------------------------------------------------------------------
// The lesson's tables. Pressures in tenths of mmHg, so that every number is an integer.

/** Vapour pressure of water: [°C, tenths of mmHg]. */
export const WATER: [number, number][] = [
	[0, 46],
	[20, 175],
	[25, 238],
	[40, 553],
	[60, 1490],
	[80, 3550],
	[90, 5260],
	[100, 7600],
	[120, 14890],
];

/** The four liquids at 20 °C, in the order of the lesson's table: [name, tenths of mmHg]. */
export const AT_20: [string, number][] = [
	['etere dietilico', 4400],
	['acetone', 1850],
	['etanolo', 440],
	['acqua', 175],
];

const num = (p10: number) => (p10 % 10 === 0 ? String(p10 / 10) : decTex((p10 / 10).toFixed(1)));
const val = (p10: number) => (p10 % 10 === 0 ? String(p10 / 10) : (p10 / 10).toFixed(1));
const mm = (p10: number) => `${num(p10)}\\,\\text{mmHg}`;
const deg = (T: number) => `${T}\\,^\\circ\\text{C}`;
const tOpt = (T: number) => texOpt(deg(T), String(T));
const pOpt = (p10: number) => texOpt(mm(p10), val(p10));
/** Digits in groups of three from five digits on: 113\,240. */
const grouped = (n: number) => (n < 10000 ? String(n) : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\\,'));

const HEAD_T = '\\text{temperatura} & \\text{tensione di vapore} \\\\ (^\\circ\\text{C}) & (\\text{mmHg}) \\\\ \\hline';
const HEAD_L = '\\text{liquido} & \\text{tensione di vapore} \\\\ & (\\text{mmHg}) \\\\ \\hline';
const table = (head: string, rows: string[]) => `\\begin{array}{c|c} ${head} ${rows.join(' \\\\ ')} \\end{array}`;
const waterTable = (rows: number[]) => table(HEAD_T, rows.map((i) => `${WATER[i][0]} & ${num(WATER[i][1])}`));
const liquidTable = (rows: [string, number][]) => table(HEAD_L, rows.map(([name, p]) => `\\text{${name}} & ${num(p)}`));

/** The rows of the water table shown: all of them, or five to seven with the one that is needed. */
function waterRows(rng: Rng, needed: number): number[] {
	const all = WATER.map((_, i) => i);
	if (rng.next() < 0.35) return all;
	const others = shuffled(rng, all.filter((i) => i !== needed)).slice(0, rng.int(4, 6));
	return [needed, ...others].sort((a, b) => a - b);
}

/** The rows next to the needed one in the table shown, then 100 °C, then the others: the order of the distractors. */
function nearRows(rng: Rng, rows: number[], needed: number): number[] {
	const at = rows.indexOf(needed);
	const near = [rows[at - 1], rows[at + 1]].filter((x): x is number => x !== undefined);
	const rest = shuffled(rng, rows.filter((r) => r !== needed && !near.includes(r)));
	return [...shuffled(rng, near), 7, ...rest];
}

// ---------------------------------------------------------------------------
// Level 3: the most volatile

const LETTERS = ['A', 'B', 'C', 'D'];
const QUESTIONS_3 = {
	volatile: { q: 'Qual è il più volatile?', top: true, same: 'Sono volatili allo stesso modo' },
	forze: { q: 'In quale le forze intermolecolari sono più intense?', top: false, same: 'Le forze sono uguali in tutti' },
	alta: { q: 'Quale bolle alla temperatura più alta, a parità di pressione esterna?', top: false, same: 'Bollono alla stessa temperatura' },
	bassa: { q: 'Quale bolle alla temperatura più bassa, a parità di pressione esterna?', top: true, same: 'Bollono alla stessa temperatura' },
} as const;
type Q3 = keyof typeof QUESTIONS_3;

function level3(rng: Rng): Built {
	const n = rng.int(3, 4);
	// between 5 and 600 mmHg, spread on a logarithmic scale, any two at least 30% apart
	const vals = Array.from({ length: n }, () => Math.round(5 * 120 ** rng.next()));
	for (let i = 0; i < n; i++) for (let j = 0; j < i; j++) if (Math.max(vals[i], vals[j]) < 1.3 * Math.min(vals[i], vals[j]) + 3) redraw();
	const kind = rng.pick(Object.keys(QUESTIONS_3) as Q3[]);
	const { q, top, same } = QUESTIONS_3[kind];
	const hi = vals.indexOf(Math.max(...vals));
	const lo = vals.indexOf(Math.min(...vals));
	const right = top ? hi : lo;
	const opposite = top ? lo : hi;
	const opt = (i: number) => textOpt(`Il liquido ${LETTERS[i]}`, LETTERS[i]);
	const rest = shuffled(rng, vals.map((_, i) => i).filter((i) => i !== right && i !== opposite));
	const p = `$${vals[right]}\\,\\text{mmHg}$`;
	const why: Record<Q3, string> = {
		volatile: `Il più volatile è il liquido con la tensione di vapore più alta: ${LETTERS[right]}, con ${p}.`,
		forze: `Le forze più intense sono nel liquido che manda meno molecole nel vapore, quello con la tensione di vapore più bassa: ${LETTERS[right]}, con ${p}.`,
		alta: `Il liquido con la tensione di vapore più bassa, ${LETTERS[right]} con ${p}, deve essere scaldato di più per arrivare alla pressione esterna: bolle alla temperatura più alta.`,
		bassa: `Il liquido con la tensione di vapore più alta, ${LETTERS[right]} con ${p}, è già più vicino alla pressione esterna: gli serve meno riscaldamento, e bolle alla temperatura più bassa.`,
	};
	return {
		prompt: 'Confronta le tensioni di vapore.',
		problem: textBlock(`La tabella dà la tensione di vapore di ${n === 3 ? 'tre' : 'quattro'} liquidi a $${deg(20)}$. ${q}`, 46, [table(HEAD_L, vals.map((v, i) => `\\text{${LETTERS[i]}} & ${v}`))]),
		solution: opt(right).latex,
		steps: [textBlock(why[kind])],
		answer: choose(rng, opt(right), [opt(opposite), ...rest.map(opt), textOpt(same, 'uguali')]),
		params: { case: kind, vals },
	};
}

// ---------------------------------------------------------------------------
// Level 4: reading the table of water

const INTRO_W = "La tabella dà la tensione di vapore dell'acqua a varie temperature.";
const RULE = 'Un liquido bolle quando la sua tensione di vapore uguaglia la pressione esterna.';

function level4(rng: Rng): Built {
	const i = rng.int(1, WATER.length - 1); // not 0 °C: there water freezes
	const [T, p] = WATER[i];
	const rows = waterRows(rng, i);
	const near = nearRows(rng, rows, i);
	const tab = waterTable(rows);
	if (rng.next() < 0.5) {
		return {
			prompt: 'Trova la temperatura di ebollizione.',
			problem: textBlock(`${INTRO_W} A che temperatura bolle l'acqua se la pressione esterna è $${mm(p)}$?`, 46, [tab]),
			solution: deg(T),
			steps: [textBlock(RULE), textBlock(`Nella tabella l'acqua ha una tensione di vapore di $${mm(p)}$ a $${deg(T)}$: con quella pressione esterna bolle a $${deg(T)}$.`)],
			answer: choose(rng, tOpt(T), near.map((r) => tOpt(WATER[r][0]))),
			params: { case: 'temperatura', T, rows: rows.map((r) => WATER[r][0]) },
		};
	}
	return {
		prompt: 'Trova la pressione esterna.',
		problem: textBlock(`${INTRO_W} In un recipiente l'acqua bolle a $${deg(T)}$. Qual è la pressione esterna?`, 46, [tab]),
		solution: mm(p),
		steps: [textBlock(RULE), textBlock(`Nella tabella, a $${deg(T)}$ la tensione di vapore dell'acqua è $${mm(p)}$: la pressione esterna è $${mm(p)}$.`)],
		answer: choose(rng, pOpt(p), near.map((r) => pOpt(WATER[r][1]))),
		params: { case: 'pressione', T, rows: rows.map((r) => WATER[r][0]) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: with the atmospheres

const REMIND = 'Ricorda che $1\\,\\text{atm} = 760\\,\\text{mmHg}$.';

/** External pressures in atm that, times 760, give a row of the water table: [atm, row]. */
export const IN_ATM: [string, number][] = [
	['0.196', 4],
	['0.467', 5],
	['0.692', 6],
	['1.96', 8],
];

/** num/den with three significant figures ("0.196", "13.7"); null when the fourth figure is too close to a 5. */
export function sig3(numerator: number, den: number): string | null {
	const x = numerator / den;
	let k = 0;
	while (x * 10 ** k < 100) k++;
	const y = x * 10 ** k;
	if (y >= 1000 || Math.abs(y - Math.floor(y) - 0.5) < 0.05) return null;
	const m = Math.round(y);
	return m === 1000 ? null : (m / 10 ** k).toFixed(k);
}

const atmOpt = (s: string) => texOpt(`${decTex(s)}\\,\\text{atm}`, s);

/** The four options of "which external pressure in atm": the quotient, then the product, the same number, a row nearby, the inverse quotient. */
function atmChoice(rng: Rng, p10: number, near: number[]) {
	const right = sig3(p10, 7600);
	if (!right) redraw();
	const others = [texOpt(`${grouped(p10 * 76)}\\,\\text{atm}`, String(p10 * 76)), texOpt(`${num(p10)}\\,\\text{atm}`, `mmHg ${val(p10)}`)];
	for (const s of shuffled(rng, [...near.slice(0, 1).map((q) => sig3(q, 7600)), sig3(7600, p10)])) if (s) others.push(atmOpt(s));
	return { right: atmOpt(right), answer: choose(rng, atmOpt(right), others) };
}

function level5(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const [atm, i] = rng.pick(IN_ATM);
		const [T, p] = WATER[i];
		const rows = waterRows(rng, i);
		const product = Math.round(Number(atm) * 760);
		const exact = product * 10 === p;
		return {
			prompt: 'Trova la temperatura di ebollizione.',
			problem: textBlock(`${INTRO_W} A che temperatura bolle l'acqua se la pressione esterna è $${decTex(atm)}\\,\\text{atm}$? ${REMIND}`, 46, [waterTable(rows)]),
			solution: deg(T),
			steps: [
				textBlock('La tabella è in millimetri di mercurio: converti la pressione esterna.'),
				`${decTex(atm)} \\cdot 760 \\approx ${product}\\,\\text{mmHg}`,
				textBlock(
					exact
						? `Nella tabella l'acqua ha una tensione di vapore di $${mm(p)}$ a $${deg(T)}$: bolle a $${deg(T)}$.`
						: `Nella tabella il valore più vicino è $${mm(p)}$, a $${deg(T)}$: l'acqua bolle a $${deg(T)}$.`,
				),
			],
			answer: choose(rng, tOpt(T), nearRows(rng, rows, i).map((r) => tOpt(WATER[r][0]))),
			params: { case: 'temperatura', atm, T },
		};
	}
	const k = rng.int(0, 9);
	const ask = (liquid: string, T: number) => `A quale pressione esterna, in atmosfere, ${liquid} bolle a $${deg(T)}$? ${REMIND}`;
	const steps = (liquid: string, T: number, p10: number, right: string, from: string) => [
		textBlock(`${cap(liquid)} bolle a $${deg(T)}$ quando la pressione esterna è uguale alla sua tensione di vapore a quella temperatura, che ${from} è $${mm(p10)}$.`),
		`\\dfrac{${num(p10)}}{760} \\approx ${right}`,
	];
	if (k < 5) {
		const i = [3, 4, 5, 6, 8][k]; // 40, 60, 80, 90, 120 °C
		const [T, p] = WATER[i];
		const rows = waterRows(rng, i);
		const { right, answer } = atmChoice(rng, p, nearRows(rng, rows, i).map((r) => WATER[r][1]));
		return {
			prompt: 'Trova la pressione esterna.',
			problem: textBlock(`${INTRO_W} ${ask("l'acqua", T)}`, 46, [waterTable(rows)]),
			solution: right.latex,
			steps: steps("l'acqua", T, p, right.latex, 'nella tabella'),
			answer,
			params: { case: 'pressione', liquid: 'acqua', T, p: val(p) },
		};
	}
	if (k < 9) {
		const j = k - 5;
		const [name, p] = AT_20[j];
		// the lesson's four rows, or three of them
		const hidden = rng.next() < 0.5 ? -1 : rng.pick([0, 1, 2, 3].filter((y) => y !== j));
		const shown = AT_20.filter((_, x) => x !== hidden);
		const at = shown.findIndex(([nm]) => nm === name);
		const near = shuffled(rng, [shown[at - 1], shown[at + 1]].filter((x): x is [string, number] => x !== undefined)).map(([, q]) => q);
		const { right, answer } = atmChoice(rng, p, near);
		return {
			prompt: 'Trova la pressione esterna.',
			problem: textBlock(`La tabella dà la tensione di vapore di alcuni liquidi a $${deg(20)}$. ${ask(`l'${name}`, 20)}`, 46, [liquidTable(shown)]),
			solution: right.latex,
			steps: steps(`l'${name}`, 20, p, right.latex, 'nella tabella'),
			answer,
			params: { case: 'pressione', liquid: name, T: 20, p: val(p) },
		};
	}
	const p = 3510; // ethanol at 60 °C, worked example 4 of the lesson
	const { right, answer } = atmChoice(rng, p, [AT_20[2][1]]);
	return {
		prompt: 'Trova la pressione esterna.',
		problem: textBlock(`L'etanolo ha una tensione di vapore di $${mm(p)}$ a $${deg(60)}$. ${ask("l'etanolo", 60)}`),
		solution: right.latex,
		steps: steps("l'etanolo", 60, p, right.latex, 'secondo il testo'),
		answer,
		params: { case: 'pressione', liquid: 'etanolo', T: 60, p: val(p) },
	};
}

// ---------------------------------------------------------------------------
// Level 6: does it boil?

/** A liquid at a temperature with its vapour pressure, from the lesson's tables: [name, °C, tenths of mmHg]. */
export const STATES: [string, number, number][] = [
	...WATER.slice(1).map(([T, p]): [string, number, number] => ['acqua', T, p]),
	['etere dietilico', 20, 4400],
	['etere dietilico', 35, 7600],
	['acetone', 20, 1850],
	['acetone', 56, 7600],
	['etanolo', 20, 440],
	['etanolo', 60, 3510],
	['etanolo', 78, 7600],
];
/** External pressures of the cases that do not boil, in mmHg. */
const OUTSIDE = [100, 200, 300, 400, 526, 600, 700, 760, 900, 1000, 1520, 2000, 2280];

export const OPTIONS_6 = {
	bolle: 'Bolle: la tensione di vapore uguaglia la pressione esterna',
	evapora: 'Evapora ma non bolle: la tensione di vapore è minore della pressione esterna',
	cento: (water: boolean) => `Non bolle: ${water ? "l'acqua" : 'un liquido'} bolle solo a 100 °C`,
	niente: 'Non evapora né bolle: un liquido evapora solo se bolle',
};

function level6(rng: Rng): Built {
	const boils = rng.next() < 0.5;
	const [name, T, p] = rng.pick(STATES);
	const water = name === 'acqua';
	// never below the vapour pressure; for water never 760 mmHg when it does not boil ("it is not at 100 °C" would then be a fair reason)
	const outside = boils ? p : 10 * rng.pick(OUTSIDE.filter((x) => x * 10 >= 1.25 * p && !(water && x === 760)));
	const right = boils ? 'bolle' : 'evapora';
	const wrong = boils ? 'evapora' : 'bolle';
	const steps = boils
		? [textBlock(`La tensione di vapore, $${mm(p)}$, è uguale alla pressione esterna: l'${name} bolle.`)]
		: [textBlock(`La tensione di vapore, $${mm(p)}$, è minore della pressione esterna, $${mm(outside)}$: una bolla di vapore verrebbe subito schiacciata.`), textBlock(`L'${name} evapora dalla superficie ma non bolle.`)];
	if (boils && T !== 100) steps.push(textBlock(water ? `L'acqua non bolle sempre a $${deg(100)}$: quella è la sua temperatura di ebollizione a $1\\,\\text{atm}$.` : `La temperatura di ebollizione dipende dalla pressione esterna e dal liquido: non è $${deg(100)}$ per tutti.`));
	return {
		prompt: 'Bolle o non bolle?',
		problem: textBlock(`L'${name}, a $${deg(T)}$, ha una tensione di vapore di $${mm(p)}$. È in un recipiente aperto, in un ambiente dove la pressione esterna è $${mm(outside)}$. Che cosa succede al liquido?`),
		solution: textOpt(OPTIONS_6[right]).latex,
		steps,
		answer: choose(rng, textOpt(OPTIONS_6[right], right), [textOpt(OPTIONS_6[wrong], wrong), textOpt(OPTIONS_6.cento(water), 'cento'), textOpt(OPTIONS_6.niente, 'niente')]),
		params: { case: right, liquid: name, T, p: val(p), outside: val(outside) },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: factLevel(FACTS_1), 2: factLevel(FACTS_2), 3: level3, 4: level4, 5: level5, 6: level6 };

function check(sample: Sample): string[] {
	const v = checkSample(sample);
	if (sample.answer.kind !== 'choice') v.push('la risposta deve essere a scelta multipla');
	return v;
}

export const chimStatoLiquido: Generator = {
	id: ID,
	title: 'Lo stato liquido e la tensione di vapore',
	levels: {
		1: { label: 'Viscosità, tensione superficiale, capillarità', constraints: ['domande fisse della lezione'] },
		2: { label: 'Evaporazione e tensione di vapore', constraints: ['domande fisse della lezione'] },
		3: { label: 'Il più volatile', constraints: ['tre o quattro liquidi, tensioni di vapore tra 5 e 600 mmHg ben distinte'] },
		4: { label: 'Leggere la tabella della tensione di vapore', constraints: ["la tabella dell'acqua, nei due versi"] },
		5: { label: 'Con le atmosfere', constraints: ['1 atm = 760 mmHg, tre cifre significative'] },
		6: { label: 'Bolle o non bolle', constraints: ['pressione esterna uguale alla tensione di vapore o nettamente maggiore'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimStatoLiquido;
