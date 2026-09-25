---
aggiornato: 2026-09-25
tag: [sessione, contenuti, chimica]
---
# Chimica con RDKit

Sessione del 25 settembre 2026. Alessandro ha chiesto di provare [RDKit](https://www.rdkit.org), una libreria Python di chimica, scrivendo qualche lezione di chimica sparsa tra gli anni, con esercizi che usano i disegni delle molecole (per esempio: il nome di un composto e quattro disegni tra cui scegliere) e formulari con tabelle di molecole.

## Cosa si è fatto
- Sei lezioni complete di teoria, formulario, note di revisione ed esercizi: la mole e la massa molare (2° anno), la geometria delle molecole con la VSEPR (3°), nomenclatura degli alcani, isomeria, gruppi funzionali, amminoacidi e legame peptidico (5°). File in `docs/lezioni/chimica/`, strumenti in `scripts/chimica/`; il funzionamento è in `docs/lezioni/chimica/README.md`.
- Le figure si scrivono nel markdown come blocchi ` ```molecola `, ` ```molecole ` (tabella), ` ```reazione ` e ` ```molecola3d `, sul modello dei blocchi TikZ, e si compilano in SVG che funzionano in chiaro e in scuro. 87 figure.
- Gli esercizi sono generatori Python (RDKit è Python), con lo stesso contratto di quelli di matematica: livelli, seed deterministici, un controllo indipendente. Le opzioni e la domanda possono essere disegni. Sei generatori, 5 livelli ciascuno, 6.000 esercizi verificati senza errori; gli errori piantati apposta vengono bocciati.
- I nomi IUPAC si verificano con OPSIN (dal nome inglese alla struttura), formule e masse si ricalcolano dal grafo, la stereochimica con un secondo algoritmo di RDKit.
- Una vetrina con tutto, pubblicata come Artifact: https://claude.ai/artifact/4aWC2mhXcV6s7UmQw4nYwE

## Informazioni nuove
- RDKit sa fare: formula e massa molare dalla struttura, catene colorate e numerate, gruppi evidenziati con pattern SMARTS, R/S ed E/Z, schemi di reazione con gli atomi colorati per reagente, coordinate 3D con angoli di legame misurati (NH3 106,0°, H2O 104,0°, contro 106,7° e 104,5° misurati, fonte NIST CCCBDB da citare con la pagina esatta).
- Non sa fare: coppie solitarie, proiezioni di Fischer, eliche delle proteine; il campo di forza sbaglia SO3, SO2, NF3 e non ha parametri per SF6, PCl5, BeCl2. Elenco in `docs/lezioni/chimica/README.md`.
- Alessandro ha trovato nella vetrina una soluzione degli alcani con la catena numerata a salti. Il generatore calcolava la catena sugli indici della molecola costruita e la disegnava sul SMILES canonico, che ordina gli atomi in un altro modo: 896 figure della soluzione su 1000 erano sbagliate, mentre nomi, opzioni e figure delle domande erano giusti. Corretto; il controllo indipendente ora verifica anche la catena disegnata (che sia un cammino e che i rami stiano ai numeri del nome).
- Il controllo indipendente ha trovato un bug vero nel generatore dei gruppi funzionali (indici degli atomi presi dal SMILES sbagliato) e le figure etichettate un errore nel testo sull'isomeria (carvone R e S scambiati).

## Domande aperte
- La chimica non è nella beta (vedi [[2026-09-23 Beta a pagamento a gennaio 2027 con la sola matematica]]): queste lezioni restano una prova finché non si decide quando entra.
- Per portarle sul sito servono: il rendering dei blocchi di chimica (compilati in SVG allo stesso modo dei TikZ, in `scripts/lezioni/publish.mts`), le opzioni con immagini nella pagina degli esercizi, esercizi serviti da un insieme pregenerato (i generatori sono Python e non girano nel browser), e un visualizzatore 3D per la VSEPR, senza il quale quella lezione non va pubblicata.
- Da rivedere con Andrea: la tavola delle masse atomiche, la classificazione degli amminoacidi, la soglia di polarità del legame, i nomi (coppia solitaria, propan-2-olo), le date e i dati scritti a memoria segnati "da verificare" nelle note di ogni lezione.

## Prossimo argomento
Decidere se e quando la chimica entra nel programma, e se RDKit diventa lo strumento delle figure di chimica.
