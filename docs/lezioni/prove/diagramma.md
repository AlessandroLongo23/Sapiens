# Diagrammi di flusso da eseguire

Pagina di prova per i blocchi `diagramma`: una sequenza, le due selezioni, un ciclo, un ciclo con una selezione dentro, un errore.

## Sequenza

```diagramma
% nome: prova-sequenza-area
% alt: Diagramma di flusso che legge base e altezza e scrive l'area del rettangolo
% ingresso: 4, 2.5
leggi b
leggi h
a = b * h
scrivi "Area:", a
```

## Selezione a una via

```diagramma
% nome: prova-sconto
% alt: Diagramma di flusso che toglie 10 alla spesa quando supera 50
% ingresso: 80
leggi spesa
se spesa > 50
    spesa = spesa - 10
scrivi spesa
```

## Selezione a due vie

```diagramma
% nome: prova-promosso
% alt: Diagramma di flusso che scrive promosso o bocciato secondo il voto
% ingresso: 5
leggi voto
se voto >= 6
    scrivi "promosso"
altrimenti
    scrivi "bocciato"
```

## Ciclo

```diagramma
% nome: prova-somma
% alt: Diagramma di flusso che somma i numeri da 1 a n
% ingresso: 4
leggi n
s = 0
i = 1
finché i <= n
    s = s + i
    i = i + 1
scrivi s
```

## Ciclo con una selezione dentro

```diagramma
% nome: prova-pari-dispari
% alt: Diagramma di flusso che per ogni numero da 1 a n scrive se è pari o dispari, e poi conta i pari
% ingresso: 3
leggi n
i = 1
pari = 0
finché i <= n
    se i % 2 == 0
        scrivi i, "è pari"
        pari = pari + 1
    altrimenti
        se i > 100 E NON (pari == 0)
            scrivi "grande"
        scrivi i, "è dispari"
    i = i + 1
scrivi "Pari:", pari
```

## Un errore mentre gira

```diagramma
% nome: prova-divisione
% alt: Diagramma di flusso che divide 10 per un numero letto
% ingresso: 0
leggi d
q = 10 / d
scrivi q
```
