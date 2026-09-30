import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/config/site';
import { Banco } from '@/components/lab/Banco';

/**
 * The vertical slice of the 3D lab: one bench in a painted style, baked light (scripts/lab/build_banco.py), no
 * interface but the notebook. A prototype, out of the search index and of the sitemap.
 */
export const metadata: Metadata = {
	title: `Laboratorio: il solfato di rame | ${SITE_NAME}`,
	description: 'Un banco di laboratorio in 3D, da esplorare in prima persona: sciogli i cristalli di solfato di rame e versa la soluzione.',
	robots: { index: false, follow: false }
};

export default function BancoPage() {
	return (
		<main id="contenuto">
			<Banco />
		</main>
	);
}
