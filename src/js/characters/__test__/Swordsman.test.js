import Swordsman from '../Swordsman';

test('creating new Swordsman', () => {
  const expectings = {
    level: 1, attack: 40, defence: 10, health: 50, type: 'swordsman', attackRange: 1, moveRange: 4, [Symbol.toStringTag]: 'Swordsman',
  };
  const result = new Swordsman(1);
  expect(result).toEqual(expectings);
});

test('recreating new Swordsman, level 3, health 5', () => {
  const expectings = {
    level: 3, attack: 94, defence: 23, health: 5, type: 'swordsman', attackRange: 1, moveRange: 4, [Symbol.toStringTag]: 'Swordsman',
  };
  const result = new Swordsman(3, 5);
  expect(result).toEqual(expectings);
});
