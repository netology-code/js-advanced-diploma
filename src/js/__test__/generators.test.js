import Bowman from '../Characters/Bowman';
import Swordsman from '../Characters/Swordsman';
import Magician from '../Characters/Magician';
import characterGenerator from '../generators';

describe('generators', () => {
  const playerTypes = [Bowman, Swordsman, Magician];
  const playerGenerator = characterGenerator(playerTypes, 2);

  test('should returned characters with type from ["bowman", "swordsman", "magician"]', () => {
    for (let i = 0; i < 100; i++) {
      const character = playerGenerator.next().value;
      expect(['bowman', 'swordsman', 'magician']).toContain(character.type);
    }
  });
});
