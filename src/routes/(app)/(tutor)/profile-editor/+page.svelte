<script lang="ts">
	import { CheckCircle2, Loader2, Save, ArrowRight } from 'lucide-svelte';
	import { invalidateAll } from '$app/navigation';
	import { TUTOR_LEVELS, TUTOR_MODES, TUTOR_SUBJECTS, type TutorLevel, type TutorMode } from '$lib/tutoring/config';

	import Seo from '$lib/components/seo/Seo.svelte';

	/**
	 * Create or edit the signed-in user's tutor profile. A new profile goes to
	 * review; edits to a published one go live within a few minutes.
	 */
	let { data } = $props();
	let tutor = $derived(data.tutor);
	let isNew = $derived(!tutor);

	let firstName = $state('');
	let lastName = $state('');
	let headline = $state('');
	let bio = $state('');
	let subjects = $state<string[]>([]);
	let levels = $state<TutorLevel[]>([]);
	let modes = $state<TutorMode[]>([]);
	let city = $state('');
	let hourlyRate = $state('');
	let education = $state('');
	let years = $state('0');
	let contactPhone = $state('');
	let contactEmail = $state('');
	let terms = $state(false);

	let saving = $state(false);
	let error = $state<string | null>(null);
	let saved = $state(false);

	// Prefill from the existing profile, or from the account for a new one.
	$effect(() => {
		const t = data.tutor;
		if (t) {
			firstName = t.first_name;
			lastName = t.last_name;
			headline = t.headline;
			bio = t.bio;
			subjects = [...t.subjects];
			levels = [...t.levels];
			modes = [...t.modes];
			city = t.city ?? '';
			hourlyRate = t.hourly_rate == null ? '' : String(t.hourly_rate);
			education = t.education ?? '';
			years = String(t.years_experience ?? 0);
			contactPhone = t.contact_phone ?? '';
			contactEmail = t.contact_email ?? '';
		} else {
			const meta = (data.user?.user_metadata ?? {}) as Record<string, unknown>;
			if (!firstName && typeof meta.first_name === 'string') firstName = meta.first_name;
			if (!lastName && typeof meta.last_name === 'string') lastName = meta.last_name;
			if (!contactEmail && data.user?.email) contactEmail = data.user.email;
		}
	});

	function toggle<T extends string>(list: T[], value: T): T[] {
		return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
	}

	const schoolSubjects = TUTOR_SUBJECTS.filter((s) => s.group === 'scuola');
	const universitySubjects = TUTOR_SUBJECTS.filter((s) => s.group === 'università');

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (saving) return;
		saving = true;
		error = null;
		saved = false;
		try {
			const response = await fetch('/api/tutoring/profile', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					first_name: firstName,
					last_name: lastName,
					headline,
					bio,
					subjects,
					levels,
					modes,
					city: modes.includes('in_person') ? city : '',
					hourly_rate: hourlyRate === '' ? null : Number(hourlyRate),
					education,
					years_experience: Number(years || 0),
					contact_phone: contactPhone,
					contact_email: contactEmail,
					terms
				})
			});
			const body = await response.json().catch(() => ({}));
			if (!response.ok) throw new Error(body.error ?? 'Salvataggio non riuscito. Riprova tra qualche minuto.');
			saved = true;
			await invalidateAll();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Salvataggio non riuscito. Riprova tra qualche minuto.';
		} finally {
			saving = false;
		}
	}

	const fieldClass =
		'w-full rounded-xl border border-zinc-500/25 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/30 outline-none transition';
	const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1';
	const hintClass = 'mt-1 text-xs text-zinc-500 dark:text-zinc-400';
	const chipClass = (on: boolean) =>
		`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${on ? 'bg-crimson-600 border-crimson-600 text-white' : 'bg-white dark:bg-zinc-950 border-zinc-500/25 text-zinc-700 dark:text-zinc-300 hover:border-crimson-300 dark:hover:border-crimson-800'}`;
</script>

<Seo title={isNew ? 'Crea il profilo tutor | Sapiens' : 'Modifica il profilo tutor | Sapiens'} path="/profile-editor" noindex />

<div class="max-w-3xl">
	<header class="mb-6">
		<h1 class="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{isNew ? 'Crea il tuo profilo tutor' : 'Il tuo profilo tutor'}</h1>
		<p class="mt-1 text-zinc-600 dark:text-zinc-400">
			{#if isNew}
				Sul sito compaiono nome e iniziale del cognome, presentazione, materie, livelli e prezzo indicativo. Telefono ed
				email restano privati: li ricevono solo gli studenti che accetti.
			{:else if tutor?.status === 'pending'}
				Il profilo è in revisione: puoi modificarlo finché non è pubblicato.
			{:else}
				Le modifiche compaiono sul profilo pubblico entro pochi minuti.
			{/if}
		</p>
	</header>

	{#if saved}
		<div class="mb-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 p-5 flex items-start gap-3" role="status">
			<CheckCircle2 class="size-6 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
			<div>
				<h2 class="font-semibold text-zinc-900 dark:text-zinc-100">Profilo salvato</h2>
				<p class="text-sm text-zinc-700 dark:text-zinc-300">
					{#if tutor?.status === 'pending'}
						Lo controlliamo a breve e ti avvisiamo via email quando è pubblico.
					{:else}
						Le modifiche sono online.
					{/if}
				</p>
				<a href="/dashboard" class="mt-2 inline-flex items-center gap-1 text-sm font-medium text-crimson-600 dark:text-crimson-400 hover:underline">Vai al riepilogo <ArrowRight class="size-3.5" aria-hidden="true" /></a>
			</div>
		</div>
	{/if}

	<form onsubmit={submit} class="space-y-8" novalidate>
		<section class="rounded-2xl border border-zinc-500/25 bg-white/80 dark:bg-zinc-950/60 p-5 sm:p-6 space-y-4" aria-labelledby="chi-sei">
			<h2 id="chi-sei" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Chi sei</h2>
			<div class="grid sm:grid-cols-2 gap-4">
				<div>
					<label for="first_name" class={labelClass}>Nome</label>
					<input id="first_name" type="text" bind:value={firstName} autocomplete="given-name" required class={fieldClass} />
				</div>
				<div>
					<label for="last_name" class={labelClass}>Cognome</label>
					<input id="last_name" type="text" bind:value={lastName} autocomplete="family-name" required class={fieldClass} />
					<p class={hintClass}>Sul sito compare solo l'iniziale.</p>
				</div>
			</div>
			<div>
				<label for="headline" class={labelClass}>Presentazione in una riga</label>
				<input id="headline" type="text" bind:value={headline} maxlength="120" placeholder="Es. Laureanda in Matematica, preparo alle verifiche di quarta e quinta" required class={fieldClass} />
				<p class={hintClass}>{headline.length}/120</p>
			</div>
			<div>
				<label for="bio" class={labelClass}>Presentazione</label>
				<textarea id="bio" bind:value={bio} rows="6" maxlength="2000" required placeholder="Cosa studi o hai studiato, da quanto dai ripetizioni, come lavori con gli studenti. Un paragrafo vuoto separa i capoversi." class="{fieldClass} resize-y"></textarea>
				<p class={hintClass}>{bio.length}/2000, almeno 40 caratteri.</p>
			</div>
			<div class="grid sm:grid-cols-2 gap-4">
				<div>
					<label for="education" class={labelClass}>Formazione <span class="text-zinc-400 font-normal">(facoltativa)</span></label>
					<input id="education" type="text" bind:value={education} maxlength="120" placeholder="Es. Ingegneria informatica, Politecnico di Torino" class={fieldClass} />
				</div>
				<div>
					<label for="years" class={labelClass}>Anni di ripetizioni</label>
					<input id="years" type="number" bind:value={years} min="0" max="50" step="1" class={fieldClass} />
				</div>
			</div>
		</section>

		<section class="rounded-2xl border border-zinc-500/25 bg-white/80 dark:bg-zinc-950/60 p-5 sm:p-6 space-y-5" aria-labelledby="cosa-insegni">
			<h2 id="cosa-insegni" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Cosa insegni</h2>
			<fieldset>
				<legend class={labelClass}>Materie <span class="text-zinc-400 font-normal">(fino a otto)</span></legend>
				<p class="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Scuola</p>
				<div class="flex flex-wrap gap-2 mb-3" role="group" aria-label="Materie di scuola">
					{#each schoolSubjects as s (s.id)}
						<button type="button" aria-pressed={subjects.includes(s.id)} onclick={() => (subjects = toggle(subjects, s.id))} class={chipClass(subjects.includes(s.id))}>{s.name}</button>
					{/each}
				</div>
				<p class="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Università</p>
				<div class="flex flex-wrap gap-2" role="group" aria-label="Materie universitarie">
					{#each universitySubjects as s (s.id)}
						<button type="button" aria-pressed={subjects.includes(s.id)} onclick={() => (subjects = toggle(subjects, s.id))} class={chipClass(subjects.includes(s.id))}>{s.name}</button>
					{/each}
				</div>
			</fieldset>
			<fieldset>
				<legend class={labelClass}>Livelli</legend>
				<div class="flex flex-wrap gap-2" role="group" aria-label="Livelli">
					{#each TUTOR_LEVELS as l (l.id)}
						<button type="button" aria-pressed={levels.includes(l.id)} onclick={() => (levels = toggle(levels, l.id))} class={chipClass(levels.includes(l.id))}>{l.name}</button>
					{/each}
				</div>
			</fieldset>
			<fieldset>
				<legend class={labelClass}>Modalità</legend>
				<div class="flex flex-wrap gap-2" role="group" aria-label="Modalità">
					{#each TUTOR_MODES as m (m.id)}
						<button type="button" aria-pressed={modes.includes(m.id)} onclick={() => (modes = toggle(modes, m.id))} class={chipClass(modes.includes(m.id))}>{m.name}</button>
					{/each}
				</div>
			</fieldset>
			<div class="grid sm:grid-cols-2 gap-4">
				{#if modes.includes('in_person')}
					<div>
						<label for="city" class={labelClass}>Città per le lezioni in presenza</label>
						<input id="city" type="text" bind:value={city} maxlength="60" autocomplete="address-level2" placeholder="Es. Bologna" class={fieldClass} />
					</div>
				{/if}
				<div>
					<label for="hourly_rate" class={labelClass}>Prezzo orario indicativo <span class="text-zinc-400 font-normal">(facoltativo)</span></label>
					<div class="relative">
						<input id="hourly_rate" type="number" bind:value={hourlyRate} min="5" max="200" step="0.5" placeholder="15" class="{fieldClass} pr-12" />
						<span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-500">€/h</span>
					</div>
					<p class={hintClass}>Il prezzo lo concordi con lo studente; qui serve solo a orientare.</p>
				</div>
			</div>
		</section>

		<section class="rounded-2xl border border-zinc-500/25 bg-white/80 dark:bg-zinc-950/60 p-5 sm:p-6 space-y-4" aria-labelledby="contatti">
			<h2 id="contatti" class="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Contatti privati</h2>
			<p class="text-sm text-zinc-600 dark:text-zinc-400">Non compaiono sul profilo. Li inviamo allo studente solo quando accetti la sua richiesta.</p>
			<div class="grid sm:grid-cols-2 gap-4">
				<div>
					<label for="contact_phone" class={labelClass}>Telefono</label>
					<input id="contact_phone" type="tel" bind:value={contactPhone} autocomplete="tel" inputmode="tel" placeholder="+39 333 123 4567" required class={fieldClass} />
				</div>
				<div>
					<label for="contact_email" class={labelClass}>Email</label>
					<input id="contact_email" type="email" bind:value={contactEmail} autocomplete="email" class={fieldClass} />
				</div>
			</div>
		</section>

		{#if isNew}
			<label class="flex items-start gap-3 rounded-2xl border border-zinc-500/25 bg-white/80 dark:bg-zinc-950/60 p-4 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
				<input type="checkbox" bind:checked={terms} required class="mt-0.5 rounded border-zinc-400 text-crimson-600 focus:ring-crimson-500" />
				<span>
					Accetto i <a href="/terms" class="text-crimson-600 dark:text-crimson-400 hover:underline">Termini</a> e l'<a href="/privacy" class="text-crimson-600 dark:text-crimson-400 hover:underline">informativa privacy</a>.
					I dati degli studenti che accetto mi vengono comunicati solo per organizzare le lezioni: li uso per quello, non
					li cedo e li cancello se le lezioni non si fanno. Dichiaro imposte e contributi sulle lezioni per conto mio.
				</span>
			</label>
		{/if}

		{#if error}
			<p class="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300" role="alert">{error}</p>
		{/if}

		<div class="flex items-center gap-3">
			<button type="submit" disabled={saving} class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
				{#if saving}
					<Loader2 class="size-4 animate-spin" aria-hidden="true" />
					Salvataggio
				{:else}
					<Save class="size-4" aria-hidden="true" />
					{isNew ? 'Invia il profilo in revisione' : 'Salva le modifiche'}
				{/if}
			</button>
		</div>
	</form>
</div>
