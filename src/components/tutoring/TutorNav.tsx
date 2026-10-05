'use client';

import { CalendarDays, Inbox, LayoutDashboard, MessageCircle, UserPen, Users } from 'lucide-react';
import { SideNav } from '@/components/ui/SideNav';

const LINKS = [
	{ href: '/dashboard', label: 'Riepilogo', icon: LayoutDashboard, badge: null },
	{ href: '/studenti', label: 'Studenti', icon: Users, badge: null },
	{ href: '/calendario', label: 'Calendario', icon: CalendarDays, badge: 'proposals' },
	{ href: '/messaggi', label: 'Messaggi', icon: MessageCircle, badge: 'unread' },
	{ href: '/leads', label: 'Richieste', icon: Inbox, badge: 'requests' },
	{ href: '/profile-editor', label: 'Profilo', icon: UserPen, badge: null }
] as const;

export interface TutorBadges {
	unread: number;
	proposals: number;
	requests: number;
}

/** The tutor area's sections, with the number of what waits for an answer. Before a profile exists, only the editor. */
export function TutorNav({ hasProfile, badges }: { hasProfile: boolean; badges?: TutorBadges }) {
	const items = hasProfile
		? LINKS.map(({ badge, ...link }) => ({ ...link, count: badge && badges ? badges[badge] : 0 }))
		: [{ href: '/profile-editor', label: 'Crea il profilo', icon: UserPen }];
	return <SideNav label="Area tutor" items={items} />;
}
