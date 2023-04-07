import Undead from '../Characters/Undead';
import Character from '../Character';

describe('Undead', () => {
  test('should create instance of class Undead', () => {
    const result = new Undead(1);

    expect(result).toBeInstanceOf(Undead);
  });

  test('should create instance of class Character', () => {
    const result = new Undead(1);

    expect(result).toBeInstanceOf(Character);
  });

  test('should create instance of class Undead with initial value', () => {
    const result = new Undead(1);

    expect(result).toEqual({
      type: 'undead',
      health: 50,
      level: 1,
      attack: 40,
      defence: 10,
      attackRange: 1,
      moveRange: 4,
    });
  });
});
