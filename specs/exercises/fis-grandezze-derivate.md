# Grandezze derivate: area, volume e densità

Generatore: `fis-grandezze-derivate` (`src/lib/exercises/v2/generators/fis-grandezze-derivate.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_grandezze_derivate.py`. Lezione collegata:
`docs/lezioni/fisica/riscritte/03-fis-grandezze-derivate.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni e l'unità nell'opzione (`answer.kind = 'choice'`).

## Nomi dei livelli

1. Unità di area e volume
2. Il volume dai dati
3. La densità
4. Densità e unità
5. Massa e volume dalla densità
6. Riconoscere il materiale

## Regole comuni

- Numeri e unità come nella lezione: `$2700\,\text{kg/m}^3$`, `$2{,}7\,\text{g/cm}^3$`, `$36\,\text{cm}^3$`,
  `$0{,}29\,\text{L}$`; migliaia con `\,` da cinque cifre.
- Densità dalla tabella della lezione (olio d'oliva $0{,}92$, ghiaccio $0{,}917$, acqua $1$, vetro $2{,}5$, alluminio
  $2{,}7$, ferro $7{,}87$, rame $8{,}96$, piombo $11{,}3$, oro $19{,}3\,\text{g/cm}^3$) o, ai livelli 3 e 4, una densità
  con due o tre cifre significative. Si costruisce all'indietro: densità e volume, poi la massa.
- Risposte con al più quattro decimali; un distrattore non ha più decimali della risposta (almeno due), tranne nelle
  conversioni (livelli 1 e 4), dove $0{,}00072$ al posto di $720$ è proprio l'errore da riconoscere. Un distrattore che
  non finisce (la massa divisa per il volume al contrario) si arrotonda a tre cifre significative.
- Niente trattini lunghi e niente "piuttosto che".

## Livello 1: unità di area e volume

Area (circa 40%) tra $\text{km}^2$, $\text{m}^2$, $\text{dm}^2$, $\text{cm}^2$, $\text{mm}^2$; volume (circa 60%) tra
$\text{m}^3$, $\text{dm}^3$, $\text{cm}^3$, $\text{mm}^3$, $\text{L}$, $\text{mL}$, $\text{hL}$. Dato con una, due o tre
cifre significative e al più tre decimali; risposta al più con quattro decimali e non oltre $10^7$. Distrattori: il
fattore delle lunghezze (un passo di $10$ al posto di $100$ o $1000$), il verso sbagliato, un passo in più o in meno.

Esempio: "Esprimi $0{,}29\,\text{L}$ in $\text{mm}^3$." Risposta $290\,000\,\text{mm}^3$; distrattori $29\,\text{mm}^3$,
$2900\,\text{mm}^3$, $0{,}00000029\,\text{mm}^3$.

## Livello 2: il volume dai dati

Tre casi, un terzo ciascuno:

- parallelepipedo con due spigoli in $\text{cm}$ e uno in $\text{m}$ o in $\text{mm}$, volume chiesto in $\text{cm}^3$,
  $\text{dm}^3$, $\text{L}$ o $\text{m}^3$ (come l'esempio 1 della lezione); distrattore principale il prodotto dei
  numeri così come sono, poi fattori $10$ e $1000$ sbagliati;
- cubo con lo spigolo in $\text{cm}$, volume in $\text{cm}^3$ o in $\text{L}$; distrattori la superficie ($6\ell^2$), tre
  volte lo spigolo, il fattore $100$ al posto di $1000$;
- volume per immersione: le due letture del cilindro graduato in $\text{mL}$, il volume in $\text{cm}^3$; distrattori la
  seconda lettura, la prima, la somma.

## Livello 3: la densità

Massa e volume in unità che si accordano, $\text{g}$ e $\text{cm}^3$ o $\text{kg}$ e $\text{m}^3$ (metà ciascuno);
risposta $d = \dfrac{m}{V}$ nell'unità corrispondente. Distrattori: $\dfrac{V}{m}$, $m \cdot V$, il fattore $1000$ tra le
due unità, un fattore $10$.

Esempio: "Un oggetto ha la massa di $3384{,}1\,\text{kg}$ e il volume di $0{,}43\,\text{m}^3$." Risposta
$7870\,\text{kg/m}^3$; distrattore $7{,}87\,\text{kg/m}^3$.

## Livello 4: densità e unità

Due casi, metà ciascuno:

- da $\text{g/cm}^3$ a $\text{kg/m}^3$ o viceversa; distrattori il fattore $1000$ al contrario, $100$, $10^6$, $10$;
- massa e volume da convertire prima di dividere: massa in grammi e volume in litri, oppure massa in chilogrammi e
  volume in $\text{cm}^3$; densità chiesta in $\text{kg/m}^3$. Distrattori i numeri divisi così come sono, il fattore
  $1000$ sbagliato.

## Livello 5: massa e volume dalla densità

Un materiale della tabella. Metà massa, metà volume:

- $m = d \cdot V$ con la densità in $\text{kg/m}^3$ e il volume in litri (sempre per olio e acqua) o in $\text{cm}^3$:
  massa in chilogrammi, come l'esempio 3 della lezione; distrattori il volume non convertito, $\dfrac{d}{V}$, fattori
  $1000$;
- $V = \dfrac{m}{d}$ con massa in grammi e densità in $\text{g/cm}^3$ (solo solidi): volume in $\text{cm}^3$;
  distrattori $m \cdot d$, $\dfrac{d}{m}$.

## Livello 6: riconoscere il materiale

Un oggetto di vetro, alluminio, ferro, rame, piombo o oro: la massa in grammi con un decimale (con un'imprecisione fino
allo $0{,}8\%$, come una bilancia vera) e le due letture del cilindro graduato. Si calcola $d = \dfrac{m}{V_2 - V_1}$ e si
sceglie tra quattro materiali, ognuno con la sua densità nell'opzione. La densità misurata è entro l'$1\%$ di quella del
materiale giusto e almeno al $10\%$ da quella degli altri tre (per questo vetro e alluminio non compaiono insieme).

Esempio: "Un oggetto di metallo o di vetro ha la massa di $47{,}5\,\text{g}$. In un cilindro graduato l'acqua passa da
$60\,\text{mL}$ a $79\,\text{mL}$ quando lo si immerge. Di che materiale è fatto?" Risposta: vetro
($2{,}5\,\text{g/cm}^3$).

## Esercizi da evitare

- Volumi e masse con più di quattro decimali, distrattori negativi o uguali alla risposta.
- Un oggetto di acqua o di olio nel caso del volume; materiali che galleggiano al livello 6.
- Al livello 6 due materiali con densità vicine tra le opzioni.

## Verifica

`scripts/exercises/checkers/fis_grandezze_derivate.py` rilegge dal testo misure e unità, porta tutto in unità del SI con
le potenze di dieci della lezione ($1\,\text{L} = 10^{-3}\,\text{m}^3$, $1\,\text{g} = 10^{-3}\,\text{kg}$) e ricalcola la
risposta in aritmetica esatta; controlla che le densità dei materiali siano quelle della tabella, al livello 6 la
distanza della densità misurata dalle opzioni, e poi opzioni, scrittura dei numeri e quote dei casi.

## Domande per la revisione

- La densità si scrive $d$, come nell'Amaldi; altri libri usano $\rho$. Quale?
- Livello 4: $\dfrac{\text{g}}{\text{L}}$ è numericamente uguale a $\dfrac{\text{kg}}{\text{m}^3}$, e chi divide i numeri così
  come sono trova la risposta giusta senza convertire. La lezione non lo dice: aggiungerlo come trucco, o cambiare il
  caso con la massa in chilogrammi e il volume in millilitri?
- Livello 6: la densità del vetro cambia molto da un vetro all'altro ($2{,}4$-$2{,}8$); tenerlo o toglierlo?
