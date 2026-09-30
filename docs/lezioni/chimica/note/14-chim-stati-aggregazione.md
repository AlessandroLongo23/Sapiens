# Note: Gli stati di aggregazione

Lezione nuova (biennio di chimica, gruppo 22, 30 settembre 2026). Conti rifatti in Python: esempio 1, $1{,}0/0{,}60 =
1{,}67\,\text{L}$; esempio 2, $500/0{,}917 = 545{,}26\,\text{mL}$, aumento $45{,}3\,\text{mL}$, cioè $9{,}05\%$; avviso,
$500 \cdot 0{,}917 = 458{,}5\,\text{mL}$; esempio 4, $400 - 273 = 127$ e $80 - 273 = -193$. `check.mts` passa (avviso sui
13 grassetti riletto: sono tutti termini definiti).

## Struttura

La materia e i tre stati (forma propria, volume proprio, comprimibilità, fluidità; tabella; avviso sul liquido che
"cambia volume"; riquadri su solidi cristallini e amorfi e su gas e vapore); lo stesso campione in volumi diversi (la
densità, con link alla lezione 11; esempio del vapore, esempio del ghiaccio, avviso sulla densità moltiplicata); da che
cosa dipende lo stato (temperatura di fusione e di ebollizione, tabella di otto sostanze, procedimento in tre passi,
figura degli intervalli, esempi con l'etanolo e con i kelvin, avvisi sui numeri negativi e sulle scale mescolate; la
pressione; il plasma in un riquadro). Chiude con il rimando al modello particellare. I passaggi di stato sono solo
nominati, con link alla lezione 19 del gruppo 23.

## Scelte

- "Aeriforme" come nome dello stato, "gas" e "vapore" distinti in un riquadro con la temperatura critica, come il
  Valitutti (da verificare sul libro: la distinzione è quella dei libri del biennio che conosco, non l'ho riletta).
- Simbolo della temperatura di fusione $t_f$ e di ebollizione $t_{eb}$ (con la $t$ minuscola dei gradi Celsius, come in
  fisica); da allineare con il gruppo 23, che scrive la lezione sui passaggi di stato.
- La scala Kelvin si usa qui ($T = t + 273$) ma si spiega nella lezione 15, con un link: le due lezioni sono di seguito.
- Il plasma è in un riquadro che si può saltare.

## Dati da verificare

- Temperature di fusione e di ebollizione a $1\,\text{atm}$, arrotondate al grado (valori che ricordo, da controllare
  su una tabella, per esempio il CRC Handbook o le pagine Wikipedia delle sostanze): azoto $-210/-196$, ossigeno
  $-218/-183$, etanolo $-114/78$, mercurio $-39/357$, bromo $-7/59$, cloruro di sodio $801/1465$ (alcune fonti danno
  $1413\,^\circ\text{C}$ per l'ebollizione), ferro $1538/2862$. Negli esercizi anche metano $-182/-162$, acetone
  $-95/56$, ammoniaca $-78/-33$, iodio $114/184$, piombo $327/1749$, rame $1085/2562$.
- Densità: ghiaccio $0{,}917\,\text{g/mL}$, vapore acqueo a $100\,^\circ\text{C}$ e $1\,\text{atm}$ circa
  $0{,}60\,\text{g/L}$ (il gas ideale dà $0{,}588$; le tavole del vapore circa $0{,}598$, da verificare).
- Acqua che bolle "intorno a $85\,^\circ\text{C}$" sulla cima del Monte Bianco e "fin verso $120\,^\circ\text{C}$" nella
  pentola a pressione: ordini di grandezza, da verificare.

## Figure

Due TikZ, guardate in chiaro e in scuro: `stati-tre-recipienti` (cubo, liquido con la superficie, recipiente chiuso con
i puntini) e `stati-intervalli-sostanze` (barre degli stati di azoto, etanolo, acqua e mercurio da $-250$ a
$400\,^\circ\text{C}$, con la linea a $20\,^\circ\text{C}$). Nessuna molecola: qui la struttura non serve. Nessuna figura
interattiva: quella delle particelle con la temperatura è nella lezione 15, che segue.

## Esercizi

Generatore `chim-stati-aggregazione`, cinque livelli (specifica in `specs/exercises/chim-stati-aggregazione.md`), senza
scene.

## Domande per Andrea

- Nel biennio si distingue "gas" da "vapore" con la temperatura critica, o basta dire che il vapore è l'aeriforme di una
  sostanza che a temperatura ambiente è liquida? La lezione dà la prima definizione in un riquadro.
- "Aeriforme" o "gassoso" come nome del terzo stato? La lezione usa "aeriforme" (come molti libri) e scrive "gas" solo
  per i gas veri.
- I simboli $t_f$ e $t_{eb}$ vanno bene, o si preferisce $T_f$ e $T_{eb}$ (che però in fisica sono temperature assolute)?
- Il plasma va nominato al primo anno?
- Negli esercizi dei livelli 2 e 3 le opzioni sono solido, liquido, aeriforme e "solido e liquido insieme": il quarto
  distrattore ha senso, o è meglio un'altra forma di domanda?
