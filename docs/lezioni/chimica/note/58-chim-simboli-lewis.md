# Note: Elettroni di valenza e simboli di Lewis

Lezione nuova (terzo anno di chimica, gruppo B, 6 ottobre 2026), seconda del capitolo "Il sistema periodico". Conti
rifatti con uno script Python sui dati di `src/lib/tools/elementi.json`. `check.mts` passa su lezione, formulario e
flashcard; restano due avvisi sui titoli con "Lewis", che è un nome proprio.

## Struttura

Gli elettroni di valenza dalla configurazione (esempi 1 e 2, con l'avviso sul $d$ pieno); dal gruppo (tabella,
esempio 3, la nota sugli elementi di transizione); i simboli di Lewis, con il procedimento, la figura dell'ordine dei
puntini, la tavola dei primi tre periodi, l'esempio 4 e la nota "non è un diagramma a caselle"; la figura
interattiva; gli ioni dei gruppi principali, con la tabella, la figura sodio e cloro, gli esempi 5 e 6.

## Scelte

- Confini. La regola dell'ottetto è della 62 (gruppo E): qui è nominata in una frase con il link, e usata solo per
  la carica degli ioni. Le formule di Lewis delle molecole sono della 67, il legame covalente della 63, la formula
  di un composto ionico della 65, i numeri di ossidazione della 76: un link ciascuno. La configurazione degli ioni è
  della 53: qui si dice quale gas nobile raggiungono.
- Elettroni di valenza definiti solo per i gruppi principali, come "elettroni del livello più esterno". Per gli
  elementi di transizione una nota dice che il conto è meno diretto e non lo fa.
- Simboli di Lewis con un puntino per lato fino a quattro, poi le coppie. Altri libri disegnano la coppia dell'$s$ per
  prima (berillio con una coppia, carbonio con una coppia e due puntini singoli). Una nota spiega perché il simbolo
  del carbonio non coincide con il diagramma a caselle.
- "Elettrone spaiato" è usato anche per il puntino singolo di un simbolo di Lewis, come nei libri. Nel magnesio e nel
  carbonio i puntini singoli non sono gli elettroni spaiati del diagramma a caselle: la nota lo dice.
- Ioni: solo quelli che la regola prevede bene (gruppi 1, 2, alluminio, 15, 16, 17). Carbonio, silicio e gas nobili
  "di solito non formano ioni semplici". Stagno, piombo e metalli di transizione rimandati alla 76.
- L'idrogeno: detto che forma sia $\mathrm{H^+}$ sia lo ione idruro $\mathrm{H^-}$.
- Simbolo di Lewis di un catione senza puntini, tra parentesi quadre con la carica nelle figure.

## Dubbi per Andrea

- Simboli di Lewis con i puntini uno per lato (scelta fatta) o con la coppia dell'$s$ disegnata per prima? Decide come
  si disegnano berillio, boro, carbonio e i loro gruppi, anche nella lezione 67.
- Il termine "elettrone spaiato" per il puntino singolo del simbolo va bene, o preferisci "elettrone singolo"?
- $\mathrm{N^{3-}}$ e $\mathrm{P^{3-}}$ nella tabella degli ioni: esistono nei nitruri e nei fosfuri, ma sono meno
  comuni degli altri. Tenerli?
- "Doppietto" come sinonimo di coppia di elettroni: va introdotto qui o nella 63?
- L'alluminio è l'unico del gruppo 13 nella tabella degli ioni; il boro è detto, nella figura interattiva, tra quelli
  che non formano ioni semplici. Va detto anche nel testo?

## Da verificare

- "Li introdusse nel 1916 il chimico americano Gilbert Lewis": data e attribuzione a memoria (l'articolo è "The Atom
  and the Molecule", Journal of the American Chemical Society, 1916).
- "Gli costa molta meno energia acquistare un elettrone che perderne sette" (cloro): vero, senza numeri nel testo.
- `elementi.json` non ha le cariche degli ioni semplici, ma i numeri di ossidazione: quelli della tabella della
  lezione ci sono tutti ($+1$, $+2$, $+3$, $-3$, $-2$, $-1$).

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `lewis-ordine-puntini` (un elemento generico con da uno a otto puntini,
copiata anche nel formulario), `lewis-simboli-primi-tre-periodi`, `lewis-simbolo-fosforo` (nell'esempio 4),
`lewis-ioni-sodio-cloro`, `lewis-ioni-magnesio-zolfo` (nell'esempio 5). I puntini sono messi a mano con le coordinate.

Una interattiva, `lewis-simboli-gruppo` (`interactive/chimica/LewisSimboliGruppo.tsx`): una tavola dei gruppi
principali dei primi quattro periodi da cui si sceglie un elemento, e accanto il suo simbolo di Lewis in grande. Un
selettore passa dall'atomo allo ione: i puntini spariscono o diventano otto, compaiono parentesi e carica, e la frase
dice quanti elettroni ha perso o acquistato e quale gas nobile raggiunge; per carbonio, silicio, germanio, boro e gas
nobili dice che non c'è uno ione semplice. Guardata in chiaro, in scuro e a 390 px, per atomo e ione di tredici
elementi.

## Esercizio guidato

L'esempio 5, gli ioni del magnesio e dello zolfo. Si fermerebbe in tre punti: gli elettroni di valenza di ciascuno;
perde o acquista, e quanti; la carica con il segno e il gas nobile raggiunto.

## Esercizi

Generatore `chim-simboli-lewis`, sei livelli (specifica in `specs/exercises/chim-simboli-lewis.md`). I livelli 1, 2 e
3 hanno come risposta un numero. Il livello 4 descrive il simbolo a parole (coppie e puntini singoli): i simboli
disegnati come opzioni avrebbero chiesto una scena dentro le opzioni, che oggi esiste solo per i grafici.

Prerequisiti proposti: chim-configurazione-elettronica, gruppi-periodi, chim-atomi-molecole-ioni
