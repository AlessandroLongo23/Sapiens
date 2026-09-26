"""Checker for numeri-interi-valore-assoluto, from specs/exercises/numeri-interi-valore-assoluto.md.

Everything is read back from what the student sees: the numbers and expressions from the problem
LaTeX, the statements, pairs, orders and sets from the option LaTeX. Expressions such as -(-8),
-|-12|, |+4| are evaluated by a small parser written here; truth is decided with plain integers.
"""
import re

LIST_SEP = r",\quad "


# ---------------------------------------------------------------------------
# Integer expressions: signs in front, then a number, a bracket (...) or |...|


def eval_expr(s):
    s = s.replace(" ", "")
    pos = 0

    def signed():
        nonlocal pos
        sign = 1
        while pos < len(s) and s[pos] in "+-":
            if s[pos] == "-":
                sign = -sign
            pos += 1
        return sign * atom()

    def atom():
        nonlocal pos
        if pos < len(s) and s[pos] == "(":
            pos += 1
            v = signed()
            if pos >= len(s) or s[pos] != ")":
                raise ValueError(f"missing ) in {s!r}")
            pos += 1
            return v
        if pos < len(s) and s[pos] == "|":
            pos += 1
            v = signed()
            if pos >= len(s) or s[pos] != "|":
                raise ValueError(f"missing | in {s!r}")
            pos += 1
            return abs(v)
        m = re.match(r"\d+", s[pos:])
        if not m:
            raise ValueError(f"not an integer expression: {s!r}")
        pos += len(m.group(0))
        return int(m.group(0))

    v = signed()
    if pos != len(s):
        raise ValueError(f"trailing text in {s!r}")
    return v


def as_int(s):
    s = s.strip()
    if not re.fullmatch(r"[+-]?\d+", s):
        raise ValueError(f"not an integer: {s!r}")
    return int(s)


# ---------------------------------------------------------------------------

# An option on two lines, for the phone: \begin{gathered} line \\ line \end{gathered}.
GATHERED = re.compile(r"\\begin\{gathered\}(.*)\\end\{gathered\}", re.S)


def option_lines(latex):
    m = GATHERED.fullmatch(latex)
    return m.group(1).split(r" \\ ") if m else [latex]


def one_line(latex, sym):
    """A chain or a set written on two lines back to one line; the second line starts with the
    symbol of the chain (with the next number after a comma)."""
    lines = option_lines(latex)
    if len(lines) == 1:
        return latex
    if len(lines) != 2:
        raise ValueError(f"{len(lines)} lines in {latex!r}")
    head, tail = lines
    if sym == ",":
        if not head.endswith(",") or tail.startswith((",", " ")):
            raise ValueError(f"bad line break in {latex!r}")
    elif not tail.startswith(f"{sym} "):
        raise ValueError(f"bad line break in {latex!r}")
    return f"{head} {tail}"


# The sign on the first line, the sets on the second.
STATEMENT_LINES = (
    re.compile(r"\\text\{(è positivo|è negativo|non è né positivo né negativo)\}"),
    re.compile(r"\\text\{e appartiene a \}\\mathbb\{([NZ])\}\\text\{ (e a|ma non a) \}\\mathbb\{([NZ])\}"),
)


def statement_true(latex, n):
    lines = option_lines(latex)
    parts = [r.fullmatch(ln) for r, ln in zip(STATEMENT_LINES, lines)] if len(lines) == 2 else []
    if len(parts) != 2 or not all(parts):
        raise ValueError(f"unknown statement {latex!r}")
    m = parts[0].groups() + parts[1].groups()
    if not m:
        raise ValueError(f"unknown statement {latex!r}")
    sign, first, link, second = m
    sign_ok = {"è positivo": n > 0, "è negativo": n < 0, "non è né positivo né negativo": n == 0}[sign]
    member = {"N": n >= 0, "Z": True}
    if first == second:
        return False
    member_ok = member[first] and (member[second] if link == "e a" else not member[second])
    return sign_ok and member_ok


def chain_ok(items, sym):
    return all((a < b) if sym == "<" else (a > b) for a, b in zip(items, items[1:]))


def pair_case(x, y):
    if 0 in (x, y):
        return "zero"
    if x < 0 and y < 0:
        return "negativi"
    if x > 0 and y > 0:
        return "positivi"
    return "discordi"


CASE_RANGES = {
    1: {"positivo": (0.30, 0.50), "negativo": (0.35, 0.55), "nullo": (0.08, 0.22)},
    3: {"negativi": (0.30, 0.50), "discordi": (0.20, 0.40), "zero": (0.08, 0.22), "positivi": (0.08, 0.22)},
    6: {"conta": (0.30, 0.50), "insieme": (0.30, 0.50), "successivo": (0.10, 0.30)},
}


def check_choice(ch, errs, count=4):
    opts = ch.get("options", [])
    if len(opts) != count:
        errs.append(f"{len(opts)} options, expected {count}")
    if len({o["latex"] for o in opts}) != len(opts) or len({"|".join(o["values"]) for o in opts}) != len(opts):
        errs.append("options not distinct")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts):
        errs.append("correct index out of range")
        return None
    return idx


def truths_must_be(truths, idx, errs, what):
    right = [i for i, ok in enumerate(truths) if ok]
    if right != [idx]:
        errs.append(f"{what}: true options {right}, correct {idx}")


def check(sample):
    errs = []
    lvl = sample["level"]
    prob = sample["problem"]
    ans = sample["answer"]
    ch = sample.get("choice")
    if ans.get("kind") == "choice" and ch is not None and ch != ans:
        errs.append("choice differs from answer")
    if not sample.get("steps"):
        errs.append("no steps")
    kind = None

    if lvl == 1:
        n = as_int(prob)
        if abs(n) > 30:
            errs.append("number out of range")
        if prob.startswith("+") and n <= 0:
            errs.append("+ in front of a non-positive number")
        idx = check_choice(ans, errs)
        if idx is not None:
            truths_must_be([statement_true(o["latex"], n) for o in ans["options"]], idx, errs, "level 1")
        kind = "positivo" if n > 0 else "negativo" if n < 0 else "nullo"

    elif lvl == 2:
        parts = prob.split(r" \qquad ")
        if len(parts) != 2:
            return [f"level 2: two expressions expected: {prob}"], None
        first, second = parts
        if "(" not in first or "|" in first:
            errs.append("level 2: first expression must be an opposite with brackets")
        if "|" not in second:
            errs.append("level 2: second expression must have an absolute value")
        bases = {re.search(r"\d+", p).group(0) for p in parts}
        if len(bases) != 1 or not 2 <= int(bases.pop()) <= 20:
            errs.append("level 2: same base from 2 to 20")
        truth = (eval_expr(first), eval_expr(second))
        idx = check_choice(ans, errs)
        if idx is not None:
            got = []
            for o in ans["options"]:
                m = re.fullmatch(r"(-?\d+)\\text\{ e \}(-?\d+)", o["latex"])
                if not m:
                    errs.append(f"option {o['latex']} not a pair")
                    got.append(False)
                    continue
                pair = (int(m.group(1)), int(m.group(2)))
                if [str(pair[0]), str(pair[1])] != o["values"]:
                    errs.append("option values differ from latex")
                got.append(pair == truth)
            truths_must_be(got, idx, errs, "level 2")

    elif lvl == 3:
        idx = check_choice(ans, errs)
        if idx is not None:
            pairs, truths = [], []
            for o in ans["options"]:
                m = re.fullmatch(r"(-?\d+) ([<>]) (-?\d+)", o["latex"])
                if not m:
                    return errs + [f"option {o['latex']} is not a comparison"], None
                x, r, y = int(m.group(1)), m.group(2), int(m.group(3))
                if x == y or max(abs(x), abs(y)) > 20:
                    errs.append(f"bad pair {x}, {y}")
                pairs.append((x, y))
                truths.append(chain_ok([x, y], r))
            truths_must_be(truths, idx, errs, "level 3")
            if len({tuple(sorted(p)) for p in pairs}) != 4:
                errs.append("same pair twice")
            false_cases = [pair_case(*p) for i, p in enumerate(pairs) if i != idx]
            if "negativi" not in false_cases:
                errs.append("no false comparison between two negatives")
            traps = [p for i, p in enumerate(pairs) if i != idx and pair_case(*p) == "discordi" and abs(min(p)) > max(p)]
            if not traps:
                errs.append("no false comparison where |negative| > positive")
            kind = pair_case(*pairs[idx])

    elif lvl == 4:
        xs = [as_int(v) for v in prob.split(LIST_SEP)]
        if not 5 <= len(xs) <= 7:
            errs.append(f"level 4: {len(xs)} numbers")
        if len({abs(v) for v in xs}) != len(xs):
            errs.append("level 4: repeated absolute values")
        if sum(v < 0 for v in xs) < 2 or sum(v > 0 for v in xs) < 2:
            errs.append("level 4: at least two negatives and two positives")
        if max(abs(v) for v in xs) > 20:
            errs.append("level 4: numbers out of range")
        if "decrescente" in sample["prompt"]:
            sym, kind = ">", "decrescente"
        elif "crescente" in sample["prompt"]:
            sym, kind = "<", "crescente"
        else:
            return errs + ["level 4: prompt must say crescente or decrescente"], None
        idx = check_choice(ans, errs)
        if idx is not None:
            truths = []
            for o in ans["options"]:
                items = [as_int(v) for v in one_line(o["latex"], sym).split(f" {sym} ")]
                if sorted(items) != sorted(xs):
                    errs.append(f"option {o['latex']} is not an order of the numbers")
                if [str(v) for v in items] != o["values"]:
                    errs.append("option values differ from latex")
                truths.append(chain_ok(items, sym))
            truths_must_be(truths, idx, errs, "level 4")

    elif lvl == 5:
        items = prob.split(LIST_SEP)
        vals = [eval_expr(e) for e in items]
        if not 4 <= len(items) <= 5:
            errs.append(f"level 5: {len(items)} expressions")
        if len({abs(v) for v in vals}) != len(vals):
            errs.append("level 5: repeated absolute values")
        if not any(re.fullmatch(r"-\|-\d+\|", e) for e in items) or not any(re.fullmatch(r"-\(-\d+\)", e) for e in items):
            errs.append("level 5: needs -|-a| and -(-a)")
        if sum(v < 0 for v in vals) < 2 or sum(v > 0 for v in vals) < 2:
            errs.append("level 5: at least two negatives and two positives")
        if "crescente" not in sample["prompt"] or "decrescente" in sample["prompt"]:
            errs.append("level 5: ascending order")
        idx = check_choice(ans, errs)
        if idx is not None:
            truths = []
            for o in ans["options"]:
                its = one_line(o["latex"], "<").split(" < ")
                if sorted(its) != sorted(items):
                    errs.append(f"option {o['latex']} is not an order of the expressions")
                ov = [eval_expr(e) for e in its]
                if [str(v) for v in ov] != o["values"]:
                    errs.append("option values differ from latex")
                truths.append(chain_ok(ov, "<"))
            truths_must_be(truths, idx, errs, "level 5")

    elif lvl == 6:
        pr = sample["prompt"]
        if pr.startswith("Quanti"):
            kind = "conta"
            m = re.fullmatch(r"(-?\d+) \\quad \\text\{e\} \\quad (-?\d+)", prob)
            if not m:
                return errs + [f"level 6: bad endpoints {prob}"], None
            a, b = int(m.group(1)), int(m.group(2))
            if not (a < 0 and 3 <= b - a <= 15 and b <= 12):
                errs.append("level 6: endpoints out of spec")
            if "inclusi" in pr:
                truth = sum(1 for k in range(a, b + 1))
            elif "esclusi" in pr:
                truth = sum(1 for k in range(a + 1, b))
            else:
                return errs + ["level 6: inclusi or esclusi?"], None
            if ans.get("kind") != "number" or as_int(ans["value"]) != truth:
                errs.append(f"level 6: count {ans.get('value')} != {truth}")
        elif pr.startswith("Qual è il"):
            kind = "successivo"
            n = as_int(prob)
            if n > -2 or n < -20:
                errs.append("level 6: number must be a negative from -20 to -2")
            truth = n + 1 if "successivo" in pr else n - 1 if "precedente" in pr else None
            if truth is None or ans.get("kind") != "number" or as_int(ans["value"]) != truth:
                errs.append(f"level 6: successor/predecessor {ans.get('value')} != {truth}")
        else:
            kind = "insieme"
            m = re.fullmatch(r"\\\{x \\in \\mathbb\{Z\} \\mid (-?\d+) (<|\\leq) x (<|\\leq) (-?\d+)\\\}", prob)
            if not m:
                return errs + [f"level 6: bad set {prob}"], None
            a, b = int(m.group(1)), int(m.group(4))
            if not (a < 0 and 3 <= b - a <= 8 and b <= 8):
                errs.append("level 6: endpoints out of spec")
            truth = [k for k in range(a - 1, b + 2) if (a <= k if m.group(2) == r"\leq" else a < k) and (k <= b if m.group(3) == r"\leq" else k < b)]
            if ans.get("kind") != "choice":
                return errs + ["level 6: set question must be a choice"], None
            idx = check_choice(ans, errs)
            if idx is not None:
                lists = []
                for o in ans["options"]:
                    mm = re.fullmatch(r"\\\{(.*)\\\}", one_line(o["latex"], ","))
                    items = [as_int(v) for v in mm.group(1).split(", ")] if mm and mm.group(1) else []
                    if [str(v) for v in items] != o["values"]:
                        errs.append("option values differ from latex")
                    lists.append(items)
                truths_must_be([li == truth for li in lists], idx, errs, "level 6 set")
        if kind != "insieme":
            if ch is None:
                errs.append("level 6: no choice variant")
            else:
                idx = check_choice(ch, errs)
                if idx is not None:
                    vals = [as_int(o["latex"]) for o in ch["options"]]
                    if any(v < 0 for v in vals) and kind == "conta":
                        errs.append("negative count among the options")
                    truths_must_be([v == truth for v in vals], idx, errs, "level 6 choice")
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
