'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, Readout, Tex, frame, v, add, scale, len, ang, num, DASH, THIN, type V } from '../kit';
import { Atom, ATOM_FILL, Lobe, SIGN_FILL, OVERLAP, RESULTANT } from './chim3-g-pezzi';

/**
 * Lesson 70 (Teoria del legame di valenza): two carbon atoms joined by a single, a double or a triple bond (ethane,
 * ethene, ethyne), and a slider that turns the right-hand atom around the bond axis. The sigma bond is the orange
 * zone on the axis. In the double bond each carbon shows its p orbital, and two dashed arcs join the lobes: the pi
 * bond. Turning the right-hand carbon leaves a single bond as it was, while in the double bond the two p orbitals
 * stop being parallel and the arcs fade, down to nothing at 90°. In the triple bond the two pi bonds are drawn as
 * two pairs of zones around the axis, and the molecule is linear: there is nothing to turn.
 *
 * Everything is placed in three dimensions (x along the axis, y up, z towards the viewer) and drawn with one oblique
 * projection. Energies and lengths of the carbon-carbon bonds are those of the lesson's table (347, 614, 839 kJ/mol;
 * 154, 134, 120 pm).
 */

type Order = 'singolo' | 'doppio' | 'triplo';
const DATA: Record<Order, { pi: number; energia: number; lunghezza: number; nome: string }> = {
	singolo: { pi: 0, energia: 347, lunghezza: 154, nome: 'etano' },
	doppio: { pi: 1, energia: 614, lunghezza: 134, nome: 'etene' },
	triplo: { pi: 2, energia: 839, lunghezza: 120, nome: 'etino' },
};

type P3 = [number, number, number];
const proj = ([x, y, z]: P3): V => v(x - 0.34 * z, y - 0.26 * z);
/** (y, z) turned by t around the x axis. */
const turn = ([x, y, z]: P3, t: number): P3 => [x, y * Math.cos(t) - z * Math.sin(t), y * Math.sin(t) + z * Math.cos(t)];

const f = frame(-3.3, 3.3, -1.95, 1.95);
const LP = 1.3, WP = 0.4;

export default function LegameValenzaOrdineRotazione({ alt }: { alt?: string }) {
	const [order, setOrder] = useState<Order>('doppio');
	const [deg, setDeg] = useState(0);
	const d = DATA[order];
	const t = order === 'triplo' ? 0 : (deg * Math.PI) / 180;
	const half = (d.lunghezza / 154) * 0.95; // half the distance between the nuclei, to scale
	const L: P3 = [-half, 0, 0], Rt: P3 = [half, 0, 0];
	const at3 = (c: P3, p: P3): V => proj([c[0] + p[0], c[1] + p[1], c[2] + p[2]]);

	// the hydrogens: three per carbon (ethane), two in the plane perpendicular to the p orbitals (ethene), one on the axis
	const hyd = (sideSign: number, turned: number): P3[] => {
		if (order === 'triplo') return [[sideSign * 1.05, 0, 0]];
		if (order === 'doppio') return [1, -1].map((s) => turn([sideSign * 0.95, 0, s * 1.05], turned));
		return [90, 210, 330].map((a) => turn([sideSign * 0.4, 1.0 * Math.sin(((a + (sideSign > 0 ? 180 : 0)) * Math.PI) / 180), 1.0 * Math.cos(((a + (sideSign > 0 ? 180 : 0)) * Math.PI) / 180)], turned));
	};
	const hs = [...hyd(-1, 0).map((p) => ({ c: L, p })), ...hyd(1, t).map((p) => ({ c: Rt, p }))].sort((a, b) => a.p[2] - b.p[2]);

	// the p orbital of each carbon in the double bond: up and down on the left, turned on the right
	const pUp = (c: P3, turned: number, sign: number) => {
		const dir = proj(turn([0, sign, 0], turned));
		return { at: proj(c), th: ang(dir), L: LP * len(dir) };
	};
	const piStrength = Math.cos(t) ** 2;
	const arc = (sign: number) => {
		const a = add(proj(L), v(0.12, sign * LP * 0.86));
		const tip = scale(proj(turn([0, sign, 0], t)), LP * 0.86);
		const b = add(proj(Rt), add(tip, v(-0.12, 0)));
		const m1 = add(a, v(0.25, sign * 0.42)), m2 = add(b, v(-0.25, sign * 0.42));
		const P = (q: V) => `${f.px(q).x.toFixed(2)},${f.px(q).y.toFixed(2)}`;
		return `M${P(a)} C${P(m1)} ${P(m2)} ${P(b)}`;
	};
	const K = f.W / (f.x1 - f.x0);
	const ell = (c: V, rx: number, ry: number, fill: string, key: string) => {
		const p = f.px(c);
		return <ellipse key={key} cx={p.x} cy={p.y} rx={rx * K} ry={ry * K} fill={fill} stroke="#000" strokeWidth={THIN} />;
	};

	const stato = order !== 'doppio' ? '' : deg < 1 ? 'intatto' : deg > 89 ? 'rotto' : 'indebolito';

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<path d={f.path([v(f.x0 + 0.15, 0), v(f.x1 - 0.15, 0)])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />
				{/* behind the axis */}
				{order === 'triplo' && ell(proj([0, 0, -1.9]), half + 0.45, 0.2, '#ccffcc', 'pz-back')}
				{order === 'triplo' && ell(v(0, 0.95), half + 0.45, 0.26, '#ccccff', 'py-up')}
				{hs.filter((h) => h.p[2] <= 0).map((h, i) => (
					<g key={`hb${i}`}>
						<path d={f.path([proj(h.c), at3(h.c, h.p)])} stroke="#000" strokeWidth={1.6} />
						<Atom f={f} at={at3(h.c, h.p)} r={0.2} fill={ATOM_FILL.H}>
							H
						</Atom>
					</g>
				))}
				{order === 'doppio' &&
					[
						{ c: L, turned: 0 },
						{ c: Rt, turned: t },
					].map(({ c, turned }, i) => (
						<g key={`p${i}`}>
							<Lobe f={f} {...pUp(c, turned, 1)} w={WP} fill={SIGN_FILL.plus} />
							<Lobe f={f} {...pUp(c, turned, -1)} w={WP} fill={SIGN_FILL.minus} />
						</g>
					))}
				{/* the sigma bond, on the axis */}
				{ell(v(0, 0), half * 0.62, 0.19, OVERLAP, 'sigma')}
				{order === 'doppio' && piStrength > 0.004 && (
					<g opacity={0.15 + 0.85 * piStrength}>
						<path d={arc(1)} stroke={RESULTANT} strokeWidth={2} strokeDasharray={DASH} fill="none" />
						<path d={arc(-1)} stroke={RESULTANT} strokeWidth={2} strokeDasharray={DASH} fill="none" />
					</g>
				)}
				{order === 'triplo' && ell(v(0, -0.95), half + 0.45, 0.26, '#ccccff', 'py-down')}
				{order === 'triplo' && ell(proj([0, 0, 1.9]), half + 0.45, 0.2, '#ccffcc', 'pz-front')}
				<Atom f={f} at={proj(L)} r={0.2} fill={ATOM_FILL.C}>
					C
				</Atom>
				<Atom f={f} at={proj(Rt)} r={0.2} fill={ATOM_FILL.C}>
					C
				</Atom>
				{hs.filter((h) => h.p[2] > 0).map((h, i) => (
					<g key={`hf${i}`}>
						<path d={f.path([proj(h.c), at3(h.c, h.p)])} stroke="#000" strokeWidth={2.6} />
						<Atom f={f} at={at3(h.c, h.p)} r={0.2} fill={ATOM_FILL.H}>
							H
						</Atom>
					</g>
				))}
			</Drawing>
			<Readout>
				<span>
					legami <Tex>{'\\sigma'}</Tex>: 1
				</span>
				<span>
					legami <Tex>{'\\pi'}</Tex>: {d.pi}
					{stato && ` (${stato})`}
				</span>
				<span>energia: {d.energia} kJ/mol</span>
				<span>lunghezza: {d.lunghezza} pm</span>
			</Readout>
			<Caption>
				{order === 'singolo'
					? `Legame singolo (${d.nome}): un solo legame σ, la zona arancione sull'asse. ${deg > 0 ? `Ruotando l'atomo di destra di ${num(deg, 0)}° il legame resta com'era: attorno a un σ la rotazione è libera.` : "Ruota l'atomo di destra: il legame non cambia."}`
					: order === 'doppio'
						? deg < 1
							? `Legame doppio (${d.nome}): un σ sull'asse e un π, gli archi tratteggiati tra i due orbitali p paralleli. Gli atomi sono più vicini che nel legame singolo.`
							: deg > 89
								? 'A 90° i due orbitali p sono perpendicolari: non si sovrappongono più e il legame π è rotto. Resta il σ.'
								: `Ruotando di ${num(deg, 0)}° i due orbitali p non sono più paralleli: la sovrapposizione diminuisce e il legame π si indebolisce.`
						: `Legame triplo (${d.nome}): un σ sull'asse e due π, uno sopra e sotto (azzurro), uno davanti e dietro (verde). La molecola è lineare e i due π insieme circondano l'asse: non c'è niente da ruotare.`}
			</Caption>
			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Legame" options={(Object.keys(DATA) as Order[]).map((k) => ({ value: k, label: k }))} value={order} onChange={setOrder} />
				</div>
				<Slider label="Rotazione" value={deg} min={0} max={90} step={1} unit="°" onChange={setDeg} />
			</Controls>
		</Figure>
	);
}
