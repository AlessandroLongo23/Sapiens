<script>
	import { statsStore } from '$lib/stores/stats.svelte.js';
	import { studentsStore } from '$lib/stores/students.js';
	import { subjectsStore } from '$lib/stores/subjects.js';
	import { onMount } from 'svelte';
	import * as ls from 'lucide-svelte';

	import ScrollingTestimonials from '$lib/components/shared/landing/ScrollingTestimonials.svelte';
	import MobileTestimonialSlideshow from '$lib/components/shared/landing/MobileTestimonialSlideshow.svelte';
	import ImageSlideshow from '$lib/components/shared/landing/ImageSlideshow.svelte';
	import StatsCard from '$lib/components/cards/StatsCard.svelte';
	import BookingModal from '$lib/components/shared/ui/modals/BookingModal.svelte';
	import AuthModal from '$lib/components/shared/ui/modals/AuthModal.svelte';
	import Header from '$lib/components/shared/landing/Header.svelte';

	import HeroSection from '$lib/components/shared/landing/HeroSection.svelte';
	import AboutSection from '$lib/components/shared/landing/AboutSection.svelte';
	import SubjectsSection from '$lib/components/shared/landing/SubjectsSection.svelte';
	import MethodSection from '$lib/components/shared/landing/MethodSection.svelte';
	import StatsSection from '$lib/components/shared/landing/StatsSection.svelte';
	import TestimonialsSection from '$lib/components/shared/landing/TestimonialsSection.svelte';
	import FooterSection from '$lib/components/shared/landing/FooterSection.svelte';

	let isContactModalOpen = $state(false);
	let isAuthModalOpen = $state(false);

	let { data } = $props();
	let { session, supabase } = $derived(data);
	
	let heroSection = $state(null);
	let aboutSection = $state(null);
	let subjectsSection = $state(null);
	let methodSection = $state(null);
	let statsSection = $state(null);
	let testimonialsSection = $state(null);

	let activeSection = $state('about');
	
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
		
		[aboutSection, subjectsSection, methodSection, statsSection, testimonialsSection].forEach(section => {
			if (section) observer.observe(section);
		});
		
		return () => observer.disconnect();
	});
	
	function scrollToSection(sectionId) {
		const element = document.getElementById(sectionId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}

	let stats = $derived({
		hours: {
			value: Math.floor(statsStore.totalTime.hours / 10) * 10 + "+",
			label: "Ore di Lezione",
			icon: ls.Clock,
			color: "text-blue-500"
		},
		subjects: {
			value: $subjectsStore.subjects.length,
			label: "Materie Trattate",
			icon: ls.BookOpen,
			color: "text-emerald-500"
		},
		students: {
			value: Math.floor($studentsStore.students.length / 5) * 5 + "+",
			label: "Studenti Seguiti",
			icon: ls.Users,
			color: "text-purple-500"
		}
	});
</script>

<svelte:head>
	<title>AleRipetizioni</title>
	<meta
		name="description"
		content="Ripetizioni personalizzate in matematica, fisica, informatica e altre materie scientifiche. Tutor esperto Laureato all'Università degli Studi di Firenze con oltre {stats.hours.value} ore di esperienza."
	/>
</svelte:head>

<BookingModal 
	bind:isOpen={isContactModalOpen} 
	onClose={() => isContactModalOpen = false}
/>

<AuthModal 
	bind:isOpen={isAuthModalOpen} 
	onClose={() => isAuthModalOpen = false} 
/>

<Header
	bind:isAuthModalOpen={isAuthModalOpen}
	bind:isContactModalOpen={isContactModalOpen}
	bind:activeSection={activeSection}
	session={session}
/>

<HeroSection bind:heroSection={heroSection} bind:isContactModalOpen={isContactModalOpen} stats={stats} />
<AboutSection bind:aboutSection={aboutSection} />
<SubjectsSection bind:subjectsSection={subjectsSection} />
<MethodSection bind:methodSection={methodSection} />
<StatsSection bind:statsSection={statsSection} stats={stats} />
<TestimonialsSection bind:testimonialsSection={testimonialsSection} />

<FooterSection bind:isContactModalOpen={isContactModalOpen} />