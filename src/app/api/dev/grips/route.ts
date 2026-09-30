import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/*
 * The grip table of the 3D lab (src/components/lab/engine/grips.json), written by the hands playground
 * (/laboratorio/mani). Only in development: in production it does not exist.
 */

const FILE = path.join(process.cwd(), 'src/components/lab/engine/grips.json');
const dev = process.env.NODE_ENV === 'development';

export async function GET() {
	if (!dev) return new Response(null, { status: 404 });
	return Response.json(JSON.parse(await readFile(FILE, 'utf8')));
}

export async function POST(request: Request) {
	if (!dev) return new Response(null, { status: 404 });
	const { name, spec } = (await request.json()) as { name?: string; spec?: unknown };
	// `Name`, `Name@variant`, and `~2`, `~3`… for the alternatives (grip.ts, GRIP_KEY); a null spec deletes
	if (!name || !/^[A-Za-z0-9]+(@[a-z]+)?(~[2-9]\d*)?$/.test(name)) return Response.json({ error: 'nome non valido' }, { status: 400 });
	const table = JSON.parse(await readFile(FILE, 'utf8')) as Record<string, unknown>;
	if (spec === null) delete table[name];
	else table[name] = spec;
	const sorted = Object.fromEntries(Object.entries(table).sort(([a], [b]) => a.localeCompare(b)));
	await writeFile(FILE, JSON.stringify(sorted, null, '\t') + '\n');
	return Response.json(sorted);
}
