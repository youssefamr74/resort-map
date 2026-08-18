import type { ResortMapResponse, BookingSuccessResponse, BookingErrorResponse } from '../types/resortMap';

const API_BASE = '/api';

export async function getMap(): Promise<ResortMapResponse> {
  const res = await fetch(`${API_BASE}/map`);
  if (!res.ok) {
    throw new Error('Failed to load resort map.');
  }
  return res.json();
}

export async function bookCabana(
  cabanaId: string,
  room: string,
  guestName: string
): Promise<BookingSuccessResponse> {
  const res = await fetch(`${API_BASE}/cabanas/${cabanaId}/book`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ room, guestName }),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorData = data as BookingErrorResponse;
    throw new Error(errorData.error || 'Booking failed.');
  }

  return data as BookingSuccessResponse;
}