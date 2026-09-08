import { Backpack, BookOpen, MegaphoneOff, Pencil, Sparkles, Users, Zap } from 'lucide-react';
import type { IconComponent } from '@/lib/utils/icons';

/** Days of free trial on a first paid subscription (no card required). */
export const TRIAL_DAYS = 7;

/** Months paid for a six-month subscription (the sixth is free). */
export const SEMESTER_MONTHS_CHARGED = 5;

/** Stripe price ids come from the environment; a plan without one cannot be bought. */
/** Read through an explicit map: Next inlines only variables it can see at build time. */
const PRICE_IDS: Record<string, string | undefined> = {
	PUBLIC_STRIPE_PRICE_LITE: process.env.PUBLIC_STRIPE_PRICE_LITE,
	PUBLIC_STRIPE_PRICE_BASE: process.env.PUBLIC_STRIPE_PRICE_BASE,
	PUBLIC_STRIPE_PRICE_PRO: process.env.PUBLIC_STRIPE_PRICE_PRO,
	PUBLIC_STRIPE_PRICE_LITE_SEMESTER: process.env.PUBLIC_STRIPE_PRICE_LITE_SEMESTER,
	PUBLIC_STRIPE_PRICE_BASE_SEMESTER: process.env.PUBLIC_STRIPE_PRICE_BASE_SEMESTER,
	PUBLIC_STRIPE_PRICE_PRO_SEMESTER: process.env.PUBLIC_STRIPE_PRICE_PRO_SEMESTER
};
const priceId = (name: string): string | null => PRICE_IDS[name] || null;

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
	/** Monthly price id. */
	stripePriceId: string | null;
	/** Six-month price id; the semester option is offered only when set. */
	stripePriceIdSemester: string | null;
	access: Record<Features, boolean>;
	tutoring_hours: number;
	popular: boolean;
}

export enum Features {
	THEORY = 'theory',
	REMOVE_ADS = 'remove_ads',
	EXERCISES = 'exercises',
	FLASHCARDS = 'flashcards',
	NOTEBOOKS = 'notebooks',
	AI_CHAT = 'ai_chat',
	TUTORING = 'tutoring',
}

export const FeaturesDetails: Record<Features, { name: string; icon: IconComponent }> = {
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
	[Features.NOTEBOOKS]: {
		name: 'Quaderni e note illimitati',
		icon: Backpack,
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
		stripePriceIdSemester: null,
		access: {
			[Features.THEORY]: true,
			[Features.REMOVE_ADS]: false,
			[Features.EXERCISES]: false,
			[Features.FLASHCARDS]: false,
			[Features.NOTEBOOKS]: false,
			[Features.AI_CHAT]: false,
			[Features.TUTORING]: false,
		},
		tutoring_hours: 0,
		popular: false
	},
	LITE: {
		id: 'lite',
		name: 'Piano Lite',
		price: 4.99,
		currency: Currency.EURO,
		interval: 'month',
		stripePriceId: priceId('PUBLIC_STRIPE_PRICE_LITE'),
		stripePriceIdSemester: priceId('PUBLIC_STRIPE_PRICE_LITE_SEMESTER'),
		access: {
			[Features.THEORY]: true,
			[Features.REMOVE_ADS]: true,
			[Features.EXERCISES]: true,
			[Features.FLASHCARDS]: true,
			[Features.NOTEBOOKS]: true,
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
		stripePriceId: priceId('PUBLIC_STRIPE_PRICE_BASE'),
		stripePriceIdSemester: priceId('PUBLIC_STRIPE_PRICE_BASE_SEMESTER'),
		access: {
			[Features.THEORY]: true,
			[Features.REMOVE_ADS]: true,
			[Features.EXERCISES]: true,
			[Features.FLASHCARDS]: true,
			[Features.NOTEBOOKS]: true,
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
		stripePriceId: priceId('PUBLIC_STRIPE_PRICE_PRO'),
		stripePriceIdSemester: priceId('PUBLIC_STRIPE_PRICE_PRO_SEMESTER'),
		access: {
			[Features.THEORY]: true,
			[Features.REMOVE_ADS]: true,
			[Features.EXERCISES]: true,
			[Features.FLASHCARDS]: true,
			[Features.NOTEBOOKS]: true,
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

/** The plan a Stripe price id belongs to, or null for an unknown price. */
export function getPlanByPriceId(priceId: string | null | undefined): SubscriptionPlan | null {
	if (!priceId) return null;
	return (
		Object.values(SUBSCRIPTION_PLANS).find(
			(plan) => plan.stripePriceId === priceId || plan.stripePriceIdSemester === priceId
		) ?? null
	);
}

export function formatPrice(price: number, currency: Currency = Currency.EURO) {
	return new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: currency.toString()
	}).format(price);
}

