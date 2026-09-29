'use client';

import { Drawing, frame, v, TINT, THICK, THIN } from '@/components/content/interactive/kit';
import { Dinamometro as Balance, dinamometroGeometry } from '@/components/content/interactive/fisica/Dinamometro';
import type { SceneProps } from '.';

/**
 * A spring balance hanging from the ceiling, its index at `forza`, and (with `oggetto`) a bag hanging from the hook:
 * the exercises of the forces read its scale (forze, level 1; fis-forza-peso, level 2).
 *
 *   { type: 'dinamometro', data: { portata: 2, divisioni: 20, ogni: 5, forza: 1.3, oggetto: true } }
 *
 * A number every `ogni` divisions; the scale is 3 cm long. The frame is computed from the data, so a light load
 * gives a shorter drawing.
 */
export default function Dinamometro({ data, alt }: SceneProps) {
	const portata = Number(data.portata ?? 2);
	const divisioni = Number(data.divisioni ?? 20);
	const ogni = Number(data.ogni ?? 5);
	const forza = Number(data.forza ?? 0);
	const oggetto = data.oggetto !== false;
	const ring = v(0, 0);
	const g = dinamometroGeometry({ ring, portata, forza, scaleLen: 3 });
	const bagTop = g.hookBottom.y - 0.3;
	const low = oggetto ? bagTop - 0.55 : g.hookBottom.y;
	const f = frame(-1.05, 1.4, low - 0.15, 0.5);
	return (
		<Drawing f={f} label={alt}>
			<Balance f={f} ring={ring} portata={portata} divisioni={divisioni} ogni={ogni} forza={forza} scaleLen={3} />
			{oggetto && (
				<>
					<path d={f.path([g.hookBottom, v(0, bagTop)])} stroke="#000" strokeWidth={THIN} fill="none" />
					<path d={f.path([v(-0.35, bagTop), v(0.35, bagTop), v(0.35, bagTop - 0.55), v(-0.35, bagTop - 0.55)], true)} fill={TINT.blue} stroke="#000" strokeWidth={THICK} />
				</>
			)}
		</Drawing>
	);
}
