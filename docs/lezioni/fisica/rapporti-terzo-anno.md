# Rapporti dei gruppi, terzo anno di fisica (6 ottobre 2026)

I rapporti finali dei 15 gruppi che hanno scritto le lezioni 71-119, uno dopo l'altro e senza modifiche: scelte, domande per Andrea, cose da verificare, figure interattive, pezzi del kit che mancano, limiti. Il brief è in `brief-terzo-anno.md`.

---

## Rapporto del gruppo 30: lezioni 71, 76, 77

Tre lezioni complete (lezione, nota, formulario, flashcard, figure TikZ, figure interattive, specifica, generatore,
controllo Python). Niente pubblicato, niente commit.

### Scelte

71, prodotto scalare e vettoriale:

- Il momento di una forza compare solo nell'esempio 5, come il numero $M = F\,b$ del primo anno, con i link alle
  lezioni 88 e 90. Momento torcente come vettore e momento angolare non sono trattati.
- Niente versori: le formule con le componenti si ricavano dai vettori componenti e dalla proprietà distributiva,
  enunciata senza dimostrazione.
- Regola della mano destra nella forma "le dita si chiudono da $\vec a$ verso $\vec b$, il pollice dà il verso"; la
  forma del palmo è in un riquadro `ad-note`.
- Coseno e seno di un angolo ottuso con $\cos(180^\circ - \alpha) = -\cos\alpha$ e $\sin(180^\circ - \alpha) = \sin\alpha$,
  più la calcolatrice. Terna: $x$ a destra, $y$ in alto, $z$ uscente.
- Componenti scritte con il punto e virgola, $(4;\ 3)$. Vettori senza unità negli esempi 4, 6 e 7.

76, lancio obliquo:

- Simboli del README. La gittata è $L$ (nella 56 del biennio era $x_G$). In più il tempo di salita $t_s$.
- L'angolo di $45^\circ$ è dimostrato senza goniometria, con $2\,v_{0x}v_{0y} = v_0^2 - (v_{0x} - v_{0y})^2$; la forma
  con $\sin 2\alpha$ arriva dopo, come scrittura equivalente.
- Lancio da una quota: origine ai piedi della verticale, $y = h + v_{0y}t - \tfrac12 g t^2$, formula risolta del tempo
  di volo. Il lancio verso il basso è una riga.
- La velocità all'arrivo da una quota si trova con le componenti e si ritrova con la conservazione dell'energia.

77, lavoro di una forza variabile:

- Confine con la 59 del biennio (che ha già rettangolo, triangolo della molla e trapezio per il lavoro della mano):
  qui i piccoli tratti $F\,\Delta x$, i grafici qualunque, le aree negative, la forza media, il conteggio dei quadretti,
  il lavoro della forza elastica con il segno.
- Confine con la 78: la lezione dice che $W_{el}$ dipende solo dalle deformazioni iniziale e finale e rimanda; non usa
  $W = -\Delta U$ e non nomina le forze conservative. Confine con la 79: nessun attrito.
- $F$ sul grafico è la componente lungo il moto, con il segno. $F = -k\,x$, $W_{el} = \tfrac12 k x_1^2 - \tfrac12 k x_2^2$.
- I rettangoli sono alti quanto la forza all'inizio del tratto, così con pochi tratti l'errore si vede.
- La parola "integrale" non compare.

### Domande per Andrea

71:

- Quale forma della regola della mano destra va per prima: dita che si chiudono, palmo, o tre dita?
- Le componenti nello spazio sono al livello del terzo anno, o basta $c_z$ nel piano?
- $(4;\ 3)$ o $(4, 3)$ per le componenti?

76:

- $L$ qui e $x_G$ nella 56: lasciamo i due simboli o uniformiamo il biennio?
- La dimostrazione dei $45^\circ$ con il quadrato del binomio resta, o basta $\sin 2\alpha$?
- Nel lancio da una quota va data la formula risolta di $t_v$, o lo studente risolve ogni volta l'equazione?

77:

- Metà lezione è sui grafici qualunque e metà sulla molla: è l'equilibrio giusto?
- Il conteggio dei quadretti (esempio 3) si fa ancora in classe?
- La forza media qui è $W/\Delta x$; la 81 ha la forza media dall'impulso, sul tempo. Serve una frase che le distingua?

### Da verificare

- 71: la regola della mano destra nella forma dell'Amaldi, scritta a memoria nel riquadro.
- 76: barriera a $9{,}15$ m e traversa a $2{,}44$ m (regolamento del calcio, a memoria); altezza della barriera $1{,}9$ m
  (stima); "da una quota l'angolo migliore è un po' meno di $45^\circ$", enunciato.
- 77: la curva della fionda, $F = 32\,\text{N} \cdot [1 - (1 - x/40\,\text{cm})^2]$, è un modello scelto per avere un conto
  esatto; i 34 quadretti interi e i 14 attraversati sono contati con uno script, da ricontare a occhio sulla figura.

### Figure interattive

| Nome | Lezione | Domanda | Come è stata guardata |
|---|---|---|---|
| `prodotto-scalare-proiezione-segno` | 71 | Che cosa succede al prodotto scalare quando l'angolo supera $90^\circ$? | chiaro da computer; scuro da telefono con $\vec b$ spostato con la tastiera fino a un angolo ottuso |
| `prodotto-vettoriale-area-verso` | 71 | Quando il prodotto vettoriale esce dal foglio e quando entra, e quanto è grande? | chiaro da computer e da telefono; scuro da telefono con rotazione oraria ($\otimes$) |
| `lancio-obliquo-angolo-gittata` | 76 | Che cosa succede alla gittata se l'angolo passa da $30^\circ$ a $60^\circ$? | chiaro da computer dopo due lanci (30° e 60°); scuro da telefono in volo a 75° e 14 m/s, gli estremi dei cursori |
| `lavoro-area-rettangoli-tratti` | 77 | In quanti tratti va diviso lo spostamento perché i rettangoli diano l'area? | chiaro da computer (molla, 4 tratti); scuro da telefono (fionda, 40 tratti) |

Non guardati: gli estremi bassi dei cursori del lancio (15°, 7 m/s), il caso dei vettori paralleli nel prodotto
vettoriale, un solo tratto nella figura dei rettangoli.

Scene degli esercizi: `lancio-obliquo` (da terra, con la gittata data, da una quota con la traiettoria della
soluzione, angolo di 20°; chiaro, scuro, telefono), `grafico-forza-spostamento` (sopra l'asse, retta che attraversa
l'asse con le aree, gradino; chiaro, scuro, telefono), `vettori-piano` con i dati del livello 5 della 71 (angolo
ottuso, telefono).

### Pezzi del kit che mancano

- Un grafico con assi numerati: l'ho ridisegnato in `LavoroRettangoli.tsx` e in `GraficoForzaSpostamento.tsx`, che è
  quasi una copia di `GraficoVelocitaTempo.tsx` con altri nomi sugli assi. Una scena sola con i nomi degli assi nei dati
  le sostituirebbe tutte e due.
- I simboli $\odot$ e $\otimes$: disegnati a mano in `ProdottoVettoriale.tsx`. Serviranno al quarto anno.
- Una freccia curva per il verso di rotazione (in `leve.tsx` c'è per le aste; qui serviva tra due vettori).

### Limiti

- La pagina `prova-grafico/lezione` a 390 px: nessun errore di KaTeX, nessuna immagine mancante, nessuno scorrimento
  laterale per le tre lezioni. In quella pagina però i riquadri delle figure interattive restano vuoti, anche per la
  lezione 56 già pubblicata: le interattive le ho guardate solo da `prova-fisica`, non dentro la lezione.
- `npx tsc` non lanciato (indicazione della ripresa). `eslint` pulito sui nove file TypeScript.
- Durante il lavoro il sito sulla 3111 è caduto; i controlli finali sono sulla 3131.
- Una registrazione di chimica in `interactive.ts` (`chimica/FormuleLewisCostruisci`, file non ancora esistente) ha
  bloccato per qualche minuto il sito: non è un mio file, l'ho solo incontrato.
- Esempi rimasti senza esercizio. 71: la mano destra su un disegno senza numeri, il controllo di perpendicolarità.
  76: l'equazione della traiettoria (punizione), la velocità in un istante, la velocità all'arrivo da una quota.
  77: il conteggio dei quadretti.
- Errori piantati: bocciati tutti, tranne 6 casi su 228 in cui la cifra cambiata non sposta la risposta arrotondata
  (dettagli nelle specifiche).
- Tra i distrattori di riserva possono comparire valori con lo zero ambiguo ($70\,\text{J}$); la risposta giusta mai
  nei generatori 71 e 77. Nel 76 la risposta giusta può essere un numero come $20\,\text{m}$: `r2` del modulo comune non
  lo scarta, come nel generatore della lezione 56.
- La scena della soluzione del lancio da una quota ha l'etichetta dell'angolo vicina alla traiettoria tratteggiata.
- Livelli 1 e 2 della 71 sono vicini al livello 2 del generatore `lavoro` del biennio.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto il commento del gruppo 30:

```ts
'prodotto-scalare-proiezione-segno': () => import('@/components/content/interactive/fisica/ProdottoScalare'),
'prodotto-vettoriale-area-verso': () => import('@/components/content/interactive/fisica/ProdottoVettoriale'),
'lancio-obliquo-angolo-gittata': () => import('@/components/content/interactive/fisica/LancioObliquo'),
'lavoro-area-rettangoli-tratti': () => import('@/components/content/interactive/fisica/LavoroRettangoli'),
```

`src/components/content/exercises/scenes/index.tsx`, due import dopo `LancioOrizzontale` e due righe sotto il commento
del gruppo 30:

```ts
import LancioObliquo from './LancioObliquo';
import GraficoForzaSpostamento from './GraficoForzaSpostamento';
'lancio-obliquo': LancioObliquo,
'grafico-forza-spostamento': GraficoForzaSpostamento,
```

Da collegare da chi coordina: i tre generatori in `index.ts` e `config.ts`, i nomi dei livelli in `level-names.ts`
(sono nel JSON).

---

## Rapporto del gruppo 31: lezioni 72-75 (sistemi di riferimento e forze apparenti)

Quattro lezioni complete: testo, nota, formulario, flashcard, figure TikZ, una figura interattiva ciascuna, generatore
con specifica e controllo Python. Niente pubblicato, niente commit.

### Scelte

- Confine 72/75: nella 72 tutti i conti si fanno dal sistema inerziale. La lezione ricava però già
  $\vec a\,' = -\vec A$ per un corpo libero, dalle leggi orarie dell'autobus e del pallone; la forza apparente è
  nominata una volta con il link. Nella 75 si ricava $\vec a = \vec a\,' + \vec A$, si definisce
  $\vec F_{app} = -m\,\vec A$ e si rifanno gli stessi problemi da bordo. Il pendolo ha gli stessi numeri nelle due
  lezioni, apposta.
- Confine 73/74: nella 73 posizione, tempo, invarianza di lunghezze e durate, velocità; nella 74 l'accelerazione, le
  forze, i tre principi, l'enunciato, relative e invarianti.
- Con il biennio: la 50 ha già l'autobus e la definizione di sistema inerziale (si riparte da lì con il link); la 46 ha
  la barca (richiamata in due righe, gli esempi sono altri); la 53 ha la bilancia in ascensore (qui la pallina che cade
  e il pacco sul pavimento); la 57 ha la centripeta (la moneta sul giradischi è il conto dell'auto in curva visto da
  chi ruota).
- Simboli: $S$, $S'$, $\vec V$, $\vec A$, $\vec F_{app}$ come nel README. Nuovi: $F_{cf}$ per la forza centrifuga,
  perché nella 57 $F_c$ è la centripeta; $\vec s$ e $\vec s\,'$ per il vettore posizione; $\theta$ per il pendolo come
  nella 58.
- Le forze apparenti sono disegnate rosse e tratteggiate, e la 75 lo dichiara. È una convenzione nuova.
- Coriolis senza formula, come da brief: proprietà ricavate dalla palla sulla piattaforma, un conto fatto dal suolo,
  gli effetti sulla Terra, l'avviso sul lavandino.
- Il passo del "Dialogo" è parafrasato, non citato.
- Nessun link alle lezioni di relatività del quinto anno (vuote): il limite alle alte velocità è detto a parole.
- Generatori: un modulo comune nuovo, `src/lib/exercises/v2/fis-riferimenti.ts`, con `_fis_riferimenti.py`. Scarta i
  risultati con zero finale ambiguo e i distrattori a meno dell'8% dalla risposta. Nessuna scena nuova: la 73 usa
  `vettori-piano`, che c'era.

### Domande per Andrea

72
- Va bene ricavare $\vec a\,' = -\vec A$ già qui, o la 72 deve restare qualitativa?
- Il pendolo risolto due volte (72 dal suolo, 75 da bordo): ripetizione voluta, la tieni?
- "Corpo libero" per "corpo con forza totale nulla": è il termine che usi?

73
- L'ipotesi $t' = t$ detta in chiaro come ipotesi: la dici al terzo anno?
- "Velocità assoluta, relativa, di trascinamento" sono solo citati: li vuoi come nomi principali?
- L'esempio per componenti con una componente negativa è al livello giusto?

74
- "Le forze non cambiano" è motivato con esempi, non dimostrato: basta?
- L'esempio su lavoro ed energia cinetica nei due sistemi: lo tieni?
- Il paragrafo finale su Einstein resta qui o va tutto al quinto anno?

75
- $F_{cf}$ come simbolo della centrifuga: va bene?
- Forze apparenti tratteggiate: convenzione per tutto il capitolo?
- Coriolis senza formula: vuoi almeno $2\,m\,\omega\,v'$ in un riquadro?
- La deviazione verso est dei gravi (Guglielmini) non c'è: la vuoi tra gli effetti?

### Da verificare

- Costanti dal README: $R_T = 6{,}37 \cdot 10^6$ m, distanza Terra-Sole $1{,}50 \cdot 10^{11}$ m. Giorno di 24 h
  ($\omega = 7{,}27 \cdot 10^{-5}$ rad/s; con il giorno siderale cambia la terza cifra), anno di 365 giorni.
- Risultati che ne dipendono: $0{,}034$ m/s² all'equatore, $5{,}9 \cdot 10^{-3}$ m/s² per l'orbita, $2{,}99 \cdot 10^4$ m/s
  di velocità orbitale, $2{,}4$ N di centrifuga su 70 kg.
- Galileo: "Dialogo sopra i due massimi sistemi del mondo", 1632, Giornata seconda, Salviati; il contenuto della
  stanza sotto coperta. L'obiezione della torre, senza un nome.
- Einstein 1905. Coriolis: Gaspard-Gustave de Coriolis, 1835, "ingegnere francese".
- Foucault: 1851, Panthéon, filo di 67 m, circa $11^\circ$ all'ora, verso orario.
- Alisei da nord-est e da sud-est; circuiti oceanici orari a nord e antiorari a sud; cicloni antiorari a nord.
- "Migliaia di volte più piccola" per il lavandino: ordine di grandezza a memoria.
- Valori inventati ma plausibili: pioggia a $8{,}0$ m/s, camion di 16 m, $\mu_s = 0{,}35$ e $0{,}40$, giradischi a 33
  giri, aereo a 900 km/h.

### Figure interattive

| Nome | Lezione | Domanda | File |
|---|---|---|---|
| `autobus-frena-due-osservatori` | 72 | Che cosa fa il pallone per chi sta sulla strada e per chi sta a bordo? | `fisica/AutobusFrena.tsx` |
| `trasformazioni-galileo-vagone` | 73 | Come deve camminare il passeggero perché dalla banchina lo si veda fermo? | `fisica/VagoneGalileo.tsx` |
| `nave-galileo-sasso` | 74 | Se la nave va più veloce, il sasso cade più indietro? | `fisica/NaveGalileo.tsx` |
| `giostra-coriolis-palla` | 75 | Vista dalla piattaforma, da che parte curva la palla, e se gira nell'altro verso? | `fisica/GiostraCoriolis.tsx` |

Guardate sul sito di sviluppo (porta 3111 finché c'era, poi 3131) con uno script mio nello scratchpad
(`gruppo-31/shot.mjs`: come `anteprima-interattivo.mjs`, ma senza aspettare la rete ferma, che con il ricaricamento
continuo non arrivava mai). Ognuna in chiaro, in scuro e da telefono, ai valori iniziali, agli estremi dei cursori, nei
due punti di vista e dopo aver premuto il bottone. Due difetti trovati e corretti: l'etichetta "bambino" tagliata
nella giostra, la didascalia "parabola larga 0 m" con la nave ferma. Le 18 figure TikZ guardate in chiaro e in scuro.

### Pezzi del kit che mancano

- Un veicolo visto di lato (autobus, vagone, con ruote e finestrini): l'ho disegnato a mano in tre figure, con `Pulley`
  per le ruote.
- Una quota con le due punte e l'etichetta (la linea di misura): rifatta in `VagoneGalileo.tsx` con due `Arrow`.
- Una piattaforma rotante vista dall'alto, con raggi e verso di rotazione.
- `Vector` non sa mettere bene il nome quando la freccia punta a sinistra (lo ho spostato a mano con `labelAt`).
- `NamedVec` di `vettori-piano`: il nome "v′" con l'apice passa come testo; non ho potuto guardare la scena (vedi
  Limiti).

### Limiti

- Le scene `vettori-piano` dei livelli 4 e 5 della 73 non le ho guardate sul sito: il controllo Python ne verifica i
  dati (i due vettori, la somma solo nella soluzione), ma non l'aspetto, e in particolare come esce il nome "v′".
- Le pagine intere a 390 px: aperte tutte e quattro, nessun errore di KaTeX, nessuna immagine mancante, nessuno
  scorrimento laterale. Il controllo è sul DOM; lo scorrimento della pagina nello script non ha funzionato (il
  contenitore che scorre non è la finestra), quindi non ho uno screenshot della pagina intera.
- `npx tsc` sull'intero progetto non lanciato, come da istruzioni di ripresa. Fatto solo un controllo dei tipi sui
  miei nove file con un tsconfig nello scratchpad: pulito.
- Avvisi di `check.mts` rimasti: otto, tutti "titolo con maiuscole all'inglese" per un nome proprio (Galileo, Terra,
  Coriolis).
- Esempi senza esercizio: 72 esempio 5 (accelerazioni della Terra); 73 invarianza delle lunghezze; 74 esempio 4
  (velocità orbitale); 75 esempi 2 (è il livello 4 del generatore della 72), 7 e 8.
- La 72, la 74 e la 75 non hanno una scena negli esercizi. Il pendolo avrebbe una geometria, ma con l'angolo in scala
  la scena darebbe la risposta nel caso in cui si chiede l'angolo.
- La 74 ha due sole figure TikZ (il minimo): l'esempio 3 non si disegna in scala.
- La 75 ha una figura interattiva per Coriolis e nessuna per la centrifuga (c'è il grafico statico $F_{cf}(\omega)$ con
  `% poi-interattivo`).
- Nel tema scuro il blu delle velocità diventa quasi bianco: è l'inversione del sito, non l'ho toccata.
- La figura del vagone parte da valori che non sono quelli di un esempio (i treni della lezione vanno a 25 m/s e nella
  figura non starebbero).

### File condivisi toccati

Solo `src/lib/utils/interactive.ts`, quattro righe sotto il commento del gruppo 31:

```ts
	// Physics, third year: frames of reference (group 31).
	'autobus-frena-due-osservatori': () => import('@/components/content/interactive/fisica/AutobusFrena'),
	'trasformazioni-galileo-vagone': () => import('@/components/content/interactive/fisica/VagoneGalileo'),
	'nave-galileo-sasso': () => import('@/components/content/interactive/fisica/NaveGalileo'),
	'giostra-coriolis-palla': () => import('@/components/content/interactive/fisica/GiostraCoriolis'),
```

`src/components/content/exercises/scenes/index.tsx` non è stato toccato: nessuna scena nuova.

### Per il collegamento dei generatori

Id uguali agli slug: `fis-sistemi-non-inerziali` (livelli 1-5), `fis-trasformazioni-galileo` (1-6),
`fis-principio-relativita-galileo` (1-6), `fis-forze-apparenti` (1-7). Controlli: `verify.py` PASS con i seed 1, 50001
e 777001 (1000 campioni per livello), 284 errori piantati tutti bocciati, `review.mts` e `width.mts` a 0, `eslint`
pulito.

---

## Rapporto del gruppo 32: lezioni 78-81

Lezioni 78 (fis-forze-conservative-energia), 79 (fis-bilancio-energia), 80 (fis-quantita-moto-def), 81 (fis-impulso). Per
ognuna: lezione, nota, formulario, flashcard, figure TikZ, figure interattive registrate, specifica, generatore e
controllo Python. Niente pubblicato, niente commit.

### Scelte

- 78 e biennio: il lavoro del peso lungo cammini diversi e le due energie potenziali sono della 62, richiamati con il link. La 78 dà la definizione di forza conservativa, il cammino chiuso, $W = -\Delta U$ per una forza conservativa qualunque e la lettura del grafico di $U$: $K = E - U$, punti di inversione, $F_x = -\Delta U/\Delta x$, equilibrio stabile e instabile.
- 78 e 77: il lavoro della molla tra due deformazioni si prende dalla 77 con il link.
- 79 e 64: la 64 ha $\Delta E = W_{attrito}$ su un tratto e il rendimento; la 79 ha $W_{nc} = \Delta E$ con le forze che aggiungono energia (fune, motore) e i problemi a più tratti, con il bilancio scritto una volta sola tra stato iniziale e finale.
- 80 e 81: nella 80 la definizione, $K = p^2/(2m)$, la variazione, il sistema e $\vec F_{tot} = \Delta\vec p/\Delta t$ con la forza media in una riga; nella 81 l'impulso, il teorema dimostrato da $\vec F = m\,\vec a$, le forze impulsive, lo stesso impulso in tempi diversi, l'area sotto il grafico forza-tempo, il peso nel teorema, il confronto con il lavoro.
- 80, 81 e 82: la conservazione è solo annunciata in fondo alle due lezioni, con il link.
- Simboli del README: $W_{nc}$, $\vec p$, $\vec p_{tot}$, $\vec I$ con la freccia o $I_x$; componenti $v_{ix}$, $v_{fx}$; $F_m$ per la forza media, $F_s$ per la forza del suolo.
- Le formule in evidenza più lunghe sono spezzate su più righe con `aligned`, per il telefono.

### Domande per Andrea

78:
- La forza come opposto della pendenza del grafico di $U$ è al livello del terzo anno, prima delle derivate?
- Equilibrio stabile e instabile sul grafico: qui o al quarto anno?
- Il viceversa del cammino chiuso va argomentato in tre righe o solo enunciato?

79:
- $W_{nc}$ è il simbolo giusto?
- Il tuffatore con la "forza media dell'acqua" (resistenza e spinta di Archimede insieme) va bene?

80:
- $\vec F = \Delta\vec p/\Delta t$ sta nella 80, come dice l'albero, o tutto nella 81?
- $K = p^2/(2m)$ è nei libri del terzo anno?

81:
- $\vec I$ per l'impulso, con $I$ che nel capitolo dopo è il momento d'inerzia: basta la freccia a distinguerli?
- Negli esercizi i tempi d'urto sono decine di millisecondi per tenere le forze sotto i 100 N: meglio tempi realistici e forze in kilonewton?

### Da verificare

- Masse: palla da tennis 58 g, pallone 0,43 kg, palla da bowling 6,0 kg (a memoria).
- Servizio di un tennista intorno a 250 km/h (a memoria).
- Newton enunciò il secondo principio con la variazione della quantità di moto, nei Principia del 1687 (a memoria).
- Tempi d'urto: racchetta 4,0 ms, cruscotto 0,010 s, airbag 0,15 s; calcio con picco di 600 N in 0,020 s (ordini di grandezza, a memoria).
- Piattaforma dei tuffi a 10 m, arresto a 3,0 m di profondità; $\mu_d = 0{,}12$ per una slitta sulla neve (valori di comodo).
- I percorsi nel database scritti nelle specifiche (`high_school/physics/fis-forze-conservative/...`, `.../fis-quantita-moto/...`) sono ricavati dall'albero, non controllati sul database.

### Figure interattive

| Nome | Lezione | Domanda | File |
|---|---|---|---|
| `lavoro-due-cammini-peso-attrito` | 78 | Che cosa cambia nel lavoro del peso e dell'attrito se allunghi il cammino? | `fisica/LavoroDueCammini.tsx` |
| `grafico-energia-potenziale-buca` | 78 | Da dove deve partire il corpo per superare la collina di 8 J? | `fisica/GraficoEnergiaPotenziale.tsx` |
| `rampa-liscia-pavimento-attrito` | 79 | Dove si ferma il blocco se raddoppi altezza, attrito o massa? | `fisica/RampaPavimentoAttrito.tsx` |
| `quantita-moto-due-carrelli` | 80 | Quando è zero la quantità di moto totale di due carrelli in moto? | `fisica/QuantitaMotoCarrelli.tsx` |
| `impulso-tempo-arresto-forza` | 81 | Che cosa succede alla forza media se l'arresto dura dieci volte di più? | `fisica/ImpulsoTempoArresto.tsx` |

Tutte guardate sul sito di sviluppo in chiaro, in scuro e a 390 px, ai valori iniziali e agli estremi dei cursori, e
dopo i bottoni (cammino trascinato sopra $A$ e sotto $B$; partenza a 0, 0,8, 1 e 2 m con il corpo lasciato andare;
rampa con altezza, attrito e massa minimi e massimi fino all'arresto; carrelli con tutti i cursori agli estremi e fermi;
arresto in 0,02, 0,05, 0,15 e 0,30 s). Nessun errore in console nelle ultime prove, nessuno scorrimento laterale. Dopo
l'ultima correzione a `ImpulsoTempoArresto.tsx` (cornice allargata per l'unità dell'asse) la figura è stata riguardata
a 390 px.

Le quattro lezioni intere sono state aperte a 390 px su `/prova-grafico/lezione`: nessun errore di KaTeX, nessuna
immagine mancante, nessuno scorrimento laterale della pagina, figure interattive montate.

### Pezzi del kit che mancano

- Assi con le tacche numerate: ridisegnati a mano in `GraficoEnergiaPotenziale.tsx`, `ImpulsoTempoArresto.tsx`, `RampaPavimentoAttrito.tsx` e nella scena `GraficoSpezzata.tsx`, come già in `GraficoDati.tsx`.
- Un carrello con le ruote: disegnato dentro `QuantitaMotoCarrelli.tsx`.
- Le barre dell'energia sono in `fisica/energia.tsx` del gruppo 18: usate così come sono.
- Un formato dei numeri con decimali fissi ("7,0", non "7"): `num` e `texNum` del kit tolgono gli zeri finali, quindi ogni figura ha due funzioni sue (`fx`, `tex`).

### Limiti

- Esempi senza esercizio: 78, i punti di inversione dell'esempio 4 e l'equilibrio; 79, nessuno; 80, $K = p^2/(2m)$ e l'angolo di $\vec p_{tot}$; 81, il confronto tra due tempi di arresto (esempio 3) come domanda a sé.
- Le specifiche hanno un esempio svolto per livello nei primi livelli e la sola descrizione negli altri, non due esempi per ogni livello.
- Errori piantati nelle scene: una parte passa (da 57 su 80 a 101 su 120 bocciati secondo il generatore), perché tocca numeri di solo disegno: quadretti e etichette degli assi, scala delle frecce. I numeri che portano i dati sono controllati.
- `fis-forze-conservative-energia` livello 2 ha circa 320 esercizi diversi su 1.000, `fis-impulso` livello 5 circa 520.
- `npx tsc` non lanciato, come da istruzioni di ripresa: i miei file sono passati solo da `eslint` (pulito) e dall'esecuzione (jiti per i generatori, il sito per figure e scena).
- Sul telefono restano formule in evidenza più larghe della colonna (fino a circa 580 px su 312 dentro i riquadri degli esempi): scorrono dentro il loro riquadro, come nelle lezioni del biennio; ho spezzato le sette più lunghe.
- La scena `grafico-spezzata` disegna sempre tutto il foglio (12 quadretti di tempo negli esercizi dell'impulso), anche quando il grafico ne occupa pochi.
- Le figure TikZ sono state guardate con `anteprima.mjs` in chiaro e in scuro; le tre ritoccate dopo (due etichette nella 80, l'etichetta del peso nella 81) sono state riguardate solo in chiaro.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: conservative forces, momentum, impulse (group 32).`:

```ts
	'lavoro-due-cammini-peso-attrito': () => import('@/components/content/interactive/fisica/LavoroDueCammini'),
	'grafico-energia-potenziale-buca': () => import('@/components/content/interactive/fisica/GraficoEnergiaPotenziale'),
	'rampa-liscia-pavimento-attrito': () => import('@/components/content/interactive/fisica/RampaPavimentoAttrito'),
	'quantita-moto-due-carrelli': () => import('@/components/content/interactive/fisica/QuantitaMotoCarrelli'),
	'impulso-tempo-arresto-forza': () => import('@/components/content/interactive/fisica/ImpulsoTempoArresto'),
```

`src/components/content/exercises/scenes/index.tsx`: una riga di import dopo quella di `PianoCartesiano`, e una riga
sotto il commento del gruppo 32:

```ts
import GraficoSpezzata from './GraficoSpezzata';
	'grafico-spezzata': GraficoSpezzata,
```

File nuovi miei fuori dalle lezioni: `src/lib/exercises/v2/fis-quantita-moto.ts`,
`scripts/exercises/checkers/_fis_quantita_moto.py`, `src/components/content/exercises/scenes/GraficoSpezzata.tsx`.

---

## Rapporto del gruppo 33: lezioni 82-85 (6 ottobre 2026)

Lezioni 82 (La conservazione della quantità di moto), 83 (Gli urti anelastici), 84 (Gli urti elastici in una e in due
dimensioni) e 85 (Il centro di massa): per ognuna lezione, nota, formulario, flashcard, figure TikZ, figure
interattive registrate, specifica, generatore e controllo Python. Niente è stato pubblicato né committato.

### Scelte

Confini tra le quattro lezioni:

- 82: solo separazioni (spinta, sparo, lancio, esplosione), nessun urto. Definisce sistema, forze interne ed esterne,
  sistema isolato, ricava $\Delta\vec p_{tot} = \vec F_{est}\,\Delta t$ e la conservazione; chiude con l'energia
  cinetica che in un'esplosione aumenta, per preparare le due lezioni sugli urti.
- 83: è la prima sugli urti, quindi ha la tabella dei tre tipi (elastico, anelastico, completamente anelastico).
  Urto completamente anelastico lungo una retta e nel piano, energia dissipata con la frazione $m_2/(m_1 + m_2)$,
  urti anelastici con i corpi che si separano (una velocità finale data), pendolo balistico. Niente coefficiente di
  restituzione.
- 84: urto elastico centrale con la dimostrazione completa delle velocità finali, bersaglio fermo e tre casi
  particolari, urto nel piano per componenti, regola dei $90^\circ$ per masse uguali dimostrata con il triangolo
  delle velocità (senza il sistema del centro di massa), un esempio con masse diverse ("l'urto è stato elastico?").
- 85: posizione, velocità e moto del centro di massa ($\vec F_{est} = M\,\vec a_{cm}$ ricavato dalla 82), barca e
  fuoco d'artificio; il sistema del centro di massa è solo nominato in un `ad-note`.

Simboli decisi oltre il README: $\vec F_{21}$ è la forza che 2 esercita su 1 (come $F_{BA}$ nella lezione 52);
$\vec F_{est}$ risultante delle forze esterne; $E_d = K_i - K_f$ energia dissipata; nel pendolo balistico $m$ il
proiettile e $M$ il blocco; negli urti nel piano $\theta_1$ e $\theta_2$, angoli acuti presi da parti opposte della
direzione iniziale; $\vec a_{cm}$ e $M$ massa totale; nelle figure le quantità di moto sono frecce `blue` (la tabella
dei colori non ha una voce per $\vec p$) e il centro di massa è un punto nero con la scritta "cm".

"Sistema isolato" è definito come "risultante delle forze esterne nulla". Le masse grandi (vagoni, auto) sono in
notazione scientifica per evitare gli zeri ambigui.

### Domande per Andrea

Lezione 82:

- "Sistema isolato" come "risultante delle forze esterne nulla" va bene, o vuoi la distinzione tra sistema isolato
  e sistema non isolato con risultante nulla?
- La conservazione di una sola componente è enunciata senza esempio: aggiungo il carrello sotto la pioggia, o sta
  meglio nella 83?
- Negli esempi con il fucile preferisci un altro contesto?

Lezione 83:

- Va bene $E_d$ per l'energia dissipata, o preferisci $\Delta K$ negativa?
- Vuoi il coefficiente di restituzione, anche solo in un riquadro?
- La frazione dissipata $m_2/(m_1 + m_2)$ ricavata nel testo è da terzo anno o è un di più?

Lezione 84:

- La dimostrazione delle formule di $V_1$ e $V_2$ è nel testo per intero: la vuoi in un riquadro che si può saltare?
- Gli angoli $\theta_1$ e $\theta_2$ tutti e due positivi, da parti opposte: è la convenzione che usi?
- L'esempio 4 ha tre cifre significative (serve per confrontare $K_i$ e $K_f$): lo tengo?

Lezione 85:

- Il teorema del centro di massa con $\vec a_{cm}$ è al livello del terzo anno, o basta "$\vec v_{cm}$ costante nei
  sistemi isolati"?
- Aggiungo il centro di massa dei corpi con un foro o a forma di L, che i libri hanno negli esercizi?
- Il sistema del centro di massa resta solo nominato?

### Da verificare

- Notazione $v$ prima e $V$ dopo l'urto (README: "come l'Amaldi, da verificare"); i nomi "urto centrale" e "teorema
  del centro di massa"; che l'Amaldi dia la regola dei $90^\circ$ nel testo.
- 82: fucile di $4{,}0$ kg, proiettile di $12$ g a $6{,}0 \cdot 10^2$ m/s (valori plausibili, a memoria).
- 83: vagoni di $1{,}5 \cdot 10^4$ e $2{,}5 \cdot 10^4$ kg a $2{,}0$ m/s; rugbisti di $80$ e $120$ kg a $6{,}0$ e $3{,}0$
  m/s; pendolo balistico con proiettile di $10$ g, blocco di $2{,}0$ kg, salita di $12$ cm ($3{,}1 \cdot 10^2$ m/s);
  auto di $1{,}2 \cdot 10^3$ kg e furgone di $1{,}6 \cdot 10^3$ kg a $15$ m/s. Tutti plausibili, a memoria.
- 84: boccia da biliardo a $2{,}0$ m/s.
- 85: massa della Luna $7{,}35 \cdot 10^{22}$ kg e distanza media Terra-Luna $3{,}84 \cdot 10^8$ m (valori correnti dei
  libri, non nel README; massa e raggio della Terra sono quelli del README); la frase "in fisica delle particelle gli
  urti si studiano quasi sempre nel sistema del centro di massa"; barca di $120$ kg.

### Figure interattive

| Nome | Lezione | Domanda a cui risponde | Come l'ho guardata |
|---|---|---|---|
| `carrelli-molla-rinculo` (`CarrelliMollaRinculo.tsx`) | 82 | Se raddoppio la massa di un carrello, che cosa cambia nelle velocità e nelle quantità di moto? | chiaro ferma, scuro e telefono a fine corsa |
| `urto-anelastico-energia` (`UrtoAnelasticoEnergia.tsx`) | 83 | Che frazione dell'energia cinetica resta dopo un urto completamente anelastico, e da che cosa dipende? | chiaro ferma, scuro e telefono dopo l'urto |
| `urto-elastico-masse` (`UrtoElasticoMasse.tsx`) | 84 | In che verso riparte il primo carrello, al variare delle masse? | chiaro e scuro dopo l'urto, telefono ferma e dopo l'urto, estremi delle masse (4 e 0,5 kg, e viceversa) con il secondo carrello a 2 m/s |
| `biliardo-urto-angoli` (`BiliardoUrtoAngoli.tsx`) | 84 | Come cambiano le due direzioni se la bianca colpisce più o meno di striscio? | chiaro e scuro da telefono dopo il colpo, urto in pieno (0) e di striscio (0,95) |
| `centro-massa-urto-carrelli` (`CentroMassaUrto.tsx`) | 85 | Che cosa fa il centro di massa mentre due carrelli si urtano? | chiaro e telefono dopo l'urto elastico, scuro da telefono con l'urto anelastico scelto, estremi delle masse |

Tutte hanno i valori iniziali presi dal testo che le segue, un bottone che avvia e uno che riporta all'inizio, e con
il movimento ridotto saltano alla fine. Nessun blocco `grafico`: in queste lezioni non c'è una curva che cambia con un
parametro.

Gli estremi dei cursori li ho guardati con uno script mio nello scratchpad (`gruppo-33/estremi.mjs`, che scrive i
valori nei campi dei cursori): masse a 0,5 e 4 kg in tutte le figure con i carrelli, velocità minima e massima nella
83, colpo in pieno e di striscio nella 84. Le frecce restano dentro la cornice. In quegli scatti il riquadro dei cookie
copre i comandi, non il disegno. Dopo gli scatti ho fatto due ritocchi che non ho riguardato sul sito: nella 83 le
energie sotto i 10 J hanno due decimali (con il carrello più lento si leggeva "restano 0 J"), nella 84 la didascalia
usa il segno meno tipografico.

### Pezzi del kit che mancano

- Le barre dell'energia sono in `fisica/energia.tsx` del gruppo 18: le ho usate senza modificarle, ma starebbero meglio
  nel kit.
- Un carrello su rotaia con le ruote: i carrelli sono `Block`, come nelle figure del biennio.
- Una voce di colore per la quantità di moto in `QTY` (ho usato `INK.blue`, il vettore generico).
- L'etichetta di un angolo con il pedice ($\theta_1$): l'ho scritta con `VecLabel` e `bare`, che è pensato per i
  vettori.
- `anteprima-interattivo.mjs` non sa muovere un cursore prima dello screenshot: per guardare gli estremi serve uno
  script a parte.

### Esercizi

Quattro generatori, non collegati al sito. Modulo comune nuovo `src/lib/exercises/v2/fis-urti.ts` (arrotondamento che
scarta le decine intere, opzioni con il segno, opzioni in notazione scientifica, scena di due velocità
perpendicolari) con il controllo comune `scripts/exercises/checkers/_fis_urti.py`. Nessuna scena nuova: i livelli con
una geometria usano `vettori-piano`, che esiste già.

| Generatore | Livelli | Scena | Verifica |
|---|---|---|---|
| `fis-conservazione-quantita-moto` | 4 | `vettori-piano` al livello 4 | PASS con i seed 1, 50001 e 777001 (1000 per livello) |
| `fis-urti-anelastici` | 6 | `vettori-piano` al livello 6 | PASS con i seed 1, 50001 e 777001; livelli 3 e 5 rifatti sui tre seed dopo il filtro sulle decine, PASS |
| `fis-urti-elastici` | 5 | `vettori-piano` ai livelli 4 e 5 | PASS con i seed 1, 50001 e 777001 |
| `fis-centro-massa` | 5 | `vettori-piano` al livello 3 | PASS con i seed 1, 50001 e 777001 |

Per tutti e quattro: errori piantati apposta (opzione giusta spostata, testo dell'opzione giusta cambiato, un dato
del problema cambiato, una massa portata a $100$ kg) bocciati al 100% (3 campioni per livello, 4 errori ciascuno);
`review.mts` esce con 0 e la pagina è stata guardata; `width.mts` esce con 0; `npx eslint` pulito.

### Limiti

- Esempi rimasti senza esercizio: 82, l'angolo del terzo frammento (esempio 4); 83, la direzione dopo l'urto nel
  piano (esempio 6) e l'energia dissipata nell'urto frontale; 84, l'urto nel piano tra masse diverse (esempio 4) e
  $V_2$ nell'urto frontale con tutti e due i corpi in moto; 85, Terra-Luna (esempio 2) e il fuoco d'artificio
  (esempio 6).
- Nel livello 1 di `fis-centro-massa` un distrattore di scorta può essere più lungo dell'asta (per esempio
  $57\,\text{cm}$ su un'asta di $56\,\text{cm}$): è riconoscibile, ma poco elegante.
- Lezioni intere a 390 px (`/prova-grafico/lezione`, porta 3131): nessun errore di KaTeX, nessuna immagine mancante,
  nessuno scorrimento laterale, nessun errore in console. In quella pagina però le figure interattive non risultavano
  montate quando lo script ha contato (segnaposto presente, nessun `svg` dentro): non ho potuto stabilire se è il
  caricamento pigro sotto carico o il selettore dello script. Sulla pagina di prova delle figure si montano tutte.
- Le scene degli esercizi sono guardate in chiaro e in scuro da telefono (due velocità perpendicolari, colpo di
  striscio, tre punti) e con la soluzione; la pagina di prova stampa in console un avviso di React ("state update on
  a component that hasn't mounted yet") anche per `vettori-piano`, che non è un mio file.
- Il sito di sviluppo è passato dalla porta 3111 alla 3131 durante il lavoro: gli scatti delle 82 e 83 e i primi
  della 84 e 85 sono della 3111, gli altri della 3131.
- `check.mts`: nessun avviso rimasto.
- `npx tsc --noEmit -p .` lanciato una volta sola: uscita 0, nessun errore. Dopo quel controllo ho cambiato poche
  righe in `fis-urti.ts`, `fis-urti-anelastici.ts`, `UrtoAnelasticoEnergia.tsx` e `UrtoElasticoMasse.tsx` (eslint
  pulito, livelli toccati riverificati): il controllo dei tipi su queste ultime modifiche resta a chi coordina.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: collisions and centre of mass (group 33).`, cinque
righe:

```ts
	'carrelli-molla-rinculo': () => import('@/components/content/interactive/fisica/CarrelliMollaRinculo'),
	'urto-anelastico-energia': () => import('@/components/content/interactive/fisica/UrtoAnelasticoEnergia'),
	'urto-elastico-masse': () => import('@/components/content/interactive/fisica/UrtoElasticoMasse'),
	'biliardo-urto-angoli': () => import('@/components/content/interactive/fisica/BiliardoUrtoAngoli'),
	'centro-massa-urto-carrelli': () => import('@/components/content/interactive/fisica/CentroMassaUrto'),
```

`src/components/content/exercises/scenes/index.tsx`: non toccato (nessuna scena nuova).

### File creati

- `docs/lezioni/fisica/{riscritte,note,formulari,flashcard}/82-fis-conservazione-quantita-moto.md`, `83-fis-urti-anelastici.md`,
  `84-fis-urti-elastici.md`, `85-fis-centro-massa.md`
- `src/components/content/interactive/fisica/CarrelliMollaRinculo.tsx`, `UrtoAnelasticoEnergia.tsx`,
  `UrtoElasticoMasse.tsx`, `BiliardoUrtoAngoli.tsx`, `CentroMassaUrto.tsx`
- `specs/exercises/fis-conservazione-quantita-moto.md`, `fis-urti-anelastici.md`, `fis-urti-elastici.md`,
  `fis-centro-massa.md`
- `src/lib/exercises/v2/generators/` con gli stessi quattro nomi, e `src/lib/exercises/v2/fis-urti.ts`
- `scripts/exercises/checkers/fis_conservazione_quantita_moto.py`, `fis_urti_anelastici.py`, `fis_urti_elastici.py`,
  `fis_centro_massa.py`, `_fis_urti.py`

---

## Gruppo 34: lezioni 86, 87, 88 (rotazioni: cinematica, momento d'inerzia, dinamica)

Consegnati per ogni lezione: lezione, nota, formulario, flashcard (18 carte), figure TikZ, una figura interattiva
registrata, specifica, generatore e controllo Python. Un modulo comune per i tre generatori
(`src/lib/exercises/v2/fis-rotazioni.ts`, controllo `scripts/exercises/checkers/_fis_rotazioni.py`) e una scena nuova
(`masse-asse`). Niente pubblicato, niente commit.

### Scelte

- Confine 86/47: radianti, $\omega$ e $v = \omega r$ sono del biennio e si richiamano con il link. La 86 aggiunge il
  corpo rigido attorno a un asse fisso, lo spostamento angolare con il segno, $\alpha$, le tre leggi del moto circolare
  uniformemente accelerato (la legge dell'angolo dall'area sotto il grafico di $\omega$), $a_t = \alpha r$ e
  l'accelerazione totale. Il vettore $\vec\omega$ è solo in un riquadro.
- Confine 87/88: per motivare $m r^2$ la 87 ricava $M = (m r^2)\,\alpha$ per una sola pallina su un'asticella leggera
  ($F = m a_t$, $a_t = \alpha r$). La 88 riparte da lì e somma sui pezzetti di un corpo rigido. L'energia cinetica di
  rotazione resta alla 89.
- 87: tabella con sette corpi (anello, disco, sfera piena, sfera cava, asta per il centro e per un estremo, lamina
  attorno a un lato); Huygens-Steiner enunciato e usato, non dimostrato; corpi composti per somma.
- 88: "momento torcente" è presentato come il nome, nelle rotazioni, del momento di una forza del primo anno;
  $M_{tot} = I\,\alpha$ dimostrato con le forze interne che si cancellano a coppie, dicendo a parte che per questo
  devono stare sulla retta che congiunge i due pezzetti (la lezione 52 enuncia il terzo principio senza questa
  condizione); carrucola con massa in due casi (secchio, macchina di Atwood); momento come $\vec r \times \vec F$ in
  fondo, con $M_z = r_x F_y - r_y F_x$ e il rimando alla 71.
- Simboli: quelli del README ($\theta$, $\omega$, $\alpha$, $I$, $M$, $\varphi$ per l'angolo tra $\vec r$ e $\vec F$).
  Scelte mie: $a_t$ e $a_c$; $I_{cm}$ e $d$ nel teorema degli assi paralleli; nell'esempio 1 della 88 la massa del
  disco è $m$ per non averla accanto al momento $M$, negli esempi con la carrucola $M$ è la massa della carrucola e il
  momento si scrive $T R$.
- Nei generatori tutte le risposte sono moduli a due cifre significative, minori di $100$; $g = 9{,}8\,\text{m/s}^2$.

### Domande per Andrea

86
- Il vettore velocità angolare va trattato per intero al terzo anno, con $\vec v = \vec\omega \times \vec r$, o basta il
  riquadro?
- L'accelerazione angolare istantanea è definita "su un intervallo brevissimo", come la velocità istantanea del
  biennio: va bene così?
- "Moto circolare uniformemente accelerato" è il nome che usi per il moto con $\alpha$ costante?

87
- Va bene ricavare $M = (m r^2)\,\alpha$ per una massa sola già nella 87, o preferisci introdurre $I$ dall'energia
  cinetica di rotazione e cambiare l'ordine delle lezioni 87-89?
- I sette corpi della tabella sono quelli giusti per il terzo anno? La lamina attorno a un lato è spiegata come "una
  pila di aste": basta?
- L'esempio del momento d'inerzia della Terra (sfera omogenea contro valore misurato) lo tieni?

88
- La lettera $M$ è sia il momento della forza sia la massa della carrucola o del disco: preferisci $\tau$ per il
  momento torcente, o un altro simbolo per la massa della carrucola?
- La dimostrazione di $M_{tot} = I\,\alpha$ con i pezzetti va bene, o al terzo anno si enuncia soltanto?
- Nella macchina di Atwood con la carrucola pesante in verifica si chiedono le due tensioni o solo l'accelerazione?
- La sezione sul momento come vettore sta in fondo: la vuoi prima del secondo principio?

### Da verificare

- Momento d'inerzia misurato della Terra: $8{,}0 \cdot 10^{37}\,\text{kg} \cdot \text{m}^2$ (a memoria); quello della
  sfera omogenea è calcolato con $M_T$ e $R_T$ del README: $9{,}69 \cdot 10^{37}$.
- Formule della tabella scritte a memoria: sfera cava sottile $\frac{2}{3} M R^2$, lamina attorno a un lato
  $\frac{1}{3} M a^2$ (le altre cinque sono quelle di ogni libro).
- Dati degli esempi scritti a memoria, plausibili ma senza fonte: trapano a $900$ giri al minuto, centrifuga a $1200$
  giri al minuto raggiunti in $8{,}0$ s, ruota di bicicletta con $I = 0{,}12\,\text{kg} \cdot \text{m}^2$ e cerchione a
  $0{,}31$ m, porta di $18$ kg larga $0{,}80$ m, giostra di $135$ kg e raggio $1{,}6$ m.
- La frase sui volani con la massa nella corona esterna e sulle ruote da corsa con i cerchi leggeri (87, esempio 3).
- Il nome "teorema di Huygens-Steiner" (con "teorema degli assi paralleli" come secondo nome) e "momento torcente".

### Figure interattive

| Nome | Lezione | Domanda | Come è stata guardata |
|---|---|---|---|
| `disco-accelerazione-angolare` | 86 | Che cosa succede alle due componenti dell'accelerazione mentre il disco prende velocità? | Ultima versione, sulla porta 3131: chiaro, scuro e telefono; da fermo, in moto, a fine corsa; ai quattro estremi dei cursori. Corretto: la distanza del punto ora va da 1 a 2 m (a 0,5 m frecce e nomi si accavallavano sul centro). Con $\alpha = 2$ e $r = 2$ la freccia tangenziale esce dal disco ma resta nella cornice. |
| `asta-masse-momento-inerzia` | 87 | Con lo stesso momento, quanto in fretta prende velocità l'asta se le masse sono vicine all'asse o lontane? | Chiaro, scuro e telefono; da ferma, in moto, a fine corsa; agli estremi dei cursori. Corretto: la distanza minima ora è 0,4 m (a 0,3 m la freccia curva del momento toccava le sfere più grandi). |
| `carrucola-massa-secchio` | 88 | Che cosa succede all'accelerazione del secchio quando la carrucola diventa più pesante? | Ultima versione: chiaro, scuro e telefono; da fermo, in moto, a fine corsa; agli estremi (carrucola 0 e 8 kg, secchio 4 kg e il minimo). Corretto: il secchio ora va da 1 a 4 kg (a 0,5 kg le frecce di peso e tensione erano più corte dei loro nomi). |

Nessun blocco `grafico`: la figura `grafico-velocita-angolare-tempo-area` della 86 ha la riga `% poi-interattivo`.

### Pezzi del kit che mancano

- Un disco che gira con un segno per vederlo ruotare: `Pulley` disegna un cerchio fermo, e in tutte e tre le figure ho
  aggiunto a mano un raggio (un `path`) sopra il cerchio.
- L'asse di rotazione a tratto e punto (`dash dot` nel TikZ): nella scena `masse-asse` è un `path` con
  `strokeDasharray` scritto a mano. Servirebbe un pezzo `Asse` in `leve.tsx`.
- La barra di scala ("1 m") è ridisegnata in ogni figura, come già in `MotoCircolare.tsx`.
- Le frecce tratteggiate (`Arrow dashed`) sotto mezzo centimetro non si leggono: per le componenti corte ho usato
  frecce sottili continue.
- `fis-moti-piano.ts` scrive solo unità semplici o con un quadrato finale: le unità composte
  ($\text{kg} \cdot \text{m}^2$, $\text{N} \cdot \text{m}$) sono nel mio `fis-rotazioni.ts`.

### Limiti

- Esempi senza esercizio: accelerazione totale $\sqrt{a_t^2 + a_c^2}$ (86, esempio 4), relazione senza il tempo con
  $\omega_0 \ne 0$ e i giri (86, esempio 3), lamina e Terra (87, esempi 4 e 5), momento dalle componenti (88,
  esempio 6), le due tensioni insieme nella macchina di Atwood (si chiede solo quella dal lato pesante).
- Il generatore 86 non ha scene: i suoi problemi non hanno una geometria che cambi con i dati.
- Controlli fatti: `check.mts` sui nove file; conti rifatti in Python; TikZ guardate in chiaro e in scuro (13 figure);
  `sample.mts ... 1000 all` con `verify.py` PASS ai seed 1, 50001 e 777001 per i tre generatori (rifatto per i livelli
  toccati dopo, 86 livello 1 e 88 livello 3); errori piantati (indice giusto spostato, opzione giusta cambiata, dato del
  testo cambiato, scena svuotata) tutti bocciati; `review.mts` e `width.mts` con uscita 0; `eslint` pulito sui miei
  file; `tsc --noEmit` una volta, prima dei ritocchi finali, nessun errore nei miei file né nelle due registrazioni
  (dopo non l'ho rilanciato, come chiesto: i ritocchi sono numeri e stringhe, ripassati con `eslint`).
- Secondo giro, con il sito sulla porta 3131. Le tre lezioni intere a 390 px, scorse per intero: nessun errore di
  KaTeX, nessuna immagine mancante, nessuno scorrimento laterale della pagina, figura interattiva montata, nessun
  errore in console. Le formule lunghe degli esempi scorrono dentro il loro riquadro: ho spezzato su due o tre righe
  le dieci più larghe (erano fino a 850 px, ora la più larga è 556 px su 312 disponibili). Nella 88 la somma dei
  momenti è ora $M_1 + M_2 + \ldots = (m_1 r_1^2 + \ldots)\,\alpha$, senza la frase dentro la formula.
- Scene, guardate in chiaro, in scuro e da telefono: `masse-asse` nei tre casi (tre masse, asse interno a due masse,
  asse su una sfera), va bene; `corpi-collegati` di tipo `atwood`, va bene; `asta-forze` con la porta a 35 e a 70
  gradi va bene, a 20 gradi scrive l'angolo sopra la freccia. La scena non è mia: ho tolto 20 e 25 gradi dal livello 3
  della 88 (generatore, controllo, specifica), che ora parte da 30.
- Pagine di revisione rigenerate e lette: per ogni generatore tutti i campioni (12, 10 e 10). Testi, passaggi e
  risposte tornano. Corretto nel livello 1 della 86: con una velocità angolare molto più piccola dell'altra i
  distrattori si accalcavano sulla risposta (3,0 contro 3,2, 3,4 e 3,6); ora la più piccola è almeno un quarto della
  più grande. Resta, per costruzione, qualche distrattore "vicino" preso dal ripiego al 20% in più o in meno quando un
  errore vero dà un numero di tre cifre.
- Non fatto: `tsc` dopo i ritocchi finali; le figure interattive con le frecce da tastiera o con il movimento ridotto.
- Avviso rimasto di `check.mts`: 88, riga 217, "titolo con maiuscole all'inglese" per "La macchina di Atwood con la
  carrucola pesante". È il nome proprio, l'ho lasciato.

### File condivisi toccati

`src/lib/utils/interactive.ts`, in `FIGURES`, sotto `// Physics, third year: rotation, kinematics and dynamics (group 34).`:

```ts
	'disco-accelerazione-angolare': () => import('@/components/content/interactive/fisica/DiscoAccelerazioneAngolare'),
	'asta-masse-momento-inerzia': () => import('@/components/content/interactive/fisica/AstaMasseMomentoInerzia'),
	'carrucola-massa-secchio': () => import('@/components/content/interactive/fisica/CarrucolaMassaSecchio'),
```

`src/components/content/exercises/scenes/index.tsx`: un import in cima, dopo gli altri import delle scene, e una riga
sotto il commento del gruppo 34:

```ts
import MasseAsse from './MasseAsse';
	'masse-asse': MasseAsse,
```

### File nuovi

- `docs/lezioni/fisica/{riscritte,note,formulari,flashcard}/86-fis-cinematica-rotazionale.md`, `87-fis-momento-inerzia.md`,
  `88-fis-dinamica-rotazionale.md`
- `src/components/content/interactive/fisica/DiscoAccelerazioneAngolare.tsx`, `AstaMasseMomentoInerzia.tsx`,
  `CarrucolaMassaSecchio.tsx`
- `src/components/content/exercises/scenes/MasseAsse.tsx`
- `src/lib/exercises/v2/fis-rotazioni.ts`, `src/lib/exercises/v2/generators/fis-cinematica-rotazionale.ts`,
  `fis-momento-inerzia.ts`, `fis-dinamica-rotazionale.ts`
- `scripts/exercises/checkers/_fis_rotazioni.py`, `fis_cinematica_rotazionale.py`, `fis_momento_inerzia.py`,
  `fis_dinamica_rotazionale.py`
- `specs/exercises/fis-cinematica-rotazionale.md`, `fis-momento-inerzia.md`, `fis-dinamica-rotazionale.md`

Da collegare (non fatto, come da brief): i tre generatori in `src/lib/exercises/index.ts` e `config.ts`, i nomi dei
livelli in `level-names.ts` (sono nel file JSON).

---

## Rapporto del gruppo 35: lezioni 89, 90, 91

Energia cinetica di rotazione e rotolamento (89), momento angolare (90), conservazione del momento angolare (91).
Scritte il 6 ottobre 2026. Niente pubblicato, niente commit.

### Scelte

- 89. $K_{rot} = \tfrac12 I\omega^2$ ricavata sommando le energie dei pezzetti; l'energia del corpo che rotola,
  $K = \tfrac12 m v_{cm}^2 + \tfrac12 I\omega^2$, enunciata. Simbolo nuovo, non nel README: il numero $c$ di $I = c\,m r^2$
  ($1$, $\tfrac23$, $\tfrac12$, $\tfrac25$), che dà una sola formula per tutti i corpi: $K = (1 + c)\tfrac12 m v_{cm}^2$,
  $v_{cm} = \sqrt{2gh/(1 + c)}$, $a = g\sin\beta/(1 + c)$. L'angolo del piano è $\beta$ (nel capitolo $\alpha$ è
  l'accelerazione angolare). L'accelerazione sul piano è ricavata dall'energia, non dalle forze (quella strada è della
  88). Una sottosezione breve ha il lavoro di un momento, $W = M\theta$: nessuna lezione del capitolo lo aveva.
- 90. $\vec L = \vec r \times \vec p$ con il link alla 71; accanto a $L = r\,m\,v\sin\varphi$ la forma con il braccio,
  $L = m\,v\,b$, costruita sulla lezione 22, per non usare il seno di angoli ottusi. Moto circolare e moto rettilineo a
  confronto. $L = I\omega$ ricavata; $M = \Delta L/\Delta t$ ricavata da $M = I\alpha$ con $I$ costante e poi enunciata in
  generale. In fondo la tabella traslazione-rotazione. Niente nome per $M\,\Delta t$.
- 91. Legge ricavata da $M = \Delta L/\Delta t$; tre famiglie di problemi (corpo che cambia forma, due corpi che si
  uniscono, forze centrali e orbite); una sottosezione sull'energia cinetica che non si conserva; Keplero solo nominato
  con il link alla 93; una sezione qualitativa breve sulla direzione di $\vec L$ (giroscopio, asse terrestre) e una nota
  sull'elicottero.
- Confine con il gruppo 34: le tre lezioni usano senza ricavarli $v = \omega r$, la tabella dei momenti d'inerzia e
  $M = I\alpha$, con i link alle lezioni 86, 87, 88. Non ho letto le lezioni del gruppo 34 (non esistevano ancora): i nomi
  dei corpi ("anello sottile", "cilindro pieno", "sfera piena", "sfera cava sottile") e la tabella vanno confrontati.

### Domande per Andrea

89:
- Il numero $c$ di $I = c\,m r^2$ va bene come simbolo, o si scrive ogni volta la formula del corpo?
- Il lavoro di un momento ($W = M\theta$) sta qui o nella 88?
- Basta l'accelerazione ricavata dall'energia, o serve anche la strada con le forze e l'attrito statico?

90:
- Vanno bene insieme $L = r\,m\,v\sin\varphi$ e $L = m\,v\,b$?
- Il momento angolare di una particella in moto rettilineo è al livello del terzo anno? Serve alla 91 (giostra).
- La tabella traslazione-rotazione sta qui o nella 88?

91:
- I momenti d'inerzia della pattinatrice ($3{,}6$ e $1{,}2\,\text{kg}\cdot\text{m}^2$) sono credibili?
- La seconda legge di Keplero solo nominata: va bene, o si può già dire che la velocità areolare è $L/(2m)$?
- La sezione qualitativa su giroscopio e asse terrestre si tiene?

### Da verificare

- Terra: perielio $1{,}47 \cdot 10^{11}\,\text{m}$ (inizio gennaio, $30{,}3\,\text{km/s}$), afelio $1{,}52 \cdot 10^{11}\,\text{m}$
  (inizio luglio, $29{,}3\,\text{km/s}$): a memoria.
- "L'asse della Terra resta puntato vicino alla Stella Polare": vero nell'arco di un anno, la precessione non è nominata.
- Keplero ha trovato la seconda legge dalle osservazioni prima della spiegazione di Newton (senza date nel testo).
- Dati di contorno a memoria: palla da bowling $7{,}2\,\text{kg}$; ruota di bicicletta $1{,}5\,\text{kg}$ e $0{,}35\,\text{m}$;
  gabbiano $0{,}45\,\text{kg}$ a $12\,\text{m/s}$; giostra da $120\,\text{kg}$ e $1{,}5\,\text{m}$.
- Tabella dei momenti d'inerzia: deve coincidere con quella della lezione 87.

### Figure interattive

| Nome | Lezione | Domanda | Come l'ho guardata |
|---|---|---|---|
| `rotolamento-gara-piano-inclinato` | 89 | Chi arriva prima tra blocco senza attrito, sfera, cilindro e anello, e l'ordine cambia con l'inclinazione? | Sul sito: chiaro e scuro fermo, scuro da telefono dopo "Via" a gara finita, estremi del cursore (10° e 40°), dentro la lezione a 390 px. |
| `momento-angolare-moto-rettilineo-braccio` | 90 | Che cosa succede al momento angolare di una particella che va dritta mentre si avvicina al polo e si allontana? | Sul sito: chiaro all'inizio e a metà corsa, scuro e chiaro da telefono a fine corsa, estremi del cursore (braccio 0 da telefono, 3 m), dentro la lezione a 390 px. |
| `momento-angolare-masse-piattaforma` | 91 | Che cosa succede a $\omega$, $L$ e $K$ quando le masse passano da 1,0 a 0,5 m dall'asse? | Sul sito: chiaro e da telefono a 1,0 m, scuro da telefono mentre gira, minimo del cursore (0,2 m) da telefono, dentro la lezione a 390 px. |

Scene degli esercizi, guardate sul sito con dati di prova: `rotolamento-piano` (chiaro con il dislivello, scuro a 60°,
telefono a 15°), `particella-polo` (chiaro a 35°, scuro da telefono a 70°), `orbita-ellisse` (chiaro con rapporto 1,5,
scuro da telefono con rapporto 3,9). Nessun errore in console nelle ultime anteprime (porta 3131); le prime, sulla
3111 sotto carico, davano un errore di idratazione che non si è più ripetuto.

Mentre il sito non rispondeva ho usato anche uno script mio (`gruppo-35/prev.mjs`, esbuild più Playwright su un file
HTML, senza Tailwind) per controllare disegno e numeri.

Difetti piccoli rimasti: nella gara, a 10°, la lettera β tocca la linea tratteggiata; a inclinazioni basse la parte alta
della cornice resta vuota (la cornice è fissa, calcolata per 40°).

### Pezzi del kit che mancano

- Un corpo che rotola (cerchio con un raggio che gira, anello a due cerchi): l'ho disegnato in `GaraRotolamento.tsx` e
  nella scena `RotolamentoPiano.tsx` con `Ball` più un segmento.
- Una freccia curva (verso di rotazione, velocità angolare): in `PiattaformaMasse.tsx` è una spezzata più `Arrow`
  sull'ultimo tratto. Servirà anche al gruppo 34.
- Un'ellisse (orbite, dischi in prospettiva): nella scena `OrbitaEllisse.tsx` è un `<ellipse>` scritto a mano.
- `Label` non ha il simbolo dei gradi attaccato al numero: "35°" esce con il cerchietto staccato nel font del kit.

### Limiti

- Le tre lezioni intere a 390 px (sulla 3111, prima che cadesse): nessun errore di KaTeX, nessuna immagine mancante,
  nessuno scorrimento laterale, figure interattive montate. Dopo quel controllo ho solo spezzato in due una formula
  della 89; `check.mts` rifatto dopo.
- Esempi senza esercizio: 89 esempio 1 (giri al secondo da convertire), lavoro di un momento, esempio 4 (tempi della
  gara); 90 verso di $\vec L$, braccio letto dalla figura; 91 energia persa quando due dischi si uniscono, domande
  qualitative sulla direzione.
- Errori piantati (200 esercizi per generatore): indice, testo dell'opzione, opzione doppia, parole vietate, dato
  cambiato, scena cambiata, tutti bocciati. Il dato cambiato nell'ultima cifra all'inizio passava in un caso su tre
  (a due cifre la risposta non cambia): ora i controlli confrontano anche i numeri del testo con `params`.
- `tsc --noEmit` lanciato una volta, prima dell'indicazione di non farlo: 0 errori in tutto il progetto in quel momento. `eslint` pulito sui dieci file TypeScript nuovi.
- Le formule in evidenza più lunghe (le sostituzioni con le unità negli esempi) a 390 px scorrono dentro il loro
  riquadro, come nelle lezioni del biennio; la pagina non scorre di lato.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: rotational energy and angular momentum (group 35).`:

```ts
	'rotolamento-gara-piano-inclinato': () => import('@/components/content/interactive/fisica/GaraRotolamento'),
	'momento-angolare-moto-rettilineo-braccio': () => import('@/components/content/interactive/fisica/MomentoAngolareRetta'),
	'momento-angolare-masse-piattaforma': () => import('@/components/content/interactive/fisica/PiattaformaMasse'),
```

`src/components/content/exercises/scenes/index.tsx`, tre import dopo quello di `PistaEnergia` e tre righe sotto il
commento del gruppo 35:

```ts
import RotolamentoPiano from './RotolamentoPiano';
import ParticellaPolo from './ParticellaPolo';
import OrbitaEllisse from './OrbitaEllisse';
	'rotolamento-piano': RotolamentoPiano,
	'particella-polo': ParticellaPolo,
	'orbita-ellisse': OrbitaEllisse,
```

### File nuovi

Lezioni, note, formulari, flashcard: `docs/lezioni/fisica/{riscritte,note,formulari,flashcard}/` con i nomi
`89-fis-energia-rotazionale.md`, `90-fis-momento-angolare-def.md`, `91-fis-conservazione-momento-angolare.md`.
Interattive: `src/components/content/interactive/fisica/{GaraRotolamento,MomentoAngolareRetta,PiattaformaMasse}.tsx`.
Scene: `src/components/content/exercises/scenes/{RotolamentoPiano,ParticellaPolo,OrbitaEllisse}.tsx`.
Esercizi: `specs/exercises/<slug>.md`, `src/lib/exercises/v2/generators/<slug>.ts`,
`scripts/exercises/checkers/<slug con _>.py` per i tre slug; modulo comune `src/lib/exercises/v2/fis-momento-angolare.ts`
e `scripts/exercises/checkers/_fis_momento_angolare.py`.

Per collegare i generatori: livelli 1-6 per tutti e tre, percorsi
`high_school/physics/fis-momento-angolare/<slug>`.

---

## Rapporto del gruppo 36: lezioni 92, 93, 94

Lezioni `fis-sistemi-cosmologici`, `fis-leggi-keplero`, `fis-gravitazione-universale`, ciascuna con nota, formulario,
flashcard, figure TikZ, figure interattive registrate, specifica, generatore e controllo Python. Niente è pubblicato né
committato. I dettagli lezione per lezione sono nelle tre note in `docs/lezioni/fisica/note/`.

### Scelte

- Confine 92/93: nella 92 i modelli e le prove fino a Galileo; l'ellisse e le tre leggi nella 93. L'unità astronomica è
  definita nella 92 ($1{,}50 \cdot 10^{11}$ m, come il README) perché serve subito; la 93 dà anche $1{,}496 \cdot 10^{11}$ m
  quando ricava il semiasse dell'orbita terrestre.
- La 92 ha tre esempi con un conto: il rapporto tra la velocità sull'epiciclo e quella sul deferente, la distanza di
  Venere dall'elongazione massima con il seno, il periodo di Marte dal periodo sinodico. Simboli nuovi, usati solo lì:
  $S$ periodo sinodico, $T_T$ periodo della Terra, $v_d$ e $v_e$, d per il giorno.
- Confine 93/96: la 93 non ha dinamica. La costante si chiama $K$ ($K_S$ per il Sole), dipende dal corpo centrale e il
  suo valore $4\pi^2/(GM)$ resta alla 96. La terza legge ha due forme: $T^2 = a^3$ in anni e UA attorno al Sole, e
  l'uguaglianza dei rapporti per gli altri corpi centrali.
- Confine 93/91: $v_p r_p = v_a r_a$ è ricavata dalle aree di due triangoli sottili; la conservazione del momento
  angolare è richiamata in due righe con il link.
- Confine 94/95: nella 94 $g = GM/R^2$ solo sulla superficie (Terra, Luna); quota, vettore $\vec g$ e interno della
  sfera sono della 95. Il teorema del guscio è enunciato in due righe.
- Confine 94/96: la 94 passa da Keplero alla forza (orbita circolare, terzo principio per la massa del Sole); il verso
  opposto è della 96.
- Nel conto di $g$ dalla legge il risultato è $9{,}81\,\text{m/s}^2$ (con le costanti del README viene $9{,}813$).
- Nelle figure non si nominano i colori nel testo, perché il tema scuro li inverte; l'ombra di Venere è a righe.
- Modulo comune degli esercizi: `src/lib/exercises/v2/fis-keplero-newton.ts` con il controllo
  `scripts/exercises/checkers/_fis_keplero_newton.py`. Regola di scrittura dei risultati: per esteso tra $0{,}01$ e
  $1000$ se non sono interi che finiscono con uno zero, altrimenti notazione scientifica.

### Domande per Andrea

92
- Il periodo sinodico con $1/T = 1/T_T - 1/S$ sta nei libri di fisica di terza, o va lasciato alle scienze della Terra?
- L'esempio 1 (velocità su epiciclo e deferente) è un conto che i libri non fanno: lo teniamo?
- Il sistema ticonico ha una sezione e una colonna nella tabella: troppo?

93
- La costante della terza legge si chiama $K$: va bene?
- $v_p r_p = v_a r_a$ resta qui o passa alla 91?
- Gli esponenti frazionari ($a^{3/2}$, $T^{2/3}$) sono dati come tasti della calcolatrice: in terza li hanno già?

94
- Il passaggio da Keplero alla forza per l'orbita circolare va bene, o basta enunciare la legge?
- "La Luna cade come la mela" ripete la nota della lezione 57: da togliere in una delle due?
- $9{,}81$ nel risultato di $g$, mentre altrove si usa $9{,}8$: va bene?
- L'esempio 5 (punto tra Terra e Luna dove le forze si bilanciano) è al livello giusto?

### Da verificare

- 92: Tolomeo II secolo d.C. e "errori di pochi gradi"; Aristarco III secolo a.C.; Copernico 1543; Tycho 1546-1601,
  Hven, un primo d'arco, stella nuova 1572, cometa 1577; parallasse misurata nel 1838, meno di $1''$; Galileo 1609,
  *Sidereus Nuncius* 1610, *Dialogo* 1632, processo 1633. Marte: sinodico $780$ d, periodo $687$ d, $1{,}52$ UA.
  Venere: elongazione $46^\circ$, sinodico $584$ d. Mercurio: $23^\circ$ in media. Saturno: sinodico $378$ d.
- 93: Keplero 1571-1630, leggi nel 1609 e nel 1619, scarto di $8'$ per Marte. Terra: perielio $1{,}471 \cdot 10^{11}$ m,
  afelio $1{,}521 \cdot 10^{11}$ m. Eccentricità di Mercurio $0{,}206$ e di Halley $0{,}967$. Halley: perielio $0{,}586$ UA,
  afelio $35{,}1$ UA, periodo $75{,}3$ anni, $54{,}5$ km/s al perielio. Tabella dei pianeti (Saturno a $9{,}54$ UA: con
  $9{,}58$ il rapporto verrebbe $0{,}99$). Io $4{,}22 \cdot 10^5$ km e $1{,}77$ d, Europa $6{,}71 \cdot 10^5$ km.
- 94: *Principia* 1687; Cavendish 1798, sfere di $158$ kg e $0{,}730$ kg a $0{,}225$ m, valore di $G$ entro l'$1\%$;
  Luna $7{,}35 \cdot 10^{22}$ kg, $1{,}74 \cdot 10^{6}$ m, $3{,}84 \cdot 10^{8}$ m, $27{,}3$ d (non sono nel README);
  uguaglianza tra massa inerziale e gravitazionale "fino a una parte su mille miliardi".

### Figure interattive

| Nome | Lezione | Domanda | Come l'ho guardata |
|---|---|---|---|
| `epiciclo-deferente-cappi` | 92 | Che cosa succede ai cappi se l'epiciclo gira più lentamente? | chiaro, scuro e telefono, valori iniziali, estremi dei due cursori, dopo "Avvia" |
| `moto-retrogrado-sorpasso` | 92 | Quando si inverte il verso sulla striscia delle stelle? | chiaro, scuro e telefono, giorno 90, 150, 197 e 300, dopo "Avvia" |
| `orbita-ellittica-aree` | 93 | Come cambiano i settori, e la velocità, quando l'orbita diventa più schiacciata? | chiaro, scuro e telefono, eccentricità 0, 0,5 e 0,8, dopo "Avvia" |
| `gravitazione-due-masse` | 94 | Che cosa succede alle due frecce se raddoppi la distanza? E una massa? | chiaro, scuro e telefono, valori iniziali e i due estremi della forza |

Scene degli esercizi, guardate in chiaro, scuro e telefono: `elongazione-pianeta` (12, 27, 41 e 58 gradi),
`orbita-perielio-afelio` (eccentricità 0,13, 0,43 e 0,85, con e senza velocità), `masse-allineate` (corpo centrale a un
decimo e a tre quarti della distanza).

Le tre lezioni intere a 390 px: nessun errore di KaTeX, nessuna immagine mancante, nessuno scorrimento laterale della
pagina, le interattive si montano. Alcune formule in evidenza lunghe (i conti con le potenze di dieci della 94) scorrono
dentro il loro riquadro.

### Pezzi del kit che mancano

- Un'ellisse e un cerchio in centimetri TikZ: ogni figura calcola `r * K` a mano.
- Una quota (linea con due tacche e un testo): l'ho ridisegnata in tre file; `leve.tsx` ha `Quota`, ma per le aste.
- Un'etichetta con pedice per le scene (`r_p = 0,8 UA`): fatta con `tspan` in `OrbitaPerielioAfelio.tsx`.
- Un numero in notazione scientifica per `<Tex>` e per le etichette.
- `Slider` con passo 0,25 mostra un decimale solo (1,25 diventa 1,3): ho usato passi di 0,5.

### Limiti

- Esempi senza un livello: 94 esempio 5 (punto in cui due forze si bilanciano), 94 esempio 3 è coperto dal livello 1;
  93 la costante $K_S$ in unità SI; 92 nessuna domanda sulle prove di Galileo o sul confronto tra i sistemi.
- Livelli con pochi esercizi diversi su 1000: 92 livello 3 (47, un solo dato), 92 livello 4 (310), 93 livello 4 (231).
- `npx tsc` non lanciato, come da istruzioni di ripresa: lo fa chi coordina. `eslint` sugli undici file di codice è
  pulito.
- Errori piantati (indice, primo e ultimo dato, testo dell'opzione giusta, opzione doppia, parole vietate, scena,
  unità): tutti bocciati, 200 su 200 per tipo nella 92 e 240 su 240 nella 93 e nella 94. `review.mts` e `width.mts`
  escono con 0 (opzioni al più 165 px su 252).
- Avvisi di `check.mts` rimasti: solo "titolo con maiuscole all'inglese" su titoli con nomi propri (Terra, Sole,
  Tolomeo, Copernico, Galileo, Keplero, Cavendish).
- Le figure sono state guardate in parte sulla porta 3111 e, dopo la caduta del sito, sulla 3131.
- La scena `elongazione-pianeta` dava un avviso di idratazione (il seno calcolato dal server e dal browser differiva
  all'ultima cifra): le coordinate sono ora arrotondate al millesimo. Le altre due scene non usano seni o coseni.
- Le pagine di revisione dei generatori (`review-*.html` nello scratchpad) sono generate ma non le ho lette una per una:
  ho letto due campioni per livello dal JSONL.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: cosmological systems, Kepler, universal gravitation (group 36).`:

```ts
	'epiciclo-deferente-cappi': () => import('@/components/content/interactive/fisica/EpicicloDeferente'),
	'moto-retrogrado-sorpasso': () => import('@/components/content/interactive/fisica/MotoRetrogradoSorpasso'),
	'orbita-ellittica-aree': () => import('@/components/content/interactive/fisica/OrbitaAree'),
	'gravitazione-due-masse': () => import('@/components/content/interactive/fisica/GravitazioneDueMasse'),
```

`src/components/content/exercises/scenes/index.tsx`, tre import dopo `import OrbitaPianeta` e, sotto lo stesso commento:

```ts
	'elongazione-pianeta': ElongazionePianeta,
	'orbita-perielio-afelio': OrbitaPerielioAfelio,
	'masse-allineate': MasseAllineate,
```

Da collegare (non fatto): i tre generatori in `src/lib/exercises/index.ts` e `config.ts`, i nomi dei livelli in
`level-names.ts`.

---

## Rapporto del gruppo 37: lezioni 95, 96, 97

Campo gravitazionale, moto dei satelliti, energia potenziale gravitazionale e velocità di fuga. Per ogni lezione:
lezione, nota, formulario, flashcard, figure TikZ, una figura interattiva registrata, generatore con specifica e
controllo. Niente è stato pubblicato né committato.

### Scelte

- Confine 94/95: il valore di $g$ al suolo dalla legge di gravitazione resta alla 94; la 95 lo richiama in una riga e
  parte dalla definizione $\vec g = \vec F / m$. Cavendish e massa inerziale e gravitazionale non compaiono.
- Confine 95/96: l'assenza apparente di peso è solo annunciata nella 95 (esempio della Stazione Spaziale) e spiegata
  nella 96.
- Confine 93/96: la terza legge è ricavata nella 96 solo per le orbite circolari, con la costante $4\pi^2/(G M)$; per
  le ellissi è enunciata.
- Confine 96/97: energia in orbita e velocità di fuga solo nella 97. La figura del cannone di Newton (96) mostra anche
  le traiettorie aperte e rimanda alla 97.
- Confine con 72 e 75: l'assenza di peso è spiegata nel sistema inerziale (caduta libera comune); il sistema
  accelerato è una riga con i due link. L'ascensore con la bilancia è nella lezione 53, che linko.
- Confine con 77 e 78: lavoro come area e $W = -\Delta U$ richiamati con il link; l'area sotto $1/r^2$ è enunciata.
- Simboli oltre a quelli del README: $g_0$ (campo al suolo della Terra), $R$ (raggio di un pianeta qualsiasi), $M_L$ e
  $R_L$ (Luna), $U_0$ ed $E_0$ (valori sulla rampa di lancio), $r_{max}$ e $h_{max}$ (lancio verticale).
- Il campo $\vec g$ è disegnato in verde, il colore delle accelerazioni.
- Dati con tre cifre significative dappertutto, come le costanti del README; notazione scientifica con `\cdot`.
- "Prima velocità cosmica" è nominata nella 96; "seconda velocità cosmica" no (solo "velocità di fuga").
- Giorno sidereo ($8{,}62 \cdot 10^4$ s) per il satellite geostazionario, con una nota.
- Esercizi: corpi celesti inventati ma possibili (densità tra 1000 e 6000 kg/m³, "luna" solo sotto $10^{24}$ kg), tutti
  i dati nel testo. Modulo comune nuovo `src/lib/exercises/v2/fis-campo-orbite.ts` con il controllo
  `scripts/exercises/checkers/_fis_campo_orbite.py` (numeri a tre cifre in notazione scientifica, arrotondamento
  esatto). Ho evitato il nome `fis-gravitazione` per non scontrarmi con il gruppo 36.

### Domande per Andrea

Lezione 95
- Il campo in verde come le accelerazioni, o un colore suo (che varrebbe anche per il campo elettrico)?
- $g_0$ per il valore al suolo va bene?
- L'esempio del punto tra Terra e Luna in cui il campo si annulla è al livello del terzo anno?
- "Dentro e fuori una sfera" solo enunciato: serve un esempio numerico dentro la Terra?

Lezione 96
- Geostazionario con il giorno sidereo o con 24 ore?
- "Prima velocità cosmica" si tiene?
- L'assenza apparente di peso: basta la caduta libera, o serve il conto con la forza centrifuga?
- Negli esercizi i periodi sono sempre in secondi: serve un livello con ore o giorni da convertire?

Lezione 97
- La formula del lavoro tra $r_1$ e $r_2$ enunciata senza dimostrazione va bene?
- Si parla di "lavoro contro la gravità" (uguale a $\Delta U$) o solo di lavoro della gravità?
- La tabella $E < 0$, $E = 0$, $E > 0$ con ellisse, parabola e iperbole è al livello giusto?
- Il riquadro sui buchi neri resta qui?
- Nel generatore la velocità di fuga è l'ultimo livello (ordine della lezione) ma è più facile del livello 3: va bene?

### Da verificare

- Luna: $7{,}35 \cdot 10^{22}$ kg, $1{,}74 \cdot 10^6$ m; distanza Terra-Luna $3{,}84 \cdot 10^8$ m; periodo $27{,}3$ giorni.
- Everest $8{,}85$ km; Stazione Spaziale a 400 km, "più di 400 tonnellate", 15-16 albe al giorno.
- GPS a $20\,200$ km, periodo di circa 12 ore; giorno sidereo 23 h 56 min; anno $3{,}16 \cdot 10^7$ s.
- Voli parabolici: "una ventina di secondi".
- Terra non omogenea: "il campo resta vicino a 10 N/kg per quasi metà del raggio" (a memoria, dal modello PREM).
- Teorema dei gusci e cannone attribuiti a Newton; Michell e Laplace "nel Settecento"; raggio di Schwarzschild uguale
  al risultato newtoniano.
- Voyager lanciate nel 1977 e uscite dal Sistema Solare; Saturn V "alto più di 100 m"; raggio del Sole $696\,000$ km;
  buco nero al centro della Galassia di circa quattro milioni di masse solari.
- La spiegazione dell'assenza di atmosfera sulla Luna con la sola velocità di fuga è semplificata.

### Figure interattive

| Nome | Lezione | Domanda a cui risponde | Come l'ho guardata |
|---|---|---|---|
| `campo-gravitazionale-sonda` | 95 | A che distanza il campo è un quarto di quello al suolo, e a che distanza la metà? | Sul sito: chiaro da computer, scuro da telefono, stato iniziale. Non ho trascinato la sonda in uno screenshot (lo script non trascina). |
| `cannone-newton-orbita` | 96 | Qual è la velocità più piccola con cui il proiettile non tocca più il suolo? | Sul sito: 4, 6, 7,5, 9 e 11 km/s; chiaro, scuro e telefono; dopo "Lancia". |
| `lancio-verticale-energia-fuga` | 97 | Con che velocità il proiettile arriva a una quota uguale al raggio terrestre, e che cosa succede vicino a 11,2 km/s? | Sul sito: 2, 6, 9, 11,1 e 12 km/s; chiaro, scuro e telefono; dopo "Lancia". Dopo l'ultimo ritocco alle etichette l'ho rivista a 11,1 km/s in scuro e a 12 km/s da telefono. |

Per impostare i cursori ho usato uno script mio di Playwright nello scratchpad (`gruppo-37/shot.mjs`), perché
`anteprima-interattivo.mjs` sa solo cliccare.

### Pezzi del kit che mancano

- Tacche numerate sugli assi per le figure interattive (in `LancioVerticaleFuga.tsx` le ho disegnate a mano; quelle di
  `GraficoDati.tsx` sono della scena).
- Una quota (doppia freccia con la lettera): l'ho scritta dentro `scenes/OrbitaPianeta.tsx`.
- Numeri per KaTeX con le migliaia separate e in notazione scientifica: per ora in `interactive/fisica/gravita.ts`
  (`km`, e le costanti $G$, $M_T$, $R_T$).
- `anteprima-interattivo.mjs` non imposta i cursori e non trascina i punti.

### Limiti

- Dopo la ripresa (porta 3131) ho aperto le tre lezioni intere a 390 px: nessun errore di KaTeX, nessuna immagine
  mancante, nessuno scorrimento laterale. In quella pagina di prova il mio script non vede montata la figura
  interattiva (succede uguale con la lezione 57, già pubblicata): le interattive le ho guardate una per una su
  `/prova-fisica`, non dentro la lezione.
- La scena `orbita-pianeta` l'ho guardata sul sito (punto a quota, orbita in scuro, lancio da telefono) e, per i casi
  estremi (quota del 6%, raggio dell'orbita 8 volte il raggio), resa da sola con `react-dom/server`.
- La scena con quote molto piccole (meno del 10% del raggio) ha la lettera $h$ stretta contro il satellite.
- Nella figura della sonda la freccia del campo è in scala e oltre i tre raggi è molto corta.
- Avvisi rimasti in `check.mts`: due nel formulario della 96, titoli con un nome proprio ("Terza legge di Keplero",
  "Satelliti della Terra").
- Errori piantati: bocciati tutti tranne uno su 200 al livello 5 del campo (prima cifra della prima massa cambiata in
  un caso in cui quel campo è trascurabile e la risposta a tre cifre resta giusta: l'esercizio mutato è ancora valido).
- Esempi senza esercizio: 95, esempio 4 (a che quota il campo si dimezza) ed esempio 5 nella forma "dove si annulla";
  96, il satellite geostazionario con i dati della Terra e l'assenza di peso; 97, l'esempio 4 (energia per mettere in
  orbita) e il raggio di Schwarzschild.
- Esercizi diversi su 1000 (seed 1): almeno 978 a ogni livello.
- Le lezioni 92-94 del gruppo 36 non esistevano ancora quando ho scritto: i rimandi sono solo link, e non ho potuto
  controllare che simboli e parole coincidano (in particolare come la 94 introduce $g$ dalla legge e la 93 scrive la
  terza legge).
- Blocchi `grafico`: nessuno; le tre interattive sono componenti.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: gravitational field, satellites, energy (group 37).`:

```ts
	'campo-gravitazionale-sonda': () => import('@/components/content/interactive/fisica/CampoGravitazionaleSonda'),
	'cannone-newton-orbita': () => import('@/components/content/interactive/fisica/CannoneNewton'),
	'lancio-verticale-energia-fuga': () => import('@/components/content/interactive/fisica/LancioVerticaleFuga'),
```

`src/components/content/exercises/scenes/index.tsx`: l'import in fondo agli altri e la riga sotto il commento del
gruppo 37:

```ts
import OrbitaPianeta from './OrbitaPianeta';
	'orbita-pianeta': OrbitaPianeta,
```

### File nuovi

- `docs/lezioni/fisica/{riscritte,note,formulari,flashcard}/{95-fis-campo-gravitazionale,96-fis-satelliti,97-fis-energia-gravitazionale}.md`
- `src/components/content/interactive/fisica/{CampoGravitazionaleSonda,CannoneNewton,LancioVerticaleFuga}.tsx` e `gravita.ts`
- `src/components/content/exercises/scenes/OrbitaPianeta.tsx`
- `src/lib/exercises/v2/fis-campo-orbite.ts` e `generators/{fis-campo-gravitazionale,fis-satelliti,fis-energia-gravitazionale}.ts`
- `specs/exercises/{fis-campo-gravitazionale,fis-satelliti,fis-energia-gravitazionale}.md`
- `scripts/exercises/checkers/{_fis_campo_orbite,fis_campo_gravitazionale,fis_satelliti,fis_energia_gravitazionale}.py`

### Controlli fatti

- Generatori: `verify.py` PASS con i seed 1, 50001 e 777001, 1000 esercizi per livello; `review.mts` e `width.mts`
  con codice 0 (opzioni al più 128 px su 252); `eslint` pulito su tutti i file nuovi.
- Lezioni: `check.mts` senza errori; figure TikZ guardate in chiaro e in scuro; conti rifatti in Python.
- `npx tsc --noEmit -p .` lanciato una volta, prima dell'interruzione: nessun errore nei miei file (uscita 0). Dopo ho cambiato solo la posizione di una quota in `OrbitaPianeta.tsx`, ricontrollata con `eslint`.

---

## Rapporto del gruppo 38: i fluidi in moto (lezioni 98-101)

Lezioni 98 `fis-portata-continuita`, 99 `fis-bernoulli`, 100 `fis-torricelli-venturi`, 101 `fis-viscosita`. Per ognuna:
lezione, nota, formulario, flashcard, figure TikZ, una figura interattiva registrata, generatore con specifica e
controllo Python. Niente è stato pubblicato o committato.

### Scelte

- Simboli del README: portata $q$, sezione $S$, densità $d$, $p + \tfrac12 d v^2 + d g h$, viscosità $\eta$, forza di Stokes $F_v$, velocità limite $v_l$. In più: diametro $D$ maiuscolo (per non confonderlo con la densità), pedici $s$ e $i$ per sopra e sotto l'ala, densità della sfera $d_s$ e del fluido $d_{fl}$, spinta di Archimede $S_A$ (gli ultimi due come nella lezione 30 del biennio), tempo caratteristico $\tau$.
- Confini tra le quattro lezioni. La 98 è solo cinematica: fluido ideale, corrente stazionaria, linee di flusso, portata, continuità, ramificazioni; la pressione non compare. La 99 ha la dimostrazione di Bernoulli dal bilancio $W_{nc} = \Delta E$ (lezione 79), i tre casi particolari, il procedimento e gli esempi in cui si calcola una pressione, compreso il vento sul tetto. La 100 ha le applicazioni con una formula propria: Torricelli (con la gittata del getto), tubo di Venturi, tubo di Pitot, portanza. La 101 ha viscosità (definita con le due lastre), laminare e turbolento qualitativi, Stokes, velocità limite senza e con Archimede, la legge esponenziale solo enunciata.
- Fuori da tutte: numero di Reynolds, legge di Poiseuille, portata in massa (una riga nella 98), resistenza proporzionale a $v^2$ (solo nominata nella 101).
- $g = 9{,}8\,\text{m/s}^2$ in tutto il capitolo (nel capitolo dei fluidi fermi era in N/kg).
- Pressioni ricavate per differenza arrotondate alla posizione dell'addendo meno preciso, come nella lezione 28.
- Portanza: la formula con le due velocità date, e un riquadro che dice che Bernoulli non spiega perché l'aria sopra è più veloce e che la spiegazione dei "tempi di transito uguali" è sbagliata.
- Esercizi: risposte in unità che non chiedono la notazione scientifica (L/s, L/min, kPa, kN, mN, cm/s, mm/s, Pa·s). Le pressioni dei livelli 2-5 di `fis-bernoulli` sono interi di kilopascal. Un valore a meno di 0,1 unità dell'ultima cifra dal punto di arrotondamento viene scartato, perché ogni risposta passa da $\pi$ o da una radice e chi usa $3{,}14$ deve trovare la stessa opzione.

### Domande per Andrea

Lezione 98
- Il diametro si chiama $D$: va bene, o l'Amaldi usa un altro simbolo?
- Il fluido ideale è definito senza "irrotazionale". Va bene?
- Serve un esempio con due rami diversi, oltre ai capillari con la sezione totale?

Lezione 99
- La dimostrazione con il lavoro delle forze di pressione va tenuta per intero?
- "Termine cinetico" e "termine della quota", o "pressione dinamica" e simili?
- L'esempio del tetto confronta aria dentro e fuori casa, che a rigore non stanno sulla stessa linea di flusso; la lezione lo giustifica con una frase. Tenerlo?

Lezione 100
- La gittata del getto e il massimo a metà altezza sono nel programma, o vanno in un riquadro?
- Il riquadro sulla portanza contraddice la spiegazione dei tempi uguali. Se il libro di classe la dà, va bene dirlo così netto?
- La formula inversa del venturimetro è da ricordare o basta il procedimento?

Lezione 101
- La formula delle due lastre per definire $\eta$ va tenuta?
- La velocità limite con la spinta di Archimede è nel programma?
- Reynolds e Poiseuille vanno almeno nominati?
- La legge $v(t)$ esponenziale: tenerla o toglierla?

### Da verificare

- Storia, a memoria: Daniel Bernoulli, *Hydrodynamica*, 1738; Torricelli allievo di Galileo, teorema del 1644; Giovanni Battista Venturi, fine Settecento; Henri Pitot, Settecento, misure sulla Senna; George Stokes, irlandese, 1851.
- Densità dell'aria $1{,}2\,\text{kg/m}^3$ (lezioni 99, 100 e generatore `fis-torricelli-venturi`).
- Sangue: aorta $3{,}0\,\text{cm}^2$ e $0{,}30\,\text{m/s}$, sezione totale dei capillari $2{,}0 \cdot 10^3\,\text{cm}^2$.
- Viscosità in Pa·s: aria $1{,}8 \cdot 10^{-5}$, acqua $1{,}0 \cdot 10^{-3}$, sangue $4 \cdot 10^{-3}$, olio d'oliva $8{,}4 \cdot 10^{-2}$, glicerina $1{,}5$, miele circa $10$; nel generatore anche olio di ricino $0{,}99$.
- Densità in kg/m³: acciaio $7800$, alluminio $2700$, vetro $2500$, glicerina $1260$, miele $1400$, olio di ricino $960$, olio lubrificante $900$.
- Gocce di nebbia di $10\,\mu\text{m}$, gocce di pioggia a $6$-$7\,\text{m/s}$, paracadutista a circa $50\,\text{m/s}$ e a $5\,\text{m/s}$ con il paracadute.
- Ala dell'esempio 5 della 100: $70$ e $60\,\text{m/s}$, $20\,\text{m}^2$, dati inventati ma plausibili.
- "Le due correnti dietro l'ala non si ricongiungono": a memoria.

### Figure interattive

| Nome | Lezione | Domanda | File |
|---|---|---|---|
| `tubo-continuita-diametro` | 98 | se il diametro del tratto stretto si dimezza, di quanto cresce la velocità? | `fisica/TuboContinuita.tsx` |
| `bernoulli-tubo-barre` | 99 | costa più pressione salire di cinque metri o dimezzare il diametro? | `fisica/BernoulliTubo.tsx` |
| `serbatoio-foro-getto` | 100 | da quale altezza il getto arriva più lontano? | `fisica/SerbatoioGetto.tsx` |
| `sferette-glicerina-velocita-limite` | 101 | se il raggio raddoppia, di quanto cambia la velocità limite? | `fisica/SferetteViscose.tsx` |

Tutte guardate sul sito di sviluppo (porta 3111) con uno script di Playwright nello scratchpad, perché serviva impostare i cursori: ai valori iniziali in chiaro, a un estremo in scuro e da telefono, all'altro estremo da telefono; quelle con il bottone Avvia anche dopo averlo premuto. Nessun blocco `grafico`.

Scene degli esercizi, nuove: `tubo-sezioni` (`scenes/TuboSezioni.tsx`, usata da `fis-portata-continuita` livelli 3-4 e `fis-bernoulli` livelli 3-5) e `serbatoio-foro` (`scenes/SerbatoioForo.tsx`, `fis-torricelli-venturi` livelli 1-3).

### Pezzi del kit che mancano

- Barre impilate per due stati affiancati: `energia.tsx` disegna un solo stato, e nella 99 le due colonne sono scritte nel file della figura.
- Un tubo con tratti di sezione diversa (pareti, liquido, strozzatura): lo disegnano a mano tre delle mie figure e la scena `tubo-sezioni`. Varrebbe un pezzo in `liquidi.tsx`.
- Una quota con due frecce e l'etichetta (la "linea di misura"): la riscrivono quasi tutte le figure dei fluidi.

### Limiti

- Esempi senza esercizio: nella 98 il tempo di riempimento dal diametro e i capillari; nella 99 il vento sul tetto; nella 100 la portata del foro e la formula inversa del venturimetro; nella 101 la forza tra le due lastre. La 101 non ha livelli sul moto laminare e turbolento né sulla legge esponenziale.
- `fis-viscosita` non ha scene: la figura sarebbe la stessa per tutti i dati.
- Avvisi di `check.mts` rimasti: "titolo con maiuscole all'inglese" sui titoli che contengono Torricelli, Venturi, Pitot, Stokes e Archimede (lezioni e formulari 100 e 101). Sono nomi propri.
- Nella figura `tubo-continuita-diametro` con la velocità d'ingresso a 0,2 m/s la freccia di $v_1$, in scala, è lunga meno di un millimetro.
- Le lezioni hanno formule in evidenza più larghe di 390 px negli esempi svolti: scorrono di lato nel loro riquadro, come nelle lezioni del biennio; la pagina non scorre.
- Il sito di sviluppo era molto lento durante il lotto (carico della macchina sopra 130): gli screenshot sono stati presi aspettando `domcontentloaded` e poi l'SVG, non `networkidle`. La console riporta per ogni pagina di prova due errori che non vengono dalle mie figure ("Encountered a script tag", "Hydration failed") e che compaiono anche con le figure del biennio.
- Il sito di sviluppo sulla porta 3111 ha smesso di rispondere verso la fine del lavoro e non l'ho riavviato. I controlli rimasti indietro sono stati fatti dopo, sul sito tornato sulla porta 3131, un comando alla volta: la pagina intera a 390 px delle lezioni 99, 100 e 101 (come per la 98: nessun errore di KaTeX, nessuna immagine mancante, nessun `$` rimasto nel testo, nessuno scorrimento laterale della pagina; la 101 l'ho anche letta schermata per schermata); la scena `tubo-sezioni` dopo la correzione della cornice, in tre casi (tubo che si stringe in scuro, tubo che si allarga da telefono, tubo in salita da telefono: nessuna etichetta tagliata); `sferette-glicerina-velocita-limite` dopo l'allargamento (la scritta "20 cm" si legge per intero); `bernoulli-tubo-barre` anche all'altro estremo (0,5 m/s, 8 m, 4 cm). Nessun difetto nuovo trovato, nessun file cambiato in questo giro.
- Con questi, ogni figura interattiva è stata vista ai valori iniziali e ai due estremi dei cursori: `tubo-continuita-diametro` (1 cm e 0,6 m/s; 4 cm e 0,2 m/s), `bernoulli-tubo-barre` (2 m/s, 8 m, 2 cm; 0,5 m/s, 8 m, 4 cm; 0,5 m/s, 0 m, 4 cm), `serbatoio-foro-getto` (10, 50, 90 cm), `sferette-glicerina-velocita-limite` (0,5 e 2,0 mm, prima e dopo Avvia).
- Sul sito nuovo compare il banner dei cookie, che copriva le scene negli screenshot: lo script di anteprima nello scratchpad ora lo nasconde subito prima dello scatto.
- `npx tsc --noEmit -p .` sull'intero progetto non è stato lanciato, per il carico della macchina: ho compilato i miei file (figure, scene, modulo comune, generatori, più `interactive.ts` e `scenes/index.tsx`) con un `tsconfig` nello scratchpad che estende quello del progetto, senza errori nei miei file. `npx eslint` sui miei undici file TypeScript è pulito.
- Esercizi: `verify.py` dà PASS su 1000 campioni per livello con i seed 1, 50001 e 777001 per tutti e quattro i generatori; gli errori piantati (indice giusto spostato, opzione giusta cambiata, dato con tre cifre) sono bocciati tutti; `review.mts` e `width.mts` escono con 0. Delle pagine di revisione ne ho guardata una (`fis-viscosita`).
- Durante il lavoro il sito è stato fermo per qualche minuto per una registrazione anticipata di un altro gruppo (`chimica/MetalliTavolaClassi`), poi risolta da loro.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: fluid dynamics (group 38).`:

```ts
'tubo-continuita-diametro': () => import('@/components/content/interactive/fisica/TuboContinuita'),
'bernoulli-tubo-barre': () => import('@/components/content/interactive/fisica/BernoulliTubo'),
'serbatoio-foro-getto': () => import('@/components/content/interactive/fisica/SerbatoioGetto'),
'sferette-glicerina-velocita-limite': () => import('@/components/content/interactive/fisica/SferetteViscose'),
```

`src/components/content/exercises/scenes/index.tsx`, due import in cima (dopo `PianoCartesiano`) e due righe sotto il commento del gruppo 38:

```ts
import TuboSezioni from './TuboSezioni';
import SerbatoioForo from './SerbatoioForo';
'tubo-sezioni': TuboSezioni,
'serbatoio-foro': SerbatoioForo,
```

File nuovi comuni alle mie quattro lezioni: `src/lib/exercises/v2/fis-fluidi-moto.ts` e `scripts/exercises/checkers/_fis_fluidi_moto.py`.

---

## Rapporto del gruppo 39: lezioni 102, 103, 104 (le leggi dei gas)

Lezioni `102-fis-legge-boyle`, `103-fis-leggi-gay-lussac`, `104-fis-gas-perfetto`, ognuna con nota, formulario,
flashcard, figure TikZ, una figura interattiva registrata e il generatore di esercizi con specifica e controllo Python.
File temporanei in `scratchpad/gruppo-39/`.

### Scelte

- Rapporto con la chimica (lezioni 31, 32, 33, 34, 37 e i loro generatori `chim-*` e `gas-ideali`): le tre lezioni la
  richiamano con il link nella prima schermata e non ne ripetono tabelle, esempi e figure. In fisica ci sono: la
  pressione del gas dalle forze sul pistone, le unità SI e il prodotto $pV$ in joule, il piano pressione-volume come
  strumento, la legge di Stevino nei problemi (102); le leggi in gradi Celsius con $\alpha$, lo zero assoluto ricavato
  dal coefficiente comune, il passaggio ai kelvin fatto con il conto, isobara e isocora nel piano (103); la dimostrazione
  di $p_1V_1/T_1 = p_2V_2/T_2$ con due tappe nel piano, $R = 8{,}31$, $pV = N k_B T$, il modello, il gas che esce (104).
- Nomi di figure e scene tutti nuovi: nessuno comincia con `gas-cilindro` (chimica), nessun `chim-*`.
- Confini tra le tre: il valore della costante di Boyle ($nRT$) sta nella 104; la 103 finisce con la tabella delle tre
  trasformazioni; la 102 introduce il piano pressione-volume e il pistone, che le altre due danno per noti.
- Confini con i gruppi vicini: molecole e urti solo come rimando alla 105 e alla 106; il lavoro solo come rimando alla
  109 ("il prodotto $pV$ è un'energia, il motivo arriverà"); la compressione veloce rimanda alla 113.
- Simboli del README. In più: $S$ area del pistone, $h$ la sua altezza, $l$ la colonna d'aria nel tubo (102); $V_0$,
  $p_0$ volume e pressione a $0\,^\circ\text{C}$ e $T_0 = 273\,\text{K}$ (103); massa molare $M$ in g/mol (104).
  $p_0$ è la pressione atmosferica nella 102 (come nel biennio) e la pressione a $0\,^\circ\text{C}$ nella 103: la 103
  lo dice in una riga.
- Nei conti a catena il passaggio intermedio tiene una cifra in più e si arrotonda alla fine (esempio 2 della 102:
  $25{,}1$ cm, non $25{,}0$); i generatori fanno lo stesso con i razionali esatti.
- Nessun blocco `grafico`: i due naturali (isoterma con il cursore del prodotto, retta con il cursore di $V_0$) sono
  già nelle lezioni di chimica, e la figura interattiva della 104 copre le isoterme al variare di $T$.
- Modulo comune ai tre generatori in file nuovi: `src/lib/exercises/v2/fis-gas-leggi.ts` e
  `scripts/exercises/checkers/_fis_gas_leggi.py` (unità dei gas, opzioni, numeri in notazione scientifica oltre i
  razionali esatti di JavaScript, la scena del cilindro). I moduli esistenti sono usati senza modifiche.

### Domande per Andrea

102:
- La pressione del gas dalle forze sul pistone apre la lezione, prima della legge: va bene, o si dà per nota dai fluidi?
- L'esempio del tubo con il mercurio usa i cmHg: al terzo anno si usano ancora, o tutto in pascal?
- Passaggi intermedi con una cifra in più e arrotondamento alla fine: è la regola che vuoi negli esempi a catena?

103:
- "Prima legge" è quella a pressione costante e "seconda" quella a volume costante: è l'ordine dell'Amaldi?
- La forma in gradi Celsius occupa mezza lezione e due livelli degli esercizi: è il peso giusto?
- $p_0$ ha due significati tra biennio e 103: meglio $p_{atm}$ per la pressione atmosferica nel capitolo dei gas?

104:
- La dimostrazione va per isoterma più isobara: è la strada del libro?
- Mole e principio di Avogadro sono richiamati in poche righe con il link alla chimica: basta per chi non li ha fatti?
- Massa molare in g/mol o in kg/mol?

### Da verificare

- Date e nomi: Boyle 1662; Gay-Lussac 1802; Charles "intorno al 1787", non pubblicato; Kelvin 1848; Avogadro 1811;
  "legge di Volta e Gay-Lussac" e "piano di Clapeyron" come nomi usati nei libri italiani.
- Costanti usate: $p_0 = 1{,}01 \cdot 10^5$ Pa (una volta $1{,}013$, per ricavare $R$), $g = 9{,}8$, $d = 1000$ kg/m³,
  $76{,}0$ cmHg, $\alpha = 1/273\,^\circ\text{C}^{-1}$, $-273{,}15\,^\circ\text{C}$, $R = 8{,}31$, $k_B = 1{,}38 \cdot 10^{-23}$,
  $N_A = 6{,}02 \cdot 10^{23}$, volume molare $22{,}4$ L, masse molari $4{,}0$, $28{,}0$, $32{,}0$ g/mol.
- Dati di contorno: pallone sonda a $2{,}5 \cdot 10^4$ Pa e $-50\,^\circ\text{C}$ (circa 10 km); vuoto di laboratorio a
  $10^{-8}$ Pa; coefficienti della lezione 66 usati per il confronto ($2{,}1 \cdot 10^{-4}$ acqua, $3{,}6 \cdot 10^{-5}$
  acciaio).
- Affermazioni qualitative senza numero: l'aria segue Boyle "fino a parecchie atmosfere"; il termometro a gas "per
  molto tempo strumento di riferimento"; il vapore d'acqua vicino a $100\,^\circ\text{C}$ come gas poco perfetto.

### Figure interattive

| Nome | Lezione | Domanda | File |
|---|---|---|---|
| `boyle-pistone-pesetti` | 102 | Ogni pesetto aggiunge la stessa pressione: il pistone scende ogni volta della stessa quantità? | `fisica/BoylePistonePesetti.tsx` |
| `termometro-gas-zero-assoluto` | 103 | A quale temperatura la pressione arriverebbe a zero, e cambia con la quantità di gas? | `fisica/TermometroGasZeroAssoluto.tsx` |
| `gas-perfetto-piano-pv` | 104 | In quanti modi puoi portare il gas da 300 K a 600 K? | `fisica/GasPerfettoPianoPV.tsx` |

Come le ho guardate: sul sito di sviluppo (porta 3111) con `anteprima-interattivo.mjs` e con uno script Playwright
mio (`gruppo-39/shots.mjs`) che preme i bottoni e muove i cursori. La 102 a zero, uno e dieci pesetti, in chiaro, in
scuro e da telefono. La 103 al valore iniziale, dopo aver percorso tutto il cursore, con il prolungamento, con poco e
tanto gas, in chiaro, in scuro e da telefono. La 104 allo stato iniziale, con i vincoli "T fissa" (telefono) e
"p fissa" (scuro), con "V fisso" e 2 moli, e all'angolo del piano con 0,5 moli (240 kPa, 48 L, 2773 K). Nessuna scorre
di lato. Dopo la ripresa le ultime immagini sono state rifatte sulla porta 3131.

Le tre lezioni intere a 390 px (`/prova-grafico/lezione`): nessun errore di KaTeX, nessuna immagine mancante, nessuno
scorrimento laterale.

Tutte le figure TikZ (6, 5 e 3) guardate in chiaro e in scuro con `anteprima.mjs`.

### Pezzi del kit che mancano

- Un pesetto (o un corpo appoggiato) come pezzo: nella 102 e nella scena sono rettangoli grigi disegnati nel file.
- Il manometro a lancetta è in `chimica/gas.tsx`: la 103 lo importa da lì. Starebbe meglio tra i pezzi comuni.
- Un piano cartesiano con tacche numerate per le figure interattive: le tre figure lo compongono con `Axes`, `Ticks`
  e `Words`.
- Il cilindro con il pistone esiste solo come `Piston` (in `liquidi.tsx`): pareti e gas sono ridisegnati in ogni figura.
- `Slider` accavalla l'unità al numero con valori come "1,0 mol": nella 104 l'unità è nell'etichetta.

### Limiti

- Esempi senza esercizio: l'esempio 5 della 102 (il tubo con il mercurio); l'esempio 2 della 103 nella forma a due
  passaggi; gli esempi 2 e 4 della 104 nella parte con la massa molare (già in `gas-ideali` di chimica).
- Il livello 1 di `fis-legge-boyle` (la pressione sotto il pistone) non usa ancora la legge: è il primo passo della
  lezione e prepara il livello 3.
- `fis-gas-perfetto` non ha scene: lo stato finale è l'incognita. Il piano pressione-volume negli esercizi è rimasto
  fuori: il livello 4 di `fis-legge-boyle` chiede gli stati con i numeri, senza grafico.
- Avvisi di `check.mts` rimasti, tutti "titolo con maiuscole all'inglese" su nomi propri: "La legge di Boyle", "Due
  problemi con la legge di Stevino", "Legge di Boyle" (formulario), "Con la temperatura in gradi Celsius" (formulario),
  "Con il numero di molecole: la costante di Boltzmann".
- Errori piantati: la mutazione "un numero del testo cambiato" non è bocciata in pochi campioni dove il dato cambiato
  non sposta il risultato arrotondato (per esempio 2 su 200 nel livello 5 di `fis-legge-boyle`): il campione mutato
  resta un esercizio giusto.
- La pagina di revisione di `review.mts` è stata generata (codice 0) ma non letta esempio per esempio: i campioni
  li ho letti dal JSONL (due per livello e seed diversi).
- La figura interattiva della 102 a dieci pesetti da telefono è stata guardata solo nel tema scuro, e la 104 in scuro
  solo con il vincolo "p fissa".

### Controlli

- `check.mts` sulle tre lezioni con formulario e flashcard: 0 errori, 5 avvisi (i titoli con nomi propri elencati
  sopra).
- `sample.mts <slug> 1000 all <seed> | verify.py`, seed 1, 50001 e 777001: PASS per `fis-legge-boyle`,
  `fis-leggi-gay-lussac` e `fis-gas-perfetto` (5000 campioni per seed ciascuno). Alla prima corsa il livello 4 di
  `fis-gas-perfetto` risultava bocciato per un errore del controllo Python (contava male i caratteri della mantissa):
  corretto il controllo, non il generatore, e rifatti i tre seed.
- Errori piantati, 40 campioni per livello (`gruppo-39/piantati.py`): indice dell'opzione giusta, testo dell'opzione
  giusta, opzione doppia, parole vietate, 200 su 200 bocciati per tutti e tre; scena alterata 80 su 80 (Boyle) e 40 su
  40 (Gay-Lussac); un numero del testo cambiato nell'ultima cifra 198 su 200 (Boyle), 200 su 200 (Gay-Lussac), 144 su
  200 (gas perfetto). Nel gas perfetto i 56 non bocciati sono quasi tutti del livello 1, dove il dato cambiato è una
  pressione di tre cifre e la risposta ne ha due: il campione mutato resta giusto. Non ho piantato una mutazione più
  forte per quel livello.
- `review.mts` e `width.mts`: codice 0 per tutti e tre (opzioni al più 133 px su 252).
- `npx eslint` sui miei otto file TypeScript: pulito.
- `npx tsc --noEmit -p .`: lanciato una volta prima dell'interruzione, uscito con 0 e senza righe di errore. Non
  rilanciato dopo la ripresa, come da istruzioni; dopo quella corsa ho cambiato solo una riga di un controllo Python.
- Scena `cilindro-pistone` guardata in chiaro, in scuro e da telefono (chiaro e scuro), con il corpo, con l'altezza,
  con la linea tratteggiata e con il gas caldo.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: gas laws (group 39).`:

```ts
	'boyle-pistone-pesetti': () => import('@/components/content/interactive/fisica/BoylePistonePesetti'),
	'termometro-gas-zero-assoluto': () => import('@/components/content/interactive/fisica/TermometroGasZeroAssoluto'),
	'gas-perfetto-piano-pv': () => import('@/components/content/interactive/fisica/GasPerfettoPianoPV'),
```

`src/components/content/exercises/scenes/index.tsx`, una riga di import in fondo agli import e una sotto
`// Physics, third year: gas laws (group 39).`:

```ts
import CilindroPistone from './CilindroPistone';
	'cilindro-pistone': CilindroPistone,
```

Nessun altro file condiviso è stato toccato. Da collegare a cura di chi coordina: i tre generatori in
`src/lib/exercises/index.ts` e `config.ts`, i nomi dei livelli in `level-names.ts`.

### File creati

- `docs/lezioni/fisica/{riscritte,note,formulari,flashcard}/102-fis-legge-boyle.md`, `103-fis-leggi-gay-lussac.md`,
  `104-fis-gas-perfetto.md`
- `src/components/content/interactive/fisica/BoylePistonePesetti.tsx`, `TermometroGasZeroAssoluto.tsx`,
  `GasPerfettoPianoPV.tsx`
- `src/components/content/exercises/scenes/CilindroPistone.tsx`
- `src/lib/exercises/v2/fis-gas-leggi.ts`, `src/lib/exercises/v2/generators/fis-legge-boyle.ts`,
  `fis-leggi-gay-lussac.ts`, `fis-gas-perfetto.ts`
- `specs/exercises/fis-legge-boyle.md`, `fis-leggi-gay-lussac.md`, `fis-gas-perfetto.md`
- `scripts/exercises/checkers/_fis_gas_leggi.py`, `fis_legge_boyle.py`, `fis_leggi_gay_lussac.py`,
  `fis_gas_perfetto.py`

---

## Gruppo 40: lezioni 105-108 (teoria cinetica, temperatura microscopica, sistemi termodinamici, energia interna)

Consegnati per ognuna delle quattro lezioni: lezione, nota, formulario, flashcard, figure TikZ, una figura interattiva
registrata, specifica, generatore e controllo Python. Niente commit, niente pubblicazione, niente `tsc` (lasciato a chi
coordina, come da `ripresa.md`).

### Scelte

- 105 e 106: la 105 arriva a $pV = \frac{1}{3} N m v_{qm}^2$ e alla forma con la densità, $v_{qm} = \sqrt{3p/d}$; la 106
  parte dal confronto con $pV = N k_B T$ e dà $K_m = \frac{3}{2} k_B T$, $v_{qm} = \sqrt{3RT/M}$, la distribuzione di
  Maxwell qualitativa (con $v_p$, $\bar v$, $v_{qm}$) e, in una sezione breve, l'energia cinetica di tutte le molecole
  come ponte verso la 108.
- 105: nella dimostrazione la quantità di moto è scritta per esteso ($m v_x$), senza la lettera $p$, che nella lezione è
  la pressione; l'impulso dato alla parete è $2 m v_x$, senza il simbolo $\vec I$. $m$ è la massa di una molecola, $M$
  la massa molare, $d$ la densità.
- 107: le variabili estensive e intensive hanno un paragrafo; le isoterme compaiono solo come curve "stessa
  temperatura" in una figura; trasformazioni reversibili (116), isocora, isobara, isoterma (111) solo con il link. Il
  principio zero, già in un riquadro della 68, qui ha l'enunciato con tre sistemi e il legame con la temperatura.
- 108: "esperienza di Joule" letta come l'espansione libera del 1845; il mulinello (già nella 67) è richiamato in una
  riga. Solo gas monoatomici, detto nel testo e in ogni esercizio; il fattore dei biatomici è rimandato alla 112.
  Aggiunta $U = \frac{3}{2} p V$. Calore e lavoro sono nominati senza formule: il bilancio è della 110.
- Esercizi: i numeri di queste lezioni vanno da $10^{-27}$ a $10^{24}$ e molte risposte sono radici, quindi il modulo
  comune `fis-cinetica.ts` lavora con numeri in virgola mobile arrotondati alle cifre significative e scarta i valori
  vicini a un confine di arrotondamento; il controllo Python rifà i conti con numeri esatti.
- Per i livelli sul piano pressione-volume (107 livello 2, 108 livello 4) ho usato la scena `piano-pv` del gruppo 41,
  senza modificarla.

### Domande per Andrea

- 105: la dimostrazione con la scatola cubica e una molecola alla volta è quella giusta per il terzo anno? La formula
  $p = \frac{1}{3} d\,v_{qm}^2$ sta nella 105 o nella 106?
- 106: tenere velocità più probabile e velocità media con i rapporti $0{,}82$ e $0{,}92$, o solo $v_{qm}$? La coda della
  distribuzione (evaporazione, idrogeno ed elio che sfuggono dall'atmosfera) resta qui?
- 107: estensive e intensive vanno tenute? "Piano pressione-volume" o "piano di Clapeyron"? Il principio zero
  enunciato con "sistemi" e non con "corpi"?
- 108: la definizione di energia interna (energie cinetiche delle molecole più energie potenziali tra le molecole) è
  quella dell'Amaldi? L'interattiva che affianca all'espansione libera quella contro un pistone, dove il gas si
  raffredda, anticipa troppo la 113?

### Da verificare

- Costanti: quelle del README ($R$, $k_B$, $N_A$, 1 atm, 273). Densità dell'aria a 20 °C: $1{,}20\,\text{kg/m}^3$.
- Masse molari usate (g/mol): idrogeno $2{,}02$, elio $4{,}00$, metano $16{,}0$, ammoniaca $17{,}0$, acqua $18{,}0$, neon
  $20{,}2$, azoto $28{,}0$, ossigeno $32{,}0$, fluoro $38{,}0$, argon $39{,}9$, anidride carbonica $44{,}0$, ozono $48{,}0$, butano
  $58{,}1$, cloro $70{,}9$, kripton $83{,}8$, xeno $131$.
- Velocità di fuga dalla Terra $11{,}2$ km/s (deve coincidere con la 97).
- Fatti storici scritti a memoria: Bernoulli, "Hydrodynamica", 1738; Maxwell, distribuzione delle velocità, 1860;
  Joule, espansione libera, 1845; Joule e Thomson pochi anni dopo; Fowler e il nome "principio zero", anni Trenta del
  Novecento.
- 108: "un gas reale che si espande liberamente di solito si raffredda leggermente" (vale per l'espansione libera; non
  va confuso con l'effetto Joule-Thomson, che per idrogeno ed elio a temperatura ambiente ha il segno opposto).

### Figure interattive

Tutte usano un pezzo mio, `interactive/fisica/molecole.tsx`: molecole in una scatola a tre dimensioni vista di
fronte, urti elastici tra loro e con le pareti, velocità distribuite secondo Maxwell, un passo di integrazione scritto
a mano. Lo stato sta nello stato di React e viene copiato a ogni fotogramma (la regola di lint `react-hooks/refs` non
lascia leggere un ref durante il disegno).

| Nome | Lezione | Domanda | Come l'ho guardata |
|---|---|---|---|
| `gas-scatola-urti-pressione` | 105 | Che cosa succede alla pressione se raddoppi le molecole, dimezzi il volume, raddoppi la temperatura? | ferma e in moto, chiaro; estremo alto (80 molecole, 1 L, 600 K) da telefono; estremo basso (10 molecole, 100 K) in scuro |
| `maxwell-velocita-temperatura` | 106 | Da 150 a 600 K di quanto aumenta $v_{qm}$? Cambiando gas, che cosa succede a $K_m$? | ferma in chiaro; neon a 600 K in moto, telefono e scuro; kripton a 150 K in moto, telefono |
| `compressione-lenta-e-brusca` | 107 | Perché una compressione lenta è una linea nel piano pressione-volume e una brusca no? | lenta a metà (chiaro e scuro), lenta finita (telefono), brusca appena fatta (telefono e scuro), brusca finita |
| `espansione-libera-gas` | 108 | Quando il gas si espande nel vuoto, le molecole sono più lente, più veloci o come prima? | partenza in chiaro; nel vuoto finita, telefono e scuro; contro il pistone a metà (200 K, scuro) e finita (500 K, telefono) |

Le quattro lezioni intere sono state aperte a 390 px su `/prova-grafico/lezione`: nessun errore di KaTeX, nessuna
immagine mancante, nessuno scorrimento laterale, le quattro interattive montate.

### Pezzi del kit che mancano

- Un gas di molecole (ora in `fisica/molecole.tsx`, mio): serve anche alla chimica, che ne ha uno suo, e alla 119.
- Un grafico con assi numerati dentro una figura: ho usato `Axes` di `fisica.tsx` con `Ticks` e `Words` di
  `fisica/calore.tsx` (gruppo 20). Un pezzo del kit per l'istogramma non c'è.
- Una barra di energia singola: ho disegnato un rettangolo; `fisica/energia.tsx` fa gruppi di barre con la somma.
- Nella scena `piano-pv` del gruppo 41 la griglia nel tema scuro si vede poco: al livello 2 della 107 lo studente deve
  leggere una pressione a metà tra due etichette (350 kPa), e in scuro è faticoso. Non l'ho toccata.

### Limiti

- `npx tsc` non lanciato (indicazione della ripresa). `eslint` sui miei file: pulito.
- Movimento ridotto: le quattro interattive hanno il ramo senza animazione (un bottone che avanza di un secondo, o lo
  stato finale subito), ma non le ho guardate con `prefers-reduced-motion` attivo.
- `gas-scatola-urti-pressione` non è stata riguardata dopo l'ultima modifica al modulo comune (la distanza di urto tra
  molecole dimezzata, per non gonfiare la pressione contata con 80 molecole); prima della modifica la pressione
  contata all'estremo alto era 8,5 contro 8,0 della formula.
- Nell'espansione contro il pistone della 108 la temperatura finale è quella della simulazione (circa 340 K partendo
  da 500 K), più alta del valore dell'adiabatica quasistatica (315 K) perché il pistone non è lentissimo: il testo non
  dà numeri, la didascalia dà quello della simulazione.
- Esempi rimasti senza esercizio: 105 esempi 2 e 6; 106 esempio 6 e tutta la distribuzione di Maxwell; 107 esempio 4;
  108 esempio 5 (espansione libera).
- Al livello 2 della 105 i problemi diversi sono quindici (uno per gas), al livello 1 della 107 sedici.
- Avvisi rimasti di `check.mts`: 106, "Maxwell" con la maiuscola in un titolo della lezione e del formulario (nome
  proprio); 107, 14 grassetti (soglia 12), tutti termini nel punto in cui sono definiti.
- Quattro figure TikZ della 107 e una della 108 sono larghe 400-445 px: sul telefono vengono rimpicciolite.
- Errori piantati (indice della risposta giusta spostato, dato del testo cambiato, opzione giusta alterata): bocciati
  da `verify.py` in tutti e quattro i generatori; passano solo i campioni che la modifica non ha cambiato e un caso in
  cui il dato cambiato dà la stessa risposta a tre cifre. `review.mts` e `width.mts` escono con 0 per tutti e quattro.
- Il controllo Python ha trovato un vincolo scritto male da me (108 livello 5: la temperatura ricavata dal dato
  arrotondato può arrivare a 1005 K): ho corretto la specifica e il controllo, non il generatore.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: kinetic theory and internal energy (group 40).`:

```ts
	'gas-scatola-urti-pressione': () => import('@/components/content/interactive/fisica/GasScatolaPressione'),
	'maxwell-velocita-temperatura': () => import('@/components/content/interactive/fisica/MaxwellVelocita'),
	'compressione-lenta-e-brusca': () => import('@/components/content/interactive/fisica/CompressioneLentaBrusca'),
	'espansione-libera-gas': () => import('@/components/content/interactive/fisica/EspansioneLibera'),
```

`src/components/content/exercises/scenes/index.tsx`: la riga `import MolecoleVelocita from './MolecoleVelocita';` tra
gli import (dopo `PianoPV`) e, sotto il commento del gruppo 40, `'molecole-velocita': MolecoleVelocita,`.

File nuovi comuni alle mie lezioni: `src/components/content/interactive/fisica/molecole.tsx`,
`src/lib/exercises/v2/fis-cinetica.ts`, `scripts/exercises/checkers/_fis_cinetica.py`.

Da collegare (chi coordina): i quattro generatori in `src/lib/exercises/index.ts` e `config.ts`, i nomi dei livelli in
`level-names.ts` (sono nel file JSON).

---

## Rapporto del gruppo 41: lezioni 109, 110, 111

Lezioni scritte: 109 `fis-lavoro-termodinamico`, 110 `principi-termo`, 111 `fis-trasformazioni-termodinamiche`, ciascuna
con nota, formulario, flashcard, figure TikZ, una figura interattiva registrata e un generatore con specifica e controllo.
Niente è stato pubblicato o committato.

### Scelte

- Confini tra le mie lezioni. La 109 ha tutto quello che riguarda il lavoro: $W = p\,\Delta V$, il segno, l'area nel piano
  pressione-volume (rettangolo, trapezio, quadretti contati per le curve), la dipendenza dal cammino, il lavoro di un
  ciclo come area racchiusa con il segno dal verso. La 110 ha l'enunciato $\Delta U = Q - W$, i segni, la conservazione
  dell'energia, il moto perpetuo di prima specie, calore e lavoro che dipendono dal cammino, e una tabella dei quattro
  casi in cui un termine è zero (sistema isolato, volume costante, adiabatica, ciclo) con i link. La 111 ha $Q$, $W$ e
  $\Delta U$ nell'isocora, nell'isobara e nell'isoterma, il lavoro dell'isoterma con il logaritmo (enunciato), e il
  ciclo studiato tratto per tratto con la tabella.
- Confini con i vicini. Stato, trasformazione quasistatica ed energia interna (107, 108) si richiamano con il link; da 108
  uso $U = \tfrac{3}{2} n R T$ del gas monoatomico. $C_V$ e $C_p$ non sono nominati: nella 111 compaiono solo i
  coefficienti $\tfrac{3}{2}$ e $\tfrac{5}{2}$ per il gas monoatomico, con il link alla 112. L'adiabatica è solo nominata
  (link alla 113), il rendimento rimandato alla 114.
- Simboli del README: $W$ lavoro compiuto dal sistema, $Q$ positivo se assorbito, stati $A$, $B$, $C$, $D$, $V$ in
  ascissa, $R = 8{,}31$ J/(mol·K), $1$ atm $= 1{,}01 \cdot 10^5$ Pa. L'altra convenzione ($\Delta U = Q + W$) è in una nota
  della 110.
- Grafici in kilopascal e litri (il prodotto è il joule, i quadretti si contano), conti degli esempi in pascal e metri
  cubi. Gli stessi due stati $A$ ($2{,}0$ L, $300$ kPa) e $B$ ($6{,}0$ L, $100$ kPa) attraversano 109 e 110: hanno lo
  stesso $p\,V$, e nella 110 questo dà $\Delta U = 0$ e calori diversi sui due cammini.
- Nell'esempio 5 della 111 (il ciclo) i passaggi sono al joule e si arrotonda solo alla fine, altrimenti la somma dei
  calori e quella dei lavori non coincidono.
- Negli esercizi il segno fa parte della risposta ($-5{,}3 \cdot 10^2$ J). Per questo ho scritto un modulo mio,
  `src/lib/exercises/v2/fis-termo-pv.ts` (con `scripts/exercises/checkers/_fis_termo_pv.py`): unità di queste lezioni,
  opzioni con il segno, risultati con il logaritmo, costruttore della scena.

### La scena `piano-pv`

`src/components/content/exercises/scenes/PianoPV.tsx`, registrata come `piano-pv`. Disegna il piano pressione-volume:
foglio a quadretti, tacche numerate, stati come punti con il nome, trasformazioni come linee con la freccia del verso.

```ts
{ type: 'piano-pv', data: {
    V: { unita: 'L', passo: 1, celle: 8, etichette: 1 },        // passo di un quadretto, numero di quadretti, un numero ogni tanti
    p: { unita: 'kPa', passo: 50, celle: 8, etichette: 2 },
    stati: [{ nome: 'A', V: 2, p: 300 }, { nome: 'B', V: 6, p: 300 }, { nome: 'C', V: 6, p: 100 }],
    tratti: [{ da: 'A', a: 'B', tipo: 'retta' }, { da: 'B', a: 'C', tipo: 'retta' }, { da: 'C', a: 'A', tipo: 'isoterma' }],
    area: 'ciclo' } }                                            // solo nella scena della soluzione: 'sotto' oppure 'ciclo'
```

- `tipo`: `retta` (isobara se orizzontale, isocora se verticale, altrimenti un segmento), `isoterma` ($p\,V$ costante),
  `adiabatica` ($p\,V^\gamma$ costante, con `gamma`, per difetto $5/3$). Sulle due curve la linea parte dallo stato `da` e
  arriva al volume dello stato `a`, che deve stare sulla curva.
- Le unità sono testo semplice (`'m³'`, `'10⁵ Pa'`); gli stati possono stare fuori dai nodi della griglia.
- `area: 'sotto'` colora la regione tra ogni tratto e l'asse dei volumi, `area: 'ciclo'` la regione racchiusa. La scena
  del problema non la mette: disegna i dati, non la risposta.
- I nomi degli stati si allontanano da soli dal centro della figura.
- In TypeScript si costruisce con `scenaPV(V, p, stati, tratti, alt, area?)` di `fis-termo-pv.ts`; in Python
  `scene_states` e `on_grid` di `_fis_termo_pv.py` la rileggono e la controllano.

Il gruppo 42 ha registrato una scena sua, `curve-pv`: le due non si sovrappongono nel nome, ma fanno cose vicine, e chi
coordina può decidere di tenerne una.

### Domande per Andrea

109:

- Kilopascal e litri sui grafici e pascal e metri cubi nei conti: va bene il doppio registro, o assi in $10^5$ Pa e
  $10^{-3}\,\text{m}^3$ come l'Amaldi?
- La stima dell'area sotto una curva contando i quadretti è al livello del terzo anno, o meglio rimandare subito alla
  formula dell'isoterma?
- "Più verso destra, meno verso sinistra" e "ciclo orario, lavoro positivo": sono le formulazioni che usi?

110:

- Meglio partire da $\Delta U = Q - W$ o da $Q = \Delta U + W$ ("dove finisce il calore")?
- La nota sull'altra convenzione ($\Delta U = Q + W$ dei libri di chimica) resta o confonde?
- L'esempio 5 usa $\Delta U = \tfrac{3}{2} n R \Delta T$ prima della 111: va bene come ponte con la 108?

111:

- La ripartizione "tre quinti in energia interna, due quinti in lavoro" nell'isobara: la dici così, o aspetti i calori
  molari?
- Il lavoro dell'isoterma enunciato, con il controllo dei quadretti: basta?
- Serve già qui un esempio con un gas biatomico, o resta alla 112?
- Nel ciclo, risultati intermedi al joule e arrotondamento solo alla fine: è la regola che vuoi?
- Per l'isoterma: "bagno a temperatura fissa", "termostato" o "sorgente di calore"?

Esercizi:

- Nell'isoterma manca un livello con la temperatura in gradi Celsius (l'errore dei kelvin è in un riquadro della
  lezione): livello a parte, o metà dei casi del livello 4?
- I livelli 1-3 della 111 hanno solo riscaldamenti: servono i raffreddamenti?
- Al livello 3 della 109 metà degli esercizi chiede il lavoro dell'ambiente sul gas: va bene?

### Da verificare

- $R = 8{,}31$ J/(mol·K), $1$ atm $= 1{,}01 \cdot 10^5$ Pa, $1$ cal $= 4{,}186$ J (README e lezione 67).
- Nella 110, scritto a memoria: il principio formulato "tra il 1842 e il 1850" da Julius Robert Mayer, James Prescott
  Joule e Hermann von Helmholtz.
- Che l'Amaldi scriva $\Delta U = Q - W$ con $W$ lavoro compiuto dal sistema (README).
- Che la 103 del gruppo 39 chiami "prima legge di Gay-Lussac" quella a pressione costante e "seconda" quella a volume
  costante, come scrivo nella 111; che la 108 dia $U = \tfrac{3}{2} n R T$ con questi simboli. Le lezioni 102-108 non
  esistevano ancora quando ho scritto: i link usano gli indirizzi di `url.md`.
- Elio, neon, argon come esempi di gas monoatomici.

### Figure interattive

| Nome | Lezione | Domanda | Come l'ho guardata |
|---|---|---|---|
| `pistone-lavoro-cammini` | 109 | Quanto lavoro compie il gas lungo ciascuno dei tre cammini da $A$ a $B$? | computer chiaro e scuro, telefono chiaro e scuro; i tre cammini, a metà percorso dopo "Percorri", dopo "Torna in A" |
| `primo-principio-bilancio` | 110 | Che cosa succede all'energia interna se il gas assorbe $300$ J e ne spende $300$ in lavoro? E se viene compresso senza calore? | computer e telefono, chiaro e scuro; valori iniziali, i tre bottoni, i due estremi ($Q = 600$, $W = -600$ e viceversa) |
| `trasformazioni-gas-bilancio` | 111 | Dove finisce il calore in ciascuna delle tre trasformazioni? | computer e telefono, chiaro e scuro; le tre trasformazioni, gli estremi dei cursori ($6{,}0$ L, $1{,}5$ L, $150$ K, $600$ K) |

File: `PistoneLavoroCammini.tsx`, `PrimoPrincipioBilancio.tsx`, `TrasformazioniGasBilancio.tsx` in
`src/components/content/interactive/fisica/`. Nella prima e nella terza il cilindro sta sopra il piano pressione-volume con la
stessa scala orizzontale, così la faccia del pistone è sopra il volume del gas, e l'area sotto la linea si colora mentre
il punto la traccia. Nessun blocco `grafico`: le isoterme al variare di $T$ sono della 102.

### Pezzi del kit che mancano

Li ho scritti in un file mio, `src/components/content/interactive/fisica/pianoPV.tsx`, usato dalle tre figure e dalla
scena; possono servire ai gruppi 39, 40, 42, 43:

- `AssiPV`: assi del piano pressione-volume con griglia, tacche numerate e nomi con le unità (il kit non ha ancora assi
  con le tacche);
- `tratto`, `lineaPV`, `areaSotto`, `finoA`, `lavoro`, `Verso`, `PuntoStato`: una trasformazione campionata (retta,
  isoterma, adiabatica), la sua linea, l'area sotto, la parte già percorsa, il lavoro come somma di trapezi, la freccia
  del verso, il punto di uno stato con il nome;
- `Cilindro`: cilindro orizzontale con pistone, stelo, puntini del gas e fermi; `tintaTemperatura` colora il gas dal
  freddo al caldo;
- `BarreSegno`: barre che salgono o scendono da una linea dello zero ($Q$, $W$, $\Delta U$). Le barre di `energia.tsx`
  non hanno valori negativi.

### Limiti

- Il sito di sviluppo sulla porta 3111 è caduto verso le 13:20 (non l'ho fermato io e non ne ho avviato un altro). Le
  figure interattive, la scena e le lezioni 109 e 110 intere le avevo guardate prima; dopo la ripresa, sulla porta 3131,
  ho aperto intere a 390 px la 111 e di nuovo la 110. Per tutte e tre: nessun errore di KaTeX, nessuna immagine mancante,
  nessuno scorrimento laterale della pagina, figure TikZ e interattiva montate. La 109 non l'ho riaperta dopo la ripresa
  (non è cambiata).
- Sul telefono le formule in evidenza più lunghe degli esempi (i conti con le unità) scorrono di lato dentro il loro
  riquadro, come nelle lezioni del biennio, e così la tabella a tre colonne della 111 (la colonna dell'isoterma si vede
  scorrendo): la pagina non scorre.
- La macchina era molto carica (carico medio sopra 100): due volte `anteprima-interattivo.mjs` è andato in timeout, e ho
  rifatto gli screenshot con uno script mio più paziente (`gruppo-41/shot.mjs`, `estremi.mjs`). Un errore di idratazione
  comparso una volta sulla scena non si è ripetuto ricaricando (era il momento in cui la registrazione era stata
  riscritta, vedi sotto).
- Esempi senza esercizio: la stima con i quadretti (109), l'esempio 3 della 110 (calori diversi su due cammini), le
  domande sulla pressione finale dell'isocora (111, esempio 1). Negli esercizi della 111 non ci sono raffreddamenti né
  temperature in gradi Celsius.
- Errori piantati: bocciati tutti, tranne il "dato della scena cambiato" al livello 5 della 109 in 16 casi su 120, dove la
  pressione di $A$ non entra nel lavoro (cammino con l'isocora per prima) e l'esercizio cambiato resta giusto.
- Il controllo indipendente ha trovato un errore vero del generatore della 109 (volumi scritti $10{,}4 \cdot 10^{-3}$),
  corretto.
- Il livello 6 di `fis-trasformazioni-termodinamiche` ha solo 82 esercizi diversi su 1000 (cicli con gli stati sui nodi
  della griglia).
- `npx tsc --noEmit -p .` lanciato una volta, prima dell'interruzione: 0 errori. Dopo ho cambiato solo testo delle
  lezioni e delle specifiche. `npx eslint` sui miei file: pulito. `review.mts` e `width.mts`: codice 0 per i tre
  generatori. `verify.py`: PASS sui tre seed per i tre generatori.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: work, first law, transformations (group 41).`:

```ts
	'pistone-lavoro-cammini': () => import('@/components/content/interactive/fisica/PistoneLavoroCammini'),
	'primo-principio-bilancio': () => import('@/components/content/interactive/fisica/PrimoPrincipioBilancio'),
	'trasformazioni-gas-bilancio': () => import('@/components/content/interactive/fisica/TrasformazioniGasBilancio'),
```

`src/components/content/exercises/scenes/index.tsx`: tra gli import `import PianoPV from './PianoPV';` e, sotto il
commento del gruppo 41, `'piano-pv': PianoPV,`. Queste due righe sono sparite una volta durante il lavoro (un'altra
sessione ha riscritto il file) e le ho rimesse: vanno ricontrollate prima di collegare i generatori.

File nuovi, tutti miei: le tre lezioni con note, formulari e flashcard; `pianoPV.tsx` e i tre componenti in
`interactive/fisica/`; `scenes/PianoPV.tsx`; `v2/fis-termo-pv.ts`; i tre generatori; le tre specifiche; `_fis_termo_pv.py`
e i tre controlli.

---

## Rapporto del gruppo 42: calori molari e trasformazione adiabatica

Lezioni 112 (`fis-calori-molari`) e 113 (`fis-trasformazione-adiabatica`), 6 ottobre 2026.

### Scelte

- 112 contro 108 e 111: la 108 ha $U = \tfrac32 nRT$ del gas monoatomico, la 111 ha isocora e isobara con $Q$, $W$, $\Delta U$. La
  112 le richiama in due righe con il link e aggiunge: calore molare e legame $C = c\,M$ con il calore specifico, $C_V$ dal
  primo principio, $\Delta U = n\,C_V\,\Delta T$ per ogni trasformazione, relazione di Mayer ricavata, gradi di libertà ed
  equipartizione (enunciata), gas biatomici, tabella dei valori misurati, definizione di $\gamma$.
- 113 contro 111, 112 e 116: la 113 usa $C_V$ e $\gamma$ della 112; riprende le tre trasformazioni della 111 solo nella tabella
  finale e usa una volta il lavoro dell'isoterma per un confronto; nomina il ciclo di Carnot con il link.
- Simboli: quelli del README. In più $\ell$ per i gradi di libertà (112), $T_A$, $T_B$, $p_A$, $V_A$ per gli stati.
- La legge $pV^\gamma = \text{costante}$ è enunciata; $TV^{\gamma - 1}$ si ricava con l'equazione di stato; la terza forma
  $T^\gamma p^{1-\gamma}$ è solo scritta. Il lavoro è dato in due forme, $n\,C_V\,(T_A - T_B)$ e
  $(p_A V_A - p_B V_B)/(\gamma - 1)$, la seconda ricavata.
- Esercizi: sei livelli per lezione, scelta multipla con l'unità. Il testo dice se il gas è monoatomico o biatomico ma non dà
  $C_V$ né $\gamma$. Tre cifre significative, due al livello 6 della 113 (differenza di due prodotti vicini). I risultati interi
  che finiscono con zero sono scartati.
- Modulo comune nuovo `src/lib/exercises/v2/fis-calori-adiabatica.ts` e controllo comune
  `scripts/exercises/checkers/_fis_calori_adiabatica.py`; riusano senza modificarli `fis-calore.ts` (arrotondamento, scelta
  delle opzioni) e `_fis_calore.py`.
- La 112 non ha una scena negli esercizi: non c'è una geometria che cambi con i dati. La 113 ha la scena `curve-pv` ai
  livelli 2 e 6.

### Domande per Andrea

112:
- Il simbolo dei gradi di libertà: $\ell$, $f$ o $\nu$?
- La riga del vapore d'acqua nella tabella ($\ell = 6$, accordo solo approssimato) si tiene?
- Negli esercizi lo studente deve ricordare $\tfrac32 R$ e $\tfrac52 R$: va bene, o si scrivono nel testo ai primi livelli?
- Il calore specifico a volume costante per chilogrammo (esempio 4) serve al terzo anno?

113:
- "Legge di Poisson" o "equazioni di Poisson"?
- La terza forma $T^\gamma p^{1-\gamma}$ e la formula $W = (p_A V_A - p_B V_B)/(\gamma - 1)$ sono al livello del terzo anno?
- L'esempio della pompa dà 182 °C, che una pompa vera non raggiunge (la lezione lo dice): si tiene?

### Da verificare

- Calori molari misurati a 25 °C (a memoria dal NIST Chemistry WebBook, $C_V = C_p - R$), in J/(mol K): He e Ar $12{,}5$ e $20{,}8$;
  H₂ $20{,}5$ e $28{,}8$; N₂ $20{,}8$ e $29{,}1$; O₂ $21{,}1$ e $29{,}4$; vapore d'acqua $25{,}3$ e $33{,}6$.
- Masse molari usate: He $4{,}00$, Ne $20{,}2$, Ar $39{,}9$, N₂ $28{,}0$, O₂ $32{,}0$, H₂ $2{,}02$ g/mol.
- Rapporto di compressione del Diesel $18$; assenza delle candele; pressione di $0{,}80$ atm a circa duemila metri; brina
  sull'ugello della bombola di CO₂; vibrazioni attive "a migliaia di kelvin". Tutti a memoria.
- Nomi: "relazione di Mayer", "principio di equipartizione dell'energia", "legge di Poisson".

### Figure interattive

- `calori-molari-due-cilindri` (112, `fisica/CaloriMolariCilindri.tsx`): con lo stesso calore, quale gas si scalda di più,
  quello a volume costante o quello a pressione costante, e dove va il resto? Guardata sul sito di sviluppo in chiaro da
  computer a 1500 J (monoatomico) e in scuro da telefono dopo aver scelto "Biatomico".
- `adiabatica-isoterma-pistone` (113, `fisica/AdiabaticaIsoterma.tsx`): a parità di volume, di quanto si staccano la pressione
  dell'adiabatica e quella dell'isoterma, e a che temperatura arriva il gas isolato? Guardata in chiaro da computer a 1,0 e a
  2,0 L, in scuro da telefono a 0,5 L (estremo basso), in scuro da computer a 4,0 L con il gas biatomico (estremo alto).
- Scena `curve-pv` (`scenes/CurvePV.tsx`): guardata in chiaro da computer (espansione, senza $p_B$) e in scuro da telefono
  (compressione, con $p_B$, pressione in $10^5$ Pa).

### Pezzi del kit che mancano

- Un piano cartesiano con tacche numerate e nomi degli assi con l'unità (lettera in corsivo, unità in tondo): l'ho rifatto a
  mano in `AdiabaticaIsoterma.tsx` e in `CurvePV.tsx` con `Axes` di `fisica.tsx` e `Ticks` e `Words` di `fisica/calore.tsx`.
- Un cilindro con pistone (verticale e orizzontale, con fermi e pareti isolanti): disegnato a mano nelle due figure; lo
  disegnano anche i gruppi dei gas e della termodinamica, e conviene un pezzo comune.
- Una barra impilata con i nomi accanto: `fisica/energia.tsx` ha `EnergyBars`, ma con le barre affiancate e i nomi sotto.

### Limiti

- Sito di sviluppo: sulla porta 3111 ha risposto a tratti (un errore 500 veniva da una registrazione di chimica non mia,
  `MetalliTavolaClassi`). Dopo la ripresa, sulla porta 3131, ho guardato quello che mancava: `calori-molari-due-cilindri`
  agli estremi del cursore (0 J in scuro, 3000 J da telefono) e la scena `curve-pv` da telefono con il rapporto dei volumi 4
  e la pressione finale scritta. Niente da correggere.
- Lezione intera a 390 px (`/prova-grafico/lezione`): nessun errore di KaTeX, nessuna immagine mancante, nessuno scorrimento
  laterale per tutte e due. Lì le figure interattive risultano non montate al mio controllo, e lo stesso succede con la
  lezione 63 già pubblicata: la pagina scorre in un contenitore interno e il mio script non le fa entrare nella vista. Le
  figure le ho guardate da `/prova-fisica`.
- Alla prima apertura di `adiabatica-isoterma-pistone`, sulla 3111 sotto carico, la console ha dato un errore di
  idratazione; non si è ripetuto nelle cinque aperture successive, l'ultima sulla 3131.
- Esempi senza esercizio: 112, esempio 5 (riconoscere il gas dal calore molare); 113, il confronto con il lavoro
  dell'isoterma e la terza forma della legge.
- Nella 113 il livello 5 esce 61% biatomico e 39% monoatomico, perché le compressioni forti di un gas monoatomico superano
  i 1000 K e vengono scartate.
- Un distrattore che cade a meno di $10^{-6}$ da un confine di arrotondamento viene sostituito da un valore di riserva
  ($\pm 20\%$, $\pm 40\%$); per la legge di Boyle e le proporzioni semplici della 113, dove succede spesso, il valore è
  spinto oltre il confine e resta.
- Controlli fatti: `check.mts` 0 errori e 0 avvisi sui sei file; `verify.py` PASS con 1000 campioni per livello ai seed 1,
  50001 e 777001 per i due generatori; errori piantati (indice, opzione giusta, dato, tipo di gas, scena) tutti bocciati,
  tranne 1 dato su 18 nella 113 che cambiato di un centesimo dà lo stesso risultato a tre cifre ed è ancora un esercizio
  valido; `review.mts` e `width.mts` escono con 0; `eslint` pulito; `tsc` lanciato una volta, 0 errori nel progetto.
- I generatori non sono collegati al sito.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: molar heats and adiabatic (group 42).`:

```ts
	'calori-molari-due-cilindri': () => import('@/components/content/interactive/fisica/CaloriMolariCilindri'),
	'adiabatica-isoterma-pistone': () => import('@/components/content/interactive/fisica/AdiabaticaIsoterma'),
```

`src/components/content/exercises/scenes/index.tsx`, una riga tra gli import e una sotto il commento del gruppo 42:

```ts
import CurvePV from './CurvePV';
	'curve-pv': CurvePV,
```

---

## Rapporto del gruppo 43: lezioni 114, 115, 116 (6 ottobre 2026)

Macchine termiche e rendimento, enunciati di Kelvin e di Clausius, teorema e ciclo di Carnot. Per ogni lezione ci sono
lezione, nota, formulario, flashcard, figure TikZ, una figura interattiva registrata, specifica, generatore e controllo
Python. Niente è stato pubblicato né committato.

### Scelte

- Confini tra le tre lezioni. La 114 definisce sorgente, macchina termica, bilancio $W = Q_c - Q_f$ e rendimento, e non
  enuncia il secondo principio: dice solo che $\eta = 1$ vorrebbe $Q_f = 0$, con il link. La 115 dà i due enunciati,
  l'equivalenza e il moto perpetuo, senza temperature nelle formule. La 116 ha reversibilità, teorema di Carnot,
  $\eta_{rev} = 1 - T_f/T_c$ e il ciclo.
- Confini con i vicini. Lavoro come area, primo principio, trasformazione ciclica, isoterma e adiabatica (109-113) si
  richiamano con il link. Il frigorifero entra nella 115 solo con $Q_c = Q_f + W$, quanto serve per Clausius e per la
  dimostrazione; COP e funzionamento restano alla 117. Niente entropia né disuguaglianza di Clausius (118).
- Simboli del README: $Q_c$ e $Q_f$ in valore assoluto, $T_c$ e $T_f$, $\eta = W/Q_c$. In più $\eta_{rev}$ per il
  rendimento delle macchine reversibili. Il rendimento è scritto come numero con due decimali ($0{,}35$), la percentuale
  solo a parole.
- Lo schema della macchina ha le frecce larghe in proporzione all'energia, nelle TikZ, nelle interattive e (a larghezza
  fissa) nella scena degli esercizi. I dispositivi vietati hanno il cerchio tratteggiato. La 117 del gruppo 44 disegna lo
  stesso schema con frecce sottili: i due stili andrebbero uniformati da chi coordina.
- Equivalenza degli enunciati nella versione dei libri: dispositivo che viola Clausius accanto a una macchina vera;
  macchina che viola Kelvin (calore preso dalla sorgente calda) che aziona un frigorifero. Ogni metà ha la versione in
  lettere e un esempio con i numeri.
- Teorema di Carnot dimostrato solo sui numeri (esempio 1 della 116). Rendimento di Carnot enunciato, come da brief; la
  derivazione sta in un riquadro `ad-note` e usa $T\,V^{\gamma-1}$ costante, che nella 113 c'è. Ciclo Otto in un riquadro,
  con figura e formula $1 - 1/r^{\gamma-1}$.
- Esercizi della 115 (lezione qualitativa): tre livelli di ragionamento su casi generati con quattro frasi fisse, poi le due
  metà dell'equivalenza con i numeri. L'ordine dei controlli è quello della lezione: prima il bilancio, poi il secondo
  principio.
- Al livello 6 della 114 uso la scena `piano-pv` del gruppo 41. Al livello 6 della 116 no: su un ciclo di Carnot quella
  scena mette il nome $B$ sopra il punto $D$ (sceglie il lato dei nomi rispetto al centro della figura). Ho scritto una scena
  mia, `ciclo-carnot`, con gli stessi pezzi di `pianoPV.tsx`.

### Domande per Andrea

114
- Il rendimento negli esempi e nelle opzioni va come numero ($0{,}35$) o in percentuale?
- L'esempio 5 dà il calore assorbito del ciclo rettangolare senza calcolarlo (il conto con i calori molari è in un
  riquadro): va bene, o si calcola per intero?
- La tabella dei rendimenti delle macchine vere ha valori indicativi scritti a memoria: tenerla o toglierla finché non ha
  una fonte?

115
- La dimostrazione dell'equivalenza con i numeri accanto a quella in lettere è troppo, o aiuta?
- Nella seconda metà la macchina vietata prende il calore dalla sorgente calda: l'Amaldi fa lo stesso?
- Le frasi delle opzioni "lo vieta Clausius" e "lo vieta Kelvin" bastano?

116
- Il teorema di Carnot dimostrato solo sui numeri basta per il terzo anno?
- Il riquadro con la derivazione di $1 - T_f/T_c$ va tenuto?
- $\eta \le \eta_{rev}$ "con l'uguale solo se la macchina è reversibile": è la forma dell'Amaldi?
- Il ciclo Otto con la formula del rapporto di compressione, o solo la descrizione dei quattro tempi?

### Da verificare

- Benzina: $3{,}2 \cdot 10^7$ J per litro (114, esempio 4).
- Rendimenti tipici (114): locomotiva a vapore meno del 10%, benzina 25-35%, diesel 35-45%, centrale a vapore circa 40%,
  ciclo combinato fino al 60%.
- Date della 115: Clausius 1850, Kelvin 1851. I due enunciati sono parafrasi nella forma dei libri italiani.
- 116: Sadi Carnot, 1824, ventotto anni; centrale con vapore a 550 °C e rendimento reale intorno al 40%; ciclo Otto con
  $\gamma = 1{,}40$, $r = 10$, "i motori reali rendono circa la metà".
- 115, esempio 3: per l'acqua di mare uso densità e calore specifico dell'acqua, e lo dico.

### Figure interattive

| Nome | Lezione | Domanda | Come l'ho guardata |
|---|---|---|---|
| `macchina-termica-flussi` | 114 | Che cosa succede a lavoro e rendimento se, a parità di calore assorbito, la macchina cede meno calore? E se i due calori raddoppiano? | chiaro, scuro, telefono; estremi ($Q_c = Q_f = 200$ J, $Q_f = 100$ J) |
| `equivalenza-kelvin-clausius` | 115 | Che cosa fa l'insieme di una macchina vera e di un dispositivo vietato? Quanto calore scambia in tutto la sorgente fredda? | le due costruzioni, prima e dopo il bottone, chiaro, scuro, telefono; estremi dei due cursori |
| `ciclo-carnot-temperature` | 116 | Da 500 K e 300 K, guadagni di più alzando di 50 K la sorgente calda o abbassando di 50 K quella fredda? | chiaro, scuro, telefono; estremi (600 K e 250 K, 400 K e 350 K) |

Le prime anteprime sono sulla porta 3111, le altre sulla 3131 dopo la caduta del sito. Le tre lezioni intere a 390 px
(porta 3131): nessun errore di KaTeX, nessuna immagine mancante, nessuno scorrimento laterale, figura interattiva montata.
Una volta, sulla 3111 sotto carico, la pagina di prova ha dato un errore di idratazione; non si è ripetuto sulla 3131.

Scene degli esercizi: `macchina-termica` (uno e due dispositivi, con e senza temperature) e `ciclo-carnot`, guardate in
chiaro, scuro e telefono; `piano-pv` del gruppo 41 guardata con un ciclo rettangolare.

### Pezzi del kit che mancano

- Lo schema delle macchine termiche: sorgente, macchina, freccia larga in scala, nome con pedice. Li ho messi in
  `interactive/fisica/flussiCalore.tsx`. Il gruppo 44 ha una scena sua (`sorgenti-calore`) per lo stesso disegno: sono due
  pezzi da unire.
- Nella scena `piano-pv` manca il modo di fissare il lato del nome di uno stato (vedi sopra).
- `Slider` non ha un massimo che dipende da un altro cursore: nella figura della 114 il calore ceduto è limitato nel codice.

### Limiti

- `npx tsc --noEmit -p .` è girato una volta, con 0 errori in tutto il progetto, prima di tre modifiche: la scena nuova
  `CicloCarnotPV.tsx` con la sua registrazione, lo spostamento di due etichette in `CicloCarnot.tsx`, il cambio di scena al
  livello 6 di `fis-ciclo-carnot.ts`. Su questi file c'è solo `eslint` pulito e l'anteprima che funziona: il secondo `tsc`
  non l'ho lanciato, come chiede la nota di ripresa.
- Errori piantati (300-360 campioni per generatore): indice, testo dell'opzione giusta, opzione doppia, parole vietate e
  scena bocciati tutti. Un numero del testo cambiato di 3: bocciati 234 su 237, 248 su 300 e 309 su 360. Quelli passati
  li ho contati per caso e sono campioni che restano giusti: stesso risultato arrotondato (rendimenti a due decimali,
  potenza), oppure uno squilibrio che resta uno squilibrio, oppure un numero che non entra nel conto (attrito, temperatura
  della stanza).
- Esempi senza esercizio: 114 esempio 4 nella parte dei litri di benzina; 115 esempi 1 e 3 (il tè, la nave); 116 esempio 1
  (la dimostrazione del teorema) e il ciclo Otto.
- Avvisi rimasti di `check.mts`: solo "titolo con maiuscole all'inglese" su titoli con nomi propri (Clausius, Kelvin, Carnot,
  Otto).
- Al livello 5 della 115 la risposta coincide con un dato del testo ($Q_f$): è il senso della dimostrazione, ma è segnalato
  nella specifica.
- `review.mts` e `width.mts` escono con 0 per i tre generatori (opzioni al più 231 px su 252). Le pagine di revisione le ho
  guardate per la 115 e la 116, non per la 114.
- I generatori non sono collegati al sito.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: heat engines and Carnot (group 43).`:

```ts
'macchina-termica-flussi': () => import('@/components/content/interactive/fisica/MacchinaTermicaFlussi'),
'equivalenza-kelvin-clausius': () => import('@/components/content/interactive/fisica/EquivalenzaEnunciati'),
'ciclo-carnot-temperature': () => import('@/components/content/interactive/fisica/CicloCarnot'),
```

`src/components/content/exercises/scenes/index.tsx`, due import in cima e due righe sotto il commento del gruppo 43:

```ts
import MacchinaTermica from './MacchinaTermica';
import CicloCarnotPV from './CicloCarnotPV';
'macchina-termica': MacchinaTermica,
'ciclo-carnot': CicloCarnotPV,
```

File nuovi fuori dalle lezioni: `interactive/fisica/flussiCalore.tsx`, `MacchinaTermicaFlussi.tsx`,
`EquivalenzaEnunciati.tsx`, `CicloCarnot.tsx`; `exercises/scenes/MacchinaTermica.tsx`, `CicloCarnotPV.tsx`;
`src/lib/exercises/v2/fis-macchine.ts`; `scripts/exercises/checkers/_fis_macchine.py`. Uso senza modificarli
`interactive/fisica/pianoPV.tsx` e la scena `piano-pv` del gruppo 41.

---

## Rapporto del gruppo 44: lezioni 117, 118, 119

Frigoriferi e pompe di calore, L'entropia, Entropia e disordine. Per ognuna: lezione, nota, formulario, flashcard,
figure TikZ, una figura interattiva registrata, generatore con specifica e controllo Python.

### Scelte

- 117: il README dice solo "COP". Ho distinto $\text{COP}_f$ (frigorifero) e $\text{COP}_p$ (pompa di calore), con
  $\text{COP}_{f,max}$ e $\text{COP}_{p,max}$ per la macchina reversibile. $Q_c$, $Q_f$, $W$ in valore assoluto. I
  coefficienti massimi sono ricavati da $Q_f/Q_c = T_f/T_c$, preso come risultato della 116; che la macchina
  reversibile sia il miglior frigorifero è enunciato. Nell'esempio 4 il tempo non si chiama $\Delta t$, che lì è la
  variazione di temperatura.
- 118: $\Delta S = Q/T$ con $Q$ che porta il segno del primo principio, mentre $Q_c$ e $Q_f$ restano in valore
  assoluto; la lezione dice dove passa da una convenzione all'altra. Disuguaglianza di Clausius enunciata, con il caso
  delle due sorgenti ricavato dal teorema di Carnot. La funzione di stato è argomentata con il ciclo di due
  trasformazioni reversibili. $\Delta S = m\,c \ln(T_B/T_A)$ è enunciata. Il lavoro perduto $T_f\,\Delta S_{univ}$ chiude
  la lezione.
- 119: il numero di microstati è $\Omega$ ("molteplicità"), non $W$; un riquadro dice che molti libri scrivono
  $S = k_B \ln W$. Le molecole a sinistra e a destra sono $N_s$ e $N_d$, perché $n$ sono le moli. Il fattoriale è
  introdotto nella lezione e la formula $N!/(N_s!\,N_d!)$ è data senza dimostrazione. Terzo principio in un riquadro.
- Confini tra le mie lezioni: niente entropia nella 117; niente microstati nella 118; nella 119 niente $Q/T$, solo il
  richiamo di $n\,R \ln(V_B/V_A)$ per mostrare che i due conti coincidono.
- Esercizi: le variazioni di entropia portano sempre il segno, anche il più. I risultati interi che finirebbero con
  uno zero si scartano.

### Domande per Andrea

117
- $\text{COP}_f$ e $\text{COP}_p$ vanno bene, o l'Amaldi usa un solo COP e un altro nome per la pompa di calore?
- Il circuito con evaporatore, compressore, condensatore e valvola è al livello del terzo anno?

118
- $\Delta S = m\,c \ln(T_B/T_A)$, enunciata, resta nel terzo anno? Da lei dipende il livello 4 degli esercizi.
- Il lavoro perduto e il "degrado dell'energia" sono al livello giusto?
- "Universo" per sistema più ambiente è la parola del libro?

119
- $\Omega$ o $W$ per il numero di microstati?
- La formula con i fattoriali prima del calcolo combinatorio di matematica va bene, o ci si ferma ai casi contati a mano?

### Da verificare

- Costanti: $R = 8{,}31$, $k_B = 1{,}38 \cdot 10^{-23}$, $N_A = 6{,}02 \cdot 10^{23}$, $c = 4186$, $L_f = 3{,}34 \cdot 10^5$,
  $L_v = 2{,}26 \cdot 10^6$, $0\,^\circ\text{C} = 273\,\text{K}$ (README e lezioni 67 e 70).
- Le lezioni 111, 114, 115, 116 e 104 erano in scrittura in parallelo e non le ho lette. Da allineare: il lavoro
  dell'isoterma $W = n\,R\,T \ln(V_B/V_A)$ (111), la relazione $Q_f/Q_c = T_f/T_c$ (116), la costante di Boltzmann (104,
  dove punta il link della 119).
- Scritti a memoria: la descrizione del circuito del frigorifero; *coefficient of performance*; Boltzmann "fisico
  austriaco, seconda metà dell'Ottocento"; Nernst "chimico tedesco, inizio del Novecento" e i due enunciati del terzo
  principio; "in un bicchiere d'aria circa $10^{22}$ molecole".
- Negli esempi 2 e 4 della 117 i coefficienti 3,5 e 2,5 sono ordini di grandezza plausibili, non dati di un apparecchio.

### Figure interattive

| Nome | Lezione | Domanda | File |
|---|---|---|---|
| `frigorifero-cop-temperature` | 117 | Se le due temperature si allontanano, che cosa succede al lavoro per spostare lo stesso calore? | `fisica/FrigoriferoCop.tsx` |
| `entropia-universo-due-sorgenti` | 118 | Che cosa succede all'entropia dell'universo se le temperature si avvicinano, e se il calore va dal freddo al caldo? | `fisica/EntropiaDueSorgenti.tsx` |
| `molecole-due-meta-microstati` | 119 | Tolta la parete, le molecole tornano mai tutte a sinistra? | `fisica/MolecoleDueMeta.tsx` |

Guardate con `anteprima-interattivo.mjs` e con uno script di Playwright: in chiaro, in scuro, da telefono, agli
estremi dei cursori, dopo i bottoni (pompa di calore, verso invertito, temperature uguali, parete tolta con 4, 20 e 60
molecole, "Ferma"). Le tre lezioni intere a 390 px su `prova-grafico/lezione` (porta 3131): nessun errore di KaTeX,
nessuna immagine mancante, nessuno scorrimento laterale, le tre figure montate, console pulita.

Dopo l'ultima modifica a `MolecoleDueMeta.tsx` (il tempo "tutte a sinistra" si conta da quando la prima molecola
attraversa la metà) ho rivisto la figura solo dentro la lezione, ferma, non di nuovo con 60 molecole in moto.

Scene degli esercizi guardate in chiaro e in scuro da telefono: `sorgenti-calore`, `scatola-molecole` (6 e 2, 0 e 10)
e `macchina-termica` del gruppo 43 con i miei dati (frigorifero, pompa, macchina reale).

### Pezzi del kit che mancano

- Sorgente di calore, macchina tra due sorgenti, freccia larga quanto l'energia: li ho messi in
  `interactive/fisica/sorgenti.tsx`. Il gruppo 43 ha scritto in parallelo `interactive/fisica/flussiCalore.tsx` con pezzi
  quasi uguali. Sono due doppioni da unire.
- Barre con il segno (sopra e sotto lo zero): `fisica/energia.tsx` ha solo barre positive; le mie sono dentro
  `EntropiaDueSorgenti.tsx`.
- Molecole in una scatola: ho usato `particle` e `step` di `chimica/gas.tsx`. Andrebbero in un posto comune a fisica e
  chimica.
- `QuantityText` di `fisica/liquidi.tsx` scrive il pedice in tondo ($Q_\text{f}$), le lezioni in corsivo.

### Limiti

- Esempi senza esercizio: 117, esempio 2 (potenza della pompa di calore e confronto con la stufa) e la seconda parte
  dell'esempio 4 (il tempo dalla potenza); 119, esempio 5 (la freccia del tempo).
- Nella scena `macchina-termica` il nome nel cerchio è "frigorifero", "pompa" o "macchina": "congelatore" e
  "condizionatore" non ci stanno.
- Errori piantati (12 esercizi per livello, seed da 101): indice, opzione doppia, testo dell'opzione giusta, parole
  vietate, dati della scena, passaggi tolti bocciati sempre. Un dato del testo cambiato di uno: 72 su 72 e 48 su 48
  nei frigoriferi e nel disordine, 70 su 72 nell'entropia (al livello 1 due temperature vicine danno la stessa
  risposta a tre cifre).
- Avvisi rimasti di `check.mts`: due titoli di formulario con un nome proprio ("Disuguaglianza di Clausius",
  "Equazione di Boltzmann").
- `width.mts` misura problema e opzioni (al più 123 px su 252), non i passaggi: alcuni passaggi sono lunghi come
  quelli degli altri generatori di fisica.
- `npx tsc --noEmit -p .` lanciato una volta sola, prima dell'avviso di non lanciarlo: 0 errori nell'intero progetto.
  Dopo ho cambiato una riga di `fis-frigoriferi.ts` (il nome nella scena), controllata con eslint e con i tre seed.
- Il sito sulla 3111 è caduto due volte durante il lavoro (una per la registrazione anticipata di
  `chimica/MetalliTavolaClassi`, non mia); le ultime anteprime sono sulla 3131.

### File condivisi toccati

`src/lib/utils/interactive.ts`, sotto `// Physics, third year: refrigerators and entropy (group 44).`:

```ts
'frigorifero-cop-temperature': () => import('@/components/content/interactive/fisica/FrigoriferoCop'),
'entropia-universo-due-sorgenti': () => import('@/components/content/interactive/fisica/EntropiaDueSorgenti'),
'molecole-due-meta-microstati': () => import('@/components/content/interactive/fisica/MolecoleDueMeta'),
```

`src/components/content/exercises/scenes/index.tsx`, due import dopo quello di `MacchinaTermica` e, sotto il commento
del gruppo 44:

```ts
import SorgentiFlussi from './SorgentiFlussi';
import ScatolaMolecole from './ScatolaMolecole';

'sorgenti-calore': SorgentiFlussi,
'scatola-molecole': ScatolaMolecole,
```

### File nuovi

- `docs/lezioni/fisica/{riscritte,note,formulari,flashcard}/117-fis-frigoriferi.md`, `118-fis-entropia.md`,
  `119-fis-entropia-disordine.md`
- `src/components/content/interactive/fisica/`: `sorgenti.tsx`, `FrigoriferoCop.tsx`, `EntropiaDueSorgenti.tsx`,
  `MolecoleDueMeta.tsx`
- `src/components/content/exercises/scenes/`: `SorgentiFlussi.tsx`, `ScatolaMolecole.tsx`
- `src/lib/exercises/v2/fis-frigo-entropia.ts` e `generators/`: `fis-frigoriferi.ts`, `fis-entropia.ts`,
  `fis-entropia-disordine.ts`
- `scripts/exercises/checkers/`: `_fis_frigo_entropia.py`, `fis_frigoriferi.py`, `fis_entropia.py`,
  `fis_entropia_disordine.py`
- `specs/exercises/`: `fis-frigoriferi.md`, `fis-entropia.md`, `fis-entropia-disordine.md`
