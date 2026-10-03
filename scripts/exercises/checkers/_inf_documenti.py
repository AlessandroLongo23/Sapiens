"""Shared helpers for the checkers of the chapter "Documenti di testo e presentazioni" (word, inf-stili-indici,
powerpoint, creare-slide).

A problem is Italian prose in \\text{...} lines stacked in an array, with inline $...$ numbers. An option is a
\\text{...} label, or a gathered of such lines; the option of a count is a number, with the decimal comma, and
maybe a unit. Numbers are exact: fractions.Fraction.
"""
import re
from fractions import Fraction

BANNED = re.compile(r"—|piuttosto che")
NAMES = ["Giulia", "Marco", "Sara", "Luca", "Anna", "Matteo", "Elena", "Davide", "Chiara", "Tommaso", "Irene", "Pietro"]
NAME = "(" + "|".join(NAMES) + ")"


def prose(tex):
    """The prose of a problem or of a step: the \\text{...} lines joined with spaces. Raises on any other line."""
    tex = tex.strip()
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex, re.S)
    lines = m.group(1).split(" \\\\ ") if m else [tex]
    out = []
    for line in lines:
        mm = re.fullmatch(r"\\text\{(.*)\}", line.strip())
        if not mm:
            raise ValueError(f"not a prose line: {line!r}")
        out.append(mm.group(1))
    return " ".join(out)


def option_text(latex):
    """The plain text of an option: \\text{...} or a gathered of \\text{...} lines, joined with a space."""
    s = latex.strip()
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", s)
    if m:
        return " ".join(option_text(p) for p in m.group(1).split(" \\\\ "))
    m = re.fullmatch(r"\\text\{([^{}]*)\}", s)
    if not m:
        raise ValueError(f"option not plain text: {latex!r}")
    return m.group(1)


def parse_num(s):
    """16{,}5 -> 33/2; 17 -> 17."""
    m = re.fullmatch(r"(\d+)(?:\{,\}(\d+))?", s.strip())
    if not m:
        raise ValueError(f"not a number: {s!r}")
    frac = m.group(2) or ""
    return Fraction(int(m.group(1) + frac), 10 ** len(frac))


def num_tex(v):
    """The canonical writing of a short decimal: 33/2 -> 16{,}5."""
    v = Fraction(v)
    for k in range(4):
        scaled = v * 10**k
        if scaled.denominator == 1:
            s = str(scaled.numerator).rjust(k + 1, "0")
            return s[: len(s) - k] + ("{,}" + s[len(s) - k :] if k else "")
    raise ValueError(f"{v} is not a short decimal")


def value_str(v):
    v = Fraction(v)
    return str(v.numerator) if v.denominator == 1 else f"{v.numerator}/{v.denominator}"


def common(sample, errs):
    """Steps, forbidden words, and the prose of the problem (None if it cannot be read)."""
    if not sample.get("steps"):
        errs.append("no steps")
    try:
        text = prose(sample["problem"])
        steps = [prose(s) for s in sample.get("steps", [])]
    except ValueError as e:
        errs.append(str(e))
        return None
    if BANNED.search(text + " ".join(steps)):
        errs.append("forbidden words")
    if not sample.get("solution"):
        errs.append("no solution")
    return text


def check_choice(ch, is_right, errs, n=4):
    """n options with different values and writings, exactly one right, and `correct` pointing to it."""
    opts = ch.get("options", []) if isinstance(ch, dict) else []
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


def check_labels(sample, labels, right, errs):
    """A choice among fixed labels: every option is one of `labels` (text -> key), with that key as its value, and
    the right one is the label whose key is `right`."""
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    for o in ans.get("options", []):
        try:
            text = option_text(o["latex"])
        except ValueError as e:
            errs.append(str(e))
            return
        if text not in labels:
            errs.append(f"unexpected option {text!r}")
            return
        if o["values"] != [labels[text]]:
            errs.append(f"option {text!r} has values {o['values']}")
    check_choice(ans, lambda o: labels[option_text(o["latex"])] == right, errs)
    if sample.get("solution") != ans["options"][ans.get("correct", 0)]["latex"]:
        errs.append("solution is not the right option")


def check_number(sample, truth, errs, unit=""):
    """A count: the exact answer, the solution written with its unit, and a choice of four numbers with one right."""
    truth = Fraction(truth)
    ans = sample["answer"]
    if ans.get("kind") != "number":
        errs.append("answer is not a number")
        return
    if ans.get("value") != value_str(truth):
        errs.append(f"answer {ans.get('value')} but it should be {value_str(truth)}")
    tail = f"\\,\\text{{{unit}}}" if unit else ""
    if sample.get("solution") != num_tex(truth) + tail:
        errs.append(f"solution {sample.get('solution')!r} is not {num_tex(truth) + tail!r}")
    ch = sample.get("choice")
    if not ch:
        errs.append("no multiple choice")
        return

    def value(o):
        s = o["latex"]
        if tail:
            if not s.endswith(tail):
                raise ValueError("unit missing")
            s = s[: -len(tail)]
        v = parse_num(s)
        if num_tex(v) != s or o["values"] != [value_str(v)]:
            raise ValueError("number not canonical, or values do not match")
        return v

    check_choice(ch, lambda o: value(o) == truth, errs)


def classify(text, rules, errs):
    """The key of the only rule with a keyword in `text`: rules = {key: [keywords]}."""
    hits = [k for k, words in rules.items() if any(w in text for w in words)]
    if len(hits) != 1:
        errs.append(f"{len(hits)} categories match {text!r}: {hits}")
        return None
    return hits[0]
