# Note: Proposizioni e connettivi logici

Lezione nuova, scritta da zero (lotto 6). Tutti i conti di lezione, formulario e carte sono stati rifatti in Python (`scratchpad/65-verifica.py`): l'ordine delle righe con `itertools.product`, le tavole di $\neg$, $\wedge$, $\vee$, $\dot\vee$, le tavole degli esempi 2, 3, 4 e 5, la tautologia $\neg(p \wedge q) \vee p$ e la contraddizione $(p \vee q) \wedge (\neg p \wedge \neg q)$, le due leggi di De Morgan, l'equivalenza $(p \vee q) \wedge \neg p \Leftrightarrow \neg p \wedge q$, le righe in cui $\neg p \wedge q$ e $\neg(p \wedge q)$ differiscono (VF e FF), $2^{10} = 1024$, i valori dell'esempio 6, la carta `calcolo-composta` e l'esempio con gli insiemi (numeri da 1 a 10 né pari né multipli di 3: $\{1, 5, 7\}$, controllato anche con De Morgan sugli insiemi).

## Scelte di convenzione (da verificare con il libro in uso)

- Convenzioni comuni del lotto: lettere minuscole $p$, $q$, $r$; valori V e F; $\neg p$ (citato $\overline{p}$), $\wedge$, $\vee$, $p \,\dot\vee\, q$ con "aut"; righe nell'ordine VV, VF, FV, FF.
- Precedenza: la lezione dice solo che $\neg$ si applica per prima e che tra $\wedge$ e $\vee$ i libri non sono d'accordo, quindi si mettono le parentesi. Non ho scritto la precedenza di $\to$ e $\leftrightarrow$, che spetta alla 66.
- Equivalenza tra proposizioni scritta con $\Leftrightarrow$, letto "è equivalente a", come nella convenzione del lotto; il legame con il "se e solo se" è rimandato alla 66 con un link. Alcuni libri usano $\equiv$ o $=$ per l'equivalenza nel primo capitolo: da verificare.
- La colonna finale delle tavole negli esempi si chiama "risultato" invece di ripetere la formula intera, per restare entro cinque o sei colonne strette a 390 px. La tavola dell'esempio 3 ha sei colonne.
- "Proposizione" definita come frase "di cui si può dire in modo oggettivo se è vera o falsa"; l'esempio del Monte Bianco (4805 m, vero) mostra che conta il valore di verità, non il fatto di conoscerlo. Ho evitato frasi sul futuro ("domani pioverà"), su cui i libri non sono d'accordo.
- "Ma" e la virgola come congiunzione: una frase sola, nella sezione della congiunzione.
- I nomi "principio del terzo escluso" e "principio di non contraddizione" sono citati tra parentesi, senza grassetto.

## Lasciato ad altre lezioni

- Enunciati aperti e quantificatori (67): solo il caso "$x + 3 = 5$" tra le frasi che non sono proposizioni, con il link.
- Implicazione e doppia implicazione (66): una frase in fondo che le annuncia, e il link dal simbolo $\Leftrightarrow$.
- Operazioni tra insiemi (05, 63, 64, 03): una sezione breve con una tabella di corrispondenza e un esempio numerico di una riga; le leggi di De Morgan per gli insiemi sono citate con il link alla 03.
- Non ho messo le proprietà associativa e distributiva di $\wedge$ e $\vee$: solo la commutativa, come esempio di equivalenza. Se il generatore o la 66 ne hanno bisogno, si aggiunge una tabella come quella della 03.

## Figure

Due, compilate con `compileFigure` di `scripts/figure/compile.mjs` e guardate in chiaro (anteprima PNG):
- `circuito-interruttori-serie-congiunzione` (193×110): pila, due interruttori aperti $p$ e $q$ in serie, lampadina.
- `circuito-interruttori-parallelo-disgiunzione` (193×137): stessi elementi, interruttori su due rami in parallelo.

Solo linee e punti neri, niente riempimenti, niente `\clip`: nel tema scuro diventano bianchi. L'anteprima scura del mio script è uscita vuota (problema dello screenshot, non dell'SVG); non le ho viste sul sito in tema scuro. Nessuna figura nel formulario. Nessun diagramma di Venn: la sezione sugli insiemi rimanda alle lezioni che li hanno.

## Formulario e flashcard

- Il formulario raccoglie in una tabella di sei colonne le quattro tavole dei connettivi (la lezione le ha separate). La tabella "Connettivi" ha quattro colonne con testo: a 390 px potrebbe andare a capo in più righe, da guardare sul sito.
- 20 carte, nell'ordine della lezione. La carta `circuito-serie` usa la figura solo a parole.

## Prerequisiti

La riga `logica-proposizioni <-` (lezione di base) va bene così, e scioglie il dubbio di `prerequisiti.md` in questo senso: la lezione si segue per intero senza gli insiemi. La sezione "Connettivi e operazioni tra insiemi" è l'ultima, è breve e fa da collegamento con i link a 05, 63, 64 e 03; chi non ha visto le operazioni la salta senza perdere niente del resto. Aggiungere `insiemi-operazioni` come prerequisito metterebbe la logica dopo tutto il blocco degli insiemi per una sezione di collegamento, contro la regola "un prerequisito è una lezione senza la quale non si segue questa". Se in futuro la sezione crescesse (per esempio con gli insiemi di verità, che però sono della 67), l'arco giusto sarebbe verso `insiemi-operazioni`.

## Per il generatore

1. Riconoscere le proposizioni: dire se una frase è una proposizione (domande, ordini, opinioni, frasi con variabile) e, se lo è, il suo valore di verità (fatti numerici semplici come $2^{10} > 1000$).
2. Valore di verità di una proposizione composta con un solo connettivo ($\neg$, $\wedge$, $\vee$, $\dot\vee$), date le proposizioni atomiche con i numeri ("12 è pari e multiplo di 5"), compresa la negazione di $>$, $<$, $\geq$.
3. Valore di una proposizione composta con due o tre connettivi, dati i valori di $p$, $q$, $r$ (una riga della tavola), con attenzione alla precedenza di $\neg$.
4. Tavola di verità completa con due lettere (quattro righe), come nell'esempio 2.
5. Tavola con tre lettere (otto righe), come nell'esempio 3.
6. Tautologia, contraddizione o nessuna delle due; stabilire se due proposizioni sono equivalenti (con la riga che lo smentisce quando non lo sono).
7. Negare con De Morgan: frasi del linguaggio comune e frasi con i numeri ("15 è multiplo di 3 e di 5", "8 è maggiore di 5 o minore di 2").
