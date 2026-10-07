# La tavola periodica di Mendeleev

Nel 1869 si conoscevano circa sessanta elementi, ognuno con le sue proprietà, e ai chimici sembravano un elenco senza ordine. Quell'anno il chimico russo Dmitrij Mendeleev li dispose in una tabella in cui gli elementi con proprietà simili stanno nella stessa colonna, e la tabella gli permise di prevedere elementi che nessuno aveva ancora visto. La tavola periodica che si usa oggi discende dalla sua, con una differenza: Mendeleev ordinava gli elementi per massa atomica, la tavola moderna per numero atomico.

## Le famiglie di elementi

Già prima di Mendeleev i chimici avevano notato che alcuni elementi si somigliano. Litio, sodio e potassio sono metalli teneri, che reagiscono con violenza con l'acqua e con il cloro formano composti con la stessa formula, $\mathrm{LiCl}$, $\mathrm{NaCl}$, $\mathrm{KCl}$. Cloro, bromo e iodio formano con l'idrogeno $\mathrm{HCl}$, $\mathrm{HBr}$ e $\mathrm{HI}$, tutti acidi forti. Nel 1829 il chimico tedesco Johann Wolfgang Döbereiner osservò che in gruppi di tre elementi simili, le **triadi**, la massa atomica dell'elemento centrale è vicina alla media delle altre due.

```ad-example
Esempio 1: una triade di Döbereiner
Le masse atomiche di litio, sodio e potassio sono $6{,}94$, $22{,}99$ e $39{,}10$. La massa del sodio è vicina alla media delle altre due?

$$\frac{6{,}94 + 39{,}10}{2} = \frac{46{,}04}{2} = 23{,}02$$

La media, $23{,}02$, è vicinissima alla massa del sodio, $22{,}99$. Per cloro ($35{,}45$), bromo ($79{,}90$) e iodio ($126{,}90$) la media è $81{,}18$, meno vicina ma ancora dello stesso ordine della massa del bromo.
```

Nel 1865 l'inglese John Newlands notò che, ordinando gli elementi per massa atomica, le proprietà si ripetono più o meno ogni otto elementi, come le note di un'ottava; la regola però funzionava solo per gli elementi più leggeri.

## La tavola di Mendeleev

Mendeleev scrisse gli elementi in ordine di massa atomica crescente, e andò a capo ogni volta che le proprietà cominciavano a ripetersi, in modo che gli elementi simili finissero uno sotto l'altro. Nella sua tavola le colonne sono i **gruppi**, gli elementi simili; le righe sono i **periodi**. La regolarità che la tavola mette in evidenza è la **legge periodica**: le proprietà degli elementi si ripetono a intervalli regolari quando gli elementi sono ordinati. Negli stessi anni, e in modo indipendente, arrivò a una tabella simile il tedesco Lothar Meyer.

```tikz
% nome: mendeleev-tavola-1871
% alt: Una parte della tavola di Mendeleev del 1871, con i gruppi dal primo al settimo in colonna e quattro righe. Prima riga: Li 7, Be 9,4, B 11, C 12, N 14, O 16, F 19. Seconda: Na 23, Mg 24, Al 27,3, Si 28, P 31, S 32, Cl 35,5. Terza: K 39, Ca 40, una casella vuota con un punto di domanda e 44, Ti 48, V 51, Cr 52, Mn 55. Quarta: Cu 63, Zn 65, due caselle vuote con 68 e 72, As 75, Se 78, Br 80. Le tre caselle vuote sono colorate
% svg: mendeleev-tavola-1871-7a0741a7.svg 242x129
\begin{tikzpicture}[x=0.9cm, y=0.72cm]
\foreach \g/\n in {1/I,2/II,3/III,4/IV,5/V,6/VI,7/VII} \node at (\g,-0.2) {\small \n};
\fill[orange!25] (2.5,-3.5) rectangle (3.5,-2.5);
\fill[orange!25] (2.5,-4.5) rectangle (4.5,-3.5);
\foreach \g/\r/\s/\m in {1/1/Li/7,2/1/Be/{9,4},3/1/B/11,4/1/C/12,5/1/N/14,6/1/O/16,7/1/F/19,1/2/Na/23,2/2/Mg/24,3/2/Al/{27,3},4/2/Si/28,5/2/P/31,6/2/S/32,7/2/Cl/{35,5},1/3/K/39,2/3/Ca/40,3/3/?/44,4/3/Ti/48,5/3/V/51,6/3/Cr/52,7/3/Mn/55,1/4/Cu/63,2/4/Zn/65,3/4/?/68,4/4/?/72,5/4/As/75,6/4/Se/78,7/4/Br/80} {
\draw[thin] (\g-0.5,-\r-0.5) rectangle (\g+0.5,-\r+0.5);
\node at (\g,-\r+0.16) {\small \s};
\node at (\g,-\r-0.22) {\scriptsize \m};
}
\end{tikzpicture}
```

Due scelte resero la tavola di Mendeleev diversa da tutte le altre.

La prima: lasciò delle **caselle vuote**. Dove l'ordine delle masse avrebbe messo un elemento in un gruppo che non gli somigliava, Mendeleev lo spostò più avanti e lasciò un posto libero, convinto che lì ci fosse un elemento non ancora scoperto. Nel 1871 descrisse tre di questi elementi e li chiamò con il prefisso sanscrito *eka*, "uno": l'eka-boro, l'eka-alluminio e l'eka-silicio, gli elementi che vengono uno posto sotto il boro, l'alluminio e il silicio. Dalle proprietà degli elementi vicini ne previde la massa atomica, la densità e le formule dei composti.

La seconda: dove le proprietà lo richiedevano, **invertì l'ordine** delle masse. Il tellurio ($127{,}6$) ha una massa maggiore dello iodio ($126{,}9$), ma lo iodio somiglia al cloro e al bromo, e il tellurio all'ossigeno e allo zolfo: Mendeleev mise il tellurio prima dello iodio, pensando che le masse misurate fossero sbagliate.

## Le previsioni verificate

Le caselle vuote si riempirono una dopo l'altra: nel 1875 il francese Paul-Émile Lecoq de Boisbaudran scoprì il gallio, l'eka-alluminio; nel 1879 lo svedese Lars Fredrik Nilson lo scandio, l'eka-boro; nel 1886 il tedesco Clemens Winkler il germanio, l'eka-silicio. Il confronto tra la previsione di Mendeleev e il germanio mostra quanto la previsione fosse precisa.

| Proprietà | Eka-silicio, previsto nel 1871 | Germanio, oggi |
|---|---|---|
| Massa atomica | $72$ | $72{,}63$ |
| Densità | $5{,}5\,\text{g/cm}^3$ | $5{,}32\,\text{g/cm}^3$ |
| Formula dell'ossido | $\mathrm{EsO_2}$ | $\mathrm{GeO_2}$ |
| Densità dell'ossido | $4{,}7\,\text{g/cm}^3$ | $4{,}23\,\text{g/cm}^3$ |
| Formula del cloruro | $\mathrm{EsCl_4}$, liquido | $\mathrm{GeCl_4}$, liquido |

Un modo semplice per stimare una proprietà di un elemento che manca è fare la media tra l'elemento sopra e quello sotto nello stesso gruppo, come nelle triadi.

```ad-example
Esempio 2: la massa dell'eka-silicio
Nel gruppo del carbonio, sopra la casella vuota c'è il silicio ($28{,}09$) e sotto lo stagno ($118{,}71$). Quale massa atomica si stima per l'elemento che manca?

$$\frac{28{,}09 + 118{,}71}{2} = \frac{146{,}80}{2} = 73{,}40$$

La stima, $73{,}40$, dista meno di una unità dalla massa del germanio, $72{,}63$.
```

Anche le formule dei composti si prevedono per analogia: gli elementi dello stesso gruppo si combinano con gli altri elementi nelle stesse proporzioni. Il silicio forma $\mathrm{SiO_2}$ e lo stagno $\mathrm{SnO_2}$, quindi l'eka-silicio doveva formare $\mathrm{EsO_2}$.

```ad-example
Esempio 3: una formula per analogia
Il sodio e il potassio stanno nello stesso gruppo. Il sodio forma con l'ossigeno l'ossido $\mathrm{Na_2O}$ e con lo zolfo il solfuro $\mathrm{Na_2S}$. Che formula ha l'ossido di potassio?

Il potassio si combina come il sodio: l'ossido di potassio è $\mathrm{K_2O}$. Allo stesso modo, siccome il magnesio forma $\mathrm{MgO}$, il calcio, che sta sotto il magnesio, forma $\mathrm{CaO}$.
```

```ad-warning
Stesso gruppo, non stessa riga
Le proprietà simili sono quelle degli elementi della stessa colonna. Sodio e magnesio sono vicini nella stessa riga ma non si somigliano: il sodio forma $\mathrm{Na_2O}$, il magnesio $\mathrm{MgO}$. Per prevedere una formula per analogia si guarda l'elemento sopra o sotto, mai quello accanto.
```

## Dalle masse al numero atomico

Le inversioni della tavola di Mendeleev non erano errori di misura: le masse del tellurio e dello iodio erano giuste. Lo stesso succede con il cobalto ($58{,}93$), che va prima del nichel ($58{,}69$), e un'altra inversione comparve con i gas nobili, scoperti tra il 1894 e il 1898, che formarono un gruppo nuovo: l'argon ($39{,}95$) va prima del potassio ($39{,}10$).

La spiegazione arrivò nel 1913, dopo la scoperta del nucleo (lezione [I modelli atomici di Thomson e di Rutherford](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/i-modelli-atomici-di-thomson-e-di-rutherford)). Il fisico inglese Henry Moseley studiò i raggi X emessi dagli elementi e trovò che ogni elemento ha un numero intero suo, che cresce di uno passando da un elemento al successivo: la carica del nucleo, cioè il numero di protoni, il **numero atomico** $Z$ (lezione [Numero atomico, numero di massa e isotopi](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/numero-atomico-numero-di-massa-e-isotopi)). Ordinati per numero atomico, gli elementi cadono tutti nel gruppo giusto, e le inversioni spariscono: il tellurio ha $Z = 52$ e lo iodio $Z = 53$. La massa atomica cresce quasi sempre con $Z$, ma non sempre, perché dipende anche dai neutroni e dagli isotopi presenti in natura.

```ad-warning
Mendeleev non conosceva il numero atomico
Nel 1869 non si sapeva niente di protoni e di nuclei: Mendeleev ordinò gli elementi per massa atomica, e solo in pochi casi, guidato dalle proprietà, cambiò l'ordine. Dire che la tavola di Mendeleev è ordinata per numero atomico è un errore frequente; l'ordine per numero atomico è di Moseley, nel 1913.
```

## La tavola periodica moderna

La tavola di oggi è ordinata per numero atomico crescente. Ha sette righe, i **periodi**, e diciotto colonne, i **gruppi**, numerati da $1$ a $18$. Gli elementi di uno stesso gruppo hanno proprietà chimiche simili, e alcuni gruppi hanno un nome: il gruppo $1$ (senza l'idrogeno) è quello dei metalli alcalini, il $2$ dei metalli alcalino-terrosi, il $17$ degli alogeni, il $18$ dei gas nobili. Ecco i primi quattro periodi:

```tikz
% nome: mendeleev-tavola-moderna-quattro-periodi
% alt: I primi quattro periodi della tavola periodica moderna, con i gruppi numerati da 1 a 18 in alto e i periodi da 1 a 4 a sinistra. Ogni casella ha il numero atomico e il simbolo. Il primo periodo ha idrogeno ed elio agli estremi; il secondo e il terzo hanno otto elementi, due a sinistra e sei a destra; il quarto è completo, dal potassio al kripton
% svg: mendeleev-tavola-moderna-quattro-periodi-afee5d40.svg 360x109
\begin{tikzpicture}[x=0.5cm, y=0.62cm]
\foreach \g in {1,...,18} \node at (\g,-0.25) {\tiny \g};
\foreach \p in {1,...,4} \node at (0.1,-\p) {\tiny \p};
\foreach \g/\p/\z/\s in {1/1/1/H,18/1/2/He,1/2/3/Li,2/2/4/Be,13/2/5/B,14/2/6/C,15/2/7/N,16/2/8/O,17/2/9/F,18/2/10/Ne,1/3/11/Na,2/3/12/Mg,13/3/13/Al,14/3/14/Si,15/3/15/P,16/3/16/S,17/3/17/Cl,18/3/18/Ar,1/4/19/K,2/4/20/Ca,3/4/21/Sc,4/4/22/Ti,5/4/23/V,6/4/24/Cr,7/4/25/Mn,8/4/26/Fe,9/4/27/Co,10/4/28/Ni,11/4/29/Cu,12/4/30/Zn,13/4/31/Ga,14/4/32/Ge,15/4/33/As,16/4/34/Se,17/4/35/Br,18/4/36/Kr} {
\draw[thin] (\g-0.5,-\p-0.5) rectangle (\g+0.5,-\p+0.5);
\node at (\g,-\p+0.22) {\tiny \z};
\node at (\g,-\p-0.15) {\scriptsize \s};
}
\end{tikzpicture}
```

Tutti e sette i periodi, con le famiglie a colori e la scheda di ogni elemento, sono nella [tavola periodica interattiva](/strumenti/tavola-periodica).

Perché le proprietà si ripetono, e perché i periodi hanno $2$, $8$, $8$, $18$ elementi, lo spiega la disposizione degli elettroni, che si studia al terzo anno nella lezione [Gruppi, periodi e blocchi](/materiale/scuola-superiore/chimica/il-sistema-periodico/gruppi-periodi-e-blocchi). Chi vuole vederla già adesso trova nello strumento [Orbitali atomici](/strumenti/orbitali-atomici) la tabella dei sottolivelli, che si riempie con gli elettroni dell'elemento scelto.
