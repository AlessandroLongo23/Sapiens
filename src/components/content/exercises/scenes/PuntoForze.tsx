'use client';

import { Drawing, frame, v, add } from '@/components/content/interactive/kit';
import { Point, Vector, along, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * Forces applied to a point, as the lesson on forces draws them (16-forze.md): each given by modulus (newton) and
 * direction (degrees from the x axis, counterclockwise), to scale with `scala` centimetres per newton. Unlike
 * blocco-forze there is no block to hide the short arrows, so it suits a body of any shape. The frame grows to hold
 * every arrow and its name.
 *
 *   { type: 'punto-forze', data: { forze: [{ nome: 'F', sub: '1', modulo: 30, angolo: 0 }, ...], scala: 0.05 } }
 */
type Force = { nome: string; sub?: string; modulo: number; angolo: number; colore?: keyof typeof QTY };

export default function PuntoForze({ data, alt }: SceneProps) {
	const forces = (data.forze as Force[] | undefined) ?? [];
	const k = Number(data.scala ?? 0.05);
	const o = v(0, 0);
	const tips = forces.map((F) => along(o, (F.angolo * Math.PI) / 180, F.modulo * k + 0.7));
	const xs = [-0.5, 0.5, ...tips.map((p) => p.x)];
	const ys = [-0.5, 0.5, ...tips.map((p) => p.y)];
	const f = frame(Math.min(...xs) - 0.15, Math.max(...xs) + 0.15, Math.min(...ys) - 0.15, Math.max(...ys) + 0.15);
	return (
		<Drawing f={f} label={alt}>
			{forces.map((F, i) => (
				<Vector key={i} f={f} from={o} to={add(o, along(v(0, 0), (F.angolo * Math.PI) / 180, F.modulo * k))} color={QTY[F.colore ?? 'forza']} name={F.nome} sub={F.sub} />
			))}
			<Point f={f} at={o} />
		</Drawing>
	);
}
