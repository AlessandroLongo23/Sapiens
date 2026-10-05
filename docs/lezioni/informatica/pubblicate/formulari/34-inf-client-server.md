# Formulario: Il modello client-server

## I due ruoli

- Server: il programma che offre un servizio; aspetta le richieste, le esegue e manda indietro il risultato.
- Client: il programma che usa il servizio; manda la richiesta e aspetta la risposta (l'app del registro, il browser).
- Richiesta: il messaggio dal client al server. Risposta: il messaggio dal server al client.
- Le due parole indicano anche le macchine su cui girano i programmi.

## Uno scambio

1. Il client manda la richiesta.
2. Il server la riceve e la esegue: cerca i dati, fa i conti, controlla i permessi.
3. Il server manda la risposta.
4. Il client la mostra sullo schermo.

A cominciare è sempre il client; il server parla solo per rispondere.

## Client e server a confronto

| | Client | Server |
|---|---|---|
| Quanti sono | moltissimi | pochi, a volte uno solo |
| Quando è acceso | quando l'utente lo usa | sempre |
| Che cosa fa | manda richieste, mostra risposte, raccoglie ciò che l'utente scrive | conserva i dati, esegue le richieste, controlla i permessi |
| Chi comincia | lui | mai |

| Dati sul server: vantaggi | Dati sul server: prezzo |
|---|---|
| tutti i client vedono gli stessi dati aggiornati | se il server si ferma, il servizio si ferma per tutti |
| cambiando dispositivo ritrovi tutto | senza rete il client non riceve risposte |
| il server decide chi può vedere che cosa | i tuoi dati stanno sul computer di qualcun altro |

- Un server serve molti client insieme; con troppe richieste è sovraccarico e risponde lentamente o non risponde.
- Una stessa macchina può fare il server in uno scambio e il client in un altro.

## Un messaggio in una chat

1. Il client di chi scrive manda il messaggio al server.
2. Il client di chi riceve chiede al server se ci sono messaggi.
3. Il server risponde con il messaggio.

Tra il passo 1 e il passo 2 il messaggio resta sul server.

## Peer-to-peer

| | Client-server | Peer-to-peer (P2P) |
|---|---|---|
| Ruoli | uno offre, gli altri chiedono | ogni computer chiede e offre |
| Centro | il server | nessuno |
| Se una macchina si ferma | se è il server, si ferma tutto | la rete continua |
| Chi garantisce i dati | il server | nessuno |

```ad-warning
Il client è un programma
La persona è l'utente; il client è l'app o il browser che manda le richieste al suo posto.
```

```ad-warning
Due client non si parlano direttamente
Un messaggio passa dal server anche se chi lo riceve è seduto accanto a te.
```
