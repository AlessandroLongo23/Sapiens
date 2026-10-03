# Slide efficaci: testo, immagini e grafici

Generatore: `creare-slide` (`src/lib/exercises/v2/generators/creare-slide.ts`). Verifica indipendente:
`scripts/exercises/checkers/creare_slide.py`. Lezione collegata:
`docs/lezioni/informatica/riscritte/32-creare-slide.md` (note in `docs/lezioni/informatica/note/32-creare-slide.md`).
Aiuti comuni del capitolo: `src/lib/exercises/v2/inf-documenti.ts` e `scripts/exercises/checkers/_inf_documenti.py`.

Sei livelli nell'ordine della lezione. Cinque sono a scelta multipla (`answer.kind = 'choice'`), composti da pezzi
intercambiabili; il quarto è un conto con risposta numerica (`answer.kind = 'number'`, scelta multipla da `toChoice`
con i valori di `params.wrong`).

## Nomi dei livelli

1. La regola non rispettata
2. La slide che rispetta le regole
3. L'immagine o il grafico giusto
4. I pixel di un'immagine
5. Schema, slide, animazione, transizione
6. Le fonti delle immagini

## Regole comuni

Come in `specs/exercises/word.md`: dodici nomi, testo in righe `\text{…}`, numeri in formula, opzioni di testo su
righe di al più 26 caratteri, niente trattini lunghi e niente "piuttosto che".

Le tre regole della lezione sono scritte nel testo dei livelli 1 e 2, perché le soglie sono regole pratiche della
nostra lezione e altri libri ne danno di diverse: al massimo $6$ righe di testo, almeno $24$ punti, testo e sfondo
uno chiaro e uno scuro. I colori:

- chiari: bianco, giallo chiaro, celeste, grigio chiaro;
- scuri: nero, blu scuro, verde scuro, grigio scuro.

Una slide senza difetti ha da $2$ a $6$ righe, caratteri di $24$, $28$, $32$ o $36$ punti, un colore chiaro e uno
scuro. Un difetto è uno solo di: da $7$ a $12$ righe; caratteri di $12$, $14$, $16$, $18$ o $20$ punti; testo e
sfondo tutti e due chiari o tutti e due scuri.

## Livello 1: la regola non rispettata

"Una slide di {Nome} ha il titolo e $n$ righe di testo di $s$ punti, {colore} su sfondo {colore}. Le regole: $6$
righe di testo al massimo, almeno $24$ punti, testo e sfondo uno chiaro e uno scuro. Quale regola non rispetta?"
Opzioni fisse: troppe righe di testo, caratteri troppo piccoli, contrasto insufficiente, nessuna: le rispetta
tutte. La slide ha al più un difetto; i quattro casi valgono circa un quarto ciascuno.

Esempi: "$9$ righe di $28$ punti, nero su sfondo bianco": troppe righe. "$4$ righe di $32$ punti, giallo chiaro su
sfondo bianco": contrasto insufficiente. "$6$ righe di $24$ punti, bianco su sfondo blu scuro": nessuna (i valori al
limite sono ammessi dalle regole).

## Livello 2: la slide che rispetta le regole

"{Nome} confronta quattro slide. Quale rispetta tutte e tre le regole: …?" Ogni opzione descrive una slide: "$5$
righe, $28$ punti, nero su giallo chiaro". Una non ha difetti; le altre tre hanno un difetto ciascuna, uno per tipo
(righe, punti, contrasto), così per trovare la giusta bisogna controllare tutte e tre le regole.

## Livello 3: l'immagine o il grafico giusto

"Il titolo di una slide di {Nome} è "{idea}". Che cosa conviene mettere sotto il titolo?" Otto idee, ognuna con ciò
che la mostra, con la tabella completa e con un grafico che contiene tutto; la quarta opzione è un'immagine
decorativa presa da un elenco di otto.

| Tipo | Come si riconosce | Esempio per "In un mese le bottigliette buttate sono dimezzate" |
|---|---|---|
| mostra l'idea (giusta) | dalla tabella della specifica | Un grafico con due barre: ottobre e novembre |
| tabella completa | comincia con "La tabella" | La tabella con i conteggi di ogni giorno |
| grafico con tutto | "Un grafico con … per ogni …" | Un grafico con una linea per ogni alunno |
| decorazione | dall'elenco | La foto di un tramonto sul mare |

Le altre idee: la biblioteca più frequentata il mercoledì; metà della classe a piedi; il cratere dell'Etna a più di
tremila metri; il torneo di sabato in palestra; le ore di sonno che calano dalla prima alla terza; la mensa che butta
un terzo del pane; la password corta che si indovina in fretta. I dati sono della storia, inventati, tranne la quota
dell'Etna (vedi le note della lezione).

## Livello 4: i pixel di un'immagine

"Lo schermo su cui {Nome} proietta ha $W$ pixel in larghezza e $H$ in altezza. {Una foto | Una mappa |
Un'illustrazione | Una vignetta} deve occupare {tutta la | metà della | un terzo della | un quarto della | due terzi
della | tre quarti della} {larghezza | altezza} della slide. Quanti pixel di {larghezza | altezza} deve avere
almeno, per non essere ingrandita?"

- Schermi: $1280 \times 720$, $1920 \times 1080$, $2560 \times 1440$, $3840 \times 2160$.
- Risposta: il lato dello schermo per la frazione; solo combinazioni con risultato intero.
- Distrattori: la stessa frazione dell'altro lato; il lato intero; la frazione complementare; il doppio; la metà.

Esempi (esempi 4 e 5 della lezione): $1920$, metà della larghezza: $960$. $3840$, un terzo della larghezza: $1280$.

## Livello 5: schema, slide, animazione, transizione

"{Nome} prepara una presentazione {su un argomento} e vuole {lavoro}. Su che cosa lavora?" Opzioni fisse: sullo
schema delle diapositive, sulla singola slide, su un'animazione, su una transizione. Circa un quarto ciascuna:

| Risposta | Lavori |
|---|---|
| schema delle diapositive | logo nello stesso angolo di tutte le slide; carattere dei titoli in tutta la presentazione; stesso sfondo a tutte le slide; titolo più in alto in tutte le slide |
| singola slide | sostituire la foto della quarta slide; correggere un numero nella terza; aggiungere una riga all'ultima |
| animazione | punti dell'elenco uno alla volta; freccia sul grafico solo quando ne parla; risposta sotto la domanda dopo un clic |
| transizione | effetto del passaggio da una slide alla successiva; dissolvenza di ogni slide nella successiva; togliere l'effetto a scacchi a ogni cambio di slide |

## Livello 6: le fonti delle immagini

"Per la sua presentazione {Nome} vuole usare {immagine}, {origine}. Può usarla?" Otto immagini (tutte di genere
femminile, per l'accordo) e tre tipi di origine, circa un terzo ciascuno; la quarta opzione non è mai giusta.

| Risposta | Origini |
|---|---|
| Sì, senza chiedere: è opera sua | che ha realizzato da sé; che ha creato da sé per questo lavoro |
| Sì, citando autore e licenza | da un sito che la pubblica con licenza CC BY; in un archivio in rete, con licenza Creative Commons CC BY |
| Solo con il permesso dell'autore | da un sito con la scritta tutti i diritti riservati; su una pagina che non indica alcuna licenza; dal sito di un giornale che non ne permette il riuso |
| mai giusta | Sì: è in rete, quindi è di tutti |

## Esercizi da evitare

- Ai livelli 1 e 2 una slide con due difetti: la risposta "quale regola" non sarebbe unica.
- Colori di cui non si sa dire se sono chiari o scuri (rosso, verde, arancione): restano fuori dagli elenchi.
- Al livello 4 frazioni che danno un numero di pixel non intero ($1280 : 3$).
- Al livello 6 il pubblico dominio: la risposta "si può usare senza citare" non sta tra le opzioni.

## Verifica

`creare_slide.py` rilegge ogni problema dal testo. Ai livelli 1 e 2 legge righe, punti e colori di ogni slide e
applica le tre regole con la sua tabella dei colori chiari e scuri; al livello 2 pretende una slide senza difetti e
tre con un difetto ciascuna, di tipo diverso. Al livello 3 ha la tabella "idea, ciò che la mostra" e ordina le altre
opzioni nei tre tipi sbagliati. Al livello 4 rifà il prodotto con frazioni esatte e controlla che lo schermo sia tra
quelli previsti. Ai livelli 5 e 6 classifica il lavoro o l'origine con parole chiave. Poi opzioni, soluzione,
`params.case` e quote dei casi.

## Domande per la revisione

- Le soglie ($6$ righe, $24$ punti) sono scritte nel testo degli esercizi. Va bene, o lo studente deve ricordarle?
- Al livello 6 "nessuna licenza indicata" porta a "solo con il permesso dell'autore": è la regola generale, ma per
  l'uso a scuola la legge ha delle eccezioni (vedi le note della lezione). Tenere la regola generale?
