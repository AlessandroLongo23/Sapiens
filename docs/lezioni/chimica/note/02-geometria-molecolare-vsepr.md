# Note: La geometria delle molecole (teoria VSEPR)

Lezione nuova, scritta il 25 settembre 2026 per la prova di RDKit (versione 2026.03). Non c'è un originale da correggere.

## Cosa c'è

- Idea della VSEPR, dominio elettronico, numero sterico, formula per le coppie solitarie (con la carica per gli ioni).
- Geometrie lineare, triangolare planare, tetraedrica, piramidale triangolare, piegata (con numero sterico 3 e 4). Bipiramidale triangolare e ottaedrica solo in un riquadro `ad-note`, senza figura (vedi sotto).
- Perché le coppie solitarie stringono gli angoli, con il confronto tra angoli calcolati e sperimentali.
- Doppi e tripli legami come un solo dominio ($\mathrm{CO_2}$, $\mathrm{HCN}$, $\mathrm{CH_2O}$, $\mathrm{C_2H_4}$, $\mathrm{C_2H_2}$).
- Polarità della molecola dalla geometria, con tre coppie di esempi.
- Sei esempi svolti, sette riquadri di errori frequenti, un riquadro "Dove la VSEPR si ferma" ($\mathrm{H_2S}$ a circa 92°).

## Figure

Nove figure, tutte guardate con `anteprima.mjs` in chiaro e in scuro: sette `molecola3d` (metano, trifluoruro di boro, ammoniaca, acqua, diossido di carbonio, metanale, etene), una `molecola` (il metano disegnato piatto, dentro l'avviso "Il disegno piatto inganna") e una tabella `molecole` (sei molecole polari e apolari a coppie). Il formulario non ha figure: la tabella delle geometrie basta.

Correzioni fatte dopo l'anteprima: le legende con i pedici Unicode ($\mathrm{CO_2}$ scritto "CO₂") uscivano senza le cifre, perché il font di RDKit non ha quei caratteri, e ora sono a parole; il ripiego 2D dei `molecola3d` non scriveva la C sui carboni, e ora ha `carboni: si`.

## Angoli calcolati da RDKit e angoli dei libri

Coordinate da ETKDG, ottimizzate con MMFF94 (UFF per il boro, che in MMFF94 non ha parametri). I valori sperimentali di $\mathrm{NH_3}$ e $\mathrm{H_2O}$ sono quelli in fase gassosa del NIST CCCBDB (valori certi; la pagina esatta da citare è da verificare). Gli altri valori "dei libri" sono da verificare prima di scriverli nella lezione, e infatti la lezione non li scrive.

| Molecola | Angolo | RDKit | Libri / letteratura | Nella lezione |
|---|---|---|---|---|
| $\mathrm{CH_4}$ | H–C–H | 109,5° | 109,5° (tetraedro) | sì |
| $\mathrm{NH_3}$ | H–N–H | 106,0° | 106,7° (NIST), i libri 107° | sì, come sperimentale |
| $\mathrm{H_2O}$ | H–O–H | 104,0° | 104,5° (NIST) | sì, come sperimentale |
| $\mathrm{BF_3}$ (UFF) | F–B–F | 120,0° | 120° (simmetria) | sì |
| $\mathrm{CO_2}$ | O–C–O | 180,0° | 180° | sì |
| $\mathrm{CH_2O}$ | H–C–H / H–C–O | 115,5° / 122,2° | circa 116° / 122° (da verificare) | solo il calcolato |
| $\mathrm{C_2H_4}$ | H–C–H / H–C–C | 117,9° / 121,1° | circa 117° / 121° (da verificare) | solo il calcolato |
| $\mathrm{H_2S}$ | H–S–H | 93,4° | 92,1° (da verificare) | "circa 92°", senza figura |
| $\mathrm{PH_3}$ | H–P–H | 94,5° | 93,5° (da verificare) | no |

Il campo di forza sbaglia di meno di un grado su ammoniaca e acqua e ritrova l'ordine $\mathrm{CH_4} > \mathrm{NH_3} > \mathrm{H_2O}$: la lezione lo dice. Dove sbaglia di più l'ho visto provando una sessantina di molecole, e sono tutte fuori dalla lezione e dagli esercizi:

- $\mathrm{SO_3}$ scritto `O=S(=O)=O`: MMFF94 lo fa piramidale, con angoli di 97,8°. È triangolare planare.
- $\mathrm{SO_2}$: 113,0° contro circa 119,5° (da verificare). Per questo la lezione cita $\mathrm{SO_2}$ solo nelle tabelle, senza modello.
- $\mathrm{NF_3}$, $\mathrm{NCl_3}$, $\mathrm{OF_2}$: tutti a 110,4°, sopra il tetraedro, mentre la VSEPR e le misure li danno sotto (circa 102°, 107°, 103°, da verificare). La forma resta giusta (piramidale o piegata), e infatti stanno nei livelli 2, non nel livello dell'angolo.
- $\mathrm{H_3O^+}$: 111,4°. I libri di scuola dicono circa 107°; il valore misurato è da verificare. Nella lezione c'è solo la geometria, senza angolo.
- $\mathrm{CH_3^-}$: MMFF94 lo fa piano (120°); la VSEPR lo vuole piramidale.
- $\mathrm{PCl_5}$ e $\mathrm{PF_5}$ con UFF: angoli sparsi tra 30° e 170°, nessuna forma. $\mathrm{BeCl_2}$, $\mathrm{BeH_2}$, $\mathrm{SF_6}$, $\mathrm{XeF_2}$, $\mathrm{SeO_2}$: nessun campo di forza ha i parametri, l'embedding non si ottimizza. Per questo niente figura per la bipiramide e l'ottaedro, e niente $\mathrm{BeCl_2}$ come esempio di molecola lineare con soli legami semplici (la lineare si vede con $\mathrm{CO_2}$).

## Esercizi

Generatore `scripts/chimica/esercizi/geometria_molecolare_vsepr.py`, controllo `scripts/chimica/esercizi/verifica/geometria_molecolare_vsepr.py`. Elenco curato di 30 molecole (SMILES, nome, atomo centrale, coppie solitarie, geometria, angolo, polarità scritti a mano). Cinque livelli:

1. senza coppie solitarie, soli legami semplici (12 molecole): la geometria;
2. con coppie solitarie (9 molecole, compresi $\mathrm{H_3O^+}$, $\mathrm{PH_3}$, $\mathrm{NF_3}$): la geometria;
3. legami doppi o tripli sull'atomo centrale (9 molecole, compreso $\mathrm{SO_2}$): la geometria;
4. l'angolo previsto, tra 180°, 120°, 109,5°, circa 107°, circa 104,5°, 90° (14 molecole con tutti gli angoli uguali; si sceglie prima l'angolo, poi la molecola, se no ammoniaca e acqua uscirebbero 2 volte su 14);
5. polare o apolare con il perché (23 molecole neutre), quattro affermazioni fisse: polare perché i legami polari non si compensano; apolare perché si compensano; apolare perché i legami sono apolari; polare "perché ha legami polari, e questo basta" (sempre sbagliata, è l'errore del $\mathrm{CO_2}$).

Distrattori dagli errori tipici: la geometria dei domini al posto di quella della molecola, la coppia solitaria ignorata, il doppio legame contato come due domini, "quadrata planare" o 90° per chi si fida del disegno piatto.

Il controllo indipendente non usa l'elenco: ricava le coppie solitarie dal grafo RDKit (elettroni di valenza dalla tavola periodica di RDKit, meno la carica formale, meno gli elettroni nei legami, diviso due), la geometria dalla tabella della lezione, e la conferma su un embedding suo (ETKDG con un altro seme, MMFF94 o UFF). Tolleranze: lineare se l'angolo è almeno 175°, piegata se al massimo 170°; triangolare planare se la somma dei tre angoli è almeno 357°, piramidale se al massimo 350°; tetraedrica se i sei angoli stanno tra 104° e 115°; per l'angolo, entro 2,0° dal valore misurato e opzione più vicina al valore misurato. Polarità: momento di dipolo dalle cariche di Gasteiger sulle coordinate 3D (polare sopra 0,05 e·Å, apolare sotto 0,01, in mezzo l'esercizio non passa) e polarità dei legami dalle elettronegatività di Pauling scritte nel controllo, soglia 0,4.

Esito di `campioni.py geometria-molecolare-vsepr --n 200`: PASS, 200 su 200 a ogni livello.

Errori piantati a mano, tutti bocciati: indice della risposta giusta spostato (200 su 200), distrattore uguale alla risposta (200 su 200), $\mathrm{NH_3}$ con zero coppie solitarie e "triangolare planare" (28 su 28), $\mathrm{H_2O}$ a 107° (58 su 58), $\mathrm{CO_2}$ polare (17 su 17), $\mathrm{CCl_4}$ apolare "perché i legami sono apolari" (19 su 19), $\mathrm{SO_3}$ aggiunto come triangolare planare (77 su 77: il 3D lo vede piramidale), $\mathrm{CH_3^-}$ aggiunto come piramidale (37 su 37: il 3D lo vede piano), $\mathrm{H_2S}$ nel livello dell'angolo a 104,5° (48 su 48: misurato 93,4°, lo boccia solo il 3D).

## Dubbi da decidere

- Il testo parla di "modello tridimensionale" e gli `alt` descrivono il 3D. Dove oggi si vede il ripiego 2D, il disegno dell'ammoniaca è una T piatta e quello del metano una croce: proprio l'errore che la lezione mette in guardia. Finché il sito non ha un visualizzatore 3D, forse è meglio non pubblicare questa lezione, o mettere sotto ogni ripiego una riga che dica che il disegno è piatto.
- Le coppie solitarie non si vedono né nei modelli né nei disegni: RDKit non le disegna. La lezione lo dice e lo usa come esercizio (le devi contare tu), ma per l'ammoniaca e l'acqua un disegno con i lobi delle coppie solitarie aiuterebbe molto. Servirebbe codice nostro nel visualizzatore 3D.
- Soglia di polarità del legame: ho usato 0,4, la più diffusa nei libri di scuola che conosco; alcuni usano 0,5. Con 0,5 il legame C–Cl (0,61) resta polare e niente cambia negli esempi, ma va scelta una volta per tutte con Andrea.
- Nomi: "coppia solitaria" (con "non condivisa" e "doppietto libero" citati una volta), "dominio elettronico", "numero sterico", "piegata" (con "angolata" e "a V"), "ione ossonio" (molti libri dicono "idronio"). Da confermare con i libri che usano le scuole.
- La lezione dà per noti le formule di Lewis e l'elettronegatività. Quando ci saranno le lezioni sul legame chimico, vanno messi i link.
- Negli esercizi i disegni 2D di RDKit mostrano $\mathrm{H_2O}$, $\mathrm{H_2S}$ e $\mathrm{SO_2}$ già piegati e $\mathrm{NH_3}$ a T: per le molecole piegate il disegno suggerisce la risposta. Si potrebbe forzare un disegno lineare, ma sarebbe un disegno sbagliato apposta.
- Livello 1: 10 molecole su 12 sono tetraedriche, quindi la risposta è "tetraedrica" 4 volte su 5 (164 su 200 nei campioni). Livello 3: $\mathrm{SO_2}$ è l'unica piegata. Per variare servirebbero molecole che il campo di forza tratta bene e che a scuola si incontrano; con altre triangolari planari di soli legami semplici ($\mathrm{AlCl_3}$ esiste come dimero, $\mathrm{BH_3}$ anche) non mi convinceva.
- Livello 5: le quattro affermazioni sono sempre le stesse. Tolte dal livello le molecole polari con legami quasi apolari ($\mathrm{H_2S}$, $\mathrm{PH_3}$, $\mathrm{NCl_3}$) e quelle debolmente polari ($\mathrm{NF_3}$, $\mathrm{OF_2}$, $\mathrm{SCl_2}$), perché nessuna delle quattro affermazioni sarebbe del tutto vera o perché il dipolo di Gasteiger sta troppo vicino alla soglia.
