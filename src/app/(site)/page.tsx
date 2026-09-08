import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { getFlatNodes } from '@/lib/server/content';
import { HeroSection, type HeroCounts } from '@/components/landing/HeroSection';

export const revalidate = 600;

export const metadata: Metadata = pageMetadata({ path: '/' });

/** Counts for the hero, from the same content table the library uses. `published` is the number of lessons with theory text today. */
async function heroCounts(): Promise<HeroCounts> {
	const counts: HeroCounts = { subject: 0, chapter: 0, published: 0 };
	try {
		for (const node of await getFlatNodes()) {
			if (node.type === 'subject') counts.subject++;
			if (node.type === 'chapter') counts.chapter++;
			if (node.type === 'topic' && node.has_theory) counts.published++;
		}
	} catch (err) {
		console.error('landing counts unavailable:', err);
	}
	return counts;
}

export default async function HomePage() {
	return <HeroSection counts={await heroCounts()} />;
}
