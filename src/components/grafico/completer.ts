import type { Completer } from '@/components/math/completion';
import { settleKey, settleTyped, track } from '@/lib/grafico/comandi';

/** The proposals of the plotter's formulas: the words of lib/grafico/comandi.ts. */
export const PLOT_COMPLETER: Completer = {
	propose: (run) => {
		const tracked = track(run);
		return tracked && { letters: tracked.word.length, items: tracked.found.map((c) => ({ id: c.word, title: c.title, uses: c.uses, about: c.about, insert: c.insert })) };
	},
	typed: settleTyped,
	key: settleKey
};
