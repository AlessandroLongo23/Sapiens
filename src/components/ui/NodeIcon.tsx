import { createElement, type ComponentProps } from 'react';
import type { LucideIcon } from 'lucide-react';
import { iconFor } from '@/lib/utils/icons';
import type { ContentNode } from '@/lib/utils/tree';

/** The icon of a content node (by slug and type), rendered with the given props. */
export function NodeIcon({ node, ...props }: { node: Pick<ContentNode, 'slug' | 'type'> } & ComponentProps<LucideIcon>) {
	return createElement(iconFor(node), props);
}
