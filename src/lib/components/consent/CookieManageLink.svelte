<script lang="ts">
	import { consentState } from '$lib/consent/consent.svelte';

	let { class: className = '' } = $props<{ class?: string }>();
</script>

<button type="button" onclick={() => consentState.reopen()} class={className}>
	Gestisci cookie
</button>
