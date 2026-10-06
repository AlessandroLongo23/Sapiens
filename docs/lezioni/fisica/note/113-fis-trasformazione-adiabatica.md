# Note: La trasformazione adiabatica

Lezione nuova (lotto del terzo anno di fisica, gruppo 42, 6 ottobre 2026). Conti rifatti in Python, con $R = 8{,}31$:

- esempio 1: $1{,}20 \cdot 12{,}465 \cdot 90 = 1346{,}22$ J;
- esempio 2: $3{,}00^{1{,}40} = 4{,}6555$, $3{,}00^{0{,}40} = 1{,}5518$, $293 \cdot 1{,}5518 = 454{,}69$ K, cioè $181{,}7$ °C; Boyle $3{,}00$ atm;
- esempio 3: $18{,}0^{0{,}40} = 3{,}1777$, $300 \cdot 3{,}1777 = 953{,}30$ K, $680$ °C; con i gradi Celsius $27 \cdot 3{,}1777 = 85{,}8$;
- esempio 4: $2^{5/3} = 3{,}1748$, $p_B = 1{,}2599 \cdot 10^5$ Pa, $p_A V_A = 1000$ J, $p_B V_B = 629{,}96$ J, $W = 555{,}06$ J,
  $T_A = 300{,}84$ K, $T_B = 189{,}52$ K, controllo $0{,}400 \cdot 12{,}465 \cdot (301 - 190) = 553{,}4$ J, isoterma $1000 \ln 2 = 693{,}15$ J;
- interattiva: da 2,0 atm e 1,0 L a 2,0 L, isoterma 1,00 atm; adiabatica $0{,}630$ atm e $189{,}0$ K (monoatomico), $0{,}758$ atm e
  $227{,}4$ K (biatomico);
- nuvola: $293 \cdot 0{,}80^{0{,}4/1{,}4} = 274{,}9$ K, cioè $1{,}9$ °C.

`check.mts` passa senza avvisi su lezione, formulario e flashcard.

## Scelte

- Confine con la 111 (gruppo 41): isocora, isobara e isoterma sono là; qui le riprendo solo nella tabella finale delle quattro
  trasformazioni, con il link, e uso il lavoro dell'isoterma $nRT \ln(V_B/V_A)$ una volta, per il confronto dell'esempio 4.
- Confine con la 112: $C_V$, $C_p$ e $\gamma$ vengono da lì; qui si usano.
- Confine con la 116 (gruppo 43): il ciclo di Carnot è solo nominato con il link, e così i motori.
- La legge $pV^\gamma = \text{costante}$ è enunciata, dicendo che la dimostrazione chiede la matematica del quinto anno. Da quella
  ricavo $TV^{\gamma-1}$ con l'equazione di stato (un passaggio di algebra) e do la terza forma, $T^\gamma p^{1-\gamma}$, senza
  esempio svolto: la uso solo per il numero della nuvola.
- Il lavoro: prima $W = n\,C_V\,(T_A - T_B)$ dal primo principio, poi $(p_A V_A - p_B V_B)/(\gamma - 1)$ ricavata con
  $C_V = R/(\gamma - 1)$.
- "Rapida" e "quasistatica": un paragrafo spiega perché non si contraddicono (la pressione si uniforma molto più in fretta di
  quanto passi il calore).
- L'espansione libera sta in una nota finale, come caso adiabatico che non segue la legge di Poisson.
- Le potenze con esponente non intero: tasto $x^y$, con il link alla lezione di matematica sulle potenze con esponente
  razionale.

## Domande per Andrea

- Il nome: "legge di Poisson" o "equazioni di Poisson"? Ho scritto "legge di Poisson" per $pV^\gamma$ e "forme" per le altre due.
- La terza forma, $T^\gamma p^{1-\gamma} = \text{costante}$, si tiene o si toglie? È solo enunciata.
- La formula $W = (p_A V_A - p_B V_B)/(\gamma - 1)$ è al livello del terzo anno, o basta il lavoro dalle temperature?
- L'esempio della pompa dà 182 °C, che una pompa vera non raggiunge: la frase finale lo dice. Basta, o meglio un esempio diverso?
- Il confronto dei lavori usa $\ln 2$ dell'isoterma della 111: va bene richiamarlo qui?

## Da verificare

- Rapporto di compressione di un motore Diesel: ho usato $18$, un valore tipico scritto a memoria.
- "Il motore Diesel non ha candele" e l'accensione spontanea del gasolio a quella temperatura.
- Pressione a duemila metri: $0{,}80$ atm, valore dell'atmosfera standard a memoria ($0{,}785$ atm a 2000 m).
- La brina sull'ugello di una bombola di anidride carbonica: fatto di esperienza, a memoria.
- Le compressioni dell'aria in un'onda sonora sono adiabatiche: affermazione standard, senza fonte citata.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `adiabatica-espansione-compressione` (cilindri con la fascia isolante disegnata a
bande, senza riempimenti bianchi), `adiabatica-isoterma-piano-pv` (isoterma $p = 3{,}6/V$, adiabatica $p = 3{,}6/V^{5/3}$,
$A(1; 3{,}6)$, $B(2; 1{,}8)$, $C(2; 1{,}134)$, seconda isoterma $p = 2{,}268/V$ per $C$; riga `% poi-interattivo`; copiata nel
formulario), `lavoro-adiabatica-isoterma-aree` (dati dell'esempio 4: 0,6 cm per litro, 1 cm ogni $10^5$ Pa, $A(1{,}5; 4)$,
adiabatica a $1{,}26$ e isoterma a $2$ per $V = 5{,}00$ L). Le potenze si scrivono `exp(1.6667*ln(x))`.

Interattiva `adiabatica-isoterma-pistone` (`fisica/AdiabaticaIsoterma.tsx`, registrata sotto il commento del gruppo 42):
risponde a "a parità di volume, di quanto si staccano la pressione dell'adiabatica e quella dell'isoterma, e a che temperatura
arriva il gas isolato?". Cilindro orizzontale sotto il piano pressione-volume, sulla stessa scala dei volumi; volume da 0,5 a
4,0 L con il cursore o trascinando il pistone; gas monoatomico o biatomico; il colore del gas segue la temperatura. Il testo
dopo la figura dà i numeri per il volume raddoppiato.

## Esercizio guidato

L'esempio 4 (l'espansione adiabatica completa) renderebbe di più come esercizio guidato. Si fermerebbe in tre punti: prima della
pressione finale ("il volume raddoppia: la pressione finale è la metà, più della metà o meno della metà?"), prima del lavoro
("in che unità vanno i volumi perché $p\,V$ esca in joule?") e alla fine ("lungo un'isoterma il lavoro sarebbe stato più grande
o più piccolo?").

## Esercizi

Generatore `fis-trasformazione-adiabatica`, sei livelli (specifica in `specs/exercises/fis-trasformazione-adiabatica.md`): Il
lavoro dalla temperatura, La pressione finale, La temperatura finale, Il volume finale, Temperature in gradi Celsius, Il lavoro
da pressioni e volumi. Scena nuova `curve-pv` (`scenes/CurvePV.tsx`) ai livelli 2 e 6. Il confronto con il lavoro
dell'isoterma (fine dell'esempio 4) e la terza forma della legge non hanno un livello.

Prerequisiti proposti: fis-calori-molari, principi-termo, fis-trasformazioni-termodinamiche, radicali-esponente-razionale
