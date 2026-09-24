import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { APP_START, GSC_VERIFICATION, SITE_LANG, SITE_URL } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { organizationJsonLd, webSiteJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Boot } from '@/components/shell/Boot';
import { AuthModal } from '@/components/shell/AuthModal';
import { CookieBanner } from '@/components/shell/CookieBanner';
import { InstallPrompt } from '@/components/shell/InstallPrompt';
import './globals.css';

// Self-hosted at build time by next/font: no request to Google, no layout shift.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
// Display serif for titles; the optical-size axis keeps it crisp from a card title to a page title.
const fraunces = Fraunces({ subsets: ['latin'], display: 'swap', variable: '--font-fraunces', axes: ['opsz', 'SOFT'] });
// Mono sets counts, numbering and code; it is not preloaded on every page.
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'], display: 'swap', variable: '--font-jetbrains', preload: false });

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	...pageMetadata({ path: '/' }),
	icons: {
		icon: [
			{ url: '/favicon.svg', type: 'image/svg+xml' },
			{ url: '/favicon-32.png', type: 'image/png', sizes: '32x32' }
		],
		apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }]
	},
	manifest: '/site.webmanifest',
	...(GSC_VERIFICATION ? { verification: { google: GSC_VERIFICATION } } : {})
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	viewportFit: 'cover',
	interactiveWidget: 'resizes-content',
	themeColor: [
		{ media: '(prefers-color-scheme: light)', color: '#f8f5ef' },
		{ media: '(prefers-color-scheme: dark)', color: '#16181f' }
	]
};

/** Applies the stored or system theme before the first paint, so there is no flash. */
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('theme'),d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches,t=s||(d?'dark':'light'),r=document.documentElement;r.classList.add('disable-transitions');r.classList.toggle('dark',t==='dark');setTimeout(function(){r.classList.remove('disable-transitions')},120)}catch(e){}})();`;

/**
 * Marks the installed app (`html.app`) before the first paint: a PWA opened
 * from the home screen, or the Capacitor app, whose user agent ends in
 * "SapiensApp" (see capacitor.config.json). The app never shows the landing
 * page: it opens on APP_START.
 */
const APP_SCRIPT = `(function(){try{var n=navigator;if(!(window.matchMedia('(display-mode: standalone)').matches||n.standalone===true||/SapiensApp/.test(n.userAgent)))return;document.documentElement.classList.add('app');if(location.pathname==='/')location.replace('${APP_START}')}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang={SITE_LANG} className={`${inter.variable} ${fraunces.variable} ${mono.variable}`} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
				<script dangerouslySetInnerHTML={{ __html: APP_SCRIPT }} />
			</head>
			<body>
				<JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
				<a href="#contenuto" className="skip-link">
					Vai al contenuto
				</a>
				<Boot />
				<AuthModal />
				<CookieBanner />
				<InstallPrompt />
				{children}
			</body>
		</html>
	);
}
