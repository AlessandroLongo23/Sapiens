# Formulario: Posta elettronica e altri servizi di Internet

## L'indirizzo di posta

- Posta elettronica (e-mail): il servizio che recapita un messaggio scritto alla casella di un destinatario, dove resta finché non viene letto.
- Indirizzo: nome utente, chiocciola, dominio. In `anna.rossi@scuola.example` il nome utente `anna.rossi` indica la casella e il dominio `scuola.example` indica il server di posta.
- Niente spazi; un carattere diverso è un'altra casella.

## Il viaggio di un messaggio

- Server di posta: computer sempre acceso che gestisce le caselle di un dominio.
- Casella: lo spazio, sul server, in cui si accumulano i messaggi arrivati per un indirizzo.

1. Il programma del mittente consegna il messaggio al server di posta del suo dominio (SMTP).
2. Il server del mittente lo passa al server del dominio del destinatario, che lo mette nella casella (SMTP).
3. Il programma del destinatario chiede i messaggi al proprio server (IMAP o POP3).

| Protocollo | A che cosa serve |
|---|---|
| SMTP | spedire |
| IMAP | leggere, lasciando i messaggi sul server: uguali su tutti i dispositivi |
| POP3 | leggere, scaricando i messaggi su un dispositivo e togliendoli dal server |

- Webmail: la posta letta dal browser, sul sito del servizio. Client di posta: un programma o un'app dedicata. La casella è la stessa e sta sul server.

## I campi di un messaggio

| Campo | Che cosa contiene |
|---|---|
| Da | l'indirizzo del mittente |
| A | i destinatari a cui il messaggio è rivolto |
| Cc | chi deve essere informato, senza dover rispondere |
| Ccn | destinatari che gli altri non vedono |
| Oggetto | l'argomento, in una riga |

- Allegato: un file che viaggia insieme al testo. Per i file grandi: caricarli nel cloud e scrivere il link.
- Rispondi: solo al mittente. Rispondi a tutti: anche a chi era in A e in Cc. Inoltra: a chi non aveva ricevuto il messaggio.
- Spam: posta indesiderata spedita in massa; finisce in una cartella apposita, dove a volte capita anche un messaggio vero.

## Un messaggio scritto bene

1. Oggetto che dice di che cosa si tratta, mai vuoto.
2. Saluto e, se serve, chi sei.
3. La richiesta nelle prime righe, una per messaggio.
4. Saluto finale, nome, cognome e classe.
5. L'allegato nominato nel testo e controllato prima di inviare.

## Gli altri servizi

- Comunicazione asincrona: chi scrive e chi legge non sono collegati nello stesso momento (posta, messaggi lasciati in chat).
- Comunicazione sincrona: le persone sono collegate insieme e si rispondono in tempo reale (telefonata, videochiamata).

| Servizio | A che cosa serve |
|---|---|
| messaggistica istantanea | messaggi brevi consegnati in pochi istanti |
| chiamate e videochiamate (VoIP) | voce e video in tempo reale |
| streaming | ascoltare o guardare un contenuto mentre arriva |
| trasferimento di file (FTP) | copiare file da un computer a un server e viceversa |

- Streaming: riproduci mentre i dati arrivano. Download: aspetti tutto il file, poi lo hai anche senza connessione.

```ad-warning
Ccn per i gruppi di persone che non si conoscono
Con trenta indirizzi in A o in Cc, ognuno vede gli indirizzi di tutti gli altri.
```

```ad-warning
Rispondi o rispondi a tutti
Prima di inviare, guarda a chi sta andando la risposta.
```

```ad-warning
La rete non è un solo servizio
Web, posta, chat e streaming usano la stessa rete ma hanno server diversi: uno può non funzionare mentre gli altri sì.
```
