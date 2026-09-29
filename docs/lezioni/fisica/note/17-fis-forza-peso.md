# Note: La forza-peso e la massa

Lezione nuova (primo lotto di fisica, gruppo 5, 29 settembre 2026). Conti rifatti con SymPy in `verifica_lezioni.py`:
$6{,}0 \cdot 9{,}8 = 58{,}8 \approx 59$ N, $3{,}5 / 9{,}8 = 0{,}357 \approx 0{,}36$ kg, $0{,}300 \cdot 9{,}8 = 2{,}94
\approx 2{,}9$ N, $75 \cdot 9{,}8 = 735 \approx 740$ N e $75 \cdot 1{,}6 = 120$ N, $9{,}8 / 1{,}6 = 6{,}1 \approx 6$,
$74 / 3{,}7 = 20$ kg e $196$ N, $60 \cdot 1{,}6 / 9{,}8 = 9{,}8 \approx 10$ kg, i punti del grafico ($9{,}8$ e
$39{,}2$ N). `check.mts` passa.

## Struttura ed esempi

La massa (quantità di materia, kg, non dipende dal luogo; l'inerzia rimandata al primo principio), la forza-peso come
vettore (verticale, verso il centro della Terra, applicata nel baricentro), $P = m \cdot g$ con $g = 9{,}8$ N/kg e
l'equivalenza con $\text{m/s}^2$, il grafico peso-massa, cinque esempi (zaino, massa dal dinamometro, massa in grammi,
astronauta sulla Luna, da Marte alla Terra), la tabella dei $g$, la misura del peso e della massa (dinamometro e
bilancia a bracci uguali, la bilancia pesapersone che misura una forza). Avvisi: la massa in grammi, massa e peso, il
$g$ del posto giusto; una nota sul valore di $g$ sulla Terra.

## Fonti

- $g$ sugli altri corpi celesti: NASA, "Planetary Fact Sheet - Metric", a cura di David R. Williams (NASA Goddard),
  aggiornata il 18 marzo 2025, letta il 29 settembre 2026 (`nssdc.gsfc.nasa.gov/planetary/factsheet/`), riga
  "Gravity": Mercurio $3{,}7$, Venere $8{,}9$, Terra $9{,}8$, Luna $1{,}6$, Marte $3{,}7$, Giove $23{,}1$, Saturno
  $9{,}0$, Urano $8{,}7$, Nettuno $11{,}0$ m/s². La stessa pagina dice che per i pianeti gassosi il valore è al livello
  in cui la pressione è di $1$ bar: nella lezione ho scritto "quella della Terra al livello del mare" ($1$ bar è circa
  $1$ atm; da verificare se la semplificazione va bene). Plutone ($0{,}7$) non l'ho messo.
- $g$ all'equatore e ai poli, $9{,}78$ e $9{,}83$ N/kg: sono i valori della gravità normale del modello WGS 84
  ($9{,}7803$ e $9{,}8322$ m/s²), che cito a memoria: da verificare su una fonte.
- $9{,}80665$ N/kg, il valore convenzionale: fissato dalla terza Conferenza generale dei pesi e delle misure (1901),
  anche questo a memoria: da verificare.
- "Gli astronauti delle missioni Apollo saltellavano con tute pesantissime": fatto noto, senza numero; se si vuole il
  peso della tuta, da cercare.

## Scelte

- "Forza-peso" con il trattino, come il titolo del database; nel testo anche "peso".
- $g$ in N/kg nelle formule (così $P = m \cdot g$ dà newton senza passaggi), con l'equivalenza in $\text{m/s}^2$ detta
  subito; la tabella dei corpi celesti in N/kg.
- Le cifre significative seguono il README: risultati a due cifre. $735 \approx 740$ N e $196 \approx 2{,}0 \cdot
  10^2$ N sono scritti così apposta.
- Il baricentro è linkato alla sua lezione, che viene dopo: qui basta il centro dei corpi simmetrici.
- La bilancia pesapersone come misuratore di forza è in un `ad-note`: è un'osservazione che gli studenti trovano
  sorprendente, ma si può saltare.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `forza-peso-verso-centro-terra`, `grafico-peso-massa` (con
`% poi-interattivo`), `sacchetto-appeso-forze` (le due frecce lunghe uguali, $1{,}2$ cm; senza scala numerica),
`bilancia-bracci-uguali`. Interattiva `peso-massa-pianeti` (`fisica/PesoMassaPianeti.tsx`): Terra, Luna, Marte,
Giove e una massa da $0{,}5$ a $2$ kg; il dinamometro (portata $50$ N) segna $m \cdot g$, la bilancia resta in
equilibrio con le stesse masse campione.

## Esercizi

Generatore `fis-forza-peso`, specifica in `specs/exercises/fis-forza-peso.md`: cinque livelli (il peso dalla massa, la
massa dal dinamometro, la massa in grammi, il peso su un altro corpo celeste, da un corpo celeste a un altro), scena
`dinamometro` al livello 2.

## Domande per Andrea

- $g = 9{,}8$ o $9{,}81$ N/kg? Qui $9{,}8$ ovunque, come il README (e, credo, l'Amaldi).
- $g$ in N/kg o in $\text{m/s}^2$ nella formula del peso? E la si chiama già "accelerazione di gravità" in prima?
- La massa come "quantità di materia": va bene per il primo anno, o preferite partire dall'inerzia?
- Nella tabella: tutti i pianeti, o solo Luna, Marte e Giove?
- Per i pianeti gassosi basta la frase sull'atmosfera, o si tolgono dalla tabella?
