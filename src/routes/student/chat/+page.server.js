import { redirect } from '@sveltejs/kit';
import { checkFeatureAccess } from '$lib/utils/subscription.js';

export const load = async ({ locals: { user } }) => {
	if (!user) {
		throw redirect(302, '/');
	}

	// Check if user has access to AI chat
	// const hasAccess = checkFeatureAccess(user, 'ai_chat');
	const hasAccess = true;

	return {
		hasAccess
	};
};

