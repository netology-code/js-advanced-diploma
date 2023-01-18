import Bowman from '../Bowman';

test('creating new Bowman', () => {
  const expectings = {
    level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
  };
  const result = new Bowman(1);
  expect(result).toEqual(expectings);
});

test('creating new Bowman, level 3', () => {
  const expectings = {
    level: 3, attack: 59, defence: 59, health: 100, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
  };
  const result = new Bowman(3);
  expect(result).toEqual(expectings);
});

test('recreating new Bowman, level 3, health 5', () => {
  const expectings = {
    level: 3, attack: 59, defence: 59, health: 5, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
  };
  const result = new Bowman(3, 5);
  expect(result).toEqual(expectings);
});
