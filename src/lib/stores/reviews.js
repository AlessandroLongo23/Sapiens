import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import { Review } from '$lib/models/Review.svelte.js';

async function fetchReviews() {
    const { data, error } = await supabase
        .from('reviews')
        .select('*');
    if (error) throw new Error(error.message);
    return data.map(review => new Review(review));
}

export const selectedReviewStore = writable(null);

const createReviewsStore = () => {
    const { subscribe, set, update } = writable({
        reviews: [],
        loading: true,
        error: null
    });

    if (typeof window !== 'undefined') {
        const subscription = supabase
            .channel('students_changes')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'reviews'
                },
                async (payload) => {
                    const { data } = await supabase
                        .from('reviews')
                        .select('*');
                    
                    if (data) {
                        set({
                            reviews: data.map(review => new Review(review)),
                            loading: false,
                            error: null
                        });
                    }
                }
            )
            .subscribe();
    }

    return {
        subscribe,
        fetchReviews: async () => {
            update(state => ({ ...state, loading: true }));
            try {
                const data = await fetchReviews();
                set({
                    reviews: data.map(review => new Review(review)),
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error fetching reviews:', error);
                set({
                    reviews: [],
                    loading: false,
                    error: error.message
                });
            }
        },
        addReview: async (review) => {
            const { data, error } = await supabase.from('reviews').insert([review]).select().single();
            if (error) {
                console.error('Error adding review:', error.message);
                throw new Error('Impossibile aggiungere la recensione.');
            }
            return new Review(data);
        },
        deleteReview: async (reviewId) => {
            const { error } = await supabase.from('reviews').delete().eq('id', reviewId);
            if (error) {
                console.error('Error deleting review:', error.message);
                throw new Error('Impossibile eliminare la recensione.');
            }
            return true;
        },
        updateReview: async (reviewId, updatedReview) => {
            const { data, error } = await supabase
                .from('reviews')
                .update(updatedReview)
                .eq('id', reviewId)
                .select()
                .single();

            if (error) {
                console.error('Error updating review:', error.message);
                throw new Error('Impossibile aggiornare la recensione.');
            }
            return new Review(data);
        },
        selectReview: (reviewId) => {
            selectedReviewStore.update(currentSelectedReview => {
                if (currentSelectedReview?.id === reviewId) {
                    return null;
                }
                
                return reviewId ? { id: reviewId } : null;
            });
        }
    };
};

export const reviewsStore = createReviewsStore();

if (typeof window !== 'undefined') {
    reviewsStore.fetchReviews();
}
