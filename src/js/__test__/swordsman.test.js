import Swordsman from '../Characters/Swordsman';
import Character from '../Character';

describe('Swordsman', () => {
  test('should create instance of class Swordsman', () => {
    const result = new Swordsman(1);

    expect(result).toBeInstanceOf(Swordsman);
  });

  test('should create instance of class Character', () => {
    const result = new Swordsman(1);

    expect(result).toBeInstanceOf(Character);
  });

  test('should create instance of class Swordsman with initial value', () => {
    const result = new Swordsman(1);

    expect(result).toEqual({
      type: 'swordsman',
      health: 50,
      level: 1,
      attack: 40,
      defence: 10,
    });
  });
});
