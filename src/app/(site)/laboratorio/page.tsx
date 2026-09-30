import type { Metadata } from 'next';
import { FlaskConical } from 'lucide-react';
import { SITE_NAME } from '@/lib/config/site';
import { HOME_CRUMB } from '@/components/content/Breadcrumb';
import { Page, PageHeader } from '@/components/content/PageHeader';
import { LabsGate } from '@/components/lab/menu/LabsGate';
import { TapedPhoto } from '@/components/lab/menu/TapedPhoto';

/**
 * The labs menu: which lab, which experiment, alone or with the class (src/components/lab/menu/LabMenu.tsx). The
 * session itself runs full screen at /laboratorio/<lab>/<experiment>. A prototype, out of the index.
 */
export const metadata: Metadata = {
	title: `Laboratori 3D | ${SITE_NAME}`,
	description: 'Esperimenti di chimica in un laboratorio 3D, da soli o con tutta la classe: scegli il laboratorio, l’esperimento e come lavorare.',
	robots: { index: false, follow: false }
};

export default function LaboratorioPage() {
	return (
		<Page>
			<PageHeader
				crumbs={[HOME_CRUMB, { label: 'Laboratori', icon: FlaskConical }]}
				eyebrow="LABORATORI 3D"
				title="Laboratori"
				lead="Esperimenti veri, con le mani, in un laboratorio che si apre nel browser: da soli al computer, o con tutta la classe e il docente alla LIM. Anche nelle scuole che un laboratorio non ce l'hanno."
				figure={<Snapshot />}
			/>
			<LabsGate />
		</Page>
	);
}

/** A photo of the lab, taped to the page a little crooked, like the sketch on the home page. */
function Snapshot() {
	return (
		<TapedPhoto
			src="/lab/copertine/aula-finestre.webp"
			alt="L'aula di chimica in 3D: i banchi da due, la lavagna, la cappa aspirante"
			caption="l'aula di chimica, dal fondo"
			tilt={2.5}
			priority
			sizes="26rem"
			className="hidden w-[22rem] shrink-0 lg:block xl:w-[26rem]"
		/>
	);
}
