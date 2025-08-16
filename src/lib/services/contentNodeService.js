import { supabase } from '$lib/supabase.js';
import { contentStore } from '$lib/stores/content/content.js';

/**
 * Creates a new content node
 * @param {Object} nodeData - The node data to create
 * @returns {Promise<Object>} - The created node
 */
export async function createContentNode(nodeData) {
    try {
        // Set path if parent node exists
        if (nodeData.parent_id) {
            const parentNode = await getNodeById(nodeData.parent_id);
            
            if (parentNode && parentNode.path) {
                nodeData.path = [...parentNode.path, nodeData.slug];
            } else {
                throw new Error('Parent node not found or has no path');
            }
        } else {
            // Root level nodes
            nodeData.path = [nodeData.slug];
        }
        
        // If child_index not provided, append at end among siblings
        if (typeof nodeData.child_index !== 'number') {
            let maxIndex = -1;
            if (nodeData.parent_id) {
                const { data: siblings, error: sibErr } = await supabase
                    .from('content_nodes')
                    .select('child_index')
                    .eq('parent_id', nodeData.parent_id)
                    .order('child_index', { ascending: false, nullsFirst: false })
                    .limit(1);
                if (!sibErr && siblings && siblings.length > 0 && typeof siblings[0].child_index === 'number') {
                    maxIndex = siblings[0].child_index;
                }
            } else {
                const { data: rootSiblings, error: rootErr } = await supabase
                    .from('content_nodes')
                    .select('child_index')
                    .is('parent_id', null)
                    .order('child_index', { ascending: false, nullsFirst: false })
                    .limit(1);
                if (!rootErr && rootSiblings && rootSiblings.length > 0 && typeof rootSiblings[0].child_index === 'number') {
                    maxIndex = rootSiblings[0].child_index;
                }
            }
            nodeData.child_index = maxIndex + 1;
        }
        
        // Insert the node
        const { data, error } = await supabase
            .from('content_nodes')
            .insert([nodeData])
            .select()
            .single();
            
        if (error) {
            console.error('Error creating content node:', error);
            throw error;
        }
        
        // Refresh content store
        await contentStore.fetchContent();
        
        return data;
    } catch (error) {
        console.error('Error in createContentNode:', error);
        throw error;
    }
}

/**
 * Updates an existing content node
 * @param {string} nodeId - The ID of the node to update
 * @param {Object} nodeData - The updated node data
 * @returns {Promise<Object>} - The updated node
 */
export async function updateContentNode(nodeId, nodeData) {
    try {
        // Get the current node
        const currentNode = await getNodeById(nodeId);
        
        if (!currentNode) {
            throw new Error('Node not found');
        }
        
        // Check if slug changed
        if (nodeData.slug && nodeData.slug !== currentNode.slug) {
            // Update path for this node and all descendants
            const newPath = [...currentNode.path];
            newPath[newPath.length - 1] = nodeData.slug;
            nodeData.path = newPath;
            
            // We would need a database function to update all descendants' paths
            // For now, just show a warning
            console.warn('Changing slug will not update descendants paths automatically');
        }
        
        // Update the node
        const { data, error } = await supabase
            .from('content_nodes')
            .update(nodeData)
            .eq('id', nodeId)
            .select()
            .single();
            
        if (error) {
            console.error('Error updating content node:', error);
            throw error;
        }
        
        // Refresh content store
        await contentStore.fetchContent();
        
        return data;
    } catch (error) {
        console.error('Error in updateContentNode:', error);
        throw error;
    }
}

/**
 * Deletes a content node and all its descendants
 * @param {string} nodeId - The ID of the node to delete
 * @returns {Promise<boolean>} - True if successful
 */
export async function deleteContentNode(nodeId) {
    try {
        // Get all nodes
        const { data: allNodes, error: fetchError } = await supabase
            .from('content_nodes')
            .select('id, path');
            
        if (fetchError) {
            console.error('Error fetching nodes for deletion:', fetchError);
            throw fetchError;
        }
        
        // Find the target node
        const nodeToDelete = allNodes.find(node => node.id === nodeId);
        
        if (!nodeToDelete) {
            throw new Error('Node not found');
        }
        
        // Find all descendants based on path
        const nodesToDelete = allNodes.filter(node => {
            if (!node.path || !nodeToDelete.path) return false;
            
            // A node is a descendant if its path starts with the parent's path
            return node.path.length >= nodeToDelete.path.length && 
                nodeToDelete.path.every((segment, i) => node.path[i] === segment);
        });
        
        // Get IDs of all nodes to delete
        const nodeIds = nodesToDelete.map(node => node.id);
        
        // Delete the nodes
        const { error } = await supabase
            .from('content_nodes')
            .delete()
            .in('id', nodeIds);
            
        if (error) {
            console.error('Error deleting content nodes:', error);
            throw error;
        }
        
        // Refresh content store
        await contentStore.fetchContent();
        
        return true;
    } catch (error) {
        console.error('Error in deleteContentNode:', error);
        throw error;
    }
}

/**
 * Gets a node by ID
 * @param {string} nodeId - The ID of the node to fetch
 * @returns {Promise<Object|null>} - The node or null if not found
 */
export async function getNodeById(nodeId) {
    try {
        const { data, error } = await supabase
            .from('content_nodes')
            .select('*')
            .eq('id', nodeId)
            .single();
            
        if (error) {
            console.error('Error fetching node by ID:', error);
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('Error in getNodeById:', error);
        throw error;
    }
}

/**
 * Gets children of a node
 * @param {string} nodeId - The parent node ID
 * @returns {Promise<Array>} - Array of child nodes
 */
export async function getChildNodes(nodeId) {
    try {
        const { data, error } = await supabase
            .from('content_nodes')
            .select('*')
            .eq('parent_id', nodeId)
            .order('child_index', { ascending: true })
            .order('slug', { ascending: true });
            
        if (error) {
            console.error('Error fetching child nodes:', error);
            throw error;
        }
        
        return data || [];
    } catch (error) {
        console.error('Error in getChildNodes:', error);
        throw error;
    }
}

/**
 * Reorder children for a parent by updating child_index for each child id in order
 * @param {string|null} parentId - The parent node ID (or null for root nodes)
 * @param {Array<string>} orderedChildIds - Child IDs in the desired order
 * @returns {Promise<boolean>} - True if successful
 */
export async function reorderChildNodes(parentId, orderedChildIds) {
    try {
        if (!Array.isArray(orderedChildIds) || orderedChildIds.length === 0) return true;
        
        // Run in a single transaction-like batch by updating sequentially to preserve order
        for (let index = 0; index < orderedChildIds.length; index++) {
            const id = orderedChildIds[index];
            const { error } = await supabase
                .from('content_nodes')
                .update({ child_index: index })
                .eq('id', id);
            if (error) {
                console.error('Error updating child_index for', id, error);
                throw error;
            }
        }
        
        // Refresh
        await contentStore.fetchContent();
        return true;
    } catch (error) {
        console.error('Error in reorderChildNodes:', error);
        throw error;
    }
}
