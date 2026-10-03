"""Shared helpers for the checkers of the computer science chapter "L'architettura del computer"
(inf_von_neumann, inf_cpu, memoria_storage, inf_bus_periferiche, inf_tipi_computer).

Problems are prose lines \\text{...} stacked in an array, with inline $...$ numbers, sometimes followed by a table
(an array of its own). Whole numbers are written 4096, 65\\,536 (thin spaces from five digits). Answers are a
choice of four texts, or a whole number whose choice variant (`sample["choice"]`) has four numbers.
"""
import re

BANNED = re.compile(r"—|piuttosto che")

NUM = r"(?:\d{1,3}(?:\\,\d{3})+|\d+)"


def parse_int(s):
    s = s.strip()
    if not re.fullmatch(NUM, s):
        raise ValueError(f"not a whole number: {s!r}")
    return int(s.replace("\\,", ""))


def fmt_int(n):
    s = str(n)
    if len(s) < 5:
        return s
    out = ""
    while len(s) > 3:
        out = "\\," + s[-3:] + out
        s = s[:-3]
    return s + out


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
        body = _whole_text(line)
        if body is not None:
            prose.append(body)
        else:
            extra.append(line)
    return " ".join(prose), extra


def _whole_text(line):
    """The body of a line that is one \\text{...} group (which may hold $...\\text{kHz}...$), else None."""
    if not line.startswith("\\text{"):
        return None
    depth = 0
    for i in range(5, len(line)):
        if line[i] == "{":
            depth += 1
        elif line[i] == "}":
            depth -= 1
            if depth == 0:
                return line[6:i] if i == len(line) - 1 else None
    return None


def option_text(latex):
    """The plain text of an option: \\text{...} or a gathered of \\text{...} lines joined with a space."""
    s = latex.strip()
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", s)
    if m:
        return " ".join(option_text(p.strip()) for p in m.group(1).split(" \\\\ "))
    m = re.fullmatch(r"\\text\{([^{}]*)\}", s)
    if not m:
        raise ValueError(f"option not plain text: {latex!r}")
    return m.group(1)


def check_choice(ch, is_right, errs, n=4):
    """Four options with different values and texts, exactly one right, and `correct` pointing to it."""
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


def check_text_choice(sample, right, allowed, errs):
    """A choice of texts: every option is one of `allowed`, its value is its text, and exactly one is `right`."""
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    for o in ans.get("options", []):
        try:
            text = option_text(o["latex"])
        except ValueError as e:
            errs.append(str(e))
            continue
        if allowed is not None and text not in allowed:
            errs.append(f"unexpected option {text!r}")
        if o["values"] != [text]:
            errs.append(f"option value {o['values']} differs from its text {text!r}")
    check_choice(ans, lambda o: option_text(o["latex"]) == right, errs)
    if sample.get("choice") is not None and sample["choice"] != ans:
        errs.append("the choice variant differs from the answer")


def check_number(sample, truth, errs, mistakes=None):
    """A whole-number answer equal to `truth`, and its choice variant: four different numbers, each written as its
    value, one of them the truth. With `mistakes`, at least one wrong option must be one of those values."""
    ans = sample["answer"]
    if ans.get("kind") != "number" or ans.get("value") != str(truth):
        errs.append(f"answer {ans.get('value')!r} != {truth}")
    ch = sample.get("choice")
    if ch is None:
        errs.append("no choice variant")
        return

    def value(o):
        v = parse_int(o["latex"])
        if o["values"] != [str(v)]:
            raise ValueError(f"option {o['latex']!r} with values {o['values']}")
        return v

    check_choice(ch, lambda o: value(o) == truth, errs)
    d = sample["params"].get("distractors")
    try:
        shown = sorted(value(o) for o in ch.get("options", []))
    except ValueError as e:
        errs.append(str(e))
        return
    if not isinstance(d, list) or sorted([truth] + [int(x) for x in d]) != shown:
        errs.append(f"options {shown} are not the answer and params.distractors {d}")
    if mistakes is not None:
        wrong = {x for x in shown if x != truth}
        good = {m for m in mistakes if m != truth and m >= 0}
        if good and not (wrong & good):
            errs.append(f"no distractor among the mistakes of the spec {sorted(good)}: {sorted(wrong)}")


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    text = sample.get("prompt", "") + sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")
    if sample.get("answer", {}).get("kind") not in ("choice", "number"):
        errs.append("answer is neither a choice nor a number")


def prep(p, noun):
    stem = {"di": "de", "a": "a", "da": "da", "in": "ne", "su": "su"}[p]
    for art, end in [("l'", "ll'"), ("lo ", "llo "), ("la ", "lla "), ("il ", "l "), ("le ", "lle "), ("gli ", "gli "), ("i ", "i ")]:
        if noun.startswith(art):
            return stem + end + noun[len(art):]
    return f"{p} {noun}"
