"""iperbole-equilatera (lesson 120), from specs/exercises/iperbole-equilatera.md.

Written from the spec, not from the generator. The curve or the function is read back from the LaTeX of the
problem; vertices and foci of xy = k are checked on the curve and on the definition of hyperbola, the asymptotes of
a homographic function are found with SymPy (the zero of the denominator, the limit at infinity), and in the last
level each option is tested on the two asymptotes and on the point.
"""
import re
from math import gcd

from sympy import N, Rational, limit, oo, solveset, S, sqrt

from checkers._ellisse_iperbole import X, check_options, common, same_params, linear_tex, num, on_axis, point_tex, read_axis

SIGNS = {"k positivo": (0.4, 0.6), "k negativo": (0.4, 0.6)}
CASE_RANGES = {
    1: {"asse x": (0.4, 0.6), "asse y": (0.4, 0.6)},
    2: SIGNS,
    3: SIGNS,
    4: {"verticale": (0.25, 0.42), "orizzontale": (0.25, 0.42), "centro": (0.25, 0.42)},
}

K_POOL = {1, 2, 4, 8, 9, 16, 18, 25, 32, 36, 49, 50}


def level1(s, ch, errs):
    m = re.fullmatch(r"x\^2 - y\^2 = (-?\d+)", s["problem"])
    if not m:
        errs.append("not x^2 - y^2 = k")
        return None
    k = int(m.group(1))
    same_params(s["params"], errs, k=k)
    if abs(k) not in K_POOL:
        errs.append(f"k = {k} out of spec")
    axis = "x" if k > 0 else "y"
    # a = b, so c^2 = a^2 + b^2 = 2a^2, and the eccentricity is sqrt(2)
    c2 = abs(k) + abs(k)
    if sqrt(c2) / sqrt(abs(k)) != sqrt(2):
        errs.append("eccentricity is not sqrt(2)")
    check_options(ch, read_axis("F"), (axis, c2), errs)
    if on_axis(s["solution"], "F") != (axis, c2):
        errs.append("solution differs")
    return f"asse {axis}"


def read_xy(s, errs):
    m = re.fullmatch(r"xy = (-?\d+)", s["problem"])
    if not m:
        errs.append("not xy = k")
        return None
    same_params(s["params"], errs, k=int(m.group(1)))
    return int(m.group(1))


def read_point(letter):
    def read(o):
        return point_tex(o["latex"], letter), tuple(Rational(v) for v in o["values"])

    return read


def level2(s, ch, errs):
    k = read_xy(s, errs)
    if k is None:
        return None
    n = sqrt(abs(k))
    if not n.is_integer or not 2 <= n <= 7:
        errs.append(f"k = {k} out of spec")
    # the vertex with positive abscissa: on the curve, on a bisector, x > 0
    good = [i for i, o in enumerate(ch["options"]) if (lambda x, y: x > 0 and x * y == k and abs(x) == abs(y))(*point_tex(o["latex"], "V"))]
    if good != [ch.get("correct")]:
        errs.append(f"vertex options {good}, correct {ch.get('correct')}")
    check_options(ch, read_point("V"), (n, n if k > 0 else -n), errs)
    return "k positivo" if k > 0 else "k negativo"


def level3(s, ch, errs):
    k = read_xy(s, errs)
    if k is None:
        return None
    f = sqrt(2 * abs(k))
    if not f.is_integer or not 2 <= f <= 10:
        errs.append(f"k = {k} out of spec")
    sg = 1 if k > 0 else -1
    F1, F2 = (f, sg * f), (-f, -sg * f)
    # the definition on the point (1, k): the difference of the distances is 2a = 2 sqrt(2|k|)
    P = (1, k)
    d = lambda F: sqrt((P[0] - F[0]) ** 2 + (P[1] - F[1]) ** 2)  # noqa: E731
    if abs(N(abs(d(F1) - d(F2)) - 2 * sqrt(2 * abs(k)), 30)) > 1e-20:
        errs.append("the foci do not satisfy the definition")
    check_options(ch, read_point("F"), F1, errs)
    return "k positivo" if k > 0 else "k negativo"


def homographic(tex):
    """ "y = \\frac{2x + 1}{x - 1}" -> (a, b, c, d)."""
    m = re.fullmatch(r"y = \\frac\{(.+)\}\{(.+)\}", tex.strip())
    if not m:
        raise ValueError(f"not a homographic function: {tex!r}")
    a, b = linear_tex(m.group(1))
    c, d = linear_tex(m.group(2))
    return a, b, c, d


def asymptotes(a, b, c, d):
    f = (a * X + b) / (c * X + d)
    (xv,) = solveset(c * X + d, X, S.Reals)
    yh = limit(f, X, oo)
    if limit(f, X, -oo) != yh or yh in (oo, -oo):
        raise ValueError("no horizontal asymptote")
    return xv, yh


def read_line(o):
    m = re.fullmatch(r"([xy]) = (.+)", o["latex"])
    return (m.group(1), num(m.group(2))), (o["values"][0], Rational(o["values"][1]))


def level4(s, ch, errs):
    a, b, c, d = homographic(s["problem"])
    same_params(s["params"], errs, a=a, b=b, c=c, d=d)
    if c != 1 or not all(v.is_integer for v in (a, b, d)) or a == 0 or d == 0 or abs(a) > 5 or abs(d) > 6 or abs(b) > 9 or a * d == b * c or a == -d:
        errs.append("coefficients out of spec")
    xv, yh = asymptotes(a, b, c, d)
    if "asintoto verticale" in s["prompt"]:
        case = "verticale"
        check_options(ch, read_line, ("x", xv), errs)
    elif "asintoto orizzontale" in s["prompt"]:
        case = "orizzontale"
        check_options(ch, read_line, ("y", yh), errs)
    elif "centro" in s["prompt"]:
        case = "centro"
        check_options(ch, read_point("C"), (xv, yh), errs)
    else:
        errs.append(f"prompt {s['prompt']!r}")
        return None
    return case


def level5(s, ch, errs):
    a, b, c, d = homographic(s["problem"])
    same_params(s["params"], errs, a=a, b=b, c=c, d=d)
    ints = all(v.is_integer for v in (a, b, c, d))
    if not ints or c not in (2, 3, 4, -2, -3) or a == 0 or d == 0 or abs(a) > 6 or abs(d) > 6 or abs(b) > 9 or a * d == b * c:
        errs.append("coefficients out of spec")
    elif gcd(gcd(abs(int(a)), abs(int(b))), gcd(abs(int(c)), abs(int(d)))) != 1:
        errs.append("coefficients with a common divisor")
    xv, yh = asymptotes(a, b, c, d)
    if xv.is_integer and yh.is_integer:
        errs.append("integer centre at level 5")
    check_options(ch, read_point("C"), (xv, yh), errs)
    return "centro"


def level6(s, ch, errs):
    parts = s["problem"].split(r" \qquad ")
    if len(parts) != 3 or not parts[0].startswith("x = ") or not parts[1].startswith("y = "):
        errs.append("givens unreadable")
        return None
    p, q = num(parts[0][4:]), num(parts[1][4:])
    x0, y0 = point_tex(parts[2], "P")
    same_params(s["params"], errs, p=p, q=q, x0=x0, y0=y0)
    k = (y0 - q) * (x0 - p)
    if not all(v.is_integer and v != 0 and abs(v) <= 5 for v in (p, q)) or k == 0 or abs(k) > 6 or abs(x0 - p) > 3:
        errs.append("givens out of spec")
    good = []
    seen = set()
    for i, o in enumerate(ch["options"]):
        a, b, c, d = homographic(o["latex"])
        if (a, b, c, d) != tuple(Rational(v) for v in o["values"]):
            errs.append(f"option {o['latex']!r} differs from its values")
        seen.add((a, b, c, d))
        if a * d == b * c:
            errs.append(f"option {o['latex']!r} is not a homographic function (ad - bc = 0)")
            continue
        xv, yh = asymptotes(a, b, c, d)
        if xv == p and yh == q and c * x0 + d != 0 and (a * x0 + b) / (c * x0 + d) == y0:
            good.append(i)
    if len(ch["options"]) != 4 or len(seen) != 4:
        errs.append("four distinct options expected")
    if good != [ch.get("correct")]:
        errs.append(f"right options {good}, correct {ch.get('correct')}")
    else:
        a, b, c, d = homographic(ch["options"][good[0]]["latex"])
        if (c, d) != (1, -p) or (a, b) != (q, k - p * q):
            errs.append("the answer is not reduced to one fraction with denominator x - p")
    return "asintoti e punto"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs, ch = common(sample)
    fn = LEVELS.get(sample["level"])
    if fn is None:
        return [f"unknown level {sample['level']}"], None
    if ch is None:
        return errs, None
    kind = fn(sample, ch, errs)
    if kind != sample["params"].get("case"):
        errs.append(f"case {sample['params'].get('case')!r} but the exercise is {kind!r}")
    return errs, kind
