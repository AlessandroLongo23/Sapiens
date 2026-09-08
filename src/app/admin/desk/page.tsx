import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { DraftDesk } from '@/components/admin/DraftDesk';

export const metadata: Metadata = pageMetadata({ title: 'Desk | Admin | Sapiens', path: '/admin/desk' });

export default function AdminDeskPage() {
	return <DraftDesk />;
}
