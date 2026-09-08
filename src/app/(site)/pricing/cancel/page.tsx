import type { Metadata } from 'next';
import { XCircle } from 'lucide-react';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { LinkButton } from '@/components/ui/Button';
import { safePath } from '@/lib/utils/safe-path';

export const metadata: Metadata = pageMetadata({ title: 'Pagamento annullato | Sapiens', path: '/pricing/cancel', noindex: true });

export default async function CancelPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
	const next = safePath((await searchParams).next, '/materiale');
	return (
		<div className="flex min-h-[70vh] items-center justify-center p-4">
			<div className="w-full max-w-md rounded-2xl border border-edge bg-surface p-8 text-center">
				<div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-surface-3">
					<XCircle className="size-12 text-fg-subtle" aria-hidden="true" />
				</div>
				<h1 className="mb-4 text-3xl font-bold text-fg">Pagamento annullato</h1>
				<p className="mb-8 text-fg-muted">Nessun addebito è stato effettuato. La teoria resta gratuita: puoi riprovare quando vuoi.</p>
				<div className="space-y-4">
					<LinkButton href="/pricing" size="lg" className="w-full">Torna ai piani</LinkButton>
					<LinkButton href={next} variant="secondary" size="lg" className="w-full">Continua con il piano gratuito</LinkButton>
				</div>
			</div>
		</div>
	);
}
