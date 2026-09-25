import type { Metadata } from 'next';
import { Sun } from 'lucide-react';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { OGGI_ROOT } from '@/lib/config/site';
import { Features } from '@/lib/stripe/config';
import { hasFeature } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { freeQuestionsLeft, practiceStatus } from '@/lib/server/exercises';
import { HOME_CRUMB } from '@/components/content/Breadcrumb';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { TodayInvite } from '@/components/today/TodayInvite';
import { TodayScreen } from '@/components/today/TodayScreen';

export const metadata: Metadata = pageMetadata({ title: 'Oggi | Sapiens', path: OGGI_ROOT, noindex: true });

/** The student's own day: rendered per request. Visitors without an account see what it holds and the way in. */
export const dynamic = 'force-dynamic';

const TODAY = new Intl.DateTimeFormat('it-IT', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Rome' });

export default async function OggiPage() {
	const user = await currentUser();
	const limited = !!user && !hasFeature(user, Features.EXERCISES);
	const [status, left] = user ? await Promise.all([practiceStatus(user.id), limited ? freeQuestionsLeft(user.id) : Promise.resolve(1)]) : [null, 0];
	const date = TODAY.format(new Date());

	return (
		<Page width="medium">
			<PageHeader crumbs={[HOME_CRUMB, { label: 'Oggi' }]} icon={Sun} eyebrow={date.charAt(0).toUpperCase() + date.slice(1)} title="Oggi" />
			{status ? <TodayScreen streak={status.streak} week={status.week} practice={status.practice} blocked={limited && left === 0} /> : <TodayInvite />}
		</Page>
	);
}
