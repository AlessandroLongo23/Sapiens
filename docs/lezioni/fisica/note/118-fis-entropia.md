# Note: L'entropia

Lezione nuova (lotto del terzo anno di fisica, gruppo 44, 6 ottobre 2026). Conti rifatti in Python con i dati come
sono scritti nella lezione:

- esempio 1: $3{,}34 \cdot 10^5 \cdot 0{,}250 = 83\,500$ J, $/273 = 305{,}86$ J/K;
- esempio 2: $\ln 3 = 1{,}0986$, $2{,}00 \cdot 8{,}31 \cdot 300 \cdot \ln 3 = 5477{,}7$ J, $2{,}00 \cdot 8{,}31 \cdot \ln 3 = 18{,}259$ J/K;
  figura: $p_A = 2{,}00 \cdot 8{,}31 \cdot 300 / 0{,}0100 = 4{,}986 \cdot 10^5$ Pa, $p_B = 1{,}662 \cdot 10^5$ Pa (con 1,5 cm
  ogni 10 L e 0,8 cm ogni $10^5$ Pa la curva è $y = 5{,}983/x$, $A = (1{,}5;\,3{,}989)$, $B = (4{,}5;\,1{,}330)$);
- esempio 3: $\ln(363/293) = 0{,}21423$, $0{,}500 \cdot 4186 \cdot 0{,}21423 = 448{,}38$ J/K; controllo
  $4186 \cdot 0{,}500 \cdot 70 = 146\,510$ J, $/328 = 446{,}7$ J/K;
- esempio 4: $1200/400 = 3{,}00$, $1200/300 = 4{,}00$, differenza $1{,}00$ J/K; testo dopo l'interattiva:
  $1200/340 - 1200/350 = 0{,}1008$ J/K;
- avviso sul congelatore: $83\,500/255 = 327{,}45$ J/K, $327{,}45 - 305{,}86 = 21{,}6$ J/K;
- esempio 5: $1400/300 = 4{,}667$, $2000/500 = 4{,}000$, differenza $0{,}667$ J/K; $1 - 300/500 = 0{,}400$,
  $0{,}400 \cdot 2000 = 800$ J; $300 \cdot 0{,}667 = 200$ J.

`check.mts`: 0 errori. Un avviso sul formulario ("titolo con maiuscole all'inglese: Disuguaglianza di Clausius"): è il
nome proprio.

## Struttura ed esempi

Il verso delle trasformazioni spontanee; dai rapporti $Q/T$ della macchina di Carnot alla disuguaglianza di Clausius
(enunciata); la definizione di $\Delta S$ a temperatura costante e come somma, il segno del calore, l'unità, perché è
una funzione di stato (il ragionamento del ciclo fatto con due trasformazioni reversibili); i passaggi di stato
(esempio 1); l'isoterma del gas perfetto (esempio 2, con il grafico pressione-volume); l'espansione libera tra gli
stessi stati e l'avviso su $Q/T$ nelle trasformazioni irreversibili; adiabatica reversibile e ciclo in due righe; il
corpo che si scalda, con la formula enunciata (esempio 3); l'entropia dell'universo con le due sorgenti (esempio 4,
figura, barre, interattiva); il secondo principio con l'entropia, l'avviso sull'entropia di un sistema che può
diminuire; la macchina reale (esempio 5) e il lavoro perduto $T_f\,\Delta S_{univ}$.

## Scelte

- Simboli del README: $S$ in J/K, $\Delta S = Q/T$. Qui $Q$ ha il segno del primo principio (positivo se assorbito),
  mentre $Q_c$ e $Q_f$ restano in valore assoluto come nelle lezioni 114-117: la lezione lo dice nel punto in cui
  passa da una convenzione all'altra ($Q_1 = +Q_c$, $Q_2 = -Q_f$).
- La disuguaglianza di Clausius è enunciata, come chiede il brief, ma il caso con due sorgenti è ricavato dal teorema
  di Carnot in quattro righe, perché è da lì che viene l'idea di dividere il calore per la temperatura.
- Che l'entropia sia una funzione di stato è argomentato (ciclo fatto di due trasformazioni reversibili), non solo
  affermato: è un ragionamento che i libri del terzo anno danno.
- $\Delta S = m\,c \ln(T_B/T_A)$ è enunciata dicendo che la somma chiede strumenti del quinto anno, con un controllo
  numerico ($Q$ diviso per la temperatura media). È un "caso semplice" che l'Amaldi dà, da verificare.
- Confine con la 119: niente microstati e niente "disordine" qui; l'ultima riga rimanda alla 119. Il lavoro perduto
  e il "degrado dell'energia" stanno qui, in fondo, perché si ricavano dal conto dell'esempio 5.
- Nell'esempio 5 il risultato è $0{,}67$ J/K (due decimali, come i termini della differenza) e nel passaggio
  successivo si usa $0{,}667$ dicendolo.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `isoterma-espansione-entropia` (grafico pressione-volume con assi,
griglia, `plot` e l'area del lavoro), `espansione-libera-e-isoterma` (i due modi di andare dallo stesso stato iniziale
allo stesso stato finale), `calore-due-sorgenti-entropia`, `barre-entropia-due-sorgenti` (0,5 cm ogni J/K).

Interattiva `entropia-universo-due-sorgenti` (`fisica/EntropiaDueSorgenti.tsx`, registrata sotto il commento del
gruppo 44): risponde a "che cosa succede all'entropia dell'universo quando le due temperature si avvicinano? E se il
calore andasse dal freddo al caldo?". Due cursori per le temperature (da 250 a 600 K), $Q = 1200$ J fisso come
nell'esempio 4, un selettore per il verso del calore; tre barre con il segno. Guardata in chiaro, in scuro, da
telefono, agli estremi, con le temperature uguali e con il verso invertito.

## Esempio per l'esercizio guidato

L'esempio 5 (la macchina reale). Si fermerebbe in tre punti: (1) "quanto calore cede la macchina alla sorgente
fredda?"; (2) "quale delle due sorgenti perde entropia, e quale ne guadagna?"; (3) "il risultato può essere negativo?
Che cosa vorrebbe dire?".

## Esercizi

Generatore `fis-entropia`, sei livelli (specifica in `specs/exercises/fis-entropia.md`): Una sorgente che scambia
calore, L'entropia in un passaggio di stato, Un gas a temperatura costante, Un corpo che si scalda o si raffredda,
L'entropia dell'universo, Una macchina reale. Scena nuova `sorgenti-calore` al livello 5, `macchina-termica` del
gruppo 43 al livello 6.

## Da verificare

- $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$, $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$, $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$,
  $0\,^\circ\text{C} = 273\,\text{K}$: i valori del README e delle lezioni 67 e 70.
- Il lavoro dell'isoterma $W = n\,R\,T \ln(V_B/V_A)$ è preso dalla lezione 111 (gruppo 41), che non ho letto: se lì è
  scritto con le pressioni o con un altro nome per gli stati, il richiamo va allineato.
- Il nome "disuguaglianza di Clausius" e l'attribuzione: scritti a memoria.

## Domande per Andrea

- La formula del corpo che si scalda, $m\,c \ln(T_B/T_A)$, sta nella lezione (enunciata) o va tolta dal terzo anno?
  Da lei dipende il livello 4 degli esercizi.
- Il lavoro perduto $T_f\,\Delta S_{univ}$ e la frase sul degrado dell'energia: al livello giusto?
- Va bene scrivere sempre il più davanti alle variazioni positive nell'esempio 4 e negli esercizi?
- "Universo" per "sistema più ambiente": è la parola dell'Amaldi, o meglio "sistema isolato"?

Prerequisiti proposti: fis-ciclo-carnot, fis-trasformazioni-termodinamiche, fis-passaggi-stato, logaritmi-proprieta
