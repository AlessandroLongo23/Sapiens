# Note: Il grafico velocità-tempo

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 13, 30 settembre 2026). Conti rifatti in Python: autobus $a_A = 12/6 = 2{,}0$ m/s², $a_C = -12/4 = -3{,}0$ m/s², aree $36 + 240 + 24 = 300$ m, $v_m = 300/30 = 10$ m/s; auto $v = 2t$, pendenza $12/6 = 2{,}0$ m/s², trapezio $(4 + 16)/2 \cdot 6 = 60$ m, legge oraria $24 + 36 = 60$ m; palla $v = 6 - 2t$, aree $9$ e $-4$ m, spostamento $5$ m, distanza $13$ m, $6t - t^2$ vale $9$ a $3$ s e $5$ a $5$ s; posizioni dell'autobus $s(6) = 36$, $s(26) = 276$, $s(30) = 300$ m. `check.mts` passa.

## Struttura ed esempi

Leggere il grafico (segno della velocità, tratti orizzontali, inclinati, soste; figura dell'autobus con i tratti A, B, C), avviso "il grafico non è la strada"; la pendenza è l'accelerazione (coefficiente angolare, figura con il triangolo $\Delta t$, $\Delta v$), esempio 1 (le tre accelerazioni dell'autobus), avviso sui quadretti; l'area è lo spostamento (rettangolo, triangolo, trapezio, unità), figura del trapezio, esempio 2 con il controllo della legge oraria, i grafici a tratti e la velocità media, esempio 3 (viaggio dell'autobus, figura delle tre aree), avviso sulla velocità media; le aree con il segno (spostamento e distanza percorsa, figura), esempio 4 (palla su un piano inclinato), avviso "fermo non vuol dire senza accelerazione"; dal grafico v-t al grafico s-t (regole qualitative, figure dell'autobus e della palla con i due grafici uno sopra l'altro), avviso sui due grafici da non confondere; la figura interattiva.

## Scelte

- "La velocità è la pendenza del grafico spazio-tempo" si usa come fatto della lezione sul moto uniforme e sulla velocità istantanea del gruppo 12 (tangente): se la lezione 39 non parla di tangente, la frase va ammorbidita.
- Spostamento e distanza percorsa: la distanza percorsa si chiama così (non "spazio percorso"), per non confonderla con la posizione $s$. Da verificare con il gruppo 12 e con Andrea.
- Il passaggio al grafico s-t è qualitativo, come chiesto; i grafici s-t delle figure sono però disegnati con le leggi esatte.
- Le figure con i due grafici uno sopra l'altro hanno solo l'asse dei tempi numerato in basso.

## Figure

Sette TikZ, guardate in chiaro e in scuro: `grafico-vt-autobus` (1 cm = 5 s e 3 m/s), `pendenza-grafico-vt` e `area-trapezio-grafico-vt` (1 cm = 2 s e 4 m/s, retta $v = 2t$), `aree-grafico-vt-autobus`, `aree-con-segno-grafico-vt` (1 cm = 1 s e 2 m/s), `autobus-da-vt-a-st` (s-t: 1 cm = 60 m; parabola $0{,}41667\,x^2$, retta, parabola $(276 + 12u - 1{,}5u^2)/60$ con $u = 5x - 26$), `palla-da-vt-a-st` (s-t: $(6x - x^2)/2$). Tutte con la riga `% poi-interattivo` dove un piano cartesiano del kit servirà. Interattiva `grafico-velocita-tempo-tratti` (`fisica/GraficoVTratti.tsx`): quattro vertici da trascinare (tempi al secondo, velocità al m/s tra $-8$ e $+10$), aree blu sopra l'asse e rosse sotto, accelerazioni dei tre tratti, spostamento e distanza percorsa; parte da $(0;0)$, $(4;8)$, $(8;8)$, $(12;-8)$ con spostamento $48$ m e distanza $64$ m.

## Esercizi

Generatore `fis-grafico-velocita-tempo`, cinque livelli (specifica in `specs/exercises/fis-grafico-velocita-tempo.md`), scena nuova `grafico-velocita-tempo` (`scenes/GraficoVelocitaTempo.tsx`): la scena `grafico-dati` del gruppo 3 non disegna spezzate né velocità negative.

## Domande per Andrea

- "Distanza percorsa" per la somma delle aree senza segno, o "spazio percorso" come in molti libri?
- Le aree sotto l'asse con il segno meno e la differenza tra spostamento e distanza percorsa: l'Amaldi del secondo anno le tratta, o bastano grafici tutti sopra l'asse?
- Il passaggio dal grafico v-t al grafico s-t (concavità, massimo quando $v = 0$) è troppo per il secondo anno?
- La velocità media come area totale diviso tempo totale: va bene qui, o appartiene alla lezione sulla velocità?
