"""Checker for logica-quantificatori, from specs/exercises/logica-quantificatori.md.

Written from the spec, not from the TypeScript. Properties are rebuilt from their keys and written
again in LaTeX; statements are evaluated by brute force on finite universes, on ±1000 for ℕ and ℤ
(the properties have coefficients below 50, so their edges are well inside), and with SymPy
(solveset over the reals) for level 4, where ℚ is one of the universes. Italian sentences are
rebuilt from their pieces (quantifier word, universe, property) and their logical form is read from
the quantifier word, not from the text. Options on two lines are joined back before comparing.
"""
import re
from sympy import Eq, FiniteSet, Ge, Gt, Interval, Le, Lt, Ne, Rational, S, Symbol, Union, ceiling, solveset

from checkers.insiemi_comune import base_errors, choice_errors, set_answer_errors, set_option_truth, set_tex

X = Symbol("x", real=True)

CASE_RANGES = {
    1: {"valore": (0.62, 0.78), "enunciato": (0.22, 0.38)},
    2: {"normale": (0.72, 0.88), "vuoto": (0.05, 0.16), "tutto": (0.05, 0.16)},
    3: {"quale": (0.40, 0.60), "controesempio": (0.40, 0.60)},
    4: {f"{q}:{p}": (0.07, 0.19) for q, ps in (("E", ("NZQ", "ZQ", "Q", "none")), ("A", ("NZQ", "NZ", "N", "none"))) for p in ps},
    5: {"simboli": (0.52, 0.68), "parole": (0.32, 0.48)},
    6: {"simboli": (0.52, 0.68), "parole": (0.32, 0.48)},
    7: {"vera": (0.40, 0.60), "falsa": (0.40, 0.60)},
}

REL = {"<": "<", "<=": "\\le", "=": "=", ">": ">", ">=": "\\ge", "!=": "\\ne"}
OPPOSITE = {"<": ">=", "<=": ">", "=": "!=", ">": "<=", ">=": "<", "!=": "="}
DOMS = {"N": "\\mathbb{N}", "Z": "\\mathbb{Z}", "U": "U"}
BIG = 1000


# ---------------------------------------------------------------------------
# Properties


def parse(key):
    parts = key.split("|")
    t = parts[0]
    if t in ("pari", "dispari"):
        return {"t": t}
    if t in ("mult", "nmult"):
        return {"t": t, "k": int(parts[1])}
    if t == "div":
        return {"t": t, "n": int(parts[1])}
    if t == "cmp":
        l = [int(v) for v in parts[1].split(",")]
        r = [int(v) for v in parts[3].split(",")]
        if len(l) != 3 or len(r) != 3 or parts[2] not in REL:
            raise ValueError(f"bad key {key}")
        return {"t": t, "l": l, "rel": parts[2], "r": r}
    raise ValueError(f"bad key {key}")


def key_of(p):
    if p["t"] in ("pari", "dispari"):
        return p["t"]
    if p["t"] in ("mult", "nmult"):
        return f"{p['t']}|{p['k']}"
    if p["t"] == "div":
        return f"div|{p['n']}"
    return f"cmp|{','.join(map(str, p['l']))}|{p['rel']}|{','.join(map(str, p['r']))}"


def poly(c):
    """c0 + c1 x + c2 x^2, highest degree first, no 1x, no + -."""
    out = []
    for d, k in ((2, c[2]), (1, c[1]), (0, c[0])):
        if k == 0:
            continue
        a = abs(k)
        if d == 0:
            m = str(a)
        else:
            m = ("" if a == 1 else str(a)) + ("x" if d == 1 else "x^2")
        if out:
            out.append(("- " if k < 0 else "+ ") + m)
        else:
            out.append(("-" if k < 0 else "") + m)
    return " ".join(out) if out else "0"


def ptex(p, v="x"):
    t = p["t"]
    if t == "pari":
        return f"{v} \\text{{ è pari}}"
    if t == "dispari":
        return f"{v} \\text{{ è dispari}}"
    if t == "mult":
        return f"{v} \\text{{ è multiplo di }} {p['k']}"
    if t == "nmult":
        return f"{v} \\text{{ non è multiplo di }} {p['k']}"
    if t == "div":
        return f"{v} \\text{{ è un divisore di }} {p['n']}"
    return f"{poly(p['l'])} {REL[p['rel']]} {poly(p['r'])}"


def val(c, x):
    return c[0] + c[1] * x + c[2] * x * x


def cmp(a, rel, b):
    return {"<": a < b, "<=": a <= b, "=": a == b, ">": a > b, ">=": a >= b, "!=": a != b}[rel]


def holds(p, x):
    t = p["t"]
    if t == "pari":
        return x % 2 == 0
    if t == "dispari":
        return x % 2 == 1
    if t == "mult":
        return x % p["k"] == 0
    if t == "nmult":
        return x % p["k"] != 0
    if t == "div":
        return x >= 1 and p["n"] % x == 0
    return cmp(val(p["l"], x), p["rel"], val(p["r"], x))


def negate(p):
    t = p["t"]
    if t == "pari":
        return {"t": "dispari"}
    if t == "dispari":
        return {"t": "pari"}
    if t == "mult":
        return {"t": "nmult", "k": p["k"]}
    if t == "nmult":
        return {"t": "mult", "k": p["k"]}
    if t == "cmp":
        return {**p, "rel": OPPOSITE[p["rel"]]}
    raise ValueError("no negation")


def ints(d):
    return list(range(0, BIG + 1)) if d == "N" else list(range(-BIG, BIG + 1))


def stmt(q, d, p):
    return f"\\forall x \\in {DOMS[d]},\\ {ptex(p)}" if q == "A" else f"\\exists x \\in {DOMS[d]} : {ptex(p)}"


def truth(q, xs, p):
    return all(holds(p, x) for x in xs) if q == "A" else any(holds(p, x) for x in xs)


def texts(latex):
    """The words of an option in \\text{}, on one line or on the lines of a gathered, joined."""
    parts = re.findall(r"\\text\{([^{}]*)\}", latex)
    rest = re.sub(r"\\text\{[^{}]*\}", "", latex)
    rest = rest.replace("\\begin{gathered}", "").replace("\\end{gathered}", "").replace("\\\\", "")
    if rest.strip():
        raise ValueError(f"option is not only words: {latex}")
    if len(parts) > 1 and "\\begin{gathered}" not in latex:
        raise ValueError(f"several lines outside a gathered: {latex}")
    return " ".join(parts)


# ---------------------------------------------------------------------------
# Sentences

def words(key):
    """(singular, plural, negated singular, property) of a property in words."""
    t, _, a = key.partition("|")
    if t == "pari":
        return "è pari", "sono pari", "non è pari", {"t": "pari"}
    if t == "dispari":
        return "è dispari", "sono dispari", "non è dispari", {"t": "dispari"}
    if t == "mult":
        k = int(a)
        return f"è multiplo di {k}", f"sono multipli di {k}", f"non è multiplo di {k}", {"t": "mult", "k": k}
    if t == "gt":
        k = int(a)
        return f"è maggiore di {k}", f"sono maggiori di {k}", f"non è maggiore di {k}", {"t": "cmp", "l": [0, 1, 0], "rel": ">", "r": [k, 0, 0]}
    if t == "lt":
        k = int(a)
        return f"è minore di {k}", f"sono minori di {k}", f"non è minore di {k}", {"t": "cmp", "l": [0, 1, 0], "rel": "<", "r": [k, 0, 0]}
    if t == "neg":
        return "è negativo", "sono negativi", "non è negativo", {"t": "cmp", "l": [0, 1, 0], "rel": "<", "r": [0, 0, 0]}
    raise ValueError(f"bad words {key}")


# The logical form of each opening: A/E and whether the property is negated.
FORM = {
    "tutti": "Ap", "ogni": "Ap",
    "qualche": "Ep", "almeno": "Ep", "esiste": "Ep",
    "nessuno": "An", "nonesiste": "An",
    "nontutti": "En", "almenonon": "En", "qualchenon": "En",
}
NEGATION_OF = {"Ap": "En", "En": "Ap", "Ep": "An", "An": "Ep"}


def sentence(phr, d, key):
    sg, pl, nsg, _ = words(key)
    one = "numero naturale" if d == "N" else "numero intero"
    many = "numeri naturali" if d == "N" else "numeri interi"
    return {
        "tutti": f"Tutti i {many} {pl}",
        "ogni": f"Ogni {one} {sg}",
        "qualche": f"Qualche {one} {sg}",
        "almeno": f"Almeno un {one} {sg}",
        "esiste": f"Esiste un {one} che {sg}",
        "nessuno": f"Nessun {one} {sg}",
        "nonesiste": f"Non esiste un {one} che {'sia ' + sg[2:] if sg.startswith('è ') else sg}",
        "nontutti": f"Non tutti i {many} {pl}",
        "almenonon": f"Almeno un {one} {nsg}",
        "qualchenon": f"Qualche {one} {nsg}",
    }[phr]


def form_stmt(form, d, key):
    """The statement of a form, with the property negated as the lesson writes it."""
    p = words(key)[3]
    return form[0], (p if form[1] == "p" else negate(p))


# ---------------------------------------------------------------------------
# Level 4: exact truth in ℕ, ℤ, ℚ with SymPy

RELFN = {"<": Lt, "<=": Le, "=": Eq, ">": Gt, ">=": Ge, "!=": Ne}


def solution_set(p):
    e_l = sum(Rational(c) * X**i for i, c in enumerate(p["l"]))
    e_r = sum(Rational(c) * X**i for i, c in enumerate(p["r"]))
    return solveset(RELFN[p["rel"]](e_l, e_r), X, S.Reals)


def has_point(sset, dom):
    """Is there a natural / integer / rational number in a subset of ℝ (a union of intervals and points)?"""
    if sset == S.EmptySet:
        return False
    if dom == "Q":
        if sset.measure > 0:
            return True  # an interval of positive length contains rationals
        return any(pt.is_rational for pt in sset)
    low = 0 if dom == "N" else None
    pieces = sset.args if isinstance(sset, Union) else [sset]
    for piece in pieces:
        if isinstance(piece, FiniteSet):
            if any(pt.is_integer and (low is None or pt >= low) for pt in piece):
                return True
        elif isinstance(piece, Interval):
            if piece.end == S.Infinity:
                return True  # unbounded above: it contains every large integer
            if piece.start == S.NegativeInfinity and low is None:
                return True
            start = piece.start if low is None else max(piece.start, low)
            # the smallest integer in the piece, if any, is one of these
            first = int(ceiling(start))
            if any(piece.contains(n) == True and (low is None or n >= low) for n in range(first, first + 2)):  # noqa: E712
                return True
        else:
            raise ValueError(f"unexpected solution set {sset}")
    return False


def exact_pattern(q, p):
    s = solution_set(p)
    if q == "E":
        t = [has_point(s, d) for d in "NZQ"]
    else:
        comp = solution_set(negate(p))
        t = [not has_point(comp, d) for d in "NZQ"]
    return "".join(d for d, ok in zip("NZQ", t) if ok) or "none"


PATTERN_TEX = {
    "NZQ": "\\text{in } \\mathbb{N},\\ \\mathbb{Z} \\text{ e } \\mathbb{Q}",
    "ZQ": "\\text{solo in } \\mathbb{Z} \\text{ e } \\mathbb{Q}",
    "NZ": "\\text{solo in } \\mathbb{N} \\text{ e } \\mathbb{Z}",
    "Q": "\\text{solo in } \\mathbb{Q}",
    "N": "\\text{solo in } \\mathbb{N}",
    "none": "\\text{in nessuno dei tre}",
}


# ---------------------------------------------------------------------------
# Level 7: two quantifiers

R2 = {
    "succ": ("y = x + 1", lambda x, y: y == x + 1),
    "prec": ("y = x - 1", lambda x, y: y == x - 1),
    "gt": ("y > x", lambda x, y: y > x),
    "ge": ("y \\ge x", lambda x, y: y >= x),
    "lt": ("y < x", lambda x, y: y < x),
    "le": ("y \\le x", lambda x, y: y <= x),
    "opp": ("x + y = 0", lambda x, y: x + y == 0),
    "dbl": ("y = 2x", lambda x, y: y == 2 * x),
    "half": ("x = 2y", lambda x, y: x == 2 * y),
    "zero": ("x + y = x", lambda x, y: x + y == x),
    "prod0": ("x \\cdot y = 0", lambda x, y: x * y == 0),
    "one": ("x \\cdot y = x", lambda x, y: x * y == x),
}


def two_tex(order, d, rel):
    D = DOMS[d]
    if order == "AE":
        return f"\\forall x \\in {D},\\ \\exists y \\in {D} : {R2[rel][0]}"
    return f"\\exists y \\in {D} : \\forall x \\in {D},\\ {R2[rel][0]}"


def two_truth(order, d, rel):
    """Every witness y here is within 2|x| + 1 of 0, and a y that fails fails for some x within |y| + 1:
    x on a window of 30 and y on 4 times that decide ∀x ∃y; the other way round decides ∃y ∀x."""
    f = R2[rel][1]
    small = range(0, 31) if d == "N" else range(-30, 31)
    big = range(0, 121) if d == "N" else range(-120, 121)
    if order == "AE":
        return all(any(f(x, y) for y in big) for x in small)
    return any(all(f(x, y) for x in big) for y in small)


# ---------------------------------------------------------------------------


def check(sample):
    errs = base_errors(sample)
    p = sample["params"]
    lvl = sample["level"]
    ans = sample["answer"]
    prob = sample["problem"]
    kind = None

    if lvl == 1:
        kind = p["variant"]
        if kind == "valore":
            d, pred, ask = p["dom"], parse(p["pred"]), p["ask"]
            if prob != f"U = {DOMS[d]} \\quad p(x): {ptex(pred)}":
                errs.append("problem does not show U and p(x)")
            if sample["prompt"] != f"Quale di queste proposizioni è {ask}?":
                errs.append("prompt")
            lo, hi = (0, 12) if d == "N" else (-6, 6)

            def grade(o):
                a = int(o["values"][0])
                if o["latex"] != f"p({a})" or not lo <= a <= hi:
                    raise ValueError(f"bad option {o}")
                return holds(pred, a) == (ask == "vera")

            errs += choice_errors(ans, grade)
        else:
            ask = p["ask"]
            v = int(p["value"])

            def grade(o):
                k, key, vv = o["values"]
                q = parse(key)
                if int(vv) != v:
                    raise ValueError("value differs")
                if k == "aperto":
                    want = ptex(q)
                elif k == "valore":
                    if q["t"] != "cmp":
                        raise ValueError("substitution only in comparisons")
                    want = None  # checked below by evaluating the written numbers
                elif k == "esiste":
                    want = stmt("E", "N", q)
                elif k == "perogni":
                    want = stmt("A", "N", q)
                else:
                    raise ValueError(f"kind {k}")
                lat = o["latex"]
                if want is not None and lat != want:
                    raise ValueError(f"latex {lat} != {want}")
                if k == "valore":
                    # the written numbers, evaluated, must be the two sides of p(v)
                    m = re.fullmatch(r"(.+) (<|>|=|\\le|\\ge) (.+)", lat)
                    if not m or "x" in lat:
                        raise ValueError(f"not a substituted comparison: {lat}")
                    ev = lambda s: eval(s.replace("\\cdot", "*").replace("^", "**").replace("{", "(").replace("}", ")"))  # noqa: E731,S307
                    rel = {"<": "<", ">": ">", "=": "=", "\\le": "<=", "\\ge": ">="}[m.group(2)]
                    if (ev(m.group(1)), rel, ev(m.group(3))) != (val(q["l"], v), q["rel"], val(q["r"], v)):
                        raise ValueError(f"substitution wrong: {lat}")
                # open statement: x is free (not bound by a quantifier); read from the text, not from the kind
                is_open = not lat.startswith(("\\forall", "\\exists")) and re.search(r"(?<![a-z\\])x", lat) is not None
                if is_open != (k == "aperto"):
                    raise ValueError(f"kind {k} but open={is_open}: {lat}")
                return is_open == (ask == "aperto")

            errs += choice_errors(ans, grade)

    elif lvl == 2:
        U = [int(v) for v in p["U"]]
        shape = p["ushape"]
        pred = parse(p["pred"])
        m = re.fullmatch(r"([01])-(\d+)", shape)
        if m:
            a, n = int(m.group(1)), int(m.group(2))
            if U != list(range(a, n + 1)):
                errs.append("U does not match its shape")
            utex = f"\\{{{a}, {a + 1}, \\dots, {n}\\}}"
        elif shape == "elenco":
            utex = set_tex(U)
        else:
            utex = None
            errs.append(f"shape {shape}")
        if not 6 <= len(U) <= 12 or len(set(U)) != len(U) or U != sorted(U):
            errs.append("U must have 6 to 12 distinct elements in order")
        if prob != f"\\begin{{array}}{{l}} U = {utex} \\quad p(x): {ptex(pred)} \\\\ V_p = \\ ? \\end{{array}}":
            errs.append("problem does not show U and p(x)")
        V = [x for x in U if holds(pred, x)]
        kind = "vuoto" if not V else "tutto" if len(V) == len(U) else "normale"
        if kind != p.get("case"):
            errs.append(f"case {p.get('case')} but {kind}")
        errs += set_answer_errors(sample, V)
        errs += choice_errors(sample.get("choice"), set_option_truth(V))

    elif lvl == 3:
        kind = p["variant"]
        if kind == "quale":
            U = [int(v) for v in p["U"]]
            ask = p["ask"]
            if prob != f"U = {set_tex(U)}":
                errs.append("problem does not show U")
            if sample["prompt"] != f"Quale di queste proposizioni è {ask}?":
                errs.append("prompt")

            def grade(o):
                q, key = o["values"]
                pr = parse(key)
                if o["latex"] != stmt(q, "U", pr):
                    raise ValueError(f"latex {o['latex']}")
                return truth(q, U, pr) == (ask == "vera")

            errs += choice_errors(ans, grade)
        else:
            d, pred = p["dom"], parse(p["pred"])
            if prob != stmt("A", d, pred):
                errs.append("problem does not show the statement")
            if truth("A", ints(d), pred):
                errs.append("the ∀ statement is true: no counterexample")

            def grade(o):
                a = int(o["values"][0])
                if o["latex"] != str(a) or (d == "N" and a < 0):
                    raise ValueError(f"bad option {o}")
                return not holds(pred, a)

            errs += choice_errors(ans, grade)

    elif lvl == 4:
        q, pred = p["q"], parse(p["pred"])
        if pred["t"] != "cmp":
            errs.append("level 4 needs a comparison")
        if prob != stmt(q, "U", pred):
            errs.append("problem does not show the statement")
        pat = exact_pattern(q, pred)
        kind = f"{q}:{pat}"
        allowed = ["NZQ", "ZQ", "Q", "none"] if q == "E" else ["NZQ", "NZ", "N", "none"]
        if pat not in allowed:
            errs.append(f"pattern {pat} impossible for {q}")
        opts = ans.get("options", [])
        if sorted(o["values"][0] for o in opts) != sorted(allowed):
            errs.append("options are not the four possible answers")

        def grade(o):
            if o["latex"] != PATTERN_TEX[o["values"][0]]:
                raise ValueError(f"latex {o['latex']}")
            return o["values"][0] == pat

        errs += choice_errors(ans, grade)

    elif lvl == 5:
        kind = p["variant"]
        d, key, form = p["dom"], p["words"], p["form"]
        q0, p0 = form_stmt(form, d, key)
        t = truth(q0, ints(d), p0)
        if p["truth"] != ("vera" if t else "falsa"):
            errs.append("truth value in params is wrong")
        if not any(f"La proposizione è {'vera' if t else 'falsa'}" in s for s in sample["steps"]):
            errs.append("steps do not state the truth value")
        if kind == "simboli":
            if FORM[p["phr"]] != form:
                errs.append("the sentence does not have the form in params")
            if prob != f"\\text{{“{sentence(p['phr'], d, key)}”}}":
                errs.append("problem does not show the sentence")

            def grade(o):
                f, dd, kk = o["values"]
                qq, pp = form_stmt(f, dd, kk)
                if (dd, kk) != (d, key) or o["latex"] != stmt(qq, d, pp):
                    raise ValueError(f"bad option {o}")
                return f == form

        else:
            if prob != stmt(q0, d, p0):
                errs.append("problem does not show the statement")

            def grade(o):
                f, dd, kk, phr = o["values"]
                if (dd, kk) != (d, key) or FORM[phr] != f or texts(o["latex"]) != sentence(phr, d, key):
                    raise ValueError(f"bad option {o}")
                return FORM[phr] == form

        errs += choice_errors(ans, grade)

    elif lvl == 6:
        kind = p["variant"]
        d = p["dom"]
        if kind == "simboli":
            q, pred = p["q"], parse(p["pred"])
            if pred["t"] != "cmp" or pred["rel"] not in ("<", "<=", ">", ">="):
                errs.append("level 6 in symbols needs an inequality")
            if prob != stmt(q, d, pred):
                errs.append("problem does not show the statement")
            q2 = "E" if q == "A" else "A"
            neg = negate(pred)
            xs = ints(d)
            t = truth(q, xs, pred)
            if truth(q2, xs, neg) == t:
                errs.append("statement and negation have the same truth value")
            if p["truth"] != ("vera" if t else "falsa"):
                errs.append("truth in params")
            neg_set = {x for x in xs if holds(neg, x)}

            def grade(o):
                qq, kk, _label = o["values"]
                pp = parse(kk)
                if o["latex"] != stmt(qq, d, pp):
                    raise ValueError(f"latex {o['latex']}")
                if pp["l"] != pred["l"] or pp["r"] != pred["r"]:
                    raise ValueError("option about other expressions")
                right = qq == q2 and pp["rel"] == neg["rel"]
                if not right and qq == q2 and {x for x in xs if holds(pp, x)} == neg_set:
                    raise ValueError(f"distractor {o['latex']} says the same as the negation in {d}")
                return right

        else:
            key, form, phr = p["words"], p["form"], p["phr"]
            if FORM[phr] != form:
                errs.append("the sentence does not have the form in params")
            if prob != f"\\text{{“{sentence(phr, d, key)}”}}":
                errs.append("problem does not show the sentence")
            q0, p0 = form_stmt(form, d, key)
            q1, p1 = form_stmt(NEGATION_OF[form], d, key)
            t0, t1 = truth(q0, ints(d), p0), truth(q1, ints(d), p1)
            if t0 == t1:
                errs.append("sentence and negation have the same truth value")
            if p["truth"] != ("vera" if t0 else "falsa"):
                errs.append("truth in params")

            def grade(o):
                f, dd, kk, ph = o["values"]
                if (dd, kk) != (d, key) or FORM[ph] != f or texts(o["latex"]) != sentence(ph, d, key):
                    raise ValueError(f"bad option {o}")
                if ph == phr:
                    raise ValueError("the sentence itself is an option")
                return FORM[ph] == NEGATION_OF[form]

        errs += choice_errors(ans, grade)

    elif lvl == 7:
        d, ask = p["dom"], p["ask"]
        kind = ask
        if prob != f"x, y \\in {DOMS[d]}":
            errs.append("problem does not show the universe")

        def grade(o):
            order, rel = o["values"]
            if o["latex"] != two_tex(order, d, rel):
                raise ValueError(f"latex {o['latex']}")
            return two_truth(order, d, rel) == (ask == "vera")

        errs += choice_errors(ans, grade)
        # the trap of the lesson: a relation true in one order and false in the other, always among the
        # options in the wrong order (and, about half the time, in the right order too, as the answer)
        trap = p["trap"]
        if two_truth("AE", d, trap) == two_truth("EA", d, trap):
            errs.append("the trap relation has the same truth in both orders")
        wrong_order = "AE" if two_truth("AE", d, trap) != (ask == "vera") else "EA"
        if [wrong_order, trap] not in [o["values"] for o in ans.get("options", [])]:
            errs.append("the trap is not among the options in the wrong order")
    else:
        errs.append(f"unknown level {lvl}")

    if lvl != 2 and sample.get("choice") not in (None, ans):
        errs.append("choice differs from the answer")
    return errs, kind
