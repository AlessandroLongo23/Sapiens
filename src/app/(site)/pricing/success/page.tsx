import type { Metadata } from 'next';
import { getPlanById } from '@/lib/stripe/config';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { safePath } from '@/lib/utils/safe-path';
import { SuccessStatus } from '@/components/subscription/SuccessStatus';

export const metadata: Metadata = pageMetadata({ title: 'Abbonamento attivato | Sapiens', path: '/pricing/success', noindex: true });

export default async function SuccessPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
	const params = await searchParams;
	const plan = typeof params.plan === 'string' ? params.plan : '';
	return (
		<div className="flex min-h-[70vh] items-center justify-center p-4">
			<SuccessStatus next={safePath(params.next, '/subscription')} planName={getPlanById(plan).name} />
		</div>
	);
}
