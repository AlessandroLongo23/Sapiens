# Avvio del computer e interfacce utente

Generatore: `inf-avvio-interfacce` (`src/lib/exercises/v2/generators/inf-avvio-interfacce.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-so.ts`). Verifica indipendente: `scripts/exercises/checkers/inf_avvio_interfacce.py`.
Lezione collegata: `docs/lezioni/informatica/riscritte/19-inf-avvio-interfacce.md`.

Cinque livelli, tutti a scelta multipla con quattro opzioni (`answer.kind = 'choice'`), composti da pezzi
intercambiabili.

## Nomi dei livelli

1. Le fasi dell'avvio
2. L'ordine delle fasi
3. Vero o falso sull'avvio
4. Gli elementi dell'interfaccia
5. Riga di comando o grafica

## Regole comuni

- Il testo sta in righe `\text{…}` scritte con `textBlock`; le opzioni di testo sono `\text{…}`, su più righe con
  `\begin{gathered}` quando superano i 28 caratteri (il bottone della risposta sul telefono è largo 252 px).
- Niente trattini lunghi e niente "piuttosto che" (il `check()` lo controlla).
- I nomi di persona vengono da un elenco di dodici; nessun marchio nel testo.
- Le cinque fasi, nell'ordine, con il nome usato nelle opzioni: L'avvio del firmware; L'autodiagnosi (POST); La ricerca
  del disco di avvio; Il caricamento del nucleo; L'avvio di servizi e interfaccia.
- I dispositivi sono cinque: portatile, computer fisso, telefono, tablet, console.

## Livello 1: le fasi dell'avvio

Due frasi per fase, ognuna con un nome di persona e un dispositivo. Si chiede "Quale fase dell'avvio descrive la
frase?". Opzioni: la fase giusta e tre delle altre quattro. Ogni frase contiene le parole della sua fase, e solo
quelle: il chip o la memoria non volatile (firmware), il controllo dei componenti (autodiagnosi), le memorie di massa
esaminate in un ordine fissato o nessuna memoria di massa con un sistema operativo (ricerca), la copia del nucleo o il
bootloader (caricamento), i driver o la password (servizi e interfaccia).

Esempi:

- "Il bootloader del tablet di Irene passa il controllo al nucleo, che ha appena copiato nella RAM." Risposta: Il
  caricamento del nucleo.
- "La console di Marco si ferma con un messaggio: nessuna memoria di massa contiene un sistema operativo." Risposta:
  La ricerca del disco di avvio. Distrattore tipico: L'autodiagnosi (POST).

## Livello 2: l'ordine delle fasi

Tre domande:

- dopo (circa 1 su 4): "Durante l'avvio del telefono, quale fase viene subito dopo l'autodiagnosi (POST)?";
- prima (circa 1 su 4): "… quale fase viene subito prima del caricamento del nucleo?";
- sequenza (circa metà): "Quale elenco mette queste fasi dell'avvio del portatile nell'ordine in cui avvengono?", con
  tre o quattro fasi scelte tra le cinque e scritte con il nome breve (firmware, autodiagnosi, ricerca del disco,
  nucleo, interfaccia). Opzioni: l'ordine giusto e tre altri ordini delle stesse fasi (due fasi vicine scambiate,
  l'ordine rovesciato, altri).

Esempi:

- "Durante l'avvio della console, quale fase viene subito dopo la ricerca del disco di avvio?" Risposta: Il caricamento
  del nucleo.
- Sequenza con firmware, ricerca del disco, interfaccia. Risposta: Firmware, ricerca del disco, interfaccia.
  Distrattore: Firmware, interfaccia, ricerca del disco.

## Livello 3: vero o falso sull'avvio

Dieci affermazioni vere (`t1`-`t10`) e dieci false (`f1`-`f10`), le false prese dagli avvisi della lezione (il firmware
confuso con il sistema operativo, il sistema operativo che resterebbe nella RAM a computer spento, la sospensione
confusa con l'avvio). "Quale di queste affermazioni sull'avvio è vera?" (una vera e tre false) oppure "… è falsa?"
(una falsa e tre vere), metà ciascuna.

Esempi:

- "… è vera?" Risposta possibile: Il bootloader copia il nucleo nella RAM.
- "… è falsa?" Risposta possibile: Togliendo il disco, il firmware non parte più.

## Livello 4: gli elementi dell'interfaccia

Otto elementi, quattro per interfaccia: prompt, nome del comando, argomento, interprete dei comandi; finestra, icona,
menu, puntatore. Tre descrizioni per elemento, una delle quali con un nome di persona ("il piccolo disegno che Sara
tocca per avviare un gioco"). "Nell'interfaccia a riga di comando, come si chiama la scritta con cui
il sistema segnala che è pronto a ricevere un comando?" Opzioni: l'elemento giusto e tre degli altri sette.

Esempi:

- "Nell'interfaccia grafica, come si chiama l'elenco di comandi tra cui scegliere?" Risposta: Il menu.
- "Nell'interfaccia a riga di comando, come si chiama, nella riga cd Documenti, la parola Documenti?" Risposta:
  L'argomento. Distrattore tipico: Il nome del comando.

## Livello 5: riga di comando o grafica

Otto caratteristiche della riga di comando (`c1`-`c8`) e otto dell'interfaccia grafica (`g1`-`g8`), dalla tabella di
confronto della lezione. "Quale di queste è una caratteristica dell'interfaccia a riga di comando?" (una sua e tre
dell'altra), oppure "… dell'interfaccia grafica?", metà ciascuna.

Esempi:

- "… a riga di comando?" Opzioni: Sui telefoni si usa con le dita; Una sola riga può agire su centinaia di file; Ogni
  programma lavora dentro una finestra; File e cartelle sono rappresentati da icone. Risposta: la seconda.
- "… grafica?" Risposta possibile: I comandi disponibili sono in vista nei menu.

## Esercizi da evitare

- Una frase del livello 1 con le parole di due fasi.
- Elenchi del livello 2 con fasi diverse da un'opzione all'altra.
- Domande su nomi di comandi di un sistema preciso (`dir`, `ls`): sono memoria, e cambiano da un sistema all'altro.

## Verifica

`scripts/exercises/checkers/inf_avvio_interfacce.py` classifica la frase del livello 1 dalle parole della fase (una
sola fase deve corrispondere); al livello 2 ricava la fase vicina o l'elenco ordinato dall'ordine delle fasi scritto
nel controllo, e controlla che i quattro elenchi contengano le stesse fasi; ai livelli 3 e 5 usa le sue tabelle; al
livello 4 abbina la descrizione all'elemento dalle parole e controlla che l'elemento appartenga all'interfaccia
nominata. Poi le quattro opzioni e la quota dei casi.

## Domande per la revisione

- Le fasi sono cinque. I libri a volte ne contano tre (POST, bootstrap, caricamento del sistema): quale schema si
  preferisce?
- Livello 4: la descrizione dell'argomento usa `cd Documenti`, un comando uguale nei sistemi più diffusi. Va bene, o
  si evita ogni comando reale negli esercizi?
