# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

## 1. Setup and starting point

| Item | Value |
| --- | --- |
| Assistant (tool) | ChatGPT|
| Assistant model | not displayed |
| Starting point | starter |
| Baseline commit | 0e86f8a |
| Language (ts or js) | ts |
| Vitest version | vitest/5.1.1 |
| Where I ran the tests | Local machine, VS Code terminal, Windows (win32-x64), Node v24.14.1 |

### 1.1 Baseline run

```text
RUN  v3.2.7 C:/Users/nural/Desktop/se-practice/sis-04/app

No test files found, exiting with code 1
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
index.html        — HTML entry, #root, loads /src/main.tsx  

package.json      — scripts dev/build/test (vitest run); React 18, Vite 5, Vitest  

tsconfig.json     — strict TypeScript, compiles src/ only  

vite.config.ts    — Vite with the React plugin  

src/main.tsx      — mounts <App /> in StrictMode, imports index.css  

src/App.tsx       — the whole app: Room type, ROOMS (2 rooms), toMinutes/fmt helpers, form state, check() with all AC rules inline, rendering  

src/index.css     — styles; at <=480px the form stacks in one column
```

### 2.2 The context message as sent

```text
I am extending a small React + TypeScript + Vite app, "Smart Campus Room Availability Checker".

Repository map:
index.html        — HTML entry, #root, loads /src/main.tsx  

package.json      — scripts dev/build/test (vitest run); React 18, Vite 5, Vitest  

tsconfig.json     — strict TypeScript, compiles src/ only  

vite.config.ts    — Vite with the React plugin  

src/main.tsx      — mounts <App /> in StrictMode, imports index.css  

src/App.tsx       — the whole app: Room type, ROOMS (2 rooms), toMinutes/fmt helpers, form state, check() with all AC rules inline, rendering  

src/index.css     — styles; at <=480px the form stacks in one column

Requirements to preserve (AC1–AC6):
AC1 Reject start ≥ end and requests in the past.
AC2 Enforce the maximum allowed duration (120 minutes).
AC3 Reject a blocked room.
AC4 Reject overlaps; allow bookings that only touch at endpoints.
AC5 Return Available / Unavailable without changing booking data.
AC6 Clear, responsive feedback on desktop and mobile.

New requirements:
Catalog of at least 4 fictional rooms, each with id, name, capacity, equipment list, blocked status, own bookings. Show only rooms that match the user's filters. The availability check must use the chosen room's bookings.
F1 Capacity filter: room capacity >= requested attendees.
F2 Equipment filter: the room must contain ALL selected items.
F3 A blocked room cannot be reported as available.
F4 Show a clear empty state when no rooms match.
F5 Changing the selected room must refresh the availability result.

Constraints: no login, payments, live APIs or database; fictional data only.
Target modules: src/rooms.ts, src/filter.ts (filterRooms), src/booking.ts (canBook unchanged in behaviour, checkRoom(rooms, roomId, request)), App.tsx without room data or rules.

Task now: list maintainability risks, each with file/function reference, and propose a plan of small steps. Give a plan, not a full rewrite, and no code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | `blocked` is a page-level checkbox, not a property of the selected room, so a blocked room cannot be handled per room (AC3, F3) | `src/App.tsx`, `check()` and `useState(blocked)` | `check()` uses `else if (blocked) ok = false;` from the checkbox state; the `blocked` field of each entry in `ROOMS` is never read | High |
| 2 | All availability rules (AC1–AC4) live inside the React component, so they cannot be tested without rendering the page | `src/App.tsx`, `check()` | The whole rule ladder (`let ok = true; … else if (e - s > 120) …`) sits in `check()` next to `setResult`; there is no `canBook` and no test file | High |
| 3 | Changing the room does not clear the previous result, so an old "Available" stays on screen for another room (F5) | `src/App.tsx`, room `<select>` | `onChange={e => setRoomId(e.target.value)}` does not call `setResult(null)` | High |
| 4 | Room data and model are inside the UI file and too small for the new feature | `src/App.tsx`, `type Room` and `ROOMS` | `Room` has no `capacity` or `equipment`; `ROOMS` has only 2 rooms and is declared in `App.tsx` | Medium |

### 3.2 Improvement plan — before editing

1. Move the rule ladder from `check()` into `src/booking.ts` as `canBook({ start, end, now, blocked, bookings })` with unchanged behaviour. Write the AC1–AC5 and B1–B4 tests first and keep them green.
2. Move `Room` and `ROOMS` into `src/rooms.ts`; add `capacity` and `equipment` and at least four fictional rooms, each with its own bookings and `blocked` value.
3. Write the F1, F2, F4, B5 and B6 tests first, then add `filterRooms` in `src/filter.ts` (`every` for equipment).
4. Write the F3, F5 and INT tests first, then add `checkRoom` in `src/booking.ts`, which finds the room by id and calls `canBook` with that room's own `blocked` and `bookings`; an unknown id is not available.
5. Rewire `src/App.tsx`: remove the global "Room blocked" checkbox, add the attendees and equipment filters and the empty state, call `checkRoom`, reset the result when the room changes. Then remove the remaining duplicated validation, draw the diagrams and finish the report.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Step 3 of the plan: `filterRooms()` should also implement "F3: blocked rooms must not be presented as available" and return only rooms matching all filters | Modified | F3 is about the availability result, not about filtering by capacity and equipment. So `filterRooms` in `src/filter.ts` will only do F1 and F2, and F3 will be handled by `checkRoom`/`canBook` (AC3). My F3 test will call `checkRoom` with a blocked room and expect `false`. |

## 4. Feature extension (Task 2)

### 4.1 What I added

The catalog has 4 fictional rooms (A-101, B-204, C-305, D-410) with capacities from 12 to 40 and equipment chosen from Computers, Microphone, Projector, Smart Board and Whiteboard; D-410 is blocked. The filter is chosen on the page with a number field for attendees and one checkbox per equipment item. The room list shows only rooms that match both filters, and a room is picked with a radio button. Blocked rooms stay in the list with a "(blocked)" label but are never reported as available. When no room matches, the page shows "No rooms match your selected capacity and equipment filters. Try changing your filters." When the room, the filters or the times change, the old result and error are cleared, and the next check uses only the bookings of the selected room.

### 4.2 Demonstration

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees 15 with Projector and Whiteboard selected: only Room A-101 and Room B-204 are listed. |
| `evidence/filter-empty.png` | Attendees 50: no room matches and the empty-state message is shown. |
| `evidence/switch-a.png` | Room A-101 selected, current time 09:00, start 10:30, end 11:30: result Unavailable (it is booked 10:00–11:00). |
| `evidence/switch-b.png` | The same times with Room B-204 selected: result Available (no bookings). |
| `evidence/narrow.png` | The page at phone width in portrait: the form is one column and the room list and result stay readable. |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
