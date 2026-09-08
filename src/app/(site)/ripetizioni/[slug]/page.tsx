import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BadgeCheck, Clock, GraduationCap, MapPin, Monitor } from 'lucide-react';
import { SITE_NAME, TUTORING_ROOT } from '@/lib/config/site';
import { metadataOr404, pageMetadata } from '@/lib/seo/page-metadata';
import { getTutorBySlug } from '@/lib/server/tutoring';
import { formatRate, levelName, subjectName, tutorDisplayName, whereLine } from '@/lib/tutoring/config';
import { Breadcrumb, HOME_CRUMB, TUTORING_CRUMB } from '@/components/content/Breadcrumb';
import { Page } from '@/components/content/PageHeader';
import { TutorAvatar } from '@/components/tutoring/TutorAvatar';
import { RequestForm } from '@/components/tutoring/RequestForm';

export const revalidate = 600;

/** No params are prerendered at build; each address renders on first request and is then served from the cache (see `revalidate` above). */
export function generateStaticParams() {
	return [];
}

type Params = { params: Promise<{ slug: string }> };

async function load({ params }: Params) {
	const tutor = await getTutorBySlug((await params).slug);
	if (!tutor) notFound();
	return tutor;
}

export function generateMetadata(props: Params): Promise<Metadata> {
	return metadataOr404(async () => {
		const tutor = await load(props);
		const name = tutorDisplayName(tutor);
		const rate = formatRate(tutor.hourly_rate);
		return pageMetadata({
			title: `${name}, ripetizioni di ${tutor.subjects.slice(0, 3).map(subjectName).join(', ')} | ${SITE_NAME}`,
			description: `${name}: ${tutor.headline || 'tutor su Sapiens'}. ${whereLine(tutor)}${rate ? `, ${rate} indicativi` : ''}. Livelli: ${tutor.levels.map(levelName).join(', ')}. Chiedi aiuto e organizzate le lezioni tra voi.`,
			path: `${TUTORING_ROOT}/${tutor.slug}`,
			type: 'article'
		});
	});
}

export default async function TutorPage(props: Params) {
	const tutor = await load(props);
	const name = tutorDisplayName(tutor);
	const rate = formatRate(tutor.hourly_rate);
	const onlineOnly = tutor.modes.includes('online') && !tutor.modes.includes('in_person');
	const Where = onlineOnly ? Monitor : MapPin;
	const paragraphs = tutor.bio.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
	const facts = [
		{ icon: Where, label: 'Dove', value: whereLine(tutor) },
		tutor.education && { icon: GraduationCap, label: 'Formazione', value: tutor.education },
		tutor.years_experience > 0 && { icon: Clock, label: 'Esperienza', value: `${tutor.years_experience} ${tutor.years_experience === 1 ? 'anno' : 'anni'} di ripetizioni` }
	].filter((f): f is { icon: typeof Clock; label: string; value: string } => !!f);

	return (
		<Page width="medium">
			<Breadcrumb items={[HOME_CRUMB, TUTORING_CRUMB, { label: name, path: `${TUTORING_ROOT}/${tutor.slug}` }]} />
			<div className="grid items-start gap-8 lg:grid-cols-[1fr_minmax(20rem,26rem)] lg:gap-10">
				<article className="space-y-8">
					<header className="flex flex-col gap-5 sm:flex-row sm:items-start">
						<TutorAvatar tutor={tutor} size="lg" />
						<div className="min-w-0 space-y-3">
							<div>
								<div className="flex flex-wrap items-center gap-2">
									<h1 className="text-3xl font-bold tracking-tight text-fg-strong sm:text-4xl">{name}</h1>
									{tutor.verified && (
										<span className="inline-flex items-center gap-1 rounded-full border border-info-edge bg-info-soft px-2.5 py-0.5 text-sm font-medium text-info-fg">
											<BadgeCheck className="size-4" aria-hidden="true" />
											Identità verificata
										</span>
									)}
								</div>
								{tutor.headline && <p className="mt-1 text-lg text-fg-muted">{tutor.headline}</p>}
							</div>
							<dl className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg-muted">
								{facts.map(({ icon: Icon, label, value }) => (
									<div key={label} className="flex items-center gap-1.5">
										<Icon className="size-4 text-fg-faint" aria-hidden="true" />
										<dt className="sr-only">{label}</dt>
										<dd>{value}</dd>
									</div>
								))}
							</dl>
							{rate && (
								<p className="text-fg">
									<span className="text-2xl font-semibold">{rate}</span>
									<span className="ml-1 text-sm text-fg-subtle">prezzo indicativo, da concordare con il tutor</span>
								</p>
							)}
						</div>
					</header>
					<section aria-labelledby="materie" className="space-y-3">
						<h2 id="materie" className="text-lg font-semibold text-fg">Materie e livelli</h2>
						<ul className="flex flex-wrap gap-2" aria-label="Materie">
							{tutor.subjects.map((s) => <li key={s} className="rounded-full border border-edge bg-surface px-3 py-1.5 text-sm font-medium text-fg">{subjectName(s)}</li>)}
						</ul>
						<ul className="flex flex-wrap gap-2" aria-label="Livelli">
							{tutor.levels.map((l) => <li key={l} className="rounded-full border border-accent-edge bg-accent-soft px-3 py-1.5 text-sm text-accent-soft-fg">{levelName(l)}</li>)}
						</ul>
					</section>
					{paragraphs.length > 0 && (
						<section aria-labelledby="presentazione" className="space-y-3">
							<h2 id="presentazione" className="text-lg font-semibold text-fg">Presentazione</h2>
							<div className="prose prose-zinc max-w-none dark:prose-invert">
								{paragraphs.map((p, i) => <p key={i}>{p}</p>)}
							</div>
						</section>
					)}
					<Link href={TUTORING_ROOT} className="inline-flex items-center gap-2 text-sm text-fg-muted transition-colors hover:text-accent-fg">
						<ArrowLeft className="size-4" aria-hidden="true" />
						Tutti i tutor
					</Link>
				</article>
				<aside className="space-y-4 rounded-2xl border border-edge bg-surface p-5 sm:p-6 lg:sticky lg:top-6" aria-labelledby="chiedi-aiuto">
					<div>
						<h2 id="chiedi-aiuto" className="text-xl font-semibold text-fg">Chiedi aiuto a {name}</h2>
						<p className="mt-1 text-sm text-fg-muted">Il tutor riceve il messaggio, non i tuoi contatti, e ha 48 ore per accettare.</p>
					</div>
					<RequestForm tutor={tutor} compact />
				</aside>
			</div>
		</Page>
	);
}
