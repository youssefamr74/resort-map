export type SimpleTileType = 'pool' | 'chalet' | 'empty';

export type PathAsset =
  'arrowEnd' | 'arrowStraight' | 'arrowCornerSquare' | 'arrowSplit' | 'arrowCrossing';

export interface PathTile {
  type: 'path';
  asset: PathAsset;
  rotation: 0 | 90 | 180 | 270;
}

export interface CabanaTile {
  type: 'cabana';
  cabanaId: string;
}

export interface PlainTile {
  type: SimpleTileType;
}

export type Tile = PathTile | CabanaTile | PlainTile;

export interface Cabana {
  id: string;
  row: number;
  col: number;
  status: 'available' | 'booked';
}

export interface PoolBounds {
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
}

export interface ResortMapResponse {
  width: number;
  height: number;
  tiles: Tile[][];
  cabanas: Cabana[];
  poolBounds: PoolBounds | null;
}

export interface BookingSuccessResponse {
  success: true;
  cabana: Cabana;
}

export interface BookingErrorResponse {
  error: string;
}
