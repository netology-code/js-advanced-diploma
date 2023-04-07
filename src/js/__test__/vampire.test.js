import Vampire from '../Characters/Vampire';
import Character from '../Character';

describe('Vampire', () => {
  test('should create instance of class Vampire', () => {
    const result = new Vampire(1);

    expect(result).toBeInstanceOf(Vampire);
  });

  test('should create instance of class Character', () => {
    const result = new Vampire(1);

    expect(result).toBeInstanceOf(Character);
  });

  test('should create instance of class Vampire with initial value', () => {
    const result = new Vampire(1);

    expect(result).toEqual({
      type: 'vampire',
      health: 50,
      level: 1,
      attack: 25,
      defence: 25,
      attackRange: 2,
      moveRange: 2,
    });
  });
});
