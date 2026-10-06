# Note: La conservazione del momento angolare

Lezione nuova (lotto del terzo anno, gruppo 35, 6 ottobre 2026). Conti rifatti in Python:

- pattinatrice: $3{,}6 / 1{,}2 \cdot 1{,}5 = 4{,}5$ giri/s; $\omega_1 = 9{,}425$ e $\omega_2 = 28{,}274$ rad/s; $K_1 = 159{,}9$ J,
  $K_2 = 479{,}7$ J; con l'energia conservata verrebbe $1{,}5\sqrt3 = 2{,}60$ giri/s;
- piattaforma dell'interattiva: $I = 1{,}0 + 2 \cdot 2{,}0 \cdot r^2$: $5{,}0$ e $2{,}0$ kg·m² a $1{,}0$ e $0{,}5$ m; $\omega = 2{,}0$
  e $5{,}0$ rad/s; $K = 10$ e $25$ J;
- dischi: $0{,}040 \cdot 3{,}5 / 0{,}056 = 2{,}5$ rad/s; $K_i = 0{,}245$ J, $K_f = 0{,}175$ J, persi $0{,}070$ J ($28{,}6\%$);
- giostra: $I = \tfrac12 \cdot 120 \cdot 1{,}5^2 = 135$, $L = 25 \cdot 4{,}0 \cdot 1{,}5 = 150$, $m r^2 = 56{,}25$,
  $\omega = 150 / 191{,}25 = 0{,}784$ rad/s (periodo $8{,}0$ s); senza $m r^2$: $1{,}11$ rad/s ($+42\%$);
- Terra: $30{,}3 \cdot 1{,}47 / 1{,}52 = 29{,}30$ km/s.

`check.mts`: 0 errori, 0 avvisi.

## Confini e scelte

- La legge è ricavata da $M = \Delta L/\Delta t$ della lezione 90, con tre precisazioni (forze interne, momento nullo e
  non forza nulla, vettore). Che i momenti delle forze interne si cancellino a coppie è detto, non dimostrato.
- Tre famiglie di problemi: il corpo che cambia forma ($I_1\omega_1 = I_2\omega_2$), due corpi che si uniscono (dischi
  coassiali, bambino sulla giostra), la forza centrale e le orbite.
- L'energia cinetica che non si conserva ha una sottosezione sua con l'esempio 2 e un avviso, perché è l'errore più
  comune negli esercizi.
- Orbite: solo perielio e afelio, con $v_p r_p = v_a r_a$. La seconda legge di Keplero è nominata e linkata alla 93,
  senza la velocità areolare, come chiede il brief. La forza di gravità è linkata alla 94.
- Il bambino sulla giostra usa il momento angolare di una particella in moto rettilineo ($m\,v\,b$) della 90.
- L'ultima sezione (direzione che si conserva: giroscopio, frisbee, asse terrestre) è qualitativa e breve. La nota
  sull'elicottero è una precisazione che si può saltare.
- Non ci sono: la precessione, la persona che cammina su una piattaforma (rinculo rotazionale), il gatto che cade.

## Figure

Quattro TikZ, guardate in chiaro e in scuro: `pattinatrice-braccia-aperte-chiuse`, `dischi-coassiali-prima-dopo`,
`giostra-bambino-salto-tangente`, `orbita-perielio-afelio-velocita` (semiasse 2,5 cm, Sole a 1 cm dal centro:
$r_p = 1{,}5$ e $r_a = 3{,}5$ cm, frecce di 1,75 e 0,75 cm, in proporzione inversa; l'eccentricità è esagerata e il testo
alternativo lo dice).

Interattiva (registrata sotto il commento del gruppo 35):

- `momento-angolare-masse-piattaforma` (`fisica/PiattaformaMasse.tsx`). Domanda: che cosa succede a velocità angolare,
  momento angolare ed energia cinetica quando due masse su una piattaforma che gira passano da 1,0 m a 0,5 m dall'asse?
  Piattaforma con $I = 1{,}0$ kg·m², due masse da 2,0 kg, distanza da 0,2 a 1,0 m, $L = 10$ kg·m²/s fisso. La freccia curva è
  lunga $15^\circ$ per ogni rad/s.

## Esercizio guidato

L'esempio 4 (il bambino sulla giostra): si fermerebbe sul momento angolare del bambino prima del salto (perché una
particella che corre dritta ne ha uno, e qual è il braccio), sul momento d'inerzia dopo il salto (la domanda che scopre
chi dimentica $m r^2$) e sulla velocità angolare.

## Esercizi

Generatore `fis-conservazione-momento-angolare`, sei livelli (specifica in
`specs/exercises/fis-conservazione-momento-angolare.md`): Un corpo che cambia forma, Due masse che si avvicinano
all'asse, Un disco cade su un altro, Un salto sulla giostra, Dal perielio all'afelio, L'energia cinetica dopo il cambio di
forma. Scena nuova `orbita-ellisse` (`scenes/OrbitaEllisse.tsx`) al livello 5. Restano senza esercizio l'energia persa
quando due dischi si uniscono e le domande qualitative sulla direzione di $\vec L$.

## Domande per Andrea

- Momenti d'inerzia di una pattinatrice ($3{,}6$ e $1{,}2$ kg·m²): sono ordini di grandezza credibili per un libro?
- La seconda legge di Keplero va solo nominata qui, come ho fatto, o si può già dire che la velocità areolare è
  $L/(2m)$? L'ho lasciata alla 93.
- Il giroscopio e l'asse terrestre in una sezione qualitativa: bastano, o si toglie tutto e si resta sui problemi?
- L'elicottero come esempio di conservazione: è una semplificazione accettabile?

## Da verificare

- Terra: perielio $1{,}47 \cdot 10^{11}$ m a inizio gennaio con $30{,}3$ km/s, afelio $1{,}52 \cdot 10^{11}$ m a inizio luglio
  con $29{,}3$ km/s (valori a memoria).
- "L'asse della Terra resta puntato verso la stessa regione del cielo, vicino alla Stella Polare": vero nell'arco di
  un anno; la precessione degli equinozi (circa 26 000 anni) non è nominata.
- Keplero ha trovato la seconda legge dalle osservazioni (di Tycho Brahe) prima della spiegazione di Newton: date nella
  lezione 93.
- Giostra da parco: disco pieno di 120 kg e raggio 1,5 m (plausibile, a memoria).

Prerequisiti proposti: fis-momento-angolare-def, fis-momento-inerzia, fis-energia-rotazionale, fis-conservazione-quantita-moto
