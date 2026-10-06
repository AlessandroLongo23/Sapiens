# Gli enunciati di Kelvin e di Clausius

Una tazza di tè bollente lasciata sul tavolo si raffredda fino alla temperatura della stanza. Non succede mai il contrario: nessuno ha visto un tè tiepido scaldarsi da solo raffreddando l'aria intorno. Una palla che rimbalza si ferma, e la sua energia finisce in energia interna del pavimento; nessun pavimento si è mai raffreddato per far ripartire una palla ferma. In tutti questi casi l'energia si conserverebbe in entrambi i versi, eppure la natura ne ammette uno solo. La legge che dice quale è il **secondo principio della termodinamica**.

## Il primo principio non dice tutto

Il [primo principio](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/il-primo-principio-della-termodinamica) è un bilancio: l'energia che un sistema guadagna è quella che qualcun altro perde. Non dice in che verso avvengono gli scambi.

```ad-example
Esempio 1: il tè che si raffredda
Una tazza contiene $0{,}25\,\text{kg}$ di tè, che ha il calore specifico dell'acqua, $4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$. Il tè passa da $80\,^\circ\text{C}$ a $20\,^\circ\text{C}$, la temperatura della stanza. Quanto calore cede? Il processo inverso violerebbe il primo principio?

Il [calore ceduto](/materiale/scuola-superiore/fisica/la-temperatura-e-il-calore/calore-capacita-termica-e-calore-specifico), in valore assoluto, è

$$Q = c\,m\,|\Delta t| = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)} \cdot 0{,}25\,\text{kg} \cdot 60\,^\circ\text{C} = 62\,790\,\text{J} \approx 6{,}3 \cdot 10^4\,\text{J}$$

Nel processo inverso l'aria della stanza cederebbe $6{,}3 \cdot 10^4\,\text{J}$ al tè, che tornerebbe a $80\,^\circ\text{C}$. Il bilancio dell'energia sarebbe in pari anche così: il primo principio non lo vieta. Eppure non accade.
```

Serve quindi una seconda legge, che scelga il verso. Ne esistono due formulazioni storiche, una di Rudolf Clausius (1850) e una di William Thomson, poi Lord Kelvin (1851). Parlano di cose diverse, il calore che passa tra due corpi e il calore che diventa lavoro, ma dicono la stessa cosa, come si dimostra più avanti.

## L'enunciato di Clausius

Il calore passa da solo dal corpo più caldo a quello più freddo. L'**enunciato di Clausius** trasforma questa osservazione in un divieto:

> È impossibile realizzare una trasformazione il cui unico risultato sia quello di far passare calore da un corpo più freddo a uno più caldo.

Le parole che contano sono "unico risultato". Un frigorifero fa passare calore dal suo interno, freddo, alla cucina, più calda: ma non è l'unica cosa che succede, perché intanto il motore assorbe lavoro dalla rete elettrica. Un [frigorifero](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/frigoriferi-e-pompe-di-calore) è una macchina termica che lavora al contrario: in ogni ciclo riceve il lavoro $W$, assorbe il calore $Q_f$ dalla sorgente fredda e cede alla sorgente calda il calore

$$Q_c = Q_f + W$$

Quello che Clausius vieta è il frigorifero che funziona senza spina: un dispositivo che sposta calore dal freddo al caldo con $W = 0$.

```tikz
% nome: clausius-frigorifero-dispositivo-vietato
% alt: Due schemi affiancati. A sinistra un frigorifero: una freccia sale dalla sorgente fredda alla macchina con 300 joule di calore, una freccia entra di lato con 100 joule di lavoro, una freccia più larga sale dalla macchina alla sorgente calda con 400 joule. A destra il dispositivo vietato da Clausius, disegnato tratteggiato: 300 joule salgono dalla sorgente fredda e gli stessi 300 joule arrivano alla sorgente calda, senza alcun lavoro
% svg: clausius-frigorifero-dispositivo-vietato-3605a226.svg 335x203
\begin{tikzpicture}
\draw[thick, fill=red!15] (-1.3,4) rectangle (1.3,4.7);
\node at (0,4.35) {\small sorgente calda};
\draw[thick, fill=blue!10] (-1.3,0) rectangle (1.3,0.7);
\node at (0,0.35) {\small sorgente fredda};
\draw[thin, fill=orange!25] (-0.188,0.7) -- (-0.188,1.4) -- (-0.338,1.4) -- (0,1.7) -- (0.338,1.4) -- (0.188,1.4) -- (0.188,0.7) -- cycle;
\draw[thin, fill=orange!25] (-0.25,3) -- (-0.25,3.7) -- (-0.4,3.7) -- (0,4) -- (0.4,3.7) -- (0.25,3.7) -- (0.25,3) -- cycle;
\draw[thin, fill=green!15] (2.2,2.413) -- (0.95,2.413) -- (0.95,2.562) -- (0.65,2.35) -- (0.95,2.138) -- (0.95,2.288) -- (2.2,2.288) -- cycle;
\draw[thick, fill=gray!20] (0,2.35) circle (0.65);
\node[left] at (-0.45,3.5) {\small $Q_c = 400$ J};
\node[left] at (-0.4,1.2) {\small $Q_f = 300$ J};
\node[above] at (1.65,2.55) {\small $W = 100$ J};
\node[below] at (0,-0.05) {\small frigorifero};
\draw[thick, fill=red!15] (3.7,4) rectangle (6.3,4.7);
\node at (5,4.35) {\small sorgente calda};
\draw[thick, fill=blue!10] (3.7,0) rectangle (6.3,0.7);
\node at (5,0.35) {\small sorgente fredda};
\draw[thin, fill=orange!25] (4.812,0.7) -- (4.812,1.4) -- (4.662,1.4) -- (5,1.7) -- (5.338,1.4) -- (5.188,1.4) -- (5.188,0.7) -- cycle;
\draw[thin, fill=orange!25] (4.812,3) -- (4.812,3.7) -- (4.662,3.7) -- (5,4) -- (5.338,3.7) -- (5.188,3.7) -- (5.188,3) -- cycle;
\draw[thick, dashed, fill=gray!20] (5,2.35) circle (0.65);
\node[right] at (5.4,3.5) {\small $300$ J};
\node[right] at (5.4,1.2) {\small $300$ J};
\node[below] at (5,-0.05) {\small vietato da Clausius};
\end{tikzpicture}
```

```ad-example
Esempio 2: un frigorifero rispetta l'enunciato di Clausius
In ogni ciclo un frigorifero assorbe $300\,\text{J}$ dal suo interno e il motore compie su di lui un lavoro di $100\,\text{J}$. Quanto calore cede alla cucina? Perché non viola l'enunciato di Clausius?

Dal bilancio dell'energia:

$$Q_c = Q_f + W = 300\,\text{J} + 100\,\text{J} = 400\,\text{J}$$

Il calore passa dal freddo al caldo, ma non è l'unico risultato: nel frattempo $100\,\text{J}$ di lavoro sono diventati calore. Con $W = 0$ il bilancio darebbe $Q_c = Q_f = 300\,\text{J}$: l'energia si conserverebbe lo stesso, e sarebbe proprio il dispositivo che l'enunciato vieta.
```

## L'enunciato di Kelvin

L'**enunciato di Kelvin** (detto anche di Kelvin-Planck) riguarda le [macchine termiche](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/le-macchine-termiche-e-il-rendimento):

> È impossibile realizzare una trasformazione il cui unico risultato sia quello di trasformare interamente in lavoro il calore prelevato da un'unica sorgente.

Una macchina che lavora per cicli non può quindi avere $Q_f = 0$: una parte del calore assorbito deve finire a una sorgente più fredda. Poiché il rendimento è $\eta = 1 - Q_f / Q_c$, l'enunciato di Kelvin equivale a dire che

$$\eta < 1$$

per qualunque macchina termica, per quanto ben costruita.

```tikz
% nome: kelvin-macchina-termica-macchina-vietata
% alt: Due schemi affiancati. A sinistra una macchina termica: assorbe 800 joule dalla sorgente calda, cede 500 joule alla sorgente fredda e compie 300 joule di lavoro. A destra la macchina vietata da Kelvin, disegnata tratteggiata: c'è una sola sorgente, da cui la macchina assorbe 800 joule, e una freccia del lavoro larga quanto quella del calore, 800 joule
% svg: kelvin-macchina-termica-macchina-vietata-72a4cad3.svg 371x201
\begin{tikzpicture}
\draw[thick, fill=red!15] (-1.3,4) rectangle (1.3,4.7);
\node at (0,4.35) {\small sorgente calda};
\draw[thick, fill=blue!10] (-1.3,0) rectangle (1.3,0.7);
\node at (0,0.35) {\small sorgente fredda};
\draw[thin, fill=orange!25] (-0.5,4) -- (-0.5,3.3) -- (-0.65,3.3) -- (0,3) -- (0.65,3.3) -- (0.5,3.3) -- (0.5,4) -- cycle;
\draw[thin, fill=orange!25] (-0.312,1.7) -- (-0.312,1) -- (-0.463,1) -- (0,0.7) -- (0.463,1) -- (0.312,1) -- (0.312,1.7) -- cycle;
\draw[thin, fill=green!15] (0.65,2.538) -- (1.7,2.538) -- (1.7,2.688) -- (2,2.35) -- (1.7,2.013) -- (1.7,2.163) -- (0.65,2.163) -- cycle;
\draw[thick, fill=gray!20] (0,2.35) circle (0.65);
\node[left] at (-0.7,3.6) {\small $Q_c = 800$ J};
\node[left] at (-0.5,1.3) {\small $Q_f = 500$ J};
\node[below] at (1.5,2.0) {\small $W = 300$ J};
\node[below] at (0,-0.05) {\small macchina termica};
\draw[thick, fill=red!15] (3.7,4) rectangle (6.3,4.7);
\node at (5,4.35) {\small unica sorgente};
\draw[thin, fill=orange!25] (4.5,4) -- (4.5,3.3) -- (4.35,3.3) -- (5,3) -- (5.65,3.3) -- (5.5,3.3) -- (5.5,4) -- cycle;
\draw[thin, fill=green!15] (5.65,2.85) -- (6.7,2.85) -- (6.7,3) -- (7,2.35) -- (6.7,1.7) -- (6.7,1.85) -- (5.65,1.85) -- cycle;
\draw[thick, dashed, fill=gray!20] (5,2.35) circle (0.65);
\node[left] at (4.3,3.6) {\small $800$ J};
\node[below] at (6.3,1.7) {\small $W = 800$ J};
\node[below] at (5,1.0) {\small vietata da Kelvin};
\end{tikzpicture}
```

Anche qui contano le parole "unico risultato". Un gas perfetto che si espande a temperatura costante assorbe calore da una sola sorgente e lo trasforma tutto in lavoro: nell'[isoterma](/materiale/scuola-superiore/fisica/il-primo-principio-della-termodinamica/le-trasformazioni-isocora-isobara-e-isoterma) $\Delta U = 0$ e quindi $Q = W$. Non viola l'enunciato, perché alla fine il gas non è più com'era: occupa un volume più grande, a una pressione più bassa. Per ripetere l'operazione bisogna riportarlo indietro, e ricomprimerlo alla stessa temperatura costa esattamente il lavoro appena ottenuto. L'enunciato vieta di farlo con una macchina che torna ogni volta allo stato di partenza.

```ad-warning
Kelvin non vieta di trasformare calore in lavoro
Vieta di trasformarlo tutto, e con una sola sorgente. Il passaggio opposto invece non ha limiti: il lavoro si può trasformare tutto in calore, come fa l'attrito dei freni di un'auto. Tra lavoro e calore c'è questa asimmetria: dal lavoro al calore per intero, dal calore al lavoro solo in parte.
```

## Il moto perpetuo

Per secoli gli inventori hanno cercato una macchina capace di funzionare per sempre senza consumare niente. I due principi della termodinamica dicono perché non l'hanno trovata, e distinguono due tipi di **moto perpetuo**.

| | Che cosa dovrebbe fare | Quale principio lo vieta |
|---|---|---|
| moto perpetuo di prima specie | produrre lavoro senza ricevere energia | il primo: l'energia non si crea |
| moto perpetuo di seconda specie | produrre lavoro prendendo calore da una sola sorgente | il secondo, nell'enunciato di Kelvin |

Il secondo tipo è il più insidioso, perché rispetta la conservazione dell'energia. Il mare, l'aria e il suolo contengono quantità enormi di energia interna: una macchina che la trasformasse in lavoro non avrebbe bisogno di combustibile.

```ad-example
Esempio 3: la nave che va con il calore del mare
Un inventore propone una nave il cui motore, da $2{,}0\,\text{MW}$, prende calore dall'acqua del mare e lo trasforma tutto in lavoro. Quanta acqua dovrebbe raffreddare di $1{,}0\,^\circ\text{C}$ ogni secondo? Perché la nave non può funzionare? Usa per l'acqua di mare i dati dell'acqua: $1{,}0 \cdot 10^3\,\text{kg}$ per metro cubo e $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$.

Un metro cubo d'acqua che si raffredda di un grado cede

$$Q = c\,m\,|\Delta t| = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)} \cdot 1{,}0 \cdot 10^3\,\text{kg} \cdot 1{,}0\,^\circ\text{C} \approx 4{,}2 \cdot 10^6\,\text{J}$$

Al motore servono $2{,}0 \cdot 10^6\,\text{J}$ ogni secondo, cioè il calore di

$$\frac{2{,}0 \cdot 10^6\,\text{J}}{4{,}186 \cdot 10^6\,\text{J/m}^3} = 0{,}477\ldots\,\text{m}^3 \approx 0{,}48\,\text{m}^3$$

Meno di mezzo metro cubo d'acqua al secondo: l'energia c'è, e il primo principio è rispettato. Ma il motore prenderebbe calore da un'unica sorgente, il mare, e lo trasformerebbe interamente in lavoro: è un moto perpetuo di seconda specie, vietato dall'enunciato di Kelvin. Per funzionare gli servirebbe una seconda sorgente, più fredda del mare, a cui cedere una parte del calore.
```

## I due enunciati sono equivalenti

I due enunciati sembrano parlare di cose diverse, ma sono la stessa legge: se uno dei due fosse falso, sarebbe falso anche l'altro. Lo si dimostra per assurdo, collegando un dispositivo vietato a una macchina che invece esiste e guardando che cosa fa l'insieme dei due.

### Se fosse falso Clausius, sarebbe falso Kelvin

Supponiamo che esista un dispositivo che viola l'enunciato di Clausius, capace di portare calore dalla sorgente fredda a quella calda senza lavoro. Lo affianchiamo a una normale macchina termica, che in ogni ciclo assorbe $Q_c$, cede $Q_f$ e compie il lavoro $W = Q_c - Q_f$, e lo regoliamo in modo che riporti alla sorgente calda proprio il calore $Q_f$ che la macchina ha scaricato.

Alla fine di un ciclo la sorgente fredda ha ricevuto $Q_f$ e lo ha restituito: è come se non ci fosse. La sorgente calda ha ceduto $Q_c$ e ha riavuto $Q_f$: in tutto ha perso $Q_c - Q_f$, che è esattamente il lavoro $W$ prodotto. L'insieme dei due dispositivi prende calore da una sola sorgente e lo trasforma tutto in lavoro: viola l'enunciato di Kelvin.

```ad-example
Esempio 4: l'insieme che viola Kelvin
Una macchina termica assorbe $800\,\text{J}$ dalla sorgente calda, ne cede $500\,\text{J}$ alla sorgente fredda e compie $300\,\text{J}$ di lavoro. Un dispositivo che viola Clausius riporta i $500\,\text{J}$ dalla sorgente fredda a quella calda. Qual è il bilancio dell'insieme?

- Sorgente fredda: riceve $500\,\text{J}$ e ne cede $500\,\text{J}$. In tutto non scambia niente.
- Sorgente calda: cede $800\,\text{J}$ e ne riceve $500\,\text{J}$. In tutto cede $800\,\text{J} - 500\,\text{J} = 300\,\text{J}$.
- Lavoro prodotto: $300\,\text{J}$.

L'insieme trasforma in lavoro tutti i $300\,\text{J}$ presi dalla sorgente calda, senza cedere niente a nessuno: è la macchina vietata da Kelvin.

```tikz
% nome: equivalenza-clausius-falso-kelvin-falso
% alt: Tra una sorgente calda in alto e una sorgente fredda in basso lavorano due dispositivi. A sinistra, tratteggiato, il dispositivo vietato da Clausius: porta 500 joule dalla sorgente fredda alla sorgente calda senza lavoro. A destra una macchina termica: assorbe 800 joule dalla sorgente calda, cede 500 joule alla sorgente fredda e compie 300 joule di lavoro
% svg: equivalenza-clausius-falso-kelvin-falso-d34ab48e.svg 284x203
\begin{tikzpicture}
\draw[thick, fill=red!15] (-3.2,4) rectangle (3.2,4.7);
\node at (0,4.35) {\small sorgente calda};
\draw[thick, fill=blue!10] (-3.2,0) rectangle (3.2,0.7);
\node at (0,0.35) {\small sorgente fredda};
\draw[thin, fill=orange!25] (-1.913,0.7) -- (-1.913,1.4) -- (-2.062,1.4) -- (-1.6,1.7) -- (-1.138,1.4) -- (-1.288,1.4) -- (-1.288,0.7) -- cycle;
\draw[thin, fill=orange!25] (-1.913,3) -- (-1.913,3.7) -- (-2.062,3.7) -- (-1.6,4) -- (-1.138,3.7) -- (-1.288,3.7) -- (-1.288,3) -- cycle;
\draw[thick, dashed, fill=gray!20] (-1.6,2.35) circle (0.65);
\draw[thin, fill=orange!25] (1.1,4) -- (1.1,3.3) -- (0.95,3.3) -- (1.6,3) -- (2.25,3.3) -- (2.1,3.3) -- (2.1,4) -- cycle;
\draw[thin, fill=orange!25] (1.288,1.7) -- (1.288,1) -- (1.138,1) -- (1.6,0.7) -- (2.062,1) -- (1.913,1) -- (1.913,1.7) -- cycle;
\draw[thin, fill=green!15] (2.25,2.538) -- (3.6,2.538) -- (3.6,2.688) -- (3.9,2.35) -- (3.6,2.013) -- (3.6,2.163) -- (2.25,2.163) -- cycle;
\draw[thick, fill=gray!20] (1.6,2.35) circle (0.65);
\node[left] at (-2.1,3.5) {\small $500$ J};
\node[left] at (-2.1,1.2) {\small $500$ J};
\node[right] at (2.3,3.6) {\small $Q_c = 800$ J};
\node[right] at (2.1,1.3) {\small $Q_f = 500$ J};
\node[below] at (3.3,2.0) {\small $W = 300$ J};
\node[below] at (-1.6,-0.05) {\small dispositivo vietato};
\node[below] at (1.6,-0.05) {\small macchina termica};
\end{tikzpicture}
```
```

### Se fosse falso Kelvin, sarebbe falso Clausius

Supponiamo ora che esista una macchina che viola l'enunciato di Kelvin: assorbe il calore $Q$ dalla sorgente calda e lo trasforma tutto nel lavoro $W = Q$. Con questo lavoro facciamo funzionare un normale frigorifero, che assorbe $Q_f$ dalla sorgente fredda e cede $Q_c = Q_f + W$ alla sorgente calda.

L'insieme dei due non scambia lavoro con l'esterno, perché il lavoro passa dalla macchina al frigorifero. La sorgente fredda cede $Q_f$. La sorgente calda cede $Q = W$ alla macchina e riceve $Q_f + W$ dal frigorifero: in tutto riceve $Q_f$. L'unico risultato è il passaggio del calore $Q_f$ dalla sorgente fredda a quella calda: l'insieme viola l'enunciato di Clausius.

```ad-example
Esempio 5: l'insieme che viola Clausius
Una macchina che viola Kelvin assorbe $200\,\text{J}$ dalla sorgente calda e compie $200\,\text{J}$ di lavoro. Il lavoro aziona un frigorifero che assorbe $400\,\text{J}$ dalla sorgente fredda. Qual è il bilancio dell'insieme?

Il frigorifero cede alla sorgente calda $Q_c = Q_f + W = 400\,\text{J} + 200\,\text{J} = 600\,\text{J}$.

- Sorgente calda: cede $200\,\text{J}$ e ne riceve $600\,\text{J}$. In tutto riceve $600\,\text{J} - 200\,\text{J} = 400\,\text{J}$.
- Sorgente fredda: cede $400\,\text{J}$.
- Lavoro scambiato con l'esterno: zero.

In ogni ciclo $400\,\text{J}$ passano dal freddo al caldo e non succede nient'altro: è il dispositivo vietato da Clausius.

```tikz
% nome: equivalenza-kelvin-falso-clausius-falso
% alt: Tra una sorgente calda in alto e una sorgente fredda in basso lavorano due dispositivi. A sinistra, tratteggiata, la macchina vietata da Kelvin: assorbe 200 joule dalla sorgente calda e li trasforma tutti in lavoro, che una freccia porta al dispositivo di destra. A destra un frigorifero: riceve i 200 joule di lavoro, assorbe 400 joule dalla sorgente fredda e cede 600 joule alla sorgente calda
% svg: equivalenza-kelvin-falso-clausius-falso-24308de0.svg 290x203
\begin{tikzpicture}
\draw[thick, fill=red!15] (-3.2,4) rectangle (3.2,4.7);
\node at (0,4.35) {\small sorgente calda};
\draw[thick, fill=blue!10] (-3.2,0) rectangle (3.2,0.7);
\node at (0,0.35) {\small sorgente fredda};
\draw[thin, fill=orange!25] (-1.725,4) -- (-1.725,3.3) -- (-1.875,3.3) -- (-1.6,3) -- (-1.325,3.3) -- (-1.475,3.3) -- (-1.475,4) -- cycle;
\draw[thin, fill=green!15] (-0.95,2.475) -- (0.65,2.475) -- (0.65,2.625) -- (0.95,2.35) -- (0.65,2.075) -- (0.65,2.225) -- (-0.95,2.225) -- cycle;
\draw[thick, dashed, fill=gray!20] (-1.6,2.35) circle (0.65);
\draw[thin, fill=orange!25] (1.35,0.7) -- (1.35,1.4) -- (1.2,1.4) -- (1.6,1.7) -- (2,1.4) -- (1.85,1.4) -- (1.85,0.7) -- cycle;
\draw[thin, fill=orange!25] (1.225,3) -- (1.225,3.7) -- (1.075,3.7) -- (1.6,4) -- (2.125,3.7) -- (1.975,3.7) -- (1.975,3) -- cycle;
\draw[thick, fill=gray!20] (1.6,2.35) circle (0.65);
\node[left] at (-1.9,3.5) {\small $Q = 200$ J};
\node[below] at (0,2.05) {\small $W = 200$ J};
\node[right] at (2.15,3.5) {\small $Q_c = 600$ J};
\node[right] at (2.05,1.2) {\small $Q_f = 400$ J};
\node[below] at (-1.6,-0.05) {\small macchina vietata};
\node[below] at (1.6,-0.05) {\small frigorifero};
\end{tikzpicture}
```
```

Nella figura qui sotto ci sono le due costruzioni. Scegli quale enunciato far cadere, cambia i numeri con il cursore e poi guarda l'insieme dei due dispositivi come se fosse una macchina sola. Nella prima costruzione, quanto calore scambia in tutto la sorgente fredda?

```interattivo
% nome: equivalenza-kelvin-clausius
% alt: Tra una sorgente calda e una sorgente fredda lavorano due dispositivi, uno vietato disegnato tratteggiato e uno reale. Un selettore sceglie la costruzione: nella prima un dispositivo che viola Clausius è affiancato a una macchina termica, nella seconda una macchina che viola Kelvin aziona un frigorifero. Un cursore cambia il calore ceduto dalla macchina o il lavoro prodotto, e le frecce cambiano larghezza in proporzione. Un bottone mostra l'insieme dei due dispositivi come una macchina sola, con i soli scambi totali: nel primo caso calore da una sola sorgente trasformato tutto in lavoro, nel secondo calore che passa dal freddo al caldo senza lavoro
```

Nella prima costruzione la sorgente fredda non scambia niente, qualunque sia il calore ceduto dalla macchina: tutto quello che riceve le viene tolto dal dispositivo vietato, e resta una macchina con una sola sorgente. Nella seconda sparisce il lavoro, e resta solo il calore che sale dal freddo al caldo. Poiché ciascun enunciato falso trascina con sé l'altro, i due enunciati sono veri insieme o falsi insieme: sono due modi di scrivere il secondo principio della termodinamica.

## Riconoscere che cosa viola un dispositivo

Davanti alla descrizione di una macchina si fanno due controlli, in quest'ordine.

1. Il bilancio dell'energia: per una macchina termica deve valere $W = Q_c - Q_f$, per un frigorifero $Q_c = Q_f + W$. Se i conti non tornano, è violato il primo principio.
2. Se il bilancio torna, si guarda che cosa resta alla fine di un ciclo: calore di una sola sorgente diventato tutto lavoro (Kelvin), oppure calore passato dal freddo al caldo senza lavoro (Clausius). In questi due casi è violato il secondo principio.

```ad-example
Esempio 6: quattro dispositivi
Per ciascun dispositivo, che lavora per cicli, di' se può esistere e, se no, quale principio viola.

a) Assorbe $600\,\text{J}$ da una caldaia e compie $700\,\text{J}$ di lavoro.

b) Assorbe $600\,\text{J}$ dall'acqua di un lago, compie $600\,\text{J}$ di lavoro e non cede calore.

c) Assorbe $600\,\text{J}$ da una caldaia, cede $450\,\text{J}$ all'aria e compie $150\,\text{J}$ di lavoro.

d) Assorbe $200\,\text{J}$ dall'interno di una cella a $-5\,^\circ\text{C}$ e cede $200\,\text{J}$ alla stanza a $20\,^\circ\text{C}$, senza ricevere lavoro.

Il dispositivo (a) produce più energia di quella che riceve, $700\,\text{J} > 600\,\text{J}$: viola il primo principio. Il dispositivo (b) ha il bilancio in pari, ma trasforma in lavoro tutto il calore di un'unica sorgente: viola il secondo principio, nell'enunciato di Kelvin. Il dispositivo (c) ha il bilancio in pari, $600\,\text{J} - 450\,\text{J} = 150\,\text{J}$, e cede calore a una sorgente più fredda: è una macchina termica, con rendimento $150 / 600 = 0{,}25$. Il dispositivo (d) ha il bilancio in pari, ma il suo unico risultato è spostare calore dal freddo al caldo: viola il secondo principio, nell'enunciato di Clausius.
```

```ad-warning
Un bilancio in pari non è una prova
Che l'energia si conservi è necessario, non sufficiente. I dispositivi (b) e (d) dell'esempio 6 rispettano il primo principio e non possono esistere lo stesso: va sempre fatto anche il secondo controllo.
```

Il secondo principio dice che il rendimento di una macchina termica è minore di 1, ma non dice di quanto. Il valore più alto possibile, fissate le temperature delle due sorgenti, è l'argomento della lezione sul [teorema di Carnot](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/il-teorema-di-carnot-e-il-ciclo-di-carnot); una terza formulazione del principio, che usa una grandezza nuova, si trova nella lezione sull'[entropia](/materiale/scuola-superiore/fisica/il-secondo-principio-della-termodinamica/l-entropia).
