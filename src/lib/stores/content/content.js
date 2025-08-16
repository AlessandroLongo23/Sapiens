import { writable, derived } from 'svelte/store';
import { supabase } from '$lib/supabase';

export const selectedContentNodeStore = writable(null);

function buildContentTree(nodes, parentId = null) {
	const result = [];
	
	const children = nodes
		.filter(node => node.parent_id === parentId)
		.sort((a, b) => {
			const ai = a.child_index ?? Number.POSITIVE_INFINITY;
			const bi = b.child_index ?? Number.POSITIVE_INFINITY;
			if (ai !== bi) return ai - bi;
			const at = (a.title || a.slug || '').toString().toLowerCase();
			const bt = (b.title || b.slug || '').toString().toLowerCase();
			return at.localeCompare(bt);
		});
	
	for (const child of children) {
		const grandChildren = buildContentTree(nodes, child.id);
		
		if (grandChildren.length > 0) {
			child.children = grandChildren;
		}
		
		result.push(child);
	}
	
	return result;
}

const createContentStore = () => {
	const { subscribe, set, update } = writable({
		contentTree: {},
		flatNodes: [],
		loading: true,
		error: null
	});

	if (typeof window !== 'undefined') {
		const subscription = supabase
			.channel('content_nodes_changes')
			.on('postgres_changes',
				{
					event: '*',
					schema: 'public',
					table: 'content_nodes'
				},
				async () => {
					const { data } = await supabase
						.from('content_nodes')
						.select('*')
						.order('path', { ascending: true });
					
					if (data) {
						const tree = buildContentTree(data);
						set({
							contentTree: tree,
							flatNodes: data,
							loading: false,
							error: null
						});
					}
				}
			)
			.subscribe();
	}

	return {
		subscribe,
		fetchContent: async () => {
			update(state => ({ ...state, loading: true }));
			try {
				const { data, error } = await supabase
					.from('content_nodes')
					.select('*')
					.order('path', { ascending: true });

				if (error) throw error;

				const tree = buildContentTree(data);

				set({
					contentTree: tree,
					flatNodes: data,
					loading: false,
					error: null
				});
			} catch (error) {
				console.error('Error fetching content:', error);
				set({
					contentTree: {},
					flatNodes: [],
					loading: false,
					error: error.message
				});
			}
		},
		getNodeById: (id) => {
			let result = null;
			update(state => {
				result = state.flatNodes.find(node => node.id === id);
				return state;
			});
			return result;
		},
		getNodeByPath: (path) => {
			if (!Array.isArray(path)) {
				path = [path]; // Convert string to array if needed
			}
			
			let result = null;
			update(state => {
				result = state.flatNodes.find(node => 
					node.path && 
					node.path.length === path.length && 
					node.path.every((segment, index) => segment === path[index])
				);
				return state;
			});
			return result;
		},
		getChildrenOf: (parentId) => {
			let result = [];
			update(state => {
				result = state.flatNodes
					.filter(node => node.parent_id === parentId)
					.sort((a, b) => {
						const ai = a.child_index ?? Number.POSITIVE_INFINITY;
						const bi = b.child_index ?? Number.POSITIVE_INFINITY;
						if (ai !== bi) return ai - bi;
						const at = (a.title || a.slug || '').toString().toLowerCase();
						const bt = (b.title || b.slug || '').toString().toLowerCase();
						return at.localeCompare(bt);
					});
				return state;
			});
			return result;
		},
		addContentNode: async (contentNode) => {
			const { data, error } = await supabase
				.from('content_nodes')
				.insert([contentNode])
				.select()
				.single();
				
			if (error) {
				console.error('Error adding content node:', error.message);
				throw new Error('Impossibile aggiungere il nodo di contenuto.');
			}
			return data;
		},
		updateContentNode: async (nodeId, updatedNode) => {
			const { data, error } = await supabase
				.from('content_nodes')
				.update(updatedNode)
				.eq('id', nodeId)
				.select()
				.single();

			if (error) {
				console.error('Error updating content node:', error.message);
				throw new Error('Impossibile aggiornare il nodo di contenuto.');
			}

			return data;
		},
		deleteContentNode: async (nodeId) => {
			const allNodes = [];
			update(state => {
				allNodes.push(...state.flatNodes);
				return state;
			});
			
			const nodeToDelete = allNodes.find(node => node.id === nodeId);
			if (!nodeToDelete) {
				throw new Error('Node not found');
			}
			
			// Get all descendants based on path
			const nodesToDelete = allNodes.filter(node => 
				node.path && 
				node.path.length >= nodeToDelete.path.length &&
				nodeToDelete.path.every((segment, index) => node.path[index] === segment)
			);
			
			// Delete nodes from leaf to root to avoid foreign key constraints
			const nodeIds = nodesToDelete.map(node => node.id);
			
			const { error } = await supabase
				.from('content_nodes')
				.delete()
				.in('id', nodeIds);
				
			if (error) {
				console.error('Error deleting content node:', error.message);
				throw new Error('Impossibile eliminare il nodo di contenuto.');
			}
			
			return true;
		},
		selectContentNode: (nodeId) => {
			selectedContentNodeStore.update(currentSelected => {
				if (currentSelected?.id === nodeId) {
					return null;
				}
				
				return nodeId ? { id: nodeId } : null;
			});
		}
	};
};

export const contentStore = createContentStore();

if (typeof window !== 'undefined') {
  contentStore.fetchContent();
}

export let selectedTopic = writable(null);