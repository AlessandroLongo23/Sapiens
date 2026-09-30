/**
 * Le leve e le macchine semplici. Spec: specs/exercises/fis-leve.md
 *
 * Five levels from the lesson (docs/lezioni/fisica/riscritte/24-fis-leve.md): the kind of a lever, from an object of
 * the lesson or from a drawing; advantageous, disadvantageous or indifferent, from the arms or from the kind; the
 * effort that balances the resistance, F_m = F_r b_r / b_m; an arm, or where the fulcrum goes on a rod of given
 * length; the fixed and the movable pulley. Numbers are built backwards so the answers are exact (whole newtons,
 * whole centimetres). Distractors from the lesson's warnings: the ratio upside down, the arm measured from the other
 * force or taken as the whole rod, the movable pulley that halves the weight taken for one that doubles it or does
 * nothing, the pulley's own weight forgotten. The scene `asta-forze` draws the lever: the fulcrum, the two forces
 * (a "?" for the unknown, all as long as each other when one is unknown) and the arms.
 */
import type { ChoiceOption, Generator, Rng, Sample, SceneRef } from '../types';
import { textBlock } from '../insiemi';
import { type Built, type Format, type R, commonCheck, figs, generateWith, n, num, pickStep, pv, q, r3, sceneText, t, toChoice, vq, wordOpt } from '../fis-corpo-rigido';

export const ID = 'fis-leve';

const S2: Format = { kind: 'sig', s: 2 };
const INT: Format = { kind: 'int' };
const N = (r: R) => vq(r, 'N', INT);
const C = (r: R) => vq(r, 'cm', INT);

type Kind = 'primo' | 'secondo' | 'terzo';
const KINDS: Kind[] = ['primo', 'secondo', 'terzo'];
export const KIND_TEXT: Record<Kind, string> = { primo: 'primo genere', secondo: 'secondo genere', terzo: 'terzo genere' };
const kindOpts = (right: Kind): { right: ChoiceOption; others: ChoiceOption[] } => ({ right: wordOpt(right, KIND_TEXT[right]), others: KINDS.filter((k) => k !== right).map((k) => wordOpt(k, KIND_TEXT[k])) });

type Gain = 'vantaggiosa' | 'svantaggiosa' | 'indifferente';
const GAINS: Gain[] = ['vantaggiosa', 'svantaggiosa', 'indifferente'];
const gainOpts = (right: Gain) => ({ right: wordOpt(right, right), others: GAINS.filter((g) => g !== right).map((g) => wordOpt(g, g)) });

// ---------------------------------------------------------------------------
// The drawing of a lever: positions in centimetres from the left end, the rod 6 cm long in the drawing

type Lever = { kind: Kind; br: R; bm: R };
/** Where the fulcrum and the two forces are, with 10% of the rod free past the outer ones. */
function layout(l: Lever) {
	const { kind, br, bm } = l;
	if (kind === 'primo') {
		const L = br.add(bm);
		const pad = L.div(n(10));
		return { len: L.add(pad.mul(n(2))), xf: pad.add(br), xr: pad, xm: pad.add(L) };
	}
	const far = kind === 'secondo' ? bm : br;
	const pad = far.div(n(10));
	return { len: far.add(pad.mul(n(2))), xf: pad, xr: pad.add(br), xm: pad.add(bm) };
}
const m = (cm: R) => r3(num(cm) / 100);

function leverScene(alt: string, l: Lever, o: { fr?: string; fm?: string; quote: boolean; fulcrum?: boolean; lengths?: [number, number] }): SceneRef {
	const p = layout(l);
	const [lr, lm] = o.lengths ?? [1.2, 1.2];
	const up = l.kind !== 'primo';
	const quote = [
		{ da: m(p.xf.compare(p.xr) < 0 ? p.xf : p.xr), a: m(p.xf.compare(p.xr) < 0 ? p.xr : p.xf), testo: `${sceneText(l.br, 'cm', INT)}`, lato: 'sopra' as const, livello: l.kind === 'terzo' ? 1 : 0 },
		{ da: m(p.xf.compare(p.xm) < 0 ? p.xf : p.xm), a: m(p.xf.compare(p.xm) < 0 ? p.xm : p.xf), testo: `${sceneText(l.bm, 'cm', INT)}`, lato: up ? ('sotto' as const) : ('sopra' as const), livello: l.kind === 'secondo' ? 1 : 0 },
	];
	return {
		type: 'asta-forze',
		data: {
			lunghezza: m(p.len),
			appoggi: o.fulcrum === false ? [] : [{ x: m(p.xf), tipo: 'fulcro' }],
			forze: [
				{ x: m(p.xr), angolo: -90, nome: 'F', sub: 'r', valore: o.fr, lunghezza: lr },
				{ x: m(p.xm), angolo: up ? 90 : -90, nome: 'F', sub: 'm', valore: o.fm, lunghezza: lm },
			],
			quote: o.quote ? quote : [],
			punti: [],
		},
		alt,
	};
}
/** Arrow lengths to scale, the longest 1,4 cm and none under 0,4 cm. */
function lengths(fr: R, fm: R): [number, number] {
	const max = Math.max(num(fr), num(fm));
	return [r3(Math.max(0.4, (1.4 * num(fr)) / max)), r3(Math.max(0.4, (1.4 * num(fm)) / max))];
}

/** Arms of a lever of this kind, in centimetres from 5 to 100: b_m > b_r in the second kind, b_m < b_r in the third. */
function arms(rng: Rng, kind: Kind): { br: R; bm: R } {
	for (;;) {
		const br = q(5 * rng.int(1, 20)), bm = q(5 * rng.int(1, 20));
		if (br.equals(bm)) continue;
		if (kind === 'secondo' && bm.compare(br) <= 0) continue;
		if (kind === 'terzo' && bm.compare(br) >= 0) continue;
		return { br, bm };
	}
}

// ---------------------------------------------------------------------------
// Level 1: the kind of a lever

export const OBJECTS: { kind: Kind; text: string }[] = [
	{ kind: 'primo', text: 'Nelle forbici il perno sta tra le lame, che tagliano, e i manici, che la mano stringe.' },
	{ kind: 'primo', text: "Nell'altalena a bilico il fulcro è nel centro dell'asse, e i due bambini siedono ai lati opposti." },
	{ kind: 'primo', text: "Con il piede di porco si solleva una cassa: lo spigolo su cui si appoggia sta tra l'estremità corta, sotto la cassa, e la mano che spinge l'altra estremità." },
	{ kind: 'primo', text: 'Nelle tenaglie il perno sta tra le ganasce, che stringono il chiodo, e i manici.' },
	{ kind: 'primo', text: "La testa poggia sulla prima vertebra: il peso della faccia è davanti all'articolazione, e i muscoli del collo tirano dietro." },
	{ kind: 'secondo', text: "Nella carriola il fulcro è l'asse della ruota, il carico sta nel cassone e le mani sollevano i manici, oltre il carico." },
	{ kind: 'secondo', text: "Nello schiaccianoci i due bracci sono uniti a un'estremità, la noce sta in mezzo e la mano stringe l'altra estremità." },
	{ kind: 'secondo', text: "L'apribottiglie preme con la punta sul centro del tappo, il gancio tira il bordo del tappo e la mano solleva il manico: il gancio sta tra la punta e la mano." },
	{ kind: 'secondo', text: 'Quando ti alzi sulle punte, il piede fa perno sulle dita, il peso del corpo scende sulla caviglia e il polpaccio tira il tallone verso l’alto.'.replace('’', "'") },
	{ kind: 'terzo', text: "Nelle pinzette le due lame sono unite a un'estremità, le dita stringono a metà e le punte afferrano l'oggetto." },
	{ kind: 'terzo', text: 'Nel braccio il fulcro è il gomito, il bicipite si attacca poco sotto il gomito e il peso sta nella mano.' },
	{ kind: 'terzo', text: "La canna da pesca si tiene con una mano ferma in fondo e con l'altra poco più su, e il pesce tira all'estremità opposta." },
	{ kind: 'terzo', text: "Per sollevare la terra con la pala una mano tiene ferma l'estremità del manico, l'altra spinge a metà manico e la terra sta sulla lama." },
];

function level1(rng: Rng): Built {
	if (rng.next() < 0.5) {
		const o = rng.pick(OBJECTS);
		return {
			kind: 'choice',
			prompt: 'Riconosci il genere.',
			problem: textBlock(`${o.text} Di che genere è la leva?`),
			solution: t(KIND_TEXT[o.kind]),
			steps: [t(o.kind === 'primo' ? 'Il fulcro sta tra la forza resistente e la forza motrice.' : o.kind === 'secondo' ? 'La forza resistente sta tra il fulcro e la forza motrice.' : 'La forza motrice sta tra il fulcro e la forza resistente.'), t(`È una leva di ${KIND_TEXT[o.kind]}.`)],
			...kindOpts(o.kind),
			params: { case: 'oggetto', oggetto: OBJECTS.indexOf(o) },
		};
	}
	const kind = rng.pick(KINDS);
	const l: Lever = { kind, ...arms(rng, kind) };
	const flip = rng.next() < 0.5;
	const sc = leverScene(`Una leva: il fulcro, la forza resistente F r verso il basso e la forza motrice F m verso ${kind === 'primo' ? 'il basso' : "l'alto"}; ${kind === 'primo' ? 'il fulcro sta tra le due forze' : kind === 'secondo' ? 'la forza resistente sta tra il fulcro e la forza motrice' : 'la forza motrice sta tra il fulcro e la forza resistente'}`, l, { quote: false });
	if (flip) mirror(sc);
	return {
		kind: 'choice',
		prompt: 'Riconosci il genere.',
		problem: textBlock('Nella leva della figura il triangolo è il fulcro, $F_r$ la forza resistente e $F_m$ la forza motrice. Di che genere è la leva?'),
		solution: t(KIND_TEXT[kind]),
		steps: [t(kind === 'primo' ? 'Il fulcro sta tra le due forze.' : kind === 'secondo' ? 'La forza resistente sta tra il fulcro e la forza motrice.' : 'La forza motrice sta tra il fulcro e la forza resistente.'), t(`È una leva di ${KIND_TEXT[kind]}.`)],
		...kindOpts(kind),
		params: { case: 'figura', genere: kind },
		scene: sc,
	};
}

/** The drawing turned left to right (a lever does not care where its fulcrum is drawn). */
function mirror(sc: SceneRef) {
	const d = sc.data as { lunghezza: number; appoggi: { x: number }[]; forze: { x: number }[]; quote: { da: number; a: number }[] };
	const L = d.lunghezza;
	d.appoggi.forEach((a) => (a.x = r3(L - a.x)));
	d.forze.forEach((f) => (f.x = r3(L - f.x)));
	d.quote.forEach((qq) => ([qq.da, qq.a] = [r3(L - qq.a), r3(L - qq.da)]));
}

// ---------------------------------------------------------------------------
// Level 2: advantageous or not

function level2(rng: Rng): Built {
	const r = rng.next();
	if (r < 0.6) {
		let br: R, bm: R;
		const which = rng.next();
		if (which < 0.2) br = bm = q(5 * rng.int(2, 16));
		else ({ br, bm } = arms(rng, 'primo'));
		const gain: Gain = bm.compare(br) > 0 ? 'vantaggiosa' : bm.compare(br) < 0 ? 'svantaggiosa' : 'indifferente';
		const l: Lever = { kind: 'primo', br, bm };
		return {
			kind: 'choice',
			prompt: 'Confronta i bracci.',
			problem: textBlock(`In una leva di primo genere il braccio della forza motrice è di ${pv(bm, 'cm', INT)} e il braccio della forza resistente è di ${pv(br, 'cm', INT)}. La leva è vantaggiosa, svantaggiosa o indifferente?`),
			solution: t(gain),
			steps: [`b_m = ${C(bm)}, \\quad b_r = ${C(br)}`, t(gain === 'vantaggiosa' ? 'Il braccio motore è più lungo: basta una forza motrice più piccola della resistenza.' : gain === 'svantaggiosa' ? 'Il braccio motore è più corto: serve una forza motrice più grande della resistenza.' : 'I bracci sono uguali: la forza motrice è uguale alla resistenza.')],
			...gainOpts(gain),
			params: { case: gain === 'indifferente' ? 'indifferente' : `primo-${gain}` },
			scene: leverScene(`Una leva di primo genere: la forza resistente a ${br} centimetri dal fulcro, la forza motrice dall'altra parte a ${bm} centimetri`, l, { quote: true }),
		};
	}
	const kind: Kind = r < 0.8 ? 'secondo' : 'terzo';
	const gain: Gain = kind === 'secondo' ? 'vantaggiosa' : 'svantaggiosa';
	const l: Lever = { kind, ...arms(rng, kind) };
	return {
		kind: 'choice',
		prompt: 'Riconosci il vantaggio.',
		problem: textBlock(`La leva della figura è di ${KIND_TEXT[kind]}: ${kind === 'secondo' ? 'la forza resistente sta tra il fulcro e la forza motrice' : 'la forza motrice sta tra il fulcro e la forza resistente'}. La leva è vantaggiosa, svantaggiosa o indifferente?`),
		solution: t(gain),
		steps: [t(kind === 'secondo' ? 'Il braccio motore va dal fulcro fino oltre la resistenza: è sempre più lungo del braccio resistente.' : 'Il braccio motore finisce prima della resistenza: è sempre più corto del braccio resistente.'), t(`Una leva di ${KIND_TEXT[kind]} è sempre ${gain}.`)],
		...gainOpts(gain),
		params: { case: kind },
		scene: leverScene(`Una leva di ${KIND_TEXT[kind]}: il fulcro a un'estremità, ${kind === 'secondo' ? 'la forza resistente in mezzo e la forza motrice verso l’alto all’altra estremità' : 'la forza motrice verso l’alto in mezzo e la forza resistente all’altra estremità'}`.replace(/’/g, "'"), l, { quote: false }),
	};
}

// ---------------------------------------------------------------------------
// Level 3: the effort

function level3(rng: Rng): Built {
	for (;;) {
		const kind = rng.pick(KINDS);
		const { br, bm } = arms(rng, kind);
		const Fr = q(10 * rng.int(3, 90));
		const Fm = Fr.mul(br).div(bm);
		if (!Fm.isInteger() || figs(Fm) > 2 || Fm.compare(n(2)) < 0 || Fm.compare(n(2000)) > 0) continue;
		const l: Lever = { kind, br, bm };
		// the arm measured from the other force (second kind) or taken as the whole rod (first kind)
		const other = kind === 'secondo' ? Fr.mul(br).div(bm.sub(br)) : kind === 'primo' ? Fr.mul(br).div(bm.add(br)) : Fr.mul(br).div(br.sub(bm));
		return {
			kind: 'value',
			prompt: 'Trova la forza motrice.',
			problem: textBlock(`In una leva di ${KIND_TEXT[kind]} il braccio della forza resistente è di ${pv(br, 'cm', INT)} e il braccio della forza motrice è di ${pv(bm, 'cm', INT)}. La forza resistente vale ${pv(Fr, 'N', INT)}. Quale forza motrice tiene la leva in equilibrio?`),
			solution: `F_m = ${N(Fm)}`,
			steps: [`F_m \\cdot b_m = F_r \\cdot b_r \\quad\\Rightarrow\\quad F_m = F_r \\cdot \\frac{b_r}{b_m}`, `F_m = ${N(Fr)} \\cdot \\frac{${C(br)}}{${C(bm)}} = ${N(Fm)}`],
			truth: Fm,
			unit: 'N',
			format: INT,
			// the ratio upside down; the arm measured from the other force, or the whole rod; the resistance itself
			mistakes: [Fr.mul(bm).div(br), other, Fr],
			params: { case: kind },
			scene: leverScene(`Una leva di ${KIND_TEXT[kind]}: la forza resistente di ${Fr} newton a ${br} centimetri dal fulcro, la forza motrice da trovare a ${bm} centimetri dal fulcro`, l, { fr: sceneText(Fr, 'N', INT), fm: '?', quote: true }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 4: an arm, or where the fulcrum goes

function level4(rng: Rng): Built {
	const armCase = rng.next() < 0.6;
	for (;;) {
		if (armCase) {
			const kind = rng.pick(KINDS);
			const { br, bm } = arms(rng, kind);
			const Fm = q(10 * rng.int(1, 60));
			const Fr = Fm.mul(bm).div(br);
			if (!Fr.isInteger() || figs(Fr) > 2 || Fr.compare(n(20)) < 0 || Fr.compare(n(2000)) > 0) continue;
			const l: Lever = { kind, br, bm };
			return {
				kind: 'value',
				prompt: 'Trova il braccio.',
				problem: textBlock(`In una leva di ${KIND_TEXT[kind]} la forza resistente di ${pv(Fr, 'N', INT)} ha il braccio di ${pv(br, 'cm', INT)}. Quanto deve essere lungo il braccio della forza motrice perché basti una forza motrice di ${pv(Fm, 'N', INT)}?`),
				solution: `b_m = ${C(bm)}`,
				steps: [`F_m \\cdot b_m = F_r \\cdot b_r \\quad\\Rightarrow\\quad b_m = b_r \\cdot \\frac{F_r}{F_m}`, `b_m = ${C(br)} \\cdot \\frac{${N(Fr)}}{${N(Fm)}} = ${C(bm)}`],
				truth: bm,
				unit: 'cm',
				format: INT,
				// the ratio upside down; the same arm; the difference of the forces over the effort
				mistakes: [br.mul(Fm).div(Fr), br, br.mul(Fr.add(Fm)).div(Fm)],
				params: { case: `braccio-${kind}` },
				scene: leverScene(`Una leva di ${KIND_TEXT[kind]}: la forza resistente di ${Fr} newton a ${br} centimetri dal fulcro, la forza motrice di ${Fm} newton a una distanza da trovare`, l, { fr: sceneText(Fr, 'N', INT), fm: sceneText(Fm, 'N', INT), quote: false, lengths: lengths(Fr, Fm) }),
			};
		}
		const L = q(10 * rng.int(6, 20));
		const Fr = q(10 * rng.int(2, 60)), Fm = q(10 * rng.int(1, 40));
		if (Fm.compare(Fr) >= 0) continue;
		const br = L.mul(Fm).div(Fr.add(Fm));
		if (!br.isInteger() || figs(br) > 2) continue;
		const bm = L.sub(br);
		const l: Lever = { kind: 'primo', br, bm };
		return {
			kind: 'value',
			prompt: 'Trova il fulcro.',
			problem: textBlock(`Un'asta lunga ${pv(L, 'cm', INT)} è usata come leva di primo genere: a un'estremità c'è una forza resistente di ${pv(Fr, 'N', INT)}, all'altra si spinge con una forza motrice di ${pv(Fm, 'N', INT)}. A che distanza dalla forza resistente va messo il fulcro?`),
			solution: `b_r = ${C(br)}`,
			steps: [
				t('I due bracci insieme sono lunghi quanto l’asta:'.replace('’', "'")) + ` b_r + b_m = ${C(L)}`,
				`F_r \\cdot b_r = F_m \\cdot (${C(L)} - b_r) \\quad\\Rightarrow\\quad b_r = \\frac{F_m \\cdot ${C(L)}}{F_r + F_m}`,
				`b_r = \\frac{${N(Fm)} \\cdot ${C(L)}}{${N(Fr)} + ${N(Fm)}} = ${C(br)}`,
			],
			truth: br,
			unit: 'cm',
			format: INT,
			// the two arms swapped; half the rod; the ratio of the forces without the sum
			mistakes: [bm, L.div(n(2)), L.mul(Fm).div(Fr)],
			params: { case: 'fulcro' },
			scene: leverScene(`Un'asta lunga ${L} centimetri con una forza resistente di ${Fr} newton a un'estremità e una forza motrice di ${Fm} newton all'altra, verso il basso; il fulcro, da trovare, non è disegnato`, l, { fr: sceneText(Fr, 'N', INT), fm: sceneText(Fm, 'N', INT), quote: false, fulcrum: false, lengths: lengths(Fr, Fm) }),
		};
	}
}

// ---------------------------------------------------------------------------
// Level 5: pulleys

function level5(rng: Rng): Built {
	const r = rng.next();
	if (r < 0.2) {
		const P = q(10 * rng.int(5, 80));
		return {
			kind: 'value',
			prompt: 'Trova la forza.',
			problem: textBlock(`Con una carrucola fissa si tiene sollevato un secchio che pesa ${pv(P, 'N', INT)}. Con quale forza bisogna tirare la fune?`),
			solution: `F = ${N(P)}`,
			steps: [t('La carrucola fissa è una leva di primo genere con i bracci uguali: è indifferente.'), `F = P = ${N(P)}`],
			truth: P,
			unit: 'N',
			format: INT,
			mistakes: [P.div(n(2)), P.mul(n(2)), P.div(n(4))],
			params: { case: 'fissa' },
		};
	}
	if (r < 0.55) {
		const P = q(20 * rng.int(3, 45));
		return {
			kind: 'value',
			prompt: 'Trova la forza.',
			problem: textBlock(`Con una carrucola mobile di peso trascurabile si tiene sollevato un carico che pesa ${pv(P, 'N', INT)}. Con quale forza bisogna tirare la fune?`),
			solution: `F = ${N(P.div(n(2)))}`,
			steps: [t('Il carico è retto da due tratti di fune, e ciascuno ne regge metà.'), `F = \\frac{P}{2} = \\frac{${N(P)}}{2} = ${N(P.div(n(2)))}`],
			truth: P.div(n(2)),
			unit: 'N',
			format: INT,
			mistakes: [P, P.mul(n(2)), P.div(n(4))],
			params: { case: 'mobile' },
		};
	}
	if (r < 0.8) {
		for (;;) {
			const P = q(10 * rng.int(5, 80)), p = q(10 * rng.int(1, 6));
			const F = P.add(p).div(n(2));
			if (!F.isInteger()) continue;
			return {
				kind: 'value',
				prompt: 'Trova la forza.',
				problem: textBlock(`Una carrucola mobile che pesa ${pv(p, 'N', INT)} regge un carico che pesa ${pv(P, 'N', INT)}. Con quale forza bisogna tirare la fune per tenere fermo il carico?`),
				solution: `F = ${N(F)}`,
				steps: [t('I due tratti di fune reggono insieme il carico e la carrucola:'), `F = \\frac{P + p}{2} = \\frac{${N(P)} + ${N(p)}}{2} = ${N(F)}`],
				truth: F,
				unit: 'N',
				format: INT,
				// the pulley's weight forgotten; not halved; the pulley's weight not halved
				mistakes: [P.div(n(2)), P.add(p), P.div(n(2)).add(p)],
				params: { case: 'mobile-peso' },
			};
		}
	}
	const h = pickStep(rng, 5, 30, q(1, 10));
	return {
		kind: 'value',
		prompt: 'Trova la fune da tirare.',
		problem: textBlock(`Con una carrucola mobile si solleva un carico di ${pv(h, 'm', S2)}. Quanti metri di fune bisogna tirare?`),
		solution: `${vq(h.mul(n(2)), 'm', S2)}`,
		steps: [t('Si accorciano tutti e due i tratti di fune che reggono il carico:'), `2 \\cdot ${vq(h, 'm', S2)} = ${vq(h.mul(n(2)), 'm', S2)}`],
		truth: h.mul(n(2)),
		unit: 'm',
		format: S2,
		// as far as the load; half of it; four times
		mistakes: [h, h.div(n(2)), h.mul(n(4))],
		params: { case: 'fune' },
	};
}

// ---------------------------------------------------------------------------

const LEVELS: Record<number, (rng: Rng) => Built> = { 1: level1, 2: level2, 3: level3, 4: level4, 5: level5 };

function check(sample: Sample): string[] {
	const v = commonCheck(sample);
	const choice = sample.level <= 2;
	if (choice !== (sample.answer.kind === 'choice')) v.push('tipo di risposta sbagliato per il livello');
	if (sample.answer.kind === 'choice' && sample.answer.options.length !== 3) v.push('servono tre opzioni');
	if (sample.level >= 2 && sample.level <= 4 && !sample.scene) v.push('manca la scena');
	return v;
}

export const fisLeve: Generator = {
	id: ID,
	title: 'Le leve e le macchine semplici',
	levels: {
		1: { label: 'Il genere della leva', constraints: ['un oggetto della lezione (50%) o una figura (50%)', 'tre opzioni'] },
		2: { label: 'Vantaggiosa o svantaggiosa', constraints: ['leva di primo genere con i bracci (60%), di secondo o terzo genere (40%)'] },
		3: { label: 'La forza motrice', constraints: ['F_m = F_r b_r / b_m, i tre generi', 'risultato intero'] },
		4: { label: 'Il braccio e il fulcro', constraints: ['il braccio motore (60%) o dove va il fulcro (40%)'] },
		5: { label: 'Le carrucole', constraints: ['fissa, mobile, mobile con il suo peso, la fune da tirare'] },
	},
	generate: generateWith(ID, LEVELS, check),
	check,
	toChoice,
};

export default fisLeve;
