# Foglio di calcolo

## Definizione

Un foglio di calcolo è un’applicazione informatica che organizza dati in una matrice di celle individuate da righe e colonne. Ogni cella può contenere testo, numeri, date, formule o riferimenti ad altre celle.

## A cosa serve

Lo scopo principale di un foglio di calcolo è elaborare numeri e informazioni in modo rapido e dinamico. Consente di eseguire:

- calcoli complessi
- analisi statistiche
- simulazioni di scenari
- rappresentazioni grafiche dei risultati.

e molto altro.

## Struttura e componenti

Un documento di foglio di calcolo è composto da uno o più “fogli” (o worksheet), ciascuno organizzato in righe numerate e colonne etichettate con lettere.

L’intersezione di una colonna e una riga definisce una cella.

``` ad-example
Esempio
La cella B3 è la cella all'intersezione tra la seconda colonna (B) e la terza riga (3).
```

Ogni cella può essere formattata in base al tipo di dato (numero, data, testo) e collegata a formule che usano riferimenti assoluti o relativi.

## Funzionalità base

In un foglio di calcolo si possono inserire e modificare i dati manualmente o importandoli da altre sorgenti, applicare formattazioni (colore, bordo, allineamento), ordinare e filtrare righe, bloccare le intestazioni per scorrimento, creare intervalli denominati, proteggere celle e generare grafici di vario tipo per visualizzare tendenze e ripartizioni.

## Formule

### Riferimenti assoluti e relativi

Quando si copia una formula, i riferimenti relativi (es. A1) si adattano alla nuova posizione, mentre quelli assoluti (es. $A$1) restano fissi. Usare riferimenti misti (es. $A1 o A$1) fissa solo colonna o riga.  

``` excel
=B20.2 // riferimento relativo
=B$20.2 // riga fissa, colonna relativa
=$B$2*0.2 // colonna e riga fissi
```

### Incidenza percentuale

L’incidenza percentuale misura il contributo di un valore rispetto al totale. Si calcola dividendo il valore per la somma complessiva e moltiplicando per cento. In Excel:  

``` excel
= B2 / SOMMA(B2:B10)
```

e poi si applica la formattazione percentuale per visualizzare 0–100 %.

### Funzione SE

La funzione SE restituisce un risultato se una condizione è vera e un altro se è falsa. Sintassi:  

``` excel
=SE(condizione; valore_se_vero; valore_se_falso)
```

Per esempio,  

``` excel
=SE(C2>=60; "Promosso"; "Bocciato")
```

valuta il voto in C2 e scrive “Promosso” se è almeno 60, altrimenti “Bocciato”.

### SOMMA.SE e CONTA.SE nidificate

SOMMA.SE somma solo i valori che soddisfano un criterio. CONTA.SE conta le celle che corrispondono a un criterio. Nidificandole è possibile sommare o contare in più passaggi o su intervalli diversi.  

``` excel
=SOMMA.SE(A2:A20; ">100"; B2:B20)
```

somma in B2:B20 solo se i corrispondenti A2:A20 sono maggiori di 100.  

``` excel
=CONTA.SE(A2:A20; "Urgente")
```

conta quante celle in A2:A20 contengono “Urgente”.  

Per eseguire una somma condizionata su più criteri si può combinare SOMMA.SE con SE o usare SOMMA.PIÙ.SE, oppure nidificare prima un CONTA.SE in un’area di appoggio e poi SOMMA.SE su quell’area.  

``` excel
=SOMMA.SE(C2:C10; ">0"; SE(A2:A10="Venduto"; B2:B10; 0))
```

in questo esempio si sommano in B2:B10 solo i valori venduti (A2:A10="Venduto") maggiori di zero.