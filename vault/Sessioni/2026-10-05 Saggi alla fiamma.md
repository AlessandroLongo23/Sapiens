---
aggiornato: 2026-10-05
tag: [sessione, laboratori, chimica]
---
# Saggi alla fiamma

5 ottobre 2026. Alessandro ha chiesto di procedere con gli altri esperimenti del laboratorio di chimica come per il primo: rileggere il codice del solfato di rame, prendere il prossimo esperimento della lista, scrivere un piano completo (allestimento, strumenti, interazioni, modelli 3D) ed eseguirlo in autonomia, con test e revisori critici. Il prossimo della lista in `src/lib/lab/catalog.ts` è "Saggi alla fiamma".

## Conflitto con una decisione
[[2026-09-29 Il primo traguardo dei laboratori è il motore, in un laboratorio libero senza esperimenti]] dice che gli esperimenti vengono dopo il motore. Questo lavoro ne aggiunge uno prima. Per andare comunque nella direzione del motore, la chimica del nuovo esperimento è un modulo senza grafica (`src/lib/lab/saggi.ts`): un catalogo di ioni e uno stato che cambia solo con azioni, come chiede [[2026-09-29 Il motore dei laboratori è stato serializzabile cambiato solo da azioni]]. Il solfato di rame resta com'era.

## Cosa si impara dal primo esperimento
- Un esperimento è una classe sopra `FreeLab` (`esperimento.ts`): dà a `free.uses` le azioni possibili su ciò che il mirino punta, con quello che le mani tengono; i passi sono fasi con un `check` sullo stato, e il quaderno le spunta quando il banco ci arriva.
- Gli oggetti sono nodi con un nome nel GLB; `grasp.ts` dice come si tengono (`SHAPES` per i solidi di rotazione, `HOLDS` per gli altri), `grips.json` le prese regolate a mano.
- Il kit del solfato è dentro i GLB delle stanze (`esperimento.glb`, `aula.glb`), cotto insieme alla luce. Un secondo esperimento fatto allo stesso modo chiederebbe due stanze in più e due cotture.

## Piano

### 1. L'esperimento
Sette sali noti (LiCl, NaCl, KCl, CaCl₂, SrCl₂, BaCl₂, CuCl₂), una miscela NaCl + KCl e due campioni incogniti. Lo studente pulisce un'ansa al nichel-cromo nell'acido cloridrico e nella fiamma, tocca un sale, lo porta sul bordo della fiamma azzurra e guarda il colore. Il sodio copre il potassio: con il vetro al cobalto il giallo sparisce e si vede il potassio. Alla fine riconosce i due incogniti.

Passi del quaderno:
1. Sicurezza: occhiali.
2. Accendi il becco Bunsen e porta la fiamma all'azzurro (stesse regole del primo esperimento).
3. Pulisci l'ansa: acido, poi fiamma finché non si colora più. L'ansa parte con tracce di sodio, quindi la prima volta la fiamma diventa gialla.
4. Saggia i sette sali, in qualunque ordine. Il quaderno scrive il colore accanto a ogni sale visto con l'ansa pulita.
5. Sodio e potassio insieme: la miscela a occhio nudo, poi attraverso il vetro al cobalto.
6. Riconosci i campioni X e Y: la risposta si scrive sul cartellino del campione con la rotella e si conferma con Q o E.
7. Riordina: gas chiuso, ansa sul banco. Poi i risultati nel quaderno.

### 2. La simulazione sotto i passi
- Ansa: quanto di ogni ione ha addosso, se è bagnata di acido, la temperatura.
- Acido: toglie l'80% di quello che c'è sull'ansa e la bagna.
- Campione: l'ansa bagnata prende una dose piena, asciutta un quarto. Un'ansa sporca contamina il campione, e il campione resta contaminato.
- Fiamma: ogni ione emette con una sua intensità (il sodio molto più degli altri, il potassio poco) e brucia via in qualche secondo (il sodio più lentamente). Il colore della fiamma è la media pesata. Con la fiamma gialla del becco i colori non si vedono.
- Un'osservazione vale se un colore domina per più di un secondo; se è sporca il quaderno non la segna e lo dice.
- Errori che finiscono nei risultati: gas aperto a lungo senza fiamma, campione contaminato, saggio con l'ansa sporca, risposta sbagliata al primo tentativo.

### 3. Strumenti e modelli 3D (Blender, da codice)
Nuovi, in `scripts/lab/build_fiamma.py`:
- Ansa al nichel-cromo (`WireLoop`): manico di vetro, ghiera, filo con l'occhiello; la punta ha un materiale suo, che la pagina fa diventare rovente; una crosta di sale che compare quando l'ansa è carica.
- Portacampioni (`SampleTray`): vassoio di legno con dieci sedi su due file, una targhetta per ogni sale, dieci vetrini da orologio con il mucchietto di sale (bianco, verde-azzurro per il cloruro di rame).
- Cartellini di X e Y (`AnswerX`, `AnswerY`): la faccia è una texture scritta dalla pagina.
- Vetro al cobalto (`CobaltGlass`): lastrina blu 5 × 5 cm.
- Becher con HCl e bottiglia di HCl (riuso di `beaker` e `reagent_bottle` con un'altra etichetta).

Riusati dalla stanza: becco Bunsen, rubinetto, tubo, piastra, accendigas, occhiali, quaderno.

### 4. Allestimento
Il kit è un GLB a parte (`public/lab/kit/saggi-alla-fiamma.glb`), nelle coordinate della postazione, uguali nel banco singolo e nell'aula. La pagina carica la stanza, toglie i pezzi del solfato che non servono e aggiunge il kit. Niente stanze nuove e niente cotture. Il vassoio sta a destra della piastra, l'acido e l'ansa a sinistra, il vetro al cobalto davanti a sinistra.

### 5. Interazioni
- Ansa in mano sul becher di HCl: "Immergi nell'acido".
- Ansa in mano su un campione: "Tocca il sale".
- Ansa in mano sul becco acceso: "Porta nella fiamma"; resta lì finché lo stesso tasto non la toglie.
- Vetro al cobalto in mano: il tasto della sua mano lo alza davanti agli occhi e lo abbassa.
- Cartellino di un incognito: la rotella sceglie la risposta, Q o E la conferma.
- Rubinetto, ghiera, accendigas, occhiali: come nel primo esperimento.

### 6. Effetti
- Un pennacchio colorato che sale dall'ansa, la luce della fiamma che prende il colore, la punta dell'ansa che diventa rovente, uno sbuffo di vapore quando l'ansa calda entra nell'acido.
- Il vetro al cobalto è un filtro davanti alla camera: scurisce la scena di blu, spegne il giallo del sodio e lascia il lilla del potassio.

### 7. Codice
- `src/lib/lab/saggi.ts`: ioni, colori, stato e azioni, senza three.js.
- `src/components/lab/engine/saggi.ts`: l'esperimento sopra `FreeLab`.
- `scene.ts`: kit a parte, fiamma senza reticella, i nomi nuovi.
- `effects.ts`: il pennacchio e la tinta della fiamma.
- `grasp.ts`, `grips.json`: prese dell'ansa e del vetro.
- `Esperimento.tsx`, `LabSession.tsx`, la pagina e `catalog.ts`: l'esperimento scelto dal menu.

### 8. Verifica
- Test unitari della chimica (`tests/unit/lab-saggi.test.mjs`).
- Un test nel browser senza schermo (`scripts/lab/fiamma.mjs`) che fa l'esperimento dall'inizio alla fine nelle due stanze, misura dove arriva l'ansa e salva i fotogrammi di ogni colore.
- Revisori critici sui fotogrammi: modelli, colori delle fiamme, leggibilità, testi.
- Controllo che il solfato di rame funzioni ancora (`scripts/lab/usi.mjs`).

## Esito
Fatto tutto il piano. L'esperimento è nel menu come pronto, a `/laboratorio/chimica/saggi-alla-fiamma`, nel banco singolo e nell'aula. Nel codice locale, non committato. La descrizione di come funziona è in [[Laboratori]], sezione "Il secondo esperimento".

File nuovi:
- `scripts/lab/build_fiamma.py` e `public/lab/kit/saggi-alla-fiamma.glb` (0,7 MB): i modelli.
- `src/lib/lab/saggi.ts`: la chimica. `src/components/lab/engine/saggi.ts`: l'esperimento.
- `tests/unit/lab-saggi.test.mjs` e `scripts/lab/fiamma.mjs`: i test.
- `public/lab/copertine/kit-fiamma.webp`: la foto del menu.

File cambiati: `scene.ts` (kit a parte, fiamma senza reticella, vetro blu), `effects.ts` (pennacchio, fiamma più alta), `grasp.ts` e `grips.json` (ansa e vetro), `notebook.ts` (risultati non barrati), `Esperimento.tsx`, `LabSession.tsx`, la pagina della sessione, `LabMenu.tsx` (didascalia della foto) e `catalog.ts`.

Cosa è cambiato rispetto al piano:
- Il becher di HCl, l'ansa e il vetro stanno vicino al becco: nella prima disposizione la mano destra non arrivava all'acido, e lo studente avrebbe camminato avanti e indietro a ogni sale.
- Un campione contaminato si può cambiare: si punta il vetrino e si preme il tasto della mano libera. Senza, un sale noto sporcato di sodio non si poteva più vedere pulito e il passo 4 non finiva mai (trovato dal revisore).
- Dopo una risposta sbagliata il campione va rimesso nella fiamma prima di rispondere ancora, e per il campione Y serve prima il vetro: altrimenti le otto risposte si provavano a tentativi.
- Il test disegna da sé i fotogrammi del gioco, perché nel browser senza schermo si fermavano a tratti.
- Mentre l'ansa è nella fiamma lo sguardo si avvicina da solo e il pennacchio è più alto del vero: il secondo revisore ha misurato una fiamma colorata alta 45 pixel su 800.

Verifiche, tutte passate il 5 ottobre: 13 test unitari; 116 controlli su 116 di `fiamma.mjs` in quattro configurazioni (banco singolo e aula, ansa a destra e a sinistra); 10 azioni su 10 del solfato di rame; `tsc` ed `eslint` puliti sui file del laboratorio. Due giri di revisori critici sui fotogrammi e uno su chimica, testi e flusso.

## Dopo la prova di Alessandro
Alessandro lo ha provato lo stesso giorno: gli piace, e ha chiesto una sola correzione, la presa del vetro al cobalto. Stava nel palmo; va tenuto a pinza per un angolo tra pollice, indice e medio, a riposo e davanti alla fiamma, come nella foto che ha mandato. Fatto: vedi [[Laboratori]], "La presa del vetro al cobalto".

Terza correzione, sul movimento: quando il vetro andava davanti alla fiamma si vedevano due vetri, quello in mano e una lastra più grande che saliva dal basso. Ora il vetro è uno solo, quello in mano, e la mano lo porta davanti agli occhi e lo riporta giù; il filtro blu sta sul vetro stesso. `fiamma.mjs` salva anche i fotogrammi della salita.

## Da confermare con Alessandro
- Se va bene avere un secondo esperimento prima del motore e del laboratorio libero (vedi "Conflitto con una decisione").
- Se il kit a parte diventa la regola anche per il solfato di rame, con le stanze senza kit.
- La presa dell'ansa, da regolare nel playground se non convince.

## Da fare
- Le domande di chimica sono in [[Domande per Andrea]], sezione "Laboratorio: saggi alla fiamma".
- Gli altri script di misura (`usi.mjs`, `versa.mjs`, `imbuto.mjs`, `ossido.mjs`, `pad.mjs`) usano ancora i fotogrammi del browser: vanno portati al modo di `fiamma.mjs`.
- Uno spettroscopio, per vedere le righe e non solo il colore.
