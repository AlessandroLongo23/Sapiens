"""Checker for numeri-reali-radici, from specs/exercises/numeri-reali-radici.md.

Written from the spec, not from the generator. Every problem is rendered again here from params and
compared with the text shown; every answer is recomputed with SymPy (real_root, solveset over the
reals, factorint) and every option is read back from its LaTeX and from its value, which must agree.
A distractor must be wrong: a different value somewhere the radical exists, or, for the radicals to
simplify, the same value in a form that is not irreducible (or, at level 6, not the least index).
Level 5 is checked at negative values of the letters too: that is where a missing |a| shows.
"""
import re
from itertools import product
from math import gcd

from sympy import (
    Abs, EmptySet, FiniteSet, Interval, Rational, S, Symbol, factorint, ilcm, oo, real_root, solveset, sympify,
)

from verify import FORBIDDEN, rat

X = Symbol("x", real=True)
SYMS = {n: Symbol(n, real=True) for n in "xab"}

CASE_RANGES = {
    1: {"quadrata": (0.13, 0.26), "indice": (0.13, 0.26), "frazione": (0.08, 0.21), "decimale": (0.08, 0.21), "negativo": (0.13, 0.26), "non esiste": (0.08, 0.21)},
    2: {"pari": (0.23, 0.40), "dispari": (0.10, 0.22), "sempre": (0.05, 0.16), "nulla": (0.05, 0.16), "denominatore pari": (0.10, 0.22), "denominatore dispari": (0.05, 0.16)},
    3: {"binomio pari": (0.22, 0.38), "monomio": (0.13, 0.27), "binomio dispari": (0.13, 0.27), "trinomio": (0.22, 0.38)},
    4: {"numero": (0.37, 0.53), "fattori": (0.27, 0.43), "irriducibile": (0.13, 0.27)},
    5: {"valore assoluto": (0.27, 0.43), "senza valore assoluto": (0.13, 0.27), "indice dispari": (0.13, 0.27), "condizioni": (0.17, 0.33)},
    6: {"due": (0.27, 0.43), "tre": (0.32, 0.48), "lettere": (0.17, 0.33)},
    7: {"positivi": (0.52, 0.68), "intero": (0.13, 0.27), "negativi": (0.13, 0.27)},
}


def rt(n, body):
    return rf"\sqrt{{{body}}}" if n == 2 else rf"\sqrt[{n}]{{{body}}}"


def check_choice(ch, is_correct, errs):
    """Four options, distinct in values and LaTeX, exactly one correct, and `correct` points to it."""
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    keys = [tuple(o["values"]) for o in opts]
    if len(set(keys)) != len(keys):
        errs.append("options with the same values")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("options with the same LaTeX")
    good = [i for i, o in enumerate(opts) if is_correct(o)]
    if len(good) != 1:
        errs.append(f"{len(good)} correct options: {[o['latex'] for o in opts]}")
    elif ch.get("correct") != good[0]:
        errs.append(f"choice.correct = {ch.get('correct')}, but the correct option is {good[0]}")


def the_choice(sample):
    return sample["answer"] if sample["answer"]["kind"] == "choice" else sample.get("choice")


# ---------------------------------------------------------------------------
# Numbers as written: 12, -\frac{7}{5}, 0{,}08


def num_tex(r, dec):
    r = Rational(r)
    if dec:
        d = r.q
        k = 0
        while (10**k) % d:
            k += 1
        if not (d == 1 or (10**k) % d == 0):
            raise ValueError("not a decimal")
        digits = str(abs(r.p) * (10**k // d)).rjust(k + 1, "0")
        sign = "-" if r < 0 else ""
        return sign + (digits if k == 0 else f"{digits[:-k]}{{,}}{digits[-k:]}")
    if r.q == 1:
        return str(r.p)
    return ("-" if r < 0 else "") + rf"\frac{{{abs(r.p)}}}{{{r.q}}}"


def only_2_5(d):
    return set(factorint(d)) <= {2, 5}


def l1_radicand_tex(r, style):
    if style == "dec":
        return num_tex(r, True)
    if r.q == 1:
        return str(r.p)
    return ("-" if r < 0 else "") + rf"\dfrac{{{abs(r.p)}}}{{{r.q}}}"


def check_l1(sample):
    errs = []
    p = sample["params"]
    n, rad, style, case = int(p["index"]), rat(p["radicand"]), p["style"], p["case"]
    if sample["problem"] != rt(n, l1_radicand_tex(rad, style)):
        errs.append(f"problem {sample['problem']!r} does not match params")
    if n % 2 == 0 and rad < 0:
        truth = None
    else:
        v = real_root(rad, n)
        if not v.is_rational:
            return [f"root of {rad} with index {n} is not rational"], case
        truth = Rational(v)
    # the case says what the radical is
    kind = (
        "non esiste" if truth is None
        else "negativo" if rad < 0
        else "decimale" if style == "dec"
        else "frazione" if rad.q > 1
        else "quadrata" if n == 2
        else "indice"
    )
    if kind != case:
        errs.append(f"case {case!r} but the radical is {kind!r}")
    if style == "dec" and not only_2_5(rad.q):
        errs.append("decimal radicand without a finite expansion")
    if abs(rad.p) > 1000 or rad.q > 1000:
        errs.append(f"radicand {rad} too large")
    if n not in (2, 3, 4, 5, 6):
        errs.append(f"index {n}")
    ans = sample["answer"]
    if truth is None:
        if ans["kind"] != "choice":
            errs.append("no real root: the answer must be the choice 'non esiste'")
    elif ans["kind"] != "number" or rat(ans["value"]) != truth:
        errs.append(f"answer {ans.get('value')} != {truth}")
    dec = style == "dec"

    def read(o):
        """Value of an option from its LaTeX, checked against its values."""
        tex, val = o["latex"], o["values"]
        if tex == r"\text{non esiste in } \mathbb{R}":
            ok = val == ["none"]
            return "none", ok
        m = re.fullmatch(r"\\pm (.+)", tex)
        if m:
            r = rat(val[0][3:]) if val[0].startswith("pm:") else None
            return ("pm", r), r is not None and num_tex(r, dec and only_2_5(r.q)) == m.group(1)
        r = rat(val[0])
        return r, num_tex(r, dec and only_2_5(r.q)) == tex

    ch = the_choice(sample)
    if ch is None:
        return errs + ["no choice"], case
    for o in ch["options"]:
        _, ok = read(o)
        if not ok:
            errs.append(f"option {o['latex']!r} does not say {o['values']}")
    check_choice(ch, lambda o: read(o)[0] == ("none" if truth is None else truth), errs)
    return errs, case


# ---------------------------------------------------------------------------
# Level 2: conditions of existence


def lin_tex(a, b, v="x"):
    def c(k):
        return "" if k == 1 else "-" if k == -1 else str(k)

    if a > 0:
        return f"{c(a)}{v}" if b == 0 else f"{c(a)}{v} {'-' if b < 0 else '+'} {abs(b)}"
    if b > 0:
        return f"{b} - {c(-a)}{v}"
    return f"-{c(-a)}{v}" if b == 0 else f"-{c(-a)}{v} - {-b}"


def cond_set(key):
    if key == "all":
        return S.Reals
    if key == "none":
        return EmptySet
    rel, r = key.split(":")
    r = rat(r)
    return {
        "ge": Interval(r, oo), "le": Interval(-oo, r), "gt": Interval.open(r, oo), "lt": Interval.open(-oo, r),
        "ne": S.Reals - FiniteSet(r), "eq": FiniteSet(r),
    }[rel]


def cond_tex(key):
    if key == "all":
        return r"\text{ogni } x \in \mathbb{R}"
    if key == "none":
        return r"\text{nessun } x \in \mathbb{R}"
    rel, r = key.split(":")
    sym = {"ge": r"\ge", "le": r"\le", "gt": ">", "lt": "<", "ne": r"\neq", "eq": "="}[rel]
    return f"x {sym} {num_tex(rat(r), False)}"


def same(A, B):
    return (A - B) == EmptySet and (B - A) == EmptySet


def check_l2(sample):
    errs = []
    p = sample["params"]
    n, form, a, b, case = int(p["index"]), p["form"], int(p["a"]), int(p["b"]), p["case"]
    if form == "lin":
        R, den, body = a * X + b, 1, lin_tex(a, b)
    elif form == "quad":
        R, den = a * X**2 + b, 1
        body = f"{'' if a == 1 else a}x^2 + {b}"
    elif form == "negsq":
        R, den = -a * (X - b) ** 2, 1
        body = f"-{'' if a == 1 else a}x^2" if b == 0 else f"-({lin_tex(1, -b)})^2"
        if b != 0 and a != 1:
            errs.append("negsq with a coefficient and a shift")
    elif form == "frac":
        k = int(p["k"])
        if k <= 0:
            errs.append("numerator must be positive")
        R, den = Rational(k) / (a * X + b), a * X + b
        body = rf"\dfrac{{{k}}}{{{lin_tex(a, b)}}}"
    else:
        return [f"unknown form {form}"], None
    if sample["problem"] != rt(n, body):
        errs.append(f"problem {sample['problem']!r} does not match params ({rt(n, body)!r})")
    dom = S.Reals if den == 1 else S.Reals - solveset(den, X, S.Reals)
    truth = solveset(R >= 0, X, S.Reals).intersect(dom) if n % 2 == 0 else dom
    kind = {
        "lin": "pari" if n % 2 == 0 else "dispari",
        "quad": "sempre",
        "negsq": "nulla",
        "frac": "denominatore pari" if n % 2 == 0 else "denominatore dispari",
    }[form]
    if kind != case:
        errs.append(f"case {case!r} but the radical is {kind!r}")
    if form == "lin" and (abs(a) > 5 or abs(b) > 30):
        errs.append("coefficients too large")
    ch = sample["answer"]
    if ch["kind"] != "choice":
        return errs + ["answer must be a choice"], case
    for o in ch["options"]:
        if o["latex"] != cond_tex(o["values"][0]):
            errs.append(f"option {o['latex']!r} does not say {o['values']}")
    check_choice(ch, lambda o: same(cond_set(o["values"][0]), truth), errs)
    return errs, case


# ---------------------------------------------------------------------------
# Expressions written with |...|, implicit products and ^{k}


def tex_to_sym(t):
    s = t.replace(r"\left", "").replace(r"\right", "")
    s = re.sub(r"\|([^|]*)\|", r"Abs(\1)", s)
    s = re.sub(r"\^\{?(\d+)\}?", r"**\1", s)
    s = re.sub(r"(\d)\s*([A-Za-z(])", r"\1*\2", s)
    s = re.sub(r"(?<=[\w)])\s+(?=[A-Za-z(])", "*", s)
    if not re.fullmatch(r"[0-9xab+\-*/() Abs]*", s):
        raise ValueError(f"unreadable {t!r}")
    return sympify(s, locals=SYMS)


POINTS = [Rational(v) for v in (-20, -15, -12, -9, -7, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 7, 9, 12, 15, 20)] + [Rational(k, 2) for k in (-7, -3, -1, 1, 3, 7)]


def check_l3(sample):
    errs = []
    p = sample["params"]
    n, v, pp, s, case = int(p["index"]), p["variable"], int(p["p"]), int(p["s"]), p["case"]
    V = SYMS[v]
    if case == "monomio":
        base = pp * V
        cn = pp**n
        body = f"{'' if cn == 1 else cn}{v}^{n}"
        if n % 2:
            errs.append("monomio with odd index")
    else:
        if gcd(pp, s) != 1 or s == 0:
            errs.append("binomial not primitive")
        base = pp * V + s
        if case == "trinomio":
            if n != 2:
                errs.append("trinomio needs index 2")
            body = f"{'' if pp * pp == 1 else pp * pp}{v}^2 {'-' if s < 0 else '+'} {2 * pp * abs(s)}{v} + {s * s}"
        else:
            body = f"({lin_tex(pp, s, v)})^{n}"
            want = "binomio pari" if n % 2 == 0 else "binomio dispari"
            if want != case:
                errs.append(f"case {case!r} with index {n}")
    if sample["problem"] != rt(n, body):
        errs.append(f"problem {sample['problem']!r} does not match params ({rt(n, body)!r})")
    radicand = tex_to_sym(body)

    def truth(t):
        return real_root(radicand.subs(V, t), n)

    def equal(e):
        return all(e.subs(V, t) == truth(t) for t in POINTS)

    ans = sample["answer"]
    if ans["kind"] != "expression":
        return errs + ["answer must be an expression"], case
    a_val = sympify(ans["value"], locals=SYMS)
    if not equal(a_val):
        errs.append(f"answer {ans['value']} is not the root")
    if a_val != tex_to_sym(ans["latex"]):
        errs.append(f"answer latex {ans['latex']!r} != value {ans['value']}")
    if "sqrt" in ans["latex"]:
        errs.append("answer still has a root")
    ch = the_choice(sample)
    for o in ch["options"]:
        if sympify(o["values"][0], locals=SYMS).expand() != tex_to_sym(o["latex"]).expand():
            errs.append(f"option {o['latex']!r} != {o['values']}")
    check_choice(ch, lambda o: equal(sympify(o["values"][0], locals=SYMS)), errs)
    return errs, case


# ---------------------------------------------------------------------------
# Level 4: numeric radicals, compared exactly (root(N, m) = root(P, n) iff N^n = P^m)

RAD_RE = re.compile(r"\\sqrt(?:\[(\d+)\])?\{(.*)\}")


def read_rad_tex(t):
    m = RAD_RE.fullmatch(t)
    if not m:
        raise ValueError(f"not a radical: {t!r}")
    k = int(m.group(1) or 2)
    if k < 2:
        raise ValueError(f"index {k} in {t!r}")
    body = m.group(2)
    if not re.fullmatch(r"[0-9^{} ]*(?:\\cdot[0-9^{} ]*)*", body):
        raise ValueError(f"radicand not numeric: {body!r}")
    val = 1
    for f in body.split(r"\cdot"):
        f = f.strip()
        mm = re.fullmatch(r"(\d+)(?:\^\{(\d+)\})?", f)
        if not mm:
            raise ValueError(f"bad factor {f!r}")
        if mm.group(2) == "1":
            raise ValueError("exponent 1 written")
        val *= int(mm.group(1)) ** int(mm.group(2) or 1)
    return k, val


def read_rad_value(s):
    m = re.fullmatch(r"sqrt\((\d+)\)|root\((\d+), (\d+)\)", s)
    if not m:
        raise ValueError(f"not a numeric radical value: {s!r}")
    return (2, int(m.group(1))) if m.group(1) else (int(m.group(3)), int(m.group(2)))


def irreducible(k, N):
    return gcd(k, *factorint(N).values()) == 1 if N > 1 else False


def check_l4(sample):
    errs = []
    p = sample["params"]
    n, fs, shown, case = int(p["index"]), p["factors"], p["shown"], p["case"]
    P = 1
    for f in fs:
        P *= int(f["p"]) ** int(f["e"])
    if sorted(int(f["p"]) for f in fs) != [int(f["p"]) for f in fs] or any(factorint(int(f["p"])) != {int(f["p"]): 1} for f in fs):
        errs.append("factors must be increasing primes")
    fac_tex = r" \cdot ".join(str(f["p"]) if int(f["e"]) == 1 else f"{f['p']}^{{{f['e']}}}" for f in fs)
    body = str(P) if shown == "numero" else fac_tex
    if sample["problem"] != rt(n, body):
        errs.append(f"problem {sample['problem']!r} does not match params")
    g = gcd(n, *[int(f["e"]) for f in fs])
    if (case == "irriducibile") != (g == 1):
        errs.append(f"case {case!r} but the MCD is {g}")
    ans = sample["answer"]
    if ans["kind"] != "expression" or ans.get("form") != "irreducible":
        return errs + ["answer must be an expression with form irreducible"], case
    m, N = read_rad_value(ans["value"])
    if N**n != P**m:
        errs.append(f"answer {ans['value']} != {sample['problem']}")
    if not irreducible(m, N):
        errs.append(f"answer {ans['value']} is not irreducible")
    if read_rad_tex(ans["latex"]) != (m, N):
        errs.append("answer latex != value")
    if case != "irriducibile" and (m != n // g or N > 500):
        errs.append(f"answer index {m}, expected {n // g}; radicand {N} at most 500")
    if n > 20:
        errs.append(f"index {n} > 20")
    ch = the_choice(sample)
    for o in ch["options"]:
        if read_rad_tex(o["latex"]) != read_rad_value(o["values"][0]):
            errs.append(f"option {o['latex']!r} != {o['values']}")

    def ok(o):
        k, R = read_rad_value(o["values"][0])
        return R**n == P**k and irreducible(k, R)

    check_choice(ch, ok, errs)
    return errs, case


# ---------------------------------------------------------------------------
# Level 5: radicals with letters, evaluated where the original exists


def split_real(s):
    m = re.fullmatch(r"sqrt\((.*)\)", s)
    if m:
        return 2, m.group(1)
    m = re.fullmatch(r"real_root\((.*), (\d+)\)", s)
    if m:
        return int(m.group(2)), m.group(1)
    raise ValueError(f"not a radical: {s!r}")


def value_at(k, radicand, at):
    R = Rational(radicand.subs(at))
    if k % 2 == 0 and R < 0:
        return None
    return real_root(R, k)


def close(u, v):
    return abs((u - v).evalf(40)) < 1e-25


def lf_tex(v, c, e):
    b = v if c == 0 else lin_tex(1, c, v)
    if c == 0:
        return b if e == 1 else f"{b}^{{{e}}}"
    return b if e == 1 else f"({b})^{{{e}}}"


def exps_of(radicand):
    return radicand.as_powers_dict()


def check_l5(sample):
    errs = []
    p = sample["params"]
    n, fs, case = int(p["index"]), p["factors"], p["case"]
    body = " ".join(lf_tex(f["v"], int(f["c"]), int(f["e"])) for f in fs)
    if sample["problem"] != rt(n, body):
        errs.append(f"problem {sample['problem']!r} does not match params ({rt(n, body)!r})")
    orig = 1
    for f in fs:
        orig *= (SYMS[f["v"]] + int(f["c"])) ** int(f["e"])
    names = sorted({f["v"] for f in fs})
    grid = [Rational(v) for v in (-3, -2, 2, 3)] + [Rational(-1, 2), Rational(1, 2)] if len(names) > 1 else POINTS
    pts = [dict(zip([SYMS[v] for v in names], vals)) for vals in product(grid, repeat=len(names))]
    defined = [(at, value_at(n, orig, at)) for at in pts]
    defined = [(at, t) for at, t in defined if t is not None]
    E = [int(f["e"]) for f in fs]
    g = gcd(n, *E)
    if g == 1:
        errs.append("nothing to simplify")
    # the case from the structure
    all_even = all(e % 2 == 0 for e in E)
    kind = (
        "indice dispari" if n % 2 == 1
        else "condizioni" if not all_even
        else "senza valore assoluto" if all((e // g) % 2 == 0 for e in E)
        else "valore assoluto"
    )
    if kind != case:
        errs.append(f"case {case!r} but the radical is {kind!r}")
    if kind == "condizioni" and len(fs) != 1:
        errs.append("condizioni with more than one base")

    def read(o_val):
        k, inner = split_real(o_val)
        if k < 2:
            raise ValueError(f"index {k} in {o_val!r}")
        return k, sympify(inner, locals=SYMS)

    def equal(k, rad):
        for at, t in defined:
            v = value_at(k, rad, at)
            if v is None or not close(v, t):
                return False
        return True

    def irreducible_l(k, rad):
        return gcd(k, *[int(e) for e in exps_of(rad).values()]) == 1

    ans = sample["answer"]
    if ans["kind"] != "expression" or ans.get("form") != "irreducible":
        return errs + ["answer must be an expression with form irreducible"], case
    k, rad = read(ans["value"])
    if not equal(k, rad):
        errs.append(f"answer {ans['value']} != {sample['problem']} at some point")
    if not irreducible_l(k, rad):
        errs.append(f"answer {ans['value']} not irreducible")
    if k != n // g:
        errs.append(f"answer index {k}, expected {n // g}")
    # the absolute value exactly where the lesson puts it
    for base, e in exps_of(rad).items():
        has_abs = isinstance(base, Abs)
        need = n % 2 == 0 and kind != "condizioni" and int(e) % 2 == 1
        if has_abs != need:
            errs.append(f"absolute value on {base}**{e}: {has_abs}, expected {need}")
    m = RAD_RE.fullmatch(ans["latex"])
    if not m or int(m.group(1) or 2) != k or tex_to_sym(m.group(2)) != rad:
        errs.append(f"answer latex {ans['latex']!r} != value {ans['value']}")
    # SymPy writes |a|^2 as a^2 for a real a, so the bars are read on the LaTeX: only on odd exponents
    for bars in re.finditer(r"\|[^|]*\|(?:\^\{(\d+)\})?", ans["latex"]):
        if int(bars.group(1) or 1) % 2 == 0:
            errs.append(f"absolute value on an even exponent in {ans['latex']!r}")
        if n % 2 == 1 or kind == "condizioni":
            errs.append(f"absolute value not needed in {ans['latex']!r}")
    ch = the_choice(sample)
    for o in ch["options"]:
        m = RAD_RE.fullmatch(o["latex"])
        kk, rr = read(o["values"][0])
        if not m or int(m.group(1) or 2) != kk or tex_to_sym(m.group(2)) != rr:
            errs.append(f"option {o['latex']!r} != {o['values']}")
    check_choice(ch, lambda o: equal(*read(o["values"][0])) and irreducible_l(*read(o["values"][0])), errs)
    return errs, case


# ---------------------------------------------------------------------------
# Level 6: same index


def term_body(t):
    if "a" in t:
        return str(t["a"])
    return "x" if int(t["e"]) == 1 else f"x^{{{t['e']}}}"


def check_l6(sample):
    errs = []
    p = sample["params"]
    items, case = p["items"], p["case"]
    ks = [int(t["k"]) for t in items]
    L = ilcm(*ks)
    if sample["problem"] != r" \quad ".join(rt(int(t["k"]), term_body(t)) for t in items):
        errs.append("problem does not match params")
    if int(p["index"]) != L or L > 12 or L == max(ks) or len(set(ks)) != len(ks):
        errs.append(f"indices {ks}: common index {L} not in spec")
    letters = all("e" in t for t in items)
    if (case == "lettere") != letters or (not letters and case != {2: "due", 3: "tre"}.get(len(items))):
        errs.append(f"case {case!r} does not match the items")
    for t in items:
        k = int(t["k"])
        if "a" in t:
            a = int(t["a"])
            if a < 2 or gcd(k, *factorint(a).values()) > 1:
                errs.append(f"radical {t} not irreducible")
        elif gcd(k, int(t["e"])) != 1:
            errs.append(f"radical {t} not irreducible")

    def parse(o):
        key = o["values"][0].split("|")
        if int(key[0]) < 2:
            raise ValueError(f"index {key[0]}")
        return int(key[0]), key[1:]

    def equal_all(K, bodies):
        if len(bodies) != len(items):
            return False
        for t, b in zip(items, bodies):
            k = int(t["k"])
            if "a" in t:
                if not re.fullmatch(r"\d+", b) or int(b) ** k != int(t["a"]) ** K:
                    return False
            else:
                m = re.fullmatch(r"x(?:\^\{(\d+)\})?", b)
                if not m or int(m.group(1) or 1) * k != int(t["e"]) * K:
                    return False
        return True

    ch = sample["answer"]
    if ch["kind"] != "choice":
        return errs + ["answer must be a choice"], case
    for o in ch["options"]:
        K, bodies = parse(o)
        if o["latex"] != r",\ ".join(rt(K, b) for b in bodies):
            errs.append(f"option {o['latex']!r} != {o['values']}")
    check_choice(ch, lambda o: parse(o)[0] == L and equal_all(parse(o)[0], parse(o)[1]), errs)
    return errs, case


# ---------------------------------------------------------------------------
# Level 7: order


def item_tex(t):
    s, k, a = int(t["s"]), int(t["k"]), int(t["a"])
    if k == 1:
        return str(s * a)
    if a < 0:
        return rt(k, str(a))
    return ("-" if s < 0 else "") + rt(k, str(a))


def item_value(t):
    s, k, a = int(t["s"]), int(t["k"]), int(t["a"])
    return s * (Rational(a) if k == 1 else real_root(Rational(a), k))


def check_l7(sample):
    errs = []
    p = sample["params"]
    items, case = p["items"], p["case"]
    if len(items) != 3:
        return ["need three numbers"], case
    if sample["problem"] != r" \quad ".join(item_tex(t) for t in items):
        errs.append("problem does not match params")
    vals = [item_value(t) for t in items]
    num = [v.evalf(50) for v in vals]
    if len({str(v) for v in num}) != 3 or any(v.is_rational and int(t["k"]) > 1 for v, t in zip(vals, items)):
        errs.append("values not distinct, or a radical that is an integer")
    truth = sorted(range(3), key=lambda i: num[i])
    ints = [t for t in items if int(t["k"]) == 1]
    kind = "intero" if ints else "negativi" if all(v < 0 for v in num) else "positivi" if all(v > 0 for v in num) else None
    if kind != case:
        errs.append(f"case {case!r} but the numbers are {kind!r}")
    if case == "negativi" and not (any(int(t["a"]) < 0 for t in items) and any(int(t["s"]) < 0 for t in items)):
        errs.append("negativi needs both forms, root of a negative and minus in front")
    ks = [int(t["k"]) for t in items if int(t["k"]) > 1]
    L = ilcm(*ks)
    if L > 12 or len(set(ks)) < 2 and case != "intero":
        errs.append(f"indices {ks}")
    if any(abs(int(t["a"])) ** (L // int(t["k"])) > 5000 for t in items):
        errs.append("radicands at the common index above 5000")
    if case != "negativi":
        by_rad = sorted(range(3), key=lambda i: (abs(int(items[i]["a"])), i))
        if by_rad == truth:
            errs.append("ordering the radicands already gives the answer: no trap")
    ch = sample["answer"]
    if ch["kind"] != "choice":
        return errs + ["answer must be a choice"], case

    def order(o):
        m = re.fullmatch(r"ord:(\d),(\d),(\d)", o["values"][0])
        return [int(g) for g in m.groups()] if m else None

    for o in ch["options"]:
        od = order(o)
        if od is None or sorted(od) != [0, 1, 2] or o["latex"] != " < ".join(item_tex(items[i]) for i in od):
            errs.append(f"option {o['latex']!r} != {o['values']}")
    check_choice(ch, lambda o: order(o) == truth, errs)
    return errs, case


CHECK = {1: check_l1, 2: check_l2, 3: check_l3, 4: check_l4, 5: check_l5, 6: check_l6, 7: check_l7}


def check(sample):
    lvl = sample.get("level")
    if lvl not in CHECK:
        return [f"unknown level {lvl}"], None
    errs = []
    if not sample.get("steps") or not sample.get("solution"):
        errs.append("no steps or no solution")
    for name, rx in FORBIDDEN:
        if name == "zero term" and lvl == 1:
            continue  # 0{,}09 is a decimal, not a zero term
        if rx.search(sample["problem"]):
            errs.append(f"problem contains forbidden {name!r}: {sample['problem']}")
    e, kind = CHECK[lvl](sample)
    return errs + e, kind
