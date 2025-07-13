import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { session, user } }) => {
    return { session, user };
}