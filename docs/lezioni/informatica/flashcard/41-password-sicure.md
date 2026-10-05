# Flashcard: Password e autenticazione

## identificazione-autenticazione
Che differenza c'è tra identificazione e autenticazione?
---
Con l'identificazione dichiari chi sei, con l'autenticazione lo dimostri.

## credenziali
Che cosa sono le credenziali?
---
Il nome utente e la password, insieme.

## tre-fattori
Quali sono i tre tipi di fattore di autenticazione?
---
Qualcosa che sai, qualcosa che hai, qualcosa che sei.

## fattore-impronta
L'impronta digitale è un fattore di che tipo?
---
Qualcosa che sei.

## forza-bruta
Che cos'è un attacco a forza bruta?
---
Un programma prova tutte le combinazioni possibili, una dopo l'altra.

## formula
Quante sono le password di lunghezza $n$ con $k$ caratteri possibili in ogni posizione?
---
$N = k^n$.

## pin
Quanti sono i PIN di $4$ cifre?
---
$10^4 = 10\,000$.

## pin-blocco
Perché un PIN di $4$ cifre protegge il telefono, anche se le combinazioni sono poche?
---
Perché il telefono si blocca dopo pochi tentativi sbagliati.

## un-carattere-in-piu
Aggiungi una lettera minuscola a una password di sole minuscole. Per quanto si moltiplicano le combinazioni?
---
Per $26$: ogni carattere in più moltiplica per $k$.

## lunghezza-varieta
Resiste di più una password a caso di $12$ minuscole o una di $8$ caratteri tra minuscole, maiuscole e cifre?
---
Quella di $12$ minuscole: $26^{12}$ è circa $400$ volte $62^8$.

## sostituzioni
Vero o falso: `P@ssw0rd!` è robusta perché ha maiuscole, cifre e simboli.
---
Falso. È prevedibile, e il conto delle combinazioni vale solo per le password scelte a caso.

## frase-accesso
Che cos'è una frase d'accesso?
---
Alcune parole comuni scelte a caso e scritte di seguito, usate come password.

## riuso
Perché non si usa la stessa password su più siti?
---
Se a un sito vengono rubati i dati, le stesse credenziali vengono provate sugli altri.

## gestore
Che cosa fa un gestore di password?
---
Genera password a caso, le conserva cifrate e le inserisce al posto tuo, protetto da una password principale.

## password-vecchia
Perché un sito serio non può rispedirti la password che hai dimenticato?
---
Perché non la conserva: tiene solo un'impronta da cui non si torna alla password.

## due-fattori
Che cos'è l'autenticazione a due fattori?
---
L'accesso con due prove di tipo diverso, di solito la password e un codice sul telefono.

## due-password
Una password e una domanda segreta sono due fattori?
---
No. Sono due cose che sai: i fattori devono essere di tipo diverso.

## codice-in-chat
Qualcuno, dicendosi dell'assistenza, ti chiede il codice appena arrivato sul telefono. Che cosa fai?
---
Non lo dai: nessun servizio lo chiede, e chi lo chiede sta cercando di entrare nel tuo account.

## posta-per-prima
Perché la posta va protetta prima degli altri account?
---
Perché il link "password dimenticata" degli altri servizi arriva lì.

## quando-cambiare
Quando conviene cambiare una password?
---
Quando c'è un motivo: un furto di dati, una pagina sospetta, un accesso che non riconosci.
