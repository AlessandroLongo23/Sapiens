import { MegaphoneOff, BookOpen, Pencil, Zap, Sparkles, Users } from 'lucide-svelte';

export enum Currency {
	EURO = 'EUR',
	DOLLAR = 'USD',
	POUND = 'GBP',
}

export interface SubscriptionPlan {
	id: string;
	name: string;
	price: number;
	currency: Currency;
	interval: string;
	stripePriceId: string | null;
	access: Record<Features, boolean>;
	tutoring_hours: number;
	popular: boolean;
}

export enum Features {
	THEORY = 'theory',
	REMOVE_ADS = 'remove_ads',
	EXERCISES = 'exercises',
	FLASHCARDS = 'flashcards',
	AI_CHAT = 'ai_chat',
	TUTORING = 'tutoring',
}

export const FeaturesDetails: Record<Features, { name: string; icon: typeof BookOpen }> = {
	[Features.THEORY]: {
		name: 'Accesso a teoria e formulari',
		icon: BookOpen,
	},
	[Features.REMOVE_ADS]: {
		name: 'Rimozione pubblicità',
		icon: MegaphoneOff,
	},
	[Features.EXERCISES]: {
		name: 'Esercizi interattivi',
		icon: Pencil,
	},
	[Features.FLASHCARDS]: {
		name: 'Flashcards',
		icon: Zap,
	},
	[Features.AI_CHAT]: {
		name: 'Chat con Sapiens AI',
		icon: Sparkles,
	},	
	[Features.TUTORING]: {
		name: 'Ripetizioni 1 a 1',
		icon: Users,
	},
}

export const PLAN_DESCRIPTIONS: Record<string, string> = {
	free: 'Perfetto per iniziare. Accedi a tutti i contenuti teorici gratuitamente e scopri come Sapiens può aiutarti nello studio.',
	lite: 'Ideale per chi vuole esercitarsi. Oltre alla teoria, hai accesso a esercizi interattivi e formulari completi per consolidare le tue conoscenze.',
	base: 'Il piano più popolare. Include tutto di Lite più la chat con Sapiens AI per rispondere a tutte le tue domande in tempo reale.',
	pro: 'La soluzione completa. Tutto di Base più ripetizioni settimanali con tutor dedicati per un supporto personalizzato e mirato.'
};

export const SUBSCRIPTION_PLANS = {
	FREE: {
		id: 'free',
		name: 'Piano Free',
		price: 0,
		currency: Currency.EURO,
		interval: 'month',
		stripePriceId: null,
		access: {
			[Features.THEORY]: true,
			[Features.REMOVE_ADS]: false,
			[Features.EXERCISES]: false,
			[Features.FLASHCARDS]: false,
			[Features.AI_CHAT]: false,
			[Features.TUTORING]: false,
		},
		tutoring_hours: 0,
		popular: false
	},
	LITE: {
		id: 'lite',
		name: 'Piano Lite',
		price: 9.99,
		currency: Currency.EURO,
		interval: 'month',
		stripePriceId: import.meta.env.PUBLIC_STRIPE_PRICE_LITE,
		access: {
			[Features.THEORY]: true,
			[Features.REMOVE_ADS]: true,
			[Features.EXERCISES]: true,
			[Features.FLASHCARDS]: true,
			[Features.AI_CHAT]: false,
			[Features.TUTORING]: false,
		},
		tutoring_hours: 0,
		popular: false
	},
	BASE: {
		id: 'base',
		name: 'Piano Base',
		price: 19.99,
		currency: Currency.EURO,
		interval: 'month',
		stripePriceId: import.meta.env.PUBLIC_STRIPE_PRICE_BASE,
		access: {
			[Features.THEORY]: true,
			[Features.REMOVE_ADS]: true,
			[Features.EXERCISES]: true,
			[Features.FLASHCARDS]: true,
			[Features.AI_CHAT]: true,
			[Features.TUTORING]: false,
		},
		tutoring_hours: 0,
		popular: true
	},
	PRO: {
		id: 'pro',
		name: 'Piano Pro',
		price: 59.99,
		currency: Currency.EURO,
		interval: 'month',
		stripePriceId: import.meta.env.PUBLIC_STRIPE_PRICE_PRO,
		access: {
			[Features.THEORY]: true,
			[Features.REMOVE_ADS]: true,
			[Features.EXERCISES]: true,
			[Features.FLASHCARDS]: true,
			[Features.AI_CHAT]: true,
			[Features.TUTORING]: true,
		},
		tutoring_hours: 1,
		popular: false
	}
};

export function getPlanById(planId: string): SubscriptionPlan {
	const plan = Object.values(SUBSCRIPTION_PLANS).find(plan => plan.id === planId);
	if (!plan) {
		return SUBSCRIPTION_PLANS.FREE;
	}
	return plan;
}

export function canAccessFeature(userPlan: string, feature: Features) {
	const plan = getPlanById(userPlan);
	return plan?.access?.[feature] || false;
}

export function formatPrice(price: number, currency: Currency = Currency.EURO) {
	return new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: currency.toString()
	}).format(price);
}

