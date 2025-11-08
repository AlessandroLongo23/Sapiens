import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import { Subject } from '$lib/models/Subject.svelte';

async function fetchSubjects() {
    const { data, error } = await supabase
        .from('subjects')
        .select('*');
    if (error) throw new Error(error.message);
    return data.map((subject: any) => new Subject(subject));
}

export const selectedSubjectStore = writable(null);

const createSubjectsStore = () => {
    const { subscribe, set, update } = writable({
        subjects: [],
        isLoading: true,
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
                            subjects: data.map((subject: Subject) => new Subject(subject)),
                            isLoading: false,
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
            update(state => ({ ...state, isLoading: true }));
            try {
                const data = await fetchSubjects();
                set({
                    subjects: data.map((subject: Subject) => new Subject(subject)),
                    isLoading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error fetching subjects:', error);
                set({
                    subjects: [],
                    isLoading: false,
                    error: error.message
                });
            }
        },
        
        addSubject: async (subject: Subject) => {
            const { data, error } = await supabase
                .from('subjects')
                .insert([subject])
                .select()
                .single();
                
            if (error) {
                console.error('Error adding subject:', error.message);
                throw new Error('Impossibile aggiungere la materia.');
            }
        
            return new Subject(data);
        },

        deleteSubject: async (subjectId: string) => {
            const { error } = await supabase
                .from('subjects')
                .delete()
                .eq('id', subjectId);
            
            if (error) {
                console.error('Error deleting subject:', error.message);
                throw new Error('Impossibile eliminare la materia.');
            }
            return true;
        },

        updateSubject: async (subjectId: string, updatedSubject: Subject) => {
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

            return new Subject(data);
        },

        // selectSubject: (subjectId) => {
        //     selectedSubjectStore.update(currentSelectedSubject => {
        //         if (currentSelectedSubject?.id === subjectId) {
        //             return null;
        //         }
                
        //         return subjectId ? { id: subjectId } : null;
        //     });
        // }
    };
};

export const subjectsStore = createSubjectsStore();

if (typeof window !== 'undefined') {
    subjectsStore.fetchSubjects();
}
