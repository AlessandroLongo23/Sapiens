"""Helpers for the checkers of the gravitation generators of group 37 (physics, third year: fis-campo-gravitazionale,
fis-satelliti, fis-energia-gravitazionale). Written from the specs and the lessons 95-97, not from
src/lib/exercises/v2/fis-campo-orbite.ts.

Numbers have three significant figures and are read as the lessons write them: without a power of ten between 0,1
and 1000 ($9{,}81$, $24{,}8$, $274$, $0{,}613$), otherwise in scientific notation ($5{,}97 \\cdot 10^{24}$); a whole
number that would end with a zero is in scientific notation too ($2{,}70 \\cdot 10^{2}$). Values are exact (sympy),
G = 667/100 · 10^-11; answers are rounded half up, exactly when rational and on a 50-digit value when they need a root or pi, and refused within 1e-9 of a rounding boundary.
"""
import re

from mpmath import mp
from sympy import Rational

mp.dps = 50

from checkers._vettori import check_choice

G = Rational(667, 100) * Rational(10) ** -11
SCI = r"-?\d\{,\}\d+ \\cdot 10\^\{-?\d+\}"
PLAIN = r"-?\d+(?:\{,\}\d+)?"
NUM = "(" + SCI + "|" + PLAIN + ")"
UNITS = {"N/kg": r"\\text\{N/kg\}", "N": r"\\text\{N\}", "kg": r"\\text\{kg\}", "m": r"\\text\{m\}", "m/s": r"\\text\{m/s\}", "s": r"\\text\{s\}", "J": r"\\text\{J\}"}
TEX = {"N/kg": r"\text{N/kg}", "N": r"\text{N}", "kg": r"\text{kg}", "m": r"\text{m}", "m/s": r"\text{m/s}", "s": r"\text{s}", "J": r"\text{J}"}
BODY = r"(un pianeta extrasolare|un pianeta|una luna)"
BODY_CAP = r"(Un pianeta extrasolare|Un pianeta|Una luna)"


def q(unit):
    """The regex of a quantity in prose, the number captured."""
    return r"\$" + NUM + r"\\," + UNITS[unit] + r"\$"


def val(s):
    """The exact value of a number as written."""
    m = re.fullmatch(r"(-?\d\{,\}\d+) \\cdot 10\^\{(-?\d+)\}", s)
    if m:
        return Rational(m.group(1).replace("{,}", ".")) * Rational(10) ** int(m.group(2))
    if not re.fullmatch(PLAIN, s):
        raise ValueError(f"not a number: {s!r}")
    return Rational(s.replace("{,}", "."))


def mpf(x):
    """An exact rational as a 50-digit float, for the answers that need a root or pi."""
    x = Rational(x)
    return mp.mpf(int(x.p)) / mp.mpf(int(x.q))


def _digits(x):
    """(sign, r, e): |x| = r/100 · 10^e rounded half up to three figures (100 <= r <= 999); None near a boundary."""
    if isinstance(x, mp.mpf):
        if x == 0:
            return None
        a = abs(x)
        e = int(mp.floor(mp.log10(a)))
        y = a / mp.mpf(10) ** e * 100
        fl = int(mp.floor(y))
        frac = y - fl
        near = abs(frac - mp.mpf(1) / 2) < mp.mpf(10) ** -9
        up = frac > mp.mpf(1) / 2
        neg = x < 0
    else:
        x = Rational(x)
        if x == 0:
            return None
        a = abs(x)
        p, qq = int(a.p), int(a.q)
        e = len(str(p)) - len(str(qq))
        while Rational(10) ** e > a:
            e -= 1
        while Rational(10) ** (e + 1) <= a:
            e += 1
        y = a * 100 / Rational(10) ** e
        fl = int(y.p) // int(y.q)
        frac = y - fl
        near = abs(frac - Rational(1, 2)) < Rational(1, 10**9)
        up = frac > Rational(1, 2)
        neg = x < 0
    if near:
        return None
    r = fl + 1 if up else fl
    if r >= 1000:
        r //= 10
        e += 1
    return neg, r, e


def fmt3(x):
    """x (an exact rational, or an mpmath float) with three significant figures, written as the lessons write it;
    None too close to a rounding boundary."""
    got = _digits(x)
    if got is None:
        return None
    neg, r, e = got
    d = str(r)
    sign = "-" if neg else ""
    if -1 <= e <= 2 and not (e == 2 and r % 10 == 0):
        body = d if e == 2 else d[:2] + "{,}" + d[2] if e == 1 else d[0] + "{,}" + d[1:] if e == 0 else "0{,}" + d
        return sign + body
    return f"{sign}{d[0]}{{,}}{d[1:]} \\cdot 10^{{{e}}}"


def data3(errs, s, what, lo=None, hi=None):
    """A datum: three significant figures written the canonical way, no final zero, optionally inside [lo, hi]."""
    x = val(s)
    if fmt3(x) != s:
        errs.append(f"{what} {s} is not written with three significant figures the canonical way")
    digits = re.sub(r" \\cdot.*$", "", s).replace("{,}", "").lstrip("-").lstrip("0")
    if len(digits) != 3 or digits.endswith("0"):
        errs.append(f"{what} {s}: mantissa must have three figures and no final zero")
    if lo is not None and not lo <= x <= hi:
        errs.append(f"{what} {s} outside [{lo}, {hi}]")
    return x


def answer(sample, errs, truth, unit, lo=None, hi=None):
    """The right option is the truth with three significant figures and its unit; every option is written alike."""
    want = fmt3(truth)
    if want is None:
        errs.append("answer too close to a rounding boundary")
        return
    if lo is not None and not lo <= truth <= hi:
        errs.append(f"answer {float(truth):.6g} outside [{lo}, {hi}]")
    opts = check_choice(sample, errs, want + r"\," + TEX[unit])
    seen = set()
    for o in opts:
        m = re.fullmatch(NUM + r"\\," + UNITS[unit], o)
        if not m or fmt3(val(m.group(1))) != m.group(1):
            errs.append(f"option {o!r} is not written like the answer")
            continue
        x = val(m.group(1))
        if x in seen:
            errs.append("two options with the same value")
        seen.add(x)
    for o in sample["answer"]["options"]:
        m = re.fullmatch(NUM + r"\\," + UNITS[unit], o["latex"])
        if m and abs(float(o["values"][0]) - float(val(m.group(1)))) > 1e-9 * abs(float(val(m.group(1)))):
            errs.append(f"option value {o['values']} does not match its text {o['latex']!r}")


def density(errs, M, R, lo=950, hi=6300):
    """A body that could exist: the density of a sphere of mass M and radius R, between 1000 and 6000 kg/m³ (with
    the slack of the rounded radius)."""
    rho = 3 * float(M) / (4 * float(mp.pi) * float(R) ** 3)
    if not lo <= rho <= hi:
        errs.append(f"density {rho:.0f} kg/m3 outside {lo}-{hi}")


def outside(errs, M, r, lo=1.28, hi=16.2):
    """The radius of an orbit, in radii of a sphere of mass M and density 3000 kg/m³: between 1,3 and 16."""
    r0 = (3 * float(M) / (4 * float(mp.pi) * 3000)) ** (1 / 3)
    if not lo <= float(r) / r0 <= hi:
        errs.append(f"orbit at {float(r) / r0:.2f} reference radii, outside {lo}-{hi}")


def body_mass(errs, body, M):
    """A moon only under 10^24 kg, a planet outside the Solar System only from there up."""
    b = body.lower()
    if b == "una luna" and float(M) >= 1.02e24:
        errs.append("a moon of 10^24 kg or more")
    if b == "un pianeta extrasolare" and float(M) < 0.98e24:
        errs.append("an extrasolar planet under 10^24 kg")


def scene_val(errs, sc, key, s, unit):
    """The value written under the scene is the datum of the text."""
    d = sc["data"].get(key)
    if not isinstance(d, dict):
        errs.append(f"scene without {key}")
        return
    m = re.fullmatch(r"(-?\d\{,\}\d+) \\cdot 10\^\{(-?\d+)\}", s)
    want = {"m": m.group(1).replace("{,}", ","), "e": int(m.group(2)), "u": unit} if m else {"m": s.replace("{,}", ","), "u": unit}
    if d != want:
        errs.append(f"scene {key} {d} != {want}")


def scene(sample, errs, ratio, orbit, given, launch=False):
    """The scene of the planet: type, r/R to a thousandth, orbit or not, and exactly the given values."""
    sc = sample.get("scene")
    if not sc or sc.get("type") != "orbita-pianeta" or not sc.get("alt"):
        errs.append("missing scene orbita-pianeta")
        return
    d = sc["data"]
    if ratio is not None and abs(float(d.get("rapporto", 0)) - float(ratio)) > 0.001:
        errs.append(f"scene ratio {d.get('rapporto')} != {float(ratio):.4f}")
    if d.get("orbita") is not orbit:
        errs.append("scene orbit flag wrong")
    if bool(d.get("lancio")) is not launch:
        errs.append("scene launch flag wrong")
    for key in ("R", "h", "r"):
        if key in given:
            scene_val(errs, sc, key, given[key], "m")
        elif key in d:
            errs.append(f"scene shows {key}, which is not a datum")
    if sample.get("solutionScene"):
        errs.append("no solution scene expected")


def no_scene(sample, errs):
    if sample.get("scene") or sample.get("solutionScene"):
        errs.append("this level has no scene")
