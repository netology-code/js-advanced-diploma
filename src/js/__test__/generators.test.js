import Bowman from '../characters/Bowman';
import { characterGenerator, generateTeam } from '../generators';

test('characterGenerate', () => {
  const playerGenerator = characterGenerator([Bowman], 1);
  const result = new Array();
  result.push(playerGenerator.next().value);
  result.push(playerGenerator.next().value);
  const expectings = {
    level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
  };
  expect(result).toContainEqual(expectings);
});

test('generateTeam', () => {
  const result = generateTeam([Bowman], 1, 3);
  const expectings = [
    {
      level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
    },
    {
      level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
    },
    {
      level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
    },
  ];
  expect(result.characters).toEqual(expectings);
});

test('generateTeam', () => {
  const result = generateTeam([Bowman], 1, 3);
  result.characters = [
    {
      level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
    },
    {
      level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
    },
    {
      level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
    },
  ];
  const expectings = [
    {
      level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
    },
    {
      level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
    },
    {
      level: 1, attack: 25, defence: 25, health: 50, type: 'bowman', attackRange: 2, moveRange: 2, [Symbol.toStringTag]: 'Bowman',
    },
  ];
  expect(result.characters).toEqual(expectings);
});
