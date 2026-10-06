# Note: Equazioni logaritmiche

Lezione nuova (lotto del terzo anno, gruppo F, 5 ottobre 2026). Conti rifatti con SymPy (`verifica.py` nella cartella temporanea `gruppo-f`): per ogni esempio le soluzioni dell'equazione algebrica, l'intersezione con le condizioni di esistenza, le verifiche numeriche scritte nel testo e i valori approssimati degli esempi 11-14.

## Scelte

- Due forme a cui ricondursi: $\log_a f(x) = c$ (definizione) e $\log_a f(x) = \log_a g(x)$ (iniettività, dalla 125). Tutto il resto è "arrivare a una delle due".
- Condizioni di esistenza scritte prima, con la sigla C.E. come nelle lezioni sulle frazioni algebriche. La lezione dice che in alternativa si può sostituire nell'equazione di partenza, e negli esempi 2 e 3 fa così; dal procedimento in poi usa le C.E.
- La soluzione estranea dell'esempio 5 è spiegata con una figura: il ramo in più di $\log_2 [x(x - 2)]$ per $x < 0$.
- Esponente pari: l'avviso mostra che $\log_2 x^2 = 4$ ha due soluzioni, e rimanda a $\log_a x^2 = 2\log_a |x|$ della 124.
- Sostituzione: un solo esempio, scelto perché $t = -1$ è accettabile, con il confronto esplicito con la sostituzione $t = a^x$ della 122.
- Basi diverse: un esempio con il cambiamento di base. L'incognita nella base ($\log_x 4 = 2$) è nella 124, esempio 3; equazioni con l'incognita sia nella base sia nell'argomento non ci sono.
- Sezione sulle esponenziali, secondo il confine dato con il gruppo E: $a^{f(x)} = b$ con la definizione, basi diverse nei due membri con il logaritmo dei due membri, la sostituzione che finisce in $2^x = 3$, e il tempo di raddoppio. Le soluzioni si lasciano come logaritmo esatto, con il valore approssimato accanto.
- Metodo grafico: una sezione corta in fondo con $\log_2 x = 3 - x$, che ha la soluzione $x = 2$ verificabile.
- Un blocco `grafico`: $\log_a x$ e la retta $y = c$, con il valore $a^c$.

## Domande per Andrea

- Condizioni di esistenza prima o verifica delle soluzioni alla fine? La lezione insegna le C.E. e ammette la verifica come alternativa: va bene, o i tuoi studenti devono fare sempre una delle due?
- Le soluzioni come $x = \log_2 5$ si lasciano esatte, con l'approssimazione solo se richiesta. In verifica chiedete anche la forma con un solo tipo di logaritmo ($\frac{\log 5}{\log 2}$)?
- Nell'esempio 12 la soluzione è scritta $\frac{\log 2}{\log 3 - \log 2}$. Preferisci la forma $\log_{\frac{3}{2}} 2$, ottenuta dividendo per $2^x$ prima di passare ai logaritmi?
- La scrittura $\log_a^2 x$ per $(\log_a x)^2$: la usate, o preferite sempre le parentesi?
- L'esempio del capitale al $3\%$ usa la capitalizzazione annua: è coerente con quello che la 121 dice della crescita esponenziale?

## Da verificare

- Il blocco `grafico` passa `check.mts` ma non è stato aperto nel browser.
- Nella figura della soluzione estranea il ramo tratteggiato e il pallino vuoto in $(-2, 3)$ si leggono bene nell'anteprima; da guardare sul telefono.
- La 122 rimanda a questa lezione per $2^x = 5$ con l'esempio $t^2 - 7t + 10 = 0$; qui l'esempio 13 è $4^x - 5 \cdot 2^x + 6 = 0$, diverso. Se si vuole la continuità tra le due lezioni, si può usare lo stesso.

## Formulario e flashcard

- Formulario senza figure. 18 carte.

## Piani con i cursori (fase 3, 5 ottobre 2026)

Tre piani, aperti su `/prova-grafico/lezione` a 390 px ai valori iniziali, agli estremi e nei casi limite.

- `equazione-logaritmica-cursori` (cambiato): il punto di incontro è $P(a^c, \log_a a^c)$, con le coordinate sotto il piano, così per $a = 1$ sparisce insieme alla curva (prima restava fermo in $(1, c)$). Aggiunto il paragrafo con le risposte.
- `equazione-logaritmica-soluzione-estranea-cursore` (nuovo), dopo l'esempio 5, copertina `equazione-logaritmica-soluzione-estranea`: le due curve dell'esempio e la retta $y = c$, con le due radici $1 \pm \sqrt{1 + 2^c}$ sotto il piano. Mostra che la radice da scartare c'è per ogni $c$.
- `equazione-logaritmica-metodo-grafico-cursore` (nuovo), sezione "Quando i conti non bastano", copertina `equazione-logaritmica-metodo-grafico`: $y = \log_2 x$ e la retta $y = k - x$. Una sola soluzione per ogni $k$. Non c'è un valore sotto il piano: la soluzione non ha una formula.

Scartati: un piano per $a^x = b$ (c'è già nella 124); uno per le due curve di $\log_a f(x) = \log_a g(x)$, perché nell'esempio 3 la base non cambia le soluzioni; uno per la sostituzione.

Prerequisiti proposti: logaritmi-proprieta, funzioni-logaritmiche, equazioni-secondo-grado, equazioni-esponenziali
