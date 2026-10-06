'use client';

import { useMemo, useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, Readout, Tex, Label, Dot, frame, v, num, texNum, THICK, THIN, DASH, INK, type V } from '../kit';
import { mulberry32 } from './particelle-materia';
import { Pills } from './chim3-H-pezzi';

/**
 * Lesson 74 (Lo stato liquido e la tensione di vapore): the vapour pressure of a liquid against the temperature, and
 * the pressure outside. The student picks the liquid (water, ethanol, acetone, diethyl ether), the temperature and
 * the external pressure. On the left an open beaker: the vapour above the liquid thickens as the vapour pressure
 * approaches the external one, and bubbles appear when it reaches it. On the right the liquid's curve, the line of
 * the external pressure and the point of the liquid now; where curve and line cross is the boiling temperature.
 *
 * Vapour pressures from Antoine's equation, log10 p = A - B / (C + t), p in mmHg and t in °C, with the usual
 * constants of each liquid: they give 760 mmHg at 100,0, 78,3, 56,1 and 34,6 °C, and at 20 °C the values of the
 * lesson's table (17,5, 44, 185, 440 mmHg).
 */

type LiquidId = 'acqua' | 'etanolo' | 'acetone' | 'etere';
const LIQUIDS: Record<LiquidId, { label: string; il: string; del: string; A: number; B: number; C: number }> = {
	acqua: { label: 'acqua', il: "l'acqua", del: "dell'acqua", A: 8.07131, B: 1730.63, C: 233.426 },
	etanolo: { label: 'etanolo', il: "l'etanolo", del: "dell'etanolo", A: 8.20417, B: 1642.89, C: 230.3 },
	acetone: { label: 'acetone', il: "l'acetone", del: "dell'acetone", A: 7.11714, B: 1210.595, C: 229.664 },
	etere: { label: 'etere dietilico', il: "l'etere dietilico", del: "dell'etere dietilico", A: 6.92032, B: 1064.07, C: 228.8 },
};
const pVap = (l: LiquidId, t: number) => 10 ** (LIQUIDS[l].A - LIQUIDS[l].B / (LIQUIDS[l].C + t));
const tBoil = (l: LiquidId, p: number) => LIQUIDS[l].B / (LIQUIDS[l].A - Math.log10(p)) - LIQUIDS[l].C;

const f = frame(-0.35, 9.45, -1.0, 4.55);
const K = f.W / (f.x1 - f.x0);
// the beaker
const BX0 = 0.1, BX1 = 2.5, BY0 = 0, BY1 = 3.3, LEVEL = 1.55;
// the graph
const GX = 4.25, GY = 0, GW = 4.8, GH = 3.6, T_MAX = 120, P_MAX = 1600;
const gx = (t: number) => GX + (t / T_MAX) * GW;
const gy = (p: number) => GY + (p / P_MAX) * GH;
const LIQUID_FILL = '#ccf5ff';

export default function LiquidoTensioneVapore({ alt }: { alt?: string }) {
	const [liq, setLiq] = useState<LiquidId>('acqua');
	const [t, setT] = useState(60);
	const [pExt, setPExt] = useState(760);
	const L = LIQUIDS[liq];
	const pv = pVap(liq, t);
	const teb = tBoil(liq, pExt);
	const boils = pv >= pExt;

	// the vapour: more molecules above the liquid as the vapour pressure nears the external one
	const dots = useMemo(() => {
		const rnd = mulberry32(74);
		return Array.from({ length: 22 }, () => v(BX0 + 0.2 + rnd() * (BX1 - BX0 - 0.4), LEVEL + 0.25 + rnd() * (4.1 - LEVEL - 0.25)));
	}, []);
	const bubbles = useMemo(() => {
		const rnd = mulberry32(7);
		return Array.from({ length: 7 }, () => ({ at: v(BX0 + 0.3 + rnd() * (BX1 - BX0 - 0.6), BY0 + 0.2 + rnd() * (LEVEL - 0.45)), r: 0.07 + rnd() * 0.07 }));
	}, []);
	const nDots = Math.max(1, Math.round(22 * Math.min(1, pv / pExt)));

	// the curve, up to the top of the graph
	const curve: V[] = [];
	for (let x = 0; x <= T_MAX; x += 1) {
		const p = pVap(liq, x);
		if (p > P_MAX) {
			curve.push(v(gx(tBoil(liq, P_MAX)), gy(P_MAX)));
			break;
		}
		curve.push(v(gx(x), gy(p)));
	}
	const onGraph = pv <= P_MAX;
	const tebOn = teb >= 0 && teb <= T_MAX;
	const pTxt = (p: number) => (p >= 100 ? num(p, 0) : num(p, 1));
	const corner = f.px(v(BX0, LEVEL));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the beaker */}
				<rect x={corner.x} y={corner.y} width={(BX1 - BX0) * K} height={(LEVEL - BY0) * K} fill={LIQUID_FILL} />
				<path d={f.path([v(BX0, LEVEL), v(BX1, LEVEL)])} stroke="#000" strokeWidth={THIN} />
				<path d={f.path([v(BX0, BY1), v(BX0, BY0), v(BX1, BY0), v(BX1, BY1)])} fill="none" stroke="#000" strokeWidth={THICK} />
				{dots.slice(0, nDots).map((d, i) => {
					const p = f.px(d);
					return <circle key={i} cx={p.x} cy={p.y} r={3.2} fill={LIQUID_FILL} stroke="#000" strokeWidth={THIN} />;
				})}
				{boils &&
					bubbles.map((b, i) => {
						const p = f.px(b.at);
						return <circle key={i} cx={p.x} cy={p.y} r={b.r * K} fill="#fff" stroke="#000" strokeWidth={THIN} />;
					})}
				<Label f={f} at={v((BX0 + BX1) / 2, -0.12)} dir={v(0, -1)} upright size={12}>
					{boils ? 'bolle' : 'evapora, non bolle'}
				</Label>

				{/* the graph */}
				{[0, 20, 40, 60, 80, 100, 120].map((x) => (
					<g key={x}>
						<path d={f.path([v(gx(x), GY), v(gx(x), GY - 0.07)])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(gx(x), GY - 0.07)} dir={v(0, -1)} upright size={11}>
							{x}
						</Label>
					</g>
				))}
				{[0, 400, 800, 1200, 1600].map((p) => (
					<g key={p}>
						<path d={f.path([v(GX, gy(p)), v(GX - 0.07, gy(p))])} stroke="#000" strokeWidth={THIN} />
						<Label f={f} at={v(GX - 0.07, gy(p))} dir={v(-1, 0)} upright size={11}>
							{p}
						</Label>
					</g>
				))}
				<path d={f.path([v(GX, GY + GH + 0.25), v(GX, GY), v(GX + GW + 0.25, GY)])} fill="none" stroke="#000" strokeWidth={THIN} />
				<Label f={f} at={v(GX, GY + GH + 0.25)} dir={v(0, 1)} upright size={12}>
					p (mmHg)
				</Label>
				<Label f={f} at={v(GX + GW + 0.05, GY - 0.42)} dir={v(0, -1)} upright size={12}>
					t (°C)
				</Label>
				<path d={f.path(curve)} fill="none" stroke={INK.blue} strokeWidth={THICK * 1.3} />
				<path d={f.path([v(GX, gy(pExt)), v(GX + GW, gy(pExt))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				<Label f={f} at={teb > 60 ? v(GX + 0.1, gy(pExt)) : v(GX + GW, gy(pExt))} dir={teb > 60 ? v(1, 0.9) : v(-1, 0.9)} upright size={11}>
					pressione esterna
				</Label>
				{tebOn && (
					<g>
						<path d={f.path([v(gx(teb), GY), v(gx(teb), gy(pExt))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
						<Dot f={f} at={v(gx(teb), gy(pExt))} r={2.6} />
					</g>
				)}
				{onGraph && <Dot f={f} at={v(gx(t), gy(pv))} r={4.5} color={INK.orange} />}
			</Drawing>
			<Readout>
				<Tex>{`t = ${texNum(t, 0)}\\,^\\circ\\text{C}`}</Tex>
				<span>
					tensione di vapore: {pTxt(pv)} mmHg
				</span>
				<span>
					pressione esterna: {num(pExt, 0)} mmHg ({num(pExt / 760, 2)} atm)
				</span>
			</Readout>
			<Caption>
				{boils && t > teb + 1
					? `A ${num(t, 0)} °C la tensione di vapore ${L.del} sarebbe ${pTxt(pv)} mmHg, più della pressione esterna. In un recipiente aperto il liquido non arriva a questa temperatura: a questa pressione bolle già a ${num(teb, 0)} °C, e finché bolle resta a quella temperatura.`
					: boils
					? `A ${num(t, 0)} °C la tensione di vapore ${L.del} (${pTxt(pv)} mmHg) raggiunge la pressione esterna: si formano bolle di vapore in tutto il liquido. A questa pressione ${L.il} bolle a ${num(teb, 0)} °C.`
					: `A ${num(t, 0)} °C la tensione di vapore ${L.del} (${pTxt(pv)} mmHg) è minore della pressione esterna: il liquido evapora solo dalla superficie. A questa pressione bolle a ${num(teb, 0)} °C, dove la curva incontra la linea tratteggiata.`}
			</Caption>
			<Controls>
				<Pills label="Liquido" value={liq} onChange={setLiq} options={(Object.keys(LIQUIDS) as LiquidId[]).map((k) => ({ value: k, label: LIQUIDS[k].label }))} />
				<Slider label="Temperatura" value={t} min={0} max={120} step={1} unit="°C" onChange={setT} />
				<Slider label="Pressione (mmHg)" value={pExt} min={200} max={1520} step={10} onChange={setPExt} />
			</Controls>
		</Figure>
	);
}
