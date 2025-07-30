import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

async function fetchSubjects() {
    const { data, error } = await supabase
        .from('subjects')
        .select('*');
    if (error) throw new Error(error.message);
    return data;
}

export const selectedSubjectStore = writable(null);

const createSubjectsStore = () => {
    const { subscribe, set, update } = writable({
        subjects: [],
        loading: true,
        error: null
    });

    if (typeof window !== 'undefined') {
        const subscription = supabase
            .channel('subjects_changes')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'subjects'
                },
                async (payload) => {
                    const { data } = await supabase
                        .from('subjects')
                        .select('*');
                    
                    if (data) {
                        set({
                            subjects: data,
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
        fetchSubjects: async () => {
            update(state => ({ ...state, loading: true }));
            try {
                const data = await fetchSubjects();
                set({
                    subjects: data,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error fetching subjects:', error);
                set({
                    subjects: [],
                    loading: false,
                    error: error.message
                });
            }
        },
        addSubject: async (subject) => {
            const { data, error } = await supabase.from('subjects').insert([subject]).select().single();
            if (error) {
                console.error('Error adding subject:', error.message);
                throw new Error('Impossibile aggiungere la materia.');
            }
            return data;
        },
        deleteSubject: async (subjectId) => {
            const { error } = await supabase.from('subjects').delete().eq('id', subjectId);
            if (error) {
                console.error('Error deleting subject:', error.message);
                throw new Error('Impossibile eliminare la materia.');
            }
            return true;
        },
        updateSubject: async (subjectId, updatedSubject) => {
            const { data, error } = await supabase
                .from('subjects')
                .update(updatedSubject)
                .eq('id', subjectId)
                .select()
                .single();

            if (error) {
                console.error('Error updating subject:', error.message);
                throw new Error('Impossibile aggiornare la materia.');
            }

            return data;
        },
        selectSubject: (subjectId) => {
            selectedSubjectStore.update(currentSelectedSubject => {
                if (currentSelectedSubject?.id === subjectId) {
                    return null;
                }
                
                return subjectId ? { id: subjectId } : null;
            });
        }
    };
};

export const subjectsStore = createSubjectsStore();

if (typeof window !== 'undefined') {
    subjectsStore.fetchSubjects();
}
