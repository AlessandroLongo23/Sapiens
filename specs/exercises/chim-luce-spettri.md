# La luce e gli spettri atomici

Generatore: `chim-luce-spettri` (`src/lib/exercises/v2/generators/chim-luce-spettri.ts`, con
`src/lib/exercises/v2/chim3-a.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_luce_spettri.py` (con
`_chim3_a.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/48-chim-luce-spettri.md`. Percorso nel database:
`high_school/chemistry/chim-struttura-elettronica/chim-luce-spettri`.

Sei livelli, ognuno con una difficoltà in più. Tutto a scelta multipla, quattro opzioni; le risposte con unità hanno
l'unità nell'opzione. Costanti della lezione: $c = 3{,}00 \cdot 10^8\,\text{m/s}$, $h = 6{,}63 \cdot 10^{-34}\,\text{J} \cdot \text{s}$,
$N_A = 6{,}02 \cdot 10^{23}\,\text{mol}^{-1}$. I risultati hanno tre cifre significative, in notazione scientifica
($5{,}66 \cdot 10^{14}\,\text{Hz}$), tranne le lunghezze d'onda in nanometri e le energie in $\text{kJ/mol}$, che sono
numeri di tre cifre ($589\,\text{nm}$, $226\,\text{kJ/mol}$). Un esercizio il cui risultato cade a meno di $0{,}08$
dall'arrotondamento della terza cifra si scarta, così la risposta non dipende da come si arrotondano i passaggi. Nessun
distrattore con la stessa unità sta a meno del $4\%$ dalla risposta.

## Nomi dei livelli

1. Onde e regioni dello spettro
2. Lunghezza d'onda e frequenza
3. L'energia di un fotone
4. Una mole di fotoni
5. L'effetto fotoelettrico
6. Spettri continui e a righe

## Livello 1: onde e regioni dello spettro

Nessun conto. Tre casi, in parti uguali.

- Confronto: due luci visibili date con la lunghezza d'onda (da $400$ a $700\,\text{nm}$, distanti almeno $40\,\text{nm}$)
  e si chiede quale ha la frequenza più alta; oppure date con la frequenza ($k \cdot 10^{12}\,\text{Hz}$, $k$ da $400$ a
  $780$, distanti almeno $40$) e si chiede quale ha la lunghezza d'onda più lunga. Distrattori: l'altra, "hanno la
  stessa", "dipende dall'intensità".
- Regione: una lunghezza d'onda ($3$, $30$, $300\,\text{m}$; $3\,\text{mm}$, $1$, $5\,\text{cm}$; $900$, $1500$,
  $5000\,\text{nm}$; $450$, $550$, $650\,\text{nm}$; $50$, $150$, $300\,\text{nm}$; $0{,}1$, $1$, $5\,\text{nm}$;
  $0{,}001$, $0{,}005\,\text{nm}$) e si chiede la regione, con i confini della tabella della lezione. Distrattori: le
  regioni più vicine.
- Ordine: tre regioni a caso, e si chiede l'elenco in ordine di frequenza crescente, o di lunghezza d'onda crescente.
  Distrattori: l'ordine inverso (l'errore tipico) e altre permutazioni.

Esempi:

- "Due luci hanno lunghezza d'onda $450\,\text{nm}$ e $620\,\text{nm}$. Quale ha la frequenza più alta?" Risposta:
  quella a 450 nm.
- "A quale regione dello spettro elettromagnetico appartiene una radiazione con lunghezza d'onda $150\,\text{nm}$?"
  Risposta: ultravioletto.

## Livello 2: lunghezza d'onda e frequenza

$c = \lambda\,\nu$. Due casi in parti uguali: la frequenza da $\lambda$ in nanometri (intero da $380$ a $780$), oppure la
lunghezza d'onda, in metri, da una frequenza $k \cdot 10^{12}\,\text{Hz}$ ($k$ da $400$ a $780$). Distrattori: i
nanometri non portati in metri ($c$ diviso per il numero di nanometri), la formula rovesciata ($\lambda / c$,
$\nu / c$), il prodotto ($c \cdot \lambda$, $c \cdot \nu$), l'esponente sbagliato di uno.

- "Una radiazione ha lunghezza d'onda $\lambda = 530\,\text{nm}$. Qual è la sua frequenza?" Risposta:
  $5{,}66 \cdot 10^{14}\,\text{Hz}$.
- "Una radiazione ha frequenza $\nu = 4{,}60 \cdot 10^{14}\,\text{Hz}$. Qual è la sua lunghezza d'onda?" Risposta:
  $6{,}52 \cdot 10^{-7}\,\text{m}$.

## Livello 3: l'energia di un fotone

Due casi in parti uguali: $E = h\,\nu$ da una frequenza, $E = h\,c / \lambda$ da una lunghezza d'onda in nanometri.
Distrattori: $h / \nu$, $\nu / h$, i nanometri non convertiti, $h \cdot \lambda$, $h \cdot \lambda / c$, l'esponente
sbagliato di uno.

- "Una luce ha frequenza $\nu = 6{,}00 \cdot 10^{14}\,\text{Hz}$. Quanta energia porta un suo fotone?" Risposta:
  $3{,}98 \cdot 10^{-19}\,\text{J}$.
- "Una luce ha lunghezza d'onda $\lambda = 400\,\text{nm}$. Quanta energia porta un suo fotone?" Risposta:
  $4{,}97 \cdot 10^{-19}\,\text{J}$.

## Livello 4: una mole di fotoni

Due casi in parti uguali. L'energia di una mole di fotoni di lunghezza d'onda data (da $250$ a $780\,\text{nm}$), in
$\text{kJ/mol}$: distrattori i joule scritti come chilojoule, l'energia di un solo fotone, la divisione per mille fatta
due volte, i nanometri non convertiti. Oppure la lunghezza d'onda, in nanometri, da un'energia del fotone: distrattori
la frequenza (ci si ferma a $E / h$), i metri scritti come nanometri, l'esponente sbagliato di uno.

- "Quanta energia porta una mole di fotoni con lunghezza d'onda $\lambda = 400\,\text{nm}$?" Risposta: $299\,\text{kJ/mol}$.
- "Un fotone ha energia $E = 3{,}98 \cdot 10^{-19}\,\text{J}$. Qual è la lunghezza d'onda della luce, in nanometri?"
  Risposta: $500\,\text{nm}$.

## Livello 5: l'effetto fotoelettrico

Il metallo non ha nome: ha solo l'energia minima per strappare un elettrone, $k \cdot 10^{-21}\,\text{J}$ con $k$ da
$300$ a $700$ (così nessun dato di un metallo vero entra negli esercizi). Tre casi: soglia ($40\%$), energia cinetica
($40\%$), intensità ($20\%$).

- Soglia: luce di lunghezza d'onda da $250$ a $750\,\text{nm}$; l'energia del fotone dista almeno l'$8\%$ da quella
  minima. Risposte: "sì: ogni fotone ha più energia di quella che serve", "no: ogni fotone ha meno energia di quella
  che serve"; distrattori "sì, ma solo se la luce è molto intensa", "sì, ma solo dopo un tempo abbastanza lungo".
- Energia cinetica: energia del fotone data, più grande di quella minima di almeno $60 \cdot 10^{-21}\,\text{J}$;
  risposta la differenza (tre cifre da $1{,}00 \cdot 10^{-19}\,\text{J}$, due sotto). Distrattori: la somma, l'energia
  del fotone, l'energia minima.
- Intensità: si raddoppia l'intensità senza cambiare la frequenza. Risposta: "escono più elettroni, con la stessa
  energia".

Esempi:

- "Per strappare un elettrone a un metallo servono almeno $3{,}68 \cdot 10^{-19}\,\text{J}$. Il metallo è illuminato con
  luce di lunghezza d'onda $700\,\text{nm}$. Escono elettroni?" Risposta: no: ogni fotone ha meno energia di quella che
  serve.
- "Per strappare un elettrone a un metallo servono almeno $3{,}68 \cdot 10^{-19}\,\text{J}$. Un fotone di energia
  $4{,}97 \cdot 10^{-19}\,\text{J}$ colpisce il metallo e strappa un elettrone. Con quale energia cinetica esce
  l'elettrone?" Risposta: $1{,}29 \cdot 10^{-19}\,\text{J}$.

## Livello 6: spettri continui e a righe

Tre casi in parti uguali.

- Tipo di spettro di una sorgente: filamento di una lampadina e ferro rovente (continuo); idrogeno o vapori di sodio
  con una scarica elettrica, un sale sulla fiamma (a righe, di emissione); luce bianca o luce del Sole che ha
  attraversato un gas freddo (a righe, di assorbimento). Quarta opzione: "nessuno: quella luce non si separa".
- Righe di assorbimento: tre righe di emissione di un gas, e si chiede dove cadono le righe scure. Risposta: alle
  stesse lunghezze d'onda. Distrattori: "a tutte le altre lunghezze d'onda", lunghezze d'onda doppie, "da nessuna
  parte: un gas freddo non assorbe".
- Affermazioni: una vera tra tre sbagliate ($60\%$), o una sbagliata tra tre vere. Vere: ogni elemento ha le sue
  righe; un elemento assorbe le lunghezze d'onda che emette; lo spettro continuo contiene tutto il visibile; le righe
  sono le stesse in ogni laboratorio. Sbagliate: tutti gli elementi hanno le stesse righe; le righe cambiano con la
  temperatura della fiamma; un gas rarefatto dà uno spettro continuo; le righe scure sono colori che la sorgente non
  emette; un solido incandescente dà uno spettro a righe; un elemento assorbe i colori che non emette.

Esempi:

- "Che tipo di spettro dà un pezzo di ferro rovente?" Risposta: continuo.
- "Lo spettro di emissione di un gas ha tre righe, a $656$, $486$ e $434\,\text{nm}$. Lo stesso gas, freddo, viene
  attraversato da luce bianca. Dove cadono le righe scure del suo spettro di assorbimento?" Risposta: a 656, 486 e
  434 nm.

## Da evitare

- Risultati che dipendono dall'arrotondamento dei passaggi (scartati dal generatore, rifiutati dal controllo).
- Dati di metalli veri nell'effetto fotoelettrico: i valori dei libri non coincidono.
- Lunghezze d'onda fuori dal visibile nei livelli 2 e 3: lo studente non ha modo di controllare il risultato.
- Domande sui colori: i confini tra i colori cambiano da un libro all'altro.

## Risposta aperta

Nessun livello: tutte le risposte numeriche hanno un'unità.
