# Note: Forze dipolo-dipolo e forze di London

Lezione nuova (6 ottobre 2026), gruppo H del lotto del terzo anno. Prima lezione del capitolo "Forze intermolecolari e
stati condensati". `check.mts` passa su lezione, formulario e flashcard; resta l'avviso "titolo con maiuscole
all'inglese" su "Le forze di London", dove London è un cognome.

## Scelte

- Confini dentro il gruppo: qui le tre forze senza l'idrogeno (dipolo-dipolo, London, ione-dipolo) e il loro effetto
  sulla temperatura di ebollizione. Il legame a idrogeno è solo nominato, con il link alla 73. Viscosità, tensione
  superficiale e tensione di vapore sono nella 74; i solidi molecolari nella 75.
- Si parte da cloro, bromo e iodio (gas, liquido, solido) e ci si torna dopo la tabella degli alogeni.
- La polarizzabilità è legata al numero di elettroni, contato con i numeri atomici, e non alla massa molare: è la
  causa vera, e il conto è un esercizio che lo studente sa fare. Un riquadro dice che la massa è un indizio.
- Il confronto tra forza dipolo-dipolo e forza di London si fa con due esempi che vanno in versi opposti:
  $\mathrm{F_2}$ e $\mathrm{HCl}$ (stessi 18 elettroni, vince la polarità) e la serie $\mathrm{HCl}$, $\mathrm{HBr}$,
  $\mathrm{HI}$ (la polarità cala, gli elettroni crescono, la temperatura di ebollizione sale).
- La forma della molecola è spiegata con pentano e 2,2-dimetilpropano, disegnati come sagome (ovali e cerchi), non con
  le formule di struttura: gli alcani ramificati sono del quinto anno.
- La forza ione-dipolo ha un solo disegno piccolo (uno ione e una molecola d'acqua): il disegno completo degli ioni
  idratati è già nella lezione 46, a cui si rimanda.
- Il momento dipolare $\mu$ è usato come grandezza, senza valori in debye: la lezione 69 è di un altro gruppo e non
  sapevo se introduce l'unità. Nella tabella degli idracidi c'è $\Delta\chi$, calcolato da `elementi.json`.
- Dati: masse molari ed elettronegatività da `src/lib/tools/elementi.json`; elettroni dai numeri atomici. Con quelle
  masse $\mathrm{CH_4}$ vale $16{,}05$ (la lezione 01 ha $\mathrm{H} = 1{,}01$).
- Le temperature di ebollizione sono arrotondate al grado. Il butano ($-0{,}5\,^\circ\text{C}$) compare solo nella figura
  interattiva.

## Dubbi per Andrea

- "Forze di van der Waals": la lezione le definisce come dipolo-dipolo più London, come il Valitutti. Altri libri
  chiamano così le sole forze di London, altri tutte le forze intermolecolari. Quale uso vogliamo?
- "Forze di London" o "forze di dispersione"? La lezione usa la prima e nomina la seconda una volta.
- Le forze dipolo-dipolo indotto (ossigeno sciolto in acqua) non ci sono. Vanno aggiunte, magari in un riquadro?
- La regola 4 del procedimento ("elettroni molto diversi: bolle di solito più in alto quella che ne ha di più") è
  detta con "di solito" e con l'esempio 4, dove la regola non decide e serve il dato. Va bene così, o è meglio
  togliere dagli esercizi ogni confronto tra una polare piccola e una apolare grande?
- La forza ione-dipolo è più forte quando lo ione è più piccolo e più carico: l'ho detta con $\mathrm{Mg^{2+}}$ e
  $\mathrm{Na^+}$. È troppo per questa lezione?

## Da verificare

- Fritz London, 1930: nome e data scritti a memoria.
- $\mathrm{HCl}$: entalpia di vaporizzazione circa $16\,\text{kJ/mol}$, energia del legame $431\,\text{kJ/mol}$.
- Temperature di ebollizione (°C), scritte a memoria e non controllate su una tabella: He $-269$, Ne $-246$, Ar
  $-186$, Kr $-153$, Xe $-108$; $\mathrm{F_2}$ $-188$, $\mathrm{Cl_2}$ $-34$, $\mathrm{Br_2}$ $59$, $\mathrm{I_2}$
  $184$ (fusione $114$); metano $-162$, etano $-89$, propano $-42$, butano $-0{,}5$, pentano $36$,
  2,2-dimetilpropano $9{,}5$; $\mathrm{HCl}$ $-85$, $\mathrm{HBr}$ $-67$, $\mathrm{HI}$ $-35$; $\mathrm{ICl}$ $97$;
  $\mathrm{CCl_4}$ $77$, $\mathrm{CHCl_3}$ $61$, $\mathrm{CH_3Cl}$ $-24$. Per gli elementi `elementi.json` ha i punti
  di ebollizione in kelvin, e coincidono entro un grado.
- Nella figura interattiva ci sono anche le temperature di fusione, usate solo per dire lo stato a $25\,^\circ\text{C}$.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `forze-dipolo-dipolo-cloruro-idrogeno`,
`forze-london-dipolo-istantaneo-indotto`, `forze-london-ebollizione-elettroni`, `forze-london-forma-contatto`,
`forze-ione-dipolo-sodio-cloruro`.

Una interattiva: `forze-ebollizione-scegli-molecola` (`ForzeEbollizioneMolecola.tsx`). Si sceglie una famiglia (gas
nobili, alogeni, alcani, i tre composti HCl, HBr, HI) e una sostanza: due nubi elettroniche grandi in proporzione agli
elettroni, la scala delle temperature di ebollizione della famiglia con la sostanza in evidenza e la linea dei
$25\,^\circ\text{C}$, e sotto elettroni, massa molare, temperatura di ebollizione e stato a temperatura ambiente.
Niente blocchi `grafico`.

## Esercizi

Generatore `chim-forze-dipolo-london` (specifica in `specs/exercises/chim-forze-dipolo-london.md`, controllo in
`scripts/exercises/checkers/chim_forze_dipolo_london.py`, moduli comuni `chim3-h.ts` e `_chim3_h.py`), sei livelli: quali forze agiscono (polarità data); gli elettroni di una molecola (anche a risposta aperta); London in una famiglia; stessi elettroni e polarità diversa; la forza ione-dipolo; forma, polarizzabilità e casi in cui vince London (venti domande fisse).
PASS su 1000 esercizi per livello con i seed 1, 50001 e 777001; errori piantati bocciati 1140 su 1140, più 121 vincoli violati su 121; `review.mts` e
`width.mts` escono con 0. Non è collegato al sito.

## Esercizio guidato

L'esempio 3 (bromo e cloruro di iodio). Si fermerebbe in tre punti: contare gli elettroni delle due molecole;
decidere quale delle due è polare con $\Delta\chi$; concludere quale bolle più in alto.

Prerequisiti proposti: chim-polarita-molecole, chim-affinita-elettronegativita, chim-passaggi-stato
