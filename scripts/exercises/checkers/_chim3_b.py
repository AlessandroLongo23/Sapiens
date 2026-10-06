"""Shared helpers for the checkers of group B of the third year of chemistry (chim-configurazione-elettronica,
gruppi-periodi, chim-simboli-lewis), written from the lessons 53, 57 and 58 and not from the generators.

Everything is rebuilt from the atomic number: the configuration by the rule of the diagonal with the two exceptions
of the lesson (chromium, copper), the period, the group and the block from the place of Z between two noble gases.
The names are typed here. Configurations are read from LaTeX as the lessons write them: 1s^2\\,2s^2\\,2p^6,
[\\text{Ne}]\\,3s^1, on two lines in a gathered when long.
"""
import re

from checkers._fis_grandezze import BANNED, check_choice, option_text, prose_and_extra  # noqa: F401

# Z -> (symbol, name as the lessons write it)
NAMES = {
    1: ("H", "idrogeno"), 2: ("He", "elio"), 3: ("Li", "litio"), 4: ("Be", "berillio"), 5: ("B", "boro"), 6: ("C", "carbonio"),
    7: ("N", "azoto"), 8: ("O", "ossigeno"), 9: ("F", "fluoro"), 10: ("Ne", "neon"), 11: ("Na", "sodio"), 12: ("Mg", "magnesio"),
    13: ("Al", "alluminio"), 14: ("Si", "silicio"), 15: ("P", "fosforo"), 16: ("S", "zolfo"), 17: ("Cl", "cloro"), 18: ("Ar", "argon"),
    19: ("K", "potassio"), 20: ("Ca", "calcio"), 21: ("Sc", "scandio"), 22: ("Ti", "titanio"), 23: ("V", "vanadio"), 24: ("Cr", "cromo"),
    25: ("Mn", "manganese"), 26: ("Fe", "ferro"), 27: ("Co", "cobalto"), 28: ("Ni", "nichel"), 29: ("Cu", "rame"), 30: ("Zn", "zinco"),
    31: ("Ga", "gallio"), 32: ("Ge", "germanio"), 33: ("As", "arsenico"), 34: ("Se", "selenio"), 35: ("Br", "bromo"), 36: ("Kr", "kripton"),
    37: ("Rb", "rubidio"), 38: ("Sr", "stronzio"), 39: ("Y", "ittrio"), 40: ("Zr", "zirconio"), 43: ("Tc", "tecnezio"), 48: ("Cd", "cadmio"),
    49: ("In", "indio"), 50: ("Sn", "stagno"), 51: ("Sb", "antimonio"), 52: ("Te", "tellurio"), 53: ("I", "iodio"), 54: ("Xe", "xeno"),
    55: ("Cs", "cesio"), 56: ("Ba", "bario"), 81: ("Tl", "tallio"), 82: ("Pb", "piombo"), 83: ("Bi", "bismuto"), 86: ("Rn", "radon"),
}
BY_NAME = {v[1]: z for z, v in NAMES.items()}
BY_SYMBOL = {v[0]: z for z, v in NAMES.items()}
NOBLE = [2, 10, 18, 36, 54, 86]
NOBLE_SYMBOL = {2: "He", 10: "Ne", 18: "Ar", 36: "Kr", 54: "Xe", 86: "Rn"}
# elements whose real configuration is not the diagonal's and that the lessons do not treat: never to be used
UNTREATED = {41, 42, 44, 45, 46, 47, 57, 58, 64, 78, 79}

L = "spdf"


def cap_of(name):
    return 2 * (2 * L.index(name[1]) + 1)


ORDER = sorted(((n, l) for n in range(1, 8) for l in range(4) if l < n and n + l <= 8), key=lambda t: (t[0] + t[1], t[0]))
ORDER = [f"{n}{L[l]}" for n, l in ORDER]
assert ORDER[:8] == ["1s", "2s", "2p", "3s", "3p", "4s", "3d", "4p"]


def diagonal(n):
    """The configuration of n electrons by the rule of the diagonal: a list of (sublevel, electrons)."""
    out = []
    for name in ORDER:
        if n <= 0:
            break
        k = min(n, cap_of(name))
        out.append((name, k))
        n -= k
    return out


def real(z):
    """The real configuration of the element: the diagonal's, with chromium and copper."""
    if z in UNTREATED:
        raise ValueError(f"element {z} is an exception the lessons do not treat")
    cfg = diagonal(z)
    if z == 24:
        cfg = cfg[:-2] + [("4s", 1), ("3d", 5)]
    if z == 29:
        cfg = cfg[:-2] + [("4s", 1), ("3d", 10)]
    return cfg


def occupancy(cfg):
    out = {}
    for name, k in cfg:
        if name in out:
            raise ValueError(f"sublevel {name} twice")
        if k:
            out[name] = k
    return out


def core_of(z):
    """The noble gas before the element (its Z), or None in the first period."""
    before = [g for g in NOBLE if g < z]
    return before[-1] if before else None


def period_of(z):
    return 1 + sum(1 for g in NOBLE if g < z)


def group_of(z):
    """1 to 18 from the place of Z after the last noble gas; None for the f rows."""
    p = period_of(z)
    k = z - (core_of(z) or 0)
    if p == 1:
        return 1 if k == 1 else 18
    if p in (2, 3):
        return k if k <= 2 else k + 10
    if p in (4, 5):
        return k
    if k <= 2:
        return k
    if k <= 17:
        return 3 if k == 3 else None
    return k - 14


def block_of(z):
    if z == 2:
        return "s"
    g = group_of(z)
    if g is None:
        return "f"
    return "s" if g <= 2 else "d" if g <= 12 else "p"


def valence(z):
    """Valence electrons of a main-group element."""
    g = group_of(z)
    if z == 2:
        return 2
    if g is None or 3 <= g <= 12:
        raise ValueError(f"element {z} is not of a main group")
    return g if g <= 2 else g - 10


def unpaired(cfg):
    t = 0
    for name, k in cfg:
        boxes = cap_of(name) // 2
        t += k if k <= boxes else 2 * boxes - k
    return t


def art(name):
    if re.match(r"(io|z|x|s[^aeiou])", name):
        return "lo " + name
    if name[0] in "aeiou":
        return "l'" + name
    return "il " + name


def di(name):
    a = art(name)
    return re.sub(r"^il ", "del ", re.sub(r"^lo ", "dello ", re.sub(r"^l'", "dell'", a)))


def cap(s):
    return s[0].upper() + s[1:]


SUB = r"(\d[spdf])\^(?:(\d)|\{(\d\d)\})"


def parse_cfg(tex):
    """'[\\text{Ar}]\\,4s^2\\,3d^{10}' -> ('Ar', [('4s', 2), ('3d', 10)]); two lines of a gathered are joined."""
    s = tex.strip()
    m = re.fullmatch(r"\\begin\{gathered\} (.*) \\\\ (.*) \\end\{gathered\}", s)
    if m:
        s = m.group(1) + "\\," + m.group(2)
    core = None
    m = re.match(r"\[\\text\{([A-Z][a-z]?)\}\]", s)
    if m:
        core = m.group(1)
        s = s[m.end():]
        if s.startswith("\\,"):
            s = s[2:]
        elif s:
            raise ValueError(f"not a configuration: {tex!r}")
    subs = []
    if s:
        for part in s.split("\\,"):
            mm = re.fullmatch(SUB, part)
            if not mm:
                raise ValueError(f"not a configuration: {tex!r}")
            subs.append((mm.group(1), int(mm.group(2) or mm.group(3))))
    if core is None and not subs:
        raise ValueError(f"empty configuration: {tex!r}")
    return core, subs


def expand(core, subs):
    """The whole configuration: the noble gas written out, then the rest."""
    if core is None:
        return list(subs)
    if core not in BY_SYMBOL or BY_SYMBOL[core] not in NOBLE:
        raise ValueError(f"[{core}] is not a noble gas")
    return diagonal(BY_SYMBOL[core]) + list(subs)


def parse_ion(tex):
    """\\mathrm{Fe^{3+}} -> ('Fe', 3); \\mathrm{Cl^-} -> ('Cl', -1)."""
    m = re.fullmatch(r"\\mathrm\{([A-Z][a-z]?)\^(?:([+-])|\{(\d)([+-])\})\}", tex.strip())
    if not m:
        raise ValueError(f"not an ion: {tex!r}")
    n = int(m.group(3) or 1)
    sign = m.group(2) or m.group(4)
    return m.group(1), n if sign == "+" else -n


def common(sample, errs):
    """The checks of every sample, and its multiple choice: the answer itself, or params.choice for a number."""
    if not sample.get("steps"):
        errs.append("no steps")
    text = sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")
    a = sample.get("answer", {})
    if a.get("kind") == "choice":
        return a
    if a.get("kind") != "number":
        errs.append("answer is neither a choice nor a number")
        return None
    ch = sample.get("params", {}).get("choice")
    if not ch:
        errs.append("number answer without its choice")
        return None
    if sample.get("choice") is not None and sample["choice"] != ch:
        errs.append("the choice variant is not the one kept in params")
    return ch


def check_number(sample, ch, value, errs):
    """A number answer: its value, and the option with that value as the only right one."""
    a = sample["answer"]
    if a.get("kind") != "number":
        errs.append("answer should be a number")
        return
    if a.get("value") != str(value):
        errs.append(f"answer {a.get('value')} but the value is {value}")
    for o in ch["options"]:
        if not re.fullmatch(r"\d+", o["latex"]) or o["values"] != [o["latex"]]:
            errs.append(f"option {o['latex']!r} is not a whole number")
    check_choice(ch, lambda o: o["latex"] == str(value), errs)
