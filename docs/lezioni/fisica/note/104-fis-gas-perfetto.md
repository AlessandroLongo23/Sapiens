# Note: L'equazione di stato del gas perfetto

Lezione nuova (lotto del terzo anno di fisica, gruppo 39, 6 ottobre 2026). Conti rifatti in Python con i dati scritti
come nella lezione:

- esempio 1: $1{,}01 \cdot 10^5 / 2{,}5 \cdot 10^4 = 4{,}04$, $223/293 = 0{,}761$, $2{,}0 \cdot 4{,}04 \cdot 0{,}761 = 6{,}15$ m³;
  con la sola pressione $8{,}08$ m³;
- esempio 2: $6{,}0/4{,}0 = 1{,}5$ mol, $1{,}5 \cdot 6{,}02 \cdot 10^{23} = 9{,}03 \cdot 10^{23}$;
- $R$: $1{,}013 \cdot 10^5 \cdot 22{,}4 \cdot 10^{-3} / 273 = 8{,}312$ (con $1{,}01$ verrebbe $8{,}29$: per questo lì c'è la
  quarta cifra, e la lezione lo dice);
- esempio 3: $8{,}31 \cdot 293 / 1{,}01 \cdot 10^5 = 0{,}02411$ m³;
- esempio 4: $2{,}00 \cdot 10^6 \cdot 1{,}00 \cdot 10^{-2} / (8{,}31 \cdot 293) = 8{,}214$ mol, $\cdot 28{,}0 = 230{,}0$ g; con i
  litri $8214$ mol ($230$ kg), con $t = 20$ $120{,}3$ mol;
- $k_B = 8{,}31 / 6{,}02 \cdot 10^{23} = 1{,}380 \cdot 10^{-23}$ J/K;
- esempio 5: $1{,}01 \cdot 10^5 \cdot 1{,}0 \cdot 10^{-6} / (1{,}38 \cdot 10^{-23} \cdot 293) = 2{,}498 \cdot 10^{19}$; a
  $10^{-8}$ Pa $2{,}47 \cdot 10^6$;
- esempio 6: $6{,}00 \cdot 10^5 \cdot 2{,}00 \cdot 10^{-2} / (8{,}31 \cdot 300) = 4{,}813$ mol; all'inizio $12{,}03$ mol;
- isoterme della figura per una mole: $n R T = 1662$, $2493$, $3324$ J a $200$, $300$, $400$ K; lo stato dell'esempio 3
  è a $(24{,}1$ L; $101$ kPa$)$, appena sotto l'isoterma dei $300$ K ($103{,}4$ kPa a quel volume).

`check.mts`: 0 errori. Un avviso "titolo con maiuscole all'inglese" su "Con il numero di molecole: la costante di
Boltzmann": è un nome proprio.

## Scelte

- La chimica ha già l'equazione generale (lezione 33), il principio di Avogadro (34), la mole (35-36) e l'equazione
  di stato dei gas ideali (37, con $R = 0{,}0821$, massa molare e densità del gas). Qui: la dimostrazione di
  $p_1 V_1/T_1 = p_2 V_2/T_2$ con le due tappe nel piano pressione-volume, tutto in unità SI con $R = 8{,}31$, la forma
  con $N$ e $k_B$, il gas perfetto come modello, le isoterme con il loro valore $n R T$, il gas che esce. Mole e
  principio di Avogadro sono richiamati in poche righe con il link alla chimica; la densità $d = pM/(RT)$ non c'è.
- "Gas perfetto", come nel titolo, con una riga che dice che in chimica si chiama gas ideale.
- Confine con la 105 e la 106: del modello microscopico si dicono solo le due ipotesi (molecole puntiformi, niente
  forze se non negli urti); la pressione dagli urti e l'energia cinetica media sono rimandate con il link.
- Confine con la 108 e seguenti: niente energia interna, niente lavoro.
- Simboli del README: $n$, $N$, $N_A$, $R$, $k_B$; massa molare $M$ in g/mol, come in chimica. Gli stati della
  dimostrazione sono $A$, $B$ e l'intermedio $C$, con i pedici 1 e 2 per le grandezze.
- I gas veri: solo affermazioni qualitative (rarefatto, lontano dalla liquefazione), senza percentuali di scarto.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `gas-perfetto-due-tappe-isoterma-isobara` ($A(1{,}2;\,4)$ e $C(3;\,1{,}6)$ su
$y = 4{,}8/x$, $B(4{,}5;\,1{,}6)$ su $y = 7{,}2/x$), `gas-perfetto-massa-moli-molecole`, `gas-perfetto-isoterme-una-mole`
(1 cm = 10 L e 50 kPa, curve $y = 3{,}324/x$, $4{,}986/x$, $6{,}648/x$).

Interattiva, registrata sotto il commento del gruppo 39 in `src/lib/utils/interactive.ts`:

- `gas-perfetto-piano-pv` (`fisica/GasPerfettoPianoPV.tsx`). Domanda: in quanti modi puoi portare il gas da 300 K a
  600 K? Risposta nel testo subito dopo. Lo stato è un punto da trascinare nel piano pressione-volume (kPa e litri),
  la temperatura si legge da $T = pV/(nR)$, l'isoterma per il punto è arancione sopra quelle fisse a 200, 400, 600 K;
  il punto si può lasciare libero o tenere a $T$, $p$ o $V$ costante; un cursore cambia le moli da 0,5 a 2. Usa
  `Handle`, `Axes`, `Ticks`, `Words`. Guardata in chiaro, in scuro e da telefono, allo stato iniziale, con i tre
  vincoli, agli angoli del piano e con 0,5 e 2 moli. L'unità del cursore delle moli è nell'etichetta, perché `Slider`
  la accavalla al numero.

Nessun blocco `grafico`: la figura interattiva fa già quello che farebbe (le isoterme al variare di $T$).

## Esercizi

Generatore `fis-gas-perfetto`, cinque livelli (specifica in `specs/exercises/fis-gas-perfetto.md`): Da uno stato
all'altro, Le moli di gas, La pressione con litri e gradi Celsius, Il numero di molecole, Il gas uscito dalla bombola.
Nessuna scena (lo stato finale è l'incognita). Gli esempi 2 e 4 nella parte con la massa molare non hanno un livello:
sono in `gas-ideali` di chimica.

## Esercizio guidato

L'esempio 6 (l'ossigeno consumato). Si fermerebbe in tre punti: (1) "puoi usare $p_1 V_1/T_1 = p_2 V_2/T_2$?", per far
dire di no e perché; (2) "che cosa resta uguale prima e dopo, e che cosa cambia?"; (3) prima del conto, "se la
pressione scende del $40\%$, di quanto scendono le moli?".

## Da verificare

- Amedeo Avogadro, 1811.
- Pallone sonda: a circa 10 km, $2{,}5 \cdot 10^4$ Pa e $-50\,^\circ\text{C}$ (valori tondi; l'atmosfera standard dà circa
  $2{,}65 \cdot 10^4$ Pa e $-50\,^\circ\text{C}$ a 10 km).
- Masse molari usate: elio $4{,}0$, azoto $28{,}0$, ossigeno $32{,}0$ g/mol.
- Volume molare $22{,}4$ L a $0\,^\circ\text{C}$ e $1\,\text{atm}$.
- "Vuoto migliore dei laboratori" a $10^{-8}$ Pa: ordine di grandezza dell'ultra-alto vuoto, da confermare.
- Bombola da $10{,}0$ L a $2{,}00 \cdot 10^6$ Pa (circa 20 atm) e da $20{,}0$ L a $1{,}50 \cdot 10^6$ Pa: pressioni basse
  per una bombola vera, scelte perché il modello valga bene.
- "Il vapore d'acqua vicino ai 100 °C o un gas a centinaia di atmosfere" come esempi in cui il modello vale meno.

## Domande per Andrea

- La dimostrazione usa isoterma più isobara. L'Amaldi fa la stessa strada o parte dalle leggi in gradi Celsius?
- Il principio di Avogadro è usato per passare da "costante" a "$n R$" in tre righe, con il link alla chimica. Basta
  per chi non ha ancora fatto la mole in chimica (dipende dall'indirizzo e dall'anno)?
- $k_B$ è introdotta qui come $R/N_A$. Va bene che il suo significato ("la costante per una molecola") resti a questo
  livello fino alla 106?
- La massa molare in g/mol e non in kg/mol: in fisica alcuni libri usano i chilogrammi. Quale vuoi?

Prerequisiti proposti: fis-legge-boyle, fis-leggi-gay-lussac, fis-temperatura
