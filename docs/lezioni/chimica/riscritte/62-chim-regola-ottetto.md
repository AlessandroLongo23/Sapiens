# Energia di legame e regola dell'ottetto

Nell'aria che respiri non c'è un solo atomo di ossigeno isolato: ci sono molecole $\mathrm{O_2}$, due atomi uniti. Lo stesso vale per l'azoto dell'aria, per l'idrogeno, per il cloro, e nel sale da cucina sodio e cloro stanno insieme a miliardi di miliardi. In natura quasi nessun elemento si trova come atomi isolati: fanno eccezione i gas nobili. Questa lezione spiega perché quasi tutti gli atomi si legano, come si misura la forza di un legame, e che cosa hanno di speciale i gas nobili: da lì viene la regola dell'ottetto, con cui si prevede quanti elettroni un atomo cede, acquista o mette in comune.

## Legarsi conviene: l'energia scende

Un sasso lasciato libero cade, e una molla tirata torna corta: un sistema lasciato a sé stesso va verso lo stato con meno energia, e una volta lì ci resta, perché per uscirne qualcuno deve dargli energia. Più bassa è l'energia, più il sistema è stabile.

Per gli atomi vale la stessa cosa. Due atomi si legano quando, uniti, hanno meno energia di quando sono separati; l'energia in più la cedono all'ambiente, di solito come calore. Un **legame chimico** è la forza che tiene uniti due atomi, e si forma perché l'insieme legato ha meno energia degli atomi separati.

La forza è di natura elettrica, quella della lezione [La natura elettrica della materia](/materiale/scuola-superiore/chimica/le-particelle-dell-atomo/la-natura-elettrica-della-materia): i nuclei sono positivi, gli elettroni negativi, e cariche opposte si attraggono. A fare i legami sono gli elettroni del livello più esterno, gli elettroni di valenza della lezione [Elettroni di valenza e simboli di Lewis](/materiale/scuola-superiore/chimica/il-sistema-periodico/elettroni-di-valenza-e-simboli-di-lewis); quelli interni restano stretti intorno al proprio nucleo.

## La curva dell'energia tra due atomi

Il caso più semplice è la molecola di idrogeno, $\mathrm{H_2}$: due nuclei con un protone ciascuno e due elettroni. Si può seguire che cosa succede all'energia dei due atomi mentre si avvicinano, prendendo come zero l'energia di quando sono così lontani da non sentirsi.

```tikz
% nome: energia-legame-curva-idrogeno
% alt: Grafico dell'energia di due atomi di idrogeno in funzione della distanza tra i nuclei. A grande distanza la curva è sullo zero. Avvicinando gli atomi la curva scende fino a un minimo a 74 picometri, dove l'energia vale meno 436 chilojoule per mole, poi risale ripida e supera lo zero quando i nuclei sono troppo vicini. Una freccia verticale dal minimo allo zero indica l'energia di legame, una linea tratteggiata verticale la lunghezza di legame
\begin{tikzpicture}
\draw[->] (0,0) -- (6.6,0) node[below] {\small distanza};
\draw[->] (0,-2.7) -- (0,2.2) node[above] {\small energia (kJ/mol)};
\node[left] at (0,0) {\small $0$};
\draw[thick, blue, domain=0.66:6.3, samples=80, smooth] plot (\x, {2.18*((1-exp(-0.97*(\x-1.48)))^2-1)});
\draw[thin, dashed] (1.48,0) -- (1.48,-2.18);
\draw[thin, dashed] (0,-2.18) -- (1.48,-2.18);
\fill[red] (1.48,-2.18) circle (2pt);
\node[above] at (1.48,0) {\small $74$ pm};
\node[left] at (0,-2.18) {\small $-436$};
\draw[{Stealth}-{Stealth}, thick, orange!90!black] (2.6,-2.18) -- (2.6,0);
\draw[thin, dashed] (1.48,-2.18) -- (2.6,-2.18);
\node[right] at (2.65,-1.65) {\small energia di legame};
\node[right] at (2.65,-2.05) {\small $436$ kJ/mol};
\node[right] at (0.85,1.6) {\small nuclei troppo vicini};
\node at (4.6,0.35) {\small atomi lontani};
\end{tikzpicture}
```

La curva si legge da destra verso sinistra, cioè avvicinando gli atomi.

1. Atomi lontani: non si sentono, e l'energia è zero.
2. Atomi che si avvicinano: il nucleo di ciascuno attrae anche l'elettrone dell'altro. Le attrazioni vincono sulle repulsioni, e l'energia scende.
3. Il minimo: a $74\,\text{pm}$ l'energia è la più bassa possibile, $-436\,\text{kJ/mol}$. I due elettroni stanno soprattutto nella zona tra i due nuclei, attratti da entrambi. Qui gli atomi sono legati.
4. Atomi troppo vicini: i due nuclei, tutti e due positivi, si respingono con una forza che cresce in fretta, e l'energia risale ripida.

Nella figura qui sotto la distanza la scegli tu: muovi il cursore e leggi l'energia, oppure lascia liberi gli atomi e guarda dove si fermano.

```interattivo
% nome: energia-legame-curva-distanza
% alt: Due atomi di idrogeno disegnati come due nuvole con il nucleo al centro, a una distanza che si sceglie con un cursore, tra 30 e 300 picometri. Sotto, la curva dell'energia in funzione della distanza, con un punto che si sposta sulla curva. Si leggono la distanza, l'energia in chilojoule per mole e se in quel punto gli atomi si attraggono, si respingono o sono in equilibrio. Un bottone lascia liberi gli atomi, che vanno a fermarsi a 74 picometri, nel minimo della curva
```

Da qualunque distanza li lasci, gli atomi finiscono nel minimo: se sono più lontani di $74\,\text{pm}$ si attraggono, se sono più vicini si respingono. Il legame non è un bastoncino rigido: è una distanza di equilibrio, attorno alla quale i due nuclei oscillano come se tra loro ci fosse una molla.

## Lunghezza di legame ed energia di legame

Il minimo della curva dà le due grandezze che descrivono un legame.

La **lunghezza di legame** è la distanza tra i nuclei dei due atomi legati, quella del minimo. Si misura in picometri ($1\,\text{pm} = 10^{-12}\,\text{m}$).

L'**energia di legame** è l'energia che bisogna fornire per rompere una mole di legami, portando gli atomi lontani l'uno dall'altro, con la sostanza allo stato gassoso. Si misura in $\text{kJ/mol}$, ed è la profondità della buca: per risalire da $-436\,\text{kJ/mol}$ a zero servono $436\,\text{kJ/mol}$. Più grande è l'energia di legame, più il legame è forte e la molecola stabile.

| Legame | Lunghezza (pm) | Energia (kJ/mol) |
|---|---|---|
| $\mathrm{H{-}H}$ | $74$ | $436$ |
| $\mathrm{F{-}F}$ | $141$ | $159$ |
| $\mathrm{Cl{-}Cl}$ | $199$ | $243$ |
| $\mathrm{Br{-}Br}$ | $228$ | $193$ |
| $\mathrm{I{-}I}$ | $267$ | $151$ |
| $\mathrm{H{-}F}$ | $92$ | $567$ |
| $\mathrm{H{-}Cl}$ | $127$ | $431$ |
| $\mathrm{H{-}Br}$ | $141$ | $366$ |
| $\mathrm{H{-}I}$ | $161$ | $298$ |

La lunghezza cresce con le dimensioni degli atomi: da $\mathrm{H{-}F}$ a $\mathrm{H{-}I}$ l'alogeno è sempre più grande, il legame si allunga da $92$ a $161\,\text{pm}$ e l'energia scende da $567$ a $298\,\text{kJ/mol}$. Di solito un legame più lungo è anche più debole, ma non è una legge: $\mathrm{F{-}F}$ è più corto di $\mathrm{Cl{-}Cl}$ e tuttavia più debole.

```ad-example
Esempio 1: quale legame è più forte
Tra $\mathrm{H{-}Cl}$, $\mathrm{Cl{-}Cl}$ e $\mathrm{H{-}H}$, quale legame richiede più energia per essere rotto? E quale meno?

Si confrontano le energie di legame della tabella: $431$, $243$ e $436\,\text{kJ/mol}$.

Il più forte è $\mathrm{H{-}H}$, con $436\,\text{kJ/mol}$; il più debole è $\mathrm{Cl{-}Cl}$, con $243\,\text{kJ/mol}$.
```

```ad-example
Esempio 2: l'energia per rompere i legami di un campione
Quanta energia serve per separare in atomi tutte le molecole di $4{,}04\,\text{g}$ di idrogeno gassoso, $\mathrm{H_2}$?

La massa molare di $\mathrm{H_2}$ è $2 \cdot 1{,}01 = 2{,}02\,\text{g/mol}$, quindi

$$n = \frac{4{,}04\,\text{g}}{2{,}02\,\text{g/mol}} = 2{,}00\,\text{mol}$$

Ogni molecola ha un legame $\mathrm{H{-}H}$: le moli di legami sono $2{,}00$.

$$E = 2{,}00\,\text{mol} \cdot 436\,\text{kJ/mol} = 872\,\text{kJ}$$
```

```ad-example
Esempio 3: l'energia di un solo legame
L'energia di legame di $\mathrm{H{-}H}$ è $436\,\text{kJ/mol}$. Quanta energia serve per rompere il legame di una sola molecola?

Una mole contiene $6{,}022 \cdot 10^{23}$ molecole, come dice la lezione [La mole e la massa molare](/materiale/scuola-superiore/chimica/la-quantita-di-sostanza-la-mole/la-mole-e-la-massa-molare). Con l'energia in joule, $436\,\text{kJ} = 4{,}36 \cdot 10^{5}\,\text{J}$:

$$E = \frac{4{,}36 \cdot 10^{5}\,\text{J/mol}}{6{,}022 \cdot 10^{23}\,\text{mol}^{-1}} = 7{,}24 \cdot 10^{-19}\,\text{J}$$

Per un solo legame l'energia è piccolissima: per questo le tabelle la danno per una mole di legami.
```

## Rompere costa, formare libera

La curva dice anche un'altra cosa. Per andare dal minimo allo zero bisogna salire: rompere un legame assorbe sempre energia. Per andare dallo zero al minimo si scende: quando un legame si forma, la stessa quantità di energia viene ceduta all'ambiente.

```ad-warning
Rompere un legame non libera energia
È uno degli errori più comuni, anche perché si sente dire che "l'energia è contenuta nei legami". Per rompere un legame l'energia va sempre fornita. In una reazione che scalda, l'energia viene dai legami nuovi che si formano, più forti di quelli che si sono rotti.
```

In una reazione chimica alcuni legami si rompono e altri si formano. Con le energie di legame si può stimare se, nel complesso, la reazione cede energia o ne assorbe.

```ad-example
Esempio 4: idrogeno e cloro
Una mole di $\mathrm{H_2}$ reagisce con una mole di $\mathrm{Cl_2}$ e forma due moli di cloruro di idrogeno, $\mathrm{HCl}$. La reazione cede energia o la assorbe? Quanta?

Si rompono una mole di legami $\mathrm{H{-}H}$ e una mole di legami $\mathrm{Cl{-}Cl}$:

$$E_{\text{assorbita}} = 436\,\text{kJ} + 243\,\text{kJ} = 679\,\text{kJ}$$

Si formano due moli di legami $\mathrm{H{-}Cl}$:

$$E_{\text{ceduta}} = 2 \cdot 431\,\text{kJ} = 862\,\text{kJ}$$

L'energia ceduta supera quella assorbita di $862\,\text{kJ} - 679\,\text{kJ} = 183\,\text{kJ}$: la reazione cede $183\,\text{kJ}$ all'ambiente, e infatti la miscela si scalda molto.
```

## I gas nobili, gli atomi che non si legano

Elio, neon, argon, kripton e xeno sono gas fatti di atomi singoli. Non formano molecole tra loro e, con poche eccezioni ottenute in laboratorio per i più pesanti, non reagiscono con gli altri elementi: per questo si chiamano gas nobili, o gas inerti. Un atomo che non si lega è un atomo che, legandosi, non scenderebbe di energia. È già stabile così.

Il motivo sta nella [configurazione elettronica](/materiale/scuola-superiore/chimica/la-struttura-elettronica-dell-atomo/la-configurazione-elettronica).

| Gas nobile | Configurazione | Elettroni nel livello più esterno |
|---|---|---|
| $\mathrm{He}$ | $1s^2$ | $2$ |
| $\mathrm{Ne}$ | $[\mathrm{He}]\,2s^2\,2p^6$ | $8$ |
| $\mathrm{Ar}$ | $[\mathrm{Ne}]\,3s^2\,3p^6$ | $8$ |
| $\mathrm{Kr}$ | $[\mathrm{Ar}]\,4s^2\,3d^{10}\,4p^6$ | $8$ |
| $\mathrm{Xe}$ | $[\mathrm{Kr}]\,5s^2\,4d^{10}\,5p^6$ | $8$ |

Tutti, tranne l'elio, hanno otto elettroni nel livello più esterno, con i sottolivelli $s$ e $p$ completi: questo gruppo di otto elettroni si chiama **ottetto**. L'elio ne ha due, ma il suo primo livello non ne può contenere di più, quindi è completo anche lui.

Un livello esterno completo è difficile da modificare in tutti e due i sensi. Togliere un elettrone costa moltissimo: i gas nobili hanno l'[energia di ionizzazione](/materiale/scuola-superiore/chimica/il-sistema-periodico/raggio-atomico-ed-energia-di-ionizzazione) più alta del loro periodo, $2081\,\text{kJ/mol}$ per il neon contro $496\,\text{kJ/mol}$ per il sodio che lo segue. Aggiungerne uno non conviene, perché finirebbe in un livello nuovo, più lontano dal nucleo.

## La regola dell'ottetto

Gli altri elementi non hanno il livello esterno completo, e legandosi lo completano. È l'idea proposta nel 1916 da Gilbert Lewis e da Walther Kossel.

La **regola dell'ottetto** dice che un atomo tende a cedere, acquistare o mettere in comune elettroni fino ad avere otto elettroni nel livello più esterno, come il gas nobile più vicino nella tavola periodica.

Le strade sono tre, e ognuna porta a un tipo di legame.

```tikz
% nome: ottetto-tre-strade
% alt: Tre schemi con i simboli di Lewis. Nel primo un atomo di sodio, con un puntino, diventa lo ione sodio positivo, senza puntini: ha ceduto un elettrone. Nel secondo un atomo di cloro, con sette puntini, diventa lo ione cloruro negativo, con otto puntini: ha acquistato un elettrone. Nel terzo due atomi di cloro, con sette puntini ciascuno, diventano una molecola di cloro in cui i due atomi hanno in mezzo una coppia di puntini in comune, disegnata in rosso, e sei puntini ciascuno tutto intorno
\begin{tikzpicture}
% sodio cede
\node at (0,0) {Na};
\fill (0.38,0) circle (1.3pt);
\draw[-{Stealth}] (0.9,0) -- (1.7,0);
\node at (2.35,0) {$\mathrm{Na^+}$};
\node[right] at (3.3,0) {\small cede $1$ elettrone};
% cloro acquista
\begin{scope}[shift={(0,-1.4)}]
\node at (0,0) {Cl};
\foreach \p in {(-0.09,0.3),(0.09,0.3),(-0.09,-0.3),(0.09,-0.3),(-0.36,0.09),(-0.36,-0.09),(0.36,0)} \fill \p circle (1.3pt);
\draw[-{Stealth}] (0.9,0) -- (1.7,0);
\node at (2.3,0) {Cl};
\foreach \p in {(2.21,0.3),(2.39,0.3),(2.21,-0.3),(2.39,-0.3),(1.94,0.09),(1.94,-0.09)} \fill \p circle (1.3pt);
\fill[red] (2.66,0.09) circle (1.3pt);
\fill (2.66,-0.09) circle (1.3pt);
\node at (2.85,0.3) {\small $-$};
\node[right] at (3.3,0) {\small acquista $1$ elettrone};
\end{scope}
% due atomi di cloro mettono in comune
\begin{scope}[shift={(0,-2.8)}]
\node at (-0.9,0) {Cl};
\foreach \p in {(-0.99,0.3),(-0.81,0.3),(-0.99,-0.3),(-0.81,-0.3),(-1.26,0.09),(-1.26,-0.09),(-0.54,0)} \fill \p circle (1.3pt);
\node at (0,0) {Cl};
\foreach \p in {(-0.09,0.3),(0.09,0.3),(-0.09,-0.3),(0.09,-0.3),(0.36,0.09),(0.36,-0.09),(-0.36,0)} \fill \p circle (1.3pt);
\draw[-{Stealth}] (0.9,0) -- (1.7,0);
\node at (2.3,0) {Cl};
\foreach \p in {(2.21,0.3),(2.39,0.3),(2.21,-0.3),(2.39,-0.3),(1.94,0.09),(1.94,-0.09)} \fill \p circle (1.3pt);
\fill[red] (2.7,0.09) circle (1.3pt);
\fill[red] (2.7,-0.09) circle (1.3pt);
\node at (3.1,0) {Cl};
\foreach \p in {(3.01,0.3),(3.19,0.3),(3.01,-0.3),(3.19,-0.3),(3.46,0.09),(3.46,-0.09)} \fill \p circle (1.3pt);
\node[right] at (3.8,0) {\small in comune $2$ elettroni};
\end{scope}
\end{tikzpicture}
```

- Cedere elettroni. Il sodio, $[\mathrm{Ne}]\,3s^1$, ha un solo elettrone nel terzo livello. Se lo cede diventa lo ione $\mathrm{Na^+}$, e il suo livello più esterno è il secondo, completo, come nel neon. Lo fanno i metalli, che hanno pochi elettroni di valenza.
- Acquistare elettroni. Il cloro, $[\mathrm{Ne}]\,3s^2\,3p^5$, ha sette elettroni di valenza. Con uno in più diventa lo ione $\mathrm{Cl^-}$, con la configurazione dell'argon. Lo fanno i non metalli, a cui mancano pochi elettroni. Uno ione positivo e uno negativo si attraggono: è il [legame ionico](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-ionico).
- Mettere in comune elettroni. Due atomi di cloro non possono strapparsi un elettrone a vicenda. Ne mettono in comune uno ciascuno, e la coppia condivisa conta per tutti e due: ognuno ha intorno otto elettroni. È il [legame covalente](/materiale/scuola-superiore/chimica/i-legami-chimici/il-legame-covalente).

Quale strada prende un atomo dipende da quanti elettroni di valenza ha: tra cederne uno e acquistarne sette, il sodio cede, perché costa molta meno energia. Gli ioni che ne risultano per ogni gruppo sono nella lezione [Elettroni di valenza e simboli di Lewis](/materiale/scuola-superiore/chimica/il-sistema-periodico/elettroni-di-valenza-e-simboli-di-lewis).

```ad-example
Esempio 5: magnesio e zolfo
Come raggiungono l'ottetto il magnesio (gruppo 2) e lo zolfo (gruppo 16)? A quale gas nobile somigliano dopo?

Il magnesio è $[\mathrm{Ne}]\,3s^2$: ha $2$ elettroni di valenza. Li cede tutti e due e diventa $\mathrm{Mg^{2+}}$, con la configurazione del neon, il gas nobile che lo precede.

Lo zolfo è $[\mathrm{Ne}]\,3s^2\,3p^4$: ha $6$ elettroni di valenza, e gliene mancano $8 - 6 = 2$. Ne acquista due e diventa $\mathrm{S^{2-}}$, con la configurazione dell'argon, il gas nobile che lo segue.
```

Nella figura qui sotto scegli un elemento e togli o aggiungi elettroni uno alla volta: i cerchi sono i livelli di energia, disegnati come uno schema e non come orbite, e la figura dice quando il livello più esterno è completo.

```interattivo
% nome: ottetto-elettroni-gas-nobile
% alt: Lo schema dei livelli di un atomo a scelta tra dodici elementi dei primi quattro periodi: il simbolo al centro e, attorno, un cerchio per ogni livello occupato, con gli elettroni disegnati come puntini. Due bottoni tolgono o aggiungono un elettrone. Sotto si leggono il simbolo dell'atomo o dello ione con la sua carica, gli elettroni livello per livello e se il livello più esterno è completo, con il nome del gas nobile che ha la stessa configurazione
```

Il sodio arriva all'ottetto con un elettrone in meno, il cloro con uno in più. Con il carbonio, che ha quattro elettroni di valenza, le due strade sono lunghe uguali, quattro elettroni da cedere o quattro da acquistare: il carbonio non fa né l'una né l'altra cosa, e mette in comune.

```ad-warning
Otto elettroni nel livello più esterno, non in tutto
Lo ione $\mathrm{Na^+}$ ha $10$ elettroni, lo ione $\mathrm{Cl^-}$ ne ha $18$: l'ottetto riguarda solo il livello più esterno. E uno ione con l'ottetto non è diventato un gas nobile: $\mathrm{Na^+}$ ha la configurazione del neon, ma ha ancora $11$ protoni ed è sodio.
```

```ad-example
Esempio 6: l'idrogeno
L'idrogeno ha un solo elettrone, $1s^1$. Quanti elettroni gli servono per essere stabile?

Il gas nobile più vicino è l'elio, $1s^2$, che ha il primo livello completo con $2$ elettroni. All'idrogeno ne manca uno: lo ottiene mettendo in comune il suo elettrone con quello di un altro atomo, come in $\mathrm{H_2}$. Per l'idrogeno la regola è quella del duetto, non dell'ottetto.
```

## I limiti della regola

La regola dell'ottetto è una regola pratica, non una legge: riassume il comportamento di molti elementi, soprattutto quelli dei gruppi principali del secondo e del terzo periodo, e ha eccezioni note.

- Idrogeno, litio e berillio hanno come gas nobile vicino l'elio: arrivano a due elettroni, non a otto.
- Alcuni atomi restano con meno di otto elettroni: nel trifluoruro di boro, $\mathrm{BF_3}$, il boro ne ha intorno sei.
- Gli atomi dal terzo periodo in poi possono averne più di otto: nel pentacloruro di fosforo, $\mathrm{PCl_5}$, il fosforo ne ha dieci, e nell'esafluoruro di zolfo, $\mathrm{SF_6}$, lo zolfo ne ha dodici.
- Le molecole con un numero dispari di elettroni, come il monossido di azoto $\mathrm{NO}$, non possono dare l'ottetto a tutti gli atomi.
- I metalli di transizione seguono altre regole: il ferro forma sia $\mathrm{Fe^{2+}}$ sia $\mathrm{Fe^{3+}}$, e nessuno dei due ha la configurazione di un gas nobile.

Queste eccezioni tornano nella lezione [Le formule di Lewis delle molecole](/materiale/scuola-superiore/chimica/i-legami-chimici/le-formule-di-lewis-delle-molecole). La ragione vera per cui gli atomi si legano resta quella dell'inizio: legati hanno meno energia. L'ottetto è il modo più rapido per prevedere quando succede.
