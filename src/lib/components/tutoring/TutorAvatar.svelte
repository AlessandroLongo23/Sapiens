<script lang="ts">
	import type { TutorProfile } from '$lib/tutoring/config';

	/**
	 * Photo when the tutor has one, otherwise initials on a colour picked from
	 * the name, so the same tutor always gets the same colour.
	 */
	interface Props {
		tutor: Pick<TutorProfile, 'first_name' | 'last_initial' | 'avatar_url'>;
		size?: 'sm' | 'md' | 'lg';
	}

	let { tutor, size = 'md' }: Props = $props();

	const PALETTE = [
		'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200',
		'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200',
		'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200',
		'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200',
		'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200',
		'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-200'
	];

	const SIZES = {
		sm: 'size-10 text-sm',
		md: 'size-14 text-lg',
		lg: 'size-24 text-3xl'
	};

	function hash(text: string): number {
		let h = 0;
		for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
		return h;
	}

	let initials = $derived(`${tutor.first_name.charAt(0)}${tutor.last_initial ?? ''}`.toUpperCase());
	let colour = $derived(PALETTE[hash(`${tutor.first_name}${tutor.last_initial}`) % PALETTE.length]);
</script>

{#if tutor.avatar_url}
	<img
		src={tutor.avatar_url}
		alt=""
		class="rounded-full object-cover shrink-0 {SIZES[size]}"
		loading="lazy"
	/>
{:else}
	<div
		class="rounded-full flex items-center justify-center font-semibold shrink-0 select-none {SIZES[size]} {colour}"
		aria-hidden="true"
	>
		{initials}
	</div>
{/if}
