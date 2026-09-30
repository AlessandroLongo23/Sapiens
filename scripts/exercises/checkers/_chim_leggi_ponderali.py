"""Helpers for the checkers of group 24 (chim-trasformazioni-fisiche-chimiche, chim-elementi-composti,
chim-legge-lavoisier, chim-legge-proust), written from the specs and the lessons 21-24, not from
src/lib/exercises/v2/chim-leggi-ponderali.ts.

Options are words (\\text{...}, or a gathered block of \\text{...} lines), masses in grams ("7{,}87\\,\\text{g}", maybe
followed by words: "0{,}98\\,\\text{g di zolfo}") or pure numbers ("3{,}96"). Values are exact (sympy Rational); a
result is rounded half up, and a value within 1e-9 of a tie is refused.
"""
import re

from sympy import Rational, floor, log

from checkers._fis_grandezze import check_choice
from checkers._vettori import BANNED, prose

__all__ = ["check_choice", "prose", "option_text", "common", "grams", "num", "mass_option", "number_option", "round_sig", "round_dec", "G"]

# a mass in prose: $7{,}87\,\text{g}$, the number captured
G = r"\$(\d+(?:\{,\}\d+)?)\\,\\text\{g\}\$"


def option_text(latex):
    """The words of an option: \\text{...}, or the \\text{...} lines of a gathered block joined with a space."""
    s = latex.strip()
    m = re.fullmatch(r"\\begin\{gathered\}(.*)\\end\{gathered\}", s, re.S)
    if m:
        return " ".join(option_text(p) for p in m.group(1).split("\\\\"))
    m = re.fullmatch(r"\\text\{([^{}]*)\}", s)
    if not m:
        raise ValueError(f"option not plain text: {latex!r}")
    return m.group(1)


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    text = " ".join([sample["problem"], sample.get("solution", ""), *sample["steps"]])
    if BANNED.search(text):
        errs.append("forbidden words")
    if sample.get("answer", {}).get("kind") != "choice":
        errs.append("answer is not a choice")


def num(s):
    """A number as written: "7{,}87" → 787/100."""
    if not re.fullmatch(r"\d+(?:\{,\}\d+)?", s):
        raise ValueError(f"not a number: {s!r}")
    return Rational(s.replace("{,}", "."))


def grams(s):
    """The value of a mass captured by G."""
    return num(s)


def mass_option(latex):
    """(value, words after the unit) of an option "7{,}87\\,\\text{g}" or "0{,}98\\,\\text{g di zolfo}"."""
    m = re.fullmatch(r"(\d+(?:\{,\}\d+)?)\\,\\text\{g(?: ([a-z' ]+))?\}", latex)
    if not m:
        raise ValueError(f"not a mass option: {latex!r}")
    return m.group(1), m.group(2) or ""


def number_option(latex):
    if not re.fullmatch(r"\d+(?:\{,\}\d+)?", latex):
        raise ValueError(f"not a number option: {latex!r}")
    return latex


def _digits(x, k):
    """x > 0 as the digits of x / 10^k rounded half up, or None near a tie."""
    y = x / Rational(10) ** k
    fl = int(floor(y.evalf(60)))
    frac = (y - fl).evalf(60)
    if abs(frac - Rational(1, 2)) < Rational(1, 10**9):
        return None
    return fl + 1 if frac > Rational(1, 2) else fl


def _write(m, k):
    """The integer m times 10^-k as the lessons write it (k >= 0 decimals)."""
    s = str(m).rjust(k + 1, "0")
    return s[: len(s) - k] + ("{,}" + s[len(s) - k :] if k else "")


def round_dec(x, d):
    """Exact x > 0 rounded to d decimals, written with the decimal comma, or None near a tie."""
    x = Rational(x)
    m = _digits(x, -d)
    return None if m is None else _write(m, d)


def round_sig(x, n):
    """Exact x > 0 rounded to n significant figures, written plain, or None near a tie or from 10^n up."""
    x = Rational(x)
    if x <= 0:
        return None
    e = int(floor(log(x, 10).evalf(60)))
    if Rational(10) ** e > x:
        e -= 1
    if Rational(10) ** (e + 1) <= x:
        e += 1
    m = _digits(x, e - n + 1)
    if m is None:
        return None
    if m >= 10**n:
        m //= 10
        e += 1
    if e >= n:
        return None
    return _write(m, n - 1 - e)
