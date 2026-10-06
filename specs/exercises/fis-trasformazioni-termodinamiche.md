# Le trasformazioni isocora, isobara e isoterma

Generatore: `fis-trasformazioni-termodinamiche`
(`src/lib/exercises/v2/generators/fis-trasformazioni-termodinamiche.ts`, con `src/lib/exercises/v2/fis-termo-pv.ts`).
Verifica indipendente: `scripts/exercises/checkers/fis_trasformazioni_termodinamiche.py` (con `_fis_termo_pv.py`).
Lezione collegata: `docs/lezioni/fisica/riscritte/111-fis-trasformazioni-termodinamiche.md`. Percorso nel database:
`high_school/physics/termodinamica/fis-trasformazioni-termodinamiche`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il calore a volume costante
2. Il lavoro a pressione costante
3. Calore ed energia interna a pressione costante
4. Il lavoro di un'espansione isoterma
5. La compressione isoterma
6. Un ciclo con tre trasformazioni

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, joule con due cifre significative e il segno nella risposta. Gas perfetto, monoatomico
dove serve l'energia interna; moli con due cifre ($0{,}11$-$0{,}99$ o $1{,}1$-$3{,}9\,\text{mol}$, mai con uno zero finale);
temperature intere in kelvin; $R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$ scritto nel testo. I risultati con il logaritmo naturale
stanno ad almeno $0{,}02$ unità dell'ultima cifra da un pari merito.

## Livello 1: il calore a volume costante

$T_A$ da $250$ a $350\,\text{K}$, $\Delta T$ da $20$ a $200\,\text{K}$. $Q = \Delta U = \tfrac{3}{2}\,n\,R\,\Delta T$.

- "Una bombola rigida contiene $2{,}6\,\text{mol}$ di gas perfetto monoatomico a $311\,\text{K}$. Quanto calore serve per portare il gas
  a $437\,\text{K}$?" Risposta $4{,}1 \cdot 10^{3}\,\text{J}$; distrattori $2{,}7 \cdot 10^{3}\,\text{J}$ (senza i $\tfrac{3}{2}$),
  $6{,}8 \cdot 10^{3}\,\text{J}$ (il coefficiente dell'isobara), $1{,}4 \cdot 10^{4}\,\text{J}$ (la temperatura finale al posto di $\Delta T$).

## Livello 2: il lavoro a pressione costante

Stessi dati. $W = n\,R\,\Delta T$.

- "In un cilindro con il pistone libero ci sono $0{,}17\,\text{mol}$ di gas perfetto, che viene scaldato a pressione costante da
  $308\,\text{K}$ a $498\,\text{K}$. Quanto lavoro compie il gas?" Risposta $2{,}7 \cdot 10^{2}\,\text{J}$; distrattori $4{,}0 \cdot 10^{2}\,\text{J}$
  ($\Delta U$), $6{,}7 \cdot 10^{2}\,\text{J}$ ($Q$), $7{,}0 \cdot 10^{2}\,\text{J}$ (la temperatura finale).

## Livello 3: calore ed energia interna a pressione costante

Stessi dati, gas monoatomico. Metà dei casi chiede il calore, $Q = \tfrac{5}{2}\,n\,R\,\Delta T$, metà la variazione di
energia interna, $\Delta U = \tfrac{3}{2}\,n\,R\,\Delta T$. I distrattori sono le altre due grandezze tra $Q$, $\Delta U$ e $W$, e
la temperatura finale al posto di $\Delta T$.

- "... $0{,}62\,\text{mol}$ ... da $345\,\text{K}$ a $392\,\text{K}$. Quanto calore assorbe il gas?" Risposta $6{,}1 \cdot 10^{2}\,\text{J}$; distrattori
  $3{,}6 \cdot 10^{2}\,\text{J}$, $2{,}4 \cdot 10^{2}\,\text{J}$, $5{,}0 \cdot 10^{3}\,\text{J}$.

## Livello 4: il lavoro di un'espansione isoterma

$T$ da $250$ a $400\,\text{K}$, $V_A$ da $1{,}0$ a $4{,}0\,\text{L}$, $V_B$ più grande di $1{,}0$-$6{,}0\,\text{L}$. $W = n\,R\,T\,\ln\frac{V_B}{V_A}$.

- "Un campione di $2{,}6\,\text{mol}$ di gas perfetto si espande alla temperatura costante di $341\,\text{K}$: il suo volume passa da
  $2{,}8\,\text{L}$ a $8{,}1\,\text{L}$. Quanto lavoro compie il gas?" Risposta $7{,}8 \cdot 10^{3}\,\text{J}$ ($7826\,\text{J}$); distrattori
  $3{,}4 \cdot 10^{3}\,\text{J}$ (il logaritmo in base dieci), $2{,}1 \cdot 10^{4}\,\text{J}$ (il rapporto senza logaritmo),
  $1{,}4 \cdot 10^{4}\,\text{J}$ ($n\,R\,T$ per la variazione relativa di volume).

## Livello 5: la compressione isoterma

Metà dei casi con i volumi in litri (da $V_A$ tra $2{,}0$ e $9{,}0\,\text{L}$ a un $V_B$ più piccolo, almeno $1{,}0\,\text{L}$), metà con
le pressioni in pascal, in notazione scientifica (da $p_A$ a un $p_B$ più grande, fino a $9{,}0 \cdot 10^{5}\,\text{Pa}$). Il lavoro
del gas è negativo: $W = n\,R\,T\,\ln\frac{V_B}{V_A} = n\,R\,T\,\ln\frac{p_A}{p_B}$.

- "Un campione di $0{,}62\,\text{mol}$ di gas perfetto viene compresso lentamente alla temperatura costante di $392\,\text{K}$: la sua
  pressione passa da $2{,}0 \cdot 10^{5}\,\text{Pa}$ a $3{,}0 \cdot 10^{5}\,\text{Pa}$. Quanto lavoro compie il gas?" Risposta
  $-8{,}2 \cdot 10^{2}\,\text{J}$; distrattori $8{,}2 \cdot 10^{2}\,\text{J}$ (il rapporto rovesciato), $-3{,}6 \cdot 10^{2}\,\text{J}$ (base dieci),
  $-1{,}3 \cdot 10^{3}\,\text{J}$ (senza logaritmo).

## Livello 6: un ciclo con tre trasformazioni

Scena `piano-pv`: volume in litri (quadretti da $0{,}5\,\text{L}$, fino a $8$), pressione in kilopascal (quadretti da $50\,\text{kPa}$, fino
a $400$). Un ciclo orario di tre tratti, con gli stati sui nodi della griglia e il volume che raddoppia, triplica o
quadruplica. Due casi in parti uguali:

- isobara in alto: $A \to B$ espansione isobara, $B \to C$ isocora, $C \to A$ compressione isoterma;
  $W = p_A\,(V_B - V_A) - p_A V_A\,\ln\frac{V_B}{V_A}$;
- isobara in basso: $A \to B$ espansione isoterma, $B \to C$ compressione isobara, $C \to A$ isocora;
  $W = p_A V_A\,\ln\frac{V_B}{V_A} - p_B\,(V_B - V_A)$.

Il testo dice che il tratto curvo è un'isoterma; i dati si leggono dal grafico, e $1\,\text{kPa} \cdot 1\,\text{L} = 1\,\text{J}$.

- $A$ ($3\,\text{L}$, $400\,\text{kPa}$), $B$ ($6\,\text{L}$, $400\,\text{kPa}$), $C$ ($6\,\text{L}$, $200\,\text{kPa}$): $1200 - 831{,}8 = 368{,}2\,\text{J}$, risposta
  $3{,}7 \cdot 10^{2}\,\text{J}$; distrattori $1{,}2 \cdot 10^{3}\,\text{J}$ (solo l'isobara), $8{,}3 \cdot 10^{2}\,\text{J}$ (solo l'isoterma),
  $2{,}0 \cdot 10^{3}\,\text{J}$ (i due lavori sommati senza segno).
- $A$ ($2\,\text{L}$, $300\,\text{kPa}$), $B$ ($6\,\text{L}$, $100\,\text{kPa}$), $C$ ($2\,\text{L}$, $100\,\text{kPa}$): $659{,}2 - 400 = 259{,}2\,\text{J}$, risposta
  $2{,}6 \cdot 10^{2}\,\text{J}$.

La scena della soluzione colora la regione racchiusa.

## Esercizi da evitare

- Temperature in gradi Celsius (la conversione è un'altra difficoltà: vedi le domande).
- Risultati a meno di $0{,}02$ unità dell'ultima cifra da un pari merito, o sotto $100\,\text{J}$ con uno zero finale.
- Cicli percorsi in senso antiorario (lavoro negativo): il segno del ciclo è il livello 6 di `fis-lavoro-termodinamico`.

## Verifica

`fis_trasformazioni_termodinamiche.py` rilegge il testo (livelli 1-5) o i dati della scena (livello 6), controlla
intervalli e formato, ricalcola con i razionali e, per i logaritmi, con SymPy a trenta cifre, e confronta l'opzione giusta
e il formato delle altre. Al livello 6 controlla che i due estremi del tratto curvo abbiano lo stesso prodotto $p\,V$.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, $1000$ esercizi per livello ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0 (opzioni al più 90 px su 252). Errori piantati (seed 1, un campione ogni
25): bocciati tutti (indice, numero del testo o dato della scena, testo dell'opzione giusta, opzione doppia, parole
vietate). Esercizi diversi su 1000 (seed da 1): 1000 ai livelli 1-5, 82 al livello 6, dove i cicli con gli stati sui nodi
della griglia sono pochi: se servono più varianti, si può infittire la griglia delle pressioni.

## Domande per la revisione

- Manca un livello con la temperatura in gradi Celsius nell'isoterma (l'errore dei kelvin è in un riquadro della
  lezione): lo aggiungiamo come livello a parte, o come metà dei casi del livello 4?
- Raffreddamenti a volume e a pressione costante (calore ceduto, lavoro negativo) non ci sono: i livelli 1-3 hanno solo
  riscaldamenti. Servono?
