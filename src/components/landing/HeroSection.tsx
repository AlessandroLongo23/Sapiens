import Image from 'next/image';
import { BookOpen, GraduationCap } from 'lucide-react';
import { PenStroke } from '@/components/content/PageHeader';
import { Stat } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { AnimatedCounter } from './AnimatedCounter';
import landing from '@/assets/landing.png';

export interface HeroCounts {
	subject: number;
	chapter: number;
	published: number;
}

/** The landing hero: the promise, two calls to action, live content figures and the desktop screenshot. */
export function HeroSection({ counts }: { counts: HeroCounts }) {
	// Content figures only, straight from the database: the library is what exists today.
	const stats = [
		{ value: counts.subject, label: 'Materie' },
		{ value: counts.chapter, label: 'Capitoli' },
		{ value: counts.published, label: 'Lezioni pubblicate' }
	];
	return (
		<section className="relative flex items-center justify-center overflow-hidden px-5 pb-16 pt-10 sm:px-6 lg:min-h-[calc(100vh-4rem)] lg:px-8 lg:pb-24 lg:pt-0">
			<div className="grid-paper pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_30%_40%,black_20%,transparent_75%)]" aria-hidden="true" />
			<div className="relative z-10 mx-auto w-full max-w-7xl">
				<div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
					<div className="space-y-8 text-center lg:text-left">
						<div className="space-y-6">
							<p className="label-mono text-accent-fg">Per medie, superiori e università</p>
							<h1 className="text-5xl font-semibold leading-[1.02] text-fg-strong sm:text-6xl lg:text-7xl">
								Studia in autonomia, con materiale{' '}
								<span className="relative inline-block italic text-accent-fg">
									chiaro e completo
									<PenStroke className="absolute inset-x-0 -bottom-2" />
								</span>
							</h1>
							<p className="mx-auto max-w-2xl text-base leading-[1.6] text-fg-muted sm:text-lg lg:mx-0">
								Teoria, formulari ed esercizi svolti per medie e superiori. Con Premium accedi a lezioni individuali e supporto personalizzato.
							</p>
						</div>
						<div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
							<LinkButton href="/pricing" size="lg" className="group px-8 py-4 transition-transform hover:scale-[1.02]">
								<GraduationCap className="size-5 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
								<span>Scopri i piani</span>
							</LinkButton>
							<LinkButton href="/materiale" variant="secondary" size="lg" className="bg-surface px-8 py-4 transition-transform hover:scale-[1.02]">
								<BookOpen className="size-5" aria-hidden="true" />
								<span>Esplora materiale</span>
							</LinkButton>
						</div>
						<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 pt-4 text-left lg:justify-start">
							{stats.map(({ value, label }) => (
								<Stat key={label} value={<AnimatedCounter target={value} />}>
									{label}
								</Stat>
							))}
						</div>
					</div>
					<div className="hidden lg:block">
						{/* Pasted into the notebook: a sheet of squared paper on a slight angle, held by two strips of
						    tape. The sheet stays light in the dark theme, as a printout would; the drawing runs off its
						    bottom edge, which crops the desk legs. */}
						<div className="relative rotate-[1.5deg] rounded-2xl border border-edge bg-paper-50 px-8 pt-10 shadow-lift">
							<span className="grid-paper absolute inset-0 rounded-2xl [--grid:color-mix(in_oklab,oklch(0.62_0.09_245)_16%,transparent)]" aria-hidden="true" />
							<span className="absolute -top-3 left-10 h-6 w-24 -rotate-6 bg-accent/15 backdrop-blur-sm" aria-hidden="true" />
							<span className="absolute -bottom-3 right-12 h-6 w-24 rotate-3 bg-accent/15 backdrop-blur-sm" aria-hidden="true" />
							{/* The illustration is the largest element of the desktop hero: fetched first, as AVIF where supported. */}
							<div className="relative overflow-hidden">
								<Image src={landing} alt="Uno studente alla scrivania che studia al computer" sizes="(min-width: 1024px) 45vw, 1px" priority className="-mb-[7.5%] h-auto w-full" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
