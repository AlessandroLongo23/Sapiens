# Note: La legge di gravitazione universale

Lezione nuova (lotto del terzo anno di fisica, gruppo 36, 6 ottobre 2026). Conti rifatti in Python, con le costanti del
README ($G = 6{,}67 \cdot 10^{-11}$, $M_T = 5{,}97 \cdot 10^{24}$ kg, $R_T = 6{,}37 \cdot 10^{6}$ m):

- esempio 1: $6{,}67 \cdot 10^{-11} \cdot 70 \cdot 70 / 1{,}0^2 = 3{,}268 \cdot 10^{-7}$ N;
- esempio 2: $3{,}84^2 = 14{,}746$; $6{,}67 \cdot 5{,}97 \cdot 7{,}35/1{,}4746 = 198{,}48$; $F = 1{,}985 \cdot 10^{20}$ N;
- esempio 3: $6{,}67 \cdot 10^{-11} \cdot 158 \cdot 0{,}730/0{,}225^2 = 1{,}5196 \cdot 10^{-7}$ N; peso della sfera piccola
  $7{,}154$ N; rapporto $4{,}7 \cdot 10^{7}$;
- $g = 6{,}67 \cdot 10^{-11} \cdot 5{,}97 \cdot 10^{24}/(6{,}37 \cdot 10^{6})^2 = 9{,}8134$ m/s²; al contrario
  $9{,}81 \cdot (6{,}37 \cdot 10^{6})^2/6{,}67 \cdot 10^{-11} = 5{,}968 \cdot 10^{24}$ kg;
- esempio 4: $6{,}67 \cdot 10^{-11} \cdot 7{,}35 \cdot 10^{22}/(1{,}74 \cdot 10^{6})^2 = 1{,}6193$ m/s²; $120 \cdot 1{,}62 =
  194{,}4$ N; $120 \cdot 9{,}8 = 1176$ N;
- la Luna: $3{,}84 \cdot 10^{8}/6{,}37 \cdot 10^{6} = 60{,}28$; $9{,}81/3600 = 2{,}725 \cdot 10^{-3}$; $27{,}3 \cdot 86\,400 =
  2{,}3587 \cdot 10^{6}$ s; $4\pi^2 \cdot 3{,}84 \cdot 10^{8}/(2{,}36 \cdot 10^{6})^2 = 2{,}722 \cdot 10^{-3}$ m/s²;
- esempio 5: $\sqrt{7{,}35 \cdot 10^{22}/5{,}97 \cdot 10^{24}} = 0{,}11096$; $3{,}84 \cdot 10^{8}/1{,}1110 = 3{,}4563 \cdot 10^{8}$
  m; $M_T/M_L = 81{,}2$;
- controllo incrociato con la 93: $4\pi^2/(G\,M_S) = 2{,}974 \cdot 10^{-19}$ s²/m³, contro $2{,}975 \cdot 10^{-19}$ dai dati
  dell'orbita terrestre;
- grafico: punti $(1{,}3;\ 4)$, $(2{,}6;\ 1)$, $(3{,}9;\ 0{,}444)$, $(5{,}2;\ 0{,}25)$ con $1{,}3$ cm per $r_0$ e 4 cm per
  $F_0$.

`check.mts` passa senza errori; gli avvisi rimasti sono nel rapporto.

## Struttura ed esempi

L'apertura (la mela e la Luna, i *Principia*); dalle leggi di Keplero alla forza, per un'orbita circolare; la legge con
$G$, la figura delle due sfere, le quattro proprietà, le sfere omogenee, l'avviso su $G$ e $g$, l'esempio 1 (due
persone); la dipendenza dalla distanza con il grafico, l'interattiva, l'esempio 2 (Terra e Luna, con la conversione dei
kilometri e il conto delle potenze di dieci) e l'avviso su centri, metri e quadrato; la bilancia di Cavendish con la
figura e l'esempio 3; $g$ dalla legge, la massa della Terra, l'esempio 4 (la Luna) e la verifica di Newton sulla Luna;
massa inerziale e gravitazionale; più corpi e l'esempio 5 (il punto tra Terra e Luna) con la figura.

## Scelte

- Confine con la 93: qui le leggi di Keplero si usano. Il passaggio dalla terza legge alla forza $\propto m/r^2$ è la
  dimostrazione che i libri danno in questo capitolo, nel verso Keplero-Newton; il verso opposto (da Newton alla terza
  legge, con $K = 4\pi^2/(G M)$) resta alla 96.
- Confine con la 95: qui $g$ solo sulla superficie di un corpo celeste ($g = G M/R^2$). La variazione con la quota, il
  vettore $\vec g$ e l'interno della sfera sono della 95, a cui rimanda una riga. Il teorema del guscio è enunciato in
  due righe, perché serve per usare la distanza tra i centri.
- Confine con la 96 e la 97: niente velocità orbitale, niente energia potenziale.
- "La Luna cade come la mela" riprende in dieci righe la nota della lezione 57 del biennio, con gli stessi dati, perché
  qui è il controllo della legge.
- Nel risultato di $g$ scrivo $9{,}81\,\text{m/s}^2$: con le costanti del README viene $9{,}813$, e la terza cifra qui
  serve (il README la ammette "dove serve la terza cifra, e lo si dice").
- Massa inerziale $m_i$ e gravitazionale $m_g$: simboli usati solo in quella sezione.
- Le forze sulla sonda dell'esempio 5 si chiamano $\vec F_T$ e $\vec F_L$; le due forze della coppia $\vec F_1$ e
  $\vec F_2$.
- Più di due corpi: solo il caso allineato ha un esempio; il caso nel piano è detto in una riga, con il link alla somma
  di vettori.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `gravitazione-due-sfere-forze`,
`forza-gravitazionale-distanza-grafico` (con la riga `% poi-interattivo`), `bilancia-torsione-cavendish` (vista
dall'alto; le frecce curve danno il verso di rotazione, orario), `punto-equilibrio-terra-luna` (la sonda a nove decimi,
6,3 cm su 7).

Interattiva, registrata sotto il commento del gruppo 36:

- `gravitazione-due-masse` (`fisica/GravitazioneDueMasse.tsx`). Domanda: che cosa succede alle due frecce se raddoppi
  la distanza? E se raddoppi una sola massa? Masse da 1 a $2 \cdot 10^{24}$ kg, distanza da 1 a $3 \cdot 10^{8}$ m; le
  frecce sono in scala ($1{,}1$ cm ogni $6{,}67 \cdot 10^{21}$ N) e disegnate una sopra e una sotto la retta dei centri,
  perché con la forza massima si incrociano. Le masse non arrivano a 3 perché la forza cambierebbe di un fattore 81 e
  le frecce più corte non si vedrebbero.

## Esercizio guidato

L'esempio 5 (il punto tra Terra e Luna) renderebbe di più come esercizio guidato: si fermerebbe a chiedere le due
distanze in funzione di $x$, poi che cosa si semplifica nell'uguaglianza delle forze, poi il valore di
$\sqrt{M_L/M_T}$ prima del risultato.

## Esercizi

Generatore `fis-gravitazione-universale`, sei livelli (specifica in `specs/exercises/fis-gravitazione-universale.md`),
con la scena `masse-allineate` al livello 6.

## Da verificare

- Newton, *Principia*, 1687. Cavendish, 1798; il suo valore di $G$ entro l'$1\%$ da quello di oggi.
- Apparato di Cavendish: sfera grande $158$ kg, sfera piccola $0{,}730$ kg, distanza tra i centri $0{,}225$ m.
- Luna: massa $7{,}35 \cdot 10^{22}$ kg, raggio $1{,}74 \cdot 10^{6}$ m, distanza media $3{,}84 \cdot 10^{8}$ m, periodo
  $27{,}3$ d. Non sono nel README.
- "Una parte su mille miliardi e oltre" per l'uguaglianza tra massa inerziale e gravitazionale (esperimenti con la
  bilancia di torsione e in orbita): ordine di grandezza a memoria.
- "Il peso di un granello di sabbia" per $3{,}3 \cdot 10^{-7}$ N (una massa di $0{,}03$ mg): paragone indicativo.

## Domande per Andrea

- Il passaggio da Keplero alla forza è fatto per l'orbita circolare e con il terzo principio per la massa del Sole. Va
  bene così, o preferisci enunciare la legge e basta?
- La "Luna che cade" ripete la nota della lezione 57: la togliamo da una delle due?
- Massa inerziale e gravitazionale: basta l'argomento della caduta libera, o serve anche il pendolo di Newton?
- $g = 9{,}81\,\text{m/s}^2$ nel risultato del conto, mentre il resto della fisica usa $9{,}8$: va bene tenerlo qui?
- L'esempio 5 chiede di risolvere $(D - x)/x = k$: è al livello giusto, o è meglio un esempio con tre masse allineate e
  la somma delle due forze?

Prerequisiti proposti: fis-leggi-keplero, fis-forza-centripeta, fis-terzo-principio, fis-forza-peso
