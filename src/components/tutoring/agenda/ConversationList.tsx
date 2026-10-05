'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { subjectName } from '@/lib/tutoring/config';
import { formatDateTime } from '@/lib/tutoring/time';
import type { Conversation } from '@/lib/server/tutor-agenda';
import { cn } from '@/lib/utils/cn';
import { Count, Empty, Initials } from './Paper';

/**
 * The tutor's conversations, one row a student. Beside an open conversation on a computer; on a phone it is the
 * page before it, and hides while one is open.
 */
export function ConversationList({ conversations }: { conversations: Conversation[] }) {
	const pathname = usePathname();
	const open = pathname !== '/messaggi';
	return (
		<nav aria-label="Conversazioni" className={cn(open && 'max-lg:hidden')}>
			{conversations.length === 0 ? (
				<Empty>Qui trovi gli studenti che hanno accettato l&apos;invito.</Empty>
			) : (
				<ul className="divide-y divide-edge border-y border-edge">
					{conversations.map((c) => {
						const active = pathname === `/messaggi/${c.linkId}`;
						// An open conversation has just been read.
						const unread = active ? 0 : c.unread;
						return (
							<li key={c.linkId} data-conversation={c.name}>
								<Link href={`/messaggi/${c.linkId}`} aria-current={active ? 'page' : undefined} className={cn('flex items-center gap-3 px-2 py-3 transition-colors focus-ring', active ? 'bg-surface-3' : 'hover:bg-surface-2')}>
									<Initials name={c.name} subject={c.subject} size="sm" />
									<span className="min-w-0 flex-1">
										<span className="flex items-baseline justify-between gap-2">
											<span className={cn('truncate text-fg-strong', unread > 0 ? 'font-semibold' : 'font-medium')}>{c.name}</span>
											<Count n={unread} label={unread === 1 ? 'nuovo' : 'nuovi'} />
										</span>
										<span className={cn('block truncate text-sm', unread > 0 ? 'text-fg' : 'text-fg-muted')}>{c.last ? `${c.last.sender === 'tutor' ? 'Tu: ' : ''}${c.last.body}` : c.subject ? subjectName(c.subject) : 'Nessun messaggio'}</span>
										{c.last && <span className="text-xs text-fg-subtle">{formatDateTime(c.last.createdAt)}</span>}
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			)}
		</nav>
	);
}
