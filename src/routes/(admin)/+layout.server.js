export const load = async ({ locals: { session, user }, cookies }) => {
    return {
        session,
        user
    }
}