# Note: Le lenti sottili

Lezione nuova, secondo lotto di fisica, gruppo 11, 30 settembre 2026. Numeri rifatti in Python (frazioni esatte);
`check.mts` passa sui tre file.

## Struttura ed esempi

Lenti convergenti e divergenti; asse e centro ottico; fuoco, due fuochi, distanza focale con il segno; potere diottrico
in diottrie; raggi notevoli e costruzione dell'immagine, reale o virtuale; tabella dei casi per la lente convergente;
lente divergente; equazione $\frac{1}{p} + \frac{1}{q} = \frac{1}{f}$ e ingrandimento $G = -q/p$. Esempi: $f = 25\,\text{cm}$
e $4{,}0\,\text{D}$, $-2{,}5\,\text{D}$ e $-40\,\text{cm}$; $f = 10\,\text{cm}$ con $p = 30$ ($q = 15$, $G = -0{,}50$,
$h' = -1{,}0\,\text{cm}$), $p = 15$ ($q = 30$, $G = -2{,}0$), $p = 5{,}0$ ($q = -10$, $G = 2{,}0$); divergente
$f = -10$, $p = 15$ ($q = -6{,}0$, $G = 0{,}40$). Avvisi: diottrie con $f$ in centimetri; segno della lente divergente;
l'inverso dimenticato.

## Scelte

- Convenzione dei segni come chiesto per il lotto e come la lezione 33 sugli specchi: $p$ e $q$ positivi se reali, $f$
  positiva per la convergente; rimando alla lezione "Gli specchi sferici" (scritta in parallelo da un altro agente: va
  controllato che usi davvero la stessa convenzione e le stesse lettere).
- Fuochi $F$ (dalla parte dell'oggetto) e $F'$ (dall'altra parte), anche per la divergente.
- Nessuna formula dei costruttori di lenti ($1/f = (n-1)(1/R_1 - 1/R_2)$): non è del primo anno.
- L'ingrandimento $G$ come rapporto delle altezze, con il segno.

## Figure

Statiche (coordinate calcolate): `lente-convergente-fuoco`, `lente-divergente-fuoco`, `lente-costruzione-immagine-reale`
($f = 10$, $p = 30$, in scala 0,12), `lente-immagine-virtuale` ($f = 10$, $p = 5$, scala 0,15),
`lente-divergente-immagine` ($f = -10$, $p = 15$, scala 0,12). Raggi notevoli in arancione e, per il raggio per il centro,
in `blue!70!black`, come il README.

Interattiva: `lente-oggetto-immagine` (`LenteOggettoImmagine.tsx`): oggetto da trascinare da 3 a 40 cm, lente convergente
o divergente con $|f| = 10\,\text{cm}$, raggi notevoli, prolungamenti tratteggiati e immagine virtuale tratteggiata; sotto
$p$, $f$, $q$ e $G$. Guardata in chiaro, in scuro, sul telefono, con l'oggetto oltre $2F$, vicino al fuoco (immagine
fuori dalla figura, lo dice la didascalia), dentro il fuoco e con la divergente.

## Esercizi

Generatore `fis-lenti`, sei livelli: potere diottrico; immagine reale; ingrandimento o altezza dell'immagine; immagine
virtuale; lente divergente; distanza focale dalle due distanze. Scena `lente-oggetto`.

## Domande per Andrea

- Convenzione dei segni: $q < 0$ per l'immagine virtuale e $f < 0$ per la divergente (qui) va bene con il libro di classe?
- Nomi $F$ e $F'$ per i due fuochi, o $F_1$ e $F_2$?
- Il potere diottrico si chiama "potere" (qui) o "potere diottrico" e basta, con il simbolo $P$ o $D$?
- La tabella dei cinque casi della lente convergente: va tenuta tutta?
