# Elettroni di valenza e simboli di Lewis

Generatore: `chim-simboli-lewis` (`src/lib/exercises/v2/generators/chim-simboli-lewis.ts`, con
`src/lib/exercises/v2/chim3-b.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_simboli_lewis.py` (con
`_chim3_b.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/58-chim-simboli-lewis.md`. Percorso nel database:
`high_school/chemistry/tavola-periodica/chim-simboli-lewis`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutti hanno la forma a scelta multipla con
quattro opzioni; nei livelli 1, 2 e 3 la risposta è un numero intero e il livello può andare a risposta aperta. Solo
elementi dei gruppi principali.

## Nomi dei livelli

1. Elettroni di valenza dalla configurazione
2. Con un sottolivello d pieno
3. Elettroni di valenza dal gruppo
4. I puntini del simbolo di Lewis
5. Lo ione di un elemento
6. Lo ione e il suo gas nobile

## Livello 1: elettroni di valenza dalla configurazione

Si dà la configurazione abbreviata di un elemento dei gruppi principali del secondo o del terzo periodo. Risposta: gli
elettroni dei sottolivelli con $n$ più grande, un numero.

- Zolfo, $[\text{Ne}]\,3s^2\,3p^4$ → $6$.
- Magnesio, $[\text{Ne}]\,3s^2$ → $2$.

Distrattori: gli elettroni del solo ultimo sottolivello ($4$ per lo zolfo); tutti gli elettroni dell'atomo; gli
elettroni del gas nobile tra parentesi; quelli che mancano per arrivare a otto.

## Livello 2: con un sottolivello d pieno

Elementi dei gruppi da $13$ a $18$ del quarto e del quinto periodo, la cui configurazione ha un $d^{10}$ tra l'$s$ e
il $p$.

- Bromo, $[\text{Ar}]\,4s^2\,3d^{10}\,4p^5$ → $7$.
- Stagno, $[\text{Kr}]\,5s^2\,4d^{10}\,5p^2$ → $4$.

Distrattori: tutto quello che segue il gas nobile ($17$ per il bromo); il solo $p$; il $d$ più il $p$; il solo $d$
($10$).

## Livello 3: elettroni di valenza dal gruppo

Si dà il gruppo di un elemento dei gruppi principali, periodi da $2$ a $6$ (senza polonio e astato). Nei gruppi $1$ e
$2$ la risposta è il numero del gruppo, nei gruppi da $13$ a $18$ il numero del gruppo meno $10$.

- Iodio, gruppo $17$ → $7$.
- Calcio, gruppo $2$ → $2$.

Distrattori: il numero del gruppo così com'è ($17$); il gruppo meno $12$; il numero del periodo; quelli che mancano
a otto.

## Livello 4: i puntini del simbolo di Lewis

Si dà il gruppo di un elemento dei gruppi principali, periodi da $2$ a $4$, e si chiede quante coppie e quanti puntini
singoli ha il suo simbolo di Lewis. Regola della lezione: i primi quattro puntini uno per lato, dal quinto le coppie.
Opzioni in parole: "1 coppia e 3 puntini singoli", "nessuna coppia e 4 puntini singoli", "4 coppie e nessun puntino
singolo".

- Fosforo, gruppo $15$ → 1 coppia e 3 puntini singoli.
- Carbonio, gruppo $14$ → nessuna coppia e 4 puntini singoli.

Distrattori: i puntini appaiati appena possibile (2 coppie per il carbonio); la coppia dell'$s$ per prima, come nel
diagramma a caselle (1 coppia e 2 singoli per il carbonio); un puntino in più o in meno; coppie e singoli scambiati.

## Livello 5: lo ione di un elemento

Elementi che formano un solo ione semplice: litio, sodio, potassio, rubidio, cesio; magnesio, calcio, stronzio, bario;
alluminio; azoto, fosforo; ossigeno, zolfo, selenio; fluoro, cloro, bromo, iodio. Si dà il gruppo e si chiede quale
ione l'elemento forma per avere la configurazione di un gas nobile.
Cationi tra il 42% e il 63% dei campioni.

- Magnesio, gruppo $2$ → $\mathrm{Mg^{2+}}$.
- Zolfo, gruppo $16$ → $\mathrm{S^{2-}}$.

Distrattori: il segno al contrario ($\mathrm{S^{2+}}$); gli elettroni di valenza come carica positiva di un non
metallo ($\mathrm{Cl^{7+}}$) o quelli che mancano a otto come carica di un metallo ($\mathrm{Mg^{6-}}$); la carica
sbagliata di uno.

## Livello 6: lo ione e il suo gas nobile

Gli stessi elementi del livello 5. Si dà lo ione e si chiede quale gas nobile ha la stessa configurazione: per un
catione quello che precede l'elemento, per un anione quello che chiude il suo periodo. Opzioni: i nomi dei gas nobili
con l'articolo ("Il neon", "L'argon", "Il kripton").

- $\mathrm{Ca^{2+}}$ → L'argon.
- $\mathrm{Cl^-}$ → L'argon.

Distrattori: il gas nobile dall'altra parte dell'elemento (il kripton per $\mathrm{Ca^{2+}}$, il neon per
$\mathrm{Cl^-}$), poi quelli vicini.

## Da evitare

- Metalli di transizione, e i metalli pesanti del blocco $p$ che formano più di uno ione (stagno, piombo, tallio,
  bismuto): compaiono solo nel livello 3, dove si chiedono gli elettroni di valenza.
- Carbonio, silicio, boro e i gas nobili nei livelli 5 e 6: di solito non formano ioni semplici.
- Berillio nei livelli 5 e 6: i suoi composti sono in gran parte covalenti.
- L'elio nei livelli 3 e 4, dove la regola del gruppo non vale.
