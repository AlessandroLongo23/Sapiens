"""Shared helpers of the checkers of the chapter "La codifica dell'informazione" (inf_interi_segno,
inf_virgola_mobile, inf_codifica_caratteri, inf_codifica_immagini, inf_codifica_suoni).

Written from the specs, not from src/lib/exercises/v2/inf-codifica.ts: the prose of a problem is read back from
its \\text{...} lines, numbers are parsed and written with the conventions of the lessons (decimal comma, thin
space every three digits from 10 000, bits in groups of four) and compared as exact fractions.
"""
import re
from fractions import Fraction

BANNED = re.compile(r"—|piuttosto che")
NUM = r"-?(?:\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}\d+)?"


def top_lines(tex):
    """The lines of a problem: the rows of its outer array, or the problem itself."""
    s = tex.strip()
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", s, re.S)
    return [p.strip() for p in m.group(1).split(" \\\\ ")] if m else [s]


def prose_and_extra(tex):
    """The prose of the \\text{...} lines joined with spaces (inline formulas between dollars), and the lines that
    are formulas on their own."""
    prose, extra = [], []
    for line in top_lines(tex):
        m = re.fullmatch(r"\\text\{(.*)\}", line)
        if m:
            prose.append(m.group(1))
        else:
            extra.append(line)
    return " ".join(prose), extra


def parse_num(s):
    """2{,}25 -> 9/4, 10\\,000 -> 10000."""
    s = s.strip()
    if not re.fullmatch(NUM, s):
        raise ValueError(f"not a number: {s!r}")
    return Fraction(s.replace("\\,", "").replace("{,}", "."))


def rat(s):
    if not isinstance(s, str) or not re.fullmatch(r"-?\d+(/\d+)?", s):
        raise ValueError(f"not an exact rational: {s!r}")
    return Fraction(s)


def group(digits):
    if len(digits) < 5:
        return digits
    out = ""
    while len(digits) > 3:
        out = "\\," + digits[-3:] + out
        digits = digits[:-3]
    return digits + out


def fmt_num(x):
    """A fraction with a short decimal expansion, as the lessons write it."""
    x = Fraction(x)
    for d in range(9):
        scaled = abs(x) * 10**d
        if scaled.denominator == 1:
            digits = str(scaled.numerator).rjust(d + 1, "0")
            body = group(digits[: len(digits) - d]) + ("{,}" + digits[len(digits) - d :] if d else "")
            return ("-" if x < 0 else "") + body
    raise ValueError(f"{x} is not a short decimal")


def with_unit(num, unit):
    return f"{num}\\,\\text{{{unit}}}" if unit else num


def bits_tex(s):
    """Bits in groups of four from the right, thin spaces between the groups."""
    out = ""
    while len(s) > 4:
        out = "\\," + s[-4:] + out
        s = s[:-4]
    return s + out


def option_text(latex):
    """The words of an option: \\text{...}, or a gathered of \\text{...} lines joined with a space."""
    s = latex.strip()
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", s)
    if m:
        return " ".join(option_text(p) for p in m.group(1).split(" \\\\ "))
    m = re.fullmatch(r"\\text\{([^{}]*)\}", s)
    if not m:
        raise ValueError(f"option not plain text: {latex!r}")
    return m.group(1)


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    if not sample.get("prompt"):
        errs.append("no prompt")
    text = sample.get("prompt", "") + sample["problem"] + " ".join(sample.get("steps", [])) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")
    # when the answer is itself a choice, the choice variant of the sample must be that same choice
    ans = sample.get("answer", {})
    if ans.get("kind") == "choice" and "choice" in sample and sample["choice"] != ans:
        errs.append("the choice variant differs from the answer")


def need(text, piece, errs):
    """The problem must say `piece` (a number as it is written, a word of the question)."""
    if piece not in text:
        errs.append(f"the problem does not say {piece!r}")


def check_options(ch, is_right, errs, n=4):
    """`n` options with different values and different writings, exactly one right, `correct` pointing to it."""
    if not isinstance(ch, dict) or ch.get("kind") != "choice":
        errs.append("no multiple choice")
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
        except Exception as e:  # noqa: BLE001 - an option the checker cannot read is an error
            errs.append(f"option {o['latex']!r} unreadable: {e}")
    if len(right) != 1:
        errs.append(f"{len(right)} right options: {[opts[i]['latex'] for i in right]}")
    elif ch.get("correct") != right[0]:
        errs.append(f"correct = {ch.get('correct')} but the right option is {right[0]}")


def check_number(sample, truth, errs, unit=""):
    """A number answer equal to `truth`, a solution that writes it, three wrong values in params, and a choice (when
    the sample has one) whose options are numbers written as their values, only one equal to the truth."""
    truth = Fraction(truth)
    ans = sample.get("answer", {})
    if ans.get("kind") != "number":
        errs.append(f"answer.kind is {ans.get('kind')}, expected number")
        return
    try:
        if rat(ans["value"]) != truth:
            errs.append(f"answer {ans['value']} but the value is {truth}")
        if ans["value"] != str(truth):
            errs.append(f"answer {ans['value']} not in lowest terms")
    except ValueError as e:
        errs.append(str(e))
    if sample.get("solution") != with_unit(fmt_num(truth), unit):
        errs.append(f"solution {sample.get('solution')!r} is not {with_unit(fmt_num(truth), unit)!r}")
    p = sample.get("params", {})
    if p.get("unit", "") != unit:
        errs.append(f"params.unit {p.get('unit')!r}, expected {unit!r}")
    wrong = p.get("wrong")
    if not isinstance(wrong, list) or len(wrong) < 3:
        errs.append("fewer than three wrong values")
    else:
        vals = [rat(w) for w in wrong]
        if truth in vals or len(set(vals)) != len(vals):
            errs.append(f"wrong values repeated or equal to the answer: {wrong}")
    ch = sample.get("choice")
    if ch is None:
        return

    def is_right(o):
        value = rat(o["values"][0])
        tex = o["latex"]
        if unit:
            suffix = f"\\,\\text{{{unit}}}"
            if not tex.endswith(suffix):
                raise ValueError("unit missing")
            tex = tex[: -len(suffix)]
        if parse_num(tex) != value or tex != fmt_num(value):
            raise ValueError(f"written {tex!r} for the value {value}")
        return value == truth

    check_options(ch, is_right, errs)


def check_bit_choice(sample, truth, errs, width=8):
    """A choice among bit strings of `width` bits, written in groups of four; `truth` is the right string."""
    ans = sample.get("answer", {})

    def is_right(o):
        s = o["values"][0]
        if not re.fullmatch(rf"[01]{{{width}}}", s) or o["latex"] != bits_tex(s):
            raise ValueError("not a bit string written in groups of four")
        return s == truth

    check_options(ans, is_right, errs)
    if sample.get("solution") != bits_tex(truth):
        errs.append(f"solution {sample.get('solution')!r} is not {bits_tex(truth)!r}")


def check_text_choice(sample, truth, allowed, errs):
    """A choice among words: every option is one of `allowed`, its value is its text, the right one is `truth`."""
    ans = sample.get("answer", {})

    def is_right(o):
        text = option_text(o["latex"])
        if text not in allowed or o["values"] != [text]:
            raise ValueError("option out of the list")
        return text == truth

    check_options(ans, is_right, errs)
