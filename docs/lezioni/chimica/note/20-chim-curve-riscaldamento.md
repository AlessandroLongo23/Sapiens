# Note: Curve di riscaldamento e di raffreddamento

Lezione nuova (biennio di chimica, gruppo 23, 30 settembre 2026). Conti rifatti in Python: esempio 1,
$6{,}0 \cdot 500/200 = 15\,\text{min}$, $6{,}0 \cdot 2260/334 = 40{,}599\,\text{min} \approx 41\,\text{min}$, rapporto
$L_v/L_f = 6{,}77$ ("quasi sette volte"); calori specifici del ghiaccio e del vapore circa la metà di quello dell'acqua
($2100$, $2000$ e $4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$, i valori della fisica 70). `check.mts` passa.

## Struttura

Come si ottiene una curva (provetta a bagnomaria, figura); la curva dell'acqua in cinque tratti con gli stati presenti,
le soste termiche e il calore latente (con il link alla fisica 70 per $Q = L\,m$); l'avviso sulla fiamma; la pendenza dei
tratti; la durata di una sosta, proporzionale alla massa e al calore latente, con l'esempio 1; sostanze pure e miscugli
(sosta contro intervallo, l'acqua salata che bolle sempre più in alto, la purezza di un solido) con la figura di
confronto, l'esempio 2 (il naftalene), l'esempio 3 (la paraffina), la figura interattiva e il riquadro su azeotropi ed
eutettici; la curva di raffreddamento con la sopraffusione, gli scaldamani e l'avviso sul punto più basso.

## Scelte

- La curva è temperatura-tempo, come nei libri di chimica (e nella "curva di riscaldamento" dell'Amaldi); la fisica 70
  usa temperatura-calore. Con una fiamma costante sono la stessa curva: lo si dice implicitamente con "una fiamma che cede
  sempre la stessa energia ogni minuto".
- La figura della curva dell'acqua non è in scala (lo dice l'alt e lo dice l'esempio 1: in scala la sosta dell'ebollizione
  occuperebbe quasi tutto il grafico); quella in scala è nella fisica 70.
- La durata della sosta proporzionale a $L$ e $m$ è il ponte con la fisica senza rifare i conti di $Q = c\,m\,\Delta t$.
- La sopraffusione è trattata perché il programma (`programma.md`) nomina le curve di raffreddamento e i libri la mostrano
  di solito nella curva del tiosolfato o dell'acido stearico (da verificare sul Valitutti).
- Azeotropi ed eutettici in un riquadro, come eccezioni, con un esempio ciascuno.

## Dati

Naftalene $80$ e $218\,^\circ\text{C}$ (come la lezione 19); paraffina "intorno a $50$" e "intorno a $60\,^\circ\text{C}$", e
nella figura interattiva $52$-$58\,^\circ\text{C}$: le paraffine commerciali fondono tra circa $45$ e $65\,^\circ\text{C}$
secondo il tipo (da verificare); naftalene impuro della figura, $74$-$78\,^\circ\text{C}$, inventato per mostrare
l'abbassamento e l'intervallo. Azeotropo etanolo-acqua "al $96\%$" (circa $95{,}6\%$ in massa, da verificare). Calori
latenti dell'acqua $334$ e $2260\,\text{kJ/kg}$ come la fisica 70; dell'etanolo, solo negli esercizi, $108$ e
$855\,\text{kJ/kg}$ (la tabella della fisica 70). Gli scaldamani "con il dischetto di metallo" contengono acetato di sodio
in sopraffusione (la lezione non nomina la sostanza).

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `curve-bagnomaria-provetta`, `curve-riscaldamento-acqua-schema` (cinque
tratti con S, S + L, L, L + V, V), `curve-pura-miscuglio-confronto` (due grafici affiancati, sosta e intervallo) e
`curve-raffreddamento-sopraffusione`.

Interattiva `fusione-sostanza-pura-miscuglio` (`chimica/FusionePuraMiscuglio.tsx`): la provetta a bagnomaria accanto al
grafico temperatura-tempo, da $40$ a $95\,^\circ\text{C}$ in $15$ minuti; si sceglie naftalene puro, naftalene impuro o
paraffina, e con il cursore o con Avvia il solido nella provetta diventa liquido e il grafico si traccia. Curve a tratti
scritte a mano. Guardata in chiaro, in scuro, sul telefono, all'inizio e durante la fusione. Non ho riusato la figura
della fisica `curva-riscaldamento-acqua`: la lezione la cita con il link alla fisica 70.

## Esercizi

Generatore `chim-curve-riscaldamento`, sei livelli (specifica in `specs/exercises/chim-curve-riscaldamento.md`), scena
nuova `curva-temperatura-tempo` (`exercises/scenes/CurvaTemperaturaTempo.tsx`): la scena `curva-riscaldamento` della
fisica ha il calore sull'asse orizzontale, qui serve il tempo.

## Domande per Andrea

- Negli esercizi e nei laboratori del primo anno quale sostanza si usa per la curva di fusione e di solidificazione:
  naftalene, acido stearico, tiosolfato di sodio? L'esempio e la figura interattiva usano il naftalene.
- La sopraffusione è nel programma del primo anno, o va in un riquadro che si può saltare?
- La durata della sosta proporzionale al calore latente (esempio 1 e livello 6 degli esercizi) è adatta alla chimica
  del primo anno, o è fisica e va tolta?
- Azeotropi ed eutettici: da nominare, o solo "alcuni miscugli si comportano come sostanze pure"?
- I valori della paraffina ($50$-$60\,^\circ\text{C}$) sono quelli che i ragazzi trovano in laboratorio con le candele?
