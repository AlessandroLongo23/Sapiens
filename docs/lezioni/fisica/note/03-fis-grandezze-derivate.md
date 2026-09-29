# Note: Grandezze derivate: area, volume e densità

Lezione nuova, scritta da zero (primo lotto di fisica, gruppo 1, 29 settembre 2026). `check.mts` passa sui tre file
senza errori né avvisi.

## Struttura ed esempi

Grandezze e unità derivate, con la notazione $[A] = \text{m}^2$ del README di fisica; l'area in una sezione breve, perché
formule e conversioni sono nella lezione di matematica "Equivalenza e aree" (link), con la regola del fattore al quadrato
e l'avviso sul $\text{km}^2$; il volume, con la figura del decimetro cubo, la tabella delle unità, il litro e il
millilitro, le formule di cubo e parallelepipedo (cilindro e sfera con il link ad "Aree e volumi dei solidi"), il volume
per immersione con la figura dei due cilindri; la densità con la conversione tra $\text{g/cm}^3$ e $\text{kg/m}^3$, la
tabella di dodici materiali, le formule inverse, il grafico massa-volume statico e la figura interattiva.

Quattro esempi: il volume di un acquario ($72\,\text{L}$), il materiale di un blocchetto ($81\,\text{g}$ in
$30\,\text{cm}^3$: alluminio), la massa di $2{,}5\,\text{L}$ d'olio ($2{,}3\,\text{kg}$), il volume di un chilo d'oro
($51{,}8\,\text{cm}^3$) e d'alluminio ($370\,\text{cm}^3$). Avvisi: il prefisso al quadrato, il metro cubo, la massa sopra
e il volume sotto, unità che non si accordano, più denso non vuol dire più pesante.

## Scelte

- La densità si scrive $d$, come nell'Amaldi (da confermare); il SI e molti libri universitari usano $\rho$.
- Densità della tabella: valori a temperatura ambiente arrotondati, "circa" per legno e vetro che cambiano molto; il
  ghiaccio a $0\,^\circ\text{C}$. Aria $1{,}2\,\text{kg/m}^3$ a $20\,^\circ\text{C}$ e a pressione atmosferica.
- Il galleggiamento non c'è: è della lezione su Archimede.
- Il grafico massa-volume anticipa la proporzionalità diretta, con un link alla lezione del capitolo sui grafici.

## Numeri

Rifatti in Python (lo stesso `verifica.py` delle altre lezioni del gruppo): $60 \cdot 30 \cdot 40 = 72\,000\,\text{cm}^3$,
$146 - 120 = 26\,\text{mL}$, $\dfrac{81}{30} = 2{,}7$, $920 \cdot 2{,}5 \cdot 10^{-3} = 2{,}3$,
$\dfrac{1000}{19{,}3} = 51{,}8$, $\dfrac{1000}{2{,}7} = 370{,}4$, rapporto circa $7$, spigolo del cubetto d'oro
$\sqrt[3]{51{,}8} = 3{,}73\,\text{cm}$; nel grafico, a $40\,\text{cm}^3$, alluminio $108\,\text{g}$, acqua $40\,\text{g}$,
legno di abete $18\,\text{g}$.

## Fonti

Densità: valori delle tabelle dei libri di fisica e chimica (acqua $1000$ a $4\,^\circ\text{C}$, olio d'oliva $920$,
ghiaccio $917$, alluminio $2700$, ferro $7870$, rame $8960$, piombo $11\,340$ arrotondato a $11\,300$, mercurio
$13\,546$ a $20\,^\circ\text{C}$ arrotondato a $13\,600$, oro $19\,300$). Da verificare su una tabella citabile (per
esempio il CRC Handbook) prima della pubblicazione.

## Figure

- `decimetro-cubo-centimetri-cubi` (TikZ, 273 x 216 px): cubo con le facce divise in quadretti di $1\,\text{cm}$.
- `volume-per-immersione` (TikZ, 306 x 260 px): due cilindri graduati, $120$ e $146\,\text{mL}$, con il sasso.
- `grafico-massa-volume` (TikZ, 332 x 237 px): tre rette per l'origine; ha la riga `% poi-interattivo`.
- `densita-massa-volume` (interattiva, `src/components/content/interactive/fisica/DensitaMassaVolume.tsx`, registrata in
  `FIGURES`): un cubo del materiale scelto che cresce con il volume (da $5$ a $50\,\text{cm}^3$, spigolo in scala) e il
  suo punto sulla retta del grafico massa-volume, con le rette dei quattro materiali sulla stessa scala; sotto volume,
  massa e $\dfrac{m}{V}$ che resta costante. Usa `Axes` di `fisica.tsx` per gli assi. Guardata in chiaro e in scuro, a 800
  e 390 px, dopo il clic su un materiale: zero errori, niente scorrimento laterale.

## Per il generatore

`fis-grandezze-derivate`, sei livelli a scelta multipla (specifica in `specs/exercises/fis-grandezze-derivate.md`): unità
di area e volume, il volume dai dati, la densità, densità e unità, massa e volume dalla densità, riconoscere il materiale.

## Domande per Andrea

- Densità: $d$ o $\rho$?
- La tabella delle densità: dodici materiali vanno bene? Legno di abete e vetro hanno valori molto variabili: tenerli con
  "circa" o toglierli?
- Il litro con la $\text{L}$ maiuscola (come nella lezione 2).
- Il grafico massa-volume qui anticipa la proporzionalità diretta, che ha la sua lezione nel capitolo dopo: va bene
  anticiparlo, o lo spostiamo lì?
- Generatore, livello 4: dividere i grammi per i litri dà già i $\text{kg/m}^3$ ($1\,\text{g/L} = 1\,\text{kg/m}^3$), e chi
  non converte trova comunque la risposta giusta. Lo diciamo nella lezione come trucco, o cambiamo il caso?
