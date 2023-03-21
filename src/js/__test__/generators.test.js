import Bowman from '../Characters/Bowman';
import Swordsman from '../Characters/Swordsman';
import Magician from '../Characters/Magician';
import { characterGenerator, generateTeam } from '../generators';

describe('generators', () => {
  const playerTypes = [Bowman, Swordsman, Magician];
  const playerGenerator = characterGenerator(playerTypes, 2);

  test('should returned characters with type from ["bowman", "swordsman", "magician"]', () => {
    for (let i = 0; i < 100; i++) {
      const character = playerGenerator.next().value;
      expect(['bowman', 'swordsman', 'magician']).toContain(character.type);
    }
  });

  test.each([
    [4, 5],
    [1, 2],
    [8, 1],
  ])('should create %i characters with level not greater than %i', (count, level) => {
    const team = generateTeam(playerTypes, level, count);

    expect(team.characters).toHaveLength(count);

    for (const character of team.characters) {
      expect(character.level).toBeLessThanOrEqual(level);
    }
  });
});
