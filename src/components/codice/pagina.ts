import type { Check } from '@/lib/codice/blocco';
import { kindOf, resolvePath, type ProjectFiles } from '@/lib/codice/progetto';
import { format } from './js-environment';
import { GUARD, assemble } from './web-assemble';
import { runCheck, type CheckVerdict } from './web-checks';

/**
 * The script of the preview of a web page (WebBench.tsx): the only thing in the page of the iframe
 * (src/app/codice-sandbox/pagina/route.ts) until the editor sends the student's page, which is then written in its
 * place. It stays around the student's page: what the page prints with console.log and the errors of its script go
 * to the editor's console, a loop that never ends is stopped, a link does not take the preview elsewhere, and the
 * checks of an exercise are run here, on the page itself. scripts/codice/sandbox.mjs builds it.
 */

/** `html` is the text of the page when it is not the file's own: a Markdown file turned into a page. */
export type ToPage = { type: 'page'; files: ProjectFiles; path: string; html?: string } | { type: 'checks'; id: number; checks: Check[] };
export type FromPage =
	| { type: 'ready' }
	| { type: 'loaded' }
	/** A link to another page of the project was clicked. */
	| { type: 'navigate'; path: string }
	| { type: 'chunk'; kind: 'out' | 'err' | 'note'; text: string }
	| { type: 'verdicts'; id: number; verdicts: CheckVerdict[] };

const SITE = new URL((document.currentScript as HTMLScriptElement).src).origin;
const post = (message: FromPage) => parent.postMessage(message, SITE);

/** A page that prints in a loop is cut here; the editor would not survive much more. */
const LIMIT = 50_000;
let printed = 0;
function say(kind: 'out' | 'err' | 'note', text: string) {
	if (printed > LIMIT) return;
	printed += text.length;
	post({ type: 'chunk', kind, text: printed > LIMIT ? 'La pagina ha stampato troppo: il resto non viene mostrato.\n' : text });
}

/** How long a script may run without a pause before its loops are stopped. */
const PATIENCE = 2000;
let since = 0;
let watched = false;
const scope = window as unknown as Record<string, unknown>;
scope[GUARD] = () => {
	const now = performance.now();
	if (!watched) {
		// a task that ends lets this timer run: the next loop starts its own count
		watched = true;
		since = now;
		setTimeout(() => (watched = false));
	} else if (now - since > PATIENCE) {
		watched = false;
		const error = new Error(`gira da più di ${PATIENCE / 1000} secondi senza finire.`);
		error.name = 'Ciclo fermato';
		throw error;
	}
};

const print =
	(kind: 'out' | 'err') =>
	(...values: unknown[]) =>
		say(kind, `${values.map((v) => format(v)).join(' ')}\n`);
Object.assign(console, { log: print('out'), info: print('out'), debug: print('out'), warn: print('err'), error: print('err') });

/** The scripts of the page shown, by the address they were loaded from, and the page's own path. */
let scripts = new Map<string, string>();
let shown = '';
let project: ProjectFiles = {};

/** What is listened for around the student's page; writing the page removes every listener, so it is called again. */
function listen() {
	addEventListener('message', (event: MessageEvent<ToPage>) => {
		if (event.source !== parent || event.origin !== SITE) return;
		const order = event.data;
		if (order.type === 'page') show(order.files, order.path, order.html);
		else if (order.type === 'checks') post({ type: 'verdicts', id: order.id, verdicts: order.checks.map((check) => runCheck(document, check)) });
	});
	addEventListener('error', (event) => {
		if (!(event instanceof ErrorEvent)) return;
		const error = event.error as unknown;
		const text = error instanceof Error ? `${error.name}: ${error.message}` : event.message.replace(/^Uncaught /, '');
		// the line of a script of the project the error passed through: its own, or the one that called what failed
		let where = shown;
		if (scripts.has(event.filename)) where = `${scripts.get(event.filename)}, riga ${event.lineno}`;
		else if (error instanceof Error) {
			const through = /(blob:[^\s)]+?):(\d+)/.exec(error.stack ?? '');
			if (through && scripts.has(through[1])) where = `${scripts.get(through[1])}, riga ${through[2]}`;
		}
		say('err', `${text}\n    in ${where}\n`);
	});
	addEventListener('unhandledrejection', (event) => {
		const reason = event.reason as unknown;
		say('err', `${reason instanceof Error ? `${reason.name}: ${reason.message}` : String(reason)}\n`);
	});
	// a link would take the preview to another page, which is not the student's
	addEventListener(
		'click',
		(event) => {
			const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
			const href = link?.getAttribute('href') ?? '';
			if (!link || href.startsWith('#')) return;
			event.preventDefault();
			// a page of the project is shown by the editor, in the place of this one
			const target = resolvePath(shown, href);
			const kind = target === null ? null : kindOf(target);
			if (target !== null && target in project && (kind === 'html' || kind === 'markdown')) return post({ type: 'navigate', path: target });
			say('note', `Nell’anteprima i link non si aprono: questo porta a ${href}\n`);
		},
		true
	);
	addEventListener('load', () => post({ type: 'loaded' }));
}

function show(files: ProjectFiles, path: string, text?: string) {
	project = files;
	shown = path;
	scripts = new Map();
	const { html, notes } = assemble(files, path, text ?? files[path] ?? '', (script) => {
		const address = URL.createObjectURL(new Blob([files[script]], { type: 'text/javascript' }));
		scripts.set(address, script);
		return address;
	});
	document.open();
	listen();
	document.write(html);
	document.close();
	notes.forEach((note) => say('note', `${note}\n`));
}

listen();
post({ type: 'ready' });
