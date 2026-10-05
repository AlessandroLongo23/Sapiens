"""Shared checks for the generators of "Sicurezza e cittadinanza digitale" (src/lib/exercises/v2/inf-sic.ts):
virus-malware, password-sicure, inf-phishing, inf-privacy, inf-diritto-autore.

Independent of the generators. Every level is a multiple choice of texts. The id of a piece is in the `values` of
its option; each checker has its own table of what every id is (true or false, which category) and of the words its
text must carry, so that an id cannot be put on another text.
"""
import re

BANNED = re.compile(r"—|–|piuttosto che")
NAMES = ["Anna", "Luca", "Sara", "Marco", "Giulia", "Davide", "Chiara", "Matteo", "Elena", "Tommaso", "Marta", "Pietro"]


def common(sample, errs):
    """What every sample must have. Returns the options, or None when the sample cannot be checked further."""
    if sample.get("format") != "text":
        errs.append("the sample is not written as text")
    steps = sample.get("steps", [])
    prose = " ".join([sample.get("prompt", ""), sample.get("problem", ""), sample.get("solution", ""), *steps])
    if BANNED.search(prose):
        errs.append("banned writing")
    if "\\text{" in prose or "`" in prose:
        errs.append("LaTeX text or code marks in a sample written as text")
    if prose.count("$") % 2:
        errs.append("a formula is not closed")
    if not 1 <= len(steps) <= 3 or any(not s.strip() for s in steps):
        errs.append(f"{len(steps)} steps")
    if not sample.get("prompt", "").strip() or not sample.get("problem", "").strip().endswith("?"):
        errs.append("the problem does not end with a question")
    answer = sample.get("answer", {})
    if answer.get("kind") != "choice":
        errs.append("the answer is not a choice")
        return None
    if "choice" in sample and sample["choice"] != answer:
        errs.append("the choice is not the answer")
    options = answer["options"]
    if len(options) != 4:
        errs.append(f"{len(options)} options")
    if not 0 <= answer["correct"] < len(options):
        errs.append("the right option is not among the options")
        return None
    for o in options:
        if len(o["values"]) != 1 or o.get("text") != o["latex"] or not o["latex"].strip():
            errs.append(f"badly made option {o!r}")
        if BANNED.search(o["latex"]) or "\\text{" in o["latex"] or o["latex"].count("$") % 2:
            errs.append(f"banned writing in option {o['latex']!r}")
    # two options that look the same on the page are the same, whatever their ids say
    looks = {re.sub(r"\s+", " ", o["latex"].replace("\u200b", "")).strip().lower() for o in options}
    if len({o["values"][0] for o in options}) != len(options) or len(looks) != len(options):
        errs.append("two options are the same")
    if any(o["latex"] != o["latex"].strip() for o in options):
        errs.append("an option with spaces around it")
    if sample.get("solution") != options[answer["correct"]]["latex"]:
        errs.append("the solution is not the right option")
    if "case" not in sample.get("params", {}):
        errs.append("no case in params")
    return options


def check_choice(sample, is_right, errs):
    """Exactly one option is right according to `is_right` (which may raise ValueError), and it is the one marked."""
    answer = sample["answer"]
    try:
        rights = [i for i, o in enumerate(answer["options"]) if is_right(o)]
    except ValueError as e:
        errs.append(str(e))
        return
    if rights != [answer["correct"]]:
        errs.append(f"right options {rights}, marked {answer['correct']}")


def bound(option, table):
    """What the table says of the id of an option, after checking that the option carries the words of that id."""
    pid = option["values"][0]
    if pid not in table:
        raise ValueError(f"unknown piece {pid!r}")
    kind, words = table[pid]
    if words.lower() not in option["latex"].lower():
        raise ValueError(f"piece {pid} does not say {words!r}")
    return kind


def has_name(text):
    return any(re.search(rf"\b{n}\b", text) for n in NAMES)


def check_statements(sample, about, table, errs):
    """One true statement among three false ones, or the other way round. `table`: id -> (True/False, words)."""
    m = re.fullmatch(rf"Quale di queste affermazioni {re.escape(about)} è (vera|falsa)\?", sample["problem"])
    if not m:
        errs.append(f"text not recognised: {sample['problem']!r}")
        return None
    want = m.group(1) == "vera"
    check_choice(sample, lambda o: bound(o, table) == want, errs)
    if sample["params"].get("case") != m.group(1):
        errs.append("wrong case")
    return m.group(1)


def check_situation(sample, table, errs):
    """A situation and what to do. `table`: id -> (words of the situation, words of the right thing to do)."""
    sid = sample["params"].get("case")
    if sid not in table:
        errs.append(f"unknown situation {sid!r}")
        return None
    in_problem, in_right = table[sid]
    if in_problem.lower() not in sample["problem"].lower():
        errs.append(f"situation {sid} does not say {in_problem!r}")
    if not has_name(sample["problem"]):
        errs.append("no known name in the situation")

    def right(o):
        value = o["values"][0]
        if not re.fullmatch(rf"{re.escape(sid)}\.(ok|w\d)", value):
            raise ValueError(f"option {value!r} is not of situation {sid}")
        says = in_right.lower() in o["latex"].lower()
        if says != value.endswith(".ok"):
            raise ValueError(f"option {value!r} and its text disagree")
        return says

    check_choice(sample, right, errs)
    return sid


def sort_by_words(text, table, errs):
    """The only category of `table` (category -> list of words) whose words are in the text, or None."""
    found = [kind for kind, words in table.items() if any(w in text for w in words)]
    if len(found) != 1:
        errs.append(f"the text fits {len(found)} categories: {found}")
        return None
    return found[0]


def check_sorted(sample, ask, labels, words, errs, named=True):
    """A text to sort into a category. `labels`: category -> label of its option; `words`: category -> words."""
    problem = sample["problem"]
    if not problem.endswith(" " + ask):
        errs.append(f"text not recognised: {problem!r}")
        return None
    text = problem[: -len(ask) - 1]
    if named and not has_name(text):
        errs.append("no known name in the text")
    kind = sort_by_words(text, words, errs)
    if kind is None:
        return None

    def which(o):
        k = o["values"][0]
        if labels.get(k) != o["latex"]:
            raise ValueError(f"option {o['latex']!r} is not the category {k!r}")
        return k == kind

    check_choice(sample, which, errs)
    if sample["params"].get("case") != kind:
        errs.append("wrong case")
    return kind
