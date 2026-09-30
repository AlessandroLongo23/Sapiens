# Note: Le leve e le macchine semplici

Lezione nuova, scritta da zero (secondo lotto di fisica, gruppo 7, 30 settembre 2026). Conti rifatti con SymPy in
`verifica_lezioni_g7.py` (scratchpad del lotto): il piede di porco ($100\,\text{N}$, braccio motore $45\,\text{cm}$), la
carriola ($200\,\text{N}$), l'avambraccio ($400\,\text{N}$), la carrucola mobile ($180\,\text{N}$, $3{,}0\,\text{m}$ di
fune), e le frecce in scala delle figure (ogni leva della figura dei tre generi rispetta $F_m b_m = F_r b_r$).
`check.mts` passa senza avvisi.

## Struttura ed esempi

La macchina semplice, la leva con forza motrice e resistente e i loro bracci, la condizione $F_m b_m = F_r b_r$, leve
vantaggiose, svantaggiose e indifferenti (con il rapporto $F_r / F_m$ citato come "guadagno" di alcuni libri), i tre
generi con gli esempi, le leve del corpo umano, le carrucole fissa e mobile, il piano inclinato come macchina semplice
(un paragrafo con il link alla lezione 21). Quattro esempi: il piede di porco (primo genere), la carriola (secondo),
l'avambraccio (terzo), la carrucola mobile. Avvisi: i bracci si misurano dal fulcro, il genere non basta a dire se una
leva conviene. Una nota su "quello che si guadagna in forza si perde in spostamento", con il link alla lezione sul
lavoro.

## Scelte

- Forza motrice e forza resistente, con "potenza" e "resistenza" tra parentesi; $F_m$, $F_r$, $b_m$, $b_r$.
- Le carrucole sono nella lezione come chiede il lotto; il programma (`programma.md`) non dice i paragrafi del capitolo
  4 dell'Amaldi, quindi non ho potuto verificare che l'Amaldi del biennio le tratti qui. Il verricello (l'argano) non
  c'è: da aggiungere se il libro lo ha.
- Il piano inclinato è solo un paragrafo, senza formula: i conti sono nella lezione 21, che già lo chiama macchina
  semplice e linka questa lezione.
- Il remo come leva di secondo genere ha il fulcro nella pala: è l'interpretazione più diffusa nei libri, ma alcuni lo
  danno di primo genere con il fulcro nello scalmo (dipende dal sistema di riferimento). Da verificare.

## Figure

Cinque TikZ, guardate in chiaro e in scuro: `leva-forze-bracci` (bracci $1{,}5$ e $3\,\text{cm}$, frecce $1{,}5$ e
$0{,}75\,\text{cm}$), `leve-tre-generi` (tre leve in scala, una per riga), `leva-carriola` ($2{,}5\,\text{cm}$ per metro,
$1\,\text{cm}$ per $300\,\text{N}$), `leva-avambraccio` ($1\,\text{cm}$ per $10\,\text{cm}$, $1\,\text{cm}$ per
$150\,\text{N}$), `carrucola-fissa-mobile` (la forza della mobile lunga metà del peso). Il soffitto delle carrucole ha i
trattini verso l'alto, come nella tabella del README.

Interattiva `leva-tre-generi` (`src/components/content/interactive/fisica/LevaGeneri.tsx`): fulcro, forza resistente
($60\,\text{N}$) e forza motrice si trascinano lungo un'asta di $70\,\text{cm}$ a passi di $5\,\text{cm}$; la figura
riconosce il genere dall'ordine, disegna in scala la forza motrice di equilibrio (verso il basso nel primo genere,
verso l'alto negli altri; accorciata oltre $100\,\text{N}$, allungata a $0{,}3\,\text{cm}$ sotto $7{,}5\,\text{N}$) e dice
se la leva è vantaggiosa. Tre bottoni mettono una leva di ogni genere.

## Esercizi

Generatore `fis-leve`, specifica in `specs/exercises/fis-leve.md`: cinque livelli (il genere, vantaggiosa o
svantaggiosa, la forza motrice, il braccio o il fulcro, le carrucole), scena `asta-forze`. I livelli 1 e 2 sono a
scelta tra tre parole.

## Lasciato ad altre lezioni

- L'equilibrio dei momenti: lezione 23. Il piano inclinato: lezione 21. Il lavoro: secondo anno.

## Domande per Andrea

- "Forza motrice e forza resistente" o "potenza e resistenza"? E i simboli $F_m$, $F_r$ vanno bene?
- Il "guadagno" della leva ($F_r / F_m$) lo usate, o basta vantaggiosa e svantaggiosa?
- Le carrucole e il verricello sono in questo capitolo dell'Amaldi del biennio, o vengono dopo (con le forze e il
  movimento)?
- Il remo: secondo genere (fulcro nella pala) o primo (fulcro nello scalmo)?
