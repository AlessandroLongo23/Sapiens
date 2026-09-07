<script lang="ts">
	import { Home, UsersRound, GraduationCap, ArrowRight, Check, Ban, Inbox, UserPen, Handshake } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { SITE_NAME, TUTORING_ROOT } from '$lib/config/site';
	import { authState } from '$lib/state/auth.svelte';

	import Seo from '$lib/components/seo/Seo.svelte';
	import Breadcrumb from '$lib/components/ui/Breadcrumb.svelte';

	const path = `${TUTORING_ROOT}/diventa-tutor`;
	const description =
		'Dai ripetizioni di matematica, fisica, chimica o informatica con Sapiens: profilo gratuito, nessuna commissione sulle lezioni, contatti degli studenti solo quando accetti una richiesta.';

	const breadcrumbItems = [
		{ label: 'Home', path: '/', icon: Home },
		{ label: 'Ripetizioni', path: TUTORING_ROOT, icon: UsersRound },
		{ label: 'Diventa tutor', path }
	];

	const steps = [
		{ icon: UserPen, title: 'Crea il profilo', text: 'Nome, presentazione, materie, livelli, città o online, prezzo indicativo. Lo controlliamo e lo pubblichiamo.' },
		{ icon: Inbox, title: 'Ricevi le richieste', text: 'Gli studenti ti scrivono cosa serve. Vedi il messaggio, non i contatti, e hai 48 ore per rispondere.' },
		{ icon: Handshake, title: 'Accetta e organizzati', text: 'Se accetti, ricevete i contatti a vicenda e concordate orari e prezzo tra voi. Sapiens non entra nelle lezioni.' }
	];

	const yes = [
		'Profilo gratuito, senza abbonamento obbligatorio',
		'Nessuna commissione sulle lezioni, mai',
		'Un contatto va a un solo tutor: nessuna gara al ribasso',
		'Telefono ed email restano privati finché non accetti'
	];
	const no = [
		'Non gestiamo i pagamenti delle lezioni',
		'Non vincoliamo te o lo studente a restare sulla piattaforma',
		'Non vendiamo lo stesso contatto a cinque tutor'
	];

	function start() {
		if (authState.user) {
			goto('/profile-editor');
			return;
		}
		authState.openModal({ register: true, next: () => goto('/profile-editor') });
	}
</script>

<Seo title="Dai ripetizioni con {SITE_NAME}: profilo gratuito, zero commissioni" {description} {path} />

<div class="min-h-screen bg-zinc-50 dark:bg-zinc-950">
	<div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
		<Breadcrumb items={breadcrumbItems} />

		<header class="grid lg:grid-cols-[1fr_auto] gap-8 items-start mb-12">
			<div class="space-y-4">
				<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dai ripetizioni con Sapiens</h1>
				<p class="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
					Per studenti universitari e laureati in materie scientifiche. Apri un profilo, ricevi richieste da chi studia
					sulle nostre lezioni e organizza le lezioni direttamente con loro.
				</p>
				<p class="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
					Quando accetti una richiesta ricevi i contatti dello studente. In futuro questo contatto avrà un piccolo costo
					fisso, di pochi euro; nella fase di lancio è gratuito. Sulle lezioni non applichiamo mai commissioni.
				</p>
				<button type="button" onclick={start} class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950">
					<GraduationCap class="size-5" aria-hidden="true" />
					Crea il tuo profilo
					<ArrowRight class="size-4" aria-hidden="true" />
				</button>
			</div>
			<div class="hidden lg:flex items-center justify-center size-40 rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-zinc-500/25 text-crimson-500 dark:text-crimson-400">
				<GraduationCap class="size-20" aria-hidden="true" />
			</div>
		</header>

		<section class="mb-12" aria-labelledby="come-funziona">
			<h2 id="come-funziona" class="text-2xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6">Come funziona</h2>
			<ol class="grid md:grid-cols-3 gap-5">
				{#each steps as step, i (step.title)}
					{@const Icon = step.icon}
					<li class="rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 p-6 space-y-3">
						<div class="flex items-center gap-3">
							<span class="flex items-center justify-center size-10 rounded-xl bg-crimson-50 dark:bg-crimson-900/30 text-crimson-600 dark:text-crimson-300"><Icon class="size-5" aria-hidden="true" /></span>
							<span class="text-sm font-medium text-zinc-500 dark:text-zinc-400">Passo {i + 1}</span>
						</div>
						<h3 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</h3>
						<p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{step.text}</p>
					</li>
				{/each}
			</ol>
		</section>

		<section class="grid md:grid-cols-2 gap-5 mb-12" aria-label="Cosa facciamo e cosa no">
			<div class="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-white dark:bg-zinc-900 p-6">
				<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Cosa trovi</h2>
				<ul class="space-y-2">
					{#each yes as item (item)}
						<li class="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"><Check class="size-4 mt-0.5 text-emerald-600 shrink-0" aria-hidden="true" />{item}</li>
					{/each}
				</ul>
			</div>
			<div class="rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 p-6">
				<h2 class="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">Cosa non facciamo</h2>
				<ul class="space-y-2">
					{#each no as item (item)}
						<li class="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"><Ban class="size-4 mt-0.5 text-zinc-400 shrink-0" aria-hidden="true" />{item}</li>
					{/each}
				</ul>
			</div>
		</section>

		<section class="rounded-2xl border border-zinc-500/25 bg-white dark:bg-zinc-900 p-6 sm:p-8 mb-12 space-y-3" aria-labelledby="fisco">
			<h2 id="fisco" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Tasse e contributi</h2>
			<p class="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
				Le lezioni le fatturi o le ricevi per conto tuo: come prestazione occasionale (ricevuta con marca da bollo sopra
				77,47 euro, contributi INPS oltre 5.000 euro l'anno) o con partita IVA se l'attività è abituale. I docenti di ruolo
				possono usare l'imposta sostitutiva del 15% sulle lezioni private. Sapiens non trattiene ritenute e non gestisce
				i pagamenti: sono informazioni orientative, per i casi particolari chiedi a un commercialista.
			</p>
		</section>

		<div class="text-center">
			<button type="button" onclick={start} class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-semibold shadow-sm transition-colors">
				Crea il tuo profilo
				<ArrowRight class="size-4" aria-hidden="true" />
			</button>
		</div>
	</div>
</div>
