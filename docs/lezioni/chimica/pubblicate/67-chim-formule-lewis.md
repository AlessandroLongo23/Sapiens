# Le formule di Lewis delle molecole

La formula $\mathrm{CO_2}$ dice che la molecola ha un atomo di carbonio e due di ossigeno, ma non dice chi è legato a chi, né con quanti legami, né dove stanno gli elettroni che non partecipano ai legami. La formula di Lewis lo dice: è il disegno di tutti gli elettroni di valenza della molecola. Da lì si ricava la forma con la [teoria VSEPR](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/la-geometria-delle-molecole), e dalla forma la [polarità](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/molecole-polari-e-apolari). Per scriverla c'è un procedimento che funziona quasi sempre, e tre casi in cui la regola dell'ottetto non viene rispettata.

## Che cosa mostra una formula di Lewis

In una **formula di Lewis** ogni atomo è il suo simbolo, e intorno ai simboli sono disegnati tutti gli elettroni di valenza, a coppie. Una coppia condivisa tra due atomi è una **coppia di legame** e si disegna con un trattino; due trattini sono un legame doppio, tre un legame triplo, come nella lezione sul [legame covalente](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-covalente). Una coppia che appartiene a un solo atomo è una **coppia solitaria** e si disegna con due puntini accanto al simbolo.

```tikz
% nome: formule-lewis-acqua-coppie
% alt: La formula di Lewis dell'acqua: l'ossigeno al centro, legato con un trattino a ciascuno dei due idrogeni, e due coppie di puntini sopra l'ossigeno. Un'etichetta indica una coppia di puntini come coppia solitaria, un'altra indica un trattino come coppia di legame
% svg: formule-lewis-acqua-coppie-30bf6378.svg 195x67
\begin{tikzpicture}
\node at (0,0) {O};
\node at (-0.9,-0.45) {H};
\node at (0.9,-0.45) {H};
\draw[thin] (0.35,0.42) -- (1.3,0.75);
\node[right] at (1.3,0.75) {\small coppia solitaria};
\draw[thin] (0.52,-0.34) -- (1.3,-0.05);
\node[right] at (1.3,-0.05) {\small coppia di legame};
\foreach \a/\b/\c/\d in {-0.24/-0.12/-0.66/-0.33, 0.24/-0.12/0.66/-0.33} \draw[thick] (\a,\b) -- (\c,\d);
\foreach \x/\y in {0.21/0.22, 0.09/0.3, -0.09/0.3, -0.21/0.22} \fill (\x,\y) circle (1pt);
\end{tikzpicture}
```

Nell'acqua gli elettroni di valenza sono $8$: $6$ dell'ossigeno e $1$ per ciascun idrogeno. Nella formula ci sono tutti: $4$ nei due trattini e $4$ nelle due coppie solitarie. L'ossigeno ha intorno $8$ elettroni, contando sia le coppie solitarie sia quelle di legame, e ogni idrogeno ne ha $2$: la [regola dell'ottetto](/materiale/scuola-superiore/chimica/i-legami-chimici/energia-di-legame-e-regola-dell-ottetto) è rispettata.

```ad-warning
Una coppia di legame conta per tutti e due gli atomi
Quando controlli l'ottetto di un atomo, i due elettroni di un trattino valgono per entrambi gli atomi che unisce. Quando conti gli elettroni totali della formula, invece, ogni trattino vale $2$ una volta sola.
```

## Il procedimento

1. Conta gli elettroni di valenza di tutti gli atomi (si leggono dal gruppo, come per i [simboli di Lewis](/materiale/scuola-superiore/chimica/il-sistema-periodico/elettroni-di-valenza-e-simboli-di-lewis)). Se la specie è uno ione, aggiungi un elettrone per ogni carica negativa e togline uno per ogni carica positiva.
2. Disegna lo scheletro. L'atomo centrale è di solito il meno elettronegativo; l'idrogeno non è mai al centro, perché forma un solo legame. Unisci ogni atomo esterno al centrale con un legame semplice.
3. Togli dal totale $2$ elettroni per ogni legame disegnato.
4. Con gli elettroni rimasti completa l'ottetto degli atomi esterni, mettendo coppie solitarie. L'idrogeno è già a posto con il suo legame.
5. Se avanzano elettroni, mettili sull'atomo centrale.
6. Se l'atomo centrale non arriva a $8$ elettroni, prendi una coppia solitaria di un atomo esterno e trasformala in un legame in più con l'atomo centrale. Ripeti finché l'ottetto è completo.
7. Controlla: $8$ elettroni intorno a ogni atomo, $2$ intorno all'idrogeno, e il totale uguale a quello del passo 1.

Per le molecole semplici della lezione sul legame covalente arrivi alla stessa formula dando a ogni atomo i legami che gli servono, $8$ meno i suoi elettroni di valenza e uno solo per l'idrogeno. Il procedimento di questa lezione vale anche per gli ioni e per le molecole in cui quel conto non torna.

```ad-example
Esempio 1: l'ammoniaca
Scrivi la formula di Lewis dell'ammoniaca, $\mathrm{NH_3}$.

Gli elettroni di valenza sono $5 + 3 \cdot 1 = 8$. L'azoto è al centro, con tre legami semplici verso gli idrogeni: $3 \cdot 2 = 6$ elettroni usati, ne restano $2$. Gli idrogeni sono a posto, e i due elettroni vanno sull'azoto come coppia solitaria.

Controllo: tre trattini e una coppia solitaria fanno $6 + 2 = 8$ elettroni; l'azoto ne ha intorno $8$, ogni idrogeno $2$.
```

```ad-example
Esempio 2: il diossido di carbonio
Scrivi la formula di Lewis del diossido di carbonio, $\mathrm{CO_2}$.

Gli elettroni di valenza sono $4 + 2 \cdot 6 = 16$. Il carbonio, meno elettronegativo, è al centro. Due legami semplici usano $4$ elettroni, e i $12$ che restano completano l'ottetto dei due ossigeni, con tre coppie solitarie ciascuno. Non avanza niente per il carbonio, che ha intorno solo $4$ elettroni.

Una coppia solitaria di ciascun ossigeno diventa allora un secondo legame con il carbonio: due legami doppi, e due coppie solitarie su ogni ossigeno.
```

```tikz
% nome: formule-lewis-diossido-carbonio-passi
% alt: La formula di Lewis del diossido di carbonio in tre passi. Primo: lo scheletro, con due legami semplici. Secondo: tre coppie solitarie su ciascun ossigeno. Terzo: due doppi legami, e due coppie solitarie su ogni ossigeno
% svg: formule-lewis-diossido-carbonio-passi-b0794db0.svg 372x59
\begin{tikzpicture}
\node at (0,0) {O};
\node at (1,0) {C};
\node at (2,0) {O};
\node at (3.4,0) {O};
\node at (4.4,0) {C};
\node at (5.4,0) {O};
\node at (6.8,0) {O};
\node at (7.8,0) {C};
\node at (8.8,0) {O};
\draw[-{Stealth}, thick] (2.45,0) -- (2.85,0);
\draw[-{Stealth}, thick] (5.9,0) -- (6.3,0);
\node at (1,-0.9) {\small scheletro: $4$ elettroni};
\node at (4.4,-0.9) {\small ottetti esterni: $16$};
\node at (7.8,-0.9) {\small due doppi legami};
\foreach \a/\b/\c/\d in {0.27/0/0.73/0, 1.27/0/1.73/0, 3.67/0/4.13/0, 4.67/0/5.13/0, 7.07/-0.06/7.53/-0.06, 7.07/0.06/7.53/0.06, 8.07/-0.06/8.53/-0.06, 8.07/0.06/8.53/0.06} \draw[thick] (\a,\b) -- (\c,\d);
\foreach \x/\y in {3.48/0.3, 3.32/0.3, 3.1/0.08, 3.1/-0.07, 3.32/-0.3, 3.48/-0.3, 5.48/0.3, 5.33/0.3, 5.7/-0.07, 5.7/0.07, 5.33/-0.3, 5.48/-0.3, 6.71/0.3, 6.59/0.22, 6.59/-0.22, 6.71/-0.3, 9.01/0.22, 8.89/0.3, 8.89/-0.3, 9.01/-0.22} \fill (\x,\y) circle (1pt);
\end{tikzpicture}
```

Il controllo finale: quattro trattini e quattro coppie solitarie fanno $8 + 8 = 16$ elettroni, e tutti e tre gli atomi hanno l'ottetto.

```ad-tip
Quanti legami servono
Somma gli elettroni che servirebbero se ogni atomo avesse il suo ottetto senza condividere niente ($8$ per atomo, $2$ per l'idrogeno) e togli gli elettroni di valenza: la differenza, divisa per due, è il numero di coppie di legame. Per il $\mathrm{CO_2}$: $(3 \cdot 8 - 16) : 2 = 4$ legami, cioè due doppi. Vale quando tutti gli atomi rispettano l'ottetto.
```

```ad-warning
Aggiungere elettroni per far tornare gli ottetti
Gli elettroni sono quelli contati al passo 1, né uno di più né uno di meno. Se a un atomo manca l'ottetto non si aggiungono puntini: si sposta una coppia solitaria già disegnata e la si trasforma in un legame.
```

### Gli ossiacidi

Negli acidi che contengono ossigeno, gli ossiacidi, l'atomo centrale è il non metallo, gli ossigeni gli stanno intorno e ogni idrogeno è legato a un ossigeno, non all'atomo centrale.

```ad-example
Esempio 3: l'acido carbonico
Scrivi la formula di Lewis dell'acido carbonico, $\mathrm{H_2CO_3}$.

Gli elettroni di valenza sono $2 \cdot 1 + 4 + 3 \cdot 6 = 24$. Il carbonio è al centro, legato ai tre ossigeni; due ossigeni portano un idrogeno ciascuno. I legami dello scheletro sono $5$ e usano $10$ elettroni: ne restano $14$.

L'ossigeno senza idrogeno ha un solo legame e prende tre coppie solitarie; i due ossigeni con l'idrogeno hanno già due legami e ne prendono due ciascuno: $6 + 4 + 4 = 14$, e gli elettroni sono finiti. Il carbonio ha tre legami, cioè $6$ elettroni: una coppia solitaria dell'ossigeno senza idrogeno diventa un doppio legame.

Controllo: $6$ trattini e $6$ coppie solitarie, $12 + 12 = 24$ elettroni.
```

```tikz
% nome: formule-lewis-ossiacidi-carbonico-ipobromoso
% alt: Due formule di Lewis. L'acido carbonico: il carbonio al centro, un ossigeno unito da un doppio legame, gli altri due da legami semplici e legati ciascuno a un idrogeno; ogni ossigeno ha due coppie solitarie. L'acido ipobromoso: idrogeno, ossigeno e bromo in fila, con due coppie solitarie sull'ossigeno e tre sul bromo
% svg: formule-lewis-ossiacidi-carbonico-ipobromoso-8ead59c2.svg 311x126
\begin{tikzpicture}
\node at (0,0) {C};
\node at (0,1) {O};
\node at (-0.9,-0.5) {O};
\node at (0.9,-0.5) {O};
\node at (-1.8,-1) {H};
\node at (1.8,-1) {H};
\node at (0,-1.7) {\small H$_2$CO$_3$};
\node at (3.6,0) {H};
\node at (4.6,0) {O};
\node at (5.7,0) {Br};
\node at (4.65,-1.7) {\small HBrO};
\foreach \a/\b/\c/\d in {0.06/0.27/0.06/0.73, -0.06/0.27/-0.06/0.73, -0.24/-0.13/-0.66/-0.37, 0.24/-0.13/0.66/-0.37, -1.14/-0.63/-1.56/-0.87, 1.14/-0.63/1.56/-0.87, 3.87/0/4.33/0, 4.87/0/5.37/0} \draw[thick] (\a,\b) -- (\c,\d);
\foreach \x/\y in {0.27/1.16, 0.16/1.27, -0.16/1.27, -0.27/1.16, -0.98/-0.2, -1.11/-0.27, -0.82/-0.8, -0.69/-0.73, 1.11/-0.27, 0.98/-0.2, 0.69/-0.73, 0.82/-0.8, 4.67/0.3, 4.52/0.3, 4.52/-0.3, 4.67/-0.3, 5.78/0.3, 5.62/0.3, 6.05/-0.07, 6.05/0.07, 5.62/-0.3, 5.78/-0.3} \fill (\x,\y) circle (1pt);
\end{tikzpicture}
```

L'acido ipobromoso, $\mathrm{HBrO}$, si scrive nello stesso modo: l'ossigeno sta tra l'idrogeno e il bromo, anche se la formula li elenca in un altro ordine. Gli elettroni sono $1 + 7 + 6 = 14$: $4$ nei due legami, $4$ nelle due coppie dell'ossigeno, $6$ nelle tre coppie del bromo.

```ad-warning
L'ordine della formula non è l'ordine degli atomi
In $\mathrm{HBrO}$ l'idrogeno non è legato al bromo, e in $\mathrm{H_2CO_3}$ gli idrogeni non sono legati al carbonio. La formula bruta elenca gli atomi; a dire come sono uniti è lo scheletro, che per gli ossiacidi è sempre idrogeno, ossigeno, atomo centrale.
```

## Gli ioni poliatomici

Per uno ione il procedimento è lo stesso, con due attenzioni: la carica entra nel conto degli elettroni al passo 1, e la formula finita si chiude tra parentesi quadre con la carica in alto a destra, perché la carica appartiene a tutto lo ione.

```ad-example
Esempio 4: lo ione cianuro
Scrivi la formula di Lewis dello ione cianuro, $\mathrm{CN^-}$.

Gli elettroni di valenza sono $4 + 5 = 9$, più uno per la carica negativa: $10$. Il legame semplice tra carbonio e azoto ne usa $2$, e ne restano $8$: tre coppie all'azoto, che è il più elettronegativo, e una al carbonio. L'azoto ha l'ottetto, il carbonio ha intorno solo $4$ elettroni. Due coppie solitarie dell'azoto diventano legami: tra i due atomi c'è un legame triplo, e a ciascuno resta una coppia solitaria.

Controllo: $6$ elettroni nel legame triplo e $4$ nelle due coppie solitarie fanno $10$.
```

```tikz
% nome: formule-lewis-ioni-cianuro-ammonio
% alt: Due formule di Lewis di ioni tra parentesi quadre, con la carica fuori. Lo ione cianuro: carbonio e azoto uniti da un legame triplo, ciascuno con una coppia solitaria. Lo ione ammonio: l'azoto legato a quattro idrogeni, senza coppie solitarie
% svg: formule-lewis-ioni-cianuro-ammonio-2ab2f978.svg 251x118
\begin{tikzpicture}
\node at (0,0) {C};
\node at (1,0) {N};
\draw[thick] (-0.38,-0.5) -- (-0.5,-0.5) -- (-0.5,0.5) -- (-0.38,0.5);
\draw[thick] (1.38,-0.5) -- (1.5,-0.5) -- (1.5,0.5) -- (1.38,0.5);
\node[right] at (1.45,0.5) {\small $-$};
\node at (4.2,0) {N};
\node at (3.3,0) {H};
\node at (5.1,0) {H};
\node at (4.2,0.9) {H};
\node at (4.2,-0.9) {H};
\draw[thick] (2.92,-1.4) -- (2.8,-1.4) -- (2.8,1.4) -- (2.92,1.4);
\draw[thick] (5.48,-1.4) -- (5.6,-1.4) -- (5.6,1.4) -- (5.48,1.4);
\node[right] at (5.55,1.4) {\small $+$};
\foreach \a/\b/\c/\d in {0.27/-0.09/0.73/-0.09, 0.27/0/0.73/0, 0.27/0.09/0.73/0.09, 3.93/0/3.57/0, 4.47/0/4.83/0, 4.2/0.27/4.2/0.63, 4.2/-0.27/4.2/-0.63} \draw[thick] (\a,\b) -- (\c,\d);
\foreach \x/\y in {-0.3/0.08, -0.3/-0.07, 1.3/-0.07, 1.3/0.07} \fill (\x,\y) circle (1pt);
\end{tikzpicture}
```

Nello ione ammonio, $\mathrm{NH_4^+}$, la carica positiva toglie un elettrone: $5 + 4 \cdot 1 - 1 = 8$, che sono esattamente i quattro legami con gli idrogeni. Di come nasce il quarto legame, un legame dativo, parla la lezione sul [legame covalente polare](/materiale/scuola-superiore/chimica/i-legami-chimici/legame-covalente-polare-e-legame-dativo).

```ad-warning
Dimenticare la carica nel conto
Lo ione cianuro ha $10$ elettroni, non $9$; lo ione ammonio ne ha $8$, non $9$. Una carica negativa è un elettrone in più, una positiva un elettrone in meno: chi sbaglia il passo 1 non riesce più a far tornare gli ottetti.
```

## La carica formale

A volte gli stessi elettroni si possono sistemare in più modi che rispettano tutti l'ottetto. Per scegliere si usa la **carica formale**: la carica che un atomo avrebbe se gli elettroni di ogni legame fossero divisi a metà tra i due atomi.

$$\text{carica formale} = \text{elettroni di valenza} - \text{elettroni delle coppie solitarie} - \text{numero di legami}$$

Un legame doppio conta per due, un triplo per tre. La somma delle cariche formali di tutti gli atomi è la carica della specie: zero per una molecola, la carica dello ione per uno ione. Tra due formule possibili è migliore quella con le cariche formali più vicine a zero, e con quelle negative sugli atomi più elettronegativi.

```ad-example
Esempio 5: perché il diossido di carbonio ha due doppi legami
Per il $\mathrm{CO_2}$ rispetta l'ottetto anche una formula con un legame triplo e uno semplice. Quale delle due è migliore?

Con due legami doppi il carbonio ha carica formale $4 - 0 - 4 = 0$ e ogni ossigeno $6 - 4 - 2 = 0$. Con un triplo e un semplice, l'ossigeno del triplo ha una sola coppia solitaria e carica formale $6 - 2 - 3 = +1$, quello del semplice ne ha tre e carica formale $6 - 6 - 1 = -1$. La formula con le cariche formali tutte nulle è la migliore.

Nello ione cianuro il carbonio ha carica formale $4 - 2 - 3 = -1$ e l'azoto $5 - 2 - 3 = 0$: la somma è $-1$, la carica dello ione.
```

Nella figura costruisci tu la formula: lo scheletro è già disegnato, e tu decidi dove mettere le coppie solitarie e quali legami rendere doppi o tripli, tenendo d'occhio il conto degli elettroni.

```interattivo
% nome: formule-lewis-costruisci
% alt: Lo scheletro di una molecola o di uno ione a scelta, con gli atomi uniti da legami semplici. Toccando un atomo gli si aggiunge una coppia solitaria, toccando un legame lo si rende doppio o triplo. Sotto si leggono gli elettroni di valenza da sistemare, quelli sistemati e quanti ne ha intorno ogni atomo; il simbolo diventa verde con l'ottetto completo e rosso con troppi elettroni. Un bottone controlla la formula e dice che cosa non va
```

Nel $\mathrm{CO_2}$ con un triplo e un semplice gli ottetti sono completi e il conto torna, ma accanto ai due ossigeni compaiono le cariche formali $+1$ e $-1$, che con due legami doppi spariscono. Nello ione carbonato il doppio legame si può mettere su uno qualunque dei tre ossigeni, e la figura accetta tutte e tre le scelte: è il caso della prossima sezione.

## La risonanza

Nel triossido di zolfo, $\mathrm{SO_3}$, gli elettroni di valenza sono $6 + 3 \cdot 6 = 24$. Tre legami semplici ne usano $6$, e i $18$ che restano completano l'ottetto dei tre ossigeni. Lo zolfo resta con $6$ elettroni, e una coppia solitaria di un ossigeno deve diventare un doppio legame. Ma di quale ossigeno? I tre sono equivalenti, e si possono scrivere tre formule diverse, tutte corrette.

```tikz
% nome: formule-lewis-triossido-zolfo-risonanza
% alt: Tre formule di Lewis del triossido di zolfo, separate da frecce a due punte. In ognuna lo zolfo è al centro di tre ossigeni: uno è unito da un doppio legame e ha due coppie solitarie, gli altri due da legami semplici e ne hanno tre. Il doppio legame è su un ossigeno diverso in ciascuna formula
% svg: formule-lewis-triossido-zolfo-risonanza-5c698fce.svg 349x85
\begin{tikzpicture}
\node at (0,0) {S};
\node at (0,1) {O};
\node at (-0.87,-0.5) {O};
\node at (0.87,-0.5) {O};
\node at (3.4,0) {S};
\node at (3.4,1) {O};
\node at (2.53,-0.5) {O};
\node at (4.27,-0.5) {O};
\node at (6.8,0) {S};
\node at (6.8,1) {O};
\node at (5.93,-0.5) {O};
\node at (7.67,-0.5) {O};
\draw[{Stealth}-{Stealth}, thick] (1.35,0) -- (2.05,0);
\draw[{Stealth}-{Stealth}, thick] (4.75,0) -- (5.45,0);
\foreach \a/\b/\c/\d in {0.06/0.27/0.06/0.73, -0.05/0.27/-0.05/0.73, -0.23/-0.14/-0.63/-0.37, 0.23/-0.14/0.63/-0.37, 3.4/0.27/3.4/0.73, 3.14/-0.09/2.74/-0.32, 3.19/-0.18/2.8/-0.41, 3.63/-0.14/4.03/-0.37, 6.8/0.27/6.8/0.73, 6.57/-0.14/6.17/-0.37, 7.01/-0.18/7.4/-0.41, 7.06/-0.09/7.46/-0.32} \draw[thick] (\a,\b) -- (\c,\d);
\foreach \x/\y in {0.3/0.93, 0.3/1.07, -0.3/1.07, -0.3/0.93, -0.95/-0.2, -1.08/-0.28, -1.16/-0.59, -1.09/-0.71, -0.78/-0.8, -0.65/-0.72, 0.65/-0.72, 0.78/-0.8, 1.09/-0.71, 1.16/-0.59, 1.08/-0.28, 0.95/-0.2, 3.7/0.93, 3.7/1.07, 3.48/1.3, 3.32/1.3, 3.1/1.07, 3.1/0.93, 2.45/-0.2, 2.32/-0.28, 2.62/-0.8, 2.75/-0.72, 4.05/-0.72, 4.18/-0.8, 4.49/-0.71, 4.56/-0.59, 4.48/-0.28, 4.35/-0.2, 7.1/0.93, 7.1/1.07, 6.88/1.3, 6.72/1.3, 6.5/1.07, 6.5/0.93, 5.85/-0.2, 5.72/-0.28, 5.64/-0.59, 5.71/-0.71, 6.02/-0.8, 6.15/-0.72, 7.45/-0.72, 7.58/-0.8, 7.88/-0.28, 7.75/-0.2} \fill (\x,\y) circle (1pt);
\end{tikzpicture}
```

Le misure dicono che nella molecola vera i tre legami tra zolfo e ossigeno sono identici, con la stessa lunghezza. Nessuna delle tre formule, in cui un legame è diverso dagli altri due, descrive da sola la molecola. Quando succede si parla di **risonanza**: le formule che differiscono solo per la posizione degli elettroni si chiamano **formule limite** e si scrivono separate da una freccia a due punte; la molecola reale è una via di mezzo tra tutte, l'**ibrido di risonanza**. Hanno formule limite anche l'ozono $\mathrm{O_3}$, lo ione carbonato $\mathrm{CO_3^{2-}}$ e lo ione nitrato $\mathrm{NO_3^-}$.

```ad-warning
La molecola non salta da una formula all'altra
La freccia a due punte non indica una reazione né un movimento. Il doppio legame non gira da un ossigeno all'altro: la molecola ha sempre la stessa struttura, con tre legami uguali, che una sola formula a trattini non sa disegnare.
```

## Le eccezioni alla regola dell'ottetto

La regola dell'ottetto è un modello, e ha tre limiti che ogni libro riporta.

```tikz
% nome: formule-lewis-eccezioni-ottetto
% alt: Tre formule di Lewis che non rispettano l'ottetto. Il trifluoruro di boro: il boro al centro con tre legami semplici e sei elettroni intorno. Il monossido di azoto: azoto e ossigeno uniti da un doppio legame, l'azoto con una coppia solitaria e un elettrone spaiato. Il pentacloruro di fosforo: il fosforo al centro con cinque legami semplici e dieci elettroni intorno
% svg: formule-lewis-eccezioni-ottetto-a9dcd6ca.svg 385x123
\begin{tikzpicture}
\node at (0,0) {B};
\node at (0,1) {F};
\node at (-0.87,-0.5) {F};
\node at (0.87,-0.5) {F};
\node at (0,-1.6) {\small BF$_3$: $6$ intorno a B};
\node at (2.9,0) {N};
\node at (3.9,0) {O};
\node at (3.4,-1.6) {\small NO: $11$ in tutto};
\node at (7,0) {P};
\node at (7,1) {Cl};
\node at (7.95,0.31) {Cl};
\node at (7.59,-0.81) {Cl};
\node at (6.41,-0.81) {Cl};
\node at (6.05,0.31) {Cl};
\node at (7.0,-1.6) {\small PCl$_5$: $10$ intorno a P};
\foreach \a/\b/\c/\d in {0/0.27/0/0.73, -0.23/-0.14/-0.63/-0.37, 0.23/-0.14/0.63/-0.37, 3.17/-0.06/3.63/-0.06, 3.17/0.06/3.63/0.06, 7/0.27/7/0.67, 7.26/0.08/7.64/0.21, 7.16/-0.22/7.39/-0.54, 6.84/-0.22/6.61/-0.54, 6.74/0.08/6.36/0.21} \draw[thick] (\a,\b) -- (\c,\d);
\foreach \x/\y in {0.3/0.93, 0.3/1.07, 0.08/1.3, -0.07/1.3, -0.3/1.07, -0.3/0.93, -0.95/-0.2, -1.08/-0.28, -1.16/-0.59, -1.09/-0.71, -0.78/-0.8, -0.65/-0.72, 0.65/-0.72, 0.78/-0.8, 1.09/-0.71, 1.16/-0.59, 1.08/-0.28, 0.95/-0.2, 2.98/0.3, 2.82/0.3, 2.8/-0.28, 4.11/0.22, 3.99/0.3, 3.99/-0.3, 4.11/-0.22, 7.35/0.93, 7.35/1.07, 7.08/1.3, 6.92/1.3, 6.65/1.07, 6.65/0.93, 7.97/0, 8.12/0.05, 8.31/0.35, 8.26/0.49, 7.93/0.62, 7.79/0.57, 7.26/-0.95, 7.35/-1.08, 7.73/-1.14, 7.85/-1.05, 7.92/-0.66, 7.83/-0.54, 6.17/-0.54, 6.08/-0.66, 6.15/-1.05, 6.27/-1.14, 6.65/-1.08, 6.74/-0.95, 6.21/0.57, 6.07/0.62, 5.74/0.49, 5.69/0.35, 5.88/0.05, 6.03/0} \fill (\x,\y) circle (1pt);
\end{tikzpicture}
```

- Ottetto incompleto. Nel trifluoruro di boro, $\mathrm{BF_3}$, gli elettroni sono $3 + 3 \cdot 7 = 24$: finiscono tutti nei tre legami e negli ottetti dei tre atomi di fluoro. Il boro resta con $6$ elettroni. Un doppio legame gli darebbe l'ottetto, ma metterebbe una carica formale $+1$ sul fluoro, l'elemento più elettronegativo: la formula migliore è quella con il boro a sei elettroni. Si comportano così i composti del boro e del berillio.
- Numero dispari di elettroni. Il monossido di azoto, $\mathrm{NO}$, ha $5 + 6 = 11$ elettroni di valenza: con un numero dispari un atomo resta per forza con un elettrone spaiato, e non può avere l'ottetto. Le specie con un elettrone spaiato si chiamano radicali e sono molto reattive.
- Ottetto espanso. Nel pentacloruro di fosforo, $\mathrm{PCl_5}$, il fosforo forma cinque legami e ha intorno $10$ elettroni; nell'esafluoruro di zolfo, $\mathrm{SF_6}$, lo zolfo ne ha $12$. Succede solo con atomi centrali dal terzo periodo in poi. Carbonio, azoto, ossigeno e fluoro, del secondo periodo, non superano mai gli otto elettroni.

```ad-warning
Un ottetto espanso sul secondo periodo
Un azoto o un carbonio con cinque legami sono sempre un errore di conto: prima di accettare più di otto elettroni intorno a un atomo controlla in che periodo si trova.
```

### L'acido solforico si disegna in due modi

Per gli ossiacidi con l'atomo centrale del terzo periodo troverai due formule diverse. Nell'acido solforico, $\mathrm{H_2SO_4}$, gli elettroni sono $2 + 6 + 4 \cdot 6 = 32$, e il procedimento dà una formula con soli legami semplici in cui tutti gli atomi hanno l'ottetto; lo zolfo ha carica formale $6 - 0 - 4 = +2$ e i due ossigeni senza idrogeno $6 - 6 - 1 = -1$. Molti libri preferiscono azzerare le cariche formali trasformando una coppia solitaria di ciascuno di quei due ossigeni in un doppio legame: lo zolfo ha allora sei legami e un ottetto espanso, con $12$ elettroni.

```tikz
% nome: formule-lewis-acido-solforico-due-modi
% alt: Due formule di Lewis dell'acido solforico. Nella prima lo zolfo ha quattro legami semplici con gli ossigeni: i due ai lati portano un idrogeno, quelli sopra e sotto hanno tre coppie solitarie e carica formale meno, lo zolfo carica formale due più. Nella seconda gli ossigeni sopra e sotto sono uniti allo zolfo da doppi legami, e non ci sono cariche formali
% svg: formule-lewis-acido-solforico-due-modi-08f16d08.svg 371x142
\begin{tikzpicture}
\node at (0,0) {S};
\node at (0,1) {O};
\node at (0,-1) {O};
\node at (-1,0) {O};
\node at (1,0) {O};
\node at (-2,0) {H};
\node at (2,0) {H};
\node at (0.36,0.33) {\scriptsize $2+$};
\node at (0.45,1.3) {\scriptsize $-$};
\node at (0.45,-0.72) {\scriptsize $-$};
\node at (5.2,0) {S};
\node at (5.2,1) {O};
\node at (5.2,-1) {O};
\node at (4.2,0) {O};
\node at (6.2,0) {O};
\node at (3.2,0) {H};
\node at (7.2,0) {H};
\node at (0,-1.9) {\small con l'ottetto};
\node at (5.2,-1.9) {\small con l'ottetto espanso};
\foreach \a/\b/\c/\d in {0/0.27/0/0.73, 0/-0.27/0/-0.73, -0.27/0/-0.73/0, 0.27/0/0.73/0, -1.27/0/-1.73/0, 1.27/0/1.73/0, 5.25/0.27/5.25/0.73, 5.15/0.27/5.15/0.73, 5.15/-0.27/5.15/-0.73, 5.25/-0.27/5.25/-0.73, 4.93/0/4.47/0, 5.47/0/5.93/0, 3.93/0/3.47/0, 6.47/0/6.93/0} \draw[thick] (\a,\b) -- (\c,\d);
\foreach \x/\y in {-0.3/1.07, -0.3/0.93, 0.08/1.3, -0.07/1.3, 0.3/0.93, 0.3/1.07, -0.3/-0.93, -0.3/-1.07, -0.08/-1.3, 0.07/-1.3, 0.3/-1.07, 0.3/-0.93, -0.93/0.3, -1.07/0.3, -1.07/-0.3, -0.93/-0.3, 1.07/0.3, 0.93/0.3, 0.93/-0.3, 1.07/-0.3, 5.47/1.16, 5.36/1.27, 5.04/1.27, 4.93/1.16, 4.93/-1.16, 5.04/-1.27, 5.36/-1.27, 5.47/-1.16, 4.28/0.3, 4.12/0.3, 4.12/-0.3, 4.28/-0.3, 6.28/0.3, 6.12/0.3, 6.12/-0.3, 6.28/-0.3} \fill (\x,\y) circle (1pt);
\end{tikzpicture}
```

Le due formule hanno gli stessi $32$ elettroni e lo stesso scheletro, e portano alla stessa geometria. Nella prima i due legami con gli ossigeni senza idrogeno sono legami dativi, in cui tutti e due gli elettroni vengono dallo zolfo. In questa lezione e nei suoi esercizi, quando non è detto altro, la formula è quella che rispetta l'ottetto. Lo stesso vale per lo ione solfato $\mathrm{SO_4^{2-}}$, per il triossido di zolfo e per l'acido perclorico $\mathrm{HClO_4}$.

## Le formule da ricordare

| Specie | Elettroni di valenza | Legami dell'atomo centrale | Coppie solitarie dell'atomo centrale |
|---|---|---|---|
| $\mathrm{CH_4}$ | $8$ | quattro semplici | $0$ |
| $\mathrm{NH_3}$ | $8$ | tre semplici | $1$ |
| $\mathrm{H_2O}$ | $8$ | due semplici | $2$ |
| $\mathrm{CO_2}$ | $16$ | due doppi | $0$ |
| $\mathrm{BF_3}$ | $24$ | tre semplici (boro con $6$ elettroni) | $0$ |
| $\mathrm{SO_3}$ | $24$ | un doppio e due semplici, in risonanza | $0$ |
| $\mathrm{SO_4^{2-}}$ | $32$ | quattro semplici | $0$ |
