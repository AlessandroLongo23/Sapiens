# Note: Probabilità della somma e dell'evento contrario

Lezione nuova, scritta da zero (lotto 9). Tutte le probabilità di lezione, formulario e carte sono ricalcolate nello stesso script della 94 (`lotto9/94/verify.py` nello scratchpad), contando gli esiti di spazi campionari enumerati con `itertools.product` e `fractions.Fraction`: le 25 coppie senza 6 e le 11 con almeno un 6, l'unico esito $CCC$, gli incompatibili "minore di 3" e "maggiore di 4" ($\frac{2}{3}$), asso o re ($\frac{1}{5}$), rossa o verde ($\frac{1}{2}$, anche come contrario di blu), coppe o figura ($\frac{19}{40}$, con le zone del Venn 7, 3, 9, 21), pari o maggiore di 3 ($\frac{2}{3}$, contro la somma sbagliata $1$), doppio o somma 8 (le cinque coppie con somma 8, l'intersezione $\{(4, 4)\}$, $\frac{5}{18}$), la classe di 25 studenti costruita studente per studente ($\frac{18}{25}$ e $\frac{7}{25}$), e le carte ($\frac{5}{6}$, $\frac{7}{10}$, $\frac{1}{36}$). Le somme di frazioni scritte nel testo sono ripetute con `sympy.Rational`. Il controllo `check.mts` passa sui tre file senza avvisi. Le formule in evidenza, misurate con KaTeX a 17 px in Chromium, sono larghe al massimo 255 px nella lezione e 219 px nel formulario; tre formule da una riga ($p(\text{asso o re})$, $p(\text{almeno una testa})$, $p(\text{rossa o verde})$, fino a 300 px) sono state spezzate con `aligned`, e la formula dell'unione per eventi compatibili è su due righe (con `{} &` per allineare il meno sotto il primo addendo).

## Struttura ed esempi

Apertura con i due problemi che le regole risolvono (almeno un 6, coppe o figura), link alla 94 per le definizioni e richiamo del mazzo. Evento contrario: dimostrazione con $\frac{n - k}{n}$, formula, "almeno uno" e "nessuno". Unione: eventi incompatibili (con la regola per più eventi incompatibili a due a due), eventi compatibili con la sottrazione di $p(A \cap B)$ e il link alla formula del numero di elementi dell'unione nella 63. Un paragrafo dice che $p(A \cap B)$ qui si calcola solo contando e che la formula della probabilità composta viene più avanti (senza link, perché la lezione è vuota). Poi "Incompatibili non vuol dire contrari", un avviso su incompatibili e indipendenti, il procedimento in cinque passi e una tabella parola-evento-probabilità.

Otto esempi svolti:

1. carta che non è una figura, $\frac{7}{10}$, con il controllo contando;
2. almeno un 6 con due dadi, $\frac{11}{36}$, con la tabella;
3. almeno una testa con tre monete, $\frac{7}{8}$;
4. asso o re, incompatibili, $\frac{1}{5}$;
5. rossa o verde dall'urna della 94, $\frac{1}{2}$, e lo stesso numero con il contrario;
6. coppe o figura, compatibili, $\frac{19}{40}$, con il Venn;
7. doppio o somma 8 con due dadi, $\frac{5}{18}$, con la tabella a due colori;
8. tabella a doppia entrata (25 studenti, ragazze e occhiali): unione $\frac{18}{25}$ e "né... né..." come contrario dell'unione, $\frac{7}{25}$.

Avvisi: il contrario sbagliato di "almeno un 6" (ed "escono due 6"); sommare le probabilità di eventi compatibili (pari o maggiore di 3 darebbe $1$); incompatibili e indipendenti. Il caso "incompatibili ma non contrari" ha una sezione breve invece di un avviso, perché contiene anche la definizione di eventi contrari in termini di incompatibilità e unione.

## Scelte di convenzione (da verificare con il libro in uso)

- Stessa notazione della 94: $p(E)$, $\Omega$, $\overline{E}$, esiti $TC$ per le monete e $(a, b)$ per i dadi; stesso mazzo napoletano, stessa urna.
- "Somma logica" per l'unione, come nel titolo; il prodotto logico è nominato una volta, tra parentesi.
- La formula generale dell'unione è presentata come valida per due eventi qualsiasi, con quella degli incompatibili come caso particolare. Molti libri la chiamano "teorema della probabilità totale" (o "della somma"): non l'ho nominata, perché il nome cambia da libro a libro. Da verificare.
- Nell'esempio 8 la "o" è inclusiva (ragazza, o con gli occhiali, o tutte e due), come detto all'inizio della sezione sull'unione.

## Lasciato ad altre lezioni

- Definizioni di evento, evento contrario, incompatibili e probabilità classica: nella 94, linkata all'inizio.
- Probabilità composta, condizionata, eventi indipendenti: anni successivi, oggi vuote. L'indipendenza è solo nominata nell'avviso ("è un'altra cosa, che studierai più avanti"), senza definirla; la frase dice che riguarda "il modo in cui un evento cambia la probabilità dell'altro", che è corretto ma volutamente vago.
- Formula dell'unione per tre eventi compatibili: non trattata.

## Figure

Quattro blocchi TikZ, generati dallo stesso script della 94 (`lotto9/94/figs.py`) e guardati in chiaro e in scuro come quelle.

- `due-dadi-almeno-un-sei` (166x165): stessa tabella della 94, con le 11 caselle con almeno un 6 in `blue!20`.
- `eventi-incompatibili-dado-venn` (231x155): cerchi separati come `intersezione-insiemi-disgiunti` della 63, tutti e due colorati (l'unione), con 1 e 2 in $A$, 5 e 6 in $B$, 3 e 4 fuori.
- `coppe-o-figura-diagramma-venn` (231x155): stesse misure e stesso arco dell'intersezione della 63, zona comune colorata, numeri di carte per zona (7, 3, 9, 21).
- `due-dadi-doppio-o-somma-otto` (166x165): doppi in `blue!20`, somma 8 in `red!20`, la casella $(4, 4)$ divisa in diagonale metà blu e metà rossa. Nel tema scuro il rosso diventa bordeaux e resta distinguibile dal blu.

## Formulario e flashcard

- Formulario: contrario con due esempi, unione di incompatibili, unione di compatibili con due esempi, procedimento in cinque passi, tre avvisi. Nessuna figura.
- 18 carte, nell'ordine della lezione.

## Da cambiare nelle lezioni già scritte

- 63 (Intersezione insiemistica), facoltativo: dopo la formula $|A \cup B| = |A| + |B| - |A \cap B|$ si può aggiungere "La stessa idea dà la probabilità dell'unione di due eventi: vedi [Probabilità della somma e dell'evento contrario](/materiale/scuola-superiore/matematica/probabilita/probabilita-della-somma-e-dell-evento-contrario)."
- Nessun'altra lezione scritta parla di probabilità.

## Prerequisiti

```
leggi-probabilita <- concetti-probabilita
```

La riga della bozza va bene: il link alla 63 (numero di elementi dell'unione) è un antenato attraverso la 94, e la tabella a doppia entrata dell'esempio 8 non richiede la statistica bivariata.

## Per il generatore

1. Evento contrario con un dado o con il mazzo ($1 - \frac{3}{10} = \frac{7}{10}$). Distrattori: la probabilità dell'evento stesso; $\frac{3}{10} - 1$.
2. "Almeno uno" con due dadi o tre monete ($\frac{11}{36}$, $\frac{7}{8}$). Distrattori: $\frac{1}{6} + \frac{1}{6} = \frac{12}{36}$ (sommare senza togliere il doppio 6); $\frac{10}{36}$ (contare solo "esattamente un 6"); $\frac{1}{8}$ (il contrario).
3. Unione di eventi incompatibili (asso o re $\frac{1}{5}$, rossa o verde $\frac{1}{2}$). Distrattore: $\frac{4}{40} \cdot \frac{4}{40}$ (prodotto al posto della somma).
4. Unione di eventi compatibili con il mazzo ($\frac{19}{40}$) o con un dado (pari o maggiore di 3, $\frac{2}{3}$). Distrattori: $\frac{22}{40}$ e $1$ (somma senza sottrarre l'intersezione); $\frac{16}{40}$ (intersezione sottratta due volte).
5. Unione con due dadi (doppio o somma 8, $\frac{5}{18}$). Distrattore: $\frac{11}{36}$.
6. Tabella a doppia entrata: unione e "né... né..." ($\frac{18}{25}$, $\frac{7}{25}$). Distrattori: $\frac{22}{25}$; $\frac{4}{25}$ (l'intersezione al posto dell'unione).

## Domande per Andrea

- La formula $p(A \cup B) = p(A) + p(B) - p(A \cap B)$: nei libri che usate ha un nome ("teorema della probabilità totale", "della somma logica")? La lezione non ne usa nessuno.
- L'avviso su incompatibili e indipendenti dice solo che sono due cose diverse. Vuoi un esempio (due eventi incompatibili con probabilità positive non sono mai indipendenti), o è troppo presto senza la probabilità composta?
- Il contrario di "escono due 6" è "almeno un dado non dà 6": ti sembra utile nell'avviso, o confonde?
- Esercizi con "né... né..." (esempio 8): nel biennio si chiedono, o bastano "o" e "non"?
