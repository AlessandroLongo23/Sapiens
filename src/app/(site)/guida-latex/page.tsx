import type { Metadata } from 'next';
import katex from 'katex';
import { SITE_NAME } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { renderNoteMarkdown } from '@/lib/content/note-markdown';
import { WRITING_GUIDE_PATH } from '@/lib/guide/path';
import { DELIMITERS, EXAMPLES, MARKDOWN, MISTAKES, RULES, SECTIONS, type TexExample } from '@/lib/guide/writing';
import { MarketingHeader, RelatedLinks } from '@/components/content/Prose';
import { CopyButton, Playground } from '@/components/guide/GuideTools';
import 'katex/dist/katex.min.css';

export const metadata: Metadata = pageMetadata({
	title: `Guida a LaTeX e Markdown: come scrivere formule e appunti | ${SITE_NAME}`,
	description:
		'Come si scrivono le formule in LaTeX e il testo in Markdown: frazioni, potenze, radici, lettere greche, insiemi, sistemi e gli errori più frequenti, con esempi da copiare e un riquadro per provare.',
	path: WRITING_GUIDE_PATH
});

/** A formula as the notes draw it. Every example is checked by a test, so an error here is a typo in the guide. */
const tex = (source: string, display = false) =>
	katex.renderToString(source, { displayMode: display, throwOnError: false, strict: 'ignore', output: 'htmlAndMathml' });

/** What the student types: dollars around it, as it goes into a note. */
const typed = (e: TexExample) => (e.display ? `$$${e.tex}$$` : `$${e.tex}$`);

const TOC: [string, string][] = [
	['nelle-note', 'Nelle note'],
	['prova', 'Prova'],
	['testo', 'Il testo'],
	['formule', 'Le formule'],
	...SECTIONS.map((s): [string, string] => [s.id, s.title]),
	['errori', 'Errori frequenti'],
	['esempi', 'Esempi completi']
];

function Code({ children }: { children: string }) {
	return <code className="rounded bg-surface-3 px-1.5 py-0.5 font-mono text-[0.9em] text-fg">{children}</code>;
}

function SectionTitle({ id, children }: { id: string; children: string }) {
	return (
		<h2 id={id} className="mb-4 mt-14 scroll-mt-24 font-display text-2xl font-semibold text-fg-strong sm:text-3xl">
			{children}
		</h2>
	);
}

/** One formula: as typed, with a button to copy it, and as it comes out. */
function TexRow({ example }: { example: TexExample }) {
	return (
		<li className="grid gap-x-6 gap-y-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
			<div className="flex min-w-0 items-start gap-1">
				<code className="min-w-0 flex-1 whitespace-pre-wrap break-words rounded-lg bg-surface-2 px-3 py-2 font-mono text-sm text-fg">{example.tex}</code>
				<CopyButton text={typed(example)} />
			</div>
			<div className="min-w-0">
				<div className="overflow-x-auto py-1 text-xl text-fg [&_.katex-display]:my-1" dangerouslySetInnerHTML={{ __html: tex(example.tex, example.display) }} />
				{example.note && <p className="mt-1 text-sm leading-relaxed text-fg-muted">{example.note}</p>}
			</div>
		</li>
	);
}

export default function WritingGuidePage() {
	return (
		<div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
			<MarketingHeader title="Come si scrivono formule e appunti">
				Nelle note di Sapiens il testo si scrive in <strong className="font-semibold text-fg">Markdown</strong> e le formule in{' '}
				<strong className="font-semibold text-fg">LaTeX</strong>, come fanno i matematici. Sembra difficile, ma bastano poche regole: questa pagina le mette in fila,
				con esempi da copiare e un riquadro per provare.
			</MarketingHeader>

			<nav aria-label="In questa pagina" className="mb-4 flex flex-wrap gap-2">
				{TOC.map(([id, label]) => (
					<a key={id} href={`#${id}`} className="rounded-full border border-edge px-3 py-1 text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent-fg focus-ring">
						{label}
					</a>
				))}
			</nav>

			<SectionTitle id="nelle-note">Nelle note</SectionTitle>
			<div className="space-y-3 leading-relaxed text-fg-muted">
				<p>
					Nella modalità Semplice non serve scrivere il Markdown: titoli ed elenchi si mettono dalla barra degli
					strumenti, oppure scrivendo <Code>/</Code> all’inizio della riga e scegliendo dal menu. Il pulsante Σ apre il riquadro della formula, con l’anteprima
					mentre scrivi. Anche lì la formula si scrive in LaTeX, ed è quello che spiega questa pagina.
				</p>
				<p>
					Nella modalità Avanzata si scrive tutto a mano, testo e formule, e a fianco si vede il risultato.
				</p>
			</div>

			<SectionTitle id="prova">Prova</SectionTitle>
			<Playground />

			<SectionTitle id="testo">Il testo: Markdown</SectionTitle>
			<p className="leading-relaxed text-fg-muted">Il Markdown è testo normale con qualche segno che dice come mostrarlo. I segni vanno scritti così come sono.</p>
			<ul className="mt-2 divide-y divide-edge-soft border-y border-edge-soft">
				{MARKDOWN.map((e) => (
					<li key={e.md} className="grid gap-x-6 gap-y-2 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
						<div className="flex min-w-0 items-start gap-1">
							<pre className="min-w-0 flex-1 whitespace-pre-wrap break-words rounded-lg bg-surface-2 px-3 py-2 font-mono text-sm text-fg">{e.md}</pre>
							<CopyButton text={e.md} />
						</div>
						<div className="min-w-0">
							{e.md === '<!-- pagina -->' ? (
								<div className="flex items-center gap-3 py-2" aria-hidden="true">
									<span className="h-px flex-1 border-t border-dashed border-edge-strong" />
									<span className="label-mono text-[11px] text-fg-subtle">Pagina 2</span>
									<span className="h-px flex-1 border-t border-dashed border-edge-strong" />
								</div>
							) : (
								<div className="markdown-content text-fg [&>*]:my-0" dangerouslySetInnerHTML={{ __html: renderNoteMarkdown(e.md, katex) }} />
							)}
							<p className="mt-1 text-sm leading-relaxed text-fg-muted">{e.note}</p>
						</div>
					</li>
				))}
			</ul>

			<SectionTitle id="formule">Le formule: LaTeX</SectionTitle>
			<p className="leading-relaxed text-fg-muted">
				Una formula sta tra due segni di dollaro. Con un dollaro solo per parte resta dentro la frase; con due va su una riga tutta sua, centrata e più grande.
			</p>
			<ul className="mt-2 divide-y divide-edge-soft border-y border-edge-soft">
				{DELIMITERS.map((e) => (
					<TexRow key={e.tex} example={e} />
				))}
			</ul>

			<h3 className="mb-3 mt-10 text-lg font-semibold text-fg-strong">Tre regole bastano per cominciare</h3>
			<ol className="grid gap-4 sm:grid-cols-3">
				{RULES.map((r, i) => (
					<li key={r.title} className="rounded-2xl border border-edge bg-surface p-4">
						<p className="label-mono mb-1 text-[11px] text-fg-subtle">Regola {i + 1}</p>
						<p className="mb-2 font-semibold text-fg">{r.title}</p>
						<p className="mb-3 text-sm leading-relaxed text-fg-muted">{r.text}</p>
						<code className="block whitespace-pre-wrap break-words rounded-lg bg-surface-2 px-3 py-2 font-mono text-xs text-fg">{r.tex}</code>
						<div className="mt-2 overflow-x-auto text-fg" dangerouslySetInnerHTML={{ __html: tex(r.tex) }} />
					</li>
				))}
			</ol>

			{SECTIONS.map((section) => (
				<section key={section.id} aria-labelledby={section.id}>
					<SectionTitle id={section.id}>{section.title}</SectionTitle>
					{section.intro && <p className="leading-relaxed text-fg-muted">{section.intro}</p>}
					<ul className="mt-2 divide-y divide-edge-soft border-y border-edge-soft">
						{section.examples.map((e) => (
							<TexRow key={e.tex} example={e} />
						))}
					</ul>
				</section>
			))}

			<SectionTitle id="errori">Errori frequenti</SectionTitle>
			<ul className="divide-y divide-edge-soft border-y border-edge-soft">
				{MISTAKES.map((m) => (
					<li key={m.wrong} className="grid gap-x-6 gap-y-2 py-4 sm:grid-cols-2">
						<div className="min-w-0">
							<p className="label-mono mb-1 text-[11px] text-danger-fg">Così no</p>
							<code className="block rounded-lg bg-surface-2 px-3 py-2 font-mono text-sm text-fg">{m.wrong}</code>
							<div className="mt-2 overflow-x-auto text-lg text-fg" dangerouslySetInnerHTML={{ __html: tex(m.wrong) }} />
						</div>
						<div className="min-w-0">
							<p className="label-mono mb-1 text-[11px] text-ok-fg">Così sì</p>
							<div className="flex items-start gap-1">
								<code className="block min-w-0 flex-1 rounded-lg bg-surface-2 px-3 py-2 font-mono text-sm text-fg">{m.right}</code>
								<CopyButton text={`$${m.right}$`} />
							</div>
							<div className="mt-2 overflow-x-auto text-lg text-fg" dangerouslySetInnerHTML={{ __html: tex(m.right) }} />
							<p className="mt-1 text-sm leading-relaxed text-fg-muted">{m.why}</p>
						</div>
					</li>
				))}
			</ul>

			<SectionTitle id="esempi">Esempi completi</SectionTitle>
			<ul className="divide-y divide-edge-soft border-y border-edge-soft">
				{EXAMPLES.map((e) => (
					<TexRow key={e.tex} example={e} />
				))}
			</ul>

			<p className="mt-12 text-sm leading-relaxed text-fg-muted">
				Le formule delle note sono disegnate da KaTeX: l’elenco completo dei comandi che capisce è nella sua{' '}
				<a href="https://katex.org/docs/supported.html" target="_blank" rel="noopener noreferrer" className="text-accent-fg underline underline-offset-2">
					documentazione
				</a>
				, in inglese.
			</p>

			<RelatedLinks links={[['/zaino', 'Apri lo Zaino'], ['/materiale', 'Esplora il materiale didattico'], ['/faq', 'Domande frequenti']]} />
		</div>
	);
}

