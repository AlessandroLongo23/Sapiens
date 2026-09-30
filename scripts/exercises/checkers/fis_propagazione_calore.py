"""Checker for fis-propagazione-calore (specs/exercises/fis-propagazione-calore.md), written from the spec and the lesson
69-fis-propagazione-calore.md, not from the generator.

The law of conduction: the heat per second through a slab of area S and thickness d, with a temperature difference
ΔT between the faces, is Q/Δt = λ S ΔT / d, in watts when S is in m², d in m and λ in W/(m·K). The heat in a time is
that times the time in seconds. Two layers let through the same heat when λ/d is the same. Exact arithmetic with
sympy, results to two significant figures; the scene carries the data, never the answer.
"""
import re

from sympy import Rational

from checkers._fis_calore import answer, common, quantity, text, value

CASE_RANGES = {
    2: {"sbarra": (0.40, 0.60), "lastra": (0.40, 0.60)},
    3: {"ore": (0.40, 0.60), "minuti": (0.40, 0.60)},
    4: {"spessore": (0.40, 0.60), "conducibilita": (0.40, 0.60)},
    5: {"spessore": (0.40, 0.60), "confronto": (0.40, 0.60)},
}

SLABS = {"vetro": "1{,}0", "mattoni pieni": "0{,}80", "legno": "0{,}12", "polistirolo espanso": "0{,}035"}
BARS = {"rame": "401", "alluminio": "237", "ferro": "80", "acciaio inossidabile": "16"}
INSULATORS = {"polistirolo espanso": "0{,}035", "lana di roccia": "0{,}040", "sughero": "0{,}050"}
WALLS = {"mattoni pieni": "0{,}80", "calcestruzzo": "1{,}5", "pietra": "2{,}2"}

LAM = r"\$\\lambda = (\d+(?:\{,\}\d+)?)\\,\\text\{W/\(m\}\\cdot\\text\{K\)\}\$"
C, M2, M, CM, MM, W = quantity("C"), quantity("m2"), quantity("m"), quantity("cm"), quantity("mm"), quantity("W")
CNEG = r"\$(-?\d+)\\,\^\\circ\\text\{C\}\$"
CM2 = r"\$(\d\{,\}\d)\\,\\text\{cm\}\^2\$"


def material(errs, table, name, lam):
    if name not in table or table[name] != lam:
        errs.append(f"material {name} with lambda {lam}")
    return value(lam)


def two(errs, s, lo, hi, what):
    """A datum with two significant figures and no trailing zero, between lo and hi."""
    digits = s.replace("{,}", "").lstrip("0")
    if len(digits) != 2 or digits.endswith("0"):
        errs.append(f"{what} {s} has not two significant figures")
    v = value(s)
    if not lo <= v <= hi:
        errs.append(f"{what} {s} outside {lo}-{hi}")
    return v


def scene(sample, errs, **want):
    sc = sample.get("scene") or {}
    if sc.get("type") != "lastra-conduzione":
        errs.append("no slab scene")
        return
    d = sc.get("data", {})
    for k, v in want.items():
        if d.get(k) != v:
            errs.append(f"scene {k} {d.get(k)!r} != {v!r}")


def lab(s):
    return s.replace("{,}", ",")


def level1(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Una lastra di (vetro|mattoni pieni|legno|polistirolo espanso), con " + LAM + ", ha un'area di " + M2 + " ed è spessa " + M + r"\. Tra le due facce c'è una differenza di temperatura di " + C + r"\. Quanto calore passa ogni secondo\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    name = m.group(1)
    lam = material(errs, SLABS, name, m.group(2))
    S = two(errs, m.group(3), Rational(11, 10), Rational(99, 10), "area")
    rng = {"vetro": (Rational(11, 10000), Rational(99, 10000)), "legno": (Rational(11, 1000), Rational(99, 1000))}.get(name, (Rational(11, 100), Rational(99, 100)))
    d = two(errs, m.group(4), *rng, "thickness")
    dT = value(m.group(5))
    if not ((1 <= dT <= 6) if name == "vetro" else (5 <= dT <= 30)):
        errs.append("temperature difference outside the range")
    P = lam * S * dT / d
    if not 1 <= P < 10000:
        errs.append("power outside 1-10000 W")
    answer(sample, errs, P, 2, "W")
    scene(sample, errs, dT=f"{m.group(5)} °C", spessore=f"{lab(m.group(4))} m", area=f"{lab(m.group(3))} m²", materiale=name, sbarra=False)
    return name


def level2(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Una sbarra di (rame|alluminio|ferro|acciaio inossidabile), con " + LAM + ", lunga " + CM + " e con una sezione di " + CM2 + ", ha un'estremità a " + C + " e l'altra a " + C + r"\. Quanto calore passa ogni secondo lungo la sbarra\?", s):
        lam = material(errs, BARS, m.group(1), m.group(2))
        L = two(errs, m.group(3), 11, 99, "length")
        S = two(errs, m.group(4), Rational(11, 10), Rational(99, 10), "section")
        hot, cold = value(m.group(5)), value(m.group(6))
        if not (50 <= hot <= 100 and 0 <= cold <= 30):
            errs.append("temperatures outside the ranges")
        P = lam * S / 10000 * (hot - cold) / (L / 100)
        if not Rational(1, 10) <= P < 1000:
            errs.append("power outside 0,1-1000 W")
        answer(sample, errs, P, 2, "W")
        scene(sample, errs, caldo=f"{m.group(5)} °C", freddo=f"{m.group(6)} °C", spessore=f"{m.group(3)} cm", area=f"{lab(m.group(4))} cm²", materiale=m.group(1), sbarra=True)
        return "sbarra"
    if m := re.fullmatch(r"Una lastra di (vetro|mattoni pieni|legno|polistirolo espanso), con " + LAM + ", ha un'area di " + M2 + r" ed è spessa \$(\d\{,\}\d)\\,\\text\{(mm|cm)\}\$\. Una faccia è a " + CNEG + ", l'altra a " + CNEG + r"\. Quanto calore passa ogni secondo\?", s):
        name = m.group(1)
        lam = material(errs, SLABS, name, m.group(2))
        S = two(errs, m.group(3), Rational(11, 10), Rational(99, 10), "area")
        d = two(errs, m.group(4), Rational(11, 10), Rational(99, 10), "thickness")
        if (m.group(5) == "mm") != (name == "vetro"):
            errs.append("thickness unit")
        inside, outside = int(m.group(6)), int(m.group(7))
        if not 15 <= inside <= 22 or not ((1 <= inside - outside <= 6) if name == "vetro" else (-5 <= outside <= 10)):
            errs.append("temperatures outside the ranges")
        P = lam * S * (inside - outside) / (d / (1000 if name == "vetro" else 100))
        if not 1 <= P < 10000:
            errs.append("power outside 1-10000 W")
        answer(sample, errs, P, 2, "W")
        scene(sample, errs, caldo=f"{inside} °C", freddo=f"{str(outside).replace('-', '−')} °C", spessore=f"{lab(m.group(4))} {m.group(5)}", area=f"{lab(m.group(3))} m²", materiale=name, sbarra=False)
        return "lastra"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = text(sample)
    m = re.fullmatch(
        r"Una parete di (mattoni pieni|legno|polistirolo espanso), con " + LAM + ", ha un'area di " + M2 + " ed è spessa " + CM + r"\. Tra le due facce ci sono " + C
        + r" di differenza\. Quanto calore attraversa la parete in \$(\d+)\\,\\text\{(h|min)\}\$\?",
        s,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    lam = material(errs, SLABS, m.group(1), m.group(2))
    S = two(errs, m.group(3), Rational(11, 10), Rational(99, 10), "area")
    d = two(errs, m.group(4), Rational(11, 10), Rational(99, 10), "thickness")
    dT, n, hours = value(m.group(5)), int(m.group(6)), m.group(7) == "h"
    if not 5 <= dT <= 30 or not ((2 <= n <= 12) if hours else (10 <= n <= 59 and n % 10)):
        errs.append("data outside the ranges")
    P = lam * S * dT / (d / 100)
    if P < 1:
        errs.append("power under 1 W")
    answer(sample, errs, P * n * (3600 if hours else 60), 2, "J")
    scene(sample, errs, dT=f"{m.group(5)} °C", spessore=f"{lab(m.group(4))} cm", area=f"{lab(m.group(3))} m²", materiale=m.group(1), sbarra=False)
    return "ore" if hours else "minuti"


def level4(sample, errs):
    s = text(sample)
    if m := re.fullmatch(
        r"Una borsa frigo di (polistirolo espanso|lana di roccia|sughero), con " + LAM + ", ha una superficie di " + M2 + r"\. Dentro ci sono " + C + ", fuori " + C
        + r"\. Quanto devono essere spesse le pareti perché entrino al massimo " + W + r"\?",
        s,
    ):
        lam = material(errs, INSULATORS, m.group(1), m.group(2))
        S = two(errs, m.group(3), Rational(11, 100), Rational(99, 100), "area")
        inside, outside = value(m.group(4)), value(m.group(5))
        P = two(errs, m.group(6), Rational(11, 10), Rational(99, 10), "power")
        if not (2 <= inside <= 8 and 25 <= outside <= 38):
            errs.append("temperatures outside the ranges")
        d = lam * S * (outside - inside) / P * 100
        if not 1 <= d <= 30:
            errs.append("thickness outside 1-30 cm")
        answer(sample, errs, d, 2, "cm")
        if sample.get("scene"):
            errs.append("a scene when the thickness is asked")
        return "spessore"
    if m := re.fullmatch(r"Una lastra di un materiale da costruzione ha un'area di " + M2 + " ed è spessa " + CM + r"\. Con " + C + r" di differenza tra le facce, la attraversano " + W + r"\. Quanto vale la conducibilità termica del materiale\?", s):
        S = two(errs, m.group(1), Rational(11, 10), Rational(99, 10), "area")
        d = two(errs, m.group(2), Rational(11, 10), Rational(99, 10), "thickness")
        dT = value(m.group(3))
        P = two(errs, m.group(4), 11, 99, "power")
        lam = P * (d / 100) / (S * dT)
        if not Rational(2, 100) <= lam <= 3:
            errs.append("conductivity outside 0,02-3")
        answer(sample, errs, lam, 2, "lam")
        scene(sample, errs, dT=f"{m.group(3)} °C", spessore=f"{lab(m.group(2))} cm", area=f"{lab(m.group(1))} m²", materiale="", sbarra=False)
        return "conducibilita"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def level5(sample, errs):
    s = text(sample)
    B = r"di (polistirolo espanso|lana di roccia|sughero) \(" + LAM + r"\)"
    A = r"di (mattoni pieni|calcestruzzo|pietra) \(" + LAM + r"\)"
    if m := re.fullmatch(r"Quale spessore di uno strato " + B + r" lascia passare lo stesso calore di una parete " + A + " spessa " + CM + r", a parità di area e di differenza di temperatura\?", s):
        lb = material(errs, INSULATORS, m.group(1), m.group(2))
        la = material(errs, WALLS, m.group(3), m.group(4))
        dA = two(errs, m.group(5), 11, 49, "thickness")
        answer(sample, errs, dA * lb / la, 2, "cm")
        return "spessore"
    if m := re.fullmatch(
        r"Da una parete " + A + " spessa " + CM + r" passano \$(\d\{,\}\d) \\cdot 10\^\{2\}\\,\\text\{W\}\$\. Quanto calore passerebbe ogni secondo da uno strato " + B + " spesso " + CM
        + r", con la stessa area e la stessa differenza di temperatura\?",
        s,
    ):
        la = material(errs, WALLS, m.group(1), m.group(2))
        dA = two(errs, m.group(3), 11, 49, "thickness")
        PA = two(errs, m.group(4), Rational(11, 10), Rational(99, 10), "power") * 100
        lb = material(errs, INSULATORS, m.group(5), m.group(6))
        dB = two(errs, m.group(7), Rational(11, 10), Rational(99, 10), "thickness")
        P = PA * (lb / la) * (dA / dB)
        if P < 1:
            errs.append("power under 1 W")
        answer(sample, errs, P, 2, "W")
        return "confronto"
    errs.append(f"level 5 text not recognised: {s!r}")
    return None


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
