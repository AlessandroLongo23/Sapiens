# Note: Il metodo sperimentale

Lezione nuova, scritta da zero (primo lotto di fisica, gruppo 1, 29 settembre 2026). Il controllo `check.mts` passa sui
tre file senza errori; resta l'avviso sul numero di grassetti (10, tutti su termini definiti).

## Struttura ed esempi

Che cosa studia la fisica (grandezze fisiche come proprietà misurabili, con link alla lezione 2; legge fisica); le fasi del
metodo in cinque passi con la figura del ciclo; Galileo; l'esempio del pendolo con la figura interattiva; le variabili
di un esperimento (indipendente, dipendente, grandezze da tenere costanti, esperimento controllato); misure, incertezza e
riproducibilità (con link alle lezioni sugli errori, sul valore medio e sulla relazione di laboratorio, senza trattarle);
leggi, modelli e teorie, con l'ipotesi smentita di Aristotele.

Tre esempi svolti:

1. tre serie di misure sul pendolo (massa, lunghezza, ampiezza), con la conclusione: il periodo dipende solo dalla
   lunghezza e raddoppia quando la lunghezza quadruplica;
2. quali prove confrontare in una tabella di quattro prove (la stessa situazione del livello 3 del generatore);
3. l'ipotesi di Aristotele smentita da Galileo, la piuma e l'aria, il martello e la piuma di David Scott sulla Luna.

Avvisi: un'ipotesi va controllata con delle misure, cambiare due grandezze insieme, una differenza più piccola
dell'incertezza non è una scoperta, una conferma non è una dimostrazione.

## Numeri

Rifatti in Python (`scratchpad/l01/`): $T = 2\pi\sqrt{L/g}$ con $g = 9{,}8\,\text{m/s}^2$ dà $1{,}0035\,\text{s}$ per
$0{,}25\,\text{m}$, $1{,}4192\,\text{s}$ per $0{,}50\,\text{m}$, $2{,}0071\,\text{s}$ per $1{,}00\,\text{m}$. Con la
correzione per l'ampiezza $1 + \theta_0^2/16$ il pendolo di $1{,}00\,\text{m}$ dà $2{,}0080$, $2{,}0109$ e
$2{,}0224\,\text{s}$ a $5^\circ$, $10^\circ$, $20^\circ$ (in tabella $2{,}01$, $2{,}01$, $2{,}02$). A $60^\circ$ il periodo
esatto (integrale ellittico) è $1{,}0732$ volte quello delle piccole oscillazioni: "più lungo di circa il $7\%$".

## Fonti

- Galileo, "sensate esperienze" e "necessarie dimostrazioni": le due espressioni sono nella Lettera a Cristina di
  Lorena (1615); da verificare sul testo prima della pubblicazione, qui non cito l'opera per non attribuirla male.
- "È scritto in lingua matematica": Il Saggiatore (1623), la frase è quella famosa del "grandissimo libro"; citata
  a memoria, da verificare.
- La lampada del duomo di Pisa è un racconto di Vincenzo Viviani, il primo biografo di Galileo: per questo nel testo è
  "si racconta".
- Apollo 15, 2 agosto 1971, David Scott, martello e piuma: dati della NASA che ricordo, da verificare.

## Figure

- `fasi-metodo-sperimentale` (TikZ, 324 x 291 px): le cinque fasi in colonna, con la freccia di ritorno "ipotesi smentita".
- `pendolo-periodo` (interattiva, `src/components/content/interactive/fisica/PendoloPeriodo.tsx`, registrata in
  `FIGURES`): pendolo con cursori per lunghezza, massa e ampiezza, bottone che lo fa oscillare in tempo reale, bottone
  che registra la prova in una tabella (al più sei righe). Il periodo è $2\pi\sqrt{L/g}\,(1 + \theta_0^2/16)$: con il filo
  di $1\,\text{m}$ dà i numeri della lezione, e la massa non entra. Guardata in chiaro e in scuro, a 800 e 390 px, prima e
  dopo "Avvia" e "Registra la prova": zero errori in console, niente scorrimento laterale. Nella pagina di prova i
  `<Tex>` escono senza il CSS di KaTeX (la pagina `prova-fisica` non lo carica; la pagina della lezione sì).

## Lasciato ad altre lezioni

Errori casuali e sistematici, valore medio, compatibilità di due misure, cifre significative, relazione di laboratorio:
solo un link. Il grafico e la proporzionalità (il periodo e la radice della lunghezza): solo "raddoppia quando la
lunghezza quadruplica", senza formula.

## Per il generatore

`fis-metodo-sperimentale`, quattro livelli, tutti a scelta multipla (specifica in `specs/exercises/fis-metodo-sperimentale.md`):
le fasi del metodo, le variabili, le prove da confrontare, i dati e l'ipotesi.

## Domande per Andrea

- Galileo "padre del metodo sperimentale": la lezione dice che l'ha "descritto per la prima volta in modo chiaro". Va
  bene, o si preferisce la formula dei libri ("il fondatore del metodo sperimentale")?
- Le fasi: qui sono cinque (osservazione, ipotesi, esperimento, analisi dei dati, conclusione). Alcuni libri ne danno
  quattro o sei (per esempio "formulazione del problema" a parte, o "elaborazione della teoria"). Quale schema usa il
  vostro libro?
- La definizione di grandezza fisica è anticipata qui in una riga e ripresa nella lezione 2 con la definizione
  operativa. Va bene la divisione?
- Il periodo del pendolo con $g = 9{,}8\,\text{m/s}^2$ dà $2{,}01\,\text{s}$ per un filo di $1\,\text{m}$: nei laboratori
  si trova spesso $2{,}0\,\text{s}$. Tenere due decimali negli esempi?
- Generatore, livello 1: le frasi si riconoscono dai verbi ("pensa che" per l'ipotesi, "conclude che" per la
  conclusione). È abbastanza, o servono frasi meno guidate?
- Generatore, livello 4: la regola è "differenze entro l'incertezza: nessuna dipendenza; molto oltre: dipendenza". La
  compatibilità vera arriva con le lezioni sugli errori: va bene così in questa lezione?
