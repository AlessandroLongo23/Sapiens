# Note: Numero atomico, numero di massa e isotopi

Lezione nuova (biennio di chimica, gruppo 28, 30 settembre 2026). Conti rifatti in Python: esempio 3,
$34{,}97 \cdot 0{,}7576 + 36{,}97 \cdot 0{,}2424 = 26{,}49 + 8{,}96 = 35{,}45$; avviso sulla media semplice, $35{,}97$;
esempio 4, $18{,}950 + 2{,}499 + 2{,}860 = 24{,}309$; esempio 5, $(11{,}01 - 10{,}81)/1{,}00 = 0{,}20$; esempi 1 e 2
contati a mano. `check.mts` passa.

## Struttura

Numero atomico (l'elemento, gli elettroni dell'atomo neutro); numero di massa e nucleoni, $N = A - Z$; il simbolo con la
figura, esempio 1 e l'avviso su $A$ e i neutroni; gli isotopi (Soddy, carbonio, idrogeno con la figura), l'avviso sugli
isobari; gli ioni, con catione e anione, l'esempio 2 e l'avviso sul segno; la figura interattiva; la massa atomica
media con gli esempi 3-5 e l'avviso sulla media semplice.

## Scelte e fonti

- Masse e abbondanze isotopiche: IUPAC, "Isotopic compositions of the elements 2021" (e masse atomiche 2021), valori a
  memoria arrotondati al centesimo, da verificare sulla tabella: cloro-35 $34{,}97\,\text{u}$ $75{,}76\%$, cloro-37
  $36{,}97\,\text{u}$ $24{,}24\%$; magnesio-24, -25, -26 $23{,}99$, $24{,}99$, $25{,}98\,\text{u}$ con $78{,}99$, $10{,}00$,
  $11{,}01\%$; boro-10 e -11 $10{,}01$ e $11{,}01\,\text{u}$, $19{,}9$ e $80{,}1\%$ (l'esempio dà $20$ e $80\%$ perché i
  dati sono arrotondati); carbonio-12 e -13 $98{,}9$ e $1{,}1\%$.
- Il nome "isotopo" di Frederick Soddy, 1913 (proposto da Margaret Todd, secondo Soddy stesso): da verificare.
- I simboli con numero atomico e di massa sono scritti ${}^{23}_{11}\mathrm{Na}$: KaTeX allinea i due numeri a sinistra,
  mentre la tipografia chimica li allinea a destra. Con un numero atomico di una cifra la differenza si vede poco; serve
  un comando `\prescript` o simile, che KaTeX non ha.
- Gli ioni sono già nella lezione del primo anno "Atomi, molecole e ioni": qui si contano solo le particelle, con un
  link a quella lezione.

## Figure

Due TikZ, guardate in chiaro e in scuro: `numero-massa-simbolo` e `numero-massa-isotopi-idrogeno`. Interattiva
`costruisci-atomo` (`chimica/CostruisciAtomo.tsx`): tre contatori per protoni ($0$-$12$), neutroni ($0$-$16$) ed
elettroni ($0$-$14$); il nucleo è un grappolo di palline su una spirale a girasole, gli elettroni palline azzurre in una
nuvola senza livelli. Sotto: il simbolo completo con la carica, nome, $Z$ e $A$, atomo neutro, catione o anione, e se il
nucleo è un isotopo stabile (elenco degli stabili dei primi dodici elementi, IUPAC 2021, nel codice). Guardata in
chiaro, in scuro e sul telefono, anche dopo aver aggiunto un neutrone (carbonio-13).

## Esercizi

Generatore `numero-massa`, sei livelli (specifica in `specs/exercises/numero-massa.md`), senza scene.

## Domande per Andrea

- Abbondanze e masse degli isotopi: i libri del biennio usano masse con due decimali (come qui) o i numeri di massa
  ($35 \cdot 0{,}7576 + 37 \cdot 0{,}2424$)? Con i numeri di massa il cloro viene $35{,}48$, non $35{,}45$.
- Il trizio e il carbonio-14 si possono nominare come "radioattivi" al biennio, visto che la radioattività è del terzo
  anno?
- Nella figura interattiva i nuclei "instabili" sono divisi tra "si trasforma in un altro" e "non si trova in natura"
  con una regola grossolana (più neutroni che protoni di oltre quattro, o meno neutroni che protoni): va bene per il
  biennio, o meglio dire solo "stabile" e "non stabile"?
- L'esercizio sulle abbondanze (esempio 5 e livello 6) è da biennio, o è troppo?
