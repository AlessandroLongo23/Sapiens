# Note: Internet, la rete delle reti

Lezione nuova, scritta da zero (lotto del secondo anno, capitolo "Internet e il web", 5 ottobre 2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard. 160 righe, 2 figure, 3 esempi.

## Struttura

Che cos'è una rete (collegamenti con e senza filo, LAN e WAN); Internet come rete di reti, con router e fornitore di accesso; i pacchetti e i tre motivi per cui si usano; i protocolli, con TCP e IP in due righe; Internet e i suoi servizi, distinti dal web; tre date di storia e il rimando alla velocità di trasmissione.

Avvisi: il Wi-Fi non è Internet; Internet e web non sono sinonimi.

## Scelte

- "Fornitore di accesso" come termine, con "provider" e ISP tra parentesi la prima volta. Nei libri si trova quasi sempre "provider": da decidere quale dei due resta.
- "Rete locale (LAN)" e "rete geografica (WAN)", senza MAN e PAN: la classificazione completa è della lezione "Elementi e tipi di rete" del quinto anno.
- Del router si dice solo che unisce due reti e passa i pacchetti. Switch, access point e modem non ci sono (quinto anno). La "scatola con le lucine" di casa è chiamata router, anche se di solito fa anche da modem, switch e access point.
- Il pacchetto porta "un numero che dice quale pezzo è": è una semplificazione. Il numero d'ordine sta nell'intestazione TCP, non in quella IP; la lezione non distingue le due intestazioni.
- TCP/IP: i due protocolli in una riga ciascuno, senza livelli, senza UDP, senza porte.
- La velocità di trasmissione e i conti sul tempo di scaricamento sono già nella lezione 03: qui c'è solo il link, nell'ultima riga.
- Nella figura dei pacchetti e negli esempi le persone sono Anna e Luca, come nella lezione 22.

## Conti

Esempio 1: 3 000 000 : 1500 = 2000. Il pacchetto da 1500 B è un'ipotesi dichiarata nel testo ("supponi che"); è la dimensione massima di una trama Ethernet, e i dati utili sono un po' meno.

## Fonti e cose da verificare

Scritti a memoria, non ricontrollati in rete in questa sessione: tutti da verificare.

- ARPANET, 1969, primi quattro nodi (UCLA, Stanford Research Institute, UC Santa Barbara, University of Utah). Il testo dice "quattro centri di ricerca" perché lo SRI non è un'università. Fonte da citare: Internet Society, "A Brief History of the Internet" (Leiner e altri, 1997).
- ARPANET passa a TCP/IP il 1° gennaio 1983 (stessa fonte).
- "Una delle prime reti a far viaggiare i dati a pacchetti": la rete del National Physical Laboratory inglese è dello stesso periodo, per questo non c'è scritto "la prima".
- "Internet esisteva da una ventina d'anni quando il web è nato": conta ARPANET (1969) come inizio di Internet. Chi fa cominciare Internet dal 1983 troverà la frase larga.
- L'origine del nome: "internetwork", da "internetworking". Da verificare su un dizionario etimologico.
- Cavi sottomarini in fibra ottica per i collegamenti tra continenti: vero, senza numeri nel testo.

## Figure

- `internet-rete-di-reti`: due reti locali con tre dispositivi e un router ciascuna, due reti di fornitori, le altre reti del mondo.
- `pacchetti-strade-diverse`: quattro router a rombo tra Anna e Luca, tre pacchetti numerati su strade diverse. L'esempio 2 si legge su questa figura.

Guardate in chiaro e in scuro. Corretto dopo la prima anteprima: le caselle dei dispositivi si toccavano e avevano altezze diverse (ora hanno la stessa altezza e sono distanziate); la seconda figura superava di poco i 9 cm.

## Domande per Andrea

- "Fornitore di accesso" o "provider" come termine principale?
- LAN e WAN bastano, o al secondo anno i libri chiedono anche MAN?
- La storia in tre date (1969, 1983, inizio anni Novanta) va bene, o serve più spazio?
