"""Checker for inf-virgola-mobile (specs/exercises/inf-virgola-mobile.md).

Written from the spec. Binary numbers are read back from the text and evaluated digit by digit with exact
fractions (weights 1/2, 1/4, ... after the comma); the normalised exponent is found by dividing or multiplying by
two until the value is in [1, 2); a decimal has a finite binary expansion exactly when the denominator of its
fraction in lowest terms is a power of two.
"""
import re
from fractions import Fraction

from checkers._inf_codifica import NUM, check_number, check_options, common, fmt_num, parse_num, prose_and_extra, rat

CASE_RANGES = {
    3: {"finito": (0.42, 0.58), "infinito": (0.42, 0.58)},
    4: {"positivo": (0.40, 0.68), "negativo": (0.32, 0.60)},
    5: {"positivo": (0.40, 0.68), "negativo": (0.32, 0.60)},
}

BIN = r"[01]+(?:\{,\}[01]+)?"


def bin_value(tex):
    """101{,}011 -> 43/8, digit by digit."""
    if not re.fullmatch(BIN, tex):
        raise ValueError(f"not a binary number: {tex!r}")
    whole, _, frac = tex.partition("{,}")
    v = Fraction(0)
    for c in whole:
        v = 2 * v + int(c)
    for i, c in enumerate(frac, 1):
        v += Fraction(int(c), 2**i)
    return v


def to_bin(x):
    """The binary writing of a non-negative fraction with a power of two as denominator, as "101.011"."""
    whole = x.numerator // x.denominator
    r = x - whole
    out = ""
    while r:
        r *= 2
        bit = int(r >= 1)
        out += str(bit)
        r -= bit
        if len(out) > 12:
            raise ValueError("expansion too long")
    return format(whole, "b") + ("." + out if out else "")


def fixed_ok(x, errs):
    """Integer part up to 15, one to four fractional bits."""
    if not (0 < x < 16 and x.denominator in (2, 4, 8, 16)):
        errs.append(f"{x} out of the range of the level")


def level1(sample, prose, extra, errs):
    if prose != "Quanto vale in base dieci questo numero binario?" or len(extra) != 1:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    m = re.fullmatch(rf"({BIN})_2", extra[0])
    if not m:
        errs.append(f"binary number not found: {extra[0]!r}")
        return None
    if m.group(1).replace("{,}", ".") != sample["params"].get("bin"):
        errs.append("params.bin differs from the text")
    x = bin_value(m.group(1))
    fixed_ok(x, errs)
    if not m.group(1).endswith("1") or "{,}" not in m.group(1):
        errs.append("the last fractional digit must be 1")
    check_number(sample, x, errs)
    return None


def level2(sample, prose, extra, errs):
    m = re.fullmatch(rf"Come si scrive \$({NUM})\$ in base due\?", prose)
    if not m or extra:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    x = parse_num(m.group(1))
    fixed_ok(x, errs)
    if rat(sample["params"].get("value", "")) != x:
        errs.append("params.value differs from the text")
    truth = to_bin(x)

    def is_right(o):
        s = o["values"][0]
        if not re.fullmatch(r"[01]+\.[01]+", s) or o["latex"] != s.replace(".", "{,}") + "_2":
            raise ValueError("not a binary number with a comma")
        # the option is right when it has the value asked, and it must then be the canonical writing
        if bin_value(s.replace(".", "{,}")) == x and s != truth:
            raise ValueError("right value in a non-canonical writing")
        return s == truth

    check_options(sample["answer"], is_right, errs)
    if sample.get("solution") != truth.replace(".", "{,}") + "_2":
        errs.append("solution is not the binary writing")
    return None


def finite(x):
    d = x.denominator
    return d & (d - 1) == 0


def level3(sample, prose, extra, errs):
    texts = {
        "Quale di questi numeri si scrive in base due con un numero finito di cifre dopo la virgola?": True,
        "Quale di questi numeri in base due ha infinite cifre dopo la virgola, e in virgola mobile viene arrotondato?": False,
    }
    if prose not in texts or extra:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    want = texts[prose]

    def is_right(o):
        x = rat(o["values"][0])
        if o["latex"] != fmt_num(x) or x.denominator == 1 or not 0 < x < 13:
            raise ValueError("option not a decimal of the level")
        return finite(x) == want

    check_options(sample["answer"], is_right, errs)
    ans = sample["answer"]
    try:
        if sample.get("solution") != ans["options"][ans["correct"]]["latex"]:
            errs.append("solution is not the right option")
    except (KeyError, IndexError, TypeError):
        errs.append("no right option")
    kind = "finito" if want else "infinito"
    if sample["params"].get("case") != kind:
        errs.append("params.case differs from the text")
    return kind


def exponent(x):
    """n with x = m * 2^n and 1 <= m < 2."""
    n = 0
    while x >= 2:
        x /= 2
        n += 1
    while x < 1:
        x *= 2
        n -= 1
    return n, x


def float_ok(plain_tex, sample, errs):
    if plain_tex.replace("{,}", ".") != sample["params"].get("plain"):
        errs.append("params.plain differs from the text")
    x = bin_value(plain_tex)
    n, m = exponent(x)
    digits = to_bin(m).replace(".", "")
    if not (2 <= len(digits) <= 6 and -6 <= n <= 7 and n != 0):
        errs.append(f"mantissa {digits} or exponent {n} out of range")
    if plain_tex.startswith("0") and not plain_tex.startswith("0{,}"):
        errs.append("leading zero")
    return n, m


def level4(sample, prose, extra, errs):
    if prose != "Il numero è scritto in notazione scientifica normalizzata in base due. Quanto vale $n$?" or len(extra) != 1:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    m = re.fullmatch(rf"({BIN})_2 = (1\{{,\}}[01]+)_2 \\cdot 2\^\{{n\}}", extra[0])
    if not m:
        errs.append(f"formula not recognised: {extra[0]!r}")
        return None
    n, mant = float_ok(m.group(1), sample, errs)
    if bin_value(m.group(2)) != mant:
        errs.append("the mantissa shown is not the normalised one")
    check_number(sample, n, errs)
    kind = "positivo" if n > 0 else "negativo"
    if sample["params"].get("case") != kind:
        errs.append("params.case wrong")
    return kind


def level5(sample, prose, extra, errs):
    text = "Questo numero viene memorizzato in virgola mobile a 32 bit, secondo lo standard IEEE 754. Quale numero viene scritto nel campo dell'esponente?"
    if prose != text or len(extra) != 1:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    m = re.fullmatch(rf"(-?)({BIN})_2", extra[0])
    if not m:
        errs.append(f"number not recognised: {extra[0]!r}")
        return None
    if sample["params"].get("negative") != (m.group(1) == "-"):
        errs.append("params.negative differs from the text")
    n, _ = float_ok(m.group(2), sample, errs)
    check_number(sample, n + 127, errs)
    kind = "positivo" if n > 0 else "negativo"
    if sample["params"].get("case") != kind:
        errs.append("params.case wrong")
    return kind


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errs = []
    common(sample, errs)
    fn = LEVELS.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    prose, extra = prose_and_extra(sample["problem"])
    kind = fn(sample, prose, extra, errs)
    return errs, kind
