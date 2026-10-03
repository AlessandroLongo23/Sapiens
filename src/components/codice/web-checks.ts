import type { Check, Rule } from '@/lib/codice/blocco';

/** The checks of a page's exercise (lib/codice/blocco.ts), run on the page itself: by the preview, where the page is. */

export interface CheckVerdict {
	passed: boolean;
	/** Why not, for the student. */
	why: string;
}

const squash = (text: string) => text.replace(/\s+/g, ' ').trim();

/** A value as the browser computes it for a property, so `red` and `rgb(255, 0, 0)` are the same. */
function computed(doc: Document, property: string, value: string): string {
	const probe = doc.createElement('div');
	probe.style.setProperty(property, value);
	(doc.body ?? doc.documentElement).append(probe);
	const read = getComputedStyle(probe).getPropertyValue(property);
	probe.remove();
	return read || value;
}

function fails(doc: Document, rule: Rule): string | null {
	let found: Element[];
	try {
		found = [...doc.querySelectorAll(rule.selector)];
	} catch {
		return `Il selettore "${rule.selector}" non è valido.`;
	}
	if (rule.kind === 'count') return found.length === rule.count ? null : `Di "${rule.selector}" ne trovo ${found.length}, ne servono ${rule.count}.`;
	const first = found[0];
	if (!first) return `Nella pagina non trovo "${rule.selector}".`;
	if (rule.kind === 'text') {
		const text = squash(first.textContent ?? '');
		const wanted = squash(rule.text);
		if (rule.exact ? text === wanted : text.includes(wanted)) return null;
		return `Il testo di "${rule.selector}" è "${text}": ${rule.exact ? 'dovrebbe essere' : 'dovrebbe contenere'} "${wanted}".`;
	}
	if (rule.kind === 'attribute') {
		const value = first.getAttribute(rule.name);
		if (value === null) return `"${rule.selector}" non ha l'attributo ${rule.name}.`;
		return rule.value === null || value.trim() === rule.value ? null : `L'attributo ${rule.name} di "${rule.selector}" vale "${value}": dovrebbe valere "${rule.value}".`;
	}
	if (rule.kind === 'style') {
		const value = getComputedStyle(first).getPropertyValue(rule.property);
		return value === computed(doc, rule.property, rule.value) ? null : `Lo stile ${rule.property} di "${rule.selector}" è ${value || 'vuoto'}: dovrebbe essere ${rule.value}.`;
	}
	return null;
}

export function runCheck(doc: Document, check: Check): CheckVerdict {
	for (const rule of check.rules) {
		const why = fails(doc, rule);
		if (why) return { passed: false, why };
	}
	return { passed: true, why: '' };
}
