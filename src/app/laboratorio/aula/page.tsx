import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/config/site';
import { Esperimento } from '@/components/lab/Esperimento';

/**
 * The whole school lab (scripts/lab/build_aula.py): the same experiment as /laboratorio, at the player's half of a
 * double desk, in a room with the class and the teacher. A prototype, out of the index and of the sitemap.
 */
export const metadata: Metadata = {
	title: `Laboratorio di chimica: l'aula | ${SITE_NAME}`,
	description: "Il laboratorio di chimica della scuola in 3D, con i compagni e il docente: sciogli l'ossido di rame(II) in acido solforico e fai crescere i cristalli di solfato di rame.",
	robots: { index: false, follow: false }
};

export default function AulaPage() {
	return (
		<main id="contenuto">
			<Esperimento model="/lab/aula.glb" />
		</main>
	);
}
