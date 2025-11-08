// Subscription plan configuration
export const SUBSCRIPTION_PLANS = {
	FREE: {
		id: 'free',
		name: 'Piano Free',
		price: 0,
		currency: 'EUR',
		interval: 'month',
		stripePriceId: null, // No Stripe price needed for free plan
		features: [
			'Accesso alla teoria',
			'Materiali didattici base',
		],
		limits: {
			theory: true,
			exercises: false,
			ai_chat: false,
			tutoring: false
		}
	},
	LITE: {
		id: 'lite',
		name: 'Piano Lite',
		price: 9.99,
		currency: 'EUR',
		interval: 'month',
		stripePriceId: import.meta.env.PUBLIC_STRIPE_PRICE_LITE,
		features: [
			'Tutto del Piano Free',
			'Esercizi interattivi',
			'Formulari completi',
			'Statistiche e progressi'
		],
		limits: {
			theory: true,
			exercises: true,
			ai_chat: false,
			tutoring: false
		}
	},
	BASE: {
		id: 'base',
		name: 'Piano Base',
		price: 19.99,
		currency: 'EUR',
		interval: 'month',
		stripePriceId: import.meta.env.PUBLIC_STRIPE_PRICE_BASE, // Set in Stripe Dashboard
		features: [
			'Tutto del Piano Lite',
			'Sapiens AI - Chat illimitata',
			'Supporto prioritario',
			'Materiali avanzati'
		],
		limits: {
			theory: true,
			exercises: true,
			ai_chat: true,
			tutoring: false
		},
		popular: true
	},
	PRO: {
		id: 'pro',
		name: 'Piano Pro',
		price: 49.99,
		currency: 'EUR',
		interval: 'month',
		stripePriceId: import.meta.env.PUBLIC_STRIPE_PRICE_PRO, // Set in Stripe Dashboard
		features: [
			'Tutto del Piano Base',
			'Ripetizioni 1-on-1 (1h/settimana)',
			'Calendario personalizzato',
			'Supporto dedicato 24/7',
			'Materiali esclusivi'
		],
		limits: {
			theory: true,
			exercises: true,
			ai_chat: true,
			tutoring: true,
			tutoring_hours: 1
		}
	}
};

// Helper to get plan by ID
export function getPlanById(planId) {
	return Object.values(SUBSCRIPTION_PLANS).find(plan => plan.id === planId) || SUBSCRIPTION_PLANS.FREE;
}

// Helper to check if user can access a feature
export function canAccessFeature(userPlan, feature) {
	const plan = getPlanById(userPlan);
	return plan?.limits?.[feature] || false;
}

// Helper to format price
export function formatPrice(price, currency = 'EUR') {
	return new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: currency
	}).format(price);
}

