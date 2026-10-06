# Note: Il legame ionico

Lezione nuova (6 ottobre 2026), gruppo F del terzo anno: capitolo "I legami chimici", quarta lezione su sei. Non
pubblicata. `check.mts` passa senza avvisi su lezione, formulario e flashcard.

## Struttura e confini

Il trasferimento dell'elettrone tra sodio e cloro con configurazioni e simboli di Lewis; quali elementi si legano così
(metallo e non metallo, soglia di $\Delta\chi$) e la carica dello ione dal gruppo; la formula dai due ioni, con il
minimo comune multiplo e la regola dell'incrocio; reticolo cristallino, numero di coordinazione e unità formula;
energia reticolare, con il bilancio dell'energia e la dipendenza da cariche e distanza; le proprietà dei composti
ionici spiegate dal reticolo.

- Con la 27 e la 28 (biennio): ioni, reticolo in un piano, unità formula e formula dagli ioni ci sono già. Qui non si
  ripetono: la lezione parte dalla configurazione elettronica, ricava le cariche dal gruppo e rimanda alla 28 per le
  parentesi degli ioni poliatomici, che in questa lezione non compaiono. Il reticolo è disegnato nello spazio.
- Con la 58 (simboli di Lewis e ioni dei gruppi principali, gruppo B): la tabella gruppo-carica qui è di tre righe e
  serve alla formula; il perché sta nella 58, linkata.
- Con la 64 (gruppo E): il tipo di legame da $\Delta\chi$ è lì. Qui c'è solo la soglia di $1{,}9$ con un esempio e una
  eccezione.
- Con la 66: la fragilità è spiegata qui con una figura TikZ; il confronto con il metallo, da muovere, è nella figura
  interattiva della 66, e la 65 la richiama con un link.
- Con la 75 (solidi, gruppo H) e la 81 (sali binari, gruppo J): la cella elementare e i nomi dei composti restano a
  loro. La lezione dà i nomi (fluoruro di calcio, ossido di alluminio) senza spiegare la regola.
- Con la 46: come l'acqua scioglie un cristallo ionico è lì, linkata.

## Scelte

- Ordine: la formula dai due ioni viene prima del reticolo, perché il rapporto tra gli ioni serve per parlare di
  unità formula. Il brief elenca la formula per ultima.
- La soglia $\Delta\chi > 1{,}9$ è data come regola pratica, con il criterio "metallo più non metallo" indicato come
  più affidabile. Con i valori di `elementi.json` molti composti ionici veri stanno sotto $1{,}9$: KI $1{,}84$,
  MgCl₂ $1{,}85$, Al₂O₃ $1{,}83$, K₂S $1{,}76$, NaI $1{,}73$, Na₂S $1{,}65$. La lezione usa KI come esempio di
  eccezione. Negli esercizi il tipo di legame si chiede solo su coppie in cui i due criteri sono d'accordo.
- L'energia reticolare è definita come energia liberata nella formazione del solido dagli ioni gassosi, e detta
  uguale a quella che serve per separarli: i valori sono positivi. Molti libri la danno con il segno meno.
- L'andamento con cariche e distanza è scritto come proporzionalità a $q_+ \cdot q_- / d$, senza nominare la legge di
  Coulomb (in fisica arriva al quarto anno). L'esempio 5 confronta la stima con i valori misurati e dice che la stima
  dà l'ordine di grandezza.
- Il bilancio dell'energia ($496 - 349 = 147\,\text{kJ/mol}$ per formare gli ioni, $787$ liberati dal reticolo) è
  dato per dire che il trasferimento da solo non conviene. Il ciclo di Born e Haber non è nominato: appartiene alla
  termochimica del quarto anno.
- "Numero di coordinazione" è introdotto in grassetto; la cella elementare no.

## Dati

- Elettronegatività, energia di ionizzazione del sodio ($495{,}8$, scritta $496$), configurazioni: `elementi.json`.
- `elementi.json` non ha l'affinità elettronica: il valore del cloro ($349\,\text{kJ/mol}$) è scritto a memoria.
- `elementi.json` ha un solo raggio per elemento (per il sodio $155\,\text{pm}$), non i raggi ionici. Le distanze
  $d$ della tabella sono somme di raggi ionici di Shannon per coordinazione 6, scritti a memoria: Li⁺ 76, Na⁺ 102,
  K⁺ 138, Mg²⁺ 72, Ca²⁺ 100, F⁻ 133, Cl⁻ 181, Br⁻ 196, O²⁻ 140 pm.
- Masse atomiche dalla tavola della lezione 01 (Ca 40,08; Cl 35,45).

## Da verificare

- Energie reticolari (kJ/mol), a memoria: LiF 1036, NaF 923, NaCl 787, KCl 715, KBr 682, MgO 3791, CaO 3401. Le fonti
  differiscono di qualche unità (NaCl 786 o 787) e per gli ossidi di qualche decina.
- Punti di fusione: NaF 993, NaCl 801, KCl 770, MgO 2852, CaO 2613 °C. Per CaO si trova anche 2572.
- Affinità elettronica del cloro, 349 kJ/mol.
- Raggi ionici di Shannon elencati sopra.
- "Il sodio è un metallo tenero che in acqua reagisce con violenza, il cloro un gas giallo-verde e tossico": corretto,
  scritto a memoria.
- Insolubilità di carbonato di calcio e solfato di bario (nota finale).

## Figure

TikZ, guardate in chiaro e in scuro:

- `ionico-trasferimento-elettrone-lewis`: sodio e cloro con i simboli di Lewis, la freccia dell'elettrone, i due ioni.
- `ionico-reticolo-cloruro-sodio-cubo`: un cubetto di 27 ioni in prospettiva, con i sei vicini dello ione centrale.
- `ionico-fragilita-strati-scorrono`: il cristallo prima e dopo lo scorrimento di due strati.

Interattive:

- `ionico-formula-ioni-neutro` (`IonicoFormulaIoni.tsx`): si scelgono catione e anione, si aggiungono ioni con più e
  meno, due barre a quadretti confrontano le cariche; quando si pareggiano con i numeri minimi compare la formula, con
  un multiplo la didascalia dice che il rapporto si semplifica.
- `ionico-energia-reticolare-ioni` (`IonicoEnergiaReticolare.tsx`): si scelgono i due ioni, disegnati in scala a
  contatto con la distanza; una barra dà la stima $q_+ \cdot q_- / d$ rispetto a NaCl. Per i sette composti con un
  valore misurato lo mostra.

Nessun blocco `grafico`: non c'è una curva con un parametro.

## Esercizi

Generatore `legame-ionico`, sei livelli (specifica in `specs/exercises/legame-ionico.md`): quale coppia forma un legame
ionico; lo ione dal gruppo; la formula dai due ioni; quanti ioni in una massa; energia reticolare a confronto; le
proprietà. Tutto a scelta multipla: le risposte sono formule, nomi o numeri in notazione scientifica. Controllo
indipendente `scripts/exercises/checkers/legame_ionico.py`: PASS su 1000 esercizi per livello con i seed 1, 50001 e
777001. Non collegato al sito.

## Esercizio guidato

L'esempio 3 (alluminio e ossigeno). Si fermerebbe in tre punti: dopo le cariche dei due ioni dal gruppo; dopo il
minimo comune multiplo; prima del controllo della carica totale.

## Dubbi per Andrea

- La soglia per il legame ionico: $1{,}9$ come nel brief o $1{,}7$ come in molti libri? Con $1{,}9$ restano fuori
  MgCl₂, Al₂O₃ e KI, con $1{,}7$ entra anche NaI ma resta fuori Na₂S.
- L'energia reticolare va data positiva (energia liberata, o da fornire per separare gli ioni) o con il segno meno?
- Il bilancio $496 - 349 = 147\,\text{kJ/mol}$ è al livello giusto per una terza, o è meglio dire solo che il
  reticolo libera energia?
- La regola dell'incrocio: la insegni, o preferisci solo il minimo comune multiplo?
- Il numero di coordinazione va in questa lezione o solo nella 75?

Prerequisiti proposti: chim-simboli-lewis, chim-regola-ottetto, chim-affinita-elettronegativita, chim-formula-chimica
