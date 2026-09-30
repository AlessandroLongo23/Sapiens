# Note: La molecola d'acqua e il legame a idrogeno

Lezione nuova (biennio di chimica, gruppo 29, 30 settembre 2026), prima del capitolo "La chimica dell'acqua". Conti
rifatti in Python: massa molare $2 \cdot 1{,}01 + 16{,}00 = 18{,}02$; ossigeno $16{,}00/18{,}02 = 88{,}79\%$, idrogeno
$11{,}21\%$; rapporto $16{,}00/2{,}02 = 7{,}92$ ("quasi otto volte"); esempio 1, $1000 \cdot 2{,}02/18{,}02 = 112{,}1\,\text{g}$
e $887{,}9\,\text{g}$; masse molari della tabella $\mathrm{H_2S}$ $34{,}09$, $\mathrm{H_2Se}$ $80{,}99$ (con Se $78{,}97$, che
non è nella tavola della lezione 01), $\mathrm{H_2Te}$ $129{,}62$ (Te $127{,}60$); prolungamento della tendenza
$-60 - 19 = -79\,^\circ\text{C}$. `check.mts` passa.

## Struttura

La formula e la composizione (con il legame covalente solo nominato e il link alla lezione del terzo anno), l'esempio
sull'idrogeno in un litro d'acqua; la forma piegata con il modello 3D di RDKit e le coppie solitarie (VSEPR in un cenno,
link alla lezione 02); la polarità con l'elettronegatività solo intuitiva (link al terzo anno), le cariche parziali, il
confronto con $\mathrm{CO_2}$, la prova del filo d'acqua e due avvisi; il legame a idrogeno con la figura delle cinque
molecole, la forza e la distanza, i quattro legami per molecola e la figura interattiva; la regola generale (O, N, F) con
il link al terzo anno; la temperatura di ebollizione con la tabella e il grafico dei due gruppi, l'esempio su che cosa si
rompe quando l'acqua bolle.

## Scelte

- Unità con `\text` dopo uno spazio sottile, come la fisica e la sezione "Il biennio" del README ($18{,}02\,\text{g/mol}$);
  la lezione 01 usa `\ \mathrm{g}`. Formule chimiche in `\mathrm`.
- L'elettronegatività è nominata e spiegata in una frase ("la capacità di un atomo di attirare gli elettroni di un
  legame"), senza numeri: i valori di Pauling sono del terzo anno.
- La VSEPR è in un paragrafo, per spiegare perché la molecola è piegata; il perché dell'angolo preciso è lasciato alla
  lezione 02.
- Dati: angolo $104{,}5^\circ$ e legame $\mathrm{O{-}H}$ di $0{,}096\,\text{nm}$ (valori del vapore, da verificare sul
  libro); distanza $\mathrm{H \cdots O}$ di circa $0{,}18\,\text{nm}$ e rapporto "circa venti volte" tra l'energia del
  legame covalente $\mathrm{O{-}H}$ (circa $460\,\text{kJ/mol}$) e quella di un legame a idrogeno (circa
  $20\,\text{kJ/mol}$): valori da manuale, da verificare. Nella lezione niente kJ/mol: solo il rapporto.
- Temperature di ebollizione: $\mathrm{H_2O}$ $100$, $\mathrm{H_2S}$ $-60$, $\mathrm{H_2Se}$ $-41$, $\mathrm{H_2Te}$ $-2$,
  $\mathrm{CH_4}$ $-162$, $\mathrm{SiH_4}$ $-112$, $\mathrm{GeH_4}$ $-88$, $\mathrm{SnH_4}$ $-52\,^\circ\text{C}$: da
  verificare (valori da manuale, non riletti su una fonte il 30 settembre 2026). La stima "intorno a $-80\,^\circ\text{C}$"
  è il prolungamento lineare del grafico; la lezione dice che i libri danno stime diverse.
- "Milioni di milioni di volte al secondo" per i legami che si rompono e si riformano: la vita di un legame a idrogeno
  nell'acqua liquida è dell'ordine del picosecondo (da verificare).
- I legami a idrogeno del DNA sono solo nominati.

## Figure

TikZ, guardate in chiaro e in scuro: `acqua-molecola-cariche-parziali` (acqua con coppie solitarie, $\delta^-$ e
$\delta^+$, angolo; sotto $\mathrm{CO_2}$ lineare), `acqua-legami-idrogeno-cinque-molecole` (molecola centrale con due
legami donati e due ricevuti, geometria calcolata: O···O $1{,}57$ in scala con O-H $0{,}54$), `acqua-ebollizione-idruri`
(due serie, gruppo 16 in blu e gruppo 14 in grigio, con il prolungamento tratteggiato; nel tema scuro il blu diventa
lilla, leggibile). RDKit: `acqua-molecola-3d` (` ```molecola3d `, angolo calcolato $104{,}0^\circ$ con MMFF94, detto nel
testo), anteprima guardata.

Interattiva `acqua-legami-idrogeno-temperatura` (`chimica/LegamiIdrogenoTemperatura.tsx`, con i pezzi comuni in
`chimica/acqua.tsx`): 24 molecole, cursore da $-20$ a $120\,^\circ\text{C}$. Sotto zero una rete a nido d'ape (il ghiaccio
visto lungo gli anelli esagonali): le molecole di un sottoreticolo danno due idrogeni, quelle dell'altro uno, e l'altro
idrogeno è disegnato corto e chiaro sopra l'ossigeno, verso chi guarda (il quarto legame va nello strato vicino). Nel
liquido un passo di Langevin scritto a mano, con molle sui legami a idrogeno che si formano (entro $0{,}7\,\text{cm}$) e si
rompono con una frequenza che cresce con la temperatura; a $20\,^\circ\text{C}$ circa 36 legami, a $90\,^\circ\text{C}$ circa
18. Sopra $100\,^\circ\text{C}$ nessun legame e molecole veloci. Il numero di legami è letto sotto la figura; i tempi sono
rallentati, e la didascalia lo dice. Guardata in chiaro, in scuro, sul telefono, a $-10$, $20$, $90$ e
$115\,^\circ\text{C}$: nessun errore in console, niente scorrimento laterale. Con il movimento ridotto la simulazione è
ferma e il cursore porta allo stato della temperatura scelta.

## Esercizi

Generatore `chim-acqua-molecola`, cinque livelli (specifica in `specs/exercises/chim-acqua-molecola.md`): composizione,
massa d'acqua dall'elemento, forma e polarità, chi forma legami a idrogeno, che cosa si rompe. Niente scene.

## Domande per Andrea

- Il legame covalente e l'elettronegatività sono del terzo anno: al secondo anno va bene nominarli in una frase, come fa
  la lezione, o si preferisce parlare solo di "cariche parziali" senza dire da dove vengono?
- La VSEPR (coppie solitarie che spingono i legami) si può accennare al secondo anno per spiegare la forma piegata, o
  basta dire che la molecola è piegata?
- Nei libri del biennio l'angolo è $104{,}5^\circ$ o $105^\circ$?
- Il grafico delle temperature di ebollizione con i due gruppi (16 e 14) è nel programma del biennio o è troppo? Si può
  tenere solo la tabella.
- Il ghiaccio della figura interattiva è disegnato piatto, a nido d'ape, con un idrogeno per molecola "verso chi guarda":
  è una rappresentazione accettabile, o si preferisce il modello a quattro vicini in un reticolo quadrato, meno fedele ma
  tutto nel piano?
