---
aggiornato: 2026-09-26
tag: [sessione, contenuti, matematica]
---
# Quinto lotto: disequazioni, statistica e geometria

Sessione del 26 settembre 2026, seguito di [[2026-09-26 Quarto lotto, relazioni funzioni e frazioni algebriche]]. Il quinto lotto chiude gli argomenti che Alessandro aveva indicato per il primo anno.

## Cosa si è deciso
- Nell'albero Punti notevoli del triangolo viene ora dopo Rette perpendicolari e parallele, perché usa assi e altezze (Claude; applicato al database con `scripts/lezioni/tree.mts`, gli indirizzi non cambiano). Il dubbio nel grafo dei prerequisiti è chiuso.
- Intervalli con le quadre rovesciate dei libri italiani, $]2, 5]$ (Claude, da verificare con il libro in uso). KaTeX spazia male la forma semplice (la quadra si attacca all'uguale, il meno di $-\infty$ diventa una sottrazione): le quadre rovesciate si scrivono `\mathopen{]}` e `\mathclose{[}`, nelle lezioni e negli esercizi.
- Prerequisiti: Studio del segno e disequazioni fratte dipende ora da Operazioni con le frazioni algebriche (proposta dell'agente). Chiuso il dubbio sulla radice quadrata negli Indici di variabilità: la lezione la introduce come inversa del quadrato, senza radicali.

## Cosa si è fatto
- Undici lezioni nuove (file 52-62 in `docs/lezioni/`): Disequazioni di primo grado e intervalli; Sistemi di disequazioni; Studio del segno e disequazioni fratte; Dati, frequenze e grafici; Media, mediana e moda; Indici di variabilità; Enti geometrici, segmenti e angoli; Triangoli e criteri di congruenza; Rette perpendicolari e parallele; Punti notevoli del triangolo; Parallelogrammi e trapezi. 116 figure (111 nelle lezioni, tutte presenti sulle pagine), 215 flashcard, dimostrazioni con ipotesi, tesi e passi numerati. Nessuna formula esce dalla colonna del telefono. Pubblicate.
- Due lezioni aprivano una figura con `~~~tikz`, che lo script di pubblicazione non compila: riscritte con i backtick.
- Undici generatori di esercizi (77 livelli), verificati con tre seed, `width.mts` a 0, nessuna soluzione o passaggio che KaTeX non disegna. Collegati al sito con i nomi dei livelli. La geometria è tutta sul testo, perché il sito non genera ancora figure negli esercizi di matematica; ogni specifica dice quali livelli la vorrebbero.
- I controlli in Python hanno trovato difetti veri: valori anomali non abbastanza anomali (medie), triangoli con due angoli massimi uguali (punti notevoli), distrattori delle somme dei poligoni che non erano multipli di 180° (parallele). Con il terzo seed di Claude, le disequazioni di primo grado davano FAIL per una storia del livello 7 sottorappresentata: ora le cinque storie escono in parti uguali per costruzione.

## Informazioni nuove
- Il generatore di numeri casuali condiviso (`rng.ts`, mulberry32) dà una prima estrazione non uniforme per seed consecutivi (da 424242: 154 e 239 su 1.000 invece di 200). Il sito usa un seed casuale a 32 bit per esercizio, quindi gli studenti non lo vedono; tocca solo le verifiche, che usano seed consecutivi e possono dare FAIL sulle quote.
- Con il primo anno quasi chiuso restano da scrivere le sei lezioni di Insiemi e logica (intersezione, differenza e complementare, tre di logica). Sistemi di disequazioni ha tra i prerequisiti l'intersezione, oggi ancora vuota; nel testo il link va alla lezione 03.

## Domande aperte
Per Andrea, oltre ai dubbi in fondo a ogni nota (`docs/lezioni/note/52-62`) e a ogni specifica:
- la notazione degli intervalli $]a, b]$ e la scrittura delle soluzioni ("x < -3 oppure x > 2" o con gli intervalli);
- definizioni che cambiano tra i libri: triangolo isoscele (almeno due lati uguali), trapezio (due soli lati paralleli), rette parallele (le coincidenti contano), moda quando tutti i valori hanno la stessa frequenza;
- la 59 usa "supplementari di angoli congruenti sono congruenti", mentre la 58 enuncia solo "supplementari di uno stesso angolo";
- esercizi che vorrebbero una figura: il livello 1 delle disequazioni (retta), i livelli 1-3 delle parallele (gli otto angoli), gli aerogrammi, le dimostrazioni da completare.

## Prossimo argomento
Commit e deploy; poi le sei lezioni di Insiemi e logica per chiudere il primo anno, oppure il secondo anno.
