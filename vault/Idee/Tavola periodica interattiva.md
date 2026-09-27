---
stato: idea
aggiornato: 2026-09-28
tag: [idea, strumenti, chimica, seo]
---
# Tavola periodica interattiva

## L'idea
Alessandro, 28 settembre 2026. Una tavola periodica interattiva, fatta bene, come progetto a parte rispetto agli altri strumenti. Serve in due posti: come strumento sotto `/strumenti`, perché tantissimi studenti cercano "tavola periodica interattiva" e spesso è difficile trovarne una buona, e dentro le lezioni di chimica, dove prima o poi va messa comunque.

## Perché potrebbe valere
Dalla verifica delle ricerche del 28 settembre 2026 (Claude, con un motore di ricerca interrogato in italiano, non google.it, volumi da verificare con Keyword Planner) è la ricerca con il volume più alto tra i candidati strumenti. In cima ci sono strumenti veri (Zanichelli, Ptable), quindi l'intento è da strumento e una lezione non si posizionerebbe. È anche una pagina che lo studente riapre durante l'anno, non solo una volta.

Il lavoro è più grande di un calcolatore: i dati di 118 elementi (massa atomica, configurazione elettronica, elettronegatività, stati di ossidazione, raggio, famiglia), una griglia che resti leggibile sul telefono, la scheda di ogni elemento e forse una pagina indicizzata per elemento. Le masse atomiche esistono già nel motore della massa molare (`src/lib/tools/chimica.ts`) e possono essere il punto di partenza.

## Dubbi e conflitti
Nessun conflitto con le decisioni prese. La chimica è già pubblica e gratuita accanto alla beta ([[2026-09-26 La chimica si pubblica gratis accanto alla beta]]), quindi la tavola si aggancia alle sue lezioni. Da decidere: se fare una pagina per elemento (118 pagine con domanda propria, "massa atomica del ferro") e come tenerle lontane dal contenuto prodotto in serie; le fonti dei dati e la loro licenza.

## Collegamenti
- [[Calcolatori e convertitori]], [[Lezioni]], [[SEO]]
