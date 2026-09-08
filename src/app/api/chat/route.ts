import OpenAI from 'openai';
import { Features } from '@/lib/stripe/config';
import { hasFeature, requiredPlanFor } from '@/lib/auth/entitlements';
import { currentUser } from '@/lib/server/auth';
import { fail, json, readJson } from '@/lib/server/http';

const SYSTEM_PROMPT = `Sei Sapiens AI, un assistente virtuale specializzato nell'aiutare studenti italiani con le loro domande di matematica, fisica, informatica e altre materie scolastiche e universitarie.

Rispondi sempre in italiano in modo chiaro, educato e didattico. Il tuo obiettivo è aiutare gli studenti a capire i concetti, non solo fornire risposte. Quando possibile:
- Spiega il ragionamento passo dopo passo
- Usa esempi pratici
- Incoraggia lo studente a riflettere
- Usa formule matematiche quando necessario (in formato LaTeX con $..$ per inline e $$..$$ per blocco)

Ricorda che lavori per Sapiens, una piattaforma di ripetizioni online.`;

type ChatMessage = { role: 'user' | 'assistant'; content: string };

/** Only user and assistant turns reach the model; the system prompt is ours. Bounded, so one call cannot run up the bill. */
const MAX_MESSAGES = 40;
const MAX_CONTENT = 8_000;

function parseMessages(value: unknown): ChatMessage[] | null {
	if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) return null;
	const messages: ChatMessage[] = [];
	for (const item of value) {
		const m = item as { role?: unknown; content?: unknown };
		if ((m?.role !== 'user' && m?.role !== 'assistant') || typeof m.content !== 'string' || m.content.length > MAX_CONTENT) return null;
		messages.push({ role: m.role, content: m.content });
	}
	return messages[messages.length - 1].role === 'user' ? messages : null;
}

/** The study assistant, streamed as plain text. The chat is part of the paid plans (see the plan config). */
export async function POST(request: Request) {
	const user = await currentUser();
	if (!user) return json({ error: 'Accedi per usare Sapiens AI.', code: 'login_required' }, 401);
	if (!hasFeature(user, Features.AI_CHAT)) {
		return json({ error: 'Sapiens AI è incluso nei piani a pagamento.', code: 'upgrade_required', requiredPlan: requiredPlanFor(Features.AI_CHAT).id }, 403);
	}

	const messages = parseMessages((await readJson(request)).messages);
	if (!messages) return fail('Messaggi non validi', 400);

	try {
		const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
		// The request's signal follows the client: a closed tab stops the completion instead of paying for the rest of it.
		const stream = await openai.chat.completions.create(
			{ model: 'gpt-4o-mini', messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages], temperature: 0.7, max_tokens: 2000, stream: true },
			{ signal: request.signal }
		);
		const encoder = new TextEncoder();
		const readable = new ReadableStream({
			async start(controller) {
				try {
					for await (const chunk of stream) {
						const content = chunk.choices[0]?.delta?.content;
						if (content) controller.enqueue(encoder.encode(content));
					}
					controller.close();
				} catch (error) {
					controller.error(error);
				}
			},
			cancel() {
				stream.controller.abort();
			}
		});
		return new Response(readable, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } });
	} catch (error) {
		console.error('OpenAI API Error:', error);
		return fail('Errore durante la comunicazione con il server', 500);
	}
}
