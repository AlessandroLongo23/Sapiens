# La legge di Boyle

Generatore: `chim-legge-boyle` (`src/lib/exercises/v2/generators/chim-legge-boyle.ts`, con
`src/lib/exercises/v2/chim-gas.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_legge_boyle.py` (con
`_chim_gas.py`). Lezione collegata: `docs/lezioni/chimica/riscritte/31-chim-legge-boyle.md`. Percorso nel database:
`high_school/chemistry/chim-gas/chim-legge-boyle`. Scena del livello 4: `grafico-dati`.

Sei livelli, ognuno con una difficoltà in più.

## Nomi dei livelli

1. La pressione finale
2. Il volume finale
3. Unità diverse
4. Dal grafico pressione-volume
5. La bolla del sub
6. Di quanto per cento

## Tipi di risposta

Scelta multipla, quattro opzioni con l'unità. $p_1 V_1 = p_2 V_2$ con le due pressioni nella stessa unità e i due volumi
nella stessa unità, come la lezione. Cifre significative dei dati; percentuali al punto intero.

## Livello 1: la pressione finale

$p_1$ da $1{,}1$ a $4{,}9\,\text{atm}$, $V_1$ e $V_2$ da $1{,}1$ a $9{,}9\,\text{L}$, diversi; risposta con due cifre tra
$0{,}1$ e $99\,\text{atm}$. Distrattori: il rapporto dei volumi rovesciato, il prodotto dei tre dati, la differenza dei
volumi.

- "Un gas occupa $3{,}6\,\text{L}$ alla pressione di $2{,}7\,\text{atm}$. A temperatura costante il suo volume diventa
  $4{,}5\,\text{L}$. Quale pressione ha il gas?" Risposta $2{,}2\,\text{atm}$; distrattori $3{,}4$, $44$, $2{,}4\,\text{atm}$.
- "... $3{,}2\,\text{L}$ ... $3{,}5\,\text{atm}$ ... $3{,}1\,\text{L}$ ..." Risposta $3{,}6\,\text{atm}$.

## Livello 2: il volume finale

Pressioni in mmHg o in kPa ($101$-$999$, tre cifre), $V_1$ da $1{,}01$ a $9{,}99\,\text{L}$; risposta con tre cifre.
Distrattori: il rapporto delle pressioni rovesciato, $p_1 V_1$ non diviso.

- "Un campione di gas occupa $4{,}44\,\text{L}$ alla pressione di $502\,\text{mmHg}$. A temperatura costante la pressione
  diventa $355\,\text{mmHg}$ ..." Risposta $6{,}28\,\text{L}$; distrattori $3{,}14$, $2{,}23 \cdot 10^3\,\text{L}$.
- "... $2{,}85\,\text{L}$ ... $313\,\text{kPa}$ ... $303\,\text{kPa}$ ..." Risposta $2{,}94\,\text{L}$.

## Livello 3: unità diverse

Metà: $V_1$ in mL ($101$-$999$), $V_2$ in L ($1{,}10$-$9{,}90$), si chiede $p_2$ in atmosfere (tre cifre); distrattori
con millilitri e litri mescolati. Metà: $p_1$ in atmosfere ($1{,}00$-$3{,}00$), $p_2$ in mmHg, si chiede $V_2$ (due
cifre); distrattori con atmosfere e mmHg mescolati, $101{,}3$ al posto di $760$.

- "Una siringa contiene $355\,\text{mL}$ di gas alla pressione di $1{,}89\,\text{atm}$ ... fino a occupare
  $4{,}46\,\text{L}$ ..." Risposta $0{,}150\,\text{atm}$; distrattori $150\,\text{atm}$, $23{,}7$, $0{,}0237\,\text{atm}$.
- "Un gas occupa $2{,}9\,\text{L}$ alla pressione di $1{,}47\,\text{atm}$ ... diventa $303\,\text{mmHg}$ ..." Risposta
  $11\,\text{L}$; distrattore $0{,}014\,\text{L}$ (unità mescolate).

## Livello 4: dal grafico pressione-volume

La scena disegna tre-cinque punti di un'isoterma ($p \cdot V$ uguale a $2$, $3$, $4$, $6$, $8$ o $12\,\text{atm} \cdot
\text{L}$), sulla quadrettatura ($0{,}5\,\text{atm}$ per quadretto), con la curva. Si chiede la pressione a un volume che
non è tra i punti. Distrattori: una proporzionalità diretta da un punto, la pressione del punto più vicino, il prodotto
letto un quadretto più su.

- Punti $(3; 4)$, $(4; 3)$, $(6; 2)$, $(8; 1{,}5)$, volume $5\,\text{L}$: risposta $2{,}4\,\text{atm}$.
- Isoterma $p V = 3$, volume $4\,\text{L}$: risposta $0{,}75\,\text{atm}$.

## Livello 5: la bolla del sub

Profondità multipla di $5\,\text{m}$ fino a $40\,\text{m}$; sott'acqua $1\,\text{atm}$ ogni $10\,\text{m}$ più
$1{,}0\,\text{atm}$ dell'aria (scritto nel testo). Metà: una bolla sale in superficie; metà: un palloncino scende.
Distrattori: l'aria sopra l'acqua dimenticata, il rapporto rovesciato, i metri presi per atmosfere.

- "Un sub, a $20\,\text{m}$ di profondità, espira una bolla d'aria di $3{,}6\,\text{cm}^3$ ..." Risposta $11\,\text{cm}^3$;
  distrattori $7{,}2\,\text{cm}^3$ (l'aria dimenticata), $1{,}2$, $72\,\text{cm}^3$.
- "Un palloncino contiene $2{,}4\,\text{L}$ d'aria in superficie ... a $30\,\text{m}$ ..." Risposta $0{,}60\,\text{L}$.

## Livello 6: di quanto per cento

Metà: il volume diminuisce del $10$, $20$, $25$, $30$, $40$, $50$, $60$, $75$ o $80\%$, e si chiede di quanto aumenta la
pressione, $100x/(100-x)$; metà: il volume aumenta del $10$, $20$, $25$, $50$, $100$, $150$, $200$ o $300\%$, e si chiede
di quanto diminuisce, $100x/(100+x)$. Distrattori: la stessa percentuale del volume, il complemento a $100$, la formula
dell'altro verso.

- Diminuisce del $40\%$: risposta $67\%$; distrattori $40$, $60$, $29\%$.
- Aumenta del $20\%$: risposta $17\%$; distrattori $20$, $83$, $25\%$.

## Esercizi da evitare

- Volumi iniziale e finale uguali; risultati con uno zero finale ambiguo; percentuali che finiscono in $,5$.

## Verifica

`chim_legge_boyle.py` rilegge il testo, ricalcola con i razionali di SymPy, controlla le cifre dei dati, al livello 4
legge i punti della scena e controlla che stiano su una sola isoterma e sulla quadrettatura, al livello 6 che la
percentuale sia tra quelle della specifica.

Esito (30 settembre 2026): seed $1$, $50001$, $777001$, $6.000$ esercizi ciascuno, PASS. `review.mts` e `width.mts` con
codice 0 (opzioni al più 110 px su 252).

### Errori piantati

Su 60 esercizi (seed da 300): indice, opzione doppia, cifra dell'opzione giusta, parole vietate bocciati 60 su 60; un dato
aumentato di uno bocciato 57 su 60. I tre che passano sono del livello 3: $355 \to 356\,\text{mL}$ lascia lo stesso
risultato con tre cifre.

### Esercizi diversi su 1.000

Seed da 1: livelli 1-3 997-1000, livello 4 26 (sei isoterme per quattro o cinque volumi), livello 5 644, livello 6 17.

## Domande per la revisione

- La regola "$1\,\text{atm}$ ogni $10\,\text{m}$ d'acqua" è quella dei libri di chimica, o si usa $10{,}3\,\text{m}$?
- Il livello 6 (percentuali) è utile, o è un esercizio di matematica travestito?
