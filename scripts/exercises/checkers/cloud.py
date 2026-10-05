"""Checker for cloud (specs/exercises/cloud.md).

Written from the spec and the lesson, not from the generator. The right option is rebuilt from the pieces:
- level 1: the table of true and false statements;
- level 2: the numbers are read from the question and the count is done here, in megabytes, with exact fractions;
- level 3: the situation is recognised from its words, and the table says what synchronisation does in each;
- level 4: the needs are read from the question, each takes a permission, and the lowest that covers them is the
  answer; what a permission lets one do comes from the table below;
- level 5: the people who can open the file are counted from the numbers in the question (the invited ones, plus
  those who got the link when the link is open); the way to share comes from the words of the situation;
- level 6: the remedy comes from the words of the situation; the table of true and false statements.
"""
import re
from fractions import Fraction

from checkers._inf_web2 import NAMES, check_choice, check_statements, common

CASE_RANGES = {
    1: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
    2: {k: (0.26, 0.41) for k in ["quante", "occupano", "restano"]},
    3: {k: (0.14, 0.26) for k in ["cancella", "locale", "offline", "conflitto", "nuova"]},
    4: {"basta": (0.62, 0.78), "cosa": (0.22, 0.38)},
    5: {"apre con il link": (0.20, 0.35), "apre con l'invito": (0.20, 0.35), "modo": (0.37, 0.53)},
    6: {"rimedio": (0.42, 0.58), "vera": (0.18, 0.32), "falsa": (0.18, 0.32)},
}

CLOUD = {
    "t1": (True, "computer veri"), "t2": (True, "edificio"), "t3": (True, "in più copie"), "t4": (True, "fa da client"),
    "t5": (True, "attraverso Internet"), "t6": (True, "senza possedere"), "t7": (True, "giorno e notte"),
    "t8": (True, "quando ti servono"),
    "f1": (False, "su nessun computer"), "f2": (False, "un'app da installare"), "f3": (False, "comprare un server"),
    "f4": (False, "in una sola copia"), "f5": (False, "fa da server"), "f6": (False, "senza nessuna rete"),
    "f7": (False, "fa perdere i file"), "f8": (False, "solo spazio per i file"),
}

# ---------------------------------------------------------------------------
# level 2

MB_PER_GB = 1000


def plain(label):
    """A number with its thousands set apart by a narrow space -> the digits alone."""
    return label.replace("\u202f", "")


def amount(o, unit):
    m = re.fullmatch(rf"(\d+(?:,\d+)?) {unit}", plain(o["latex"]))
    if not m:
        raise ValueError(f"{o['latex']!r} is not a number of {unit}")
    value = Fraction(m.group(1).replace(",", "."))
    if Fraction(o["values"][0]) != value:
        raise ValueError(f"{o['latex']!r} does not say its value")
    return value


def level2(sample, errs):
    text = sample["problem"]
    if not text.endswith(" Usa 1 GB = 1000 MB."):
        errs.append("the conversion is not given")
    m = re.match(r"Un servizio di archiviazione offre (\d+) GB di spazio\. Quant[ei] (foto|canzoni|documenti) da (\d+) MB ci stanno\?", text)
    if m:
        space, what, size = int(m.group(1)), m.group(2), int(m.group(3))
        want = Fraction(space * MB_PER_GB, size)
        if want.denominator != 1:
            errs.append("the files do not fill the space exactly")
        check_choice(sample, lambda o: amount(o, what) == want, errs)
        return "quante"
    m = re.match(r"(\w+) tiene nel cloud (\d+) video da (\d+) MB ciascuno\. Quanti GB occupano in tutto\?", text)
    if m:
        want = Fraction(int(m.group(2)) * int(m.group(3)), MB_PER_GB)
        if (want * 10).denominator != 1:
            errs.append("more than one decimal digit")
        check_choice(sample, lambda o: amount(o, "GB") == want, errs)
        return "occupano"
    m = re.match(r"Lo spazio di (\w+) nel cloud è di (\d+) GB\. Ci sono già (\d+) video da (\d+) MB ciascuno\. Quante foto da (\d+) MB ci stanno ancora\?", text)
    if m:
        space, videos, size, photo = (int(m.group(i)) for i in range(2, 6))
        left = space * MB_PER_GB - videos * size
        want = Fraction(left, photo)
        if left <= 0 or want.denominator != 1:
            errs.append("no space left, or the photos do not fill it exactly")
        check_choice(sample, lambda o: amount(o, "foto") == want, errs)
        return "restano"
    errs.append(f"level 2 text not recognised: {text!r}")
    return None


# ---------------------------------------------------------------------------
# level 3: the words of each situation, and what the right outcome must say

SYNCS = [
    ("cancella", "la cancella dal telefono per fare spazio", "Sparisce anche dal cloud e dagli altri dispositivi"),
    ("locale", "togliendo solo la copia locale", "Sparisce solo dal telefono e resta nel cloud"),
    ("offline", "in treno, senza connessione", "viene caricata quando torna la rete"),
    ("conflitto", "nel frattempo la cambia anche dal telefono", "Conserva le due versioni come due file distinti"),
    ("nuova", "con la sincronizzazione attiva e la rete che funziona", "Viene copiata sul server e da lì sugli altri dispositivi"),
]


def level3(sample, errs):
    text = sample["problem"]
    got = [(k, outcome) for k, words, outcome in SYNCS if words in text]
    if len(got) != 1 or not any(text.startswith(n + " ") for n in NAMES):
        errs.append(f"the situation fits {len(got)} cases, or has no known name")
        return None
    kind, outcome = got[0]

    def right(o):
        case, _, which = o["values"][0].partition(":")
        if case != kind:
            raise ValueError(f"option of another situation: {o['values'][0]}")
        if (which == "ok") != (outcome in o["latex"]):
            raise ValueError(f"option {o['values'][0]} does not say what its value says")
        return outcome in o["latex"]

    check_choice(sample, right, errs)
    return kind


# ---------------------------------------------------------------------------
# level 4: permissions, from the lowest

ACCESS = ["nessuno", "lettura", "commento", "modifica"]
ACCESS_LABEL = ["Nessun accesso", "Lettura", "Commento", "Modifica"]
CAN = ["non può nemmeno aprirlo", "leggerlo, e nient'altro", "lasciare commenti a margine, senza cambiare", "cambiarne il contenuto"]
# what someone must do, and the permission it takes
NEEDS = [
    ("leggerlo", 1), ("consultarlo quando serve", 1), ("vedere a che punto è il lavoro", 1),
    ("segnare a margine che cosa correggere, senza toccare il contenuto", 2), ("lasciare un parere a margine", 2), ("fare domande a margine", 2),
    ("scriverne una parte", 3), ("correggere direttamente gli errori", 3), ("aggiungere i dati nuovi", 3),
]


def level4(sample, errs):
    text = sample["problem"]
    options = sample["answer"]["options"]
    if sorted(o["values"][0] for o in options) != sorted(ACCESS):
        errs.append("the options are not the four accesses")
        return None
    m = re.fullmatch(r"(\w+) ha ricevuto da (\w+) .+ con il permesso di (lettura|commento|modifica)\. Che cosa può fare con il file\?", text)
    if m:
        level = ACCESS.index(m.group(3))
        if any(CAN[ACCESS.index(o["values"][0])] not in o["latex"] for o in options):
            errs.append("an option does not say what its access lets one do")
        check_choice(sample, lambda o: ACCESS.index(o["values"][0]) == level, errs)
        return "cosa"
    if any(ACCESS_LABEL[ACCESS.index(o["values"][0])] != o["latex"] for o in options):
        errs.append("an option is not the name of its access")
    if re.fullmatch(r"(\w+) sta per condividere .+\. (\w+) non lavora al file e non ha motivo di vederlo\. Quale accesso conviene dare ad? \2, il più basso che basta\?", text):
        level = 0
    else:
        m = re.fullmatch(r"(\w+) condivide .+ con (\w+), che deve (solo )?(.+)\. Quale accesso conviene dare ad? \2, il più basso che basta\?", text)
        if not m:
            errs.append(f"level 4 text not recognised: {text!r}")
            return None
        asked = m.group(4).split(" e ")
        levels = [dict(NEEDS).get(a) for a in asked]
        if None in levels or len(asked) > 2 or (len(asked) == 1) != bool(m.group(3)) or len(set(levels)) != len(levels):
            errs.append(f"needs not recognised: {asked}")
            return None
        # the lowest permission that covers every need
        level = max(levels)
    check_choice(sample, lambda o: ACCESS.index(o["values"][0]) == level, errs)
    return "basta"


# ---------------------------------------------------------------------------
# level 5

def count(o):
    m = re.fullmatch(r"(\d+) (persona|persone)", o["latex"])
    if not m or (m.group(1) == "1") != (m.group(2) == "persona") or o["values"][0] != m.group(1):
        raise ValueError(f"{o['latex']!r} is not a number of people")
    return int(m.group(1))


WAYS = {"invito": "Con un invito a persone precise", "link": "Con un link aperto a chiunque"}
# the words that say what the people must do with the file
PERMISSIONS = [
    ("modifica", ["tenere aggiornato", "devono scrivere"]),
    ("commento", ["segnare a margine", "lasciare un commento"]),
    ("lettura", ["poter guardare", "far vedere", "poter leggere", "far leggere", "nessuno deve cambiarlo"]),
]


def level5(sample, errs):
    text = sample["problem"]
    m = re.fullmatch(r"(\w+) condivide .+ con un link aperto a chiunque lo abbia, e lo manda a (\d+) compagni\. Uno di loro inoltra il link ad altre (\d+) persone\. Quante persone, oltre ad? \1, possono aprire il file\?", text)
    if m:
        # whoever has the link opens the file
        want = int(m.group(2)) + int(m.group(3))
        check_choice(sample, lambda o: count(o) == want, errs)
        return "apre con il link"
    m = re.fullmatch(r"(\w+) condivide .+ con un invito agli indirizzi di (\d+) compagni\. Uno di loro inoltra il messaggio di invito ad altre (\d+) persone\. Quante persone, oltre ad? \1, possono aprire il file\?", text)
    if m:
        # only the invited ones
        want = int(m.group(2))
        check_choice(sample, lambda o: count(o) == want, errs)
        return "apre con l'invito"
    m = re.fullmatch(r"(\w+) deve condividere (.+)\. Come conviene condividere il file\?", text)
    if m:
        what = m.group(2)
        # for anyone: a link; for precise people only: an invitation
        anyone, precise = "chiunque" in what, "solo" in what
        permissions = [p for p, words in PERMISSIONS if any(w in what for w in words)]
        if anyone == precise or len(permissions) != 1:
            errs.append(f"the situation is not clear: anyone {anyone}, precise {precise}, permissions {permissions}")
            return None
        want = f"{'link' if anyone else 'invito'}:{permissions[0]}"

        def way(o):
            w, _, p = o["values"][0].partition(":")
            if o["latex"] != f"{WAYS[w]}, in {p}" or p not in ("lettura", "commento", "modifica"):
                raise ValueError(f"{o['latex']!r} is not {o['values'][0]!r}")
            return o["values"][0]

        check_choice(sample, lambda o: way(o) == want, errs)
        return "modo"
    errs.append(f"level 5 text not recognised: {text!r}")
    return None


# ---------------------------------------------------------------------------
# level 6

REMEDIES = {
    "cronologia": "Aprire la cronologia delle versioni",
    "cestino": "Guardare nel cestino del servizio",
    "commento": "Lasciare un commento accanto al testo",
    "copia": "Tenere una seconda copia fuori dal cloud",
    "togliere": "Togliere la condivisione",
}
TROUBLE_WORDS = [
    ("cronologia", ["cancellato per sbaglio una sezione", "com'era due giorni fa"]),
    ("cestino", ["cancellato per errore dal suo spazio", "sparito anche dal cloud"]),
    ("commento", ["senza cambiarla di nascosto", "lasciando il testo com'è"]),
    ("copia", ["teme di perderlo"]),
    ("togliere", ["torni privato", "in chat che non conosce"]),
]
WORK = {
    "t1": (True, "più persone possono scrivere"), "t2": (True, "chi ha fatto ogni modifica"), "t3": (True, "solo la parte che serve"),
    "t4": (True, "il documento è uno solo"), "t5": (True, "solo i file già scaricati"), "t6": (True, "entra in tutti i tuoi file"),
    "t7": (True, "senza installarla"), "t8": (True, "subito la versione nuova"), "t9": (True, "nel cloud restano"),
    "t10": (True, "fa sparire le modifiche fatte dopo"),
    "f1": (False, "una sola persona alla volta"), "f2": (False, "ricordarsi di salvare"), "f3": (False, "sempre sulla stessa copia"),
    "f4": (False, "solo l'ultima versione"), "f5": (False, "anche senza connessione"), "f6": (False, "va installata"),
    "f7": (False, "vanno persi"), "f8": (False, "al sicuro in qualunque caso"), "f9": (False, "serve un computer potente"),
    "f10": (False, "su computer tuoi"),
}


def level6(sample, errs):
    m = re.fullmatch(r"(.+) Che cosa conviene fare\?", sample["problem"])
    if not m:
        return check_statements(sample, "sul lavoro nel cloud", WORK, errs)
    got = [r for r, words in TROUBLE_WORDS if any(w in m.group(1) for w in words)]
    if len(got) != 1:
        errs.append(f"the situation fits {len(got)} remedies")
        return None

    def remedy(o):
        if REMEDIES.get(o["values"][0]) != o["latex"]:
            raise ValueError(f"{o['latex']!r} is not the remedy {o['values'][0]!r}")
        return o["values"][0]

    check_choice(sample, lambda o: remedy(o) == got[0], errs)
    return "rimedio"


LEVELS = {2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = common(sample)
    if errs:
        return errs, None
    level = sample["level"]
    if level == 1:
        kind = check_statements(sample, "sul cloud", CLOUD, errs)
    elif level in LEVELS:
        kind = LEVELS[level](sample, errs)
    else:
        return [f"unknown level {level}"], None
    if plain(sample["answer"]["options"][sample["answer"]["correct"]]["latex"]).lower() not in plain(sample["solution"]).lower():
        errs.append("the solution is not the right option")
    if kind is not None and sample["params"]["case"] != kind:
        errs.append(f"params say case {sample['params']['case']!r}, the question is {kind!r}")
    return errs, kind
