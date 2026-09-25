# Note: Isomeria

Lezione nuova, scritta il 25 settembre 2026 per la prova di RDKit (versione 2026.03.6). Non c'era un originale da rivedere.

## Cosa c'è e perché

- Ordine: definizione e schema dei tipi (tabella), isomeria di struttura (catena, posizione, gruppo funzionale), stereoisomeria (geometrica, regole CIP, E/Z, ottica, R/S, luce polarizzata, enantiomeri nei viventi).
- Le regole CIP stanno nella sezione dell'isomeria geometrica, prima di E/Z, e si riusano per R/S: così si spiegano una volta sola.
- 16 figure nella lezione, 1 nel formulario (l'acido lattico, copiato con un nome diverso). Ogni etichetta R/S ed E/Z scritta nel testo è quella che RDKit calcola nella figura (`stereo: si`, con `rdCIPLabeler`); le ho controllate una per una nell'anteprima. Il primo tentativo del carvone aveva le legende scambiate: lo stesso `[C@@H]` è R o S a seconda dell'ordine degli atomi nel SMILES, e solo il disegno etichettato lo mostrava.
- Nell'esempio sull'acido lattico e sull'alanina il testo descrive dove stanno i gruppi nel disegno ("COOH a sinistra, OH in basso a destra"): se si ridisegna la figura, o RDKit cambia versione, quel testo va ricontrollato.
- La regola "tre linee e un cuneo pieno: l'H sta dietro; un cuneo tratteggiato: l'H viene avanti, e il verso si inverte" è quella che serve per leggere le formule scheletriche di RDKit, che non disegna l'H del carbonio chirale. Il generatore la verifica: al livello 5 legge il verso dal disegno con questa regola e controlla che dia l'etichetta del CIP labeler.

## Dati da verificare

- Temperature di ebollizione (dal CRC Handbook, a memoria, da verificare): etanolo 78 °C, dimetiletere −24 °C, pentano 36 °C, 2-metilbutano 28 °C, 2,2-dimetilpropano 9,5 °C (scritto "10 °C circa"), propan-1-olo 97 °C, metossietano 7 °C, cis-but-2-ene 3,7 °C, trans-but-2-ene 0,9 °C.
- Talidomide: in commercio dal 1957 (Germania Ovest, Contergan), ritirata nel 1961, "circa diecimila bambini" è la cifra che si trova più spesso; l'interconversione dei due enantiomeri nel corpo in poche ore è documentata (studi di farmacocinetica degli anni Novanta, da citare con nome e data se Andrea vuole una fonte). Ho lasciato fuori il meccanismo (il legame con la proteina cereblon, 2010) e il dettaglio che la storia "R sedativo, S teratogeno" viene da esperimenti su roditori: sono veri ma allungano la sezione.
- Carvone: (R)-(−) menta romana (Mentha spicata), (S)-(+) cumino dei prati e aneto. Acido lattico: (S)-(+) è quello dei muscoli.

## Dubbi da decidere

- "Carbonio chirale (o stereocentro)": molti libri li usano come sinonimi, ma stereocentro è più largo (anche i carboni del doppio legame con E/Z e i centri pseudoasimmetrici). Ho tenuto la definizione scolastica, "quattro gruppi diversi".
- Proiezioni di Fischer e D/L: non ci sono. D/L si nomina solo per l'alanina ("L-alanina"); la lezione 06 sugli amminoacidi le userà, e forse lì serve una nota su L = S tranne la cisteina.
- Diastereoisomeri e forme meso: solo accennati nel riquadro su $2^n$ (acido tartarico). Se il programma di quinta li chiede, servono una sezione e una figura.
- Conformazioni: una frase per dire che non sono isomeri. Alcuni libri le trattano a parte.
- Il manifesto delle figure: `figure.py` oggi scrive `riscritte-04-isomeria.json` e `formulari-04-isomeria.json` (cartella più file), quindi lezione e formulario non si sovrascrivono più.

## Esercizi

`scripts/chimica/esercizi/isomeria.py` e `verifica/isomeria.py`. `campioni.py isomeria --n 200` dà PASS su tutti i livelli (anche con 1500 esercizi per livello, seed 500).

1. Isomeri o no: la molecola disegnata e quattro disegni, uno solo con la stessa formula. Distrattori: stessi carboni e idrogeni diversi; un carbonio in più o in meno; lo stesso scheletro con un ossigeno al posto di un carbonio (o il contrario), che è l'errore di chi guarda la forma e non conta.
2. Relazione tra A e B, con le quattro risposte fisse (stessa, struttura, stereo, non isomeri), un quarto dei casi ciascuna. "Stessa molecola" si disegna da due SMILES casuali diversi e ruotati; metà delle volte la molecola ha un carbonio chirale o un doppio legame E/Z, e bisogna capire se i due disegni hanno la stessa configurazione. Si escludono le molecole troppo simmetriche (il ciclopentano usciva uguale nei due disegni).
3. Quanti carboni chirali: molecole costruite a caso (catene con OH, Cl, Br, a volte un doppio legame) e 19 molecole vere (mentolo, glucosio aperto, canfora, ibuprofene...). Opzioni: quattro numeri consecutivi.
4. Quale di quattro alcheni è E (o Z): la risposta, il suo isomero geometrico, un alchene con un alogeno in cui la catena di carbonio "sembra" cis ma è E (o il contrario), un alchene senza isomeri E/Z.
5. R o S dell'unico carbonio chirale, con l'ordine delle priorità: quattro opzioni che incrociano R/S con l'ordine giusto e l'ordine per massa del gruppo. Si tengono solo le molecole in cui l'ordine per massa è diverso da quello CIP, così il distrattore è sempre un errore vero. All'inizio il carbonio era colorato, ma il cerchio copriva l'inizio del cuneo tratteggiato; ora non si colora (è l'unico carbonio chirale).

Il controllo indipendente rifà tutto per un'altra strada: formula contata dal grafo, identità da InChI (con e senza strato stereo), carboni chirali con la percezione nuova di RDKit e con una prova di simmetria propria, priorità CIP con un'implementazione propria (digrafo gerarchico con duplicati), E/Z dalle priorità proprie e dalle coordinate 2D, R/S dalle priorità proprie e dalla parità del tag chirale, confrontate con le etichette legacy di `AssignStereochemistry`. Il generatore usa `rdCIPLabeler`, i ranghi CIP legacy e `FindMolChiralCenters` legacy.

Errori piantati (40 esercizi per livello, tutti bocciati): risposta giusta spostata su un'altra opzione; distrattore uguale alla risposta; al livello 1 un distrattore uguale alla molecola data; al 2 la molecola B cambiata; al 3 la molecola cambiata; al 4 l'alchene giusto invertito; al 5 R/S scambiato, priorità 1 e 2 scambiate, centro invertito nel SMILES.

## Dove gli algoritmi di RDKit non sono d'accordo

- Negli esercizi generati non c'è nessuna divergenza tra legacy e CIP labeler, né per R/S né per E/Z. La sola divergenza vista nei primi 200 esercizi del livello 5 (7 casi, tutti con il fenile) era un errore del mio controllo, che leggeva il benzene come aromatico senza i duplicati dei doppi legami; corretto con la forma di Kekulé.
- Su 3000 molecole costruite a caso, con fino a 4 stereoisomeri ciascuna (5029 in tutto): R/S diversi in 88 casi, tutti centri pseudoasimmetrici negli anelli (per esempio il carbonio centrale dell'1,2,3-trimetilciclopentano, `C[C@@H]1[C@H](C)CC[C@@H]1C`): il CIP labeler scrive r/s minuscolo, il legacy R/S maiuscolo. Carboni chirali diversi in 28 molecole, stesso motivo: la percezione nuova conta i centri pseudoasimmetrici e l'1,4-dimetilcicloesano (atomi 1 e 4, che il CIP labeler marca r/s), la legacy no. Per la definizione della lezione (quattro gruppi diversi) ha ragione la legacy; negli esercizi del livello 3 non escono, perché le molecole a caso sono senza anelli e quelle vere non hanno centri di questo tipo. Da tenere presente se un giorno le figure con `stereo: si` mostrano un anello così: comparirebbe "(r)" o "(s)", che la lezione non spiega.
- E/Z: nessuna divergenza su tutte le molecole provate.

## Figure da rivedere sul sito

Tutte guardate con `anteprima.mjs` in chiaro e in scuro. Le etichette (R), (S), (E), (Z) sono piccole (scala delle annotazioni 0,75): si leggono, ma sul telefono sono al limite. Nelle figure con `stereo: si` il cerchio viola sul carbonio chirale copre l'inizio del cuneo tratteggiato: nell'acido lattico e nell'alanina si legge ancora, ma è il punto da guardare sul telefono.
