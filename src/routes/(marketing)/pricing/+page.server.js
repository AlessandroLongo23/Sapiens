export const load = async ({ locals: { user }, parent }) => {
	await parent();
	
	if (!user) {
		return {
			subscription: null
		};
	}

	// In a real app, you would fetch this from your database
	// For now, we'll use mock data
	const subscription = {
		plan: user.user_metadata?.subscription_plan || 'free',
		status: user.user_metadata?.subscription_status || 'active'
	};

	return {
		subscription
	};
};

