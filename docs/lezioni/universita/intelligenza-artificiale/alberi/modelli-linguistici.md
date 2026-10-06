# Albero delle lezioni: Modelli linguistici (università)

Fonte dell'albero di `content_nodes` per la materia `modelli-linguistici` sotto `university`. Viene dal blocco 4 (capitoli 4.1-4.7) di
`vault/Contenuti/Programma di intelligenza artificiale.md` (6 ottobre 2026): i capitoli sono quelli del programma, le
lezioni sono una prima divisione degli argomenti di ogni capitolo, da rivedere quando il capitolo si scrive. Si applica
con `scripts/lezioni/tree.mts --level university --subject modelli-linguistici --title "Modelli linguistici" --file <questo file>` (prima senza
scrivere, poi con `--apply`). Formato: `## slug | Titolo` è un capitolo, `- slug | Titolo` una lezione.

## llm-dal-transformer | Dal transformer al modello linguistico
- llm-tokenizzatori | Tokenizzatori
- llm-bert-gpt-t5 | BERT, GPT e T5
- llm-dati | Raccolta e preparazione dei dati
- llm-pre-addestramento | Pre-addestramento di un piccolo GPT
- llm-leggi-scala | Leggi di scala
- llm-multilingue | Lingue diverse dall'inglese

## llm-messa-a-punto | Messa a punto e allineamento
- llm-istruzioni | Messa a punto con istruzioni
- llm-lora | Adattatori e LoRA
- llm-rlhf | Apprendimento dal giudizio umano: RLHF
- llm-dpo | Apprendimento dalle preferenze: DPO
- llm-ragionamento | Ricompensa verificabile e modelli che ragionano

## llm-inferenza | Inferenza ed efficienza
- llm-decodifica | Strategie di decodifica
- llm-cache-kv | La cache delle chiavi e dei valori
- llm-quantizzazione | Quantizzazione
- llm-distillazione | Distillazione e decodifica speculativa

## llm-valutazione | Valutare un modello linguistico
- llm-benchmark | Benchmark e loro limiti
- llm-valutazione-automatica | Valutazione automatica e umana
- llm-statistica-valutazioni | Statistica delle valutazioni
- llm-contesti-lunghi | Valutazione su contesti lunghi

## llm-usare | Usare un modello
- llm-prompt | Scrivere un prompt
- llm-esempi-ragionamento | Esempi nel prompt e ragionamento a passi
- llm-uscite-strutturate | Uscite strutturate
- llm-contesto | Gestione del contesto
- llm-chiamata-funzioni | Chiamata di funzioni
- llm-protezioni-costi | Protezioni, costi e cache

## llm-rag | Recupero e generazione aumentata
- llm-embedding | Modelli di embedding
- llm-suddivisione | Suddivisione dei documenti
- llm-ricerca-vettoriale | Ricerca vettoriale
- llm-rag-base | Generazione aumentata dal recupero
- llm-rag-varianti | Varianti del RAG

## llm-multimodali | Modelli multimodali
- llm-testo-immagini | Testo e immagini
- llm-video-audio | Video e audio
- llm-documenti | Documenti e diagrammi
- llm-generazione-multimodale | Modelli che generano più modalità
