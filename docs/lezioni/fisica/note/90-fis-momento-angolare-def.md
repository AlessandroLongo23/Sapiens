# Note: Il momento angolare

Lezione nuova (lotto del terzo anno, gruppo 35, 6 ottobre 2026). Conti rifatti in Python:

- fionda: $0{,}20 \cdot 5{,}0 \cdot 0{,}80 = 0{,}80$ kg·m²/s;
- gabbiano: $p = 0{,}45 \cdot 12 = 5{,}4$ kg·m/s, $30 \cdot 5{,}4 \cdot 0{,}5 = 81$ kg·m²/s, braccio $30 \sin 30^\circ = 15$ m;
- ruota: $I = 1{,}5 \cdot 0{,}35^2 = 0{,}1838$ kg·m², $\omega = 2\pi \cdot 3{,}0 = 18{,}85$ rad/s, $L = 3{,}464$ kg·m²/s;
- volano: $0{,}60 \cdot 4{,}0 = 2{,}4$ kg·m²/s, $2{,}4 / 0{,}15 = 16$ rad/s;
- frenata: $M = 12 \cdot 0{,}35 = 4{,}2$ N·m, $3{,}46 / 4{,}2 = 0{,}824$ s.

`check.mts`: 0 errori, 0 avvisi.

## Confini e scelte

- Il prodotto vettoriale è della lezione 71: qui si usa, con il link, e si ripete solo la regola della mano destra
  applicata a $\vec r$ e $\vec p$. Il momento di una forza come prodotto vettoriale è della 88.
- Angolo tra $\vec r$ e $\vec p$: $\varphi$, come chiede il README. Accanto a $L = r\,m\,v\sin\varphi$ c'è la forma con il
  braccio, $L = m\,v\,b$, costruita sulla lezione 22 del biennio (braccio di una forza): evita il seno di un angolo
  ottuso, che lo studente non ha ancora. Dove serve, la lezione dice solo che $\sin 150^\circ = \sin 30^\circ$.
- Segno: positivo il verso antiorario, come per i momenti della lezione 22; $\odot$ e $\otimes$ come nel README.
- $L = I\omega$ è ricavata sommando i momenti angolari dei pezzetti. $M = \Delta L/\Delta t$ è ricavata da $M = I\alpha$ con
  $I$ costante, e poi enunciata in generale (anche con $I$ variabile, in forma vettoriale), dicendolo.
- La conservazione non è in questa lezione: l'ultima riga rimanda alla 91. Non ho dato un nome a $M\,\Delta t$ ("impulso
  angolare"): nessun libro del terzo anno lo usa nei problemi (da verificare).
- La tabella "Traslazione e rotazione a confronto" sta qui, in fondo, perché è la prima lezione in cui tutte le righe
  sono note. Se il gruppo 34 l'ha messa nella 88, una delle due va tolta.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `momento-angolare-particella-braccio` ($r = 3$ cm a $30^\circ$, braccio
1,5 cm), `momento-angolare-moto-circolare`, `momento-angolare-moto-rettilineo` (tre posizioni, stesso braccio),
`momento-angolare-disco-asse`, `grafico-momento-angolare-tempo` (retta per $(4{,}0;\ 2{,}4)$, i dati dell'esempio 4; ha la
riga `% poi-interattivo`).

Interattiva (registrata sotto il commento del gruppo 35):

- `momento-angolare-moto-rettilineo-braccio` (`fisica/MomentoAngolareRetta.tsx`). Domanda: mentre una particella che va
  dritta si avvicina al polo e poi si allontana, che cosa succede al suo momento angolare? Particella di 0,50 kg a
  2,0 m/s, braccio da 0 a 3 m (iniziale 1,5 m); sotto sono scritti $r$, $\varphi$, $r\sin\varphi$ e $L$. Con il braccio a
  zero $L = 0$.

## Esercizio guidato

L'esempio 5 (fermare la ruota con la mano): si fermerebbe a chiedere il momento della forza di attrito (braccio e
segno), poi la variazione del momento angolare con il suo segno, poi il tempo. È l'esempio in cui lo sbaglio di segno
si vede.

## Esercizi

Generatore `fis-momento-angolare-def`, sei livelli (specifica in `specs/exercises/fis-momento-angolare-def.md`): Una
particella in moto circolare, Con l'angolo tra posizione e velocità, Un corpo rigido che ruota, Il momento angolare dalla
forma del corpo, Il momento che fa accelerare, Il tempo di frenata. Scena nuova `particella-polo`
(`scenes/ParticellaPolo.tsx`) al livello 2. Restano senza esercizio il verso di $\vec L$ (entrante o uscente), il braccio
letto da una figura e i giri al secondo da convertire.

## Domande per Andrea

- Va bene presentare insieme $L = r\,m\,v\sin\varphi$ e $L = m\,v\,b$, o al terzo anno si usa solo la prima?
- Il momento angolare di una particella in moto rettilineo (esempio 2 e interattiva) è al livello del terzo anno?
  L'ho tenuto perché serve nella 91 per il bambino che salta sulla giostra.
- $M = \Delta L/\Delta t$ enunciata in generale dopo averla ricavata con $I$ costante: basta, o serve dire di più?
- La tabella di confronto tra traslazione e rotazione sta meglio qui o nella 88?

## Da verificare

- Ruota di bicicletta: $1{,}5$ kg e raggio $0{,}35$ m, trattata come un anello (valori plausibili, a memoria).
- Massa e velocità di un gabbiano: $0{,}45$ kg e $12$ m/s (ordine di grandezza, a memoria).

Prerequisiti proposti: fis-prodotto-scalare-vettoriale, fis-quantita-moto-def, fis-momento-inerzia, fis-dinamica-rotazionale
