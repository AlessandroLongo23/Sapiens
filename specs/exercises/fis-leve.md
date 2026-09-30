# Le leve e le macchine semplici

Generatore: `fis-leve` (`src/lib/exercises/v2/generators/fis-leve.ts`). Verifica indipendente:
`scripts/exercises/checkers/fis_leve.py`. Lezione collegata: `docs/lezioni/fisica/riscritte/24-fis-leve.md` (note in
`docs/lezioni/fisica/note/24-fis-leve.md`). Funzioni comuni in `src/lib/exercises/v2/fis-corpo-rigido.ts` e
`scripts/exercises/checkers/_corpo_rigido.py`; scena `asta-forze`.

Cinque livelli, ognuno con una difficoltà in più: riconoscere il genere, dire se la leva conviene, calcolare la forza
motrice, poi un braccio o il posto del fulcro, infine le carrucole.

## Nomi dei livelli

1. Il genere della leva
2. Vantaggiosa o svantaggiosa
3. La forza motrice
4. Il braccio e il fulcro
5. Le carrucole

## Tipi di risposta

Livelli 1 e 2: `choice` di tre parole ("primo genere", "secondo genere", "terzo genere"; "vantaggiosa",
"svantaggiosa", "indifferente"), in ordine casuale. Livelli 3, 4 e 5: `number` esatto, forze in newton intere,
bracci in centimetri interi, la fune in metri con due cifre; una forza o un braccio ricavati hanno al più due cifre
significative. Scelta multipla di quattro opzioni con l'unità.

## Regole comuni

- Bracci da $5$ a $100\,\text{cm}$ a passi di $5$, coerenti con il genere: nel secondo $b_m > b_r$, nel terzo
  $b_m < b_r$; nel primo qualunque.
- La scena `asta-forze` disegna la leva: il fulcro, la forza resistente $F_r$ verso il basso, la forza motrice $F_m$
  verso il basso nel primo genere e verso l'alto negli altri, i bracci quando sono dati. Una forza da trovare è un
  "?", e le frecce sono tutte lunghe 1,2 cm; con le due forze date, le frecce sono in scala.

## Livello 1: il genere della leva

Metà dei problemi descrive un oggetto della lezione in una frase che dice dove stanno il fulcro e le forze; metà
mostra una figura con il fulcro e le due forze (a volte girata da destra a sinistra).

Oggetti: primo genere, le forbici, l'altalena a bilico, il piede di porco, le tenaglie, la testa sulla prima vertebra;
secondo genere, la carriola, lo schiaccianoci, l'apribottiglie, il piede sulle punte; terzo genere, le pinzette, il
braccio, la canna da pesca, la pala.

- "Nelle forbici il perno sta tra le lame, che tagliano, e i manici, che la mano stringe. Di che genere è la leva?"
  Risposta primo genere.
- Una figura con il fulcro a un'estremità, $F_r$ in mezzo e $F_m$ verso l'alto all'altra estremità: secondo genere.

## Livello 2: vantaggiosa o svantaggiosa

Leva di primo genere con i due bracci dati (60%: bracci uguali in un quinto di questi casi); leva di secondo o di
terzo genere senza numeri (40%), dove la risposta viene dal genere.

- "Braccio della forza motrice $60\,\text{cm}$, della forza resistente $65\,\text{cm}$." Risposta svantaggiosa.
- "La leva della figura è di secondo genere: la forza resistente sta tra il fulcro e la forza motrice." Risposta
  vantaggiosa.

## Livello 3: la forza motrice

$F_m = F_r\,b_r / b_m$, i tre generi un terzo ciascuno, $F_r$ da $30$ a $900\,\text{N}$ a passi di $10$.

- "Secondo genere, $b_r = 30\,\text{cm}$, $b_m = 40\,\text{cm}$, $F_r = 360\,\text{N}$." Risposta $270\,\text{N}$;
  distrattori $480\,\text{N}$ (il rapporto rovesciato), $1100\,\text{N}$ (il braccio motore misurato dalla
  resistenza, $40 - 30$), $360\,\text{N}$.
- "Secondo genere, $b_r = 55\,\text{cm}$, $b_m = 75\,\text{cm}$, $F_r = 600\,\text{N}$." Risposta $440\,\text{N}$.

Distrattori: il rapporto rovesciato; nel secondo genere il braccio motore misurato dalla resistenza, nel primo i due
bracci sommati (l'asta intera), nel terzo la differenza dei bracci; la resistenza stessa.

## Livello 4: il braccio e il fulcro

Il braccio motore che serve per una forza motrice data (60%, $b_m = b_r F_r / F_m$), o il posto del fulcro su
un'asta di primo genere lunga $L$ con le forze alle estremità (40%, $F_r b_r = F_m (L - b_r)$, $L$ da $60$ a
$200\,\text{cm}$). Nel secondo caso la figura non mostra il fulcro.

- "Primo genere, resistenza di $90\,\text{N}$ con il braccio di $60\,\text{cm}$, forza motrice di $360\,\text{N}$."
  Risposta $15\,\text{cm}$; distrattori $240\,\text{cm}$ (rovesciato), $60\,\text{cm}$, $75\,\text{cm}$.
- "Un'asta lunga $120\,\text{cm}$, resistenza di $400\,\text{N}$ e forza motrice di $200\,\text{N}$ alle estremità: a
  che distanza dalla resistenza va il fulcro?" Risposta $40\,\text{cm}$; distrattori $80\,\text{cm}$ (i bracci
  scambiati), $60\,\text{cm}$ (metà asta).

## Livello 5: le carrucole

Carrucola fissa, $F = P$ (20%); mobile, $F = P/2$ (35%); mobile con il suo peso $p$, $F = (P + p)/2$ (25%); la fune da
tirare con la mobile per alzare il carico di $h$, $2h$ (20%). Senza scena.

- "Carrucola mobile di peso trascurabile, carico di $500\,\text{N}$." Risposta $250\,\text{N}$; distrattori
  $500\,\text{N}$, $1000\,\text{N}$, $130\,\text{N}$.
- "Carrucola mobile che pesa $30\,\text{N}$, carico di $70\,\text{N}$." Risposta $50\,\text{N}$; distrattori
  $35\,\text{N}$ (il peso della carrucola dimenticato), $100\,\text{N}$, $65\,\text{N}$.

## Esercizi da evitare

- Bracci impossibili per il genere (un secondo genere con $b_m < b_r$).
- Una forza motrice non intera o con più di due cifre significative.
- Una figura che mostra quello che si chiede (il fulcro del livello 4, la forza da trovare in scala).

## Verifica

`fis_leve.py` ricava il genere dalla posizione del fulcro e delle due forze nella scena (e dal verso delle frecce),
confronta gli oggetti con la tabella della specifica, ricalcola forze e bracci con l'uguaglianza dei momenti, e
controlla le opzioni. Esito: `sample.mts fis-leve 1000 all` con i seed $1$, $50001$ e $777001$, PASS; `review.mts` e
`width.mts` escono con codice 0 (opzioni al massimo di $120$ px).

### Errori piantati

Su 25 esercizi e le sei modifiche solite, 130 su 143 bocciati: i 13 passati sono modifiche che non cambiano
l'esercizio (uno spazio in un testo senza numeri, una forza spostata di poco in una figura del livello 1 o 2 senza
cambiare il genere). Bocciati anche la descrizione di un oggetto sostituita con quella di un oggetto di un altro genere
e le due forze scambiate nella figura quando il genere cambia.

### Esercizi diversi su 1.000

Seed da 1 (tra parentesi da 50001): livello 1 14 (14), livello 2 279 (284), livello 3 969 (957), livello 4 950 (942),
livello 5 316 (341). Il livello 1 è stretto per costruzione: tredici oggetti e i tre generi in figura.

## Domande per la revisione

- Forza motrice e resistente, o potenza e resistenza, come in molti libri? La lezione le dice tutte e due.
- Livello 1: la descrizione dell'oggetto dice già dove stanno fulcro e forze. Meglio il solo nome dell'oggetto?
- Il guadagno della leva ($F_r / F_m$) merita un livello?
