'use client';

import { useState } from 'react';
import { Slider } from '@/components/ui/Slider';
import { add, ang, Caption, clamp, Controls, DASH, Drawing, Figure, frame, Handle, Label, polar, project, Readout, sub, Tex, THICK, THIN, TINT, len, v, type V } from '../kit';
import { QTY, Vector } from '../fisica';
import { ArcoRotazione, Perno } from './leve';

/**
 * Lesson 22 (Il momento di una forza e di una coppia di forze), "Il momento di una forza obliqua": a wrench turns
 * around the nut O; the student drags the point P where the force is applied along the handle, drags the tip of the
 * force to turn it, and sets its intensity. The figure draws the line of action (dashed), the lever arm b from O to
 * that line (orange, with its right angle, as in the TikZ figure `braccio-di-una-forza`), the angle α between the
 * force and the handle, and the sense of rotation; under it d, α, b = d sin α and M = F b with its sign
 * (counterclockwise positive, as the lesson chooses).
 *
 * Scale: 1 cm of the drawing is 0,1 m of the wrench, and 1 cm of arrow is 25 N.
 */

const K_FORCE = 1 / 25; // cm per newton
const D = { min: 1, max: 4.2 }; // where P can be, in cm (0,10 m to 0,42 m)
const f = frame(-1.0, 7.0, -2.95, 2.95);
const O = v(0, 0);
const HEX = Array.from({ length: 6 }, (_, i) => polar(0.35, (i * Math.PI) / 3));
const RAD = Math.PI / 180;
/** x with exactly `k` decimals and the decimal comma, for <Tex>. */
const fix = (x: number, k: number) => x.toFixed(k).replace('.', '{,}');

export default function ChiaveInglese({ alt }: { alt?: string }) {
	const [d, setD] = useState(3);
	const [deg, setDeg] = useState(60);
	const [F, setF] = useState(40);

	const P = v(d, 0);
	const a = deg * RAD;
	const u = polar(1, a);
	const tip = add(P, polar(F * K_FORCE, a));
	const H = project(O, P, add(P, u));
	const s = Math.sin(a);
	const dm = d / 10;
	const bm = dm * Math.abs(s);
	const M = F * dm * s;
	const zero = Math.abs(s) < 1e-9;
	const perpendicular = Math.abs(Math.abs(s) - 1) < 1e-9;
	// The angle between the force and the handle, 0° to 180°, as the lesson measures it.
	const alpha = deg <= 180 ? deg : 360 - deg;
	const sense = zero ? 'nessuna rotazione' : M > 0 ? 'antiorario' : 'orario';
	const sign = zero ? '' : M > 0 ? '+' : '-';

	const moveTip = (p: V) => {
		if (len(sub(p, P)) < 0.3) return;
		const x = Math.round(((ang(sub(p, P)) / RAD + 360) % 360) / 5) * 5;
		setDeg(x % 360);
	};
	const moveP = (p: V) => setD(clamp(Math.round(p.x * 10) / 10, D.min, D.max));

	// The arc of α at P: from the handle (pointing away from O) to the force, the short way round.
	const arcTo = deg <= 180 ? a : a - 2 * Math.PI;
	const mid = arcTo / 2;

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{/* the line of action, long enough to leave the frame */}
				<path d={f.path([add(P, polar(-12, a)), add(P, polar(12, a))])} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} fill="none" />
				{/* the wrench: the handle and the nut */}
				<path d={f.path([v(0.3, -0.1), v(4.6, -0.1), v(4.6, 0.1), v(0.3, 0.1)], true)} fill={TINT.blue} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				<path d={f.path(HEX, true)} fill={TINT.gray} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />
				{/* the lever arm */}
				{!zero && <path d={f.path([O, H])} stroke={QTY.risultante} strokeWidth={THICK} fill="none" />}
				{!zero && bm > 0.012 && <polyline points={f.right(H, sub(O, H), len(sub(P, H)) > 1e-6 ? sub(P, H) : u, 0.18)} fill="none" stroke="#000" strokeWidth={THIN} />}
				{!zero && (
					<Label f={f} at={add(O, polar(0.5 * len(H), Math.atan2(H.y, H.x)))} dir={polar(1, Math.atan2(H.y, H.x) + (s > 0 ? -Math.PI / 2 : Math.PI / 2))} color={QTY.risultante}>
						b
					</Label>
				)}
				{/* α at P */}
				{alpha > 2 && alpha < 178 && <ArcoArc from={0} to={arcTo} P={P} />}
				{alpha > 2 && alpha < 178 && (
					<Label f={f} at={add(P, polar(0.62, mid))} upright>
						α
					</Label>
				)}
				{/* the sense of rotation around O */}
				{!zero && (M > 0 ? <ArcoRotazione f={f} c={O} r={0.7} a0={2.6} a1={4.1} /> : <ArcoRotazione f={f} c={O} r={0.7} a0={4.1} a1={2.6} />)}
				<Vector f={f} from={P} to={tip} color={QTY.forza} name="F" />
				<Perno f={f} at={O} />
				<Label f={f} at={v(0, 0.36)} dir={v(0, 1)}>
					O
				</Label>
				<Label f={f} at={P} dir={v(0.5, s > 0 ? -1 : 1)}>
					P
				</Label>
				<Handle f={f} at={P} onMove={moveP} label="Punto di applicazione P, lungo il manico" color={QTY.forza} />
				<Handle f={f} at={tip} onMove={moveTip} label="Punta della forza: ruotala" color={QTY.forza} />
			</Drawing>

			<Readout>
				<span>
					<Tex>{`d = ${fix(dm, 2)}\\,\\text{m}`}</Tex>
				</span>
				<span>
					<Tex>{`\\alpha = ${alpha}^\\circ`}</Tex>
				</span>
				<span>
					<Tex>{`b = d \\sin\\alpha = ${fix(bm, 2)}\\,\\text{m}`}</Tex>
				</span>
				<span>
					<Tex>{`M = ${sign}${fix(Math.abs(M), 1)}\\,\\text{N} \\cdot \\text{m}`}</Tex> ({sense})
				</span>
			</Readout>
			<Caption>
				{zero
					? 'La retta d’azione passa per il dado O: il braccio è nullo e la forza non fa ruotare la chiave, per quanto sia intensa.'
					: perpendicular
						? 'La forza è perpendicolare al manico: il braccio è lungo quanto d, il più lungo possibile, e il momento è il più grande.'
						: 'Il braccio b è la distanza di O dalla retta d’azione, più corta di d: trascina la punta della forza per ruotarla, o il punto P lungo il manico.'}
			</Caption>

			<Controls>
				<Slider label="Intensità della forza" value={F} min={10} max={60} step={5} unit="N" onChange={setF} />
				<Slider label="Angolo dal manico, in senso antiorario" value={deg} min={0} max={355} step={5} unit="°" onChange={(x) => setDeg(Math.round(x))} />
			</Controls>
		</Figure>
	);
}

/** The small arc of the angle α at P, from direction `from` to `to` (radians, either way round). */
function ArcoArc({ P, from, to }: { P: V; from: number; to: number }) {
	const n = 20;
	const pts: V[] = [];
	for (let i = 0; i <= n; i++) pts.push(add(P, polar(0.4, from + ((to - from) * i) / n)));
	return <path d={f.path(pts)} stroke="#000" strokeWidth={THIN} fill="none" />;
}
