import 'server-only';
import type { SupabaseClient, User } from '@supabase/supabase-js';
import { hasFeature } from '@/lib/auth/entitlements';
import { decodeState } from '@/lib/grafico/documento';
import { FREE_PLOTS, MAX_PLOT_PREVIEW, MAX_PLOT_STATE, MAX_PLOT_TITLE, type PlotQuota, type SavedPlot, type SavedPlotState } from '@/lib/grafico/salvati';
import { Features } from '@/lib/stripe/config';

/**
 * The graphs saved from the plotter, read and written with the visitor's own Supabase client: row level security
 * is the access rule. Built like ./zaino, and sharing its plan: an account with unlimited quaderni has unlimited graphs.
 */

export class PlotError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

const LIST_COLUMNS = 'id,title,updated_at';
const COLUMNS = `${LIST_COLUMNS},state`;
const DUPLICATE = '23505';
const TAKEN = 'Hai già un grafico con questo nome.';
const MISSING = 'Grafico non trovato.';

function fail(context: string, error: { message: string }): never {
	console.error(`${context}:`, error.message);
	throw new PlotError(503, 'Servizio non disponibile. Riprova più tardi.');
}

export async function plotQuota(supabase: SupabaseClient, user: User): Promise<PlotQuota> {
	const { count, error } = await supabase.from('plots').select('id', { count: 'exact', head: true }).eq('user_id', user.id);
	if (error) fail('plot count failed', error);
	return { used: count ?? 0, max: hasFeature(user, Features.NOTEBOOKS) ? null : FREE_PLOTS };
}

export async function listPlots(supabase: SupabaseClient, userId: string): Promise<SavedPlot[]> {
	const { data, error } = await supabase.from('plots').select(LIST_COLUMNS).eq('user_id', userId).order('updated_at', { ascending: false });
	if (error) fail('plot list failed', error);
	return (data ?? []) as SavedPlot[];
}

export async function getPlot(supabase: SupabaseClient, userId: string, id: string): Promise<SavedPlotState> {
	const { data, error } = await supabase.from('plots').select(`${COLUMNS},preview`).eq('user_id', userId).eq('id', id).maybeSingle();
	if (error) fail('plot read failed', error);
	if (!data) throw new PlotError(404, MISSING);
	return data as SavedPlotState;
}

/** "Salva con nome": a new graph. The free ceiling is checked here, the one way to an insert. */
export async function createPlot(supabase: SupabaseClient, user: User, input: { title: string; state: string; preview?: string | null }): Promise<SavedPlotState> {
	const quota = await plotQuota(supabase, user);
	if (quota.max !== null && quota.used >= quota.max) throw new PlotError(402, `Con il piano gratuito puoi tenere ${FREE_PLOTS} grafici. Passa a un piano a pagamento per non avere limiti, oppure eliminane uno.`);
	const { data, error } = await supabase.from('plots').insert({ user_id: user.id, title: input.title, state: input.state, preview: input.preview ?? null }).select(COLUMNS).single();
	if (error?.code === DUPLICATE) throw new PlotError(409, TAKEN);
	if (error) fail('plot create failed', error);
	return data as SavedPlotState;
}

/** "Salva" over a graph already saved, or a new name for it. */
export async function updatePlot(supabase: SupabaseClient, userId: string, id: string, patch: { title?: string; state?: string; preview?: string | null }): Promise<SavedPlotState> {
	const { data, error } = await supabase
		.from('plots')
		.update({ ...patch, updated_at: new Date().toISOString() })
		.eq('user_id', userId)
		.eq('id', id)
		.select(COLUMNS)
		.maybeSingle();
	if (error?.code === DUPLICATE) throw new PlotError(409, TAKEN);
	if (error) fail('plot save failed', error);
	if (!data) throw new PlotError(404, MISSING);
	return data as SavedPlotState;
}

export async function deletePlot(supabase: SupabaseClient, userId: string, id: string): Promise<void> {
	const { error } = await supabase.from('plots').delete().eq('user_id', userId).eq('id', id);
	if (error) fail('plot delete failed', error);
}

/** The title and the state of a request, each where it is given: a sentence when one cannot be used. */
export function parsePlotInput(body: Record<string, unknown>, need: { title: boolean; state: boolean }): { title?: string; state?: string; preview?: string | null } | string {
	const out: { title?: string; state?: string; preview?: string | null } = {};
	if (body.title !== undefined || need.title) {
		const title = typeof body.title === 'string' ? body.title.trim().replace(/\s+/g, ' ') : '';
		if (!title) return 'Dai un nome al grafico.';
		if (title.length > MAX_PLOT_TITLE) return `Il nome è troppo lungo: al più ${MAX_PLOT_TITLE} caratteri.`;
		out.title = title;
	}
	if (body.state !== undefined || need.state) {
		const state = typeof body.state === 'string' ? body.state : '';
		// read back as the plotter would: what it cannot open is not saved
		if (!state || state.length > MAX_PLOT_STATE || !decodeState(state)) return 'Questo grafico non si può salvare.';
		out.state = state;
		// the picture goes with the state it shows: one that is not an SVG, or too heavy, is left out
		out.preview = typeof body.preview === 'string' && body.preview.startsWith('<svg') && body.preview.length <= MAX_PLOT_PREVIEW ? body.preview : null;
	}
	if (out.title === undefined && out.state === undefined) return 'Niente da salvare.';
	return out;
}
