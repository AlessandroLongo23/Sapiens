# Formulario: Computer, dispositivi mobili e sistemi embedded

## Che cosa resta uguale, che cosa cambia

- Uguale in tutti: CPU, memoria centrale, periferiche, bus, e un programma memorizzato eseguito un'istruzione dopo l'altra.
- Cambia: potenza di calcolo e memoria; dimensioni, consumo e costo; periferiche; chi lo usa; che cosa può eseguire.
- Uso generale: esegue qualsiasi programma gli si installi. Dedicato: esegue sempre lo stesso programma, per un compito solo.

## Le famiglie di computer

| | Chi lo usa | Quali programmi esegue | Periferiche tipiche |
|---|---|---|---|
| supercomputer | molti gruppi di ricerca, a turno | i calcoli dei ricercatori | si usa attraverso la rete |
| server | molte persone, attraverso la rete | quelli del servizio che offre | scheda di rete, memorie di massa |
| personal computer | una persona | quelli che installi | tastiera, mouse, monitor |
| dispositivo mobile | una persona | quelli che installi | schermo tattile, sensori |
| sistema embedded | nessuno direttamente | uno solo, messo in fabbrica | sensori e attuatori |

- Supercomputer: migliaia di processori che lavorano insieme a un solo calcolo enorme (previsioni del tempo, clima).
- Server: offre un servizio ad altri computer attraverso la rete; sempre acceso, di solito senza tastiera né schermo.
- Personal computer: fisso o portatile.
- Dispositivi mobili: smartphone, tablet, smartwatch; a batteria, con CPU che consumano poco.
- Sistema embedded: un computer chiuso dentro un altro oggetto, dedicato a farlo funzionare; è il tipo più numeroso.

## Dentro un sistema embedded

- Microcontrollore: CPU, memoria centrale, memoria non volatile con il programma e interfacce in un solo chip.
- Sensori: periferiche di ingresso; misurano una grandezza e la trasformano in un dato.
- Attuatori: periferiche di uscita; trasformano un dato in un'azione (motore, valvola, resistenza, spia).
- Il programma ripete: leggi i sensori, decidi, comanda gli attuatori.

| Oggetto | Ingresso | Uscita |
|---|---|---|
| termostato | sensore di temperatura, tasti | interruttore della caldaia, schermo |
| lavatrice | sensore di temperatura, manopola | motore del cestello, resistenza |

```ad-warning
Lo smartphone è un computer
È di uso generale come un portatile: non è un sistema embedded, anche se è piccolo.
```

```ad-warning
Server è un ruolo, non una taglia
È un computer che offre un servizio ad altri: può farlo anche un vecchio portatile.
```

```ad-warning
Senza tastiera e senza schermo le periferiche ci sono lo stesso
In un sistema embedded le periferiche sono i sensori e gli attuatori.
```
