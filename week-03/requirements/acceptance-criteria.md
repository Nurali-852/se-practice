# Acceptance criteria — three selected stories

Assumptions first, then the criteria. Each block names the story it belongs to. 3 to 5 criteria per
story, every one in Given / When / Then form, and every set covers a validation or error case — not
three happy paths.

---

## Assumptions

These must settle the two questions the scenario leaves open. Either answer is accepted; no answer
is not.

- **Overlap:** a booking that ends exactly when another begins is allowed under R3, because we see it as [start, end) structure
- **Duration:** a booking of exactly two hours is allowed under R2, because we can count it thanks to declared structure but no more time allowed.
- Cancellation is restricted to the booking's owner (no admin override covered here)

---

## US-01 —  View Availability

### AC-01
- **Given** I am a logged-in student
- **When** I open the room availability schedule
- **Then** I see all rooms with their booked and free time slots for the selected date

### AC-02
- **Given** a room has been marked as blocked by an admin
- **When** I view the availability schedule
- **Then** that room appears as unavailable for the blocked period and cannot be selected for booking

### AC-03
- **Given** no rooms have any bookings or blocks for the selected date
- **When** I view the availability schedule
- **Then** all rooms display as fully free for that date

---

## US-02 — Book Room

### AC-04
- **Given** a room is free for a future time slot of two hours or less
- **When** I submit a booking request for that room and time slot
- **Then** the booking is created and the room shows as reserved for that period

### AC-05
- **Given** I select a start time that is earlier than the current date/time
- **When** I submit the booking request
- **Then** the system rejects the booking and displays an error stating bookings must be in the future

### AC-06
- **Given** I select a start and end time spanning more than two hours
- **When** I submit the booking request
- **Then** the system rejects the booking and displays an error stating the maximum duration is two hours

### AC-07
- **Given** the selected room already has a booking that overlaps my requested time slot
- **When** I submit the booking request
- **Then** the system rejects the booking and displays an error indicating the room is already booked for that period

### AC-08
- **Given** the selected room is marked as blocked for the requested time slot
- **When** I submit the booking request
- **Then** the system rejects the booking and displays an error indicating the room is unavailable

## US-03 — Cancel Booking

### AC-09
- **Given** I have an existing future booking
- **When** I choose to cancel that booking
- **Then** the booking is removed and the room becomes free for that time slot

### AC-10
- **Given** a booking exists that was made by a different student
- **When** I attempt to cancel that booking
- **Then** the system rejects the action and displays an error stating I can only cancel my own bookings

### AC-11
- **Given** a booking has already been cancelled or has passed
- **When** I attempt to cancel it again
- **Then** the system displays an error indicating the booking cannot be found or is no longer active