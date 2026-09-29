"""Shared reading helpers for the checkers of the physics generators on graphs (group 3):
fis_tabelle_grafici, fis_proporzionalita_diretta, fis_proporzionalita_inversa.

They read the exercise as the student sees it: the prose lines of the problem, the table of data (a two-column
LaTeX array), the options with their units and the `grafico-dati` scene. Numbers are exact SymPy Rationals, written
as the physics lessons write them: a decimal comma {,}, a fixed number of decimals (trailing zeros are kept, 6{,}0),
a thin space \\, in thousands from five digits.
"""
import re

from sympy import Rational

BANNED = re.compile(r"—|piuttosto che")

# Units in LaTeX, written again here from the lessons (not imported from the generator).
UNIT_TEX = {
    "g": r"\text{g}",
    "cm": r"\text{cm}",
    "m": r"\text{m}",
    "cm3": r"\text{cm}^3",
    "L": r"\text{L}",
    "s": r"\text{s}",
    "min": r"\text{min}",
    "C": r"^\circ\text{C}",
    "kPa": r"\text{kPa}",
    "m/s": r"\text{m/s}",
    "L/min": r"\text{L/min}",
    "cm/g": r"\text{cm/g}",
    "g/cm": r"\text{g/cm}",
    "g/cm3": r"\text{g/cm}^3",
    "cm3/g": r"\text{cm}^3\text{/g}",
    "min/L": r"\text{min/L}",
    "cm/s": r"\text{cm/s}",
    "s/cm": r"\text{s/cm}",
    "C/min": r"^\circ\text{C/min}",
    "min/C": r"\text{min/}^\circ\text{C}",
    "cm/min": r"\text{cm/min}",
    "kPa*cm3": r"\text{kPa} \cdot \text{cm}^3",
    "kPa/cm3": r"\text{kPa/cm}^3",
    "m*s": r"\text{m} \cdot \text{s}",
    "L*min": r"\text{L} \cdot \text{min}",
    "cm/s2": r"\text{cm/s}^2",
    "m/s2": r"\text{m/s}^2",
    "s2": r"\text{s}^2",
    "s2/m": r"\text{s}^2\text{/m}",
    "min2/L": r"\text{min}^2\text{/L}",
    "s2/cm": r"\text{s}^2\text{/cm}",
}
# Plain units in the prose ("$6{,}0$ cm") and in the scene.
UNIT_UNI = {"g": "g", "cm": "cm", "m": "m", "cm3": "cm³", "L": "L", "s": "s", "min": "min", "C": "°C", "kPa": "kPa", "m/s": "m/s", "L/min": "L/min"}

NUM = r"-?(?:\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}\d+)?"


def parse_num(s):
    """A number as written in the problem, with its number of decimals."""
    s = s.strip()
    if not re.fullmatch(NUM, s):
        raise ValueError(f"not a number: {s!r}")
    neg = s.startswith("-")
    body = s.lstrip("-").replace("\\,", "")
    whole, _, frac = body.partition("{,}")
    v = Rational(int(whole + frac), 10 ** len(frac))
    return (-v if neg else v), len(frac)


def fmt(v, d):
    """The canonical writing of v with exactly d decimals."""
    v = Rational(v)
    scaled = v * 10**d
    if scaled.q != 1:
        raise ValueError(f"{v} does not have {d} decimals")
    neg = scaled < 0
    s = str(abs(int(scaled))).rjust(d + 1, "0")
    whole, frac = s[: len(s) - d], s[len(s) - d :]
    if len(whole) >= 5:
        whole = f"{int(whole):,}".replace(",", "\\,")
    return ("-" if neg else "") + whole + ("{," + "}" + frac if d else "")


def n_decimals(v):
    v = Rational(v)
    k = 0
    while (v * 10**k).q != 1:
        k += 1
        if k > 12:
            return 99
    return k


def rat(x):
    """A JSON number of the scene (a short decimal) as an exact Rational."""
    return Rational(repr(float(x))) if not isinstance(x, int) else Rational(x)


def top_lines(tex):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex.strip(), re.S)
    if not m:
        return [tex.strip()]
    body = m.group(1)
    # split on top-level \\ only (a table inside keeps its rows)
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
    return [l.strip() for l in out]


def read_problem(tex):
    """(prose, table) where table is None or (header_x, header_y, rows as [(str, str)])."""
    prose, table = [], None
    for line in top_lines(tex):
        m = re.fullmatch(r"\\text\{(.*)\}", line)
        if m:
            prose.append(m.group(1))
            continue
        t = re.fullmatch(r"\\begin\{array\}\{c\|c\} (.*) & (.*?) \\\\ \\hline (.*) \\end\{array\}", line)
        if t and table is None:
            rows = [tuple(c.strip() for c in r.split(" & ")) for r in t.group(3).split(" \\\\ ")]
            table = (t.group(1).strip(), t.group(2).strip(), rows)
            continue
        raise ValueError(f"unexpected problem line: {line!r}")
    return " ".join(prose), table


def header(sym, unit):
    return f"{sym}\\ ({UNIT_TEX[unit]})"


def value_option(latex):
    """(value, decimals, unit key) of an option written 'number\\ unit'."""
    for key, tex in sorted(UNIT_TEX.items(), key=lambda kv: -len(kv[1])):
        suffix = "\\ " + tex
        if latex.endswith(suffix):
            v, d = parse_num(latex[: -len(suffix)])
            return v, d, key
    raise ValueError(f"option without a known unit: {latex!r}")


def check_choice(errs, sample, truth, d, unit):
    """The answer is a choice; exactly one option is truth in `unit`, written with d decimals; four different options."""
    a = sample.get("answer", {})
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    opts = a.get("options", [])
    if len(opts) != 4:
        errs.append(f"{len(opts)} options, expected 4")
    if len({o["latex"] for o in opts}) != len(opts):
        errs.append("repeated options")
    parsed = []
    for o in opts:
        try:
            parsed.append(value_option(o["latex"]))
        except ValueError as e:
            errs.append(str(e))
            return
    hits = [i for i, (v, _, u) in enumerate(parsed) if v == truth and u == unit]
    if len(hits) != 1:
        errs.append(f"the truth {truth} {unit} appears {len(hits)} times among {[o['latex'] for o in opts]}")
        return
    if a.get("correct") != hits[0]:
        errs.append("correct index is not the truth")
    want = fmt(truth, d) + "\\ " + UNIT_TEX[unit]
    if opts[hits[0]]["latex"] != want:
        errs.append(f"right option {opts[hits[0]]['latex']!r} != {want!r}")
    for (v, dd, u), o in zip(parsed, opts):
        if v <= 0:
            errs.append(f"option not positive: {o['latex']}")
        if fmt(v, dd) + "\\ " + UNIT_TEX[u] != o["latex"]:
            errs.append(f"option not canonical: {o['latex']}")
        if o["values"][:2] != [str(v), u]:
            errs.append(f"option values {o['values']} do not match {o['latex']}")


def check_text_choice(errs, sample, truth_key, allowed):
    a = sample.get("answer", {})
    if a.get("kind") != "choice":
        errs.append("answer is not a choice")
        return
    opts = a.get("options", [])
    keys = [o["values"][0] for o in opts]
    if len(set(keys)) != len(keys):
        errs.append("repeated options")
    for o in opts:
        if o["values"][0] not in allowed or o["latex"] != f"\\text{{{allowed[o['values'][0]]}}}":
            errs.append(f"unknown option {o}")
    if keys.count(truth_key) != 1 or a.get("correct") != keys.index(truth_key):
        errs.append(f"the right option should be {truth_key}, options {keys}, correct {a.get('correct')}")


def common(sample):
    errs = []
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    return errs


def scene_axes(sample, xsym, xunit, ysym, yunit):
    """The scene's data, after checking its type and axes."""
    sc = sample.get("scene")
    if not sc or sc.get("type") != "grafico-dati":
        raise ValueError("missing grafico-dati scene")
    d = sc["data"]
    for ax, sym, unit in (("x", xsym, xunit), ("y", ysym, yunit)):
        if d[ax]["nome"] != sym or d[ax]["unita"] != UNIT_UNI[unit]:
            raise ValueError(f"scene axis {ax} is {d[ax]['nome']} ({d[ax]['unita']}), expected {sym} ({UNIT_UNI[unit]})")
        if not 4 <= d[ax]["celle"] <= 24:
            raise ValueError(f"scene axis {ax} has {d[ax]['celle']} cells")
    if not sc.get("alt"):
        raise ValueError("scene without alt")
    return d
