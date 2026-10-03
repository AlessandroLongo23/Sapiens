# Formulario: La gestione della memoria

## La memoria dei processi

- A ogni processo il sistema operativo assegna una zona della RAM, e la libera quando il processo termina.
- Protezione della memoria: un processo legge e scrive solo nella memoria che gli è stata assegnata.

## Memoria virtuale e paginazione

- Memoria virtuale: ogni processo vede una memoria tutta sua, numerata da zero; il sistema traduce le posizioni in quelle reali.
- Pagina: blocco di dimensione fissa della memoria di un processo. Frame: blocco della stessa dimensione nella RAM.
- Una pagina può stare in qualunque frame libero.
- Tabella delle pagine: per ogni pagina, il frame in cui si trova, oppure che è fuori dalla RAM.
- Dimensione molto diffusa di una pagina: $4\,\text{KiB} = 4096\,\text{B}$. Unità: $1\,\text{KiB} = 1024\,\text{B}$, $1\,\text{MiB} = 1024\,\text{KiB}$.

## Quante pagine servono

1. Porta la memoria richiesta e la dimensione della pagina alla stessa unità.
2. Dividi la memoria richiesta per la dimensione di una pagina.
3. Se la divisione non è esatta, arrotonda per eccesso.

| Memoria richiesta | Pagina | Conto | Pagine |
|---|---|---|---|
| $48\,\text{KiB}$ | $4\,\text{KiB}$ | $48 : 4 = 12$ | $12$ |
| $50\,\text{KiB}$ | $4\,\text{KiB}$ | $50 : 4 = 12{,}5$ | $13$ |
| $3\,\text{MiB}$ | $4\,\text{KiB}$ | $3 \cdot 1024 : 4 = 768$ | $768$ |

- Memoria assegnata: numero di pagine per dimensione di una pagina ($13 \cdot 4 = 52\,\text{KiB}$).
- Spazio inutilizzato nell'ultima pagina: memoria assegnata meno memoria richiesta ($52 - 50 = 2\,\text{KiB}$).

## Swap

- Area di swap: la zona della memoria di massa dove il sistema mette le pagine tolte dalla RAM.
- Page fault: il processo usa una pagina che non è nella RAM; il sistema la ricopia in un frame e fa ripartire il processo.
- Pagine nello swap: pagine richieste meno frame liberi ($6 + 7 + 5 = 18$ pagine, $16$ frame: $2$ pagine nello swap).
- RAM insufficiente: molti page fault, computer lento; se non c'è più spazio, il sistema chiude dei programmi.

```ad-warning
Sempre per eccesso
$12{,}1$ pagine sono $13$ pagine: non esistono mezze pagine.
```

```ad-warning
Lo swap non è RAM
Sta sulla memoria di massa, molto più lenta: fa stare più programmi, non li fa andare più veloci.
```

```ad-warning
Memoria piena: quale?
Troppe foto riempiono la memoria di massa; troppi programmi aperti riempiono la RAM.
```
