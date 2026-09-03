import adapter from '@sveltejs/adapter-vercel';

const config = {
	kit: {
		// Public content and marketing pages use Incremental Static Regeneration
		// (see `export const config` in their +layout.server.js / +server.ts):
		// static HTML on Vercel's edge, refreshed in the background.
		adapter: adapter({ runtime: 'nodejs22.x' })
	}
};

export default config;
