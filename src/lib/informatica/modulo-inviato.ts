/**
 * What a form sends, for the figure of the lesson on forms
 * (components/content/interactive/informatica/ModuloInviato.tsx). No React here: the fields, the pairs of name and
 * value the browser makes of them, and the request they travel in with GET and with POST.
 *
 * The rules are those of HTML (the form's "entry list") for the fields a first lesson has: a field without `name`
 * is left out, a checkbox that is not ticked is left out, a ticked one sends its `value` (`on` when it has none).
 * The pairs are written as `application/x-www-form-urlencoded`, the default of a form: letters, digits and `*-._`
 * as they are, a space as `+`, every other character as the bytes of its UTF-8, each `%` and two hexadecimal digits.
 */

export type Campo =
	| { tipo: 'text' | 'email' | 'number' | 'password'; id: string; name: string | null; valore: string }
	| { tipo: 'checkbox'; id: string; name: string | null; value: string | null; spuntata: boolean };

export interface Coppia {
	name: string;
	value: string;
}

/** Why a field sends nothing, or null when it does. */
export function escluso(campo: Campo): 'senza name' | 'non spuntata' | null {
	if (!campo.name) return 'senza name';
	if (campo.tipo === 'checkbox' && !campo.spuntata) return 'non spuntata';
	return null;
}

/** The pair a field sends, or null when it sends nothing. */
export function coppia(campo: Campo): Coppia | null {
	if (escluso(campo) || !campo.name) return null;
	return { name: campo.name, value: campo.tipo === 'checkbox' ? (campo.value ?? 'on') : campo.valore };
}

/** The pairs of a form, in the order of its fields. */
export const coppie = (campi: readonly Campo[]) => campi.map(coppia).filter((c): c is Coppia => c !== null);

/** A name or a value as it is written in the address and in the body of the request. */
export const codifica = (testo: string) =>
	encodeURIComponent(testo.replace(/\r?\n/g, '\r\n'))
		.replace(/[!'()~]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
		.replace(/%20/g, '+');

/** The pairs in one text: `nome=Anna&posti=2`. */
export const unite = (cs: readonly Coppia[]) => cs.map((c) => `${codifica(c.name)}=${codifica(c.value)}`).join('&');

export type Metodo = 'get' | 'post';

/**
 * The request a form makes when it is sent to `action`: with GET the pairs go in the address, after a question
 * mark, and there is no body; with POST the address is `action` alone and the pairs are the body. A form with no
 * pair sent by GET still asks for `action?`, as browsers do.
 */
export function richiesta(metodo: Metodo, action: string, cs: readonly Coppia[]): { metodo: 'GET' | 'POST'; indirizzo: string; corpo: string | null } {
	const dati = unite(cs);
	return metodo === 'get' ? { metodo: 'GET', indirizzo: `${action.split('?')[0]}?${dati}`, corpo: null } : { metodo: 'POST', indirizzo: action, corpo: dati };
}
