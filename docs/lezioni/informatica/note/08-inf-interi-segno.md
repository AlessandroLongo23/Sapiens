# Note: Numeri interi con segno e complemento a due

Lezione nuova, scritta da zero (primo lotto di informatica, capitolo "La codifica dell'informazione", 3 ottobre 2026).
`check.mts` passa senza errori e senza avvisi sui tre file.

## Struttura ed esempi

Apertura (il segno va codificato con i bit); modulo e segno con i due difetti (due zeri, la somma $5 + (-3)$ che dà
$-8$); complemento a due presentato con il peso negativo dell'MSB, poi il procedimento "inverti e somma 1" in tre
passi; l'opposto; l'intervallo su $n$ bit con la tabella; la somma e il traboccamento con la ruota a 3 bit.

Sette esempi svolti: leggere modulo e segno ($-19$); scrivere $-20$; scrivere $-96$ (riporto lungo); leggere $-75$
con l'opposto; quanti bit per $200$ e per $-128$; $45 + (-28)$ con il riporto scartato; $100 + 50$ che trabocca.
Avvisi: complemento a due letto come modulo e segno; il "$+1$" dimenticato e gli zeri a sinistra non scritti;
riporto scartato e traboccamento confusi.

La lezione ha 197 righe, sopra le 180 indicate: 35 sono le due figure. Il testo si legge nei 15 minuti.

## Conti

Rifatti in Python (`/tmp/informatica-cap3/`): le sequenze di $\pm 37$, $\pm 20$, $-96$, $-75$, $45$, $-28$, $100$,
$50$, $-100$, $-60$; $0000\,0101 + 1000\,0011 = 1000\,1000$; $1001\,0011$ vale $-19$ in modulo e segno e $-109$ in
complemento a due; $1110\,1011 = -21$; $45 + (-28)$ dà $1\,0001\,0001$; $100 + 50$ dà $1001\,0110 = -106$;
$-100 + (-60)$ dà $0110\,0000 = 96$; gli intervalli della tabella fino a 32 bit.

## Scelte

- Il complemento a due è definito dal peso negativo dell'MSB, e "inverti e somma 1" è il procedimento. Molti libri
  fanno il contrario (definizione operativa, poi i pesi). Con i pesi la lettura di un negativo e l'intervallo
  vengono da soli.
- Le sequenze di bit in modulo e segno e in complemento a due sono scritte senza il pedice 2 ($1110\,1100$): sono
  bit in una rappresentazione, non un numero in base due. Il pedice resta sui numeri binari veri ($100101_2$).
  Il README non lo fissava.
- "Traboccamento" come termine italiano, con "overflow" tra parentesi alla definizione.
- Niente complemento a uno e niente eccesso: non li chiede il programma del primo anno.
- La sottrazione come somma dell'opposto è solo nell'esempio 6, senza una sezione sua.

## Figure

- `pesi-complemento-a-due`: gli otto bit di $-20$ con i pesi sopra, l'MSB evidenziato. Guardata in chiaro e in scuro.
- `ruota-complemento-a-due-3-bit`: la ruota delle otto sequenze di 3 bit, con il salto da $3$ a $-4$. Guardata in
  chiaro e in scuro.

## Lasciato ad altre lezioni

Conversioni tra basi (lezione 05) e addizione binaria in colonna (lezione 07): solo link, e nei conti della somma
non sono mostrati i riporti uno per uno.

## Fonti da verificare

- "Il complemento a due è la rappresentazione che i calcolatori usano davvero": vero per tutti i processori di uso
  comune; lo standard del linguaggio C la richiede dal C23 (ISO/IEC 9899:2024), da verificare. Nella lezione non
  c'è nessuna data.

## Domande per Andrea

- Complemento a due definito dal peso negativo dell'MSB e non da "inverti e somma 1": va bene per una prima?
- Le sequenze di bit senza pedice 2: va bene, o il vostro libro mette un pedice (per esempio $\text{C2}$)?
- Il libro tratta anche il complemento a uno o la rappresentazione in eccesso? Qui non ci sono.
- La ruota è disegnata con 3 bit per farla stare nella figura: è chiaro il passaggio agli 8 bit?
