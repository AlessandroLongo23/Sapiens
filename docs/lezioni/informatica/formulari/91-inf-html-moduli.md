# Formulario: I moduli

## Gli elementi

| Elemento | Che cos'è |
|---|---|
| `<form action="..." method="...">` | il modulo: `action` è l'indirizzo a cui mandare i dati, `method` il modo |
| `<label for="...">` | l'etichetta di un campo: `for` ripete l'`id` del campo |
| `<input type="...">` | un campo; è un elemento vuoto, senza tag di chiusura |
| `<select>` con `<option>` | un menu a tendina, per una scelta tra tante |
| `<textarea>` | un testo di più righe, con il tag di chiusura |
| `<button type="submit">` | il bottone che invia il modulo |

```html
<form action="/iscrizione" method="post">
    <label for="nome">Nome</label>
    <input type="text" id="nome" name="nome">
    <button type="submit">Iscrivimi</button>
</form>
```

## I tipi di input

| `type` | Che cosa si inserisce | Che cosa fa di solito il browser |
|---|---|---|
| `text` | una riga di testo | niente di particolare |
| `email` | un indirizzo email | controlla che ci sia la chiocciola |
| `number` | un numero | rifiuta le lettere |
| `date` | una data | apre un calendario |
| `password` | una password | nasconde i caratteri |
| `checkbox` | un sì o un no | mostra una casella da spuntare |
| `radio` | una scelta tra poche | mostra un pallino per ogni scelta |

I pallini con lo stesso `name` formano un gruppo: ne resta acceso uno solo.

## Che cosa viene inviato

Per ogni campo una coppia: il `name` del campo e il suo valore, come `nome=Anna`.

| Campo | Che cosa parte |
|---|---|
| senza `name` | niente |
| casella non spuntata | niente |
| casella spuntata | il suo `name` e il suo `value` |
| gruppo di pallini | il `name` del gruppo e il `value` del pallino acceso |
| `<select>` | il suo `name` e il `value` dell'opzione scelta |

L'`id` serve dentro la pagina, per l'etichetta; il `name` serve al server. Su un campo in cui si scrive, `value` è il valore di partenza.

## GET e POST

| | `method="get"` | `method="post"` |
|---|---|---|
| Dove viaggiano le coppie | nell'indirizzo, dopo `?`, separate da `&` | nel corpo della richiesta |
| Indirizzo chiesto | `/iscrizione?nome=Anna&posti=2` | `/iscrizione` |
| Si usa per | chiedere qualcosa: una ricerca | consegnare qualcosa: un'iscrizione, un messaggio, una password |

Nell'indirizzo alcuni caratteri vengono riscritti: la chiocciola diventa `%40`, uno spazio diventa `+`.

## I controlli del browser

| Attributo | Che cosa controlla |
|---|---|
| `required` | il campo non può restare vuoto |
| `min`, `max` | il più piccolo e il più grande valore di un campo `number` o `date` |
| `minlength`, `maxlength` | quanti caratteri può avere un testo |
| `type="email"` | il testo ha la forma di un indirizzo |

- Se un controllo fallisce, il browser non invia il modulo e mostra un messaggio accanto al campo.
- Un campo senza `required` può restare vuoto, anche se ha altri controlli.

```ad-warning
Il for ripete l'id, il server legge il name
Senza `id` l'etichetta non è legata; senza `name` il dato non parte.
```

```ad-warning
Un modulo senza method usa get
I dati finiscono nell'indirizzo e nella cronologia: una password va sempre con `post`, in una pagina `https`.
```

```ad-warning
Il controllo del browser non basta
Chiunque può aggirarlo: il programma sul server deve controllare di nuovo i dati.
```
