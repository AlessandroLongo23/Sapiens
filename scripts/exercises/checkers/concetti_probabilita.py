"""concetti-probabilita (Eventi e probabilità), from specs/exercises/concetti-probabilita.md.

Written from the spec, not from the generator. The experiment and the event are read back from the
prose of the problem (the sentence that sets the experiment, `Evento: "..."`, or the two events A and
B); the sample space is enumerated with itertools (a die, an urn of numbered balls, two or three
coins, a die with a coin, two dice, the 40 cards as value-suit pairs, the balls of an urn one by
one) and the probability is the exact Fraction favourable / possible. The event phrases are parsed
here with their own regular expressions and predicates. The multiple-choice options are parsed from
their LaTeX and must say the value they claim, reduced; they must be distinct as numbers (or as sets
with a verdict at level 2), exactly one must be the truth and `correct` must point to it.
"""
import itertools
import re
from fractions import Fraction as F

from sympy import isprime

CASE_RANGES = {
    1: {"dado": (0.40, 0.60), "urna": (0.40, 0.60)},
    2: {"tipo": (0.32, 0.48), "compatibili": (0.23, 0.37), "incompatibili": (0.23, 0.37)},
    3: {"due-monete": (0.23, 0.37), "tre-monete": (0.37, 0.53), "dado-moneta": (0.18, 0.32)},
    4: {"colore": (0.42, 0.58), "non-colore": (0.18, 0.32), "due-colori": (0.18, 0.32)},
    6: {"somma": (0.33, 0.47), "disuguaglianza": (0.14, 0.26), "doppio": (0.05, 0.15), "almeno": (0.10, 0.20), "altro": (0.10, 0.20)},
    7: {"frequenza": (0.52, 0.68), "stima": (0.32, 0.48)},
}

NUMWORD = {"una": 1, "un": 1, "due": 2, "tre": 3}
SUITS = ["coppe", "denari", "bastoni", "spade"]
RANKS = {"asso": 1, "fante": 8, "cavallo": 9, "re": 10}


# ---------------------------------------------------------------------------
# Reading the problem

def lines_of(problem):
    body = problem.strip()
    m = re.fullmatch(r"\\begin\{array\}\{l\}(.*)\\end\{array\}", body, re.S)
    if not m:
        return [body]
    return [x.strip() for x in m.group(1).split("\\\\") if x.strip()]


def prose_of(problem):
    parts = []
    for line in lines_of(problem):
        m = re.fullmatch(r"\\text\{(.*)\}", line)
        if not m:
            raise ValueError(f"riga non di testo: {line!r}")
        parts.append(m.group(1))
    text = " ".join(parts)
    # inline numbers written $10\,000$ and names $A$
    text = re.sub(r"\$(\d+(?:\\,\d{3})*)\$", lambda m: m.group(1).replace("\\,", ""), text)
    return text


def event_of(prose):
    m = re.search(r'Evento: "([^"]+)"\.$', prose)
    return m.group(1) if m else None


# ---------------------------------------------------------------------------
# Events on one number

def number_pred(noun):
    """The predicate of 'esce <noun>' on an integer."""
    if noun == "un numero pari":
        return lambda x: x % 2 == 0
    if noun == "un numero dispari":
        return lambda x: x % 2 == 1
    if noun == "un numero primo":
        return lambda x: isprime(x)
    if noun == "un quadrato perfetto":
        return lambda x: int(x**0.5 + 0.5) ** 2 == x
    m = re.fullmatch(r"un multiplo di (\d+)", noun)
    if m:
        k = int(m.group(1))
        return lambda x: x % k == 0
    m = re.fullmatch(r"un divisore di (\d+)", noun)
    if m:
        k = int(m.group(1))
        return lambda x: k % x == 0
    m = re.fullmatch(r"un numero (maggiore|minore) di (\d+)", noun)
    if m:
        k = int(m.group(2))
        return (lambda x: x > k) if m.group(1) == "maggiore" else (lambda x: x < k)
    m = re.fullmatch(r"un numero diverso da (\d+)", noun)
    if m:
        k = int(m.group(1))
        return lambda x: x != k
    m = re.fullmatch(r"(?:il numero )?(\d+)", noun)
    if m:
        k = int(m.group(1))
        return lambda x: x == k
    raise ValueError(f"evento sconosciuto: {noun!r}")


# ---------------------------------------------------------------------------
# Coins

def coin_pred(phrase, ncoins):
    """Predicate on a word of T and C."""
    def count(w, face):
        return w.count(face)

    if phrase == "escono una testa e una croce":
        return lambda w: count(w, "T") == 1 and count(w, "C") == 1
    m = re.fullmatch(r"escono (due|tre) facce uguali", phrase)
    if m and NUMWORD[m.group(1)] == ncoins:
        return lambda w: len(set(w)) == 1
    if phrase == "escono due facce diverse" and ncoins == 2:
        return lambda w: len(set(w)) == 2
    m = re.fullmatch(r"la (prima|seconda) moneta dà (testa|croce)", phrase)
    if m:
        i = 0 if m.group(1) == "prima" else 1
        f = "T" if m.group(2) == "testa" else "C"
        return lambda w: w[i] == f
    m = re.fullmatch(r"non esce nessuna (testa|croce)", phrase)
    if m:
        f = m.group(1)[0].upper()
        return lambda w: count(w, f) == 0
    m = re.fullmatch(r"(?:esce|escono) (esattamente |almeno |al massimo )?(una|due|tre) (testa|teste|croce|croci)", phrase)
    if m:
        k = NUMWORD[m.group(2)]
        if (k == 1) != (m.group(3) in ("testa", "croce")):
            raise ValueError(f"accordo sbagliato: {phrase!r}")
        if (k == 1) != phrase.startswith("esce "):
            raise ValueError(f"verbo sbagliato: {phrase!r}")
        f = m.group(3)[0].upper()
        q = (m.group(1) or "").strip()
        if q == "almeno":
            return lambda w: count(w, f) >= k
        if q == "al massimo":
            return lambda w: count(w, f) <= k
        return lambda w: count(w, f) == k
    raise ValueError(f"evento sconosciuto: {phrase!r}")


def coin_space(n):
    return ["".join(p) for p in itertools.product("TC", repeat=n)]


# ---------------------------------------------------------------------------
# Cards

def deck_pred(phrase):
    fig = lambda c: c[0] >= 8
    rank_noun = r"un (asso|fante|cavallo|re|\d)"

    def rank_of(w):
        return RANKS[w] if w in RANKS else int(w)

    m = re.fullmatch(r"esce " + rank_noun, phrase)
    if m:
        r = rank_of(m.group(1))
        return lambda c: c[0] == r, True
    m = re.fullmatch(r"esce " + rank_noun + " o " + rank_noun, phrase)
    if m:
        a, b = rank_of(m.group(1)), rank_of(m.group(2))
        return lambda c: c[0] in (a, b), True
    if phrase == "esce una figura":
        return fig, True
    if phrase == "esce una carta che non è una figura":
        return lambda c: not fig(c), True
    S = "(" + "|".join(SUITS) + ")"
    m = re.fullmatch(r"esce una carta di " + S, phrase)
    if m:
        s = m.group(1)
        return lambda c: c[1] == s, False
    m = re.fullmatch(r"esce (?:l'|il )(asso|fante|cavallo|re) di " + S, phrase)
    if m:
        r, s = RANKS[m.group(1)], m.group(2)
        return lambda c: c == (r, s), False
    m = re.fullmatch(r"esce una figura di " + S, phrase)
    if m:
        s = m.group(1)
        return lambda c: fig(c) and c[1] == s, False
    m = re.fullmatch(r"esce una carta di " + S + " o di " + S, phrase)
    if m:
        a, b = m.group(1), m.group(2)
        return lambda c: c[1] in (a, b), False
    m = re.fullmatch(r"esce una carta di " + S + " che non è una figura", phrase)
    if m:
        s = m.group(1)
        return lambda c: c[1] == s and not fig(c), False
    m = re.fullmatch(r"esce una carta di valore (minore|maggiore) di (\d+)", phrase)
    if m:
        k = int(m.group(2))
        return ((lambda c: c[0] < k) if m.group(1) == "minore" else (lambda c: c[0] > k)), True
    raise ValueError(f"evento sconosciuto: {phrase!r}")


DECK = [(v, s) for s in SUITS for v in range(1, 11)]


# ---------------------------------------------------------------------------
# Colours

SINGULAR = {
    "rosse": "rossa", "verdi": "verde", "gialle": "gialla", "bianche": "bianca", "nere": "nera", "blu": "blu",
    "rossa": "rossa", "verde": "verde", "gialla": "gialla", "bianca": "bianca", "nera": "nera",
}
FLAVOURS = ["alla fragola", "alla menta", "al limone", "all'arancia", "alla liquirizia"]
URNS = {
    "palline": (r"Un'urna contiene (.+), tutte uguali al tatto\. Se ne estrae una senza guardare\.", "pallina", "colori"),
    "caramelle": (r"Un sacchetto contiene (.+), tutte della stessa forma\. Se ne prende una senza guardare\.", "caramella", "gusti"),
    "penne": (r"Un astuccio contiene (.+), tutte uguali tranne il colore\. Se ne prende una senza guardare\.", "penna", "colori"),
}


def colour_name(w):
    if w in FLAVOURS:
        return w
    if w in SINGULAR:
        return SINGULAR[w]
    raise ValueError(f"colore sconosciuto {w!r}")


def read_urn(prose):
    for ctx, (rx, one, kinds) in URNS.items():
        m = re.match(rx, prose)
        if not m:
            continue
        items = re.split(r", | e ", m.group(1))
        counts = []
        for i, it in enumerate(items):
            mm = re.fullmatch(r"(\d+) (?:(palline|caramelle|penne) )?(.+)", it)
            if not mm or (i == 0) != bool(mm.group(2)) or (mm.group(2) and mm.group(2) != ctx):
                raise ValueError(f"contenuto scritto male: {it!r}")
            k, w = int(mm.group(1)), mm.group(3)
            if w not in FLAVOURS and w != "blu" and (k == 1) != (SINGULAR.get(w) == w):
                raise ValueError(f"accordo sbagliato: {it!r}")
            counts.append((colour_name(w), k))
        return ctx, one, kinds, counts
    raise ValueError("urna non riconosciuta")


# ---------------------------------------------------------------------------
# Choice

def frac_tex(r):
    return str(r.numerator) if r.denominator == 1 else rf"\dfrac{{{r.numerator}}}{{{r.denominator}}}"


def read_frac(tex):
    m = re.fullmatch(r"\\dfrac\{(\d+)\}\{(\d+)\}", tex)
    if m:
        a, b = int(m.group(1)), int(m.group(2))
        return F(a, b), F(a, b).denominator == b and b > 1
    if re.fullmatch(r"\d+", tex):
        return F(int(tex)), True
    return None, False


def dec_tex(r):
    """How the spec writes a decimal: comma, thin space from five digits; None if not finite in 3 digits."""
    if (r * 1000).denominator != 1:
        return None
    whole = r.numerator // r.denominator
    frac = r - whole
    s = str(whole)
    if len(s) >= 5:
        s = re.sub(r"\B(?=(\d{3})+(?!\d))", r"\\,", s)
    if frac:
        s += "{,}" + str(int(frac * 1000)).rjust(3, "0").rstrip("0")
    return s


def read_dec(tex):
    m = re.fullmatch(r"(\d+(?:\\,\d{3})*)(?:\{,\}(\d+))?", tex)
    if not m:
        return None
    v = F(int(m.group(1).replace("\\,", "")))
    if m.group(2):
        v += F(int(m.group(2)), 10 ** len(m.group(2)))
    return v


def choice_errors(ch, truth, keys, named=()):
    errs = []
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} opzioni")
    if len(set(keys)) != len(keys):
        errs.append(f"opzioni uguali: {keys}")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("opzioni con lo stesso testo")
    hits = [i for i, k in enumerate(keys) if k == truth]
    if len(hits) != 1:
        errs.append(f"{len(hits)} opzioni giuste")
    elif ch.get("correct") != hits[0]:
        errs.append(f"correct = {ch.get('correct')}, la giusta è {hits[0]}")
    for n in named:
        if n != truth and n not in keys:
            errs.append(f"manca il distrattore {n}")
    return errs


def prob_choice_errors(ch, truth, named=()):
    if ch is None:
        return ["scelta multipla mancante"]
    errs, keys = [], []
    for o in ch.get("options", []):
        v, reduced = read_frac(o["latex"])
        if v is None or not reduced:
            errs.append(f"opzione scritta male: {o['latex']!r}")
        elif [str(v)] != [str(F(x)) for x in o["values"]]:
            errs.append(f"opzione {o['latex']!r} non dice {o['values']}")
        if v is not None and not 0 < v < 1:
            errs.append(f"opzione {o['latex']} non è strettamente tra 0 e 1")
        keys.append(v)
    return errs + choice_errors(ch, truth, keys, [n for n in named if 0 < n < 1])


def dec_choice_errors(ch, truth, named=()):
    if ch is None:
        return ["scelta multipla mancante"]
    errs, keys = [], []
    for o in ch.get("options", []):
        v = read_dec(o["latex"])
        if v is None or dec_tex(v) != o["latex"]:
            errs.append(f"opzione scritta male: {o['latex']!r}")
        elif str(v) != str(F(o["values"][0])):
            errs.append(f"opzione {o['latex']!r} non dice {o['values']}")
        keys.append(v)
    return errs + choice_errors(ch, truth, keys, [n for n in named if dec_tex(n) is not None])


def answer_errors(s, truth, tex):
    ans = s["answer"]
    if ans.get("kind") != "number":
        return [f"risposta di tipo {ans.get('kind')}"]
    errs = []
    if F(ans["value"]) != truth:
        errs.append(f"risposta {ans['value']} invece di {truth}")
    if tex not in s["solution"]:
        errs.append(f"la soluzione non dice {tex}")
    return errs


def prob_errors(s, fav, n, named=()):
    """Number answer k/n: 0 < p < 1, the answer, the reduced form in the solution, the choice."""
    truth = F(len(fav) if isinstance(fav, list) else fav, n)
    errs = []
    if not 0 < truth < 1:
        errs.append(f"probabilità {truth}")
    errs += answer_errors(s, truth, "p = " + frac_tex(truth))
    errs += prob_choice_errors(s.get("choice"), truth, named)
    if int(s["params"].get("total", -1)) != n:
        errs.append(f"params.total {s['params'].get('total')} invece di {n}")
    return errs


# ---------------------------------------------------------------------------
# Levels

def level1(s, p, prose):
    phrase = event_of(prose)
    if prose.startswith("Si lancia un dado non truccato. "):
        n, case = 6, "dado"
    else:
        m = re.match(r"Un'urna contiene (\d+) palline numerate da 1 a (\d+), tutte uguali al tatto\. Se ne estrae una senza guardare\. ", prose)
        if not m or m.group(1) != m.group(2):
            return ["esperimento non riconosciuto"], None
        n, case = int(m.group(1)), "urna"
        if not 10 <= n <= 30:
            return [f"urna di {n} palline"], None
    if not phrase or not phrase.startswith("esce "):
        return ["evento mancante"], None
    noun = phrase[5:]
    if re.fullmatch(r"(?:il numero )?\d+", noun):
        return ["evento elementare al livello 1"], None
    fav = [x for x in range(1, n + 1) if number_pred(noun)(x)]
    errs = []
    if len(fav) < 2:
        errs.append(f"{len(fav)} casi favorevoli")
    if p.get("favorable") != [str(x) for x in fav]:
        errs.append(f"params.favorable {p.get('favorable')} invece di {fav}")
    k = len(fav)
    errs += prob_errors(s, fav, n, [F(n - k, n)])
    return errs, case


TYPE_LABELS = [("certo", r"\text{evento certo}"), ("impossibile", r"\text{evento impossibile}"), ("elementare", r"\text{evento elementare}"), ("nessuno", r"\text{nessuno dei tre}")]


def space_and_pred(setting, phrase):
    if setting == "Si lancia un dado.":
        if not phrase.startswith("esce "):
            raise ValueError(f"evento {phrase!r}")
        pred = number_pred(phrase[5:])
        return [str(x) for x in range(1, 7)], lambda w: pred(int(w))
    if setting == "Si lanciano due monete, con esiti TT, TC, CT, CC.":
        return coin_space(2), coin_pred(phrase, 2)
    raise ValueError(f"esperimento {setting!r}")


def set_tex(items):
    return r"\emptyset" if not items else r"\{" + ", ".join(items) + r"\}"


def level2(s, p, prose):
    ch = s["answer"]
    if ch.get("kind") != "choice":
        return ["risposta non a scelta"], None
    m = re.fullmatch(r'(Si lancia un dado\.|Si lanciano due monete, con esiti TT, TC, CT, CC\.) Evento: "([^"]+)"\.', prose)
    if m:
        omega, pred = space_and_pred(m.group(1), m.group(2))
        E = [w for w in omega if pred(w)]
        typ = "impossibile" if not E else "certo" if len(E) == len(omega) else "elementare" if len(E) == 1 else "nessuno"
        errs = []
        if [(o["values"][0], o["latex"]) for o in ch["options"]] != TYPE_LABELS:
            errs.append("opzioni non nell'ordine fisso")
        errs += choice_errors(ch, typ, [o["values"][0] for o in ch["options"]])
        if set_tex(E) not in " ".join(s["steps"]):
            errs.append(f"i passaggi non scrivono E = {set_tex(E)}")
        return errs, "tipo"
    m = re.fullmatch(r'(Si lancia un dado\.|Si lanciano due monete, con esiti TT, TC, CT, CC\.) \$A\$ = "([^"]+)", \$B\$ = "([^"]+)"\.', prose)
    if not m:
        return ["problema non riconosciuto"], None
    omega, pa = space_and_pred(m.group(1), m.group(2))
    _, pb = space_and_pred(m.group(1), m.group(3))
    A = [w for w in omega if pa(w)]
    B = [w for w in omega if pb(w)]
    errs = []
    if not A or not B or A == B:
        errs.append(f"eventi A = {A}, B = {B}")
    I = [w for w in omega if w in A and w in B]
    U = [w for w in omega if w in A or w in B]
    comp = bool(I)
    truth = (frozenset(I), comp)
    keys = []
    for o in ch["options"]:
        mm = re.fullmatch(r"\\begin\{gathered\} A \\cap B = (\\emptyset|\\\{[^{}]*\\\}) \\\\ \\text\{(compatibili|incompatibili)\} \\end\{gathered\}", o["latex"])
        if not mm:
            errs.append(f"opzione scritta male: {o['latex']!r}")
            keys.append(None)
            continue
        items = [] if mm.group(1) == r"\emptyset" else [x.strip() for x in mm.group(1)[2:-2].split(",")]
        if any(x not in omega for x in items):
            errs.append(f"opzione con esiti estranei: {items}")
        key = (frozenset(items), mm.group(2) == "compatibili")
        vals = o["values"]
        if vals != [",".join(items) or "vuoto", mm.group(2)]:
            errs.append(f"opzione {o['latex']!r} non dice {vals}")
        keys.append(key)
    named = [(frozenset(I), not comp), (frozenset(U), True)] if comp else [(frozenset(), True), (frozenset(U), True)]
    errs += choice_errors(ch, truth, keys, named)
    case = "compatibili" if comp else "incompatibili"
    return errs, case


def level3(s, p, prose):
    phrase = event_of(prose)
    if not phrase:
        return ["evento mancante"], None
    m = re.match(r"Si lanciano (due|tre) monete non truccate\. ", prose)
    if m:
        nc = NUMWORD[m.group(1)]
        omega = coin_space(nc)
        pred = coin_pred(phrase, nc)
        fav = [w for w in omega if pred(w)]
        n = len(omega)
        errs = []
        if p.get("favorable") != fav:
            errs.append(f"params.favorable {p.get('favorable')} invece di {fav}")
        named = []
        # results "by number of heads", counted as if equiprobable
        by_heads = {}
        for w in omega:
            by_heads.setdefault(w.count("T"), []).append(pred(w))
        if all(len(set(v)) == 1 for v in by_heads.values()):
            named.append(F(sum(1 for v in by_heads.values() if v[0]), nc + 1))
        errs += prob_errors(s, fav, n, named)
        if not all(w in " ".join(s["steps"]) for w in omega):
            errs.append("i passaggi non elencano gli esiti")
        return errs, "due-monete" if nc == 2 else "tre-monete"
    if not prose.startswith("Si lanciano un dado e una moneta, non truccati. "):
        return ["esperimento non riconosciuto"], None
    mm = re.fullmatch(r"esce (testa|croce) e (.+)", phrase)
    if not mm:
        return [f"evento {phrase!r}"], None
    face = mm.group(1)[0].upper()
    noun = mm.group(2)
    if re.fullmatch(r"\d+", noun):
        return ["numero senza 'il numero'"], None
    dp = number_pred(noun)
    omega = list(itertools.product("TC", range(1, 7)))
    fav = [f"({c}, {d})" for c, d in omega if c == face and dp(d)]
    errs = []
    if p.get("favorable") != fav:
        errs.append(f"params.favorable {p.get('favorable')} invece di {fav}")
    errs += prob_errors(s, fav, 12, [F(len(fav), 8)])
    return errs, "dado-moneta"


def level4(s, p, prose):
    ctx, one, kinds, counts = read_urn(prose)
    phrase = event_of(prose)
    c = len(counts)
    names = [x for x, _ in counts]
    errs = []
    if c not in (3, 4) or len(set(names)) != c:
        errs.append(f"colori {names}")
    if any(not 1 <= k <= 9 for _, k in counts):
        errs.append(f"quantità {counts}")
    balls = [x for x, k in counts for _ in range(k)]  # one entry per ball
    n = len(balls)
    if not 6 <= n <= 24:
        errs.append(f"{n} oggetti")
    alt = "|".join(re.escape(x) for x in names)
    m = re.fullmatch(rf"esce una {one} (che non è )?({alt})(?: o ({alt}))?", phrase or "")
    if not m or (m.group(1) and m.group(3)):
        return errs + [f"evento {phrase!r}"], None
    if m.group(1):
        case, pred, naive = "non-colore", (lambda b: b != m.group(2)), F(c - 1, c)
    elif m.group(3):
        if m.group(2) == m.group(3) or names.index(m.group(2)) > names.index(m.group(3)):
            errs.append("due colori ripetuti o fuori ordine")
        case, pred, naive = "due-colori", (lambda b: b in (m.group(2), m.group(3))), F(2, c)
    else:
        case, pred, naive = "colore", (lambda b: b == m.group(2)), F(1, c)
    k = sum(1 for b in balls if pred(b))
    if F(k, n) == naive:
        errs.append("la probabilità coincide con quella dei colori")
    if str(p.get("favorable")) != str(k):
        errs.append(f"params.favorable {p.get('favorable')} invece di {k}")
    errs += prob_errors(s, k, n, [naive])
    if kinds not in " ".join(s["steps"]):
        errs.append(f"i passaggi non parlano di {kinds}")
    return errs, case


def level5(s, p, prose):
    phrase = event_of(prose)
    if not prose.startswith("Si pesca una carta da un mazzo di 40 carte napoletane ben mescolato. "):
        return ["esperimento non riconosciuto"], None
    try:
        pred, any_suit = deck_pred(phrase or "")
    except ValueError as e:
        return [str(e)], None
    k = sum(1 for c in DECK if pred(c))
    errs = []
    if str(p.get("favorable")) != str(k):
        errs.append(f"params.favorable {p.get('favorable')} invece di {k}")
    named = [F(k, 52)] + ([F(k, 160)] if any_suit and k % 4 == 0 else [])
    errs += prob_errors(s, k, 40, named)
    return errs, None


def level6(s, p, prose):
    phrase = event_of(prose)
    if not prose.startswith("Si lanciano due dadi non truccati. "):
        return ["esperimento non riconosciuto"], None
    omega = list(itertools.product(range(1, 7), repeat=2))
    named = []
    m = re.fullmatch(r"la somma è (\d+)", phrase or "")
    if m:
        v = int(m.group(1))
        pred, case = (lambda a, b: a + b == v), "somma"
        named = [F(1, 11)]
    elif (m := re.fullmatch(r"la somma è (minore|maggiore) di (\d+)", phrase or "")):
        v = int(m.group(2))
        pred = (lambda a, b: a + b < v) if m.group(1) == "minore" else (lambda a, b: a + b > v)
        case = "disuguaglianza"
    elif phrase == "escono due numeri uguali":
        pred, case = (lambda a, b: a == b), "doppio"
    elif (m := re.fullmatch(r"la somma è (pari|dispari)", phrase or "")):
        r = 0 if m.group(1) == "pari" else 1
        pred, case = (lambda a, b: (a + b) % 2 == r), "altro"
    elif (m := re.fullmatch(r"la somma è un multiplo di (\d)", phrase or "")):
        v = int(m.group(1))
        pred, case = (lambda a, b: (a + b) % v == 0), "altro"
    elif (m := re.fullmatch(r"il primo dado dà un numero (maggiore|minore) del secondo", phrase or "")):
        pred = (lambda a, b: a > b) if m.group(1) == "maggiore" else (lambda a, b: a < b)
        case = "altro"
    elif (m := re.fullmatch(r"i due numeri differiscono di (\d)", phrase or "")):
        v = int(m.group(1))
        pred, case = (lambda a, b: abs(a - b) == v), "altro"
    elif (m := re.fullmatch(r"il prodotto è (\d+)", phrase or "")):
        v = int(m.group(1))
        pred, case = (lambda a, b: a * b == v), "altro"
    elif (m := re.fullmatch(r"escono due numeri (pari|dispari)", phrase or "")):
        r = 0 if m.group(1) == "pari" else 1
        pred, case = (lambda a, b: a % 2 == r and b % 2 == r), "altro"
    elif (m := re.fullmatch(r"esce almeno un (\d)", phrase or "")):
        v = int(m.group(1))
        pred, case = (lambda a, b: v in (a, b)), "almeno"
        named = [F(12, 36)]
    else:
        return [f"evento {phrase!r}"], None
    fav = [f"({a}, {b})" for a, b in omega if pred(a, b)]
    errs = []
    if p.get("favorable") != fav:
        errs.append("params.favorable diverso dal conteggio")
    errs += prob_errors(s, fav, 36, named)
    return errs, case


FREQ = [
    r"Una ditta controlla (\d+) lampadine prese dalla produzione di un giorno e ne trova (\d+) difettose\.",
    r"Un vivaio pianta (\d+) semi di basilico e (\d+) germogliano\.",
    r"Una puntina da disegno lanciata (\d+) volte cade (\d+) volte con la punta in su\.",
    r"In una stagione una giocatrice di basket tira (\d+) tiri liberi e ne segna (\d+)\.",
    r"Un controllo su (\d+) bulloni prodotti da una macchina ne trova (\d+) difettosi\.",
]


def level7(s, p, prose):
    for rx in FREQ:
        m = re.match(rx + " ", prose)
        if m:
            break
    else:
        return ["contesto non riconosciuto"], None
    N, f = int(m.group(1)), int(m.group(2))
    rest = prose[m.end():]
    errs = []
    if not 0 < f < N:
        errs.append(f"f = {f}, N = {N}")
    if [str(N), str(f)] != [p.get("trials"), p.get("successes")]:
        errs.append("params diversi dal testo")
    fr = F(f, N)
    if dec_tex(fr) is None:
        errs.append(f"frequenza {fr} con più di tre decimali")
    if rest.startswith("Stima la probabilità"):
        errs += answer_errors(s, fr, dec_tex(fr) or "?")
        errs += dec_choice_errors(s.get("choice"), fr, [1 - fr])
        return errs, "frequenza"
    mm = re.fullmatch(r".*(?:su|in) (\d+)(?: lanci)?\?", rest)
    if not mm:
        return errs + [f"domanda {rest!r}"], None
    M = int(mm.group(1))
    exp = fr * M
    if exp.denominator != 1 or exp == 0:
        errs.append(f"numero atteso {exp} non intero")
    errs += answer_errors(s, exp, dec_tex(exp) or "?")
    errs += dec_choice_errors(s.get("choice"), exp, [M - exp])
    return errs, "stima"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6, 7: level7}


def check(sample):
    p = sample["params"]
    errs = []
    text = sample["problem"] + " ".join(sample["steps"]) + sample["solution"]
    if "—" in text or "piuttosto che" in text:
        errs.append("parole vietate")
    if re.search(r"\d\.\d", text):
        errs.append("punto decimale")
    if not sample["steps"] or not sample["solution"]:
        errs.append("passaggi o soluzione mancanti")
    f = LEVELS.get(sample["level"])
    if not f:
        return errs + [f"livello {sample['level']}"], None
    try:
        prose = prose_of(sample["problem"])
    except ValueError as e:
        return errs + [str(e)], None
    e, kind = f(sample, p, prose)
    errs += e
    if kind is not None and p.get("case") != kind:
        errs.append(f"params.case {p.get('case')!r}, il problema è {kind!r}")
    return errs, kind
