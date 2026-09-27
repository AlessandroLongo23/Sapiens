import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { currentUser } from '@/lib/server/auth';
import { ACCOUNT_ROOT } from '@/lib/config/site';
import { ProfileForm } from '@/components/account/ProfileForm';
import { SectionHeader, SettingRow, SettingsGroup } from '@/components/account/Settings';

export const metadata: Metadata = pageMetadata({ title: 'Profilo | Sapiens', path: ACCOUNT_ROOT });

const longDate = (iso: string) => new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' }).format(new Date(iso));

/** The account's first section: who the student is to Sapiens. */
export default async function ProfilePage() {
	const user = await currentUser();
	if (!user) return null;
	return (
		<>
			<SectionHeader title="Profilo" lead="Il nome e l’email con cui ti sei iscritto. Per l’account Sapiens non chiede altro." />
			<div className="flex flex-col gap-6">
				<ProfileForm user={user} />
				<SettingsGroup title="Iscrizione">
					<SettingRow label="Iscritto dal" hint={longDate(user.created_at)} />
					{user.last_sign_in_at && <SettingRow label="Ultimo accesso" hint={longDate(user.last_sign_in_at)} />}
				</SettingsGroup>
			</div>
		</>
	);
}
