import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';
import { Lecture } from '$lib/models/Lecture.svelte.js';

async function fetchLectures() {
    const { data, error } = await supabase
        .from('lectures')
        .select('*');
    if (error) throw new Error(error.message);
    return data.map(lecture => new Lecture(lecture));
}
    
export const selectedLectureStore = writable(null);

const createLecturesStore = () => {
    const { subscribe, set, update } = writable({
        lectures: [],
        loading: true,
        error: null
    });

    if (typeof window !== 'undefined') {
        const subscription = supabase
            .channel('lectures_changes')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'lectures'
                },
                async (payload) => {
                    const { data } = await supabase
                        .from('lectures')
                        .select('*');
                    
                    if (data) {
                        set({
                            lectures: data.map(lecture => new Lecture(lecture)),
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
        fetchLectures: async () => {
            update(state => ({ ...state, loading: true }));
            try {
                const data = await fetchLectures();
                set({
                    lectures: data.map(lecture => new Lecture(lecture)),
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error fetching lectures:', error);
                set({
                    lectures: [],
                    loading: false,
                    error: error.message
                });
            }
        },

        addLecture: async (lecture) => {
            const { data, error } = await supabase
                .from('lectures')
                .insert([lecture])
                .select()
                .single();

            if (error) {
                console.error('Error adding lecture:', error.message);
                throw new Error('Impossibile aggiungere la lezione.');
            }
            return data;
        },
        
        deleteLecture: async (lectureId) => {
            const { error } = await supabase
                .from('lectures')
                .delete()
                .eq('id', lectureId);
            
            if (error) {
                console.error('Error deleting lecture:', error.message);
                throw new Error('Impossibile eliminare la lezione.');
            }
            return true;
        },
        
        updateLecture: async (lectureId, updatedLecture) => {
            const { data, error } = await supabase
                .from('lectures')
                .update(updatedLecture)
                .eq('id', lectureId)
                .select()
                .single();

            if (error) {
                console.error('Error updating lecture:', error.message);
                throw new Error('Impossibile aggiornare la lezione.');
            }
            return data;
        },
        
        selectLecture: (lectureId) => {
            selectedLectureStore.update(currentSelectedLecture => {
                if (currentSelectedLecture?.id === lectureId) {
                    return null;
                }
                
                return lectureId ? { id: lectureId } : null;
            });
        },
    };
};

export const lecturesStore = createLecturesStore();

if (typeof window !== 'undefined') {
    lecturesStore.fetchLectures();
}
