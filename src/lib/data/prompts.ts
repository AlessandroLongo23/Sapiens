import { Sparkles, Lightbulb, Pencil, Microscope } from 'lucide-svelte';

export type Prompt = {
    icon: typeof Sparkles;
    label: string;
    prompt: string;
};

export const contextualMenuPrompts: Record<string, Prompt> = {
    simplify: {
        icon: Sparkles,
        label: 'Semplifica',
        prompt: `:
        Agisci come un tutor di materie STEM esperto e paziente. 
        Il tuo compito è riscrivere il testo selezionato rendendolo estremamente chiaro e semplice.
        
        Linee guida:
        1. Usa un linguaggio diretto e accessibile.
        2. Se il testo contiene termini tecnici difficili, spiegali brevemente tra parentesi.
        3. Se utile, usa un'analogia con la vita quotidiana per spiegare il concetto astratto.
        4. Mantieni la formattazione Markdown (grassetto per i concetti chiave).
        
        Testo da semplificare:
        `
    },
    createExamples: {
        icon: Lightbulb,
        label: 'Crea esempi',
        prompt: `
        Agisci come un professore che vuole mostrare l'applicazione pratica della teoria.
        Fornisci 3 esempi distinti basati sul testo selezionato:
        
        1. **Esempio Numerico/Standard**: Un'applicazione diretta della formula o concetto.
        2. **Esempio Visivo/Reale**: Una situazione del mondo reale dove questo concetto si applica.
        3. **Contro-esempio (o Caso Limite)**: Un caso in cui la regola non vale o bisogna fare attenzione (se applicabile, altrimenti un altro esempio pratico).
        
        Usa il LaTeX per le formule matematiche.
        
        Testo su cui basare gli esempi:
        `
    },
    createExercise: {
        icon: Pencil,
        label: 'Mettiti alla prova',
        prompt: `
        Agisci come un esaminatore. Crea un singolo, breve esercizio "Flash" basato ESCLUSIVAMENTE sul testo selezionato per verificare se lo studente ha capito davvero.
        
        Output richiesto:
        **Domanda:** [La traccia dell'esercizio]
        
        ---
        
        **Soluzione Guidata:** (Da mostrare nascosta o sotto spoiler)
        1. Primo passaggio logico...
        2. Calcolo/Ragionamento...
        3. **Risultato Finale**
        
        Non chiedere definizioni a memoria ("Cos'è X?"), chiedi applicazioni ("Dato X, calcola Y" o "Cosa succede se...?").
        
        Testo di riferimento:
        `
    },
    deepDive: {
        icon: Microscope,
        label: 'Approfondisci',
        prompt: `
        Agisci come un ricercatore appassionato. Lo studente ha selezionato questo testo e vuole andare oltre la superficie.
        
        Spiega:
        1. **Il "Perché":** Perché questo concetto è importante? A cosa serve nel quadro generale della materia?
        2. **Curiosità o Connessione:** Come si collega ad altri argomenti (es. legame tra Derivate e Fisica)?
        
        Sii breve ma stimolante. Max 100 parole.
        
        Testo selezionato:
        `
    }
};