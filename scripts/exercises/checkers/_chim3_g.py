"""Shared helpers for the checkers of chemistry, third year, group G (chim-polarita-molecole, chim-legame-valenza,
chim-ibridazione): the multiple choice of a sample whose answer may be a number, and a few readers of LaTeX.
"""
import re

from checkers._fis_grandezze import BANNED, check_choice


def choice_of(sample, errs):
    """The multiple choice: the answer itself, or the choice variant of a sample whose answer is a number. For a number
    the right option must carry that number."""
    a = sample.get("answer", {})
    if a.get("kind") == "choice":
        return a
    if a.get("kind") != "number":
        errs.append(f"answer kind {a.get('kind')!r}")
        return None
    ch = sample.get("choice")
    if not ch or ch.get("kind") != "choice":
        errs.append("number answer without a choice variant")
        return None
    return ch


def common_g(sample, errs):
    if not sample.get("steps"):
        errs.append("no steps")
    text = sample["problem"] + " ".join(sample["steps"]) + sample.get("solution", "")
    if BANNED.search(text):
        errs.append("forbidden words")


def check_number(sample, want, errs):
    """Level with a whole number as the answer: the number, and the choice whose right option is that number."""
    ch = choice_of(sample, errs)
    if ch is None:
        return
    if sample["answer"]["kind"] != "number":
        errs.append("the answer should be a number")
    elif sample["answer"]["value"] != str(want):
        errs.append(f"answer {sample['answer']['value']}, expected {want}")
    check_choice(ch, lambda o: o["latex"] == str(want), errs)


def mathrm(tex):
    """\\mathrm{C_6H_{14}} -> 'C_6H_{14}'."""
    m = re.fullmatch(r"\\mathrm\{((?:[^{}]|\{[^{}]*\})*)\}", tex.strip())
    if not m:
        raise ValueError(f"not a formula: {tex!r}")
    return m.group(1)


def art(name):
    if name == "iodio" or re.match(r"(z|s[^aeiou])", name):
        return "lo " + name
    if name[0] in "aeiou":
        return "l'" + name
    return "il " + name


def cap(s):
    return s[0].upper() + s[1:]
