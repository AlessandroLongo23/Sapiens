'use client';

import { memo, useMemo, type ReactNode } from 'react';
import { Tex, texNum } from '@/components/content/interactive/kit';
import { energy, solve, type Force, type Scene, type State } from '@/lib/sandbox/engine';
import { forceName } from './SceneDrawing';

const tidy = (x: number, digits = 2) => texNum(Math.abs(x) < 5e-7 ? 0 : x, digits);

/**
 * Rows of "name, symbol = value" with the symbols in a column of their own, as wide as the widest: every symbol starts
 * at the left and every "=" falls under the one above, whatever the width of the letters.
 */
export function Rows({ rows }: { rows: { name?: string; symbol: string; value: string }[] }) {
	const named = rows.some((r) => r.name);
	return (
		<div className={named ? 'grid grid-cols-[auto_auto_auto] items-baseline justify-start gap-x-1.5 gap-y-1 text-sm text-fg' : 'grid grid-cols-[auto_auto] items-baseline justify-start gap-x-1.5 gap-y-1 text-sm text-fg'}>
			{rows.map((r, k) => (
				<div key={k} className="contents">
					{named && <span className="pr-2.5 text-fg-muted">{r.name}</span>}
					<span><Tex>{r.symbol}</Tex></span>
					<span><Tex>{`= ${r.value}`}</Tex></span>
				</div>
			))}
		</div>
	);
}

const WORD = { weight: 'Peso', normal: 'Reazione del piano', tension: 'Tensione' } as const;

/** The forces on a body, one per row, with the names of the lessons. */
export function ForceRows({ forces, scene, lower = false }: { forces: Force[]; scene: Scene; /** Names without the capital, for a figure inside a sentence of a lesson. */ lower?: boolean }) {
	const rows = forces
		.filter((force) => Math.hypot(force.v.x, force.v.y) >= 5e-7)
		.map((force) => {
			const [letter, subscript] = forceName(force, scene);
			const word = force.kind === 'friction' ? (force.static ? 'Attrito statico' : 'Attrito dinamico') : WORD[force.kind];
			return { name: lower ? word.toLowerCase() : word, symbol: `${letter}${subscript ? `_{${subscript}}` : ''}`, value: `${tidy(Math.hypot(force.v.x, force.v.y))}\\,\\text{N}` };
		});
	return <Rows rows={rows} />;
}

/** A named group of formulas: the name on its own line, the formulas under it. */
export function Group({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-sm text-fg-muted">{title}</span>
			{children}
		</div>
	);
}

/** What follows from the forces on a body: their sum by components, the acceleration, the velocity, the energy of the scene. */
export function Motion({ sum, acc, vel, energy }: { sum: { x: number; y: number }; acc: number; vel: number; energy: number }) {
	return (
		<>
			<Group title="Somma delle forze">
				<Rows rows={[{ symbol: '\\textstyle\\sum F_x', value: `${tidy(sum.x)}\\,\\text{N}` }, { symbol: '\\textstyle\\sum F_y', value: `${tidy(sum.y)}\\,\\text{N}` }]} />
			</Group>
			<Group title="Accelerazione">
				<Rows rows={[{ symbol: 'a', value: `${tidy(acc)}\\,\\text{m/s}^2` }]} />
			</Group>
			<Group title="Velocità">
				<Rows rows={[{ symbol: 'v', value: `${tidy(vel)}\\,\\text{m/s}` }]} />
			</Group>
			<Group title="Energia meccanica">
				<Rows rows={[{ symbol: 'E_c + U', value: `${tidy(energy)}\\,\\text{J}` }]} />
			</Group>
		</>
	);
}

/**
 * The numbers of one body in one state: its forces and what follows from them. Memoised on the state, so the editor
 * can hand it a new one a few times a second while the scene itself moves at every frame: typesetting a dozen
 * formulas sixty times a second is what made a scene with a body selected run slower than one without.
 */
export const BodyPanel = memo(function BodyPanel({ scene, state, body }: { scene: Scene; state: State; body: number }) {
	const solution = useMemo(() => {
		try {
			return solve(scene, state);
		} catch {
			return null;
		}
	}, [scene, state]);
	const forces = solution?.forces[body] ?? [];
	const acc = solution?.acc[body] ?? { x: 0, y: 0 };
	const vel = state.vel[body] ?? { x: 0, y: 0 };
	const sum = forces.reduce((s, x) => ({ x: s.x + x.v.x, y: s.y + x.v.y }), { x: 0, y: 0 });
	const e = energy(scene, state);
	return (
		<>
			<ForceRows forces={forces} scene={scene} />
			<div className="flex flex-col gap-2.5 border-t border-edge-soft pt-3">
				<Motion sum={sum} acc={Math.hypot(acc.x, acc.y)} vel={Math.hypot(vel.x, vel.y)} energy={e.kinetic + e.potential} />
			</div>
		</>
	);
});
