# La dispersione della luce e i colori

Generatore: `fis-dispersione` (`src/lib/exercises/v2/generators/fis-dispersione.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_dispersione.py`. Lezione collegata: `docs/lezioni/fisica/riscritte/35-fis-dispersione.md`.
Percorso nel database: `high_school/physics/ottica/fis-dispersione`. Nessuna scena: le domande sui colori non hanno una
figura che cambia con i dati, e i colori nel tema scuro invertito non sarebbero affidabili.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. I colori nel prisma
2. Il colore dei corpi in luce colorata
3. La sintesi additiva
4. La sintesi sottrattiva
5. Corpi gialli, ciano e magenta
6. Di quanto si separano i colori

## Il modello dei colori

Come nella lezione, ogni colore è un insieme dei tre primari additivi: rosso, verde, blu; giallo = rosso + verde,
ciano = verde + blu, magenta = rosso + blu, bianco = tutti e tre, nero = nessuno. Una luce somma i suoi primari; un
filtro o un inchiostro lascia passare (o diffonde) solo i primari del suo colore, e più filtri lasciano passare
l'intersezione; un corpo colorato diffonde i primari del suo colore che riceve. Le opzioni sono nomi di colori
(`\text{giallo}`), al livello 1 anche "sono uguali" e "dipende dall'angolo", al livello 6 angoli al decimo di grado.

## Livello 1: i colori nel prisma

Metà dei casi chiede quale colore devia di più (violetto) o di meno (rosso) in un prisma di vetro; l'altra metà mette a
confronto due colori dello spettro (rosso, arancione, giallo, verde, azzurro, indaco, violetto): quale ha l'indice più
grande (quello più vicino al violetto) o, entrando nel vetro con lo stesso angolo, l'angolo di rifrazione più grande
(quello più vicino al rosso).

- "Quale colore viene deviato di più?" Risposta: violetto; distrattori rosso, verde, giallo.
- "La luce arancione e la luce verde entrano dall'aria nel vetro con lo stesso angolo di incidenza. Quale ha l'angolo di
  rifrazione più grande?" Risposta: l'arancione; distrattori il verde, sono uguali, dipende dall'angolo.

## Livello 2: il colore dei corpi in luce colorata

Un corpo rosso, verde, blu, bianco o nero, illuminato con luce rossa, verde o blu.

- "Una maglietta, rossa in luce bianca, viene illuminata solo con luce blu." Risposta: nero; distrattori rosso (il
  colore in luce bianca), blu (il colore della luce), magenta (le luci sommate).
- "Un foglio, bianco in luce bianca, ... luce rossa." Risposta: rosso.

## Livello 3: la sintesi additiva

Due luci tra rosso, verde e blu (circa quattro volte su cinque) o tutte e tre. Distrattori: il colore che darebbe la
sintesi sottrattiva con i complementari (il filtro sbagliato), e i colori di partenza.

- "... la luce rossa e la luce verde ..." Risposta: giallo.
- "... le luci rossa, verde e blu ..." Risposta: bianco; tra i distrattori nero.

## Livello 4: la sintesi sottrattiva

Due filtri o due inchiostri tra ciano, magenta e giallo (circa quattro volte su cinque) o tutti e tre. Distrattori: il
colore che si avrebbe sommando come le luci, e i colori di partenza.

- "... due filtri: giallo e ciano." Risposta: verde; distrattori bianco (sommati come luci), giallo, ciano.
- "... tre inchiostri: ciano, magenta e giallo." Risposta: nero.

## Livello 5: corpi gialli, ciano e magenta

Un corpo giallo, ciano o magenta, illuminato con una luce primaria (circa il 60%) o secondaria.

- "Una banana, gialla in luce bianca, viene illuminata con luce ciano." Risposta: verde.
- "Un fiore, magenta in luce bianca, ... luce verde." Risposta: nero.

## Livello 6: di quanto si separano i colori

Un raggio di luce bianca entra dall'aria, con un angolo di incidenza intero da $30^\circ$ a $80^\circ$, nel vetro della
lezione (rosso $1{,}514$, violetto $1{,}530$), in un vetro denso (rosso $1{,}615$, violetto $1{,}645$, il vetro della
figura interattiva) o nell'acqua (rosso $1{,}331$, violetto $1{,}343$). Si chiede la differenza tra gli angoli di
rifrazione, al decimo di grado. La risposta deve venire uguale sottraendo gli angoli esatti o gli angoli già
arrotondati al decimo, e non può essere zero.

- Vetro, $60^\circ$: $34{,}89^\circ - 34{,}47^\circ$, risposta $0{,}4^\circ$; distrattori $0{,}4$... sostituiti se uguali:
  l'angolo diviso per l'indice ($60/1{,}514 - 60/1{,}530 = 0{,}41$, che qui coincide e viene scartato), la differenza
  degli indici per l'angolo ($0{,}016 \cdot 60 = 1{,}0^\circ$), il doppio.

## Esercizi da evitare

- Opzioni uguali; al livello 6 differenze al confine di un arrotondamento o che cambiano arrotondando prima gli angoli.

## Verifica

`fis_dispersione.py` rilegge il testo e calcola la risposta con il modello dei colori scritto di nuovo (insiemi di
primari), o con SymPy al livello 6; controlla l'opzione giusta, le quattro opzioni diverse e ben formate, i vincoli e le
quote dei casi.

## Domande per la revisione

- Il livello 5 usa il fatto che un corpo giallo diffonde il rosso e il verde: la lezione lo dice nell'ultima sezione.
  Va bene per il primo anno?
- Livello 6: la differenza al decimo di grado è un conto delicato. Serve, o basta il livello 1?
