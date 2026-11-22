
import { describe, it, expect } from 'vitest';
import { checkRoom } from './booking';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const TEST_ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Room 1',
    capacity: 20,
    equipment: ['Projector'],
    blocked: true,
    bookings: [],
  },
  {
    id: 'r2',
    name: 'Room 2',
    capacity: 20,
    equipment: ['Projector'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'r3',
    name: 'Room 3',
    capacity: 30,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [],
  },
];

const REQUEST = {
  start: 610,
  end: 650,
  now: 500,
};

describe('checkRoom', () => {
  it('T01 F3: never reports a blocked room as available', () => {
    expect(
      checkRoom(TEST_ROOMS, 'r1', REQUEST)
    ).toBe(false);
  });

  it('T02 F5: checks the selected room own bookings', () => {
    expect(
      checkRoom(TEST_ROOMS, 'r2', REQUEST)
    ).toBe(false);

    expect(
      checkRoom(TEST_ROOMS, 'r3', REQUEST)
    ).toBe(true);
  });

  it('T03: returns false for an unknown room ID', () => {
    expect(
      checkRoom(TEST_ROOMS, 'unknown', REQUEST)
    ).toBe(false);
  });

  it('T04 AC5: does not mutate room booking data', () => {
    const original = structuredClone(TEST_ROOMS);

    checkRoom(TEST_ROOMS, 'r2', REQUEST);

    expect(TEST_ROOMS).toEqual(original);
  });

  it('T05 INT: filters rooms before checking the returned room', () => {
    const filtered = filterRooms(TEST_ROOMS, {
      attendees: 25,
      equipment: ['Whiteboard'],
    });

    expect(filtered.map((room) => room.id)).toEqual(['r3']);

    expect(
      checkRoom(filtered, 'r3', REQUEST)
    ).toBe(true);
  });
});
