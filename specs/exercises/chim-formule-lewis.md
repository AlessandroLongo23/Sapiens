# Le formule di Lewis delle molecole

Generatore: `chim-formule-lewis` (`src/lib/exercises/v2/generators/chim-formule-lewis.ts`, con
`src/lib/exercises/v2/chim3-f.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_formule_lewis.py` (con
`_chim3_f.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/67-chim-formule-lewis.md`. Percorso nel database:
`high_school/chemistry/legami-chimici/chim-formule-lewis`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. I livelli da 1 a 4 chiedono un numero intero:
la risposta del campione è il numero, per la risposta aperta, e la scelta multipla si costruisce dai quattro numeri di
`params.options`. I livelli 5 e 6 sono a scelta multipla.

Una formula di Lewis non si può scrivere in una casella, e disegnarla come opzione richiederebbe una scena che oggi
non c'è: gli esercizi chiedono i numeri che decidono la formula (elettroni, coppie solitarie, coppie di legame, carica
formale), non il disegno.

## Nomi dei livelli

1. Elettroni di valenza di una molecola
2. Coppie solitarie dell'atomo centrale
3. Quante coppie di legame
4. Elettroni di valenza di uno ione
5. La carica formale
6. Le eccezioni all'ottetto

## Dati

Elettroni di valenza dal gruppo (`src/lib/tools/elementi.json`). Le molecole sono quelle della lezione, della VSEPR
(lezione 02) e della riga 4 di `docs/lezioni/chimica/confronto-atzeni.md`, più altre dello stesso tipo.

Per $\mathrm{SO_2}$, $\mathrm{SO_3}$, $\mathrm{H_2SO_4}$, $\mathrm{HClO_4}$ esistono due formule in uso (con l'ottetto
e con l'ottetto espanso). Le domande in cui la risposta dipende dalla scelta dicono "che rispetta la regola
dell'ottetto"; le altre (elettroni di valenza, coppie solitarie dell'atomo centrale) hanno la stessa risposta nei due
casi.

## Livello 1: elettroni di valenza di una molecola

Una molecola neutra tra 34 (da $\mathrm{H_2O}$ a $\mathrm{SF_6}$, compresi gli ossiacidi della lezione e
$\mathrm{N_2O_3}$). Si chiede il totale degli elettroni di valenza.

- "Quanti elettroni di valenza ha in tutto la molecola $\mathrm{H_2CO_3}$?" Risposta $24$ ($2 \cdot 1 + 4 + 3 \cdot 6$);
  distrattori $11$ (indici dimenticati), $64$ (numeri dei gruppi sommati), $32$ (tutti gli elettroni).
- "... $\mathrm{HBrO}$?" Risposta $14$; distrattori $34$, $44$, $16$.

Distrattori: gli indici dimenticati; i numeri dei gruppi (14, 15, 16, 17) al posto degli elettroni di valenza; il
numero atomico al posto degli elettroni di valenza; due in più o in meno.

## Livello 2: coppie solitarie dell'atomo centrale

Una molecola neutra con un solo atomo centrale, tra 24. Si chiede quante coppie solitarie ha l'atomo centrale nella
formula di Lewis. La risposta va da $0$ a $2$; le opzioni sono sempre $0$, $1$, $2$, $3$.

- "Nella formula di Lewis di $\mathrm{NH_3}$, quante coppie solitarie ha l'atomo centrale, l'azoto?" Risposta $1$.
- "... di $\mathrm{CO_2}$ ... il carbonio?" Risposta $0$.

I passaggi seguono il procedimento della lezione: elettroni di valenza, meno due per ogni legame dello scheletro, meno
sei per ogni atomo esterno diverso dall'idrogeno; quelli che restano vanno sull'atomo centrale.

Distrattori: le coppie solitarie contate su tutta la molecola o dimenticate (l'errore della VSEPR).

## Livello 3: quante coppie di legame

Una molecola tra 27 in cui tutti gli atomi rispettano l'ottetto. Si chiede quante coppie di legame ha la formula, con
la regola del riquadro della lezione: elettroni per gli ottetti meno elettroni di valenza, diviso due.

- "Nella formula di Lewis di $\mathrm{CO_2}$ che rispetta la regola dell'ottetto, quante coppie di legame ci sono in
  tutto? Un legame doppio conta per due, un triplo per tre." Risposta $4$; distrattori $2$ (lo scheletro), $8$ (tutte
  le coppie), $5$.
- "... di $\mathrm{C_2H_4}$ ..." Risposta $6$; distrattori $5$, $7$, $12$.

Due casi: `semplici` (i legami sono quelli dello scheletro) e `multipli` (ce ne sono di più).

Distrattori: i soli legami dello scheletro (i legami multipli dimenticati); tutte le coppie di elettroni; uno in più o
in meno.

## Livello 4: elettroni di valenza di uno ione

Uno ione poliatomico tra 20, con carica da $-3$ a $+1$. Si chiede il totale degli elettroni di valenza.

- "Quanti elettroni di valenza ha in tutto lo ione $\mathrm{CN^-}$?" Risposta $10$; distrattori $9$ (carica
  dimenticata), $8$ (segno sbagliato), $12$.
- "... $\mathrm{NH_4^+}$?" Risposta $8$; distrattori $9$, $10$, $6$.

Distrattori: la carica dimenticata; la carica contata con il segno sbagliato; due in più o in meno.

## Livello 5: la carica formale

Un atomo di una formula della lezione, descritto con le sue coppie solitarie e i suoi legami (venti casi). Si chiede la
carica formale, da $-1$ a $+3$. Opzioni: numeri interi con il segno ($+1$, $-1$, $0$).

- "Nello ione $\mathrm{CN^-}$ il carbonio ha una coppia solitaria e forma un legame triplo. Qual è la sua carica
  formale?" Risposta $-1$ ($4 - 2 - 3$); distrattori $0$, $-4$, $+1$.
- "Nello ione $\mathrm{NH_4^+}$ l'azoto non ha coppie solitarie e forma quattro legami semplici. ..." Risposta $+1$.

Distrattori: le coppie solitarie contate una volta invece di due; gli elettroni di legame contati tutti; il segno
scambiato; uno in più o in meno.

## Livello 6: le eccezioni all'ottetto

Una specie, e si chiede se l'atomo centrale rispetta la regola dell'ottetto. Quattro casi con la stessa frequenza, e
sempre le stesse quattro opzioni: "Sì", "No: ottetto incompleto", "No: ottetto espanso", "No: elettroni dispari".

- "Nella formula di Lewis di $\mathrm{BF_3}$ l'atomo centrale rispetta la regola dell'ottetto?" Risposta: "No: ottetto
  incompleto".
- "... di $\mathrm{PCl_5}$ ..." Risposta: "No: ottetto espanso".

Specie: rispettano l'ottetto 14 molecole ($\mathrm{CH_4}$, $\mathrm{NH_3}$, $\mathrm{H_2O}$, $\mathrm{CO_2}$,
$\mathrm{HCN}$ e altre con soli legami semplici); ottetto incompleto $\mathrm{BF_3}$, $\mathrm{BCl_3}$, $\mathrm{BH_3}$,
$\mathrm{BeCl_2}$, $\mathrm{BeH_2}$; ottetto espanso $\mathrm{PCl_5}$, $\mathrm{PF_5}$, $\mathrm{SF_6}$, $\mathrm{SF_4}$,
$\mathrm{ClF_3}$; elettroni dispari $\mathrm{NO}$, $\mathrm{NO_2}$, $\mathrm{ClO_2}$.

## Esercizi da evitare

- Il numero di legami doppi di $\mathrm{SO_2}$, $\mathrm{SO_3}$, $\mathrm{H_2SO_4}$, $\mathrm{HClO_4}$ senza dire quale
  formula: la risposta cambia con la convenzione.
- Al livello 6, $\mathrm{SO_2}$, $\mathrm{SO_3}$ e gli ossiacidi dello zolfo e del cloro: "rispetta l'ottetto" o
  "ottetto espanso" secondo la formula scelta.
- Al livello 2, molecole con due atomi centrali ($\mathrm{C_2H_4}$, $\mathrm{N_2O_3}$, gli ossiacidi): "l'atomo
  centrale" non è uno solo, o ha intorno gruppi $\mathrm{OH}$ che complicano il conto.
- Al livello 3, $\mathrm{BF_3}$, $\mathrm{NO}$, $\mathrm{PCl_5}$: la regola vale solo se tutti gli atomi rispettano
  l'ottetto.
- Chiedere "la formula di Lewis" tra quattro disegni: servirebbe una scena, che non c'è (vedi i limiti nel messaggio
  di consegna).

## Verifica

`chim_formule_lewis.py` legge i gruppi da `elementi.json` e ricava da sé gli elettroni di valenza. Per le coppie
solitarie usa un'altra strada, quella della lezione 02: elettroni di valenza dell'atomo centrale meno quelli che mette
nei legami (uno per idrogeno e alogeni, due per un ossigeno o uno zolfo esterno, tre per un azoto esterno), diviso due.
Per le coppie di legame applica la regola e la confronta con una tabella delle 27 formule scritta a mano. Per la carica
formale legge dal testo coppie solitarie e legami, e li confronta con una sua tabella degli atomi nelle formule della
lezione. Per le eccezioni conta gli elettroni intorno all'atomo centrale e
controlla che un ottetto espanso non capiti a un atomo del secondo periodo.

Esito (6 ottobre 2026): seed $1$, $50001$, $777001$, 6.000 esercizi ciascuno, PASS, quote dei casi dentro gli
intervalli. `review.mts` e `width.mts` con codice 0.

### Errori piantati

Su 60 esercizi (seed da 300): risposta numerica cambiata, distrattore uguale alla risposta, indice della scelta
multipla spostato, testo dell'opzione giusta scambiato, parole vietate, nessun passaggio, un numero del testo cambiato
(i dettagli nel messaggio di consegna).
