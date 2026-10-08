import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { currentUser } from '@/lib/server/auth';
import { welcomeStamp, welcomeTopics } from '@/lib/server/onboarding';
import { SIGNUP_PATH, WELCOME_PATH } from '@/lib/onboarding/config';
import { Onboarding } from '@/components/onboarding/Onboarding';

export const metadata: Metadata = pageMetadata({ title: 'Benvenuto | Sapiens', path: WELCOME_PATH, noindex: true });

/**
 * Year and topic for an account that has not said them yet: one made from the dialog in the middle of something
 * else, a student under 14 whose parent has just confirmed, an account older than the onboarding.
 */
export default async function WelcomePage() {
	const user = await currentUser();
	if (!user) redirect(SIGNUP_PATH);
	const { subjects } = await welcomeTopics();
	return <Onboarding subjects={subjects} stamp={welcomeStamp()} signedIn firstName={String(user.user_metadata?.first_name ?? '')} />;
}
