/**
 * Flashcards of a lesson. They are written as markdown (docs/lezioni/flashcard/,
 * format in docs/lezioni/stile.md) and stored as JSON in
 * content_nodes.flashcards:
 *
 *   # Flashcard: Titolo della lezione
 *
 *   ## id-della-carta
 *   Domanda, in markdown con LaTeX.
 *   ---
 *   Risposta.
 *
 * The id is stable: saved progress will attach to it, so a published card
 * keeps its id even when its text changes.
 */

export interface Flashcard {
	id: string;
	front: string;
	back: string;
}

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** The cards of a flashcard file, or the problems that stop it from being published. */
export function parseFlashcards(markdown: string): { cards: Flashcard[]; errors: string[] } {
	const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
	const cards: Flashcard[] = [];
	const errors: string[] = [];
	if (!/^# \S/.test(lines[0] ?? '') || (lines[1] ?? '') !== '') errors.push('le prime righe devono essere "# Titolo" e una riga vuota');

	let current: { id: string; line: number; body: string[] } | null = null;
	const close = () => {
		if (!current) return;
		const { id, line, body } = current;
		const split = body.findIndex((l) => l.trim() === '---');
		const front = (split < 0 ? body : body.slice(0, split)).join('\n').trim();
		const back = split < 0 ? '' : body.slice(split + 1).join('\n').trim();
		if (split < 0) errors.push(`riga ${line}, carta "${id}": manca la riga "---" tra domanda e risposta`);
		else if (body.slice(split + 1).some((l) => l.trim() === '---')) errors.push(`riga ${line}, carta "${id}": più di una riga "---"`);
		else if (!front || !back) errors.push(`riga ${line}, carta "${id}": domanda o risposta vuota`);
		else cards.push({ id, front, back });
		current = null;
	};

	for (const [i, line] of lines.slice(2).entries()) {
		const heading = /^## (.*)$/.exec(line);
		if (heading) {
			close();
			const id = heading[1].trim();
			if (!ID.test(id)) errors.push(`riga ${i + 3}: "${id}" non è un id valido (minuscole, cifre e trattini)`);
			else if (cards.some((c) => c.id === id)) errors.push(`riga ${i + 3}: id "${id}" ripetuto`);
			current = { id, line: i + 3, body: [] };
		} else if (current) current.body.push(line);
		else if (line.trim()) errors.push(`riga ${i + 3}: testo prima della prima carta`);
	}
	close();
	if (!cards.length && !errors.length) errors.push('nessuna carta');
	return { cards, errors };
}

/** The stored column, read defensively: anything that is not a list of cards counts as no flashcards. */
export function storedFlashcards(value: unknown): Flashcard[] | null {
	if (!Array.isArray(value)) return null;
	const cards = value.filter((c): c is Flashcard => !!c && typeof c.id === 'string' && typeof c.front === 'string' && typeof c.back === 'string');
	return cards.length ? cards : null;
}
