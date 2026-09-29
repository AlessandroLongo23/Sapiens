import { notFound } from 'next/navigation';
import { Preview } from './Preview';

/**
 * Only in development: one interactive figure (`?figura=nome`, a name of FIGURES in src/lib/utils/interactive.ts)
 * or one exercise scene (`?scena=tipo&dati={json}&alt=...`), alone on the page, for scripts/figure/anteprima-interattivo.mjs.
 * A tool for writing the lessons (docs/lezioni/fisica/README.md): in production it answers 404.
 */
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
	if (process.env.NODE_ENV === 'production') notFound();
	const q = await searchParams;
	return (
		<main className="markdown-content mx-auto max-w-3xl p-4" id="prova">
			<Preview figure={q.figura} scene={q.scena ? { type: q.scena, data: JSON.parse(q.dati ?? '{}'), alt: q.alt ?? q.scena } : undefined} />
		</main>
	);
}
