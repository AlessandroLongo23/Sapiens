/**
 * Errori casuali ed errori sistematici. Spec: specs/exercises/fis-errori-misura.md
 *
 * Five levels in the order of the lesson (docs/lezioni/fisica/riscritte/05-fis-errori-misura.md), all multiple
 * choice: the kind of error in a measuring situation (casuale, sistematico, sbaglio); the reading of an instrument
 * that is not zero when empty, corrected (L - z, with the sign of z); precision and accuracy of the shots on a
 * target (a `bersaglio` scene); the same on three series of four numbers against a reference; the remedy for a
 * situation (the mean, calibrating, discarding, a more sensitive instrument).
 *
 * Numbers are integers in tenths or hundredths, written with a decimal comma {,} and the unit after a thin space
 * (182{,}2\,\text{g}, -0{,}5\,{}^\circ\text{C}). Every situation names a student and draws its numbers; the
 * checker reads the story back from the text.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { q } from '../rational';

export const ID = 'fis-errori-misura';

const BANNED = /—|piuttosto che/;
const t = (s: string) => `\\text{${s}}`;

/** Prose with inline $…$ formulas as one LaTeX line: \text{…} around the prose, the formulas as they are. */
function tx(prose: string): string {
	return prose
		.split(/(\$[^$]*\$)/)
		.filter(Boolean)
		.map((p) => (p.startsWith('$') ? p.slice(1, -1) : t(p)))
		.join('');
}

/** Prose split into its sentences, one step each, so a step reads on one line. */
const sentences = (prose: string): string[] => prose.split(/(?<=\.) (?=[A-ZÈ])/).map(tx);

/** An integer count of 10^-d written with d decimals: fx(1822, 1) = 182{,}2, fx(-3, 1) = -0{,}3. */
function fx(n: number, d: number): string {
	const neg = n < 0;
	const s = String(Math.abs(n)).padStart(d + 1, '0');
	const int = s.slice(0, s.length - d);
	const frac = s.slice(s.length - d);
	return (neg ? '-' : '') + (d ? `${int}{,}${frac}` : int);
}

const UNIT: Record<string, string> = {
	g: '\\text{g}',
	N: '\\text{N}',
	C: '{}^\\circ\\text{C}',
	cm: '\\text{cm}',
	mm: '\\text{mm}',
	s: '\\text{s}',
};
/** A value with its unit: 182{,}2\,\text{g}. */
const wu = (n: number, d: number, u: string) => `${fx(n, d)}\\,${UNIT[u]}`;
/** The same in prose, between dollars. */
const pw = (n: number, d: number, u: string) => `$${wu(n, d, u)}$`;
/** A list of values in prose, the unit on the last: $3{,}8$, $3{,}7$ e $3{,}9\,\text{cm}$. */
function plist(xs: number[], d: number, u: string): string {
	const w = xs.map((x, i) => (i === xs.length - 1 ? pw(x, d, u) : `$${fx(x, d)}$`));
	return `${w.slice(0, -1).join(', ')} e ${w[w.length - 1]}`;
}

const NAMES = ['Giulia', 'Marco', 'Sara', 'Luca', 'Anna', 'Matteo', 'Elena', 'Davide', 'Chiara', 'Tommaso', 'Irene', 'Pietro'];
const ORD = ['prima', 'seconda', 'terza', 'quarta', 'quinta'];

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	choice: ChoiceAnswer;
	params: Record<string, unknown>;
	scene?: Sample['scene'];
}

/** Fixed options in a shuffled order; `right` is the value of the right one. */
function fixedChoice(rng: Rng, opts: ChoiceOption[], right: string): ChoiceAnswer {
	const order = shuffle(rng, opts);
	return { kind: 'choice', options: order, correct: order.findIndex((o) => o.values[0] === right) };
}

// ---------------------------------------------------------------------------
// Level 1: casuale, sistematico or sbaglio

export const KIND1 = { casuale: 'errore casuale', sistematico: 'errore sistematico', sbaglio: 'sbaglio (errore grossolano)' } as const;
type Kind1 = keyof typeof KIND1;
const Q1 = "Che tipo di errore c'è nelle sue misure?";

function level1(rng: Rng): Built {
	const kind = rng.pick(['casuale', 'sistematico', 'sbaglio'] as const);
	const N = rng.pick(NAMES);
	const X = rng.int(4, 8);
	let text: string;
	let why: string;
	let sub: number;
	if (kind === 'sistematico') {
		sub = rng.int(0, 6);
		switch (sub) {
			case 0: {
				const z = rng.int(2, 9);
				const obj = rng.pick(['tre monete', 'alcune mele', 'un astuccio', 'quattro sassi', 'una tazza']);
				text = `Una bilancia, a piatto vuoto, segna ${pw(z, 1, 'g')}. ${N} la usa per pesare ${obj}.`;
				why = `La bilancia aggiunge ${pw(z, 1, 'g')} a ogni pesata: l'errore è sempre nello stesso verso, quindi è sistematico.`;
				break;
			}
			case 1: {
				const x = rng.pick([5, 10, 15, 20]);
				const dir = rng.pick(['avanti', 'indietro']);
				const task = rng.pick(['i tempi di corsa dei compagni', 'il periodo di un pendolo', 'la caduta di una pallina', 'la durata di una candela accesa']);
				text = `Il cronometro di ${N} va ${dir} di ${pw(x, 1, 's')} ogni $100\\,\\text{s}$. ${N} lo usa per misurare ${task}.`;
				why = `Il cronometro ${dir === 'avanti' ? 'allunga' : 'accorcia'} tutti i tempi della stessa frazione: l'errore è sempre nello stesso verso, quindi è sistematico.`;
				break;
			}
			case 2: {
				const obj = rng.pick(['la lunghezza di una matita', 'la larghezza di un quaderno', 'il lato di una piastrella', 'la lunghezza di una penna']);
				text = `${N} misura ${obj} con un righello che ha il bordo consumato, facendo partire ogni misura dal bordo.`;
				why = "Il bordo non è sullo zero della scala: ogni misura parte dallo stesso punto sbagliato, quindi l'errore è sempre nello stesso verso ed è sistematico.";
				break;
			}
			case 3: {
				const [side, eye] = rng.pick([
					['dal basso', 'sotto'],
					["dall'alto", 'sopra'],
				]);
				const what = rng.pick(["la temperatura dell'acqua che si scalda", 'la temperatura della stanza ogni ora', "la temperatura dell'acqua di un acquario"]);
				text = `${N} legge il termometro sempre ${side}, con l'occhio ${eye} il livello del liquido, per misurare ${what}.`;
				why = "È un errore di parallasse sempre dallo stesso lato: sposta tutte le letture nello stesso verso, quindi è sistematico.";
				break;
			}
			case 4: {
				const T = rng.int(32, 40);
				const obj = rng.pick(['la lunghezza di un campo da pallavolo', 'la larghezza del cortile', 'la lunghezza di una panchina']);
				text = `${N} misura ${obj} con un metro a nastro d'acciaio tarato a $20\\,${UNIT.C}$, in un cortile al sole a $${T}\\,${UNIT.C}$.`;
				why = "Al sole il nastro si allunga: tutte le misure vengono un po' più corte del vero, sempre nello stesso verso. È un errore sistematico.";
				break;
			}
			case 5: {
				const z = rng.int(1, 5);
				const obj = rng.pick(['un sacchetto di sabbia', 'una borraccia', 'un astuccio', 'un mazzo di chiavi']);
				text = `Un dinamometro, senza niente appeso, segna ${pw(z, 1, 'N')}. ${N} lo usa per misurare il peso di ${obj}.`;
				why = `Il dinamometro aggiunge ${pw(z, 1, 'N')} a ogni misura: l'errore è sempre nello stesso verso, quindi è sistematico.`;
				break;
			}
			default: {
				const task = rng.pick(['il tempo di caduta di una pallina da un tavolo', 'il tempo di discesa di una pallina lungo un piano inclinato', 'il tempo di caduta di una pallina dalla finestra']);
				text = `${N} misura $${X}$ volte ${task}, facendo partire il cronometro sempre quando la pallina è già partita.`;
				why = "Il cronometro parte sempre in ritardo: tutti i tempi vengono più corti del vero, quindi l'errore è sistematico.";
			}
		}
	} else if (kind === 'casuale') {
		sub = rng.int(0, 5);
		const CAS = "L'errore cambia da una misura all'altra, a volte in più e a volte in meno: è casuale.";
		why = CAS;
		switch (sub) {
			case 0:
				text = `${N} cronometra $${X}$ volte la caduta di una pallina; a volte preme il tasto un po' prima dell'arrivo, a volte un po' dopo.`;
				break;
			case 1: {
				const obj = rng.pick(['la larghezza del banco', 'la lunghezza della cattedra', 'la larghezza della porta']);
				text = `${N} misura $${X}$ volte ${obj} con un metro da sarta, appoggiandolo ogni volta in modo un po' diverso.`;
				break;
			}
			case 2: {
				const obj = rng.pick(['un sacchetto di sabbia', 'una borraccia', 'un astuccio', 'un mazzo di chiavi']);
				text = `${N} misura $${X}$ volte il peso di ${obj} con un dinamometro appeso a un tavolo che vibra: la lancetta oscilla, e ${N} la legge a volte un po' più su e a volte un po' più giù.`;
				break;
			}
			case 3: {
				const obj = rng.pick(['la lunghezza di una matita', 'la larghezza di un quaderno', 'la lunghezza di una penna']);
				text = `${N} misura $${X}$ volte ${obj} con un righello e legge a occhio la tacca più vicina, che a volte è un po' sopra e a volte un po' sotto il valore vero.`;
				break;
			}
			case 4: {
				const obj = rng.pick(['un anello', 'una moneta', 'un bottone', 'una graffetta']);
				text = `${N} pesa $${X}$ volte ${obj} con una bilancia di precisione vicino a una finestra aperta: una corrente d'aria muove il piatto, a volte verso l'alto e a volte verso il basso.`;
				break;
			}
			default:
				text = `${N} misura $${X}$ volte con un calibro il diametro di un sasso irregolare, prendendolo ogni volta in un punto diverso.`;
		}
	} else {
		sub = rng.int(0, 5);
		why = "È uno sbaglio in una sola misura, non un errore di misura: quella misura si riconosce, si scarta e si rifà.";
		const len = rng.pick(['la lunghezza di una matita', 'la larghezza di un quaderno', 'la lunghezza di una penna', 'il lato di una piastrella']);
		const mass = rng.pick(['un astuccio', 'una tazza', 'un libro', 'una mela']);
		switch (sub) {
			case 0: {
				let a = rng.int(1, 9);
				let b = rng.int(1, 9);
				while (Math.abs(a - b) < 2) {
					a = rng.int(1, 9);
					b = rng.int(1, 9);
				}
				text = `${N} misura $${X}$ volte ${len}; in una delle misure scrive ${pw(b * 10 + a, 1, 'cm')} al posto di ${pw(a * 10 + b, 1, 'cm')}.`;
				break;
			}
			case 1:
				text = `${N} misura $${X}$ volte ${len}; in una delle misure legge la scala dei pollici invece di quella dei centimetri.`;
				break;
			case 2:
				text = `${N} pesa $${X}$ volte ${mass}; prima di una sola pesata dimentica di azzerare la bilancia.`;
				break;
			case 3: {
				const k = rng.pick([10, 20]);
				text = `${N} cronometra $${X}$ volte $${k}$ oscillazioni di un pendolo; in una prova conta $${k - 1}$ oscillazioni invece di $${k}$.`;
				break;
			}
			case 4:
				text = `${N} riporta in una tabella $${X}$ misure ${len.replace(/^la /, 'della ').replace(/^il /, 'del ')} in centimetri; una la scrive in millimetri, nella colonna dei centimetri.`;
				break;
			default:
				text = `${N} pesa $${X}$ volte ${mass}; a metà di una pesata preme per sbaglio il tasto di azzeramento.`;
		}
	}
	const opts = (Object.keys(KIND1) as Kind1[]).map((k) => ({ latex: t(KIND1[k]), values: [k] }));
	return {
		prompt: 'Scegli il tipo di errore.',
		problem: textBlock(`${text} ${Q1}`),
		solution: t(KIND1[kind]),
		steps: sentences(why),
		choice: fixedChoice(rng, opts, kind),
		params: { case: kind, situation: sub, name: N },
	};
}

// ---------------------------------------------------------------------------
// Level 2: correcting the zero

type Ctx2 = 'bilancia' | 'dinamometro' | 'termometro' | 'righello';

function level2(rng: Rng): Built {
	const ctx = rng.pick(['bilancia', 'dinamometro', 'termometro', 'righello'] as const) as Ctx2;
	for (;;) {
		let z: number, L: number, unit: string, sym: string, text: string;
		const N = rng.pick(NAMES);
		switch (ctx) {
			case 'bilancia': {
				z = rng.int(1, 9) * (rng.next() < 2 / 3 ? 1 : -1);
				L = rng.int(100, 5000);
				unit = 'g';
				sym = 'm';
				const [a, b] = rng.pick([
					['una mela', 'la mela'],
					['un astuccio', "l'astuccio"],
					['un libro', 'il libro'],
					['una tazza', 'la tazza'],
					['un barattolo di miele', 'il barattolo di miele'],
				]);
				text = `Una bilancia, a piatto vuoto, segna ${pw(z, 1, 'g')}. Con ${a} sul piatto segna ${pw(L, 1, 'g')}. Quanto pesa ${b}?`;
				break;
			}
			case 'dinamometro': {
				z = rng.int(1, 5) * (rng.next() < 0.5 ? 1 : -1);
				L = rng.int(10, 200);
				unit = 'N';
				sym = 'P';
				const [a, b] = rng.pick([
					['un sacchetto di sabbia', 'del sacchetto'],
					['una borraccia piena', 'della borraccia'],
					['un mazzo di chiavi', 'del mazzo di chiavi'],
					['uno zaino leggero', 'dello zaino'],
				]);
				text = `Un dinamometro, senza niente appeso, segna ${pw(z, 1, 'N')}. Con ${a} appeso segna ${pw(L, 1, 'N')}. Qual è il peso ${b}?`;
				break;
			}
			case 'termometro': {
				z = rng.int(2, 15) * (rng.next() < 0.5 ? 1 : -1);
				unit = 'C';
				sym = 'T';
				const [where, what, lo] = rng.pick([
					["Nell'acqua di un becher", "dell'acqua", 150],
					["Nell'acqua di una pentola sul fuoco", "dell'acqua", 400],
					['In una tazza di tè', 'del tè', 400],
				] as const);
				L = rng.int(lo, 900);
				text = `Un termometro, nel ghiaccio fondente, segna ${pw(z, 1, 'C')}. ${where} segna ${pw(L, 1, 'C')}. Qual è la temperatura ${what}?`;
				break;
			}
			case 'righello': {
				z = rng.int(2, 8);
				L = rng.int(50, 250);
				unit = 'cm';
				sym = '\\ell';
				const [a, qq] = rng.pick([
					['una matita', 'Quanto è lunga la matita?'],
					['una gomma', 'Quanto è lunga la gomma?'],
					['un chiodo', 'Quanto è lungo il chiodo?'],
					['una chiave', 'Quanto è lunga la chiave?'],
					['un pastello', 'Quanto è lungo il pastello?'],
				]);
				text = `Il righello di ${N} ha il bordo consumato: lo zero della scala non c'è più, e il bordo sta sulla tacca ${pw(z, 1, 'cm')}. ${N} appoggia ${a} al bordo, e l'altra estremità arriva alla tacca ${pw(L, 1, 'cm')}. ${qq}`;
				break;
			}
		}
		const ans = L - z;
		const values = [ans, L + z, L, L - 2 * z];
		if (values.some((v) => v <= 0) || new Set(values).size !== 4) continue;
		const opts = values.map((v) => ({ latex: wu(v, 1, unit), values: [q(v, 10).toString()] }));
		const zTex = z < 0 ? `(${wu(z, 1, unit)})` : wu(z, 1, unit);
		const steps =
			ctx === 'righello'
				? [
						tx(`Il bordo sta sulla tacca ${pw(z, 1, unit)}: la lunghezza vera è la differenza tra le due tacche.`),
						`${sym} = ${wu(L, 1, unit)} - ${zTex} = ${wu(ans, 1, unit)}`,
					]
				: [
						...sentences(
							z > 0
								? `A vuoto lo strumento segna ${pw(z, 1, unit)} in più: la correzione riporta a zero proprio quella lettura. Quindi si toglie la lettura a vuoto.`
								: `A vuoto lo strumento segna ${pw(z, 1, unit)}: ogni lettura è più bassa del vero. Si toglie la lettura a vuoto con il suo segno, e la correzione va in più.`,
						),
						z > 0
							? `${sym} = ${wu(L, 1, unit)} - ${zTex} = ${wu(ans, 1, unit)}`
							: `${sym} = ${wu(L, 1, unit)} - ${zTex} = ${wu(L, 1, unit)} + ${wu(-z, 1, unit)} = ${wu(ans, 1, unit)}`,
					];
		if (ctx === 'termometro') steps.unshift(tx(`Il ghiaccio fondente è a $0\\,${UNIT.C}$: la lettura ${pw(z, 1, unit)} è quella a vuoto del termometro.`));
		return {
			prompt: 'Correggi la misura.',
			problem: textBlock(text),
			solution: `${sym} = ${wu(ans, 1, unit)}`,
			steps,
			choice: fixedChoice(rng, opts, q(ans, 10).toString()),
			params: { case: ctx, z: q(z, 10).toString(), L: q(L, 10).toString(), unit, answer: q(ans, 10).toString() },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: the target

export const KIND3 = { PA: 'precisi e accurati', PN: 'precisi ma non accurati', AN: 'accurati ma non precisi', NN: 'né precisi né accurati' } as const;
type Kind3 = keyof typeof KIND3;
const NUMBER_WORD: Record<number, string> = { 6: 'sei', 7: 'sette', 8: 'otto' };
const DIRS = ['a destra', 'in alto a destra', 'in alto', 'in alto a sinistra', 'a sinistra', 'in basso a sinistra', 'in basso', 'in basso a destra'];
const dirOf = (x: number, y: number) => DIRS[((Math.round(Math.atan2(y, x) / (Math.PI / 4)) % 8) + 8) % 8];

/** Mean (times n), spread and the other measures of shots in hundredths, all exact on integers. */
export function shotStats(p: [number, number][]) {
	const n = p.length;
	const Sx = p.reduce((s, [x]) => s + x, 0);
	const Sy = p.reduce((s, [, y]) => s + y, 0);
	// squared distances times n^2 (from the mean) and in hundredths^2 (between shots, from the centre)
	const spread2 = Math.max(...p.map(([x, y]) => (n * x - Sx) ** 2 + (n * y - Sy) ** 2));
	const mean2 = Sx * Sx + Sy * Sy;
	let minPair = Infinity;
	for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) minPair = Math.min(minPair, (p[i][0] - p[j][0]) ** 2 + (p[i][1] - p[j][1]) ** 2);
	const maxR2 = Math.max(...p.map(([x, y]) => x * x + y * y));
	return { n, Sx, Sy, spread2, mean2, minPair, maxR2 };
}

/** The class of the shots with the thresholds of the spec, or null if a value falls between them. */
export function classify(p: [number, number][]): Kind3 | null {
	const { n, spread2, mean2 } = shotStats(p);
	const precise = spread2 <= (20 * n) ** 2 ? true : spread2 >= (45 * n) ** 2 ? false : null;
	const accurate = mean2 <= (8 * n) ** 2 ? true : mean2 >= (40 * n) ** 2 ? false : null;
	if (precise === null || accurate === null) return null;
	return precise ? (accurate ? 'PA' : 'PN') : accurate ? 'AN' : 'NN';
}

function shots(rng: Rng, kind: Kind3): [number, number][] {
	const precise = kind === 'PA' || kind === 'PN';
	const accurate = kind === 'PA' || kind === 'AN';
	for (;;) {
		const n = rng.int(6, 8);
		const th = rng.next() * 2 * Math.PI;
		const dist = accurate ? rng.next() * 0.03 : precise ? 0.45 + rng.next() * 0.25 : 0.41 + rng.next() * 0.07;
		const cx = dist * Math.cos(th);
		const cy = dist * Math.sin(th);
		const phi = rng.next() * 2 * Math.PI;
		const off: [number, number][] = [];
		for (let i = 0; i < n; i++) {
			const a = phi + (2 * Math.PI * i) / n + (rng.next() - 0.5) * 0.8;
			const r = precise ? 0.05 + rng.next() * 0.13 : (i === 0 ? 0.5 : 0.18) + rng.next() * (i === 0 ? 0.08 : 0.42);
			off.push([r * Math.cos(a), r * Math.sin(a)]);
		}
		const mx = off.reduce((s, [x]) => s + x, 0) / n;
		const my = off.reduce((s, [, y]) => s + y, 0) / n;
		const p = off.map(([x, y]) => [Math.round((cx + x - mx) * 100), Math.round((cy + y - my) * 100)] as [number, number]);
		const st = shotStats(p);
		if (classify(p) !== kind || st.minPair < 49 || st.maxR2 > 95 * 95) continue;
		return p;
	}
}

/** A value in hundredths, or a rational in units, rounded to the hundredth and written with two decimals. */
const r2 = (x: number) => fx(Math.round(x * 100), 2);

function level3(rng: Rng): Built {
	const kind = rng.pick(['PA', 'PN', 'AN', 'NN'] as const);
	const p = shots(rng, kind);
	const { n, Sx, Sy, spread2 } = shotStats(p);
	const Mx = Sx / n / 100;
	const My = Sy / n / 100;
	const d = Math.hypot(Mx, My);
	const s = Math.sqrt(spread2) / n / 100;
	const dir = dirOf(Mx, My);
	const where: Record<Kind3, string> = {
		PA: 'raccolti vicino al centro',
		PN: `raccolti ${dir}, lontano dal centro`,
		AN: 'sparsi su gran parte del bersaglio, tutto attorno al centro',
		NN: `sparsi e spostati ${dir}`,
	};
	const alt = `Un bersaglio con ${NUMBER_WORD[n]} colpi, ${where[kind]}.`;
	const colpi = p.map(([x, y]) => [x / 100, y / 100]);
	const scene = { type: 'bersaglio', data: { colpi }, alt };
	const precise = kind === 'PA' || kind === 'PN';
	const accurate = kind === 'PA' || kind === 'AN';
	const steps = [
		tx(`Con il raggio del bersaglio uguale a $1$, la media dei colpi è nel punto $(${r2(Mx)};\\,${r2(My)})$, a circa $${r2(d)}$ dal centro.`),
		tx(accurate ? 'La media è vicina al valore vero: i colpi sono accurati.' : 'La media è lontana dal valore vero: i colpi non sono accurati.'),
		tx(`Il colpo più lontano dalla media dista circa $${r2(s)}$.`),
		tx(precise ? 'I colpi sono vicini tra loro: sono precisi.' : 'I colpi sono sparsi: non sono precisi.'),
	];
	const opts = (Object.keys(KIND3) as Kind3[]).map((k) => ({ latex: t(KIND3[k]), values: [k] }));
	return {
		prompt: 'Guarda il bersaglio.',
		problem: textBlock('Ogni colpo del bersaglio è una misura, e il centro è il valore vero. Come sono questi colpi?'),
		solution: t(KIND3[kind]),
		steps,
		choice: fixedChoice(rng, opts, kind),
		params: { case: kind, colpi },
		scene,
	};
}

// ---------------------------------------------------------------------------
// Level 4: precision and accuracy on numbers

const KIND4 = { PA: 'precisa e accurata', PN: 'precisa ma non accurata', AN: 'accurata ma non precisa' } as const;
type Kind4 = keyof typeof KIND4;

function smallDevs(rng: Rng): number[] {
	for (;;) {
		const d = [0, 1, 2, 3].map(() => rng.int(-2, 2));
		const range = Math.max(...d) - Math.min(...d);
		if (d.reduce((a, b) => a + b, 0) === 0 && range >= 2 && range <= 4) return d;
	}
}

function wideDevs(rng: Rng): number[] {
	for (;;) {
		const a = rng.int(20, 50);
		const b = rng.int(20, 50);
		const c = -rng.int(20, 50);
		const e = -(a + b) - c;
		if (e > -20 || e < -50) continue;
		const d = shuffle(rng, [a, b, c, e]);
		if (Math.max(...d) - Math.min(...d) >= 50) return d;
	}
}

function level4(rng: Rng): Built {
	const ctx = rng.pick(['pesetto', 'blocchetto', 'intervallo'] as const);
	let R: number, unit: string, intro: string;
	if (ctx === 'pesetto') {
		R = rng.pick([5000, 10000, 2000]);
		unit = 'g';
		intro = `Tre gruppi pesano quattro volte, ognuno con la sua bilancia, un pesetto campione da ${pw(R, 2, 'g')}.`;
	} else if (ctx === 'blocchetto') {
		R = rng.pick([2500, 4000]);
		unit = 'mm';
		intro = `Tre gruppi misurano quattro volte, ognuno con il suo calibro, un blocchetto di riferimento lungo ${pw(R, 2, 'mm')}.`;
	} else {
		R = 1000;
		unit = 's';
		intro = `Un segnale acustico dà un intervallo di ${pw(R, 2, 's')}: tre gruppi lo misurano quattro volte, ognuno con il suo cronometro.`;
	}
	const kinds = shuffle(rng, ['PA', 'PN', 'AN'] as Kind4[]);
	const letters = ['A', 'B', 'C'];
	const series = kinds.map((k) => {
		if (k === 'PA') return smallDevs(rng).map((d) => R + d);
		if (k === 'PN') {
			const o = rng.int(20, 50) * (rng.next() < 0.5 ? 1 : -1);
			return smallDevs(rng).map((d) => R + o + d);
		}
		return wideDevs(rng).map((d) => R + d);
	});
	const asked = rng.pick(['PA', 'PN', 'AN'] as const);
	const right = letters[kinds.indexOf(asked)];
	const dataLines = series.map((xs, i) => `${t(`${letters[i]}: `)} ${xs.map((x, j) => (j === 3 ? wu(x, 2, unit) : fx(x, 2))).join(' \\quad ')}`);
	const steps = series.map((xs, i) => {
		const lo = Math.min(...xs);
		const hi = Math.max(...xs);
		const sum = xs.reduce((a, b) => a + b, 0);
		return tx(
			`${letters[i]}: campo di variazione $${fx(hi, 2)} - ${fx(lo, 2)} = ${wu(hi - lo, 2, unit)}$, media $\\dfrac{${fx(sum, 2)}}{4} = ${wu(sum / 4, 2, unit)}$.`,
		);
	});
	const precise = letters.filter((_, i) => kinds[i] !== 'AN');
	const accurate = letters.filter((_, i) => kinds[i] !== 'PN');
	steps.push(tx(`Hanno un campo piccolo, e sono precise, le serie ${precise.join(' e ')}.`));
	steps.push(tx(`Hanno la media uguale al riferimento, e sono accurate, le serie ${accurate.join(' e ')}.`));
	steps.push(tx(`La serie ${right} è ${KIND4[asked]}.`));
	const opts = letters.map((l) => ({ latex: t(`serie ${l}`), values: [l] }));
	return {
		prompt: 'Confronta le tre serie.',
		problem: textBlock(`${intro} Quale serie è ${KIND4[asked]}?`, 46, dataLines),
		solution: t(`serie ${right}`),
		steps,
		choice: { kind: 'choice', options: opts, correct: letters.indexOf(right) },
		params: { case: asked, context: ctx, R: q(R, 100).toString(), unit, kinds, series: series.map((xs) => xs.map((x) => q(x, 100).toString())) },
	};
}

// ---------------------------------------------------------------------------
// Level 5: the remedy

export const KIND5 = {
	media: ['ripetere la misura più volte', 'e fare la media'],
	correggi: ['tarare lo strumento', 'o correggere il metodo'],
	scarta: ['scartare quella misura', 'e rifarla'],
	sensibile: ['usare uno strumento', 'più sensibile'],
} as const;
type Kind5 = keyof typeof KIND5;
const opt5 = (k: Kind5): ChoiceOption => ({ latex: `\\begin{gathered} ${t(KIND5[k][0])} \\\\ ${t(KIND5[k][1])} \\end{gathered}`, values: [k] });

/** Five measures around v (in tenths or hundredths), with `odd` in position `at`. */
function around(rng: Rng, v: number, step: number, odd: number, at: number): number[] {
	return [0, 1, 2, 3, 4].map((i) => (i === at ? odd : v + step * rng.int(-1, 1)));
}

function level5(rng: Rng): Built {
	const kind = rng.pick(['media', 'correggi', 'scarta', 'sensibile'] as const);
	const N = rng.pick(NAMES);
	const X = rng.int(5, 8);
	const sub = rng.int(0, 3);
	let text = '';
	let why = '';
	if (kind === 'media') {
		why = "Le misure cambiano a volte in più e a volte in meno: è un errore casuale, e contro gli errori casuali si ripete la misura e si fa la media.";
		switch (sub) {
			case 0: {
				const a = rng.int(50, 140);
				text = `${N} cronometra $${X}$ volte la caduta di una pallina dalla stessa altezza e trova tempi diversi, a volte più lunghi e a volte più corti, tra ${pw(a, 2, 's')} e ${pw(a + rng.int(8, 20), 2, 's')}.`;
				break;
			}
			case 1: {
				const obj = rng.pick(['un sacchetto di sabbia', 'una borraccia', 'un astuccio', 'un mazzo di chiavi']);
				text = `${N} misura $${X}$ volte il peso di ${obj} con un dinamometro appeso a un sostegno che vibra: la lancetta oscilla, e le letture cambiano ogni volta di qualche decimo di newton, a volte in più e a volte in meno.`;
				break;
			}
			case 2: {
				const [obj, lo, hi] = rng.pick([
					['la larghezza del banco', 550, 750],
					['la larghezza della porta', 780, 900],
					['la lunghezza della cattedra', 1200, 1600],
				] as const);
				const a = rng.int(lo, hi);
				text = `${N} misura $${X}$ volte ${obj} con un metro da sarta, appoggiandolo ogni volta in modo un po' diverso, e trova valori tra ${pw(a, 1, 'cm')} e ${pw(a + rng.int(3, 8), 1, 'cm')}, a volte più lunghi e a volte più corti.`;
				break;
			}
			default: {
				const a = rng.int(120, 200);
				text = `${N} misura $${X}$ volte il periodo di un pendolo con il cronometro a mano e trova valori tra ${pw(a, 2, 's')} e ${pw(a + rng.int(8, 20), 2, 's')}, a volte sopra e a volte sotto un valore centrale.`;
			}
		}
	} else if (kind === 'correggi') {
		why = "L'errore sposta tutte le misure nello stesso verso: è sistematico, e ripetere la misura non serve. Si tara lo strumento o si corregge il metodo.";
		switch (sub) {
			case 0: {
				const R = rng.pick([5000, 10000, 2000]);
				const o = rng.int(20, 60) * (rng.next() < 0.5 ? 1 : -1);
				text = `Pesando quattro volte un pesetto campione da ${pw(R, 2, 'g')}, la bilancia di ${N} dà sempre valori tra ${pw(R + o - 2, 2, 'g')} e ${pw(R + o + 2, 2, 'g')}.`;
				break;
			}
			case 1: {
				const z = rng.int(2, 9) * (rng.next() < 2 / 3 ? 1 : -1);
				const obj = rng.pick(['tre monete', 'alcune mele', 'un astuccio', 'quattro sassi', 'una tazza']);
				text = `La bilancia di ${N}, a piatto vuoto, segna ${pw(z, 1, 'g')}, e ${N} deve pesare ${obj}.`;
				break;
			}
			case 2: {
				const what = rng.pick(["la temperatura dell'acqua che si scalda", 'la temperatura della stanza ogni ora', "la temperatura dell'acqua di un acquario"]);
				text = `${N} legge il termometro sempre dal basso, con l'occhio sotto il livello del liquido, per misurare ${what}.`;
				break;
			}
			default: {
				const x = rng.int(1, 3);
				const task = rng.pick(['i tempi di caduta di una pallina', 'il periodo di un pendolo', 'i tempi di corsa dei compagni']);
				text = `Il cronometro di ${N} parte sempre ${pw(x, 1, 's')} dopo che si preme il tasto, e ${N} lo usa per misurare ${task}.`;
			}
		}
	} else if (kind === 'scarta') {
		why = "Quella misura è uno sbaglio, e si sa perché: si scarta, dicendo il motivo, e se si può si rifà.";
		const at = rng.int(0, 4);
		switch (sub) {
			case 0: {
				let a = rng.int(1, 7);
				let b = rng.int(2, 8);
				while (Math.abs(a - b) < 2) {
					a = rng.int(1, 7);
					b = rng.int(2, 8);
				}
				const obj = rng.pick(['la lunghezza di una gomma', 'il diametro di un tappo', 'la larghezza di una chiave']);
				const xs = around(rng, a * 10 + b, 1, b * 10 + a, at);
				text = `${N} misura cinque volte ${obj} e trova ${plist(xs, 1, 'cm')}; poi si accorge che nella ${ORD[at]} misura ha scambiato le due cifre.`;
				break;
			}
			case 1: {
				const T = rng.int(120, 200);
				const xs = around(rng, T, 1, Math.round(T * 0.9), at);
				text = `${N} cronometra cinque volte $10$ oscillazioni di un pendolo e trova ${plist(xs, 1, 's')}; nella ${ORD[at]} prova si accorge di aver contato solo $9$ oscillazioni.`;
				break;
			}
			case 2: {
				const [obj, lo, hi] = rng.pick([
					['un astuccio', 1500, 3000],
					['una tazza', 2500, 3500],
					['una mela', 1500, 2200],
				] as const);
				const m = rng.int(lo, hi);
				const xs = around(rng, m, 1, m + rng.int(30, 120), at);
				text = `${N} pesa cinque volte ${obj} e trova ${plist(xs, 1, 'g')}; prima della ${ORD[at]} pesata aveva dimenticato di azzerare la bilancia.`;
				break;
			}
			default: {
				const [obj, lo, hi] = rng.pick([
					['la lunghezza di una penna', 130, 150],
					['la larghezza di un quaderno', 200, 220],
					['la lunghezza di un libro', 240, 280],
				] as const);
				const L = rng.int(lo, hi);
				const xs = around(rng, L, 1, Math.round(L / 2.54), at);
				text = `${N} misura cinque volte ${obj} e trova ${plist(xs, 1, 'cm')}; nella ${ORD[at]} misura si accorge di aver letto la scala dei pollici.`;
			}
		}
	} else {
		why = "Le misure sono tutte uguali perché lo strumento non vede differenze più piccole della sua sensibilità: ripetere la misura non aggiunge cifre. Serve uno strumento più sensibile.";
		switch (sub) {
			case 0: {
				const [obj, lo, hi] = rng.pick([
					['la lunghezza di una matita', 12, 18],
					['la larghezza di un quaderno', 20, 22],
					['la lunghezza di una penna', 13, 15],
				] as const);
				text = `${N} misura cinque volte ${obj} con un righello che ha solo le tacche dei centimetri, e trova sempre ${pw(rng.int(lo, hi), 0, 'cm')}. Serve la lunghezza al millimetro.`;
				break;
			}
			case 1:
				text = `${N} misura cinque volte il tempo di caduta di una pallina con un cronometro a fotocellule che mostra solo i decimi di secondo, e legge sempre ${pw(rng.int(2, 6), 1, 's')}. Serve il tempo al centesimo di secondo.`;
				break;
			case 2: {
				const obj = rng.pick(['un anello', 'una moneta', 'un bottone']);
				text = `${N} pesa cinque volte ${obj} con una bilancia da cucina che segna i grammi, e legge sempre ${pw(rng.int(2, 9), 0, 'g')}. Serve la massa al decimo di grammo.`;
				break;
			}
			default: {
				const [what, lo, hi] = rng.pick([
					["dell'acqua del rubinetto", 12, 20],
					['della stanza', 18, 24],
					["dell'acqua di un acquario", 22, 27],
				] as const);
				text = `${N} misura cinque volte la temperatura ${what} con un termometro che ha solo le tacche dei gradi, e legge sempre ${pw(rng.int(lo, hi), 0, 'C')}. Serve la temperatura al decimo di grado.`;
			}
		}
	}
	return {
		prompt: 'Scegli il rimedio.',
		problem: textBlock(`${text} Che cosa conviene fare?`),
		solution: t(`${KIND5[kind][0]} ${KIND5[kind][1]}`),
		steps: sentences(why),
		choice: fixedChoice(rng, (Object.keys(KIND5) as Kind5[]).map(opt5), kind),
		params: { case: kind, situation: sub, name: N },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 100; attempt++) {
		const b = make(rng);
		const sample: Sample = {
			generatorId: ID,
			level,
			seed: rng.seed,
			prompt: b.prompt,
			problem: b.problem,
			solution: b.solution,
			steps: b.steps,
			answer: b.choice,
			params: b.params,
		};
		if (b.scene) {
			sample.scene = b.scene;
			sample.solutionScene = JSON.parse(JSON.stringify(b.scene));
		}
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

const hund = (s: string) => {
	const [a, b = '1'] = s.split('/');
	return Math.round((Number(a) * 100) / Number(b));
};

function check(sample: Sample): string[] {
	const v: string[] = [];
	const p = sample.params;
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return [...v, 'la risposta deve essere una scelta'];
	const keys = a.options.map((o) => o.values[0]);
	if (new Set(keys).size !== keys.length || new Set(a.options.map((o) => o.latex)).size !== keys.length) v.push('opzioni ripetute');
	if (!(a.correct >= 0 && a.correct < keys.length)) v.push('indice della risposta fuori dalle opzioni');
	const right = keys[a.correct];
	switch (sample.level) {
		case 1:
			if (keys.length !== 3 || right !== p.case) v.push('livello 1: tre opzioni, la giusta è il caso');
			break;
		case 2: {
			const z = hund(p.z as string);
			const L = hund(p.L as string);
			const want = [L - z, L + z, L, L - 2 * z].sort((x, y) => x - y);
			const got = keys.map(hund).sort((x, y) => x - y);
			if (keys.length !== 4 || want.join() !== got.join()) v.push('livello 2: le opzioni non sono L - z, L + z, L, L - 2z');
			if (got.some((x) => x <= 0)) v.push('livello 2: opzione non positiva');
			if (hund(right) !== L - z) v.push('livello 2: la giusta non è L - z');
			break;
		}
		case 3: {
			const pts = (p.colpi as number[][]).map(([x, y]) => [Math.round(x * 100), Math.round(y * 100)] as [number, number]);
			const st = shotStats(pts);
			if (st.n < 6 || st.n > 8) v.push('livello 3: da sei a otto colpi');
			if (classify(pts) !== p.case || right !== p.case) v.push('livello 3: la classe dei colpi non è il caso');
			if (st.minPair < 49) v.push('livello 3: due colpi troppo vicini');
			if (st.maxR2 > 95 * 95) v.push('livello 3: un colpo oltre 0,95');
			if (!sample.scene || /precis|accurat/.test(sample.scene.alt)) v.push("livello 3: scena mancante o alt che dà la risposta");
			break;
		}
		case 4: {
			const R = hund(p.R as string);
			const series = (p.series as string[][]).map((xs) => xs.map(hund));
			const cls = series.map((xs) => {
				const range = Math.max(...xs) - Math.min(...xs);
				const off = Math.abs(xs.reduce((s, x) => s + x, 0) - 4 * R);
				const prec = range <= 4 ? true : range >= 50 ? false : null;
				const acc = off === 0 ? true : off >= 80 ? false : null;
				return prec && acc ? 'PA' : prec && acc === false ? 'PN' : prec === false && acc ? 'AN' : '?';
			});
			if (cls.join() !== (p.kinds as string[]).join() || new Set(cls).size !== 3) v.push('livello 4: le serie non sono una per classe');
			if (cls[keys.indexOf(right)] !== p.case) v.push('livello 4: la giusta non è la serie chiesta');
			break;
		}
		case 5:
			if (keys.length !== 4 || right !== p.case) v.push('livello 5: quattro opzioni, la giusta è il caso');
			break;
	}
	return v;
}

export const fisErroriMisura: Generator = {
	id: ID,
	title: 'Errori casuali ed errori sistematici',
	levels: {
		1: { label: 'Casuale o sistematico', constraints: ['casuale, sistematico, sbaglio, circa un terzo ciascuno', 'almeno sei situazioni per caso'] },
		2: { label: 'Correggere lo zero', constraints: ['bilancia, dinamometro, termometro, righello consumato', 'risposta L - z; distrattori L + z, L, L - 2z, tutti positivi'] },
		3: { label: 'Il bersaglio', constraints: ['da sei a otto colpi entro 0,95', 'precisi s ≤ 0,2, non precisi s ≥ 0,45; accurati |M| ≤ 0,08, non accurati |M| ≥ 0,4'] },
		4: { label: 'Precisione e accuratezza', constraints: ['tre serie di quattro misure: precisa e accurata, precisa non accurata, accurata non precisa'] },
		5: { label: 'Come rimediare', constraints: ['media, correggere, scartare, strumento più sensibile, un quarto ciascuno'] },
	},
	generate,
	check,
};

export default fisErroriMisura;
