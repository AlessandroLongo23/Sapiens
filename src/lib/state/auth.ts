import { create } from 'zustand';
import type { User } from '@supabase/supabase-js';

/**
 * Login state in the browser, shared by the header, the paywall and the AI
 * sidebar. Public pages are cached without any user data, so this is filled
 * after hydration from the cookie session and kept in sync with Supabase.
 * It also owns the login modal, so any component can ask for a login and
 * continue with an action once it succeeds (`openModal({ next })`).
 */
type AfterLogin = () => void | Promise<void>;

interface AuthState {
	user: User | null;
	/** False until the cookie session has been read once. */
	ready: boolean;
	modalOpen: boolean;
	modalRegister: boolean;
	next: AfterLogin | null;
	/** Refreshes server-rendered data after a login; set by the layout. */
	refreshServer: () => void;
	init: () => Promise<void>;
	openModal: (options?: { register?: boolean; next?: AfterLogin }) => void;
	closeModal: () => void;
	setRegister: (register: boolean) => void;
	completeLogin: (user: User) => Promise<void>;
	refresh: () => Promise<void>;
	signOut: () => Promise<void>;
}

let started = false;

export const authStore = create<AuthState>((set, get) => ({
	user: null,
	ready: false,
	modalOpen: false,
	modalRegister: false,
	next: null,
	refreshServer: () => {},

	async init() {
		if (started || typeof window === 'undefined') return;
		started = true;
		try {
			const { getBrowserClient } = await import('@/lib/auth/client');
			const supabase = getBrowserClient();
			const { data } = await supabase.auth.getSession();
			set({ user: data.session?.user ?? null });
			supabase.auth.onAuthStateChange((_event, session) => set({ user: session?.user ?? null }));
		} catch (err) {
			console.error('auth init failed', err);
		} finally {
			set({ ready: true });
		}
	},

	openModal: (options = {}) => set({ modalRegister: options.register ?? false, next: options.next ?? null, modalOpen: true }),
	closeModal: () => set({ modalOpen: false, next: null }),
	setRegister: (modalRegister) => set({ modalRegister }),

	/** Called by the login form: refresh server data, then run the pending action. */
	async completeLogin(user) {
		const { next, refreshServer } = get();
		// The browser client has just written the session cookies; wait until the server sees them, so the
		// refresh and whatever was waiting for the login (a request, a checkout) run as the signed-in user.
		for (let attempt = 0; attempt < 5; attempt++) {
			const me = await fetch('/api/me', { cache: 'no-store' }).then((r) => r.json()).catch(() => null);
			if (me?.user?.id === user.id) break;
			await new Promise((r) => setTimeout(r, 150));
		}
		set({ user, modalOpen: false, next: null });
		refreshServer();
		if (next) await next();
	},

	/** Pull a fresh token so `app_metadata` (the subscription) is current after checkout. */
	async refresh() {
		try {
			const { getBrowserClient } = await import('@/lib/auth/client');
			const { data } = await getBrowserClient().auth.refreshSession();
			if (data.session) set({ user: data.session.user });
		} catch (err) {
			console.error('session refresh failed', err);
		}
	},

	async signOut() {
		try {
			const { getBrowserClient } = await import('@/lib/auth/client');
			await getBrowserClient().auth.signOut();
		} finally {
			set({ user: null });
		}
	}
}));

export const useAuth = authStore;
