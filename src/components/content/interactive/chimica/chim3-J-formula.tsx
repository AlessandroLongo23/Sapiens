'use client';

import { FONT, type Frame, type V } from '../kit';

/**
 * A chemical formula as SVG text, for the drawings of lessons 80-82 (chemistry, third year, group J): the formula is
 * written as in LaTeX without \mathrm (`H_2SO_4`, `SO_4^{2-}`, `Al_2(SO_4)_3`, `CuSO_4 \cdot 5H_2O`), with indices
 * lowered and charges raised.
 */

type Piece = { text: string; shift: 'none' | 'sub' | 'sup' };

export function pieces(tex: string): Piece[] {
	const out: Piece[] = [];
	const re = /_\{([^}]*)\}|_(\d)|\^\{([^}]*)\}|\^([+-])|\\cdot|([^_^\\]+)/g;
	for (const m of tex.matchAll(re)) {
		if (m[1] !== undefined || m[2] !== undefined) out.push({ text: m[1] ?? m[2], shift: 'sub' });
		else if (m[3] !== undefined || m[4] !== undefined) out.push({ text: (m[3] ?? m[4]).replace('-', '−'), shift: 'sup' });
		else if (m[0] === '\\cdot') out.push({ text: ' · ', shift: 'none' });
		else out.push({ text: m[5].replace(/ /g, ''), shift: 'none' });
	}
	return out;
}

/** The formula centred at `at` (TikZ centimetres), upright. */
export function Formula({ f, at, tex, size = 17, color = '#000' }: { f: Frame; at: V; tex: string; size?: number; color?: string }) {
	const p = f.px(at);
	const parts = pieces(tex);
	const offset = (piece?: Piece) => (piece?.shift === 'sub' ? 0.35 : piece?.shift === 'sup' ? -0.55 : 0);
	return (
		<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={size} fontFamily={FONT} fill={color} pointerEvents="none">
			{parts.map((piece, i) => (
				// each tspan moves by the difference from the piece before it: dy adds up along the text
				<tspan key={i} dy={((offset(piece) - offset(parts[i - 1])) * size * 0.7).toFixed(2)} fontSize={piece.shift === 'none' ? size : size * 0.7}>
					{piece.text}
				</tspan>
			))}
		</text>
	);
}
