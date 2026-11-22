
import type { Interval } from './booking';

export type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  blocked: boolean;
  bookings: Interval[];
};

export const ROOMS: Room[] = [
  {
    id: 'a101',
    name: 'Room A-101',
    capacity: 30,
    equipment: ['Projector', 'Whiteboard', 'Computers'],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: 'b204',
    name: 'Room B-204',
    capacity: 20,
    equipment: ['Projector', 'Whiteboard'],
    blocked: false,
    bookings: [],
  },
  {
    id: 'c305',
    name: 'Room C-305',
    capacity: 12,
    equipment: ['Computers', 'Smart Board'],
    blocked: false,
    bookings: [{ start: 780, end: 840 }],
  },
  {
    id: 'd410',
    name: 'Room D-410',
    capacity: 40,
    equipment: ['Projector', 'Computers', 'Microphone'],
    blocked: true,
    bookings: [],
  },
];

export const EQUIPMENT: string[] = [
  ...new Set(ROOMS.flatMap((room) => room.equipment)),
].sort();
