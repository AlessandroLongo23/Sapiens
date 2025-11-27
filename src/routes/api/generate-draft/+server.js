// src/routes/api/generate-lesson/+server.js

import { json } from '@sveltejs/kit';
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { createClient } from '@supabase/supabase-js';

// --- 1. Credenziali e Setup ---

// SvelteKit raccomanda di usare $env/static/private per le chiavi segrete
import { 
    OPENAI_API_KEY,
} from '$env/static/private';

const GOLDEN_TEMPLATE = `
# Equazioni di Secondo Grado

## 1. Definizione
Un’**equazione di secondo grado** è un’uguaglianza che contiene una variabile (ad esempio $x$) elevata **al massimo alla seconda potenza**.  
La forma generale è:

$$
ax^2 + bx + c = 0
$$

dove:
- $a$, $b$, $c$ sono **numeri reali** (con $a \neq 0$),
- $x$ è l’**incognita**.

---

## 2. Obiettivo
Trovare i valori di $x$ che rendono vera l’equazione, cioè le **soluzioni** (o radici).

---

## 3. Formula Risolutiva (Formula del Delta)

Per risolvere si usa la **formula quadratica**, che dipende dal **discriminante** (o **Delta**), indicato con la lettera greca $\Delta$:

$$
\Delta = b^2 - 4ac
$$

Le soluzioni si trovano con:

$$
x_{1,2} = \frac{-b \pm \sqrt{\Delta}}{2a}
$$

dove:
- $x_1$ si ottiene con il **segno +**,
- $x_2$ si ottiene con il **segno −**.

---

## 4. Numero di Soluzioni in base a $\Delta$

Il valore di $\Delta$ determina quante soluzioni reali ha l’equazione:

| Valore di $\Delta$ | Tipo di Soluzioni | Descrizione |
|--------------------|------------------|-------------|
| $\Delta > 0$ | **Due soluzioni reali e distinte** | Due numeri diversi |
| $\Delta = 0$ | **Una soluzione reale doppia** | Le due radici coincidono |
| $\Delta < 0$ | **Nessuna soluzione reale** | Le soluzioni sono numeri complessi |

---

## 5. Esempi Svolti

### Esempio 1: due soluzioni ($\Delta > 0$)
$$
x^2 - 5x + 6 = 0
$$

1. Identifica $a=1$, $b=-5$, $c=6$.
2. Calcola $\Delta$:
   $$
   \Delta = (-5)^2 - 4 \cdot 1 \cdot 6 = 25 - 24 = 1
   $$
   ($\Delta > 0$ → due soluzioni).
3. Applica la formula:
   $$
   x_{1,2} = \frac{-(-5) \pm \sqrt{1}}{2 \cdot 1}
   $$
   $$
   x_{1,2} = \frac{5 \pm 1}{2}
   $$
4. Calcola:
   $$
   x_1 = \frac{5 + 1}{2} = 3, \quad x_2 = \frac{5 - 1}{2} = 2
   $$

**Soluzioni**: $x_1 = 3$, $x_2 = 2$

---

### Esempio 2: una soluzione doppia ($\Delta = 0$)
$$
x^2 + 4x + 4 = 0
$$

1. $a=1$, $b=4$, $c=4$
2. $\Delta = 4^2 - 4 \cdot 1 \cdot 4 = 16 - 16 = 0$
3. Formula:
   $$
   x = \frac{-4}{2 \cdot 1} = -2
   $$

**Soluzione doppia**: $x = -2$

---

### Esempio 3: nessuna soluzione reale ($\Delta < 0$)
$$
x^2 + x + 1 = 0
$$

1. $a=1$, $b=1$, $c=1$
2. $\Delta = 1^2 - 4 \cdot 1 \cdot 1 = 1 - 4 = -3$
3. Poiché $\Delta < 0$, non esistono soluzioni reali.

**Nessuna soluzione reale** (le soluzioni sono complesse).

---

## 6. Caso Particolare: Equazioni Pure e Spuria
A volte mancano alcuni termini:

- **Equazione pura**: manca $b$  
  Esempio: $x^2 - 9 = 0$  
  Risolvi come $x^2 = 9$ → $x = \pm 3$.

- **Equazione spuria**: manca $c$  
  Esempio: $x^2 - 4x = 0$  
  Metti in evidenza $x$: $x(x - 4) = 0$ → $x = 0$ oppure $x = 4$.

---

## 7. Consigli Utili
- Controlla sempre le soluzioni sostituendole nell’equazione originale.
- Se $\Delta$ è un quadrato perfetto (es. 1, 4, 9...), le soluzioni sono **numeri interi o razionali**.
- Se $\Delta$ non è un quadrato perfetto ma positivo, le soluzioni saranno **numeri decimali o frazioni**.

---

## Riassunto
1. Scrivi l’equazione nella forma $ax^2 + bx + c = 0$.  
2. Calcola il **discriminante** $\Delta = b^2 - 4ac$.  
3. Se:
   - $\Delta > 0$ → due soluzioni: $x_{1,2} = \dfrac{-b \pm \sqrt{\Delta}}{2a}$
   - $\Delta = 0$ → una soluzione doppia: $x = \dfrac{-b}{2a}$
   - $\Delta < 0$ → nessuna soluzione reale.

`;


/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
    try {
        // Recupera il topic dal corpo della richiesta
        const { lessonTopic } = await request.json();
        
        if (!lessonTopic) {
            return json({ error: "Lesson topic is required" }, { status: 400 });
        }

        // --- 2. Inizializzazione dei Modelli LLM ---
        
        // Writer (Anthropic)
        const writer = new ChatOpenAI({ 
            model: "gpt-4o",
            temperature: 0.7,
            apiKey: OPENAI_API_KEY,
        });

        // Critic (OpenAI)
        const critic = new ChatOpenAI({ 
            model: "gpt-4o", 
            temperature: 0.0,
            apiKey: OPENAI_API_KEY,
        });

        // --- 3. Pipeline di Generazione (Writer) ---
        
        const systemPromptWriter = `
            Sei l'autore senior incaricato di redigere lezioni d'élite per 'Sapiens', la principale piattaforma STEM per studenti universitari e liceali avanzati.

            ### 🎯 Obiettivo
            Il tuo compito è convertire un argomento matematico complesso in una lezione **rigorosa, impeccabile e di livello universitario**, pur mantenendo una chiarezza didattica superiore.

            ### 🏛️ REGOLE FONDAMENTALI (STRICTLY ENFORCED)
            1.  **Adesione al Template:** DEVI seguire la struttura e l'ordine di tutte le sezioni definite nel 'Golden Template'. Non saltare, rinominare o modificare i titoli principali.
            2.  **Rigore Matematico:** Tutta la notazione, le formule, le derivazioni e i risultati finali devono essere **matematicamente corretti al 100%**.
            3.  **Formattazione:** Usa **LaTeX** per TUTTE le espressioni matematiche, inclusa la formula fondamentale, gli esempi guidati e i passaggi intermedi. Usa $inline$ per le variabili e $$display$$ per le equazioni principali.
            4.  **Tono e Stile:** Mantieni un tono **autorevole, conciso e stimolante**. Il linguaggio deve essere esplicito, evitando ambiguità.
            5.  **Lunghezza:** Scrivi una lezione completa che copra l'argomento in modo esaustivo, includendo almeno **un esempio dettagliato** (con tutti i passaggi) e una sezione sulle "Applicazioni".

            ### 📖 Golden Template
            ---
            ${GOLDEN_TEMPLATE}
            ---
        `;

        const writerMessages = [
            new SystemMessage(systemPromptWriter),
            new HumanMessage(`Scrivi la lezione completa su: ${lessonTopic}`)
        ];

        console.log(`Inizio generazione bozza per: ${lessonTopic}`);
        const draftResponse = await writer.invoke(writerMessages);
        const draftContent = draftResponse.content;

        // --- 4. Pipeline di Critica (Critic) ---
        
        const critiquePromptCritic = `
            Sei un **Agente Critico di QA (Quality Assurance)** specializzato in contenuti didattici STEM di livello avanzato. Il tuo unico obiettivo è garantire che la bozza di lezione Markdown che ti viene fornita sia perfetta e pronta per la pubblicazione su una piattaforma d'élite.

            ### 🔍 Criteri di Revisione Obbligatori:

            1.  **Correttezza Matematica e Logica:**
                * Verifica l'assoluta validità di tutti i passaggi di derivazione, integrazione e calcolo.
                * Cerca incongruenze logiche o errori concettuali nella spiegazione dell'argomento.
            2.  **Validità LaTeX:**
                * Controlla che TUTTE le formule matematiche siano racchiuse correttamente (usando $inline$ o $$display$$).
                * Identifica e correggi eventuali errori di sintassi LaTeX (es. comandi sconosciuti, parentesi graffe non bilanciate, ambienti non chiusi).
            3.  **Adesione al Formato:**
                * Assicurati che la struttura Markdown (titoli, sottotitoli, liste) segua esattamente il 'Golden Template' definito per l'autore.
            4.  **Chiarezza e Tono:**
                * Valuta se il testo è chiaro, conciso e mantiene il tono autorevole e rigoroso richiesto da 'Sapiens'.

            ### 🚨 Istruzioni di Output:

            * **Se la bozza non ha DIFETTI** (nessun errore di LaTeX, logica o formattazione), devi rispondere **ESATTAMENTE** con la sola stringa: **OK**
            * **Se la bozza contiene ERRORI** (anche uno solo), DEVI RISCRIVERE l'intero contenuto Markdown. La tua risposta deve essere la lezione completa e corretta, con tutti gli errori emendati e le formule LaTeX corrette. NON includere commenti o note aggiuntive all'esterno del contenuto della lezione.
        `;
        
        const criticMessages = [
            new SystemMessage(critiquePromptCritic),
            new HumanMessage(draftContent)
        ];

        console.log("Agente Critico in azione...");
        const finalVersionResponse = await critic.invoke(criticMessages);
        let finalLessonContent = finalVersionResponse.content;
        let statusMessage = "Revisionata";

        // Determina la versione finale
        if (finalLessonContent.trim() === 'OK') {
            finalLessonContent = draftContent;
            statusMessage = "Perfetta (Originale)";
        }
        
        return json({ 
            success: true, 
            topic: lessonTopic,
            status: correctionStatus,
            // Restituisce la lezione finale in formato Markdown
            lesson_markdown: finalLessonContent 
        }, { status: 200 });

    } catch (e) {
        console.error("Errore Generale nel Workflow:", e);
        return json({ 
            success: false,
            error: "Errore interno del server durante la generazione della lezione.", 
            details: e.message 
        }, { status: 500 });
    }
}