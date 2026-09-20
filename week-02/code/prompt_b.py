def analyze_marks(marks, pass_mark=50):
    if not marks:
        raise ValueError("marks list is empty")

    for m in marks:
        # bool is a subclass of int, so check it separately
        if isinstance(m, bool) or not isinstance(m, (int, float)):
            raise ValueError(f"non-numeric value: {m!r}")
        if not 0 <= m <= 100:
            raise ValueError(f"mark out of range (0-100): {m}")

    n = len(marks)
    passed = sum(1 for m in marks if m >= pass_mark)

    return {
        "average": sum(marks) / n,
        "highest": max(marks),
        "lowest": min(marks),
        "pass_rate": passed / n * 100,
    }


print(analyze_marks([45, 70, 88, 50, 32]))
# {'average': 57.0, 'highest': 88, 'lowest': 32, 'pass_rate': 60.0}

"""
How it works

It raises ValueError if the list is empty.
It checks every value before calculating anything. Anything that isn't an int or float raises ValueError, including strings, None and True/False. Values outside 0-100 also raise ValueError.
NaN fails the 0 <= m <= 100 check, so it raises too.
pass_rate is the percentage of marks that are >= pass_mark. A mark equal to pass_mark counts as a pass. If you'd rather have a fraction (0.6) than a percentage (60.0), remove the * 100.
"""