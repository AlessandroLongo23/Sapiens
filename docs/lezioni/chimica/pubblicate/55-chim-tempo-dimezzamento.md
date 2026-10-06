# Il tempo di dimezzamento

Lo iodio-131 che si usa negli ospedali va ordinato pochi giorni prima, perché dopo un mese non ce n'è quasi più; l'uranio-238 delle rocce è ancora per metà quello di quando si è formata la Terra. Tutti e due sono radioattivi (lezione [Radioattività e decadimenti](/materiale/scuola-superiore/chimica/il-nucleo-e-la-radioattivita/radioattivita-e-decadimenti)), ma con tempi lontanissimi tra loro. Il numero che misura questa differenza è il tempo di dimezzamento: con lui si calcola quanto resta di un campione radioattivo dopo un certo tempo, e si data un reperto dal carbonio-14 che contiene ancora.

## Un nucleo decade a caso, tanti nuclei seguono una legge

Di un singolo nucleo instabile non si può dire quando decadrà. Non invecchia e non ha memoria: un nucleo di carbonio-14 che esiste da diecimila anni ha, nel prossimo minuto, la stessa probabilità di decadere di uno appena formato. Niente di quello che un chimico sa fare cambia questa probabilità: non la temperatura, non la pressione, non il composto in cui l'atomo si trova, perché tutto questo riguarda gli elettroni e non arriva al nucleo.

Quello che è casuale per un nucleo diventa regolare per un numero enorme di nuclei, come succede con le monete: di un solo lancio non si sa l'esito, ma su un milione di lanci le teste sono molto vicine alla metà. Un campione che si può pesare contiene miliardi di miliardi di nuclei, e in ogni intervallo di tempo ne decade sempre la stessa frazione.

## Che cos'è il tempo di dimezzamento

Il **tempo di dimezzamento** $t_{1/2}$ di un radioisotopo è il tempo in cui decade la metà dei nuclei di un suo campione. Si chiama anche emivita, o tempo di semitrasformazione.

Non dipende da quanti nuclei ci sono all'inizio. Lo iodio-131 ha $t_{1/2} = 8{,}0$ giorni: di $80\,\text{mg}$ ne restano $40\,\text{mg}$ dopo $8{,}0$ giorni, e nei successivi $8{,}0$ giorni quei $40\,\text{mg}$ diventano $20\,\text{mg}$, non zero. Ogni tempo di dimezzamento dimezza quello che c'era all'inizio di quell'intervallo.

Ogni radioisotopo ha il suo, e i valori vanno dalle frazioni di secondo ai miliardi di anni.

| Radioisotopo | $t_{1/2}$ | Decadimento |
|---|---|---|
| uranio-238 | $4{,}5 \cdot 10^9$ anni | $\alpha$ |
| potassio-40 | $1{,}25 \cdot 10^9$ anni | $\beta^-$, cattura elettronica |
| uranio-235 | $7{,}0 \cdot 10^8$ anni | $\alpha$ |
| carbonio-14 | $5730$ anni | $\beta^-$ |
| radio-226 | $1600$ anni | $\alpha$ |
| cesio-137 | $30$ anni | $\beta^-$ |
| cobalto-60 | $5{,}27$ anni | $\beta^-$ |
| iodio-131 | $8{,}0$ giorni | $\beta^-$ |
| radon-222 | $3{,}8$ giorni | $\alpha$ |
| tecnezio-99m | $6{,}0$ ore | $\gamma$ |
| fluoro-18 | $110$ minuti | $\beta^+$ |
| polonio-214 | $1{,}6 \cdot 10^{-4}\,\text{s}$ | $\alpha$ |

```ad-warning
Dopo due tempi di dimezzamento non è finito tutto
Il ragionamento sbagliato è: in un tempo di dimezzamento decade metà, quindi in due decade tutto. Nel secondo intervallo decade la metà di quello che è rimasto, cioè un quarto del campione iniziale: dopo due tempi di dimezzamento resta $\frac{1}{4}$, dopo tre $\frac{1}{8}$.
```

## La legge del decadimento

Chiamiamo $N_0$ il numero di nuclei radioattivi all'inizio e $N$ il numero di quelli non ancora decaduti dopo un tempo $t$ (in questa lezione $N$ conta i nuclei del campione, non i neutroni di un nucleo). Dopo un tempo di dimezzamento $N = \frac{1}{2}N_0$, dopo due $N = \frac{1}{4}N_0$, dopo tre $N = \frac{1}{8}N_0$. Dopo un numero $n$ di tempi di dimezzamento:

$$N = N_0 \cdot \left(\frac{1}{2}\right)^{n} \qquad \text{con} \qquad n = \frac{t}{t_{1/2}}$$

La frazione $\frac{N}{N_0} = \left(\frac{1}{2}\right)^n$ è la parte del campione che resta. La stessa legge vale per la massa del radioisotopo, che è proporzionale al numero dei suoi nuclei: $m = m_0 \cdot \left(\frac{1}{2}\right)^n$.

```tikz
% nome: dimezzamento-curva-decadimento
% alt: Grafico della frazione di nuclei rimasti in funzione del tempo, misurato in tempi di dimezzamento. La curva parte da 1 e scende sempre meno ripida: vale un mezzo dopo un tempo di dimezzamento, un quarto dopo due, un ottavo dopo tre, un sedicesimo dopo quattro, e si avvicina all'asse senza toccarlo. Linee tratteggiate collegano questi punti agli assi
% svg: dimezzamento-curva-decadimento-1d5adb32.svg 309x223
\begin{tikzpicture}[x=1.3cm,y=4cm]
\draw[->] (0,0) -- (5.5,0) node[right] {$t$};
\draw[->] (0,0) -- (0,1.15) node[above] {$N/N_0$};
\foreach \n in {1,2,3,4,5} { \draw (\n,0) -- (\n,-0.02); }
\node[below] at (1,-0.02) {\small $t_{1/2}$};
\node[below] at (2,-0.02) {\small $2\,t_{1/2}$};
\node[below] at (3,-0.02) {\small $3\,t_{1/2}$};
\node[below] at (4,-0.02) {\small $4\,t_{1/2}$};
\node[below] at (5,-0.02) {\small $5\,t_{1/2}$};
\node[left] at (0,1) {\small $1$};
\node[left] at (0,0.5) {\small $\frac{1}{2}$};
\node[left] at (0,0.25) {\small $\frac{1}{4}$};
\node[left] at (0,0.125) {\small $\frac{1}{8}$};
\draw[thin, dashed] (0,0.5) -- (1,0.5) -- (1,0);
\draw[thin, dashed] (0,0.25) -- (2,0.25) -- (2,0);
\draw[thin, dashed] (0,0.125) -- (3,0.125) -- (3,0);
\draw[thin, dashed] (4,0.0625) -- (4,0);
\draw[thick, blue] plot[smooth] coordinates {(0,1) (0.25,0.841) (0.5,0.707) (0.75,0.595) (1,0.5) (1.25,0.420) (1.5,0.354) (1.75,0.297) (2,0.25) (2.5,0.177) (3,0.125) (3.5,0.088) (4,0.0625) (4.5,0.044) (5,0.031) (5.3,0.025)};
\foreach \p in {(0,1),(1,0.5),(2,0.25),(3,0.125),(4,0.0625)} { \fill[blue] \p circle (1.5pt); }
\end{tikzpicture}
```

La curva scende in fretta all'inizio e sempre più piano dopo, perché ogni volta si dimezza una quantità più piccola. Non arriva mai a zero secondo la formula; in pratica dopo dieci tempi di dimezzamento resta $\left(\frac{1}{2}\right)^{10} = \frac{1}{1024}$, meno di un millesimo del campione.

```ad-example
Esempio 1: quanto resta
Un ospedale riceve $40\,\text{mg}$ di iodio-131 ($t_{1/2} = 8{,}0$ giorni). Quanto iodio-131 resta dopo $24$ giorni?

Il numero di tempi di dimezzamento trascorsi è

$$n = \frac{t}{t_{1/2}} = \frac{24\ \text{giorni}}{8{,}0\ \text{giorni}} = 3$$

La frazione rimasta è $\left(\frac{1}{2}\right)^3 = \frac{1}{8}$, quindi

$$m = 40\,\text{mg} \cdot \frac{1}{8} = 5{,}0\,\text{mg}$$

Passo per passo: $40 \to 20 \to 10 \to 5{,}0\,\text{mg}$. Gli altri $35\,\text{mg}$ sono diventati xeno-131.
```

```ad-example
Esempio 2: quanto tempo serve
Il cesio-137 ha $t_{1/2} = 30$ anni. Dopo quanto tempo un campione si riduce a un ottavo?

Si cerca $n$ tale che $\left(\frac{1}{2}\right)^n = \frac{1}{8}$. Siccome $8 = 2^3$, è $n = 3$:

$$t = n \cdot t_{1/2} = 3 \cdot 30\ \text{anni} = 90\ \text{anni}$$
```

```ad-example
Esempio 3: trovare il tempo di dimezzamento
Di $80\,\text{mg}$ di sodio-24 ne restano $5{,}0\,\text{mg}$ dopo $60$ ore. Quanto vale il tempo di dimezzamento?

La frazione rimasta è $\frac{5{,}0}{80} = \frac{1}{16} = \left(\frac{1}{2}\right)^4$: sono passati $n = 4$ tempi di dimezzamento.

$$t_{1/2} = \frac{t}{n} = \frac{60\ \text{h}}{4} = 15\ \text{h}$$
```

```ad-warning
La frazione rimasta e la frazione decaduta
Se resta $\frac{1}{8}$ del campione, è decaduta la parte $1 - \frac{1}{8} = \frac{7}{8}$. Leggi bene che cosa chiede il problema: "è decaduto il $75\%$" vuol dire che resta il $25\%$, cioè $\frac{1}{4}$, e che sono passati due tempi di dimezzamento.
```

Nella figura qui sotto un campione di nuclei decade davvero a caso: ogni nucleo, in ogni istante, ha la stessa probabilità di decadere. Accanto, il grafico dei nuclei rimasti si disegna mentre il tempo passa, sopra la curva prevista dalla legge. Avvia il decadimento con $16$ nuclei, poi con $100$ e con $400$, e confronta le due curve.

```interattivo
% nome: dimezzamento-campione-nuclei
% alt: A sinistra un campione di nuclei disposti in una griglia: arancioni quelli non ancora decaduti, grigi quelli decaduti. A destra il grafico del numero di nuclei rimasti in funzione del tempo, misurato in tempi di dimezzamento da 0 a 6: una curva tratteggiata è la previsione della legge del decadimento, una linea a gradini è il conteggio del campione. Si sceglie il numero di nuclei (16, 100 o 400), si avvia il decadimento o lo si fa avanzare di un tempo di dimezzamento alla volta. Sotto si leggono il tempo trascorso, i nuclei rimasti e quelli previsti dalla legge
```

Con $16$ nuclei la linea a gradini segue la curva solo da lontano: capita che in un tempo di dimezzamento ne decadano $5$, oppure $11$, e ogni prova va in modo diverso. Con $400$ nuclei la linea sta quasi sopra la curva, e in un campione vero, con miliardi di miliardi di nuclei, lo scarto non si vede più. La legge del decadimento è una legge statistica: vale tanto meglio quanto più numerosi sono i nuclei.

```ad-warning
I nuclei decaduti non spariscono
Dopo un tempo di dimezzamento il campione non pesa la metà. Ogni nucleo decaduto è diventato un nucleo figlio, che resta lì: un pezzo di minerale di uranio pesa quasi come all'inizio, solo che una parte degli atomi di uranio è diventata piombo. A dimezzarsi è la quantità del radioisotopo di partenza.
```

## Quando il tempo non è un multiplo del tempo di dimezzamento

La formula vale anche se $n$ non è intero: l'esponente $\frac{t}{t_{1/2}}$ può essere un numero qualunque, e $N$ in funzione di $t$ è una funzione esponenziale con base $\frac{1}{2}$ (lezione [Funzione esponenziale](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/funzione-esponenziale)).

$$N = N_0 \cdot \left(\frac{1}{2}\right)^{t/t_{1/2}}$$

La potenza si calcola con la calcolatrice.

```ad-example
Esempio 4: un tempo qualunque
Il cobalto-60, usato in radioterapia, ha $t_{1/2} = 5{,}27$ anni. Quale frazione di una sorgente resta dopo $8{,}0$ anni?

$$n = \frac{8{,}0\ \text{anni}}{5{,}27\ \text{anni}} = 1{,}52$$

$$\frac{N}{N_0} = \left(\frac{1}{2}\right)^{1{,}52} = 0{,}35$$

Resta il $35\%$ del cobalto-60. Il risultato sta tra $\frac{1}{2}$ e $\frac{1}{4}$, come deve, perché sono passati più di uno e meno di due tempi di dimezzamento.
```

Per il problema inverso, trovare il tempo conoscendo la frazione rimasta, l'incognita è all'esponente, e serve un logaritmo (lezione [Logaritmi e loro proprietà](/materiale/scuola-superiore/matematica/esponenziali-e-logaritmi/logaritmi-e-loro-proprieta)). Da $\frac{N}{N_0} = \left(\frac{1}{2}\right)^n$ si ha $\frac{N_0}{N} = 2^n$, quindi

$$n = \log_2 \frac{N_0}{N} \qquad\qquad t = t_{1/2} \cdot \log_2 \frac{N_0}{N}$$

Sulla calcolatrice il logaritmo in base $2$ si ottiene da quello in base $10$: $\log_2 x = \dfrac{\log x}{\log 2}$.

```ad-example
Esempio 5: il tempo dalla frazione rimasta
Dopo quanto tempo una sorgente di cobalto-60 ($t_{1/2} = 5{,}27$ anni) si riduce al $10\%$?

Resta il $10\%$, quindi $\frac{N_0}{N} = \frac{100}{10} = 10$.

$$n = \log_2 10 = \frac{\log 10}{\log 2} = \frac{1}{0{,}3010} = 3{,}32$$

$$t = 3{,}32 \cdot 5{,}27\ \text{anni} = 17{,}5\ \text{anni}$$

Controllo: dopo tre tempi di dimezzamento resta $\frac{1}{8} = 12{,}5\%$, dopo quattro il $6{,}25\%$; il $10\%$ sta in mezzo, e infatti $n$ è tra $3$ e $4$.
```

```ad-warning
Il rapporto dentro il logaritmo
Nel logaritmo va $\frac{N_0}{N}$, la quantità iniziale divisa per quella rimasta, che è maggiore di $1$. Con il rapporto rovesciato, $\log_2 0{,}10 = -3{,}32$, viene un tempo negativo. E se il problema dà la percentuale decaduta, prima si trova quella rimasta.
```

## L'attività di un campione

Quello che uno strumento misura non è il numero di nuclei rimasti, ma quanti ne decadono: ogni decadimento emette una particella, e lo strumento le conta. L'**attività** $A$ di un campione è il numero di decadimenti che avvengono in un secondo. La sua unità nel Sistema Internazionale è il **becquerel**, $\text{Bq}$: un becquerel è un decadimento al secondo. (In questa lezione $A$ è l'attività, non il numero di massa.)

L'attività è proporzionale al numero di nuclei radioattivi presenti, perché ognuno ha la stessa probabilità di decadere: con metà dei nuclei i decadimenti al secondo sono la metà. Quindi l'attività segue la stessa legge del numero di nuclei, con lo stesso tempo di dimezzamento:

$$A = A_0 \cdot \left(\frac{1}{2}\right)^{t/t_{1/2}}$$

Una dose di iodio-131 con un'attività di $400\,\text{MBq}$ (megabecquerel, milioni di becquerel) ne ha $200\,\text{MBq}$ dopo $8{,}0$ giorni e $100\,\text{MBq}$ dopo $16$.

A parità di numero di nuclei, è più attivo il radioisotopo che decade più in fretta, cioè quello con il tempo di dimezzamento più breve. La relazione è

$$A = \frac{0{,}693}{t_{1/2}} \cdot N$$

con $t_{1/2}$ in secondi, perché l'attività è in decadimenti al secondo. Il numero $0{,}693$ è il logaritmo naturale di $2$.

```ad-example
Esempio 6: l'attività di un grammo di radio
Quanto vale l'attività di $1{,}0\,\text{g}$ di radio-226? Il tempo di dimezzamento è $1600$ anni, la massa molare $226\,\text{g/mol}$.

Il numero di nuclei si trova dalla quantità di sostanza, come per qualunque sostanza (lezione [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare)):

$$N = \frac{1{,}0\,\text{g}}{226\,\text{g/mol}} \cdot 6{,}022 \cdot 10^{23}\,\text{mol}^{-1} = 2{,}66 \cdot 10^{21}$$

Il tempo di dimezzamento va in secondi. Un anno ha $365 \cdot 24 \cdot 3600\,\text{s} = 3{,}15 \cdot 10^7\,\text{s}$:

$$t_{1/2} = 1600 \cdot 3{,}15 \cdot 10^7\,\text{s} = 5{,}05 \cdot 10^{10}\,\text{s}$$

$$A = \frac{0{,}693}{5{,}05 \cdot 10^{10}\,\text{s}} \cdot 2{,}66 \cdot 10^{21} = 3{,}7 \cdot 10^{10}\,\text{Bq}$$

In un grammo di radio decadono $37$ miliardi di nuclei al secondo. Per molto tempo questa attività è stata l'unità di misura, il curie.
```

```ad-warning
Tempo di dimezzamento lungo, attività bassa
Un tempo di dimezzamento lungo non vuol dire un radioisotopo più pericoloso da tenere vicino: vuol dire che i suoi nuclei decadono di rado. Un grammo di uranio-238 ($4{,}5 \cdot 10^9$ anni) ha un'attività circa tre milioni di volte più piccola di un grammo di radio-226. In compenso resta radioattivo molto più a lungo.
```

## La datazione con il carbonio-14

Negli strati alti dell'atmosfera i raggi cosmici producono neutroni, che colpiscono i nuclei di azoto e li trasformano in carbonio-14:

$${}^{14}_{\ 7}\mathrm{N} + {}^{1}_{0}n \longrightarrow {}^{14}_{\ 6}\mathrm{C} + {}^{1}_{1}p$$

Il carbonio-14 è radioattivo e torna azoto con un decadimento $\beta^-$, con $t_{1/2} = 5730$ anni. Tra produzione e decadimento, la sua quantità nell'atmosfera resta all'incirca costante: circa un atomo di carbonio ogni mille miliardi è carbonio-14. Finisce nell'anidride carbonica, le piante la assorbono con la fotosintesi, gli animali mangiano le piante: ogni essere vivente ha nei suoi tessuti la stessa piccola frazione di carbonio-14 che c'è nell'aria, perché continua a scambiare carbonio con l'ambiente.

Alla morte lo scambio si ferma. Il carbonio-14 presente continua a decadere e non viene più sostituito: la sua frazione si dimezza ogni $5730$ anni. Misurando quanta ne è rimasta in un reperto, rispetto a un organismo vivo, si calcola da quanto tempo l'organismo è morto. Il metodo è del chimico americano Willard Libby, che per questo ebbe il premio Nobel per la chimica nel 1960.

```tikz
% nome: dimezzamento-carbonio-14-eta
% alt: Grafico della percentuale di carbonio-14 rimasta in un reperto in funzione dell'età in anni, da 0 a 30000. La curva parte dal 100 per cento e scende al 50 per cento a 5730 anni, al 25 per cento a 11460 anni, al 12,5 per cento a 17190 anni, al 6,25 per cento a 22920 anni. Linee tratteggiate collegano i primi tre punti agli assi
% svg: dimezzamento-carbonio-14-eta-9eba25c3.svg 353x217
\begin{tikzpicture}[x=0.2cm,y=0.04cm]
\draw[->] (0,0) -- (32,0) node[right] {età (anni)};
\draw[->] (0,0) -- (0,115) node[above] {${}^{14}\mathrm{C}$ rimasto};
\foreach \y in {25,50,75,100} { \draw (0,\y) -- (-0.4,\y) node[left] {\small $\y\%$}; }
\draw (5.73,0) -- (5.73,-2) node[below] {\small $5730$};
\draw (11.46,0) -- (11.46,-2) node[below] {\small $11\,460$};
\draw (17.19,0) -- (17.19,-2) node[below] {\small $17\,190$};
\draw (22.92,0) -- (22.92,-2) node[below] {\small $22\,920$};
\draw[thin, dashed] (0,50) -- (5.73,50) -- (5.73,0);
\draw[thin, dashed] (0,25) -- (11.46,25) -- (11.46,0);
\draw[thin, dashed] (17.19,12.5) -- (17.19,0);
\draw[thick, blue] plot[smooth] coordinates {(0,100) (1.43,84.1) (2.87,70.7) (4.30,59.5) (5.73,50) (7.16,42.0) (8.60,35.4) (10.03,29.7) (11.46,25) (14.33,17.7) (17.19,12.5) (20.06,8.8) (22.92,6.25) (25.79,4.4) (28.65,3.1) (30.5,2.5)};
\foreach \p in {(0,100),(5.73,50),(11.46,25),(17.19,12.5),(22.92,6.25)} { \fill[blue] \p circle (1.5pt); }
\end{tikzpicture}
```

```ad-example
Esempio 7: l'età di Ötzi
Nel 1991 su un ghiacciaio delle Alpi, al confine tra Italia e Austria, fu trovato il corpo mummificato di un uomo, poi chiamato Ötzi. Nei suoi tessuti la frazione di carbonio-14 è circa il $53\%$ di quella di un organismo vivo. Da quanto tempo è morto?

Resta il $53\%$, quindi $\frac{N_0}{N} = \frac{100}{53} = 1{,}89$.

$$n = \log_2 1{,}89 = \frac{\log 1{,}89}{\log 2} = \frac{0{,}276}{0{,}301} = 0{,}92$$

$$t = 0{,}92 \cdot 5730\ \text{anni} = 5{,}3 \cdot 10^3\ \text{anni}$$

Ötzi è morto circa $5300$ anni fa. Il controllo sul grafico: resta poco più della metà, quindi è passato poco meno di un tempo di dimezzamento.
```

Il metodo ha due limiti. Funziona solo per quello che è stato vivo, o ne è fatto: legno, ossa, tessuti, carbone, carta; non per una roccia o per un oggetto di metallo. E non va oltre i $50\,000$ anni circa: dopo nove tempi di dimezzamento resta meno dello $0{,}2\%$ del carbonio-14 iniziale, troppo poco per misurarlo bene. Per le rocce si usano radioisotopi con tempi di dimezzamento di miliardi di anni, come l'uranio-238, che diventa piombo-206, e il potassio-40, che diventa argon-40: è così che si è misurata l'età della Terra, circa $4{,}5$ miliardi di anni.

```ad-note
La calibrazione
La quantità di carbonio-14 nell'atmosfera non è stata proprio costante nei millenni. Le età calcolate con la formula si correggono con una curva di calibrazione, costruita datando campioni di età nota, come gli anelli degli alberi.
```
