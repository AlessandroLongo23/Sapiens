import supabase from '$lib/supabase';
import { configs } from '$lib/exercises/config';
import { reconstructTree, type ContentNode } from '$lib/utils/tree';

export interface ContentNodeWithStatus extends ContentNode {
	hasTheory: boolean;
	hasFormulary: boolean;
	hasExercises: boolean;
	hasFlashcards: boolean;
	path: string;
	theory: string | null;
	formulary: string | null;
	flashcards: string | null;
	children: ContentNodeWithStatus[];
}

export async function load({ locals }) {
	const { session, user } = locals;

	try {
		// Fetch all content nodes
		const { data: nodes, error } = await supabase
			.from('content_nodes')
			.select('*')
			.order('position', { ascending: true });

		if (error) {
			console.error('Error fetching content nodes:', error);
			return { tree: [], session, user };
		}

		if (!nodes || nodes.length === 0) {
			return { tree: [], session, user };
		}

		// Get exercise config paths
		const exercisePaths = new Set(Object.keys(configs));

		// Create node map for path building
		const nodeMap = new Map(nodes.map(n => [n.id, n]));

		// Helper to build full path for a node
		function buildPath(node: any): string {
			const path: string[] = [];
			let current = node;
			
			while (current) {
				path.unshift(current.slug);
				current = nodeMap.get(current.parent_id);
			}
			
			return path.join('/');
		}

		// Helper to check if content exists
		function hasContent(value: any): boolean {
			return value && typeof value === 'string' && value.trim().length > 0;
		}

		// Add status to each node
		const nodesWithStatus = nodes.map(node => {
			const path = buildPath(node);
			return {
				...node,
				hasTheory: hasContent(node.theory),
				hasFormulary: hasContent(node.formulary),
				hasExercises: exercisePaths.has(path),
				hasFlashcards: hasContent(node.flashcards),
				path
			};
		});

		// Reconstruct tree with status
		const tree = reconstructTree(nodesWithStatus) as ContentNodeWithStatus[];

		return { tree, session, user };
	} catch (err) {
		console.error('Error in desk load:', err);
		return { tree: [], session, user };
	}
}

