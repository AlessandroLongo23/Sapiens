# Lezioni di chimica con RDKit

Sei lezioni di chimica scritte il 25 settembre 2026 per provare [RDKit](https://www.rdkit.org)
(versione 2026.03) come strumento per le figure e per gli esercizi, e pubblicate sul sito il 26
settembre 2026 come contenuto gratuito (vault: `Decisioni/2026-09-26 La chimica si pubblica gratis
accanto alla beta.md`). L'albero delle lezioni di chimica è in `albero.md`, motivato in
`programma.md`.

| N. | Lezione | Anno | Cosa mostra di RDKit |
|----|---------|------|----------------------|
| 01 | La mole e la massa molare | 2° | formula bruta e massa molare calcolate dalla struttura, tabelle di molecole |
| 02 | La geometria delle molecole (VSEPR) | 3° | coordinate 3D ottimizzate, angoli di legame misurati, modelli ruotabili |
| 03 | Nomenclatura degli alcani | 5° | catena principale colorata e numerata, formule scheletriche |
| 04 | Isomeria | 5° | isomeri a confronto, centri chirali con R/S, doppi legami con E/Z |
| 05 | I gruppi funzionali | 5° | gruppi evidenziati a colori dentro molecole vere (farmaci, aromi) |
| 06 | Amminoacidi e legame peptidico | 5° | schemi di reazione con gli atomi colorati per reagente, stereochimica L |

## File

- `riscritte/NN-slug.md`: la lezione, nel formato delle lezioni di matematica (`../stile.md`).
- `formulari/NN-slug.md`: il formulario.
- `note/NN-slug.md`: note di revisione per Alessandro e Andrea: dubbi, scelte, cosa manca.
- `figure/`: gli SVG compilati e un manifesto per file (`riscritte-NN-slug.json`,
  `formulari-NN-slug.json`) con i dati calcolati.
- `esercizi/<slug>.json`: 12 esercizi per livello, generati e verificati, per la vetrina.
- La vetrina (una pagina con tutto) si costruisce con
  `scripts/chimica/.venv/bin/python scripts/chimica/vetrina.py <uscita.html>`.
- `scripts/chimica/`: compilatore delle figure (`figure.py`), generatori (`esercizi/`), controlli
  indipendenti (`esercizi/verifica/`), generazione e verifica (`campioni.py`), anteprima
  (`anteprima.mjs`). Le dipendenze Python stanno in `scripts/chimica/.venv` (RDKit e py2opsin,
  che porta OPSIN, il programma che dal nome IUPAC inglese ricava la struttura).

## Comandi

Dalla radice del repo:

```sh
# la prima volta
/opt/homebrew/bin/python3 -m venv scripts/chimica/.venv
scripts/chimica/.venv/bin/pip install rdkit py2opsin

# compila le figure di una lezione (stampa formula, massa molare e angoli calcolati)
scripts/chimica/.venv/bin/python scripts/chimica/figure.py docs/lezioni/chimica/riscritte/03-alcani-nomenclatura.md

# guarda le figure in chiaro e in scuro (il filtro è una parte del nome del file)
node scripts/chimica/anteprima.mjs /percorso/anteprima alcani

# genera 200 esercizi per livello, li verifica e salva quelli della vetrina
cd scripts/chimica && .venv/bin/python campioni.py alcani-nomenclatura --n 200
```

## Pubblicare sul sito

```sh
# 1. figure delle lezioni: scrive le righe % svg (e % xyz per il 3D) nei file, disegni in scripts/chimica/.svg-sito/
scripts/chimica/.venv/bin/python scripts/chimica/pubblica_figure.py docs/lezioni/chimica/{riscritte,formulari}/*.md
# 2. esercizi: 80 per livello, verificati, in src/lib/exercises/chimica/pools/<id>.json
scripts/chimica/.venv/bin/python scripts/chimica/esporta.py
# 3. disegni nel bucket `figure`, lezioni e formulari in content_nodes (prima senza --apply)
node --env-file=.env node_modules/jiti/lib/jiti-cli.mjs scripts/chimica/pubblica.mts --apply
```

Sul sito i blocchi di chimica diventano `<img>` come i TikZ (`src/lib/content/markdown.ts`), nel tema
scuro invertiti come quelli; un ` ```molecola3d ` ha il pulsante "Ruota in 3D" (`3dmol`, caricato al
clic: `src/lib/utils/molecule3d.ts`). Gli esercizi sono generatori che pescano dagli insiemi
pregenerati (`src/lib/exercises/chimica/pool.ts`), collegati alle lezioni in
`src/lib/exercises/config.ts`: una lezione nuova con esercizi vuole anche la sua riga lì e i nomi dei
livelli in `level-names.ts`.

## Figure

Le figure si scrivono nel markdown come blocchi, sul modello dei ` ```tikz `: prime righe `% nome:`
e `% alt:`, poi le opzioni. Il riferimento completo delle opzioni è in testa a
`scripts/chimica/figure.py`. Le molecole si descrivono in SMILES; l'indice di un atomo è la sua
posizione nel SMILES (da 0), e con `numeri: si` il disegno lo scrive, per trovarlo.

- ` ```molecola `: una molecola. Opzioni utili: `idrogeni: tutti` e `carboni: si` per la formula
  di struttura completa; `catena:` per colorare e numerare la catena principale; `evidenzia:` per
  colorare un gruppo (SMARTS e colore); `stereo: si` per scrivere R/S ed E/Z; `legenda:`.
- ` ```molecole `: una tabella di molecole, una per riga (`SMILES | legenda`), con `colonne:`.
- ` ```reazione `: uno schema di reazione in SMILES di reazione (`reagenti>>prodotti`). Con
  `colora: si` e le mappe atomiche (`[CH3:1]`) ogni atomo prende il colore del reagente da cui viene.
- ` ```molecola3d `: una molecola in 3D. RDKit calcola le coordinate e le ottimizza con un campo di
  forza (MMFF94, o UFF quando MMFF non ha i parametri); `angoli: 1-0-2` misura gli angoli. Sul sito
  servirà un visualizzatore 3D; oggi la vetrina usa 3Dmol.js e altrove si vede il disegno 2D.

Colori ammessi per le evidenziazioni: giallo, verde, blu, rosso, viola, arancione, grigio. Ogni
colore ha la sua versione per il tema scuro. Il nome della figura deve essere unico in tutte le
lezioni di chimica (gli SVG stanno nella stessa cartella): si comincia con una parola della lezione.

Ogni figura va guardata con `anteprima.mjs` prima di considerarla finita: RDKit sceglie da solo la
disposizione degli atomi, e a volte una molecola esce storta o con le etichette sovrapposte (si
corregge con `ruota:` o cambiando l'ordine del SMILES).

## Chimica: convenzioni

- Formule chimiche in LaTeX con `\mathrm`: $\mathrm{H_2O}$, $\mathrm{C_6H_{12}O_6}$, ioni
  $\mathrm{Na^+}$, $\mathrm{SO_4^{2-}}$. Unità: $\mathrm{g/mol}$, $\mathrm{mol}$.
- Virgola decimale come in matematica: $18{,}02\ \mathrm{g/mol}$.
- Masse atomiche con due decimali, dalla tavola periodica della lezione 01 (H 1,01; C 12,01;
  N 14,01; O 16,00; Na 22,99; S 32,07; Cl 35,45; ...). Esercizi e lezioni usano la stessa tavola.
- Nomi IUPAC in italiano (2-metilbutano, acido etanoico), con il nome tradizionale tra parentesi
  quando è quello che si usa davvero (acido acetico).
- Nessun link interno: le lezioni di chimica non hanno ancora un URL.

## Esercizi

Stesso contratto dei generatori di matematica, in Python perché le molecole si disegnano con RDKit
(`scripts/chimica/esercizi/comune.py`). Sempre a scelta multipla, 4 opzioni; la domanda può avere
un disegno (`figura`), ogni opzione può essere un disegno, la soluzione può avere un disegno
(`figuraSoluzione`). Da 4 a 5 livelli, ognuno con una sola difficoltà in più. Distrattori presi
dagli errori veri degli studenti.

Ogni generatore ha un controllo indipendente in `esercizi/verifica/`, scritto dalla lezione e non
copiato dal generatore, che rifà i conti per un'altra strada: per i nomi IUPAC li fa leggere a
OPSIN e confronta la struttura; per formule e masse le ricalcola da capo; per stereochimica e
gruppi funzionali usa pattern propri. `campioni.py` deve dare PASS su 200 esercizi per livello, e
qualche errore piantato apposta (opzione giusta cambiata, distrattore uguale alla risposta) deve
essere bocciato. Esempio da seguire: `alcani_nomenclatura.py` e il suo controllo.

## Limiti di RDKit trovati scrivendo le lezioni

- Il campo di forza sbaglia la forma di alcune molecole che la VSEPR tratta: SO3 esce piramidale,
  SO2 a 113°, NF3, NCl3 e OF2 sopra il tetraedro, CH3⁻ piano; PCl5, PF5, BeCl2, SF6 e XeF2 non
  hanno parametri. Bipiramide e ottaedro sono solo testo.
- Le coppie solitarie non si disegnano; una R generica e le proiezioni di Fischer nemmeno.
- Nelle legende i pedici Unicode (₂) non si vedono: il font di RDKit non li ha.
- In uno schema di reazione non si sceglie l'orientamento delle singole molecole (il dipeptide
  esce con l'N-terminale a destra).
- Dentro un SMARTS di `evidenzia:` il `;` va scritto senza spazio: `; ` separa due evidenziazioni.
- Nel tema scuro alcune evidenziazioni (giallo, arancione) si somigliano; servirebbe un ottavo
  colore, anche per gli alogeni.
