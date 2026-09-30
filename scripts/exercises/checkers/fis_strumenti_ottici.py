"""Checker for fis-strumenti-ottici (specs/exercises/fis-strumenti-ottici.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/37-fis-strumenti-ottici.md). Every quantity is
recomputed with exact rationals and rounded to two significant figures half up, refusing values at a boundary.
"""
import re

from sympy import Rational

from checkers._vettori import check_choice, common, fmt_exact, prose, round_sig

CASE_RANGES = {
    1: {"cannocchiale": (0.23, 0.43), "lunghezza": (0.23, 0.43), "microscopio": (0.23, 0.43)},
    4: {"distanza": (0.40, 0.60), "spostamento": (0.40, 0.60)},
}
NUM = r"(\d+(?:\{,\}\d+)?)"


def num(s):
    return Rational(s.replace("{,}", "."))


def sig2(x):
    r = round_sig(x, 2)
    if r is None:
        raise ValueError(f"{x} at a rounding boundary")
    return r


def unit_options(sample, errs, pattern):
    for o in sample["answer"]["options"]:
        if not re.fullmatch(pattern, o["latex"]):
            errs.append(f"option {o['latex']!r}")


def length(value, unit, errs):
    """A length of the text in metres; data in metres need at least two significant figures."""
    x = num(value)
    if unit == "m":
        if "{,}" not in value:
            errs.append(f"datum {value} m without two significant figures")
        return x
    return x / 100


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in range(1, 7):
        return [f"unknown level {lvl}"], None
    common(sample, errs)
    kind = None
    D = r"-?\d+(\{,\}\d+)?\\,\\text\{D\}"
    try:
        s = prose(sample["problem"])
        if lvl == 1:
            m = re.fullmatch(r"Un microscopio ha un obiettivo che ingrandisce \$(\d+)\$ volte e un oculare che ingrandisce \$(\d+)\$ volte\. Quante volte ingrandisce il microscopio\?", s)
            if m:
                check_choice(sample, errs, f"{int(m.group(1)) * int(m.group(2))}\\ \\text{{volte}}")
                unit_options(sample, errs, r"\d+(\{,\}\d+)?\\ \\text\{volte\}")
                kind = "microscopio"
            else:
                m = re.fullmatch(r"Un cannocchiale astronomico ha l'obiettivo con distanza focale \$" + NUM + r"\\,\\text\{cm\}\$ e l'oculare con distanza focale \$" + NUM + r"\\,\\text\{cm\}\$\. (Quanto vale il suo ingrandimento\?|Quanto distano le due lenti\?)", s)
                if not m:
                    return errs + [f"level 1 text: {s!r}"], None
                fob, foc = num(m.group(1)), num(m.group(2))
                if not (40 <= fob <= 150 and Rational(1, 2) <= foc <= 5):
                    errs.append("focal lengths")
                if m.group(3).startswith("Quanto vale"):
                    G = fob / foc
                    if G.q != 1 or not 10 <= G <= 200:
                        errs.append("magnification not a whole number from 10 to 200")
                    check_choice(sample, errs, f"G = {G}")
                    unit_options(sample, errs, r"G = \d+(\{,\}\d+)?")
                    kind = "cannocchiale"
                else:
                    check_choice(sample, errs, f"{fmt_exact(fob + foc)}\\,\\text{{cm}}")
                    unit_options(sample, errs, r"\d+(\{,\}\d+)?\\,\\text\{cm\}")
                    kind = "lunghezza"
        elif lvl == 2:
            m = re.fullmatch(r"Un ragazzo miope vede nitido senza occhiali solo fino a \$" + NUM + r"\\,\\text\{(m|cm)\}\$\. Che potere devono avere le lenti che correggono la sua miopia\? Trascura la distanza tra le lenti e l'occhio\.", s)
            if not m:
                return errs + [f"level 2 text: {s!r}"], None
            d = length(m.group(1), m.group(2), errs)
            if not Rational(1, 5) <= d <= 5:
                errs.append("far point range")
            check_choice(sample, errs, f"{sig2(-1 / d)}\\,\\text{{D}}")
            unit_options(sample, errs, D)
        elif lvl == 3:
            m = re.fullmatch(r"Una ragazza ipermetrope ha il punto prossimo a \$" + NUM + r"\\,\\text\{(m|cm)\}\$\. Che potere devono avere le lenti per leggere un libro a \$25\\,\\text\{cm\}\$\? Trascura la distanza tra le lenti e l'occhio\.", s)
            if not m:
                return errs + [f"level 3 text: {s!r}"], None
            d = length(m.group(1), m.group(2), errs)
            if not Rational(2, 5) <= d <= Rational(5, 2):
                errs.append("near point range")
            check_choice(sample, errs, f"{sig2(4 - 1 / d)}\\,\\text{{D}}")
            unit_options(sample, errs, D)
        elif lvl == 4:
            m = re.fullmatch(r"L'obiettivo di una macchina fotografica ha la distanza focale di \$(\d+)\\,\\text\{mm\}\$(?: ed è a fuoco sugli oggetti lontanissimi\. Di quanto deve allontanarsi dal sensore per mettere a fuoco una persona a|\. A che distanza dal sensore deve stare per fotografare una persona a) \$" + NUM + r"\\,\\text\{m\}\$\?", s)
            if not m:
                return errs + [f"level 4 text: {s!r}"], None
            f = Rational(m.group(1))
            p = length(m.group(2), "m", errs) * 1000
            if f not in (35, 50, 85, 100) or not 1000 <= p <= 5000:
                errs.append("camera data")
            q = 1 / (1 / f - 1 / p)
            shift = "allontanarsi" in s
            check_choice(sample, errs, f"{sig2(q - f if shift else q)}\\,\\text{{mm}}")
            unit_options(sample, errs, r"\d+(\{,\}\d+)?\\,\\text\{mm\}")
            kind = "spostamento" if shift else "distanza"
        elif lvl == 5:
            m = re.fullmatch(r"Con una lente d'ingrandimento (?:da \$(\d+)\\,\\text\{D\}\$|con distanza focale \$" + NUM + r"\\,\\text\{cm\}\$) (vuoi vedere l'immagine di un francobollo a \$25\\,\\text\{cm\}\$ dalla lente, dalla parte del francobollo\. A che distanza dalla lente lo metti\?|guardi un francobollo, messo in modo che l'immagine si formi a \$25\\,\\text\{cm\}\$ dalla lente, dalla parte del francobollo\. Quanto vale l'ingrandimento \$G\$\?)", s)
            if not m:
                return errs + [f"level 5 text: {s!r}"], None
            f = 100 / Rational(m.group(1)) if m.group(1) else num(m.group(2))
            if f not in {Rational(5, 2), 5, 10, Rational(25, 2), 25}:
                errs.append("focal length")
            q = Rational(-25)
            p = 1 / (1 / f - 1 / q)
            if m.group(3).startswith("vuoi"):
                check_choice(sample, errs, f"{sig2(p)}\\,\\text{{cm}}")
                unit_options(sample, errs, r"\d+(\{,\}\d+)?\\,\\text\{cm\}")
            else:
                check_choice(sample, errs, f"G = {sig2(-q / p)}")
                unit_options(sample, errs, r"G = -?\d+(\{,\}\d+)?")
            so = sample.get("solutionScene", {})
            d = so.get("data", {})
            if so.get("type") != "lente-oggetto" or d.get("q") != -25 or Rational(str(d.get("f"))) != f or abs(Rational(str(d.get("p"))) - p) > Rational(1, 500) or not d.get("raggi"):
                errs.append(f"solution scene {d}")
            if sample.get("scene"):
                errs.append("level 5 has no problem scene")
        else:
            m = re.fullmatch(r"Nel modello semplificato della lezione la lente dell'occhio sta a \$1\{,\}7\\,\\text\{cm\}\$ dalla retina\. Quanto vale il potere dell'occhio mentre guarda nitido un oggetto a \$" + NUM + r"\\,\\text\{(m|cm)\}\$\?", s)
            if not m:
                return errs + [f"level 6 text: {s!r}"], None
            d = length(m.group(1), m.group(2), errs)
            P = 1 / d + 1 / Rational(17, 1000)
            right = sig2(P)
            if right == sig2(1 / Rational(17, 1000)):
                errs.append("same power as for a far object")
            check_choice(sample, errs, f"{right}\\,\\text{{D}}")
            unit_options(sample, errs, D)
    except (ValueError, ZeroDivisionError) as e:
        return errs + [str(e)], None
    return errs, kind
