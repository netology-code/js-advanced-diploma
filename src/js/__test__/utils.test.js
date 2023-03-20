import { calcTileType } from '../utils';

describe('utils', () => {
  test.each([
    [0, 8, 'top-left'],
    [4, 5, 'top-right'],
    [2, 8, 'top'],
    [63, 8, 'bottom-right'],
    [6, 3, 'bottom-left'],
    [14, 4, 'bottom'],
    [11, 4, 'right'],
    [7, 7, 'left'],
    [8, 5, 'center'],
  ])('position with index %i of board size: %i, should be: %s', (index, boardSize, result) => {
    expect(calcTileType(index, boardSize)).toBe(result);
  });
});
