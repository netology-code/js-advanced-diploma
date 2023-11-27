import { calcTileType } from '../js/utils';

const boardSize = 8;
test.each([
  [0, 'top-left'],
  [7, 'top-right'],
  [56, 'bottom-left'],
  [63, 'bottom-right'],
  [4, 'top'],
  [32, 'left'],
  [39, 'right'],
  [60, 'bottom'],
  [36, 'center'],
])('test calcTileType with index %i', (index, expected) => {
  const result = calcTileType(index, boardSize);
  expect(result).toEqual(expected);
});
