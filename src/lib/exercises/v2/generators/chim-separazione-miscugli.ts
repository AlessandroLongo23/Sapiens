/**
 * Metodi di separazione dei miscugli. Spec: specs/exercises/chim-separazione-miscugli.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/18-chim-separazione-miscugli.md), all multiple choice:
 * the method for a mixture; the property a method uses (and back); what the thermometer of a distillation reads and
 * what is collected; the retention factor of a paper chromatogram (drawn with the `cromatogramma` scene), or the dye
 * it identifies; the order of the steps that separate a mixture of three components.
 */
import type { ChoiceOption, Rng } from '../types';
import { type Built, cap, choose, dec, deg, makeGenerator, opt, optLines, shuffle, textBlock } from '../chim-materia2';

export const ID = 'chim-separazione-miscugli';

// ---------------------------------------------------------------------------
// Level 1: the method for a mixture

export const METHODS = ['filtrazione', 'decantazione', 'centrifugazione', 'imbuto separatore', 'evaporazione', 'cristallizzazione', 'distillazione', 'estrazione con solvente', 'cromatografia', 'separazione magnetica'] as const;
type Method = (typeof METHODS)[number];

/** A situation, the method the lesson gives for it, and the other methods that would also work (never distractors). */
interface Case {
	text: (rng: Rng) => string;
	right: Method;
	also: Method[];
}

const CASES: Case[] = [
	{ text: (r) => `In un secchio ci sono ${r.pick([2, 3, 5])} litri d'acqua con della sabbia che non si scioglie. Si vuole ottenere acqua senza sabbia, in fretta e del tutto.`, right: 'filtrazione', also: ['decantazione', 'centrifugazione'] },
	{ text: () => "In una bottiglia l'olio forma uno strato sopra l'acqua. Si vogliono separare i due liquidi.", right: 'imbuto separatore', also: ['decantazione'] },
	{ text: (r) => `Si hanno ${r.pick([100, 200, 250, 500])} mL di acqua salata e si vuole recuperare il sale, senza bisogno dell'acqua.`, right: 'evaporazione', also: ['cristallizzazione', 'distillazione'] },
	{ text: () => "Su una nave si vuole ottenere acqua da bere dall'acqua di mare.", right: 'distillazione', also: [] },
	{ text: () => "Si vuole separare l'alcol dall'acqua in cui è mescolato, come si fa nelle distillerie con il vino.", right: 'distillazione', also: [] },
	{ text: (r) => `Si vuole sapere quanti coloranti ci sono nell'inchiostro di un pennarello ${r.pick(['nero', 'verde', 'marrone', 'viola'])}.`, right: 'cromatografia', also: [] },
	{ text: () => 'Si vuole separare la limatura di ferro dallo zolfo in polvere con cui è mescolata.', right: 'separazione magnetica', also: [] },
	{ text: () => 'In un laboratorio di analisi si vogliono separare in pochi minuti le cellule del sangue dal plasma.', right: 'centrifugazione', also: [] },
	{ text: () => "Lo iodio sciolto in acqua si scioglie molto meglio nel cicloesano, che con l'acqua non si mescola. Si vuole portare lo iodio fuori dall'acqua.", right: 'estrazione con solvente', also: [] },
	{ text: () => 'Da una soluzione calda e satura di solfato di rame si vogliono ottenere cristalli grandi e puri, lasciandola raffreddare piano.', right: 'cristallizzazione', also: [] },
	{ text: () => "Si vogliono togliere i fondi dal caffè preparato alla turca, dove la polvere resta nell'acqua.", right: 'filtrazione', also: ['decantazione', 'centrifugazione'] },
	{ text: () => "Si vuole separare l'acetone dall'acqua con cui è mescolato.", right: 'distillazione', also: [] },
	{ text: () => 'Si vuole capire se la firma su un documento è stata fatta con la stessa penna del resto del testo.', right: 'cromatografia', also: [] },
	{ text: () => "L'acqua di un fiume è torbida di fango. Si vuole ottenere acqua limpida, del tutto e in fretta.", right: 'filtrazione', also: ['decantazione', 'centrifugazione'] },
	{ text: () => "In un impianto di riciclo si vogliono separare le lattine d'acciaio da quelle d'alluminio.", right: 'separazione magnetica', also: [] },
	{ text: () => 'In una latteria si vuole separare in fretta la panna dal latte.', right: 'centrifugazione', also: ['decantazione'] },
	{ text: () => 'In una raffineria si vuole dividere il petrolio in gas, benzine, cherosene e gasolio.', right: 'distillazione', also: [] },
	{ text: () => 'Si vuole togliere la caffeina dai chicchi di caffè sciogliendola in un liquido che non scioglie il resto.', right: 'estrazione con solvente', also: [] },
	{ text: () => "Un po' di benzina è finita sopra l'acqua di un recipiente e ci galleggia. Si vogliono separare i due liquidi.", right: 'imbuto separatore', also: ['decantazione'] },
	{ text: () => "Nelle saline si vuole ottenere il sale dall'acqua di mare con il calore del sole.", right: 'evaporazione', also: ['cristallizzazione'] },
	{ text: () => 'Si vuole scoprire se un succo di frutta contiene un colorante vietato, confrontandolo con un campione del colorante.', right: 'cromatografia', also: [] },
	{ text: () => 'Si vuole recuperare il solvente di una vernice, che bolle a temperatura più bassa del resto.', right: 'distillazione', also: [] },
];

function level1(rng: Rng): Built {
	const i = rng.int(0, CASES.length - 1);
	const C = CASES[i];
	const others = shuffle(
		rng,
		METHODS.filter((m) => m !== C.right && !C.also.includes(m)),
	);
	return {
		prompt: 'Scegli il metodo di separazione.',
		problem: textBlock(`${C.text(rng)} Quale metodo conviene usare?`),
		solution: opt(cap(C.right)).latex,
		steps: [textBlock(`${cap(C.right)}: ${WHY[C.right]}`)],
		choice: choose(rng, opt(cap(C.right), C.right), others.map((m) => opt(cap(m), m))),
		params: { case: `c${i}`, method: C.right },
	};
}

const WHY: Record<Method, string> = {
	filtrazione: 'il filtro ferma il solido che non si è sciolto e lascia passare il liquido.',
	decantazione: 'il solido più denso si deposita sul fondo e il liquido si versa via.',
	centrifugazione: 'la rotazione veloce spinge sul fondo le particelle più dense in pochi minuti.',
	'imbuto separatore': 'i due liquidi non si mescolano, e quello più denso esce per primo dal rubinetto.',
	evaporazione: 'il liquido evapora e il solido disciolto resta nel recipiente.',
	cristallizzazione: 'raffreddando piano la soluzione satura, il solido si separa in cristalli puri.',
	distillazione: 'i componenti bollono a temperature diverse, e il vapore di quello più volatile condensa nel refrigerante.',
	'estrazione con solvente': 'la sostanza passa nel solvente in cui si scioglie meglio.',
	cromatografia: 'le sostanze disciolte, trascinate dal solvente sulla carta, salgono a altezze diverse.',
	'separazione magnetica': 'la calamita attira il ferro e lascia gli altri componenti.',
};

// ---------------------------------------------------------------------------
// Level 2: the property a method uses, and back

export const PROPERTY: Record<Method, string> = {
	filtrazione: 'la dimensione delle particelle',
	decantazione: 'la densità',
	centrifugazione: 'la densità',
	'imbuto separatore': 'la densità',
	evaporazione: 'il liquido evapora, il solido no',
	cristallizzazione: 'il liquido evapora, il solido no',
	distillazione: 'la temperatura di ebollizione',
	'estrazione con solvente': 'la solubilità in un altro solvente',
	cromatografia: 'quanto è trattenuta dalla carta',
	'separazione magnetica': 'le proprietà magnetiche',
};
const PROPS = [...new Set(Object.values(PROPERTY))];

/** Situations described by the property, and the one method that answers them. */
const BY_PROPERTY: { text: string; right: Method; also: Method[] }[] = [
	{ text: 'Due liquidi che si mescolano bollono a temperature diverse.', right: 'distillazione', also: [] },
	{ text: "Un solido che non si scioglie ha granelli più grandi dei pori di un foglio di carta, e l'acqua passa.", right: 'filtrazione', also: ['decantazione', 'centrifugazione'] },
	{ text: "Una sostanza sciolta in acqua si scioglie molto meglio in un altro liquido, che con l'acqua non si mescola.", right: 'estrazione con solvente', also: [] },
	{ text: "Uno dei due solidi mescolati è attirato da una calamita, l'altro no.", right: 'separazione magnetica', also: [] },
	{ text: 'Delle sostanze disciolte vengono trattenute dalla carta in modo diverso quando un solvente le trascina.', right: 'cromatografia', also: [] },
	{ text: 'Due liquidi non si mescolano e hanno densità diverse.', right: 'imbuto separatore', also: ['decantazione', 'centrifugazione'] },
	{ text: 'Particelle finissime, poco più dense del liquido, ci metterebbero giorni a depositarsi.', right: 'centrifugazione', also: [] },
	{ text: "Un solido è sciolto in acqua, e si vuole recuperare il solido: l'acqua evapora, il solido no.", right: 'evaporazione', also: ['cristallizzazione', 'distillazione'] },
];

function level2(rng: Rng): Built {
	if (rng.int(0, 1) === 0) {
		const m = rng.pick(METHODS);
		const right = PROPERTY[m];
		const others = shuffle(
			rng,
			PROPS.filter((p) => p !== right),
		);
		return {
			prompt: 'Scegli la proprietà che il metodo sfrutta.',
			problem: textBlock(`Quale proprietà dei componenti di un miscuglio sfrutta ${/^[aeiou]/.test(m) ? `l'${m}` : `la ${m}`}?`),
			solution: opt(cap(right)).latex,
			steps: [textBlock(`${cap(m)}: ${WHY[m]}`)],
			choice: choose(rng, opt(cap(right), right), others.map((p) => opt(cap(p), p))),
			params: { case: 'proprieta', method: m },
		};
	}
	const i = rng.int(0, BY_PROPERTY.length - 1);
	const C = BY_PROPERTY[i];
	const others = shuffle(
		rng,
		METHODS.filter((m) => m !== C.right && !C.also.includes(m)),
	);
	return {
		prompt: 'Scegli il metodo di separazione.',
		problem: textBlock(`${C.text} Quale metodo li separa?`),
		solution: opt(cap(C.right)).latex,
		steps: [textBlock(`${cap(C.right)}: ${WHY[C.right]}`)],
		choice: choose(rng, opt(cap(C.right), C.right), others.map((m) => opt(cap(m), m))),
		params: { case: 'metodo', situation: i, method: C.right },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the temperature at the head of the column

/** Liquids that mix with each other, and their boiling points at 1 atm (°C), as the lessons give them. */
export const LIQUIDS: Record<string, number> = { acetone: 56, metanolo: 65, etanolo: 78, acqua: 100, 'acido acetico': 118, 'glicole etilenico': 197 };
const the = (x: string) => (/^[aeiou]/.test(x) ? `l'${x}` : `il ${x}`);
const ofThe = (x: string) => (/^[aeiou]/.test(x) ? `dell'${x}` : `del ${x}`);
/** "a e b", with "ed" before a word that starts with e. */
export const and = (a: string, b: string) => `${a} ${/^e/.test(b) ? 'ed' : 'e'} ${b}`;

function level3(rng: Rng): Built {
	const names = Object.keys(LIQUIDS);
	if (rng.int(0, 1) === 0) {
		// Two liquids at least 20 °C apart: which comes first, at which temperature.
		let a = '', b = '';
		do {
			[a, b] = shuffle(rng, names).slice(0, 2);
		} while (Math.abs(LIQUIDS[a] - LIQUIDS[b]) < 20);
		const [lo, hi] = LIQUIDS[a] < LIQUIDS[b] ? [a, b] : [b, a];
		const o = (x: string, T: number): ChoiceOption => ({ latex: `\\text{${cap(x)}, a }${T}\\,^\\circ\\text{C}`, values: [`${x}@${T}`] });
		return {
			prompt: 'Leggi la distillazione.',
			problem: textBlock(`Si distilla un miscuglio di ${and(a, b)}. ${cap(the(a))} bolle a ${deg(LIQUIDS[a])}, ${the(b)} a ${deg(LIQUIDS[b])}. Che cosa si raccoglie nella prima frazione, e che temperatura segna il termometro in testa alla colonna mentre la si raccoglie?`),
			solution: o(lo, LIQUIDS[lo]).latex,
			steps: [
				textBlock(`Bolle per primo il liquido con la temperatura di ebollizione più bassa, ${the(lo)}.`),
				textBlock(`Mentre distilla, il vapore che arriva al termometro è di ${lo}, e il termometro segna ${deg(LIQUIDS[lo])}.`),
			],
			choice: choose(rng, o(lo, LIQUIDS[lo]), [o(hi, LIQUIDS[hi]), o(lo, LIQUIDS[hi]), o(hi, LIQUIDS[lo])]),
			params: { case: 'due', liquids: [a, b] },
		};
	}
	// Three liquids 20 °C apart or more: after the first plateau the thermometer reads the second or third.
	let trio: string[] = [];
	for (let tries = 0; tries < 1000; tries++) {
		trio = shuffle(rng, names).slice(0, 3);
		const s = trio.map((x) => LIQUIDS[x]).sort((p, q) => p - q);
		if (s[1] - s[0] >= 20 && s[2] - s[1] >= 20) break;
	}
	const sorted = [...trio].sort((p, q) => LIQUIDS[p] - LIQUIDS[q]);
	const k = rng.int(1, 2);
	const now = sorted[k];
	const before = sorted[k - 1];
	const list = `${trio[0]}, ${and(trio[1], trio[2])}`;
	const temps = trio.map((x) => `${x} ${deg(LIQUIDS[x])}`).join(', ');
	const others = [...trio.filter((x) => x !== now).map((x) => opt(cap(x), x)), opt('Tutti e tre insieme', 'tutti')];
	return {
		prompt: 'Leggi la distillazione.',
		problem: textBlock(`Si distilla un miscuglio di ${list}. Temperature di ebollizione: ${temps}. Il termometro in testa alla colonna, dopo una sosta a ${deg(LIQUIDS[before])}, è salito e ora resta fermo a ${deg(LIQUIDS[now])}. Che cosa si sta raccogliendo?`),
		solution: opt(cap(now)).latex,
		steps: [textBlock(`Il termometro segna la temperatura di ebollizione del liquido che sta distillando: ${deg(LIQUIDS[now])} è quella ${ofThe(now)}. La prima sosta, a ${deg(LIQUIDS[before])}, era la distillazione ${ofThe(before)}.`)],
		choice: choose(rng, opt(cap(now), now), others),
		params: { case: 'tre', liquids: trio, reading: LIQUIDS[now] },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the retention factor

const DYES = ['rosso', 'blu', 'giallo', 'verde', 'viola', 'arancione'];

/** Round an integer ratio num/den to hundredths, half up: returns hundredths. */
const hundredths = (num: number, den: number) => Math.floor((200 * num + den) / (2 * den));

function level4(rng: Rng): Built {
	// front f and spot d in tenths of a centimetre, with d/f an exact number of hundredths.
	let f = 0, d = 0, rf = 0;
	do {
		f = rng.int(40, 100);
		rf = rng.int(10, 90);
		d = (f * rf) / 100;
	} while (!Number.isInteger(d) || d < 5 || f - d < 5);
	const base = rng.int(10, 20); // start line above the lower edge, tenths
	const letter = rng.pick(['A', 'B', 'C']);
	const scene = {
		type: 'cromatogramma',
		data: { partenza: base / 10, fronte: f / 10, macchie: [{ nome: letter, d: d / 10 }], quote: [letter], quotaBordo: true },
		alt: `Una striscia di carta: la linea di partenza è a ${dec(base, 1).replace('{,}', ',')} centimetri dal bordo inferiore, il fronte del solvente a ${dec(f, 1).replace('{,}', ',')} centimetri dalla linea di partenza, la macchia ${letter} a ${dec(d, 1).replace('{,}', ',')} centimetri dalla linea di partenza.`,
	};
	const cm = (n: number) => `$${dec(n, 1)}\\,\\text{cm}$`;
	const rfOpt = (h: number): ChoiceOption => ({ latex: dec(h, 2), values: [String(h)] });
	if (rng.int(0, 1) === 0) {
		const wrong = [100 - rf, hundredths(d + base, f + base), hundredths(f, d), hundredths(d, f + base)].filter((h) => h !== rf && h > 0);
		return {
			prompt: 'Calcola il fattore di ritenzione.',
			problem: textBlock(`Nel cromatogramma la linea di partenza è a ${cm(base)} dal bordo inferiore della carta. Il solvente ha percorso ${cm(f)} dalla linea di partenza, la macchia ${letter} ${cm(d)}. Quanto vale il fattore di ritenzione della macchia ${letter}?`),
			solution: `R_f = ${dec(rf, 2)}`,
			steps: [`R_f = \\dfrac{${dec(d, 1)}\\,\\text{cm}}{${dec(f, 1)}\\,\\text{cm}} = ${dec(rf, 2)}`, textBlock('Tutte e due le distanze si misurano dalla linea di partenza, non dal bordo della carta.')],
			choice: choose(rng, rfOpt(rf), wrong.map(rfOpt)),
			params: { case: 'calcolo' },
			scene,
		};
	}
	// Which known dye: three references in the same conditions, the spot matches one or none.
	const refs: { name: string; rf: number }[] = [];
	const names = shuffle(rng, DYES).slice(0, 3);
	const used = new Set<number>();
	const match = rng.int(0, 3); // 3: none
	for (let i = 0; i < 3; i++) {
		let r = 0;
		do r = rng.int(2, 18) * 5;
		while ([...used].some((u) => Math.abs(u - r) < 10));
		used.add(r);
		refs.push({ name: names[i], rf: r });
	}
	if (match < 3) {
		rf = refs[match].rf;
	} else {
		do rf = rng.int(10, 90);
		while (refs.some((x) => Math.abs(x.rf - rf) < 8));
	}
	do {
		f = rng.int(40, 100);
		d = (f * rf) / 100;
	} while (!Number.isInteger(d) || d < 5 || f - d < 5);
	const right = match < 3 ? refs[match].name : 'nessuno';
	const table = refs.map((x) => `${x.name} ${dec(x.rf, 2)}`).join(', ');
	const o = (x: string) => opt(x === 'nessuno' ? 'Nessuno dei tre' : `Il colorante ${x}`, x);
	return {
		prompt: 'Riconosci il colorante dal fattore di ritenzione.',
		problem: textBlock(`Con la stessa carta e lo stesso solvente, tre coloranti noti hanno questi valori di $R_f$: ${table}. In un campione sconosciuto la macchia ${letter} percorre ${cm(d)} mentre il solvente percorre ${cm(f)}, tutti e due dalla linea di partenza. Quale colorante è la macchia ${letter}?`),
		solution: o(right).latex,
		steps: [`R_f = \\dfrac{${dec(d, 1)}\\,\\text{cm}}{${dec(f, 1)}\\,\\text{cm}} = ${dec(rf, 2)}`, textBlock(match < 3 ? `È il valore del colorante ${right}.` : 'Non è il valore di nessuno dei tre coloranti noti.')],
		choice: choose(rng, o(right), [...refs.map((x) => x.name), 'nessuno'].filter((x) => x !== right).map(o)),
		params: { case: match < 3 ? 'uguale' : 'nessuno' },
		scene: { ...scene, data: { ...scene.data, fronte: f / 10, macchie: [{ nome: letter, d: d / 10 }], quotaBordo: false }, alt: `Una striscia di carta: il fronte del solvente è a ${dec(f, 1).replace('{,}', ',')} centimetri dalla linea di partenza, la macchia ${letter} a ${dec(d, 1).replace('{,}', ',')} centimetri.` },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the steps, in order

interface Plan {
	mixture: string;
	goal: string;
	right: string[];
	wrong: string[][];
}

const PLANS: Plan[] = [
	{ mixture: 'sabbia, sale e acqua (il sale è sciolto)', goal: 'la sabbia e il sale', right: ['filtrazione', 'evaporazione'], wrong: [['evaporazione', 'filtrazione'], ['filtrazione', 'imbuto separatore'], ['separazione magnetica', 'evaporazione'], ['imbuto separatore', 'filtrazione']] },
	{ mixture: 'sabbia, sale e acqua (il sale è sciolto)', goal: "la sabbia, il sale e l'acqua", right: ['filtrazione', 'distillazione'], wrong: [['filtrazione', 'evaporazione'], ['evaporazione', 'filtrazione'], ['filtrazione', 'imbuto separatore'], ['separazione magnetica', 'distillazione']] },
	{ mixture: 'limatura di ferro, sabbia e sale, tutti asciutti', goal: 'il ferro, la sabbia e il sale', right: ['separazione magnetica', "aggiunta d'acqua", 'filtrazione', 'evaporazione'], wrong: [['separazione magnetica', 'filtrazione', "aggiunta d'acqua", 'evaporazione'], ['separazione magnetica', "aggiunta d'acqua", 'evaporazione', 'filtrazione'], ["aggiunta d'acqua", 'evaporazione', 'filtrazione', 'separazione magnetica'], ['filtrazione', 'separazione magnetica', "aggiunta d'acqua", 'evaporazione']] },
	{ mixture: 'limatura di ferro, zolfo e sale, tutti asciutti', goal: 'il ferro, lo zolfo e il sale', right: ['separazione magnetica', "aggiunta d'acqua", 'filtrazione', 'evaporazione'], wrong: [['separazione magnetica', 'filtrazione', "aggiunta d'acqua", 'evaporazione'], ['separazione magnetica', "aggiunta d'acqua", 'evaporazione', 'filtrazione'], ["aggiunta d'acqua", 'evaporazione', 'filtrazione', 'separazione magnetica'], ['filtrazione', 'separazione magnetica', "aggiunta d'acqua", 'evaporazione']] },
	{ mixture: "olio, acqua e sale sciolto nell'acqua", goal: "l'olio e il sale", right: ['imbuto separatore', 'evaporazione'], wrong: [['evaporazione', 'imbuto separatore'], ['filtrazione', 'evaporazione'], ['imbuto separatore', 'filtrazione'], ['separazione magnetica', 'evaporazione']] },
	{ mixture: "olio, acqua e sale sciolto nell'acqua", goal: "l'olio, l'acqua e il sale", right: ['imbuto separatore', 'distillazione'], wrong: [['imbuto separatore', 'evaporazione'], ['evaporazione', 'imbuto separatore'], ['filtrazione', 'distillazione'], ['imbuto separatore', 'filtrazione']] },
	{ mixture: 'sabbia, acqua e alcol', goal: "la sabbia, l'acqua e l'alcol", right: ['filtrazione', 'distillazione'], wrong: [['filtrazione', 'evaporazione'], ['filtrazione', 'imbuto separatore'], ['evaporazione', 'filtrazione'], ['separazione magnetica', 'distillazione']] },
	{ mixture: 'sabbia, olio e acqua', goal: "la sabbia, l'olio e l'acqua", right: ['filtrazione', 'imbuto separatore'], wrong: [['evaporazione', 'imbuto separatore'], ['filtrazione', 'evaporazione'], ['separazione magnetica', 'imbuto separatore'], ['imbuto separatore', 'separazione magnetica']] },
];

function level5(rng: Rng): Built {
	const i = rng.int(0, PLANS.length - 1);
	const P = PLANS[i];
	const key = (xs: string[]) => xs.join('>');
	const lines = (xs: string[]) => optLines(xs, key(xs));
	const wrong = shuffle(rng, P.wrong);
	return {
		prompt: 'Scegli i passi nell’ordine giusto.',
		problem: textBlock(`Un miscuglio contiene ${P.mixture}. Si vogliono ottenere separati ${P.goal}. In che ordine si fanno i passi?`),
		solution: lines(P.right).latex,
		steps: P.right.map((s, k) => textBlock(`${k + 1}. ${cap(s)}: ${STEP_WHY[s]}`)),
		choice: choose(rng, lines(P.right), wrong.map(lines)),
		params: { case: `p${i}` },
	};
}

const STEP_WHY: Record<string, string> = {
	'separazione magnetica': 'la calamita toglie il ferro.',
	"aggiunta d'acqua": "il sale si scioglie nell'acqua, gli altri solidi no.",
	filtrazione: 'il solido che non si scioglie resta sulla carta, il liquido passa.',
	evaporazione: "l'acqua evapora e il sale resta nella capsula.",
	distillazione: 'i liquidi distillano uno alla volta e il solido resta nel pallone.',
	'imbuto separatore': "l'olio, meno denso, resta sopra; l'acqua esce dal rubinetto.",
};

// ---------------------------------------------------------------------------

export default makeGenerator(
	ID,
	'Metodi di separazione dei miscugli',
	{
		1: { label: 'Il metodo giusto', constraints: ['una situazione, il metodo della lezione; i distrattori non funzionerebbero'] },
		2: { label: 'La proprietà sfruttata', constraints: ['metà: il metodo e la sua proprietà; metà: la proprietà e il metodo'] },
		3: { label: 'La distillazione', constraints: ['metà: due liquidi a 20 °C o più di distanza; metà: tre liquidi, la temperatura che si legge'] },
		4: { label: 'Il fattore di ritenzione', constraints: ['metà: R_f esatto ai centesimi; metà: riconoscere il colorante dai valori noti'] },
		5: { label: 'Separare in più passi', constraints: ['tre componenti, i passi nell’ordine giusto'] },
	},
	{ 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 },
);
