# Note: La legge di Pascal e il torchio idraulico

Lezione nuova, scritta da zero (secondo lotto di fisica, gruppo 8, 30 settembre 2026). `check.mts` passa sulla lezione, sul formulario e sulle flashcard senza errori; l'unico avviso è "titolo con maiuscole all'inglese" per "La legge di Pascal", che è un nome proprio.

## Struttura ed esempi

La legge di Pascal introdotta con la siringa con la sfera forata (figura), l'enunciato, la distinzione tra pressione trasmessa e forza ($F = p \cdot S$); esempio 1 con la siringa e il tappo. Un riquadro `ad-note` spiega che l'aumento di pressione si aggiunge a quella dovuta al peso del liquido (rimando a Stevino). Il torchio idraulico con la figura, $\dfrac{F_1}{S_1} = \dfrac{F_2}{S_2}$, il legame con le macchine semplici (link alla lezione 24); esempio 2 (torchio da $10$ e $500\,\text{cm}^2$), esempio 3 (sollevatore dell'officina con le aree in unità diverse), i diametri con $\dfrac{S_2}{S_1} = \left(\dfrac{D_2}{D_1}\right)^2$ ed esempio 4. Gli spostamenti dei pistoni ($S_1 \cdot s_1 = S_2 \cdot s_2$) con la pompa dei sollevatori, poi la figura interattiva. I freni idraulici con uno schema, l'esempio 5 e l'aria nel circuito. In chiusura altri dispositivi.

Avvisi accanto alla regola: il rapporto al contrario, il rapporto dei diametri non al quadrato.

## Scelte

- Il diametro si scrive $D$ maiuscola, per non confonderlo con la densità $d$ (lo si dice nel testo).
- Gli spostamenti dei pistoni ci sono, perché vengono dall'incomprimibilità del liquido (lezione 26) e servono alla figura interattiva, ma senza parlare di lavoro: il lavoro arriva al secondo anno. La frase "quello che si guadagna in forza si perde in spostamento" richiama le leve. `programma.md` non dice se l'Amaldi del primo anno tratti gli spostamenti: da verificare (domanda sotto).
- La legge è enunciata in un blocco citato (`>`), perché è l'enunciato da ricordare.
- Il peso del liquido nel torchio si trascura, e lo si dice nel riquadro sulla legge di Stevino.

## Numeri

Rifatti in Python: $10 / (2{,}0 \cdot 10^{-4}) = 5{,}0 \cdot 10^4\,\text{Pa}$ e $5{,}0 \cdot 10^4 \cdot 0{,}50 \cdot 10^{-4} = 2{,}5\,\text{N}$; torchio $200 / 10^{-3} = 2{,}0 \cdot 10^5\,\text{Pa}$, $2{,}0 \cdot 10^5 \cdot 0{,}050 = 10\,000\,\text{N}$, $10\,000 / 9{,}8 = 1020\,\text{kg}$, $200 / 9{,}8 = 20{,}4\,\text{kg}$; sollevatore $1200 \cdot 9{,}8 = 11\,760\,\text{N}$, $11\,760 \cdot 0{,}0020 / 0{,}15 = 156{,}8\,\text{N}$, rapporto $75$; diametri $80 \cdot 25 = 2000\,\text{N}$; spostamenti $10 \cdot 25 = 250\,\text{cm}^3$, $250 / 500 = 0{,}50\,\text{cm}$, $75 \cdot 10 = 750\,\text{cm}$; freni $300 / (2{,}0 \cdot 10^{-4}) = 1{,}5 \cdot 10^6\,\text{Pa}$, $1{,}5 \cdot 10^6 \cdot 12 \cdot 10^{-4} = 1800\,\text{N}$, rapporto $6$.

## Fonti

Pascal e la sua legge: "Traité de l'équilibre des liqueurs" (scritto intorno al 1653, pubblicato nel 1663); la siringa con la sfera forata è l'esperienza dei libri di testo. I numeri dei freni (pompa di $2{,}0\,\text{cm}^2$, pistone della pinza di $12\,\text{cm}^2$, $300\,\text{N}$ dal pedale dopo la leva) sono ordini di grandezza plausibili, da verificare su un manuale tecnico prima della pubblicazione.

## Figure

- `siringa-di-pascal` (TikZ): la siringa con la sfera forata e gli zampilli.
- `torchio-idraulico-schema` (TikZ): i due cilindri, le due forze, le aree e la pressione.
- `freno-idraulico-schema` (TikZ): pedale, pompa, tubo, pinza con pastiglia e disco.
- `torchio-idraulico` (interattiva, `src/components/content/interactive/fisica/TorchioIdraulico.tsx`, registrata in `FIGURES`): cursori per $F_1$ (da $50$ a $500\,\text{N}$), $S_1$ (da $5$ a $50\,\text{cm}^2$) e $S_2$ (da $100$ a $1000\,\text{cm}^2$), larghezze dei cilindri secondo i diametri; sotto la pressione, il rapporto delle aree, la forza $F_2$ e la massa sollevata (una cassa sul pistone grande); "Spingi di 20 cm" abbassa il pistone piccolo e alza il grande di $s_2 = s_1 \cdot \dfrac{S_1}{S_2}$, con le posizioni di partenza tratteggiate. La freccia di $F_1$ è in scala; $F_2$ non ha freccia, perché può essere $200$ volte più lunga. Guardata in chiaro, in scuro, a 390 px e dopo "Spingi": zero errori, niente scorrimento laterale.

I pezzi del liquido (liquido, superficie, recipiente, pistone) sono nel file nuovo `src/components/content/interactive/fisica/liquidi.tsx`, fatto per tutto il capitolo dei fluidi.

## Per il generatore

`fis-legge-pascal`, cinque livelli (specifica in `specs/exercises/fis-legge-pascal.md`): la pressione trasmessa, la forza sul pistone grande, la forza per reggere un carico, i diametri dei pistoni, gli spostamenti dei pistoni. Dal livello 2 la scena `torchio-idraulico` (`src/components/content/exercises/scenes/TorchioIdraulico.tsx`). `verify.py` passa con i seed 1, 50001 e 777001; `review.mts` e `width.mts` escono con 0; errori piantati bocciati, compresi i dati della scena cambiati.

## Domande per Andrea

- L'Amaldi del primo anno tratta gli spostamenti dei pistoni ($S_1 \cdot s_1 = S_2 \cdot s_2$) e il "guadagno" in forza pagato in spostamento? Se no, la sezione diventa un `ad-note` e il livello 5 del generatore si toglie.
- Il diametro con la $D$ maiuscola va bene, o i libri usano $d$ anche qui?
- L'enunciato della legge di Pascal in un blocco citato: va bene come formato, o lo scriviamo come testo normale con il termine in grassetto?
- Nell'esempio 1 la pressione "si trasmette" anche al tappo, che è più piccolo: è l'occasione per distinguere pressione e forza. È chiaro così, o serve una figura?
- I freni: lo schema è molto semplificato (una sola pastiglia, niente servofreno). Basta per il primo anno?
