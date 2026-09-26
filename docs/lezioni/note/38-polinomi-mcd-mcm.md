# Note: MCD e MCM di polinomi

Lezione nuova, scritta da zero (lotto 3). Tutti i conti di lezione, formulario e carte (scomposizioni, MCD e MCM, il controllo MCD per MCM, le potenze dei fattori opposti) sono stati rifatti con SymPy (`factor`, `gcd`, `lcm`, `expand`).

## Scelte di convenzione

- Fattore numerico con la stessa convenzione della lezione 14: fattori numerici tutti interi, MCD e MCM dei valori assoluti; almeno una frazione, fattore $1$; sempre positivo. Il "fattore numerico" è il numero che resta davanti dopo la scomposizione ($6$ in $6x(x+1)$, $-1$ in $-(x-3)(x+3)$). Se la convenzione della 14 cambia, va cambiata anche qui (passo 3, tabella del formulario, carte `fattore-numerico-interi`, `fattore-numerico-frazioni`, `mcd-conto`).
- Fattori opposti: si sceglie la forma con il primo termine positivo, ordinando secondo le potenze decrescenti di $x$ ($x - 3$, $x - y$). Un riquadro `ad-note` dice che molti libri accettano anche $3 - x$, perché MCD e MCM sono definiti a meno del segno. Da verificare se i libri adottati fissano una forma.
- Scomposizione in ℤ, come nel resto del lotto. L'unico esempio con frazioni è l'esempio 6, dove si raccoglie un coefficiente frazionario ($\frac{1}{2}(x^2 - 4)$) per mostrare la convenzione del fattore $1$.
- "Primi tra loro" definito per i polinomi come "senza fattori comuni, a parte i numeri", con MCD $1$. Con fattori numerici interi non coprimi (per esempio $2(x-3)$ e $4(x+3)$) il MCD con la convenzione è $2$: la lezione lo copre con il passo 4 ("il MCD è solo il fattore numerico"), formulario e carta dicono "solo un numero, per esempio $1$".
- Il risultato si lascia scomposto (passo 6), perché è la forma che serve per il denominatore comune.
- "Esponente minore/maggiore" come nel brief del lotto; la lezione 14 dice "minimo/massimo". Differenza voluta per seguire il brief, ma si può uniformare.

## Lasciato ad altre lezioni

- Tutte le tecniche di scomposizione (34-37): qui solo i link nel passo 1 e una riga per ogni scomposizione negli esempi.
- La definizione di polinomio irriducibile è nella 34: qui una frase non in grassetto, con il link.
- La divisibilità come resto nullo è nella 32: qui solo il link.
- Frazioni algebriche: una frase nell'apertura ("ti servirà come denominatore comune"), senza link perché le lezioni non sono ancora scritte. Quando ci saranno, il link va nell'apertura.

## Da togliere o cambiare in lezioni già scritte

- Lezione 14: la tabella "Dai numeri ai polinomi" di questa lezione potrebbe essere richiamata con un link in fondo alla 14 ("lo stesso metodo vale per i polinomi"). Facoltativo.
- Nessuna lezione già scritta tratta MCD e MCM di polinomi, quindi niente da togliere.

## Figure

Nessuna. La lezione è un procedimento su scomposizioni scritte; l'analogia numeri, monomi, polinomi è una tabella (confronto vero, ammesso da `stile.md`). Non vedo una figura che chiarisca più della tabella.

## Esempi

Sei esempi svolti: due binomi con raccoglimento e fattori numerici; esponenti diversi con tre polinomi; fattori opposti ($9 - x^2$); due lettere; differenza di cubi con falso quadrato e trinomio; fattori numerici frazionari. Quattro riquadri di errore vicino alla regola (scomposizione incompleta, termini confusi con fattori, fattore non comune nel MCD, somma scambiata per opposto) e uno sul falso quadrato nel MCM.

## Formulario e flashcard

- 20 carte. `mcm-conto` e `mcd-esponenti-conto` usano i polinomi già scomposti dell'esempio 2 (primo e terzo), per restare conti da pochi secondi.
- Nel formulario tre esempi di una riga (esempi 1, 3, 4).

## Prerequisiti

La riga `polinomi-mcd-mcm <- scomposizione-prodotti-notevoli, scomposizione-trinomio` va bene per l'essenziale: gli esempi usano raccoglimento (antenato di tutte e due), differenza di quadrati, quadrato di binomio, differenza di cubi e trinomio. Proporrei di aggiungere `monomi-mcm-mcd`: la convenzione sul fattore numerico e il confronto degli esponenti vengono da lì, e oggi ci si arriva solo passando per `scomposizione-raccoglimento`, arco che il ripasso potrebbe non seguire. Non aggiungerei `scomposizione-ruffini`: la lezione lo cita nel passo 1 ma nessun esempio lo usa.
