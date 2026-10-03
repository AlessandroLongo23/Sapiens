# Formulario: Stili, titoli, tabelle e indici automatici

## Gli stili

- Stile: un insieme di scelte di formattazione con un nome, che si applica con un solo comando.
- Applicare uno stile dà l'aspetto al paragrafo e dichiara che cosa è: un titolo, testo normale, una didascalia.
- Modificare uno stile cambia insieme tutti i paragrafi che lo usano.
- Formattazione diretta: quella data a mano a un pezzo di testo; vale solo lì e non segue lo stile.

## I livelli dei titoli

| Stile | A che cosa si dà |
|---|---|
| Titolo 1 | i capitoli |
| Titolo 2 | le parti di un capitolo |
| Titolo 3 | le parti di una parte |
| Corpo del testo | il testo normale |
| Didascalia | la riga che accompagna una figura o una tabella |

Il livello dice quanto in profondità sta il titolo, non quanto è grande. Se l'aspetto non piace, si modifica lo stile.

## L'indice automatico

1. Dai a ogni titolo lo stile del suo livello.
2. Inserisci l'indice automatico nel punto in cui lo vuoi.
3. Scegli fino a quale livello mostrare i titoli.
4. Dopo ogni modifica, aggiorna l'indice.

- Nell'indice entrano solo i paragrafi con uno stile di titolo, fino al livello scelto.
- Esempio: $4$ Titolo 1, $9$ Titolo 2, $6$ Titolo 3, indice fino al livello 2: $4 + 9 = 13$ voci.
- L'indice è un campo: tra un aggiornamento e l'altro mostra i titoli e le pagine di prima.

## Figure, tabelle e note numerate

- Didascalia automatica: il numero è un campo; figure e tabelle hanno numerazioni separate.
- Riferimento incrociato: un rimando ("vedi Figura 3") scritto come campo, che cambia con il numero della figura.
- Nota a piè di pagina: testo in fondo alla pagina, richiamato da un numerino; le note si numerano da sole.
- Una figura inserita in mezzo fa salire di uno tutte quelle che la seguono; quelle prima non cambiano.

## Le tabelle

- Tabella: dati in righe e colonne. Cella: l'incrocio di una riga e di una colonna.
- Riga di intestazione: la prima, dice che cosa contiene ogni colonna.

$$\text{celle} = R \cdot C$$

Unendo $m$ celle ne resta una: il totale diminuisce di $m - 1$. Esempio: $7$ righe e $3$ colonne, $3$ celle unite: $21 - 2 = 19$.

```ad-warning
Un titolo non è un testo grande e in grassetto
Senza uno stile di titolo, per il programma è testo normale: non entra nell'indice e non cambia con lo stile.
```

```ad-warning
L'indice non aggiornato
Prima di esportare in PDF aggiorna l'indice: altrimenti mostra titoli e pagine vecchi.
```

```ad-warning
La tabella finta, fatta di spazi
Dati con righe e colonne vanno in una tabella vera, dove ogni dato ha la sua cella.
```
