import type { Component } from 'svelte';

// Node types matching your database schema
export type NodeType = 'level' | 'subject' | 'chapter' | 'topic';

export interface ContentNode {
    id: string;
    parent_id: string | null;
    slug: string;
    title: string;
    type: NodeType;
    position: number;
    icon?: string | Component;
    description?: string;
    children: ContentNode[];
}

/**
 * Reconstructs a tree structure from a flat array of nodes.
 * Nodes are linked by parent_id, and children are sorted by position.
 */
export function reconstructTree(nodes: Omit<ContentNode, 'children'>[]): ContentNode[] {
    if (!nodes?.length) return [];

    const nodeMap = new Map<string, ContentNode>();
    const rootNodes: ContentNode[] = [];

    // First pass: create all nodes with empty children arrays
    for (const node of nodes) {
        nodeMap.set(node.id, { ...node, children: [] });
    }

    // Second pass: link children to parents
    for (const node of nodes) {
        const nodeWithChildren = nodeMap.get(node.id)!;
        
        if (node.parent_id == null) {
            rootNodes.push(nodeWithChildren);
        } else {
            const parent = nodeMap.get(node.parent_id);
            if (parent) {
                parent.children.push(nodeWithChildren);
            } else {
                // Orphaned node - treat as root
                rootNodes.push(nodeWithChildren);
            }
        }
    }

    // Sort children by position at each level
    const sortChildren = (nodes: ContentNode[]) => {
        nodes.sort((a, b) => a.position - b.position);
        for (const node of nodes) {
            if (node.children.length > 0) {
                sortChildren(node.children);
            }
        }
    };

    sortChildren(rootNodes);
    return rootNodes;
}

/**
 * Finds a node in the tree by traversing the slug path.
 * Returns the node and the path of ancestors.
 */
export function findNodeByPath(
    tree: ContentNode[],
    slugPath: string[]
): { node: ContentNode | null; ancestors: ContentNode[] } {
    let currentLayer = tree;
    const ancestors: ContentNode[] = [];
    let currentNode: ContentNode | null = null;

    for (const slug of slugPath) {
        currentNode = currentLayer.find(n => n.slug === slug) ?? null;
        if (!currentNode) {
            return { node: null, ancestors };
        }
        ancestors.push(currentNode);
        currentLayer = currentNode.children;
    }

    return { node: currentNode, ancestors };
}

/**
 * Finds a node anywhere in the tree by its ID.
 */
export function findNodeById(tree: ContentNode[], id: string): ContentNode | null {
    for (const node of tree) {
        if (node.id === id) return node;
        if (node.children.length > 0) {
            const found = findNodeById(node.children, id);
            if (found) return found;
        }
    }
    return null;
}

/**
 * Gets all nodes of a specific type from the tree.
 */
export function getNodesByType(tree: ContentNode[], type: NodeType): ContentNode[] {
    const results: ContentNode[] = [];
    
    const traverse = (nodes: ContentNode[]) => {
        for (const node of nodes) {
            if (node.type === type) {
                results.push(node);
            }
            traverse(node.children);
        }
    };
    
    traverse(tree);
    return results;
}

/**
 * Counts nodes by type in the tree.
 */
export function countByType(tree: ContentNode[]): Record<NodeType, number> {
    const counts: Record<NodeType, number> = {
        level: 0,
        subject: 0,
        chapter: 0,
        topic: 0
    };

    const traverse = (nodes: ContentNode[]) => {
        for (const node of nodes) {
            counts[node.type]++;
            traverse(node.children);
        }
    };

    traverse(tree);
    return counts;
}


