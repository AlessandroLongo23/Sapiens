# Note: Quantificatori

Lezione nuova, scritta da zero (lotto 6). Tutti i conti di lezione, formulario e carte li ho rifatti in Python (`67-verifica.py` nello scratchpad del lotto): gli insiemi di verità dell'esempio 1 con `set` su $\{1, \dots, 10\}$; $2x > x$ e $2x \ge x$ in $\mathbb{N}$; $n^2 + n + 41$ primo per $n$ da 0 a 39 e $40^2 + 40 + 41 = 1681 = 41^2$ (con `sympy.isprime`); $x + 3 = 1$, $x \ge 0$ e $2x = 1$ in $\mathbb{N}$, $\mathbb{Z}$ e $\mathbb{Q}$ (con `Fraction`, sui razionali con denominatore fino a 20); le soluzioni di $x + 3 = 5$ e $x^2 = 4$ per $\exists$ ed $\exists!$; le tre proposizioni dell'esempio 6 e le loro negazioni ($x^2 \ge x$ vera in $\mathbb{Z}$ e falsa in $\mathbb{Q}$ con $\frac{1}{2}$); i due quantificatori ($\forall x\, \exists y : y = x + 1$ e $y > x$, nei due ordini, su un tratto finito di $\mathbb{N}$). Le due leggi di negazione e le equivalenze "$\forall$ vera se e solo se $V_p = U$", "$\exists$ vera se e solo se $V_p \ne \emptyset$", "$V_{\neg p} = \overline{V_p}$" le ho controllate su tutti i 16 predicati possibili in un universo di 4 elementi (`itertools.product`).

## Scelte di convenzione (da verificare con il libro in uso)

- Scritture: $\forall x \in U,\ p(x)$ con la virgola, $\exists x \in U : p(x)$ con i due punti, come dice il brief del lotto. La lezione dice che alcuni libri usano la barra $\mid$ dopo $\exists$. Altri scrivono i due punti anche dopo $\forall$, o mettono $p(x)$ tra parentesi: non l'ho citato per non moltiplicare le varianti. Se 65 e 66 scelgono diversamente, va allineata.
- "Enunciato aperto" come termine principale, "predicato" citato una volta. Alcuni libri dicono "forma proposizionale" o "proposizione aperta": non li ho citati.
- Insieme di verità $V_p = \{x \in U \mid p(x)\}$, come concordato con la 66. L'universo si chiama $U$ e ho detto una volta "(o dominio)".
- Negazione $\neg p(x)$, come nella convenzione del lotto; non ho usato $\overline{p}$ per non confonderlo con il complementare $\overline{V_p}$, che compare nella stessa sezione.
- Le leggi di negazione sono scritte con "equivale a" in parole, non con $\Leftrightarrow$: l'equivalenza logica ha la sua lezione (66), che non è prerequisito di questa.
- $\exists!$ letto "esiste uno e un solo", in un riquadro `ad-note`.
- Nella tabella dell'universo compare $\mathbb{Q}$, e nell'esempio 6 il controesempio $\frac{1}{2}$: le frazioni si conoscono dalle medie, ma $\mathbb{Q}$ non è un prerequisito nell'albero. Se si vuole restare in $\mathbb{N}$ e $\mathbb{Z}$, si toglie la colonna e l'ultima frase dell'esempio 6 senza altre conseguenze.

## Lasciato ad altre lezioni

- Proposizioni, connettivi e negazione (65): link in apertura, non rispiegati.
- Proprietà caratteristica (02): l'insieme di verità è presentato come la stessa scrittura, con il link.
- Implicazione (66): una frase sulle frasi del tipo "ogni numero divisibile per 4 è pari", con il link. Niente $p(x) \Rightarrow q(x)$ e inclusione degli insiemi di verità, che sono della 66.
- Complementare (64): usato per $V_{\neg p} = \overline{V_p}$, con il link.
- Numeri primi (19): link nell'esempio 5.
- Due quantificatori: solo il cenno chiesto dal brief, con il successivo e con "più grande di tutti"; niente negazione di proposizioni con due quantificatori.

## Figure

Due, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro (anteprima PNG); non le ho viste sul sito in tema scuro. Stesse misure della 03 (rettangolo 6×4, cerchio di raggio 1.4, `blue!20`), niente `\clip`, niente bianchi.
- `insieme-verita-divisori-12` (231×155), dentro l'esempio 1: $U = \{1, \dots, 10\}$, $V_p$ colorato con 1, 2, 3, 4, 6, fuori 5, 7, 8, 9, 10.
- `quantificatori-insieme-verita-controesempio` (231×155), nella sezione "Quantificatori e insiemi": $V_p$ colorato, $\overline{V_p}$ etichettato e un punto $a$ fuori, il controesempio.

Nessun circuito: servono alla 65, non qui. Nessuna figura nel formulario.

## Formulario e flashcard

- Formulario: tabella dei due quantificatori con lettura e condizione sugli insiemi, i quattro casi di "come si dimostra" in passi, le due leggi di negazione, la tabella degli universi, i due quantificatori in una riga, tre avvisi.
- 20 carte. Tutte usano esempi o regole della lezione.

## Prerequisiti

La riga `logica-quantificatori <- logica-proposizioni, insiemi-rappresentazione` va bene così. La lezione usa la nozione di proposizione e la negazione (65) e la proprietà caratteristica (02), su cui si appoggia tutto l'insieme di verità. Il complementare (64) compare in una sola frase della sezione "Quantificatori e insiemi", con il link: si segue anche senza, quindi non lo aggiungerei. Nemmeno la 66, citata solo per l'implicazione.

## Per il generatore

1. Proposizione o enunciato aperto: riconoscere quali frasi sono enunciati aperti e dire se $p(a)$ è vera per un valore dato.
2. Insieme di verità in un universo finito piccolo (da 6 a 12 numeri), con condizioni come divisori, multipli, disuguaglianze, equazioni di primo grado; compresi i casi $V_p = \emptyset$ e $V_p = U$.
3. Valore di verità di $\forall$ ed $\exists$ in un universo finito o in $\mathbb{N}$, con il controesempio da indicare quando un $\forall$ è falso (anche lo $0$).
4. Lo stesso enunciato in $\mathbb{N}$, $\mathbb{Z}$ e $\mathbb{Q}$: dire in quali universi è vero (equazioni $ax + b = c$, disuguaglianze).
5. Tradurre: dalla frase in italiano ("tutti", "qualche", "nessuno", "non tutti") alla scrittura con i simboli, e viceversa.
6. Negare: proposizioni con un quantificatore, in simboli e in italiano, comprese le disuguaglianze ($>$ diventa $\le$) e il controllo che una delle due sia vera e l'altra falsa.
7. Due quantificatori: vero o falso per coppie come $\forall x\ \exists y$ ed $\exists y\ \forall x$ con $y = x + 1$, $y > x$, $x + y = 0$ in $\mathbb{N}$ e in $\mathbb{Z}$.
