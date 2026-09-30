# Note: Il diagramma delle forze

Lezione nuova (terzo lotto di fisica, gruppo 15, 30 settembre 2026). Conti rifatti in Python: $12 \cdot 9{,}8 = 117{,}6$ N,
$50\cos 30^\circ = 43{,}30$ N, $50\sin 30^\circ = 25$ N, $F_v = 92{,}6$ N, $F_d = 18{,}52$ N, $a = 24{,}78/12 = 2{,}065$ m/s²;
con $F_v = P$ l'attrito sarebbe $0{,}20 \cdot 117{,}6 = 23{,}5$ N; $60 \cdot 11{,}3 = 678$ N e $678/9{,}8 = 69{,}2$ kg,
$60 \cdot 8{,}3 = 498$ N e $50{,}8$ kg; $54 \cdot 9{,}8 = 529{,}2$ N, $(529{,}2 - 588)/60 = -0{,}98$ m/s². Nelle figure: 1 cm per
40 N ($2{,}94$, $2{,}315$, $1{,}25$ e $0{,}463$ cm; componenti $1{,}083$ e $0{,}625$ cm); ascensori a 1 cm per 400 N
($1{,}695$, $1{,}47$, $1{,}245$ cm). `check.mts` passa.

## Struttura ed esempi

Come si disegna (definizione, quattro passi, figura della cassa con la fune inclinata e il suo diagramma, avviso sulle
forze che non ci sono, figura interattiva da costruire), la scelta degli assi, il secondo principio per componenti (con
i segni, il procedimento in cinque passi), l'esempio 1 guidato (la fune inclinata con l'attrito, figura con le
componenti), l'avviso sulla reazione del pavimento, l'ascensore e il peso apparente (formula $F_v = m(g + a)$, figura dei
tre ascensori, esempio 2 della bilancia, il verso dell'accelerazione e non del moto, la caduta libera, esempio 3 dalla
bilancia all'accelerazione, avviso sul peso che non cambia, figura interattiva).

## Scelte

- "Diagramma delle forze" come titolo, "diagramma di corpo libero" come sinonimo detto una volta.
- Il peso apparente è definito come la forza con cui il corpo preme sull'appoggio (uguale a $F_v$ per il terzo
  principio), e la bilancia segna $F_v/g$ in chilogrammi.
- Gli esempi guidati sono due, come chiedeva il piano (fune inclinata, ascensore), più l'esempio 3 al contrario.
  Piano inclinato in moto e corpi collegati restano alle lezioni delle applicazioni (gruppo 16).
- Nella figura da costruire le forze sbagliate hanno nomi con pedici di comodo ($F_{lt}$, $F_{cp}$, $F_{lf}$, $F_m$), che
  compaiono solo se lo studente le mette; i nomi veri sono sui bottoni.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `diagramma-forze-fune-inclinata` (situazione e diagramma, in scala),
`fune-inclinata-componenti` (con gli assi e le proiezioni), `ascensore-peso-apparente` (tre ascensori). Interattive:
`diagramma-forze-costruisci` (`fisica/DiagrammaForzeCostruisci.tsx`: tre situazioni, forze da trascinare sul corpo o da
toccare, bottone Controlla che dice se il diagramma è completo, quante forze mancano e perché una forza sbagliata non
agisce sul corpo) e `ascensore-bilancia` (`fisica/AscensoreBilancia.tsx`: viaggio di 15 m in salita o in discesa,
$1{,}5$ m/s² per 2 s, 3 m/s per 3 s, frenata per 2 s; formule chiuse; la bilancia segna 69, 60 e 51 kg).

## Esercizi

Generatore `fis-diagramma-corpo-libero`, sei livelli (specifica in `specs/exercises/fis-diagramma-corpo-libero.md`),
scena `blocco-forze`.

## Domande per Andrea

- "Diagramma delle forze" o "diagramma di corpo libero" come nome principale nell'Amaldi?
- Nel diagramma le forze partono tutte dal centro, anche l'attrito e la reazione: è la convenzione che usate in classe,
  o l'attrito si disegna sulla superficie di contatto?
- Il peso apparente: l'Amaldi del biennio lo definisce, o è del terzo anno (sistemi non inerziali)?
- La bilancia pesapersone "segna" chilogrammi: va detto che in realtà misura una forza, come ho fatto, o basta il conto?
- Il procedimento in cinque passi: è troppo schematico?
