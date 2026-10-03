'use client';

import { absoluteUrl } from '@/lib/config/site';
import { COMMANDS } from '@/lib/grafico/comandi';
import { JsonLd } from '@/components/seo/JsonLd';
import { VideoClip } from '@/components/ui/VideoClip';
import { ArrowUp } from 'lucide-react';
import { CLIPS, GROUPS, toolOf, tryTool, type ToolId } from './geometry';

/** The day the films were recorded (scripts/grafico/record-tools.mjs): a search engine asks for it. */
const RECORDED = '2026-10-02';

/** How each tool is written as a command, where it can be: "retta(A; B)". */
const written = (id: ToolId) => COMMANDS.filter((c) => c.tool === id).flatMap((c) => c.uses);

/**
 * The tools of geometry in the article, group by group as the bar has them: what each does, how it is written as a
 * command, and its film. The films of the bar's tooltips are the same files; here a search engine can read them, each
 * with its structured data.
 */
/** The groups of the bar, with the two that hold one tool joined to a neighbour: a film alone in its row leaves the row empty. */
const SECTIONS = GROUPS.reduce<{ name: string; tools: ToolId[] }[]>((out, group) => {
	if (group.name === 'Muovi') return out;
	if (group.name === 'Punti') return [...out, { name: 'Punti', tools: ['move', ...group.tools] }];
	if (group.name === 'Poligoni') return [...out, { name: 'Poligoni e misure', tools: group.tools }];
	if (group.name === 'Misure') return [...out.slice(0, -1), { name: 'Poligoni e misure', tools: [...out[out.length - 1].tools, ...group.tools] }];
	return [...out, group];
}, []);

export function ToolGuide() {
	return (
		<div className="mt-8 flex flex-col gap-10">
			{SECTIONS.map((group) => (
				<section key={group.name} aria-label={group.name}>
					<h3 className="mt-0 mb-4 text-lg font-semibold text-fg-strong">{group.name}</h3>
					<ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
						{group.tools.map(toolOf).map((tool) => {
							const base = `${CLIPS.path}/${tool.clip}`;
							const uses = written(tool.id);
							return (
								<li key={tool.id} className="overflow-hidden rounded-xl border border-edge bg-surface">
									{/* the film is the plane itself, so in the dark theme it is turned like the plane; a tool not yet filmed has its text alone */}
									{tool.clip && (
										<>
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
											<VideoClip
												sources={[
													{ src: `${base}.webm`, type: 'video/webm' },
													{ src: `${base}.mp4`, type: 'video/mp4' }
												]}
												poster={`${base}.jpg`}
												label={`Filmato: ${tool.name}`}
												width={CLIPS.width}
												height={CLIPS.height}
												videoClassName="plot-clip aspect-[8/5] bg-white"
											/>
										</>
									)}
									<div className={tool.clip ? 'border-t border-edge px-4 py-3' : 'px-4 py-3'}>
										<div className="flex items-start justify-between gap-3">
											<h4 className="m-0 text-base font-semibold text-fg-strong">{tool.name}</h4>
											<button
												type="button"
												onClick={() => tryTool(tool.id)}
												aria-label={`Prova lo strumento ${tool.name} sul piano`}
												className="-mt-0.5 -mr-1.5 flex h-8 shrink-0 items-center gap-1 rounded-lg border border-edge-strong bg-surface px-2.5 text-sm font-medium text-fg-strong shadow-paper transition-colors hover:bg-surface-3 focus-ring"
											>
												Prova
												<ArrowUp className="size-3.5" aria-hidden="true" />
											</button>
										</div>
										<p className="mt-1 mb-0 text-sm text-fg-muted">{tool.about}</p>
										{uses.length > 0 && <p className="mt-2 mb-0 font-mono text-xs text-fg-muted">{uses.join(' · ')}</p>}
									</div>
								</li>
							);
						})}
					</ul>
				</section>
			))}
		</div>
	);
}
