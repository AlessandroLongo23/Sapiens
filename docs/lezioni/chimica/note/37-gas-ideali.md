# Note: L'equazione di stato dei gas ideali

Lezione nuova (biennio di chimica, secondo anno, gruppo 27, 30 settembre 2026). Conti rifatti in Python: $R$ dal volume
molare, $1 \cdot 22{,}4/273 = 0{,}08205$ e $1{,}013 \cdot 10^5 \cdot 0{,}0224/273 = 8{,}3118$; esempio 1,
$2{,}00 \cdot 0{,}0821 \cdot 298/1{,}00 = 48{,}93$; esempio 2, $64{,}0/32{,}00 = 2{,}00$,
$2{,}00 \cdot 0{,}0821 \cdot 300/10{,}0 = 4{,}926$; esempio 3,
$1{,}50 \cdot 10^5 \cdot 5{,}00 \cdot 10^{-4}/(8{,}31 \cdot 293) = 0{,}030803$; esempio 4,
$n = 0{,}560/(0{,}0821 \cdot 300) = 0{,}022737$, $M = 43{,}98$; propano $44{,}11$; esempio 5,
$44{,}01/(0{,}0821 \cdot 298) = 1{,}7988$; avviso sui gradi Celsius, $298/25 = 11{,}9$. `check.mts` passa.

## Struttura

Le quattro leggi dei gas in una tabella con i link alle lezioni 31-34 del gruppo 26 (Boyle, Charles e Gay-Lussac nella
stessa lezione, Avogadro) e all'equazione generale (lezione 33), da cui $pV = nRT$; la figura del cilindro con le
quattro grandezze; $R$ ricavata dal volume molare nelle due unità, con la tabella delle unità, le conversioni e due
avvisi (gradi Celsius, unità mescolate); il gas ideale come modello, con un riquadro che rimanda alla lezione di fisica;
il procedimento in quattro passi e gli esempi 1-3; massa molare e densità con gli esempi 4 e 5 e l'avviso sui
millilitri.

## Scelte

- $R = 0{,}0821\,\text{L}\cdot\text{atm/(mol}\cdot\text{K)}$ e $8{,}31\,\text{J/(mol}\cdot\text{K)}$, $T = t + 273$, come
  il README di chimica.
- "Gas ideale" è il nome dei libri di chimica; la fisica dice "gas perfetto" (lezione di fisica
  `l-equazione-di-stato-del-gas-perfetto`, nell'elenco degli indirizzi ma non ancora scritta): un riquadro dice che
  sono lo stesso modello.
- "Errori di solito più piccoli dell'1%" per i gas veri a pressioni moderate: ordine di grandezza del fattore di
  compressibilità a $1\,\text{atm}$ (per l'anidride carbonica circa $0{,}995$ a $25\,^\circ\text{C}$, da verificare su
  una tabella).
- Nessuna figura interattiva: la lezione è di conti, e le leggi dei gas (con le loro figure) sono nelle lezioni del
  gruppo 26.

## Figure

TikZ `gas-ideali-cilindro-grandezze` (cilindro con pistone, molecole, la freccia del volume, le quattro grandezze
scritte accanto). Guardata in chiaro e in scuro.

## Esercizi

Generatore `gas-ideali`, sei livelli (specifica in `specs/exercises/gas-ideali.md`), senza scene.

## Domande per Andrea

- Nel biennio si usano tutte e due le forme di $R$, o solo $0{,}0821$ con atmosfere e litri? Il livello 3 degli esercizi
  usa kilopascal e millilitri con $R = 8{,}31$.
- "Gas ideale" o "gas perfetto" nei libri di chimica del secondo anno?
- La densità $d = pM/(RT)$ è nel programma del biennio, o è un approfondimento del triennio?
- La tabella con le quattro leggi come casi particolari di $pV = nRT$ ripete le lezioni del gruppo 26: va bene come
  riepilogo, o basta un link?
