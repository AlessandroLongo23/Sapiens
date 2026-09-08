import type { Metadata } from 'next';
import { NOT_FOUND_METADATA } from '@/lib/seo/page-metadata';
import { Shell } from '@/components/shell/Shell';
import { getMenuTree } from '@/lib/server/content';
import { NotFoundContent } from '@/components/content/NotFoundContent';

export const metadata: Metadata = NOT_FOUND_METADATA;

/** Addresses that match no route at all; the layouts below have their own copy, rendered inside their frame. */
export default async function NotFound() {
	return (
		<Shell tree={await getMenuTree()}>
			<NotFoundContent />
		</Shell>
	);
}
