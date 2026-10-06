/*
 * The chemistry of the acid-base titration, without any drawing: a burette of sodium hydroxide, three flasks that
 * take a sample of hydrochloric acid of unknown concentration and a few drops of phenolphthalein, and the state of
 * each, which changes only through actions. The state is plain data: it can be saved, sent and replayed, and the same
 * actions give the same state.
 *
 * The model is small. A strong acid and a strong base: what is in a flask is the moles of each, and the difference
 * decides everything. The base that has just fallen from the burette is not yet mixed: it colours the place where it
 * falls, and joins the rest quickly if the flask is swirled, slowly if it stands, and more slowly the less acid is
 * left to meet it. That is what a student sees: a pink flash that takes longer and longer to go as the end point
 * comes near.
 *
 * The pH is the textbook one (complete dissociation, 25 °C). How deep the pink is past the end point, and how fast
 * the fresh base mixes, are chosen to play well, not measured.
 */

export type FlaskId = 1 | 2 | 3;
export const FLASKS: FlaskId[] = [1, 2, 3];

/** The sodium hydroxide in the burette, mol/L, and the volume the pipette delivers, mL. */
export const C_BASE = 0.1;
export const SAMPLE = 25;
/** A drop from the burette's tip, mL. */
export const DROP = 0.05;
/** The burette: the scale runs from 0 (top) to 25 mL; there is room above the zero and a little under the 25. */
export const BURETTE = { scale: 25, above: 4.5, below: 1.2, air: 0.3 };
/** Two accurate titrations agree if they are within this, mL. */
export const CONCORDANT = 0.2;
/** A reading counts if it is within this of the meniscus, mL: half a division, as far as the eye goes. */
export const READ_TOL = 0.05;

export type Flask = {
	/** mL of liquid in it. */
	vol: number;
	/** mol of acid put in, and of base mixed in so far. */
	acid: number;
	base: number;
	/** mol of base fallen in and not yet mixed. */
	fresh: number;
	/** Drops of indicator. */
	drops: number;
	/** mL of titrant it has received. */
	titrant: number;
};

export type TitState = {
	/** The unknown, mol/L. */
	cAcid: number;
	flasks: Record<FlaskId, Flask>;
	burette: {
		/** What the scale reads at the meniscus, mL: 0 at the top mark, negative above it. Empty at `empty`. */
		level: number;
		/** mL of air still in the tip: the first liquid through the stopcock fills it and does not come out. */
		air: number;
	};
	/** mL run into the waste beaker. */
	waste: number;
};

export type TitAction =
	/** Sodium hydroxide poured into the burette, mL. */
	| { type: 'fill'; ml: number }
	/** The stopcock lets `ml` through, into a flask or the waste beaker. */
	| { type: 'run'; ml: number; into: FlaskId | 'waste' }
	/** The pipette empties `ml` of the sample into a flask. */
	| { type: 'sample'; flask: FlaskId; ml: number }
	| { type: 'indicator'; flask: FlaskId; drops: number }
	/** Time passes in a flask, swirled or standing. */
	| { type: 'mix'; flask: FlaskId; dt: number; swirl: boolean };

/** What an action did: how much really went (a burette has only so much in it, and so much room). */
export type TitEvent = { type: 'filled'; ml: number } | { type: 'ran'; ml: number; delivered: number } | { type: 'primed' };

/** A small deterministic generator (mulberry32). */
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

/** The reading of an empty burette (the meniscus at the stopcock), and of one full to the brim. */
export const emptyLevel = BURETTE.scale + BURETTE.below;
export const fullLevel = -BURETTE.above;

const emptyFlask = (): Flask => ({ vol: 0, acid: 0, base: 0, fresh: 0, drops: 0, titrant: 0 });

/**
 * The bench at the start: the burette empty, with air in its tip, and an acid between 0.0520 and 0.0742 mol/L, so
 * that 25.0 mL of it take between 13.0 and 18.55 mL of base.
 */
export function initial(seed: number): TitState {
	const rnd = seeded(seed);
	const cAcid = Math.round((0.052 + Math.floor(rnd() * 75) * 0.0003) * 1e4) / 1e4;
	return { cAcid, flasks: { 1: emptyFlask(), 2: emptyFlask(), 3: emptyFlask() }, burette: { level: emptyLevel, air: BURETTE.air }, waste: 0 };
}

/** mL of liquid in the burette above the stopcock. */
export const inBurette = (s: TitState) => emptyLevel - s.burette.level;

/** Whether the meniscus is on the scale, where it can be read. */
export const onScale = (s: TitState) => s.burette.level >= 0 && s.burette.level <= BURETTE.scale;

/** mL of base that exactly neutralise what a flask holds (0 if it has no sample). */
export const equivalence = (f: Flask) => (f.acid / C_BASE) * 1000;

/** mL of base beyond the equivalence, counting what is not yet mixed too (negative before it). */
export const beyond = (f: Flask) => ((f.base + f.fresh - f.acid) / C_BASE) * 1000;

export function apply(s: TitState, a: TitAction): TitEvent[] {
	const b = s.burette;
	switch (a.type) {
		case 'fill': {
			const ml = Math.max(0, Math.min(a.ml, b.level - fullLevel));
			b.level -= ml;
			return [{ type: 'filled', ml }];
		}
		case 'run': {
			const ml = Math.max(0, Math.min(a.ml, emptyLevel - b.level));
			b.level += ml;
			// the air in the tip goes first
			const air = Math.min(b.air, ml);
			b.air -= air;
			const delivered = ml - air;
			if (a.into === 'waste') s.waste += delivered;
			else {
				const f = s.flasks[a.into];
				f.vol += delivered;
				f.titrant += delivered;
				f.fresh += (delivered * C_BASE) / 1000;
			}
			const out: TitEvent[] = [{ type: 'ran', ml, delivered }];
			if (air > 0 && b.air <= 1e-9) out.push({ type: 'primed' });
			return out;
		}
		case 'sample': {
			const f = s.flasks[a.flask];
			f.vol += a.ml;
			f.acid += (a.ml * s.cAcid) / 1000;
			return [];
		}
		case 'indicator': {
			const f = s.flasks[a.flask];
			f.drops += a.drops;
			f.vol += a.drops * 0.04;
			return [];
		}
		case 'mix': {
			const f = s.flasks[a.flask];
			if (f.fresh <= 0) return [];
			// swirled, the fresh base is gone in a fraction of a second; standing, it takes seconds. The less acid is left
			// to meet it, the longer the pink stays: full speed with 0.25 mmol to go, a sixth of it at the end point
			// (past the equivalence nothing holds it back: it only has to spread)
			const left = f.acid - f.base;
			const pace = left <= 0 ? 1 : 0.16 + 0.84 * Math.min(1, left / 0.00025);
			const k = (a.swirl ? 5 : 0.3) * pace;
			const moved = f.fresh * (1 - Math.exp(-k * a.dt));
			f.fresh -= moved;
			f.base += moved;
			if (f.fresh < 1e-10) {
				f.base += f.fresh;
				f.fresh = 0;
			}
			return [];
		}
	}
}

/** The pH of what is mixed in a flask (complete dissociation, 25 °C): 7 with nothing in excess. */
export function pH(f: Flask) {
	if (f.vol <= 0) return 7;
	const excess = ((f.acid - f.base) / f.vol) * 1000;
	if (excess > 1e-7) return -Math.log10(excess);
	if (excess < -1e-7) return 14 + Math.log10(-excess);
	return 7;
}

export type Look = {
	/** How pink the whole solution is, 0 (colourless) to 1 (deep fuchsia). */
	pink: number;
	/** How strong the pink cloud is where the base falls, 0 to 1. */
	cloud: number;
};

/**
 * What the flask shows. Without indicator, nothing ever. With it, the mixed solution is colourless up to the
 * equivalence and pink past it, deeper with every drop too many (one drop: pale; 0.3 mL: fuchsia). The fresh base
 * shows as a cloud where it falls.
 */
export function look(f: Flask): Look {
	const dye = Math.min(1, f.drops / 2);
	if (dye <= 0 || f.vol <= 0) return { pink: 0, cloud: 0 };
	const over = ((f.base - f.acid) / C_BASE) * 1000;
	const pink = over > 0 ? (1 - Math.exp(-over / 0.25)) * dye : 0;
	const cloud = Math.min(1, f.fresh / ((0.3 * C_BASE) / 1000)) * dye;
	return { pink, cloud };
}

/** The end point: the pink is in the whole solution and stays, with nothing left to mix. */
export const atEndPoint = (f: Flask) => f.drops > 0 && f.acid > 0 && f.fresh < 2e-7 && f.base > f.acid;

/** How a finished titration went, by the mL of base past the equivalence. */
export function quality(f: Flask): 'drop' | 'good' | 'over' | 'far' {
	const over = beyond(f);
	return over <= DROP + 1e-6 ? 'drop' : over <= 0.15 ? 'good' : over <= 0.6 ? 'over' : 'far';
}

/** The nearest value a student can write for a reading: steps of 0.05 mL. */
export const roundReading = (ml: number) => Math.round(ml / READ_TOL) * READ_TOL;

/** Whether what the student wrote is the meniscus, to half a division. */
export const readsRight = (written: number, level: number) => Math.abs(written - level) <= READ_TOL + 1e-9;

/** The acid's concentration from the mean volume of base, mol/L. */
export const concentration = (meanMl: number) => (C_BASE * meanMl) / SAMPLE;

/** Whether two titres agree. */
export const concordant = (a: number, b: number) => Math.abs(a - b) <= CONCORDANT + 1e-9;
