import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Search } from 'lucide-react';
import { TUTORING_ROOT } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { currentUser } from '@/lib/server/auth';
import { listStudentRequests } from '@/lib/server/tutoring-admin';
import { StudentRequests } from '@/components/tutoring/StudentRequests';

export const metadata: Metadata = pageMetadata({ title: 'Le tue richieste | Sapiens', path: '/richieste' });

/** The signed-in student's requests to tutors. */
export default async function RequestsPage() {
	const user = await currentUser();
	if (!user) redirect('/');
	const requests = await listStudentRequests(user.id);
	return (
		<div className="min-h-screen bg-page-alt">
			<div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
				<header className="mb-6 flex flex-wrap items-end justify-between gap-4">
					<div>
						<h1 className="text-3xl font-bold text-fg">Le tue richieste</h1>
						<p className="mt-1 text-fg-muted">Il tutor ha 48 ore per rispondere. Se accetta, qui trovi i suoi contatti.</p>
					</div>
					<Link href={TUTORING_ROOT} className="inline-flex items-center gap-2 text-sm font-medium text-accent-fg hover:underline">
						<Search className="size-4" aria-hidden="true" />
						Cerca un tutor
					</Link>
				</header>
				<StudentRequests requests={requests} />
			</div>
		</div>
	);
}
