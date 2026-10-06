# Note: Frigoriferi e pompe di calore

Lezione nuova (lotto del terzo anno di fisica, gruppo 44, 6 ottobre 2026). Conti rifatti in Python con i dati come
sono scritti nella lezione:

- esempio 1: $450/150 = 3{,}00$, $450 + 150 = 600$ J;
- esempio 2: $2{,}8 \cdot 10^7 / 3{,}5 = 8{,}0 \cdot 10^6$ J, $/3600 = 2222$ W, $2{,}8 \cdot 10^7 - 8{,}0 \cdot 10^6 = 2{,}0 \cdot 10^7$ J,
  $2{,}8 \cdot 10^7 / 3600 = 7778$ W;
- esempio 3: $255/43 = 5{,}930$, $293/18 = 16{,}28$, $293/30 = 9{,}767$; avviso sui gradi Celsius: $-18/43 = -0{,}419$;
- grafico: $275/20 = 13{,}75$, $275/40 = 6{,}875$ (punti a $(2;\,1{,}375)$ e $(4;\,0{,}6875)$ con 1 cm = 10 K e 1 cm = 10);
- testo dopo l'interattiva: $1000/5{,}930 = 168{,}6$ J, $255/50 = 5{,}1$, $1000/5{,}1 = 196{,}1$ J;
- esempio 4: $4186 \cdot 0{,}50 \cdot 20 = 41\,860$ J, $3{,}34 \cdot 10^5 \cdot 0{,}50 = 167\,000$ J, somma $208\,860$ J,
  $/2{,}5 = 83\,544$ J, $/120 = 696{,}2$ s ($11{,}6$ min), $Q_c = 292\,404$ J;
- nota finale: $1 - 275/293 = 0{,}0614$, $293/18 = 16{,}3$.

`check.mts`: 0 errori, 0 avvisi sui tre file.

## Struttura ed esempi

La macchina frigorifera come macchina termica al contrario, con il bilancio $Q_c = Q_f + W$ e l'enunciato di Clausius
(link alle lezioni 114 e 115); l'avviso sullo sportello aperto; il coefficiente di prestazione del frigorifero
(esempio 1) e l'avviso sul COP maggiore di 1; il circuito vero in quattro passi, con la figura; la pompa di calore, la
relazione $\text{COP}_p = \text{COP}_f + 1$ (esempio 2, confronto con la stufa elettrica) e l'avviso sui due
coefficienti; il coefficiente massimo ricavato da $Q_f/Q_c = T_f/T_c$ (lezione 116), il grafico, l'avviso sui kelvin,
l'esempio 3 e l'interattiva; il lavoro per raffreddare (esempio 4, il ghiaccio); la tabella di confronto con la
macchina termica e la nota sul legame $\text{COP}_p = 1/\eta$.

## Scelte

- Simboli del README: $Q_c$, $Q_f$ e $W$ in valore assoluto, $T_c$ e $T_f$. Il README dice solo "$\text{COP}$": ho
  distinto $\text{COP}_f$ (frigorifero) e $\text{COP}_p$ (pompa di calore), con $\text{COP}_{f,max}$ e
  $\text{COP}_{p,max}$ per la macchina reversibile, perché la lezione li usa tutti e due e la relazione tra i due
  ($+1$) è uno dei punti. Il pedice $f$ è lo stesso di "fredda": non l'ho trovato ambiguo, ma è una domanda per
  Andrea.
- Confine con la 114 e la 115 (gruppo 43, scritte in parallelo, non le ho lette): la macchina termica, il rendimento
  e l'enunciato di Clausius sono solo richiamati con il link. Confine con la 116: uso $Q_f/Q_c = T_f/T_c$ come
  risultato della 116 e da lì ricavo i coefficienti massimi; che la macchina reversibile sia il miglior frigorifero è
  enunciato, non dimostrato.
- Confine con la 118: niente entropia qui.
- Nell'esempio 4 il tempo è scritto come "tempo $= W/P$" e non $\Delta t$, perché nello stesso esempio $\Delta t$ è
  la variazione di temperatura in $Q = c\,m\,\Delta t$ (come nella lezione 67).
- Il circuito del frigorifero (evaporatore, compressore, condensatore, valvola) è descritto in quattro righe e una
  figura: sta in tutti i libri del terzo anno e spiega da dove viene il calore sul retro. Niente diagrammi
  pressione-volume del ciclo frigorifero.

## Figure

Tre TikZ, guardate in chiaro e in scuro con `anteprima.mjs`: `macchina-termica-e-frigorifero` (i due schemi
affiancati), `circuito-frigorifero`, `cop-massimo-differenza-temperatura` (grafico con assi, griglia e `plot`).

Interattiva `frigorifero-cop-temperature` (`fisica/FrigoriferoCop.tsx`, registrata sotto il commento del gruppo 44):
risponde a "se la sorgente calda diventa più calda, o quella fredda più fredda, che cosa succede al lavoro che serve
per spostare lo stesso calore?". Macchina reversibile, due cursori per le temperature in gradi Celsius (fredda da
$-25$ a $15$, calda da $18$ a $45$), un selettore tra frigorifero ($Q_f = 1000$ J fisso) e pompa di calore
($Q_c = 1000$ J fisso); le tre frecce sono larghe quanto le energie (1 cm ogni 1000 J). Valori iniziali: l'esempio 3.
Guardata in chiaro, in scuro, da telefono e agli estremi dei cursori.

I pezzi comuni delle mie figure (sorgente, macchina, freccia larga quanto l'energia) sono in un file mio,
`fisica/sorgenti.tsx`. Il gruppo 43 ha scritto in parallelo `fisica/flussiCalore.tsx` con pezzi simili: sono due
doppioni da unire.

## Esempio per l'esercizio guidato

L'esempio 4 (fare il ghiaccio). Si fermerebbe in tre punti: (1) "quali due calori devi togliere all'acqua?" prima
di $Q_1$ e $Q_2$; (2) "quale formula lega $Q_f$ al lavoro?" prima di $W = Q_f/\text{COP}_f$; (3) "alla cucina arriva
più o meno calore di $Q_f$?" prima di $Q_c$.

## Esercizi

Generatore `fis-frigoriferi`, sei livelli (specifica in `specs/exercises/fis-frigoriferi.md`): Il coefficiente di un
frigorifero, Dal calore ceduto, La pompa di calore, Il coefficiente massimo, Il lavoro per raffreddare, Fare il
ghiaccio. Scena `macchina-termica` del gruppo 43 ai livelli 1, 2, 4 e a metà del 3.

## Da verificare

- $c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$ e $L_f = 3{,}34 \cdot 10^5\,\text{J/kg}$: i valori delle lezioni 67 e 70.
- "I frigoriferi e le pompe di calore reali hanno coefficienti più bassi di questi massimi": vero in generale; non ho
  scritto valori tipici (un frigorifero domestico tra 2 e 4, una pompa di calore tra 3 e 5 sono i numeri che ricordo,
  usati solo come ordine di grandezza negli esempi 2 e 4).
- La descrizione del circuito (il refrigerante evapora a bassa pressione nell'evaporatore, il compressore lo scalda
  sopra la temperatura ambiente, la valvola di espansione abbassa la pressione): scritta a memoria.
- Nome inglese della sigla, *coefficient of performance*.

## Domande per Andrea

- $\text{COP}_f$ e $\text{COP}_p$ vanno bene, o l'Amaldi usa un solo $\text{COP}$ per il frigorifero e un altro nome
  (per esempio $K$ o "coefficiente di guadagno") per la pompa di calore?
- Il coefficiente massimo è ricavato da $Q_f/Q_c = T_f/T_c$: la 116 lo scrive in questa forma?
- Il circuito con evaporatore e condensatore: al livello giusto, o troppo tecnico per il terzo anno?
- La tabella finale di confronto con la macchina termica ripete il rendimento della 114: tenerla?

Prerequisiti proposti: fis-macchine-termiche, fis-ciclo-carnot, fis-enunciati-kelvin-clausius, fis-passaggi-stato
