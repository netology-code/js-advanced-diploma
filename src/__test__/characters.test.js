import Character from '../js/Character';
import Bowman from '../js/characters/Bowman';
import Magician from '../js/characters/Magician';
import Swordsman from '../js/characters/Swordsman';
import { characterGenerator, generateTeam } from '../js/generators';

describe('test generateTeam', () => {
  it('test constructor Character', () => {
    try {
      /* eslint-disable-next-line */
      const character = new Character();
    } catch (error) {
      expect(error).toEqual(new Error('Конструктор new Character() запрещен для вызова!'));
    }
  });
  it('test constructor Bowman', () => {
    try {
      /* eslint-disable-next-line */
      const character = new Bowman();
    } catch (error) {
      expect(error).not.toEqual(new Error('Конструктор new Character() запрещен для вызова!'));
    }
  });
});

test.each([
  [Bowman, 40, 25],
  [Magician, 20, 40],
  [Swordsman, 60, 10],
])('test class %s', (ClassName, attack, defence) => {
  const character = new ClassName();
  expect([character.attack, character.defence]).toEqual([attack, defence]);
});

test('test characterGenerator', () => {
  const playerGenerator = characterGenerator([Bowman, Swordsman, Magician], 2);
  for (let i = 0; i < 8; i += 1) {
    const character = playerGenerator.next().value;
    expect(['bowman', 'swordsman', 'magician']).toContain(character.type);
  }
});

describe('test generateTeam', () => {
  const team = generateTeam([Bowman, Swordsman, Magician], 3, 5);
  it('number of characters', () => {
    expect(team.characters.length).toBe(5);
  });
  const arrayLevels = team.characters.map((el) => el.level);
  it('character max level', () => {
    expect(Math.max(...arrayLevels) <= 3).toBeTruthy();
  });
  it('character min level', () => {
    expect(Math.min(...arrayLevels) > 0).toBeTruthy();
  });
});
