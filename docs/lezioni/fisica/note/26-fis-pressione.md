# Note: La pressione

Lezione nuova, scritta da zero (secondo lotto di fisica, gruppo 8, 30 settembre 2026). `check.mts` passa sulla lezione, sul formulario e sulle flashcard senza errori né avvisi.

## Struttura ed esempi

Definizione $p = \dfrac{F_\perp}{S}$ con il legame alla forza premente della lezione sull'attrito e al peso della lezione 17; la proporzionalità inversa con l'area (link alla lezione 12); la sola componente perpendicolare, con una figura e il link a "Seno e coseno"; la pressione come grandezza scalare. Il pascal, i multipli (hPa, kPa, MPa) e il bar in una tabella; atmosfera e millimetro di mercurio rimandati alla lezione 29, senza anticipare Torricelli. La conversione delle aree con il fattore al quadrato (link alla lezione 03). Cinque esempi: scarpe e sci sulla neve, tacco a spillo ed elefante, testa e punta del chiodo (con figura), un blocco sulle tre facce (con figura), l'area minima degli sci. Poi solidi e fluidi: il fluido fermo spinge perpendicolarmente alle pareti (figura con le frecce più lunghe in basso, rimando a Stevino), la pressione in un punto è la stessa in tutte le direzioni, il fluido ideale (incomprimibile e non viscoso), i gas con il link alla legge di Boyle. Chiude con il rimando alla legge di Pascal.

Avvisi accanto alla regola: la pressione non è una forza, i centimetri quadrati non convertiti.

## Scelte

- La forza nella formula è $F_\perp$, come la forza premente della lezione 19; il peso con $g = 9{,}8\,\text{N/kg}$, come nella lezione 17.
- I risultati hanno due cifre significative, come i dati; nell'esempio 4 il primo risultato è $980\,\text{Pa}$, e lo si dice, perché $9{,}8 \cdot 10^2$ sarebbe stato meno leggibile.
- La tabella delle unità mette il bar insieme ai multipli del pascal, anche se non è del SI (lo si dice).
- Nessuna figura interattiva: le tre previste per il gruppo sono nelle lezioni 27 e 28.

## Numeri

Rifatti in Python: $60 \cdot 9{,}8 = 588\,\text{N}$; $588 / 0{,}040 = 14\,700\,\text{Pa}$; $2 \cdot 1{,}70 \cdot 0{,}10 = 0{,}34\,\text{m}^2$; $588 / 0{,}34 = 1729$; $0{,}34 / 0{,}040 = 8{,}5$; tacco $588 / 10^{-4} = 5{,}88 \cdot 10^6$; elefante $5000 \cdot 9{,}8 = 49\,000\,\text{N}$, $49\,000 / 0{,}40 = 122\,500\,\text{Pa}$, rapporto delle pressioni $48$ e delle forze $83$; chiodo $20 / 10^{-4} = 2{,}0 \cdot 10^5$ e $20 / 10^{-7} = 2{,}0 \cdot 10^8$; blocco $19{,}6 / 0{,}020 = 980$, $19{,}6 / 0{,}010 = 1960$, $19{,}6 / 0{,}0050 = 3920$; sci $686 / 2000 = 0{,}343\,\text{m}^2$; foglio A4 ($80\,\text{g/m}^2 \cdot 0{,}0624\,\text{m}^2 = 5\,\text{g}$) $0{,}049 / 0{,}0624 = 0{,}79\,\text{Pa}$; acqua, modulo di compressibilità circa $2{,}2 \cdot 10^9\,\text{Pa}$, quindi circa $2 \cdot 10^7\,\text{Pa}$ per l'$1\%$ di volume.

## Fonti

Da verificare prima della pubblicazione: la pressione di un pneumatico d'auto (circa $2{,}2\,\text{bar}$, relativa, dai libretti delle auto); l'area di appoggio della zampa di un elefante ("circa $0{,}10\,\text{m}^2$", ordine di grandezza); il modulo di compressibilità dell'acqua ($2{,}2 \cdot 10^9\,\text{Pa}$ a temperatura ambiente, valore dei manuali); la pressione che regge la neve fresca ($2{,}0\,\text{kPa}$ è un valore d'esempio, e il testo lo presenta così).

## Figure

- `forza-obliqua-componente-perpendicolare` (TikZ): un blocco spinto da una forza obliqua con le due componenti.
- `chiodo-testa-punta` (TikZ, nell'esempio 3): il chiodo con il pollice e le due aree.
- `blocco-tre-facce` (TikZ, nell'esempio 4): lo stesso blocco sulle tre facce, con area e pressione.
- `forze-liquido-pareti` (TikZ): un recipiente con una parete inclinata e le forze del liquido perpendicolari alle pareti. Primo uso della convenzione del liquido del README (`cyan!20`, superficie `thin`).

Guardate con `anteprima.mjs` in chiaro e in scuro.

## Per il generatore

`fis-pressione`, cinque livelli (specifica in `specs/exercises/fis-pressione.md`): la pressione dalla forza e dall'area, l'area in centimetri quadrati, il peso come forza premente, la forza o l'area dalla pressione, il blocco appoggiato su una faccia. `verify.py` passa con i seed 1, 50001 e 777001 (1000 esercizi per livello); `review.mts` e `width.mts` escono con 0; errori piantati (risposta, opzione giusta, un dato del testo, un'opzione scritta male) tutti bocciati.

## Domande per Andrea

- $F_\perp$ nella formula della pressione (come la forza premente della lezione 19) o solo $F$, con la frase "la forza perpendicolare"?
- Il bar nella tabella dei multipli del pascal: va bene, o lo teniamo solo nella lezione sulla pressione atmosferica?
- Esempio 4: $980\,\text{Pa}$ lasciato con tre cifre, spiegando che con due sarebbe $9{,}8 \cdot 10^2$. Meglio scrivere direttamente $9{,}8 \cdot 10^2\,\text{Pa}$?
- Il "fluido ideale" qui ha due proprietà (incomprimibile e non viscoso). Alcuni libri lo introducono solo con i fluidi in moto (terzo anno): lo lasciamo qui?
- L'esempio del tacco a spillo e dell'elefante è classico; i numeri (tacco di $1\,\text{cm}^2$, zampa di $0{,}10\,\text{m}^2$) vanno bene come ordini di grandezza?
