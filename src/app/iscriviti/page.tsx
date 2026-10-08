import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { currentUser } from '@/lib/server/auth';
import { welcomeStamp, welcomeTopics } from '@/lib/server/onboarding';
import { SIGNUP_PATH, WELCOME_PATH } from '@/lib/onboarding/config';
import { Onboarding } from '@/components/onboarding/Onboarding';

export const metadata: Metadata = pageMetadata({
	title: 'Iscriviti a Sapiens',
	description: 'Dicci chi sei e cosa stai studiando: Sapiens ti porta alla lezione giusta e ai suoi esercizi.',
	path: SIGNUP_PATH,
	noindex: true
});

/** The way in for a new visitor, outside the site's frame: one question a screen, the account last. */
export default async function SignUpPage() {
	if (await currentUser()) redirect(WELCOME_PATH);
	const { subjects } = await welcomeTopics();
	return <Onboarding subjects={subjects} stamp={welcomeStamp()} />;
}
