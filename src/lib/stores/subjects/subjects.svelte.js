import { supabase } from '$lib/supabase.js';

export const fetchSubjects = async () => {
    try {
        const { data, error } = await supabase
            .from('subjects')
            .select('*');

        if (error) {
            console.error('Error fetching subjects:', error);
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error fetching subjects:', error);
        throw error;
    }
};

export const addSubject = async (newSubject) => {
    try {
        const { data, error } = await supabase
            .from('subjects')
            .insert(newSubject);

        if (error) {
            console.error('Error adding subject:', error);
            throw error;
        }

        return data, error;
    } catch (error) {
        console.error('Error adding subject:', error);
        throw error;
    }
};

export const updateSubject = async (subjectId, subjectData) => {
    try {
    const { data, error } = await supabase
        .from('subjects')
        .update({
            name: subjectData.name,
            description: subjectData.description,
            color: subjectData.color,
        })
        .eq('id', subjectId)
        .select()
        .single();

        if (error) {
            console.error('Error updating subject:', error);
            throw error;
        }

        return data, error;
    } catch (error) {
        console.error('Error updating subject:', error);
        throw error;
    }
};

export const deleteSubject = async (id) => {
    const response = await fetch('/api/subjects', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'Failed to delete subject');
    }

    return result;
};