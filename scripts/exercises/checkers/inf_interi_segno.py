"""Checker for inf-interi-segno (specs/exercises/inf-interi-segno.md).

Written from the spec. The data are read back from the text of the problem (the bit string, the numbers of the
question), compared with params, and the answer is computed again with Python integers:
- sign and magnitude: the first bit is the sign, the other seven the magnitude;
- two's complement on n bits: the unsigned value, minus 2^n when the first bit is 1;
- the sum on 8 bits: the true sum brought back between -128 and 127 by a multiple of 256.
"""
import re

from checkers._inf_codifica import NUM, check_bit_choice, check_number, common, parse_num, prose_and_extra

CASE_RANGES = {
    1: {"negativo": (0.50, 0.66), "positivo": (0.29, 0.43), "zero-negativo": (0.02, 0.11)},
    3: {"negativo": (0.68, 0.82), "positivo": (0.18, 0.32)},
    4: {"opposto": (0.28, 0.42), "negativo": (0.44, 0.60), "positivo": (0.08, 0.19)},
    5: {"senza": (0.33, 0.47), "oltre il massimo": (0.23, 0.37), "sotto il minimo": (0.23, 0.37)},
}


def read_bits(extra, errs):
    """The only formula line of the problem: 8 bits in two groups of four."""
    if len(extra) != 1 or not re.fullmatch(r"[01]{4}\\,[01]{4}", extra[0]):
        errs.append(f"bit string not found in {extra}")
        return None
    return extra[0].replace("\\,", "")


def twos(s):
    return int(s, 2) - (1 << len(s)) * int(s[0])


def twos_bits(v, n=8):
    return format(v % (1 << n), f"0{n}b")


def level1(sample, prose, extra, errs):
    if prose != "Questi 8 bit rappresentano un numero intero in modulo e segno. Quale?":
        errs.append(f"level 1 text not recognised: {prose!r}")
    s = read_bits(extra, errs)
    if s is None:
        return None
    if s != sample["params"].get("bits"):
        errs.append("params.bits differs from the text")
    m = int(s[1:], 2)
    value = -m if s[0] == "1" else m
    check_number(sample, value, errs)
    if s[0] == "0" and m == 0:
        errs.append("plain zero is not asked")
    return "zero-negativo" if s == "10000000" else "negativo" if s[0] == "1" else "positivo"


def level2(sample, prose, extra, errs):
    p = sample["params"]
    if extra:
        errs.append("unexpected formula line")
    m = re.fullmatch(rf"Quanti bit servono, come minimo, per scrivere \$({NUM})\$ in complemento a due\?", prose)
    if m:
        x = int(parse_num(m.group(1)))
        if p.get("case") != "bit-minimi" or p.get("x") != x:
            errs.append("params differ from the text")
        if not 5 <= abs(x) <= 2000:
            errs.append(f"x = {x} out of range")
        n = 1
        while not -(2 ** (n - 1)) <= x <= 2 ** (n - 1) - 1:
            n += 1
        check_number(sample, n, errs)
        return "bit-minimi"
    m = re.fullmatch(
        r"(Qual è il numero più piccolo che si può scrivere|Qual è il numero più grande che si può scrivere|Quanti numeri interi diversi si possono scrivere) con \$(\d+)\$ bit in (complemento a due|modulo e segno)\?",
        prose,
    )
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    n = int(m.group(2))
    if not 3 <= n <= 16:
        errs.append(f"n = {n} out of range")
    c2 = m.group(3) == "complemento a due"
    what = "min" if "piccolo" in m.group(1) else "max" if "grande" in m.group(1) else "quanti"
    # every string of n bits, read in the representation: the range and the count come from the list
    if c2:
        values = {u - (1 << n) * (u >> (n - 1)) for u in range(1 << n)}
    else:
        values = {(-1 if u >> (n - 1) else 1) * (u & ((1 << (n - 1)) - 1)) for u in range(1 << n)}
    truth = min(values) if what == "min" else max(values) if what == "max" else len(values)
    kind = f"{what}-{'c2' if c2 else 'ms'}"
    if p.get("case") != kind or p.get("n") != n:
        errs.append("params differ from the text")
    check_number(sample, truth, errs)
    return "intervallo"


def level3(sample, prose, extra, errs):
    if prose != "Questi 8 bit rappresentano un numero intero in complemento a due. Quale?":
        errs.append(f"level 3 text not recognised: {prose!r}")
    s = read_bits(extra, errs)
    if s is None:
        return None
    if s != sample["params"].get("bits"):
        errs.append("params.bits differs from the text")
    v = twos(s)
    if v == 0:
        errs.append("zero is not asked")
    check_number(sample, v, errs)
    return "negativo" if v < 0 else "positivo"


def level4(sample, prose, extra, errs):
    p = sample["params"]
    if prose == "Questi 8 bit sono un numero in complemento a due. Quale sequenza rappresenta il suo opposto?":
        s = read_bits(extra, errs)
        if s is None:
            return None
        if p.get("case") != "opposto" or p.get("bits") != s:
            errs.append("params differ from the text")
        y = twos(s)
        if y in (0, -128):
            errs.append(f"the opposite of {y} is not asked")
            return "opposto"
        check_bit_choice(sample, twos_bits(-y), errs)
        return "opposto"
    m = re.fullmatch(r"Come si scrive \$(-?\d+)\$ in complemento a due su 8 bit\?", prose)
    if not m or extra:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    x = int(m.group(1))
    if not -128 <= x <= 127 or x == 0:
        errs.append(f"x = {x} out of range")
        return None
    if p.get("x") != x:
        errs.append("params.x differs from the text")
    truth = twos_bits(x)
    if twos(truth) != x:
        errs.append("internal: round trip failed")
    check_bit_choice(sample, truth, errs)
    return "negativo" if x < 0 else "positivo"


def level5(sample, prose, extra, errs):
    m = re.fullmatch(
        r"Un calcolatore somma \$(-?\d+)\$ e \$(-?\d+)\$ su 8 bit in complemento a due\. Che numero ottiene\? Se c'è traboccamento, scrivi il risultato sbagliato che resta negli 8 bit\.",
        prose,
    )
    if not m or extra:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    a, b = int(m.group(1)), int(m.group(2))
    p = sample["params"]
    if (p.get("a"), p.get("b")) != (a, b):
        errs.append("params differ from the text")
    if not (-128 <= a <= 127 and -128 <= b <= 127) or a == 0 or b == 0:
        errs.append("addend out of range")
    # the sum as the adder does it: add the two bytes, keep 8 bits, read them back
    got = twos(format((int(twos_bits(a), 2) + int(twos_bits(b), 2)) & 0xFF, "08b"))
    check_number(sample, got, errs)
    kind = "senza" if got == a + b else "oltre il massimo" if a + b > 127 else "sotto il minimo"
    if kind != "senza" and (a > 0) != (b > 0):
        errs.append("overflow with addends of different sign")
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')!r}, it is {kind!r}")
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
