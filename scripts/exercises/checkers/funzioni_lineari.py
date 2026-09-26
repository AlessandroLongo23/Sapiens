"""funzioni-lineari (Proporzionalità diretta e inversa), from specs/exercises/funzioni-lineari.md.

Written from the spec, not from the generator. The tables are read back from the LaTeX of the
problem (and compared with params); the kind of a table is found again with the test of the lesson
(ratio, product, ratio with the square, increments); the formulas of level 1 and the options of
levels 3 and 5 are parsed from LaTeX into SymPy; the word problems are solved again from the data
in params, and the data must be written in the text. Every number is an exact Rational.
"""
import re

from sympy import Poly, Rational, Symbol, pi, simplify, solve, sympify

X = Symbol("x")
Y = Symbol("y")

KINDS = ["diretta", "inversa", "quadratica", "lineare", "nessuno"]
LABELS = {
    "diretta": r"\text{proporzionalità diretta}",
    "inversa": r"\text{proporzionalità inversa}",
    "quadratica": r"\text{proporzionalità quadratica}",
    "lineare": r"\text{lineare, non proporzionale}",
    "nessuno": r"\text{nessuno dei quattro tipi}",
}

CASE_RANGES = {
    1: {k: (0.18, 0.32) for k in KINDS[:4]},
    2: {"diretta": (0.40, 0.60), "inversa": (0.40, 0.60)},
    3: {"diretta": (0.40, 0.60), "inversa": (0.40, 0.60)},
    4: {**{k: (0.14, 0.26) for k in KINDS[:4]}, "nessuno": (0.05, 0.16), "trappola": (0.05, 0.16)},
    5: {"equidistanti": (0.22, 0.45), "passi diversi": (0.55, 0.78)},
    6: {"diretta": (0.40, 0.60), "inversa": (0.40, 0.60)},
    7: {"cantiere": (0.40, 0.60), "pizza": (0.18, 0.32), "vernice": (0.18, 0.32)},
}

# Level 1 situations: the kind each one describes, from the lesson.
STORY_KIND = {
    "mele": "diretta", "auto": "diretta", "stampante": "diretta", "perimetro": "diretta",
    "viaggio": "inversa", "operai": "inversa", "rettangolo": "inversa", "regalo": "inversa",
    "area-quadrato": "quadratica", "stoffa": "quadratica", "pizza": "quadratica",
    "taxi": "lineare", "candela": "lineare", "palestra": "lineare", "vasca": "lineare",
}


# ---------------------------------------------------------------------------
# Numbers and LaTeX

def rat(s):
    s = str(s).strip()
    if not re.fullmatch(r"-?\d+(/\d+)?", s):
        raise ValueError(f"not an exact rational: {s!r}")
    return Rational(s)


def decimal_places(r):
    """Number of decimals of a finite decimal, None if the decimal is periodic."""
    d = r.q
    for f in (2, 5):
        while d % f == 0:
            d //= f
    if d != 1:
        return None
    n = 0
    while (r * 10**n).q != 1:
        n += 1
    return n


def dec_value(tex):
    """'7{,}25' or '-3' as a Rational; None if it is not a plain decimal."""
    m = re.fullmatch(r"(-?)(\d+)(?:\{,\}(\d+))?", tex.strip())
    if not m:
        return None
    v = Rational(int(m.group(2)))
    if m.group(3):
        v += Rational(int(m.group(3)), 10 ** len(m.group(3)))
    return -v if m.group(1) else v


def dec_tex(r, money=False):
    """How the spec writes a number: shortest decimal; money with two decimals when not whole."""
    places = decimal_places(r)
    if places is None:
        return None
    if money and places:
        places = 2
    sign = "-" if r < 0 else ""
    a = abs(r)
    whole = int(a.p // a.q)
    if places == 0:
        return f"{sign}{whole}"
    frac = int((a - whole) * 10**places)
    return f"{sign}{whole}{{,}}{frac:0{places}d}"


def to_sympy(tex):
    """A formula of this generator in SymPy: \\dfrac, {,}, \\cdot, x^2, implicit products, \\pi."""
    s = tex.strip()
    s = re.sub(r"(\d+)\{,\}(\d+)", lambda m: f"({int(m.group(1) + m.group(2))}/{10 ** len(m.group(2))})", s)
    for _ in range(4):
        s = re.sub(r"\\dfrac\{([^{}]*)\}\{([^{}]*)\}", r"((\1)/(\2))", s)
    s = s.replace(r"\left(", "(").replace(r"\right)", ")").replace(r"\cdot", "*").replace(r"\pi", "pi")
    s = s.replace("^", "**")
    s = re.sub(r"(\d|\))\s*(x|y|pi|\()", r"\1*\2", s)
    if not re.fullmatch(r"[0-9xy+\-*/(). pi]*", s):
        raise ValueError(f"unreadable formula {tex!r}")
    return sympify(s, locals={"x": X, "y": Y, "pi": pi})


def y_of(tex):
    """y as a function of x from an equation 'lhs = rhs'."""
    lhs, rhs = tex.split("=")
    sol = solve(to_sympy(lhs) - to_sympy(rhs), Y)
    if len(sol) != 1:
        raise ValueError(f"cannot solve for y: {tex!r}")
    return simplify(sol[0])


def kind_of_formula(f):
    for kind, g in (("diretta", f / X), ("inversa", f * X), ("quadratica", f / X**2)):
        g = simplify(g)
        if not g.has(X) and g != 0:
            return kind
    if f.is_polynomial(X):
        P = Poly(f, X)
        if P.degree() == 1 and P.coeff_monomial(1) != 0:
            return "lineare"
    return "nessuno"


def classify(xs, ys):
    """The lesson's test, in its order."""
    same = lambda vals: all(v == vals[0] for v in vals)
    if same([y / x for x, y in zip(xs, ys)]) and ys[0] != 0:
        return "diretta"
    if same([x * y for x, y in zip(xs, ys)]):
        return "inversa"
    if same([y / x**2 for x, y in zip(xs, ys)]) and ys[0] != 0:
        return "quadratica"
    slopes = [(ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]) for i in range(len(xs) - 1)]
    if len(xs) >= 3 and same(slopes):
        return "lineare"
    return "nessuno"


TABLE = re.compile(r"\\begin\{array\}\{c\|(c+)\} x & (.*?) \\\\ \\hline y & (.*?) \\end\{array\}")


def read_table(problem):
    m = TABLE.search(problem)
    if not m:
        raise ValueError("no table in the problem")
    xs = [c.strip() for c in m.group(2).split("&")]
    ys = [c.strip() for c in m.group(3).split("&")]
    if not len(xs) == len(ys) == len(m.group(1)):
        raise ValueError("table with rows of different length")
    cell = lambda c: None if c == "?" else dec_value(c)
    for c in xs + ys:
        if c != "?" and dec_value(c) is None:
            raise ValueError(f"cell {c!r} is not a decimal")
    return [cell(c) for c in xs], [cell(c) for c in ys]


def prose(tex):
    return " ".join(re.findall(r"\\text\{((?:[^{}]|\{[^{}]*\})*)\}", tex))


def says(text, r, money=False):
    """The number r is written in the text (as a decimal with the comma)."""
    t = dec_tex(r, money)
    if t is None:
        return False
    if "{" in t:
        return f"${t}$" in text
    return re.search(rf"(?<![\d,]){re.escape(t)}(?![\d{{]|\{{,\}})", text) is not None


# ---------------------------------------------------------------------------
# Choices

def check_kind_choice(ch, truth, required=()):
    errs = []
    opts = ch.get("options", [])
    codes = [o["values"][0] if o.get("values") else None for o in opts]
    if len(opts) != 4 or len(set(codes)) != 4:
        errs.append(f"need four distinct kinds: {codes}")
    for o, c in zip(opts, codes):
        if c not in LABELS or o.get("latex") != LABELS[c]:
            errs.append(f"option {c!r} written {o.get('latex')!r}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or codes[idx] != truth:
        errs.append(f"correct option is not {truth}")
    if truth not in codes or codes.count(truth) != 1:
        errs.append("truth not exactly once among the options")
    for r in required:
        if r and r not in codes:
            errs.append(f"the lure {r} is missing from the options")
    return errs


def check_number_choice(ch, truth, money):
    errs = []
    opts = ch.get("options", [])
    vals = []
    for o in opts:
        v = rat(o["values"][0])
        vals.append(v)
        if v <= 0:
            errs.append(f"non-positive option {v}")
        want = dec_tex(v, money)
        if want is None or o.get("latex") != want:
            errs.append(f"option {v} written {o.get('latex')!r}, expected {want!r}")
    if len(opts) != 4 or len(set(vals)) != 4:
        errs.append(f"need four distinct options: {vals}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or vals[idx] != truth:
        errs.append("choice.correct does not point to the answer")
    if vals.count(truth) != 1:
        errs.append("answer not exactly once among the options")
    return errs


def check_formula_choice(ch, truth):
    errs = []
    opts = ch.get("options", [])
    fs = []
    for o in opts:
        tex = o.get("latex", "")
        if not tex.startswith("y = "):
            errs.append(f"option not 'y = ...': {tex!r}")
            fs.append(None)
            continue
        shown = y_of(tex)
        val = sympify(o["values"][0], locals={"x": X})
        if simplify(shown - val) != 0:
            errs.append(f"option {tex!r} != values {o['values']}")
        fs.append(shown)
    ok = [f is not None and simplify(f - truth) == 0 for f in fs]
    if len(opts) != 4:
        errs.append("need four options")
    for i in range(len(fs)):
        for j in range(i):
            if fs[i] is not None and fs[j] is not None and simplify(fs[i] - fs[j]) == 0:
                errs.append("two options are the same function")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or not ok[idx]:
        errs.append("choice.correct is not the formula of the table")
    if sum(ok) != 1:
        errs.append(f"{sum(ok)} options equal the answer")
    return errs


# ---------------------------------------------------------------------------
# Levels

def check_level1(s, p):
    errs = []
    if p["mode"] == "formula":
        f = y_of(s["problem"])
        truth = kind_of_formula(f)
        if truth == "nessuno":
            errs.append(f"formula {s['problem']!r} is of none of the four kinds")
        if re.search(r"(?<![\d}])1\s*x|(?<![\d}])0x|\+\s*-|-\s*-", s["problem"]):
            errs.append(f"badly written formula {s['problem']!r}")
    else:
        story = p.get("story")
        truth = STORY_KIND.get(story)
        if truth is None:
            return [f"unknown story {story!r}"], None
        text = prose(s["problem"])
        for key in ("p", "v", "n", "d", "g", "A", "S", "F", "m", "h", "a", "L", "r"):
            if key in p and key not in ("mode", "story", "case"):
                money = story in ("mele", "stoffa", "taxi") and key in ("p", "m")
                if not says(text, rat(p[key]), money):
                    errs.append(f"{key} = {p[key]} not in the text")
        if story == "candela" and rat(p["h"]) <= 3 * rat(p["a"]):
            errs.append("candle too short: the height must not halve after doubling the hours")
    if p.get("case") != truth:
        errs.append(f"params.case {p.get('case')} but the link is {truth}")
    errs += check_kind_choice(s["answer"], truth)
    return errs, truth


def check_level2(s, p):
    errs = []
    xs, ys = read_table(s["problem"])
    if [None if v is None else str(v) for v in xs] != [None if c == "?" else str(rat(c)) for c in p["xs"]] or [
        None if v is None else str(v) for v in ys
    ] != [None if c == "?" else str(rat(c)) for c in p["ys"]]:
        errs.append("table in the problem differs from params")
    holes = [i for i, v in enumerate(xs + ys) if v is None]
    if len(holes) != 1:
        return errs + [f"{len(holes)} missing values, expected 1"], None
    kind = p["kind"]
    text = prose(s["problem"])
    word = {"diretta": "direttamente proporzionali", "inversa": "inversamente proporzionali"}[kind]
    if word not in text:
        errs.append("the text does not state the kind")
    pairs = [(x, y) for x, y in zip(xs, ys) if x is not None and y is not None]
    if len(pairs) < 2:
        errs.append("fewer than two complete pairs")
    law = (lambda x, y: y / x) if kind == "diretta" else (lambda x, y: x * y)
    ks = {law(x, y) for x, y in pairs}
    if len(ks) != 1:
        errs.append("the complete pairs do not share the constant")
    k = pairs[0][1] / pairs[0][0] if kind == "diretta" else pairs[0][0] * pairs[0][1]
    h = holes[0]
    n = len(xs)
    if h < n:
        y = ys[h]
        truth = y / k if kind == "diretta" else k / y
    else:
        x = xs[h - n]
        truth = k * x if kind == "diretta" else k / x
    if any(v is not None and v <= 0 for v in xs):
        errs.append("x must be positive")
    if rat(s["answer"]["value"]) != truth:
        errs.append(f"answer {s['answer']['value']} != {truth}")
    places = decimal_places(truth)
    if truth <= 0 or places is None or places > 2:
        errs.append(f"answer {truth} is not a positive decimal with at most two decimals")
    if truth in [v for v in xs + ys if v is not None]:
        errs.append("the answer is already in the table")
    if s.get("choice"):
        errs += check_number_choice(s["choice"], truth, False)
    else:
        errs.append("no choice")
    return errs, kind


def check_level3(s, p):
    errs = []
    xs, ys = read_table(s["problem"])
    if [str(v) for v in xs] != [str(rat(c)) for c in p["xs"]] or [str(v) for v in ys] != [str(rat(c)) for c in p["ys"]]:
        errs.append("table differs from params")
    kind = classify(xs, ys)
    if kind not in ("diretta", "inversa"):
        return errs + [f"table is {kind}"], None
    if kind != p["kind"]:
        errs.append(f"params.kind {p['kind']} but the table is {kind}")
    if len(xs) < 3 or len(set(xs)) != len(xs) or any(x <= 0 for x in xs):
        errs.append("need at least three distinct positive x")
    k = ys[0] / xs[0] if kind == "diretta" else xs[0] * ys[0]
    truth = k * X if kind == "diretta" else k / X
    a = s["answer"]
    if a.get("kind") != "expression":
        errs.append("answer must be an expression")
    elif simplify(sympify(a["value"], locals={"x": X}) - truth) != 0 or simplify(y_of(a["latex"]) - truth) != 0:
        errs.append(f"answer {a['value']} / {a['latex']} != {truth}")
    if s.get("choice"):
        errs += check_formula_choice(s["choice"], truth)
    else:
        errs.append("no choice")
    return errs, kind


def check_level4(s, p):
    errs = []
    xs, ys = read_table(s["problem"])
    if [str(v) for v in xs] != [str(rat(c)) for c in p["xs"]] or [str(v) for v in ys] != [str(rat(c)) for c in p["ys"]]:
        errs.append("table differs from params")
    if any(x <= 0 for x in xs) or xs != sorted(set(xs)):
        errs.append("x must be positive and increasing")
    if len(xs) < 3:
        errs.append("at least three pairs")
    truth = classify(xs, ys)
    if truth != p["kind"]:
        errs.append(f"params.kind {p['kind']} but the table is {truth}")
    trap = p.get("trap") or None
    lure = None
    if trap:
        lure = trap
        if truth != "nessuno":
            errs.append("a trap table must be of none of the kinds")
        test = {"diretta": lambda x, y: y / x, "inversa": lambda x, y: x * y, "quadratica": lambda x, y: y / x**2}[trap]
        if test(xs[0], ys[0]) != test(xs[1], ys[1]):
            errs.append(f"trap {trap}: the first two pairs do not share the {trap} test")
    elif truth == "lineare":
        lure = "diretta" if ys[-1] > ys[0] else "inversa"
    elif truth == "quadratica":
        lure = "diretta"
    if truth == "lineare":
        gaps = {xs[i + 1] - xs[i] for i in range(len(xs) - 1)}
        if gaps != {1}:
            errs.append("level 4 linear tables go up by 1")
    case = "trappola" if trap else truth
    if p.get("case") != case:
        errs.append(f"params.case {p.get('case')} expected {case}")
    for v in ys:
        pl = decimal_places(v)
        if pl is None or pl > 2:
            errs.append(f"y = {v} is not a short decimal")
    errs += check_kind_choice(s["answer"], truth, (lure,))
    return errs, case


def check_level5(s, p):
    errs = []
    xs, ys = read_table(s["problem"])
    if [str(v) for v in xs] != [str(rat(c)) for c in p["xs"]] or [str(v) for v in ys] != [str(rat(c)) for c in p["ys"]]:
        errs.append("table differs from params")
    if classify(xs, ys) != "lineare":
        errs.append(f"table is {classify(xs, ys)}, not linear")
    m = (ys[1] - ys[0]) / (xs[1] - xs[0])
    q = ys[0] - m * xs[0]
    if not (m.is_integer and q.is_integer and m != 0 and q != 0):
        errs.append(f"m = {m}, q = {q}: need nonzero integers")
    truth = m * X + q
    gaps = {xs[i + 1] - xs[i] for i in range(len(xs) - 1)}
    case = "equidistanti" if len(gaps) == 1 else "passi diversi"
    if p.get("case") != case:
        errs.append(f"params.case {p.get('case')} but x are {case}")
    if any(x <= 0 for x in xs):
        errs.append("x must be positive")
    a = s["answer"]
    if simplify(sympify(a["value"], locals={"x": X}) - truth) != 0 or simplify(y_of(a["latex"]) - truth) != 0:
        errs.append(f"answer {a['value']} != {truth}")
    if s.get("choice"):
        errs += check_formula_choice(s["choice"], truth)
    else:
        errs.append("no choice")
    return errs, case


def hours_words(h):
    whole = int(h)
    return f"{whole} or{'a' if whole == 1 else 'e'}" + (" e mezza" if h != whole else "")


def solve_problem(p):
    """(answer, money, numbers the text must state (value, money), words the text must contain, dir)."""
    n = lambda k: rat(p[k])
    st = p["story"]
    if st == "quaderni":
        u = n("c1") / n("n1")
        return u * n("n2"), True, [(n("n1"), False), (n("n2"), False), (n("c1"), True)], [p["item"]], "diretta"
    if st == "rubinetto":
        return n("L1") / n("t1") * n("t2"), False, [(n("t1"), False), (n("t2"), False), (n("L1"), False)], ["litri"], "diretta"
    if st == "paga":
        return n("E1") / n("h1") * n("h2"), True, [(n("h1"), False), (n("h2"), False), (n("E1"), True)], ["ore"], "diretta"
    if st == "velocita-tempo":
        return n("v1") * n("t1") / n("v2"), False, [(n("v1"), False), (n("v2"), False)], [hours_words(n("t1"))], "inversa"
    if st == "velocita-ore":
        return n("v1") * n("t1") / n("t2"), False, [(n("v1"), False)], [hours_words(n("t1")), hours_words(n("t2"))], "inversa"
    if st == "operai":
        return n("n1") * n("g1") / n("n2"), False, [(n("n1"), False), (n("g1"), False), (n("n2"), False)], ["operai"], "inversa"
    if st == "rubinetti":
        return n("r1") * n("m1") / n("r2"), False, [(n("r1"), False), (n("m1"), False), (n("r2"), False)], ["rubinetti"], "inversa"
    if st == "scatole":
        return n("s1") * n("c1") / n("c2"), False, [(n("s1"), False), (n("c1"), False), (n("c2"), False)], ["scatole"], "inversa"
    if st == "cantiere":
        N, G, d, r = n("N"), n("G"), n("d"), n("r")
        N2 = N - r if p["leave"] == "1" else N + r
        rest = N * (G - d) / N2
        ans = rest + d if p["ask"] == "totale" else rest
        words = ["spostati" if p["leave"] == "1" else "arrivano", "in tutto" if p["ask"] == "totale" else "ancora"]
        return ans, False, [(N, False), (G, False), (d, False), (r, False)], words, "due tempi"
    if st == "pizza":
        ratio = n("d2") / n("d1")
        return n("p1") * ratio**2, True, [(n("d1"), False), (n("d2"), False), (n("p1"), True)], ["superficie"], "quadratica"
    if st == "vernice":
        ratio = n("l2") / n("l1")
        return n("v1") * ratio**2, False, [(n("l1"), False), (n("l2"), False), (n("v1"), False)], ["quadrato"], "quadratica"
    raise ValueError(f"unknown story {st!r}")


def check_problem(s, p, level):
    errs = []
    stories6 = {"quaderni", "rubinetto", "paga", "velocita-tempo", "velocita-ore", "operai", "rubinetti", "scatole"}
    stories7 = {"cantiere", "pizza", "vernice"}
    if p["story"] not in (stories6 if level == 6 else stories7):
        return [f"story {p['story']} not in level {level}"], None
    truth, money, numbers, words, direction = solve_problem(p)
    text = prose(s["problem"])
    for v, mny in numbers:
        if not says(text, v, mny):
            errs.append(f"{v} not written in the text")
    for w in words:
        if w not in text:
            errs.append(f"{w!r} not in the text")
    if p.get("dir") != direction:
        errs.append(f"params.dir {p.get('dir')} but the story is {direction}")
    if rat(s["answer"]["value"]) != truth:
        errs.append(f"answer {s['answer']['value']} != {truth}")
    places = decimal_places(truth)
    if truth <= 0 or places is None or places > 2:
        errs.append(f"answer {truth} is not a positive decimal with at most two decimals")
    if p["story"] == "velocita-tempo" and (truth * 2).q != 1:
        errs.append("travel time must be whole or half hours")
    if p["story"] in ("operai", "rubinetti") and (truth * 10).q != 1:
        errs.append("at most one decimal")
    if p["story"] in ("scatole", "velocita-ore") and not truth.is_integer:
        errs.append("answer must be a whole number")
    if p["story"] == "cantiere" and (truth * 2).q != 1:
        errs.append("days must be whole or half")
    if truth in [v for v, _ in numbers]:
        errs.append("the answer is a number of the text")
    if bool(p.get("money")) != money:
        errs.append("params.money wrong")
    if s.get("choice"):
        errs += check_number_choice(s["choice"], truth, money)
    else:
        errs.append("no choice")
    case = direction if level == 6 else p["story"]
    if p.get("case") != case:
        errs.append(f"params.case {p.get('case')} expected {case}")
    return errs, case


def check(sample):
    p = sample["params"]
    lvl = sample["level"]
    if not sample.get("steps") or not sample.get("solution"):
        return ["no steps or no solution"], None
    if re.search(r"—|piuttosto che|rather than", sample["problem"] + " ".join(sample["steps"])):
        return ["forbidden words"], None
    if lvl == 1:
        return check_level1(sample, p)
    if lvl == 2:
        return check_level2(sample, p)
    if lvl == 3:
        return check_level3(sample, p)
    if lvl == 4:
        return check_level4(sample, p)
    if lvl == 5:
        return check_level5(sample, p)
    if lvl in (6, 7):
        return check_problem(sample, p, lvl)
    return [f"unknown level {lvl}"], None
