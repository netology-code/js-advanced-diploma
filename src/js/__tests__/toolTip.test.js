import { tooltipMessage } from '../utils';

test('проверка отображения информации о персонаже', () => {
  const expected = '🎖10 ⚔10 🛡10 ❤10';
  const received = tooltipMessage({
    level: 10, attack: 10, defence: 10, health: 10,
  });
  expect(received).toBe(expected);
});
