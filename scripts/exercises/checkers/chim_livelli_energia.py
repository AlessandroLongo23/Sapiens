"""Checker for chim-livelli-energia (specs/exercises/chim-livelli-energia.md), written from the spec and the lesson
50-chim-livelli-energia.md, not from the generator.

The successive ionisation energies are the table of the spec (kJ/mol). The jump is looked for here as the largest
ratio between an energy and the one before; the electrons level by level come from filling 1s, 2s, 2p, 3s, 3p, 4s in
this order; the order of the sublevels is rebuilt with the rule of n + l, which gives the sequence of the lesson.
"""
import json
import re
from fractions import Fraction as F
from pathlib import Path

from checkers._chim3_a import check_choice, check_number, choice_of, common, need, prose, right_value

CASE_RANGES = {
    2: {"elemento": (0.2, 0.47), "disposizione": (0.2, 0.47), "ione": (0.2, 0.47)},
    3: {"livello": (0.15, 0.35), "sottolivello": (0.15, 0.35), "sottolivelli": (0.15, 0.35), "somma": (0.15, 0.35)},
    4: {"esiste": (0.15, 0.35), "dopo": (0.15, 0.35), "minore": (0.15, 0.35), "ordine": (0.15, 0.35)},
    5: {"disposizione": (0.5, 0.8), "esterno": (0.2, 0.5)},
}

_ELEMENTS = json.loads((Path(__file__).resolve().parents[3] / "src/lib/tools/elementi.json").read_text(encoding="utf-8"))
SYMBOL = {e["z"]: e["symbol"] for e in _ELEMENTS}
NAME = {e["z"]: e["name"].lower() for e in _ELEMENTS}

# Successive ionisation energies in kJ/mol, as the spec lists them (the elements the exercises show).
IONIZATION = {
    3: [520, 7298, 11815],
    4: [900, 1757, 14849, 21007],
    5: [801, 2427, 3660, 25026, 32827],
    6: [1086, 2353, 4620, 6223, 37831, 47277],
    7: [1402, 2856, 4578, 7475, 9445, 53267, 64360],
    11: [496, 4562, 6910, 9543, 13354, 16613, 20117, 25496],
    12: [738, 1451, 7733, 10543, 13630, 18020, 21711, 25661],
    13: [578, 1817, 2745, 11577, 14842, 18379, 23326, 27465],
    14: [786, 1577, 3232, 4356, 16091, 19805, 23780, 29287],
    15: [1012, 1907, 2914, 4964, 6274, 21267, 25431, 29872],
    19: [419, 3052, 4420, 5877, 7975, 9590, 11343, 14944],
    20: [590, 1145, 4912, 6491, 8153, 10496, 12270, 14206],
}

CAPACITY = {"s": 2, "p": 6, "d": 10, "f": 14}
LETTERS = "spdf"
# All the sublevels up to n = 7 that the elements use, by n + l and then by n: 1s 2s 2p 3s 3p 4s 3d 4p 5s ...
ORDER = sorted((f"{n}{LETTERS[l]}" for n in range(1, 8) for l in range(min(n, 4)) if n + l <= 8), key=lambda s: (int(s[0]) + LETTERS.index(s[1]), int(s[0])))


def exists(name):
    return re.fullmatch(r"\d[spdf]", name) is not None and LETTERS.index(name[1]) < int(name[0])


def by_level(z):
    """The electrons of an element up to calcium level by level, filling 1s 2s 2p 3s 3p 4s."""
    out, left = {}, z
    for sub in ORDER[:6]:
        take = min(left, CAPACITY[sub[1]])
        if take:
            out[int(sub[0])] = out.get(int(sub[0]), 0) + take
        left -= take
    if left:
        raise ValueError(f"Z = {z} beyond calcium")
    return [out[n] for n in sorted(out)]


def fmt(n):
    s = str(n)
    return s if len(s) < 5 else f"{int(s):,}".replace(",", "\\,")


def shown(z, count, text, errs):
    """The first `count` energies of Z must be in the text, in order; returns them."""
    xs = IONIZATION.get(z, [])[:count]
    if len(xs) != count or count < 3:
        errs.append(f"{count} energies of Z = {z} cannot be shown")
        return None
    need(text, ", ".join(f"${fmt(x)}$" for x in xs[:-1]) + f" e ${fmt(xs[-1])}$", errs)
    return xs


def jump(xs, errs):
    """How many electrons come off before the largest ratio; the ratio must stand out from the others."""
    ratios = [F(b, a) for a, b in zip(xs, xs[1:])]
    k = max(range(len(ratios)), key=lambda i: ratios[i])
    rest = [r for i, r in enumerate(ratios) if i != k]
    if rest and ratios[k] < max(rest) * F(13, 10):
        errs.append("the jump does not stand out")
    return k + 1


def outer_from(sample, p, text, errs):
    xs = shown(p["z"], p["count"], text, errs)
    if xs is None:
        return None
    v = jump(xs, errs)
    if v != by_level(p["z"])[-1]:
        errs.append("the jump does not agree with the outer level of the element")
    if p["count"] < v + 2:
        errs.append("too few energies after the jump")
    return v


def level1(sample, p, text, errs):
    v = outer_from(sample, p, text, errs)
    if v is not None:
        if v > 5:
            errs.append("more than five outer electrons: the list is too long")
        check_number(sample, v, errs)
    return "salto"


def level2(sample, p, text, errs):
    case = p["case"]
    v = outer_from(sample, p, text, errs)
    if v is None:
        return case
    z = p["z"]
    if case == "elemento":
        period = len(by_level(z))
        need(text, {2: "secondo periodo", 3: "terzo periodo", 4: "quarto periodo"}[period], errs)
        for o in choice_of(sample).get("options", []):
            if o["values"][0] not in SYMBOL.values():
                errs.append(f"option {o['values'][0]!r} is not an element")
        right_value(sample, SYMBOL[z], errs)
    elif case == "disposizione":
        need(text, f"ha ${z}$ elettroni", errs)
        need(text.lower(), NAME[z], errs)
        right_value(sample, ",".join(str(x) for x in by_level(z)), errs)
        for o in choice_of(sample).get("options", []):
            if o["latex"] != o["values"][0].replace(",", ",\\ "):
                errs.append(f"option {o['latex']!r} not written as its value")
    elif case == "ione":
        if z not in (3, 4, 11, 12, 13, 19, 20):
            errs.append("not a metal")
        right_value(sample, f"{v}+", errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level3(sample, p, text, errs):
    case = p["case"]
    n = p["n"]
    if not 1 <= n <= 5:
        errs.append("n out of range")
    if case == "livello":
        need(text, f"il livello $n = {n}$", errs)
        check_number(sample, 2 * n * n, errs)
    elif case == "sottolivello":
        name = f"{n}{p['type']}"
        if not exists(name):
            errs.append(f"the sublevel {name} does not exist")
        need(text, f"il sottolivello ${name}$", errs)
        check_number(sample, CAPACITY[p["type"]], errs)
    elif case == "sottolivelli":
        need(text, f"Quanti sottolivelli ha il livello $n = {n}$?", errs)
        check_number(sample, n, errs)
    elif case == "somma":
        names = [f"{n}{t}" for t in p["types"]]
        if len(names) < 2 or any(not exists(x) for x in names):
            errs.append("sublevels that do not exist")
        need(text, ", ".join(f"${x}$" for x in names[:-1]) + f" e ${names[-1]}$", errs)
        check_number(sample, sum(CAPACITY[t] for t in p["types"]), errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level4(sample, p, text, errs):
    case = p["case"]
    ch = choice_of(sample)
    if case == "esiste":
        need(text, "non esiste?" if p["wantFake"] else "sottolivelli esiste?", errs)
        check_choice(ch, lambda o: exists(o["latex"]) is (not p["wantFake"]), errs)
    elif case == "dopo":
        cur = p["after"]
        need(text, f"subito dopo il ${cur}$", errs)
        right_value(sample, ORDER[ORDER.index(cur) + 1], errs)
        for o in ch.get("options", []):
            if not exists(o["latex"]):
                errs.append(f"option {o['latex']!r} does not exist")
    elif case == "minore":
        a, b = p["a"], p["b"]
        need(text, f"${a}$ oppure ${b}$", errs)
        need(text, "più bassa" if p["lower"] else "più alta", errs)
        low, high = sorted((a, b), key=ORDER.index)
        right_value(sample, low if p["lower"] else high, errs)
    elif case == "ordine":
        three = p["three"]
        need(text, f"${three[0]}$, ${three[1]}$ e ${three[2]}$", errs)
        if len(set(three)) != 3 or any(not exists(x) for x in three):
            errs.append("three different sublevels that exist are needed")
        right_value(sample, "<".join(sorted(three, key=ORDER.index)), errs)
    else:
        errs.append(f"unknown case {case}")
    return case


def level5(sample, p, text, errs):
    case = p["case"]
    z = p["z"]
    if not 3 <= z <= 20:
        errs.append("Z out of range")
        return case
    need(text, f"ha ${z}$ elettroni", errs)
    need(text.lower(), NAME[z], errs)
    s = by_level(z)
    if case == "disposizione":
        right_value(sample, ",".join(str(x) for x in s), errs)
        for o in choice_of(sample).get("options", []):
            if sum(int(x) for x in o["values"][0].split(",")) not in (z, z + 1, z - 1):
                errs.append(f"option {o['values'][0]!r} has a strange number of electrons")
    elif case == "esterno":
        need(text, "nel livello più esterno", errs)
        right_value(sample, str(s[-1]), errs)
    else:
        errs.append(f"unknown case {case}")
    return case


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}
NUMBER_LEVELS = (1, 3)


def check(sample):
    errs = []
    common(sample, errs)
    level = LEVELS.get(sample.get("level"))
    if not level:
        return errs + [f"unknown level {sample.get('level')}"], None
    if (sample["answer"]["kind"] == "number") != (sample["level"] in NUMBER_LEVELS):
        errs.append("levels 1 and 3 are answered with a number, the others with a choice")
    case = level(sample, sample["params"], prose(sample), errs)
    return errs, case
