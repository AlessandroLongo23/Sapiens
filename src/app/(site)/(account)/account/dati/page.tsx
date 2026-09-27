import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { currentUser } from '@/lib/server/auth';
import { subscriptionOf } from '@/lib/auth/entitlements';
import { ACCOUNT_ROOT } from '@/lib/config/site';
import { LEGAL } from '@/lib/config/legal';
import { SectionHeader, SettingRow, SettingsGroup } from '@/components/account/Settings';
import { CookieSettings, DeleteAccount, ExportData } from '@/components/account/DataControls';

export const metadata: Metadata = pageMetadata({ title: 'Privacy e dati | Sapiens', path: `${ACCOUNT_ROOT}/dati` });

const day = (iso: unknown) =>
	typeof iso === 'string' ? new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' }).format(new Date(iso)) : null;

const link = 'font-medium text-accent-fg underline-offset-2 hover:underline rounded focus-ring';

/** What the student agreed to, and their data: cookies, a copy of everything, erasure (arts. 15, 17 and 20 GDPR). */
export default async function DataPage() {
	const user = await currentUser();
	if (!user?.email) return null;
	const legal = (user.user_metadata?.legal ?? {}) as { terms?: string; privacy?: string; accepted_at?: string };
	const accepted = day(legal.accepted_at);
	const { subscriptionId, status } = subscriptionOf(user);
	return (
		<>
			<SectionHeader title="Privacy e dati" lead="Cosa hai accettato, i cookie e i dati che Sapiens conserva su di te: puoi scaricarli o cancellarli quando vuoi." />
			<div className="flex flex-col gap-6">
				<SettingsGroup title="Documenti accettati" description="Li hai accettati quando ti sei iscritto.">
					<SettingRow label={<Link href="/terms" className={link}>Termini di servizio</Link>} hint={legal.terms ? `Versione del ${day(legal.terms)}${accepted ? `, accettata il ${accepted}` : ''}` : 'Accettati alla registrazione'} />
					<SettingRow label={<Link href="/privacy" className={link}>Informativa sulla privacy</Link>} hint={legal.privacy ? `Versione del ${day(legal.privacy)}${accepted ? `, accettata il ${accepted}` : ''}` : 'Accettata alla registrazione'} />
					<SettingRow label="Età" hint={`Hai dichiarato di avere almeno ${LEGAL.digitalConsentAge} anni, o che l'account l'ha creato un genitore.`} />
				</SettingsGroup>
				<CookieSettings />
				<ExportData />
				<DeleteAccount email={user.email} subscribed={!!subscriptionId && !['canceled', 'incomplete_expired'].includes(status)} />
			</div>
		</>
	);
}
