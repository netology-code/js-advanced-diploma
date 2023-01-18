import Vampire from '../Vampire';

test('creating new Vampire', () => {
  const expectings = {
    level: 1, attack: 25, defence: 25, health: 50, type: 'vampire', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Vampire',
  };
  const result = new Vampire(1);
  expect(result).toEqual(expectings);
});

test('recreating new Vampire, level 3, health 5', () => {
  const expectings = {
    level: 3, attack: 59, defence: 59, health: 5, type: 'vampire', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Vampire',
  };
  const result = new Vampire(3, 5);
  expect(result).toEqual(expectings);
});
