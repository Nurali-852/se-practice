l = input().split(",")

valid = 0
passing = 0
ans = list()

for i in l:
    i = i.strip()

    try:
        n = int(i)
    except ValueError:
        continue

    if n >= 0 and n <= 100:
        valid += 1
        ans.append(n)

        if n >= 50:
            passing += 1

if valid == 0:
    print("Failed the course")
else:
    avg = sum(ans) / valid
    passr = passing / valid * 100
    print("Valid:", valid, "Average:", avg, "Highest:", max(ans), "Lowest:", min(ans), "Passing rate:", str(passr) + "%")