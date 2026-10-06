# Note: Livelli e sottolivelli di energia

Lezione nuova (terzo anno di chimica, gruppo A, 6 ottobre 2026). Non pubblicata. Rapporti e differenze degli esempi
rifatti in Python (`ie.py` nello scratchpad del gruppo). `check.mts` passa senza errori e senza avvisi.

## Struttura

L'energia di ionizzazione e le energie successive; le undici energie del sodio, con la tabella dei rapporti e il
grafico su scala logaritmica; i tre gruppi e i livelli; due esempi (alluminio, magnesio) e la figura interattiva; la
capienza $2n^2$; i sottolivelli, a partire dal gradino dentro il secondo livello del sodio, con le due regole e la
tabella; l'ordine di energia, con la figura, la sequenza completa e la seconda figura interattiva; due esempi
(potassio, mettere in ordine) e una nota sull'ordine tra $4s$ e $3d$.

## Scelte

- Confine con la 59 (gruppo D): là l'energia di prima ionizzazione e gli andamenti, e le energie successive per
  trovare gli elettroni di valenza; qui la serie intera di un elemento come prova dei livelli. La 59 è già scritta e
  usa gli stessi numeri per sodio, magnesio e alluminio, e rimanda a questa lezione. Qui la definizione è breve, con il
  link alla 59 per gli andamenti. Il simbolo $E_i$ della 59 non mi serve: scrivo sempre "prima, seconda... ionizzazione".
- Confine con la 52: il perché di $2n^2$ è là, con il link. Qui la capienza è un fatto letto dalle energie.
- Confine con la 53: niente configurazioni scritte $1s^2\,2s^2$. Gli elettroni sono contati per livello ($2$, $8$, $1$).
  L'esempio del potassio usa l'ordine di energia per spiegare perché il diciannovesimo elettrone va nel quarto livello.
- I sottolivelli sono presentati da due indizi: il gradino più piccolo dentro un livello (nel sodio, tra la settima e
  l'ottava ionizzazione: $5379$ contro $3504$ e $3436\,\text{kJ/mol}$ dei passi accanto) e gli spettri degli atomi con
  più elettroni. Il primo indizio è debole, e il testo dice "molto più piccolo dei salti tra un livello e l'altro".
- L'ordine di energia è presentato come sequenza da ricordare; la regola della diagonale è nella 53.
- Nota sull'ordine tra $4s$ e $3d$: la sequenza vale per il riempimento degli atomi neutri, e negli ioni dei metalli
  di transizione l'ordine si inverte. Senza questa nota la frase "il $4s$ ha energia più bassa del $3d$" sarebbe vera
  solo in parte.
- I numeri da $10\,000$ in su hanno lo spazio delle migliaia, come nella 59.

## Dati

Le energie di ionizzazione successive non sono in `src/lib/tools/elementi.json`, che ha solo la prima. Le ho scritte a
memoria dalla tabella "Molar ionization energies of the elements" (valori del CRC Handbook e del NIST) per i primi
venti elementi, e stanno in `IONIZATION` di `src/lib/exercises/v2/chim3-a.ts`, da cui le prendono la figura interattiva
e gli esercizi. Controlli fatti: la prima di ogni elemento coincide con `elementi.json` entro $1\,\text{kJ/mol}$;
l'ultima coincide con $Z^2 \cdot 1312\,\text{kJ/mol}$ entro l'$1\%$; ogni serie è crescente; i rapporti più grandi cadono
dove cambia il livello per tutti e venti gli elementi. Restano da verificare su una fonte, valore per valore.

Due differenze con `elementi.json`: alluminio $577{,}5$ nella mia fonte e $577{,}6$ nel file (in tutti e due i casi
$578$); nessun'altra.

## Figure

Due TikZ, guardate in chiaro e in scuro: `livelli-ionizzazioni-sodio`, `livelli-sottolivelli-ordine-energia`.

Due interattive:

| Nome | File | Che cosa fa |
|---|---|---|
| `livelli-ionizzazioni-successive` | `LivelliIonizzazioni.tsx` | un cursore sceglie l'elemento da H a Ca, un altro la ionizzazione da leggere; colonne su scala logaritmica raggruppate per livello; si leggono il valore, il rapporto con la precedente e gli elettroni per livello |
| `livelli-sottolivelli-idrogeno-altri` | `LivelliSottolivelliOrdine.tsx` | un selettore passa dall'idrogeno a un atomo con più elettroni: i sottolivelli di ogni livello si separano e il $4s$ scende sotto il $3d$ |

Nella prima le colonne di uno stesso livello hanno la stessa tinta, ma il livello è scritto anche sotto, con una
parentesi: il colore da solo non porta informazione. Nella seconda le altezze sono schematiche, conta l'ordine.

## Da verificare

- Le energie di ionizzazione successive (vedi "Dati").
- "Le lettere $s$, $p$, $d$, $f$ vengono dai nomi che gli spettroscopisti davano alle serie di righe" (sharp,
  principal, diffuse, fundamental).

## Dubbi per Andrea

- I sottolivelli introdotti dal gradino nelle energie di ionizzazione e dagli spettri: va bene, o in classe si danno
  come regola e basta?
- L'ordine di energia come sequenza scritta, qui, e la regola della diagonale nella lezione successiva: la divisione
  regge?
- La nota sull'inversione tra $4s$ e $3d$ negli ioni: tenerla o toglierla?
- La scala logaritmica del grafico ("ogni tacca vale dieci volte la precedente") è leggibile per chi non ha ancora
  fatto i logaritmi?

## Esercizio guidato

L'esempio 1 (gli elettroni dell'alluminio). Punti in cui fermarsi: i rapporti tra ogni energia e la precedente; quale
rapporto è il salto, e perché non il primo; la disposizione degli elettroni nei livelli.

## Esercizi

Generatore `chim-livelli-energia`, cinque livelli (specifica in `specs/exercises/chim-livelli-energia.md`); i livelli 1
e 3 hanno per risposta un numero intero e possono andare a risposta aperta. Controllo indipendente
`scripts/exercises/checkers/chim_livelli_energia.py`, che ricostruisce l'ordine dei sottolivelli con la regola di
$n + l$ e trova il salto come rapporto più grande. Il livello 3 si sovrappone in parte al livello 5 del generatore
`chim-orbitali-numeri-quantici` (capienza di livelli e sottolivelli).

Prerequisiti proposti: chim-modello-bohr, numero-massa
