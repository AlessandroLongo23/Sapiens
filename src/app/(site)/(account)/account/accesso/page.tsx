import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { currentUser } from '@/lib/server/auth';
import { emailVerified } from '@/lib/server/profile';
import { ACCOUNT_ROOT } from '@/lib/config/site';
import { SectionHeader, SettingsGroup } from '@/components/account/Settings';
import { EmailForm, PasswordForm, SignOutEverywhere } from '@/components/account/SecurityForms';
import { VerifyEmail } from '@/components/onboarding/VerifyEmail';

export const metadata: Metadata = pageMetadata({ title: 'Accesso e sicurezza | Sapiens', path: `${ACCOUNT_ROOT}/accesso` });

/** How the student signs in, and a way to sign out of every device. */
export default async function SecurityPage() {
	const user = await currentUser();
	if (!user?.email) return null;
	const verified = await emailVerified(user);
	return (
		<>
			<SectionHeader title="Accesso e sicurezza" lead="L'email e la password con cui entri in Sapiens, e i dispositivi dove sei collegato." />
			<div className="flex flex-col gap-6">
				{!verified && (
					<SettingsGroup title="Conferma la tua email" description="Serve per abbonarti, invitare un amico e scrivere a un tutor.">
						<div className="py-4">
							<VerifyEmail email={user.email} />
						</div>
					</SettingsGroup>
				)}
				<EmailForm email={user.email} />
				<PasswordForm email={user.email} />
				<SignOutEverywhere />
			</div>
		</>
	);
}
