'use client';

import { Drawing, frame, v, add, polar, FONT, FONT_MATH, THIN, TINT, type V, type Frame } from '@/components/content/interactive/kit';
import { Arrow, Ground, QTY } from '@/components/content/interactive/fisica';
import { Asta, Fulcro, Perno, Quota, ROD } from '@/components/content/interactive/fisica/leve';
import type { SceneProps } from '.';

/**
 * A rod with its supports, the forces on it and the distances between them, as lessons 22-25 draw them (a rigid
 * body, a lever, a beam on two supports, a plank on the edge of a table). Positions along the rod are in metres from
 * its left end; the scene draws the rod `lunghezza` metres long in 6 cm (or `scala` cm per metre).
 *
 *   { type: 'asta-forze', data: {
 *       lunghezza: 2,                                   // metres
 *       appoggi: [{ x: 1, tipo: 'fulcro' }],            // 'fulcro' (a triangle under the rod), 'perno' (a pivot on it),
 *                                                       // 'tavolo' (a table top under the rod, from its left end to x)
 *       forze: [{ x: 0.4, angolo: -90, nome: 'F', sub: '1', valore: '30 N', lunghezza: 1.2, arco: '30°' }],
 *       masse: [{ x: 1.8, valore: '2,0 kg' }],          // small blocks sitting on the rod
 *       quote: [{ da: 0.4, a: 1, testo: '0,60 m', livello: 0, lato: 'sopra' }],
 *       punti: [{ x: 1, nome: 'O', dx: 0 }]              // a name under a point of the rod (moved by dx cm, and lower, if dx)
 *   } }
 *
 * A force's `angolo` is in degrees from the rod's direction (−90 downwards, 90 upwards); its arrow is `lunghezza` cm
 * long (1,2 by default) and starts from the rod's middle line; `valore` is written beside the name ("F₁ = 30 N", or
 * "F₁ = ?" for the unknown); `arco` marks the angle between the rod, beyond the point, and the force. The scene draws
 * only the data: what the exercise asks is a "?" or is left out.
 */

type Appoggio = { x: number; tipo: 'fulcro' | 'perno' | 'tavolo'; nome?: string };
type Forza = { x: number; angolo: number; nome: string; sub?: string; valore?: string; lunghezza?: number; arco?: string; colore?: keyof typeof QTY };
type Massa = { x: number; valore: string };
type QuotaD = { da: number; a: number; testo: string; livello?: number; lato?: 'sopra' | 'sotto' };
type Punto = { x: number; nome: string; dx?: number };

const SIZE = 13;
const CH = 0.2; // an average character, in cm, at SIZE
const RAD = Math.PI / 180;

/** "F₁ = 30 N": the name italic, its subscript, then the value upright. */
function Name({ f, at, anchor, nome, sub, valore, color }: { f: Frame; at: V; anchor: 'start' | 'middle' | 'end'; nome: string; sub?: string; valore?: string; color: string }) {
	const p = f.px(at);
	return (
		<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={SIZE} fill={color} pointerEvents="none">
			<tspan fontStyle="italic" fontFamily={FONT_MATH}>
				{nome}
			</tspan>
			{sub && (
				<tspan fontSize={SIZE * 0.7} dy={SIZE * 0.22} fontFamily={/^\d+$/.test(sub) ? FONT : FONT_MATH} fontStyle={/^\d+$/.test(sub) ? 'normal' : 'italic'}>
					{sub}
				</tspan>
			)}
			{valore && (
				<tspan fontFamily={FONT} dy={sub ? -SIZE * 0.22 : 0}>
					{` = ${valore}`}
				</tspan>
			)}
		</text>
	);
}

function Text({ f, at, children, anchor = 'middle' }: { f: Frame; at: V; children: string; anchor?: 'start' | 'middle' | 'end' }) {
	const p = f.px(at);
	return (
		<text x={p.x} y={p.y} dy="0.35em" textAnchor={anchor} fontSize={SIZE} fontFamily={FONT} pointerEvents="none">
			{children}
		</text>
	);
}

const nameWidth = (F: Forza) => (F.nome.length + (F.sub?.length ?? 0) * 0.7 + (F.valore ? F.valore.length + 3 : 0)) * CH;

export default function AstaForze({ data, alt }: SceneProps) {
	const L = Number(data.lunghezza ?? 1);
	const k = Number(data.scala ?? 6 / L);
	const appoggi = (data.appoggi as Appoggio[] | undefined) ?? [];
	const forze = (data.forze as Forza[] | undefined) ?? [];
	const masse = (data.masse as Massa[] | undefined) ?? [];
	const quote = (data.quote as QuotaD[] | undefined) ?? [];
	const punti = (data.punti as Punto[] | undefined) ?? [];
	const X = (x: number) => x * k;
	const mid = ROD / 2;

	// Each force: its tip, and where its name goes (past the tip, on the side it points to).
	const quoteY = (q: QuotaD) => (q.lato === 'sotto' ? -0.75 - 0.5 * (q.livello ?? 0) : ROD + 0.35 + 0.5 * (q.livello ?? 0));
	// What a name must not cover: each distance's line and its text, as boxes [x0, x1, y0, y1].
	const blocked = quote.flatMap((q) => {
		const y = quoteY(q);
		const ty = y + (q.lato === 'sotto' ? -0.27 : 0.25);
		const cx = (X(q.da) + X(q.a)) / 2, hw = (q.testo.length * CH) / 2 + 0.05;
		return [
			[Math.min(X(q.da), X(q.a)), Math.max(X(q.da), X(q.a)), y - 0.08, y + 0.08],
			[cx - hw, cx + hw, ty - 0.17, ty + 0.17],
		];
	});
	const hits = (b: number[], y: number) => blocked.some(([x0, x1, y0, y1]) => b[0] < x1 && b[1] > x0 && y - 0.17 < y1 && y + 0.17 > y0);

	// Each force: its tip, and where its name goes (past the tip, on the side it points to, beyond any distance it would cover).
	const arrows = forze.map((F) => {
		const from = v(X(F.x), mid);
		const a = F.angolo * RAD;
		const tip = add(from, polar(F.lunghezza ?? 1.2, a));
		const u = polar(1, a);
		const vertical = Math.abs(u.x) < 0.3;
		let at = vertical ? add(tip, v(0, u.y > 0 ? 0.28 : -0.28)) : add(tip, v(u.x > 0 ? 0.12 : -0.12, 0.25));
		const anchor: 'start' | 'middle' | 'end' = vertical ? 'middle' : u.x > 0 ? 'start' : 'end';
		const w = nameWidth(F);
		const box = anchor === 'middle' ? [at.x - w / 2, at.x + w / 2] : anchor === 'start' ? [at.x, at.x + w] : [at.x - w, at.x];
		for (let i = 0; vertical && i < 6 && hits(box, at.y); i++) at = add(at, v(0, u.y > 0 ? 0.25 : -0.25));
		return { F, from, tip, at, anchor, box };
	});

	const hasTable = appoggi.some((s) => s.tipo === 'tavolo');
	const xs = [0, X(L), ...arrows.flatMap((a) => [a.tip.x, ...a.box]), ...quote.flatMap((q) => [X(q.da), X(q.a)]), ...appoggi.map((s) => X(s.x) + (s.tipo === 'fulcro' ? 0.5 : 0.2)), ...punti.map((p) => X(p.x) + (p.dx ?? 0) + (p.dx ? Math.sign(p.dx) * 0.2 : 0)), ...masse.flatMap((m) => [X(m.x) - (m.valore.length * CH) / 2 - 0.05, X(m.x) + (m.valore.length * CH) / 2 + 0.05])];
	const ys = [ROD + 0.1, ...arrows.flatMap((a) => [a.tip.y, a.at.y + 0.2, a.at.y - 0.2]), ...quote.map((q) => quoteY(q) + (q.lato === 'sotto' ? -0.35 : 0.4)), ...masse.map(() => ROD + 1.0)];
	if (appoggi.some((s) => s.tipo === 'fulcro')) ys.push(-0.55);
	if (hasTable) ys.push(-0.95);
	if (punti.length) ys.push(-0.5);
	const x0 = Math.min(...xs, hasTable ? -0.6 : 0) - 0.25;
	const f = frame(x0, Math.max(...xs) + 0.25, Math.min(...ys) - 0.1, Math.max(...ys) + 0.1);

	return (
		<Drawing f={f} label={alt}>
			{appoggi
				.filter((s) => s.tipo === 'tavolo')
				.map((s, i) => (
					<g key={`t${i}`}>
						<path d={f.path([v(X(s.x), 0), v(X(s.x), -0.85)])} stroke="#000" strokeWidth={1.2} fill="none" />
						<Ground f={f} from={v(f.x0, 0)} to={v(X(s.x), 0)} />
					</g>
				))}
			{appoggi
				.filter((s) => s.tipo === 'fulcro')
				.map((s, i) => (
					<Fulcro key={`f${i}`} f={f} at={v(X(s.x), 0)} />
				))}
			<Asta f={f} from={v(0, 0)} to={v(X(L), 0)} />
			{masse.map((m, i) => (
				<g key={`m${i}`}>
					<path d={f.path([v(X(m.x) - 0.22, ROD), v(X(m.x) + 0.22, ROD), v(X(m.x) + 0.22, ROD + 0.4), v(X(m.x) - 0.22, ROD + 0.4)], true)} fill={TINT.orange} stroke="#000" strokeWidth={1.2} />
					<Text f={f} at={v(X(m.x), ROD + 0.75)}>
						{m.valore}
					</Text>
				</g>
			))}
			{quote.map((q, i) => {
				const y = quoteY(q);
				const ty = y + (q.lato === 'sotto' ? -0.27 : 0.25);
				const hw = (q.testo.length * CH) / 2 + 0.15;
				let cx = (X(q.da) + X(q.a)) / 2;
				// A force's arrow through the text: the text moves beside it, on the side with more room.
				const through = arrows.find((a) => Math.abs(a.tip.x - a.from.x) < 0.05 && Math.abs(a.from.x - cx) < hw && Math.min(a.from.y, a.tip.y) < ty + 0.15 && Math.max(a.from.y, a.tip.y) > ty - 0.15);
				if (through) {
					const lo = Math.min(X(q.da), X(q.a)), hi = Math.max(X(q.da), X(q.a));
					cx = through.from.x - lo > hi - through.from.x ? through.from.x - hw : through.from.x + hw;
				}
				return (
					<g key={`q${i}`}>
						<Quota f={f} a={v(X(q.da), y)} b={v(X(q.a), y)} />
						<Text f={f} at={v(cx, ty)}>
							{q.testo}
						</Text>
					</g>
				);
			})}
			{arrows.map(({ F, from }, i) => {
				if (!F.arco) return null;
				const a = F.angolo * RAD;
				const n = 16;
				const r = 0.45;
				const pts: V[] = Array.from({ length: n + 1 }, (_, j) => add(from, polar(r, (a * j) / n)));
				const lab0 = add(from, polar(r + 0.35, a / 2));
				// Clear of the rod: above it for a force upwards, under it for one downwards.
				const lab = v(lab0.x, a > 0 ? Math.max(lab0.y, ROD + 0.22) : Math.min(lab0.y, -0.22));
				return (
					<g key={`a${i}`}>
						<path d={f.path(pts)} stroke="#000" strokeWidth={THIN} fill="none" />
						<Text f={f} at={lab} anchor="start">
							{F.arco}
						</Text>
					</g>
				);
			})}
			{arrows.map(({ F, from, tip, at, anchor }, i) => (
				<g key={`F${i}`}>
					<Arrow f={f} from={from} to={tip} color={QTY[F.colore ?? 'forza']} />
					<Name f={f} at={at} anchor={anchor} nome={F.nome} sub={F.sub} valore={F.valore} color={QTY[F.colore ?? 'forza']} />
				</g>
			))}
			{appoggi
				.filter((s) => s.tipo === 'perno')
				.map((s, i) => (
					<Perno key={`p${i}`} f={f} at={v(X(s.x), mid)} />
				))}
			{punti.map((p, i) => {
				const q = f.px(v(X(p.x) + (p.dx ?? 0), p.dx ? -0.1 : -0.28));
				return (
					<text key={`n${i}`} x={q.x} y={q.y} dy="0.35em" textAnchor="middle" fontSize={SIZE + 1} fontStyle="italic" fontFamily={FONT_MATH} pointerEvents="none">
						{p.nome}
					</text>
				);
			})}
		</Drawing>
	);
}
