'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Figure, Caption, Controls, ButtonRow, FONT } from '../kit';

/**
 * Lesson 35 (La dispersione della luce e i colori), "La sintesi additiva e la sintesi sottrattiva": three overlapping
 * discs. Additive: three lights, red, green and blue, on a dark screen, summed with `mix-blend-mode: screen`, so the
 * overlaps are yellow, cyan, magenta and white. Subtractive: three filters, cyan, magenta and yellow, on white paper,
 * multiplied with `multiply`, so the overlaps are blue, red, green and black. Each light or filter is switched on and
 * off with its button.
 *
 * This drawing is about the colours themselves, so it is NOT a kit <Drawing>: the dark theme's inversion
 * (invert + hue-rotate) would turn the lights' white centre black and the filters' colours into others. The screen and
 * the paper are painted by the figure, the same in both themes.
 */

type Mode = 'additiva' | 'sottrattiva';
const SETS: Record<Mode, { name: string; luce: string; css: string }[]> = {
	additiva: [
		{ name: 'rosso', luce: 'rossa', css: '#ff0000' },
		{ name: 'verde', luce: 'verde', css: '#00ff00' },
		{ name: 'blu', luce: 'blu', css: '#0000ff' }
	],
	sottrattiva: [
		{ name: 'ciano', luce: 'ciano', css: '#00ffff' },
		{ name: 'magenta', luce: 'magenta', css: '#ff00ff' },
		{ name: 'giallo', luce: 'giallo', css: '#ffff00' }
	]
};
/** What the overlaps show, by the set of discs switched on (indices into SETS[mode]). */
const MIX: Record<Mode, Record<string, string>> = {
	additiva: { '': 'buio', '0': 'rosso', '1': 'verde', '2': 'blu', '01': 'giallo', '12': 'ciano', '02': 'magenta', '012': 'bianco' },
	sottrattiva: { '': 'bianco', '0': 'ciano', '1': 'magenta', '2': 'giallo', '01': 'blu', '12': 'rosso', '02': 'verde', '012': 'nero' }
};

const W = 300, H = 270, R = 72;
const CENTRES = [
	{ x: 150, y: 100 },
	{ x: 150 - 46, y: 100 + 80 },
	{ x: 150 + 46, y: 100 + 80 }
];
// Where each disc's name goes: outside, away from the others.
const NAMES = [
	{ x: 150, y: 16 },
	{ x: 26, y: 258 },
	{ x: 274, y: 258 }
];

export default function SintesiColori({ alt }: { alt?: string }) {
	const [mode, setMode] = useState<Mode>('additiva');
	const [on, setOn] = useState([true, true, true]);
	const set = SETS[mode];
	const add = mode === 'additiva';
	const bg = add ? '#101010' : '#ffffff';
	const ink = add ? '#e6e6e6' : '#1a1a1a';
	const pairs = [
		[0, 1],
		[1, 2],
		[0, 2]
	].filter(([a, b]) => on[a] && on[b]);

	let caption: string;
	const lit = set.filter((_, i) => on[i]);
	const names = lit.map((c) => c.name);
	if (names.length === 0) caption = add ? 'Tutte le luci spente: lo schermo resta buio.' : 'Nessun filtro: il foglio resta bianco.';
	else if (names.length === 1) caption = add ? `La luce ${lit[0].luce} da sola illumina lo schermo di ${names[0]}.` : `Il filtro ${names[0]} da solo lascia passare il ${names[0]}.`;
	else {
		const parts = pairs.map(([a, b]) => `${set[a].name} e ${set[b].name} danno ${MIX[mode][`${a}${b}`]}`);
		const text = `${parts.join('; ')}${names.length === 3 ? `; tutti e tre insieme danno ${MIX[mode]['012']}` : ''}. ${add ? 'Le luci si sommano.' : 'Ogni filtro assorbe una parte della luce bianca, e resta quello che nessuno assorbe.'}`;
		caption = text.charAt(0).toUpperCase() + text.slice(1);
	}

	return (
		<Figure>
			<svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="max-w-full rounded-lg" style={{ height: 'auto' }} role="img" aria-label={alt}>
				<rect x={0} y={0} width={W} height={H} fill={bg} stroke={add ? 'none' : '#cccccc'} />
				<g style={{ isolation: 'isolate' }}>
					{set.map((c, i) => on[i] && <circle key={c.name} cx={CENTRES[i].x} cy={CENTRES[i].y} r={R} fill={c.css} style={{ mixBlendMode: add ? 'screen' : 'multiply' }} />)}
				</g>
				{set.map((c, i) => (
					<text key={c.name} x={NAMES[i].x} y={NAMES[i].y} textAnchor={i === 0 ? 'middle' : i === 1 ? 'start' : 'end'} fontSize={14} fontFamily={FONT} fill={on[i] ? ink : add ? '#777' : '#aaa'}>
						{c.name}
					</text>
				))}
			</svg>
			<Caption>{caption}</Caption>
			<Controls>
				<ToggleGroup
					label="Tipo di sintesi"
					options={[
						{ value: 'additiva', label: 'additiva: luci' },
						{ value: 'sottrattiva', label: 'sottrattiva: filtri' }
					]}
					value={mode}
					onChange={(m) => {
						setMode(m);
						setOn([true, true, true]);
					}}
				/>
				<ButtonRow>
					{set.map((c, i) => (
						<Button key={c.name} variant={on[i] ? 'primary' : 'secondary'} size="sm" aria-pressed={on[i]} onClick={() => setOn(on.map((o, j) => (j === i ? !o : o)))}>
							{`${add ? 'luce' : 'filtro'} ${c.luce}`}
						</Button>
					))}
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
