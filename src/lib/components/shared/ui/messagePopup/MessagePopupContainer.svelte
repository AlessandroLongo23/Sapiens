<script>
    import { messagePopup } from '$lib/components/shared/ui/messagePopup/messagePopup.js';
    
    import MessagePopup from '$lib/components/shared/ui/messagePopup/MessagePopup.svelte';
</script>

{#each $messagePopup as { id, message, type, position }}
    <MessagePopup {message} {type} {position} />
{/each}