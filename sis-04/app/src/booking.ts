export type Interval = {
  start: number;
  end: number;
};

type CanBookRequest = {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: readonly Interval[];
};

export function canBook({
  start,
  end,
  now,
  blocked,
  bookings,
}: CanBookRequest): boolean {
  // AC1: Valid interval and future start time.
  if (!(0 <= start && start < end && end <= 1440)) {
    return false;
  }

  if (!(start > now)) {
    return false;
  }

  // AC2: Maximum duration is 120 minutes.
  if (end - start > 120) {
    return false;
  }

  // AC3: Blocked rooms cannot be booked.
  if (blocked) {
    return false;
  }

  // AC4: Reject overlaps, but allow touching endpoints.
  for (const booking of bookings) {
    if (start < booking.end && end > booking.start) {
      return false;
    }
  }

  // AC5: Booking data is never modified.
  return true;
}

import type { Room } from './rooms';

type CheckRoomRequest = {
  start: number;
  end: number;
  now: number;
};

export function checkRoom(
  rooms: readonly Room[],
  roomId: string,
  request: CheckRoomRequest
): boolean {
  const room = rooms.find((item) => item.id === roomId);

  if (!room) {
    return false;
  }

  return canBook({
    ...request,
    blocked: room.blocked,
    bookings: room.bookings,
  });
}
