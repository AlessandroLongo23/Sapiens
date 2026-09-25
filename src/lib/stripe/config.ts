import { Backpack, BookOpen, Pencil, Sparkles, Zap } from 'lucide-react';
import type { IconComponent } from '@/lib/utils/icons';

/**
 * Days of Studio every new account gets, without a card: the reverse trial
 * (vault/Decisioni/2026-09-23 Prova al contrario e sessione gratuita giornaliera.md).
 * Counted from the account's creation; afterwards the account is Free.
 */
export const TRIAL_DAYS = 7;

/**
 * Studio until the end of the school year, in one payment that does not renew
 * (vault/Decisioni/2026-09-25 Studio costa 9,99 euro al mese o 49,99 fino a giugno.md).
 * Sold only in `saleMonths`, when it still costs less than the monthly plan until June.
 */
export const SCHOOL_YEAR_PASS = {
	price: 49.99,
	/** Months (1-12, Rome time) in which it is on sale. */
	saleMonths: [1, 2],
	/** Last day of access, month and day, of the year it is bought in. */
	endMonth: 6,
	endDay: 30
} as const;

/** Stripe price ids come from the environment; a plan without one cannot be bought. */
/** Read through an explicit map: Next inlines only variables it can see at build time. */
const PRICE_IDS: Record<string, string | undefined> = {
	PUBLIC_STRIPE_PRICE_STUDIO: process.env.PUBLIC_STRIPE_PRICE_STUDIO,
	PUBLIC_STRIPE_PRICE_STUDIO_JUNE: process.env.PUBLIC_STRIPE_PRICE_STUDIO_JUNE
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
	/** The one-off "until June" price id; the option is offered only when set and on sale. */
	stripePassPriceId: string | null;
	access: Record<Features, boolean>;
	popular: boolean;
}

export enum Features {
	THEORY = 'theory',
	EXERCISES = 'exercises',
	FLASHCARDS = 'flashcards',
	NOTEBOOKS = 'notebooks',
	AI_CHAT = 'ai_chat',
}

export const FeaturesDetails: Record<Features, { name: string; icon: IconComponent }> = {
	[Features.THEORY]: {
		name: 'Teoria e formulari',
		icon: BookOpen,
	},
	[Features.EXERCISES]: {
		name: 'Esercizi senza limiti',
		icon: Pencil,
	},
	[Features.FLASHCARDS]: {
		name: 'Flashcard',
		icon: Zap,
	},
	[Features.NOTEBOOKS]: {
		name: 'Quaderni e note senza limiti',
		icon: Backpack,
	},
	[Features.AI_CHAT]: {
		name: 'Sapiens AI',
		icon: Sparkles,
	},
}

export const PLAN_DESCRIPTIONS: Record<string, string> = {
	free: 'Per iniziare. Teoria e formulari di tutte le lezioni, una sessione di esercizi al giorno con i progressi salvati e un quaderno nello Zaino.',
	studio: 'Per chi si allena con regolarità. Esercizi senza limiti con i progressi, flashcard, Zaino senza limiti e Sapiens AI per le domande sulla lezione.'
};

/**
 * Free and Studio: the only plans of the beta (vault/Decisioni/2026-09-23 Piani che crescono con le funzioni.md).
 * Free's exercises are one session a day, counted on the server: `access` says what is unlimited.
 */
export const SUBSCRIPTION_PLANS: { FREE: SubscriptionPlan; STUDIO: SubscriptionPlan } = {
	FREE: {
		id: 'free',
		name: 'Free',
		price: 0,
		currency: Currency.EURO,
		interval: 'month',
		stripePriceId: null,
		stripePassPriceId: null,
		access: {
			[Features.THEORY]: true,
			[Features.EXERCISES]: false,
			[Features.FLASHCARDS]: false,
			[Features.NOTEBOOKS]: false,
			[Features.AI_CHAT]: false,
		},
		popular: false
	},
	STUDIO: {
		id: 'studio',
		name: 'Studio',
		price: 9.99,
		currency: Currency.EURO,
		interval: 'month',
		stripePriceId: priceId('PUBLIC_STRIPE_PRICE_STUDIO'),
		stripePassPriceId: priceId('PUBLIC_STRIPE_PRICE_STUDIO_JUNE'),
		access: {
			[Features.THEORY]: true,
			[Features.EXERCISES]: true,
			[Features.FLASHCARDS]: true,
			[Features.NOTEBOOKS]: true,
			[Features.AI_CHAT]: true,
		},
		popular: true
	}
};

/** Plans before the beta, still on some accounts: each is Studio now. */
const LEGACY_PLAN_IDS = new Set(['lite', 'base', 'pro']);

/** Today's date in Rome as YYYY-MM-DD: the day a school day, a daily session or a pass belongs to. */
export function romeDate(now: Date = new Date()): string {
	return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}

/** Whether the "until June" pass can be bought today. */
export function passOnSale(now: Date = new Date()): boolean {
	return (SCHOOL_YEAR_PASS.saleMonths as readonly number[]).includes(Number(romeDate(now).slice(5, 7)));
}

/** The last day of a pass bought today: 30 June of this year, as YYYY-MM-DD. */
export function passEnd(now: Date = new Date()): string {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${romeDate(now).slice(0, 4)}-${pad(SCHOOL_YEAR_PASS.endMonth)}-${pad(SCHOOL_YEAR_PASS.endDay)}`;
}

/** 2027-06-30 → "30 giugno 2027". */
export const formatDay = (day: string) => new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${day}T12:00:00Z`));

export function getPlanById(planId: string): SubscriptionPlan {
	if (LEGACY_PLAN_IDS.has(planId)) return SUBSCRIPTION_PLANS.STUDIO;
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
			(plan) => plan.stripePriceId === priceId || plan.stripePassPriceId === priceId
		) ?? null
	);
}

export function formatPrice(price: number, currency: Currency = Currency.EURO) {
	return new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: currency.toString()
	}).format(price);
}

