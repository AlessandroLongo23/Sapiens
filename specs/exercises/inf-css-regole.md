# inf-css-regole: regole e selettori CSS

Esercizi della lezione `docs/lezioni/informatica/riscritte/92-inf-css-regole.md`. Tutti a scelta multipla, con
quattro opzioni, su frammenti veri di HTML e di CSS: niente da eseguire, e niente risposta aperta (il correttore non
legge il CSS). Generatore: `src/lib/exercises/v2/generators/inf-css-regole.ts`, con `makeCodeGenerator` di
`inf-codice.ts`; i selettori e la cascata sono quelli di `src/lib/informatica/css.ts`, gli stessi delle figure della
lezione. Controllo: `scripts/exercises/checkers/inf_css_regole.py`, che rilegge i frammenti per conto suo (l'HTML
con il parser di Python, selettori e regole a mano).

Parole della lezione: regola, selettore, dichiarazione, proprietà, valore; selettore di elemento, di classe, di id,
discendente; ereditare; cascata, "pesa di più". Colori con i nomi (`navy`, `teal`, `crimson`), grandezze in `px`.

## Livelli

1. **Scrivere una regola.** Due casi, metà ciascuno.
   - `effetto`: "Quale regola scrive il testo in grassetto negli elementi presi dal selettore "h2"?". Cinque
     effetti: colore del testo (`color`), sfondo (`background-color`), grassetto (`font-weight: bold`), centro
     (`text-align: center`), grandezza (`font-size: 20px`). Opzioni: quattro regole di una dichiarazione con lo
     stesso selettore. Distrattori: la proprietà vicina (`color` per lo sfondo), proprietà che non esistono
     (`font-color`, `text-size`, `align`), il valore senza unità (`20`) o con lo spazio (`20 px`).
   - `scritta`: "Quale di queste regole CSS è scritta bene?". La stessa regola di due dichiarazioni scritta bene
     una volta, e nelle altre con un errore di sintassi: senza i due punti, con `=`, con le tonde al posto delle
     graffe, senza il punto e virgola dopo la prima dichiarazione, senza graffe, con le virgole.
   Esempio: selettore `.nota`, effetto grandezza 24 → `.nota { font-size: 24px; }`.
2. **Che cosa prende un selettore.** Sotto la domanda una pagina di 10-16 righe: `nav` con due o tre link, `main`
   con uno o due paragrafi (uno può avere un link dentro) e un elenco `ul` con un id e due o tre voci; una classe
   sta sul primo paragrafo, su alcune voci, o su entrambi. "Quanti elementi di questa pagina prende il selettore
   "nav a"?". Casi: `elemento` (20%: `a`, `li`, `p`), `classe` (25%), `discendente` (35%: `nav a`, `main a`,
   `main p`, `#id li`, `ul li`, `main .classe`, `ul .classe`), `niente` (20%: la classe senza punto, la classe con
   il cancelletto, l'id con il punto, l'id senza cancelletto: la risposta è 0). Opzioni: quattro numeri.
   Distrattori: quello che conta chi legge solo l'ultima parte, o solo la prima, o dimentica punto e cancelletto;
   poi i numeri vicini.
   Esempio: tre link in `nav` e uno in `main`, selettore `nav a` → 3 (distrattore 4, tutti i link).
3. **Scegliere il selettore.** La stessa pagina, con la classe sia sul paragrafo sia su una o due voci e un link
   dentro `main`. "Quale selettore prende ..., e nessun altro elemento?". Cinque casi nelle stesse quote: `menu`
   (i link dentro `nav` → `nav a`), `link-main` (→ `main a`), `classe` (→ `.classe`), `id` (→ `#id`),
   `classe-dentro` (le voci con la classe ma non il paragrafo → `ul .classe`). Opzioni: quattro selettori; solo
   quello giusto prende esattamente quegli elementi. Distrattori: il nome senza punto o senza cancelletto, punto e
   cancelletto scambiati, l'ordine rovesciato (`a nav`), la virgola al posto dello spazio (`nav, a`), il
   selettore troppo largo (`a`, `li`).
4. **Il colore ereditato.** Sotto la domanda un pezzo di pagina (`main` con un titolo `h2` e un elenco di due
   voci) e, dopo una riga vuota, due o tre regole di una riga con una sola dichiarazione `color`. "Di che colore è
   scritto il testo "Sabato"?". Casi: `eredita` (40%: nessuna regola prende la voce; regole su `main` e, sei volte
   su dieci, anche su `ul`: vale l'elemento più vicino), `diretta` (40%: una regola `li` contro un id su `main`:
   vince la regola sull'elemento), `nessuna` (20%: regole solo su `h2` e sulla classe dell'altra voce: `black`).
   Opzioni: quattro nomi di colore, tra cui quelli del foglio e `black`.
5. **Quale regola vince.** Un paragrafo dentro `main` e tre regole che gli danno un colore. Quattro casi nelle
   stesse quote: `id` (`#id`, `.classe`, `p`: vince l'id), `classe` (`.classe`, `p`, `main p`: vince la classe),
   `ordine` (lo stesso selettore due volte, `p` o `.classe`, più una regola che perde comunque: vince la seconda
   delle due), `discendente` (`main p` contro `p` scritto dopo, più `main`: vince `main p`). Dove i pesi sono
   diversi la regola che vince non è mai l'ultima, così "vince l'ultima" è un distrattore. Opzioni: i tre colori
   del foglio e `black`.

## Vincoli

- Quattro opzioni diverse, una sola giusta. Nei livelli 1 e 3 il controllo rilegge ogni opzione: solo quella
  giusta fa quello che la domanda chiede.
- Frammenti: righe di al più 42 caratteri sotto la domanda (al più 18 righe), di al più 34 nelle opzioni.
- Nei livelli 4 e 5 due regole dello stesso foglio non danno mai lo stesso colore.
- Le quote dei casi sono quelle scritte sopra, con una tolleranza di 7 o 8 punti.
- Almeno cento esercizi diversi per livello su 1000 (contati su `params`).

## Da evitare

- Selettori che la lezione non tratta: pseudo-classi (`a:hover`), `>`, `+`, attributi, `*`, due classi sullo
  stesso elemento, `!important`, lo stile scritto nell'attributo `style`.
- Nel livello 3 un distrattore che prende gli stessi elementi del giusto (con un solo elenco `ul` e `#id`
  coincidono: il generatore scarta i candidati che prendono lo stesso insieme).
- Domande di pura memoria ("che cosa vuol dire CSS").
- Colori in esadecimale nelle domande sulla cascata: i nomi si leggono meglio a 390 px.
