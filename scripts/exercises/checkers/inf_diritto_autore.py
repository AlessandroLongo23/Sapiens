"""Checker for inf-diritto-autore (specs/exercises/inf-diritto-autore.md).

Written from the spec and the lesson, not from the generator. The answer is rebuilt from the pieces:
- level 1: the table of true and false statements below;
- level 2: the situation is sorted by its words (quotation marks, a work passed off as one's own, a whole work of
  today published, a work of centuries ago);
- level 3: the code of the licence is read from the text and split into its elements; whether the use changes the
  work and whether it earns money are read from the text too; the verdict is worked out here from NC, ND and SA;
- level 4: the code is composed here from the choices the text states;
- level 5: the description is sorted by its words into a kind of software; the table below says what each kind lets
  you do;
- level 6: the table of the situations; an attribution is complete when it carries title, author, source and
  licence.
"""
import re

from checkers._inf_sic import NAMES, bound, check_choice, check_situation, check_sorted, check_statements, common

CASE_RANGES = {
    1: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
    2: {k: (0.18, 0.32) for k in ["citazione", "plagio", "permesso", "dominio"]},
    3: {k: (0.18, 0.32) for k in ["si", "siSA", "noND", "noNC"]},
    4: {f"BY{x}": (0.10, 0.24) for x in ["", "-SA", "-ND", "-NC", "-NC-SA", "-NC-ND"]},
    5: {"proprietario": (0.11, 0.22), "freeware": (0.11, 0.22), "copyleft": (0.11, 0.22), "permissivo": (0.11, 0.22), "puoi": (0.17, 0.30), "non puoi": (0.07, 0.17)},
}

STATEMENTS = {
    "t1": (True, "nasce da solo"), "t2": (True, "anche senza il simbolo"), "t3": (True, "protegge la forma"),
    "t4": (True, "tutti i diritti sono riservati"), "t5": (True, "restano sempre all'autore"), "t6": (True, "si possono cedere"),
    "t7": (True, "Anche un programma"), "t8": (True, "senza chiedere niente"), "t9": (True, "ha diritti suoi"),
    "t10": (True, "Chiunque può scrivere un romanzo"), "t11": (True, "si cita l'autore"), "t12": (True, "non il diritto di farne altre"),
    "f1": (False, "deve essere registrata"), "f2": (False, "si può usare liberamente"), "f3": (False, "in rete è libero"),
    "f4": (False, "protegge le idee"), "f5": (False, "si possono vendere"), "f6": (False, "può pubblicarlo in rete"),
    "f7": (False, "Citare la fonte basta"), "f8": (False, "Se non ci guadagni"), "f9": (False, "come l'originale"),
    "f10": (False, "non sono protetti"), "f11": (False, "non scadono mai"), "f12": (False, "dichiararti autore"),
}

USES = {
    "citazione": "Una citazione corretta",
    "plagio": "Un plagio",
    "permesso": "Un uso che richiede il permesso dell'autore",
    "dominio": "Un uso libero: l'opera è nel pubblico dominio",
}
USE_WORDS = {
    "citazione": ["tra virgolette"],
    "plagio": ["senza dire da dove", "come proprio", "come sua"],
    "permesso": ["capitolo intero", "canzone di oggi", "privo di ogni indicazione"],
    "dominio": ["Dante", "morto nel Settecento", "Verdi"],
}

VERDICTS = {
    "si": "Sì, indicando l'autore",
    "siSA": "Sì, indicando l'autore e dando alla sua versione la stessa licenza",
    "noND": "No: la licenza non permette di modificarla",
    "noNC": "No: la licenza non permette usi commerciali",
}
CODES = {"BY", "BY-SA", "BY-ND", "BY-NC", "BY-NC-SA", "BY-NC-ND"}

KINDS = {
    "proprietario": "Software proprietario a pagamento",
    "freeware": "Freeware",
    "copyleft": "Software libero con copyleft",
    "permissivo": "Software libero con licenza permissiva",
}
KIND_WORDS = {
    "proprietario": ["comprato", "si paga", "in vendita"],
    "freeware": ["gratis", "non costa niente", "gratuito"],
    "copyleft": ["stessa licenza"],
    "permissivo": ["nome degli autori"],
}
# action -> (words, proprietary, freeware, free): True, False, or None where the lesson does not say
ACTIONS = {
    "uso": ("alle condizioni della sua licenza", True, True, True),
    "gratis": ("senza pagare", False, True, None),
    "sorgente": ("codice sorgente", False, False, True),
    "modifica": ("Modificarlo", False, False, True),
    "copie": ("copie ad altri", False, None, True),
    "versioni": ("versione modificata", False, False, True),
    "tuo": ("come scritto da te", False, False, False),
}
SOFTWARE = {"un programma proprietario a pagamento": 1, "un freeware": 2, "un software libero": 3}

SITUATIONS = {
    "blog": ("accanto non c'è nessuna indicazione", "chiedere il permesso"),
    "canzone": ("canzone famosa", "Cercare un brano"),
    "film": ("film appena uscito", "Lasciar perdere"),
    "enciclopedia": ("tre paragrafi", "tra virgolette con la fonte"),
    "filtro": ("deve trovare delle immagini", "filtro sulla licenza"),
    "archivio": ("In un archivio di immagini", "licenza di quel file preciso"),
    "dipinto": ("pittore morto da secoli", "Sì:"),
    "propria": ("ha scattato una foto", "Scegliere per la foto una licenza"),
    "fotomontaggio": ("fotomontaggio", "Rinunciare"),
}


def elements(code):
    if code not in CODES:
        raise ValueError(f"not a Creative Commons licence: {code!r}")
    return set(code.split("-"))


def level3(sample, errs):
    m = re.fullmatch(r"(\w+) trova (.+) con licenza CC ([A-Z-]+) e vuole (.+)\. Può farlo\?", sample["problem"])
    if not m or m.group(1) not in NAMES:
        errs.append(f"level 3 text not recognised: {sample['problem']!r}")
        return None
    try:
        parts = elements(m.group(3))
    except ValueError as e:
        errs.append(str(e))
        return None
    use = m.group(4)
    modify = "modificarla" in use
    as_it_is = "così com'è" in use
    commercial = "vender" in use
    if modify == as_it_is:
        errs.append("the use does not say whether the work is changed")
    if "NC" in parts and commercial and "ND" in parts and modify:
        errs.append("two reasons to say no")
    if "NC" in parts and commercial:
        verdict = "noNC"
    elif "ND" in parts and modify:
        verdict = "noND"
    elif "SA" in parts and modify:
        verdict = "siSA"
    else:
        verdict = "si"
    params = sample["params"]
    if (params.get("licence"), params.get("modify"), params.get("commercial")) != (m.group(3), modify, commercial):
        errs.append("params do not carry the licence and the use of the text")

    def is_right(o):
        v = o["values"][0]
        if VERDICTS.get(v) != o["latex"]:
            raise ValueError(f"option {o['latex']!r} is not the verdict {v!r}")
        return v == verdict

    check_choice(sample, is_right, errs)
    return verdict


def level4(sample, errs):
    m = re.fullmatch(r"(\w+) pubblica una sua \w+ e decide così: chi la usa deve indicare l'autore; gli usi commerciali (non )?sono permessi; l'opera (.+)\. Quale licenza Creative Commons corrisponde a queste scelte\?", sample["problem"])
    if not m or m.group(1) not in NAMES:
        errs.append(f"level 4 text not recognised: {sample['problem']!r}")
        return None
    code = ["BY"]
    if m.group(2):
        code.append("NC")
    changes = m.group(3)
    if changes == "non si può modificare":
        code.append("ND")
    elif changes == "si può modificare, ma la versione modificata deve avere la stessa licenza":
        code.append("SA")
    elif changes != "si può modificare senza altre condizioni":
        errs.append(f"changes not recognised: {changes!r}")
        return None
    code = "-".join(code)

    def is_right(o):
        elements(o["values"][0])
        if o["latex"] != "CC " + o["values"][0]:
            raise ValueError(f"option {o['latex']!r} is not the licence {o['values'][0]!r}")
        return o["values"][0] == code

    check_choice(sample, is_right, errs)
    return code


def level5(sample, errs):
    m = re.fullmatch(r"Con (.+), quale di queste cose (non )?puoi fare\?", sample["problem"])
    if not m:
        return check_sorted(sample, "Di che tipo di software si tratta?", KINDS, KIND_WORDS, errs, named=False)
    if m.group(1) not in SOFTWARE:
        errs.append(f"unknown software {m.group(1)!r}")
        return None
    column, want = SOFTWARE[m.group(1)], m.group(2) is None

    def is_right(o):
        a = o["values"][0]
        if a not in ACTIONS or ACTIONS[a][0].lower() not in o["latex"].lower():
            raise ValueError(f"option {o['latex']!r} is not the action {a!r}")
        can = ACTIONS[a][column]
        if can is None:
            raise ValueError(f"the lesson does not say whether {a} is allowed")
        return can == want

    check_choice(sample, is_right, errs)
    return "puoi" if want else "non puoi"


def level6(sample, errs):
    params = sample["params"]
    if sample["problem"].endswith("Quale di queste attribuzioni è completa?"):
        parts = [params.get(k) for k in ("title", "author", "source", "licence")]
        if any(not p for p in parts) or not re.fullmatch(r"CC [A-Z-]+", parts[3]) or not parts[2].endswith("esempio.it"):
            errs.append("params do not carry the four parts of the attribution")
            return None
        try:
            elements(parts[3][3:])
        except ValueError as e:
            errs.append(str(e))
        missing = []

        def complete(o):
            absent = [p for p in parts if p not in o["latex"]]
            missing.append(len(absent))
            return not absent

        check_choice(sample, complete, errs)
        if sorted(missing) != [0, 1, 1, 1]:
            errs.append("a wrong attribution does not miss exactly one part")
        return "crediti"
    return check_situation(sample, SITUATIONS, errs)


def check(sample):
    errs = []
    if common(sample, errs) is None or errs:
        return errs, None
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        kind = check_statements(sample, "sul diritto d'autore", STATEMENTS, errs)
    elif lvl == 2:
        kind = check_sorted(sample, "Di che cosa si tratta?", USES, USE_WORDS, errs)
    elif lvl == 3:
        kind = level3(sample, errs)
    elif lvl == 4:
        kind = level4(sample, errs)
    elif lvl == 5:
        kind = level5(sample, errs)
    elif lvl == 6:
        kind = level6(sample, errs)
    else:
        errs.append(f"unknown level {lvl}")
    if kind is not None and sample["params"].get("case") != kind:
        errs.append("wrong case in params")
    return errs, kind
