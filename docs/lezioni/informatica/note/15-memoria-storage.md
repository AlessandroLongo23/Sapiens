# Note: Memoria centrale e memorie di massa

Lezione nuova (3 ottobre 2026). Lo slug `memoria-storage` esisteva vuoto nel capitolo sui sistemi operativi ed è stato
spostato in questo capitolo dall'albero del 26 settembre.

## Struttura ed esempi

Celle e indirizzi, con la figura e il procedimento in tre passi per i conti; RAM e ROM con la tabella di confronto; le
memorie di massa (disco magnetico e stato solido); la cache; la gerarchia delle memorie con la figura e la tabella.

Sei esempi svolti:

1. $4096$ celle da $1$ byte: ultimo indirizzo $4095$, capacità $4\,\text{KiB}$;
2. indirizzi da $0$ a $65\,535$: $65\,536$ celle, $64\,\text{KiB}$;
3. chiavetta da $32\,\text{GB}$ e video da $250\,\text{MB}$: $128$ video;
4. che cosa si perde quando va via la corrente (tema non salvato, foglio salvato);
5. tre memorie in ordine di velocità e di capacità;
6. una RAM da $8\,\text{GiB}$: $8\,589\,934\,592$ celle, cioè $2^{33}$ (il caso scomodo, con i numeri grandi).

Avvisi: l'ultimo indirizzo è uno in meno del numero di celle; la "memoria" del telefono non è la RAM.

## Conti

Rifatti in Python (`/tmp/informatica-cap4/conti.py`): $4096 : 1024 = 4$; $65\,536 : 1024 = 64$; $32\,000 : 250 = 128$;
$8 \cdot 1024 = 8192$, $8192 \cdot 1024 = 8\,388\,608$, $8\,388\,608 \cdot 1024 = 8\,589\,934\,592 = 2^{33}$.

## Scelte

- Celle da $1$ byte in tutta la lezione e negli esercizi: è il caso dei computer in uso, e tiene semplici i conti.
- Unità come nel README: KiB, MiB, GiB con fattore 1024 per la memoria centrale; kB, MB, GB con fattore 1000 per le
  memorie di massa e i file. In ogni esempio e in ogni esercizio il fattore è scritto.
- La ROM è presentata come parte della memoria centrale, con una nota sul fatto che oggi si può riscrivere. Non nomino
  EPROM, EEPROM, flash, BIOS, UEFI, firmware: "il programma di avvio" basta, e la lezione 19 riprende il discorso.
- Memorie di massa: disco magnetico e memoria a stato solido. Dischi ottici e nastri non ci sono. "SSD" è sciolto come
  Solid State Drive; la memoria dei telefoni e le chiavette sono dette "a stato solido", senza la parola flash.
- La gerarchia ha cinque livelli: registri, cache, RAM, SSD, disco magnetico. Per la capacità la lezione e gli esercizi
  non confrontano SSD e disco magnetico tra loro, perché in commercio esistono SSD più capienti di molti dischi.
- La memoria virtuale non c'è: è della lezione 21 (La gestione della memoria).
- La cache è spiegata con l'esempio dei libri sul banco e nello zaino. I livelli della cache (L1, L2, L3) non ci sono.

## Fatti da verificare

- "Il disco magnetico costa poco per ogni byte", "la memoria a stato solido costa di più per ogni byte": vero nel 2026
  per i prodotti in commercio, da verificare sui listini quando la lezione invecchia. Nessun prezzo nel testo.
- "La CPU esegue un'istruzione in molto meno tempo di quanto la RAM impieghi a consegnarle un dato": ordini di
  grandezza che ricordo (meno di un nanosecondo contro decine di nanosecondi), da verificare; nel testo non ci sono
  numeri.
- "Una memoria da $128\,\text{GB}$" per un telefono: è un esempio per riconoscere di che cosa si parla (2026), non un
  dato tipico da imparare.
- Le confezioni delle RAM scrivono GB intendendo GiB: la lezione 03 lo dice; qui la RAM dell'esempio 6 è in GiB.

## Figure

- `memoria-celle-indirizzi` (TikZ): una fila di celle con l'indirizzo sopra e un byte dentro, da $0$ a $1023$.
- `gerarchia-delle-memorie` (TikZ): cinque fasce sempre più larghe, con le due frecce ai lati. Copiata nel formulario.

Guardate in chiaro e in scuro.

## Per il generatore

`memoria-storage`, cinque livelli (specifica in `specs/exercises/memoria-storage.md`): quale memoria per quale uso e
che cosa si perde senza corrente (scelta multipla); celle e indirizzi e capacità con i multipli (conto, risposta
numerica); la gerarchia delle memorie (scelta multipla).

## Domande per Andrea

- La ROM dentro la memoria centrale: va bene, o la si preferisce a parte?
- Servono i dischi ottici e i nastri, che alcuni libri elencano ancora?
- Celle da $1$ byte sempre: va bene, o serve un esempio con celle (parole) più grandi?
- Nella gerarchia SSD e disco magnetico sono due livelli distinti per velocità e costo: va bene, o un solo livello
  "memorie di massa"?
- L'esempio 6 ($2^{33}$ celle) usa le potenze di due: è al posto giusto, o va lasciato alla lezione sui bus, dove si
  parla di $2^n$ celle?
