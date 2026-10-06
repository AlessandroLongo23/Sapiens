# Il tempo di dimezzamento

Generatore: `chim-tempo-dimezzamento` (`src/lib/exercises/v2/generators/chim-tempo-dimezzamento.ts`, con
`src/lib/exercises/v2/chim3-c.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_tempo_dimezzamento.py`,
con `_chim3_c.py`. Lezione collegata: `docs/lezioni/chimica/riscritte/55-chim-tempo-dimezzamento.md`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Quanto resta
2. Quanto tempo serve
3. Il tempo di dimezzamento
4. Rimasto e decaduto
5. Un tempo qualunque
6. Il tempo dal logaritmo

## Dati e tipi di risposta

Scelta multipla, quattro opzioni, con l'unità nell'opzione. Il livello 4 ha per risposta un numero puro (i tempi di
dimezzamento trascorsi) e si può dare anche a risposta aperta (classificazione `V`, il valore).

Radioisotopi veri con il tempo di dimezzamento della tabella della lezione, più quattro (NUBASE2020, arrotondati come
la lezione):

| Radioisotopo | $t_{1/2}$ | Cifre |
|---|---|---|
| idrogeno-3 | $12{,}3$ anni | 3 |
| carbonio-14 | $5730$ anni | 3 |
| fluoro-18 | $110$ minuti | 2 |
| sodio-24 | $15{,}0$ ore | 3 |
| fosforo-32 | $14{,}3$ giorni | 3 |
| potassio-40 | $1{,}25 \cdot 10^9$ anni | 3 |
| cobalto-60 | $5{,}27$ anni | 3 |
| stronzio-90 | $28{,}9$ anni | 3 |
| tecnezio-99m | $6{,}0$ ore | 2 |
| iodio-131 | $8{,}0$ giorni | 2 |
| cesio-137 | $30$ anni | 2 |
| polonio-210 | $138$ giorni | 3 |
| radon-222 | $3{,}8$ giorni | 2 |
| radio-226 | $1600$ anni | 2 |
| uranio-238 | $4{,}5 \cdot 10^9$ anni | 2 |

I tempi calcolati si arrotondano alle cifre significative del tempo di dimezzamento (livelli 2 e 3) o a due cifre
(livelli 5 e 6), in notazione scientifica quando il numero in chiaro avrebbe più cifre di quelle significative; un
risultato che finirebbe con uno zero ambiguo ($90$ anni, $60$ ore) non si chiede, e nemmeno uno a meno di $10^{-6}$ da
un confine di arrotondamento. Le masse sono in mg o in g.

## Livello 1: quanto resta

Una massa iniziale $m_0$ e un tempo che è $n$ volte il tempo di dimezzamento, con $n$ da $2$ a $5$; si chiede la massa
rimasta, $m_0 : 2^n$, che è un decimale esatto. Distrattori: $m_0 : n$ (decadimento pensato lineare), $m_0 : 2n$, un
dimezzamento in meno, uno in più, la massa decaduta.

- "Un campione contiene $40\,\text{mg}$ di iodio-131, che ha un tempo di dimezzamento di $8{,}0$ giorni. Quanto
  iodio-131 resta dopo $24$ giorni?" Risposta $5\,\text{mg}$; distrattori $13{,}3\,\text{mg}$, $10\,\text{mg}$,
  $2{,}5\,\text{mg}$.
- "Un campione contiene $4{,}8\,\text{g}$ di fosforo-32, che ha un tempo di dimezzamento di $14{,}3$ giorni. Quanto
  fosforo-32 resta dopo $28{,}6$ giorni?" Risposta $1{,}2\,\text{g}$.

## Livello 2: quanto tempo serve

La frazione rimasta è $\left(\frac{1}{2}\right)^n$, con $n$ da $2$ a $5$, data a parole (un quarto, un ottavo, un
sedicesimo, un trentaduesimo) o con due masse; metà e metà (quote tra il 40% e il 60%). Risposta $n \cdot t_{1/2}$.
Distrattori: $2^n \cdot t_{1/2}$ (il denominatore preso per il numero di dimezzamenti), $(n - 1) \cdot t_{1/2}$,
$(n + 1) \cdot t_{1/2}$, $t_{1/2} : n$.

- "Il cobalto-60 ha un tempo di dimezzamento di $5{,}27$ anni. Dopo quanto tempo un campione si riduce a un ottavo
  della quantità iniziale?" Risposta $15{,}8$ anni; distrattori $42{,}2$ anni, $10{,}5$ anni, $21{,}1$ anni.
- "Il tecnezio-99m ha un tempo di dimezzamento di $6{,}0$ ore. Dopo quanto tempo un campione di $2\,\text{mg}$ si
  riduce a $0{,}25\,\text{mg}$?" Risposta $18$ ore.

## Livello 3: il tempo di dimezzamento

Due masse di un radioisotopo senza nome e il tempo trascorso, con un numero intero di dimezzamenti; il tempo di
dimezzamento è uno della tabella, scritto come in tabella. Distrattori: il tempo diviso per $2^n$, per $n - 1$, per
$n + 1$, per $2$.

- "Di $80\,\text{mg}$ di un radioisotopo ne restano $5\,\text{mg}$ dopo $60$ ore. Quanto vale il suo tempo di
  dimezzamento?" Risposta $15{,}0$ ore; distrattori $3{,}75$ ore, $20{,}0$ ore, $12{,}0$ ore.
- "Di $4{,}8\,\text{g}$ di un radioisotopo ne restano $1{,}2\,\text{g}$ dopo $28{,}6$ giorni. ..." Risposta $14{,}3$
  giorni.

## Livello 4: rimasto e decaduto

Il testo dà la parte decaduta, in percentuale ($75\%$, $87{,}5\%$, $93{,}75\%$, $96{,}875\%$) o in frazione
($\frac{3}{4}$, $\frac{7}{8}$, $\frac{15}{16}$, $\frac{31}{32}$), metà e metà; si chiede quanti tempi di dimezzamento
sono passati, da $2$ a $5$. Distrattori: uno in meno, uno in più, il denominatore, il numeratore.

- "In un campione di un radioisotopo è decaduto l'$87{,}5\,\%$ dei nuclei. Quanti tempi di dimezzamento sono
  passati?" Risposta $3$; distrattori $2$, $4$, $8$.
- "In un campione di un radioisotopo sono decaduti i $\frac{15}{16}$ dei nuclei. ..." Risposta $4$.

Gli esercizi diversi sono solo otto: il livello serve a fissare la distinzione tra rimasto e decaduto.

## Livello 5: un tempo qualunque

Un radioisotopo della tabella e un tempo con due cifre significative, tra $0{,}3$ e $4{,}7$ tempi di dimezzamento e
lontano almeno $0{,}08$ da un numero intero di dimezzamenti. Si chiede la percentuale rimasta,
$100 \cdot \left(\frac{1}{2}\right)^{t/t_{1/2}}$, a due cifre. La risposta deve restare la stessa se $n$ si arrotonda a
tre cifre, come fa la soluzione. Distrattori: la percentuale decaduta, il decadimento lineare ($100 - 50\,n$),
$100 : 2n$, la potenza con $n$ arrotondato all'intero.

- "Il cobalto-60 ha un tempo di dimezzamento di $5{,}27$ anni. Quale percentuale di un campione resta dopo $8{,}0$
  anni?" Risposta $35\,\%$; distrattori $65\,\%$, $24\,\%$, $33\,\%$, $25\,\%$.
- "Il radon-222 ha un tempo di dimezzamento di $3{,}8$ giorni. Quale percentuale di un campione resta dopo $9{,}9$
  giorni?" Risposta $16\,\%$.

## Livello 6: il tempo dal logaritmo

Dalla percentuale rimasta $p$ (intera, da $4$ a $92$, non multipla di $10$, né $25$) al tempo,
$t = t_{1/2} \cdot \log_2 \frac{100}{p}$, a due cifre. Metà delle volte è una datazione con il carbonio-14 (un reperto
di legno, di osso, di carbone, di tessuto), metà un altro radioisotopo della tabella. La risposta deve restare la
stessa se il rapporto e $n$ si arrotondano a tre cifre. Distrattori: la parte decaduta nel logaritmo, il decadimento
lineare ($t_{1/2} \cdot \frac{100 - p}{50}$), il logaritmo in base dieci, nessun logaritmo
($t_{1/2} \cdot \frac{100}{p}$).

- "In un reperto di legno la frazione di carbonio-14 è il $35\,\%$ di quella di un organismo vivo. Il carbonio-14 ha
  un tempo di dimezzamento di $5730$ anni. Qual è l'età del reperto?" Risposta $8{,}7 \cdot 10^{3}$ anni; distrattori
  $3{,}6 \cdot 10^{3}$ anni, $7{,}4 \cdot 10^{3}$ anni, $2{,}6 \cdot 10^{3}$ anni.
- "Il tecnezio-99m ha un tempo di dimezzamento di $6{,}0$ ore. Dopo quanto tempo resta il $58\,\%$ di un campione?"
  Risposta $4{,}7$ ore.

## Da evitare

- Radioisotopi con un tempo di dimezzamento diverso da quello della tabella della lezione.
- Risultati che finiscono con uno zero ambiguo, o a ridosso di un confine di arrotondamento.
- Nel livello 5, tempi così vicini a un multiplo del tempo di dimezzamento che la risposta si trova senza la
  calcolatrice.
- Nei livelli 5 e 6, numeri per cui arrotondare i passaggi intermedi cambia la risposta.
- Età con il carbonio-14 oltre i $50\,000$ anni: con $p \ge 4$ l'età massima è circa $27\,000$ anni.
