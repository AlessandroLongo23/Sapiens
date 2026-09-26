# Note: Dominio, codominio e immagine

Lezione nuova, scritta da zero (lotto 4). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: i valori assoluti e i resti delle tabelle, le controimmagini ($5 - 2x = 9$, $5 - 2x = 4$, $2x + 1 = 7$, $2x + 1 = 4$, $x^2 = 9$ e $x^2 = 5$ negli interi), $f(-2) = 1$ dell'esempio 5, i domini degli esempi 6-10 (`solve` sul denominatore, `singularities`, `solveset` di $x^2 + 4$ in ℝ), la semplificazione dell'esempio 10 (`factor`, `cancel`). I giorni dei mesi con il modulo `calendar` di Python su un anno non bisestile. Dieci esempi svolti, due figure.

## Scelte di convenzione

- Insieme immagine: notazione principale $f(A)$, come chiede il brief del lotto, con $\mathrm{Im}(f)$ citato come scrittura equivalente perché è quella che usa la lezione 18. Il nome è "insieme immagine"; la 18 dice "l'immagine di $f$". Se si vuole una sola notazione in tutto il capitolo, conviene decidere qui e allineare la 18.
- Dominio indicato con $D$, codominio senza simbolo. Il dominio di una relazione (lezione 40) è l'insieme di partenza, come qui: va controllato quando la 40 è scritta, perché alcuni libri chiamano dominio di una relazione l'insieme dei primi elementi delle coppie.
- Controimmagine: "una controimmagine di $y$" è ogni $x$ con $f(x) = y$, al singolare anche quando sono più d'una. Non uso la scrittura $f^{-1}(y)$; un riquadro `ad-note` la cita e avverte che non è la funzione inversa. Il riquadro si può togliere senza toccare il resto.
- Dominio naturale scritto come $\mathbb{R} \setminus \{2\}$ (la differenza è nella lezione 03) e una volta come $\{x \in \mathbb{R} \mid x \neq 2\}$. Niente intervalli: nel primo anno non hanno una lezione prima delle disequazioni, e l'immagine di $x^2$ negli interi si scrive per elenco.
- "Campo di esistenza" come sinonimo di dominio naturale, e il legame con "C.E.: $x \neq 2$" delle frazioni algebriche detto una volta. La sigla C.E. della 46 vuol dire "condizioni di esistenza": ho scritto che la condizione è la stessa, senza sovrapporre le due sigle.
- $\mathbb{R}$ arriva al secondo anno (Numeri irrazionali e numeri reali): lo introduco con una parentesi e un link, come fa di fatto la 18 che usa $\mathbb{R}$ senza spiegarlo.

## Lasciato ad altre lezioni

- Definizione di funzione, notazione $x \mapsto f(x)$, grafico per punti: link alla 42. Uso il grafico per punti in una sezione breve, solo per leggere dominio e immagine sugli assi.
- Suriettività: una frase ($f(A) = B$) e il link alla 18.
- Condizioni di esistenza con denominatori da scomporre e legge di annullamento del prodotto: l'esempio 7 la usa con una frase e rimanda alla 46; la scomposizione è un raccoglimento totale, con link alla 34.
- Semplificazione: l'esempio 10 la usa ($x^2 - 1 = (x - 1)(x + 1)$) e rimanda alla 47. La differenza di quadrati non ha link alla 35 per non affollare l'esempio.
- Radici e logaritmi esclusi, come chiede il brief. Immagine di funzioni reali (per esempio $x^2$ su ℝ) lasciata fuori: senza intervalli e radici non si scrive bene. Gli esempi sull'immagine con infiniti elementi sono su ℤ e ℚ.

## Da togliere o cambiare nella lezione 18

La sezione "Dominio, codominio e immagine" della 18 oggi dà le tre definizioni e l'esempio $f(x) = x^2$ da $\{-1, 0, 1, 2\}$ a $\{0, 1, 2, 3, 4\}$ con il diagramma a frecce. L'esempio e il diagramma servono alle sezioni seguenti ("la funzione $f(x) = x^2$ dell'esempio precedente"), quindi vanno tenuti. Proposta:

- rinominare la sezione in "Un esempio con il diagramma a frecce";
- sostituire l'elenco puntato delle tre definizioni con una frase: "Ti servono i nomi di [Dominio, codominio e immagine](…): il dominio $A$, il codominio $B$ e l'insieme immagine $f(A)$, cioè i valori che $f$ assume davvero, che è sempre contenuto in $B$.";
- se si sceglie $f(A)$ come notazione unica, cambiare $\mathrm{Im}(f)$ in $f(A)$ nella definizione di suriettiva e nel formulario e nelle carte della 18.

Il resto della sezione (esempio, figura, frase sulle frecce in partenza e in arrivo) resta com'è.

## Figure

1. `diagramma-frecce-valore-assoluto-immagine`: diagramma a frecce di $|x|$ da $\{-2, -1, 0, 1, 2\}$ a $\{0, 1, 2, 3\}$, con l'insieme immagine $\{0, 1, 2\}$ su un rettangolo arrotondato `blue!15` dentro l'ellisse di $B$ e l'etichetta $f(A)$ a destra. Stesso stile dei diagrammi della 18.
2. `grafico-dominio-immagine-valore-assoluto`: i cinque punti del grafico di $|x|$, con il dominio segnato sull'asse $x$ (`blue!45`) e l'immagine sull'asse $y$ (`orange!60`), tratteggi grigi dai punti agli assi. Il testo nomina i colori ("in blu", "in arancione"): nel tema scuro `hue-rotate(180deg)` dopo `invert(1)` dovrebbe conservare la tinta, ma va guardato.

Tutte e due compilate con `compileFigure` di `scripts/figure/compile.mjs` (209×245 e 232×150) e guardate in chiaro; nella seconda ho spostato le etichette $1$ e $2$ a destra dell'asse $y$ perché a sinistra finivano sui tratteggi. Niente `\clip`, niente riempimenti bianchi. Non le ho viste sul sito in tema scuro. Nessuna figura nel formulario.

## Dubbi

- La tabella di valori dentro l'esempio 1 ha sette colonne: sul telefono dovrebbe stare in un riquadro di 280 px, ma va guardata.
- L'esempio 3 dice che l'immagine di $2x + 1$ da ℚ a ℚ è tutto ℚ senza dimostrarlo in dettaglio (la frase prima dà $x = \frac{y - 1}{2}$ per gli interi; per i razionali vale lo stesso).
- L'apertura con i voti usa voti interi da $1$ a $10$; i voti con il mezzo ($6{,}5$) cambierebbero il codominio ma non il senso.

## Formulario e flashcard

- Il formulario non ha figure. Ha una tabella a due righe (polinomio, frazione) e i tre errori più costosi: codominio e immagine, zeri del numeratore, semplificare prima.
- 19 carte. Tutti i conti delle carte sono nella lezione; la carta `immagine-conto` usa $f(x) = 5 - 2x$ senza dire il dominio, come l'avviso della lezione.

## Prerequisiti

La riga `dominio-codominio-immagine <- definizione-funzione` va cambiata in `dominio-codominio-immagine <- definizione-funzione, equazioni-primo-grado`. Le controimmagini di una funzione data con una formula si trovano risolvendo $f(x) = y$, e il dominio naturale di una frazione si trova risolvendo denominatore $= 0$: senza le equazioni di primo grado metà della lezione non si segue. La scomposizione (esempio 7) e la semplificazione (esempio 10) compaiono in un esempio ciascuna, con il link: non sono prerequisiti. Il valore assoluto dell'esempio guida arriva già attraverso le lezioni sui numeri.

Conseguenza da valutare: con questo arco la lezione, e quindi la 18 e la 44, vengono dopo le equazioni, mentre molti libri mettono relazioni e funzioni prima dei polinomi. Se si vuole tenere il capitolo presto, l'alternativa è spostare la sezione sul dominio naturale nella 46 e lasciare qui solo gli insiemi finiti e le controimmagini a mente; ma la 18 usa già $2x + 1 = y$, quindi l'arco rispecchia quello che le lezioni scritte chiedono.

## Per il generatore

1. Immagine e controimmagini con un insieme finito dato con diagramma, elenco o tabella: dato $f$, trova $f(3)$ e le controimmagini di un elemento (anche nessuna o due).
2. Insieme immagine di una funzione con dominio finito data con una formula: $f(x) = |x|$ o $x^2 - 1$ su $\{-2, -1, 0, 1, 2\}$, confrontato con il codominio.
3. Immagine e controimmagine con una legge di primo grado, anche con il caso "nessuna controimmagine" in ℤ: $f(x) = 5 - 2x$, controimmagine di $9$; $f(x) = 2x + 1$, controimmagine di $4$ in ℤ e in ℚ.
4. Dominio naturale: polinomio o frazione con denominatore di primo grado, anche con soluzione frazionaria: $\frac{x + 4}{2x + 5}$, $D = \mathbb{R} \setminus \{-\frac{5}{2}\}$.
5. Dominio naturale con denominatore da scomporre (raccoglimento o differenza di quadrati) o con due frazioni: $\frac{x + 1}{x^2 - 3x}$, $\frac{1}{x} + \frac{2}{x + 1}$.
6. Casi scomodi del dominio: denominatore che non si annulla mai ($x^2 + 4$), numero al denominatore, frazione che si semplifica ($\frac{x^2 - 1}{x - 1}$), vero o falso sugli zeri del numeratore.
