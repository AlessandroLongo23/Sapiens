# Metodi di separazione dei miscugli

Generatore: `chim-separazione-miscugli` (`src/lib/exercises/v2/generators/chim-separazione-miscugli.ts`, con
`src/lib/exercises/v2/chim-materia2.ts`). Verifica indipendente: `scripts/exercises/checkers/chim_separazione_miscugli.py`.
Lezione collegata: `docs/lezioni/chimica/riscritte/18-chim-separazione-miscugli.md`. Percorso nel database:
`high_school/chemistry/chim-materia/chim-separazione-miscugli`.

Cinque livelli, ognuno con una difficoltà in più. Sempre scelta multipla a quattro opzioni.

## Nomi dei livelli

1. Il metodo giusto
2. La proprietà sfruttata
3. La distillazione
4. Il fattore di ritenzione
5. Separare in più passi

## Livello 1: il metodo giusto

Una situazione di tutti i giorni o di laboratorio (22, dalla lezione), con qualche dato che cambia (litri, millilitri, il
colore del pennarello); si chiede il metodo che conviene. Opzioni tra i dieci metodi della lezione: filtrazione,
decantazione, centrifugazione, imbuto separatore, evaporazione, cristallizzazione, distillazione, estrazione con
solvente, cromatografia, separazione magnetica. I metodi che funzionerebbero anche loro non sono mai distrattori: per la
sabbia nell'acqua ("in fretta e del tutto") la decantazione e la centrifugazione restano fuori; per recuperare il sale
dall'acqua salata la cristallizzazione e la distillazione.

- "L'acqua di un fiume è torbida di fango. Si vuole ottenere acqua limpida, del tutto e in fretta. Quale metodo conviene
  usare?" Filtrazione; distrattori distillazione, cristallizzazione, imbuto separatore.
- "Da una soluzione calda e satura di solfato di rame si vogliono ottenere cristalli grandi e puri, lasciandola
  raffreddare piano." Cristallizzazione.

## Livello 2: la proprietà sfruttata

Metà: un metodo, e si chiede la proprietà che sfrutta (le sei proprietà della tabella della lezione). Metà: una
situazione descritta con la proprietà (due liquidi che si mescolano bollono a temperature diverse; granelli più grandi
dei pori della carta...), e si chiede il metodo; come al livello 1, i metodi che funzionerebbero anche loro non sono
distrattori.

- "Quale proprietà dei componenti di un miscuglio sfrutta l'evaporazione?" Il liquido evapora, il solido no.
- "Un solido che non si scioglie ha granelli più grandi dei pori di un foglio di carta, e l'acqua passa. Quale metodo li
  separa?" Filtrazione.

## Livello 3: la distillazione

Liquidi che si mescolano, con le temperature di ebollizione a $1\,\text{atm}$ scritte nel testo: acetone $56$, metanolo
$65$, etanolo $78$, acqua $100$, acido acetico $118$, glicole etilenico $197\,^\circ\text{C}$. Due liquidi o tre, sempre ad
almeno $20\,^\circ\text{C}$ l'uno dall'altro (la lezione dice che con temperature vicine serve la distillazione
frazionata). Etanolo e acqua sono ammessi come nella lezione, nel modello semplice senza azeotropo.

- Metà, due liquidi: che cosa si raccoglie nella prima frazione e che cosa segna il termometro. "Acetone e glicole
  etilenico": "Acetone, a $56\,^\circ\text{C}$"; distrattori le altre tre combinazioni (il liquido meno volatile, la
  temperatura dell'altro).
- Metà, tre liquidi: il termometro, dopo una sosta, è salito e resta fermo alla temperatura del secondo o del terzo; che
  cosa si sta raccogliendo. "Acetone, acido acetico e glicole etilenico, dopo una sosta a $56$, ora a
  $118\,^\circ\text{C}$": acido acetico; distrattori gli altri due e "Tutti e tre insieme".

## Livello 4: il fattore di ritenzione

Scena `cromatogramma` con la striscia, la linea di partenza, il fronte e la macchia, e le quote delle distanze (le stesse
del testo). Distanze in decimi di centimetro, fronte da $4{,}0$ a $10{,}0\,\text{cm}$, $R_f = d/f$ esatto ai centesimi,
tra $0{,}10$ e $0{,}90$, macchia ad almeno $0{,}5\,\text{cm}$ dalla partenza e dal fronte.

- Metà, il calcolo; il testo dà anche l'altezza della linea di partenza sul bordo, da $1{,}0$ a $2{,}0\,\text{cm}$, per il
  distrattore delle distanze misurate dal bordo. "Partenza a $1{,}4\,\text{cm}$ dal bordo, solvente $10{,}0\,\text{cm}$,
  macchia B $5{,}3\,\text{cm}$": $0{,}53$; distrattori $0{,}47$ ($1 - R_f$, la distanza dal fronte), $0{,}59$ (dal bordo),
  $1{,}89$ (il rapporto rovesciato).
- Metà, il colorante: tre coloranti noti con i loro $R_f$ (multipli di $0{,}05$, a $0{,}10$ o più l'uno dall'altro); la
  macchia ha il valore di uno dei tre (tre volte su quattro) o di nessuno (a $0{,}08$ o più da tutti). "Blu $0{,}10$,
  verde $0{,}65$, viola $0{,}25$; macchia $1{,}9$ su $7{,}6\,\text{cm}$": il colorante viola.

## Livello 5: separare in più passi

Otto miscugli di tre componenti con l'obiettivo (quali componenti ottenere separati): sabbia, sale e acqua (tenendo o no
l'acqua); ferro, sabbia e sale asciutti; ferro, zolfo e sale; olio, acqua e sale (tenendo o no l'acqua); sabbia, acqua e
alcol; sabbia, olio e acqua. Si sceglie la sequenza giusta di passi tra separazione magnetica, aggiunta d'acqua,
filtrazione, evaporazione, distillazione, imbuto separatore. I distrattori sono sequenze che non arrivano all'obiettivo:
l'ordine rovesciato, l'evaporazione al posto della distillazione quando serve l'acqua, un passo che non ha niente da
separare (filtrare un miscuglio senza solidi non disciolti, usare la calamita su un liquido). Le sequenze che
funzionerebbero anche loro (la calamita alla fine, dopo filtrazione ed evaporazione) non sono distrattori.

- "Olio, acqua e sale sciolto nell'acqua; si vogliono l'olio e il sale": 1. imbuto separatore, 2. evaporazione.
- "Limatura di ferro, zolfo e sale, tutti asciutti; si vogliono tutti e tre": 1. separazione magnetica, 2. aggiunta
  d'acqua, 3. filtrazione, 4. evaporazione.

## Esercizi da evitare

- Metodi che funzionano anche loro tra i distrattori (livelli 1, 2 e 5).
- Liquidi con temperature di ebollizione a meno di $20\,^\circ\text{C}$ (livello 3).
- $R_f$ non esatto ai centesimi, o una macchia attaccata alla partenza o al fronte (livello 4).

## Verifica

`chim_separazione_miscugli.py` riconosce le situazioni dalle parole chiave e ne ricava il metodo con la sua tabella,
con i metodi che funzionerebbero anche loro; rilegge liquidi e temperature del livello 3 e li confronta con i valori
della lezione; rilegge le distanze del livello 4, controlla che la scena abbia le stesse e rifà $R_f$ con le frazioni
esatte di SymPy; al livello 5 applica ogni sequenza a un modello del miscuglio (componenti solidi, solubili, magnetici,
liquidi volatili, liquidi che non si mescolano) e controlla che solo quella giusta arrivi all'obiettivo, senza passi
inutili. Errori piantati (opzione giusta cambiata, un distrattore uguale alla risposta, la scena con un fronte diverso)
bocciati.
