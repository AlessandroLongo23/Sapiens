import type { Check } from '@/lib/codice/blocco';
import { kindOf, resolvePath, type ProjectFiles } from '@/lib/codice/progetto';
import { format } from './js-environment';
import { GUARD, assemble } from './web-assemble';
import { hush, runCheck, watch, type CheckVerdict } from './web-checks';

/**
 * The script of the preview of a web page (WebBench.tsx): the only thing in the page of the iframe
 * (src/app/codice-sandbox/pagina/route.ts) until the editor sends the student's page, which is then written in its
 * place. It stays around the student's page: what the page prints with console.log and the errors of its script go
 * to the editor's console, a loop that never ends is stopped, a link does not take the preview elsewhere, and the
 * checks of an exercise are run here, on the page itself. scripts/codice/sandbox.mjs builds it.
 */

/** `html` is the text of the page when it is not the file's own: a Markdown file turned into a page. */
/** `quiet`: the page is loaded to be checked, and its alert(), confirm() and prompt() must not stop to wait for anyone. */
/** `anchor`: the point of the page to show, when a link of another page asked for it (`pagina.html#contatti`). */
export type ToPage = { type: 'page'; files: ProjectFiles; path: string; html?: string; quiet?: boolean; anchor?: string } | { type: 'checks'; id: number; checks: Check[] };
export type FromPage =
	| { type: 'ready' }
	| { type: 'loaded' }
	/** A link to another page of the project was clicked. */
	| { type: 'navigate'; path: string; anchor?: string }
	/** A check asks for the preview to be this wide. */
	| { type: 'width'; width: number }
	| { type: 'chunk'; kind: 'out' | 'err' | 'note'; text: string }
	| { type: 'verdicts'; id: number; verdicts: CheckVerdict[] };

const SITE = new URL((document.currentScript as HTMLScriptElement).src).origin;
const post = (message: FromPage) => parent.postMessage(message, SITE);

/** A page that prints in a loop is cut here; the editor would not survive much more. */
const LIMIT = 50_000;
let printed = 0;
/** The errors of the page's scripts while a check is being made, to tell the student with its verdict. */
let trouble: string[] | null = null;
function say(kind: 'out' | 'err' | 'note', text: string) {
	if (kind === 'err') trouble?.push(text.trim().replace(/\n\s+/g, ' '));
	if (printed > LIMIT) return;
	printed += text.length;
	post({ type: 'chunk', kind, text: printed > LIMIT ? 'La pagina ha stampato troppo: il resto non viene mostrato.\n' : text });
}

/** The point of the page to show once it has loaded. */
let arrival = '';

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
/** The page was loaded to be checked: nothing is said of the forms it sends. */
let quiet = false;

/**
 * Shows the point of the page a link names after its `#`: the element with that id. With `only` nothing is moved
 * (the browser follows the link itself) and a point that is not there is said.
 */
function reach(anchor: string, only: 'say' | null = null) {
	let id = anchor.replace(/^#/, '');
	try {
		id = decodeURIComponent(id);
	} catch {
		// a name with a stray %, taken as it is written
	}
	const target = id ? (document.getElementById(id) ?? document.getElementsByName(id)[0]) : document.documentElement;
	if (target) return only ?? target.scrollIntoView();
	if (id === 'top') return only ?? scrollTo(0, 0);
	say('note', `Il link porta a #${id}, ma in ${shown} nessun elemento ha id="${id}".\n`);
}

/** What the student is told of a form that was sent: the preview is where it stops. */
function sent(form: HTMLFormElement, submitter: HTMLElement | null) {
	if (quiet) return;
	let data: FormData;
	try {
		data = new FormData(form, submitter);
	} catch {
		data = new FormData(form);
	}
	const pairs = [...data].map(([name, value]) => `${name}=${typeof value === 'string' ? value : value.name}`);
	const method = (submitter?.getAttribute('formmethod') ?? form.getAttribute('method') ?? 'get').toUpperCase();
	const action = submitter?.getAttribute('formaction') ?? form.getAttribute('action');
	say('note', `Modulo inviato con il metodo ${method}${action ? ` a ${action}` : ''}: ${pairs.length ? pairs.join(', ') : 'nessun dato, perché nessun campo ha l’attributo name'}. Nell’anteprima i dati si fermano qui.\n`);
}

/** Asks the editor for a width of the preview, and waits for it. */
async function resize(width: number): Promise<boolean> {
	post({ type: 'width', width });
	for (let waited = 0; waited < 1500; waited += 25) {
		if (Math.abs(innerWidth - width) <= 1) return true;
		await new Promise((resolve) => setTimeout(resolve, 25));
	}
	return false;
}

/** What is listened for around the student's page; writing the page removes every listener, so it is called again. */
function listen() {
	addEventListener('message', (event: MessageEvent<ToPage>) => {
		if (event.source !== parent || event.origin !== SITE) return;
		const order = event.data;
		if (order.type === 'page') show(order.files, order.path, order.html, order.quiet, order.anchor);
		else if (order.type === 'checks') void verdicts(order.checks).then((given) => post({ type: 'verdicts', id: order.id, verdicts: given }));
	});
	watch(window, sent);
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
			if (!link) return;
			// a link to a point of this page is the browser's to follow
			if (href.startsWith('#')) return void reach(href, 'say');
			event.preventDefault();
			// a page of the project is shown by the editor, in the place of this one
			const target = resolvePath(shown, href);
			const kind = target === null ? null : kindOf(target);
			const anchor = /#(.*)$/.exec(href)?.[0];
			if (target === shown && anchor) return reach(anchor);
			if (target !== null && target in project && (kind === 'html' || kind === 'markdown')) return post({ type: 'navigate', path: target, anchor });
			say('note', `Nell’anteprima i link non si aprono: questo porta a ${href}\n`);
		},
		true
	);
	// the load of the student's page: this page of one script has a load of its own before, which is no one's
	addEventListener('load', () => {
		if (!shown) return;
		if (arrival) reach(arrival);
		arrival = '';
		post({ type: 'loaded' });
	});
}

/** The checks one after the other; a check that fails after an error of the page's script says the error too. */
async function verdicts(checks: Check[]): Promise<CheckVerdict[]> {
	const given: CheckVerdict[] = [];
	for (const check of checks) {
		trouble = [];
		const verdict = await runCheck(document, check, { from: shown, resize });
		given.push(!verdict.passed && check.actions && trouble.length ? { passed: false, why: `${verdict.why} Lo script ha dato un errore: ${trouble[0]}` } : verdict);
		trouble = null;
	}
	return given;
}

function show(files: ProjectFiles, path: string, text?: string, hushed = false, anchor = '') {
	quiet = hushed;
	if (quiet) hush(window);
	arrival = anchor;
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
