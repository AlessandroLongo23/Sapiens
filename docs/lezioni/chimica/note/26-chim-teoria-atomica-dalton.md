# Note: La teoria atomica di Dalton

Lezione nuova (biennio di chimica, gruppo 25, 30 settembre 2026). Conti rifatti in Python con le masse della lezione
01: nell'acqua $16{,}00/2{,}02 = 7{,}92$, $2 \cdot 7{,}92 = 15{,}84$; nell'ammoniaca $14{,}01/3{,}03 = 4{,}624$,
$3 \cdot 4{,}62 = 13{,}86$; $16{,}00/1{,}01 = 15{,}84$. Nella figura della reazione $4$ atomi di H e $2$ di O prima e
dopo. `check.mts` passa.

## Struttura

Apertura con le tre leggi (link alle lezioni 23, 24, 25) e il libro del 1808; l'idea antica di Democrito in un
paragrafo; i quattro postulati numerati, la molecola come "atomo composto", la figura del modello a sfere e l'avviso
sul secondo postulato; le tre leggi spiegate dagli atomi, con la figura della reazione di idrogeno e ossigeno; le
masse relative con gli esempi 1 (ossigeno) e 2 (azoto), la regola della massima semplicità e l'avviso sul rapporto
delle masse; che cosa resta oggi in una tabella, con i link alle lezioni del secondo e del terzo anno.

## Scelte

- Quattro postulati, come li danno di solito i libri del biennio (il Valitutti, capitolo 3, "Dalle trasformazioni
  chimiche alla teoria atomica": da verificare il numero esatto e le parole). Alcuni libri ne danno cinque, separando
  "gli atomi di elementi diversi sono diversi".
- Fonte del valore $7$ per l'ossigeno: C. Giunta, "Dalton atomic weights", Le Moyne College (pagina letta il 30
  settembre 2026 tramite una ricerca). Wikipedia ("John Dalton", letta lo stesso giorno) conferma il 1808, la regola
  della massima semplicità e l'acqua $\mathrm{HO}$.
- Le masse relative sono presentate come Dalton le pensava (rispetto all'idrogeno), per preparare la massa atomica
  relativa della lezione 01; il riferimento di oggi (carbonio-12) è in un paragrafo con il link.
- Niente simboli di Dalton (i cerchi con i segni): non li ho verificati su una fonte, e il modello a sfere colorate
  basta. Se Andrea li vuole, si può aggiungere una figura con i simboli veri.
- La tabella finale dice che il quarto postulato è "vero per le sostanze fatte di molecole": è una semplificazione
  (i composti non stechiometrici non si nominano).

## Figure

Due TikZ, guardate in chiaro e in scuro: `dalton-elemento-composto-sfere` (tre riquadri: atomi di carbonio, atomi di
ossigeno, molecole di $\mathrm{CO}$) e `dalton-reazione-idrogeno-ossigeno` (due $\mathrm{H_2}$ e un $\mathrm{O_2}$
che diventano due $\mathrm{H_2O}$, con il conteggio degli atomi sotto). Nessuna interattiva: la figura di valore alto
del capitolo è quella delle proporzioni multiple, nella lezione 25.

## Esercizi

Generatore `chim-teoria-atomica-dalton`, cinque livelli (specifica in `specs/exercises/chim-teoria-atomica-dalton.md`):
postulati, quale legge, che cosa resta oggi, contare gli atomi di una reazione, masse relative. Senza scene.

## Domande per Andrea

- Quanti postulati si insegnano, quattro o cinque, e con quali parole?
- La regola della massima semplicità e l'errore sull'acqua $\mathrm{HO}$ sono utili al primo anno, o confondono? La
  lezione li usa per mostrare perché serve la formula giusta.
- Il livello 4 degli esercizi (quante molecole di prodotto si formano, contando gli atomi) anticipa il bilanciamento:
  va bene come esercizio sulla conservazione degli atomi, o è meglio chiedere solo quanti atomi ci sono dopo?
- Nel livello 2 degli esercizi la quarta opzione è sempre "Nessuna delle tre leggi", e non è mai giusta: meglio
  toglierla e fare domande a tre opzioni, o inventare dati che non rispettano nessuna legge?
