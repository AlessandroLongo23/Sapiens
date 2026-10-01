# Orbitali e numeri quantici

Generatore: `chim-orbitali-numeri-quantici` (`src/lib/exercises/v2/generators/chim-orbitali-numeri-quantici.ts`, con
`src/lib/exercises/v2/chim-atomo.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_orbitali_numeri_quantici.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/52-chim-orbitali-numeri-quantici.md`. Percorso nel database:
`high_school/chemistry/chim-struttura-elettronica/chim-orbitali-numeri-quantici`.

Cinque livelli, ognuno con una difficoltà in più. Tutto a scelta multipla, quattro opzioni. Le regole sono quelle della
lezione: $l$ da $0$ a $n - 1$; $m_l$ da $-l$ a $+l$; lettere $s$, $p$, $d$, $f$ per $l = 0, 1, 2, 3$; $2l + 1$ orbitali in
un sottolivello e $n^2$ in un livello; $n - 1$ nodi in tutto, di cui $l$ angolari e $n - l - 1$ radiali; $2$ elettroni
per orbitale, $2(2l + 1)$ per sottolivello, $2n^2$ per livello. Gli orbitali nominati arrivano fino al $4f$, i livelli
fino a $n = 5$.

## Nomi dei livelli

1. Livelli, sottolivelli e nomi
2. Quanti orbitali
3. Terne che esistono
4. I nodi di un orbitale
5. Quanti elettroni

## Livello 1: livelli, sottolivelli e nomi

Tre casi. I valori di $l$ per un livello da $2$ a $5$ (distrattori: fino a $n$, da $1$ a $n$, da $1$ a $n - 1$, da
$-(n-1)$ a $n - 1$). Il nome dell'orbitale dati $n$ (da $2$ a $4$) e $l$: i distrattori sono le altre tre lettere con lo
stesso $n$, anche quando l'orbitale non esiste. Il numero di sottolivelli di un livello da $2$ a $5$.

- "Quali valori può avere il numero quantico secondario $l$ in un orbitale del livello $n = 3$?" Risposta: $0,\ 1,\ 2$.
- "Come si chiama un orbitale con $n = 4$ e $l = 2$?" Risposta: $4d$.
- "Quanti sottolivelli ha il livello $n = 3$?" Risposta: $3$.

## Livello 2: quanti orbitali

Tre casi. I valori di $m_l$ per un orbitale con $l \geq 1$ (distrattori: da $0$ a $l$, senza lo zero, da $-(l+1)$ a
$l+1$). Gli orbitali di un sottolivello. Gli orbitali di un livello da $2$ a $5$ (distrattori: $2n^2$, $2n - 1$, $n$).

- "Quali valori può avere il numero quantico magnetico $m_l$ in un orbitale $3d$?" Risposta: $-2,\ -1,\ 0,\ +1,\ +2$.
- "Quanti orbitali ha il sottolivello $4f$?" Risposta: $7$.
- "Quanti orbitali ha in tutto il livello $n = 3$?" Risposta: $9$.

## Livello 3: terne che esistono

Metà: quattro terne $(n,\ l,\ m_l)$, una sola indica un orbitale; ognuna delle altre viola una sola regola ($l \geq n$,
oppure $|m_l| > l$, oppure $n = 0$). Metà: una terna che viola una sola regola, e si chiede quale: "$l$ deve essere minore
di $n$", "$m_l$ non può superare $l$", "$n$ non può essere zero"; il quarto, sempre sbagliato, è "$m_l$ non può essere
zero".

- "Le terne sono scritte nell'ordine $(n,\ l,\ m_l)$. Quale indica un orbitale che esiste?" con $(3,\ 2,\ -1)$,
  $(2,\ 2,\ 0)$, $(1,\ 0,\ +1)$, $(3,\ 3,\ -2)$. Risposta: $(3,\ 2,\ -1)$.
- "La terna $(2,\ 2,\ 0)$, scritta nell'ordine $(n,\ l,\ m_l)$, non indica un orbitale. Perché?" Risposta: $l$ deve
  essere minore di $n$.

## Livello 4: i nodi di un orbitale

Un orbitale dall'$1s$ al $5f$; si chiedono i nodi in tutto, quelli angolari o quelli radiali (questi il doppio delle
volte). Distrattori: gli altri due conteggi, $n$, $n - l$, $l + 1$.

- "Quanti nodi radiali ha un orbitale $4p$?" Risposta: $2$.
- "Quanti nodi in tutto ha un orbitale $3d$?" Risposta: $2$.

## Livello 5: quanti elettroni

Tre casi: un solo orbitale (sempre $2$; distrattori i numeri del suo sottolivello), un sottolivello, un livello da $1$ a
$5$.

- "Quanti elettroni può contenere al massimo il sottolivello $3d$?" Risposta: $10$.
- "Quanti elettroni può contenere al massimo il livello $n = 3$?" Risposta: $18$.
- "Quanti elettroni può contenere al massimo un solo orbitale $3d$?" Risposta: $2$.

## Da evitare

- Due opzioni scritte allo stesso modo o con lo stesso valore.
- Una terna sbagliata che viola due regole insieme: la domanda sul perché non avrebbe una sola risposta.

## Domande per la revisione

- Il simbolo del numero magnetico è $m_l$ e quello secondario "numero quantico secondario": alcuni libri scrivono $m$ e
  "numero quantico angolare" o "azimutale".
- I nodi sono nella lezione ma non in tutti i libri di scuola: il livello 4 va tenuto?
