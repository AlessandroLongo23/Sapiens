# Le lenti sottili

Generatore: `fis-lenti` (`src/lib/exercises/v2/generators/fis-lenti.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_lenti.py`. Lezione collegata: `docs/lezioni/fisica/riscritte/36-fis-lenti.md`. Percorso
nel database: `high_school/physics/ottica/fis-lenti`. Scena: `lente-oggetto`
(`src/components/content/exercises/scenes/LenteOggetto.tsx`).

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il potere diottrico
2. L'immagine reale
3. L'ingrandimento
4. L'immagine virtuale
5. La lente divergente
6. Dalle distanze alla distanza focale

## Convenzioni, numeri e opzioni

Le convenzioni della lezione e della lezione "Gli specchi sferici": $\frac{1}{p} + \frac{1}{q} = \frac{1}{f}$,
$G = -\frac{q}{p}$; $p > 0$; $q > 0$ per un'immagine reale (dall'altra parte), $q < 0$ per una virtuale (dalla parte
dell'oggetto); $f > 0$ per la lente convergente, $f < 0$ per la divergente; $P = 1/f$ con $f$ in metri, in diottrie.
Le distanze sono centimetri interi, costruiti all'indietro perché $q$ e $f$ vengano interi; gli ingrandimenti, le
altezze e i poteri si scrivono con due cifre significative ($-0{,}50$, $8{,}0\,\text{D}$). Le opzioni hanno l'unità
($15\,\text{cm}$, $0{,}40\,\text{D}$), gli ingrandimenti la forma $G = -2{,}0$. Nei testi dei livelli 4 e 5 si chiede
esplicitamente di scrivere il segno meno per un'immagine virtuale.

## Regole comuni

- La scena del problema disegna la lente (convergente o divergente), i due fuochi quando $f$ è dato, l'oggetto con la sua
  distanza; al livello 6 l'oggetto e l'immagine con le loro distanze, senza i fuochi (sono la risposta).
- La scena della soluzione aggiunge i raggi notevoli e l'immagine (tratteggiata se virtuale), o i fuochi al livello 6.
- Livello 1: nessuna scena.

## Livello 1: il potere diottrico

Distanze focali da una tabella che dà poteri con due cifre esatte: $5$, $10$, $12{,}5$, $20$, $25$, $40$, $50$, $125$,
$200$, $250\,\text{cm}$; convergente circa sei volte su dieci. Metà dei casi da $f$ a $P$, metà da $P$ a $f$ in
centimetri.

- "Una lente convergente ha la distanza focale di $125\,\text{cm}$. Quanto vale il suo potere?" Risposta
  $0{,}80\,\text{D}$; distrattori $0{,}0080\,\text{D}$ ($f$ in centimetri), $-0{,}80\,\text{D}$ (il segno),
  $1{,}3\,\text{D}$ ($f$ in metri non invertita).
- "Una lente ha il potere di $-2{,}5\,\text{D}$. Quanto vale la sua distanza focale, in centimetri?" Risposta
  $-40\,\text{cm}$; distrattori $40\,\text{cm}$, $-0{,}4\,\text{cm}$ (metri scritti come centimetri), $-250\,\text{cm}$.

## Livello 2: l'immagine reale

Lente convergente, $f$ da $5$ a $30\,\text{cm}$, $p = f + d$ con $d$ divisore di $f^2$, così $q = f + f^2/d$; $p$ e $q$
fino a $100\,\text{cm}$, $p \neq 2f$ escluso solo se $p = q$.

- "Un oggetto sta a $12\,\text{cm}$ da una lente convergente con distanza focale $10\,\text{cm}$." Risposta
  $60\,\text{cm}$; distrattori $2\,\text{cm}$ ($p - f$), $0{,}017\,\text{cm}$ (l'inverso dimenticato), $5{,}5\,\text{cm}$
  ($pf/(p+f)$, il segno sbagliato nell'equazione).

## Livello 3: l'ingrandimento

Immagine reale con $|G|$ tra $0{,}20$, $0{,}25$, $0{,}40$, $0{,}50$, $2$, $2{,}5$, $3$, $4$, $5$, e $p = f(|G|+1)/|G|$,
$q = f(|G|+1)$ interi. Metà dei casi chiede $G$, metà l'altezza dell'immagine di un oggetto alto da $1{,}5$ a
$8{,}0\,\text{cm}$, con il segno meno se capovolta.

- "... distanza focale $6\,\text{cm}$ ... oggetto a $9\,\text{cm}$. Quanto vale $G$?" Risposta $G = -2{,}0$; distrattori
  $G = 2{,}0$ (senza il meno), $G = -0{,}50$ e $G = 0{,}50$ ($p/q$).
- "Un oggetto alto $3{,}0\,\text{cm}$ sta a $36\,\text{cm}$ ... $f = 24\,\text{cm}$." Risposta $-6{,}0\,\text{cm}$.

## Livello 4: l'immagine virtuale

Lente convergente, oggetto dentro la distanza focale: $p = f - d$, con $d$ che divide $pf$, $|q| = pf/d$ fino a
$100\,\text{cm}$.

- "... $8\,\text{cm}$ ... $f = 16\,\text{cm}$." Risposta $-16\,\text{cm}$; distrattori $16\,\text{cm}$ (il segno), $8$ e
  $-8\,\text{cm}$ ($f - p$, $p - f$), $5{,}3\,\text{cm}$.

## Livello 5: la lente divergente

Distanza focale da $5$ a $30\,\text{cm}$ data in valore, come nella lezione; $p + |f|$ divide $p|f|$.

- "... $60\,\text{cm}$ da una lente divergente con la distanza focale di $20\,\text{cm}$." Risposta $-15\,\text{cm}$;
  distrattori $30\,\text{cm}$ (il segno di $f$ dimenticato), $15\,\text{cm}$, $-80\,\text{cm}$.

## Livello 6: dalle distanze alla distanza focale

Tre casi, circa un terzo ciascuno: immagine reale; immagine virtuale più lontana dell'oggetto (lente convergente);
immagine virtuale più vicina (lente divergente). $f = pq/(p+q)$ intero, tra $3$ e $60\,\text{cm}$ in valore.

- "Un oggetto sta a $36\,\text{cm}$ da una lente, e si vede un'immagine virtuale a $18\,\text{cm}$ dalla lente, dalla
  parte dell'oggetto." Risposta $-36\,\text{cm}$; distrattori $36\,\text{cm}$, $18\,\text{cm}$ ($p + q$), $-12\,\text{cm}$.

## Esercizi da evitare

- Due opzioni con lo stesso numero; oggetto nel fuoco; immagini oltre $100\,\text{cm}$.

## Verifica

`fis_lenti.py` rilegge il testo, ricalcola con le frazioni esatte di SymPy e confronta con l'opzione giusta; controlla
unità e forma delle opzioni, i vincoli di ogni livello, la scena (niente immagine né raggi nel problema, niente fuochi
al livello 6) e la scena della soluzione (immagine a $q$ con l'ingrandimento giusto), e le quote dei casi.

## Domande per la revisione

- Al livello 5 la distanza focale della lente divergente è data senza segno, come nell'esempio della lezione. Alcuni
  libri la danno già negativa: quale scegliere?
- Distanze in centimetri interi, senza cifre significative: va bene per le lenti?
