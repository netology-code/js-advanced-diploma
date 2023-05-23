import { calcHealthLevel, calcTileType } from '../utils';

test.each([
  [0, 3, 'top-left'],
  [1, 3, 'top'],
  [2, 3, 'top-right'],
  [3, 3, 'left'],
  [4, 3, 'center'],
  [5, 3, 'right'],
  [6, 3, 'bottom-left'],
  [7, 3, 'bottom'],
  [8, 3, 'bottom-right'],
])(
  ('Функция calcTileType должна вернуть корректное значение'),
  (index, boardsize, result) => {
    expect(calcTileType(index, boardsize)).toBe(result);
  },
);

test.each([
  [10, 'critical'],
  [40, 'normal'],
  [60, 'high'],
])(('Функция calcHealthLevel должна вернуть корректное значение'), (health, result) => {
  expect(calcHealthLevel(health)).toBe(result);
});
