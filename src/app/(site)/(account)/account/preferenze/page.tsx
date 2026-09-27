import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { ACCOUNT_ROOT } from '@/lib/config/site';
import { SectionHeader } from '@/components/account/Settings';
import { AppearanceSettings, ZainoSettings } from '@/components/account/Preferences';

export const metadata: Metadata = pageMetadata({ title: 'Preferenze | Sapiens', path: `${ACCOUNT_ROOT}/preferenze` });

/** How Sapiens looks and behaves. These choices live in the browser, so each device keeps its own. */
export default function PreferencesPage() {
	return (
		<>
			<SectionHeader title="Preferenze" lead="Come si presenta Sapiens. Le scelte valgono su questo dispositivo: sul telefono puoi tenerne altre." />
			<div className="flex flex-col gap-6">
				<AppearanceSettings />
				<ZainoSettings />
			</div>
		</>
	);
}
