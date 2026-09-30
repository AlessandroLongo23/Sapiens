'use client';

import { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, useFrameLoop, useReducedMotion, THICK, INK } from '../kit';
import { Words } from '../fisica/calore';
import { collide, particle, step, type Box, type Particle } from './gas';

/**
 * Chemistry lesson 29 (La teoria cinetico-molecolare): two equal containers, helium above and argon below, at the same
 * temperature and with the same number of atoms. Each has a wall with a small hole towards an empty chamber on the
 * right; "Apri i fori" opens both holes. The atoms move in straight lines and bounce off the walls and off each other
 * (elastic collisions between discs of the same gas, gas.tsx). At the same temperature the two gases have the same
 * mean kinetic energy, so the speeds go as 1/√m: argon (M = 39,95) is ten times heavier than helium (M = 4,00) and
 * about 3,2 times slower, and it reaches the hole, and gets through it, about 3,2 times less often (Graham's law of
 * effusion). A slider changes the temperature from 100 to 600 K, and every speed with it, as √T.
 *
 * Why not a single box with the two gases mixing: in a closed box two gases that interdiffuse cross the middle at the
 * same rate (one flux balances the other), and the figure would show nothing about the masses.
 *
 * Under the drawing: the mean speeds of the real gases at that temperature, v = √(8RT/(πM)), the mean of the Maxwell
 * distribution, and how many atoms of each gas have gone through the hole at least once (some come back, but the
 * count does not go down). The drawing's speeds are the real ones scaled down
 * so that the eye can follow them: helium at 300 K, 1260 m/s, goes at 1,5 cm/s.
 */

const W = 6, LANE = 1.5, GAP = 0.12; // the two containers are 6 × 1,5 cm, one above the other
const WALL = 2.6; // the wall with the hole, from the left
const HOLE = 0.3; // half the hole's height
const N_EACH = 26;
const R_HE = 0.07, R_AR = 0.1; // radii in the drawing (argon atoms are bigger)
const M_HE = 4.0, M_AR = 39.95; // g/mol
const T0 = 300;
const SCALE = 1.5 / 1260; // drawing cm/s per real m/s
const f = frame(-0.15, W + 0.15, -0.2, 2 * LANE + GAP + 0.15);

/** The mean speed of a gas's particles, m/s: √(8RT/(πM)), M in kg/mol. */
const speed = (T: number, M: number) => Math.sqrt((8 * 8.314 * T) / (Math.PI * (M / 1000)));
const drawn = (T: number, M: number) => speed(T, M) * SCALE;

/** An atom, and whether it has already been through the hole once (the count never goes back). */
type Atom = Particle & { he: boolean; out: boolean };
/** The lane of a gas: helium above, argon below. */
const lane = (he: boolean) => (he ? { y0: LANE + GAP, y1: 2 * LANE + GAP } : { y0: 0, y1: LANE });
const holeY = (he: boolean) => (lane(he).y0 + lane(he).y1) / 2;

function start(T: number): Atom[] {
	const make = (he: boolean) => {
		const b: Box = { x0: 0, x1: WALL, ...lane(he) };
		return Array.from({ length: N_EACH }, () => ({ ...particle(b, he ? R_HE : R_AR, drawn(T, he ? M_HE : M_AR)), he, out: false }));
	};
	return [...make(true), ...make(false)];
}

/** Where an atom can move now: its whole lane if it is in front of an open hole, otherwise its side of the wall. */
function boxOf(a: Atom, open: boolean): Box {
	const L = lane(a.he);
	const r = a.he ? R_HE : R_AR;
	if (open && Math.abs(a.y - holeY(a.he)) < HOLE - r) return { x0: 0, x1: W, ...L };
	return a.x < WALL ? { x0: 0, x1: WALL - 0.04, ...L } : { x0: WALL + 0.04, x1: W, ...L };
}

export default function GasEffusione({ alt }: { alt?: string }) {
	const [T, setTState] = useState(T0);
	const [open, setOpen] = useState(false);
	const [atoms, setAtoms] = useState<Atom[]>(() => start(T0));
	const reduced = useReducedMotion();

	useFrameLoop(!reduced, (dt) => {
		setAtoms((prev) => {
			const next = prev.map((a) => ({ ...a }));
			// two sub-steps per frame, so fast helium atoms do not jump through each other
			for (let k = 0; k < 2; k++) {
				for (const a of next) {
					step(a, boxOf(a, open), a.he ? R_HE : R_AR, dt / 2);
					if (a.x > WALL) a.out = true;
				}
				for (let i = 0; i < next.length; i++)
					for (let j = i + 1; j < next.length; j++) {
						const a = next[i], b = next[j];
						if (a.he !== b.he) continue;
						const r = a.he ? R_HE : R_AR;
						collide(a, b, r, r, 1, 1);
					}
			}
			return next;
		});
	});

	const setT = (x: number) => {
		const k = Math.sqrt(x / T);
		setAtoms((prev) => prev.map((a) => ({ ...a, vx: a.vx * k, vy: a.vy * k })));
		setTState(x);
	};
	const reset = () => {
		setOpen(false);
		setAtoms(start(T));
	};

	const heOut = atoms.filter((a) => a.he && a.out).length;
	const arOut = atoms.filter((a) => !a.he && a.out).length;

	const caption = !open
		? 'Due recipienti uguali, alla stessa temperatura: sopra elio, sotto argon, con lo stesso numero di atomi. Apri i fori e guarda quale gas passa prima nella camera vuota.'
		: heOut >= arOut + 3
			? `Gli atomi di elio, più leggeri e più veloci, arrivano al foro più spesso e passano prima: ${heOut} contro ${arOut}. Con il tempo tutti e due i gas si distribuiscono nelle due camere.`
			: `I fori sono aperti. Atomi passati dal foro: elio ${heOut}, argon ${arOut}.`;

	const px = f.W / (f.x1 - f.x0);
	const walls = (he: boolean) => {
		const { y0, y1 } = lane(he);
		const hy = holeY(he);
		return (
			<g key={String(he)}>
				<path d={f.path([v(0, y0), v(W, y0), v(W, y1), v(0, y1)], true)} fill="none" stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(WALL, y0), v(WALL, hy - HOLE)])} stroke="#000" strokeWidth={THICK * 1.6} />
				<path d={f.path([v(WALL, hy + HOLE), v(WALL, y1)])} stroke="#000" strokeWidth={THICK * 1.6} />
				{!open && <path d={f.path([v(WALL, hy - HOLE), v(WALL, hy + HOLE)])} stroke="#888" strokeWidth={THICK * 1.6} />}
			</g>
		);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{walls(true)}
				{walls(false)}
				{atoms.map((a, i) => {
					const c = f.px(v(a.x, a.y));
					return <circle key={i} cx={c.x} cy={c.y} r={(a.he ? R_HE : R_AR) * px} fill={a.he ? INK.orange : '#6666ff'} stroke="#000" strokeWidth={0.4} />;
				})}
				<Words f={f} at={v(W - 0.1, 2 * LANE + GAP - 0.2)} anchor="end" size={12} color={INK.orange}>
					elio
				</Words>
				<Words f={f} at={v(W - 0.1, LANE - 0.2)} anchor="end" size={12} color="#4d4dcc">
					argon
				</Words>
			</Drawing>

			<Readout>
				<Tex>{`\\bar v_{\\mathrm{He}} \\approx ${Math.round(speed(T, M_HE) / 10) * 10}\\,\\text{m/s}`}</Tex>
				<Tex>{`\\bar v_{\\mathrm{Ar}} \\approx ${Math.round(speed(T, M_AR) / 10) * 10}\\,\\text{m/s}`}</Tex>
				<span>
					elio passato: {heOut} di {N_EACH}
				</span>
				<span>
					argon passato: {arOut} di {N_EACH}
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<Slider label="Temperatura T" unit="K" value={T} min={100} max={600} step={10} onChange={setT} />
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={open} onClick={() => setOpen(true)}>
						<Play className="size-4" aria-hidden="true" />
						Apri i fori
					</Button>
					<Button variant="secondary" size="sm" disabled={!open} onClick={reset}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
