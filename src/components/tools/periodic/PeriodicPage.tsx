import 'katex/dist/katex.min.css';
import Link from 'next/link';
import { BookOpen, Download, NotebookPen } from 'lucide-react';
import { CATEGORY_NAMES, type ToolMeta } from '@/lib/tools/types';
import { TOOLS_ROOT, toolBySlug } from '@/lib/tools/registry';
import { ELEMENTI, TRENDS, familyName, trendText } from '@/lib/tools/tavola-periodica';
import { Breadcrumb, HOME_CRUMB } from '@/components/content/Breadcrumb';
import { Page, PenStroke } from '@/components/content/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { Html } from '@/components/ui/Html';
import { buttonClass } from '@/components/ui/Button';
import { LearnLink, TOOLS_CRUMB, toolJsonLd, type ToolLesson } from '@/components/tools/ToolPage';
import { Config } from './ElementPanel';
import { OpenElementButton } from './OpenElementButton';
import { PeriodicTable } from './PeriodicTable';

export const PERIODIC_SLUG = 'tavola-periodica';
export const PERIODIC_PATH = `${TOOLS_ROOT}/${PERIODIC_SLUG}`;

/** The sheets to print, made by scripts/tavola-periodica/pdf.mjs from the print pages. */
export const PERIODIC_PDF = [
	{ variant: 'colori', href: '/tavola-periodica/tavola-periodica-degli-elementi.pdf', label: 'PDF a colori' },
	{ variant: 'bianco-nero', href: '/tavola-periodica/tavola-periodica-bianco-e-nero.pdf', label: 'PDF in bianco e nero' }
] as const;

const electronegativity = TRENDS.find((t) => t.id === 'elettronegativita')!;

/**
 * The page of the periodic table: the table across the whole width, the sheets to print, the way to the lessons, the
 * article, and every element in a plain table, for a reader that wants a list and for search engines.
 */
export function PeriodicPage({ tool, lessons, articleHtml }: { tool: ToolMeta; lessons: ToolLesson[]; articleHtml: string | null }) {
	const related = (tool.related ?? []).map(toolBySlug).filter((t): t is ToolMeta => !!t);
	return (
		<Page width="full">
			<JsonLd data={toolJsonLd(tool)} />
			{/* A lower header than the other pages': the table has to start, and nearly end, above the fold. */}
			<header className="mb-4 animate-fade-in">
				<Breadcrumb items={[HOME_CRUMB, TOOLS_CRUMB, { label: tool.title }]} tail={CATEGORY_NAMES[tool.category]} hideCurrent />
				<div className="flex flex-wrap items-end gap-x-8 gap-y-2">
					<h1 className="w-fit text-4xl font-semibold leading-[1.05] text-fg-strong sm:text-5xl">
						{tool.title}
						<PenStroke className="mt-1" />
					</h1>
					<p className="max-w-2xl flex-1 basis-80 pb-1 text-base leading-snug text-fg-muted">{tool.lead}</p>
				</div>
			</header>

			<PeriodicTable />

			<section aria-labelledby="da-stampare" className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-edge bg-surface p-4 shadow-paper">
				<div className="min-w-0 flex-1 basis-64">
					<h2 id="da-stampare" className="font-display text-xl font-semibold text-fg-strong">
						Tavola periodica da stampare
					</h2>
					<p className="text-sm text-fg-muted">Un foglio A4 orizzontale con numero atomico, massa atomica, elettronegatività e numeri di ossidazione di ogni elemento.</p>
				</div>
				{PERIODIC_PDF.map((pdf, i) => (
					<a key={pdf.href} href={pdf.href} download className={buttonClass(i === 0 ? 'primary' : 'secondary', 'md')}>
						<Download className="size-4" aria-hidden="true" />
						{pdf.label}
					</a>
				))}
			</section>

			{lessons.length > 0 && (
				<nav aria-label="Studia l'argomento" className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-2">
					{lessons.map((l) => (
						<LearnLink key={l.theory} href={l.theory} icon={<BookOpen className="size-5" aria-hidden="true" />} label="Impara" title={l.title} />
					))}
					{lessons
						.filter((l) => l.exercises)
						.map((l) => (
							<LearnLink key={l.exercises} href={l.exercises!} icon={<NotebookPen className="size-5" aria-hidden="true" />} label="Esercitati" title={`Esercizi: ${l.title}`} />
						))}
				</nav>
			)}

			{articleHtml && <Html html={articleHtml} className="markdown-content mx-auto mt-14 max-w-[70ch]" />}

			<section aria-labelledby="elenco-elementi" className="mx-auto mt-14 max-w-5xl">
				<h2 id="elenco-elementi" className="mb-4 font-display text-3xl font-semibold text-fg-strong">
					Elenco degli elementi
				</h2>
				<div className="overflow-x-auto rounded-2xl border border-edge bg-surface shadow-paper">
					<table className="w-full min-w-[46rem] text-left text-sm">
						<thead className="label-mono border-b border-edge-strong text-fg-subtle">
							<tr>
								<th scope="col" className="px-3 py-2">Z</th>
								<th scope="col" className="px-3 py-2">Simbolo</th>
								<th scope="col" className="px-3 py-2">Nome</th>
								<th scope="col" className="px-3 py-2">Massa atomica</th>
								<th scope="col" className="px-3 py-2">Famiglia</th>
								<th scope="col" className="px-3 py-2">Configurazione elettronica</th>
								<th scope="col" className="px-3 py-2">Elettronegatività</th>
								<th scope="col" className="px-3 py-2">Numeri di ossidazione</th>
							</tr>
						</thead>
						<tbody>
							{ELEMENTI.map((el) => {
								const en = electronegativity.value(el);
								return (
									<tr key={el.z} className="border-b border-edge-soft last:border-b-0">
										<td className="px-3 py-1.5 font-mono text-fg-muted">{el.z}</td>
										<td className="px-3 py-1.5 font-display text-base font-semibold text-fg-strong">{el.symbol}</td>
										<th scope="row" className="px-3 py-1.5">
											<OpenElementButton symbol={el.symbol}>{el.name}</OpenElementButton>
										</th>
										<td className="px-3 py-1.5 font-mono">{el.mass}</td>
										<td className="px-3 py-1.5 text-fg-muted">{familyName(el.family)}</td>
										<td className="px-3 py-1.5">
											<Config el={el} />
										</td>
										<td className="px-3 py-1.5 font-mono">{en === null ? '' : trendText(electronegativity, en)}</td>
										<td className="px-3 py-1.5 font-mono">{el.oxidation.join(', ')}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</section>

			{related.length > 0 && (
				<section aria-labelledby="related-tools" className="mx-auto mt-14 max-w-[70ch] border-t border-edge pt-6">
					<h2 id="related-tools" className="label-mono mb-3 text-fg-subtle">
						Altri strumenti
					</h2>
					<ul className="flex flex-wrap gap-x-6 gap-y-2">
						{related.map((t) => (
							<li key={t.slug}>
								<Link href={`${TOOLS_ROOT}/${t.slug}`} className="font-medium text-fg underline decoration-edge-strong underline-offset-4 hover:text-accent-fg hover:decoration-current">
									{t.title}
								</Link>
							</li>
						))}
					</ul>
				</section>
			)}
		</Page>
	);
}
