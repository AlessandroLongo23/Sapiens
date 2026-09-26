"""Checker for dominio-codominio-immagine (specs/exercises/dominio-codominio-immagine.md).

Written from the spec, not from the generator. Everything is read back from what the student sees:
- level 1: the sets, the arrows or the table are parsed from the problem, the element from the prompt,
  and the preimages are counted;
- level 2: A, the codomain and the formula (or "il resto della divisione per k") are parsed, and the
  image set is recomputed;
- level 3: the law and its sets are parsed; the image is f(n), the preimages are the real solutions of
  f(x) = n (SymPy) that lie in ℤ or ℚ;
- levels 4-6: every \\frac{…}{…} of the formula is parsed, each denominator solved over ℝ with SymPy,
  and the domain is ℝ without those zeros. The formula read from the problem must equal the one in
  params, and the case is decided from the shape of the denominators.
Each option of the multiple choice is read back from its LaTeX and must say the same as its values.
"""
import re

from sympy import Poly, Rational, S, Symbol, cancel, gcd, simplify, solveset, sympify
from sympy.parsing.sympy_parser import implicit_multiplication_application, parse_expr, standard_transformations

from verify import FORBIDDEN

x = Symbol("x")
TRANSFORMS = standard_transformations + (implicit_multiplication_application,)

CASE_RANGES = {
    1: {"nessuna": (0.25, 0.42), "una": (0.25, 0.42), "piu": (0.25, 0.42)},
    2: {"abs": (0.25, 0.42), "quad": (0.25, 0.42), "resto": (0.25, 0.42)},
    3: {"immagine": (0.18, 0.32), "lin-intera": (0.14, 0.26), "lin-nessuna": (0.14, 0.26), "lin-Q": (0.10, 0.20), "quadrato": (0.14, 0.26)},
    4: {"polinomio": (0.18, 0.32), "intera": (0.30, 0.45), "frazionaria": (0.30, 0.45)},
    5: {"raccoglimento": (0.25, 0.42), "quadrati": (0.25, 0.42), "due-frazioni": (0.25, 0.42)},
    6: {"mai-nullo": (0.25, 0.42), "numero": (0.25, 0.42), "semplifica": (0.25, 0.42)},
}


# ---------------------------------------------------------------------------
# Reading LaTeX


def value(t):
    """A number as the generator writes it: -3, \\frac{7}{2}, -\\frac{5}{2}."""
    t = t.strip()
    m = re.fullmatch(r"(-?)\\frac\{(\d+)\}\{(\d+)\}", t)
    if m:
        return Rational(int(m.group(2)), int(m.group(3))) * (-1 if m.group(1) else 1)
    if re.fullmatch(r"-?\d+", t):
        return Rational(int(t))
    raise ValueError(f"unreadable number {t!r}")


def listed(body):
    """Elements of '\\{a,\\ b\\}' or '\\{a, b\\}' (the inside), as Rationals."""
    body = body.strip()
    if not body:
        return []
    return [value(p) for p in re.split(r",\\ |, ", body)]


def set_in(problem, name):
    m = re.search(name + r" = \\\{(.*?)\\\}", problem)
    if not m:
        raise ValueError(f"no {name} in the problem")
    return listed(m.group(1))


def pre_values(latex):
    """Preimages written as '\\text{nessuna}', 'a', 'a \\text{ e } b', 'a,\\ b \\text{ e } c'."""
    if latex == r"\text{nessuna}":
        return []
    parts = latex.split(r" \text{ e } ")
    if len(parts) > 2:
        raise ValueError(f"bad list {latex!r}")
    head = re.split(r",\\ ", parts[0]) if len(parts) == 2 else [parts[0]]
    return [value(p) for p in head + parts[1:]]


def set_values(latex):
    """A set option: '\\{1, 2\\}' or two lines of a gathered with \\Big braces."""
    s = latex.strip()
    g = re.fullmatch(r"\\begin\{gathered\} \\Big\\\{(.*), \\\\ (.*)\\Big\\\} \\end\{gathered\}", s)
    if g:
        return listed(g.group(1)) + listed(g.group(2))
    m = re.fullmatch(r"\\\{(.*)\\\}", s)
    if not m:
        raise ValueError(f"not a set {latex!r}")
    return listed(m.group(1))


def domain_values(latex):
    if latex == r"D = \mathbb{R}":
        return []
    m = re.fullmatch(r"D = \\mathbb\{R\} \\setminus \\\{(.*)\\\}", latex)
    if not m:
        raise ValueError(f"not a domain {latex!r}")
    return listed(m.group(1))


def to_sympy(t):
    t = t.replace(r"\lvert ", "Abs(").replace(r" \rvert", ")").replace("^", "**")
    t = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"((\1)/(\2))", t)
    if "\\" in t:
        raise ValueError(f"unparsed LaTeX {t!r}")
    return parse_expr(t, local_dict={"x": x}, transformations=TRANSFORMS)


def real_zeros(expr):
    sol = solveset(expr, x, S.Reals)
    if sol is S.EmptySet:
        return []
    return sorted(sol, key=float)


# ---------------------------------------------------------------------------
# Common


def rset(vals):
    """Exact values as a sorted tuple: strings "p/q" from params, or SymPy numbers."""
    return tuple(sorted({Rational(v) if isinstance(v, str) else sympify(v) for v in vals}, key=float))


def check_choice(sample, truth, reader, errs):
    ch = sample.get("choice")
    if ch is None:
        errs.append("no multiple choice")
        return None
    opts = ch.get("options", [])
    keys = []
    for o in opts:
        try:
            k = rset(o["values"])
            shown = tuple(sorted(reader(o["latex"])))
            if shown != k or len(shown) != len(o["values"]):
                errs.append(f"option {o['latex']!r} does not say {o['values']}")
        except Exception as e:  # noqa: BLE001
            errs.append(f"option unreadable: {e}")
            k = None
        keys.append(k)
    if len(opts) != 4 or len(set(keys)) != 4:
        errs.append(f"choice needs 4 distinct options: {[o.get('latex') for o in opts]}")
    idx = ch.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(keys) or keys[idx] != truth:
        errs.append(f"choice.correct is not {truth}")
    if sum(1 for k in keys if k == truth) != 1:
        errs.append("not exactly one correct option")
    return keys


def number_from_prompt(prompt, pattern):
    m = re.fullmatch(pattern, prompt)
    if not m:
        raise ValueError(f"unexpected prompt {prompt!r}")
    return int(m.group(1))


# ---------------------------------------------------------------------------
# Levels


def level1(sample, errs):
    p, prob = sample["params"], sample["problem"]
    A, B = [int(v) for v in set_in(prob, "A")], [int(v) for v in set_in(prob, "B")]
    if [str(v) for v in A] != p["A"] or [str(v) for v in B] != p["B"]:
        errs.append("A or B in the problem differ from params")
    arrows = re.findall(r"(-?\d+) \\mapsto (-?\d+)", prob)
    if arrows:
        fmap = {int(a): int(b) for a, b in arrows}
        if len(arrows) != len(A):
            errs.append("an element has zero or two arrows")
    else:
        m = re.search(r"x & (.*?) \\\\ \\hline f\(x\) & (.*?) \\end\{array\}", prob)
        if not m:
            errs.append("neither arrows nor table in the problem")
            return None
        xs = [int(v) for v in m.group(1).split(" & ")]
        ys = [int(v) for v in m.group(2).split(" & ")]
        fmap = dict(zip(xs, ys))
        if len(xs) != len(ys):
            errs.append("table rows of different length")
    if sorted(fmap) != A:
        errs.append("f is not defined on the whole of A")
    if any(v not in B for v in fmap.values()):
        errs.append("some image is outside B")
    if not 4 <= len(A) <= 6 or any(not -3 <= v <= 6 for v in A):
        errs.append("A: 4 to 6 integers in [-3, 6]")
    if not 3 <= len(B) <= 5 or any(not 0 <= v <= 9 for v in B):
        errs.append("B: 3 to 5 integers in [0, 9]")
    y = number_from_prompt(sample["prompt"], r"Trova le controimmagini di (-?\d+)\.")
    if y not in B:
        errs.append("the element is not in the codomain")
    pre = sorted(a for a, b in fmap.items() if b == y)
    ans = sample["answer"]
    if ans.get("kind") != "set" or [int(v) for v in ans["values"]] != pre:
        errs.append(f"answer {ans.get('values')} != preimages {pre}")
    truth = rset(pre)
    keys = check_choice(sample, truth, pre_values, errs)
    # "Scambiare immagine e controimmagine": when y is in A, f(y) is an option.
    if keys and y in fmap and fmap[y] not in pre and rset([fmap[y]]) not in keys:
        errs.append("the swapped answer f(y) is missing")
    kind = "nessuna" if not pre else "una" if len(pre) == 1 else "piu"
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} != {kind}")
    if len(pre) == len(A):
        errs.append("every element has the same image")
    return kind


def level2(sample, errs):
    p, prob = sample["params"], sample["problem"]
    A = [int(v) for v in set_in(prob, "A")]
    m = re.search(r"f: A \\to (B|\\mathbb\{N\}|\\mathbb\{Z\})", prob)
    if not m:
        errs.append("no codomain")
        return None
    cod = {"B": "B", r"\mathbb{N}": "N", r"\mathbb{Z}": "Z"}[m.group(1)]
    r = re.search(r"il resto della divisione di \$x\$ per \$(\d+)\$", prob)
    if r:
        k = int(r.group(1))
        image = sorted({a % k for a in A})
        family = "resto"
        if k not in (3, 4, 5) or any(not 1 <= a <= 12 for a in A):
            errs.append("resto: k in 3..5, A in 1..12")
    else:
        fm = re.search(r"f\(x\) = (.*)$", prob)
        expr = to_sympy(fm.group(1))
        image = sorted({int(expr.subs(x, a)) for a in A})
        family = "abs" if "Abs" in str(expr) else "quad"
        if any(not -3 <= a <= 3 for a in A):
            errs.append("A in [-3, 3]")
    if not 5 <= len(A) <= 7:
        errs.append("A: 5 to 7 elements")
    if len(image) == len(A):
        errs.append("no repeated value")
    if cod == "B":
        B = [int(v) for v in set_in(prob, "B")]
        if any(v not in B for v in image) or len(B) == len(image):
            errs.append("B must contain the image and more")
    if cod == "N" and image[0] < 0:
        errs.append("negative values with codomain N")
    ans = sample["answer"]
    if ans.get("kind") != "set" or [int(v) for v in ans["values"]] != image:
        errs.append(f"answer {ans.get('values')} != image {image}")
    keys = check_choice(sample, rset(image), set_values, errs)
    # "Confondere codominio e insieme immagine": a finite codomain is an option.
    if keys and cod == "B" and rset(B) not in keys:
        errs.append("the codomain B is not among the options")
    if p.get("case") != family:
        errs.append(f"params.case {p.get('case')} != {family}")
    return family


def level3(sample, errs):
    prob = sample["problem"]
    m = re.fullmatch(r"f: \\mathbb\{(Z|Q)\} \\to \\mathbb\{(Z|Q)\},\\quad f\(x\) = (.*)", prob)
    if not m or m.group(1) != m.group(2):
        errs.append("problem not in the form f: Z -> Z or Q -> Q")
        return None
    dom = m.group(1)
    f = to_sympy(m.group(3))
    P = Poly(f, x)
    ans = sample["answer"]
    if sample["prompt"].startswith("Trova l'immagine"):
        n = number_from_prompt(sample["prompt"], r"Trova l'immagine di (-?\d+)\.")
        v = f.subs(x, n)
        if ans.get("kind") != "number" or Rational(ans["value"]) != v:
            errs.append(f"answer {ans.get('value')} != f({n}) = {v}")
        keys = check_choice(sample, rset([v]), lambda t: [value(t)], errs)
        sol = real_zeros(f - n)
        if keys and sol and rset(sol) not in keys:
            errs.append("the swapped answer (the preimage) is missing")
        if P.degree() != 1:
            errs.append("image questions use a first-degree law")
        kind = "immagine"
    else:
        n = number_from_prompt(sample["prompt"], r"Trova le controimmagini di (-?\d+)\.")
        sol = real_zeros(f - n)
        pre = [s for s in sol if (s.is_integer if dom == "Z" else s.is_rational)]
        if ans.get("kind") != "set" or rset(ans["values"]) != rset(pre) or len(ans["values"]) != len(pre):
            errs.append(f"answer {ans.get('values')} != preimages {pre}")
        check_choice(sample, rset(pre), pre_values, errs)
        if P.degree() == 1:
            if pre and pre[0].is_integer:
                kind = "lin-intera"
            elif dom == "Z":
                kind = "lin-nessuna"
                if not sol:
                    errs.append("no real solution in a linear case")
            else:
                kind = "lin-Q"
        else:
            kind = "quadrato"
            if dom != "Z" or P.all_coeffs()[:2] != [1, 0]:
                errs.append("the square law is x^2 + c on Z")
    if P.degree() == 1:
        a, b = P.all_coeffs()
        if not 2 <= abs(a) <= 5 or b == 0 or abs(b) > 9:
            errs.append("a x + b with 2 <= |a| <= 5, 0 < |b| <= 9")
    if abs(n) > 45:
        errs.append("number too large")
    if sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')} != {kind}")
    return kind


def fractions(t):
    """(numerator, denominator) strings of every \\frac in t, and what is left outside them."""
    fr = re.findall(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", t)
    rest = re.sub(r"\\frac\{[^{}]*\}\{[^{}]*\}", "F", t)
    return fr, rest


def level_domain(sample, errs):
    p, prob, lvl = sample["params"], sample["problem"], sample["level"]
    m = re.fullmatch(r"f\(x\) = (.*)", prob)
    if not m:
        errs.append("problem not f(x) = ...")
        return None
    body = m.group(1)
    shown = to_sympy(body)
    fr, rest = fractions(body)
    # The same formula as in params.
    expr = 0
    for t in p["terms"]:
        num = sum(Rational(c) * x**i for i, c in enumerate(t["num"]))
        den = sum(Rational(c) * x**i for i, c in enumerate(t["den"]))
        expr += num / den
    if simplify(shown - expr) != 0:
        errs.append(f"problem shows {shown}, params give {expr}")
    dens = [to_sympy(d) for _, d in fr]
    nums = [to_sympy(n) for n, _ in fr]
    excluded = sorted({z for d in dens for z in real_zeros(d)}, key=float)
    ans = sample["answer"]
    if ans.get("kind") != "set" or rset(ans["values"]) != rset(excluded) or len(ans["values"]) != len(excluded):
        errs.append(f"answer {ans.get('values')} != excluded {excluded}")
    for d in dens:
        for z in real_zeros(d):
            if not z.is_rational:
                errs.append(f"irrational zero {z} of a denominator")
    keys = check_choice(sample, rset(excluded), domain_values, errs)
    xdens = [d for d in dens if d.has(x)]
    shares = any(Poly(gcd(n, d), x).degree() > 0 for n, d in zip(nums, dens) if d.has(x))
    kind = None
    if lvl == 4:
        if not fr:
            kind = "polinomio"
        elif len(fr) == 1 and Poly(dens[0], x).degree() == 1:
            kind = "intera" if excluded[0].is_integer else "frazionaria"
            nz = real_zeros(nums[0]) if nums[0].has(x) else []
            # "Escludere i numeri sbagliati": the zero of the numerator is an option.
            if keys and nz and rset(nz) not in keys:
                errs.append("the numerator's zero is not among the options")
    elif lvl == 5:
        if len(fr) == 2 and all(Poly(d, x).degree() == 1 for d in dens) and "F + F" in rest.replace("F - F", "F + F"):
            kind = "due-frazioni"
        elif len(fr) == 1 and Poly(dens[0], x).degree() == 2:
            c2, c1, c0 = Poly(dens[0], x).all_coeffs()
            if c0 == 0 and c1 != 0:
                kind = "raccoglimento"
                if keys and rset([z for z in excluded if z != 0]) not in keys:
                    errs.append("the answer without x = 0 is not among the options")
            elif c1 == 0 and c0 < 0 and c2 > 0:
                kind = "quadrati"
        if len(excluded) != 2:
            errs.append("level 5 excludes two values")
    elif lvl == 6:
        if len(fr) == 1 and not dens[0].has(x):
            kind = "numero"
        elif len(fr) == 1 and Poly(dens[0], x).degree() == 2 and not excluded:
            kind = "mai-nullo"
        elif len(fr) == 1 and shares:
            kind = "semplifica"
            if keys and () not in keys:
                errs.append("D = R (the simplified formula) is not among the options")
            if cancel(shown).is_polynomial(x) is False:
                errs.append("the fraction does not simplify to a polynomial")
    if kind is None:
        errs.append(f"formula {body} is none of the cases of level {lvl}")
    if shares and kind != "semplifica":
        errs.append("numerator and denominator share a zero outside the case semplifica")
    if not xdens and kind not in ("polinomio", "numero"):
        errs.append("no denominator with x")
    for c in [c for d in dens + nums for c in Poly(d, x).all_coeffs()] + ([] if fr else Poly(shown, x).all_coeffs()):
        if not c.is_integer or abs(c) > 81:
            errs.append(f"coefficient {c} not an integer or too large")
    if p.get("case") != kind:
        errs.append(f"params.case {p.get('case')} != {kind}")
    return kind


def check(sample):
    errs = []
    for name, rx in FORBIDDEN:
        if rx.search(sample["problem"]):
            errs.append(f"problem contains forbidden '{name}': {sample['problem']}")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    lvl = sample["level"]
    fn = {1: level1, 2: level2, 3: level3, 4: level_domain, 5: level_domain, 6: level_domain}.get(lvl)
    if fn is None:
        return [f"unknown level {lvl}"], None
    kind = fn(sample, errs)
    return errs, kind
