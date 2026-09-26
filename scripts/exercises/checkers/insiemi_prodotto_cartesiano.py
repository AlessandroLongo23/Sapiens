"""Checker for insiemi-prodotto-cartesiano, from specs/exercises/insiemi-prodotto-cartesiano.md.

Written from the spec, not from the TypeScript. Products are recomputed with itertools.product, the
equal pairs of level 1 are solved with SymPy from the problem as it is written, the sets of level 5
from their property (insiemi_comune.prop_elements), the sets of level 4 from the pairs read back from
the problem. Every option's LaTeX is rebuilt from its values, on one line or on two as the spec says.
"""
import re
from itertools import product

from sympy import Eq, Integer, Symbol, solve, sympify

from checkers.insiemi_comune import (
    _order,
    base_errors,
    canon,
    choice_errors,
    el,
    el_tex,
    els,
    list_tex,
    number_answer_errors,
    number_option_truth,
    prop_elements,
    prop_tex,
    prose,
    set_tex,
)

CASE_RANGES = {
    1: {"uguaglianza": (0.42, 0.58), "appartenenza": (0.42, 0.58)},
    2: {"lettere": (0.28, 0.46), "numeri": (0.25, 0.42), "quadrato": (0.22, 0.40)},
    3: {"diretto": (0.14, 0.28), "problema": (0.17, 0.32), "inverso": (0.13, 0.27), "quadrato": (0.11, 0.23), "radice": (0.11, 0.23)},
    4: {"casella": (0.42, 0.58), "insiemi": (0.42, 0.58)},
    5: {"appartenenza": (0.38, 0.58), "elenco": (0.13, 0.30), "vuoto": (0.22, 0.40)},
    6: {"somma": (0.24, 0.40), "minore": (0.22, 0.38), "comuni": (0.30, 0.46)},
}

STORIES = [
    "Una mensa offre ogni giorno {m} primi e {n} secondi. Un menù è formato da un primo e da un secondo. Quanti menù diversi si possono comporre?",
    "Luca ha {m} magliette e {n} paia di pantaloni. Quanti modi diversi ha di vestirsi con una maglietta e un paio di pantaloni?",
    "Una gelateria ha {m} gusti e {n} tipi di cono. Un gelato è formato da un gusto e da un cono. Quanti gelati diversi si possono ordinare?",
    "Un codice è formato da una lettera, scelta tra {m}, seguita da una cifra, scelta tra {n}. Quanti codici diversi si possono formare?",
    "In una battaglia navale le colonne del campo sono indicate con {m} lettere e le righe con {n} numeri. Quante caselle ha il campo?",
]

X, Y = Symbol("x"), Symbol("y")


def array(rows):
    return rows[0] if len(rows) == 1 else "\\begin{array}{l} " + " \\\\ ".join(rows) + " \\end{array}"


def pkey(p):
    return (_order(p[0]), _order(p[1]))


def pair_tex(p, braces=False):
    a, b = el_tex(p[0]), el_tex(p[1])
    return f"\\{{{a}, {b}\\}}" if braces else f"({a}, {b})"


def negative(p):
    return any(not isinstance(e, str) and e < 0 for e in p)


def pairs_latex(pairs, braces=False):
    """The spec: more than 4 pairs, or more than 3 with a negative number, on two lines."""
    if not pairs:
        return "\\emptyset"
    split = len(pairs) > 4 or (len(pairs) > 3 and any(negative(p) for p in pairs))
    return list_tex([pair_tex(p, braces) for p in pairs], split=split)


def parse_option(o):
    """-> ("pairs", [pairs], braces) | ("elems", [elements]) | ("xy", x, y) | ("AB", A, B); checks the latex."""
    vals = o["values"]
    if vals and all(v.startswith("=") for v in vals):
        xs = els([v[1:] for v in vals])
        if xs != canon(xs):
            raise ValueError(f"elements not canonical {vals}")
        if o["latex"] != set_tex(xs):
            raise ValueError(f"latex {o['latex']} != {set_tex(xs)}")
        return ("elems", xs)
    if len(vals) == 2 and vals[0].startswith("x=") and vals[1].startswith("y="):
        x, y = int(vals[0][2:]), int(vals[1][2:])
        if o["latex"] != f"x = {x},\\ y = {y}":
            raise ValueError(f"bad x, y option {o}")
        return ("xy", x, y)
    if len(vals) == 2 and vals[0].startswith("A=") and vals[1].startswith("B="):
        A, B = (els(v[2:].split(",")) for v in vals)
        if A != canon(A) or B != canon(B):
            raise ValueError(f"sets not canonical {vals}")
        tex = f"\\begin{{gathered}} A = {set_tex(A)} \\\\ B = {set_tex(B)} \\end{{gathered}}"
        if o["latex"] != tex:
            raise ValueError(f"latex {o['latex']} != {tex}")
        return ("AB", A, B)
    braces = [v.startswith("~") for v in vals]
    if len(set(braces)) > 1:
        raise ValueError("pairs mixed with sets")
    pairs = [tuple(el(e) for e in v.lstrip("~").split(":")) for v in vals]
    if any(len(p) != 2 for p in pairs):
        raise ValueError(f"bad pair values {vals}")
    if pairs != sorted(set(pairs), key=pkey):
        raise ValueError(f"pairs not sorted or repeated {vals}")
    b = bool(braces and braces[0])
    # a single pair of level 1, 4 and 5 is written without braces around it
    tex = pair_tex(pairs[0], b) if len(pairs) == 1 and o["latex"] == pair_tex(pairs[0], b) else pairs_latex(pairs, b)
    if o["latex"] != tex:
        raise ValueError(f"latex {o['latex']} != {tex}")
    return ("pairs", pairs, b)


def pairs_truth(truth):
    """The right option is exactly the pairs of truth, with round brackets."""
    t = set(truth)

    def grade(o):
        kind = parse_option(o)
        if kind[0] != "pairs" or kind[2]:
            return False
        return set(kind[1]) == t

    return grade


def member_truth(A, B):
    """Options are single pairs; the right one belongs to A × B."""

    def grade(o):
        kind = parse_option(o)
        if kind[0] != "pairs" or len(kind[1]) != 1 or kind[2]:
            raise ValueError(f"expected one pair: {o}")
        a, b = kind[1][0]
        return a in A and b in B

    return grade


def lin_value(expr_tex):
    """'2x - 1' -> SymPy expression."""
    s = re.sub(r"(\d)([xy])", r"\1*\2", expr_tex)
    if not re.fullmatch(r"[0-9xy*+\- ]+", s):
        raise ValueError(f"bad component {expr_tex}")
    return sympify(s, locals={"x": X, "y": Y})


def check(sample):
    errs = base_errors(sample)
    p = sample["params"]
    lvl = sample["level"]
    prob = sample["problem"]
    kind = p.get("variant")
    ans = sample["answer"]
    choice = sample.get("choice")
    if lvl != 3 and ans.get("kind") == "choice" and choice != ans:
        errs.append("choice differs from the answer")

    if lvl == 1 and kind == "uguaglianza":
        m = re.fullmatch(r"\((.+?), (.+?)\) = \((.+?), (.+?)\)", prob)
        if not m:
            return errs + [f"problem is not an equality of pairs: {prob}"], kind
        l1, l2, r1, r2 = (lin_value(g) for g in m.groups())
        sol = solve([Eq(l1, r1), Eq(l2, r2)], [X, Y], dict=True)
        if len(sol) != 1 or X not in sol[0] or Y not in sol[0]:
            return errs + [f"no unique solution: {sol}"], kind
        x, y = sol[0][X], sol[0][Y]
        if not (isinstance(x, Integer) and isinstance(y, Integer)) or x == 0 or y == 0 or abs(x) > 9 or abs(y) > 9:
            errs.append(f"x = {x}, y = {y}: need nonzero integers up to 9")
        if (str(x), str(y)) != (p["x"], p["y"]):
            errs.append(f"params x, y {p['x']}, {p['y']} != {x}, {y}")
        # x only in the first components, y only in the second
        if l1.free_symbols | r1.free_symbols != {X} or l2.free_symbols | r2.free_symbols != {Y}:
            errs.append("x must be in the first components and y in the second")
        crossed = X in l1.free_symbols and Y in r2.free_symbols
        if (p["layout"] == "incrociata") != crossed:
            errs.append(f"layout {p['layout']} does not match the problem")
        if "1x" in prob.replace("11x", "") or "1y" in prob.replace("11y", "") or re.search(r"[+-] 0\b", prob):
            errs.append("1x, 1y or a zero term in the problem")
        if ans.get("kind") != "choice":
            return errs + ["answer must be a choice"], kind
        if sample["solution"] != f"x = {x},\\ y = {y}":
            errs.append("solution does not state x and y")

        def grade(o):
            k = parse_option(o)
            if k[0] != "xy":
                raise ValueError(f"expected an x, y option: {o}")
            return (k[1], k[2]) == (x, y)

        errs += choice_errors(ans, grade)
        return errs, kind

    if lvl == 1:
        A, B = els(p["A"]), els(p["B"])
        if p["case"] == "lettere":
            if not all(isinstance(e, int) for e in A) or not all(isinstance(e, str) for e in B):
                errs.append("case lettere needs numbers in A and letters in B")
        elif not all(isinstance(e, int) for e in A + B) or not set(A) & set(B) or set(A) == set(B):
            errs.append("case numeri needs two different sets of numbers with something in common")
        if not 2 <= len(A) <= 3 or not 2 <= len(B) <= 3:
            errs.append("A and B need 2 or 3 elements")
        if prob != f"A = {set_tex(A)} \\qquad B = {set_tex(B)}":
            errs.append("problem does not show A and B")
        errs += choice_errors(ans, member_truth(set(A), set(B)))
        return errs, kind

    if lvl == 2:
        A = els(p["A"])
        if kind == "quadrato":
            name = "A^2" if p["asked"] == "A2" else "A \\times A"
            if len(A) != 2 or prob != array([f"A = {set_tex(A)}", f"{name} = \\ ?"]):
                errs.append("problem must show A with 2 elements and ask A × A")
            truth = list(product(A, A))
        else:
            B = els(p["B"])
            X_, Y_, name = (A, B, "A \\times B") if p["asked"] == "AxB" else (B, A, "B \\times A")
            truth = list(product(X_, Y_))
            if len(truth) > 6 or not 2 <= len(A) <= 3 or not 2 <= len(B) <= 3:
                errs.append("sets of 2 or 3 elements, at most 6 pairs")
            if kind == "lettere" and not all(isinstance(e, str) for e in B):
                errs.append("case lettere needs letters in B")
            if kind == "numeri" and (not all(isinstance(e, int) for e in A + B) or len(set(A) & set(B)) != 1):
                errs.append("case numeri needs numbers with exactly one in common")
            if prob != array([f"A = {set_tex(A)} \\qquad B = {set_tex(B)}", f"{name} = \\ ?"]):
                errs.append("problem does not show A, B and the product asked")
        if not sample["solution"].endswith(list_tex([pair_tex(q) for q in sorted(truth, key=pkey)])):
            errs.append("solution does not list the product")
        errs += choice_errors(ans, pairs_truth(truth))
        return errs, kind

    if lvl == 3:
        q = {k: int(v) for k, v in p.items() if k not in ("variant", "mistakes")}
        if kind in ("diretto", "problema"):
            m, n = q["m"], q["n"]
            value = m * n
            if not (2 <= m <= 9 and 2 <= n <= 9):
                errs.append("m, n from 2 to 9")
            if kind == "diretto":
                rows = [f"|A| = {m} \\qquad |B| = {n}", "|A \\times B| = \\ ?"]
                if prob != array(rows):
                    errs.append("problem does not show |A| and |B|")
            else:
                if m == n or m > 8 or n > 8:
                    errs.append("story with m != n, up to 8")
                text = STORIES[q["story"]].format(m=m, n=n)
                if prose(prob) != "\\begin{array}{l} \\text{" + text + "} \\end{array}":
                    errs.append("problem does not tell the story with m and n")
        elif kind == "inverso":
            tot, m = q["total"], q["m"]
            value = tot // m
            if tot % m or value == m or not 2 <= value <= 9 or not 2 <= m <= 9:
                errs.append("total must be m · n with n != m, both 2..9")
            if prob != array([f"|A \\times B| = {tot} \\qquad |A| = {m}", "|B| = \\ ?"]):
                errs.append("problem does not show |A × B| and |A|")
        elif kind == "quadrato":
            k = q["k"]
            value = k * k
            if not 3 <= k <= 12 or prob != array([f"|A| = {k}", "|A \\times A| = \\ ?"]):
                errs.append("quadrato: |A| from 3 to 12 shown")
        elif kind == "radice":
            sq = q["square"]
            value = round(sq ** 0.5)
            if value * value != sq or not 3 <= value <= 12 or prob != array([f"|A \\times A| = {sq}", "|A| = \\ ?"]):
                errs.append("radice: a perfect square from 9 to 144 shown")
        else:
            return errs + [f"unknown variant {kind}"], None
        if str(value) in re.findall(r"\d+", prob):
            errs.append("the answer is already a number of the problem")
        errs += number_answer_errors(sample, value)
        errs += choice_errors(choice, number_option_truth(value))
        return errs, kind

    if lvl == 4 and kind == "casella":
        R, C = els(p["rows"]), els(p["cols"])
        i, j = (int(v) for v in p["cell"])
        name = "A \\times B" if p["asked"] == "AxB" else "B \\times A"
        if not (2 <= len(R) <= 4 and 2 <= len(C) <= 4) or R != canon(R) or C != canon(C):
            errs.append("2 to 4 rows and columns, sorted")
        body = " \\\\ ".join(f"{el_tex(r)} & " + " & ".join("?" if (a, b) == (i, j) else "" for b in range(len(C))) for a, r in enumerate(R))
        table = f"\\begin{{array}}{{c|{'c' * len(C)}}} {name} & {' & '.join(el_tex(c) for c in C)} \\\\ \\hline {body} \\end{{array}}"
        if prob != f"\\begin{{gathered}} {table} \\end{{gathered}}":
            errs.append("problem is not the table with one question mark")
        truth = (R[i], C[j])
        if truth[0] == truth[1]:
            errs.append("the cell pair has equal elements: the swapped pair would be the same")

        def grade(o):
            k = parse_option(o)
            if k[0] != "pairs" or len(k[1]) != 1:
                raise ValueError(f"expected one pair: {o}")
            return not k[2] and k[1][0] == truth

        errs += choice_errors(ans, grade)
        return errs, kind

    if lvl == 4:
        pairs = [(el(a), el(b)) for a, b in re.findall(r"\((-?\w+), (-?\w+)\)", prob)]
        A, B = canon([a for a, _ in pairs]), canon([b for _, b in pairs])
        if set(pairs) != set(product(A, B)) or len(pairs) != len(A) * len(B) or len(pairs) not in (4, 6):
            errs.append("the listed pairs are not a whole product of 4 or 6 pairs")
        if (A, B) != (els(p["A"]), els(p["B"])):
            errs.append(f"params A, B {p['A']}, {p['B']} != {A}, {B} read from the problem")
        lines = [", ".join(pair_tex(q) for q in pairs[r:r + 2]) for r in range(0, len(pairs), 2)]
        expected = ["A \\times B = \\{" * (r == 0) + l + ("\\}" if r == len(lines) - 1 else ",") for r, l in enumerate(lines)]
        if prob != array(expected + ["A = \\ ? \\qquad B = \\ ?"]):
            errs.append("problem does not list the product two pairs per line")
        if pairs != sorted(pairs, key=pkey):
            errs.append("pairs not in order")

        def grade(o):
            k = parse_option(o)
            if k[0] != "AB":
                raise ValueError(f"expected an A, B option: {o}")
            return (k[1], k[2]) == (A, B)

        errs += choice_errors(ans, grade)
        return errs, kind

    if lvl == 5:
        pa, pb = p["A"], p["B"]
        A, B = prop_elements(pa), prop_elements(pb)
        base = [f"A = {prop_tex(pa)}", f"B = {prop_tex(pb)}"]
        if prop_tex(pa) == prop_tex(pb):
            errs.append("the same property twice")
        if kind == "vuoto":
            if (not A) == (not B):
                errs.append("exactly one of the two sets must be empty")
            other = A or B
            if not 2 <= len(other) <= 3:
                errs.append("the other set needs 2 or 3 elements")
        elif not (2 <= len(A) <= 3 and 2 <= len(B) <= 3):
            errs.append("A and B need 2 or 3 elements")
        if kind == "appartenenza":
            if prob != array(base):
                errs.append("problem does not show A and B")
            errs += choice_errors(ans, member_truth(set(A), set(B)))
            return errs, kind
        truth = list(product(A, B))
        if kind == "elenco" and len(truth) > 6:
            errs.append("more than 6 pairs to list")
        if prob != array(base + ["A \\times B = \\ ?"]):
            errs.append("problem does not show A, B and ask A × B")
        errs += choice_errors(ans, pairs_truth(truth))
        return errs, kind

    if lvl == 6:
        A, B = els(p["A"]), els(p["B"])
        if not all(isinstance(e, int) and 1 <= e <= 7 for e in A + B):
            errs.append("numbers from 1 to 7")
        head = f"A = {set_tex(A)} \\qquad B = {set_tex(B)}"
        allp = list(product(A, B))
        if kind == "somma":
            s = int(p["s"])
            truth = [q for q in allp if q[0] + q[1] == s]
            ask = f"\\{{(a, b) \\in A \\times B \\mid a + b = {s}\\}} = \\ ?"
            if not 1 <= len(truth) <= 3:
                errs.append("one to three pairs with the sum")
            U = set(A) | set(B)
            if not any((a, s - a) not in set(allp) and s - a in U for a in U):
                errs.append("no pair with the sum outside A × B: nothing to trap the order")
        elif kind == "minore":
            truth = [q for q in allp if q[0] < q[1]]
            ask = "\\{(a, b) \\in A \\times B \\mid a < b\\} = \\ ?"
            if not 1 <= len(truth) <= 5 or not set(A) & set(B):
                errs.append("one to five pairs, and a common element (a pair with a = b)")
        elif kind == "comuni":
            I = set(A) & set(B)
            truth = [(a, b) for a, b in allp if (a, b) in set(product(B, A))]
            ask = "(A \\times B) \\cap (B \\times A) = \\ ?"
            if len(I) not in (1, 2) or set(A) <= set(B) or set(B) <= set(A):
                errs.append("one or two common elements, neither set inside the other")
        else:
            return errs + [f"unknown variant {kind}"], None
        if prob != array([head, ask]):
            errs.append("problem does not show A, B and the condition")
        errs += choice_errors(ans, pairs_truth(truth))
        return errs, kind

    return errs + [f"unknown level {lvl}"], None
