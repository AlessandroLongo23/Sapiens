"""Checker for inf-audio-video (specs/exercises/inf-audio-video.md).

Written from the spec. Every level is a multiple choice of text. The numbers of an exercise are read back from its
text and compared with params; the answer is worked out again here with exact fractions, and the right option must
be that amount, in the unit the level asks for. No wrong option may be worth the same.
"""
import re
from fractions import Fraction

from checkers._inf_codice import choice_of, common

CASE_RANGES = {
    1: {"mono": (0.42, 0.58), "stereo": (0.42, 0.58)},
    2: {"minuti": (0.42, 0.58), "minuti e secondi": (0.42, 0.58)},
    3: {"fotogramma": (0.19, 0.31), "secondo": (0.69, 0.81)},
    4: {"scritti": (0.53, 0.67), "risparmio": (0.33, 0.47)},
    5: {"parole": (0.14, 0.26), "versione": (0.33, 0.47), "dati": (0.33, 0.47)},
}

RATES = {8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000, 64000, 88200, 96000}
DEPTHS = {8, 12, 16, 20, 24}
AUDIO_BITRATES = {64, 96, 128, 160, 192, 256, 320}
VIDEO_BITRATES = {1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 25}
FPS = {10, 12, 15, 20, 24, 25, 30, 50, 60}
# which term each description of level 5 is about, by a few words that only that description has
TERMS = {
    "bitrate": ["quanti bit servono", "lo sceglie chi salva", "diviso per 8 dà i byte"],
    "codec": ["compresso e poi ricostruito", "lo schermo resta nero", "averne dentro due diversi"],
    "contenitore": ["tiene insieme le immagini", "l’estensione di un file video dice"],
    "chiave": ["scritto per intero", "riparte dal più vicino", "Non dipende dai fotogrammi precedenti"],
    "fotogramma": ["immagini ferme"],
    "streaming": ["riprodotto mentre arriva", "più veloce del bitrate"],
    "fps": ["quante immagini del video passano", "Al cinema vale 24"],
}

NUM = r"\d[\d ]*(?:,\d+)?"


def num(text):
    """A number as the exercises write it: narrow spaces between the thousands, a comma for the decimals."""
    return Fraction(text.replace(" ", "").replace(",", "."))


def right_amount(sample, truth, unit, errors):
    """The right option is `truth` in `unit`, and no other option is worth the same."""
    choice = choice_of(sample)
    for i, option in enumerate(choice["options"]):
        m = re.fullmatch(rf"({NUM}) {re.escape(unit)}", option["latex"])
        if not m:
            errors.append(f"option {i} is not an amount in {unit}: {option['latex']!r}")
            continue
        shown = num(m.group(1))
        if Fraction(option["values"][0]) != shown:
            errors.append(f"option {i}: label {option['latex']!r} and value {option['values'][0]!r} differ")
        if (shown == truth) != (i == choice["correct"]):
            errors.append(f"option {i} ({option['latex']}): the right amount is {truth} {unit}")
    if sample["solution"] != choice["options"][choice["correct"]]["latex"]:
        errors.append("the solution is not the right option")


def same(params, errors, **expected):
    for key, v in expected.items():
        if params.get(key) != v:
            errors.append(f"params.{key} = {params.get(key)!r}, the text says {v!r}")


def level1(sample, errors):
    p = sample["params"]
    m = re.fullmatch(rf"Un suono non compresso è (mono \(1 canale\)|stereo \(2 canali\)), con frequenza di campionamento ({NUM}) Hz e (\d+) bit per campione\. Qual è il suo bitrate\? Usa 1 kbit/s = 1000 bit/s\.", sample["problem"])
    if not m:
        return errors.append(f"level 1 text not recognised: {sample['problem']!r}")
    ch = 2 if m.group(1).startswith("stereo") else 1
    f, depth = int(num(m.group(2))), int(m.group(3))
    same(p, errors, f=f, depth=depth, ch=ch, case="stereo" if ch == 2 else "mono")
    if f not in RATES or depth not in DEPTHS:
        errors.append("rate or depth out of range")
    truth = Fraction(f * depth * ch, 1000)
    if (truth * 1000).denominator != 1:
        errors.append("more than three decimals")
    right_amount(sample, truth, "kbit/s", errors)


def level2(sample, errors):
    p = sample["params"]
    m = re.fullmatch(r"Un brano compresso ha bitrate (\d+) kbit/s e dura (\d+) (minuto|minuti)(?: e (\d+) secondi)?\. Quanto occupa il file\? Usa 1 kbit = 1000 bit e 1 kB = 1000 B\.", sample["problem"])
    if not m:
        return errors.append(f"level 2 text not recognised: {sample['problem']!r}")
    kbit, minutes, seconds = int(m.group(1)), int(m.group(2)), int(m.group(4) or 0)
    if (m.group(3) == "minuto") != (minutes == 1):
        errors.append("minuto / minuti")
    same(p, errors, kbit=kbit, minutes=minutes, seconds=seconds, case="minuti e secondi" if seconds else "minuti")
    if kbit not in AUDIO_BITRATES or not 1 <= minutes <= 9 or seconds not in (0, 15, 30, 45):
        errors.append("bitrate or duration out of range")
    truth = Fraction(kbit * (minutes * 60 + seconds), 8)
    if truth.denominator != 1:
        errors.append("the size is not a whole number of kB")
    right_amount(sample, truth, "kB", errors)


def level3(sample, errors):
    p = sample["params"]
    m = re.fullmatch(r"Un video non compresso ha fotogrammi di (\d+) × (\d+) pixel, a 24 bit per pixel, e ne mostra (\d+) al secondo\. Quanti byte occupa (un solo fotogramma|un secondo di video)\?", sample["problem"])
    if not m:
        return errors.append(f"level 3 text not recognised: {sample['problem']!r}")
    w, h, fps = int(m.group(1)), int(m.group(2)), int(m.group(3))
    case = "fotogramma" if m.group(4).startswith("un solo") else "secondo"
    same(p, errors, w=w, h=h, fps=fps, case=case)
    if fps not in FPS or not (160 <= w <= 3840 and 120 <= h <= 2160 and w > h):
        errors.append("size or frames per second out of range")
    frame = w * h * 24 // 8
    right_amount(sample, Fraction(frame if case == "fotogramma" else frame * fps), "B", errors)


def level4(sample, errors):
    p = sample["params"]
    m = re.fullmatch(
        r"Un video ha (\d+) fotogrammi di (\d+) × (\d+) pixel\. (Solo il primo è un fotogramma chiave|(\d+) sono fotogrammi chiave), scritti per intero; di ognuno degli altri si scrivono solo i pixel cambiati rispetto al precedente, che sono (\d+)\. (Quanti pixel si scrivono in tutto\?|Quanti pixel in meno si scrivono rispetto a scrivere per intero tutti i fotogrammi\?)",
        sample["problem"],
    )
    if not m:
        return errors.append(f"level 4 text not recognised: {sample['problem']!r}")
    frames, w, h = int(m.group(1)), int(m.group(2)), int(m.group(3))
    keys = int(m.group(5)) if m.group(5) else 1
    changed = int(m.group(6))
    case = "scritti" if m.group(7).endswith("in tutto?") else "risparmio"
    same(p, errors, frames=frames, w=w, h=h, keys=keys, changed=changed, case=case)
    if not (6 <= frames <= 20 and 1 <= keys <= 3 and 2 <= changed <= 30 and changed * 6 <= w * h):
        errors.append("frames, key frames or changed pixels out of range")
    if m.group(5) == "1":
        errors.append("one key frame is said in words")
    # frame by frame, as the figure of the lesson counts
    written = sum(w * h if i < keys else changed for i in range(frames))
    truth = written if case == "scritti" else frames * w * h - written
    right_amount(sample, Fraction(truth), "pixel", errors)


def level5(sample, errors):
    p = sample["params"]
    choice = choice_of(sample)
    options = choice["options"]
    case = p.get("case")
    if case == "parole":
        about = [term for term, marks in TERMS.items() if any(mark in sample["problem"] for mark in marks)]
        if len(about) != 1 or not sample["problem"].endswith(" Di che cosa si parla?"):
            return errors.append(f"the description is about {about}: {sample['problem']!r}")
        same(p, errors, term=about[0])
        if options[choice["correct"]]["values"] != [about[0]]:
            errors.append(f"the right option is not {about[0]}")
        if not all(o["values"][0] in TERMS for o in options):
            errors.append("an option is not a term of the lesson")
        return
    if case == "versione":
        m = re.fullmatch(r"Un video è disponibile in quattro versioni, a (\d+), (\d+), (\d+) e (\d+) Mbit/s\. La tua connessione arriva a (\d+) Mbit/s\. Qual è la versione di qualità più alta che vedi in streaming senza interruzioni\?", sample["problem"])
        if not m:
            return errors.append(f"level 5 text not recognised: {sample['problem']!r}")
        versions, speed = [int(m.group(i)) for i in range(1, 5)], int(m.group(5))
        same(p, errors, versions=versions, speed=speed)
        if versions != sorted(set(versions)) or not set(versions) <= VIDEO_BITRATES or speed in versions:
            errors.append("four different versions in order, and a speed that is none of them")
        holding = [b for b in versions if b < speed]
        if not holding:
            return errors.append("no version holds")
        if sorted(int(o["values"][0]) for o in options) != versions:
            errors.append("the options are not the four versions")
        for i, o in enumerate(options):
            if o["latex"] != f"quella a {o['values'][0]} Mbit/s":
                errors.append(f"option {i}: label and value differ")
        if int(options[choice["correct"]]["values"][0]) != max(holding):
            errors.append(f"the best version that holds is {max(holding)}")
        return
    m = re.fullmatch(r"Guardi in streaming (\d+) minuti di un video con bitrate (\d+) Mbit/s\. Quanti dati consumi\? Usa 1 Mbit = 1 000 000 bit e 1 MB = 1 000 000 B\.", sample["problem"])
    if not m or case != "dati":
        return errors.append(f"level 5 text not recognised: {sample['problem']!r}")
    minutes, mbit = int(m.group(1)), int(m.group(2))
    same(p, errors, minutes=minutes, mbit=mbit)
    if mbit not in VIDEO_BITRATES or not 2 <= minutes <= 120:
        errors.append("bitrate or minutes out of range")
    truth = Fraction(mbit * minutes * 60, 8)
    if (truth * 10).denominator != 1:
        errors.append("more than one decimal")
    right_amount(sample, truth, "MB", errors)


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5}


def check(sample):
    errors = common(sample)
    if "program" in sample["params"]:
        errors.append("a level of counts has no program")
    check_level = LEVELS.get(sample["level"])
    if not check_level:
        return errors + [f"unknown level {sample['level']}"], None
    if choice_of(sample):
        check_level(sample, errors)
    return errors, sample["params"].get("case")
