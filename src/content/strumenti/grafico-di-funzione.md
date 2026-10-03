# Grafico di funzione

## Una calcolatrice grafica online

Questo strumento è una calcolatrice grafica: un piano cartesiano su cui disegni il grafico di una funzione, le curve di un'equazione e le figure della geometria analitica, da computer e da telefono. È gratis e non chiede di registrarsi.

## Come si scrive una funzione

Scrivi la formula nella prima riga e il grafico compare mentre scrivi. Puoi scrivere $y = 2x + 1$, solo $x^2 - 4$, oppure dare un nome alla funzione: $f(x) = x^2 - 4$. Con un nome, le altre righe la possono usare: $f(x) + 1$, $f(2x)$, $f'(x)$ per la derivata.

Sul grafico trovi i punti notevoli con le loro coordinate: gli zeri, l'intersezione con l'asse $y$, i massimi e i minimi, e i punti in cui due curve si incontrano. Tocca un punto per leggerne le coordinate.

Dopo due lettere compare un elenco di proposte: scrivi "rad" per la radice, "val" per il valore assoluto, "tratti" per una funzione definita a tratti. Il tasto Tab sceglie la prima proposta.

## I parametri

Ogni lettera diversa da $x$ e $y$ diventa un parametro con il suo cursore, quando confermi la formula con Invio.

```ad-example
La parabola che cambia forma
Scrivi $y = ax^2 + bx + c$ e premi Invio. Compaiono tre cursori: muovi $a$ e la parabola si apre, si stringe e si capovolge quando $a$ diventa negativo. Il tasto con il triangolo fa muovere un cursore da solo.
```

## Equazioni, disequazioni e punti

Una riga può essere anche un'equazione in $x$ e $y$, come $x^2 + y^2 = 9$, e allora vedi la sua curva. Una disequazione, come $y < x + 2$, colora la parte di piano in cui è vera. Con la parola "sistema" scrivi più disequazioni in una graffa: si colora la parte in cui valgono tutte.

Un punto si scrive con il punto e virgola tra le coordinate, $A = (1; 2)$, e si trascina sul piano.

## Curve parametriche, polari e successioni

Una coppia come $(\cos t; \sin t)$ è una curva percorsa al variare di $t$. Una formula in $r$ e $\theta$, come $r = 2\theta$, è una curva in coordinate polari.

Una successione si scrive con il pedice: il termine generale $a_n = 2n + 1$, oppure la ricorrenza $a_{n+1} = 2a_n$ con il valore di partenza $a_0 = 1$ in un'altra riga. I termini sono i punti $(n; a_n)$.

## Derivate e integrali

Scrivi "derivata" per la derivata di una formula e "integrale" per un integrale con i due estremi. Con la $x$ come estremo superiore ottieni la funzione integrale:

$$F(x) = \int_0^x t^2 \, dt$$

Dal bottone dell'aspetto di una riga puoi anche far comparire la retta tangente in un punto e l'area tra la curva e l'asse $x$.

## Limiti e asintoti

Scrivi "lim" e scegli dove tende la variabile: la riga dice quanto vale il limite, anche da destra, da sinistra e all'infinito.

$$\lim_{x \to 0} \frac{\sin x}{x} = 1$$

Dall'aspetto di una funzione, "Asintoti" disegna con una linea tratteggiata gli asintoti verticali, orizzontali e obliqui, e ne scrive le equazioni sotto la riga.

## Successioni: tabella e ragnatela

Una successione ha la sua tabella dei termini. Per una ricorrenza a un passo, come $a_{n+1} = \cos(a_n)$, il diagramma a ragnatela mostra la curva della regola, la retta $y = x$ e la scala dei termini che si avvicina al punto fisso.

## Equazioni differenziali

Scrivi $y' = x - y$ e vedi il campo di direzioni: un trattino per ogni pendenza. Metti un punto sul piano e compare la soluzione che passa di lì; trascinando il punto la curva lo segue.

## Statistica e probabilità

`media`, `mediana`, `varianza` e `devstandard` calcolano su un elenco di numeri. `normale(x; μ; σ)` è la curva a campana di Gauss, e `distbinomiale(k; n; p)` la probabilità di $k$ successi in $n$ prove. Con lo strumento "Retta di regressione", o con `regressione(A; B; C)`, trovi la retta che passa più vicino a un gruppo di punti, con il coefficiente $r$.

## Per lo studio di funzione

Lo strumento non scrive i passaggi di uno studio di funzione, ma ti fa controllare ogni passo del tuo. Il dominio si vede da dove il grafico esiste. Gli zeri e il segno si leggono dalle intersezioni con l'asse $x$. Massimi e minimi sono segnati sul grafico. Per la crescenza disegna $f'(x)$ in una seconda riga e guarda dove è positiva; per la concavità disegna $f''(x)$. Gli asintoti si riconoscono allargando la finestra.

```ad-example
Controllare uno studio di funzione
Scrivi $f(x) = \frac{x^2 - 1}{x - 2}$ e, in un'altra riga, $f'(x)$. Il grafico di $f$ ha un massimo e un minimo proprio dove quello di $f'$ attraversa l'asse $x$, e si interrompe in $x = 2$, dove c'è l'asintoto verticale.
```

## Geometria analitica

Con la barra sul piano costruisci punti, rette e circonferenze con i clic: la retta per due punti, la parallela e la perpendicolare, l'asse di un segmento, la circonferenza per tre punti, le tangenti, le intersezioni. Ogni oggetto mostra la sua equazione, che cambia mentre trascini i punti.

Con le trasformazioni ottieni l'immagine di un punto, di una retta, di una circonferenza o di un poligono: simmetria rispetto a una retta o a un punto, traslazione, rotazione e omotetia.

Gli stessi oggetti si possono scrivere, con il punto e virgola tra gli argomenti.

```ad-example
La retta per due punti e la sua parallela
Scrivi $A = (1; 2)$ e $B = (3; 5)$ in due righe. Poi scrivi `retta(A; B)` e premi Invio: compare la retta $r$ con la sua equazione, $y = \frac{3}{2}x + \frac{1}{2}$. Con un terzo punto $C$, `parallela(r; C)` disegna la parallela a $r$ per $C$.
```

Per dare un nome a una retta scritta come equazione, metti il nome e i due punti davanti: `s: x = 3`. Da quel momento `perpendicolare(s; A)` la riconosce.

Con lo strumento "Distanza" misuri la distanza tra due punti, la distanza di un punto da una retta e quella tra due rette parallele.

@@strumenti@@

Se ti servono i passaggi del calcolo, ci sono i calcolatori dedicati: la [retta passante per due punti](/strumenti/retta-passante-per-due-punti), la [distanza tra due punti](/strumenti/distanza-tra-due-punti), il [punto medio di un segmento](/strumenti/punto-medio-segmento) e l'[equazione della circonferenza](/strumenti/equazione-circonferenza).

## Condividere e scaricare

"Condividi" copia un link che riapre il grafico com'è, con le formule, i cursori e la finestra. Il bottone con la freccia in giù scarica il piano come immagine PNG o SVG.
