# La legge di Stevino e i vasi comunicanti

Generatore: `fis-legge-stevino` (`src/lib/exercises/v2/generators/fis-legge-stevino.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_legge_stevino.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/28-fis-legge-stevino.md` (note in `docs/lezioni/fisica/note/28-fis-legge-stevino.md`).
Parti comuni ai tre generatori dei fluidi: `src/lib/exercises/v2/fis-fluidi.ts` e
`scripts/exercises/checkers/_fis_fluidi.py`.

Sei livelli, ognuno con una difficoltà in più: la pressione idrostatica, le unità da convertire, la pressione totale,
la profondità da ricavare dall'altezza sul fondo, la formula rovesciata, il tubo a U.

## Nomi dei livelli

1. La pressione idrostatica
2. Profondità in centimetri
3. La pressione totale
4. La profondità dalla superficie
5. La profondità dalla pressione
6. Il tubo a U

## Tipi di risposta

Risposta `number` arrotondata alle cifre dei dati (mezzo in su): due cifre significative, tranne al livello 3, dove la
somma $p_0 + d \cdot g \cdot h$ si arrotonda alla posizione dell'addendo meno preciso, come insegna la lezione "Le cifre
significative" ($p_0 = 1{,}01 \cdot 10^{5}\,\text{Pa}$ è preciso alle migliaia di pascal, $d \cdot g \cdot h$ alla sua
seconda cifra): $1{,}99 \cdot 10^{5}\,\text{Pa}$ a $10\,\text{m}$ d'acqua, $3{,}5 \cdot 10^{5}\,\text{Pa}$ a $25\,\text{m}$
di mare, come negli esempi 1 e 2 della lezione. Niente arrotondamenti a metà. Scelta multipla (`toChoice`) con l'unità
nell'opzione, i distrattori scritti con le stesse cifre.

## Regole comuni

- $p = p_0 + d \cdot g \cdot h$, $g = 9{,}8\,\text{N/kg}$, $p_0 = 1{,}01 \cdot 10^{5}\,\text{Pa}$, $h$ in metri dalla
  superficie libera, $d$ in $\text{kg/m}^3$.
- Densità dalla lezione, sempre scritte nel testo: acqua dolce $1000$, acqua di mare $1030$, olio d'oliva $920$, mercurio
  $13\,600\,\text{kg/m}^3$ (al livello 2 anche $1{,}00$, $1{,}03$, $0{,}92$, $13{,}6\,\text{g/cm}^3$).
- Profondità credibili: fino a $99\,\text{m}$ in un lago o nel mare, fino a $9{,}9\,\text{m}$ in una cisterna d'olio,
  fino a $0{,}99\,\text{m}$ nel mercurio.
- Scene: `recipiente-liquido` ai livelli 1, 2 e 4 (il recipiente con il punto P e le quote date dal testo), `tubo-a-u`
  al livello 6 (le colonne in scala, con l'altezza cercata segnata "?"). Le etichette sono i dati del testo.

## Livello 1: la pressione idrostatica

Un liquido a caso (un quarto ciascuno), la profondità in metri con due cifre. Distrattori: $g$ dimenticato ($d \cdot h$),
la densità in $\text{g/cm}^3$ ($d \cdot g \cdot h / 1000$), dieci volte la risposta.

- "Quanto vale la pressione idrostatica a $0{,}44\,\text{m}$ di profondità in una vaschetta di mercurio
  ($d = 13\,600\,\text{kg/m}^3$)?" Risposta $5{,}9 \cdot 10^{4}\,\text{Pa}$; distrattori $6{,}0 \cdot 10^{3}\,\text{Pa}$
  (senza $g$), $59\,\text{Pa}$, $5{,}9 \cdot 10^{5}\,\text{Pa}$.
- "… $5{,}7\,\text{m}$ … in una cisterna piena d'olio d'oliva ($d = 920\,\text{kg/m}^3$)" Risposta
  $5{,}1 \cdot 10^{4}\,\text{Pa}$.

## Livello 2: profondità in centimetri

La profondità da $10$ a $99\,\text{cm}$; la densità in $\text{kg/m}^3$ o in $\text{g/cm}^3$ (metà e metà). Distrattori: i
centimetri messi come sono ($\times 100$), i $\text{g/cm}^3$ messi come sono ($/1000$) o, con i $\text{kg/m}^3$, $g$
dimenticato; tutte e due le conversioni saltate.

- "Quanto vale la pressione idrostatica a $63\,\text{cm}$ di profondità nel mare ($d = 1030\,\text{kg/m}^3$)?" Risposta
  $6{,}4 \cdot 10^{3}\,\text{Pa}$; distrattori $6{,}4 \cdot 10^{5}\,\text{Pa}$, $6{,}5 \cdot 10^{2}\,\text{Pa}$, $6{,}4\,\text{Pa}$.
- "… $62\,\text{cm}$ … in un lago d'acqua dolce ($d = 1{,}00\,\text{g/cm}^3$)" Risposta $6{,}1 \cdot 10^{3}\,\text{Pa}$.

## Livello 3: la pressione totale

Acqua dolce o di mare, profondità da $1{,}0$ a $99\,\text{m}$. Distrattori: $p_0$ dimenticata, $g$ dimenticato, la
densità in $\text{g/cm}^3$.

- "Quanto vale la pressione totale a $6{,}3\,\text{m}$ di profondità nel mare ($d = 1030\,\text{kg/m}^3$), se in superficie
  la pressione atmosferica è di $1{,}01 \cdot 10^{5}\,\text{Pa}$?" Risposta $1{,}65 \cdot 10^{5}\,\text{Pa}$
  ($164\,592{,}2$, alle migliaia); distrattori $6{,}36 \cdot 10^{4}\,\text{Pa}$, $1{,}07 \cdot 10^{5}\,\text{Pa}$,
  $1{,}01 \cdot 10^{5}\,\text{Pa}$.
- "… $64\,\text{m}$ … nel mare" Risposta $7{,}5 \cdot 10^{5}\,\text{Pa}$ (alle decine di migliaia).

## Livello 4: la profondità dalla superficie

Una vasca d'acqua o una cisterna d'olio piena fino a $H$ (da $1{,}0$ a $9{,}9\,\text{m}$) e un punto a $y$ sopra il fondo
($10$, $20$, …, $90\,\text{cm}$), con $h = H - y$ di almeno $0{,}5\,\text{m}$. Distrattori: $y$ presa per la profondità
(l'avviso della lezione), $H$, $H + y$.

- "Una cisterna è piena d'olio d'oliva ($d = 920\,\text{kg/m}^3$) fino all'altezza di $4{,}4\,\text{m}$. Quanto vale la
  pressione idrostatica in un punto che si trova $60\,\text{cm}$ sopra il fondo?" Risposta
  $3{,}4 \cdot 10^{4}\,\text{Pa}$ ($h = 3{,}8\,\text{m}$); distrattori $5{,}4 \cdot 10^{3}\,\text{Pa}$,
  $4{,}0 \cdot 10^{4}\,\text{Pa}$, $4{,}5 \cdot 10^{4}\,\text{Pa}$.
- "Una vasca è piena d'acqua … $1{,}6\,\text{m}$ … $60\,\text{cm}$" Risposta $9{,}8 \cdot 10^{3}\,\text{Pa}$.

## Livello 5: la profondità dalla pressione

Acqua dolce o di mare. Metà e metà:

- la pressione idrostatica in kPa (da $10$ a $990$): $h = \dfrac{p}{d \cdot g}$; distrattori $g$ dimenticato, i kPa non
  convertiti, la densità in $\text{g/cm}^3$;
- la pressione totale in kPa (un multiplo di $10$ da $120$ a $990$) con $p_0$: $h = \dfrac{p - p_0}{d \cdot g}$;
  distrattori $p_0$ non sottratta, $g$ dimenticato, $p_0$ aggiunta.

- "Il sensore di un sub misura una pressione idrostatica di $350\,\text{kPa}$ in un lago d'acqua dolce
  ($d = 1000\,\text{kg/m}^3$). A che profondità si trova il sub?" Risposta $36\,\text{m}$; distrattori
  $3{,}5 \cdot 10^{2}\,\text{m}$, $0{,}036\,\text{m}$, $3{,}6 \cdot 10^{4}\,\text{m}$.
- "In un lago d'acqua dolce ($d = 1000\,\text{kg/m}^3$) un sensore misura la pressione totale di $630\,\text{kPa}$. …"
  Risposta $54\,\text{m}$; distrattore $64\,\text{m}$ ($p_0$ non sottratta).

## Livello 6: il tubo a U

Due casi:

- l'altezza (circa il 60%): olio sull'acqua, acqua sul mercurio, olio sul mercurio; $h_1$ da $10$ a $99\,\text{cm}$ (fino
  a $30$ sull'acqua) e $h_2 = h_1 \cdot \dfrac{d_1}{d_2}$. Distrattori: il rapporto al contrario, la stessa altezza, la
  differenza $h_1 - h_2$;
- la densità (circa il 40%): un liquido sconosciuto sull'acqua, le due altezze con due cifre e il rapporto
  $\dfrac{h_2}{h_1}$ tra $0{,}6$ e $0{,}99$; $d_1 = 1000 \cdot \dfrac{h_2}{h_1}$ in $\text{kg/m}^3$. Distrattori: il
  rapporto al contrario, il rapporto da solo, la differenza delle altezze al posto di $h_2$.

- "In un tubo a U che contiene mercurio ($d = 13\,600\,\text{kg/m}^3$) si versa, in un ramo, acqua
  ($d = 1000\,\text{kg/m}^3$), che non si mescola con esso. Sopra la superficie di separazione la colonna d'acqua è alta
  $63\,\text{cm}$. Quanto è alta, nell'altro ramo, la colonna di mercurio sopra lo stesso piano?" Risposta
  $4{,}6\,\text{cm}$; distrattori $8{,}6 \cdot 10^{2}\,\text{cm}$, $63\,\text{cm}$, $58\,\text{cm}$.
- "… la colonna del liquido è alta $63\,\text{cm}$ e quella d'acqua $50\,\text{cm}$. Quanto vale la densità del
  liquido?" Risposta $7{,}9 \cdot 10^{2}\,\text{kg/m}^3$; distrattori $1{,}3 \cdot 10^{3}$, $0{,}79$,
  $2{,}1 \cdot 10^{2}\,\text{kg/m}^3$.

## Esercizi da evitare

- Arrotondamenti a metà; risposte o distrattori non positivi.
- Profondità non credibili (cento metri d'olio, un metro di mercurio).
- Al livello 4 un punto troppo vicino alla superficie ($h$ sotto mezzo metro).

## Verifica

`scripts/exercises/checkers/fis_legge_stevino.py` rilegge dal testo il liquido, la sua densità (deve essere quella della
lezione, scritta come nella tabella), la profondità e le altre misure, porta tutto in unità del SI e ricalcola la
risposta in aritmetica esatta; al livello 3 ricava da sé la posizione a cui arrotondare. Controlla opzioni, quote dei
casi e dati delle scene.

## Domande per la revisione

- Livello 3: arrotondare $p_0 + d \cdot g \cdot h$ alla posizione dell'addendo meno preciso dà a volte tre cifre
  ($1{,}65 \cdot 10^{5}\,\text{Pa}$) e a volte due ($7{,}5 \cdot 10^{5}\,\text{Pa}$). È la regola della lezione sulle
  cifre significative, ma lo studente può trovarla strana: la spieghiamo nei passaggi (lo facciamo) o semplifichiamo?
- $g$ in $\text{N/kg}$ nei conti ($\text{kg/m}^3 \cdot \text{N/kg} \cdot \text{m} = \text{Pa}$), come nella lezione 17;
  qualche libro scrive $9{,}8\,\text{m/s}^2$.
