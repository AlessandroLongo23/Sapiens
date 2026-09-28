import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { passEnd, passOnSale } from '@/lib/stripe/config';
import { getSession } from '@/lib/server/auth';
import { accountPlan } from '@/lib/server/plan';
import { getQuota } from '@/lib/server/zaino';
import { ACCOUNT_ROOT } from '@/lib/config/site';
import { SubscriptionPanel } from '@/components/subscription/SubscriptionPanel';
import { SectionHeader, SettingRow, SettingsGroup } from '@/components/account/Settings';

export const metadata: Metadata = pageMetadata({ title: 'Abbonamento | Sapiens', path: `${ACCOUNT_ROOT}/abbonamento` });

const usage = (used: number, max: number | null) => (max === null ? `${used}, senza limite` : `${used} su ${max}`);

/** The plan in force, payments and receipts, what the free plan's limits leave, and the plans. */
export default async function PlanPage() {
	const { supabase, user } = await getSession();
	if (!user) return null;
	const { plan, source, subscription, passUntil, bonusUntil, trialUntil } = accountPlan(user);
	const quota = await getQuota(supabase, user).catch(() => null);
	return (
		<>
			<SectionHeader title="Abbonamento" lead="Il tuo piano, il metodo di pagamento e le ricevute." />
			<SubscriptionPanel subscription={subscription} state={{ signedIn: true, planId: plan.id, source, passUntil, bonusUntil, trialUntil, passOnSale: passOnSale(), passEnd: passEnd() }} />
			{quota && (
				<div className="mt-12">
					<SettingsGroup title="Nello Zaino" description={quota.unlimited ? 'Con il tuo piano quaderni e note non hanno limite.' : 'Il piano Free ha un quaderno e cinque note; Studio non ha limiti.'}>
						<SettingRow label="Quaderni" hint={usage(quota.notebooks.used, quota.notebooks.max)} />
						<SettingRow label="Note" hint={usage(quota.notes.used, quota.notes.max)} />
					</SettingsGroup>
				</div>
			)}
		</>
	);
}
