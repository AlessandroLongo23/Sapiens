import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY
});

/** @type {import('./$types').RequestHandler} */
export async function POST({ request, locals: { user } }) {
	// Check if user is authenticated
	if (!user) {
		return json({ error: 'Non autenticato' }, { status: 401 });
	}

	try {
		const { messages } = await request.json();

		if (!messages || !Array.isArray(messages)) {
			return json({ error: 'Messaggi non validi' }, { status: 400 });
		}

		// Create a streaming response
		const stream = await openai.chat.completions.create({
			model: 'gpt-4o-mini',
			messages: [
				{
					role: 'system',
					content: `Sei Sapiens AI, un assistente virtuale specializzato nell'aiutare studenti italiani con le loro domande di matematica, fisica, informatica e altre materie scolastiche e universitarie. 
					
Rispondi sempre in italiano in modo chiaro, educato e didattico. Il tuo obiettivo è aiutare gli studenti a capire i concetti, non solo fornire risposte. Quando possibile:
- Spiega il ragionamento passo dopo passo
- Usa esempi pratici
- Incoraggia lo studente a riflettere
- Usa formule matematiche quando necessario\ (in formato LaTeX con $..$ per inline e $$..$$ per blocco)

Ricorda che lavori per Sapiens, una piattaforma di ripetizioni online.`
				},
				...messages
			],
			temperature: 0.7,
			max_tokens: 2000,
			stream: true
		});

		// Create a readable stream for the response
		const readable = new ReadableStream({
			async start(controller) {
				try {
					for await (const chunk of stream) {
						const content = chunk.choices[0]?.delta?.content || '';
						if (content) {
							controller.enqueue(new TextEncoder().encode(content));
						}
					}
					controller.close();
				} catch (error) {
					controller.error(error);
				}
			}
		});

		return new Response(readable, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'Cache-Control': 'no-cache',
				'Connection': 'keep-alive'
			}
		});
	} catch (error) {
		console.error('OpenAI API Error:', error);
		return json(
			{ error: 'Errore durante la comunicazione con il server' },
			{ status: 500 }
		);
	}
}

