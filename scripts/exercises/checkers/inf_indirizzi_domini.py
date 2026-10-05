"""Checker for inf-indirizzi-domini (specs/exercises/inf-indirizzi-domini.md).

Written from the spec and the lesson. Every answer is recomputed from the text of the question:
- level 1: Python's `ipaddress` says which writings are IPv4 or IPv6 addresses;
- level 2: the bytes are converted here, from binary to base ten and back;
- level 3: the powers of two are computed here;
- level 4: the name is split at the dots and its parts are counted from the right;
- level 5: who registered a name is read in its last two parts;
- level 6: the steps of a DNS lookup are in the order below, and a fault is deduced from what still works.
"""
import ipaddress
import re

from checkers._inf_web1 import unbroken, plain, NAMES, one_right, same_case, shown, start

CASE_RANGES = {
    1: {"valido": (0.32, 0.48), "non valido": (0.32, 0.48), "ipv6": (0.13, 0.27)},
    2: {"da binario": (0.32, 0.48), "in binario": (0.32, 0.48), "bit": (0.13, 0.27)},
    3: {"quanti": (0.22, 0.38), "massimo": (0.22, 0.38), "bit": (0.32, 0.48)},
    4: {k: (0.18, 0.32) for k in ["primo", "secondo", "registrato", "terzo"]},
    5: {"inganno": (0.40, 0.60), "stesso": (0.40, 0.60)},
    6: {"guasto": (0.32, 0.48), "cambio": (0.13, 0.27), "passi": (0.32, 0.48)},
}

# the addresses reserved for examples
DOC4 = [ipaddress.ip_network(n) for n in ("192.0.2.0/24", "198.51.100.0/24", "203.0.113.0/24")]
DOC6 = ipaddress.ip_network("2001:db8::/32")


def is_v4(s):
    if not re.fullmatch(r"\d+(\.\d+){3}", s):
        return False
    try:
        ipaddress.IPv4Address(s)
    except ValueError:
        return False
    return True


def is_v6(s):
    try:
        ipaddress.IPv6Address(s)
    except ValueError:
        return False
    return True


def doc4(s, errors):
    if not is_v4(s) or not any(ipaddress.IPv4Address(s) in n for n in DOC4):
        errors.append(f"{s} is not an address reserved for examples")
        return False
    return True


def level1(sample, errors):
    m = re.fullmatch(r"Quale di queste scritture (non è un indirizzo IPv4|è un indirizzo IPv4|è un indirizzo IPv6)\?", sample["problem"])
    if not m:
        errors.append(f"level 1 text not recognised: {sample['problem']!r}")
        return None
    case, right = {
        "è un indirizzo IPv4": ("valido", is_v4),
        "non è un indirizzo IPv4": ("non valido", lambda s: not is_v4(s)),
        "è un indirizzo IPv6": ("ipv6", is_v6),
    }[m.group(1)]
    for o in sample["answer"]["options"]:
        s = o["latex"]
        if is_v4(s):
            doc4(s, errors)
        elif is_v6(s) and ipaddress.IPv6Address(s) not in DOC6:
            errors.append(f"{s} is not an address reserved for examples")
        elif not re.fullmatch(r"[0-9a-f.,:]+", s):
            errors.append(f"option {s!r} is not a writing of numbers")
    one_right(sample, lambda o: right(plain(o)), errors)
    return same_case(sample, case, errors)


ORDINALS = ["primo", "secondo", "terzo", "quarto"]
FIRST = ["il primo numero", "i primi due numeri", "i primi tre numeri", "tutti e quattro i numeri"]


def level2(sample, errors):
    text = sample["problem"]
    m = re.fullmatch(r"In binario un indirizzo IPv4 è ((?:[01]{8} ){3}[01]{8})\. Come si scrive in base dieci\?", text)
    if m:
        dotted = ".".join(str(int(g, 2)) for g in m.group(1).split())
        doc4(dotted, errors)
        for o in sample["answer"]["options"]:
            doc4(o["latex"], errors)
        one_right(sample, lambda o: plain(o) == dotted, errors)
        return same_case(sample, "da binario", errors)
    m = re.fullmatch(r"Nell'indirizzo (\S+), come si scrive in binario, su 8 bit, il (primo|secondo|terzo|quarto) numero\?", text)
    if m:
        if not doc4(m.group(1), errors):
            return None
        byte = int(m.group(1).split(".")[ORDINALS.index(m.group(2))])
        if byte == 0:
            errors.append("the byte asked for is 0")

        def bits(o):
            if not re.fullmatch(r"[01]{8}", plain(o)):
                raise ValueError(f"option {o['latex']!r} is not 8 bits")
            return o["latex"]

        one_right(sample, lambda o: bits(o) == format(byte, "08b"), errors)
        return same_case(sample, "in binario", errors)
    m = re.fullmatch(r"Nell'indirizzo (\S+), quanti bit occupa(?:no)? (.+)\?", text)
    if m and m.group(2) in FIRST:
        doc4(m.group(1), errors)
        k = FIRST.index(m.group(2)) + 1
        if ("occupano" in text) != (k > 1):
            errors.append("verb and subject do not agree")
        one_right(sample, lambda o: bit_count(o) == 8 * k, errors)
        return same_case(sample, "bit", errors)
    errors.append(f"level 2 text not recognised: {text!r}")
    return None


def bit_count(o):
    n = int(o["values"][0])
    if o["latex"] != f"{n} bit":
        raise ValueError(f"option {o['latex']!r} does not say {n} bit")
    return n


def amount(o):
    n = int(o["values"][0])
    if o["latex"] != shown(n):
        raise ValueError(f"option {o['latex']!r} does not say {n}")
    return n


def level3(sample, errors):
    text = sample["problem"]
    m = re.fullmatch(r"Una rete usa indirizzi di (\d+) bit\. Quanti indirizzi diversi si possono scrivere\?", text)
    if m:
        n = int(m.group(1))
        if not 2 <= n <= 16:
            errors.append(f"{n} bits")
        one_right(sample, lambda o: amount(o) == 2**n, errors)
        return same_case(sample, "quanti", errors)
    m = re.fullmatch(r"Gli indirizzi di una rete sono numeri di (\d+) bit, contati a partire da 0\. Qual è il più grande\?", text)
    if m:
        n = int(m.group(1))
        if not 2 <= n <= 16:
            errors.append(f"{n} bits")
        one_right(sample, lambda o: amount(o) == 2**n - 1, errors)
        return same_case(sample, "massimo", errors)
    m = re.fullmatch(r"Una rete deve dare un indirizzo diverso a (\d+) dispositivi\. Quanti bit deve avere, come minimo, un indirizzo\?", text)
    if m:
        devices = int(m.group(1))
        n = 0
        while 2**n < devices:
            n += 1
        if not 3 <= n <= 10:
            errors.append(f"{devices} devices need {n} bits")
        one_right(sample, lambda o: bit_count(o) == n, errors)
        return same_case(sample, "bit", errors)
    errors.append(f"level 3 text not recognised: {text!r}")
    return None


def labels_of(name, errors):
    """The parts of a name of the lessons: it ends in .example, or in esempio.it."""
    parts = name.split(".")
    if not all(re.fullmatch(r"[a-z0-9-]+", p) for p in parts) or len(parts) < 2:
        errors.append(f"{name!r} is not a domain name")
        return None
    if parts[-1] != "example" and parts[-2:] != ["esempio", "it"]:
        errors.append(f"{name!r} is not a name for examples")
    return parts


FROM_RIGHT = {
    "qual è il dominio di primo livello?": (1, "primo"),
    "qual è il dominio di secondo livello?": (2, "secondo"),
    "quale parte è il nome che il proprietario ha registrato?": (2, "registrato"),  # the registered name is the second level
    "qual è il dominio di terzo livello?": (3, "terzo"),
}


def level4(sample, errors):
    m = re.fullmatch(r"Nel nome di dominio (\S+), (.+)", sample["problem"])
    if not m or m.group(2) not in FROM_RIGHT:
        errors.append(f"level 4 text not recognised: {sample['problem']!r}")
        return None
    parts = labels_of(m.group(1), errors)
    if not parts or len(parts) != 4 or len(set(parts)) != 4:
        errors.append("the name does not have four different parts")
        return None
    k, case = FROM_RIGHT[m.group(2)]
    for o in sample["answer"]["options"]:
        if o["latex"] not in parts:
            errors.append(f"option {o['latex']!r} is not a part of the name")
    one_right(sample, lambda o: plain(o) == parts[-k], errors)
    return same_case(sample, case, errors)


def level5(sample, errors):
    text = sample["problem"]
    m = re.fullmatch(r"Un messaggio ti invita a entrare nel sito (\S+)\. Quali sono le due parti che dicono chi ha registrato il nome\?", text)
    if m:
        parts = labels_of(m.group(1), errors)
        if not parts or len(parts) < 5:
            errors.append("the name is too short to deceive")
            return None
        one_right(sample, lambda o: plain(o) == ".".join(parts[-2:]), errors)
        return same_case(sample, "inganno", errors)
    m = re.fullmatch(r"Chi ha registrato (\S+) è il proprietario di uno solo di questi nomi\. Quale\?", text)
    if m:
        owner = labels_of(m.group(1), errors)
        if not owner or len(owner) != 2:
            errors.append("the registered name does not have two parts")
            return None

        def owned(o):
            parts = labels_of(plain(o), errors)
            if not parts or owner[0] not in o["latex"]:
                raise ValueError(f"option {o['latex']!r} does not look like the name")
            return len(parts) > 2 and parts[-2:] == owner

        one_right(sample, owned, errors)
        return same_case(sample, "stesso", errors)
    errors.append(f"level 5 text not recognised: {text!r}")
    return None


def labelled(labels):
    def value(o):
        if labels.get(o["values"][0]) != o["latex"]:
            raise ValueError(f"option {o['latex']!r} is not {o['values'][0]!r}")
        return o["values"][0]

    return value


def level6(sample, errors):
    text = sample["problem"]
    m = re.fullmatch(r"Scrivi (\S+) nel browser\. Quale passo viene subito (dopo|prima di) questo: «(.+)»\?", text)
    if m:
        name, ip = m.group(1), sample["params"]["ip"]
        labels_of(name, errors)
        doc4(ip, errors)
        steps = [
            f"Il browser chiede a un server DNS quale indirizzo ha {name}",
            f"Il server DNS risponde con l'indirizzo {ip}",
            f"Il browser manda la sua richiesta all'indirizzo {ip}",
            "Il server web risponde con la pagina",
        ]
        if m.group(3) not in steps:
            errors.append("unknown step")
            return None
        want = steps.index(m.group(3)) + (1 if m.group(2) == "dopo" else -1)
        if not 0 <= want <= 3:
            errors.append("no step there")
            return None
        value = labelled({str(i + 1): s for i, s in enumerate(steps)})
        one_right(sample, lambda o: int(value(o)) == want + 1, errors)
        return same_case(sample, "passi", errors)
    m = re.fullmatch(r"Il sito (\S+) viene spostato su un server nuovo, che ha indirizzo (\S+) al posto di (\S+)\. Che cosa deve fare chi visita il sito\?", text)
    if m:
        labels_of(m.group(1), errors)
        new, old = m.group(2), m.group(3)
        if not (doc4(new, errors) and doc4(old, errors)) or new == old:
            errors.append("the two addresses are not two addresses")
        value = labelled({
            "niente": "Niente: scrive lo stesso nome",  # the DNS gives the new number for the same name
            "numero": f"Scrivere {new} al posto del nome",
            "nome": "Imparare un nome di dominio nuovo",
            "fornitore": "Cambiare fornitore di accesso",
        })
        one_right(sample, lambda o: value(o) == "niente", errors)
        return same_case(sample, "cambio", errors)
    ask = r" Qual è la spiegazione più probabile\?"
    by_name = r"nessun sito si apre scrivendo il nome\. "
    direct = r"un servizio che il telefono raggiunge usando direttamente l'indirizzo IP\."
    a = re.fullmatch(r"Una sera, sul telefono di (\w+), " + by_name + "Funziona invece " + direct + ask, text)
    b = re.fullmatch(r"Una sera, sul telefono di (\w+), " + by_name + "Non funziona neanche " + direct + ask, text)
    c = re.fullmatch(r"Sul telefono di (\w+) tutti i siti si aprono, tranne uno: (\w+) ha scritto (\S+) al posto di (\S+)\." + ask, text)
    if a:
        fault, who = "dns", a.group(1)  # packets to a number arrive, names are not translated
    elif b:
        fault, who = "rete", b.group(1)  # not even packets to a number arrive
    elif c:
        fault, who = "nome", c.group(1)  # everything works, the name is not the exact one
        typed, name = labels_of(c.group(3), errors), labels_of(c.group(4), errors)
        if c.group(2) != who or not typed or not name or typed == name or typed[0] != name[0] or typed[2:] != name[2:]:
            errors.append("the name typed is not a misspelling of the name")
    else:
        errors.append(f"level 6 text not recognised: {text!r}")
        return None
    if who not in NAMES:
        errors.append(f"unknown name {who!r}")
    value = labelled({
        "dns": "Il server DNS non risponde",
        "rete": "Il collegamento a Internet è interrotto",
        "nome": "Il nome è sbagliato, e il DNS traduce solo nomi esatti",
        "ip": "I siti hanno cambiato indirizzo IP",
    })
    one_right(sample, lambda o: value(o) == fault, errors)
    if sample["params"].get("fault") != fault:
        errors.append("params.fault is not the fault of the story")
    return same_case(sample, "guasto", errors)


def check(sample):
    errors = start(sample)
    sample = unbroken(sample)
    if errors:
        return errors, None
    level = sample["level"]
    levels = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}
    if level not in levels:
        return errors + [f"unknown level {level}"], None
    case = levels[level](sample, errors)
    return errors, case
