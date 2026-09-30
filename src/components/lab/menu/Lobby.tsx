'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Play, Radio } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { LABELS, SIGNALS, type ClassSettings } from '@/lib/lab/catalog';

/*
 * The class room's waiting room, full screen in the lab's colours (the title and pause screens of Esperimento.tsx):
 * the room code for the students, the rules the teacher chose, and the plan of the room, where each place fills
 * with a face as someone comes in. There is no server yet: the arrivals are simulated, and it says so.
 */

// the aula's plan (scripts/lab/build_aula.py), Blender metres, mapped to the drawing
const X0 = -2.3;
const Y1 = 5.4;
const S = 40;
const px = (x: number) => (x - X0) * S;
const py = (y: number) => (Y1 - y) * S;
const DESK_L = 2.6;
const DESK_D = 0.8;
const COLUMNS = [-0.65, 3.35];
const ROWS = [1.52, -0.38, -2.28];
const GROUP_COLOURS = ['#f2b76b', '#8fd0c1', '#b9a6ec', '#f29a8f', '#9cc6f0', '#d9dc86', '#f0a6cf', '#a8d890', '#e6c29b', '#86c9e6', '#d7a3f0', '#f5d27a'];

type Seat = { x: number; y: number; group: number; label: string };

function seats(s: ClassSettings): Seat[] {
	const out: Seat[] = [];
	let desk = 0;
	for (const [r, y0] of ROWS.entries())
		for (const [c, x0] of COLUMNS.entries()) {
			for (const half of [0, 1]) {
				const hx = x0 + DESK_L / 4 + (half * DESK_L) / 2;
				const offsets = s.seats === 24 ? [-0.28, 0.28] : [0];
				offsets.forEach((dx, k) => {
					const i = out.length;
					const group = s.groups === 'banco' ? desk : s.groups === 'meta' ? desk * 2 + half : i;
					out.push({
						x: hx + dx,
						y: y0 - 0.42,
						group,
						label: `Banco ${r + 1}${'AB'[c]}, ${half ? 'destra' : 'sinistra'}${offsets.length > 1 ? ` ${k + 1}` : ''}`
					});
				});
			}
			desk++;
		}
	return out;
}

/** A code the students type: stable for the same set-up, easy to read aloud (no 0/O, 1/I). */
function roomCode(key: string) {
	const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
	let h = 2166136261;
	for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
	let s = '';
	for (let i = 0; i < 6; i++) {
		s += A[(h >>> (i * 5)) & 31];
		if (i === 2) s += '-';
	}
	return s;
}

export function Lobby({ settings, title, lab, onStart }: { settings: ClassSettings; title: string; lab: string; onStart: () => void }) {
	const list = useMemo(() => seats(settings), [settings]);
	const code = useMemo(() => roomCode(JSON.stringify(settings) + title), [settings, title]);
	// the simulated arrivals: one every half second or so, in a shuffled order, until all but two are in
	const order = useMemo(() => list.map((_, i) => i).sort((a, b) => ((a * 7 + 3) % 11) - ((b * 7 + 3) % 11)), [list]);
	const [joined, setJoined] = useState(0);
	useEffect(() => {
		const target = list.length - 2;
		const t = setInterval(() => setJoined((n) => (n < target ? n + 1 : n)), 520);
		return () => clearInterval(t);
	}, [list.length]);
	const inRoom = new Set(order.slice(0, joined));
	const groups = new Set(list.map((s) => s.group)).size;

	return (
		<div className="fixed inset-0 z-50 overflow-y-auto bg-[radial-gradient(ellipse_at_78%_18%,#86adc6_0%,#56739c_32%,#343d61_66%,#221f30_100%)] text-[#fff6e8]">
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:28px_28px]"
				aria-hidden="true"
			/>
			<div className="relative mx-auto grid min-h-full max-w-7xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16 lg:px-12">
				<div>
					<Link href="/laboratorio" className="inline-flex items-center gap-1.5 text-sm text-[#fff1dc]/95 transition hover:text-white">
						<ArrowLeft className="size-4" aria-hidden="true" /> Torna al menu
					</Link>
					<div className="mt-10 flex items-center gap-3">
						<span className="text-xs tracking-[0.3em] text-[#fff1dc]/95 uppercase">Stanza della classe</span>
						<span className="rounded-full border border-[#fff1dc]/60 px-2 py-0.5 text-xs font-semibold tracking-[0.15em] text-[#fff1dc]/95 uppercase">Anteprima</span>
					</div>
					<div className="mt-3 font-hand text-2xl text-[#fff1dc]/95">laboratorio di {lab.toLowerCase()}</div>
					<h1 className="font-display text-5xl leading-[1.02] font-semibold tracking-tight [text-shadow:0_2px_24px_rgba(30,40,70,0.35)]">{title}</h1>

					<div className="mt-10">
						<div className="text-xs tracking-[0.25em] text-[#fff1dc]/95 uppercase">Codice della stanza</div>
						<div className="mt-3 flex items-center gap-1.5" role="img" aria-label={`Codice della stanza: ${code}`}>
							{code.split('').map((ch, i) =>
								ch === '-' ? (
									<span key={i} className="mx-1 h-0.5 w-3 rounded bg-[#fff1dc]/50" />
								) : (
									<span key={i} className="flex h-14 w-11 items-center justify-center rounded-lg bg-white/10 font-mono text-3xl font-semibold ring-1 ring-white/20 backdrop-blur-sm">
										{ch}
									</span>
								)
							)}
						</div>
						<p className="mt-3 max-w-sm text-sm leading-relaxed text-[#fff1dc]/95">
							Gli studenti aprono Laboratori, scelgono «Con la classe» e scrivono il codice. Alla LIM basta lasciare questa schermata.
						</p>
					</div>

					<dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[13.5px]">
						<dt className="text-[#fff1dc]/95">Gruppi</dt>
						<dd>
							{LABELS.groups[settings.groups]} · {groups} gruppi
						</dd>
						<dt className="text-[#fff1dc]/95">Avatar</dt>
						<dd>{LABELS.bodies[settings.bodies]}</dd>
						<dt className="text-[#fff1dc]/95">Banchi</dt>
						<dd>{LABELS.benches[settings.benches]}</dd>
						<dt className="text-[#fff1dc]/95">Messaggi</dt>
						<dd>{settings.signals ? SIGNALS.join(' · ') : 'Spenti'}</dd>
					</dl>

					<div className="mt-10 flex flex-wrap items-center gap-4">
						<button
							type="button"
							onClick={onStart}
							className="inline-flex items-center gap-2 rounded-xl bg-[#fff6e8] px-6 py-3 font-semibold text-[#2a2638] shadow-[0_8px_24px_rgba(20,16,40,0.35)] transition hover:bg-white active:translate-y-px"
						>
							<Play className="size-4 fill-current" aria-hidden="true" /> Inizia l&apos;esperimento
						</button>
						<span className="text-sm text-[#fff1dc]/95">
							<span className="font-mono text-base font-semibold text-white">{joined}</span> di {list.length} in stanza
						</span>
					</div>
					<p className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-[#fff1dc]/95">
						<Radio className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
						La stanza condivisa non è ancora attiva: gli arrivi sono simulati e in laboratorio i compagni sono controllati dal computer.
					</p>
				</div>

				<RoomPlan list={list} inRoom={inRoom} />
			</div>
		</div>
	);
}

/** The plan of the aula from above, the places filling with faces. */
function RoomPlan({ list, inRoom }: { list: Seat[]; inRoom: Set<number> }) {
	const W = 10 * S;
	const H = 10.1 * S;
	const r = list.length > 12 ? 13 : 19;
	return (
		<figure className="relative mx-auto w-full max-w-[40rem] rounded-3xl bg-[#1f1d2c]/35 p-4 ring-1 ring-white/10 backdrop-blur-sm sm:p-6">
			<svg viewBox={`-10 -30 ${W + 20} ${H + 40}`} className="w-full" role="img" aria-label="Pianta della stanza: i posti si riempiono man mano che gli studenti entrano">
				<defs>
					{list.map((_, i) => (
						<clipPath key={i} id={`seat-${i}`}>
							<circle cx={0} cy={0} r={r - 1.5} />
						</clipPath>
					))}
				</defs>
				{/* walls, the windows on the left, the doors on the right */}
				<rect x={0} y={0} width={W} height={H} rx={10} fill="rgba(255,246,232,0.06)" stroke="rgba(255,241,220,0.35)" strokeWidth={2} />
				{[-3.95, -1.75, 0.45, 2.65].map((y) => (
					<rect key={y} x={-4} y={py(y + 1.7)} width={8} height={1.7 * S} rx={2} fill="#9fd0ea" opacity={0.55} />
				))}
				{[-4.25, 2.0].map((y) => (
					<path key={y} d={`M${W} ${py(y)} A${S} ${S} 0 0 0 ${W - S} ${py(y + 1)}`} fill="none" stroke="rgba(255,241,220,0.35)" strokeWidth={1.5} />
				))}
				<text x={-20} y={H / 2} fill="rgba(255,241,220,0.85)" fontSize={12} letterSpacing={3} transform={`rotate(-90 -20 ${H / 2})`} textAnchor="middle">
					FINESTRE
				</text>
				{/* the board, the teacher's bench, the fume cupboard, the storage wall, the instruments */}
				<rect x={px(1.5)} y={-2} width={2.3 * S} height={6} rx={2} fill="#fff6e8" opacity={0.9} />
				<text x={px(2.65)} y={-12} fill="rgba(255,241,220,0.9)" fontSize={12} letterSpacing={3} textAnchor="middle">
					LIM
				</text>
				<rect x={px(1.25)} y={py(4.7)} width={2.8 * S} height={0.8 * S} rx={5} fill="rgba(255,246,232,0.18)" stroke="rgba(255,241,220,0.4)" />
				<text x={px(2.65)} y={py(4.3) + 4} fill="rgba(255,246,232,0.8)" fontSize={11} textAnchor="middle">
					docente
				</text>
				<clipPath id="seat-teacher">
					<circle cx={px(2.85)} cy={py(3.45)} r={15} />
				</clipPath>
				<circle cx={px(2.85)} cy={py(3.45)} r={16.5} fill="#fff6e8" />
				<image href="/lab/volti/10.webp" x={px(2.85) - 24} y={py(3.45) - 20} width={48} height={48} clipPath="url(#seat-teacher)" />
				<rect x={px(5.6)} y={py(5.4)} width={1.5 * S} height={0.8 * S} rx={4} fill="rgba(255,246,232,0.12)" stroke="rgba(255,241,220,0.3)" />
				<text x={px(6.35)} y={py(5.0) + 4} fill="rgba(255,241,220,0.85)" fontSize={12} textAnchor="middle">
					cappa
				</text>
				<rect x={W - 0.62 * S} y={py(1.8)} width={0.62 * S} height={4.75 * S} fill="rgba(255,246,232,0.08)" />
				<rect x={px(-1.9)} y={H - 0.65 * S} width={6 * S} height={0.65 * S} fill="rgba(255,246,232,0.08)" />
				<text x={px(1.1)} y={H - 9} fill="rgba(255,241,220,0.85)" fontSize={12} letterSpacing={2} textAnchor="middle">
					STRUMENTI
				</text>
				{/* the groups, then the desks, then the places */}
				{[...new Set(list.map((s) => s.group))].map((g) => {
					const mine = list.filter((s) => s.group === g);
					const xs = mine.map((s) => px(s.x));
					const y = py(mine[0].y);
					return (
						<rect
							key={g}
							x={Math.min(...xs) - r - 5}
							y={y - r - 5}
							width={Math.max(...xs) - Math.min(...xs) + 2 * r + 10}
							height={2 * r + 10}
							rx={r + 5}
							fill={GROUP_COLOURS[g % GROUP_COLOURS.length]}
							opacity={0.22}
						/>
					);
				})}
				{ROWS.map((y0) =>
					COLUMNS.map((x0) => (
						<g key={`${x0}${y0}`}>
							<rect x={px(x0)} y={py(y0 + DESK_D)} width={DESK_L * S} height={DESK_D * S} rx={4} fill="#2f3d46" stroke="rgba(255,241,220,0.35)" />
							<line x1={px(x0 + DESK_L / 2)} x2={px(x0 + DESK_L / 2)} y1={py(y0 + DESK_D) + 4} y2={py(y0) - 4} stroke="rgba(255,241,220,0.25)" strokeDasharray="3 3" />
							<rect x={px(x0 + DESK_L / 2) - 7} y={py(y0 + DESK_D) + 5} width={14} height={9} rx={2} fill="#b9c2c6" opacity={0.7} />
						</g>
					))
				)}
				{list.map((s, i) => {
					const on = inRoom.has(i);
					const x = px(s.x);
					const y = py(s.y);
					return (
						<g key={i} transform={`translate(${x} ${y})`}>
							<title>{`${s.label}${on ? '' : ', libero'}`}</title>
							<circle
								r={r}
								fill={on ? GROUP_COLOURS[s.group % GROUP_COLOURS.length] : 'transparent'}
								stroke={on ? 'rgba(255,246,232,0.9)' : 'rgba(255,241,220,0.35)'}
								strokeWidth={on ? 2 : 1.5}
								strokeDasharray={on ? undefined : '3 3'}
							/>
							{on && (
								<g className="lobby-pop">
									<image
										href={`/lab/volti/${String(i % 24).padStart(2, '0')}.webp`}
										x={-r * 1.6}
										y={-r * 1.35}
										width={r * 3.2}
										height={r * 3.2}
										clipPath={`url(#seat-${i})`}
										preserveAspectRatio="xMidYMid slice"
									/>
								</g>
							)}
						</g>
					);
				})}
			</svg>
			<figcaption className={cn('mt-3 flex items-center justify-between px-1 text-xs text-[#fff1dc]/95')}>
				<span>Ogni colore è un gruppo</span>
				<span className="font-hand text-base text-[#fff1dc]/95">l&apos;aula vista dall&apos;alto</span>
			</figcaption>
		</figure>
	);
}
