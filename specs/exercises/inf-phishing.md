# Phishing e truffe in rete

Generatore: `inf-phishing` (`src/lib/exercises/v2/generators/inf-phishing.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-sic.ts`). Verifica indipendente: `scripts/exercises/checkers/inf_phishing.py`. Lezione
collegata: `docs/lezioni/informatica/riscritte/42-inf-phishing.md`.

Cinque livelli, tutti a scelta multipla con quattro opzioni di testo (campioni in testo semplice). I livelli 2 e 3
sono sul nome di dominio di un indirizzo, costruito all'indietro dalle sue parti. Tutti i domini sono inventati:
`esempio.it` e nomi sotto `.example`. Si chiede di riconoscere una trappola, mai di costruirne una.

## Nomi dei livelli

1. I segnali in un messaggio
2. Il dominio che conta
3. Di chi è questo indirizzo
4. Che cosa fare
5. Vero o falso sul phishing

## Livello 1: i segnali in un messaggio

Dieci segnali (`g1`-`g10`: il dominio del mittente diverso, il tono urgente, il saluto generico, la richiesta di
password o codici, il pulsante che porta altrove, il premio, la minaccia, i pagamenti con ricariche, il programma da
installare) e otto particolari che non provano niente (`n1`-`n8`: l'italiano corretto, il logo, la data, la firma…).
Due domande, metà ciascuna:

- segnale: "Quale di questi particolari di un messaggio è un segnale di phishing?" Un segnale e tre particolari
  neutri.
- neutro: "Quale di questi particolari, da solo, non dice niente sull'onestà di un messaggio?" Un particolare neutro e
  tre segnali.

Distrattore: prendere l'aspetto per una prova (l'avviso "Un messaggio scritto bene non è per questo vero").

## Livello 2: il dominio che conta

"Un link porta a https://esempio.it.accesso.example/accedi e vuoi sapere di chi è il sito. Quali sono le due parti
dell'indirizzo che lo dicono?" Risposta: accesso.example. L'indirizzo si compone da un sito vero (otto: `esempio.it`,
`banca.example`, `corriere.example`…), un percorso e:

- esca (55 su 100): il sito vero scritto a sinistra del dominio di qualcun altro (`accesso.example`,
  `premi-vip.example`…);
- semplice (45 su 100): una parte aggiunta dal proprietario (`www`, `accedi`, `app`…) davanti al sito vero.

Distrattori: le prime due parti a sinistra (`esempio.it`: l'errore di leggere da sinistra), tutto quello che sta
prima della barra, la prima parte con l'ultima.

## Livello 3: di chi è questo indirizzo

"Il sito vero di un corriere è corriere.example. Quale di questi indirizzi gli appartiene?"

- vero (6 su 10): un indirizzo del sito vero (con o senza una parte a sinistra) e tre che non lo sono;
- falso (4 su 10): "… non gli appartiene?", un indirizzo falso e tre veri.

Gli indirizzi falsi sono di quattro tipi, quelli dell'esempio 1 della lezione: il sito vero a sinistra di un altro
dominio (`https://corriere.example.avvisi.example/pacco`); il trattino (`https://corriere-online.example/…`,
`https://esempio-it.example/…`); le lettere che si somigliano (`https://www.coriere.example/…`,
`https://www.esernpio.it/…`); il nome del sito dopo la barra (`https://avvisi.example/corriere.example`).

Gli indirizzi lunghi non stanno in 330 px: nel testo e nelle opzioni hanno uno spazio di larghezza nulla (U+200B)
dopo ogni punto e ogni barra, così possono andare a capo. `values` e `params` portano l'indirizzo senza.

## Livello 4: che cosa fare

Tredici situazioni con un nome estratto, la cosa giusta e quattro sbagliate (se ne mostrano tre): l'SMS del pacco, la
telefonata del finto operatore, il codice chiesto in chat da un compagno, l'annuncio con le ricariche, le monete
gratis, il codice QR, la mail "account chiuso entro 24 ore", il gestore di password che non propone le credenziali,
la scadenza a dieci minuti; e dopo l'errore: la password scritta su una pagina falsa, i dati della carta, che cosa
fare del messaggio riconosciuto, la vergogna di dirlo.

Distrattori: fidarsi del lucchetto, del logo o del numero di visualizzazioni; rispondere sullo stesso canale; "agire
subito e controllare dopo".

## Livello 5: vero o falso sul phishing

Dodici affermazioni vere e dodici false, le false prese dagli avvisi (il lucchetto, il messaggio scritto bene, "ci
cascano solo gli ingenui"). Metà "… è vera?", metà "… è falsa?".

## Esercizi da evitare

- Domini veri o marchi: solo `esempio.it` e `.example`.
- Testi di messaggi-esca completi, pronti da copiare.
- Particolari "neutri" che in realtà rassicurano (per esempio "arriva dall'indirizzo ufficiale").

## Verifica

`inf_phishing.py` ritaglia dall'indirizzo quello che sta tra `://` e la prima barra e ne prende le ultime due parti:
al livello 2 quella è la risposta, al livello 3 un indirizzo appartiene al sito se quelle due parti sono il dominio
dato nel testo. Controlla che gli a capo possibili siano solo dopo punti e barre. I livelli 1, 4 e 5 hanno le loro
tabelle.

## Domande per la revisione

- Livello 1: i particolari neutri (italiano corretto, logo, data di oggi, firma, immagine) vanno bene come "non
  dicono niente"?
- Livello 3: i nomi che si somigliano (`esernpio`, `p0sta`, `scuo1a`, `coriere`) e i siti inventati
  (`banca.example`, `registro.example`) vanno bene?
