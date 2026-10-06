# I calori molari dei gas

Generatore: `fis-calori-molari` (`src/lib/exercises/v2/generators/fis-calori-molari.ts`, con
`src/lib/exercises/v2/fis-calori-adiabatica.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_calori_molari.py`
(con `_fis_calori_adiabatica.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/112-fis-calori-molari.md`. Percorso
nel database: `high_school/physics/termodinamica/fis-calori-molari`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il calore a volume costante
2. Il calore a pressione costante
3. I gas biatomici
4. L'aumento di temperatura
5. Lavoro ed energia interna
6. Dai grammi alle moli

## Dati, tipi di risposta e cifre significative

Scelta multipla, quattro opzioni, sempre con l'unità: calori, lavori ed energie in J, aumenti di temperatura in K.
$R = 8{,}31\,\text{J/(mol}\cdot\text{K)}$ è scritto nel testo di ogni esercizio; i calori molari no, perché ricordarli è
parte dell'esercizio: $C_V = \tfrac{3}{2} R$ per un gas monoatomico, $\tfrac{5}{2} R$ per uno biatomico, e
$C_p = C_V + R$. Il testo dice sempre se il gas è monoatomico o biatomico.

Gas: elio, neon, argon (monoatomici, masse molari $4{,}00$, $20{,}2$, $39{,}9\,\text{g/mol}$); azoto, ossigeno, idrogeno
(biatomici, $28{,}0$, $32{,}0$, $2{,}02\,\text{g/mol}$). "Una bombola rigida" vuol dire volume costante; "un cilindro
chiuso da un pistone libero di muoversi", con "a pressione costante" nella domanda, vuol dire pressione costante.

I dati hanno tre cifre significative (le temperature sono kelvin interi di tre cifre, e la loro differenza si prende
esatta), e il risultato si arrotonda a tre cifre: da $1000$ in su in notazione scientifica ($2{,}28 \cdot 10^3\,\text{J}$).
Mai un risultato a meno di $10^{-6}$ da un confine di arrotondamento, e mai un risultato intero che finisce con uno
zero ($150\,\text{J}$), che avrebbe una cifra ambigua.

## Livello 1: il calore a volume costante

Un gas monoatomico in una bombola rigida, da $1{,}00$ a $4{,}00\,\text{mol}$ a passi di $0{,}05$, da una temperatura
tra $270$ e $320\,\text{K}$ a una più alta di $15$-$150\,\text{K}$. $Q = n \cdot \tfrac{3}{2} R \cdot \Delta T$.

- "Una bombola rigida contiene $1{,}10\,\text{mol}$ di argon, un gas monoatomico, a $293\,\text{K}$. Quanto calore serve
  per portarlo a $318\,\text{K}$?" Risposta $343\,\text{J}$; distrattori $571\,\text{J}$ ($C_p$ al posto di $C_V$),
  $229\,\text{J}$ (solo $R$), $4{,}36 \cdot 10^3\,\text{J}$ (la temperatura finale al posto della differenza).
- "... $2{,}00\,\text{mol}$ di argon ... a $281\,\text{K}$ ... a $307\,\text{K}$?" Risposta $648\,\text{J}$.

## Livello 2: il calore a pressione costante

Lo stesso gas monoatomico, con il pistone libero: serve la relazione di Mayer, $C_p = \tfrac{5}{2} R$.

- "Un cilindro chiuso da un pistone libero di muoversi contiene $1{,}10\,\text{mol}$ di argon, un gas monoatomico, a
  $293\,\text{K}$. Quanto calore serve per portarlo a $318\,\text{K}$ a pressione costante?" Risposta $571\,\text{J}$;
  distrattori $343\,\text{J}$ ($C_V$ al posto di $C_p$), $229\,\text{J}$ (solo $R$), $800\,\text{J}$ (il $C_p$ di un gas
  biatomico).
- "... $2{,}00\,\text{mol}$ di argon ... da $281\,\text{K}$ a $307\,\text{K}$ ..." Risposta $1{,}08 \cdot 10^3\,\text{J}$.

## Livello 3: i gas biatomici

Azoto, ossigeno o idrogeno, metà delle volte a volume costante ($\tfrac{5}{2} R$) e metà a pressione costante
($\tfrac{7}{2} R$). Stessi intervalli dei livelli 1 e 2.

- "Un cilindro chiuso da un pistone libero di muoversi contiene $2{,}35\,\text{mol}$ di azoto, un gas biatomico, a
  $273\,\text{K}$. Quanto calore serve per portarlo a $391\,\text{K}$ a pressione costante?" Risposta
  $8{,}07 \cdot 10^3\,\text{J}$; distrattori $5{,}76 \cdot 10^3\,\text{J}$ (il $C_V$, o il $C_p$ di un gas
  monoatomico), $3{,}46 \cdot 10^3\,\text{J}$ ($\tfrac{3}{2} R$), $2{,}30 \cdot 10^3\,\text{J}$ (solo $R$).
- "... $1{,}65\,\text{mol}$ di azoto ... da $274\,\text{K}$ a $320\,\text{K}$ a pressione costante?" Risposta
  $2{,}21 \cdot 10^3\,\text{J}$.

## Livello 4: l'aumento di temperatura

Formula inversa, $\Delta T = Q / (n\,C)$. Gas qualsiasi dei sei, a volume o a pressione costante; da $1{,}00$ a
$2{,}50\,\text{mol}$; calore assorbito intero tra $201$ e $999\,\text{J}$, che non finisce con zero; aumento tra $5$ e
$150\,\text{K}$.

- "Un cilindro chiuso da un pistone libero di muoversi contiene $1{,}70\,\text{mol}$ di elio, un gas monoatomico. Il gas
  assorbe $585\,\text{J}$ di calore a pressione costante. Di quanto aumenta la sua temperatura?" Risposta
  $16{,}6\,\text{K}$; distrattori $27{,}6\,\text{K}$ ($C_V$ al posto di $C_p$), $11{,}8\,\text{K}$ (gas biatomico),
  $41{,}4\,\text{K}$ (solo $R$).
- "... $1{,}30\,\text{mol}$ di neon ... assorbe $266\,\text{J}$ di calore a pressione costante ..." Risposta
  $9{,}85\,\text{K}$.

## Livello 5: lavoro ed energia interna

A pressione costante, con gli stessi dati del livello 4: metà delle volte si chiede il lavoro, $W = nR\,\Delta T$ con
$\Delta T = Q / (n\,C_p)$, cioè $W = Q \cdot R / C_p$; metà la variazione di energia interna, $\Delta U = Q - W$. I
passaggi sono quelli dell'esempio 3 della lezione.

- "Un cilindro chiuso da un pistone libero di muoversi contiene $1{,}70\,\text{mol}$ di elio, un gas monoatomico. Il gas
  assorbe $585\,\text{J}$ di calore a pressione costante. Di quanto aumenta la sua energia interna?" Risposta
  $351\,\text{J}$; distrattori $234\,\text{J}$ (il lavoro), $585\,\text{J}$ (tutto il calore), $251\,\text{J}$ (il
  rapporto con $C_V + 2R$ al denominatore).
- "... $1{,}75\,\text{mol}$ di neon ... assorbe $262\,\text{J}$ ... energia interna?" Risposta $157\,\text{J}$.

Per il lavoro i distrattori sono la variazione di energia interna, tutto il calore e $Q \cdot R / C_V$.

## Livello 6: dai grammi alle moli

Come i livelli 1-3 (gas qualsiasi, volume o pressione costante), ma il gas è dato in grammi con la sua massa molare,
e l'aumento di temperatura è dato direttamente ($15$-$150\,\text{K}$, non multiplo di 10). La massa ha tre cifre
significative e corrisponde a $0{,}5$-$5\,\text{mol}$. Il risultato deve essere lo stesso anche arrotondando le moli a
tre cifre prima del conto.

- "Un cilindro chiuso da un pistone libero di muoversi contiene $10{,}2\,\text{g}$ di elio, un gas monoatomico con massa
  molare $4{,}00\,\text{g/mol}$. Quanto calore serve per aumentare la sua temperatura di $25\,\text{K}$ a pressione
  costante?" Risposta $1{,}32 \cdot 10^3\,\text{J}$; distrattori $5{,}30 \cdot 10^3\,\text{J}$ (i grammi usati come
  moli), $795\,\text{J}$ ($C_V$ al posto di $C_p$), $530\,\text{J}$ (solo $R$).
- "... $30{,}1\,\text{g}$ di neon ... massa molare $20{,}2\,\text{g/mol}$ ... di $26\,\text{K}$ a pressione costante?"
  Risposta $805\,\text{J}$.

## Da evitare

- Risultati interi che finiscono con zero; dati con zeri finali ambigui dove si possono evitare (il calore del
  livello 4, l'aumento di temperatura del livello 6).
- Due distrattori uguali: quando due errori danno lo stesso numero (il $C_p$ di un gas monoatomico e il $C_V$ di uno
  biatomico valgono tutti e due $\tfrac{5}{2} R$) il posto libero va a un valore di riserva, $\pm 20\%$ o $\pm 40\%$.
- Temperature in gradi Celsius: qui le temperature sono in kelvin, e l'errore dei 273 aggiunti a una differenza resta
  nella lezione e nelle flashcard.

## Senza scena

L'argomento non ha una geometria che cambi con i dati: due recipienti e un numero di moli. Nessun livello ha una scena.
