'use client';

import { Drawing, frame, v, add, type V } from '@/components/content/interactive/kit';
import { Block, Ground, Vector, along, QTY } from '@/components/content/interactive/fisica';
import type { SceneProps } from '.';

/**
 * A block on the floor with forces applied at its centre, each given by modulus (newton) and direction (degrees
 * from the x axis, counterclockwise). The arrows are to scale: `scala` centimetres per newton, chosen by the
 * generator so the longest arrow is about 2 cm. The frame grows to hold every arrow.
 *
 *   { type: 'blocco-forze', data: { forze: [{ nome: 'F', sub: '1', modulo: 30, angolo: 0 }, ...], scala: 0.06, suolo: true } }
 *
 * It is also the example of a scene: read `data` defensively, compute the frame from the data, draw with the kit.
 */
type Force = { nome: string; sub?: string; modulo: number; angolo: number; colore?: keyof typeof QTY };

export default function BloccoForze({ data, alt }: SceneProps) {
	const forces = (data.forze as Force[] | undefined) ?? [];
	const k = Number(data.scala ?? 0.05);
	const floor = data.suolo !== false;
	const w = 1.2, h = 0.8;
	const c: V = v(0, h / 2);
	// Each tip, and the room its name takes beyond it.
	const tips = forces.map((F) => along(c, (F.angolo * Math.PI) / 180, F.modulo * k + 0.75));
	const xs = [-w / 2 - 0.4, w / 2 + 0.4, ...tips.map((p) => p.x)];
	const ys = [floor ? -0.3 : 0, h + 0.2, ...tips.map((p) => p.y)];
	const f = frame(Math.min(...xs) - 0.2, Math.max(...xs) + 0.2, Math.min(...ys) - 0.2, Math.max(...ys) + 0.2);
	return (
		<Drawing f={f} label={alt}>
			{floor && <Ground f={f} from={v(f.x0 + 0.2, 0)} to={v(f.x1 - 0.2, 0)} />}
			<Block f={f} at={v(0, 0)} w={w} h={h} />
			{forces.map((F, i) => (
				<Vector key={i} f={f} from={c} to={add(c, along(v(0, 0), (F.angolo * Math.PI) / 180, F.modulo * k))} color={QTY[F.colore ?? 'forza']} name={F.nome} sub={F.sub} />
			))}
		</Drawing>
	);
}
