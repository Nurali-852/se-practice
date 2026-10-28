# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Nurali |
| Group | Monday 16:00|
| AI assistant | Claude|
| Exact model | Sonnet 5.5|
| Renderer | PlantUML web server|
| Behaviour diagram | activity |
| Stories used | the reference set from README §3|

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate a UML activity diagram in PlantUML for Book room. Show the initial node, actions, guarded decisions, and final nodes. Check the time range, blocked-room status, and overlapping bookings. Show confirmation after success and rejection after failure. Use branches rather than parallel paths unless concurrency is required.
```

### 2.4 Focused correction prompts (if you sent any)

```text
none
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.
```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:**  
1. Only the two actors named in the scenario exist. No external systems (e.g., a notification service) appear, since other notifications are out of scope.
2. The administrator is not a specialization of the student. The stories give administrators no booking, viewing, or cancelling goals, so there is no actor generalization and no Administrator association to the student use cases.
3. Issue Booking Confirmation is triggered by the system as part of a successful booking, so it has no actor association of its own. The student receives the result through Book Study Room.
4. Cancel Own Booking is restricted to the student’s own bookings (US-03). That ownership check is a precondition, not a separate use case. Cancelling frees the slot, which relates to R2 only through overlap.
5. Block Room and Unblock Room are separate use cases because US-04 and US-05 are separate stories with opposite goals.
6. Review Room Usage covers only viewing usage. The stories define no report content or export, so none is shown.
7. Out-of-scope items (payments, equipment, recurring bookings, waiting lists, other notifications, registration) are not modeled. Users are assumed to exist already.

At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student → Send confirmation| It is triggered automatically only for booking. But it can also be applied for blocking or unblocking | US-01, R4 | Nothing as we rely on US's it clearly states confirmation only for US-01|
| 2 | All elements | Agent give short names for actions by itself | all | No need to fix, because names fit|

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
|Student — Booking | one student makes 0..* bookings | <each booking belongs to exactly 1 student| 1 / 0..* |
| Room — Booking | One room is reserved by 0..* bookings | Each booking reserves exactly 1 room | 1 / 0..* |

### 4.2 Constraints the multiplicities cannot show

- R2: the note is attached to Room (the constraint is about the bookings of one room). It says that among the Active bookings of the same room, the intervals [startTime, endTime) must not overlap. Multiplicities only say “a room has 0..* bookings” and can’t say anything about time.
- R1 (future start, ≤120 min) and R3 (blocked room) are also given as notes or as the blocked attribute.

### 4.3 Assumptions

- A1: A1: When a room is blocked (R3), already existing Active bookings are not touched. Blocking only rejects new bookings.
- A2: A cancelled booking is kept with status Cancelled and no longer counts for R2, so the slot becomes free.
- A3: Duration is stored in minutes, so the R1 limit of 2 hours = 120. end Time is derived (start Time + duration Minutes), not stored.
- A4: Students and rooms already exist (no registration). A rejected booking creates no Booking object, so there is no Failed status.
- A5: Administrator is an actor, not a class: no data of its own, and its actions (block/unblock) just change Room.blocked.
- A6: US-06 (usage review) is computed from Booking records, so there is no Report class.

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
|1 | BookingConfirmation class (1–1 with Booking) | It is an outcome of a successful booking, not a domain concept with its own state. Its attributes aren't needed by R1–R3, and it is always 1–1, so it adds nothing. | R4 (confirmation), assignment: "classes are domain concepts" | Removed the class. Confirmation is shown to the student when a Booking is created.|
|2 | Operations on Student (book, cancel) | These are actions/use cases, not domain state. They also duplicate Booking.cancel(). | US-01, US-03 | Removed all operations. Ownership is expressed by the Student 1 - 0..* Booking association.|
| 3 | Room.isFreeAt() and Room.canAcceptBooking() | Two overlapping operations doing almost the same thing; they are logic, not structure. | US-02, R2, R3 | Removed. The rules are documented in the R2/R3 notes.|
|4 | ID and name attributes (studentId, roomId, bookingId, name) | Not needed for R1–R3. The assignment says attributes only for the state the rules need. | R1–R3 | Removed. Kept startTime, durationMinutes, status, blocked.|
|5 | R2 note on Booking | R2 is about bookings of the same room, so a note on a single Booking states it at the wrong level. | R2 | Moved the R2 note to Room.|
|6 | Booking --> BookingStatus arrow | Status is already an attribute of Booking, so the arrow duplicates it and looks like a real association. | R2, US-03 | Removed the arrow; the enum is used only as the attribute type.|
7 | + /endTime and overlaps() on Booking | Public visibility on a derived attribute is odd, and overlaps() is behaviour that is already covered by the R2 note. | R2 | Kept /endTime as a derived attribute, removed the operation.|
---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3B activity — the task is a sequence of rule checks with
different outcomes, which an activity diagram shows directly with guarded branches.

**Design components added beyond the domain model:** none

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Mapping table: "Create booking, issue confirmation" | Cited as R4, but the rules are only R1–R3 | US-01 | Cite US-01 only |
| 2 | Swimlanes Student/System and "Receive confirmation/rejection" actions | Extra structure not asked for; the lane switches clutter the flow and add student actions that aren't part of the workflow | US-01 | Remove swimlanes; one flow with "Show confirmation" / "Show rejection: <reason>" |
| 3 | "Choose room…" + "Submit booking request" | Two actions for one step | US-01 | Merge into one "Student submits booking request" |
| 4 | Guards [valid]/[invalid] and [no]/[yes] | Inconsistent; [yes] doesn't say what happened | R1, R3, R2 | Descriptive guards: [valid]/[invalid], [not blocked]/[blocked], [no overlap]/[overlap] |
| 5 | Decisions R1 / R3 / R2 and the four final nodes | Correct: one diamond per rule, every failure path ends with its own rejection reason, booking is created only after the last check | R1, R3, R2, US-01 | Kept as is |
---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | Decision nodes carry no rule IDs, so R1–R4 can't be traced in the flow | behaviour.puml:4,5,6,8 | accept | Checked the file: the decisions are unlabelled. Prefixing R1 –, R3 –, R2 – and R4: costs nothing and matches the "one decision per rule" check. |
| 2 | R1 uses <= 120 min in the class diagram and <= 2 h in the activity diagram | class.puml:28, behaviour.puml:4 | accept | Checked both files: the units really differ. Both now say 0 < duration <= 2 h, as in the rule. |
| 3 | Issue Booking Confirmation is a separate use case with no story or actor goal | use-case.puml:10,26 | accept | R4 belongs to US-01 and the confirmation is not an actor goal. Merged into Book Study Room, <<include>> removed. |
| 4 | Add rule tags to the use case labels, e.g. Cancel Own Booking (US-03; R2) | use-case.puml:12-14 | reject | A use case diagram shows actor goals, not rules. Traceability is the job of the §7 table, and tags in labels clutter the diagram. |
| 5 | Add a note for R4 and operations confirm(), cancel(), block(), unblock() to the classes | class.puml:12-37 | reject | Classes are domain concepts with only the attributes R1–R3 need. The confirmation is not stored, and status and blocked already show the effect of US-03–05. Operations bring back the over-design removed in Task 2. |
| 6 | Add activity diagrams for cancel and block/unblock | behaviour.puml | reject | The task asks for one behaviour diagram. I chose 3B "Book room" (US-01). |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | Book Study Room\n(US-01; R1, R2, R3) | Booking (startTime, duration), note R1 | decision "R1 - Time range valid?" |
| R2 | Book Study Room\n(US-01; R1, R2, R3) | Booking, Room, note R2 (only ACTIVE bookings count) | decision "R2 - Overlaps an ACTIVE booking?" |
| R3 | Book Study Room\n(US-01; R1, R2, R3) | Room (blocked) | decision "R3 - Room blocked?" |
| R4 | Issue Booking Confirmation\n(US-01; R4) | none (confirmation is not stored) | action "R4: Produce booking confirmation" |
| US-01 | Book Study Room\n(US-01; R1, R2, R3) | Student, Booking, Room | whole activity diagram |
| US-01 | Issue Booking Confirmation\n(US-01; R4) | none (confirmation is not stored) | action "R4: Produce booking confirmation" |
| US-02 | View Room Availability\n(US-02) | Room, Booking | not modelled |
| US-03 | Cancel Own Booking\n(US-03) | Student, Booking (status = CANCELLED) | not modelled; effect seen in the R2 decision |
| US-04 | Block Room\n(US-04) | Room (blocked = true) | not modelled; effect seen in the R3 decision |
| US-05 | Unblock Room\n(US-05) | Room (blocked = false) | not modelled; effect seen in the R3 decision |
| US-06 | Review Room Usage\n(US-06) | Room, Booking | not modelled |
---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | use case | Use case labels without story IDs | Labels with story ID and rules, e.g. Book Study Room with US-01 and R1, R2, R3 | Every use case traces to an approved story |
| 2 | class | Class BookingConfirmation and operations on Student | Both removed | Classes are domain concepts with only the attributes R1-R3 need; R4 is a behaviour step, not stored data |
| 3 | activity | Swimlanes Student/System, Receive confirmation/rejection actions, guards yes/no | One flow, Show confirmation or rejection with a reason, descriptive guards, rule IDs in the decisions | One labelled decision per rule (R1, R3, R2); confirmation (R4) on success and a rejection on every failure path |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (7 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
AC1  PASS  initial and final nodes present
AC2  PASS  separate decisions check R1, R3 and R2 (3 decisions)
AC3  PASS  every branch has a labelled guard
AC4  PASS  no parallel paths
AC5  PASS  confirmation on success, rejection on failure
AC6  PASS  creation comes after all rule checks
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  PASS  §1 setup filled (tool and model recorded)
LR2  PASS  5 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 6 assumption(s) declared
LR5  PASS  4 behaviour-diagram findings in §5
LR6  PASS  5 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 traces R1-R4 into the diagrams
CS3  PASS  every use case traces to an approved story

SUMMARY pass=35 fail=0 error=0
A FAIL you report and explain in lab-report.md §9 costs you nothing. One you hide costs the criterion.
```

**FAILs I am keeping, and why:** none

---

## 10. Conclusion (120–180 words)

The AI got the class diagram most wrong. It added a BookingConfirmation class and put operations on Student, although the assignment says classes are domain concepts with only the attributes R1–R3 need. R4 is a step in the flow, not stored data, so that class would have become a useless table in the code. The same idea showed up in the use case diagram, where "Issue Booking Confirmation" was a separate use case with no actor goal. The critique found what I missed: R1 said <= 120 minutes in the class diagram but <= 2 h in the activity diagram, and the decisions had no rule IDs. A mismatch like that would have gone into validation unnoticed. It was wrong about adding cancel() and block() operations and rule tags on use case labels, because that just clutters the diagrams and traceability is what the §7 table is for. The Admin alias thing was pointless too. So AI is fine for a first draft but it doesnt read the assignment rules, you have to check it.
