<script lang="ts">
	import { SITE_NAME, CONTACT_EMAIL } from '$lib/config/site';
	import { levelOptions, subjectOptionsByLevel, frequencyOptions } from '$lib/const/data';
	import { Mail, Send, CheckCircle2 } from 'lucide-svelte';

	import Seo from '$lib/components/seo/Seo.svelte';

	const description =
		'Scrivi a Sapiens per chiedere una lezione individuale, avere informazioni sui piani o segnalare un errore in una lezione. Indica livello, materie e frequenza: ti rispondiamo con una proposta.';

	let firstName = $state('');
	let lastName = $state('');
	let level = $state('');
	let subjects = $state<string[]>([]);
	let customSubject = $state('');
	let frequency = $state('');
	let contact = $state('');
	let sending = $state(false);
	let sent = $state(false);
	let error = $state<string | null>(null);

	let availableSubjects = $derived(level ? ($subjectOptionsByLevel as Record<string, { value: string; title: string }[]>)[level] ?? [] : []);

	function toggleSubject(value: string, checked: boolean) {
		subjects = checked ? [...subjects, value] : subjects.filter((s) => s !== value);
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (sending) return;
		error = null;
		sending = true;

		try {
			const response = await fetch('/api/emails/first-contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					level,
					subjects,
					customSubject,
					frequency,
					firstName,
					lastName,
					contact,
					contactType: 'email'
				})
			});
			if (!response.ok) throw new Error('Invio non riuscito');
			sent = true;
		} catch {
			error = 'Non siamo riusciti a inviare la richiesta. Riprova tra qualche minuto.';
		} finally {
			sending = false;
		}
	}

	const fieldClass =
		'w-full rounded-xl border border-zinc-500/25 bg-white dark:bg-zinc-900 px-4 py-3 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/30 outline-none transition';
	const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5';
</script>

<Seo title="Contatti | {SITE_NAME}" {description} path="/contacts" />

<div class="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
	<header class="mb-10">
		<h1 class="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
			Contatti
		</h1>
		<p class="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
			Vuoi una lezione individuale, hai una domanda sui piani o hai trovato un errore in una lezione?
			Compila il modulo: ti rispondiamo all'indirizzo che indichi.
		</p>
		{#if CONTACT_EMAIL}
			<p class="mt-4 inline-flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
				<Mail class="size-4 text-crimson-500" aria-hidden="true" />
				<a href="mailto:{CONTACT_EMAIL}" class="text-crimson-600 dark:text-crimson-400 hover:underline">{CONTACT_EMAIL}</a>
			</p>
		{/if}
	</header>

	{#if sent}
		<div class="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 p-6 flex items-start gap-3" role="status">
			<CheckCircle2 class="size-6 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
			<div>
				<h2 class="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Richiesta inviata</h2>
				<p class="text-zinc-700 dark:text-zinc-300">Grazie {firstName}. Ti rispondiamo il prima possibile all'indirizzo {contact}.</p>
			</div>
		</div>
	{:else}
		<form onsubmit={submit} class="space-y-6 rounded-2xl border border-zinc-500/25 bg-white/80 dark:bg-zinc-900/80 p-6 sm:p-8">
			<div class="grid sm:grid-cols-2 gap-4">
				<div>
					<label for="firstName" class={labelClass}>Nome</label>
					<input id="firstName" name="firstName" type="text" required autocomplete="given-name" bind:value={firstName} class={fieldClass} />
				</div>
				<div>
					<label for="lastName" class={labelClass}>Cognome</label>
					<input id="lastName" name="lastName" type="text" required autocomplete="family-name" bind:value={lastName} class={fieldClass} />
				</div>
			</div>

			<div>
				<label for="contact" class={labelClass}>Email</label>
				<input id="contact" name="contact" type="email" required autocomplete="email" bind:value={contact} class={fieldClass} />
			</div>

			<div>
				<label for="level" class={labelClass}>Livello di studio</label>
				<select id="level" name="level" required bind:value={level} class={fieldClass}>
					<option value="" disabled>Scegli un livello</option>
					{#each $levelOptions as option}
						<option value={option.value}>{option.title}</option>
					{/each}
				</select>
			</div>

			{#if availableSubjects.length > 0}
				<fieldset>
					<legend class={labelClass}>Materie</legend>
					<div class="grid sm:grid-cols-2 gap-2">
						{#each availableSubjects as option}
							<label class="flex items-center gap-2 rounded-lg border border-zinc-500/25 px-3 py-2 text-zinc-800 dark:text-zinc-200 cursor-pointer hover:border-zinc-500/50">
								<input
									type="checkbox"
									name="subjects"
									value={option.value}
									checked={subjects.includes(option.value)}
									onchange={(e) => toggleSubject(option.value, (e.currentTarget as HTMLInputElement).checked)}
									class="rounded border-zinc-400 text-crimson-500 focus:ring-crimson-500"
								/>
								{option.title}
							</label>
						{/each}
					</div>
					{#if subjects.includes('altro')}
						<div class="mt-3">
							<label for="customSubject" class={labelClass}>Quale materia?</label>
							<input id="customSubject" name="customSubject" type="text" bind:value={customSubject} class={fieldClass} />
						</div>
					{/if}
				</fieldset>
			{/if}

			<div>
				<label for="frequency" class={labelClass}>Frequenza</label>
				<select id="frequency" name="frequency" required bind:value={frequency} class={fieldClass}>
					<option value="" disabled>Scegli</option>
					{#each $frequencyOptions as option}
						<option value={option.value}>{option.title}: {option.subtitle}</option>
					{/each}
				</select>
			</div>

			{#if error}
				<p class="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 px-4 py-3 text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>
			{/if}

			<button
				type="submit"
				disabled={sending}
				class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-700 disabled:opacity-60 text-white font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2"
			>
				<Send class="size-4" aria-hidden="true" />
				{sending ? 'Invio in corso…' : 'Invia la richiesta'}
			</button>
		</form>
	{/if}

	<nav class="mt-10 flex flex-wrap gap-4 text-sm" aria-label="Pagine correlate">
		<a href="/faq" class="text-crimson-600 dark:text-crimson-400 hover:underline">Domande frequenti</a>
		<a href="/pricing" class="text-crimson-600 dark:text-crimson-400 hover:underline">Prezzi e abbonamenti</a>
		<a href="/materiale" class="text-crimson-600 dark:text-crimson-400 hover:underline">Materiale didattico</a>
	</nav>
</div>
