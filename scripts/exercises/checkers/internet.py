"""Checker for internet (specs/exercises/internet.md).

Written from the spec and the lesson. The answer is rebuilt from the pieces:
- level 1: the table of the networks (local or wide) with the words each must contain;
- level 2: the description is classified by the words it uses, and exactly one of the six terms must fit;
- level 3: what still works in the story decides where the fault is;
- level 4: the count of the packets is redone from the numbers in `params`, which must be the ones in the text;
- level 5: the table of what a protocol settles and what it does not;
- level 6: the table of true and false statements.
"""
import re

from checkers._inf_web1 import check_statements, kind_of, name_in, one_right, same_case, shown, start

CASE_RANGES = {
    1: {"locale": (0.40, 0.60), "geografica": (0.40, 0.60)},
    2: {k: (0.10, 0.24) for k in ["router", "fornitore", "locale", "geografica", "wifi", "internet"]},
    3: {"uscita": (0.25, 0.42), "wifi": (0.25, 0.42), "router": (0.25, 0.42)},
    4: {"pacchetti": (0.40, 0.60), "dimensione": (0.17, 0.33), "perso": (0.17, 0.33)},
    5: {"stabilita": (0.40, 0.60), "non stabilita": (0.40, 0.60)},
    6: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

NETWORKS = {
    "l1": ("locale", "una casa"), "l2": ("locale", "laboratorio"), "l3": ("locale", "un solo negozio"),
    "l4": ("locale", "un ufficio"), "l5": ("locale", "una classe"), "l6": ("locale", "biblioteca di quartiere"),
    "l7": ("locale", "un appartamento"), "l8": ("locale", "studio medico"),
    "g1": ("geografica", "tutta Italia"), "g2": ("geografica", "venti città"), "g3": ("geografica", "una regione intera"),
    "g4": ("geografica", "uno Stato"), "g5": ("geografica", "due continenti"), "g6": ("geografica", "un Paese intero"),
    "g7": ("geografica", "tutte le province"), "g8": ("geografica", "più regioni"),
}

TERMS = {
    "router": "Il router",
    "fornitore": "Il fornitore di accesso",
    "locale": "La rete locale",
    "geografica": "La rete geografica",
    "wifi": "Il Wi-Fi",
    "internet": "Internet",
}
# The words of a description decide the term.
WORDS = [
    ("router", ["più reti nello stesso momento", "scatola che in casa", "Legge l'indirizzo"]),
    ("fornitore", ["si paga l'abbonamento perché", "provider", "proprietario della rete a cui"]),
    ("locale", ["appartiene a chi la usa", "collegati alla stessa scatola", "stampante di casa"]),
    ("geografica", ["collega tra loro reti lontane", "compagnie telefoniche", "un solo proprietario"]),
    ("wifi", ["senza fili", "onde radio", "al massimo"]),
    ("internet", ["reti di tutto il mondo", "Non ha un proprietario", "le stesse regole"]),
]

TARGETS = {"una foto alla stampante": "Nella stampante", "un video al televisore": "Nel televisore", "una canzone alla cassa senza fili": "Nella cassa senza fili"}
DEVICES = ["il telefono", "il tablet", "il portatile", "la console"]

PROTOCOL = {
    "d1": (True, "dentro un pacchetto"), "d2": (True, "quando manca un pacchetto"), "d3": (True, "indirizzo del destinatario"),
    "d4": (True, "parla per primo"), "d5": (True, "si numerano"), "d6": (True, "rimandare"), "d7": (True, "è finito"),
    "d8": (True, "al massimo un pacchetto"),
    "n1": (False, "marca"), "n2": (False, "colore"), "n3": (False, "sistema operativo"), "n4": (False, "costa"),
    "n5": (False, "schermo"), "n6": (False, "proprietario"), "n7": (False, "stanza"), "n8": (False, "materiale"),
}

STATEMENTS = {
    "t1": (True, "non ha un proprietario unico"), "t2": (True, "possono fare strade diverse"), "t3": (True, "si rimanda solo quello"),
    "t4": (True, "ordine diverso"), "t5": (True, "uno dei servizi"), "t6": (True, "anche se non usa il web"),
    "t7": (True, "marche diverse"), "t8": (True, "destinatario e quello del mittente"), "t9": (True, "un'altra strada"),
    "t10": (True, "di molte persone"), "t11": (True, "sono pubblici"), "t12": (True, "anche quando il collegamento a Internet è interrotto"),
    "f1": (False, "Internet e il web sono la stessa cosa"), "f2": (False, "Il Wi-Fi e Internet sono la stessa cosa"),
    "f3": (False, "tutta intera"), "f4": (False, "per forza la stessa strada"), "f5": (False, "rispedire tutta la foto"),
    "f6": (False, "una sola grande azienda"), "f7": (False, "solo se sono della stessa marca"), "f8": (False, "computer centrale"),
    "f9": (False, "stai usando il web"), "f10": (False, "solo dai tuoi pacchetti"), "f11": (False, "sempre nello stesso ordine"),
    "f12": (False, "Basta un collegamento guasto"),
}


def level1(sample, errors):
    m = re.fullmatch(r"Quale di queste è una rete (locale \(LAN\)|geografica \(WAN\))\?", sample["problem"])
    if not m:
        errors.append(f"level 1 text not recognised: {sample['problem']!r}")
        return None
    want = m.group(1).split()[0]
    kind = kind_of(NETWORKS)
    one_right(sample, lambda o: kind(o) == want, errors)
    return same_case(sample, want, errors)


def level2(sample, errors):
    m = re.fullmatch(r"(.+) Di che cosa si parla\?", sample["problem"])
    if not m:
        errors.append(f"level 2 text not recognised: {sample['problem']!r}")
        return None
    found = [term for term, words in WORDS if any(w in m.group(1) for w in words)]
    if len(found) != 1:
        errors.append(f"the description fits {len(found)} terms: {found}")
        return None

    def term_of(o):
        term = o["values"][0]
        if TERMS.get(term) != o["latex"]:
            raise ValueError(f"option {o['latex']!r} is not the term {term!r}")
        return term

    one_right(sample, lambda o: term_of(o) == found[0], errors)
    return same_case(sample, found[0], errors)


def level3(sample, errors):
    text = sample["problem"]
    ask = r" Dov'è più probabile che sia il guasto\?"
    a = re.fullmatch(r"A casa di (\w+) (.+?) mostra il Wi-Fi al massimo e riesce a mandare (.+), ma le pagine web non si aprono da nessun dispositivo\." + ask, text)
    b = re.fullmatch(r"A casa di (\w+) (.+?) non riesce a mandare (.+) e non apre le pagine web\. Dagli altri dispositivi di casa funzionano tutte e due le cose\." + ask, text)
    c = re.fullmatch(r"A casa di (\w+) nessun dispositivo riesce a mandare (.+), e nessuno apre le pagine web\." + ask, text)
    if a:
        # the device reaches the router and the house: only the way out is missing
        fault, device, sent = "uscita", a.group(2), a.group(3)
    elif b:
        # everything works for the others: only this device is cut off
        fault, device, sent = "wifi", b.group(2), b.group(3)
    elif c:
        # not even the exchange inside the house works, for anyone
        fault, device, sent = "router", sample["params"].get("device"), c.group(2)
    else:
        errors.append(f"level 3 text not recognised: {text!r}")
        return None
    name_in(text, errors)
    if device not in DEVICES or sent not in TARGETS:
        errors.append(f"unknown device or target: {device!r}, {sent!r}")
        return None
    labels = {
        "uscita": "Nel collegamento tra il router e il fornitore di accesso",
        "wifi": f"Nel collegamento tra {device} e il router",
        "router": "Nel router di casa",
        "periferica": TARGETS[sent],
    }

    def place(o):
        if labels.get(o["values"][0]) != o["latex"]:
            raise ValueError(f"option {o['latex']!r} is not the place {o['values'][0]!r}")
        return o["values"][0]

    one_right(sample, lambda o: place(o) == fault, errors)
    return same_case(sample, fault, errors)


def size_text(size):
    kb = size // 1000
    if kb < 1000:
        return f"{kb} kB"
    mb = kb / 1000
    return (str(int(mb)) if mb == int(mb) else str(mb).replace(".", ",")) + " MB"


def level4(sample, errors):
    p = sample["params"]
    size, packet, count, case = p["size"], p["packet"], p["count"], p["case"]
    text = sample["problem"]
    if count * packet != size or size % 1000:
        errors.append("the packets do not make the file")
    if not 100 <= count <= 30000 or packet not in (500, 1000, 1250, 1500, 2000, 2500):
        errors.append("numbers out of the spec")

    def has(*pieces):
        for piece in pieces:
            if piece not in text:
                errors.append(f"the text does not say {piece!r}")

    if case == "pacchetti":
        has(f"occupa {size_text(size)}, cioè {shown(size)} B", f"porta {packet} B", "Quanti pacchetti servono?")
        right, unit = size // packet, "pacchetti"
    elif case == "dimensione":
        has(f"in {shown(count)} pacchetti", f"porta {packet} B", "Quanti byte occupa in tutto?")
        right, unit = count * packet, "B"
    elif case == "perso":
        lost = p["lost"]
        if not 2 <= lost <= count - 2:
            errors.append("the lost packet is not one in the middle")
        has(f"di {size_text(size)}, cioè {shown(size)} B", f"portano {packet} B ciascuno", f"Il pacchetto numero {lost} va perso", "Quanti byte deve rimandare il mittente?")
        right, unit = packet, "B"  # only the lost packet is sent again
    else:
        errors.append(f"unknown case {case!r}")
        return None

    def value(o):
        n = int(o["values"][0])
        if o["latex"] != f"{shown(n)} {unit}":
            raise ValueError(f"option {o['latex']!r} does not say {n} {unit}")
        return n

    one_right(sample, lambda o: value(o) == right, errors)
    return case


def level5(sample, errors):
    m = re.fullmatch(r"Quale di queste cose (non )?è stabilita da un protocollo\?", sample["problem"])
    if not m:
        errors.append(f"level 5 text not recognised: {sample['problem']!r}")
        return None
    want = m.group(1) is None
    kind = kind_of(PROTOCOL)
    one_right(sample, lambda o: kind(o) == want, errors)
    return same_case(sample, "stabilita" if want else "non stabilita", errors)


def check(sample):
    errors = start(sample)
    if errors:
        return errors, None
    level = sample["level"]
    if level == 1:
        case = level1(sample, errors)
    elif level == 2:
        case = level2(sample, errors)
    elif level == 3:
        case = level3(sample, errors)
    elif level == 4:
        case = level4(sample, errors)
    elif level == 5:
        case = level5(sample, errors)
    elif level == 6:
        case = check_statements(sample, "su Internet", STATEMENTS, errors)
    else:
        errors.append(f"unknown level {level}")
        case = None
    return errors, case
