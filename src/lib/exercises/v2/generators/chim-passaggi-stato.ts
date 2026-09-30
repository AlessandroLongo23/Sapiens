/**
 * I passaggi di stato. Spec: specs/exercises/chim-passaggi-stato.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/19-chim-passaggi-stato.md), all multiple choice: the
 * name of a change of state (from the two states, or from an everyday fact); whether it takes or gives heat, and
 * why; which of four substances of the lesson's table is solid, liquid or gaseous at a temperature; which changes
 * happen when a substance goes from one temperature to another; evaporation, boiling and pressure.
 */
import type { Rng } from '../types';
import { type Built, cap, choose, deg, makeGenerator, opt, shuffle, textBlock } from '../chim-materia2';

export const ID = 'chim-passaggi-stato';

export const NAMES = ['fusione', 'solidificazione', 'vaporizzazione', 'condensazione', 'sublimazione', 'brinamento'] as const;
type Name = (typeof NAMES)[number];
const INVERSE: Record<Name, Name> = { fusione: 'solidificazione', solidificazione: 'fusione', vaporizzazione: 'condensazione', condensazione: 'vaporizzazione', sublimazione: 'brinamento', brinamento: 'sublimazione' };
const FROM_TO: Record<Name, [string, string]> = { fusione: ['solido', 'liquido'], solidificazione: ['liquido', 'solido'], vaporizzazione: ['liquido', 'aeriforme'], condensazione: ['aeriforme', 'liquido'], sublimazione: ['solido', 'aeriforme'], brinamento: ['aeriforme', 'solido'] };
const ABSORBS: Record<Name, boolean> = { fusione: true, vaporizzazione: true, sublimazione: true, solidificazione: false, condensazione: false, brinamento: false };

/** Everyday facts and the change of state they show. */
const FACTS: [string, Name][] = [
	["D'inverno, al mattino, il vetro dell'auto è coperto di cristalli di ghiaccio formati dal vapore dell'aria.", 'brinamento'],
	['Lo specchio del bagno si appanna dopo la doccia.', 'condensazione'],
	['Un pezzo di burro in padella diventa liquido.', 'fusione'],
	['Una pozzanghera si asciuga al sole.', 'vaporizzazione'],
	["Un pezzo di ghiaccio secco sparisce nell'aria senza lasciare liquido.", 'sublimazione'],
	["Le palline di naftalina nell'armadio diventano sempre più piccole.", 'sublimazione'],
	["L'acqua messa nel freezer diventa ghiaccio.", 'solidificazione'],
	['La cera che cola da una candela si indurisce sul tavolo.', 'solidificazione'],
	["Al mattino l'erba è bagnata di rugiada.", 'condensazione'],
	['La neve sul tetto diventa acqua al sole di primavera.', 'fusione'],
	['Lo iodio solido, scaldato piano, diventa un vapore viola senza fondere.', 'sublimazione'],
	['Il vapore di iodio forma cristalli lucidi sul fondo freddo di un pallone.', 'brinamento'],
	["L'acqua della pentola bolle.", 'vaporizzazione'],
	['In fonderia il ferro fuso, versato negli stampi, diventa solido.', 'solidificazione'],
	['Sulla bottiglia presa dal frigorifero si formano goccioline.', 'condensazione'],
	["Nell'altoforno il ferro diventa liquido.", 'fusione'],
	['I panni stesi si asciugano.', 'vaporizzazione'],
	['Nel congelatore, sulle pareti fredde, si forma uno strato di ghiaccio dal vapore dell’aria.', 'brinamento'],
];

// ---------------------------------------------------------------------------
// Level 1: the name

function level1(rng: Rng): Built {
	const fromFact = rng.int(0, 1) === 1;
	const i = rng.int(0, fromFact ? FACTS.length - 1 : NAMES.length - 1);
	const name: Name = fromFact ? FACTS[i][1] : NAMES[i];
	const [a, b] = FROM_TO[name];
	const others = [INVERSE[name], ...shuffle(rng, NAMES.filter((n) => n !== name && n !== INVERSE[name]))];
	return {
		prompt: 'Scegli il nome del passaggio di stato.',
		problem: textBlock(fromFact ? `${FACTS[i][0]} Quale passaggio di stato avviene?` : `Come si chiama il passaggio di una sostanza dallo stato ${a} allo stato ${b}?`),
		solution: opt(cap(name)).latex,
		steps: [textBlock(`Il passaggio da ${a} a ${b} si chiama ${name}; il passaggio inverso è ${INVERSE[name] === 'brinamento' ? 'il brinamento' : `la ${INVERSE[name]}`}.`)],
		choice: choose(rng, opt(cap(name), name), others.map((n) => opt(cap(n), n))),
		params: { case: fromFact ? 'fatto' : 'stati', name },
	};
}

// ---------------------------------------------------------------------------
// Level 2: heat taken or given

export const ENERGY = ['Assorbe calore: le particelle si allontanano', 'Assorbe calore: le particelle si avvicinano', 'Cede calore: le particelle si avvicinano', 'Cede calore: le particelle si allontanano'] as const;

function level2(rng: Rng): Built {
	const fromFact = rng.int(0, 1) === 1;
	const i = rng.int(0, fromFact ? FACTS.length - 1 : NAMES.length - 1);
	const name: Name = fromFact ? FACTS[i][1] : NAMES[i];
	const right = ABSORBS[name] ? ENERGY[0] : ENERGY[2];
	const article = name === 'brinamento' ? 'il brinamento' : `la ${name}`;
	return {
		prompt: 'Scegli che cosa succede all’energia.',
		problem: textBlock(fromFact ? `${FACTS[i][0]} Durante questo passaggio di stato, la sostanza assorbe o cede calore, e perché?` : `Durante ${name === 'brinamento' ? 'il brinamento' : `la ${name}`}, la sostanza assorbe o cede calore, e perché?`),
		solution: opt(right).latex,
		steps: [
			textBlock(`${fromFact ? `È ${article}, da ${FROM_TO[name][0]} a ${FROM_TO[name][1]}.` : `${cap(article)} va da ${FROM_TO[name][0]} a ${FROM_TO[name][1]}.`} ${ABSORBS[name] ? 'Le particelle devono allontanarsi vincendo le forze di attrazione, e per farlo serve energia: la sostanza assorbe calore.' : 'Le particelle si avvicinano e si legano di nuovo, e la sostanza restituisce all’ambiente il calore: lo cede.'}`),
		],
		choice: choose(
			rng,
			opt(right),
			ENERGY.filter((x) => x !== right).map((x) => opt(x)),
		),
		params: { case: ABSORBS[name] ? 'assorbe' : 'cede', name },
	};
}

// ---------------------------------------------------------------------------
// Level 3: which one is in that state

/** The lesson's table: melting and boiling points at 1 atm, °C. */
export const TABLE: Record<string, [number, number]> = {
	azoto: [-210, -196],
	ossigeno: [-218, -183],
	etanolo: [-114, 78],
	acetone: [-95, 56],
	mercurio: [-39, 357],
	acqua: [0, 100],
	naftalene: [80, 218],
	'cloruro di sodio': [801, 1465],
	ferro: [1538, 2862],
};
type State = 'solido' | 'liquido' | 'aeriforme';
export const stateOf = (x: string, T: number): State => (T < TABLE[x][0] ? 'solido' : T < TABLE[x][1] ? 'liquido' : 'aeriforme');
const far = (x: string, T: number) => TABLE[x].every((c) => Math.abs(c - T) >= 5);
const FEM: Record<State, string> = { solido: 'solida', liquido: 'liquida', aeriforme: 'aeriforme' };

function level3(rng: Rng): Built {
	const want: State = rng.pick(['solido', 'liquido', 'aeriforme']);
	for (;;) {
		const four = shuffle(rng, Object.keys(TABLE)).slice(0, 4);
		const T = rng.int(-25, 160) * 10;
		if (!four.every((x) => far(x, T))) continue;
		const hit = four.filter((x) => stateOf(x, T) === want);
		if (hit.length !== 1) continue;
		const right = hit[0];
		const table = four.map((x) => `${x} (fonde a ${deg(TABLE[x][0])}, bolle a ${deg(TABLE[x][1])})`).join('; ');
		const why = (x: string) => `${cap(x)}: ${stateOf(x, T)}.`;
		return {
			prompt: 'Scegli la sostanza.',
			problem: textBlock(`Alla pressione normale: ${table}. Quale di queste sostanze è ${FEM[want]} a ${deg(T)}?`),
			solution: opt(cap(right)).latex,
			steps: [
				textBlock(`Una sostanza è solida sotto la temperatura di fusione, liquida tra la temperatura di fusione e quella di ebollizione, aeriforme sopra la temperatura di ebollizione.`),
				textBlock(`A ${deg(T)}: ${four.map(why).join(' ')}`),
			],
			choice: choose(
				rng,
				opt(cap(right), right),
				four.filter((x) => x !== right).map((x) => opt(cap(x), x)),
			),
			params: { case: want, T },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: which changes happen between two temperatures

export const CHANGES: Record<string, string> = {
	nessuno: 'Nessun passaggio di stato',
	F: 'Solo la fusione',
	E: "Solo l'ebollizione",
	FE: "La fusione e poi l'ebollizione",
	S: 'Solo la solidificazione',
	C: 'Solo la condensazione',
	CS: 'La condensazione e poi la solidificazione',
};
const RANK: Record<State, number> = { solido: 0, liquido: 1, aeriforme: 2 };
/** The substance with its article: l'etanolo, il ferro, l'acqua. */
const withArt = (x: string) => (/^[aeiou]/.test(x) ? `l'${x}` : `il ${x}`);
/** A state agreeing with the substance (acqua is the only feminine one). */
const agree = (x: string, s: State) => (x === 'acqua' && s !== 'aeriforme' ? s.replace(/o$/, 'a') : s);

export function changes(x: string, T1: number, T2: number): string {
	const a = RANK[stateOf(x, T1)], b = RANK[stateOf(x, T2)];
	if (a === b) return 'nessuno';
	if (T2 > T1) return a === 0 ? (b === 1 ? 'F' : 'FE') : 'E';
	return a === 2 ? (b === 1 ? 'C' : 'CS') : 'S';
}

function level4(rng: Rng): Built {
	const want = rng.pick(Object.keys(CHANGES));
	for (;;) {
		const x = rng.pick(Object.keys(TABLE));
		const [tf, te] = TABLE[x];
		const lo = Math.floor((tf - 60) / 10), hi = Math.ceil((te + 60) / 10);
		const T1 = rng.int(lo, hi) * 10, T2 = rng.int(lo, hi) * 10;
		if (T1 === T2 || !far(x, T1) || !far(x, T2) || Math.abs(T1 - T2) < 20) continue;
		if (changes(x, T1, T2) !== want) continue;
		// "Nessuno" needs the direction too, so both heating and cooling appear.
		const heat = T2 > T1;
		const verb = heat ? 'scaldato' : 'raffreddato';
		const pairs: Record<string, string[]> = {
			F: ['S', 'FE', 'E'],
			E: ['C', 'FE', 'F'],
			FE: ['F', 'E', 'CS'],
			S: ['F', 'CS', 'C'],
			C: ['E', 'CS', 'S'],
			CS: ['FE', 'C', 'S'],
			nessuno: heat ? ['F', 'E', 'FE'] : ['S', 'C', 'CS'],
		};
		const o = (k: string) => opt(CHANGES[k], k);
		const s1 = stateOf(x, T1), s2 = stateOf(x, T2);
		return {
			prompt: 'Scegli i passaggi di stato.',
			problem: textBlock(`Un campione di ${x} viene ${verb} da ${deg(T1)} a ${deg(T2)}, alla pressione normale. ${cap(withArt(x))} fonde a ${deg(tf)} e bolle a ${deg(te)}. Quali passaggi di stato avvengono?`),
			solution: o(want).latex,
			steps: [textBlock(`A ${deg(T1)} ${withArt(x)} è ${agree(x, s1)}, a ${deg(T2)} è ${agree(x, s2)}.`), textBlock(want === 'nessuno' ? 'Lo stato è lo stesso: nessun passaggio di stato.' : `${CHANGES[want]}.`)],
			choice: choose(rng, o(want), [...pairs[want], ...shuffle(rng, Object.keys(CHANGES))].map(o)),
			params: { case: want, substance: x, T1, T2 },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: evaporation, boiling and pressure

const PLACES: [string, number][] = [
	['Sestriere', 2000],
	['Cervinia', 2000],
	['Livigno', 1800],
	['Plateau Rosa', 3500],
	['Punta Helbronner', 3460],
	['Capanna Margherita', 4550],
];

interface Situation {
	text: (rng: Rng) => string;
	right: string;
	wrong: string[];
	why: string;
}

const SITUATIONS: Situation[] = [
	{
		text: (r) => {
			const [p, h] = r.pick(PLACES);
			return `A ${p}, a circa ${h} m di quota, la pressione atmosferica è più bassa che al livello del mare. A quale temperatura bolle l'acqua?`;
		},
		right: 'Sotto i 100 °C',
		wrong: ['Sopra i 100 °C', 'A 100 °C, come al mare', 'Non bolle, evapora soltanto'],
		why: "Con una pressione esterna più bassa, le bolle di vapore si formano a una temperatura più bassa: l'acqua bolle sotto i 100 °C.",
	},
	{
		text: () => "Nella pentola a pressione il vapore resta chiuso dentro e la pressione sale fino a circa il doppio di quella atmosferica. A quale temperatura bolle l'acqua?",
		right: 'Sopra i 100 °C',
		wrong: ['Sotto i 100 °C', 'A 100 °C, come in una pentola aperta', 'Non bolle più'],
		why: "Con una pressione esterna più alta, le bolle di vapore si formano solo a una temperatura più alta: intorno a 120 °C.",
	},
	{
		text: (r) => `D'estate, a ${r.pick([25, 28, 30, 32])} gradi, una pozzanghera si asciuga in poche ore. Che cosa succede all'acqua?`,
		right: 'Evapora dalla superficie',
		wrong: ['Bolle in tutto il liquido', 'Sublima', 'Condensa nel terreno'],
		why: "L'acqua è lontana da 100 °C e non bolle: le particelle più veloci sfuggono dalla superficie, cioè l'acqua evapora.",
	},
	{
		text: () => "L'acqua di una pentola sul fuoco bolle a 100 °C. Che cosa la distingue dall'acqua che evapora da un bicchiere?",
		right: 'Si formano bolle in tutto il liquido',
		wrong: ['Vaporizza solo dalla superficie', 'Assorbe calore, il bicchiere no', 'Diventa un gas diverso dal vapore'],
		why: "L'ebollizione avviene in tutto il liquido, con bolle di vapore anche sul fondo; l'evaporazione solo dalla superficie. Tutte e due assorbono calore.",
	},
	{
		text: () => "L'acqua della pasta bolle a 100 °C, al livello del mare, e si alza la fiamma al massimo. Che cosa fa la temperatura dell'acqua?",
		right: 'Resta a 100 °C',
		wrong: ['Sale sopra i 100 °C', 'Scende sotto i 100 °C', 'Sale finché l’acqua non finisce'],
		why: "Durante l'ebollizione la temperatura resta costante: il calore in più fa solo evaporare l'acqua più in fretta.",
	},
	{
		text: () => 'Uscendo dalla piscina si ha freddo, anche se l’aria è calda. Perché?',
		right: "L'acqua evapora e prende calore dalla pelle",
		wrong: ["L'acqua condensa e prende calore dalla pelle", "L'acqua evapora e cede calore alla pelle", "L'acqua bolle sulla pelle"],
		why: "L'evaporazione assorbe calore, e lo prende dal corpo su cui si trova l'acqua: la pelle si raffredda.",
	},
	{
		text: (r) => {
			const [p] = r.pick(PLACES);
			return `Si mette a bollire la stessa pentola d'acqua a Napoli, al livello del mare, e a ${p}, in montagna. Dove l'acqua bolle a una temperatura più alta?`;
		},
		right: 'A Napoli',
		wrong: ['In montagna', 'Alla stessa temperatura', 'Dipende da quanta acqua c’è'],
		why: "Al livello del mare la pressione atmosferica è più alta, e l'acqua bolle a una temperatura più alta, 100 °C.",
	},
	{
		text: () => 'Il vapore a 100 °C che condensa sulla mano scotta più dell’acqua a 100 °C. Perché?',
		right: 'Condensando cede altro calore alla pelle',
		wrong: ['Il vapore è più caldo di 100 °C', "Condensando assorbe calore dalla pelle", "L'acqua bollente non cede calore"],
		why: "Il vapore che condensa cede il calore che aveva assorbito per vaporizzare, e poi si raffredda come l'acqua: cede molto più calore.",
	},
];

function level5(rng: Rng): Built {
	const i = rng.int(0, SITUATIONS.length - 1);
	const S = SITUATIONS[i];
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(S.text(rng)),
		solution: opt(S.right).latex,
		steps: [textBlock(S.why)],
		choice: choose(
			rng,
			opt(S.right),
			shuffle(rng, S.wrong).map((x) => opt(x)),
		),
		params: { case: `s${i}` },
	};
}

// ---------------------------------------------------------------------------

export default makeGenerator(
	ID,
	'I passaggi di stato',
	{
		1: { label: 'Il nome del passaggio', constraints: ['metà dai due stati, metà da un fatto di tutti i giorni'] },
		2: { label: 'Assorbire o cedere calore', constraints: ['il passaggio o un fatto; assorbe o cede, con il perché delle particelle'] },
		3: { label: 'Lo stato a una temperatura', constraints: ['quattro sostanze della tabella, una sola nello stato chiesto, a 5 °C o più dai passaggi'] },
		4: { label: 'Da una temperatura a un’altra', constraints: ['i passaggi tra due temperature, a 5 °C o più dai passaggi, i sette casi alla pari'] },
		5: { label: 'Evaporazione, ebollizione e pressione', constraints: ['otto situazioni della lezione'] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 },
);

