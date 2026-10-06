# Note: La quantità di moto

Lezione nuova (lotto del terzo anno, gruppo 32, 6 ottobre 2026). Conti rifatti in Python:

- esempio 1: $0{,}43 \cdot 25 = 10{,}75$; $54 : 3{,}6 = 15$ m/s, $1200 \cdot 15 = 18\,000$;
- esempio 2: $12 / 0{,}058 = 206{,}9$ m/s ($745$ km/h); $K = 12$ J e $144 / 0{,}116 = 1241$ J;
- esempio 3: $1{,}8$, $-1{,}2$, $\Delta p = -3{,}0$; con la differenza dei moduli $0{,}60$;
- esempio 4: $6{,}0 - 8{,}0 = -2{,}0$; esempio 5: $1{,}8 \cdot 10^4$, $2{,}4 \cdot 10^4$, $3{,}0 \cdot 10^4$, $53{,}13^\circ$;
- esempio 6: $-7{,}5 \cdot 10^3$ N; esempio 7: $18$, $24$ kg·m/s, $6{,}0$ m/s.

`check.mts`: 0 errori, 0 avvisi.

## Scelte

- Confine con la 81: qui $\vec F_{tot} = \Delta\vec p / \Delta t$ come forma del secondo principio, con la forza media definita in una riga e due esempi a forza costante. La parola "impulso" compare solo nell'ultima riga dell'esempio 7, con il link. Urti, forze impulsive, airbag e area sotto il grafico sono della 81.
- Confine con la 82: la conservazione è annunciata nell'ultima sezione, in cinque righe, con il link.
- Il sistema di corpi e $\vec p_{tot}$ stanno qui (titolo dell'albero); forze interne ed esterne sono della 82.
- $K = p^2 / (2m)$ è in una sezione breve: serve agli urti.
- Simboli del README: $\vec p$, $\vec p_{tot}$, componenti $p_x$, $v_{ix}$ e $v_{fx}$.
- Il razzo è nominato in una riga come caso di massa variabile, senza formule.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `rimbalzo-muro-variazione-quantita-moto` (1 cm per kg·m/s), `due-carrelli-quantita-moto-totale` (0,25 cm per kg·m/s), `quantita-moto-incrocio-somma` (1,25 cm per $10^4$ kg·m/s, angolo $53{,}13^\circ$), `frenata-forza-quantita-moto`.

Interattiva (registrata sotto il commento del gruppo 32):

- `quantita-moto-due-carrelli` (`fisica/QuantitaMotoCarrelli.tsx`): quando è zero la quantità di moto totale di due carrelli che si muovono? Quattro cursori (masse e velocità con il segno); le frecce di $\vec p_1$, $\vec p_2$ e della somma sono in scala e messe punta-coda. L'unità delle velocità è nell'etichetta del cursore, per il difetto noto di `Slider`.

## Esercizio guidato

L'esempio 3 (la palla che rimbalza). Si fermerebbe in tre punti: il segno di $v_{fx}$ con il verso positivo scelto; $p_{ix}$ e $p_{fx}$; $\Delta p_x$, con la differenza dei moduli come errore previsto.

## Esercizi

Generatore `fis-quantita-moto-def`, sette livelli. Scena già esistente `vettori-piano` al livello 6 (le due velocità perpendicolari).

## Domande per Andrea

- Il secondo principio nella forma $\vec F = \Delta\vec p / \Delta t$ va qui, come dice l'albero, o preferisci tutto nella lezione sull'impulso?
- $K = p^2/(2m)$ è nei libri del terzo anno che usi? (da verificare)
- L'esempio 5 dà l'angolo con la tangente e la calcolatrice: va bene prima della goniometria?

## Da verificare

- Massa di una palla da tennis $58$ g, di un pallone da calcio $0{,}43$ kg, di una palla da bowling $6{,}0$ kg: valori correnti, scritti a memoria.
- "Il triplo del servizio di un campione": servizi intorno a $250$ km/h, a memoria.
- Newton enunciò il secondo principio con la variazione del "moto" (la quantità di moto), nei Principia (1687): da controllare su una fonte.

Prerequisiti proposti: leggi-newton, fis-operazioni-vettori, fis-energia-cinetica
