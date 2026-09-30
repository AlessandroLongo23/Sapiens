# Note: Corpi collegati e tensione dei fili

Lezione nuova (terzo lotto di fisica, secondo anno, gruppo 16, 30 settembre 2026). Conti rifatti in Python:
$15/5 = 3{,}0$, $3 \cdot 3 = 9{,}0$, $15 - 9 = 6$; $9{,}8 \cdot 1/5 = 1{,}96$, $4 \cdot 1{,}96 = 7{,}84$, $9{,}8/4 = 2{,}45$;
$(2 - 0{,}25 \cdot 4) \cdot 9{,}8/6 = 1{,}6333$, $2\,(9{,}8 - 1{,}6333) = 16{,}333$, $4 \cdot 1{,}6333 + 9{,}8 = 16{,}333$,
$0{,}35 \cdot 4 \cdot 9{,}8 = 13{,}72$; Atwood $0{,}3 \cdot 9{,}8/2{,}7 = 1{,}0889$, $2 \cdot 1{,}2 \cdot 1{,}5 \cdot 9{,}8/2{,}7 =
13{,}067$, pesi $11{,}76$ e $14{,}7$, $\sqrt{1/1{,}0889} = 0{,}9583$ s, caduta libera $\sqrt{1/9{,}8} = 0{,}319$ s. Le figure
hanno le forze in scala: $0{,}1$ cm/N (due carrelli e carrello con pesetto), $0{,}07$ cm/N (Atwood). `check.mts` passa
(un avviso: "La macchina di Atwood" ha la maiuscola di un nome proprio).

## Struttura ed esempi

Il filo ideale e la tensione (inestensibile, massa trascurabile, carrucola ideale; la precisazione sul terzo principio);
due carrelli trainati (equazioni per corpo, somma, $a$ e $T$), l'esempio 1 con il controllo e il caso inverso, l'avviso
sulla tensione che non è la forza; carrello e pesetto (verso positivo per ciascun corpo, $a$ e $T$), l'esempio 2,
l'avviso sulla tensione uguale al peso; con l'attrito (la domanda "parte?"), l'esempio 3; la macchina di Atwood, l'esempio
4 con il tempo di discesa, la figura interattiva; il metodo in cinque passi e il suggerimento del sistema come corpo
solo.

## Scelte

- $m_1$ è sempre il corpo "davanti" o sul tavolo o il più leggero, $m_2$ l'altro: nei carrelli trainati la forza tira
  $m_1$ e il filo tira $m_2$.
- La tensione si scrive $T$ (qui il periodo non compare), come nelle notazioni del secondo anno.
- La precisazione sul terzo principio (le due tensioni non sono una coppia di azione e reazione) è in un paragrafo:
  forse è troppo per chi la legge la prima volta.
- George Atwood e il 1784 (il "Treatise on the Rectilinear Motion and Rotation of Bodies"): da verificare.

## Figure

Tre TikZ, guardate in chiaro e in scuro: `due-carrelli-trainati-forze` (solo le forze orizzontali, lo dice l'alt),
`carrello-tavolo-pesetto-forze`, `macchina-atwood-forze` (tensione uguale sui due lati, pesi diversi, accelerazioni
opposte). Interattiva `macchina-atwood-masse` (`fisica/MacchinaAtwood.tsx`): due masse da $0{,}1$ a $2{,}0$ kg, forze in
scala a $0{,}05$ cm/N, il moto dalle leggi orarie con l'accelerazione della formula, fino a $0{,}7$ m di corsa.

## Esercizi

Generatore `fis-corpi-collegati`, sei livelli (specifica in `specs/exercises/fis-corpi-collegati.md`), con la scena
`corpi-collegati` (nuova, `scenes/CorpiCollegati.tsx`: traino, tavolo, Atwood).

## Domande per Andrea

- $T$ per la tensione e $m_1$, $m_2$ per le masse, con $m_2$ quella appesa o più pesante: è la convenzione dell'Amaldi,
  o il libro usa $m_A$, $m_B$?
- Il metodo "un verso positivo per ogni corpo, quello del suo moto" è quello che si insegna, o i libri scelgono un asse
  unico per corpo con i segni?
- La precisazione sul terzo principio (le tensioni ai due capi non sono azione e reazione) va tenuta o crea più
  confusione che altro?
- La macchina di Atwood è nel programma di seconda, o è meglio spostarla in un approfondimento?
