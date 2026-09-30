# Note: Il secondo principio della dinamica

Lezione nuova (terzo lotto di fisica, gruppo 15, 30 settembre 2026). Lo slug `leggi-newton` è quello del database; il
titolo è "Il secondo principio della dinamica". Conti rifatti in Python: $1{,}2/0{,}40 = 3{,}0$ kg; $0{,}50/0{,}250 = 2{,}0$
m/s²; $10/2{,}5 = 4{,}0$ m/s²; $1200 \cdot 2{,}5 = 3000$ N; $(250 - 180)/35 = 2{,}0$ m/s²; $\sqrt{40^2 + 30^2}/10 = 5{,}0$
m/s², $\tan^{-1}(30/40) = 36{,}9^\circ$; $0{,}25 \cdot 20 \cdot 9{,}8 = 49$ N, $36/20 = 1{,}8$ m/s², $85/20 = 4{,}25$ m/s²;
$-25/5{,}0 = -5{,}0$ m/s², $1200 \cdot 5{,}0 = 6000$ N. Nelle figure: grafico con i punti $(k; k)$ e $(k; k/2)$ per
$k = 1, \ldots, 4$ (scala $0{,}8$ cm per unità); cassa con forze opposte a 1 cm per 100 N ($2{,}5$ e $1{,}8$ cm); forze
perpendicolari a 1 cm per 25 N ($1{,}6$, $1{,}2$, $2{,}0$ cm); cassa trascinata a 1 cm per 70 N ($85/70 = 1{,}21$,
$49/70 = 0{,}70$, $196/70 = 2{,}8$ cm). `check.mts` dà un avviso su "fondamentale", in "legge fondamentale della
dinamica": è il nome della legge e l'ho tenuto.

## Struttura ed esempi

Forza, massa e accelerazione (l'esperimento del carrello, le due proporzionalità, il grafico accelerazione-forza con due
masse), l'enunciato ($\vec F_{tot} = m\,\vec a$, la direzione dell'accelerazione, il primo principio come caso
particolare, figura), l'avviso sull'accelerazione che va con la forza e non con la velocità, la massa inerziale (con
$P = m\,g$ come caso del secondo principio, esempio 1), il newton (avviso sui grammi), una forza sola (esempi 2 e 3),
più forze (esempi 4 e 5 con figure), l'attrito (esempio 6 con figura, avviso sull'attrito statico), la figura
interattiva, forza e velocità ($v = v_0 + a\,t$, esempio 7 della frenata).

## Scelte

- L'esempio 3 dice che la forza totale sull'auto è la spinta della strada meno le resistenze: è corretto e prepara la
  lezione sul lavoro, ma non spiega perché è la strada a spingere (lo fa la lezione sul terzo principio, camminare).
- La massa gravitazionale non si nomina: la lezione dice solo che la massa di $P = m\,g$ è la stessa, e che lo mostra la
  caduta di tutti i corpi con la stessa accelerazione.
- Nella figura interattiva le forze partono dal bordo del carrello (il filo tira davanti, l'attrito lungo la base) e non
  dal centro, perché con le forze piccole il carrello le coprirebbe. Il carrello continua a velocità costante se si
  porta la forza a zero senza attrito: è il primo principio, e la didascalia lo dice.
- Coefficienti della figura interattiva: $\mu_s = 0{,}30$, $\mu_d = 0{,}20$, inventati per la figura (nessun materiale
  nominato).

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `grafico-accelerazione-forza` (con `% poi-interattivo`),
`carrello-forza-accelerazione`, `cassa-due-forze-opposte`, `due-forze-perpendicolari-accelerazione`,
`cassa-trascinata-attrito`. Interattiva `carrello-forza-accelerazione` (`fisica/CarrelloForza.tsx`): forza da 0 a 20 N,
massa da 1 a 5 kg, attrito da accendere; il carrello parte con un bottone e si muove per $4{,}4$ m con un passo di
integrazione scritto a mano.

## Esercizi

Generatore `leggi-newton`, sei livelli (specifica in `specs/exercises/leggi-newton.md`), scene `blocco-forze` e
`punto-forze`.

## Domande per Andrea

- "Secondo principio della dinamica" o "legge fondamentale della dinamica" come nome principale? L'Amaldi (da verificare)
  usa il primo e cita il secondo.
- $\vec F_{tot}$ (notazione scelta per il secondo anno) o $\vec F$ con la parola "risultante"?
- Il grafico accelerazione-forza con due masse: l'esperimento del carrello su rotaia a cuscino d'aria è quello dei
  laboratori delle scuole, o si fa con il piano inclinato?
- Serve la massa gravitazionale con il suo nome, o basta dire che la massa del peso è la stessa?
- L'esempio della frenata con l'asse nel verso del moto e la forza negativa: va bene al secondo anno, o si lavora solo
  con i moduli?
