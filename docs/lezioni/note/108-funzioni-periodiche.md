# Note: Funzioni periodiche

Lezione nuova (lotto del terzo anno, gruppo A, 5 ottobre 2026). Con SymPy (`gruppo-a/verifica.py` nello scratchpad) sono stati rifatti i valori delle tre funzioni periodiche degli esempi (onda triangolare di periodo 4, dente di periodo 3, archi di parabola di periodo 2), le divisioni con resto ($100$, $2025$, $300$), parte intera e parte frazionaria di $2{,}7$, $5$ e $-1{,}3$, gli zeri dell'esempio 4.

## Scelte

- Confine fissato dal brief: niente goniometria. Seno e coseno compaiono solo nell'ultimo `ad-note`, come funzioni che arriveranno, con il periodo detto "un angolo giro" e senza grafico. Nessun link al quarto anno.
- Definizione con $x + T$ e $x - T$ nel dominio. "Periodo" è il più piccolo $T$ positivo; gli altri numeri che funzionano sono "multipli del periodo", senza un nome proprio.
- Esempi con grafici fatti di segmenti (onda triangolare, dente asimmetrico), con una formula ripetuta ($x^2$ su $[-1, 1\mathclose{[}$) e con la parte frazionaria.
- Parte intera scritta $\lfloor x \rfloor$ e parte frazionaria $\operatorname{mant}(x)$, con il nome "parte frazionaria, detta anche mantissa".
- Dimostrati: $f(x + kT) = f(x)$; il periodo $1$ della parte frazionaria, compreso il fatto che è il più piccolo; il periodo $\frac{T}{k}$ di $f(kx)$, compreso il fatto che è il più piccolo; $x^2$ non è periodica; una funzione crescente o decrescente non è periodica.
- Enunciato senza dimostrazione: $f(x) + c$, $c \cdot f(x)$ e $f(x - a)$ conservano il periodo.
- Lasciati fuori: la somma di due funzioni periodiche e il minimo comune multiplo dei periodi (serve con seno e coseno, al quarto anno); il periodo di $|f(x)|$, che può dimezzarsi; la frequenza come reciproco del periodo (fisica).
- $f(kx)$ solo con $k > 0$.
- Coordinate con la virgola, come nelle lezioni 80-87 (correzione di chi coordina al brief).

## Domande per Andrea

- Notazione: $\lfloor x \rfloor$ per la parte intera e $\operatorname{mant}(x)$ per la parte frazionaria. Il libro in uso scrive $[x]$ e "mantissa", oppure $\{x\}$? Le carte e il formulario seguono la lezione, quindi la scelta va fatta prima di pubblicare.
- Il libro del terzo anno tratta le funzioni periodiche prima della goniometria, o le presenta solo insieme a seno e coseno? Se è il secondo caso, questa lezione è un'aggiunta: va tenuta così ampia (cinque esempi) o ridotta?
- La funzione costante è detta "periodica ma senza periodo": è la convenzione che usi, o preferisci escluderla dalle periodiche?
- Nel riquadro finale il periodo di seno e coseno è "un angolo giro", $360^\circ$, senza radianti: va bene per chi non ha ancora fatto il quarto anno?

## Da verificare

- Figure guardate in anteprima, in chiaro e in scuro, non sul sito pubblicato. Le due figure ritoccate per ultime (il "1" del dente di sega, i nomi delle due onde) sono state riguardate anche in chiaro.
- I due blocchi `grafico` usano la parte intera del plotter ($\lfloor \dots \rfloor$): li ho aperti sulla pagina di prova del sito in sviluppo e disegnano le due onde senza tratti verticali spuri. Provati anche con i cursori ai due estremi. Non provati sul telefono né nel tema scuro.
- Il plotter segna con un pallino i punti notevoli delle onde (cime, zeri, intersezioni): sono molti e non si possono spegnere dal blocco.

## Figure

Cinque TikZ: `funzione-periodica-onda-triangolare` (copertina), `funzione-periodica-dente-asimmetrico`, `funzione-periodica-archi-di-parabola`, `parte-frazionaria-dente-di-sega`, `periodo-di-f-di-2x` (copertina). Due blocchi `grafico`: `onda-triangolare-traslata-cursore`, `onda-triangolare-periodo-cursore`.

## Formulario e flashcard

Formulario senza figure. 20 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Tre piani.
- `onda-triangolare-traslata-cursore` (c'era già): aggiunto il paragrafo con la risposta (multipli di 4, e perché $a = 0$ non conta).
- `onda-triangolare-periodo-cursore` (c'era già): aggiunto il paragrafo con la risposta ($k = 4$ e $k = \frac{1}{2}$).
- `onda-triangolare-altezza-cursori` (nuovo, con la figura nuova `periodo-di-2f-meno-1`): $y = c \cdot f(x) + d$. Il periodo non cambia; caso limite $c = 0$, la funzione costante della nota in fondo. Cursori tra $-2$ e $2$ perché l'onda resti nella finestra.

Scartati: la parte frazionaria con un cursore sul periodo (ripete il secondo piano con un'altra onda); gli archi di parabola dell'esempio 2 con il periodo a cursore (cambiano insieme larghezza e altezza, e non c'è un caso limite che insegni qualcosa).

Prerequisiti proposti: funzioni-reali-di-variabile-reale
