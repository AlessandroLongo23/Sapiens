import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { currentUser } from '@/lib/server/auth';
import { AccountNav } from '@/components/account/AccountNav';
import { Avatar } from '@/components/shell/AccountMenu';
import { displayName } from '@/lib/auth/display-name';

/** The student's account: the sections on the left, the chosen one on the right. */
export default async function AccountLayout({ children }: { children: ReactNode }) {
	const user = await currentUser();
	if (!user) redirect('/');
	return (
		<div className="min-h-screen bg-page-alt">
			<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
				<header className="mb-8 flex items-center gap-4 lg:mb-12">
					<Avatar user={user} name={displayName(user)} className="size-14 text-lg sm:size-16 sm:text-xl" />
					<div className="min-w-0">
						<p className="label-mono text-fg-subtle">Il tuo account</p>
						<h1 className="truncate font-display text-2xl font-semibold tracking-tight text-fg-strong sm:text-3xl">{displayName(user)}</h1>
						<p className="truncate text-sm text-fg-muted">{user.email}</p>
					</div>
				</header>
				<div className="lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16">
					<aside className="mb-8 lg:mb-0">
						<AccountNav />
					</aside>
					<div className="min-w-0 max-w-3xl">{children}</div>
				</div>
			</div>
		</div>
	);
}
