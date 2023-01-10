import { calcTileType } from '../utils';

test.each([
  [0, 8, 'top-left'],
  [1, 8, 'top'],
  [63, 8, 'bottom-right'],
  [7, 7, 'left'],
])(
  ('calcTileType(%i, %i) return %s'),
  (index, boardSize, expecting) => {
    const result = calcTileType(index, boardSize);
    expect(result).toBe(expecting);
  },
);
