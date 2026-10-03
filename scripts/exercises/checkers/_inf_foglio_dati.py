"""Shared helpers for the checkers of the second half of the spreadsheet chapter (computer science, first year):
inf_funzioni_logiche, inf_grafici_dati, inf_analisi_dati.

Written from the specs. A problem is a stack of lines: prose in \\text{...} (with inline $...$), a sheet as an array
whose first row holds the column letters and whose first column holds the row numbers, formulas in
\\small\\texttt{...}. Here are the reader of that layout, the reader of the options, and a small evaluator of
spreadsheet formulas in the Italian syntax (SE, E, O, NON, SOMMA, MEDIA, MIN, MAX, CONTA.NUMERI, CONTA.SE, SOMMA.SE;
`;` between arguments).
"""
import re
from fractions import Fraction

BANNED = re.compile(r"—|piuttosto che")

# ---------------------------------------------------------------------------
# Layout


def top_lines(tex):
    """The lines of the outer array{l}; a problem of one line is that line."""
    tex = tex.strip()
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex, re.S)
    if not m:
        return [tex]
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


def untt(s):
    """The characters inside \\texttt{...}, with the TeX escapes undone."""
    s = s.replace("\\textbackslash{}", "\\")
    return re.sub(r"\\([{}$%&#_])", r"\1", s)


TT = r"\\texttt\{((?:[^{}\\]|\\.)*)\}"


def plain(prose):
    """Prose with the inline typewriter pieces and the inline numbers as plain characters: $\\texttt{B2}$ -> B2,
    $12$ -> 12."""
    prose = re.sub(r"\$" + TT + r"\$", lambda m: untt(m.group(1)), prose)
    return re.sub(r"\$(-?\d+)\$", r"\1", prose)


class Sheet:
    """header: the names of row 1; rows: the data rows from row 2; cells: 'B3' -> value (int or str)."""

    def __init__(self, header, rows):
        self.header = header
        self.rows = rows
        self.cells = {}
        for i, r in enumerate([header] + rows):
            for j, c in enumerate(r):
                self.cells["ABCDE"[j] + str(i + 1)] = c


def parse_cell(c):
    c = c.strip()
    m = re.fullmatch(r"\\text\{(.*)\}", c)
    if m:
        return m.group(1)
    if re.fullmatch(r"-?\d+", c):
        return int(c)
    raise ValueError(f"cell {c!r}")


def parse_sheet(line):
    m = re.fullmatch(r"\\begin\{array\}\{c((?:\|[lc])+)\} (.+?) \\\\ \\hline (.+) \\end\{array\}", line)
    if not m:
        raise ValueError("sheet not recognised")
    ncols = len(m.group(1)) // 2
    letters = [x.strip() for x in m.group(2).split("&")]
    if letters[0] != "" or letters[1:] != [f"\\text{{{c}}}" for c in "ABCDE"[:ncols]]:
        raise ValueError(f"column letters {letters}")
    table = []
    for k, r in enumerate(m.group(3).split(" \\\\ ")):
        cs = [x.strip() for x in r.split("&")]
        if cs[0] != str(k + 1):
            raise ValueError(f"row {k + 1} is numbered {cs[0]}")
        if len(cs) != ncols + 1:
            raise ValueError(f"row {k + 1} has {len(cs) - 1} cells")
        table.append([parse_cell(c) for c in cs[1:]])
    if any(not isinstance(c, str) for c in table[0]):
        raise ValueError("the first row is not a header of names")
    return Sheet(table[0], table[1:])


def parse_problem(tex):
    """The items of a problem in order: ('text', prose), ('sheet', Sheet), ('formula', text). Consecutive prose
    lines are one paragraph; consecutive formula lines are one formula written on more lines."""
    items = []
    for line in top_lines(tex):
        m = re.fullmatch(r"\\text\{(.*)\}", line)
        if m:
            if items and items[-1][0] == "text":
                items[-1] = ("text", items[-1][1] + " " + m.group(1))
            else:
                items.append(("text", m.group(1)))
            continue
        m = re.fullmatch(r"\\small" + TT, line)
        if m:
            if len(untt(m.group(1))) > 33:
                raise ValueError(f"formula line longer than 33 characters: {untt(m.group(1))}")
            if items and items[-1][0] == "formula":
                items[-1] = ("formula", items[-1][1] + untt(m.group(1)))
            else:
                items.append(("formula", untt(m.group(1))))
            continue
        items.append(("sheet", parse_sheet(line)))
    return items


def shape(items):
    return [k for k, _ in items]


# ---------------------------------------------------------------------------
# Options


def option_value(o):
    """('text', label), ('num', int) or ('formula', text) for an option; its `values` must say the same."""
    s = o["latex"].strip()
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\end\{gathered\}", s)
    if m:
        parts = []
        for p in m.group(1).split(" \\\\ "):
            mm = re.fullmatch(r"\\text\{(.*)\}", p.strip())
            if not mm:
                raise ValueError(f"option line not text: {p!r}")
            parts.append(mm.group(1))
        return ("text", " ".join(parts))
    m = re.fullmatch(r"\\text\{(.*)\}", s)
    if m:
        return ("text", m.group(1))
    m = re.fullmatch(r"\\small" + TT, s)
    if m:
        f = untt(m.group(1))
        if len(f) > 27:
            raise ValueError(f"formula option longer than 27 characters: {f}")
        if o["values"] != [f]:
            raise ValueError("formula option: values do not match the text")
        return ("formula", f)
    if re.fullmatch(r"-?\d+", s):
        if o["values"] != [s]:
            raise ValueError("number option: values do not match the text")
        return ("num", int(s))
    raise ValueError(f"option not recognised: {s!r}")


def check_choice(ch, is_right, errs, n=4):
    """n options with different values and different writings, exactly one right, `correct` pointing to it."""
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
        except Exception as e:  # noqa: BLE001
            errs.append(f"option {o['latex']!r} unreadable: {e}")
    if len(right) != 1:
        errs.append(f"{len(right)} right options: {[opts[i]['latex'] for i in right]}")
    elif ch.get("correct") != right[0]:
        errs.append(f"correct = {ch.get('correct')} but the right option is {right[0]}")


def check_number(sample, value, errs):
    """A number answer: its value, and the multiple choice that goes with it."""
    ans = sample.get("answer", {})
    if ans.get("kind") != "number":
        errs.append("answer is not a number")
        return
    if ans.get("value") != str(value):
        errs.append(f"answer {ans.get('value')} but the value is {value}")
    if sample.get("solution") != str(value):
        errs.append(f"solution {sample.get('solution')!r} is not {value}")
    check_choice(sample.get("choice"), lambda o: option_value(o) == ("num", value), errs)


def common(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    text = sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")


# ---------------------------------------------------------------------------
# Formulas

TOKEN = re.compile(r'\s*(?:(\d+(?:,\d+)?)|"([^"]*)"|([A-Z][A-Z.]*[A-Z]|[A-Z])(?=\()|([A-E][1-9]\d?)|(<>|<=|>=|[=<>+\-*/();:]))')


def tokenize(s):
    out, i = [], 0
    while i < len(s):
        m = TOKEN.match(s, i)
        if not m:
            raise ValueError(f"cannot read {s[i:]!r}")
        if m.group(1) is not None:
            out.append(("num", Fraction(m.group(1).replace(",", "."))))
        elif m.group(2) is not None:
            out.append(("str", m.group(2)))
        elif m.group(3) is not None:
            out.append(("name", m.group(3)))
        elif m.group(4) is not None:
            out.append(("ref", m.group(4)))
        else:
            out.append(("op", m.group(5)))
        i = m.end()
    return out


class Parser:
    """formula := '=' expr; expr := sum (cmp sum)?; sum := prod (('+'|'-') prod)*; prod := atom (('*'|'/') atom)*;
    atom := number | string | ref (':' ref)? | NAME '(' expr (';' expr)* ')' | '(' expr ')'."""

    def __init__(self, text):
        self.toks = tokenize(text)
        self.i = 0

    def peek(self):
        return self.toks[self.i] if self.i < len(self.toks) else (None, None)

    def take(self, kind=None, value=None):
        k, v = self.peek()
        if k is None or (kind and k != kind) or (value is not None and v != value):
            raise ValueError(f"expected {value or kind}, found {v!r}")
        self.i += 1
        return v

    def formula(self):
        self.take("op", "=")
        e = self.expr()
        if self.peek()[0] is not None:
            raise ValueError(f"text after the formula: {self.peek()[1]!r}")
        return e

    def expr(self):
        left = self.sum()
        k, v = self.peek()
        if k == "op" and v in ("=", "<>", "<", "<=", ">", ">="):
            self.i += 1
            return ("cmp", v, left, self.sum())
        return left

    def sum(self):
        left = self.prod()
        while self.peek() in (("op", "+"), ("op", "-")):
            op = self.take()
            left = ("bin", op, left, self.prod())
        return left

    def prod(self):
        left = self.atom()
        while self.peek() in (("op", "*"), ("op", "/")):
            op = self.take()
            left = ("bin", op, left, self.atom())
        return left

    def atom(self):
        k, v = self.peek()
        if k == "num" or k == "str":
            self.i += 1
            return (k, v)
        if k == "ref":
            self.i += 1
            if self.peek() == ("op", ":"):
                self.i += 1
                return ("range", v, self.take("ref"))
            return ("ref", v)
        if k == "name":
            self.i += 1
            self.take("op", "(")
            args = [self.expr()]
            while self.peek() == ("op", ";"):
                self.i += 1
                args.append(self.expr())
            self.take("op", ")")
            return ("call", v, args)
        if (k, v) == ("op", "("):
            self.i += 1
            e = self.expr()
            self.take("op", ")")
            return e
        raise ValueError(f"unexpected {v!r}")


def parse_formula(text):
    return Parser(text).formula()


def is_num(v):
    return isinstance(v, (int, Fraction)) and not isinstance(v, bool)


def compare(op, a, b):
    return {"=": a == b, "<>": a != b, "<": a < b, "<=": a <= b, ">": a > b, ">=": a >= b}[op]


def range_cells(a, b, cells):
    c1, r1, c2, r2 = a[0], int(a[1:]), b[0], int(b[1:])
    out = []
    for r in range(r1, r2 + 1):
        for c in "ABCDE"["ABCDE".index(c1): "ABCDE".index(c2) + 1]:
            if c + str(r) not in cells:
                raise ValueError(f"range reaches the empty cell {c}{r}")
            out.append(cells[c + str(r)])
    return out


def criterion(crit):
    """The test a CONTA.SE / SOMMA.SE criterion makes on a cell: a number or a text means equal to it; a text that
    starts with an operator compares with what follows."""
    if is_num(crit):
        return lambda v: is_num(v) and v == crit
    if not isinstance(crit, str):
        raise ValueError("criterion is neither a number nor a text")
    m = re.fullmatch(r"(<>|<=|>=|<|>|=)?(.*)", crit)
    op, rest = m.group(1) or "=", m.group(2)
    if re.fullmatch(r"-?\d+(?:,\d+)?", rest):
        n = Fraction(rest.replace(",", "."))
        if op == "<>":
            return lambda v: not (is_num(v) and v == n)
        return lambda v: is_num(v) and compare(op, v, n)
    if op == "=":
        return lambda v: isinstance(v, str) and v.lower() == rest.lower()
    if op == "<>":
        return lambda v: not (isinstance(v, str) and v.lower() == rest.lower())
    raise ValueError(f"criterion {crit!r} orders texts")


def evaluate(e, cells):
    """The value of a parsed formula: int/Fraction, str or bool; a range is a list."""
    k = e[0]
    if k in ("num", "str"):
        return e[1]
    if k == "ref":
        if e[1] not in cells:
            raise ValueError(f"empty cell {e[1]}")
        return cells[e[1]]
    if k == "range":
        return range_cells(e[1], e[2], cells)
    if k == "cmp":
        a, b = evaluate(e[2], cells), evaluate(e[3], cells)
        if not (is_num(a) and is_num(b)):
            raise ValueError("comparison of values that are not numbers")
        return compare(e[1], a, b)
    if k == "bin":
        a, b = evaluate(e[2], cells), evaluate(e[3], cells)
        if not (is_num(a) and is_num(b)):
            raise ValueError("arithmetic on values that are not numbers")
        return {"+": lambda: a + b, "-": lambda: a - b, "*": lambda: a * b, "/": lambda: Fraction(a) / b}[e[1]]()
    name, args = e[1], e[2]
    if name == "SE":
        if len(args) != 3:
            raise ValueError("SE needs three arguments")
        c = evaluate(args[0], cells)
        if not isinstance(c, bool):
            raise ValueError("the condition of SE is not a logical value")
        return evaluate(args[1] if c else args[2], cells)
    vals = [evaluate(a, cells) for a in args]
    if name in ("E", "O", "NON"):
        if not all(isinstance(v, bool) for v in vals):
            raise ValueError(f"{name} on values that are not logical")
        if name == "NON":
            if len(vals) != 1:
                raise ValueError("NON needs one argument")
            return not vals[0]
        return all(vals) if name == "E" else any(vals)
    if name in ("SOMMA", "MEDIA", "MIN", "MAX", "CONTA.NUMERI"):
        flat = [x for v in vals for x in (v if isinstance(v, list) else [v])]
        nums = [x for x in flat if is_num(x)]
        if name == "SOMMA":
            return sum(nums)
        if name == "CONTA.NUMERI":
            return len(nums)
        if not nums:
            raise ValueError(f"{name} of no numbers")
        return {"MEDIA": lambda: Fraction(sum(nums), len(nums)), "MIN": lambda: min(nums), "MAX": lambda: max(nums)}[name]()
    if name == "CONTA.SE":
        if len(vals) != 2 or not isinstance(vals[0], list):
            raise ValueError("CONTA.SE needs a range and a criterion")
        test = criterion(vals[1])
        return sum(1 for v in vals[0] if test(v))
    if name == "SOMMA.SE":
        if len(vals) not in (2, 3) or not isinstance(vals[0], list):
            raise ValueError("SOMMA.SE needs a range, a criterion and at most a range to sum")
        test = criterion(vals[1])
        target = vals[2] if len(vals) == 3 else vals[0]
        if not isinstance(target, list) or len(target) != len(vals[0]):
            raise ValueError("SOMMA.SE: the two ranges have different sizes")
        return sum(t for v, t in zip(vals[0], target) if test(v) and is_num(t))
    raise ValueError(f"unknown function {name}")


def value_of(formula, cells):
    return evaluate(parse_formula(formula), cells)


def shown(v):
    """How a value appears in a cell, as an option says it: ('text', 'VERO'), ('text', label), ('num', n)."""
    if isinstance(v, bool):
        return ("text", "VERO" if v else "FALSO")
    if isinstance(v, str):
        return ("text", v)
    if v != int(v):
        raise ValueError(f"value {v} is not a whole number")
    return ("num", int(v))
