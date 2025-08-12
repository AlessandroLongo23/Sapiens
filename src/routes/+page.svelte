<script>
	import { morgagniImages, dtuImages, stats, testimonials } from '$lib/data.js';
    import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import * as ls from 'lucide-svelte';

	import ScrollingTestimonials from '$lib/components/ScrollingTestimonials.svelte';
	import MobileTestimonialSlideshow from '$lib/components/MobileTestimonialSlideshow.svelte';
	import ImageSlideshow from '$lib/components/ImageSlideshow.svelte';
	import StatsCard from '$lib/components/cards/StatsCard.svelte';
	import BookingModal from '$lib/components/modals/BookingModal.svelte';
	import AuthModal from '$lib/components/modals/AuthModal.svelte';
    import ThemeToggle from '$lib/components/theme/ThemeToggle.svelte';

	let isContactModalOpen = $state(false);
	let isAuthModalOpen = $state(false);

	let { data } = $props();
	let { session, supabase } = $derived(data);
	
	let heroSection;
	let aboutSection;
	let subjectsSection;
	let statsSection;
	let testimonialsSection;
    let activeSection = $state('about');
	
	// let totalTime = $derived.by(() => {
	// 	let total = $lecturesStore.lectures.reduce((total, lecture) => {
	// 		const startTime = lecture.start_time.split(':');
	// 		const endTime = lecture.end_time.split(':');
	// 		const startHour = parseInt(startTime[0]) + parseInt(startTime[1]) / 60;
	// 		const endHour = parseInt(endTime[0]) + parseInt(endTime[1]) / 60;
	// 		const hours = endHour - startHour;
			
	// 		return total + hours;
	// 	}, 0);

	// 	return {
	// 		hours: Math.floor(total),
	// 		minutes: Math.round((total - Math.floor(total)) * 60)
	// 	}
	// });
	
	onMount(() => {
        const observer = new IntersectionObserver((entries) => {
            const links = Array.from(document.querySelectorAll('a.nav-link'));
            entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
                    const id = entry.target.getAttribute('id');
                    activeSection = id;
                    links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
				}
			});
		}, {
			threshold: 0.1,
			rootMargin: '0px 0px -80px 0px'
		});
		
        [aboutSection, subjectsSection, statsSection, testimonialsSection].forEach(section => {
			if (section) observer.observe(section);
		});
		
		return () => observer.disconnect();
	});
	
	function openContactModal() {
		isContactModalOpen = true;
	}

	function openAuthModal() {
		isAuthModalOpen = true;
	}
	
	function scrollToSection(sectionId) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	const accessPrivateRoute = async () => {
		const redirectPath = session?.user?.user_metadata?.role === 'admin' ? '/admin/analytics' : '/student/materiale';
		await goto(redirectPath);
	}

	const subjects = [
		{ title: 'Matematica', icon: ls.Sigma },
		{ title: 'Fisica', icon: ls.Atom },
		{ title: 'Informatica', icon: ls.Code2 },
		{ title: 'Chimica', icon: ls.Beaker },
		{ title: 'Analisi I/II', icon: ls.BookOpen },
		{ title: 'Teoria dei Segnali', icon: ls.Activity },
		{ title: 'Database', icon: ls.Database },
		{ title: 'Programmazione', icon: ls.Cpu }
	];

	const sections = [
		{
			id: 'about',
			label: 'Chi sono',
			icon: ls.User
		},
		{
			id: 'subjects',	
			label: 'Materie',
			icon: ls.BookOpen
		},
		{
			id: 'results',
			label: 'Risultati',
			icon: ls.Calculator
		},
		{
			id: 'testimonials',
			label: 'Recensioni',
			icon: ls.Star
		}
	]

	const section_style = "section-enter scroll-mt-24 md:scroll-mt-28 pt-20 sm:pt-24 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8";
</script>

<svelte:head>
	<title>AleRipetizioni</title>
	<meta
		name="description"
		content="Ripetizioni personalizzate in matematica, fisica, informatica e altre materie scientifiche. Tutor esperto Laureato all'Università degli Studi di Firenze con oltre 150 ore di esperienza."
	/>
</svelte:head>

<BookingModal bind:isOpen={isContactModalOpen} onClose={() => isContactModalOpen = false} />

<AuthModal bind:isOpen={isAuthModalOpen} onClose={() => isAuthModalOpen = false} />

<header class="sm:top-8 top-4 z-30 fixed left-1/2 -translate-x-1/2 sm:left-4 sm:right-4 sm:translate-x-0 mx-auto max-w-7xl rounded-2xl border border-zinc-200/70 dark:border-zinc-700/60 bg-white/70 dark:bg-zinc-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 supports-[backdrop-filter]:dark:bg-zinc-900/60">
	<div class="flex items-center sm:justify-between justify-center px-2 sm:px-4 py-3">
		<a href="/" class="hidden sm:flex items-center gap-3">
			<div class="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-elegant">
				<ls.Calculator class="w-4 h-4 text-white" />
			</div>
			<span class="font-semibold text-zinc-900 dark:text-zinc-100">Ale Ripetizioni</span>
		</a>
		<nav class="hidden sm:flex items-center gap-6 text-sm">
			{#each sections as section}
				<a href={`#${section.id}`} class="relative nav-link group text-zinc-900 dark:text-zinc-100">
					{section.label}
					<span class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-blue-500 rounded-full transition-opacity duration-200 {activeSection === section.id ? 'opacity-100' : 'opacity-0'}"></span>
				</a>
			{/each}
		</nav>
		<div class="flex items-center gap-2 sm:gap-3">
			<ThemeToggle />
			<button
				onclick={() => { if (session) { accessPrivateRoute() } else { openAuthModal() } }}
				class="bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 px-4 py-2 rounded-xl font-semibold text-sm group cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
			>
				<span class="flex items-center justify-center gap-2">
					<span>{session ? 'Dashboard' : 'Accedi'}</span>
					{#if session}
						<ls.Home class="w-4 h-4" />
					{:else}
						<ls.LogIn class="w-4 h-4" />
					{/if}
				</span>
			</button>
			<button
				onclick={openContactModal}
				class="btn-primary text-white px-4 sm:px-5 py-2 rounded-xl font-semibold shadow-elegant-lg group cursor-pointer"
			>
				<span class="flex items-center gap-2 text-sm">
					<ls.Calendar class="w-4 h-4" />
					<span class="hidden sm:inline">Prenota ora</span>
					<span class="sm:hidden">Prenota</span>
				</span>
			</button>
		</div>
    </div>
</header>

<section
    bind:this={heroSection}
    class="relative min-h-screen hero-gradient flex items-center justify-center md:scroll-mt-32 pt-24 md:pt-28 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
>
	<div class="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-16 items-center z-10">
		<div class="text-center lg:text-left space-y-6 sm:space-y-8 lg:space-y-10">
			<div class="space-y-4 sm:space-y-6">
                <h1 class="flex flex-col gap-2 font-bold text-zinc-900 dark:text-white leading-tight tracking-tight">
					<span class="block text-xl sm:text-2xl md:text-3xl lg:text-5xl">Tutor Specializzato in</span>
					<span class="gradient-text block text-3xl sm:text-4xl md:text-5xl lg:text-7xl">Materie Scientifiche</span>
				</h1>

                <p class="text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl font-light mx-auto lg:mx-0">
					Trasforma le difficoltà in successi con ripetizioni personalizzate. Un approccio su
					misura che unisce teoria e pratica per risultati concreti.
				</p>
			</div>

			<div class="flex flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
				<button
					onclick={openContactModal}
					class="btn-primary text-white px-6 sm:px-8 py-2 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg shadow-elegant-lg group cursor-pointer"
				>
					<span class="flex items-center justify-center space-x-2 sm:space-x-3">
						<ls.Calendar
							class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300"
						/>
						<span>Prenota ora</span>
					</span>
				</button>

				<a 
					href="mailto:aleripetizioni2024@gmail.com" 
					class="inline-flex items-center justify-center btn-secondary text-zinc-700 dark:text-zinc-200 size-12 sm:w-auto sm:h-auto px-4 sm:px-8 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg group cursor-pointer"
				>
					<ls.Mail class="size-4 sm:size-6" />
                </a>

                <a 
					href="tel:+393924090699" 
					class="inline-flex items-center justify-center btn-secondary text-zinc-700 dark:text-zinc-200 size-12 sm:w-auto sm:h-auto px-4 sm:px-8 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg group cursor-pointer"
				>
                    <ls.Phone class="size-4 sm:size-6" />
                </a>
			</div>

            <div
                class="flex items-center justify-center lg:justify-start space-x-4 sm:space-x-8 pt-4 sm:pt-6"
            >
				{#each Object.values($stats) as stat, index}
					<div class="text-center">	
                        <div class="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-800 dark:text-zinc-100">{stat.value}</div>
                        <div class="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
					</div>
				{/each}
			</div>
		</div>
		
		<div class="flex justify-center lg:justify-end mt-8 lg:mt-0">
			<div class="relative">
				<div class="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 morphing-shape bg-gradient-to-br from-blue-400/20 via-indigo-500/20 to-blue-600/20 flex items-center justify-center floating-animation">
                    <div class="w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full glass-effect flex items-center justify-center">
                        <div class="w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 shadow-elegant-lg">
							<img src="/profile.jpg" alt="profile" class="w-full h-full rounded-full" id="profile-image" />
						</div>
					</div>
				</div>
				
				<div class="absolute -top-4 -right-4 sm:-top-8 sm:-right-8 w-14 h-14 sm:w-20 sm:h-20 glass-effect rounded-full sm:rounded-2xl flex items-center justify-center floating-animation shadow-elegant" style="animation-delay: -2s;">
					<ls.Calculator class="w-6 h-6 sm:w-10 sm:h-10 text-blue-600" />
				</div>
				<div class="absolute -bottom-4 -left-4 sm:-bottom-8 sm:-left-8 w-14 h-14 sm:w-20 sm:h-20 glass-effect rounded-full sm:rounded-2xl flex items-center justify-center floating-animation shadow-elegant" style="animation-delay: -4s;">
					<ls.Atom class="w-6 h-6 sm:w-10 sm:h-10 text-purple-600" />
				</div>
				<div class="absolute top-1/2 -left-8 sm:-left-12 w-12 h-12 sm:w-16 sm:h-16 glass-effect rounded-full sm:rounded-2xl flex items-center justify-center floating-animation shadow-elegant" style="animation-delay: -6s;">
					<ls.Laptop class="w-5 h-5 sm:w-8 sm:h-8 text-green-600" />
				</div>
			</div>
		</div>
	</div>

	<!-- Subtle bouncing scroll indicator (only in hero) -->
	<a href="#about" aria-label="Scopri di più"
		class="hidden sm:flex items-center justify-center absolute left-1/2 -translate-x-1/2 bottom-6 w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/70 backdrop-blur text-zinc-700 dark:text-zinc-200 shadow-elegant animate-bounce cursor-pointer">
		<ls.ChevronDown class="w-5 h-5" />
	</a>
</section>

<section id="about" bind:this={aboutSection} class="{section_style} bg-white dark:bg-zinc-950 relative overflow-hidden">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-12 sm:mb-16">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4 sm:mb-6">Chi Sono</h2>
			<div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
		</div>
		
		<div class="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
			<div class="space-y-6 sm:space-y-8">
                <div class="glass-effect rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
                    <div class="space-y-4 sm:space-y-6 text-zinc-700 dark:text-zinc-200">
                        <p class="text-lg sm:text-xl leading-relaxed">
							Sono <strong class="text-zinc-900 dark:text-zinc-100">Alessandro</strong>, laureato con 110 e Lode in
                                <strong class="text-blue-600">Ingegneria Informatica</strong> presso l'<strong class="dark:text-white">Università degli Studi di Firenze</strong>
							e attualmente frequentante la facoltà di 
                                <strong class="text-blue-600">Human-Centered Artificial Intelligence</strong> alla 
                                <strong class="dark:text-white">Denmark Technical University</strong>, a Copenhagen.
						</p>
                        <p class="text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
							Durante il mio percorso accademico ho sviluppato una profonda passione per l'insegnamento, 
							scoprendo che la mia capacità di rendere semplici concetti complessi può fare davvero 
							la differenza nel percorso di apprendimento degli studenti.
						</p>
                        <p class="text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
							Oltre alla solida formazione teorica, porto con me <strong class="text-zinc-900 dark:text-zinc-100">anni di esperienza pratica</strong> 
							nel settore tecnologico, permettendomi di collegare sempre la teoria con applicazioni concrete 
							e stimolanti che preparano gli studenti al mondo reale.
						</p>
					</div>
				</div>
			</div>
			
			<div class="hidden lg:flex justify-center mt-8 lg:mt-0">
				<div class="flex flex-col gap-12">
					<div class="relative w-80 h-48 sm:w-96 sm:h-56 lg:w-[28rem] lg:h-64">
						<div class="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
							<ImageSlideshow 
								images={$morgagniImages}
								alt="UNIFI"
								duration={3000}
							/>
						</div>
						<div class="absolute -bottom-8 -right-8 sm:-bottom-8 sm:-right-8">
							<a href="https://www.ing-inl.unifi.it/" class="block glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg">
								<ls.GraduationCap class="size-5 sm:size-6 text-blue-600 dark:text-blue-400 mx-auto mb-1 sm:mb-2" />
								<div class="font-semibold text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm leading-tight">Università degli Studi di Firenze</div>
								<div class="text-xs text-zinc-600 dark:text-zinc-400">Ingegneria Informatica</div>
							</a>
						</div>
					</div>

					<div class="relative w-80 h-48 sm:w-96 sm:h-56 lg:w-[28rem] lg:h-64 left-8">
						<div class="w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg">
							<ImageSlideshow 
								images={$dtuImages}
								alt="DTU"
								duration={5000}
								offset={2500}
							/>
						</div>
						<div class="absolute -bottom-8 -left-8 sm:-bottom-8 sm:-left-8">
							<a href="https://www.dtu.dk/english/education/graduate/msc-programmes/human-centered-artificial-intelligence" class="block glass-effect rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg">
								<ls.BookOpen class="size-5 sm:size-6 text-blue-600 dark:text-blue-400 mx-auto mb-1 sm:mb-2" />
								<div class="font-semibold text-zinc-800 dark:text-zinc-100 text-xs sm:text-sm leading-tight">Denmark Technical University</div>
								<div class="text-xs text-zinc-600 dark:text-zinc-400">Human-Centered Artificial Intelligence</div>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<section id="subjects" bind:this={subjectsSection} class="{section_style} hero-gradient">
    <div class="max-w-6xl mx-auto">
        <div class="text-center mb-12 sm:mb-16">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4 sm:mb-6">Materie</h2>
            <p class="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto px-4">Supporto personalizzato dalle scuole medie all'università</p>
            <div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mt-4 sm:mt-6"></div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {#each subjects as s}
                <div class="group rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm">
                    <div class="flex items-center gap-3">
                        <s.icon class="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                        <div class="font-semibold text-zinc-900 dark:text-zinc-100 text-xs sm:text-base">{s.title}</div>
                    </div>
                </div>
            {/each}
        </div>

        <div class="text-center mt-10 sm:mt-12">
            <button onclick={openContactModal} class="btn-primary text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base shadow-elegant-lg">Richiedi informazioni</button>
        </div>
    </div>
</section>

<section id="results" bind:this={statsSection} class="{section_style} bg-white dark:bg-zinc-950 relative">
	<div class="max-w-6xl mx-auto">
        <div class="text-center mb-16 sm:mb-20">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4 sm:mb-6">I Miei Risultati</h2>
            <p class="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto px-4">
				Numeri che parlano da soli e testimoniano anni di dedizione nell'insegnamento
			</p>
			<div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mt-4 sm:mt-6"></div>
		</div>
		
		<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
			{#each Object.values($stats) as stat, index}
				<div style="animation-delay: {index * 200}ms">
					<StatsCard {...stat} />
				</div>
			{/each}
		</div>
	</div>
</section>

<section id="testimonials" bind:this={testimonialsSection} class="{section_style} hero-gradient">
	<div class="max-w-6xl mx-auto">
        <div class="text-center mb-16 sm:mb-20">
            <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-white mb-4 sm:mb-6">Cosa Dicono i Miei Studenti</h2>
            <p class="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto px-4">
				Testimonianze autentiche di chi ha già raggiunto i suoi obiettivi e trasformato 
				le difficoltà in successi concreti
			</p>
			<div class="w-16 sm:w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mt-4 sm:mt-6"></div>
		</div>
		
		<!-- Mobile testimonial slideshow (hidden on desktop) -->
		<div class="block lg:hidden">
			<MobileTestimonialSlideshow 
				testimonials={$testimonials} 
				duration={10000}
				className="px-4"
			/>
		</div>
		
		<!-- Desktop scrolling testimonials (hidden on mobile) -->
		<div class="hidden lg:block">
			<ScrollingTestimonials 
				testimonials={$testimonials} 
				scrollSpeed={30}
				className="py-8"
			/>
		</div>
	</div>
</section>

<footer class="bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
	<div class="absolute inset-0 opacity-5">
		<div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);"></div>
	</div>
	
	<div class="relative max-w-4xl mx-auto text-center">
		<div class="mb-10 sm:mb-12">
			<h3 class="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
				Pronto a Iniziare il Tuo Percorso?
			</h3>
			<p class="text-zinc-300 mb-8 sm:mb-10 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto px-4">
				Contattami per una consulenza gratuita e scopri come posso aiutarti a raggiungere 
				i tuoi obiettivi accademici con un approccio personalizzato.
			</p>
			
			<div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-10 sm:mb-12">
				<button
					onclick={openContactModal}
					class="btn-primary text-white px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg shadow-elegant-lg group cursor-pointer"
				>
					<span class="flex items-center justify-center space-x-2 sm:space-x-3">
						<ls.Mail class="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
						<span>Richiedi una lezione di prova</span>
					</span>
				</button>
				<a
					href="mailto:aleripetizioni2024@gmail.com"
					class="btn-secondary text-zinc-700 dark:text-zinc-200 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-semibold text-base sm:text-lg group cursor-pointer"
				>
					<span class="flex items-center justify-center space-x-2 sm:space-x-3">
						<span>Scrivimi una mail</span>
						<ls.Send class="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
					</span>
				</a>
			</div>
		</div>
		
		<div class="pt-8 sm:pt-12 border-t border-zinc-700">
			<p class="text-zinc-400 text-base sm:text-lg">© 2024 Alessandro - Ripetizioni Materie Scientifiche</p>
			<p class="text-zinc-500 text-sm mt-2">Trasformare le difficoltà in successi, una lezione alla volta.</p>
		</div>
	</div>
</footer>
