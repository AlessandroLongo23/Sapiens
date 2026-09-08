import { authStore } from '@/lib/state/auth';

/**
 * Starts a Stripe Checkout from anywhere in the UI. An anonymous visitor is
 * asked to log in first; the checkout then continues on its own.
 */
export interface CheckoutOptions {
	planId: string;
	billing?: 'monthly' | 'semester';
	/** Page to return to after payment (the locked exercises, for example). */
	returnTo?: string;
}

export class CheckoutError extends Error {
	constructor(
		public code: 'login_required' | 'failed',
		message: string
	) {
		super(message);
	}
}

/** Calls the checkout API and redirects to Stripe. Rejects with a CheckoutError. */
export async function startCheckout(options: CheckoutOptions): Promise<void> {
	const response = await fetch('/api/stripe/checkout', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ billing: 'monthly', ...options })
	});
	const body = await response.json().catch(() => ({}));
	if (response.status === 401) throw new CheckoutError('login_required', body.error ?? 'Accedi per continuare.');
	if (!response.ok || !body.url) throw new CheckoutError('failed', body.error ?? 'Errore durante la creazione della sessione di pagamento.');
	window.location.href = body.url;
}

/** Same as `startCheckout`, but opens the login modal for anonymous visitors and resumes the checkout once they are in. */
export async function requestCheckout(options: CheckoutOptions): Promise<void> {
	const { user, openModal } = authStore.getState();
	if (!user) return openModal({ register: true, next: () => startCheckout(options) });
	try {
		await startCheckout(options);
	} catch (err) {
		if (err instanceof CheckoutError && err.code === 'login_required') return openModal({ next: () => startCheckout(options) });
		throw err;
	}
}
