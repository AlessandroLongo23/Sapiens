'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, Lightbulb, ListChecks, Play, RotateCcw, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import type { Check as PageCheck } from '@/lib/codice/blocco';
import { kindOf, type ProjectFiles } from '@/lib/codice/progetto';
import { guardInline, guardLoops } from './loop-guard';
import type { FromPage, ToPage } from './pagina';
import { SettingsPanel } from './SettingsPanel';
import type { ProjectSlots } from './ProjectBench';
import { hasScript } from './web-assemble';
import { Layout } from './Workbench';
import type { CheckVerdict } from './web-checks';

/** How a Markdown file looks as a page: readable, and nothing more. */
const MARKDOWN_PAGE = '<!doctype html><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;max-width:44rem;margin:1.5rem auto;padding:0 1rem;line-height:1.6;color:#222}img{max-width:100%}pre,code{background:#f3f3f3;border-radius:4px}pre{padding:.75rem;overflow:auto}code{padding:.1em .3em}table{border-collapse:collapse}td,th{border:1px solid #ccc;padding:.3rem .6rem}</style>';

/** The page of the iframe the preview is shown in (src/app/codice-sandbox/pagina/route.ts). */
const PAGE_PATH = '/codice-sandbox/pagina';
/** How long after the last key the preview follows a page without scripts. */
const PAUSE = 500;
/** How long the preview has to say the page has loaded, before a check gives up. */
const LOADING = 8000;

interface Line {
	kind: 'out' | 'err' | 'note';
	text: string;
}

const LINE: Record<Line['kind'], string> = {
	out: '',
	err: 'text-danger-fg',
	note: 'block font-sans text-fg-subtle italic'
};

/**
 * The pages of a project and what they look like: the preview of the page "Esegui" shows, with a console for what
 * its scripts print. The files and their editor are the project's (ProjectBench.tsx). With `checks` it is an
 * exercise: "Verifica" loads the page and looks in it for what each check asks.
 *
 * The page is shown in an iframe that is not the site's (pagina.ts is its script): the student's JavaScript runs
 * there and can reach nothing of the site. A project without scripts is shown again a moment after every key; one
 * with scripts waits for "Esegui", so an alert() does not open at every pause. A link to another page of the
 * project opens that page, in the preview and in the editor.
 */
export function WebBench({ project, checks, toolbar, compact = false }: { project: ProjectSlots; checks?: PageCheck[]; /** At the left of the bar, before the buttons. */ toolbar?: ReactNode; /** For a page inside a lesson: the preview under the editor. */ compact?: boolean }) {
	const [lines, setLines] = useState<Line[]>([]);
	const [verdicts, setVerdicts] = useState<CheckVerdict[] | null>(null);
	const [checking, setChecking] = useState(false);
	/** The files have changed and the preview still shows the page of before. */
	const [stale, setStale] = useState(false);
	/** The editor's settings are shown in the place of the page. */
	const [settings, setSettings] = useState(false);

	const holder = useRef<HTMLDivElement>(null);
	const frame = useRef<HTMLIFrameElement | null>(null);
	const pause = useRef(0);
	/** Who waits for the page to load, and for the answer to the checks sent with a number. */
	const onLoaded = useRef<((ok: boolean) => void) | null>(null);
	const onVerdicts = useRef<{ id: number; done: (verdicts: CheckVerdict[]) => void } | null>(null);
	const ids = useRef(0);
	const latest = useRef(project);
	useEffect(() => {
		latest.current = project;
	});

	/** A new iframe for the page as the files are now: whatever the old page was doing ends with it. */
	const mount = useCallback(() => {
		window.clearTimeout(pause.current);
		onLoaded.current?.(false);
		frame.current?.remove();
		const element = document.createElement('iframe');
		element.setAttribute('sandbox', 'allow-scripts allow-modals');
		element.src = PAGE_PATH;
		element.title = 'Anteprima della pagina';
		element.className = 'block size-full border-0 bg-white';
		frame.current = element;
		holder.current?.append(element);
		return new Promise<boolean>((resolve) => {
			const timer = window.setTimeout(() => done(false), LOADING);
			const done = (ok: boolean) => {
				window.clearTimeout(timer);
				if (onLoaded.current === done) onLoaded.current = null;
				resolve(ok);
			};
			onLoaded.current = done;
		});
	}, []);

	/** Shows the page again, with an empty console. */
	const show = useCallback(() => {
		setStale(false);
		setLines([]);
		setVerdicts(null);
		return mount();
	}, [mount]);

	useEffect(() => {
		/** The page for the preview: every loop of its scripts guarded, a Markdown file turned into a page. */
		const send = async (target: Window) => {
			const page = latest.current.page();
			if (!page) return;
			const files: ProjectFiles = {};
			for (const [path, text] of Object.entries(page.files)) files[path] = kindOf(path) === 'javascript' ? guardLoops(text) : kindOf(path) === 'html' ? guardInline(text) : text;
			let html: string | undefined;
			if (kindOf(page.path) === 'markdown') {
				const { default: MarkdownIt } = await import('markdown-it');
				html = `${MARKDOWN_PAGE}${new MarkdownIt({ html: true, linkify: true }).render(page.files[page.path] ?? '')}`;
			}
			// the iframe's origin has no name to address it by; the window is the one this page made
			target.postMessage({ type: 'page', files, path: page.path, html } satisfies ToPage, '*');
		};
		const receive = (event: MessageEvent<FromPage>) => {
			const target = frame.current?.contentWindow;
			if (!target || event.source !== target) return;
			const message = event.data;
			if (message.type === 'ready') void send(target);
			else if (message.type === 'loaded') onLoaded.current?.(true);
			else if (message.type === 'navigate') latest.current.navigate(message.path);
			else if (message.type === 'chunk') {
				setLines((shown) => {
					const last = shown[shown.length - 1];
					return last && last.kind === message.kind && message.kind !== 'note' ? [...shown.slice(0, -1), { kind: last.kind, text: last.text + message.text }] : [...shown, { kind: message.kind, text: message.text }];
				});
			} else if (message.type === 'verdicts' && onVerdicts.current?.id === message.id) onVerdicts.current.done(message.verdicts);
		};
		window.addEventListener('message', receive);
		void mount();
		return () => {
			window.removeEventListener('message', receive);
			window.clearTimeout(pause.current);
			frame.current?.remove();
			frame.current = null;
		};
	}, [mount]);

	// a file changed: a project without scripts is shown again after a pause, one with scripts waits for Esegui
	useEffect(
		() =>
			project.listen(() => {
				setVerdicts(null);
				window.clearTimeout(pause.current);
				const page = latest.current.page();
				if (page && hasScript(page.files)) setStale(true);
				else pause.current = window.setTimeout(() => void show(), PAUSE);
			}),
		// the project's `listen` is the same function for the life of the bench
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[show]
	);

	// Ctrl+Enter in the project's editor, and the opening of another page, show the page
	useEffect(() => {
		project.register(() => void show());
	});

	/** Loads the page again and asks it about each check. */
	const check = async () => {
		if (!checks) return;
		setChecking(true);
		const ok = await show();
		const id = ++ids.current;
		const answers = ok
			? await new Promise<CheckVerdict[] | null>((resolve) => {
					const timer = window.setTimeout(() => resolve(null), LOADING);
					onVerdicts.current = {
						id,
						done: (given) => {
							window.clearTimeout(timer);
							resolve(given);
						}
					};
					frame.current?.contentWindow?.postMessage({ type: 'checks', id, checks } satisfies ToPage, '*');
				})
			: null;
		onVerdicts.current = null;
		setVerdicts(answers ?? checks.map(() => ({ passed: false, why: 'La pagina non si è caricata.' })));
		setChecking(false);
	};

	const fill = project.layout === 'explorer';
	const passed = verdicts?.filter((v) => v.passed).length ?? 0;

	return (
		<section className="not-prose overflow-hidden rounded-2xl border border-edge bg-surface shadow-paper" aria-label="Editor di una pagina web">
			<div className="relative flex flex-wrap items-center gap-2 border-b border-edge px-3 py-2">
				{toolbar ?? <span className="label-mono px-1 text-fg-subtle">Pagina web</span>}
				<p className="ml-auto text-sm text-fg-subtle" role="status">
					{checking ? 'Verifico…' : stale ? 'Esegui per aggiornare la pagina' : ''}
				</p>
				{project.edited && (
					<Button variant="ghost" size="sm" onClick={project.reset} title="Rimetti i file di partenza">
						<RotateCcw className="size-3.5" aria-hidden="true" />
						<span className="max-sm:sr-only">Ripristina</span>
					</Button>
				)}
				{project.solve && (
					<Button variant="ghost" size="sm" onClick={project.solve} title="Metti la soluzione nell’editor">
						<Lightbulb className="size-3.5" aria-hidden="true" />
						<span className="max-sm:sr-only">Soluzione</span>
					</Button>
				)}
				{(!compact || fill) && (
					<Button variant="ghost" size="sm" onClick={() => setSettings((now) => !now)} aria-pressed={settings} title={settings ? 'Torna alla pagina' : 'Impostazioni dell’editor'} className={cn(settings && 'bg-surface-3 text-fg-strong')}>
						<Settings className="size-3.5" aria-hidden="true" />
						<span className="sr-only">Impostazioni dell’editor</span>
					</Button>
				)}
				<Button variant={checks ? 'secondary' : 'primary'} size="sm" onClick={() => void show()} disabled={checking} title="Ctrl+Invio, o ⌘+Invio sul Mac">
					<Play className="size-3.5" aria-hidden="true" />
					Esegui
				</Button>
				{checks && (
					<Button size="sm" onClick={() => void check()} disabled={checking}>
						<ListChecks className="size-3.5" aria-hidden="true" />
						Verifica
					</Button>
				)}
			</div>
			<Layout
				project={project}
				compact={compact}
				code={null}
				output={
					<>
						{settings && <SettingsPanel className={fill ? 'h-full' : 'lg:h-[32rem]'} />}
						{/* the page stays under the settings: it is not loaded again when they close */}
						<div className={cn('flex min-w-0 flex-col', fill ? 'h-full' : !compact && 'lg:h-[32rem]', settings && 'hidden')}>
							<div ref={holder} className={cn('min-h-0 bg-white', fill ? 'flex-1' : compact ? 'h-72' : 'h-[18rem] lg:h-auto lg:flex-1')} />
							{(lines.length > 0 || verdicts) && (
								<div role="log" aria-label="Console" className={cn(fill ? 'max-h-[45%]' : !compact && 'max-h-56', 'shrink-0 overflow-auto border-t border-edge bg-surface-2 px-4 py-3 font-mono text-[0.9375rem] leading-[1.65] break-words whitespace-pre-wrap text-fg')}>
									{lines.map((line, i) => (
										<span key={i} className={LINE[line.kind]}>
											{line.text}
										</span>
									))}
									{verdicts && checks && (
										<div className="font-sans whitespace-normal" aria-label="Esito dei controlli">
											<p className={cn('m-0! mb-3! font-semibold', passed === checks.length ? 'text-ok-fg' : 'text-fg-strong')}>
												{passed === checks.length
													? checks.length === 1
														? 'Controllo superato.'
														: `Tutti i ${checks.length} controlli superati.`
													: passed === 1
														? `1 controllo superato su ${checks.length}.`
														: `${passed} controlli superati su ${checks.length}.`}
											</p>
											{/* not a list element: the lesson's own list styles would number it */}
											<div role="list" className="flex flex-col gap-2">
												{verdicts.map((verdict, i) => (
													<div role="listitem" key={i} className={cn('rounded-lg border px-3 py-2', verdict.passed ? 'border-ok-edge bg-ok-soft' : 'border-danger-edge bg-danger-soft')}>
														<p className={cn('m-0! flex items-start gap-1.5 text-sm font-semibold', verdict.passed ? 'text-ok-fg' : 'text-danger-fg')}>
															{verdict.passed ? <Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <X className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
															{checks[i].description}
														</p>
														{!verdict.passed && <p className="m-0! mt-1! text-sm text-fg">{verdict.why}</p>}
													</div>
												))}
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					</>
				}
			/>
		</section>
	);
}
