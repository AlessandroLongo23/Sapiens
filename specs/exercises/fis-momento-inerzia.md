# Il momento d'inerzia

Generatore: `fis-momento-inerzia` (`src/lib/exercises/v2/generators/fis-momento-inerzia.ts`, con
`src/lib/exercises/v2/fis-rotazioni.ts`). Verifica indipendente: `scripts/exercises/checkers/fis_momento_inerzia.py`
(con `_fis_rotazioni.py`). Lezione collegata: `docs/lezioni/fisica/riscritte/87-fis-momento-inerzia.md`. Percorso nel
database: `high_school/physics/fis-momento-angolare/fis-momento-inerzia`.

Sei livelli nell'ordine della lezione, ognuno con una difficoltà in più.

## Nomi dei livelli

1. Una massa puntiforme
2. Più masse puntiformi
3. Un altro asse
4. Corpi estesi
5. Teorema di Huygens-Steiner
6. Corpi composti

## Tipi di risposta e cifre significative

Scelta multipla, quattro opzioni in $\text{kg} \cdot \text{m}^2$. Dati con due cifre significative senza zeri ambigui.
Risultati a due cifre significative, minori di $100$, almeno $0{,}001\,\text{kg} \cdot \text{m}^2$, mai vicini a un
confine di arrotondamento.

## Regole comuni

- Formule della lezione: $I = m\,r^2$; $I = m_1 r_1^2 + m_2 r_2^2 + \ldots$ con le distanze dall'asse; la tabella dei
  corpi omogenei (disco $\frac{1}{2} M R^2$, anello $M R^2$, sfera piena $\frac{2}{5} M R^2$, asta per il centro
  $\frac{1}{12} M L^2$, asta per un estremo $\frac{1}{3} M L^2$); $I = I_{cm} + M d^2$; i momenti d'inerzia delle parti
  si sommano.
- Scena `masse-asse` (`src/components/content/exercises/scenes/MasseAsse.tsx`) nei livelli 2 e 3: l'asta vista di lato,
  le sfere con la massa scritta sopra, l'asse a tratto e punto, le distanze date come quote. Disegna i dati, non il
  risultato.

## Livello 1: una massa puntiforme

Una pallina di $0{,}11$-$9{,}9\,\text{kg}$ all'estremità di un'asticella leggera. Metà: distanza in metri
($0{,}11$-$2{,}0\,\text{m}$). Metà: in centimetri ($11$-$99\,\text{cm}$), da convertire.

- "Una pallina di massa $1{,}5\,\text{kg}$ è fissata all'estremità di un'asticella leggera e gira a $0{,}71\,\text{m}$
  dall'asse di rotazione. Quanto vale il suo momento d'inerzia rispetto all'asse?" Risposta
  $0{,}76\,\text{kg} \cdot \text{m}^2$; distrattori $m\,r$ (la distanza non al quadrato), $m^2 r$, $\frac{1}{2} m r^2$.
- Con $0{,}24\,\text{kg}$ a $62\,\text{cm}$: risposta $0{,}092\,\text{kg} \cdot \text{m}^2$; il terzo distrattore è la
  conversione fatta una volta sola (diviso $100$ invece di $10\,000$): $9{,}2$.

## Livello 2: più masse puntiformi

Metà: due sfere ($0{,}50$-$9{,}9\,\text{kg}$) su un'asta leggera, a distanze diverse dall'asse (multipli di
$0{,}1\,\text{m}$ da $0{,}20$ a $1{,}2\,\text{m}$), da parti opposte dell'asse nella scena. Metà: tre sfere, la terza
dalla parte della seconda e più lontana di almeno $0{,}3\,\text{m}$.

- "Due sfere di massa $3{,}4\,\text{kg}$ e $4{,}5\,\text{kg}$ sono fissate a un'asta leggera perpendicolare all'asse di
  rotazione, a $1{,}1\,\text{m}$ e a $0{,}70\,\text{m}$ dall'asse. Quanto vale il momento d'inerzia del sistema rispetto
  all'asse?" Risposta $6{,}3\,\text{kg} \cdot \text{m}^2$; distrattori $\sum m\,r$, tutta la massa alla distanza media,
  tutta la massa alla distanza più grande.
- "Tre sfere di massa $0{,}60\,\text{kg}$, $4{,}1\,\text{kg}$ e $9{,}1\,\text{kg}$ ... a $0{,}30\,\text{m}$,
  $0{,}20\,\text{m}$ e $1{,}0\,\text{m}$ dall'asse." Risposta $9{,}3\,\text{kg} \cdot \text{m}^2$.

## Livello 3: un altro asse

Due sfere alle estremità di un'asta leggera lunga da $0{,}60$ a $2{,}0\,\text{m}$ (multipli di $0{,}1$). Metà: l'asse
passa per la prima sfera (esempio 2 della lezione). Metà: passa a una distanza data dalla prima sfera, dentro l'asta e
non al centro; la distanza della seconda sfera si ricava per differenza.

- "... lunga $2{,}0\,\text{m}$. L'asse di rotazione è perpendicolare all'asta e passa per la prima sfera." con
  $0{,}60\,\text{kg}$ e $4{,}1\,\text{kg}$: risposta $16\,\text{kg} \cdot \text{m}^2$; distrattori tutte e due le masse
  a distanza $L$, tutte e due a $L/2$ (asse al centro), la massa sbagliata.
- "... lunga $1{,}4\,\text{m}$ ... passa a $1{,}2\,\text{m}$ dalla prima sfera." con $3{,}4\,\text{kg}$ e
  $4{,}5\,\text{kg}$: risposta $5{,}1\,\text{kg} \cdot \text{m}^2$; distrattori le due distanze scambiate, l'asse al
  centro, la seconda distanza non sottratta ($L$ intera).

## Livello 4: corpi estesi

Un quinto ciascuno: disco pieno, anello sottile, sfera piena (raggio $0{,}11$-$0{,}99\,\text{m}$), asta per il centro,
asta per un estremo (lunghezza $0{,}50$-$2{,}0\,\text{m}$); massa $0{,}50$-$9{,}9\,\text{kg}$. Il testo dice il corpo
e l'asse, non la formula.

- "Una sfera piena di massa $3{,}4\,\text{kg}$ e raggio $0{,}65\,\text{m}$ ruota attorno a un asse che passa per il suo
  centro. Quanto vale il suo momento d'inerzia rispetto a questo asse?" Risposta $0{,}57\,\text{kg} \cdot \text{m}^2$;
  distrattori le formule di altri corpi ($\frac{1}{2}$, $\frac{2}{3}$) e la lunghezza non al quadrato.
- "Un disco pieno di massa $3{,}0\,\text{kg}$ e raggio $0{,}20\,\text{m}$ ruota attorno al suo asse." Risposta
  $0{,}060\,\text{kg} \cdot \text{m}^2$ (esempio 3 della lezione).

## Livello 5: teorema di Huygens-Steiner

Un quarto ciascuno: disco con asse perpendicolare per un punto del bordo ($\frac{3}{2} M R^2$), anello con asse
perpendicolare per un suo punto ($2 M R^2$), sfera piena con asse tangente ($\frac{7}{5} M R^2$), asta con asse
perpendicolare a distanza $d$ dal centro ($d$ multiplo di $0{,}1\,\text{m}$, minore di $L/2$).

- "Un disco pieno di massa $2{,}0\,\text{kg}$ e raggio $0{,}30\,\text{m}$ ruota attorno a un asse perpendicolare al
  disco che passa per un punto del bordo." Risposta $0{,}27\,\text{kg} \cdot \text{m}^2$ (esempio 6 della lezione);
  distrattori $I_{cm}$ da solo, $M d^2$ da solo, $I_{cm} + M d$.
- Per l'asta i distrattori sono $I_{cm}$ da solo, $\frac{1}{3} M L^2 + M d^2$ (partire dall'estremo), $M d^2$ da solo.

## Livello 6: corpi composti

Metà: la piattaforma di una giostra (disco di $41$-$99\,\text{kg}$ e raggio $1{,}1$-$1{,}6\,\text{m}$) con un bambino
di $11$-$45\,\text{kg}$ seduto a una distanza dal centro non maggiore del raggio (esempio 7). Metà: un manubrio fatto di
un'asta sottile ($0{,}50$-$5{,}0\,\text{kg}$, lunga un multiplo di $0{,}2\,\text{m}$ da $0{,}60$ a $2{,}0\,\text{m}$)
con due sfere uguali alle estremità, asse per il centro.

- "La piattaforma di una giostra è un disco pieno di massa $51\,\text{kg}$ e raggio $1{,}4\,\text{m}$ ... Un bambino di
  $44\,\text{kg}$ è seduto a $0{,}58\,\text{m}$ dal centro." Distrattori il disco da solo, il bambino contato dentro il
  disco $\frac{1}{2}(M + m) R^2$, il bambino con il fattore $\frac{1}{2}$.
- "Un manubrio è fatto di un'asta sottile di massa $0{,}98\,\text{kg}$ e lunga $1{,}4\,\text{m}$, con due sfere di
  $4{,}5\,\text{kg}$ ciascuna alle estremità ..." Risposta $4{,}6\,\text{kg} \cdot \text{m}^2$; distrattori le sfere da
  sole, una sfera sola, le sfere a distanza $L$ dall'asse.

## Esercizi da evitare

- Momenti d'inerzia da $100\,\text{kg} \cdot \text{m}^2$ in su (servirebbe la notazione scientifica): si scartano.
- Nel livello 3, l'asse al centro dell'asta (è il livello 2) o fuori dall'asta.
- Corpi di cui la lezione non dà la formula (sfera cava e lamina ci sono nella tabella ma non nei livelli: vedi le
  domande).

## Verifica

`fis_momento_inerzia.py` rilegge il testo, controlla cifre significative e intervalli, ricalcola con i razionali
esatti di SymPy, arrotonda a due cifre, confronta risposta e forma delle opzioni e controlla che la scena dei livelli 2
e 3 abbia l'asta, l'asse, le masse e le quote del testo.

## Domande per la revisione

- Sfera cava e lamina rettangolare (la porta dell'esempio 4) vanno aggiunte al livello 4?
- Il livello 4 non dà la formula nel testo: lo studente deve ricordare la tabella. È quello che si chiede in verifica,
  o la tabella è di solito a disposizione?
