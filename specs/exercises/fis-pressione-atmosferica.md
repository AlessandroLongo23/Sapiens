# La pressione atmosferica e la sua misura

Generatore: `fis-pressione-atmosferica` (`src/lib/exercises/v2/generators/fis-pressione-atmosferica.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_pressione_atmosferica.py` (aiuti in `_fis_atmosfera.py`). Lezione
collegata: `docs/lezioni/fisica/riscritte/29-fis-pressione-atmosferica.md` (note in
`docs/lezioni/fisica/note/29-fis-pressione-atmosferica.md`).

Cinque livelli, ognuno con una difficoltà in più: le conversioni tra le unità della pressione, i millimetri di
mercurio, la forza dell'aria su una superficie, l'altezza della colonna di un barometro fatto con un altro liquido,
la forza su una ventosa o sugli emisferi di Magdeburgo, dove entrano la differenza di pressione e l'area del cerchio.

## Nomi dei livelli

1. Le unità della pressione
2. Millimetri di mercurio ed ettopascal
3. La forza dell'aria su una superficie
4. La colonna di un barometro
5. La ventosa e gli emisferi

## Tipi di risposta

Risposta `number`, sempre a scelta multipla con l'unità nell'opzione (scritta come nella lezione: $\text{Pa}$,
$\text{hPa}$, $\text{bar}$, $\text{mmHg}$, $\text{N}$, $\text{m}$). Livello 1: il valore esatto della conversione.
Livello 2: tre cifre significative (la pressione ha tre o quattro cifre, $1{,}33$ ne ha tre). Livelli 3, 4, 5: due
cifre significative, perché i lati, il raggio e $g = 9{,}8\,\text{N/kg}$ ne hanno due; oltre $99$ in notazione
scientifica ($9{,}7 \cdot 10^{4}$ N). Un dato che darebbe un arrotondamento a metà si scarta. I distrattori sono
arrotondati allo stesso modo.

## Regole comuni

- $1\,\text{hPa} = 100\,\text{Pa}$, $1\,\text{bar} = 10^5\,\text{Pa} = 1000\,\text{hPa}$, $1\,\text{mmHg} =
  1{,}33\,\text{hPa}$ (scritto nel testo del livello 2), $g = 9{,}8\,\text{N/kg}$.
- Pressioni atmosferiche intere in ettopascal, da $940$ a $1050$ secondo il livello.
- Densità dei liquidi della lezione 03 e della 30: acqua $1000$, olio d'oliva $920$, alcol etilico $790$, glicerina
  $1260$, mercurio $13\,600\,\text{kg/m}^3$, scritte nel testo.
- Al livello 5 $\pi = 3{,}14$, detto nel testo, così il risultato è un numero razionale che il controllo ricalcola
  esatto. La lezione usa $\pi$ con tutte le cifre (esempi 6 e 7): con due cifre significative il risultato è lo stesso.

## Livello 1: le unità della pressione

Quattro casi, un quarto ciascuno: da hPa a Pa, da Pa a hPa, da hPa a bar (pressione da $950$ a $1050$ hPa), da bar
a Pa (un manometro da $2{,}0$ a $9{,}0$ bar, di mezzo in mezzo).

- "Un barometro segna $1015$ hPa. Quanto vale la pressione in pascal?" Risposta $101\,500$ Pa; distrattori $10\,150$
  Pa ("etto" preso per dieci), $1\,015\,000$ Pa (per mille), $10{,}15$ Pa (diviso).
- "Un manometro segna $3{,}5$ bar. Quanto vale la pressione in pascal?" Risposta $350\,000$ Pa; distrattori $3500$,
  $35\,000$, $3\,500\,000$ Pa.

## Livello 2: millimetri di mercurio ed ettopascal

Metà dei casi da mmHg a hPa (colonna da $700$ a $751$ mm, così il risultato resta sotto $1000$ hPa e ha tre cifre
senza notazione scientifica), metà da hPa a mmHg (pressione da $940$ a $1040$ hPa).

- "Un barometro a mercurio segna $745$ mmHg. Quanto vale la pressione in ettopascal? ($1\,\text{mmHg} =
  1{,}33\,\text{hPa}$)" Risposta $991$ hPa ($990{,}85$), come l'esempio 5 della lezione; distrattori $560$ hPa
  (diviso), $745$ hPa (lo stesso numero), $9{,}91 \cdot 10^{4}$ hPa (il valore in pascal).
- "Le previsioni del tempo danno una pressione di $1013$ hPa. A quanti millimetri di mercurio corrisponde?"
  Risposta $762$ mmHg ($761{,}65$); con $1{,}33$ arrotondato non viene $760$, e la soluzione lo mostra.

## Livello 3: la forza dell'aria su una superficie

$F = p \cdot S$ con la pressione da $990$ a $1030$ hPa. Metà dei casi con i lati in metri (un tavolo, una porta, il
vetro di una finestra: da $1{,}0$ a $2{,}5$ m per da $0{,}50$ a $0{,}99$ m), metà in centimetri (un libro, una
piastrella, lo schermo di un tablet: da $10$ a $40$ cm per lato, lati diversi).

- "Il piano di un tavolo misura $1{,}2$ m per $0{,}80$ m. Con quale forza l'aria preme sulla sua faccia superiore,
  se la pressione è $1013$ hPa?" Risposta $9{,}7 \cdot 10^{4}$ N (esempio 2 della lezione); distrattori
  $9{,}7 \cdot 10^{2}$ N (hPa non convertiti), il perimetro al posto dell'area, $9{,}7 \cdot 10^{5}$ N (hPa presi
  per mille pascal).
- "Una piastrella misura $20$ cm per $30$ cm…" a $1000$ hPa: risposta $6{,}0 \cdot 10^{3}$ N; distrattori con i
  cm² non convertiti ($6{,}0 \cdot 10^{7}$ N), con gli hPa non convertiti, con il perimetro.

## Livello 4: la colonna di un barometro

$h = \dfrac{p}{d \cdot g}$ con un liquido a caso tra i cinque (un quinto dei casi ciascuno), pressione da $950$ a
$1040$ hPa.

- "Quanto sarebbe alta la colonna di un barometro fatto con l'acqua (densità $1000\,\text{kg/m}^3$), quando la
  pressione atmosferica è $1013$ hPa?" Risposta $10$ m (esempio 4); distrattori $0{,}10$ m (hPa non convertiti),
  $0{,}097$ m (la formula rovesciata, $d g / p$), $0{,}76$ m (la colonna di mercurio).
- Con il mercurio a $1013$ hPa: $0{,}76$ m; il terzo distrattore è allora la colonna d'acqua.

## Livello 5: la ventosa e gli emisferi

$F = (p_0 - p_{int}) \cdot \pi r^2$. Metà dei casi una ventosa (raggio da $1{,}5$ a $4{,}5$ cm, sotto una pressione
da $200$ a $700$ hPa, multipla di $10$), metà due emisferi di Magdeburgo (diametro pari da $20$ a $60$ cm, dentro da
$10$ a $100$ hPa). Fuori da $990$ a $1030$ hPa.

- "Una ventosa ha il raggio di $3{,}0$ cm. Sotto la ventosa la pressione è $300$ hPa, fuori è $1013$ hPa…" Risposta
  $2{,}0 \cdot 10^{2}$ N (esempio 7); distrattori la sola pressione esterna ($2{,}9 \cdot 10^{2}$ N), le due pressioni
  sommate, la circonferenza al posto dell'area.
- "Due emisferi di Magdeburgo hanno il diametro di $40$ cm. Dentro la sfera è rimasta aria alla pressione di $50$
  hPa…" Il primo distrattore è il diametro preso per raggio ($\times 4$).

## Esercizi da evitare

- Arrotondamenti a metà; risultati del livello 2 oltre $999$ hPa (servirebbe la notazione scientifica).
- Lati uguali nel caso in centimetri (sarebbe un quadrato, che il testo non dice).
- Una ventosa con la pressione interna più alta di quella esterna.

## Verifica

`fis_pressione_atmosferica.py` rilegge il testo con espressioni regolari, controlla gli intervalli dei dati, le cifre
significative dei lati e del raggio e le densità della lezione, ricalcola il valore esatto con i razionali di SymPy e
lo arrotonda; poi la risposta, le quattro opzioni (diverse, arrotondate, scritte con lo spazio sottile e l'unità), la
soluzione che mostra la risposta, la quota dei casi.

Esito: seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS. `review.mts` e `width.mts` con codice 0 (opzioni
larghe al massimo 135 px).

### Errori piantati

Su 200 esercizi: risposta cambiata, opzione giusta spostata, due opzioni uguali, opzione senza lo spazio sottile tutti
bocciati. Un dato del testo aumentato di uno: bocciato 194 volte su 200; le 6 volte che passa sono casi in cui la
risposta giusta resta la stessa (una pressione di $1\,\text{hPa}$ in più al livello 2, un centimetro in più al livello
3 che non cambia le due cifre), quindi l'esercizio è ancora corretto.

### Esercizi diversi su 1.000

Seed da 1 (da 50001): livello 1 290 (285), livello 2 151 (150), livello 3 997 (999), livello 4 406 (399), livello 5
983 (981). I livelli 1 e 2 sono stretti per costruzione (pressioni intere in un intervallo di cento ettopascal).

## Domande per la revisione

- $1\,\text{mmHg} = 1{,}33\,\text{hPa}$ dato nel testo, o $760\,\text{mmHg} = 1013\,\text{hPa}$ con la proporzione?
  I due modi danno a volte risultati diversi alla terza cifra.
- $\pi = 3{,}14$ al livello 5 va bene, o si preferisce il tasto $\pi$ della calcolatrice?
- Il manometro del livello 1 segna la pressione assoluta: per le gomme si misura di solito quella in più rispetto
  all'aria. Per questo il testo non parla di gomme.
