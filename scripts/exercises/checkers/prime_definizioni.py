"""Checker for prime-definizioni, from specs/exercises/prime-definizioni.md.

Truth comes from tables and enumerations written here: which collections are well defined,
which descriptions give an empty set, which sets are finite. Option LaTeX is re-rendered and
compared, so a label that does not match its graded meaning is caught.
"""
from fractions import Fraction

from checkers.insiemi_comune import (
    base_errors,
    choice_errors,
    el,
    eval_stmt,
    no_repeats,
    number_answer_errors,
    number_option_truth,
    prose,
    set_tex,
    stmt_tex,
)

CASE_RANGES = {
    1: {"è": (0.35, 0.65), "non è": (0.35, 0.65)},
    2: {"vera": (0.35, 0.65), "falsa": (0.35, 0.65)},
    3: {"vera": (0.35, 0.65), "falsa": (0.35, 0.65)},
    5: {"parola": (0.30, 0.50), "ripetuti": (0.12, 0.28), "naturali": (0.22, 0.38), "vuoto/zero": (0.05, 0.15)},
    6: {"infinito": (0.35, 0.65), "finito": (0.35, 0.65)},
}

# Level 1: True = well defined (it is a set).
COLLECTIONS = {
    "I giorni della settimana": True,
    "Le vocali dell'alfabeto italiano": True,
    "I mesi dell'anno che hanno 30 giorni": True,
    "I numeri naturali minori di 10": True,
    "I divisori di 24": True,
    "I multipli di 5 minori di 100": True,
    "I numeri pari compresi tra 7 e 21": True,
    "Gli studenti della tua classe nati a marzo": True,
    "I numeri primi minori di 30": True,
    "Le stagioni dell'anno": True,
    "I colori della bandiera italiana": True,
    "I numeri dispari minori di 20": True,
    "I ragazzi simpatici della tua classe": False,
    "I numeri grandi": False,
    "I film più belli dell'anno": False,
    "Le città più belle d'Italia": False,
    "I libri interessanti della biblioteca": False,
    "Le canzoni famose": False,
    "I numeri vicini a 100": False,
    "Gli studenti bravi in matematica": False,
    "Le persone alte della tua scuola": False,
    "I numeri piccoli": False,
    "Le materie facili": False,
}

MONTH_DAYS = {"gennaio": 31, "febbraio": 28, "marzo": 31, "aprile": 30, "maggio": 31, "giugno": 30, "luglio": 31,
              "agosto": 31, "settembre": 30, "ottobre": 31, "novembre": 30, "dicembre": 31}


def empty_candidate(values):
    """(latex, number of elements) of a level 4 candidate."""
    k = values[0]
    N = range(0, 200)
    if k == "lt":
        n = int(values[1])
        return f"\\text{{i numeri naturali minori di }} {n}", sum(1 for x in N if x < n)
    if k == "eq":
        a, b = int(values[1]), int(values[2])
        return f"\\text{{i numeri naturali }} x \\text{{ tali che }} x + {a} = {b}", sum(1 for x in N if x + a == b)
    if k == "btw":
        a, b = int(values[1]), int(values[2])
        return f"\\text{{i numeri naturali maggiori di }} {a} \\text{{ e minori di }} {b}", sum(1 for x in N if a < x < b)
    if k == "lit0":
        return "\\{0\\}", 1
    if k == "litE":
        return "\\{\\emptyset\\}", 1
    if k == "mesi":
        d = int(values[1])
        return f"\\text{{i mesi dell'anno con }} {d} \\text{{ giorni}}", sum(1 for v in MONTH_DAYS.values() if v == d)
    raise ValueError(f"unknown candidate {values}")


def finite_candidate(values):
    """(latex, finite?) of a level 6 option."""
    k = values[0]
    table = {
        "pari": ("\\text{i numeri naturali pari}", False),
        "dispari": ("\\text{i numeri naturali dispari}", False),
        "neg": ("\\text{i numeri interi negativi}", False),
        "razio": ("\\text{i numeri razionali compresi tra } 0 \\text{ e } 1", False),
        "milione": ("\\text{i numeri naturali minori di un milione}", True),
        "vuoto": ("\\emptyset", True),
        "alfabeto": ("\\text{le lettere dell'alfabeto italiano}", True),
    }
    if k in table:
        return table[k]
    if k == "mult":
        return f"\\text{{i multipli di }} {int(values[1])} \\text{{ in }} \\mathbb{{N}}", False
    if k == "magg":
        return f"\\text{{i numeri naturali maggiori di }} {int(values[1])}", False
    if k == "div":
        return f"\\text{{i divisori di }} {int(values[1])}", True
    if k == "min":
        return f"\\text{{i numeri naturali minori di }} {int(values[1])}", True
    if k == "multmin":
        return f"\\text{{i multipli di }} {int(values[1])} \\text{{ minori di }} {int(values[2])}", True
    if k == "parola":
        return f"\\text{{le lettere della parola “{values[1]}”}}", True
    raise ValueError(f"unknown kind {values}")


def check(sample):
    errs = base_errors(sample)
    p = sample["params"]
    lvl = sample["level"]
    ans = sample["answer"]
    prob = prose(sample["problem"])
    kind = None
    if lvl in (1, 2, 3, 4, 6) and ans.get("kind") != "choice":
        return errs + ["answer must be a choice"], None
    listed = {1: "options", 4: "candidates", 6: "options"}.get(lvl)
    if listed and ans.get("kind") == "choice":
        vals = [o["values"] if lvl != 1 else o["values"][0] for o in ans["options"]]
        if p.get(listed) != vals:
            errs.append(f"params.{listed} does not match the options")
    if lvl in (2, 3) and ans.get("kind") == "choice":
        if [[st["op"], st["l"], st["r"]] for st in p.get("statements", [])] != [o["values"] for o in ans["options"]]:
            errs.append("params.statements does not match the options")
    if lvl == 1:
        ask = p["ask"]
        kind = ask
        if f"{ask} un insieme?" not in prob:
            errs.append("problem does not ask the question in params.ask")

        def grade(o):
            text = o["latex"][len("\\text{"):-1]
            if not o["latex"].startswith("\\text{") or text not in COLLECTIONS:
                raise ValueError(f"unknown collection {o['latex']}")
            return COLLECTIONS[text] == (ask == "è")

        errs += choice_errors(ans, grade)
    elif lvl in (2, 3):
        ask = p["ask"]
        kind = ask
        sets = p.get("sets", {})
        if f"è {ask}?" not in prob:
            errs.append("problem does not ask the question in params.ask")
        if lvl == 2:
            A = [el(v) for v in sets["A"]]
            if not 4 <= len(set(A)) <= 6 or len(set(A)) != len(A):
                errs.append(f"A has {len(A)} elements, expected 4-6 distinct")
            if f"A = {set_tex(A)}" not in prob:
                errs.append("problem does not show A")
        elif sets:
            errs.append("level 3 uses no named sets")

        def grade(o):
            op, l, r = o["values"]
            if lvl == 3 and r not in ("N", "Z", "Q"):
                raise ValueError("level 3 statements are about N, Z, Q")
            if "/" in l and (str(Fraction(l[2:])) != l[2:] or Fraction(l[2:]).denominator == 1):
                raise ValueError(f"fraction {l[2:]} not reduced or integer")
            if lvl == 2 and r != "A":
                raise ValueError("level 2 statements are about A")
            if o["latex"] != stmt_tex(op, l, r, sets):
                raise ValueError(f"latex {o['latex']} != {stmt_tex(op, l, r, sets)}")
            return eval_stmt(op, l, r, sets) == (ask == "vera")

        errs += choice_errors(ans, grade)
        if len({o["values"][1] for o in ans["options"]}) != len(ans["options"]):
            errs.append("two statements about the same element")
    elif lvl == 4:
        if "vuoto?" not in prob:
            errs.append("problem must ask which set is empty")

        def grade(o):
            tex, n = empty_candidate(o["values"])
            if o["latex"] != tex:
                raise ValueError(f"latex {o['latex']} != {tex}")
            return n == 0

        errs += choice_errors(ans, grade)
    elif lvl == 5:
        v = p["variant"]
        if v == "parola":
            w = p["word"]
            truth = len(set(w))
            kind = "parola"
            if f"“{w}”" not in prob:
                errs.append("problem does not show the word")
            if truth == len(w):
                errs.append("word without repeated letters")
        elif v == "ripetuti":
            xs = [int(x) for x in p["list"]]
            truth = len(set(xs))
            kind = "ripetuti"
            shown = "\\{" + ", ".join(str(x) for x in xs) + "\\}"
            if shown not in prob:
                errs.append("problem does not show the list")
            if len(xs) == truth:
                errs.append("list without repetitions")
        elif v in ("lt", "le", "pari"):
            n = int(p["n"])
            kind = "naturali"
            if v == "lt":
                truth = sum(1 for x in range(0, n + 5) if x < n)
                phrase = f"naturali minori di ${n}$"
            elif v == "le":
                truth = sum(1 for x in range(0, n + 5) if x <= n)
                phrase = f"naturali minori o uguali a ${n}$"
            else:
                truth = sum(1 for x in range(0, n + 5) if x < n and x % 2 == 0)
                phrase = f"naturali pari minori di ${n}$"
            if phrase not in prob:
                errs.append(f"problem does not describe {phrase}")
        elif v in ("vuoto", "zero", "insvuoto"):
            kind = "vuoto/zero"
            tex = {"vuoto": "A = \\emptyset", "zero": "A = \\{0\\}", "insvuoto": "A = \\{\\emptyset\\}"}[v]
            truth = 0 if v == "vuoto" else 1
            if tex not in prob:
                errs.append("problem does not show the set")
        else:
            return errs + [f"unknown variant {v}"], None
        errs += number_answer_errors(sample, truth)
        if v != "ripetuti" and not no_repeats(prob):
            errs.append("repeated elements in a listed set")
        if sample.get("choice") is not None:
            errs += choice_errors(sample["choice"], number_option_truth(truth))
        else:
            errs.append("no choice variant")
    elif lvl == 6:
        ask = p["ask"]
        kind = ask
        if f"è {ask}?" not in prob:
            errs.append("problem does not ask the question in params.ask")

        def grade(o):
            tex, fin = finite_candidate(o["values"])
            if o["latex"] != tex:
                raise ValueError(f"latex {o['latex']} != {tex}")
            return fin == (ask == "finito")

        errs += choice_errors(ans, grade)
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
