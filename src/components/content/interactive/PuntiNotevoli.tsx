'use client';

import { useId, useState } from 'react';
import { Chip } from '@/components/ui/Field';
import { Caption, Controls, DASH, Dot, Drawing, Figure, Handle, K, Label, Readout, Tex, THICK, THIN, add, angleDeg, clamp, cross, dist, frame, mid, project, scale, sub, unit, v, type V } from './kit';

/**
 * Lesson 61, where the four centres fall: the student drags C over the fixed side AB and switches on altitudes,
 * perpendicular bisectors, medians and angle bisectors. H and O leave the triangle when an angle turns obtuse, and
 * stop on the vertex of the right angle and on the midpoint of the hypotenuse when it is right; G and I never leave.
 * Drawn like the lesson's TikZ figures: fill blue!8, notable lines blue!70!black, circles orange!80!black.
 *
 * C clicks onto the right-angled positions (on the circle with diameter AB, or straight above A or B) when the angle
 * is within 1.5° of a right one, so "rettangolo" is exact and never a rounding. C is kept where H and O stay in the
 * drawing: H.y ≤ 4.1 and H.y, O.y ≥ −1.3.
 */

const f = frame(-1.25, 6.25, -1.75, 4.6);
const FILL = '#ebebff'; // blue!8
const LINE = '#0000b3'; // blue!70!black
const CIRCLE = '#cc6600'; // orange!80!black
const A = v(0, 0);
const B = v(5, 0);
const SNAP = 1.5; // degrees

/** Where C may be: the H and O it makes stay inside the drawing. */
function keep(p: V): V {
	const x = clamp(p.x, -0.9, 5.9);
	const k = x * (5 - x); // H = (x, k / y), O = (2.5, (y² − k) / 2y)
	let y = clamp(p.y, 0.55, 3.6);
	if (k > 0) y = Math.max(y, k / 4.1, (-2.6 + Math.sqrt(2.6 * 2.6 + 4 * k)) / 2); // H below 4.1, O above −1.3
	else y = Math.max(y, -k / 1.3); // H above −1.3
	return v(x, y);
}

/** Onto a right angle, when one is near. */
function snap(p: V): V {
	const c = v(2.5, 0);
	if (Math.abs(angleDeg(A, p, B) - 90) < SNAP) return add(c, scale(unit(sub(p, c)), 2.5));
	if (Math.abs(angleDeg(B, A, p) - 90) < SNAP) return v(0, p.y);
	if (Math.abs(angleDeg(A, B, p) - 90) < SNAP) return v(5, p.y);
	return p;
}

function centres(C: V) {
	const a = dist(B, C), b = dist(A, C), c = dist(A, B);
	const G = scale(add(add(A, B), C), 1 / 3);
	const I = scale(add(add(scale(A, a), scale(B, b)), scale(C, c)), 1 / (a + b + c));
	const r = Math.abs(cross(sub(B, A), sub(C, A))) / (a + b + c);
	// O on the bisector of AB, x = 2.5; H from O and G (Euler: H = 3G − 2O), exact for any triangle.
	const O = v(2.5, (C.y * C.y - C.x * (5 - C.x)) / (2 * C.y));
	const H = sub(scale(G, 3), scale(O, 2));
	return { G, I, O, H, R: dist(O, A), r };
}

const TOGGLES = [
	{ key: 'alt', label: 'Altezze' },
	{ key: 'assi', label: 'Assi' },
	{ key: 'med', label: 'Mediane' },
	{ key: 'bis', label: 'Bisettrici' }
] as const;
type Key = (typeof TOGGLES)[number]['key'];

const inside = (P: V, C: V) => {
	const s1 = cross(sub(B, A), sub(P, A)), s2 = cross(sub(C, B), sub(P, B)), s3 = cross(sub(A, C), sub(P, C));
	return (s1 > 1e-9 && s2 > 1e-9 && s3 > 1e-9) || (s1 < -1e-9 && s2 < -1e-9 && s3 < -1e-9);
};

export default function PuntiNotevoli({ alt }: { alt?: string }) {
	const clip = `punti-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
	const [C, setC] = useState(v(1.8, 3.4));
	const [on, setOn] = useState<Record<Key, boolean>>({ alt: true, assi: true, med: false, bis: false });
	const { G, I, O, H, R, r } = centres(C);
	const ang = { A: angleDeg(B, A, C), B: angleDeg(A, B, C), C: angleDeg(A, C, B) };
	const eps = 1e-6;
	const rightAt = (Object.keys(ang) as (keyof typeof ang)[]).find((k) => Math.abs(ang[k] - 90) < eps);
	const obtuseAt = (Object.keys(ang) as (keyof typeof ang)[]).find((k) => ang[k] > 90 + eps);
	const big = (Object.keys(ang) as (keyof typeof ang)[]).reduce((m, k) => (ang[k] > ang[m] ? k : m), 'A' as keyof typeof ang);

	const seg = (P: V, Q: V) => {
		const p = f.px(P), q = f.px(Q);
		return { x1: p.x, y1: p.y, x2: q.x, y2: q.y };
	};
	const verts: [V, V, V][] = [[A, B, C], [B, C, A], [C, A, B]]; // vertex, then the side opposite it

	// Altitudes: vertex to foot solid, the side produced dashed where the foot falls outside it, and on to H dashed.
	const altitudes = verts.map(([P, Q, S]) => {
		const F = project(P, Q, S);
		const u = sub(S, Q);
		const s = ((F.x - Q.x) * u.x + (F.y - Q.y) * u.y) / (u.x * u.x + u.y * u.y); // where F is along QS, 0 to 1 on the side
		const outside = s < -eps || s > 1 + eps;
		const near = s < 0 ? Q : S;
		const along = (H.x - P.x) * (F.x - P.x) + (H.y - P.y) * (F.y - P.y);
		const toH = dist(P, F) < eps ? null : along < 0 ? P : dist(P, H) > dist(P, F) + eps ? F : null;
		const far = dist(F, Q) > dist(F, S) ? Q : S;
		return { P, F, outside, near, far, toH, atVertex: dist(P, F) < eps };
	});
	// Perpendicular bisectors: from a little beyond the side to a little beyond O.
	const bisectors = verts.map(([, Q, S]) => {
		const M = mid(Q, S);
		const n = unit(v(-(S.y - Q.y), S.x - Q.x));
		const d = (O.x - M.x) * n.x + (O.y - M.y) * n.y;
		const lo = Math.min(0, d) - 0.4, hi = Math.max(0, d) + 0.4;
		return { M, Q, n, lo, hi };
	});

	const labelAt = (P: V, away: V) => add(P, scale(unit(sub(P, away)), 0.02));
	const where = (P: V) => (inside(P, C) ? 'interno' : 'esterno');
	let type: string;
	let hText: string;
	let oText: string;
	if (rightAt) {
		const hyp = rightAt === 'A' ? 'BC' : rightAt === 'B' ? 'AC' : 'AB';
		type = `rettangolo in ${rightAt}`;
		hText = `H coincide con ${rightAt}`;
		oText = `O è il punto medio dell'ipotenusa ${hyp}`;
	} else if (obtuseAt) {
		type = `ottusangolo in ${obtuseAt}`;
		hText = `H è ${where(H)}, dalla parte di ${obtuseAt}`;
		oText = `O è ${where(O)}, oltre il lato opposto ${obtuseAt === 'A' ? 'ad' : 'a'} ${obtuseAt}`;
	} else {
		type = 'acutangolo';
		hText = `H è ${where(H)}`;
		oText = `O è ${where(O)}`;
	}

	const names: Record<keyof typeof ang, string> = { A: 'A', B: 'B', C: 'C' };
	if (rightAt) names[rightAt] = `${rightAt} = H`;
	const centre = v(2.5, 1.2);

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<defs>
					<clipPath id={clip}>
						<rect x={0} y={0} width={f.W} height={f.H} />
					</clipPath>
				</defs>
				<g clipPath={`url(#${clip})`}>
					{on.assi && <circle cx={f.px(O).x} cy={f.px(O).y} r={R * K} fill="none" stroke={CIRCLE} strokeWidth={THIN} />}
					{on.bis && <circle cx={f.px(I).x} cy={f.px(I).y} r={r * K} fill="none" stroke={CIRCLE} strokeWidth={THIN} />}
				</g>
				<polygon points={f.pts(A, B, C)} fill={FILL} stroke="#000" strokeWidth={THICK} strokeLinejoin="round" />

				{on.alt &&
					altitudes.map(({ P, F, outside, near, far, toH, atVertex }, i) => (
						<g key={`h${i}`}>
							{outside && <line {...seg(near, F)} stroke="#000" strokeWidth={THIN} strokeDasharray={DASH} />}
							{!atVertex && <line {...seg(P, F)} stroke={LINE} strokeWidth={THIN * 1.4} />}
							{toH && <line {...seg(toH, H)} stroke={LINE} strokeWidth={THIN} strokeDasharray={DASH} />}
							{!atVertex && dist(F, P) > 0.3 && <polyline points={f.right(F, sub(far, F), sub(P, F), 0.18)} fill="none" stroke="#000" strokeWidth={THIN} />}
						</g>
					))}
				{on.assi &&
					bisectors.map(({ M, Q, n, lo, hi }, i) => (
						<g key={`a${i}`}>
							<line {...seg(add(M, scale(n, lo)), add(M, scale(n, hi)))} stroke={LINE} strokeWidth={THIN * 1.4} />
							<polyline points={f.right(M, sub(Q, M), n, 0.16)} fill="none" stroke="#000" strokeWidth={THIN} />
						</g>
					))}
				{on.med && verts.map(([P, Q, S], i) => <line key={`m${i}`} {...seg(P, mid(Q, S))} stroke={LINE} strokeWidth={THIN * 1.4} />)}
				{on.bis &&
					verts.map(([P, Q, S], i) => {
						const q = dist(P, S), s = dist(P, Q); // the foot divides QS as PQ : PS
						const D = add(Q, scale(sub(S, Q), s / (s + q)));
						return <line key={`b${i}`} {...seg(P, D)} stroke={LINE} strokeWidth={THIN * 1.4} />;
					})}

				{on.alt && !rightAt && (
					<>
						<Dot f={f} at={H} r={2.6} />
						<Label f={f} at={labelAt(H, centre)} dir={H.y > C.y ? v(0, 1) : v(0.8, -0.6)}>H</Label>
					</>
				)}
				{on.assi && (
					<>
						<Dot f={f} at={O} r={2.6} />
						<Label f={f} at={O} dir={O.y < -0.9 ? v(1, 0.3) : rightAt === 'C' || O.y < -eps ? v(0, -1) : v(1, 0.1)}>O</Label>
					</>
				)}
				{on.med && (
					<>
						<Dot f={f} at={G} r={2.6} />
						<Label f={f} at={G} dir={v(0.7, -0.7)}>G</Label>
					</>
				)}
				{on.bis && (
					<>
						<Dot f={f} at={I} r={2.6} />
						<Label f={f} at={I} dir={v(-0.7, 0.7)}>I</Label>
					</>
				)}

				<Label f={f} at={A} dir={v(-0.8, -0.6)}>{names.A}</Label>
				<Label f={f} at={B} dir={v(0.8, -0.6)}>{names.B}</Label>
				<Label f={f} at={C} dir={v(0, 1)}>{names.C}</Label>
				<Handle f={f} at={C} onMove={(p) => setC(snap(keep(p)))} label="Il vertice C" step={0.1} />
			</Drawing>

			<Caption>
				{`Triangolo ${type}: ${hText}, ${oText}. G e I sono interni.`}
			</Caption>
			<Readout>
				<span>
					angolo più grande: <Tex>{`\\hat{${big}} = ${Math.round(ang[big])}^\\circ`}</Tex>
				</span>
			</Readout>

			<Controls>
				<div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Rette da mostrare">
					{TOGGLES.map((t) => (
						<Chip key={t.key} on={on[t.key]} onClick={() => setOn((o) => ({ ...o, [t.key]: !o[t.key] }))}>
							{t.label}
						</Chip>
					))}
				</div>
				<p className="m-0 text-center text-sm text-fg-muted">Trascina C: prova un angolo retto e un angolo ottuso.</p>
			</Controls>
		</Figure>
	);
}
