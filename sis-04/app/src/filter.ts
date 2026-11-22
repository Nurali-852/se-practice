
import type { Room } from './rooms';

type RoomFilters = {
  attendees: number;
  equipment: string[];
};

export function filterRooms(
  rooms: readonly Room[],
  filters: RoomFilters
): Room[] {
  return rooms.filter((room) => {
    const hasCapacity = room.capacity >= filters.attendees;

    const hasEquipment = filters.equipment.every((item) =>
      room.equipment.includes(item)
    );

    return hasCapacity && hasEquipment;
  });
}
