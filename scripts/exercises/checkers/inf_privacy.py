"""Checker for inf-privacy (specs/exercises/inf-privacy.md).

Written from the spec and the lesson, not from the generator. The answer is rebuilt from the pieces:
- level 1: the table below says of every piece of information whether it is about nobody in particular, an ordinary
  personal datum, or one of the special categories;
- level 2: the data subject is the person named in the text; the controller is who, in the text, keeps or uses the
  data; the Garante and the outsiders are never the answer;
- levels 3 and 4: the situation is sorted by its words into one rule, or one right;
- level 5: the table of the apps says which permissions each needs for what it does;
- level 6: the table of true and false statements.
"""
import re

from checkers._inf_sic import NAMES, bound, check_choice, check_sorted, check_statements, common

CASE_RANGES = {
    1: {"personale": (0.27, 0.43), "non personale": (0.22, 0.38), "particolare": (0.27, 0.43)},
    2: {"interessato": (0.40, 0.60), "titolare": (0.40, 0.60)},
    3: {k: (0.13, 0.27) for k in ["finalita", "minimizzazione", "conservazione", "trasparenza", "sicurezza"]},
    4: {k: (0.13, 0.27) for k in ["accesso", "rettifica", "cancellazione", "opposizione", "portabilita"]},
    6: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

# n: about nobody in particular; p: an ordinary personal datum; s: a special category
DATA = {
    "p1": ("p", "numero di telefono"), "p2": ("p", "indirizzo di casa"), "p3": ("p", "foto del tuo viso"), "p4": ("p", "voti nel registro"),
    "p5": ("p", "posizione del tuo telefono"), "p6": ("p", "soprannome"), "p7": ("p", "targa"), "p8": ("p", "libri che hai preso in prestito"),
    "p9": ("p", "registrazione della tua voce"), "p10": ("p", "indirizzo di posta"), "p11": ("p", "nome e cognome"), "p12": ("p", "data di nascita"),
    "n1": ("n", "media dei voti di tutta la scuola"), "n2": ("n", "temperatura"), "n3": ("n", "numero di studenti"), "n4": ("n", "orario di apertura"),
    "n5": ("n", "numero di abitanti"), "n6": ("n", "prezzo di un biglietto"), "n7": ("n", "classifica dei libri"), "n8": ("n", "numero di visitatori"),
    "s1": ("s", "certificato medico"), "s2": ("s", "religione"), "s3": ("s", "opinioni politiche"), "s4": ("s", "impronta del dito usata per riconoscere"),
    "s5": ("s", "allergie"), "s6": ("s", "origine etnica"), "s7": ("s", "orientamento sessuale"), "s8": ("s", "diagnosi"),
}
# personal data a student could take for biometric ones: not among the options when the special categories are asked
NEAR_SPECIAL = {"p3", "p9"}

# who treats the data -> (words of the text, the option that names it)
CONTROLLERS = {
    "scuola": ("La scuola conserva", "La scuola"),
    "app": ("app di messaggi", "L'azienda che produce l'app"),
    "biblioteca": ("biblioteca comunale", "La biblioteca"),
    "palestra": ("Una palestra", "La palestra"),
    "negozio": ("Un negozio in rete", "Il negozio in rete"),
    "gioco": ("gestisce un videogioco", "La società che gestisce il videogioco"),
    "social": ("di un social", "L'azienda del social"),
    "medico": ("Uno studio medico", "Lo studio medico"),
}
GARANTE = "Il Garante per la protezione dei dati personali"

RULES = {"finalita": "Finalità", "minimizzazione": "Minimizzazione", "conservazione": "Conservazione limitata", "trasparenza": "Trasparenza", "sicurezza": "Sicurezza"}
RULE_WORDS = {
    "finalita": ["lo passa", "lo nega", "scopo diverso"],
    "minimizzazione": ["torcia", "gruppo sanguigno", "soltanto i dati che servono"],
    "conservazione": ["ancora in archivio", "non gli servono più", "per sempre"],
    "trasparenza": ["non dice", "informativa"],
    "sicurezza": ["in chiaro", "raggiungibile da chiunque", "sotto chiave"],
}
RIGHTS = {
    "accesso": "Il diritto di accesso", "rettifica": "Il diritto di rettifica", "cancellazione": "Il diritto alla cancellazione",
    "opposizione": "Il diritto di opposizione", "portabilita": "Il diritto alla portabilità",
}
RIGHT_WORDS = {
    "accesso": ["averne una copia", "e quali sono", "ha registrato"],
    "rettifica": ["corregger", "sistemarlo"],
    "cancellazione": ["eliminare", "eliminati", "togliere dai suoi archivi"],
    "opposizione": ["pubblicità", "fermare quel trattamento", "promozionali"],
    "portabilita": ["formato"],
}

PERMISSIONS = {
    "fotocamera": "La fotocamera", "galleria": "La galleria delle foto", "rubrica": "La rubrica", "posizione": "La posizione precisa",
    "microfono": "Il microfono", "calendario": "Il calendario", "sms": "I messaggi SMS",
}
# app -> (words of the text, permissions it needs, permissions that are doubtful and must not be shown)
APPS = {
    "filtri": ("filtri alle foto", {"fotocamera", "galleria"}, set()),
    "mappe": ("app di mappe", {"posizione"}, {"microfono", "fotocamera"}),
    "vocale": ("note vocali", {"microfono"}, set()),
    "qr": ("codici QR", {"fotocamera"}, {"galleria"}),
    "meteo": ("app del meteo", {"posizione"}, set()),
    "canzoni": ("riconosce le canzoni", {"microfono"}, set()),
    "scanner": ("fogli di carta", {"fotocamera"}, {"galleria"}),
    "contatti": ("numeri salvati", {"rubrica"}, {"sms"}),
}

STATEMENTS = {
    "t1": (True, "anche se non contiene il nome"), "t2": (True, "si può ritirare in ogni momento"), "t3": (True, "non è il solo motivo"),
    "t4": (True, "senza chiederti il consenso"), "t5": (True, "non raggiunge chi"), "t6": (True, "cookie tecnici"),
    "t7": (True, "si possono rifiutare"), "t8": (True, "serve il suo consenso"), "t9": (True, "anche per le aziende di altri paesi"),
    "t10": (True, "reclamo al Garante"), "t11": (True, "possono identificare"), "t12": (True, "conservare un dato personale è un trattamento"),
    "f1": (False, "non è un dato personale"), "f2": (False, "qualcosa da nascondere"), "f3": (False, "sparisce di sicuro"),
    "f4": (False, "anche se una delle persone ritratte non vuole"), "f5": (False, "vieta di usare"), "f6": (False, "nessuno può mai trattare"),
    "f7": (False, "fa sparire anche le schermate"), "f8": (False, "è la persona a cui i dati si riferiscono"), "f9": (False, "Tutti i cookie"),
    "f10": (False, "non si può più ritirare"), "f11": (False, "è un dato personale"), "f12": (False, "tutti i dati che vuole"),
}


def level1(sample, errs):
    problem = sample["problem"]
    cases = {
        "Quale di queste informazioni è un dato personale?": ("personale", "p", "n"),
        "Quale di queste informazioni non è un dato personale?": ("non personale", "n", "p"),
        "Quale di questi dati personali appartiene alle categorie particolari, protette con più severità?": ("particolare", "s", "p"),
    }
    if problem not in cases:
        errs.append(f"level 1 text not recognised: {problem!r}")
        return None
    kind, right, wrong = cases[problem]

    def is_right(o):
        what = bound(o, DATA)
        if what not in (right, wrong):
            raise ValueError(f"option {o['values'][0]} does not belong to this question")
        if kind == "particolare" and o["values"][0] in NEAR_SPECIAL:
            raise ValueError("a datum that could be read as biometric among the options")
        return what == right

    check_choice(sample, is_right, errs)
    return kind


def level2(sample, errs):
    m = re.fullmatch(r"(.+\.) (Chi è l'interessato\?|Chi è il titolare del trattamento\?)", sample["problem"])
    if not m:
        errs.append(f"level 2 text not recognised: {sample['problem']!r}")
        return None
    text = m.group(1)
    kind = "interessato" if "interessato" in m.group(2) else "titolare"
    people = [n for n in NAMES if re.search(rf"\b{n}\b", text)]
    who = [c for c, (words, _) in CONTROLLERS.items() if words in text]
    if len(people) != 1 or len(who) != 1:
        errs.append(f"the text names {people} and {who}")
        return kind
    roles = {"interessato": people[0], "titolare": CONTROLLERS[who[0]][1], "garante": GARANTE}

    def is_right(o):
        role = o["values"][0]
        if role in roles:
            if o["latex"] != roles[role]:
                raise ValueError(f"option {o['latex']!r} is not the {role}")
        elif not re.fullmatch(r"x\d", role) or o["latex"] in roles.values():
            raise ValueError(f"unknown option {role!r}")
        return role == kind

    check_choice(sample, is_right, errs)
    if not {o["values"][0] for o in sample["answer"]["options"]} >= {"interessato", "titolare", "garante"}:
        errs.append("the person, the controller and the Garante are not all among the options")
    return kind


def level5(sample, errs):
    m = re.fullmatch(r"(\w+) installa (.+)\. L'app chiede diversi permessi: quale di questi è giustificato da quello che deve fare\?", sample["problem"])
    if not m or m.group(1) not in NAMES:
        errs.append(f"level 5 text not recognised: {sample['problem']!r}")
        return None
    found = [a for a, (words, _, _) in APPS.items() if words in m.group(2)]
    if len(found) != 1:
        errs.append(f"the text fits {len(found)} apps")
        return None
    _, needs, doubtful = APPS[found[0]]

    def is_right(o):
        p = o["values"][0]
        if PERMISSIONS.get(p) != o["latex"]:
            raise ValueError(f"option {o['latex']!r} is not the permission {p!r}")
        if p in doubtful:
            raise ValueError(f"a doubtful permission among the options: {p}")
        return p in needs

    check_choice(sample, is_right, errs)
    return found[0]


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
        kind = check_sorted(sample, "Di quale regola sul trattamento dei dati si parla?", RULES, RULE_WORDS, errs)
    elif lvl == 4:
        kind = check_sorted(sample, "Quale diritto sta esercitando?", RIGHTS, RIGHT_WORDS, errs)
    elif lvl == 5:
        kind = level5(sample, errs)
    elif lvl == 6:
        kind = check_statements(sample, "sulla privacy", STATEMENTS, errs)
    else:
        errs.append(f"unknown level {lvl}")
    if kind is not None and sample["params"].get("case") != kind:
        errs.append("wrong case in params")
    return errs, kind
