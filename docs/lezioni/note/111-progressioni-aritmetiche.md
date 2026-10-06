# Note: Progressioni aritmetiche

Lezione nuova (lotto del terzo anno, gruppo B). Conti rifatti con SymPy (`gruppo-b/verifica.py` nello scratchpad): i nove esempi, la forma $a_n = dn + (a_1 - d)$, la formula della somma in forma simbolica (`summation`), le due somme notevoli, la somma dei multipli di $7$ tra $100$ e $300$ contata anche per elenco, l'equazione $2n^2 + n - 210 = 0$.

## Scelte

- Ragione $d$, primo termine $a_1$, termine generale $a_n = a_1 + (n - 1)d$, ricavato "a passi" e con il rimando alla 113 per la dimostrazione rigorosa.
- La formula tra due termini qualunque, $a_n = a_k + (n - k)d$, è dimostrata sottraendo i termini generali, e letta come coefficiente angolare (link alla 82).
- Somma: $S_n = \frac{n(a_1 + a_n)}{2}$ dimostrata con la somma scritta due volte, dopo la proprietà dei termini equidistanti dagli estremi (dimostrata anche quella). Seconda forma con $a_1$ e $d$. Le somme $1 + \dots + n$ e dei primi $n$ dispari sono date come casi particolari.
- L'aneddoto di Gauss è introdotto con "si racconta che": è un aneddoto, non un fatto documentato.
- Il numero dei termini $n = \frac{a_n - a_1}{d} + 1$ ha una formula sua e un avviso (l'errore del $+1$).
- "Medio aritmetico" per il termine tra due vicini e "inserire $k$ medi aritmetici" con $d = \frac{b - a}{k + 1}$.
- Tre numeri in progressione come $x - d$, $x$, $x + d$ (riquadro `ad-tip` ed esempio 5).

## Confini

- La 110 ha già monotonia e ricorsione: qui si dice solo che il segno di $d$ decide.
- Niente progressioni aritmetiche "finite" come oggetto a parte: si parla dei primi $n$ termini e dei loro estremi.
- Niente problemi di realtà oltre al teatro (esempio 7): vanno negli esercizi.

## Figure e piano

- `progressione-aritmetica-punti-allineati`: i punti di $1, 3, 5, 7, 9$ sulla retta $y = 2x - 1$, con il gradino $1$ e $d = 2$. Coordinate controllate dallo script.
- `somma-progressione-aritmetica-due-scale`: le due scale che riempiono il rettangolo $5 \times 6$. Il testo le chiama "blu, in basso" e "arancione, in alto", perché nel tema scuro l'arancione diventa marrone.
- Blocco `grafico` `progressione-aritmetica-cursori`, sotto la prima figura: sei punti $(n, a_1 + (n-1)d)$, la retta tratteggiata, cursori $a_1$ e $d$, valore $a_6$. Guardato nella pagina di prova `/prova-grafico/lezione` a 420 px, in chiaro e in scuro, ai due estremi dei cursori ($a_1$ da $-4$ a $6$, $d$ da $-2$ a $2$): i sei punti restano nella finestra. Limiti: la retta tratteggiata continua anche a sinistra di $n = 1$; il nome dell'asse verticale è scritto "aₙ" con il carattere Unicode, perché `assi:` non legge LaTeX.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Uno, quello che c'era (`progressione-aritmetica-cursori`). Cambiata la domanda, che ora nomina il caso limite ("Porta $d$ a $0$: che progressione resta? Poi muovi solo $a_1$: la pendenza della retta cambia?"), e aggiunto sotto il piano il paragrafo con le risposte. Guardato a 390 px con $d = 0$. Nessun piano nuovo: la somma e i medi non hanno un parametro che cambi la forma di qualcosa.

## Domande per Andrea

- La ragione si indica con $d$: va bene, o il vostro libro usa $r$?
- Volete le progressioni aritmetiche finite con le loro parole (estremi, numero dei termini) trattate a parte?
- L'esempio 9 (trovare $n$ dalla somma, con un'equazione di secondo grado) è al livello giusto o è da esercizi?
- I medi aritmetici: tenerli o sono poco usati nelle verifiche?

## Da verificare

- Il blocco `grafico` su un telefono vero.
- L'età di Gauss nell'aneddoto non è indicata apposta ("da bambino").

Prerequisiti proposti: successioni-numeriche, equazione-di-una-retta, equazioni-secondo-grado
