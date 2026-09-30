"""Checker for chim-errori-cifre-significative (specs/exercises/chim-errori-cifre-significative.md).

Written from the spec and the lesson (docs/lezioni/chimica/riscritte/13-chim-errori-cifre-significative.md). Every
number is read back as a string, so the zeros that count are seen. The rules of the lesson: significant figures are
the digits without the leading zeros (in scientific notation, those of the first factor); rounding looks at the first
figure dropped, half up; the result of a series is the mean with the semidispersion, or the sensitivity when the
semidispersion is smaller, the uncertainty to one figure and the mean at its position; in a sum or difference the
absolute uncertainties add and the result keeps the decimals of the least precise datum; in a product or quotient the
relative uncertainties add and the result keeps the significant figures of the datum with fewest. Results are
written in decimal form, or in scientific notation when the last figure is left of the units or a zero in the units.
"""
import re

from sympy import Rational

from checkers._chim_misure import common, decimals_of, fmt_dec, parse_num, round_half_up, first_pos, rounded, sig_count, text, unit_tex

CASE_RANGES = {
    1: {k: (0.12, 0.28) for k in ["nessuno", "iniziali", "mezzo", "finali", "scientifica"]},
    2: {"decimale": (0.30, 0.50), "zeri": (0.12, 0.28), "scientifica": (0.12, 0.28), "riporto": (0.12, 0.28)},
    3: {"semidispersione": (0.60, 0.80), "sensibilita": (0.20, 0.40)},
    4: {k: (0.25, 0.42) for k in ["buretta", "pesata", "somma"]},
    5: {k: (0.25, 0.42) for k in ["densita", "moli", "massa"]},
    6: {"percentuale": (0.40, 0.60), "densita": (0.40, 0.60)},
}

WORDS = {"due": 2, "tre": 3}
MOLAR = {r"\mathrm{H_2O}": Rational("18.02"), r"\mathrm{NaCl}": Rational("58.44"), r"\mathrm{CO_2}": Rational("44.01"), r"\mathrm{NH_3}": Rational("17.04"), r"\mathrm{CH_4}": Rational("16.05")}
NUM = r"(-?[\d\\,{}]+(?: \\cdot 10(?:\^-?\d|\^\{-?\d+\})?)?)"


def qre(unit):
    return r"\$" + NUM + r"\\," + re.escape(unit_tex(unit)) + r"\$"


def count_sig(s):
    """The significant figures of a number as written."""
    m = re.fullmatch(r"(\d)\{,\}(\d+) \\cdot 10\^\{-?\d+\}", s)
    if m:
        return 1 + len(m.group(2))
    if "{,}" not in s and s.endswith("0"):
        raise ValueError(f"ambiguous whole number {s}")
    return sig_count(s)


def one_right(sample, errs, want_latex):
    ch = sample["answer"]
    lat = [o["latex"] for o in ch["options"]]
    if len(lat) != 4 or len(set(lat)) != 4 or len({"|".join(o["values"]) for o in ch["options"]}) != 4:
        errs.append(f"need four distinct options: {lat}")
    good = [i for i, x in enumerate(lat) if x == want_latex]
    if len(good) != 1:
        errs.append(f"expected one option {want_latex!r}: {lat}")
    elif ch["correct"] != good[0]:
        errs.append("correct index")


def res_latex(m, D, unit):
    return f"({m} \\pm {D})\\," + unit_tex(unit)


def result(mean, delta):
    """(mean, Δ) written: Δ to one figure, the mean at its position; None at a half or when Δ carries."""
    p = first_pos(delta)
    d = round_half_up(delta, p)
    m = round_half_up(mean, p)
    if d is None or m is None or d >= Rational(10) ** (p + 1):
        return None
    k = max(0, -p)
    return fmt_dec(m, k), fmt_dec(d, k)


def level1(sample, s, errs):
    m = re.fullmatch(r"Quante cifre significative ha la misura \$" + NUM + r"\\,(.+)\$\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    num = m.group(1)
    n = count_sig(num)
    ch = sample["answer"]
    vals = [o["latex"] for o in ch["options"]]
    if not all(re.fullmatch(r"\d", v) for v in vals):
        errs.append(f"options {vals}")
    one_right(sample, errs, str(n))
    if "\\cdot" in num:
        return "scientifica"
    digits = num.replace("{,}", "")
    if "{,}" in num and num.startswith("0{,}0"):
        return "finali" if num.endswith("0") else "iniziali"
    if "{,}" in num and num.endswith("0"):
        return "finali"
    if "0" in digits.strip("0"):
        return "mezzo"
    return "nessuno"


def level2(sample, s, errs):
    m = re.fullmatch(r"Arrotonda la misura \$" + NUM + r"\\,(.+?)\$ a (due|tre) cifre significative\.", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    x = parse_num(m.group(1))
    n = WORDS[m.group(3)]
    p = first_pos(x) - n + 1
    y = x / Rational(10) ** p
    frac = y - (y.p // y.q)
    if abs(frac - Rational(1, 2)) < Rational(1, 100):
        errs.append("near a half")
    r = rounded(x, n)
    unit = m.group(2)
    if r is None:
        errs.append("tie")
        return None
    one_right(sample, errs, r[1] + "\\," + unit)
    if "\\cdot" in r[1] and first_pos(r[0]) >= first_pos(x) and x == int(x) and first_pos(x) >= 4:
        return "scientifica"
    if first_pos(r[0]) > first_pos(x):
        return "riporto"
    if r[1].endswith("0"):
        return "zeri"
    return "decimale"


def level3(sample, s, errs):
    m = re.fullmatch(r"(Quattro|Cinque) (?:titolazioni della stessa soluzione, con una buretta|pesate dello stesso campione, con una bilancia) che ha la sensibilità di \$" + NUM + r"\\,\\text\{(mL|g)\}\$, (?:richiedono|danno) (.+) \$\\text\{(mL|g)\}\$\. Come si scrive il risultato\?", s)
    if not m:
        errs.append(f"level 3 text not recognised: {s!r}")
        return None
    sens, unit, lst, unit2 = parse_num(m.group(2)), m.group(3), m.group(4), m.group(5)
    if unit != unit2:
        errs.append("units")
    xs_s = re.findall(r"\$([\d{},]+)\$", lst)
    count = {"Quattro": 4, "Cinque": 5}[m.group(1)]
    if len(xs_s) != count:
        errs.append("count of readings")
    d = 1 if unit == "mL" else 2
    if sens != Rational(1, 10**d) or any(decimals_of(x) != d for x in xs_s):
        errs.append("readings and sensitivity")
    xs = [parse_num(x) for x in xs_s]
    mean = sum(xs) / len(xs)
    semi = (max(xs) - min(xs)) / 2
    if semi == sens:
        errs.append("semidispersion equal to the sensitivity")
    delta = semi if semi > sens else sens
    r = result(mean, delta)
    if r is None:
        errs.append("tie")
        return None
    one_right(sample, errs, res_latex(r[0], r[1], unit))
    return "semidispersione" if semi > sens else "sensibilita"


def level4(sample, s, errs):
    if m := re.fullmatch(r"In una titolazione la buretta, che ha la sensibilità di \$0\{,\}1\\,\\text\{mL\}\$, segna " + qre("mL") + " all'inizio e " + qre("mL") + r" alla fine\. Quanto titolante è uscito\?", s):
        vi, vf = parse_num(m.group(1)), parse_num(m.group(2))
        one_right(sample, errs, res_latex(fmt_dec(vf - vi, 1), "0{,}2", "mL"))
        return "buretta"
    if m := re.fullmatch(r"Con una bilancia che ha la sensibilità di \$0\{,\}01\\,\\text\{g\}\$ si pesa un becher vuoto, " + qre("g") + r", e poi il becher con un campione, " + qre("g") + r"\. Quanto vale la massa del campione\?", s):
        m1, m2 = parse_num(m.group(1)), parse_num(m.group(2))
        one_right(sample, errs, res_latex(fmt_dec(m2 - m1, 2), "0{,}02", "g"))
        return "pesata"
    if m := re.fullmatch(r"In un becher che pesa " + qre("g") + r" si aggiungono " + qre("g") + r" di sale, pesati con una bilancia meno sensibile\. Quanto pesa il becher con il sale\?", s):
        a, b = m.group(1), m.group(2)
        k = min(decimals_of(a), decimals_of(b))
        tot = parse_num(a) + parse_num(b)
        r = round_half_up(tot, -k)
        if r is None:
            errs.append("tie")
            return None
        one_right(sample, errs, fmt_dec(r, k) + "\\," + unit_tex("g"))
        return "somma"
    errs.append(f"level 4 text not recognised: {s!r}")
    return None


def level5(sample, s, errs):
    if m := re.fullmatch(r"Un liquido ha la massa di " + qre("g") + r" e il volume di " + qre("mL") + r"\. Quanto vale la sua densità\?", s):
        x, n, unit = parse_num(m.group(1)) / parse_num(m.group(2)), min(count_sig(m.group(1)), count_sig(m.group(2))), "g/mL"
        kind = "densita"
    elif m := re.fullmatch(r"Un campione (.+?), \$(.+?)\$, ha la massa di " + qre("g") + r"\. Quante moli contiene\? La massa molare è " + qre("g/mol") + r"\.", s):
        M = parse_num(m.group(4))
        if MOLAR.get(m.group(2)) != M:
            errs.append("molar mass")
        x, n, unit = parse_num(m.group(3)) / M, min(count_sig(m.group(3)), count_sig(m.group(4))), "mol"
        kind = "moli"
    elif m := re.fullmatch(r"Un liquido ha la densità di " + qre("g/mL") + r"\. Quanto pesano " + qre("mL") + r"\?", s):
        x, n, unit = parse_num(m.group(1)) * parse_num(m.group(2)), min(count_sig(m.group(1)), count_sig(m.group(2))), "g"
        kind = "massa"
    else:
        errs.append(f"level 5 text not recognised: {s!r}")
        return None
    r = rounded(x, n)
    if r is None:
        errs.append("tie")
        return None
    one_right(sample, errs, r[1] + "\\," + unit_tex(unit))
    return kind


def level6(sample, s, errs):
    if m := re.fullmatch(r"Una misura fatta con (.+?), che ha la sensibilità di \$" + NUM + r"\\,(.+?)\$, dà \$" + NUM + r"\\,(.+?)\$\. Quanto vale la sua incertezza percentuale\?", s):
        D, x = parse_num(m.group(2)), parse_num(m.group(4))
        eps = D / x * 100
        r = rounded(eps, 2)
        if r is None:
            errs.append("tie")
            return None
        if r[1].replace("{,}", "").endswith("0"):
            errs.append("percentage ending in zero")
        one_right(sample, errs, r[1] + "\\%")
        return "percentuale"
    if m := re.fullmatch(r"Un liquido ha la massa \$m = \(" + NUM + r" \\pm 0\{,\}02\)\\,\\text\{g\}\$ e il volume \$V = \(" + NUM + r" \\pm " + NUM + r"\)\\,\\text\{mL\}\$, misurato con (una pipetta tarata|un cilindro graduato)\. Quanto vale la sua densità\?", s):
        mm, V, DV = parse_num(m.group(1)), parse_num(m.group(2)), parse_num(m.group(3))
        d = mm / V
        Dd = d * (Rational(2, 100) / mm + DV / V)
        r = result(d, Dd)
        if r is None:
            errs.append("tie")
            return None
        one_right(sample, errs, res_latex(r[0], r[1], "g/mL"))
        return "densita"
    errs.append(f"level 6 text not recognised: {s!r}")
    return None


def check(sample):
    errs = []
    common(sample, errs)
    fn = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    try:
        kind = fn(sample, text(sample), errs)
    except (ValueError, KeyError, AttributeError, TypeError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
