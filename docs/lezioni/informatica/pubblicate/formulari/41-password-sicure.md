# Formulario: Password e autenticazione

## Le parole

- Identificazione: dichiari chi sei (nome utente). Autenticazione: lo dimostri.
- Credenziali: nome utente e password insieme.
- Fattori di autenticazione: qualcosa che sai (password, PIN), qualcosa che hai (telefono, chiavetta di sicurezza), qualcosa che sei (impronta, volto).

## Come si perde una password e che cosa la protegge

| Come succede | Che cosa la ferma |
|---|---|
| vengono provate le password comuni e prevedibili | una password che non si può prevedere |
| forza bruta: vengono provate tutte le combinazioni | una password lunga |
| furto di dati su un sito, credenziali provate altrove | una password diversa per ogni account |
| la consegni tu, o la legge un malware | l'attenzione e un secondo fattore |

## Quante sono le password possibili

Con $k$ caratteri possibili in ogni posizione e lunghezza $n$:

$$N = k^n$$

| Password scelta a caso | $k$ | $n$ | Combinazioni | Tempo a $10^9$ tentativi al secondo |
|---|---|---|---|---|
| PIN di 4 cifre | $10$ | $4$ | $10^4 = 10\,000$ | un istante |
| 8 minuscole | $26$ | $8$ | circa $2{,}1 \cdot 10^{11}$ | circa $3$ minuti e mezzo |
| 8 tra minuscole, maiuscole e cifre | $62$ | $8$ | circa $2{,}2 \cdot 10^{14}$ | circa $2$ giorni e mezzo |
| 12 minuscole | $26$ | $12$ | circa $9{,}5 \cdot 10^{16}$ | circa $3$ anni |

- Ogni carattere in più moltiplica le combinazioni per $k$: la lunghezza è l'esponente, la varietà è la base.
- Frase d'accesso: $5$ parole a caso da un elenco di $2000$ danno $2000^5 = 3{,}2 \cdot 10^{16}$ frasi.

## Gestore di password e due fattori

- Gestore di password: genera password a caso, le conserva cifrate e le inserisce al posto tuo, protetto da una password principale.
- Autenticazione a due fattori (2FA): due prove di tipo diverso, di solito la password e un codice che vale una volta sola (OTP).

## Le abitudini

1. La posta per prima: password più lunga e due fattori.
2. Schermo del telefono bloccato con un codice.
3. Sui computer condivisi: uscire dall'account, non salvare la password.
4. Non condividere le password.
5. Cambiarle quando c'è un motivo, non a scadenza.
6. Domande di recupero: risposte che non si leggono sul tuo profilo.

```ad-warning
Il conto vale solo per le password scelte a caso
`P@ssw0rd!` ha tutti i tipi di carattere ed è tra le prime provate.
```

```ad-warning
Due password non sono due fattori
I fattori devono essere di tipo diverso: una cosa che sai e una che hai.
```

```ad-warning
Il codice non si detta a nessuno
Nessun servizio lo chiede al telefono o in chat.
```
