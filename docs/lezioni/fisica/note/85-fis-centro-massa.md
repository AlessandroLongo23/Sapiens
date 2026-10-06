# Note: Il centro di massa

Lezione nuova (lotto del terzo anno, gruppo 33, 6 ottobre 2026). `check.mts` passa senza avvisi. Conti rifatti in Python:

- esempio 1: $(1{,}5 \cdot 0{,}20 + 4{,}5 \cdot 1{,}0)/6{,}0 = 0{,}80$ m;
- esempio 2: $7{,}35 \cdot 10^{22} \cdot 3{,}84 \cdot 10^8 = 2{,}8224 \cdot 10^{31}$; $5{,}97 \cdot 10^{24} + 7{,}35 \cdot 10^{22} =
  6{,}0435 \cdot 10^{24}$; quoziente $4{,}670 \cdot 10^6$ m; $6{,}37 \cdot 10^6 - 4{,}67 \cdot 10^6 = 1{,}70 \cdot 10^6$ m;
- esempio 3: $9{,}0/6{,}0 = 1{,}5$ m e $6{,}0/6{,}0 = 1{,}0$ m;
- esempio 4: $(6{,}0 - 4{,}0)/4{,}0 = 0{,}50$ m/s prima, $(-3{,}0 + 5{,}0)/4{,}0 = 0{,}50$ m/s dopo;
- esempio 5: $60 \cdot 3{,}0/180 = 1{,}0$ m; nella figura il centro di massa è a 3,5 cm in tutte e due le righe;
- esempio 6: $2 \cdot 48 - 24 = 72$ m.

## Struttura ed esempi

Apertura con il martello lanciato; il centro di massa di due corpi (esempio 1 con la figura, lo zero dell'asse,
esempio 2 Terra-Luna, avviso sul punto medio); più corpi, nel piano e nello spazio (esempio 3 con la figura); i corpi
estesi, i centri di simmetria e il legame con il baricentro; la velocità del centro di massa e $\vec p_{tot} =
M\,\vec v_{cm}$ (esempio 4, sull'urto dell'esempio 1 della lezione 84); il teorema del centro di massa ricavato da
$\Delta\vec p_{tot} = \vec F_{est}\,\Delta t$ della lezione 82, con i due casi (isolato, solo il peso), l'interattiva e
l'avviso sulle forze interne; un sistema fermo che cambia forma (esempio 5 della barca, con figura); un sistema che
esplode in volo (esempio 6 del fuoco d'artificio, con il grafico); il sistema del centro di massa in un `ad-note`.

## Scelte

- Confini. Il sistema di riferimento del centro di massa è solo nominato, in un riquadro (brief). Il baricentro è
  della lezione 25: qui c'è il link e una frase sulla coincidenza dei due punti per gli oggetti piccoli rispetto alla
  Terra.
- Simboli. $x_{cm}$, $\vec v_{cm}$ dal README; $\vec a_{cm}$ e $M$ (massa totale) aggiunti. Nelle figure il centro di
  massa è un punto nero con la scritta "cm".
- Le coordinate dei punti sono scritte $(1{,}0\,\text{m};\,2{,}0\,\text{m})$, con il punto e virgola come nelle lezioni
  di matematica.
- Il nome "teorema del centro di massa" per $\vec F_{est} = M\,\vec a_{cm}$: è quello dei libri italiani (da
  verificare sull'Amaldi).
- La velocità del centro di massa è ricavata da $\Delta x_{cm}/\Delta t$ lungo un asse e poi estesa ai vettori, senza
  limiti né derivate.
- Nell'esempio 6 è detto perché il ragionamento funziona (i due frammenti arrivano al suolo insieme), e un capoverso
  dopo l'esempio dice che cosa succede quando un frammento tocca terra prima: senza questa precisazione la frase "il
  centro di massa continua sulla parabola" sarebbe vera solo in parte.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `centro-massa-due-sfere` (5 cm per metro: 1,0, 4,0 e 5,0 cm),
`centro-massa-tre-masse-piano` (1 cm per metro, griglia), `barca-prima-dopo` (1 cm per metro: barca da 2,0-6,0 a
1,0-5,0, ragazza da 2,5 a 4,5, centro di massa a 3,5), `fuoco-artificio-centro-massa` (1 cm per 10 m; parabole
$y = 2 - 2((x - 2{,}4)/2{,}4)^2$ e $y = 2 - 2((x - 2{,}4)/4{,}8)^2$; a $y = 1{,}5$ i punti 2,4, 3,6 e 4,8).

Interattiva `centro-massa-urto-carrelli` (`fisica/CentroMassaUrto.tsx`). Domanda: che cosa fa il centro di massa
mentre due carrelli si urtano? Il carrello 1 va a 2 m/s verso il carrello 2, fermo; cursori per le masse (da 0,5 a 4
kg), scelta tra urto elastico e completamente anelastico. Il punto nero del centro di massa lascia una tacca ogni
mezzo secondo: le tacche sono equidistanti prima e dopo l'urto. Il testo dopo la figura dà la risposta e lega $V$
dell'urto anelastico a $v_{cm}$. Guardata in chiaro dopo l'urto e in scuro da telefono con l'urto anelastico
selezionato.

## Esercizio guidato

L'esempio 5 (camminare su una barca). Si fermerebbe in tre punti: (1) "Il centro di massa del sistema si sposta?"
(no: sistema fermo, forze esterne bilanciate); (2) "Se la barca arretra di $d$, di quanto avanza la ragazza rispetto
all'acqua?" ($3{,}0\,\text{m} - d$); (3) "Scrivi l'equazione che tiene fermo il centro di massa" ($m(3{,}0 - d) = M d$).

## Esercizi

Generatore `fis-centro-massa`, cinque livelli (specifica in `specs/exercises/fis-centro-massa.md`): Il centro di massa
di due corpi, Tre corpi su una retta, Tre corpi nel piano, La velocità del centro di massa, Camminare su una barca.
Scena `vettori-piano` al livello 3 (solo i tre punti). Senza esercizio: l'esempio 2 (Terra-Luna, notazione
scientifica) e l'esempio 6 (il fuoco d'artificio).

## Da verificare

- Massa della Luna $7{,}35 \cdot 10^{22}$ kg e distanza media Terra-Luna $3{,}84 \cdot 10^8$ m: valori correnti dei libri,
  non nel README (massa e raggio della Terra sono quelli del README).
- "In fisica delle particelle gli urti si studiano quasi sempre nel sistema del centro di massa": affermazione
  generale, scritta a memoria.
- Barca di $120$ kg: plausibile, a memoria.

## Domande per Andrea

- Il teorema del centro di massa con $\vec a_{cm}$ è al livello del terzo anno, o basta "se il sistema è isolato
  $\vec v_{cm}$ è costante"?
- L'esempio 6 del fuoco d'artificio usa il fatto che il punto più alto è a metà della gittata (lezione 76 del gruppo
  30). Va bene darlo per noto con il link?
- Vuoi che la lezione dica di più sul sistema del centro di massa (per esempio che lì un urto elastico inverte
  soltanto le velocità), o resta nominato e basta come da brief?
- Il centro di massa dei corpi estesi con un foro o a forma di L (per differenza o per pezzi) è negli esercizi dei
  libri: lo aggiungo, o è troppo per questa lezione?

Prerequisiti proposti: fis-conservazione-quantita-moto, fis-quantita-moto-def, fis-baricentro, fis-urti-elastici
