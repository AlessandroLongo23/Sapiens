"""Checker for fis-bilancio-energia (specs/exercises/fis-bilancio-energia.md), written from the spec and the lesson
79-fis-bilancio-energia.md, not from the generator.

The work of the non-conservative forces is the change of the mechanical energy: K_i + U_i + W_nc = K_f + U_f. From
rest at a height h down a smooth slope and then along a floor with friction, m g h = mu m g d. A spring compressed by x
that launches a block on such a floor: k x^2 / 2 = mu m g d. Down an incline of length l with friction and then
against a spring: k x^2 / 2 = m g l (sin a - mu cos a). Pulled up an incline from rest by a force F along it:
m v^2 / 2 = F l - mu m g cos a l - m g l sin a. Falling from h and stopping in a depth d under a mean force F:
m g (h + d) = F d.
"""
import re

from sympy import Rational, cos, pi, sin, sqrt, tan

from checkers._fis_energia import G, Q, answer, data
from checkers._fis_quantita_moto import exact_answer
from checkers._vettori import common, num, prose

KG, M, MS, CM, NM, N, J = Q("kg"), Q("m"), Q("m/s"), Q("cm"), Q("N/m"), Q("N"), Q("J")
MU = r"\$\\mu_d = (0\{,\}\d\d)\$"


def coeff(errs, s, lo, hi):
    mu = num(s)
    if not Rational(lo, 100) <= mu <= Rational(hi, 100) or s.endswith("0"):
        errs.append("coefficient out of range or ending in zero")
    return mu


def rad(d):
    return pi * Rational(d) / 180


def level1(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Una cassa|Un carrello|Una slitta) ha un'energia meccanica di " + J + r"\. Poi (una fune|un motore) compie un lavoro di " + J + " e l'attrito un lavoro di " + J + r"\. Quanto vale ora l'energia meccanica\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    Ei, Wf, Wa = int(m.group(2)), int(m.group(4)), int(m.group(5))
    Ef = Ei + Wf + Wa
    if not (Wf > 0 > Wa) or any(x % 10 == 0 for x in (Ei, Wf, Wa, Ef)) or not 11 <= Ef <= 99 or Wf == -Wa:
        errs.append("signs or values out of the spec")
    exact_answer(sample, errs, Ef, "J", places=0)
    return "aumenta" if Wf + Wa > 0 else "diminuisce"


def level2(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Una slitta|Un blocco|Uno slittino) parte da fermo dal punto \$A\$, in cima a una discesa liscia alta " + M + r"\. In fondo, dal punto \$B\$, prosegue su un tratto orizzontale con " + MU + r"\. Quanta strada percorre sul tratto orizzontale prima di fermarsi\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    h, mu = data(errs, m.group(2), "height"), coeff(errs, m.group(3), 10, 60)
    answer(sample, errs, h / mu, "m", lo=1)
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "pista-energia" or Rational(str(d.get("hA"))) != h or d.get("hB") != 0 or d.get("testoA") != m.group(2).replace("{,}", ",") + " m" or "vA" in d or "testoB" in d:
        errs.append("the scene does not match the data")
    return "discesa"


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una molla con costante elastica " + NM + ", compressa di " + CM + ", lancia un blocco di " + KG + " su un pavimento orizzontale con " + MU + r"\. Quanta strada fa il blocco, dal punto in cui viene lasciato a quello in cui si ferma\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    k, x, mass, mu = data(errs, m.group(1), "spring constant", figures=3), data(errs, m.group(2), "compression") / 100, data(errs, m.group(3), "mass"), coeff(errs, m.group(4), 10, 60)
    d = k * x**2 / (2 * mu * mass * G)
    if d < 3 * x:
        errs.append("the block does not leave the spring far behind")
    answer(sample, errs, d, "m", lo=Rational(1, 10))
    return "molla"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Un blocco di " + KG + " parte da fermo e scivola per " + M + r" lungo un piano inclinato di \$(\d+)\^\\circ\$, con " + MU + r"\. In fondo prosegue su un piano orizzontale liscio e comprime una molla con costante elastica " + NM + r"\. Di quanti centimetri si comprime la molla\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    mass, l, a, mu, k = data(errs, m.group(1), "mass"), data(errs, m.group(2), "length"), int(m.group(3)), coeff(errs, m.group(4), 10, 40), data(errs, m.group(5), "spring constant", figures=3)
    if not 20 <= a <= 50 or tan(rad(a)) < Rational(3, 2) * mu:
        errs.append("angle out of range or too close to the limit angle")
    x = 100 * sqrt(2 * mass * G * l * (sin(rad(a)) - mu * cos(rad(a))) / k)
    answer(sample, errs, x, "cm", lo=2, hi=60)
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "piano-inclinato" or d.get("angolo") != a or d.get("testoAngolo") != f"{a}°" or d.get("lunghezza") != m.group(2).replace("{,}", ",") + " m" or "forze" in d:
        errs.append("the scene does not match the data")
    return "rampa"


def level5(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"Una cassa di " + KG + r", ferma ai piedi di un piano inclinato di \$(\d+)\^\\circ\$, viene tirata verso l'alto da una fune parallela al piano con una forza di " + N + r"\. Tra la cassa e il piano " + MU + r"\. Con che velocità si muove la cassa dopo " + M + r" di salita\?", s)
    if not m:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    mass, a, F, mu, l = data(errs, m.group(1), "mass"), int(m.group(2)), data(errs, m.group(3), "force", figures=3), coeff(errs, m.group(4), 10, 40), data(errs, m.group(5), "length")
    if not 15 <= a <= 40:
        errs.append("angle out of range")
    need = mass * G * (sin(rad(a)) + mu * cos(rad(a)))
    if not Rational(119, 100) * need <= F <= Rational(201, 100) * need + 1:
        errs.append("force not between 1.2 and 2 times the one needed to go up")
    K = F * l - mu * mass * G * cos(rad(a)) * l - mass * G * l * sin(rad(a))
    if K < Rational(15, 100) * F * l:
        errs.append("kinetic energy under 15% of the work of the rope")
    answer(sample, errs, sqrt(2 * K / mass), "m/s")
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    fs = d.get("forze", [])
    if sc.get("type") != "piano-inclinato" or d.get("angolo") != a or len(fs) != 1 or fs[0].get("direzione") != "su-piano" or Rational(str(fs[0].get("modulo"))) != F or fs[0].get("nome") != "F":
        errs.append("the scene does not match the data")
    return "fune"


def level6(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(Un tuffatore|Una tuffatrice) di " + KG + " si lascia cadere da una piattaforma alta " + M + " sopra l'acqua e si ferma a " + M + r" di profondità\. Con quale forza media l'acqua frena la caduta\? La resistenza dell'aria si trascura\.", s)
    if not m:
        errs.append(f"level 6 text not recognised: {s!r}")
        return None
    mass, h, d = data(errs, m.group(2), "mass"), data(errs, m.group(3), "height"), data(errs, m.group(4), "depth")
    if not (41 <= mass <= 95 and 3 <= h <= Rational(99, 10) and Rational(3, 2) <= d <= Rational(9, 2)):
        errs.append("data out of range")
    answer(sample, errs, mass * G * (h + d) / d / 1000, "kN")
    return "tuffo"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}
CASE_RANGES = {1: {"aumenta": (0.3, 0.7), "diminuisce": (0.3, 0.7)}}


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
    if lvl not in (2, 4, 5) and sample.get("scene"):
        errs.append("no scene expected")
    return errs, kind
