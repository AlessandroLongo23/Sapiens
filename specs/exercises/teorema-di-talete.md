# Teorema di Talete

Generatore: `teorema-di-talete` (`src/lib/exercises/v2/generators/teorema-di-talete.ts`). Verifica
indipendente: `scripts/exercises/checkers/teorema_di_talete.py`. Lezione collegata: "Teorema di Talete"
(`docs/lezioni/riscritte/102-teorema-di-talete.md`), con la nota `docs/lezioni/note/102-teorema-di-talete.md`
(sezione "Per il generatore").

Otto livelli, uno per ciascuna proposta della nota e nell'ordine della lezione: il quarto segmento con il
fascio, il segmento intero con i decimali, un'incognita in due segmenti, la parallela a un lato del
triangolo, il teorema inverso, il teorema della bisettrice, il segmento dei punti medi, i problemi di
divisione in parti proporzionali. Otto sono uno in più del solito: ho tenuto la proposta della nota
perché ogni livello porta un teorema o un passaggio nuovo, e fondere due livelli avrebbe messo due
difficoltà nello stesso gradino. Niente figure: ogni esercizio si regge sul testo (vedi "Livelli che
vorrebbero una figura").

## Rappresentazione

- Il testo sta nel `problem`, come righe `\text{...}` scritte con `textBlock` (la pagina le mostra come
  paragrafo); il `prompt` è la consegna breve ("Risolvi il problema.", "Rispondi sì o no.").
- Livello 5: risposta `choice` con due opzioni, "sì, $DE \parallel BC$" e "no, $DE \nparallel BC$".
- Gli altri livelli: risposta `number`, un razionale esatto in `answer.value` (in forma ridotta, `"15"` o
  `"77/5"`), sempre un decimale finito con al più una cifra dopo la virgola. La variante `choice` ha
  quattro opzioni scritte `15\text{ cm}`, `2{,}8\text{ cm}`, `40\text{ m}` o, senza unità, `9`.
- `params.case` dice il caso; `params.wrong` gli errori tipici da cui vengono le opzioni sbagliate;
  `params.unit` (`cm`, `m` o vuoto). Il controllo non legge i dati dai `params`: li rilegge dal testo e
  ricostruisce la figura con le coordinate.

## Regole comuni

- Notazioni della lezione: fascio di parallele $a$, $b$, $c$; trasversali $r$ (punti $A$, $B$, $C$) e $s$
  (punti $A'$, $B'$, $C'$); nel triangolo $D$ su $AB$, $E$ su $AC$, $DE \parallel BC$; la bisettrice incontra
  il lato opposto in $D$; punti medi $M$ di $AB$, $N$ di $AC$, $P$ di $BC$. Misure con il soprassegno,
  $\overline{AB} = 4$ cm; proporzioni tra segmenti senza soprassegno, $AB : BC = A'B' : B'C'$; virgola
  decimale `{,}`; `\cdot`; "ed" davanti ad $A$ e ad $E$ come nella lezione ("ed $\overline{EC} = 8$").
- Unità come negli esempi della lezione: cm nei livelli 1, 2, 4, 6, 7 e nella bisettrice del livello 8;
  m nei lotti del livello 8; nessuna unità nei livelli 3 e 5 (esempi 3 e 5 della lezione).
- Dati con al più un decimale; risposte decimali finite con al più un decimale. Le opzioni sbagliate con
  due decimali o periodiche sono scartate.
- Passaggi come nella lezione: la proporzione con i nomi dei segmenti, poi con i numeri, poi "il prodotto
  dei medi è uguale al prodotto degli estremi" ($4x = 10 \cdot 6$), poi $x$.
- Niente trattini lunghi e niente "piuttosto che" nei testi (il `check()` lo controlla).

## Livello 1: il quarto segmento

"Un fascio di parallele $a$, $b$, $c$ taglia la trasversale $r$ nei punti $A$, $B$, $C$ e la trasversale
$s$ nei punti $A'$, $B'$, $C'$. Sai che $\overline{AB} = 4$ cm, $\overline{BC} = 10$ cm e
$\overline{A'B'} = 6$ cm. Trova $B'C'$." Dati sempre $AB$ e $BC$ su $r$ e una parte su $s$; chiesta l'altra
parte su $s$ ($B'C'$ o $A'B'$, metà e metà). Numeri costruiti dal rapporto: $AB = g p_0$, $BC = g q_0$,
$A'B' = h p_0$, $B'C' = h q_0$ con $g \le 4$, $h \le 12$ primi tra loro, $p_0 \ne q_0$, $h \ne g$ (niente
segmenti congruenti, niente trasversali con lo stesso passo); tutto intero tra 2 e 40.

Esempi: $\overline{AB} = 4$, $\overline{BC} = 10$, $\overline{A'B'} = 6$ → $\overline{B'C'} = 15$ cm (esempio 1
della lezione); $\overline{AB} = 15$, $\overline{BC} = 3$, $\overline{B'C'} = 5$ → $\overline{A'B'} = 25$ cm.

Distrattori: i corrispondenti in ordine scambiato ($AB : BC = B'C' : A'B'$, il $2{,}4$ dell'avviso della
lezione); la stessa differenza sulle due trasversali ($B'C' - A'B' = BC - AB$); medi ed estremi confusi
($AB \cdot BC = A'B' \cdot B'C'$); il corrispondente sbagliato (il segmento intero al posto della parte).

## Livello 2: il segmento intero e i decimali

Come il livello 1, con due passi in più. Un segmento intero ($AC$ o $A'C'$) compare sempre, tra i dati o
come segmento chiesto, quindi a volte serve una somma o una differenza prima della proporzione (la
lezione: "vale per due segmenti qualsiasi di $r$, anche uno dentro l'altro"); metà delle volte i due dati
sono su $s$ e l'incognita su $r$. Il rapporto tra le trasversali è $h/g$ con $g \in \{1, 2, 5\}$ e sta tra
$\frac{1}{3}$ e $3$; i segmenti interi al più 40 cm; la risposta è decimale sei volte su dieci.

Esempi: $\overline{BC} = 18$, $\overline{AC} = 24$, $\overline{A'B'} = 2{,}4$ → $\overline{A'C'} = 9{,}6$ cm
($AB = 6$, $AB : AC = A'B' : A'C'$); $\overline{AC} = 3{,}6$, $\overline{A'B'} = 4$, $\overline{B'C'} = 5$ →
$\overline{AB} = 1{,}6$ cm.

Distrattori: quelli del livello 1, più la parte al posto dell'intero e l'intero al posto della parte (il
segmento corrispondente sbagliato), e l'altra parte della stessa trasversale.

## Livello 3: un'incognita in due segmenti

"Su $r$ il segmento $AB$ misura $x$ e $BC$ misura $x + 3$; su $s$, $\overline{A'B'} = 4$ e
$\overline{B'C'} = 6$. Trova $BC$." (esempio 3 della lezione). La $x$ sta su $AB$ o su $BC$, l'altro
segmento è $x + k$ (sette volte su dieci) o $x - k$, con $x$ intero da 2 a 15 e $k$ da 1 a 9; le
incognite stanno su $r$ sei volte su dieci, su $s$ le altre. Sull'altra trasversale due interi nello
stesso rapporto, mai uguali ai segmenti della prima. Chiesto, un terzo ciascuno: il segmento $x$, l'altro,
il segmento intero ($AC$ o $A'C'$). I passaggi seguono l'esempio 3: $x : (x + 3) = 4 : 6$, $6x = 4(x + 3)$,
$6x = 4x + 12$, $2x = 12$, $x = 6$.

Esempi: $AB = x + 3$, $BC = x$, $\overline{A'B'} = 18$, $\overline{B'C'} = 12$, trova $AC$ → $15$;
$A'B' = x + 5$, $B'C' = x$, $\overline{AB} = 21$, $\overline{BC} = 6$, trova $A'B'$ → $7$.

Distrattori: $x$ al posto del segmento chiesto (e viceversa), l'altro segmento, l'intero al posto della
parte, la soluzione con le parentesi dimenticate ($6x + 3$ al posto di $6(x + 3)$), la proporzione
capovolta, quando danno un numero positivo.

## Livello 4: la parallela a un lato del triangolo

"Nel triangolo $ABC$ il segmento $DE$ è parallelo a $BC$, con $D$ su $AB$ ed $E$ su $AC$. Sai che
$\overline{AD} = 4$ cm, $\overline{DB} = 6$ cm e $\overline{AE} = 5$ cm. Trova $EC$." (esempio 4). Due dati su
un lato ($AD$, $DB$ o il lato intero), uno sull'altro; chiesta una parte o il lato intero ("Trova il lato
$AC$"), il lato quattro volte e mezza su dieci. Numeri come nel livello 2 (lati fino a 40 cm, risposta
decimale metà delle volte).

Esempi: $\overline{DB} = 6$, $\overline{AE} = 3$, $\overline{EC} = 5$ → $\overline{AD} = 3{,}6$ cm;
$\overline{AD} = 8$, $\overline{DB} = 7$, $\overline{AC} = 24$ → $\overline{EC} = 11{,}2$ cm.

Distrattori: la parte al posto del lato intero e il lato al posto della parte, i corrispondenti in
ordine scambiato, la stessa differenza sui due lati, medi ed estremi confusi.

## Livello 5: il teorema inverso

"Nel triangolo $ABC$ il punto $D$ sta su $AB$ con $\overline{AD} = 3$ e $\overline{DB} = 6$, il punto $E$ sta
su $AC$ con $\overline{AE} = 4$ ed $\overline{EC} = 8$. Il segmento $DE$ è parallelo a $BC$?" (esempio 5).
Numeri interi da 2 a 30. Tre casi: parallelo (metà delle volte); quasi proporzione (tre su dieci: $AE$ o
$EC$ spostato di 1, quando vale almeno 4, così i due rapporti differiscono al più di un terzo, come il
$3 \cdot 7 = 21$ contro $24$ della lezione); proporzione rovesciata (due su dieci:
$AD : DB = EC : AE$, l'errore dell'ordine dei corrispondenti). Una volta su tre al posto di $DB$ o di
$EC$ c'è il lato intero ($AB$ o $AC$), e il primo passo è una sottrazione. I passaggi confrontano il
prodotto dei medi con il prodotto degli estremi.

Esempi: $3, 6, 4, 8$ → sì; $\overline{AD} = 18$, $\overline{DB} = 30$, $\overline{AE} = 6$,
$\overline{EC} = 11$ → no ($30 \cdot 6 = 180$, $18 \cdot 11 = 198$).

## Livello 6: il teorema della bisettrice

"Nel triangolo $ABC$ i lati misurano $\overline{AB} = 6$ cm, $\overline{AC} = 9$ cm e $\overline{BC} = 10$ cm.
La bisettrice dell'angolo $\hat{A}$ incontra $BC$ in $D$. Trova $BD$." (esempio 6). Il vertice della
bisettrice è $A$, $B$ o $C$; i due lati che partono dal vertice sono interi e diversi tra 3 e 20 (triangolo
mai isoscele sulla base, altrimenti la bisettrice è la mediana), il lato opposto intero fino a 30 con la
disuguaglianza triangolare stretta; la parte chiesta ha al più un decimale. Metà delle volte si chiede la
parte vicina al lato più lungo. Passaggi dell'esempio 6: $x : (10 - x) = 6 : 9$, $9x = 6(10 - x)$, ...

Esempi: $\overline{AB} = 8$, $\overline{AC} = 10$, $\overline{BC} = 15$, bisettrice di $\hat{C}$, trova $AD$
→ $3{,}2$ cm; $6, 9, 10$, bisettrice di $\hat{A}$, trova $BD$ → $4$ cm.

Distrattori (avviso "La bisettrice non passa per il punto medio"): metà del lato opposto; l'altra parte
(la parte lunga vicino al lato corto); $x : BC = AB : AC$, quando resta minore del lato.

## Livello 7: il segmento dei punti medi

Un terzo per caso:

- lato: "Nel triangolo $ABC$ i lati misurano ... I punti $M$ e $N$ sono i punti medi di $AB$ e $AC$.
  Trova $MN$." La coppia di punti medi è $MN$, $NP$ o $MP$; risposta metà del terzo lato;
- inverso: "... i punti $M$ e $N$ sono i punti medi di $AB$ e $AC$, e $\overline{MN} = 7$ cm. Trova $BC$."
  Il lato è intero da 3 a 40, il segmento dato la sua metà;
- perimetro: il perimetro del triangolo $MNP$ (esempio 7), metà di quello di $ABC$.

Lati interi da 4 a 30, tutti diversi, con la disuguaglianza triangolare stretta.

Esempi: $\overline{AB} = 30$, $\overline{AC} = 22$, $\overline{BC} = 18$, trova $MN$ → $9$ cm;
$\overline{MN} = 11{,}5$ cm → $\overline{BC} = 23$ cm; lati $11$, $18$, $27$ → perimetro di $MNP$ $28$ cm.

Distrattori: il doppio invece della metà (e la metà invece del doppio), il lato stesso, la metà di un
altro lato; per il perimetro il perimetro di $ABC$, un quarto, il doppio.

## Livello 8: parti proporzionali

Metà e metà:

- lotti (esempio 9): tre fronti su $r$, multipli di 5 tra 10 e 80 e diversi, il totale su $s$ intero fino
  a 400 m, in rapporto tra $\frac{1}{2}$ e $2$ (mai 1) con il totale su $r$; chiesto il fronte del primo,
  del secondo o del terzo lotto su $s$;
- bisettrice e perimetro (esempio 10): $BD$ e $DC$ interi diversi da 2 a 15, i lati $AB$ e $AC$ nel
  rapporto $BD : DC$ con al più un decimale, il perimetro intero fino a 100 cm, triangolo che esiste;
  chiesto $AB$ o $AC$. I passaggi usano la proprietà del comporre come la lezione.

Esempi: fronti $20$, $65$, $45$ m, totale su $s$ $260$ m, primo lotto → $40$ m; perimetro $63$ cm,
$\overline{BD} = 9$, $\overline{DC} = 12$, trova $AB$ → $18$ cm.

Distrattori: il totale diviso in parti uguali; per i lotti la stessa differenza aggiunta a ogni fronte,
il rapporto capovolto, il fronte invariato; per la bisettrice l'altro lato, il perimetro intero diviso
nel rapporto al posto di $AB + AC$, il rapporto delle parti capovolto.

## Il controllo

`teorema_di_talete.py` rilegge i dati dal testo e costruisce la figura con coordinate esatte (SymPy):
nel fascio le parallele sono orizzontali e la seconda trasversale ha la pendenza che dà al suo segmento
noto la misura del testo; nel triangolo un lato sta sull'asse $x$ e l'altro lungo $(\frac{3}{5}, \frac{4}{5})$,
con la lunghezza incognita come simbolo fissato dal dato; il parallelismo si prova con un prodotto
vettoriale, con due angoli diversi in $A$; la bisettrice è la retta lungo la somma dei due versori; i punti
medi si calcolano dalle coordinate del triangolo costruito dai lati. Controlla anche le quote dei casi,
la forma dei numeri (virgola, niente zeri finali, risposta ridotta) e le opzioni (quattro, diverse come
numeri, una sola giusta).

## Da evitare

- Segmenti congruenti su una trasversale e trasversali con lo stesso passo nel livello 1 (il rapporto 1
  rende l'esercizio una copia).
- Triangoli isosceli sulla base nel livello 6, triangoli che non esistono nei livelli 6, 7, 8.
- Dati incoerenti: parti negative quando si sottrae dal segmento intero, $AB + AC$ minore di $BC$.
- Quasi proporzioni lontane nel livello 5 (con numeri piccoli spostare di 1 cambia il rapporto di
  metà: si sposta solo un valore almeno 4).

## Livelli che vorrebbero una figura

La nota dice che tutti i livelli tranne il 5 vorrebbero la figura: lo schema del fascio con tre
parallele orizzontali per i livelli 1, 2, 3 e i lotti del livello 8, il triangolo con $DE$ per il livello 4,
il triangolo con la bisettrice per i livelli 6 e 8, il triangolo dei punti medi per il livello 7. Il testo
basta per risolverli, ma nei livelli 1 e 2 la frase "Un fascio di parallele ... taglia la trasversale $r$
nei punti ..." è lunga, e con la figura si ridurrebbe a "Nella figura $a \parallel b \parallel c$".

## Domande per la revisione

- Otto livelli invece dei soliti cinque, sette: si tiene così, o si fondono i livelli 1 e 2 (il quarto
  segmento con e senza il segmento intero)?
- Livello 2: i conti con i decimali sono a volte pesanti a mano ($23x = 18 \cdot 13{,}8 = 248{,}4$,
  $x = 248{,}4 : 23$). Si tiene il rapporto con i quinti o si resta sui mezzi?
- Livello 3: senza unità, come l'esempio 3 della lezione. Va bene, o anche qui i centimetri
  ("$AB$ misura $(x + 3)$ cm")?
- Livello 4: la nota propone il distrattore "$DE$ messo nella proporzione con le parti", ma negli
  esercizi $DE$ non compare (la proporzione $DE : BC = AD : AB$ è della lezione sulla similitudine). Serve
  un caso con $DE$ tra i dati, o si lascia alla lezione 103?
- Livello 5: due opzioni sole (sì o no). Meglio quattro opzioni con la giustificazione ("sì, perché
  $3 \cdot 8 = 6 \cdot 4$", "no, perché ...")?
- Livello 6: il vertice della bisettrice varia ($\hat{A}$, $\hat{B}$ o $\hat{C}$), e il piede si chiama
  sempre $D$. La lezione usa solo $\hat{A}$: va bene variare?
- Livello 7: il caso "inverso" (dal segmento dei punti medi al lato) non è un esempio della lezione, che
  però enuncia il teorema nei due versi. Si tiene?
- Livello 8: nei lotti il rapporto tra i totali è a volte minore di 1 (la strada $s$ più corta): la
  lezione ha solo il caso $120 : 100$. Va bene?
