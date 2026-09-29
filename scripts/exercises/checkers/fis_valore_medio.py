"""Checker for fis-valore-medio (specs/exercises/fis-valore-medio.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/06-fis-valore-medio.md), not from the generator.
Everything is read back from the text the student sees, not from params: the context and the sensitivity from the
first sentence, the measures from the row of data, the cause of the wrong measure (level 5) and the three results
(level 6). The arithmetic is exact (fractions.Fraction):

- mean = sum / n, half-range = (max - min) / 2, uncertainty = the half-range or the sensitivity, the larger;
- a result keeps one significant figure of the uncertainty and rounds the mean to the same position, looking at the
  first digit taken away (5 or more: up); at levels 3-5 a rounding of the answer that falls exactly at half (the part
  taken away is 5 followed by zeros) is an error, and a distractor that would need one is not allowed;
- two results are compatible when their intervals overlap; they must overlap, or be apart, by at least one unit of
  the last digit of the finer uncertainty (never touching in one point).

Then the choice: four options, the right one where `correct` says, each written as the lesson writes it (trailing
zeros included) and with `values` saying the same without LaTeX, no two with the same writing and, at levels 3-5,
no two with the same numbers. The distractors are the ones the spec lists, in its order of preference, with the
fallbacks written in the Verifica section of the spec.
"""
import re
from fractions import Fraction as F

BANNED = re.compile(r"—|piuttosto che")

CASE_RANGES = {
    3: {"stessa-posizione": (0.20, 0.40), "incertezza-arrotondata": (0.50, 0.70), "posizione-piu-alta": (0.04, 0.17)},
    4: {"uguali": (0.10, 0.24), "sensibilita": (0.26, 0.42), "semidispersione": (0.42, 0.58)},
    6: {k: (0.19, 0.31) for k in ["solo B", "solo C", "B e C", "né B né C"]},
}

# key: (what, same, tool, decimals, sensitivity, lo, hi, unit LaTeX, unit plain, symbol)
CONTEXTS = {
    "pendolo": ("il tempo di $10$ oscillazioni di un pendolo", "il tempo di $10$ oscillazioni dello stesso pendolo", "un cronometro", 2, F(1, 100), F(8), F(20), r"\text{s}", "s", "t"),
    "caduta": ("il tempo di caduta di una pallina", "il tempo di caduta della stessa pallina dalla stessa altezza", "un cronometro", 2, F(1, 100), F(40, 100), F(90, 100), r"\text{s}", "s", "t"),
    "diametro": ("il diametro di un tubo", "il diametro dello stesso tubo", "un calibro", 2, F(5, 100), F(10), F(40), r"\text{mm}", "mm", "d"),
    "massa": ("la massa di un sasso", "la massa dello stesso sasso", "una bilancia", 1, F(1, 10), F(20), F(300), r"\text{g}", "g", "m"),
    "temperatura": ("la temperatura di un liquido", "la temperatura dello stesso liquido", "un termometro", 1, F(1, 10), F(15), F(80), r"{}^\circ\text{C}", "°C", "T"),
    "lunghezza": ("la lunghezza di un banco", "la lunghezza dello stesso banco", "un metro a nastro", 1, F(1, 10), F(60), F(150), r"\text{cm}", "cm", "l"),
}
COUNT = {"quattro": 4, "cinque": 5, "sei": 6}
ORDINAL = ["prima", "seconda", "terza", "quarta", "quinta", "sesta"]

NUM = r"\d+(?:\{,\}\d+)?"


class Bad(Exception):
    pass


# ---------------------------------------------------------------------------
# Numbers


def parse_num(s):
    if not re.fullmatch(NUM, s):
        raise Bad(f"not a number: {s!r}")
    whole, _, frac = s.partition("{,}")
    if len(whole) > 1 and whole.startswith("0"):
        raise Bad(f"leading zero in {s!r}")
    return F(int(whole + frac), 10 ** len(frac)), len(frac)


def write(v, k):
    """v with exactly k decimals, as the lesson writes it."""
    scaled = v * 10**k
    if scaled.denominator != 1:
        raise Bad(f"{v} does not fit in {k} decimals")
    s = str(scaled.numerator).rjust(k + 1, "0")
    return s[: len(s) - k] + ("{,}" + s[len(s) - k :] if k else "")


def n_dec(v):
    """Decimals of a terminating decimal, None if it does not terminate."""
    k = 0
    while (v * 10**k).denominator != 1:
        k += 1
        if k > 15:
            return None
    return k


def pow10(p):
    return F(10) ** p


def round_at(x, p):
    """(x rounded to a multiple of 10^p, half up; whether the part taken away is exactly half)."""
    y = x / pow10(p)
    f = y.numerator // y.denominator
    frac = y - f
    return (f + (1 if frac >= F(1, 2) else 0)) * pow10(p), frac == F(1, 2)


def sig_pos(x):
    p = 0
    while pow10(p + 1) <= x:
        p += 1
    while pow10(p) > x:
        p -= 1
    return p


def result(mean, delta):
    """(m, md, D, Dd) as the lesson writes it, or None if a rounding falls at half or Δ carries to a new position."""
    p = sig_pos(delta)
    D, h1 = round_at(delta, p)
    m, h2 = round_at(mean, p)
    if h1 or h2 or D >= pow10(p + 1) or p > 0:
        return None
    return (m, max(0, -p), D, max(0, -p))


def nkey(r):
    return (r[0], r[2])


# ---------------------------------------------------------------------------
# Reading


def top_lines(tex):
    m = re.fullmatch(r"\\begin\{array\}\{l\} (.*) \\end\{array\}", tex.strip(), re.S)
    return m.group(1).split(r" \\ ") if m else [tex.strip()]


def split_problem(tex):
    """(prose before the row, the row, prose after)."""
    before, row, after = [], None, []
    for line in top_lines(tex):
        m = re.fullmatch(r"\\text\{(.*)\}", line)
        if m and "\\quad" not in line:
            (before if row is None else after).append(m.group(1))
        elif row is None:
            row = line
        else:
            raise Bad(f"two formula rows: {line!r}")
    if row is None:
        raise Bad("no row of data")
    return " ".join(before), row, " ".join(after)


def sens_prose(key):
    c = CONTEXTS[key]
    s = write(c[4], n_dec(c[4]))
    return f"${s}\\,{c[7]}$" if key == "temperatura" else f"${s}$ {c[8]}"


def read_series(sample):
    intro, row, tail = split_problem(sample["problem"])
    m = re.fullmatch(r"Un gruppo misura (quattro|cinque|sei) volte (.+), con (.+) che ha la sensibilità di (.+):", intro)
    if not m:
        raise Bad(f"intro not recognised: {intro!r}")
    key = next((k for k, c in CONTEXTS.items() if c[0] == m.group(2) and c[2] == m.group(3)), None)
    if key is None:
        raise Bad(f"context not recognised: {m.group(2)!r} / {m.group(3)!r}")
    c = CONTEXTS[key]
    sm = re.fullmatch(r"\$(" + NUM + r")\$ (\S+)|\$(" + NUM + r")\\,(.+)\$", m.group(4))
    if not sm:
        raise Bad(f"sensitivity not readable: {m.group(4)!r}")
    S, _ = parse_num(sm.group(1) or sm.group(3))
    unit_prose = sm.group(2) or sm.group(4)
    if S != c[4] or unit_prose not in (c[8], c[7]) or m.group(4) != sens_prose(key):
        raise Bad(f"sensitivity {m.group(4)!r} is not the one of the context {key}")
    suffix = " \\ " + c[7]
    if not row.endswith(suffix):
        raise Bad(f"row without its unit: {row!r}")
    items = row[: -len(suffix)].split(r" \quad ")
    ms = []
    for it in items:
        v, k = parse_num(it)
        if k != c[3]:
            raise Bad(f"measure {it} not written with {c[3]} decimals")
        if (v / S).denominator != 1:
            raise Bad(f"measure {it} not a multiple of the sensitivity")
        ms.append(v)
    if len(ms) != COUNT[m.group(1)]:
        raise Bad(f"the text says {m.group(1)} measures, the row has {len(ms)}")
    return key, S, ms, tail


def stats(ms):
    n = len(ms)
    s = sum(ms)
    return {"n": n, "sum": s, "mean": s / n, "max": max(ms), "min": min(ms), "range": max(ms) - min(ms), "semi": (max(ms) - min(ms)) / 2}


def read_options(sample, key, kind):
    """Each option as (m, md) for a value, (m, md, D, Dd) for a result, with its writing checked against `values`."""
    c = CONTEXTS[key]
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        raise Bad("the answer is not a choice")
    if "choice" in sample and sample["choice"] is not None:
        raise Bad("unexpected separate choice variant")
    out = []
    for o in ans["options"]:
        lx = o["latex"]
        vals = o.get("values", [])
        if kind == "value":
            m = re.fullmatch(r"(" + NUM + r")\\," + re.escape(c[7]), lx)
            if not m:
                raise Bad(f"option not a value in {c[8]}: {lx!r}")
            v = parse_num(m.group(1))
            plain = f"{m.group(1).replace('{,}', ',')} {c[8]}"
        else:
            m = re.fullmatch(r"\((" + NUM + r") \\pm (" + NUM + r")\)\\," + re.escape(c[7]), lx)
            if not m:
                raise Bad(f"option not a result in {c[8]}: {lx!r}")
            v = parse_num(m.group(1)) + parse_num(m.group(2))
            plain = f"{m.group(1).replace('{,}', ',')} ± {m.group(2).replace('{,}', ',')} {c[8]}"
        if vals != [plain]:
            raise Bad(f"values {vals} do not say {plain!r}")
        out.append(v)
    return out


def check_choice(errs, sample, opts, answer, distractors, numeric):
    ans = sample["answer"]
    if len(opts) != 4:
        errs.append(f"{len(opts)} options")
    if len(set(opts)) != len(opts) or len({o["values"][0] for o in ans["options"]}) != len(opts):
        errs.append("two options written the same way")
    if numeric and len({nkey(o) for o in opts}) != len(opts):
        errs.append("two options with the same numbers written differently")
    idx = ans.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts):
        errs.append("correct out of range")
        return
    if opts[idx] != answer:
        errs.append(f"the right option is {opts[idx]}, expected {answer}")
    rest = [o for i, o in enumerate(opts) if i != idx]
    if sorted(rest) != sorted(distractors):
        errs.append(f"distractors {rest} != expected {distractors}")


def first_three(answer, cands):
    seen = {nkey(answer)}
    out = []
    for r in cands:
        if r is None or r[2] < 0 or r[0] <= 0 or nkey(r) in seen:
            continue
        seen.add(nkey(r))
        out.append(r)
        if len(out) == 3:
            break
    return out


def fallbacks(S, mean, answer):
    unit = pow10(-answer[3])
    plus, minus = answer[2] + unit, answer[2] - unit
    return [
        result(mean, S),
        (answer[0], answer[1], plus, answer[3]) if plus < pow10(-answer[3] + 1) else None,
        (answer[0], answer[1], minus, answer[3]) if minus > 0 else None,
        (answer[0] + unit, answer[1], answer[2], answer[3]),
        (answer[0] - unit, answer[1], answer[2], answer[3]),
    ]


def level3_mistakes(d, s, answer):
    """The calculator's numbers, the range for the uncertainty, the mean with one digit more, Δ truncated."""
    p = -answer[3]
    extra, half = round_at(s["mean"], p - 1)
    tr = (s["semi"] / pow10(p)).__floor__() * pow10(p)
    return [
        (s["mean"], max(d, n_dec(s["mean"])), s["semi"], max(d, n_dec(s["semi"]))),
        result(s["mean"], s["range"]),
        None if half else (extra, answer[1] + 1, answer[2], answer[3]),
        None if tr == answer[2] else (answer[0], answer[1], tr, answer[3]),
    ]


# ---------------------------------------------------------------------------
# Levels 1 and 2


def near_fill(picked, used, center, unit):
    k = 1
    while len(picked) < 3:
        for v in (center + k * unit, center - k * unit):
            if len(picked) < 3 and v > 0 and v not in used:
                used.add(v)
                picked.append(v)
        k += 1


def level1(sample, errs):
    key, S, ms, tail = read_series(sample)
    d = CONTEXTS[key][3]
    if tail != "Quanto vale il valore medio delle misure?":
        errs.append(f"question {tail!r}")
    s = stats(ms)
    nd = n_dec(s["mean"])
    if nd is None or nd > d + 1:
        errs.append(f"mean {s['mean']} has more than one decimal past the data")
        return key
    D = max(d, nd)
    n = s["n"]
    used, picked = {s["mean"]}, []
    for v in (s["sum"] / (n - 1), (s["max"] + s["min"]) / 2, (s["sum"] - ms[-1]) / (n - 1)):
        k = n_dec(v)
        if k is not None and k <= D and v not in used:
            used.add(v)
            picked.append(v)
    near_fill(picked, used, s["mean"], pow10(-D))
    opts = read_options(sample, key, "value")
    check_choice(errs, sample, opts, (s["mean"], D), [(v, D) for v in picked], False)
    sym = CONTEXTS[key][9]
    if sample["solution"] != f"\\bar{{{sym}}} = {write(s['mean'], D)}\\,{CONTEXTS[key][7]}":
        errs.append("solution does not say the mean")
    return key


def level2(sample, errs):
    key, S, ms, tail = read_series(sample)
    d = CONTEXTS[key][3]
    if tail != "Quanto vale la semidispersione delle misure?":
        errs.append(f"question {tail!r}")
    s = stats(ms)
    if not s["semi"] > S:
        errs.append("half-range not larger than the sensitivity")
    ans = s["semi"]
    k = lambda v: max(d, n_dec(v))  # noqa: E731
    used, picked = {ans}, []
    for v in (s["range"], s["max"] - s["mean"], S):
        nd = n_dec(v)
        if nd is not None and nd <= d + 2 and v > 0 and v not in used:
            used.add(v)
            picked.append(v)
    near_fill(picked, used, ans, pow10(-k(ans)))
    opts = read_options(sample, key, "value")
    check_choice(errs, sample, opts, (ans, k(ans)), [(v, k(v)) for v in picked], False)
    return key


# ---------------------------------------------------------------------------
# Levels 3, 4, 5


def check_result_choice(errs, sample, key, answer, cands):
    if answer is None:
        errs.append("the result rounds at half (or carries)")
        return
    opts = read_options(sample, key, "result")
    check_choice(errs, sample, opts, answer, first_three(answer, cands), True)
    c = CONTEXTS[key]
    want = f"{c[9]} = ({write(answer[0], answer[1])} \\pm {write(answer[2], answer[3])})\\,{c[7]}"
    if sample["solution"] != want:
        errs.append(f"solution {sample['solution']!r} != {want!r}")


def level3(sample, errs):
    key, S, ms, tail = read_series(sample)
    d = CONTEXTS[key][3]
    if tail != "Scrivi il risultato della misura.":
        errs.append(f"question {tail!r}")
    s = stats(ms)
    if s["semi"] < 3 * S:
        errs.append("half-range under three times the sensitivity")
    nd = n_dec(s["mean"])
    if nd is None or nd > d + 1:
        errs.append("mean with more than one decimal past the data")
        return None
    answer = result(s["mean"], s["semi"])
    if answer is None:
        errs.append("rounding at half")
        return None
    check_result_choice(errs, sample, key, answer, level3_mistakes(d, s, answer) + fallbacks(S, s["mean"], answer))
    if -answer[3] == -d:
        return "stessa-posizione"
    return "incertezza-arrotondata" if answer[2] != s["semi"] else "posizione-piu-alta"


def level4(sample, errs):
    key, S, ms, tail = read_series(sample)
    d = CONTEXTS[key][3]
    if tail != "Scrivi il risultato della misura.":
        errs.append(f"question {tail!r}")
    s = stats(ms)
    if s["semi"] < S:
        if s["range"] not in (0, S):
            errs.append("measures differ by more than one unit of the sensitivity")
        answer = result(s["mean"], S)
        if answer is None:
            errs.append("rounding at half")
            return None
        zero = s["semi"] == 0
        cands = [
            (s["mean"], d, F(0), 0) if zero else result(s["mean"], s["semi"]),
            (answer[0], answer[1], S / 2, n_dec(S / 2)),
        ] + fallbacks(S, s["mean"], answer)
        check_result_choice(errs, sample, key, answer, cands)
        return "uguali" if zero else "sensibilita"
    if s["semi"] < 3 * S:
        errs.append("half-range larger than the sensitivity but under three times it")
    nd = n_dec(s["mean"])
    if nd is None or nd > d + 1:
        errs.append("mean with more than one decimal past the data")
        return None
    answer = result(s["mean"], s["semi"])
    if answer is None:
        errs.append("rounding at half")
        return None
    cands = [result(s["mean"], S)] + level3_mistakes(d, s, answer) + fallbacks(S, s["mean"], answer)
    check_result_choice(errs, sample, key, answer, cands)
    return "semidispersione"


CAUSES = {
    "fermato-tardi": r"Chi misurava si è accorto che nella (\w+) misura il cronometro è stato fermato in ritardo\.",
    "partito-tardi": r"Chi misurava si è accorto che nella (\w+) misura il cronometro è stato fatto partire in ritardo\.",
    "nove-oscillazioni": r"Chi misurava si è accorto che nella (\w+) misura ha contato \$9\$ oscillazioni invece di \$10\$\.",
    "bilancia": r"Chi pesava si è accorto che nella (\w+) pesata la bilancia non era stata azzerata e a vuoto segnava \$(" + NUM + r")\$ g\.",
    "metro": r"Chi misurava si è accorto che nella (\w+) misura il metro era appoggiato dalla tacca di \$1\$ cm invece che dallo zero\.",
}
CAUSE_CONTEXT = {"fermato-tardi": ("pendolo", "caduta"), "partito-tardi": ("pendolo", "caduta"), "nove-oscillazioni": ("pendolo",), "bilancia": ("massa",), "metro": ("lunghezza",)}


def uncertainty(s, S):
    return max(s["semi"], S)


def level5(sample, errs):
    key, S, ms, tail = read_series(sample)
    if not tail.endswith(" Scrivi il risultato della misura."):
        errs.append(f"question {tail!r}")
    sentence = tail[: -len(" Scrivi il risultato della misura.")]
    cause, m = next(((k, re.fullmatch(rx, sentence)) for k, rx in CAUSES.items() if re.fullmatch(rx, sentence)), (None, None))
    if cause is None:
        errs.append(f"cause not recognised: {sentence!r}")
        return None
    if key not in CAUSE_CONTEXT[cause]:
        errs.append(f"cause {cause} in the context {key}")
    if m.group(1) not in ORDINAL:
        errs.append(f"ordinal {m.group(1)!r}")
        return cause
    i = ORDINAL.index(m.group(1))
    if not 5 <= len(ms) <= 6 or i >= len(ms):
        errs.append(f"{len(ms)} measures, wrong one at {i + 1}")
        return cause
    wrong = ms[i]
    good = ms[:i] + ms[i + 1 :]
    g = stats(good)
    lo, hi = CONTEXTS[key][5], CONTEXTS[key][6]
    if any(not lo <= x <= hi for x in good):
        errs.append("a good measure out of the range of the context")
    shorter = cause in ("partito-tardi", "nove-oscillazioni")
    dist = g["min"] - wrong if shorter else wrong - g["max"]
    if dist < 5 * g["semi"] or dist <= 0:
        errs.append(f"the wrong measure {wrong} is not at least five half-ranges away, on the side of its cause")
    if cause == "nove-oscillazioni" and not g["min"] - S <= wrong * F(10, 9) <= g["max"] + S:
        errs.append("nine oscillations: the measure is not about nine tenths of a good one")
    if cause == "bilancia":
        x, k = parse_num(m.group(2))
        if k != 1 or not g["min"] <= wrong - x <= g["max"]:
            errs.append(f"the balance showed {x}: {wrong} - {x} is not among the good measures")
    if cause == "metro" and not g["min"] <= wrong - 1 <= g["max"]:
        errs.append("ruler from 1 cm: the measure minus 1 cm is not among the good ones")
    answer = result(g["mean"], uncertainty(g, S))
    if answer is None:
        errs.append("rounding at half")
        return cause
    a = stats(ms)
    with_all = result(a["mean"], uncertainty(a, S))
    all_delta = None
    if with_all:
        v, h = round_at(g["mean"], -with_all[3])
        all_delta = None if h else (v, with_all[1], with_all[2], with_all[3])

    def without(x):
        rest = list(good)
        rest.remove(x)
        s = stats(rest)
        return result(s["mean"], uncertainty(s, S))

    am, h = round_at(a["mean"], -answer[3])
    cands = [with_all, all_delta, without(g["min"]), without(g["max"]), None if h else (am, answer[1], answer[2], answer[3])]
    check_result_choice(errs, sample, key, answer, cands + fallbacks(S, g["mean"], answer))
    return cause


# ---------------------------------------------------------------------------
# Level 6

LEVEL6 = ["solo B", "solo C", "B e C", "né B né C"]


def level6(sample, errs):
    intro, row, tail = split_problem(sample["problem"])
    m = re.fullmatch(r"Tre gruppi misurano (.+) e scrivono i risultati:", intro)
    key = next((k for k, c in CONTEXTS.items() if m and c[1] == m.group(1)), None)
    if key is None:
        raise Bad(f"intro not recognised: {intro!r}")
    if tail != "Con quali misure è compatibile la misura A?":
        errs.append(f"question {tail!r}")
    c = CONTEXTS[key]
    d, S = c[3], c[4]
    items = row.split(r" \quad ")
    if len(items) != 3:
        raise Bad("three results expected")
    groups = []
    for name, it in zip("ABC", items):
        gm = re.fullmatch(re.escape(f"{c[9]}_{name} = (") + r"(" + NUM + r") \\pm (" + NUM + r")" + re.escape(f")\\,{c[7]}"), it)
        if not gm:
            raise Bad(f"result {name} not readable: {it!r}")
        v, kv = parse_num(gm.group(1))
        D, kd = parse_num(gm.group(2))
        if D <= 0 or kv != kd:
            errs.append(f"{name}: value and uncertainty at different positions")
        p = -kd
        if D != round_at(D, sig_pos(D))[0] or sig_pos(D) != p:
            errs.append(f"{name}: uncertainty {D} not one significant figure written at its position")
        if p not in (-d, -d + 1):
            errs.append(f"{name}: uncertainty at position {p}")
        if D < S:
            errs.append(f"{name}: uncertainty smaller than the sensitivity")
        if not c[5] <= v <= c[6]:
            errs.append(f"{name}: value out of the range of the context")
        groups.append((v, D, p))
    if len(set(groups)) < 3:
        errs.append("two groups with the same result")

    def gap(x, y):
        return max(y[0] - y[1] - (x[0] + x[1]), x[0] - x[1] - (y[0] + y[1]))

    A, B, C = groups
    for x, y in ((A, B), (A, C), (B, C)):
        um = pow10(min(x[2], y[2]))
        if -um < gap(x, y) < um:
            errs.append(f"intervals {x} and {y} touch or overlap by less than one unit")
    truth = {(True, True): "B e C", (True, False): "solo B", (False, True): "solo C", (False, False): "né B né C"}[(gap(A, B) < 0, gap(A, C) < 0)]
    ans = sample["answer"]
    texts = [o["latex"] for o in ans["options"]]
    if sorted(texts) != sorted(f"\\text{{{t}}}" for t in LEVEL6) or [o["values"] for o in ans["options"]] != [[t[6:-1]] for t in texts]:
        errs.append(f"the four options are not the fixed ones: {texts}")
    idx = ans.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < 4 or ans["options"][idx]["values"] != [truth]:
        errs.append(f"right option is not {truth!r}")
    if sample["solution"] != f"\\text{{{truth}}}":
        errs.append("solution does not say the answer")
    return truth


# ---------------------------------------------------------------------------

LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    for field in [sample.get("prompt", ""), sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")
    try:
        kind = LEVELS[lvl](sample, errs)
    except Bad as e:
        return errs + [str(e)], None
    return errs, kind
