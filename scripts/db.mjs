#!/usr/bin/env node
/**
 * Runs SQL on the production database through Supabase's Management API, with the
 * SUPABASE_ACCESS_TOKEN in .env.local (or .env). The token never reaches the output.
 *
 *   node scripts/db.mjs "select count(*) from notes"
 *   node scripts/db.mjs --file supabase/migrations/20260926160000_cover_stickers.sql
 *   node scripts/db.mjs --migrate supabase/migrations/20260926160000_cover_stickers.sql
 *
 * --migrate runs the file in a transaction, and records it in supabase_migrations.schema_migrations
 * when the project keeps that history. Only the named file runs:
 * other pending migrations in the folder may belong to work still in progress.
 */
import { readFileSync, existsSync } from 'node:fs';
import { basename } from 'node:path';

const PROJECT = 'godqhjgwmlzfnymzhqdq';

function token() {
	if (process.env.SUPABASE_ACCESS_TOKEN) return process.env.SUPABASE_ACCESS_TOKEN;
	for (const file of ['.env.local', '.env']) {
		if (!existsSync(file)) continue;
		const line = readFileSync(file, 'utf8').split('\n').find((l) => l.startsWith('SUPABASE_ACCESS_TOKEN='));
		if (line) return line.slice(line.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '');
	}
	throw new Error('SUPABASE_ACCESS_TOKEN non trovato in .env.local o .env');
}

async function query(sql) {
	const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT}/database/query`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ query: sql })
	});
	const body = await res.text();
	if (!res.ok) throw new Error(`HTTP ${res.status}: ${body}`);
	return body ? JSON.parse(body) : null;
}

const [flag, arg] = process.argv.slice(2);
try {
	if (flag === '--file') {
		console.log(JSON.stringify(await query(readFileSync(arg, 'utf8')), null, 2));
	} else if (flag === '--migrate') {
		const sql = readFileSync(arg, 'utf8');
		const [, version, name] = basename(arg).match(/^(\d+)_(.+)\.sql$/) ?? [];
		if (!version) throw new Error('Il file deve chiamarsi <versione>_<nome>.sql');
		// This project has no history table (migrations so far were applied by hand): then the file just runs,
		// and it must be idempotent, as the migrations here are (`if not exists`, `drop policy if exists`).
		const [{ tracked }] = await query(`select to_regclass('supabase_migrations.schema_migrations') is not null as tracked`);
		const done = tracked && (await query(`select 1 from supabase_migrations.schema_migrations where version = '${version}'`)).length;
		if (done) {
			console.log(`${version} è già applicata.`);
		} else {
			const tag = `$m${version}$`;
			const record = tracked ? `insert into supabase_migrations.schema_migrations (version, name, statements) values ('${version}', '${name}', array[${tag}${sql}${tag}]);` : '';
			await query(`begin;\n${sql}\n;${record}\ncommit;`);
			console.log(`Applicata ${version}_${name}${tracked ? '' : ' (il progetto non tiene la storia delle migrazioni)'}.`);
		}
	} else if (flag) {
		console.log(JSON.stringify(await query(flag), null, 2));
	} else {
		console.error('Uso: node scripts/db.mjs "<sql>" | --file <file.sql> | --migrate <migrazione.sql>');
		process.exit(2);
	}
} catch (err) {
	console.error(err.message);
	process.exit(1);
}
