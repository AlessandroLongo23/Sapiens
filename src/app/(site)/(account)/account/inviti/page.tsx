import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { currentUser } from '@/lib/server/auth';
import { inviteSummary } from '@/lib/server/referrals';
import { planOf } from '@/lib/auth/entitlements';
import { REFERRAL } from '@/lib/referrals/config';
import { TRIAL_DAYS, formatDay } from '@/lib/stripe/config';
import { ACCOUNT_ROOT, SITE_URL } from '@/lib/config/site';
import { AdultDeclaration, ClaimInvite, InviteLink } from '@/components/account/InviteLink';
import { SectionHeader, SettingRow, SettingsGroup } from '@/components/account/Settings';

export const metadata: Metadata = pageMetadata({ title: 'Invita un amico | Sapiens', path: `${ACCOUNT_ROOT}/inviti` });

const euros = (cents: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(cents / 100);

/**
 * Invite a friend (vault/Decisioni/2026-09-28 Porta un amico premia l'attivazione con 30 giorni di Studio.md), for
 * adults only (vault/Decisioni/2026-09-28 Porta un amico solo per i maggiorenni.md): the link, made after the
 * declaration, what it has brought, in counts only, and a field for a code received after signing up. The words
 * avoid "premio" and "regalo": the days are a discount on the same service (MIMIT, FAQ 66 on DPR 430/2001).
 */
export default async function InvitesPage() {
	const user = await currentUser();
	if (!user) return null;
	const summary = await inviteSummary(user);
	const subscribed = planOf(user).source === 'subscription';
	const left = Math.max(0, REFERRAL.rewardsPerYear - summary.rewardsThisYear);
	const earned = subscribed ? `${euros(REFERRAL.creditCents)} di credito sulla prossima fattura` : `${REFERRAL.rewardDays} giorni di Studio gratis`;
	return (
		<>
			<SectionHeader
				title="Invita un amico"
				lead={`Chi si iscrive con il tuo link ha ${REFERRAL.trialDays} giorni di prova di Studio invece di ${TRIAL_DAYS}. Quando finisce la sua prima prova di esercizi, tu hai ${earned}, per ${REFERRAL.rewardsPerYear} amici in ogni anno scolastico.`}
			/>
			<div className="flex flex-col gap-6">
				{summary.code ? <InviteLink url={`${SITE_URL}/?${REFERRAL.param}=${summary.code}`} code={summary.code} /> : <AdultDeclaration />}
				{summary.code && (
					<SettingsGroup title="I tuoi inviti" description="Vedi solo quanti sono, non chi: i nomi dei tuoi amici restano loro.">
						<SettingRow label="Amici iscritti con il tuo link" hint={String(summary.joined)} />
						<SettingRow label="Hanno finito la prima prova" hint={String(summary.activated)} />
						<SettingRow label="Inviti che contano quest'anno scolastico" hint={left > 0 ? `${summary.rewardsThisYear} su ${REFERRAL.rewardsPerYear}: ne restano ${left}` : `${REFERRAL.rewardsPerYear} su ${REFERRAL.rewardsPerYear}: dal 1° settembre si ricomincia`} />
						{summary.bonusUntil && <SettingRow label="Studio grazie agli inviti" hint={`Fino al ${formatDay(summary.bonusUntil)}`} />}
						{summary.pendingCredits > 0 && <SettingRow label="Credito in arrivo" hint={`${euros(summary.pendingCredits * REFERRAL.creditCents)}, tolto dalla prossima fattura`} />}
					</SettingsGroup>
				)}
				{summary.canClaim && <ClaimInvite />}
			</div>
		</>
	);
}
