"""Checker for fis-spostamento-velocita-piano (specs/exercises/fis-spostamento-velocita-piano.md), written from the spec
and the lesson 45-fis-spostamento-velocita-piano.md, not from the generator.

The displacement from A to B has components x_B - x_A and y_B - y_A and modulus sqrt(dx^2 + dy^2); the average
velocity is the displacement over the time; the average scalar speed is the path over the time; a velocity v at an
angle a above the horizontal has components v cos a and v sin a; moving at v for a time t at an angle a from east
towards north, a body goes v cos a t east and v sin a t north. Exact values with sympy, answers rounded half up to two
significant figures; the scene draws the data, never the answer.
"""
import re

from sympy import cos, sin, sqrt

from checkers._fis_moti_piano import DEG, Q, answer, common, data2, num, prose, rad

CASE_RANGES = {
    3: {"scalare": (0.40, 0.60), "vettoriale": (0.40, 0.60)},
    4: {"orizzontale": (0.40, 0.60), "verticale": (0.40, 0.60)},
    5: {"nord": (0.40, 0.60), "est": (0.40, 0.60)},
}

PT = r"\$%s = \((-?\d+)\\,\\text\{m\};\\ (-?\d+)\\,\\text\{m\}\)\$"


def scene(sample, key="scene"):
    sc = sample.get(key) or {}
    return sc.get("type"), sc.get("data", {})


def coord(errs, s):
    n = int(s)
    if not (11 <= abs(n) <= 60 and n % 10):
        errs.append(f"coordinate {n} outside the rule")
    return n


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un pallone passa dal punto " + PT % "A" + " al punto " + PT % "B" + r"\. Quanto vale il modulo dello spostamento\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    xa, ya, xb, yb = (coord(errs, g) for g in m.groups())
    dx, dy = xb - xa, yb - ya
    if abs(dx) < 5 or abs(dy) < 5:
        errs.append("a component under 5 m")
    answer(sample, errs, sqrt(dx**2 + dy**2), "m")
    typ, d = scene(sample)
    pts = {p["nome"]: tuple(p["at"]) for p in d.get("punti", [])}
    if typ != "vettori-piano" or pts != {"A": (xa, ya), "B": (xb, yb)} or d.get("vettori"):
        errs.append("scene: the two points only, at their coordinates")
    return None


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Un drone|Un gabbiano|Una barca a vela|Un pallone aerostatico) si sposta di " + Q("m") + " verso est e di " + Q("m") + " verso nord in " + Q("s") + r"\. Quanto vale il modulo della sua velocità media\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    dx, dy, dt = data2(errs, m.group(2), "dx", 11, 99), data2(errs, m.group(3), "dy", 11, 99), data2(errs, m.group(4), "dt", 1.1, 99)
    vm = sqrt(dx**2 + dy**2) / dt
    if vm < num("0{,}5"):
        errs.append("speed under 0,5 m/s")
    answer(sample, errs, vm, "m/s")
    legs(sample, errs, m.group(2), m.group(3))
    return None


def legs(sample, errs, a, b):
    """The two legs east then north, from A at the origin, with their lengths written; no displacement."""
    typ, d = scene(sample)
    ws = d.get("vettori", [])
    labels = [w.get("etichetta") for w in ws]
    A, B = float(num(a)), float(num(b))
    geometry = [(tuple(w.get("da", [])), tuple(w.get("a", []))) for w in ws]
    pts = [(p.get("nome"), tuple(p.get("at", []))) for p in d.get("punti", [])]
    if typ != "vettori-piano" or labels != [f"{a.replace('{,}', ',')} m", f"{b.replace('{,}', ',')} m"]:
        errs.append(f"scene: the two legs with their lengths, and no displacement ({labels})")
    elif any(abs(x - y) > 1e-9 for g, h in zip(geometry, [((0, 0), (A, 0)), ((A, 0), (A, B))]) for p, q in zip(g, h) for x, y in zip(p, q)):
        errs.append("scene: the legs are not east then north with the lengths of the text")
    if pts != [("A", (0, 0))]:
        errs.append("scene: the start A at the origin")


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"(Una ragazza cammina|Un ragazzo corre|Un cane corre) per " + Q("m") + " verso est in " + Q("s") + ", poi per " + Q("m") + " verso nord in " + Q("s") + r"\. Quanto vale (la sua velocità scalare media|il modulo della sua velocità media)\?",
        s,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    d1, t1 = data2(errs, m.group(2), "d1", 11, 99), data2(errs, m.group(3), "t1", 2, 99)
    d2, t2 = data2(errs, m.group(4), "d2", 11, 99), data2(errs, m.group(5), "t2", 2, 99)
    for d, t in ((d1, t1), (d2, t2)):
        if not num("0{,}8") <= d / t <= 8:
            errs.append("leg speed outside 0,8-8 m/s")
    scalar = m.group(6).startswith("la sua")
    answer(sample, errs, (d1 + d2) / (t1 + t2) if scalar else sqrt(d1**2 + d2**2) / (t1 + t2), "m/s")
    legs(sample, errs, m.group(2), m.group(4))
    return "scalare" if scalar else "vettoriale"


CONTEXTS4 = {"Un aereo sale": (51, 99, 5, 25), "Un pallone calciato parte": (11, 35, 15, 70), "Un drone sale": (1.1, 9.9, 10, 80)}


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Un aereo sale|Un pallone calciato parte|Un drone sale) con una velocità di " + Q("m/s") + " inclinata di " + DEG + r" sull'orizzontale\. Quanto vale la componente (orizzontale|verticale) della velocità\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    lo, hi, a0, a1 = CONTEXTS4[m.group(1)]
    v, a = data2(errs, m.group(2), "v", lo, hi), int(m.group(3))
    if not a0 <= a <= a1:
        errs.append("angle outside the context's range")
    horiz = m.group(4) == "orizzontale"
    answer(sample, errs, v * (cos(rad(a)) if horiz else sin(rad(a))), "m/s")
    typ, d = scene(sample)
    ws = d.get("vettori", [])
    if typ != "vettori-piano" or len(ws) != 1 or ws[0].get("etichetta") != f"{m.group(2).replace('{,}', ',')} m/s" or [g.get("testo") for g in d.get("angoli", [])] != [f"{a}°"]:
        errs.append("scene: the velocity with its modulus and angle, nothing else")
    return "orizzontale" if horiz else "verticale"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(
        r"(Una barca|Un rover|Un pattinatore|Un ciclista) si muove in linea retta a " + Q("m/s") + ", in una direzione che forma un angolo di " + DEG + r" con la direzione est, verso nord\. Di quanti metri si sposta verso (nord|est) in " + Q("s") + r"\?",
        s,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    v, a, dt = data2(errs, m.group(2), "v", 1.1, 9.9), int(m.group(3)), data2(errs, m.group(5), "dt", 1.1, 99)
    if not 10 <= a <= 80:
        errs.append("angle outside 10-80")
    north = m.group(4) == "nord"
    truth = v * (sin(rad(a)) if north else cos(rad(a))) * dt
    if truth < 1:
        errs.append("displacement under 1 m")
    answer(sample, errs, truth, "m")
    return "nord" if north else "est"


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
