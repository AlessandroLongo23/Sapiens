"""Checker for http-html (specs/exercises/http-html.md).

Written from the spec and the lesson. The answer is rebuilt from the text of the question:
- level 1: the description is classified by the words it uses, and exactly one of the ten terms must fit;
- level 2: the URL is split here into protocol, server name and path;
- level 3: two links are of the same site when their server name is the same;
- level 4: a situation is classified by its words and gives its status code; the first digit of a code gives its
  kind; the request for a URL is GET and its path;
- level 5: one request for the page and one for each separate file, none for the links;
- level 6: the table of true and false statements.
"""
import re

from checkers._inf_web1 import unbroken, plain, check_statements, name_in, one_right, same_case, start

CASE_RANGES = {
    1: {k: (0.05, 0.16) for k in ["ipertesto", "link", "pagina", "sito", "browser", "server", "motore", "html", "url", "home"]},
    2: {"protocollo": (0.08, 0.21), "server": (0.21, 0.36), "percorso": (0.21, 0.36), "risorsa": (0.08, 0.21), "cartella": (0.08, 0.21)},
    3: {"altro": (0.40, 0.60), "stesso": (0.40, 0.60)},
    4: {"situazione": (0.42, 0.58), "cifra": (0.13, 0.27), "richiesta": (0.22, 0.38)},
    5: {"con video": (0.57, 0.76), "senza video": (0.24, 0.43)},
    6: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

TERMS = {
    "ipertesto": "Un ipertesto",
    "link": "Un link",
    "pagina": "Una pagina web",
    "sito": "Un sito web",
    "browser": "Il browser",
    "server": "Il server web",
    "motore": "Un motore di ricerca",
    "html": "HTML",
    "url": "Un URL",
    "home": "La home page",
}
WORDS = [
    ("ipertesto", ["collegamenti ad altri testi", "senza un ordine fissato"]),
    ("link", ["su cui fai clic", "da un punto di una pagina"]),
    ("pagina", ["uno dei documenti del web", "un solo documento del web"]),
    ("sito", ["insieme di pagine", "una scuola pubblica"]),
    ("browser", ["installato sul tuo dispositivo", "client del web"]),
    ("server", ["conserva le pagine", "Resta in attesa"]),
    ("motore", ["trovare le altre pagine", "farti indicare altre pagine"]),
    ("html", ["linguaggio"]),
    ("url", ["indirizzo di una risorsa", "una sola risorsa"]),
    ("home", ["da cui si parte", "manca il percorso"]),
]

# The words of a situation decide the status code.
CODE_WORDS = [
    (200, ["senza problemi", "arriva completa", "gliela manda"]),
    (301, ["spostata", "un altro URL", "nuovo URL"]),
    (403, ["permesso", "autorizzato"]),
    (404, ["sbaglia il nome", "cancellata", "non ha niente"]),
    (500, ["si blocca", "un guasto", "va storto"]),
]
FIRST_DIGIT = {
    "2": "È un successo: la richiesta è andata bene",
    "3": "Il server rimanda il browser altrove",
    "4": "È sbagliata la richiesta",
    "5": "Il guasto è del server",
}

STATEMENTS = {
    "t1": (True, "viaggiano cifrati tra il browser e il server"), "t2": (True, "può avere il lucchetto"), "t3": (True, "comincia con https"),
    "t4": (True, "file separati"), "t5": (True, "uno dei servizi"), "t6": (True, "è un sito, non un programma"),
    "t7": (True, "le maiuscole possono contare"), "t8": (True, "manda la home page"), "t9": (True, "può leggere i dati"),
    "t10": (True, "certificato"), "t11": (True, "solo quando fai clic"), "t12": (True, "client del web"),
    "f1": (False, "garantisce che il sito è onesto"), "f2": (False, "sono la stessa cosa"), "f3": (False, "Il web e Internet"),
    "f4": (False, "Con HTTP i dati viaggiano cifrati"), "f5": (False, "dentro il file HTML"), "f6": (False, "non può essere una truffa"),
    "f7": (False, "apre lo stesso"), "f8": (False, "chiede subito anche"), "f9": (False, "404 vuol dire che il server è guasto"),
    "f10": (False, "dice chi ha registrato"), "f11": (False, "con cui guardi le pagine"), "f12": (False, "viaggia protetta"),
}


def split_url(text):
    """(protocol, server name, path) of a URL of the lessons; raises ValueError on anything else."""
    m = re.fullmatch(r"(https?)://([a-z0-9.-]+)(/[A-Za-z0-9./_-]*)?", text)
    if not m:
        raise ValueError(f"{text!r} is not a URL")
    host = m.group(2).split(".")
    if host[-1] != "example" and host[-2:] != ["esempio", "it"]:
        raise ValueError(f"{text!r} is not on a name for examples")
    return m.group(1), m.group(2), m.group(3) or ""


def classify(text, table, errors):
    found = [key for key, words in table if any(w in text for w in words)]
    if len(found) != 1:
        errors.append(f"the text fits {len(found)} answers: {found}")
        return None
    return found[0]


def level1(sample, errors):
    m = re.fullmatch(r"(.+) Di che cosa si parla\?", sample["problem"])
    if not m:
        errors.append(f"level 1 text not recognised: {sample['problem']!r}")
        return None
    term = classify(m.group(1), WORDS, errors)
    if not term:
        return None

    def term_of(o):
        if TERMS.get(o["values"][0]) != o["latex"]:
            raise ValueError(f"option {o['latex']!r} is not the term {o['values'][0]!r}")
        return o["values"][0]

    one_right(sample, lambda o: term_of(o) == term, errors)
    return same_case(sample, term, errors)


def level2(sample, errors):
    m = re.fullmatch(r"Nell'URL (\S+), (.+\?)", sample["problem"])
    if not m:
        errors.append(f"level 2 text not recognised: {sample['problem']!r}")
        return None
    protocol, host, path = split_url(m.group(1))
    if sample["params"].get("url") != m.group(1):
        errors.append("params.url is not the URL of the question")
    pieces = path.split("/")[1:]
    if len(pieces) != 3 or len(set(pieces)) != 3:
        errors.append("the path is not two folders and a resource")
        return None
    wanted = {
        "qual è il protocollo?": ("protocollo", protocol),
        "qual è il nome del server?": ("server", host),
        "qual è il percorso della risorsa?": ("percorso", path),
        "come si chiama la risorsa?": ("risorsa", pieces[2]),
        "qual è la cartella che contiene direttamente la risorsa?": ("cartella", pieces[1]),
    }.get(m.group(2))
    if not wanted:
        errors.append(f"unknown question {m.group(2)!r}")
        return None
    one_right(sample, lambda o: plain(o) == wanted[1], errors)
    return same_case(sample, wanted[0], errors)


def level3(sample, errors):
    m = re.fullmatch(r"Sei sulla pagina (\S+)\. Quale di questi link porta (su un altro sito|a un'altra pagina dello stesso sito)\?", sample["problem"])
    if not m:
        errors.append(f"level 3 text not recognised: {sample['problem']!r}")
        return None
    here = m.group(1)
    host = split_url(here)[1]
    other = m.group(2) == "su un altro sito"

    def same_site(o):
        link = plain(o)
        if link == here:
            raise ValueError("a link is the page itself")
        return split_url(link)[1] == host

    one_right(sample, lambda o: same_site(o) != other, errors)
    return same_case(sample, "altro" if other else "stesso", errors)


def level4(sample, errors):
    text = sample["problem"]
    m = re.fullmatch(r"(.+) Con quale codice di stato risponde il server\?", text)
    if m:
        name_in(m.group(1), errors)
        code = classify(m.group(1), CODE_WORDS, errors)
        if not code:
            return None

        def shown_code(o):
            if plain(o) not in ("200", "301", "403", "404", "500"):
                raise ValueError(f"option {o['latex']!r} is not a code of the lesson")
            return int(o["latex"])

        one_right(sample, lambda o: shown_code(o) == code, errors)
        return same_case(sample, "situazione", errors)
    m = re.fullmatch(r"Una risposta HTTP ha codice (\d{3}), che non hai mai incontrato\. Che cosa ti dice la sua prima cifra\?", text)
    if m:
        code = m.group(1)
        if code in ("200", "301", "403", "404", "500") or code[0] not in FIRST_DIGIT:
            errors.append(f"code {code} is one of the lesson, or of no kind")

        def kind(o):
            if FIRST_DIGIT.get(o["values"][0]) != o["latex"]:
                raise ValueError(f"option {o['latex']!r} is not the kind {o['values'][0]!r}")
            return o["values"][0]

        one_right(sample, lambda o: kind(o) == code[0], errors)
        return same_case(sample, "cifra", errors)
    m = re.fullmatch(r"Fai clic su un link che porta a (\S+)\. Quale richiesta manda il browser al server (\S+)\?", text)
    if m:
        _, host, path = split_url(m.group(1))
        if sample["params"].get("url") != m.group(1):
            errors.append("params.url is not the URL of the question")
        if host != m.group(2) or not path:
            errors.append("the server named is not the one of the URL")
        # a link is followed with GET and the path
        one_right(sample, lambda o: plain(o) == f"GET {path}", errors)
        return same_case(sample, "richiesta", errors)
    errors.append(f"level 4 text not recognised: {text!r}")
    return None


def level5(sample, errors):
    m = re.fullmatch(r"Una pagina contiene del testo, (\d+) fotografie(?:, (un|\d+) video)? e (\d+) link ad altre pagine\. Quante richieste HTTP manda il browser per mostrarla\?", sample["problem"])
    if not m:
        errors.append(f"level 5 text not recognised: {sample['problem']!r}")
        return None
    images = int(m.group(1))
    videos = 0 if m.group(2) is None else 1 if m.group(2) == "un" else int(m.group(2))
    links = int(m.group(3))
    if m.group(2) in ("0", "1") or not 2 <= images <= 9 or not 3 <= links <= 30 or videos > 2:
        errors.append("numbers out of the spec")
    requests = 1 + images + videos  # the page, then each separate file; a link asks for nothing

    def count(o):
        n = int(o["values"][0])
        if o["latex"] != ("1 richiesta" if n == 1 else f"{n} richieste"):
            raise ValueError(f"option {o['latex']!r} does not say {n}")
        return n

    one_right(sample, lambda o: count(o) == requests, errors)
    return same_case(sample, "con video" if videos else "senza video", errors)


def check(sample):
    errors = start(sample)
    sample = unbroken(sample)
    if errors:
        return errors, None
    level = sample["level"]
    if level == 6:
        return errors, check_statements(sample, "sul web", STATEMENTS, errors)
    levels = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}
    if level not in levels:
        return errors + [f"unknown level {level}"], None
    try:
        case = levels[level](sample, errors)
    except ValueError as e:
        errors.append(str(e))
        case = None
    return errors, case
