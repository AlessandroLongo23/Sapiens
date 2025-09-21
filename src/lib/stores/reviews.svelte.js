import { supabase } from '$lib/supabase.js';

export const fetchReviews = async () => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*');

        if (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        throw error;
    }
};

export const fetchStudentReview = async (studentId) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('student_id', studentId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error('Error fetching student review:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error fetching student review:', error);
        throw error;
    }
};

export const addReview = async (newReview) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .insert(newReview);

        if (error) {
            console.error('Error adding review:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error adding review:', error);
        throw error;
    }
};

export const updateReview = async (reviewId, reviewData) => {
    try {
    const { data, error } = await supabase
        .from('reviews')
        .update({
            rating: reviewData.rating,
            review: reviewData.review,
        })
        .eq('id', reviewId)
        .select()
        .single();

        if (error) {
            console.error('Error updating review:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error updating review:', error);
        throw error;
    }
};

export const deleteReview = async (reviewId) => {
    const { error } = await supabase.from('reviews').delete().eq('id', reviewId);

    if (error) {
        console.error('Error deleting review:', error);
        throw error;
    }

    return true;
};