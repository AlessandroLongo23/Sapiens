# I sali ternari

Il marmo e il calcare sono carbonato di calcio, $\mathrm{CaCO_3}$. Il gesso è solfato di calcio, la candeggina una soluzione di ipoclorito di sodio, $\mathrm{NaClO}$, e molti fertilizzanti contengono nitrato di potassio, $\mathrm{KNO_3}$. Sono sali ternari: un metallo, un non metallo e ossigeno. Derivano dagli ossiacidi, e il loro nome si costruisce su quello dell'acido.

## Che cosa sono

Un **sale ternario** è un composto formato da tre elementi: un metallo, un non metallo e ossigeno. Si può pensare come un ossiacido in cui il metallo ha preso il posto dell'idrogeno: dall'acido nitrico, $\mathrm{HNO_3}$, il nitrato di potassio, $\mathrm{KNO_3}$; dall'acido solforico, $\mathrm{H_2SO_4}$, il solfato di sodio, $\mathrm{Na_2SO_4}$. Gli ossiacidi e i loro nomi sono nella lezione [Gli ossiacidi](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/gli-ossiacidi).

Come i [sali binari](/materiale/scuola-superiore/chimica/classificazione-e-nomenclatura-dei-composti/i-sali-binari), sono composti ionici. Il catione è quello del metallo; l'anione è un gruppo di atomi, il non metallo e l'ossigeno, legati tra loro da legami covalenti e con una carica negativa che appartiene al gruppo intero: uno **ione poliatomico**.

## Gli anioni degli ossiacidi

L'anione di un sale ternario è quello che resta dell'ossiacido quando perde tutti i suoi atomi di idrogeno sotto forma di ioni $\mathrm{H^+}$. Ogni $\mathrm{H^+}$ che se ne va lascia una carica negativa: la carica dell'anione è il numero di atomi di idrogeno dell'acido, con il segno meno.

$$\mathrm{HNO_3} \longrightarrow \mathrm{H^+} + \mathrm{NO_3^-} \qquad \mathrm{H_2SO_4} \longrightarrow 2\,\mathrm{H^+} + \mathrm{SO_4^{2-}} \qquad \mathrm{H_3PO_4} \longrightarrow 3\,\mathrm{H^+} + \mathrm{PO_4^{3-}}$$

Il nome tradizionale dell'anione viene da quello dell'acido cambiando il suffisso: *-ico* diventa *-ato*, *-oso* diventa *-ito*. I prefissi *ipo-* e *per-* restano dove sono.

```tikz
% nome: sali-ternari-suffissi-acido-anione
% alt: Schema con quattro righe, ognuna con il suffisso dell'acido a sinistra, una freccia e il suffisso dell'anione a destra, con l'esempio del cloro. Ipo-oso diventa ipo-ito: acido ipocloroso, ione ipoclorito. Oso diventa ito: acido cloroso, ione clorito. Ico diventa ato: acido clorico, ione clorato. Per-ico diventa per-ato: acido perclorico, ione perclorato
\begin{tikzpicture}
\node at (1.5,3.75) {\small acido};
\node at (7.6,3.75) {\small anione};
\foreach \y/\a/\b/\ea/\eb in {3/ipo-oso/ipo-ito/acido ipocloroso/ione ipoclorito, 2.1/-oso/-ito/acido cloroso/ione clorito, 1.2/-ico/-ato/acido clorico/ione clorato, 0.3/per-ico/per-ato/acido perclorico/ione perclorato}
{
\draw[thick, rounded corners=2pt, fill=orange!25] (0,\y-0.34) rectangle (3,\y+0.34);
\node at (1.5,\y) {\small \ea};
\draw[-{Stealth}, thick] (3.15,\y-0.12) -- (5.95,\y-0.12);
\node at (4.55,\y+0.12) {\footnotesize \a\ $\to$ \b};
\draw[thick, rounded corners=2pt, fill=blue!10] (6.1,\y-0.34) rectangle (9.1,\y+0.34);
\node at (7.6,\y) {\small \eb};
}
\end{tikzpicture}
```

Il nome IUPAC dell'anione si costruisce come quello dell'acido, con il prefisso dell'ossigeno e il numero romano, ma con il suffisso *-ato* al posto di *-ico*, sempre: dall'acido tetraossosolforico(VI) lo ione tetraossosolfato(VI).

| Acido | Nome dell'acido | Anione | Nome tradizionale | Nome IUPAC |
|---|---|---|---|---|
| $\mathrm{H_2CO_3}$ | acido carbonico | $\mathrm{CO_3^{2-}}$ | ione carbonato | ione triossocarbonato(IV) |
| $\mathrm{HNO_2}$ | acido nitroso | $\mathrm{NO_2^-}$ | ione nitrito | ione diossonitrato(III) |
| $\mathrm{HNO_3}$ | acido nitrico | $\mathrm{NO_3^-}$ | ione nitrato | ione triossonitrato(V) |
| $\mathrm{H_2SO_3}$ | acido solforoso | $\mathrm{SO_3^{2-}}$ | ione solfito | ione triossosolfato(IV) |
| $\mathrm{H_2SO_4}$ | acido solforico | $\mathrm{SO_4^{2-}}$ | ione solfato | ione tetraossosolfato(VI) |
| $\mathrm{H_3PO_4}$ | acido fosforico | $\mathrm{PO_4^{3-}}$ | ione fosfato | ione tetraossofosfato(V) |
| $\mathrm{HClO}$ | acido ipocloroso | $\mathrm{ClO^-}$ | ione ipoclorito | ione monossoclorato(I) |
| $\mathrm{HClO_2}$ | acido cloroso | $\mathrm{ClO_2^-}$ | ione clorito | ione diossoclorato(III) |
| $\mathrm{HClO_3}$ | acido clorico | $\mathrm{ClO_3^-}$ | ione clorato | ione triossoclorato(V) |
| $\mathrm{HClO_4}$ | acido perclorico | $\mathrm{ClO_4^-}$ | ione perclorato | ione tetraossoclorato(VII) |
| $\mathrm{H_2CrO_4}$ | acido cromico | $\mathrm{CrO_4^{2-}}$ | ione cromato | ione tetraossocromato(VI) |
| $\mathrm{HMnO_4}$ | acido permanganico | $\mathrm{MnO_4^-}$ | ione permanganato | ione tetraossomanganato(VII) |

Due radici si accorciano passando dall'acido all'anione: da solforico viene solfato, non solforato, e da fosforico viene fosfato, non fosforato.

```ad-warning
-ito e -ato scambiati
L'errore più frequente è accoppiare i suffissi a caso. La coppia è fissa: *-oso* con *-ito*, *-ico* con *-ato*. Il solfito viene dall'acido solforoso e ha lo zolfo a $+4$; il solfato viene dall'acido solforico e ha lo zolfo a $+6$. Tra due anioni dello stesso non metallo, quello in *-ato* ha più ossigeno.
```

```ad-warning
-uro non è -ato
Il solfuro, $\mathrm{S^{2-}}$, viene dall'acido solfidrico e non contiene ossigeno; il solfato, $\mathrm{SO_4^{2-}}$, viene dall'acido solforico e ne contiene quattro atomi. $\mathrm{Na_2S}$ è un sale binario, $\mathrm{Na_2SO_4}$ un sale ternario.
```

Dentro un anione poliatomico il numero di ossidazione del non metallo è quello che aveva nell'acido, e si calcola allo stesso modo, ricordando che la somma dà la carica dello ione e non zero. Nel solfato: $x + 4 \cdot (-2) = -2$, da cui $x = +6$.

## Dagli ioni alla formula

La formula si scrive con l'incrocio delle cariche, come per i sali binari, con una regola in più: se lo ione poliatomico compare più di una volta va chiuso tra parentesi, e l'indice si scrive fuori.

1. Scrivi il catione e l'anione con la loro carica.
2. Usa il numero della carica del catione come indice dell'anione e il numero della carica dell'anione come indice del catione.
3. Se i due indici hanno un divisore comune, semplifica.
4. Metti l'anione tra parentesi se il suo indice è diverso da $1$. Gli indici dentro l'anione non si toccano.

```ad-example
Esempio 1: quattro formule dagli ioni
Solfato di sodio, ioni $\mathrm{Na^+}$ e $\mathrm{SO_4^{2-}}$: due ioni sodio per un solfato, $\mathrm{Na_2SO_4}$. Il solfato compare una volta sola e non vuole parentesi.

Nitrato di calcio, ioni $\mathrm{Ca^{2+}}$ e $\mathrm{NO_3^-}$: un calcio e due nitrati, $\mathrm{Ca(NO_3)_2}$.

Solfato di alluminio, ioni $\mathrm{Al^{3+}}$ e $\mathrm{SO_4^{2-}}$: due ioni alluminio e tre solfati, $\mathrm{Al_2(SO_4)_3}$. Controllo: $2 \cdot (+3) + 3 \cdot (-2) = 0$.

Carbonato di calcio, ioni $\mathrm{Ca^{2+}}$ e $\mathrm{CO_3^{2-}}$: l'incrocio dà due e due, che si semplificano a uno e uno, $\mathrm{CaCO_3}$.
```

```ad-warning
Parentesi dimenticate e indici semplificati dentro lo ione
$\mathrm{CaNO_6}$ e $\mathrm{CaN_2O_6}$ non sono il nitrato di calcio: lo ione nitrato resta intero, e si scrive $\mathrm{Ca(NO_3)_2}$, con la parentesi che dice che il $2$ vale per tutto lo ione. E quando si semplifica, si semplificano solo gli indici dei due ioni: in $\mathrm{CaCO_3}$ il $3$ appartiene al carbonato e non si tocca. Per il solfato stannico l'incrocio dà $\mathrm{Sn_2(SO_4)_4}$, che diventa $\mathrm{Sn(SO_4)_2}$: il $4$ dentro la parentesi è rimasto dov'era.
```

## I tre nomi

Il nome di un sale ternario è il nome dell'anione seguito da quello del metallo, e le tre nomenclature seguono le regole dei sali binari.

- Nome tradizionale: il nome tradizionale dell'anione, poi *di* e il nome del metallo (solfato di sodio), oppure l'aggettivo in *-oso* o in *-ico* se il metallo ha due numeri di ossidazione (solfato ferroso, solfato ferrico).
- Notazione di Stock: il nome tradizionale dell'anione, *di*, il nome del metallo e, solo se ne ha più di uno, il suo numero di ossidazione in numeri romani: solfato di ferro(II), solfato di ferro(III).
- Nome IUPAC: il nome IUPAC dell'anione, *di*, il nome del metallo con il prefisso che ne conta gli atomi: tetraossosolfato(VI) di disodio. Se l'anione compare due o tre volte, il suo nome va tra parentesi quadre preceduto da *bis* o *tris*: bis[triossonitrato(V)] di calcio, tris[tetraossosolfato(VI)] di diferro. Si usano *bis* e *tris* al posto di *di-* e *tri-* perché il nome dell'anione contiene già un prefisso numerico.

| Formula | Tradizionale | Stock | IUPAC |
|---|---|---|---|
| $\mathrm{KNO_3}$ | nitrato di potassio | nitrato di potassio | triossonitrato(V) di potassio |
| $\mathrm{Na_2SO_4}$ | solfato di sodio | solfato di sodio | tetraossosolfato(VI) di disodio |
| $\mathrm{CaCO_3}$ | carbonato di calcio | carbonato di calcio | triossocarbonato(IV) di calcio |
| $\mathrm{NaClO}$ | ipoclorito di sodio | ipoclorito di sodio | monossoclorato(I) di sodio |
| $\mathrm{Ca(NO_3)_2}$ | nitrato di calcio | nitrato di calcio | bis[triossonitrato(V)] di calcio |
| $\mathrm{Ca_3(PO_4)_2}$ | fosfato di calcio | fosfato di calcio | bis[tetraossofosfato(V)] di tricalcio |
| $\mathrm{FeSO_4}$ | solfato ferroso | solfato di ferro(II) | tetraossosolfato(VI) di ferro |
| $\mathrm{Fe_2(SO_4)_3}$ | solfato ferrico | solfato di ferro(III) | tris[tetraossosolfato(VI)] di diferro |
| $\mathrm{CuSO_4}$ | solfato rameico | solfato di rame(II) | tetraossosolfato(VI) di rame |
| $\mathrm{Pb(NO_3)_2}$ | nitrato piomboso | nitrato di piombo(II) | bis[triossonitrato(V)] di piombo |

In un nome come tris[tetraossosolfato(VI)] di diferro ci sono tre numeri, e ognuno dice una cosa diversa: *tris* conta gli anioni, *tetraosso* gli atomi di ossigeno dentro ogni anione, (VI) è il numero di ossidazione dello zolfo. Il numero di ossidazione del metallo nel nome IUPAC non compare: lo si ricava dai prefissi.

Lo ione ammonio, $\mathrm{NH_4^+}$, forma sali ternari come un metallo con carica $1+$: $\mathrm{NH_4NO_3}$ è il nitrato di ammonio, $\mathrm{(NH_4)_2SO_4}$ il solfato di ammonio, con il catione tra parentesi perché è poliatomico e compare due volte.

## Dalla formula al nome

1. Separa il metallo dall'anione e riconosci l'anione: il gruppo con il non metallo e l'ossigeno, tra parentesi se compare più volte.
2. Ricorda la carica dell'anione, quella che ha nella tabella, e moltiplicala per il suo indice: è la carica negativa totale.
3. Dividi per l'indice del metallo: è il numero di ossidazione del metallo.
4. Scrivi i nomi.

```ad-example
Esempio 2: Fe₂(SO₄)₃
L'anione è il solfato, $\mathrm{SO_4^{2-}}$, e compare $3$ volte: la carica negativa totale è $3 \cdot (-2) = -6$. Gli atomi di ferro sono $2$, e ognuno vale $(+6) : 2 = +3$: ione ferrico.

Nome tradizionale: solfato ferrico. Notazione di Stock: solfato di ferro(III). Nome IUPAC: tris[tetraossosolfato(VI)] di diferro.
```

```ad-example
Esempio 3: Cu(NO₂)₂
L'anione è $\mathrm{NO_2^-}$, con due atomi di ossigeno: è il nitrito, che viene dall'acido nitroso, e non il nitrato. Compare $2$ volte, carica totale $-2$; il rame è uno solo e vale $+2$: ione rameico.

Nome tradizionale: nitrito rameico. Notazione di Stock: nitrito di rame(II). Nome IUPAC: bis[diossonitrato(III)] di rame.
```

```ad-warning
La carica si legge dall'anione, non dagli indici
In $\mathrm{FeSO_4}$ non ci sono indici fuori dall'anione, e chi rifà l'incrocio al contrario conclude che il ferro vale $+1$. Il solfato ha carica $2-$, quindi il ferro vale $+2$: è il solfato ferroso. Gli indici sono stati semplificati, la carica dell'anione no.
```

## Dal nome alla formula

Dal nome tradizionale e da quello di Stock si ricavano i due ioni: dal suffisso dell'anione l'acido da cui viene, e quindi formula e carica; dal nome del metallo, con il suo suffisso o il suo numero romano, la carica del catione. Poi l'incrocio.

```ad-example
Esempio 4: solfito ferroso
*-ito* rimanda all'acido in *-oso*: l'acido solforoso, $\mathrm{H_2SO_3}$. Tolti i due idrogeni resta lo ione solfito, $\mathrm{SO_3^{2-}}$. *Ferroso* è lo ione $\mathrm{Fe^{2+}}$. Le cariche sono uguali, e serve uno ione di ciascuno: $\mathrm{FeSO_3}$.
```

```ad-example
Esempio 5: perclorato di rame(II)
*Per-* e *-ato* rimandano all'acido perclorico, $\mathrm{HClO_4}$: l'anione è $\mathrm{ClO_4^-}$. Il rame(II) è $\mathrm{Cu^{2+}}$. Servono due perclorati per un rame, tra parentesi: $\mathrm{Cu(ClO_4)_2}$.
```

Dal nome IUPAC la formula si scrive leggendo i prefissi, e l'unico conto è la carica dell'anione, che serve per controllare.

```ad-example
Esempio 6: bis[tetraossofosfato(V)] di tricalcio
L'anione ha $4$ atomi di ossigeno e un atomo di fosforo: $\mathrm{PO_4}$. *Bis* dice che compare due volte, *tri-* che gli atomi di calcio sono tre: $\mathrm{Ca_3(PO_4)_2}$.

Controllo: nel fosfato il fosforo ha $+5$ e i quattro ossigeni valgono $-8$, quindi la carica dell'anione è $3-$. Due anioni fanno $-6$, tre ioni $\mathrm{Ca^{2+}}$ fanno $+6$.
```

Nella figura qui sotto scegli un ossiacido, quanti dei suoi atomi di idrogeno vengono sostituiti e il metallo che li sostituisce: l'acido perde gli idrogeni, resta l'anione con la sua carica, e con il catione si forma il sale.

```interattivo
% nome: sali-ternari-acido-metallo
% alt: Si sceglie un ossiacido (carbonico, nitroso, nitrico, solforoso, solforico, fosforico, ipocloroso, perclorico), quanti atomi di idrogeno togliere (da uno a tutti) e un catione (sodio, potassio, calcio, alluminio, ferro(II), ferro(III), rame(II), ammonio). La figura mostra tre riquadri collegati da frecce: l'acido con il suo nome, l'anione che resta con la sua carica e il suo nome, e il sale con la formula. Sotto la formula si leggono quanti cationi e quanti anioni servono perché le cariche si compensino e i nomi tradizionale, di Stock e IUPAC del sale; se all'anione resta qualche atomo di idrogeno la figura dice che il sale è un sale acido
```

Togliendo tutti gli idrogeni la carica dell'anione è uguale al numero di idrogeni dell'acido, e il nome finisce in *-ato* o in *-ito*. Togliendone solo una parte, cosa possibile solo per gli acidi che ne hanno almeno due, la carica è più piccola e davanti al nome compare *idrogeno*: è un sale acido.

## I sali acidi

Un ossiacido con due o tre atomi di idrogeno può perderne solo una parte. L'anione che resta contiene ancora idrogeno, e il sale che forma si chiama **sale acido**. Nel nome dell'anione gli atomi di idrogeno rimasti si indicano con *idrogeno-*, o *diidrogeno-* se sono due, davanti al nome; la carica è il numero di ioni $\mathrm{H^+}$ che l'acido ha perso.

| Acido | Anione | Nome tradizionale | Nome IUPAC |
|---|---|---|---|
| $\mathrm{H_2CO_3}$ | $\mathrm{HCO_3^-}$ | ione idrogenocarbonato | ione idrogenotriossocarbonato(IV) |
| $\mathrm{H_2SO_3}$ | $\mathrm{HSO_3^-}$ | ione idrogenosolfito | ione idrogenotriossosolfato(IV) |
| $\mathrm{H_2SO_4}$ | $\mathrm{HSO_4^-}$ | ione idrogenosolfato | ione idrogenotetraossosolfato(VI) |
| $\mathrm{H_3PO_4}$ | $\mathrm{HPO_4^{2-}}$ | ione idrogenofosfato | ione idrogenotetraossofosfato(V) |
| $\mathrm{H_3PO_4}$ | $\mathrm{H_2PO_4^-}$ | ione diidrogenofosfato | ione diidrogenotetraossofosfato(V) |

I sali si chiamano come gli altri: $\mathrm{NaHCO_3}$ è l'idrogenocarbonato di sodio (nome IUPAC: idrogenotriossocarbonato(IV) di sodio), $\mathrm{Ca(HCO_3)_2}$ l'idrogenocarbonato di calcio (bis[idrogenotriossocarbonato(IV)] di calcio), $\mathrm{KH_2PO_4}$ il diidrogenofosfato di potassio. Nell'uso comune sopravvivono nomi più vecchi: bicarbonato di sodio per $\mathrm{NaHCO_3}$, bisolfato e bisolfito per gli idrogenosolfati e gli idrogenosolfiti, oppure carbonato acido di sodio.

Anche un idracido con due idrogeni dà un sale acido: dall'acido solfidrico, $\mathrm{H_2S}$, lo ione idrogenosolfuro, $\mathrm{HS^-}$, e il sale $\mathrm{NaHS}$, idrogenosolfuro di sodio.

```ad-example
Esempio 7: idrogenosolfito di calcio
L'idrogenosolfito è l'acido solforoso, $\mathrm{H_2SO_3}$, che ha perso uno solo dei suoi due idrogeni: $\mathrm{HSO_3^-}$, con carica $1-$. Lo ione calcio è $\mathrm{Ca^{2+}}$. Servono due anioni per un catione: $\mathrm{Ca(HSO_3)_2}$.
```

```ad-warning
L'idrogeno dell'anione cambia la carica
$\mathrm{HCO_3^-}$ ha carica $1-$, non $2-$ come il carbonato: l'idrogeno rimasto compensa una delle due cariche. Scrivere $\mathrm{Na_2HCO_3}$ per l'idrogenocarbonato di sodio è l'errore di chi usa la carica del carbonato.
```

```ad-warning
Sale acido non vuol dire soluzione acida
Il nome dice che nell'anione è rimasto un idrogeno dell'acido, non che il sale in acqua dia una soluzione acida. Il bicarbonato di sodio sciolto in acqua dà una soluzione leggermente basica, tanto che si usa contro l'acidità di stomaco.
```

## I sali idrati

Molti sali cristallizzano trattenendo nel reticolo un numero fisso di molecole d'acqua, l'acqua di cristallizzazione: sono i sali idrati, e la loro formula l'hai già incontrata nella lezione [La formula chimica e il suo significato](/materiale/scuola-superiore/chimica/dalle-trasformazioni-chimiche-alla-teoria-atomica/la-formula-chimica-e-il-suo-significato). Il nome è quello del sale seguito da una parola che conta le molecole d'acqua: *monoidrato*, *diidrato*, *triidrato*, *tetraidrato*, *pentaidrato*, *esaidrato*, *eptaidrato*, *decaidrato*. Lo stesso sale senza acqua si dice **anidro**.

| Formula | Nome tradizionale | Dove si trova |
|---|---|---|
| $\mathrm{CuSO_4 \cdot 5H_2O}$ | solfato rameico pentaidrato | i cristalli azzurri usati in agricoltura contro i funghi della vite |
| $\mathrm{CaSO_4 \cdot 2H_2O}$ | solfato di calcio diidrato | il gesso |
| $\mathrm{Na_2CO_3 \cdot 10H_2O}$ | carbonato di sodio decaidrato | la soda da bucato |
| $\mathrm{MgSO_4 \cdot 7H_2O}$ | solfato di magnesio eptaidrato | il sale inglese |

La parola che conta l'acqua si aggiunge allo stesso modo agli altri due nomi: solfato di rame(II) pentaidrato, tetraossosolfato(VI) di rame pentaidrato.

```ad-example
Esempio 8: dal nome alla formula di un idrato
Solfato ferroso eptaidrato. Il solfato è $\mathrm{SO_4^{2-}}$, lo ione ferroso $\mathrm{Fe^{2+}}$: il sale anidro è $\mathrm{FeSO_4}$. *Epta-* vuol dire sette molecole d'acqua, che si scrivono dopo un punto: $\mathrm{FeSO_4 \cdot 7H_2O}$.
```

## Come si formano

Come per i sali binari, gli schemi sono senza coefficienti.

$$\text{ossiacido} + \text{idrossido} \longrightarrow \text{sale ternario} + \text{acqua}$$

$$\text{ossiacido} + \text{metallo} \longrightarrow \text{sale ternario} + \text{idrogeno}$$

$$\text{ossido basico} + \text{anidride} \longrightarrow \text{sale ternario}$$

L'acido solforico e l'idrossido di sodio danno solfato di sodio e acqua. Lo zinco nell'acido solforico diluito sviluppa idrogeno e lascia in soluzione solfato di zinco. L'ossido di calcio, la calce viva, assorbe l'anidride carbonica dell'aria e diventa carbonato di calcio. Negli schemi si riconosce l'origine dei due pezzi del sale: il metallo viene dall'idrossido, dal metallo o dall'ossido basico, l'anione dall'acido o dalla sua anidride.
