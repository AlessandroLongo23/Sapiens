import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

async function fetchStudents() {
    const { data, error } = await supabase
        .from('students')
        .select('*');
    if (error) throw new Error(error.message);
    return data;
}

export const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Studente', value: 'student' }
];

export const levels = [
    { label: 'Scuola Media', value: 'media' },
    { label: 'Scuole Superiori', value: 'superiori' },
    { label: 'Università', value: 'universita' },
    { label: 'Altro', value: 'altro' }
];

export const selectedStudentStore = writable(null);

const createStudentsStore = () => {
    const { subscribe, set, update } = writable({
        students: [],
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
                    table: 'students'
                },
                async (payload) => {
                    const { data } = await supabase
                        .from('students')
                        .select('*');
                    
                    if (data) {
                        set({
                            students: data,
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
        fetchStudents: async () => {
            update(state => ({ ...state, loading: true }));
            try {
                const data = await fetchStudents();
                set({
                    students: data,
                    loading: false,
                    error: null
                });
            } catch (error) {
                console.error('Error fetching students:', error);
                set({
                    students: [],
                    loading: false,
                    error: error.message
                });
            }
        },
        addStudent: async (student) => {
            const { data, error } = await supabase.from('students').insert([student]).select().single();
            if (error) {
                console.error('Error adding student:', error.message);
                throw new Error('Impossibile aggiungere lo studente.');
            }
            return data;
        },
        deleteStudent: async (studentId) => {
            const { error } = await supabase.from('students').delete().eq('id', studentId);
            if (error) {
                console.error('Error deleting student:', error.message);
                throw new Error('Impossibile eliminare lo studente.');
            }
            return true;
        },
        updateStudent: async (studentId, updatedStudent) => {
            const { data, error } = await supabase
                .from('students')
                .update(updatedStudent)
                .eq('id', studentId)
                .select()
                .single();

            if (error) {
                console.error('Error updating student:', error.message);
                throw new Error('Impossibile aggiornare lo studente.');
            }
            return data;
        },
        selectStudent: (studentId) => {
            selectedStudentStore.update(currentSelectedStudent => {
                if (currentSelectedStudent?.id === studentId) {
                    return null;
                }
                
                return studentId ? { id: studentId } : null;
            });
        }
    };
};

export const studentsStore = createStudentsStore();

if (typeof window !== 'undefined') {
    studentsStore.fetchStudents();
}
