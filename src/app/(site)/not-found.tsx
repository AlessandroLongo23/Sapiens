import type { Metadata } from 'next';
import { NOT_FOUND_METADATA } from '@/lib/seo/page-metadata';
import { NotFoundContent } from '@/components/content/NotFoundContent';

export const metadata: Metadata = NOT_FOUND_METADATA;

/** A missing tutor or page under the site frame. */
export default function NotFound() {
	return <NotFoundContent />;
}
