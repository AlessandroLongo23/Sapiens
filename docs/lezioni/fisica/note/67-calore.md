# Note: Calore, capacità termica e calore specifico

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 19, 30 settembre 2026), sullo slug `calore` che esisteva già
vuoto. Conti rifatti in Python: esempio 1 $4186 \cdot 2{,}0 \cdot 80 = 669\,760$ J, $669\,760 / 2000 = 335$ s (poco meno di
sei minuti); esempio 2 $897 \cdot 0{,}50 = 448{,}5$, $(448{,}5 + 4186) \cdot 80 = 370\,760$ J, $448{,}5/4634{,}5 = 9{,}7\%$;
esempio 3 $12\,000/(4186 \cdot 0{,}150) = 19{,}11$; esempio 4 $7200/(0{,}40 \cdot 40) = 450$; esempio 5 $4186 \cdot 0{,}25 \cdot
(-50) = -52\,325$ J; esempio 6 $100\,000 \cdot 4{,}186 = 418\,600$ J, $418\,600/(4186 \cdot 50) = 2{,}0$ kg; acqua e olio
$4186/1970 = 2{,}125$; nella figura interattiva $200 \cdot 360 = 72$ kJ, $72\,000/(4186 \cdot 0{,}5) = 34{,}4$ e
$72\,000/(1970 \cdot 0{,}5) = 73{,}1\,^\circ\text{C}$ di aumento. `check.mts` passa senza avvisi.

## Fonti dei dati

- Calori specifici: Wikipedia (inglese), "Table of specific heat capacities", letta il 30 settembre 2026 (acqua $4{,}181$
  a $25\,^\circ\text{C}$, alluminio $0{,}897$, rame $0{,}385$, ferro $0{,}449$, piombo e oro $0{,}129$, vetro $0{,}840$, granito
  $0{,}790$, etanolo $2{,}440$, ghiaccio $2{,}050$ a $-10\,^\circ\text{C}$, in J/(g$\cdot$K)).
- Olio d'oliva $1{,}97$ kJ/(kg$\cdot$K): The Engineering ToolBox, "Specific Heat of Common Liquids and Fluids", letta il 30
  settembre 2026.
- Acqua $4186$ e $1\,\text{cal} = 4{,}186\,\text{J}$: la caloria a $15\,^\circ\text{C}$, come nella richiesta. La lezione lo dice.
- Joule: Wikipedia (inglese), "Mechanical equivalent of heat", letta il 30 settembre 2026: misure negli anni Quaranta
  dell'Ottocento, articolo "The Mechanical Equivalent of Heat" del 1845, valore $778{,}24$ ft$\cdot$lbf per libbra e grado
  Fahrenheit, cioè $4{,}1550$ J/cal (nella lezione "circa $4{,}16\,\text{J}$").

## Scelte

- $Q$, $c$, $C$ come il README; $\Delta t = t_f - t_i$ con il segno, $Q$ negativo quando il corpo cede, e "quanto calore
  cede" con la risposta senza segno.
- Capacità termica prima del calore specifico, come la richiesta; $C = c\,m$ e le capacità che si sommano (pentola e acqua)
  preparano il calorimetro della lezione 68, che qui ha solo un link.
- L'esperimento di Joule è descrittivo, con una figura schematica; il lavoro e le forze dissipative con i link alle lezioni
  del gruppo 17 e 18.
- Nella figura interattiva la temperatura è $T$ e il tempo $t$, come chiede il README quando il tempo è nella stessa
  formula; lo dice il commento del file.
- Il paragrafo sulle calorie degli alimenti e l'esempio dello yogurt: non erano nella richiesta, ma la caloria è lì che
  gli studenti la incontrano.

## Figure

Una TikZ, guardata in chiaro e in scuro: `esperimento-joule-mulinello` (schema: recipiente con l'acqua, asse, due pale,
rocchetto, due fili su due carrucole, due pesi con le frecce della velocità, termometro).

Interattiva `riscaldamento-acqua-olio` (`fisica/RiscaldamentoAcquaOlio.tsx`): due pentolini uguali su due fornelli,
$0{,}50$ kg d'acqua e $0{,}50$ kg d'olio (il livello dell'olio più alto di $1000/920$), $200$ W a ciascuno, tutto al liquido;
bottone "Accendi i fornelli" (30 secondi dell'esperimento per secondo), cursore del tempo da $0$ a $360$ s, termometri
nei pentolini e grafico temperatura-tempo disegnato nella figura (assi con le tacche, non il piano cartesiano del kit). Dopo
6 minuti l'acqua è a $54{,}4$ e l'olio a $93{,}1\,^\circ\text{C}$. Guardata in chiaro, in scuro, al telefono, durante e dopo
l'animazione.

## Esercizi

Generatore `calore`, sei livelli (specifica in `specs/exercises/calore.md`): scaldare l'acqua, altre sostanze anche che si
raffreddano, la temperatura finale, il calore specifico da una misura, la pentola e l'acqua, le calorie. Nessuna scena.

## Domande per Andrea

- $4186$, $4190$ o $4180\,\text{J/(kg}\cdot{}^\circ\text{C)}$ per l'acqua negli esercizi? Qui $4186$.
- Il segno di $Q$: l'Amaldi scrive $Q$ negativo per il calore ceduto, o usa sempre valori positivi con "ceduto" e
  "assorbito"?
- L'unità del calore specifico: $\text{J/(kg}\cdot{}^\circ\text{C)}$ o $\text{J/(kg}\cdot\text{K)}$? Qui la prima, perché le
  temperature degli esercizi sono in Celsius.
- L'esperimento di Joule: basta la descrizione, o il libro fa il conto (i pesi che scendono di $h$, $m g h$ uguale a
  $c\,m\,\Delta t$)?
- Il paragrafo sulle chilocalorie degli alimenti: resta?
