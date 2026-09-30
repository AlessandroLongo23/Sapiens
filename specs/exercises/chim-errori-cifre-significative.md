# Errori di misura e cifre significative (chimica)

Generatore: `chim-errori-cifre-significative` (`src/lib/exercises/v2/generators/chim-errori-cifre-significative.ts`,
con `src/lib/exercises/v2/chim-misure.ts`). Verifica indipendente:
`scripts/exercises/checkers/chim_errori_cifre_significative.py` (con `_chim_misure.py`). Lezione collegata:
`docs/lezioni/chimica/riscritte/13-chim-errori-cifre-significative.md`. Percorso nel database:
`high_school/chemistry/chim-misure/chim-errori-cifre-significative`.

Sei livelli, ognuno con una difficoltà in più. Tutti a scelta multipla con quattro opzioni. Qui la scrittura è la
risposta: $0{,}250\,\text{mol}$ e $0{,}25\,\text{mol}$ sono opzioni diverse, e `values` contiene la scrittura senza LaTeX
("0,250 mol", "18,7 ± 0,2 mL").

## Nomi dei livelli

1. Contare le cifre
2. Arrotondare
3. Valore medio e incertezza
4. Somme e differenze
5. Prodotti e quozienti
6. L'incertezza relativa

## Regole

Quelle della lezione, che sono quelle del README di fisica: le cifre significative sono le cifre senza gli zeri
iniziali, in notazione scientifica quelle del primo fattore; si arrotonda guardando la prima cifra tolta, da $5$ in su
per eccesso, e la prima cifra tolta non è mai un $5$ seguito solo da zeri (i dati costruiti a meno di un centesimo di
unità dalla metà si scartano); un numero si scrive in notazione scientifica quando la sua ultima cifra significativa sta a
sinistra delle unità o è uno zero delle unità ($1{,}0 \cdot 10$, non $10$). Incertezza di una serie: la semidispersione,
o la sensibilità se la semidispersione è più piccola; incertezza con una cifra significativa, valore alla stessa
posizione. Somme e differenze: le incertezze assolute si sommano, il risultato ha i decimali del dato che ne ha meno.
Prodotti e quozienti: le incertezze relative si sommano, il risultato ha le cifre significative del dato che ne ha meno.

## Livello 1: contare le cifre

Un quinto ciascuno: nessuno zero ($18{,}7$), zeri iniziali ($0{,}00318$), zeri in mezzo ($5{,}09$, $50{,}09$), zeri
finali dopo la virgola ($25{,}00$, $0{,}0250$), notazione scientifica ($6{,}02 \cdot 10^{23}$, $1{,}50 \cdot 10^{3}$). Unità
$\text{g}$, $\text{mL}$, $\text{mol}$, $\text{g/mL}$, $\text{L}$. Nessun intero con zeri finali. Opzioni: numeri da $1$ a
$7$. Distrattori: tutte le cifre scritte contate (zeri iniziali compresi, o le cifre dell'esponente), gli zeri finali o
quelli in mezzo non contati, uno in più o in meno.

- "Quante cifre significative ha la misura $7{,}50\,\text{g}$?" Risposta $3$.
- "... $0{,}00318\,\text{mol}$?" Risposta $3$; distrattore $6$ (tutte le cifre).

## Livello 2: arrotondare

A due o tre cifre significative. Casi: numero decimale di cinque cifre (40%); il riporto lascia uno zero finale
significativo, $0{,}24972 \to 0{,}250$ (20%); intero da cinque a sette cifre, che va in notazione scientifica,
$46\,046 \to 4{,}60 \cdot 10^4$ (20%); il riporto aggiunge una cifra, $9{,}97 \to 1{,}0 \cdot 10$, $0{,}0997 \to 0{,}10$ (20%).
Distrattori: il numero troncato, una cifra in più o in meno, lo zero finale tolto, l'intero scritto con gli zeri
($46\,000$).

- "Arrotonda la misura $5\,841\,600\,\text{mL}$ a due cifre significative." Risposta $5{,}8 \cdot 10^6\,\text{mL}$;
  distrattori $5\,800\,000$, $5{,}84 \cdot 10^6$, $6 \cdot 10^6\,\text{mL}$.
- "Arrotonda la misura $0{,}24972\,\text{mol}$ a tre cifre significative." Risposta $0{,}250\,\text{mol}$; distrattori
  $0{,}25$, $0{,}249$, $0{,}2497\,\text{mol}$.

## Livello 3: valore medio e incertezza

Quattro o cinque titolazioni (buretta, sensibilità $0{,}1\,\text{mL}$, letture da $10{,}0$ a $45{,}0$) o pesate (bilancia,
$0{,}01\,\text{g}$, da $10{,}00$ a $60{,}00$). Nel 70% la semidispersione è più grande della sensibilità (letture sparse di
$3$-$8$ unità); nel 30% le letture sono solo due valori vicini, la semidispersione è metà della sensibilità e l'incertezza
è la sensibilità. Distrattori: la differenza tra gli estremi come incertezza, il valore medio con le cifre della
calcolatrice, la sensibilità al posto della semidispersione (o la semidispersione al posto della sensibilità),
l'incertezza raddoppiata.

- "Cinque titolazioni ... richiedono $18{,}6$, $18{,}9$, $18{,}7$, $18{,}5$, $18{,}8$ mL." Risposta
  $(18{,}7 \pm 0{,}2)\,\text{mL}$.
- "Cinque pesate ... danno $13{,}09$, $13{,}10$, $13{,}10$, $13{,}09$, $13{,}10$ g." Risposta $(13{,}10 \pm 0{,}01)\,\text{g}$.

## Livello 4: somme e differenze

Un terzo ciascuno: il volume erogato da una buretta (due letture con un decimale, $\Delta V = 0{,}2\,\text{mL}$); la
massa di un campione pesato per differenza (due pesate al centesimo, $\Delta m = 0{,}02\,\text{g}$); la massa di un becher
($25{,}00$-$90{,}00\,\text{g}$) con del sale pesato al decimo, arrotondata ai decimi. Distrattori: l'incertezza non
sommata, le due letture sommate, la seconda lettura sola; nella somma, tutti i decimali, il troncamento, la regola delle
cifre significative usata al posto di quella dei decimali.

- "... la buretta ... segna $0{,}3\,\text{mL}$ all'inizio e $18{,}9\,\text{mL}$ alla fine." Risposta
  $(18{,}6 \pm 0{,}2)\,\text{mL}$.
- "In un becher che pesa $57{,}66\,\text{g}$ si aggiungono $8{,}8\,\text{g}$ di sale ..." Risposta $66{,}5\,\text{g}$;
  distrattori $66{,}46$, $66$, $66{,}4\,\text{g}$.

## Livello 5: prodotti e quozienti

Un terzo ciascuno: la densità da massa (quattro cifre) e volume (tre o due cifre); le moli di un campione di
$\mathrm{H_2O}$, $\mathrm{NaCl}$, $\mathrm{CO_2}$, $\mathrm{NH_3}$ o $\mathrm{CH_4}$, con la massa molare della tavola della
lezione 01 (quattro cifre) e la massa con tre; la massa da una densità della tabella (tre cifre) e un volume con due.
Distrattori: le cifre della calcolatrice (due in più), una cifra in più, il troncamento, una cifra in meno (solo con tre
cifre), lo zero finale tolto.

- "Un campione d'acqua, $\mathrm{H_2O}$, ha la massa di $9{,}82\,\text{g}$. Quante moli contiene?" Risposta
  $0{,}545\,\text{mol}$.
- "Un liquido ha la densità di $0{,}789\,\text{g/mL}$. Quanto pesano $16\,\text{mL}$?" Risposta $13\,\text{g}$;
  distrattori $12{,}62$, $12{,}6$, $12\,\text{g}$.

## Livello 6: l'incertezza relativa

Metà: l'incertezza percentuale di una lettura (cilindro, $1\,\text{mL}$; buretta, $0{,}1\,\text{mL}$; bilancia,
$0{,}01\,\text{g}$; termometro, $1\,^\circ\text{C}$), con due cifre significative che non finiscono con zero. Distrattori:
il rapporto rovesciato, il rapporto non moltiplicato per $100$, un fattore dieci. Metà: la densità di un liquido da
$m = (m \pm 0{,}02)\,\text{g}$ e un volume da pipetta ($\pm 0{,}02$, $0{,}03$, $0{,}05\,\text{mL}$) o da cilindro
($\pm 0{,}5\,\text{mL}$), con le incertezze relative sommate; densità tra $0{,}5$ e $3\,\text{g/mL}$. Distrattori: le
incertezze assolute sommate, l'incertezza relativa non moltiplicata per $d$, il doppio dell'incertezza del volume, il
valore con una cifra di troppo.

- "Una misura fatta con un cilindro graduato, che ha la sensibilità di $1\,\text{mL}$, dà $46\,\text{mL}$." Risposta
  $2{,}2\%$; distrattori $46\%$, $0{,}022\%$, $22\%$.
- "Un liquido ha la massa $m = (13{,}47 \pm 0{,}02)\,\text{g}$ e il volume $V = (10{,}00 \pm 0{,}05)\,\text{mL}$ ..."
  Risposta $(1{,}347 \pm 0{,}009)\,\text{g/mL}$.

## Esercizi da evitare

- Interi con zeri finali tra i dati (ambigui); risultati a metà tra due arrotondamenti.
- Al livello 3 una semidispersione uguale alla sensibilità.

## Verifica

`chim_errori_cifre_significative.py` rilegge ogni numero come stringa, conta le cifre con le regole della lezione,
ricalcola con i razionali di SymPy, arrotonda e riscrive il risultato, e controlla che l'opzione con quella scrittura sia
una sola e al suo indice.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 194 px su 252). Il controllo ha trovato due errori del
generatore, corretti: dati scritti senza lo zero finale ($5{,}8$ al posto di $5{,}80$), che cambiavano le cifre
significative, e un caso del livello 4 scartato quasi sempre.

### Errori piantati

Su 60 esercizi (seed da 300): indice spostato, opzione copiata, cifra dell'opzione giusta cambiata bocciati 60 su 60.
Una cifra di un dato cambiata: bocciati tutti gli esercizi in cui la risposta cambia; passano quelli in cui non cambia
(al livello 1 $25{,}00$ e $25{,}01$ hanno le stesse cifre significative, al livello 2 l'arrotondamento resta uguale).
