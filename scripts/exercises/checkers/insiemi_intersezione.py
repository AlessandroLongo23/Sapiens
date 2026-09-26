"""Checker for insiemi-intersezione, from specs/exercises/insiemi-intersezione.md.

Intersections are recomputed with Python sets: the letters of the words, the divisors and the
multiples by brute force, the sets described by a property from its conditions. The statements of
level 3 are parsed from their own small language and tested on every choice of A, B, C inside
U = {1, 2, 3}. The word problems are rebuilt from the four zones of the diagram, and their text is
written again here from the context phrases, to be compared with the problem.
"""
import re
from itertools import product
from math import gcd

from checkers.insiemi_comune import (
    base_errors,
    choice_errors,
    els,
    no_repeats,
    number_answer_errors,
    number_option_truth,
    prop_elements,
    prop_tex,
    prose,
    set_answer_errors,
    set_option_truth,
    set_tex,
)

CASE_RANGES = {
    1: {"in comune": (0.45, 0.65), "disgiunti": (0.08, 0.22), "lettere": (0.2, 0.4)},
    2: {"multipli": (0.22, 0.38), "divisori": (0.27, 0.43), "estremi": (0.14, 0.3), "proprieta": (0.1, 0.26)},
    3: {"sempre vera": (0.27, 0.43), "incluso": (0.22, 0.38), "universo": (0.13, 0.27), "vuoto": (0.09, 0.21)},
    4: {"piena": (0.6, 0.8), "vuota": (0.2, 0.4)},
    5: {"formula": (0.22, 0.38), "entrambi con nessuno": (0.27, 0.43), "entrambi": (0.09, 0.21), "solo A": (0.13, 0.27)},
    6: {"minimo": (0.42, 0.58), "massimo": (0.42, 0.58)},
}

WORDS = {
    "scuola", "classe", "lavagna", "quaderno", "matita", "penna", "zaino", "libro", "gomma", "righello",
    "compasso", "diario", "banco", "sedia", "finestra", "palestra", "cortile", "lezione", "compito",
    "pagina", "storia", "musica", "disegno", "teatro", "cinema", "giardino", "montagna", "estate",
    "inverno", "pianeta", "stella", "nuvola", "gelato", "tavolo", "chitarra", "pallone",
}

# group, people, A, B, both, none, only A, everyone
CONTEXTS = [
    ("In una gita di", "studenti", "hanno visitato il museo", "hanno visitato il castello", "hanno visitato tutti e due",
     "non hanno visitato nessuno dei due", "hanno visitato solo il museo", "ogni studente ha visitato almeno uno dei due posti"),
    ("In una classe di", "studenti", "giocano a calcio", "giocano a pallavolo", "giocano sia a calcio sia a pallavolo",
     "non giocano né a calcio né a pallavolo", "giocano solo a calcio", "ogni studente gioca ad almeno uno dei due sport"),
    ("In un gruppo di", "ragazzi", "hanno la bicicletta", "hanno il monopattino", "hanno sia la bicicletta sia il monopattino",
     "non hanno né la bicicletta né il monopattino", "hanno solo la bicicletta", "ognuno ha almeno uno dei due mezzi"),
    ("In una classe di", "studenti", "hanno la sufficienza in matematica", "hanno la sufficienza in fisica",
     "hanno la sufficienza in tutte e due le materie", "non hanno la sufficienza in nessuna delle due materie",
     "hanno la sufficienza solo in matematica", "ognuno ha la sufficienza in almeno una delle due materie"),
    ("In un gruppo di", "amici", "hanno letto il libro", "hanno visto il film", "hanno sia letto il libro sia visto il film",
     "non hanno né letto il libro né visto il film", "hanno letto il libro senza vedere il film",
     "ognuno ha letto il libro o visto il film"),
]

CONTEXT_LETTERS = [("M", "C"), ("C", "P"), ("B", "M"), ("M", "F"), ("L", "F")]

EMPTY_IN_BRACES = "{vuoto}"
ASK = "A \\cap B = \\ ?"


def array(rows):
    return rows[0] if len(rows) == 1 else "\\begin{array}{l} " + " \\\\ ".join(rows) + " \\end{array}"


def set_grade(truth):
    """Set options, plus {∅} (a set with one element, never the answer here)."""
    base = set_option_truth(truth)

    def grade(o):
        if o["values"] == [EMPTY_IN_BRACES]:
            if o["latex"] != "\\{\\emptyset\\}":
                raise ValueError(f"bad {{∅}} option {o}")
            return False
        return base(o)

    return grade


def plain(tex):
    """The prose of a word problem: the \\text{} lines joined."""
    t = prose(tex)
    t = re.sub(r"^\\begin\{array\}\{l\} ", "", t)
    t = re.sub(r" \\end\{array\}$", "", t)
    m = re.fullmatch(r"\\text\{(.*?)\}((?: \\\\ .*)?)", t)
    return m.group(1) + m.group(2) if m else t


# ---------------------------------------------------------------------------
# Level 2: infinite sets of multiples


def infinite(label, n=3000):
    kind, arg = label.split(":")
    ks = [int(k) for k in arg.split(",")]
    if kind == "mult":
        return {x for x in range(n) if x % ks[0] == 0}
    if kind == "union":
        return {x for x in range(n) if any(x % k == 0 for k in ks)}
    raise ValueError(f"bad label {label}")


def infinite_tex(label):
    shown = sorted(infinite(label))[: 4 if label.startswith("mult") else 6]
    return "\\{" + ", ".join(str(x) for x in shown) + ", \\dots\\}"


def divisors(n):
    return {d for d in range(1, n + 1) if n % d == 0}


# ---------------------------------------------------------------------------
# Level 3: statements


def parse_term(s):
    """A, B, C, E, U with & and |, left to right, parentheses: returns a function of the sets."""
    pos = 0

    def atom():
        nonlocal pos
        if s[pos] == "(":
            pos += 1
            f = expr()
            if s[pos] != ")":
                raise ValueError(f"bad term {s}")
            pos += 1
            return f
        name = s[pos]
        pos += 1
        if name not in "ABCEU":
            raise ValueError(f"bad name {name} in {s}")
        return (lambda env: frozenset()) if name == "E" else (lambda env, n=name: env[n])

    def expr():
        nonlocal pos
        f = atom()
        while pos < len(s) and s[pos] in "&|":
            op = s[pos]
            pos += 1
            g = atom()
            f = (lambda env, f=f, g=g: f(env) & g(env)) if op == "&" else (lambda env, f=f, g=g: f(env) | g(env))
        return f

    f = expr()
    if pos != len(s):
        raise ValueError(f"trailing text in {s}")
    return f


def split_stmt(s):
    if "<=" in s:
        l, r = s.split("<=")
        return l, "<=", r
    l, r = s.split("=")
    return l, "=", r


def term_tex(s):
    out = ""
    for c in s:
        out += {"&": " \\cap ", "|": " \\cup ", "E": "\\emptyset"}.get(c, c)
    return out


def stmt_tex(s):
    l, rel, r = split_stmt(s)
    sym = "\\subseteq" if rel == "<=" else "="
    return f"{term_tex(l)} {sym} {term_tex(r)}"


def always(s):
    l, rel, r = split_stmt(s)
    fl, fr = parse_term(l), parse_term(r)
    U = frozenset({1, 2, 3})
    subsets = [frozenset(x for x, keep in zip((1, 2, 3), bits) if keep) for bits in product((0, 1), repeat=3)]
    for A, B, C in product(subsets, repeat=3):
        env = {"A": A, "B": B, "C": C, "U": U}
        L, R = fl(env), fr(env)
        if not (L <= R if rel == "<=" else L == R):
            return False
    return True


def stmt_grade(o):
    if len(o["values"]) != 1 or o["latex"] != stmt_tex(o["values"][0]):
        raise ValueError(f"statement option {o} does not match its latex")
    return always(o["values"][0])


# ---------------------------------------------------------------------------


def check(sample):
    errs = base_errors(sample)
    p = sample["params"]
    lvl = sample["level"]
    prob = sample["problem"]
    kind = p.get("case")
    ch = sample.get("choice")
    ans = sample["answer"]
    if ans.get("kind") == "choice" and ch != ans:
        errs.append("choice differs from the answer")

    def set_level(truth, rows=None):
        e = set_answer_errors(sample, truth)
        if rows is not None and prob != array(rows):
            e.append("problem does not show the sets in params")
        if not no_repeats(prob):
            e.append("repeated elements in a listed set")
        if not sample["solution"].endswith(set_tex(truth)):
            e.append("solution does not end with the answer")
        e += choice_errors(ch, set_grade(truth))
        return e

    def choice_level(grade, solution):
        e = choice_errors(ans, grade)
        if sample["solution"] != solution and not sample["solution"].endswith(" = " + solution):
            e.append(f"solution {sample['solution']} is not {solution}")
        return e

    if lvl == 1:
        if kind == "lettere":
            w1, w2 = p["words"]
            if w1 not in WORDS or w2 not in WORDS or w1 == w2:
                errs.append("unknown or repeated words")
            A, B = set(w1), set(w2)
            truth = A & B
            if not 2 <= len(truth) <= 5 or A <= B or B <= A:
                errs.append("letters: 2 to 5 in common, neither word inside the other")
            sentence = (f"Siano $A$ l'insieme delle lettere della parola “{w1}” e $B$ l'insieme delle lettere "
                        f"della parola “{w2}”.")
            if plain(prob) != f"{sentence} \\\\ {ASK}":
                errs.append("problem does not name the two words")
            errs += choice_level(set_option_truth(truth), set_tex(truth))
        else:
            A, B = set(els(p["A"])), set(els(p["B"]))
            truth = A & B
            if not all(1 <= x <= 15 for x in A | B):
                errs.append("numbers from 1 to 15")
            if kind != ("disgiunti" if not truth else "in comune"):
                errs.append(f"case {kind} does not match the sets")
            errs += set_level(truth, [f"A = {set_tex(A)} \\qquad B = {set_tex(B)}", ASK])
    elif lvl == 2:
        if kind == "multipli":
            a, b = int(p["a"]), int(p["b"])
            truth = {x for x in range(3000) if x % a == 0 and x % b == 0}
            sentence = f"Siano $A$ l'insieme dei multipli di ${a}$ e $B$ l'insieme dei multipli di ${b}$ in $\\mathbb{{N}}$."
            if plain(prob) != f"{sentence} \\\\ {ASK}":
                errs.append("problem does not describe the multiples in params")

            def grade(o):
                if len(o["values"]) != 1 or o["latex"] != infinite_tex(o["values"][0]):
                    raise ValueError(f"option {o} does not match its label")
                return infinite(o["values"][0]) == truth

            errs += choice_level(grade, infinite_tex(f"mult:{a * b // gcd(a, b)}"))
        elif kind == "divisori":
            m, n = int(p["m"]), int(p["n"])
            truth = divisors(m) & divisors(n)
            if gcd(m, n) < 2 or m % n == 0 or n % m == 0 or len(truth) < 3:
                errs.append("divisors: a common divisor > 1, neither number divides the other, 3 or more in common")
            sentence = f"Siano $A$ l'insieme dei divisori di ${m}$ e $B$ l'insieme dei divisori di ${n}$."
            if plain(prob) != f"{sentence} \\\\ {ASK}":
                errs.append("problem does not describe the divisors in params")
            errs += set_level(truth)
        elif kind in ("estremi", "proprieta"):
            pa, pb = p["A"], p["B"]
            conds = pa["conds"] + pb["conds"]
            if pa["dom"] != "N" or pb["dom"] != "N" or len(pa["conds"]) != 1 or len(pb["conds"]) != 1:
                errs.append("one condition per set, in N")
            ranges = [c for c in conds if c["t"] == "range"]
            if kind == "estremi" and len(ranges) != 2:
                errs.append("estremi: two bounds")
            if kind == "proprieta" and len(ranges) != 1:
                errs.append("proprieta: one bound and one property")
            truth = set(prop_elements({"dom": "N", "conds": conds}))
            if len(truth) > 8 or (kind == "proprieta" and len(truth) < 3):
                errs.append("wrong number of elements")
            errs += set_level(truth, [f"A = {prop_tex(pa)} \\qquad B = {prop_tex(pb)}", ASK])
        else:
            errs.append(f"unknown case {kind}")
    elif lvl == 3:
        if kind == "sempre vera":
            sentence = ("Per insiemi qualunque $A$, $B$, $C$ contenuti in un universo $U$, quale di queste "
                        "affermazioni è sempre vera?")
            if plain(prob) != sentence:
                errs.append("problem is not the question of the spec")
            opts = ans.get("options", [])
            good = [o for o in opts if o.get("values") and always(o["values"][0])]
            errs += choice_level(stmt_grade, stmt_tex(good[0]["values"][0]) if len(good) == 1 else "?")
        elif kind == "incluso":
            A, B = set(els(p["A"])), set(els(p["B"]))
            if not (A < B or B < A):
                errs.append("one set must be a proper subset of the other")
            errs += set_level(A & B, [f"A = {set_tex(A)} \\qquad B = {set_tex(B)}", ASK])
        elif kind == "universo":
            U, A = set(els(p["U"])), set(els(p["A"]))
            if not A < U or U != set(range(1, len(U) + 1)):
                errs.append("A must be inside U = {1, ..., n}")
            errs += set_level(A & U, [f"U = {set_tex(U)} \\qquad A = {set_tex(A)}", "A \\cap U = \\ ?"])
        elif kind == "vuoto":
            A = set(els(p["A"]))
            errs += set_level(set(), [f"A = {set_tex(A)}", "A \\cap \\emptyset = \\ ?"])
        else:
            errs.append(f"unknown case {kind}")
    elif lvl == 4:
        A, B, C = (set(els(p[k])) for k in "ABC")
        truth = A & B & C
        if kind == "vuota" and (truth or not (A & B and B & C and A & C)):
            errs.append("vuota: every pair overlaps, the three do not")
        if kind == "piena" and (not truth or A & B == truth):
            errs.append("piena: non-empty, and C removes something from A ∩ B")
        if kind not in ("vuota", "piena"):
            errs.append(f"unknown case {kind}")
        if len(set(sample["steps"][0:2])) != 2 or f"(A \\cap B) \\cap C = {set_tex(truth)}" not in sample["steps"][0] \
                or f"A \\cap (B \\cap C) = {set_tex(truth)}" not in sample["steps"][1]:
            errs.append("steps must compute the intersection in both orders")
        errs += set_level(truth, [f"A = {set_tex(A)} \\qquad B = {set_tex(B)}", f"C = {set_tex(C)}", "A \\cap B \\cap C = \\ ?"])
    elif lvl == 5:
        if kind == "formula":
            a, b, u = int(p["a"]), int(p["b"]), int(p["u"])
            value = a + b - u
            if not (6 <= a <= 30 and 6 <= b <= 30 and 1 <= value < min(a, b)):
                errs.append("formula: data out of range")
            if prob != array([f"|A| = {a} \\qquad |B| = {b} \\qquad |A \\cup B| = {u}", "|A \\cap B| = \\ ?"]):
                errs.append("problem does not show the data in params")
        else:
            total, a, b, both, none = (int(p[k]) for k in ("total", "a", "b", "both", "none"))
            only_a, only_b = a - both, b - both
            if min(only_a, only_b) < 1 or both < 1 or none < 0 or only_a + only_b + both + none != total or total > 60:
                errs.append("the four zones do not add up to the total")
            g, people, wa, wb, wboth, wnone, wonly, weveryone = CONTEXTS[int(p["context"])]
            if kind == "entrambi con nessuno":
                value = both
                text = f"{g} {total} {people}, {a} {wa}, {b} {wb} e {none} {wnone}. Quanti {people} {wboth}?"
                if not 1 <= none < both:
                    errs.append("need 1 <= nessuno < entrambi")
            elif kind == "entrambi":
                value = both
                text = f"{g} {total} {people}, {a} {wa} e {b} {wb}; {weveryone}. Quanti {people} {wboth}?"
                if none != 0:
                    errs.append("entrambi: everybody in at least one set")
            elif kind == "solo A":
                value = only_a
                text = f"{g} {total} {people}, {a} {wa}, {b} {wb} e {none} {wnone}. Quanti {people} {wonly}?"
                if not 1 <= none < both:
                    errs.append("need 1 <= nessuno < entrambi")
            else:
                return errs + [f"unknown case {kind}"], None
            if plain(prob) != text:
                errs.append("problem text differs from the one rebuilt from params")
            if value in ((total, a, b) if kind == "entrambi" else (total, a, b, none)):
                errs.append("the answer is a number in the text")
        errs += number_answer_errors(sample, value)
        errs += choice_errors(ch, number_option_truth(value))
    elif lvl == 6:
        total, a, b = int(p["total"]), int(p["a"]), int(p["b"])
        # the minimum: |A ∪ B| can be at most the total; the maximum: A ∩ B inside the smaller set
        lo = max(0, a + b - total)
        hi = min(a, b)
        # brute force over the possible sizes of the intersection, from the zones
        possible = [i for i in range(0, total + 1) if a - i >= 0 and b - i >= 0 and a + b - i <= total]
        if (min(possible), max(possible)) != (lo, hi):
            errs.append("minimum or maximum does not match the zones")
        if not (20 <= total <= 40 and a != b and a + b > total and max(a, b) < total):
            errs.append("data out of range")
        g, people, wa, wb, wboth, *_ = CONTEXTS[int(p["context"])]
        which = {"minimo": "minimo", "massimo": "massimo"}.get(kind)
        if which is None:
            return errs + [f"unknown case {kind}"], None
        value = lo if kind == "minimo" else hi
        if kind == "massimo":
            letters = CONTEXT_LETTERS[int(p["context"])]
            small, big = letters if a < b else letters[::-1]
            if f"{small} \\subseteq {big}" not in sample["steps"][-1]:
                errs.append("the maximum is reached when the smaller set is inside the larger one")
        text = f"{g} {total} {people}, {a} {wa} e {b} {wb}. Quanti {people}, come {which}, {wboth}?"
        if plain(prob) != text:
            errs.append("problem text differs from the one rebuilt from params")
        errs += number_answer_errors(sample, value)
        errs += choice_errors(ch, number_option_truth(value))
    else:
        return errs + [f"unknown level {lvl}"], None
    return errs, kind
