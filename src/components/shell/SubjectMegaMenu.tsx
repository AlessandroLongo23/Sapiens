'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import type { ContentNode } from '@/lib/utils/tree';
import { nodePath, plainTitle } from '@/lib/seo/slug';
import { cn } from '@/lib/utils/cn';

/** The level's subjects down the left, the hovered subject's chapters and first lessons across the right. Opened from the keyboard, the first subject takes focus. */
export function SubjectMegaMenu({ level, onClose, autoFocus = false, columns = 5, topicsPerChapter = 4 }: { level: ContentNode; onClose: () => void; autoFocus?: boolean; columns?: number; topicsPerChapter?: number }) {
	const [subject, setSubject] = useState<ContentNode | null>(level.children[0] ?? null);
	const [shownLevel, setShownLevel] = useState(level);
	const root = useRef<HTMLElement>(null);
	if (level !== shownLevel) {
		setShownLevel(level);
		setSubject(level.children[0] ?? null);
	}
	const chapters = subject?.children ?? [];
	useEffect(() => {
		if (autoFocus) root.current?.querySelector<HTMLElement>('a[href]')?.focus();
	}, [autoFocus, level]);

	return (
		<nav ref={root} className="max-h-[80vh] w-full animate-drop-in overflow-hidden border-b border-t border-edge bg-surface shadow-lg" aria-label={`Materie di ${level.title}`}>
			<div className="border-b border-edge bg-surface-2 px-8 py-5">
				<p className="text-xl font-semibold text-fg">{level.title}</p>
			</div>
			<div className="flex min-h-[400px] overflow-hidden">
				<div className="w-1/6 border-r border-edge bg-surface-2/50">
					{level.children.map((s) => (
						<Link
							key={s.id}
							href={nodePath([level, s])}
							onClick={onClose}
							onMouseEnter={() => setSubject(s)}
							onFocus={() => setSubject(s)}
							className={cn('flex w-full items-center gap-2 border-l-3 px-6 py-4 text-left text-base font-medium transition-all hover:bg-surface hover:text-accent-fg', subject?.id === s.id ? 'border-accent bg-surface text-accent-fg' : 'border-transparent text-fg-muted')}
						>
							{s.title}
						</Link>
					))}
				</div>
				<div className="h-full flex-1 overflow-y-auto p-8">
					{subject && (
						<div style={{ columnCount: columns, columnGap: '1.5rem' }}>
							{chapters.map((chapter, index) => {
								const topics = chapter.children;
								const shown = topics.length === topicsPerChapter + 1 ? topics : topics.slice(0, topicsPerChapter);
								return (
									<div key={chapter.id} className="mb-8 flex flex-col gap-4" style={{ breakInside: 'avoid' }}>
										<Link href={nodePath([level, subject, chapter])} onClick={onClose} className="group relative flex items-center gap-2 text-fg">
											<span className="line-clamp-1 font-semibold">{index + 1}. {plainTitle(chapter.title)}</span>
											<span className="absolute -bottom-2 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-accent opacity-0 transition-all group-hover:w-full group-hover:opacity-100" aria-hidden="true" />
										</Link>
										<div className="flex flex-col gap-1.5">
											{shown.map((topic) => (
												<Link key={topic.id} href={nodePath([level, subject, chapter, topic])} onClick={onClose} className="group rounded-lg py-1.5 ps-0 pe-3 text-sm transition-all hover:bg-surface-3 hover:ps-3">
													<span className="line-clamp-1 text-fg-muted group-hover:text-accent-fg">{plainTitle(topic.title)}</span>
												</Link>
											))}
											{topics.length > topicsPerChapter + 1 && (
												<Link href={nodePath([level, subject, chapter])} onClick={onClose} className="flex items-center py-1.5 text-xs text-fg-subtle hover:text-accent-fg">
													<Plus className="size-3" aria-hidden="true" />
													<span>{topics.length - topicsPerChapter} lezioni</span>
												</Link>
											)}
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</nav>
	);
}
