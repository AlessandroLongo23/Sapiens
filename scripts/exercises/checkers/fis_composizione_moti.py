"""Checker for fis-composizione-moti (specs/exercises/fis-composizione-moti.md), written from the spec and the lesson
46-fis-composizione-moti.md, not from the generator.

Velocities along one line add or subtract; a boat covering d with or against the current takes d / (v_b +- v_c); with
the bow straight across the speed relative to the bank is sqrt(v_b^2 + v_c^2), the path makes tan(beta) = v_c / v_b
with the perpendicular, the crossing takes d / v_b and the current carries the boat v_c d / v_b downstream; to land
right opposite the bow turns upstream by alpha with sin(alpha) = v_c / v_b, and the crossing takes
d / sqrt(v_b^2 - v_c^2). Exact values with sympy, rounded half up to two significant figures (angles to the degree).
The scene draws the data: at level 5 the angle is drawn at 30 degrees marked alpha, not to scale.
"""
import re

from sympy import Rational, asin, atan, pi, sqrt

from checkers._fis_moti_piano import Q, answer, answer_deg, common, data2, prose

CASE_RANGES = {
    1: {"stesso verso": (0.40, 0.60), "versi opposti": (0.40, 0.60)},
    2: {"valle": (0.40, 0.60), "monte": (0.40, 0.60)},
    3: {"velocità": (0.40, 0.60), "angolo": (0.40, 0.60)},
    4: {"tempo": (0.40, 0.60), "valle": (0.40, 0.60)},
    5: {"tempo": (0.40, 0.60), "angolo": (0.40, 0.60)},
}


def river_scene(sample, errs, vb, vc, alfa, width=None, key="scene"):
    sc = sample.get(key) or {}
    d = sc.get("data", {})
    if sc.get("type") != "fiume-barca":
        errs.append("no river scene")
        return
    if Rational(str(d.get("vb"))) != vb or Rational(str(d.get("vc"))) != vc or abs(float(d.get("alfa", -1)) - float(alfa)) > 1e-3:
        errs.append(f"scene data {d}")
    if width is not None and d.get("larghezza") != width:
        errs.append("scene width label")
    if key == "scene" and d.get("risultante"):
        errs.append("the problem scene draws the resultant")


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un marinaio cammina a " + Q("m/s") + " sul ponte di un traghetto, che avanza a " + Q("m/s") + r"\. Il marinaio cammina (verso la prua, nel verso del moto del traghetto|verso la poppa, nel verso opposto al moto del traghetto)\. Quanto vale la sua velocità rispetto alla riva\?",
        s,
    )
    if m:
        a, b = data2(errs, m.group(1), "walker", 1.1, 2.0), data2(errs, m.group(2), "ferry", 3.0, 8.5)
        same = m.group(3).startswith("verso la prua")
    else:
        m = re.fullmatch(
            r"Una barca a motore va a " + Q("m/s") + " rispetto all'acqua su un fiume la cui corrente va a " + Q("m/s") + r"\. La barca va (verso valle, nel verso della corrente|verso monte, contro la corrente)\. Quanto vale la sua velocità rispetto alla riva\?",
            s,
        )
        if not m:
            errs.append(f"level 1 text not recognised: {s!r}")
            return None
        a, b = data2(errs, m.group(1), "boat", 2.0, 8.0), data2(errs, m.group(2), "current", 1.1, 3.0)
        same = m.group(3).startswith("verso valle")
        if b > a:
            errs.append("the current is faster than the boat")
    if "{,}" not in m.group(1) or "{,}" not in m.group(2):
        errs.append("level 1 data need one decimal")
    v = a + b if same else abs(a - b)
    if not 1 <= v <= Rational(99, 10):
        errs.append("result outside 1,0-9,9")
    answer(sample, errs, v, "m/s")
    return "stesso verso" if same else "versi opposti"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una canoa va a " + Q("m/s") + " rispetto all'acqua, su un fiume la cui corrente va a " + Q("m/s") + r"\. Quanto tempo impiega a percorrere " + Q("m") + r" lungo il fiume verso (valle|monte)\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    vb, vc, d = data2(errs, m.group(1), "vb", 2.0, 6.0), data2(errs, m.group(2), "vc", 0.5, 2.0), data2(errs, m.group(3), "d", 11, 99)
    if vc > vb - Rational(8, 10):
        errs.append("current too close to the canoe")
    down = m.group(4) == "valle"
    t = d / (vb + vc if down else vb - vc)
    if t < 2:
        errs.append("time under 2 s")
    answer(sample, errs, t, "s")
    return "valle" if down else "monte"


BOAT = r"Una barca va a " + Q("m/s") + " rispetto all'acqua, con la prua perpendicolare alla riva, su un fiume la cui corrente va a " + Q("m/s") + r"\. "


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(BOAT + r"(Quanto vale la sua velocità rispetto alla riva\?|Quale angolo forma la sua traiettoria con la perpendicolare alla riva\?)", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    vb, vc = data2(errs, m.group(1), "vb", 1.1, 6.0), data2(errs, m.group(2), "vc", 0.5, 4.0)
    river_scene(sample, errs, vb, vc, 0)
    if m.group(3).startswith("Quale angolo"):
        beta = atan(vc / vb) * 180 / pi
        if not 8 <= beta <= 82:
            errs.append("angle outside 8-82")
        answer_deg(sample, errs, beta)
        return "angolo"
    answer(sample, errs, sqrt(vb**2 + vc**2), "m/s")
    return "velocità"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un fiume è largo " + Q("m") + " e la corrente va a " + Q("m/s") + r"\. Una barca che va a " + Q("m/s") + r" rispetto all'acqua parte con la prua perpendicolare alla riva\. (Quanto tempo impiega ad arrivare sull'altra riva\?|Di quanti metri la corrente la sposta a valle\?)",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    d, vc, vb = data2(errs, m.group(1), "d", 11, 99), data2(errs, m.group(2), "vc", 0.5, 3.0), data2(errs, m.group(3), "vb", 1.1, 6.0)
    river_scene(sample, errs, vb, vc, 0, f"{m.group(1).replace('{,}', ',')} m")
    time = m.group(4).startswith("Quanto tempo")
    truth = d / vb if time else vc * d / vb
    if truth < 1:
        errs.append("result under 1")
    answer(sample, errs, truth, "s" if time else "m")
    return "tempo" if time else "valle"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"Un fiume è largo " + Q("m") + " e la corrente va a " + Q("m/s") + r"\. Una barca va a " + Q("m/s") + r" rispetto all'acqua e vuole arrivare nel punto proprio di fronte alla partenza\. (Di quale angolo deve inclinare la prua controcorrente, rispetto alla perpendicolare alla riva\?|Quanto tempo impiega ad attraversare il fiume\?)",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    d, vc, vb = data2(errs, m.group(1), "d", 11, 99), data2(errs, m.group(2), "vc", 0.5, 5.0), data2(errs, m.group(3), "vb", 1.1, 6.0)
    if not Rational(15, 100) <= vc / vb <= Rational(9, 10):
        errs.append("current outside 15%-90% of the boat")
    # the angle is unknown in the problem: drawn at 30 degrees, marked alpha
    river_scene(sample, errs, vb, vc, 30, f"{m.group(1).replace('{,}', ',')} m")
    if (sample.get("scene") or {}).get("data", {}).get("testoAlfa") != "α":
        errs.append("the problem scene must mark the angle alpha")
    if m.group(4).startswith("Di quale angolo"):
        answer_deg(sample, errs, asin(vc / vb) * 180 / pi)
        return "angolo"
    answer(sample, errs, d / sqrt(vb**2 - vc**2), "s")
    return "tempo"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


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

