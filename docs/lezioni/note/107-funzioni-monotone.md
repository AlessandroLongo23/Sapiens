# Note: Funzioni crescenti e decrescenti

Lezione nuova (lotto del terzo anno, gruppo A, 5 ottobre 2026). Con SymPy (`gruppo-a/verifica.py` nello scratchpad) sono state controllate le scomposizioni di $f(x_2) - f(x_1)$ per la parabola generica, per $x^2 - 4x + 3$, per $x^3$ (compresa la riscrittura come somma di quadrati) e per $\frac{1}{x}$, e i punti della funzione dell'esempio 1, $\frac{1}{8}(x^3 - 3x^2 - 9x + 11)$, che cambia verso proprio in $x = -1$ e in $x = 3$ (derivata calcolata dallo script, non nella lezione).

## Scelte

- "Crescente" e "decrescente" senza altre parole vogliono dire in senso stretto; "in senso lato" ha la sua sezione breve, con i sinonimi "non decrescente" e "non crescente". "Monotona" (senza accento scritto, come nella 110) comprende senso stretto e senso lato; "strettamente monotona" è il senso stretto. La lezione lo dice in un paragrafo apposta, perché le lezioni 110, 121, 123, 125 e 127 usano queste parole e rimandano qui.
- La monotonia è sempre in un intervallo; "crescente" senza intervallo vuol dire in tutto il dominio.
- Gli intervalli di monotonia sono scritti chiusi dove la funzione è definita all'estremo ($\mathopen{]}-\infty, 2]$ e $[2, +\infty\mathclose{[}$ per la parabola). Un `ad-note` spiega perché l'estremo comune non è una contraddizione e dice che molti libri li scrivono aperti.
- Niente "massimo" e "minimo": i punti in cui il grafico cambia verso sono descritti a parole. Hanno la loro lezione al quinto anno.
- Niente derivate: la monotonia si dimostra con il segno di $f(x_2) - f(x_1)$. Dimostrati: retta, parabola generica, $x^3$, $\sqrt{x}$, $\frac{1}{x}$ nei due rami, somma di crescenti, monotona implica iniettiva, l'equivalenza $f(a) < f(b) \Leftrightarrow a < b$.
- Enunciati senza dimostrazione, in un `ad-note`: l'inversa ha la stessa monotonia; la regola sulla funzione composta.
- La sezione sulle disequazioni collega la monotonia alle regole già note (cubo, quadrato tra non negativi, reciproci) e rimanda alle lezioni 123 e 127.
- Coordinate con la virgola, come nelle lezioni 80-87 (correzione di chi coordina al brief).

## Domande per Andrea

- Estremi degli intervalli: la lezione scrive "decrescente in $\mathopen{]}-\infty, 2]$ e crescente in $[2, +\infty\mathclose{[}$", con il vertice in tutti e due. In classe si scrive "per $x < 2$ e per $x > 2$"? Da questa risposta dipendono le soluzioni del generatore di esercizi.
- "Crescente" vuol dire in senso stretto e il senso lato è "crescente in senso lato": è la convenzione del libro in uso, o lì "crescente" è il senso lato e "strettamente crescente" quello stretto?
- La dimostrazione per la parabola generica, con $a(x_1 + x_2) + b$, è al livello giusto per il terzo anno o è meglio tenerla solo sull'esempio numerico?
- Inversa e funzione composta sono in un riquadro senza dimostrazione: servono in verifica, o si possono togliere?

## Da verificare

- Figure guardate in anteprima, in chiaro e in scuro, non sul sito pubblicato.
- I due blocchi `grafico` (parabola con $a$ e $b$, $y = \frac{k}{x}$) sono stati aperti sulla pagina di prova con i cursori ai due estremi: disegnano bene.
- Nel blocco della parabola, con $a = 0$ la curva è una retta e $x_V$ non esiste.

## Figure

Cinque TikZ: `funzione-crescente-e-decrescente-definizione`, `funzione-crescente-in-senso-lato`, `intervalli-crescente-decrescente-dal-grafico`, `parabola-decrescente-e-crescente` (copertina), `iperbole-decrescente-nei-due-rami` (copertina). Due blocchi `grafico`: `parabola-crescente-decrescente-cursori`, `iperbole-k-fratto-x-crescente-decrescente`.

## Formulario e flashcard

Formulario senza figure. 20 carte; la carta `parabola-a-negativo` usa $y = -x^2$, che nella lezione è coperta dalla tabella.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Tre piani.
- `parabola-crescente-decrescente-cursori` (esempio 2, c'era già): la domanda ora passa per $a = 0$ (la parabola diventa una retta, $x_V$ "non esiste"), con il paragrafo della risposta.
- `cubica-x-cubo-piu-ax-cursore` (nuovo, dopo l'avviso sul prodotto, con la figura nuova `cubica-x-cubo-piu-x-crescente`): $y = x^3 + ax$ con $f(-1)$ e $f(1)$ sotto il piano. Crescente per $a \geq 0$; per $a < 0$ sale, scende e risale. Che per ogni $a$ negativo ci sia un tratto in discesa è affermato e mostrato, non dimostrato: viene da $f(t) - f(-t) = 2t(t^2 + a)$, negativo per $t$ piccolo.
- `iperbole-k-fratto-x-crescente-decrescente` (c'era già): la domanda nomina $k = 0$ (resta $y = 0$), con il paragrafo della risposta. Per $k = 0$ il piano disegna la retta anche in $x = 0$, dove la funzione non esiste.

Scartati: $y = mx + q$ con il cursore $m$ (è già previsto nella lezione 81, e qui servirebbe una figura in più); $y = |x - a|$ (lo spostamento del vertice è della 109).

Prerequisiti proposti: funzioni-reali-di-variabile-reale, disequazioni-primo-grado, funzioni-quadratiche
