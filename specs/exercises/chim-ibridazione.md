# L'ibridazione degli orbitali

Generatore: `chim-ibridazione` (`src/lib/exercises/v2/generators/chim-ibridazione.ts`, con
`src/lib/exercises/v2/chim3-g.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_ibridazione.py` (con
`_chim3_g.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/71-chim-ibridazione.md`. Percorso nel database:
`high_school/chemistry/chim-forma-molecole/chim-ibridazione`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più. Tutto a scelta multipla, quattro opzioni.

## Nomi dei livelli

1. I tre tipi di orbitali ibridi
2. Dai domini all'ibridazione
3. L'atomo centrale con legami singoli
4. L'atomo centrale con legami multipli
5. I carboni di una catena
6. Quali orbitali formano il legame

## Livello 1: i tre tipi di orbitali ibridi

Per $sp$, $sp^2$ o $sp^3$, una di sei domande: quanti orbitali ibridi; che angolo formano; quanti orbitali $p$ non
ibridati restano; quali orbitali si mescolano; come sono disposti; quanti legami $\pi$ può formare un carbonio con
quell'ibridazione. Diciotto esercizi diversi.

- "Che angolo formano tra loro gli orbitali ibridi $sp^2$?" Risposta $120^\circ$ (distrattori $180^\circ$,
  $109{,}5^\circ$, $90^\circ$).
- "Quanti orbitali $p$ non ibridati restano a un atomo ibridato $sp$?" Risposta $2$.

## Livello 2: dai domini all'ibridazione

Un atomo descritto con il numero di atomi a cui è legato (da 1 a 4) e di coppie solitarie (da 0 a 3), con da 2 a 4
domini in tutto. Opzioni: $sp$, $sp^2$, $sp^3$, $sp^3d$.

- "Un atomo è legato a $3$ atomi e ha $1$ coppia solitaria. Qual è la sua ibridazione?" Risposta $sp^3$.
- "Un atomo è legato a $2$ atomi e non ha coppie solitarie." Risposta $sp$.

L'errore preso di mira: contare solo gli atomi legati ($sp^2$ nel primo esempio).

## Livello 3: l'atomo centrale con legami singoli

Una molecola o uno ione con solo legami singoli e atomo centrale del secondo periodo: $\mathrm{CH_4}$,
$\mathrm{CCl_4}$, $\mathrm{CF_4}$, $\mathrm{CH_3Cl}$, $\mathrm{NH_3}$, $\mathrm{NF_3}$, $\mathrm{NH_4^+}$,
$\mathrm{NH_2^-}$, $\mathrm{H_2O}$, $\mathrm{OF_2}$, $\mathrm{H_3O^+}$, $\mathrm{BF_3}$, $\mathrm{BCl_3}$,
$\mathrm{BF_4^-}$. La difficoltà in più: le coppie solitarie non sono date, vanno trovate.

- "Qual è l'ibridazione dell'azoto nella molecola $\mathrm{NH_3}$?" Risposta $sp^3$ (tre atomi e una coppia
  solitaria).
- "Qual è l'ibridazione del boro nella molecola $\mathrm{BF_3}$?" Risposta $sp^2$.

## Livello 4: l'atomo centrale con legami multipli

$\mathrm{CO_2}$, $\mathrm{CS_2}$, $\mathrm{HCN}$, $\mathrm{CH_2O}$, $\mathrm{COCl_2}$, $\mathrm{CH_2{=}CH_2}$,
$\mathrm{HC{\equiv}CH}$, $\mathrm{CO_3^{2-}}$, $\mathrm{NO_3^-}$, $\mathrm{NO_2^-}$, $\mathrm{HN{=}NH}$. La
difficoltà in più: un legame doppio o triplo è un solo dominio.

- "Qual è l'ibridazione del carbonio nella molecola $\mathrm{CO_2}$?" Risposta $sp$ (errore tipico $sp^3$: quattro
  coppie di legame).
- "Qual è l'ibridazione di ciascun carbonio nella molecola $\mathrm{CH_2{=}CH_2}$?" Risposta $sp^2$.

## Livello 5: i carboni di una catena

Una catena di due, tre o quattro carboni con legami doppi o tripli, in formula condensata (undici molecole, dal
propene al 2-butino). Si chiede l'ibridazione di ogni carbonio, da sinistra a destra.

- $\mathrm{CH_3{-}CH{=}CH_2}$: $sp^3,\ sp^2,\ sp^2$.
- $\mathrm{CH_2{=}C{=}CH_2}$: $sp^2,\ sp,\ sp^2$.

Distrattori: una sola ibridazione per tutta la molecola (l'errore del riquadro della lezione: l'ibridazione è di un
atomo, non della molecola), l'ordine rovesciato, ogni ibridazione spostata di uno, tutti $sp^3$.

## Livello 6: quali orbitali formano il legame

Dodici legami delle molecole della lezione: C–H di metano, etene ed etino; N–H dell'ammoniaca; O–H dell'acqua; il
$\sigma$ tra i carboni di etano, etene ed etino; il $\pi$ dell'etene e dell'etino; il legame tra il primo e il secondo
carbonio di propene e propino.

- "Quali orbitali si sovrappongono in un legame $\mathrm{C{-}H}$ dell'etene, $\mathrm{CH_2{=}CH_2}$?" Risposta $sp^2$
  e $1s$.
- "... nel legame $\pi$ dell'etene?" Risposta $p$ e $p$ (distrattori: due ibridi uguali).

## Esercizi da evitare

- Atomi centrali del terzo periodo o oltre ($\mathrm{H_2S}$, $\mathrm{PCl_3}$, $\mathrm{SO_2}$): la lezione dice che
  per loro la regola è un'approssimazione grossolana.
- Atomi terminali (l'ossigeno di $\mathrm{CO_2}$, l'azoto di $\mathrm{HCN}$): la lezione assegna l'ibridazione solo
  all'atomo centrale e ai carboni di una catena.
- Molecole con cinque o sei domini: $sp^3d$ compare solo come opzione sbagliata.
- $\mathrm{BeCl_2}$ e $\mathrm{BeH_2}$: la lezione non li usa.

## Verifica

`chim_ibridazione.py` ha una sola regola (domini → ibridazione, e $4$ meno gli ibridi per gli orbitali $p$ rimasti).
Per le molecole dei livelli 3 e 4 non ha le coppie solitarie in tabella: le conta dagli elettroni di valenza, dalla
carica e dagli ordini di legame, come la lezione sulla VSEPR. Per le catene del livello 5 ricava l'ibridazione di ogni
carbonio per un'altra strada, dai legami $\pi$ a cui partecipa ($0$, $1$ o $2$), dopo aver controllato che ogni
carbonio abbia quattro legami. Nel livello 6 ricava gli orbitali dalla molecola scritta nella domanda, e boccia una
domanda su un legame $\pi$ che la molecola non ha.
