<script lang="ts">
    import ContentComingSoon from '$lib/components/content/ContentComingSoon.svelte';

    let { data } = $props();
    let { navigation } = $derived(data);
</script>

<ContentComingSoon type="formulary" navigation={navigation} />
