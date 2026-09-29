# Il metodo sperimentale

Generatore: `fis-metodo-sperimentale` (`src/lib/exercises/v2/generators/fis-metodo-sperimentale.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_metodo_sperimentale.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/01-fis-metodo-sperimentale.md` (note in `docs/lezioni/fisica/note/01-fis-metodo-sperimentale.md`).

Quattro livelli, tutti a scelta multipla con quattro opzioni (la risposta è la scelta stessa, `answer.kind = 'choice'`),
su brevi storie di esperimenti con dati generati. La lezione è concettuale: non ci sono conti, ma ogni livello chiede
di applicare una regola della lezione a una situazione nuova.

## Nomi dei livelli

1. Le fasi del metodo
2. Le variabili
3. Le prove da confrontare
4. I dati e l'ipotesi

## Regole comuni

- Il protagonista è uno studente preso da un elenco di dodici nomi; le misure sono scritte come nella fisica,
  `$20\,\text{g}$`, `$1{,}42\,\text{s}$`, `$30\,^\circ\text{C}$`, `$10^\circ$`, con l'unità dopo ogni numero.
- Il testo sta in righe `\text{…}` scritte con `textBlock`; le opzioni sono `\text{…}`, su due righe con
  `\begin{gathered}`, a righe di al più 24 caratteri, quando sono più lunghe (il bottone della risposta sul telefono è largo 252 px).
- Niente trattini lunghi e niente "piuttosto che" (il `check()` lo controlla).
- I dati sono fisicamente coerenti: i periodi del pendolo vengono da $T = 2\pi\sqrt{L/g}$ con $g = 9{,}8\,\text{m/s}^2$,
  i tempi di discesa lungo il piano inclinato da una sfera che rotola, $t = \sqrt{\dfrac{14 L}{5 g \sin\alpha}}$, i tempi
  di riscaldamento dell'acqua sono proporzionali a $m(100\,^\circ\text{C} - T_0)$.

## Livello 1: le fasi del metodo

Sette storie (pendolo, molla, tè che si raffredda, piano inclinato, filo che si dilata, ghiaccio e sale, paracadute),
ognuna con una frase per ogni fase. Si mostra una frase e si chiede quale fase descrive. Opzioni: la fase giusta e tre
delle altre quattro, tra Osservazione, Ipotesi, Esperimento, Analisi dei dati, Conclusione. Le frasi sono scritte con
verbi che il controllo riconosce, nell'ordine:

- "conclude che": conclusione;
- "vede che" (dopo una tabella, un grafico o un confronto): analisi dei dati;
- "pensa che": ipotesi;
- "misura" (senza le precedenti): esperimento;
- "nota che": osservazione.

Esempi:

- "Luca appende a una molla masse di $50\,\text{g}$, $100\,\text{g}$ e $150\,\text{g}$ e ogni volta misura l'allungamento con
  un righello." Risposta: Esperimento.
- "Sara riporta le lunghezze in una tabella e vede che l'allungamento cresce con la temperatura." Risposta: Analisi dei
  dati. Distrattore tipico: Conclusione.

## Livello 2: le variabili

Cinque esperimenti (pendolo, piano inclinato, acqua sul fornello, paracadute, molla), ognuno con tre grandezze che si
possono cambiare e una che si misura. La storia dice le tre grandezze, quale cambia e come, e che cosa si misura. Tre
domande, circa un terzo ciascuna:

- la variabile indipendente: opzioni le tre grandezze e quella misurata;
- la variabile dipendente: le stesse quattro;
- le grandezze da tenere costanti: quattro coppie, la giusta (le due che non cambiano) e tre coppie che contengono la
  variabile indipendente o quella misurata.

Esempio: "Anna studia un pendolo; le grandezze che può cambiare sono la massa della pallina, la lunghezza del filo e
l'ampiezza dell'oscillazione. Vuole sapere se il periodo dipende dalla lunghezza del filo: usa fili lunghi $30\,\text{cm}$,
$60\,\text{cm}$ e $90\,\text{cm}$ e ogni volta misura il periodo. Quali grandezze deve tenere costanti?" Risposta: la
massa della pallina e l'ampiezza dell'oscillazione. Distrattori: la lunghezza del filo e la massa; il periodo e
l'ampiezza; la lunghezza del filo e il periodo.

## Livello 3: le prove da confrontare

Tre esperimenti (pendolo con massa e lunghezza, pallina su un piano lungo $1{,}00\,\text{m}$ con massa e inclinazione,
acqua sul fornello con massa e temperatura iniziale). Quattro prove, una per ogni combinazione dei due valori di due
grandezze, in ordine casuale, in una tabella con la grandezza misurata (valori della legge con un rumore di $\pm 0{,}5\%$).
Si chiede quali due prove confrontare per sapere se la grandezza misurata dipende da una delle due (metà dei casi la
prima, metà la seconda). Delle sei coppie due sono giuste (cambia solo la grandezza chiesta): una è la risposta, e le
altre tre opzioni vengono dalle quattro sbagliate (cambiano tutte e due, o cambia solo l'altra).

Esempio: la tabella dell'esempio 2 della lezione; "Quali due prove deve confrontare per sapere se il periodo dipende dalla
massa della pallina?" Risposta: prove 1 e 3. Distrattori: prove 1 e 2 (cambiano tutte e due), prove 1 e 4 (cambia solo la
lunghezza).

## Livello 4: i dati e l'ipotesi

Cinque prove: il periodo del pendolo con la massa (non dipende), il periodo con la lunghezza (dipende), la pallina sul piano
con la massa (non dipende), l'allungamento della molla con la massa (dipende, $0{,}02$, $0{,}03$ o $0{,}04\,\text{cm}$ per
grammo), il tempo di fusione del ghiaccio con la temperatura dell'acqua (dipende: $t$, $\tfrac{3}{4}t$ e $\tfrac{1}{2}t$ con $t$ da $240$ a $360\,\text{s}$). L'ipotesi dice "dipende" o "non dipende"
(metà ciascuna). Le tre misure hanno un'incertezza data:

- quando la grandezza non dipende, le misure differiscono al massimo di un'incertezza (la lezione: "una differenza più
  piccola dell'incertezza non dice niente");
- quando dipende, due misure vicine differiscono di almeno cinque incertezze.

Risposta: "I dati confermano l'ipotesi" o "I dati smentiscono l'ipotesi". Distrattori: l'altra, "I dati la dimostrano
per sempre" (l'avviso "Una conferma non è una dimostrazione"), "I dati non dicono niente".

Esempio: "Pietro controlla l'ipotesi che il periodo di un pendolo non dipenda dalla massa della pallina. Con un filo lungo
$1{,}00\,\text{m}$ appende palline di $50\,\text{g}$, $100\,\text{g}$ e $200\,\text{g}$ e misura periodi di $2{,}01\,\text{s}$,
$2{,}00\,\text{s}$ e $2{,}02\,\text{s}$, con un'incertezza di $0{,}02\,\text{s}$." Risposta: i dati confermano l'ipotesi.

## Esercizi da evitare

- Una frase del livello 1 che contiene i verbi di due fasi diverse.
- Due opzioni uguali, o una coppia del livello 2 che è la giusta scritta nell'altro ordine.
- Al livello 4 differenze tra una e cinque incertezze, dove la risposta dipenderebbe da una regola che la lezione non dà.

## Verifica

`scripts/exercises/checkers/fis_metodo_sperimentale.py` rilegge ogni problema dal testo: classifica la frase del livello 1
con le regole dei verbi; al livello 2 ricava le tre grandezze, quella che cambia e quella misurata; al livello 3 legge la
tabella, trova le coppie in cui cambia solo la grandezza chiesta e ricontrolla i valori misurati con la legge; al livello 4
legge misure e incertezza, decide se la grandezza dipende (differenze di almeno cinque incertezze) o no (al più una) e
confronta con l'ipotesi, e per il pendolo ricontrolla i periodi con la legge. Poi controlla le quattro opzioni (diverse,
una sola giusta, quella indicata da `correct`) e la quota dei casi.

## Domande per la revisione

- Le frasi del livello 1 sono riconoscibili dai verbi ("pensa che", "conclude che"): va bene per il biennio, o si
  preferiscono frasi meno guidate?
- Il livello 4 usa una regola semplice (dentro l'incertezza: uguali; molto oltre: diverse), senza la compatibilità di due
  misure che arriverà nelle lezioni sugli errori. Va bene così in questa lezione?
