'use client';

import { useState } from 'react';
import { RotateCcw, Undo2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Drawing, Figure, Caption, Controls, ButtonRow, Readout, Tex, frame, v, TINT, INK, THIN, THICK, VERY_THIN, type V } from '../kit';
import { Words } from '../fisica/calore';

/**
 * Chemistry lesson 54 (Radioattività e decadimenti): a piece of the chart of the nuclides, Z from 81 to 92 across and
 * N from 123 to 147 upwards, the same axes as the lesson's TikZ figure of the band of stability. The student picks
 * the head of a natural radioactive family (uranium-238, uranium-235, thorium-232) and makes the nucleus decay with
 * the α, β⁻ and β⁺ buttons: α moves it two cells left and two down, β⁻ one right and one down, β⁺ (or electron
 * capture) one left and one up. Under the drawing: the nucleus, the equation of the last decay, the count of α and β⁻
 * decays, and whether the decay chosen is the one that nucleus really undergoes.
 *
 * Grey cells are the family's real path (main branches; NUBASE2020, Kondev et al., Chinese Physics C 45, 030001,
 * 2021), green cells the stable nuclides in the window (thallium-205, lead-206, 207 and 208). Whatever the order, the
 * way from uranium-238 to lead-206 takes 8 α and 6 β⁻: the lesson's example 6.
 */

type Move = 'a' | 'b-' | 'b+';
type Nuclide = { Z: number; N: number };

const Z0 = 81, Z1 = 92, N0 = 123, N1 = 147;
const C = 0.3; // a cell's side, cm
const f = frame(-0.95, 7.3, -0.6, (N1 - N0 + 1) * C + 0.45);

const ELEMENTS: Record<number, { sym: string; nome: string; art: string }> = {
	81: { sym: 'Tl', nome: 'tallio', art: 'il ' },
	82: { sym: 'Pb', nome: 'piombo', art: 'il ' },
	83: { sym: 'Bi', nome: 'bismuto', art: 'il ' },
	84: { sym: 'Po', nome: 'polonio', art: 'il ' },
	85: { sym: 'At', nome: 'astato', art: 'l’' },
	86: { sym: 'Rn', nome: 'radon', art: 'il ' },
	87: { sym: 'Fr', nome: 'francio', art: 'il ' },
	88: { sym: 'Ra', nome: 'radio', art: 'il ' },
	89: { sym: 'Ac', nome: 'attinio', art: 'l’' },
	90: { sym: 'Th', nome: 'torio', art: 'il ' },
	91: { sym: 'Pa', nome: 'protoattinio', art: 'il ' },
	92: { sym: 'U', nome: 'uranio', art: 'l’' }
};

const STEP: Record<Move, { dZ: number; dN: number; nome: string }> = {
	a: { dZ: -2, dN: -2, nome: 'α' },
	'b-': { dZ: 1, dN: -1, nome: 'β⁻' },
	'b+': { dZ: -1, dN: 1, nome: 'β⁺' }
};

/** The three natural families: where they start and the decays of their main branch, a for α and b for β⁻. */
const FAMILIES = {
	u238: { label: 'U-238', start: { Z: 92, N: 146 }, path: 'abbaaaaabbabba' },
	u235: { label: 'U-235', start: { Z: 92, N: 143 }, path: 'ababaaaabab' },
	th232: { label: 'Th-232', start: { Z: 90, N: 142 }, path: 'abbaaaabba' }
} as const;
type FamilyKey = keyof typeof FAMILIES;

const STABLE = new Set(['81-124', '82-124', '82-125', '82-126']);
const key = (n: Nuclide) => `${n.Z}-${n.N}`;
const apply = (n: Nuclide, m: Move): Nuclide => ({ Z: n.Z + STEP[m].dZ, N: n.N + STEP[m].dN });
const inside = (n: Nuclide) => n.Z >= Z0 && n.Z <= Z1 && n.N >= N0 && n.N <= N1;
const centre = (n: Nuclide): V => v((n.Z - Z0 + 0.5) * C, (n.N - N0 + 0.5) * C);
const corner = (n: Nuclide): V => v((n.Z - Z0) * C, (n.N - N0 + 1) * C);

/** The nuclides of a family in order, and the decay each one really undergoes. */
function chain(k: FamilyKey) {
	const cells: Nuclide[] = [FAMILIES[k].start];
	for (const ch of FAMILIES[k].path) cells.push(apply(cells[cells.length - 1], ch === 'a' ? 'a' : 'b-'));
	return cells;
}
const REAL = new Map<string, Move>();
for (const k of Object.keys(FAMILIES) as FamilyKey[]) chain(k).forEach((n, i) => i < FAMILIES[k].path.length && REAL.set(key(n), FAMILIES[k].path[i] === 'a' ? 'a' : 'b-'));

const name = (n: Nuclide) => `${ELEMENTS[n.Z].nome}-${n.Z + n.N}`;
const withArticle = (n: Nuclide) => `${ELEMENTS[n.Z].art}${name(n)}`;
const pad = (Z: number, A: number) => (String(A).length > String(Z).length ? '\\ '.repeat(String(A).length - String(Z).length) : '');
const tex = (n: Nuclide) => `{}^{${n.Z + n.N}}_{${pad(n.Z, n.Z + n.N)}${n.Z}}\\mathrm{${ELEMENTS[n.Z].sym}}`;
const PARTICLE: Record<Move, string> = { a: '{}^{4}_{2}\\mathrm{He}', 'b-': '{}^{\\ 0}_{-1}e', 'b+': '{}^{\\ 0}_{+1}e' };

export default function RadioattivitaCartaNuclidi({ alt }: { alt?: string }) {
	const [family, setFamily] = useState<FamilyKey>('u238');
	const [moves, setMoves] = useState<Move[]>([]);

	const trail: Nuclide[] = [FAMILIES[family].start];
	for (const m of moves) trail.push(apply(trail[trail.length - 1], m));
	const now = trail[trail.length - 1];
	const before = trail.length > 1 ? trail[trail.length - 2] : null;
	const last = moves[moves.length - 1];
	const stable = STABLE.has(key(now));
	const alphas = moves.filter((m) => m === 'a').length;
	const betas = moves.filter((m) => m === 'b-').length;
	const others = moves.length - alphas - betas;
	const natural = chain(family);

	const choose = (k: FamilyKey) => {
		setFamily(k);
		setMoves([]);
	};
	const can = (m: Move) => !stable && inside(apply(now, m));

	let caption: string;
	if (!before) caption = `Fai decadere ${withArticle(now)} fino a un nucleo stabile, una casella verde. Quanti decadimenti α e quanti β⁻ servono? Le caselle grigie sono il cammino che la famiglia segue in natura.`;
	else if (stable) caption = `Sei arrivato al ${name(now)}, un nucleo stabile, che non decade più: ${alphas} decadimenti α e ${betas} β⁻${others ? `, più ${others} β⁺` : ''}. Rifallo in un altro ordine: i numeri di α e di β⁻ non cambiano.`;
	else {
		const real = REAL.get(key(before));
		const what = `Con un decadimento ${STEP[last].nome} ${withArticle(before)} diventa ${name(now)}. `;
		if (real === last) caption = what + 'È il decadimento che questo nucleo fa davvero in natura.';
		else if (real) caption = what + `Le due somme tornano, ma in natura ${withArticle(before)} decade ${STEP[real].nome}: con Annulla torni indietro.`;
		else caption = what + 'Le due somme tornano; questo nucleo però non fa parte delle famiglie naturali.';
	}

	const side = C * (f.W / (f.x1 - f.x0));
	// A stable cell has a thick green edge too, so that it does not stand on its tint alone in the dark theme.
	const cell = (n: Nuclide, isStable: boolean, k: string) => {
		const p = f.px(corner(n));
		return isStable ? <rect key={k} x={p.x + 1} y={p.y + 1} width={side - 2} height={side - 2} fill={TINT.green} stroke={INK.green} strokeWidth={THICK * 1.4} /> : <rect key={k} x={p.x} y={p.y} width={side} height={side} fill={TINT.gray} stroke="#000" strokeWidth={VERY_THIN} />;
	};
	const W = (Z1 - Z0 + 1) * C, H = (N1 - N0 + 1) * C;
	const lines: string[] = [];
	for (let i = 0; i <= Z1 - Z0 + 1; i++) lines.push(f.path([v(i * C, 0), v(i * C, H)]));
	for (let j = 0; j <= N1 - N0 + 1; j++) lines.push(f.path([v(0, j * C), v(W, j * C)]));
	const here = f.px(centre(now));
	const legend = (y: number, text: string, mark: 'green' | 'gray' | 'dot') => {
		const p = f.px(v(W + 0.35, y));
		return (
			<g key={text}>
				{mark === 'dot' ? <circle cx={p.x + 6} cy={p.y} r={5} fill={INK.orange} stroke="#000" strokeWidth={THIN} /> : <rect x={p.x} y={p.y - 6} width={12} height={12} fill={mark === 'green' ? TINT.green : TINT.gray} stroke={mark === 'green' ? INK.green : '#000'} strokeWidth={mark === 'green' ? THICK * 1.4 : VERY_THIN} />}
				<Words f={f} at={v(W + 0.78, y)} anchor="start" size={12}>
					{text}
				</Words>
			</g>
		);
	};

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				{natural.map((n, i) => !STABLE.has(key(n)) && cell(n, false, `g${i}`))}
				{[...STABLE].map((s) => {
					const [Z, N] = s.split('-').map(Number);
					return cell({ Z, N }, true, `s${s}`);
				})}
				<path d={lines.join(' ')} stroke="#000" strokeWidth={VERY_THIN} opacity={0.25} fill="none" />
				<path d={f.path([v(0, 0), v(W, 0), v(W, H), v(0, H)], true)} stroke="#000" strokeWidth={THIN} fill="none" />
				{Object.entries(ELEMENTS).map(([Z, el]) => (
					<Words key={Z} f={f} at={v((Number(Z) - Z0 + 0.5) * C, -0.2)} size={9}>
						{el.sym}
					</Words>
				))}
				<Words f={f} at={v(W / 2, -0.47)} size={11}>
					Z da 81 a 92
				</Words>
				{[125, 130, 135, 140, 145].map((N) => (
					<Words key={N} f={f} at={v(-0.1, (N - N0 + 0.5) * C)} anchor="end" size={10}>
						{N}
					</Words>
				))}
				<Words f={f} at={v(-0.1, H + 0.22)} anchor="end" size={11}>
					N
				</Words>
				{trail.length > 1 && <path d={f.path(trail.map(centre))} stroke={INK.orange} strokeWidth={THICK * 1.4} fill="none" strokeLinejoin="round" />}
				<circle cx={here.x} cy={here.y} r={5} fill={INK.orange} stroke="#000" strokeWidth={THIN} />
				{legend(H - 0.3, 'nucleo stabile', 'green')}
				{legend(H - 0.85, 'famiglia naturale', 'gray')}
				{legend(H - 1.4, 'il tuo nucleo', 'dot')}
				<Words f={f} at={v(W + 0.35, H - 2.3)} anchor="start" size={12}>
					α: 2 a sinistra, 2 in giù
				</Words>
				<Words f={f} at={v(W + 0.35, H - 2.75)} anchor="start" size={12}>
					β⁻: 1 a destra, 1 in giù
				</Words>
				<Words f={f} at={v(W + 0.35, H - 3.2)} anchor="start" size={12}>
					β⁺: 1 a sinistra, 1 in su
				</Words>
			</Drawing>

			<Readout>
				<span className="text-base">
					<Tex>{before ? `${tex(before)} \\longrightarrow ${tex(now)} + ${PARTICLE[last]}` : tex(now)}</Tex>
				</span>
				<span>
					<Tex>{`Z = ${now.Z}`}</Tex>, <Tex>{`N = ${now.N}`}</Tex>, <Tex>{`A = ${now.Z + now.N}`}</Tex>
				</span>
				<span>
					α: {alphas}, β⁻: {betas}
				</span>
			</Readout>
			<Caption>{caption}</Caption>

			<Controls>
				<div className="flex justify-center">
					<ToggleGroup label="Capostipite" value={family} onChange={choose} options={(Object.keys(FAMILIES) as FamilyKey[]).map((k) => ({ value: k, label: FAMILIES[k].label }))} />
				</div>
				<ButtonRow>
					<Button variant="secondary" size="sm" aria-label="Decadimento alfa" disabled={!can('a')} onClick={() => setMoves([...moves, 'a'])}>
						α
					</Button>
					<Button variant="secondary" size="sm" aria-label="Decadimento beta meno" disabled={!can('b-')} onClick={() => setMoves([...moves, 'b-'])}>
						β⁻
					</Button>
					<Button variant="secondary" size="sm" aria-label="Decadimento beta più" disabled={!can('b+')} onClick={() => setMoves([...moves, 'b+'])}>
						β⁺
					</Button>
					<Button variant="secondary" size="sm" disabled={moves.length === 0} onClick={() => setMoves(moves.slice(0, -1))}>
						<Undo2 className="size-4" aria-hidden="true" />
						Annulla
					</Button>
					<Button variant="secondary" size="sm" disabled={moves.length === 0} onClick={() => setMoves([])}>
						<RotateCcw className="size-4" aria-hidden="true" />
						Ricomincia
					</Button>
				</ButtonRow>
			</Controls>
		</Figure>
	);
}
