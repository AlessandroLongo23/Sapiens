<script lang="ts">
	import { CheckCircle2, Loader2, Send, ShieldCheck } from 'lucide-svelte';
	import { authState } from '$lib/state/auth.svelte';
	import {
		levelName,
		modeName,
		subjectName,
		tutorDisplayName,
		type TutorLevel,
		type TutorMode,
		type TutorProfile
	} from '$lib/tutoring/config';

	/**
	 * A student's (or parent's) request to be put in touch with one tutor.
	 * Anonymous visitors fill it in and are asked to log in on submit; the
	 * request is then sent on its own. Contact details reach the tutor only
	 * when they accept, and the form says so.
	 */
	interface Props {
		tutor: TutorProfile;
		/** Preselected values, from the list filters. */
		initial?: { subject?: string; level?: string; mode?: string };
		/** Called after a successful send, with the request id. */
		onSuccess?: (id: string) => void;
		/** One field per row, for a narrow column such as the profile sidebar. */
		compact?: boolean;
	}

	let { tutor, initial = {}, onSuccess, compact = false }: Props = $props();

	let name = $derived(tutorDisplayName(tutor));

	const pick = (options: string[], wanted: string | undefined) =>
		wanted && options.includes(wanted) ? wanted : (options[0] ?? '');

	let subject = $state('');
	let level = $state('');
	let mode = $state('');
	let requester = $state<'student' | 'parent'>('student');
	let contactName = $state('');
	let contactPhone = $state('');
	let contactEmail = $state('');
	let message = $state('');
	let consent = $state(false);

	let sending = $state(false);
	let error = $state<string | null>(null);
	let sentId = $state<string | null>(null);

	// Defaults follow the tutor and the filters; the effect re-runs when the
	// form is reused for another tutor.
	$effect(() => {
		subject = pick(tutor.subjects, initial.subject);
		level = pick(tutor.levels, initial.level);
		mode = pick(tutor.modes, initial.mode);
		sentId = null;
		error = null;
	});

	// Name and email come from the account, once known; the visitor can change them.
	$effect(() => {
		const user = authState.user;
		if (!user) return;
		const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
		const full = [meta.first_name, meta.last_name].filter((v) => typeof v === 'string' && v).join(' ');
		if (!contactName && full) contactName = full;
		if (!contactEmail && user.email) contactEmail = user.email;
	});

	const MIN_MESSAGE = 20;
	const MAX_MESSAGE = 1500;

	function validate(): string | null {
		if (!subject || !level || !mode) return 'Scegli materia, livello e modalità.';
		if (contactName.trim().length < 2) return 'Inserisci il nome di chi verrà contattato.';
		if (contactPhone.replace(/[\s().-]/g, '').replace(/^\+/, '').replace(/\D/g, '').length < 8) return 'Inserisci un numero di telefono valido.';
		if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) return "L'indirizzo email non sembra valido.";
		if (message.trim().length < MIN_MESSAGE) return `Racconta al tutor di cosa hai bisogno (almeno ${MIN_MESSAGE} caratteri).`;
		if (message.length > MAX_MESSAGE) return `Il messaggio può avere al massimo ${MAX_MESSAGE} caratteri.`;
		if (!consent) return 'Per inviare la richiesta devi acconsentire alla comunicazione dei contatti al tutor.';
		return null;
	}

	async function send(): Promise<void> {
		const response = await fetch('/api/tutoring/requests', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				tutorId: tutor.id,
				subject,
				level,
				mode,
				requester,
				contactName: contactName.trim(),
				contactPhone: contactPhone.trim(),
				contactEmail: contactEmail.trim() || null,
				message: message.trim(),
				consent
			})
		});
		const body = await response.json().catch(() => ({}));
		if (response.status === 401) {
			authState.openModal({ next: send });
			return;
		}
		if (!response.ok) throw new Error(body.error ?? 'Invio non riuscito. Riprova tra qualche minuto.');
		sentId = body.id ?? 'ok';
		onSuccess?.(sentId!);
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		if (sending) return;
		error = validate();
		if (error) return;

		if (!authState.user) {
			// The request is sent as soon as the login (or signup) completes.
			authState.openModal({ register: true, next: () => submit(event) });
			return;
		}

		sending = true;
		try {
			await send();
		} catch (err) {
			error = err instanceof Error ? err.message : 'Invio non riuscito. Riprova tra qualche minuto.';
		} finally {
			sending = false;
		}
	}

	const fieldClass =
		'w-full rounded-xl border border-zinc-500/25 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:border-crimson-500 focus:ring-2 focus:ring-crimson-500/30 outline-none transition';
	const labelClass = 'block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1';
</script>

{#if sentId}
	<div class="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 p-5 flex items-start gap-3" role="status">
		<CheckCircle2 class="size-6 text-emerald-600 dark:text-emerald-400 shrink-0" aria-hidden="true" />
		<div class="space-y-1">
			<h3 class="font-semibold text-zinc-900 dark:text-zinc-100">Richiesta inviata a {name}</h3>
			<p class="text-sm text-zinc-700 dark:text-zinc-300">
				{name} ha 48 ore per accettare. Se accetta, vi mandiamo i contatti a vicenda e organizzate le lezioni
				direttamente tra voi. Se non risponde, la richiesta scade e puoi scriverne un'altra.
			</p>
		</div>
	</div>
{:else}
	<form onsubmit={submit} class="space-y-5" novalidate>
		<div class="grid gap-3 {compact ? '' : 'sm:grid-cols-3'}">
			<div>
				<label for="req-subject" class={labelClass}>Materia</label>
				<select id="req-subject" bind:value={subject} class={fieldClass} required>
					{#each tutor.subjects as s (s)}
						<option value={s}>{subjectName(s)}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="req-level" class={labelClass}>Livello</label>
				<select id="req-level" bind:value={level} class={fieldClass} required>
					{#each tutor.levels as l (l)}
						<option value={l}>{levelName(l)}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="req-mode" class={labelClass}>Modalità</label>
				<select id="req-mode" bind:value={mode} class={fieldClass} required>
					{#each tutor.modes as m (m)}
						<option value={m}>{modeName(m)}</option>
					{/each}
				</select>
			</div>
		</div>

		<fieldset>
			<legend class={labelClass}>Chi scrive</legend>
			<div class="grid grid-cols-2 gap-2">
				{#each [{ id: 'student', label: 'Sono lo studente' }, { id: 'parent', label: 'Sono un genitore' }] as opt (opt.id)}
					<label
						class="flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm cursor-pointer transition-colors {requester === opt.id
							? 'border-crimson-500 bg-crimson-50 dark:bg-crimson-900/20 text-zinc-900 dark:text-zinc-100'
							: 'border-zinc-500/25 text-zinc-700 dark:text-zinc-300 hover:border-zinc-500/50'}"
					>
						<input type="radio" name="requester" value={opt.id} bind:group={requester} class="text-crimson-600 focus:ring-crimson-500" />
						{opt.label}
					</label>
				{/each}
			</div>
			<p class="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
				Se hai meno di 18 anni, indica i contatti di un genitore.
			</p>
		</fieldset>

		<div class="grid gap-3 {compact ? '' : 'sm:grid-cols-2'}">
			<div class="sm:col-span-2">
				<label for="req-name" class={labelClass}>Nome e cognome</label>
				<input id="req-name" type="text" bind:value={contactName} autocomplete="name" required class={fieldClass} />
			</div>
			<div>
				<label for="req-phone" class={labelClass}>Telefono</label>
				<input id="req-phone" type="tel" bind:value={contactPhone} autocomplete="tel" inputmode="tel" placeholder="+39 333 123 4567" required class={fieldClass} />
			</div>
			<div>
				<label for="req-email" class={labelClass}>Email <span class="text-zinc-400 font-normal">(facoltativa)</span></label>
				<input id="req-email" type="email" bind:value={contactEmail} autocomplete="email" class={fieldClass} />
			</div>
		</div>

		<div>
			<label for="req-message" class={labelClass}>Di cosa hai bisogno?</label>
			<textarea
				id="req-message"
				bind:value={message}
				rows="4"
				maxlength={MAX_MESSAGE}
				required
				placeholder="Es. Frequento la quarta liceo scientifico e tra due settimane ho una verifica sui limiti: vorrei due lezioni la settimana prossima."
				class="{fieldClass} resize-y min-h-24"
			></textarea>
			<p class="mt-1 text-xs text-zinc-500 dark:text-zinc-400 text-right">{message.length}/{MAX_MESSAGE}</p>
		</div>

		<label class="flex items-start gap-3 rounded-xl border border-zinc-500/25 p-3 text-sm text-zinc-700 dark:text-zinc-300 cursor-pointer">
			<input type="checkbox" bind:checked={consent} required class="mt-0.5 rounded border-zinc-400 text-crimson-600 focus:ring-crimson-500" />
			<span>
				Acconsento a comunicare nome, telefono ed email a {name} per organizzare le lezioni, solo se accetta la
				richiesta. Leggi l'<a href="/privacy" class="text-crimson-600 dark:text-crimson-400 hover:underline">informativa privacy</a>.
			</span>
		</label>

		{#if error}
			<p class="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-300" role="alert">
				{error}
			</p>
		{/if}

		<div class="flex flex-col sm:flex-row sm:items-center gap-3">
			<button
				type="submit"
				disabled={sending}
				class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-crimson-600 hover:bg-crimson-700 text-white font-semibold shadow-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-crimson-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
			>
				{#if sending}
					<Loader2 class="size-4 animate-spin" aria-hidden="true" />
					Invio in corso
				{:else}
					<Send class="size-4" aria-hidden="true" />
					Invia la richiesta
				{/if}
			</button>
			<p class="inline-flex items-start gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
				<ShieldCheck class="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
				<span>Gratis. Nessun pagamento passa da Sapiens: le lezioni le concordate tra voi.</span>
			</p>
		</div>
	</form>
{/if}
