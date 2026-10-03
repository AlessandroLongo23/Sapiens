"""Shared helpers for the checkers of the chapter "I sistemi di numerazione" (informatica, first year).

Numbers as the lessons write them: the base as a subscript (1011\\,0110_2, 17_8, \\mathrm{2F}_{16}, 13_{10}), binary
digits in groups of four from the right. Problems are either one formula or prose lines \\text{...} stacked in an
array, with inline $...$ formulas. Everything is recomputed with int(x, base) and format().
"""
import re

BANNED = re.compile(r"—|piuttosto che")

NUM = r"(?:\\mathrm\{[0-9A-F]+\}|[0-9](?:[0-9]|\\,)*)_(?:\{\d+\}|\d)"


def digits_of(tex):
    """The digits of a number written without its base: 1011\\,0110 -> 10110110, \\mathrm{2F} -> 2F."""
    s = tex.strip().replace("\\,", "")
    m = re.fullmatch(r"\\mathrm\{([0-9A-F]+)\}", s)
    if m:
        return m.group(1)
    if not re.fullmatch(r"[0-9]+", s):
        raise ValueError(f"not a digit string: {tex!r}")
    return s


def parse_num(tex):
    """1011\\,0110_2 -> ("10110110", 2); \\mathrm{2F}_{16} -> ("2F", 16). Checks the digits fit the base."""
    m = re.fullmatch(r"(.+?)_(?:\{(\d+)\}|(\d))", tex.strip())
    if not m:
        raise ValueError(f"no base in {tex!r}")
    base = int(m.group(2) or m.group(3))
    digits = digits_of(m.group(1))
    int(digits, base)  # raises if a digit does not fit
    return digits, base


def grouped(digits, size=4):
    out = []
    end = len(digits)
    while end > 0:
        out.insert(0, digits[max(0, end - size):end])
        end -= size
    return "\\,".join(out)


def num_tex(digits, base):
    """The canonical writing of a number in a base."""
    if base == 2:
        body = grouped(digits) if len(digits) > 4 else digits
    elif re.search(r"[A-F]", digits):
        body = f"\\mathrm{{{digits}}}"
    else:
        body = digits
    return body + (f"_{{{base}}}" if base > 9 else f"_{base}")


def to_base(n, base, width=0):
    spec = {2: "b", 8: "o", 16: "X"}.get(base)
    if spec:
        s = format(n, spec)
    else:
        s = ""
        m = n
        while True:
            s = "0123456789"[m % base] + s
            m //= base
            if m == 0:
                break
    return s.rjust(width, "0")


def prose_and_extra(problem):
    """A problem as (prose, other lines). One formula: ("", [formula])."""
    body = problem.strip()
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", body, re.S)
    lines = split_top(m.group(1)) if m else [body]
    prose, extra = [], []
    for line in lines:
        t = re.fullmatch(r"\\text\{(.*)\}", line.strip(), re.S)
        if t and not extra:
            prose.append(t.group(1))
        else:
            extra.append(line.strip())
    return " ".join(prose), extra


def split_top(s):
    """Splits at ` \\\\ ` outside nested environments."""
    parts, depth, cur = [], 0, ""
    tokens = re.split(r"(\\begin\{[a-z]+\}|\\end\{[a-z]+\}| \\\\ )", s)
    for tok in tokens:
        if tok.startswith("\\begin{"):
            depth += 1
        elif tok.startswith("\\end{"):
            depth -= 1
        if tok == " \\\\ " and depth == 0:
            parts.append(cur)
            cur = ""
        else:
            cur += tok
    parts.append(cur)
    return parts


def array_rows(tex):
    """The cells of the first \\begin{array}{...} ... \\end{array} in tex, row by row, without \\hline."""
    m = re.search(r"\\begin\{array\}\{[^}]*\} (.*?) \\end\{array\}", tex, re.S)
    if not m:
        return None
    rows = []
    for row in m.group(1).split("\\\\"):
        row = row.replace("\\hline", "").strip()
        rows.append([c.strip() for c in row.split("&")])
    return rows


def table_index(steps, k=0):
    """Index of the k-th step that is a table (an array on its own), or None."""
    found = [i for i, s in enumerate(steps) if s.startswith("\\begin{array}") and s.endswith("\\end{array}")]
    return found[k] if k < len(found) else None


def common(sample, errs):
    """Steps and solution are there, no banned writing anywhere."""
    if not sample.get("steps") or not sample.get("solution") or not sample.get("prompt"):
        errs.append("no steps, solution or prompt")
    blob = " ".join([sample.get("prompt", ""), sample.get("problem", ""), sample.get("solution", ""), *sample.get("steps", [])])
    if BANNED.search(blob):
        errs.append("banned writing in the text")
    if "undefined" in blob or "NaN" in blob:
        errs.append("undefined or NaN in the text")


def check_choice(choice, is_right, errs, name="choice"):
    """Four options, distinct in values and in text, exactly one right, and `correct` points to it."""
    if choice is None:
        errs.append(f"{name} missing")
        return
    opts = choice.get("options", [])
    if choice.get("kind") != "choice" or len(opts) != 4:
        errs.append(f"{name}: need 4 options, got {len(opts)}")
        return
    if len({"|".join(o["values"]) for o in opts}) != 4 or len({o["latex"] for o in opts}) != 4:
        errs.append(f"{name}: options not distinct")
    try:
        right = [i for i, o in enumerate(opts) if is_right(o)]
    except Exception as e:  # noqa: BLE001 - an unreadable option is an error of the sample
        errs.append(f"{name}: unreadable option ({e})")
        return
    if len(right) != 1:
        errs.append(f"{name}: {len(right)} right options")
    elif choice.get("correct") != right[0]:
        errs.append(f"{name}: correct is {choice.get('correct')}, the right option is {right[0]}")


def number_option_is(value):
    """An option that is the natural number `value`, written plainly."""
    def test(o):
        if not re.fullmatch(r"\d+", o["latex"]) or o["values"] != [o["latex"]]:
            raise ValueError(f"option {o['latex']!r} is not a plain number")
        return int(o["latex"]) == value
    return test


def base_option_is(value, base, canonical=True):
    """An option that is `value` written in `base`; its values must be its digits."""
    def test(o):
        digits, b = parse_num(o["latex"])
        if b != base or o["values"] != [digits]:
            raise ValueError(f"option {o['latex']!r}: base or values do not match")
        if num_tex(digits, base) != o["latex"]:
            raise ValueError(f"option {o['latex']!r} is not written in the canonical way")
        if int(digits, base) == value and canonical and digits != to_base(value, base):
            raise ValueError(f"option {o['latex']!r} has leading zeros")
        return int(digits, base) == value
    return test


def distinct_values(choice, base, errs):
    """No two options are the same number (strings that differ by leading zeros)."""
    try:
        vals = [int(parse_num(o["latex"])[0], base) for o in choice["options"]]
    except Exception as e:  # noqa: BLE001
        errs.append(f"unreadable option ({e})")
        return
    if len(set(vals)) != len(vals):
        errs.append("two options are the same number")


def check_number_answer(sample, value, errs):
    ans = sample["answer"]
    if ans.get("kind") != "number" or ans.get("value") != str(value):
        errs.append(f"answer {ans.get('value')} != {value}")
    check_choice(sample.get("choice"), number_option_is(value), errs)


def division_rows(step, base, errs):
    """Reads a table of successive divisions and checks every row and the chain; returns the remainders."""
    rows = array_rows(step)
    if not rows or rows[0] != ["\\mathrm{divisione}", "\\mathrm{quoziente}", "\\mathrm{resto}"]:
        errs.append("division table not found")
        return None
    rems, prev_q = [], None
    for cells in rows[1:]:
        m = re.fullmatch(r"(\d+) : (\d+)", cells[0])
        r = re.fullmatch(r"(\d+)(?: = \\mathrm\{([A-F])\})?", cells[2])
        if not m or not r or len(cells) != 3 or not cells[1].isdigit():
            errs.append(f"division row unreadable: {cells}")
            return None
        n, d, q, rem = int(m.group(1)), int(m.group(2)), int(cells[1]), int(r.group(1))
        if d != base or n != q * base + rem or not 0 <= rem < base:
            errs.append(f"wrong division {cells}")
        if prev_q is not None and n != prev_q:
            errs.append("division chain broken")
        if (rem > 9) != bool(r.group(2)) or (r.group(2) and int(r.group(2), 16) != rem):
            errs.append(f"remainder letter wrong in {cells}")
        prev_q = q
        rems.append(rem)
    if prev_q != 0:
        errs.append("divisions do not end with quotient 0")
    return rems
