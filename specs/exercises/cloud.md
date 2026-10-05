# cloud: Il cloud: archiviare, condividere e lavorare insieme

Generatore: `src/lib/exercises/v2/generators/cloud.ts`, con gli aiuti di `src/lib/exercises/v2/inf-web2.ts` e di
`inf-programmi.ts`. Verifica indipendente: `scripts/exercises/checkers/cloud.py` (aiuti in `_inf_web2.py`).
Lezione: `docs/lezioni/informatica/riscritte/39-cloud.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni di testo (`format: 'text'`, `answer.kind = 'choice'`). Il
conto della lezione (lo spazio) ha il suo livello, costruito all'indietro; i permessi di condivisione si applicano
a un caso nei livelli 4 e 5.

## Regole comuni

- Nessun marchio: "un servizio di archiviazione", "il servizio".
- 1 GB = 1000 MB, come nella lezione, e la regola è scritta in ogni problema del livello 2.
- I numeri da diecimila in su hanno le migliaia staccate da uno spazio stretto; i decimali hanno la virgola.
- `params.case` dice il caso; `solution` è il testo dell'opzione giusta; `steps` ha due frasi.

## Livello 1: che cos'è il cloud

Otto affermazioni vere e otto false su server, data center, copie dei file, client e risorse offerte come servizio.
Si chiede la vera tra tre false o la falsa tra tre vere, metà ciascuno. Le false: i file non stanno su nessun
computer, il cloud va comprato, ogni file sta in una sola copia, il telefono fa da server.

## Livello 2: quanto spazio serve

Tre conti, un terzo ciascuno, con risultati interi (i gigabyte con al più una cifra decimale).

- `quante`: "Un servizio di archiviazione offre 5 GB di spazio. Quante foto da 8 MB ci stanno?" Spazio tra 2, 5,
  10, 15, 20, 50 GB; foto da 2, 4, 5, 8 MB, canzoni da 4, 5, 8 MB, documenti da 1 o 2 MB. Risposta: 625 foto.
  Distrattori: la conversione con 100 o con 10 000, la moltiplicazione al posto della divisione, i megabyte non
  divisi.
- `occupano`: "Luca tiene nel cloud 10 video da 500 MB ciascuno. Quanti GB occupano in tutto?" Risposta: 5 GB.
  Distrattori: i megabyte chiamati gigabyte, la divisione per 100, per 10, per 10 000.
- `restano`: "Lo spazio di Pietro nel cloud è di 5 GB. Ci sono già 10 video da 250 MB ciascuno. Quante foto da 2 MB
  ci stanno ancora?" Risposta: 1250 foto. Distrattori: i video dimenticati, lo spazio occupato al posto di quello
  rimasto, un solo video tolto, i megabyte rimasti non divisi, i video aggiunti.

Controllo: i numeri si leggono dal testo e il conto si rifà in megabyte con frazioni esatte.

## Livello 3: che cosa fa la sincronizzazione

Una situazione tra cinque, un quinto ciascuna, con un nome e un file (una foto, una presentazione, una relazione,
una registrazione, una tabella, una mappa), e che cosa succede. Ogni situazione ha la sua risposta e quattro
risposte sbagliate, di cui ne escono tre.

- `cancella`: il file cancellato dal telefono sparisce anche dal cloud e dagli altri dispositivi. L'errore del
  riquadro: "resta nel cloud, che ne tiene una copia di sicurezza".
- `locale`: la funzione che libera memoria toglie solo la copia sul telefono.
- `offline`: la modifica fatta senza rete resta sul dispositivo e viene caricata quando la rete torna.
- `conflitto`: due modifiche allo stesso file senza rete; il servizio di solito conserva le due versioni.
- `nuova`: il file salvato viene copiato sul server e da lì sugli altri dispositivi.

## Livello 4: scegliere il permesso

- `basta` (circa 7 su 10): "Giulia condivide il file della presentazione con Chiara, che deve solo segnare a margine
  che cosa correggere, senza toccare il contenuto. Quale accesso conviene dare a Chiara, il più basso che basta?"
  Opzioni fisse: Nessun accesso, Lettura, Commento, Modifica. Nove bisogni (tre di lettura, tre di commento, tre di
  modifica), presi da soli o a coppie di livello diverso; la risposta è il permesso più alto tra quelli richiesti.
  Una volta su otto circa la persona non c'entra con il file, e la risposta è nessun accesso.
- `cosa` (circa 3 su 10): "Pietro ha ricevuto da Chiara il file della presentazione con il permesso di commento.
  Che cosa può fare con il file?" Opzioni fisse: niente, leggerlo, leggerlo e commentarlo, leggerlo e cambiarne il
  contenuto.

Controllo: i bisogni si leggono dal testo, ognuno ha il suo permesso nella tabella, e vince il più alto.

## Livello 5: invito o link

- `apre con l'invito`, `apre con il link` (circa 55 su 100 insieme): un conto. "Elena condivide le foto della gita
  con un invito agli indirizzi di 6 compagni. Uno di loro inoltra il messaggio di invito ad altre 9 persone.
  Quante persone, oltre a Elena, possono aprire il file?" Con l'invito solo gli invitati (6); con il link aperto a
  chiunque anche chi lo ha ricevuto dopo (6 + 9). Compagni da 3 a 9, altre persone da 2 a 13, mai lo stesso numero.
  Distrattori: il numero dell'altro modo, le sole persone dell'inoltro, uno in più o in meno.
- `modo` (circa 45 su 100): un file da condividere e il modo, con il permesso. Opzioni: quattro tra "Con un invito
  a persone precise" e "Con un link aperto a chiunque", ciascuno in lettura, commento o modifica. Un file per
  persone precise o con dati personali va con l'invito; un file per chiunque, senza dati personali, con il link.

## Livello 6: lavorare insieme nel cloud

- `rimedio` (circa metà): una situazione e lo strumento, tra cronologia delle versioni, cestino del servizio,
  commento, seconda copia fuori dal cloud, togliere la condivisione (ne escono quattro). Due situazioni per
  strumento. Esempio: "Pietro ha cancellato per errore dal suo spazio nel cloud tutto il file della ricerca di
  geografia, dieci minuti fa." Risposta: guardare nel cestino del servizio.
- `vera`, `falsa`: dieci affermazioni vere e dieci false su file condiviso e allegati, cronologia, applicazioni
  web, vantaggi e limiti del cloud.

## Da evitare

- 1 GB = 1024 MB: la lezione usa 1000.
- Conti con il resto ("quante foto intere ci stanno"): i numeri sono scelti perché la divisione sia esatta.
- Nomi di servizi commerciali, che la lezione cita solo come esempio di archiviazione.
- Situazioni di condivisione in cui vanno bene sia l'invito sia il link: il testo dice sempre "solo" per le
  persone precise oppure "chiunque".
- Nel livello 3, risposte che dipendono dal singolo servizio (quanti giorni resta un file nel cestino).
