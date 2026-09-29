# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name:
Student ID:
GitHub username:

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | Claude|
| Exact model name and version | Sonnet 5 Low|
| Date of the session | 27.09.2026|
| Diagram renderer used | |

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```
User Stories — Smart Campus Study Room Booking

1. View Availability
As a Student, I want to view which rooms are free and when, so that I can find a suitable time slot before booking.

Priority: High
Assumption: Availability is shown as a schedule/grid of rooms against time slots, visible to any logged-in student.

2. Book Room
As a Student, I want to reserve a free room for a specific future time slot, so that I have a guaranteed space for individual or group study.

Priority: High
Assumption: A booking request is rejected if it starts in the past, exceeds two hours, or overlaps an existing booking for that room (R1, R2, R3).

3. Cancel Booking
As a Student, I want to cancel a booking I made, so that I can release the room if my plans change.

Priority: High
Assumption: A student can only cancel their own bookings, not those made by others.

4. Receive Booking Confirmation
As a Student, I want to receive a confirmation when my booking is made or cancelled, so that I know the action was successfully recorded.

Priority: High
Assumption: Confirmation is a single system message tied directly to the booking or cancellation event, not a reminder or scheduled notification.

5. Block a Room
As an Administrator, I want to take a room out of service, so that students cannot book it while it is unusable for study.

Priority: High
Assumption: Blocking a room does not automatically cancel bookings already made before the block (scenario doesn't settle this, so admin handles conflicts manually if any exist).

6. Unblock a Room
As an Administrator, I want to return a blocked room to service, so that students can book it again once it's usable.

Priority: Medium
Assumption: An unblocked room immediately becomes visible in availability views with no residual restriction.

7. Review Room Usage
As an Administrator, I want to see how rooms are being used over a period, so that I can understand booking patterns and room demand.

Priority: Medium
Assumption: Usage review is a read-only report of past and current bookings per room over a selected date range.

8. Enforce Booking Duration Limit
As a Student, I want the system to prevent me from booking a room for more than two hours, so that room time is shared fairly among students.

Priority: Medium
Assumption: A booking of exactly two hours is allowed; the system rejects only durations exceeding two hours (R2).
```

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
|As a Student, I want to view which rooms are free and when, so that I can find a suitable time slot before booking.|Kept unchanged |Role, goal and reason stated exactly as needed|US-01 |
|As a Student, I want to reserve a free room for a specific future time slot, so that I have a guaranteed space for individual or group study.|Kept unchanged|Role, goal and reason stated exactly as needed|US-02|
|As a Student, I want to cancel a booking I made, so that I can release the room if my plans change.|Kept unchanged|Role, goal and reason stated exactly as needed|US-03|
|As a Student, I want to receive a confirmation when my booking is made or cancelled, so that I know the action was successfully recorded.|Kept unchanged|Role, goal and reason stated exactly as needed|US-04|
|As an Administrator, I want to take a room out of service, so that students cannot book it while it is unusable for study.|Kept unchanged|Role, goal and reason stated exactly as needed|US-05|
|As an Administrator, I want to return a blocked room to service, so that students can book it again once it's usable.|Kept unchanged|Role, goal and reason stated exactly as needed|US-06|
|As an Administrator, I want to see how rooms are being used over a period, so that I can understand booking patterns and room demand.|Kept unchanged|Role, goal and reason stated exactly as needed|US-07|
|As a Student, I want the system to prevent me from booking a room for more than two hours, so that room time is shared fairly among students.|Kept unchanged|Role, goal and reason stated exactly as needed. As result system should reject booking|US-08|

**Did the assistant invent anything outside the scenario?** No, cause after checking it against out-of-scope section AI didn't add anything out of scenario. It just applied rule to existing commands (2 hour rule).

**How many stories did you end with, and why that number?**
7 stories: 5 per 1 command, 2 story for remaining command about blocking and unblocking room.

---

## 4. Original AI output — acceptance criteria (Part 3)

```
Assumptions

"Blocked rooms" refers to rooms an admin has marked unavailable (maintenance, reserved for staff, etc.), separate from ordinary bookings.
Times are compared using the system's current date/time; a booking "in the future" means its start time is later than now.
Duration = end time − start time; exactly 2 hours is allowed, anything over is rejected.
Overlap check compares the new booking's [start, end) range against existing bookings for the same room only.
Cancellation is restricted to the booking's owner (no admin override covered here).
1. View Availability

AC1 — Successful behavior
Given I am a logged-in student
When I open the room availability schedule
Then I see all rooms with their booked and free time slots for the selected date

AC2 — Blocked room shown correctly
Given a room has been marked as blocked by an admin
When I view the availability schedule
Then that room appears as unavailable for the blocked period and cannot be selected for booking

AC3 — No availability data
Given no rooms have any bookings or blocks for the selected date
When I view the availability schedule
Then all rooms display as fully free for that date 

2. Book Room

AC1 — Successful booking
Given a room is free for a future time slot of two hours or less
When I submit a booking request for that room and time slot
Then the booking is created and the room shows as reserved for that period

AC2 — Validation: past start time
Given I select a start time that is earlier than the current date/time
When I submit the booking request
Then the system rejects the booking and displays an error stating bookings must be in the future

AC3 — Validation: duration exceeds limit
Given I select a start and end time spanning more than two hours
When I submit the booking request
Then the system rejects the booking and displays an error stating the maximum duration is two hours

AC4 — Error: overlapping booking
Given the selected room already has a booking that overlaps my requested time slot
When I submit the booking request
Then the system rejects the booking and displays an error indicating the room is already booked for that period

AC5 — Error: blocked room
Given the selected room is marked as blocked for the requested time slot
When I submit the booking request
Then the system rejects the booking and displays an error indicating the room is unavailable

3. Cancel Booking

AC1 — Successful cancellation
Given I have an existing future booking
When I choose to cancel that booking
Then the booking is removed and the room becomes free for that time slot

AC2 — Validation: cancelling another user's booking
Given a booking exists that was made by a different student
When I attempt to cancel that booking
Then the system rejects the action and displays an error stating I can only cancel my own bookings

AC3 — Error: booking no longer exists
Given a booking has already been cancelled or has passed
When I attempt to cancel it again
Then the system displays an error indicating the booking cannot be found or is no longer active
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
|Given I am a logged-in student When I open the room availability schedule Then I see all rooms with their booked and free time slots for the selected date |no problem |kept unchanged |AC-01|
|Given a room has been marked as blocked by an admin When I view the availability schedule Then that room appears as unavailable for the blocked period and cannot be selected for booking |no problem |kept unchanged |AC-02|
|Given no rooms have any bookings or blocks for the selected date When I view the availability schedule Then all rooms display as fully free for that date |no problem |kept unchanged |AC-03|
|Given a room is free for a future time slot of two hours or less When I submit a booking request for that room and time slot Then the booking is created and the room shows as reserved for that period|no problem|kept unchanged|AC-04|
|Given I select a start time that is earlier than the current date/time When I submit the booking request Then the system rejects the booking and displays an error stating bookings must be in the future|no problem|kept unchanged|AC-05|
|Given I select a start and end time spanning more than two hours When I submit the booking request Then the system rejects the booking and displays an error stating the maximum duration is two hours| no problem|kept unchanged|AC-06|
|Given the selected room already has a booking that overlaps my requested time slot When I submit the booking request Then the system rejects the booking and displays an error indicating the room is already booked for that period|no problem|kept unhanged|AC-07|
|Given the selected room is marked as blocked for the requested time slot When I submit the booking request Then the system rejects the booking and displays an error indicating the room is unavailable|no problem|kept unhanged|AC-08|
|Given I have an existing future booking When I choose to cancel that booking Then the booking is removed and the room becomes free for that time slot|no problem|kept unhanged|AC-09|
|Given a booking exists that was made by a different student When I attempt to cancel that booking Then the system rejects the action and displays an error stating I can only cancel my own bookings|User should only see his reservation, so that he cannot interact with other's reservations|Remove that option at all for booking that user didn't made |AC-10|
|Given a booking has already been cancelled or has passed When I attempt to cancel it again Then the system displays an error indicating the booking cannot be found or is no longer active| no problem | kept unchanged| AC-11|

**The two open questions.** Write your decision and the reason. Either answer is accepted.

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | allowed | It follows as [start, end) so it does not include exactly 2 hours. Reservation before ends 1 min earlier, that it borrowed from starting time|
| Is exactly two hours allowed under R2? | allowed |If we follow scheme that stated above there is no problem with 2 hour booking, cause it has exact amount of time that can be calculated|

**Which invalid or boundary case did the assistant leave out?**  
The case when users book not perfect time, for example if student books for 30 mins, other one only for 50 mins it will quickly became a mess. So to avoid that student should have only 4 options to choose from 30, 60, 90, 120 mins. That way it will be easy to book and easy to manage

---

## 6. Original AI output — use-case diagram (Part 4)

```
@startuml
left to right direction
skinparam packageStyle rectangle

actor Student
actor Administrator

rectangle "Smart Campus Study Room Booking System" {
  usecase "View availability" as UC1
  usecase "Book room" as UC2
  usecase "Cancel booking" as UC3
  usecase "Block or unblock room" as UC4
  usecase "Review usage" as UC5
  usecase "Send confirmation" as UC6
}

Student --> UC1
Student --> UC2
Student --> UC3

Administrator --> UC4
Administrator --> UC5

UC2 ..> UC1 : <<include>>
UC2 ..> UC6 : <<include>>
UC3 ..> UC6 : <<include>>
@enduml
```

Rendered diagram (image, or a link):  

https://img.plantuml.biz/plantuml/png/TLB9QiCm4BqR_0-Ft1DejaC98Qd_8AQzJsJ55T5Yf76AAVttIebReYutQTwcUMWNc3ptHfU5bYS6EtZLlZ8QvQLWvMnPXBEo7Naow4YSgPKr3reYuMHRBSkYB4YmywYvRwJbh-k-CSggm9xYBR6-9PZK9kQY8jFruQeRS73EuCcv6DUY7W9BCy5xMG1za892LBqe-GQwaD9qL5hnC045F5SF6Ijvm4Ut4PrdQ4LMI8tZBMYaB783xSGPSOFU7g_7ExDbnZp8ItfI7s8j8s6L4Mff6mXdJyeRIdsEh7LPVAHAniemdMvlU-I3-S_18ecoOaTW-VTubVZH1xFPDG2Fs6oK5JgQRhVtqFetjFWFsiMjugVv1000
---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| Book room|View availabilty should <include> Book room, because before booking a room you need to check if it is available. In case of confirmation it goes after action, so according to logic view must be before book room|Move arrow that goes from book room, so that it will go from view availability|

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.  
Naming arrow <include> and linking book room and view availability 

**Did any screen, database or internal component appear as a use case or an actor?** No

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them: No
- Stories with **no use case** they belong to: No
- Criteria that test **no rule** from section 1: AC-05, AC-06

**What does the largest gap tell you about the generated requirements?**  
overall requirments were clear, all  major points made correctly. But if the gap is big it tells that generated requirements does not apply to system so it is incorrect result

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.
I run tests/check_requirements.py twice, because I didn't know that we should have had filled those files. And about IDs, cause it said Final ID I thought I should have haad decided to which UC-nn it should belong, but I found out after first run that it was a mistake. So I paste second run after fixing things above.

```
$ python tests/check_requirements.py
FAIL   US-1  user-stories.md         2 TODO placeholder(s) left in the file
PASS   US-2  user-stories.md         8 stories, IDs US-01…US-08
PASS   US-3  user-stories.md         every story has the required sentence shape
PASS   US-4  user-stories.md         every story has a priority
PASS   US-5  user-stories.md         every story declares an assumption
PASS   US-6  user-stories.md         only Student and Administrator appear as roles
FAIL   US-7  user-stories.md         out-of-scope vocabulary: reminder — either the assistant widened the scenario, or say why in lab-report.md
PASS   AC-1  acceptance-criteria.md  no placeholders left
PASS   AC-2  acceptance-criteria.md  three sections, all naming real stories: US-01, US-02, US-03
PASS   AC-3  acceptance-criteria.md  every section has 3 to 5 uniquely numbered criteria
PASS   AC-4  acceptance-criteria.md  all 11 criteria are complete Given/When/Then
PASS   AC-5  acceptance-criteria.md  every section covers an invalid or boundary case
PASS   AC-6  acceptance-criteria.md  3 assumptions listed before the criteria
PASS   AC-7  acceptance-criteria.md  both open questions are settled in the assumptions
PASS   PU-1  use-cases.puml          valid PlantUML block, no placeholders
PASS   PU-2  use-cases.puml          exactly two actors: Student, Administrator
PASS   PU-3  use-cases.puml          all six use cases present
PASS   PU-4  use-cases.puml          system boundary present
PASS   PU-5  use-cases.puml          no screens, databases or internal components
PASS   PU-6  use-cases.puml          no unjustified actor associations found
FAIL   TR-1  traceability.md         2 TODO placeholder(s) left in the table
PASS   TR-2  traceability.md         every ID in the table resolves
FAIL   TR-3  traceability.md         stories that appear nowhere in the table: US-05, US-06 — list them under 'Stories that belong to no use case' if that is the finding
------------------------------------------------------------------------
19 PASS · 4 FAIL · 0 ERROR   (23 checks)
Every FAIL goes in lab-report.md section 9 with what you decided about it.
A FAIL you report and explain costs you nothing. One you hide costs the criterion.
```

Again second run cause didn't fully fill out remaining AI-usage etc.
```
$ python tests/validate_submission.py
submission.yml — submission.yml
------------------------------------------------------------------------
PASS   schema                                    1
PASS   week                                      03
PASS   student.name                              Nurali
PASS   student.student_id                        24B031911
PASS   student.github                            Nurali-852
PASS   assistant.tool                            Claude
PASS   assistant.model                           Sonnet 5 (Low effort)
PASS   counts.user_stories                       8
FAIL   counts.acceptance_criteria_sets           left empty or not a number
FAIL   checker.pass                              left empty — run the checker and report the result
FAIL   checker.fail                              left empty — run the checker and report the result
FAIL   checker.error                             left empty — run the checker and report the result
FAIL   checker.commit                            left empty
FAIL   assumptions.overlap_touching_bookings     must be one of ['allowed', 'not-allowed'], got 'Allowed with [start, end) principle'
PASS   assumptions.exactly_two_hours             Allowed
FAIL   traceability.use_cases_not_covered        these are not UC-nn IDs: ['none']
PASS   traceability.stories_not_traced           US-04, US-05, US-06, US-07, US-08
PASS   review_findings                           3 findings
PASS   review_findings[1]                        US-08 was the only one that differed from basic user scenari…
PASS   review_findings[2]                        AC-10 was slightly unneccessary, cause by default we should …
FAIL   review_findings[3]                        names no ID — a finding points at a US-nn, AC-nn or UC-nn
PASS   honesty.can_explain_everything_submitted  yes
PASS   honesty.ai_usage_disclosed                yes
------------------------------------------------------------------------
15 PASS · 8 FAIL · 0 ERROR · 0 note
Fix the FAIL and ERROR lines above, then run this again before you push.
```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` |19 |4 |0 |

Commit these numbers were produced at (`git rev-parse --short HEAD`): 3dbe94c

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

1. FAIL   US-1  user-stories.md         2 TODO placeholder(s) left in the file  
Answer: It is just explaining part in the header I shouldn't delete it
2. FAIL   US-7  user-stories.md         out-of-scope vocabulary: reminder — either the assistant widened the scenario, or say why in lab-report.md  
Answer: I don't really know. Maybe it is because AI added 2 extra USs or there is some extra vocab in US-07.
3. FAIL   TR-1  traceability.md         2 TODO placeholder(s) left in the table
Answer: Just forgot to replace TODO with none and just delete second one where I already wrote answer. fixed it
4. FAIL   TR-3  traceability.md         stories that appear nowhere in the table: US-05, US-06 — list them under 'Stories that belong to no use case' if that is the finding
Answer: Forgot to write 0 before number. It was US-5, US-6 then fixed to US-05, US-06.

**Did you run the checks by hand instead of with Python?** Say so here — it costs nothing, but it
has to be said. No

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?  
   Answer: There were mostly me mistakes because I didn't fully understand how to fill out forms. AI response was almost perfect. But it got some difference in answers about cancelation. In assumption of scenario of cancelation user can cancel only his booking. But in the ACs It needs another layer of validation. It is because I started a new chat without pasting that condiion so AI ignored it.
2. What did the assistant get right that would have taken you noticeably longer by hand?  
Answer: Creating scenarios and then criterias for them. AI saved me a lot of time. Especially user scenarios it structured the answer and gave examples of real life usage.
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?  
   Answer:
   I think I should specify part about validation, exactly in which US should I use exact UC. Maybe add more ACs cause they help a lot with specification and viewing it from all sides

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
