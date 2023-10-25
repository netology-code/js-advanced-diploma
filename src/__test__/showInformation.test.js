/**
 * @jest-environment jsdom
 */

import GameController from '../js/GameController';

test('showInformation', () => {
  const charEl = document.createElement('div');
  charEl.dataset.level = 1;
  charEl.dataset.attack = 40;
  charEl.dataset.defence = 10;
  charEl.dataset.health = 50;
  const result = GameController.showInformation(charEl);
  expect(result).toBe('\u{1F396}1 \u{2694}40 \u{1F6E1}10 \u{2764}50');
});
