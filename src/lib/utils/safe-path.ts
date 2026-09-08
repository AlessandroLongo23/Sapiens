/** Only same-origin paths are accepted as a return target (from a query string or a request body). */
export const safePath = (value: unknown, fallback: string): string =>
	typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : fallback;
