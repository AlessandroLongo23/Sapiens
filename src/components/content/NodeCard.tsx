import { BookOpen, ChevronRight, FileText } from 'lucide-react';
import type { ContentNode } from '@/lib/utils/tree';
import { countByType } from '@/lib/utils/tree';
import type { IconComponent } from '@/lib/utils/icons';
import { CardLink } from '@/components/ui/Card';
import { NodeIcon } from '@/components/ui/NodeIcon';
import { Latex } from '@/components/ui/Latex';

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const FOOTER_ICON: Record<string, IconComponent> = { level: BookOpen, subject: BookOpen, chapter: FileText };

/** What the card's footer says, per node type; `icon` names the entry of FOOTER_ICON to show. */
function footer(node: ContentNode): { text: string; icon?: string } {
	if (node.type === 'level') return { text: 'Esplora il livello', icon: 'level' };
	if (node.type === 'subject') return { text: 'Esplora la materia', icon: 'subject' };
	if (node.type === 'chapter') return node.children.length ? { text: plural(node.children.length, 'lezione', 'lezioni'), icon: 'chapter' } : { text: 'In arrivo' };
	return node.has_theory !== false ? { text: 'Vai alla lezione' } : { text: 'In arrivo' };
}

/** The counts line under a level's or subject's title. */
function counts(node: ContentNode): string | null {
	if (node.type !== 'level' && node.type !== 'subject') return null;
	const c = countByType(node.children);
	const parts = node.type === 'level' ? [plural(c.subject, 'materia', 'materie'), plural(c.chapter, 'capitolo', 'capitoli')] : [plural(c.chapter, 'capitolo', 'capitoli')];
	return [...parts, plural(c.topic, 'lezione', 'lezioni')].join(' • ');
}

function Title({ node, meta }: { node: ContentNode; meta: string | null }) {
	return (
		<div className="flex flex-col">
			<h3 className={`${node.type === 'level' || node.type === 'subject' ? 'text-xl' : 'line-clamp-2 text-lg'} mb-2 font-bold leading-snug text-fg transition-colors duration-300 group-hover:text-accent-fg`}>
				<Latex content={node.title} />
			</h3>
			{meta && <p className="text-sm text-fg-subtle">{meta}</p>}
		</div>
	);
}

/** A level, subject, chapter or lesson in a grid: icon, title, counts or description, and a footer that says what opening it does. */
export function NodeCard({ node, href }: { node: ContentNode; href: string }) {
	const meta = counts(node);
	const foot = footer(node);
	const FootIcon = foot.icon ? FOOTER_ICON[foot.icon] : null;
	const inline = node.type !== 'topic';
	return (
		<CardLink href={href}>
			<div className="flex flex-1 flex-col p-6">
				<div className={inline ? 'mb-4 flex items-center gap-4' : 'mb-4'}>
					<div className="w-fit rounded-xl bg-surface-2 p-3 text-fg-subtle transition-colors duration-300 group-hover:bg-accent-soft group-hover:text-accent-fg">
						<NodeIcon node={node} className="size-6 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
					</div>
					{inline && <Title node={node} meta={meta} />}
				</div>
				<div className="flex-1">
					{!inline && <Title node={node} meta={meta} />}
					{node.description && <p className="text-sm text-fg-subtle">{node.description}</p>}
				</div>
				<div className="mt-6 flex items-center justify-between border-t border-edge pt-4 text-sm">
					<span className={`flex items-center gap-1.5 transition-colors ${FootIcon ? 'text-fg-subtle group-hover:text-fg-muted' : 'italic text-fg-subtle'}`}>
						{FootIcon && <FootIcon className="size-4" aria-hidden="true" />}
						{foot.text}
					</span>
					<ChevronRight className="size-5 translate-x-2 text-accent-fg opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden="true" />
				</div>
			</div>
		</CardLink>
	);
}
