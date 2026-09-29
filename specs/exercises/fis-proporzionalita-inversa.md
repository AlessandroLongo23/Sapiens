# Proporzionalità inversa e quadratica

Generatore: `fis-proporzionalita-inversa` (`src/lib/exercises/v2/generators/fis-proporzionalita-inversa.ts`). Verifica
indipendente: `scripts/exercises/checkers/fis_proporzionalita_inversa.py` (con `_fis_grafici.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/12-fis-proporzionalita-inversa.md` (note in
`docs/lezioni/fisica/note/12-fis-proporzionalita-inversa.md`).

Cinque livelli. Il livello 5 ha il grafico `grafico-dati` con i soli punti.

## Tipi di risposta

Scelta multipla con quattro opzioni. Livelli 1, 2 e 3: numero con unità. Livelli 4 e 5: la legge in parole, sempre
nello stesso ordine: "proporzionalità diretta", "lineare con termine noto", "proporzionalità inversa",
"proporzionalità quadratica".

## Regole comuni

- Esperimenti in proporzionalità inversa: siringa (pressione e volume, $k$ da $1200$ a $3600\ \text{kPa} \cdot
  \text{cm}^3$, come l'esempio 1), carrello sulla rotaia (tempo e velocità, $k$ la lunghezza della rotaia, da $1{,}2$ a
  $2{,}4$ m, come l'esempio 2), vasca (tempo e portata, $k$ il volume della vasca, da $60$ a $240$ L).
- Esperimenti quadratici: carrello sul piano inclinato ($s = kt^2$, $k$ da $8$ a $24\ \text{cm/s}^2$, come l'esempio
  4), sasso che cade ($h = 4{,}9\ \text{m/s}^2 \cdot t^2$).
- Livelli 4 e 5: due grandezze neutre, $x$ in secondi e $y$ in centimetri, perché il nome dell'esperimento non dica la
  legge.
- Tutti i valori esatti con i decimali della tabella; la costante con almeno due cifre significative.

## Livello 1: la costante inversa con la sua unità

Tabella di 4 o 5 righe, grandezze dichiarate inversamente proporzionali; si chiede $k = x \cdot y$.

- Siringa, $20\ \text{cm}^3$ $150$ kPa ... $60\ \text{cm}^3$ $50$ kPa. Risposta $3000\ \text{kPa} \cdot \text{cm}^3$;
  distrattori $7{,}5\ \text{kPa/cm}^3$ (il rapporto al posto del prodotto), $3000$ kPa (un'unità dimenticata),
  $30\,000\ \text{kPa} \cdot \text{cm}^3$.
- Vasca, $6$ L/min $20{,}0$ min ... Risposta $120$ L; distrattori $120$ min, $1200$ L, $3{,}3\ \text{min}^2\text{/L}$.

## Livello 2: prevedere con la proporzionalità inversa

Una coppia e un nuovo valore di $x$, in una frase ("L'aria chiusa in una siringa ha la pressione di $120$ kPa quando il
volume è di $25\ \text{cm}^3$ ... quando il volume è di $30\ \text{cm}^3$?"). Risposta $100$ kPa; distrattori $144$ kPa
(la proporzione diretta, l'avviso della lezione), $83$ kPa (l'inverso del quadrato), $120$ kPa (invariato).

## Livello 3: prevedere con la proporzionalità quadratica

"Un carrello che parte da fermo su una rotaia inclinata percorre $80{,}0$ cm in $2{,}0$ s ... in $2{,}5$ s?" Risposta
$125{,}0$ cm; distrattori $100{,}0$ cm (proporzionale al tempo), $200{,}0$ cm (il doppio del fattore), $51{,}2$ cm (il
quadrato rovesciato). Stessa cosa con il sasso ($78{,}4$ m in $4{,}0$ s, in $3{,}0$ s: $44{,}1$ m).

## Livello 4: riconoscere la legge dalla tabella

Quattro righe, circa un quarto per legge: diretta ($y = kx$), lineare ($y = kx + q$, $q$ da $2$ a $20$), inversa
($y = K/x$), quadratica ($y = \frac{k}{2} x^2$). Una sola legge deve andare bene.

## Livello 5: riconoscere la legge dal grafico

Da quattro a cinque punti su incroci della griglia, senza linea, circa un quarto per legge. La dipendenza lineare è
metà delle volte una retta che scende: la lezione avverte che una curva (o una retta) che scende non è per forza una
proporzionalità inversa.

## Esercizi da evitare

- Tabelle in cui vanno bene due leggi.
- Punti fuori dal foglio o non su un incrocio.
- Pressioni sopra $400$ kPa o tempi sotto $1$ s sulla rotaia.

## Verifica

`scripts/exercises/checkers/fis_proporzionalita_inversa.py` rilegge testo, tabella e scena: prodotti riga per riga
(livello 1), la previsione $y_2 = y_1 x_1 / x_2$ e $y_2 = y_1 (x_2/x_1)^2$ esatte (livelli 2 e 3, con la costante del
sasso e del carrello in un intervallo plausibile), e per i livelli 4 e 5 le quattro grandezze $y/x$, $\Delta y /
\Delta x$, $x \cdot y$, $y/x^2$: esattamente una deve essere costante.

Esito: seed 1, 50001 e 777001, 5000 esercizi ciascuno, PASS; quote dei livelli 4 e 5 nei limiti (tra 0,24 e 0,27 per
legge). `review.mts` 0, `width.mts` 0 (problema al massimo 194 px, opzioni al massimo 204 px).

Errori piantati, su 30 esercizi per livello: 750 su 750 bocciati.

Esercizi diversi su 1.000 (seed da 1): livello 1 834, livello 2 662, livello 3 183, livello 4 494, livello 5 173. I
livelli 3 e 5 sono stretti per costruzione (pochi tempi danno risultati esatti; pochi insiemi di punti stanno su un
foglio di $18$ quadretti).

## Nomi dei livelli

1. La costante inversa con la sua unità
2. Prevedere con la proporzionalità inversa
3. Prevedere con la proporzionalità quadratica
4. Riconoscere la legge dalla tabella
5. Riconoscere la legge dal grafico

## Domande per la revisione

- Livelli 4 e 5: grandezze neutre ($x$ in secondi, $y$ in centimetri) invece di un esperimento vero. Va bene, o si
  preferisce un esperimento anche a costo di suggerire la legge?
- Livello 1 del carrello: l'unità della costante è $\text{m/s} \cdot \text{s} = \text{m}$. Il distrattore "rapporto"
  ha unità $\text{s}^2\text{/m}$ e $\text{min}^2\text{/L}$, poco familiari: tenerli?
- Il sasso usa $4{,}9\ \text{m/s}^2$, cioè $g/2$, prima della lezione sulla caduta libera. Va bene al primo anno?
- Manca un livello sulla linearizzazione ($p$ in funzione di $1/V$): la lezione la spiega. Serve?
