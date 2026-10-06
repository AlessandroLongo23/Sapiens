'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, num, texNum, THICK, THIN, DASH, TINT, FONT, FONT_MATH, type Frame, type V } from '../kit';
import { Arrow, QTY } from '../fisica';

/**
 * Physics lesson 112 (I calori molari dei gas): two equal cylinders with one mole of the same perfect gas at 300 K.
 * On the left the piston is locked (constant volume), on the right it is free (constant pressure). A slider gives
 * both the same heat Q, from 0 to 3000 J; a toggle makes the gas monatomic (C_V = 3/2 R) or diatomic (5/2 R).
 * Left: ΔT = Q / C_V, all the heat is internal energy. Right: ΔT = Q / C_p, the piston rises with V ∝ T and the
 * heat splits into ΔU = C_V ΔT and W = R ΔT. A bar beside each cylinder shows the split, to the same scale.
 * The question it answers: with the same heat, which gas warms more, and where does the rest go?
 */

const R = 8.31;
const T0 = 300;
const Q_MAX = 3000;
/** Gas column at 300 K, in drawing centimetres, and the cylinders' size. */
const H0 = 1.5;
const CYL_W = 2;
const WALL = 3.5;
const PISTON = 0.22;
const LEFT = 0;
const RIGHT = 4.9;
/** Centimetres per joule of the bars. */
const BAR_S = 3 / Q_MAX;
const BAR_W = 0.5;

const f = frame(-0.55, 9.1, -1.35, 4.25);

type Gas = 'mono' | 'bi';
const DOF: Record<Gas, number> = { mono: 3, bi: 5 };

/** Upright text with an italic symbol after it: "ΔU", "T = 372 K". */
function Sym({ at, pre = '', sym, post = '', anchor = 'middle', size = 13 }: { at: V; pre?: string; sym: string; post?: string; anchor?: 'start' | 'middle' | 'end'; size?: number }) {
	const p = f.px(at);
	return (
		<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={size} fontFamily={FONT} pointerEvents="none">
			{pre}
			<tspan fontFamily={FONT_MATH} fontStyle="italic">
				{sym}
			</tspan>
			{post}
		</text>
	);
}

function Cylinder({ fr, x, h, locked }: { fr: Frame; x: number; h: number; locked: boolean }) {
	const rect = (a: V, b: V, fill: string, stroke = true) => <path d={fr.path([a, v(b.x, a.y), b, v(a.x, b.y)], true)} fill={fill} stroke={stroke ? '#000' : 'none'} strokeWidth={THICK} />;
	return (
		<g pointerEvents="none">
			{rect(v(x, 0), v(x + CYL_W, h), TINT.blue, false)}
			{!locked && <path d={fr.path([v(x, H0), v(x + CYL_W, H0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />}
			{rect(v(x + 0.02, h), v(x + CYL_W - 0.02, h + PISTON), TINT.gray)}
			<path d={fr.path([v(x + CYL_W / 2 - 0.1, h + PISTON), v(x + CYL_W / 2 - 0.1, h + PISTON + 0.6)])} stroke="#000" strokeWidth={THICK} />
			<path d={fr.path([v(x + CYL_W / 2 + 0.1, h + PISTON), v(x + CYL_W / 2 + 0.1, h + PISTON + 0.6)])} stroke="#000" strokeWidth={THICK} />
			<path d={fr.path([v(x, WALL), v(x, 0), v(x + CYL_W, 0), v(x + CYL_W, WALL)])} stroke="#000" strokeWidth={THICK} fill="none" />
			{locked && rect(v(x, h + PISTON), v(x + 0.3, h + PISTON + 0.12), '#000')}
			{locked && rect(v(x + CYL_W - 0.3, h + PISTON), v(x + CYL_W, h + PISTON + 0.12), '#000')}
		</g>
	);
}

/** The heat as a stacked bar: ΔU below, W above, with their names beside. */
function HeatBar({ x, dU, W }: { x: number; dU: number; W: number }) {
	const seg = (y0: number, h: number, fill: string) => {
		if (h < 0.004) return null;
		const a = f.px(v(x, y0 + h)), b = f.px(v(x + BAR_W, y0));
		return <rect x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={fill} stroke="#000" strokeWidth={THIN} />;
	};
	const hU = dU * BAR_S, hW = W * BAR_S;
	return (
		<g pointerEvents="none">
			{seg(0, hU, TINT.blue20)}
			{seg(hU, hW, TINT.orange)}
			<path d={f.path([v(x - 0.1, 0), v(x + BAR_W + 0.1, 0)])} stroke="#000" strokeWidth={THICK} fill="none" />
			{hU > 0.3 && <Sym at={v(x + BAR_W + 0.12, hU / 2)} pre="Δ" sym="U" anchor="start" />}
			{hW > 0.3 && <Sym at={v(x + BAR_W + 0.12, hU + hW / 2)} sym="W" anchor="start" />}
			<Sym at={v(x + BAR_W / 2, -0.3)} sym="Q" />
		</g>
	);
}

export default function CaloriMolariCilindri({ alt }: { alt?: string }) {
	const [Q, setQ] = useState(1500);
	const [gas, setGas] = useState<Gas>('mono');
	const l = DOF[gas];
	const CV = (l / 2) * R, Cp = CV + R;
	const dTV = Q / CV, dTp = Q / Cp;
	const W = R * dTp, dUp = CV * dTp;
	const hRight = (H0 * (T0 + dTp)) / T0;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Cylinder fr={f} x={LEFT} h={H0} locked />
				<Cylinder fr={f} x={RIGHT} h={hRight} locked={false} />
				<HeatBar x={LEFT + CYL_W + 0.45} dU={Q} W={0} />
				<HeatBar x={RIGHT + CYL_W + 0.45} dU={dUp} W={W} />
				{[LEFT, RIGHT].map((x) => (
					<g key={x}>
						{Q > 0 && <Arrow f={f} from={v(x + CYL_W / 2, -0.75)} to={v(x + CYL_W / 2, -0.08)} color={QTY.risultante} />}
					</g>
				))}
				<Sym at={v(LEFT + CYL_W / 2, WALL + 0.45)} sym="T" post={` = ${num(T0 + dTV, 0)} K`} size={14} />
				<Sym at={v(RIGHT + CYL_W / 2, WALL + 0.45)} sym="T" post={` = ${num(T0 + dTp, 0)} K`} size={14} />
				<Sym at={v(LEFT + CYL_W / 2, -1.05)} sym="" post="pistone bloccato" />
				<Sym at={v(RIGHT + CYL_W / 2, -1.05)} sym="" post="pistone libero" />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`\\Delta T_V = ${texNum(dTV, 0)}\\ \\text{K}`}</Tex>
				</span>
				<span>
					<Tex>{`\\Delta T_p = ${texNum(dTp, 0)}\\ \\text{K}`}</Tex>
				</span>
				<span>
					<Tex>{`W = ${texNum(W, 0)}\\ \\text{J}`}</Tex>
				</span>
				<span>
					<Tex>{`\\dfrac{\\Delta T_p}{\\Delta T_V} = \\dfrac{C_V}{C_p} = \\dfrac{${l}}{${l + 2}}`}</Tex>
				</span>
			</Readout>
			<Caption>
				{Q === 0 ? (
					'I due gas sono a 300 K. Dai calore con il cursore: quale dei due si scalda di più?'
				) : (
					<>
						Con {num(Q, 0)} J il gas a volume costante si scalda di {num(dTV, 0)} K, quello a pressione costante di {num(dTp, 0)} K: {num(W, 0)} J del calore sono diventati lavoro sul pistone.
					</>
				)}
			</Caption>

			<Controls>
				<Slider label="Calore" unit="J" value={Q} min={0} max={Q_MAX} step={100} onChange={setQ} />
				<div className="flex justify-center">
					<ToggleGroup
						label="Tipo di gas"
						options={[
							{ value: 'mono', label: 'Monoatomico' },
							{ value: 'bi', label: 'Biatomico' }
						]}
						value={gas}
						onChange={setGas}
					/>
				</div>
			</Controls>
		</Figure>
	);
}
