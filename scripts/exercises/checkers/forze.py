"""Checker for forze (specs/exercises/forze.md), written from the spec and the lesson 16-forze.md.

Every problem is read back from its text (and, for the spring balance, from the scene, which is the data):
- level 1: the scene's balance is one of the spec's six, the index is on a division without a number, and the words
  of the alt text say the same position; the reading is the number of divisions times the sensitivity;
- level 2: sensitivity = capacity / divisions, capacity = divisions * sensitivity, or the sensitivity of the balance
  in the scene (with nothing hanging);
- levels 3-5: every force is a vector (SymPy Matrix) along est, nord, ovest, sud; the resultant is their sum and its
  modulus is sqrt(Rx^2 + Ry^2), which must be an integer; the scene draws the forces of the text to scale and not
  the resultant, the solution scene adds the resultant with its modulus and direction.
Then the answer and the four options.
"""
import math
import re

from sympy import Matrix, Rational, sqrt

from checkers.forze_comune import common, expect, match, parse_num, prose

CASE_RANGES = {
    2: {"figura": (0.23, 0.43), "sensibilita": (0.23, 0.43), "portata": (0.23, 0.43)},
    3: {"stesso-verso": (0.40, 0.60), "versi-opposti": (0.40, 0.60)},
    4: {"risultante": (0.60, 0.80), "forza-mancante": (0.20, 0.40)},
    5: {"tre": (0.50, 0.70), "quattro": (0.30, 0.50)},
}

BALANCES = {(1, 20, 4), (2, 20, 5), (5, 25, 5), (10, 20, 4), (20, 20, 5), (50, 25, 5)}
DIRS = {"est": Matrix([1, 0]), "nord": Matrix([0, 1]), "ovest": Matrix([-1, 0]), "sud": Matrix([0, -1])}
ANGLE = {"est": 0, "nord": 90, "ovest": 180, "sud": 270}
EXACT, INT = ("exact",), ("int",)


def balance(errs, scene, loaded):
    if not scene or scene.get("type") != "dinamometro":
        errs.append("no dinamometro scene")
        return None
    d = scene["data"]
    key = (d["portata"], d["divisioni"], d["ogni"])
    if key not in BALANCES:
        errs.append(f"balance {key} not in the spec")
    if bool(d.get("oggetto")) != loaded:
        errs.append("oggetto wrong")
    return d


def level1(sample, errs):
    if prose(sample["problem"]) != "Quanto segna il dinamometro della figura?":
        errs.append("level 1 text")
    d = balance(errs, sample.get("scene"), True)
    if not d:
        return None
    sens = Rational(d["portata"], d["divisioni"])
    F = Rational(str(d["forza"]))
    i = F / sens
    if not i.is_integer or not 0 < i < d["divisioni"] or i % d["ogni"] == 0:
        errs.append(f"index at {F} is not on a division without a number")
    alt = sample["scene"]["alt"]
    m = re.search(r"l'indice è (\d+) tacc(?:a|he) sotto il numero (\d+(?:,\d+)?)", alt)
    if not m or Rational(m.group(2).replace(",", ".")) + int(m.group(1)) * sens != F:
        errs.append("alt text does not describe the reading")
    expect(errs, sample, F, "N", EXACT)
    return "lettura"


def level2(sample, errs):
    s = prose(sample["problem"])
    if s == "Qual è la sensibilità del dinamometro della figura?":
        d = balance(errs, sample.get("scene"), False)
        if d:
            if d["forza"] != 0:
                errs.append("the balance should read zero")
            expect(errs, sample, Rational(d["portata"], d["divisioni"]), "N", EXACT)
        return "figura"
    if g := match("Un dinamometro ha la scala da $0$ a {N}, divisa in {V} parti uguali. Qual è la sua sensibilità?", s):
        P, dv = parse_num(g[0]), parse_num(g[1])
        expect(errs, sample, P / dv, "N", EXACT)
        return "sensibilita"
    if g := match("Un dinamometro ha la sensibilità di {N} e la scala divisa in {V} parti uguali. Qual è la sua portata?", s):
        expect(errs, sample, parse_num(g[0]) * parse_num(g[1]), "N", EXACT)
        return "portata"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def forces_in(s):
    """Every '$F_i = x\\,\\text{N}$ verso d' of the text, in order."""
    return [(int(i), parse_num(x), d) for i, x, d in re.findall(r"\$F_(\d) = ([^$]+?)\\,\\text\{N\}\$ verso (est|ovest|nord|sud)", s)]


def resultant(fs):
    R = Matrix([0, 0])
    for _, x, d in fs:
        R += x * DIRS[d]
    return R


def check_scene(errs, sample, fs, R, want_scene=True):
    sc, sol = sample.get("scene"), sample.get("solutionScene")
    if want_scene:
        if not sc or sc["type"] != "punto-forze":
            errs.append("no forces scene")
            return
        drawn = [(f["modulo"], f["angolo"]) for f in sc["data"]["forze"]]
        if drawn != [(int(x), ANGLE[d]) for _, x, d in fs]:
            errs.append(f"scene forces {drawn} != text")
        if any(f.get("colore") == "risultante" or f["nome"] == "R" for f in sc["data"]["forze"]):
            errs.append("the problem's scene shows the resultant")
        k = sc["data"]["scala"]
        if abs(max(f["modulo"] for f in sc["data"]["forze"]) * k - 2) > 0.01:
            errs.append("longest arrow not 2 cm")
        if min(f["modulo"] for f in sc["data"]["forze"]) * k < 0.29:
            errs.append("an arrow shorter than 0,3 cm")
    elif sc:
        errs.append("unexpected scene")
    if sol:
        r = [f for f in sol["data"]["forze"] if f["nome"] == "R"]
        if len(r) != 1:
            errs.append("solution scene without the resultant")
        else:
            ang = math.degrees(math.atan2(float(R[1]), float(R[0]))) % 360
            if abs(r[0]["modulo"] - float(sqrt(R.dot(R)))) > 1e-9 or min(abs(ang - r[0]["angolo"] % 360), 360 - abs(ang - r[0]["angolo"] % 360)) > 0.01:
                errs.append("solution scene: resultant wrong")


def level3(sample, errs):
    s = prose(sample["problem"])
    fs = forces_in(s)
    body = r"\$F_(\d) = [^$]+?\\,\\text\{N\}\$ verso (?:est|ovest|nord|sud)"
    if len(fs) != 2 or not re.fullmatch(r"Su un corpo agiscono due forze lungo la stessa retta: " + body + " e " + body + r"\. Quanto vale il modulo della risultante\?", s):
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    (_, a, d1), (_, b, d2) = fs
    if {d1, d2} not in ({"est"}, {"ovest"}, {"est", "ovest"}):
        errs.append("forces not on a horizontal line")
    if a == b or a % 5 or b % 5 or not 5 <= a <= 150 or not 5 <= b <= 150:
        errs.append("moduli outside the spec")
    R = resultant(fs)
    expect(errs, sample, sqrt(R.dot(R)), "N", INT)
    same = d1 == d2
    check_scene(errs, sample, fs, R, want_scene=not same)
    return "stesso-verso" if same else "versi-opposti"


def level4(sample, errs):
    s = prose(sample["problem"])
    fs = forces_in(s)
    if len(fs) == 2 and s.startswith("Su un corpo agiscono due forze perpendicolari: ") and s.endswith(". Quanto vale il modulo della risultante?"):
        (_, a, d1), (_, b, d2) = fs
        if DIRS[d1].dot(DIRS[d2]) != 0:
            errs.append("forces not perpendicular")
        R = resultant(fs)
        expect(errs, sample, sqrt(R.dot(R)), "N", INT)
        check_scene(errs, sample, fs, R)
        return "risultante"
    if g := match("Due forze perpendicolari applicate allo stesso corpo hanno una risultante di {N}. Una delle due forze vale {N}. Quanto vale l'altra?", s):
        R, F1 = parse_num(g[0]), parse_num(g[1])
        if F1 >= R:
            errs.append("a force not smaller than the resultant")
        expect(errs, sample, sqrt(R**2 - F1**2), "N", INT)
        if sample.get("scene"):
            errs.append("the missing force would be drawn")
        return "forza-mancante"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def level5(sample, errs):
    s = prose(sample["problem"])
    fs = forces_in(s)
    word = {3: "tre", 4: "quattro"}.get(len(fs))
    if not word or not s.startswith(f"Su un corpo agiscono {word} forze: ") or not s.endswith(". Quanto vale il modulo della risultante?"):
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    if [i for i, _, _ in fs] != list(range(1, len(fs) + 1)):
        errs.append("forces not numbered in order")
    axes = [abs(DIRS[d][0]) for _, _, d in fs]
    if axes.count(1) != 2 or axes.count(0) != len(fs) - 2:
        errs.append("not two horizontal forces and the rest vertical")
    R = resultant(fs)
    if R[0] == 0 or R[1] == 0:
        errs.append("resultant along an axis")
    expect(errs, sample, sqrt(R.dot(R)), "N", INT)
    check_scene(errs, sample, fs, R)
    return word


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = common(sample)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
