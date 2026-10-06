'use client';

import { useMemo, useState } from 'react';
import { Drawing, Figure, Caption, Controls, Readout, Label, frame, v, FONT, THICK, THIN, INK, type V } from '../kit';
import { WaterMolecule } from './acqua';
import { mulberry32 } from './particelle-materia';
import { Pills } from './chim3-H-pezzi';

/**
 * Lesson 75 (I solidi: ionici, molecolari, covalenti e metallici): the kind of solid, its particles and whether it
 * conducts. The student picks a solid (sodium chloride, ice, iodine, quartz, copper) and its state, solid or molten.
 * A box shows the particles, in order when solid and in disorder when molten; a circuit with a battery and a lamp is
 * closed through the sample, and the lamp is lit when the sample conducts. Under the drawing: the kind of solid, the
 * particles at the nodes, what holds them together, the melting point.
 *
 * The lamp says "accesa" or "spenta" in words and with its rays: no colour carries the answer. Tints as in the
 * lesson's TikZ figure of the four lattices.
 */

type SolidId = 'nacl' | 'ghiaccio' | 'iodio' | 'quarzo' | 'rame';
type State = 'solido' | 'fuso';
const SOLIDS: Record<SolidId, { label: string; tipo: string; particelle: string; forze: string; fusione: string; conduce: Record<State, boolean>; perche: Record<State, string> }> = {
	nacl: {
		label: 'cloruro di sodio',
		tipo: 'ionico',
		particelle: 'ioni Na⁺ e Cl⁻',
		forze: 'legame ionico',
		fusione: '801 °C',
		conduce: { solido: false, fuso: true },
		perche: {
			solido: 'Gli ioni sono cariche, ma sono fermi nei nodi del reticolo: la corrente non passa.',
			fuso: 'Gli ioni sono gli stessi di prima, ma ora si muovono: quelli positivi vanno verso un polo, quelli negativi verso l’altro, e la corrente passa.',
		},
	},
	ghiaccio: {
		label: 'ghiaccio',
		tipo: 'molecolare',
		particelle: 'molecole H₂O',
		forze: 'legami a idrogeno',
		fusione: '0 °C',
		conduce: { solido: false, fuso: false },
		perche: {
			solido: 'Le molecole sono neutre: non ci sono cariche libere, e la corrente non passa.',
			fuso: 'Fondendo si sono allentati i legami a idrogeno, ma le molecole sono rimaste intere e neutre: l’acqua pura non conduce.',
		},
	},
	iodio: {
		label: 'iodio',
		tipo: 'molecolare',
		particelle: 'molecole I₂',
		forze: 'forze di London',
		fusione: '114 °C',
		conduce: { solido: false, fuso: false },
		perche: {
			solido: 'Le molecole sono neutre e gli elettroni sono bloccati nei legami: la corrente non passa.',
			fuso: 'Le molecole I₂ si muovono ma restano intere e neutre: la corrente non passa.',
		},
	},
	quarzo: {
		label: 'quarzo',
		tipo: 'covalente',
		particelle: 'atomi di Si e di O',
		forze: 'legami covalenti in tutto il cristallo',
		fusione: 'circa 1700 °C',
		conduce: { solido: false, fuso: false },
		perche: {
			solido: 'Tutti gli elettroni di valenza sono bloccati nei legami covalenti tra due atomi: la corrente non passa.',
			fuso: 'Per fonderlo si è dovuta spezzare una parte dei legami covalenti, e servono circa 1700 °C. Non ci sono comunque cariche libere: la corrente non passa.',
		},
	},
	rame: {
		label: 'rame',
		tipo: 'metallico',
		particelle: 'ioni positivi di rame tra elettroni liberi',
		forze: 'legame metallico',
		fusione: '1085 °C',
		conduce: { solido: true, fuso: true },
		perche: {
			solido: 'Gli elettroni di valenza sono liberi di muoversi in tutto il cristallo: la corrente passa.',
			fuso: 'Gli ioni sono in disordine, ma gli elettroni liberi ci sono ancora: la corrente passa anche nel metallo fuso.',
		},
	},
};

const f = frame(-0.25, 8.95, -0.75, 3.75);
const K = f.W / (f.x1 - f.x0);
const BOX = { x0: 0, x1: 4.2, y0: 0, y1: 3.2 };

/** n points in the box, at least d apart, the same on every load. */
function scatter(n: number, d: number, seed: number, margin = 0.3): V[] {
	const rnd = mulberry32(seed);
	const out: V[] = [];
	let tries = 0;
	while (out.length < n && tries < 6000) {
		tries++;
		const p = v(BOX.x0 + margin + rnd() * (BOX.x1 - BOX.x0 - 2 * margin), BOX.y0 + margin + rnd() * (BOX.y1 - BOX.y0 - 2 * margin));
		if (tries > 5000 || out.every((q) => Math.hypot(q.x - p.x, q.y - p.y) >= d)) out.push(p);
	}
	return out;
}
const grid = (cols: number, rows: number, dx: number, dy: number): V[] => {
	const x0 = (BOX.x0 + BOX.x1) / 2 - ((cols - 1) * dx) / 2, y0 = (BOX.y0 + BOX.y1) / 2 - ((rows - 1) * dy) / 2;
	return Array.from({ length: cols * rows }, (_, i) => v(x0 + (i % cols) * dx, y0 + Math.floor(i / cols) * dy));
};

function Ion({ at, r, fill, sign }: { at: V; r: number; fill: string; sign?: string }) {
	const p = f.px(at);
	return (
		<g>
			<circle cx={p.x} cy={p.y} r={r * K} fill={fill} stroke="#000" strokeWidth={THIN * 1.6} />
			{sign && (
				<text x={p.x} y={p.y} dy="0.35em" textAnchor="middle" fontSize={r > 0.2 ? 13 : 10} fontFamily={FONT} fill="#000">
					{sign}
				</text>
			)}
		</g>
	);
}

export default function SolidiTipoConduce({ alt }: { alt?: string }) {
	const [id, setId] = useState<SolidId>('nacl');
	const [state, setState] = useState<State>('solido');
	const S = SOLIDS[id];
	const solid = state === 'solido';
	const on = S.conduce[state];

	const particles = useMemo(() => {
		const rnd = mulberry32(75);
		const angles = Array.from({ length: 40 }, () => rnd() * Math.PI * 2);
		if (id === 'nacl') {
			const at = solid ? grid(7, 5, 0.56, 0.56) : scatter(35, 0.46, 11, 0.32);
			return at.map((p, i) => (i % 2 === 0 ? <Ion key={i} at={p} r={0.25} fill="#d9f2d9" sign="−" /> : <Ion key={i} at={p} r={0.16} fill="#ecd9ec" sign="+" />));
		}
		if (id === 'ghiaccio') {
			const at = solid ? grid(5, 3, 0.8, 0.95) : scatter(15, 0.72, 12, 0.45);
			return at.map((p, i) => <WaterMolecule key={i} f={f} w={{ at: p, th: solid ? (i % 2 === 0 ? -Math.PI / 2 : Math.PI / 2) : angles[i] }} scale={1.15} />);
		}
		if (id === 'iodio') {
			const at = solid ? grid(4, 3, 1.0, 0.95) : scatter(12, 0.85, 13, 0.5);
			return at.map((p, i) => {
				const th = solid ? (((i + Math.floor(i / 4)) % 2 === 0 ? 30 : -30) * Math.PI) / 180 : angles[i];
				const d = v(0.2 * Math.cos(th), 0.2 * Math.sin(th));
				return (
					<g key={i}>
						<path d={f.path([v(p.x - d.x, p.y - d.y), v(p.x + d.x, p.y + d.y)])} stroke="#000" strokeWidth={THICK * 1.3} />
						<Ion at={v(p.x - d.x, p.y - d.y)} r={0.19} fill="#ffdfbf" />
						<Ion at={v(p.x + d.x, p.y + d.y)} r={0.19} fill="#ffdfbf" />
					</g>
				);
			});
		}
		if (id === 'quarzo') {
			const cols = 5, rows = 4, dx = 0.86, dy = 0.86;
			const si = grid(cols, rows, dx, dy);
			if (solid) {
				const bonds: [V, V][] = [];
				si.forEach((p, i) => {
					if (i % cols < cols - 1) bonds.push([p, si[i + 1]]);
					if (i + cols < si.length) bonds.push([p, si[i + cols]]);
				});
				return [
					...bonds.map(([a, b], i) => <path key={`b${i}`} d={f.path([a, b])} stroke="#000" strokeWidth={THICK * 1.3} />),
					...bonds.map(([a, b], i) => <Ion key={`o${i}`} at={v((a.x + b.x) / 2, (a.y + b.y) / 2)} r={0.12} fill="#ffcccc" />),
					...si.map((p, i) => <Ion key={`s${i}`} at={p} r={0.19} fill="#c8c8c8" />),
				];
			}
			// molten: the network broken into pieces, each silicon keeping one or two of its oxygens
			const at = scatter(20, 0.62, 14, 0.4);
			return at.flatMap((p, i) => {
				const q = v(p.x + 0.3 * Math.cos(angles[i]), p.y + 0.3 * Math.sin(angles[i]));
				return [<path key={`b${i}`} d={f.path([p, q])} stroke="#000" strokeWidth={THICK * 1.3} />, <Ion key={`o${i}`} at={q} r={0.12} fill="#ffcccc" />, <Ion key={`s${i}`} at={p} r={0.19} fill="#c8c8c8" />];
			});
		}
		const at = solid ? grid(6, 4, 0.66, 0.72) : scatter(24, 0.52, 15, 0.32);
		const electrons = scatter(30, 0.25, 16, 0.15);
		return [
			...at.map((p, i) => <Ion key={i} at={p} r={0.2} fill="#e6e6ff" sign="+" />),
			...electrons.map((p, i) => {
				const q = f.px(p);
				return <circle key={`e${i}`} cx={q.x} cy={q.y} r={2} fill="#000" />;
			}),
		];
	}, [id, solid]);

	// the circuit: out of the sample at the top right, lamp, battery, back in at the bottom right
	const top = 2.55, bottom = 0.65, right = 8.3, lampX = 6.3, batX = 6.3;
	const lamp = f.px(v(lampX, top));
	const lr = 0.36 * K;
	const corner = f.px(v(BOX.x0, BOX.y1));

	return (
		<Figure>
			<Drawing f={f} label={alt}>
				<rect x={corner.x} y={corner.y} width={(BOX.x1 - BOX.x0) * K} height={(BOX.y1 - BOX.y0) * K} fill="none" stroke="#000" strokeWidth={THICK} />
				{particles}
				<Label f={f} at={v((BOX.x0 + BOX.x1) / 2, BOX.y0 - 0.1)} dir={v(0, -1)} upright size={12}>
					{`${S.label}, ${solid ? 'solido' : 'fuso'}`}
				</Label>
				{/* wires */}
				<path d={f.path([v(BOX.x1, top), v(lampX - 0.36, top)])} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(lampX + 0.36, top), v(right, top), v(right, bottom), v(batX + 0.09, bottom)])} fill="none" stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(batX - 0.09, bottom), v(BOX.x1, bottom)])} stroke="#000" strokeWidth={THICK} />
				{/* battery */}
				<path d={f.path([v(batX + 0.09, bottom - 0.32), v(batX + 0.09, bottom + 0.32)])} stroke="#000" strokeWidth={THICK} />
				<path d={f.path([v(batX - 0.09, bottom - 0.17), v(batX - 0.09, bottom + 0.17)])} stroke="#000" strokeWidth={THICK * 2.4} />
				<Label f={f} at={v(batX, bottom - 0.4)} dir={v(0, -1)} upright size={11}>
					pila
				</Label>
				{/* lamp */}
				<circle cx={lamp.x} cy={lamp.y} r={lr} fill="none" stroke="#000" strokeWidth={THICK} />
				<path d={`M${lamp.x - lr * 0.7},${lamp.y - lr * 0.7} L${lamp.x + lr * 0.7},${lamp.y + lr * 0.7} M${lamp.x - lr * 0.7},${lamp.y + lr * 0.7} L${lamp.x + lr * 0.7},${lamp.y - lr * 0.7}`} stroke="#000" strokeWidth={THIN} />
				{on &&
					[30, 60, 90, 120, 150].map((a) => {
						const c = Math.cos((a * Math.PI) / 180), s = Math.sin((a * Math.PI) / 180);
						return <path key={a} d={`M${lamp.x + c * lr * 1.3},${lamp.y - s * lr * 1.3} L${lamp.x + c * lr * 1.95},${lamp.y - s * lr * 1.95}`} stroke={INK.orange} strokeWidth={THICK * 1.5} />;
					})}
				<Label f={f} at={v(lampX, top - 0.42)} dir={v(0, -1)} upright size={12}>
					{on ? 'lampadina accesa' : 'lampadina spenta'}
				</Label>
			</Drawing>
			<Readout>
				<span>solido {S.tipo}</span>
				<span>nei nodi: {S.particelle}</span>
				<span>unite da: {S.forze}</span>
				<span>fonde a {S.fusione}</span>
			</Readout>
			<Caption>
				{`${on ? 'Conduce.' : 'Non conduce.'} ${S.perche[state]}`}
			</Caption>
			<Controls>
				<Pills label="Solido" value={id} onChange={setId} options={(Object.keys(SOLIDS) as SolidId[]).map((k) => ({ value: k, label: SOLIDS[k].label }))} />
				<Pills
					label="Stato"
					value={state}
					onChange={setState}
					options={[
						{ value: 'solido', label: 'solido' },
						{ value: 'fuso', label: 'fuso' },
					]}
				/>
			</Controls>
		</Figure>
	);
}
