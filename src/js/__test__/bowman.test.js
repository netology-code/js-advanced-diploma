import Bowman from '../Characters/Bowman';
import Character from '../Character';

describe('Bowman', () => {
  test('should create instance of class Bowman', () => {
    const result = new Bowman(3);

    expect(result).toBeInstanceOf(Bowman);
  });

  test('should create instance of class Character', () => {
    const result = new Bowman(3);

    expect(result).toBeInstanceOf(Character);
  });

  test('should create instance of class Bowman with initial value', () => {
    const result = new Bowman(1);

    expect(result).toEqual({
      type: 'bowman',
      health: 50,
      level: 1,
      attack: 25,
      defence: 25,
    });
  });
});
