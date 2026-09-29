"""Shared helpers for the checkers of the physics chapter on quantities and units (group 1).

Numbers as the physics lessons write them: 1{,}42, 35\\,000, 4{,}2 \\cdot 10^{-4}; units upright after a thin space,
\\,\\text{m}, \\,\\mu\\text{m}, \\,\\text{kg/m}^3. Problems are prose lines \\text{...} stacked in an array, with inline
$...$ formulas, sometimes followed by a table (an array of its own).
"""
import re

from sympy import Rational

BANNED = re.compile(r"—|piuttosto che")

NUM = r"(?:\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}\d+)?"


def parse_dec(s):
    """1{,}42 -> 71/50; 35\\,000 -> 35000. Raises on anything else."""
    s = s.strip()
    m = re.fullmatch(r"(-?)((?:\d{1,3}(?:\\,\d{3})+|\d+))(?:\{,\}(\d+))?", s)
    if not m:
        raise ValueError(f"not a decimal: {s!r}")
    whole = m.group(2).replace("\\,", "")
    frac = m.group(3) or ""
    v = Rational(int(whole + frac), 10 ** len(frac))
    return -v if m.group(1) else v


def fmt_dec(r, digits=None):
    """The canonical writing of a terminating decimal (thousands with \\, from five digits)."""
    r = Rational(r)
    neg = r < 0
    r = abs(r)
    k = 0
    while (r * 10**k).q != 1:
        k += 1
        if k > 15:
            raise ValueError(f"{r} is not a terminating decimal")
    if digits is not None:
        if digits < k:
            raise ValueError(f"{r} has more than {digits} decimals")
        k = digits
    s = str(int(r * 10**k)).rjust(k + 1, "0")
    whole, frac = s[: len(s) - k], s[len(s) - k :]
    if len(whole) >= 5:
        whole = f"{int(whole):,}".replace(",", "\\,")
    return ("-" if neg else "") + (f"{whole}{{,}}{frac}" if frac else whole)


def canonical_dec(s, digits=None):
    """Parses a decimal and checks it is written in the canonical way."""
    v = parse_dec(s)
    if fmt_dec(v, digits) != s.strip():
        raise ValueError(f"number {s!r} not canonical (expected {fmt_dec(v, digits)!r})")
    return v


def parse_sci(s):
    """a \\cdot 10^{n} or a \\cdot 10^n or a \\cdot 10 or a plain decimal -> (value, a, n)."""
    s = s.strip()
    m = re.fullmatch(r"(" + NUM + r") \\cdot 10(?:\^(-?\d)|\^\{(-?\d+)\})?", s)
    if m:
        a = parse_dec(m.group(1))
        n = int(m.group(2) or m.group(3) or 1)
        return a * Rational(10) ** n, a, n
    a = parse_dec(s)
    return a, a, 0


def pow10_tex(n):
    if n == 1:
        return "10"
    return f"10^{n}" if 0 <= n < 10 else f"10^{{{n}}}"


def fmt_sci(r):
    """The canonical scientific notation of r > 0."""
    r = Rational(r)
    if r <= 0:
        raise ValueError(f"{r} is not positive")
    n = 0
    while r >= 10 * Rational(10) ** n:
        n += 1
    while r < Rational(10) ** n:
        n -= 1
    a = r / Rational(10) ** n
    return fmt_dec(a) if n == 0 else f"{fmt_dec(a)} \\cdot {pow10_tex(n)}"


def unit_tex(u):
    if u.startswith("μ"):
        return "\\mu\\text{" + u[1:] + "}"
    m = re.fullmatch(r"(.*?)(\^\d)?", u)
    return "\\text{" + m.group(1) + "}" + (m.group(2) or "")


def split_unit(s):
    """'3{,}5\\,\\text{km}' -> ('3{,}5', 'km'); '4{,}2\\,\\mu\\text{m}' -> ('4{,}2', 'μm'); 'kg/m}^3' kept as 'kg/m^3'."""
    m = re.fullmatch(r"(.*?)\\,(\\mu)?\\text\{([^}]*)\}(\^\d)?", s.strip())
    if not m:
        raise ValueError(f"no unit in {s!r}")
    return m.group(1), ("μ" if m.group(2) else "") + m.group(3) + (m.group(4) or "")


def top_lines(tex):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex.strip(), re.S)
    if not m:
        return [tex.strip()]
    body = m.group(1)
    # split at \\ outside nested environments
    out, depth, cur, i = [], 0, "", 0
    while i < len(body):
        if body.startswith("\\begin{", i):
            depth += 1
        elif body.startswith("\\end{", i):
            depth -= 1
        if depth == 0 and body.startswith(" \\\\ ", i):
            out.append(cur)
            cur = ""
            i += 4
            continue
        cur += body[i]
        i += 1
    out.append(cur)
    return [x.strip() for x in out]


def prose_and_extra(tex):
    """The prose of the \\text{...} lines joined with spaces, and the other lines (a table)."""
    prose, extra = [], []
    for line in top_lines(tex):
        m = re.fullmatch(r"\\text\{(.*)\}", line)
        if m:
            prose.append(m.group(1))
        else:
            extra.append(line)
    return " ".join(prose), extra


def option_text(latex):
    """The plain text of an option: \\text{...} or a gathered of \\text{...} lines joined with a space."""
    s = latex.strip()
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", s)
    if m:
        parts = [p.strip() for p in m.group(1).split(" \\\\ ")]
        return " ".join(option_text(p) for p in parts)
    m = re.fullmatch(r"\\text\{(.*)\}", s)
    if not m:
        raise ValueError(f"option not plain text: {latex!r}")
    return m.group(1)


def check_choice(ch, is_right, errs, n=4):
    """Four options with different values, exactly one right, and `correct` pointing to it. `is_right(option)`."""
    opts = ch.get("options", [])
    if len(opts) != n:
        errs.append(f"{len(opts)} options, expected {n}")
        return
    keys = ["|".join(o["values"]) for o in opts]
    if len(set(keys)) != len(keys):
        errs.append(f"options not distinct: {keys}")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("two options written the same")
    right = []
    for i, o in enumerate(opts):
        try:
            if is_right(o):
                right.append(i)
        except Exception as e:  # noqa: BLE001
            errs.append(f"option {o['latex']!r} unreadable: {e}")
    if len(right) != 1:
        errs.append(f"{len(right)} right options: {[opts[i]['latex'] for i in right]}")
    elif ch.get("correct") != right[0]:
        errs.append(f"correct = {ch.get('correct')} but the right option is {right[0]}")


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    text = sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")
    if sample.get("answer", {}).get("kind") != "choice":
        errs.append("answer is not a choice")
