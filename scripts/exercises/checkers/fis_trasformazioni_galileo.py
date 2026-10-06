"""Checker for fis-trasformazioni-galileo (specs/exercises/fis-trasformazioni-galileo.md), written from the spec and
the lesson 73-fis-trasformazioni-galileo.md, not from the generator.

S' moves at V along x relative to S, and the origins coincide at t = 0: x = x' + V t, x' = x - V t. Velocities compose
as v = v' + V, so a vehicle at v sees another at V with v - V (signs included): the moduli subtract in the same
direction and add in opposite directions, and a gap d closes in d / |v - V|. Rain falling straight down at v is seen
from a car at V with speed sqrt(v^2 + V^2), at tan(beta) = V / v from the vertical. By components, v_x = v'_x + V_x
and v_y = v'_y + V_y. A ball thrown straight up at v0 on a train flies for 2 v0 / g and advances V times that for the
platform. g = 49/5.
"""
from sympy import atan, sqrt

from checkers._fis_riferimenti import G, Q, QN, Rational, answer2, answer_deg, answer_exact, common, data2, datum, no_scene, num, pi, prose, re

CASE_RANGES = {
    1: {"banchina": (0.40, 0.60), "treno": (0.40, 0.60)},
    2: {"stesso verso": (0.40, 0.60), "versi opposti": (0.40, 0.60)},
    3: {"raggiunge": (0.40, 0.60), "incontro": (0.40, 0.60)},
    4: {"velocità": (0.40, 0.60), "angolo": (0.40, 0.60)},
}

MS, SEC, MET = Q("m/s"), Q("s"), Q("m")


def whole(errs, s, what, lo, hi):
    """A whole datum inside [lo, hi] that does not end with a zero."""
    if not re.fullmatch(r"\d+", s) or s.endswith("0"):
        errs.append(f"{what} {s} is not a whole number without a final zero")
    return datum(errs, s, what, lo, hi)


def level1(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    head = r"Un treno passa lungo una banchina a " + MS + r"; le origini dei due sistemi di riferimento coincidono nell'istante zero\. "
    if m := re.fullmatch(head + r"Un passeggero è seduto a " + MET + r" dall'origine del treno, verso la testa\. A quale distanza dall'origine della banchina si trova dopo " + SEC + r"\?", s):
        V, xp = whole(errs, m.group(1), "V", 11, 35), whole(errs, m.group(2), "x'", 11, 99)
        kind, truth = "banchina", None
    elif m := re.fullmatch(head + r"Un semaforo si trova a " + MET + r" dall'origine della banchina, davanti al treno\. A quale distanza dall'origine del treno si trova dopo " + SEC + r"\?", s):
        V, x = whole(errs, m.group(1), "V", 11, 35), whole(errs, m.group(2), "x", 151, 399)
        kind = "treno"
    else:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    if not re.fullmatch(r"[2-9]\{,\}0", m.group(3)):
        errs.append(f"time {m.group(3)} is not a whole number of seconds from 2 to 9")
    t = num(m.group(3))
    truth = xp + V * t if kind == "banchina" else x - V * t
    if kind == "treno" and truth < 5:
        errs.append("the signal is behind the train's origin, or too close")
    answer_exact(sample, errs, truth, "m")
    return kind


ROAD = r"Su una strada rettilinea un'auto viaggia a " + MS + r" e un furgone a " + MS + r", "


def level2(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(ROAD + r"(nello stesso verso|in versi opposti)\. Quanto vale, in modulo, la velocità dell'auto rispetto al furgone\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    v, V = whole(errs, m.group(1), "v", 21, 39), whole(errs, m.group(2), "V", 11, 37)
    if V > v - 2:
        errs.append("the van is not slower than the car by at least 2 m/s")
    same = m.group(3) == "nello stesso verso"
    answer_exact(sample, errs, v - V if same else v + V, "m/s")
    return "stesso verso" if same else "versi opposti"


def level3(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    if m := re.fullmatch(ROAD + r"nello stesso verso; l'auto è " + MET + r" dietro il furgone\. Dopo quanto tempo lo raggiunge\?", s):
        same = True
    elif m := re.fullmatch(ROAD + r"in versi opposti, uno verso l'altro; sono distanti " + MET + r"\. Dopo quanto tempo si incontrano\?", s):
        same = False
    else:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    v, V, d = whole(errs, m.group(1), "v", 21, 39), whole(errs, m.group(2), "V", 11, 36), data2(errs, m.group(3), "d", 11, 99)
    if V > v - 3:
        errs.append("the van is not slower than the car by at least 3 m/s")
    t = d / (v - V if same else v + V)
    if t < 1:
        errs.append("time under 1 s")
    answer2(sample, errs, t, "s")
    return "raggiunge" if same else "incontro"


def vectors(sample, errs, key="scene"):
    sc = sample.get(key) or {}
    if sc.get("type") != "vettori-piano":
        errs.append(f"no vettori-piano {key}")
        return []
    out = []
    for w in sc["data"]["vettori"]:
        da = (Rational(str(w["da"][0])), Rational(str(w["da"][1])))
        a = (Rational(str(w["a"][0])), Rational(str(w["a"][1])))
        out.append((da, a, w))
    return out


def same_vec(got, da, a):
    return all(abs(g - w) <= Rational(1, 1000) for g, w in zip(got[0] + got[1], da + a))


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Non c'è vento e la pioggia cade in verticale a " + MS + r"\. Un'auto viaggia su una strada orizzontale a " + MS + r"\. (Con quale velocità chi è in auto vede cadere la pioggia\?|Di quale angolo, rispetto alla verticale, chi è in auto vede inclinata la pioggia\?)",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    v, V = data2(errs, m.group(1), "v", 4.0, 9.9), data2(errs, m.group(2), "V", 5.0, 30)
    # the scene draws the two data, the rain straight down and the car's velocity horizontal, and not their sum
    vs = vectors(sample, errs)
    if len(vs) != 2 or not same_vec(vs[0], (0, 0), (0, -v)) or vs[1][0][1] != 0 or vs[1][1][1] != 0 or abs((vs[1][1][0] - vs[1][0][0]) - V) > Rational(1, 1000):
        errs.append("the scene does not draw the rain's velocity and the car's")
    if any(w.get("colore") == "risultante" for _, _, w in vs):
        errs.append("the problem scene draws the answer")
    sol = vectors(sample, errs, "solutionScene")
    if not any(same_vec(w, (0, 0), (-V, -v)) and w[2].get("colore") == "risultante" for w in sol):
        errs.append("the solution scene does not draw v' = v - V")
    if m.group(3).startswith("Di quale angolo"):
        beta = atan(V / v) * 180 / pi
        if not 20 <= beta <= 85:
            errs.append("angle outside 20-85")
        answer_deg(sample, errs, beta)
        return "angolo"
    answer2(sample, errs, sqrt(v**2 + V**2), "m/s")
    return "velocità"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Il radar di un traghetto, che naviga verso est a " + MS + r", vede un motoscafo muoversi con velocità di componenti \$v'_x = (-?\d+(?:\{,\}\d+)?)\\,\\text\{m/s\}\$ e \$v'_y = (\d+(?:\{,\}\d+)?)\\,\\text\{m/s\}\$ \(asse x verso est, asse y verso nord\)\. Quanto vale la velocità del motoscafo rispetto al mare\?",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    V = data2(errs, m.group(1), "V", 2.0, 9.9)
    px = num(m.group(2))
    data2(errs, m.group(2).lstrip("-"), "v'x", 1.1, 9.9)
    py = data2(errs, m.group(3), "v'y", 1.1, 9.9)
    vx = px + V
    if abs(vx) < Rational(45, 100):
        errs.append("the x component of the sum is almost zero")
    vs = vectors(sample, errs)
    if len(vs) != 2 or not same_vec(vs[0], (0, 0), (V, 0)) or not same_vec(vs[1], (V, 0), (vx, py)):
        errs.append("the scene does not draw V and v' head to tail")
    if any(w.get("colore") == "risultante" for _, _, w in vs):
        errs.append("the problem scene draws the answer")
    sol = vectors(sample, errs, "solutionScene")
    if not any(same_vec(w, (0, 0), (vx, py)) and w[2].get("colore") == "risultante" for w in sol):
        errs.append("the solution scene does not draw the sum")
    answer2(sample, errs, sqrt(vx**2 + py**2), "m/s")
    return None


def level6(sample, errs):
    s = prose(sample["problem"])
    no_scene(sample, errs)
    m = re.fullmatch(
        r"Su un treno che viaggia a " + MS + r" una ragazza lancia una palla verso l'alto, in verticale rispetto al treno, a " + MS + r", e la riprende alla stessa altezza\. Di quanto avanza la palla rispetto alla banchina durante il volo\?",
        s,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    V, v0 = data2(errs, m.group(1), "V", 5.0, 30), data2(errs, m.group(2), "v0", 2.0, 9.9)
    answer2(sample, errs, V * 2 * v0 / G, "m")
    return None


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    try:
        kind = LEVELS[lvl](sample, errs)
    except (ValueError, KeyError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
