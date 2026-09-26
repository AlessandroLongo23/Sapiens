# Note: Prodotti notevoli

Lezione nuova, scritta da zero (lotto 3). Tutti gli sviluppi di lezione, formulario e carte sono stati rifatti con SymPy (`expand`), compresi i passaggi intermedi (i coefficienti dei doppi e tripli prodotti, le potenze dei termini negli esempi 7, 12 e 15) e i controlli numerici $(3 + 4)^2 = 49$, $(1 + 1)^3 = 8$.

## Struttura ed esempi

Cinque sezioni nell'ordine del brief: somma per differenza, quadrato di un binomio, quadrato di un trinomio, cubo di un binomio, potenza di un binomio con il triangolo di Tartaglia (in fondo, breve). Ogni sezione ha formula, "da dove viene" (lo sviluppo con la proprietà distributiva) ed esempi dal semplice allo scomodo: 17 esempi svolti in tutto (4 + 5 + 3 + 4 + 1). Il quadrato di un binomio, che è quello che si usa di più, ha anche il procedimento in cinque passi.

Gli errori frequenti sono sei riquadri, ognuno dopo la regola a cui si riferisce: termini scambiati nella somma per differenza, $(a + b)^2 = a^2 + b^2$ (con la verifica numerica e il rimando ai due rettangoli della figura), il coefficiente dimenticato nel quadrato, un doppio prodotto dimenticato nel trinomio, $(a + b)^3 = a^3 + b^3$, $(a - b)^3$ scambiato con $(b - a)^3$.

## Scelte di convenzione

- Il nome del prodotto è "somma per differenza", come nella maggior parte dei libri; "differenza di quadrati" resta il nome del polinomio $a^2 - b^2$, che è quello che usa la lezione 35 per la scomposizione. Da tenere allineato.
- La regola della somma per differenza è detta con "termine uguale" e "termine che cambia segno", non con "primo" e "secondo": così copre $(-x + 4)(x + 4)$ senza riordinare. I libri spesso dicono "quadrato del primo meno quadrato del secondo" e poi fanno riordinare; mi sembra la causa dell'errore più comune.
- Nel quadrato di un trinomio i doppi prodotti sono scritti come $2ab + 2ac + 2bc$ dopo i tre quadrati, come nei libri più diffusi. Alcuni libri li alternano ($a^2 + b^2 + c^2 + 2ab + 2bc + 2ac$): l'ordine non conta, ma formulario e generatore dovrebbero usare lo stesso.
- Risultati ordinati secondo le potenze decrescenti di una lettera, come dice il brief di lotto. Nell'esempio 4 ho scritto anche il passaggio $16 - x^2 = -x^2 + 16$; negli esempi con due lettere (10, 12) ordino secondo $x$ (o $a$) e dentro i termini con lo stesso grado in $x$ lascio la $y$ (o $b$) decrescente.
- La potenza di un binomio non usa il simbolo $\binom{n}{k}$ né la parola "coefficiente binomiale", che sono del triennio. Si dice solo che i coefficienti sono la riga $n$ del triangolo. La riga $0$ c'è nella figura, con la spiegazione $(a + b)^0 = 1$.
- Somma e differenza di cubi, $(a \pm b)(a^2 \mp ab + b^2)$, non ci sono: sono nella lezione 35.

## Lasciato ad altre lezioni

- Il prodotto di polinomi con la proprietà distributiva è nella lezione 29, con un link nella prima riga. La lezione 29 chiude già con una riga e il link a questa: va bene così.
- Espressioni che contengono prodotti notevoli e il riconoscimento dentro un'espressione: lezione 31. Qui nessuna espressione con più di un prodotto.
- La lettura "al contrario" (scomporre $x^2 - 9$) è nella 35, che linka già questa lezione.

## Da controllare in lezioni già scritte

- 17-equazioni-secondo-grado, riga 137 e riga 342: nominano il quadrato di un binomio senza link. Si può aggiungere un link a questa lezione al primo "quadrato di un binomio".
- Nessuna lezione già scritta spiega i prodotti notevoli, quindi non c'è niente da togliere.

## Figure

Due, entrambe compilate con `scripts/figure/compile.mjs` e guardate in chiaro (convertite in PNG):

- `quadrato-di-un-binomio-aree`: il quadrato di lato $a + b$ diviso in $a^2$, $b^2$ e due rettangoli $ab$ colorati in `blue!20`, lo stesso colore delle figure di Venn già pubblicate. I colorati sono i due rettangoli perché sono la parte che si dimentica nell'errore $(a + b)^2 = a^2 + b^2$. Il testo precisa "per $a$ e $b$ positivi".
- `triangolo-di-tartaglia`: righe da $0$ a $6$ con l'etichetta $n$ a sinistra e due frecce che mostrano $3 + 3 = 6$.

Niente `\clip`, niente riempimenti bianchi. Non le ho viste sul sito in tema scuro: il testo nero dei nodi dovrebbe diventare chiaro come nelle altre figure, ma il `blue!20` sotto le etichette $ab$ va guardato. Nel formulario non ho copiato figure: il triangolo è una tabella con le righe da $2$ a $6$.

## Formulario e flashcard

- Formulario con le cinque formule, un esempio di una riga ciascuna, la tabella delle righe del triangolo e tre errori (quadrato di una somma, coefficiente nel quadrato, segno nella somma per differenza).
- 20 carte, nell'ordine della lezione. `cubo-binomio-conto` ($(x + 1)^3$) e `somma-per-differenza-riconoscere` ($(x - 3)(x - 3)$) usano espressioni che non sono esempi della lezione; le regole sì.
- `check.mts` non dà errori. Dà un avviso sul titolo "Potenza di un binomio e triangolo di Tartaglia" per la maiuscola di "Tartaglia", che è un nome proprio: da ignorare.

## Livelli per gli esercizi

1. Somma per differenza con un numero: $(x + 7)(x - 7) = x^2 - 49$.
2. Quadrato o cubo di un binomio con un numero: $(x - 4)^2 = x^2 - 8x + 16$, $(x + 2)^3 = x^3 + 6x^2 + 12x + 8$.
3. Quadrato di un binomio con coefficienti e due lettere: $(3x - 2y)^2 = 9x^2 - 12xy + 4y^2$; somma per differenza con il termine uguale non al primo posto: $(-x + 4)(x + 4) = -x^2 + 16$.
4. Coefficienti frazionari e monomi di grado più alto: $\left(\frac{1}{2}a^2 + 4b\right)^2$, $\left(\frac{1}{3}a - 3b^2\right)^3$.
5. Quadrato di un trinomio con riduzione dei simili: $(x^2 - 3x + 1)^2 = x^4 - 6x^3 + 11x^2 - 6x + 1$.
6. Potenza con il triangolo e un segno meno: $(x - 2)^4 = x^4 - 8x^3 + 24x^2 - 32x + 16$.

## Prerequisiti

La riga `polinomi-prodotti-notevoli <- polinomi-operazioni` va bene così. Tutto quello che la lezione usa è il prodotto di polinomi con la proprietà distributiva e la riduzione dei termini simili (lezione 29), che porta con sé le operazioni tra monomi, compresa la potenza di un monomio che serve in ogni esempio. Le frazioni degli esempi sono quelle di Operazioni in ℚ, già a monte della catena dei monomi. Il triangolo di Tartaglia non richiede nulla in più.
