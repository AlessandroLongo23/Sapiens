# inf-servizi-internet: Posta elettronica e altri servizi di Internet

Generatore: `src/lib/exercises/v2/generators/inf-servizi-internet.ts`, con gli aiuti di
`src/lib/exercises/v2/inf-web2.ts` e di `inf-programmi.ts`. Verifica indipendente:
`scripts/exercises/checkers/inf_servizi_internet.py` (aiuti in `_inf_web2.py`). Lezione:
`docs/lezioni/informatica/riscritte/37-inf-servizi-internet.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni di testo (`format: 'text'`, `answer.kind = 'choice'`). La
lezione non ha programmazione: le domande si compongono da pezzi intercambiabili, e dove la lezione ha una struttura
(l'indirizzo, i tre passi del viaggio, i campi A, Cc e Ccn) lo studente la applica a un caso composto ogni volta.

## Regole comuni

- Indirizzi inventati: nome utente da un nome e un cognome (`anna.rossi`, `a.rossi`, `annarossi`), dominio tra
  `scuola.example`, `liceo.example`, `posta.example`, `comune.example`, `biblioteca.example`, `museo.example`,
  `esempio.it`. Nessun marchio.
- Nomi di persona da un elenco di dodici. Davanti a un nome che comincia per A si scrive "ad", davanti a E "ed".
- `params.case` dice il caso; il controllo lo confronta con quello che riconosce dal testo.
- `solution` è il testo dell'opzione giusta; `steps` ha due frasi.

## Livello 1: le parti di un indirizzo

Cinque casi, un quinto ciascuno, su un indirizzo composto ogni volta.

- `utente`, `dominio`: "Nell'indirizzo l.bianchi@scuola.example qual è il nome utente, cioè la parte che indica la
  casella?" Giusta: `l.bianchi`. Distrattori: il dominio, l'indirizzo intero, il solo cognome, la prima parola del
  dominio (per il dominio: il nome utente, l'indirizzo intero, `example`, `scuola`).
- `stesso`: "Davide ha l'indirizzo davidefabbri@posta.example. Quale di questi indirizzi ha la casella sullo stesso
  server di posta?" Giusta: un altro nome utente sullo stesso dominio. Distrattori: lo stesso nome utente su un altro
  dominio (l'errore del riquadro: due persone possono avere lo stesso nome su due domini), la parola del dominio a
  sinistra della chiocciola, un terzo indirizzo.
- `valido`: "Quale di questi è scritto come un indirizzo di posta elettronica?" Giusta: `nome.cognome@dominio`.
  Distrattori, tre tra: con uno spazio, senza chiocciola, senza dominio, senza nome utente, con due chiocciole,
  scritto come un indirizzo web.
- `arriva`: "Irene vuole scrivere a tommaso.rossi@biblioteca.example ma come destinatario scrive
  tommaso.rossi@liceo.example e invia. Che cosa succede al messaggio?" L'indirizzo scritto differisce per un punto
  mancante, una lettera mancante o il dominio (giusta: va a un'altra casella oppure torna indietro), oppure solo
  per le maiuscole (giusta: arriva, perché maiuscole e minuscole di solito non contano). Distrattori: il server
  corregge l'indirizzo, conta solo il dominio, arriva a tutte le caselle, le maiuscole non sono valide.

Controllo: l'indirizzo si legge dal testo e si divide alla chiocciola; un indirizzo è valido se rispetta lo schema
`utente@dominio.con.un.punto`; due indirizzi sono la stessa casella se sono uguali a meno delle maiuscole.

## Livello 2: il viaggio di un messaggio

- `passo` (circa 65 su 100): "Giulia (giulia.riva@scuola.example) scrive a Chiara (chiara.bianchi@esempio.it). A
  quale computer consegna il messaggio il programma di Giulia?" Quattro domande: a chi consegna il programma del
  mittente; chi legge il dominio del destinatario; dove aspetta il messaggio; a chi si collega il programma del
  destinatario. Le prime due hanno per risposta il server del mittente, le altre due quello del destinatario. Le
  quattro opzioni sono sempre i due server e i due dispositivi: il dispositivo del destinatario è l'errore tipico
  (il messaggio non va da un dispositivo all'altro).
- `protocollo` (circa 35 su 100): una situazione e il suo protocollo tra SMTP, IMAP, POP3 e FTP. SMTP quando un
  messaggio viene spedito, IMAP quando i messaggi restano sul server, POP3 quando vengono scaricati e tolti.

I due domini sono sempre diversi.

## Livello 3: A, Cc o Ccn

Una situazione con un destinatario, e il campo dove va il suo indirizzo; le opzioni sono sempre A, Cc, Ccn e
Oggetto. I tre campi sono giusti un terzo delle volte ciascuno.

- A: "Luca manda la relazione di laboratorio alla professoressa di scienze: è la professoressa che deve leggere e
  rispondere. In quale campo va l'indirizzo della professoressa?"
- Cc: lo stesso messaggio, e una persona che deve essere informata senza dover rispondere.
- Ccn: un invito a un numero di persone tra 12 e 40 che non si conoscono, e nessuno deve vedere gli indirizzi degli
  altri.

## Livello 4: chi riceve e chi vede

Un messaggio con le tre liste scritte per nome: da 1 a 3 persone in A, in Cc e in Ccn, almeno 3 tra A e Cc, tutte
diverse tra loro e dal mittente. Quattro domande, un quarto ciascuna.

- `ricevono`: quante persone ricevono il messaggio (A + Cc + Ccn). Distrattori: senza i Ccn, uno in più (il
  mittente), solo A.
- `nascosto`: quale di questi destinatari resta nascosto agli altri (uno dei Ccn, tra tre di A e Cc).
- `rispondi`: uno dei destinatari di A o Cc preme Rispondi; quante persone ricevono la risposta (1, il mittente).
- `tutti`: lo stesso con Rispondi a tutti (il mittente più gli altri di A e Cc: A + Cc). Distrattori: anche i Ccn,
  solo il mittente, senza il mittente.

Esempio: "Tommaso manda un messaggio: in A mette Anna, Chiara e Sara, in Cc mette Elena e in Ccn mette Luca, Giulia
e Davide. Sara preme Rispondi a tutti. Quante persone ricevono la sua risposta?" Risposta: 4 persone.

Controllo: le tre liste si leggono dal testo e le persone si contano lì.

## Livello 5: quale servizio usare

- `servizio` (circa 6 su 10): una situazione e il suo servizio tra posta elettronica, messaggistica istantanea,
  videochiamata, streaming, scaricamento del file, trasferimento di file su un server. Tre situazioni per servizio.
  Scaricamento e trasferimento di file non stanno mai insieme quando uno dei due è la risposta.
- `sincrona`, `asincrona`: la comunicazione sincrona tra tre asincrone, o il contrario. Sei per parte.

## Livello 6: vero o falso sui servizi di rete

Dodici affermazioni vere e dodici false su webmail e client, casella, spam, allegati, streaming e download, chiamate
via Internet, Internet e web, Rispondi a tutti, Inoltra, oggetto. Si chiede la vera tra tre false o la falsa tra tre
vere, metà ciascuno. Le false sono gli errori dei riquadri della lezione.

## Da evitare

- Domande sul significato delle sigle (SMTP, IMAP, PEC) o sui nomi dei servizi commerciali: sono memoria.
- Un indirizzo in fondo a una frase seguito da un punto che può sembrare parte dell'indirizzo, dove si può evitare.
- Nel livello 4, chiedere che cosa vede chi sta in Ccn: la lezione non lo dice.
- Liste così lunghe che il conto diventa una prova di attenzione: al più tre persone per campo.
