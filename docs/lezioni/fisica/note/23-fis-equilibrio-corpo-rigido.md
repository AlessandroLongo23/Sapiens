# Note: L'equilibrio di un corpo rigido

Lezione nuova, scritta da zero (secondo lotto di fisica, gruppo 7, 30 settembre 2026). Conti rifatti con SymPy in
`verifica_lezioni_g7.py` (scratchpad del lotto): l'altalena ($b = 1{,}0\,\text{m}$, $F_v = 750\,\text{N}$), la trave
($F_B = 500\,\text{N}$, $F_A = 900\,\text{N}$, il controllo con il polo in $B$, e $200$ e $600\,\text{N}$ senza il peso),
l'asta pesante ($30$ e $90\,\text{N}$, $90\,\text{N}$ con il braccio sbagliato), il bambino e l'adulto ($600$ contro
$500\,\text{N} \cdot \text{m}$). `check.mts` passa senza avvisi.

## Struttura ed esempi

Il corpo rigido come modello, traslazione e rotazione, le due condizioni ($\vec{R} = \vec{0}$ e $M = 0$), il polo che
si può scegliere (con una nota che lo dimostra per le forze verticali: il momento rispetto a $p$ è
$\sum F_i x_i - p \sum F_i$), il procedimento in cinque passi, l'asta sul fulcro, la trave su due appoggi, l'asta con
il suo peso. Tre esempi: l'altalena, la trave con un carico, l'asta pesante appoggiata fuori dal centro. Avvisi: il
peso più grande non vince sempre, il peso della trave non si dimentica, il braccio del peso si misura dal fulcro.

## Scelte

- Le reazioni vincolari si chiamano $\vec{F}_v$ (il fulcro) e $\vec{F}_A$, $\vec{F}_B$ (gli appoggi), come la lezione
  20 ("L'equilibrio di un punto materiale e le reazioni vincolari") che scrive $\vec{F}_v$; $\vec{R}$ resta la
  risultante. Molti libri scrivono $R_A$ e $R_B$ o $N_A$ e $N_B$.
- Solo forze verticali e aste orizzontali: le forze oblique (la scala appoggiata al muro, l'asta incernierata con il
  filo) mancano. Si possono aggiungere come esempio se Andrea le vuole al primo anno.
- La dimostrazione che il polo si può scegliere è limitata alle forze parallele, l'unico caso della lezione.
- Il baricentro è citato solo come "il centro di un corpo omogeneo", con il link alla lezione 25.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `equilibrio-altalena` ($2\,\text{cm}$ per metro, $1\,\text{cm}$ per
$300\,\text{N}$: $P_1 = 1$, $P_2 = 1{,}5$, $F_v = 2{,}5\,\text{cm}$), `equilibrio-trave-due-appoggi` ($1{,}5\,\text{cm}$
per metro, $1\,\text{cm}$ per $500\,\text{N}$: $F = 1{,}6$, $P = 1{,}2$, $F_A = 1{,}8$, $F_B = 1\,\text{cm}$),
`equilibrio-asta-pesante` ($1\,\text{cm}$ per $40\,\text{N}$). Il suolo sotto i fulcri è un tratto corto, perché le
frecce dei pesi non attraversino il tratteggio.

Interattiva `altalena-momenti` (`src/components/content/interactive/fisica/Altalena.tsx`): i due bambini si trascinano
lungo l'asse (o con i cursori), i loro pesi si cambiano con i cursori; sotto, i due momenti e il totale. Niente motore
fisico: il segno del momento totale decide da che parte scende l'asse, fino a toccare terra ($19{,}5^\circ$), e
un'animazione a tempo la porta lì; con i momenti uguali l'asse torna orizzontale. È una semplificazione: un'altalena in
equilibrio inclinata resterebbe dov'è (o cadrebbe, se il baricentro dei bambini è sopra il fulcro), ma così il
messaggio "momenti uguali, asse ferma in orizzontale" è chiaro.

## Esercizi

Generatore `fis-equilibrio-corpo-rigido`, specifica in `specs/exercises/fis-equilibrio-corpo-rigido.md`: cinque
livelli (l'asta sul fulcro, la reazione del fulcro, l'asta con il suo peso, la trave su due appoggi, la trave con il
suo peso), scena `asta-forze`.

## Lasciato ad altre lezioni

- L'equilibrio del punto materiale e le reazioni vincolari: lezione 20, linkata in apertura.
- Le leve: lezione 24, linkata in chiusura. Il baricentro: lezione 25.

## Domande per Andrea

- Reazioni vincolari: $\vec{F}_v$, $\vec{F}_A$ e $\vec{F}_B$ come qui, o $\vec{R}_A$ e $\vec{R}_B$ (ma $\vec{R}$ è già la
  risultante), o $\vec{N}$?
- Servono esempi con forze oblique (la scala appoggiata, la mensola con il tirante), o sono da terzo anno?
- Il procedimento in cinque passi, con il controllo su un secondo polo, va bene per il biennio?
