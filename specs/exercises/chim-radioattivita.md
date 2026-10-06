# Radioattività e decadimenti

Generatore: `chim-radioattivita` (`src/lib/exercises/v2/generators/chim-radioattivita.ts`, con
`src/lib/exercises/v2/chim3-c.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_radioattivita.py`, con
`_chim3_c.py`. Lezione collegata: `docs/lezioni/chimica/riscritte/54-chim-radioattivita.md`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Il decadimento alfa
2. Il decadimento beta meno
3. Beta più e cattura elettronica
4. La particella emessa
5. Prevedere il decadimento
6. Le famiglie radioattive

## Dati e tipi di risposta

Scelta multipla, quattro opzioni. Il livello 6 ha per risposta un numero puro e si può dare anche a risposta aperta
(classificazione `V`, il valore).

Tutti i nuclei sono veri e decadono come dice l'esercizio. I modi di decadimento vengono da NUBASE2020 (Kondev e
altri, "The NUBASE2020 evaluation of nuclear physics properties", Chinese Physics C 45, 030001, 2021): si usano solo
nuclei con un modo puro (almeno il 99,9%), tranne gli emettitori $\beta^+$, che sono i nuclei leggeri con troppi
protoni dove l'emissione del positrone prevale ma una parte dei decadimenti avviene per cattura elettronica. Gli
elenchi sono nel generatore (`ALPHA_EMITTERS`, 35 nuclei; `BETA_MINUS_EMITTERS`, 53; `BETA_PLUS_EMITTERS`, 23;
`CAPTURE_NUCLIDES`, 26; `GAMMA_EMITTERS`, tecnezio-99m e bario-137m) e, ricopiati dalla tabella, nel controllo.

Notazione della lezione: ${}^{238}_{\ 92}\mathrm{U}$, con il numero atomico allineato a destra sotto il numero di
massa; ${}^{4}_{2}\mathrm{He}$, ${}^{\ 0}_{-1}e$, ${}^{\ 0}_{+1}e$, $\gamma$; il nucleo eccitato ha la m accanto al
numero di massa, ${}^{99\mathrm{m}}_{\ 43}\mathrm{Tc}$. Simboli e nomi degli elementi sono quelli di
`src/lib/tools/elementi.json`, fino al curio. Il neutrino non compare.

## Livello 1: il decadimento alfa

Un emettitore $\alpha$ vero; si sceglie il nucleo figlio, che ha $A - 4$ e $Z - 2$. Distrattori: solo $A$ diminuito
($A - 4$, $Z$); $A$ e $Z$ diminuiti al contrario ($A - 2$, $Z - 4$); $Z$ aumentato di $2$; solo $Z$ diminuito.

- "Un nucleo di radio-226, ${}^{226}_{\ 88}\mathrm{Ra}$, emette una particella $\alpha$. Qual è il nucleo figlio?"
  Risposta ${}^{222}_{\ 86}\mathrm{Rn}$; distrattori ${}^{222}_{\ 88}\mathrm{Ra}$, ${}^{224}_{\ 84}\mathrm{Po}$,
  ${}^{222}_{\ 90}\mathrm{Th}$.
- "Un nucleo di polonio-210, ${}^{210}_{\ 84}\mathrm{Po}$, emette una particella $\alpha$. Qual è il nucleo figlio?"
  Risposta ${}^{206}_{\ 82}\mathrm{Pb}$.

## Livello 2: il decadimento beta meno

Un emettitore $\beta^-$ vero; il nucleo figlio ha lo stesso $A$ e $Z + 1$. Distrattori: $Z$ diminuito di $1$ (l'errore
più frequente, dal riquadro della lezione); $A$ diminuito di $1$; $A$ diminuito e $Z$ aumentato; tutti e due diminuiti.

- "Un nucleo di carbonio-14, ${}^{14}_{\ 6}\mathrm{C}$, decade $\beta^-$. Qual è il nucleo figlio?" Risposta
  ${}^{14}_{\ 7}\mathrm{N}$; distrattori ${}^{14}_{\ 5}\mathrm{B}$, ${}^{13}_{\ 6}\mathrm{C}$, ${}^{13}_{\ 7}\mathrm{N}$.
- "Un nucleo di iodio-131, ${}^{131}_{\ 53}\mathrm{I}$, decade $\beta^-$. Qual è il nucleo figlio?" Risposta
  ${}^{131}_{\ 54}\mathrm{Xe}$.

## Livello 3: beta più e cattura elettronica

Metà delle volte un emettitore $\beta^+$, metà un nucleo che decade per cattura elettronica (quote tra il 40% e il
60%); in tutti e due i casi il nucleo figlio ha lo stesso $A$ e $Z - 1$. Distrattori: $Z$ aumentato, come nel
$\beta^-$; $A$ aumentato di $1$ (l'elettrone catturato contato come un nucleone); $A$ diminuito di $1$; tutti e due
diminuiti.

- "Un nucleo di fluoro-18, ${}^{18}_{\ 9}\mathrm{F}$, decade $\beta^+$. Qual è il nucleo figlio?" Risposta
  ${}^{18}_{\ 8}\mathrm{O}$; distrattori ${}^{18}_{10}\mathrm{Ne}$, ${}^{19}_{\ 8}\mathrm{O}$, ${}^{17}_{\ 9}\mathrm{F}$.
- "Un nucleo di berillio-7, ${}^{7}_{4}\mathrm{Be}$, decade per cattura elettronica. Qual è il nucleo figlio?"
  Risposta ${}^{7}_{3}\mathrm{Li}$.

## Livello 4: la particella emessa

Un'equazione nucleare con il nucleo padre, il nucleo figlio e un punto interrogativo al posto della particella. Le
quattro opzioni sono sempre le stesse: ${}^{4}_{2}\mathrm{He}\ (\alpha)$, ${}^{\ 0}_{-1}e\ (\beta^-)$,
${}^{\ 0}_{+1}e\ (\beta^+)$, $\gamma$. Quote: $\alpha$, $\beta^-$ e $\beta^+$ tra il 22% e il 38% ciascuno, $\gamma$ tra
il 5% e il 16% (i nuclei eccitati della lezione sono due).

- "${}^{60}_{27}\mathrm{Co} \longrightarrow {}^{60}_{28}\mathrm{Ni} + \ ?$" Risposta ${}^{\ 0}_{-1}e\ (\beta^-)$.
- "${}^{99\mathrm{m}}_{\ 43}\mathrm{Tc} \longrightarrow {}^{99}_{43}\mathrm{Tc} + \ ?$" Risposta $\gamma$.

## Livello 5: prevedere il decadimento

Il testo dà i numeri di massa degli isotopi stabili di un elemento (27 elementi dal carbonio allo stronzio; elenco
`STABLE`, da NUBASE2020) e un isotopo radioattivo a una o due unità di massa fuori da quell'intervallo. Sopra: troppi
neutroni, $\beta^-$. Sotto: troppi protoni, $\beta^+$ o cattura elettronica. Metà e metà. Ogni isotopo usato decade
davvero così (elenco `OUTSIDE`, 105 nuclei). Opzioni fisse: $\beta^-$; $\beta^+$ o cattura elettronica; $\alpha$;
$\gamma$.

- "Gli isotopi stabili dell'elemento con $Z = 15$ hanno numero di massa $31$. Quale decadimento ti aspetti dal nucleo
  ${}^{32}_{15}\mathrm{P}$?" Risposta $\beta^-$.
- "Gli isotopi stabili dell'elemento con $Z = 8$ hanno numero di massa $16$, $17$ e $18$. Quale decadimento ti aspetti
  dal nucleo ${}^{15}_{\ 8}\mathrm{O}$?" Risposta $\beta^+$ o cattura elettronica.

Esclusi gli elementi in cui gli isotopi naturali della tavola periodica del sito non sono tutti stabili (potassio,
calcio, vanadio, germanio, selenio, rubidio), e gli isotopi che stanno tra due isotopi stabili.

## Livello 6: le famiglie radioattive

Due nuclei della stessa famiglia naturale (uranio-238, uranio-235, torio-232, rami principali), il secondo almeno tre
decadimenti dopo il primo, con almeno due decadimenti $\alpha$ e uno $\beta^-$ in mezzo. Metà delle volte si chiede il
numero di decadimenti $\alpha$, $(A_i - A_f) : 4$, metà il numero di decadimenti $\beta^-$,
$Z_f - (Z_i - 2 \cdot n_\alpha)$. Distrattori per $\alpha$: la differenza dei numeri di massa divisa per $2$, la
differenza dei numeri atomici divisa per $2$, il numero di $\beta^-$. Per $\beta^-$: la differenza dei numeri atomici,
il numero di $\alpha$, il doppio del numero di $\alpha$.

- "In una famiglia radioattiva un nucleo ${}^{238}_{\ 92}\mathrm{U}$ diventa ${}^{206}_{\ 82}\mathrm{Pb}$ con una
  serie di decadimenti $\alpha$ e $\beta^-$. Quanti sono i decadimenti $\beta^-$?" Risposta $6$; distrattori $10$,
  $8$, $16$.
- "... un nucleo ${}^{226}_{\ 88}\mathrm{Ra}$ diventa ${}^{214}_{\ 82}\mathrm{Pb}$ ... Quanti sono i decadimenti
  $\alpha$?" Risposta $3$.

## Da evitare

- Nuclei inventati, o nuclei veri fatti decadere in un modo che non è il loro.
- Nuclei che decadono in due modi con quote paragonabili (potassio-40, bismuto-212).
- Il neutrino nelle equazioni: la lezione non lo scrive.
- Nel livello 5, isotopi lontani dagli stabili, che emettono anche protoni o neutroni.
- Opzioni con un simbolo che non corrisponde al numero atomico.
