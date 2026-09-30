"""Checker for chim-pressione-gas (specs/exercises/chim-pressione-gas.md), written from the spec and the lesson
30-chim-pressione-gas.md, not from the generator.

1 atm = 760 mmHg = 101,3 kPa; 1 bar = 100 kPa; p = F / S with S in m² (1 cm² = 10⁻⁴ m²); open-tube manometer:
p_gas = p0 + Δh when the mercury is higher in the open branch, p0 - Δh when it is higher on the gas side (mmHg);
absolute pressure = relative + atmospheric.
"""
import re

from checkers._chim_gas import answer, answer_int, common, quantity, sig_of, text, value
from sympy import Rational

CASE_RANGES = {
    1: {"atm-mmHg": (0.18, 0.32), "mmHg-atm": (0.18, 0.32), "atm-kPa": (0.18, 0.32), "kPa-atm": (0.18, 0.32)},
    2: {"mmHg-kPa": (0.40, 0.60), "kPa-mmHg": (0.40, 0.60)},
    3: {"forza": (0.40, 0.60), "pressione": (0.40, 0.60)},
    4: {"piu": (0.40, 0.60), "meno": (0.40, 0.60)},
    5: {"bar": (0.40, 0.60), "kPa": (0.40, 0.60)},
}

ATM_MMHG = Rational(760)
ATM_KPA = Rational(1013, 10)
NAMES = {"atmosfere": "atm", "millimetri di mercurio": "mmHg", "kilopascal": "kPa"}


def level1(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un gas ha la pressione di \$(" + r"\d+(?:\{,\}\d+)?" + r")\\,\\text\{(atm|mmHg|kPa)\}\$\. Quanto vale la sua pressione in (atmosfere|millimetri di mercurio|kilopascal)\?", s)
    if not m:
        errs.append(f"level 1 text not recognised: {s!r}")
        return None
    x, frm, to = value(m.group(1)), m.group(2), NAMES[m.group(3)]
    if sig_of(m.group(1)) != 3:
        errs.append("datum without three significant figures")
    if "atm" not in (frm, to) or frm == to:
        errs.append("units")
    other = to if frm == "atm" else frm
    factor = ATM_MMHG if other == "mmHg" else ATM_KPA
    truth = x * factor if frm == "atm" else x / factor
    answer(sample, errs, truth, 3, to)
    return f"{frm}-{to}"


def level2(sample, errs):
    s = text(sample)
    m = re.fullmatch(r"Un manometro segna \$(\d+(?:\{,\}\d)?)\\,\\text\{(mmHg|kPa)\}\$\. Quanto vale la pressione in (kilopascal|millimetri di mercurio)\?", s)
    if not m:
        errs.append(f"level 2 text not recognised: {s!r}")
        return None
    x, frm, to = value(m.group(1)), m.group(2), NAMES[m.group(3)]
    if sig_of(m.group(1)) != 3 or {frm, to} != {"mmHg", "kPa"}:
        errs.append("datum or units")
    truth = x / ATM_MMHG * ATM_KPA if frm == "mmHg" else x / ATM_KPA * ATM_MMHG
    answer(sample, errs, truth, 3, to)
    return f"{frm}-{to}"


def level3(sample, errs):
    s = text(sample)
    if m := re.fullmatch(r"Un gas chiuso in un cilindro ha la pressione di " + quantity("atm") + r"\. Con quale forza spinge sul pistone, che ha l'area di " + quantity("cm2") + r"\?", s):
        p, S = value(m.group(1)), value(m.group(2))
        if sig_of(m.group(1)) != 2 or sig_of(m.group(2)) != 2:
            errs.append("data without two significant figures")
        F = p * ATM_KPA * 1000 * S / 10**4
        answer(sample, errs, F, 2, "N")
        return "forza"
    if m := re.fullmatch(r"Un gas spinge sul pistone di un cilindro, che ha l'area di " + quantity("cm2") + r", con la forza di " + quantity("N") + r"\. Quanto vale la pressione del gas, in kilopascal\?", s):
        S, F = value(m.group(1)), value(m.group(2))
        p = F / (S / 10**4) / 1000
        answer(sample, errs, p, 2, "kPa")
        return "pressione"
    errs.append(f"level 3 text not recognised: {s!r}")
    return None


def level4(sample, errs):
    s = text(sample)
    m = re.fullmatch(
        r"Un pallone di gas è collegato a un manometro a tubo aperto, come nella figura\. La pressione atmosferica è " + quantity("mmHg")
        + r", e il mercurio è \$(\d+)\\,\\text\{mm\}\$ più in alto (nel ramo aperto|nel ramo collegato al gas)\. Quanto vale la pressione del gas\?",
        s,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {s!r}")
        return None
    p0, dh = int(m.group(1)), int(m.group(2))
    if not 740 <= p0 <= 775 or not 12 <= dh <= 250:
        errs.append("data out of range")
    open_side = m.group(3) == "nel ramo aperto"
    sc = sample.get("scene") or {}
    d = sc.get("data", {})
    if sc.get("type") != "manometro-aperto" or d.get("dislivello") != dh or d.get("lato") != ("aperto" if open_side else "gas"):
        errs.append("scene does not match the text")
    answer_int(sample, errs, p0 + dh if open_side else p0 - dh, "mmHg")
    return "piu" if open_side else "meno"


def level5(sample, errs):
    s = text(sample)
    if m := re.fullmatch(
        r"Il manometro di un distributore segna " + quantity("bar") + r" per la gomma di una bicicletta: è la pressione relativa\. La pressione atmosferica è \$1\{,\}0\\,\\text\{bar\}\$\. Quanto vale la pressione assoluta dell'aria nella gomma, in kilopascal\?",
        s,
    ):
        g = value(m.group(1))
        answer(sample, errs, (g + 1) * 100, 2, "kPa")
        return "bar"
    if m := re.fullmatch(
        r"Il manometro di una bombola segna " + quantity("kPa") + r", la pressione relativa\. La pressione atmosferica è \$101\{,\}3\\,\\text\{kPa\}\$\. Quanto vale la pressione assoluta del gas nella bombola, in atmosfere\?",
        s,
    ):
        g = value(m.group(1))
        answer(sample, errs, (g + ATM_KPA) / ATM_KPA, 3, "atm")
        return "kPa"
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
