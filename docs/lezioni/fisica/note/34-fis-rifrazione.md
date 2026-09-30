# Note: La rifrazione e la riflessione totale

Lezione nuova, secondo lotto di fisica, gruppo 11, 30 settembre 2026. Numeri rifatti in Python (velocità, seni, angoli,
angoli limite, coordinate delle figure); `check.mts` passa sui tre file. Nel formulario resta un avviso falso: "La legge
di Snell" ha la maiuscola perché è un nome proprio.

## Struttura ed esempi

Indice di rifrazione $n = c/v$ con una tabella; le due leggi della rifrazione, angoli dalla normale, legge di Snell
$n_1 \sin\theta_1 = n_2 \sin\theta_2$; il raggio che si avvicina o si allontana dalla normale; il raggio riflesso
parziale; lamina a facce parallele; profondità apparente $h' = h/n$ per chi guarda quasi in verticale; angolo limite
$\sin\theta_L = n_2/n_1$ e riflessione totale; fibre ottiche. Sette esempi: velocità nell'acqua ($2{,}26 \cdot 10^8$) e
indice del diamante; aria-acqua a $45^\circ$ ($32^\circ$); aria-vetro a $60^\circ$ ($35^\circ$); indice da $40^\circ$ e
$25^\circ$ ($1{,}52$); acqua-aria a $30^\circ$ ($42^\circ$); angoli limite di vetro ($42^\circ$), acqua ($49^\circ$) e
diamante ($24^\circ$); il prisma a riflessione totale a $45^\circ$.

Avvisi accanto alla regola: indice minore di 1 ($v/c$), angoli dalla superficie, l'angolo diviso per l'indice al posto
del seno, riflessione totale verso il mezzo più rifrangente.

## Scelte

- Angoli $\theta_1$ e $\theta_2$, seno scritto $\sin$ come nella lezione 15 e sulla calcolatrice.
- Aria con $n = 1{,}00$ negli esercizi; vetro $1{,}50$.
- Profondità apparente con la formula $h' = h/n$ solo per chi guarda quasi in verticale, e detto che di sbieco non vale.
  Non so se l'Amaldi del biennio la tratta: se no, si può ridurre al solo disegno.
- La riflessione parziale è citata in una frase (la vetrina), senza numeri.

## Dati e fonti

- Indici della tabella (luce gialla del sodio, 589 nm): aria $1{,}0003$, acqua $1{,}33$, ghiaccio $1{,}31$, alcol etilico
  $1{,}36$, vetro comune $1{,}5$-$1{,}6$, diamante $2{,}42$. Valori standard che cito a memoria, non controllati su una
  tabella citabile: da verificare (per esempio sul CRC Handbook of Chemistry and Physics o sulla tabella dell'Amaldi).
- $c = 3{,}00 \cdot 10^8\,\text{m/s}$ (il valore esatto è $299\,792\,458\,\text{m/s}$, per definizione del metro).

## Figure

Statiche (chiaro e scuro, raggi calcolati con Snell): `rifrazione-aria-acqua` ($45^\circ$ e $32{,}1^\circ$),
`lamina-facce-parallele` (vetro 1,50, $50^\circ$ e $30{,}7^\circ$, prolungamento tratteggiato), `profondita-apparente-moneta`
(due raggi dalla moneta a $19{,}3^\circ$ e $26{,}6^\circ$, prolungamenti che si incontrano davvero nel punto disegnato),
`angolo-limite-tre-raggi` (acqua: $30^\circ$ esce a $41{,}7^\circ$, l'angolo limite $48{,}75^\circ$ esce radente, $65^\circ$
riflesso), `fibra-ottica-rimbalzi` (ingresso a $30{,}9^\circ$, dentro $20^\circ$ dall'asse, cioè $70^\circ$ dalla normale
delle pareti). I raggi usano uno stile locale `raggio` nella `tikzpicture`, con la stessa definizione del README.

Interattiva: `rifrazione-due-mezzi` (`RifrazioneDueMezzi.tsx`): due mezzi a scelta (aria, acqua, vetro, diamante),
l'inizio del raggio incidente da trascinare o un cursore per $\theta_1$; raggio rifratto con `refract` di `ottica.tsx`,
riflesso sempre disegnato (tenue, pieno nella riflessione totale), linea a puntini all'angolo limite; sotto $\theta_1$,
$\theta_2$, $n_1 \sin\theta_1$, $n_2 \sin\theta_2$, $\theta_L$. Guardata in chiaro, in scuro, sul telefono, dopo il
trascinamento e con la riflessione totale (vetro-aria a $45^\circ$, diamante-acqua).

## Esercizi

Generatore `fis-rifrazione`, sei livelli: indice e velocità; angolo di rifrazione dall'aria; indice dagli angoli; verso
un mezzo meno rifrangente (a volte con l'angolo dalla superficie); angolo limite; esce o si riflette tutto. Scena
`raggio-due-mezzi`.

## Domande per Andrea

- Angoli $\theta_1$, $\theta_2$ (qui) o $\hat{i}$, $\hat{r}$ come in molti libri italiani? $\sin$ o $\text{sen}$?
- La profondità apparente con la formula $h' = h/n$ è nel programma del primo anno, o basta il disegno?
- Indici della tabella: quali valori usa il libro di classe (vetro $1{,}5$ o $1{,}52$)?
- Negli esercizi gli angoli trovati si danno al grado: va bene, o al decimo come alcuni libri?
- La riflessione totale nel diamante come ragione della brillantezza: semplificazione accettabile?
