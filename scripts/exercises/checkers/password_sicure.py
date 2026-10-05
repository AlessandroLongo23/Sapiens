"""Checker for password-sicure (specs/exercises/password-sicure.md).

Written from the spec and the lesson, not from the generator. The answer is rebuilt from the pieces:
- level 1: the proof is sorted by the words it carries (a secret kept in mind, an object, the body, a name that is
  no secret);
- level 2: the characters to choose from are counted here from the sets the text names (26 small letters, 26
  capitals, 10 digits, the symbols it says), the length is read from the text, and the right option is k^n;
- level 3: m more characters multiply by k^m; in the comparison the four numbers k^n are computed exactly and the
  largest, or the smallest, is the answer;
- level 4: 10^n : 10^r = 10^(n-r); or the digits are the sum of the two exponents;
- level 5: the danger is sorted by its words; a pair of proofs is two factors when its kinds are two;
- level 6: the table of the situations.
"""
import re

from checkers._inf_sic import check_choice, check_situation, check_sorted, common

CASE_RANGES = {
    1: {k: (0.18, 0.32) for k in ["sai", "hai", "sei", "nessuno"]},
    2: {"password": (0.68, 0.82), "frase": (0.18, 0.32)},
    3: {"fattore": (0.42, 0.58), "più": (0.18, 0.32), "meno": (0.18, 0.32)},
    4: {"tempo": (0.47, 0.63), "cifre": (0.37, 0.53)},
    5: {"imprevedibile": (0.09, 0.19), "lunga": (0.09, 0.19), "diversa": (0.09, 0.19), "fattore": (0.09, 0.19), "due fattori": (0.37, 0.53)},
}

FACTORS = {
    "sai": "Qualcosa che sai",
    "hai": "Qualcosa che hai",
    "sei": "Qualcosa che sei",
    "nessuno": "Nessuno: serve a dire chi sei, non a dimostrarlo",
}
FACTOR_WORDS = {
    "sai": ["una password", "un PIN", "domanda segreta", "frase d'accesso"],
    "hai": ["codice generato", "chiavetta", "notifica", "codice arrivato"],
    "sei": ["impronta", "volto", "voce", "iride"],
    "nessuno": ["nome utente", "indirizzo di posta", "soprannome", "nome e il cognome"],
}

DEFENCES = {
    "imprevedibile": "Una password che non si può prevedere",
    "lunga": "Una password lunga",
    "diversa": "Una password diversa per ogni account",
    "fattore": "L'attenzione e un secondo fattore",
}
DANGER_WORDS = {
    "imprevedibile": ["più comuni", "indovinare", "più usate"],
    "lunga": ["tutte le combinazioni", "forza bruta", "ogni sequenza"],
    "diversa": ["furto di dati"],
    "fattore": ["pagina falsa", "malware", "ingannevole"],
}

# proof -> (kind, words of its text)
PROOFS = {
    "password": ("sai", "password"), "pin": ("sai", "PIN"), "domanda": ("sai", "domanda segreta"),
    "app": ("hai", "codice generato"), "chiavetta": ("hai", "chiavetta"), "notifica": ("hai", "notifica"),
    "impronta": ("sei", "impronta"), "volto": ("sei", "volto"), "utente": (None, "nome utente"),
}

HABITS = {
    "codice": ("codice di accesso", "Non comunicarlo"),
    "laboratorio": ("laboratorio della scuola", "Uscire dall'account"),
    "amico": ("Un amico chiede", "Non darla"),
    "furto": ("è stato rubato", "Quella della posta"),
    "recupero": ("domanda di recupero", "che non c'entra"),
    "scadenza": ("usata per un solo account", "quando c'è un motivo"),
    "tante": ("decine di account", "gestore di password"),
    "primo": ("cominciando da un solo account", "Dalla posta"),
    "scelta": ("scegliere la password", "parole comuni scelte a caso"),
    "blocco": ("senza nessun codice di sblocco", "Bloccare lo schermo"),
    "rispedita": ("gliela rispedisce", "in chiaro"),
}

SETS = {"minuscole": 26, "maiuscole": 26, "cifre": 10}


def count_characters(text):
    """k from the sets a text names: 'lettere minuscole, maiuscole, cifre e 18 simboli' -> 80."""
    k = sum(size for word, size in SETS.items() if re.search(rf"\b{word}\b", text))
    m = re.search(r"(\d+) simboli", text)
    return k + (int(m.group(1)) if m else 0)


def value_of(o):
    """An option as (kind, numbers), after checking that its text is what its value says."""
    kind, *nums = o["values"][0].split(":")
    nums = [int(x) for x in nums]
    text = o["latex"]
    shown = {
        "pow": lambda: f"${nums[0]}^{{{nums[1]}}}$",
        "mul": lambda: f"${nums[0]} \\cdot {nums[1]}$",
    }
    if kind in shown and text != shown[kind]():
        raise ValueError(f"option {text!r} is not {o['values'][0]}")
    if kind == "pow10" and not re.fullmatch(rf"\$10\^\{{{nums[0]}\}}\$ secondi", text):
        raise ValueError(f"option {text!r} is not {o['values'][0]}")
    if kind == "num" and not re.fullmatch(rf"\$?{nums[0]}\$? (secondi|cifre)", text):
        raise ValueError(f"option {text!r} is not {o['values'][0]}")
    if kind not in ("pow", "mul", "pow10", "num"):
        raise ValueError(f"unknown value {o['values'][0]!r}")
    return kind, nums


def level2(sample, errs):
    problem, params = sample["problem"], sample["params"]
    m = re.fullmatch(r"Una frase d'accesso è fatta di (\d+) parole scelte a caso da un elenco di (\d+) parole\. Quante sono le frasi possibili\?", problem)
    if m:
        n, k, kind = int(m.group(1)), int(m.group(2)), "frase"
    else:
        m = re.fullmatch(r"Un codice è fatto di (\d+) cifre scelte a caso\. Quanti sono i codici possibili\?", problem)
        if m:
            n, k = int(m.group(1)), 10
        else:
            m = re.fullmatch(r"Una password è fatta di (\d+) caratteri scelti a caso tra ([^.]+)\. Le lettere minuscole sono 26, come le maiuscole; le cifre sono 10\. Quante sono le password possibili\?", problem)
            if not m:
                errs.append(f"level 2 text not recognised: {problem!r}")
                return None
            n, k = int(m.group(1)), count_characters(m.group(2))
        kind = "password"
    if not (3 <= n <= 16 and k >= 10) or k == n:
        errs.append(f"k = {k}, n = {n}")
    if params.get("k") != k or params.get("n") != n:
        errs.append("params do not carry k and n of the text")
    check_choice(sample, lambda o: value_of(o) == ("pow", [k, n]), errs)
    return kind


def level3(sample, errs):
    problem, params = sample["problem"], sample["params"]
    m = re.fullmatch(r"(?:Un codice di (\d+) cifre scelte a caso viene allungato di (\d+) cifre|Una password di (\d+) caratteri scelti a caso tra ([^.]+?) viene allungata di (\d+) caratteri)\. Per quanto si moltiplica il numero delle combinazioni possibili\?", problem)
    if m:
        if m.group(1):
            n, more, k = int(m.group(1)), int(m.group(2)), 10
        else:
            n, more, k = int(m.group(3)), int(m.group(5)), count_characters(m.group(4))
        if not 2 <= more <= 4:
            errs.append(f"{more} more characters")
        if (params.get("k"), params.get("n"), params.get("m")) != (k, n, more):
            errs.append("params do not carry k, n and m of the text")
        check_choice(sample, lambda o: value_of(o) == ("pow", [k, more]), errs)
        return "fattore"
    m = re.fullmatch(r"Quale di queste password, scelte a caso, ha (più|meno) combinazioni possibili\?", problem)
    if not m:
        errs.append(f"level 3 text not recognised: {problem!r}")
        return None
    pick = max if m.group(1) == "più" else min

    def size(o):
        text = o["latex"]
        n = int(text.split()[0])
        k = 10 if re.fullmatch(r"\d+ cifre", text) else count_characters(text)
        if o["values"][0] != f"{k}:{n}":
            raise ValueError(f"option {text!r} is not {o['values'][0]}")
        return k**n

    try:
        sizes = [size(o) for o in sample["answer"]["options"]]
    except ValueError as e:
        errs.append(str(e))
        return m.group(1)
    best = pick(sizes)
    if sizes.count(best) != 1 or sizes.index(best) != sample["answer"]["correct"]:
        errs.append("the right option is not the password with the " + ("most" if pick is max else "fewest") + " combinations")
    # the answer must not need a calculator: the right one wins on the characters and on the length together
    ks = [int(o["values"][0].split(":")[0]) for o in sample["answer"]["options"]]
    ns = [int(o["values"][0].split(":")[1]) for o in sample["answer"]["options"]]
    c = sample["answer"]["correct"]
    if ks[c] != pick(ks) or ns[c] != pick(ns):
        errs.append("the right option does not win on both k and n")
    return m.group(1)


def level4(sample, errs):
    problem, params = sample["problem"], sample["params"]
    m = re.fullmatch(r".+ ha (\d+) cifre scelte a caso, quindi ci sono \$10\^\{(\d+)\}\$ combinazioni\. Un programma ne prova \$10\^\{(\d+)\}\$ al secondo\. Quanti secondi servono, al massimo, per provarle tutte\?", problem)
    if m:
        digits, n, r = (int(x) for x in m.groups())
        if digits != n or n - r < 2:
            errs.append(f"{digits} digits, 10^{n} combinations, 10^{r} a second")
        if (params.get("n"), params.get("r")) != (n, r):
            errs.append("params do not carry n and r of the text")
        check_choice(sample, lambda o: value_of(o) == ("pow10", [n - r]), errs)
        return "tempo"
    m = re.fullmatch(r"Un programma prova \$10\^\{(\d+)\}\$ combinazioni al secondo e, nel caso peggiore, impiega \$10\^\{(\d+)\}\$ secondi per provare tutti i codici numerici di una certa lunghezza\. Quante cifre ha il codice\?", problem)
    if not m:
        errs.append(f"level 4 text not recognised: {problem!r}")
        return None
    r, t = int(m.group(1)), int(m.group(2))
    if (params.get("r"), params.get("t")) != (r, t):
        errs.append("params do not carry r and t of the text")
    check_choice(sample, lambda o: value_of(o) == ("num", [r + t]), errs)
    return "cifre"


def level5(sample, errs):
    if sample["problem"] != "Quale di queste coppie di prove è una vera autenticazione a due fattori?":
        return check_sorted(sample, "Quale difesa è pensata proprio per questo pericolo?", DEFENCES, DANGER_WORDS, errs)

    def two_factors(o):
        ids = o["values"][0].split("+")
        parts = o["latex"].split(" e ")
        if len(ids) != 2 or len(parts) != 2 or any(i not in PROOFS for i in ids):
            raise ValueError(f"not a pair: {o['latex']!r}")
        for i, part in zip(ids, parts):
            if PROOFS[i][1].lower() not in part.lower():
                raise ValueError(f"proof {i} does not say {PROOFS[i][1]!r}")
        kinds = {PROOFS[i][0] for i in ids} - {None}
        return len(kinds) == 2

    check_choice(sample, two_factors, errs)
    return "due fattori"


def check(sample):
    errs = []
    if common(sample, errs) is None or errs:
        return errs, None
    lvl = sample["level"]
    kind = None
    if lvl == 1:
        kind = check_sorted(sample, "Che fattore di autenticazione è?", FACTORS, FACTOR_WORDS, errs)
    elif lvl == 2:
        kind = level2(sample, errs)
    elif lvl == 3:
        kind = level3(sample, errs)
    elif lvl == 4:
        kind = level4(sample, errs)
    elif lvl == 5:
        kind = level5(sample, errs)
    elif lvl == 6:
        kind = check_situation(sample, HABITS, errs)
    else:
        errs.append(f"unknown level {lvl}")
    if kind is not None and sample["params"].get("case") != kind:
        errs.append("wrong case in params")
    return errs, kind
