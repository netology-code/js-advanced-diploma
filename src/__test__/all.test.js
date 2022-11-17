import positions from '../js/allowedPositions';

test('returns positions', () => {
  const received = positions(2, 2, 8);
  const expected = [3, 1, 10, 11, 9, 4, 0, 18, 20, 16];
  expect(received).toEqual(expected);
});
