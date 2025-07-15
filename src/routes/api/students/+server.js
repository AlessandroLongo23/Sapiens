import { json } from '@sveltejs/kit';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';

export async function POST({ request, locals: { supabase } }) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user?.user_metadata?.role !== 'admin') {
            return json({ success: false, error: 'Unauthorized' }, { status: 403 });
        }

        const { student } = await request.json();

        const supabaseAdmin = createClient(
            PUBLIC_SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY
        );

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            fullName: `${student.firstName} ${student.lastName}`,
            email: student.email,
            password: student.password,
            phone: student.phone,
            email_confirm: true,
            user_metadata: {
                role: 'student'
            }
        });

        if (authError) throw authError;

        const { error: dbError } = await supabaseAdmin
            .from('students')
            .insert({
                id: authData.user.id,
                first_name: student.firstName,
                last_name: student.lastName,
                phone: student.phone,
                city: student.city,
                level: student.level,
            });

        if (dbError) throw dbError;

        return json({ success: true, user: authData.user });

    } catch (error) {
        console.error('Error creating student:', error);
        return json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE({ request, locals: { supabase } }) {
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            return json({ success: false, error: 'Not authenticated' }, { status: 401 });
        }

        const { id } = await request.json();
        if (!id) {
            return json({ success: false, error: 'Student ID is required' }, { status: 400 });
        }

        const supabaseAdmin = createClient(
            PUBLIC_SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY
        );

        const { data: currentUser, error: currentUserError } = await supabaseAdmin
            .from('students')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (currentUserError || !currentUser) {
            return json({ success: false, error: 'User not found in students table' }, { status: 403 });
        }

        if (currentUser.role !== 'admin') {
            return json({ success: false, error: 'Unauthorized - Admin role required' }, { status: 403 });
        }

        const { error: dbError } = await supabaseAdmin
            .from('students')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;

        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

        if (authError) {
            console.warn('Auth user deletion failed:', authError.message);
        }

        return json({ success: true });

    } catch (error) {
        console.error('Error deleting student:', error);
        return json({ success: false, error: error.message }, { status: 500 });
    }
} 