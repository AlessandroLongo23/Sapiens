"""Shared checks for the generators of the lessons on the services of Internet (src/lib/exercises/v2/inf-web2.ts):
inf-servizi-internet, inf-ricerca-informazioni, cloud. All levels are multiple choice, written as text.

Independent of the generators: each checker keeps its own table of what is true and rebuilds the right option from
the text of the question and from the pieces in `params`.
"""
import re

BANNED = re.compile(r"—|–|piuttosto che")
NAMES = ["Giulia", "Marco", "Sara", "Luca", "Anna", "Matteo", "Elena", "Davide", "Chiara", "Tommaso", "Irene", "Pietro"]


def common(sample):
    """What every sample of these generators must have. Returns the list of errors."""
    errors = []
    if sample.get("format") != "text":
        errors.append("the sample is not written as text")
    steps = sample.get("steps", [])
    if not 2 <= len(steps) <= 3 or not all(s.strip() for s in steps):
        errors.append("the steps are not two or three sentences")
    if not sample.get("solution", "").strip() or not sample.get("prompt", "").strip() or not sample.get("problem", "").strip():
        errors.append("an empty prompt, problem or solution")
    answer = sample.get("answer", {})
    if answer.get("kind") != "choice":
        return errors + ["the answer is not a choice"]
    options = answer["options"]
    prose = " ".join([sample["prompt"], sample["problem"], sample["solution"], *steps, *[o["latex"] for o in options]])
    if BANNED.search(prose):
        errors.append("banned writing")
    if "\\text{" in prose:
        errors.append("LaTeX text in a sample written as text")
    if "undefined" in prose or "NaN" in prose or "  " in prose:
        errors.append("a hole in the text")
    if len(options) != 4:
        errors.append(f"{len(options)} options")
    if not 0 <= answer["correct"] < len(options):
        return errors + ["the right option is not among the options"]
    if len({"|".join(o["values"]) for o in options}) != len(options):
        errors.append("two options have the same value")
    if len({o["latex"] for o in options}) != len(options):
        errors.append("two options read the same")
    for o in options:
        if not o["latex"].strip() or len(o["values"]) != 1:
            errors.append("an option without a text or without one value")
    if "case" not in sample.get("params", {}):
        errors.append("no case in params")
    return errors


def right_option(sample):
    answer = sample["answer"]
    return answer["options"][answer["correct"]]


def check_choice(sample, is_right, errors):
    """Exactly one option must be right according to `is_right`, and it must be the one marked."""
    answer = sample["answer"]
    try:
        flags = [bool(is_right(o)) for o in answer["options"]]
    except (ValueError, KeyError, IndexError) as e:
        errors.append(f"an option cannot be read: {e}")
        return
    if sum(flags) != 1:
        errors.append(f"{sum(flags)} options are right")
    elif not flags[answer["correct"]]:
        errors.append("the option marked is not the right one")


def check_solution(sample, errors):
    """The solution names the right option."""
    label = right_option(sample)["latex"]
    if label.lower() not in sample["solution"].lower():
        errors.append("the solution is not the right option")


def check_statements(sample, about, table, errors):
    """A true-or-false level: `table` is {id: (truth, words the statement must contain)}. Returns the case."""
    m = re.fullmatch(rf"Quale di queste affermazioni {re.escape(about)} è (vera|falsa)\?", sample["problem"])
    if not m:
        errors.append(f"statement question not recognised: {sample['problem']!r}")
        return None
    want = m.group(1) == "vera"

    def truth(o):
        sid = o["values"][0]
        if sid not in table:
            raise ValueError(f"unknown statement {sid!r}")
        value, words = table[sid]
        if words.lower() not in o["latex"].lower():
            raise ValueError(f"statement {sid} does not say {words!r}")
        return value

    check_choice(sample, lambda o: truth(o) == want, errors)
    return m.group(1)


def people(names_text):
    """'Luca', 'Luca e Sara', 'Luca, Sara e Anna' -> the list of names."""
    return [n for n in re.split(r", | ed? ", names_text) if n]
