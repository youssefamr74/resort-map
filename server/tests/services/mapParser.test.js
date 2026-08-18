import { describe, it, expect } from 'vitest';
import { classifyPathTile, parseMap } from '../../src/services/mapParser.js';

describe('classifyPathTile', () => {
  it('returns an isolated arrowEnd tile when there are no path neighbors', () => {
    expect(classifyPathTile(false, false, false, false)).toEqual({
      asset: 'arrowEnd',
      rotation: 0,
    });
  });

  describe('1 neighbor', () => {
    it('up only', () => {
      expect(classifyPathTile(true, false, false, false)).toEqual({
        asset: 'arrowEnd',
        rotation: 180,
      });
    });

    it('down only', () => {
      expect(classifyPathTile(false, true, false, false)).toEqual({
        asset: 'arrowEnd',
        rotation: 0,
      });
    });

    it('left only', () => {
      expect(classifyPathTile(false, false, true, false)).toEqual({
        asset: 'arrowEnd',
        rotation: 90,
      });
    });

    it('right only', () => {
      expect(classifyPathTile(false, false, false, true)).toEqual({
        asset: 'arrowEnd',
        rotation: 270,
      });
    });
  });

  describe('2 neighbors — straight', () => {
    it('up + down', () => {
      expect(classifyPathTile(true, true, false, false)).toEqual({
        asset: 'arrowStraight',
        rotation: 0,
      });
    });

    it('left + right', () => {
      expect(classifyPathTile(false, false, true, true)).toEqual({
        asset: 'arrowStraight',
        rotation: 90,
      });
    });
  });

  describe('2 neighbors — corner', () => {
    it('up + right', () => {
      expect(classifyPathTile(true, false, false, true)).toEqual({
        asset: 'arrowCornerSquare',
        rotation: 0,
      });
    });

    it('right + down', () => {
      expect(classifyPathTile(false, true, false, true)).toEqual({
        asset: 'arrowCornerSquare',
        rotation: 90,
      });
    });

    it('down + left', () => {
      expect(classifyPathTile(false, true, true, false)).toEqual({
        asset: 'arrowCornerSquare',
        rotation: 180,
      });
    });

    it('left + up', () => {
      expect(classifyPathTile(true, false, true, false)).toEqual({
        asset: 'arrowCornerSquare',
        rotation: 270,
      });
    });
  });

  describe('3 neighbors', () => {
    it('missing left', () => {
      expect(classifyPathTile(true, true, false, true)).toEqual({
        asset: 'arrowSplit',
        rotation: 0,
      });
    });

    it('missing up', () => {
      expect(classifyPathTile(false, true, true, true)).toEqual({
        asset: 'arrowSplit',
        rotation: 90,
      });
    });

    it('missing right', () => {
      expect(classifyPathTile(true, true, true, false)).toEqual({
        asset: 'arrowSplit',
        rotation: 180,
      });
    });

    it('missing down', () => {
      expect(classifyPathTile(true, false, true, true)).toEqual({
        asset: 'arrowSplit',
        rotation: 270,
      });
    });
  });

  it('4 neighbors returns arrowCrossing', () => {
    expect(classifyPathTile(true, true, true, true)).toEqual({
      asset: 'arrowCrossing',
      rotation: 0,
    });
  });
});

describe('parseMap', () => {
  // c . . . c
  // . # # . .
  // . p p . .
  // . p p . .
  // W . . . W
  const rawMap = ['c...c', '.##..', '.pp..', '.pp..', 'W...W'].join('\n');

  it('computes width and height from the grid', () => {
    const map = parseMap(rawMap);
    expect(map.width).toBe(5);
    expect(map.height).toBe(5);
  });

  it('produces the correct tile type (and shape) per cell', () => {
    const { tiles } = parseMap(rawMap);

    expect(tiles).toEqual([
      [
        { type: 'chalet' },
        { type: 'empty' },
        { type: 'empty' },
        { type: 'empty' },
        { type: 'chalet' },
      ],
      [
        { type: 'empty' },
        { type: 'path', asset: 'arrowEnd', rotation: 270 },
        { type: 'path', asset: 'arrowEnd', rotation: 90 },
        { type: 'empty' },
        { type: 'empty' },
      ],
      [{ type: 'empty' }, { type: 'pool' }, { type: 'pool' }, { type: 'empty' }, { type: 'empty' }],
      [{ type: 'empty' }, { type: 'pool' }, { type: 'pool' }, { type: 'empty' }, { type: 'empty' }],
      [
        { type: 'cabana', cabanaId: 'cabana-r4-c0' },
        { type: 'empty' },
        { type: 'empty' },
        { type: 'empty' },
        { type: 'cabana', cabanaId: 'cabana-r4-c4' },
      ],
    ]);
  });

  it('gives cabanas unique ids that follow the cabana-r{row}-c{col} pattern', () => {
    const { cabanas } = parseMap(rawMap);

    expect(cabanas).toEqual([
      { id: 'cabana-r4-c0', row: 4, col: 0, status: 'available' },
      { id: 'cabana-r4-c4', row: 4, col: 4, status: 'available' },
    ]);

    for (const cabana of cabanas) {
      expect(cabana.id).toMatch(/^cabana-r\d+-c\d+$/);
      expect(cabana.id).toBe(`cabana-r${cabana.row}-c${cabana.col}`);
    }

    const ids = cabanas.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('computes poolBounds for a rectangular pool block', () => {
    const map = parseMap(rawMap);
    expect(map.poolBounds).toEqual({ row: 2, col: 1, rowSpan: 2, colSpan: 2 });
  });

  it('poolBounds is null when there is no pool in the map', () => {
    const noPoolRaw = ['c.W', '.#.', '..c'].join('\n');
    const map = parseMap(noPoolRaw);
    expect(map.poolBounds).toBeNull();
  });
});
