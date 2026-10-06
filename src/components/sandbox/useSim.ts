'use client';

import { useEffect, useMemo, useState } from 'react';
import { useFrameLoop, useReducedMotion } from '@/components/content/interactive/kit';
import { advance, initial, solve, type Scene, type Solution, type State } from '@/lib/sandbox/engine';

/** Seconds after which a scene stops by itself. */
const T_MAX = 20;

/**
 * A scene in time: the states recorded so far, the one shown, and the clock. A new scene starts from its beginning.
 * Going on from an instant in the past drops what was recorded after it.
 */
export function useSim(scene: Scene, speed = 1) {
	const [sim, setSim] = useState(() => ({ scene, frames: [initial(scene)], cursor: 0 }));
	const [playing, setPlaying] = useState(false);
	const reduced = useReducedMotion();

	let now = sim;
	if (sim.scene !== scene) {
		now = { scene, frames: [initial(scene)], cursor: 0 };
		setSim(now);
		if (playing) setPlaying(false);
	}
	const { frames, cursor } = now;
	const state = frames[Math.min(cursor, frames.length - 1)];
	// A scene the student has put together can be one the engine cannot settle: then nothing pushes and nothing moves.
	const [solution, broken] = useMemo((): [Solution, boolean] => {
		try {
			return [solve(scene, state), false];
		} catch {
			return [{ acc: scene.bodies.map(() => ({ x: 0, y: 0 })), forces: scene.bodies.map(() => []), tensions: scene.ropes.map(() => 0) }, true];
		}
	}, [scene, state]);
	const done = !!state.ended || state.t >= T_MAX;
	// Nothing moves and nothing will: the clock stops by itself.
	const still = solution.acc.every((a) => Math.hypot(a.x, a.y) < 1e-7) && state.vel.every((u) => Math.hypot(u.x, u.y) < 1e-7);
	const running = playing && !still && !done;

	const forward = (dt: number) => {
		let next: State;
		try {
			next = advance(scene, state, dt);
		} catch {
			return setPlaying(false);
		}
		setSim({ scene, frames: [...frames.slice(0, cursor + 1), next], cursor: cursor + 1 });
		if (next.ended || next.t >= T_MAX) setPlaying(false);
	};
	useFrameLoop(running, (dt) => forward(dt * speed));

	return {
		frames,
		cursor,
		state,
		solution,
		running,
		broken,
		done,
		still,
		forward: (dt: number) => { setPlaying(false); forward(dt); },
		play: () => {
			if (running) return setPlaying(false);
			if (done || still) return;
			if (reduced) return forward(1);
			setPlaying(true);
		},
		restart: () => { setPlaying(false); setSim({ scene, frames: [initial(scene)], cursor: 0 }); },
		seek: (i: number) => { setPlaying(false); setSim({ scene, frames, cursor: i }); }
	};
}

/**
 * The whole course of a scene from its start, worked out a moment after the scene stops changing (not at every step
 * of a drag): a state every thirtieth of a second until the scene ends, comes to rest, or `horizon` seconds pass.
 * For the graphs, which set their axes on it and draw it before the clock starts. Null while it is being worked out.
 */
export function usePreview(scene: Scene, on = true, horizon = 8): State[] | null {
	const [done, setDone] = useState<{ scene: Scene; states: State[] } | null>(null);
	useEffect(() => {
		if (!on) return;
		const id = setTimeout(() => {
			const states = [initial(scene)];
			try {
				while (states.length < horizon * 30) {
					const last = states[states.length - 1];
					if (last.ended) break;
					const acc = solve(scene, last).acc;
					if (acc.every((a) => Math.hypot(a.x, a.y) < 1e-7) && last.vel.every((u) => Math.hypot(u.x, u.y) < 1e-7)) break;
					states.push(advance(scene, last, 1 / 30));
				}
			} catch {
				// a scene the engine cannot settle has no course: the graph shows what it has
			}
			setDone({ scene, states });
		}, 150);
		return () => clearTimeout(id);
	}, [scene, on, horizon]);
	return done?.scene === scene ? done.states : null;
}
