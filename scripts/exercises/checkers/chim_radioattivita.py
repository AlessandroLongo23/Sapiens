"""Checker for chim-radioattivita (specs/exercises/chim-radioattivita.md), written from the spec and the lesson
54-chim-radioattivita.md, not from the generator.

An α decay lowers A by 4 and Z by 2; a β⁻ decay keeps A and raises Z by 1; a β⁺ decay and an electron capture keep A
and lower Z by 1; a γ emission changes neither. In a nuclear equation the sums of the upper and of the lower numbers
are the same on the two sides. An isotope with more neutrons than the stable ones of its element decays β⁻, one with
fewer decays β⁺ or captures an electron. Between two nuclides of a family the α decays are ΔA / 4 and the β⁻ decays
restore the atomic number. Every nuclide named must be a real emitter of that kind (tables in _chim3_c.py).
"""
import re

from checkers._chim3_c import (
    ALPHA,
    ALPHA_EMITTERS,
    BETA_MINUS_EMITTERS,
    BETA_PLUS_EMITTERS,
    CAPTURE_NUCLIDES,
    ELECTRON,
    FAMILIES,
    GAMMA_EMITTERS,
    NAMES,
    POSITRON,
    STABLE,
    check_choice,
    check_number,
    choice_of,
    common,
    nuclide,
    prose_and_extra,
)

CASE_RANGES = {
    3: {"beta+": (0.40, 0.60), "cattura": (0.40, 0.60)},
    4: {"alfa": (0.22, 0.38), "beta-": (0.22, 0.38), "beta+": (0.22, 0.38), "gamma": (0.05, 0.16)},
    5: {"troppi neutroni": (0.40, 0.60), "pochi neutroni": (0.40, 0.60)},
    6: {"alfa": (0.40, 0.60), "beta-": (0.40, 0.60)},
}

NUCLEUS = r"Un nucleo di ([a-z]+)-(\d+), \$(.+?)\$, "


def daughter_is(want):
    def right(o):
        Z, A, m = nuclide(o["latex"])
        return (Z, A) == want and not m and o["values"] == [f"{A}/{Z}"]

    return right


def parent(m, errs, table, what):
    """The parent nuclide of levels 1-3: name, mass number and symbol must agree, and it must decay that way."""
    Z, A, excited = nuclide(m.group(3))
    if excited or NAMES[Z - 1] != m.group(1) or A != int(m.group(2)):
        errs.append("name, mass number and symbol do not agree")
    if (Z, A) not in table:
        errs.append(f"{m.group(1)}-{A} is not a real {what} emitter of the spec")
    return Z, A


def options_are_real_symbols(sample, errs):
    for o in choice_of(sample).get("options", []):
        try:
            nuclide(o["latex"])
        except ValueError as e:
            errs.append(str(e))


def level1(sample, prose, extra, errs):
    m = re.fullmatch(NUCLEUS + r"emette una particella \$\\alpha\$\. Qual è il nucleo figlio\?", prose)
    if not m or extra:
        errs.append(f"level 1 text not recognised: {prose!r}")
        return None
    Z, A = parent(m, errs, ALPHA_EMITTERS, "α")
    options_are_real_symbols(sample, errs)
    check_choice(sample["answer"], daughter_is((Z - 2, A - 4)), errs)
    return "alfa"


def level2(sample, prose, extra, errs):
    m = re.fullmatch(NUCLEUS + r"decade \$\\beta\^-\$\. Qual è il nucleo figlio\?", prose)
    if not m or extra:
        errs.append(f"level 2 text not recognised: {prose!r}")
        return None
    Z, A = parent(m, errs, BETA_MINUS_EMITTERS, "β⁻")
    options_are_real_symbols(sample, errs)
    check_choice(sample["answer"], daughter_is((Z + 1, A)), errs)
    return "beta-"


def level3(sample, prose, extra, errs):
    m = re.fullmatch(NUCLEUS + r"(decade \$\\beta\^\+\$|decade per cattura elettronica)\. Qual è il nucleo figlio\?", prose)
    if not m or extra:
        errs.append(f"level 3 text not recognised: {prose!r}")
        return None
    capture = "cattura" in m.group(4)
    Z, A = parent(m, errs, CAPTURE_NUCLIDES if capture else BETA_PLUS_EMITTERS, "electron capture" if capture else "β⁺")
    options_are_real_symbols(sample, errs)
    check_choice(sample["answer"], daughter_is((Z - 1, A)), errs)
    return "cattura" if capture else "beta+"


PARTICLES = {
    "alfa": ALPHA + "\\ (\\alpha)",
    "beta-": ELECTRON + "\\ (\\beta^-)",
    "beta+": POSITRON + "\\ (\\beta^+)",
    "gamma": "\\gamma",
}


def level4(sample, prose, extra, errs):
    if prose != "Quale particella completa questa equazione nucleare?" or len(extra) != 1:
        errs.append(f"level 4 text not recognised: {prose!r} {extra}")
        return None
    m = re.fullmatch(r"(.+) \\longrightarrow (.+) \+ \\ \?", extra[0])
    if not m:
        errs.append(f"equation not recognised: {extra[0]!r}")
        return None
    Z, A, excited = nuclide(m.group(1))
    Z2, A2, excited2 = nuclide(m.group(2))
    # the missing particle from the two sums
    top, bottom = A - A2, Z - Z2
    kind = {(4, 2): "alfa", (0, -1): "beta-", (0, 1): "beta+", (0, 0): "gamma"}.get((top, bottom))
    if kind is None:
        errs.append(f"no particle with {top} above and {bottom} below")
        return None
    table = {"alfa": ALPHA_EMITTERS, "beta-": BETA_MINUS_EMITTERS, "beta+": BETA_PLUS_EMITTERS, "gamma": GAMMA_EMITTERS}[kind]
    if (Z, A) not in table:
        errs.append(f"({Z}, {A}) is not a real {kind} emitter of the spec")
    if excited != (kind == "gamma") or excited2:
        errs.append("the excited nucleus (m) is written only on the left of a γ emission")
    opts = sample["answer"].get("options", [])
    if sorted(o["latex"] for o in opts) != sorted(PARTICLES.values()):
        errs.append("the options are not the four particles")
    check_choice(sample["answer"], lambda o: o["latex"] == PARTICLES[kind] and o["values"] == [kind], errs)
    return kind


EXPECT = {
    "beta-": "\\beta^-",
    "beta+": "\\begin{gathered} \\beta^+ \\text{ o cattura} \\\\ \\text{elettronica} \\end{gathered}",
    "alfa": "\\alpha",
    "gamma": "\\gamma",
}


def level5(sample, prose, extra, errs):
    m = re.fullmatch(
        r"Gli isotopi stabili dell'elemento con \$Z = (\d+)\$ hanno numero di massa (.+)\. Quale decadimento ti aspetti dal nucleo \$(.+)\$\?",
        prose,
    )
    if not m or extra:
        errs.append(f"level 5 text not recognised: {prose!r}")
        return None
    Z = int(m.group(1))
    listed = [int(x) for x in re.findall(r"\$(\d+)\$", m.group(2))]
    if STABLE.get(Z) != listed:
        errs.append(f"the stable isotopes of Z = {Z} are {STABLE.get(Z)}, not {listed}")
    Z2, A, excited = nuclide(m.group(3))
    if Z2 != Z or excited:
        errs.append("the nucleus is not an isotope of that element")
    if A > max(listed) and 1 <= A - max(listed) <= 2:
        kind, case = "beta-", "troppi neutroni"
        if (Z, A) in BETA_PLUS_EMITTERS or (Z, A) in CAPTURE_NUCLIDES:
            errs.append("a nuclide above the stable ones that does not decay β⁻")
    elif A < min(listed) and 1 <= min(listed) - A <= 2:
        kind, case = "beta+", "pochi neutroni"
        if (Z, A) in BETA_MINUS_EMITTERS:
            errs.append("a nuclide below the stable ones that decays β⁻")
    else:
        errs.append(f"mass number {A} is not one or two units outside {listed}")
        return None
    opts = sample["answer"].get("options", [])
    if sorted(o["latex"] for o in opts) != sorted(EXPECT.values()):
        errs.append("the options are not the four decays")
    check_choice(sample["answer"], lambda o: o["latex"] == EXPECT[kind] and o["values"] == [kind], errs)
    return case


def level6(sample, prose, extra, errs):
    m = re.fullmatch(
        r"In una famiglia radioattiva un nucleo \$(.+?)\$ diventa \$(.+?)\$ con una serie di decadimenti \$\\alpha\$ e \$\\beta\^-\$\. Quanti sono i decadimenti \$(\\alpha|\\beta\^-)\$\?",
        prose,
    )
    if not m or extra:
        errs.append(f"level 6 text not recognised: {prose!r}")
        return None
    Zi, Ai, _ = nuclide(m.group(1))
    Zf, Af, _ = nuclide(m.group(2))
    if not any((Zi, Ai) in f and (Zf, Af) in f and f.index((Zi, Ai)) < f.index((Zf, Af)) for f in FAMILIES):
        errs.append("the two nuclides are not one after the other in a natural family")
    if (Ai - Af) % 4:
        errs.append("the mass numbers do not differ by a multiple of 4")
        return None
    alphas = (Ai - Af) // 4
    betas = Zf - (Zi - 2 * alphas)
    if alphas < 2 or betas < 1:
        errs.append(f"{alphas} α and {betas} β⁻: the spec wants at least 2 and 1")
    ask_alpha = m.group(3) == "\\alpha"
    check_number(sample, alphas if ask_alpha else betas, errs)
    return "alfa" if ask_alpha else "beta-"


LEVELS = {1: level1, 2: level2, 3: level3, 4: level4, 5: level5, 6: level6}


def check(sample):
    errs = []
    common(sample, errs)
    lvl = sample.get("level")
    if lvl not in LEVELS:
        return [f"unknown level {lvl}"], None
    if (sample["answer"].get("kind") == "number") != (lvl == 6):
        errs.append("only level 6 is answered with a number")
    prose, extra = prose_and_extra(sample["problem"])
    try:
        kind = LEVELS[lvl](sample, prose, extra, errs)
    except (ValueError, KeyError, TypeError, AttributeError, IndexError) as e:
        return errs + [f"{type(e).__name__}: {e}"], None
    return errs, kind
