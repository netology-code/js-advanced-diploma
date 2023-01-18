import Undead from '../Undead';

test('creating new Undead', () => {
  const expectings = {
    level: 1, attack: 40, defence: 10, health: 50, type: 'undead', attackRange: 1, moveRange: 4, [Symbol.toStringTag]: 'Undead',
  };
  const result = new Undead(1);
  expect(result).toEqual(expectings);
});

test('recreating new Undead, level 3, health 5', () => {
  const expectings = {
    level: 3, attack: 94, defence: 23, health: 5, type: 'undead', attackRange: 1, moveRange: 4, [Symbol.toStringTag]: 'Undead',
  };
  const result = new Undead(3, 5);
  expect(result).toEqual(expectings);
});
