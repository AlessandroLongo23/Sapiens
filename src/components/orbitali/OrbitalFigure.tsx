'use client';

import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { nodeSurfaces, orbitalName, type Orbital, type SectionPlane } from '@/lib/orbitali/idrogeno';
import { ToggleGroup } from '@/components/ui/ToggleGroup';
import { Caption, Controls, Figure } from '@/components/content/interactive/kit';
import { OrbitalCloud } from './OrbitalCloud';
import { OrbitalSection } from './OrbitalSection';

/**
 * An orbital figure with its parameters fixed, for a paragraph of a lesson: the cloud or a section of it, one
 * orbital or a few to switch between, the nodes and the cut on or off as the paragraph needs. The whole viewer, with
 * every choice open, is OrbitalViewer.
 */

export interface OrbitalPreset {
	/** On the switch, when there is more than one. */
	label: string;
	orbital: Orbital;
	/** What to notice, under the figure. */
	note: string;
}

export interface OrbitalFigureProps {
	presets: OrbitalPreset[];
	view: '3d' | 'sezione';
	/** The plane of a section. */
	plane?: SectionPlane;
	/** Draws the nodes; with 'scelta' the student turns them on and off, starting from off. */
	nodes?: boolean | 'scelta';
	/** Opens the cloud; with 'scelta' the student does. */
	cut?: boolean | 'scelta';
	/** One frame for all the presets: that of the highest level among them. */
	sameScale?: boolean;
	alt?: string;
}

const BOHR_PM = 52.918;
const BAR_LENGTHS = [20, 50, 100, 200, 500, 1000, 2000, 5000];

export function OrbitalFigure({ presets, view, plane = 'xz', nodes = false, cut = false, sameScale = false, alt }: OrbitalFigureProps) {
	const [index, setIndex] = useState(0);
	const [nodesOn, setNodesOn] = useState(nodes === true);
	const [cutOn, setCutOn] = useState(cut === true);
	const [playing, setPlaying] = useState(true);
	const [pixelsPerBohr, setPixelsPerBohr] = useState(0);
	const preset = presets[Math.min(index, presets.length - 1)];
	const { orbital } = preset;
	const name = orbitalName(orbital);
	const flows = orbital.kind === 'complesso' && orbital.m !== 0 && (view === '3d' || plane === 'xy');

	// Who asks for less motion starts with the points still.
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect -- one read of the system setting after the first render
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
	}, []);

	const label = alt ?? `Orbitale ${name.level}${name.direction ? ` ${name.direction}` : ''} dell’atomo di idrogeno.`;
	const referenceLevel = Math.max(...presets.map((p) => p.orbital.n));
	const props = { orbital, nodes: nodesOn, sameScale, referenceLevel, playing, onScale: setPixelsPerBohr, label };
	const bar = BAR_LENGTHS.filter((pm) => (pm / BOHR_PM) * pixelsPerBohr <= 120).pop() ?? BAR_LENGTHS[0];
	const barWidth = (bar / BOHR_PM) * pixelsPerBohr;
	const hasNodes = orbital.n > 1 || nodeSurfaces(orbital).cones.length > 0;

	return (
		<Figure>
			<div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper">
				<div className="grid-paper pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
				{view === '3d' ? <OrbitalCloud {...props} cut={cutOn} /> : <OrbitalSection {...props} plane={plane} />}
				<p className="pointer-events-none absolute top-2.5 left-3.5 m-0 font-display text-xl font-semibold text-fg-strong">
					{name.level}
					{name.direction && <sub className="ml-0.5 text-sm">{name.direction}</sub>}
				</p>
				{pixelsPerBohr > 0 && barWidth >= 12 && (
					<p className="pointer-events-none absolute right-3.5 bottom-2.5 m-0 flex flex-col items-end gap-1 font-mono text-xs text-fg-muted">
						{bar >= 1000 ? `${bar / 1000} nm` : `${bar} pm`}
						<span className="block h-1.5 border-x border-b border-fg-muted" style={{ width: barWidth }} aria-hidden="true" />
					</p>
				)}
				{flows && (
					<button
						type="button"
						onClick={() => setPlaying(!playing)}
						aria-label={playing ? 'Ferma il moto' : 'Avvia il moto'}
						className="absolute bottom-2.5 left-2.5 flex size-9 items-center justify-center rounded-xl border border-edge-strong bg-surface text-fg shadow-paper hover:bg-surface-2 focus-ring"
					>
						{playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
					</button>
				)}
			</div>
			{(presets.length > 1 || nodes === 'scelta' || cut === 'scelta') && (
				<Controls>
					{presets.length > 1 && (
						<div className="max-w-full overflow-x-auto">
							<ToggleGroup options={presets.map((p, i) => ({ value: String(i), label: p.label }))} value={String(index)} onChange={(i) => setIndex(Number(i))} label="Orbitale" compact />
						</div>
					)}
					{(nodes === 'scelta' || cut === 'scelta') && (
						<div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
							{nodes === 'scelta' && hasNodes && (
								<label className="flex items-center gap-2 text-sm text-fg">
									<input type="checkbox" checked={nodesOn} onChange={(e) => setNodesOn(e.target.checked)} className="size-4 accent-[var(--accent)]" />
									Mostra i nodi
								</label>
							)}
							{cut === 'scelta' && (
								<label className="flex items-center gap-2 text-sm text-fg">
									<input type="checkbox" checked={cutOn} onChange={(e) => setCutOn(e.target.checked)} className="size-4 accent-[var(--accent)]" />
									Seziona la nuvola per vedere dentro
								</label>
							)}
						</div>
					)}
				</Controls>
			)}
			<Caption>{preset.note}</Caption>
		</Figure>
	);
}
