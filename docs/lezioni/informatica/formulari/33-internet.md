# Formulario: Internet, la rete delle reti

## Reti

- Rete di computer: un insieme di dispositivi collegati tra loro per scambiarsi dati.
- Collegamenti con il filo: cavi di rame (segnali elettrici), fibra ottica (impulsi di luce). Senza filo: onde radio (Wi-Fi, rete mobile).

| Rete | Quanto è estesa | Esempio |
|---|---|---|
| locale (LAN) | una casa, un ufficio, una scuola | la rete di casa |
| geografica (WAN) | una regione, uno Stato o più Stati | la rete di una compagnia telefonica |

## Internet

- Internet: la rete che si ottiene collegando tra loro le reti di tutto il mondo.
- Router: dispositivo che appartiene a più reti e passa i dati dall'una all'altra.
- Fornitore di accesso (provider, ISP): l'azienda la cui rete collega la tua al resto di Internet.
- Ogni rete ha un proprietario; Internet nel suo insieme non è di nessuno e non ha un centro.

## Pacchetti

- Pacchetto: un blocco piccolo dei dati da spedire, con l'indirizzo del destinatario, quello del mittente e un numero d'ordine.
- Ogni pacchetto viaggia per conto suo, di router in router; chi riceve rimette i pacchetti in ordine e fa rimandare quelli persi.
- Numero di pacchetti: dimensione dei dati divisa per quello che sta in un pacchetto ($3\,000\,000 : 1500 = 2000$).

| Vantaggio | Perché |
|---|---|
| un cavo serve molti insieme | i pacchetti di utenti diversi si alternano |
| un guasto non ferma tutto | i pacchetti passano da un'altra strada |
| un errore costa poco | si rimanda solo il pacchetto perso |

## Protocolli

- Protocollo: un insieme di regole che due dispositivi seguono per comunicare (come sono fatti i messaggi, chi parla per primo, che cosa fare se qualcosa va storto).
- IP: come è fatto un pacchetto e come si scrive l'indirizzo a cui consegnarlo.
- TCP: divide i dati in pacchetti, li rimette in ordine, fa rimandare quelli persi.
- I protocolli sono pubblici: dispositivi diversi comunicano perché seguono le stesse regole.

## Internet e i suoi servizi

- Internet trasporta i pacchetti; i servizi la usano: web, posta elettronica, messaggi, videochiamate, streaming, giochi in rete.
- 1969: ARPANET, quattro centri di ricerca. 1983: ARPANET adotta TCP/IP. Inizio degli anni Novanta: il web.

```ad-warning
Il Wi-Fi non è Internet
Il Wi-Fi collega il dispositivo al router; l'uscita verso le altre reti può mancare anche con il Wi-Fi al massimo.
```

```ad-warning
Internet non è il web
Il web è uno dei servizi di Internet, ed è nato una ventina d'anni dopo.
```
