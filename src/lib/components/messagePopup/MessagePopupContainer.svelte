<script>
    import { messagePopup } from '$lib/components/messagePopup/messagePopup.js';
    
    import MessagePopup from '$lib/components/messagePopup/MessagePopup.svelte';
</script>

{#each $messagePopup as { id, message, type, position }}
    <MessagePopup {message} {type} {position} />
{/each}