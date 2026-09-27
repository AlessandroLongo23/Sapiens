"""Checker for equazioni-secondo-grado-problemi, written from specs/exercises/equazioni-secondo-grado-problemi.md.

For every sample it rebuilds the equation from the data of the story in params (the way the text states
them, not from the LaTeX the generator wrote), solves it with SymPy, applies the limitations of the unknown
that the text implies and computes the answer: the number asked (levels 1, 3, 5, 6, 7) or the set of answers
of the problem (levels 2 and 4: one pair, two answers, an irrational side, or none). Then it checks the
answer and the options (each read back from its LaTeX, exactly one right, radicals simplified), the normal
form and the roots in params, the equation in params (read from its LaTeX: same solutions), the steps (the
equation, the rejected solutions, the check on the text) and that the text states the data.
"""
import re

from sympy import Integer, Poly, Rational, Symbol, expand, factorint, fraction, solve, sympify, together

X = Symbol("x")
T = Symbol("t")
V = Symbol("v")
VARS = {"x": X, "t": T, "v": V}

STORIES = {
    1: ["consecutivi", "quadrato", "quadrati"],
    2: ["somma-prodotto", "consecutivi-interi", "quadrato-intero", "sasso"],
    3: ["rettangolo", "triangolo", "rombo"],
    4: ["triangolo-irr", "rettangolo-irr", "perimetro-area"],
    5: ["cornice", "pitagora"],
    6: ["moto-veloce", "moto-lento", "lavoro"],
    7: ["aumenti", "sconti"],
}
CHOICE_LEVELS = (2, 4)
IMPOSSIBLE = "impossibile"
TIMES = {2: "doppio", 3: "triplo", 4: "quadruplo", 5: "quintuplo"}


def _even(n, slack=0.10):
    return (max(0.0, 1 / n - slack), 1 / n + slack)


CASE_RANGES = {lvl: {s: _even(len(ss)) for s in ss} for lvl, ss in STORIES.items() if lvl not in CHOICE_LEVELS}
CASE_RANGES[2] = {"una": (0.15, 0.34), "due": (0.40, 0.60), "nessuna": (0.16, 0.36)}
CASE_RANGES[4] = {"irrazionale": (0.60, 0.80), "impossibile": (0.20, 0.40)}

FORBIDDEN = [
    ("1x", re.compile(r"(?<![\d},])1\s*[xtv](?![a-z])")),
    ("0x", re.compile(r"(?<![\d},])0\s*[xtv](?![a-z])")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"-\s*-")),
    ("+ +", re.compile(r"\+\s*\+")),
]


# ---------------------------------------------------------------------------
# Reading LaTeX


def text_groups(tex):
    out, i = [], 0
    while True:
        j = tex.find("\\text{", i)
        if j < 0:
            return out
        k, depth = j + 6, 1
        while depth:
            if tex[k] == "{":
                depth += 1
            elif tex[k] == "}":
                depth -= 1
            k += 1
        out.append(tex[j + 6 : k - 1])
        i = k


def prose(tex):
    s = " ".join(text_groups(tex))
    s = s.replace("$", "")
    return re.sub(r"\s+", " ", s)


def _fracs(s):
    while "\\frac" in s:
        s2 = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"((\1)/(\2))", s)
        if s2 == s:
            raise ValueError(f"unreadable fraction in {s!r}")
        s = s2
    return s


def latex_expr(s):
    """An equation side: numbers, x/t/v, \\frac, \\left( \\right), powers, implicit products."""
    s = s.replace("\\left(", "(").replace("\\right)", ")").replace("\\cdot", "*")
    s = re.sub(r"(\d+)\{,\}(\d+)", lambda m: f"({int(m.group(1) + m.group(2))}/{10 ** len(m.group(2))})", s)
    s = _fracs(s)
    s = s.replace("^", "**")
    s = re.sub(r"(\d|\)|\b[xtv])\s*(?=[xtv(])", r"\1*", s)
    if not re.fullmatch(r"[0-9xtv+\-*/() .]*", s):
        raise ValueError(f"unexpected characters in {s!r}")
    return sympify(s, locals=VARS)


def tex_num(s):
    """A number of an option: 12, -\\frac{7}{2}, 10{,}5, \\sqrt{13} - 1, \\frac{11 - \\sqrt{47}}{2}, 20\\%."""
    s = s.strip().replace("\\%", "")
    s = re.sub(r"(\d+)\{,\}(\d+)", lambda m: f"({int(m.group(1) + m.group(2))}/{10 ** len(m.group(2))})", s)
    s = re.sub(r"(\d+)\\sqrt\{(\d+)\}", r"\1*sqrt(\2)", s)
    s = re.sub(r"\\sqrt\{(\d+)\}", r"sqrt(\1)", s)
    s = _fracs(s)
    if not re.fullmatch(r"[0-9sqrt+\-*/() .]*", s):
        raise ValueError(f"not a number: {s!r}")
    return sympify(s)


def key(v):
    return round(float(v), 9)


def option_units(latex):
    """The answers an option states, as a set of tuples (a pair, or a single number); None for impossible."""
    s = latex.replace("\\begin{gathered}", " ").replace("\\end{gathered}", " ").replace("\\\\", " ")
    if s.strip() == "\\text{Il problema è impossibile}":
        return None
    if "dopo" in s:
        found = re.findall(r"dopo \}\s*(.*?)\s*(?=\\text\{ s)", s)
        if not found:
            raise ValueError(f"unreadable times {latex!r}")
        return {(tex_num(f),) for f in found}
    out = set()
    for g in re.split(r"\\text\{ ?oppure \}", s):
        parts = re.split(r"\\text\{ e \}", g)
        out.add(tuple(sorted((tex_num(p) for p in parts), key=float)))
    return out


def value_units(values):
    if values == [IMPOSSIBLE]:
        return None
    return {tuple(sorted((sympify(x) for x in v.split(";")), key=float)) for v in values}


def ukeys(units):
    return None if units is None else frozenset(tuple(key(x) for x in u) for u in units)


def squarefree(n):
    return all(e == 1 for e in factorint(int(n)).values())


def radical_errors(tex):
    errs = []
    for m in re.finditer(r"\\sqrt\{(\d+)\}", tex):
        if not squarefree(m.group(1)):
            errs.append(f"radical not simplified: \\sqrt{{{m.group(1)}}}")
    if re.search(r"\\frac\{[^{}]*\}\{[^{}]*\\sqrt", tex):
        errs.append("radical in a denominator")
    return errs


# ---------------------------------------------------------------------------
# The stories: (expression = 0 in the variable, variable, acceptable(sol), result(accepted solutions),
# phrases of the text, numbers of the text). `result` gives the number asked on the number levels and the
# set of answers (tuples) on the choice levels.


def is_int(s):
    return s.is_rational and s.is_integer


def story(p):
    st = p["story"]
    n = lambda k: int(p[k])  # noqa: E731
    if st == "consecutivi":
        kind, P = p["kind"], n("P")
        step = 1 if kind == "naturali" else 2
        par = {"naturali": None, "pari": 0, "dispari": 1}[kind]
        acc = lambda s: is_int(s) and s > 0 and (par is None or s % 2 == par)  # noqa: E731
        res = lambda xs: xs[0] + (step if p["asked"] == "grande" else 0)  # noqa: E731
        noun = "due numeri naturali consecutivi" if kind == "naturali" else f"due numeri {kind} consecutivi positivi"
        return X * (X + step) - P, X, acc, res, [f"Il prodotto di {noun} è {P}", f"il più {p['asked']}"], [P]
    if st in ("quadrato", "quadrato-intero"):
        k, c, form = n("k"), n("c"), p["form"]
        expr = X**2 - (k * X + c) if form == "supera" else X**2 + k * X - c
        nat = st == "quadrato"
        acc = (lambda s: is_int(s) and s >= 0) if nat else is_int
        res = (lambda xs: xs[0]) if nat else (lambda xs: {(s,) for s in xs})
        word = "naturale" if nat else "intero"
        phr = [f"Il quadrato di un numero {word} supera il suo {TIMES[k]} di {c}."] if form == "supera" else [f"Se al quadrato di un numero {word} aggiungi il suo {TIMES[k]}, ottieni {c}."]
        return expr, X, acc, res, phr, [k, c]
    if st == "quadrati":
        S = n("S")
        return X**2 + (X + 1) ** 2 - S, X, lambda s: is_int(s) and s >= 0, lambda xs: xs[0] + (1 if p["asked"] == "grande" else 0), [f"La somma dei quadrati di due numeri naturali consecutivi è {S}", f"il più {p['asked']}"], [S]
    if st == "somma-prodotto":
        s_, pr = n("s"), n("p")
        return X * (s_ - X) - pr, X, lambda s: True, lambda xs: {tuple(sorted((x, s_ - x), key=float)) for x in xs}, [f"somma {s_} e prodotto {pr}"], [s_, pr]
    if st == "consecutivi-interi":
        P = n("P")
        return X * (X + 1) - P, X, is_int, lambda xs: {(x, x + 1) for x in xs}, [f"Il prodotto di due numeri interi consecutivi è {P}", "Quali sono i due numeri?"], [P]
    if st == "sasso":
        v, H = n("v"), n("H")
        return v * T - 5 * T**2 - H, T, lambda s: s > 0, lambda xs: {(x,) for x in xs}, [f"altezza di {v}t - 5t^2 metri", f"a {H} m di altezza"], [v, H]
    if st in ("rettangolo", "rettangolo-irr"):
        d, A = n("d"), n("A")
        base = 2 * X + d if p.get("rel") == "doppio" else X + d
        asked = p["asked"]

        def res(xs):
            h = xs[0]
            b = base.subs(X, h)
            val = {"perimetro": 2 * (h + b), "base": b, "altezza": h, "piccolo": h, "grande": b}[asked]
            return val if st == "rettangolo" else {(val,)}

        rel = f"la base supera di {d}" if p.get("rel") == "doppio" else f"la base supera l'altezza di {d}"
        return X * base - A, X, lambda s: s > 0, res, [rel, f"l'area è {A}"], [d, A]
    if st in ("triangolo", "rombo", "triangolo-irr"):
        d, A = n("d"), n("A")
        big = p["asked"] == "grande"

        def res(xs):
            val = xs[0] + (d if big else 0)
            return val if st != "triangolo-irr" else {(val,)}

        rel = f"la diagonale maggiore supera la minore di {d}" if st == "rombo" else f"la base supera l'altezza di {d}"
        return X * (X + d) / 2 - A, X, lambda s: s > 0, res, [rel, f"l'area è {A}"], [d, A]
    if st == "perimetro-area":
        P, A = n("P"), n("A")
        s_ = Rational(P, 2)
        return X * (s_ - X) - A, X, lambda s: 0 < s < s_, lambda xs: {tuple(sorted((x, s_ - x), key=float)) for x in xs}, [f"il perimetro di {P}", f"l'area di {A}", "Quanto sono lunghi i lati?"], [P, A]
    if st == "cornice":
        a, b, mode = n("a"), n("b"), p["mode"]
        outer = (a + 2 * X) * (b + 2 * X)
        expr = {"cornice": outer - a * b - (n("C") if mode == "cornice" else 0), "totale": outer - (n("T") if mode == "totale" else 0), "uguale": outer - 2 * a * b}[mode]
        res = (lambda xs: xs[0]) if p["asked"] == "larghezza" else (lambda xs: 2 * (a + b + 4 * xs[0]))
        phr = [f"di {a} ", f"per {b} ", "di larghezza costante"]
        if mode == "cornice":
            phr.append(f"è {n('C')} ")
        elif mode == "totale":
            phr.append(f"è {n('T')} ")
        else:
            phr.append("è uguale all'area della foto")
        given = [a, b] + ([n("C")] if mode == "cornice" else [n("T")] if mode == "totale" else [])
        return expr, X, lambda s: s > 0, res, phr, given
    if st == "pitagora":
        d, c, asked, tri = n("d"), n("c"), p["asked"], p["shape"] == "triangolo"

        def res(xs):
            a = xs[0]
            b = a + d
            return {"piccolo": a, "grande": b, "perimetro": a + b + c if tri else 2 * (a + b), "area": a * b / 2 if tri else a * b}[asked]

        phr = [f"l'altro di {d} cm", f"l'ipotenusa misura {c} cm"] if tri else [f"la base supera l'altezza di {d} cm", f"la diagonale misura {c} cm"]
        return X**2 + (X + d) ** 2 - c**2, X, lambda s: 0 < s and s + d < c, res, phr, [d, c, c * c]
    if st in ("moto-veloce", "moto-lento"):
        D, k, h = n("D"), n("k"), n("h")
        fast = st == "moto-veloce"
        expr = D / V - D / (V + k) - h if fast else D / (V - k) - D / V - h
        hw = "un'ora" if h == 1 else f"{h} ore"
        phr = [f"percorre {D} km", f"{k} km/h più {'veloce' if fast else 'piano'}", f"{hw} {'di meno' if fast else 'in più'}"]
        return expr, V, (lambda s: s > 0) if fast else (lambda s: s > k), lambda xs: xs[0], phr, [D, k, h]
    if st == "lavoro":
        Tt, k = n("T"), n("k")
        return 1 / X + 1 / (X + k) - Rational(1, Tt), X, lambda s: s > 0, lambda xs: xs[0] + (k if p["asked"] == "secondo" else 0), [f"in {Tt} ore", f"{k} ore più del"], [Tt, k]
    if st in ("aumenti", "sconti"):
        P0, P2 = n("P0"), n("P2")
        up = st == "aumenti"
        expr = P0 * (1 + X / 100) ** 2 - P2 if up else P0 * (1 - X / 100) ** 2 - P2
        return expr, X, (lambda s: s > 0) if up else (lambda s: 0 < s < 100), lambda xs: xs[0], [f"{P0}", f"{P2}", "della stessa percentuale"], [P0, P2]
    raise ValueError(f"unknown story {st}")


def real_roots(expr, var):
    num, den = fraction(together(expr))
    P = Poly(num, var)
    sols = [s for s in solve(num, var) if s.is_real and expand(den.subs(var, s)) != 0]
    return P, sorted(set(sols), key=float)


# ---------------------------------------------------------------------------


def plausible(p, lvl, acc, truth):
    errs = []
    st = p["story"]
    n = lambda k: int(p[k])  # noqa: E731
    if lvl in (1, 3, 5, 6, 7) and not (truth.is_integer and truth > 0):
        errs.append(f"answer {truth} is not a positive integer")
    if lvl in (1, 3, 5, 6, 7) and (len(acc) != 1 or not acc[0].is_integer):
        errs.append(f"accepted solutions {acc}: expected one integer")
    if st == "sasso" and not (n("v") <= 60 and n("H") <= 150):
        errs.append("sasso: numbers too large")
    if st == "pitagora" and n("c") > 41:
        errs.append("pitagora: hypotenuse over 41")
    if st in ("rettangolo", "triangolo", "rombo") and n("A") > 500:
        errs.append("area over 500")
    if st in ("moto-veloce", "moto-lento") and not 10 <= n("D") <= 600:
        errs.append("moto: distance")
    if st in ("aumenti", "sconti") and truth not in (5, 10, 15, 20, 25, 30, 40, 50):
        errs.append(f"percentage {truth}")
    if st in ("triangolo-irr", "rettangolo-irr") and acc and acc[0].is_rational:
        errs.append("level 4 side is rational")
    return errs


def check(sample):
    p = sample["params"]
    lvl = sample["level"]
    st = p.get("story")
    if st not in STORIES.get(lvl, []):
        return [f"story {st!r} not in level {lvl}"], None
    errs = []
    expr, var, acceptable, result, phrases, given = story(p)
    P, sols = real_roots(expr, var)
    if P.degree() != 2:
        return [f"the story gives an equation of degree {P.degree()}"], st
    acc = [s for s in sols if acceptable(s)]
    rejected = [s for s in sols if not acceptable(s)]

    # normal form and roots in params
    if p.get("variable") not in VARS or VARS[p["variable"]] != var:
        errs.append(f"variable {p.get('variable')} != {var}")
    try:
        a, b, c = (int(s) for s in p["normal"])
        if a <= 0 or Poly(a * var**2 + b * var + c, var).content() != 1:
            errs.append(f"normal form {p['normal']} not reduced")
        if expand(Poly(a * var**2 + b * var + c, var).as_expr() * P.LC() - P.as_expr() * a) != 0:
            errs.append(f"normal form {p['normal']} is not the equation of the story")
        pr = sorted((sympify(s) for s in p["roots"]), key=float)
        if [key(s) for s in pr] != [key(s) for s in sorted((r for r in solve(a * var**2 + b * var + c, var) if r.is_real), key=float)]:
            errs.append(f"params.roots {p['roots']} wrong")
    except Exception as ex:  # noqa: BLE001
        errs.append(f"normal form unreadable: {ex}")

    # the equation shown
    eq = p.get("equation", "")
    for name, rx in FORBIDDEN:
        if rx.search(eq):
            errs.append(f"equation contains '{name}': {eq}")
    sides = eq.split("=")
    if len(sides) != 2:
        errs.append(f"bad equation {eq!r}")
    else:
        try:
            _, s2 = real_roots(latex_expr(sides[0]) - latex_expr(sides[1]), var)
            if [key(s) for s in s2] != [key(s) for s in sols]:
                errs.append(f"equation {eq} has solutions {s2}, the story {sols}")
        except Exception as ex:  # noqa: BLE001
            errs.append(f"equation unreadable: {ex}")

    # steps
    steps = sample.get("steps", [])
    if not any(eq in s for s in steps):
        errs.append("the equation is not in the steps")
    if lvl == 6 and not any("C.E." in s for s in steps):
        errs.append("no conditions of existence")
    if acc and not any(s.startswith("\\text{Controllo sul testo") for s in steps):
        errs.append("no check on the text")
    if rejected and not any("si scarta" in s for s in steps):
        errs.append("the rejected solution is not discarded in the steps")
    for s in steps + [sample.get("solution", "")]:
        # the formula shows \sqrt{Delta} as computed, the next line simplifies it; every other line is simplified
        if "\\pm" not in s and not s.startswith("\\text{Semplifica"):
            errs += radical_errors(s)
        if re.search(r"\\begin\{(aligned|gathered|array)\}", s) and "\\text" in s:
            errs.append("environment with text in a step")

    # the text
    text = prose(sample["problem"])
    missing = [ph for ph in phrases if ph not in text]
    if missing:
        errs.append(f"text does not state {missing}: {text}")
    if "—" in sample["problem"] or "piuttosto che" in sample["problem"]:
        errs.append("forbidden words in the text")
    if not sample.get("prompt", "").startswith("Risolvi il problema con un'equazione di secondo grado"):
        errs.append("prompt")

    # the answer
    ans = sample["answer"]
    if lvl in CHOICE_LEVELS:
        truth = result(acc) if acc else None
        if truth is not None and st in ("somma-prodotto", "perimetro-area"):
            truth = {tuple(sorted(u, key=float)) for u in truth}
        kind = ("una" if truth is not None and len(ukeys(truth)) == 1 else "due" if truth is not None else "nessuna") if lvl == 2 else ("impossibile" if truth is None else "irrazionale")
        if p.get("case") != kind:
            errs.append(f"params.case {p.get('case')} but the problem is {kind}")
        if lvl == 4 and truth is not None and any(x.is_rational for u in truth for x in u):
            errs.append("level 4 answer is rational")
        if ans.get("kind") != "choice":
            errs.append("levels 2 and 4 answer with a choice")
        ch = ans
        tk = ukeys(truth)
        percent = False
    else:
        kind = st
        if len(acc) != 1:
            return errs + [f"expected one acceptable solution, found {acc} of {sols}"], kind
        truth = expand(result(acc))
        if not truth.is_rational:
            return errs + [f"the answer {truth} is not rational"], kind
        truth = Rational(truth)
        errs += plausible(p, lvl, acc, truth)
        if truth in [Integer(g) for g in given]:
            errs.append(f"the answer {truth} is a number of the text")
        if ans.get("kind") != "number" or Rational(ans.get("value")) != truth:
            errs.append(f"answer {ans} != {truth}")
        ch = sample.get("choice")
        tk = frozenset([(key(truth),)])
        percent = lvl == 7

    # the options
    if not ch:
        return errs + ["missing choice"], kind
    opts = ch.get("options", [])
    if len(opts) != 4 or len({tuple(o.get("values", [])) for o in opts}) != 4 or len({o.get("latex") for o in opts}) != 4:
        errs.append("choice needs 4 distinct options")
    try:
        shown = []
        for o in opts:
            lt = o["latex"]
            errs += radical_errors(lt)
            if percent != lt.endswith("\\%"):
                errs.append(f"option {lt!r}: percent sign")
            u_tex = option_units(lt)
            u_val = value_units(o["values"])
            if ukeys(u_tex) != ukeys(u_val):
                errs.append(f"option {lt!r} != values {o['values']}")
            for v in o["values"]:
                for m in re.finditer(r"sqrt\((\d+)\)", v):
                    if not squarefree(m.group(1)):
                        errs.append(f"value {v} not simplified")
            shown.append(ukeys(u_tex))
        if len(set(shown)) != len(shown):
            errs.append("two options say the same")
        c = ch.get("correct")
        if not isinstance(c, int) or not 0 <= c < len(opts) or shown[c] != tk:
            errs.append(f"choice.correct {c} does not point to the truth {truth}")
        if sum(1 for s in shown if s == tk) != 1:
            errs.append("not exactly one correct option")
        if lvl in CHOICE_LEVELS and truth is None and None not in shown:
            errs.append("impossible problem without the impossible option")
    except Exception as ex:  # noqa: BLE001
        errs.append(f"options unreadable: {ex}")
    return errs, kind
