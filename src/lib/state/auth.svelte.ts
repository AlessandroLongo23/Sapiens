import { invalidateAll } from '$app/navigation';
import type { User } from '@supabase/supabase-js';

/**
 * Login state in the browser, shared by the header, the paywall and the AI
 * sidebar. Public pages are cached without any user data, so this is filled
 * after hydration from the cookie session and kept in sync with Supabase.
 *
 * It also owns the login modal, so any component can ask for a login and
 * continue with an action once it succeeds (`openModal({ next })`).
 */
type AfterLogin = () => void | Promise<void>;

class AuthState {
	user = $state<User | null>(null);
	/** False until the cookie session has been read once. */
	ready = $state(false);
	modalOpen = $state(false);
	modalRegister = $state(false);

	#started = false;
	#next: AfterLogin | null = null;

	async init(): Promise<void> {
		if (this.#started || typeof window === 'undefined') return;
		this.#started = true;
		try {
			const { getBrowserClient } = await import('$lib/auth/client');
			const supabase = getBrowserClient();
			const { data } = await supabase.auth.getSession();
			this.user = data.session?.user ?? null;
			supabase.auth.onAuthStateChange((_event, session) => {
				this.user = session?.user ?? null;
			});
		} catch (err) {
			console.error('auth init failed', err);
		} finally {
			this.ready = true;
		}
	}

	openModal(options: { register?: boolean; next?: AfterLogin } = {}): void {
		this.modalRegister = options.register ?? false;
		this.#next = options.next ?? null;
		this.modalOpen = true;
	}

	closeModal(): void {
		this.modalOpen = false;
		this.#next = null;
	}

	/** Called by the login form: refresh server data, then run the pending action. */
	async completeLogin(user: User): Promise<void> {
		this.user = user;
		this.modalOpen = false;
		await invalidateAll();
		const next = this.#next;
		this.#next = null;
		if (next) await next();
	}

	/** Pull a fresh token so `app_metadata` (the subscription) is current after checkout. */
	async refresh(): Promise<void> {
		try {
			const { getBrowserClient } = await import('$lib/auth/client');
			const { data } = await getBrowserClient().auth.refreshSession();
			if (data.session) this.user = data.session.user;
		} catch (err) {
			console.error('session refresh failed', err);
		}
	}

	async signOut(): Promise<void> {
		try {
			const { getBrowserClient } = await import('$lib/auth/client');
			await getBrowserClient().auth.signOut();
		} finally {
			this.user = null;
		}
	}
}

export const authState = new AuthState();
