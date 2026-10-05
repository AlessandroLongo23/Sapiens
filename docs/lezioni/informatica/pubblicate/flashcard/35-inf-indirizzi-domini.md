# Flashcard: Indirizzi IP e nomi di dominio

## indirizzo-ip
Che cos'è un indirizzo IP?
---
Un numero che identifica un dispositivo collegato a Internet.

## due-indirizzi
Quali indirizzi IP porta ogni pacchetto?
---
Due: quello del destinatario e quello del mittente.

## ipv4-bit
Di quanti bit è fatto un indirizzo IPv4?
---
32 bit, cioè quattro byte.

## ipv4-scrittura
Come si scrive un indirizzo IPv4?
---
Con quattro numeri in base dieci, da 0 a 255, separati da punti: `192.0.2.45`.

## ipv4-massimo
Perché ogni numero di un indirizzo IPv4 non supera 255?
---
Perché occupa 8 bit, e con 8 bit i valori sono $2^8 = 256$, da 0 a 255.

## ipv4-valido-256
`198.51.100.256` è un indirizzo IPv4?
---
No: l'ultimo numero supera 255.

## ipv4-valido-tre
`192.0.2` è un indirizzo IPv4?
---
No: i numeri devono essere quattro, e qui sono tre.

## ipv4-quanti
Quanti sono gli indirizzi IPv4 diversi, scritti come potenza di due?
---
$2^{32}$, poco più di quattro miliardi.

## ipv6-perche
Perché è stato introdotto IPv6?
---
Perché gli indirizzi IPv4 non bastano per tutti i dispositivi collegati.

## ipv6-riconoscere
`2001:db8::1` è un indirizzo IPv4 o IPv6?
---
IPv6: è scritto in esadecimale, con i gruppi separati da due punti.

## ipv6-bit
Di quanti bit è fatto un indirizzo IPv6?
---
128 bit.

## dinamico-statico
Che differenza c'è tra un indirizzo dinamico e uno statico?
---
Quello dinamico può cambiare da un collegamento all'altro; quello statico non cambia, e serve ai server.

## nome-di-dominio
Che cos'è un nome di dominio?
---
Un nome fatto di parole separate da punti, che sta al posto dell'indirizzo IP di un server.

## verso-di-lettura
In che verso si leggono le parti di un nome di dominio?
---
Da destra verso sinistra, dalla più generale alla più particolare.

## primo-livello
Qual è il dominio di primo livello di `www.esempio.it`?
---
`it`, l'ultima parte.

## secondo-livello
In `posta.esempio.it`, qual è il nome che il proprietario ha registrato?
---
`esempio`, il dominio di secondo livello. La parte `posta` l'ha aggiunta lui.

## tld-nazionale
`.fr` è un dominio di primo livello nazionale o generico?
---
Nazionale: ha due lettere e indica uno Stato, la Francia.

## proprietario-a-destra
Di chi è il sito `www.esempio.it.accesso-clienti.example`?
---
Di chi ha registrato `accesso-clienti.example`: il proprietario si legge dalla fine del nome.

## dns
Che cosa fa il DNS?
---
Traduce i nomi di dominio in indirizzi IP.

## dns-server-nuovo
Un sito viene spostato su un server con un altro indirizzo IP. Che cosa cambia per chi lo visita scrivendo il nome?
---
Niente: si aggiorna la voce del DNS, e il nome resta lo stesso.
