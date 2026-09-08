import { create } from 'zustand';
import { LEGAL_VERSIONS } from '@/lib/config/legal';

/**
 * Cookie consent, following the Garante's guidelines of 10 June 2021:
 * nothing but strictly necessary cookies before a choice; "Rifiuta" as easy
 * as "Accetta"; scrolling is not consent; the choice is kept for six months,
 * then asked again; a link in the footer reopens it any time.
 *
 * The choice lives in a first-party cookie (readable server-side, unlike
 * localStorage). A refusal is recorded too. Bumping `LEGAL_VERSIONS.cookies`
 * invalidates every stored choice, which is how re-consent is asked.
 */
export const CONSENT_COOKIE = 'sapiens-cookie-consent';
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180; // six months, the Garante's re-prompt window

export interface Consent {
	necessary: true;
	analytics: boolean;
	version: string;
	timestamp: string;
}

export function readConsentCookie(cookieString: string): Consent | null {
	const row = cookieString.split('; ').find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
	if (!row) return null;
	try {
		const parsed = JSON.parse(decodeURIComponent(row.slice(CONSENT_COOKIE.length + 1))) as Partial<Consent>;
		if (parsed.version !== LEGAL_VERSIONS.cookies || parsed.necessary !== true) return null;
		if (typeof parsed.analytics !== 'boolean' || typeof parsed.timestamp !== 'string') return null;
		return { necessary: true, analytics: parsed.analytics, version: parsed.version, timestamp: parsed.timestamp };
	} catch {
		return null;
	}
}

function writeConsentCookie(consent: Consent): void {
	const secure = window.location.protocol === 'https:' ? '; Secure' : '';
	document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}; Path=/; Max-Age=${CONSENT_MAX_AGE}; SameSite=Lax${secure}`;
}

interface ConsentState {
	consent: Consent | null;
	/** True once the cookie has been read in the browser. */
	hydrated: boolean;
	bannerOpen: boolean;
	customizeOpen: boolean;
	hydrate: () => void;
	save: (analytics: boolean) => void;
	openCustomize: () => void;
	closeCustomize: () => void;
	/** From the footer link: show the banner again, on the default view. */
	reopen: () => void;
	/** Escape: hide the banner, but only once a choice exists. */
	close: () => void;
}

export const useConsent = create<ConsentState>((set, get) => ({
	consent: null,
	hydrated: false,
	bannerOpen: false,
	customizeOpen: false,
	hydrate() {
		if (get().hydrated) return;
		const consent = readConsentCookie(document.cookie);
		set({ consent, bannerOpen: consent === null, hydrated: true });
	},
	save(analytics) {
		const consent: Consent = { necessary: true, analytics, version: LEGAL_VERSIONS.cookies, timestamp: new Date().toISOString() };
		writeConsentCookie(consent);
		set({ consent, bannerOpen: false, customizeOpen: false });
	},
	openCustomize: () => set({ customizeOpen: true }),
	closeCustomize: () => set({ customizeOpen: false }),
	reopen: () => set({ customizeOpen: false, bannerOpen: true }),
	close: () => get().consent && set({ bannerOpen: false })
}));

export const analyticsAllowed = () => useConsent.getState().consent?.analytics === true;
