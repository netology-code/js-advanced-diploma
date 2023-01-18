import { calcTileType, calcHealthLevel } from '../utils';

test.each([
  [0, 8, 'top-left'],
  [1, 8, 'top'],
  [63, 8, 'bottom-right'],
  [7, 7, 'left'],
  [9, 8, 'center'],
  [62, 8, 'bottom'],
])(
  ('calcTileType(%i, %i) return %s'),
  (index, boardSize, expecting) => {
    const result = calcTileType(index, boardSize);
    expect(result).toBe(expecting);
  },
);

test.each([
  [10, 'critical'],
  [40, 'normal'],
  [100, 'high'],
])(
  ('calcHealthLevel(%i) return %s'),
  (health, expecting) => {
    const result = calcHealthLevel(health);
    expect(result).toBe(expecting);
  },
);
