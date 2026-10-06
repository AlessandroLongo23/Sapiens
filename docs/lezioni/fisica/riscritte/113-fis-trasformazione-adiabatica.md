# La trasformazione adiabatica

Gonfiando in fretta la ruota di una bicicletta, il fondo della pompa diventa caldo. Tenendo premuto a lungo il tasto di una bomboletta spray, la bomboletta si raffredda nella mano. In tutti e due i casi il gas cambia temperatura senza che nessuno lo scaldi o lo raffreddi: l'aria della pompa viene compressa così in fretta che non ha il tempo di cedere calore, e il gas della bomboletta si espande altrettanto in fretta. Sono trasformazioni adiabatiche, e la variazione di temperatura viene tutta dal lavoro.

## Una trasformazione senza scambi di calore

Una trasformazione è **adiabatica** quando il sistema non scambia calore con l'ambiente:

$$Q = 0$$

Si ottiene in due modi. Il primo è chiudere il gas in un recipiente con pareti isolanti, come quelle di un thermos. Il secondo è fare in fretta: il calore ci mette del tempo a passare attraverso una parete, e una compressione che dura una frazione di secondo finisce prima che il gas abbia ceduto una quantità apprezzabile di calore. Le compressioni nei cilindri di un motore, quelle dell'aria in un'onda sonora e l'espansione dell'aria che sale in atmosfera sono adiabatiche per questo secondo motivo.

Per il [primo principio della termodinamica](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-primo-principio-della-termodinamica), $\Delta U = Q - W$ con $Q = 0$:

$$\Delta U = -W$$

Il gas può compiere lavoro solo a spese della propria energia interna. Se si espande, $W$ è positivo, l'energia interna diminuisce e il gas si raffredda. Se viene compresso, $W$ è negativo, l'energia interna aumenta e il gas si scalda.

```tikz
% nome: adiabatica-espansione-compressione
% alt: Due cilindri con le pareti isolanti, disegnate come una fascia grigia spessa. A sinistra il gas si espande: il pistone sale dalla posizione tratteggiata, il gas compie lavoro e la sua temperatura diminuisce. A destra il gas viene compresso: il pistone scende dalla posizione tratteggiata, il lavoro è fatto sul gas e la sua temperatura aumenta. In tutti e due i casi il calore scambiato Q è zero
\begin{tikzpicture}
\fill[gray!40] (-0.2,-0.2) rectangle (0,3.2);
\fill[gray!40] (2,-0.2) rectangle (2.2,3.2);
\fill[gray!40] (-0.2,-0.2) rectangle (2.2,0);
\fill[blue!10] (0,0) rectangle (2,2.2);
\draw[thick, fill=gray!20] (0.02,2.2) rectangle (1.98,2.45);
\draw[thick] (0.9,2.45) -- (0.9,3.5) (1.1,2.45) -- (1.1,3.5);
\draw[thick] (0,3.2) -- (0,0) -- (2,0) -- (2,3.2);
\draw[dashed, thin] (0,1.3) -- (2,1.3);
\draw[-{Stealth}, thick, red] (2.6,1.3) -- (2.6,2.2);
\node[right] at (2.65,1.75) {\small $W > 0$};
\node at (1,0.7) {\small $T$ scende};
\node[below] at (1,-0.3) {\small espansione};
\node[below] at (1,-0.75) {\small $Q = 0$};
\begin{scope}[xshift=5.2cm]
\fill[gray!40] (-0.2,-0.2) rectangle (0,3.2);
\fill[gray!40] (2,-0.2) rectangle (2.2,3.2);
\fill[gray!40] (-0.2,-0.2) rectangle (2.2,0);
\fill[red!15] (0,0) rectangle (2,1.3);
\draw[thick, fill=gray!20] (0.02,1.3) rectangle (1.98,1.55);
\draw[thick] (0.9,1.55) -- (0.9,3.5) (1.1,1.55) -- (1.1,3.5);
\draw[thick] (0,3.2) -- (0,0) -- (2,0) -- (2,3.2);
\draw[dashed, thin] (0,2.2) -- (2,2.2);
\draw[-{Stealth}, thick, red] (2.6,2.2) -- (2.6,1.3);
\node[right] at (2.65,1.75) {\small $W < 0$};
\node at (1,0.65) {\small $T$ sale};
\node[below] at (1,-0.3) {\small compressione};
\node[below] at (1,-0.75) {\small $Q = 0$};
\end{scope}
\end{tikzpicture}
```

La variazione di energia interna di un gas perfetto è $\Delta U = n\,C_V\,\Delta T$ in ogni trasformazione, come mostra la lezione sui [calori molari](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/i-calori-molari-dei-gas). In un'adiabatica tra lo stato iniziale $A$ e lo stato finale $B$ il lavoro è quindi

$$W = -\Delta U = -n\,C_V\,(T_B - T_A) = n\,C_V\,(T_A - T_B)$$

con $C_V = \tfrac{3}{2} R$ per un gas monoatomico e $C_V = \tfrac{5}{2} R$ per un gas biatomico.

```ad-example
Esempio 1: il lavoro dalla temperatura
In un cilindro con le pareti isolanti $1{,}20\,\text{mol}$ di argon si espandono, e la temperatura scende da $400\,\text{K}$ a $310\,\text{K}$. Quanto lavoro compie il gas?

L'argon è monoatomico, $C_V = \tfrac{3}{2} R$, e la trasformazione è adiabatica:

$$W = n\,C_V\,(T_A - T_B) = 1{,}20\,\text{mol} \cdot \frac{3}{2} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)} \cdot (400 - 310)\,\text{K} = 1346{,}2\ldots\,\text{J} \approx 1{,}35 \cdot 10^3\,\text{J}$$

Il lavoro è positivo: il gas si espande. La sua energia interna è diminuita della stessa quantità, $\Delta U = -1{,}35 \cdot 10^3\,\text{J}$.
```

```ad-warning
Adiabatica non vuol dire a temperatura costante
"Senza scambi di calore" e "senza variazioni di temperatura" sono due cose diverse. Nell'adiabatica è il calore a essere zero, e la temperatura cambia; nell'isoterma è la temperatura a restare costante, e per tenerla costante il gas deve scambiare calore.
```

## La legge dell'adiabatica

In un'adiabatica cambiano tutte e tre le variabili di stato: pressione, volume e temperatura. Se la trasformazione è quasistatica, cioè abbastanza lenta da far passare il gas per stati di equilibrio, pressione e volume sono legati dalla **legge di Poisson**:

$$p\,V^\gamma = \text{costante} \qquad\qquad p_A\,V_A^{\,\gamma} = p_B\,V_B^{\,\gamma}$$

L'esponente è il rapporto $\gamma = C_p / C_V$ tra i calori molari: $\tfrac{5}{3} \approx 1{,}67$ per un gas monoatomico, $\tfrac{7}{5} = 1{,}40$ per un gas biatomico come l'aria. La legge si ricava dal primo principio e dall'equazione di stato, ma la dimostrazione segue la trasformazione per passi piccolissimi e chiede strumenti di matematica del quinto anno: qui la enunciamo.

"In fretta" e "quasistatica" non si contraddicono. Le molecole di un gas si muovono a centinaia di metri al secondo, e la pressione torna uniforme in un tempo brevissimo; il calore attraversa le pareti molto più lentamente. Un pistone che si muove a qualche metro al secondo è lento per la pressione e veloce per il calore.

Le potenze con esponente non intero si calcolano con il tasto $x^y$ della calcolatrice; il loro significato è nella lezione sulle [potenze con esponente razionale](/materiale/scuola-superiore/matematica/numeri-reali-e-radicali/potenze-con-esponente-razionale). Per trovare la pressione finale conviene scrivere la legge con il rapporto dei volumi:

$$p_B = p_A \left( \frac{V_A}{V_B} \right)^{\gamma}$$

In questa forma le unità di misura del volume si semplificano nel rapporto, e la pressione finale esce nell'unità di quella iniziale: litri e atmosfere vanno bene.

### Con la temperatura

Dall'[equazione di stato](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/l-equazione-di-stato-del-gas-perfetto) la pressione è $p = nRT / V$. Sostituendola nella legge di Poisson:

$$\frac{nRT}{V}\,V^\gamma = nR\,T\,V^{\gamma - 1} = \text{costante}$$

e poiché $nR$ non cambia,

$$T\,V^{\gamma - 1} = \text{costante} \qquad\qquad T_B = T_A \left( \frac{V_A}{V_B} \right)^{\gamma - 1}$$

L'esponente $\gamma - 1$ vale $\tfrac{2}{3}$ per un gas monoatomico e $0{,}40$ per uno biatomico. Sostituendo invece il volume, $V = nRT / p$, si ottiene la terza forma, che lega temperatura e pressione:

$$T^{\gamma}\,p^{\,1 - \gamma} = \text{costante}$$

```ad-example
Esempio 2: la pompa della bicicletta
Una pompa contiene $0{,}600\,\text{L}$ d'aria a $1{,}00\,\text{atm}$ e a $293\,\text{K}$. Con il foro chiuso, il pistone viene spinto rapidamente fino a ridurre il volume a $0{,}200\,\text{L}$. Quali sono la pressione e la temperatura finali?

La compressione è rapida, quindi adiabatica; l'aria è biatomica, $\gamma = 1{,}40$. Il rapporto dei volumi è $V_A / V_B = 0{,}600 / 0{,}200 = 3{,}00$.

$$p_B = p_A \left( \frac{V_A}{V_B} \right)^{\gamma} = 1{,}00\,\text{atm} \cdot 3{,}00^{1{,}40} = 1{,}00\,\text{atm} \cdot 4{,}655\ldots \approx 4{,}66\,\text{atm}$$

$$T_B = T_A \left( \frac{V_A}{V_B} \right)^{\gamma - 1} = 293\,\text{K} \cdot 3{,}00^{0{,}40} = 293\,\text{K} \cdot 1{,}551\ldots \approx 455\,\text{K}$$

L'aria arriva a $182\,^\circ\text{C}$. Se la compressione fosse stata lenta, a temperatura costante, la legge di Boyle avrebbe dato $3{,}00\,\text{atm}$: l'adiabatica porta a una pressione più alta, perché il gas nel frattempo si è scaldato. In una pompa vera il metallo porta via presto il calore, e resta solo il tepore che si sente con la mano.
```

```ad-warning
Le temperature vanno in kelvin
In $T\,V^{\gamma - 1} = \text{costante}$ la temperatura è quella assoluta. Una temperatura data in gradi Celsius si converte in kelvin prima del conto, e alla fine, se serve, si torna ai gradi Celsius. Usare i gradi Celsius nella formula dà un risultato sbagliato, come mostra l'esempio 3.
```

```ad-example
Esempio 3: il motore Diesel
Nel cilindro di un motore Diesel l'aria entra a $27\,^\circ\text{C}$ e viene compressa adiabaticamente fino a un volume $18{,}0$ volte più piccolo. A quale temperatura arriva?

In kelvin, $T_A = 27 + 273 = 300\,\text{K}$. Con $\gamma - 1 = 0{,}40$ e $V_A / V_B = 18{,}0$:

$$T_B = T_A \left( \frac{V_A}{V_B} \right)^{\gamma - 1} = 300\,\text{K} \cdot 18{,}0^{0{,}40} = 300\,\text{K} \cdot 3{,}177\ldots \approx 953\,\text{K}$$

cioè $953 - 273 = 680\,^\circ\text{C}$. A questa temperatura il gasolio spruzzato nel cilindro si accende da solo: il motore Diesel non ha candele. Con i gradi Celsius nella formula si troverebbe $27 \cdot 3{,}18 \approx 86\,^\circ\text{C}$, un valore sbagliato di quasi seicento gradi.
```

## Adiabatica e isoterma a confronto

Nel piano pressione-volume l'isoterma è il ramo di iperbole $p\,V = \text{costante}$ della [legge di Boyle](/materiale/scuola-superiore/fisica/la-temperatura-e-i-gas/la-legge-di-boyle). L'adiabatica $p\,V^\gamma = \text{costante}$ le somiglia, ma poiché $\gamma$ è maggiore di 1 scende più in fretta: in ogni punto del piano l'adiabatica che passa di lì è più ripida dell'isoterma che passa per lo stesso punto.

Il motivo fisico è la temperatura. Partendo dallo stesso stato $A$ e raddoppiando il volume, lungo l'isoterma la pressione si dimezza e nient'altro cambia. Lungo l'adiabatica il gas intanto si raffredda, e la pressione scende anche per questo: il punto di arrivo $C$ sta sotto il punto $B$ dell'isoterma, su un'isoterma di temperatura più bassa. In una compressione succede il contrario, e l'adiabatica passa sopra l'isoterma.

```tikz
% nome: adiabatica-isoterma-piano-pv
% alt: Piano pressione-volume. Dallo stato A partono due curve che scendono verso destra: l'isoterma, un ramo di iperbole che arriva al punto B, e l'adiabatica, più ripida, che arriva al punto C, più in basso di B allo stesso volume. Una seconda isoterma, tratteggiata e più vicina agli assi, passa per C: è quella della temperatura finale dell'adiabatica, più bassa. A sinistra di A, verso i volumi piccoli, l'adiabatica sta sopra l'isoterma
% poi-interattivo: trascinare il punto lungo le due curve e leggere pressione e temperatura
\begin{tikzpicture}
\draw[gray!25, very thin] (0,0) grid (5,5);
\draw[->] (0,0) -- (5.4,0);
\node[below] at (5.3,-0.05) {$V$};
\draw[->] (0,0) -- (0,5.4) node[above] {$p$};
\draw[thin, dashed, blue!60, domain=0.6:5, samples=60, smooth] plot (\x, {2.268/\x});
\draw[thick, blue!60, domain=0.72:5, samples=60, smooth] plot (\x, {3.6/\x});
\draw[thick, red!80!black, domain=0.8:5, samples=60, smooth] plot (\x, {3.6/exp(1.6667*ln(\x))});
\draw[dashed, thin] (1,0) -- (1,3.6);
\draw[dashed, thin] (2,0) -- (2,1.8);
\fill (1,3.6) circle (0.06) node[above right] {$A$};
\fill (2,1.8) circle (0.06) node[above right] {$B$};
\fill (2,1.134) circle (0.06) node[below left] {$C$};
\node[below] at (1,0) {\small $V_A$};
\node[below] at (2,0) {\small $2V_A$};
\node[right, blue!60] at (5,0.85) {\small isoterma};
\node[right, red!80!black] at (5,0.2) {\small adiabatica};
\end{tikzpicture}
```

Nella figura qui sotto un gas parte dallo stato $A$, a $2{,}0\,\text{atm}$, $1{,}0\,\text{L}$ e $300\,\text{K}$. Sposta il pistone e confronta le due curve: a parità di volume, leggi la pressione lungo l'isoterma e lungo l'adiabatica, e la temperatura a cui arriva il gas isolato.

```interattivo
% nome: adiabatica-isoterma-pistone
% alt: Un cilindro orizzontale con le pareti isolanti, chiuso da un pistone che si sposta con un cursore o trascinandolo, e sopra il piano pressione-volume con due curve che passano per lo stato iniziale A, a 2,0 atmosfere e 1,0 litri: l'isoterma a 300 kelvin e l'adiabatica, più ripida. Il volume va da 0,5 a 4,0 litri; un punto scorre su ciascuna curva e il colore del gas nel cilindro passa dal blu al rosso quando la temperatura sale. Un selettore sceglie se il gas è monoatomico o biatomico. Sotto sono scritte la pressione lungo l'isoterma, la pressione lungo l'adiabatica e la temperatura lungo l'adiabatica
```

Raddoppiando il volume, lungo l'isoterma la pressione scende a $1{,}0\,\text{atm}$ e la temperatura resta $300\,\text{K}$. Lungo l'adiabatica un gas monoatomico scende a $0{,}63\,\text{atm}$ e a $189\,\text{K}$; un gas biatomico, che ha $\gamma$ più piccolo, a $0{,}76\,\text{atm}$ e a $227\,\text{K}$. Più grande è $\gamma$, più l'adiabatica si stacca dall'isoterma.

```ad-warning
La legge di Boyle qui non vale
$p_A\,V_A = p_B\,V_B$ vale solo a temperatura costante. In un'adiabatica il prodotto $p\,V$ cambia, perché cambia la temperatura: diminuisce nelle espansioni e aumenta nelle compressioni. Se il testo dice "isolato", "rapidamente" o "senza scambi di calore", la legge è $p\,V^\gamma = \text{costante}$.
```

## Il lavoro in funzione di pressione e volume

Il lavoro di un'adiabatica si può scrivere anche senza le temperature. Dall'equazione di stato, $nRT_A = p_A V_A$ e $nRT_B = p_B V_B$; inoltre $\gamma - 1 = (C_p - C_V) / C_V = R / C_V$, cioè $C_V = R / (\gamma - 1)$. Sostituendo in $W = n\,C_V\,(T_A - T_B)$:

$$W = \frac{nR\,(T_A - T_B)}{\gamma - 1} = \frac{p_A V_A - p_B V_B}{\gamma - 1}$$

Con le pressioni in pascal e i volumi in metri cubi il lavoro esce in joule. Come per ogni trasformazione, il [lavoro](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-lavoro-in-una-trasformazione-termodinamica) è l'area sotto la curva nel piano pressione-volume. In un'espansione dallo stesso stato e fino allo stesso volume l'adiabatica sta sotto l'isoterma, e il lavoro adiabatico è più piccolo di quello isotermo: il gas isolato può contare solo sulla propria energia interna, quello a temperatura costante riceve calore dall'esterno mentre si espande.

```ad-example
Esempio 4: un'espansione adiabatica completa
In un cilindro isolato $0{,}400\,\text{mol}$ di elio occupano $2{,}50\,\text{L}$ alla pressione di $4{,}00 \cdot 10^5\,\text{Pa}$. Il gas si espande adiabaticamente fino a $5{,}00\,\text{L}$. Trova la pressione finale, il lavoro compiuto e le temperature iniziale e finale.

L'elio è monoatomico, $\gamma = \tfrac{5}{3}$, e il volume raddoppia:

$$p_B = p_A \left( \frac{V_A}{V_B} \right)^{\gamma} = 4{,}00 \cdot 10^5\,\text{Pa} \cdot \left( \frac{1}{2} \right)^{5/3} = \frac{4{,}00 \cdot 10^5\,\text{Pa}}{3{,}174\ldots} \approx 1{,}26 \cdot 10^5\,\text{Pa}$$

Per il lavoro servono i prodotti $p\,V$, con i volumi in metri cubi ($1\,\text{L} = 10^{-3}\,\text{m}^3$):

$$p_A V_A = 4{,}00 \cdot 10^5\,\text{Pa} \cdot 2{,}50 \cdot 10^{-3}\,\text{m}^3 = 1000\,\text{J} \qquad p_B V_B = 1{,}26 \cdot 10^5\,\text{Pa} \cdot 5{,}00 \cdot 10^{-3}\,\text{m}^3 = 630\,\text{J}$$

$$W = \frac{p_A V_A - p_B V_B}{\gamma - 1} = \frac{1000\,\text{J} - 630\,\text{J}}{2/3} = 555\,\text{J}$$

Le temperature vengono dall'equazione di stato:

$$T_A = \frac{p_A V_A}{nR} = \frac{1000\,\text{J}}{0{,}400\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)}} \approx 301\,\text{K} \qquad T_B = \frac{p_B V_B}{nR} = \frac{630\,\text{J}}{0{,}400\,\text{mol} \cdot 8{,}31\,\text{J/(mol}\cdot\text{K)}} \approx 190\,\text{K}$$

Controllo con le temperature: $W = n\,C_V\,(T_A - T_B) = 0{,}400 \cdot \tfrac{3}{2} \cdot 8{,}31 \cdot (301 - 190)\,\text{J} \approx 553\,\text{J}$, uguale a meno degli arrotondamenti.

Se la stessa espansione fosse avvenuta a temperatura costante il gas avrebbe compiuto il [lavoro dell'isoterma](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/le-trasformazioni-isocora-isobara-e-isoterma), $W = nRT \ln(V_B / V_A) = 1000\,\text{J} \cdot \ln 2 \approx 693\,\text{J}$: di più, come dice il confronto tra le aree.
```

```tikz
% nome: lavoro-adiabatica-isoterma-aree
% alt: Piano pressione-volume con i dati dell'esempio 4. Dallo stato A, a 2,50 litri e 4,00 per 10 alla quinta pascal, l'adiabatica scende fino a 5,00 litri e l'isoterma, sopra di lei, arriva allo stesso volume. L'area sotto l'adiabatica è colorata e vale 555 joule; la striscia tra le due curve, di un altro colore, è il lavoro in più dell'isoterma, che in tutto compie 693 joule
\begin{tikzpicture}
\fill[orange!25] (1.5,0) -- plot[domain=1.5:3, samples=40, smooth] (\x, {4*exp(1.6667*ln(1.5/\x))}) -- (3,0) -- cycle;
\fill[blue!10] plot[domain=1.5:3, samples=40, smooth] (\x, {6/\x}) -- plot[domain=3:1.5, samples=40, smooth] (\x, {4*exp(1.6667*ln(1.5/\x))}) -- cycle;
\draw[gray!25, very thin] (0,0) grid (4,5);
\draw[->] (0,0) -- (4.4,0);
\node[below] at (4.3,-0.35) {$V$ (L)};
\draw[->] (0,0) -- (0,5.4) node[above] {$p$ ($10^5$ Pa)};
\foreach \x/\t in {1.5/2{,}50, 3/5{,}00} \node[below] at (\x,0) {\small $\t$};
\foreach \y in {1,2,3,4} \node[left] at (0,\y) {\small $\y$};
\draw[thick, blue!60, domain=1.3:3.3, samples=60, smooth] plot (\x, {6/\x});
\draw[thick, red!80!black, domain=1.35:3.3, samples=60, smooth] plot (\x, {4*exp(1.6667*ln(1.5/\x))});
\draw[dashed, thin] (1.5,0) -- (1.5,4);
\draw[dashed, thin] (3,0) -- (3,2);
\fill (1.5,4) circle (0.06) node[above right] {$A$};
\fill (3,1.26) circle (0.06);
\fill (3,2) circle (0.06);
\node at (2.2,0.8) {\small $555$ J};
\node[right, blue!60] at (3.3,1.85) {\small isoterma};
\node[right, red!80!black] at (3.3,1.0) {\small adiabatica};
\end{tikzpicture}
```

```ad-warning
Il segno del lavoro
In un'espansione adiabatica il lavoro è positivo e la temperatura scende; in una compressione il lavoro è negativo e la temperatura sale. Se in un conto il gas si espande, compie lavoro positivo e si scalda, c'è un errore di segno: di solito $T_B - T_A$ scritto al posto di $T_A - T_B$.
```

## Le quattro trasformazioni

Con l'adiabatica l'elenco delle trasformazioni di un gas perfetto è completo. Le prime tre righe riprendono la lezione sulle [trasformazioni isocora, isobara e isoterma](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/le-trasformazioni-isocora-isobara-e-isoterma).

| Trasformazione | Resta costante | $Q$ | $W$ | $\Delta U$ |
|---|---|---|---|---|
| isocora | $V$ | $n\,C_V\,\Delta T$ | $0$ | $n\,C_V\,\Delta T$ |
| isobara | $p$ | $n\,C_p\,\Delta T$ | $p\,\Delta V$ | $n\,C_V\,\Delta T$ |
| isoterma | $T$ | $W$ | $nRT \ln \dfrac{V_B}{V_A}$ | $0$ |
| adiabatica | $p\,V^\gamma$ | $0$ | $-n\,C_V\,\Delta T$ | $n\,C_V\,\Delta T$ |

## Adiabatiche intorno a noi

Una massa d'aria umida che sale lungo il fianco di una montagna incontra una pressione sempre più bassa e si espande. L'aria conduce male il calore, e l'espansione è adiabatica: salendo dal livello del mare, a $20\,^\circ\text{C}$, fino a dove la pressione è $0{,}80\,\text{atm}$, a circa duemila metri, la terza forma della legge dà una temperatura finale di circa $2\,^\circ\text{C}$. A quella temperatura il vapore d'acqua condensa in goccioline, e si forma una nuvola.

Il gas che esce da una bomboletta o da una bombola di anidride carbonica si espande adiabaticamente e si raffredda fino a coprire di brina l'ugello. Nel motore di un'automobile la miscela viene compressa adiabaticamente prima dell'accensione, e i gas caldi si espandono adiabaticamente dopo lo scoppio. Anche il [ciclo di Carnot](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/il-teorema-di-carnot-e-il-ciclo-di-carnot), il ciclo ideale delle macchine termiche, è fatto di due isoterme e due adiabatiche.

```ad-note
L'espansione libera è un'altra cosa
Un gas che si espande nel vuoto dentro un recipiente isolato, come nell'esperienza di Joule della lezione sull'[energia interna](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/l-energia-interna), non scambia calore e non compie lavoro: $Q = 0$ e $W = 0$, quindi la temperatura di un gas perfetto non cambia. È adiabatica, ma non è quasistatica, e la legge $p\,V^\gamma = \text{costante}$ non si applica: pressione e volume finali sono legati dalla legge di Boyle.
```
