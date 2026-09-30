'use client';

import { Drawing, frame, v, TINT, THICK, THIN, FONT } from '@/components/content/interactive/kit';
import { Ground } from '@/components/content/interactive/fisica';
import { Dinamometro as Balance, dinamometroGeometry } from '@/components/content/interactive/fisica/Dinamometro';
import type { SceneProps } from '.';

/**
 * Two equal spring balances hanging from the ceiling with the same body (fis-archimede, level 3): on the left in air,
 * the index at `aria`; on the right with the body all under the liquid of a beaker, the index at `liquido`. Both
 * readings are data of the exercise: the student finds the buoyancy, the volume or the density from them. The
 * liquid is `cyan!20`, as in the lessons' TikZ.
 *
 *   { type: 'dinamometri-archimede', data: { portata: 10, divisioni: 25, ogni: 5, aria: 7.6, liquido: 6.4 } }
 */
const SCALE = 3;
const BODY = { w: 0.6, h: 0.5 };
const X2 = 2.4;

export default function DinamometriArchimede({ data, alt }: SceneProps) {
	const portata = Number(data.portata ?? 10);
	const divisioni = Number(data.divisioni ?? 25);
	const ogni = Number(data.ogni ?? 5);
	const aria = Number(data.aria ?? 0);
	const liquido = Number(data.liquido ?? 0);
	const ga = dinamometroGeometry({ ring: v(0, 0), portata, forza: aria, scaleLen: SCALE });
	const gl = dinamometroGeometry({ ring: v(X2, 0), portata, forza: liquido, scaleLen: SCALE });
	const topA = ga.hookBottom.y - 0.25;
	const topL = gl.hookBottom.y - 0.25;
	// The beaker: its liquid covers the body on the right by 0,25 cm, its floor 0,3 cm under the body.
	const surface = topL + 0.25;
	const floor = topL - BODY.h - 0.3;
	const low = Math.min(floor, topA - BODY.h) - 0.5;
	const f = frame(-0.9, X2 + 1.2, low, 0.5);
	const body = (x: number, top: number) => f.path([v(x - BODY.w / 2, top), v(x + BODY.w / 2, top), v(x + BODY.w / 2, top - BODY.h), v(x - BODY.w / 2, top - BODY.h)], true);
	const caption = (x: number, text: string) => {
		const p = f.px(v(x, low + 0.12));
		return (
			<text x={p.x} y={p.y} textAnchor="middle" fontSize={10.5} fontFamily={FONT}>
				{text}
			</text>
		);
	};
	return (
		<Drawing f={f} label={alt}>
			<Ground f={f} from={v(X2 + 0.9, 0.35)} to={v(-0.9, 0.35)} />
			<Balance f={f} ring={v(0, 0)} portata={portata} divisioni={divisioni} ogni={ogni} forza={aria} scaleLen={SCALE} soffitto={false} />
			<Balance f={f} ring={v(X2, 0)} portata={portata} divisioni={divisioni} ogni={ogni} forza={liquido} scaleLen={SCALE} soffitto={false} />
			<path d={`${f.path([v(0, 0.35), v(0, 0.15)])} ${f.path([v(X2, 0.35), v(X2, 0.15)])}`} stroke="#000" strokeWidth={THICK} fill="none" />
			<path d={f.path([v(X2 - 0.75, floor), v(X2 + 0.75, floor), v(X2 + 0.75, surface), v(X2 - 0.75, surface)], true)} fill="#ccffff" />
			<path d={`${f.path([ga.hookBottom, v(0, topA)])} ${f.path([gl.hookBottom, v(X2, topL)])}`} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={body(0, topA)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
			<path d={body(X2, topL)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
			<path d={f.path([v(X2 - 0.75, surface), v(X2 + 0.75, surface)])} stroke="#000" strokeWidth={THIN} fill="none" />
			<path d={f.path([v(X2 - 0.75, surface + 0.35), v(X2 - 0.75, floor), v(X2 + 0.75, floor), v(X2 + 0.75, surface + 0.35)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			{caption(0, 'in aria')}
			{caption(X2, 'nel liquido')}
		</Drawing>
	);
}
