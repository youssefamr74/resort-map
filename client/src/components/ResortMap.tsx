import { useState } from 'react';
import { useResortMap } from '../hooks/useResortMap';
import MapTile from './MapTile';
import BookingModal from './BookingModal';
import type { Cabana } from '../types/resortMap';
import pool from '../../../assets/pool.png';

const TILE_SIZE = 40;
const GRID_GAP = 2;

function ResortMap() {
  const { map, loading, error, markCabanaBooked } = useResortMap();
  const [selectedCabana, setSelectedCabana] = useState<Cabana | null>(null);
  const [unavailableMessage, setUnavailableMessage] = useState<string | null>(null);

  if (loading) return <p>Loading resort map...</p>;
  if (error) return <p>Could not load the map: {error}</p>;
  if (!map) return null;

  function findCabana(cabanaId: string): Cabana | undefined {
    return map!.cabanas.find((c) => c.id === cabanaId);
  }

  function handleCabanaClick(cabana: Cabana) {
    if (cabana.status === 'booked') {
      setUnavailableMessage('This cabana is already booked.');
      return;
    }
    setUnavailableMessage(null);
    setSelectedCabana(cabana);
  }

  function handleBookingSuccess(cabanaId: string) {
    markCabanaBooked(cabanaId);
    setSelectedCabana(null);
  }

  const step = TILE_SIZE + GRID_GAP;
  const poolStyle = map.poolBounds
    ? {
        top: map.poolBounds.row * step,
        left: map.poolBounds.col * step,
        width: map.poolBounds.colSpan * TILE_SIZE + (map.poolBounds.colSpan - 1) * GRID_GAP,
        height: map.poolBounds.rowSpan * TILE_SIZE + (map.poolBounds.rowSpan - 1) * GRID_GAP,
      }
    : null;

  return (
    <div className="resort-map-wrapper">
      {unavailableMessage && (
        <div className="unavailable-banner" role="alert">
          {unavailableMessage}
          <button type="button" onClick={() => setUnavailableMessage(null)}>
            Dismiss
          </button>
        </div>
      )}
      <div className="resort-map-frame">
        <div className="resort-map-grid-container">
          <div
            className="resort-map-grid"
            style={{
              gridTemplateColumns: `repeat(${map.width}, ${TILE_SIZE}px)`,
              gridTemplateRows: `repeat(${map.height}, ${TILE_SIZE}px)`,
            }}
          >
            {map.tiles.map((row, rowIdx) =>
              row.map((tile, colIdx) => {
                const cabana = tile.type === 'cabana' ? findCabana(tile.cabanaId) : undefined;
                return (
                  <MapTile
                    key={`${rowIdx}-${colIdx}`}
                    tile={tile}
                    cabana={cabana}
                    onCabanaClick={handleCabanaClick}
                  />
                );
              })
            )}
          </div>
          {poolStyle && <img src={pool} alt="Resort pool" className="pool-overlay" style={poolStyle} />}
        </div>
      </div>
      {selectedCabana && (
        <BookingModal
          cabana={selectedCabana}
          onClose={() => setSelectedCabana(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
}

export default ResortMap;