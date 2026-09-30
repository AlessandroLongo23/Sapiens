# Note: Le proprietà fisiche dell'acqua

Lezione nuova (biennio di chimica, gruppo 29, 30 settembre 2026). Conti rifatti in Python: esempio 1,
$750/0{,}917 = 817{,}9\,\text{mL}$, aumento $67{,}9\,\text{mL}$, $9{,}05\%$; frazione immersa $0{,}917/1{,}03 = 0{,}890$;
aumento di volume nel congelamento $0{,}99984/0{,}9167 = 1{,}091$ (il "circa il $9\%$"); esempio 2,
$20\,900/(4{,}186 \cdot 500) = 9{,}99\,^\circ\text{C}$, $20\,900/(0{,}449 \cdot 500) = 93{,}1\,^\circ\text{C}$, rapporto
$9{,}32$; evaporazione $2260/418{,}6 = 5{,}4$ ("più di cinque volte"); capillarità con la legge di Jurin
$h = 2\gamma/(d\,g\,r)$, $\gamma = 0{,}0728\,\text{N/m}$, $d = 998\,\text{kg/m}^3$: $r = 0{,}5\,\text{mm}$ dà
$2{,}98\,\text{cm}$, $r = 0{,}1\,\text{mm}$ dà $14{,}9\,\text{cm}$. `check.mts` passa.

## Struttura

Le temperature dei passaggi di stato (breve, link alle lezioni di chimica 12 e 19); la densità e il ghiaccio che
galleggia, con la spiegazione della rete aperta, l'esempio della bottiglia e l'iceberg; il massimo a $4\,^\circ\text{C}$
con il grafico, la spiegazione con i gruppi di molecole legate e il lago d'inverno; il calore specifico con l'esempio
acqua-ferro e le conseguenze, il calore di evaporazione in un riquadro; la tensione superficiale con la figura, la
graffetta e il sapone; la capillarità con la figura dei tubi e del mercurio; una tabella finale proprietà-osservazione-
causa.

## Scelte

- La fisica (lezione 66) tratta la dilatazione e il comportamento anomalo con il grafico del volume: qui il grafico è
  della densità, e l'accento è sulla spiegazione con i legami a idrogeno. Link alle lezioni 66 e 67 di fisica e alla
  spinta di Archimede.
- Calore specifico in $\text{J/(g}\cdot{}^\circ\text{C)}$, come la lezione 12 di chimica ($4{,}186$), con la stessa
  tabella (etanolo $2{,}44$, ferro $0{,}449$).
- Densità dell'acqua tra $0$ e $20\,^\circ\text{C}$ (grafico): $0{,}99984$, $0{,}99994$, $0{,}99997$, $0{,}99994$,
  $0{,}99985$, $0{,}99970$, $0{,}99950$, $0{,}99924$, $0{,}99894$, $0{,}99860$, $0{,}99821\,\text{g/mL}$ ogni due gradi.
  I valori a $0$, $4$, $10\,^\circ\text{C}$ sono quelli che la lezione 66 di fisica cita da Wikipedia, "Water (data
  page)", letta il 30 settembre 2026; gli altri sono da verificare sulla stessa pagina.
- Acqua di mare $1{,}03\,\text{g/mL}$ come la lezione 11 di chimica ("circa").
- Tensione superficiale "più di tre volte quella dell'alcol" ($72{,}8$ contro $22{,}4\,\text{mN/m}$ a $20\,^\circ\text{C}$,
  da verificare): nessun valore numerico nella lezione, perché la grandezza non è definita al biennio.
- La capillarità è spiegata con adesione e coesione; la legge di Jurin non è scritta, solo la proporzionalità inversa
  con il raggio e due valori.
- Calore di evaporazione $2260\,\text{J/g}$ a $100\,^\circ\text{C}$, lo stesso $L_v = 2{,}26 \cdot 10^6\,\text{J/kg}$ della
  lezione 70 di fisica.

## Figure

TikZ, guardate in chiaro e in scuro: `acqua-densita-temperatura` (grafico con l'asse che non parte da zero e il massimo
segnato; riga `% poi-interattivo`), `acqua-lago-inverno` (strati da $1$ a $4\,^\circ\text{C}$ sotto il ghiaccio; nel tema
scuro gli strati si distinguono poco, ma le temperature sono scritte), `acqua-tensione-superficiale` (le attrazioni su
una molecola interna e su una della superficie), `acqua-capillarita-tubi` (tre tubi con altezze inversamente
proporzionali al raggio, menischi concavi; il mercurio sotto il livello con il menisco convesso; il mercurio è disegnato
a pezzi, senza riempimenti bianchi). Niente molecole di RDKit e niente interattive: la molecola è nella lezione 44.

## Esercizi

Generatore `chim-acqua-proprieta`, cinque livelli (specifica in `specs/exercises/chim-acqua-proprieta.md`): la proprietà
che spiega un fenomeno, il volume del ghiaccio, la parte immersa o emersa, il calore per scaldare l'acqua, lo stesso
calore a masse uguali. Niente scene.

## Domande per Andrea

- Il massimo di densità a $4\,^\circ\text{C}$ si spiega al biennio con i "gruppi di molecole legate come nel ghiaccio" che
  si rompono, o basta il fatto?
- Tensione superficiale e capillarità: bastano adesione e coesione, senza la legge di Jurin?
- Il calore di evaporazione (sudore) è in un riquadro che si può saltare: tenerlo o toglierlo?
- Calore specifico in $\text{J/(g}\cdot{}^\circ\text{C)}$ come la lezione 12 di chimica, o in $\text{J/(kg}\cdot{}^\circ\text{C)}$
  come la fisica? Oggi le due materie usano unità diverse per la stessa grandezza.
