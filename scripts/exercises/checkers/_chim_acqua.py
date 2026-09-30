"""Helpers for the checkers of the water generators (chemistry group 29: chim-acqua-molecola, chim-acqua-proprieta,
chim-acqua-solvente, chim-acqua-acidi-basi), written from the specs and the lessons 44-47, not from
src/lib/exercises/v2/chim-acqua.ts.

Problems are \\text{} lines (read back with `prose`); options are plain text (\\text{} or a gathered block of
\\text{} lines, read with `option_text`), formulas, or quantities "<number>\\,<unit>" with the number written as the
lessons write it (decimal comma, scientific notation "1{,}18 \\cdot 10^{3}"). Rounding is `rounded` of the heat
checkers: exact, half up, refused near a tie.
"""
import re

from sympy import Rational

from checkers._fis_calore import NUMBER, rounded, value
from checkers._fis_grandezze import option_text
from checkers._vettori import BANNED, prose

UNITS = {
    "C": r"^\circ\text{C}",
    "f": r"^\circ\text{f}",
    "g": r"\text{g}",
    "mg": r"\text{mg}",
    "mL": r"\text{mL}",
    "L": r"\text{L}",
    "cm3": r"\text{cm}^3",
    "J": r"\text{J}",
    "kJ": r"\text{kJ}",
    "mol": r"\text{mol}",
    "gmL": r"\text{g/mL}",
    "gcm3": r"\text{g/cm}^3",
    "mgL": r"\text{mg/L}",
    "cJ": r"\text{J/(g}\cdot{}^\circ\text{C)}",
}

__all__ = ["BANNED", "NUMBER", "Rational", "UNITS", "common", "exact_dec", "one_right", "option_text", "prose", "quantity", "quantity_options", "rounded", "text", "value"]


def text(sample):
    return prose(sample["problem"])


def quantity(u):
    """A regex for a quantity inside prose: $<number>\\,<unit>$, the number captured."""
    return r"\$(" + NUMBER + ")" + re.escape(r"\," + UNITS[u]) + r"\$"


def exact_dec(s):
    """A decimal written with the comma, "0{,}917" → 917/1000."""
    return Rational(s.replace("{,}", "."))


def common(sample, errs):
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")
    a = sample.get("answer", {})
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    opts = a.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("two options written the same")
    if len({"|".join(o["values"]) for o in opts}) != len(opts):
        errs.append("two options with the same value")
    c = a.get("correct")
    if not isinstance(c, int) or not 0 <= c < len(opts):
        errs.append("correct index out of range")


def one_right(sample, errs, is_right):
    """Exactly one option satisfies is_right(option), and `correct` points to it."""
    opts = sample["answer"]["options"]
    right = []
    for i, o in enumerate(opts):
        try:
            if is_right(o):
                right.append(i)
        except (ValueError, KeyError) as e:
            errs.append(f"option {o['latex']!r} unreadable: {e}")
    if len(right) != 1:
        errs.append(f"{len(right)} right options")
    elif sample["answer"]["correct"] != right[0]:
        errs.append(f"correct = {sample['answer']['correct']}, the right option is {right[0]}")


def quantity_options(sample, errs, truth, n, u, no_final_zero=True):
    """Four quantity options in unit u with distinct values; the correct one is truth rounded to n figures."""
    want = rounded(truth, n)
    if want is None:
        errs.append(f"{truth} too close to a rounding boundary")
        return
    if no_final_zero and re.fullmatch(r"\d*0", want):
        errs.append(f"result {want} ends with an ambiguous zero")
    opts = sample["answer"]["options"]
    vals = []
    for o in opts:
        m = re.fullmatch("(" + NUMBER + ")" + re.escape(r"\," + UNITS[u]), o["latex"])
        if not m:
            errs.append(f"option {o['latex']!r} is not a quantity in {u}")
            return
        vals.append(value(m.group(1)))
    if len(set(vals)) != len(vals):
        errs.append("two options with the same value")
    one_right(sample, errs, lambda o: o["latex"] == want + r"\," + UNITS[u])
