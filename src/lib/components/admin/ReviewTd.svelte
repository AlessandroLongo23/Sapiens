<script>
    import { reviewsStore } from '$lib/stores/reviews.js';  
    let { studentId } = $props();

    import * as ls from 'lucide-svelte';

    let hasReview = $derived.by(() => {
        return $reviewsStore.reviews.some(review => review.student_id === studentId);
    });
</script>

<td class="flex items-center justify-center">
    {#if hasReview}
        <ls.CheckCircle class="w-4 h-4 text-green-600" />
    {/if}
</td>