import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HandLab } from '@/components/lab/HandLab';

/** The hands playground: a development tool to tune how the lab's hands hold each object. Not in production. */
export const metadata: Metadata = { title: 'Mani del laboratorio', robots: { index: false, follow: false } };

export default function ManiPage() {
	if (process.env.NODE_ENV === 'production') notFound();
	return (
		<main id="contenuto">
			<HandLab />
		</main>
	);
}
