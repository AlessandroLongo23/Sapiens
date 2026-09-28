# Note: Equazioni binomie, trinomie e scomponibili

Lezione nuova, scritta da zero (lotto 9). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy in uno script (`verifica.py` nello scratchpad del lotto, comune alla 91): `solveset` in $\mathbb{R}$ su ogni equazione degli esempi, degli avvisi e delle carte; `expand` su ogni scomposizione ($x^3 - 4x$, il raccoglimento parziale dell'esempio 2, $x^3 + 8$, $x^4 - 16$, $x^4 - 5x^2 + 4$, $x^3 - x - 6$); `div` per le due divisioni di Ruffini, con quoziente e resto, e `discriminant` sui quozienti; le equazioni in $t$ delle trinomie; `solve_univariate_inequality` sulle due disequazioni finali e sulla loro versione in $t$; le verifiche numeriche ($P(1) = -2$, $P(-1) = 0$, $4^4 - 5 \cdot 4^2 + 4 = 180$, $81 - 45 + 4 = 40$, $x = 0$ e $x = 3$ nell'esempio 14). Lo script delle figure (`90/fig90.py`) controlla che i punti disegnati sulle rette $y = 2$ e $y = -1$ siano le soluzioni reali di $x^4 = k$ e $x^3 = k$, e che ogni riga delle due tabelle dei segni, la riga del prodotto e la riga $S$ coincidano con i segni e con l'insieme calcolati da SymPy. Il controllo `check.mts` passa sui tre file. Le formule in evidenza, misurate con KaTeX in Chromium a 17 px, sono larghe al massimo 208 px (la doppia riga della soluzione dell'esempio 15).

## Struttura ed esempi

Forma normale e grado, con il numero massimo di soluzioni e una frase sulle formule di terzo e quarto grado (e sull'assenza di una formula generale con i radicali dal quinto grado). Poi le tre famiglie, in un ordine diverso da quello del titolo: prima le scomponibili, perché le binomie e le trinomie si possono rileggere come casi particolari (lo dicono due `ad-note`), poi binomie e trinomie, infine la sezione breve sulle disequazioni.

Quindici esempi svolti:

1. $x^3 - 4x = 0$, raccoglimento e differenza di quadrati (è anche l'esempio dell'apertura);
2. $x^3 - 2x^2 - 9x + 18 = 0$, raccoglimento parziale;
3. $2x^3 - 3x^2 - 3x + 2 = 0$, Ruffini con uno zero negativo e un quoziente con soluzione frazionaria;
4. $x^3 + x^2 + x - 3 = 0$, Ruffini e un quoziente con $\Delta < 0$: una soluzione sola;
5. $x^3 + 8 = 0$, binomia dispari con $k < 0$;
6. $2x^4 - 32 = 0$, binomia pari con due soluzioni;
7. $x^4 + 81 = 0$, binomia pari impossibile;
8. $x^6 - 5 = 0$, soluzioni irrazionali $\pm\sqrt[6]{5}$;
9. $x^4 - 5x^2 + 4 = 0$, biquadratica con quattro soluzioni;
10. $x^4 + 3x^2 - 4 = 0$, un valore di $t$ negativo;
11. $x^4 - 7x^2 + 10 = 0$, quattro soluzioni irrazionali;
12. $x^4 + 5x^2 + 6 = 0$, due valori di $t$ negativi, impossibile;
13. $x^6 - 7x^3 - 8 = 0$, trinomia con $n = 3$, dove anche $t < 0$ dà una soluzione;
14. $x^3 - x^2 - 4x + 4 > 0$, disequazione con tre fattori di primo grado;
15. $x^4 - 5x^2 + 4 \leq 0$, biquadratica con due righe di secondo grado nella tabella.

Avvisi, ognuno dopo il suo punto: dividere per $x$; uguagliare i fattori a un numero diverso da zero; dimenticare la soluzione negativa; confondere pari e dispari; fermarsi a $t$; il valore negativo di $t$; scartare $t$ negativo con l'esponente dispari; dimenticare che $t$ è $x^2$ nella disequazione. In fondo due generici: contare le soluzioni dal grado, chiamare binomia un'equazione con due termini qualsiasi ($x^4 - 9x^2 = 0$).

La sezione sulle disequazioni è un'aggiunta chiesta dal brief: il capitolo si chiama "Equazioni e disequazioni di grado superiore" e nessun'altra lezione le tratta. È breve, con due esempi e il metodo della 54 e della 89 (fattori di secondo grado su una riga), e rimanda a quelle lezioni invece di rispiegare la tabella dei segni. Se si preferisce toglierla, la lezione regge senza; l'avviso sulla sostituzione nelle disequazioni va via con lei.

## Scelte di convenzione (da verificare con il libro in uso)

- Binomia $ax^n + b = 0$ con $n > 2$ e $a \neq 0$; il caso $b = 0$ è detto in una riga. Alcuni libri includono $n = 1$ e $n = 2$ nella definizione, altri chiedono anche $b \neq 0$.
- Trinomia $ax^{2n} + bx^n + c = 0$ con $a$, $b$, $c$ diversi da zero e $n \geq 2$; biquadratica per $n = 2$. L'equazione in $t$ non ha un nome: molti libri la chiamano "equazione risolvente" o "ausiliaria". Vedi le domande per Andrea.
- La tabella delle binomie scrive $x = \sqrt[n]{k}$ anche per $k < 0$ e $n$ dispari, come la 72 ("con indice dispari ogni numero reale ha una e una sola radice reale"), senza passare da $-\sqrt[n]{-k}$.
- Soluzioni elencate in $S$ in ordine crescente, ognuna una volta. Non si parla di molteplicità (soluzioni doppie): nessun esempio ha un fattore ripetuto.
- I candidati di Ruffini $\dfrac{p}{q}$ con la stessa formulazione della 37; la tabella di Ruffini con `array` come nella 37.
- Intervalli con `\mathopen{]}` e `\mathclose{[}` come la 88 e la 89.

## Lasciato ad altre lezioni

- Scomposizione (34-37): solo i link, nessuna tecnica rispiegata. La somma di cubi è citata con il link alla 35.
- Radice $n$-esima e radici di indice dispari di un negativo: link alla 72.
- Tabella dei segni e fattori di secondo grado: link alla 54, alla 88 e alla 89; il sistema $1 \leq x^2 \leq 4$ è solo citato con il link alla 89.
- Equazioni reciproche: fuori, come chiede il brief (vedi le domande per Andrea).
- Molteplicità delle soluzioni, teorema fondamentale dell'algebra, formule di Cardano: fuori.

## Figure

Tre blocchi TikZ, generati da `90/fig90.py` (con `figlib.py`, che riprende le funzioni della 89) e compilati con `compileFigure` di `scripts/figure/compile.mjs`; guardati in PNG in chiaro e con il filtro di inversione su un riquadro bianco.

- `binomia-pari-dispari-grafici`: due pannelli, $y = x^4$ e $y = x^3$, con le rette $y = 2$ (blu) e $y = -1$ (rosso) e i punti di intersezione. 312 x 155 px: più larga delle altre figure del lotto 8 (fino a 262). Se sul telefono risulta piccola, si possono mettere i due pannelli uno sotto l'altro (circa 155 x 300).
- `disequazione-terzo-grado-tabella-segni` (251 x 139) e `disequazione-biquadratica-tabella-segni` (251 x 115), con lo stesso schema e le stesse misure delle tabelle della 54 e della 89.

Niente `\clip`, niente riempimenti bianchi, niente `\mathbb`.

## Formulario e flashcard

- Formulario: forma normale e numero di soluzioni, scomponibili con il procedimento e l'esempio 1, binomie con la tabella, trinomie con il procedimento e l'esempio 9, una riga sulle disequazioni, tre avvisi. Nessuna figura.
- 18 carte, nell'ordine della lezione; tutti i numeri vengono dalla lezione.

## Da cambiare nelle lezioni già scritte

- 37 (Scomposizione con la regola di Ruffini) linka già questa lezione nell'ultimo paragrafo ("per le [equazioni di grado superiore](...equazioni-binomie-trinomie-e-scomponibili)"): niente da cambiare.
- 17 (Equazioni di secondo grado), sezione "Equazione pura": facoltativo. Dopo "Se è negativo, non ci sono soluzioni reali, perché il quadrato di un numero reale non è mai negativo." si può aggiungere "Lo stesso ragionamento, con esponenti più alti, risolve le [equazioni binomie](/materiale/scuola-superiore/matematica/equazioni-e-disequazioni-di-grado-superiore/equazioni-binomie-trinomie-e-scomponibili)."

## Prerequisiti

La riga della bozza, `equazioni-binomie-trinomie <- scomposizione-ruffini, equazioni-secondo-grado, radicali-operazioni`, ha un arco ridondante: `radicali-operazioni` è già antenata di `equazioni-secondo-grado` (riga 139 di `prerequisiti.md`). La sezione sulle disequazioni usa la 88, che ha già tra gli antenati `equazioni-secondo-grado`, `radicali-operazioni`, `numeri-reali-radici` e `disequazioni-razionali` (controllato con uno script sulle righe esistenti). Proposta:

```
equazioni-binomie-trinomie <- scomposizione-ruffini, disequazioni-secondo-grado
```

Se si toglie la sezione sulle disequazioni: `equazioni-binomie-trinomie <- scomposizione-ruffini, equazioni-secondo-grado`.

## Per il generatore

1. Scomponibile con raccoglimento totale e prodotto notevole ($x^3 - 4x = 0$, $S = \{-2, 0, 2\}$). Distrattori: $\{-2, 2\}$ (divisione per $x$); $\{0, 4\}$.
2. Scomponibile con raccoglimento parziale ($x^3 - 2x^2 - 9x + 18 = 0$). Distrattore: $\{2, 3\}$ (dimenticare $-3$ nella differenza di quadrati).
3. Ruffini, zero intero e quoziente con due soluzioni, anche frazionarie ($2x^3 - 3x^2 - 3x + 2 = 0$). Distrattori: segno del fattore sbagliato ($1$ al posto di $-1$); quoziente fermato senza risolverlo.
4. Ruffini con quoziente a $\Delta < 0$ ($x^3 + x^2 + x - 3 = 0$, $S = \{1\}$). Distrattore: tre soluzioni perché "è di terzo grado".
5. Binomie $x^n = k$ con $n$ pari o dispari e $k$ di ogni segno ($x^3 + 8 = 0$, $2x^4 - 32 = 0$, $x^4 + 81 = 0$, $x^6 - 5 = 0$). Distrattori: solo la soluzione positiva con $n$ pari; "impossibile" con $n$ dispari e $k < 0$; $\pm\sqrt[n]{|k|}$ con $n$ pari e $k < 0$.
6. Biquadratiche con $t_1$, $t_2$ positivi, di segno opposto o negativi ($x^4 - 5x^2 + 4 = 0$, $x^4 + 3x^2 - 4 = 0$, $x^4 + 5x^2 + 6 = 0$). Distrattori: i valori di $t$ come soluzioni; $\pm\sqrt{|t|}$ per il $t$ negativo.
7. Trinomie con $n = 3$ ($x^6 - 7x^3 - 8 = 0$). Distrattore: scartare il $t$ negativo.
8. Disequazioni scomponibili di terzo grado o biquadratiche ($x^3 - x^2 - 4x + 4 > 0$, $x^4 - 5x^2 + 4 \leq 0$). Distrattori: intervalli con i segni alternati sbagliati; $1 \leq x \leq 4$ (i valori di $t$).

Il controllo del generatore deve verificare che l'insieme $S$ non ripeta le soluzioni e che, con $n$ pari e $k < 0$, la risposta sia $\emptyset$.

## Domande per Andrea

- Equazioni reciproche: le ho lasciate fuori, come chiede il brief, perché molti libri del biennio non le fanno più o le mettono tra gli approfondimenti. Le vuoi, magari in un `ad-note` sulle reciproche di terzo grado ($x = -1$ come soluzione)?
- Nome dell'equazione in $t$: "equazione risolvente", "ausiliaria" o nessun nome, come ora?
- Definizione di binomia: $n > 2$ come ora, oppure $n \geq 1$ con $b \neq 0$, come in alcuni libri?
- La sezione sulle disequazioni di grado superiore sta bene qui, alla fine della lezione sulle equazioni, oppure preferisci una lezione a parte nel capitolo?
- Ordine delle famiglie: scomponibili, binomie, trinomie (come ora) oppure binomie e trinomie prima, come nel titolo?
