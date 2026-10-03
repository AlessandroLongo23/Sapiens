"""Shared helpers for the checkers of the first computer science chapter, "Informatica e informazione"
(inf-informazione-dati, hardware-software, inf-bit-byte).

Numbers as the lessons write them: 3{,}5, 4096, 65\\,536 (thousands with \\, from five digits); units upright after a
thin space, \\,\\text{MB}. Problems are prose lines \\text{...} stacked in an array, with inline $...$ formulas,
sometimes followed by a table (an array of its own). Text options are \\text{...} or a gathered of \\text{...} lines.
"""
import re

from sympy import Rational

BANNED = re.compile(r"—|piuttosto che")

NUM = r"(?:\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}\d+)?"


def parse_dec(s):
    """3{,}5 -> 7/2; 65\\,536 -> 65536. Raises on anything else."""
    s = s.strip()
    m = re.fullmatch(r"((?:\d{1,3}(?:\\,\d{3})+|\d+))(?:\{,\}(\d+))?", s)
    if not m:
        raise ValueError(f"not a decimal: {s!r}")
    whole = m.group(1).replace("\\,", "")
    frac = m.group(2) or ""
    return Rational(int(whole + frac), 10 ** len(frac))


def fmt_dec(r):
    """The canonical writing of a terminating decimal."""
    r = Rational(r)
    if r < 0:
        raise ValueError(f"{r} is negative")
    k = 0
    while (r * 10**k).q != 1:
        k += 1
        if k > 12:
            raise ValueError(f"{r} is not a terminating decimal")
    s = str(int(r * 10**k)).rjust(k + 1, "0")
    whole, frac = s[: len(s) - k], s[len(s) - k :]
    if len(whole) >= 5:
        whole = f"{int(whole):,}".replace(",", "\\,")
    return f"{whole}{{,}}{frac}" if frac else whole


def canonical(s):
    """Parses a decimal and checks it is written in the canonical way."""
    v = parse_dec(s)
    if fmt_dec(v) != s.strip():
        raise ValueError(f"number {s!r} not canonical (expected {fmt_dec(v)!r})")
    return v


def split_unit(s):
    """'3{,}5\\,\\text{MB}' -> ('3{,}5', 'MB')."""
    m = re.fullmatch(r"(.*?)\\,\\text\{([^}]*)\}", s.strip())
    if not m:
        raise ValueError(f"no unit in {s!r}")
    return m.group(1), m.group(2)


def top_lines(tex):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex.strip(), re.S)
    if not m:
        return [tex.strip()]
    body = m.group(1)
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
        for p in parts:
            if len(option_text(p)) > 24:
                raise ValueError(f"option line longer than 24 characters: {p!r}")
        return " ".join(option_text(p) for p in parts)
    m = re.fullmatch(r"\\text\{(.*)\}", s)
    if not m:
        raise ValueError(f"option not plain text: {latex!r}")
    return m.group(1)


def check_choice(ch, is_right, errs, n=4):
    """Four options with different values and writings, exactly one right, and `correct` pointing to it."""
    if not isinstance(ch, dict) or ch.get("kind") != "choice":
        errs.append("no choice")
        return
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


def the_choice(sample):
    """The multiple choice of a sample: the answer itself, or its `choice` variant."""
    a = sample.get("answer", {})
    return a if a.get("kind") == "choice" else sample.get("choice")


def check_number(sample, truth, errs, unit=None):
    """A number answer equal to `truth` (exact), and a choice of numbers (with `unit`, if given) with one right."""
    truth = Rational(truth)
    a = sample.get("answer", {})
    if a.get("kind") != "number":
        errs.append(f"answer.kind is {a.get('kind')}, expected number")
    elif not re.fullmatch(r"\d+(/\d+)?", str(a.get("value"))) or Rational(a["value"]) != truth:
        errs.append(f"answer {a.get('value')} != {truth}")

    def value(o):
        latex = o["latex"]
        if unit is not None:
            latex, u = split_unit(latex)
            if u != unit:
                raise ValueError(f"unit {u!r}, expected {unit!r}")
        v = canonical(latex)
        if o["values"] != [str(v)]:
            raise ValueError(f"values {o['values']} do not match {latex!r}")
        return v

    check_choice(sample.get("choice"), lambda o: value(o) == truth, errs)


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    text = sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")
