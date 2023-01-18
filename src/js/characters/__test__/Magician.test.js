import Magician from '../Magician';

test('creating new Magician', () => {
  const expectings = {
    level: 1, attack: 10, defence: 40, health: 50, type: 'magician', attackRange: 4, moveRange: 1, [Symbol.toStringTag]: 'Magician',
  };
  const result = new Magician(1);
  expect(result).toEqual(expectings);
});

test('recreating new Magician, level 3, health 5', () => {
  const expectings = {
    level: 3, attack: 23, defence: 94, health: 5, type: 'magician', attackRange: 4, moveRange: 1, [Symbol.toStringTag]: 'Magician',
  };
  const result = new Magician(3, 5);
  expect(result).toEqual(expectings);
});
