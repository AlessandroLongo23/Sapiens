/**
 * The graphs a student saves from the plotter, as the server and the browser agree on them. Pure, so the plotter
 * can import it: the reads and the writes are in lib/server/grafici.ts.
 */

/** How many graphs a free account keeps. Paid plans have no ceiling, as for the Zaino. */
export const FREE_PLOTS = 5;
/** The longest state a graph is saved with; the column refuses more. */
export const MAX_PLOT_STATE = 60_000;
export const MAX_PLOT_TITLE = 120;
/** The heaviest picture kept with a graph: a drawing that weighs more is saved without one. */
export const MAX_PLOT_PREVIEW = 300_000;

/** A saved graph as the list shows it. */
export interface SavedPlot {
	id: string;
	title: string;
	updated_at: string;
}

/** A saved graph with what it draws: the code a link to it would carry (encodeState). */
export interface SavedPlotState extends SavedPlot {
	state: string;
	/** The plane as it was when the graph was saved, as an SVG document; missing for a drawing too heavy to keep. */
	preview?: string | null;
}

export interface PlotQuota {
	used: number;
	/** Null on a paid plan. */
	max: number | null;
}
