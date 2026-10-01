---
stato: decisa
aggiornato: 2026-10-01
tag: [decisione, strumenti, chimica]
---
# La prima tavola periodica è ampia come Ptable e si fa subito

## Decisione
La prima versione della tavola periodica ha, oltre alla griglia e alla scheda dell'elemento con i colori per famiglia e al PDF da stampare, le viste che ha Ptable: andamenti periodici colorati (raggio atomico, elettronegatività, energia di ionizzazione), cursore della temperatura per lo stato fisico, blocchi s, p, d, f, isotopi. Si fa subito, in una sessione, senza aspettare il dominio né il terzo anno di chimica.

## Perché
Claude aveva consigliato una versione più stretta (griglia, scheda, colori per famiglia e stampa), perché le viste chiedono più dati da trovare e da verificare. Alessandro ha scelto la versione ampia. Il motivo non è stato detto in questa sessione; nell'idea del 28 settembre aveva scritto che la vuole "fatta bene" e che una buona è difficile da trovare. Una versione con sola griglia e scheda sarebbe meno di quello che offrono già Zanichelli e Ptable.

Sul quando: la chimica del biennio è online dal 30 settembre e la lezione 43 sulla tavola di Mendeleev la userebbe da subito; il traffico dalle ricerche arriva solo dopo il dominio, ma la pagina deve esistere quando si invia la sitemap.

Alternative scartate:
- Base più stampa (il consiglio di Claude).
- Solo la griglia con la scheda.
- Farla con il terzo anno di chimica, dove stanno configurazione elettronica e tavola periodica.
- Farla dopo il dominio, per misurarla da subito.

## Conseguenze
- Servono dati che oggi non ci sono: configurazione elettronica, elettronegatività, numeri di ossidazione, raggio atomico, energia di ionizzazione, punti di fusione e di ebollizione, isotopi. Nel codice ci sono solo nomi, simboli e masse (`src/lib/tools/chimica.ts`). Fonte e licenza sono da scegliere prima di scrivere: vedi le domande aperte di [[Tavola periodica interattiva]].
- La griglia sul telefono è da progettare: 18 colonne in 390 px.
- Non entra nella [[Release Beta]] e non la blocca. È il punto 14 dell'[[Agenda]].

## Collegamenti
- [[Tavola periodica interattiva]], [[Agenda]]
- [[2026-10-01 La tavola periodica sta tra gli strumenti, con una pagina sua]], [[2026-10-01 La tavola periodica non ha pagine per elemento, per ora]]
- [[2026-09-26 La chimica si pubblica gratis accanto alla beta]]
