import Image from 'next/image';
import { BookOpen, GraduationCap, Layers, LibraryBig } from 'lucide-react';
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
		{ value: counts.subject, label: 'Materie', icon: LibraryBig },
		{ value: counts.chapter, label: 'Capitoli', icon: Layers },
		{ value: counts.published, label: 'Lezioni pubblicate', icon: BookOpen }
	];
	return (
		<section className="relative flex items-center justify-center overflow-hidden px-5 pb-16 pt-10 sm:px-6 lg:min-h-screen lg:px-8 lg:pb-24 lg:pt-0">
			<div className="relative z-10 mx-auto w-full max-w-7xl">
				<div className="grid items-center gap-2 lg:grid-cols-2">
					<div className="space-y-8 text-center lg:text-left">
						<div className="space-y-6">
							<h1 className="text-4xl font-bold leading-[1.2] tracking-tight text-fg-strong sm:text-5xl lg:text-[2.25rem]">
								Studia in autonomia con
								<span className="mt-2 block text-accent-fg">materiale chiaro e completo</span>
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
						<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 pt-8 lg:justify-start">
							{stats.map(({ value, label, icon: Icon }) => (
								<div key={label} className="text-center lg:text-left">
									<div className="flex items-center gap-3">
										<Icon className="size-6 text-accent-fg" aria-hidden="true" />
										<div className="text-2xl font-bold text-fg-strong sm:text-3xl">
											<AnimatedCounter target={value} />
										</div>
									</div>
									<div className="mt-1 text-sm text-fg-muted">{label}</div>
								</div>
							))}
						</div>
					</div>
					<div className="hidden lg:block">
						{/* The screenshot is the largest element of the desktop hero: fetched first, as AVIF where supported. */}
						<Image src={landing} alt="Una lezione di Sapiens aperta nel browser, con indice a sinistra e teoria al centro" sizes="(min-width: 1024px) 50vw, 1px" priority className="h-auto w-full object-cover" />
					</div>
				</div>
			</div>
		</section>
	);
}
