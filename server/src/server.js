import fs from 'fs';
import path from 'path';
import app from './app.js';
import { parseMap, setMapState } from './services/mapParser.js';
import { initBookingState } from './services/bookingService.js';

function getArg(flag, defaultValue) {
  const idx = process.argv.indexOf(flag);
  return idx !== -1 ? process.argv[idx + 1] : defaultValue;
}

const mapPath = getArg('--map', process.env.MAP_PATH || 'map.ascii');
const bookingsPath = getArg('--bookings', process.env.BOOKINGS_PATH || 'bookings.json');

const rawMap = fs.readFileSync(path.resolve(mapPath), 'utf-8');
const parsedMap = parseMap(rawMap);
setMapState(parsedMap);

const rawBookings = fs.readFileSync(path.resolve(bookingsPath), 'utf-8');
const guests = JSON.parse(rawBookings);
initBookingState(parsedMap.cabanas, guests);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Map: ${mapPath}, Bookings: ${bookingsPath}`);
});
