import { notFound } from 'next/navigation';
import { Editor } from '@/components/sandbox/Editor';
import { Sandbox } from '@/components/sandbox/Sandbox';

/**
 * Only in development: the physics sandbox with its editor (vault/Prodotti/Studenti/Sandbox di fisica.md). `?scena=`
 * picks the example it opens with; `?fissa=1` shows the older viewer of fixed scenes. In production it answers 404.
 */
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
	if (process.env.NODE_ENV === 'production') notFound();
	const q = await searchParams;
	return (
		<main className="mx-auto max-w-7xl p-4" id="prova">
			<h1 className="mb-4 text-2xl font-semibold text-fg">Sandbox di fisica</h1>
			{q.fissa === '1' ? <Sandbox preset={q.scena} locked /> : <Editor example={q.scena} />}
		</main>
	);
}
