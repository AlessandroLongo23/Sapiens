# Note: La legge di Boyle

Lezione nuova (lotto del terzo anno di fisica, gruppo 39, 6 ottobre 2026). Conti rifatti in Python con i dati scritti
come nella lezione:

- esempio 1: $4{,}0 \cdot 9{,}8 / (2{,}0 \cdot 10^{-3}) = 19\,600$ Pa, $101\,000 + 19\,600 = 120\,600$ Pa; le frecce della
  figura sono $241$, $202$ e $39$ N alla scala 1 cm = 100 N;
- esempio 2: $30{,}0 \cdot 1{,}01 / 1{,}206 = 25{,}12$ cm (con $1{,}21$ arrotondato verrebbe $25{,}04$: il passaggio tiene
  la quarta cifra e lo dice), rapporto capovolto $35{,}82$ cm;
- tabella: $600$ J in tutte le colonne; esempio 3: $600$, $600$ e $480$ J, $600 / 4{,}0 = 150$ kPa;
- esempio 4: $1000 \cdot 9{,}8 \cdot 15 = 147\,000$ Pa, $248\,000$ Pa, $2{,}0 \cdot 2{,}48 / 1{,}01 = 4{,}91$ cm³; senza $p_0$,
  $2{,}91$ cm³;
- esempio 5: $20{,}0 \cdot 76{,}0 / 86{,}0 = 17{,}67$ cm, capovolto $20{,}0 \cdot 76{,}0 / 66{,}0 = 23{,}03$ cm;
- figura interattiva: ogni pesetto $1{,}0 \cdot 9{,}8 / 10^{-3} = 9{,}8$ kPa; altezze $20{,}00$, $18{,}23$, ..., $10{,}15$ cm
  (prima discesa $1{,}77$ cm, decima $0{,}53$ cm); $101$ kPa $\cdot$ $200$ cm³ $= 20{,}2$ J.

`check.mts`: 0 errori. Tre avvisi "titolo con maiuscole all'inglese" su "La legge di Boyle", "Due problemi con la legge
di Stevino" e, nel formulario, "Legge di Boyle": sono nomi propri.

## Scelte

- La chimica ha già la legge (lezione 31, con la tabella in atmosfere, il grafico, il grafico con $1/V$, il sub e il
  respiro). Qui non si ripete: la lezione la richiama nella prima riga con il link e aggiunge quello che in chimica non
  c'è. La pressione del gas ricavata dalle forze sul pistone ($p = p_0 + m g / S$), le unità del SI e il prodotto
  $p \cdot V$ in joule, il piano pressione-volume come strumento (un punto è uno stato, il prodotto è l'area del
  rettangolo, isoterme che non si incontrano), i problemi con la legge di Stevino (la bolla con $p_0 + d g h$, il tubo
  con il mercurio in cmHg) e i limiti (compressione veloce, gas vero).
- Confine con la 103 e la 104: qui la temperatura c'è solo come "più alta, isoterma più lontana". Il valore della
  costante ($n R T$) è nella 104, che lo dice esplicitamente rimandando a questa lezione.
- Confine con la 105: la spiegazione con le molecole è un paragrafo di cinque righe con il link.
- Confine con la 109 e la 113: il lavoro non compare (solo "il prodotto è un'energia, il motivo arriverà" con il link
  alla 109); la compressione veloce rimanda alla 113 senza dire "adiabatica" nel testo, solo nel titolo del link.
- "Piano pressione-volume, o piano di Clapeyron": il nome proprio è dato una volta, poi si usa sempre il primo.
- Simboli: $p_0$ è la pressione atmosferica, come nelle lezioni sui fluidi; $S$ l'area del pistone, $h$ la sua altezza,
  $l$ la lunghezza della colonna d'aria nel tubo, $d$ la densità. $1\,\text{atm} = 1{,}01 \cdot 10^5\,\text{Pa}$ come nel
  README del terzo anno (la 29 del biennio usa $1{,}013$).
- Il grafico con $1/V$ non c'è: è nella lezione di chimica e nella 12 del biennio.

## Figure

Sei TikZ, guardate in chiaro e in scuro: `pistone-pesetto-pressione-gas` (frecce in scala, 1 cm = 100 N),
`boyle-isoterma-rettangoli-uguali` (1 cm = 1 L e 100 kPa; i cinque punti della tabella su $y = 6/x$),
`boyle-famiglia-isoterme`, `boyle-stati-a-b-c` ($C$ a $(4;\,1{,}2)$ su $y = 4{,}8/x$), `boyle-bolla-lago` (raggi delle
bolle $0{,}12$ e $0{,}16$ cm, in rapporto $1{,}33$: la radice cubica di $2{,}46$ è $1{,}35$), `boyle-tubo-mercurio-aria` (1 cm = 10 cm).

Interattiva, registrata sotto il commento del gruppo 39 in `src/lib/utils/interactive.ts`:

- `boyle-pistone-pesetti` (`fisica/BoylePistonePesetti.tsx`). Domanda: ogni pesetto aggiunge la stessa pressione; il
  pistone scende ogni volta della stessa quantità? Risposta nel testo subito dopo. Cilindro con righello, da 0 a 10
  pesetti, piano pressione-volume con l'isoterma e gli stati già visitati. Usa `Piston` (liquidi.tsx), `Axes`, `Ticks`
  e `Words`; i pesetti sono rettangoli grigi disegnati nel file. Guardata in chiaro, in scuro e da telefono, a zero,
  uno e dieci pesetti. Il nome è diverso da `gas-cilindro-boyle` di chimica, che sposta il pistone a mano e mostra le
  particelle.

Nessun blocco `grafico`: quello con il cursore del prodotto è già nella lezione di chimica.

## Esercizi

Generatore `fis-legge-boyle`, cinque livelli (specifica in `specs/exercises/fis-legge-boyle.md`): La pressione sotto il
pistone, La pressione finale, Dove si ferma il pistone, Sulla stessa isoterma, La bolla nel lago. Scena nuova
`cilindro-pistone` (`scenes/CilindroPistone.tsx`) ai livelli 1 e 3, con la scena della soluzione al livello 3. Modulo
comune ai tre generatori del gruppo: `src/lib/exercises/v2/fis-gas-leggi.ts` e `checkers/_fis_gas_leggi.py`.
L'esempio 5 (il tubo con il mercurio) non ha un livello.

## Esercizio guidato

L'esempio 2 (di quanto scende il pistone). Si fermerebbe in tre punti: (1) "qual è la pressione del gas prima di
appoggiare il pesetto?", per far dire $p_0$ e non zero; (2) "qual è dopo?", con il conto dell'esempio 1; (3) "il
pistone sale o scende, e quale delle due altezze sta al numeratore?", prima di scrivere $h_2 = p_1 h_1 / p_2$.

## Da verificare

- Robert Boyle, 1662 (stessa data della lezione di chimica).
- "Piano di Clapeyron" come nome del piano pressione-volume nei libri italiani.
- "L'aria a temperatura ambiente segue molto bene la legge fino a pressioni di parecchie atmosfere": affermazione
  qualitativa, senza numero.
- Pressione atmosferica normale $76{,}0$ cmHg; densità dell'acqua del lago $1000\,\text{kg/m}^3$.

## Domande per Andrea

- La pressione del gas dalle forze sul pistone apre la lezione, prima della legge: va bene, o l'Amaldi la dà per
  nota dal capitolo sui fluidi?
- L'esempio del tubo con il mercurio usa i cmHg come unità di pressione. Al terzo anno si usa ancora, o è meglio
  tutto in pascal con $d_{Hg}\,g\,h$?
- Nei passaggi intermedi tengo una cifra in più ($1{,}206 \cdot 10^5$ Pa) e arrotondo alla fine: nell'esempio 2 cambia
  l'ultima cifra ($25{,}1$ contro $25{,}0$ cm). È la regola che vuoi negli esempi a catena?
- "Isoterma" è introdotta qui come trasformazione a temperatura costante, con il "lentamente". Basta, o serve già la
  parola "quasistatica" (che è nella 107)?

Prerequisiti proposti: fis-pressione, fis-pressione-atmosferica, fis-legge-stevino, fis-proporzionalita-inversa
