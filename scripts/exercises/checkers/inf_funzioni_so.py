"""Checker for inf-funzioni-so (specs/exercises/inf-funzioni-so.md).

Written from the spec and the lesson, not from the generator. The answer is rebuilt from the pieces:
- level 1: every option is a task with an id; the table below says which tasks belong to the operating system and
  which to applications, and the words each must contain; the question says which kind is asked;
- level 2: the situation is classified by the resource it names (CPU, RAM, disco, a device and its driver, the
  objects of the interface) and exactly one function must match;
- level 3: the route of a request is always application, operating system, hardware; the neighbour of a layer and the
  layer with a given role come from the order of the layers written here;
- level 4: the table of true and false statements below.
"""
import re

from checkers._inf_so import NAMES, check_choice, check_statements, common, option_text, prose_and_extra

CASE_RANGES = {
    1: {"compito": (0.40, 0.60), "non compito": (0.40, 0.60)},
    2: {k: (0.13, 0.27) for k in ["processi", "memoria", "file", "periferiche", "interfaccia"]},
    3: {"percorso": (0.52, 0.68), "vicino": (0.09, 0.21), "ruolo": (0.18, 0.32)},
    4: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

# True: a task of the operating system. False: a task of an application.
TASKS = {
    "o1": (True, "usa la CPU"), "o2": (True, "assegnare la RAM"), "o3": (True, "punto del disco"), "o4": (True, "dialogare"),
    "o5": (True, "impedire"), "o6": (True, "caricare un programma"), "o7": (True, "tradurre le richieste"),
    "o8": (True, "chi può aprire"), "o9": (True, "riprendersi la memoria"), "o10": (True, "tocchi"),
    "o11": (True, "organizzare i file"), "o12": (True, "a turno"),
    "a1": (False, "ortografia"), "a2": (False, "media dei voti"), "a3": (False, "ritoccare"), "a4": (False, "pagina web"),
    "a5": (False, "montare"), "a6": (False, "slide"), "a7": (False, "scacchi"), "a8": (False, "inglese"),
    "a9": (False, "grafico"), "a10": (False, "mappa"), "a11": (False, "canzone"), "a12": (False, "punteggio"),
}

FUNCTIONS = {
    "processi": "Gestione dei processi",
    "memoria": "Gestione della memoria",
    "file": "Gestione dei file",
    "periferiche": "Gestione delle periferiche",
    "interfaccia": "Interfaccia utente",
}
# The resource a situation names decides its function.
RESOURCES = [
    ("processi", ["CPU"]),
    ("memoria", ["RAM"]),
    ("file", ["disco"]),
    ("periferiche", ["driver", "stampante", "cuffie"]),
    ("interfaccia", ["icon", "menu", "scrive un comando"]),
]

LAYERS = ["L'hardware", "Il sistema operativo", "Le applicazioni", "L'utente"]  # from the bottom
ROLES = [
    ["fisicamente", "si possono toccare", "più in basso"],
    ["attraverso i driver", "riceve le chiamate", "assegna la CPU"],
    ["chiede le risorse", "serve all'utente", "tra l'utente e il sistema operativo"],
    ["più in alto", "dà gli ordini", "usa le applicazioni"],
]

STATEMENTS = {
    "t1": (True, "software di base"), "t2": (True, "finché il computer è acceso"), "t3": (True, "modello preciso"),
    "t4": (True, "chiedono le risorse al nucleo"), "t5": (True, "si può installare un altro"), "t6": (True, "Anche un telefono"),
    "t7": (True, "file system"), "t8": (True, "solo software che comanda"), "t9": (True, "senza interfaccia grafica"),
    "t10": (True, "può essere una applicazione"), "t11": (True, "solo con quelli vicini"), "t12": (True, "tiene separata"),
    "f1": (False, "componente dell'hardware"), "f2": (False, "si vede sullo schermo"), "f3": (False, "senza passare"),
    "f4": (False, "browser fa parte del nucleo"), "f5": (False, "qualunque modello"), "f6": (False, "non hanno"),
    "f7": (False, "serve solo a mostrare"), "f8": (False, "cambiare la CPU"), "f9": (False, "Ogni programma già installato"),
    "f10": (False, "solo quando si apre"), "f11": (False, "direttamente con l'hardware"), "f12": (False, "gestione dei file decide"),
}


def level1(sample, prose, errs):
    m = re.fullmatch(r"Quale di queste attività (non )?è un compito del sistema operativo\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    want_os = m.group(1) is None

    def is_os(o):
        tid = o["values"][0]
        if tid not in TASKS:
            raise ValueError(f"unknown task {tid!r}")
        kind, words = TASKS[tid]
        if words.lower() not in option_text(o["latex"]).lower():
            raise ValueError(f"task {tid} does not say {words!r}")
        return kind

    check_choice(sample["answer"], lambda o: is_os(o) == want_os, errs)
    return "compito" if want_os else "non compito"


def level2(sample, prose, errs):
    m = re.fullmatch(r"(.+) Quale funzione del sistema operativo descrive la situazione\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    situation = m.group(1)
    if not any(n in situation for n in NAMES):
        errs.append("no known name in the situation")
    found = [fn for fn, words in RESOURCES if any(w in situation for w in words)]
    if len(found) != 1:
        errs.append(f"the situation names {len(found)} resources: {found}")
        return None

    def fn_of(o):
        fn = o["values"][0]
        if FUNCTIONS.get(fn) != option_text(o["latex"]):
            raise ValueError(f"option {o['latex']!r} is not the function {fn!r}")
        return fn

    check_choice(sample["answer"], lambda o: fn_of(o) == found[0], errs)
    return found[0]


def route_id(text):
    """'Applicazione, sistema operativo, hardware' -> 'a-s-h'; 'Applicazione e subito hardware' -> 'a-h'."""
    parts = re.split(r", | e subito ", text)
    initials = {"applicazione": "a", "sistema operativo": "s", "hardware": "h"}
    return "-".join(initials[p.lower()] for p in parts)


def layer_of(o):
    i = int(o["values"][0])
    if LAYERS[i] != option_text(o["latex"]):
        raise ValueError(f"option {o['latex']!r} is not layer {i}")
    return i


def lower_first(s):
    return s[0].lower() + s[1:]


def level3(sample, prose, errs):
    m = re.fullmatch(r"(\w+) usa (.+) per (.+)\. Nel modello a strati, per quali strati passa la richiesta, nell'ordine\?", prose)
    if m:
        if m.group(1) not in NAMES:
            errs.append(f"unknown name {m.group(1)!r}")

        def right(o):
            rid = route_id(option_text(o["latex"]))
            if rid != o["values"][0]:
                raise ValueError("route value does not match its text")
            return rid == "a-s-h"

        check_choice(sample["answer"], right, errs)
        return "percorso"
    m = re.fullmatch(r"Nel modello a strati, quale strato sta subito (sopra|sotto) (.+)\?", prose)
    if m:
        names = [lower_first(x) for x in LAYERS]
        if m.group(2) not in names:
            errs.append(f"unknown layer {m.group(2)!r}")
            return None
        want = names.index(m.group(2)) + (1 if m.group(1) == "sopra" else -1)
        if not 0 <= want <= 3:
            errs.append("no layer there")
            return None
        check_choice(sample["answer"], lambda o: layer_of(o) == want, errs)
        return "vicino"
    m = re.fullmatch(r"Nel modello a strati, quale strato (.+)\?", prose)
    if m:
        found = [i for i, words in enumerate(ROLES) if any(w in m.group(1) for w in words)]
        if len(found) != 1:
            errs.append(f"role {m.group(1)!r} fits {len(found)} layers")
            return None
        check_choice(sample["answer"], lambda o: layer_of(o) == found[0], errs)
        return "ruolo"
    errs.append(f"level 3 text not recognised: {prose!r}")
    return None


def check(sample):
    errs = []
    common(sample, errs)
    if sample.get("answer", {}).get("kind") != "choice":
        errs.append("answer is not a choice")
    if errs:
        return errs, None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected non-prose lines")
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        kind = level1(sample, prose, errs)
    elif lvl == 2:
        kind = level2(sample, prose, errs)
    elif lvl == 3:
        kind = level3(sample, prose, errs)
    elif lvl == 4:
        kind = check_statements(sample, prose, "sul sistema operativo", STATEMENTS, errs)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
