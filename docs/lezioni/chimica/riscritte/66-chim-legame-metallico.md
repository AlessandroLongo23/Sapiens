# Il legame metallico

Un filo di rame conduce la corrente, luccica, si piega senza rompersi e si può tirare fino a farlo sottile come un capello. Un cristallo di sale non fa nessuna di queste cose: da solido non conduce, e sotto un colpo va in pezzi. Eppure anche il rame è fatto di particelle legate tra loro con forza, tanto che fonde a $1085\,^\circ\text{C}$. Il legame che tiene insieme gli atomi di un metallo è diverso sia da quello ionico sia da quello covalente, e si descrive con un modello che spiega in un colpo solo tutte le proprietà dei metalli.

## Perché ai metalli serve un altro legame

Gli atomi dei metalli hanno pochi elettroni di valenza, da uno a tre nei gruppi principali, e li trattengono poco: la loro [energia di ionizzazione](/materiale/scuola-superiore/chimica/il-sistema-periodico/raggio-atomico-ed-energia-di-ionizzazione) è bassa ($496\,\text{kJ/mol}$ per il sodio, contro $1251\,\text{kJ/mol}$ per il cloro) e la loro elettronegatività anche.

In un pezzo di sodio ci sono solo atomi di sodio, tutti uguali. Un [legame ionico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-ionico) è escluso: nessun atomo ha motivo di strappare un elettrone a un altro identico, e mancherebbe l'anione. Un [legame covalente](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-covalente) non porta lontano: nel solido ogni atomo di sodio ha otto atomi vicini e un solo elettrone di valenza, troppo poco per formare una coppia condivisa con ciascuno e arrivare all'ottetto.

## Il modello del mare di elettroni

La soluzione è mettere in comune gli elettroni di valenza, non a coppie tra due atomi, ma tutti insieme tra tutti gli atomi del pezzo di metallo.

Nel **modello del mare di elettroni** ogni atomo del metallo cede i suoi elettroni di valenza e diventa un catione. I cationi si dispongono in un reticolo cristallino ordinato, e gli elettroni ceduti si muovono liberamente in tutto il metallo, come un liquido che riempie gli spazi tra i cationi. Un elettrone di questo tipo, che non appartiene a un atomo preciso né a una coppia di atomi, si dice **delocalizzato**.

```tikz
% nome: metallico-mare-elettroni-sodio
% alt: Un pezzo di sodio secondo il modello del mare di elettroni: tre file di cinque cerchi arancioni con il segno più, i cationi sodio, disposti in un reticolo ordinato, e tra di loro tanti puntini blu sparsi senza ordine, gli elettroni di valenza, uno per ogni catione
\begin{tikzpicture}
\foreach \x in {0, 0.9, 1.8, 2.7, 3.6} {\draw[thick, fill=orange!25] (\x,0) circle (0.27); \node at (\x,0) {\small $+$};}
\foreach \x in {0, 0.9, 1.8, 2.7, 3.6} {\draw[thick, fill=orange!25] (\x,0.9) circle (0.27); \node at (\x,0.9) {\small $+$};}
\foreach \x in {0, 0.9, 1.8, 2.7, 3.6} {\draw[thick, fill=orange!25] (\x,1.8) circle (0.27); \node at (\x,1.8) {\small $+$};}
\foreach \x/\y in {0.04/0.52, 0.54/0.39, 1.51/-0.29, 2.67/0.45, 4.1/-0.01, -0.28/0.57, 0.93/0.37, 1.67/1.29, 3.03/0.52, 3.14/1.25, -0.57/2.01, 1.21/1.51, 2.09/2.14, 3.18/1.69, 3.29/2.23} \fill[blue] (\x,\y) circle (1.6pt);
\draw[thick, fill=orange!25] (5.3,1.5) circle (0.27); \node at (5.3,1.5) {\small $+$}; \node[right] at (5.65,1.5) {\small catione Na$^+$};
\fill[blue] (5.3,0.7) circle (1.6pt); \node[right] at (5.65,0.7) {\small elettrone di valenza};
\end{tikzpicture}
```

Il **legame metallico** è l'attrazione tra i cationi del reticolo e il mare di elettroni delocalizzati che li circonda. I cationi, tutti positivi, da soli si respingerebbero: a tenerli insieme è la carica negativa degli elettroni che sta in mezzo.

Il pezzo di metallo resta neutro, perché gli elettroni del mare sono tanti quante le cariche positive dei cationi. Ogni atomo di sodio ne mette in comune uno, ogni atomo di magnesio due, ogni atomo di alluminio tre.

Il legame metallico ha due caratteristiche che lo distinguono dagli altri. Non è direzionale: un catione è attratto dal mare che ha intorno da tutte le parti, non da un vicino preciso. E non unisce un numero fisso di atomi: un pezzo di metallo, come un cristallo ionico, non è fatto di molecole, e la sua formula è il simbolo dell'elemento, $\mathrm{Na}$, $\mathrm{Cu}$, $\mathrm{Fe}$.

```ad-warning
Il metallo non è fatto di ioni positivi e ioni negativi
Nel modello ci sono cationi, ma non anioni: la carica negativa è quella degli elettroni liberi, non di atomi che li hanno acquistati. Il sodio metallico, $\mathrm{Na}$, non contiene ioni $\mathrm{Na^-}$, e non è un composto ionico.
```

```ad-example
Esempio 1: gli elettroni del mare in una lamina di alluminio
Quanti elettroni delocalizzati ci sono in $2{,}70\,\text{g}$ di alluminio?

La massa molare dell'alluminio è $26{,}98\,\text{g/mol}$, quindi
$$n = \frac{2{,}70\,\text{g}}{26{,}98\,\text{g/mol}} = 0{,}100\,\text{mol}$$
Gli atomi sono $0{,}100\,\text{mol} \cdot 6{,}02 \cdot 10^{23}\,\text{mol}^{-1} = 6{,}02 \cdot 10^{22}$. L'alluminio è nel gruppo 13 (IIIA) e ha configurazione $[\text{Ne}]\,3s^2\,3p^1$: ogni atomo mette in comune tre elettroni. Gli elettroni del mare sono $3 \cdot 6{,}02 \cdot 10^{22} = 1{,}81 \cdot 10^{23}$.
```

## Quanto è forte il legame metallico

Il legame è tanto più forte quanto più intensa è l'attrazione tra i cationi e il mare. Contano due cose: quanti elettroni ogni atomo mette in comune, che è anche la carica del catione, e quanto è piccolo il catione, perché un catione piccolo tiene gli elettroni più vicini. Un legame più forte vuol dire un metallo più duro e un punto di fusione più alto.

| Metallo | Gruppo | Elettroni messi in comune | Punto di fusione ($^\circ\text{C}$) |
|---|---|---|---|
| $\mathrm{Li}$ | 1 | $1$ | $181$ |
| $\mathrm{Na}$ | 1 | $1$ | $98$ |
| $\mathrm{K}$ | 1 | $1$ | $63$ |
| $\mathrm{Mg}$ | 2 | $2$ | $650$ |
| $\mathrm{Al}$ | 13 | $3$ | $660$ |

Scendendo nel gruppo 1 il catione diventa più grande e il punto di fusione cala. Lungo il terzo periodo, da sodio a magnesio ad alluminio, gli elettroni messi in comune aumentano e il punto di fusione sale.

```ad-example
Esempio 2: potassio o calcio
Il potassio e il calcio sono vicini nel quarto periodo. Quale dei due ti aspetti che fonda a temperatura più alta?

Il potassio è nel gruppo 1 e mette in comune un elettrone per atomo, formando cationi $\mathrm{K^+}$. Il calcio è nel gruppo 2: due elettroni per atomo e cationi $\mathrm{Ca^{2+}}$, con carica doppia e più piccoli. Nel calcio l'attrazione tra cationi e mare è più intensa, e il punto di fusione deve essere più alto. I valori misurati lo confermano: $63\,^\circ\text{C}$ per il potassio, $842\,^\circ\text{C}$ per il calcio.
```

```ad-note
Dove il modello non arriva
Il conto degli elettroni di valenza funziona per i metalli dei gruppi principali. Nei metalli di transizione partecipano al legame anche elettroni dei sottolivelli $d$, e i punti di fusione vanno da $-39\,^\circ\text{C}$ per il mercurio, liquido a temperatura ambiente, a $3422\,^\circ\text{C}$ per il tungsteno. Il modello del mare di elettroni non prevede queste differenze: per spiegarle serve una teoria più completa, la teoria delle bande, che si studia all'università.
```

## Le proprietà dei metalli spiegate dal modello

Il valore di un modello sta in quello che spiega. Il mare di elettroni rende conto delle proprietà che riconosci in ogni [metallo](/materiale/scuola-superiore/chimica/il-sistema-periodico/metalli-non-metalli-e-semimetalli).

### Conducono la corrente elettrica

La corrente elettrica è un movimento ordinato di cariche. In un metallo le cariche libere ci sono già, anche allo stato solido: sono gli elettroni del mare. Di solito si muovono in tutte le direzioni, a caso; quando il metallo è collegato ai poli di una pila, al moto disordinato si aggiunge uno spostamento d'insieme verso il polo positivo.

Nella figura colleghi una pila a un pezzo di metallo e ne cambi la temperatura. Conta quanti elettroni attraversano la linea tratteggiata.

```interattivo
% nome: metallico-mare-elettroni-pila
% alt: Un pezzo di metallo visto da vicino: cationi con il segno più fermi in un reticolo ordinato, che vibrano attorno al loro posto, ed elettroni, puntini blu, che si muovono a caso tra di loro. Si collega una pila con il polo positivo a destra o a sinistra, e gli elettroni, pur continuando a muoversi a caso, si spostano nell'insieme verso il polo positivo. Un cursore alza la temperatura: i cationi vibrano di più e lo spostamento degli elettroni rallenta. Un contatore dice quanti elettroni hanno attraversato la linea tratteggiata al centro
```

Senza pila gli elettroni attraversano la linea in tutti e due i versi, e il conto netto resta vicino a zero. Con la pila il conto cresce in un verso solo, e invertendo i poli cresce nell'altro. Alzando la temperatura i cationi vibrano di più attorno al loro posto e ostacolano il passaggio degli elettroni: lo spostamento rallenta. È il motivo per cui la resistenza elettrica di un metallo aumenta quando lo scaldi.

```ad-warning
Nel metallo si muovono gli elettroni, nel sale fuso gli ioni
In un filo di rame i cationi restano al loro posto e la carica la trasportano gli elettroni: il filo conduce senza trasformarsi. Nel sale fuso o sciolto in acqua non ci sono elettroni liberi, e la carica la trasportano gli ioni, che si spostano fisicamente verso i poli.
```

### Conducono il calore

Scaldare un'estremità di una sbarra di metallo vuol dire dare energia cinetica alle particelle di quella zona. Gli elettroni liberi, leggeri e veloci, la portano in fretta al resto della sbarra urtando cationi ed elettroni più lontani. Per questo i metalli che conducono meglio la corrente, come l'argento e il rame, sono anche quelli che conducono meglio il calore.

### Sono lucenti

Gli elettroni del mare non sono legati a livelli di energia fissi come quelli di un atomo isolato, e possono assorbire luce di quasi tutti i colori; la riemettono subito. Una superficie di metallo pulita rimanda indietro quasi tutta la luce che riceve, ed è questo il suo aspetto lucente. Quasi tutti i metalli sono grigi o argentei; l'oro e il rame, che assorbono una parte della luce blu, fanno eccezione.

### Sono malleabili e duttili

Un materiale è **malleabile** se si può ridurre in lamine sottili, **duttile** se si può tirare in fili. I metalli sono tutte e due le cose, e un cristallo ionico nessuna delle due.

Quando un colpo fa scorrere uno strato di cationi sopra quello sottostante, nel metallo non cambia niente di importante: ogni catione, nella nuova posizione, è ancora immerso nel mare di elettroni, che si adatta alla nuova forma e continua a tenere tutto insieme. Il legame non ha una direzione da rispettare e non si spezza.

```tikz
% nome: metallico-strati-scorrono
% alt: Due disegni di un pezzo di metallo fatto di tre strati di cationi con il segno più, con gli elettroni come puntini blu tra di loro. Nel primo, prima dell'urto, i tre strati sono allineati e una freccia indica l'urto sui due strati superiori. Nel secondo i due strati superiori sono scivolati di una posizione verso destra: i cationi sono ancora circondati dagli elettroni e il pezzo ha cambiato forma senza rompersi
\begin{tikzpicture}
\foreach \x in {0, 0.9, 1.8, 2.7} {\draw[thick, fill=orange!25] (\x,0) circle (0.27); \node at (\x,0) {\small $+$};}
\foreach \x in {0, 0.9, 1.8, 2.7} {\draw[thick, fill=orange!25] (\x,0.9) circle (0.27); \node at (\x,0.9) {\small $+$};}
\foreach \x in {0, 0.9, 1.8, 2.7} {\draw[thick, fill=orange!25] (\x,1.8) circle (0.27); \node at (\x,1.8) {\small $+$};}
\foreach \x/\y in {-0.4/-0.39, 1.07/-0.58, 1.76/-0.6, 3.19/0.09, 0.51/0.71, 1.25/0.65, 1.35/0.99, 2.19/0.76, 0.45/1.84, 0.79/2.39, 1.84/1.37, 2.83/1.39} \fill[blue] (\x,\y) circle (1.6pt);
\draw[-{Stealth}, very thick, blue!60!black] (-1.1,1.35) -- (-0.4,1.35);
\node[above] at (-0.75,1.4) {\small urto};
\node at (1.35,-1.0) {\small prima};
\foreach \x in {4.6, 5.5, 6.4, 7.3} {\draw[thick, fill=orange!25] (\x,0) circle (0.27); \node at (\x,0) {\small $+$};}
\foreach \x in {5.5, 6.4, 7.3, 8.2} {\draw[thick, fill=orange!25] (\x,0.9) circle (0.27); \node at (\x,0.9) {\small $+$};}
\foreach \x in {5.5, 6.4, 7.3, 8.2} {\draw[thick, fill=orange!25] (\x,1.8) circle (0.27); \node at (\x,1.8) {\small $+$};}
\foreach \x/\y in {4.41/0.39, 5.26/-0.34, 5.93/-0.11, 7.78/0.18, 5.98/1.02, 6.78/1.08, 7.62/1.22, 7.77/0.67, 5.91/1.74, 6.69/1.44, 7.56/2.14, 7.99/2.34} \fill[blue] (\x,\y) circle (1.6pt);
\node at (6.3999999999999995,-1.0) {\small dopo: gli strati sono scivolati};
\end{tikzpicture}
```

In un cristallo ionico lo stesso scorrimento porta cariche uguali una di fronte all'altra, e il cristallo si spacca. Nella figura muovi tu lo strato superiore nei due solidi e guardi che cosa succede alle cariche.

```interattivo
% nome: metallico-colpo-martello-ionico
% alt: Due solidi affiancati, un metallo e un cristallo ionico, ognuno con quattro strati di particelle. Un cursore fa scorrere i due strati superiori di tutti e due i solidi, e un bottone dà un colpo che li sposta di una posizione intera. Nel metallo i cationi restano immersi negli elettroni e il pezzo si deforma senza rompersi. Nel cristallo ionico, a spostamento completo, ogni ione si trova di fronte a uno dello stesso segno: compaiono frecce di repulsione e i due strati superiori si staccano. Sotto ogni solido si legge quante coppie di cariche uguali si trovano una di fronte all'altra
```

Nel metallo, a qualunque spostamento, i cationi restano immersi negli elettroni e nessuna repulsione li allontana: alla fine il pezzo ha un'altra forma ed è ancora intero. Nel cristallo ionico a metà corsa ogni ione dello strato che scorre si trova a cavallo tra un catione e un anione dello strato sotto, e a fine corsa ha davanti uno ione dello stesso segno: la repulsione stacca i due blocchi.

```ad-example
Esempio 3: metallo o composto ionico
Due solidi, A e B, fondono tutti e due sopra i $600\,^\circ\text{C}$. A conduce la corrente da solido e, martellato, si appiattisce. B da solido non conduce, conduce se viene fuso, e martellato si sbriciola. Di che tipo sono?

A ha cariche libere già allo stato solido e strati che scorrono senza rompere il legame: è un metallo. B ha cariche bloccate nel solido, che si liberano con la fusione, e si rompe quando gli strati scorrono: è un composto ionico. Il punto di fusione alto non li distingue, perché tutti e due i legami sono forti.
```

```ad-warning
"Malleabile" non vuol dire "legame debole"
Il ferro si lavora a colpi di martello e fonde a $1538\,^\circ\text{C}$. Un metallo si deforma perché il legame metallico non ha direzione e si riforma uguale dopo lo scorrimento degli strati, non perché sia facile da vincere.
```

## Le leghe

Una **lega** è un miscuglio omogeneo solido in cui il componente principale è un metallo: una [soluzione](/materiale/scuola-superiore/chimica/la-materia-e-le-sue-trasformazioni-fisiche/sostanze-pure-miscugli-omogenei-ed-eterogenei) allo stato solido. Si ottiene di solito fondendo insieme i componenti e lasciando raffreddare. Il mare di elettroni non distingue un catione dall'altro, e accoglie senza difficoltà atomi di un altro elemento. Non essendo un composto, una lega non ha una formula: la sua composizione può variare e si indica con le percentuali in massa.

Gli atomi aggiunti entrano nel reticolo in due modi.

```tikz
% nome: metallico-leghe-sostituzione-interstiziale
% alt: Due reticoli di atomi metallici arancioni. Nel primo, lega di sostituzione, alcuni atomi del reticolo sono sostituiti da atomi grigi di dimensioni simili, come lo zinco al posto del rame nell'ottone. Nel secondo, lega interstiziale, il reticolo è completo e alcuni atomi neri molto più piccoli occupano gli spazi vuoti tra gli atomi, come il carbonio nel ferro dell'acciaio
\begin{tikzpicture}
\foreach \x/\y in {0/0, 1.8/0, 2.7/0, 0/0.9, 0.9/0.9, 1.8/0.9, 0.9/1.8, 2.7/1.8} \draw[thick, fill=orange!25] (\x,\y) circle (0.4);
\foreach \x/\y in {0.9/0, 2.7/0.9, 0/1.8, 1.8/1.8} \draw[thick, fill=gray!50] (\x,\y) circle (0.43);
\node at (1.35,-0.85) {\small lega di sostituzione};
\node at (1.35,-1.3) {\small ottone: Cu e Zn};
\foreach \x/\y in {4.6/0, 5.5/0, 6.4/0, 7.3/0, 4.6/0.9, 5.5/0.9, 6.4/0.9, 7.3/0.9, 4.6/1.8, 5.5/1.8, 6.4/1.8, 7.3/1.8} \draw[thick, fill=orange!25] (\x,\y) circle (0.4);
\foreach \x/\y in {5.05/0.45, 6.85/1.35, 5.95/1.35} \draw[thick, fill=black!70] (\x,\y) circle (0.14);
\node at (5.95,-0.85) {\small lega interstiziale};
\node at (5.95,-1.3) {\small acciaio: Fe e C};
\end{tikzpicture}
```

- In una **lega di sostituzione** alcuni atomi del metallo sono sostituiti da atomi di un altro metallo di dimensioni simili. Sono leghe di sostituzione l'ottone (rame e zinco) e il bronzo (rame e stagno).
- In una **lega interstiziale** atomi molto più piccoli occupano gli spazi vuoti tra gli atomi del metallo, gli interstizi. L'esempio più importante è l'acciaio: ferro con una piccola quantità di carbonio, di solito meno del $2\%$ in massa.

In tutti e due i casi gli atomi estranei rendono il reticolo irregolare, e gli strati scorrono con più difficoltà. Per questo una lega è di solito più dura e meno malleabile del metallo puro: l'acciaio è più duro del ferro, il bronzo più del rame. L'oro puro è così tenero che per i gioielli si lega con rame e argento.

| Lega | Componenti | Uso |
|---|---|---|
| Acciaio | ferro, carbonio | strutture, utensili |
| Acciaio inossidabile | ferro, carbonio, cromo, nichel | posate, pentole |
| Ottone | rame, zinco | rubinetti, strumenti musicali |
| Bronzo | rame, stagno | statue, campane |
| Oro a 18 carati | oro, rame, argento | gioielli |

```ad-example
Esempio 4: quanto oro c'è in un anello
Il titolo dell'oro si misura in carati: i carati dicono quante parti in massa su $24$ sono di oro puro. Quanto oro contiene un anello di oro a $18$ carati che pesa $4{,}00\,\text{g}$?

La percentuale in massa di oro è
$$\frac{18}{24} \cdot 100 = 75{,}0\%$$
e la massa di oro nell'anello è $4{,}00\,\text{g} \cdot 0{,}750 = 3{,}00\,\text{g}$. Il grammo che resta è rame e argento. L'oro puro è a $24$ carati.
```

```ad-warning
Una lega non è un composto
L'ottone non ha una formula come $\mathrm{CuZn}$: è un miscuglio, e la quantità di zinco può cambiare da un ottone all'altro. In un composto, per la legge di Proust, il rapporto tra le masse degli elementi è fisso.
```

## Tre legami a confronto

| | Legame ionico | Legame covalente | Legame metallico |
|---|---|---|---|
| Tra quali atomi | metallo e non metallo | non metalli | atomi di metalli |
| Che cosa fanno gli elettroni | passano da un atomo all'altro | sono condivisi a coppie tra due atomi | sono messi in comune tra tutti gli atomi |
| Direzione | non direzionale | direzionale | non direzionale |
| Conduzione nel solido | no | no (con poche eccezioni) | sì |
| Sotto un colpo | si spacca | dipende dalla sostanza | si deforma |

I quattro tipi di solidi che nascono da questi legami sono messi a confronto nella lezione [I solidi: ionici, molecolari, covalenti e metallici](/materiale/scuola-superiore/chimica/forze-intermolecolari-e-stati-condensati/i-solidi-ionici-molecolari-covalenti-e-metallici).
