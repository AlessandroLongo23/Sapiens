import type { Check, Page } from '@/lib/codice/blocco';
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

export type ToPage = { type: 'page'; page: Page } | { type: 'checks'; id: number; checks: Check[] };
export type FromPage =
	| { type: 'ready' }
	| { type: 'loaded' }
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

let script = '';

/** What is listened for around the student's page; writing the page removes every listener, so it is called again. */
function listen() {
	addEventListener('message', (event: MessageEvent<ToPage>) => {
		if (event.source !== parent || event.origin !== SITE) return;
		const order = event.data;
		if (order.type === 'page') show(order.page);
		else if (order.type === 'checks') post({ type: 'verdicts', id: order.id, verdicts: order.checks.map((check) => runCheck(document, check)) });
	});
	addEventListener('error', (event) => {
		if (!(event instanceof ErrorEvent)) return;
		const error = event.error as unknown;
		const text = error instanceof Error ? `${error.name}: ${error.message}` : event.message.replace(/^Uncaught /, '');
		// the line of script.js the error passed through: its own, or the one that called what failed
		const through = error instanceof Error && script ? new RegExp(`${script.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:(\\d+)`).exec(error.stack ?? '') : null;
		const line = event.filename === script ? event.lineno : through ? Number(through[1]) : 0;
		const where = line ? `script.js, riga ${line}` : 'index.html';
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
			say('note', `Nell’anteprima i link non si aprono: questo porta a ${href}\n`);
		},
		true
	);
	addEventListener('load', () => post({ type: 'loaded' }));
}

function show(page: Page) {
	script = URL.createObjectURL(new Blob([page.js], { type: 'text/javascript' }));
	const { html, notes } = assemble(page, script);
	document.open();
	listen();
	document.write(html);
	document.close();
	notes.forEach((note) => say('note', `${note}\n`));
}

listen();
post({ type: 'ready' });
