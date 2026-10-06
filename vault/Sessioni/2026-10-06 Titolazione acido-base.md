---
aggiornato: 2026-10-06
tag: [sessione, laboratori, chimica]
---
# Titolazione acido-base

6 ottobre 2026. Alessandro ha chiesto il terzo esperimento del laboratorio di chimica, con la stessa sequenza dei saggi alla fiamma: rileggere i due esperimenti fatti, scrivere il piano, costruire i modelli in Blender, poi allestimento e codice, con test e revisori critici. Il terzo della lista in `src/lib/lab/catalog.ts` è "Titolazione acido-base".

## Conflitto con una decisione
Lo stesso della sessione [[2026-10-05 Saggi alla fiamma]]: [[2026-09-29 Il primo traguardo dei laboratori è il motore, in un laboratorio libero senza esperimenti]] mette gli esperimenti dopo il motore, e questo è il terzo prima del motore. Alessandro lo ha chiesto dopo averlo saputo, quindi si procede; la decisione va aggiornata quando lui conferma. Come per i saggi, la chimica è un modulo senza grafica con uno stato cambiato solo da azioni (`src/lib/lab/titolazione.ts`).

## Cosa si riusa dai primi due esperimenti
- La classe sopra `FreeLab` con i passi a fasi, il quaderno, i messaggi, le note per i risultati (`saggi.ts`).
- Il kit in un GLB a parte aggiunto alla stanza (`Kit` in `scene.ts`).
- La pipetta tarata da 25 mL con la propipetta e la lente sul menisco (primo esperimento): stessa meccanica, qui sul campione di acido.
- La beuta da 250 mL, il becher da 100 mL e quello da 50 mL, con le loro prese già regolate.
- `free.pour` per versare, lo stato "una mano resta impegnata finché lo stesso tasto non la libera" dell'ansa nella fiamma.

## Piano

### 1. L'esperimento
Si trova la concentrazione di un acido cloridrico incognito con idrossido di sodio 0,100 mol/L e fenolftaleina. Il campione cambia a ogni partita (tra 0,052 e 0,074 mol/L, quindi tra 13 e 18,5 mL di NaOH per 25,0 mL di acido).

Passi del quaderno:
1. Sicurezza: occhiali.
2. Prepara la buretta: NaOH dal becher, attraverso l'imbutino, fin sopra lo zero; via l'imbuto; rubinetto aperto sul becher degli scarti finché dalla punta esce l'aria; menisco sullo zero o poco sotto.
3. Il campione: 25,0 mL di acido nella beuta 1 con la pipetta tarata, poi due gocce di fenolftaleina.
4. Titolazione di prova: beuta sotto la buretta, lettura iniziale, NaOH agitando finché il rosa resta, lettura finale.
5. Seconda titolazione, accurata: buretta di nuovo piena, beuta 2, veloce fino a un millilitro prima del valore di prova e poi goccia a goccia.
6. Terza titolazione: come la seconda, con la beuta 3. Le due accurate devono stare entro 0,20 mL.
7. Riordina: rubinetto chiuso, mani libere. Poi i risultati: tabella delle letture, media delle due accurate, calcolo della concentrazione, confronto con il valore vero.

### 2. La simulazione sotto i passi
- Buretta: un livello in mL sulla scala (0 in alto, 25 in basso), con spazio sopra lo zero; una bolla d'aria nella punta finché non si spurga.
- Beuta: volume, moli di acido, moli di base già mescolate, moli di base appena cadute e non ancora mescolate, gocce di indicatore.
- La base appena caduta fa una nuvola rosa dove cade. Si mescola in fretta se la beuta è agitata, piano se è ferma, e sempre più piano vicino all'equivalenza: è il segnale che il viraggio è vicino.
- Colore della soluzione: incolore finché l'acido è in eccesso; oltre l'equivalenza un rosa che cresce con i millilitri di troppo (una goccia, 0,05 mL: rosa pallido; 0,3 mL: fucsia).
- Rubinetto: la rotella lo apre da goccia a goccia a filo continuo; un tasto fa cadere una sola goccia o lo chiude di colpo.
- Lettura: lo studente legge lui il menisco su una lente con la scala e scrive il valore con la rotella, a passi di 0,05 mL. Vale se è entro 0,05 mL dal vero, e nel calcolo entra il valore che ha scritto lui.
- Errori che finiscono nei risultati: lettura sbagliata al primo tentativo, viraggio superato (di quanto), titolazioni accurate non concordanti, più di quattro gocce di indicatore.
- Blocchi, per non restare in un vicolo cieco con tre beute sole: il rubinetto non si apre su una beuta senza campione o senza indicatore, né prima della lettura iniziale; una beuta già titolata non si riusa; una seconda pipettata nella stessa beuta è rifiutata. Le bottiglie di scorta riempiono di nuovo i due becher.

### 3. Strumenti e modelli 3D (Blender, da codice)
Nuovi, in `scripts/lab/build_titolazione.py`:
- Sostegno con base, asta e pinza per burette, e una piastrella bianca sulla base (per vedere il rosa).
- Buretta da 25 mL: tubo graduato ogni 0,1 mL con i numeri a ogni millilitro, rubinetto con la chiave che ruota, punta. Raggio interno 6 mm, quindi 25 mL in 22,1 cm: più corta di una vera, perché lo zero resti sotto gli occhi di chi sta in piedi.
- Imbutino per buretta, piccolo, già nella bocca della buretta.
- Tre beute da 250 mL numerate.
- Becher con NaOH 0,100 M e becher con il campione di HCl (100 mL ciascuno), becher degli scarti da 50 mL, già sotto la buretta.
- Flacone contagocce di fenolftaleina.
- Bottiglie di scorta di NaOH e del campione.
- Pipetta tarata con propipetta: il modello del primo esperimento.

Dalla stanza restano occhiali, quaderno, rubinetto del gas (non serve). Si tolgono becco Bunsen, tubo, accendigas, piastra e i pezzi del solfato.

### 4. Allestimento
Il sostegno al centro della postazione, dove stava il becco; la buretta sopra la piastrella. A sinistra il campione, il becher di NaOH e la pipetta distesa; a destra le tre beute e il contagocce; dietro a sinistra le bottiglie di scorta.

### 5. Interazioni
- Becher di NaOH in mano sulla buretta o sull'imbuto: "Versa nella buretta" (si ferma da sé sopra lo zero).
- Imbuto: si prende e si posa, come nel primo esperimento; rimesso sulla buretta si incastra nella bocca.
- Pipetta in mano sul campione: immergi, la rotella aspira, un tasto conferma sulla tacca; sulla beuta: svuota.
- Contagocce in mano sulla beuta: una goccia a ogni pressione.
- Beuta o becher degli scarti in mano sul sostegno: "Metti sotto la buretta", e va nel punto giusto.
- Rubinetto della buretta: la rotella regola, Q o E con una mano libera fa cadere una goccia o chiude.
- Beuta sotto la buretta, mano libera: "Agita". La mano la tiene per il collo e la fa girare finché lo stesso tasto non la ferma; intanto la rotella regola il rubinetto e l'altro tasto dà una goccia o chiude, qualunque cosa si guardi.
- Buretta: Q o E "Leggi il livello" apre la lente; la rotella scrive il valore, un tasto lo annota e l'altro lascia stare.

### 6. Effetti
- Il filo o le gocce di NaOH dalla punta, la nuvola rosa nella beuta, il colore della soluzione, il livello che scende nella buretta, la chiave del rubinetto che gira, la mano sul rubinetto mentre è aperto.

### 7. Codice
- `src/lib/lab/titolazione.ts`: stato e azioni, senza three.js. Test in `tests/unit/lab-titolazione.test.mjs`.
- `src/components/lab/engine/titolazione.ts`: l'esperimento sopra `FreeLab`.
- Motore: un oggetto del kit può dichiarare "si tiene come" un altro (`like`), così tre beute e più becher usano le prese già regolate; `free.pour` ha una condizione di arresto; `hands.ts` ha una mano che va a un punto e ci resta senza tenere niente (il rubinetto); `liquid.ts` accetta un colore dato da fuori.
- `Esperimento.tsx`: la lente della buretta e la nuova classe; `catalog.ts`: la voce pronta, con il kit.

### 8. Verifica
- Test unitari della chimica.
- `scripts/lab/titolazione.mjs`: l'esperimento dall'inizio alla fine nel browser senza schermo, dagli input veri, nelle due stanze e con le due mani; misura dove cade il titolante, il colore della beuta a schermo, le letture e il risultato.
- Revisori critici sui fotogrammi (modelli, leggibilità, mani) e su chimica, testi e flusso.
- Controllo che i primi due esperimenti funzionino ancora (`fiamma.mjs`, `usi.mjs`).

## Esito
Fatto tutto il piano. L'esperimento è nel menu come pronto, a `/laboratorio/chimica/titolazione`, nel banco singolo e nell'aula. Nel codice locale, non committato. Come funziona è in [[Laboratori]], sezione "Il terzo esperimento".

File nuovi: `scripts/lab/build_titolazione.py` e `public/lab/kit/titolazione.glb` (1 MB); `src/lib/lab/titolazione.ts`; `src/components/lab/engine/titolazione.ts`; `tests/unit/lab-titolazione.test.mjs`; `scripts/lab/titolazione.mjs`; `public/lab/copertine/kit-titolazione.webp`.

File cambiati: `grip.ts` e `scene.ts` (un pezzo del kit si tiene come un altro; posa di riposo e scatola per il mirino dai dati del pezzo), `hands.ts` (mano che va a un punto e ci resta; oggetto preso dove sta), `free.ts` (arresto del versare), `liquid.ts` (colore dato da fuori), `grasp.ts` (il contagocce), `esperimento.ts` (il tipo della lente), `Esperimento.tsx` (lente della buretta, nuova classe, messaggio in alto durante la lettura), `catalog.ts`.

Cosa è cambiato rispetto al piano:
- La pipetta sta a destra, davanti alle beute: nell'aula il banco finisce 65 cm a sinistra della postazione e a sinistra sporgeva.
- La beuta agitata è tenuta inclinata, con la bocca sotto la punta: il polso non la tiene dritta in quel punto, e quello che conta è la bocca. La mano ci arriva e poi la stringe; presa all'istante, come gli oggetti dal banco, volava alla mano e tornava.
- La lettura si può aprire anche a metà titolazione, per guardare la scala; il volume finale si annota solo al viraggio.
- Sulla tacca la pipetta contiene 25,00 mL esatti: la lente accetta 0,12 mL di scarto, che da solo bastava a far uscire due titolazioni dalla concordanza.

Trovato dai revisori critici e corretto:
- Visivo: la lente mostrava un solo numero, e non si capiva da che parte cresce la scala (ora ne mostra sempre due); il menisco copriva la tacca su cui stava; il messaggio copriva la beuta durante la lettura; la mano sul rubinetto entrava in quella sulla beuta; il contagocce stava di lato alla bocca; i becher sembravano pieni di latte.
- Logica: una titolazione poteva partire con poca base in buretta, e riempirla a metà dava un volume negativo; la base poteva finire in una beuta diversa da quella in corso o nel becher degli scarti, falsando il volume senza lasciare traccia; la lettura finale era rifiutata come "ancora incolore" con la beuta già rosa.
- Chimica e testi: il quaderno confondeva viraggio e punto equivalente e non scriveva la reazione; "incolore in ambiente acido" era troppo grezzo; "irritano" è diventato "possono irritare".

Non corretto, da sapere:
- All'inizio dell'agitazione la beuta si inclina in tre decimi di secondo: è il polso che la porta alla posa che riesce a tenere.
- Versando con la sinistra il filo di NaOH passa davanti all'asta del sostegno.
- I suggerimenti in basso a destra toccano la riga dei comandi quando sono tre: è dell'interfaccia comune ai tre esperimenti.
- Il rosa pallido non svanisce per la CO₂ dell'aria, e l'aria non rientra nella punta se la buretta si svuota.

Verifiche, tutte passate il 6 ottobre: 11 test unitari; 189 controlli su 189 di `titolazione.mjs` in quattro configurazioni (banco singolo e aula, strumenti nella destra e nella sinistra); `fiamma.mjs` 116 su 116 nel banco e nell'aula; 16 azioni su 16 del solfato di rame (`usi.mjs`); `tsc` ed `eslint` puliti sui file del laboratorio. Un giro di due revisori critici, uno sui fotogrammi e uno su chimica, testi e flusso.

## Da confermare con Alessandro
- La decisione sul motore prima degli esperimenti va aggiornata: gli esperimenti sono tre.
- La soglia di concordanza (0,20 mL) e la buretta più corta del vero.

## Da fare
- Le domande di chimica sono in [[Domande per Andrea]], sezione "Laboratorio: titolazione acido-base".
- Avvinamento di buretta e pipetta fatto dallo studente, se Andrea lo vuole.
- Un pH-metro e la curva di titolazione: il modulo calcola già il pH.
