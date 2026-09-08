import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import OpenAI from 'openai';
import { isStaff } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { fail, json, readJson } from '@/lib/server/http';
import { GOLDEN_TEMPLATE } from '@/lib/data/golden-template';

const WRITER_PROMPT = `Sei l'autore senior incaricato di redigere lezioni d'élite per 'Sapiens', la principale piattaforma STEM per studenti universitari e liceali avanzati.

### Obiettivo
Il tuo compito è convertire un argomento matematico complesso in una lezione rigorosa, impeccabile e di livello universitario, pur mantenendo una chiarezza didattica superiore.

### Regole fondamentali
1. Adesione al Template: DEVI seguire la struttura e l'ordine di tutte le sezioni definite nel 'Golden Template'. Non saltare, rinominare o modificare i titoli principali.
2. Rigore matematico: tutta la notazione, le formule, le derivazioni e i risultati finali devono essere matematicamente corretti al 100%.
3. Formattazione: usa LaTeX per TUTTE le espressioni matematiche. Usa $inline$ per le variabili e $$display$$ per le equazioni principali.
4. Tono e stile: autorevole, conciso e stimolante. Il linguaggio deve essere esplicito, evitando ambiguità.
5. Lunghezza: una lezione completa che copra l'argomento in modo esaustivo, con almeno un esempio dettagliato (con tutti i passaggi) e una sezione sulle "Applicazioni".

### Golden Template
---
${GOLDEN_TEMPLATE}
---`;

const CRITIC_PROMPT = `Sei un Agente Critico di QA specializzato in contenuti didattici STEM di livello avanzato. Il tuo unico obiettivo è garantire che la bozza di lezione Markdown che ti viene fornita sia perfetta e pronta per la pubblicazione.

Criteri di revisione: correttezza matematica e logica di ogni passaggio; validità LaTeX (formule racchiuse in $...$ o $$...$$, sintassi corretta, graffe bilanciate); adesione alla struttura del Golden Template; chiarezza e tono autorevole.

Istruzioni di output: se la bozza non ha difetti rispondi ESATTAMENTE con la sola stringa OK. Se contiene errori (anche uno solo), riscrivi l'intero contenuto Markdown corretto, senza commenti all'esterno della lezione.`;

/** Writer + critic pipeline for a lesson draft, saved under docs/drafts (a local convenience: the deployment's filesystem is read-only, so there the draft only comes back in the response). Staff only. */
export async function POST(request: Request) {
	if (!isStaff(await currentUser())) return fail('Non autorizzato.', 403);
	const { lessonTopic } = await readJson(request);
	if (typeof lessonTopic !== 'string' || !lessonTopic.trim()) return fail('Lesson topic is required', 400);
	const topic = lessonTopic.trim();

	try {
		const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
		const ask = async (system: string, user: string, temperature: number) =>
			(await openai.chat.completions.create({ model: 'gpt-4o', temperature, messages: [{ role: 'system', content: system }, { role: 'user', content: user }] })).choices[0]?.message?.content ?? '';

		const draft = await ask(WRITER_PROMPT, `Scrivi la lezione completa su: ${topic}`, 0.7);
		const review = await ask(CRITIC_PROMPT, draft, 0);
		const ok = review.trim() === 'OK';
		const lesson = ok ? draft : review;

		try {
			const dir = path.join(process.cwd(), 'docs', 'drafts');
			await mkdir(dir, { recursive: true });
			await writeFile(path.join(dir, `${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}.md`), lesson, 'utf-8');
		} catch (err) {
			console.error('draft save failed:', err);
		}

		return json({ success: true, topic, status: ok ? 'Perfetta (Originale)' : 'Revisionata', lesson_markdown: lesson });
	} catch (err) {
		console.error('draft generation failed:', err);
		return json({ success: false, error: 'Errore interno del server durante la generazione della lezione.' }, 500);
	}
}
