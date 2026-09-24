// Node types matching the `content_nodes` table
export type NodeType = 'level' | 'subject' | 'chapter' | 'topic';

export interface ContentNode {
    id: string;
    parent_id: string | null;
    /** Database slug (curated, e.g. `high_school`, `math`, `numeri-naturali`). Public URLs derive from it, see $lib/seo/slug. */
    slug: string;
    /** Raw title, may contain LaTeX (`Numeri naturali \mathbb{N}`). */
    title: string;
    type: NodeType;
    position: number;
    description?: string | null;
    updated_at?: string | null;
    /** Set by the server: the lesson has theory text / a formulary / flashcards. */
    has_theory?: boolean;
    has_formulary?: boolean;
    has_flashcards?: boolean;
    /** Only present on the node being rendered, never on the tree. */
    theory?: string | null;
    formulary?: string | null;
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

/**
 * Walks the tree depth-first, calling `visit` with every node and its ancestors (node included).
 */
export function walkTree(
    tree: ContentNode[],
    visit: (node: ContentNode, ancestors: ContentNode[]) => void,
    ancestors: ContentNode[] = []
): void {
    for (const node of tree) {
        const chain = [...ancestors, node];
        visit(node, chain);
        if (node.children.length > 0) walkTree(node.children, visit, chain);
    }
}
