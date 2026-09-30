# Gli specchi sferici

Generatore: `fis-specchi-sferici` (`src/lib/exercises/v2/generators/fis-specchi-sferici.ts`, con
`src/lib/exercises/v2/raggi-specchi.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_specchi_sferici.py`.
Lezione collegata: `docs/lezioni/fisica/riscritte/33-fis-specchi-sferici.md`. Percorso nel database:
`high_school/physics/ottica/fis-specchi-sferici`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il fuoco e il raggio di curvatura
2. L'immagine reale di uno specchio concavo
3. Altezza e verso dell'immagine
4. L'immagine virtuale dello specchio concavo
5. Lo specchio convesso
6. La distanza focale dall'immagine

## Convenzione dei segni

Quella della lezione (e delle lenti): $\frac{1}{p} + \frac{1}{q} = \frac{1}{f}$, $p > 0$; $q > 0$ se l'immagine è
reale, $q < 0$ se è virtuale; $f = R/2$ per lo specchio concavo, $f = -R/2$ per il convesso; $G = -q/p = h'/h$.

## Numeri e risposte

Distanze in centimetri interi, costruite all'indietro perché $q$ e $f$ vengano esatti al mezzo centimetro
(esempio: $p = 65$, $f = 40$ danno $q = 104\,\text{cm}$); altezze al millimetro con una cifra decimale
($5{,}6\,\text{cm}$). Nessun arrotondamento: tutti i risultati sono esatti. Ingrandimento tra $0{,}2$ e $3$ in
valore assoluto ai livelli 2-5, perché il disegno resti leggibile. Scelta multipla con l'unità nell'opzione; i
valori negativi con il segno meno. I distrattori, quando non vengono esatti, sono arrotondati al millimetro come li
darebbe la calcolatrice.

## Regole comuni

- La scena (`raggi-specchi`) disegna l'asse, lo specchio (concavo o convesso, meno curvo del vero come nella
  lezione), il vertice, l'oggetto alla distanza $p$ in scala con la sua quota, e il fuoco e il centro quando il testo
  li dà. Niente raggi e niente immagine: stanno nella `solutionScene`, con i tre raggi notevoli (parallelo, per il
  fuoco, nel vertice), riflessi verso l'immagine o, se virtuale, con i prolungamenti tratteggiati.
- L'altezza disegnata dell'oggetto è sempre $0{,}7\,\text{cm}$; l'immagine è alta $G \cdot 0{,}7$.

## Livello 1: il fuoco e il raggio di curvatura

Specchio concavo puntato verso il Sole; metà dei casi si dà $R$ (pari, da 12 a 96 cm) e si chiede dove si
concentra la luce, metà si dà $f$ e si chiede $R$.

- "$R = 48\,\text{cm}$: a quale distanza dal vertice si concentra la luce?" Risposta $24\,\text{cm}$; distrattori
  $48$ (fuoco nel centro), $96$, $12\,\text{cm}$.
- "La luce si concentra a $27\,\text{cm}$: quanto vale $R$?" Risposta $54\,\text{cm}$; distrattori $27$, $13{,}5$,
  $108\,\text{cm}$.

## Livello 2: l'immagine reale di uno specchio concavo

Oggetto oltre il fuoco ($f < p \le 5f$), $f$ da 8 a 60 cm. Si chiede $q$.

- "$p = 66\,\text{cm}$, $f = 30\,\text{cm}$." Risposta $55\,\text{cm}$; distrattori $20{,}6\,\text{cm}$ (frazioni
  sommate: $pf/(p+f)$), $36\,\text{cm}$ ($p - f$), $60\,\text{cm}$ ($2f$).
- "$p = 65\,\text{cm}$, $f = 40\,\text{cm}$." Risposta $104\,\text{cm}$; distrattori $24{,}8$, $25$, $80\,\text{cm}$.

## Livello 3: altezza e verso dell'immagine

Come il livello 2, con l'altezza dell'oggetto: si chiede l'altezza dell'immagine e se è diritta o capovolta.

- "$h = 3{,}6\,\text{cm}$, $p = 66\,\text{cm}$, $f = 30\,\text{cm}$." Risposta $3{,}0\,\text{cm}$ capovolta;
  distrattori $3{,}0\,\text{cm}$ diritta, $3{,}6\,\text{cm}$ capovolta (grande uguale), $4{,}3\,\text{cm}$ capovolta
  (rapporto rovesciato, $h \cdot p/q$) quando è esatto.
- "$h = 3{,}5$, $p = 65$, $f = 40$." Risposta $5{,}6\,\text{cm}$ capovolta.

## Livello 4: l'immagine virtuale dello specchio concavo

Oggetto tra il fuoco e lo specchio; $q$ negativa.

- "$p = 12\,\text{cm}$, $f = 30\,\text{cm}$." Risposta $-20\,\text{cm}$; distrattori $20\,\text{cm}$ (segno perso),
  $8{,}6\,\text{cm}$ ($pf/(p+f)$), $-18\,\text{cm}$ ($-(f-p)$).
- "$p = 8\,\text{cm}$, $f = 40\,\text{cm}$." Risposta $-10\,\text{cm}$.

## Livello 5: lo specchio convesso

Si dà il raggio di curvatura; lo studente deve scrivere $f = -R/2$.

- "$p = 39\,\text{cm}$, $R = 78\,\text{cm}$." Risposta $-19{,}5\,\text{cm}$; distrattori $19{,}5\,\text{cm}$ (segno
  perso), $-26\,\text{cm}$ ($R$ al posto di $f$), altri dal fuoco preso positivo.
- "$p = 29\,\text{cm}$, $R = 58\,\text{cm}$." Risposta $-14{,}5\,\text{cm}$.

## Livello 6: la distanza focale dall'immagine

Si danno $p$ e il tipo di immagine (reale e capovolta, o virtuale e diritta, e quante volte è più grande o più
piccola); un terzo dei casi per tipo (reale, virtuale ingrandita, virtuale rimpicciolita). Si chiede $f$ con il segno,
che dice se lo specchio è concavo o convesso. Questo livello non ha la scena del problema (lo specchio disegnato
direbbe il segno); la soluzione ha la costruzione.

- "$p = 25\,\text{cm}$, virtuale e diritta, il doppio." Risposta $50\,\text{cm}$; distrattori $-50\,\text{cm}$
  (segno), $16{,}7\,\text{cm}$ ($q$ presa positiva), $100\,\text{cm}$ ($2f$).
- "$p = 44\,\text{cm}$, virtuale e diritta, la metà." Risposta $-44\,\text{cm}$.

## Esercizi da evitare

- Immagini più grandi di tre volte o più piccole di un quinto ai livelli 2-5; oggetto nel fuoco; $q = p$.
- Due opzioni uguali; opzioni senza unità.

## Verifica

`fis_specchi_sferici.py` rilegge il testo, risolve con frazioni esatte di SymPy e confronta l'opzione giusta con il
valore esatto e la sua unità. Controlla la scena: specchio del tipo giusto, oggetto a $-p \cdot k$ (la scala $k$ è
nei parametri), fuoco e centro al loro posto e solo quando il testo li dà, nessun raggio e nessuna immagine; nella
soluzione l'immagine a $-q \cdot k$ con altezza $G \cdot 0{,}7$, e ogni raggio riflesso (o il suo prolungamento)
passante per la sua punta. Quote dei casi ai livelli 1 e 6.

## Domande per la revisione

- $p$, $q$, $f$ (qui) o $d_o$, $d_i$, $f$? Convenzione dei segni con $q < 0$ per le immagini virtuali: va bene per
  Andrea?
- Distanze in centimetri interi senza badare alle cifre significative (i risultati sono esatti): va bene, o si
  preferiscono dati con le cifre significative e risultati arrotondati?
