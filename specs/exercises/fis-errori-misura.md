# Errori casuali ed errori sistematici

Generatore: `fis-errori-misura` (`src/lib/exercises/v2/generators/fis-errori-misura.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_errori_misura.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/05-fis-errori-misura.md` (note in `docs/lezioni/fisica/note/05-fis-errori-misura.md`).
Scena: `bersaglio` (`src/components/content/exercises/scenes/Bersaglio.tsx`), al livello 3.

Cinque livelli, nell'ordine della lezione: riconoscere il tipo di errore, correggere lo zero di uno strumento,
leggere precisione e accuratezza su un bersaglio, poi su tre serie di numeri, e scegliere il rimedio giusto.

## Nomi dei livelli

1. Casuale o sistematico
2. Correggere lo zero
3. Il bersaglio
4. Precisione e accuratezza
5. Come rimediare

## Tipi di risposta

Tutti i livelli hanno una risposta `choice`, senza `toChoice`. Le opzioni di testo sono `\text{…}` (una riga, o più
righe in `\begin{gathered}` se superano 252 px a 16 px); le opzioni numeriche sono scritte come la lezione, con
l'unità: `182{,}2\,\text{g}`, `-0{,}3\,{}^\circ\text{C}`. `values` di ogni opzione è un'etichetta che il controllo
legge: `casuale`, `sistematico`, `sbaglio` (livello 1); il numero esatto come razionale, `"911/5"` (livello 2);
`PA`, `PN`, `AN`, `NN` (livello 3: precise e accurate, precise non accurate, accurate non precise, né l'una né
l'altra); `A`, `B`, `C` (livello 4); `media`, `correggi`, `scarta`, `sensibile` (livello 5).

## Regole comuni

- Virgola decimale `{,}`, unità dopo uno spazio sottile `\,\text{g}`, gradi Celsius `{}^\circ\text{C}`, come in
  `docs/lezioni/fisica/README.md`.
- Il testo sta in righe `\text{…}` scritte con `textBlock`, con le formule tra `$…$`; le serie di misure del livello 4
  sono righe di dati separate da `\quad`, come nella lezione ("A: $50{,}02$ $49{,}98$ …").
- Niente trattini lunghi e niente "piuttosto che" nei testi (il `check()` lo controlla).
- Passaggi in italiano, con la regola della lezione che decide la risposta.

## Livello 1: casuale o sistematico

Una situazione di misura, e la domanda "Che tipo di errore è?". Tre opzioni, sempre le stesse tre in ordine
mescolato: "errore casuale", "errore sistematico", "sbaglio (errore grossolano)". Tre casi, circa un terzo ciascuno.

Ogni caso ha almeno sei situazioni diverse, con dati che cambiano (strumento, oggetto, numeri, persona):

- sistematico: una bilancia che a piatto vuoto segna $x$ g; un cronometro che va avanti (o indietro) di $x$ s ogni
  $100$ s; un righello con il bordo consumato usato partendo dal bordo; un termometro letto sempre dal basso (o
  dall'alto); un metro a nastro d'acciaio tarato a $20\,{}^\circ\text{C}$ e usato al sole; un dinamometro che a vuoto
  segna $x$ N; un cronometro fatto partire sempre quando la pallina è già partita;
- casuale: premere il cronometro a volte in anticipo e a volte in ritardo; appoggiare il metro ogni volta in modo un
  po' diverso; le vibrazioni del tavolo che fanno oscillare la lancetta; leggere a occhio la tacca più vicina, un
  po' sopra o un po' sotto; una corrente d'aria che muove il piatto della bilancia; il diametro di un sasso
  irregolare misurato ogni volta in un punto diverso;
- sbaglio: scrivere $8{,}3$ al posto di $3{,}8$ in una misura; leggere la scala dei pollici invece di quella dei
  centimetri in una misura; dimenticare di azzerare la bilancia in una sola pesata; contare $9$ oscillazioni invece
  di $10$ in una prova; scrivere una misura in millimetri nella colonna dei centimetri; premere per sbaglio il tasto
  di azzeramento a metà di una misura.

Esempi:

- "Una bilancia, a piatto vuoto, segna $0{,}6$ g. Luca la usa per pesare tre monete. Che tipo di errore c'è nelle sue
  misure?" Risposta: errore sistematico. Passaggi: "La bilancia aggiunge $0{,}6$ g a ogni pesata: l'errore è sempre
  nello stesso verso, quindi è sistematico."
- "Sara cronometra cinque volte la caduta di una pallina; a volte preme il tasto un po' prima dell'arrivo, a volte un
  po' dopo. Che tipo di errore c'è nei suoi tempi?" Risposta: errore casuale.

## Livello 2: correggere lo zero

Uno strumento che a vuoto non segna zero, e una lettura. "Quanto vale la misura corretta?" Quattro contesti, circa un
quarto ciascuno:

- bilancia (g): a vuoto segna $z$, da $\pm 0{,}1$ a $\pm 0{,}9$ g (positivo 2 volte su 3); la lettura $L$ da $10{,}0$
  a $500{,}0$ g, con un decimale;
- dinamometro (N): a vuoto segna $z$, da $\pm 0{,}1$ a $\pm 0{,}5$ N; la lettura da $1{,}0$ a $20{,}0$ N;
- termometro (${}^\circ\text{C}$): nel ghiaccio fondente, che è a $0\,{}^\circ\text{C}$, segna $z$, da $\pm 0{,}2$
  a $\pm 1{,}5\,{}^\circ\text{C}$; la lettura da $15{,}0$ a $90{,}0\,{}^\circ\text{C}$;
- righello con il bordo consumato: lo zero della scala non è sul bordo, e un oggetto appoggiato al bordo arriva alla
  tacca $L$ cm; la tacca del bordo è $z$ (da $0{,}2$ a $0{,}8$ cm, solo positivo, perché il bordo consumato taglia
  l'inizio della scala: il bordo sta sulla tacca $z$ e la lunghezza vera è $L - z$).

Risposta: $L - z$, con un decimale. Distrattori: $L + z$ (correzione nel verso sbagliato, l'avviso della lezione);
$L$ (nessuna correzione); $L - 2z$ (la correzione fatta due volte). Quattro valori diversi, tutti positivi.

Esempi:

- "Una bilancia, a piatto vuoto, segna $0{,}4$ g. Con una mela sul piatto segna $182{,}6$ g. Quanto pesa la mela?"
  Risposta $182{,}2$ g; distrattori $183{,}0$, $182{,}6$, $181{,}8$.
- "Un termometro, nel ghiaccio fondente, segna $-0{,}5\,{}^\circ\text{C}$. Nell'acqua calda segna $62{,}0\,{}^\circ\text{C}$.
  Qual è la temperatura dell'acqua?" Risposta $62{,}5\,{}^\circ\text{C}$; distrattori $61{,}5$, $62{,}0$, $63{,}0$.

## Livello 3: il bersaglio

Una scena `bersaglio` con da sei a otto colpi, e la domanda "Come sono questi colpi?". Quattro opzioni fisse, in
ordine mescolato: "precisi e accurati", "precisi ma non accurati", "accurati ma non precisi", "né precisi né
accurati". Quattro casi, un quarto ciascuno.

I colpi sono in unità del raggio esterno del bersaglio, con il centro nell'origine, arrotondati ai centesimi, tutti
entro $0{,}95$ dal centro. Con $M$ la media dei colpi e $s$ la distanza massima di un colpo da $M$:

- precisi: $s \le 0{,}2$ e due colpi distano almeno $0{,}07$ (così i pallini non si confondono in una macchia);
  non precisi: $s \ge 0{,}45$;
- accurati: $|M| \le 0{,}08$; non accurati: $|M| \ge 0{,}4$.

Tra le due soglie di ogni coppia c'è un margine largo, così la risposta non dipende da un pallino. La direzione dello
spostamento cambia da esercizio a esercizio. Il testo dice che ogni colpo è una misura e il centro è il valore vero.
`alt` della scena descrive i colpi senza dare la risposta: "Un bersaglio con sette colpi" e dove stanno (per esempio
"raccolti in alto a destra, lontano dal centro"). Nella soluzione i passaggi dicono dove sta la media dei colpi e
quanto sono sparsi. La soluzione ha una `solutionScene` uguale, senza segni in più (il kit non ha ancora la croce
della media nelle scene).

Esempi:

- Sei colpi raccolti in un cerchio di raggio $0{,}15$ attorno a $(0{,}45;\,0{,}35)$: precisi ma non accurati.
- Sette colpi sparsi fino a $0{,}6$ dal centro, con la media nel centro: accurati ma non precisi.

## Livello 4: precisione e accuratezza con i numeri

Un valore di riferimento e tre serie di quattro misure, come l'esempio 3 della lezione. Contesti: un pesetto campione
da $50{,}00$, $100{,}00$ o $20{,}00$ g pesato con tre bilance; un blocchetto di riferimento da $25{,}00$ o
$40{,}00$ mm misurato con tre calibri; un intervallo di $10{,}00$ s dato da un segnale, misurato con tre cronometri.
Le tre serie sono una per tipo, in ordine mescolato tra A, B e C:

- precisa e accurata: scarti dal riferimento da $-0{,}02$ a $+0{,}02$, di somma zero (la media è il riferimento),
  campo di variazione da $0{,}02$ a $0{,}04$;
- precisa ma non accurata: tutte le misure spostate di $o$, con $|o|$ da $0{,}20$ a $0{,}50$, più scarti come sopra;
  media esatta $R + o$;
- accurata ma non precisa: scarti da $\pm 0{,}20$ a $\pm 0{,}50$, di somma zero, campo di variazione almeno
  $0{,}50$; media esatta $R$.

Tutte le misure con due decimali. La domanda chiede, a caso, una delle tre serie: "Quale serie è precisa ma non
accurata?" (o precisa e accurata, o accurata ma non precisa). Tre opzioni: "serie A", "serie B", "serie C". I passaggi
calcolano per ogni serie il campo di variazione e la media, e le confrontano con il riferimento.

Esempi:

- Riferimento $50{,}00$ g. A: $50{,}31$ $50{,}29$ $50{,}30$ $50{,}30$; B: $49{,}70$ $50{,}40$ $50{,}10$ $49{,}80$;
  C: $50{,}02$ $49{,}98$ $50{,}01$ $49{,}99$. "Quale serie è precisa ma non accurata?" Risposta A.
- Riferimento $25{,}00$ mm. A: $24{,}99$ $25{,}01$ $25{,}02$ $24{,}98$; B: $24{,}62$ $24{,}64$ $24{,}63$ $24{,}63$;
  C: $25{,}30$ $24{,}60$ $25{,}20$ $24{,}90$. "Quale serie è accurata ma non precisa?" Risposta C.

## Livello 5: come rimediare

Una situazione in cui qualcosa non va, e la domanda "Che cosa conviene fare?". Quattro opzioni fisse, in ordine
mescolato: "ripetere la misura più volte e fare la media" (`media`), "tarare lo strumento o correggere il metodo"
(`correggi`), "scartare quella misura e rifarla" (`scarta`), "usare uno strumento più sensibile" (`sensibile`). Quattro
casi, un quarto ciascuno, con almeno quattro situazioni ciascuno e dati che cambiano:

- `media`: i tempi di una stessa caduta sono diversi, a volte più lunghi e a volte più corti; le letture di una
  lancetta che vibra; misure fatte appoggiando il metro ogni volta un po' diversamente;
- `correggi`: tutte le misure di un campione noto vengono più grandi (o più piccole) dello stesso valore; la bilancia
  a vuoto segna $x$ g; il termometro è letto sempre dal basso; il cronometro parte sempre in ritardo;
- `scarta`: una misura della serie è molto diversa dalle altre, e si sa perché (cifre scambiate, oscillazioni
  contate male, bilancia non azzerata una volta);
- `sensibile`: cinque misure con uno strumento poco sensibile danno tutte lo stesso numero (un righello con i soli
  centimetri, un cronometro che mostra i decimi per un tempo di pochi decimi, una bilancia da cucina da $1$ g per un
  anello di pochi grammi), e serve una misura più fine.

Esempi:

- "Cinque misure della lunghezza di una matita fatte con un righello che ha solo le tacche dei centimetri danno tutte
  $14$ cm. Serve la lunghezza al millimetro. Che cosa conviene fare?" Risposta: usare uno strumento più sensibile.
- "Pesando quattro volte un pesetto campione da $100{,}00$ g, una bilancia dà sempre valori tra $100{,}38$ e
  $100{,}42$ g." Risposta: tarare lo strumento o correggere il metodo.

## Esercizi da evitare

- Situazioni ambigue tra casuale e sistematico (il tempo di reazione senza dire se cambia verso: la lezione dice che
  ha tutte e due le parti).
- Una correzione che dà un valore negativo o uno zero finale che cambia la scrittura dei distrattori.
- Bersagli con i colpi fuori dal bersaglio o sovrapposti; serie in cui due classi hanno medie o campi simili.
- Al livello 5, una situazione con due rimedi giusti (per esempio misure disperse con uno strumento poco sensibile).

## Verifica

`scripts/exercises/checkers/fis_errori_misura.py` rilegge il testo:

- livello 1 e 5: riconosce la situazione da una tabella di frasi scritta dalla specifica (non dal generatore) e
  controlla l'etichetta dell'opzione giusta; controlla che le opzioni siano le tre o le quattro fisse;
- livello 2: rilegge lettura a vuoto e lettura, ricalcola $L - z$ con `Rational`, controlla i distrattori (diversi,
  positivi) e la scrittura dei numeri;
- livello 3: rilegge i colpi dalla scena, ricalcola $M$ e $s$ e la classe con le soglie della specifica, controlla
  che nessun colpo cada nella zona tra le soglie e che le distanze minime siano rispettate;
- livello 4: rilegge le serie dal testo, ricalcola media e campo di ogni serie, classifica con le soglie e controlla
  che la serie chiesta sia l'unica della sua classe.

Controlla anche la quota di ogni caso (`CASE_RANGES`).

Esito: `sample.mts fis-errori-misura 1000 all 1`, `… 1000 all 50001` e `… 1000 all 777001`, 5.000 esercizi ciascuno,
PASS, con le quote dei casi negli intervalli. `width.mts` senza sforamenti (opzione più larga $209$ px, righe di dati
del livello 4 al più $87$ px); `review.mts` esce con codice 0. Le opzioni del livello 5 stanno su due righe in
`\begin{gathered}`, tutte e quattro per avere la stessa forma.

Scelte fatte scrivendo il generatore: al livello 1 il cronometro che parte in ritardo dice anche quante volte si
misura; al livello 5 il quarto caso `sensibile` è un termometro con le sole tacche dei gradi, e il cronometro è a
fotocellule (a mano il tempo di reazione renderebbe giusta anche la media); le situazioni `scarta` elencano le
cinque misure, e il controllo verifica che quella strana torni con il motivo (cifre scambiate, $9$ oscillazioni
su $10$, i pollici). Al livello 2 il segno di $z$ è positivo 2 volte su 3 per la bilancia e 1 su 2 per dinamometro e
termometro; il righello ha la lettura da $5{,}0$ a $25{,}0$ cm.

### Errori piantati

100 su 100 bocciati (e i 54 campioni di controllo non alterati passano):

- opzione giusta spostata e due opzioni uguali, su ogni caso di ogni livello (38);
- livello 1: "sempre" tolto da una situazione sistematica, "un po' diverso" tolto da una casuale, cifre non più
  scambiate, $8$ oscillazioni invece di $10$, una bilancia a vuoto con lettura negativa;
- livello 2: una lettura cambiata di $0{,}1$, la correzione con il segno sbagliato come risposta, un'opzione scritta
  con due decimali (per ogni contesto), il segno della lettura a vuoto tolto;
- livello 3: un colpo oltre $0{,}95$, due colpi sovrapposti, un colpo non arrotondato, un alt che dice "precisi",
  una `solutionScene` diversa (per ogni caso); un colpo portato a $0{,}32$ dalla media, tra le soglie di precisione;
  la media spostata di $0{,}2$, tra le soglie di accuratezza; un alt con la direzione sbagliata;
- livello 4: una misura della serie A cambiata, la domanda cambiata, il riferimento cambiato (per ogni caso);
- livello 5: un'etichetta cambiata e un'opzione su una riga (per ogni caso), l'ordinale della misura sbagliata
  spostato, $7$ oscillazioni invece di $9$, una lettura con una cifra in più di quelle dello strumento, un campione
  che cade dentro l'intervallo delle letture.

### Esercizi diversi su 1.000

Testi (con i colpi della scena) diversi, seed da 1: livello 1 851, livello 2 996, livello 3 1000, livello 4 1000,
livello 5 892. I livelli 1 e 5 sono stretti per costruzione: 19 e 16 situazioni, con nome, oggetto e numeri che
cambiano, ma alcune (il righello consumato, il termometro letto dal basso) hanno solo nome e oggetto.
