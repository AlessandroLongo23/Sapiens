<script>
	import { onMount } from 'svelte';
	import { 
		Clock, 
		BookOpen, 
		Users, 
		GraduationCap, 
		Zap, 
		Target, 
		ChevronDown,
		Calculator,
		Atom,
		Laptop,
		Award,
		Mail,
		Phone
	} from 'lucide-svelte';
	import StatsCard from '$lib/components/StatsCard.svelte';
	import TestimonialCard from '$lib/components/TestimonialCard.svelte';
	import Modal from '$lib/components/Modal.svelte';
	
	let isModalOpen = $state(false);
	
	// Enhanced stats data with lucide icons
	const stats = [
		{
			value: "500+",
			label: "Ore di Lezione",
			iconName: "clock"
		},
		{
			value: "15+",
			label: "Materie Coperte",
			iconName: "book-open"
		},
		{
			value: "80+",
			label: "Studenti Seguiti",
			iconName: "users"
		}
	];
	
	// Enhanced testimonials
	const testimonials = [
		{
			name: "Marco Rossi",
			comment: "Grazie ad Alessandro ho migliorato incredibilmente in matematica. Le sue spiegazioni sono chiare e riesce a rendere semplici anche i concetti più complessi. Un vero professionista!",
			rating: 5,
			subject: "Matematica - Liceo Scientifico"
		},
		{
			name: "Sofia Bianchi",
			comment: "Il miglior tutor di fisica che abbia mai avuto! Mi ha aiutato a superare gli esami universitari con ottimi voti. Molto paziente, preparato e motivante.",
			rating: 5,
			subject: "Fisica - Università"
		},
		{
			name: "Luca Verdi",
			comment: "Le lezioni di informatica con Alessandro sono state fantastiche. Ha una grande capacità di adattarsi al livello dello studente e di rendere interessanti anche gli argomenti più complessi.",
			rating: 5,
			subject: "Informatica - Università"
		}
	];
	
	// Subject data with icons
	const subjects = [
		{ name: "Matematica", icon: Calculator, color: "from-blue-500 to-cyan-500" },
		{ name: "Fisica", icon: Atom, color: "from-purple-500 to-pink-500" },
		{ name: "Informatica", icon: Laptop, color: "from-green-500 to-emerald-500" },
		{ name: "Chimica", icon: Award, color: "from-orange-500 to-red-500" }
	];
	
	let heroSection;
	let aboutSection;
	let subjectsSection;
	let statsSection;
	let testimonialsSection;
	
	onMount(() => {
		// Enhanced Intersection Observer
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
				}
			});
		}, {
			threshold: 0.1,
			rootMargin: '0px 0px -80px 0px'
		});
		
		// Observe all sections
		[aboutSection, subjectsSection, statsSection, testimonialsSection].forEach(section => {
			if (section) observer.observe(section);
		});
		
		// Create floating particles
		createParticles();
		
		return () => observer.disconnect();
	});
	
	function createParticles() {
		const hero = document.querySelector('.hero-particles');
		if (!hero) return;
		
		for (let i = 0; i < 8; i++) {
			const particle = document.createElement('div');
			particle.className = 'particle';
			particle.style.left = Math.random() * 100 + '%';
			particle.style.animationDelay = Math.random() * 15 + 's';
			particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
			hero.appendChild(particle);
		}
	}
	
	function openModal() {
		isModalOpen = true;
	}
	
	function scrollToSection(sectionId) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<svelte:head>
	<title>Alessandro - Ripetizioni Materie Scientifiche | Tutor Esperto</title>
	<meta name="description" content="Ripetizioni personalizzate in matematica, fisica, informatica e altre materie scientifiche. Tutor esperto laureato al Politecnico di Milano con oltre 500 ore di esperienza." />
</svelte:head>

<!-- Hero Section with Advanced Styling -->
<section bind:this={heroSection} class="relative min-h-screen hero-gradient flex items-center justify-center px-4 py-20 overflow-hidden">
	<!-- Floating particles background -->
	<div class="hero-particles particles"></div>
	
	<div class="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center z-10">
		<!-- Hero Content -->
		<div class="text-center lg:text-left space-y-10">
			<div class="space-y-6">
				<!-- Subtitle with icon -->
				<div class="flex items-center justify-center lg:justify-start space-x-3 text-blue-600 font-medium text-lg">
					<GraduationCap class="w-6 h-6" />
					<span>Tutor Specializzato in Materie Scientifiche</span>
				</div>
				
				<!-- Main title with enhanced gradient -->
				<h1 class="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
					Eccellenza nelle 
					<span class="gradient-text block">Materie Scientifiche</span>
				</h1>
				
				<!-- Description -->
				<p class="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl font-light">
					Trasforma le difficoltà in successi con ripetizioni personalizzate. 
					Un approccio su misura che unisce teoria e pratica per risultati concreti.
				</p>
			</div>
			
			<!-- CTA Buttons with advanced styling -->
			<div class="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
				<button 
					onclick={openModal}
					class="btn-primary text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-elegant-lg group"
				>
					<span class="flex items-center justify-center space-x-3">
						<Zap class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
						<span>Prenotami</span>
					</span>
				</button>
				<button 
					onclick={() => scrollToSection('about')}
					class="btn-secondary text-slate-700 px-10 py-5 rounded-2xl font-semibold text-lg group"
				>
					<span class="flex items-center justify-center space-x-3">
						<span>Scopri di più</span>
						<ChevronDown class="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
					</span>
				</button>
			</div>
			
			<!-- Trust indicators -->
			<div class="flex items-center justify-center lg:justify-start space-x-8 pt-6">
				<div class="text-center">
					<div class="text-3xl font-bold text-slate-800">500+</div>
					<div class="text-sm text-slate-600">Ore Insegnate</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-slate-800">98%</div>
					<div class="text-sm text-slate-600">Studenti Soddisfatti</div>
				</div>
				<div class="text-center">
					<div class="text-3xl font-bold text-slate-800">15+</div>
					<div class="text-sm text-slate-600">Materie</div>
				</div>
			</div>
		</div>
		
		<!-- Enhanced Hero Visual -->
		<div class="flex justify-center lg:justify-end">
			<div class="relative">
				<!-- Main avatar with morphing background -->
				<div class="relative w-96 h-96 morphing-shape bg-gradient-to-br from-blue-400/20 via-indigo-500/20 to-blue-600/20 flex items-center justify-center floating-animation">
					<!-- Avatar placeholder with glass effect -->
					<div class="w-80 h-80 rounded-full glass-effect flex items-center justify-center">
						<div class="w-72 h-72 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 shadow-elegant-lg">
							<GraduationCap class="w-32 h-32" />
						</div>
					</div>
				</div>
				
				<!-- Floating subject icons -->
				<div class="absolute -top-8 -right-8 w-20 h-20 glass-effect rounded-2xl flex items-center justify-center floating-animation shadow-elegant" style="animation-delay: -2s;">
					<Calculator class="w-10 h-10 text-blue-600" />
				</div>
				<div class="absolute -bottom-8 -left-8 w-20 h-20 glass-effect rounded-2xl flex items-center justify-center floating-animation shadow-elegant" style="animation-delay: -4s;">
					<Atom class="w-10 h-10 text-purple-600" />
				</div>
				<div class="absolute top-1/2 -left-12 w-16 h-16 glass-effect rounded-2xl flex items-center justify-center floating-animation shadow-elegant" style="animation-delay: -6s;">
					<Laptop class="w-8 h-8 text-green-600" />
				</div>
			</div>
		</div>
	</div>
</section>

<!-- About Section with Enhanced Design -->
<section id="about" bind:this={aboutSection} class="section-enter py-24 px-4 bg-white relative overflow-hidden">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-16">
			<h2 class="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Chi Sono</h2>
			<div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
		</div>
		
		<div class="grid lg:grid-cols-2 gap-16 items-center">
			<!-- Content -->
			<div class="space-y-8">
				<div class="glass-effect rounded-3xl p-8 lg:p-12">
					<div class="space-y-6 text-slate-700">
						<p class="text-xl leading-relaxed">
							Sono <strong class="text-slate-900">Alessandro</strong>, laureato in 
							<strong class="text-blue-600">Ingegneria Informatica</strong> presso il 
							<strong class="text-slate-900">Politecnico di Milano</strong> con specializzazione in 
							Intelligenza Artificiale e Machine Learning.
						</p>
						<p class="text-lg leading-relaxed">
							Durante il mio percorso accademico ho sviluppato una profonda passione per l'insegnamento, 
							scoprendo che la mia capacità di rendere semplici concetti complessi può fare davvero 
							la differenza nel percorso di apprendimento degli studenti.
						</p>
						<p class="text-lg leading-relaxed">
							Oltre alla solida formazione teorica, porto con me <strong class="text-slate-900">anni di esperienza pratica</strong> 
							nel settore tecnologico, permettendomi di collegare sempre la teoria con applicazioni concrete 
							e stimolanti che preparano gli studenti al mondo reale.
						</p>
					</div>
				</div>
				
				<!-- Credentials -->
				<div class="grid sm:grid-cols-2 gap-4">
					<div class="glass-effect rounded-2xl p-6 text-center">
						<GraduationCap class="w-8 h-8 text-blue-600 mx-auto mb-3" />
						<div class="font-semibold text-slate-800">Politecnico di Milano</div>
						<div class="text-sm text-slate-600">Ingegneria Informatica</div>
					</div>
					<div class="glass-effect rounded-2xl p-6 text-center">
						<Target class="w-8 h-8 text-green-600 mx-auto mb-3" />
						<div class="font-semibold text-slate-800">98% Success Rate</div>
						<div class="text-sm text-slate-600">Studenti Promossi</div>
					</div>
				</div>
			</div>
			
			<!-- Visual Element -->
			<div class="flex justify-center">
				<div class="relative">
					<div class="w-80 h-80 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8 glass-effect">
						<div class="grid grid-cols-2 gap-4 h-full">
							{#each subjects as subject, index}
								<div class="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/50 shadow-sm hover:shadow-md transition-all duration-300" style="animation-delay: {index * 100}ms">
									<div class="w-12 h-12 rounded-xl bg-gradient-to-br {subject.color} flex items-center justify-center mb-3 text-white">
										<svelte:component this={subject.icon} class="w-6 h-6" />
									</div>
									<div class="text-sm font-medium text-slate-700">{subject.name}</div>
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Stats Section with Enhanced Design -->
<section bind:this={statsSection} class="section-enter py-24 px-4 hero-gradient relative">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-20">
			<h2 class="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">I Miei Numeri</h2>
			<p class="text-xl text-slate-600 max-w-2xl mx-auto">
				Risultati che parlano da soli e testimoniano anni di dedizione nell'insegnamento
			</p>
			<div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full mt-6"></div>
		</div>
		
		<div class="grid md:grid-cols-3 gap-8">
			{#each stats as stat, index}
				<div style="animation-delay: {index * 200}ms">
					<StatsCard {...stat} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Testimonials Section -->
<section bind:this={testimonialsSection} class="section-enter py-24 px-4 bg-white">
	<div class="max-w-6xl mx-auto">
		<div class="text-center mb-20">
			<h2 class="text-4xl lg:text-5xl font-bold text-slate-900 mb-6">Cosa Dicono i Miei Studenti</h2>
			<p class="text-xl text-slate-600 max-w-3xl mx-auto">
				Testimonianze autentiche di chi ha già raggiunto i suoi obiettivi e trasformato 
				le difficoltà in successi concreti
			</p>
			<div class="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full mt-6"></div>
		</div>
		
		<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each testimonials as testimonial, index}
				<div style="animation-delay: {index * 150}ms">
					<TestimonialCard {...testimonial} />
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Enhanced Footer -->
<footer class="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-4 relative overflow-hidden">
	<!-- Background pattern -->
	<div class="absolute inset-0 opacity-5">
		<div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);"></div>
	</div>
	
	<div class="relative max-w-4xl mx-auto text-center">
		<div class="mb-12">
			<h3 class="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
				Pronto a Iniziare il Tuo Percorso?
			</h3>
			<p class="text-slate-300 mb-10 text-xl leading-relaxed max-w-2xl mx-auto">
				Contattami per una consulenza gratuita e scopri come posso aiutarti a raggiungere 
				i tuoi obiettivi accademici con un approccio personalizzato.
			</p>
			
			<div class="flex flex-col sm:flex-row gap-6 justify-center mb-12">
				<button 
					onclick={openModal}
					class="btn-primary text-white px-10 py-5 rounded-2xl font-semibold text-lg shadow-elegant-lg group"
				>
					<span class="flex items-center justify-center space-x-3">
						<Mail class="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
						<span>Prenotami Ora</span>
					</span>
				</button>
				<a 
					href="tel:+393123456789"
					class="btn-secondary text-slate-700 px-10 py-5 rounded-2xl font-semibold text-lg group"
				>
					<span class="flex items-center justify-center space-x-3">
						<Phone class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
						<span>Chiamami</span>
					</span>
				</a>
			</div>
		</div>
		
		<div class="pt-12 border-t border-slate-700">
			<p class="text-slate-400 text-lg">© 2024 Alessandro - Ripetizioni Materie Scientifiche</p>
			<p class="text-slate-500 text-sm mt-2">Trasformare le difficoltà in successi, una lezione alla volta.</p>
		</div>
	</div>
</footer>

<!-- Modal -->
<Modal bind:isOpen={isModalOpen} />
