/**
 * Affinità elettronica ed elettronegatività. Spec: specs/exercises/chim-affinita-elettronegativita.md
 *
 * Six levels from the lesson (docs/lezioni/chimica/riscritte/60-chim-affinita-elettronegativita.md), each one step
 * harder: what the two quantities are (facts of the lesson); the electron affinity in the table (who releases most
 * energy, who releases none); the electronegativity along a period or down a group; which atom of a bond takes the
 * partial negative charge; the difference of electronegativity; four bonds compared by their difference. Pauling
 * values from the site's periodic table, electron affinities from the lesson (chim3-d.ts).
 */
import type { Generator, Rng } from '../types';
import {
	type Built, type El, AFFINITY, EL, KJ, ORD, again, art, cap, checkSample, choose, di, generateWith, hundredths, numTex, pickRow, shuffle, su, symOpts, symTex, t, texOpt, textBlock, textOpt, toChoice,
} from '../chim3-d';

export const ID = 'chim-affinita-elettronegativita';

// ---------------------------------------------------------------------------
// Level 1: facts

export const FACTS: { q: string; a: string; wrong: string[]; why: string }[] = [
	{ q: "Che cosa misura l'affinità elettronica?", a: "L'energia liberata da un atomo che acquista un elettrone", wrong: ["L'energia per togliere un elettrone a un atomo", "La tendenza ad attirare gli elettroni di un legame", "La carica dell'atomo"], why: "L'affinità elettronica è l'energia che un atomo isolato, allo stato gassoso, libera quando acquista un elettrone." },
	{ q: "Che cosa misura l'elettronegatività?", a: 'La tendenza ad attirare gli elettroni di un legame', wrong: ["L'energia liberata da un atomo che acquista un elettrone", "L'energia per togliere un elettrone a un atomo", "La carica negativa dell'atomo"], why: "L'elettronegatività misura la tendenza di un atomo ad attirare verso di sé gli elettroni di un legame." },
	{ q: "In che unità si misura l'affinità elettronica?", a: 'In kJ/mol', wrong: ['In picometri', 'In nessuna: è un numero puro', 'In coulomb'], why: "È un'energia riferita a una mole di atomi: si misura in kJ/mol, come l'energia di ionizzazione." },
	{ q: "In che unità si misura l'elettronegatività?", a: 'In nessuna: è un numero puro', wrong: ['In kJ/mol', 'In picometri', 'In coulomb'], why: "L'elettronegatività è un numero senza unità, assegnato su una scala." },
	{ q: "Quale processo descrive l'affinità elettronica?", a: '$\\mathrm{X} + e^- \\to \\mathrm{X^-}$', wrong: ['$\\mathrm{X} \\to \\mathrm{X^+} + e^-$', '$\\mathrm{X^+} \\to \\mathrm{X^{2+}} + e^-$', '$\\mathrm{X^-} \\to \\mathrm{X} + e^-$'], why: "L'atomo acquista un elettrone e diventa uno ione negativo. Il processo $\\mathrm{X} \\to \\mathrm{X^+} + e^-$ è la ionizzazione." },
	{ q: 'Qual è la scala di elettronegatività più usata?', a: 'La scala di Pauling', wrong: ['La scala di Mendeleev', 'La scala di Bohr', 'La scala di Moseley'], why: 'La scala più usata è quella proposta da Linus Pauling nel 1932.' },
	{ q: "Qual è l'elemento più elettronegativo?", a: 'Il fluoro', wrong: ['Il cloro', "L'ossigeno", 'Il cesio'], why: 'Il fluoro, in alto a destra nella tavola, ha il valore più alto: $3{,}98$.' },
	{ q: "Quale elemento ha l'affinità elettronica più alta?", a: 'Il cloro', wrong: ['Il fluoro', "L'ossigeno", 'Il sodio'], why: 'Il cloro, $349\\,\\text{kJ/mol}$. Il fluoro ne libera $328$: nel suo atomo, più piccolo, l\'elettrone in più è respinto con forza dagli altri.' },
	{ q: 'Quale gruppo della tavola ha le affinità elettroniche più alte?', a: 'Il gruppo 17, gli alogeni', wrong: ['Il gruppo 1, i metalli alcalini', 'Il gruppo 18, i gas nobili', 'Il gruppo 2'], why: 'Agli alogeni manca un elettrone per completare il livello esterno: acquistandolo liberano molta energia.' },
	{ q: 'Perché un gas nobile non libera energia acquistando un elettrone?', a: 'Ha il livello esterno pieno', wrong: ['Ha pochi protoni', 'È troppo elettronegativo', 'Ha un solo elettrone esterno'], why: "Il livello esterno è completo: l'elettrone in più dovrebbe andare in un livello nuovo, più lontano, e non resta legato." },
	{ q: "Come cambia l'elettronegatività lungo un periodo, da sinistra a destra?", a: 'Aumenta', wrong: ['Diminuisce', 'Resta uguale', 'Prima aumenta, poi diminuisce'], why: 'Lungo un periodo $Z_{eff}$ cresce e l\'atomo è più piccolo: gli elettroni di legame sono attirati di più.' },
	{ q: "Come cambia l'elettronegatività scendendo lungo un gruppo?", a: 'Diminuisce', wrong: ['Aumenta', 'Resta uguale', 'Prima diminuisce, poi aumenta'], why: "Scendendo l'atomo è più grande, e gli elettroni di legame restano più lontani dal nucleo." },
	{ q: 'In quale zona della tavola stanno gli elementi più elettronegativi?', a: 'In alto a destra', wrong: ['In basso a sinistra', 'In alto a sinistra', 'In basso a destra'], why: "L'elettronegatività cresce verso destra e verso l'alto: i valori più alti sono di fluoro, ossigeno, cloro e azoto." },
	{ q: 'Come sono energia di ionizzazione e affinità elettronica nei metalli?', a: 'Tutte e due basse', wrong: ['Tutte e due alte', 'La prima alta, la seconda bassa', 'La prima bassa, la seconda alta'], why: 'Un metallo perde un elettrone con poca spesa e guadagna poco ad acquistarne uno: tende a diventare uno ione positivo.' },
	{ q: 'In un legame tra due atomi diversi, quale atomo prende la carica parziale $\\delta^-$?', a: 'Il più elettronegativo', wrong: ['Il meno elettronegativo', 'Il più grande', 'Quello con meno protoni'], why: "L'atomo più elettronegativo attira verso di sé gli elettroni condivisi, e si ritrova con un po' di carica negativa in più." },
	{ q: 'Come si calcola la differenza di elettronegatività $\\Delta\\chi$?', a: 'Il valore maggiore meno il minore', wrong: ['La somma dei due valori', 'La media dei due valori', 'Il valore minore meno il maggiore'], why: 'Si toglie il valore più piccolo dal più grande: $\\Delta\\chi$ è sempre positiva o nulla.' },
];

function level1(rng: Rng): Built {
	const k = rng.int(0, FACTS.length - 1);
	const f = FACTS[k];
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(f.q),
		solution: textOpt(f.a).latex,
		steps: [textBlock(f.why)],
		answer: choose(rng, textOpt(f.a), f.wrong.map((x) => textOpt(x))),
		params: { case: 'fatto', k },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the electron affinity in the table

const HALOGENS = ['F', 'Cl', 'Br', 'I'];
/** Low or no electron affinity: at most 60 kJ/mol. */
const LOW = ['Li', 'Na', 'K', 'Be', 'Mg', 'Ne', 'Ar', 'B', 'Al', 'N'];
const NONE = ['Be', 'Mg', 'N', 'Ne', 'Ar'];
const SOME = ['Li', 'Na', 'K', 'B', 'C', 'Si', 'O', 'S', 'F', 'Cl', 'Br', 'I', 'Al', 'P'];
const WHY_NONE: Record<string, string> = {
	Be: "ha il sottolivello $2s$ pieno, e l'elettrone in più dovrebbe cominciare il $2p$",
	Mg: "ha il sottolivello $3s$ pieno, e l'elettrone in più dovrebbe cominciare il $3p$",
	N: "ha i tre orbitali $2p$ occupati da un elettrone ciascuno, e l'elettrone in più dovrebbe entrare in un orbitale già occupato",
	Ne: "è un gas nobile: ha il livello esterno pieno, e l'elettrone in più dovrebbe andare in un livello nuovo",
	Ar: "è un gas nobile: ha il livello esterno pieno, e l'elettrone in più dovrebbe andare in un livello nuovo",
};

function level2(rng: Rng): Built {
	const u = rng.next();
	if (u < 0.4) {
		const right = EL[rng.pick(NONE)];
		const others = shuffle(rng, SOME).slice(0, 3).map((s) => EL[s]);
		const [r, o] = symOpts(right, others);
		return {
			prompt: 'Confronta le affinità elettroniche.',
			problem: textBlock('Quale di questi elementi non libera energia quando un suo atomo acquista un elettrone?'),
			solution: symTex(right.sym),
			steps: [textBlock(`${cap(art(right.nome))} ${WHY_NONE[right.sym]}: lo ione negativo non è stabile.`), textBlock(`Gli altri tre liberano energia: ${others.map((e) => `$${AFFINITY[e.sym]}${KJ}$ ${art(e.nome)}`).join(', ')}.`)],
			answer: choose(rng, r, o),
			params: { case: 'nessuna', sym: right.sym },
		};
	}
	const both = u < 0.55;
	const right = EL[both ? 'Cl' : rng.pick(HALOGENS)];
	const others = [...(both ? ['F'] : []), ...shuffle(rng, LOW).slice(0, both ? 2 : 3)].map((s) => EL[s]);
	const [r, o] = symOpts(right, shuffle(rng, others));
	return {
		prompt: 'Confronta le affinità elettroniche.',
		problem: textBlock('Quale di questi elementi libera più energia quando un suo atomo acquista un elettrone?'),
		solution: symTex(right.sym),
		steps: [
			textBlock(`Le affinità elettroniche più alte sono quelle degli alogeni, nel gruppo $17$: con un elettrone in più completano il livello esterno. ${cap(art(right.nome))} libera $${AFFINITY[right.sym]}${KJ}$.`),
			...(both ? [textBlock("Il fluoro è un alogeno anche lui, ma libera meno energia del cloro, $328\\,\\text{kJ/mol}$: nel suo atomo, più piccolo, l'elettrone in più è respinto con forza dagli altri.")] : []),
		],
		answer: choose(rng, r, o),
		params: { case: both ? 'cloro-fluoro' : 'massima', sym: right.sym },
	};
}

// ---------------------------------------------------------------------------
// Level 3: the electronegativity along a period or down a group

function level3(rng: Rng): Built {
	const { mode, which, els } = pickRow(rng, {
		// in hundredths, so that the steps are compared exactly
		prop: (e) => (e.chi === null ? null : Math.round(e.chi * 100)),
		periods: [2, 3, 4],
		groupsInPeriod: [1, 2, 13, 14, 15, 16, 17],
		groups: [1, 2, 16, 17],
		periodsInGroup: (g) => (g <= 2 ? [2, 3, 4, 5, 6] : [2, 3, 4, 5]),
		gap: 3,
	});
	const most = rng.next() < 0.5;
	const sorted = [...els].sort((a, b) => a.chi! - b.chi!);
	const right = most ? sorted[3] : sorted[0];
	// rising along a period, falling down a group
	if ((mode === 'periodo' ? els[3] : els[0]) !== sorted[3]) return again();
	const first = right === els[0];
	const place = mode === 'periodo' ? (first ? 'più a sinistra' : 'più a destra') : first ? 'più in alto' : 'più in basso';
	const pos = mode === 'periodo' ? `nel gruppo $${right.group}$` : `nel ${ORD[right.period]} periodo`;
	const [r, others] = symOpts(right, shuffle(rng, els.filter((e) => e !== right)));
	return {
		prompt: 'Confronta le elettronegatività.',
		problem: textBlock(`Quale di questi elementi ${mode === 'periodo' ? `del ${ORD[which]} periodo` : `del gruppo $${which}$`} è il ${most ? 'più' : 'meno'} elettronegativo?`),
		solution: symTex(right.sym),
		steps: [
			textBlock(mode === 'periodo' ? "Lungo un periodo l'elettronegatività aumenta da sinistra a destra: $Z_{eff}$ cresce e l'atomo è più piccolo." : "Lungo un gruppo l'elettronegatività diminuisce scendendo: gli elettroni di legame restano più lontani dal nucleo."),
			textBlock(`L'elemento ${place} dei quattro è ${art(right.nome)}, ${pos}: è il ${most ? 'più' : 'meno'} elettronegativo, $\\chi = ${numTex(right.chi!, 2)}$.`),
		],
		answer: choose(rng, r, others),
		params: { case: mode, which, ask: most ? 'max' : 'min' },
	};
}

// ---------------------------------------------------------------------------
// Levels 4 and 5: one bond

/** Pairs of elements that do bond to each other, with different electronegativities. */
const BONDS: [string, string][] = [
	['H', 'F'], ['H', 'Cl'], ['H', 'Br'], ['H', 'I'], ['H', 'O'], ['H', 'N'], ['H', 'C'], ['H', 'S'], ['C', 'O'], ['C', 'N'], ['C', 'Cl'], ['C', 'F'], ['C', 'S'], ['N', 'O'],
	['Si', 'O'], ['P', 'Cl'], ['S', 'O'], ['Na', 'Cl'], ['K', 'Br'], ['Li', 'F'], ['Mg', 'O'], ['Ca', 'O'], ['Al', 'Cl'], ['B', 'F'], ['C', 'Br'], ['P', 'O'], ['Si', 'Cl'], ['N', 'F'],
	['O', 'F'], ['I', 'Cl'], ['Br', 'Cl'], ['Na', 'H'], ['Si', 'H'], ['B', 'H'], ['N', 'Cl'], ['S', 'Cl'], ['K', 'Cl'], ['Na', 'F'], ['Li', 'H'], ['Ca', 'Cl'],
];
const chiTex = (e: El) => numTex(e.chi!, 2);
const h = (e: El) => Math.round(e.chi! * 100);

function bond(rng: Rng): [El, El] {
	const [x, y] = rng.pick(BONDS);
	return rng.next() < 0.5 ? [EL[x], EL[y]] : [EL[y], EL[x]];
}
const between = (a: El, b: El) => `Nel legame tra ${a.nome} ($\\chi = ${chiTex(a)}$) e ${b.nome} ($\\chi = ${chiTex(b)}$)`;

function level4(rng: Rng): Built {
	const [a, b] = bond(rng);
	const [hi, lo] = a.chi! > b.chi! ? [a, b] : [b, a];
	const opt = (e: El, word: 'più' | 'meno') => textOpt(`${cap(su(e.nome))}, che è ${word} elettronegativo`, `${e.sym}:${word}`);
	return {
		prompt: 'Trova la carica parziale.',
		problem: textBlock(`${between(a, b)}, su quale atomo sta la carica parziale $\\delta^-$?`),
		solution: t(cap(su(hi.nome))),
		steps: [
			textBlock(`L'elettronegatività maggiore è quella ${di(hi.nome)}: $${chiTex(hi)} > ${chiTex(lo)}$.`),
			textBlock(`L'atomo più elettronegativo attira verso di sé gli elettroni del legame: la carica $\\delta^-$ sta ${su(hi.nome)}, la $\\delta^+$ ${su(lo.nome)}.`),
		],
		// the larger value read on the wrong atom; the negative charge put on the less electronegative atom, with the
		// values read right or wrong
		answer: choose(rng, opt(hi, 'più'), [opt(lo, 'più'), opt(lo, 'meno'), opt(hi, 'meno')]),
		params: { case: 'carica', a: a.sym, b: b.sym },
	};
}

function level5(rng: Rng): Built {
	const [a, b] = bond(rng);
	const [hi, lo] = a.chi! > b.chi! ? [a, b] : [b, a];
	const d = h(hi) - h(lo);
	const opt = (k: number) => texOpt(numTex(k / 100, 2), hundredths(k));
	const sum = h(hi) + h(lo);
	return {
		prompt: 'Calcola la differenza di elettronegatività.',
		problem: textBlock(`${between(a, b)}, quanto vale la differenza di elettronegatività $\\Delta\\chi$?`),
		solution: numTex(d / 100, 2),
		steps: [textBlock('Si toglie il valore più piccolo dal più grande.'), `\\Delta\\chi = ${chiTex(hi)} - ${chiTex(lo)} = ${numTex(d / 100, 2)}`],
		// the smaller minus the larger; the sum; the mean (when it has two decimals); the larger value alone
		answer: choose(rng, opt(d), [opt(-d), opt(sum), ...(sum % 2 === 0 ? [opt(sum / 2)] : []), opt(h(hi)), opt(h(lo))]),
		number: hundredths(d),
		params: { case: 'differenza', a: a.sym, b: b.sym },
	};
}

// ---------------------------------------------------------------------------
// Level 6: four bonds compared

const POOL = ['H', 'B', 'C', 'N', 'O', 'F', 'Si', 'P', 'S', 'Cl', 'Br', 'I'];

function level6(rng: Rng): Built {
	const five = shuffle(rng, POOL).slice(0, 5).map((s) => EL[s]).sort((x, y) => x.z - y.z);
	const pairs: [El, El][] = [];
	for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) pairs.push([five[i], five[j]]);
	const four = shuffle(rng, pairs).slice(0, 4);
	const delta = ([x, y]: [El, El]) => Math.abs(h(x) - h(y));
	const sorted = [...four].sort((p, q) => delta(q) - delta(p));
	// one bond clearly ahead of the others, and no two the same
	if (delta(sorted[0]) - delta(sorted[1]) < 10 || new Set(four.map(delta)).size !== 4) return again();
	const used = five.filter((e) => four.some((p) => p.includes(e)));
	const table = `\\begin{array}{${used.map(() => 'c').join('|')}} ${used.map((e) => symTex(e.sym)).join(' & ')} \\\\ \\hline ${used.map(chiTex).join(' & ')} \\end{array}`;
	const opt = ([x, y]: [El, El]) => texOpt(`\\mathrm{${x.sym}{-}${y.sym}}`, `${x.sym}-${y.sym}`);
	const line = (p: [El, El]) => {
		const [hi, lo] = p[0].chi! > p[1].chi! ? p : [p[1], p[0]];
		return `\\mathrm{${p[0].sym}{-}${p[1].sym}}:\\ ${chiTex(hi)} - ${chiTex(lo)} = ${numTex(delta(p) / 100, 2)}`;
	};
	return {
		prompt: 'Confronta i legami.',
		problem: textBlock('In quale di questi legami gli elettroni sono più spostati verso uno dei due atomi? Usa i valori di elettronegatività della tabella.', 46, [table]),
		solution: opt(sorted[0]).latex,
		steps: [textBlock('Gli elettroni sono tanto più spostati quanto più grande è $\\Delta\\chi$. Per i quattro legami:'), ...four.map(line), textBlock(`La differenza più grande è quella del legame $${opt(sorted[0]).latex}$.`)],
		answer: choose(rng, opt(sorted[0]), shuffle(rng, sorted.slice(1)).map(opt)),
		params: { case: 'confronto', bonds: four.map(([x, y]) => `${x.sym}-${y.sym}`) },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6 };

export const chimAffinitaElettronegativita: Generator = {
	id: ID,
	title: 'Affinità elettronica ed elettronegatività',
	levels: {
		1: { label: 'Che cosa misurano', constraints: ['definizioni, unità, processi e primati della lezione'] },
		2: { label: "L'affinità elettronica nella tavola", constraints: ['chi libera più energia, chi non ne libera'] },
		3: { label: "L'elettronegatività nella tavola", constraints: ['quattro elementi di un periodo o di un gruppo'] },
		4: { label: 'La carica parziale in un legame', constraints: ['i due valori sono dati; delta meno sul più elettronegativo'] },
		5: { label: 'La differenza di elettronegatività', constraints: ['il valore maggiore meno il minore, due decimali'] },
		6: { label: 'Legami a confronto', constraints: ['quattro legami, uno con la differenza più grande di almeno 0,10'] },
	},
	generate: generateWith(ID, LEVELS, checkSample),
	check: checkSample,
	toChoice,
};

export default chimAffinitaElettronegativita;
