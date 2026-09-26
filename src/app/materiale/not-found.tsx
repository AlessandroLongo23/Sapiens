import type { Metadata } from 'next';
import { NOT_FOUND_METADATA } from '@/lib/seo/page-metadata';
import { NotFoundContent } from '@/components/content/NotFoundContent';

export const metadata: Metadata = NOT_FOUND_METADATA;

/** A missing node under the content tree: the 404 inside the library frame. */
export default function NotFound() {
	return <NotFoundContent />;
}
