# Formulario: Indirizzi IP e nomi di dominio

## Indirizzo IP

- Indirizzo IP: un numero che identifica un dispositivo collegato a Internet. Ogni pacchetto porta quello del destinatario e quello del mittente.
- IPv4: 32 bit, scritti come quattro numeri in base dieci separati da punti, uno per byte: `192.0.2.45`.
- Ogni numero va da 0 a 255, perché con 8 bit i valori sono $2^8 = 256$.

| | IPv4 | IPv6 |
|---|---|---|
| Lunghezza | 32 bit | 128 bit |
| Come si scrive | quattro numeri da 0 a 255, separati da punti | otto gruppi di quattro cifre esadecimali, separati da due punti |
| Esempio | `192.0.2.45` | `2001:db8::1` |
| Quanti indirizzi | $2^{32}$, circa 4,3 miliardi | $2^{128}$, circa $3{,}4 \cdot 10^{38}$ |

- In IPv6 si tolgono gli zeri all'inizio di un gruppo, e una fila di gruppi a zero diventa `::`.
- Indirizzo dinamico: può cambiare da un collegamento all'altro (i clienti di un fornitore di accesso). Indirizzo statico: non cambia (i server).
- Gli indirizzi che cominciano con `192.168` valgono solo dentro la rete locale.

## Nome di dominio

- Nome di dominio: un nome fatto di parole separate da punti, che sta al posto dell'indirizzo IP.
- Si legge da destra verso sinistra, dal generale al particolare.

| Parte di `www.esempio.it` | Nome | Chi la decide |
|---|---|---|
| `it` | dominio di primo livello (TLD) | è uno dei gruppi esistenti |
| `esempio` | dominio di secondo livello | il proprietario, che lo registra |
| `www` | terzo livello | il proprietario, a piacere |

| Primo livello | Esempi |
|---|---|
| nazionale, di due lettere | `.it`, `.fr`, `.de` |
| generico | `.com`, `.org`, `.net` |

- Maiuscole e minuscole non contano. Le scuole italiane usano `.edu.it`: il nome registrato è il terzo da destra.

## DNS

- DNS (Domain Name System): il servizio di Internet che traduce i nomi di dominio in indirizzi IP.

1. Il browser chiede a un server DNS l'indirizzo di `www.esempio.it`.
2. Il server DNS risponde: `203.0.113.10`.
3. Il browser manda la richiesta a quell'indirizzo.
4. Il server risponde con la pagina.

- Se il server cambia indirizzo si aggiorna la voce del DNS, e il nome resta lo stesso.

```ad-warning
Il massimo è 255
`198.51.100.256` non è un indirizzo IPv4; nemmeno `192.0.2`, che ha tre numeri.
```

```ad-warning
Il proprietario si legge a destra
`www.esempio.it.accesso-clienti.example` è di chi ha registrato `accesso-clienti.example`.
```

```ad-warning
Il DNS vuole il nome esatto
Una lettera sbagliata dà un errore oppure porta su un altro sito.
```
