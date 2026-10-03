# Grafico di funzione

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

## Geometria analitica

Con la barra sul piano costruisci punti, rette e circonferenze con i clic: la retta per due punti, la parallela e la perpendicolare, l'asse di un segmento, la circonferenza per tre punti, le tangenti, le intersezioni. Ogni oggetto mostra la sua equazione, che cambia mentre trascini i punti.

Gli stessi oggetti si possono scrivere, con il punto e virgola tra gli argomenti.

```ad-example
La retta per due punti e la sua parallela
Scrivi $A = (1; 2)$ e $B = (3; 5)$ in due righe. Poi scrivi `retta(A; B)` e premi Invio: compare la retta $r$ con la sua equazione, $y = \frac{3}{2}x + \frac{1}{2}$. Con un terzo punto $C$, `parallela(r; C)` disegna la parallela a $r$ per $C$.
```

Per dare un nome a una retta scritta come equazione, metti il nome e i due punti davanti: `s: x = 3`. Da quel momento `perpendicolare(s; A)` la riconosce.

## Condividere e scaricare

"Condividi" copia un link che riapre il grafico com'è, con le formule, i cursori e la finestra. Il bottone con la freccia in giù scarica il piano come immagine PNG o SVG.
