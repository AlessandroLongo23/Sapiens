/**
 * The language a student has chosen for the programs of the lessons, kept on the device. The editor of a lesson
 * (components/codice/LessonCode.tsx) writes it under the same key; the exercises read it to show a program in that
 * language, and to open the editor of an answer in it.
 */
export type CodeLanguage = 'python' | 'cpp';

const KEY = 'sapiens:linguaggio';
const EVENT = 'sapiens:linguaggio';

export function readCodeLanguage(): CodeLanguage {
	try {
		return localStorage.getItem(KEY) === 'cpp' ? 'cpp' : 'python';
	} catch {
		return 'python';
	}
}

export function saveCodeLanguage(language: CodeLanguage) {
	try {
		localStorage.setItem(KEY, language);
	} catch {
		// not remembered, still used on this page
	}
	window.dispatchEvent(new Event(EVENT));
}

export function onCodeLanguage(notify: () => void): () => void {
	window.addEventListener(EVENT, notify);
	return () => window.removeEventListener(EVENT, notify);
}
