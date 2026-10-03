"""Shared helpers for the checkers of the computer science chapter "Il sistema operativo" (inf-funzioni-so,
inf-avvio-interfacce, processi-thread, inf-gestione-memoria, inf-file-system).

Problems are prose lines \\text{...} stacked in an array, with inline $...$ formulas, sometimes followed by a table or
a path on a line of its own. Options are plain text (\\text{...}, or a gathered of such lines), a path in
\\texttt{...}, or a number with its unit.
"""
import re
from fractions import Fraction

BANNED = re.compile(r"—|piuttosto che")
NAMES = ["Giulia", "Marco", "Sara", "Luca", "Anna", "Matteo", "Elena", "Davide", "Chiara", "Tommaso", "Irene", "Pietro"]


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
    """The prose of the \\text{...} lines joined with spaces, and the other lines (a table, a path)."""
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
        return " ".join(option_text(p.strip()) for p in m.group(1).split(" \\\\ "))
    m = re.fullmatch(r"\\text\{(.*)\}", s)
    if not m:
        raise ValueError(f"option not plain text: {latex!r}")
    return m.group(1)


def untt(latex):
    """\\texttt{C:\\textbackslash{}utenti} -> C:\\utenti."""
    m = re.fullmatch(r"\\texttt\{(.*)\}", latex.strip())
    if not m:
        raise ValueError(f"not a typewriter text: {latex!r}")
    return m.group(1).replace("\\textbackslash{}", "\\")


def num_tex(v):
    """The canonical writing of a terminating decimal: 12, 7{,}5, 10\\,000."""
    v = Fraction(v)
    k = 0
    while (v * 10**k).denominator != 1:
        k += 1
        if k > 6:
            raise ValueError(f"{v} is not a terminating decimal")
    s = str(int(v * 10**k)).rjust(k + 1, "0")
    whole, frac = s[: len(s) - k], s[len(s) - k :]
    if len(whole) >= 5:
        whole = f"{int(whole):,}".replace(",", "\\,")
    return f"{whole}{{,}}{frac}" if frac else whole


def parse_num(s):
    """12, 7{,}5, 10\\,000 -> Fraction; anything else raises."""
    s = s.strip()
    m = re.fullmatch(r"((?:\d{1,3}(?:\\,\d{3})+|\d+))(?:\{,\}(\d+))?", s)
    if not m:
        raise ValueError(f"not a number: {s!r}")
    v = Fraction(int(m.group(1).replace("\\,", "") + (m.group(2) or "")), 10 ** len(m.group(2) or ""))
    if num_tex(v) != s:
        raise ValueError(f"number {s!r} not canonical")
    return v


def measure(s, unit):
    """'$12\\,\\text{ms}$' or '12\\,\\text{ms}' with the expected unit -> Fraction."""
    s = s.strip().strip("$")
    if unit:
        tail = "\\,\\text{" + unit + "}"
        if not s.endswith(tail):
            raise ValueError(f"{s!r} is not in {unit}")
        s = s[: -len(tail)]
    return parse_num(s)


def check_choice(ch, is_right, errs, n=4):
    """n options with different values, exactly one right, and `correct` pointing to it. `is_right(option)`."""
    opts = (ch or {}).get("options", [])
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


def check_number(sample, truth, unit, errs):
    """A number answer equal to `truth`, and its multiple choice: four values written with the unit, one right."""
    ans = sample["answer"]
    if ans.get("kind") != "number":
        errs.append("answer is not a number")
        return
    if not re.fullmatch(r"\d+(/\d+)?", ans["value"]) or Fraction(ans["value"]) != truth:
        errs.append(f"answer {ans['value']} but the result is {truth}")

    def right(o):
        v = measure(o["latex"], unit)
        if Fraction(o["values"][0]) != v:
            raise ValueError("option value does not match its text")
        if v <= 0:
            raise ValueError("option not positive")
        return v == truth

    check_choice(sample.get("choice"), right, errs)


def check_statements(sample, prose, about, table, errs):
    """"Quale di queste affermazioni <about> è vera/falsa?": `table` gives, for the id in the option's values,
    whether the statement is true and words its text must contain. One option of the asked kind, three of the other."""
    m = re.fullmatch(r"Quale di queste affermazioni " + re.escape(about) + r" è (vera|falsa)\?", prose)
    if not m:
        errs.append(f"statement question not recognised: {prose!r}")
        return None
    want = m.group(1) == "vera"

    def truth(o):
        sid = o["values"][0]
        if sid not in table:
            raise ValueError(f"unknown statement {sid!r}")
        value, words = table[sid]
        if words not in option_text(o["latex"]):
            raise ValueError(f"statement {sid} does not say {words!r}")
        return value

    check_choice(sample["answer"], lambda o: truth(o) == want, errs)
    return m.group(1)


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("prompt"):
        errs.append("no prompt")
    text = sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")
    if sample.get("answer", {}).get("kind") not in ("choice", "number"):
        errs.append("answer is neither a choice nor a number")
