'use client';

import { useState } from 'react';
import { Droplets, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Label, Tex, frame, v, useTween, texNum, THIN, DASH, FONT } from '../kit';
import { Arrow } from '../fisica';
import { LIQUID, Liquid, Surface, Vessel } from './liquidi';

/**
 * Lesson "La legge di Stevino e i vasi comunicanti": a U-tube with a liquid at the bottom (water or mercury) and a
 * second liquid, which does not mix with it and is less dense, poured into the left branch (oil, or water on
 * mercury). A slider (or "Versa", a tween) sets the height h1 of the poured column, 0 to 12 cm. The interface goes down
 * by x in the left branch and the first liquid rises by x in the right one (equal cross-sections), with
 * d1 · h1 = d2 · 2x: h2 = 2x is the height of the first liquid above the interface's plane. The dashed line is that
 * plane; the readout gives h1, h2 and the two products, always equal. Everything in scale.
 */

const PAIRS = [
	{ key: 'acqua-olio', name: 'acqua e olio', base: { name: 'acqua', d: 1000, fill: LIQUID.acqua }, top: { name: 'olio', d: 920, fill: LIQUID.olio } },
	{ key: 'mercurio-acqua', name: 'mercurio e acqua', base: { name: 'mercurio', d: 13600, fill: LIQUID.mercurio }, top: { name: 'acqua', d: 1000, fill: LIQUID.acqua } },
	{ key: 'mercurio-olio', name: 'mercurio e olio', base: { name: 'mercurio', d: 13600, fill: LIQUID.mercurio }, top: { name: 'olio', d: 920, fill: LIQUID.olio } },
] as const;

const H_MAX = 12; // cm of poured liquid
const CM = 0.18; // drawing centimetres per real centimetre
const W = 0.6; // inner width of a branch
const GAP = 1.2; // between the branches
const BOTTOM = 0.55; // the inner bottom of the bend
const L0 = BOTTOM + 8 * CM; // the first liquid's level before pouring, 8 cm above the bend
const TOP = L0 + 12.5 * CM; // the rims
const XL = 0;
const XR = W + GAP;
/** "di olio" → "d'olio", "di mercurio" as it is. */
const di = (name: string) => (/^[aeiou]/.test(name) ? `d'${name}` : `di ${name}`);

const f = frame(-1.05, XR + W + 1.15, -0.2, TOP + 0.3);

export default function TuboAU({ alt }: { alt?: string }) {
	const [k, setK] = useState(0);
	const [h1, go, running] = useTween(0, 1400);
	const pair = PAIRS[k];
	const x = (pair.top.d * h1) / (2 * pair.base.d); // cm the interface goes down, and the other side up
	const h2 = 2 * x;
	const yi = L0 - x * CM; // the interface, left branch
	const yt = yi + h1 * CM; // the poured liquid's surface
	const yr = L0 + x * CM; // the first liquid's surface, right branch
	const set = (h: number) => void go(h, 0);
	const tx = XL - 0.45;
	const rx = XR + W + 0.45;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<Liquid f={f} pts={[v(XL, yi), v(XL, 0), v(XR + W, 0), v(XR + W, yr), v(XR, yr), v(XR, BOTTOM), v(XL + W, BOTTOM), v(XL + W, yi)]} fill={pair.base.fill} />
				{h1 > 0.05 && <Liquid f={f} pts={[v(XL, yi), v(XL + W, yi), v(XL + W, yt), v(XL, yt)]} fill={pair.top.fill} />}
				<Surface f={f} from={v(XL, yi)} to={v(XL + W, yi)} />
				{h1 > 0.05 && <Surface f={f} from={v(XL, yt)} to={v(XL + W, yt)} />}
				<Surface f={f} from={v(XR, yr)} to={v(XR + W, yr)} />
				<Vessel
					f={f}
					paths={[
						[v(XL, TOP), v(XL, 0), v(XR + W, 0), v(XR + W, TOP)],
						[v(XL + W, TOP), v(XL + W, BOTTOM), v(XR, BOTTOM), v(XR, TOP)],
					]}
				/>
				{/* the plane of the interface, and the two heights above it */}
				<path d={f.path([v(tx - 0.15, yi), v(rx + 0.15, yi)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" opacity={0.7} />
				{h1 > 0.3 && (
					<>
						<Arrow f={f} from={v(tx, (yi + yt) / 2)} to={v(tx, yt)} weight="thin" />
						<Arrow f={f} from={v(tx, (yi + yt) / 2)} to={v(tx, yi)} weight="thin" />
						<Label f={f} at={v(tx, (yi + yt) / 2)} dir={v(-1, 0)} size={14}>
							h<tspan fontSize={10} dy={3} fontStyle="normal">1</tspan>
						</Label>
					</>
				)}
				{h2 * CM > 0.3 && (
					<>
						<Arrow f={f} from={v(rx, (yi + yr) / 2)} to={v(rx, yr)} weight="thin" />
						<Arrow f={f} from={v(rx, (yi + yr) / 2)} to={v(rx, yi)} weight="thin" />
					</>
				)}
				{h2 > 0.05 && (
					<Label f={f} at={v(rx, (yi + yr) / 2)} dir={v(1, 0)} size={14}>
						h<tspan fontSize={10} dy={3} fontStyle="normal">2</tspan>
					</Label>
				)}
				{h1 * CM > 0.9 && (
					<text
						transform={`translate(${f.px(v(XL + W / 2, (yi + yt) / 2)).x.toFixed(1)} ${f.px(v(XL + W / 2, (yi + yt) / 2)).y.toFixed(1)}) rotate(-90)`}
						textAnchor="middle"
						dy="0.35em"
						fontSize={12}
						fontFamily={FONT}
						pointerEvents="none"
					>
						{pair.top.name}
					</text>
				)}
				<Label f={f} at={v((XL + XR + W) / 2, BOTTOM / 2)} upright size={12}>
					{pair.base.name}
				</Label>
			</Drawing>

			<Readout>
				<span>
					<Tex>{`h_1 = ${texNum(h1, 1)}\\,\\text{cm}`}</Tex>
				</span>
				<span>
					<Tex>{`h_2 = ${texNum(h2, 2)}\\,\\text{cm}`}</Tex>
				</span>
			</Readout>
			<Readout>
				<span>
					<Tex>{`d_1 \\cdot h_1 = ${pair.top.d} \\cdot ${texNum(h1 / 100, 3)} = ${texNum((pair.top.d * h1) / 100, 1)}\\,\\text{kg/m}^2`}</Tex>
				</span>
				<span>
					<Tex>{`d_2 \\cdot h_2 = ${pair.base.d} \\cdot ${texNum(h2 / 100, 5)} = ${texNum((pair.base.d * h2) / 100, 1)}\\,\\text{kg/m}^2`}</Tex>
				</span>
			</Readout>
			<Caption>
				{h1 < 0.05 ? (
					<>Il {pair.base.name} è allo stesso livello nei due rami. Versa {pair.top.name === 'acqua' ? "l'acqua" : "l'olio"} nel ramo sinistro con il cursore o con il bottone.</>
				) : (
					<>
						Sopra il piano tratteggiato, la colonna {di(pair.top.name)} (<Tex>{`d_1 = ${pair.top.d}\\,\\text{kg/m}^3`}</Tex>) è alta {texNum(h1, 1).replace('{,}', ',')} cm e quella {di(pair.base.name)} (<Tex>{`d_2 = ${pair.base.d}\\,\\text{kg/m}^3`}</Tex>) {texNum(h2, 2).replace('{,}', ',')} cm: le altezze sono inversamente proporzionali alle densità.
					</>
				)}
			</Caption>

			<Controls>
				<Slider label={`Altezza h₁ del liquido versato`} unit="cm" value={Math.round(h1 * 2) / 2} min={0} max={H_MAX} step={0.5} onChange={set} />
				<ButtonRow>
					{PAIRS.map((p, i) => (
						<Button key={p.key} variant={i === k ? 'primary' : 'secondary'} size="sm" aria-pressed={i === k} onClick={() => setK(i)}>
							{p.name}
						</Button>
					))}
				</ButtonRow>
				<ButtonRow>
					<Button variant="secondary" size="sm" disabled={running || h1 >= H_MAX - 0.01} onClick={() => void go(H_MAX)}>
						<Droplets className="size-4" aria-hidden="true" />
						Versa
					</Button>
					<Button variant="secondary" size="sm" disabled={running || h1 <= 0.01} onClick={() => void go(0, 700)}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Svuota
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
