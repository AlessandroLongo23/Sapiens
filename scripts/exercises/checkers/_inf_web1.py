"""Shared helpers for the checkers of the first four lessons of "Internet e il web" (internet, inf_client_server,
inf_indirizzi_domini, http_html). Every level is a multiple choice of four text options.

A checker decides which option is right from its own tables and from the text of the question, with a predicate on
one option; `one_right` then asks that exactly one option passes it, and that it is the one marked as right.
"""
import re

from checkers._inf_programmi import common

ZWSP = "\u200b"  # where a long URL or name may go to a new line
NARROW = "\u202f"  # between the thousands
NAMES = ["Anna", "Luca", "Sara", "Marco", "Giulia", "Paolo", "Elena", "Davide", "Chiara", "Matteo", "Marta", "Simone"]


def unbroken(sample):
    """The sample with its question as it reads, without the places where a long name may go to a new line."""
    return {**sample, "problem": sample["problem"].replace(ZWSP, "")}


def start(sample):
    """The checks every sample of these generators passes. Returns the list of errors."""
    errors = common(sample)
    answer = sample.get("answer", {})
    if answer.get("kind") != "choice":
        return errors + ["the answer is not a choice"]
    if not 1 <= len(sample["steps"]) <= 3 or any(not s.strip() for s in sample["steps"]):
        errors.append("the steps are not one to three sentences")
    for o in answer["options"]:
        if o.get("text") != o["latex"].replace(ZWSP, "") or not o["latex"].strip() or len(o["values"]) != 1:
            errors.append(f"an option is not a plain text with one value: {o!r}")
        if "chart" in o or "code" in o:
            errors.append("an option is not a text")
    options = answer["options"]
    if 0 <= answer["correct"] < len(options) and sample["solution"] != options[answer["correct"]]["latex"]:
        errors.append("the solution is not the text of the right option")
    if len({o["latex"] for o in options}) != len(options):
        errors.append("two options read the same")
    text = " ".join([sample["prompt"], sample["problem"], sample["solution"], *sample["steps"], *[o["latex"] for o in options]])
    if text.count("$") % 2:
        errors.append("an odd number of $")
    if "`" in text:
        errors.append("a backtick in a text")
    return errors


def one_right(sample, is_right, errors):
    """Exactly one option passes `is_right` (which may raise ValueError on an option it cannot read), the marked one."""
    answer = sample["answer"]
    flags = []
    for o in answer["options"]:
        try:
            flags.append(bool(is_right(o)))
        except ValueError as e:
            errors.append(str(e))
            return
    if sum(flags) != 1:
        errors.append(f"{sum(flags)} right options: {[o['values'][0] for o, f in zip(answer['options'], flags) if f]}")
    elif not flags[answer["correct"]]:
        errors.append("the option marked as right is not the right one")


def kind_of(table):
    """From a table {id: (kind, words)}: the kind of an option, after checking that its text has the words."""

    def kind(o):
        key = o["values"][0]
        if key not in table:
            raise ValueError(f"unknown piece {key!r}")
        what, words = table[key]
        if words.lower() not in o["latex"].lower():
            raise ValueError(f"piece {key} does not say {words!r}: {o['latex']!r}")
        return what

    return kind


def same_case(sample, case, errors):
    if sample["params"].get("case") != case:
        errors.append(f"params.case is {sample['params'].get('case')!r}, the question is {case!r}")
    return case


def check_statements(sample, about, table, errors):
    """Level "vero o falso": `table` is {id: (True or False, words)}."""
    m = re.fullmatch(rf"Quale di queste affermazioni {re.escape(about)} è (vera|falsa)\?", sample["problem"])
    if not m:
        errors.append(f"text not recognised: {sample['problem']!r}")
        return None
    want = m.group(1) == "vera"
    kind = kind_of(table)
    one_right(sample, lambda o: kind(o) == want, errors)
    return same_case(sample, m.group(1), errors)


def number(text):
    """'3 000 000' or '1500' -> the whole number."""
    s = text.strip().replace(NARROW, "")
    if not re.fullmatch(r"\d+", s):
        raise ValueError(f"not a whole number: {text!r}")
    return int(s)


def shown(n):
    """A whole number as the lessons write it: narrow spaces from five digits on."""
    return str(n) if n < 10000 else f"{n:,}".replace(",", NARROW)


def plain(o):
    """The text of an option that is a URL, a name or an address, which must read as its value."""
    text = o["latex"].replace(ZWSP, "")
    if text != o["values"][0]:
        raise ValueError(f"option {o['latex']!r} does not read as its value")
    return text


def name_in(text, errors):
    if not any(re.search(rf"\b{n}\b", text) for n in NAMES):
        errors.append("no known name in the text")
