# Affinità elettronica ed elettronegatività

Un atomo di cloro che incontra un elettrone lo cattura e libera energia; un atomo di sodio, nella stessa situazione, ne libera pochissima. E quando i due atomi si legano, gli elettroni del legame finiscono dalla parte del cloro. Per descrivere quanto un atomo "vuole" elettroni i chimici usano due grandezze diverse: l'affinità elettronica, che riguarda l'atomo da solo, e l'elettronegatività, che riguarda l'atomo dentro un legame. Tutte e due seguono gli andamenti della tavola periodica, per le stesse ragioni viste nella lezione [Raggio atomico ed energia di ionizzazione](/materiale/scuola-superiore/chimica/il-sistema-periodico/raggio-atomico-ed-energia-di-ionizzazione).

## L'affinità elettronica

L'energia di ionizzazione misura quanto costa togliere un elettrone a un atomo. Il processo opposto è aggiungerne uno. L'**affinità elettronica**, $A_e$, è l'energia che un atomo isolato, allo stato gassoso, libera quando acquista un elettrone e diventa uno ione negativo:

$$\mathrm{X}(g) + e^- \to \mathrm{X^-}(g) + \text{energia}$$

Si misura in $\text{kJ/mol}$, come l'energia di ionizzazione. Più è grande, più l'atomo acquista volentieri un elettrone, e più è stabile l'anione che si forma. Per il cloro vale $349\,\text{kJ/mol}$: una mole di atomi di cloro che diventano ioni $\mathrm{Cl^-}$ libera $349\,\text{kJ}$.

L'elettrone che arriva non vede il nucleo intero: sente la carica nucleare efficace, come gli elettroni esterni che l'atomo ha già. Per questo gli atomi piccoli e con $Z_{eff}$ grande, a destra nella tavola, liberano molta energia, e quelli grandi con $Z_{eff}$ piccola, a sinistra, ne liberano poca.

```tikz
% nome: affinita-elettronica-periodi
% alt: Una tabella con l'affinità elettronica, in chilojoule alla mole, degli elementi dei gruppi 1, 2 e da 13 a 18 nel secondo e nel terzo periodo. Secondo periodo: litio 60, berillio nessuna, boro 27, carbonio 122, azoto nessuna, ossigeno 141, fluoro 328, neon nessuna. Terzo periodo: sodio 53, magnesio nessuna, alluminio 42, silicio 134, fosforo 72, zolfo 200, cloro 349, argon nessuna. Il colore delle caselle è più intenso dove il valore è più alto: le più intense sono fluoro e cloro
% svg: affinita-elettronica-periodi-c027543e.svg 333x100
\begin{tikzpicture}[x=1.08cm, y=1.05cm]
\foreach \g/\n in {1/1,2/2,3/13,4/14,5/15,6/16,7/17,8/18} \node at (\g,-0.25) {\scriptsize \n};
\foreach \g/\p/\s/\a/\k in {1/1/Li/60/12, 3/1/B/27/5, 4/1/C/122/24, 6/1/O/141/28, 7/1/F/328/60, 1/2/Na/53/10, 3/2/Al/42/8, 4/2/Si/134/27, 5/2/P/72/14, 6/2/S/200/38, 7/2/Cl/349/64} {
\draw[thin, fill=blue!\k] (\g-0.5,-\p-0.5) rectangle (\g+0.5,-\p+0.5);
\node at (\g,-\p+0.2) {\small \s};
\node at (\g,-\p-0.2) {\scriptsize \a};
}
\foreach \g/\p/\s in {2/1/Be, 5/1/N, 8/1/Ne, 2/2/Mg, 8/2/Ar} {
\draw[thin] (\g-0.5,-\p-0.5) rectangle (\g+0.5,-\p+0.5);
\node at (\g,-\p+0.2) {\small \s};
\node at (\g,-\p-0.2) {\scriptsize nessuna};
}
\end{tikzpicture}
```

Dalla tabella si leggono tre cose.

Gli alogeni, nel gruppo $17$ (VIIA), hanno le affinità elettroniche più alte di tutta la tavola. Hanno sette elettroni esterni: con l'elettrone in più completano il livello e raggiungono la configurazione del gas nobile che li segue. I metalli alcalini, nel gruppo $1$ (IA), hanno valori bassi: l'elettrone in più sente una carica efficace di appena $+1$.

Alcuni atomi non liberano energia affatto: l'elettrone in più non resta legato, e l'anione non è stabile. Succede ai gas nobili, che hanno il livello esterno pieno e dovrebbero mettere l'elettrone in un livello nuovo, più lontano; al berillio e al magnesio, che hanno il sottolivello $s$ pieno e dovrebbero cominciare il $p$; all'azoto, che ha i tre orbitali $2p$ occupati da un elettrone ciascuno e dovrebbe metterne due nello stesso orbitale.

L'andamento generale è quello dell'energia di ionizzazione: l'affinità elettronica cresce lungo un periodo, da sinistra a destra fino al gruppo $17$, e tende a diminuire scendendo lungo un gruppo. È però molto meno regolare.

```ad-warning
Il cloro batte il fluoro
L'atomo che libera più energia acquistando un elettrone è il cloro ($349\,\text{kJ/mol}$), non il fluoro ($328\,\text{kJ/mol}$). L'atomo di fluoro è così piccolo che l'elettrone in più è respinto con forza dagli altri sette, stretti in poco spazio. Lo stesso succede tra ossigeno ($141$) e zolfo ($200$).
```

```ad-example
Esempio 1: chi acquista più volentieri un elettrone
Tra sodio, magnesio, zolfo e cloro, quale atomo ha l'affinità elettronica più alta? E quale la più bassa?

Sono tutti nel terzo periodo. L'affinità elettronica cresce verso destra, fino al gruppo $17$: la più alta è quella del cloro ($349\,\text{kJ/mol}$), seguito dallo zolfo ($200$).

Per la più bassa non conta la posizione più a sinistra. Il sodio libera $53\,\text{kJ/mol}$, mentre il magnesio, con il sottolivello $3s$ pieno, non ne libera: lo ione $\mathrm{Mg^-}$ non è stabile. L'affinità più bassa è quella del magnesio.
```

```ad-note
Il segno nei libri
Molti libri scrivono l'affinità elettronica con il segno meno, $-349\,\text{kJ/mol}$ per il cloro, perché è un'energia che l'atomo cede. Il numero è lo stesso: qui si indica l'energia liberata, con il segno più.
```

## Ionizzazione e affinità a confronto

Le due energie descrivono i due versi dello scambio di elettroni, e messe insieme dicono come si comporta un elemento.

| | $\mathrm{Na}$ | $\mathrm{Cl}$ |
|---|---|---|
| Energia di prima ionizzazione ($\text{kJ/mol}$) | $495{,}8$ | $1251$ |
| Affinità elettronica ($\text{kJ/mol}$) | $53$ | $349$ |

Il sodio perde un elettrone con poca spesa e guadagna poco ad acquistarne uno: tende a diventare $\mathrm{Na^+}$. Il cloro trattiene con forza i suoi elettroni e libera molta energia quando ne acquista un altro: tende a diventare $\mathrm{Cl^-}$. I metalli hanno tutte e due le energie basse, i non metalli tutte e due alte.

```ad-example
Esempio 2: un elettrone dal sodio al cloro
Quanta energia serve per trasferire una mole di elettroni da atomi di sodio ad atomi di cloro, tutti isolati e allo stato gassoso?

Togliere gli elettroni al sodio costa $495{,}8\,\text{kJ}$. Darli al cloro ne libera $349\,\text{kJ}$. Il bilancio è

$$495{,}8\,\text{kJ} - 349\,\text{kJ} = 146{,}8\,\text{kJ}$$

Il trasferimento da solo costa energia: $146{,}8\,\text{kJ}$ per mole. Il cloruro di sodio si forma lo stesso, perché gli ioni $\mathrm{Na^+}$ e $\mathrm{Cl^-}$ poi si attraggono e avvicinandosi liberano molta più energia di quella spesa (lezione [Il legame ionico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-ionico)).
```

```ad-warning
Affinità alta non vuol dire che l'atomo strappa elettroni a chiunque
Nessun atomo ha un'affinità elettronica più grande dell'energia di ionizzazione di un altro atomo: la più alta è $349\,\text{kJ/mol}$, la più bassa energia di ionizzazione è $375{,}7\,\text{kJ/mol}$ (cesio). Tra atomi isolati il trasferimento di un elettrone costa sempre energia.
```

## L'elettronegatività

Dentro una molecola gli atomi non scambiano elettroni interi: li condividono. Ma non sempre in parti uguali. L'**elettronegatività**, $\chi$ (la lettera greca chi), misura la tendenza di un atomo ad attirare verso di sé gli elettroni di un legame.

```tikz
% nome: elettronegativita-coppia-spostata
% alt: Due molecole a confronto. A sinistra il cloro biatomico: due atomi uguali con la coppia di elettroni di legame, due puntini, esattamente a metà strada. A destra il cloruro di idrogeno: un atomo di idrogeno piccolo e un atomo di cloro grande, con la coppia di elettroni spostata verso il cloro; sull'idrogeno c'è il simbolo delta più, sul cloro delta meno
% svg: elettronegativita-coppia-spostata-64015be2.svg 373x98
\begin{tikzpicture}
\draw[thick, fill=green!18] (0,0) circle (0.6);
\draw[thick, fill=green!18] (1.9,0) circle (0.6);
\node at (0,0) {Cl};
\node at (1.9,0) {Cl};
\fill (0.95,0.1) circle (1.6pt);
\fill (0.95,-0.1) circle (1.6pt);
\node at (0.95,-1.1) {\small $\chi$ uguali: coppia al centro};
\begin{scope}[shift={(5.6,0)}]
\draw[thick, fill=gray!15] (0,0) circle (0.36);
\draw[thick, fill=green!18] (1.5,0) circle (0.6);
\node at (0,0) {H};
\node at (1.5,0) {Cl};
\fill (0.74,0.1) circle (1.6pt);
\fill (0.74,-0.1) circle (1.6pt);
\node at (0,0.7) {\small $\delta^+$};
\node at (1.5,0.9) {\small $\delta^-$};
\node at (0.85,-1.1) {\small $\chi$ diverse: coppia verso il cloro};
\end{scope}
\end{tikzpicture}
```

Nella molecola $\mathrm{Cl_2}$ i due atomi sono uguali e tirano allo stesso modo: la coppia di elettroni sta nel mezzo. In $\mathrm{HCl}$ il cloro è più elettronegativo dell'idrogeno e attira la coppia dalla sua parte. Il cloro si ritrova con un po' di carica negativa in più, indicata con $\delta^-$, e l'idrogeno con un po' di carica positiva, $\delta^+$: sono cariche parziali, più piccole della carica di un elettrone.

L'elettronegatività non si misura su un atomo isolato e non è un'energia: è un numero senza unità, assegnato su una scala. La più usata è la **scala di Pauling**, proposta dal chimico americano Linus Pauling nel 1932 a partire dalle energie dei legami. Su questa scala il fluoro, l'elemento più elettronegativo, vale $3{,}98$; il meno elettronegativo tra quelli comuni è il cesio, $0{,}79$.

```tikz
% nome: elettronegativita-scala-pauling
% alt: I valori di elettronegatività di Pauling per l'idrogeno e per gli elementi dei gruppi 1, 2, 13, 14, 15, 16 e 17 dal secondo al quinto periodo, in una griglia con il colore delle caselle più intenso dove il valore è più alto. Idrogeno 2,20. Secondo periodo: litio 0,98, berillio 1,57, boro 2,04, carbonio 2,55, azoto 3,04, ossigeno 3,44, fluoro 3,98. Terzo: sodio 0,93, magnesio 1,31, alluminio 1,61, silicio 1,90, fosforo 2,19, zolfo 2,58, cloro 3,16. Quarto: potassio 0,82, calcio 1,00, gallio 1,81, germanio 2,01, arsenico 2,18, selenio 2,55, bromo 2,96. Quinto: rubidio 0,82, stronzio 0,95, indio 1,78, stagno 1,96, antimonio 2,05, tellurio 2,10, iodio 2,66
% svg: elettronegativita-scala-pauling-8c3907a7.svg 301x200
\begin{tikzpicture}[x=1.12cm, y=0.95cm]
\foreach \g/\n in {1/1,2/2,3/13,4/14,5/15,6/16,7/17} \node at (\g,-0.25) {\scriptsize \n};
\foreach \g/\p/\s/\c/\k in {1/1/H/{2,20}/32, 1/2/Li/{0,98}/6, 2/2/Be/{1,57}/18, 3/2/B/{2,04}/28, 4/2/C/{2,55}/39, 5/2/N/{3,04}/50, 6/2/O/{3,44}/58, 7/2/F/{3,98}/70, 1/3/Na/{0,93}/5, 2/3/Mg/{1,31}/13, 3/3/Al/{1,61}/19, 4/3/Si/{1,90}/25, 5/3/P/{2,19}/32, 6/3/S/{2,58}/40, 7/3/Cl/{3,16}/52, 1/4/K/{0,82}/3, 2/4/Ca/{1,00}/6, 3/4/Ga/{1,81}/24, 4/4/Ge/{2,01}/28, 5/4/As/{2,18}/31, 6/4/Se/{2,55}/39, 7/4/Br/{2,96}/48, 1/5/Rb/{0,82}/3, 2/5/Sr/{0,95}/5, 3/5/In/{1,78}/23, 4/5/Sn/{1,96}/27, 5/5/Sb/{2,05}/29, 6/5/Te/{2,10}/30, 7/5/I/{2,66}/42} {
\draw[thin, fill=blue!\k] (\g-0.5,-\p-0.5) rectangle (\g+0.5,-\p+0.5);
\node at (\g,-\p+0.2) {\small \s};
\node at (\g,-\p-0.2) {\scriptsize \c};
}
\end{tikzpicture}
```

Gli andamenti sono quelli che ti aspetti da un atomo che tira gli elettroni con la sua carica nucleare efficace.

Lungo un periodo l'elettronegatività aumenta. Da sinistra a destra $Z_{eff}$ cresce e l'atomo si rimpicciolisce: gli elettroni di legame arrivano più vicino a un nucleo che li attira di più. Nel secondo periodo si passa da $0{,}98$ del litio a $3{,}98$ del fluoro.

Lungo un gruppo l'elettronegatività diminuisce. Scendendo, l'atomo è più grande, e gli elettroni di legame restano più lontani dal nucleo. Nel gruppo $17$ si scende da $3{,}98$ del fluoro a $2{,}66$ dello iodio. Nei gruppi $13$ e $14$ la discesa ha una piccola irregolarità: gallio e germanio, che vengono dopo i dieci metalli di transizione, superano di poco alluminio e silicio.

Gli elementi più elettronegativi stanno in alto a destra, e sono nell'ordine fluoro, ossigeno, cloro e azoto. I meno elettronegativi sono i metalli in basso a sinistra. I gas nobili più leggeri non hanno un valore sulla scala di Pauling, perché non formano legami da cui ricavarlo. Tutti i valori sono nella [tavola periodica](/strumenti/tavola-periodica) del sito.

Qui puoi seguire l'elettronegatività lungo un periodo o un gruppo a tua scelta, e metterla a confronto con l'affinità elettronica.

```interattivo
% nome: elettronegativita-andamenti
% alt: Un grafico a colonne degli elementi di un periodo o di un gruppo della tavola periodica, da scegliere. Si sceglie anche la grandezza: l'elettronegatività di Pauling oppure l'affinità elettronica in chilojoule alla mole. Toccando un elemento si leggono il suo valore, la carica nucleare efficace e il livello esterno. Per gli elementi che non liberano energia acquistando un elettrone la colonna è vuota
```

Le colonne dell'elettronegatività salgono in ogni periodo senza interruzioni, e nei gruppi della figura non risalgono mai. Quelle dell'affinità elettronica hanno invece dei vuoti, nel gruppo $2$, nell'azoto e nei gas nobili, e nei gruppi $16$ e $17$ il secondo elemento supera il primo. L'elettronegatività è la più regolare delle proprietà periodiche, ed è per questo la più usata per fare previsioni.

```ad-example
Esempio 3: ordinare per elettronegatività
Disponi in ordine di elettronegatività crescente $\mathrm{P}$, $\mathrm{Na}$, $\mathrm{Cl}$ e $\mathrm{Al}$, senza guardare i valori.

Sono tutti nel terzo periodo, nei gruppi $15$, $1$, $17$ e $13$. Lungo un periodo l'elettronegatività cresce da sinistra a destra:

$$\mathrm{Na} < \mathrm{Al} < \mathrm{P} < \mathrm{Cl}$$

I valori lo confermano: $0{,}93$, $1{,}61$, $2{,}19$ e $3{,}16$.
```

```ad-warning
Elettronegatività e affinità elettronica non sono la stessa cosa
L'affinità elettronica è un'energia, si misura in $\text{kJ/mol}$ e riguarda un atomo isolato che acquista un elettrone intero. L'elettronegatività è un numero senza unità e riguarda un atomo legato, che attira elettroni condivisi. Il cloro ha l'affinità elettronica più alta, ma l'elemento più elettronegativo è il fluoro.
```

```ad-note
Un altro modo di definirla
Nel 1934 il chimico americano Robert Mulliken propose di calcolare l'elettronegatività come media tra l'energia di ionizzazione e l'affinità elettronica: un atomo che trattiene bene i suoi elettroni e ne acquista volentieri altri attira anche quelli di un legame. I valori sono diversi da quelli di Pauling, l'ordine degli elementi è quasi lo stesso.
```

## La differenza di elettronegatività

In un legame conta il confronto tra i due atomi. La **differenza di elettronegatività**, $\Delta\chi$, si calcola togliendo il valore più piccolo dal più grande:

$$\Delta\chi = \chi_{\text{maggiore}} - \chi_{\text{minore}}$$

È sempre positiva o nulla. L'atomo con $\chi$ maggiore prende la carica parziale $\delta^-$, l'altro la $\delta^+$; più $\Delta\chi$ è grande, più gli elettroni sono spostati.

```ad-example
Esempio 4: la differenza di elettronegatività in tre legami
Calcola $\Delta\chi$ per i legami $\mathrm{H{-}Cl}$, $\mathrm{O{-}H}$ e $\mathrm{C{-}H}$, e di' su quale atomo sta la carica $\delta^-$.

Dalla tabella: $\chi(\mathrm{H}) = 2{,}20$, $\chi(\mathrm{C}) = 2{,}55$, $\chi(\mathrm{O}) = 3{,}44$, $\chi(\mathrm{Cl}) = 3{,}16$.

$$\mathrm{H{-}Cl}:\quad \Delta\chi = 3{,}16 - 2{,}20 = 0{,}96$$

$$\mathrm{O{-}H}:\quad \Delta\chi = 3{,}44 - 2{,}20 = 1{,}24$$

$$\mathrm{C{-}H}:\quad \Delta\chi = 2{,}55 - 2{,}20 = 0{,}35$$

La carica $\delta^-$ sta sul cloro, sull'ossigeno e sul carbonio, e l'idrogeno è $\delta^+$ in tutti e tre. Il legame con gli elettroni più spostati è $\mathrm{O{-}H}$; nel legame $\mathrm{C{-}H}$ sono condivisi quasi alla pari.
```

```ad-example
Esempio 5: quando la posizione non decide
È più elettronegativo il carbonio o lo zolfo?

Il carbonio è nel secondo periodo e nel gruppo $14$, lo zolfo nel terzo periodo e nel gruppo $16$. Lo zolfo è più a destra, e questo lo favorisce; ma è anche più in basso, e questo lo sfavorisce. Le due regole vanno in versi opposti, quindi la posizione non decide: servono i valori.

$$\chi(\mathrm{C}) = 2{,}55 \qquad \chi(\mathrm{S}) = 2{,}58$$

Sono quasi uguali: $\Delta\chi = 2{,}58 - 2{,}55 = 0{,}03$. Nel legame $\mathrm{C{-}S}$ gli elettroni sono condivisi praticamente alla pari.
```

```ad-warning
Il segno meno sta sull'atomo più elettronegativo
"Elettronegativo" vuol dire che attira elettroni, non che l'atomo è negativo di suo: un atomo neutro di fluoro ha carica zero. Diventa $\delta^-$ solo dentro un legame con un atomo meno elettronegativo. E l'idrogeno non è sempre $\delta^+$: legato al sodio ($\chi = 0{,}93$) è lui il più elettronegativo.
```

Dal valore di $\Delta\chi$ si riconosce il tipo di legame, covalente puro, covalente polare o ionico: è l'argomento della lezione [Legame covalente polare e legame dativo](/materiale/scuola-superiore/chimica/i-legami-chimici/legame-covalente-polare-e-legame-dativo).

## Le quattro proprietà periodiche insieme

```tikz
% nome: elettronegativita-andamenti-tavola
% alt: Lo schema della tavola periodica, un rettangolo con l'incavo in alto, con due coppie di frecce. Una freccia verso destra sopra la tavola e una verso l'alto sul lato destro: energia di ionizzazione, affinità elettronica ed elettronegatività aumentano andando a destra e salendo. Una freccia verso sinistra sotto la tavola e una verso il basso sul lato sinistro: il raggio atomico aumenta andando a sinistra e scendendo. Nell'angolo in alto a destra della tavola c'è il fluoro, in quello in basso a sinistra il cesio
% svg: elettronegativita-andamenti-tavola-b34f2ed2.svg 309x194
\begin{tikzpicture}
\draw[thick, fill=gray!12] (0,0) -- (7.2,0) -- (7.2,2.8) -- (6.8,2.8) -- (6.8,2.4) -- (4.8,2.4) -- (4.8,1.6) -- (0.8,1.6) -- (0.8,2.4) -- (0.4,2.4) -- (0.4,2.8) -- (0,2.8) -- cycle;
\draw[-{Stealth}, thick, red] (7.55,0) -- (7.55,2.8);
\draw[-{Stealth}, thick, red] (0,3.15) -- (7.2,3.15);
\node[red, above] at (3.6,3.6) {\small energia di ionizzazione, affinità elettronica,};
\node[red, above] at (3.6,3.2) {\small elettronegatività: aumentano};
\draw[-{Stealth}, thick, blue] (-0.35,2.8) -- (-0.35,0);
\draw[-{Stealth}, thick, blue] (7.2,-0.35) -- (0,-0.35);
\node[blue, below] at (3.6,-0.4) {\small raggio atomico: aumenta};
\node at (6.6,2.05) {\small F};
\node at (0.25,0.3) {\small Cs};
\end{tikzpicture}
```

| Proprietà | Lungo un periodo, verso destra | Lungo un gruppo, verso il basso |
|---|---|---|
| Raggio atomico | diminuisce | aumenta |
| Energia di ionizzazione | aumenta | diminuisce |
| Affinità elettronica | aumenta, fino al gruppo $17$ | tende a diminuire |
| Elettronegatività | aumenta | diminuisce |

La causa è una sola. In alto a destra la carica nucleare efficace è grande e il livello esterno è vicino al nucleo: gli atomi sono piccoli, trattengono i loro elettroni, ne acquistano altri e attirano quelli dei legami. In basso a sinistra succede il contrario. Da qui viene la divisione degli elementi in metalli e non metalli, che è l'argomento della lezione [Metalli, non metalli e semimetalli](/materiale/scuola-superiore/chimica/il-sistema-periodico/metalli-non-metalli-e-semimetalli).
