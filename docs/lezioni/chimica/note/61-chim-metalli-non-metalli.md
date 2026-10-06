# Note: Metalli, non metalli e semimetalli

Lezione nuova (terzo anno di chimica, gruppo D, 6 ottobre 2026), capitolo "Il sistema periodico", ultima lezione.
Non pubblicata. `check.mts` passa su lezione, formulario e flashcard, senza avvisi. La lezione non ha conti; i dati
(temperature di fusione, energie di ionizzazione, conteggi delle classi) sono presi da `elementi.json` con
`conti.py`.

## Struttura

Dove stanno le tre classi nella tavola (figura, conteggi, nota sul confine); proprietà dei metalli; dei non metalli;
dei semimetalli, con la tabella di confronto, l'esempio 1 e un avviso; il carattere metallico (definizione, andamenti,
schema, terzo periodo e gruppo 14, esempi 2 e 3, figura interattiva, avviso); le famiglie (alcalini, alcalino-terrosi,
di transizione, alogeni, gas nobili), con l'esempio 4 e l'avviso sull'idrogeno.

## Scelte

- Confini: il perché delle proprietà dei metalli (mare di elettroni) è della lezione 66, con il link; ossidi basici e
  acidi sono nominati con il link alla 77; la storia delle famiglie è nella 43. La formula dai due ioni dell'esempio 4
  anticipa la 65 in tre righe, come fa già la 43 con le formule per analogia.
- Classi come in `elementi.json`: sette semimetalli (boro, silicio, germanio, arsenico, antimonio, tellurio, polonio),
  astato tra i non metalli con gli alogeni. Una nota dice che su polonio e astato i libri non concordano.
- I gas nobili contano tra i non metalli ($20$ in tutto). Conteggi dal file: $91$ metalli, $7$ semimetalli, $20$ non
  metalli, con gli elementi del settimo periodo classificati come li classifica il file.
- Il carattere metallico è definito come tendenza a perdere elettroni, e non ha un numero. La figura interattiva
  mostra l'energia di ionizzazione, e il testo dice che non c'è una soglia (berillio sopra boro).
- La reazione dei metalli alcalini con l'acqua è data a parole, senza equazione: il bilanciamento è al quarto anno.
- "Kripton" come nella tavola del sito; la lezione 43 e il suo generatore scrivono "cripto". Da uniformare.

## Da verificare

- Il tungsteno fonde a $3422\,^\circ\text{C}$ e il mercurio a $-38{,}8\,^\circ\text{C}$: dal file ($3695\,\text{K}$ e
  $234{,}32\,\text{K}$).
- I metalli alcalini si conservano in olio di vaselina; litio, sodio e potassio galleggiano sull'acqua (densità dal
  file: $0{,}534$, $0{,}97$, $0{,}89\,\text{g/cm}^3$); "il litio frizza, il sodio corre sulla superficie fondendo, il
  potassio si incendia": descrizioni da manuale, a memoria.
- Primi composti dello xeno nel 1962 (Neil Bartlett, non nominato nel testo).
- "Alogeno vuol dire generatore di sali".
- Un metallo scaldato conduce peggio, un semiconduttore meglio: vero per i semiconduttori puri; il boro non è un
  semiconduttore d'uso, e la tabella dice "lucenti" per tutti i semimetalli, che per il boro è una semplificazione.

## Figure

Due TikZ, guardate in chiaro e in scuro: `metalli-tavola-tre-classi` (sei periodi, tre tinte, il confine in grassetto)
e `metalli-carattere-metallico-andamento`.

Una interattiva: `metalli-tavola-classi` (`MetalliTavolaClassi.tsx`): i gruppi principali dei primi sei periodi con una
fascia per i metalli di transizione; un tocco su un elemento dà classe, famiglia, stato a 25 °C, energia di
ionizzazione ed elettronegatività, e sposta una tacca su una scala dell'energia di ionizzazione, con gli altri
elementi del periodo come puntini; un selettore colora le classi o le famiglie. Guardata in chiaro, in scuro e a
390 px. Le tinte si invertono nel tema scuro insieme alla legenda, che è disegnata nello stesso SVG; la classe è
sempre scritta anche sotto la figura.

Una seconda figura (la conduzione di un metallo e di un semiconduttore al variare della temperatura) non c'è: senza
dati veri sarebbe stata un'animazione qualitativa.

## Esercizio guidato

L'esempio 4 (ioni e formula dal gruppo). Tre fermate: lo ione del metallo dal suo gruppo; lo ione del non metallo;
quanti ioni dell'uno e dell'altro per un composto neutro.

## Esercizi

Generatore `chim-metalli-non-metalli`, sei livelli, tutti a scelta multipla.

## Dubbi per Andrea

- Polonio semimetallo e astato non metallo, come la tavola del sito: va bene, o li classifichi diversamente?
- I gas nobili tra i non metalli, o come classe a parte?
- Le famiglie stanno in fondo a questa lezione: bastano così, o gli alcalini e gli alogeni meritano più spazio (le
  reazioni con l'acqua, gli alogenuri)?
- L'esempio 4 scrive una formula ionica prima della lezione sul legame ionico: si tiene?
- "Kripton" o "cripto"?

Prerequisiti proposti: proprieta-periodiche, chim-affinita-elettronegativita, gruppi-periodi, chim-tavola-mendeleev
