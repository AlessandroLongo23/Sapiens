"""Checker for fis-temperatura (specs/exercises/fis-temperatura.md), written from the spec and the lesson
65-fis-temperatura.md, not from the generator.

T = t + 273 with whole degrees; a difference of temperature has the same number in kelvin and in degrees Celsius;
t_F = 9/5 t + 32 and t = 5/9 (t_F - 32); a thermometer whose column is L0 in melting ice and L100 in boiling water
reads t = (L - L0) / (L100 - L0) * 100. Every answer is exact: a whole number of degrees, or a length with one decimal.
"""
import re

from sympy import Rational

from checkers._fis_termologia import common, expect, parse, prose, q

CASE_RANGES = {
    1: {"celsius-kelvin": (0.40, 0.60), "kelvin-celsius": (0.40, 0.60)},
    2: {"stessa-scala": (0.40, 0.60), "scale-diverse": (0.40, 0.60)},
    5: {"lettura": (0.40, 0.60), "colonna": (0.40, 0.60)},
}

INT = ("int",)


def whole(errs, v, what):
    if not v.is_integer:
        errs.append(f"{what} {v} is not a whole number")


def level1(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(r"Un termometro segna " + q("C") + r"\. Quanto vale la temperatura assoluta\?", s):
        t = parse(m.group(1))
        whole(errs, t, "t")
        if not -60 <= t <= 300 or t == 0:
            errs.append("t out of range")
        expect(sample, errs, t + 273, "K", INT)
        return "celsius-kelvin"
    if m := re.fullmatch(r"Un corpo è alla temperatura assoluta di " + q("K") + r"\. Quanto vale la sua temperatura in gradi Celsius\?", s):
        T = parse(m.group(1))
        whole(errs, T, "T")
        if not 150 <= T <= 600 or T == 273:
            errs.append("T out of range")
        expect(sample, errs, T - 273, "C", INT, signed=True)
        return "kelvin-celsius"
    errs.append(f"level 1 text not recognised: {s!r}")
    return None


def level2(sample, errs):
    s = prose(sample["problem"])
    who = r"(Un liquido|Un blocco d'alluminio|L'aria di una stanza|Un gas|Un campione d'acqua)"
    if m := re.fullmatch(who + " passa da " + q("C") + " a " + q("C") + r"\. Di quanti kelvin è aumentata la sua temperatura\?", s):
        t1, t2 = parse(m.group(2)), parse(m.group(3))
        if not (-30 <= t1 <= 60 and 5 <= t2 - t1 <= 120):
            errs.append("data out of range")
        expect(sample, errs, t2 - t1, "K", INT)
        return "stessa-scala"
    if m := re.fullmatch(who + " passa da " + q("K") + " a " + q("C") + r"\. Di quanti gradi Celsius è aumentata la sua temperatura\?", s):
        T1, t2 = parse(m.group(2)), parse(m.group(3))
        d = t2 - (T1 - 273)
        if not (250 <= T1 <= 330 and 5 <= d <= 120):
            errs.append("data out of range")
        expect(sample, errs, d, "C", INT)
        return "scale-diverse"
    errs.append(f"level 2 text not recognised: {s!r}")
    return None


def level3(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(.+) " + q("C") + r"\. Quanto vale questa temperatura in gradi Fahrenheit\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    t = parse(m.group(2))
    if t % 5 != 0 or not -40 <= t <= 250 or t == 0:
        errs.append("t not a multiple of 5 in range")
    where = "La ricetta di una torta dice di scaldare il forno a" if t >= 150 else "Le previsioni del tempo di Roma danno" if -20 <= t <= 40 else "Un termometro segna"
    if m.group(1) != where:
        errs.append(f"context {m.group(1)!r} does not fit {t} °C")
    expect(sample, errs, Rational(9, 5) * t + 32, "F", INT, signed=True)
    return "celsius-fahrenheit"


def level4(sample, errs):
    s = prose(sample["problem"])
    m = re.fullmatch(r"(.+) " + q("F") + r"\. Quanto vale questa temperatura in gradi Celsius\?", s)
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    tf = parse(m.group(2))
    t = Rational(5, 9) * (tf - 32)
    if not t.is_integer or not -40 <= t <= 150 or t == 0:
        errs.append("answer not a whole number in range")
    where = "Una ricetta americana dice di scaldare il forno a" if t >= 120 else "A New York le previsioni danno" if -20 <= t <= 40 else "Un termometro americano segna"
    if m.group(1) != where:
        errs.append(f"context {m.group(1)!r} does not fit {t} °C")
    expect(sample, errs, t, "C", INT, signed=True)
    return "fahrenheit-celsius"


INTRO = r"Nel ghiaccio fondente la colonna di un termometro è lunga " + q("cm") + r", nell'acqua bollente " + q("cm") + r", misurate dalla base del capillare\."


def lengths(errs, *ss):
    out = []
    for s in ss:
        if not re.fullmatch(r"\d+\{,\}\d", s):
            errs.append(f"length {s} not written with one decimal")
        out.append(parse(s))
    return out


def level5(sample, errs):
    s = prose(sample["problem"])
    if m := re.fullmatch(INTRO + r" In una stanza la colonna è lunga " + q("cm") + r"\. Che temperatura c'è nella stanza\?", s):
        L0, L100, L = lengths(errs, m.group(1), m.group(2), m.group(3))
        if not (1 <= L0 <= 5 and L100 - L0 in {10, 12, 15, 16, 20, 25} and L0 < L < L100):
            errs.append("data out of range")
        t = (L - L0) / (L100 - L0) * 100
        if not t.is_integer or not 5 <= t <= 95:
            errs.append(f"temperature {t} not a whole number between 5 and 95")
        expect(sample, errs, t, "C", INT)
        return "lettura"
    if m := re.fullmatch(INTRO + r" Quanto è lunga la colonna a " + q("C") + r"\?", s):
        L0, L100 = lengths(errs, m.group(1), m.group(2))
        t = parse(m.group(3))
        if not (1 <= L0 <= 5 and L100 - L0 in {10, 12, 15, 16, 20, 25} and 5 <= t <= 95):
            errs.append("data out of range")
        L = L0 + (L100 - L0) * t / 100
        if not (L * 10).is_integer:
            errs.append("length needs more than one decimal")
        expect(sample, errs, L, "cm", ("fixed", 1))
        return "colonna"
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
