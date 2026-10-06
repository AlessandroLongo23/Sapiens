"""Checker for fis-bernoulli (specs/exercises/fis-bernoulli.md), written from the spec and the lesson
99-fis-bernoulli.md, not from the generator. The problem is read back from its text.

Water, d = 1000 kg/m³, g = 9,8 m/s². p + ½ d v² + d g h is the same in the two sections: in a horizontal pipe
p1 − p2 = ½ d (v2² − v1²); with a constant section p2 = p1 − d g h; with two diameters v2 = v1 (D1/D2)². Pressures in
kPa: a difference with two significant figures, a pressure rounded to the kilopascal.
"""
import re

from sympy import Rational

from checkers._fis_fluidi_moto import G, Q, answer, data, label, scene, whole
from checkers._vettori import common, prose

D = 1000
KPA = r"\$(\d+)\\,\\text\{kPa\}\$"


def p_in(errs, s):
    p = int(s)
    if not 120 <= p <= 480 or p % 10 == 0:
        errs.append(f"pressure {p} kPa not a whole number from 120 to 480 without a final zero")
    return Rational(p)


def pipe(sample, errs, ratio, rise, labels):
    d = scene(errs, sample, "tubo-sezioni")
    if d is None:
        return
    if abs(Rational(str(d.get("rapporto"))) - ratio) > Rational(1, 1000):
        errs.append(f"scene ratio {d.get('rapporto')} != {ratio}")
    if bool(d.get("salita")) != rise:
        errs.append("scene rise does not match the text")
    if d.get("etichette") != labels:
        errs.append(f"scene labels {d.get('etichette')} != {labels}")


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un tubo orizzontale l'acqua scorre a " + Q("m/s") + " nel tratto largo e a " + Q("m/s") + r" in una strozzatura\. Di quanto è più bassa la pressione nella strozzatura\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    v1, v2 = data(errs, m.group(1), "v1", 0.5, 4), data(errs, m.group(2), "v2", 2, 12)
    if v2 < Rational(3, 2) * v1:
        errs.append("v2 under 1,5 v1")
    answer(sample, errs, Rational(1, 2) * D * (v2**2 - v1**2) / 1000, "kPa")
    return "calo"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un tubo orizzontale l'acqua scorre a " + Q("m/s") + " con una pressione di " + KPA + r"\. In una strozzatura la velocità sale a " + Q("m/s") + r"\. Quanto vale la pressione nella strozzatura\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    v1, p1, v2 = data(errs, m.group(1), "v1", 0.5, 4), p_in(errs, m.group(2)), data(errs, m.group(3), "v2", 3, 12)
    drop = Rational(1, 2) * D * (v2**2 - v1**2) / 1000
    if v2 < Rational(3, 2) * v1 or drop < 4:
        errs.append("the drop is too small")
    whole(sample, errs, p1 - drop, "kPa", lo=30)
    return "pressione"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Alla base di un palazzo l'acqua scorre in un tubo con una pressione di " + KPA + r"\. Il tubo sale, sempre con la stessa sezione, fino a un rubinetto che si trova " + Q("m") + r" più in alto\. Quanto vale la pressione dell'acqua che scorre in quel punto\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    p1, h = p_in(errs, m.group(1)), data(errs, m.group(2), "h", 2, 25)
    whole(sample, errs, p1 - D * G * h / 1000, "kPa", lo=30)
    pipe(sample, errs, Rational(1), True, {"uno": f"p_1 = {m.group(1)} kPa", "due": "p_2 = ?", "h": label("h", m.group(2), "m")})
    return "salita"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In un tubo orizzontale di diametro " + Q("cm") + " l'acqua scorre a " + Q("m/s") + " con una pressione di " + KPA + r"\. Più avanti il diametro si riduce a " + Q("cm") + r"\. Quanto vale la pressione nel tratto stretto\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    D1, v1, p1, D2 = data(errs, m.group(1), "D1", 2, 9), data(errs, m.group(2), "v1", 0.5, 3), p_in(errs, m.group(3)), data(errs, m.group(4), "D2", 1.1, 6)
    if not Rational(13, 10) <= D1 / D2 <= 3:
        errs.append(f"ratio of the diameters {D1 / D2} out of 1,3-3")
    v2 = v1 * (D1 / D2) ** 2
    drop = Rational(1, 2) * D * (v2**2 - v1**2) / 1000
    if drop < 4:
        errs.append("the drop is too small")
    whole(sample, errs, p1 - drop, "kPa", lo=30)
    pipe(sample, errs, D2 / D1, False, {"uno": label("D_1", m.group(1), "cm"), "due": label("D_2", m.group(4), "cm"), "v1": label("v_1", m.group(2), "m/s"), "v2": "v_2 = ?"})
    return "diametri"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"In cantina un tubo di diametro " + Q("cm") + " porta acqua a " + Q("m/s") + " con una pressione di " + KPA + r"\. Il tubo sale di " + Q("m") + " e si stringe fino a un diametro di " + Q("cm") + r"\. Quanto vale la pressione dell'acqua nel tratto in alto\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    D1, v1, p1 = data(errs, m.group(1), "D1", 2, 9), data(errs, m.group(2), "v1", 0.5, 2.5), p_in(errs, m.group(3))
    h, D2 = data(errs, m.group(4), "h", 2, 15), data(errs, m.group(5), "D2", 1.1, 6)
    if not Rational(13, 10) <= D1 / D2 <= Rational(26, 10):
        errs.append(f"ratio of the diameters {D1 / D2} out of 1,3-2,6")
    v2 = v1 * (D1 / D2) ** 2
    drop = Rational(1, 2) * D * (v2**2 - v1**2) / 1000
    if drop < 4:
        errs.append("the kinetic term is too small")
    whole(sample, errs, p1 - drop - D * G * h / 1000, "kPa", lo=30)
    pipe(sample, errs, D2 / D1, True, {"uno": label("D_1", m.group(1), "cm"), "due": label("D_2", m.group(5), "cm"), "v1": label("v_1", m.group(2), "m/s"), "v2": "v_2 = ?", "h": label("h", m.group(4), "m")})
    return "completo"


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
