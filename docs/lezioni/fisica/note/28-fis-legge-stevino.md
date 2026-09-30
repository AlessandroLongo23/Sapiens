# Note: La legge di Stevino e i vasi comunicanti

Lezione nuova, scritta da zero (secondo lotto di fisica, gruppo 8, 30 settembre 2026). `check.mts` passa sulla lezione, sul formulario e sulle flashcard senza errori; gli unici avvisi sono "titolo con maiuscole all'inglese" per "La legge di Stevino", che è un nome proprio.

## Struttura ed esempi

La pressione dovuta al peso del liquido ricavata dalla colonna di base $S$ e altezza $h$ (figura): $\dfrac{P}{S} = d \cdot g \cdot h$, l'area si semplifica. La legge di Stevino $p = p_0 + d \cdot g \cdot h$ con le unità controllate, $p_0$ al livello del mare con il rimando alla lezione 29 (senza Torricelli), la dipendenza lineare (link alla lezione 11), i punti alla stessa profondità, la differenza tra due profondità. Due avvisi subito dopo: la profondità dalla superficie e non dal fondo, la densità in $\text{g/cm}^3$ (e i centimetri). Esempi: dieci metri d'acqua, un sub nel mare, il tappo della vasca (la pressione atmosferica si annulla), acqua e mercurio. Il paradosso idrostatico con la figura dei tre recipienti, la spiegazione con le pareti, l'esempio 5 (la forza sul fondo) e la figura interattiva del sensore, poi l'avviso "più liquido non vuol dire più pressione". I vasi comunicanti con la figura, la spiegazione con Stevino e gli esempi della vita di tutti i giorni; due liquidi che non si mescolano nel tubo a U, con la figura, $d_1 \cdot h_1 = d_2 \cdot h_2$, l'avviso sulle altezze, gli esempi 6 (olio e acqua) e 7 (la densità di un liquido) e la figura interattiva. In chiusura i rimandi alle lezioni 29 e 30.

## Scelte

- La densità è $d$, come deciso nel primo lotto; i prodotti con il punto, $d \cdot g \cdot h$, come le altre formule delle lezioni di fisica ($P = m \cdot g$).
- $g$ in $\text{N/kg}$ nei conti, come nelle lezioni 17-19: con $d$ in $\text{kg/m}^3$ e $h$ in metri le unità danno direttamente $\text{N/m}^2$, e la lezione lo mostra.
- $p_0 \approx 1{,}013 \cdot 10^5\,\text{Pa}$ come nella lezione 29, arrotondato negli esempi a $1{,}01 \cdot 10^5\,\text{Pa}$; nelle somme il risultato si arrotonda all'addendo meno preciso ($1{,}99 \cdot 10^5$ nell'esempio 1, $3{,}5 \cdot 10^5$ nell'esempio 2).
- Nel tubo a U gli indici sono $1$ per il liquido versato (quello meno denso) e $2$ per l'altro, come nella figura e nel generatore.
- Il barometro e la misura della pressione atmosferica sono della lezione 29: qui solo il rimando.

## Numeri

Rifatti in Python: $1000 \cdot 9{,}8 \cdot 1{,}5 = 14\,700$ e $1000 \cdot 9{,}8 \cdot 0{,}30 = 2940$ (avviso); $1000 \cdot 9{,}8 \cdot 10 = 98\,000$ e $101\,000 + 98\,000 = 199\,000$; $1030 \cdot 9{,}8 \cdot 25 = 252\,350$ e $101\,000 + 252\,350 = 353\,350$ (rapporto $3{,}5$); a trenta metri di mare $101\,000 + 302\,820 = 403\,820$, circa quattro volte; $1000 \cdot 9{,}8 \cdot 0{,}40 = 3920$ e $3920 \cdot 12 \cdot 10^{-4} = 4{,}70\,\text{N}$ ($0{,}48\,\text{kg}$); $10 \cdot 13\,600 / 1000 = 136\,\text{cm}$; paradosso $2940\,\text{Pa}$, $2940 \cdot 50 \cdot 10^{-4} = 14{,}7\,\text{N}$, $50 \cdot 30 = 1500\,\text{cm}^3$; piscina $1000 \cdot 9{,}8 \cdot 2 = 19\,600$; olio $10{,}0 \cdot 0{,}92 = 9{,}20\,\text{cm}$ e la differenza $0{,}80\,\text{cm}$; densità $1000 \cdot 9{,}6 / 12{,}0 = 800\,\text{kg/m}^3$.

## Fonti

Stevin: "De Beghinselen des Waterwichts" (1586). Densità dell'acqua di mare $1030\,\text{kg/m}^3$ (tra $1020$ e $1030$ secondo salinità e temperatura), dell'olio d'oliva $920$ e del mercurio $13\,600$ come nella tabella della lezione 03: da verificare su una tabella citabile prima della pubblicazione, come le altre densità.

## Figure

- `colonna-liquido-stevino` (TikZ): la colonna di liquido con la base $S$, la profondità $h$, il peso e $p_0$.
- `paradosso-idrostatico` (TikZ): tre recipienti di forme diverse, stesso livello, stessa pressione sul fondo.
- `vasi-comunicanti` (TikZ): quattro vasi di forme diverse collegati, stesso livello.
- `tubo-a-u-due-liquidi` (TikZ): olio e acqua con il piano della superficie di separazione e $h_1$, $h_2$.
- `pressione-profondita` (interattiva, `src/components/content/interactive/fisica/PressioneProfondita.tsx`, registrata in `FIGURES`): un recipiente con il liquido fino a $30\,\text{cm}$ e un sensore da trascinare; bottoni per la forma (dritto, che si allarga, che si stringe) e per il liquido (acqua, acqua di mare, olio); sotto $h$, $d \cdot g \cdot h$ e $p$ in kPa, e una linea tratteggiata orizzontale per il sensore.
- `tubo-a-u-liquidi` (interattiva, `src/components/content/interactive/fisica/TuboAU.tsx`, registrata in `FIGURES`): un cursore versa da $0$ a $12\,\text{cm}$ del secondo liquido, tre coppie (acqua e olio, mercurio e acqua, mercurio e olio), "Versa" e "Svuota"; i livelli si spostano in scala e sotto si leggono $h_1$, $h_2$, $d_1 \cdot h_1$ e $d_2 \cdot h_2$, sempre uguali. Niente alcol: si mescola con l'acqua.

Le due interattive sono state guardate in chiaro, in scuro, a 390 px e dopo un clic (forma "che si stringe", "Versa", coppia "mercurio e acqua"): zero errori in console, niente scorrimento laterale. Usano i pezzi di `src/components/content/interactive/fisica/liquidi.tsx`.

## Per il generatore

`fis-legge-stevino`, sei livelli (specifica in `specs/exercises/fis-legge-stevino.md`): la pressione idrostatica, profondità in centimetri, la pressione totale, la profondità dalla superficie, la profondità dalla pressione, il tubo a U. Scene `recipiente-liquido` (livelli 1, 2 e 4) e `tubo-a-u` (livello 6), in `src/components/content/exercises/scenes/`. `verify.py` passa con i seed 1, 50001 e 777001; `review.mts` e `width.mts` escono con 0; errori piantati bocciati, compresi i dati delle scene.

## Domande per Andrea

- $d \cdot g \cdot h$ con i punti, o $d\,g\,h$ senza, come in molti libri?
- $g$ in $\text{N/kg}$ nella legge di Stevino, come nella lezione 17, o in $\text{m/s}^2$?
- $p_0$: la lezione 29 (gruppo 9) usa $1{,}013 \cdot 10^5\,\text{Pa}$; qui la definizione dice lo stesso valore e gli esempi e il generatore usano $1{,}01 \cdot 10^5\,\text{Pa}$, arrotondato a tre cifre (con i dati a due cifre il risultato non cambia). Va bene, o usiamo $1{,}013 \cdot 10^5$ anche nei conti?
- L'arrotondamento di $p_0 + d \cdot g \cdot h$ all'addendo meno preciso ($1{,}99 \cdot 10^5$ ma $3{,}5 \cdot 10^5$) segue la lezione sulle cifre significative, ma può confondere. Teniamo la regola o arrotondiamo sempre a due cifre?
- Il paradosso idrostatico: la spiegazione con le forze delle pareti inclinate è sufficiente, o serve una figura con le forze sulle pareti dei tre recipienti?
- La botte di Pascal (il tubo sottile e alto che fa scoppiare una botte) non c'è, perché l'attribuzione a Pascal è incerta. La vogliamo, presentata come esperienza?
- Nel tubo a U: $1$ per il liquido versato e $2$ per l'altro, o il contrario come in qualche libro?
