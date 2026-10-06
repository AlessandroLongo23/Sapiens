# Note: Successioni numeriche

Lezione nuova (lotto del terzo anno, gruppo B). Tutti i conti di lezione, formulario e carte sono stati rifatti con SymPy (`gruppo-b/verifica.py` nello scratchpad): termini, $a_{n+1}$, le due equazioni dell'esempio 2, le differenze $a_{n+1} - a_n$ degli esempi 6 e 7, la riscrittura $2 - \frac{1}{n}$, i termini delle successioni ricorsive con i tre primi termini dell'avviso, Fibonacci, le due formule che cominciano con $1, 2, 4$.

## Scelte

- Indice da $1$: la successione è una funzione definita sui naturali $n \geq 1$, anche se sul sito $0 \in \mathbb{N}$. Così l'indice è il posto, e le formule delle progressioni ($a_n = a_1 + (n - 1)d$) sono quelle dei libri. Un `ad-note` dice che alcuni libri partono da $a_0$.
- Notazione: "la successione $a_n$", senza $\{a_n\}$ né $(a_n)_{n \in \mathbb{N}}$. Il simbolo di sommatoria $\Sigma$ non è introdotto in nessuna delle quattro lezioni: le somme sono scritte con i puntini.
- Tre modi di assegnare una successione: termine generale, ricorsione, descrizione a parole (i numeri primi, in un `ad-note`). "Legge di ricorrenza" per la formula che lega $a_{n+1}$ ad $a_n$.
- Monotonia: "crescente" e "decrescente" in senso stretto, "non decrescente (o crescente in senso lato)" e "non crescente" con l'uguaglianza, come nella 107 del gruppo A. Il metodo insegnato è il segno di $a_{n+1} - a_n$; il rapporto $\frac{a_{n+1}}{a_n}$ per le successioni a termini positivi non c'è.
- Limitatezza a livello intuitivo: definizioni con $m$ e $M$, quattro esempi, niente estremo superiore o inferiore, niente massimo e minimo. Il fatto "una successione crescente è limitata inferiormente dal primo termine" è enunciato e giustificato in una riga.
- Niente limiti: l'unico accenno è un `ad-note` finale ("che cosa succede quando $n$ diventa grande"), che non usa la parola e rimanda al quinto anno senza link.
- Coordinate dei punti con la virgola, $(n, a_n)$, come nelle lezioni 80-87 (correzione al brief di chi coordina, 5 ottobre 2026); le coordinate non intere sono scritte come frazioni, $\big(4, \frac{3}{2}\big)$. Il punto e virgola resta solo dentro i blocchi `grafico`.

## Confini con le lezioni vicine

- Progressioni: qui compaiono solo come esempi (la successione $3, 7, 11, 15$ dell'esempio 5 è aritmetica, ma la parola arriva nell'ultima frase, con i link).
- Induzione: non nominata. La 113 riprende la successione ricorsiva dell'esempio 4 ($a_1 = 3$, $a_{n+1} = 2a_n - 1$) e ne dimostra il termine generale $2^n + 1$.
- Successioni monotone: link alla 107 per le parole.

## Figure

Tre, tutte guardate in chiaro e in scuro con `anteprima.mjs`: `successione-grafico-punti-isolati` (fuori dai riquadri), `successione-non-monotona-n-quadro-meno-6n` (esempio 7), `successione-limitata-tra-1-e-2` (esempio 8). Le coordinate dei punti sono i valori calcolati dallo script. Nessun blocco `grafico`: non c'è una famiglia di curve con un "cosa succede se".

## Piani con i cursori (fase 3, 5 ottobre 2026)

Due, tutti e due dentro un esempio, dopo la figura che fa da copertina. I punti sono punti fermi del blocco con le coordinate che dipendono dal cursore: così il blocco disegna i punti isolati dei primi termini (sette o otto), non la successione intera.

- `successione-n-quadro-piu-bn-cursore`, esempio 7: $a_n = n^2 + bn$ con $b$ da $-8$ a $-2$ (parte da $-6$, la successione dell'esempio), valore $a_2 - a_1$. Domanda: per quale $b$ i primi due termini sono uguali, e per quale i punti salgono tutti. Il caso limite è $b = -3$ (non decrescente ma non crescente); il paragrafo dopo l'esempio dà le risposte.
- `successione-due-meno-c-su-n-cursore`, esempio 8: $a_n = 2 - \frac{c}{n}$ con $c$ da $-2$ a $2$ (parte da $1$), la retta $y = 2$, valore $a_1$. Domanda: con $c$ negativo è ancora limitata, è ancora crescente, e con $c = 0$. Il paragrafo dopo l'esempio risponde: cambia la monotonia, non la limitatezza.

Guardati a 390 px ai valori iniziali, agli estremi e nei casi limite ($b = -3$, $c = 0$), e in scuro allo stato estremo. Con questi due piani la lezione è passata da 19.181 a 21.846 caratteri.

## Domande per Andrea

- Da quale indice partono le successioni nel vostro libro, $a_1$ o $a_0$? La lezione parte da $a_1$.
- Va introdotto qui il simbolo di sommatoria $\Sigma$, o si lascia a quando serve?
- Per la monotonia insegnate anche il criterio del rapporto $\frac{a_{n+1}}{a_n}$ confrontato con $1$?
- "Legge di ricorrenza" o "relazione di ricorrenza"? E "per ricorsione" o "per ricorrenza"?
- La successione di Fibonacci parte da $1, 1$: va bene, o preferite $0, 1$?

## Da verificare

- Come si vede la tabella dei casi di monotonia del formulario sul telefono.
- L'accenno al quinto anno nell'ultimo `ad-note`: quando la lezione "Limiti di successioni" sarà scritta, ci va il link.

Prerequisiti proposti: definizione-funzione, il-piano-cartesiano, equazioni-secondo-grado
