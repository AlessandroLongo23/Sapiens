"""Checker for inf-phishing (specs/exercises/inf-phishing.md).

Written from the spec and the lesson, not from the generator. The answer is rebuilt from the pieces:
- level 1: the table below says which details are signals and which prove nothing;
- level 2: the host of the address is cut out here (between :// and the first slash) and its last two labels are
  the answer;
- level 3: the same is done on every option, and an address belongs to the real site when those two labels are the
  domain the text gives;
- level 4: the table of the situations;
- level 5: the table of true and false statements.
"""
import re

from checkers._inf_sic import bound, check_choice, check_situation, check_statements, common

CASE_RANGES = {
    1: {"segnale": (0.40, 0.60), "neutro": (0.40, 0.60)},
    2: {"esca": (0.47, 0.63), "semplice": (0.37, 0.53)},
    3: {"vero": (0.52, 0.68), "falso": (0.32, 0.48)},
    5: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

# True: a signal of phishing. False: a detail that proves nothing.
DETAILS = {
    "g1": (True, "dominio diverso"), "g2": (True, "urgente"), "g3": (True, "generico"), "g4": (True, "scrivere la password"),
    "g5": (True, "codice appena arrivato"), "g6": (True, "indirizzo diverso"), "g7": (True, "premio"), "g8": (True, "multa"),
    "g9": (True, "ricariche o buoni regalo"), "g10": (True, "installare un programma"),
    "n1": (False, "italiano corretto"), "n2": (False, "logo"), "n3": (False, "giorno feriale"), "n4": (False, "decina di righe"),
    "n5": (False, "data di oggi"), "n6": (False, "servizio che usi davvero"), "n7": (False, "saluti"), "n8": (False, "immagine"),
}

# The invented domains an exercise may use.
REAL = {"esempio.it", "banca.example", "corriere.example", "registro.example", "giochi.example", "posta.example", "negozio.example", "scuola.example"}

SITUATIONS = {
    "pacco": ("pacco è in giacenza", "senza usare il link"),
    "telefonata": ("riceve una telefonata", "Riattaccare"),
    "chat": ("me lo giri", "Non girare il codice"),
    "annuncio": ("in un annuncio", "Lasciar perdere"),
    "monete": ("monete gratis", "Non accedere"),
    "qr": ("codice QR", "Leggere l'indirizzo"),
    "chiusura": ("sarà chiuso entro 24 ore", "Non usare il link"),
    "gestore": ("non propone le credenziali", "Guardare l'indirizzo"),
    "fretta": ("entro dieci minuti", "verificare con un altro canale"),
    "caduto": ("su una pagina falsa", "entrando dal sito vero"),
    "carta": ("dati della carta", "Avvisare i genitori"),
    "segnalare": ("ha riconosciuto un messaggio di phishing", "Segnalarlo"),
    "vergogna": ("se ne vergogna", "parlarne con un adulto"),
}

STATEMENTS = {
    "t1": (True, "lo sceglie chi scrive"), "t2": (True, "può esserci scritto qualunque cosa"), "t3": (True, "Anche una pagina falsa può avere"),
    "t4": (True, "anche gli adulti"), "t5": (True, "inganna la persona"), "t6": (True, "ultime due parti"),
    "t7": (True, "può essere falso lo stesso"), "t8": (True, "Nessun servizio chiede"), "t9": (True, "solo sul dominio"),
    "t10": (True, "per posta, per SMS"), "t11": (True, "non chi c'è dall'altra parte"), "t12": (True, "fermare il puntatore"),
    "f1": (False, "di sicuro vero"), "f2": (False, "il sito è onesto"), "f3": (False, "cascano solo"), "f4": (False, "arriva di sicuro dal servizio"),
    "f5": (False, "più a sinistra dice"), "f6": (False, "di sicuro scritto da lui"), "f7": (False, "può chiederti per telefono"),
    "f8": (False, "coincidono sempre"), "f9": (False, "solo per posta"), "f10": (False, "appartiene al sito"),
    "f11": (False, "agire subito"), "f12": (False, "non dirlo a nessuno"),
}

LABEL = r"[a-z0-9]+(?:-[a-z0-9]+)*"
# an address is shown with a zero-width space after every dot and slash, so that it can go on two lines
SOFT = "\u200b"


def plain(text):
    return text.replace(SOFT, "")


def well_broken(shown):
    """The places where a shown address may break are after its dots and slashes, and nowhere else."""
    return all(part and part[-1] in "./" for part in shown.split(SOFT)[:-1])


def host_of(address):
    m = re.fullmatch(rf"https://({LABEL}(?:\.{LABEL})+)/(\S*)", address)
    if not m:
        raise ValueError(f"not an address: {address!r}")
    return m.group(1)


def registered(host):
    """The last two labels: every domain of these exercises ends in .it or .example."""
    labels = host.split(".")
    if labels[-1] not in ("it", "example"):
        raise ValueError(f"a domain that is not invented: {host!r}")
    return ".".join(labels[-2:])


def level1(sample, errs):
    problem = sample["problem"]
    if problem == "Quale di questi particolari di un messaggio è un segnale di phishing?":
        want, kind = True, "segnale"
    elif problem == "Quale di questi particolari, da solo, non dice niente sull'onestà di un messaggio?":
        want, kind = False, "neutro"
    else:
        errs.append(f"level 1 text not recognised: {problem!r}")
        return None
    check_choice(sample, lambda o: bound(o, DETAILS) == want, errs)
    return kind


def level2(sample, errs):
    m = re.fullmatch(r"Un link porta a (\S+) e vuoi sapere di chi è il sito\. Quali sono le due parti dell'indirizzo che lo dicono\?", plain(sample["problem"]))
    if not m:
        errs.append(f"level 2 text not recognised: {sample['problem']!r}")
        return None
    try:
        host = host_of(m.group(1))
        domain = registered(host)
    except ValueError as e:
        errs.append(str(e))
        return None
    labels = host.split(".")
    if len(labels) < 3:
        errs.append("the address has nothing but its domain")
    if sample["params"].get("host") != host:
        errs.append("params.host is not the host of the text")
    check_choice(sample, lambda o: o["latex"] == domain and o["values"][0] == domain, errs)
    # the trap: a real site written on the left of somebody else's domain
    bait = ".".join(labels[:2]) in REAL and domain not in REAL
    if not bait and domain not in REAL:
        errs.append(f"the domain {domain!r} is neither a real site nor a trap")
    return "esca" if bait else "semplice"


def level3(sample, errs):
    m = re.fullmatch(r"Il sito vero di .+ è (\S+)\. Quale di questi indirizzi (non )?gli appartiene\?", sample["problem"])
    if not m:
        errs.append(f"level 3 text not recognised: {sample['problem']!r}")
        return None
    real, want = m.group(1), m.group(2) is None
    if real not in REAL or sample["params"].get("real") != real:
        errs.append(f"unknown real site {real!r}")

    def belongs(o):
        if plain(o["latex"]) != o["values"][0] or not well_broken(o["latex"]):
            raise ValueError("an address option whose value is not its text")
        return (registered(host_of(o["values"][0])) == real) == want

    check_choice(sample, belongs, errs)
    return "vero" if want else "falso"


def check(sample):
    errs = []
    if common(sample, errs) is None or errs:
        return errs, None
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        kind = level1(sample, errs)
    elif lvl == 2:
        kind = level2(sample, errs)
    elif lvl == 3:
        kind = level3(sample, errs)
    elif lvl == 4:
        kind = check_situation(sample, SITUATIONS, errs)
    elif lvl == 5:
        kind = check_statements(sample, "sul phishing", STATEMENTS, errs)
    else:
        errs.append(f"unknown level {lvl}")
    if kind is not None and sample["params"].get("case") != kind:
        errs.append("wrong case in params")
    return errs, kind
