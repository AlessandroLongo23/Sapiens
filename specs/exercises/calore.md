# Calore, capacità termica e calore specifico

Generatore: `calore` (`src/lib/exercises/v2/generators/calore.ts`, con `src/lib/exercises/v2/fis-termologia.ts`). Verifica
indipendente: `scripts/exercises/checkers/calore.py` (con `_fis_termologia.py`). Lezione collegata:
`docs/lezioni/fisica/riscritte/67-calore.md`. Percorso nel database: `high_school/physics/fis-temperatura-calore/calore`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Scaldare l'acqua
2. Altre sostanze, anche che si raffreddano
3. La temperatura finale
4. Il calore specifico da una misura
5. La pentola e l'acqua
6. Le calorie

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, l'unità nell'opzione: joule ($3{,}8 \cdot 10^{5}\,\text{J}$, in notazione scientifica da
$100$ in su), $\text{J/(kg}\cdot{}^\circ\text{C)}$, $\text{J}/^\circ\text{C}$, chilogrammi, chilocalorie, gradi Celsius interi (livello
3). Masse con due cifre significative ($0{,}11$-$0{,}99$ o $1{,}1$-$9{,}9\,\text{kg}$; al livello 1 anche grammi da una lista:
$120$, $150$, ..., $750\,\text{g}$), temperature intere, calore in kilojoule con due cifre. Risultati a due cifre significative,
mai un pari merito. I calori specifici sono quelli della tabella della lezione e si danno nel testo: acqua $4186$, alcol
etilico $2440$, olio d'oliva $1970$, alluminio $897$, vetro $840$, ferro $449$, rame $385$, piombo $129$.

## Livello 1: scaldare l'acqua

Acqua da $t_i$ ($5$-$30\,^\circ\text{C}$) a $t_f$ (almeno $10$ gradi in più, al più $100\,^\circ\text{C}$); metà dei casi con la massa in
grammi.

- "Quanto calore serve per scaldare $1{,}8\,\text{kg}$ d'acqua ($c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$) da $11\,^\circ\text{C}$ a
  $61\,^\circ\text{C}$?" Risposta $3{,}8 \cdot 10^{5}\,\text{J}$; distrattori $4{,}6 \cdot 10^{5}\,\text{J}$ (la temperatura finale al
  posto di $\Delta t$), $90\,\text{J}$ ($c$ dimenticato), $3{,}8 \cdot 10^{8}\,\text{J}$ (la massa in grammi, o i grammi non
  convertiti).

## Livello 2: altre sostanze, anche che si raffreddano

Una sostanza della tabella diversa dall'acqua; metà dei casi si scalda ("quanto calore assorbe"), metà si raffredda
("quanto calore cede", la risposta senza segno, come dice la lezione). Temperature da $5$ a $250\,^\circ\text{C}$ (olio e alcol al
più $70\,^\circ\text{C}$), almeno $10$ gradi di differenza; calore di almeno $10\,\text{J}$.

- "Un campione di alluminio ($c = 897\,\text{J/(kg}\cdot{}^\circ\text{C)}$) ha la massa di $0{,}18\,\text{kg}$. Quanto calore
  assorbe passando da $13\,^\circ\text{C}$ a $138\,^\circ\text{C}$?" Risposta $2{,}0 \cdot 10^{4}\,\text{J}$; distrattori
  $9{,}4 \cdot 10^{4}\,\text{J}$ (il calore specifico dell'acqua), $2{,}2 \cdot 10^{4}\,\text{J}$ (la temperatura finale),
  $2{,}1 \cdot 10^{3}\,\text{J}$ (la temperatura iniziale).

## Livello 3: la temperatura finale

Una sostanza qualunque della tabella, a $t_i$ da $10$ a $30\,^\circ\text{C}$, riceve un calore in kilojoule con due cifre; l'aumento
va da $5$ a $150\,^\circ\text{C}$ (a $50$ per olio e alcol) e la risposta è la temperatura finale al grado.

- "Un campione di vetro ($c = 840\,\text{J/(kg}\cdot{}^\circ\text{C)}$) ha la massa di $6{,}5\,\text{kg}$ ed è a $22\,^\circ\text{C}$.
  Riceve $58\,\text{kJ}$ di calore. A quale temperatura arriva?" Risposta $33\,^\circ\text{C}$ ($\Delta t = 10{,}6\ldots$);
  distrattori $11\,^\circ\text{C}$ ($\Delta t$ dato come temperatura finale, e anche $\Delta t$ tolto), $22\,^\circ\text{C}$ (i kilojoule non
  convertiti), poi valori vicini a passi di $3$.

## Livello 4: il calore specifico da una misura

Il calore nasce da un materiale della tabella ($Q = c\,m\,\Delta t$ arrotondato a due cifre, in kilojoule), il testo non dice
quale; $t_i$ da $10$ a $30\,^\circ\text{C}$, $\Delta t$ da $10$ a $80\,^\circ\text{C}$. La risposta è il calore specifico ricavato dai dati,
a due cifre.

- "Un campione di massa $6{,}5\,\text{kg}$ riceve $3{,}8 \cdot 10^{2}\,\text{kJ}$ di calore e passa da $22\,^\circ\text{C}$ a
  $92\,^\circ\text{C}$. Quanto vale il calore specifico del suo materiale?" Risposta $8{,}4 \cdot 10^{2}\,\text{J/(kg}\cdot{}^\circ\text{C)}$;
  distrattori $0{,}84$ (i kilojoule non convertiti), $6{,}4 \cdot 10^{2}$ (la temperatura finale), $5{,}4 \cdot 10^{3}$ (la massa
  dimenticata).

## Livello 5: la pentola e l'acqua

Una pentola di alluminio, ferro o rame da $0{,}11$ a $0{,}99\,\text{kg}$ con dentro da $1{,}1$ a $5{,}0\,\text{kg}$ d'acqua. Metà dei
casi chiede la capacità termica dell'insieme, metà il calore per scaldarlo di $20$-$80\,^\circ\text{C}$.

- "Una pentola di rame ($c = 385\,\text{J/(kg}\cdot{}^\circ\text{C)}$) ha la massa di $0{,}58\,\text{kg}$ e contiene $1{,}8\,\text{kg}$
  d'acqua ($c = 4186\,\text{J/(kg}\cdot{}^\circ\text{C)}$). Quanto vale la capacità termica della pentola con l'acqua?" Risposta
  $7{,}8 \cdot 10^{3}\,\text{J}/^\circ\text{C}$; distrattori $7{,}5 \cdot 10^{3}$ (solo l'acqua), $4{,}6 \cdot 10^{3}$ (i calori specifici
  sommati, senza le masse), $1{,}0 \cdot 10^{4}$ (tutto come se fosse acqua).
- Per il calore i distrattori sono solo l'acqua, solo la pentola, tutto acqua.

## Livello 6: le calorie

Metà dei casi: un'etichetta da $80$ a $600\,\text{kcal}$ (multipli di $10$), quanti chilogrammi d'acqua scalda di $10$-$80\,^\circ\text{C}$,
con $c = 1\,\text{kcal/(kg}\cdot{}^\circ\text{C)}$. Metà: quante chilocalorie servono per scaldare dell'acqua (dati come al livello
1).

- "Sull'etichetta di un panino c'è scritto $120\,\text{kcal}$. Quanti chilogrammi d'acqua potrebbe scaldare di $51\,^\circ\text{C}$,
  se tutta l'energia andasse nell'acqua?" Risposta $2{,}4\,\text{kg}$; distrattori $0{,}0024\,\text{kg}$ (chilocalorie prese per
  calorie), $9{,}8\,\text{kg}$ (moltiplicato per $4{,}186$), $0{,}56\,\text{kg}$ (diviso per $4{,}186$).
- Per le chilocalorie i distrattori sono le calorie ($\times 1000$), i kilojoule ($\times 4{,}186$), la temperatura finale.

## Esercizi da evitare

- Olio e alcol a temperature alte (l'olio fuma, l'alcol bolle a $78\,^\circ\text{C}$): al più $70\,^\circ\text{C}$ al livello
  2 e aumenti fino a $50\,^\circ\text{C}$ al livello 3.
- Acqua oltre $100\,^\circ\text{C}$ (servirebbe il calore latente, lezione 70).
- Risposte a pari merito tra due arrotondamenti.

## Verifica

`calore.py` rilegge il testo, controlla che i calori specifici siano quelli della tabella, intervalli e cifre, ricalcola con
i razionali e confronta l'opzione giusta e il formato delle altre. Al livello 4 controlla anche che il calore specifico
ricavato sia vicino (entro il $10\%$) a quello di un materiale della tabella.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, $1000$ esercizi per livello ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 153 px su 252).

### Errori piantati

Bocciati tutti (240 su 240 per tipo): indice dell'opzione giusta, un numero del testo cambiato, testo dell'opzione giusta,
opzione doppia, parole vietate.

### Esercizi diversi su 1.000

Seed da 1: livello 1 993, livello 2 1000, livello 3 1000, livello 4 1000, livello 5 984, livello 6 987.

## Domande per la revisione

- $4186$ o $4190$ (o $4180$) per il calore specifico dell'acqua? Qui $4186$, come la lezione e la definizione della caloria.
- Il livello 2 chiede il calore ceduto senza segno: va bene, o serve un esercizio che chieda $Q$ con il segno meno?
