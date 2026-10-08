import { DIALOGS, type Action, type Check, type Rule } from '@/lib/codice/blocco';
import { samePath } from '@/lib/codice/progetto';

/**
 * The checks of a page's exercise (lib/codice/blocco.ts), run on the page itself: by the preview, where the page is.
 * A check with actions does them first, as a student would (a click, a text typed in a field, a form sent), and its
 * rules are read on what the page has become; the editor loads the page anew for each such check (WebBench.tsx).
 */

export interface CheckVerdict {
	passed: boolean;
	/** Why not, for the student. */
	why: string;
}

const squash = (text: string) => text.replace(/\s+/g, ' ').trim();

const SIDES = /^border-(top|right|bottom|left|block-start|block-end|inline-start|inline-end)-width$/;

/**
 * Why an element's style is not what a rule asks; null when it is. The value asked is given to the element itself
 * for a moment, and the two computed styles are compared: so `red` and `rgb(255, 0, 0)` are the same, `50%` and
 * `2em` are measured where the element is, and a shorthand (`border`, `margin`, `gap`) is compared in each of its
 * parts. The width of a border is computed as 0 while the border has no style: it is asked with a solid border, so
 * that an element with no border is not taken for one with the right width.
 */
function styled(doc: Document, element: Element, selector: string, property: string, value: string): string | null {
	if (!(element instanceof doc.defaultView!.HTMLElement) && !(element instanceof doc.defaultView!.SVGElement)) return null;
	const scratch = doc.createElement('div').style;
	scratch.setProperty(property, value);
	const parts = Array.from({ length: scratch.length }, (_, i) => scratch[i]);
	if (parts.length === 0) return `Il controllo chiede ${property}: ${value}, che non è CSS valido.`;
	const read = () => {
		const style = getComputedStyle(element);
		return parts.map((part) => style.getPropertyValue(part));
	};
	const now = read();
	const written = element.getAttribute('style');
	const put = (attribute: string | null) => (attribute === null ? element.removeAttribute('style') : element.setAttribute('style', attribute));
	// no transition: the value asked must be read at once, and must not be seen coming or going
	element.style.setProperty('transition', 'none', 'important');
	element.style.setProperty(property, value, 'important');
	for (const part of parts) {
		const style = SIDES.test(part) ? part.replace(/width$/, 'style') : part === 'outline-width' ? 'outline-style' : part === 'column-rule-width' ? 'column-rule-style' : null;
		if (style && !parts.includes(style)) element.style.setProperty(style, 'solid', 'important');
	}
	const asked = read();
	put(written);
	element.style.setProperty('transition', 'none', 'important');
	void getComputedStyle(element).opacity;
	put(written);
	const wrong = parts.findIndex((_, i) => now[i] !== asked[i]);
	if (wrong < 0) return null;
	const part = parts[wrong];
	return `Lo stile ${part} di "${selector}" è ${now[wrong] || 'vuoto'}: dovrebbe essere ${part === property ? value : `${asked[wrong]} (${property}: ${value})`}.`;
}

/** The window of the page, with the classes of its elements and of its events. */
type Page = Window & typeof globalThis;

/** The `submit` events of the page, by form: `went` is whether nothing prevented it, known when its listeners have all run. */
const submits = new WeakMap<Element, { went: boolean | null }[]>();

/**
 * Follows the forms that are sent. A form of the page behaves as in a real page until it would leave: its fields
 * are checked, `submit` is fired, the student's listeners run. Then, if nobody prevented it, it is stopped here and
 * `report` is told, with the button that sent it: the preview is not the place a form goes to. Called again
 * whenever the page is written: writing it removes every listener.
 */
export function watch(win: Page, report?: (form: HTMLFormElement, submitter: HTMLElement | null) => void) {
	const gone = (form: HTMLFormElement, submitter: HTMLElement | null) => report?.(form, submitter);
	win.addEventListener(
		'submit',
		(event) => {
			const form = event.target;
			if (!(form instanceof win.HTMLFormElement)) return;
			const entry: { went: boolean | null } = { went: null };
			submits.set(form, [...(submits.get(form) ?? []), entry]);
			const settle = () => {
				if (entry.went !== null) return;
				entry.went = !event.defaultPrevented;
				if (!entry.went) return;
				event.preventDefault();
				gone(form, (event as SubmitEvent).submitter ?? null);
			};
			// added now, it is the last listener the event reaches; a listener that stops the event keeps it from here, so a timer too
			win.addEventListener('submit', settle, { once: true });
			win.setTimeout(settle);
		},
		true
	);
	// submit() sends without the event and without checking the fields
	win.HTMLFormElement.prototype.submit = function (this: HTMLFormElement) {
		submits.set(this, [...(submits.get(this) ?? []), { went: true }]);
		gone(this, null);
	};
}

/** What alert(), confirm() and prompt() were called with, when the page was told not to open them. */
let dialogs: string[] = [];

/** The dialogs of the page do not open, so they cannot stop a check: they are remembered, for the rules on `@avviso`. */
export function hush(win: Page) {
	dialogs = [];
	const said = (text: unknown = '') => void dialogs.push(String(text));
	win.alert = said;
	win.confirm = (text) => (said(text), true);
	win.prompt = (text, value) => (said(text), value ?? '');
}

const sent = (form: Element) => (submits.get(form) ?? []).some((entry) => entry.went);
const tick = (ms = 0) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** What an action is, said to the student when its element is not there. */
const DOING: Record<Exclude<Action['kind'], 'wait' | 'width'>, string> = {
	click: 'premere',
	type: 'scrivere in',
	select: 'scegliere un’opzione di',
	check: 'mettere la spunta a',
	uncheck: 'togliere la spunta a',
	submit: 'inviare',
	key: 'premere un tasto in'
};

/** Changes what a field holds as typing does: through the element's own setter, then `input` and `change`. */
function fill(win: Page, field: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
	field.focus();
	field.value = value;
	field.dispatchEvent(new win.Event('input', { bubbles: true }));
	field.dispatchEvent(new win.Event('change', { bubbles: true }));
}

/**
 * Sends a form with `act` (a click on its button, or requestSubmit). Where the frame's sandbox stops a form before
 * its `submit` event, the event is given here, to a form whose fields are valid, as the browser would have.
 */
function submitting(win: Page, form: HTMLFormElement | null, submitter: HTMLElement | null, act: () => boolean) {
	const before = form ? (submits.get(form) ?? []).length : 0;
	const went = act();
	if (!form || !went || !form.isConnected || (submits.get(form) ?? []).length > before) return;
	if (form.noValidate || submitter?.hasAttribute('formnovalidate') || form.checkValidity()) form.dispatchEvent(new win.SubmitEvent('submit', { bubbles: true, cancelable: true, submitter }));
}

/** Does one action on the page; answers why it could not, for the student. */
async function act(doc: Document, action: Action, context: Around): Promise<string | null> {
	if (action.kind === 'wait') {
		await tick(action.ms);
		return null;
	}
	if (action.kind === 'width') return (await context.resize?.(action.width)) ? null : `L’anteprima non è arrivata a ${action.width} pixel di larghezza: riprova.`;
	const win = doc.defaultView!;
	let element: Element | null;
	try {
		element = doc.querySelector(action.selector);
	} catch {
		return `Il selettore "${action.selector}" non è valido.`;
	}
	if (!(element instanceof win.HTMLElement)) return `Per questo controllo provo a ${DOING[action.kind]} "${action.selector}", ma nella pagina non lo trovo.`;
	if (action.kind === 'click') {
		const button = element.closest('button, input[type=submit], input[type=image]');
		const sends = button instanceof win.HTMLButtonElement ? button.type === 'submit' : button !== null;
		const form = sends ? (button as HTMLButtonElement | HTMLInputElement).form : null;
		for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup']) element.dispatchEvent(new win.MouseEvent(type, { bubbles: true, cancelable: true }));
		const target = element;
		// a click that a listener prevents, or on a button that is disabled, sends no form
		let click: Event | null = null;
		const look = (event: Event) => (click = event);
		submitting(win, form, button as HTMLElement | null, () => {
			win.addEventListener('click', look, { once: true });
			target.click();
			win.removeEventListener('click', look);
			return click !== null && !(click as Event).defaultPrevented;
		});
	} else if (action.kind === 'type') {
		if (!(element instanceof win.HTMLInputElement || element instanceof win.HTMLTextAreaElement)) return `"${action.selector}" non è un campo in cui si scrive.`;
		fill(win, element, action.text);
	} else if (action.kind === 'select') {
		if (!(element instanceof win.HTMLSelectElement)) return `"${action.selector}" non è un elenco di opzioni (select).`;
		const option = [...element.options].find((one) => squash(one.text) === squash(action.text)) ?? [...element.options].find((one) => one.value === action.text);
		if (!option) return `In "${action.selector}" non trovo l'opzione "${action.text}".`;
		fill(win, element, option.value);
	} else if (action.kind === 'check' || action.kind === 'uncheck') {
		if (!(element instanceof win.HTMLInputElement) || (element.type !== 'checkbox' && element.type !== 'radio')) return `"${action.selector}" non è una casella da spuntare.`;
		// a click, as a student's: the box changes and says so with `input` and `change`
		if (element.checked !== (action.kind === 'check')) element.click();
	} else if (action.kind === 'submit') {
		const form = element instanceof win.HTMLFormElement ? element : element.closest('form');
		if (!form) return `"${action.selector}" non è un modulo (form), e non è dentro un modulo.`;
		submitting(win, form, null, () => (form.requestSubmit(), true));
	} else if (action.kind === 'key') {
		element.focus();
		for (const type of ['keydown', 'keyup']) element.dispatchEvent(new win.KeyboardEvent(type, { key: action.text, code: action.text, bubbles: true, cancelable: true }));
	}
	// what the page does in answer may come a moment later: a timer of no delay, a promise
	await tick();
	return null;
}

/** The attributes whose value is a path. */
const LINKS = ['href', 'src', 'action'];

/** What a check needs of where the page is: its path in the project, and how to ask for a width of the preview. */
export interface Around {
	from?: string;
	/** Answers whether the preview has become that wide. */
	resize?: (width: number) => Promise<boolean>;
}

function fails(doc: Document, rule: Rule, context: Around): string | null {
	if (rule.selector === DIALOGS) {
		if (rule.kind === 'count') return dialogs.length === rule.count ? null : `La pagina ha aperto ${dialogs.length} finestre di avviso, ne servono ${rule.count}.`;
		if (rule.kind === 'absent') return dialogs.length === 0 ? null : `La pagina ha aperto una finestra di avviso ("${dialogs[0]}"), e non doveva.`;
		if (dialogs.length === 0) return 'La pagina non ha aperto nessuna finestra di avviso (alert).';
		if (rule.kind !== 'text') return null;
		const wanted = squash(rule.text);
		if (dialogs.some((text) => (rule.exact ? squash(text) === wanted : squash(text).includes(wanted)))) return null;
		return `L'avviso della pagina dice "${squash(dialogs[dialogs.length - 1])}": ${rule.exact ? 'dovrebbe dire' : 'dovrebbe contenere'} "${wanted}".`;
	}
	let found: Element[];
	try {
		found = [...doc.querySelectorAll(rule.selector)];
	} catch {
		return `Il selettore "${rule.selector}" non è valido.`;
	}
	if (rule.kind === 'count') return found.length === rule.count ? null : `Di "${rule.selector}" ne trovo ${found.length}, ne servono ${rule.count}.`;
	if (rule.kind === 'absent') return found.length === 0 ? null : `Nella pagina c'è "${rule.selector}", e non dovrebbe esserci.`;
	const first = found[0];
	if (!first) return `Nella pagina non trovo "${rule.selector}".`;
	const win = doc.defaultView!;
	if (rule.kind === 'visible') {
		const visible = first.getClientRects().length > 0 && getComputedStyle(first).visibility !== 'hidden';
		return visible === rule.visible ? null : `"${rule.selector}" ${visible ? 'si vede, e dovrebbe essere nascosto' : 'è nascosto, e dovrebbe vedersi'}.`;
	}
	if (rule.kind === 'class') return first.classList.contains(rule.name) === rule.has ? null : `"${rule.selector}" ${rule.has ? 'non ha' : 'ha ancora'} la classe ${rule.name}.`;
	if (rule.kind === 'value') {
		if (!(first instanceof win.HTMLInputElement || first instanceof win.HTMLTextAreaElement || first instanceof win.HTMLSelectElement)) return `"${rule.selector}" non è un campo con un valore.`;
		return first.value.trim() === rule.value ? null : `Il valore di "${rule.selector}" è "${first.value}": dovrebbe essere "${rule.value}".`;
	}
	if (rule.kind === 'checked') {
		if (!(first instanceof win.HTMLInputElement)) return `"${rule.selector}" non è una casella da spuntare.`;
		return first.checked === rule.checked ? null : `"${rule.selector}" ${first.checked ? 'ha la spunta, e non dovrebbe' : 'non ha la spunta'}.`;
	}
	if (rule.kind === 'sent') {
		if (!(first instanceof win.HTMLFormElement)) return `"${rule.selector}" non è un modulo (form).`;
		return sent(first) === rule.sent ? null : rule.sent ? `Il modulo "${rule.selector}" non è stato inviato.` : `Il modulo "${rule.selector}" è stato inviato lo stesso: l'invio va fermato con preventDefault().`;
	}
	if (rule.kind === 'text') {
		const text = squash(first.textContent ?? '');
		const wanted = squash(rule.text);
		if (rule.exact ? text === wanted : text.includes(wanted)) return null;
		return `Il testo di "${rule.selector}" è "${text}": ${rule.exact ? 'dovrebbe essere' : 'dovrebbe contenere'} "${wanted}".`;
	}
	if (rule.kind === 'attribute') {
		const value = first.getAttribute(rule.name);
		if (value === null) return `"${rule.selector}" non ha l'attributo ${rule.name}.`;
		// a path is the file it leads to, however it is written
		const same = LINKS.includes(rule.name.toLowerCase()) ? samePath(context.from ?? '', value, rule.value ?? '') : value.trim() === rule.value;
		return rule.value === null || same ? null : `L'attributo ${rule.name} di "${rule.selector}" vale "${value}": dovrebbe valere "${rule.value}".`;
	}
	if (rule.kind === 'style') return styled(doc, first, rule.selector, rule.property, rule.value);
	return null;
}

/** How long the page has to settle after the last action, before the rules are read. */
const SETTLE = 60;

export async function runCheck(doc: Document, check: Check, context: Around = {}): Promise<CheckVerdict> {
	for (const action of check.actions ?? []) {
		const why = await act(doc, action, context);
		if (why) return { passed: false, why };
	}
	if (check.actions) await tick(SETTLE);
	for (const rule of check.rules) {
		const why = fails(doc, rule, context);
		if (why) return { passed: false, why };
	}
	return { passed: true, why: '' };
}
