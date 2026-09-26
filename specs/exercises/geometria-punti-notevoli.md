# Punti notevoli del triangolo

Generatore: `geometria-punti-notevoli`
(`src/lib/exercises/v2/generators/geometria-punti-notevoli.ts`). Verifica indipendente:
`scripts/exercises/checkers/geometria_punti_notevoli.py`. Lezione collegata: "Punti notevoli del
triangolo" (`docs/lezioni/riscritte/61-geometria-punti-notevoli.md`), con la nota
`docs/lezioni/note/61-geometria-punti-notevoli.md` (sezione "Per il generatore").

Lo studente riconosce un punto notevole dalla sua costruzione o da una proprietà, usa la proprietà
2 : 1 del baricentro, dice dove cadono ortocentro e circocentro secondo il tipo di triangolo, calcola
raggio della circoscritta, mediana e baricentro nel triangolo rettangolo, l'angolo tra due bisettrici
e tra due altezze, e i due raggi del triangolo equilatero. Niente figure: ogni esercizio si regge sul
testo. I livelli seguono le sette proposte della nota, che a loro volta seguono la lezione.

## Rappresentazione

- Il testo sta sempre nel `problem`, come righe `\text{...}` scritte con `textBlock` (la pagina le
  mostra come paragrafo); il `prompt` è la consegna breve ("Risolvi il problema.", "Quale punto
  notevole è P?", "Scegli la proprietà giusta.", "Scegli dove si trova il punto.").
- Livelli 1 e 3: risposta `choice` (quattro opzioni, la risposta è già la scelta multipla).
- Livelli 2, 4, 7: risposta `number` (una lunghezza in cm, razionale esatto in `answer.value`).
  Livelli 5 e 6: risposta `number` (un angolo in gradi, intero). La variante `choice` scrive le
  opzioni come `12\text{ cm}`, `3{,}5\text{ cm}`, `\frac{10}{3}\text{ cm}` o `125^\circ`.
- `params.case` dice il caso; `params.wrong` gli errori tipici da cui vengono le opzioni sbagliate;
  `params.unit` (`cm` o `deg`). Il controllo non legge i dati dai `params`: li rilegge dal testo.

## Regole comuni

- Notazione della lezione: ortocentro $H$, baricentro $G$, circocentro $O$, incentro $I$; punti medi
  $M$ su $BC$, $N$ su $CA$, $L$ su $AB$; angoli $\hat{A}$, angoli tra segmenti $\widehat{BIC}$;
  virgola decimale `{,}`; "circonferenza inscritta" e "circonferenza circoscritta".
- Lunghezze positive con al più un decimale nei dati (mezzi centimetri); risposte decimali finite,
  tranne nel livello 4 dove $CG = \frac{h}{3}$ può essere una frazione come nell'esempio 4 della
  lezione ($\frac{10}{3}$ cm).
- Quando la risposta è un decimale finito, nessuna opzione è una frazione periodica (sarebbe
  scartata a colpo d'occhio).

## Livello 1: riconoscere il punto notevole

Sei volte su dieci "dalla proprietà al punto": una frase descrive il punto $P$ di un triangolo
($ABC$, $DEF$, $RST$ o $KLM$) con la costruzione (dove si incontrano mediane, altezze, assi,
bisettrici; le perpendicolari dai vertici; le perpendicolari nei punti medi; i segmenti dai vertici
ai punti medi; le semirette che dividono a metà gli angoli) o con una proprietà (equidistante dai
vertici o dai lati, centro della circonferenza che passa per i vertici o che tocca i lati, divide le
mediane in parti una doppia dell'altra, punto di equilibrio, vertice dell'angolo retto, punto medio
dell'ipotenusa, esterno dalla parte dell'angolo ottuso) o con le due storie della lezione (il pozzo
equidistante da tre case, la fontana equidistante da tre strade). Opzioni: i quattro punti, sempre.

Quattro volte su dieci "dal punto alla proprietà": "Quale di queste proprietà ha il circocentro $O$
di un triangolo?". Opzioni: una proprietà del punto chiesto e una proprietà di ciascuno degli altri
tre, ognuna vera di un solo punto (niente "è sempre interno", che vale per $G$ e per $I$).

Esempi: "Il punto $P$ ha la stessa distanza dai tre vertici del triangolo $RST$." → circocentro $O$.
"Quale di queste proprietà ha il baricentro $G$?" → "divide ogni mediana in due parti, una doppia
dell'altra" (le altre: centro della circonferenza inscritta, centro della circoscritta, incontro
delle altezze).

## Livello 2: baricentro e mediana

"Nel triangolo $ABC$ il punto $G$ è il baricentro e [la mediana $AM$ | il segmento $AG$ | il segmento
$GM$] è lungo $x$ cm. Quanto è lungo …?". Una delle tre mediane ($AM$, $BN$, $CL$); dato uno dei tre
segmenti, chiesto uno degli altri due (sei casi, un sesto ciascuno). Si sceglie prima $GM$ da 1 a 12
cm, una volta su quattro con il mezzo centimetro, poi $AG = 2 \cdot GM$ e $AM = 3 \cdot GM$.

Esempi: $AM = 12$ cm → $GM = 4$ cm (esempio 2 della lezione); $GL = 4$ cm → $CL = 12$ cm; $BG = 13$ cm
→ $BN = 19{,}5$ cm.

Distrattori (riquadro "Il rapporto al contrario"): il rapporto rovesciato ($GM$ doppio di $AG$), il
baricentro come punto medio della mediana, la lunghezza del segmento sbagliato (per esempio $AG$ al
posto della mediana).

## Livello 3: dove cadono ortocentro e circocentro

"Nel triangolo $ABC$ gli angoli $\hat{A}$ e $\hat{C}$ misurano $110^\circ$ e $35^\circ$. Dove si trova
l'ortocentro $H$?". Il terzo angolo si ricava con la somma $180^\circ$, e da lì il tipo di triangolo.
Angoli multipli di $5^\circ$, almeno $15^\circ$, con un solo angolo massimo (così "il vertice" e "il
lato opposto" delle opzioni sono univoci); un terzo acutangoli, un terzo rettangoli, un terzo
ottusangoli; il punto chiesto è $H$ quattro volte su dieci, $O$ quattro, $G$ o $I$ due (la trappola:
sono sempre interni).

Opzioni, sempre le stesse quattro: "interno al triangolo", "esterno al triangolo", "nel vertice $X$"
e "nel punto medio di $YZ$", dove $X$ è il vertice dell'angolo più grande e $YZ$ il lato opposto.
Risposta secondo la tabella della lezione: acutangolo interni; rettangolo $H$ nel vertice
dell'angolo retto e $O$ nel punto medio dell'ipotenusa; ottusangolo esterni; $G$ e $I$ interni.

Esempi: $\hat{B} = 45^\circ$, $\hat{C} = 45^\circ$, ortocentro → nel vertice $A$; $\hat{A} = 35^\circ$,
$\hat{C} = 60^\circ$, ortocentro → interno.

## Livello 4: il triangolo rettangolo

"Il triangolo $ABC$ è rettangolo in $C$ e l'ipotenusa $AB$ è lunga $h$ cm." (il vertice dell'angolo
retto può essere $A$, $B$ o $C$). Un quarto per caso: il raggio della circonferenza circoscritta
($\frac{h}{2}$), la mediana relativa all'ipotenusa ($\frac{h}{2}$), la distanza del baricentro dal
vertice dell'angolo retto ($\frac{h}{3}$), oppure al contrario, data quella distanza $c$, l'ipotenusa
($3c$). Per raggio e mediana $h$ va da 1 a 40 cm con i mezzi centimetri; per il baricentro $h$ è intero
fino a 36, due volte su tre multiplo di 3.

Esempi: $AB = 10$ cm → $CG = \frac{10}{3}$ cm (esempio 4 della lezione); $BC = 28$ cm → $R = 14$ cm;
$AG = 1{,}5$ cm → $BC = 4{,}5$ cm.

Distrattori: il raggio uguale all'ipotenusa (raggio e diametro scambiati), i terzi dell'ipotenusa
al posto della metà; per il baricentro un terzo della mediana (rapporto rovesciato), metà della
mediana (baricentro nel punto medio), due terzi dell'ipotenusa; per l'ipotenusa la mediana
(dimenticato che è un raggio), $6c$ e $4c$ (rapporto rovesciato, punto medio).

## Livello 5: angolo tra due bisettrici

"Nel triangolo $ABC$ gli angoli misurano $\hat{A} = 70^\circ$ e $\hat{C} = 90^\circ$. Le bisettrici
degli angoli $\hat{B}$ e $\hat{C}$ si incontrano nell'incentro $I$. Quanto misura $\widehat{BIC}$?".
Angoli pari tra $20^\circ$ e $130^\circ$ (così le metà sono intere), non tutti $60^\circ$. Metà delle
volte i due angoli dati sono quelli ai vertici delle due bisettrici; metà delle volte uno dei due è
l'angolo opposto e l'altro si ricava con la somma. L'angolo chiesto può essere $\widehat{BIC}$,
$\widehat{AIB}$ o $\widehat{AIC}$. Risposta $90^\circ + \frac{\hat{A}}{2}$, con $\hat{A}$ l'angolo opposto.

Esempi: $\hat{B} = 50^\circ$, $\hat{C} = 60^\circ$ → $125^\circ$ (esempio 3); $\hat{A} = 28^\circ$,
$\hat{B} = 44^\circ$, $\widehat{AIB}$ → $144^\circ$.

Distrattori: gli angoli non dimezzati ($\hat{A}$), la formula dell'ortocentro ($180^\circ - \hat{A}$),
$90^\circ - \frac{\hat{A}}{2}$ (la somma delle due metà), $90^\circ + \hat{A}$.

## Livello 6: angolo tra due altezze

Come il livello 5 con le altezze e l'ortocentro $H$, nel triangolo acutangolo (lo dice il testo, e
tutti gli angoli sono acuti): angoli multipli di $5^\circ$ tra $35^\circ$ e $85^\circ$. I passaggi
seguono l'esempio 1 della lezione: $\widehat{HBC} = 90^\circ - \hat{C}$, $\widehat{HCB} = 90^\circ -
\hat{B}$, poi la somma nel triangolo $BHC$. Risposta $180^\circ - \hat{A}$.

Esempi: $\hat{A} = 70^\circ$, $\hat{B} = 50^\circ$, $\hat{C} = 60^\circ$ → $\widehat{BHC} = 110^\circ$
(esempio 1); $\hat{A} = 50^\circ$, $\hat{C} = 85^\circ$, $\widehat{AHC}$ → $135^\circ$.

Distrattori: l'angolo opposto $\hat{A}$ (la somma dei due angoli $90^\circ - \hat{B}$ e $90^\circ -
\hat{C}$, senza toglierla da $180^\circ$), la formula dell'incentro $90^\circ + \frac{\hat{A}}{2}$,
$90^\circ - \frac{\hat{A}}{2}$, $90^\circ + \hat{A}$ (solo quelli interi e minori di $180^\circ$).

## Livello 7: i raggi del triangolo equilatero

"L'altezza di un triangolo equilatero è lunga $9$ cm. Quanto misura il raggio della circonferenza
inscritta?". Dato uno tra altezza $h$, raggio $r$ della inscritta e raggio $R$ della circoscritta,
chiesto uno degli altri due (sei casi). Si sceglie $r$ da 1 a 15 cm, una volta su quattro con il mezzo
centimetro; $R = 2r$, $h = 3r$.

Esempi: $h = 9$ cm → $r = 3$ cm (esempio 6); $R = 3$ cm → $h = 4{,}5$ cm.

Distrattori: il rapporto rovesciato ($R$ un terzo e $r$ due terzi dell'altezza), il centro come punto
medio dell'altezza ($r = R = \frac{h}{2}$), $R$ scambiato con l'altezza.

## Da evitare

- Triangoli acutangoli con due angoli massimi uguali nel livello 3 (vertice ambiguo nelle opzioni).
- Il triangolo equilatero nei livelli 5 e 6 ($60^\circ$, $60^\circ$).
- Frazioni periodiche tra le opzioni quando la risposta è un decimale; decimali con zeri finali.
- Proprietà del livello 1 vere di due punti ("sempre interno").

## Variante a scelta multipla

Quattro opzioni distinte in valore e in LaTeX, una sola giusta. Per i livelli numerici la prima
scelta sono i distrattori elencati sopra; se coincidono con la risposta o tra loro, si completa con
valori vicini (un centimetro o mezzo, dieci gradi). Livelli 1 e 3: la risposta è già a scelta.

## Figure

Nessun livello usa una figura. Una figura aiuterebbe il livello 3 (il triangolo con i tre angoli e
il punto da collocare) e i livelli 5 e 6 (il triangolo con le due bisettrici o le due altezze, come
nelle figure `esempio-angolo-bic` ed `esempio-angolo-bhc` della lezione): il testo basta, ma lo
studente deve disegnarsi il triangolo da solo.

## Verifica

Il controllo Python rilegge i dati dalla prosa del problema e ritrova la risposta con la geometria,
non con le formule della lezione: coordinate esatte di SymPy per il 2 : 1 del baricentro (livello 2),
per il triangolo rettangolo 3-4-5 scalato sull'ipotenusa (livello 4) e per l'equilatero (livello 7);
coordinate in virgola mobile per il triangolo con gli angoli dati, dove ortocentro, circocentro,
incentro e baricentro si calcolano dalle definizioni e si collocano (dentro, fuori, su un vertice, sul
punto medio di un lato: livello 3) o si misura l'angolo con `atan2` (livelli 5 e 6). Il livello 1
classifica descrizioni e opzioni con parole chiave, una lista per punto, e pretende che ogni testo
corrisponda a un solo punto. Controlla anche le quote dei casi (`CASE_RANGES`), la forma delle
opzioni e che l'opzione giusta sia l'unica uguale alla risposta.

- `sample.mts geometria-punti-notevoli 1000 all 1 | verify.py`: PASS (7.000 esercizi).
- Stesso comando con seed di partenza 7001: PASS.
- La prima esecuzione ha trovato 17 esercizi del livello 3 con due angoli massimi uguali (triangolo
  acutangolo isoscele sulla base minore): le opzioni nominavano un vertice a caso tra i due. Corretto
  nel generatore chiedendo un solo angolo massimo.
- Errori piantati, tutti bocciati: risposta cambiata (livello 2), opzione giusta spostata (livello 3),
  un angolo portato a $95^\circ$ nel triangolo "acutangolo" (livello 6), descrizione cambiata da
  mediane a bisettrici e da case a strade (livello 1), due opzioni con la stessa proprietà (livello
  1), LaTeX dell'opzione giusta con un numero diverso dal suo valore (livello 7), ipotenusa con le
  lettere sbagliate (livello 4), risposta $90^\circ + \hat{A}$ al posto di $90^\circ +
  \frac{\hat{A}}{2}$ (livello 5), solo tre opzioni (livello 2), angoli che non sommano $180^\circ$
  (livello 3). Un campione buono di controllo passa.
- `width.mts`: esce con 0; nessuna formula del problema da misurare (è tutto prosa), opzioni al
  massimo 226 px (livello 1, su due righe con `gathered`), 178 px al livello 3, 72 px ai livelli
  numerici.
- `review.mts` esce con 0; `steps-scan` non trova niente; `tsc` ed `eslint` puliti sul generatore.

Esercizi diversi su 1.000 (seed da 1), contando il problema; tra parentesi contando anche le opzioni:

| Livello | Diversi |
|---|---|
| 1 | 80 (335) |
| 2 | 347 |
| 3 | 801 |
| 4 | 417 |
| 5 | 975 |
| 6 | 540 |
| 7 | 167 |

Il livello 1 ha 80 testi diversi: 19 descrizioni per quattro nomi di triangolo e le quattro domande
"quale proprietà ha", perché le proprietà che la lezione dà a ogni punto sono poche. Nel secondo caso
cambiano le opzioni (13 proprietà, una giusta e tre degli altri punti), e contando anche quelle gli
esercizi diversi sono 335. Allargarlo vorrebbe dire inventare proprietà
che la lezione non enuncia.

## Domande per la revisione

- Livello 1: la descrizione "ottusangolo in $C$, $P$ è fuori dal triangolo dalla parte del vertice
  $C$" distingue l'ortocentro dal circocentro (che è fuori dalla parte opposta, oltre $AB$) solo per
  chi ricorda la tabella. È giusto chiederlo al primo livello, o va spostata al livello 3?
- Livello 4: $CG = \frac{11}{3}$ cm esce come frazione, come nell'esempio 4 della lezione ("circa
  $3{,}33$"). Le opzioni allora mescolano frazioni e decimali ($\frac{11}{3}$, $2{,}75$, $\frac{22}{3}$,
  $\frac{11}{6}$). Meglio tenere solo ipotenuse multiple di 3?
- Livello 5: il triangolo può essere ottusangolo o rettangolo (l'incentro è sempre interno), mentre il
  livello 6 è solo acutangolo, come la formula $180^\circ - \hat{A}$ della lezione. Nel triangolo
  ottusangolo l'angolo tra le rette delle altezze esiste lo stesso: si vuole un livello in più?
- Nomi dei triangoli nel livello 1 ($DEF$, $RST$, $KLM$): la lezione usa solo $ABC$. Servono a variare
  il testo; se confondono, si torna ad $ABC$.
