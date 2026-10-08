---
stato: decisa
release: da decidere
aggiornato: 2026-10-07
tag: [prodotto, studenti, laboratori, fisica, 3d]
---
# Laboratorio di fisica

Il secondo dei [[Laboratori]] 3D in prima persona, dopo la chimica: un posto dove lo studente misura, da solo o con la classe, e ritrova le leggi della fisica dai suoi dati.

## Stato attuale
Niente nel codice. Nel menu dei laboratori (`src/lib/lab/catalog.ts`) la copertina "Fisica" ha il timbro "Presto". Dal 7 ottobre 2026 c'è il piano, deciso in [[2026-10-07 Laboratorio di fisica, scopo e stanze]].

## Obiettivo
Si misura. Lo studente legge strumenti con una sensibilità, ripete le misure, compila tabella e grafico nel quaderno e ritrova la legge con la sua incertezza. La legge esatta resta alla [[Sandbox di fisica]]. Vedi [[2026-10-07 Nel laboratorio di fisica si misura, la legge esatta resta alla sandbox]].

Una copertina, "Fisica", e tre stanze, ciascuna con il suo caricamento ([[2026-10-07 Il laboratorio di fisica è una copertina sola con tre stanze]]):

| Stanza | Esigenza | Cosa ospita |
|---|---|---|
| Meccanica | Spazio | Apparati grandi e fissi nelle varie parti della stanza, banco delle misure |
| Camera oscura | Buio | Ottica geometrica, onde, ondoscopio, Young, spettri, acustica |
| Elettromagnetismo | Corrente ai banchi | Elettrostatica, circuiti, magnetismo, induzione |

Termologia e fluidi usano il guscio dell'aula di chimica, con un altro arredo ([[2026-10-07 Termologia e fluidi usano il guscio dell'aula di chimica]]). L'elettronica è un laboratorio a parte ([[2026-10-07 In fisica si misura una legge, in elettronica si costruisce un circuito]]).

Nella camera oscura la luce si accende e si spegne da un interruttore: si monta alla luce e si fa l'esperimento al buio.

Ogni stanza si apre libera, con tutti gli apparati e il quaderno bianco, o con una scheda.

Nella stanza di meccanica gli apparati sono fissi e un esperimento è una scheda del quaderno ([[2026-10-07 Nella stanza di meccanica gli apparati sono fissi e un esperimento è una scheda del quaderno]]). Con la classe la stanza si dispone a isole dello stesso apparato, una per gruppo ([[2026-10-07 Con la classe la stanza di meccanica si dispone a isole dello stesso apparato]]).

Si parte dalla stanza di meccanica con quattro schede del biennio: pendolo, molla, rotaia con fototraguardi, densità e misure ([[2026-10-07 Il laboratorio di fisica parte dalla meccanica del biennio, per ora solo sul piano]]).

## Dettagli
Proposte di Claude del 7 ottobre 2026, non ancora discusse nel dettaglio.

- I tre pezzi che servono sotto: strumenti con una lettura che lo studente scrive (riga, calibro, cronometro, dinamometro, bilancia, termometro, fototraguardo, multimetro); un modello dell'errore (tempo di reazione sul cronometro, attrito, parallasse); una pagina di grafico nel quaderno, con punti, barre d'errore e retta.
- Apparati della stanza di meccanica: rotaia a cuscino d'aria di 2 m con due fototraguardi; trave dei pendoli; piano inclinato regolabile con il carrello; asta graduata con elettromagnete per la caduta libera; lanciatore con carta carbone a terra; tavolo delle forze e parete con molle e pesi; banco delle misure; armadio degli strumenti a mano.
- Esperimenti possibili oltre i primi quattro: tavolo delle forze, leva, urti sulla rotaia e legge di Boyle (terzo anno); riflessione, Snell con il semicilindro, lenti sottili, Young; Ohm, serie e parallelo, carica del condensatore, induzione. Elenco dai laboratori scolastici classici, senza una fonte, da confrontare con Andrea.
- Tra le stanze una porta con una dissolvenza, senza corridoio.
- La camera oscura senza finestre si illumina con una sola lightmap delle plafoniere, moltiplicata per l'intensità dell'interruttore; laser e lampade sono luci dal vivo. Da verificare nel codice.

## Domande aperte
- Il modello della meccanica è il motore della [[Sandbox di fisica]] con sopra l'errore, o formule chiuse per ogni apparato? Il motore di oggi non ha la molla, gli urti e la rotazione.
- Come è fatto il modello dell'errore: quali errori, quanto grandi, e se cambiano a ogni partita come il campione della titolazione.
- La pagina del grafico: lo studente mette i punti a mano o li prende dalla tabella? La retta la traccia lui o la calcola il quaderno?
- Misure della stanza di meccanica, e quante isole di una rotaia da 2 m ci stanno.
- Quale delle quattro schede si costruisce per prima.
- L'elenco degli esperimenti per anno, con Andrea ([[Domande per Andrea]]).
- Quando si comincia a costruire, e in quale release entra.
- Cosa cambia nell'arredo dell'aula di chimica per termologia e fluidi.

## Collegamenti
- Attori: [[Studente]], [[Docente]]
- Release: da decidere (non è nella beta)
- [[Laboratori]], [[Laboratorio condiviso]], [[Sandbox di fisica]], [[Lezioni]]
- Sessione: [[2026-10-07 Laboratorio di fisica, scopo e stanze]]
