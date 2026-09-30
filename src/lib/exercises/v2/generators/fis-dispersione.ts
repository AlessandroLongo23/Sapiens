/**
 * La dispersione della luce e i colori. Spec: specs/exercises/fis-dispersione.md
 *
 * Six levels from the lesson (docs/lezioni/fisica/riscritte/35-fis-dispersione.md): the colours in the prism (which
 * deviates more, which has the larger index); a body of a primary colour, white or black under a coloured light;
 * additive synthesis of two or three lights; subtractive synthesis of two or three filters; a body of a secondary
 * colour (yellow, cyan, magenta) under a light of one or two primaries; the separation between the red and the violet
 * ray refracted into glass or water, to the tenth of a degree. Colours are sets of the additive primaries (red, green,
 * blue), as the lesson explains them; the answer is a colour name, or an angle. Distractors: the subtractive rule used
 * for lights and the other way round, the colour of the object in white light, the colour of the light, the angles
 * divided by the indices.
 */
import type { ChoiceAnswer, ChoiceOption, Generator, Rng, Sample } from '../types';
import { shuffle, textBlock } from '../insiemi';
import { BANNED, choiceOf, decTex, t } from '../vettori';

export const ID = 'fis-dispersione';

interface Built {
	prompt: string;
	problem: string;
	solution: string;
	steps: string[];
	answer: ChoiceAnswer;
	params: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Colours as sets of the additive primaries: bit 1 red, 2 green, 4 blue.

const R = 1, G = 2, B = 4;
const NAME: Record<number, string> = { 0: 'nero', [R]: 'rosso', [G]: 'verde', [B]: 'blu', [R | G]: 'giallo', [G | B]: 'ciano', [R | B]: 'magenta', 7: 'bianco' };
/** Feminine forms, for "luce rossa". */
const FEM: Record<number, string> = { [R]: 'rossa', [G]: 'verde', [B]: 'blu', [R | G]: 'gialla', [G | B]: 'ciano', [R | B]: 'magenta', 7: 'bianca' };
const colourOpt = (c: number): ChoiceOption => ({ latex: t(NAME[c]), values: [NAME[c]] });
const nameOpt = (s: string): ChoiceOption => ({ latex: t(s), values: [s] });
/** What a filter or a pigment of colour c lets through or diffuses: c itself. Several filters: the intersection. */
const subtract = (cs: number[]) => cs.reduce((a, c) => a & c, 7);
const addLights = (cs: number[]) => cs.reduce((a, c) => a | c, 0);

/** Four options among the colours: the answer, the mistakes in order, then any other colour. */
function colourChoice(rng: Rng, right: number, mistakes: number[]): ChoiceAnswer {
	const rest = shuffle(rng, [0, R, G, B, R | G, G | B, R | B, 7]);
	return choiceOf(rng, colourOpt(right), mistakes.filter((m) => m !== right).map(colourOpt), rest.map(colourOpt));
}

// ---------------------------------------------------------------------------
// Level 1: the colours in the prism

const SPECTRUM = ['rosso', 'arancione', 'giallo', 'verde', 'azzurro', 'indaco', 'violetto'];

function level1(rng: Rng): Built {
	const kind = rng.pick(['devia di più', 'devia di meno', 'indice', 'angolo'] as const);
	if (kind === 'devia di più' || kind === 'devia di meno') {
		const more = kind === 'devia di più';
		const right = more ? 'violetto' : 'rosso';
		const answer = choiceOf(rng, nameOpt(right), [nameOpt(more ? 'rosso' : 'violetto'), nameOpt('verde'), nameOpt('giallo')], [nameOpt('azzurro')]);
		return {
			prompt: 'Scegli il colore.',
			problem: textBlock(`Un raggio di luce bianca attraversa un prisma di vetro. Quale colore viene deviato ${more ? 'di più' : 'di meno'}?`),
			solution: t(right),
			steps: [t("Nel vetro l'indice di rifrazione cresce dal rosso al violetto."), t(`Il colore con l'indice più ${more ? 'grande' : 'piccolo'} devia ${more ? 'di più' : 'di meno'}: il ${right}.`)],
			answer,
			params: { case: kind },
		};
	}
	// Two colours of the spectrum: the larger index, or the larger angle of refraction.
	const i = rng.int(0, 5), j = rng.int(i + 1, 6);
	const [a, b] = rng.next() < 0.5 ? [SPECTRUM[i], SPECTRUM[j]] : [SPECTRUM[j], SPECTRUM[i]];
	const larger = kind === 'indice' ? SPECTRUM[j] : SPECTRUM[i];
	const other = larger === a ? b : a;
	const answer = choiceOf(rng, nameOpt(art(larger)), [nameOpt(art(other)), nameOpt('sono uguali')], [nameOpt('dipende dall’angolo'.replace('’', "'"))]);
	const q = kind === 'indice' ? `Nel vetro, quale ha l'indice di rifrazione più grande tra la luce ${a} e la luce ${b}?` : `La luce ${a} e la luce ${b} entrano dall'aria nel vetro con lo stesso angolo di incidenza. Quale ha l'angolo di rifrazione più grande?`;
	return {
		prompt: 'Scegli il colore.',
		problem: textBlock(q.replace(/luce (\w+)/g, (_, c: string) => `luce ${fem(c)}`)),
		solution: t(art(larger)),
		steps: [t("Nel vetro l'indice cresce dal rosso al violetto."), t(kind === 'indice' ? `${cap(art(larger))} è più vicino al violetto: ha l'indice più grande.` : `${cap(art(larger))} ha l'indice più piccolo: si avvicina meno alla normale.`)],
		answer,
		params: { case: kind, a, b },
	};
}
/** "il rosso", "l'arancione". */
const art = (c: string) => (/^[aeiou]/.test(c) ? `l'${c}` : `il ${c}`);
const cap = (x: string) => x.charAt(0).toUpperCase() + x.slice(1);
/** "luce rossa", "luce arancione", "luce indaco". */
function fem(c: string): string {
	return ({ rosso: 'rossa', giallo: 'gialla', violetto: 'violetta', azzurro: 'azzurra' } as Record<string, string>)[c] ?? c;
}

// ---------------------------------------------------------------------------
// Level 2: a body of a primary colour, white or black, under a coloured light

const BODY = [
	{ c: R, text: 'Una maglietta, rossa in luce bianca,', f: true },
	{ c: G, text: 'Una foglia, verde in luce bianca,', f: true },
	{ c: B, text: 'Un quaderno, blu in luce bianca,', f: false },
	{ c: 7, text: 'Un foglio, bianco in luce bianca,', f: false },
	{ c: 0, text: 'Un cappello, nero in luce bianca,', f: false },
];

function level2(rng: Rng): Built {
	const body = rng.pick(BODY);
	const light = rng.pick([R, G, B]);
	const right = body.c & light;
	const answer = colourChoice(rng, right, [body.c === 0 ? 7 : body.c, light, addLights([body.c, light]) === right ? 7 : addLights([body.c, light])]);
	const how = right === 0 ? (body.c === 0 ? 'Un corpo nero assorbe tutti i colori.' : `Il corpo diffonde solo il ${NAME[body.c]} e la luce ${FEM[light]} la assorbe: non manda luce all'occhio.`) : `Il corpo diffonde la luce ${FEM[light]} che riceve.`;
	return {
		prompt: 'Scegli il colore.',
		problem: textBlock(`${body.text} viene ${body.f ? 'illuminata' : 'illuminato'} solo con luce ${FEM[light]}. Di che colore appare?`),
		solution: t(NAME[right]),
		steps: [t(`In luce bianca il corpo è ${NAME[body.c]}: diffonde ${body.c === 7 ? 'tutti i colori' : body.c === 0 ? 'nessun colore' : `il ${NAME[body.c]}`}.`), t(how), t(`Appare ${NAME[right]}.`)],
		answer,
		params: { case: right === 0 ? 'nero' : 'colorato', body: NAME[body.c], light: NAME[light] },
	};
}

// ---------------------------------------------------------------------------
// Levels 3 and 4: additive and subtractive synthesis

const PRIM_ADD = [R, G, B];
const PRIM_SUB = [G | B, R | B, R | G]; // cyan, magenta, yellow

function synthesis(rng: Rng, level: 3 | 4): Built {
	const add = level === 3;
	const three = rng.next() < 0.2;
	const pool = add ? PRIM_ADD : PRIM_SUB;
	const chosen = three ? pool : shuffle(rng, pool).slice(0, 2);
	const right = add ? addLights(chosen) : subtract(chosen);
	const wrong = add ? subtract(chosen.map((c) => 7 & ~c)) : addLights(chosen); // the other rule
	const names = chosen.map((c) => NAME[c]);
	const list = names.length === 3 ? `${names[0]}, ${names[1]} e ${names[2]}` : `${names[0]} e ${names[1]}`;
	const mistakes = [wrong, ...chosen];
	const answer = colourChoice(rng, right, mistakes);
	const problem = add
		? `Su un muro bianco, al buio, si sovrappongono ${names.length === 3 ? `le luci rossa, verde e blu di tre faretti` : `la luce ${FEM[chosen[0]]} e la luce ${FEM[chosen[1]]} di due faretti`}. Di che colore è la zona in cui si sovrappongono?`
		: rng.next() < 0.5
			? `Davanti a una lampada bianca si mettono, uno sopra l'altro, ${names.length === 3 ? 'tre filtri' : 'due filtri'}: ${list}. Di che colore è la luce che passa?`
			: `Su un foglio bianco si mescolano ${names.length === 3 ? 'tre inchiostri' : 'due inchiostri'}: ${list}. Di che colore appare la macchia in luce bianca?`;
	const steps = add
		? [t('Con le luci i colori si sommano (sintesi additiva).'), t(`${list.charAt(0).toUpperCase()}${list.slice(1)} insieme danno ${NAME[right]}.`)]
		: [t('Ogni filtro assorbe una parte della luce bianca (sintesi sottrattiva):'), t(chosen.map((c) => `il ${NAME[c]} assorbe il ${NAME[7 & ~c]}`).join(', ') + '.'), t(`Passa solo quello che nessuno assorbe: ${right === 0 ? 'niente, e si vede nero' : `il ${NAME[right]}`}.`)];
	return {
		prompt: 'Scegli il colore.',
		problem: textBlock(problem),
		solution: t(NAME[right]),
		steps,
		answer,
		params: { case: three ? 'tre' : 'due', colours: names },
	};
}

// ---------------------------------------------------------------------------
// Level 5: a body of a secondary colour under coloured light

const BODY2 = [
	{ c: R | G, text: 'Una banana, gialla in luce bianca,', f: true },
	{ c: G | B, text: 'Un costume, ciano in luce bianca,', f: false },
	{ c: R | B, text: 'Un fiore, magenta in luce bianca,', f: false },
];

function level5(rng: Rng): Built {
	const body = rng.pick(BODY2);
	const light = rng.next() < 0.6 ? rng.pick([R, G, B]) : rng.pick([R | G, G | B, R | B].filter((c) => c !== body.c));
	const right = body.c & light;
	const answer = colourChoice(rng, right, [body.c, light, addLights([body.c, light]), 0]);
	const parts = [R, G, B].filter((p) => body.c & p).map((p) => `il ${NAME[p]}`).join(' e ');
	return {
		prompt: 'Scegli il colore.',
		problem: textBlock(`${body.text} viene ${body.f ? 'illuminata' : 'illuminato'} con luce ${FEM[light]}. Di che colore appare?`),
		solution: t(NAME[right]),
		steps: [t(`Il corpo ${NAME[body.c]} diffonde ${parts}.`), t(`La luce ${FEM[light]} contiene ${[R, G, B].filter((p) => light & p).map((p) => `il ${NAME[p]}`).join(' e ')}.`), t(right === 0 ? 'Nessuno dei colori che riceve viene diffuso: appare nero.' : `Diffonde solo ${[R, G, B].filter((p) => right & p).map((p) => `il ${NAME[p]}`).join(' e ')}: appare ${NAME[right]}.`)],
		answer,
		params: { case: right === 0 ? 'nero' : 'colorato', body: NAME[body.c], light: NAME[light] },
	};
}

// ---------------------------------------------------------------------------
// Level 6: the separation of red and violet

const GLASSES = [
	{ name: 'vetro', r: '1.514', v: '1.530', in: 'in un vetro' },
	{ name: 'vetro denso', r: '1.615', v: '1.645', in: 'in un vetro denso' },
	{ name: 'acqua', r: '1.331', v: '1.343', in: "nell'acqua" },
];
const DEG = Math.PI / 180;
const refr = (th: number, n: number) => Math.asin(Math.sin(th * DEG) / n) / DEG;
/** x to the tenth, half up; null near a boundary. */
function tenth(x: number): string | null {
	const y = x * 10;
	if (Math.abs(y - Math.floor(y) - 0.5) < 1e-6) return null;
	return (Math.round(y) / 10).toFixed(1);
}
const degOpt = (s: string): ChoiceOption => ({ latex: `${decTex(s)}^\\circ`, values: [s] });

function level6(rng: Rng): Built {
	const g = rng.pick(GLASSES);
	const th = rng.int(30, 80);
	const nr = Number(g.r), nv = Number(g.v);
	const ar = refr(th, nr), av = refr(th, nv);
	const d = ar - av;
	const right = tenth(d);
	// The same result from the two angles rounded to the tenth, as a student would write them.
	const fromRounded = tenth(Number(tenth(ar)) - Number(tenth(av)));
	if (right === null || fromRounded !== right || tenth(ar) === null || tenth(av) === null || Number(right) < 0.1) throw new Error('resample');
	const mistakes: ChoiceOption[] = [];
	const add = (x: number) => {
		const s = tenth(x);
		if (s !== null && Number(s) > 0) mistakes.push(degOpt(s));
	};
	add(th / nr - th / nv); // the angle divided by the index
	add((nv - nr) * th); // the difference of the indices times the angle
	add(d * 2);
	const answer = choiceOf(rng, degOpt(right), mistakes.filter((o) => o.values[0] !== right), [degOpt((Number(right) + 0.2).toFixed(1)), degOpt((Number(right) + 0.3).toFixed(1))]);
	const n = (s: string) => decTex(s);
	return {
		prompt: 'Trova di quanti gradi si separano i due colori.',
		problem: textBlock(`Un raggio di luce bianca entra dall'aria ${g.in} con un angolo di incidenza di $${th}^\\circ$. L'indice di rifrazione è $${n(g.r)}$ per il rosso e $${n(g.v)}$ per il violetto. Di quanti gradi differiscono gli angoli di rifrazione dei due colori? Rispondi al decimo di grado.`),
		solution: `\\theta_{\\text{rosso}} - \\theta_{\\text{violetto}} \\approx ${decTex(right)}^\\circ`,
		steps: [
			t('Per ogni colore si usa la legge di Snell con il suo indice:'),
			`\\sin\\theta_{\\text{rosso}} = \\frac{\\sin ${th}^\\circ}{${n(g.r)}} \\qquad \\theta_{\\text{rosso}} = ${decTex(ar.toFixed(2))}\\ldots^\\circ`,
			`\\sin\\theta_{\\text{violetto}} = \\frac{\\sin ${th}^\\circ}{${n(g.v)}} \\qquad \\theta_{\\text{violetto}} = ${decTex(av.toFixed(2))}\\ldots^\\circ`,
			`${decTex(ar.toFixed(2))} - ${decTex(av.toFixed(2))} = ${decTex(d.toFixed(2))} \\approx ${decTex(right)}^\\circ`,
			t(`Il violetto, con l'indice più grande, si avvicina di più alla normale.`),
		],
		answer,
		params: { case: g.name, th, nr: g.r, nv: g.v },
	};
}

// ---------------------------------------------------------------------------
// Assembly and checks

const LEVELS: Record<number, (rng: Rng) => Built> = {
	1: level1,
	2: level2,
	3: (rng) => synthesis(rng, 3),
	4: (rng) => synthesis(rng, 4),
	5: level5,
	6: level6,
};

function generate(rng: Rng, level: number): Sample {
	const make = LEVELS[level];
	if (!make) throw new Error(`${ID}: unknown level ${level}`);
	for (let attempt = 0; attempt < 1000; attempt++) {
		let b: Built;
		try {
			b = make(rng);
		} catch {
			continue;
		}
		const sample: Sample = { generatorId: ID, level, seed: rng.seed, prompt: b.prompt, problem: b.problem, solution: b.solution, steps: b.steps, answer: b.answer, params: b.params };
		if (check(sample).length === 0) return sample;
	}
	throw new Error(`${ID}: no valid sample for level ${level}, seed ${rng.seed}`);
}

function check(sample: Sample): string[] {
	const v: string[] = [];
	if (!sample.steps.length) v.push('nessun passaggio');
	if (BANNED.test([sample.problem, sample.solution, ...sample.steps].join(' '))) v.push('parole vietate');
	const a = sample.answer;
	if (a.kind !== 'choice') return ['la risposta deve essere a scelta multipla'];
	if (a.options.length !== 4 || new Set(a.options.map((o) => o.latex)).size !== 4) v.push('servono quattro opzioni diverse');
	return v;
}

export const fisDispersione: Generator = {
	id: ID,
	title: 'La dispersione della luce e i colori',
	levels: {
		1: { label: 'I colori nel prisma', constraints: ['quale colore devia di più o di meno', "l'indice cresce dal rosso al violetto"] },
		2: { label: 'Il colore dei corpi in luce colorata', constraints: ['corpo rosso, verde, blu, bianco o nero', 'luce rossa, verde o blu'] },
		3: { label: 'La sintesi additiva', constraints: ['due o tre luci tra rosso, verde e blu'] },
		4: { label: 'La sintesi sottrattiva', constraints: ['due o tre filtri tra ciano, magenta e giallo'] },
		5: { label: 'Corpi gialli, ciano e magenta', constraints: ['un corpo di colore secondario', 'luce di uno o due primari'] },
		6: { label: 'Di quanto si separano i colori', constraints: ['rosso e violetto nel vetro o nell’acqua', 'differenza al decimo di grado'] },
	},
	generate,
	check,
};

export default fisDispersione;
