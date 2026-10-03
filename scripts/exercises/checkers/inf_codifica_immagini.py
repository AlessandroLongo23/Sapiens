"""Checker for inf-codifica-immagini (specs/exercises/inf-codifica-immagini.md).

Written from the spec. Width, height, depth, colours and memory are read back from the text and compared with
params; sizes are computed in bits with exact fractions (pixels times bits per pixel), then turned into the unit
of the question with the factor the text states; the colour of an RGB triple is decided from which components are
on, not from a table of names.
"""
import re
from fractions import Fraction

from checkers._inf_codifica import NUM, check_number, check_text_choice, common, option_text, parse_num, prose_and_extra

CASE_RANGES = {
    2: {"colori": (0.33, 0.47), "bit": (0.53, 0.67)},
    4: {"1-4 bit": (0.13, 0.27), "8-32 bit": (0.73, 0.87)},
    5: {u: (0.18, 0.32) for u in ("kB", "MB", "KiB", "MiB")},
    6: {"quante foto": (0.42, 0.58), "profondità": (0.42, 0.58)},
}

COLOURS = ["rosso", "verde", "blu", "giallo", "ciano", "magenta", "grigio", "bianco", "nero"]
UNITS = {"kB": 1000, "MB": 1000**2, "KiB": 1024, "MiB": 1024**2}
FACTOR_TEXT = {
    "kB": r"$1\,\text{kB} = 1000\,\text{B}$",
    "MB": r"$1\,\text{MB} = 1\,000\,000\,\text{B}$",
    "KiB": r"$1\,\text{KiB} = 1024\,\text{B}$",
    "MiB": r"$1\,\text{MiB} = 1024 \cdot 1024\,\text{B} = 1\,048\,576\,\text{B}$",
}
SIZE = rf"\$({NUM}) \\times ({NUM})\$"


def num(s):
    return int(parse_num(s))


def same(p, errs, **expected):
    for k, v in expected.items():
        if p.get(k) != v:
            errs.append(f"params.{k} = {p.get(k)!r}, the text says {v!r}")


def level1(sample, prose, errs):
    m = re.fullmatch(rf"Un'immagine raster è larga \$({NUM})\$ pixel e alta \$({NUM})\$ pixel\. Quanti pixel ha in tutto\?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    w, h = num(m.group(1)), num(m.group(2))
    same(sample["params"], errs, w=w, h=h)
    if not (40 <= w <= 1200 and 30 <= h <= 900):
        errs.append("image out of range")
    check_number(sample, w * h, errs)
    return None


def level2(sample, prose, errs):
    p = sample["params"]
    m = re.fullmatch(r"Un'immagine usa \$(\d+)\$ bit per ogni pixel\. Quanti colori diversi può avere un pixel\?", prose)
    if m:
        n = int(m.group(1))
        same(p, errs, case="colori", n=n)
        if not 1 <= n <= 24:
            errs.append("depth out of range")
        check_number(sample, 2**n, errs)
        return "colori"
    m = re.fullmatch(rf"Un'immagine deve poter mostrare \$({NUM})\$ colori diversi\. Quanti bit per pixel servono, come minimo\?", prose)
    if not m:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    colours = num(m.group(1))
    same(p, errs, case="bit", colours=colours)
    if not 2 <= colours <= 5000:
        errs.append("colours out of range")
    # the shortest binary writing of the largest index, colours - 1
    n = max(1, (colours - 1).bit_length())
    check_number(sample, n, errs)
    return "bit"


def colour_of(r, g, b):
    if r == g == b:
        return "nero" if r == 0 else "bianco" if r == 255 else "grigio"
    on = tuple(x > 0 for x in (r, g, b))
    if len({x for x in (r, g, b) if x > 0}) != 1:
        raise ValueError("components on at different levels")
    return {
        (True, False, False): "rosso",
        (False, True, False): "verde",
        (False, False, True): "blu",
        (True, True, False): "giallo",
        (False, True, True): "ciano",
        (True, False, True): "magenta",
    }[on]


def level3(sample, prose, errs):
    m = re.fullmatch(
        r"Un pixel ha colore RGB con R = ([0-9A-F]+), G = ([0-9A-F]+), B = ([0-9A-F]+)(, scritti in esadecimale)?\. Ogni componente va da (0 a 255|00 a FF)\. Di che colore è il pixel\?",
        prose,
    )
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    hexa = m.group(4) is not None
    if hexa != (m.group(5) == "00 a FF"):
        errs.append("the range does not match the base")
    if hexa and any(len(x) != 2 for x in m.group(1, 2, 3)):
        errs.append("hexadecimal components need two digits")
    try:
        rgb = [int(x, 16 if hexa else 10) for x in m.group(1, 2, 3)]
    except ValueError:
        errs.append("components unreadable")
        return None
    if any(not 0 <= x <= 255 for x in rgb):
        errs.append("component out of range")
    if any(0 < x < 96 for x in rgb) and not rgb[0] == rgb[1] == rgb[2]:
        errs.append("a hue too dark to be named")
    p = sample["params"]
    same(p, errs, rgb=rgb, hex=hexa)
    truth = colour_of(*rgb)
    if p.get("case") != truth:
        errs.append(f"params.case {p.get('case')!r}, the colour is {truth!r}")
    check_text_choice(sample, truth, COLOURS, errs)
    if option_text(sample.get("solution", "")) != truth:
        errs.append("solution is not the colour")
    return truth


def image_bits(w, h, depth):
    return Fraction(w * h * depth)


def level4(sample, prose, errs):
    m = re.fullmatch(rf"Un'immagine non compressa di {SIZE} pixel ha una profondità di colore di \$(\d+)\$ bit per pixel\. Quanti byte occupa\?", prose)
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    w, h, depth = num(m.group(1)), num(m.group(2)), int(m.group(3))
    same(sample["params"], errs, w=w, h=h, depth=depth)
    if depth not in (1, 4, 8, 16, 24, 32) or not (20 <= w <= 800 and 10 <= h <= 600):
        errs.append("image out of range")
    size = image_bits(w, h, depth) / 8
    if size.denominator != 1:
        errs.append("the size is not a whole number of bytes")
    check_number(sample, size, errs, "B")
    return "1-4 bit" if depth < 8 else "8-32 bit"


def level5(sample, prose, errs):
    m = re.fullmatch(rf"Un'immagine non compressa di {SIZE} pixel ha una profondità di colore di \$(\d+)\$ bit per pixel\. Quanti (kB|MB|KiB|MiB) occupa\? Usa (.+)\.", prose)
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    w, h, depth, unit = num(m.group(1)), num(m.group(2)), int(m.group(3)), m.group(4)
    if m.group(5) != FACTOR_TEXT[unit]:
        errs.append(f"the factor of {unit} is not stated as in the lesson: {m.group(5)!r}")
    same(sample["params"], errs, w=w, h=h, depth=depth, case=unit)
    if depth not in (8, 16, 24, 32):
        errs.append("depth out of range")
    size = image_bits(w, h, depth) / 8 / UNITS[unit]
    if (size * 100).denominator != 1 or not Fraction(1, 10) <= size < 10000:
        errs.append(f"size {size} {unit}: more than two decimals or out of range")
    if sample.get("prompt") != f"Scrivi la dimensione in {unit}.":
        errs.append("the prompt names another unit")
    check_number(sample, size, errs, unit)
    return unit


def level6(sample, prose, errs):
    p = sample["params"]
    m = re.fullmatch(
        rf"Una scheda di memoria ha \$(\d+)\\,\\text\{{GB\}}\$ liberi\. Quante foto non compresse di {SIZE} pixel, a \$24\$ bit per pixel, ci stanno\? Usa \$1\\,\\text\{{MB\}} = 1\\,000\\,000\\,\\text\{{B\}}\$ e \$1\\,\\text\{{GB\}} = 1000\\,\\text\{{MB\}}\$\.",
        prose,
    )
    if m:
        gb, w, h = int(m.group(1)), num(m.group(2)), num(m.group(3))
        same(p, errs, case="quante foto", gb=gb, w=w, h=h)
        if not 1 <= gb <= 64:
            errs.append("memory out of range")
        photo = image_bits(w, h, 24) / 8
        if (photo / 10**6).denominator != 1:
            errs.append("a photo is not a whole number of MB")
        count = (gb * 10**9) // photo
        if count < 1:
            errs.append("no photo fits")
        check_number(sample, count, errs)
        return "quante foto"
    m = re.fullmatch(rf"Un'immagine non compressa di {SIZE} pixel occupa \$({NUM})\\,\\text\{{B\}}\$\. Qual è la sua profondità di colore, in bit per pixel\?", prose)
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    w, h, size = num(m.group(1)), num(m.group(2)), num(m.group(3))
    same(p, errs, case="profondità", w=w, h=h, bytes=size)
    depth = Fraction(size * 8, w * h)
    if depth not in (1, 4, 8, 16, 24, 32):
        errs.append(f"depth {depth} is not one of the lesson")
    check_number(sample, depth, errs)
    return "profondità"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    fn = LEVELS.get(sample["level"])
    if not fn:
        return [f"unknown level {sample['level']}"], None
    prose, extra = prose_and_extra(sample["problem"])
    if extra:
        errs.append("unexpected formula line")
    kind = fn(sample, prose, errs)
    return errs, kind
