import { supabase } from '$lib/supabase.js';
import { messagePopup } from '$lib/components/messagePopup/messagePopup';

export const fetchStudents = async () => {
    const { data, error } = await supabase
        .from('students')
        .select('*');

    if (error) {
        console.error('Error fetching students:', error);
        throw error;
    }

    return data;
};

export const deleteStudent = async (id) => {
    const response = await fetch('/api/students', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error || 'Failed to delete student');
    }

    return result;
};

export const updateStudent = async (studentId, studentData) => {
    const { data, error } = await supabase
        .from('students')
        .update({
            first_name: studentData.first_name,
            last_name: studentData.last_name,
            email: studentData.email,
            phone: studentData.phone,
            level: studentData.level,
            city: studentData.city,
        })
        .eq('id', studentId)
        .select()
        .single();

    if (error) {
        console.error('Error updating student:', error);
        throw error;
    }

    return data;
};

export const addStudent = async (newStudent) => {
    const { error } = await supabase
        .from('students')
        .insert(newStudent);

    if (error) {
        console.error('Error adding student:', error);
        throw error;
    }
};

