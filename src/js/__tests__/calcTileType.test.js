import { calcTileType } from '../utils';

test('checking the definition of the field type as top-left', () => {
  const tile = calcTileType(0, 8);
  expect(tile).toBe('top-left');
});

test('checking the definition of the field type as top-right', () => {
  const tile = calcTileType(4, 5);
  expect(tile).toBe('top-right');
});

test('checking the definition of the field type as bottom-left', () => {
  const tile = calcTileType(56, 8);
  expect(tile).toBe('bottom-left');
});

test('checking the definition of the field type as bottom-right', () => {
  const tile = calcTileType(63, 8);
  expect(tile).toBe('bottom-right');
});

test('checking the definition of the field type as top', () => {
  const tile = calcTileType(1, 8);
  expect(tile).toBe('top');
});

test('checking the definition of the field type as bottom', () => {
  const tile = calcTileType(44, 7);
  expect(tile).toBe('bottom');
});

test('checking the definition of the field type as right', () => {
  const tile = calcTileType(71, 9);
  expect(tile).toBe('right');
});

test('checking the definition of the field type as left', () => {
  const tile = calcTileType(7, 7);
  expect(tile).toBe('left');
});

test('checking the definition of the field type as center', () => {
  const tile = calcTileType(4, 3);
  expect(tile).toBe('center');
});
