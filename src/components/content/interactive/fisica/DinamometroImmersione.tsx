'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, num, texNum, useTween, TINT, THICK, THIN, type V } from '../kit';
import { Block, Ground } from '../fisica';
import { Dinamometro, dinamometroGeometry } from './Dinamometro';

/**
 * Lesson 30 (La spinta di Archimede e il galleggiamento), "Il peso apparente": a block of 100 cm³ (5 × 5 × 4 cm)
 * hangs from a spring balance held by a stand; a slider lowers the balance, and the block goes into a beaker of
 * liquid (square, 100 cm² inside, 7 cm of liquid). The balance reads P − S_A with S_A = d · V_imm · g: it drops while
 * the block goes in and stays still once the block is all under, at any depth. The liquid (oil 920, water 1000, sea
 * water 1030 kg/m³) and the block (aluminium 270 g, iron 787 g, same volume, so the same buoyancy) are chosen with
 * buttons; the liquid's level rises by V_imm / 100 cm² as the block goes in. The slider is the depth of the block's
 * bottom under the free surface. Drawn at 0,18 TikZ cm per real cm; the liquid is `cyan!20` as in the lessons' TikZ
 * (oil `yellow!20`, to tell it apart).
 */

type Liquid = 'olio' | 'acqua' | 'mare';
const LIQUIDS: Record<Liquid, { label: string; d: number; fill: string; name: string }> = {
	olio: { label: 'Olio', d: 920, fill: TINT.yellow, name: "nell'olio" },
	acqua: { label: 'Acqua', d: 1000, fill: '#ccffff', name: "nell'acqua" },
	mare: { label: 'Acqua di mare', d: 1030, fill: '#ccffff', name: "nell'acqua di mare" }
};
type Metal = 'alluminio' | 'ferro';
const METALS: Record<Metal, { label: string; m: number; fill: string }> = {
	alluminio: { label: 'Alluminio', m: 0.27, fill: TINT.blue },
	ferro: { label: 'Ferro', m: 0.787, fill: TINT.gray }
};

const G = 9.8;
const S = 0.18; // drawing cm per real cm
const BLOCK = { w: 5, h: 4, base: 25 }; // cm, cm, cm²
const V = BLOCK.base * BLOCK.h; // 100 cm³
const BEAKER = { half: 5, h: 10, area: 100, liquid: 7 }; // cm
const MAX_DEPTH = 6;
const PORTATA = 10;
const SCALE = 2.5;
const THREAD = 0.55;
const STAND_X = -1.6;
/** Newton with two decimals, as the readout keeps them: 0,90. */
const n2 = (x: number) => x.toFixed(2).replace('.', ',');
const t2 = (x: number) => x.toFixed(2).replace('.', '{,}');

/** Everything that moves, from the depth of the block's bottom (cm) and the reading (N). */
function layout(depth: number, reading: number) {
	const vImm = BLOCK.base * Math.min(Math.max(depth, 0), BLOCK.h);
	const surface = (BEAKER.liquid + vImm / BEAKER.area) * S;
	const bottom = surface - depth * S;
	const top = bottom + BLOCK.h * S;
	const g0 = dinamometroGeometry({ ring: v(0, 0), portata: PORTATA, forza: reading, scaleLen: SCALE });
	const ring = v(0, top + THREAD - g0.hookBottom.y);
	return { vImm, surface, bottom, top, ring };
}

// The highest the stand's arm goes: the block's bottom on the surface, the heavier block, in air.
const highest = layout(0, METALS.ferro.m * G).ring.y + 0.35;
const f = frame(STAND_X - 0.45, 1.35, -0.2, highest + 0.25);

export default function DinamometroImmersione({ alt }: { alt?: string }) {
	const [liquid, setLiquid] = useState<Liquid>('acqua');
	const [metal, setMetal] = useState<Metal>('alluminio');
	const [depth, setDepth] = useState(0);
	const P = METALS[metal].m * G;
	const d = LIQUIDS[liquid].d;
	const vImm = BLOCK.base * Math.min(Math.max(depth, 0), BLOCK.h);
	const SA = d * vImm * 1e-6 * G;
	const reading = P - SA;
	const [shown, go] = useTween(reading, 400);
	useEffect(() => {
		void go(reading);
	}, [reading, go]);

	const L = layout(depth, shown);
	const g = dinamometroGeometry({ ring: L.ring, portata: PORTATA, forza: shown, scaleLen: SCALE });
	const arm = L.ring.y + 0.35;
	const bx = BEAKER.half * S;
	const bw = (BLOCK.w / 2) * S;
	const surfaceLine = (from: number, to: number) => (to > from ? f.path([v(from, L.surface), v(to, L.surface)]) : '');
	const partly = depth > 0 && depth < BLOCK.h;
	const px = (p: V) => f.px(p);
	const armEnd = px(v(0, arm));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Ground f={f} from={v(STAND_X - 0.35, 0)} to={v(1.25, 0)} />
				{/* the stand: base, rod, arm */}
				<path d={f.path([v(STAND_X - 0.3, 0), v(STAND_X + 0.3, 0), v(STAND_X + 0.3, 0.08), v(STAND_X - 0.3, 0.08)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(STAND_X, 0.08), v(STAND_X, highest + 0.1)])} stroke="#000" strokeWidth={THICK} fill="none" />
				<path d={f.path([v(STAND_X - 0.07, arm - 0.1), v(STAND_X + 0.07, arm - 0.1), v(STAND_X + 0.07, arm + 0.1), v(STAND_X - 0.07, arm + 0.1)], true)} fill={TINT.gray} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(STAND_X + 0.07, arm), v(0, arm), v(0, L.ring.y + 0.15)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				<circle cx={armEnd.x} cy={armEnd.y} r={1.5} fill="#000" />

				<Dinamometro f={f} ring={L.ring} portata={PORTATA} divisioni={20} ogni={4} forza={shown} scaleLen={SCALE} soffitto={false} />
				<path d={f.path([g.hookBottom, v(0, L.top)])} stroke="#000" strokeWidth={THIN} fill="none" />

				{/* the liquid, the block, the free surface on either side of it, the beaker */}
				<path d={f.path([v(-bx, 0), v(bx, 0), v(bx, L.surface), v(-bx, L.surface)], true)} fill={LIQUIDS[liquid].fill} />
				<Block f={f} at={v(0, L.bottom)} w={2 * bw} h={BLOCK.h * S} fill={METALS[metal].fill} />
				<path d={partly ? `${surfaceLine(-bx, -bw)} ${surfaceLine(bw, bx)}` : surfaceLine(-bx, bx)} stroke="#000" strokeWidth={THIN} fill="none" />
				<path d={f.path([v(-bx, BEAKER.h * S), v(-bx, 0), v(bx, 0), v(bx, BEAKER.h * S)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
			</Drawing>

			<Readout>
				<span>
					peso <Tex>{`P = ${t2(P)}`}</Tex> N
				</span>
				<span>
					<Tex>{`V_{imm} = ${texNum(vImm, 1)}`}</Tex> cm³
				</span>
				<span>
					spinta <Tex>{`S_A = ${t2(SA)}`}</Tex> N
				</span>
				<span>
					lettura <Tex>{`P - S_A = ${t2(reading)}`}</Tex> N
				</span>
			</Readout>
			<Caption>
				{depth <= 0 ? (
					<>Il blocco tocca appena il liquido: il dinamometro segna il suo peso, {n2(P)} N. Abbassalo con il cursore.</>
				) : depth < BLOCK.h ? (
					<>
						Il blocco è immerso per {num(depth, 1)} cm su {BLOCK.h}: sposta {num(vImm, 1)} cm³ di liquido, che pesano {n2(SA)} N, e il dinamometro segna {n2(reading)} N.
					</>
				) : (
					<>
						Il blocco è tutto immerso {LIQUIDS[liquid].name}: sposta {V} cm³ di liquido e la spinta è {n2(SA)} N a qualunque profondità. È la stessa per il blocco di alluminio e per quello di ferro.
					</>
				)}
			</Caption>

			<Controls>
				<div className="flex flex-wrap justify-center gap-2">
					<ToggleGroup label="Liquido" options={(Object.keys(LIQUIDS) as Liquid[]).map((k) => ({ value: k, label: LIQUIDS[k].label }))} value={liquid} onChange={setLiquid} />
					<ToggleGroup label="Blocco" options={(Object.keys(METALS) as Metal[]).map((k) => ({ value: k, label: METALS[k].label }))} value={metal} onChange={setMetal} />
				</div>
				<Slider label="Profondità del fondo del blocco" unit="cm" value={depth} min={0} max={MAX_DEPTH} step={0.5} onChange={setDepth} />
			</Controls>
		</Figure>
	);
}
