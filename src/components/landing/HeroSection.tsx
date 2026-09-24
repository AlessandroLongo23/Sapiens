import { BookOpen, GraduationCap } from 'lucide-react';
import { PenStroke } from '@/components/content/PageHeader';
import { Stat } from '@/components/ui/Badge';
import { LinkButton } from '@/components/ui/Button';
import { TRIAL_DAYS } from '@/lib/stripe/config';
import { AnimatedCounter } from './AnimatedCounter';
import { HeroSketch } from './HeroSketch';

export interface HeroCounts {
	subject: number;
	chapter: number;
	published: number;
}

/** The landing hero: the promise, two calls to action, live content figures and the sketch on squared paper. */
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
							<h1 className="text-[2.4rem] font-semibold leading-[1.02] text-fg-strong sm:text-6xl lg:text-7xl">
								Studia in autonomia, con materiale{' '}
								<span className="relative inline-block whitespace-nowrap italic text-accent-fg">
									chiaro e completo
									<PenStroke className="absolute inset-x-0 -bottom-2" />
								</span>
							</h1>
							<p className="mx-auto max-w-2xl text-base leading-[1.6] text-fg-muted sm:text-lg lg:mx-0">
								Teoria, formulari ed esercizi interattivi per medie e superiori, con le flashcard e l&apos;assistente Sapiens AI.
							</p>
						</div>
						<div className="space-y-3">
							<div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
								<LinkButton href="/pricing" size="lg" className="group px-8 py-4 transition-transform hover:scale-[1.02]">
									<GraduationCap className="size-5 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
									<span>Prova gratis per {TRIAL_DAYS} giorni</span>
								</LinkButton>
								<LinkButton href="/materiale" variant="secondary" size="lg" className="bg-surface px-8 py-4 transition-transform hover:scale-[1.02]">
									<BookOpen className="size-5" aria-hidden="true" />
									<span>Esplora il materiale</span>
								</LinkButton>
							</div>
							<p className="text-sm text-fg-subtle">Senza carta di credito. Teoria e formulari restano gratis.</p>
						</div>
						<div className="hidden flex-wrap items-center gap-x-6 gap-y-4 pt-4 text-left lg:flex">
							{stats.map(({ value, label }) => (
								<Stat key={label} value={<AnimatedCounter target={value} />}>
									{label}
								</Stat>
							))}
						</div>
					</div>
					<HeroSketch className="mx-auto w-full max-w-xl lg:max-w-none" />
					{/* On phones the figures follow the sketch, so the first screen is the promise and the two buttons. */}
					<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-left lg:hidden">
						{stats.map(({ value, label }) => (
							<Stat key={label} value={<AnimatedCounter target={value} />}>
								{label}
							</Stat>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
