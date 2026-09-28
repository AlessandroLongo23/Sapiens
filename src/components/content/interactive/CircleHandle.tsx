'use client';

import { useState, type KeyboardEvent, type PointerEvent } from 'react';
import { add, ang, polar, sub, type Frame, type V } from './kit';

/** A number for <Tex>: the Italian comma, braced so KaTeX sets no space after it. */

/** The position angle of P seen from C, in whole degrees between 0 and 359. */
export const degAt = (p: V, c: V) => (((Math.round((ang(sub(p, c)) * 180) / Math.PI) % 360) + 360) % 360);
/** The point of the circle (C, r) at `deg` degrees. */
export const onCircle = (c: V, r: number, deg: number) => add(c, polar(r, (deg * Math.PI) / 180));
/** x mod 360, between 0 and 360. */
export const mod360 = (x: number) => ((x % 360) + 360) % 360;

/**
 * A point that lives on a circle, at a whole number of degrees. Like the kit's Handle, but the arrows turn it along
 * the circle (one degree, ten with Shift; right and up counterclockwise), since moving it left or right in the plane
 * does nothing where the circle is vertical.
 */
export function CircleHandle({ f, c, r, deg, onDeg, label, color = '#000', onEnd }: { f: Frame; c: V; r: number; deg: number; onDeg: (deg: number) => void; label: string; color?: string; onEnd?: () => void }) {
	const p = f.px(onCircle(c, r, deg));
	const [active, setActive] = useState(false);
	const down = (e: PointerEvent<SVGGElement>) => {
		e.preventDefault();
		e.stopPropagation();
		e.currentTarget.setPointerCapture(e.pointerId);
		setActive(true);
	};
	const move = (e: PointerEvent<SVGGElement>) => {
		if (!active) return;
		const svg = e.currentTarget.ownerSVGElement;
		if (svg) onDeg(degAt(f.toTikz(e, svg), c));
	};
	const up = () => {
		setActive(false);
		onEnd?.();
	};
	const key = (e: KeyboardEvent<SVGGElement>) => {
		const d = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1 }[e.key];
		if (!d) return;
		e.preventDefault();
		onDeg(mod360(deg + d * (e.shiftKey ? 10 : 1)));
		onEnd?.();
	};
	return (
		<g
			role="slider"
			tabIndex={0}
			aria-label={`${label}: trascinalo sulla circonferenza, oppure usa le frecce`}
			aria-valuenow={deg}
			aria-valuemin={0}
			aria-valuemax={359}
			aria-valuetext={`${deg} gradi`}
			className="group cursor-grab outline-none active:cursor-grabbing"
			style={{ touchAction: 'none' }}
			onPointerDown={down}
			onPointerMove={move}
			onPointerUp={up}
			onPointerCancel={up}
			onKeyDown={key}
		>
			<circle cx={p.x} cy={p.y} r={16} fill="transparent" />
			<circle cx={p.x} cy={p.y} r={7} fill="none" stroke={color} strokeWidth={1} className={active ? 'opacity-60' : 'opacity-0 transition-opacity group-hover:opacity-40 group-focus-visible:opacity-80'} />
			<circle cx={p.x} cy={p.y} r={3} fill={color} />
		</g>
	);
}
