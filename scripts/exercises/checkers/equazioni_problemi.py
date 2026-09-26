"""Checker for equazioni-problemi, written from specs/exercises/equazioni-problemi.md.

For every sample it rebuilds the equation from the data of the story in params (the way the text
states them, not from the LaTeX the generator wrote), solves it with SymPy and computes the number
the question asks. Then it checks: the answer and the correct option; the equation in params,
read from its LaTeX, has the same solution and is in the steps; the normal form a·x = b; the text
states the data; the numbers are plausible for the story; on level 7, whether the solution respects
the limitations of the unknown (acceptable) or the problem is impossible.
"""
import re

from sympy import Poly, Rational, Symbol, expand, sympify

X = Symbol("x")
T = Symbol("t")

STORIES = {
    1: ["ordine", "pari-dispari", "somma-due", "eta-fa", "eta-somma"],
    2: ["rettangolo-area", "isoscele", "quadrato", "rettangolo-cambia"],
    3: ["sconto", "resto", "aumento", "parti"],
    4: ["incontro", "inseguimento", "andata-ritorno"],
    5: ["miscela", "aggiunta", "diluizione"],
    6: ["insieme", "svuota", "dopo"],
    7: ["consecutivi", "eta", "rettangolo", "miscela", "divisione"],
}


def _even(n, slack=0.10):
    share = 1 / n
    return (max(0.0, share - slack), share + slack)


CASE_RANGES = {lvl: {s: _even(len(ss)) for s in ss} for lvl, ss in STORIES.items() if lvl != 7}
CASE_RANGES[7] = {"accettabile": (0.38, 0.62), "impossibile": (0.38, 0.62)}

TIMES = {2: "doppio", 3: "triplo", 4: "quadruplo", 5: "quintuplo"}
PART = {2: "metà", 3: "terza parte"}
NUM = {2: "due", 3: "tre"}
IMPOSSIBLE = "impossibile"

FORBIDDEN = [
    ("1x", re.compile(r"(?<![\d},])1\s*[xt]")),
    ("0x", re.compile(r"(?<![\d},])0\s*[xt]")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"-\s*-")),
    ("+ +", re.compile(r"\+\s*\+")),
    ("1(", re.compile(r"(?<![\d},])1\(")),
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
    s = s.replace("\\%", "%").replace("\\text{cm}^2", "cm^2").replace("\\text{m}^2", "m^2").replace("$", "")
    return re.sub(r"\s+", " ", s)


def latex_expr(s):
    s = s.replace("\\left(", "(").replace("\\right)", ")").replace("\\cdot", "*")
    s = re.sub(r"(\d+)\{,\}(\d+)", lambda m: f"({int(m.group(1) + m.group(2))}/{10 ** len(m.group(2))})", s)
    while "\\frac" in s:
        s2 = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"((\1)/(\2))", s)
        if s2 == s:
            raise ValueError(f"unreadable fraction in {s!r}")
        s = s2
    s = s.replace("^", "**")
    s = re.sub(r"(\d|\)|x|t)\s*([xt(])", r"\1*\2", s)
    if not re.fullmatch(r"[0-9xt+\-*/() .]*", s):
        raise ValueError(f"unexpected characters in {s!r}")
    return sympify(s, locals={"x": X, "t": T})


def latex_number(s):
    s = s.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", s):
        return Rational(int(s))
    raise ValueError(f"not a number: {s!r}")


def latex_minutes(s):
    m = re.fullmatch(r"(?:(\d+) \\text\{ h\})?(?: ?(\d+) \\text\{ min\})?", s.replace("\\text{ h } ", "\\text{ h} "))
    if not m or not (m.group(1) or m.group(2)):
        raise ValueError(f"not a time: {s!r}")
    return int(m.group(1) or 0) * 60 + int(m.group(2) or 0)


def pct(p):
    return Rational(int(p), 100)


# ---------------------------------------------------------------------------
# The stories: (lhs - rhs in the variable, variable, answer from the solution, numbers in the text,
# phrases the text must contain, plausibility errors). Level 7 adds whether x is acceptable.


def story(level, p):
    st = p["story"]
    n = lambda k: int(p[k])  # noqa: E731
    errs = []
    v = X
    if st == "ordine":
        form, k, c, R = p["form"], n("k"), n("c"), n("R")
        expr = {
            "kpiu": k * (X + c),
            "piuk": k * X + c,
            "kmeno": k * (X - c),
            "menok": k * X - c,
            "metapiu": (X + c) / k,
            "piumeta": X / k + c,
        }[form]
        words = {
            "kpiu": f"il {TIMES.get(k)} della somma di un numero e {c}",
            "piuk": f"la somma del {TIMES.get(k)} di un numero e {c}",
            "kmeno": f"il {TIMES.get(k)} della differenza tra un numero e {c}",
            "menok": f"la differenza tra il {TIMES.get(k)} di un numero e {c}",
            "metapiu": f"la {PART.get(k)} della somma di un numero e {c}",
            "piumeta": f"la somma della {PART.get(k)} di un numero e {c}",
        }[form]
        return expr - R, v, lambda s: s, [k, c, R], [words[1:] + f" è {R}.", "Qual è il numero?"], errs
    if st == "pari-dispari":
        cnt, S, off = n("n"), n("S"), 0 if p["kind"] == "pari" else 1
        nums = [2 * X + off + 2 * i for i in range(cnt)]
        ans = (lambda s: 2 * s + off) if p["asked"] == "piccolo" else (lambda s: 2 * s + off + 2 * (cnt - 1))
        return sum(nums) - S, v, ans, [S], [f"{NUM[cnt]} numeri {p['kind']} consecutivi è {S}", f"il più {p['asked']}"], errs
    if st == "somma-due":
        k, d, S = n("k"), n("d"), n("S")
        expr = k * X - (S - X + d) if p["rel"] == "A" else (S - X) - (k * X + d)
        rel = f"il {TIMES[k]} del più piccolo supera di {d} il più grande" if p["rel"] == "A" else f"il più grande supera di {d} il {TIMES[k]} del più piccolo"
        ans = (lambda s: s) if p["asked"] == "piccolo" else (lambda s: S - s)
        return expr, v, ans, [k, d, S], [f"La somma di due numeri naturali è {S}", rel, f"il più {p['asked']}"], errs
    if st in ("eta-fa", "eta"):
        k, par, ch = n("k"), n("parent"), n("child")
        if not (20 <= par - ch <= 45) or par > 65 or ch < 3:
            errs.append("eta: implausible ages")
        if p["P"] == p["C"]:
            errs.append("eta: same name twice")
        phr = [f"{p['P']} ha {par} anni", f"{p['C']} ne ha {ch}.", f"Quanti anni fa {p['P']} aveva il {TIMES[k]} degli anni di {p['C']}?"]
        return (par - X) - k * (ch - X), v, lambda s: s, [k, par, ch], phr, errs
    if st == "eta-somma":
        nn, d, S = n("n"), n("d"), n("S")
        sg = 1 if p["when"] == "tra" else -1
        if not 20 <= d <= 40:
            errs.append("eta-somma: implausible difference of ages")
        ask = p["C"] if p["asked"] == "figlio" else p["P"]
        ans = (lambda s: s) if p["asked"] == "figlio" else (lambda s: s + d)
        when = f"Tra {nn} anni la somma delle loro età sarà {S}." if sg == 1 else f"{nn} anni fa la somma delle loro età era {S}."
        return (X + sg * nn) + (X + d + sg * nn) - S, v, ans, [nn, d, S], [f"{p['P']} ha {d} anni più di", when, f"Quanti anni ha oggi {ask}?"], errs
    if st == "rettangolo-area":
        P = n("P")
        rel = p["rel"]
        base = X + n("d") if rel == "piu" else n("k") * X if rel == "volte" else 2 * X + n("d")
        words = f"la base supera l'altezza di {n('d')}" if rel == "piu" else f"la base è il {TIMES[n('k')]} dell'altezza" if rel == "volte" else f"la base supera di {n('d')}"
        given = [P, n("k") if rel == "volte" else n("d")]
        return 2 * (X + base) - P, v, lambda s: s * base.subs(X, s), given, [f"perimetro di", f"è {P}", words, "Calcola l'area"], errs
    if st == "isoscele":
        P, d = n("P"), n("d")
        leg, base = (X, X + d) if p["rel"] == "base" else (X + d, X)
        ans = (lambda s: base.subs(X, s)) if p["asked"] == "base" else (lambda s: leg.subs(X, s))
        words = f"la base supera di {d} cm ciascun lato obliquo" if p["rel"] == "base" else f"ciascun lato obliquo supera di {d} cm la base"
        q = "Quanto misura la base?" if p["asked"] == "base" else "Quanto misura ciascun lato obliquo?"
        return base + 2 * leg - P, v, ans, [P, d], [f"triangolo isoscele ha il perimetro di {P} cm", words, q], errs
    if st == "quadrato":
        a, D, u = n("a"), n("D"), p["u"]
        sg = 1 if p["dir"] == "allunga" else -1
        ans = (lambda s: s) if p["asked"] == "lato" else (lambda s: s + sg * a)
        verb = "allunghi" if sg == 1 else "accorci"
        change = "aumenta" if sg == 1 else "diminuisce"
        return (X + sg * a) ** 2 - (X**2 + sg * D), v, ans, [a, D], [f"Se {verb} di {a} {u} il lato di un quadrato", f"la sua area {change} di {D} {u}^2"], errs
    if st == "rettangolo-cambia":
        d, a, e, D = n("d"), n("a"), n("e"), n("D")
        ans = (lambda s: s) if p["asked"] == "altezza" else (lambda s: s + d)
        phr = [f"la base supera l'altezza di {d} cm", f"allunghi la base di {a} cm", f"accorci l'altezza di {e} cm", f"l'area {'aumenta' if D > 0 else 'diminuisce'} di {abs(D)} cm^2"]
        return (X + d + a) * (X - e) - (X * (X + d) + D), v, ans, [d, a, e, abs(D)], phr, errs
    if st == "sconto":
        pp, e, Tt = n("p"), n("e"), n("T")
        return X * (1 - pct(pp)) + e - Tt, v, lambda s: s, [pp, e, Tt], [f"del {pp}%", f"da {e} euro", f"in tutto {Tt} euro", "prima dello sconto?"], errs
    if st == "resto":
        p1, p2, R = n("p1"), n("p2"), n("R")
        return X * (1 - pct(p1)) * (1 - pct(p2)) - R, v, lambda s: s, [p1, p2, R], [f"il {p1}%", f"il {p2}% d", f" {R} "], errs
    if st == "aumento":
        pp, d, F = n("p"), n("d"), n("F")
        return X * (1 + pct(pp)) * (1 - pct(d)) - F, v, lambda s: s, [pp, d, F], [f"aumenta del {pp}%", f"cala del {d}%", f"è {F} euro", "prima dell'aumento?"], errs
    if st == "parti":
        p1, p2, R = n("p1"), n("p2"), n("R")
        ans = (lambda s: s) if p["asked"] == "totale" else (lambda s: s * pct(p1))
        return X * (1 - pct(p1) - pct(p2)) - R, v, ans, [p1, p2, R], [f"il {p1}%", f"il {p2}%", f"gli altri {R}"], errs
    if st == "incontro":
        D, v1, v2 = n("D"), n("v1"), n("v2")
        ans = (lambda s: 60 * s) if p["asked"] == "minuti" else (lambda s: v1 * s)
        q = "Dopo quanti minuti si incontrano?" if p["asked"] == "minuti" else "A quanti chilometri da A si incontrano?"
        return v1 * T + v2 * T - D, T, ans, [D, v1, v2], [f"distano {D} km", f"da A verso B a {v1} km/h", f"da B verso A a {v2} km/h", "nello stesso momento", q], errs
    if st == "inseguimento":
        h0, dh, v1, v2 = n("h0"), n("dh"), n("v1"), n("v2")
        ans = (lambda s: 60 * s) if p["asked"] == "minuti" else (lambda s: v2 * s)
        q = "Quanti minuti dopo la sua partenza" if p["asked"] == "minuti" else "A quanti chilometri dal punto di partenza"
        return v2 * T - v1 * (T + dh), T, ans, [h0, h0 + dh, dh, v1, v2], [f"Alle {h0} ", f"a {v1} km/h", f"Alle {h0 + dh},", f"a {v2} km/h", "dallo stesso punto", q], errs
    if st == "andata-ritorno":
        v1, v2, Tm = n("v1"), n("v2"), n("T")
        return X / v1 + X / v2 - Rational(Tm, 60), v, lambda s: s, [v1, v2, Tm], [f"a {v1} km/h", f"a {v2} km/h", f"{Tm} minuti"], errs
    if st == "miscela":
        p1, p2, Q, pm = n("p1"), n("p2"), n("Q"), n("pm")
        asked = p.get("asked", "primo")
        ans = (lambda s: s) if asked == "primo" else (lambda s: Q - s)
        phr = [f"da {p1} euro al chilo con", f"da {p2} euro al chilo", f"{Q} kg di miscela", f"a {pm} euro al chilo", f"da {p1 if asked == 'primo' else p2} euro deve usare?"]
        return p1 * X + p2 * (Q - X) - pm * Q, v, ans, [p1, p2, Q, pm], phr, errs
    if st == "aggiunta":
        pa, m, pb, pm = n("pa"), n("m"), n("pb"), n("pm")
        if not min(pa, pb) < pm < max(pa, pb):
            errs.append("aggiunta: price of the mixture outside the two prices")
        return pa * m + pb * X - pm * (m + X), v, lambda s: s, [pa, m, pb, pm], [f"{m} kg di", f"da {pa} euro al chilo", f"da {pb} euro al chilo deve aggiungere", f"da {pm} euro al chilo?"], errs
    if st == "diluizione":
        m, c1, c2 = n("m"), n("c1"), n("c2")
        return pct(c1) * m - pct(c2) * (m + X), v, lambda s: s, [m, c1, c2], [f"{m} litri", f"il {c1}%", f"{c2}%"], errs
    if st in ("insieme", "svuota", "dopo"):
        a, b, unit = n("a"), n("b"), p["unit"]
        k = 60 if unit == "h" else 1
        w = "ore" if unit == "h" else "minuti"
        if st == "insieme":
            expr = X / a + X / b - 1
        elif st == "svuota":
            expr = X / a - X / b - 1
        else:
            expr = (X + n("h")) / a + X / b - 1
        phr = [f"in {a} {w}", f"in {b} {w}"]
        if st == "dopo":
            phr.append(f"per {n('h')} {w}" if unit == "min" else f"per {n('h')} {'ora' if n('h') == 1 else 'ore'}")
        if st == "svuota":
            phr.append("svuot")
        return expr, v, lambda s: k * s, [], phr, errs
    if st == "consecutivi":
        cnt, S = n("n"), n("S")
        return sum(X + i for i in range(cnt)) - S, v, lambda s: s, [S], [f"{NUM[cnt]} numeri naturali consecutivi è {S}", "Qual è il più piccolo"], errs
    if st == "rettangolo":
        P, d, u = n("P"), n("d"), p["u"]
        return 2 * (X + X + d) - P, v, lambda s: s, [P, d], [f"perimetro di {P} {u}", f"la base supera l'altezza di {d} {u}", "Quanto misura l'altezza"], errs
    if st == "divisione":
        Tt, d, A, B = n("T"), n("d"), p["A"], p["B"]
        if A == B:
            errs.append("divisione: same name twice")
        return X + (X + d) - Tt, v, lambda s: s, [Tt, d], [f"hanno in tutto {Tt} figurine", f"{B} ne ha {d} più di {A}", f"Quante figurine ha {A}?"], errs
    return None


def acceptable(p, s):
    """Level 7: the limitations of the unknown, from the meaning of x in each story."""
    st = p["story"]
    if st == "consecutivi":
        return s.is_integer and s >= 0
    if st == "eta":
        return 0 < s < int(p["child"])
    if st == "rettangolo":
        return s > 0
    if st == "miscela":
        return 0 <= s <= int(p["Q"])
    if st == "divisione":
        return s.is_integer and 0 <= s and s + int(p["d"]) <= int(p["T"])
    raise ValueError(st)


def plausible(level, p, sol, truth):
    """Numbers a student expects: whole euros, kilos and minutes, sides that make a triangle."""
    errs = []
    st = p["story"]
    n = lambda k: int(p[k])  # noqa: E731
    if level <= 5 and not (truth.is_integer and truth > 0):
        errs.append(f"answer {truth} is not a positive integer")
    if st in ("ordine", "somma-due", "eta-fa", "eta-somma", "rettangolo-area", "isoscele", "quadrato", "rettangolo-cambia", "miscela", "aggiunta", "diluizione", "andata-ritorno") and level < 7:
        if not (sol.is_integer and sol > 0):
            errs.append(f"x = {sol} is not a positive integer")
    if st == "somma-due" and not sol < n("S") - sol:
        errs.append("somma-due: the smaller is not smaller")
    if st == "eta-fa" and not 0 < sol < n("child"):
        errs.append("eta-fa: x outside 0 < x < age of the child")
    if st == "eta-somma" and p["when"] == "fa" and not sol > n("n"):
        errs.append("eta-somma: the child was not born")
    if st == "isoscele":
        leg, base = (sol, sol + n("d")) if p["rel"] == "base" else (sol + n("d"), sol)
        if not base < 2 * leg:
            errs.append("isoscele: not a triangle")
    if st == "quadrato" and p["dir"] == "accorcia" and not sol > n("a"):
        errs.append("quadrato: side shorter than the cut")
    if st == "rettangolo-cambia" and not sol > n("e"):
        errs.append("rettangolo-cambia: height shorter than the cut")
    if st == "sconto" and not (sol * (1 - pct(p["p"]))).is_integer:
        errs.append("sconto: discounted price not whole euros")
    if st == "resto":
        left = sol * (1 - pct(p["p1"]))
        if not (sol * pct(p["p1"])).is_integer or not (left * pct(p["p2"])).is_integer:
            errs.append("resto: a part is not a whole number")
    if st == "aumento":
        up = sol * (1 + pct(p["p"]))
        if not up.is_integer or not (up * pct(p["d"])).is_integer:
            errs.append("aumento: intermediate price not whole euros")
    if st == "parti" and not all((sol * pct(p[k])).is_integer for k in ("p1", "p2")):
        errs.append("parti: a group is not a whole number")
    if st in ("incontro", "inseguimento"):
        m = 60 * sol
        km = n("v1") * sol if st == "incontro" else n("v2") * sol
        if not (m.is_integer and km.is_integer) or not 10 <= m <= 240:
            errs.append(f"{st}: time or distance not whole ({m} min, {km} km)")
    if st == "miscela" and level < 7 and not 0 < sol < n("Q"):
        errs.append("miscela: quantity outside 0 < x < Q")
    if st in ("insieme", "svuota", "dopo"):
        if not (truth.is_integer and 5 <= truth <= 12 * 60):
            errs.append(f"lavoro: {truth} minutes")
        if not n("a") < n("b"):
            errs.append("lavoro: the first is not the faster")
    return errs


def check(sample):
    p = sample["params"]
    lvl = sample["level"]
    if p.get("story") not in STORIES.get(lvl, []):
        return [f"story {p.get('story')!r} not in level {lvl}"], None
    built = story(lvl, p)
    expr, var, answer_of, given, phrases, errs = built
    expr = expand(expr)
    P = Poly(expr, var)
    if P.degree() != 1:
        return errs + [f"the story gives an equation of degree {P.degree()}"], p["story"]
    sol = -P.coeff_monomial(1) / P.coeff_monomial(var)
    kind = p["story"]

    # the solution and the normal form
    if Rational(p["x"]) != sol:
        errs.append(f"params.x {p['x']} != {sol}")
    a, b = Rational(p["normal"]["a"]), Rational(p["normal"]["b"])
    if a == 0 or b / a != sol:
        errs.append(f"normal form {a}x = {b} does not give {sol}")
    if p.get("variable") != str(var):
        errs.append(f"variable {p.get('variable')} != {var}")

    # the equation the student is shown
    eq = p.get("equation", "")
    for name, rx in FORBIDDEN:
        if rx.search(eq):
            errs.append(f"equation contains forbidden '{name}': {eq}")
    sides = eq.split("=")
    if len(sides) != 2:
        errs.append(f"bad equation {eq!r}")
    else:
        try:
            e2 = expand(latex_expr(sides[0]) - latex_expr(sides[1]))
            P2 = Poly(e2, var)
            if P2.degree() != 1 or -P2.coeff_monomial(1) / P2.coeff_monomial(var) != sol:
                errs.append(f"equation {eq} does not have the solution {sol}")
            if expand(e2 * P.coeff_monomial(var) - expr * P2.coeff_monomial(var)) != 0:
                errs.append(f"equation {eq} is not the one of the story")
        except Exception as ex:  # noqa: BLE001
            errs.append(f"equation unreadable: {ex}")
    steps = sample.get("steps", [])
    if not any(eq in s for s in steps):
        errs.append("the equation is not in the steps")

    # the text
    text = prose(sample["problem"])
    missing = [ph for ph in phrases if ph not in text]
    if missing:
        errs.append(f"text does not state {missing}: {text}")
    if "—" in sample["problem"] or "piuttosto che" in sample["problem"]:
        errs.append("forbidden words in the text")
    if not sample.get("prompt", "").startswith("Risolvi il problema con un'equazione"):
        errs.append("prompt")

    # the answer
    if lvl == 7:
        ok = acceptable(p, sol)
        truth = sol if ok else None
        kind = "accettabile" if ok else "impossibile"
        if p.get("case") != kind:
            errs.append(f"params.case {p.get('case')} but the solution is {kind}")
        if ok and not any(s.startswith("\\text{Controllo sul testo") for s in steps):
            errs.append("no check on the text")
        if not ok and not any("accettabile" in s for s in steps):
            errs.append("the rejection is not explained")
    else:
        truth = Rational(answer_of(sol))
        errs += plausible(lvl, p, sol, truth)
        if not any("Controllo" in s for s in steps):
            errs.append("no check on the text")
        if lvl <= 5 and truth in [Rational(g) for g in given]:
            errs.append(f"the answer {truth} is a number of the text")
    ans = sample["answer"]
    if lvl <= 5:
        if ans.get("kind") != "number" or ans.get("value") != str(truth):
            errs.append(f"answer {ans} != {truth}")
        ch = sample.get("choice")
    else:
        if ans.get("kind") != "choice":
            errs.append("levels 6 and 7 answer with a choice")
        ch = ans
        if sample.get("choice") not in (None, ans):
            errs.append("choice differs from the answer")

    # the options
    if not ch:
        return errs + ["missing choice"], kind
    opts = ch.get("options", [])
    vals = [tuple(o.get("values", [])) for o in opts]
    if len(opts) != 4 or len(set(vals)) != 4 or len({o.get("latex") for o in opts}) != 4:
        errs.append(f"choice needs 4 distinct options: {vals}")
    try:
        shown = []
        for o in opts:
            (val,) = o["values"]
            if lvl == 6:
                m = latex_minutes(o["latex"])
                if str(m) != val:
                    errs.append(f"option {o['latex']!r} != {val} minutes")
                shown.append(Rational(m))
            elif val == IMPOSSIBLE:
                if o["latex"] != "\\text{Il problema è impossibile}":
                    errs.append(f"impossible option written {o['latex']!r}")
                shown.append(None)
            else:
                num = latex_number(o["latex"])
                if num != Rational(val):
                    errs.append(f"option {o['latex']!r} != {val}")
                if lvl <= 6 and not (num.is_integer and num > 0):
                    errs.append(f"option {val} is not a positive integer")
                shown.append(num)
        c = ch.get("correct")
        if not isinstance(c, int) or not 0 <= c < len(opts) or shown[c] != truth:
            errs.append(f"choice.correct points to {vals[c] if isinstance(c, int) and 0 <= c < len(opts) else c}, truth {truth}")
        if sum(1 for s in shown if s == truth) != 1:
            errs.append("not exactly one correct option")
        if lvl == 7:
            if None not in shown:
                errs.append("no 'impossibile' option")
            if truth is None and sol not in shown:
                errs.append("an impossible problem without the rejected solution among the options")
    except Exception as ex:  # noqa: BLE001
        errs.append(f"options unreadable: {ex}")
    return errs, kind
