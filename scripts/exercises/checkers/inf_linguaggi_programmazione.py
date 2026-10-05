"""Checker for inf-linguaggi-programmazione (specs/exercises/inf-linguaggi-programmazione.md).

Written from the spec and the lesson, not from the generator. Every level is a choice of text options, and the right
one is rebuilt from tables written here:
- level 1: which sentences are about machine language and which about a high-level language;
- level 2: the situation is classified by the words it uses, and exactly one term must fit;
- level 3: the fact about the translator is classified by its words (compiler, interpreter, both);
- level 4: the numbers are read from the text: k - 1 lines with an interpreter, none with a compiler;
- level 5: the table of true and false statements.
"""
import re

from checkers._inf_primi import NAMES, check_choice, check_statements, labelled, text_only
from checkers._inf_programmi import common

CASE_RANGES = {
    1: {"macchina": (0.40, 0.60), "alto livello": (0.40, 0.60)},
    3: {"compilatore": (0.32, 0.48), "interprete": (0.32, 0.48), "entrambi": (0.13, 0.27)},
    4: {"interprete": (0.40, 0.60), "compilatore": (0.40, 0.60)},
    5: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

# True: a sentence about machine language. False: about a high-level language.
SENTENCES = {
    "m1": (True, "sequenza di bit"), "m2": (True, "famiglia di CPU"), "m3": (True, "senza traduzione"),
    "m4": (True, "tre o quattro istruzioni"), "m5": (True, "cella di memoria"), "m6": (True, "riscritto da capo"),
    "m7": (True, "istruzioni elementari"), "m8": (True, "bit sbagliato"),
    "h1": (False, "print e while"), "h2": (False, "segni della matematica"), "h3": (False, "com'è fatta la CPU"),
    "h4": (False, "bisogno di un traduttore"), "h5": (False, "codice sorgente"), "h6": (False, "per chi scrive"),
    "h7": (False, "nomi scelti"), "h8": (False, "come una frase"),
}

TERMS = {
    "sorgente": ("Il codice sorgente",),
    "compilatore": ("Il compilatore",),
    "interprete": ("L'interprete",),
    "eseguibile": ("Il programma eseguibile",),
    "macchina": ("Il linguaggio macchina",),
    "sintassi": ("La sintassi",),
}
# The question a situation ends with, and the words in it, decide the term.
TERM_MARKS = [
    ("sorgente", r"Come si chiama (quello che ha scritto|quel testo)\?$", None),
    ("compilatore", r"Che programma è\?$", ["tutto"]),
    ("interprete", r"Che programma è\?$", ["alla volta", "rifà la traduzione", "prime righe"]),
    ("eseguibile", r"(Che cos'è quel file|Che cosa ha ricevuto)\?$", None),
    ("macchina", r"Come si chiama l'insieme (delle|di quelle) istruzioni( che una CPU sa eseguire)?\?$", None),
    ("sintassi", r"Come si chiama(no quelle regole| l'insieme di queste regole)\?$", None),
]

TRANSLATORS = {
    "compilatore": ("Un compilatore",),
    "interprete": ("Un interprete",),
    "entrambi": ("tutti e due",),
    "nessuno": ("Nessun traduttore",),
}
# The words of a fact decide the translator it tells of.
FACT_MARKS = {
    "compilatore": ["tutto il sorgente prima", "file eseguibile", "impedisce al programma di partire", "senza avere il sorgente", "una volta sola", "nemmeno la prima istruzione"],
    "interprete": ["passa alla successiva", "nessun file tradotto", "solo quando l'esecuzione arriva", "si rifà a ogni esecuzione", "servono il sorgente e il traduttore", "vengono eseguite anche se"],
    "entrambi": ["a sua volta un programma", "Alla fine la CPU", "che la CPU non capisce", "si può aprire e correggere", "lo segnala con un messaggio"],
}

LANGUAGES = {"in Python": "interprete", "in un linguaggio interpretato": "interprete", "in C++": "compilatore", "in un linguaggio compilato": "compilatore"}

STATEMENTS = {
    "t1": (True, "a sua volta un programma"), "t2": (True, "bisogna compilare di nuovo"), "t3": (True, "resta un file di testo"),
    "t4": (True, "non parte su un computer di un altro tipo"), "t5": (True, "si prova in fretta"),
    "t6": (True, "compilato è di solito più veloce"), "t7": (True, "senza avere il sorgente"), "t8": (True, "ha il suo linguaggio macchina"),
    "t9": (True, "regole di scrittura rigide"), "t10": (True, "forma intermedia"), "t11": (True, "si ritrovano in linguaggi diversi"),
    "t12": (True, "si rifà a ogni esecuzione"),
    "f1": (False, "capisce direttamente"), "f2": (False, "si aggiorna da solo"), "f3": (False, "interprete produce un file eseguibile"),
    "f4": (False, "compilatore traduce il sorgente una riga alla volta"), "f5": (False, "qualunque tipo di computer"),
    "f6": (False, "serve sempre anche il suo sorgente"), "f7": (False, "lo stesso per tutte le CPU"),
    "f8": (False, "pensato per la macchina"), "f9": (False, "interpretato è di solito più veloce"),
    "f10": (False, "Con un compilatore"), "f11": (False, "anche su un computer senza interprete"), "f12": (False, "componenti dell'hardware"),
}


def level1(sample, errs):
    m = re.fullmatch(r"Quale di queste frasi descrive (il linguaggio macchina|un linguaggio ad alto livello)\?", sample["problem"])
    if not m:
        errs.append("level 1 text not recognised")
        return None
    machine = m.group(1) == "il linguaggio macchina"
    check_choice(sample["answer"], lambda o: labelled(o, SENTENCES)[0] == machine, errs)
    return "macchina" if machine else "alto livello"


def level2(sample, errs):
    text = sample["problem"]
    if not any(n in text for n in NAMES):
        errs.append("no known name in the situation")
    found = [term for term, question, words in TERM_MARKS if re.search(question, text) and (words is None or any(w in text for w in words))]
    if len(found) != 1:
        errs.append(f"the situation fits {len(found)} terms: {found}")
        return None

    def term_of(o):
        labelled(o, TERMS)
        return o["values"][0]

    check_choice(sample["answer"], lambda o: term_of(o) == found[0], errs)
    return found[0]


def level3(sample, errs):
    m = re.fullmatch(r"(\w+) lavora al testo (del suo|della sua) [^.]+\. (.+) Quale traduttore sta usando\?", sample["problem"])
    if not m or m.group(1) not in NAMES:
        errs.append("level 3 text not recognised")
        return None
    fact = m.group(3)
    found = [kind for kind, marks in FACT_MARKS.items() if any(w in fact for w in marks)]
    if len(found) != 1:
        errs.append(f"the fact fits {len(found)} translators: {found}")
        return None

    def kind_of(o):
        labelled(o, TRANSLATORS)
        return o["values"][0]

    check_choice(sample["answer"], lambda o: kind_of(o) == found[0], errs)
    if {o["values"][0] for o in sample["answer"]["options"]} != set(TRANSLATORS):
        errs.append("level 3 offers the four translators")
    return found[0]


def rows(k):
    return "Nessuna riga" if k == 0 else "1 riga" if k == 1 else f"{k} righe"


def level4(sample, errs):
    m = re.fullmatch(
        r"(\w+) scrive (in .+?) un programma di (\d+) istruzioni, ognuna delle quali stampa una riga\. Nell'istruzione numero (\d+) "
        r"il nome del comando che stampa è scritto male\. Quante righe vengono stampate prima del messaggio di errore\?",
        sample["problem"],
    )
    if not m or m.group(1) not in NAMES or m.group(2) not in LANGUAGES:
        errs.append("level 4 text not recognised")
        return None
    kind = LANGUAGES[m.group(2)]
    n, k = int(m.group(3)), int(m.group(4))
    if not (4 <= n <= 9 and 2 <= k <= n):
        errs.append(f"level 4: {n} instructions, mistake at {k}")
    want = k - 1 if kind == "interprete" else 0

    def value(o):
        v = int(o["values"][0])
        if o["latex"] != rows(v):
            raise ValueError(f"option {o['latex']!r} is not {v} lines")
        if not 0 <= v <= n:
            raise ValueError(f"an option of {v} lines for a program of {n}")
        return v

    check_choice(sample["answer"], lambda o: value(o) == want, errs)
    return kind


def check(sample):
    errs = common(sample)
    if not text_only(sample, errs):
        return errs, None
    level = sample["level"]
    kind = None
    if level == 1:
        kind = level1(sample, errs)
    elif level == 2:
        kind = level2(sample, errs)
    elif level == 3:
        kind = level3(sample, errs)
    elif level == 4:
        kind = level4(sample, errs)
    elif level == 5:
        kind = check_statements(sample, "su linguaggi e traduttori", STATEMENTS, errs)
    else:
        errs.append(f"unknown level {level}")
    if kind is not None and sample["params"].get("case") != kind:
        errs.append(f"params.case is {sample['params'].get('case')!r}, the text says {kind!r}")
    return errs, kind
