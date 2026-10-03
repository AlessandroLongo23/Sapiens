"""Checker for inf-codifica-suoni (specs/exercises/inf-codifica-suoni.md).

Written from the spec. Rate, duration, bits per sample, channels and memory are read back from the text (rates in
hertz or kilohertz, durations in seconds or minutes) and compared with params; every size is computed in bits with
exact fractions, then turned into the unit of the question with the factor the text states.
"""
import re
from fractions import Fraction

from checkers._inf_codifica import NUM, check_number, common, parse_num, prose_and_extra

CASE_RANGES = {
    2: {"minima": (0.42, 0.58), "massima": (0.42, 0.58)},
    3: {"livelli": (0.33, 0.47), "bit": (0.53, 0.67)},
    5: {"kB": (0.26, 0.41), "MB": (0.26, 0.41), "KiB": (0.26, 0.41)},
    6: {"kbit al secondo": (0.42, 0.58), "durata": (0.42, 0.58)},
}

RATES = [8000, 11025, 16000, 22050, 32000, 44100, 48000, 96000]
UNITS = {"kB": 1000, "MB": 1000**2, "KiB": 1024}
FACTOR_TEXT = {
    "kB": r"$1\,\text{kB} = 1000\,\text{B}$",
    "MB": r"$1\,\text{MB} = 1\,000\,000\,\text{B}$",
    "KiB": r"$1\,\text{KiB} = 1024\,\text{B}$",
}
KHZ_RULE = r"$1\,\text{kHz} = 1000\,\text{Hz}$"
FREQ = rf"\$({NUM})\\,\\text\{{(Hz|kHz)\}}\$"
CHANNELS = r"(stereo \(2 canali\)|mono \(1 canale\))"


def hertz(value, unit):
    f = parse_num(value) * (1000 if unit == "kHz" else 1)
    return f


def same(p, errs, **expected):
    for k, v in expected.items():
        if p.get(k) != v:
            errs.append(f"params.{k} = {p.get(k)!r}, the text says {v!r}")


def whole(f, errs):
    if f.denominator != 1:
        errs.append(f"rate {f} is not a whole number of hertz")
    return int(f)


def level1(sample, prose, errs):
    m = re.fullmatch(rf"Un suono viene campionato a {FREQ} per \$(\d+)\$ secondi, su un solo canale\. Quanti campioni si ottengono\?( Ricorda: (.+)\.)?", prose)
    if not m:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    f, t = whole(hertz(m.group(1), m.group(2)), errs), int(m.group(3))
    in_khz = m.group(2) == "kHz"
    if in_khz != (m.group(5) == KHZ_RULE) or (not in_khz and m.group(4)):
        errs.append("the kHz factor must be stated exactly when the rate is in kHz")
    same(sample["params"], errs, f=f, t=t, khz=in_khz)
    if f not in RATES or not 2 <= t <= 120:
        errs.append("rate or duration out of range")
    check_number(sample, f * t, errs)
    return None


def level2(sample, prose, errs):
    p = sample["params"]
    m = re.fullmatch(rf"Un suono contiene frequenze fino a {FREQ}\. Qual è la più piccola frequenza di campionamento che permette di registrarlo senza perderle\?", prose)
    if m:
        f, unit = hertz(m.group(1), m.group(2)), m.group(2)
        same(p, errs, case="minima", f=whole(f, errs), khz=unit == "kHz")
        if not 100 <= f <= 24000:
            errs.append("frequency out of range")
        truth = 2 * f
        kind = "minima"
    else:
        m = re.fullmatch(rf"Un registratore campiona a {FREQ}\. Qual è la frequenza più alta che un suono può avere per essere registrato correttamente\?", prose)
        if not m:
            errs.append(f"level 2 text not recognised: {prose!r}")
            return None
        f, unit = hertz(m.group(1), m.group(2)), m.group(2)
        same(p, errs, case="massima", f=whole(f, errs), khz=unit == "kHz")
        if not 4000 <= f <= 96000 or (f / 2).denominator != 1:
            errs.append("rate out of range, or its half is not a whole number of hertz")
        truth = f / 2
        kind = "massima"
    if sample.get("prompt") != f"Scrivi la frequenza in {unit}.":
        errs.append("the prompt names another unit")
    check_number(sample, truth / (1000 if unit == "kHz" else 1), errs, unit)
    return kind


def level3(sample, prose, errs):
    p = sample["params"]
    m = re.fullmatch(r"Ogni campione di un suono è quantizzato con \$(\d+)\$ bit\. Quanti livelli diversi può assumere un campione\?", prose)
    if m:
        n = int(m.group(1))
        same(p, errs, case="livelli", n=n)
        if not 2 <= n <= 24:
            errs.append("bits out of range")
        check_number(sample, 2**n, errs)
        return "livelli"
    m = re.fullmatch(rf"Per quantizzare un suono si vogliono usare almeno \$({NUM})\$ livelli\. Quanti bit per campione servono, come minimo\?", prose)
    if not m:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    levels = int(parse_num(m.group(1)))
    same(p, errs, case="bit", levels=levels)
    if not 3 <= levels <= 70000:
        errs.append("levels out of range")
    check_number(sample, (levels - 1).bit_length(), errs)
    return "bit"


def sound_bits(f, depth, channels, seconds):
    return Fraction(f) * depth * channels * seconds


def level4(sample, prose, errs):
    m = re.fullmatch(
        rf"Una registrazione non compressa dura \$(\d+)\$ secondi, su un solo canale, con frequenza di campionamento {FREQ} e \$(\d+)\$ bit per campione\. Quanti byte occupa\?",
        prose,
    )
    if not m:
        errs.append(f"level 4 text not recognised: {prose!r}")
        return None
    t, f, depth = int(m.group(1)), whole(hertz(m.group(2), m.group(3)), errs), int(m.group(4))
    if m.group(3) != "Hz":
        errs.append("level 4 gives the rate in hertz")
    same(sample["params"], errs, f=f, depth=depth, t=t)
    if f not in RATES[:7] or depth not in (8, 16, 24) or not 2 <= t <= 60:
        errs.append("recording out of range")
    check_number(sample, sound_bits(f, depth, 1, t) / 8, errs, "B")
    return None


def level5(sample, prose, errs):
    m = re.fullmatch(
        rf"Una registrazione non compressa dura \$(\d+)\$ (secondi|minuto|minuti), è {CHANNELS}, con frequenza di campionamento {FREQ} e \$(\d+)\$ bit per campione\. Quanti (kB|MB|KiB) occupa\? Usa (.+?) e (.+)\.",
        prose,
    )
    if not m:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    amount, word = int(m.group(1)), m.group(2)
    if (word == "minuto") != (amount == 1 and word != "secondi"):
        errs.append("minuto / minuti")
    t = amount if word == "secondi" else amount * 60
    ch = 2 if m.group(3).startswith("stereo") else 1
    f, depth, unit = whole(hertz(m.group(4), m.group(5)), errs), int(m.group(6)), m.group(7)
    if m.group(5) != "kHz" or m.group(8) != KHZ_RULE or m.group(9) != FACTOR_TEXT[unit]:
        errs.append("factors not stated as in the lesson")
    same(sample["params"], errs, case=unit, f=f, depth=depth, ch=ch, t=t, minutes=word != "secondi")
    if f not in RATES[:7] or depth not in (8, 16, 24) or not 4 <= t <= 720:
        errs.append("recording out of range")
    size = sound_bits(f, depth, ch, t) / 8 / UNITS[unit]
    if (size * 1000).denominator != 1 or not 1 <= size < 100000:
        errs.append(f"size {size} {unit}: more than three decimals or out of range")
    if sample.get("prompt") != f"Scrivi la dimensione in {unit}.":
        errs.append("the prompt names another unit")
    check_number(sample, size, errs, unit)
    return unit


def level6(sample, prose, errs):
    p = sample["params"]
    m = re.fullmatch(
        rf"Un suono non compresso è {CHANNELS}, con frequenza di campionamento {FREQ} e \$(\d+)\$ bit per campione\. Quanti kbit servono per ogni secondo di suono\? Usa (.+?) e \$1\\,\\text\{{kbit\}} = 1000\\,\\text\{{bit\}}\$\.",
        prose,
    )
    if m:
        ch = 2 if m.group(1).startswith("stereo") else 1
        f, depth = whole(hertz(m.group(2), m.group(3)), errs), int(m.group(4))
        if m.group(3) != "kHz" or m.group(5) != KHZ_RULE:
            errs.append("the kHz factor is not stated")
        same(p, errs, case="kbit al secondo", f=f, depth=depth, ch=ch)
        if f not in RATES[:7] or depth not in (8, 16, 24):
            errs.append("sound out of range")
        check_number(sample, sound_bits(f, depth, ch, 1) / 1000, errs, "kbit/s")
        return "kbit al secondo"
    m = re.fullmatch(
        rf"In una memoria ci sono \$(\d+)\\,\\text\{{MB\}}\$ liberi\. Quanti secondi interi di suono non compresso ci stanno, se il suono è {CHANNELS}, con frequenza di campionamento {FREQ} e \$(\d+)\$ bit per campione\? Usa (.+?) e \$1\\,\\text\{{MB\}} = 1\\,000\\,000\\,\\text\{{B\}}\$\.",
        prose,
    )
    if not m:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    mb = int(m.group(1))
    ch = 2 if m.group(2).startswith("stereo") else 1
    f, depth = whole(hertz(m.group(3), m.group(4)), errs), int(m.group(5))
    if m.group(4) != "kHz" or m.group(6) != KHZ_RULE:
        errs.append("the kHz factor is not stated")
    same(p, errs, case="durata", f=f, depth=depth, ch=ch, mb=mb)
    if f not in RATES[:7] or depth not in (8, 16, 24) or not 1 <= mb <= 700:
        errs.append("sound or memory out of range")
    seconds = (mb * 10**6 * 8) // sound_bits(f, depth, ch, 1)
    if seconds < 1:
        errs.append("not even one second fits")
    check_number(sample, seconds, errs, "s")
    return "durata"


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
