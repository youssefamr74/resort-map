/**
 * @typedef {'pool' | 'chalet' | 'empty'} SimpleTileType
 */

/**
 * @typedef {'arrowEnd' | 'arrowStraight' | 'arrowCornerSquare' | 'arrowSplit' | 'arrowCrossing'} PathAsset
 */

/**
 * @typedef {Object} PathTile
 * @property {'path'} type
 * @property {PathAsset} asset
 * @property {0 | 90 | 180 | 270} rotation
 */

/**
 * @typedef {Object} CabanaTile
 * @property {'cabana'} type
 * @property {string} cabanaId
 */

/**
 * @typedef {Object} PlainTile
 * @property {SimpleTileType} type
 */

/**
 * @typedef {PathTile | CabanaTile | PlainTile} Tile
 */

/**
 * @typedef {Object} Cabana
 * @property {string} id
 * @property {number} row
 * @property {number} col
 * @property {'available' | 'booked'} status
 */

/**
 * @typedef {Object} PoolBounds
 * @property {number} row
 * @property {number} col
 * @property {number} rowSpan
 * @property {number} colSpan
 */

/**
 * @typedef {Object} ResortMap
 * @property {number} width
 * @property {number} height
 * @property {Tile[][]} tiles
 * @property {Cabana[]} cabanas
 * @property {PoolBounds | null} poolBounds
 */