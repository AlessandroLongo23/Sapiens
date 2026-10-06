# Note: Principio di induzione

Lezione nuova (lotto del terzo anno, gruppo B). Conti rifatti con SymPy (`gruppo-b/verifica.py` nello scratchpad): i sette passi induttivi come identità simboliche, le scomposizioni, $n^2 + n + 41$ primo per $n$ da $1$ a $39$ e uguale a $41^2$ per $n = 40$, la divisibilità di $n^3 + 2n$ e la disuguaglianza $2^n > 2n + 1$ controllate anche per i primi duecento valori, il falso enunciato "$n^2 + n$ è dispari".

## Scelte

- Enunciato del principio con base $P(1)$ e passo "per ogni $k \geq 1$, $P(k) \Rightarrow P(k + 1)$"; la forma con base $n_0$ viene dopo, con l'esempio 6. La lettera del passo è $k$, quella dell'enunciato è $n$.
- $P(n)$ è chiamato "enunciato aperto", come nella 67, che però usa la minuscola $p(x)$.
- Parole: base dell'induzione, passo induttivo, ipotesi induttiva, tesi. Ogni esempio ha le quattro voci scritte nello stesso ordine.
- L'immagine è quella delle tessere del domino. Un `ad-note` dice che il principio è un assioma di Peano e non un teorema.
- Sette esempi: somma dei naturali, dei dispari, dei quadrati; divisibilità ($n^3 + 2n$ per $3$); termine generale di una successione ricorsiva (quella della 110); disuguaglianza con base $3$; disuguaglianza di Bernoulli.
- L'esempio falso con il passo induttivo che riesce ("$n^2 + n$ è dispari") è in un avviso in fondo.
- Lasciato fuori: l'induzione forte (o completa), il principio del minimo, il simbolo $\Sigma$, il fattoriale (arriva al quarto anno con il calcolo combinatorio).

## Confini

- Le formule delle progressioni non sono ridimostrate: la lezione dice che i termini generali della 111 e della 112 si dimostrano così, e lo mostra su una successione ricorsiva che non è una progressione.

## Figure

- `induzione-tessere-domino`, fuori dai riquadri.
- `somma-dispari-quadrato-cornici`, dentro l'esempio 2: le cornici a L di $1, 3, 5, 7$ quadretti.
- Nessun blocco `grafico`: non c'è un piano cartesiano.
- Guardate in chiaro e in scuro con `anteprima.mjs`.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Nessuno. L'unico candidato era l'esempio 6: i punti di $2^n$ e la retta $y = an + 1$ con il cursore $a$, per vedere la base spostarsi. Scartato: un piano mostra i primi casi, e la lezione dice proprio che i primi casi non dimostrano niente.

## Domande per Andrea

- L'induzione al terzo anno la fate davvero, e fin dove? La disuguaglianza di Bernoulli (esempio 7) e la somma dei quadrati (esempio 3) sono al livello giusto?
- Serve l'induzione forte, almeno in un riquadro?
- Il passo induttivo scritto con $k$ e la tesi con $k + 1$: va bene, o usate $n$ e $n + 1$?
- L'attribuzione a Eulero di $n^2 + n + 41$ e a Peano degli assiomi è data senza data e senza fonte: basta così?

## Da verificare

- La nota storica: Eulero per $n^2 + n + 41$ e Peano "alla fine dell'Ottocento" vengono dalla mia conoscenza, non da una fonte controllata.

Prerequisiti proposti: successioni-numeriche, logica-implicazione, logica-quantificatori, polinomi-prodotti-notevoli
