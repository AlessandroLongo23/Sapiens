# Note: La configurazione elettronica

Lezione nuova (terzo anno di chimica, gruppo B, 6 ottobre 2026), ultima del capitolo "La struttura elettronica
dell'atomo". Conti e configurazioni rifatti con uno script Python sui dati di `src/lib/tools/elementi.json`.
`check.mts` passa su lezione, formulario e flashcard; restano tre avvisi, spiegati in fondo.

## Struttura

La notazione ($2p^4$, con figura); principio di Aufbau e regola della diagonale (figura), con il procedimento in
quattro passi e gli esempi 1 (fosforo) e 2 (ferro); diagrammi a caselle e principio di Pauli; regola di Hund con i
diagrammi dal boro al neon, l'esempio 3 (ossigeno) e la figura degli errori; la figura interattiva; configurazione
abbreviata con gli esempi 4 (bromo) e 5 (dalla configurazione all'elemento); le eccezioni di cromo e rame; gli ioni,
con gli esempi 6 (due ioni isoelettronici con l'argon) e 7 (gli ioni del ferro).

## Scelte

- Confini. La capienza dei sottolivelli e l'ordine delle energie sono della lezione 50 (gruppo A): qui c'è solo la
  tabella delle capienze, richiamata con il link, e l'ordine come regola pratica. Il principio di Pauli è già
  enunciato nella 52: qui si ripete in una frase e si applica alle caselle. Gli elettroni di valenza sono della 58:
  qui una frase con il link. Dalla configurazione alla posizione nella tavola è della 57: qui solo "dalla
  configurazione all'elemento", contando gli elettroni (esempio 5).
- Ordine di scrittura. I sottolivelli restano nell'ordine in cui si riempiono ($4s^2\,3d^6$), come nella tavola
  periodica del sito e nello strumento degli orbitali. Un riquadro dice che altri libri riscrivono per livello
  ($3d^6\,4s^2$).
- Il nome "principio di Aufbau" e "regola della diagonale" sono quelli del brief. La regola $n + l$ non è nominata.
- Gli stati eccitati non ci sono: la 52 li ha già per l'idrogeno, e una configurazione eccitata di un atomo con più
  elettroni avrebbe chiesto un paragrafo in più.
- Ioni dei metalli di transizione: "si tolgono prima gli elettroni del $4s$, poi quelli del $3d$", spiegato con il
  fatto che il $4s$ è il livello più esterno. È la regola dei libri; la spiegazione vera (l'ordine delle energie di
  $4s$ e $3d$ si scambia quando il $3d$ è occupato) è stata lasciata fuori.

## Dubbi per Andrea

- La spiegazione delle eccezioni: "un sottolivello $d$ pieno a metà o pieno è una disposizione particolarmente
  stabile". È quella di tutti i libri di scuola, ma è una semplificazione. Va bene così, o si dice solo che le
  energie di $4s$ e $3d$ sono molto vicine?
- L'ordine di scrittura $4s^2\,3d^6$ (riempimento) o $3d^6\,4s^2$ (per livello)? Il Valitutti e il sito usano il
  primo; se si cambia, vanno cambiati anche `elementi.json`, la lezione 57 e i tre generatori.
- La regola di Hund è motivata con la repulsione ("in orbitali diversi gli elettroni stanno più lontani"). Basta, o
  va aggiunto che gli spin paralleli abbassano l'energia?
- Molibdeno e argento sono nominati come altre eccezioni. Vanno tolti, per non dare l'idea che siano da sapere?
- Nel diagramma a caselle la prima freccia è sempre verso l'alto. La lezione non dice che è una convenzione: la
  figura interattiva accetta anche tutte le frecce spaiate verso il basso.

## Da verificare

- *Aufbau* tradotto "costruzione": dal tedesco, a memoria.
- "Le configurazioni vere si ricavano dagli spettri degli atomi": affermazione generale, senza fonte citata.
- Dato che manca in `elementi.json`: le configurazioni degli ioni. Quelle della lezione ($\mathrm{Fe^{2+}}$
  $[\text{Ar}]\,3d^6$, $\mathrm{Fe^{3+}}$ $[\text{Ar}]\,3d^5$) sono quelle dei manuali.

## Figure

Otto TikZ, guardate in chiaro e in scuro: `configurazione-notazione-sottolivello`, `configurazione-regola-diagonale`,
`configurazione-caselle-idrogeno-elio`, `configurazione-caselle-secondo-periodo`, `configurazione-caselle-ossigeno`
(nell'esempio 3), `configurazione-caselle-errori`, `configurazione-caselle-cromo-rame`,
`configurazione-caselle-ioni-ferro` (nell'esempio 7). Nella regola della diagonale le frecce passano sopra i nomi
dei sottolivelli, come nei libri; sono in azzurro chiaro perché i nomi restino leggibili.

Una interattiva, `configurazione-caselle-riempi` (`interactive/chimica/ConfigurazioneCaselle.tsx`): il diagramma a
caselle da $1s$ a $3d$ da riempire per un elemento tra i primi trenta. Un tocco aggiunge una freccia verso l'alto o
verso il basso, o la toglie; la figura segnala, colorando le caselle, la prima regola violata (Pauli, ordine di
riempimento, Hund), conta gli elettroni, scrive la configurazione che corrisponde al diagramma e dice quando è lo
stato fondamentale. Cromo e rame sono accettati con la configurazione vera; a quella della regola della diagonale la
figura risponde che l'elemento è un'eccezione. Parte da un carbonio con i due elettroni del $2p$ appaiati. Guardata
in chiaro, in scuro e a 390 px, ai valori iniziali e dopo i tocchi (Pauli, ordine di riempimento, cromo, soluzione).

## Esercizio guidato

L'esempio che renderebbe di più è il 7, gli ioni del ferro. Si fermerebbe in tre punti: scrivere la configurazione
dell'atomo ($[\text{Ar}]\,4s^2\,3d^6$); decidere da quale sottolivello escono i primi due elettroni (il $4s$); dire da
dove esce il terzo (il $3d$) e scrivere $\mathrm{Fe^{3+}}$. In alternativa l'esempio 2 (ferro), con le fermate a $18$
elettroni, al $4s$ e al $3d$.

## Esercizi

Generatore `chim-configurazione-elettronica`, sei livelli (specifica in
`specs/exercises/chim-configurazione-elettronica.md`). I livelli 1 e 4 hanno come risposta un numero. Nessuna scena:
un livello "quale regola viola questo diagramma" avrebbe chiesto un tipo di scena nuovo per i diagrammi a caselle, e
non è stato fatto.

## Avvisi di check.mts

- "titolo con maiuscole all'inglese" su "Diagrammi a caselle e principio di Pauli" e "La regola di Hund": sono nomi
  propri.
- "riempitivo": la parola è "fondamentale" in "stato fondamentale", che è il termine (lo stesso avviso della
  lezione 52).

Prerequisiti proposti: chim-orbitali-numeri-quantici, chim-livelli-energia, numero-massa
