import { describe, it, expect, beforeEach } from 'vitest';
import { initBookingState, bookCabana, getCabanas } from '../../src/services/bookingService.js';

function makeCabanas() {
  return [
    { id: 'cabana-r0-c0', row: 0, col: 0, status: 'available' },
    { id: 'cabana-r0-c1', row: 0, col: 1, status: 'available' },
  ];
}

const guests = [
  { room: '101', guestName: 'Violet Cruz' },
  { room: '102', guestName: 'John Smith' },
];

describe('bookingService', () => {
  beforeEach(() => {
    initBookingState(makeCabanas(), guests);
  });

  it('books a cabana for a valid room + guest name', () => {
    const result = bookCabana('cabana-r0-c0', '101', 'Violet Cruz');

    expect(result).toEqual({
      success: true,
      cabana: { id: 'cabana-r0-c0', row: 0, col: 0, status: 'booked' },
    });
    expect(getCabanas().find((c) => c.id === 'cabana-r0-c0').status).toBe('booked');
  });

  it('rejects booking a nonexistent cabana id', () => {
    const result = bookCabana('does-not-exist', '101', 'Violet Cruz');
    expect(result).toEqual({ success: false, error: 'Cabana not found.' });
  });

  it('rejects booking an already-booked cabana', () => {
    bookCabana('cabana-r0-c0', '101', 'Violet Cruz');
    const result = bookCabana('cabana-r0-c0', '102', 'John Smith');
    expect(result).toEqual({ success: false, error: 'This cabana is already booked.' });
  });

  it('rejects when room and name do not match any guest', () => {
    const result = bookCabana('cabana-r0-c0', '999', 'Nobody');
    expect(result).toEqual({
      success: false,
      error: 'We could not verify that room number and name.',
    });
  });

  it('rejects when the name is right but the room is wrong', () => {
    const result = bookCabana('cabana-r0-c0', '999', 'Violet Cruz');
    expect(result).toEqual({
      success: false,
      error: 'We could not verify that room number and name.',
    });
  });

  it('rejects when the room is right but the name is wrong', () => {
    const result = bookCabana('cabana-r0-c0', '101', 'Wrong Name');
    expect(result).toEqual({
      success: false,
      error: 'We could not verify that room number and name.',
    });
  });

  it('rejects a second booking attempt by the same guest, even for a different cabana', () => {
    bookCabana('cabana-r0-c0', '101', 'Violet Cruz');
    const result = bookCabana('cabana-r0-c1', '101', 'Violet Cruz');
    expect(result).toEqual({
      success: false,
      error: 'This guest already has an active cabana booking.',
    });
  });
});
