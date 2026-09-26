"""geometria-punti-notevoli (Punti notevoli del triangolo), from specs/exercises/geometria-punti-notevoli.md.

Written from the spec, not from the generator. Every datum is read back from the text the student
sees (the prose of the problem), never from params, and the answer is found again with geometry:

- level 1: the point is recognised from keywords of its construction or property, one keyword list
  per point, and each option of the property case is classified the same way;
- level 2: the 2 : 1 ratio is measured on a triangle with exact coordinates (SymPy points), then scaled;
- level 3: a triangle with the two given angles is drawn with coordinates, orthocentre and
  circumcentre are computed and located (inside, outside, on a vertex, on a midpoint);
- level 4: a 3-4-5 right triangle scaled to the given hypotenuse, with exact SymPy coordinates;
- levels 5 and 6: a triangle with the given angles in floating point, incentre and orthocentre
  computed from their definitions, the angle measured with atan2 and compared with the answer;
- level 7: an equilateral triangle of side s, with h, r and R found from coordinates.
"""
import math
import re

from sympy import Point, Rational, Segment, Triangle, nsimplify, sqrt

CASE_RANGES = {
    1: {"dalla proprietà al punto": (0.50, 0.70), "dal punto alla proprietà": (0.30, 0.50)},
    2: {k: (0.11, 0.23) for k in ["med>gm", "med>vg", "gm>vg", "gm>med", "vg>gm", "vg>med"]},
    3: {"acutangolo": (0.25, 0.42), "rettangolo": (0.25, 0.42), "ottusangolo": (0.25, 0.42)},
    4: {k: (0.18, 0.32) for k in ["raggio", "mediana", "baricentro", "ipotenusa"]},
    5: {"angoli agli estremi": (0.40, 0.60), "angolo opposto": (0.40, 0.60)},
    6: {"angoli agli estremi": (0.40, 0.60), "angolo opposto": (0.40, 0.60)},
    7: {k: (0.11, 0.23) for k in ["h>r", "h>R", "r>R", "r>h", "R>r", "R>h"]},
}

NAMES = {"baricentro": "G", "ortocentro": "H", "circocentro": "O", "incentro": "I"}

# Level 1: what identifies each point, from the lesson.
KEYWORDS = {
    "G": r"mediane|mediana|equilibrio|punto medio del lato opposto",
    "H": r"altezze|coincide con il vertice|vertice dell'angolo retto|ottusangolo|perpendicolare alla retta del lato opposto",
    "O": r"assi dei|dai tre vertici|per i tre vertici|circoscritta|punto medio dell'ipotenusa|case|nei loro punti medi",
    "I": r"bisettrici|dai tre lati|inscritta|tocca i tre lati|strade|a metà ognuno dei tre angoli",
}


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


def num(s):
    """12, 3{,}5, \\frac{10}{3} -> Rational."""
    s = s.strip()
    m = re.fullmatch(r"\\frac\{(\d+)\}\{(\d+)\}", s)
    if m:
        n, d = int(m.group(1)), int(m.group(2))
        if math.gcd(n, d) != 1 or d in (1,):
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
    return Rational(s.replace("{,}", "."))


def finite(r):
    d = r.q
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


def option_value(latex, unit):
    if unit == "cm":
        m = re.fullmatch(r"(.+)\\text\{ cm\}", latex)
    else:
        m = re.fullmatch(r"(\d+)\^\\circ", latex)
    if not m:
        raise ValueError(f"option not in {unit}: {latex}")
    return num(m.group(1))


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


def check_number_choice(sample, truth, unit, errs):
    ch = check_choice_shape(sample.get("choice"), errs)
    if ch is None:
        return
    vals = []
    for o in ch:
        try:
            vals.append(option_value(o["latex"], unit))
        except ValueError as e:
            errs.append(str(e))
            return
        if Rational(o["values"][0]) != vals[-1]:
            errs.append(f"option values {o['values']} != latex {o['latex']}")
    right = [i for i, v in enumerate(vals) if v == truth]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth {truth}")
    elif right[0] != sample["choice"]["correct"]:
        errs.append("choice.correct points to a wrong option")
    for v in vals:
        if v <= 0 or (unit == "deg" and v >= 180):
            errs.append(f"implausible option {v}")
    if all(finite(v) for v in [truth]) and any(not finite(v) for v in vals):
        errs.append("a periodic fraction among options of a decimal answer")


def check_number(sample, truth, errs):
    ans = sample["answer"]
    if ans.get("kind") != "number":
        errs.append("answer is not a number")
        return
    if Rational(ans["value"]) != truth:
        errs.append(f"answer {ans['value']} != truth {truth}")


# ---------------------------------------------------------------------------
# Level 1

def classify(text):
    hits = {p for p, rx in KEYWORDS.items() if re.search(rx, text)}
    return hits.pop() if len(hits) == 1 else None


def check_l1(sample, errs):
    text = prose(sample["problem"])
    ans = sample["answer"]
    opts = check_choice_shape(ans, errs)
    if opts is None:
        return None
    if sample["prompt"] == "Quale punto notevole è P?":
        truth = classify(text)
        if truth is None:
            errs.append(f"description matches no single point: {text}")
            return None
        seen = set()
        for o in opts:
            m = re.fullmatch(r"\\text\{(baricentro|ortocentro|circocentro|incentro) \}([GHOI])", o["latex"])
            if not m or NAMES[m.group(1)] != m.group(2):
                errs.append(f"bad point option {o['latex']}")
                return None
            seen.add(m.group(2))
        if seen != set("GHOI"):
            errs.append("the four points are not all among the options")
        got = re.search(r"([GHOI])$", opts[ans["correct"]]["latex"]).group(1)
        if got != truth:
            errs.append(f"correct option {got}, truth {truth}")
        return "dalla proprietà al punto"
    m = re.search(r"ha (?:il |l')(baricentro|ortocentro|circocentro|incentro) \$([GHOI])\$", text)
    if not m or NAMES[m.group(1)] != m.group(2):
        errs.append(f"asked point not found: {text}")
        return None
    asked = m.group(2)
    classes = [classify(prose(o["latex"])) for o in opts]
    if None in classes or len(set(classes)) != 4:
        errs.append(f"options not one per point: {classes}")
    if classes[ans["correct"]] != asked:
        errs.append(f"correct option is a property of {classes[ans['correct']]}, asked {asked}")
    for o in opts:
        for line in re.findall(r"\\text\{([^}]*)\}", o["latex"]):
            if len(line) > 32:
                errs.append(f"option line too long: {line}")
    return "dal punto alla proprietà"


# ---------------------------------------------------------------------------
# Level 2: centroid on a median

_A, _B, _C = Point(0, 0), Point(7, 0), Point(2, 5)
_G = Triangle(_A, _B, _C).centroid
_M = Segment(_B, _C).midpoint
RATIO = {"med": Rational(1), "vg": _A.distance(_G) / _A.distance(_M), "gm": _G.distance(_M) / _A.distance(_M)}
MEDIAN = {"A": "M", "B": "N", "C": "L"}


def seg_role(seg):
    """AM -> ('A', 'med'), AG -> ('A', 'vg'), GM -> ('A', 'gm')."""
    if seg[0] == "G":
        return next(v for v, m in MEDIAN.items() if m == seg[1]), "gm"
    if seg[1] == "G":
        return seg[0], "vg"
    if MEDIAN.get(seg[0]) != seg[1]:
        raise ValueError(f"{seg} is not a median")
    return seg[0], "med"


def check_l2(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(
        r"Nel triangolo \$ABC\$ il punto \$G\$ è il baricentro e (?:la mediana|il segmento) \$(\w\w)\$ è lung[ao] \$([^$]+)\$ cm\. "
        r"Quanto è lung[ao] (?:la mediana )?\$(\w\w)\$\?",
        text,
    )
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    (v1, given), (v2, ask) = seg_role(m.group(1)), seg_role(m.group(3))
    if v1 != v2 or given == ask:
        errs.append("given and asked are not two parts of the same median")
        return None
    if ("mediana" in text.split("Quanto")[0]) != (given == "med"):
        errs.append("the text calls a median what is not one")
    x = num(m.group(2))
    truth = x / RATIO[given] * RATIO[ask]
    if ndec(x) is None or ndec(x) > 1 or x > 36:
        errs.append(f"given length {x} out of range")
    check_number(sample, truth, errs)
    check_number_choice(sample, truth, "cm", errs)
    return f"{given}>{ask}"


# ---------------------------------------------------------------------------
# Level 3: where the point falls

def triangle_from_angles(angles):
    """Coordinates of A, B, C (floats) with the given angles in degrees: A at the origin, B on the x-axis."""
    a, b, c = (math.radians(angles[v]) for v in "ABC")
    ab = 1.0
    ac = ab * math.sin(b) / math.sin(c)
    return {"A": (0.0, 0.0), "B": (ab, 0.0), "C": (ac * math.cos(a), ac * math.sin(a))}


def circumcentre(P):
    (ax, ay), (bx, by), (cx, cy) = P["A"], P["B"], P["C"]
    d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))
    ux = ((ax**2 + ay**2) * (by - cy) + (bx**2 + by**2) * (cy - ay) + (cx**2 + cy**2) * (ay - by)) / d
    uy = ((ax**2 + ay**2) * (cx - bx) + (bx**2 + by**2) * (ax - cx) + (cx**2 + cy**2) * (bx - ax)) / d
    return ux, uy


def orthocentre(P):
    ox, oy = circumcentre(P)
    return tuple(sum(P[v][k] for v in "ABC") - 2 * (ox, oy)[k] for k in (0, 1))


def incentre(P):
    side = {v: math.dist(*[P[w] for w in "ABC" if w != v]) for v in "ABC"}
    tot = sum(side.values())
    return tuple(sum(side[v] * P[v][k] for v in "ABC") / tot for k in (0, 1))


def centroid(P):
    return tuple(sum(P[v][k] for v in "ABC") / 3 for k in (0, 1))


def locate(pt, P):
    """'vertice X', 'punto medio XY', 'interno', 'esterno'."""
    eps = 1e-9
    for v in "ABC":
        if math.dist(pt, P[v]) < eps:
            return f"vertice {v}"
    for u, w in ("AB", "BC", "AC"):
        mid = ((P[u][0] + P[w][0]) / 2, (P[u][1] + P[w][1]) / 2)
        if math.dist(pt, mid) < eps:
            return f"punto medio {u}{w}"

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    s = [cross(P["A"], P["B"], pt), cross(P["B"], P["C"], pt), cross(P["C"], P["A"], pt)]
    if all(x > eps for x in s) or all(x < -eps for x in s):
        return "interno"
    if any(abs(x) < eps for x in s):
        return "sul bordo"
    return "esterno"


def check_l3(sample, errs):
    text = prose(sample["problem"])
    m = re.fullmatch(
        r"Nel triangolo \$ABC\$ gli angoli \$\\hat\{([ABC])\}\$ e \$\\hat\{([ABC])\}\$ misurano \$(\d+)\^\\circ\$ e \$(\d+)\^\\circ\$\. "
        r"Dove si trova (?:il |l')(baricentro|ortocentro|circocentro|incentro) \$([GHOI])\$\?",
        text,
    )
    if not m or m.group(1) == m.group(2) or NAMES[m.group(5)] != m.group(6):
        errs.append(f"unreadable problem: {text}")
        return None
    angles = {m.group(1): int(m.group(3)), m.group(2): int(m.group(4))}
    third = next(v for v in "ABC" if v not in angles)
    angles[third] = 180 - sum(angles.values())
    if any(a < 15 or a % 5 for a in angles.values()):
        errs.append(f"angles out of range: {angles}")
        return None
    P = triangle_from_angles(angles)
    pt = {"G": centroid, "H": orthocentre, "O": circumcentre, "I": incentre}[m.group(6)](P)
    truth = locate(pt, P)
    big = max(angles, key=angles.get)
    kind = "acutangolo" if angles[big] < 90 else "rettangolo" if angles[big] == 90 else "ottusangolo"
    opts = check_choice_shape(sample["answer"], errs)
    if opts is None:
        return kind
    labels = []
    for o in opts:
        s = o["latex"]
        if s == r"\text{interno al triangolo}":
            labels.append("interno")
        elif s == r"\text{esterno al triangolo}":
            labels.append("esterno")
        elif re.fullmatch(r"\\text\{nel vertice \}[ABC]", s):
            labels.append(f"vertice {s[-1]}")
        elif re.fullmatch(r"\\text\{nel punto medio di \}[ABC][ABC]", s):
            labels.append("punto medio " + "".join(sorted(s[-2:])))
        else:
            errs.append(f"unknown option {s}")
            return kind
    opp = "".join(sorted(v for v in "ABC" if v != big))
    if sorted(labels) != sorted(["interno", "esterno", f"vertice {big}", f"punto medio {opp}"]):
        errs.append(f"options {labels} are not the four places for vertex {big}")
    truth = "punto medio " + "".join(sorted(truth[-2:])) if truth.startswith("punto medio") else truth
    if labels.count(truth) != 1:
        errs.append(f"truth {truth} not among options {labels}")
    elif labels[sample["answer"]["correct"]] != truth:
        errs.append(f"correct option {labels[sample['answer']['correct']]}, truth {truth}")
    return kind


# ---------------------------------------------------------------------------
# Level 4: right triangle

def check_l4(sample, errs):
    text = prose(sample["problem"])
    m = re.match(r"Il triangolo \$ABC\$ è rettangolo in \$([ABC])\$ e (.*)$", text)
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    rv, rest = m.group(1), m.group(2)
    hyp = [v for v in "ABC" if v != rv]
    # A 3-4-5 right triangle with the right angle at rv, exact.
    def tri(h):
        Pr = Point(0, 0)
        Pa, Pb = Point(h * Rational(3, 5), 0), Point(0, h * Rational(4, 5))
        O = Segment(Pa, Pb).midpoint
        G = Triangle(Pr, Pa, Pb).centroid
        circ = Triangle(Pr, Pa, Pb).circumcenter
        if circ != O:
            raise AssertionError("circumcentre is not the midpoint of the hypotenuse")
        return {"R": circ.distance(Pa), "CO": Pr.distance(O), "CG": Pr.distance(G), "h": Pa.distance(Pb)}

    m1 = re.fullmatch(
        r"l'ipotenusa \$(\w\w)\$ è lunga \$([^$]+)\$ cm\. (Quanto misura il raggio della circonferenza circoscritta\?|"
        r"Quanto è lunga la mediana relativa all'ipotenusa\?|A che distanza dal vertice \$(\w)\$ si trova il baricentro \$G\$\?)",
        rest,
    )
    m2 = re.fullmatch(
        r"il suo baricentro \$G\$ dista \$([^$]+)\$ cm dal vertice \$(\w)\$\. Quanto è lunga l'ipotenusa \$(\w\w)\$\?", rest
    )
    if m1:
        if sorted(m1.group(1)) != hyp or (m1.group(4) and m1.group(4) != rv):
            errs.append("wrong hypotenuse or vertex letters")
        h = num(m1.group(2))
        t = tri(h)
        q = m1.group(3)
        case = "raggio" if "raggio" in q else "mediana" if "mediana" in q else "baricentro"
        truth = {"raggio": t["R"], "mediana": t["CO"], "baricentro": t["CG"]}[case]
        if case == "baricentro" and not h.is_integer:
            errs.append("hypotenuse not an integer for the centroid case")
    elif m2:
        if m2.group(2) != rv or sorted(m2.group(3)) != hyp:
            errs.append("wrong hypotenuse or vertex letters")
        c = num(m2.group(1))
        k = tri(Rational(1))["CG"]  # CG of a triangle with hypotenuse 1
        truth = nsimplify(c / k)
        case = "ipotenusa"
        h = truth
    else:
        errs.append(f"unreadable problem: {text}")
        return None
    truth = Rational(truth)
    if h > 45:
        errs.append(f"hypotenuse {h} too long")
    check_number(sample, truth, errs)
    check_number_choice(sample, truth, "cm", errs)
    return case


# ---------------------------------------------------------------------------
# Levels 5 and 6: angles between bisectors and altitudes

def angle_at(P, X, Y):
    """Angle XPY in degrees."""
    a = math.atan2(X[1] - P[1], X[0] - P[0]) - math.atan2(Y[1] - P[1], Y[0] - P[0])
    a = abs(math.degrees(a)) % 360
    return 360 - a if a > 180 else a


def check_l56(sample, errs):
    lvl = sample["level"]
    text = prose(sample["problem"])
    kind = " acutangolo" if lvl == 6 else ""
    lead = (
        r"Le bisettrici degli angoli \$\\hat\{(\w)\}\$ e \$\\hat\{(\w)\}\$ si incontrano nell'incentro \$I\$"
        if lvl == 5
        else r"Le altezze che partono dai vertici \$(\w)\$ e \$(\w)\$ si incontrano nell'ortocentro \$H\$"
    )
    P = "I" if lvl == 5 else "H"
    m = re.fullmatch(
        rf"Nel triangolo{kind} \$ABC\$ gli angoli misurano \$\\hat\{{(\w)\}} = (\d+)\^\\circ\$ e \$\\hat\{{(\w)\}} = (\d+)\^\\circ\$\. "
        rf"{lead}\. Quanto misura \$\\widehat\{{(\w){P}(\w)\}}\$\?",
        text,
    )
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    angles = {m.group(1): int(m.group(2)), m.group(3): int(m.group(4))}
    if len(angles) != 2:
        errs.append("the same angle given twice")
        return None
    third = next(v for v in "ABC" if v not in angles)
    angles[third] = 180 - sum(angles.values())
    e1, e2 = m.group(5), m.group(6)
    if {e1, e2} != {m.group(7), m.group(8)} or e1 == e2:
        errs.append("the asked angle is not between the two lines named")
    if lvl == 5 and (any(a % 2 or a < 20 or a > 130 for a in angles.values())):
        errs.append(f"angles out of range: {angles}")
    if lvl == 6 and any(a % 5 or a < 35 or a >= 90 for a in angles.values()):
        errs.append(f"angles out of range or not acute: {angles}")
    Pts = triangle_from_angles(angles)
    X = incentre(Pts) if lvl == 5 else orthocentre(Pts)
    measured = angle_at(X, Pts[e1], Pts[e2])
    truth = Rational(round(measured))
    if abs(measured - float(truth)) > 1e-6:
        errs.append(f"measured angle {measured} not an integer")
    check_number(sample, truth, errs)
    check_number_choice(sample, truth, "deg", errs)
    given = set(angles) - {third}
    return "angoli agli estremi" if given == {e1, e2} else "angolo opposto"


# ---------------------------------------------------------------------------
# Level 7: equilateral triangle

def check_l7(sample, errs):
    text = prose(sample["problem"])
    words = {
        "L'altezza": "h",
        "Il raggio della circonferenza inscritta": "r",
        "Il raggio della circonferenza circoscritta": "R",
    }
    m = re.fullmatch(
        r"(L'altezza|Il raggio della circonferenza inscritta|Il raggio della circonferenza circoscritta) di un triangolo equilatero "
        r"è lung[ao] \$([^$]+)\$ cm\. (Quanto è lunga l'altezza del triangolo\?|Quanto misura il raggio della circonferenza (inscritta|circoscritta)\?)",
        text,
    )
    if not m:
        errs.append(f"unreadable problem: {text}")
        return None
    given = words[m.group(1)]
    ask = "h" if m.group(4) is None else "r" if m.group(4) == "inscritta" else "R"
    if given == ask:
        errs.append("asks what it gives")
        return None
    x = num(m.group(2))
    # Side 1: centre and the three lengths from coordinates.
    A, B, C = Point(0, 0), Point(1, 0), Point(Rational(1, 2), sqrt(3) / 2)
    T = Triangle(A, B, C)
    unit = {"h": C.distance(Point(Rational(1, 2), 0)), "r": T.inradius, "R": T.circumradius}
    truth = Rational(nsimplify(x / unit[given] * unit[ask]))
    if ndec(x) is None or ndec(x) > 1 or x > 45:
        errs.append(f"given length {x} out of range")
    check_number(sample, truth, errs)
    check_number_choice(sample, truth, "cm", errs)
    return f"{given}>{ask}"


def check(sample):
    errs = []
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    lvl = sample["level"]
    fn = {1: check_l1, 2: check_l2, 3: check_l3, 4: check_l4, 5: check_l56, 6: check_l56, 7: check_l7}.get(lvl)
    if fn is None:
        return [f"unknown level {lvl}"], None
    kind = fn(sample, errs)
    if kind and sample.get("params", {}).get("case") != kind:
        errs.append(f"params.case {sample.get('params', {}).get('case')} != {kind}")
    return errs, kind
