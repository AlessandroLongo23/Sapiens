# Note: Teoria del legame di valenza: legami sigma e pi greco

Lezione nuova (6 ottobre 2026), lotto del terzo anno, gruppo G: capitolo "La forma delle molecole e le teorie del
legame", terza lezione su quattro. `check.mts` passa su lezione, formulario e flashcard, senza avvisi.

## Struttura e confini

Le tre idee della teoria con $\mathrm{H_2}$; gli elettroni spaiati e il numero di legami (H, N, O, F con i diagrammi a
caselle); il legame $\sigma$ nei tre casi ($s$ e $s$, $s$ e $p$, $p$ e $p$ di testa); il legame $\pi$ e il confronto
con il $\sigma$; legami singoli, doppi e tripli, con $\mathrm{N_2}$ e la tabella dei legami tra carboni; contare
$\sigma$ e $\pi$ in una molecola; i due fatti che il modello non spiega (gli angoli di acqua e ammoniaca, i quattro
legami del carbonio), che portano alla 71.

- Confine con la 71, deciso qui: la 70 usa solo orbitali atomici non mescolati. Le molecole descritte con gli orbitali
  sono biatomiche ($\mathrm{H_2}$, $\mathrm{HF}$, $\mathrm{HCl}$, $\mathrm{F_2}$, $\mathrm{N_2}$) più
  $\mathrm{H_2S}$ nell'esempio 1, solo per contare i legami. Il conteggio di $\sigma$ e $\pi$ si fa invece su
  qualunque formula di struttura ($\mathrm{CO_2}$, $\mathrm{HCN}$, etene), perché non richiede di sapere quali
  orbitali si sovrappongono: quello lo dice la 71.
- Energia e lunghezza di legame, legami singoli, doppi e tripli come coppie condivise sono della 62 e della 63: qui si
  richiamano con il link alla 62 (la curva dell'energia) e con la tabella dei legami tra carboni, che serve a far
  vedere che il $\pi$ è più debole.
- La teoria degli orbitali molecolari è fuori, come dice il brief: per questo la lezione non parla dell'ossigeno
  $\mathrm{O_2}$ (il legame di valenza lo descrive come $\sigma$ più $\pi$ ma non ne spiega il paramagnetismo).
- Il segno della funzione d'onda: la 52 dice che "conterà quando studierai i legami". La 70 lo usa in un solo punto:
  due lobi si sovrappongono in modo utile se hanno lo stesso segno, e per questo un orbitale $s$ affiancato a un $p$
  non dà legame. Nelle figure i due segni hanno i due colori della 52 (azzurro e rosato).

## Scelte da confermare

- "Legame pi greco" nel titolo e nei titoli di sezione, come nell'albero; nel testo $\pi$ e $\sigma$.
- "Di testa" e "di fianco" per i due modi di sovrapporsi (i libri: frontale e laterale).
- La zona di sovrapposizione è arancione in tutte le figure, statiche e interattive.
- L'esempio 3 ricava l'energia del $\pi$ per differenza ($614 - 347 = 267\,\text{kJ/mol}$) e dice che il conto è
  approssimato.

## Dati e cose da verificare

- Heitler e London, 1927, per $\mathrm{H_2}$; Pauling "negli anni successivi" (i lavori sulla natura del legame
  chimico sono dal 1931, il libro del 1939): scritti a memoria, da verificare.
- Energie e lunghezze dei legami tra carboni: 347, 614, 839 kJ/mol e 154, 134, 120 pm, valori medi dei manuali
  scritti a memoria (altri libri: 348, 612, 837). Vanno allineati con la tabella della lezione 63 (gruppo E), che
  non ho potuto leggere perché scritta in parallelo.
- "Per ruotare servono circa 267 kJ/mol" attorno al doppio legame: è l'energia del $\pi$ stimata nell'esempio 3; la
  barriera misurata per l'etene è vicina (circa 270 kJ/mol, da verificare).
- Configurazioni da `elementi.json`: N $[\text{He}]\,2s^2\,2p^3$, O $2p^4$, F $2p^5$, S $[\text{Ne}]\,3s^2\,3p^4$,
  Cl $3p^5$.
- "Tra due atomi c'è posto per un solo legame $\sigma$": vero per tutte le molecole della scuola.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `legame-valenza-elettroni-spaiati`, `legame-valenza-sigma-tre-casi`,
`legame-valenza-pi-laterale`, `legame-valenza-azoto-triplo`, `legame-valenza-acqua-novanta-gradi`.

Due interattive:

| Nome | File | Che cosa fa |
|---|---|---|
| `legame-valenza-sovrapposizione` | `LegameValenzaSovrapposizione.tsx` | due orbitali da avvicinare con un cursore, in cinque coppie a scelta; la zona dove si sovrappongono lobi dello stesso segno è arancione, di segno opposto grigia; sotto, $\sigma$, $\pi$ o nessun legame |
| `legame-valenza-ordine-rotazione` | `LegameValenzaOrdineRotazione.tsx` | due carboni con legame singolo, doppio o triplo (etano, etene, etino) e un cursore che ruota l'atomo di destra: nel singolo non cambia niente, nel doppio il $\pi$ sbiadisce fino a rompersi a $90^\circ$; sotto, numero di $\sigma$ e $\pi$, energia e lunghezza |

Nella prima le distanze sono schematiche (il cursore va da "lontani" a "distanza di legame", in percentuale). Nella
seconda la distanza tra i due carboni è in scala con le lunghezze di legame; nel triplo il cursore non fa niente, e
la didascalia dice perché.

## Esercizio guidato

L'esempio 5 (i legami dell'etene), meglio ancora su una molecola con un triplo, come $\mathrm{CH_3{-}C{\equiv}CH}$.
Si fermerebbe in tre punti: la formula con tutti i trattini; quanti legami $\sigma$; quanti legami $\pi$.

## Dubbi per Andrea

- Il segno della funzione d'onda nei lobi (due colori, "stesso segno si sovrappone") resta, o in una terza si
  disegnano i lobi tutti uguali?
- Il caso "orbitale $s$ di fianco a un $p$: nessun legame" nella figura interattiva è utile o è troppo?
- La lezione deve nominare $\mathrm{O_2}$ e il limite del legame di valenza sul suo paramagnetismo, anche solo in
  una nota?
- I valori delle energie di legame: quali usa il libro di riferimento?
- "Di testa" e "di fianco", oppure "frontale" e "laterale"?

## Esercizi

Generatore `chim-legame-valenza`, sei livelli (specifica in `specs/exercises/chim-legame-valenza.md`).

Prerequisiti proposti: chim-orbitali-numeri-quantici, chim-configurazione-elettronica, legame-covalente, chim-formule-lewis
