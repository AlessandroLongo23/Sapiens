import {
	Atom,
	Backpack,
	Beaker,
	BookOpen,
	Calculator,
	CodeXml,
	Layers,
	LibraryBig,
	Pi,
	School,
	University,
	type LucideIcon
} from 'lucide-react';
import type { ContentNode } from '@/lib/utils/tree';

export type IconComponent = LucideIcon;

/**
 * Icons for content nodes. The database stores no icon, so the icon is chosen
 * from the node's slug and type.
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

const BY_TYPE: Record<string, IconComponent> = { level: LibraryBig, subject: Calculator, chapter: Layers, topic: BookOpen };

export function iconFor(node: Pick<ContentNode, 'slug' | 'type'> | null | undefined): IconComponent {
	if (!node) return LibraryBig;
	return BY_SLUG[node.slug] ?? BY_TYPE[node.type] ?? LibraryBig;
}

/** The colour family of a subject, read by `[data-subject]` in globals.css. */
export type SubjectTone = 'math' | 'physics' | 'chemistry' | 'cs' | 'ink';

const TONE_BY_SLUG: Record<string, SubjectTone> = {
	math: 'math',
	'analisi-1': 'math',
	'analisi-2': 'math',
	physics: 'physics',
	'fisica-1': 'physics',
	'fisica-2': 'physics',
	chemistry: 'chemistry',
	'computer-science': 'cs',
	'fondamenti-informatica': 'cs'
};

/** The tone of the first subject in a trail of nodes (a node and its ancestors), or the ink. */
export function toneFor(...nodes: (Pick<ContentNode, 'slug' | 'type'> | null | undefined)[]): SubjectTone {
	for (const node of nodes) if (node && TONE_BY_SLUG[node.slug]) return TONE_BY_SLUG[node.slug];
	return 'ink';
}
