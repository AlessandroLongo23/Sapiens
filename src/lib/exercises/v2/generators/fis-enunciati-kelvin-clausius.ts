/**
 * Gli enunciati di Kelvin e di Clausius. Spec: specs/exercises/fis-enunciati-kelvin-clausius.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/115-fis-enunciati-kelvin-clausius.md), each one step
 * harder. The first three are questions of reasoning on a generated case, with the same four answers (possible,
 * against the first law, forbidden by Clausius, forbidden by Kelvin): heat between two bodies at given temperatures;
 * heat turned into work (a cyclic machine with one reservoir, one with two, an isothermal expansion, friction, a
 * machine that makes more work than the heat it takes); refrigerators and engines whose balance has to be worked
 * out. The last two are the two halves of the proof that the statements are equivalent, with numbers: a real engine
 * next to a device that breaks Clausius (the heat the hot reservoir gives in all), and an engine that breaks Kelvin
 * driving a real refrigerator (the heat the hot reservoir receives in all). The lesson's order of the checks is
 * followed: first the balance of energy, then the second law.
 */
import type { Generator, Rng, Sample } from '../types';
import { type Built, type Device, INT, checkCommon, checkWords, engine, fmtExact, generateWith, lab, noZero, options, pd, q, scenaMacchine, textBlock, wordChoice, wu } from '../fis-macchine';

export const ID = 'fis-enunciati-kelvin-clausius';

const ANSWERS = [
	{ key: 'possibile', text: 'Sì, è possibile' },
	{ key: 'primo', text: 'No: viola il primo principio' },
	{ key: 'clausius', text: 'No: lo vieta Clausius' },
	{ key: 'kelvin', text: 'No: lo vieta Kelvin' },
] as const;
type Key = (typeof ANSWERS)[number]['key'];
const textOf = (k: Key) => ANSWERS.find((a) => a.key === k)!.text;

const J = (n: number) => pd(q(n), 'J');
const C = (n: number) => pd(q(n), 'C');
const Jl = (n: number) => `${lab(q(n))} J`;

function verdict(rng: Rng, prompt: string, problem: string, right: Key, steps: string[], kind: string, params: Record<string, unknown>): Built {
	return {
		prompt,
		problem: textBlock(problem),
		solution: `\\text{${textOf(right)}}`,
		steps: steps.map((s) => (s.startsWith('$$') ? s.slice(2) : textBlock(s))),
		answer: wordChoice(rng, ANSWERS, right),
		params: { case: kind, ...params },
	};
}

const BALANCE_OK = "Il bilancio dell'energia è in pari: il primo principio è rispettato.";

// ---------------------------------------------------------------------------
// Level 1: heat between two bodies

function level1(rng: Rng): Built {
	const kind = rng.pick(['spontaneo', 'inverso', 'bilancio'] as const);
	let tA = 0, tB = 0;
	while (Math.abs(tA - tB) < 10) {
		tA = rng.int(5, 95);
		tB = rng.int(5, 95);
	}
	const [hot, cold] = tA > tB ? ['A', 'B'] : ['B', 'A'];
	const Q = noZero(rng, 105, 895);
	const extra = noZero(rng, 25, 95);
	const head = `Un corpo $A$ a ${C(tA)} è messo a contatto con un corpo $B$ a ${C(tB)}, e i due sono isolati dal resto. `;
	const ask = ' senza che nessuno compia lavoro. È possibile?';
	const params = { tA, tB, Q };
	if (kind === 'spontaneo')
		return verdict(rng, 'Di’ se il processo è possibile.', `${head}Il corpo $${hot}$ cede ${J(Q)} di calore e il corpo $${cold}$ ne assorbe ${J(Q)},${ask}`, 'possibile', [BALANCE_OK, `Il calore passa dal corpo più caldo, $${hot}$, al più freddo, $${cold}$: è il verso in cui passa da solo.`], kind, params);
	if (kind === 'inverso')
		return verdict(
			rng,
			'Di’ se il processo è possibile.',
			`${head}Il corpo $${cold}$ cede ${J(Q)} di calore e il corpo $${hot}$ ne assorbe ${J(Q)},${ask}`,
			'clausius',
			[BALANCE_OK, `Ma il calore passerebbe dal corpo più freddo, $${cold}$, al più caldo, $${hot}$, e questo sarebbe l'unico risultato: lo vieta l'enunciato di Clausius.`],
			kind,
			params,
		);
	return verdict(
		rng,
		'Di’ se il processo è possibile.',
		`${head}Il corpo $${hot}$ cede ${J(Q)} di calore e il corpo $${cold}$ ne assorbe ${J(Q + extra)},${ask}`,
		'primo',
		[`Il corpo $${cold}$ assorbirebbe più calore di quanto $${hot}$ ne cede: ${J(Q + extra)} contro ${J(Q)}.`, "L'energia non si conserverebbe: è violato il primo principio."],
		kind,
		{ ...params, extra },
	);
}

// ---------------------------------------------------------------------------
// Level 2: heat into work

const SINGLE = ["dall'acqua di un lago", "dall'aria dell'ambiente", 'da una caldaia', "dall'acqua del mare"];
const L2_CASES = ['una-sorgente', 'una-sorgente', 'una-sorgente', 'due-sorgenti', 'due-sorgenti', 'isoterma', 'isoterma', 'attrito', 'bilancio', 'bilancio'] as const;

function level2(rng: Rng): Built {
	const kind = rng.pick(L2_CASES);
	const Q = noZero(rng, 205, 995);
	const ask = ' È possibile?';
	const prompt = 'Di’ se la trasformazione è possibile.';
	if (kind === 'una-sorgente') {
		const from = rng.pick(SINGLE);
		return verdict(
			rng,
			prompt,
			`Una macchina che lavora per cicli assorbe in ogni ciclo ${J(Q)} di calore ${from}, compie ${J(Q)} di lavoro e non cede calore a nessun altro corpo.${ask}`,
			'kelvin',
			[BALANCE_OK, "Ma la macchina trasformerebbe interamente in lavoro il calore di un'unica sorgente, tornando ogni volta allo stato iniziale: lo vieta l'enunciato di Kelvin."],
			kind,
			{ Q, from },
		);
	}
	if (kind === 'due-sorgenti') {
		for (;;) {
			const Qf = noZero(rng, 105, Q - 50);
			const W = Q - Qf;
			if (W % 10 === 0 || W < 40) continue;
			return verdict(
				rng,
				prompt,
				`Una macchina che lavora per cicli assorbe in ogni ciclo ${J(Q)} di calore da una caldaia, cede ${J(Qf)} all'aria dell'ambiente, più fredda, e compie ${J(W)} di lavoro.${ask}`,
				'possibile',
				[`$$Q_c - Q_f = ${Q} - ${Qf} = ${wu(String(W), 'J')}`, `${BALANCE_OK} Solo una parte del calore diventa lavoro, e il resto va a una sorgente più fredda: è una macchina termica.`],
				kind,
				{ Q, Qf, W },
			);
		}
	}
	if (kind === 'isoterma')
		return verdict(
			rng,
			prompt,
			`Un gas perfetto chiuso in un cilindro si espande una volta sola a temperatura costante: assorbe ${J(Q)} di calore da una sorgente e compie ${J(Q)} di lavoro. Alla fine occupa un volume più grande di quello iniziale.${ask}`,
			'possibile',
			["A temperatura costante l'energia interna del gas perfetto non cambia, quindi il calore assorbito è uguale al lavoro compiuto.", "Tutto il calore diventa lavoro, ma non è l'unico risultato: il gas alla fine ha un volume diverso. L'enunciato di Kelvin non è violato."],
			kind,
			{ Q },
		);
	if (kind === 'attrito')
		return verdict(
			rng,
			prompt,
			`In una frenata l'attrito dei freni di una bicicletta trasforma ${J(Q)} di lavoro interamente in calore, che scalda i freni e l'aria.${ask}`,
			'possibile',
			["L'energia si conserva: tutto il lavoro diventa calore.", "Il secondo principio limita il passaggio dal calore al lavoro, non quello dal lavoro al calore, che può essere completo."],
			kind,
			{ Q },
		);
	const W = Q + noZero(rng, 25, 195);
	return verdict(
		rng,
		prompt,
		`Una macchina che lavora per cicli assorbe in ogni ciclo ${J(Q)} di calore da una caldaia e compie ${J(W)} di lavoro, senza ricevere altra energia.${ask}`,
		'primo',
		[`La macchina produrrebbe più energia di quanta ne riceve: ${J(W)} contro ${J(Q)}.`, "L'energia non si conserverebbe: è violato il primo principio."],
		kind,
		{ Q, W },
	);
}

// ---------------------------------------------------------------------------
// Level 3: refrigerators and engines, with the balance to work out

const L3_CASES = ['frigo', 'frigo-senza-lavoro', 'frigo-bilancio', 'macchina', 'macchina-una-sorgente', 'macchina-bilancio'] as const;

function level3(rng: Rng): Built {
	const kind = rng.pick(L3_CASES);
	const prompt = 'Di’ se il dispositivo può esistere.';
	const ask = ' Può esistere?';
	for (;;) {
		if (kind === 'frigo' || kind === 'frigo-bilancio') {
			const Qf = noZero(rng, 205, 895);
			const W = noZero(rng, 45, 295);
			const off = kind === 'frigo' ? 0 : rng.pick([-1, 1]) * noZero(rng, 15, 40);
			const Qc = Qf + W + off;
			if (Qc % 10 === 0 || (Qf + W) % 10 === 0) continue;
			const text = `Un frigorifero assorbe in ogni ciclo ${J(Qf)} di calore dal suo interno, riceve ${J(W)} di lavoro dal motore e cede ${J(Qc)} di calore alla cucina.${ask}`;
			const sum = `$$Q_f + W = ${Qf} + ${W} = ${wu(String(Qf + W), 'J')}`;
			if (kind === 'frigo') return verdict(rng, prompt, text, 'possibile', [sum, `${BALANCE_OK} Il calore passa dal freddo al caldo, ma non è l'unico risultato, perché il frigorifero riceve lavoro: l'enunciato di Clausius non è violato.`], kind, { Qf, W, Qc });
			return verdict(rng, prompt, text, 'primo', [sum, `Il frigorifero dovrebbe cedere ${J(Qf + W)}, non ${J(Qc)}: l'energia non si conserverebbe. È violato il primo principio.`], kind, { Qf, W, Qc });
		}
		if (kind === 'frigo-senza-lavoro') {
			const Q = noZero(rng, 105, 695);
			const tc = rng.int(-18, 4), th = rng.int(18, 30);
			return verdict(
				rng,
				prompt,
				`Un dispositivo che lavora per cicli assorbe in ogni ciclo ${J(Q)} di calore da una cella a ${C(tc)} e cede ${J(Q)} alla stanza, a ${C(th)}, senza ricevere lavoro.${ask}`,
				'clausius',
				[BALANCE_OK, "Ma l'unico risultato sarebbe il passaggio di calore da un corpo più freddo a uno più caldo: lo vieta l'enunciato di Clausius."],
				kind,
				{ Q, tc, th },
			);
		}
		if (kind === 'macchina-una-sorgente') {
			const Q = noZero(rng, 205, 995);
			const from = rng.pick(SINGLE);
			return verdict(
				rng,
				prompt,
				`Un motore che lavora per cicli assorbe in ogni ciclo ${J(Q)} di calore ${from} e compie ${J(Q)} di lavoro. Non scambia calore con nessun altro corpo.${ask}`,
				'kelvin',
				[BALANCE_OK, "Ma il motore trasformerebbe interamente in lavoro il calore di un'unica sorgente: lo vieta l'enunciato di Kelvin."],
				kind,
				{ Q, from },
			);
		}
		const Qc = noZero(rng, 405, 1495);
		const Qf = noZero(rng, 205, Qc - 100);
		const off = kind === 'macchina' ? 0 : noZero(rng, 15, 95);
		const W = Qc - Qf + off;
		if (W % 10 === 0 || (Qc - Qf) % 10 === 0 || W >= Qc) continue;
		const text = `Un motore che lavora per cicli assorbe in ogni ciclo ${J(Qc)} di calore da una caldaia, cede ${J(Qf)} all'aria dell'ambiente, più fredda, e compie ${J(W)} di lavoro.${ask}`;
		const diff = `$$Q_c - Q_f = ${Qc} - ${Qf} = ${wu(String(Qc - Qf), 'J')}`;
		if (kind === 'macchina') return verdict(rng, prompt, text, 'possibile', [diff, `${BALANCE_OK} Una parte del calore va a una sorgente più fredda: è una macchina termica, e il secondo principio è rispettato.`], kind, { Qc, Qf, W });
		return verdict(rng, prompt, text, 'primo', [diff, `Il motore potrebbe compiere al più ${J(Qc - Qf)} di lavoro, non ${J(W)}: l'energia non si conserverebbe. È violato il primo principio.`], kind, { Qc, Qf, W });
	}
}

// ---------------------------------------------------------------------------
// Level 4: a real engine next to a device that breaks Clausius

function level4(rng: Rng): Built {
	for (;;) {
		const Qc = noZero(rng, 405, 1495);
		const Qf = noZero(rng, 205, Qc - 100);
		const net = Qc - Qf;
		if (net % 10 === 0) continue;
		const forbidden: Device = { nome: 'vietato', vietato: true, freddo: { verso: 'entra', testo: Jl(Qf) }, caldo: { verso: 'esce', testo: Jl(Qf) } };
		return {
			prompt: 'Trova il calore che la sorgente calda cede in tutto.',
			problem: textBlock(
				`In ogni ciclo una macchina termica assorbe ${J(Qc)} dalla sorgente calda e cede ${J(Qf)} alla sorgente fredda. Un dispositivo che viola l'enunciato di Clausius riporta i ${J(Qf)} dalla sorgente fredda a quella calda, senza lavoro. Quanto calore cede in tutto la sorgente calda in un ciclo?`,
			),
			solution: `${wu(fmtExact(q(net)), 'J')}`,
			steps: [
				textBlock(`La sorgente calda cede ${J(Qc)} alla macchina e riceve ${J(Qf)} dal dispositivo vietato.`),
				`${Qc} - ${Qf} = ${wu(String(net), 'J')}`,
				textBlock(`La sorgente fredda riceve ${J(Qf)} e ne cede ${J(Qf)}: in tutto non scambia niente. I ${J(net)} presi dalla sola sorgente calda sono il lavoro della macchina: l'insieme viola l'enunciato di Kelvin.`),
			],
			// what the engine absorbs; what comes back; the two added
			answer: options(rng, q(net), [q(Qc), q(Qf), q(Qc + Qf)], 'J', INT),
			params: { case: 'clausius-falso', Qc, Qf },
			scene: scenaMacchine([forbidden, engine(`Qc = ${Jl(Qc)}`, `Qf = ${Jl(Qf)}`, '')], `Tra la sorgente calda e la sorgente fredda lavorano due dispositivi. A sinistra, tratteggiato, il dispositivo vietato: porta ${Jl(Qf)} dalla sorgente fredda a quella calda. A destra una macchina termica: assorbe ${Jl(Qc)} dalla sorgente calda, cede ${Jl(Qf)} alla sorgente fredda e compie lavoro.`),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: an engine that breaks Kelvin drives a real refrigerator

function level5(rng: Rng): Built {
	for (;;) {
		const W = noZero(rng, 105, 495);
		const Qf = noZero(rng, 205, 995);
		const Qc = Qf + W;
		if (Qc % 10 === 0 || Qf === W) continue;
		const forbidden: Device = { nome: 'vietata', vietato: true, caldo: { verso: 'entra', testo: `Q = ${Jl(W)}` }, lavoro: { verso: 'passa', testo: `W = ${Jl(W)}` } };
		const fridge: Device = { nome: 'frigorifero', freddo: { verso: 'entra', testo: `Qf = ${Jl(Qf)}` }, caldo: { verso: 'esce', testo: 'Qc' } };
		return {
			prompt: 'Trova il calore che la sorgente calda riceve in tutto.',
			problem: textBlock(
				`Una macchina che viola l'enunciato di Kelvin assorbe in ogni ciclo ${J(W)} dalla sorgente calda e li trasforma tutti in lavoro. Con quel lavoro aziona un frigorifero, che assorbe ${J(Qf)} dalla sorgente fredda. Quanto calore riceve in tutto la sorgente calda in un ciclo?`,
			),
			solution: `${wu(fmtExact(q(Qf)), 'J')}`,
			steps: [
				textBlock('Il frigorifero cede alla sorgente calda il calore assorbito più il lavoro ricevuto.'),
				`Q_c = Q_f + W = ${Qf} + ${W} = ${wu(String(Qc), 'J')}`,
				textBlock(`La sorgente calda cede ${J(W)} alla macchina vietata e riceve ${J(Qc)} dal frigorifero.`),
				`${Qc} - ${W} = ${wu(String(Qf), 'J')}`,
				textBlock(`L'insieme non scambia lavoro con l'esterno e porta ${J(Qf)} dalla sorgente fredda a quella calda: viola l'enunciato di Clausius.`),
			],
			// what the refrigerator gives, without taking away what the engine took; the work; the work taken away twice
			answer: options(rng, q(Qf), [q(Qc), q(W), q(Qf - W)], 'J', INT),
			params: { case: 'kelvin-falso', W, Qf },
			scene: scenaMacchine([forbidden, fridge], `Tra la sorgente calda e la sorgente fredda lavorano due dispositivi. A sinistra, tratteggiata, la macchina vietata: assorbe ${Jl(W)} dalla sorgente calda e li trasforma tutti in lavoro, che passa al dispositivo di destra. A destra un frigorifero: riceve il lavoro, assorbe ${Jl(Qf)} dalla sorgente fredda e cede calore alla sorgente calda.`),
		};
	}
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	return sample.level <= 3 ? checkWords(sample) : checkCommon(sample);
}

export const fisEnunciatiKelvinClausius: Generator = {
	id: ID,
	title: 'Gli enunciati di Kelvin e di Clausius',
	levels: {
		1: { label: 'Il verso del calore', constraints: ['due corpi a temperature diverse', 'possibile, primo principio o Clausius'] },
		2: { label: 'Tutto il calore in lavoro?', constraints: ['una o due sorgenti, isoterma, attrito', 'possibile, primo principio o Kelvin'] },
		3: { label: 'Che cosa viola un dispositivo', constraints: ['frigoriferi e motori', 'prima il bilancio, poi il secondo principio'] },
		4: { label: 'Se fosse falso Clausius', constraints: ['macchina termica più dispositivo vietato', 'calore ceduto in tutto dalla sorgente calda'] },
		5: { label: 'Se fosse falso Kelvin', constraints: ['macchina vietata più frigorifero', 'calore ricevuto in tutto dalla sorgente calda'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
};

export default fisEnunciatiKelvinClausius;
