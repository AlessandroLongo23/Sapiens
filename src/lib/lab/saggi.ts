/*
 * The chemistry of the flame tests, without any drawing: the ions and the colour each gives a flame, and the state of
 * the bench (what is on the wire loop, what is in each sample), which changes only through actions. The state is
 * plain data: it can be saved, sent and replayed, and the same actions give the same state.
 *
 * The model is small. The loop carries an amount of each ion. Acid takes most of it off and wets the loop; a wet
 * loop picks a full dose from a sample, a dry one a quarter; a loop that still carries something leaves part of it in
 * the sample it touches. In the flame each ion glows with its own strength (sodium far more than the rest, potassium
 * little) and burns off in a few seconds (sodium more slowly). What the eye sees is the mix, weighted by strength:
 * a trace of sodium is enough to hide potassium.
 *
 * The colours are those of school tables of flame tests; seen through cobalt glass they follow the tables of
 * qualitative analysis (sodium disappears, potassium shows crimson). The strengths and the burning times are chosen
 * to play well, not measured.
 */

export type Ion = 'Li' | 'Na' | 'K' | 'Ca' | 'Sr' | 'Ba' | 'Cu';
export type SampleId = Ion | 'Mix' | 'X' | 'Y';
/** What an unknown sample can be said to be: one of the metals, or sodium and potassium together. */
export type Answer = Ion | 'NaK';

type RGB = [number, number, number];

export type IonInfo = {
	/** The metal, as the student names it. */
	name: string;
	salt: string;
	/** The flame's colour, sRGB 0..1, and its name in the notebook. */
	color: RGB;
	colorName: string;
	/** How strongly it colours the flame, against the others. */
	intensity: number;
	/** How much of a dose burns off in a second. */
	burn: number;
	/**
	 * Seen through cobalt glass: the colour, and how much of the strength is left. A filter only takes light away:
	 * potassium's figure is above one because its strength by eye is set low against sodium's, not because the glass adds.
	 */
	cobalt: { color: RGB; pass: number };
	/** The strongest emission in the visible: not shown yet, kept for a spectroscope. */
	lines: string;
};

export const ION_ORDER: Ion[] = ['Li', 'Na', 'K', 'Ca', 'Sr', 'Ba', 'Cu'];

export const IONS: Record<Ion, IonInfo> = {
	Li: { name: 'litio', salt: 'LiCl', color: [0.85, 0.0, 0.3], colorName: 'rosso carminio', intensity: 1.6, burn: 0.2, cobalt: { color: [0.85, 0.1, 0.35], pass: 0.45 }, lines: '671 nm' },
	Na: { name: 'sodio', salt: 'NaCl', color: [1, 0.85, 0.05], colorName: 'giallo intenso', intensity: 5, burn: 0.11, cobalt: { color: [0.2, 0.2, 0.5], pass: 0.012 }, lines: '589 nm' },
	K: { name: 'potassio', salt: 'KCl', color: [0.74, 0.56, 1], colorName: 'lilla', intensity: 0.5, burn: 0.15, cobalt: { color: [0.7, 0.12, 0.62], pass: 1.1 }, lines: '766 e 404 nm' },
	Ca: { name: 'calcio', salt: 'CaCl₂', color: [1, 0.5, 0.04], colorName: 'rosso arancio', intensity: 1.3, burn: 0.2, cobalt: { color: [0.45, 0.7, 0.45], pass: 0.15 }, lines: '622 e 554 nm' },
	Sr: { name: 'stronzio', salt: 'SrCl₂', color: [1, 0.2, 0.0], colorName: 'rosso scarlatto', intensity: 1.6, burn: 0.2, cobalt: { color: [0.7, 0.15, 0.6], pass: 0.35 }, lines: '606 e 461 nm' },
	Ba: { name: 'bario', salt: 'BaCl₂', color: [0.66, 0.95, 0.26], colorName: 'verde giallo', intensity: 0.9, burn: 0.2, cobalt: { color: [0.25, 0.6, 0.6], pass: 0.2 }, lines: '524 e 554 nm' },
	Cu: { name: 'rame', salt: 'CuCl₂', color: [0.08, 0.88, 0.66], colorName: 'verde azzurro', intensity: 1.3, burn: 0.2, cobalt: { color: [0.15, 0.4, 0.95], pass: 0.5 }, lines: '510-555 nm' }
};

export const SAMPLE_ORDER: SampleId[] = ['Li', 'Na', 'K', 'Ca', 'Sr', 'Ba', 'Cu', 'Mix', 'X', 'Y'];
/** The salts whose colour the student learns first. */
export const KNOWN: Ion[] = ION_ORDER;

export const ANSWERS: { id: Answer; text: string }[] = [...ION_ORDER.map((id) => ({ id: id as Answer, text: IONS[id].name })), { id: 'NaK', text: 'sodio e potassio' }];

export type Load = Record<Ion, number>;

export type SaggiState = {
	loop: {
		load: Load;
		/** Wet with acid: salt sticks to it. */
		wet: boolean;
		/** °C. */
		temp: number;
		/** The sample it touched last, until it is clean again. */
		last: SampleId | null;
	};
	samples: Record<SampleId, { ions: Partial<Load>; taint: Partial<Load> }>;
	/** What the unknown samples are. */
	unknown: { X: Ion; Y: Answer };
};

export type SaggiAction =
	| { type: 'acid' }
	| { type: 'touch'; sample: SampleId }
	/** `dt` seconds in the burner's flame, lit or not. */
	| { type: 'flame'; dt: number; lit: boolean }
	/** `dt` seconds out of it. */
	| { type: 'air'; dt: number }
	/** A contaminated sample is taken away and a fresh one put in its place. */
	| { type: 'replace'; sample: SampleId };

export type SaggiEvent =
	| { type: 'sizzle' }
	| { type: 'picked'; sample: SampleId; dry: boolean }
	| { type: 'tainted'; sample: SampleId; by: Ion[] }
	| { type: 'burnt' };

const zero = (): Load => ({ Li: 0, Na: 0, K: 0, Ca: 0, Sr: 0, Ba: 0, Cu: 0 });

/** A small seeded generator (mulberry32): the unknown samples are the same for the same seed. */
export function seeded(seed: number) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** X is one of the white salts (copper chloride is green: it would give itself away); Y is sodium, alone or with potassium. */
export const X_CHOICES: Ion[] = ['Li', 'K', 'Ca', 'Sr', 'Ba'];

export function initial(seed: number): SaggiState {
	const rnd = seeded(seed);
	const X = X_CHOICES[Math.floor(rnd() * X_CHOICES.length) % X_CHOICES.length];
	const Y: Answer = rnd() < 0.5 ? 'Na' : 'NaK';
	const samples = {} as SaggiState['samples'];
	for (const id of ION_ORDER) samples[id] = { ions: { [id]: 1 }, taint: {} };
	samples.Mix = { ions: { Na: 1, K: 1 }, taint: {} };
	samples.X = { ions: { [X]: 1 }, taint: {} };
	samples.Y = { ions: Y === 'NaK' ? { Na: 1, K: 1 } : { Na: 1 }, taint: {} };
	// a wire that has been handled carries sodium from the fingers: the first time in the flame it burns yellow
	return { loop: { load: { ...zero(), Na: 0.2 }, wet: false, temp: 20, last: null }, samples, unknown: { X, Y } };
}

/** How much the loop would colour a flame: under `CLEAN` it shows nothing. */
export function dirt(load: Load) {
	let s = 0;
	for (const i of ION_ORDER) s += load[i] * IONS[i].intensity;
	return s;
}

export const CLEAN = 0.03;
export const isClean = (s: SaggiState) => dirt(s.loop.load) < CLEAN;

const ROOM = 20;
const HOT = 950;

/** Applies an action to the state, in place; returns what happened, for the messages and the effects. */
export function apply(s: SaggiState, a: SaggiAction): SaggiEvent[] {
	const ev: SaggiEvent[] = [];
	const loop = s.loop;
	switch (a.type) {
		case 'acid': {
			if (loop.temp > 150) ev.push({ type: 'sizzle' });
			loop.temp = Math.min(loop.temp, 60);
			for (const i of ION_ORDER) loop.load[i] *= 0.2;
			loop.wet = true;
			break;
		}
		case 'touch': {
			const sample = s.samples[a.sample];
			// what the loop still carries stays in the sample
			if (dirt(loop.load) >= CLEAN) {
				const by: Ion[] = [];
				for (const i of ION_ORDER) {
					if (loop.load[i] * IONS[i].intensity < CLEAN / 2 || sample.ions[i]) continue;
					sample.taint[i] = Math.min(1, (sample.taint[i] ?? 0) + loop.load[i] * 0.5);
					by.push(i);
				}
				if (by.length) ev.push({ type: 'tainted', sample: a.sample, by });
			}
			const dose = loop.wet ? 1 : 0.25;
			for (const i of ION_ORDER) loop.load[i] = Math.min(1.2, loop.load[i] + ((sample.ions[i] ?? 0) + (sample.taint[i] ?? 0)) * dose);
			ev.push({ type: 'picked', sample: a.sample, dry: !loop.wet });
			loop.wet = false;
			loop.last = a.sample;
			break;
		}
		case 'flame': {
			if (!a.lit) {
				loop.temp += (ROOM - loop.temp) * (1 - Math.exp(-a.dt * 0.5));
				break;
			}
			loop.temp += (HOT - loop.temp) * (1 - Math.exp(-a.dt * 2.5));
			loop.wet = false;
			const before = dirt(loop.load);
			for (const i of ION_ORDER) loop.load[i] = Math.max(0, loop.load[i] - IONS[i].burn * a.dt);
			if (before >= CLEAN && dirt(loop.load) < CLEAN) {
				ev.push({ type: 'burnt' });
				loop.last = null;
			}
			break;
		}
		case 'air': {
			loop.temp += (ROOM - loop.temp) * (1 - Math.exp(-a.dt * 0.5));
			break;
		}
		case 'replace': {
			s.samples[a.sample].taint = {};
			break;
		}
	}
	return ev;
}

export type Emission = {
	/** The flame's colour, sRGB 0..1. */
	color: RGB;
	/** How much of the flame is coloured, 0..1. */
	amount: number;
	/** Each ion's part of the light, 0..1. */
	share: Load;
	dominant: Ion | null;
};

const smooth = (a: number, b: number, x: number) => {
	const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
	return t * t * (3 - 2 * t);
};

/**
 * What the loop gives the flame now. `air` is the burner's collar, 0 closed to 1 open: in the yellow flame of a closed
 * collar the colours are lost. `cobalt`: seen through cobalt glass.
 */
export function emission(s: SaggiState, air: number, cobalt = false): Emission {
	const share = zero();
	let total = 0;
	const color: RGB = [0, 0, 0];
	for (const i of ION_ORDER) {
		const info = IONS[i];
		// a dose glows fully until little is left of it, then fades
		const e = info.intensity * Math.min(1, s.loop.load[i] * 4) * (cobalt ? info.cobalt.pass : 1);
		share[i] = e;
		total += e;
		const c = cobalt ? info.cobalt.color : info.color;
		for (let k = 0; k < 3; k++) color[k] += c[k] * e;
	}
	let dominant: Ion | null = null;
	if (total > 1e-6) {
		for (let k = 0; k < 3; k++) color[k] /= total;
		for (const i of ION_ORDER) {
			share[i] /= total;
			if (!dominant || share[i] > share[dominant]) dominant = i;
		}
	}
	const seen = smooth(0.35, 0.7, air);
	return { color, amount: Math.min(1, total) * seen, share, dominant: total > 1e-6 ? dominant : null };
}

export type Verdict =
	/** Nothing to see: the loop is clean, or the flame hides the colour. */
	| { kind: 'none' }
	/** The colour of what the loop touched last, and nothing else. */
	| { kind: 'pure'; sample: SampleId }
	/** Something else colours the flame too. */
	| { kind: 'dirty'; sample: SampleId | null; by: Ion };

/** Whether the flame shows what the loop touched last, clean enough to be read. */
export function verdict(s: SaggiState, em: Emission): Verdict {
	if (em.amount < 0.2 || !em.dominant) return { kind: 'none' };
	const last = s.loop.last;
	const own = last ? s.samples[last].ions : {};
	let stray: Ion | null = null;
	for (const i of ION_ORDER) if (!own[i] && em.share[i] > 0.12 && (!stray || em.share[i] > em.share[stray])) stray = i;
	if (stray || !last) return { kind: 'dirty', sample: last, by: stray ?? em.dominant };
	return { kind: 'pure', sample: last };
}

/** Whether a sample holds something that is not its own (a loop that was not clean touched it). */
export function tainted(s: SaggiState, id: SampleId) {
	return ION_ORDER.some((i) => (s.samples[id].taint[i] ?? 0) > 0);
}

/** What a sample is, in the terms of an answer. */
export function truth(s: SaggiState, id: 'X' | 'Y'): Answer {
	return s.unknown[id];
}

/** The colour name the notebook writes next to a sample seen with a clean loop. */
export function seenAs(s: SaggiState, id: SampleId): string {
	if (id === 'Mix') return `${IONS.Na.colorName}: il sodio copre il potassio`;
	const ions = s.samples[id].ions;
	const first = ION_ORDER.find((i) => ions[i]);
	return first ? IONS[first].colorName : '';
}
