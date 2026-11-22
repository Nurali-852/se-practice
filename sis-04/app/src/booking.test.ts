
import { describe, it, expect } from 'vitest';
import { canBook } from './booking';

describe('canBook', () => {
  it('T01 AC1: rejects a start time equal to the end time', () => {
    expect(
      canBook({
        start: 600,
        end: 600,
        now: 500,
        blocked: false,
        bookings: [],
      })
    ).toBe(false);
  });

  it('T02 AC1: rejects a start time after the end time', () => {
    expect(
      canBook({
        start: 700,
        end: 600,
        now: 500,
        blocked: false,
        bookings: [],
      })
    ).toBe(false);
  });

  it('T03 AC1: rejects a request starting in the past', () => {
    expect(
      canBook({
        start: 500,
        end: 560,
        now: 500,
        blocked: false,
        bookings: [],
      })
    ).toBe(false);
  });

  it('T04 AC2: rejects a duration exceeding 120 minutes', () => {
    expect(
      canBook({
        start: 600,
        end: 721,
        now: 500,
        blocked: false,
        bookings: [],
      })
    ).toBe(false);
  });

  it('T05 AC3: rejects a blocked room', () => {
    expect(
      canBook({
        start: 600,
        end: 660,
        now: 500,
        blocked: true,
        bookings: [],
      })
    ).toBe(false);
  });

  it('T06 AC4: rejects overlapping bookings', () => {
    expect(
      canBook({
        start: 620,
        end: 680,
        now: 500,
        blocked: false,
        bookings: [{ start: 600, end: 660 }],
      })
    ).toBe(false);
  });

  it('T07 AC4: allows bookings that touch at endpoints', () => {
    expect(
      canBook({
        start: 660,
        end: 720,
        now: 500,
        blocked: false,
        bookings: [{ start: 600, end: 660 }],
      })
    ).toBe(true);
  });

  it('T08 AC5: does not mutate existing bookings', () => {
    const bookings = [{ start: 600, end: 660 }];
    const original = structuredClone(bookings);

    canBook({
      start: 660,
      end: 720,
      now: 500,
      blocked: false,
      bookings,
    });

    expect(bookings).toEqual(original);
  });

  it('T09 B1 AC2: allows exactly 120 minutes', () => {
    expect(
      canBook({
        start: 600,
        end: 720,
        now: 500,
        blocked: false,
        bookings: [],
      })
    ).toBe(true);
  });

  it('T10 B2 AC2: rejects 121 minutes', () => {
    expect(
      canBook({
        start: 600,
        end: 721,
        now: 500,
        blocked: false,
        bookings: [],
      })
    ).toBe(false);
  });

  it('T11 B3 AC4: allows a booking starting at an existing endpoint', () => {
    expect(
      canBook({
        start: 660,
        end: 720,
        now: 500,
        blocked: false,
        bookings: [{ start: 600, end: 660 }],
      })
    ).toBe(true);
  });

  it('T12 B4 AC4: rejects a booking that overlaps an existing interval', () => {
    expect(
      canBook({
        start: 650,
        end: 710,
        now: 500,
        blocked: false,
        bookings: [{ start: 600, end: 660 }],
      })
    ).toBe(false);
  });
});
