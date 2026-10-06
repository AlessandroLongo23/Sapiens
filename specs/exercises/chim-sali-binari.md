# I sali binari

Generatore: `chim-sali-binari` (`src/lib/exercises/v2/generators/chim-sali-binari.ts`, con le tabelle di
`src/lib/exercises/v2/chim3-j.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_sali_binari.py`, con
`_chim3_j.py`. Lezione collegata: `docs/lezioni/chimica/riscritte/81-chim-sali-binari.md`. Percorso nel database:
`high_school/chemistry/chim-nomenclatura/chim-sali-binari`.

Cinque livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutto a scelta multipla, quattro opzioni.

## Nomi dei livelli

1. Gli ioni e i loro nomi
2. Dagli ioni alla formula
3. Dalla formula al nome, con un solo numero di ossidazione
4. Dalla formula al nome, con due numeri di ossidazione
5. Dal nome alla formula

## Dati

Cationi con una sola carica: $\mathrm{Li^+}$, $\mathrm{Na^+}$, $\mathrm{K^+}$, $\mathrm{Ag^+}$, $\mathrm{Mg^{2+}}$,
$\mathrm{Ca^{2+}}$, $\mathrm{Ba^{2+}}$, $\mathrm{Zn^{2+}}$, $\mathrm{Al^{3+}}$. Con due: ferro ($2+$, $3+$: ferroso,
ferrico), rame ($1+$, $2+$: rameoso, rameico), stagno ($2+$, $4+$: stannoso, stannico), piombo ($2+$, $4+$: piomboso,
piombico), come in `src/lib/tools/elementi.json`. Anioni: fluoruro, cloruro, bromuro, ioduro ($1-$), solfuro ($2-$).

Sali esclusi, perché non sono composti stabili: $\mathrm{FeI_3}$, $\mathrm{CuI_2}$, $\mathrm{PbI_4}$,
$\mathrm{PbBr_4}$, $\mathrm{PbS_2}$, $\mathrm{CuF}$.

## Livello 1: gli ioni e i loro nomi

Quattro casi: il nome di un catione con due cariche, tradizionale o di Stock (30%); la sua formula dal nome (30%); il
nome di un anione (20%); la sua formula dal nome (20%). Distrattori: l'altro ione dello stesso metallo, altre cariche,
i nomi in -ato e -ito, il nome dell'elemento o dell'acido al posto di quello dello ione.

- "Come si chiama lo ione $\mathrm{Fe^{3+}}$ nella nomenclatura tradizionale?" Risposta: ione ferrico; distrattori:
  ione ferroso, ione ferrato, ione ferruro.
- "Qual è la formula dello ione solfuro?" Risposta $\mathrm{S^{2-}}$; distrattori $\mathrm{S^-}$,
  $\mathrm{SO_4^{2-}}$, $\mathrm{S^{2+}}$.

## Livello 2: dagli ioni alla formula

Un catione e un anione con le loro cariche; si chiede la formula. Distrattori: l'incrocio non semplificato
($\mathrm{Sn_2S_4}$), gli indici scambiati, uno a uno, un indice in più.

- "Qual è la formula del sale formato dagli ioni $\mathrm{Al^{3+}}$ e $\mathrm{S^{2-}}$?" Risposta
  $\mathrm{Al_2S_3}$; distrattori $\mathrm{Al_3S_2}$, $\mathrm{AlS}$, $\mathrm{Al_2S_4}$.
- "... $\mathrm{Sn^{4+}}$ e $\mathrm{S^{2-}}$?" Risposta $\mathrm{SnS_2}$; distrattori $\mathrm{Sn_2S_4}$,
  $\mathrm{Sn_2S}$, $\mathrm{SnS}$.

## Livello 3: dalla formula al nome, con un solo numero di ossidazione

Metallo con una sola carica; metà nome tradizionale (che coincide con quello di Stock), metà nome IUPAC. Distrattori
del nome tradizionale: -ato e -ito al posto di -uro, i ruoli scambiati (calciuro di cloro), il nome dell'elemento.
Distrattori del nome IUPAC: i prefissi sulla parola sbagliata, su tutte e due, uno in più, mono- scritto.

- "Che nome IUPAC ha $\mathrm{CaCl_2}$?" Risposta: dicloruro di calcio; distrattori: cloruro di dicalcio, dicloruro
  di dicalcio, tricloruro di calcio.
- "Che nome tradizionale ha $\mathrm{Na_2S}$?" Risposta: solfuro di sodio; distrattori: solfato di sodio, solfito di
  sodio, sodiuro di zolfo.

## Livello 4: dalla formula al nome, con due numeri di ossidazione

Metallo con due cariche: bisogna trovare quella giusta partendo dalla carica dell'anione. Metà nome tradizionale,
metà notazione di Stock. Distrattori: l'altro numero di ossidazione (sempre presente), l'indice letto come numero di
ossidazione, -ato per -uro, il nome senza distinzione.

- "Che nome ha $\mathrm{SnS_2}$ nella notazione di Stock?" Risposta: solfuro di stagno(IV); distrattori: solfuro di
  stagno(II), solfuro di stagno(I), solfato di stagno(IV).
- "Che nome ha $\mathrm{FeCl_3}$ nella nomenclatura tradizionale?" Risposta: cloruro ferrico; distrattori: cloruro
  ferroso, clorato ferrico, clorito ferroso.

## Livello 5: dal nome alla formula

Un nome, con la nomenclatura dichiarata nel testo (tradizionale, di Stock, IUPAC, un terzo ciascuna); sette volte su
dieci un metallo con due cariche. Distrattori: il sale dell'altro numero di ossidazione, l'incrocio non semplificato,
gli indici scambiati.

- "Il nome tradizionale di un sale è solfuro ferrico. Qual è la sua formula?" Risposta $\mathrm{Fe_2S_3}$;
  distrattori $\mathrm{FeS}$, $\mathrm{Fe_3S_2}$, $\mathrm{FeS_2}$.
- "Il nome IUPAC di un sale è solfuro di dirame. Qual è la sua formula?" Risposta $\mathrm{Cu_2S}$.

## Esercizi da evitare

- I sei sali esclusi qui sopra.
- Tra le opzioni di un nome, un nome giusto dello stesso sale in un'altra nomenclatura (solfuro di ferro, che è il
  nome IUPAC di $\mathrm{FeS}$, quando si chiede il nome tradizionale).
- Un nome senza dire in quale nomenclatura è scritto: solfuro di rame è il nome IUPAC di $\mathrm{CuS}$, ma letto come
  nome tradizionale è incompleto.
- Lo ione mercurio(I), che è $\mathrm{Hg_2^{2+}}$: il mercurio non compare.

## Verifica

`chim_sali_binari.py` ricava la formula dalle cariche con il minimo comune multiplo, i nomi dalla formula (la carica
del metallo dalla carica dell'anione, mai dagli indici incrociati al contrario) e la formula di un nome dando il nome
a tutti i sali della lezione e cercandolo; controlla che il metallo abbia il numero di cariche che il livello chiede,
che il sale non sia tra gli esclusi e che nessuna opzione sia un nome giusto in un'altra nomenclatura.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 5.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 222 px su 252).

### Errori piantati

Su 300 esercizi (60 per livello, seed da 300): indice dell'opzione giusta spostato, distrattore uguale alla risposta,
opzione giusta scambiata con un distrattore, opzione giusta alterata (247), parole vietate, solo tre opzioni, un
indice della formula del testo cambiato (82): tutti bocciati.
