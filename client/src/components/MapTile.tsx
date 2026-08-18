import type { Tile, Cabana } from '../types/resortMap';

// Asset imports — adjust paths to wherever you place the actual PNGs
import houseChimney from '../../../assets/houseChimney.png';
import parchmentBasic from '../../../assets/parchmentBasic.png';
import cabanaAsset from '../../../assets/cabana.png';
import arrowStraight from '../../../assets/arrowStraight.png';
import arrowCornerSquare from '../../../assets/arrowCornerSquare.png';
import arrowCrossing from '../../../assets/arrowCrossing.png';
import arrowSplit from '../../../assets/arrowSplit.png';
import arrowEnd from '../../../assets/arrowEnd.png';

const PATH_ASSETS: Record<string, string> = {
  arrowStraight,
  arrowCornerSquare,
  arrowCrossing,
  arrowSplit,
  arrowEnd,
};

interface MapTileProps {
  tile: Tile;
  cabana?: Cabana; // only present when tile.type === 'cabana'
  onCabanaClick?: (cabana: Cabana) => void;
}

function MapTile({ tile, cabana, onCabanaClick }: MapTileProps) {
  if (tile.type === 'pool') {
  return <div className="tile tile-pool-cell" />;
}

  if (tile.type === 'chalet') {
    return <img src={houseChimney} alt="Chalet" className="tile" />;
  }

  if (tile.type === 'empty') {
    return <img src={parchmentBasic} alt="" className="tile" />;
  }

  if (tile.type === 'path') {
    return (
      <img
        src={PATH_ASSETS[tile.asset]}
        alt=""
        className="tile"
        style={{ transform: `rotate(${tile.rotation}deg)` }}
      />
    );
  }

  if (tile.type === 'cabana' && cabana) {
    const isBooked = cabana.status === 'booked';
    return (
      <button
        type="button"
        className={`tile tile-cabana ${isBooked ? 'tile-cabana-booked' : 'tile-cabana-available'}`}
        onClick={() => onCabanaClick?.(cabana)}
        aria-label={isBooked ? 'Cabana booked' : 'Cabana available'}
      >
        <img src={cabanaAsset} alt="" />
      </button>
    );
  }

  return null;
}

export default MapTile;