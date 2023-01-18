import Daemon from '../Daemon';

test('creating new Daemon', () => {
  const expectings = {
    level: 1, attack: 10, defence: 10, health: 50, type: 'daemon', attackRange: 4, moveRange: 1, [Symbol.toStringTag]: 'Daemon',
  };
  const result = new Daemon(1);
  expect(result).toEqual(expectings);
});

test('creating new Daemon, level 3', () => {
  const expectings = {
    level: 3, attack: 23, defence: 23, health: 100, type: 'daemon', attackRange: 4, moveRange: 1, [Symbol.toStringTag]: 'Daemon',
  };
  const result = new Daemon(3);
  expect(result).toEqual(expectings);
});

test('recreating new Daemon, level 3, health 5', () => {
  const expectings = {
    level: 3, attack: 23, defence: 23, health: 5, type: 'daemon', attackRange: 4, moveRange: 1, [Symbol.toStringTag]: 'Daemon',
  };
  const result = new Daemon(3, 5);
  expect(result).toEqual(expectings);
});
