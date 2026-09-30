"""Checker for fis-lenti (specs/exercises/fis-lenti.md).

Written from the spec and the lesson (docs/lezioni/fisica/riscritte/36-fis-lenti.md): 1/p + 1/q = 1/f with exact
rationals, G = -q/p, P = 1/f with f in metres; p > 0, q > 0 real, q < 0 virtual, f < 0 diverging. The scene must not
show what is asked: no image and no rays in the problem, no foci at level 6.
"""
import re

from sympy import Rational

from checkers._vettori import check_choice, common, fmt_exact, prose, round_sig

CASE_RANGES = {
    1: {"potere": (0.40, 0.60), "focale": (0.40, 0.60)},
    3: {"ingrandimento": (0.40, 0.60), "altezza": (0.40, 0.60)},
    6: {"reale": (0.23, 0.43), "virtuale convergente": (0.23, 0.43), "virtuale divergente": (0.23, 0.43)},
}
FOCALS = {Rational(x) for x in ("5", "10", "12.5", "20", "25", "40", "50", "125", "200", "250")}
NUM = r"(-?\d+(?:\{,\}\d+)?)"


def num(s):
    return Rational(s.replace("{,}", "."))


def cm(x):
    return f"{fmt_exact(x)}\\,\\text{{cm}}"


def options(sample, errs, pattern):
    for o in sample["answer"]["options"]:
        if not re.fullmatch(pattern, o["latex"]):
            errs.append(f"option {o['latex']!r}")


def scene(sample, errs, lente, p, f=None, q=None, level6=False):
    sc, so = sample.get("scene"), sample.get("solutionScene")
    if not sc or not so or sc.get("type") != "lente-oggetto" or so.get("type") != "lente-oggetto":
        errs.append("scenes missing")
        return
    d, s = sc["data"], so["data"]
    if d.get("lente") != lente or Rational(str(d.get("p"))) != p:
        errs.append(f"scene lens or object {d}")
    if level6:
        if "f" in d or "raggi" in d or d.get("q") is None or Rational(str(d["q"])) != q:
            errs.append(f"level 6 scene {d}")
    else:
        if d.get("f") is None or Rational(str(d["f"])) != f or "q" in d or "raggi" in d:
            errs.append(f"problem scene {d}")
    if s.get("lente") != lente or Rational(str(s.get("p"))) != p or s.get("f") is None or Rational(str(s["f"])) != f or s.get("q") is None or Rational(str(s["q"])) != q or not s.get("raggi"):
        errs.append(f"solution scene {s}")
    elif abs(Rational(str(s["G"])) - (-q / p)) > Rational(1, 10**6):
        errs.append("solution scene magnification")


def image(p, f):
    """q from 1/p + 1/q = 1/f."""
    return 1 / (Rational(1) / f - Rational(1) / p)


def check(sample):
    errs = []
    lvl = sample.get("level")
    if lvl not in range(1, 7):
        return [f"unknown level {lvl}"], None
    common(sample, errs)
    try:
        s = prose(sample["problem"])
        kind = None
        if lvl == 1:
            m = re.fullmatch(r"Una lente (convergente|divergente) ha la distanza focale di \$" + NUM + r"\\,\\text\{cm\}\$\. Quanto vale il suo potere diottrico\?", s)
            if m:
                fa = num(m.group(2))
                if fa not in FOCALS:
                    errs.append("focal length not in the table")
                f = fa if m.group(1) == "convergente" else -fa
                P = round_sig(100 / f, 2)
                check_choice(sample, errs, f"{P}\\,\\text{{D}}")
                options(sample, errs, r"-?\d+(\{,\}\d+)?\\,\\text\{D\}")
                kind = "potere"
            else:
                m = re.fullmatch(r"Una lente ha il potere di \$" + NUM + r"\\,\\text\{D\}\$\. Quanto vale la sua distanza focale, in centimetri\?", s)
                if not m:
                    return errs + [f"level 1 text: {s!r}"], None
                f = 100 / num(m.group(1))
                if abs(f) not in FOCALS:
                    errs.append("focal length not in the table")
                check_choice(sample, errs, cm(f))
                options(sample, errs, r"-?\d+(\{,\}\d+)?\\,\\text\{cm\}")
                kind = "focale"
        elif lvl == 2:
            m = re.fullmatch(r"Un oggetto sta a \$(\d+)\\,\\text\{cm\}\$ da una lente convergente con distanza focale \$(\d+)\\,\\text\{cm\}\$\. A che distanza dalla lente si forma l'immagine\?", s)
            if not m:
                return errs + [f"level 2 text: {s!r}"], None
            p, f = Rational(m.group(1)), Rational(m.group(2))
            q = image(p, f)
            if not (5 <= f <= 30 and p > f and q.q == 1 and q <= 100 and p <= 100):
                errs.append("level 2 constraints")
            check_choice(sample, errs, cm(q))
            options(sample, errs, r"\d+(\{,\}\d+)?\\,\\text\{cm\}")
            scene(sample, errs, "convergente", p, f, q)
        elif lvl == 3:
            m = re.fullmatch(r"Una lente convergente con distanza focale \$(\d+)\\,\\text\{cm\}\$ forma l'immagine di un oggetto posto a \$(\d+)\\,\\text\{cm\}\$ dalla lente\. Quanto vale l'ingrandimento \$G\$\?", s)
            if m:
                f, p = Rational(m.group(1)), Rational(m.group(2))
                q = image(p, f)
                G = -q / p
                check_choice(sample, errs, f"G = {round_sig(G, 2)}")
                options(sample, errs, r"G = -?\d+\{,\}\d+")
                kind = "ingrandimento"
            else:
                m = re.fullmatch(r"Un oggetto alto \$" + NUM + r"\\,\\text\{cm\}\$ sta a \$(\d+)\\,\\text\{cm\}\$ da una lente convergente con distanza focale \$(\d+)\\,\\text\{cm\}\$\. Quanto è alta l'immagine\? Scrivi il segno meno se è capovolta\.", s)
                if not m:
                    return errs + [f"level 3 text: {s!r}"], None
                h, p, f = num(m.group(1)), Rational(m.group(2)), Rational(m.group(3))
                q = image(p, f)
                G = -q / p
                check_choice(sample, errs, f"{round_sig(G * h, 2)}\\,\\text{{cm}}")
                options(sample, errs, r"-?\d+(\{,\}\d+)?\\,\\text\{cm\}")
                kind = "altezza"
            if not (q > 0 and q.q == 1 and abs(G) in {Rational(x) for x in ("0.2", "0.25", "0.4", "0.5", "2", "2.5", "3", "4", "5")}):
                errs.append("level 3 constraints")
            scene(sample, errs, "convergente", p, f, q)
        elif lvl in (4, 5):
            lens = "convergente con distanza focale" if lvl == 4 else "divergente con la distanza focale di"
            m = re.fullmatch(r"Un oggetto sta a \$(\d+)\\,\\text\{cm\}\$ da una lente " + lens + r" \$(\d+)\\,\\text\{cm\}\$\. Quanto vale \$q\$\? Scrivi il segno meno se l'immagine è virtuale\.", s)
            if not m:
                return errs + [f"level {lvl} text: {s!r}"], None
            p, fa = Rational(m.group(1)), Rational(m.group(2))
            f = fa if lvl == 4 else -fa
            q = image(p, f)
            if not (q < 0 and q.q == 1 and -q <= 100 and (lvl == 5 or p < f)):
                errs.append(f"level {lvl} constraints")
            check_choice(sample, errs, cm(q))
            options(sample, errs, r"-?\d+(\{,\}\d+)?\\,\\text\{cm\}")
            scene(sample, errs, "convergente" if lvl == 4 else "divergente", p, f, q)
        else:
            m = re.fullmatch(r"Un oggetto sta a \$(\d+)\\,\\text\{cm\}\$ da una lente, e (?:si forma un'immagine reale a \$(\d+)\\,\\text\{cm\}\$ dalla lente, dall'altra parte|si vede un'immagine virtuale a \$(\d+)\\,\\text\{cm\}\$ dalla lente, dalla parte dell'oggetto)\. Quanto vale la distanza focale della lente, con il suo segno\?", s)
            if not m:
                return errs + [f"level 6 text: {s!r}"], None
            p = Rational(m.group(1))
            q = Rational(m.group(2)) if m.group(2) else -Rational(m.group(3))
            f = 1 / (1 / p + 1 / q)
            if not (f.q == 1 and 3 <= abs(f) <= 60):
                errs.append("level 6 constraints")
            check_choice(sample, errs, cm(f))
            options(sample, errs, r"-?\d+(\{,\}\d+)?\\,\\text\{cm\}")
            scene(sample, errs, "convergente" if f > 0 else "divergente", p, f, q, level6=True)
            kind = "reale" if q > 0 else ("virtuale convergente" if f > 0 else "virtuale divergente")
    except (ValueError, ZeroDivisionError) as e:
        return errs + [str(e)], None
    return errs, kind
