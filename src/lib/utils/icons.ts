import {
	Backpack,
	School,
	University,
	Pi,
	Atom,
	Beaker,
	CodeXml,
	Calculator,
	Layers,
	BookOpen,
	LibraryBig
} from 'lucide-svelte';
import type { ContentNode } from '$lib/utils/tree';

export type IconComponent = typeof LibraryBig;

/**
 * Icons for content nodes. The database stores no icon, so the icon is chosen
 * from the node's slug and type (the same mapping the old in-code tree used).
 */
const BY_SLUG: Record<string, IconComponent> = {
	middle_school: Backpack,
	high_school: School,
	university: University,
	math: Pi,
	'analisi-1': Pi,
	'analisi-2': Pi,
	physics: Atom,
	'fisica-1': Atom,
	'fisica-2': Atom,
	chemistry: Beaker,
	'computer-science': CodeXml,
	'fondamenti-informatica': CodeXml
};

const BY_TYPE: Record<string, IconComponent> = {
	level: LibraryBig,
	subject: Calculator,
	chapter: Layers,
	topic: BookOpen
};

export function iconFor(node: Pick<ContentNode, 'slug' | 'type'> | null | undefined): IconComponent {
	if (!node) return LibraryBig;
	return BY_SLUG[node.slug] ?? BY_TYPE[node.type] ?? LibraryBig;
}
