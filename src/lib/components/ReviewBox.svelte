<script>
	import { createEventDispatcher } from 'svelte';
	import * as ls from 'lucide-svelte';
	import { addReview, updateReview } from '$lib/stores/reviews/reviews.svelte.js';
	
	let { 
		studentId = $bindable(''),
		studentName = $bindable('Studente'),  // Added for email notification
		hasReviewed = $bindable(false),
		existingRating = $bindable(0),
		existingReview = $bindable(''),
		reviewId = $bindable(null)
	} = $props();
	
	const dispatch = createEventDispatcher();
	
	let rating = $state(existingRating);
	let hoverRating = $state(0);
	let reviewText = $state(existingReview);
	let isSubmitted = $state(false);
	let isSubmitting = $state(false);
	let error = $state(null);
	
	$effect(() => {
		rating = existingRating;
		reviewText = existingReview;
	});
	
	const handleSubmit = async () => {
		if (rating === 0 || !reviewText.trim() || !studentId) return;
		
		isSubmitting = true;
		error = null;
		
		try {
			let reviewData;
			const isEdit = hasReviewed && reviewId;
			
			if (isEdit) {
				// Update existing review
				const updatedReview = await updateReview(reviewId, {
					rating,
					review: reviewText
				});
				
				// Update props with new values
				existingRating = rating;
				existingReview = reviewText;
				
				reviewData = updatedReview;
				dispatch('update', updatedReview);
			} else {
				// Create new review
				const newReview = {
					student_id: studentId,
					rating,
					review: reviewText
				};
				
				const createdReview = await addReview(newReview);
				reviewId = createdReview?.id;
				
				// Set hasReviewed flag to true after submission
				hasReviewed = true;
				
				reviewData = createdReview;
				dispatch('create', createdReview);
			}
			
			// Send email notification
			try {
				const response = await fetch('/api/submit-review', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						student_id: studentId,
						student_name: studentName,
						rating,
						review: reviewText,
						isEdit
					})
				});
				
				if (!response.ok) {
					console.error('Error sending review email notification');
				}
			} catch (emailError) {
				console.error('Failed to send review email notification:', emailError);
				// Continue with the review submission process even if the email fails
			}
			
			isSubmitted = true;
			
			// Reset UI state after a delay
			setTimeout(() => {
				isSubmitted = false;
			}, 5000);
			
		} catch (err) {
			error = err.message || 'Si è verificato un errore. Riprova più tardi.';
			console.error('Review submission error:', err);
		} finally {
			isSubmitting = false;
		}
	};
</script>

<div class="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm p-6">
	<div class="flex items-center justify-between mb-4">
		<h3 class="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
			<div class="h-8 w-8 flex items-center justify-center bg-purple-500 text-white rounded-lg">
				<ls.MessageSquare class="h-5 w-5" />
			</div>
			<span>{hasReviewed ? 'La tua recensione' : 'Lascia una recensione'}</span>
		</h3>
	</div>
	
	{#if isSubmitted}
		<div class="flex flex-col items-center justify-center py-4 text-center space-y-3">
			<div class="h-12 w-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center">
				<ls.CheckCircle class="h-8 w-8" />
			</div>
			{#if hasReviewed}
				<h4 class="font-medium text-zinc-900 dark:text-white">Recensione aggiornata!</h4>
				<p class="text-sm text-zinc-500 dark:text-zinc-400">Grazie per aver aggiornato il tuo feedback.</p>
			{:else}
				<h4 class="font-medium text-zinc-900 dark:text-white">Grazie per la tua recensione!</h4>
				<p class="text-sm text-zinc-500 dark:text-zinc-400">Il tuo feedback è molto importante.</p>
			{/if}
		</div>
	{:else}
		<div class="space-y-4">
			<div>
				<div id="rating-stars" class="flex gap-1">
					{#each Array(5) as _, i}
						<button 
							class="p-1.5 transition-all"
							onclick={() => rating = i + 1}
							onmouseenter={() => hoverRating = i + 1}
							onmouseleave={() => hoverRating = 0}
							aria-label="Valuta {i + 1} {i === 0 ? 'stella' : 'stelle'}"
							aria-pressed={rating === i + 1}
						>
							<ls.Star 
								class="h-6 w-6 {(hoverRating || rating) > i 
									? 'text-yellow-400 fill-yellow-400' 
									: 'text-zinc-300 dark:text-zinc-600'} transition-colors" 
							/>
						</button>
					{/each}
				</div>
				{#if rating > 0}
					<div class="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
						{rating === 5 ? 'Eccellente!' : 
						 rating === 4 ? 'Molto buono' : 
						 rating === 3 ? 'Buono' : 
						 rating === 2 ? 'Sufficiente' : 'Da migliorare'}
					</div>
				{/if}
			</div>
			
			<div>
				<textarea 
					id="feedback-text"
					bind:value={reviewText}
					placeholder="Scrivi qui il tuo feedback..."
					class="w-full p-3 rounded-lg bg-zinc-50 dark:bg-zinc-700/50 border border-zinc-200 dark:border-zinc-600 
					text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500
					focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-transparent
					resize-none text-sm"
					rows="3"
				></textarea>
			</div>
			
			{#if error}
				<div class="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-lg text-sm">
					{error}
				</div>
			{/if}
			
			<button 
				onclick={handleSubmit}
				disabled={rating === 0 || !reviewText.trim() || isSubmitting || !studentId}
				class="w-full py-2.5 px-4 rounded-lg font-medium text-white bg-gradient-to-r from-purple-500 to-purple-600
				hover:from-purple-600 hover:to-purple-700 transition-all
				disabled:opacity-50 disabled:cursor-not-allowed
				flex items-center justify-center gap-2"
			>
				{#if isSubmitting}
					<ls.Loader class="h-4 w-4 animate-spin" />
					<span>{hasReviewed ? 'Modifica in corso...' : 'Invio in corso...'}</span>
				{:else}
					<span>{hasReviewed ? 'Modifica' : 'Invia'}</span>
				{/if}
			</button>
		</div>
	{/if}
</div>