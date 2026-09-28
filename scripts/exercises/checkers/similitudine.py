"""similitudine (Similitudine), from specs/exercises/similitudine.md.

Written from the spec, not from the generator. Every datum is read back from the text the student sees
(the prose of the problem and the options), never from params, and the answer is found again with
geometry, mostly with exact SymPy coordinates:

- level 1: two rectangles, similar when the ratios of the long sides and of the short sides agree;
- level 2: the third angles by the sum of 180, similar when the angles agree, the correspondence from
  the equal angles;
- level 3: a triangle with coordinates, the parallel to BC through D (or E) cut with the other side; the
  unknown side found with `solve`; the shadow with the sun ray as a line;
- level 4: every option is tested: three sides in proportion (sorted), or the same angle between two
  sides in proportion; exactly one option may be similar;
- level 5: the correspondence of vertices from the two angles, the homologous sides opposite congruent
  angles, and the triangle DEF built with coordinates to measure the asked side;
- level 6: the trapezoid with coordinates (two different shapes), O as the meeting point of the
  diagonals; the unknown base found with `solve`;
- level 7: a triangle with the given side and perimeter (or area), scaled by k with coordinates; k from
  the areas; the map as a rectangle scaled by the scale;
- level 8: the right angle in C found as the intersection of the circle on AB (Thales) with the
  perpendicular in H or with the circle of radius AC; the answer measured on the figure.
"""
import math
import re

from sympy import Circle, Line, Point, Polygon, Rational, Symbol, factorint, nsimplify, simplify, solve, sqrt, sympify

CASE_RANGES = {
    1: {"simili": (0.40, 0.60), "non simili": (0.40, 0.60)},
    2: {"simili": (0.65, 0.85), "non simili": (0.15, 0.35)},
    3: {"DE": (0.27, 0.43), "parte": (0.27, 0.43), "ombra": (0.22, 0.38)},
    4: {"terzo criterio": (0.40, 0.60), "secondo criterio": (0.40, 0.60)},
    6: {"parte": (0.60, 0.80), "base": (0.20, 0.40)},
    7: {k: (0.18, 0.32) for k in ["perimetro", "area", "aree", "mappa"]},
    8: {k: (0.25, 0.42) for k in ["altezza", "cateto", "proiezione"]},
}

UNITS = {"cm": r"\text{ cm}", "cm2": r"\text{ cm}^2", "m": r"\text{ m}", "m2": r"\text{ m}^2", "": ""}


# ---------------------------------------------------------------------------
# Text

def prose(tex):
    """The words of a LaTeX problem or option: environments, \\text{} and line breaks removed."""
    s = re.sub(r"\\(begin|end)\{(array|gathered)\}(\{l\})?", " ", tex)
    s = s.replace("\\\\", " ")
    out, i = "", 0
    while i < len(s):
        if s.startswith("\\text{", i):
            depth, j = 1, i + 6
            while depth:
                if s[j] == "{":
                    depth += 1
                elif s[j] == "}":
                    depth -= 1
                j += 1
            out += s[i + 6 : j - 1]
            i = j
        else:
            out += s[i]
            i += 1
    return re.sub(r"\s+", " ", out).strip()


def finite(r):
    d = Rational(r).q
    for f in (2, 5):
        while d % f == 0:
            d //= f
    return d == 1


def ndec(r):
    if not finite(r):
        return None
    k = 0
    while (r * 10**k).q != 1:
        k += 1
    return k


def num(s):
    """12, 3{,}5, 1\\,000, \\frac{10}{3} -> Rational, only in the reduced form the lesson writes."""
    s = s.strip()
    ip = re.match(r"\d[0-9\\,]*", s)
    if ip:
        digits = ip.group(0).replace("\\,", "")
        want = f"{int(digits):,}".replace(",", "\\,") if len(digits) >= 5 else digits
        if ip.group(0) != want:
            raise ValueError(f"thousands not grouped as the lesson does: {s}")
    s = s.replace("\\,", "")
    m = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        n, d = int(m.group(1)), int(m.group(2))
        if math.gcd(n, d) != 1 or d == 1:
            raise ValueError(f"fraction not reduced: {s}")
        r = Rational(n, d)
        if finite(r):
            raise ValueError(f"finite decimal written as a fraction: {s}")
        return r
    m = re.fullmatch(r"(\d+)(?:\{,\}(\d+))?", s)
    if not m:
        raise ValueError(f"not a number: {s!r}")
    if m.group(2) and m.group(2).endswith("0"):
        raise ValueError(f"trailing zero: {s}")
    if len(m.group(1)) > 1 and m.group(1).startswith("0"):
        raise ValueError(f"leading zero: {s}")
    return Rational(s.replace("{,}", "."))


def value(s):
    """A number or k\\sqrt{r} with r square-free and k != 1 written."""
    m = re.fullmatch(r"(\d*)\\sqrt\{(\d+)\}", s.strip())
    if m:
        k = int(m.group(1)) if m.group(1) else 1
        r = int(m.group(2))
        if m.group(1) == "1" or r < 2 or any(e > 1 for e in factorint(r).values()):
            raise ValueError(f"radical not reduced: {s}")
        return k * sqrt(r)
    return num(s)


def option_value(latex, unit):
    suffix = UNITS[unit]
    if not latex.endswith(suffix):
        raise ValueError(f"option not in {unit or 'no unit'}: {latex}")
    body = latex[: len(latex) - len(suffix)] if suffix else latex
    if "\\text" in body:
        raise ValueError(f"option not in {unit or 'no unit'}: {latex}")
    return value(body)


def dist(p, q):
    return simplify(p.distance(q))


def check_choice_shape(ch, errs):
    if not ch or ch.get("kind") != "choice":
        errs.append("no choice variant")
        return None
    opts = ch["options"]
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    if len({o["latex"] for o in opts}) != len(opts) or len({"|".join(o["values"]) for o in opts}) != len(opts):
        errs.append("options not distinct")
    if not 0 <= ch["correct"] < len(opts):
        errs.append("correct index out of range")
        return None
    return opts


def pick_truth(opts, keys, truth, correct, errs):
    """keys: the mathematical object of each option; exactly one equal to truth, and it is `correct`."""
    if len(set(keys)) != len(keys):
        errs.append(f"options equal as objects: {keys}")
    right = [i for i, k in enumerate(keys) if k == truth]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth {truth}")
    elif right[0] != correct:
        errs.append("correct points to a wrong option")


def check_value_answer(sample, truth, unit, errs):
    ans = sample["answer"]
    truth = nsimplify(truth)
    if truth.is_rational:
        if ans.get("kind") != "number":
            errs.append("rational answer not a number")
        elif Rational(ans["value"]) != truth:
            errs.append(f"answer {ans['value']} != truth {truth}")
        elif ndec(truth) is None and sample["level"] != 7:
            errs.append(f"periodic answer {truth}")
    else:
        if ans.get("kind") != "expression" or ans.get("form") != "simplified":
            errs.append("irrational answer must be an expression in simplified form")
        else:
            if simplify(sympify(ans["value"]) - truth) != 0:
                errs.append(f"answer {ans['value']} != truth {truth}")
            try:
                if simplify(value(ans["latex"]) - truth) != 0:
                    errs.append(f"answer latex {ans['latex']} != truth {truth}")
            except ValueError as e:
                errs.append(str(e))
    ch = check_choice_shape(sample.get("choice"), errs)
    if ch is None:
        return
    vals = []
    for o in ch:
        try:
            v = option_value(o["latex"], unit)
        except ValueError as e:
            errs.append(str(e))
            return
        if simplify(sympify(o["values"][0]) - v) != 0:
            errs.append(f"option values {o['values']} != latex {o['latex']}")
        if v <= 0:
            errs.append(f"implausible option {v}")
        if v.is_rational and (ndec(v) or 0) > 2:
            errs.append(f"option with more than two decimals {o['latex']}")
        vals.append(simplify(v))
    pick_truth(ch, vals, simplify(truth), sample["choice"]["correct"], errs)
    if truth.is_rational and finite(truth) and any(v.is_rational and not finite(v) for v in vals):
        errs.append("a periodic fraction among options of a decimal answer")


def seg_values(text):
    """$\\overline{XY} = n$ -> {XY: Rational}."""
    return {m.group(1): num(m.group(2)) for m in re.finditer(r"\\overline\{([A-Z]'?[A-Z]'?)\} = ([0-9{},\\]+)\$", text)}


# ---------------------------------------------------------------------------
# Level 1

def check_l1(sample, errs):
    text = prose(sample["problem"])
    m = re.search(r"Il rettangolo \$R_1\$ ha i lati di \$(\d+)\$ cm e \$(\d+)\$ cm, il rettangolo \$R_2\$ di \$(\d+)\$ cm e \$(\d+)\$ cm\.", text)
    if not m:
        errs.append(f"rectangles not found: {text}")
        return None
    a1, b1, a2, b2 = (int(g) for g in m.groups())
    L1, S1 = max(a1, b1), min(a1, b1)
    L2, S2 = max(a2, b2), min(a2, b2)
    if L1 == S1 or L2 == S2:
        errs.append("a square among the rectangles")
    # Rectangles as polygons: similar when some scaling maps one onto the other.
    k = Rational(L2, L1)
    similar = Polygon(Point(0, 0), Point(L1 * k, 0), Point(L1 * k, S1 * k), Point(0, S1 * k)) == Polygon(Point(0, 0), Point(L2, 0), Point(L2, S2), Point(0, S2))
    truth = ("simili", k) if similar else ("non simili",)
    if similar and k == 1:
        errs.append("congruent rectangles")
    opts = check_choice_shape(sample["answer"], errs)
    if opts is None:
        return None
    keys = []
    for o in opts:
        if o["latex"] == r"\text{non simili}":
            keys.append(("non simili",))
            if o["values"] != ["non simili"]:
                errs.append("values of 'non simili'")
            continue
        mm = re.fullmatch(r"\\text\{simili, \}k = (.+)", o["latex"])
        if not mm:
            errs.append(f"bad option {o['latex']}")
            return None
        v = num(mm.group(1))
        if Rational(o["values"][1]) != v:
            errs.append(f"option values {o['values']} != latex {o['latex']}")
        keys.append(("simili", v))
    pick_truth(opts, keys, truth, sample["answer"]["correct"], errs)
    return "simili" if similar else "non simili"


# ---------------------------------------------------------------------------
# Level 2

def check_l2(sample, errs):
    text = prose(sample["problem"])
    got = re.findall(r"\\hat\{([A-F])\} = (\d+)\^\\circ", text)
    if len(got) != 4 or not re.search(r"Il triangolo \$ABC\$ ha .*; il triangolo \$DEF\$ ha .*\. Quale affermazione è vera\?", text):
        errs.append(f"angles not found: {text}")
        return None
    ang = {}
    for v, a in got:
        ang[v] = int(a)
    for tri in ("ABC", "DEF"):
        known = [v for v in tri if v in ang]
        if len(known) != 2:
            errs.append(f"{tri}: {len(known)} angles given")
            return None
        miss = [v for v in tri if v not in ang][0]
        ang[miss] = 180 - sum(ang[v] for v in known)
        if ang[miss] <= 0:
            errs.append(f"{tri}: the angles do not make a triangle")
            return None
    for tri in ("ABC", "DEF"):
        if len({ang[v] for v in tri}) != 3:
            errs.append(f"{tri} not scalene: the correspondence is not unique")
    similar = sorted(ang[v] for v in "ABC") == sorted(ang[v] for v in "DEF")
    truth = "ABC~" + "".join(next(w for w in "DEF" if ang[w] == ang[v]) for v in "ABC") if similar else "non simili"
    opts = check_choice_shape(sample["answer"], errs)
    if opts is None:
        return None
    keys = []
    for o in opts:
        mm = re.fullmatch(r"\\triangle ABC \\sim \\triangle ([DEF]{3})", o["latex"])
        if mm and len(set(mm.group(1))) == 3:
            keys.append("ABC~" + mm.group(1))
        elif o["latex"] == r"\text{non sono simili}":
            keys.append("non simili")
        else:
            errs.append(f"bad option {o['latex']}")
            return None
        if o["values"] != [keys[-1]]:
            errs.append(f"option values {o['values']} != latex {o['latex']}")
    pick_truth(opts, keys, truth, sample["answer"]["correct"], errs)
    if "ABC~DEF" not in keys and truth != "ABC~DEF":
        errs.append("the alphabetical correspondence is not among the options")
    return "simili" if similar else "non simili"


# ---------------------------------------------------------------------------
# Level 3

DIR = (Rational(-3, 5), Rational(4, 5))  # direction of the third side, any non-parallel one


def parallel_cut(av, aw, bc):
    """Triangle A W X with A at the origin, W on the x-axis at distance aw, WX of length bc; the parallel
    to WX through the point V of AW at distance av from A meets AX: returns that segment's length."""
    A, W = Point(0, 0), Point(aw, 0)
    X = Point(aw + bc * DIR[0], bc * DIR[1])
    V = Point(av, 0)
    par = Line(V, V + (X - W))
    P = par.intersection(Line(A, X))[0]
    return dist(V, P)


def check_l3(sample, errs):
    text = prose(sample["problem"])
    if text.startswith("Un bastone verticale"):
        m = re.search(r"alto \$([0-9{},]+)\$ m fa un'ombra lunga \$([0-9{},]+)\$ m\.", text)
        if not m:
            errs.append(f"stick not found: {text}")
            return None
        h, s = num(m.group(1)), num(m.group(2))
        ray = Point(s, -h)  # the sun ray goes down by h over s
        g = Point(0, 0)
        m1 = re.search(r"l'ombra di (?:un|una) \S+ è lunga \$([0-9{},]+)\$ m\. Quanto è alt[oa] (?:l'|il |la )\S+\?", text)
        m2 = re.search(r"alt[oa] \$([0-9{},]+)\$ m fa ombra\. Quanto è lunga l'ombra (dell'|del |della )\S+\?", text)
        if m1:
            S = num(m1.group(1))
            end = Point(S, 0)
            top = Line(end, end - ray).intersection(Line(g, Point(0, 1)))[0]
            truth = top.y
        elif m2:
            H = num(m2.group(1))
            top = Point(0, H)
            end = Line(top, top + ray).intersection(Line(g, Point(1, 0)))[0]
            truth = end.x
        else:
            errs.append(f"shadow question not found: {text}")
            return None
        check_value_answer(sample, truth, "m", errs)
        return "ombra"
    if not text.startswith("Nel triangolo $ABC$ il segmento $DE$ è parallelo a $BC$, con $D$ su $AB$ ed $E$ su $AC$."):
        errs.append(f"unknown text: {text}")
        return None
    data = seg_values(text)
    ask = re.search(r"Quanto è lungo \$([A-Z]{2})\$\?$", text)
    if not ask:
        errs.append("question not found")
        return None
    ask = ask.group(1)
    for v in data.values():
        if not v.is_integer or v <= 0:
            errs.append(f"datum {v} not a positive integer")
    if ask == "DE":
        if set(data) == {"AD", "DB", "BC"}:
            av, vw = data["AD"], data["DB"]
        elif set(data) == {"AE", "EC", "BC"}:
            av, vw = data["AE"], data["EC"]
        else:
            errs.append(f"data {sorted(data)}")
            return None
        truth = parallel_cut(av, av + vw, data["BC"])
        check_value_answer(sample, truth, "cm", errs)
        return "DE"
    first = {"DB": "AD", "EC": "AE"}.get(ask)
    if first is None or set(data) != {first, "DE", "BC"}:
        errs.append(f"data {sorted(data)} for {ask}")
        return None
    if data["DE"] >= data["BC"]:
        errs.append("DE not shorter than BC")
    s = Symbol("s", positive=True)
    sol = [x for x in solve(parallel_cut(data[first], s, data["BC"]) - data["DE"], s) if x > data[first]]
    if len(sol) != 1:
        errs.append(f"side not determined: {sol}")
        return None
    check_value_answer(sample, sol[0] - data[first], "cm", errs)
    return "parte"


# ---------------------------------------------------------------------------
# Level 4

def tri_from_sides(a, b, c):
    """Triangle with sides a = BC, b = CA, c = AB, exact coordinates; None if it does not exist."""
    if not (a + b > c and b + c > a and a + c > b):
        return None
    x = Rational(b**2 + c**2 - a**2, 2 * c)
    return Point(0, 0), Point(c, 0), Point(x, sqrt(b**2 - x**2))


def sorted_ratios_equal(s1, s2):
    a, b = sorted(s1), sorted(s2)
    return len({Rational(y, x) for x, y in zip(a, b)}) == 1


def check_l4(sample, errs):
    text = prose(sample["problem"])
    opts = check_choice_shape(sample["answer"], errs)
    if opts is None:
        return None
    data = seg_values(text)
    if "dati con i tre lati" in text:
        if set(data) != {"AB", "BC", "CA"}:
            errs.append(f"sides {sorted(data)}")
            return None
        abc = [data["BC"], data["CA"], data["AB"]]
        if tri_from_sides(*abc) is None:
            errs.append("triangle ABC does not exist")
        keys, sims = [], []
        for o in opts:
            m = re.fullmatch(r"\\text\{lati di \}(\d+), (\d+)\\text\{ e \}(\d+)\\text\{ cm\}", o["latex"])
            if not m:
                errs.append(f"bad option {o['latex']}")
                return None
            sides = [int(g) for g in m.groups()]
            if tri_from_sides(*sides) is None:
                errs.append(f"option {sides} is not a triangle")
            if sorted(sides) != [int(v) for v in o["values"]]:
                errs.append(f"option values {o['values']} != latex {o['latex']}")
            keys.append(tuple(sorted(sides)))
            sims.append(sorted_ratios_equal(abc, sides))
        kind = "terzo criterio"
    elif "dati con un angolo e i due lati che lo comprendono" in text:
        m = re.search(r"ha \$\\hat\{([ABC])\} = (\d+)\^\\circ\$, compreso tra i lati \$\\overline\{([ABC]{2})\} = (\d+)\$ cm e \$\\overline\{([ABC]{2})\} = (\d+)\$ cm\.", text)
        if not m:
            errs.append(f"angle and sides not found: {text}")
            return None
        v, alpha, n1, x, n2, y = m.groups()
        alpha, x, y = int(alpha), int(x), int(y)
        if v not in n1 or v not in n2 or n1 == n2 or n1 not in ("AB", "BC", "CA") or n2 not in ("AB", "BC", "CA"):
            errs.append("the sides do not include the angle")
        if not 0 < alpha < 180:
            errs.append("angle out of range")
        keys, sims = [], []
        for o in opts:
            mm = re.fullmatch(r"(\d+)\^\\circ\\text\{ tra i lati di \}(\d+)\\text\{ e \}(\d+)\\text\{ cm\}", o["latex"])
            if not mm:
                errs.append(f"bad option {o['latex']}")
                return None
            a2, u, w = (int(g) for g in mm.groups())
            if not 0 < a2 < 180 or u <= 0 or w <= 0:
                errs.append(f"option {o['latex']} is not a triangle")
            if [a2] + sorted([u, w]) != [int(z) for z in o["values"]]:
                errs.append(f"option values {o['values']} != latex {o['latex']}")
            keys.append((a2, tuple(sorted([u, w]))))
            # Same angle and the two sides in proportion, in one of the two pairings.
            sims.append(a2 == alpha and (Rational(u, x) == Rational(w, y) or Rational(u, y) == Rational(w, x)))
        kind = "secondo criterio"
    else:
        errs.append(f"unknown text: {text}")
        return None
    if len(set(keys)) != len(keys):
        errs.append("options equal as objects")
    if sims.count(True) != 1:
        errs.append(f"{sims.count(True)} similar options")
    elif sims.index(True) != sample["answer"]["correct"]:
        errs.append("correct points to a non-similar option")
    if kind == "terzo criterio" and keys[sample["answer"]["correct"]] == tuple(sorted(abc)):
        errs.append("the right option is ABC itself")
    return kind


# ---------------------------------------------------------------------------
# Level 5

def angle_at(P, Q, R):
    """Angle at P of triangle PQR, exact cosine."""
    u, v = Q - P, R - P
    return simplify((u.x * v.x + u.y * v.y) / (sqrt(u.x**2 + u.y**2) * sqrt(v.x**2 + v.y**2)))


def check_l5(sample, errs):
    text = prose(sample["problem"])
    data = seg_values(text)
    cong = re.findall(r"\\hat\{([DEF])\} \\cong \\hat\{([ABC])\}", text)
    ask = re.search(r"Quanto è lungo \$(DE|EF|FD)\$\?$", text)
    if len(cong) != 2 or not ask or not {"AB", "BC", "CA"} <= set(data):
        errs.append(f"data not found: {text}")
        return None
    ask = ask.group(1)
    given = [s for s in data if s in ("DE", "EF", "FD")]
    if len(given) != 1 or given[0] == ask:
        errs.append("one side of DEF, different from the asked one, must be given")
        return None
    given = given[0]
    pts = tri_from_sides(data["BC"], data["CA"], data["AB"])
    if pts is None:
        errs.append("ABC does not exist")
        return None
    P = dict(zip("ABC", pts))
    cosines = {v: angle_at(P[v], *[P[w] for w in "ABC" if w != v]) for v in "ABC"}
    if len(set(cosines.values())) != 3:
        errs.append("ABC not scalene")
    img = {abc: d for d, abc in cong}
    if len(set(img.values())) != 2 or len(set(img)) != 2:
        errs.append("bad correspondence")
        return None
    img[next(v for v in "ABC" if v not in img)] = next(d for d in "DEF" if d not in img.values())
    if img == {"A": "D", "B": "E", "C": "F"}:
        errs.append("alphabetical correspondence: no trap")
    # DEF built as the image of ABC: D, E, F at the images of the vertices, then scaled so the given side fits.
    Q = {img[v]: P[v] for v in "ABC"}
    base = dist(Q[given[0]], Q[given[1]])
    k = data[given] / base
    truth = simplify(k * dist(Q[ask[0]], Q[ask[1]]))
    # The angles really correspond: the angle of DEF at img(v) equals the angle of ABC at v.
    for v in "ABC":
        d = img[v]
        others = [Q[w] for w in "DEF" if w != d]
        if angle_at(Q[d], *others) != cosines[v]:
            errs.append("angle mismatch")
    if not finite(truth) or (ndec(truth) or 0) > 2:
        errs.append(f"answer {truth} not a short decimal")
    check_value_answer(sample, truth, "cm", errs)
    return "lati omologhi"


# ---------------------------------------------------------------------------
# Level 6

def trapezoid(a, b, d, diag, L):
    """A(0,0), B(a,0), D(d,h), C(d+b,h) with the diagonal `diag` of length L; None if impossible."""
    if diag == "AC":
        h2 = L**2 - (d + b) ** 2
    else:
        h2 = L**2 - (a - d) ** 2
    if h2 <= 0:
        return None
    h = sqrt(h2)
    return {"A": Point(0, 0), "B": Point(a, 0), "C": Point(d + b, h), "D": Point(d, h)}


def meet(T):
    return Line(T["A"], T["C"]).intersection(Line(T["B"], T["D"]))[0]


def check_l6(sample, errs):
    text = prose(sample["problem"])
    if not text.startswith("Nel trapezio $ABCD$ la base maggiore è $AB$ e la base minore è $CD$; le diagonali si incontrano in $O$."):
        errs.append(f"unknown text: {text}")
        return None
    data = seg_values(text)
    m = re.search(r"la diagonale \$(AC|BD)\$ misura \$(\d+)\$ cm\. Quanto è lungo \$(AO|OC|BO|OD)\$\?$", text)
    if m:
        diag, L, ask = m.group(1), int(m.group(2)), m.group(3)
        a, b = data.get("AB"), data.get("CD")
        if a is None or b is None or a <= b:
            errs.append("bases missing or not major > minor")
            return None
        if ask[0] not in diag and ask[1] not in diag:
            errs.append("asked segment not on that diagonal")
        results = set()
        for d in ((a - b) / 2, (a - b) / 2 + Rational(1, 3)):
            T = trapezoid(a, b, d, diag, L)
            if T is None:
                errs.append(f"trapezoid with d = {d} does not exist")
                continue
            O = meet(T)
            results.add(simplify(dist(O, T[ask.replace("O", "")])))
        if len(results) != 1:
            errs.append(f"answer depends on the shape: {results}")
            return None
        check_value_answer(sample, results.pop(), "cm", errs)
        return "parte"
    m = re.search(r"Quanto è lunga la base \$(AB|CD)\$\?$", text)
    if not m:
        errs.append(f"question not found: {text}")
        return None
    ask = m.group(1)
    parts = {k: v for k, v in data.items() if "O" in k}
    known = "CD" if ask == "AB" else "AB"
    if known not in data or len(parts) != 2:
        errs.append(f"data {sorted(data)}")
        return None
    names = sorted(parts)
    if names not in (["AO", "OC"], ["BO", "OD"]):
        errs.append(f"parts {names}")
        return None
    near, far = (parts["AO"], parts["OC"]) if "AO" in parts else (parts["BO"], parts["OD"])
    # Generic trapezoid with the unknown base x: O cuts the diagonal at t; AO / OC = t / (1 - t).
    x = Symbol("x", positive=True)
    a, b = (x, data["CD"]) if ask == "AB" else (data["AB"], x)
    A, B, C, D = Point(0, 0), Point(a, 0), Point(Rational(2, 7) + b, 1), Point(Rational(2, 7), 1)
    t, u = Symbol("t"), Symbol("u")
    sol = solve([A.x + t * (C.x - A.x) - (B.x + u * (D.x - B.x)), A.y + t * (C.y - A.y) - (B.y + u * (D.y - B.y))], [t, u], dict=True)[0]
    tt = sol[t] if "AO" in parts else sol[u]
    xs = [r for r in solve(tt / (1 - tt) - near / far, x) if r > 0]
    if len(xs) != 1:
        errs.append(f"base not determined: {xs}")
        return None
    AB, CD = (xs[0], data["CD"]) if ask == "AB" else (data["AB"], xs[0])
    if AB <= CD:
        errs.append("the major base is not the major one")
    if near <= far:
        errs.append("the part near the major base must be longer")
    check_value_answer(sample, xs[0], "cm", errs)
    return "base"


# ---------------------------------------------------------------------------
# Level 7

def check_l7(sample, errs):
    text = prose(sample["problem"])
    m = re.search(r"in scala \$1 : ([0-9\\,]+)\$ (?:una stanza|un giardino|un parco) è un rettangolo di \$([0-9{},]+)\$ cm per \$([0-9{},]+)\$ cm\. Quanto misura l'area vera, in metri quadrati\?", text)
    if m:
        n, w, h = num(m.group(1)), num(m.group(2)), num(m.group(3))
        # The real rectangle: every drawn length times n, in cm; then 1 m^2 = 10^4 cm^2.
        real = Polygon(Point(0, 0), Point(w * n, 0), Point(w * n, h * n), Point(0, h * n))
        check_value_answer(sample, abs(real.area) / 10**4, "m2", errs)
        return "mappa"
    m = re.search(r"Due triangoli simili \$ABC\$ e \$A'B'C'\$ hanno le aree di \$(\d+)\\ \\text\{cm\}\^2\$ e \$(\d+)\\ \\text\{cm\}\^2\$\.", text)
    if m:
        S1, S2 = int(m.group(1)), int(m.group(2))
        k = sqrt(Rational(S2, S1))
        if not k.is_rational:
            errs.append("k from the areas is not rational")
        if "Qual è il rapporto di similitudine $k$ di $A'B'C'$ rispetto ad $ABC$?" in text:
            check_value_answer(sample, k, "", errs)
            return "aree"
        mm = re.search(r"Il lato \$AB\$ misura \$(\d+)\$ cm\. Quanto misura il lato omologo \$A'B'\$\?", text)
        if not mm:
            errs.append(f"question not found: {text}")
            return None
        check_value_answer(sample, k * int(mm.group(1)), "cm", errs)
        return "aree"
    m = re.search(r"I triangoli \$ABC\$ e \$A'B'C'\$ sono simili\. Il lato \$AB\$ misura \$(\d+)\$ cm e il suo omologo \$A'B'\$ misura \$([0-9{},]+)\$ cm\.", text)
    if not m:
        errs.append(f"unknown text: {text}")
        return None
    a, b = num(m.group(1)), num(m.group(2))
    k = b / a
    if k == 1:
        errs.append("k = 1")
    mp = re.search(r"Il perimetro di \$ABC\$ è \$(\d+)\$ cm\. Quanto misura il perimetro di \$A'B'C'\$\?", text)
    ma = re.search(r"L'area di \$ABC\$ è \$(\d+)\\ \\text\{cm\}\^2\$\. Quanto misura l'area di \$A'B'C'\$\?", text)
    if mp:
        P = num(mp.group(1))
        if P <= 2 * a:
            errs.append("perimeter too short for a triangle with that side")
            return None
        leg = (P - a) / 2
        x = a / 2
        T = [Point(0, 0), Point(a, 0), Point(x, sqrt(leg**2 - x**2))]
        T2 = Polygon(*[Point(p.x * k, p.y * k) for p in T])
        check_value_answer(sample, simplify(T2.perimeter), "cm", errs)
        return "perimetro"
    if ma:
        S = num(ma.group(1))
        T = [Point(0, 0), Point(a, 0), Point(a / 3, 2 * S / a)]
        T2 = Polygon(*[Point(p.x * k, p.y * k) for p in T])
        check_value_answer(sample, abs(T2.area), "cm2", errs)
        return "area"
    errs.append(f"question not found: {text}")
    return None


# ---------------------------------------------------------------------------
# Level 8

def check_l8(sample, errs):
    text = prose(sample["problem"])
    if not text.startswith("Il triangolo $ABC$ è rettangolo in $C$ e $CH$ è l'altezza relativa all'ipotenusa $AB$."):
        errs.append(f"unknown text: {text}")
        return None
    data = seg_values(text)
    ask = re.search(r"Quanto è (?:lunga l'altezza|lungo il cateto|lunga la proiezione) \$(CH|AC|BC|AH|HB)\$\?$", text)
    if not ask:
        errs.append("question not found")
        return None
    ask = ask.group(1)
    for v in data.values():
        if v <= 0:
            errs.append("non-positive datum")
    A = Point(0, 0)
    if set(data) in ({"AH", "HB"}, {"AB", "AH"}, {"AB", "HB"}):
        c = data["AB"] if "AB" in data else data["AH"] + data["HB"]
        ah = data["AH"] if "AH" in data else c - data["HB"]
        if not 0 < ah < c:
            errs.append("H not inside AB")
            return None
        B = Point(c, 0)
        # C on the perpendicular to AB in H and on the circle with diameter AB (right angle in C).
        pts = [p for p in Circle(Point(c / 2, 0), c / 2).intersection(Line(Point(ah, 0), Point(ah, 1))) if p.y > 0]
    elif len(data) == 2 and "AB" in data and ({"AC", "BC"} & set(data)):
        c = data["AB"]
        leg = "AC" if "AC" in data else "BC"
        if data[leg] >= c:
            errs.append("cathetus not shorter than the hypotenuse")
            return None
        B = Point(c, 0)
        centre = A if leg == "AC" else B
        pts = [p for p in Circle(Point(c / 2, 0), c / 2).intersection(Circle(centre, data[leg])) if p.y > 0]
    else:
        errs.append(f"data {sorted(data)}")
        return None
    if len(pts) != 1:
        errs.append("triangle not determined")
        return None
    C = pts[0]
    H = Point(C.x, 0)
    P = {"A": A, "B": B, "C": C, "H": H}
    truth = simplify(dist(P[ask[0]], P[ask[1]]))
    kind = "altezza" if ask == "CH" else "cateto" if ask in ("AC", "BC") else "proiezione"
    if kind == "proiezione" and (ndec(truth) is None or ndec(truth) > 2):
        errs.append(f"projection {truth} not a short decimal")
    check_value_answer(sample, truth, "cm", errs)
    return kind


# ---------------------------------------------------------------------------

LEVELS = {1: check_l1, 2: check_l2, 3: check_l3, 4: check_l4, 5: check_l5, 6: check_l6, 7: check_l7, 8: check_l8}


def check(sample):
    errs = []
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    fn = LEVELS.get(sample["level"])
    if fn is None:
        return [f"unknown level {sample['level']}"], None
    try:
        kind = fn(sample, errs)
    except ValueError as e:
        errs.append(str(e))
        kind = None
    if sample["level"] in (1, 2, 4) and sample.get("choice") is not None and sample["choice"] != sample["answer"]:
        errs.append("choice variant differs from the choice answer")
    pc = sample.get("params", {}).get("case")
    if kind is not None and pc != kind:
        errs.append(f"params.case {pc!r} but the text is {kind!r}")
    return errs, kind
