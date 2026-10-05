"""Checker for inf-ricerca-informazioni (specs/exercises/inf-ricerca-informazioni.md).

Written from the spec and the lesson, not from the generator. The right option is rebuilt from the pieces:
- level 1: the phase comes from the words of the work described; the table of true and false statements;
- level 2: the kind of each option is checked on how it is written (a question, a polite request, one word, the
  precise terms of the table below), and only the precise keywords are right;
- level 3: every option is read as a search by the parser below, and compared with the search the need in `params`
  asks for;
- level 4: the search and the four pages are read from the text, and the search is run on the pages here;
- level 5: the question comes from the words of the flaw; the table of good and bad reasons;
- level 6: the independent sources are counted from the numbers in the text; the citation is split into its
  elements and the missing one is found; the table of true and false statements.
"""
import re

from checkers._inf_web2 import check_choice, check_solution, check_statements, common

CASE_RANGES = {
    1: {"fase": (0.42, 0.58), "vera": (0.18, 0.32), "falsa": (0.18, 0.32)},
    3: {k: (0.14, 0.26) for k in ["frase", "meno", "sito", "formato", "oppure"]},
    4: {k: (0.11, 0.23) for k in ["meno", "frase", "sito", "formato", "due", "oppure"]},
    5: {"domanda": (0.52, 0.68), "motivo": (0.13, 0.27), "non motivo": (0.13, 0.27)},
    6: {"indipendenti": (0.28, 0.42), "citazione": (0.19, 0.31), "vera": (0.13, 0.27), "falsa": (0.13, 0.27)},
}

# ---------------------------------------------------------------------------
# level 1

PHASES = {
    "esplorazione": "Esplorazione",
    "indicizzazione": "Indicizzazione",
    "ordinamento": "Ordinamento",
    "tu": "Nessuna: è un lavoro che resta a te",
}
PHASE_WORDS = [
    ("esplorazione", ["segue i suoi link", "seguendo un link", "a quelle collegate"]),
    ("indicizzazione", ["registra in un elenco", "costruisce un elenco", "annota, accanto a una parola"]),
    ("ordinamento", ["quale mostrare per prima", "ti saranno più utili", "mette in fila i risultati"]),
    ("tu", ["Decidere se", "Scegliere le parole chiave", "Controllare chi ha scritto"]),
]
ENGINE = {
    "t1": (True, "consulta un indice preparato prima"), "t2": (True, "protetta da password non compare"),
    "t3": (True, "non ha mai raggiunto non compare"), "t4": (True, "contengono le parole che hai scritto"),
    "t5": (True, "possono essere annunci"), "t6": (True, "può stare sopra"), "t7": (True, "dalla lingua e dal luogo"),
    "t8": (True, "dice chi pubblica"),
    "f1": (False, "legge tutto il web in quel momento"), "f2": (False, "sempre il più affidabile"),
    "f3": (False, "compaiono anche le pagine protette"), "f4": (False, "è una classifica di verità"),
    "f5": (False, "qualunque parola usino"), "f6": (False, "perché è il più corretto"),
    "f7": (False, "Ogni pagina che esiste"), "f8": (False, "dice di sicuro la verità"),
}


def level1(sample, errs):
    text = sample["problem"]
    m = re.fullmatch(r"(.+) Di quale fase del lavoro di un motore di ricerca si tratta\?", text)
    if not m:
        return check_statements(sample, "sui motori di ricerca", ENGINE, errs)
    found = [p for p, words in PHASE_WORDS if any(w in m.group(1) for w in words)]
    if len(found) != 1:
        errs.append(f"the work fits {len(found)} phases")
        return None

    def phase(o):
        if PHASES.get(o["values"][0]) != o["latex"]:
            raise ValueError(f"{o['latex']!r} is not the phase {o['values'][0]!r}")
        return o["values"][0]

    check_choice(sample, lambda o: phase(o) == found[0], errs)
    return "fase"


# ---------------------------------------------------------------------------
# level 2: a word of the question, and a precise term its keywords must have

QUESTIONS = {
    "q1": ("si stanno riducendo", "ritiro"), "q2": ("superficie dei ghiacciai", "misure"), "q3": ("terremoto", "faglia"),
    "q4": ("api in inverno", "alimentazione"), "q5": ("pannello fotovoltaico", "funzionamento"),
    "q6": ("rivoluzione francese", "1789"), "q7": ("fotosintesi", "clorofilliana"), "q8": ("Luna cambia forma", "fasi lunari"),
    "q9": ("plastica", "tonnellate"), "q10": ("area di un trapezio", "formula"), "q11": ("vulcani eruttano", "magma"),
    "q12": ("vetro delle bottiglie", "riciclo"), "q13": ("maree", "attrazione"), "q14": ("doccia", "litri"),
    "q15": ("uccelli migratori", "orientamento"), "q16": ("Colosseo", "costruzione"),
}
FILLER = {"perché", "come", "che", "cosa", "quali", "quanta", "quanto", "quando", "vorrei", "sapere", "i", "le", "la", "il", "un", "una", "si", "per"}


def level2(sample, errs):
    m = re.fullmatch(r"Per una ricerca vuoi sapere (.+)\. Che cosa conviene scrivere nel motore\?", sample["problem"])
    topic = sample["params"].get("question")
    if not m or topic not in QUESTIONS:
        errs.append("level 2 text or question not recognised")
        return None
    want = m.group(1)
    in_question, term = QUESTIONS[topic]
    if in_question not in want:
        errs.append(f"the question is not {topic}")

    def precise(o):
        kind, text = o["values"][0], o["latex"]
        words = text.split()
        if kind == "precise":
            ok = "?" not in text and 3 <= len(words) <= 5 and not FILLER & {w.lower() for w in words} and term in text
        elif kind == "frase":
            ok = text == want + "?"
        elif kind == "cortese":
            ok = text == "vorrei sapere " + want
        elif kind == "generica":
            ok = len(words) == 1
        elif kind == "compito":
            ok = len(words) == 5 and text.endswith(" ricerca per la scuola")
        elif kind == "vaga":
            ok = "?" not in text and term not in text and len(words) >= 3
        else:
            ok = False
        if not ok:
            raise ValueError(f"{text!r} is not written as {kind!r}")
        return kind == "precise"

    check_choice(sample, precise, errs)
    return "parole"


# ---------------------------------------------------------------------------
# searches: the parser of levels 3 and 4

def parse(query):
    """A search as (words, phrases, excluded, site, filetype, either), or None when an operator is badly written."""
    words, phrases, excluded, either = [], [], [], []
    site = filetype = None
    tokens = re.findall(r'-?"[^"]*"|\S+', query)
    chain = False  # the token before was the last word of a group joined by OR
    i = 0
    while i < len(tokens):
        t = tokens[i]
        if t == "OR":
            nxt = tokens[i + 1] if i + 1 < len(tokens) else ""
            if not re.fullmatch(r"[\w']+", nxt) or nxt == "OR":
                return None
            if chain:
                either[-1].append(nxt)
            elif words:
                either.append([words.pop(), nxt])
            else:
                return None
            chain = True
            i += 2
            continue
        chain = False
        if t.startswith('-"'):
            excluded.append(t[2:-1])
        elif t.startswith('"'):
            phrases.append(t[1:-1])
        elif t == "-" or t in ("site:", "filetype:") or '"' in t:
            return None
        elif t.startswith("-"):
            excluded.append(t[1:])
        elif t.startswith("site:"):
            site = t[5:]
        elif t.startswith("filetype:"):
            filetype = t[9:]
        else:
            words.append(t)
        i += 1
    return (frozenset(words), frozenset(phrases), frozenset(excluded), site, filetype, frozenset(frozenset(g) for g in either))


def wanted(params):
    """The search a need of level 3 asks for, in the form `parse` gives."""
    case = params["case"]
    if case == "frase":
        return (frozenset(), frozenset([params["phrase"]]), frozenset(), None, None, frozenset())
    if case == "meno":
        return (frozenset(params["words"]), frozenset(), frozenset([params["exclude"]]), None, None, frozenset())
    if case == "sito":
        return (frozenset(params["words"]), frozenset(), frozenset(), params["site"], None, frozenset())
    if case == "formato":
        return (frozenset(params["words"]), frozenset(), frozenset(), None, params["filetype"], frozenset())
    if case == "oppure":
        return (frozenset(), frozenset(), frozenset(), None, None, frozenset([frozenset(params["either"])]))
    raise ValueError(f"unknown need {case!r}")


# what the question of level 3 must say for each need
NEED_TEXT = {
    "frase": lambda p: f"«{p['phrase']}»" in p["_text"] and "nello stesso ordine" in p["_text"],
    "meno": lambda p: f"togliere le pagine che contengono la parola «{p['exclude']}»" in p["_text"],
    "sito": lambda p: f"Cerchi le parole {' '.join(p['words'])}," in p["_text"] and f"il dominio {p['site']}:" in p["_text"],
    "formato": lambda p: f"Cerchi le parole {' '.join(p['words'])}," in p["_text"] and "formato PDF" in p["_text"] and p["filetype"] == "pdf",
    "oppure": lambda p: f"«{p['either'][0]}» oppure la parola «{p['either'][1]}»" in p["_text"],
}


def level3(sample, errs):
    params = dict(sample["params"], _text=sample["problem"])
    case = params["case"]
    if case not in NEED_TEXT or not NEED_TEXT[case](params):
        errs.append("the question does not say the need in params")
        return None
    want = wanted(params)
    check_choice(sample, lambda o: parse(o["latex"]) == want, errs)
    return case


def read_page(text):
    """A page of level 4: (is a PDF, site or None, the items it has, the words it is said not to have)."""
    m = re.fullmatch(r"(Una pagina|Un file PDF)(?: di (\S+))? con (.+?)( in punti diversi)?(?:, senza (.+))?", text)
    if not m:
        raise ValueError(f"{text!r} is not a page")
    has = re.findall(r"«([^»]+)»", m.group(3))
    lacks = re.findall(r"«([^»]+)»", m.group(5) or "")
    if not has or (m.group(4) and len(has) < 2):
        raise ValueError(f"{text!r} has no words")
    words = {w for item in has for w in item.split()}
    if words & set(lacks):
        raise ValueError(f"{text!r} has and lacks the same word")
    return m.group(1) == "Un file PDF", m.group(2), has, lacks


def found(search, page):
    """Whether the search finds the page: every condition must hold."""
    words, phrases, excluded, site, filetype, either = search
    pdf, where, has, _ = page
    there = {w for item in has for w in item.split()}
    if not words <= there or excluded & there:
        return False
    # a phrase must be there as it is, in one piece
    if any(not any(f" {p} " in f" {item} " for item in has) for p in phrases):
        return False
    if site is not None and site != where:
        return False
    if filetype is not None and (filetype == "pdf") != pdf:
        return False
    return all(group & there for group in either)


def level4(sample, errs):
    m = re.fullmatch(r"Quale di queste (non viene|viene) trovata dalla ricerca «(.+)»\?", sample["problem"])
    if not m or m.group(2) != sample["params"].get("query"):
        errs.append("level 4 text not recognised, or not the search in params")
        return None
    search = parse(m.group(2))
    if search is None:
        errs.append("the search is badly written")
        return None
    want_found = m.group(1) == "viene"
    check_choice(sample, lambda o: found(search, read_page(o["latex"])) == want_found, errs)
    words, phrases, excluded, site, filetype, either = search
    kind = "oppure" if either else "frase" if phrases else "due" if excluded and site else "meno" if excluded else "sito" if site else "formato" if filetype else None
    if (kind == "oppure") == want_found:
        errs.append("only a search with OR asks for the page not found")
    return kind


# ---------------------------------------------------------------------------
# level 5

ASKS = {"chi": "Chi scrive?", "quando": "Quando?", "prove": "Con quali prove?", "perche": "Perché?"}
FLAW_WORDS = [
    ("chi", ["nessun autore", "soprannome", "cantante famoso"]),
    ("quando", ["a quale anno", "nessuna data", "quindici anni fa"]),
    ("prove", ["senza citare nessuna fonte", "senza dire quali", "da dove vengono i dati"]),
    ("perche", ["invitando a comprare", "fatto per stupire", "per essere condivisa"]),
]
# True: a good reason to trust a page
REASONS = {
    "g1": (True, "competente"), "g2": (True, "ultimo aggiornamento"), "g3": (True, "con la loro origine"),
    "g4": (True, "non vende niente"), "g5": (True, "indipendente"), "g6": (True, "fonte primaria"),
    "b1": (False, "grafica"), "b2": (False, "lucchetto"), "b3": (False, "primo risultato"), "b4": (False, "condivisioni"),
    "b5": (False, "suona ufficiale"), "b6": (False, "la stessa frase con le stesse parole"), "b7": (False, "tono molto sicuro"),
}


def level5(sample, errs):
    text = sample["problem"]
    m = re.fullmatch(r"Una pagina (.+)\. Quale delle quattro domande sulla fonte fa scoprire il problema\?", text)
    if m:
        got = [a for a, words in FLAW_WORDS if any(w in m.group(1) for w in words)]
        if len(got) != 1:
            errs.append(f"the flaw fits {len(got)} questions")
            return None

        def ask(o):
            if ASKS.get(o["values"][0]) != o["latex"]:
                raise ValueError(f"{o['latex']!r} is not the question {o['values'][0]!r}")
            return o["values"][0]

        check_choice(sample, lambda o: ask(o) == got[0], errs)
        return "domanda"
    m = re.fullmatch(r"Quale di questi (non )?è un buon motivo per fidarti di una pagina\?", text)
    if m:
        want = m.group(1) is None

        def good(o):
            value, words = REASONS[o["values"][0]]
            if words not in o["latex"]:
                raise ValueError(f"{o['values'][0]} does not say {words!r}")
            return value

        check_choice(sample, lambda o: good(o) == want, errs)
        return "motivo" if want else "non motivo"
    errs.append(f"level 5 text not recognised: {text!r}")
    return None


# ---------------------------------------------------------------------------
# level 6

PARTS = {
    "autore": "L'autore",
    "titolo": "Il titolo della pagina",
    "sito": "Il nome del sito",
    "indirizzo": "L'indirizzo della pagina",
    "data": "La data di consultazione",
}
SOURCES = {
    "t1": (True, "valgono come una fonte sola"), "t2": (True, "ognuna per conto suo"), "t3": (True, "chi ha fatto la misura"),
    "t4": (True, "in un'altra scheda"), "t5": (True, "aprire le note"), "t6": (True, "può scrivere un dato inventato"),
    "t7": (True, "anche la data in cui"), "t8": (True, "è plagio"), "t9": (True, "ciascuno per il suo anno"),
    "f1": (False, "confermata dieci volte"), "f2": (False, "basta leggere la sua pagina Chi siamo"),
    "f3": (False, "il dato è di sicuro corretto"), "f4": (False, "senza citarla"), "f5": (False, "non serve, perché le pagine non cambiano"),
    "f6": (False, "non serve guardare le note"), "f7": (False, "basta una sola fonte"), "f8": (False, "due sono per forza sbagliati"),
    "f9": (False, "sono due fonti indipendenti"),
}


def element(piece):
    """Which of the five elements of a citation a piece is."""
    if re.fullmatch(r'"[^"]+"', piece):
        return "titolo"
    if re.fullmatch(r"https://\S+", piece):
        return "indirizzo"
    if re.fullmatch(r"consultato il \d{1,2} \w+ \d{4}", piece):
        return "data"
    if re.fullmatch(r"[A-Z]\. [A-Z]\w+", piece):
        return "autore"
    return "sito"


def level6(sample, errs):
    text = sample["problem"]
    m = re.fullmatch(r"Cerchi .+\. Trovi il dato su (\d+) siti che riportano la stessa frase con le stesse parole, copiata da .+, e su (un altro sito, che ha|altri (\d+) siti, ognuno dei quali ha) raccolto il dato per conto suo\. Quante fonti indipendenti hai\?", text)
    if m:
        copies, others = int(m.group(1)), int(m.group(3) or 1)
        if not (3 <= copies <= 9 and 1 <= others <= 3):
            errs.append("numbers out of the spec")
        # the copies are one source, each of the others is one more
        want = 1 + others

        def number(o):
            mm = re.fullmatch(r"(\d+) (fonte|fonti)", o["latex"])
            if not mm or (mm.group(1) == "1") != (mm.group(2) == "fonte") or o["values"][0] != mm.group(1):
                raise ValueError(f"{o['latex']!r} is not a number of sources")
            return int(mm.group(1))

        check_choice(sample, lambda o: number(o) == want, errs)
        return "indipendenti"
    m = re.fullmatch(r"Questa è la citazione di una pagina web: «(.+)\.» Quale elemento manca\?", text)
    if m:
        there = [element(p) for p in m.group(1).split(", ")]
        missing = [p for p in PARTS if p not in there]
        if len(there) != 4 or len(set(there)) != 4 or len(missing) != 1:
            errs.append(f"the citation has the elements {there}")
            return None

        def part(o):
            if PARTS.get(o["values"][0]) != o["latex"]:
                raise ValueError(f"{o['latex']!r} is not the element {o['values'][0]!r}")
            return o["values"][0]

        check_choice(sample, lambda o: part(o) == missing[0], errs)
        return "citazione"
    return check_statements(sample, "sulle fonti", SOURCES, errs)


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = common(sample)
    if errs:
        return errs, None
    level = sample["level"]
    if level not in LEVELS:
        return [f"unknown level {level}"], None
    kind = LEVELS[level](sample, errs)
    check_solution(sample, errs)
    if kind is not None and sample["params"]["case"] != kind:
        errs.append(f"params say case {sample['params']['case']!r}, the question is {kind!r}")
    return errs, kind
