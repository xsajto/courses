#!/usr/bin/env python3
"""Validate lessons 201-612 CSV files for the touch-typing tutor."""

import csv
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent / "resources" / "deseti-prsty"

# Reference milestones from lessons-004-600.csv (authoritative source)
REFERENCE_FILE = Path(__file__).resolve().parent.parent / "lessons-004-600.csv"

# Character progression
BASE_CHARS = set("acdeijklnoprstuv ACDEIJKLNOPRSTUV.")
H_CHARS = BASE_CHARS | set("hH")          # L211+
Y_CHARS = H_CHARS | set("yY")             # L230+
M_CHARS = Y_CHARS | set("mM")             # L247+
I_ACCENT = M_CHARS | set("í")             # L262+
Z_CHARS = I_ACCENT | set("zZ")            # L282+
E_HACEK = Z_CHARS | set("ě")              # L301+
A_ACCENT = E_HACEK | set("á")             # L351+
B_CHARS = A_ACCENT | set("bB")            # L383+
Y_ACCENT = B_CHARS | set("ý")             # L410+
COMMA = Y_ACCENT | set(",")               # L445+
R_HACEK = COMMA | set("řŘ")              # L472+
E_ACCENT = R_HACEK | set("é")            # L501+
HYPHEN = E_ACCENT | set("-")              # L530+
S_HACEK = HYPHEN | set("šŠ")             # L551+
Z_HACEK = S_HACEK | set("žŽ")            # L584+


def get_charset(lesson_num):
    """Return allowed character set for a given lesson number."""
    if lesson_num < 211:
        return BASE_CHARS
    elif lesson_num < 230:
        return H_CHARS
    elif lesson_num < 247:
        return Y_CHARS
    elif lesson_num < 262:
        return M_CHARS
    elif lesson_num < 282:
        return I_ACCENT
    elif lesson_num < 301:
        return Z_CHARS
    elif lesson_num < 351:
        return E_HACEK
    elif lesson_num < 383:
        return A_ACCENT
    elif lesson_num < 410:
        return B_CHARS
    elif lesson_num < 445:
        return Y_ACCENT
    elif lesson_num < 472:
        return COMMA
    elif lesson_num < 501:
        return R_HACEK
    elif lesson_num < 530:
        return E_ACCENT
    elif lesson_num < 551:
        return HYPHEN
    elif lesson_num < 584:
        return S_HACEK
    else:
        return Z_HACEK


def get_length_range(lesson_num):
    """Return (min_length, max_length) for a lesson."""
    if lesson_num >= 601:
        return (220, 270)
    return (180, 225)


def load_reference_milestones():
    """Load milestone content from the reference file."""
    milestones = {}
    ref_path = REFERENCE_FILE
    if not ref_path.exists():
        print(f"WARNING: Reference file {ref_path} not found, skipping milestone comparison")
        return milestones
    with open(ref_path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        for row in reader:
            if len(row) >= 2:
                num = int(row[0])
                if 201 <= num <= 612:
                    milestones[num] = row[1]
    return milestones


def validate_file(filepath, start, end, milestones_ref, errors):
    """Validate a single CSV file."""
    expected_count = end - start + 1

    if not filepath.exists():
        errors.append(f"MISSING: {filepath}")
        return []

    with open(filepath, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader)
        if header != ['lesson', 'content']:
            errors.append(f"{filepath.name}: Bad header: {header}")
        rows = list(reader)

    if len(rows) != expected_count:
        errors.append(f"{filepath.name}: {len(rows)} rows (expected {expected_count})")

    lessons = {}
    prev = start - 1
    for row in rows:
        if len(row) < 2:
            errors.append(f"{filepath.name}: Short row: {row}")
            continue
        num = int(row[0])
        content = row[1]
        lessons[num] = content

        # Sequential check
        if num != prev + 1:
            errors.append(f"{filepath.name}: Gap at L{num} (expected {prev + 1})")
        prev = num

        # Milestone preservation check
        if num in milestones_ref:
            if content != milestones_ref[num]:
                errors.append(f"{filepath.name} L{num}: Milestone MODIFIED!")
                errors.append(f"  Expected: {milestones_ref[num][:80]}...")
                errors.append(f"  Got:      {content[:80]}...")
            continue  # Don't validate charset/length for milestones

        # Character set check
        allowed = get_charset(num)
        bad_chars = sorted(set(c for c in content if c not in allowed))
        if bad_chars:
            bad_display = ', '.join(f"'{c}' (U+{ord(c):04X})" for c in bad_chars[:5])
            errors.append(f"{filepath.name} L{num}: Forbidden chars: {bad_display}")

        # Length check
        min_len, max_len = get_length_range(num)
        content_len = len(content)
        if content_len < min_len or content_len > max_len:
            errors.append(f"{filepath.name} L{num}: length={content_len} (need {min_len}-{max_len})")

    return lessons


def main():
    print("=" * 60)
    print("Validating lessons 201-612")
    print("=" * 60)

    milestones_ref = load_reference_milestones()
    print(f"Loaded {len(milestones_ref)} reference milestones")

    errors = []
    all_lessons = {}

    files = [
        ("lessons-201-250.csv", 201, 250),
        ("lessons-251-300.csv", 251, 300),
        ("lessons-301-350.csv", 301, 350),
        ("lessons-351-400.csv", 351, 400),
        ("lessons-401-450.csv", 401, 450),
        ("lessons-451-500.csv", 451, 500),
        ("lessons-501-550.csv", 501, 550),
        ("lessons-551-612.csv", 551, 612),
    ]

    for filename, start, end in files:
        filepath = BASE_DIR / filename
        print(f"\n--- {filename} (L{start}-L{end}) ---")
        lessons = validate_file(filepath, start, end, milestones_ref, errors)
        all_lessons.update(lessons)

    # Check complete sequence 201-612
    print(f"\n--- Global checks ---")
    missing = [n for n in range(201, 613) if n not in all_lessons]
    if missing:
        errors.append(f"Missing lessons: {missing[:20]}{'...' if len(missing) > 20 else ''}")

    total = len(all_lessons)
    expected_total = 412
    print(f"Total lessons: {total} (expected {expected_total})")

    # Summary
    print(f"\n{'=' * 60}")
    if errors:
        print(f"ERRORS FOUND: {len(errors)}")
        for e in errors:
            print(f"  {e}")
        sys.exit(1)
    else:
        print("ALL VALID! 412 lessons, sequential 201-612, all constraints met.")
        sys.exit(0)


if __name__ == "__main__":
    main()
