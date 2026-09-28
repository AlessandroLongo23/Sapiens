# Teoremi di Pitagora e di Euclide

Generatore: `teorema-di-pitagora` (`src/lib/exercises/v2/generators/teorema-di-pitagora.ts`).
Verifica indipendente: `scripts/exercises/checkers/teorema_di_pitagora.py`. Lezione collegata:
`docs/lezioni/riscritte/100-teorema-di-pitagora.md` (nota in `docs/lezioni/note/100-teorema-di-pitagora.md`,
sezione "Per il generatore").

Sette livelli nell'ordine della lezione, gli stessi sette proposti dalla nota: l'ipotenusa dai cateti, un cateto
dall'ipotenusa, i risultati con un radicale da semplificare, l'inverso del teorema di Pitagora, i teoremi di Euclide,
le figure particolari (quadrato, triangolo equilatero, triangoli con gli angoli di $45^\circ$ e di $30^\circ$ e
$60^\circ$), i problemi con i quadrilateri. Il sito non disegna figure negli esercizi: ogni esercizio si regge sul
testo.

## Convenzioni

Quelle della lezione: triangolo $ABC$ rettangolo in $C$, ipotenusa $AB$, altezza $CH$ relativa all'ipotenusa,
proiezioni $AH$ e $HB$; misure scritte $\overline{AB}$ e quadrati $\overline{AC}^{\,2}$ (con `\,` dopo il soprassegno);
nei testi senza nomi le lettere della lezione $a$, $b$ per i cateti e $c$ per l'ipotenusa. Misure in centimetri, aree
in $\text{cm}^2$, come negli esempi. Radicali sempre ridotti ($4\sqrt{2}$, $\frac{5\sqrt{3}}{2}$), senza radicali al
denominatore ($\frac{8}{\sqrt{2}}$ diventa $4\sqrt{2}$, come nella lezione). Il testo di ogni problema è prosa con le
formule tra dollari (`textBlock`), che la pagina manda a capo da sola.

## Forma della risposta

- Livelli 1, 2 e 7: `number`, una misura intera. Variante a scelta fra quattro misure con l'unità
  (`15\ \text{cm}`, `128\ \text{cm}^2`); i distrattori possono essere radicali ($\sqrt{194}\ \text{cm}$).
- Livelli 3, 5 e 6: `expression` con `form: "simplified"`: `value` in SymPy (`4*sqrt(2)`, `5*sqrt(3)/2`, `12`),
  `latex` il numero ridotto ($4\sqrt{2}$). Variante a scelta fra quattro misure, tutte ridotte e diverse in valore.
- Livello 4: `choice` fra quattro etichette fisse, sempre nello stesso ordine: `\text{Rettangolo in }A`,
  `\text{Rettangolo in }B`, `\text{Rettangolo in }C`, `\text{Non è rettangolo}`, con `values` `["A"]`, `["B"]`,
  `["C"]`, `["no"]`.

`params` porta il caso, i dati, la risposta come `surd` $[a, b, r, d]$ (cioè $\frac{a + b\sqrt{r}}{d}$), l'unità e i
distrattori nella stessa forma.

## Terne

Le quattro terne della tabella della lezione, $3, 4, 5$; $5, 12, 13$; $8, 15, 17$; $7, 24, 25$, e i loro multipli
con l'ipotenusa entro il limite del livello. La famiglia si sceglie con i pesi 4, 3, 2, 2 (la $3, 4, 5$ è la più
comune nei libri), poi il multiplo a caso. Quando il triangolo è un multiplo, i passaggi lo dicono ("È la terna
$3, 4, 5$ moltiplicata per $8$"), come il riquadro "Riconoscere una terna".

## Livelli

### 1. L'ipotenusa dai cateti
$c = \sqrt{a^2 + b^2}$ con una terna intera, ipotenusa fino a $60$ cm (esempio 2). Sei volte su dieci il triangolo
$ABC$ con i cateti $AC$ e $BC$ nominati in ordine casuale, quattro volte su dieci il testo senza nomi ("Un triangolo
rettangolo ha i cateti di $8$ cm e $6$ cm").
Esempi: cateti $8$ e $6$, ipotenusa $10$ cm; $\overline{BC} = 24$, $\overline{AC} = 32$, $\overline{AB} = 40$ cm.
Distrattori: la somma dei cateti (avviso "La radice di una somma non è la somma delle radici"), la radice della
differenza dei quadrati, il quadrato scambiato per il doppio ($\sqrt{2a + 2b}$), e per ultimo il quadrato
dell'ipotenusa senza radice; poi numeri vicini.

### 2. Un cateto dall'ipotenusa
$a = \sqrt{c^2 - b^2}$ con una terna intera, ipotenusa fino a $60$ cm (esempio 2). Stesse due forme del testo; nel
triangolo $ABC$ il cateto dato e quello chiesto si scambiano a caso.
Esempi: ipotenusa $13$, cateto $5$, altro cateto $12$ cm; $\overline{AB} = 45$, $\overline{BC} = 27$,
$\overline{AC} = 36$ cm.
Distrattori: la radice della somma dei quadrati ($\sqrt{194} \approx 13{,}9$ con $13$ e $5$, avviso "Per il cateto si
sottrae"), la differenza delle misure, il quadrato scambiato per il doppio, il risultato senza radice.

### 3. Radicali da semplificare
Come i livelli 1 e 2, metà ipotenusa e metà cateto, ma il risultato è un radicale $k\sqrt{r}$ con $k$ da $2$ a $12$
e $r$ senza fattori quadrati fino a $30$: c'è sempre qualcosa da portare fuori ($\sqrt{32} = \sqrt{16 \cdot 2} =
4\sqrt{2}$). Cateti fino a $15$ per l'ipotenusa; ipotenusa fino a $20$ per il cateto.
Esempi: cateti $6$ e $6$, $6\sqrt{2}$ cm; ipotenusa $9$ e cateto $3$, $6\sqrt{2}$ cm.
Distrattori: il quadrato portato fuori al posto della sua radice ($36\sqrt{2}$ per $\sqrt{72}$), la somma (o la
differenza) delle misure, la radice con il segno sbagliato, il radicando senza radice.
Cambiato rispetto alla nota: il distrattore "radicale non semplificato" ($\sqrt{32}$, $2\sqrt{8}$) ha lo stesso valore
della risposta, e due opzioni uguali come numeri non sono ammesse. La forma ridotta si chiede nella risposta aperta
(`form: "simplified"`): $\sqrt{32}$ scritto dallo studente non è accettato come $4\sqrt{2}$.

### 4. L'inverso del teorema di Pitagora
"I lati del triangolo $ABC$ misurano $\overline{AB} = 25$ cm, $\overline{BC} = 7$ cm e $\overline{CA} = 24$ cm. Il
triangolo è rettangolo? Se sì, in quale vertice?" Metà rettangoli e metà no. Il lato più lungo è unico; i tre lati
sono assegnati a $BC$, $CA$, $AB$ a caso, così l'angolo retto cade in $A$, $B$ o $C$ con la stessa frequenza, e sono
elencati in ordine casuale. Tre volte su dieci un lato è un radicale:
- rettangoli: una terna (ipotenusa fino a $50$), oppure cateti interi da $1$ a $9$ con l'ipotenusa $\sqrt{a^2 + b^2}$,
  oppure ipotenusa intera fino a $12$ e un cateto radicale;
- non rettangoli: una terna con un lato cambiato di $\pm 1$ o $\pm 2$ (7 su 10) o tre interi a caso da $3$ a $30$
  (3 su 10), come $6$, $7$, $9$ della lezione; con il radicale, $\sqrt{a^2 + b^2 \pm 1, 2, 3}$.
I lati devono formare un triangolo (disuguaglianza triangolare stretta).
Esempi: $18$, $24$, $30$ con $\overline{AB} = 30$: rettangolo in $C$; $\overline{CA} = 5$, $\overline{AB} =
\sqrt{43}$, $\overline{BC} = 4$: non rettangolo ($25 + 16 = 41 \neq 43$).
Distrattori: le altre tre etichette, fra cui il vertice opposto a un lato che non è il più lungo (l'avviso della
nota "controllo con il lato sbagliato come ipotenusa").

### 5. I teoremi di Euclide
Il triangolo $ABC$ rettangolo in $C$ con l'altezza $CH$; le proiezioni $\overline{AH} = p$ e $\overline{HB} = q$ sono
interi con $p + q \le 40$. Quattro casi:
- cateto dal primo teorema (3 su 10): dati l'ipotenusa e la proiezione, $\overline{AC} = \sqrt{c \cdot p}$ (esempio 1);
  tre volte su dieci è data la proiezione dell'altro cateto, da sottrarre prima. Metà dei cateti interi, metà
  radicali;
- proiezione dal primo teorema (2 su 10): dati l'ipotenusa e un cateto intero, $p = \frac{b^2}{c}$ intera;
- altezza dal secondo teorema (3 su 10): date le due proiezioni, $\overline{CH} = \sqrt{p \cdot q}$ (esempio 3), metà
  intera e metà radicale;
- proiezione dal secondo teorema (2 su 10): dati $CH$ intero e una proiezione, l'altra è $\frac{h^2}{p}$, intera.
Il lato del triangolo ($A$ o $B$) si sceglie a caso. Radicali con coefficiente fino a $30$ e radicando fino a $30$.
Esempi: $\overline{AB} = 28$, $\overline{HB} = 7$, $\overline{BC} = 14$ cm; $\overline{AH} = 24$, $\overline{HB} = 6$,
$\overline{CH} = 12$ cm.
Distrattori: il cateto con la proiezione dell'altro ($20$ invece di $15$, avviso "La proiezione giusta"), il prodotto
senza radice, Pitagora con la proiezione al posto del cateto; per la proiezione l'altra proiezione, il quadrato non
diviso, l'altro cateto; per l'altezza la media delle proiezioni, il prodotto senza radice, un cateto, la radice della
somma; per la proiezione dall'altezza il cateto $\sqrt{h^2 + p^2}$, $h^2$ non diviso, $\sqrt{|h^2 - p^2|}$ (l'altezza
presa come ipotenusa), $\frac{p^2}{h}$.

### 6. Quadrato, equilatero, 45° e 30°-60°
Quattro casi, il dato intero da $2$ a $20$ (o $k\sqrt{3}$ con $k \le 12$):
- quadrato (2,5 su 10): la diagonale dal lato ($\ell\sqrt{2}$) o il lato dalla diagonale ($\frac{d\sqrt{2}}{2}$, con la
  razionalizzazione della lezione);
- triangolo equilatero (2,5 su 10): l'altezza dal lato, l'area dal lato (in $\text{cm}^2$, lato fino a $16$), il lato
  dall'altezza $k\sqrt{3}$;
- triangolo con gli angoli di $30^\circ$ e $60^\circ$ (3 su 10, esempio 4): il testo dà uno solo dei due angoli
  ($30^\circ$ o $60^\circ$, a caso) e un lato fra ipotenusa, cateto opposto a $30^\circ$ e cateto opposto a $60^\circ$
  (questo come $k\sqrt{3}$); chiede uno degli altri due. Il cateto corto dall'ipotenusa si chiede solo con
  l'ipotenusa pari, per non dare $\frac{7}{2}$;
- triangolo rettangolo isoscele o con un angolo di $45^\circ$ (2 su 10): l'ipotenusa da un cateto o un cateto
  dall'ipotenusa.
Esempi: diagonale $8$, lato $4\sqrt{2}$ cm; angolo di $30^\circ$ e ipotenusa $16$, cateto opposto a $30^\circ$ $8$ cm.
Distrattori: per il quadrato $2\ell$, $2\ell^2$ (radice dimenticata), $\ell\sqrt{3}$; dalla diagonale $d\sqrt{2}$
(moltiplicato invece di diviso), $\frac{d}{2}$, $\frac{d^2}{2}$. Per l'equilatero l'altezza non divisa per $2$,
$\frac{\ell\sqrt{2}}{2}$, $\frac{3\ell^2}{4}$; l'area non divisa per $2$, l'altezza al posto dell'area,
$\ell^2\sqrt{3}$. Per il $30^\circ$-$60^\circ$ i due cateti scambiati (il cateto opposto a $30^\circ$ uguale a
$\frac{\ell\sqrt{3}}{2}$, avviso "Il cateto opposto all'angolo di 30°"), la costante del quadrato, il doppio o la
metà. Per il $45^\circ$ il doppio, la costante $\sqrt{3}$, la metà.

### 7. Problemi con i quadrilateri
Un quarto ciascuno: rettangolo, rombo, trapezio isoscele, trapezio rettangolo (esempi 5, 6, 7 e 8). Il triangolo
rettangolo nascosto viene da una terna con l'ipotenusa fino a $30$; la risposta è sempre intera.
- Rettangolo: base e diagonale, si chiede l'altezza, il perimetro o l'area; oppure base e altezza, la diagonale.
- Rombo: le diagonali (doppi dei cateti), il lato o il perimetro; oppure il lato e una diagonale, l'altra diagonale
  o l'area.
- Trapezio isoscele: le basi (la minore da $2$ a $20$, la maggiore fino a $60$) e i lati obliqui, l'altezza o l'area;
  oppure le basi e l'altezza, il lato obliquo o il perimetro.
- Trapezio rettangolo: le basi e l'altezza, il lato obliquo o il perimetro; oppure le basi e il lato obliquo,
  l'altezza o l'area (area intera, altrimenti si estraggono di nuovo i numeri).
Esempi: base $15$ e diagonale $17$, altezza $8$ cm; trapezio isoscele con le basi $20$ e $12$ e i lati obliqui $5$,
altezza $3$ cm.
Distrattori: il lato obliquo al posto dell'altezza nell'area ($160$ invece di $128$, avviso "Il lato obliquo non è
l'altezza"), nel trapezio isoscele la differenza delle basi non divisa per $2$, nel trapezio rettangolo la base
maggiore al posto della differenza, nel rombo le diagonali intere al posto delle metà, l'area non divisa per $2$, il
perimetro con un lato dimenticato o contato due volte, la diagonale del rettangolo presa come lato.

## Costruzione all'indietro

Il caso di ogni livello si estrae una volta sola; se i numeri non vanno bene si estraggono di nuovo solo i numeri,
così le quote restano quelle della specifica. Livelli 1, 2, 7: dalla terna. Livello 3: dall'elenco delle coppie di
cateti (o ipotenusa e cateto) il cui risultato è $k\sqrt{r}$ nei limiti. Livello 4: dai quadrati dei lati. Livello 5:
dalle proiezioni $p$ e $q$, filtrate per caso (prodotto quadrato o no). Livello 6: dal dato, la risposta è un multiplo
di $\sqrt{2}$ o $\sqrt{3}$.

## Controllo indipendente

Il controllo legge ogni esercizio dal testo e costruisce la figura con le coordinate in SymPy, senza le formule della
lezione:
- livelli 1, 2, 3, 5: $A(0, 0)$, $B(c, 0)$, $C(x, y)$ con $y > 0$ e $H(x, 0)$; l'angolo retto in $C$ è il prodotto
  scalare $\vec{CA} \cdot \vec{CB} = 0$; ogni dato del testo diventa un'equazione, `solve` deve dare un solo
  triangolo, e la misura chiesta è una distanza fra due punti;
- livello 4: il triangolo si costruisce dai tre lati ($B$ nell'origine, $C$ sull'asse, $A$ da due circonferenze) e
  ogni angolo si prova con il prodotto scalare;
- livello 6: la figura unitaria (quadrato di lato $1$, `Triangle(sss=(1, 1, 1))`, `Triangle(asa=(30, 1, 60))`,
  `Triangle(asa=(45, 1, 45))`) dà il rapporto fra l'elemento chiesto e quello dato; le aree scalano con il quadrato;
- livello 7: il quadrilatero con le coordinate e una o due incognite (l'altezza, lo scarto della base del trapezio
  isoscele, la semidiagonale), ricavate dai dati; perimetro e area da `Polygon`.
Pretende: la risposta del tipo giusto, il valore e il LaTeX uguali alla verità, il LaTeX ridotto (frazioni ai minimi
termini, radicando senza fattori quadrati, coefficiente e denominatore primi fra loro); quattro opzioni con l'unità
giusta, rilette dal LaTeX e uguali ai loro `values`, diverse come numeri, una sola giusta e l'indice giusto; i limiti
dei dati di ogni livello; niente trattini lunghi, "piuttosto che", `+ -`, `1\sqrt`. Il caso si ricalcola dal testo e
le quote si controllano con gli intervalli di `CASE_RANGES`.

## Domande per la revisione

- Livelli 1, 2 e 7: il distrattore "radice dimenticata" ($1600$ cm per l'ipotenusa di $24$ e $32$) è un errore vero ma
  si scarta a occhio; ora entra solo quando mancano gli altri. Meglio toglierlo del tutto e usare numeri vicini?
- Livello 3: il radicale non semplificato non può essere un'opzione (ha lo stesso valore), quindi la
  semplificazione si controlla solo nella risposta aperta. Va bene così, o volete un esercizio a parte "quale di
  queste è la forma ridotta"?
- Livello 4: è una domanda sola ("rettangolo? in quale vertice?") con quattro etichette. La nota non parla della
  classificazione acutangolo/ottusangolo ($c^2 \gtrless a^2 + b^2$), che la lezione non tratta: se Andrea la vuole, il
  livello si allarga.
- Livello 5: i teoremi di Euclide sono scritti con i segmenti ($\overline{AC}^{\,2} = \overline{AB} \cdot
  \overline{AH}$) come nella lezione; se il libro in uso usa $c_1^2 = i \cdot p_1$, vanno cambiati i passaggi.
- Livello 6: il testo del $30^\circ$-$60^\circ$ dà un solo angolo acuto e lascia dedurre l'altro, come l'esempio 4.
  Il cateto opposto a $60^\circ$ come dato ($k\sqrt{3}$) è fuori dagli esempi della lezione ma segue dalla tabella:
  lo teniamo?
- Livello 7: nel rombo "una diagonale" è sempre il doppio di un cateto della terna; nel trapezio isoscele la base
  minore va da $2$ a $20$. Numeri da allineare al libro, da verificare.
- Figure: vorrebbero una figura il livello 5 (il triangolo con l'altezza e le due proiezioni, per non confondere
  $AH$ e $HB$), il livello 7 (i quadrilateri con il triangolo rettangolo da trovare) e il livello 6 per i triangoli
  $30^\circ$-$60^\circ$, come dice la nota.
- Angolo retto in $C$ e lettere $a$, $b$, $c$: seguono la lezione, che le segna "da verificare con il libro in uso".
