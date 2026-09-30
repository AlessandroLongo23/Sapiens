# La legge di Proust

Generatore: `chim-legge-proust` (`src/lib/exercises/v2/generators/chim-legge-proust.ts`, con
`src/lib/exercises/v2/chim-leggi-ponderali.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_legge_proust.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/24-chim-legge-proust.md`. Percorso nel database:
`high_school/chemistry/chim-trasformazioni-chimiche/chim-legge-proust`.

Cinque livelli, ognuno con una difficoltà in più. Scelta multipla, quattro opzioni.

## Rapporti e cifre

I rapporti di combinazione della lezione, con l'elemento più pesante sopra: $m_{\mathrm{Cu}}/m_{\mathrm{S}} = 3{,}96$,
$m_{\mathrm{Fe}}/m_{\mathrm{S}} = 1{,}74$, $m_{\mathrm{Mg}}/m_{\mathrm{O}} = 1{,}52$, $m_{\mathrm{O}}/m_{\mathrm{H}} = 7{,}92$,
$m_{\mathrm{Cl}}/m_{\mathrm{Na}} = 1{,}54$, $m_{\mathrm{O}}/m_{\mathrm{C}} = 2{,}66$. Dati con tre cifre significative;
prodotti e quozienti a tre cifre, somme e differenze con i decimali dei dati. Mai risultati vicini a un confine di
arrotondamento.

## Nomi dei livelli

1. Il rapporto di combinazione
2. La massa che si combina
3. La composizione percentuale
4. Il reagente in eccesso
5. Il composto con un reagente in eccesso

## Livello 1: il rapporto di combinazione

Le masse dei due elementi di un esperimento (il secondo da $0{,}500$ a $9{,}99\,\text{g}$), con uno scarto sperimentale
fino allo $0{,}5\%$: il rapporto viene entro $0{,}025$ da quello della lezione. Opzioni numeri puri. Distrattori: il
rapporto rovesciato, l'elemento sul composto, il composto sull'elemento.

## Livello 2: la massa che si combina

Rapporto nel testo. Metà data la massa del primo elemento (si divide), metà del secondo (si moltiplica). Distrattori: il
rapporto usato al contrario, la massa del composto, il rapporto riferito al composto.

- "Nel solfuro di ferro il rapporto di combinazione è $m_{\mathrm{Fe}}/m_{\mathrm{S}} = 1{,}74$. Quanti grammi di zolfo si
  combinano con $17{,}8\,\text{g}$ di ferro?" Risposta $10{,}2\,\text{g}$; distrattori $31{,}0$, $28{,}0$, $6{,}50\,\text{g}$.

## Livello 3: la composizione percentuale

Metà: da un campione (massa del composto e di un elemento) la percentuale; distrattori la percentuale dell'altro elemento,
un elemento sull'altro per cento. Metà: dalla percentuale della lezione (tre cifre) la massa di un elemento in
$10$-$99{,}9\,\text{g}$ di composto; distrattori il resto del composto, la massa divisa per la percentuale.

## Livello 4: il reagente in eccesso

Due masse da $1{,}00$ a $9{,}99\,\text{g}$ lontane almeno l'$8\%$ dal rapporto. La massa che reagisce del reagente in
eccesso si calcola a tre cifre, e deve avere due decimali; l'avanzo è una differenza a due decimali. Opzioni "$2{,}01\,\text{g}$
di zolfo". Distrattori: lo stesso avanzo dell'altro elemento, la parte che reagisce, la differenza delle masse, il
rapporto rovesciato.

## Livello 5: il composto con un reagente in eccesso

Gli stessi dati; la risposta è la somma delle masse che reagiscono. Distrattori: la somma di tutto, il reagente in
eccesso preso come limitante, il composto meno l'avanzo.

## Verifica

Il controllo ha la sua tabella dei rapporti, rilegge i dati, ricalcola con i razionali esatti e arrotonda come la
specifica; controlla che il rapporto nel testo sia quello della lezione, che le percentuali siano vicine alla
composizione della lezione, forma e valore di ogni opzione.

Esito (30 settembre 2026): seed 1, 50001, 777001, 5.000 esercizi ciascuno, PASS. Errori piantati su 60 esercizi: indice,
opzione doppia, testo dell'opzione giusta bocciati 60 su 60; un dato cambiato di una cifra bocciato 51 su 60 (i nove che
passano danno la stessa risposta dopo l'arrotondamento a tre cifre). `review.mts` e `width.mts` con codice 0.
