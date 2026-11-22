
import { describe, it, expect } from 'vitest';
import { filterRooms } from './filter';
import type { Room } from './rooms';

const TEST_ROOMS: Room[] = [
  {
    id: 'r1',
    name: 'Test Room 1',
    capacity: 30,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'r2',
    name: 'Test Room 2',
    capacity: 20,
    equipment: ['Projector'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'r3',
    name: 'Test Room 3',
    capacity: 10,
    equipment: ['Whiteboard', 'Computers'],
    blocked: true,
    bookings: [],
  },
];

describe('filterRooms', () => {
  it('T01 F1: includes rooms with sufficient capacity', () => {
    const result = filterRooms(TEST_ROOMS, {
      attendees: 20,
      equipment: [],
    });

    expect(result.map((room) => room.id)).toEqual(['r1', 'r2']);
  });

  it('T02 F2: requires all selected equipment items', () => {
    const result = filterRooms(TEST_ROOMS, {
      attendees: 1,
      equipment: ['Projector', 'Whiteboard'],
    });

    expect(result.map((room) => room.id)).toEqual(['r1']);
  });

  it('T03 F4: returns an empty array when nothing matches', () => {
    const result = filterRooms(TEST_ROOMS, {
      attendees: 100,
      equipment: [],
    });

    expect(result).toEqual([]);
  });

  it('T04 B5 F1: includes a room when capacity equals attendees', () => {
    const result = filterRooms(TEST_ROOMS, {
      attendees: 30,
      equipment: [],
    });

    expect(result.map((room) => room.id)).toEqual(['r1']);
  });

  it('T05 B6 F1: excludes a room when capacity is one below attendees', () => {
    const result = filterRooms(TEST_ROOMS, {
      attendees: 21,
      equipment: [],
    });

    expect(result.map((room) => room.id)).toEqual(['r1']);
  });
});
