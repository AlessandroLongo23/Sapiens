# Note: Conduzione, convezione e irraggiamento

Lezione nuova (terzo lotto di fisica, il secondo anno, gruppo 20, 30 settembre 2026). Conti rifatti in Python: esempio
1, $1{,}0 \cdot 1{,}2 \cdot 2{,}0/0{,}0040 = 600\,\text{W}$, vetro e aria ferma $1{,}0/0{,}025 = 40$; esempio 2,
$0{,}80 \cdot 10 \cdot 15/0{,}25 = 480\,\text{W}$, in $36\,000\,\text{s}$ $1{,}728 \cdot 10^7\,\text{J}$; esempio 3,
$25 \cdot 0{,}035/0{,}80 = 1{,}094\,\text{cm}$; esempio 4, $0{,}035 \cdot 0{,}50 \cdot 26/6{,}5 = 0{,}070\,\text{m}$; rame
e aria $401/0{,}025 = 16\,040$; $(600/300)^4 = 16$; nella figura interattiva, a regime, rame $401 \cdot 10^{-4} \cdot
100/0{,}20 = 20\,\text{W}$, ferro $4{,}0\,\text{W}$, acciaio $0{,}80\,\text{W}$, vetro $0{,}050\,\text{W}$. `check.mts` passa.

## Struttura ed esempi

Il calore va dal caldo al freddo (i tre modi in un elenco), la conduzione (meccanismo, conduttori e isolanti, l'avviso
sul metallo che sembra più freddo), la legge della conduzione con la figura della lastra, il riquadro sulle lettere $T$ e
$\lambda$, la tabella delle conducibilità, gli esempi 1 (il vetro) e 2 (la parete in una notte), l'avviso sulle unità, la
figura interattiva; la convezione con la figura della pentola e gli esempi di ogni giorno; l'irraggiamento (qualitativo,
la legge di Stefan-Boltzmann solo nominata in un riquadro); il thermos con la figura e il cappotto termico con gli esempi
3 (lo spessore equivalente di polistirolo) e 4 (la borsa frigo), l'avviso sulla differenza di temperatura.

## Scelte

- La legge della conduzione c'è, perché l'Amaldi la tratta al biennio: diapositive del capitolo 13 di "Fisica.verde"
  (Zanichelli 2017, lette il 30 settembre 2026 dal file `Amaldi_powerpoint_12094_c13.pdf` pubblicato su
  fisikamol.altervista.org), "La conduzione (1) e (2)", con $Q/\Delta t$ in watt, direttamente proporzionale all'area e
  alla differenza di temperatura, inversamente allo spessore, e "la costante $\lambda$ ... coefficiente di conducibilità
  termica". Il "Nuovo Amaldi per i licei scientifici.blu", il libro di `programma.md`, non l'ho letto: da verificare che
  la tratti allo stesso modo.
- Il simbolo: $\lambda$, come l'Amaldi. Il README usa $\lambda$ anche per il coefficiente di dilatazione lineare (lezione
  66); nella lezione un riquadro dice che sono due grandezze diverse. L'alternativa è $k$, che molti libri usano
  (Cutnell, Walker) ma che nel primo anno è la costante elastica. La temperatura nella legge è $T$ maiuscola, perché
  $\Delta t$ è il tempo (regola del README).
- L'irraggiamento è qualitativo: l'Amaldi Fisica.verde dà la legge di Stefan-Boltzmann con l'emissività, ma una lezione
  di 10-15 minuti con tre meccanismi non ha spazio per i conti con $T^4$; la lezione la nomina in un riquadro con il
  fattore sedici tra $300$ e $600\,\text{K}$.
- Nell'esempio 1 la differenza tra le facce del vetro è $2\,^\circ\text{C}$, non la differenza tra la stanza e l'esterno:
  gli strati d'aria sulle due facce fanno la maggior parte dell'isolamento (da verificare quanto: il numero è scelto
  plausibile, non misurato).

## Dati

Conducibilità da Wikipedia, "List of thermal conductivities", letta il 30 settembre 2026, valori intorno a
$20\,^\circ\text{C}$: rame $401$, alluminio $237$, ferro puro $80{,}4$ (scritto $80$), acciaio inossidabile $16$-$24$
(scritto "circa $16$"), vetro da finestra $0{,}8$-$1{,}4$ (scritto "circa $1$"), mattoni $0{,}15$-$1{,}31$ (scritto "circa
$0{,}8$" per i mattoni pieni: da verificare), acqua $0{,}59$ (scritto $0{,}6$), legno di pino $0{,}09$-$0{,}10$ (scritto
"circa $0{,}1$"), polistirolo espanso $0{,}033$-$0{,}046$ (scritto "circa $0{,}035$"), aria $0{,}024$-$0{,}025$ (scritto
$0{,}025$). Negli esercizi anche lana di roccia $0{,}040$ (lana di vetro $0{,}042$ nella stessa tabella), sughero
$0{,}050$ ($0{,}04$-$0{,}07$), calcestruzzo $1{,}5$ ($0{,}8$-$2{,}5$), pietra $2{,}2$: tutti dati del testo, da verificare.
Nella figura interattiva densità e calori specifici arrotondati (rame $8960\,\text{kg/m}^3$ e $385$, ferro $7870$ e
$449$, acciaio $8000$ e $500$, vetro $2500$ e $840$) per la diffusività $\lambda/(\rho\,c)$.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `lastra-conduzione-calore` (lastra in prospettiva con $d$, $S$, $T_1$, $T_2$ e
il calore), `moti-convettivi-pentola` (le due correnti circolari, rosse in salita e blu in discesa), `thermos-sezione`.
Interattiva `conduzione-sbarra-materiali` (`fisica/ConduzioneSbarra.tsx`): due sbarre di $20\,\text{cm}$ e
$1\,\text{cm}^2$ tra acqua che bolle e acqua e ghiaccio, materiale a scelta (rame, ferro, acciaio, vetro), tempo a un
minuto o dieci minuti al secondo; l'equazione del calore è integrata a mano con un passo esplicito su 40 celle
(abbastanza passi per restare stabile), un triangolo segna dove la sbarra supera $50\,^\circ\text{C}$, e sotto si leggono
la temperatura a metà, il calore che arriva all'estremità fredda e quello a regime. Il rame arriva a regime (entro il $2\%$) in
$2{,}7$ minuti, il ferro in $14$, l'acciaio in $78$, il vetro in quasi undici ore (conti in Python con lo stesso passo). Guardata in chiaro, in scuro, sul telefono, prima e
dopo l'avvio.

## Esercizi

Generatore `fis-propagazione-calore`, cinque livelli (specifica in `specs/exercises/fis-propagazione-calore.md`), scena
`lastra-conduzione` (nuova, `scenes/LastraConduzione.tsx`).

## Domande per Andrea

- $\lambda$ per la conducibilità, come l'Amaldi, anche se è la lettera del coefficiente di dilatazione lineare della
  lezione 66? O $k$?
- La legge della conduzione è nel programma del secondo anno che fate, o basta la parte qualitativa (conduttori,
  isolanti, convezione, irraggiamento)?
- La legge di Stefan-Boltzmann ($P = e\,\sigma\,S\,T^4$) va data con i conti, come nell'Amaldi Fisica.verde, o basta
  nominarla?
- Il vetro dell'esempio 1 con $2\,^\circ\text{C}$ tra le facce: meglio un esempio con la differenza tra dentro e fuori, e
  una nota sugli strati d'aria, o va bene così?
