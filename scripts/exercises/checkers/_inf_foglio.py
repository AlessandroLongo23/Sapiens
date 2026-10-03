"""Shared helpers for the checkers of the informatics chapter "Il foglio di calcolo" (excel, inf-riferimenti-celle,
inf-funzioni-foglio).

Written from the specs and the lessons, not from the generators: a small spreadsheet with its own tokenizer, parser
and evaluator on exact fractions. A sheet is a dict from an address ("B2") to what the cell contains: a Fraction, a
text (str) or a formula (a str that starts with "="). Formulas use the Italian function names, the semicolon between
arguments and the decimal comma.

The problems are prose lines \\text{...} with inline pieces: `$\\texttt{...}$` for formulas, addresses and error
names, `$...$` for numbers; sometimes with one table (an array) between the lines.
"""
import re
from fractions import Fraction

BANNED = re.compile(r"—|piuttosto che")
ERROR_NAMES = ["#DIV/0!", "#VALORE!", "#NOME?", "riferimento circolare"]
FUNCTIONS = {"SOMMA", "MEDIA", "MIN", "MAX", "CONTA.NUMERI", "ARROTONDA"}


class SheetError(Exception):
    """An error a cell shows: #DIV/0!, #VALORE!, #NOME? or a circular reference."""

    def __init__(self, name):
        super().__init__(name)
        self.name = name


# ---------------------------------------------------------------------------
# Addresses


def col_index(letters):
    n = 0
    for ch in letters:
        n = n * 26 + (ord(ch) - 64)
    return n - 1


def col_name(c):
    return chr(65 + c) if c < 26 else col_name(c // 26 - 1) + chr(65 + c % 26)


def parse_ref(s):
    """'$B2' -> (col, row, abs_col, abs_row), col from 0 and row from 1."""
    m = re.fullmatch(r"(\$?)([A-Z]{1,2})(\$?)(\d+)", s)
    if not m:
        raise ValueError(f"not a reference: {s!r}")
    return (col_index(m.group(2)), int(m.group(4)), m.group(1) == "$", m.group(3) == "$")


def ref_str(ref):
    c, r, ac, ar = ref
    return ("$" if ac else "") + col_name(c) + ("$" if ar else "") + str(r)


def address(c, r):
    return col_name(c) + str(r)


def range_cells(a, b):
    c1, c2 = sorted((a[0], b[0]))
    r1, r2 = sorted((a[1], b[1]))
    return [address(c, r) for r in range(r1, r2 + 1) for c in range(c1, c2 + 1)]


# ---------------------------------------------------------------------------
# Numbers


def parse_num(s):
    """'12,5' (in a formula) or '12{,}5' (in the page) -> Fraction."""
    m = re.fullmatch(r"(-?)(\d+)(?:(?:,|\{,\})(\d+))?", s.strip())
    if not m:
        raise ValueError(f"not a number: {s!r}")
    frac = m.group(3) or ""
    v = Fraction(int(m.group(2) + frac), 10 ** len(frac))
    return -v if m.group(1) else v


def decimals(v):
    """Number of decimals of a terminating decimal, None for a periodic one."""
    v = Fraction(v)
    for k in range(0, 12):
        if (v * 10**k).denominator == 1:
            return k
    return None


def fmt_tex(v):
    """12{,}5: how the page writes a terminating decimal."""
    k = decimals(v)
    if k is None:
        raise ValueError(f"{v} is not a terminating decimal")
    s = str(abs(int(v * 10**k))).rjust(k + 1, "0")
    whole, frac = s[: len(s) - k], s[len(s) - k :]
    return ("-" if v < 0 else "") + whole + (f"{{,}}{frac}" if k else "")


def round_half_away(v, n):
    scale = Fraction(10) ** n
    x = abs(v) * scale
    whole = x.numerator // x.denominator
    if x - whole >= Fraction(1, 2):
        whole += 1
    r = Fraction(whole) / scale
    return -r if v < 0 else r


# ---------------------------------------------------------------------------
# Formulas: tokens, tree, value

TOKEN = re.compile(r"(\d+(?:,\d+)?)|(\$?[A-Z]{1,2}\$?\d+)(?![A-Za-z0-9.])|([A-Za-z][A-Za-z.]*)|([-+*/^():;])")


def tokenize(src):
    out, i = [], 0
    while i < len(src):
        m = TOKEN.match(src, i)
        if not m:
            raise ValueError(f"unexpected {src[i]!r} in formula {src!r}")
        kind = "num" if m.group(1) else "ref" if m.group(2) else "name" if m.group(3) else "sym"
        out.append((kind, m.group(0)))
        i = m.end()
    return out


def parse(formula):
    """The tree of a formula: ("num", Fraction), ("ref", ref), ("range", a, b), ("name", s), ("bin", op, l, r),
    ("neg", x), ("par", x), ("call", name, [args]). Powers bind tighter than * and /, these tighter than + and -;
    operators of the same level associate to the left."""
    if not formula.startswith("="):
        raise ValueError(f"formula without =: {formula!r}")
    toks = tokenize(formula[1:])
    pos = [0]

    def peek(sym):
        return pos[0] < len(toks) and toks[pos[0]] == ("sym", sym)

    def take():
        if pos[0] >= len(toks):
            raise ValueError(f"formula ends too early: {formula!r}")
        pos[0] += 1
        return toks[pos[0] - 1]

    def atom():
        kind, s = take()
        if kind == "num":
            return ("num", parse_num(s))
        if kind == "ref":
            a = parse_ref(s)
            if peek(":"):
                take()
                k2, s2 = take()
                if k2 != "ref":
                    raise ValueError(f"bad range in {formula!r}")
                return ("range", a, parse_ref(s2))
            return ("ref", a)
        if kind == "name":
            if not peek("("):
                return ("name", s)
            take()
            args = [expr()]
            while peek(";"):
                take()
                args.append(expr())
            if take() != ("sym", ")"):
                raise ValueError(f"missing ) in {formula!r}")
            return ("call", s, args)
        if s == "(":
            x = expr()
            if take() != ("sym", ")"):
                raise ValueError(f"missing ) in {formula!r}")
            return ("par", x)
        if s == "-":
            return ("neg", power())
        raise ValueError(f"unexpected {s!r} in {formula!r}")

    def power():
        left = atom()
        while peek("^"):
            take()
            left = ("bin", "^", left, atom())
        return left

    def term():
        left = power()
        while peek("*") or peek("/"):
            op = take()[1]
            left = ("bin", op, left, power())
        return left

    def expr():
        left = term()
        while peek("+") or peek("-"):
            op = take()[1]
            left = ("bin", op, left, term())
        return left

    tree = expr()
    if pos[0] != len(toks):
        raise ValueError(f"trailing tokens in {formula!r}")
    return tree


def unparse(tree):
    t = tree[0]
    if t == "num":
        v = tree[1]
        k = decimals(v)
        s = str(abs(int(v * 10**k))).rjust(k + 1, "0")
        return ("-" if v < 0 else "") + (s[: len(s) - k] + "," + s[len(s) - k :] if k else s)
    if t == "ref":
        return ref_str(tree[1])
    if t == "range":
        return ref_str(tree[1]) + ":" + ref_str(tree[2])
    if t == "name":
        return tree[1]
    if t == "bin":
        return unparse(tree[2]) + tree[1] + unparse(tree[3])
    if t == "neg":
        return "-" + unparse(tree[1])
    if t == "par":
        return "(" + unparse(tree[1]) + ")"
    return tree[1] + "(" + ";".join(unparse(a) for a in tree[2]) + ")"


def walk(tree):
    yield tree
    t = tree[0]
    if t == "bin":
        yield from walk(tree[2])
        yield from walk(tree[3])
    elif t in ("neg", "par"):
        yield from walk(tree[1])
    elif t == "call":
        for a in tree[2]:
            yield from walk(a)


def refs_of(tree):
    """Every reference of a formula, in order (the two ends of a range too)."""
    out = []
    for n in walk(tree):
        if n[0] == "ref":
            out.append(n[1])
        elif n[0] == "range":
            out += [n[1], n[2]]
    return out


def function_names(tree):
    return [n[1] for n in walk(tree) if n[0] == "call"]


def move_ref(ref, d_col, d_row):
    """A copy moves only the parts of a reference that have no dollar."""
    c, r, ac, ar = ref
    return (c if ac else c + d_col, r if ar else r + d_row, ac, ar)


def copy_formula(formula, d_col, d_row):
    """The formula after a copy d_col columns to the right and d_row rows down; None if a reference leaves the sheet."""

    def go(n):
        t = n[0]
        if t == "ref":
            return ("ref", move_ref(n[1], d_col, d_row))
        if t == "range":
            return ("range", move_ref(n[1], d_col, d_row), move_ref(n[2], d_col, d_row))
        if t == "bin":
            return ("bin", n[1], go(n[2]), go(n[3]))
        if t in ("neg", "par"):
            return (t, go(n[1]))
        if t == "call":
            return ("call", n[1], [go(a) for a in n[2]])
        return n

    moved = go(parse(formula))
    if any(c < 0 or r < 1 for c, r, _, _ in refs_of(moved)):
        return None
    return "=" + unparse(moved)


class Evaluator:
    """Values of cells and formulas of a sheet. `trace` collects the result of every arithmetic operation."""

    def __init__(self, sheet):
        self.sheet = sheet
        self.visiting = set()
        self.trace = []

    def cell(self, a):
        """A Fraction, a text (str) or None for an empty cell."""
        raw = self.sheet.get(a)
        if raw is None:
            return None
        if isinstance(raw, str) and raw.startswith("="):
            if a in self.visiting:
                raise SheetError("riferimento circolare")
            self.visiting.add(a)
            try:
                return self.value(parse(raw))
            finally:
                self.visiting.discard(a)
        return raw

    def scalar(self, tree):
        v = self.value(tree)
        if v is None:
            return Fraction(0)
        if isinstance(v, str):
            raise SheetError("#VALORE!")
        return v

    def numbers(self, tree):
        """The numbers of an argument of a function: texts and empty cells of a range or a reference are skipped."""
        if tree[0] in ("range", "ref"):
            cells = range_cells(tree[1], tree[2]) if tree[0] == "range" else [address(tree[1][0], tree[1][1])]
            return [v for v in (self.cell(c) for c in cells) if isinstance(v, Fraction)]
        v = self.value(tree)
        if isinstance(v, str):
            raise SheetError("#VALORE!")
        return [] if v is None else [v]

    def value(self, tree):
        t = tree[0]
        if t == "num":
            return tree[1]
        if t == "ref":
            return self.cell(address(tree[1][0], tree[1][1]))
        if t == "range":
            raise SheetError("#VALORE!")
        if t == "name":
            raise SheetError("#NOME?")
        if t == "par":
            return self.value(tree[1])
        if t == "neg":
            return -self.scalar(tree[1])
        if t == "bin":
            op = tree[1]
            a = self.scalar(tree[2])
            b = self.scalar(tree[3])
            if op == "/" and b == 0:
                raise SheetError("#DIV/0!")
            if op == "^" and (b.denominator != 1 or not 0 <= b <= 6):
                raise ValueError("exponent out of range")
            r = a + b if op == "+" else a - b if op == "-" else a * b if op == "*" else a / b if op == "/" else a ** int(b)
            self.trace.append(r)
            return r
        name, args = tree[1], tree[2]
        if name not in FUNCTIONS:
            raise SheetError("#NOME?")
        if name == "ARROTONDA":
            if len(args) != 2:
                raise ValueError("ARROTONDA takes two arguments")
            x = self.scalar(args[0])
            n = self.scalar(args[1])
            if n.denominator != 1:
                raise ValueError("ARROTONDA: the digits are a whole number")
            return round_half_away(x, int(n))
        xs = [x for a in args for x in self.numbers(a)]
        if name == "CONTA.NUMERI":
            return Fraction(len(xs))
        if name == "SOMMA":
            return sum(xs, Fraction(0))
        if name == "MEDIA":
            if not xs:
                raise SheetError("#DIV/0!")
            return sum(xs, Fraction(0)) / len(xs)
        if not xs:
            return Fraction(0)
        return min(xs) if name == "MIN" else max(xs)


def evaluate(formula, sheet):
    """The number a formula gives (an empty cell counts 0); raises SheetError for an error, ValueError for a text."""
    v = Evaluator(sheet).value(parse(formula))
    if v is None:
        return Fraction(0)
    if isinstance(v, str):
        raise ValueError(f"{formula} gives a text")
    return v


def flat_value(formula, sheet, right_to_left=False):
    """The value of a formula without brackets read strictly from left to right (or from right to left), ignoring
    precedence: the typical mistakes. None if it cannot be computed."""
    parts = re.split(r"([-+*/^])", formula[1:].replace("(", "").replace(")", ""))
    try:
        vals = [evaluate("=" + p, sheet) for p in parts[0::2]]
        ops = parts[1::2]

        def ap(op, a, b):
            if op == "^":
                return a ** int(b)
            return a + b if op == "+" else a - b if op == "-" else a * b if op == "*" else a / b

        if right_to_left:
            acc = vals[-1]
            for op, a in zip(reversed(ops), reversed(vals[:-1])):
                acc = ap(op, a, acc)
        else:
            acc = vals[0]
            for op, b in zip(ops, vals[1:]):
                acc = ap(op, acc, b)
        return acc
    except (ZeroDivisionError, SheetError, ValueError, OverflowError):
        return None


# ---------------------------------------------------------------------------
# Reading the page


def unescape_tt(s):
    out = s.replace("\\textdollar ", "$").replace("\\textasciicircum ", "^").replace("\\#", "#").replace("\\%", "%").replace("\\&", "&").replace("\\_", "_")
    if "\\" in out or "{" in out or "}" in out:
        raise ValueError(f"unexpected command in monospace text {s!r}")
    return out


def escape_tt(s):
    return "".join({"$": "\\textdollar ", "#": "\\#", "^": "\\textasciicircum ", "%": "\\%", "&": "\\&", "_": "\\_"}.get(ch, ch) for ch in s)


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


def read_problem(problem):
    """(prose, tables). In the prose every monospace piece is written between backticks and unescaped
    (`=A1*$B$2`), numbers stay as $12{,}5$. Each table is a (sheet, columns, rows) triple."""
    prose, tables = [], []
    for line in top_lines(problem):
        m = re.fullmatch(r"\\text\{(.*)\}", line, re.S)
        if m:
            prose.append(m.group(1))
        elif line.startswith("\\begin{array}{c|"):
            tables.append(read_table(line))
        else:
            raise ValueError(f"line of the problem not recognised: {line!r}")
    text = " ".join(prose)
    if "`" in text:
        raise ValueError("backtick in the prose")
    text = re.sub(r"\$\\texttt\{([^{}]*)\}\$", lambda m: "`" + unescape_tt(m.group(1)) + "`", text)
    if "\\texttt" in text:
        raise ValueError("monospace text not closed in the prose")
    return text, tables


def read_table(tex):
    """A table with the column letters on top and the row numbers on the left -> (sheet, n columns, n rows)."""
    m = re.fullmatch(r"\\begin\{array\}\{c((?:\|c)+)\} (.*) \\end\{array\}", tex, re.S)
    if not m:
        raise ValueError(f"not a table: {tex!r}")
    n_cols = m.group(1).count("c")
    rows = [[c.strip() for c in r.split("&")] for r in m.group(2).split(" \\\\ \\hline ")]
    head = rows[0]
    if head[0] != "" or len(head) != n_cols + 1:
        raise ValueError("table header of the wrong size")
    cols = []
    for h in head[1:]:
        mm = re.fullmatch(r"\\texttt\{([A-Z])\}", h)
        if not mm:
            raise ValueError(f"column header {h!r}")
        cols.append(mm.group(1))
    if cols != [col_name(i) for i in range(n_cols)]:
        raise ValueError(f"columns {cols} do not start from A in order")
    sheet = {}
    for i, row in enumerate(rows[1:], 1):
        if len(row) != n_cols + 1 or row[0] != f"\\texttt{{{i}}}":
            raise ValueError(f"row {i} of the table is malformed: {row}")
        for c, cell in zip(cols, row[1:]):
            if cell == "":
                continue
            a = f"{c}{i}"
            tt = re.fullmatch(r"\\texttt\{([^{}]*)\}", cell)
            tx = re.fullmatch(r"\\text\{([^{}]*)\}", cell)
            if tt:
                f = unescape_tt(tt.group(1))
                if not f.startswith("="):
                    raise ValueError(f"monospace cell that is not a formula: {cell!r}")
                sheet[a] = f
            elif tx:
                sheet[a] = tx.group(1)
            else:
                sheet[a] = parse_num(cell)
    return sheet, n_cols, len(rows) - 1


def sheet_matches_params(sheet, params_sheet):
    """The table of the page says the same as params.sheet (numbers typed with the comma, texts, formulas)."""
    if set(sheet) != set(params_sheet):
        return False
    for a, v in sheet.items():
        raw = params_sheet[a]
        if isinstance(v, Fraction):
            if not re.fullmatch(r"-?\d+(,\d+)?", raw) or parse_num(raw) != v:
                return False
        elif raw != v:
            return False
    return True


# ---------------------------------------------------------------------------
# Common checks


def common(sample, errs):
    for k in ("prompt", "problem", "solution"):
        if not isinstance(sample.get(k), str) or not sample[k]:
            errs.append(f"{k} missing")
    steps = sample.get("steps")
    if not steps or not all(isinstance(s, str) and s for s in steps):
        errs.append("no steps")
    text = " ".join([sample.get("problem", ""), sample.get("solution", "")] + list(steps or []))
    if BANNED.search(text):
        errs.append("banned words")


def check_options(choice, is_right, errs, what="choice"):
    """Four options with different values and different writings, one right, and `correct` points to it."""
    if not choice or choice.get("kind") != "choice":
        errs.append(f"{what} missing")
        return
    opts = choice.get("options", [])
    if len(opts) != 4:
        errs.append(f"{what}: {len(opts)} options, expected 4")
    if len({tuple(o["values"]) for o in opts}) != len(opts) or len({o["latex"] for o in opts}) != len(opts):
        errs.append(f"{what}: options not distinct")
    right = [i for i, o in enumerate(opts) if is_right(o)]
    if len(right) != 1:
        errs.append(f"{what}: {len(right)} right options")
    elif choice.get("correct") != right[0]:
        errs.append(f"{what}: correct is {choice.get('correct')}, the right option is {right[0]}")


def check_number_answer(sample, truth, errs, positive_whole=False):
    """The answer is the number `truth`; the choice has it once, every option written as its value says."""
    ans = sample.get("answer", {})
    if ans.get("kind") != "number" or ans.get("value") != str(truth):
        errs.append(f"answer {ans.get('value')!r} != {truth}")
    if sample.get("solution") != fmt_tex(truth):
        errs.append(f"solution {sample.get('solution')!r} != {fmt_tex(truth)}")
    ch = sample.get("choice")
    if not ch:
        errs.append("no choice")
        return
    for o in ch.get("options", []):
        v = o["values"][0]
        if len(o["values"]) != 1 or not re.fullmatch(r"-?\d+(/\d+)?", v):
            errs.append(f"option value {o['values']} is not a number")
            return
        f = Fraction(v)
        if decimals(f) is None or decimals(f) > 3:
            errs.append(f"option {v} has too many decimals")
        elif o["latex"] != fmt_tex(f):
            errs.append(f"option written {o['latex']!r}, its value is {v}")
        if positive_whole and (f.denominator != 1 or f < 1):
            errs.append(f"option {v} is not a positive whole number")
    check_options(ch, lambda o: Fraction(o["values"][0]) == truth, errs)


def check_code_options(choice, right_value, errs):
    """Options that are monospace texts (formulas, addresses, error names): the writing must match the value."""
    for o in choice.get("options", []):
        v = o["values"][0]
        expected = "\\texttt{" + escape_tt(v) + "}" if not v.startswith("riferimento") else "\\text{" + v + "}"
        if len(o["values"]) != 1 or o["latex"] != expected:
            errs.append(f"option written {o['latex']!r}, its value is {v!r}")
    check_options(choice, lambda o: o["values"][0] == right_value, errs)
