# Note: Il DOM e gli eventi

Lezione nuova, scritta il 7 ottobre 2026 (terzo anno, capitolo "Pagine web interattive", gruppo 14). Non pubblicata.

## Struttura

Apertura con il bottone "Mostra la scaletta" che non fa niente; il DOM come albero vivo; selezionare; cambiare testo, classi e stile; eventi e ascoltatori; creare un elemento; tre esercizi.

- Pagine da modificare: 3 (lo script che lavora al caricamento; i due bottoni; il bis aggiunto alla scaletta), più 3 esercizi.
- Figura interattiva: 1. Riquadri `ad-warning`: 2 (il selettore che non prende niente, le parentesi dopo il nome della funzione).
- Un blocco di codice semplice (non eseguibile) per la sola riga di `addEventListener`, nel punto in cui viene definita.

## Confini con le lezioni vicine

- La 96 ha già detto perché serve `defer`: qui c'è solo un rimando nel riquadro sul selettore.
- Leggere i campi di un modulo (`value`, `checked`), l'oggetto dell'evento e `preventDefault()` sono della 98. Qui gli ascoltatori non hanno parametri. L'evento `input` e l'evento `submit` sono solo nominati.
- L'albero del documento è della 88: qui c'è un link, e la figura lo ridisegna con lo stesso aspetto di quella della 87.
- Niente propagazione degli eventi (bubbling), niente `event.target`, niente `innerHTML`, niente `remove()`, niente `setTimeout`.

## Scelte

- Gli ascoltatori sono funzioni con un nome, definite prima e passate per nome. Le funzioni anonime e le funzioni freccia non compaiono: l'errore delle parentesi (`mostra()`) si spiega bene solo con una funzione che ha un nome.
- Tra `classList` e `style` la lezione dice di preferire la prima, e gli esempi usano solo classi. `style` è spiegato in un punto dell'elenco.
- Il risultato di `querySelectorAll` "si usa come un vettore": è una semplificazione (è una NodeList), sufficiente per `length` e per l'indice.
- La variabile che conta i clic è globale, con il link alla 67 e la ragione.
- La pagina dei due bottoni e la figura mostrano la stessa cosa: la figura ha due voci di scaletta invece di tre, per stare nel telefono.
- `append` e non `appendChild`.

## Elementi interattivi

- Tre pagine con lo script: che cosa succede se il selettore non prende niente? Che differenza c'è tra `toggle` e `remove`? Che cosa succede a un nodo creato e mai attaccato?
- `inf-dom-albero-eventi` (`DomAlberoEventi.tsx`): quando premo un bottone, quale nodo riceve l'evento e quale nodo viene cambiato? Cinque passi per clic: pagina ferma, evento sul nodo del bottone, ascoltatore chiamato, nodo cambiato, pagina ridisegnata. I bottoni della pagina disegnata fanno partire il percorso.
- Tre esercizi con i controlli sul comportamento (`> clic`, `testo =`, `classe`, `quanti =`). Il primo esercizio ha un controllo senza azioni sullo stato prima del clic (aggiunto dalla revisione del lotto): boccia chi scrive `chiudi()` con le parentesi, che cambia la pagina al caricamento. Il programma di partenza quel controllo lo supera già, ed è voluto. Nel secondo e nel terzo l'errore viene bocciato perché l'effetto dei clic si accumula.

## Domande per Andrea

- Gli ascoltatori sono sempre funzioni con un nome. Vuoi che la lezione mostri anche la funzione scritta dentro `addEventListener`, che è la forma più comune nei siti veri?
- "Ascoltatore" per listener: va bene, o a scuola si dice "gestore dell'evento"?
- La lezione non parla della propagazione degli eventi. Basta così per il terzo anno?
- `innerHTML` non c'è, per non insegnare un'abitudine rischiosa. Sei d'accordo?

## Da verificare

- La figura mostra la pagina ridisegnata un passo dopo il cambiamento del DOM. È una separazione didattica: il browser ridisegna quando la funzione è finita, e lo studente non vede mai lo stato intermedio.
- Dopo `classList.toggle("nascosto")` che toglie l'unica classe, l'attributo resta scritto come `class=""`: la figura lo mostra così. Da ricontrollare su più browser.

## Verifiche

- `check.mts`: nessun errore, nessun avviso. `verifica.mts`: tre avvisi attesi (pagine web).
- Nel browser (Playwright, 1280 e 390 px): tutte le pagine eseguite; i tre esercizi con "Verifica" sul codice di partenza (bocciato), sulla soluzione (superato) e su sei risposte sbagliate scritte apposta (vedi il rapporto del gruppo).

Prerequisiti proposti: inf-script-client, inf-html-struttura, inf-css-regole, inf-definire-funzioni

## Revisione del lotto (7 ottobre 2026)

- Terzo esercizio: i nomi che entrano sul palco sono i quattro del gruppo (Sara, Leo, Marta, Dario), non più Giada, Tommaso e Samir; i controlli contano fino a quattro. `display: none` ha la sua mezza frase ("toglie l'elemento dalla pagina").
- Le altre correzioni della revisione sono segnate nei punti della nota a cui si riferiscono.
