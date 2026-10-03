'use client';

import { absoluteUrl } from '@/lib/config/site';
import { COMMANDS } from '@/lib/grafico/comandi';
import { JsonLd } from '@/components/seo/JsonLd';
import { CLIPS, TOOLS, type ToolId } from './geometry';

/** The day the films were recorded (scripts/grafico/record-tools.mjs): a search engine asks for it. */
const RECORDED = '2026-10-02';

/** How each tool is written as a command, where it can be: "retta(A; B)". */
const written = (id: ToolId) => COMMANDS.filter((c) => c.tool === id).flatMap((c) => c.uses);

/**
 * The tools of geometry one by one, in the page: what each does, how it is written as a command, and its film. The
 * films of the bar's tooltips are the same files; here a search engine can read them, each with its structured data.
 */
export function ToolGuide() {
	return (
		<section aria-labelledby="tool-guide" className="mx-auto mt-14 max-w-5xl">
			<h2 id="tool-guide" className="mb-2 text-2xl font-semibold text-fg-strong">
				Gli strumenti di geometria analitica
			</h2>
			<p className="mt-0 mb-6 max-w-[70ch] text-fg-muted">Ogni strumento si usa con i clic sul piano, dalla barra in alto a sinistra. Quasi tutti si possono anche scrivere in una riga, con il punto e virgola tra gli oggetti.</p>
			<ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
				{TOOLS.map((tool) => {
					const base = `${CLIPS.path}/${tool.clip}`;
					const uses = written(tool.id);
					return (
						<li key={tool.id} className="overflow-hidden rounded-xl border border-edge bg-surface">
							<JsonLd
								data={{
									'@context': 'https://schema.org',
									'@type': 'VideoObject',
									name: `${tool.name}: come si usa nel grafico di funzione`,
									description: tool.about,
									thumbnailUrl: absoluteUrl(`${base}.jpg`),
									contentUrl: absoluteUrl(`${base}.mp4`),
									uploadDate: RECORDED,
									inLanguage: 'it'
								}}
							/>
							{/* the film is the plane itself, so in the dark theme it is turned like the plane */}
							<video className="plot-clip block aspect-[8/5] w-full bg-white" width={CLIPS.width} height={CLIPS.height} poster={`${base}.jpg`} controls loop muted playsInline preload="none" aria-label={`Filmato: ${tool.name}`}>
								<source src={`${base}.webm`} type="video/webm" />
								<source src={`${base}.mp4`} type="video/mp4" />
							</video>
							<div className="border-t border-edge px-4 py-3">
								<h3 className="m-0 text-base font-semibold text-fg-strong">{tool.name}</h3>
								<p className="mt-1 mb-0 text-sm text-fg-muted">{tool.about}</p>
								{uses.length > 0 && <p className="mt-2 mb-0 font-mono text-xs text-fg-muted">{uses.join(' · ')}</p>}
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
