# Note: Seno e coseno per scomporre un vettore

Lezione nuova, primo lotto di fisica, gruppo 4, 29 settembre 2026. Numeri rifatti in Python (valori, arrotondamenti
con le cifre significative, coordinate delle figure); `check.mts` passa sui tre file senza avvisi.

## Struttura ed esempi

Il vettore negli assi cartesiani e l'angolo dal semiasse positivo delle $x$; vettori componenti e componenti;
$v_x = v\cos\alpha$ e $v_y = v\sin\alpha$ dal triangolo rettangolo; segni nei quattro quadranti (tabella); dalle
componenti al vettore con Pitagora e $\tan^{-1}$, con la correzione di $180^\circ$ o $360^\circ$; somma per componenti in
quattro passi. Sette esempi: $50\,\text{N}$ a $30^\circ$; $245\,\text{m}$ a $35^\circ$ (tre cifre); $60\,\text{N}$ a
$20^\circ$ dalla verticale; $8{,}0\,\text{m}$ a $150^\circ$; $F_x = 12$, $F_y = 5{,}0$ ($13\,\text{N}$, $23^\circ$);
$s_x = -3{,}0$, $s_y = 4{,}0$ ($127^\circ$); due forze di $50$ e $30$ N a $60^\circ$ ($70\,\text{N}$, $22^\circ$).

Avvisi accanto alla regola: calcolatrice in radianti, seno e coseno scambiati (con l'esempio dell'angolo dalla
verticale), il segno dimenticato, l'angolo della calcolatrice, sommare moduli o componenti a caso.

## Scelte

- Seno, coseno e tangente non si rispiegano: link alla lezione di matematica 101 "Seno, coseno e tangente nel
  triangolo rettangolo", che usa $\sin$, $\cos$, $\tan$ e $\tan^{-1}$ come la calcolatrice; qui si fa lo stesso.
- Gli angoli oltre $90^\circ$: le formule valgono con la calcolatrice, e la lezione lo dice senza spiegare perché
  (rimando a "Funzioni goniometriche" del quarto anno). In alternativa si mostra l'angolo acuto con l'asse e il segno
  messo guardando il disegno, come fanno molti libri del biennio.
- Cifre significative: i risultati hanno le cifre del modulo (gli angoli non contano), e l'esempio 1 lo dice; nei
  passaggi della somma una cifra in più. Gli angoli trovati si arrotondano al grado.
- "Vettori componenti" $\vec{v}_x$, $\vec{v}_y$ e "componenti" $v_x$, $v_y$ (numeri con il segno), come l'Amaldi.

## Figure

Statiche (chiaro e scuro, coordinate controllate): `componenti-vettore-seno-coseno` ($3\,\text{cm}$ a $35^\circ$),
`componenti-angolo-verticale` ($2{,}6\,\text{cm}$ a $20^\circ$ dalla verticale), `componenti-secondo-quadrante`
($2{,}8\,\text{cm}$ a $150^\circ$), `somma-per-componenti-forze` (in scala 0,05 cm/N).

Interattiva: `componenti-vettore-quadranti` (`ComponentiVettore.tsx`): negli assi con la griglia (1 m per quadretto)
la punta di $\vec{v}$ scatta sugli incroci; componenti tratteggiate, arco dell'angolo (con $\alpha$ scritto quando
l'angolo è largo almeno $28^\circ$), sotto $v$, $\alpha$, $v_x = v\cos\alpha$ e $v_y = v\sin\alpha$ con il segno, e il
quadrante. Guardata nei quattro quadranti, su un asse e con angoli piccoli. Le componenti hanno i nomi $v_x$ e $v_y$
senza freccia, scritti con un pezzo mio: `Components` di `fisica.tsx` mette la freccia sopra (vedi il resoconto).

## Esercizi

Generatore `fis-seno-coseno`, sei livelli: componente con l'angolo dall'asse $x$, dall'asse $y$, nei quattro quadranti;
modulo o angolo dalle componenti; angolo negli altri quadranti; modulo della somma per componenti. Distrattori: seno e
coseno scambiati, calcolatrice in radianti, segno dimenticato, angolo della calcolatrice non corretto, moduli sommati.

## Domande per Andrea

- Angolo sempre dal semiasse positivo delle $x$ in senso antiorario, da $0^\circ$ a $360^\circ$ (qui), o anche angoli
  dati rispetto ad altri riferimenti ("$30^\circ$ sopra l'orizzontale verso sinistra")? Gli esercizi del livello 2
  usano l'asse $y$.
- Angoli oltre $90^\circ$ con la calcolatrice (qui) o solo l'angolo acuto con il segno messo a mano?
- $\sin$ e $\cos$ come la calcolatrice e la lezione di matematica, o $\text{sen}$?
- Cifre significative: risultato con le cifre del modulo (qui) o sempre tre cifre?
- Versori $\hat{x}$ e $\hat{y}$: la lezione non li introduce. Servono già in prima?
- Il nome "vettori componenti" per $\vec{v}_x$ e $\vec{v}_y$ va bene, o preferite "componenti vettoriali"?

## Verifiche

- `check.mts` su lezione, formulario e 17 carte: nessun errore, nessun avviso.
- Generatore: seed 1, 50001 e 777001, 6000 esercizi ciascuno, `verify.py` PASS; errori piantati bocciati (opzione
  giusta spostata, opzioni doppie, risposta cambiata, angolo del testo cambiato: 1200 su 1200, componenti della scena
  fuori scala: 600 su 600); `review.mts` e `width.mts` codice 0.
- Un modulo del testo cambiato di una unità passa in circa un caso su dieci: è giusto, perché la risposta arrotondata
  resta la stessa ($45$ o $46$ per $\cos 64^\circ$ danno tutti e due $20$).
