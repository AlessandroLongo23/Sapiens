import { fetchStudents } from '$lib/stores/students.svelte.js';
import { writable } from 'svelte/store';
import { supabase } from '$lib/supabase';

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
        addStudent: (student) => {
            update(state => ({
                ...state,
                students: [...state.students, student]
            }));
        },
        deleteStudent: (studentId) => {
            selectedStudentStore.update(selectedStudent => 
                selectedStudent?.id === studentId ? null : selectedStudent
            );

            update(state => ({
                ...state,
                students: state.students.filter(student => student.id !== studentId)
            }));
        },
        updateStudent: (studentId, updatedStudent) => {
            selectedStudentStore.update(selectedStudent => 
                selectedStudent?.id === studentId ? updatedStudent : selectedStudent
            );

            update(state => ({
                ...state,
                students: state.students.map(student => 
                    student.id === studentId ? updatedStudent : student
                )
            }));
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
