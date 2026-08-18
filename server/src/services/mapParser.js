/**
 * @typedef {import('../models/ResortMap.js').PathAsset} PathAsset
 * @typedef {import('../models/ResortMap.js').ResortMap} ResortMap
 * @typedef {import('../models/ResortMap.js').Tile} Tile
 * @typedef {import('../models/ResortMap.js').Cabana} Cabana
 */

// Parsed once at startup, read by GET /api/map.
let cachedMap = null;

export function setMapState(map) {
  cachedMap = map;
}

export function getMapState() {
  return cachedMap;
}

/**
 * @param {boolean} up
 * @param {boolean} down
 * @param {boolean} left
 * @param {boolean} right
 * @returns {{ asset: PathAsset, rotation: 0 | 90 | 180 | 270 }}
 */
export function classifyPathTile(up, down, left, right) {
  const count = [up, down, left, right].filter(Boolean).length;

  if (count <= 1) {
    if (down) return { asset: 'arrowEnd', rotation: 0 };
    if (left) return { asset: 'arrowEnd', rotation: 90 };
    if (up) return { asset: 'arrowEnd', rotation: 180 };
    if (right) return { asset: 'arrowEnd', rotation: 270 };
    return { asset: 'arrowEnd', rotation: 0 };
  }

  if (count === 2) {
    if (up && down) return { asset: 'arrowStraight', rotation: 0 };
    if (left && right) return { asset: 'arrowStraight', rotation: 90 };

    if (up && right) return { asset: 'arrowCornerSquare', rotation: 0 };
    if (right && down) return { asset: 'arrowCornerSquare', rotation: 90 };
    if (down && left) return { asset: 'arrowCornerSquare', rotation: 180 };
    return { asset: 'arrowCornerSquare', rotation: 270 };
  }

  if (count === 3) {
    if (!left) return { asset: 'arrowSplit', rotation: 0 };
    if (!up) return { asset: 'arrowSplit', rotation: 90 };
    if (!right) return { asset: 'arrowSplit', rotation: 180 };
    return { asset: 'arrowSplit', rotation: 270 };
  }

  return { asset: 'arrowCrossing', rotation: 0 };
}

/**
 * @param {string} char
 * @returns {Tile | null}
 */
function mapSimpleChar(char) {
  switch (char) {
    case 'p':
      return { type: 'pool' };
    case 'c':
      return { type: 'chalet' };
    case '.':
      return { type: 'empty' };
    default:
      return null;
  }
}

/**
 * @param {string} raw
 * @returns {ResortMap}
 */
export function parseMap(raw) {
  const rawLines = raw.split('\n').filter((line, i, arr) => {
    const isLast = i === arr.length - 1;
    return !(isLast && line === '');
  });

  const grid = rawLines.map((line) => line.split(''));
  const height = grid.length;
  const width = Math.max(...grid.map((row) => row.length));

  const isPath = (row, col) => grid[row]?.[col] === '#';

  /** @type {Tile[][]} */
  const tiles = [];
  /** @type {Cabana[]} */
  const cabanas = [];

  for (let row = 0; row < height; row++) {
    /** @type {Tile[]} */
    const tileRow = [];

    for (let col = 0; col < width; col++) {
      const char = grid[row][col] ?? '.';

      if (char === 'W') {
        const id = `cabana-r${row}-c${col}`;
        cabanas.push({ id, row, col, status: 'available' });
        tileRow.push({ type: 'cabana', cabanaId: id });
        continue;
      }

      if (char === '#') {
        const up = isPath(row - 1, col);
        const down = isPath(row + 1, col);
        const left = isPath(row, col - 1);
        const right = isPath(row, col + 1);
        const { asset, rotation } = classifyPathTile(up, down, left, right);
        tileRow.push({ type: 'path', asset, rotation });
        continue;
      }

      tileRow.push(mapSimpleChar(char) ?? { type: 'empty' });
    }

    tiles.push(tileRow);
  }
  let poolBounds = null;
  let minRow = Infinity, maxRow = -Infinity, minCol = Infinity, maxCol = -Infinity;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (grid[row][col] === 'p') {
        minRow = Math.min(minRow, row);
        maxRow = Math.max(maxRow, row);
        minCol = Math.min(minCol, col);
        maxCol = Math.max(maxCol, col);
      }
    }
  }

  if (minRow !== Infinity) {
    poolBounds = {
      row: minRow,
      col: minCol,
      rowSpan: maxRow - minRow + 1,
      colSpan: maxCol - minCol + 1,
    };
  }

  return { width, height, tiles, cabanas, poolBounds };
}