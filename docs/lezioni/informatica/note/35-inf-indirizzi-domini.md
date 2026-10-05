# Note: Indirizzi IP e nomi di dominio

Lezione nuova, scritta da zero (lotto del secondo anno, capitolo "Internet e il web", 5 ottobre 2026). `check.mts` passa senza errori e senza avvisi su lezione, formulario e flashcard. 179 righe, 3 figure, 4 esempi: è al limite delle 180.

## Struttura

L'indirizzo IP e la scrittura di IPv4, con la regola per riconoscere un indirizzo scritto bene; IPv6 e il confronto in tabella; chi assegna l'indirizzo (dinamico e statico); i nomi di dominio e i loro livelli; il DNS in quattro passi.

Avvisi: il massimo è 255, non 256; chi è il proprietario si legge a destra; il DNS non è un motore di ricerca. Due note: gli indirizzi che cominciano con `192.168`; i domini come `.edu.it`.

## Scelte

- Indirizzi degli esempi negli intervalli riservati alla documentazione: `192.0.2.x`, `198.51.100.x`, `203.0.113.x` (RFC 5737) e `2001:db8::/32` per IPv6 (RFC 3849). Domini `esempio.it` e `.example` (RFC 2606); il testo dice una volta che `.example` è riservato agli esempi.
- "Un indirizzo IP identifica un dispositivo": a rigore identifica un'interfaccia di rete, e dietro un router di casa molti dispositivi condividono un indirizzo pubblico. La nota su `192.168` lo accenna senza nominare il NAT, che è del quinto anno ("Indirizzi IP, subnet mask e NAT").
- Niente classi di indirizzi, subnet mask, parte di rete e parte di host.
- IPv6: la scrittura completa, le due abbreviazioni in una frase, il numero di indirizzi. Niente altro.
- Livelli del nome: "dominio di primo livello (TLD)", "dominio di secondo livello", "terzo livello". La regola "il proprietario si riconosce dalle ultime due parti" ha l'eccezione dei domini come `.edu.it` e `.co.uk`: c'è una nota, con il solo esempio delle scuole italiane.
- Il DNS è spiegato come rubrica, con un solo server che risponde. Una frase dice che il server, se non sa, chiede ad altri server divisi per livelli; server radice, server autorevoli e tipi di record sono della lezione "Il sistema dei nomi di dominio" del quinto anno.
- La memoria delle risposte (cache) è descritta senza la parola "cache".
- Tre link in avanti nel capitolo e fuori: alla 33 per il pacchetto, alla 34 per il server, alla lezione sul phishing (42) per il trucco del nome.

## Conti

Rifatti con Python: 192 = 11000000, 0, 2 = 00000010, 45 = 00101101 (i quattro byte della figura); 2^32 = 4 294 967 296; 2^128 ≈ 3,4 · 10^38. `2001:0db8:0000:0000:0000:0000:0000:0001` abbreviato è `2001:db8::1`.

## Fonti e cose da verificare

Scritti a memoria, non ricontrollati in rete in questa sessione.

- "Gli indirizzi IPv4 liberi sono finiti": la riserva centrale della IANA si è esaurita il 3 febbraio 2011; il registro europeo RIPE NCC ha assegnato l'ultimo blocco il 25 novembre 2019. Da verificare sui comunicati di IANA e RIPE NCC. Nel testo non ci sono date.
- "I siti delle scuole italiane finiscono in `.edu.it`": passaggio da `.gov.it` a `.edu.it` deciso nel 2018 (nota del MIUR e Registro .it). Da verificare, anche per le scuole paritarie.
- I domini generici "in origine" indicavano il tipo di attività (`.com` aziende, `.org` organizzazioni, `.net` servizi di rete): oggi chiunque li può registrare. Il testo dice "in origine".
- La registrazione con quota annuale: per `.it` il registro è il Registro .it (Istituto di Informatica e Telematica del CNR, Pisa) e si registra attraverso società accreditate. Il testo non fa nomi.
- "Maiuscole e minuscole non contano" nei nomi di dominio: vero (RFC 4343).
- Il server DNS "di solito del tuo fornitore di accesso": è l'impostazione predefinita più comune; molti usano server DNS pubblici di altre società. Da decidere se dirlo.
- Esempio 4 (il DNS non risponde): la situazione è realistica, ma lo studente non la riconosce da solo sul telefono. Serve a ragionare sulla differenza tra collegamento e traduzione.

## Figure

- `indirizzo-ipv4-quattro-byte`: le quattro caselle con il binario sotto e le due graffe (8 bit, 32 bit). Le graffe sono tre segmenti, senza la libreria delle decorazioni.
- `livelli-nome-di-dominio`: `www`, `esempio`, `it` con i tre livelli e la freccia da destra a sinistra.
- `dns-dal-nome-all-indirizzo`: il client a sinistra, il server DNS e il server web a destra, quattro frecce numerate come i passi sotto la figura.

Guardate in chiaro e in scuro. Corretto dopo la prima anteprima: nella seconda figura due scritte sotto le caselle si toccavano.

## Domande per Andrea

- IPv6 con le abbreviazioni resta, o basta dire che esiste e quanti bit ha?
- La nota su `.edu.it` serve o confonde?
- Indirizzi dinamici e statici: restano qui o vanno al quinto anno con il NAT?
- La lezione è lunga (179 righe): se va accorciata, toglierei l'esempio 4.
