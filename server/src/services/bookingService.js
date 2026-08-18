/**
 * @typedef {import('../models/ResortMap.js').Cabana} Cabana
 */

// In-memory only, reset on server restart.
let cabanas = [];
let guests = [];
let bookedGuestKeys = new Set(); // "room|guestName" -> one booking per guest

/**
 * @param {Cabana[]} parsedCabanas
 * @param {{room: string, guestName: string}[]} parsedGuests
 */
export function initBookingState(parsedCabanas, parsedGuests) {
  cabanas = parsedCabanas;
  guests = parsedGuests;
  bookedGuestKeys = new Set();
}

export function getCabanas() {
  return cabanas;
}

/**
 * @param {string} room
 * @param {string} guestName
 */
function isValidGuest(room, guestName) {
  return guests.some(
    (g) => g.room === room && g.guestName.toLowerCase() === guestName.toLowerCase()
  );
}

/**
 * @param {string} cabanaId
 * @param {string} room
 * @param {string} guestName
 * @returns {{ success: true, cabana: Cabana } | { success: false, error: string }}
 */
export function bookCabana(cabanaId, room, guestName) {
  const cabana = cabanas.find((c) => c.id === cabanaId);

  if (!cabana) {
    return { success: false, error: 'Cabana not found.' };
  }

  if (cabana.status === 'booked') {
    return { success: false, error: 'This cabana is already booked.' };
  }

  if (!room || !guestName) {
    return { success: false, error: 'Room number and guest name are required.' };
  }

  if (!isValidGuest(room, guestName)) {
    return { success: false, error: 'We could not verify that room number and name.' };
  }

  const guestKey = `${room}|${guestName.toLowerCase()}`;
  if (bookedGuestKeys.has(guestKey)) {
    return { success: false, error: 'This guest already has an active cabana booking.' };
  }

  cabana.status = 'booked';
  bookedGuestKeys.add(guestKey);

  return { success: true, cabana };
}