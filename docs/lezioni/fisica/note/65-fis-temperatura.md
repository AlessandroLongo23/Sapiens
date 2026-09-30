# Note: La temperatura e le scale termometriche

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 19, 30 settembre 2026). Conti rifatti in Python: taratura
$(7{,}2 - 3{,}0)/15{,}0 \cdot 100 = 28\,^\circ\text{C}$, $7{,}2/18{,}0 \cdot 100 = 40$; $-196 + 273 = 77$, $310 - 273 = 37$;
$\frac{5}{9}(101 - 32) = 38{,}33$, $\frac{9}{5} \cdot 37 + 32 = 98{,}6$, $\frac{5}{9} \cdot 101 - 32 = 24{,}1$; $t = \frac{9}{5}t + 32 \Rightarrow
t = -40$; $100 \cdot 5/9$ per il grado Fahrenheit. `check.mts` passa (tre avvisi sui titoli "La scala Celsius", "La scala
Kelvin", "La scala Fahrenheit": sono nomi propri, lasciati).

## Struttura

Temperatura e sensazione termica (le tre bacinelle, ferro e legno, link a conduzione); il termometro a liquido (volume,
capillare, link a dilatazione), l'equilibrio termico e la prontezza (link alla lezione 68 e alla 04); la taratura con i
punti fissi in tre passi, la figura, perché i punti fissi funzionano (link ai passaggi di stato), la proporzione e
l'esempio 1, l'avviso sullo zero della colonna; la scala Celsius (lo zero è una scelta, i rapporti non hanno senso, le
differenze sì); la scala Kelvin (zero assoluto, $T = t + 273{,}15$ e $273$ con i dati interi, niente segno di grado,
$\Delta T = \Delta t$), l'avviso sul $+273$ sulle differenze, l'esempio 2, la nota sulla definizione del kelvin dal 2019;
la scala Fahrenheit (punti fissi $32$ e $212$, le due formule), la figura delle tre scale, l'esempio 3, l'avviso sul $32$,
il $-40$; la figura interattiva.

## Scelte

- Temperatura Celsius $t$, assoluta $T$, Fahrenheit $t_F$ (il README non dice come si chiama la Fahrenheit: $t_F$ è una mia
  scelta).
- La scala Celsius come "scala tarata con i punti fissi" $0$ e $100$. Date da Wikipedia (inglese), "Celsius" e
  "Fahrenheit", lette il 30 settembre 2026: Celsius propose la sua scala nel 1742, rovesciata ($0$ all'ebollizione), e
  Jean-Pierre Christin la girò nel 1743; Fahrenheit propose la sua nel 1724. La lezione lo dice in una parentesi, senza
  il nome di Christin.
- La definizione del kelvin del 2019 con la costante di Boltzmann (BIPM, "Le Système international d'unités", nona edizione,
  2019): in un riquadro `ad-note`, senza il valore della costante.
- Il principio zero e l'equilibrio termico sono della lezione 68 (gruppo 20): qui un link, e la frase "il termometro segna
  la sua temperatura".
- "Ci si può avvicinare moltissimo, ma non raggiungerlo" per lo zero assoluto: il terzo principio non è nominato.

## Figure

Due TikZ, guardate in chiaro e in scuro. `termometro-taratura-punti-fissi`: in scala $0{,}25$ (la colonna di $3{,}0$ cm
nel ghiaccio a $0{,}75$, i $18{,}0$ cm a $4{,}5$, la lettura $7{,}2$ cm a $1{,}8$), con le nove tacche intermedie ogni $10$
gradi; il liquido `red!50` (alcol colorato). `scale-celsius-kelvin-fahrenheit`: tre scale con l'altezza proporzionale alla
temperatura Celsius ($0{,}03$ cm per grado: $100$, $37$, $0$ e $-40\,^\circ\text{C}$ a $3$, $1{,}11$, $0$, $-1{,}2$).

Interattiva `termometro-tre-scale` (`fisica/TermometroScale.tsx`): il termometro senza scala, due bottoni lo mettono nel
ghiaccio fondente e nell'acqua bollente (un recipiente con cubetti di ghiaccio o bolle) e segnano i punti fissi; dopo il
secondo segno compaiono le nove tacche e le tre scale, ognuna con le sue tacche tonde (Celsius ogni $10$, numeri ogni
$20$; Kelvin ogni $10\,\text{K}$ da $240$ a $380$; Fahrenheit ogni $10$, numeri ogni $40$), una linea arancione all'altezza
della colonna e le tre letture sotto. Cursore da $-40$ a $110\,^\circ\text{C}$. Guardata in chiaro, in scuro, al telefono,
dopo la taratura e a $-40$.

## Esercizi

Generatore `fis-temperatura`, cinque livelli (specifica in `specs/exercises/fis-temperatura.md`): Celsius e kelvin, le
differenze di temperatura, da Celsius a Fahrenheit, da Fahrenheit a Celsius, la taratura del termometro. Nessuna scena.

## Domande per Andrea

- $T = t + 273{,}15$ nella teoria e $273$ negli esercizi con i dati interi: è la scelta del libro, o l'Amaldi usa sempre
  $273$ (o sempre $273{,}15$)?
- Il simbolo della temperatura Fahrenheit: $t_F$ va bene? E la Fahrenheit serve, o nel libro è solo una curiosità?
- La taratura con la proporzione sulla lunghezza della colonna è negli esercizi dell'Amaldi del secondo anno, o è troppo?
- La nota sulla definizione del kelvin del 2019: la teniamo, o al secondo anno è di troppo?
- Nella figura delle tre scale ho messo $98{,}6\,^\circ\text{F}$ per il corpo umano ($37\,^\circ\text{C}$): va bene un valore con
  il decimale in una figura?
