"""Checker for funzioni-iniettive-suriettive-biettive (specs/exercises/funzioni-iniettive-suriettive-biettive.md).

Written from the spec, not from the generator:
- finite functions (levels 1-3): the images are recomputed from the formula or the list of
  assignments, and injectivity and surjectivity are counted directly;
- functions between sets of numbers (levels 4-5): each family is decided with the facts of the
  lesson (a x + b, k x^2, k|x + b|, k/x), re-derived from the parameters and the two sets, after
  checking that f really maps the domain into the codomain;
- the inverse (level 6): SymPy solves y = a x + b for x.
"""
import re

from sympy import Abs, Symbol, simplify, solve, sympify
from sympy.parsing.sympy_parser import implicit_multiplication_application, parse_expr, standard_transformations

from verify import FORBIDDEN

x = Symbol("x")
y = Symbol("y")

CODES = {
    "iniettiva": "iniettiva-non-suriettiva",
    "suriettiva": "suriettiva-non-iniettiva",
    "biettiva": "biettiva",
    "nessuna": "ne-iniettiva-ne-suriettiva",
}
ORDER = ["iniettiva", "suriettiva", "biettiva", "nessuna"]

CASE_RANGES = {lvl: {k: (0.15, 0.35) for k in ORDER} for lvl in (2, 3, 4, 5)}

EXTRA_FORBIDDEN = [("1y", re.compile(r"(?<![\d.])1\s*y")), ("0y", re.compile(r"(?<![\d.])0\s*y"))]


SETS = {
    "R": r"\mathbb{R}",
    "R+": r"[0, +\infty)",
    "Z": r"\mathbb{Z}",
    "Q": r"\mathbb{Q}",
    "N": r"\mathbb{N}",
    "R0": r"\mathbb{R} \setminus \{0\}",
}


def shown_formula(problem):
    """The f(x) of the problem, read back from its LaTeX into SymPy."""
    m = re.search(r"f\(x\) = (.*?)(?:,\\quad|$)", problem)
    if not m:
        raise ValueError("no f(x) in the problem")
    t = m.group(1)
    t = t.replace(r"\lvert ", "Abs(").replace(r" \rvert", ")").replace(r"\cdot", "*").replace("^", "**")
    t = re.sub(r"\\frac\{([^{}]*)\}\{([^{}]*)\}", r"((\1)/(\2))", t)
    if "\\" in t:
        raise ValueError(f"unparsed LaTeX in f(x): {t}")
    return parse_expr(t, local_dict={"x": x, "Abs": Abs}, transformations=standard_transformations + (implicit_multiplication_application,))


def expect_formula(sample, expr, errs):
    try:
        shown = shown_formula(sample["problem"])
    except Exception as e:  # noqa: BLE001
        errs.append(f"cannot read f(x) from the problem: {e}")
        return
    if simplify(shown - expr) != 0:
        errs.append(f"problem shows f(x) = {shown}, params give {expr}")


def list_set(xs):
    return r"\{" + r",\ ".join(str(v) for v in xs) + r"\}"


def kind_of(inj, surj):
    if inj and surj:
        return "biettiva"
    if inj:
        return "iniettiva"
    if surj:
        return "suriettiva"
    return "nessuna"


def f_int(p, v):
    fam, a, b, c = p["family"], int(p["a"]), int(p["b"]), int(p["c"])
    if fam == "lin":
        if a == 0:
            raise ValueError("linear function with a = 0")
        return a * v + b
    if fam == "quad":
        return v * v + b * v + c
    if fam == "abs":
        return abs(v + b) + c
    raise ValueError(f"unknown family {fam}")


def classify_finite(A, B, images):
    """images[i] = f(A[i]); returns kind, or raises if f does not map A into B."""
    if len(images) != len(A):
        raise ValueError("one image per element of A")
    if any(v not in B for v in images):
        raise ValueError(f"f(A) = {images} not contained in B = {B}")
    inj = len(set(images)) == len(images)
    surj = set(images) == set(B)
    return kind_of(inj, surj)


def classify_real(fam, a, b, k, dom, cod):
    """Facts from the lesson, per family. Raises if f is not a function from dom to cod."""
    NEG = {"R", "Z", "Q"}  # codomains that contain -1
    if fam == "lin":
        if a == 0:
            raise ValueError("a = 0")
        inj = True  # a x1 + b = a x2 + b gives x1 = x2
        if dom == cod == "R" or dom == cod == "Q":
            return kind_of(inj, True)  # x = (y - b)/a is real / rational
        if dom == cod == "Z":
            return kind_of(inj, abs(a) == 1)  # b + 1 has preimage 1/a
        if dom == "R+" and cod == "R":
            return kind_of(inj, False)  # image is a half-line
        if dom == "R+" and cod == "R+":
            if a <= 0 or b < 0:
                raise ValueError("a x + b does not map [0, +inf) into itself")
            return kind_of(inj, b == 0)  # image [b, +inf)
        raise ValueError(f"lin on {dom} -> {cod} not in the spec")
    if fam in ("sq", "abs"):
        if k <= 0:
            raise ValueError("k must be positive")
        shift = b if fam == "abs" else 0
        if fam == "sq" and b != 0:
            raise ValueError("sq has no shift")
        if dom in ("R", "Z", "Q"):
            inj = False  # -shift - t and -shift + t have the same image
        elif dom == "R+" and shift == 0:
            inj = True
        else:
            raise ValueError(f"{fam} on {dom} with shift {shift} not in the spec")
        # the values are >= 0, integers when the domain is Z, rationals when it is Q
        fits = cod in ("R", "R+") or (cod == "Q" and dom in ("Z", "Q")) or (cod in ("Z", "N") and dom == "Z")
        if not fits:
            raise ValueError(f"{fam} does not map {dom} into {cod}")
        if cod in NEG:
            surj = False  # -1 is in the codomain and is never reached
        elif cod == "R+":
            surj = True  # every y >= 0 is k x^2 or k|x + b| for some x of R or [0, +inf)
        else:  # N
            if fam != "abs":
                raise ValueError("N codomain only for |x + b|")
            surj = k == 1  # every n is |x + b| at x = n - b; with k >= 2 the value 1 is missed
        return kind_of(inj, surj)
    if fam == "recip":
        if k == 0 or dom != "R0":
            raise ValueError("k/x needs k != 0 and domain R \\ {0}")
        if cod == "R0":
            return kind_of(True, True)
        if cod == "R":
            return kind_of(True, False)  # 0 is never reached
        raise ValueError(f"k/x to {cod} not in the spec")
    raise ValueError(f"unknown family {fam}")


def check_class_choice(sample, kind, errs):
    ans = sample["answer"]
    if ans.get("kind") != "choice":
        errs.append("answer.kind must be choice")
        return
    opts = ans.get("options", [])
    codes = [o["values"][0] if o.get("values") else None for o in opts]
    if codes != [CODES[k] for k in ORDER]:
        errs.append(f"options must be the four classifications in order, got {codes}")
    idx = ans.get("correct")
    if not isinstance(idx, int) or not 0 <= idx < len(opts) or codes[idx] != CODES[kind]:
        errs.append(f"correct option is not {kind}")
    if sum(1 for c in codes if c == CODES[kind]) != 1:
        errs.append("not exactly one correct option")
    if any(not o.get("latex") for o in opts):
        errs.append("option without latex")
    ch = sample.get("choice")
    if ch is not None and (ch.get("correct") != idx or [o["values"] for o in ch["options"]] != [o["values"] for o in opts]):
        errs.append("choice differs from the answer")
    if sample["params"].get("case") != kind:
        errs.append(f"params.case {sample['params'].get('case')} but the function is {kind}")


def ints(xs):
    out = [int(v) for v in xs]
    if [str(v) for v in out] != list(xs):
        raise ValueError(f"not integer strings: {xs}")
    return out


def check(sample):
    errs = []
    p = sample["params"]
    lvl = sample["level"]
    for name, rx in FORBIDDEN + EXTRA_FORBIDDEN:
        if rx.search(sample["problem"]):
            errs.append(f"problem contains forbidden '{name}': {sample['problem']}")
    if not sample.get("steps"):
        errs.append("no steps")
    if not sample.get("solution"):
        errs.append("no solution")
    kind = None

    if lvl in (1, 3):
        A, B = ints(p["A"]), ints(p["B"])
        if not 3 <= len(A) <= 5 or any(not -3 <= v <= 3 for v in A) or len(set(A)) != len(A):
            errs.append(f"A = {A}: 3 to 5 distinct integers in [-3, 3]")
        if B != sorted(set(B)):
            errs.append("B not sorted or with repeats")
        images = [f_int(p["f"], v) for v in A]
        image = sorted(set(images))
        fp = p["f"]
        a_, b_, c_ = int(fp["a"]), int(fp["b"]), int(fp["c"])
        expr = {"lin": a_ * x + b_, "quad": x**2 + b_ * x + c_, "abs": Abs(x + b_) + c_}[fp["family"]]
        expect_formula(sample, expr, errs)
        for name, xs in (("A", A), ("B", B)):
            if f"{name} = {list_set(xs)}" not in sample["problem"]:
                errs.append(f"problem does not show {name} = {xs}")
        if lvl == 1:
            if any(v not in B for v in image):
                errs.append("f(A) not contained in B")
            if set(B) == set(image):
                errs.append("level 1: B must be larger than the image")
            ans = sample["answer"]
            if ans.get("kind") != "set":
                errs.append("answer.kind must be set")
            elif [int(v) for v in ans["values"]] != image:
                errs.append(f"answer {ans['values']} != image {image}")
            ch = sample.get("choice")
            if ch is not None:
                keys = [tuple(sorted(int(v) for v in o["values"])) for o in ch["options"]]
                if len(keys) != 4 or len(set(keys)) != 4:
                    errs.append(f"choice needs 4 distinct options: {keys}")
                idx = ch.get("correct")
                if not isinstance(idx, int) or not 0 <= idx < len(keys) or keys[idx] != tuple(image):
                    errs.append("choice.correct is not the image")
                if sum(1 for k in keys if k == tuple(image)) != 1:
                    errs.append("not exactly one correct option")
        else:
            kind = classify_finite(A, B, images)
            check_class_choice(sample, kind, errs)
    elif lvl == 2:
        A, B, images = ints(p["A"]), p["B"], p["map"]
        if A != list(range(1, len(A) + 1)) or not 3 <= len(A) <= 5:
            errs.append(f"A = {A}: expected 1..n with 3 <= n <= 5")
        for name, xs in (("A", A), ("B", B)):
            if f"{name} = {list_set(xs)}" not in sample["problem"]:
                errs.append(f"problem does not show {name} = {xs}")
        if B != ["a", "b", "c", "d", "e"][: len(B)] or not 3 <= len(B) <= 5:
            errs.append(f"B = {B}: expected letters a.. with 3 to 5 elements")
        kind = classify_finite(A, B, images)
        # every assignment must be shown in the problem
        for a_, b_ in zip(A, images):
            shown = f"{a_} \\mapsto {b_}" in sample["problem"]
            if p.get("display") == "frecce" and not shown:
                errs.append(f"assignment {a_} -> {b_} missing from the problem")
        if p.get("display") == "tabella":
            row = " & ".join(images)
            if f"f(x) & {row}" not in sample["problem"] or f"x & {' & '.join(map(str, A))}" not in sample["problem"]:
                errs.append("table does not match params")
        check_class_choice(sample, kind, errs)
    elif lvl in (4, 5):
        fam, a, b, k, dom, cod = p["family"], int(p["a"]), int(p["b"]), int(p["k"]), p["dom"], p["cod"]
        allowed = {"R", "R+"} if lvl == 4 else {"Z", "Q", "N", "R0", "R"}
        if dom not in allowed or cod not in allowed or (lvl == 5 and dom == "R"):
            errs.append(f"sets {dom} -> {cod} not allowed at level {lvl}")
        kind = classify_real(fam, a, b, k, dom, cod)
        expr = {"lin": a * x + b, "sq": k * x**2, "abs": k * Abs(x + b), "recip": k / x}[fam]
        expect_formula(sample, expr, errs)
        if f"f: {SETS[dom]} \\to {SETS[cod]}," not in sample["problem"]:
            errs.append(f"problem does not show f: {dom} -> {cod}")
        check_class_choice(sample, kind, errs)
    elif lvl == 6:
        a, b = int(p["a"]), int(p["b"])
        if not 2 <= abs(a) <= 6 or b == 0 or abs(b) > 9:
            errs.append(f"a = {a}, b = {b} out of spec")
        truth = solve(a * x + b - y, x)
        if len(truth) != 1:
            return [f"a x + b = y has {truth} solutions"], None
        inv = truth[0]
        expect_formula(sample, a * x + b, errs)
        if not sample["problem"].startswith(r"f: \mathbb{R} \to \mathbb{R},"):
            errs.append("level 6 must be f: R -> R")
        ans = sample["answer"]
        if ans.get("kind") != "expression":
            errs.append("answer.kind must be expression")
        else:
            given = sympify(ans["value"], locals={"y": y})
            if simplify(given - inv) != 0:
                errs.append(f"answer {ans['value']} != {inv}")
            # the inverse composed with f gives the identity
            if simplify(a * given + b - y) != 0:
                errs.append("f(f^-1(y)) != y")
        ch = sample.get("choice")
        if ch is not None:
            exprs = [sympify(o["values"][0], locals={"y": y}) for o in ch["options"]]
            if len(exprs) != 4:
                errs.append("choice needs 4 options")
            for i in range(len(exprs)):
                for j in range(i + 1, len(exprs)):
                    if simplify(exprs[i] - exprs[j]) == 0:
                        errs.append(f"options {i} and {j} are equal")
            idx = ch.get("correct")
            if not isinstance(idx, int) or not 0 <= idx < len(exprs) or simplify(exprs[idx] - inv) != 0:
                errs.append("choice.correct is not the inverse")
            if sum(1 for e in exprs if simplify(e - inv) == 0) != 1:
                errs.append("not exactly one correct option")
    else:
        errs.append(f"unknown level {lvl}")
    return errs, kind
