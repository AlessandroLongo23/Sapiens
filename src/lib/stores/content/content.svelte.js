import { supabase } from '$lib/supabase.js';

// Create a class for managing content
class ContentManager {
  contentTree = $state({});
  flatNodes = $state([]);
  loading = $state(true);
  error = $state(null);
  selectedNode = $state(null);
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.fetchContent();
      
      // Subscribe to realtime changes
      const subscription = supabase
        .channel('content_nodes_changes')
        .on('postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'content_nodes'
          },
          () => {
            this.fetchContent();
          }
        )
        .subscribe();
    }
  }
  
  // Build tree structure from flat array
  buildContentTree(nodes, parentId = null) {
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
      const grandChildren = this.buildContentTree(nodes, child.id);
      
      if (grandChildren.length > 0) {
        child.children = grandChildren;
      }
      
      result.push(child);
    }
    
    return result;
  }

  // Get all content and build the tree
  async fetchContent() {
    this.loading = true;
    
    try {
      const { data, error } = await supabase
        .from('content_nodes')
        .select('*')
        .order('path', { ascending: true });

      if (error) throw error;

      this.flatNodes = data;
      this.contentTree = this.buildContentTree(data);
      this.error = null;
    } catch (error) {
      console.error('Error fetching content:', error);
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }

  // Get a node by ID
  getNodeById(id) {
    return this.flatNodes.find(node => node.id === id);
  }

  // Get a node by path
  getNodeByPath(path) {
    if (!Array.isArray(path)) {
      path = [path]; // Convert string to array if needed
    }
    
    return this.flatNodes.find(node => 
      node.path && 
      node.path.length === path.length && 
      node.path.every((segment, index) => segment === path[index])
    );
  }

  // Get all children of a node
  getChildrenOf(parentId) {
    return this.flatNodes.filter(node => node.parent_id === parentId);
  }

  // Get nodes by type
  getNodesByType(nodeType) {
    return this.flatNodes.filter(node => node.node_type === nodeType);
  }

  // Get the full path to a node as an array of node objects
  getPathToNode(nodeId) {
    const node = this.getNodeById(nodeId);
    if (!node || !node.path) return [];
    
    return node.path.map((pathSegment, index) => {
      const pathSoFar = node.path.slice(0, index + 1);
      return this.getNodeByPath(pathSoFar);
    }).filter(Boolean);
  }

  // Select a node
  selectNode(nodeId) {
    this.selectedNode = nodeId ? this.getNodeById(nodeId) : null;
  }

  // Add a content node
  async addContentNode(contentNode) {
    try {
      // If it's a child node, calculate its path
      if (contentNode.parent_id) {
        const parent = this.getNodeById(contentNode.parent_id);
        if (parent && parent.path) {
          contentNode.path = [...parent.path, contentNode.slug];
        }
      } else {
        // Root node
        contentNode.path = [contentNode.slug];
      }

      const { data, error } = await supabase
        .from('content_nodes')
        .insert([contentNode])
        .select()
        .single();
        
      if (error) throw error;
      
      // Refresh the content
      await this.fetchContent();
      return data;
    } catch (error) {
      console.error('Error adding content node:', error);
      throw new Error('Impossibile aggiungere il nodo di contenuto.');
    }
  }

  // Update a content node
  async updateContentNode(nodeId, updatedNode) {
    try {
      // Don't allow changing the path directly
      if (updatedNode.path) {
        delete updatedNode.path;
      }
      
      // If slug is changing, we need to update the path
      if (updatedNode.slug) {
        const currentNode = this.getNodeById(nodeId);
        if (currentNode && currentNode.path && currentNode.path.length > 0) {
          // Create a new path with the updated slug
          const newPath = [...currentNode.path];
          newPath[newPath.length - 1] = updatedNode.slug;
          updatedNode.path = newPath;
          
          // We also need to update all children's paths
          // This would be done via a database function in production
        }
      }

      const { data, error } = await supabase
        .from('content_nodes')
        .update(updatedNode)
        .eq('id', nodeId)
        .select()
        .single();

      if (error) throw error;
      
      // Refresh the content
      await this.fetchContent();
      return data;
    } catch (error) {
      console.error('Error updating content node:', error);
      throw new Error('Impossibile aggiornare il nodo di contenuto.');
    }
  }

  // Delete a content node and all its children
  async deleteContentNode(nodeId) {
    try {
      const nodeToDelete = this.getNodeById(nodeId);
      if (!nodeToDelete) {
        throw new Error('Node not found');
      }
      
      // This should be handled by the database with cascading deletes,
      // but we're implementing it here for safety
      const nodesToDelete = this.flatNodes.filter(node => 
        node.path && 
        node.path.length >= nodeToDelete.path.length &&
        nodeToDelete.path.every((segment, index) => node.path[index] === segment)
      );
      
      const nodeIds = nodesToDelete.map(node => node.id);
      
      const { error } = await supabase
        .from('content_nodes')
        .delete()
        .in('id', nodeIds);
        
      if (error) throw error;
      
      // Refresh the content
      await this.fetchContent();
      return true;
    } catch (error) {
      console.error('Error deleting content node:', error);
      throw new Error('Impossibile eliminare il nodo di contenuto.');
    }
  }
}

// Create and export a singleton instance
export const contentManager = new ContentManager();
