# Dal sistema tolemaico al sistema copernicano

Generatore: `fis-sistemi-cosmologici` (`src/lib/exercises/v2/generators/fis-sistemi-cosmologici.ts`, con
`src/lib/exercises/v2/fis-keplero-newton.ts`, `fisica-equilibrio.ts` e `vettori.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_sistemi_cosmologici.py` (con `_fis_keplero_newton.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/92-fis-sistemi-cosmologici.md`. Percorso nel database:
`high_school/physics/fis-gravitazione/fis-sistemi-cosmologici`.

La lezione è storica: i livelli non chiedono date o nomi, ma i tre ragionamenti con un conto che la lezione svolge
(esempi 1, 2 e 3), su casi generati. Cinque livelli, nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Avanti o indietro sull'epiciclo
2. Le velocità da raggi e periodi
3. La distanza dall'elongazione
4. Il periodo di un pianeta esterno
5. Il periodo di un pianeta interno

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni con l'unità. Livello 1: velocità intere in km/s con il verso in parole
("$13\,\text{km/s}$ in avanti", "$17\,\text{km/s}$ indietro"). Livello 2: un numero puro con due cifre significative.
Livello 3: unità astronomiche, due cifre. Livelli 4 e 5: giorni, tre cifre, mai in notazione scientifica (i risultati
che finirebbero con uno zero, come $690$, sono scartati). Nessun risultato a meno di $10^{-6}$ da un confine di
arrotondamento.

## Regole comuni

- Formule della lezione: nel punto dell'epiciclo più vicino alla Terra le velocità $v_d$ (centro sul deferente) e $v_e$
  (pianeta sull'epiciclo) sono opposte; $v_d = 2\pi R/T_d$ e $v_e = 2\pi r/T_e$, quindi
  $v_e/v_d = (r/R)(T_d/T_e)$; $r = 1\,\text{UA} \cdot \sin\theta$ per un pianeta interno con elongazione massima
  $\theta$; $1/T = 1/T_T - 1/S$ per un pianeta esterno e $1/T = 1/T_T + 1/S$ per uno interno, con
  $T_T = 365{,}25\,\text{d}$.
- I pianeti non hanno nome: sono "un pianeta", per non far ricordare a memoria i dati di quelli veri.

## Livello 1: avanti o indietro sull'epiciclo

Le due velocità sono date, intere tra $11$ e $49\,\text{km/s}$, diverse di almeno $2$; né la differenza né la somma
finiscono con uno zero. Metà dei casi con il pianeta che avanza, metà con il pianeta che torna indietro.

- "In un modello tolemaico il centro dell'epiciclo avanza sul deferente a $34\,\text{km/s}$, e il pianeta percorre
  l'epiciclo a $21\,\text{km/s}$, nello stesso verso di rotazione. Visto dalla Terra, come si muove il pianeta nel punto
  dell'epiciclo più vicino alla Terra?" Risposta: $13\,\text{km/s}$ in avanti. Distrattori: $13\,\text{km/s}$ indietro
  (il verso sbagliato), $55\,\text{km/s}$ in avanti e $55\,\text{km/s}$ indietro (le velocità sommate, come nel punto più
  lontano).
- Con $v_d = 17\,\text{km/s}$ e $v_e = 43\,\text{km/s}$: $26\,\text{km/s}$ indietro.

## Livello 2: le velocità da raggi e periodi

Dati: il rapporto $r/R$ tra $0{,}21$ e $0{,}89$ (due decimali, senza zero finale), i due periodi tra $1{,}1$ e $9{,}9$
anni, diversi. Il rapporto $v_e/v_d$ sta tra $0{,}2$ e $9$ e dista da $1$ almeno $0{,}08$. La soluzione dice se il
pianeta torna indietro.

- $r/R = 0{,}43$, $T_d = 3{,}6$ anni, $T_e = 5{,}8$ anni: $0{,}43 \cdot 3{,}6/5{,}8 = 0{,}2669 \approx 0{,}27$.
  Distrattori: $3{,}7$ (il rapporto rovesciato), $0{,}69$ (i periodi rovesciati), $1{,}4$ (raggi rovesciati).
- $r/R = 0{,}89$, $T_d = 5{,}1$, $T_e = 5{,}4$: $0{,}84$.

## Livello 3: la distanza dall'elongazione

Un solo dato, l'elongazione massima, un numero intero di gradi tra $12$ e $58$. Scena `elongazione-pianeta` con il
triangolo Sole-pianeta-Terra, l'angolo e il lato di $1\,\text{UA}$; la distanza cercata ha solo la lettera $r$.

- $41^\circ$: $\sin 41^\circ = 0{,}6561 \approx 0{,}66\,\text{UA}$. Distrattori: $0{,}75\,\text{UA}$ (coseno),
  $0{,}87\,\text{UA}$ (tangente), $1{,}5\,\text{UA}$ (uno diviso il seno).
- $46^\circ$: $0{,}72\,\text{UA}$.

Il livello ha pochi esercizi diversi (47 angoli).

## Livello 4: il periodo di un pianeta esterno

Periodo sinodico intero tra $601$ e $999$ giorni, senza zero finale.

- $S = 893\,\text{d}$: $1/365{,}25 - 1/893 = 1{,}618 \cdot 10^{-3}\,\text{d}^{-1}$, $T = 618\,\text{d}$. Distrattori:
  $259\,\text{d}$ (la formula del pianeta interno), $528\,\text{d}$ ($S - T_T$), $629\,\text{d}$ (la media).
- $S = 780\,\text{d}$: $687\,\text{d}$ (Marte, esempio 3 della lezione).

## Livello 5: il periodo di un pianeta interno

Periodo sinodico intero tra $101$ e $899$ giorni, senza zero finale. I segni della formula si scambiano.

- $S = 602\,\text{d}$: $1/365{,}25 + 1/602 = 4{,}399 \cdot 10^{-3}\,\text{d}^{-1}$, $T = 227\,\text{d}$. Distrattori:
  $929\,\text{d}$ (la formula del pianeta esterno), $237\,\text{d}$ ($S - T_T$), $484\,\text{d}$ (la media).
- $S = 584\,\text{d}$: $225\,\text{d}$ (Venere).

## Esercizi da evitare

- Velocità uguali sull'epiciclo e sul deferente, o un rapporto vicino a $1$: la risposta dipenderebbe
  dall'arrotondamento.
- Periodi che finiscono con uno zero ($690\,\text{d}$) o che chiedono la notazione scientifica.

## Verifica

`fis_sistemi_cosmologici.py` rilegge il testo, controlla dati e intervalli, ricalcola con valori esatti (seno
compreso, con SymPy), arrotonda e confronta l'opzione giusta, la forma di tutte le opzioni e la fine della soluzione;
al livello 3 controlla la scena (tipo, angolo, testo) e negli altri che non ci sia.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0. Errori piantati (indice, primo e ultimo dato, testo dell'opzione giusta, opzione doppia, parole vietate, scena,
unità): tutti bocciati.

## Domande per la revisione

- I livelli 1 e 2 sull'epiciclo sono conti che i libri non chiedono: vanno bene come "domande di ragionamento su casi
  generati", o è meglio sostituirli con domande sul modello (quale osservazione esclude quale sistema)?
- Il periodo sinodico in terza si fa a fisica o solo a scienze della Terra?
