"""Shared helpers of the checkers of the chapter "Successioni e progressioni".

Reading the LaTeX the generators write (numbers, expressions in n or k, the lines of a problem, the givens
of a row) and the checks every sample shares: steps and solution present, no banned words, four distinct
options whose text says the same as their values, exactly one of them right and marked.
"""
import re

from sympy import Rational, Symbol, sympify

n = Symbol("n", integer=True, positive=True)
k = Symbol("k", integer=True, positive=True)
NAMES = {"n": n, "k": k}

FORBIDDEN = [
    ("1n", re.compile(r"(?<![\d.])1\s*n(?![a-z_])")),
    ("+ -", re.compile(r"\+\s*-")),
    ("- -", re.compile(r"-\s*-")),
    ("+ +", re.compile(r"\+\s*\+")),
    ("^1", re.compile(r"\^\{1\}|\^1(?![\d}])")),
    ("zero term", re.compile(r"[+-]\s*0(?![\d{,])")),
]


def num(t):
    """An exact rational as written: -3, \\frac{3}{2}, -\\frac{5}{4}."""
    t = t.strip()
    m = re.fullmatch(r"(-?)\\d?frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable number {t!r}")


def tex_expr(t, extra=None):
    """An expression in n or k as the generators write it: 3n - 2, \\frac{2n - 1}{n + 3}, (-1)^{n+1} \\cdot (2n + 1),
    2 \\cdot 3^{k+1}, \\frac{k(k + 1)(2k + 1)}{6}. `extra` adds symbols written as single capital letters."""
    names = dict(NAMES)
    names.update(extra or {})
    s = t.strip().replace(r"\left(", "(").replace(r"\right)", ")").replace(r"\cdot", "*").replace(r"\,", " ")
    s = re.sub(r"\^\{([^{}]*)\}", r"**(\1)", s)
    s = re.sub(r"\^([0-9a-z])", r"**\1", s)
    for _ in range(4):
        s = re.sub(r"\\d?frac\{([^{}]*)\}\{([^{}]*)\}", r"((\1)/(\2))", s)
    s = re.sub(r"(\d)\s*([a-zA-Z(])", r"\1*\2", s)
    s = re.sub(r"\)\s*([a-zA-Z0-9(])", r")*\1", s)
    s = re.sub(r"([a-zA-Z])\s*\(", r"\1*(", s)
    letters = "".join(names)
    if not s.strip() or not re.fullmatch(rf"[0-9{letters}+\-*/() ]+", s):
        raise ValueError(f"unreadable expression {t!r}")
    return sympify(s, locals=names)


def split_top(body, sep):
    """Splits at `sep` outside braces and nested environments."""
    parts, depth, start, i = [], 0, 0, 0
    while i < len(body):
        m = re.match(r"\\(begin|end)\{[a-z*]+\}", body[i:])
        if m:
            depth += 1 if m.group(1) == "begin" else -1
            i += len(m.group(0))
            continue
        if body[i] == "{":
            depth += 1
        elif body[i] == "}":
            depth -= 1
        elif depth == 0 and body.startswith(sep, i):
            parts.append(body[start:i])
            i += len(sep)
            start = i
            continue
        i += 1
    parts.append(body[start:])
    return [p.strip() for p in parts if p.strip()]


def lines(problem):
    """The lines of a problem written as \\begin{array}{l} ... \\\\ ... \\end{array}, or the problem itself."""
    m = re.fullmatch(r"\\begin\{array\}\{l\}(.*)\\end\{array\}", problem.strip(), re.S)
    return split_top(m.group(1), r"\\") if m else [problem.strip()]


def givens(line):
    """A row of givens "a_1 = 5 \\qquad d = 3" as {name: tex of the value}."""
    out = {}
    for item in split_top(line, r"\qquad"):
        m = re.fullmatch(r"([A-Za-z](?:_\{?\w+\}?)?) = (.+)", item)
        if not m:
            raise ValueError(f"unreadable given {item!r}")
        out[m.group(1)] = m.group(2).strip()
    return out


def text_of(line):
    """The words of a prose line made only of \\text{...} groups (braces balanced, $...$ kept), joined."""
    out, i, line = [], 0, line.strip()
    while i < len(line):
        if line[i].isspace():
            i += 1
            continue
        if not line.startswith(r"\text{", i):
            raise ValueError(f"not a prose line: {line!r}")
        depth, j = 1, i + 6
        while j < len(line) and depth:
            depth += {"{": 1, "}": -1}.get(line[j], 0)
            j += 1
        out.append(line[i + 6 : j - 1])
        i = j
    return " ".join(out)


def basic(sample):
    errs = []
    if not sample.get("steps") or not sample.get("solution") or not sample.get("prompt"):
        errs.append("steps, solution or prompt missing")
    text = " ".join([sample.get("prompt", ""), sample["problem"], sample.get("solution", ""), *sample.get("steps", [])])
    if "—" in text or "piuttosto che" in text:
        errs.append("forbidden words")
    errs += [f"forbidden '{name}' in the problem" for name, rx in FORBIDDEN if rx.search(sample["problem"])]
    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice")
    elif sample["answer"].get("kind") == "choice" and ch != sample["answer"]:
        errs.append("choice differs from the choice answer")
    return errs


def options_check(ch, read, truth, errs):
    """read(option) -> (what the text says, what the values say). Four options, all different, the two readings
    equal, exactly one equal to the truth and marked."""
    opts = ch.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    keys = []
    for o in opts:
        try:
            shown, valued = read(o)
        except Exception as e:  # noqa: BLE001 - any parse failure is an error of the option
            errs.append(f"option unreadable: {e}")
            return
        if shown != valued:
            errs.append(f"option {o['latex']!r} says {shown}, values say {valued}")
        keys.append(shown)
    if len(set(keys)) != len(keys):
        errs.append(f"options not distinct: {[o['latex'] for o in opts]}")
    right = [i for i, key in enumerate(keys) if key == truth]
    if len(right) != 1:
        errs.append(f"{len(right)} options equal the truth {truth}")
    elif ch.get("correct") != right[0]:
        errs.append(f"choice.correct is {ch.get('correct')}, the right option is {right[0]}")


def number_check(sample, truth, errs):
    """A numeric answer: answer.value and exactly one option equal the truth."""
    truth = Rational(truth)
    ans = sample["answer"]
    if ans.get("kind") != "number":
        errs.append(f"answer.kind is {ans.get('kind')}, expected number")
    elif not re.fullmatch(r"-?\d+(/\d+)?", str(ans.get("value"))) or Rational(ans["value"]) != truth:
        errs.append(f"answer {ans.get('value')} != {truth}")
    ch = sample.get("choice")
    if ch:
        options_check(ch, lambda o: (num(o["latex"]), Rational(o["values"][0])), truth, errs)


def label_check(sample, table, truth, errs):
    """A choice among fixed labels: `table` maps each label to the LaTeX the spec gives it."""
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append(f"answer.kind is {ans.get('kind')}, expected choice")
        return
    back = {v: key for key, v in table.items()}

    def read(o):
        if o["latex"] not in back:
            raise ValueError(f"unknown label {o['latex']!r}")
        return back[o["latex"]], o["values"][0]

    options_check(ans, read, truth, errs)
    if sample.get("solution") != table.get(truth):
        errs.append("solution is not the right label")
