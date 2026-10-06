# Note: Il moto dei satelliti

Lezione nuova (lotto del terzo anno, gruppo 37, 6 ottobre 2026). Conti rifatti in Python con i dati scritti come nella
lezione:

- $G M_T = 3{,}982 \cdot 10^{14}$ m³/s²;
- esempio 1: $r = 6{,}77 \cdot 10^6$ m, $G M_T / r = 5{,}882 \cdot 10^7$, $v = 7669$ m/s ($27\,609$ km/h); con $h$ al
  posto di $r$: $3{,}155 \cdot 10^4$ m/s;
- grafico: $v(R_T) = 7906$ m/s, $v(2R_T) = 5591$, $v(4R_T) = 3953$, $v(6{,}62\,R_T) = 3073$ m/s;
- esempio 2: $2\pi \cdot 6{,}77 \cdot 10^6 / 7{,}67 \cdot 10^3 = 5546$ s $= 92{,}4$ min; $86\,400 / 5546 = 15{,}58$;
- esempio 3: $r^3 = 5{,}662 \cdot 10^{25}$, $r^3 / (G M_T) = 1{,}4226 \cdot 10^{11}$, radice $3{,}772 \cdot 10^5$,
  $T = 2{,}370 \cdot 10^6$ s $= 27{,}43$ giorni;
- esempio 4: $4\pi^2 \cdot 3{,}375 \cdot 10^{33} = 1{,}3324 \cdot 10^{35}$; $(3{,}16 \cdot 10^7)^2 = 9{,}9856 \cdot
  10^{14}$; $6{,}67 \cdot 10^{-11} \cdot 9{,}9856 \cdot 10^{14} = 6{,}660 \cdot 10^4$; $M_S = 2{,}0005 \cdot 10^{30}$ kg;
- esempio 5: $3{,}98 \cdot 10^{14} \cdot (8{,}62 \cdot 10^4)^2 / (4\pi^2) = 7{,}491 \cdot 10^{22}$, radice cubica
  $4{,}216 \cdot 10^7$ m; quota $3{,}58 \cdot 10^7$ m; $\sqrt{3{,}98 \cdot 10^{14} / 4{,}22 \cdot 10^7} = 3071$ m/s; con
  $8{,}64 \cdot 10^4$ s il raggio è $4{,}223 \cdot 10^7$ m;
- tabella: GPS $r = 2{,}657 \cdot 10^7$ m $= 4{,}17\,R_T$, $v = 3871$ m/s, $T = 11{,}98$ h; Luna $60{,}3\,R_T$,
  $1018$ m/s;
- cannone (figura interattiva): a $1{,}1\,R_T$ dal centro la velocità circolare è $7538$ m/s, quella di fuga
  $10\,660$ m/s; il proiettile sfiora il suolo dall'altra parte a $7357$ m/s (perigeo uguale a $R_T$), quindi a
  $7{,}3$ km/s ricade e a $7{,}4$ no.

`check.mts`: la lezione e le flashcard passano; nel formulario restano due avvisi sui titoli "Terza legge di Keplero" e
"Satelliti della Terra", dove la maiuscola è di un nome proprio.

## Scelte

- Confine con la 93 (gruppo 36): le tre leggi e i conti sulla terza stanno nella 93; qui la terza legge si ricava per
  le orbite circolari, con la costante $4\pi^2 / (G M)$, e si usa per trovare la massa centrale e il raggio dal
  periodo. Per le orbite ellittiche dico che vale con $a$ al posto di $r$ senza dimostrarlo.
- Confine con la 97: energia in orbita e velocità di fuga stanno nella 97. La figura del cannone mostra anche le
  traiettorie aperte, e il testo rimanda alla 97 con il link.
- Confine con la 72 e la 75 (gruppo 31): l'assenza apparente di peso è spiegata nel sistema inerziale (caduta libera
  comune); il punto di vista del sistema accelerato è una riga con i due link. L'ascensore con la bilancia è nella
  lezione 53 (Il diagramma delle forze), che linko.
- Prima velocità cosmica: nominata come nome della velocità orbitale al suolo; "seconda velocità cosmica" non compare
  (nella 97 si chiama solo velocità di fuga).
- Il giorno sidereo ($8{,}62 \cdot 10^4$ s) nell'esempio 5, con una nota che dice perché non $24$ ore e che il
  risultato a tre cifre non cambia.
- La montagna del cannone è alta 640 km nella figura interattiva (in scala, sopra l'atmosfera) e molto più alta nella
  figura TikZ, che è uno schema e lo dice nel testo alternativo.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `cannone-di-newton-traiettorie` (coniche vere, in coordinate polari:
lancio a 2 cm dal centro di una Terra di 1,5 cm, velocità 0,5, 0,75, 0,9, 1 e 1,15 volte quella circolare),
`satellite-orbita-circolare-forza`, `grafico-velocita-orbitale-raggio` (1 cm per raggio terrestre, 0,5 cm per km/s;
riga `% poi-interattivo`), `orbite-terra-in-scala` (Terra di 0,45 cm: Stazione a 0,478, GPS a 1,877, geostazionario a
2,979 cm).

Interattiva `cannone-newton-orbita` (`fisica/CannoneNewton.tsx`): velocità di lancio da 4 a 11 km/s, traiettoria
tratteggiata sempre disegnata (conica esatta $r = p / (1 + e\cos\theta)$), bottone che fa muovere il proiettile con
passi di $\Delta\theta = L\,\Delta t / r^2$, mille volte più veloce del vero. Risponde a: "qual è la velocità più
piccola con cui il proiettile non tocca più il suolo?" Il testo dopo la figura dà le soglie. Le ellissi più grandi
escono dal disegno e rientrano.

## Da verificare

- Massa della Stazione Spaziale "più di 400 tonnellate" (circa 420 t), quota 400 km, 15-16 albe al giorno.
- Giorno sidereo: 23 h 56 min, $86\,164$ s.
- Quota dei satelliti GPS: $20\,200$ km, periodo di circa 12 ore.
- Anno: $3{,}16 \cdot 10^7$ s ($3{,}156 \cdot 10^7$).
- Periodo della Luna misurato: $27{,}3$ giorni (mese sidereo), come nelle lezioni 48 e 57.
- Voli parabolici: "una ventina di secondi" di assenza di peso per parabola.
- L'esperimento del cannone è nei Principia e nel "De mundi systemate" di Newton: attribuzione scritta a memoria.

## Domande per Andrea

- La terza legge per le orbite ellittiche: va bene enunciarla soltanto, o l'Amaldi del terzo anno dice qualcosa di
  più?
- Il periodo del satellite geostazionario: giorno sidereo, come ho fatto, o $24$ ore come in molti libri?
- "Prima velocità cosmica" si usa nei libri in adozione, o è meglio toglierla?
- L'assenza apparente di peso: basta la spiegazione con la caduta libera, o serve anche il conto con la forza
  centrifuga nel sistema della Stazione (che sarebbe della lezione 75)?
- I periodi negli esercizi sono sempre in secondi. Un livello con il periodo in ore o in giorni da convertire sarebbe
  più vicino ai libri: da aggiungere?

## Esercizio guidato

L'esempio 5 (il satellite geostazionario) renderebbe di più come esercizio guidato. Si fermerebbe in tre punti: "quale
grandezza è fissata, per un satellite che resta sopra lo stesso punto?" (il periodo); "da quale formula si ricava il
raggio, e con quale radice?"; "il numero trovato è la quota?" (no: va tolto il raggio terrestre).

## Esercizi

Generatore `fis-satelliti`, sei livelli (specifica in `specs/exercises/fis-satelliti.md`): La velocità orbitale dal
raggio, La velocità orbitale dalla quota, Il periodo dell'orbita, Due orbite a confronto, La massa del corpo centrale,
Il raggio dell'orbita dal periodo. Scena `orbita-pianeta` al livello 2. L'assenza apparente di peso non ha un livello:
è qualitativa, e sta nelle flashcard.

Prerequisiti proposti: fis-campo-gravitazionale, fis-forza-centripeta, fis-moto-circolare-uniforme, fis-leggi-keplero
