/**
 * La molecola d'acqua e il legame a idrogeno. Spec: specs/exercises/chim-acqua-molecola.md
 *
 * Five levels from the lesson (docs/lezioni/chimica/riscritte/44-chim-acqua-molecola.md), each one step harder: the
 * mass of hydrogen or oxygen in a mass of water; the mass of water that holds a mass of hydrogen or oxygen; the shape
 * and the polarity of the molecule (a pool of questions); which substance forms hydrogen bonds between its molecules
 * (or which one does not), from generated lists; what breaks or forms when water changes state or decomposes.
 * Masses with three significant figures, from the lesson's atomic masses (H 1,01, O 16,00, water 18,02 g/mol).
 * Distractors from the lesson's warnings: one hydrogen instead of two, counting atoms instead of masses, the
 * direct formula for the inverse question, the covalent bonds broken on boiling.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, ambiguous, checkCommon, choose, generateWith, pq, rOpt, rq, say, sig, sigOpts, t, textBlock, textOpt } from '../chim-acqua';

export const ID = 'chim-acqua-molecola';

const H = 1.01, O = 16.0, M = 18.02;
const MH2 = 2.02;

/** A mass of three significant figures, 101-999 g without a final zero. */
function mass3(rng: Rng): string {
	for (;;) {
		const k = rng.int(101, 999);
		if (k % 10) return String(k);
	}
}

// ---------------------------------------------------------------------------
// Level 1: hydrogen or oxygen in a mass of water

function level1(rng: Rng): Built {
	const askH = rng.next() < 0.5;
	const m = mass3(rng);
	const mw = Number(m);
	const exact = askH ? (mw * MH2) / M : (mw * O) / M;
	const ans = sig(exact, 3);
	if (!ans || ambiguous(ans)) throw new Error('tie or final zero');
	const el = askH ? 'idrogeno' : 'ossigeno';
	const mistakes = askH
		? [(mw * H) / M, (mw * 2) / 3, (mw * O) / M] // one hydrogen; atoms counted (2 of 3); the oxygen
		: [(mw * MH2) / M, mw / 3, (mw * O) / (O + H)]; // the hydrogen; one atom of three; one hydrogen in the formula
	return {
		prompt: `Trova la massa di ${el}.`,
		problem: textBlock(`Quanti grammi di ${el} ci sono in ${pq(m, 'g')} d'acqua? Masse atomiche: $\\mathrm{H} = 1{,}01$, $\\mathrm{O} = 16{,}00$.`),
		solution: `m(\\mathrm{${askH ? 'H' : 'O'}}) \\approx ${rq(ans, 'g')}`,
		steps: [
			say(`Una mole d'acqua, $18{,}02\\,\\text{g}$, contiene ${askH ? 'due moli di idrogeno, $2{,}02\\,\\text{g}$' : 'una mole di ossigeno, $16{,}00\\,\\text{g}$'}: la frazione in massa è sempre la stessa.`),
			`m(\\mathrm{${askH ? 'H' : 'O'}}) = ${m}\\,\\text{g} \\cdot \\dfrac{${askH ? '2{,}02' : '16{,}00'}}{18{,}02} = ${exact.toFixed(3).replace('.', '{,}')}\\ldots\\,\\text{g} \\approx ${rq(ans, 'g')}`,
		],
		answer: choose(rng, rOpt(ans, 'g'), [...sigOpts(mistakes, 3, 'g'), ...sigOpts([exact * 1.2, exact * 0.8, exact * 1.5], 3, 'g')]),
		params: { case: askH ? 'idrogeno' : 'ossigeno', m },
	};
}

// ---------------------------------------------------------------------------
// Level 2: the water that holds a mass of hydrogen or oxygen

function level2(rng: Rng): Built {
	const fromH = rng.next() < 0.5;
	for (;;) {
		const xs = fromH ? String(rng.int(11, 99)) : mass3(rng); // hydrogen 11-99 g (two figures), oxygen 101-999 g
		if (Number(xs) % 10 === 0) continue;
		const mx = Number(xs);
		const exact = fromH ? (mx * M) / MH2 : (mx * M) / O;
		const n = fromH ? 2 : 3;
		const ans = sig(exact, n);
		if (!ans || ambiguous(ans)) continue;
		const el = fromH ? 'idrogeno' : 'ossigeno';
		const mistakes = fromH
			? [(mx * MH2) / M, (mx * M) / H, (mx * 3) / 2] // the direct formula; one hydrogen; atoms counted (2 of 3)
			: [(mx * O) / M, (mx * (O + H)) / O, mx * 3]; // the direct formula; one hydrogen; atoms counted (1 of 3)
		return {
			prompt: "Trova la massa dell'acqua.",
			problem: textBlock(`Quanti grammi d'acqua contengono ${pq(xs, 'g')} di ${el}? Masse atomiche: $\\mathrm{H} = 1{,}01$, $\\mathrm{O} = 16{,}00$.`),
			solution: `m(\\mathrm{H_2O}) \\approx ${rq(ans, 'g')}`,
			steps: [
				say(`In $18{,}02\\,\\text{g}$ d'acqua ci sono ${fromH ? '$2{,}02\\,\\text{g}$ di idrogeno' : '$16{,}00\\,\\text{g}$ di ossigeno'}: l'acqua è ${fromH ? '$18{,}02/2{,}02$' : '$18{,}02/16{,}00$'} volte la massa dell'${el}.`),
				`m(\\mathrm{H_2O}) = ${xs}\\,\\text{g} \\cdot \\dfrac{18{,}02}{${fromH ? '2{,}02' : '16{,}00'}} = ${exact.toFixed(2).replace('.', '{,}')}\\ldots\\,\\text{g} \\approx ${rq(ans, 'g')}`,
				say(`Il risultato ha ${n === 2 ? 'due' : 'tre'} cifre significative, come la massa di ${el} del testo.`),
			],
			answer: choose(rng, rOpt(ans, 'g'), [...sigOpts(mistakes, n, 'g'), ...sigOpts([exact * 1.2, exact * 0.8, exact * 1.5], n, 'g')]),
			params: { case: fromH ? 'da idrogeno' : 'da ossigeno', x: xs },
		};
	}
}

// ---------------------------------------------------------------------------
// Level 3: shape and polarity

type Q = { key: string; ask: string; right: string; wrong: string[]; why: string };
export const SHAPE: Q[] = [
	{ key: 'angolo', ask: "Quanto vale l'angolo tra i due legami O-H della molecola d'acqua?", right: '$104{,}5^\\circ$', wrong: ['$180^\\circ$', '$90^\\circ$', '$120^\\circ$', '$109{,}5^\\circ$'], why: "La molecola è piegata: l'angolo H-O-H è di circa $104{,}5^\\circ$." },
	{ key: 'forma', ask: "Che forma ha la molecola d'acqua?", right: 'piegata, a V', wrong: ['lineare', 'triangolare piana', 'tetraedrica'], why: "I due idrogeni stanno dalla stessa parte dell'ossigeno: la molecola è piegata." },
	{ key: 'carica', ask: "Quale parte della molecola d'acqua ha la carica parziale negativa?", right: "l'ossigeno", wrong: ['i due idrogeni', 'nessuna: la molecola è neutra', 'uno solo dei due idrogeni'], why: "L'ossigeno attira gli elettroni dei legami: ha la carica parziale $\\delta^-$." },
	{ key: 'coppie', ask: "Quante coppie solitarie ha l'ossigeno nella molecola d'acqua?", right: 'due', wrong: ['nessuna', 'una', 'quattro'], why: "Dei sei elettroni esterni dell'ossigeno, due sono nei legami e quattro formano due coppie solitarie." },
	{ key: 'polare', ask: "Perché la molecola d'acqua è polare?", right: "è piegata, e l'ossigeno attira gli elettroni dei legami", wrong: ["è lineare, e l'ossigeno attira gli elettroni dei legami", 'ha un elettrone in più, e quindi una carica negativa', 'è fatta di ioni $\\mathrm{H^+}$ e $\\mathrm{O^{2-}}$'], why: "L'ossigeno attira gli elettroni, e la forma piegata fa sì che le cariche parziali non si compensino." },
	{ key: 'co2', ask: "Perché l'anidride carbonica, $\\mathrm{CO_2}$, è apolare anche se l'ossigeno attira gli elettroni?", right: 'è lineare: gli effetti dei due ossigeni si annullano', wrong: ["è piegata come l'acqua", 'il carbonio non ha elettroni nei legami', 'i suoi legami sono ionici'], why: 'I due ossigeni tirano in direzioni opposte: nella molecola lineare gli effetti si annullano.' },
	{ key: 'neutra', ask: "Quanto vale la carica totale di una molecola d'acqua?", right: 'zero: le cariche parziali si compensano', wrong: ["è negativa, per l'ossigeno", 'è positiva, per i due idrogeni', 'vale due cariche negative'], why: 'Una molecola polare è neutra: le cariche parziali positive e negative si sommano a zero.' },
	{ key: 'filo', ask: 'Un filo sottile d\'acqua si piega verso un palloncino strofinato sui capelli. Che cosa lo spiega?', right: "le molecole d'acqua sono polari", wrong: ["le molecole d'acqua hanno una carica totale negativa", "l'acqua conduce la corrente come un metallo", "il palloncino attira l'aria intorno all'acqua"], why: 'Le molecole polari girano verso il palloncino il lato di carica opposta, e ne sono attirate.' },
];

function level3(rng: Rng): Built {
	const k = rng.int(0, SHAPE.length - 1);
	const s = SHAPE[k];
	const wrong = [...s.wrong];
	for (let i = wrong.length - 1; i > 0; i--) {
		const j = rng.int(0, i);
		[wrong[i], wrong[j]] = [wrong[j], wrong[i]];
	}
	return {
		prompt: 'Scegli la risposta giusta.',
		problem: textBlock(s.ask),
		solution: t(s.right),
		steps: [say(s.why)],
		answer: choose(rng, textOpt(s.right, s.key), wrong.map((w) => textOpt(w, `${s.key}-no${s.wrong.indexOf(w)}`))),
		params: { case: s.key },
	};
}

// ---------------------------------------------------------------------------
// Level 4: which substance forms hydrogen bonds

export const WITH = [
	{ nome: 'acqua', f: '\\mathrm{H_2O}' },
	{ nome: 'ammoniaca', f: '\\mathrm{NH_3}' },
	{ nome: 'fluoruro di idrogeno', f: '\\mathrm{HF}' },
	{ nome: 'metanolo', f: '\\mathrm{CH_3OH}' },
	{ nome: 'etanolo', f: '\\mathrm{C_2H_5OH}' },
];
export const WITHOUT = [
	{ nome: 'metano', f: '\\mathrm{CH_4}' },
	{ nome: 'solfuro di idrogeno', f: '\\mathrm{H_2S}' },
	{ nome: 'anidride carbonica', f: '\\mathrm{CO_2}' },
	{ nome: 'ossigeno', f: '\\mathrm{O_2}' },
	{ nome: 'azoto', f: '\\mathrm{N_2}' },
	{ nome: 'idrogeno', f: '\\mathrm{H_2}' },
	{ nome: 'etano', f: '\\mathrm{C_2H_6}' },
];

function level4(rng: Rng): Built {
	const forms = rng.next() < 0.5;
	const pickK = <T,>(xs: T[], k: number) => {
		const c = [...xs];
		for (let i = c.length - 1; i > 0; i--) {
			const j = rng.int(0, i);
			[c[i], c[j]] = [c[j], c[i]];
		}
		return c.slice(0, k);
	};
	const [right] = pickK(forms ? WITH : WITHOUT, 1);
	const others = pickK(forms ? WITHOUT : WITH, 3);
	const lab = (s: { nome: string; f: string }) => `${s.nome}, $${s.f}$`;
	const whyRight = forms
		? `In $${right.f}$ l'idrogeno è legato a un atomo di ${right.f.includes('N') ? 'azoto' : right.f.includes('F') ? 'fluoro' : 'ossigeno'}, piccolo e molto elettronegativo: le molecole formano legami a idrogeno.`
		: `In $${right.f}$ ${right.f.includes('H') ? "l'idrogeno non è legato a ossigeno, azoto o fluoro" : 'non ci sono atomi di idrogeno'}: niente legami a idrogeno.`;
	return {
		prompt: forms ? 'Scegli la sostanza che forma legami a idrogeno.' : 'Scegli la sostanza che non forma legami a idrogeno.',
		problem: textBlock(forms ? 'Quale di queste sostanze forma legami a idrogeno tra le sue molecole?' : 'Tre di queste sostanze formano legami a idrogeno tra le loro molecole. Quale non ne forma?'),
		solution: t(`${right.nome}`),
		steps: [say('Il legame a idrogeno si forma quando un idrogeno è legato a ossigeno, azoto o fluoro.'), say(whyRight)],
		answer: choose(rng, textOpt(lab(right), right.nome), others.map((o) => textOpt(lab(o), o.nome))),
		params: { case: forms ? 'forma' : 'non forma', right: right.nome },
	};
}

// ---------------------------------------------------------------------------
// Level 5: what breaks, what forms

export const OUTCOMES = {
	rotti: 'si rompono legami a idrogeno tra le molecole, che restano intere',
	formati: 'si formano legami a idrogeno tra le molecole, che restano intere',
	covalenti: 'si rompono i legami covalenti O-H: le molecole si spezzano',
	nessuno: 'non si rompe e non si forma nessun legame',
} as const;
export type Outcome = keyof typeof OUTCOMES;
export const PROCESSES: { story: string; out: Outcome; why: string }[] = [
	{ story: 'Un cubetto di ghiaccio fonde nel bicchiere.', out: 'rotti', why: 'Nella fusione una parte dei legami a idrogeno del ghiaccio si rompe, e le molecole si muovono.' },
	{ story: "L'acqua bolle in una pentola sul fuoco.", out: 'rotti', why: 'Per passare allo stato di vapore le molecole si separano: si rompono i legami a idrogeno, il vapore è ancora acqua.' },
	{ story: 'Il sudore evapora dalla pelle.', out: 'rotti', why: "Evaporando le molecole d'acqua si staccano dalle altre: si rompono i legami a idrogeno." },
	{ story: 'In una giornata di sole la brina sui campi diventa vapore senza fondere.', out: 'rotti', why: 'Nella sublimazione le molecole del ghiaccio si separano: si rompono i legami a idrogeno.' },
	{ story: 'Il vapore della doccia si condensa in goccioline sullo specchio freddo.', out: 'formati', why: 'Condensando le molecole si avvicinano e si legano tra loro: si formano legami a idrogeno.' },
	{ story: "L'acqua di un cubetto nel congelatore diventa ghiaccio.", out: 'formati', why: 'Solidificando le molecole si fermano nella rete del ghiaccio, con quattro legami a idrogeno ciascuna.' },
	{ story: "Con la corrente elettrica l'acqua si decompone in idrogeno e ossigeno.", out: 'covalenti', why: "Si formano sostanze nuove: le molecole d'acqua si spezzano, e si rompono i legami covalenti O-H." },
];

function level5(rng: Rng): Built {
	const k = rng.int(0, PROCESSES.length - 1);
	const p = PROCESSES[k];
	const keys = Object.keys(OUTCOMES) as Outcome[];
	return {
		prompt: 'Scegli che cosa succede ai legami.',
		problem: textBlock(`${p.story} Che cosa succede ai legami?`),
		solution: t(OUTCOMES[p.out]),
		steps: [say(p.why)],
		answer: choose(rng, textOpt(OUTCOMES[p.out], p.out), keys.filter((x) => x !== p.out).map((x) => textOpt(OUTCOMES[x], x))),
		params: { case: p.out, story: k },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return checkCommon(sample);
}

export const chimAcquaMolecola: Generator = {
	id: ID,
	title: "La molecola d'acqua e il legame a idrogeno",
	levels: {
		1: { label: 'La composizione', constraints: ["idrogeno o ossigeno in una massa d'acqua", 'tre cifre significative'] },
		2: { label: "L'acqua dal suo elemento", constraints: ["la massa d'acqua che contiene una massa di idrogeno o di ossigeno"] },
		3: { label: 'Forma e polarità', constraints: ['angolo, forma, cariche parziali, coppie solitarie, polarità'] },
		4: { label: 'Chi forma legami a idrogeno', constraints: ['una sostanza su quattro, che forma o non forma legami a idrogeno'] },
		5: { label: 'Che cosa si rompe', constraints: ['passaggi di stato e decomposizione'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default chimAcquaMolecola;
