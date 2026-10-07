# inf-html-moduli: I moduli

Generatore: `src/lib/exercises/v2/generators/inf-html-moduli.ts` (con `inf-codice.ts`). Verifica indipendente:
`scripts/exercises/checkers/inf_html_moduli.py`, che legge i frammenti con `checkers/_inf_html11.py`. Lezione:
`docs/lezioni/informatica/riscritte/91-inf-html-moduli.md`.

Sei livelli, tutti a scelta multipla con quattro opzioni (`answer.kind = 'choice'`), in testo semplice
(`format: 'text'`). Ogni domanda mostra un frammento di un modulo (`listing`) oppure ha frammenti come opzioni; non
c'è niente da eseguire e nessun livello ha la risposta aperta. `params.case` dice il caso.

Un `<input>` è scritto su due righe, perché stia su un telefono: tipo e nome sulla prima, il resto sulla seconda. Un
frammento sotto la domanda ha al più 18 righe di 42 caratteri, un'opzione al più 10 righe di 34. Nomi, valori e
indirizzi sono parole senza spazi e senza accenti, così nell'indirizzo si scrivono come sono.

## Livello 1: il campo giusto

Tre casi: `tipo` e `fa` due quinti ciascuno, `elemento` un quinto.

- `tipo`: "In un modulo serve un campo per la data di nascita. Quale va bene?" Quattordici dati per sei tipi
  (`text`, `email`, `number`, `date`, `password`, `checkbox`). Opzioni: quattro campi con lo stesso `name`. Giusto:
  `<input>` con il tipo adatto. Sbagliati: i tipi con cui lo si confonde (`text` per un'email, sempre presente il
  primo), un tipo che non esiste (`type="data"`, `type="numero"`), il nome del tipo usato come elemento (`<date>`).
  Dove il tipo giusto è `text` non ci sono tipi inventati, che il browser tratta proprio come `text`.
- `fa`: sotto la domanda un `<input>` con il suo tipo. "Che cosa fa di solito il browser con questo campo?" Opzioni:
  le frasi della tabella della lezione (nasconde i caratteri che scrivi, apre un calendario, rifiuta le lettere…).
  Per un campo `date` "rifiuta le lettere" non è tra i distrattori, perché è vero anche per lui.
- `elemento`: "In un modulo l'utente deve scrivere un messaggio di più righe. Con quale elemento?" Dieci situazioni
  per `<select>`, `<textarea>`, `<input type="radio">`, `<input type="checkbox">`. Opzioni: l'elemento giusto e tre
  tra gli altri, `<input type="text">` e `<option>`.

## Livello 2: etichetta e campo

Nove campi con id, etichetta e tipo (nome, email, citta, eta, data, posti, via, voto, sport). Due casi, metà
ciascuno.

- `lega`: "In quale frammento un clic sulla parola "Età" porta il cursore nel campo?" Opzioni: quattro frammenti con
  un `<label>` e un `<input>`. Giusto: `for` uguale all'`id` del campo. Sbagliati: il campo senza `id`, con il solo
  `name`; `for` uguale al `name` e un `id` diverso (uno di questi due è sempre presente: è l'avviso della lezione);
  `id` o `name` sull'etichetta; `for` con il testo dell'etichetta (`for="Età"`); `for` sul campo.
- `clic`: sotto la domanda due etichette, ciascuna prima del suo campo. "Fai clic sulla parola "Posti". Che cosa
  succede?" La seconda etichetta ha il `for` giusto (due volte su sei), l'`id` del primo campo, il `name` del
  secondo campo che però ha un altro `id`, nessun `for`, un `for` che non è l'`id` di nessuno. Opzioni, sempre le
  stesse: il cursore entra nel primo campo, nel secondo, non succede niente, il modulo viene inviato.

## Livello 3: che cosa viene inviato

Un modulo con `action`, `method`, tre campi presi tra otto (nome, classe, posti, citta, eta, sport, voto,
strumento), ciascuno con il suo `value`, e il bottone. "L'utente lascia nei campi i valori di partenza e preme il
bottone. Quali coppie invia il browser?" Opzioni: coppie `nome=valore`, una per riga.

- `senzaName` (tre su cinque): un campo ha `id` al posto di `name`. Giusto: le coppie degli altri due. Sbagliati:
  tutte e tre, con l'`id` usato come nome (sempre presente); solo quella del campo senza `name`; i soli valori; il
  tipo al posto del nome.
- `idDiverso` (due su cinque): tutti i campi hanno `name`, e uno ha anche un `id` che è un'altra parola. Giusto: le
  tre coppie con i `name`. Sbagliati: la coppia con l'`id` (sempre presente); le coppie senza quel campo; i soli
  valori; il tipo al posto del nome.

Un campo vuoto con il suo `name` non compare: la lezione non dice che parte vuoto.

## Livello 4: caselle, pallini e menu

Quattro casi, un quarto ciascuno.

- `casella`: un campo di testo con un nome e una casella con `name` e `value`. "Nel primo campo c'è scritto Luca.
  L'utente spunta (non spunta) la casella e preme il bottone di invio. Quali coppie partono?" Giusto: con la spunta
  le due coppie, senza la sola prima. Sbagliati: la casella non spuntata che manda "no", un valore vuoto o "false";
  la casella spuntata che non parte, o che manda "spuntata".
- `pallini`: tre pallini con lo stesso `name`, ciascuno con il suo `id`, un `value` corto (`osp`) e un'etichetta con
  un'altra parola (Ospite). "L'utente accende il pallino "Ospite" e preme il bottone di invio. Quale coppia parte?"
  Giusto: `chi=osp`. Sbagliati: il testo dell'etichetta al posto del `value` (sempre presente), l'`id` al posto del
  nome o del valore, il tipo al posto del nome, tutti e tre i pallini.
- `menu`: un `<select>` con tre `<option>`, ciascuna con `value` diverso dal testo. "L'utente sceglie "Media" nel
  menu…" Giusto: `taglia=m`. Sbagliati: il testo dell'opzione (sempre presente), `option=` o `select=`, il numero
  dell'opzione.
- `gruppo`: "In quale frammento, acceso un pallino, l'altro si spegne da solo?" Opzioni: quattro frammenti con due
  campi. Giusto: due `radio` con lo stesso `name`. Sbagliati: `name` diversi (sempre presente), lo stesso `id`, lo
  stesso `value`, nessun `name`, due caselle con lo stesso `name`.

## Livello 5: GET e POST

Un modulo con `action`, due campi con `name` e `value`, il bottone. L'indirizzo con le coppie ha al più 34
caratteri. Quattro casi: `indirizzo` due quinti, gli altri un quinto ciascuno.

- `indirizzo`: "Quale indirizzo chiede il browser?" Con `get` (due volte su tre): `/gita?sport=calcio&posti=2`;
  sbagliati: senza le coppie (sempre presente), i soli valori, `?` e `&` scambiati, barre, una virgola. Con `post`:
  `/gita`; sbagliati: l'indirizzo con le coppie (sempre presente), con i soli valori, con `?method=post`, con
  `/post`.
- `corpo`: solo con `post`. "Che cosa c'è nel corpo della richiesta?" Giusto: `voto=9&sport=nuoto`. Sbagliati:
  l'indirizzo con le coppie (sempre presente), i soli valori, virgola, due punti, punto interrogativo.
- `dove`: il modulo ha `method="get"`, `method="post"` o nessun `method` (un terzo ciascuno). "Dove viaggiano i
  dati?" Opzioni, sempre le stesse: nell'indirizzo, dopo un punto interrogativo; nel corpo della richiesta; dentro
  l'attributo action; da nessuna parte. Senza `method` vale `get`.
- `metodo`: "Quale attributo scrivi nel `<form>` per un modulo di accesso, con nome utente e password?" Sette usi,
  quattro per `post` e tre per `get`. Opzioni: `method="get"`, `method="post"` e due tra `method="https"`,
  `method="send"`, `method="link"`, `action="…"`.

## Livello 6: i controlli del browser

Sotto la domanda un campo con i suoi attributi. "Nel campo l'utente scrive 12 e preme il bottone di invio. Il modulo
parte?" Quattro casi: `numero` due quinti, gli altri un quinto ciascuno.

- `numero`: `type="number"` con `min` da 1 a 3, `max` da 3 a 9 in più, `required`. Il numero scritto è sotto il
  minimo, sopra il massimo, in mezzo, uguale al minimo, uguale al massimo (un quinto ciascuno). Opzioni, sempre le
  stesse: Sì, il modulo parte; No: … è più piccolo di min; No: … è più grande di max; No: il campo è obbligatorio.
  Gli estremi sono accettati.
- `obbligatorio`: un campo lasciato vuoto, con `required` (metà delle volte) o senza, e con altri controlli
  (`min` e `max`, `minlength`). Con `required` non parte; senza parte, perché gli altri controlli valgono solo per
  quello che viene scritto. Opzioni: Sì; No: il campo è obbligatorio ed è vuoto; No: un campo vuoto blocca sempre il
  modulo; No: un campo vuoto non supera gli altri controlli.
- `email`: `type="email"`; l'utente scrive un indirizzo intero (`sara99@scuola.example`) o un testo senza
  chiocciola. Opzioni: Sì; No: nel testo manca la chiocciola; No: il campo è obbligatorio; No: il testo è troppo
  corto. Testi con la chiocciola ma senza quello che segue non compaiono.
- `lunghezza`: `type="text"` con `minlength` e `required`; l'utente scrive un nome di 2-8 lettere, più corto, uguale
  o più lungo del minimo. Opzioni: Sì; No: n caratteri sono meno di minlength; No: n caratteri sono più di minlength;
  No: il campo è obbligatorio.

## Vincoli

- Quattro opzioni diverse, una sola giusta: il controllo rilegge ogni frammento e ricalcola la risposta dai suoi
  attributi (le coppie dai `name` e dai `value`, l'indirizzo da `action` e `method`, l'esito da `required`, `min`,
  `max`, `minlength` e dal tipo).
- Le quote dei casi sono quelle scritte sopra.
- Niente trattini lunghi e niente "piuttosto che", anche nelle opzioni.

## Da evitare

Valori con spazi, accenti o chiocciole dove la risposta è un indirizzo (andrebbero riscritti con `+` e `%40`);
etichette uguali ai `value`, che renderebbero giusta la risposta con l'etichetta; un campo vuoto con `minlength` e
senza `required` presentato come errore; `maxlength`, che il browser fa rispettare mentre si scrive.
