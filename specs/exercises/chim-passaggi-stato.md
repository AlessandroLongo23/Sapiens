# I passaggi di stato

Generatore: `chim-passaggi-stato` (`src/lib/exercises/v2/generators/chim-passaggi-stato.ts`, con
`src/lib/exercises/v2/chim-materia2.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_passaggi_stato.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/19-chim-passaggi-stato.md`. Percorso nel database:
`high_school/chemistry/chim-materia/chim-passaggi-stato`.

Cinque livelli, ognuno con una difficoltà in più. Sempre scelta multipla a quattro opzioni, senza scene.

## Nomi dei livelli

1. Il nome del passaggio
2. Assorbire o cedere calore
3. Lo stato a una temperatura
4. Da una temperatura a un'altra
5. Evaporazione, ebollizione e pressione

## Livello 1: il nome del passaggio

Metà: i due stati ("Come si chiama il passaggio di una sostanza dallo stato liquido allo stato aeriforme?"
Vaporizzazione). Metà: un fatto di tutti i giorni tra diciotto della lezione ("Un pezzo di ghiaccio secco sparisce
nell'aria senza lasciare liquido." Sublimazione). Nomi della lezione: fusione, solidificazione, vaporizzazione,
condensazione, sublimazione, brinamento. Il primo distrattore è sempre il passaggio inverso.

## Livello 2: assorbire o cedere calore

Il passaggio per nome o con un fatto del livello 1; si chiede se la sostanza assorbe o cede calore, e perché. Le quattro
opzioni sono sempre le stesse: "Assorbe calore: le particelle si allontanano" (fusione, vaporizzazione, sublimazione),
"Cede calore: le particelle si avvicinano" (gli altri tre) e le due combinazioni sbagliate.

- "Durante la vaporizzazione, la sostanza assorbe o cede calore, e perché?" Assorbe calore: le particelle si
  allontanano.
- "L'acqua messa nel freezer diventa ghiaccio. Durante questo passaggio..." Cede calore: le particelle si avvicinano.

## Livello 3: lo stato a una temperatura

Quattro sostanze della tabella della lezione (azoto, ossigeno, etanolo, acetone, mercurio, acqua, naftalene, cloruro di
sodio, ferro), con le temperature di fusione e di ebollizione scritte nel testo; una temperatura multipla di $10$ tra
$-250$ e $1600\,^\circ\text{C}$, ad almeno $5\,^\circ\text{C}$ da ogni passaggio delle quattro; si chiede quale è solida,
liquida o aeriforme (un terzo ciascuna), e una sola lo è.

- "Ferro, cloruro di sodio, acqua, etanolo ... quale è liquida a $1000\,^\circ\text{C}$?" Cloruro di sodio.
- "... ossigeno ... quale è liquida a $-200\,^\circ\text{C}$?" Ossigeno.

## Livello 4: da una temperatura a un'altra

Una sostanza della tabella scaldata o raffreddata da una temperatura a un'altra (multipli di $10$, distanti almeno
$20\,^\circ\text{C}$, ad almeno $5\,^\circ\text{C}$ dai passaggi); si chiede quali passaggi avvengono. I sette casi alla
pari: nessuno, solo la fusione, solo l'ebollizione, la fusione e poi l'ebollizione, solo la solidificazione, solo la
condensazione, la condensazione e poi la solidificazione. Distrattori: il passaggio inverso, un passaggio in più o in
meno.

- "Un campione di acetone viene scaldato da $-140$ a $100\,^\circ\text{C}$ ..." La fusione e poi l'ebollizione.
- "Un campione di acqua viene raffreddato da $30$ a $-60\,^\circ\text{C}$ ..." Solo la solidificazione.

## Livello 5: evaporazione, ebollizione e pressione

Otto situazioni della lezione, ognuna con la sua risposta e tre errori veri: l'acqua in montagna (una località tra sei,
con la quota) bolle sotto i $100\,^\circ\text{C}$; nella pentola a pressione sopra; la pozzanghera evapora dalla
superficie; l'ebollizione fa bolle in tutto il liquido; alzando la fiamma la temperatura resta a $100\,^\circ\text{C}$; il
freddo uscendo dalla piscina; dove l'acqua bolle più in alto, al mare o in montagna; il vapore che scotta perché
condensando cede calore.

## Esercizi da evitare

- Temperature a meno di $5\,^\circ\text{C}$ da un passaggio (livelli 3 e 4): la lezione dice che lì possono esserci due
  stati insieme.
- Due sostanze nello stato chiesto (livello 3).

## Verifica

`chim_passaggi_stato.py` ricava il passaggio dai due stati o dalle parole chiave del fatto; applica la regola della
lezione (assorbono calore i passaggi in cui le particelle si allontanano); rilegge sostanze e temperature dei livelli 3 e 4,
le confronta con la tabella della lezione e ricava gli stati con le tre zone; riconosce la situazione del livello 5.
Errori piantati bocciati.
