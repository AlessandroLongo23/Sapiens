import { error } from '@sveltejs/kit';
import supabase from '$lib/supabase';
import { reconstructTree, type ContentNode } from '$lib/utils/tree';

/**
 * Server-side access to the content tree.
 *
 * The tree shipped to pages is "light": titles, slugs, descriptions, positions
 * and two booleans per node. Lesson text is loaded separately for the one node
 * being viewed (`getTopicContent`), so a subject page no longer carries every
 * theory document on the site.
 *
 * Results are cached in memory for a short time; on Vercel each function
 * instance keeps its own copy, and ISR caches the rendered pages on top.
 */

const TREE_TTL_MS = 60_000;

type FlatNode = Omit<ContentNode, 'children'>;

let cached: { at: number; nodes: FlatNode[] } | null = null;
let inflight: Promise<FlatNode[]> | null = null;

const LIGHT_COLUMNS = 'id,parent_id,type,title,slug,description,position,updated_at';

async function fetchFlatNodes(): Promise<FlatNode[]> {
	const [nodesRes, theoryRes, formularyRes] = await Promise.all([
		supabase.from('content_nodes').select(LIGHT_COLUMNS).order('position', { ascending: true }),
		supabase.from('content_nodes').select('id').not('theory', 'is', null).neq('theory', ''),
		supabase.from('content_nodes').select('id').not('formulary', 'is', null).neq('formulary', '')
	]);

	const failure = nodesRes.error ?? theoryRes.error ?? formularyRes.error;
	if (failure) {
		console.error('content_nodes query failed:', failure.message);
		throw error(503, 'Contenuti temporaneamente non disponibili.');
	}

	const withTheory = new Set((theoryRes.data ?? []).map((r) => r.id as string));
	const withFormulary = new Set((formularyRes.data ?? []).map((r) => r.id as string));

	return (nodesRes.data ?? []).map((row) => ({
		id: row.id,
		parent_id: row.parent_id,
		type: row.type,
		title: row.title ?? '',
		slug: row.slug ?? '',
		description: typeof row.description === 'string' && row.description.trim() ? row.description.trim() : null,
		position: row.position ?? 0,
		updated_at: row.updated_at ?? null,
		has_theory: withTheory.has(row.id),
		has_formulary: withFormulary.has(row.id)
	}));
}

export async function getFlatNodes(): Promise<FlatNode[]> {
	if (cached && Date.now() - cached.at < TREE_TTL_MS) return cached.nodes;
	if (!inflight) {
		inflight = fetchFlatNodes()
			.then((nodes) => {
				cached = { at: Date.now(), nodes };
				return nodes;
			})
			.finally(() => {
				inflight = null;
			});
	}
	return inflight;
}

/** The whole tree, light nodes only, children sorted by position. */
export async function getContentTree(): Promise<ContentNode[]> {
	return reconstructTree(await getFlatNodes());
}

/**
 * The tree as shipped to the browser: only what cards, navigation and the
 * mega menu read. Sort order is already applied, so `position`, `parent_id`
 * and `updated_at` stay on the server, and false / empty fields are omitted.
 */
export function slimTree(tree: ContentNode[]): ContentNode[] {
	return tree.map((node) => {
		const slim: Partial<ContentNode> = {
			id: node.id,
			type: node.type,
			title: node.title,
			slug: node.slug,
			children: slimTree(node.children)
		};
		if (node.description) slim.description = node.description;
		if (node.has_theory) slim.has_theory = true;
		if (node.has_formulary) slim.has_formulary = true;
		return slim as ContentNode;
	});
}

export interface TopicContent {
	theory: string | null;
	formulary: string | null;
	updated_at: string | null;
}

/** Markdown of one lesson, fetched only for the page that renders it. */
export async function getTopicContent(id: string): Promise<TopicContent> {
	const { data, error: err } = await supabase
		.from('content_nodes')
		.select('theory,formulary,updated_at')
		.eq('id', id)
		.maybeSingle();

	if (err) {
		console.error('content_nodes content query failed:', err.message);
		throw error(503, 'Contenuti temporaneamente non disponibili.');
	}

	const clean = (v: unknown) => (typeof v === 'string' && v.trim() ? v : null);
	return {
		theory: clean(data?.theory),
		formulary: clean(data?.formulary),
		updated_at: (data?.updated_at as string | undefined) ?? null
	};
}

/** Most recent `updated_at` across the whole tree, for the sitemap of index pages. */
export function latestUpdate(nodes: Pick<ContentNode, 'updated_at'>[]): string | null {
	let latest: string | null = null;
	for (const n of nodes) {
		if (n.updated_at && (!latest || n.updated_at > latest)) latest = n.updated_at;
	}
	return latest;
}
