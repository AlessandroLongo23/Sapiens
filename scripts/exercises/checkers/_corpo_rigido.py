"""Helpers shared by the checkers of rigid bodies and levers (physics, first year, group 7): fis_momento_forza,
fis_equilibrio_corpo_rigido, fis_leve, fis_baricentro. Written from docs/lezioni/fisica/README.md and the four specs,
not from the generators: numbers as the lessons write them (decimal comma {,}, thin space before the unit, N·m as
\\,\\text{N} \\cdot \\text{m}, degrees as ^\\circ); a value rounded to two significant figures, except an integer with at
least two digits, which is written whole (600 N); the options of a value written like the answer.
"""
import re

from sympy import Rational, floor

from checkers.forze_comune import BANNED, exponent, fixed, fmt_exact, fmt_sig, is_tie, n_decimals, parse_num, prose, round_sig  # noqa: F401

UNIT = {"N": r"\,\text{N}", "m": r"\,\text{m}", "cm": r"\,\text{cm}", "kg": r"\,\text{kg}", "Nm": r"\,\text{N} \cdot \text{m}", "deg": r"^\circ"}
UNIT_TEXT = {"N": "N", "m": "m", "cm": "cm", "kg": "kg", "Nm": "N·m", "deg": "°"}
NUM = r"(?:\d{1,3}(?:\\,\d{3})+|\d+)(?:\{,\}\d+)?"


def whole(r, fmt):
    r = Rational(r)
    return fmt["kind"] == "int" or (r.q == 1 and exponent(r) >= fmt["s"] - 1)


def shown(r, fmt):
    """The value a written number stands for: r itself when written whole, else r rounded."""
    return Rational(r) if whole(r, fmt) else round_sig(r, fmt["s"])


def write(r, fmt):
    r = Rational(r)
    return fmt_exact(r) if whole(r, fmt) else fmt_sig(r, fmt["s"])


def with_unit(num, unit):
    return f"{num}{UNIT[unit]}"


def like_answer(m, answer, fmt):
    m = Rational(m)
    answer = Rational(answer)
    digits = len(str(answer.p).rstrip("0")) if answer.q == 1 else 0
    if fmt["kind"] == "int":
        r = round_sig(m, max(2, digits))
        return r if r.q == 1 else Rational(int(floor(r + Rational(1, 2))))
    return round_sig(m, max(fmt["s"], digits))


def match(rx, s):
    """Full match of a template where {N}, {NM}, {M}, {CM}, {KG} are a number between dollars with that unit, {V} a bare
    number between dollars, {A} an angle in degrees between dollars, {W} a word."""
    units = {"NM": "Nm", "N": "N", "M": "m", "CM": "cm", "KG": "kg"}
    parts = re.split(r"\{(NM|N|M|CM|KG|V|A|W)\}", rx)
    pat = ""
    for i, part in enumerate(parts):
        if i % 2 == 0:
            pat += re.escape(part)
        elif part in units:
            pat += r"\$(" + NUM + r")" + re.escape(UNIT[units[part]]) + r"\$"
        elif part == "V":
            pat += r"\$(" + NUM + r")\$"
        elif part == "A":
            pat += r"\$(\d+)\^\\circ\$"
        else:
            pat += r"([A-Za-zàèéìòù']+)"
    m = re.fullmatch(pat, s)
    return m.groups() if m else None


def num(s):
    return parse_num(s)


def expect_value(errs, sample, truth, unit, fmt, near_tie=None):
    """The answer is truth written with fmt; four options, distinct, each written like the answer; near_tie is a
    float distance from a rounding boundary (in units of the last kept figure) under which the value is refused."""
    p = sample.get("params", {})
    if p.get("format") != fmt or p.get("unit") != unit:
        errs.append(f"format/unit {p.get('format')} {p.get('unit')} != {fmt} {unit}")
    if not whole(truth, fmt):
        if near_tie is not None:
            e = exponent(truth)
            x = float(truth) / 10 ** (e - fmt["s"] + 1)
            if abs(x - int(x) - 0.5) < near_tie:
                errs.append(f"{float(truth)} too close to a rounding boundary")
        elif is_tie(truth, fmt["s"]):
            errs.append(f"{truth} is a tie")
    want = shown(truth, fmt)
    ans = sample["answer"]
    if ans.get("kind") != "number" or Rational(ans.get("value", "x")) != want:
        errs.append(f"answer {ans.get('value')} != {want}")
        return
    ch = sample.get("choice")
    if not ch:
        errs.append("no choice")
        return
    opts = ch["options"]
    vals = [Rational(o["values"][0]) for o in opts]
    if len(opts) != 4 or len(set(vals)) != 4 or len({o["latex"] for o in opts}) != 4:
        errs.append("choice needs four distinct options")
    if vals[ch["correct"]] != want or vals.count(want) != 1:
        errs.append("choice.correct is not the answer")
    for o, v in zip(opts, vals):
        if v <= 0:
            errs.append(f"option {v} not positive")
            continue
        if v != want and like_answer(v, want, fmt) != v:
            errs.append(f"option {v} not written like the answer")
        w = with_unit(write(v, fmt), unit)
        if o["latex"] != w:
            errs.append(f"option latex {o['latex']!r} != {w!r}")


def expect_words(errs, sample, right, allowed, count):
    """A choice between words: the answer's correct option has key `right`, the options are `count` distinct keys of
    `allowed` (key -> text), written as \\text{text}."""
    for field in ("answer", "choice"):
        ch = sample.get(field)
        if not ch or ch.get("kind") != "choice":
            errs.append(f"{field} is not a choice")
            continue
        keys = [o["values"][0] for o in ch["options"]]
        if len(keys) != count or len(set(keys)) != count:
            errs.append(f"{field}: {count} distinct options needed, got {keys}")
        if keys[ch["correct"]] != right:
            errs.append(f"{field}: correct is {keys[ch['correct']]}, truth {right}")
        for o in ch["options"]:
            k = o["values"][0]
            if k not in allowed or o["latex"] != rf"\text{{{allowed[k]}}}":
                errs.append(f"{field}: option {o} unexpected")


def common(sample):
    errs = []
    for field in [sample["problem"], sample["solution"], *sample["steps"]]:
        if BANNED.search(field):
            errs.append("banned words")
    if not sample.get("steps"):
        errs.append("no steps")
    return errs


def scene_of(errs, sample, key="scene"):
    sc = sample.get(key)
    if not sc or sc.get("type") != "asta-forze":
        errs.append(f"{key}: no asta-forze")
        return None
    if not sc.get("alt"):
        errs.append(f"{key}: no alt")
    return sc["data"]


def text_of(r, unit, fmt):
    """A value as the scene writes it: '0,40 m', '45 N'."""
    return f"{write(r, fmt).replace('{,}', ',').replace(chr(92) + ',', ' ')} {UNIT_TEXT[unit]}"


def close(a, b, tol=1e-3):
    return abs(float(a) - float(b)) <= tol
