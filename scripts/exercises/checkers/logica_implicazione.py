"""Checker for logica-implicazione, from specs/exercises/logica-implicazione.md.

Written from the spec, not from the TypeScript. Propositions are read from their serialised form
("imp(not(p),q)"), evaluated on every row with itertools.product, and rendered again in LaTeX with the
rules of the spec to compare with the options. Sentences in words are rebuilt from the pieces in params
(the number and the kind of fact, the pair of clauses, the conditions), and their truth value comes from
the pieces, never from the text. Conditions on all naturals or integers are checked on a bounded range
(0..2999, or -300..300), enough for the periodic or threshold conditions the spec allows.
"""
import re
from itertools import product

from checkers.insiemi_comune import base_errors, choice_errors, set_option_truth, set_tex

CASE_RANGES = {
    1: {k: (0.18, 0.32) for k in ("VV", "VF", "FV", "FF")},
    2: {"simboli": (0.4, 0.6), "parole": (0.4, 0.6)},
    3: {"imp": (0.19, 0.31), "iff": (0.1, 0.2), "neg": (0.1, 0.2), "and": (0.19, 0.31), "or": (0.14, 0.26)},
    4: {"vera": (0.4, 0.6), "falsa": (0.4, 0.6)},
    5: {k: (0.18, 0.32) for k in ("sufficiente", "necessaria", "entrambe", "nessuna")},
    6: {**{f"relazione:{r}": (0.08, 0.17) for r in ("pq", "qp", "eq", "nessuna")},
        **{f"controesempi:{r}": (0.19, 0.31) for r in ("qp", "nessuna")}},
    7: {"parole": (0.34, 0.46), "simboli": (0.24, 0.36), "de morgan": (0.24, 0.36)},
}

# ---------------------------------------------------------------------------
# Propositions: ("v", "p"), ("not", A), (op, A, B)


def parse(s):
    pos = 0

    def read():
        nonlocal pos
        m = re.match(r"[a-z]+", s[pos:])
        if not m:
            raise ValueError(f"bad formula {s!r}")
        name = m.group(0)
        pos += len(name)
        if pos >= len(s) or s[pos] != "(":
            if name not in ("p", "q", "r"):
                raise ValueError(f"bad letter {name!r}")
            return ("v", name)
        pos += 1
        a = read()
        if name == "not":
            assert s[pos] == ")"
            pos += 1
            return ("not", a)
        if name not in ("and", "or", "imp", "iff"):
            raise ValueError(f"bad connective {name!r}")
        assert s[pos] == ","
        pos += 1
        b = read()
        assert s[pos] == ")"
        pos += 1
        return (name, a, b)

    f = read()
    if pos != len(s):
        raise ValueError(f"trailing text in {s!r}")
    return f


def ser(f):
    if f[0] == "v":
        return f[1]
    if f[0] == "not":
        return f"not({ser(f[1])})"
    return f"{f[0]}({ser(f[1])},{ser(f[2])})"


def ev(f, env):
    t = f[0]
    if t == "v":
        return env[f[1]]
    if t == "not":
        return not ev(f[1], env)
    a, b = ev(f[1], env), ev(f[2], env)
    return {"and": a and b, "or": a or b, "imp": (not a) or b, "iff": a == b}[t]


def letters(*fs):
    out = set()

    def walk(f):
        if f[0] == "v":
            out.add(f[1])
        else:
            for c in f[1:]:
                walk(c)

    for f in fs:
        walk(f)
    return sorted(out)


def table_rows(vs):
    """Rows in the order of the lesson: V before F, first letter slowest."""
    return [dict(zip(vs, vals)) for vals in product([True, False], repeat=len(vs))]


def col(f, vs):
    return [ev(f, r) for r in table_rows(vs)]


def equiv(a, b):
    vs = letters(a, b)
    return all(ev(a, r) == ev(b, r) for r in table_rows(vs))


def taut(f):
    return all(ev(f, r) for r in table_rows(letters(f)))


SYM = {"and": "\\wedge", "or": "\\vee", "imp": "\\to", "iff": "\\leftrightarrow"}


def tex(f):
    t = f[0]
    if t == "v":
        return f[1]
    if t == "not":
        inner = f[1]
        return f"\\neg {tex(inner)}" if inner[0] in ("v", "not") else f"\\neg({tex(inner)})"

    def side(c):
        if c[0] in ("v", "not") or (c[0] == t and t in ("and", "or")):
            return tex(c)
        return f"({tex(c)})"

    return f"{side(f[1])} {SYM[t]} {side(f[2])}"


def meta_tex(rel, a, b):
    side = lambda c: f"({tex(c)})" if c[0] in ("imp", "iff") else tex(c)
    arrow = "\\Rightarrow" if rel == "imp" else "\\Leftrightarrow"
    return f"{side(a)} {arrow} {side(b)}"


def N(f):
    """Negation of a literal without double negation."""
    return f[1] if f[0] == "not" else ("not", f)


def is_literal(f):
    return f[0] == "v" or (f[0] == "not" and f[1][0] == "v")


def text_of(problem):
    """The prose of a problem written as \\text{} lines: the lines joined with a space."""
    groups = re.findall(r"\\text\{((?:[^{}]|\{[^{}]*\})*)\}", problem)
    return " ".join(groups)


# ---------------------------------------------------------------------------
# Level 1: facts about a number


def is_prime(n):
    return n >= 2 and all(n % d for d in range(2, int(n**0.5) + 1))


def fact(pr, n):
    c, k = pr["c"], int(pr.get("k", 0))
    truth = {
        "pari": n % 2 == 0,
        "dispari": n % 2 == 1,
        "mult": k > 0 and n % k == 0,
        "div": k > 0 and n % k == 0,
        "divisore": k % n == 0,
        "primo": is_prime(n),
        "gt": n > k,
        "lt": n < k,
    }[c]
    text = {
        "pari": f"${n}$ è pari",
        "dispari": f"${n}$ è dispari",
        "mult": f"${n}$ è multiplo di ${k}$",
        "div": f"${n}$ è divisibile per ${k}$",
        "divisore": f"${n}$ è un divisore di ${k}$",
        "primo": f"${n}$ è un numero primo",
        "gt": f"${n} > {k}$",
        "lt": f"${n} < {k}$",
    }[c]
    return truth, text


FAMILY = {"pari": "parity", "dispari": "parity", "mult": "mult", "div": "mult", "divisore": "divisore", "primo": "primo", "gt": "gt", "lt": "lt"}


def check_level1(sample, errs):
    p = sample["params"]
    n = int(p["n"])
    if not 2 <= n <= 40:
        errs.append(f"n = {n} outside 2..40")
    pv, pt = fact(p["p"], n)
    qv, qt = fact(p["q"], n)
    if FAMILY[p["p"]["c"]] == FAMILY[p["q"]["c"]]:
        errs.append("premise and consequence of the same kind")
    for pr in (p["p"], p["q"]):
        if pr["c"] in ("mult", "div") and not 3 <= int(pr["k"]) <= 9:
            errs.append("divisor out of 3..9")
    if text_of(sample["problem"]) != f"Se {pt}, allora {qt}.":
        errs.append(f"problem text {text_of(sample['problem'])!r} != sentence from the pieces")
    L = lambda b: "V" if b else "F"
    kind = L(pv) + L(qv)
    val = (not pv) or qv

    def grade(o):
        a, b, w = o["values"]
        want_latex = (f"\\begin{{gathered}} \\text{{premessa {a}, conseguenza {b}}} \\\\ "
                      f"\\text{{implicazione {w}}} \\end{{gathered}}")
        if o["latex"] != want_latex:
            raise ValueError(f"latex {o['latex']!r}")
        return (a, b, w) == (L(pv), L(qv), "vera" if val else "falsa")

    ans = sample["answer"]
    errs += choice_errors(ans, grade)
    rows_shown = {tuple(o["values"][:2]) for o in ans.get("options", [])}
    if len(rows_shown) != 2 or (L(pv), L(qv)) not in rows_shown:
        errs.append("options must show the true row and one other row, each with both values")
    if f"conseguenza {L(qv)}: l’implicazione è {'vera' if val else 'falsa'}" not in sample["solution"]:
        errs.append("solution does not say the value")
    return kind


# ---------------------------------------------------------------------------
# Level 2 and 7: forms of an implication, clauses in words

PAIRS = [
    (("piove", "non piove"), ("prendo l’ombrello", "non prendo l’ombrello")),
    (("fa freddo", "non fa freddo"), ("accendo la stufa", "non accendo la stufa")),
    (("studio", "non studio"), ("supero la verifica", "non supero la verifica")),
    (("è domenica", "non è domenica"), ("vado allo stadio", "non vado allo stadio")),
    (("ho fame", "non ho fame"), ("mangio una mela", "non mangio una mela")),
    (("c’è il sole", "non c’è il sole"), ("vado al mare", "non vado al mare")),
    (("finisco i compiti", "non finisco i compiti"), ("guardo un film", "non guardo un film")),
    (("il semaforo è rosso", "il semaforo non è rosso"), ("mi fermo", "non mi fermo")),
    (("perdo l’autobus", "non perdo l’autobus"), ("arrivo tardi", "non arrivo tardi")),
    (("nevica", "non nevica"), ("resto a casa", "non resto a casa")),
    (("ho sete", "non ho sete"), ("bevo un succo", "non bevo un succo")),
    (("mi alleno", "non mi alleno"), ("vinco la gara", "non vinco la gara")),
    (("il telefono è carico", "il telefono non è carico"), ("ti chiamo", "non ti chiamo")),
    (("è tardi", "non è tardi"), ("vado a dormire", "non vado a dormire")),
]


def clause(lit, pair):
    neg = lit[0] == "not"
    letter = lit[1][1] if neg else lit[1]
    atom = pair[0] if letter == "p" else pair[1]
    return atom[1] if neg else atom[0]


def words(f, pair):
    """The two halves of a sentence: ("Se A,", "B") or ("A", "e B")."""
    if not (is_literal(f[1]) and is_literal(f[2])):
        raise ValueError("sentence of non-literals")
    a, b = clause(f[1], pair), clause(f[2], pair)
    if f[0] == "imp":
        return f"Se {a},", b
    if f[0] == "and":
        return a[0].upper() + a[1:], f"e {b}"
    raise ValueError(f"no sentence for {f[0]}")


def form(name, x, y):
    return {
        "inversa": ("imp", y, x),
        "contraria": ("imp", N(x), N(y)),
        "contronominale": ("imp", N(y), N(x)),
        "negazione": ("and", x, N(y)),
    }[name]


def check_level2(sample, errs):
    p = sample["params"]
    ans = sample["answer"]
    if p["variant"] == "simboli":
        x, y = parse(p["x"]), parse(p["y"])
        if not (is_literal(x) and is_literal(y)) or letters(x) == letters(y):
            errs.append("x and y must be literals of two letters")
        if sample["problem"] != tex(("imp", x, y)):
            errs.append("problem is not x → y")
        ask = p["ask"]
        if sample["prompt"] != f"Qual è la {ask} di questa implicazione?":
            errs.append("prompt does not ask the form")
        want = form(ask, x, y)

        def grade(o):
            f = parse(o["values"][0])
            if o["latex"] != tex(f) or f[0] != "imp":
                raise ValueError(f"bad option {o}")
            return f == want

        errs += choice_errors(ans, grade)
        # the three forms are always among the options
        shown = {parse(o["values"][0]) for o in ans.get("options", [])}
        if not all(form(k, x, y) in shown for k in ("inversa", "contraria", "contronominale")):
            errs.append("the three forms are not all among the options")
    else:
        pair = PAIRS[int(p["pair"])]
        name = p["form"]
        P, Q = ("v", "p"), ("v", "q")
        orig = " ".join(words(("imp", P, Q), pair))
        other = " ".join(words(form(name, P, Q), pair))
        want_text = f"L’implicazione è “{orig}”. Rispetto a questa, che cosa è la frase “{other}”?"
        if text_of(sample["problem"]) != want_text:
            errs.append(f"problem text {text_of(sample['problem'])!r}")

        def grade(o):
            if o["latex"] != f"\\text{{{o['values'][0]}}}" or o["values"][0] not in ("inversa", "contraria", "contronominale", "negazione"):
                raise ValueError(f"bad option {o}")
            return o["values"][0] == name

        errs += choice_errors(ans, grade)
    return p["variant"]


# ---------------------------------------------------------------------------
# Level 3: a column of a truth table


def shape_of(f):
    if f[0] == "imp" and is_literal(f[1]) and is_literal(f[2]):
        return "imp"
    if f[0] == "iff" and is_literal(f[1]) and is_literal(f[2]):
        return "iff"
    if f[0] == "not" and f[1][0] == "imp":
        return "neg"
    if f[0] in ("and", "or") and f[1][0] == "imp" and is_literal(f[2]):
        return f[0]
    return None


def check_level3(sample, errs):
    f = parse(sample["params"]["formula"])
    vs = ["p", "q"]
    if letters(f) != vs:
        errs.append("formula must use p and q")
    kind = shape_of(f)
    if kind is None or kind != sample["params"].get("case"):
        errs.append(f"shape {kind} != case {sample['params'].get('case')}")
    V = lambda b: "\\text{V}" if b else "\\text{F}"
    body = " \\\\ ".join(f"{V(r['p'])} & {V(r['q'])} & ?" for r in table_rows(vs))
    table = f"\\begin{{array}}{{c|c|c}} p & q & {tex(f)} \\\\ \\hline {body} \\end{{array}}"
    if sample["problem"] != f"\\begin{{array}}{{l}} {table} \\end{{array}}":
        errs.append("problem is not the table of the formula")
    truth = col(f, vs)

    def grade(o):
        vals = o["values"]
        if len(vals) != 4 or any(v not in ("0", "1") for v in vals):
            raise ValueError("a column has four values 0/1")
        if o["latex"] != "\\text{" + ", ".join("V" if v == "1" else "F" for v in vals) + "}":
            raise ValueError(f"latex {o['latex']}")
        return [v == "1" for v in vals] == truth

    errs += choice_errors(sample["answer"], grade)
    if sample["solution"] != "\\text{" + ", ".join("V" if b else "F" for b in truth) + "}":
        errs.append("solution is not the column")
    return kind


# ---------------------------------------------------------------------------
# Level 4: ⇒ and ⇔


def check_level4(sample, errs):
    ask = sample["params"]["ask"]
    if sample["problem"] != f"\\text{{Quale di queste affermazioni è {ask}?}}":
        errs.append("problem does not ask the question")

    def grade(o):
        rel, a, b = o["values"]
        a, b = parse(a), parse(b)
        if rel not in ("imp", "iff") or o["latex"] != meta_tex(rel, a, b):
            raise ValueError(f"bad option {o}")
        return taut((rel, a, b)) == (ask == "vera")

    errs += choice_errors(sample["answer"], grade)
    return ask


# ---------------------------------------------------------------------------
# Level 5: necessary and sufficient conditions

INT_CODES = ("eq", "pm", "sq")


def cond_holds(c, n):
    k = c["c"]
    a = int(c.get("a", 0))
    b = int(c.get("b", 0))
    if k == "mult":
        return n % a == 0
    if k == "pari":
        return n % 2 == 0
    if k == "dispari":
        return n % 2 != 0
    if k == "divisore":
        return n != 0 and a % n == 0
    if k == "gt":
        return n > a
    if k == "ge":
        return n >= a
    if k == "eq":
        return n == a
    if k == "pm":
        return n in (a, -a)
    if k == "sq":
        return n * n == a
    if k == "cifra0":
        return str(abs(n))[-1] == "0"
    if k == "mult2":
        return n % a == 0 and n % b == 0
    raise ValueError(f"unknown condition {c}")


def cond_text(c):
    k = c["c"]
    a, b = c.get("a"), c.get("b")
    return {
        "mult": f"$n$ è multiplo di ${a}$",
        "pari": "$n$ è pari",
        "dispari": "$n$ è dispari",
        "divisore": f"$n$ è un divisore di ${a}$",
        "gt": f"$n > {a}$",
        "ge": f"$n \\ge {a}$",
        "eq": f"$x = {a}$",
        "pm": f"$x = {a}$ o $x = -{a}$",
        "sq": f"$x^2 = {a}$",
        "cifra0": "l’ultima cifra di $n$ è $0$",
        "mult2": f"$n$ è multiplo di ${a}$ e di ${b}$",
    }[k]


NS_LABEL = {
    "sufficiente": "sufficiente ma non necessaria",
    "necessaria": "necessaria ma non sufficiente",
    "entrambe": "necessaria e sufficiente",
    "nessuna": "né necessaria né sufficiente",
}


def check_level5(sample, errs):
    p = sample["params"]
    A, B = p["A"], p["B"]
    integer = A["c"] in INT_CODES
    if (B["c"] in INT_CODES) != integer:
        errs.append("the two conditions are on different domains")
    dom = range(-300, 301) if integer else range(0, 3000)
    suff = all(cond_holds(B, n) for n in dom if cond_holds(A, n))
    nec = all(cond_holds(A, n) for n in dom if cond_holds(B, n))
    if not any(cond_holds(A, n) for n in dom) or not any(cond_holds(B, n) for n in dom):
        errs.append("a condition never true")
    kind = "entrambe" if suff and nec else "sufficiente" if suff else "necessaria" if nec else "nessuna"
    if kind != p["case"]:
        errs.append(f"case {p['case']} but the conditions give {kind}")
    v = "x" if integer else "n"
    want = f"“{cond_text(A)}” per “{cond_text(B)}”, con ${v}$ {'intero' if integer else 'naturale'}."
    if text_of(sample["problem"]) != want:
        errs.append(f"problem text {text_of(sample['problem'])!r} != {want!r}")
    if cond_text(A) == cond_text(B):
        errs.append("the same condition twice")
    for c in (A, B):
        for key in ("a", "b"):
            if key in c and abs(int(c[key])) > 81:
                errs.append("number too large")

    def grade(o):
        k = o["values"][0]
        if k not in NS_LABEL or o["latex"] != f"\\text{{{NS_LABEL[k]}}}":
            raise ValueError(f"bad option {o}")
        return k == kind

    errs += choice_errors(sample["answer"], grade)
    return kind


# ---------------------------------------------------------------------------
# Level 6: truth sets


def open_holds(c, x):
    k = c["c"]
    a = int(c.get("a", 0))
    b = int(c.get("b", 0))
    return {
        "pari": x % 2 == 0,
        "dispari": x % 2 == 1,
        "mult": a > 0 and x % a == 0,
        "divisore": a % x == 0,
        "gt": x > a,
        "ge": x >= a,
        "lt": x < a,
        "le": x <= a,
        "primo": is_prime(x),
        "mult2": a > 0 and b > 0 and x % a == 0 and x % b == 0,
    }[k]


def open_tex(c):
    a, b = c.get("a"), c.get("b")
    return {
        "pari": "x \\text{ è pari}",
        "dispari": "x \\text{ è dispari}",
        "mult": f"x \\text{{ è multiplo di }} {a}",
        "divisore": f"x \\text{{ è un divisore di }} {a}",
        "gt": f"x > {a}",
        "ge": f"x \\ge {a}",
        "lt": f"x < {a}",
        "le": f"x \\le {a}",
        "primo": "x \\text{ è primo}",
        "mult2": f"x \\text{{ è multiplo di }} {a} \\text{{ e di }} {b}",
    }[c["c"]]


REL_TEX = {
    "pq": "\\text{solo } p(x) \\Rightarrow q(x)",
    "qp": "\\text{solo } q(x) \\Rightarrow p(x)",
    "eq": "p(x) \\Leftrightarrow q(x)",
    "nessuna": "\\text{nessuna implicazione}",
}


def check_level6(sample, errs):
    p = sample["params"]
    n = int(p["N"])
    if n not in (10, 12, 15, 20):
        errs.append(f"N = {n}")
    U = range(1, n + 1)
    Vp = {x for x in U if open_holds(p["p"], x)}
    Vq = {x for x in U if open_holds(p["q"], x)}
    if not Vp or not Vq or len(Vp) == n or len(Vq) == n:
        errs.append("truth set empty or all of U")
    rel = "eq" if Vp == Vq else "pq" if Vp < Vq else "qp" if Vq < Vp else "nessuna"
    if rel != p["case"]:
        errs.append(f"case {p['case']} but the sets give {rel}")
    head = [f"U = \\{{1, 2, 3, \\dots, {n}\\}}", f"p(x)\\text{{: }} {open_tex(p['p'])}", f"q(x)\\text{{: }} {open_tex(p['q'])}"]
    variant = p["variant"]
    if variant == "relazione":
        if sample["problem"] != "\\begin{array}{l} " + " \\\\ ".join(head) + " \\end{array}":
            errs.append("problem is not U, p(x), q(x)")

        def grade(o):
            k = o["values"][0]
            if k not in REL_TEX or o["latex"] != REL_TEX[k]:
                raise ValueError(f"bad option {o}")
            return k == rel

        errs += choice_errors(sample["answer"], grade)
    elif variant == "controesempi":
        if sample["problem"] != "\\begin{array}{l} " + " \\\\ ".join(head + ["p(x) \\Rightarrow q(x)"]) + " \\end{array}":
            errs.append("problem is not U, p(x), q(x) and the implication")
        truth = Vp - Vq
        if not truth:
            errs.append("no counterexample")
        ans = sample["answer"]
        if ans.get("kind") != "set" or [int(v) for v in ans["values"]] != sorted(truth):
            errs.append(f"answer {ans.get('values')} != {sorted(truth)}")
        if ans.get("latex") != set_tex(truth):
            errs.append("answer latex")
        errs += choice_errors(sample.get("choice"), set_option_truth(truth))
    else:
        errs.append(f"unknown variant {variant}")
    return f"{variant}:{rel}"


# ---------------------------------------------------------------------------
# Level 7: negation


def check_level7(sample, errs):
    p = sample["params"]
    variant = p["variant"]
    if variant == "parole":
        pair = PAIRS[int(p["pair"])]
        orig = ("imp", ("v", "p"), ("v", "q"))
        if text_of(sample["problem"]) != f"“{' '.join(words(orig, pair))}”":
            errs.append("problem is not the sentence")
    else:
        orig = parse(p["formula"])
        if sample["problem"] != tex(orig):
            errs.append("problem is not the formula")
        if orig[0] != "imp":
            errs.append("not an implication")
        if variant == "simboli" and not (is_literal(orig[1]) and is_literal(orig[2])):
            errs.append("simboli: premise and consequence are literals")
        if variant == "de morgan" and not (is_literal(orig[1]) and orig[2][0] in ("and", "or") and letters(orig) == ["p", "q", "r"]):
            errs.append("de morgan: consequence with ∧ or ∨ of q and r")
    target = ("not", orig)

    def grade(o):
        f = parse(o["values"][0])
        if variant == "parole":
            a, b = words(f, pair)
            want = f"\\begin{{gathered}} \\text{{{a}}} \\\\ \\text{{{b}}} \\end{{gathered}}"
        else:
            want = tex(f)
        if o["latex"] != want:
            raise ValueError(f"latex {o['latex']!r} != {want!r}")
        return equiv(f, target)

    errs += choice_errors(sample["answer"], grade)
    # the right option is written as the lesson writes it: premise and the negated consequence, with ∧
    ch = sample["answer"]
    if ch.get("kind") == "choice":
        right = parse(ch["options"][ch["correct"]]["values"][0])
        if right[0] != "and" or right[1] != orig[1]:
            errs.append("the negation is not written as premise ∧ ¬consequence")
    return variant


CHECKS = {1: check_level1, 2: check_level2, 3: check_level3, 4: check_level4, 5: check_level5, 6: check_level6, 7: check_level7}


def check(sample):
    errs = base_errors(sample)
    lvl = sample["level"]
    if lvl not in CHECKS:
        return errs + [f"unknown level {lvl}"], None
    kind = CHECKS[lvl](sample, errs)
    if lvl != 6 and sample["answer"].get("kind") != "choice":
        errs.append("answer must be a choice")
    if lvl != 6 and sample.get("choice") not in (None, sample["answer"]):
        errs.append("choice differs from the answer")
    return errs, kind
