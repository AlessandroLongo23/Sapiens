import next from 'eslint-config-next';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
	...next,
	...nextTypescript,
	{
		rules: {
			// The legacy maths library keeps a few files under @ts-nocheck until it is typed; each says why.
			'@typescript-eslint/ban-ts-comment': ['error', { 'ts-nocheck': 'allow-with-description', 'ts-ignore': true, 'ts-expect-error': 'allow-with-description' }],
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }]
		}
	},
	{ ignores: ['.next/**', 'android/**', 'public/**', 'docs/**'] }
];

export default config;
