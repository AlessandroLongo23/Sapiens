# Note: Posta elettronica e altri servizi di Internet

Lezione nuova, scritta da zero (secondo anno, capitolo "Internet e il web", 5 ottobre 2026). `check.mts` passa senza
errori e senza avvisi su lezione, formulario e flashcard. 157 righe, due figure, due esempi svolti, quattro avvisi.

## Struttura

Apertura: Internet trasporta, i servizi stanno sopra. La posta: indirizzo (figura), viaggio di un messaggio in tre
passi (figura) con SMTP, IMAP e POP3, webmail e client, campi del messaggio (A, Cc, Ccn), rispondi e inoltra, come si
scrive una mail a un insegnante, allegati, spam, una nota sulla PEC. Poi comunicazione sincrona e asincrona, e la
tabella degli altri servizi: messaggistica istantanea, chiamate e videochiamate (VoIP), streaming, trasferimento di
file (FTP).

## Scelte

- Le lezioni 33-36 sono date per note e linkate: client-server, nome di dominio, web. Il DNS non è nominato: il
  passo 2 dice solo che il server "trova il server di posta di quel dominio" (i record MX sono del quinto anno).
- Tre protocolli con il nome sciolto: SMTP, IMAP, POP3. Il passaggio dal programma del mittente al suo server è
  descritto come SMTP anche per la webmail, dove in realtà il browser parla HTTP con il sito e SMTP parte dal
  server: semplificazione, la figura dice "dispositivo di Anna" e non "browser".
- "Ccn" (copia conoscenza nascosta) e "Cc" (copia conoscenza), come nelle interfacce in italiano; in inglese Bcc.
  Non l'ho scritto nella lezione.
- "Mail" compare nel testo corrente come parola d'uso ("si scrive una mail"); il termine definito è "posta
  elettronica", il singolo invio è "messaggio".
- Phishing e allegati dannosi: una frase con i link alle lezioni 42 e 40, senza regole per riconoscerli.
- Social network, forum, newsletter e mailing list non ci sono. I social sono applicazioni web e toccano
  privacy e cittadinanza digitale, che sono del capitolo successivo.
- La differenza tra "arrivare interi" (posta) e "arrivare in tempo" (chiamate) è spiegata senza nominare TCP e UDP,
  che sono del quinto anno.
- Indirizzi inventati: `anna.rossi@scuola.example`, `luca.bianchi@esempio.it`.
- Nei titoli di sezione "Internet" non compare dopo la prima parola, perché `check.mts` segnala le maiuscole
  all'inglese: la sezione si chiama "Gli altri servizi della rete".

## Fonti e cose da verificare

- Nomi dei protocolli: SMTP, Simple Mail Transfer Protocol (RFC 5321, ottobre 2008); IMAP, Internet Message Access
  Protocol (RFC 9051, agosto 2021); POP3, Post Office Protocol version 3 (RFC 1939, maggio 1996). Citati a memoria:
  i numeri delle RFC sono da verificare, nella lezione non compaiono.
- "È nata prima del web": la posta tra computer in rete con la chiocciola è attribuita a Ray Tomlinson, 1971; la
  proposta del web di Tim Berners-Lee è del 1989. Nella lezione non ci sono date. Da verificare se si vogliono
  aggiungere.
- "Maiuscole e minuscole di solito non fanno differenza": il dominio non le distingue mai; per il nome utente la
  norma lascia la scelta al server, e i servizi diffusi non le distinguono. Da verificare.
- "POP3 di norma toglie i messaggi dal server": è il comportamento predefinito classico; molti client permettono di
  lasciarne copia.
- PEC: istituita dal DPR 11 febbraio 2005, n. 68; l'invio con ricevuta di consegna equivale alla raccomandata con
  ricevuta di ritorno. Da verificare, compreso il passaggio in corso al servizio europeo di recapito certificato
  (REM). La lezione dice solo "valore legale" e "uffici pubblici".
- "Un video di qualche minuto di solito non passa": il limite degli allegati dei servizi diffusi è di poche decine
  di megabyte (da verificare, cambia nel tempo); nella lezione non c'è il numero.
- La cartella dello spam "ogni tanto" contiene messaggi veri: esperienza comune, nessuna fonte.

## Figure

- `struttura-indirizzo-posta-elettronica`: l'indirizzo in tre riquadri con le etichette sotto.
- `viaggio-messaggio-posta-elettronica`: quattro riquadri e tre frecce numerate, con il protocollo su ogni freccia.

Guardate tutte e due in chiaro e in scuro con `anteprima.mjs`. Corretto: le virgolette di "presso" uscivano
entrambe chiuse, ora sono scritte alla maniera di TeX.

## Domande per Andrea

- La PEC resta, in una nota, o è fuori posto al secondo anno?
- POP3 va tenuto? Gli studenti non lo incontrano più, ma i libri lo mettono accanto a IMAP.
- FTP nella tabella dei servizi: va bene una riga, o si toglie?
- Servono i social network in questa lezione, o stanno meglio nel capitolo sulla cittadinanza digitale?
