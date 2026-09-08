import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { tutorArea } from '@/lib/server/tutor-area';
import { ProfileEditor } from '@/components/tutoring/ProfileEditor';

export const metadata: Metadata = pageMetadata({ title: 'Il profilo tutor | Sapiens', path: '/profile-editor' });

export default async function ProfileEditorPage() {
	const { user, tutor } = await tutorArea();
	return <ProfileEditor tutor={tutor} user={user && { email: user.email, user_metadata: user.user_metadata }} />;
}
