# User stories — Smart Campus study room booking

6 to 8 stories. Keep the shape exactly: ID, the As/I want/so that sentence, a priority, one
assumption. Roles are **Student** or **Administrator** only.

Delete the TODO lines as you fill them in — the checker treats a leftover TODO as unfinished work.

---

### US-01
**Story:** As a Student, I want to view which rooms are free and when, so that I can find a suitable time slot before booking.
**Priority:** High
**Assumption:** Availability is shown as a schedule/grid of rooms against time slots, visible to any logged-in student.

### US-02
**Story:** As a Student, I want to reserve a free room for a specific future time slot, so that I have a guaranteed space for individual or group study.
**Priority:** High
**Assumption:** A booking request is rejected if it starts in the past, exceeds two hours, or overlaps an existing booking for that room (R1, R2, R3).

### US-03
**Story:** As a Student, I want to cancel a booking I made, so that I can release the room if my plans change.
**Priority:** High
**Assumption:** A student can only cancel their own bookings, not those made by others.

### US-04
**Story:** As a Student, I want to receive a confirmation when my booking is made or cancelled, so that I know the action was successfully recorded.
**Priority:** High
**Assumption:** Confirmation is a single system message tied directly to the booking or cancellation event, not a reminder or scheduled notification.

### US-05
**Story:** As an Administrator, I want to take a room out of service, so that students cannot book it while it is unusable for study.
**Priority:** High
**Assumption:** Blocking a room does not automatically cancel bookings already made before the block (scenario doesn't settle this, so admin handles conflicts manually if any exist).

### US-06
**Story:** As an Administrator, I want to return a blocked room to service, so that students can book it again once it's usable.
**Priority:** Medium
**Assumption:** An unblocked room immediately becomes visible in availability views with no residual restriction.

### US-07
**Story:** As an Administrator, I want to see how rooms are being used over a period, so that I can understand booking patterns and room demand.
**Priority:** Medium
**Assumption:** Usage review is a read-only report of past and current bookings per room over a selected date range.

### US-08
**Story:** As a Student, I want the system to prevent me from booking a room for more than two hours, so that room time is shared fairly among students.
**Priority:** Medium
**Assumption:** A booking of exactly two hours is allowed; the system rejects only durations exceeding two hours (R2).