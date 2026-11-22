
import { useState } from 'react';
import { ROOMS, EQUIPMENT } from './rooms';
import { filterRooms } from './filter';
import { checkRoom } from './booking';

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};

const fmt = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

export default function App() {
  const [roomId, setRoomId] = useState(ROOMS[0]?.id ?? '');
  const [attendees, setAttendees] = useState(1);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);

  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);

  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const filteredRooms = filterRooms(ROOMS, {
    attendees,
    equipment: selectedEquipment,
  });

  const selectedRoom =
    filteredRooms.find((room) => room.id === roomId) ??
    filteredRooms[0];

  function clearFeedback() {
    setResult(null);
    setError('');
  }

  function handleEquipmentChange(item: string, checked: boolean) {
    setSelectedEquipment((current) =>
      checked
        ? [...current, item]
        : current.filter((equipment) => equipment !== item)
    );

    clearFeedback();
  }

  function check() {
    clearFeedback();

    if (!start || !now || (!end && !endOfDay)) {
      setError('Fill in the current time, the start and the end.');
      return;
    }

    const s = toMinutes(start);
    const e = endOfDay ? 1440 : toMinutes(end);

    if (s >= e) {
      setError('The end time must be after the start time.');
      return;
    }

    if (!selectedRoom) {
      setError('Please select an available room from the list.');
      return;
    }

    const available = checkRoom(ROOMS, selectedRoom.id, {
      start: s,
      end: e,
      now: toMinutes(now),
    });

    setResult(available);
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>

      <section className="filters">
        <h2>Room filters</h2>

        <label>
          Number of attendees
          <input
            type="number"
            min="1"
            value={attendees}
            onChange={(e) => {
              setAttendees(Math.max(1, Number(e.target.value) || 1));
              clearFeedback();
            }}
          />
        </label>

        <fieldset className="equipment-filter">
          <legend>Required equipment</legend>

          {EQUIPMENT.map((item) => (
            <label className="inline" key={item}>
              <input
                type="checkbox"
                checked={selectedEquipment.includes(item)}
                onChange={(e) =>
                  handleEquipmentChange(item, e.target.checked)
                }
              />
              {item}
            </label>
          ))}
        </fieldset>
      </section>

      <section className="room-selection">
        <h2>Matching rooms</h2>

        {filteredRooms.length === 0 ? (
          <p className="empty-state">
            No rooms match your selected capacity and equipment filters.
            Try changing your filters.
          </p>
        ) : (
          <div className="room-list">
            {filteredRooms.map((room) => (
              <label className="room-option" key={room.id}>
                <input
                  type="radio"
                  name="selectedRoom"
                  value={room.id}
                  checked={selectedRoom?.id === room.id}
                  onChange={() => {
                    setRoomId(room.id);
                    clearFeedback();
                  }}
                />

                <span className="room-details">
                  <strong>
                    {room.name}
                    {room.blocked && ' (blocked)'}
                  </strong>

                  <span>Capacity: {room.capacity}</span>

                  <span>
                    Equipment: {room.equipment.join(', ')}
                  </span>
                </span>
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="booking-section">
        <h2>Check availability</h2>

        <div className="row">
          <label>
            Current time
            <input
              type="time"
              value={now}
              onChange={(e) => {
                setNow(e.target.value);
                clearFeedback();
              }}
            />
          </label>

          <label>
            Start
            <input
              type="time"
              value={start}
              onChange={(e) => {
                setStart(e.target.value);
                clearFeedback();
              }}
            />
          </label>

          <label>
            End
            <input
              type="time"
              value={end}
              disabled={endOfDay}
              onChange={(e) => {
                setEnd(e.target.value);
                clearFeedback();
              }}
            />
          </label>

          <label className="inline">
            <input
              type="checkbox"
              checked={endOfDay}
              onChange={(e) => {
                setEndOfDay(e.target.checked);
                clearFeedback();
              }}
            />
            Ends at 24:00
          </label>
        </div>

        <button onClick={check} disabled={!selectedRoom}>
          Check availability
        </button>

        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {result !== null && (
          <p
            className={`result ${
              result ? 'available' : 'unavailable'
            }`}
            role="status"
          >
            {result ? 'Available' : 'Unavailable'}
          </p>
        )}
      </section>

      {selectedRoom && (
        <section className="bookings-section">
          <h2>Existing bookings — {selectedRoom.name}</h2>

          <ul>
            {selectedRoom.bookings.length > 0 ? (
              selectedRoom.bookings.map((booking, index) => (
                <li key={index}>
                  {fmt(booking.start)}–{fmt(booking.end)}
                </li>
              ))
            ) : (
              <li>None</li>
            )}
          </ul>
        </section>
      )}
    </main>
  );
}
