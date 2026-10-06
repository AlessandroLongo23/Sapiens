# Teoria del legame di valenza: legami sigma e pi greco

Generatore: `chim-legame-valenza` (`src/lib/exercises/v2/generators/chim-legame-valenza.ts`, con
`src/lib/exercises/v2/chim3-g.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_legame_valenza.py` (con
`_chim3_g.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/70-chim-legame-valenza.md`. Percorso nel database:
`high_school/chemistry/chim-forma-molecole/chim-legame-valenza`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutti hanno la scelta multipla con quattro
opzioni; i livelli 4 e 5 hanno come risposta un numero puro e possono andare a risposta aperta.

## Nomi dei livelli

1. Quali orbitali si sovrappongono
2. Legame sigma e legame pi greco
3. Singolo, doppio e triplo
4. Contare i legami pi greco
5. Contare i legami sigma
6. Sigma e pi greco insieme

## Livello 1: quali orbitali si sovrappongono

Una molecola biatomica fatta di idrogeno e alogeni ($\mathrm{H_2}$, $\mathrm{HF}$, $\mathrm{HCl}$, $\mathrm{HBr}$,
$\mathrm{HI}$, $\mathrm{F_2}$, $\mathrm{Cl_2}$, $\mathrm{Br_2}$, $\mathrm{I_2}$, $\mathrm{ClF}$, $\mathrm{BrF}$,
$\mathrm{BrCl}$, $\mathrm{ICl}$, $\mathrm{IBr}$). Il testo dà la configurazione degli alogeni (da `elementi.json`).
Si chiede quali orbitali si sovrappongono: per ogni atomo quello con l'elettrone spaiato.

- "Quali orbitali si sovrappongono nel legame della molecola $\mathrm{HCl}$? Il cloro ha configurazione
  $[\text{Ne}]\,3s^2\,3p^5$." Risposta: $1s$ di H e $3p$ di Cl.
- "... della molecola $\mathrm{F_2}$? Il fluoro ha configurazione $[\text{He}]\,2s^2\,2p^5$." Risposta: $2p$ e $2p$.

Distrattori: l'orbitale $s$ pieno dello stesso livello ($3s$ del cloro), il livello sbagliato ($4p$), due orbitali $s$,
i livelli dei due atomi scambiati.

## Livello 2: legame sigma e legame pi greco

Quindici domande fisse della lezione, ognuna con la risposta e tre distrattori: come si sovrappongono gli orbitali nel
$\sigma$ e nel $\pi$; quali orbitali fanno un $\pi$; che legame danno $s$ con $s$, $s$ con $p$, $p$ con $p$ di testa e
di fianco; quale è più forte; attorno a quale legame si ruota; quante coppie ha un $\pi$; quanti $\sigma$ tra due
atomi; lo spin dei due elettroni; quanti legami forma un atomo; dove sta la sovrapposizione del $\sigma$; se un
orbitale $s$ può fare un $\pi$.

- "Due orbitali $p$ paralleli si sovrappongono di fianco. Che legame formano?" Risposta: un legame $\pi$
  (distrattori: un legame $\sigma$, nessun legame, due legami $\pi$).
- "Quante coppie di elettroni contiene un legame $\pi$?" Risposta: una.

## Livello 3: singolo, doppio e triplo

Un legame tra due atomi scritto con il suo simbolo ($\mathrm{C{-}H}$, $\mathrm{C{=}O}$, $\mathrm{C{\equiv}N}$,
$\mathrm{N{\equiv}N}$ e altri: sei singoli, sei doppi, tre tripli). Si chiede di quali legami è fatto. Un quarto dei
casi singoli, il resto diviso tra doppi e tripli.

- "Di quali legami è fatto il legame $\mathrm{C{=}O}$?" Risposta $1\,\sigma$ e $1\,\pi$; distrattori $2\,\sigma$,
  $2\,\pi$, $1\,\sigma$ e $2\,\pi$.
- "... il legame $\mathrm{N{\equiv}N}$?" Risposta $1\,\sigma$ e $2\,\pi$; distrattori $3\,\sigma$, $2\,\sigma$ e
  $1\,\pi$, $3\,\pi$.

## Livello 4: contare i legami pi greco

Una molecola a catena aperta scritta in formula condensata, da un elenco di diciannove (da $\mathrm{N{\equiv}N}$ a
$\mathrm{CH_2{=}CH{-}C{\equiv}N}$). Quanti legami $\pi$? Risposta: un numero da $0$ a $4$.

- $\mathrm{CH_3{-}C{\equiv}CH}$: $2$.
- $\mathrm{CH_2{=}CH{-}CH{=}CH_2}$: $2$.

Distrattori: il numero di legami multipli (un triplo contato come un $\pi$), i trattini dei legami multipli (un doppio
contato come due $\pi$), uno in più o in meno, il numero dei $\sigma$.

## Livello 5: contare i legami sigma

Le stesse molecole. Quanti legami $\sigma$? La difficoltà in più sono i legami con l'idrogeno che la formula condensata
non disegna.

- $\mathrm{CH_2{=}CH_2}$: $5$ (un legame disegnato più quattro C–H).
- $\mathrm{CH_3{-}CH{=}CH_2}$: $8$.

Distrattori: solo i legami disegnati (idrogeni dimenticati), $\sigma + \pi$ (un doppio contato come due $\sigma$), i
disegnati più i $\pi$, uno in più o in meno.

## Livello 6: sigma e pi greco insieme

Le molecole con almeno un legame multiplo. Risposta: la coppia, "$5\,\sigma$ e $1\,\pi$".

- $\mathrm{H{-}C{\equiv}N}$: $2\,\sigma$ e $2\,\pi$.
- $\mathrm{CH_3{-}CH{=}O}$: $6\,\sigma$ e $1\,\pi$.

Distrattori: gli errori dei livelli 4 e 5 combinati, e i due numeri scambiati.

## Esercizi da evitare

- Molecole con anelli (il conto "atomi meno uno" non vale) e molecole la cui formula di Lewis ha più versioni
  ($\mathrm{SO_2}$, $\mathrm{SO_3}$, $\mathrm{H_2SO_4}$, gli ioni con risonanza).
- $\mathrm{O_2}$ nel livello 1: la teoria del legame di valenza non ne spiega il comportamento, e la lezione non lo
  tratta. Compare solo nei conteggi, come O=O.
- Molecole descritte con orbitali ibridi nel livello 1: sono della lezione sull'ibridazione.

## Risposta aperta

Livelli 4 e 5: la risposta è un numero intero, corretta sul valore (`V`).

## Verifica

`chim_legame_valenza.py`: nel livello 1 ricava l'orbitale semipieno dalla configurazione stampata nel testo, dopo
averla confrontata con una tabella sua; il livello 2 ha una chiave delle risposte scritta dalla lezione; il livello 3
legge l'ordine dal simbolo del legame. Nei livelli 4, 5 e 6 conta i legami dalla formula condensata per due strade: i
$\sigma$ sono gli atomi meno uno, i $\pi$ sono i doppi più due volte i tripli, e i $\pi$ devono coincidere con il
grado di insaturazione $(2C + 2 + N - H - X)/2$ calcolato dai soli atomi. Quote del livello 3: singolo dal 15 al 35%,
doppio e triplo dal 28 al 48% ciascuno.
