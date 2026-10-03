# Flashcard: La codifica dei suoni

## analogico-digitale
Che differenza c'è tra un segnale analogico e uno digitale?
---
Il segnale analogico cambia con continuità e può assumere qualunque valore; quello digitale è una sequenza di numeri.

## due-passaggi
Quali sono i due passaggi per trasformare un suono in numeri?
---
Il campionamento e la quantizzazione.

## campionamento
Che cos'è il campionamento?
---
Misurare il segnale a intervalli di tempo regolari. Ogni misura è un campione.

## frequenza-di-campionamento
Che cos'è la frequenza di campionamento?
---
Il numero di campioni presi in un secondo, misurato in hertz.

## kilohertz
Quanti campioni al secondo sono $44{,}1\,\text{kHz}$?
---
$44\,100$, perché $1\,\text{kHz} = 1000\,\text{Hz}$.

## campioni-conto
Quanti campioni si ottengono in $2$ secondi a $8\,\text{kHz}$, su un canale?
---
$16\,000$, cioè $8000 \cdot 2$.

## regola-campionamento
Che cosa dice la regola del campionamento?
---
La frequenza di campionamento deve essere almeno il doppio della frequenza più alta contenuta nel suono.

## regola-minima
Un suono arriva a $10\,\text{kHz}$. Qual è la frequenza di campionamento minima?
---
$20\,\text{kHz}$, il doppio.

## regola-massima
Con una frequenza di campionamento di $8\,\text{kHz}$, fino a quale frequenza si registra correttamente?
---
Fino a $4\,\text{kHz}$, la metà.

## regola-errore
Vero o falso: per registrare un suono di $5\,\text{kHz}$ si può campionare a $5\,\text{kHz}$.
---
Falso. Servono almeno due campioni per ogni vibrazione: almeno $10\,\text{kHz}$.

## cd-frequenza
Perché i CD audio campionano a $44{,}1\,\text{kHz}$?
---
Perché è poco più del doppio di $20\,\text{kHz}$, la frequenza più alta che l'orecchio umano sente.

## quantizzazione
Che cos'è la quantizzazione?
---
Sostituire ogni campione con il numero del livello più vicino, per poterlo scrivere con un numero fisso di bit.

## livelli-formula
Quanti livelli ci sono con $n$ bit per campione?
---
$2^n$.

## livelli-otto-bit
Quanti livelli ci sono con $8$ bit per campione?
---
$256$, cioè $2^8$.

## livelli-sedici-bit
Quanti livelli ci sono con $16$ bit per campione?
---
$65\,536$, cioè $2^{16}$.

## mono-stereo
Quanti canali hanno un suono mono e un suono stereo?
---
Mono uno, stereo due: a parità del resto, lo stereo occupa il doppio.

## dimensione-formula
Come si calcolano i byte di un suono non compresso?
---
Frequenza di campionamento per secondi per bit per campione per canali, diviso $8$.

## dimensione-conto
Quanti byte occupa un secondo di suono mono a $8\,\text{kHz}$ e $8$ bit?
---
$8000$ byte: $8000$ campioni da un byte ciascuno.

## dimensione-errore-minuti
Nel calcolo della dimensione, una durata di $2$ minuti con quale numero entra?
---
Con $120$: la durata va in secondi, perché la frequenza dice i campioni in un secondo.

## compressione
Perché una canzone sul telefono occupa molto meno del calcolo senza compressione?
---
Perché è salvata con una compressione, che riduce i bit, spesso togliendo le parti del suono che l'orecchio distingue peggio.
