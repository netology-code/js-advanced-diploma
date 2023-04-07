import Bowman from '../Characters/Bowman';
import Swordsman from '../Characters/Swordsman';
import Magician from '../Characters/Magician';
import characterGenerator from '../generators';
import Team from '../Team';

describe('Team', () => {
  const playerTypes = [Bowman, Swordsman, Magician];

  test('should rmove all characters from team', () => {
    const team = new Team(playerTypes, characterGenerator);
    team.addRandomChar(1, 3);
    team.clear();

    expect(team.characters).toHaveLength(0);
  });

  test.each([
    [4, 5],
    [1, 2],
    [8, 1],
  ])('should create Team from %i characters with level not greater than %i', (count, level) => {
    const team = new Team(playerTypes, characterGenerator);
    team.addRandomChar(level, count);

    expect(team.characters).toHaveLength(count);
    expect(team.isEmpty()).toBeFalsy();
    expect(team.count).toBe(count);

    for (const character of team.characters) {
      expect(character.level).toBeLessThanOrEqual(level);
    }
  });
});
