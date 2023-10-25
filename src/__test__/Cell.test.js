/**
 * @jest-environment jsdom
 */

import Cell from '../js/Cell';

test.each([
  ['swordsman', 4, 1],
  ['bowman', 2, 2],
  ['magician', 1, 4],
  ['undead', 4, 1],
  ['vampire', 2, 2],
  ['daemon', 1, 4],
])('test class Cell with %s css-class', (character, charHikeRange, charAttackRange) => {
  const cellEl = document.createElement('div');
  const charEl = document.createElement('div');
  charEl.classList.add('character', character);
  cellEl.appendChild(charEl);
  const cell = new Cell(cellEl);
  expect(cell.charHikeRange).toEqual(charHikeRange);
  expect(cell.charAttackRange).toEqual(charAttackRange);
});
