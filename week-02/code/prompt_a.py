"""
Here's the script. It runs as-is with sample data and only uses the standard library. It covers:

Average mark per student, ranked, with a letter grade
Average, max, and min per subject
Best and worst student
Class mean, median, and standard deviation
Grade distribution
Students with any mark below 50

To use your own data, edit the subjects list and the marks dict at the top. If your marks are in a CSV file, I can rewrite it to read from that, or switch it to pandas with charts.
"""

# student marks analysis
import statistics as st

subjects = ["Math", "Physics", "Kazakh", "English"]

marks = {
    "Aigerim": [85, 90, 78, 92],
    "Dana":    [95, 88, 91, 97],
    "Arman":   [60, 55, 70, 65],
    "Timur":   [72, 68, 80, 75],
    "Madina":  [45, 50, 62, 58],
    "Ruslan":  [88, 92, 85, 79],
}


def grade(m):
    if m >= 90:
        return "A"
    elif m >= 75:
        return "B"
    elif m >= 60:
        return "C"
    elif m >= 50:
        return "D"
    return "F"


# average for each student
avgs = {n: st.mean(m) for n, m in marks.items()}

print("=== Student averages ===")
for n, a in sorted(avgs.items(), key=lambda x: x[1], reverse=True):
    print(f"{n:<10} {a:6.2f}  {grade(a)}")

# average for each subject
print("\n=== Subject averages ===")
for i, s in enumerate(subjects):
    col = [m[i] for m in marks.values()]
    print(f"{s:<8} avg={st.mean(col):.2f}  max={max(col)}  min={min(col)}")

# best and worst student
best = max(avgs, key=avgs.get)
worst = min(avgs, key=avgs.get)
print(f"\nBest student:  {best} ({avgs[best]:.2f})")
print(f"Worst student: {worst} ({avgs[worst]:.2f})")

# class stats
all_m = [x for m in marks.values() for x in m]
print(f"\nClass mean:   {st.mean(all_m):.2f}")
print(f"Class median: {st.median(all_m)}")
print(f"Std dev:      {st.stdev(all_m):.2f}")

# grade distribution
dist = {}
for a in avgs.values():
    g = grade(a)
    dist[g] = dist.get(g, 0) + 1

print("\n=== Grade distribution ===")
for g in "ABCDF":
    print(f"{g}: {'#' * dist.get(g, 0)} ({dist.get(g, 0)})")

# students who failed at least one subject (mark < 50)
print("\n=== Need help (mark < 50) ===")
for n, m in marks.items():
    bad = [subjects[i] for i, x in enumerate(m) if x < 50]
    if bad:
        print(n, "->", ", ".join(bad))