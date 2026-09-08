import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { listAllTutors } from '@/lib/server/tutoring-admin';
import { TutorReviewList } from '@/components/admin/TutorReviewList';

export const metadata: Metadata = pageMetadata({ title: 'Tutor | Admin | Sapiens', path: '/admin/tutors' });

/** Staff review of tutor profiles (the proxy already requires the admin role). */
export default async function AdminTutorsPage() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
			<TutorReviewList tutors={await listAllTutors()} />
		</div>
	);
}
