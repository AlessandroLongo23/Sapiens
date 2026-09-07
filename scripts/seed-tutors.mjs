import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

/**
 * Demo tutors for developing the marketplace UI. Their slugs start with
 * `demo-` so they can be removed in one go before launch:
 *
 *   node scripts/seed-tutors.mjs           # insert (or refresh) the demo profiles
 *   node scripts/seed-tutors.mjs --delete  # remove every demo-* tutor
 *
 * Reads PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.
 */

const env = Object.fromEntries(
	readFileSync('.env', 'utf8')
		.split('\n')
		.filter((l) => l.includes('=') && !l.trim().startsWith('#'))
		.map((l) => {
			const i = l.indexOf('=');
			return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
		})
);

const supabase = createClient(env.PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
	auth: { persistSession: false, autoRefreshToken: false }
});

const DEMO = [
	{
		slug: 'demo-giulia-d',
		first_name: 'Giulia',
		last_name: 'De Luca',
		headline: 'Laureanda in Matematica, preparo alle verifiche di quarta e quinta',
		bio: 'Studio Matematica alla Statale di Milano e do ripetizioni da quattro anni, soprattutto a chi ha il debito o una verifica in arrivo.\n\nParto sempre dagli esercizi che hai sbagliato: capire dove ci si blocca vale più di una spiegazione in più. Lezioni online con lavagna condivisa o a casa mia in zona Città Studi.',
		subjects: ['matematica', 'fisica'],
		levels: ['high_school', 'middle_school'],
		modes: ['online', 'in_person'],
		city: 'Milano',
		hourly_rate: 18,
		education: 'Matematica, Università Statale di Milano',
		years_experience: 4,
		verified: true
	},
	{
		slug: 'demo-marco-r',
		first_name: 'Marco',
		last_name: 'Rinaldi',
		headline: 'Ingegnere informatico, Analisi I e programmazione per il primo anno',
		bio: 'Laureato magistrale al Politecnico di Torino, lavoro come sviluppatore e seguo studenti del primo anno di ingegneria e informatica.\n\nCon me si fanno esercizi d’esame veri, cronometrati, e si torna sulla teoria solo dove serve.',
		subjects: ['analisi-1', 'programmazione', 'fondamenti-informatica', 'algebra-lineare'],
		levels: ['university'],
		modes: ['online'],
		city: null,
		hourly_rate: 25,
		education: 'Ingegneria informatica, Politecnico di Torino',
		years_experience: 6,
		verified: true
	},
	{
		slug: 'demo-sara-b',
		first_name: 'Sara',
		last_name: 'Bianchi',
		headline: 'Chimica e scienze per medie e biennio, con pazienza',
		bio: 'Sono al terzo anno di Chimica a Bologna. Mi piace lavorare con ragazzi delle medie e del biennio che hanno perso il filo: ricostruiamo le basi con esempi concreti e tante domande.',
		subjects: ['chimica', 'matematica'],
		levels: ['middle_school', 'high_school'],
		modes: ['in_person', 'online'],
		city: 'Bologna',
		hourly_rate: 15,
		education: 'Chimica, Università di Bologna',
		years_experience: 2,
		verified: false
	},
	{
		slug: 'demo-luca-f',
		first_name: 'Luca',
		last_name: 'Ferrara',
		headline: 'Fisica I e II, Teoria dei segnali: dottorando al Politecnico',
		bio: 'Dottorando in Fisica al Politecnico di Milano. Seguo studenti di ingegneria e fisica per gli esami del primo biennio, con particolare attenzione ai problemi scritti.',
		subjects: ['fisica-1', 'fisica-2', 'teoria-segnali', 'analisi-2'],
		levels: ['university'],
		modes: ['online', 'in_person'],
		city: 'Milano',
		hourly_rate: 30,
		education: 'Dottorato in Fisica, Politecnico di Milano',
		years_experience: 5,
		verified: true
	},
	{
		slug: 'demo-chiara-m',
		first_name: 'Chiara',
		last_name: 'Moretti',
		headline: 'Matematica e fisica per il liceo, anche la sera',
		bio: 'Insegnante di ruolo alle superiori, do ripetizioni fuori dall’orario scolastico a studenti di altre scuole. Preparazione a verifiche, interrogazioni e maturità scientifica.',
		subjects: ['matematica', 'fisica'],
		levels: ['high_school'],
		modes: ['online'],
		city: null,
		hourly_rate: 22,
		education: 'Laurea in Fisica, docente di ruolo',
		years_experience: 10,
		verified: true
	},
	{
		slug: 'demo-andrea-c',
		first_name: 'Andrea',
		last_name: 'Colombo',
		headline: 'Informatica: Python, database e sistemi operativi',
		bio: 'Studente magistrale di Informatica a Padova. Aiuto con i corsi di programmazione, basi di dati e sistemi operativi, e con i progetti d’esame.',
		subjects: ['informatica', 'programmazione', 'database', 'sistemi-operativi', 'reti'],
		levels: ['high_school', 'university'],
		modes: ['online', 'in_person'],
		city: 'Padova',
		hourly_rate: 20,
		education: 'Informatica, Università di Padova',
		years_experience: 3,
		verified: false
	},
	{
		slug: 'demo-elena-g',
		first_name: 'Elena',
		last_name: 'Greco',
		headline: 'Compiti e metodo di studio per le medie',
		bio: 'Studio Scienze della formazione a Roma e seguo ragazzi delle medie nei compiti di matematica e scienze, con un occhio al metodo di studio più che al singolo esercizio.',
		subjects: ['matematica', 'chimica'],
		levels: ['middle_school'],
		modes: ['in_person'],
		city: 'Roma',
		hourly_rate: 12,
		education: 'Scienze della formazione, Roma Tre',
		years_experience: 1,
		verified: false
	},
	{
		slug: 'demo-davide-s',
		first_name: 'Davide',
		last_name: 'Serra',
		headline: 'Statistica e algebra lineare per economia e ingegneria',
		bio: 'Laureato in Statistica a Padova, lavoro come analista. Seguo studenti di economia, ingegneria e psicologia per statistica, probabilità e algebra lineare.',
		subjects: ['statistica', 'algebra-lineare', 'analisi-1'],
		levels: ['university'],
		modes: ['online'],
		city: null,
		hourly_rate: null,
		education: 'Statistica, Università di Padova',
		years_experience: 4,
		verified: false
	}
];

async function main() {
	if (process.argv.includes('--delete')) {
		const { error, count } = await supabase.from('tutors').delete({ count: 'exact' }).like('slug', 'demo-%');
		if (error) throw error;
		console.log(`removed ${count ?? 0} demo tutors`);
		return;
	}
	const rows = DEMO.map((t) => ({ ...t, status: 'published' }));
	const { error, data } = await supabase.from('tutors').upsert(rows, { onConflict: 'slug' }).select('slug');
	if (error) throw error;
	console.log(`upserted ${data.length} demo tutors:`, data.map((r) => r.slug).join(', '));
}

main().catch((err) => {
	console.error(err.message ?? err);
	process.exit(1);
});
