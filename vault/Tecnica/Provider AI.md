---
stato: bozza
aggiornato: 2026-09-23
tag: [tecnica, ai]
---
# Provider AI

## Stato attuale
OpenAI: `gpt-4o-mini` per [[Sapiens AI]], `gpt-4o` per le bozze delle lezioni. Nessun uso di Claude nel prodotto; Claude si usa per sviluppare e per produrre contenuti.

## Criteri di scelta
- Costo per utente al mese a un uso realistico (vedi [[Margini per cliente]]).
- Qualità in matematica e in italiano.
- Server nell'UE e contratto adatto a dati di minori, indispensabile per le scuole (vedi [[GDPR e minori]]).
- Separare i due usi: produzione dei contenuti (qualità, costo una tantum) e tutor per gli studenti (costo a ogni messaggio).

## Ricerca del 23 settembre 2026
Fonti: pagine prezzi e condizioni di OpenAI, Anthropic, Google e Mistral, lette il 23 settembre 2026. L'elenco completo degli URL è nella trascrizione della sessione [[2026-09-23 Prezzi, provider e pipeline]].

### Il costo dell'AI è marginale
Ipotesi d'uso: 20 sessioni al mese, 6 scambi ciascuna, 3.000 token di prompt e contesto della lezione (in cache), cronologia che cresce di circa 400 token a scambio, risposte di 350 token. Costo per studente attivo al mese, in dollari, con cache:

| Modello | Uso normale | Uso intenso (3x) |
|---|---|---|
| gpt-6-luna | 0,04 | 0,13 |
| gpt-4o-mini (oggi) | 0,08 | 0,22 |
| Mistral Small 4 | 0,06 | 0,17 |
| gpt-5.6-luna | 0,09 | 0,28 |
| Claude Haiku 4.5 | 0,44 | 1,30 |
| Claude Sonnet 5 | 0,87 | 2,61 |

Anche il caso peggiore sta sotto i 3 dollari al mese. Il prezzo del modello non è il criterio decisivo: lo sono qualità, dati nell'UE e condizioni per i minori. Cautele: i modelli con ragionamento possono fatturare token nascosti (impostare lo sforzo di ragionamento al minimo); italiano e LaTeX usano più token dell'inglese.

### Dati nell'UE
- **OpenAI:** regione Europa (`eu.api.openai.com`), che richiede la conservazione zero dei dati (ZDR) o un controllo simile, previa approvazione. +10% per i modelli usciti dopo marzo 2026. Le API non addestrano sui dati.
- **Anthropic, API diretta:** nessuna opzione UE (solo Stati Uniti o globale). Claude nell'UE passa da AWS Bedrock (Francoforte, Milano, Parigi e altre) o Google Vertex, con un +10%.
- **Google Gemini:** Vertex ha un endpoint UE (+10%).
- **Mistral:** dati nell'UE per impostazione predefinita, nessun sovrapprezzo, ZDR disponibile.

### Minori
- OpenAI e Anthropic ammettono app con utenti sotto i 18 anni, con salvaguardie: filtri, monitoraggio, dichiarazione che si parla con un'AI, verifica dell'età dove serve. OpenAI chiede la ZDR per gli utenti sotto l'età del consenso digitale (14 anni in Italia).
- Gemini tramite AI Studio vieta le app rivolte o accessibili a minori. Per Vertex non è confermato.
- Mistral le ammette con il consenso dei genitori sotto l'età del consenso digitale.

### Raccomandazione dell'analisi
- Beta B2C: restare su OpenAI, passando a un modello piccolo recente (gpt-5.6-luna) su un progetto UE fin dal primo giorno. Chiedere subito la ZDR.
- Scuole: regione UE di OpenAI con ZDR, oppure Mistral, oppure Claude su Bedrock UE per la qualità.
- Un solo provider può servire entrambi, ma non l'API diretta di Anthropic.
- La scelta tra i finalisti va fatta con una valutazione alla cieca su 50-100 domande reali di matematica in italiano.

## Deciso
OpenAI, regione Europa, conservazione zero dei dati, modello piccolo recente; valutazione alla cieca contro Claude Haiku su Bedrock UE prima del lancio. Vedi [[2026-09-23 OpenAI con dati nell'UE per la beta]].

## Domande aperte
- Chi prepara le 50-100 domande di prova e chi giudica le risposte?
- Non confermati: sovrapprezzo UE di Azure, regole di Vertex sui minori, prezzi in cache di Mistral, compatibilità di gpt-6-luna con la ZDR in Europa.
