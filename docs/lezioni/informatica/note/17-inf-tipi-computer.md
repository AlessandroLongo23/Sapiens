# Note: Computer, dispositivi mobili e sistemi embedded

Lezione nuova (3 ottobre 2026), ultima del capitolo. Non esisteva un originale.

## Struttura ed esempi

Che cosa resta uguale (i quattro blocchi e il programma memorizzato); che cosa cambia (cinque caratteristiche, con la
distinzione tra uso generale e dedicato); le cinque famiglie con la figura e la tabella; dentro un sistema embedded
(microcontrollore, sensori, attuatori) con la figura; i confini non netti.

Quattro esempi svolti: i blocchi di un termostato; quale computer per cinque lavori; uso generale o dedicato su quattro
oggetti; sensori e attuatori di una lavatrice.

Avvisi: lo smartphone è un computer; server è un ruolo, non una taglia; senza tastiera e senza schermo le periferiche ci
sono lo stesso.

## Scelte

- Cinque famiglie: supercomputer, server, personal computer, dispositivi mobili, sistemi embedded. Niente mainframe,
  workstation, minicomputer, che alcuni libri elencano ancora.
- "Sistema embedded" resta in inglese, come nel titolo della lezione, con "incorporato" tra parentesi una volta.
  "Dispositivo mobile", "personal computer", "server", "supercomputer", "data center", "microcontrollore", "sensore",
  "attuatore".
- Uso generale e dedicato: il criterio è che cosa può eseguire, non la taglia. Server e supercomputer non sono chiamati
  "di uso generale" nella tabella, che ha la colonna "quali programmi esegue"; negli esercizi si chiede "è un sistema
  embedded" e "non è un sistema embedded", non "è di uso generale", per non dover decidere su server e supercomputer.
- I casi di confine (console, televisore con le app) sono nominati nell'ultima sezione e non entrano negli esercizi.
- Niente numeri: né potenze di calcolo, né capacità, né prezzi, né consumi.
- La memoria non volatile con il programma del microcontrollore non è chiamata firmware né flash.

## Fatti da verificare

- Leonardo, supercomputer del CINECA al Tecnopolo di Bologna, inaugurato nel novembre 2022 (comunicati del CINECA e di
  EuroHPC): nel testo solo "In Italia c'è Leonardo, a Bologna". Da verificare che sia ancora in funzione quando la
  lezione viene pubblicata.
- "Consuma quanto un paese": i grandi supercomputer assorbono alcuni megawatt, quanto qualche migliaio di abitazioni.
  Ordine di grandezza da verificare.
- Un microcontrollore "costa pochi euro": prezzi al dettaglio del 2026, da verificare.
- "In una casa ce ne sono decine, in un'automobile altrettanti": stima diffusa (le auto recenti hanno da alcune decine
  a oltre cento centraline), senza una fonte precisa. Da verificare, o da ammorbidire in "molti".
- "È il tipo di computer più numeroso": i microcontrollori venduti ogni anno sono decine di miliardi, contro poche
  centinaia di milioni di personal computer; ordini di grandezza che ricordo, da verificare.
- "Il telefono che hai in tasca è più potente dei supercomputer di qualche decennio fa": vero nel confronto con i
  supercomputer degli anni Ottanta e Novanta, da verificare con un esempio se si vuole citarne uno.

## Figure

- `famiglie-di-computer` (TikZ): cinque riquadri in colonna, dal sistema embedded al supercomputer, con due frecce.
- `sistema-embedded-sensori-attuatori` (TikZ): sensori, microcontrollore (CPU, memoria, interfacce), attuatori.

Guardate in chiaro e in scuro.

## Per il generatore

`inf-tipi-computer`, quattro livelli a scelta multipla (specifica in `specs/exercises/inf-tipi-computer.md`): quale
computer per quale lavoro; embedded o no; che cosa cambia e che cosa resta; i blocchi in un sistema embedded.

## Domande per Andrea

- Cinque famiglie senza mainframe: va bene?
- "Sistema embedded" in inglese: i vostri libri dicono "sistemi embedded", "sistemi integrati" o "sistemi dedicati"?
- Sensori e attuatori sono al posto giusto in questa lezione, o vanno anticipati nella lezione sulle periferiche?
- I numeri su quanti sistemi embedded ci sono in casa e in auto: tenerli, con una fonte, o toglierli?
- La lezione ha quattro esempi svolti e nessun conto: serve altro per una verifica su questo argomento?
