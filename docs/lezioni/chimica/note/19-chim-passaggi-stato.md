# Note: I passaggi di stato

Lezione nuova (biennio di chimica, gruppo 23, 30 settembre 2026). Non ci sono conti: i numeri della lezione sono le
temperature della tabella, controllate negli esempi a mano ($25\,^\circ\text{C}$ tra $-39$ e $357$ per il mercurio, sopra
$-183$ per l'ossigeno, sotto $80$ per il naftalene; l'etanolo da $-150$ a $90\,^\circ\text{C}$ passa per $-114$ e $78$).
Nella figura delle zone le barre sono a $(t + 250)/100$ centimetri. `check.mts` passa.

## Struttura

Il passaggio di stato come trasformazione fisica (la sostanza resta $\mathrm{H_2O}$); i sei passaggi con lo schema delle
particelle; l'avviso fondere e sciogliere; l'energia spiegata con il modello particellare, la tabella assorbono e cedono,
i nomi endotermico ed esotermico, esempi di tutti i giorni e l'avviso sulla solidificazione; temperature di fusione e di
ebollizione come proprietà caratteristiche, con la tabella di nove sostanze; lo stato a una temperatura con la figura
delle zone e due esempi; evaporazione ed ebollizione con la figura, la pressione (montagna e pentola a pressione);
condensazione, sublimazione (ghiaccio secco, naftalina, iodio) e brinamento; un riquadro su gas e vapore.

## Scelte

- La lezione di fisica 70 ha già passaggi di stato, calore latente e curva dell'acqua. Qui c'è lo sguardo del chimico:
  la sostanza che resta la stessa, il modello particellare, le temperature come proprietà caratteristiche per riconoscere
  le sostanze, lo stato a una temperatura. Il calore latente è solo nominato, con il link alla fisica; la curva nel tempo
  è nella lezione 20.
- Nomi dei passaggi come la lezione di fisica 70 (brinamento per aeriforme-solido, detto anche condensazione o
  sublimazione inversa), per non avere due nomi diversi sul sito.
- Simboli $t_f$ e $t_e$ per le temperature di fusione e di ebollizione in gradi Celsius, con la $t$ minuscola come la
  fisica del secondo anno (README di fisica, termologia). Da confermare con il gruppo 22 e con Andrea.
- Endotermico ed esotermico sono nominati una volta: torneranno con le reazioni.
- "Gas o vapore" è in un riquadro che si può saltare, con la temperatura critica solo nominata.

## Dati

Temperature a $1\,\text{atm}$, arrotondate al grado: azoto $-210$ e $-196$, ossigeno $-218$ e $-183$, etanolo $-114$ e
$78$, acetone $-95$ e $56$, mercurio $-39$ e $357$, naftalene $80$ e $218$, cloruro di sodio $801$ e $1465$, ferro
$1538$ e $2862\,^\circ\text{C}$; ghiaccio secco che sublima a $-78\,^\circ\text{C}$; saccarosio che fonde (e si decompone)
intorno a $186\,^\circ\text{C}$. Sono valori noti dei manuali, non ricontrollati su una fonte in questa sessione: da
verificare. Monte Bianco "intorno a $85\,^\circ\text{C}$" e pentola a pressione "intorno a $120\,^\circ\text{C}$" come nella
lezione di fisica 70 (da verificare anche lì). L'irrigazione antibrina degli agrumeti è una pratica reale (la
solidificazione dell'acqua cede calore), da verificare se si vuole citare una fonte.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `passaggi-stato-particelle` (tre riquadri con le particelle e sei frecce,
arancioni quelle che assorbono calore, blu quelle che lo cedono, come lo schema della fisica 70),
`passaggi-stato-zone-temperatura` (quattro barre solido, liquido, aeriforme per ossigeno, etanolo, acqua e mercurio, con
la linea di $25\,^\circ\text{C}$) e `passaggi-stato-evaporazione-ebollizione` (due becker). Nessuna figura interattiva: il
modello particellare in movimento è della lezione 15 (gruppo 22), la curva nel tempo della lezione 20.

## Esercizi

Generatore `chim-passaggi-stato`, cinque livelli (specifica in `specs/exercises/chim-passaggi-stato.md`), senza scene.

## Domande per Andrea

- Brinamento o condensazione (o sublimazione inversa) per il passaggio da aeriforme a solido? Il sito oggi usa
  brinamento sia in fisica sia in chimica.
- I simboli $t_f$ e $t_e$ vanno bene, o nei libri di chimica del biennio si usano $T_f$ e $T_{eb}$?
- Endotermico ed esotermico al primo anno, già per i passaggi di stato, o solo con le reazioni?
- Il riquadro "Gas o vapore" con la temperatura critica: da tenere, o è troppo per il primo anno?
- La tabella delle temperature ha nove sostanze: sono quelle giuste per il biennio, o conviene metterne di più comuni
  nei libri (per esempio lo zolfo, il piombo, l'alcol metilico)?
