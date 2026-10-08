# Formulario: Caratteri tipografici e font

## Carattere, glifo, font

- Carattere: un segno della scrittura in astratto, quello che ha un codice (la R è $82$).
- Glifo: un disegno di quel carattere.
- Font: il file con i glifi di un insieme di caratteri, nello stesso stile, e le loro misure.
- Famiglia di caratteri: le varianti dello stesso disegno (normale, grassetto, corsivo).
- Se un font non ha un glifo, il programma lo prende da un altro font; se manca ovunque, mostra un rettangolino.

## Font bitmap e font a contorni

| | Font bitmap | Font a contorni |
|---|---|---|
| Come è fatto un glifo | una griglia di pixel | punti uniti da tratti dritti e curve |
| Ingrandendo | ogni pixel diventa un quadrato: scalini | i pixel si ricalcolano: bordi lisci |
| Quanti disegni servono | uno per ogni dimensione | uno per tutte |

Un glifo bitmap a $1$ bit per pixel occupa larghezza per altezza bit: $8 \cdot 16 = 128$ bit, cioè $16$ byte. Raddoppiando l'altezza lo spazio quadruplica.

## Le famiglie

| Gruppo | Come si riconosce | Nome generico |
|---|---|---|
| con le grazie | piccoli tratti alle estremità delle lettere | `serif` |
| senza grazie | estremità nette | `sans-serif` |
| a spaziatura fissa | ogni carattere ha la stessa larghezza | `monospace` |

## Corpo, peso, interlinea

| Misura | Che cos'è | In un foglio di stile |
|---|---|---|
| corpo | l'altezza dello spazio riservato a una riga di lettere | `font-size: 16px;` |
| peso | lo spessore dei tratti: $400$ normale, $700$ grassetto | `font-weight: 700;` |
| interlinea | la distanza tra due linee di base | `line-height: 1.5;` |

Distanza tra le linee di base in pixel:

$$\text{corpo} \cdot \text{interlinea}$$

Con corpo $16$ pixel e interlinea $1{,}5$: $16 \cdot 1{,}5 = 24$ pixel. Un paragrafo di $n$ righe è alto $n$ volte tanto.

## I font in una pagina web

`font-family: "Courier New", monospace;`

1. Il browser prova i nomi nell'ordine in cui sono scritti.
2. Usa il primo font installato sul dispositivo.
3. L'ultimo nome è un nome generico, che c'è sempre.

Un font web è un file di font messo sul server, che il browser scarica insieme alla pagina.

## Un testo che si legge bene

- Corpo del testo corrente di almeno $16$ pixel.
- Interlinea tra $1{,}4$ e $1{,}6$.
- Una o due famiglie per pagina.
- Font decorativi e tutto maiuscole solo per i titoli brevi.
- Spaziatura fissa per il codice e i dati in colonna.

```ad-warning
Il font non fa parte del testo
Un testo copiato porta i codici dei caratteri, non i disegni: chi lo riceve lo vede con il suo font.
```

```ad-warning
Interlinea 1,5 non è una riga e mezza vuota
Si misura tra le linee di base e comprende le lettere: con corpo $20$ pixel sono $30$ pixel, di cui $10$ di spazio in più.
```

```ad-warning
Virgolette nei nomi
Un nome di font con uno spazio va tra virgolette; i nomi generici non le vogliono mai.
```
