import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { GSC_VERIFICATION, SITE_LANG, SITE_URL } from '@/lib/config/site';
import { pageMetadata } from '@/lib/seo/page-metadata';
import { organizationJsonLd, webSiteJsonLd } from '@/lib/seo/jsonld';
import { JsonLd } from '@/components/seo/JsonLd';
import { Boot } from '@/components/shell/Boot';
import { AuthModal } from '@/components/shell/AuthModal';
import { CookieBanner } from '@/components/shell/CookieBanner';
import './globals.css';

// Self-hosted at build time by next/font: no request to Google, no layout shift.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
// Only lesson code blocks use the mono face, so it is not preloaded on every page.
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
	themeColor: '#ff3666'
};

/** Applies the stored or system theme before the first paint, so there is no flash. */
const THEME_SCRIPT = `(function(){try{var s=localStorage.getItem('theme'),d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches,t=s||(d?'dark':'light'),r=document.documentElement;r.classList.add('disable-transitions');r.classList.toggle('dark',t==='dark');setTimeout(function(){r.classList.remove('disable-transitions')},120)}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang={SITE_LANG} className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
			</head>
			<body>
				<JsonLd data={[organizationJsonLd(), webSiteJsonLd()]} />
				<a href="#contenuto" className="skip-link">
					Vai al contenuto
				</a>
				<Boot />
				<AuthModal />
				<CookieBanner />
				{children}
			</body>
		</html>
	);
}
