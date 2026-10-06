/**
 * Energia di legame e regola dell'ottetto. Spec: specs/exercises/chim-regola-ottetto.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/62-chim-regola-ottetto.md), each one step harder: the
 * facts about energy and stability; the strongest, weakest, shortest or longest bond read in a table; the energy to
 * break the bonds of a sample of n moles; the energy balance of H2 + X2 → 2 HX from bond energies; how many electrons
 * an atom loses or gains to complete its outer level (a whole number, for the open answer); the ion it forms and the
 * noble gas with the same configuration.
 */
import type { Generator, Rng } from '../types';
import { type BuiltE, BONDS_62, type Bond, art, bondTex, cap, checkE, choose, decTex, di, el, generateE, t, texOpt, textBlock, textOpt, toChoiceE, tx, valence } from '../chim3-e';
import { shuffle } from '../insiemi';

export const ID = 'chim-regola-ottetto';

// ---------------------------------------------------------------------------
// Level 1: facts

export const FACTS: { q: string; a: string; wrong: string[]; why: string }[] = [
	{ q: 'Quando due atomi si legano, che cosa succede alla loro energia?', a: 'Diminuisce', wrong: ['Aumenta', 'Resta uguale', 'Si annulla'], why: 'Due atomi si legano perché uniti hanno meno energia di quando sono separati: meno energia vuol dire più stabilità.' },
	{ q: "Nella curva dell'energia di due atomi in funzione della distanza, che cosa indica la distanza del punto di minimo?", a: 'La lunghezza di legame', wrong: ["L'energia di legame", 'Il raggio del nucleo', "L'energia di ionizzazione"], why: 'Il minimo della curva è la distanza di equilibrio tra i due nuclei, cioè la lunghezza di legame.' },
	{ q: "Nella curva dell'energia di due atomi in funzione della distanza, che cosa indica la profondità del minimo?", a: "L'energia di legame", wrong: ['La lunghezza di legame', 'Il numero di elettroni', 'La carica dei nuclei'], why: "Per risalire dal minimo allo zero bisogna fornire un'energia uguale alla profondità della buca: è l'energia di legame." },
	{ q: "Perché l'energia risale quando due atomi sono più vicini della lunghezza di legame?", a: 'I nuclei si respingono', wrong: ['I nuclei si attraggono', 'Gli elettroni spariscono', 'Gli atomi perdono massa'], why: 'I due nuclei, entrambi positivi, a breve distanza si respingono con una forza che cresce in fretta.' },
	{ q: 'Che cosa succede quando un legame chimico si rompe?', a: 'Si assorbe energia', wrong: ['Si libera energia', "L'energia non cambia", 'Si crea energia dal nulla'], why: "Per rompere un legame l'energia va sempre fornita: è l'energia di legame." },
	{ q: 'Che cosa succede quando un legame chimico si forma?', a: "Si cede energia all'ambiente", wrong: ["Si assorbe energia dall'ambiente", "L'energia non cambia", 'Gli atomi diventano ioni'], why: "Formandosi, un legame cede all'ambiente la stessa energia che servirebbe per romperlo." },
	{ q: "In quale unità si misura l'energia di legame?", a: 'kJ/mol', wrong: ['pm', 'g/mol', 'mol/L'], why: "L'energia di legame è l'energia per rompere una mole di legami: chilojoule per mole." },
	{ q: 'In quale unità si misura di solito la lunghezza di legame?', a: 'Picometri', wrong: ['Chilojoule', 'Moli', 'Grammi'], why: 'La lunghezza di legame è una distanza tra nuclei, dell\'ordine di cento picometri.' },
	{ q: 'Quali elettroni di un atomo formano i legami chimici?', a: 'Gli elettroni di valenza', wrong: ['Gli elettroni del primo livello', 'Tutti gli elettroni', 'Nessuno: li formano i protoni'], why: 'I legami li fanno gli elettroni del livello più esterno, gli elettroni di valenza.' },
	{ q: 'Quanti elettroni ha nel livello più esterno un atomo di neon?', a: '8', wrong: ['2', '6', '10'], why: 'Il neon è $[\\mathrm{He}]\\,2s^2\\,2p^6$: nel secondo livello ha $2 + 6 = 8$ elettroni, un ottetto.' },
	{ q: 'Quanti elettroni ha nel livello più esterno un atomo di elio?', a: '2', wrong: ['8', '1', '4'], why: "L'elio è $1s^2$: il primo livello è completo con $2$ elettroni." },
	{ q: 'Perché i gas nobili non formano legami?', a: 'Hanno il livello esterno completo', wrong: ['Non hanno elettroni', 'Hanno troppi protoni', 'Sono troppo leggeri'], why: 'Con il livello più esterno completo, un gas nobile legandosi non scenderebbe di energia: è già stabile.' },
	{ q: 'Tra due legami, qual è il più forte?', a: 'Quello con energia di legame maggiore', wrong: ['Quello con energia di legame minore', 'Sempre il più lungo', 'Quello tra atomi più pesanti'], why: "Più grande è l'energia di legame, più energia serve per rompere il legame: il legame è più forte." },
	{ q: "Che cos'è l'ottetto?", a: 'Otto elettroni nel livello più esterno', wrong: ['Otto elettroni in tutto', 'Otto protoni nel nucleo', 'Otto atomi legati tra loro'], why: "L'ottetto è il gruppo di otto elettroni del livello più esterno, con i sottolivelli $s$ e $p$ completi." },
	{ q: 'Quanti elettroni servono a un atomo di idrogeno per avere il livello esterno completo?', a: '2', wrong: ['8', '1', '18'], why: "Il gas nobile più vicino all'idrogeno è l'elio, con $2$ elettroni: per l'idrogeno vale la regola del duetto." },
	{ q: 'Lo ione $\\mathrm{Na^+}$ ha la configurazione del neon. Di quale elemento è?', a: 'Sodio', wrong: ['Neon', 'Magnesio', 'Fluoro'], why: "L'elemento lo decidono i protoni: $\\mathrm{Na^+}$ ne ha $11$, ed è sodio, anche se ha $10$ elettroni come il neon." },
];

function level1(rng: Rng): BuiltE {
	const k = rng.int(0, FACTS.length - 1);
	const f = FACTS[k];
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(f.q),
		solution: t(f.a),
		steps: [textBlock(f.why)],
		answer: choose(rng, textOpt(f.a), f.wrong.map((x) => textOpt(x))),
		params: { case: 'fatto', k },
	};
}

// ---------------------------------------------------------------------------
// Level 2: reading the table

const btex = (b: Bond) => bondTex(b.a, b.b, b.order);
const table = (rows: Bond[]) =>
	`\\begin{array}{c|c|c} \\text{legame} & \\text{lunghezza} & \\text{energia} \\\\ \\hline ${rows.map((b) => `${btex(b)} & ${b.length} & ${b.energy}`).join(' \\\\ ')} \\end{array}`;

const ASKS = {
	forte: { q: 'Quale di questi legami è il più forte?', key: 'energy', max: true, why: "Il più forte è quello con l'energia di legame maggiore" },
	debole: { q: 'Quale di questi legami è il più debole?', key: 'energy', max: false, why: "Il più debole è quello con l'energia di legame minore" },
	corto: { q: 'Quale di questi legami è il più corto?', key: 'length', max: false, why: 'Il più corto è quello con la lunghezza di legame minore' },
	lungo: { q: 'Quale di questi legami è il più lungo?', key: 'length', max: true, why: 'Il più lungo è quello con la lunghezza di legame maggiore' },
} as const;

function level2(rng: Rng): BuiltE {
	const kind = rng.pick(['forte', 'debole', 'corto', 'lungo'] as const);
	const ask = ASKS[kind];
	const rows = shuffle(rng, BONDS_62).slice(0, 4);
	const vals = rows.map((b) => b[ask.key]);
	if (new Set(vals).size !== 4) throw new Error('two equal values');
	const best = ask.max ? Math.max(...vals) : Math.min(...vals);
	const right = rows[vals.indexOf(best)];
	return {
		prompt: 'Leggi la tabella e rispondi.',
		problem: textBlock(`${ask.q} Le lunghezze sono in picometri, le energie in chilojoule per mole.`, 46, [table(rows)]),
		solution: btex(right),
		steps: [textBlock(`${ask.why}: $${btex(right)}$, con $${best}\\,\\text{${ask.key === 'energy' ? 'kJ/mol' : 'pm'}}$.`)],
		answer: choose(rng, texOpt(btex(right), `${right.a}-${right.b}`), rows.filter((b) => b !== right).map((b) => texOpt(btex(b), `${b.a}-${b.b}`))),
		params: { case: kind },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the energy to break the bonds of a sample

/** Moles of molecules, in thousandths. */
const MOLES = [250, 500, 750, 1250, 1500, 1750, 2000, 2250, 2500];
const molTex = (m: number) => decTex((m / 1000).toPrecision(3));
const formula = (b: Bond) => (b.a === b.b ? `\\mathrm{${b.a}_2}` : `\\mathrm{${b.a}${b.b}}`);
const NAME: Record<string, string> = { HH: 'idrogeno', FF: 'fluoro', ClCl: 'cloro', BrBr: 'bromo', II: 'iodio', HF: 'fluoruro di idrogeno', HCl: 'cloruro di idrogeno', HBr: 'bromuro di idrogeno', HI: 'ioduro di idrogeno' };

/** x (in thousandths of a kJ) as a whole number of kJ between 100 and 999 that does not end with 0; null otherwise or on a tie. */
function wholeKj(milli: number): number | null {
	if (milli % 1000 === 500) return null;
	const r = Math.round(milli / 1000);
	return r >= 100 && r <= 999 && r % 10 !== 0 ? r : null;
}
const kj = (n: number) => `${n}\\,\\text{kJ}`;

function level3(rng: Rng): BuiltE {
	const b = rng.pick(BONDS_62);
	const m = rng.pick(MOLES);
	const right = wholeKj(m * b.energy);
	if (right === null) throw new Error('not a clean result');
	// the energy divided by the moles; the bond energy alone; the moles of atoms instead of bonds; half
	const wrong = [wholeKj(Math.round((b.energy * 1e6) / m)), b.energy, wholeKj(2 * m * b.energy), wholeKj((m * b.energy) / 2)].filter((x): x is number => x !== null && Number.isInteger(x));
	const name = NAME[b.a + b.b];
	return {
		prompt: "Calcola l'energia.",
		problem: textBlock(`L'energia del legame $${btex(b)}$ è $${b.energy}\\,\\text{kJ/mol}$. Quanta energia serve per rompere tutti i legami di $${molTex(m)}\\,\\text{mol}$ di ${name}, $${formula(b)}$?`),
		solution: kj(right),
		steps: [
			textBlock(`Ogni molecola di $${formula(b)}$ ha un legame: le moli di legami sono $${molTex(m)}$.`),
			`E = ${molTex(m)}\\,\\text{mol} \\cdot ${b.energy}\\,\\text{kJ/mol} \\approx ${kj(right)}`,
		],
		answer: choose(rng, texOpt(kj(right), String(right)), wrong.map((x) => texOpt(kj(x), String(x)))),
		params: { case: 'campione', bond: `${b.a}-${b.b}`, moles: m },
	};
}

// ---------------------------------------------------------------------------
// Level 4: the energy balance of H2 + X2 → 2 HX

const HALOGENS = ['F', 'Cl', 'Br', 'I'] as const;
const bond62 = (a: string, b: string) => {
	const x = BONDS_62.find((y) => y.a === a && y.b === b);
	if (!x) throw new Error(`no bond ${a}-${b}`);
	return x;
};
const moli = (k: number) => (k === 1 ? 'Una mole' : `$${k}$ moli`);

function level4(rng: Rng): BuiltE {
	const X = rng.pick(HALOGENS);
	const k = rng.int(1, 4);
	const kind = rng.pick(['assorbita', 'ceduta', 'bilancio', 'bilancio'] as const);
	const hh = bond62('H', 'H'), xx = bond62(X, X), hx = bond62('H', X);
	const broken = k * (hh.energy + xx.energy);
	const formed = 2 * k * hx.energy;
	const net = formed - broken; // positive: the reaction gives energy out
	const data = `Le energie di legame sono $${hh.energy}\\,\\text{kJ/mol}$ per $${btex(hh)}$, $${xx.energy}\\,\\text{kJ/mol}$ per $${btex(xx)}$ e $${hx.energy}\\,\\text{kJ/mol}$ per $${btex(hx)}$.`;
	const start = `${moli(k)} di $\\mathrm{H_2}$ ${k === 1 ? 'reagisce' : 'reagiscono'} con ${moli(k).toLowerCase()} di $\\mathrm{${X}_2}$ e ${k === 1 ? 'forma' : 'formano'} $${2 * k}$ moli di $\\mathrm{H${X}}$.`;
	const stepBroken = `\\text{legami rotti: } ${k === 1 ? '' : `${k} \\cdot (`}${hh.energy} + ${xx.energy}${k === 1 ? '' : ')'} = ${kj(broken)}`;
	const stepFormed = `\\text{legami formati: } ${2 * k} \\cdot ${hx.energy} = ${kj(formed)}`;
	if (kind === 'assorbita') {
		return {
			prompt: "Calcola l'energia assorbita.",
			problem: textBlock(`${start} ${data} Quanta energia viene assorbita per rompere i legami dei reagenti?`),
			solution: kj(broken),
			steps: [textBlock(`Si rompono ${k === 1 ? 'una mole' : `$${k}$ moli`} di legami $${btex(hh)}$ e altrettante di legami $${btex(xx)}$.`), stepBroken],
			// the energy given out by the new bonds; one kind of bond only; one mole only; the balance
			answer: choose(rng, texOpt(kj(broken), String(broken)), [formed, k * hh.energy, hh.energy + xx.energy, Math.abs(net), k * hx.energy].map((x) => texOpt(kj(x), String(x)))),
			params: { case: kind, X, k },
		};
	}
	if (kind === 'ceduta') {
		return {
			prompt: "Calcola l'energia ceduta.",
			problem: textBlock(`${start} ${data} Quanta energia viene ceduta quando si formano i legami dei prodotti?`),
			solution: kj(formed),
			steps: [textBlock(`Si formano $${2 * k}$ moli di legami $${btex(hx)}$.`), stepFormed],
			// half of it (the 2 of 2 HX forgotten); the energy absorbed; the balance; one bond
			answer: choose(rng, texOpt(kj(formed), String(formed)), [k * hx.energy, broken, Math.abs(net), hx.energy, 2 * hx.energy].map((x) => texOpt(kj(x), String(x)))),
			params: { case: kind, X, k },
		};
	}
	const label = (cede: boolean, x: number) => textOpt(`${cede ? 'Cede' : 'Assorbe'} $${kj(x)}$`, `${cede ? 'cede' : 'assorbe'}:${x}`);
	const half = Math.abs(k * hx.energy - broken); // with the 2 of 2 HX forgotten the reaction seems to absorb
	return {
		prompt: "Fai il bilancio dell'energia.",
		problem: textBlock(`${start} ${data} Nel complesso la reazione cede energia o la assorbe? Quanta?`),
		solution: tx(`Cede $${kj(net)}$`),
		steps: [stepBroken, stepFormed, textBlock(`L'energia ceduta supera quella assorbita: la reazione cede $${formed} - ${broken} = ${kj(net)}$.`)],
		answer: choose(rng, label(true, net), [label(false, net), label(false, half), label(true, formed + broken), label(true, half)]),
		params: { case: kind, X, k },
	};
}

// ---------------------------------------------------------------------------
// Level 5: how many electrons to the octet

export const LOSERS = ['Li', 'Na', 'K', 'Rb', 'Be', 'Mg', 'Ca', 'Sr', 'Al'];
export const GAINERS = ['N', 'P', 'O', 'S', 'Se', 'F', 'Cl', 'Br', 'I'];
/** The noble gas an element reaches: the one before it (for those that lose electrons) or after it. */
const NOBLE: { z: number; nome: string }[] = [
	{ z: 2, nome: 'elio' },
	{ z: 10, nome: 'neon' },
	{ z: 18, nome: 'argon' },
	{ z: 36, nome: 'kripton' },
	{ z: 54, nome: 'xeno' },
];

function level5(rng: Rng): BuiltE {
	const lose = rng.next() < 0.5;
	const e = el(rng.pick(lose ? LOSERS : GAINERS));
	const v = valence(e);
	const n = lose ? v : 8 - v;
	const gas = NOBLE.find((g) => g.z === (lose ? e.z - v : e.z + n));
	if (!gas) throw new Error('no noble gas');
	const question = lose
		? `${cap(art(e.nome))} è nel gruppo $${e.group}$. Quanti elettroni deve cedere un suo atomo per restare con il livello più esterno completo?`
		: `${cap(art(e.nome))} è nel gruppo $${e.group}$. Quanti elettroni deve acquistare un suo atomo per completare l'ottetto?`;
	return {
		prompt: 'Scrivi il numero di elettroni.',
		problem: textBlock(question),
		solution: String(n),
		steps: [
			textBlock(`${cap(art(e.nome))}, nel gruppo $${e.group}$, ha $${v}$ ${v === 1 ? 'elettrone' : 'elettroni'} di valenza.`),
			textBlock(lose ? `Cedendoli tutti resta con il livello sottostante completo, come ${art(gas.nome)}: ne cede $${n}$.` : `Per arrivare a $8$ gliene mancano $8 - ${v} = ${n}$: acquistandoli ha la configurazione ${di(gas.nome)}.`),
		],
		// the other count (valence against what is missing); the full octet; the unit digit of the group; neighbours
		numbers: [n, 8 - n, 8, e.group % 10, n + 1, n === 1 ? 7 : n - 1, 4, 5],
		params: { case: lose ? 'cede' : 'acquista', el: e.sym },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the ion and the noble gas

const ion = (sym: string, q: number) => `\\mathrm{${sym}^{${Math.abs(q) === 1 ? '' : Math.abs(q)}${q > 0 ? '+' : '-'}}}`;

function level6(rng: Rng): BuiltE {
	const lose = rng.next() < 0.5;
	const e = el(rng.pick(lose ? LOSERS : GAINERS));
	const v = valence(e);
	const q = lose ? v : -(8 - v);
	const i = NOBLE.findIndex((g) => g.z === e.z - q);
	if (i < 0) throw new Error('no noble gas');
	const gas = NOBLE[i];
	// the noble gas on the other side: the next one for those that lose electrons, the one before for those that gain
	const other = NOBLE[lose ? i + 1 : i - 1];
	if (!other) throw new Error('no other noble gas');
	const label = (charge: number, g: { nome: string }) => textOpt(`$${ion(e.sym, charge)}$, come ${art(g.nome)}`, `${charge}:${g.nome}`);
	return {
		prompt: 'Scegli lo ione e il gas nobile.',
		problem: textBlock(`${cap(art(e.nome))} è nel gruppo $${e.group}$. Quale ione forma per avere il livello più esterno completo, e quale gas nobile ha la stessa configurazione elettronica?`),
		solution: tx(`$${ion(e.sym, q)}$, come ${art(gas.nome)}`),
		steps: [
			textBlock(`${cap(art(e.nome))} ha $${v}$ ${v === 1 ? 'elettrone' : 'elettroni'} di valenza: ${lose ? `ne cede $${v}$` : `ne acquista $8 - ${v} = ${-q}$`} e diventa $${ion(e.sym, q)}$.`),
			textBlock(`Lo ione ha $${e.z} ${lose ? '-' : '+'} ${Math.abs(q)} = ${e.z - q}$ elettroni, come ${art(gas.nome)}.`),
		],
		// the right ion with the gas on the other side; the charge with the wrong sign, with either gas
		answer: choose(rng, label(q, gas), [label(q, other), label(-q, gas), label(-q, other)]),
		params: { case: lose ? 'catione' : 'anione', el: e.sym },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => BuiltE> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

export const chimRegolaOttetto: Generator = {
	id: ID,
	title: "Energia di legame e regola dell'ottetto",
	levels: {
		1: { label: 'Energia e stabilità', constraints: ['fatti della lezione: curva, energia e lunghezza di legame, gas nobili'] },
		2: { label: 'Confrontare i legami in tabella', constraints: ['quattro legami con valori diversi, il più forte, debole, corto o lungo'] },
		3: { label: "L'energia per rompere i legami", constraints: ['moli per energia di legame, risultato intero tra 100 e 999 kJ'] },
		4: { label: "Il bilancio di energia di una reazione", constraints: ['H2 + X2 → 2 HX, legami rotti, formati, bilancio'] },
		5: { label: "Quanti elettroni per l'ottetto", constraints: ['gruppi 1, 2, 13 cedono; gruppi 15, 16, 17 acquistano; numero intero'] },
		6: { label: 'Lo ione e il gas nobile', constraints: ['ione con la carica giusta e gas nobile con la stessa configurazione'] },
	},
	generate: generateE(ID, LEVELS),
	check: checkE,
	toChoice: toChoiceE,
};

export default chimRegolaOttetto;
