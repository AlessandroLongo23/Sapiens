# Note: Triangoli e criteri di congruenza

Lezione nuova, scritta da zero (lotto 5). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy: il terzo angolo ($65^\circ$), gli angoli dell'isoscele ($70^\circ$, $110^\circ$), $60^\circ$ dell'equilatero, le disuguaglianze degli esempi 6 e 7 e della figura ($3 + 4 < 8$, $5 + 7 = 12$, $3 < x < 11$). Con SymPy ho controllato anche le coordinate delle figure che devono essere esatte: il controesempio "due lati e un angolo non compreso" (le due soluzioni $t \approx 1{,}964$ e $t \approx 4{,}964$ danno davvero $BC \cong BD$), il punto medio comune dell'esempio 1 e gli angoli congruenti in $A$ e in $B$ dell'esempio 2 ($53{,}13^\circ$ tutti e due).

## Scelte di convenzione

- Isoscele definito con "almeno due lati congruenti", quindi l'equilatero è un caso particolare di isoscele (lo dicono la lezione e una carta). Alcuni libri dicono "due lati congruenti" senza "almeno": da verificare con il libro in uso.
- Notazione: angoli interni $\hat{A}$, angoli con tre lettere $\widehat{ABC}$, triangoli $\triangle ABC$ (introdotto accanto a "il triangolo $ABC$"). Lunghezza di un segmento $\overline{AB}$, usata una volta sola per spiegare perché con le misure si scrive "=" e con le figure "$\cong$".
- "Uguale" riservato alla stessa figura, "congruente" per figure sovrapponibili, come nella maggior parte dei libri italiani. Alcuni libri recenti usano "uguale" per "congruente": se il libro in uso lo fa, la frase va ammorbidita.
- Primo criterio: la lezione dice in un `ad-note` che molti libri lo prendono come postulato e altri lo giustificano con il movimento rigido; nessuno dei criteri è dimostrato. Il secondo e il terzo si dimostrano nei libri a partire dal primo (il terzo con il teorema dell'isoscele): se si vuole una lezione più completa, la dimostrazione del terzo è la candidata, ma allunga una lezione già lunga.
- Secondo criterio nella forma "un lato e i due angoli adiacenti". Il secondo criterio generalizzato (un lato e due angoli qualsiasi) richiede la somma degli angoli, quindi va nella 60; qui non è citato.
- Teorema inverso dell'isoscele solo enunciato: la lezione spiega perché la bisettrice non basta (darebbe il caso lato-angolo-angolo non adiacenti) e rimanda al libro. Viene usato nell'esempio 8 solo nella forma diretta (contronominale), perciò la lezione resta coerente anche se il revisore toglie l'enunciato inverso.
- Formato delle dimostrazioni: "Ipotesi:", "Tesi:", "Dimostrazione." in testo semplice (niente grassetto, come chiede lo stile), passaggi in elenco numerato con la giustificazione dopo la virgola. Gli elenchi numerati dentro un riquadro `ad-example` non c'erano ancora in nessuna lezione: `admonitionPlugin` fa `md.render` del corpo, quindi dovrebbero uscire come liste; da guardare sul sito.
- `check.mts` avvisa per 27 grassetti: sono tutti termini definiti nel punto in cui compaiono (vertici, lati, opposto, adiacenti, compreso, scaleno, cateti, ipotesi, tesi, ecc.). Se sono troppi, i primi da togliere sono "opposto", "adiacenti", "compreso" e "corrispondenti".

## Lasciato ad altre lezioni

- Segmenti, angoli, punto medio, bisettrice, opposti al vertice, supplementari di angoli congruenti: link alla 58, che deve contenere l'enunciato "supplementari (o complementari) di angoli congruenti sono congruenti", usato nell'esempio 5. Se la 58 non lo enuncia, va aggiunto lì o spiegato qui in una riga.
- Somma degli angoli interni: solo enunciato e conseguenze, dimostrazione nella 60. Angolo esterno e teorema dell'angolo esterno: nella 60, non citati qui.
- "A lato maggiore si oppone angolo maggiore" e la dimostrazione della disuguaglianza triangolare: solo un `ad-note` senza figura. Il brief di lotto non assegna questo teorema a nessuna lezione; se si vuole trattarlo, il posto è qui, con una figura e senza dimostrazione.
- Altezze, mediane, bisettrici del triangolo: nella 61. Non ho messo un esempio "la mediana dell'isoscele è anche altezza e bisettrice" per non anticipare la 61, che potrebbe usarlo come dimostrazione svolta.
- Il link a Implicazione, condizioni necessarie e sufficienti (dove ipotesi e tesi si legano a "se... allora") non c'è, perché quella lezione non è ancora scritta. Quando lo sarà, va aggiunto nella sezione "Come si scrive una dimostrazione".

## Da togliere o controllare in lezioni già scritte

Nessuna lezione già scritta tratta geometria sintetica. La 41 (Relazioni di equivalenza e d'ordine) potrebbe citare la congruenza tra figure come esempio di relazione di equivalenza, con un link a questa lezione.

## Figure

Quindici figure, generate da uno script Python che calcola le coordinate (trattini perpendicolari ai lati, archi degli angoli, quadratino dell'angolo retto), senza librerie TikZ, senza `\clip` e senza riempimenti bianchi. Tinte: `orange!30`, `blue!15`, `green!20` per gli angoli, `blue!45` e `blue!60!black` per i segmenti evidenziati. Compilate tutte con `compileFigure` e guardate in chiaro (non sul sito in tema scuro). Larghezze: le figure nei riquadri tra 163 e 218 px; fuori dai riquadri le due classificazioni (292 e 299 px) e i tre criteri (285 px), sotto la colonna del telefono.

`triangolo-lato-opposto-angolo`, `triangoli-scaleno-isoscele-equilatero`, `triangoli-acutangolo-rettangolo-ottusangolo`, `primo-criterio-congruenza-triangoli`, `secondo-criterio-congruenza-triangoli`, `terzo-criterio-congruenza-triangoli`, `due-lati-e-angolo-non-compreso`, `esempio-segmenti-stesso-punto-medio`, `esempio-secondo-criterio-punto-medio`, `esempio-terzo-criterio-aquilone`, `teorema-triangolo-isoscele`, `esempio-triangoli-sovrapposti`, `esempio-prolungamenti-base-isoscele`, `disuguaglianza-triangolare-lati-3-4-8`, `somma-angoli-interni-triangolo`.

Nella figura del teorema dell'isoscele i due mezzi angoli in $A$ hanno un archetto con un trattino ciascuno: a 164 px il segno è piccolo, da controllare sul telefono. L'avviso "Tre angoli non bastano" non ha figura (il testo con i due equilateri si capisce da solo).

## Formulario e flashcard

- Il formulario non ha figure: i criteri a parole si leggono bene e le tre figure dei criteri lo avrebbero raddoppiato.
- 20 carte, tutte da contenuti della lezione; due sono conti a mente (terzo angolo, angoli alla base).

## Prerequisiti

La riga `angoli-e-lati-dei-triangoli <- geometria-enti` va bene, e aggiungerei `relazioni-equivalenza-ordine` solo se il ripasso deve seguire il link sulla congruenza come relazione di equivalenza: nella lezione è un cenno di una riga, quindi propongo di non aggiungerlo. Tutto il resto viene dalla 58: angoli opposti al vertice (esempi 1 e 2), bisettrice (teorema dell'isoscele, esempio 3), supplementari (esempio 5), angoli acuti, retti e ottusi (classificazione).

## Per il generatore

1. Classificare un triangolo dati i lati o gli angoli (scaleno, isoscele, equilatero; acutangolo, rettangolo, ottusangolo), anche con le misure date in ordine sparso.
2. Trovare il terzo angolo dati due angoli, e gli angoli di un isoscele dato l'angolo al vertice o un angolo alla base (con i risultati interi o con mezzi gradi, per esempio $(180^\circ - 45^\circ) : 2 = 67{,}5^\circ$).
3. Disuguaglianza triangolare: stabilire se tre lunghezze formano un triangolo, compresi i casi con la somma uguale al terzo lato; trovare l'intervallo del terzo lato.
4. Riconoscere il criterio: dati tre elementi congruenti di due triangoli (a parole o con una figura segnata), dire quale criterio si applica o che nessuno si applica (lato-lato-angolo non compreso, tre angoli).
5. Corrispondenze: data $\triangle ABC \cong \triangle DEF$, trovare il lato o l'angolo corrispondente; dati gli elementi congruenti, scrivere la congruenza con i vertici nell'ordine giusto.
6. Dimostrazione guidata a scelta multipla: completare ipotesi, tesi e i tre passaggi con la giustificazione, per figure come quelle degli esempi 1-5 (segmenti con lo stesso punto medio, aquilone, isoscele con punti sui lati o prolungamenti della base).
