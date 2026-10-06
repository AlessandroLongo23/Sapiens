# Legame covalente polare e legame dativo

Nella molecola di cloro, $\mathrm{Cl_2}$, i due atomi sono uguali e la coppia di elettroni in comune sta a metà strada. Nel cloruro di idrogeno, $\mathrm{HCl}$, gli atomi sono diversi, e il cloro attira la coppia più dell'idrogeno: gli elettroni passano più tempo dalla sua parte. Il legame è ancora covalente, ma ha un lato un po' negativo e uno un po' positivo. Da questa piccola differenza dipendono molte proprietà delle sostanze, a cominciare da quelle dell'acqua. Questa lezione spiega come si riconosce un legame polare, come si passa per gradi dal legame covalente a quello ionico, e che cos'è il legame dativo, in cui la coppia in comune viene tutta da un atomo solo.

## Atomi che attirano la coppia con forza diversa

La grandezza che serve è l'elettronegatività, $\chi$: la tendenza di un atomo ad attirare verso di sé gli elettroni di un legame. La presenta la lezione [Affinità elettronica ed elettronegatività](/materiale/scuola-superiore/chimica/il-sistema-periodico/affinita-elettronica-ed-elettronegativita): sulla scala di Pauling cresce lungo un periodo da sinistra a destra e diminuisce scendendo in un gruppo, il fluoro ha il valore più alto e i metalli alcalini i più bassi.

Questi sono i valori degli elementi che incontri più spesso; gli altri li trovi nella [tavola periodica](/strumenti/tavola-periodica).

| Elemento | $\chi$ | Elemento | $\chi$ | Elemento | $\chi$ |
|---|---|---|---|---|---|
| $\mathrm{H}$ | $2{,}20$ | $\mathrm{F}$ | $3{,}98$ | $\mathrm{S}$ | $2{,}58$ |
| $\mathrm{Li}$ | $0{,}98$ | $\mathrm{Na}$ | $0{,}93$ | $\mathrm{Cl}$ | $3{,}16$ |
| $\mathrm{C}$ | $2{,}55$ | $\mathrm{Mg}$ | $1{,}31$ | $\mathrm{K}$ | $0{,}82$ |
| $\mathrm{N}$ | $3{,}04$ | $\mathrm{Si}$ | $1{,}90$ | $\mathrm{Ca}$ | $1{,}00$ |
| $\mathrm{O}$ | $3{,}44$ | $\mathrm{P}$ | $2{,}19$ | $\mathrm{Br}$ | $2{,}96$ |

Quello che conta in un legame è la **differenza di elettronegatività** tra i due atomi, che si scrive $\Delta\chi$ e si calcola togliendo il valore più piccolo dal più grande, così da avere sempre un numero positivo.

$$\Delta\chi = \chi_{\text{maggiore}} - \chi_{\text{minore}}$$

Per il legame tra idrogeno e cloro, $\Delta\chi = 3{,}16 - 2{,}20 = 0{,}96$.

## Il legame covalente polare

Un **legame covalente polare** è un legame covalente tra due atomi con elettronegatività diversa: la coppia in comune è spostata verso l'atomo più elettronegativo.

```tikz
% nome: polare-nube-cloro-cloruro-idrogeno
% alt: Due molecole a confronto. A sinistra la molecola di cloro: due atomi uguali dentro una nuvola di elettroni simmetrica, uguale dalle due parti. A destra il cloruro di idrogeno: la nuvola è piccola intorno all'idrogeno e grande intorno al cloro. Sull'idrogeno è scritto delta più, sul cloro delta meno, e sotto una freccia arancione, con una piccola croce sulla coda, va dall'idrogeno verso il cloro
% svg: polare-nube-cloro-cloruro-idrogeno-0d928b17.svg 257x113
\begin{tikzpicture}
% cloro
\fill[blue!15] (-0.5,0) circle (0.62);
\fill[blue!15] (0.5,0) circle (0.62);
\node at (-0.5,0) {Cl};
\node at (0.5,0) {Cl};
\draw[thick] (-0.25,0) -- (0.25,0);
\node at (0,-1.55) {\small covalente puro};
% cloruro di idrogeno
\begin{scope}[shift={(4,0)}]
\fill[blue!15] (-0.55,0) circle (0.36);
\fill[blue!15] (0.5,0) circle (0.78);
\fill[blue!15] (-0.55,-0.36) -- (-0.55,0.36) -- (0.3,0.75) -- (0.3,-0.75) -- cycle;
\node at (-0.55,0) {H};
\node at (0.5,0) {Cl};
\draw[thick] (-0.35,0) -- (0.25,0);
\node at (-0.75,0.7) {$\delta^+$};
\node at (1.25,0.85) {$\delta^-$};
\draw[-{Stealth}, thick, orange!90!black] (-0.6,-1.05) -- (0.6,-1.05);
\draw[thick, orange!90!black] (-0.45,-0.95) -- (-0.45,-1.15);
\node at (0,-1.55) {\small covalente polare};
\end{scope}
\end{tikzpicture}
```

L'atomo più elettronegativo ha intorno un po' più di carica negativa di quella che compensa il suo nucleo, e l'altro un po' meno. Queste cariche si chiamano **cariche parziali** e si scrivono con la lettera greca delta: $\delta^-$ sull'atomo più elettronegativo, $\delta^+$ sull'altro. Le hai già incontrate nella lezione [La molecola d'acqua e il legame a idrogeno](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/la-molecola-d-acqua-e-il-legame-a-idrogeno).

Due cariche uguali e opposte a una certa distanza formano un **dipolo**. La polarità di un legame si rappresenta con una freccia che punta verso l'atomo più elettronegativo, cioè verso $\delta^-$, con una piccola croce sulla coda, dalla parte di $\delta^+$: è il **momento dipolare**, che si indica con $\mu$ ed è tanto più grande quanto più grandi sono le cariche parziali e la distanza che le separa.

```ad-warning
Una carica parziale non è la carica di uno ione
Nel cloruro di idrogeno il cloro è $\delta^-$, non $\mathrm{Cl^-}$. Nessun elettrone è passato del tutto da un atomo all'altro: la coppia è ancora in comune, solo spostata, e ogni carica parziale è più piccola della carica di un elettrone. La molecola nel suo insieme resta neutra, perché $\delta^+$ e $\delta^-$ sono uguali e opposte.
```

## La differenza di elettronegatività dice il tipo di legame

Più grande è $\Delta\chi$, più la coppia è spostata. Con $\Delta\chi$ molto grande l'elettrone passa del tutto all'atomo più elettronegativo: non c'è più una coppia in comune, ci sono due ioni, e il legame è [ionico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-ionico). Tra il legame covalente puro e quello ionico non c'è un salto: si passa dall'uno all'altro per gradi, e il covalente polare sta in mezzo.

Per classificare un legame si usano due soglie.

| $\Delta\chi$ | Tipo di legame | La coppia di elettroni | Esempio |
|---|---|---|---|
| minore di $0{,}4$ | covalente puro | in comune, a metà | $\mathrm{Cl{-}Cl}$, $\Delta\chi = 0$ |
| da $0{,}4$ a $1{,}9$ | covalente polare | in comune, spostata | $\mathrm{H{-}Cl}$, $\Delta\chi = 0{,}96$ |
| maggiore di $1{,}9$ | ionico | passata a un atomo solo | $\mathrm{NaCl}$, $\Delta\chi = 2{,}23$ |

```tikz
% nome: polare-scala-delta-chi
% alt: Una scala orizzontale della differenza di elettronegatività, da 0 a 3,3, divisa in tre fasce. Da 0 a 0,4 la fascia grigia del legame covalente puro, con i legami cloro-cloro a 0 e carbonio-idrogeno a 0,35. Da 0,4 a 1,9 la fascia azzurra del legame covalente polare, con idrogeno-cloro a 0,96, ossigeno-idrogeno a 1,24 e idrogeno-fluoro a 1,78. Oltre 1,9 la fascia arancione del legame ionico, con sodio-cloro a 2,23 e potassio-fluoro a 3,16
% svg: polare-scala-delta-chi-7ca1766d.svg 370x106
\begin{tikzpicture}[x=2.5cm]
\fill[gray!25] (0,0) rectangle (0.4,0.45);
\fill[blue!15] (0.4,0) rectangle (1.9,0.45);
\fill[orange!30] (1.9,0) rectangle (3.3,0.45);
\draw[thick] (0,0) -- (3.3,0);
\foreach \x in {0, 0.4, 1.9} \draw[thick] (\x,0.55) -- (\x,-0.1);
\node[above] at (0,0.55) {\small $0$};
\node[above] at (0.4,0.55) {\small $0{,}4$};
\node[above] at (1.9,0.55) {\small $1{,}9$};
\node[right] at (3.3,0.22) {\small $\Delta\chi$};
\node at (1.15,0.22) {\small covalente polare};
\node at (2.6,0.22) {\small ionico};
\draw[thin] (0.2,0.45) -- (0.2,1.25);
\node[above] at (0.45,1.2) {\small covalente puro};
\foreach \x in {0, 0.35, 0.96, 1.24, 1.78, 2.23, 3.16} \fill (\x,0) circle (1.6pt);
\node[below] at (-0.08,-0.1) {\small Cl--Cl};
\node[below] at (0.35,-0.55) {\small C--H};
\node[below] at (0.96,-0.1) {\small H--Cl};
\node[below] at (1.3,-0.55) {\small O--H};
\node[below] at (1.78,-0.1) {\small H--F};
\node[below] at (2.23,-0.55) {\small Na--Cl};
\node[below] at (3.16,-0.1) {\small K--F};
\draw[thin] (0.35,0) -- (0.35,-0.6);
\draw[thin] (1.24,0) -- (1.28,-0.6);
\draw[thin] (2.23,0) -- (2.23,-0.6);
\end{tikzpicture}
```

Il legame $\mathrm{C{-}H}$, con $\Delta\chi = 0{,}35$, sta sotto la prima soglia e si considera covalente puro: per questo gli idrocarburi, come il metano, hanno legami apolari.

```ad-warning
Le soglie sono una regola pratica
I valori $0{,}4$ e $1{,}9$ sono una convenzione, e altri libri ne usano di diversi, per esempio $1{,}7$ per il legame ionico. La natura non ha gradini: un legame con $\Delta\chi = 1{,}8$ non è molto diverso da uno con $\Delta\chi = 2{,}0$. E ci sono eccezioni: nello ioduro di sodio, $\mathrm{NaI}$, $\Delta\chi = 1{,}73$, ma il composto è ionico; nel trifluoruro di boro, $\mathrm{BF_3}$, $\Delta\chi = 1{,}94$, ma i legami sono covalenti. Quando il valore è vicino a una soglia conta anche chi sono i due atomi: un metallo con un non metallo dà di solito un legame ionico, due non metalli un legame covalente.
```

```ad-example
Esempio 1: tre legami da classificare
Che tipo di legame c'è tra carbonio e ossigeno, tra azoto e cloro, tra magnesio e ossigeno?

Carbonio e ossigeno: $\Delta\chi = 3{,}44 - 2{,}55 = 0{,}89$. È tra $0{,}4$ e $1{,}9$: covalente polare.

Azoto e cloro: $\Delta\chi = 3{,}16 - 3{,}04 = 0{,}12$. È minore di $0{,}4$: covalente puro, anche se gli atomi sono diversi.

Magnesio e ossigeno: $\Delta\chi = 3{,}44 - 1{,}31 = 2{,}13$. È maggiore di $1{,}9$: ionico.
```

```ad-warning
Atomi diversi non vuol dire legame polare
Un legame tra atomi uguali è sempre covalente puro, ma non vale il contrario. Azoto e cloro, carbonio e idrogeno, carbonio e zolfo hanno elettronegatività quasi uguali: il legame tra loro è covalente puro. Si calcola sempre $\Delta\chi$.
```

Nella figura qui sotto scegli i due atomi: la nuvola della coppia di elettroni si sposta verso il più elettronegativo, e il segno sulla scala dice in quale fascia cade il legame.

```interattivo
% nome: legame-polare-delta-chi-nube
% alt: Due atomi da scegliere tra undici elementi, disegnati con i loro simboli e, tra loro, la nuvola della coppia di elettroni di legame. Con due atomi uguali la nuvola sta al centro. Al crescere della differenza di elettronegatività la nuvola si sposta verso l'atomo più elettronegativo e compaiono le cariche parziali delta più e delta meno; oltre 1,9 la nuvola sta tutta su un atomo e le cariche sono quelle di due ioni. Sotto, una scala da 0 a 3,3 con le due soglie e un segno sul valore del legame scelto. Si leggono le due elettronegatività, la loro differenza e il tipo di legame
```

Con idrogeno e cloro la nuvola è spostata verso il cloro; con idrogeno e fluoro lo è ancora di più; con sodio e cloro è tutta sul cloro, e i due atomi sono diventati ioni. La figura avvisa anche quando la regola non si può usare, come tra due metalli.

## Confrontare la polarità di due legami

Tra due legami covalenti è più polare quello con $\Delta\chi$ maggiore: la coppia è più spostata e le cariche parziali sono più grandi.

```ad-example
Esempio 2: gli acidi alogenidrici in ordine di polarità
Metti in ordine di polarità crescente i legami $\mathrm{H{-}F}$, $\mathrm{H{-}Cl}$, $\mathrm{H{-}Br}$. Su quale atomo sta la carica $\delta^-$?

Si calcola $\Delta\chi$ per ciascuno, con $\chi = 2{,}20$ per l'idrogeno.

$$\mathrm{H{-}F}: 3{,}98 - 2{,}20 = 1{,}78 \qquad \mathrm{H{-}Cl}: 3{,}16 - 2{,}20 = 0{,}96 \qquad \mathrm{H{-}Br}: 2{,}96 - 2{,}20 = 0{,}76$$

In ordine di polarità crescente: $\mathrm{H{-}Br}$, $\mathrm{H{-}Cl}$, $\mathrm{H{-}F}$. In tutti e tre l'alogeno è più elettronegativo dell'idrogeno: $\delta^-$ sta sull'alogeno, $\delta^+$ sull'idrogeno.
```

```ad-example
Esempio 3: le cariche parziali dell'acqua e dell'ammoniaca
Nei legami $\mathrm{O{-}H}$ dell'acqua e $\mathrm{N{-}H}$ dell'ammoniaca, dove stanno le cariche parziali? Quale dei due legami è più polare?

Ossigeno e idrogeno: $\Delta\chi = 3{,}44 - 2{,}20 = 1{,}24$. L'ossigeno è più elettronegativo: $\delta^-$ sull'ossigeno, $\delta^+$ sull'idrogeno.

Azoto e idrogeno: $\Delta\chi = 3{,}04 - 2{,}20 = 0{,}84$. $\delta^-$ sull'azoto, $\delta^+$ sull'idrogeno.

Tutti e due i legami sono covalenti polari, e $\mathrm{O{-}H}$ è il più polare, perché $1{,}24 > 0{,}84$.
```

```ad-warning
Legami polari non vuol dire molecola polare
Nel diossido di carbonio, $\mathrm{CO_2}$, i due legami tra carbonio e ossigeno sono polari ($\Delta\chi = 0{,}89$), ma la molecola è lineare e i due dipoli, uguali e opposti, si annullano: la molecola è apolare. La polarità di una molecola dipende anche dalla sua forma, ed è l'argomento della lezione [Molecole polari e apolari](/materiale/scuola-superiore/chimica/la-forma-delle-molecole-e-le-teorie-del-legame/molecole-polari-e-apolari).
```

## Il legame dativo

Nei legami covalenti visti finora ogni atomo mette un elettrone nella coppia in comune. C'è un altro modo di formare la coppia: un atomo la mette tutta, e l'altro la riceve.

Un **legame dativo**, o legame di coordinazione, è un legame covalente in cui tutti e due gli elettroni della coppia in comune vengono dallo stesso atomo. L'atomo che mette la coppia si chiama **donatore** e deve avere una coppia solitaria; quello che la riceve si chiama **accettore** e deve avere posto per due elettroni nel suo livello esterno.

L'esempio più semplice è lo ione ammonio. Nell'ammoniaca, $\mathrm{NH_3}$, l'azoto ha tre legami e una coppia solitaria. Lo ione $\mathrm{H^+}$ è un atomo di idrogeno senza il suo elettrone, cioè un protone: ha il primo livello vuoto. L'azoto mette in comune con lui la sua coppia solitaria, e si forma lo ione ammonio, $\mathrm{NH_4^+}$.

$$\mathrm{NH_3} + \mathrm{H^+} \longrightarrow \mathrm{NH_4^+}$$

Allo stesso modo l'acqua, che sull'ossigeno ha due coppie solitarie, ne usa una per legare uno ione $\mathrm{H^+}$, e si forma lo ione ossonio, $\mathrm{H_3O^+}$. È lo ione che rende acide le soluzioni, quello che nella lezione [Soluzioni acide e basiche: una prima idea del pH](/materiale/scuola-superiore/chimica/la-chimica-dell-acqua/soluzioni-acide-e-basiche-una-prima-idea-del-ph) era scritto per semplicità $\mathrm{H^+}$.

$$\mathrm{H_2O} + \mathrm{H^+} \longrightarrow \mathrm{H_3O^+}$$

```tikz
% nome: dativo-ammonio-ossonio-formazione
% alt: Due schemi con le formule di Lewis. Nel primo l'ammoniaca, con l'azoto legato a tre idrogeni e una coppia solitaria in alto disegnata in rosso, incontra uno ione idrogeno positivo: si forma lo ione ammonio, tra parentesi quadre con la carica più, in cui l'azoto è legato a quattro idrogeni e il legame nuovo, in alto, è una freccia rossa che va dall'azoto all'idrogeno. Nel secondo l'acqua, con l'ossigeno legato a due idrogeni e due coppie solitarie, una delle quali in rosso, incontra uno ione idrogeno positivo: si forma lo ione ossonio, tra parentesi quadre con la carica più, con l'ossigeno legato a tre idrogeni, il legame nuovo disegnato come una freccia rossa e una coppia solitaria rimasta
% svg: dativo-ammonio-ossonio-formazione-ab621bfe.svg 302x182
\begin{tikzpicture}
% ammoniaca
\node at (0,0) {N};
\node at (-0.8,0) {H};
\node at (0.8,0) {H};
\node at (0,-0.75) {H};
\draw[thick] (-0.58,0) -- (-0.22,0);
\draw[thick] (0.22,0) -- (0.58,0);
\draw[thick] (0,-0.22) -- (0,-0.53);
\fill[red] (-0.09,0.3) circle (1.3pt);
\fill[red] (0.09,0.3) circle (1.3pt);
\node at (1.5,0) {$+$};
\node at (2.2,0) {$\mathrm{H^+}$};
\draw[-{Stealth}] (2.8,0) -- (3.6,0);
\begin{scope}[shift={(5.2,0)}]
\node at (0,0) {N};
\node at (-0.8,0) {H};
\node at (0.8,0) {H};
\node at (0,-0.75) {H};
\node at (0,0.8) {H};
\draw[thick] (-0.58,0) -- (-0.22,0);
\draw[thick] (0.22,0) -- (0.58,0);
\draw[thick] (0,-0.22) -- (0,-0.53);
\draw[-{Stealth}, thick, red] (0,0.22) -- (0,0.6);
\draw[thick] (-1.05,1.05) -- (-1.2,1.05) -- (-1.2,-1.0) -- (-1.05,-1.0);
\draw[thick] (1.05,1.05) -- (1.2,1.05) -- (1.2,-1.0) -- (1.05,-1.0);
\node at (1.4,1.05) {\small $+$};
\end{scope}
% acqua
\begin{scope}[shift={(0,-2.9)}]
\node at (0,0) {O};
\node at (-0.8,0) {H};
\node at (0.8,0) {H};
\draw[thick] (-0.58,0) -- (-0.22,0);
\draw[thick] (0.22,0) -- (0.58,0);
\fill[red] (-0.09,0.3) circle (1.3pt);
\fill[red] (0.09,0.3) circle (1.3pt);
\fill (-0.09,-0.3) circle (1.3pt);
\fill (0.09,-0.3) circle (1.3pt);
\node at (1.5,0) {$+$};
\node at (2.2,0) {$\mathrm{H^+}$};
\draw[-{Stealth}] (2.8,0) -- (3.6,0);
\begin{scope}[shift={(5.2,0)}]
\node at (0,0) {O};
\node at (-0.8,0) {H};
\node at (0.8,0) {H};
\node at (0,0.8) {H};
\draw[thick] (-0.58,0) -- (-0.22,0);
\draw[thick] (0.22,0) -- (0.58,0);
\draw[-{Stealth}, thick, red] (0,0.22) -- (0,0.6);
\fill (-0.09,-0.3) circle (1.3pt);
\fill (0.09,-0.3) circle (1.3pt);
\draw[thick] (-1.05,1.05) -- (-1.2,1.05) -- (-1.2,-0.55) -- (-1.05,-0.55);
\draw[thick] (1.05,1.05) -- (1.2,1.05) -- (1.2,-0.55) -- (1.05,-0.55);
\node at (1.4,1.05) {\small $+$};
\end{scope}
\end{scope}
\end{tikzpicture}
```

Nelle formule il legame dativo si può disegnare con una freccia che va dal donatore all'accettore, al posto del trattino. La freccia ricorda da dove viene la coppia, e niente altro.

```ad-warning
Una volta formato, il legame dativo è un legame come gli altri
Nello ione ammonio i quattro legami $\mathrm{N{-}H}$ sono identici: stessa lunghezza, stessa energia, e nessun esperimento distingue quello dativo dagli altri tre. Anche la carica positiva non sta sull'idrogeno arrivato per ultimo: appartiene a tutto lo ione, e per questo si scrive fuori dalle parentesi.
```

```ad-example
Esempio 4: gli elettroni dello ione ammonio
Nello ione $\mathrm{NH_4^+}$ l'azoto ha l'ottetto? Quante coppie solitarie gli restano?

Gli elettroni di valenza sono $5$ dell'azoto e $1$ per ognuno dei quattro idrogeni, meno uno per la carica positiva: $5 + 4 - 1 = 8$, cioè $4$ coppie.

Le coppie di legame sono $4$, una per ogni idrogeno: non resta nessuna coppia solitaria.

L'azoto ha intorno $4 \cdot 2 = 8$ elettroni e ha l'ottetto; ogni idrogeno ne ha $2$.
```

```ad-example
Esempio 5: chi dona e chi accetta
Il trifluoruro di boro, $\mathrm{BF_3}$, reagisce con l'ammoniaca e forma un composto in cui il boro è legato all'azoto. Chi è il donatore e chi l'accettore?

Nel $\mathrm{BF_3}$ il boro ha solo tre coppie di legame, cioè $6$ elettroni: gli manca una coppia per l'ottetto, e ha posto per riceverla. È l'accettore.

L'azoto dell'ammoniaca ha una coppia solitaria: è il donatore. Il legame dativo si scrive $\mathrm{H_3N \rightarrow BF_3}$, e dopo la reazione anche il boro ha $8$ elettroni.
```

Lo ione ossonio non fa un secondo legame dativo, anche se sull'ossigeno resta una coppia solitaria: lo ione è già positivo e respinge un altro $\mathrm{H^+}$, e lo ione $\mathrm{H_4O^{2+}}$ nelle soluzioni non si forma. Avere una coppia solitaria è necessario per donare, non sufficiente.
