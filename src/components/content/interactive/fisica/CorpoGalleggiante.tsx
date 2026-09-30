'use client';

import { useEffect, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, num, useTween, TINT, THICK, THIN } from '../kit';
import { Block, Point, Vector, VecLabel, QTY } from '../fisica';

/**
 * Lesson 30 (La spinta di Archimede e il galleggiamento), "La parte immersa di un corpo che galleggia": a block of
 * 1 dm³ in a wide tank of liquid (oil 920, water 1000, sea water 1030 kg/m³). A slider sets the block's density from
 * 100 to 1500 kg/m³. Lighter than the liquid, the block settles with V_imm / V = d_corpo / d_liquido; as dense as the
 * liquid, it stays where it is, half way down; denser, it goes to the bottom, which pushes up with N = P − S_A. The
 * block moves to its new place with an animation, and the buoyancy drawn is the one of the part under the surface
 * at each moment, so the arrows show why it stops where it does. Forces from the block's centre, 0,12 cm per newton;
 * the liquid is `cyan!20` (oil `yellow!20`), as in DinamometroImmersione.
 */

type Liquid = 'olio' | 'acqua' | 'mare';
const LIQUIDS: Record<Liquid, { label: string; d: number; fill: string; name: string }> = {
	olio: { label: 'Olio', d: 920, fill: TINT.yellow, name: "dell'olio" },
	acqua: { label: 'Acqua', d: 1000, fill: '#ccffff', name: "dell'acqua" },
	mare: { label: 'Acqua di mare', d: 1030, fill: '#ccffff', name: "dell'acqua di mare" }
};

const G = 9.8;
const VOL = 1e-3; // m³
const H = 0.8; // the block's height, drawing cm (it stands for 10 cm)
const W = 1.0;
const TANK = { half: 1.6, liquid: 2.0, h: 2.6 };
const K = 0.12; // drawing cm per newton
const f = frame(-TANK.half - 0.2, TANK.half + 0.2, -1.65, TANK.h + 0.6);
const fx = (x: number, d: number) => x.toFixed(d).replace('.', ',');
const tx = (x: number, d: number) => x.toFixed(d).replace('.', '{,}');

/** Where the block's bottom rests, for a density ratio r = d_corpo / d_liquido. */
const restAt = (r: number) => (r < 1 - 1e-9 ? TANK.liquid - r * H : r > 1 + 1e-9 ? 0 : (TANK.liquid - H) / 2);

export default function CorpoGalleggiante({ alt }: { alt?: string }) {
	const [liquid, setLiquid] = useState<Liquid>('acqua');
	const [dc, setDc] = useState(600);
	const dl = LIQUIDS[liquid].d;
	const r = dc / dl;
	const [bottom, go] = useTween(restAt(600 / 1000), 700);
	useEffect(() => {
		void go(restAt(r));
	}, [r, go]);

	const immersed = Math.min(Math.max(TANK.liquid - bottom, 0), H) / H; // fraction of the block under the surface now
	const P = dc * VOL * G;
	const SA = dl * VOL * immersed * G;
	const settled = Math.abs(bottom - restAt(r)) < 1e-3;
	const onFloor = r > 1 + 1e-9 && bottom < 1e-3;
	const N = onFloor ? P - SA : 0;
	const c = v(0, bottom + H / 2);
	const partly = immersed > 0 && immersed < 1;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(-TANK.half, 0), v(TANK.half, 0), v(TANK.half, TANK.liquid), v(-TANK.half, TANK.liquid)], true)} fill={LIQUIDS[liquid].fill} />
				<Block f={f} at={v(0, bottom)} w={W} h={H} fill={dc > dl ? TINT.gray : dc === dl ? TINT.blue : TINT.orange} />
				<path
					d={partly ? `${f.path([v(-TANK.half, TANK.liquid), v(-W / 2, TANK.liquid)])} ${f.path([v(W / 2, TANK.liquid), v(TANK.half, TANK.liquid)])}` : f.path([v(-TANK.half, TANK.liquid), v(TANK.half, TANK.liquid)])}
					stroke="#000"
					strokeWidth={THIN}
					fill="none"
				/>
				<path d={f.path([v(-TANK.half, TANK.h), v(-TANK.half, 0), v(TANK.half, 0), v(TANK.half, TANK.h)])} stroke="#000" strokeWidth={THICK} fill="none" strokeLinejoin="round" />
				<Vector f={f} from={c} to={v(0, c.y - K * P)} color={QTY.forza} />
				{/* names at the tips, or beside the block when a short arrow ends inside it */}
				<VecLabel f={f} at={c.y - K * P < bottom ? v(0, c.y - K * P) : v(W / 2, bottom)} dir={v(1, c.y - K * P < bottom ? 0 : -0.4)} name="P" color={QTY.forza} />
				{SA > 0.05 && (
					<>
						<Vector f={f} from={v(-0.1, c.y)} to={v(-0.1, c.y + K * SA)} color={QTY.forza} />
						<VecLabel f={f} at={c.y + K * SA > bottom + H ? v(-0.1, c.y + K * SA) : v(-W / 2, bottom + H)} dir={v(-1, c.y + K * SA > bottom + H ? 0 : 0.4)} name="S" sub="A" color={QTY.forza} />
					</>
				)}
				{N > 0.05 && (
					<>
						<Vector f={f} from={v(0.1, c.y)} to={v(0.1, c.y + K * N)} color={QTY.forza} />
						<VecLabel f={f} at={c.y + K * N > bottom + H ? v(0.1, c.y + K * N) : v(W / 2, bottom + H)} dir={v(1, 0.4)} name="N" color={QTY.forza} />
					</>
				)}
				<Point f={f} at={c} />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`\\dfrac{d_{corpo}}{d_{liquido}} = \\dfrac{${dc}}{${dl}} = ${tx(r, 2)}`}</Tex>
				</span>
				<span>
					<Tex>{`V_{imm} = ${num(immersed * 100, 0)}\\%`}</Tex> di <Tex>{'V'}</Tex>
				</span>
				<span>
					<Tex>{`P = ${tx(P, 1)}`}</Tex> N, <Tex>{`S_A = ${tx(SA, 1)}`}</Tex> N
				</span>
			</Readout>
			<Caption>
				{!settled ? (
					<>Peso e spinta sono diversi: il blocco si muove.</>
				) : r < 1 - 1e-9 ? (
					<>
						Il blocco è meno denso {LIQUIDS[liquid].name} e galleggia con il {num(r * 100, 0)}% del volume sotto la superficie: la spinta di quella parte è uguale al peso.
					</>
				) : r > 1 + 1e-9 ? (
					<>
						Il blocco è più denso {LIQUIDS[liquid].name}: anche tutto sotto riceve una spinta di {fx(SA, 1)} N, meno del peso, e va a fondo. Il fondo regge il resto, {fx(N, 1)} N.
					</>
				) : (
					<>Il blocco ha la stessa densità {LIQUIDS[liquid].name}: peso e spinta sono uguali e resta sospeso dove si trova.</>
				)}
			</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Liquido" options={(Object.keys(LIQUIDS) as Liquid[]).map((k) => ({ value: k, label: LIQUIDS[k].label }))} value={liquid} onChange={setLiquid} />
				</div>
				<Slider label="Densità del blocco (kg/m³)" value={dc} min={100} max={1500} step={10} onChange={(x) => setDc(Math.round(x / 10) * 10)} />
			</Controls>
		</Figure>
	);
}
