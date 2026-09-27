# Calcolo della subnet

## Che cos'è una subnet

Una subnet è un gruppo di indirizzi IPv4 che stanno nella stessa rete. La subnet mask dice quali dei 32 bit dell'indirizzo indicano la rete e quali il singolo computer (l'host): i bit a 1 sono della rete, quelli a 0 dell'host. Il prefisso CIDR, come /26, conta i bit a 1.

## Come si calcola a mano

L'indirizzo di rete si ottiene con l'AND bit a bit tra indirizzo e mask: il risultato è 1 solo dove tutti e due i bit sono 1. Si lavora un ottetto alla volta, e basta guardare quello dove la mask non è tutta 255.

```ad-example
Esempio: 192.168.10.77/26
La mask ha 26 bit a 1: nel quarto ottetto sono $11000000$, cioè 192. Fai l'AND sul quarto ottetto:

$$\begin{aligned}
77 &= 01001101 \\[6pt]
192 &= 11000000 \\[6pt]
\text{AND} &= 01000000 = 64
\end{aligned}$$

La rete è 192.168.10.64. Per il broadcast metti a 1 i 6 bit dell'host: $01111111 = 127$, quindi 192.168.10.127.
```

Il primo host viene subito dopo l'indirizzo di rete, l'ultimo subito prima del broadcast. Gli host utilizzabili sono tutti gli indirizzi tranne questi due:

$$\begin{aligned}
2^{32 - 26} - 2 &= 64 - 2 \\[6pt]
&= 62
\end{aligned}$$

```ad-error
Errori frequenti
- Contare anche rete e broadcast tra gli host: non si assegnano a nessun computer.
- Convertire in binario un ottetto con meno di 8 cifre: 77 è $01001101$, con lo zero davanti.
- Fare l'AND con i numeri decimali, come $77 \cdot 192$: l'AND si fa bit per bit.
```

## Domande frequenti

### Che differenza c'è tra /24 e 255.255.255.0?

Nessuna: sono due modi di scrivere la stessa mask, 24 bit a 1 seguiti da 8 bit a 0.

### E le reti /31 e /32?

Una /31 ha due soli indirizzi, usati tutti e due per collegare due router (RFC 3021, 2000). Una /32 è un solo indirizzo, un host preciso.
